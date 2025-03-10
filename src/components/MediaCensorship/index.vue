<template>
  <div class="media-censorship flex height-567">
    <div class="show-media flex-1">
      <div
        v-if="activeMedia && Object.keys(activeMedia).length > 0"
        class="w-full h-full"
      >
        <div
          v-if="activeMedia.type === 'image'"
          class="w-full h-full block-block"
          :key="keyImage"
        >
          <div
            id="zoomImage"
            ref="zoomImage"
            :data-zoomist-src="getImageUrl(activeMedia.url)"
            alt=""
            class="w-full"
          ></div>
        </div>
        <div
          v-if="activeMedia.type === 'video'"
          class="video-html5"
        >
          <video
            controls
            autoplay
            ref="myVideo"
            :key="activeMedia.url"
          >
            <source
              :src="getVideoUrl(activeMedia.url)"
              type="video/mp4"
            />
          </video>
        </div>
        <div
          v-if="activeMedia.type === 'playback'"
          class="d-flex"
        >
          <!--<videoPlayBack
            :key="keyPlayback"
            :camera-config="activeMedia.camInfo"
            :start-time-prop="activeMedia.startTime"
            :end-time-prop="activeMedia.endTime"
            :camera-real="activeMedia.camInfo.id"
            :screen-shot="isScreenShot"
            :recording="isRecord"
            @UrlImgScreenShot="saveImgesCensorship"
            @videoRecording="saveVideoRecording"
          />-->
          <videoPlayBack
            :key="keyPlayback"
            :camera-config="activeMedia.camInfo"
            :start-time-prop="activeMedia.startTime"
            :camera-real="activeMedia.camInfo.id"
            :screen-shot="isScreenShot"
            :recording="isRecord"
            @UrlImgScreenShot="saveImgesCensorship"
            @videoRecording="saveVideoRecording"
          />
          <div class="action-playback">
            <div
              @click="handleRecording()"
              v-loading="loadingVideoRecord"
            >
              <svg-icon
                v-if="isRecord"
                icon-class="icon-recording"
              />
              <svg-icon
                v-else
                icon-class="icon-record"
              />
            </div>
            <div
              @click="handleScreenShot()"
              v-loading="loadingScreenShot"
            >
              <svg-icon icon-class="icon-screenshot" />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        v-loading="loading"
        class="loading"
      ></div>
    </div>
    <div class="list-media padding-8">
      <div class="head flex-between">
        <div class="title">Hình ảnh/video</div>
        <div
          v-if="linkDownload"
          class="download-all success"
          @click="downloadFile()"
        >
          <el-icon><Download /></el-icon> Tải toàn bộ
        </div>
        <div
          v-else
          class="download-all"
          @click="createFile()"
        >
          <el-icon v-loading="loadingDownload"><Download /></el-icon> Tải toàn bộ
        </div>
      </div>
      <el-row
        v-if="listMedia && listMedia.length > 0"
        class="row"
        :gutter="20"
      >
        <el-col
          v-for="(item, index) in listMedia"
          :key="index"
          :span="12"
          :class="{ active: index === activeIndexMedia }"
        >
          <div
            class="parent"
            v-if="item.type === 'image'"
          >
            <el-image
              @click="forcusMedia(item, index, true)"
              :src="getImageUrl(item.url)"
              alt=""
            />
            <div class="sigle-download">
              <el-icon @click="downloadImage(item.url)"><Download /></el-icon>
            </div>
            <div
              v-if="item.isdelete"
              class="sigle-delete"
            >
              <el-icon @click="handleDeleteImage(item.url)"><Delete /></el-icon>
            </div>
          </div>
          <div
            class="parent video-mp4"
            v-if="item.type === 'video'"
          >
            <video
              @click="forcusMedia(item, index)"
              height="68px"
              :src="getVideoUrl(item.url)"
              alt=""
            />
            <div class="sigle-download">
              <el-icon @click="downloadSigleFile(item.url)"><Download /></el-icon>
            </div>
          </div>
          <div
            v-if="item.type === 'playback'"
            class="parent"
          >
            <el-image
              @click="forcusMedia(item, index)"
              :src="imgVideoDefault"
              alt=""
            />
            <div
              v-if="item.delete && item.id"
              class="delete-playback"
            >
              <el-icon @click="handleDeletePlayback(item.id)"><Delete /></el-icon>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row
        v-else
        v-loading="loading"
        class="loading"
      >
        <!-- <img
          :src="noImage"
          alt=""
        /> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import videoPlayBack from './playback.vue'
import imgVideoDefault from '@/assets/imgs/thumbnailPlayback.png'
import noImage from '@/assets/imgs/no-image.png'
import moment from 'moment'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCommonStore } from '@/store'
import { getVideoUrl, getImageUrl } from '@/utils/files'
import { cloneDeep } from 'lodash-unified'
import { genKey } from '@/utils/app/string'
import Zoomist from 'zoomist'
import 'zoomist/dist/zoomist.min.css'

import {
  saveImgCensorship,
  savePlaybackCensorship,
  replacePlaybackCensorship,
  dowLoadFile,
  deletePlayback,
  deleteImages,
} from '@/api/censorship-violations/handleCensorship.js'

const commonStore = useCommonStore()

export default {
  name: 'MediaCensorship',
  components: { videoPlayBack },
  props: {
    dataViolation: {
      type: Object,
    },
    playbackReplace: {
      type: Object,
    },
  },
  data() {
    return {
      noImage,
      listMedia: [],
      baseUrlImage: this.$config.VITE_APP_URL_IMAGE,
      imgVideoDefault,
      activeMedia: {},
      cameraConfig: {},
      activeIndexMedia: 0,
      keyPlayback: 0,
      keyImage: 0,
      isScreenShot: false,
      isRecord: false,
      loadingScreenShot: false,
      loadingVideoRecord: false,
      linkDownload: null,
      loadingDownload: false,
      loading: true,
    }
  },
  watch: {
    dataViolation: {
      handler() {
        this.linkDownload = null
        this.loadingDownload = false
        this.isRecord = false
        this.loadingScreenShot = false
        this.getMedia()
        if (commonStore.checkConnectMilestone) {
          this.keyPlayback += 1
        }
      },
      // deep: true,
      // immediate: true,
    },
    playbackReplace: {
      handler(val) {
        this.replacePlayback(val)
      },
      // deep: true,
      // immediate: true,
    },
    activeMedia: {
      async handler(val) {
        await this.$nextTick()
        if (val && Object.keys(val).length > 0 && val.type === 'image') {
          const element = document.getElementById('zoomImage')
          const zoomist = new Zoomist(element, {
            bounds: true,
            slider: true,
            zoomer: true,
            zoomRatio: 0.5,
          })
        }
      },
    },
  },
  mounted() {
    this.$socket.on('receiveNotificationExport', value => {
      if (value && value.objectType === 'export-violation-media') {
        if (value.url) {
          this.linkDownload = value.url
          this.loadingDownload = false
        }
      }
    })
  },
  methods: {
    replacePlayback(val) {
      this.listMedia = this.listMedia.map(item => {
        if (item.type === 'playback') {
          item.startTime = moment(val.data[0].startTime).valueOf()
          item.endTime = moment(val.data[0].endTime).valueOf()
        }
        return item
      })
      if (commonStore.checkConnectMilestone) {
        this.keyPlayback += 1
      }
      if (this.listMedia.length > 0) {
        const index = this.listMedia.findIndex(item => item.type === 'playback')
        if (this.activeIndexMedia === index) {
          this.forcusMedia(this.listMedia[index], index)
        }
      }
    },
    getMedia() {
      this.activeMedia = {}
      this.listMedia = [] // reset về null trước khi đẩy vào mảng
      if (this.dataViolation) {
        // Xử lý hình ảnh
        if (
          this.dataViolation.imageUrl ||
          this.dataViolation.originalImage ||
          this.dataViolation.imageCtxtUrl
        ) {
          const arrImg = this.dataViolation.imageUrl?.split(',') || []
          const arrImgOrigin = this.dataViolation.originalImage?.split(',') || []
          const arrImgCtxt = this.dataViolation.imageCtxtUrl?.split(',') || []
          if (arrImgCtxt != null && arrImgCtxt.length !== 0) {
            arrImg.push(...arrImgCtxt)
          }
          const arr = arrImgOrigin
            .map(itemA => ({
              url: itemA,
              isdelete: !arrImg.includes(itemA),
            }))
            .concat(
              arrImg
                .filter(itemB => !arrImgOrigin.includes(itemB))
                .map(itemB => ({ url: itemB, isdelete: true }))
            )
          arr.map(item => {
            if (!item.url.includes('http')) {
              item.url = this.baseUrlImage + item.url
            }
            const obj = { url: item.url, type: 'image', isdelete: item.isdelete }
            this.listMedia.push(obj)
            return ''
          })
        }
        // Xử lý video mp4
        if (this.dataViolation.videoUrl) {
          const arrVideo = this.dataViolation.videoUrl.split(',')
          arrVideo.map(item => {
            const obj = { url: item ? getVideoUrl(item) : '', type: 'video' }
            this.listMedia.push(obj)
            return ''
          })
        }
        // Xứ lý luồng playback
        if (this.dataViolation.timePlayBacks && this.dataViolation.timePlayBacks.data.length > 0) {
          const camInfo = {
            id: this.dataViolation.sourceId,
            name: this.dataViolation.sourceName,
            cameraStatus: 'RUNNING',
          }
          this.dataViolation.timePlayBacks.data.map(item => {
            const obj = {
              startTime: moment(item.startTime).valueOf(),
              endTime: moment(item.endTime).valueOf(),
              type: 'playback',
              // delete: true,
              id: item.id,
              camInfo,
            }
            this.listMedia.push(obj)
            return ''
          })
        } else {
          if (this.dataViolation.startTime && this.dataViolation.endTime) {
            const camInfo = {
              id: this.dataViolation.sourceId,
              name: this.dataViolation.sourceName,
              cameraStatus: 'RUNNING',
            }
            const obj = {
              startTime: moment(this.dataViolation.startTime).valueOf(),
              endTime: moment(this.dataViolation.endTime).valueOf(),
              type: 'playback',
              camInfo,
            }
            this.listMedia.push(obj)
          }
        }
        if (this.listMedia.length > 0) {
          setTimeout(() => {
            this.forcusMedia(this.listMedia[0], 0)
          }, 500)
        }
      }
    },
    pushImage(arrImage) {
      if (arrImage) {
        const obj = { url: arrImage, type: 'image', isdelete: true }
        this.listMedia.push(obj)
      }
    },
    pushPlayback(playback) {
      if (playback) {
        const camInfo = {
          id: this.dataViolation.sourceId,
          name: this.dataViolation.sourceName,
          cameraStatus: 'RUNNING',
        }
        const obj = {
          startTime: moment(playback.startTime).valueOf(),
          endTime: moment(playback.endTime).valueOf(),
          id: playback.id,
          type: 'playback',
          delete: true,
          camInfo,
        }
        this.listMedia.push(obj)
      }
    },
    forcusMedia(val, index, isClick = false) {
      if ((isClick && this.activeIndexMedia !== index) || !isClick) {
        this.activeMedia = val
        this.activeIndexMedia = index
        this.keyPlayback = genKey()
        this.keyImage = genKey()
      }
    },
    handleRecording() {
      this.isRecord = !this.isRecord
    },
    handleScreenShot() {
      this.loadingScreenShot = true
      this.isScreenShot = !this.isScreenShot
    },
    async saveVideoRecording(val) {
      this.loadingVideoRecord = true
      if (this.dataViolation.timePlayBacks && this.dataViolation.timePlayBacks.data.length > 0) {
        const params = {
          id: this.dataViolation.timePlayBacks.data[0].id,
          startTime: this.dataViolation.startTime,
          startPlayBack: val.startTime,
          endPlayBack: val.endTime,
          sourceId: val.cameraId,
          parentId: this.dataViolation.parentId,
          appName: 'ITMON',
        }
        const { data, status } = await replacePlaybackCensorship(params)
        if (data && status === 200) {
          this.loadingVideoRecord = false
          if (data.timePlayBacks && data.timePlayBacks.data.length > 0) {
            this.$emit('changeFormData', cloneDeep(data))
            this.$message({
              type: 'success',
              message: 'Ghi hình thành công',
            })
          } else {
            this.$message({
              type: 'error',
              message: 'Ghi hình thất bại',
            })
          }
        } else {
          this.loadingVideoRecord = false
          this.$message({
            type: 'error',
            message: 'Ghi hình thất bại',
          })
        }
      } else {
        const params = {
          id: this.dataViolation.parentId,
          startTime: this.dataViolation.startTime,
          startPlayBack: val.startTime,
          endPlayBack: val.endTime,
          sourceId: val.cameraId,
          appName: 'ITMON',
        }
        const { data, status } = await savePlaybackCensorship(params)
        if (data && status === 200) {
          this.loadingVideoRecord = false
          if (data.timePlayBacks && data.timePlayBacks.data.length > 0) {
            this.$emit('changeFormData', cloneDeep(data))
            this.$message({
              type: 'success',
              message: 'Ghi hình thành công',
            })
          } else {
            this.$message({
              type: 'error',
              message: 'Ghi hình thất bại',
            })
          }
        } else {
          this.loadingVideoRecord = false
          this.$message({
            type: 'error',
            message: 'Ghi hình thất bại',
          })
        }
      }
    },
    async saveImgesCensorship(val) {
      this.loadingScreenShot = true
      if (val) {
        const params = {
          imageUrl: val,
          videoUrl: null,
          fileUrl: null,
          appName: 'ITMON',
        }
        const rs = await saveImgCensorship(this.dataViolation.parentId, params)
        if (rs && rs.status === 200) {
          this.loadingScreenShot = false
          const arrImgeNew = rs.data.imageUrl.split(',')
          this.pushImage(arrImgeNew.shift())
          this.$emit('changeFormData', rs.data)
          ElMessage({
            type: 'success',
            message: 'Chụp ảnh thành công',
          })
        } else {
          this.loadingScreenShot = false
          ElMessage({
            type: 'error',
            message: 'Chụp ảnh thất bại',
          })
        }
      }
    },
    async createFile() {
      this.loadingDownload = true
      const query = {
        key: this.dataViolation.key,
        startTime: this.dataViolation.startTime,
      }
      query.listOfFileNames = this.listMedia
        .filter(item => item.type !== 'playback')
        .map(item => item.url)
      const rs = await dowLoadFile(query)
      if (rs && rs.status === 200) {
        ElMessage({
          type: 'success',
          message: 'Tập tin dữ liệu đang cập nhật vui lòng chờ trong trong giây lát',
        })
      } else {
        ElMessage({
          type: 'error',
          message: 'Có lỗi xảy ra vui lòng thử lại sau',
        })
        this.loadingDownload = false
      }
    },
    downloadFile() {
      window.location.href = this.linkDownload
      this.linkDownload = null
    },
    handleDeletePlayback(idPlayback) {
      ElMessageBox.confirm('Bạn có chắc chắc muốn xóa luồng xem lại này ?', 'Cảnh báo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning',
      })
        .then(() => {
          const params = {
            id: idPlayback,
            startTime: this.dataViolation.startTime,
            parentId: this.dataViolation.parentId,
            appName: 'ITMON',
          }
          deletePlayback(params)
            .then(res => {
              const indexToRemove = this.listMedia.findIndex(item => item.id === idPlayback)
              // Trường hợp nếu playback bị xóa đang mở thì sẽ back về cái trước
              if (indexToRemove === this.activeIndexMedia) {
                const index = this.activeIndexMedia - 1
                this.forcusMedia(this.listMedia[index], index)
              }
              if (indexToRemove !== -1) {
                this.listMedia.splice(indexToRemove, 1)
              }
              this.$emit('changeFormData', res.data)
              ElMessage({
                type: 'success',
                message: 'Xóa luồng xem lại thành công',
              })
            })
            .catch(_ => {
              ElMessage({
                type: 'error',
                message: 'Xóa luồng xem lại không thành công',
              })
            })
        })
        .catch(() => {})
    },
    getVideoUrl(url) {
      return getVideoUrl(url)
    },
    getImageUrl(url) {
      return getImageUrl(url)
    },
    downloadSigleFile(url) {
      window.location.href = url
    },
    handleDeleteImage(urlImage) {
      ElMessageBox.confirm('Bạn có chắc chắc muốn xóa ảnh này ?', 'Cảnh báo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning',
      })
        .then(() => {
          const params = {
            imageUrl: urlImage.split(' '),
            startTime: this.dataViolation.startTime,
            parentId: this.dataViolation.parentId,
          }
          deleteImages(params)
            .then(res => {
              const indexToRemove = this.listMedia.findIndex(item => item.url === urlImage)
              // Trường hợp nếu playback bị xóa đang mở thì sẽ back về cái trước
              if (indexToRemove === this.activeIndexMedia) {
                const index = this.activeIndexMedia - 1
                this.forcusMedia(this.listMedia[index], index)
              }
              if (indexToRemove !== -1) {
                this.listMedia.splice(indexToRemove, 1)
              }
              this.$emit('changeFormData', res.data)
              ElMessage({
                type: 'success',
                message: 'Xóa ảnh thành công',
              })
            })
            .catch(_ => {
              ElMessage({
                type: 'error',
                message: 'Xóa ảnh không thành công',
              })
            })
        })
        .catch(() => {})
    },
    async downloadImage(url) {
      const imageUrl = url

      try {
        // Tải ảnh sử dụng Fetch API
        const response = await fetch(imageUrl)
        const blob = await response.blob()

        // Tạo đường dẫn cho Blob
        const blobUrl = URL.createObjectURL(blob)

        // Tạo đối tượng a (link) để thực hiện tải về
        const link = document.createElement('a')
        link.href = blobUrl
        const timestamp = new Date().toISOString().replace(/[:.]/g, '')
        link.download = timestamp

        // Bổ sung đối tượng link vào DOM và kích hoạt sự kiện click
        document.body.appendChild(link)
        link.click()

        // Loại bỏ đối tượng link và URL sau khi đã tải về
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      } catch (error) {
        console.error('Lỗi khi tải ảnh:', error)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.block-block {
  max-height: 567px;
  overflow: hidden;
}

.full-screen {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  cursor: pointer;
}

.show-media {
  position: relative;
}

:deep(.dialog-fullscreen .el-dialog__body) {
  text-align: center;
  background: black;
}

:deep(.dialog-fullscreen .el-dialog__header) {
  background: black;
  margin: 0px;
}

:deep(.dialog-fullscreen .el-dialog__close svg) {
  color: white;
  height: 20px !important;
  width: 20px !important;
  z-index: 9;
  background: #000000ad;
}

.video-mp4::after {
  background: #00000054;
  z-index: 1;
  position: absolute;
  width: 20px;
  height: 20px;
  content: '';
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  border: 1px solid white;
  border-radius: 100%;
}

.video-mp4::before {
  content: '';
  position: absolute;
  top: 51%;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 7px solid white;
  z-index: 999;
  transform: translate(-50%, -50%) rotate(180deg);
}

.media-censorship {
  margin: 8px 8px 0 8px;
}

.loading {
  height: 100%;
}

.sigle-download {
  position: absolute;
  top: 0;
  z-index: 9;
  background: white;
  right: 5px;
  top: 5px;
  display: none;
  cursor: pointer;
  padding: 2px;
}

.sigle-delete {
  position: absolute;
  z-index: 9;
  background: white;
  right: 5px;
  top: 25px;
  display: none;
  cursor: pointer;
  padding: 2px;
}

.delete-playback {
  position: absolute;
  top: 0;
  z-index: 9;
  right: 5px;
  top: 5px;
  display: none;
  cursor: pointer;
  color: white;
}

.parent:hover .delete-playback {
  display: flex;
}

:deep(.parent) {
  position: relative;

  .el-image {
    width: 100%;
  }
}

.parent:hover .sigle-download {
  display: flex;
}

.parent:hover .sigle-delete {
  display: flex;
}

.sigle-download:hover {
  background: #4caf50;
  color: white;
}

.sigle-delete:hover {
  background: #4caf50;
  color: white;
}

.d-flex {
  display: flex;
}

.action-playback {
  width: 68px;
  height: 567px;
  background: #2b2f33;

  > div {
    width: 52px;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px;
    background: #53565a;
    border-radius: 2px;
    cursor: pointer;

    .svg-icon {
      width: 32px;
      height: 32px;
    }
  }
}

.video-html5 {
  video {
    width: 100%;
    max-height: 567px;
  }
}

:deep(.list-media) {
  width: 285px;
  background: #ebebec;
  max-height: 567px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 0px !important;

  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }

  .head {
    display: flex;
    margin-bottom: 8px;
    position: sticky;
    top: 0;
    z-index: 9;
    height: 46px;
    align-items: center;
    justify-content: space-between;
    padding: 0px 5px;
    background: #ebebec;

    .title {
      color: 212633;
      font-weight: 500;
    }

    .download-all {
      color: #525b73;
      display: flex;
      align-items: center;
      cursor: pointer;

      i {
        width: 20px;
        height: 20px;
        margin-right: 4px;
        color: #0078d4;

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    .download-all.success {
      i {
        color: #41c762;
      }
    }
  }

  > .row {
    padding: 0 !important;

    img {
      cursor: pointer;
      // border: 3px solid transparent;
      height: 68px;
      background: #a4a6a7;
      object-fit: contain;
    }

    video {
      height: 68px;
      cursor: pointer;
      width: 100%;
      background: black;
    }

    .active {
      img {
        border: 3px solid #0c98f5;
      }

      video {
        border: 3px solid #0c98f5;
      }
    }
  }
}

:deep(.show-media) {
  .el-image {
    display: block;

    img {
      background: #2b2f33;
      max-height: 567px;
      object-fit: contain;
    }
  }
}
</style>
