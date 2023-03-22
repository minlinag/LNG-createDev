<template>
  <!-- 临时检维修计划
    大修检维修计划
    ==>申请单<== -->
  <div>
    <a-modal
      :tableList="tableList"
      title="作业申请单"
      :visible="applicationsVisible"
      :footer="null"
      @cancel="handleCancel('取消')"
      class="from-style bigModel"
    >
      <a-form-model ref="dispatchForm" :model="dispatchForm" :rules="rules">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="状态" disabled prop="recordStatus">
              <a-select
                disabled
                placeholder="请选择状态"
                v-model="dispatchForm.recordStatus"
              >
                <a-select-option
                  allowClear
                  :value="item.value"
                  v-for="(item, index) in selectBox"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="工单编号">
              <!-- 大修计划编号 -->
              <a-input
                v-if="
                  formType === 'overhauAdd' ||
                  formType === 'overhauUpdata' ||
                  formType === 'overhauSearch' ||
                  formType === 'overhauApp'
                "
                v-model="dispatchForm.inspectionPlanNo"
                disabled
                placeholder="系统自动生成工单编号"
              ></a-input>
              <!-- 临时计划编号 -->
              <a-input
                v-if="
                  formType === 'temporaryAdd' ||
                  formType === 'temporaryUpdata' ||
                  formType === 'temporarySearch' ||
                  formType === 'temporaryApp'
                "
                v-model="dispatchForm.temMainPlanNo"
                disabled
                placeholder="系统自动生成工单编号"
              ></a-input>
              <!-- 申请单编号 -->
              <a-input
                v-if="
                  formType === 'applicationsAdd' ||
                  formType === 'applicationsUpdata' ||
                  formType === 'applicationsSearch' ||
                  formType === 'applicationsApp'
                "
                v-model="dispatchForm.inspectionPlanNo"
                disabled
                placeholder="系统自动生成工单编号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="是否有检维修条件"
              prop="whetherHaveInspectionCondition"
            >
              <a-select
                :disabled="
                  formType == 'overhauSearch' ||
                  formType == 'temporarySearch' ||
                  formType === 'applicationsSearch' ||
                  formType === 'temporaryApp' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
                v-model="dispatchForm.whetherHaveInspectionCondition"
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
          <!-- <a-col :span="8">
            <a-form-model-item label="维护级别" prop="maintenanceLevel">
              <a-select
                :disabled="
                  formType == 'overhauSearch' ||
                  formType == 'temporarySearch' ||
                  formType === 'temporaryApp' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
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
          </a-col> -->
        </a-row>
        <a-row>
          <a-col :span="8" v-if="typeModel.page === 'notice'">
            <a-form-model-item label="是否在账设备" prop="whetherInAccountEqm">
              <a-select
                v-model="dispatchForm.whetherInAccountEqm"
                @change="whetherInAccountEqm"
                :disabled="
                  formType == 'overhauSearch' ||
                  formType == 'temporarySearch' ||
                  formType == 'applicationsSearch' ||
                  formType === 'temporaryApp' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
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
          <div
            :class="{ buttonInput: dispatchForm.whetherInAccountEqm === '1' }"
          >
            <a-col
              :span="
                typeModel.page === 'notice' &&
                dispatchForm.whetherInAccountEqm !== '1'
                  ? 8
                  : 6
              "
            >
              <a-form-model-item
                label="设备名称"
                prop="deviceName"
                :labelCol="
                  dispatchForm.whetherInAccountEqm !== '1'
                    ? { style: 'width: 140px' }
                    : { style: 'width:167px' }
                "
              >
                <a-input
                  :style="{
                    width:
                      dispatchForm.whetherInAccountEqm !== '1'
                        ? '180px'
                        : '117px',
                  }"
                  :disabled="
                    typeModel.type === 'edit' ||
                    formType == 'overhauSearch' ||
                    formType == 'temporarySearch' ||
                    formType == 'applicationsSearch' ||
                    formType === 'temporaryApp' ||
                    formType === 'overhauApp' ||
                    dispatchForm.whetherInAccountEqm == '1' ||
                    formType === 'applicationsApp'
                  "
                  v-model="dispatchForm.deviceName"
                  placeholder="请输入"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="2"
              v-if="
                typeModel.page === 'notice' &&
                dispatchForm.whetherInAccountEqm === '1'
              "
            >
              <a-form-model-item>
                <a-button
                  type="primary"
                  @click="equipmentClick"
                  :disabled="
                    formType == 'overhauSearch' ||
                    formType == 'temporarySearch' ||
                    formType === 'applicationsSearch' ||
                    formType == 'temporaryApp' ||
                    formType === 'overhauApp' ||
                    formType === 'applicationsApp'
                  "
                  >选择</a-button
                >
              </a-form-model-item>
            </a-col>
          </div>
          <a-col :span="8">
            <a-form-model-item label="设备位号" prop="deviceNo">
              <a-input
                :disabled="
                  typeModel.type === 'edit' ||
                  dispatchForm.whetherInAccountEqm == '1' ||
                  formType == 'overhauSearch' ||
                  formType == 'temporarySearch' ||
                  formType == 'applicationsSearch' ||
                  formType === 'temporaryApp' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
                v-model="dispatchForm.deviceNo"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="8">
            <a-form-model-item label="是否需要润滑" prop="needLubricate">
              <a-select
                :disabled="
                  formType == 'overhauSearch' ||
                  formType == 'temporarySearch' ||
                  formType === 'applicationsSearch' ||
                  formType === 'temporaryApp' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
                v-model="dispatchForm.needLubricate"
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
          </a-col> -->
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="作业区域" prop="workLocation">
              <a-select
                :disabled="
                  formType == 'overhauSearch' ||
                  formType == 'temporarySearch' ||
                  formType === 'applicationsSearch' ||
                  formType === 'temporaryApp' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
                v-model="dispatchForm.workLocation"
                placeholder="请选择"
              >
                <a-select-option
                  :value="item.label"
                  :key="index"
                  v-for="(item, index) in selectData"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row>
          <a-col :span="8">
            <a-form-model-item label="预估费用" prop="estimatedCost">
              <a-input
                :disabled="
                  formType == 'overhauSearch' ||
                  formType == 'temporarySearch' ||
                  formType === 'temporaryApp' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
                v-model="dispatchForm.estimatedCost"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
            <a-form-model-item
              label="建议计划作业日期"
              prop="time"
              :labelCol="{ style: 'width: 180px' }"
            >
              <a-range-picker

                @change="dateClick"
                :disabled="(formType=='overhauSearch'|| formType=='temporarySearch')"
                valueFormat="YYYY-MM-DD"
                v-model="dateTime"
                :disabled-date="disabledDate"
              />
            </a-form-model-item>
          </a-col>
        </a-row> -->

        <a-row>
          <a-col :span="24">
            <a-form-model-item label="故障描述" prop="inspectionName">
              <!-- 大修计划描述 -->
              <a-textarea
                :auto-size="{ minRows: 6, maxRows: 6 }"
                v-if="
                  formType === 'overhauAdd' ||
                  formType === 'overhauUpdata' ||
                  formType === 'overhauSearch' ||
                  formType === 'applicationsAdd' ||
                  formType === 'applicationsUpdata' ||
                  formType === 'applicationsSearch' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
                :disabled="
                  formType == 'overhauSearch' ||
                  formType == 'applicationsSearch' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsApp'
                "
                v-model="dispatchForm.planDescription"
                placeholder="请输入"
              ></a-textarea>
              <!-- 临时检维修计划描述 -->
              <a-textarea
                :auto-size="{ minRows: 6, maxRows: 6 }"
                v-if="
                  formType === 'temporaryAdd' ||
                  formType === 'temporaryUpdata' ||
                  formType === 'temporarySearch' ||
                  formType === 'temporaryApp'
                "
                :disabled="
                  formType == 'temporaryApp' || formType == 'temporarySearch'
                "
                v-model="dispatchForm.temMainPlanDescription"
                placeholder="请输入"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="备注" prop="remark">
              <a-textarea
                :auto-size="{ minRows: 6, maxRows: 6 }"
                :disabled="
                  formType == 'overhauSearch' ||
                  formType == 'temporarySearch' ||
                  formType === 'temporaryApp' ||
                  formType === 'overhauApp' ||
                  formType === 'applicationsSearch' ||
                  formType === 'applicationsApp'
                "
                v-model="dispatchForm.remark"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="相关附件" prop="attachment">
              <importConpontsData
                v-model.trim="dispatchForm.attachment"
                :Text="'上传文件'"
                @fileChange="flieChange"
                ref="importConpontsData"
              ></importConpontsData>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!--设备列表-->
        <equipmentModel
          ref="equipmentModel"
          :equipmentVisible.sync="equipmentVisible"
          @selectedClic="selectedClic"
        />
        <!--//临时检维修大修-->
        <stepsModel
          ref="stepsModel"
          :isShow="formType === 'overhauApp' ? true : false"
          :id="tableList.id"
          v-if="formType == 'overhauSearch' || formType === 'overhauApp'"
        />
        <!--//临时检维修大修-->
        <stepsModel
          ref="stepsModel"
          :isShow="formType === 'temporaryApp' ? true : false"
          :id="tableList.id"
          v-if="formType === 'temporarySearch' || formType === 'temporaryApp'"
        />
        <!--//临时检维修大修-->
        <stepsModel
          ref="stepsModel"
          :isShow="formType === 'applicationsApp' ? true : false"
          :id="tableList.id"
          v-if="
            formType === 'applicationsSearch' || formType === 'applicationsApp'
          "
        />
      </a-form-model>
      <div
        class="footer contneFormBtnStyle ant-modal-footer"
        v-if="
          formType == 'overhauAdd' ||
          formType == 'temporaryAdd' ||
          formType == 'applicationsAdd' ||
          formType == 'overhauUpdata' ||
          formType == 'temporaryUpdata' ||
          formType == 'applicationsUpdata'
        "
      >
        <a-button type="primary" @click="handleOk"> 保存</a-button>
        <a-button type="primary" @click="submit"> 提交</a-button>
        <a-button @click="handleCancel('取消')"> 取消</a-button>
      </div>

      <div
        style="text-align: center"
        class="contneFormBtnStyle ant-modal-footer"
        v-if="
          formType === 'temporaryApp' ||
          formType === 'applicationsApp' ||
          formType === 'overhauApp'
        "
      >
        <a-button type="primary" @click="approvalOk">确定</a-button>
        <a-button @click="handleCancel('取消')">取消</a-button>
      </div>
      <div
        style="text-align: center"
        class="contneFormBtnStyle ant-modal-footer"
        v-if="
          formType === 'temporarySearch' ||
          formType === 'applicationsSearch' ||
          formType === 'overhauSearch'
        "
      >
        <a-button @click="handleCancel('取消')">返回</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
// import stepsModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue'
import stepsModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue'

// import stepsModel from '@/views/dispatching/components/stepsModel.vue'
import importConpontsData from '@/components/importConpontsData'
import { encode } from '@/api/dataDictionary'
import {
  addListForPage,
  upDateistForPage,
  oversubmit,
  overaudio,
} from '@/api/dispatching/noticeDocuments.js'
import {
  addJsonWithAtt,
  overhauladdSubmit,
  upDateList,
  temSubmit,
  audio,
} from '@/api/temporaryOverhaulplan.js'
import {
  addList,
  updataList,
  addSubmit,
  applicationFormSubmit,
  applicatioinFormAudio,
} from '@/api/dispatching/dispatching'
import equipmentModel from './equipmentModel.vue'
import moment from 'moment'

export default {
  name: 'dispatchModel',
  components: { equipmentModel, importConpontsData, stepsModel },
  props: {
    applicationsVisible: {
      type: Boolean,
      default: false,
    },
    tableList: {
      type: Object,
      default: null,
    },
    //notice通知单，equipment设备/check检定与校验
    typeModel: {
      type: Object,
      default: () => {
        return { page: 'notice', formType: 'overhauAdd', type: 'add' }
      },
    },
    formType: {
      type: String,
    },
  },
  watch: {
    tableList(val) {
      this.getformList(val)
    },
    formType: {
      handler(val) {},
    },
    applicationsVisible() {},
  },
  data() {
    return {
      selectBox: [
        { label: '已保存', value: '1' },
        { label: '已提交', value: '2' },
        { label: '审批中', value: '3' },
        { label: '已审批', value: '4' },
        { label: '已拒绝', value: '5' },
        { label: '未保存', value: '' },
      ],

      dateTime: [],
      itemDisabled: false,
      equipmentVisible: false,
      appDate: [],
      // 表单数据
      dispatchForm: {
        recordStatus: '1', //派工状态
        temMainPlanNo: '', //临时检维修计划编号
        relevancyRequisition: '', //大修计划编号

        maintenanceLevel: '', //维护级别
        whetherInAccountEqm: undefined, //  是否在账设备
        whetherHaveInspectionCondition: undefined, //是否有检维修
        needLubricate: undefined, //是否需要润滑
        deviceName: '', //设备名称
        deviceNo: '', //设备位号
        workLocation: '', //作业区域
        estimatedCost: '', //预估费用
        proposedMaintenanceStartDate: '', //计划开始时间
        proposedMaintenanceEndDate: '', //计划结束时间
        // inspectionName: '', //计划描述
        temMainPlanDescription: '', //临时计划描述
        planDescription: '', //大修计划描述
        remark: '', //备注
        attachment: '', //附件
        // maintenanceType: undefined,
        workPersonInCharge: '', //申请人
        stationPersonInCharge: '', //申请单位
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
        maintenanceLevel: [
          { required: true, message: '维护级别不能为空', trigger: 'change' },
        ],
        whetherInAccountSetEqm: [
          {
            required: true,
            message: '是否在账设备不能为空',
            trigger: 'change',
          },
        ],
        whetherHaveInspectionCondition: [
          {
            required: true,
            message: '是否有检维修条件不能为空',
            trigger: 'change',
          },
        ],
        whetherHave: [
          {
            required: true,
            message: '是否需要润滑不能为空',
            trigger: 'change',
          },
        ],
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' },
        ],
        deviceCode: [
          { required: true, message: '设备位号不能为空', trigger: 'change' },
        ],

        workLocation: [
          { required: true, message: '作业区域不能为空', trigger: 'change' },
        ],

        estimatedCost: [
          { required: true, message: '预估费用不能为空', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    console.log(this.tableList)
    this.encode()
    if (this.formType !== 'applicationsAdd') {
      this.getformList(this.tableList)
    }
  },
  methods: {
    // 是否在帐设备改变清空设备名称和位号
    whetherInAccountEqm() {
      this.dispatchForm.deviceName = ''
      this.dispatchForm.deviceNo = ''
    },

    getformList(val) {
      this.dispatchForm = val
      this.dispatchForm.time = []
      if (val) {
        if (
          val.proposedMaintenanceStartDate &&
          val.proposedMaintenanceEndDate
        ) {
          this.dateTime = [
            val.proposedMaintenanceStartDate,
            val.proposedMaintenanceEndDate,
          ]
        } else {
          this.dateTime = []
        }
      }
    },
    dateClick(val) {
      console.log(val)
      // this.dispatchForm.time = [
      //     // val[0],
      //     // val.proposedMaintenanceEndDate,
      // ]
    },
    // 打开弹窗调用
    handleOpen(row, flag) {
      console.log(row)
      if (
        this.typeModel.page === 'equipment' ||
        this.typeModel.page === 'check' ||
        (this.typeModel.page === 'notice' && this.typeModel.type === 'edit')
      ) {
        if (this.typeModel.page === 'notice' && flag) {
          this.dispatchForm = row
        } else {
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
    submit() {
      if (this.formType == 'applicationsUpdata') {
        // console.log('申请单提交')
        this.$refs.dispatchForm.validate((valid) => {
          if (valid) {
            applicationFormSubmit({ id: this.dispatchForm.id }).then((res) => {
              this.handleCancel()
              this.$message.success('提交成功')
            })
          }
        })
      } else if (this.formType == 'applicationsAdd') {
        console.log('申请单提交')
        this.$refs.dispatchForm.validate((valid) => {
          if (valid) {
            this.dispatchForm.proposedMaintenanceStartDate = this.dateTime[0]
            this.dispatchForm.proposedMaintenanceEndDate = this.dateTime[1]
            delete this.dispatchForm.temMainPlanNo
            delete this.dispatchForm.temMainPlanDescription
            delete this.dispatchForm.relevancyRequisition
            const dataForm = this.appendForm(this.dispatchForm)
            addSubmit(dataForm).then((res) => {
              this.handleCancel()
              this.$message.success('提交成功')
            })
          }
        })
      } else if (
        this.formType == 'temporaryAdd' ||
        this.formType == 'temporaryUpdata'
      ) {
        console.log('临时检维修提交')
        if (this.dispatchForm.id) {
          this.$refs.dispatchForm.validate((valid) => {
            if (valid) {
              temSubmit({ id: this.dispatchForm.id }).then((res) => {
                this.handleCancel()
                this.$message.success('提交成功')
              })
            }
          })
        } else {
          this.dispatchForm.proposedMaintenanceStartDate = this.dateTime[0]
          this.dispatchForm.proposedMaintenanceEndDate = this.dateTime[1]
          delete this.dispatchForm.relevancyRequisition
          delete this.dispatchForm.planDescription
          delete this.dispatchForm.requisitionNo
          const dataForm = this.appendForm(this.dispatchForm)
          addJsonWithAtt(dataForm).then((res) => {
            // this.handleCancel()
            console.log(res.body, '临时检维修新增')
            if (res.code == '200') {
              this.$refs.dispatchForm.validate((valid) => {
                if (valid) {
                  temSubmit({ id: res.body }).then((res) => {
                    this.handleCancel()
                    this.$message.success('提交成功')
                  })
                }
              })
            }
          })
        }
      } else if (this.formType == 'overhauUpdata') {
        console.log('大修计划提交')
        // if (this.dispatchForm.id) {
        this.$refs.dispatchForm.validate((valid) => {
          if (valid) {
            oversubmit({ id: this.dispatchForm.id }).then((res) => {
              this.handleCancel()
              this.$message.success('提交成功')
            })
          }
        })
        // } else {
        //   delete this.dispatchForm.temMainPlanNo
        //   delete this.dispatchForm.temMainPlanDescription
        //   delete this.dispatchForm.requisitionNo
        //   const dataForm = this.appendForm(this.dispatchForm)
        //   addListForPage(dataForm).then((res) => {
        //     // this.handleCancel()
        //     console.log(res, '大修计划新增')
        //   })
        //   // this.$refs.dispatchForm.validate((valid) => {
        //   //   if (valid) {
        //   //     oversubmit({ id: this.dispatchForm.id }).then((res) => {
        //   //       this.handleCancel()
        //   //       this.$message.success('提交成功')
        //   //     })
        //   //   }
        //   // })
        // }
      } else if (this.formType == 'overhauAdd') {
        console.log('大修计划提交')
        this.$refs.dispatchForm.validate((valid) => {
          if (valid) {
            delete this.dispatchForm.temMainPlanNo
            delete this.dispatchForm.temMainPlanDescription
            delete this.dispatchForm.requisitionNo
            const dataForm = this.appendForm(this.dispatchForm)
            overhauladdSubmit(dataForm).then((res) => {
              this.handleCancel()
            })
          }
        })
      }
    },
    approvalOk() {
      const data = {
        id: this.dispatchForm.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      }
      if (this.formType === 'applicationsApp') {
        applicatioinFormAudio(data)
          .then(() => {
            this.handleCancel()
          })
          .catch(() => {})
      } else if (this.formType == 'temporaryApp') {
        audio(data)
          .then(() => {
            this.handleCancel()
          })
          .catch(() => {})
      } else if (this.formType == 'overhauApp') {
        overaudio(data)
          .then(() => {
            this.handleCancel()
          })
          .catch(() => {})
      }
    },

    equipmentClick() {
      this.equipmentVisible = true
      // this.$refs.equipmentModel.selectedRowKeys = [this.dataForm.sbbm]
    },
    // 禁止选择今天之前的日期
    disabledDate(current) {
      return current && current < moment().startOf('day')
    },
    appDateChange(date) {
      this.proposedMaintenanceStartDate = date[0] //计划开始时间
      this.proposedMaintenanceEndDate = date[1] //计划结束时间
    },
    // 文件
    flieChange(val) {
      this.$refs.importConpontsData.oneFile()
      this.file = val
    },
    handleOk() {
      this.$refs.dispatchForm.validate((valid) => {
        if (valid) {
          this.dispatchForm.proposedMaintenanceStartDate = this.dateTime[0]
          this.dispatchForm.proposedMaintenanceEndDate = this.dateTime[1]
          if (this.formType == 'overhauAdd') {
            delete this.dispatchForm.temMainPlanNo
            delete this.dispatchForm.temMainPlanDescription
            delete this.dispatchForm.requisitionNo
            const dataForm = this.appendForm(this.dispatchForm)
            addListForPage(dataForm).then((res) => {
              this.handleCancel()
            })
          } else if (this.formType == 'overhauUpdata') {
            delete this.dispatchForm.temMainPlanNo
            delete this.dispatchForm.temMainPlanDescription
            delete this.dispatchForm.requisitionNo
            const dataForm = this.appendForm(this.dispatchForm)
            upDateistForPage(dataForm).then((res) => {
              this.handleCancel()
            })
          } else if (this.formType == 'temporaryAdd') {
            delete this.dispatchForm.relevancyRequisition
            delete this.dispatchForm.planDescription
            delete this.dispatchForm.requisitionNo
            const dataForm = this.appendForm(this.dispatchForm)
            addJsonWithAtt(dataForm).then((res) => {
              this.handleCancel()
            })
          } else if (this.formType == 'temporaryUpdata') {
            delete this.dispatchForm.relevancyRequisition
            delete this.dispatchForm.planDescription
            delete this.dispatchForm.requisitionNo
            const dataForm = this.appendForm(this.dispatchForm)
            upDateList(dataForm).then((res) => {
              this.handleCancel()
            })
          } else if (this.formType == 'applicationsAdd') {
            delete this.dispatchForm.temMainPlanNo
            delete this.dispatchForm.temMainPlanDescription
            delete this.dispatchForm.relevancyRequisition
            const dataForm = this.appendForm(this.dispatchForm)
            addList(dataForm).then((res) => {
              this.handleCancel()
            })
          } else if (this.formType == 'applicationsUpdata') {
            delete this.dispatchForm.temMainPlanNo
            delete this.dispatchForm.temMainPlanDescription
            delete this.dispatchForm.relevancyRequisition
            const dataForm = this.appendForm(this.dispatchForm)
            updataList(dataForm).then((res) => {
              this.handleCancel()
            })
          }
        }
      })
    },
    appendForm(val) {
      let data = new FormData()
      data.append('strJson', JSON.stringify(val))
      data.append('file', this.file)
      return data
    },
    handleCancel(val) {
      this.dispatchForm = {}
      this.dateTime = []
      this.$refs.importConpontsData.removeFile()
      this.$refs.dispatchForm.resetFields()
      if (val == '取消') {
        this.$emit('close', val)
      } else {
        this.$emit('close', val)
      }
    },
    selectedClic(value) {
      this.dispatchForm.deviceName = value.eqm_sbmc //设备名称
      this.dispatchForm.deviceNo = value.eqm_sbwh //设备位号
      this.dispatchForm.deviceNum = value.eqm_sbbm //设备编码
      this.equipmentVisible = false
    },
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
<style lang="less">
.rangePickerWidth .ant-form-item-control .ant-input {
  width: 495px !important;
}
</style>
