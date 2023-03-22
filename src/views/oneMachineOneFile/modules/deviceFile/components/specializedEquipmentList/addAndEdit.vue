<template>
  <a-modal
    :title="formTitle"
    :visible="hiddenVisible"
    @cancel="cancelHidden"
    :footer="null"
    class="from-style bigModel"
    :maskClosable="false"
  >
    <a-form-model :model="formList" ref="hiddenFormRef" :rules="formListRules">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="物资名称" prop="materialName">
            <a-input v-model="formList.materialName" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="规格型号 " prop="productModel">
            <a-input v-model="formList.productModel" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="使用部位/用途" prop="partUsed">
            <a-input v-model="formList.partUsed" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="单价" prop="referenceUnitPrice">
            <a-input v-model="formList.referenceUnitPrice" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="厂家名称" prop="manufacturerName">
            <a-input v-model="formList.manufacturerName" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="联系方式" prop="contactWay">
            <a-input v-model="formList.contactWay" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="采购周期" prop="purchasingCycle">
            <a-input v-model="formList.purchasingCycle" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item
            label="专用工具需求量"
            prop="professionalToolsDemand"
          >
            <a-input v-model="formList.professionalToolsDemand" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="在用量" prop="useLevel">
            <a-input v-model="formList.useLevel" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ span: 7 }"
            label="实际库存量"
            prop="demandStock"
          >
            <a-input v-model="formList.demandStock" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="采购需求量" prop="quantityPurchase">
            <a-input v-model="formList.quantityPurchase" />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="记录人" prop="noteKeeper">
            <a-input v-model="formList.noteKeeper" />
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
        materialName: '',
        productModel: '',
        partUsed: '',
        referenceUnitPrice: '',
        manufacturerName: '',
        contactWay: '',
        purchasingCycle: '',
        professionalToolsDemand: '',
        useLevel: '',
        demandStock: '',
        quantityPurchase: '',
        noteKeeper: '',
        remark: '',
        equipmentCode: this.deviceCode
      },
      formListRules: {
        materialName: [
          { required: true, message: '请输入物资名称', trigger: 'blur' },
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
