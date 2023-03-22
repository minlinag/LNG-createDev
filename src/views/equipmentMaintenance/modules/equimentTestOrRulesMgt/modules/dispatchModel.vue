<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
      class="from-style bigModel"
    >
      <a-form-model ref="dispatchForm" :model="dispatchForm" :rules="rules">
        <a-row>
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
              prop="b"
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
                v-model="dispatchForm.applicationFormNo"
                disabled
                placeholder="系统自动生成"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <!-- <a-col :span="8" v-if="typeModel.page === 'notice'">
            <a-form-model-item
              label="是否在账设备"
              prop="isBook"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-select v-model="dispatchForm.isBook" placeholder="请选择"
              :getPopupContainer="getPopupContainer">
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in isRepair"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="8">
            <a-form-model-item
              label="设备名称"
              prop="deviceName"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-input
                disabled
                v-model="dispatchForm.deviceName"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="设备位号" prop="deviceNo">
              <a-input
                :disabled="typeModel.type === 'edit'"
                v-model="dispatchForm.deviceNo"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="设备编码"
              prop="deviceCode"
              :labelCol="{ style: 'width:  160px' }"
            >
              <a-input
                disabled
                v-model="dispatchForm.deviceCode"
                placeholder="请输入设备编码"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="维护级别"
              prop="maintenanceLevel"
              :labelCol="{ style: 'width: 160px' }"
            >
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
       
          <a-col :span="8">
            <a-form-model-item
              label="作业区域"
              prop="workArea"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-select v-model="dispatchForm.workArea" placeholder="请选择"
           >
              <a-select-option
                    v-for="(item, index) in areaList"
                    :key="index"
                    :value="item.dictname"
                  >
                    {{ item.dictname }}
                  </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="是具备检维修条件"
              prop="whetherHaveInspectionRule"
            >
              <a-select
              disabled
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
        </a-row> -->
        <a-row>
          <!-- <a-col :span="8">
            <a-form-model-item
              label="作业单位"
              prop="workUnit"
            >
              <a-input
                v-model="dispatchForm.workUnit"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="8">
            <a-form-model-item
              label="检维修类型"
              prop="maintenanceType"
              :labelCol="{ style: 'width: 170px' }"
            >
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
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-model-item
              label="备注"
              prop="remarks"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-textarea
                v-model="dispatchForm.remarks"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button type="primary" @click="handleOk()"> 派工 </a-button>
        <a-button @click="handleCancel()"> 取消 </a-button>
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
import {
  getdict,
} from '@/api/securityRiskcontrol'
import { encode } from '@/api/dataDictionary'
import { addListForPage } from '@/api/dispatching/noticeDocuments.js'

import {
  addVerification,
} from '@/api/equimentTestOrRulesMgt/waitVerifiedApproval/waitVerifiedApproval'
import equipmentModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue'
import moment from 'moment'
export default {
  name: 'dispatchModel',
  components: { equipmentModel },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    //notice通知单，equipment设备/check检定与校验
    typeModel: {
      type: Object,
      default: () => {
        return { page: 'notice', type: 'add' }
      }
    },
    tableModel: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: '设备变更-派工'
    }
  },
  data() {
    return {
      areaList: [],
      equipmentVisible: false,
      // 表单数据
      dispatchForm: {
        dispatchStatus: '未派工',
        informNo: '',
        applicationFormNo: '',
        applicationID: '',
        deviceName: '',
        deviceNo: '',
        deviceCode: '',
        maintenanceLevel: '',
        workArea: '',
        maintenanceType: '',
        inspectionName: '',
        remarks: '',
        time: []
      },
      // 是否维修//是否在账
      isRepair: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
      // 检维修类型
      maintenanceTypeOptions: [
        { value: '预防性', label: '预防性' },
        { value: '故障性', label: '故障性' },
        { value: '其他', label: '其他' }
      ],
      // 维护级别
      maintenanceLevel: [
        {
          value: "一级",
          label: "一级"
        },
        {
          value: "二级",
          label: "二级"
        },
        {
          value: "三级",
          label: "三级"
        },
        {
          value: "四级",
          label: "四级"
        },
        {
          value: "五级",
          label: "五级"
        },
        {
          value: "六级",
          label: "六级"
        }
      ],
      // 作业区域
      selectData: [],
      id: '',
      // 校验
      rules: {
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'change' },
        ],
        deviceNo: [
          { required: true, message: '设备位号不能为空', trigger: 'change' },
        ],
        deviceCode: [
          { required: true, message: '设备编号不能为空', trigger: 'change' },
        ],
        // maintenanceLevel: [
        //   { required: true, message: '维护级别不能为空', trigger: 'change' },
        // ],
        workArea: [
          { required: true, message: '作业区域不能为空', trigger: 'change' },
        ],
        // whetherHaveInspectionRule: [
        //   { required: true, message: '是具备检维修条件不能为空', trigger: 'change' },
        // ],
        maintenanceType: [
          { required: true, message: '检维修类型不能为空', trigger: 'change' },
        ],
        time: [
          { required: true, message: '建议计划作业日期不能为空', trigger: 'change' },
        ],
        inspectionName: [
          { required: true, message: '检维修名称不能为空', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getdict()

    console.log(this.tableModel, 'tableModel')
    // console.log(this.typeModel)
  },
  watch: {
    tableModel: {
      immediate: true,
      handler(val) {
        console.log(val);
        this.dispatchForm = {
          applicationFormNo: val.applicationFormNo,
          applicationID: val.id,
          deviceName: val.eqmName,
          deviceNo: val.eqmNo,
          deviceCode: val.eqmCode,
        }
      }
    }
  },
  methods: {
    getdict() {
      getdict({}).then((res) => {
        this.areaList = res.body.data
        // console.log(res.body.data, 'render')
      })
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-dispatch')
    },
    // 打开弹窗调用
    handleOpen(row) {
      this.encode()
      if (this.typeModel.type === 'edit') {
        if (this.typeModel.page === 'notice') {
          this.dispatchForm = row
        } else {
          this.id = row.id
          this.dispatchForm.relevancyRequisition = row.changeNo || row.applyCode,
            this.dispatchForm.deviceName = row.eqm_sbmc || row.deviceName || row.devicename,
            this.dispatchForm.deviceNo = row.eqm_sbwh || row.deviceBitNum || row.devicetagno,
            this.dispatchForm.deviceCode = row.sbbm
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
          let dispatchForm = JSON.parse(JSON.stringify(this.dispatchForm))
          dispatchForm.workStartTime = this.dispatchForm.time[0]
          dispatchForm.workEndTime = this.dispatchForm.time[1]
          delete dispatchForm.time
          // let addForm = new FormData();
          // addForm.append("strJson", JSON.stringify(dispatchForm));
          addVerification(dispatchForm).then(res => {
            if (res.code == 200) {
              this.$message.success('派工成功')
              // 修改派工后的状态，需要自己在自己的页面写modifyDispatchStatus方法
              // this.$parent.$parent.modifyDispatchStatus(this.id)
            }
            this.handleCancel()
          })
        }
      })

      // addVerification(this.dispatchForm).then(res => {
      //   if (res.code == 200) {
      //     this.$message.success('派工成功')
      //     // 修改派工后的状态，需要自己在自己的页面写modifyDispatchStatus方法
      //     this.$parent.$parent.modifyDispatchStatus(this.id)
      //   }
      //   this.handleCancel()
      // })
      // console.log(this.dispatchForm);
      // this.$refs.dispatchForm.validate((valid) => {
      //   if (valid) {
      //     this.dispatchForm.workStartTime = this.dispatchForm.time[0]
      //     this.dispatchForm.workEndTime = this.dispatchForm.time[1]
      //     delete this.dispatchForm.time
      //     let addForm = new FormData();
      //     addForm.append("strJson", JSON.stringify(this.dispatchForm));
      //     addListForPage(addForm).then(res => {
      //       if (res.code == 200) {
      //         this.$message.success('派工成功')
      //         // 修改派工后的状态，需要自己在自己的页面写modifyDispatchStatus方法
      //         this.$parent.$parent.modifyDispatchStatus(this.id)
      //       }
      //       this.handleCancel()
      //     })
      //   }
      // })
    },
    handleCancel() {
      this.$refs.dispatchForm.resetFields()
      this.$emit('close')
      this.$emit("update:visible", false)
    },
    selectedClic(value) {
      this.dispatchForm.deviceName = value.eqm_sbmc
      this.dispatchForm.deviceNo = value.eqm_sbwh
      this.equipmentVisible = false
    },
    // // 数据字典-作业区域
    // encode() {
    //   encode('SBGL-JH-ZYSSQY').then((res) => {
    //     this.selectData = []
    //     res.body.data.forEach((item) => {
    //       this.selectData.push({
    //         value: item.dictcode,
    //         label: item.dictname,
    //       })
    //     })
    //   })
    // },

  },

}
</script>
<style lang="less">
</style>
