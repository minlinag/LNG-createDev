<template>
  <a-modal
    title="pdf阅读器"
    width="100%"
    :visible="pdfShow"
    @cancel="handleCancel"
    class="pdf-modal"
  >
    <div class="container">
      <iframe :src="pdfUrl" width="100%" height="100%"></iframe>
    </div>
    <template #footer>
      <div style="text-align: center">
        <a-button @click="handleCancel"> 取消 </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'PDF',
  props: {
    pdfShow: {
      type: Boolean,
      default() {
        return false;
      },
    },
    pdfUrl: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
    }
  },
  mounted() {
    // const { id } = this.$route.query
    // // 获取预览文件的完整接口地址，根据具体情况编写，反正path就是一个预览文件的接口地址
    // // const path = this.$api.filePreview(id)
    // let path = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

    // const fileUrl = '/pdfjs2/web/viewer.html'
    // // 生产环境下
    // if (process.env.NODE_ENV === 'production') {
    //   this.pdfUrl = path
    // } else {
    //   // 开发环境
    //   this.pdfurl = path
    // }
  },
  methods: {
    handleCancel() {
      this.$emit("pdfCancel")
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: calc(100vh - 100px);
}
.pdf-modal{
  ::v-deep .ant-modal-header{
    display: none;
  }
  ::v-deep .ant-modal-body{
    padding: 0;
  }
  ::v-deep .ant-modal-close{
    display: none;
  }
  ::v-deep .ant-modal{
    top: 20px;
  }
}

</style>
