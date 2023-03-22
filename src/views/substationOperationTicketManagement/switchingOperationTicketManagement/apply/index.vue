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
                    value: '详情',
                    type: 'link',
                    clickName: 'look',
                    style: ['btn_link'],
                    isPower: false,
                  },
                ]"
                @edit="editClick(row)"
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
          :form-edit-data="formEditData"
          v-else
        ></review>
        <template #footer>
          <div style="text-align: center">
            <a-button type="primary" @click="confirmClick" v-if="!checkForm"
              >保存</a-button
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
import addEditForm from "./components/addEditForm.vue"
import review from "@/views/substationOperationTicketManagement/switchingOperationTicketManagement/components/review.vue"
import { getListForPage, selectByID, deleteByID } from "@/api/substationOperationTicketManagement/switchingOperationTicketManagement.js"
export default {
  name: 'switchingOperationTicketApply',
  components: { addEditForm, review },
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
      formTitle: '倒闸操作票-新增',
      checkForm: false,
      hiddenVisible: false,
      checkFormTable: false,
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
          title: '操作任务',
          dataIndex: 'runTask',
          width: 150,
        },
        {
          title: '单位',
          dataIndex: 'company',
          width: 150,
        },
        {
          title: '发令人',
          dataIndex: 'offerUser',
          width: 100,
        },
        {
          title: '受令人',
          dataIndex: 'receUser',
          width: 100,
        },
        {
          title: '发令时间',
          dataIndex: 'offerTime',
          width: 150,
        }, {
          title: '操作开始时间',
          dataIndex: 'startRunTime',
          width: 150,
        }, {
          title: '操作结束时间',
          dataIndex: 'endRunTime',
          width: 150,
        }, {
          title: '操作人',
          dataIndex: 'createdUser',
          width: 100,
        }, {
          title: '状态',
          dataIndex: 'recordStatus',
          width: 100,
          fixed: 'right',
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
          width: 100,
          fixed: 'right',
        },
      ],
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      getListForPage(this.queryParams).then(res => {
        this.pagination.total = res.body.total
        this.dataSource = res.body.data
      })
    },
    editClick(row) {
      this.formTitle = '倒闸操作票-编辑';
      this.checkForm = false
      this.checkFormTable = false
      this.getFormData(row)
    },
    lookClick(row) {
      this.checkForm = true
      this.checkFormTable = true
      this.formTitle = '倒闸操作票-详情';
      this.getFormData(row)

    },
    getFormData(row) {
      selectByID({ id: row.id }).then(res => {
        if (res.code == "200") {
          this.hiddenVisible = true
          let formEditData = res.body[0]
          formEditData.bzList = res.body.map(
            (item) => {
              return {
                content1: item.content1,
                content2: item.content2
              }
            }
          )
          this.formEditData = formEditData
        }
      })
    },
    addClick() {
      this.formTitle = '倒闸操作票-新增';
      this.checkForm = false
      this.checkFormTable = false
      this.hiddenVisible = true
      this.formEditData = {
        company: "", //单位
        codeNo: "", //编号
        offerUser: "", //发令人
        receUser: "", //受令人
        offerTime: "", //发令时间
        startRunTime: "", // 开始操作时间
        endRunTime: "",   // 结束操作时间
        runTask: "", // 操作任务
        bzList: [], // 操作内容
        remark: "", // 备注
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
      this.getTableList()
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
    submitClick() {
      this.$refs.addEditFormRef.submit();
    },
    recordStatus(val) {
      // 已保存-1、已提交-2、审批中-3、已审批-4、已拒绝-5
      return val == 1 ? '已保存' : val == 2 ? '已提交' : val == 3 ? '审批中' : val == 4 ? '已审批' : val == 5 ? '已拒绝' : ''
    }
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