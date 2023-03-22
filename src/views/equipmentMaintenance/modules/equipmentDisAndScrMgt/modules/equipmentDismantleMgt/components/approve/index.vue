<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="from-style bigModel">
        <a-form-model ref="detailForm" :model="detailForm">
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                label="记录状态"
                prop="recordStatus"
                :labelCol="{ style: 'width: 140px' }"
              >
                <a-select v-model.trim="detailForm.recordStatus" disabled>
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
            <a-col :span="16">
              <a-form-model-item
                label="申请编号"
                prop="applyCode"
                :labelCol="{ style: 'width: 140px' }"
              >
                <a-input
                  v-model="detailForm.applyCode"
                  placeholder="系统自动生成申请编号"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                label="设备名称"
                prop="deviceName"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  v-model="detailForm.deviceName"
                  placeholder="请输入设备名称"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="设备位号"
                prop="deviceBitNum"
                :labelCol="{ span: '10' }"
              >
                <a-input
                  v-model="detailForm.deviceBitNum"
                  placeholder="请输入设备位号"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="规格型号"
                prop="speModels"
                :labelCol="{ span: '10' }"
              >
                <a-input
                  v-model="detailForm.speModels"
                  placeholder="请输入规格型号"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                label="资产编号"
                prop="propertyCode"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  v-model="detailForm.propertyCode"
                  placeholder="请输入资产编号"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="设备数量"
                prop="deviceNum"
                :labelCol="{ span: '10' }"
              >
                <a-input
                  v-model="detailForm.deviceNum"
                  placeholder="请输入设备数量"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="使用部门"
                prop="useDept"
                :labelCol="{ span: '10' }"
              >
                <a-select
                  ref="select"
                  v-model="detailForm.useDept"
                  placeholder="请选择"
                  disabled
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
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                label="存放地点"
                prop="savePlace"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  v-model="detailForm.savePlace"
                  disabled
                  placeholder="请输入存放地点"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="原值(元)"
                prop="originalValue"
                :labelCol="{ span: '10' }"
              >
                <a-input
                  v-model="detailForm.originalValue"
                  disabled
                  placeholder="请输入元值(元)"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="累计折旧（元）"
                prop="totalDeprecition"
                :labelCol="{ span: '10' }"
              >
                <a-input
                  v-model="detailForm.totalDeprecition"
                  placeholder="请输入累计折旧（元）"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                label="净值(元)"
                prop="netWorth"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  v-model="detailForm.netWorth"
                  placeholder="请输入净值(元)"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="预计使用年限"
                prop="predictUseYear"
                :labelCol="{ span: '10' }"
              >
                <a-input
                  v-model="detailForm.predictUseYear"
                  placeholder="请输入预计使用年限"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="已用年限"
                prop="usedYear"
                :labelCol="{ span: '10' }"
              >
                <a-input
                  v-model="detailForm.usedYear"
                  placeholder="请输入已用年限"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                label="投用时间"
                prop="putUseTime"
                :labelCol="{ style: 'width: 140px' }"
              >
                <a-date-picker
                  v-model="detailForm.putUseTime"
                  disabled
                  valueFormat="YYYY-MM-DD"
                  placeholder="请选择投用时间"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="停用时间"
                prop="stopUseTime"
                :labelCol="{ style: 'width: 140px' }"
              >
                <a-date-picker
                  v-model="detailForm.stopUseTime"
                  disabled
                  valueFormat="YYYY-MM-DD"
                  placeholder="请选择停用时间"
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
                :labelCol="{ style: 'width: 120px' }"
              >
                <a-textarea
                  v-model="detailForm.mainReason"
                  disabled
                  placeholder="请输入拆除主要原因"
                  :auto-size="{ minRows: 6, maxRows: 6 }"
                ></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="可利用零部件"
                prop="useParts"
                :labelCol="{ style: 'width: 120px' }"
              >
                <a-textarea
                  v-model="detailForm.useParts"
                  disabled
                  placeholder="请输入可利用零部件"
                  :auto-size="{ minRows: 6, maxRows: 6 }"
                ></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                label="申请人"
                prop="createdUser"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input v-model="detailForm.createdUser" disabled></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="申请单位"
                prop="createdUserSubsidiaryOrgan"
                :labelCol="{ span: '10' }"
              >
                <a-input
                  v-model="detailForm.createdUserSubsidiaryOrgan"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="申请日期"
                prop="lastModifiedDateTime"
                :labelCol="{ span: '10' }"
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
import { dictList } from '@/api/equipmentMaintenance/equipmentDismantleMgt/equipmentDismantleMgt.js'
import { encode } from '@/api/dataDictionary'
import stepsModel from '@/components/approvalRecord/index.vue'
import {
  approval as disApproval,
  getById as disGetById,
} from '@/api/equipmentMaintenance/equipmentDismantleMgt/equipmentDismantleMgt.js'
import {
  approval as scrApproval,
  getById as scrGetById,
} from '@/api/equipmentMaintenance/equipmentScrapMgt/equipmentScrapMgt.js'
export default {
  name: 'detailModel',
  components: { stepsModel },
  props: {
    // view详情，edit编辑/dis拆除，scr报废{page:'dis',type:'edit'}
    typeModel: {
      type: Object,
      default: () => {
        return { page: 'scr', type: 'edit' }
      },
    },
  },
  data() {
    return {
      // 使用部门
      cdepartmentOptions: [],
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
        {
          title: '请选择',
          value: '',
        },
      ],
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
      // 选择设备弹窗控制
      equipmentVisible: false,
      // 作业区域下拉框
      selectData: [],
      // 详情数据
      detailForm: {},
    }
  },
  mounted() {
    this.handleOpen()
  },
  watch: {
    $route: {
      handler() {
        this.handleOpen()
      },
    },
  },
  methods: {
    // 打开弹窗调用
    handleOpen() {
      let API
      if (this.$route.path === '/approve') {
        this.typeModel.page = 'scr'
        API = scrGetById
      } else {
        this.typeModel.page = 'dis'
        API = disGetById
      }
      API({ id: this.$route.query.id }).then((res) => {
        let { body } = res
        this.detailForm = { ...body }
      })
      this.encode()
      this.dictList()
    },
    // 获取部门
    dictList() {
      dictList().then((res) => {
        this.cdepartmentOptions = res.body.data
      })
    },
    handleCancel() {
      this.$router.go(-1)
      this.detailForm.id = ''
    },
    handleOk() {
      this.$refs.stepsModel.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            id: this.detailForm.id,
            type: this.$refs.stepsModel.form.type,
            opinion: this.$refs.stepsModel.form.opinion,
          }
          let API
          if (this.typeModel.page === 'dis') {
            API = disApproval
          } else {
            API = scrApproval
          }
          API(data)
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
    rejectClick() {
      this.$refs.stepsModel.verificationChange('0')
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange('1')
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
