<template>
  <div class="clearfix">
    <a-upload
      :file-list="fileList"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      :accept="accept"
    >
      <a-button :disabled="disabled">
        <a-icon type="upload" /> {{ Text }}
      </a-button>
    </a-upload>
  </div>
</template>
<script>
import requirt from "@/utils/request";

import utils from "@/utils/url";
// import reqwest from 'reqwest';
export default {
  data() {
    return {
      fileList: [],
      uploading: false,
      urlIn: utils.baseURL,
    };
  },
  props: {
    datas: String,
    url: String,
    accept: {
      type: String,
      default: () => {
        return ''
      },
    },
    Text: {
      type: String,
      default: "附件上传",
    },
    fileListName: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  created() {
  },
  watch: {
    datas(val) {
      console.log(val);
    },
  },
  methods: {
    removeFile() {
      this.fileList = []
    },
    oneFile() {
      this.fileList = [this.fileList.pop()]
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.$emit("removeFile");//单个文件
      this.$emit("fileListChange", {
        list: newFileList,
        name: this.fileListName,
      });
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      this.$emit("fileChange", file);
      this.$emit("fileListChange", {
        list: this.fileList,
        name: this.fileListName,
      });
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file);
      });
      this.uploading = true;
      requirt({
        url: this.urlIn + "/fileinfo/uploadFile",
        method: "post",
        data: formData,
      }).then((res) => {
        console.log(res);
      });
      // You can use any AJAX library you like
      // reqwest({
      //     url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      //     method: 'post',
      //     processData: false,
      //     data: formData,
      //     success: () => {
      //         this.fileList = [];
      //         this.uploading = false;
      //         this.$message.success('upload successfully.');
      //     },
      //     error: () => {
      //         this.uploading = false;
      //         this.$message.error('upload failed.');
      //     },
      // });
    },
  },
};
</script>
