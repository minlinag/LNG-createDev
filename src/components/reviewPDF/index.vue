<template>
  <div>
    <div class="tools" id="pdfScroll" @scroll="scrollBottom">
      <!-- <a-button
        :theme="'default'"
        type="submit"
        :title="'基础按钮'"
        @click.stop="prePage"
        class="mr10"
      >
        上一页</a-button
      >
      <a-button
        :theme="'default'"
        type="submit"
        :title="'基础按钮'"
        @click.stop="nextPage"
        class="mr10"
      >
        下一页</a-button
      > 
      <div class="page">{{ pageNum }}/{{ pageTotalNum }}</div>
      -->
      <!-- <bk-button
        :theme="'default'"
        type="submit"
        :title="'基础按钮'"
        @click.stop="clock"
        class="mr10"
      >
        顺时针</bk-button
      >
      <bk-button
        :theme="'default'"
        type="submit"
        :title="'基础按钮'"
        @click.stop="counterClock"
        class="mr10"
      >
        逆时针</bk-button
      > -->
      <pdf ref="pdf" :src="url" v-for="i in numPages" :key="i" :page="i"> </pdf>
    </div>
    <!-- :page="pageNum"
      :rotate="pageRotate"
      @progress="loadedRatio = $event"
      @page-loaded="pageLoaded($event)"
      @num-pages="pageTotalNum = $event"
      @error="pdfError($event)"
      @link-clicked="page = $event" -->
  </div>
</template>
<script>
import pdf from 'vue-pdf'
import { downloadFileById } from '@/api/public'
export default {
  name: 'reviewPDF',
  components: {
    pdf
  },
  props: {
    echoList: {
      type: Array,
      default: () => {
        return []
      },
    }
  },
  data() {
    return {
      url: "",
      numPages: 1,
      timer: null
    }
  },
  watch: {
    echoList: {
      handler: function (val, oldVal) {
        this.url = ""
        this.numPages = 1
        if (val.length > 0) {
          this.previewDevice(val[0], 'application/pdf')
          this.timer = null
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted: function () {

  },
  methods: {
    getNumPages(url) {
      var loadingTask = pdf.createLoadingTask(url)
      loadingTask.promise.then(pdf => {
        this.url = loadingTask
        this.numPages = pdf.numPages
      }).catch((err) => {
        console.error('pdf加载失败')
      })
    },
    previewDevice(item, fileTypeMIME) {
      this.revokeUrl(this.url)
      downloadFileById({ id: item.id, dType: "b" }).then((response) => {
        let blob = new Blob([response instanceof Blob ? response : response.data], { type: fileTypeMIME });
        console.log(blob);
        const href = URL.createObjectURL(blob);
        this.previewShow = true
        this.getNumPages(href)
      });
    },
    revokeUrl(registeredUrl) {
      if (registeredUrl) {
        URL.revokeObjectURL(registeredUrl);
      }
    },
    scrollBottom() {
      // 防抖 500ms
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        const el = document.querySelector('#pdfScroll');
        let scrollTop = el.scrollTop || el.scrollTop;
        let clientHeight = el.clientHeight;
        let scrollHeight = el.scrollHeight;
        console.log(scrollTop, clientHeight, scrollHeight, 'scrollBottom');
        // scrollTop 向上取整
        if (Math.ceil(scrollTop) + clientHeight >= scrollHeight) {
          this.$emit('allow')
        }
      }, 500)


    },
  },
  beforeDestroy() {
    this.revokeUrl(this.url)
  },

}
</script>
<style lang="less" scoped>
.tools {
  height: 215px;
  width: 100%;
  overflow: auto;
}
</style>
