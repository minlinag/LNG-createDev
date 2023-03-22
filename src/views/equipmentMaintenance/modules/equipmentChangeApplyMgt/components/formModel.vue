<template>
  <div>
    <a-modal
      :title="typeModel.title"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
      class="from-style middleModel"
      :maskClosable="false"
      destroyOnClose
    >
      <a-form-model ref="dataForm" :model="dataForm" :rules="rules">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="变更编号" prop="changeNo">
              <a-input
                v-model.trim="dataForm.changeNo"
                disabled
                placeholder="系统自动生成变更编号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" class="position">
            <a-form-model-item label="变更类型" prop="changeType">
              <a-select
                v-model.trim="dataForm.changeType"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in changeTypeOptions"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="变更名称" prop="changeName">
              <a-input
                v-model.trim="dataForm.changeName"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" class="position">
            <a-form-model-item label="变更级别" prop="changeLevel">
              <a-select
                default-value="1"
                v-model.trim="dataForm.changeLevel"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in level"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="buttonInput">
          <a-col :span="20">
            <a-form-model-item label="设备名称/设备位号/设备编码" prop="sbbm">
              <a-input
                style="width: 460px"
                v-model.trim="dataForm.sbbm"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="4">
            <a-form-model-item>
              <a-button type="primary" @click="equipmentVisible = true"
                >选择</a-button
              >
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="dataForm.changeType === '0'">
          <a-col :span="12">
            <a-form-model-item label="变更前参数" prop="beforeParam">
              <a-input
                v-model.trim="dataForm.beforeParam"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="变更后参数" prop="afterParam">
              <a-input
                v-model.trim="dataForm.afterParam"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="position">
          <a-col :span="12">
            <a-form-model-item label="作业区域" prop="workArea">
              <a-select
                default-value="11"
                v-model.trim="dataForm.workArea"
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
          <a-col :span="12" v-if="dataForm.changeType === '3'">
            <a-form-model-item label="变更后设备编码" prop="afterSbbm">
              <a-input
                v-model.trim="dataForm.afterSbbm"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="变更原因" prop="changeReason">
              <a-textarea
                v-model.trim="dataForm.changeReason"
                placeholder="请输入"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="详细变更说明" prop="explanation">
              <a-textarea
                v-model.trim="dataForm.explanation"
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
                @fileChange="flieChange"
                @removeFile="removeFile"
                ref="importConpontsData"
              ></importConpontsData>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row>
                     <a-col :span="12">
                    <a-form-model-item label="变更申请人" prop="o" :labelCol="{ style: 'width: 140px' }">
                    <a-input
                        v-model.trim="dataForm.o"
                        disabled
                    ></a-input>
                    </a-form-model-item>
                </a-col>
                 <a-col :span="12">
                    <a-form-model-item label="变更单位" prop="m" :labelCol="{ style: 'width: 160px' }">
                    <a-input
                        v-model.trim="dataForm.m"
                        disabled
                    ></a-input>
                    </a-form-model-item>
                </a-col>
                </a-row>
                <a-row>
                     <a-col :span="12">
                    <a-form-model-item label="变更申请日期" prop="n" :labelCol="{ style: 'width: 140px' }">
                    <a-input
                        disabled
                        v-model.trim="dataForm.n"
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
import importConpontsData from '@/components/importConpontsData'
import { encode } from '@/api/dataDictionary'
import equipmentModel from './equipmentModel.vue'
import {
  saveData,
  editData,
  submit,
} from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'
export default {
  name: 'formModel',
  components: { importConpontsData, equipmentModel },
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    typeModel: {
      type: Object,
      default: () => {
        return { type: 'add', title: '新增设备变更' }
      },
    },
  },
  data() {
    return {
      // 弹窗
      equipmentVisible: false,
      // 变更类型下拉框
      changeTypeOptions: [
        {
          label: '仪表参数变更',
          value: '0',
        },
        {
          label: '仪表逻辑变更',
          value: '1',
        },
        {
          label: '设备技术改造变更',
          value: '2',
        },
        {
          label: '同类替换',
          value: '3',
        },
        {
          label: '其他变更',
          value: '4',
        },
      ],
      // 变更级别下拉框
      level: [
        {
          value: '一般',
          label: '一般',
        },
        {
          value: '重大',
          label: '重大',
        },
      ],
      // 作业区域下拉框
      selectData: [],
      // 表单
      dataForm: {
        changeNo: '',
        changeType: '0',
        changeName: '',
        changeLevel: '一般',
        sbbm: '',
        beforeParam: '',
        afterParam: '',
        workArea: undefined,
        afterSbbm: '',
        changeReason: '',
        explanation: '',
        attachment: '',
        // o:'',
        // m:'',
        // n:moment().format("YYYY-MM-DD")
      },
      // 校验
      rules: {
        // ChangeNo: [
        //     { required: true, message: '变更编号不能为空', trigger: 'blur' },
        // ],
        changeType: [
          { required: true, message: '变更类型不能为空', trigger: 'blur' },
        ],
        changeName: [
          { required: true, message: '变更名称不能为空', trigger: 'blur' },
        ],
        changeLevel: [
          { required: true, message: '变更级别不能为空', trigger: 'change' },
        ],
        sbbm: [
          {
            required: true,
            message: '设备名称/设备位号/设备编码不能为空',
            trigger: 'blur',
          },
        ],
        beforeParam: [
          { required: true, message: '变更前参数不能为空', trigger: 'blur' },
        ],
        afterParam: [
          { required: true, message: '变更后参数不能为空', trigger: 'blur' },
        ],
        workArea: [
          { required: true, message: '作业区域不能为空', trigger: 'change' },
        ],
        afterSbbm: [
          {
            required: true,
            message: '变更后设备编码不能为空',
            trigger: 'change',
          },
        ],
        changeReason: [
          { required: true, message: '变更原因不能为空', trigger: 'blur' },
        ],
        explanation: [
          { required: true, message: '详细变更说明不能为空', trigger: 'blur' },
        ],
        // attachment: [
        //   { required: true, message: '相关附件不能为空', trigger: 'change' },
        // ],
      },
    }
  },
  methods: {
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position')
    },
    // 打开弹窗调用
    handleOpen(row) {
      this.encode()
      if (this.typeModel.type === 'edit') {
        this.dataForm = { ...row }
        if (this.dataForm.attachment) {
          this.$refs.importConpontsData.fileList = [
            {
              uid: '1',
              name: this.dataForm.attachment,
            },
          ]
        }
        this.dataForm.sbbm = `${this.dataForm.eqm_sbmc}/${this.dataForm.eqm_sbwh}/${this.dataForm.sbbm}`
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
      this.file = ''
      this.$refs.importConpontsData.removeFile()
      this.$refs.dataForm.resetFields()
      this.$refs.equipmentModel.reset()
      ;(this.dataForm.beforeParam = ''),
        (this.dataForm.afterParam = ''),
        (this.dataForm.afterSbbm = ''),
        this.$emit('update:visible', false)
    },
    // 确定
    handleOk(flag) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let api = saveData
          let data = new FormData()
          this.dataForm.sbbm = this.dataForm.sbbm.split('/')[2]
          data.append('strJson', JSON.stringify(this.dataForm))
          data.append('file', this.file)
          if (this.typeModel.type === 'edit') {
            api = editData
          }
          this.success(api, data, flag)
        }
      })
    },
    success(api, data, flag) {
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
    selectedClic(value) {
      this.dataForm.sbbm = `${value.eqm_sbmc}/${value.eqm_sbwh}/${value.eqm_sbbm}`
      this.equipmentVisible = false
    },
  },
}
</script>
<style lang="less" scoped></style>
