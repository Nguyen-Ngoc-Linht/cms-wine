<template>
  <article ref="cont">
    <el-row
      :gutter="10"
      v-if="horizontal && canShowHorizontal"
    >
      <el-col :sm="19">
        <flicking
          ref="flicking2"
          :options="{ bounce: 30 }"
          :plugins="pluginsHorizontal"
        >
          <div
            v-for="panel in itemsMedia"
            class="flicking-panel full has-background-primary backdrop-opacity-10"
            :key="panel"
            :style="{ height: heightHorizontal.toString() + 'px' }"
          >
            {{ panel.type }}
            <div
              v-if="panel.type === 'image'"
              class="panel-image !top-0"
            >
              <ImageZoom
                :key="panel.url"
                :url="panel.url"
              />
            </div>
            <videoPlayBack
              v-else-if="panel.type === 'mileStone'"
              :camera-config="panel"
              :start-time-prop="panel.startTime"
              :camera-real="panel.id"
              :height-custom="220"
              class="playback-slider"
            />
            <video
              v-else-if="panel.type === 'video'"
              class="panel-image"
              :src="panel.url"
              controls
            ></video>
          </div>
        </flicking>
      </el-col>
      <el-col :sm="5">
        <flicking
          ref="flicking3"
          :options="{
            bound: true,
            bounce: 30,
            moveType: 'freeScroll',
            align: 'prev',
            horizontal: false,
            isClickable: true,
          }"
        >
          <div
            class="flicking-panel thumb has-background-primary"
            :style="{ height: thumbHorizontalHeight.toString() + 'px' }"
            v-for="panel in itemsMedia"
            :key="panel"
          >
            <el-image
              v-if="panel.type === 'image'"
              class="thumb-image"
              :src="panel.url"
              alt="Image"
            />
            <img
              v-else-if="panel.type === 'mileStone'"
              class="thumb-image"
              src="@/assets/imgs/default-imgVideo.png"
              alt="Image"
            />
            <div
              v-else-if="panel.type === 'video'"
              class="relative thumb-video"
            >
              <video
                class="thumb-image"
                :autoplay="false"
                :src="panel.url"
              ></video>
              <el-icon
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fs-30"
              >
                <VideoPlay class="width-30 height-30 text-white" />
              </el-icon>
            </div>
          </div>
        </flicking>
      </el-col>
    </el-row>
    <div
      class="flex flex-col"
      v-else
    >
      <flicking
        ref="flicking0"
        :options="{ bounce: 30 }"
        :plugins="plugins"
      >
        <div
          v-for="panel in itemsMedia"
          class="flicking-panel full has-background-primary backdrop-opacity-10"
          :style="{ height: height.toString() + 'px' }"
          :key="panel"
        >
          {{ panel.type }}
          <div
            v-if="panel.type === 'image'"
            class="panel-image !top-0"
          >
            <ImageZoom
              :key="panel.url"
              :url="panel.url"
            />
          </div>
          <videoPlayBack
            v-else-if="panel.type === 'mileStone'"
            :camera-config="panel"
            :start-time-prop="panel.startTime"
            :camera-real="panel.id"
            :height-custom="220"
            class="playback-slider"
          />
          <video
            v-else-if="panel.type === 'video'"
            class="panel-image"
            :src="panel.url"
            controls
          ></video>
        </div>
      </flicking>
      <flicking
        ref="flicking1"
        :options="{ bound: true, bounce: 30, moveType: 'freeScroll', align: 'prev' }"
      >
        <div
          class="flicking-panel thumb has-background-primary"
          :style="{ height: thumbHeight.toString() + 'px' }"
          v-for="panel in itemsMedia"
          :key="panel"
        >
          <el-image
            v-if="panel.type === 'image'"
            class="thumb-image"
            :src="panel.url"
            alt="Image"
          />
          <img
            v-else-if="panel.type === 'mileStone'"
            class="thumb-image"
            src="@/assets/imgs/default-imgVideo.png"
            alt="Image"
          />
          <div
            v-else-if="panel.type === 'video'"
            class="relative"
          >
            <video
              class="thumb-image"
              :autoplay="false"
              :src="panel.url"
            ></video>
            <el-icon
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fs-30"
            >
              <VideoPlay class="width-30 height-30 text-white" />
            </el-icon>
          </div>
        </div>
      </flicking>
    </div>
  </article>
</template>

<script>
import Flicking from '@egjs/vue3-flicking'
import { Sync } from '@egjs/flicking-plugins'
import { genKey } from '@/utils/app/string'
import { getVideoUrl, getImageUrl } from '@/utils/files'
import videoPlayBack from '../MediaCensorship/playback.vue'

import ImageZoom from '@/components/ImageZoom'

export default {
  components: {
    Flicking,
    videoPlayBack,
    ImageZoom,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    height: {
      type: [String, Number],
      default: '330',
    },
    heightHorizontal: {
      type: [String, Number],
      default: '470',
    },
    thumbHeight: {
      type: [String, Number],
      default: '80',
    },
    thumbHorizontalHeight: {
      type: [String, Number],
      default: '150',
    },
    minHorizontalWidth: {
      type: [String, Number],
      default: '768',
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      plugins: [],
      pluginsHorizontal: [],
      keyMedia: genKey(),
      contWidth: 0,
    }
  },
  mounted() {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
  },
  computed: {
    itemsMedia() {
      return this.items.reduce((arr, item) => {
        if (item.type === 'image') {
          arr.push({ ...item, url: getImageUrl(item.url) })
        }
        if (item.type === 'mileStone') {
          arr.push({ ...item })
        }
        if (item.type === 'video') {
          arr.push({ ...item, url: getVideoUrl(item.url) })
        }
        return arr
      }, [])
    },
    canShowHorizontal() {
      return this.contWidth > parseInt(this.minHorizontalWidth)
    },
  },
  watch: {
    items: {
      handler() {
        setTimeout(() => {
          this.keyMedia = genKey()
        }, 500)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    updateWidth() {
      this.contWidth = this.$refs.cont.offsetWidth

      if (this.horizontal) {
        this.$nextTick(() => {
          if (this.canShowHorizontal && this.pluginsHorizontal.length === 0) {
            this.pluginsHorizontal = [
              new Sync({
                type: 'index',
                synchronizedFlickingOptions: [
                  {
                    flicking: this.$refs.flicking2,
                    isSlidable: true,
                  },
                  {
                    flicking: this.$refs.flicking3,
                    isClickable: true,
                    activeClass: 'active',
                  },
                ],
              }),
            ]
            this.plugins = []
          } else if (!this.canShowHorizontal && this.plugins.length === 0) {
            this.plugins = [
              new Sync({
                type: 'index',
                synchronizedFlickingOptions: [
                  {
                    flicking: this.$refs.flicking0,
                    isSlidable: true,
                  },
                  {
                    flicking: this.$refs.flicking1,
                    isClickable: true,
                    activeClass: 'active',
                  },
                ],
              }),
            ]
            this.pluginsHorizontal = []
          }
        })
      } else if (this.plugins.length === 0) {
        this.plugins = [
          new Sync({
            type: 'index',
            synchronizedFlickingOptions: [
              {
                flicking: this.$refs.flicking0,
                isSlidable: true,
              },
              {
                flicking: this.$refs.flicking1,
                isClickable: true,
                activeClass: 'active',
              },
            ],
          }),
        ]
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateWidth)
  },
}
</script>

<style scoped lang="scss">
@keyframes glass {
  0% {
    background-color: transparent;
    backdrop-filter: blur(0px);
  }
  100% {
    background-color: transparent;
    backdrop-filter: blur(15px);
  }
}

.flicking-panel {
  align-items: flex-end;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 30px 20px;
  position: relative;
  width: 50%;
}

.flicking-panel.full {
  width: 100%;

  img,
  .panel-with-link {
    -webkit-user-drag: none;
    -ms-user-select: none;
    user-select: none;
  }

  .panel-image {
    position: absolute;
    bottom: 0;
    top: 0;
    right: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
  }
}

.flicking-panel.thumb {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
  padding: 0;
  width: 20%;

  &.active {
    border: 2px solid #409eff;
  }
}

.has-background-primary {
  background-color: #000;
}

.playback-slider {
  margin-bottom: -15px;
}

.vertical {
  .el-image,
  .thumb-video {
    max-height: 100%;
    overflow: hidden;
  }

  .flicking-panel.thumb {
    margin-left: 0;
    margin-bottom: 10px;
    padding: 0;
    width: 100%;
  }
}
</style>
