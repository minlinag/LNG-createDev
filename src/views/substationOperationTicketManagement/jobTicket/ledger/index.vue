<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[{ value: 'Delete', clickName: 'deleteClick' }]"
        @deleteClick="deleteClick"
      ></pe-button>
    </template>
    <template slot="appMain" class="app_main">
      <div class="main_body">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="编号"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.codeNo"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="单位"
                  >
                    <a-select
                      v-model="queryParams.company"
                      style="width: 100%"
                      placeholder="请选择"
                    >
                      <a-select-option
                        :value="item.OutsourceCompanyName"
                        v-for="item in companySelectOption"
                        :key="item.OutsourceCompanyName"
                      >
                        {{ item.OutsourceCompanyName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="工作负责人"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.responsibleUser"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="班组"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.classTeam"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="10">
                  <a-form-model-item
                    label="计划工作时间:"
                    :labelCol="{ style: 'width: 120px' }"
                  >
                    <a-range-picker
                      style="min-width: auto"
                      show-time
                      v-model="runTime"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      type="date"
                      @change="runTimeChange"
                      :placeholder="['起始时间', '结束时间']"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item>
                    <a-button
                      class="buttonType"
                      type="primary"
                      @click="inquireClick"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click="resetClick">
                      重置
                    </a-button></a-form-model-item
                  ></a-col
                >
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
        <div class="system_file_table">
          <!-- 表格 -->
          <a-table
            :scroll="{ y: 1, x: 300 }"
            class="list_table_1"
            @change="paginationChange"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              fixed: true,
            }"
            rowKey="id"
            :pagination="pagination"
            :columns="columns"
            :dataSource="dataSource"
            :openSelector="true"
          >
            <!-- 行内操作列按钮 -->
            <template slot="operation" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'audit',
                    name: '审核',
                    style: 'btn_link',
                    clickName: 'auditClick',
                    icon: '',
                    type: 'link',
                    disabled: $audit.auditDisabled(row.toDoUserCode),
                  },
                  {
                    value: '详情',
                    type: 'link',
                    clickName: 'look',
                    style: ['btn_link'],
                    isPower: false,
                  },
                ]"
                @auditClick="auditClick(row)"
                @look="lookClick(row)"
              ></pe-button>
            </template>
          </a-table>
        </div>
      </div>

      <a-modal
        :title="formTitle"
        :visible="hiddenVisible"
        :width="1000"
        @cancel="cancelHidden"
        :maskClosable="false"
        class="from-style bigModel"
        destroyOnClose
      >
        <add-edit-form
          ref="addEditFormRef"
          @cancel="addEditFormCancel"
          :type="queryParams.type"
          :hiddenVisible="hiddenVisible"
          :check-form="checkForm"
          :form-edit-data="formEditData"
          v-if="!checkFormTable"
          @approval="approvalStart"
        ></add-edit-form>
        <review
          ref="reviewRef"
          @cancel="reviewCancel"
          :type="queryParams.type"
          :hiddenVisible="hiddenVisible"
          :check-form="checkForm"
          :approvalShow="approvalShow"
          :form-data="formEditData"
          v-else
        ></review>
        <template #footer>
          <div style="text-align: center">
            <a-button type="primary" @click="agreeClick" v-if="auditStart"
              >同意</a-button
            >
            <a-button type="danger" @click="rejectClick" v-if="auditStart"
              >驳回</a-button
            >
            <a-button @click="cancelHidden">取消</a-button>
          </div>
        </template>
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import addEditForm from "@/views/substationOperationTicketManagement/jobTicket/components/addEditForm.vue"
import review from "@/views/substationOperationTicketManagement/jobTicket/components/review.vue"
import { getListForShenHe, companySelect, selectByID, deleteshenhe, applyAudio } from "@/api/substationOperationTicketManagement/jobTicketApply.js"
export default {
  name: 'jobTicketApply',
  components: { addEditForm, review },
  data() {
    return {
      queryParams: {
        codeNo: "",
        company: undefined,
        responsibleUser: "",
        classTeam: "",
        startRunTime: "",
        endRunTime: "",
        pageNum: 1,
        pageSize: 10,
      },
      formEditData: {},
      pagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      selectedRowKeys: [],
      dataSource: [],
      formTitle: `第${this.$route.path == '/firstJobTicketLedger' ? '一' : '二'}种工作票申请-新增`,
      checkForm: false,
      hiddenVisible: false,
      checkFormTable: false,
      approvalShow: false,
      auditStart: false,
      runTime: [],
      companySelectOption: [],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
        },
        {
          title: '编号',
          dataIndex: 'codeNo',
          width: 150,
        },
        {
          title: '单位',
          dataIndex: 'company',
          width: 150,
        },
        {
          title: '工作负责人',
          dataIndex: 'responsibleUser',
          width: 100,
        },
        {
          title: '班组',
          dataIndex: 'classTeam',
          width: 150,
        }, {
          title: '计划工作时间（起）',
          dataIndex: 'startRunTime',
          width: 150,
        }, {
          title: '计划工作时间（止）',
          dataIndex: 'endRunTime',
          width: 150,
        }, {
          title: '状态',
          fixed: 'right',
          width: 120,
          dataIndex: 'recordStatus',
          customRender: (value) => {
            return {
              children: this.recordStatus(value),
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 120,
          fixed: 'right',
        },
      ],
    }
  },
  // 监听路由是否变化
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.resetClick()
        this.getTableList()
        this.getCompanySelect()
      },
      deep: true,
    },
  },
  created() {
    this.resetClick()
    this.getTableList()
    this.getCompanySelect()
  },
  methods: {
    getTableList() {
      this.queryParams.dataType = this.$route.path == '/firstJobTicketLedger' ? '1' : '2'
      getListForShenHe(this.queryParams).then(res => {
        this.pagination.total = res.body.total
        this.dataSource = res.body.data
      })
    },
    auditClick(row) {
      this.formTitle = `第${this.$route.path == '/firstJobTicketLedger' ? '一' : '二'}种工作票申请-审核`;
      this.checkForm = true
      this.auditStart = true
      this.checkFormTable = false
      this.getFormData(row)
    },
    lookClick(row) {
      this.checkForm = true
      this.checkFormTable = true
      this.formTitle = `第${this.$route.path == '/firstJobTicketLedger' ? '一' : '二'}种工作票申请-详情`;
      this.getFormData(row)
      this.auditStart = false

    },
    getFormData(row) {
      selectByID({ id: row.id }).then(res => {
        if (res.code == "200") {
          this.hiddenVisible = true
          let formEditData = res.body[0]
          // formEditData.bzList = res.body.data.map(
          //   (item) => {
          //     return {
          //       content1: item.content1,
          //       content2: item.content2
          //     }
          //   }
          // )
          // formEditData.csList = res.body.data.map(
          //   (item) => {
          //     return {
          //       csName: item.csName,
          //       isExecute: item.isExecute,
          //       isEdit: item.isEdit,
          //     }
          //   }
          // )
          this.formEditData = formEditData
        }
      })
    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteshenhe(this.selectedRowKeys).then((res) => {
          if (res.code == '200') {
            this.selectedRowKeys = [];
            this.getTableList();
            this.$message.success("删除成功！");
          }
        });
      } else {
        this.$message.warning("请选择数据！");
      }

    },
    inquireClick() {
      this.pagination.current = 1
      this.queryParams.pageNum = 1
      this.getTableList()
    },
    resetClick() {
      this.queryParams = {
        codeNo: "",
        company: undefined,
        responsibleUser: "",
        classTeam: "",
        startRunTime: "",
        endRunTime: "",
        pageNum: 1,
      }
      this.runTime = []
      this.pagination.current = 1
      this.getTableList()
    },
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    paginationChange(pagination) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.queryParams.pageNum = pagination.current
      this.queryParams.pageSize = pagination.pageSize
    },
    cancelHidden() {
      this.hiddenVisible = false
    },
    addEditFormCancel() {
      this.hiddenVisible = false
      this.getTableList()
    },
    reviewCancel() {
      this.hiddenVisible = false
      this.checkFormTable = false
      this.getTableList()
    },
    agreeClick() {
      this.$refs.addEditFormRef.agree();
    },
    rejectClick() {
      this.$refs.addEditFormRef.reject();
    },
    approvalStart(val) {
      applyAudio(val).then((res) => {
        if (res.body == "true") {
          this.$message.success("完成审核");
          this.hiddenVisible = false
          this.getTableList()
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    confirmClick() {
      this.$refs.addEditFormRef.confirm();
    },
    recordStatus(val) {
      // 已保存-1、已提交-2、审批中-3、已审批-4、已拒绝-5
      return val == 1 ? '已保存' : val == 2 ? '已提交' : val == 3 ? '审批中' : val == 4 ? '已审批' : val == 5 ? '已拒绝' : ''
    },
    getCompanySelect() {
      companySelect().then(res => {
        if (res.code == '200') {
          this.companySelectOption = res.body
        }
      })
    },
    runTimeChange(val) {
      if (val && val.length !== 0) {
        this.queryParams.startRunTime = val[0]
        this.queryParams.endRunTime = val[1]
      } else {
        this.queryParams.startRunTime = ''
        this.queryParams.endRunTime = ''
      }
    },
  },
}
</script>
<style lang="less" scoped>
::v-deep .app_main {
  .main_body {
    #components-layout-demo-basic {
      height: auto;
      padding: 20px;
      padding-bottom: 10px;
    }
  }
}
</style>