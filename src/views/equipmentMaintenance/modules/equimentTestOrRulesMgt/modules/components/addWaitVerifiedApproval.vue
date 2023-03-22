<template>
  <div>
    <a-layout>
      <a-layout-content>
        <a-form-model
          ref="dataForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
        >
          <a-col :span="12">
            <a-form-model-item label="审批结果">
              <a-input v-model="form.recordStatusType" disabled />
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
                :isShow="typeModel === 'submitForm' ? true : false"
                :id="tableModel.id"
                @approvalMethod="approvalMethod"
              />
            </div>
          </a-col>
        </a-form-model>
      </a-layout-content>
    </a-layout>
    <div class="footer contneFormBtnStyle ant-modal-footer">
      <!-- <a-button
        type="primary"
        v-if="typeModel === 'submitForm' ? true : false"
        @click="submitClick"
      >
        提交
      </a-button> -->
      <a-button
        type="primary"
        v-if="typeModel === 'submitForm' ? true : false"
        @click="submitClick('1')"
        >同意</a-button
      >
      <a-button
        type="danger"
        v-if="typeModel === 'submitForm' ? true : false"
        @click="submitClick('0')"
        >驳回</a-button
      >
      <a-button @click="cancelClick">取消 </a-button>
    </div>
  </div>
</template>
<script>
import stepsModel from '@/components/approvalRecord'
// import stepsModel from '@/views/dispatching/components/stepsModel.vue'
import {
  updataCondition,
  eqmVerificationApplyFormAudio,
} from '@/api/equimentTestOrRulesMgt/waitVerifiedApproval/waitVerifiedApproval'
export default {
  components: { stepsModel },
  props: {
    submitVisible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    typeModel: {
      type: String,
      default: () => {
        return 'submitForm'
      },
    },
    tableModel: {
      type: Object,
      default: () => {
        return false
      },
    },
  },
  watch: {
    tableModel(val) {
      this.form = val
    },
  },

  data() {
    return {
      labelCol: { span: 5 },
      form: {},
      // 校验
      rules: {
        applicationFormNo: [
          { required: true, message: '申请单编号不能为空', trigger: 'change' },
        ],
        // eqmName: [
        //   { required: true, message: '设备名称不能为空', trigger: 'change' },
        // ],
        // eqmNo: [
        //   { required: true, message: '设备位号不能为空', trigger: 'change' },
        // ],
        // belongToEqm: [
        //   { required: true, message: '所属设备不能为空', trigger: 'change' },
        // ],
        urgencyDegree: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        whetherCanCheckMaintenance: [
          { required: true, message: '检维修条件不能为空', trigger: 'change' },
        ],
        agreeOrDismiss: [
          { required: true, message: '审批结果不能为空', trigger: 'change' },
        ],
        departmentComments: [
          {
            required: true,
            message: '部门领导意见不能为空',
            trigger: 'change',
          },
        ],
      },
    }
  },
  methods: {
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
    submitClick(val) {
      this.$refs.stepsModel.verificationChange(val)
    },
    approvalMethod(type) {
      const data = {
        id: this.tableModel.id,
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
      }
      eqmVerificationApplyFormAudio(data).then((res) => {
        this.cancelClick()
      })
    },
    cancelClick() {
      this.formClose()
    },
    formClose() {
      this.$emit('close')
    },
  },
  created() {
    if (this.tableModel) {
      this.form = this.tableModel
      this.form.recordStatusType = this.funCol(this.form.recordStatus)
      this.form.agreeOrDismiss = this.form.agreeOrDismiss
        ? this.form.agreeOrDismiss
        : 1
    }
  },
}
</script>
