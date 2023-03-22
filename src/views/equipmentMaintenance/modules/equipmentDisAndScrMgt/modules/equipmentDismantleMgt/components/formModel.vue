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
          <a-col :span="8" v-if="typeModel.type === 'edit'">
            <a-form-model-item label="记录状态" prop="recordStatus">
              <a-select v-model.trim="dataForm.recordStatus" disabled>
                <a-select-option
                  placeholder="请选择"
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in recordStatusOptions"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="typeModel.type === 'add' ? 16 : 8">
            <a-form-model-item label="申请编号" prop="applyCode">
              <a-input
                :style="{ width: typeModel.type === 'add' ? '500px' : '180px' }"
                v-model.trim="dataForm.applyCode"
                placeholder="系统自动生成申请编号"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
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
        </a-row>
        <a-row>
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
            <a-form-model-item label="规格型号" prop="speModels">
              <a-input
                v-model.trim="dataForm.speModels"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="资产编号" prop="propertyCode">
              <a-input
                v-model.trim="dataForm.propertyCode"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="position-disForm">
          <a-col :span="8">
            <a-form-model-item label="设备数量" prop="deviceNum">
              <a-input
                v-model.trim="dataForm.deviceNum"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="使用部门" prop="useDept">
              <a-select
                ref="select"
                v-model="dataForm.useDept"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in cdepartmentOptions"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.dictname }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="存放地点" prop="savePlace">
              <a-input
                v-model.trim="dataForm.savePlace"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="原值(元)" prop="originalValue">
              <a-input
                v-model.trim="dataForm.originalValue"
                type="number"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="累计折旧(元)" prop="totalDeprecition">
              <a-input
                v-model.trim="dataForm.totalDeprecition"
                type="number"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="净值(元)" prop="netWorth">
              <a-input
                v-model.trim="dataForm.netWorth"
                type="number"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="预计使用年限" prop="predictUseYear">
              <a-input
                v-model.trim="dataForm.predictUseYear"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="已用年限" prop="usedYear">
              <a-input
                v-model.trim="dataForm.usedYear"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="投用/停用时间" prop="time">
              <a-range-picker
                valueFormat="YYYY-MM-DD"
                v-model="dataForm.time"
                @change="changeTime"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              :label="
                typeModel.page === 'dis' ? '拆除主要原因' : '报废主要原因'
              "
              prop="mainReason"
            >
              <a-textarea
                v-model.trim="dataForm.mainReason"
                placeholder="请输入"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="可利用零部件" prop="useParts">
              <a-textarea
                v-model.trim="dataForm.useParts"
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
                @removeFile="removeFile"
              ></importConpontsData>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row>
                    <a-col :span="8">
                        <a-form-model-item label="申请人" prop="z" :labelCol="{ style: 'width: 160px' }">
                            <a-input
                                v-model.trim="dataForm.z"
                                disabled
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="申请单位" prop="z1" :labelCol="{ span:'10' }">
                            <a-input
                                v-model.trim="dataForm.z1"
                                disabled
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                     <a-col :span="8">
                        <a-form-model-item label="申请日期" prop="z2" :labelCol="{ span:'10' }">
                            <a-input
                                disabled
                                v-model.trim="dataForm.z2"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                </a-row> -->
        <a-row> </a-row>
      </a-form-model>
      <equipmentModel
        ref="equipmentModel"
        :equipmentVisible.sync="equipmentVisible"
        @selectedClic="selectedClic"
      />
      <div class="ant-modal-footer">
        <a-button type="primary" @click="handleOk(false)"> 保存 </a-button>
        <a-button type="primary" @click="handleOk(true)"> 提交 </a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { dictList } from '@/api/equipmentMaintenance/equipmentDismantleMgt/equipmentDismantleMgt.js'
import importConpontsData from '@/components/importConpontsData'
import equipmentModel from '../../../../equipmentChangeApplyMgt/components/equipmentModel.vue'
import moment from 'moment'
export default {
  name: 'formModel',
  components: { importConpontsData, equipmentModel },
  props: {
    title: {
      type: String,
      default: '设备拆除',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    // add详情，edit编辑/dis拆除，scr报废
    typeModel: {
      type: Object,
      default: () => {
        return { page: 'dis', type: 'add' }
      },
    },
  },
  data() {
    return {
      temp: '', //临时存储投用时间（不可变更）
      // 弹窗
      equipmentVisible: false,
      // 文件
      file: [],
      // 表单数据
      dataForm: {
        recordStatus: '',
        applyCode: '',
        deviceName: '',
        deviceBitNum: '',
        speModels: '',
        propertyCode: '',
        deviceNum: '',
        useDept: undefined,
        savePlace: '',
        originalValue: '',
        totalDeprecition: '',
        netWorth: '',
        predictUseYear: '',
        usedYear: '',
        time: [],
        // putUseTime:'',
        // stopUseTime:'',
        mainReason: '',
        useParts: '',
        attachment: '',
      },
      // 记录状态
      recordStatusOptions: [
        {
          value: '1',
          label: '已保存',
        },
        {
          value: '2',
          label: '已提交',
        },
        {
          value: '3',
          label: '审批中',
        },
        {
          value: '4',
          label: '已通过',
        },
        {
          value: '5',
          label: '已拒绝',
        },
        {
          value: '6',
          label: '作业中',
        },
        {
          value: '7',
          label: '已完成',
        },
      ],
      // 使用部门下拉框
      cdepartmentOptions: [],
      // 校验
      rules: {
        recordStatus: [
          { required: true, message: '记录状态不能为空', trigger: 'blur' },
        ],
        // applyCode: [
        //     { required: true, message: '申请编号不能为空', trigger: 'blur' },
        // ],
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' },
        ],
        deviceBitNum: [
          { required: true, message: '设备位号不能为空', trigger: 'blur' },
        ],
        speModels: [
          { required: true, message: '规格型号不能为空', trigger: 'blur' },
        ],
        propertyCode: [
          { required: true, message: '资产编号不能为空', trigger: 'blur' },
        ],
        deviceNum: [
          { required: true, message: '设备数量不能为空', trigger: 'blur' },
        ],
        // useDept: [
        //   { required: true, message: '使用部门不能为空', trigger: 'change' },
        // ],
        savePlace: [
          { required: true, message: '存放地点不能为空', trigger: 'blur' },
        ],
        originalValue: [
          { required: true, message: '原值(元)不能为空', trigger: 'blur' },
        ],
        totalDeprecition: [
          {
            required: true,
            message: '累计折旧（元）不能为空',
            trigger: 'blur',
          },
        ],
        netWorth: [
          { required: true, message: '净值(元)不能为空', trigger: 'blur' },
        ],
        predictUseYear: [
          { required: true, message: '预计使用年限不能为空', trigger: 'blur' },
        ],
        usedYear: [
          { required: true, message: '已用年限不能为空', trigger: 'blur' },
        ],
        time: [
          {
            required: true,
            message: '投用/停用时间不能为空',
            trigger: 'change',
          },
        ],
        // stopUseTime: [
        //   { required: true, message: '停用时间不能为空', trigger: 'change' },
        // ],
        mainReason: [
          { required: true, message: '报废主要原因不能为空', trigger: 'blur' },
        ],
        useParts: [
          { required: true, message: '可利用零部件不能为空', trigger: 'blur' },
        ],
        // attachment: [
        //   { required: true, message: '相关附件不能为空', trigger: 'blur' },
        // ]
      },
    }
  },
  methods: {
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-disForm')
    },
    handleOpen(row) {
      this.dictList()
      if (this.typeModel.type === 'edit') {
        row.time = [row.putUseTime, row.stopUseTime]
        this.dataForm = { ...row }
        if (this.dataForm.attachment) {
          this.$refs.importConpontsData.fileList = [
            {
              uid: '1',
              name: this.dataForm.attachment,
            },
          ]
        }
      } else {
        const time = moment().format('YYYYMMDDHHmmss')
        this.typeModel.page === 'scr'
          ? (this.dataForm.applyCode = `SBBF${time}`)
          : (this.dataForm.applyCode = `SBCC${time}`)
      }
    },
    // 文件
    flieChange(val) {
      this.$refs.importConpontsData.oneFile()
      this.file = val
      this.dataForm.attachment = val.name
    },
    removeFile() {
      this.file = undefined
      this.dataForm.attachment = ''
    },
    // 关闭
    handleCancel() {
      this.$refs.importConpontsData.removeFile()
      this.$refs.dataForm.resetFields()
      this.$refs.equipmentModel.reset()
      this.file = ''
      this.$emit('update:visible', false)
    },
    // 获取部门
    dictList() {
      dictList().then((res) => {
        this.cdepartmentOptions = res.body.data
      })
    },
    // 确定
    handleOk(flag) {
      let API
      if (this.typeModel.page === 'scr') {
        API = require('@/api/equipmentMaintenance/equipmentScrapMgt/equipmentScrapMgt.js')
      } else {
        API = require('@/api/equipmentMaintenance/equipmentDismantleMgt/equipmentDismantleMgt.js')
      }
      this.$refs.dataForm.validate((valid) => {
        const { saveData, editData, submit } = API
        if (valid) {
          let api = saveData
          let data = new FormData()
          this.dataForm.putUseTime = this.dataForm.time[0]
          this.dataForm.stopUseTime = this.dataForm.time[1]
          delete this.dataForm.time
          data.append('strJson', JSON.stringify(this.dataForm))
          data.append('file', this.file)
          if (this.typeModel.type === 'edit') {
            api = editData
          }
          this.success(api, data, flag, submit)
        }
      })
    },
    success(api, data, flag, submit) {
      api(data).then((res) => {
        if (flag) {
          submit({ id: res.body || this.dataForm.id }).then((res) => {
            if (res.code == 200) {
              this.$message.success('提交成功')
              this.$parent.$parent.getList()
            }
          })
        } else {
          if (res.code == 200 && !flag) {
            this.$message.success('保存成功')
            this.$parent.$parent.getList()
          }
        }
        this.handleCancel()
      })
    },
    // 设备名称弹框的选择
    selectedClic(value) {
      this.dataForm.deviceName = value.eqm_sbmc
      this.dataForm.deviceBitNum = value.eqm_sbwh
      this.dataForm.speModels = value.eqm_xhgg
      this.dataForm.propertyCode = value.eqm_zcbm //资产编码
      this.dataForm.deviceNum = value.eqm_sbsl //设备数量
      this.dataForm.savePlace = value.eqm_jtdw //具体定位
      this.dataForm.originalValue = value.eqm_zcyz //资产原值
      this.dataForm.totalDeprecition = value.eqm_zcyz * 1 - value.eqm_zcjz * 1 //原值-资产净值
      this.dataForm.netWorth = value.eqm_zcjz //资产净值
      this.dataForm.predictUseYear = value.eqm_bfqx //报废期限
      this.dataForm.usedYear = value.eqm_yznx //已折年限
      this.dataForm.time[0] = value.eqm_qyrq //启用日期
      this.temp = value.eqm_qyrq //启用日期

      this.equipmentVisible = false
    },
    changeTime() {
      this.dataForm.time[0] = this.temp
    },
  },
}
</script>
<style lang="less" scoped></style>
