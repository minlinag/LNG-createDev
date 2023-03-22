<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
      class="from-style bigModel"
      :maskClosable="false"
      destroyOnClose
    >
      <a-form-model ref="dataForm" :model="dataForm" :rules="rules">
        <a-row class="position-addExc">
          <a-col :span="8">
            <a-form-model-item label="缺陷处理状态" prop="defectTreatStatus">
              <a-input
                v-model.trim="dataForm.defectTreatStatus"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="缺陷编号" prop="defectNo">
              <a-input
                v-model.trim="dataForm.defectNo"
                placeholder="系统自动生成申请编号"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="识别方式" prop="recognitionWay">
              <a-select
                ref="select"
                v-model="dataForm.recognitionWay"
                placeholder="请选择"
                :options="changeTypeOptions"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in changeTypeOptions"
                  :key="item.id"
                  :value="item.value"
                  :label="item.label"
                >
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <div class="buttonInput">
            <a-col :span="6">
              <a-form-model-item label="设备名称" prop="deviceName">
                <a-input
                  v-model.trim="dataForm.deviceName"
                  placeholder="请选择"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="2">
              <a-form-model-item>
                <a-button type="primary" @click="equipmentVisible = true"
                  >选择</a-button
                >
              </a-form-model-item>
            </a-col>
          </div>
          <a-col :span="8">
            <a-form-model-item label="设备位号" prop="deviceBitNum">
              <a-input
                v-model.trim="dataForm.deviceBitNum"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="所属设备" prop="belongDevice">
              <a-input
                v-model.trim="dataForm.belongDevice"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="异常/缺陷描述" prop="d">
              <a-textarea
                v-model.trim="dataForm.d"
                placeholder="请输入"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="建议整改措施">
              <a-textarea
                v-model.trim="dataForm.f"
                placeholder="请输入"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="相关附件" prop="attachment">
              <importConpontsData
                v-model.trim="dataForm.attachment"
                :Text="'上传文件'"
                ref="importConpontsData"
                @fileChange="flieChange"
              ></importConpontsData>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row> </a-row>
      </a-form-model>
      <equipmentModel
        ref="equipmentModel"
        :equipmentVisible.sync="equipmentVisible"
        @selectedClic="selectedClic"
      />
      <div class="ant-modal-footer">
        <a-button type="primary" @click="handleOk()"> 确定 </a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import importConpontsData from '@/components/importConpontsData'
import equipmentModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue'
import moment from 'moment'
import { saveData } from '@/api/equipmentOperationMgt/equipmentExceptionPermissionRecord/equipmentExceptionPermissionRecord.js'
export default {
  name: 'addModel',
  components: { importConpontsData, equipmentModel },
  props: {
    title: {
      type: String,
      default: '新增',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 弹窗
      equipmentVisible: false,
      // 文件
      file: [],
      // 表单数据
      dataForm: {
        defectTreatStatus: '未处理',
        defectNo: '',
        recognitionWay: undefined,
        deviceName: '',
        deviceBitNum: '',
        deviceNo: '',
        belongDevice: '',
      },
      // 识别方式下拉框
      changeTypeOptions: [
        {
          label: '人工巡检',
          value: '人工巡检',
        },
        {
          label: '智能巡检',
          value: '智能巡检',
        },
      ],
      // 校验
      rules: {
        defectTreatStatus: [
          { required: true, message: '缺陷处理状态不能为空', trigger: 'blur' },
        ],
        defectNo: [
          { required: true, message: '缺陷编号不能为空', trigger: 'blur' },
        ],
        recognitionWay: [
          { required: true, message: '识别方式不能为空', trigger: 'change' },
        ],
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'change' },
        ],
        deviceBitNum: [
          { required: true, message: '设备位号不能为空', trigger: 'change' },
        ],
        belongDevice: [
          { required: true, message: '所属设备不能为空', trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    handleOpen() {
      const time = moment().format('YYYYMMDDHHmmss')
      this.dataForm.defectNo = `QX${time}`
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-addExc')
    },
    // 文件
    flieChange(val) {
      this.$refs.importConpontsData.oneFile()
      this.file = val
      this.dataForm.attachment = val.name
    },
    // 关闭
    handleCancel() {
      this.$refs.importConpontsData.removeFile()
      this.$refs.dataForm.resetFields()
      this.$refs.equipmentModel.reset()
      this.file = ''
      this.$emit('update:visible', false)
    },
    // 确定
    handleOk() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let data = new FormData()
          data.append('strJson', JSON.stringify(this.dataForm))
          data.append('file', this.file)
          saveData(data).then((res) => {
            if (res.code == 200) {
              this.$message.success('新增成功')
              this.$parent.$parent.getList()
              this.handleCancel()
            }
          })
        }
      })
    },
    success() {},
    // 设备名称弹框的选择
    selectedClic(value) {
      this.dataForm.deviceName = value.eqm_sbmc
      this.dataForm.deviceBitNum = value.eqm_sbwh
      this.dataForm.deviceNo = value.eqm_sbbm
      this.dataForm.belongDevice = value.eqm_sssb
      this.equipmentVisible = false
    },
  },
}
</script>
<style lang="less" scoped></style>
