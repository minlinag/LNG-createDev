<template>
  <div>
    <a-modal
      width="950px"
      :title="'送审'"
      :visible="submitCensorshipVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form-model ref="dataForm" :model="dataForm" :rules="rules">
        <a-col :span="12">
          <a-form-model-item
            label="申请单编号"
            :labelCol="{ style: 'width: 140px' }"
          >
            <!-- v-model.trim去掉空格 -->
            <a-input
              v-model.trim="dataForm.applicationFormNo"
              placeholder="系统自动生成"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="设备名称"
            :labelCol="{ style: 'width: 120px' }"
          >
            <!-- v-model.trim去掉空格 -->
            <a-input
              v-model="equipmentName"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="设备位号"
            :labelCol="{ style: 'width: 120px' }"
          >
            <!-- v-model.trim去掉空格 -->
            <a-input
              v-model.trim="equipmentNo"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="所属设备"
            :labelCol="{ style: 'width: 120px' }"
          >
            <!-- v-model.trim去掉空格 -->
            <a-input
              v-model.trim="belongingTo"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="12">
          <a-form-model-item
            label="紧急程度"
            prop="urgencyDegree"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-select
              v-model.trim="dataForm.urgencyDegree"
              placeholder="请选择"
            >
              <a-select-option value="一般"> 一般 </a-select-option>
              <a-select-option value="紧急"> 紧急 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="12">
          <a-form-model-item
            label="是否具备检维修条件"
            prop="whetherCanCheckMaintenance"
            :labelCol="{ style: 'width: 290px' }"
          >
            <a-select
              placeholder="请选择"
              v-model.trim="dataForm.whetherCanCheckMaintenance"
            >
              <a-select-option value="Y"> 是 </a-select-option>
              <a-select-option value="N"> 否 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="24">
          <a-form-model-item
            label="内容描述"
            prop="contentDescription"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-textarea
              v-model.trim="dataForm.contentDescription"
              placeholder="请输入"
            ></a-textarea>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-model-item
            label="申请人"
            prop="j"
            :labelCol="{ style: 'width: 115px' }"
          >
            <a-input
              v-model.trim="dataForm.j"
              disabled
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
        </a-col> -->
        <!-- <a-col :span="12">
          <a-form-model-item
            label="申请时间"
            prop="k"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              v-model.trim="dataForm.k"
              disabled
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="24">
          <div class="footer">
            <a-button type="primary" @click="submitForm"> 提交 </a-button>
            <a-button @click="handleCancel">取消</a-button>
          </div>
        </a-col>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { insert } from '@/api/equimentTestOrRulesMgt/waitVerifird/waitVerifird.js'

export default {
  name: 'formModel',
  props: {
    submitCensorshipVisible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    list: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      equipmentName: '',
      equipmentNo: '',
      belongingTo: '',
      // 表单
      dataForm: {
        applicationFormNo: '', //申请单编号
        list: [],
        urgencyDegree: undefined, //紧急程度
        whetherCanCheckMaintenance: undefined, //是否具备检维修条件
      },
      // 校验
      rules: {
        urgencyDegree: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        whetherCanCheckMaintenance: [
          {
            required: true,
            message: '是否具备检维修条件不能为空',
            trigger: 'blur',
          },
        ],
        contentDescription: [
          { required: true, message: '内容描述不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  created() {},
  watch: {
    list: function (newValue) {
      this.dataForm.list = newValue
      // console.log(this.list);
      this.equipmentName = ''
      this.equipmentNo = ''
      this.belongingTo = ''
      newValue.forEach((element) => {
        // console.log(element, '123456')
        this.equipmentName += element.eqmName + '，'
        this.equipmentNo += element.eqmNo + '，'
        this.belongingTo += element.belongToEqm + '，'
      })
    },
  },
  methods: {
    formClose() {
      this.$emit('close')
      this.equipmentName = ''
      this.equipmentNo = ''
      this.belongingTo = ''
      // 表单
      this.dataForm = {
        applicationFormNo: '', //申请单编号
        list: [],
        urgencyDegree: undefined, //紧急程度
        whetherCanCheckMaintenance: undefined, //是否具备检维修条件
      }
      this.$refs.dataForm.clearValidate()
      // this.$parent.selectedRowKeys = []
    },
    onChange(value) {
      console.log('changed', value)
    },
    // 关闭
    handleCancel() {
      this.formClose()
    },
    // 提交
    submitForm() {
      // console.log(this.dataForm);
      if (this.equipmentName == '') {
        this.$message.warning('请从待检定页面选择送检的设备')
      }
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          await insert(this.dataForm)
          // console.log(code);
          this.$message.success('送审成功')
          this.$parent.$parent.getMonthDetailsList()
          this.formClose()
        }
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
