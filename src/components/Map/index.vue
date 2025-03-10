<template>
  <div
    id="map"
    :style="{ height: heightProp, width: widthProp }"
  ></div>
</template>
<script>
import Leaflet from 'leaflet'
import positionIcon from '@/assets/imgs/map/position.png'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'LeafletMap',
  components: {},
  props: {
    positionListProp: {
      type: Array,
      default: () => {
        return [
          // {
          //   latitude: 16.46993444732106,
          //   longitude: 107.57705380517633,
          //   siteName: '',
          // },
        ]
      },
    },
    positionCenter: {
      type: Object,
      default: () => {
        const center = this.$config.VITE_APP_MAP_CENTER_POINT.split(',')
        return {
          latitude: center[0],
          longitude: center[1],
        }
      },
    },
    zoomProp: {
      type: Number,
      default: 15,
    },
    heightProp: {
      type: String,
      default: '500px',
    },
    widthProp: {
      type: String,
      default: '500px',
    },
  },
  data() {
    return {
      tileLink: this.$config.VITE_APP_MAP_LINK,
      layers: this.$config.VITE_APP_MAP_LAYER,
    }
  },
  mounted() {
    this.map = Leaflet.map('map')
    const wmsLayer = Leaflet.tileLayer.wms(this.tileLink, {
      layers: this.layers,
      format: 'image/png',
      crs: Leaflet.CRS.EPSG4326,
      transparent: false,
    })
    this.map.addLayer(wmsLayer)
    this.map.setView([this.positionCenter.latitude, this.positionCenter.longitude], this.zoomProp)
    this.createMarker()
  },
  methods: {
    createMarker() {
      const customIcon = Leaflet.icon({
        iconUrl: positionIcon,
      })
      if (this.positionListProp && this.positionListProp.length > 0) {
        this.positionListProp.forEach(val => {
          if (val.latitude && val.longitude) {
            const marker = Leaflet.marker([val.latitude, val.longitude], {
              icon: customIcon,
            }).addTo(this.map)
            marker.on('mouseover', () => {
              marker.bindTooltip(val.siteName, { offset: [0, 0] }).openTooltip()
            })

            marker.on('mouseout', () => {
              marker.closeTooltip()
            })
          }
        })
      }
    },
  },
}
</script>
<style scoped>
:deep(.leaflet-control-attribution) {
  display: none;
}
</style>
