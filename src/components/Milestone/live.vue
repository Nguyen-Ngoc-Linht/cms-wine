<template>
  <div
    :id="cameraReal"
    :ref="'container_' + cameraReal"
    :key="uuid"
    v-loading="loading"
    class="main-video camera camera-custom"
    :class="{ zoom: zoom || zoomAndFull }"
  >
    <div
      v-if="loadingShow"
      class="recording"
    />
    <div
      class="name-cam"
      @click="handleClickName"
    >
      {{ cameraConfig.name }}
    </div>
    <div
      v-if="isDirectStream"
      ref="videoRender"
      class="video-render"
    />
    <div
      v-else
      class="video-wraper"
      :class="{ loading: loading }"
    >
      <canvas
        ref="canvasRender"
        class="canvas-render"
      />
    </div>
    <div
      v-if="cameraConfig.ptz == 1 && !isMulti && !loading && !isFollow"
      class="box-handle"
    >
      <div class="direct-box">
        <div class="top-direct">
          <div
            class="circle top-btn"
            @click="handlePTZ('UpLeft')"
          >
            <svg-icon
              icon-class="CamTopLeft"
              class="text-white"
            />
          </div>
          <div
            class="circle top-btn"
            @click="handlePTZ('Up')"
          >
            <svg-icon
              icon-class="CamTopCenter"
              class="text-white"
            />
          </div>
          <div
            class="circle top-btn"
            @click="handlePTZ('UpRight')"
          >
            <svg-icon
              icon-class="CamTopRight"
              class="text-white"
            />
          </div>
        </div>
        <div class="middle-direct">
          <div
            class="circle left-middle-direct"
            @click="handlePTZ('Left')"
          >
            <svg-icon
              icon-class="CamCenterLeft"
              class="text-white"
            />
          </div>
          <div
            class="circle center-direct-home"
            @click="handlePTZ('Home')"
          >
            <svg-icon
              icon-class="home"
              class="text-white"
            />
          </div>
          <div
            class="circle right-direct"
            @click="handlePTZ('Right')"
          >
            <svg-icon
              icon-class="CamCenterRight"
              class="text-white"
            />
          </div>
        </div>
        <div class="bottom-direct">
          <div
            class="circle down-btn"
            @click="handlePTZ('DownLeft')"
          >
            <svg-icon
              icon-class="CamBttLeft"
              class="text-white"
            />
          </div>
          <div
            class="circle down-btn"
            @click="handlePTZ('Down')"
          >
            <svg-icon
              icon-class="CamBttCenter"
              class="text-white"
            />
          </div>
          <div
            class="circle down-btn"
            @click="handlePTZ('DownRight')"
          >
            <svg-icon
              icon-class="CamBttRight"
              class="text-white"
            />
          </div>
        </div>
      </div>
      <div class="group-zoom-btn">
        <div
          class="circle diff-btn"
          @click="handlePTZ('ZoomOut')"
        >
          -
        </div>
        <div
          class="circle plus-btn"
          @click="handlePTZ('ZoomIn')"
        >
          +
        </div>
      </div>
    </div>
    <div class="controll">
      <div class="bar-controll">
        <div class="left">
          <svg-icon
            v-if="isMulti"
            icon-class="videoCam"
            :class="{ videoCamIcon: record }"
            @click="showPlayback = !showPlayback"
          />
        </div>
        <div
          v-if="!isMulti"
          class="right"
        >
          <div
            title="Tải lại"
            @click="resetCamera()"
          >
            <svg-icon
              icon-class="ResetCam"
              class="fs-24 text-white"
            />
          </div>
          <div
            v-if="cameraConfig.cameraStatus == 'RUNNING'"
            title="Chụp ảnh"
            class="take-picture"
            @click="getThumbnailByTime"
          >
            <svg-icon icon-class="camera1" />
          </div>
          <div
            v-if="!fullScreen"
            title="Toàn màn hình"
            @click="zoomVideo"
          >
            <svg-icon
              icon-class="FullScreen"
              class="fs-18 text-white"
            />
          </div>
          <div
            v-else
            title="Thu gọn màn hình"
            @click="zoomVideo"
          >
            <svg-icon
              icon-class="OutFullScreen"
              class="fs-24"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCommonStore } from '@/store'
import MilestoneConnect from '@/milestone/connect'
import MilestoneConnectTunnel from '@/milestone/connectTunnel'
import { genKey } from '@/utils/app/string'
import { getToken } from '@/utils/auth'
import moment from 'moment'
import axios from 'axios'

const commonStore = useCommonStore()
const MilestoneConnectClass = new MilestoneConnect()
const MilestoneConnectTunnelClass = new MilestoneConnectTunnel()

export default {
  name: 'MilestoneLive',
  components: {},
  directives: {},
  props: {
    cameraReal: {
      type: String,
      default: '',
    },
    zoomAndFull: {
      type: Boolean,
      default: false,
    },
    isMulti: {
      type: Boolean,
      default: false,
    },
    cameraConfig: {
      default: null,
    },
    width: {
      type: Number,
      default: 700,
    },
    height: {
      type: Number,
      default: 500,
    },
    type: {
      type: String,
      default: 'Live',
    },
    recordingId: {
      type: String,
      default: '',
    },
    typeStream: {
      type: String,
      default: 'image',
    },
    isFollow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uuid: '',
      // handle video connection
      loading: false,
      timeUpdate: '',
      attachContainerClick: true,
      currentDate: new Date().getTime() - 60 * 60 * 1000,
      playbackControllerId: null,
      // end handlevide0
      videoId: null,
      isPause: true,
      startTime: new Date().getTime() - 1000 * 60 * 60,
      endTime: new Date().getTime(),
      sizeProgress: 0,
      // control cam

      zoom: false,
      showPtz: false,
      fullScreen: false,

      // state cam render
      drawing: false,
      imageURL: null,
      videoController: null,
      videoConnection: null,
      image: null,
      canvasContext: null,
      videoConnectionObserver: null,
      canvas: null,
      record: false,
      startTimeRecord: null,
      loadingShow: false,
      handleLoad: false,
      streamRequest: null,
      milestoneConnectClass: null,
    }
  },
  computed: {
    isDirectStream() {
      if (this.XPMobileSDK.library.Connection) {
        return (
          this.XPMobileSDK.library.Connection.directStreamingServer && this.typeStream == 'video'
        )
      }
      return false
    },
    XPMobileSDK() {
      // if (env.VUE_APP_IS_TUNNEL && JSON.parse(env.VUE_APP_IS_TUNNEL)) {
      //   return XPMobileSDKTunnel
      // }
      return this.cameraConfig.isTunnel ? XPMobileSDKTunnel : XPMobileSDK
    },
  },
  created() {
    this.uuid = genKey()
  },
  beforeUnmount() {
    this.stopStream()
    if (this.videoId) {
      this.closeStream()
    }
  },
  mounted() {
    const container = this.$refs['container_' + this.cameraReal]
    container.style.height = this.height + 'px'
    container.style.width = this.width + 'px'
    this.loading = true
    this.milestoneConnectClass = this.cameraConfig.isTunnel
      ? MilestoneConnectTunnelClass
      : MilestoneConnectClass

    const milestoneType = this.cameraConfig.isTunnel ? 'loginMilestoneTunnel' : 'loginMilestone'

    if (!commonStore[milestoneType]) {
      this.milestoneConnectClass.handleAddMethodCallback(this.handleRenderVideo)
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
      this.$forceUpdate()
    },

    handlePause(value) {
      if (value) {
        this.isPause = true
        this.stopAndRun(0)
      } else {
        this.isPause = false
        this.stopAndRun(1)
      }
    },
    RequestStreamParams(Fps) {
      const param = {
        CameraId: this.cameraReal,
        DestWidth: this.width,
        DestHeight: this.height,
        SignalType: this.type /* 'Live' or 'Playback'*/,
        MethodType: 'Push' /* 'Pull'*/,
        Fps: Fps || 41, // This doesn't work for Pull mode, but we have to supply it anyway to keep the server happy
        ComprLevel: 71,
        KeyFramesOnly: 'No' /* 'Yes'*/, // Server will give only key frame thumb nails. This will reduce FPS
        RequestSize: 'Yes',
        StreamType: 'Transcoded',
      }
      return param
    },

    handlePTZ(direct) {
      const temConnect = this.videoController
      temConnect.cameraId = this.cameraReal
      this.XPMobileSDK.ptzMove(temConnect, direct)
    },

    isShowPtz() {
      this.showPtz = !this.showPtz
    },

    handleChange() {
      this.loading = true
      const self = this
      const container = this.$refs['container_' + this.cameraReal]
      const params = {
        VideoId: this.videoId,
        DestWidth: this.width,
        DestHeight: this.height,
      }

      if (container) {
        container.style.width = this.width + 'px'
        container.style.height = this.height + 'px'
      }
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
    handleChangeStreamSpeed(time) {
      const self = this
      const params = {
        VideoId: this.videoId,
        SeekType: 'Time',
        Time: time,
      }
      this.XPMobileSDK.ChangeStream(params, async () => {
        await self.delay(500)
        self.stopAndRun(1)
      })
    },

    stopAndRun(speed) {
      if (speed == 1) {
        this.isPause = false
      }
      const params = {
        VideoId: this.videoId,
        Speed: speed,
      }
      this.XPMobileSDK.ChangeStream(
        params,
        success => {
          console.log(success)
        },
        error => {
          console.log(error)
        }
      )
    },

    zoomVideo() {
      const container = this.$refs['container_' + this.cameraReal]
      let params = {}
      const self = this
      if (!this.zoom) {
        params = {
          VideoId: this.videoId,
          DestWidth: window.innerWidth,
          DestHeight: window.innerHeight,
        }
        this.XPMobileSDK.ChangeStream(params, async () => {
          this.zoom = true
          container.style.height = window.innerHeight + 'px'
          container.style.width = window.innerWidth + 'px'
          container.style.zIndex = 9999
        })
      } else {
        container.style.visibility = 'hidden'
        params = {
          VideoId: this.videoId,
          DestWidth: this.width,
          DestHeight: this.height,
        }
        this.XPMobileSDK.ChangeStream(params, async () => {
          this.zoom = false
          await self.delay(800)
          container.style.height = this.height + 'px'
          container.style.width = this.width + 'px'
          container.style.zIndex = 9
          container.style.visibility = 'visible'
        })
      }
      if (!this.fullScreen) {
        this.fullScreen = true
      } else {
        this.fullScreen = false
      }
    },

    async handleRenderVideo() {
      const container = this.$refs['container_' + this.cameraReal]
      if (container) {
        container.style.height = this.height + 'px'
        container.style.width = this.width + 'px'
      }

      if (this.isDirectStream) {
        const self = this
        await this.XPMobileSDK.getAllViews(function (items) {
          if (items) {
            for (var i = 0; i < items[0].Items[0].Items[0].Items.length; i++) {
              if (self.cameraReal === items[0].Items[0].Items[0].Items[i].Id) {
                const elementRemove = self.isCamTunnel
                  ? document.getElementsByTagName('videos-stream-tunnel')
                  : document.getElementsByTagName('videos-stream')

                if (elementRemove && elementRemove[0]) {
                  elementRemove[0].remove()
                }
                const videoElement = self.isCamTunnel
                  ? document.createElement('videos-stream-tunnel')
                  : document.createElement('videos-stream')
                // videoElement.width = self.width
                // videoElement.height = self.height
                videoElement.cameraId = items[0].Items[0].Items[0].Items[i].Id
                videoElement.name = items[0].Items[0].Items[0].Items[i].Name

                const videoRenderEl = self.$refs.videoRender
                videoRenderEl?.appendChild(videoElement)
                const style = document.createElement('style')
                style.innerHTML = '.camera h4 { display: none; }'
                if (this.customHeight) {
                  style.innerHTML += ` video.player { height: ${this.customHeight}px; }`
                }
                videoElement.shadowRoot.appendChild(style)
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
          }
        })
        await this.delay(200)
        this.loading = false
      } else {
        this.canvas = this.$refs.canvasRender
        await this.delay(200)
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
        error => {
          if (error) {
            self.loading = false
            console.log('Lỗi luồng stream', error)
          }
        }
      )
    },
    async requestStreamCallback(videoConnection) {
      this.loading = true
      this.videoConnection = videoConnection
      const container = this.$refs['container_' + this.cameraReal]
      this.videoController = videoConnection

      if (videoConnection && videoConnection.videoId) {
        this.videoId = videoConnection.videoId
      }
      videoConnection.addObserver(this.videoConnectionObserver)
      videoConnection.open()

      var event = new CustomEvent('playStream', {
        detail: {
          cameraId: this.cameraReal,
          videoConnection,
        },
      })
      if (container && this.zoom) {
        const params = {
          VideoId: this.videoId,
          DestWidth: window.innerWidth,
          DestHeight: window.innerHeight,
        }
        this.XPMobileSDK.ChangeStream(params, async () => {
          this.zoom = true
          container.style.height = window.innerHeight + 'px'
          container.style.width = window.innerWidth + 'px'
          container.style.zIndex = 9999
        })
      }
      if (container && container.parentNode) {
        container.parentNode.dispatchEvent(event)
        this.isConnected = true
        if (!this.isMulti) {
          this.loading = false
        }
      }
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    videoConnectionReceivedFrame(frame) {
      this.timeUpdate = frame.timestamp
      if (!this.handleLoad) {
        this.loading = false
        this.handleLoad = true
      }
      if (this.type != 'Live' && !this.isMulti) {
        this.handleTimeBar(new Date(frame.timestamp).getTime(), 'play')
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
    handleClickName() {
      if (this.isFollow) {
        this.$emit('unfollow', this.cameraConfig)
      }
    },

    resetCamera() {
      if (this.videoId) {
        this.closeStream()
      }

      // this.milestoneConnectClass.disconnectToServer()
      this.uuid = genKey()
      this.flagPauseVideo = false
      this.loading = true
      // setTimeout(() => {
      //   this.milestoneConnectClass.connectToServer()
      // }, 0)
      setTimeout(() => {
        this.handleRenderVideo()
      }, 200)
    },

    stopStream() {
      if (this.videoController) {
        this.videoController.removeObserver(this.videoConnectionObserver)
        this.videoController.close()
        this.videoController = null
      }
      if (this.streamRequest) {
        this.XPMobileSDK.cancelRequest(this.streamRequest)
        this.streamRequest = null
      }
    },
    getThumbnailByTime() {
      const params = {
        cameraId: this.cameraReal,
        time: moment().unix() * 1000,
      }
      this.XPMobileSDK.getThumbnailByTime(params, this.getThumbnailSuccess, error => {
        console.error('Error occurred:', error)
      })
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
        Authorization: 'Bearer ' + getToken(),
      }
      axios
        .post(this.$config.VITE_APP_UPLOAD_URL + 'file', params, {
          headers,
        })
        .then(res => {
          if (res.data.data && res.data.data.length > 0) {
            if (res.data.data[0].fileDownloadUri) {
              axios({
                url: res.data.data[0].fileDownloadUri, // File URL Goes Here
                method: 'GET',
                responseType: 'blob',
              }).then(respone => {
                var FILE = window.URL.createObjectURL(new Blob([respone.data]))

                var docUrl = document.createElement('a')
                docUrl.href = FILE
                docUrl.setAttribute('download', res.data.data[0].fileName)
                document.body.appendChild(docUrl)
                docUrl.click()
              })
            }
          }
        })
        .catch(_ => {
          this.$message({
            type: 'error',
            message: 'Có lỗi xảy ra vui lòng thử lại sau!',
          })
        })
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
  },
}
</script>

<style lang="scss" scoped>
.map-monitor .main-video {
  height: 430px !important;

  .box-handle {
    bottom: 80px;
  }
}

.canvas-render {
  max-width: 100%;
}

.zoom {
  position: fixed !important;
  z-index: 999999 !important;
  top: 0;
  right: 0;

  .box-handle {
    margin-left: 15px;
  }
}

.loading {
  display: none !important;
}

.videoCamIcon {
  color: red;
}

.icon-video {
  color: #fff;
  cursor: pointer;
  margin: 0 20px;
  font-size: 22px;
}

.main-video {
  display: inline-block;
  position: relative;
  background: #000;
  max-width: 100%;
  overflow: hidden;

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

  .name-cam {
    position: absolute;
    color: #fff;
    margin-left: 6px;
    height: 16px;
    font-size: 12px;
    overflow: hidden;
    background: #00000036;
  }

  .video-wraper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 100%;
    height: calc(100% - 30px);
  }

  .box-handle {
    bottom: 36px;
    left: 12px;
    position: absolute;
    display: inline-block;
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
  }

  .group-zoom-btn {
    width: 70px;
    display: flex;
    justify-content: space-between;

    .circle {
      background: #e6e8eba3 !important;
    }
  }

  .direct-box {
    bottom: 25px;
    position: absolute;
    height: 70px;
    width: 70px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    svg {
      font-size: 18px;
    }

    i {
      color: #fff;
    }

    .middle-direct,
    .top-direct,
    .bottom-direct {
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
      gap: 8px;
    }
  }
}

.controll {
  position: absolute;
  bottom: 0px;
  width: 100%;
  background: rgba(43, 51, 63, 0.7);
  height: 30px;

  .bar-controll {
    padding-right: 10px;
    padding-left: 10px;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > div {
      cursor: pointer;
    }

    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      color: #ffffff;
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
