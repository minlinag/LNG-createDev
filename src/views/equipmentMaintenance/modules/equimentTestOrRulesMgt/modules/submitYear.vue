<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <!-- 查询 -->
              <a-form-model layout="inline" :model="selectFrom">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="审批结果"
                  >
                    <a-select
                      v-model="selectFrom.recordStatus"
                      show-search
                      placeholder="请选择"
                      option-filter-prop="children"
                      :options="recordStatusOptions"
                    >
                      <a-select-option
                        v-for="item in recordStatusOptions"
                        :key="item.id"
                        :value="item.value"
                        :label="item.label"
                      >
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="计划年度"
                  >
                    <a-select
                      v-model="selectFrom.planAnnual"
                      show-search
                      placeholder="请选择"
                      option-filter-prop="children"
                      :options="yearOption"
                    >
                      <a-select-option
                        v-for="item in yearOption"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      >
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item>
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click="search"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click="resetForm">
                      重置
                    </a-button>
                  </a-form-model-item>
                </a-col>
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
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
            <template slot="recordStatus" slot-scope="text">
              {{ text | recordStatus }}
            </template>
            <template slot="operation" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'Submit',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'submit',
                    disabled: $audit.auditDisabled(row.toDoUserCode),
                    name: '审批',
                  },
                  {
                    value: 'View',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'view',
                    name: '详情',
                  },
                ]"
                @view="view(row)"
                @submit="submit(row)"
              ></pe-button>
            </template>
          </dc-table>
        </div>
        <!-- 审批弹框 -->
        <submit-form
          :submit-visible="submitVisible"
          @close="submitFormClose"
          :typeModel="typeModel"
          @pass="passChange"
          :formData="formData"
          :submitModel="submitModel"
        >
        </submit-form>
      </template>
    </Breadcrumb>
    <div class="add-form"></div>
  </div>
</template>
<script>
import submitForm from './components/submitForm.vue'
import { findYear } from '@/api/equimentTestOrRulesMgt/verificationPlanYear/verificationPlanYear'
import { yearApproval } from '@/api/equimentTestOrRulesMgt/verificationPlanYear/verificationPlanYear'
import { annualPlan } from '@/api/equimentTestOrRulesMgt/verificationPlanYear/verificationPlanYear'
export default {
  components: { submitForm },
  filters: {
    recordStatus(val) {
      let value = ''
      switch (val) {
        case '1':
          value = '已保存'
          break
        case '2':
          value = '已提交'
          break
        case '3':
          value = '审批中'
          break
        case '4':
          value = '已审批'
          break
        case '5':
          value = '已拒绝'
          break
        default:
          break
      }
      return value
    },
  },
  name: '',
  // 临时
  // components:{},
  // props:{},
  data() {
    return {
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
      formData: {},
      typeModel: 'submitForm',
      
      submitModel: {title: "年度检定计划-审批" },
      yearOption: [],
      labelCol: { span: 4 },
      submitVisible: false,
      submitOption: [
        {
          value: '已通过',
          label: '已通过',
        },
        {
          value: '未审批',
          label: '未审批',
        },
        {
          value: '已拒绝',
          label: '已拒绝',
        },
      ],
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
          title: '审批结果',
          dataIndex: 'recordStatus',
          scopedSlots: { customRender: 'recordStatus' },
          align: 'center',
          // width: 70,
        },
        {
          title: '计划年度',
          dataIndex: 'planAnnual',
          align: 'center',
          // width: 70,
        },
        {
          title: '最后编辑人',
          dataIndex: 'lastModifiedUser',
          align: 'center',
          // width: 90,
        },
        {
          title: '最后修改时间',
          dataIndex: 'lastModifiedDateTime',
          align: 'center',
          // width: 140,
        },
        {
          title: '操作',
          width: 100,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
      dataSource: [],
      selectFrom: {
        recordStatus: '',
        planAnnual: this.$route.query.planAnnual || '',
        pageNum: 1,
        pageSize: 10,
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
    }
  },
  // 监听当前数据变化
  // watch: {

  // },
  // 计算数据变化
  // computed: {},
  // 实例创建完成后调用
  // created: {},
  // 实例被挂载后调用
  mounted() {
    this.showYearOption()
    this.getAnnualPlan()
    // this.$route.query.planAnnual
    // debugger
    console.log(this.$route.query.id)
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    getAnnualPlan() {
      annualPlan(this.selectFrom).then((res) => {
        this.dataSource = res.body.data
        this.pagination.total = res.body.total
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
      })
    },
    passChange(val, callback) {
      yearApproval(val).then((res) => {
        if (res.code == 200) {
          this.$message.success('完成审核')
          this.submitFormClose()
          callback()
        }
      })
    },
    showYearOption() {
      findYear().then((res) => {
        res.body.forEach((item) => {
          this.yearOption.push({
            label: item,
            value: item,
          })
        })
      })
    },
    submitFormClose() {
      this.submitVisible = false
      this.getAnnualPlan()
    },
    submit(value) {
      this.typeModel = 'submitForm'
      this.formData = value
      this.submitFormOpen()
      this.submitModel={title: "年度检定计划-审批" }
    },
    view(value) {
      this.typeModel = 'view'
      this.formData = value
      this.submitFormOpen()
      this.submitModel={title: "年度检定计划审批-查看" }
    },
    submitFormOpen() {
      this.submitVisible = true
    },
    addListClick() {
      this.addvisible = true
    },
    deleteListClick() {},
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    paginationChange(pagination) {
      this.selectFrom.pageNum = pagination.current
      this.selectFrom.pageSize = pagination.pageSize
      this.getAnnualPlan()
    },
    search() {
      this.selectFrom.pageNum = 1
      this.selectFrom.pageSize = 10
      this.getAnnualPlan()
    },
    resetForm() {
      this.selectFrom = {
        recordStatus: '',
        planAnnual: '',
      }
      this.getAnnualPlan()
    },
  },
}
</script>
<style scoped lang="less"></style>
