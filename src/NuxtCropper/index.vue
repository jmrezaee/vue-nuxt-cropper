
<template>
  <div :class="c()">
    <img ref="img" :class="c('__img')" :src="src" />
  </div>
</template>

<script type="text/ecmascript-6">
import mixin from './mixins'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

// toBlob polyfill
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
      var binStr = atob(this.toDataURL(type, quality).split(',')[1])
      var len = binStr.length
      var arr = new Uint8Array(len)

      for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i)
      }

      callback(new Blob([arr], { type: type || 'image/png' }))
    },
  })
}

export default {
  name: 'NuxtCropper',
  mixins: [mixin],
  props: {
    src: {
      // image link
      type: String,
      default: undefined,
    },
    aspectRatio: {
      // Aspect ratio
      type: Number,
      default: 1,
    },
    quality: {
      // image quality
      type: Number,
      default: 1,
    },
    cropperOptions: {
      // The cropperjs configuration item will be merged into the configuration of initializing cropperjs. https://github.com/fengyuanchen/cropperjs
      type: Object,
      default: null,
    },
  },
  data () {
    return {
    }
  },
  watch: {
    async src (val) {
      if (val) {
        if (this.cropper) {
          this.cropper.replace(val)
        } else {
          await this.$nextTick()
          this.init()
        }
      }
    },
  },
  async mounted () {
    this.cropper = null // cropper instance
    if (this.src) {
      await this.$nextTick()
      this.init()
    }
  },
  methods: {
    init () {
      const options = {
        viewMode: 1, // Limit the crop box to no larger than the size of the canvas
        dragMode: 'move', // Move the canvas
        cropBoxMovable: false, // Move the crop box by dragging
        guides: false, // crop box dotted line
        center: false, // crop box centerline
        background: false, // Container grid background
        autoCropArea: 1, // Initialize the clipping area
        toggleDragModeOnDblclick: false, // Double-click on the cropper to toggle drag mode between Crop and Move
        aspectRatio: this.aspectRatio, // Aspect ratio
        ...this.cropperOptions,
      }
      this.cropper = new Cropper(this.$refs.img, options)
    },
    // Get the cropped image blob object
    getCroppedBlob (type = 'image/jpeg', quality = this.quality) {
      return new Promise((resolve, reject) => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        }, type, quality)
      })
    },
  },
}
</script>

<style lang="stylus">
$ = vue-nuxt-cropper;
$color = #fff;
.{$} {
  width: 100%;
  height: 100%;
  margin: auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  &__img {
    width: 100%;
  }

  .cropper-container {
    .cropper-view-box {
      outline: 1px solid $color;
      outline-color: rgba(255, 255, 255, 1);
    }

    .cropper-line {
      background-color: $color;
    }

    .cropper-point {
      background-color: $color;
      opacity: 1;
    }

    .point-e, .point-n, .point-w, .point-s {
      display: none;
    }

    .point-ne, .point-nw, .point-sw, .point-se {
      width: 10px;
      height: 10px;
      // z-index: -1;
      opacity: 0.8;
    }
  }
}
</style>
