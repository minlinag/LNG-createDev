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
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              :labelCol="{ style: 'width: 200px' }"
              label="缺陷处理状态:"
              prop="defectTreatStatus"
            >
              <a-input
                v-model.trim="dataForm.defectTreatStatus"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="申请单编号" prop="informNo">
              <a-input
                v-model.trim="dataForm.informNo"
                placeholder="系统自动生成申请单编号"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="设备名称" prop="deviceName">
              <a-input
                v-model.trim="dataForm.deviceName"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="position-apply">
          <a-col :span="8">
            <a-form-model-item label="设备位号" prop="deviceNo">
              <a-input
                v-model.trim="dataForm.deviceNo"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="作业区域" prop="workLocation">
              <a-select
                v-model.trim="dataForm.workLocation"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in selectData"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="是否具备检维修条件"
              prop="whetherHaveInspectionCondition"
            >
              <a-select
                v-model.trim="dataForm.whetherHaveInspectionCondition"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in isRepair"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="描述" prop="planDescription">
              <a-textarea
                v-model.trim="dataForm.planDescription"
                placeholder="请输入"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="备注">
              <a-textarea
                v-model.trim="dataForm.remarks"
                placeholder="请输入"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button type="primary" @click="handleOk()"> 确定 </a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { encode } from '@/api/dataDictionary'
import { addApplyWithAtt } from '@/api/equipmentOperationMgt/equipmentExceptionPermissionRecord/equipmentExceptionPermissionRecord.js'
export default {
  name: 'applyModel',
  props: {
    title: {
      type: String,
      default: '申请单',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 作业区域下拉框
      selectData: [],
      // 表单数据
      dataForm: {
        defectTreatStatus: '',
        informNo: '',
        deviceName: '',
        deviceNo: '',
        workLocation: undefined,
        whetherHaveInspectionCondition: '',
        remarks: '',
        planDescription: '',
        defectId: '',
      },
      // 识别方式下拉框
      isRepair: [
        {
          label: '是',
          value: '是',
        },
        {
          label: '否',
          value: '否',
        },
      ],
      // 校验
      rules: {
        defectTreatStatus: [
          { required: true, message: '缺陷处理状态不能为空', trigger: 'blur' },
        ],
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'change' },
        ],
        deviceNo: [
          { required: true, message: '设备位号不能为空', trigger: 'change' },
        ],
        workLocation: [
          { required: true, message: '作业区域不能为空', trigger: 'change' },
        ],
        whetherHaveInspectionCondition: [
          {
            required: true,
            message: '是否具有检维修条件不能为空',
            trigger: 'change',
          },
        ],
      },
    }
  },
  methods: {
    handleOpen(row) {
      row.deviceNo = row.deviceBitNum
      row.defectId = row.id
      Object.keys(this.dataForm).forEach((key) => {
        this.dataForm[key] = row[key]
      })
      this.encode()
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-apply')
    },
    // 关闭
    handleCancel() {
      this.$refs.dataForm.resetFields()
      this.$emit('update:visible', false)
    },
    // 确定
    handleOk() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          addApplyWithAtt(this.dataForm).then((res) => {
            if (res.code == 200) {
              this.$message.success('整改成功')
              this.$parent.$parent.getList()
              this.handleCancel()
            }
          })
        }
      })
    },
    success() {},
    // 数据字典-作业区域
    encode() {
      encode('AQYH-QYMC').then((res) => {
        this.selectData = []
        res.body.data.forEach((item) => {
          this.selectData.push({
            value: item.dictcode,
            label: item.dictname,
          })
        })
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
