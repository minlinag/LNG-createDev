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
          <a-form-model-item label="责任人" prop="principal">
            <a-input v-model="formList.principal" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="责任单位 " prop="accountabilityUnit">
            <a-input v-model="formList.accountabilityUnit" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="起止时间" prop="startTime">
            <a-range-picker
              v-model="formTimeData"
              @change="onChange"
              valueFormat="YYYY-MM-DD"
              :placeholder="['开始日期', '结束日期']"
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
  props: ['formTitle', 'formdata', 'hiddenVisible'],
  data() {
    return {
      formList: {
        principal: '',
        accountabilityUnit: '',
        startTime: '',
        endTime: '',
        equipmentCode: this.deviceCode
      },
      formTimeData: [],
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
    onChange(data) {
      if (data.length > 0) {
        this.formList.startTime = data[0]
        this.formList.endTime = data[1]
      } else {
        this.formList.startTime = ''
        this.formList.endTime = ''
      }
    },
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
            this.$emit('submitForm', this.formList)
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
