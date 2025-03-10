<template>
  <div
    class="zoom-image w-full h-full relative"
    :class="className"
  >
    <el-image
      class="image absolute left-0 top-0 h-full w-full"
      :src="url"
    />
    <el-icon
      class="absolute icon"
      @click="handlePictureCardPreview"
      ><FullScreen
    /></el-icon>
  </div>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    destroy-on-close
    width="70%"
    top="3%"
  >
    <!-- <img
      class="w-full"
      :src="url"
      alt="Preview Image"
    /> -->
    <div
      id="zoomImage"
      :key="keyZoom"
      ref="zoomImage"
      :data-zoomist-src="imageUrl"
      alt=""
      class="w-full"
    />
  </el-dialog>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import Zoomist from 'zoomist'
import 'zoomist/dist/zoomist.min.css'
import { getImageUrl } from '@/utils/files'
const props = defineProps({
  url: String,
  className: String,
})

const dialogVisible = ref(false)
const imageUrl = ref()
const zoomImage = ref()
const keyZoom = ref(0)

const handlePictureCardPreview = () => {
  dialogVisible.value = true
  nextTick(() => {
    const element = zoomImage.value
    imageUrl.value = props.url
    nextTick(() => {
      const zoomist = new Zoomist(element, {
        bounds: true,
        slider: true,
        zoomer: true,
        zoomRatio: 0.5,
      })
    })
  })
}
</script>
<style lang="scss" scoped>
.zoom-image {
  .icon {
    display: none;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: white;
  }

  &:hover {
    .image {
      opacity: 0.3;
    }
    .icon {
      display: block;
    }
  }

  :deep(.el-image__inner) {
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
