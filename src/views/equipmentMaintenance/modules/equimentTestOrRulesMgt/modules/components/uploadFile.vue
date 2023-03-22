<template>
  <div>
    <a-modal
      width="950px"
      :title="'上传证书'"
      :visible="uploadFileVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form-model ref="dataForm" :model="dataForm" :rules="rules">
        <a-col :span="12">
          <a-form-model-item
            label="设备名称"
            prop="eqmName"
            :labelCol="{ style: 'width: 120px' }"
          >
            <!-- v-model.trim去掉空格 -->
            <a-input
              v-model.trim="dataForm.eqmName"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="设备位号"
            prop="eqmNo"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model.trim="dataForm.eqmNo"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="检定日期"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-date-picker
              format="YYYY-MM-DD"
              v-model="dataForm.verificationDate"
              @change="dataChange"
              placeholder="请选择"
            ></a-date-picker>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="检定周期"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model.trim="dataForm.checkCycle"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="下次检定日期"
            :labelCol="{ style: 'width: 170px' }"
          >
            <!-- v-model.trim去掉空格 -->
            <a-input
              v-model.trim="dataForm.nextVerificationTime"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="检定单位"
            prop="verificationUnit"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-select
              v-model.trim="dataForm.verificationUnit"
              placeholder="请选择"
            >
              <a-select-option value="单位一">单位一</a-select-option>
              <a-select-option value="单位二">单位二</a-select-option>
              <a-select-option value="单位三">单位三</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="检定结果"
            prop="verificationResult"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-select
              v-model.trim="dataForm.verificationResult"
              placeholder="请选择"
            >
              <a-select-option value="合格"> 合格 </a-select-option>
              <a-select-option value="不合格"> 不合格 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="证书上传"
            :labelCol="{ style: 'width: 140px' }"
          >
            <importConpontsData
              :Text="'上传文件'"
              @fileChange="flieChange"
            ></importConpontsData>
          </a-form-model-item>
        </a-col>

        <a-col :span="24">
          <div class="footer">
            <a-button type="primary" @click="submitForm()"> 提交 </a-button>
            <a-button @click="handleCancel">取消</a-button>
          </div>
        </a-col>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { insertCertificate } from '@/api/equimentTestOrRulesMgt/waitVerifird/waitVerifird.js'
import importConpontsData from '@/components/importConpontsData'
export default {
  name: 'formModel',
  components: { importConpontsData },
  props: {
    uploadFileVisible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    temForm: {
      type: Object,
      default: () => {
        return null
      },
    },
  },
  watch: {
    temForm: {
      handler(newValue) {
        console.log(newValue)
        this.dataForm.eqmName = newValue.eqmName //设备名称
        this.dataForm.eqmNo = newValue.eqmNo //设备位号
        // this.dataForm.verificationDate = newValue.verificationDate //检定日期
        this.dataForm.checkCycle = newValue.checkCycle //检定周期
        // this.dataForm.nextVerificationTime = newValue.nextVerificationTime //下次检定日期
        this.dataForm.eqmCode = newValue.eqmCode
        this.dataForm.applicationFormNo = newValue.applicationFormNo
        this.dataForm.noticeNo = newValue.noticeNo
        this.dataForm.verificationNumber = newValue.verificationNumber
      },
      immediate: true,
      deep: true
    },
  },
  data() {
    return {
      file: null, //证书文件
      // 表单
      dataForm: {
        eqmName: '',
        eqmNo: '',
        verificationDate: '',
        checkCycle: '',
        nextVerificationTime: '',
        verificationUnit: undefined, //检定单位
        verificationResult: undefined,
      },
      // 校验
      rules: {
        eqmName: [
          { required: true, message: '设备名称不能为空', trigger: 'change' },
        ],
        eqmNo: [
          { required: true, message: '设备位号不能为空', trigger: 'change' },
        ],
        // verificationDate: [
        //   { required: true, message: '检定日期不能为空', trigger: 'change' },
        // ],
        // checkCycle: [
        //   { required: true, message: '检定周期不能为空', trigger: 'change' },
        // ],
        // nextVerificationTime: [
        //   {
        //     required: true,
        //     message: '下次检定日期不能为空',
        //     trigger: 'change',
        //   },
        // ],
        verificationUnit: [
          { required: true, message: '检定单位不能为空', trigger: 'change' },
        ],
        verificationResult: [
          { required: true, message: '检定结果不能为空', trigger: 'change' },
        ],
      },
    }
  },

  methods: {
    formClose() {
      this.$emit('close')
      // this.file = null
      // this.dataForm = {
      //   eqmName: '',
      //   eqmNo: '',
      //   verificationDate: '',
      //   checkCycle: '',
      //   nextVerificationTime: '',
      //   verificationUnit: undefined, //检定单位
      //   verificationResult: undefined,
      // }
      this.$refs.dataForm.clearValidate()
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
      if (this.file == null) {
        return this.$message.warning('请上传证书')
      }
      var formData = new FormData()
      formData.append('strJson', JSON.stringify(this.dataForm))
      formData.append('verificationCertificate', this.file) //培训材料
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          insertCertificate(formData).then((res) => {
            const { code } = res
            if (code == 200) {
              this.$parent.$parent.getMonthDetailsList()
              this.formClose()
              this.$message.success('上传证书成功')
            }
          })
        }
      })
    },
    flieChange(val) {
      console.log(val)
      this.file = val
    },
    dataChange(date, dateString) {
      // console.log(date, dateString)
      if (dateString) {
        let jDate = +new Date(dateString)
        let nextDate = jDate * 1 + this.dataForm.checkCycle * 24 * 60 * 60 * 100
        // console.log(nextDate);
        let next = this.getTime(nextDate)
        this.dataForm.nextVerificationTime = next
      }
    },
    getTime(val) {
      var date = new Date(val)
      // console.log(date);
      let n = date.getFullYear()
      let y =
        date.getMonth() + 1 > 0
          ? date.getMonth() + 1
          : '0' + (date.getMonth() + 1)
      let r = date.getDate() > 0 ? date.getDate() : '0' + date.getDate()
      return `${n}-${y}-${r}`
    },
  },
}
</script>
<style lang="less" scoped></style>
