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
      <a-form-model ref="dispatchForm" :model="dispatchForm" :rules="rules">
        <div style="position: relative" class="position-dispatch">
          <a-col :span="8">
            <a-form-model-item
              label="派工状态"
              prop="dispatchStatus"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-input v-model="dispatchForm.dispatchStatus" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="工单编号"
              prop="informNo"
              :labelCol="{ span: 11 }"
            >
              <a-input
                v-model="dispatchForm.informNo"
                disabled
                placeholder="系统自动生成工单编号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="关联申请单"
              prop="relevancyRequisition"
              :labelCol="{ style: 'width: 160px' }"
            >
              <a-input
                v-model="dispatchForm.relevancyRequisition"
                :disabled="typeModel.type === 'edit'"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="typeModel.page === 'notice'">
            <a-form-model-item
              label="是否在账设备"
              prop="isBook"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-select
                v-model="dispatchForm.isBook"
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
          <div :class="{ buttonInput: dispatchForm.isBook === '1' }">
            <a-col :span="dispatchForm.isBook === '1' ? 6 : 8">
              <a-form-model-item
                label="设备名称"
                prop="deviceName"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  :style="{
                    width: dispatchForm.isBook === '1' ? '120px' : '180px',
                  }"
                  :disabled="
                    (dispatchForm.isBook === '1' &&
                      typeModel.page === 'notice') ||
                    typeModel.page !== 'notice'
                  "
                  v-model="dispatchForm.deviceName"
                  placeholder="请输入"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="2" v-if="dispatchForm.isBook === '1'">
              <a-form-model-item>
                <a-button type="primary" @click="equipmentClick">选择</a-button>
              </a-form-model-item>
            </a-col>
          </div>
          <a-col :span="8">
            <a-form-model-item
              label="设备位号"
              prop="deviceNo"
              :labelCol="
                typeModel.page === 'notice'
                  ? { style: 'width: 160px' }
                  : { style: 'width:250px' }
              "
            >
              <a-input
                :disabled="typeModel.type === 'edit'"
                v-model="dispatchForm.deviceNo"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="typeModel.page === 'equipment'">
            <a-form-model-item
              label="设备编码"
              prop="deviceCode"
              :labelCol="{ style: 'width:  160px' }"
            >
              <a-input
                :disabled="typeModel.type === 'edit'"
                v-model="dispatchForm.deviceCode"
                placeholder="请输入设备编码"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="typeModel.page === 'check'">
            <a-form-model-item
              label="所属设备"
              prop="equipment"
              :labelCol="{ style: 'width: 160px' }"
            >
              <a-input
                :disabled="typeModel.type === 'edit'"
                v-model="dispatchForm.equipment"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="负责人"
              prop="workPersonInCharge"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-input
                v-model="dispatchForm.workPersonInCharge"
                :disabled="typeModel.detail"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="接收站联系人"
              prop="stationPersonInCharge"
              :labelCol="{ span: 11 }"
            >
              <a-input
                v-model="dispatchForm.stationPersonInCharge"
                :disabled="typeModel.detail"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="是否需要润滑"
              prop="needLubricate"
              :labelCol="{ style: 'width: 160px' }"
            >
              <a-select
                v-model="dispatchForm.needLubricate"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
                :disabled="typeModel.detail"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in needLubricate"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="作业区域"
              prop="workArea"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-select
                v-model="dispatchForm.workArea"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
                :disabled="typeModel.detail"
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
              label="是否有检维修规程"
              prop="whetherHaveInspectionRule"
              :labelCol="{ span: 11 }"
            >
              <a-select
                v-model="dispatchForm.whetherHaveInspectionRule"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
                :disabled="typeModel.detail"
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
            <a-form-model-item
              label="作业单位"
              prop="workUnit"
              :labelCol="{ style: 'width: 160px' }"
            >
              <a-select
                show-search
                :filter-option="filterOption"
                option-filter-prop="children"
                v-model="dispatchForm.workUnit"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
                :disabled="typeModel.detail"
              >
                <a-select-option
                  :value="item.outsourceCompany"
                  :key="index"
                  v-for="(item, index) in workUnitOptions"
                >
                  {{ item.outsourceCompany }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="检维修类型"
              prop="maintenanceType"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-select
                v-model="dispatchForm.maintenanceType"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
                :disabled="typeModel.detail"
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
          <a-col :span="8">
            <a-form-model-item
              label="建议计划作业日期"
              prop="time"
              :labelCol="{ style: 'width: 180px' }"
            >
              <a-range-picker
                valueFormat="YYYY-MM-DD"
                v-model="dispatchForm.time"
                :disabled-date="disabledDate"
                :disabled="typeModel.detail"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="检维修名称"
              prop="inspectionName"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="dispatchForm.inspectionName"
                placeholder="请输入"
                :disabled="typeModel.detail"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="备注"
              prop="remarks"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-textarea
                v-model="dispatchForm.remarks"
                :auto-size="{ minRows: 6, maxRows: 6 }"
                :disabled="typeModel.detail"
              />
            </a-form-model-item>
          </a-col>
        </div>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button v-if="typeModel.detail" @click="handleCancel()">
          返回
        </a-button>
        <div v-else>
          <a-button type="primary" @click="handleOk()"> 派工 </a-button>
          <a-button @click="handleCancel()"> 取消 </a-button>
        </div>
      </div>
      <equipmentModel
        ref="equipmentModel"
        :equipmentVisible.sync="equipmentVisible"
        @selectedClic="selectedClic"
      />
    </a-modal>
  </div>
</template>
<script>
import { encode } from '@/api/dataDictionary'
import { addDispatch as addListForPage } from '@/api/dispatching/dispatching.js'
import equipmentModel from './equipmentModel.vue'
import { getListForPage } from '@/api/outsourceCompany'
import moment from 'moment'
export default {
  name: 'dispatchModel',
  components: { equipmentModel },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    //notice通知单，equipment设备/check检定与校验/detail:true全部禁止输入
    typeModel: {
      type: Object,
      default: () => {
        return { page: 'notice', type: 'add' }
      },
    },
    title: {
      type: String,
      default: '设备变更-派工',
    },
  },
  data() {
    return {
      equipmentVisible: false,
      // 表单数据
      dispatchForm: {
        dispatchStatus: '未派工',
        relevancyRequisition: '',
        deviceName: '',
        deviceCode: '',
        equipment: '',
        needLubricate: undefined,
        isBook: '0', //是否在账，不传
        deviceNo: '',
        deviceCod: '',
        workPersonInCharge: '',
        stationPersonInCharge: '',
        workArea: undefined,
        whetherHaveInspectionRule: undefined,
        workUnit: undefined,
        maintenanceType: undefined,
        inspectionName: '',
        remarks: '',
        time: [],
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
      // 是否需要润滑
      needLubricate: [
        {
          value: 1,
          label: '是',
        },
        {
          value: 0,
          label: '否',
        },
      ],
      // 作业区域
      selectData: [],
      // 作业单位下拉框
      workUnitOptions: [],
      id: '',
      // 校验
      rules: {
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
        needLubricate: [
          {
            required: true,
            message: '是否需要润滑不能为空',
            trigger: 'change',
          },
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
  methods: {
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-dispatch')
    },
    // 打开弹窗调用
    handleOpen(row) {
      this.encode()
      this.getListForPage()
      if (this.typeModel.type === 'edit') {
        if (
          this.typeModel.page === 'notice' ||
          this.typeModel.page === 'detail'
        ) {
          this.dispatchForm = row
          this.dispatchForm.time = [row.workStartTime, row.workEndTime]
        } else {
          this.id = row.id
          ;(this.dispatchForm.relevancyRequisition =
            row.changeNo || row.applyCode),
            (this.dispatchForm.deviceName =
              row.eqm_sbmc || row.deviceName || row.devicename),
            (this.dispatchForm.deviceNo =
              row.eqm_sbwh || row.deviceBitNum || row.devicetagno),
            (this.dispatchForm.deviceCode = row.sbbm)
        }
      }
    },
    equipmentClick() {
      this.equipmentVisible = true
      this.$refs.equipmentModel.selectedRowKeys = [this.dataForm.sbbm]
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
          delete this.dispatchForm.isBook
          let addForm = this.dispatchForm
          addForm.dispatchStatus = '2'
          addListForPage(addForm).then((res) => {
            if (res.code == 200) {
              this.$message.success('派工成功')
              // 修改派工后的状态，需要自己在自己的页面写modifyDispatchStatus方法
              this.$parent.$parent.modifyDispatchStatus(this.id)
            }
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
      this.dispatchForm.deviceName = value.eqm_sbmc
      this.dispatchForm.deviceNo = value.eqm_sbwh
      this.equipmentVisible = false
    },
    getListForPage() {
      getListForPage({
        pageSize: 99999,
        pageNum: 1,
        outsourceCompany: '',
        startDate: [],
        startTime: '',
        endTime: '',
        status: undefined,
      }).then((res) => {
        if (res.code == '200') {
          this.workUnitOptions = res.body.data || {}
        }
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 数据字典-区域名称
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
<style lang="less"></style>
