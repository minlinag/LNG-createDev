<template>
  <div class="images" v-if="images.length > 0">
    <viewer
      :images="images"
      ref="viewer"
      @inited="inited"
      :options="viewerOptions"
    >
      <img v-for="src in images" :src="src" :key="src" v-show="false" />
    </viewer>
  </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Vue from 'vue'
Vue.use(VueViewer)
export default {
  props: {
    imgUrl: {
      type: String,
      default: () => {
        return ''
      },
    },
    imgShow: {
      type: Boolean,
      default: () => {
        return false
      },
    }
  },
  data() {
    let that = this
    this.viewerOptions = {
      backdrop: false, // 是否启用播放模态背景[布尔值/字符串：默认true](不启用时，点击空白处不会退出播放，仅点击右上角关闭按钮才会退出播放)
      inline: false, // 启用inline模式[布尔值：默认false]
      button: true, // 显示右上角关闭按钮[布尔值：默认true]
      navbar: false, // 显示缩略图导航[布尔值/数字：默认true]
      title: false, // 显示当前图片的标题(显示alt属性或从URL解析出的图片名称)[布尔值/数字/方法/数组：默认true]
      toolbar: {
        zoomIn: 4,
        zoomOut: 4,
        oneToOne: 4,
        reset: 4,
        play: {
          show: 4,
          size: 'large',
        },
        rotateLeft: 4,
        rotateRight: 4,
        flipHorizontal: 4,
        flipVertical: 4,
        download: function () {
          window.open(that.images[0], '_blank');
        },
      }, // 显示工具栏、自定义工具栏[布尔值/数字/对象：默认true]
      tooltip: true, // 显示缩放百分比[布尔值：默认true]
      movable: true, // 图片是否可移动[布尔值：默认true]
      zoomable: true, // 图片是否可缩放[布尔值：默认true]
      rotatable: true, // 图片是否可旋转[布尔值：默认true]
      scalable: true, // 图片是否可翻转[布尔值：默认true]
      transition: true, // 使用CSS3过渡[布尔值：默认true]
      fullscreen: true, // 播放时是否全屏[布尔值/全屏配置：默认true]
      keyboard: true, // 是否支持键盘[布尔值：默认true]
    }
    return {
      images: [],
    };
  },
  watch: {
    imgShow: {
      handler(val) {
        if (val) {
          this.images = [this.imgUrl]
          this.$nextTick(() => {
            this.show()
          })
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    inited(viewer) {
      let that = this
      this.$viewer = viewer
      viewer.hidden = function () {
        that.$emit("imgCancel")
      }
    },
    show() {
      setTimeout(() => {
        this.$refs.viewer.$viewer.show()
      }, 1000)
    },
  },
}
</script>

<style lang="less">
@font-face {
  font-family: "downloadFont";
  src: url("../../assets/fonts/downloadFont.ttf") format("truetype");
}
.viewer-download {
  color: #fff;
  font-size: 0.75rem;
  line-height: 1.5rem;
  text-align: center;
  font-family: "downloadFont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.viewer-download::before {
  content: "\f0304";
}
</style>