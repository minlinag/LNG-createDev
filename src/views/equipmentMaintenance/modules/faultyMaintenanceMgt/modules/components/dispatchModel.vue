<template>
  <div>
    <a-modal
      class="from-style bigModel"
      :title="title"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form-model ref="dispatchForm" :model="dispatchForm" :rules="rules">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="派工状态">
              <a-input v-model="dispatchForm.recordStatus" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="工单编号">
              <a-input
                v-model="dispatchForm.informNo"
                disabled
                placeholder="系统自动生成工单编号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="关联申请单">
              <a-input
                v-model="dispatchForm.inspectionPlanNo"
                disabled
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-col :span="8">
          <a-form-model-item label="设备名称">
            <a-input
              v-model="dispatchForm.deviceName"
              disabled
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <!-- <a-col
            :span="2"
          >
            <a-form-model-item>
              <a-button type="primary"  disabled>选择</a-button>
            </a-form-model-item>
          </a-col> -->
        <a-col :span="8">
          <a-form-model-item label="设备位号" prop="deviceNo">
            <a-input
              disabled
              v-model="dispatchForm.deviceNo"
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
        </a-col>

        <a-row>
          <a-col :span="8">
            <a-form-model-item label="负责人" prop="workPersonInCharge">
              <a-input
                v-model="dispatchForm.workPersonInCharge"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="接收站联系人"
              prop="stationPersonInCharge"
            >
              <a-input
                v-model="dispatchForm.stationPersonInCharge"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="维护级别" prop="maintenanceLevel">
              <a-select
                v-model="dispatchForm.maintenanceLevel"
                placeholder="请选择"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in maintenanceLevel"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="作业区域" prop="workArea">
              <a-select v-model="dispatchForm.workArea" placeholder="请选择">
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
              label="是否有检维修规程"
              prop="whetherHaveInspectionRule"
            >
              <a-select
                v-model="dispatchForm.whetherHaveInspectionRule"
                placeholder="请选择"
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
          <a-col :span="8">
            <a-form-model-item label="作业单位" prop="workUnit">
              <a-input
                v-model="dispatchForm.workUnit"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="检维修类型" prop="maintenanceType">
              <a-select
                v-model="dispatchForm.maintenanceType"
                placeholder="请选择"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in maintenanceTypeOptions"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
            <a-form-model-item label="建议计划作业日期" prop="time">
              <a-range-picker
                valueFormat="YYYY-MM-DD"
                v-model="dispatchForm.time"
                :disabled-date="disabledDate"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="检维修名称" prop="inspectionName">
              <a-textarea
                v-model="dispatchForm.inspectionName"
                placeholder="请输入"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="备注" prop="remarks">
              <a-textarea v-model="dispatchForm.remarks" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="footer contneFormBtnStyle ant-modal-footer">
        <a-button type="primary" @click="handleOk()"> 派工 </a-button>
        <a-button @click="handleCancel()"> 取消 </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { encode } from '@/api/dataDictionary'
import { addListForPage } from '@/api/dispatching/noticeDocuments.js'
import equipmentModel from './equipmentModel.vue'
import moment from 'moment'
export default {
  name: 'dispatchModel',
  components: { equipmentModel },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '派工单',
    },
    tableList: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      equipmentVisible: false,
      // 表单数据
      dispatchForm: {
        // recordStatus: '',
        // informNo:'',
        // relevancyRequisition: '',
        // deviceName: '',
        // deviceNo: '',
        // equipment: '',
        // maintenanceLevel: undefined,
        // workPersonInCharge: '',
        // stationPersonInCharge: '',
        // workArea: undefined,
        // whetherHaveInspectionRule: undefined,
        // workUnit: '',
        // maintenanceType: undefined,
        // inspectionName: '',
        // remarks: '',
        // time: []
      },
      // 是否维修//是否在账
      isRepair: [
        { value: '1', label: '是' },
        { value: '0', label: '否' },
      ],
      // 检维修类型
      maintenanceTypeOptions: [
        { value: '预防性', label: '预防性' },
        { value: '故障性', label: '故障性' },
        { value: '其他', label: '其他' },
      ],
      // 维护级别
      maintenanceLevel: [
        {
          value: '一级',
          label: '一级',
        },
        {
          value: '二级',
          label: '二级',
        },
        {
          value: '三级',
          label: '三级',
        },
        {
          value: '四级',
          label: '四级',
        },
        {
          value: '五级',
          label: '五级',
        },
        {
          value: '六级',
          label: '六级',
        },
      ],
      // 作业区域
      selectData: [],
      // 校验
      rules: {
        a: [{ required: true, message: '工单编号不能为空', trigger: 'blur' }],
        relevancyRequisition: [
          { required: true, message: '关联申请单不能为空', trigger: 'change' },
        ],
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'change' },
        ],
        deviceNo: [
          { required: true, message: '设备位号不能为空', trigger: 'change' },
        ],
        deviceCode: [
          { required: true, message: '设备编号不能为空', trigger: 'change' },
        ],
        equipment: [
          { required: true, message: '所属设备不能为空', trigger: 'change' },
        ],
        workPersonInCharge: [
          { required: true, message: '负责人不能为空', trigger: 'change' },
        ],
        stationPersonInCharge: [
          { required: true, message: '接收站负责人不能为空', trigger: 'blur' },
        ],
        maintenanceLevel: [
          { required: true, message: '维护级别不能为空', trigger: 'change' },
        ],
        workArea: [
          { required: true, message: '作业区域不能为空', trigger: 'change' },
        ],
        whetherHaveInspectionRule: [
          {
            required: true,
            message: '是否有检维修规程不能为空',
            trigger: 'change',
          },
        ],
        workUnit: [
          { required: true, message: '作业单位不能为空', trigger: 'change' },
        ],
        maintenanceType: [
          { required: true, message: '检维修类型不能为空', trigger: 'change' },
        ],
        time: [
          {
            required: true,
            message: '建议计划作业日期不能为空',
            trigger: 'change',
          },
        ],
        inspectionName: [
          { required: true, message: '检维修名称不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.encode()
    this.dispatchForm = this.tableList
  },
  methods: {
    // 打开弹窗调用
    handleOpen(row) {
      this.dispatchForm = row
    },
    // 禁止选择今天之前的日期
    disabledDate(current) {
      return current && current < moment().startOf('day')
    },
    handleOk() {
      this.$refs.dispatchForm.validate((valid) => {
        if (valid) {
          this.dispatchForm.workStartTime = this.dispatchForm.time[0]
          this.dispatchForm.workEndTime = this.dispatchForm.time[1]
          delete this.dispatchForm.time
          addListForPage(this.dispatchForm).then((res) => {
            this.handleCancel()
          })
        }
      })
    },
    handleCancel() {
      this.$refs.dispatchForm.resetFields()
      this.$emit('update:visible', false)
    },
    selectedClic(value) {
      this.dispatchForm.i = value[0]
      this.equipmentVisible = false
    },
    // 数据字典-作业区域
    encode() {
      encode('SBGL-JH-ZYSSQY').then((res) => {
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
<style lang="less"></style>
