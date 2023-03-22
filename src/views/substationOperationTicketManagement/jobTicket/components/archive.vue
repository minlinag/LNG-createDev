<template>
  <div>
    <a-form-model ref="formRef">
      <div class="form_piece_title">
        <span
          >变电站第{{
            $route.path == "/firstJobTicketApply" ||
            $route.path == "/firstJobTicketLedger"
              ? "一"
              : "二"
          }}种工作票</span
        >
        <div>
          <file-upload
            type="primary"
            :Text="'上传'"
            :accept="'image/*'"
            @fileChange="fileChange"
            :fileType="'pdf,jpg,png'"
            :fileQuantity="1"
            :buttonType="'primary'"
            >上传</file-upload
          >
          <a-button type="primary" @click="downloadClick">下载</a-button>
        </div>
      </div>
      <div v-viewer v-if="typeShow === 'img'">
        <img style="width: 100%" :src="previewUrl" />
      </div>
    </a-form-model>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Vue from 'vue'
Vue.use(VueViewer)
import fileUpload from './fileUpload.vue'
import { update } from "@/api/substationOperationTicketManagement/jobTicketApply.js"

import { downloadFileById } from '@/api/public'
import { MIMEFormat } from "@/utils/convertMIME";
export default {
  name: "jobTicketReview",
  components: {
    fileUpload
  },
  props: ['type', 'hiddenVisible', 'checkForm', 'formData', 'approvalShow'],
  data() {
    return {
      fileVal: {},
      formModel: {},
      previewUrl: '',
      typeShow: '',
    }
  },
  watch: {
    hiddenVisible: {
      handler(val) {
        if (!val) {
          this.$refs.formRef.clearValidate()
        } else {
          this.formModel = this.$lodash.cloneDeep(this.formData);
          if (this.formModel.attInfo) {
            this.fileVal = this.formModel.attInfo
            this.determineType(this.formModel.attInfo)
          }

        }
      },
      immediate: true,

    }
  },
  methods: {
    fileChange(file) {
      this.fileVal = file[0]
      this.determineType(this.fileVal)
    },
    determineType(fileVal) {
      let previewTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif'
      ]
      let fileType = fileVal.fileType.substr(1).toLowerCase()
      let fileTypeMIME = MIMEFormat([fileType])[0]
      if (previewTypes.includes(fileTypeMIME)) {
        this.previewDevice(fileVal, fileTypeMIME)
      }
    },
    previewDevice(item, fileTypeMIME) {
      downloadFileById({ id: item.id, dType: "b" }).then((response) => {
        // fileTypeMIME 为 application/pdf时执行
        if (fileTypeMIME == 'application/pdf') {
          let blob = new Blob([response instanceof Blob ? response : response.data], { type: fileTypeMIME });
          const href = URL.createObjectURL(blob);
          this.typeShow = 'pdf'
          this.previewUrl = href
        } else {
          this.typeShow = 'img'
          let blob = response
          if (blob.hasOwnProperty("data")) {
            blob = response.data
          }
          this.blobToDataURI(blob, (e) => {
            this.previewUrl = e
          })
        }
      });
    },
    downloadClick() {
      if (this.previewUrl) {
        this.downloadFile(this.fileVal.fileName, this.previewUrl)
      } else {
        this.$message.warn(`请先上传文件`)
      }
    },
    downloadFile(fileName, content) {
      let aLink = document.createElement('a')
      let blob = this.base64ToBlob(content) // new Blob([content]);
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      // aLink.dispatchEvent(evt);
      aLink.click()
    },
    // base64转blob
    base64ToBlob(code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1]) // 解码base64得到二进制字符串
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength) // 创建8位无符号整数值的类型化数组
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i) // 数组接收二进制字符串
      }
      return new Blob([uInt8Array], { type: contentType })
    },
    blobToDataURI(blob, callback) {
      var reader = new FileReader();
      if (blob) {
        reader.readAsDataURL(blob);
      }
      reader.addEventListener("load", function () {
        callback(reader.result);
      }, false);
    },
    confirm() {
      let formModel = this.formModel
      formModel.attInfo = this.$fileUploadJSON.toJsonString(
        this.fileVal
      );
      update(formModel).then(res => {
        if (res.code == '200') {
          this.$emit('cancel')
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.form_piece_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  span {
    font-size: 14px;
    font-weight: 700;
  }
}
.file_list {
  ::v-deep .ant-form-item {
    margin-bottom: 0px;
  }
  .delete_color {
    color: #ff4d4f;
  }
  .delete_color[disabled] {
    color: rgba(0, 0, 0, 0.25);
  }
  .download_style {
    padding-left: 5px;
    border-left: 1px solid #ccc;
  }
}
.ant-input[disabled] {
  color: #000;
}
#printContent {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
}
</style>