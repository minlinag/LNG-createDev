<template>
  <a-modal
    :title="formTitle"
    :visible="hiddenVisible"
    @cancel="cancelHidden"
    :footer="null"
    class="from-style middleModel"
    :maskClosable="false"
  >
    <a-form-model :model="formList" ref="hiddenFormRef">
      <a-row>
        <a-col :span="24">
          <a-form-model-item label="设备名称" prop="deviceName">
            <a-input disabled v-model="formList.deviceName" />
          </a-form-model-item>
        </a-col>

        <a-col :span="24">
          <a-form-model-item label=" 铭牌" prop="numbers">
            <file-upload
              :Text="'上传文件'"
              :accept="'image/*'"
              @fileChange="fileChange"
              :fileType="'jpg,png'"
              :fileQuantity="1"
              :echoList="echoFile"
              ref="fileUploadRef"
            ></file-upload>
          </a-form-model-item>
        </a-col>

        <a-col :span="24">
          <a-form-model-item label="备注" prop="remark">
            <a-input
              v-model="formList.remark"
              type="textarea"
              :auto-size="{ minRows: 6 }"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button type="primary" @click="saveForm"> 确定 </a-button>
      <a-button @click="cancelHidden">取消</a-button>
    </div>
  </a-modal>
</template>
<script>

import fileUpload from "@/components/upLoad/fileUpload";
export default {
  name: 'addAndEdit',
  components: {
    fileUpload,
  },
  props: ['formTitle', 'formdata', 'hiddenVisible', 'stateMonitor'],
  data() {
    return {
      formList: {
        deviceName: '',
        remark: '',
      },
      echoFile: [],
    }
  },
  mounted() { },

  created() { },
  watch: {
    hiddenVisible: {
      handler(newName) {
        if (newName) {
          this.formList = this.formdata
          if (this.formList.nameplateID) {
            this.echoFile = [{
              id: this.formList.nameplateID,
              fileName: this.formList.nameplateName,
              fileType: this.formList.nameplateType
            }]
          } else {
            this.echoFile = []
          }

        } else {
          this.$refs.fileUploadRef.removeFile()
        }
      },
    },
  },
  methods: {
    cancelHidden() {
      this.formClose()
    },
    saveForm() {
      this.onSubmit('save')
    },
    onSubmit(val) {
      this.$refs.hiddenFormRef.validate((valid) => {
        if (valid) {
          if (val == 'save') {
            this.$emit('submitForm', this.formList, this.stateMonitor)
            this.formClose()
          }
        } else {
          this.$message.warning('必填信息输入不完整')
          return false
        }
      })
    },

    formClose() {
      this.$emit('close')
    },
    fileChange(val) {
      if (val.length > 0) {
        this.formList.nameplateID = val[0].id
        this.formList.nameplateName = val[0].fileName
        this.formList.nameplateType = val[0].fileType
      } else {
        this.formList.nameplateID = ''
        this.formList.fileName = ''
        this.formList.fileType = ''
      }

    },
  }
}
</script>
<style scoped lang="less">
</style>
