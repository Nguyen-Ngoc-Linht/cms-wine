<template>
  <div v-loading="loading">
    <div id="container-map">
      <div id="mapRoute"></div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'
import View from 'ol/View'
import { defaults as defaultControls, FullScreen } from 'ol/control'
import { defaults as defaultInteractions, DragRotateAndZoom, Select } from 'ol/interaction'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import XYZ from 'ol/source/XYZ'
import Point from 'ol/geom/Point'
import { Style, Icon, Text, Fill } from 'ol/style'
import { fromLonLat, toLonLat } from 'ol/proj'
import TileWMS from 'ol/source/TileWMS'
import iconPoint from '@/assets/imgs/map/position.png'
import { apiMapMarker } from '@/api/dashboard'

export default {
  name: 'MiniMap',
  props: {
    route: {
      type: Object,
      default: () => {},
    },
    station: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      mapInstance: null,
      popup: null,
      selectedIcon: null,
      zoom: 16,
      minZoom: 7,
      maxZoom: 16,
      centerLongitude: 106.012018,
      centerLatitude: 20.291034,
      longitude: 0,
      latitude: 0,
      markers: [],
      createMark: false,
      markNote: '',
      loading: true,
      vectorSource: null,
      extent: [96.6395599365234, 1.72021598815918, 120.923733520508, 26.6497142791748],
    }
  },
  computed: {
    routeStation() {
      return [this.route, this.station]
    },
  },
  watch: {
    routeStation(val, oldVal) {
      this.loading = true
      this.renderMap()
    },
  },
  methods: {
    initMap(googleMapLayer) {
      if (this.routeStation[1]) {
        this.zoom = 16
        this.centerLongitude = this.station?.longitude || 106.012018
        this.centerLatitude = this.station?.latitude || 20.291034
      } else {
        this.zoom = 11
        this.centerLongitude = this.route?.longitude || 106.012018
        this.centerLatitude = this.route?.latitude || 20.291034
      }

      document.getElementById('mapRoute').innerHTML = ''
      document.getElementById('mapRoute').style.height = 437 + 'px'
      const divContainerMap = document.getElementById('container-map')
      const popTag = document.getElementById('popup')
      if (!popTag) {
        const divPopup = document.createElement('div')
        divPopup.classList.add('ol-popup')
        divPopup.setAttribute('id', 'popup')
        divPopup.style.visibility = 'hidden'
        divContainerMap.appendChild(divPopup)
      }
      return new Map({
        target: 'mapRoute',
        controls: defaultControls().extend([new FullScreen(), new DragRotateAndZoom()]),
        layers: [googleMapLayer],
        view: new View({
          projection: 'EPSG:4326',
          center: [this.centerLongitude, this.centerLatitude],
          zoom: this.zoom,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          rotation: 0,
          extent: this.extent,
        }),
      })
    },

    createGoogleMapLayer() {
      // return new TileLayer({
      //   source: new XYZ({ url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga' })
      // })
      return new TileLayer({
        source: new TileWMS({
          url:
            this.$config.VITE_APP_MAP_LINK +
            '/geoserver/GSTP/wms?service=WMS&version=1.1.0&request=GetMap&layers=GSTP%3AVN&bbox=96.4395599365234%2C1.52021598815918%2C121.123733520508%2C26.8497142791748&width=256&height=256&styles=&format=application/openlayers',
          params: {
            LAYERS: 'VN',
            TILED: true,
            SRS: 'EPSG:4326',
            env: `highlight:${this.route?.highlightCode}`,
          },
          serverType: 'geoserver',
          transition: 0,
        }),
      })
    },

    createIconLayer(icons) {
      this.vectorSource = new VectorSource({
        features: [],
      })
      if (icons?.length) {
        icons.forEach((icon, index) => {
          this.addIcon(icon)
        })
      }
      if (this.station) {
        this.addIcon(this.station, true)
      }
      return new VectorLayer({
        source: this.vectorSource,
      })
    },

    addIcon(icon, isStation = false) {
      const idx = icon.id
      const styleText = new Text({
        text: icon.name,
        scale: 1.5,
        offsetX: 0,
        offsetY: -12,
        fill: new Fill({
          color: '#000',
        }),
      })

      if (this.isValidLngLat(icon.longitude, icon.latitude)) {
        // long, lat
        const newFeature = new Feature({
          geometry: new Point([icon.longitude, icon.latitude]),
          name: icon.id,
          isStation,
        })
        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 0.75],
            src: iconPoint,
            scale: 1.0,
          }),
          text: isStation ? styleText : null,
        })
        newFeature.setStyle(iconStyle)
        this.vectorSource.addFeature(newFeature)
      }
    },

    handlePointerMove(event) {
      const pixel = this.mapInstance.getEventPixel(event.originalEvent)
      const hit = this.mapInstance.hasFeatureAtPixel(pixel)
      this.mapInstance.getTargetElement().style.cursor = hit ? 'pointer' : ''
    },

    async handleMapClick(event) {
      this.selectedIcon = this.mapInstance.forEachFeatureAtPixel(event.pixel, feature => {
        return feature
      })
      if (this.selectedIcon) {
        const typeSelectedFeature = this.selectedIcon.getGeometry().getType()
        const isStation = this.selectedIcon.get('isStation')
        if (typeSelectedFeature == 'Point' && !isStation) {
          const selectedId = this.selectedIcon.get('name')
          const featureToRemove = this.vectorSource
            .getFeatures()
            .find(i => i.get('name') === selectedId)
          this.vectorSource.removeFeature(featureToRemove)
          this.removeRouteMarker(selectedId)
        }
      } else {
        const coords = event.coordinate // Convert from map projection to lon/lat
        const longitude = coords[0].toFixed(6)
        const latitude = coords[1].toFixed(6)

        await this.addRouteMarker(longitude, latitude)
      }
    },

    async renderMap() {
      const googleMapLayer = this.createGoogleMapLayer()
      this.mapInstance = this.initMap(googleMapLayer)

      this.getRouteMarker()
      this.mapInstance.on('pointermove', this.handlePointerMove)
      this.mapInstance.on('click', this.handleMapClick)
      this.loading = false
    },

    isValidLngLat(lng, lat) {
      if (lng < -180 || lng > 180) {
        return false
      } else if (lat < -90 || lat > 90) {
        return false
      }
      return true
    },

    getRouteMarker() {
      if (this.routeStation[0]) {
        const data = {
          method: 'GET',
          arguments: {
            routeId: this.route.id,
          },
        }
        apiMapMarker(data).then(res => {
          const iconLayer = this.createIconLayer(res?.data || [])
          this.mapInstance.addLayer(iconLayer)
        })
      }
    },
    async addRouteMarker(longitude, latitude) {
      const data = {
        method: 'ADD',
        arguments: {
          routeId: this.route.id,
          longitude,
          latitude,
        },
      }
      apiMapMarker(data).then(res => {
        const icon = {
          id: res.data,
          longitude,
          latitude,
        }
        this.addIcon(icon)
      })
    },
    removeRouteMarker(id) {
      const data = {
        method: 'DELETE',
        arguments: {
          coordinatesId: id,
        },
      }
      apiMapMarker(data)
    },
  },
  mounted() {
    this.renderMap()
  },
}
</script>

<style scoped>
#container-map {
  position: relative;
}

#mapRoute {
  height: 407px;
  width: 100%;
  background: #fff;
  border: 1px solid #ebebec;
  border-radius: 2px;
}

.longlat {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 9;
}
</style>
<style>
.ol-popup {
  position: absolute;
  min-width: 300px;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  bottom: 47px;
  left: -48px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
</style>
