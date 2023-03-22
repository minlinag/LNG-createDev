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
          <a-form-model-item label="设备名称" prop="equipmentName">
            <a-input v-model="formList.equipmentName" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="设备位号 " prop="equipmentNo">
            <a-input v-model="formList.equipmentNo" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="设备型号" prop="equipmentType">
            <a-input v-model="formList.equipmentType" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="设备厂家" prop="equipmentManufacturer">
            <a-input v-model="formList.equipmentManufacturer" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="台数" prop="numbers">
            <a-input v-model="formList.numbers" />
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
export default {
  name: 'addAndEdit',
  props: ['formTitle', 'formdata', 'hiddenVisible', 'stateMonitor', 'deviceCode'],
  data() {
    return {
      formList: {
        equipmentName: '',
        equipmentNo: '',
        equipmentType: '',
        equipmentManufacturer: '',
        numbers: '',
        remark: '',
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
