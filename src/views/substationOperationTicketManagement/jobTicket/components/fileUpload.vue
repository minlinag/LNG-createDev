<template>
  <div class="clearfix" style="display: inline-block;">
    <a-upload
      :remove="handleRemove"
      :before-upload="beforeUpload"
      :accept="accept"
    >
      <a-button :class="className" :type="buttonType" :disabled="disabled">
        {{ Text }}
      </a-button>
    </a-upload>
    <!-- <div class="file_list">
      <div
        class="file_content"
        v-for="(item, index) in fileList"
        :key="item.id"
      >
        <div class="file_data">
          <span class="paper_clip_icon">
            <a-icon type="loading" v-if="item.fileLoading" />
            <a-icon type="paper-clip" v-else />
          </span>
          <span class="file_name" @click="downloadFileClick(item)">{{
            item.fileName
          }}</span>
          <span class="file_remove">
            <a-icon v-if="item.id" type="delete" @click="handleRemove(index)" />
          </span>
        </div>
        <div class="file_progress" v-if="item.progress">
          <a-progress
            :percent="item.progress"
            class="progress_style"
            :strokeWidth="4"
            style="width: 200px"
            :showInfo="false"
          />
        </div>
      </div>
    </div> -->
    <!-- <span v-if="fileType">支持扩展名：{{ fileType }}</span> -->
  </div>
</template>
<script>
import { MIMEFormat } from "@/utils/convertMIME";
import { uploadMultiFile } from '@/api/public'

import utils from "@/utils/url";
// import reqwest from 'reqwest';
export default {
  props: {
    accept: { // 文件检索类型
      type: String,
      default: () => {
        return ''
      },
    },
    buttonType: { // 按钮类型
      type: String,
      default: () => {
        return 'link'
      },
    },
    fileType: { // 限制上传类型
      type: String,
      default: () => {
        return ''
      },
    },
    fileSize: { // 限制大小 单位M
      type: String,
      default: () => {
        return ''
      },
    },
    fileQuantity: { // 上传个数
      type: Number,
      default: () => {
        return 0
      },
    },
    Text: { // 上传按钮名称
      type: String,
      default: "附件上传",
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false,
    },
    echoList: { // 是否禁用
      type: Array,
      default: () => {
        return []
      },
    },
    className: { // 是否禁用
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      fileList: [
        // { progress: 50, fileLoading: true, fileName: "asdasdasds", id: "22222" }
      ],
      uploading: false,
      urlIn: utils.baseURL,
    };
  },
  watch: {
    echoList: {
      handler(val) {
        if (val.length !== 0) {
          this.fileList = val
        }
      },
      deep: true,
      immediate: true,
    },
  },

  created() {
  },
  methods: {
    beforeUpload(file) {
      return new Promise(async (resolve, reject) => {
        let isSize
        let fileType
        if (!this.fileSize) {
          isSize = true
        } else {
          isSize = file.size / 1024 / 1024 < this.fileSize;
        }

        if (!isSize) {
          this.$message.error(`上传文件大小不能超过${this.fileSize}M!`);
          return false;
        }

        let fileTypeArray = this.fileType.split(',')

        if (!fileTypeArray.length == 0) {
          fileType = true

        } else {
          let MIMEFArray = MIMEFormat(fileTypeArray)
          if (MIMEFArray.includes(file.type)) {
            fileType = true
          } else {
            fileType = false
          }
        }

        if (!fileType) {
          this.$message.error(`上传文件类型应为${this.fileType}`);
          return false;
        }
        let currentIndex = this.fileList.length
        let fileData = {
          fileName: file.name,
          fileType: file.type,
          fileLoading: true,
          orderIndex: currentIndex
        }
        this.fileList = [...this.fileList, fileData];
        const data = new FormData();
        data.append("file", file); // 传文件
        uploadMultiFile(data, (e) => {
          let progress = (e.loaded / e.total).toFixed(2) * 100
          this.fileList.forEach((element, index) => {
            if (currentIndex == element.orderIndex) {
              this.$set(this.fileList[index], 'progress', progress);
              return false
            }
          });
        }).then((res) => {
          if (res.code == 200) {
            this.fileList.forEach((element, index) => {
              if (currentIndex == element.orderIndex) {
                let newItem = {
                  id: res.body[0].id,
                  fileName: res.body[0].fileName,
                  fileType: res.body[0].fileType,
                }
                this.$set(this.fileList, index, newItem);
                return false
              }
            });
            if (this.fileQuantity > 0) {
              if (this.fileList.length > this.fileQuantity) {
                let fileQuantityDifference = this.fileList.length - this.fileQuantity
                this.fileList.splice(0, fileQuantityDifference)
              }
            }
            this.closureProgress()
            this.$emit("fileChange", this.fileList)
          }
          return false
        }).catch(() => {
          this.fileList.forEach((element, index) => {
            if (currentIndex == element.orderIndex) {
              this.fileList.splice(index, 1)
            }
          });
          this.closureProgress()
          this.$message.error(`服务器发生错误，请稍后重试`);
          return false
        })
        return reject(false);  //加上这个就会阻止默认上传
      });
    },
    closureProgress() {
      setTimeout(() => {

      }, 200);
    },
    downloadFileClick(item) {
      window.location.href = Glod.DEVE_LOPMENT_ENVIRONMENT + 'fileinfo/downloadFileById?id=' + item.id + '&dType=d'
    },
    handleRemove(index) {
      this.fileList.splice(index, 1);
      this.$emit("fileListChange", this.fileList);
    },
    removeFile() {
      this.fileList = []
    },
  },
};
</script>
<style lang="less" scoped>
.file_list {
  margin-top: 5px;
  .file_content {
    .file_data {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 0 5px;
      height: 25px;
      .paper_clip_icon {
        display: inherit;
        height: 20px;
        margin-top: 6px;
      }
      .file_name {
        height: 20px;
        display: inline-block;
        margin-left: 10px;
        line-height: 20px;
        cursor: pointer;
      }
      .file_remove {
        display: inherit;
        height: 20px;
        opacity: 0;
        margin-left: 30px;
        margin-top: 6px;
      }
    }
    .file_data + .file_data {
      margin-top: 5px;
    }
    .file_data:hover {
      background-color: #e6f7ff;
      .file_remove {
        opacity: 1;
      }
    }
  }
  .file_progress {
  }
}
.progress_style {
}
</style>
