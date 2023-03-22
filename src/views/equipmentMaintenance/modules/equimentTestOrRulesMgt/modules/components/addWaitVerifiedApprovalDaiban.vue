<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="from-style bigModel">
        <a-form-model :model="form" :label-col="labelCol">
          <a-col :span="12">
            <a-form-model-item
              label="审批结果"
              prop="recordStatus"
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-select v-model.trim="form.recordStatus" disabled>
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
          <a-col :span="12">
            <a-form-model-item label="申请单编号" prop="applicationFormNo">
              <a-input v-model="form.applicationFormNo" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="设备名称" prop="eqmName">
              <a-input v-model="form.eqmName" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="设备位号" prop="eqmNo">
              <a-input v-model="form.eqmNo" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="所属设备" prop="belongToEqm">
              <a-input v-model="form.belongToEqm" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="紧急程度" prop="urgencyDegree">
              <a-input v-model="form.urgencyDegree" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="检维修条件"
              prop="whetherCanCheckMaintenance"
            >
              <a-input v-model="form.whetherCanCheckMaintenance" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="内容描述">
              <a-input v-model="form.contentDescription" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="申请人">
              <a-input v-model="form.toDoUserName" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="申请时间">
              <a-input v-model="form.d" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <div>
              <stepsModel
                ref="stepsModel"
                :isShow="true"
                :id="form.id"
                @approvalMethod="submitClick"
              />
            </div>
          </a-col>
        </a-form-model>
        <div class="ant-modal-footer">
          <a-button type="primary" @click="agreeClick">同意</a-button>
          <a-button type="danger" @click="rejectClick">驳回</a-button>
          <a-button @click="cancelClick">返回</a-button>
        </div>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import stepsModel from '@/components/approvalRecord/index.vue'
import {
  eqmVerificationApplyFormAudio,
  getById,
} from '@/api/equimentTestOrRulesMgt/waitVerifiedApproval/waitVerifiedApproval'
import moment from 'moment'
export default {
  components: { stepsModel },
  data() {
    return {
      labelCol: { span: 5 },
      form: {},
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
          label: '已审批',
        },
        {
          value: '5',
          label: '已拒绝',
        },
        {
          value: '6',
          label: '已派工',
        },
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getById({ id: this.$route.query.id }).then((res) => {
        let { body } = res
        this.form = {
          ...body,
          toDoUserName: this.$store.state.user.name,
          d: moment().format('YYYY-MM-DD'),
        }
      })
    },
    rejectClick() {
      this.$refs.stepsModel.verificationChange('0')
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange('1')
    },
    funCol(val) {
      switch (val) {
        case '1':
          return '已保存'
        case '2':
          return '未审核'
        case '3':
          return '审批中'
        case '4':
          return '已审批'
        case '5':
          return '已拒绝'
      }
    },
    submitClick() {
      const data = {
        id: this.form.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      }
      eqmVerificationApplyFormAudio(data).then((res) => {
        this.cancelClick()
      })
    },
    cancelClick() {
      this.$router.go(-1)
    },
  },
  created() {
    if (this.form) {
      this.form = this.form
      this.form.recordStatusType = this.funCol(this.form.recordStatus)
      this.form.agreeOrDismiss = this.form.agreeOrDismiss
        ? this.form.agreeOrDismiss
        : 1
    }
  },
}
</script>
<style lang="less" scoped>
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
