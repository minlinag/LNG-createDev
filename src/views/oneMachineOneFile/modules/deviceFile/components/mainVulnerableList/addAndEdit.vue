<template>
  <a-modal
    :title="formTitle"
    :visible="hiddenVisible"
    @cancel="cancelHidden"
    class="from-style bigModel"
    :footer="null"
    :maskClosable="false"
  >
    <a-form-model :model="formList" ref="hiddenFormRef" :rules="formListRules">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="零件名称" prop="partsName">
            <a-input v-model="formList.partsName" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="零件位置 " prop="partsLocation">
            <a-input v-model="formList.partsLocation" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="零件厂家" prop="partsManufacturer">
            <a-input v-model="formList.partsManufacturer" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="零件材质" prop="partsTexture">
            <a-input v-model="formList.partsTexture" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="零件规格尺寸" prop="partsSize">
            <a-input v-model="formList.partsSize" />
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
export default {
  name: 'addAndEdit',
  props: ['formTitle', 'formdata', 'hiddenVisible', 'stateMonitor'],
  data() {
    return {
      formList: {
        partsName: undefined,
        partsLocation: undefined,
        partsManufacturer: undefined,
        partsTexture: undefined,
        partsSize: undefined,
        equipmentCode: this.deviceCode
      },
      formListRules: {
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() { },

  created() { },
  watch: {
    hiddenVisible: {
      handler(newName) {
        if (newName) {
          this.formList = this.formdata
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
    flieChange(val) {
      this.flieChanges = val
    },
    flieChangeCheck(val) {
      this.flieChanges = val
    },
  },
}
</script>
<style scoped lang="less">
.add_and_edit {
  .ant-col-24 {
    width: 100%;
  }
}
</style>
