<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @cancel="handleCancel"
      :footer="null"
      class="from-style bigModel"
      :maskClosable="false"
      destroyOnClose
    >
      <a-form-model ref="detailForm" :model="detailForm">
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="变更编号"
              prop="changeNo"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-input
                v-model="detailForm.changeNo"
                placeholder="系统自动生成"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="变更类型"
              prop="changeType"
              :labelCol="{ style: 'width: 160px' }"
            >
              <a-select
                default-value="0"
                v-model="detailForm.changeType"
                disabled
              >
                <a-select-option
                  placeholder="请选择"
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in changeTypeOptions"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="变更名称"
              prop="changeName"
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-input
                v-model="detailForm.changeName"
                placeholder="请输入变更名称"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <a-form-model-item
              label="设备名称/设备位号/设备编码"
              prop="sbbm"
              :labelCol="{ style: 'width: 310px' }"
            >
              <a-input
                style="width: 497px"
                v-model="detailForm.sbbm"
                placeholder="请输入特征编码"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="作业区域"
              prop="workArea"
              :labelCol="{ style: 'width: 160px' }"
            >
              <a-select
                default-value="11"
                v-model="detailForm.workArea"
                disabled
              >
                <a-select-option
                  placeholder="请选择"
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in selectData"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="变更级别"
              prop="changeLevel"
              :labelCol="{ style: 'width: 160px' }"
            >
              <a-select
                default-value="一般"
                disabled
                v-model="detailForm.changeLevel"
              >
                <a-select-option
                  placeholder="请选择"
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in level"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="detailForm.changeType === '0'">
            <a-form-model-item
              label="变更前参数"
              prop="beforeParam"
              :labelCol="{ style: 'width: 130px' }"
            >
              <a-input
                v-model="detailForm.beforeParam"
                placeholder="请输入变更前参数"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="detailForm.changeType === '0'">
            <a-form-model-item
              label="变更后参数"
              prop="afterParam"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="detailForm.afterParam"
                placeholder="请输入变更后参数"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="detailForm.changeType === '3'">
            <a-form-model-item
              label="变更后设备编码"
              prop="afterSbbm"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="detailForm.afterSbbm"
                placeholder="请输入变更后设备编码"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              label="变更原因"
              prop="changeReason"
              :labelCol="{ style: 'width: 110px' }"
            >
              <a-textarea
                v-model="detailForm.changeReason"
                placeholder="请输入变更原因"
                disabled
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              label="详细变更说明"
              prop="explanation"
              :labelCol="{ style: 'width: 110px' }"
            >
              <a-textarea
                v-model="detailForm.explanation"
                disabled
                placeholder="请输入详细变更说明"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="变更申请人"
              prop="createdUser"
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-input v-model="detailForm.createdUser" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="变更单位"
              prop="createUserSubsidiaryOrgan"
              :labelCol="{ style: 'width: 160px' }"
            >
              <a-input
                v-model="detailForm.createUserSubsidiaryOrgan"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="变更申请日期"
              prop="lastModifiedDateTime"
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-input
                disabled
                v-model="detailForm.lastModifiedDateTime"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <stepsModel
          ref="stepsModel"
          :isShow="typeModel === 'edit' ? true : false"
          :id="detailForm.id"
          @approvalMethod="handleOk"
        />
      </a-form-model>
      <div class="ant-modal-footer">
        <!-- <a-button type="primary" @click="handleOk" v-if="typeModel === 'edit'"
          >确定</a-button
        > -->
        <span v-if="typeModel === 'edit'">
          <a-button type="primary" @click="agreeClick">同意</a-button>
          <a-button type="danger" @click="rejectClick">驳回</a-button>
        </span>
        <a-button @click="handleCancel">返回</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
// import importConpontsData from '@/components/importConpontsData'
import { encode } from '@/api/dataDictionary'
import stepsModel from '@/components/approvalRecord/index.vue'
import { approval } from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'
export default {
  name: 'detailModel',
  components: { stepsModel },
  props: {
    title: {
      type: String,
      default: '设备拆除',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    // view详情，edit编辑
    typeModel: {
      type: String,
      default: 'view',
    },
  },
  data() {
    return {
      // 详情数据
      detailForm: {},
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
      equipmentVisible: false,
      // 作业区域下拉框
      selectData: [],
    }
  },
  methods: {
    rejectClick() {
      this.$refs.stepsModel.verificationChange('0')
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange('1')
    },
    // 打开弹窗调用
    handleOpen(row) {
      this.detailForm = { ...row }
      this.detailForm.sbbm = `${row.eqm_sbmc}/${row.eqm_sbwh}/${row.sbbm}`
      this.encode()
    },
    handleCancel() {
      this.typeModel === 'edit' &&
        this.$refs.stepsModel.$refs.form.resetFields()
      this.detailForm.id = ''
      this.$emit('update:visible', false)
    },
    handleOk() {
      this.$refs.stepsModel.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            id: this.detailForm.id,
            type: this.$refs.stepsModel.form.type,
            opinion: this.$refs.stepsModel.form.opinion,
          }
          approval(data)
            .then((res) => {
              if (res.code == 200) {
                this.$message.success('审批成功')
                this.$parent.$parent.getList()
              }
              this.handleCancel()
            })
            .catch(() => {})
        }
      })
    },
    // 数据字典
    encode() {
      encode('AQYH-QYMC').then((res) => {
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
.step {
  margin-top: 30px;
  margin-bottom: 30px;
}

.descriptionBox {
  margin-top: 10px;
}
</style>
