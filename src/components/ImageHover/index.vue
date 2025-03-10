<template>
  <el-popover
    placement="left-start"
    title=""
    popper-class="p-0"
    :width="widthPopover"
    :visible-arrow="false"
    trigger="hover"
  >
    <img
      class="full-image"
      :style="styleImageFull"
      :src="getImageUrl(image)"
      alt=""
    />
    <template v-slot:reference>
      <div>
        <img
          :style="styleImage"
          :src="getImageUrl(image)"
          @error="handleImageError"
          alt=""
          @mousemove="mouseOver"
        />
      </div>
    </template>
  </el-popover>
</template>
<script type="text/javascript">
import { getImageUrl } from '@/utils/files'
import nodata_img from '@/assets/imgs/no-image.png'

export default {
  name: 'ImageHover',
  props: {
    image: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 150,
    },
  },
  data() {
    return {
      flag: false,
      screenX: 0,
      heightImage: 0,
      widthImage: 0,
    }
  },
  computed: {
    styleImage() {
      return {
        height: this.height + 'px',
      }
    },
    styleImageFull() {
      return {
        height: '450px',
      }
    },
    scale() {
      return 450 / this.heightImage
    },
    widthPopover() {
      return this.widthImage * this.scale
    },
  },
  created() {},
  methods: {
    getImageUrl,
    mouseOver(e) {
      this.heightImage = 0
      this.heightImage = e.target.naturalHeight
      this.widthImage = e.target.naturalWidth
    },
    mouseout(e) {},
    handleImageError(event) {
      event.target.src = nodata_img
    },
  },
}
</script>
