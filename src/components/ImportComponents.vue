<template>
  <div class="import" @click.stop>
    <a-button
      v-Add
      @click="uploadClick"
      class="buttonType btn_primary"
      type="primary"
    >
      <svg-icon class="button_svg" icon-class="import-icon" />
      {{ Text }}
    </a-button>
    <a-modal
      :title="`${Text}提示`"
      :visible="visible"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
    >
      <p v-for="(item, index) in modalHint" :key="index">
        {{ item }}
      </p>
      <template slot="footer">
        <a-button key="back" @click="handleCancel" style="margin-right: 15px">
          取消
        </a-button>
        <a-upload
          name="file"
          :data="data"
          :showUploadList="false"
          :accept="accept"
          :multiple="false"
          :action="urlIn + url"
          @change="handleChange"
        >
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOk"
          >
            确定
          </a-button>
        </a-upload>
      </template>
    </a-modal>
  </div>
</template>
<script>
import utils from "@/utils/url";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    url: String,
    accept: String,
    Text: {
      type: String,
      default: "导入",
    },
    modalHint: {
      type: Array,
      default: () => {
        return ["根据下载模板格式导入", "有id视为修改，无id视为新增"];
      },
    },
  },
  data() {
    return {
      confirmLoading: true,
      loading: false,
      urlIn: utils.baseURL,
      visible: false,
    };
  },
  mounted() {},
  methods: {
    uploadClick() {
      this.visible = true;
    },
    handleChange(info) {
      if (info.file.response) {
        if (info.file.response.code == 200) {
          if (info.file.response.msg) {
            this.$message.success(info.file.response.msg);
            this.visible = false;
            this.$emit("Import", info);
          } else {
            this.$message.success("上传成功");
            this.visible = false;
            this.$emit("Import", info);
          }
        } else {
          if (info.file.response.code == "500") {
            this.$message.error(info.file.response.msg);
          } else {
            this.$message.error("上传失败!");
          }
          this.$emit("Import", info);
        }
      }
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {},
  },
};
</script>
<style>
.import {
  display: inline-block;
}
</style>
