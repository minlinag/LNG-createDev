<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="from-style bigModel">
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
            :isShow="true"
            :id="detailForm.id"
            @approvalMethod="handleOk"
          />
        </a-form-model>
        <div class="ant-modal-footer">
          <a-button type="primary" @click="agreeClick">同意</a-button>
          <a-button type="danger" @click="rejectClick">驳回</a-button>
          <a-button @click="handleCancel">返回</a-button>
        </div>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import { encode } from '@/api/dataDictionary'
import stepsModel from '@/components/approvalRecord/index.vue'
import {
  approval,
  selectByID,
} from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'
export default {
  components: { stepsModel },
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
  mounted() {
    this.handleOpen()
  },
  methods: {
    // 打开弹窗调用
    handleOpen() {
      selectByID({ id: this.$route.query.id }).then((res) => {
        let { body } = res
        this.detailForm = { ...body }
        this.detailForm.sbbm = `${body.eqm_sbmc}/${body.eqm_sbwh}/${body.sbbm}`
      })
      this.encode()
    },
    rejectClick() {
      this.$refs.stepsModel.verificationChange('0')
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange('1')
    },
    handleCancel() {
      this.detailForm.id = ''
      this.$router.go(-1)
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
      encode('SBGL-JH-ZYSSQY').then((res) => {
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
<style lang="less" scoped>
.step {
  margin-top: 30px;
  margin-bottom: 30px;
}

.descriptionBox {
  margin-top: 10px;
}
/deep/.ant-row {
  .ant-form-item-label {
    overflow: unset;
    width: 120px !important;

    label {
      text-align: left;
      line-height: 15px;
      padding-right: 5px;
      width: 120px !important;
      white-space: pre-wrap;
      min-height: 40px;
      display: flex;
      justify-content: right;
      align-items: center;
    }
  }
}
/deep/textarea {
  width: 100% !important;
}
.ant-modal-footer {
  text-align: center !important;
}
</style>
