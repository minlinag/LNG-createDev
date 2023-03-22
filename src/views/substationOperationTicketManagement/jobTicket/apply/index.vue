<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addClick' },
          { value: 'Delete', clickName: 'deleteClick' },
        ]"
        @addClick="addClick"
        @deleteClick="deleteClick"
      ></pe-button>
    </template>
    <template slot="appMain" class="app_main">
      <div class="main_body">
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
                    value: 'Edit',
                    type: 'link',
                    clickName: 'edit',
                    icon: '',
                    style: ['btn_link'],
                    disabled: $audit.editDisabled(row.recordStatus),
                  },
                  {
                    value: 'archive',
                    type: 'link',
                    clickName: 'archive',
                    name: '归档',
                    icon: '',
                    isPower: false,
                    style: ['btn_link'],
                    disabled: archiveDisabled(row.recordStatus),
                  },
                  {
                    value: '详情',
                    type: 'link',
                    clickName: 'look',
                    style: ['btn_link'],
                    isPower: false,
                  },
                ]"
                @edit="editClick(row)"
                @archive="archiveClick(row)"
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
        ></add-edit-form>
        <review
          ref="reviewRef"
          @cancel="reviewCancel"
          :type="queryParams.type"
          :hiddenVisible="hiddenVisible"
          :check-form="checkForm"
          :approvalShow="approvalShow"
          :form-data="formEditData"
          v-else-if="!archiveShow"
        ></review>
        <archive
          v-else
          @cancel="addEditFormCancel"
          :hiddenVisible="hiddenVisible"
          :form-data="formEditData"
          ref="archiveRef"
        ></archive>
        <template #footer>
          <div style="text-align: center">
            <a-button type="primary" @click="confirmClick" v-if="!checkForm"
              >确定</a-button
            >
            <a-button
              type="primary"
              @click="archiveConfirmClick"
              v-if="archiveShow"
              >确定</a-button
            >
            <a-button type="primary" @click="submitClick" v-if="!checkForm"
              >提交</a-button
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
import archive from "@/views/substationOperationTicketManagement/jobTicket/components/archive.vue"
import { getListForPage, selectByID, deleteByID } from "@/api/substationOperationTicketManagement/jobTicketApply.js"
export default {
  name: 'jobTicketApply',
  components: { addEditForm, review, archive },
  data() {
    return {
      queryParams: {
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
      formTitle: `第${this.$route.path == '/firstJobTicketApply' ? '一' : '二'}种工作票申请-新增`,
      checkForm: false,
      hiddenVisible: false,
      checkFormTable: false,
      approvalShow: false,
      archiveShow: false,
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
        }, {
          title: '状态',
          fixed: 'right',
          dataIndex: 'recordStatus',
          width: 120,
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
        this.getTableList()
      },
      deep: true,
    },
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      this.queryParams.dataType = this.$route.path == '/firstJobTicketApply' ? '1' : '2'
      getListForPage(this.queryParams).then(res => {
        this.pagination.total = res.body.total
        this.dataSource = res.body.data
      })
    },
    editClick(row) {
      this.formTitle = `第${this.$route.path == '/firstJobTicketApply' ? '一' : '二'}种工作票申请-编辑`;
      this.checkForm = false
      this.checkFormTable = false
      this.archiveShow = false
      this.getFormData(row)
    },
    archiveClick(row) {
      this.checkForm = true
      this.checkFormTable = true
      this.approvalShow = false
      this.archiveShow = true
      this.formTitle = `第${this.$route.path == '/firstJobTicketApply' ? '一' : '二'}种工作票申请-归档`;
      this.getFormData(row)
    },
    lookClick(row) {
      this.checkForm = true
      this.checkFormTable = true
      this.archiveShow = false
      this.formTitle = `第${this.$route.path == '/firstJobTicketApply' ? '一' : '二'}种工作票申请-详情`;
      this.getFormData(row)

    },
    getFormData(row) {
      selectByID({ id: row.id }).then(res => {
        if (res.code == "200") {
          this.hiddenVisible = true
          let formEditData = res.body[0]
          if (formEditData.attInfo) {
            formEditData.attInfo = this.$fileUploadJSON.toParse(formEditData.attInfo)
          }
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
    addClick() {
      this.formTitle = `第${this.$route.path == '/firstJobTicketApply' ? '一' : '二'}种工作票申请-新增`;
      this.checkForm = false
      this.checkFormTable = false
      this.hiddenVisible = true
      this.archiveShow = false
      this.formEditData = {
        company: "", //单位
        codeNo: "", //编号
        responsibleUser: "", //负责人
        classTeam: "", //班组
        teamMember: "", //班组成员
        totalPeople: "", //总人数
        stationEqmName: "", //变配电站名称及设备双重名称
        bzList: [], //工作任务
        startRunTime: "", //起始工作时间
        endRunTime: "" //结束工作时间
      }
    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteByID(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = [];
            this.$message.success("删除成功！");
          } else if (res.code == '202') {
            this.selectedRowKeys = [];
            this.$message.warning(res.msg);
          }
          this.getTableList();

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
      this.pagination.current = 1
      this.queryParams.pageNum = 1
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
    confirmClick() {
      this.$refs.addEditFormRef.confirm();
    },
    archiveConfirmClick() {
      this.$refs.archiveRef.confirm();
    },
    submitClick() {
      this.$refs.addEditFormRef.submit();
    },
    recordStatus(val) {
      // 已保存-1、已提交-2、审批中-3、已审批-4、已拒绝-5
      return val == 1 ? '已保存' : val == 2 ? '已提交' : val == 3 ? '审批中' : val == 4 ? '已审批' : val == 5 ? '已拒绝' : ''
    },
    archiveDisabled(row) {
      return row == 4 ? false : true
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