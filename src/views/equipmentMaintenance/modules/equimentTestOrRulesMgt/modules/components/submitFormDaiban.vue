<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="from-style bigModel">
        <a-form-model :model="submitForm" :label-col="labelCol">
          <a-row>
            <div class="securityCheck">
              <dc-table
                rowKey="id"
                @change="paginationChange"
                :pagination="pagination"
                :row-selection="{
                  selectedRowKeys: selectedRowKeys,
                  onChange: onSelectChange,
                  columnWidth: '30px',
                }"
                :scroll="{ x: 100 }"
                :columns="columns"
                :dataSource="dataSource"
                :openSelector="true"
              >
              </dc-table>
            </div>
            <a-col :span="12">
              <a-form-model-item label="申请人">
                <a-input v-model="submitForm.createdUser" disabled />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="申请时间">
                <a-input v-model="submitForm.createdDateTime" disabled />
              </a-form-model-item>
            </a-col>
          </a-row>
          <div>
            <stepsModel
              ref="stepsModel"
              :isShow="true"
              :id="formData.id"
              @approvalMethod="submitClick"
            />
          </div>
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
import { findAllByYear } from '@/api/equimentTestOrRulesMgt/verificationPlanMonth/verificationPlanMonth'
import { companySelect } from '@/api/outsourceCompany'
import {
  getById,
  yearApproval,
} from '@/api/equimentTestOrRulesMgt/verificationPlanYear/verificationPlanYear'
import stepsModel from '@/components/approvalRecord/index.vue'
import moment from 'moment'
export default {
  components: { stepsModel },
  props: {
    typeModel: {
      type: String,
      default: 'submitForm',
    },
  },
  watch: {
    formData: {
      handler(newData) {
        this.selectFrom.planAnnual = newData.planAnnual ?? ''
        this.selectFrom.planYear = newData.planAnnual ?? ''
        this.selectFrom.annualPlanNo = newData.annualPlanNo ?? ''
        this.submitForm.createdUser = this.$store.state.user.name
        this.submitForm.createdDateTime = moment().format('YYYY-MM-DD')
        if (newData.planAnnual) {
          this.getMonthDetailsList()
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      formData: {},
      // 状态下拉框
      recordStatusOptions: [
        {
          label: '已保存',
          value: '1',
        },
        {
          label: '已提交',
          value: '2',
        },
        {
          label: '审批中',
          value: '3',
        },
        {
          label: '已通过',
          value: '4',
        },
        {
          label: '已拒绝',
          value: '5',
        },
      ],
      company: [], //外委单位下拉框
      labelCol: { span: 5 },
      submitForm: {
        createdUser: '',
        createdDateTime: '',
      },
      selectFrom: {
        pageNum: 1,
        pageSize: 10,
        planMonth: '',
        planYear: '',
        annualPlanNo: '',
      },
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      selectedRowKeys: [],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
        },
        {
          title: '设备类型',
          dataIndex: 'eqmType',
          width: 80,
        },
        {
          title: '设备分类',
          dataIndex: 'eqmClassify',
          width: 80,
        },
        {
          title: '设备名称',
          dataIndex: 'eqmName',
          width: 80,
        },
        {
          title: '设备位号',
          dataIndex: 'eqmNo',
          width: 80,
        },
        {
          title: '所属设备',
          dataIndex: 'belongToEqm',
          width: 80,
        },
        {
          title: '规格型号',
          dataIndex: 'specificationModel',
          width: 80,
        },
        {
          title: '投用日期',
          dataIndex: 'putIntoUseTime',
          width: 80,
        },
        {
          title: '检定周期',
          dataIndex: 'checkCycle',
          width: 80,
        },
        {
          title: '上次检定时间',
          dataIndex: 'lastVerificationTime',
          width: '130px',
        },
        {
          title: '下次检定时间',
          dataIndex: 'nextVerificationTime',
          width: '130px',
        },
        {
          title: '检验单位',
          dataIndex: 'inspectionUnit',
          width: 80,
          customRender: (text) =>
            (text = this.company.filter((obj) => text === obj.value)[0]?.label),
        },
        {
          title: '检定状态',
          dataIndex: 'calibrationStatus',
          width: '130px',
        },
      ],
      dataSource: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getById({ id: this.$route.query.id }).then((res) => {
        let { body } = res
        this.formData = { ...body }
      })
      this.getOutsourceCompany()
    },
    rejectClick() {
      this.$refs.stepsModel.verificationChange('0')
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange('1')
    },
    // 获取外委单位列表
    getOutsourceCompany() {
      companySelect().then((res) => {
        // this.company = res.body
        res.body.forEach((item) => {
          this.company.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          })
        })
      })
    },
    paginationChange(pagination) {
      this.selectFrom.pageNum = pagination.current
      this.selectFrom.pageSize = pagination.pageSize
      this.getMonthDetailsList()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    getMonthDetailsList() {
      findAllByYear(this.selectFrom).then((res) => {
        this.dataSource = res.body.data
        this.pagination.current = res.body.pageIndex
        this.pagination.total = res.body.total
        this.pagination.pageSize = res.body.pageSize
      })
    },
    submitClick() {
      let data = {
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.formData.id,
      }
      yearApproval(data).then((res) => {
        if (res.code == 200) {
          this.$message.success('完成审核')
          this.cancelClick()
        }
      })
    },
    cancelClick() {
      this.$router.go(-1)
    },
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
