<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addClick' },
          { value: 'Delete', clickName: 'deleteClick' },
          {
            value: 'templateExportComponent',
            isPower: false,
            url: 'PersonnelPostManage/downloadTemplate',
          },
          {
            value: 'importComponent',
            url: '/PersonnelPostManage/importExcel',
            accept: '.xlsx',
            modalHint: ['根据下载模板格式导入'],
          },
          {
            value: 'exportComponent',
            isPower: false,
            url: 'PersonnelPostManage/exportExcelUser',
            params: {
              postName: queryParams.postName,
            },
          },
        ]"
        @addClick="addClick"
        @deleteClick="deleteClick"
        @afterUpload="importChange"
      ></pe-button>
    </template>
    <template slot="appMain" class="app_main">
      <div class="main_body">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="岗位名称"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.postName"
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
                    value: 'Edit',
                    type: 'link',
                    clickName: 'edit',
                    icon: '',
                    style: ['btn_link'],
                  },
                  {
                    value: '查看',
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
      >
        <add-edit-form
          ref="addEditFormRef"
          @cancel="addEditFormCancel"
          :type="queryParams.type"
          :hiddenVisible="hiddenVisible"
          :check-form="checkForm"
          :form-edit-data="formEditData"
        ></add-edit-form>
        <template #footer>
          <div style="text-align: center">
            <a-button type="primary" @click="confirmClick" v-if="!checkForm"
              >确定</a-button
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
import { postManagementFindAllList, postManagementQueryByID, postManagementDeleteBatch } from "@/api/HSESystemFileManagement/personnelJobManagement"
export default {
  name: 'hSESystemFileManagement',
  components: { addEditForm },
  data() {
    return {
      queryParams: {
        postName: "",
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
      formTitle: '岗位职责-新增',
      checkForm: false,
      hiddenVisible: false,
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
          title: '岗位名称',
          dataIndex: 'postName',
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
      postManagementFindAllList(this.queryParams).then(res => {
        this.pagination.total = res.body.total
        this.dataSource = res.body.data
      })
    },
    editClick(row) {
      this.formTitle = '岗位职责-编辑';
      this.checkForm = false
      this.getFormData(row)
    },
    lookClick(row) {
      this.checkForm = true
      this.formTitle = '岗位职责-查看';
      this.getFormData(row)

    },
    getFormData(row) {
      postManagementQueryByID({ id: row.id }).then(res => {
        if (res.code == "200") {
          this.hiddenVisible = true
          let formEditData = res.body[0]
          formEditData.list = res.body[1]
          this.formEditData = formEditData
        }
      })
    },
    addClick() {
      this.formTitle = '岗位职责-新增';
      this.checkForm = false
      this.hiddenVisible = true
      this.formEditData = {
        postName: "",
        list: []
      }
    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        postManagementDeleteBatch(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = [];
          }
          this.getTableList();
          this.$message.success("删除成功！");
        });
      } else {
        this.$message.warning("请选择岗位！");
      }

    },
    importChange(val) {
      this.getTableList()
    },
    inquireClick() {
      this.pagination.current = 1
      this.queryParams.pageNum = 1
      this.getTableList()
    },
    resetClick() {
      this.queryParams.postName = ""
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
    confirmClick() {
      this.$refs.addEditFormRef.confirm();
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