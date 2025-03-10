<template>
  <div
    :ref="'container_' + cameraReal"
    v-loading="loading"
    class="main-video main-video-playback-custom camera camera-custom milestone-playback-component"
    :class="{ zoomVideo: zoom }"
  >
    <div
      v-if="loadingShow"
      class="recording"
    />
    <div class="header-info-camera">
      <div class="name-cam">{{ cameraConfig ? cameraConfig.name : '' }}</div>
    </div>
    <div
      class="video-wraper"
      :class="{ loading: loading }"
    >
      <canvas
        ref="canvasRender"
        class="canvas-render"
      />
    </div>
    <!-- thanh tua video -->
    <div
      v-if="!loading"
      class="control-custom-bar-cam"
    >
      <ControllerBarCustom
        :key="flagKeyInterval"
        :camera-config="cameraConfig"
        :height-video="heightVideo"
        :flag-change-stream="flagChangeStream"
        :time-change-cam="timeChangeCam"
        :number-grid="numberGrid"
        :full-screen-prop="fullScreenProp"
        :loading-success="loadingSuccess"
        :res-sequences-interval="resSequencesInterval"
        :start-time-control="startTimeProp"
        :end-time-control="endTimeProp"
        @handleChangeProgressBarTimeCustom="handleChangeProgressBarTimeCustom"
        @stopAndRun="stopAndRun"
        @zoomVideo="zoomVideo"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MilestoneConnect from '@/milestone/connect'
import { useCommonStore } from '@/store'
import { cloneDeep } from 'lodash-unified'
import ControllerBarCustom from './ControllerBarVideo'
import axios from 'axios'

const commonStore = useCommonStore()
const MilestoneConnectClass = new MilestoneConnect()

export default {
  components: { ControllerBarCustom },
  directives: {},
  props: {
    cameraReal: {
      type: String,
      default: '5351070b-9158-4f03-bd14-18a90ce8df89',
    },
    startTimeProp: {
      type: [String, Number],
      default: null,
    },
    endTimeProp: {
      type: [String, Number],
      default: null,
    },
    fullScreenProp: {
      type: Boolean,
      default: false,
    },
    isFullLayout: {
      type: Boolean,
      default: false,
    },
    isFullscreen: {
      type: Boolean,
      default: false,
    },
    screenShot: {
      type: Boolean,
      default: false,
    },
    recording: {
      type: Boolean,
      default: false,
    },
    zoomAndFull: {
      type: Boolean,
      default: false,
    },
    isMulti: {
      type: Boolean,
      default: false,
    },
    cameraConfig: {},
    changeGridCam: {
      type: Number,
      default: 1,
    },
    number: {
      type: Number,
      default: 1,
    },
    widthCustom: {
      type: Number,
      default: 700,
    },
    heightCustom: {
      type: Number,
      default: 567,
    },
    type: {
      type: String,
      default: 'Playback',
    },
    isShowWindow: {
      type: Boolean,
      default: true,
    },
    showPreNext: {
      type: Boolean,
      default: true,
    },
    showThumb: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      startTime: moment().subtract(1, 'hour').valueOf(),
      endTime: moment().valueOf(),
      flagPlayNext: false, // Trạng thái là next hay play
      flagPlayPre: false, // Trạng thái là prev hay play
      loading: true,
      flagVideo: true,
      loadingTakeImage: false,
      timeUpdate: null, // thời gian update frame
      timeTakeImage: null,
      imageName: null,
      attachContainerClick: true,
      playbackControllerId: null,
      oneUpdateStatus: false,
      streamRequest: null,
      videoId: null,
      heightRes: 0,
      widthRes: 0,
      timeChangeCam: null,
      // cameraConfig: null,
      flagChangeStream: 10,
      loadingSuccess: 10,
      resSequencesInterval: [],
      widthResStatus: false,
      intervelProgress: 0,
      playStop: false,
      visible: false,
      isDirectStream: false,
      //
      isPause: true,
      timeProgress: 0,
      flagKeyInterval: 0,
      timeProgressBar: 0,
      sizeProgress: 0,
      // control cam
      zoom: false,
      showPtz: false,
      // state cam render
      drawing: false,
      imageURL: null,
      videoController: null,
      image: null,
      totalTime: 0,
      canvasContext: null,
      videoConnectionObserver: null,
      canvas: null,
      record: false,
      startTimeRecord: null,
      loadingShow: false,
      intelId: 0,
      handleLoad: false,
      currentWidth: 0,
      heightVideo: 0,
      numberGrid: 0,
      fullScreen: false,
      comprLevelDefault: 50,
    }
  },
  computed: {
    XPMobileSDK() {
      return XPMobileSDK
    },
  },
  watch: {
    width: {
      handler: function () {
        if (this.handleLoad) {
          this.handleChange()
        }
        const container = this.$refs['container_' + this.cameraReal]
        container.style.height = this.height + 'px'
        container.style.width = this.width + 'px'
      },
      deep: true,
    },
    timeUpdate(time, oldTime) {
      if (time != oldTime) {
        const timeUpdate = moment(time).valueOf()
        const currentTime = moment().valueOf()
        if (timeUpdate > currentTime) {
          this.stopAndRun(0)
        }
      }
    },
    fullScreen(val) {
      this.$emit('update:isFullscreen', val)
    },
    screenShot(val, old) {
      this.getThumbnailByTime()
    },
    recording(isRecording) {
      this.handleRecording(isRecording)
    },
  },

  created() {
    this.height = this.heightCustom
    this.width = this.widthCustom
    this.totalTime = this.endTime - this.startTime
    this.numberGrid = this.number
    if (this.numberGrid === 1) {
      this.comprLevelDefault = 90
    }
    if (this.numberGrid === 4) {
      this.comprLevelDefault = 70
    }
    if (this.numberGrid === 9) {
      this.comprLevelDefault = 50
    }
  },
  beforeUnmount() {
    if (this.streamRequest) {
      this.XPMobileSDK.cancelRequest(this.streamRequest)
      this.streamRequest = null
    }
  },
  unmounted() {
    if (this.videoId) {
      this.closeStream()
    }
  },
  mounted() {
    if (this.fullScreenProp) {
      this.zoomVideo()
    }
    if (this.isFullscreen) {
      this.zoomVideo()
    }
    const container = this.$refs['container_' + this.cameraReal]
    container.style.height = this.height + 'px'
    container.style.width = this.width + 'px'
    if (this.cameraConfig && this.cameraConfig.cameraStatus === 'STOP') {
      this.isConnected = false
    }
    if (this.startTimeProp) {
      this.startTime = cloneDeep(this.startTimeProp)
    }
    if (!commonStore.loginMilestone) {
      MilestoneConnectClass.handleAddMethodCallback(this.handleRenderVideo)
    } else {
      this.handleRenderVideo()
    }
  },
  methods: {
    async init() {},

    closeStream() {
      this.XPMobileSDK.CloseStream(
        {
          VideoId: this.videoId,
        },
        {},
        {}
      )
    },
    handlePlayAndPause(pause) {
      if (pause) {
        this.stopAndRun(0)
        this.isPause = true
        this.flagPlayNext = false
        this.flagPlayPre = false
      } else {
        const bar = document.getElementById('defaultBar_' + this.cameraReal)
        this.isPause = false
        if (this.timeProgressBar >= bar.offsetWidth) {
          this.handleChangeStreamSpeed(this.startTime)
        } else {
          this.stopAndRun(1)
        }
      }
    },
    handlePause(value) {
      if (!value) {
        this.isPause = false
        this.stopAndRun(1)
      } else {
        this.isPause = true
        this.stopAndRun(0)
      }
    },
    RequestStreamParams(Fps) {
      const param = {
        CameraId: this.cameraReal,
        ByteOrder: 'LittleEndian',
        DestWidth: this.width,
        DestHeight: this.height,
        SignalType: this.type /* 'Live' or 'Playback'*/,
        MethodType: 'Push' /* 'Pull'*/,
        Fps: Fps || 25, // This doesn't work for Pull mode, but we have to supply it anyway to keep the server happy
        ComprLevel: this.comprLevelDefault,
        KeyFramesOnly: 'No' /* 'Yes'*/, // Server will give only key frame thumb nails. This will reduce FPS
        RequestSize: 'Yes',
        StreamType: 'Transcoded',
      }
      return param
    },
    offset(el) {
      var rect = el.getBoundingClientRect()
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    },

    async handleChangeProgressBarTime($event, poisitionBar = null) {
      this.isPause = true
      this.flagPlayNext = false
      this.flagPlayPre = false
      this.stopAndRun(0)
      const bar = document.getElementById('defaultBar_' + this.cameraReal)
      const progressBar = document.getElementById('progressBar_' + this.cameraReal)
      const position = this.offset(bar)
      const pos = ($event.pageX - position.left) / bar.offsetWidth
      // ví trí thanh bar hiện tại
      this.timeProgressBar = pos * bar.offsetWidth
      this.currentWidth = pos * bar.offsetWidth

      progressBar.style.width = this.timeProgressBar + 'px'
      // thời gian gửi lên server của vị trí hiện tại
      const totalTime = cloneDeep(this.totalTime)
      this.timeProgress = Number((totalTime * pos).toFixed(3))
      const timeClick = Math.round(this.startTime + this.timeProgress)
      this.handleChangeStreamSpeed(timeClick)
    },

    handleChangeProgressBarTimeCustom(data) {
      this.startTime = data.startDate
      this.handleChangeStreamSpeed(data.startDate, data.speed)
    },

    handlePTZ(direct) {
      const temConnect = this.videoController
      temConnect.cameraId = this.cameraReal
      this.XPMobileSDK.ptzMove(temConnect, direct)
    },

    isShowPtz() {
      this.showPtz = !this.showPtz
    },
    // take photo
    switchLivePlayback(idCam) {
      const data = {
        CameraId: idCam,
        type: 'live',
        zoom: this.zoom,
      }
      this.$emit('switchLivePlayback', data)
    },
    DataURIToBlob(dataURI) {
      const splitDataURI = dataURI.split(',')
      const byteString =
        splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
      const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

      const ia = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], { type: mimeString })
    },
    // ket thuc
    handleChange() {
      this.loading = true
      const self = this
      const container = this.$refs['container_' + this.cameraReal]
      const params = {
        VideoId: this.videoId,
        DestWidth: this.width,
        DestHeight: this.height,
      }
      container.style.width = this.width + 'px'
      container.style.height = this.height + 'px'
      try {
        this.XPMobileSDK.ChangeStream(params, async () => {
          await self.delay(500)
          if (this.handleLoad) {
            self.loading = false
          }
        })
      } catch {
        if (this.handleLoad) {
          self.loading = false
        }
      }
    },

    handleChangeStreamSpeed(time, speed = 0) {
      const self = this
      const params = {
        VideoId: this.videoId,
        SeekType: 'Time',
        Time: time,
      }
      this.XPMobileSDK.ChangeStream(params, async () => {
        // await self.delay(500)
        this.timeChangeCam = time
        self.stopAndRun(speed)
      })
    },
    stopAndRun(speed, time = null) {
      if (speed != 0) {
        this.isPause = false
        if (speed == 1) {
          this.flagPlayNext = true
          this.flagPlayPre = false
        } else if (speed == -1) {
          this.flagPlayNext = false
          this.flagPlayPre = true
        }
      } else {
        this.isPause = true
      }
      const params = {
        VideoId: this.videoId,
        Speed: speed,
      }
      this.XPMobileSDK.ChangeStream(
        params,
        res => {},
        async e => {}
      )
    },

    handleTimeBar(timeCurrent, status) {
      let diffDate = timeCurrent - this.startTime
      if (diffDate > this.totalTime) {
        diffDate = this.totalTime
      }
      if (diffDate < 0) {
        diffDate = 0
      }
      const bar = document.getElementById('defaultBar_' + this.cameraReal)
      const progressBar = document.getElementById('progressBar_' + this.cameraReal)
      this.sizeProgress = bar.offsetWidth
      this.timeProgress = diffDate
      if (this.totalTime > 0) {
        this.timeProgressBar = parseInt((bar.offsetWidth * diffDate) / this.totalTime)
        progressBar.style.width = this.timeProgressBar + 'px'
      }
    },
    closeZoomVideo() {
      this.$emit('closeZoomVideo', true)
    },
    async zoomVideo() {
      const container = this.$refs['container_' + this.cameraReal]
      let params = {}
      const self = this
      if (!this.zoom) {
        this.comprLevelDefault = 90
        params = {
          VideoId: this.videoId,
          DestWidth: window.innerWidth,
          DestHeight: window.innerHeight,
        }
        console.log(container, 'container')
        if (container) {
          this.XPMobileSDK.ChangeStream(params, async () => {
            this.zoom = true
            container.style.height = window.innerHeight + 'px'
            container.style.width = window.innerWidth + 'px'
            container.style.zIndex = 9999
          })
        }
      } else {
        container.style.visibility = 'hidden'
        params = {
          VideoId: this.videoId,
          DestWidth: this.width,
          DestHeight: this.height,
        }
        if (container) {
          this.XPMobileSDK.ChangeStream(params, () => {
            this.zoom = false
            self.delay(800)
            container.style.height = this.height + 'px'
            container.style.width = this.width + 'px'
            container.style.zIndex = 9
            container.style.visibility = 'visible'
          })
        }
      }
      if (!this.fullScreen) {
        this.fullScreen = true
      } else {
        this.fullScreen = false
      }
    },
    SequencesIntervalError(err) {
      console.log(err)
    },
    SequencesIntervalSuccess(result) {
      this.resSequencesInterval = result
    },

    handleRenderVideo() {
      this.loading = true
      if (this.fullScreenProp) {
        this.height = window.innerHeight
        this.width = window.innerWidth
      }
      const container = this.$refs['container_' + this.cameraReal]
      if (container) {
        container.style.height = this.height + 'px'
        container.style.width = this.width + 'px'
      }
      this.oneUpdateStatus = false
      this.widthResStatus = false

      if (this.isDirectStream) {
        const self = this
        this.loading = false
        this.XPMobileSDK.getAllViews(function (items) {
          for (var i = 0; i < items[0].Items[0].Items[0].Items.length; i++) {
            if (self.cameraReal == items[0].Items[0].Items[0].Items[i].Id) {
              const videoElement = self.$refs.videoRender
              // videoElement.width = self.width
              // videoElement.height = self.height
              videoElement.cameraId = items[0].Items[0].Items[0].Items[i].Id
              videoElement.name = items[0].Items[0].Items[0].Items[i].Name
              videoElement.dispatchEvent(new CustomEvent('start'))
              videoElement.addEventListener('fallback', event => {
                let player =
                  event.target.shadow.lastElementChild.getElementsByClassName('player')[0]
                let errorMsg = document.createElement('div')
                errorMsg.innerHTML = 'Could not start direct streaming.'
                player && player.parentNode.appendChild(errorMsg)
                player && player.parentNode.removeChild(player)
                errorMsg = null
                player = null
              })
            }
          }
        })
      } else {
        this.canvas = this.$refs.canvasRender
        this.canvasContext = this.canvas.getContext('2d')
        this.image = document.createElement('img')
        this.image.addEventListener('load', this.onImageLoad)
        this.image.addEventListener('error', this.onImageError)
        this.videoConnectionObserver = {
          videoConnectionReceivedFrame: this.videoConnectionReceivedFrame,
        }
        this.XPMobileSDK.library.Connection.webSocketBrowser = false
      }
      this.streamRequest = this.XPMobileSDK.RequestStream(
        this.RequestStreamParams(),
        this.requestStreamCallback,
        function (__) {}
      )
    },
    Download(url) {
      document.getElementById('my_iframe').src = url
    },
    async requestStreamCallback(videoConnection) {
      const container = this.$refs['container_' + this.cameraReal]
      this.videoController = videoConnection
      if (videoConnection && videoConnection.videoId) {
        this.videoId = videoConnection.videoId
      }
      videoConnection.addObserver(this.videoConnectionObserver)
      videoConnection.open()

      const event = new CustomEvent('playStream', {
        detail: {
          cameraId: this.cameraReal,
          videoConnection,
        },
      })
      if (container) {
        container.parentNode.dispatchEvent(event)
      }
      await this.delay(200)
      this.handleChangeStreamSpeed(this.startTime)
    },
    delay(ms) {
      // eslint-disable-next-line promise/param-names
      return new Promise(res => setTimeout(res, ms))
    },
    async videoConnectionReceivedFrame(frame) {
      this.timeUpdate = frame.timestamp
      if (!this.handleLoad) {
        this.loading = false
        this.handleLoad = true
        await this.delay(1)
        this.loadingSuccess = moment().unix()
        this.flagChangeStream = moment().unix()
      }
      if (this.type != 'Live') {
        const endTimeTemp = this.endTime
        const currentVideo = new Date(frame.timestamp).getTime()
        if (endTimeTemp <= currentVideo) {
          return
        }
      }
      if (!this.drawing && frame.dataSize > 0) {
        this.drawing = true

        if (frame.hasSizeInformation) {
          var multiplier =
            frame.sizeInfo.destinationSize.resampling * this.XPMobileSDK.getResamplingFactor() || 1
          this.image.width = multiplier * frame.sizeInfo.destinationSize.width
          this.image.height = multiplier * frame.sizeInfo.destinationSize.height
        }

        if (this.imageURL) {
          window.URL.revokeObjectURL(this.imageURL)
        }

        this.imageURL = window.URL.createObjectURL(frame.blob)
        this.image.src = this.imageURL
      }
    },
    onImageLoad(event) {
      this.canvas.width = this.image.width
      this.canvas.height = this.image.height
      this.canvasContext.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height)

      this.drawing = false
    },
    onImageError(event) {
      this.drawing = false
    },
    handleRecording(isRecording) {
      if (isRecording) {
        this.startTimeRecord = moment(this.timeUpdate).format('YYYY-MM-DD HH:mm:ss')
      } else {
        const params = {}
        if (this.startTimeRecord >= moment(this.timeUpdate).format('YYYY-MM-DD HH:mm:ss')) {
          params.startTime = moment(this.timeUpdate).format('YYYY-MM-DD HH:mm:ss')
          params.endTime = this.startTimeRecord
          params.cameraId = this.cameraReal
        } else {
          params.cameraId = this.cameraReal
          params.startTime = this.startTimeRecord
          params.endTime = moment(this.timeUpdate).format('YYYY-MM-DD HH:mm:ss')
        }
        if (params) {
          this.$emit('videoRecording', params)
        }
      }
    },
    getThumbnailByTime() {
      const params = {
        cameraId: this.cameraReal,
        time: moment(this.timeUpdate).valueOf(),
      }
      this.XPMobileSDK.getThumbnailByTime(params, this.getThumbnailSuccess, function (__) {})
    },
    getThumbnailSuccess(res) {
      const params = new FormData()
      res = 'data:image/png;base64,' + res
      const file = this.DataURIToBlob(res)
      params.append(
        'file',
        file,
        this.cameraReal + '_' + moment().format('HHmmssDDMMYYYY') + '.png'
      )
      params.append('keepFileName', true)
      const headers = {
        'Content-Type': 'multipart/form-data',
      }
      // TODO
      // eslint-disable-next-line no-undef
      // .post('http://103.21.151.166:8683/v1.0/upload/' + 'file', params, {
      axios
        .post(this.$config.VITE_APP_UPLOAD_IMAGE_URL, params, {
          headers,
        })
        .then(res => {
          if (res.data.data && res.data.data.length > 0) {
            if (res.data.data[0].fileDownloadUri) {
              // eslint-disable-next-line no-undef
              axios({
                url: res.data.data[0].fileDownloadUri, // File URL Goes Here
                method: 'GET',
                responseType: 'blob',
              }).then(respone => {
                var FILE = window.URL.createObjectURL(new Blob([respone.data]))
                var docUrl = document.createElement('a')
                docUrl.href = FILE
                if (res.data && res.data.data.length > 0 && res.data.data[0].fileDownloadUri) {
                  this.$emit('UrlImgScreenShot', res.data.data[0].fileDownloadUri)
                } else {
                  this.$message({
                    type: 'error',
                    message: 'Có lỗi xảy ra vui lòng thử lại sau!',
                  })
                }
              })
            }
          }
        })
        .catch(__ => {
          this.$message({
            type: 'error',
            message: 'Có lỗi xảy ra vui lòng thử lại sau!',
          })
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.export-video-replay,
.bookmark-form-add {
  z-index: 999999 !important;
}
</style>
<style lang="scss" scoped>
.control-custom-bar-cam {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.main-video.main-video-playback-custom.zoom .close-camera {
  display: none;
}

.close-camera {
  position: absolute;
  right: 5px;
  // z-index: 9999;
  font-size: 17px;
  top: 4px;
  z-index: 2000;
}

.close-camera i {
  background: rebeccapurple;
  border-radius: 100%;
  background: white;
  padding: 3px;
  font-size: 14px;
  cursor: pointer;
}

.close-camera i:hover {
  background: #2a2561;
  color: white;
}

.circle svg {
  width: 8px !important;
}

.take-thumbnail {
  color: white;
  margin-left: 8px;

  i {
    font-size: 22px;
    display: inline-block;
    position: relative;
    top: 3px;
    cursor: pointer;
  }
}

.controll {
  .bar-controll {
    .list-bar {
      .camera-live {
        svg {
          filter: none;
        }
      }

      svg {
        filter: brightness(0) invert(1);
      }
    }
  }
}

.zoom {
  position: fixed !important;
  z-index: 99999;
  top: 0;
  right: 0;

  .box-handle {
    margin-left: 15px;
  }
}
</style>

<style lang="scss" scoped>
.zoomVideo {
  position: fixed !important;
  z-index: 99999;
  top: 0;
  right: 0;
}

.milestone-playback-component {
  height: 100%;
  background: black;
  text-align: center;
  width: 100% !important;

  .canvas-render {
    max-width: 100%;
    // height: 100%;
    // width: auto;
    width: 100%;
  }
}

.milestone-playback-component {
  max-width: 100%;
}

.loading {
  display: none !important;
}

.videoCamIcon {
  color: red;
}

#buttons {
  margin: 0 0px;
  float: left;
  display: flex;
  line-height: 30px;
  height: 30px;

  .time {
    font-size: 14px;
    color: #fff;
    line-height: 33px;
  }
}

.nav-controll {
  align-items: center;
  position: absolute;
  width: 100%;
  bottom: 29px;
  display: flex;
  flex-direction: column;

  .time {
    font-size: 13px;
    color: #fff;
  }

  .btn-controll {
    cursor: pointer;
    line-height: 22px;
  }

  .btn-controll:active {
    transform: scale(1.1);
  }
}

.defaultBar {
  cursor: pointer;
  border: none;
  position: relative;
  float: left;
  border-radius: 0px;
  width: 100%;
  height: 6px;
  background: #ffffff94 !important;
}

.progressBar {
  position: absolute;
  width: 0px;
  border-radius: 0px 5px 5px 0px;
  height: 5px;
  background: red;
}

.icon-video {
  line-height: 30px;
  color: #fff;
  cursor: pointer;
  margin: 0;
  font-size: 22px;
}

.main-video.main-video-playback-custom {
  display: inline-block;
  position: relative;
  background: #000;
  visibility: visible !important;

  .recording {
    position: absolute;
    width: 10px;
    height: 10px;
    display: inline;
    background: red;
    top: 10px;
    right: 10px;
    border-radius: 50%;
    animation: blink 1s linear infinite;
  }

  .header-info-camera {
    height: 34px;
    background-color: #00000082;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    position: absolute;
    width: 100%;
    text-align: left;
  }

  .video-wraper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 100%;
    height: 100% !important;
    // height: calc(100% - 34px);
  }

  .box-handle {
    bottom: 35px;
    position: absolute;
    display: inline-block;
    left: 12px;

    .plus-btn {
      float: right;
    }
  }

  .circle {
    cursor: pointer;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    line-height: 18px;
    width: 18px;
    height: 18px;
    background: #16101029;

    i {
      font-size: 12px;
    }
  }

  .group-zoom-btn {
    width: 70px;
    display: flex;
    justify-content: space-between;
  }

  .controll {
    position: absolute;
    bottom: 0px;
    width: 100%;
    background: rgba(43, 51, 63, 0.7);
    height: 30px;

    .bar-controll {
      padding-left: 10px;
      padding-right: 10px;
      width: 100%;
      height: 100%;

      ul {
        width: 100%;
        padding: 0;
        margin: 0;

        li {
          float: right;
          line-height: 30px;
          height: 30px;
          margin-left: 15px;
          list-style: none;

          // .svg-icon {
          //   height: 14px;
          // }

          svg {
            cursor: pointer;
          }
        }
      }
    }
  }
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 1;
  }
}
</style>
