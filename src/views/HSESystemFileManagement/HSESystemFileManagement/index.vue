<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addClick' },
          { value: 'Delete', clickName: 'deleteClick' },
          {
            value: 'exportComponent',
            isPower: false,
            url: '/hseFile/exportExcelHse',
            params: {
              fileName: queryParams.fileName,
              nowVersion: queryParams.nowVersion,
              orgName: queryParams.orgName,
              createdDateTime: queryParams.createdDateTime,
              createdDateTimeEnd: queryParams.createdDateTimeEnd,
              createdUser: queryParams.createdUser,
              type: queryParams.type,
            },
          },
        ]"
        @addClick="addClick"
        @deleteClick="deleteClick"
      ></pe-button>
    </template>
    <template slot="appMain" class="app_main">
      <div class="hese_system_file_management_tree">
        <a-directory-tree
          multiple
          default-expand-all
          @select="onNavigationSelect"
          :selectedKeys="treeModel"
        >
          <a-tree-node key="体系文件目录" title="体系文件目录">
            <a-tree-node key="公司级" title="公司级"> </a-tree-node>
            <a-tree-node key="部门级" title="部门级">
              <a-tree-node
                v-for="item in divisionList"
                :key="item.label"
                :title="item.label"
              >
              </a-tree-node>
            </a-tree-node>
          </a-tree-node>
        </a-directory-tree>
      </div>
      <div class="main_body">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="文件名称"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.fileName"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="当前版本"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.nowVersion"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="编制单位"
                    prop="department"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.orgName"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="创建日期:"
                    :labelCol="{ style: 'width: 90px' }"
                  >
                    <a-range-picker
                      v-model="createDate"
                      valueFormat="YYYY-MM-DD"
                      @change="createDateChange"
                      :placeholder="['开始日期', '结束日期']"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="录入人"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.createdUser"
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
            class="list_table_2"
            @change="paginationChange"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              fixed: true,
            }"
            rowKey="ID"
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
import { getListForPage, hseFileDelete } from "@/api/HSESystemFileManagement/HSESystemFileManagement"
import { timestampToTime } from '@/utils/tableFun'
export default {
  name: 'hSESystemFileManagement',
  components: { addEditForm },
  data() {
    return {
      divisionList: [
        { label: '综合办公室', value: 'ZB' },
        { label: '党群工作部', value: 'DG' },
        { label: '人力资源部', value: 'RZ' },
        { label: '法律审计部', value: 'FS' },
        { label: '财务部', value: 'CW' },
        { label: '企管计划部', value: 'QJ' },
        { label: '生产技术部', value: 'SJ' },
        { label: '质量安全环保部', value: 'AH' },
        { label: '生产运营中心', value: 'SY' },
        { label: '检维修中心', value: 'JX' },
        { label: '运行保障中心', value: 'YB' }
      ],
      queryParams: {
        fileName: "",
        nowVersion: "",
        orgName: "",
        createdDateTime: "",
        createdDateTimeEnd: "",
        createdUser: "",
        type: "公司级",
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
      treeModel: ['公司级'],
      createDate: [],
      selectedRowKeys: [],
      dataSource: [],
      formTitle: 'HSE体系文件-新增',
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
          title: '文件名称',
          dataIndex: 'fileName',
          width: 200,
        },
        {
          title: '当前版本',
          dataIndex: 'nowVersion',
          width: 100,
        },
        {
          title: '编制单位',
          dataIndex: 'orgName',
          ellipsis: true,
          width: 200,
        },
        {
          title: '创建日期',
          dataIndex: 'createdDateTime',
          width: 100,
          customRender: (value, row, index) => {
            return {
              children: this.formatTime(timestampToTime(value)),
              attrs: { rowSpan: 1 },
            };
          }
        },
        {
          title: '录入人',
          dataIndex: 'createdUser',
          width: 100,
        },
        {
          title: '上传日期',
          dataIndex: 'uploadTime',
          customRender: (value, row, index) => {
            return {
              children: this.formatTime(timestampToTime(value)),
              attrs: { rowSpan: 1 },
            };
          },
          width: 120,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          ellipsis: true,
          width: 100,
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
    editClick(row) {
      this.formTitle = 'HSE体系文件-编辑';
      this.checkForm = false
      this.getFormData(row)
    },
    lookClick(row) {
      this.checkForm = true
      this.formTitle = 'HSE体系文件-查看';
      this.getFormData(row)

    },
    getFormData(row) {
      this.queryParams.id = row.ID
      getListForPage(this.queryParams).then(res => {
        if (res.code == "200") {
          this.hiddenVisible = true
          let formEditData = {}
          formEditData = row
          formEditData.createdDateTime = this.formatTime(timestampToTime(row.createdDateTime))
          formEditData.uploadTime = this.formatTime(timestampToTime(row.uploadTime))
          formEditData.createdDateTimeSubstitute = row.createdDateTime
          formEditData.uploadTimeSubstitute = row.uploadTime
          formEditData.fileList = res.body.data.map((item) => {
            let newItem = item
            newItem.uploadTime = this.formatTime(timestampToTime(item.uploadTime))
            newItem.uploadTimeSubstitute = item.uploadTime
            if (newItem.fileID) {
              newItem.fileID = this.$fileUploadJSON.toParse(newItem.fileID)
            }

            return newItem
          })
          this.formEditData = formEditData
        }
      })
    },
    onNavigationSelect(keys, event) {
      this.treeModel = keys
      this.queryParams.type = keys[0]
      this.getTableList()
    },
    addClick() {
      this.formTitle = 'HSE体系文件-新增';
      this.checkForm = false
      this.hiddenVisible = true
      this.formEditData = {
        fileName: "",
        nowVersion: "",
        orgName: this.$store.state.user.unitName,
        createdDateTime: this.getUploadTime(),
        createdUser: this.$store.state.user.name,
        uploadTime: "",
        remark: "",
        type: this.queryParams.type,
        fileList: []
      }
    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        hseFileDelete(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = [];
          }
          this.getTableList();
          this.$message.success("删除成功！");
        });
      } else {
        this.$message.warning("请选择文件！");
      }

    },
    inquireClick() {
      this.pagination.current = 1
      this.queryParams.pageNum = 1
      this.getTableList()
    },
    resetClick() {
      this.queryParams.fileName = ""
      this.queryParams.nowVersion = ""
      this.queryParams.orgName = ""
      this.queryParams.createdDateTime = ""
      this.queryParams.createdDateTimeEnd = ""
      this.queryParams.createdUser = ""
      this.queryParams.fileName = ""
      this.pagination.current = 1
      this.queryParams.pageNum = 1
      this.createDate = []
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
    confirmClick() {
      this.$refs.addEditFormRef.confirm();
    },
    createDateChange(date) {
      if (date.length > 0) {
        this.queryParams.createdDateTime = date[0]
        this.queryParams.createdDateTimeEnd = date[1]
      } else {
        this.queryParams.createdDateTime = ""
        this.queryParams.createdDateTimeEnd = ""
      }
    },
    getTableList() {
      delete this.queryParams.id
      getListForPage(this.queryParams).then(res => {
        this.pagination.total = res.body.total
        this.dataSource = res.body.data
      })
    },
    getUploadTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = (month > 9) ? month : ('0' + month);
      day = (day < 10) ? ('0' + day) : day;
      return year + '-' + month + '-' + day;
    },
    /** 返回时间格式化 去掉秒  */
    formatTime(row) {
      if (row) {
        return row.substring(0, 10);
      } else {
        return "";
      }
    },
  },
}
</script>
<style lang="less" scoped>
::v-deep .app_main {
  display: flex;
  justify-content: space-between;
  background: #f3f3f4 !important;
  padding: 11px 0px 0px !important;
  margin-right: 0 !important;
  .hese_system_file_management_tree {
    width: 200px;
    background: #fff;
    height: calc(100vh - 100px);
    overflow: auto;
  }

  .main_body {
    width: calc(100% - 220px);
    background: #fff;
    #components-layout-demo-basic {
      height: auto;
      padding: 20px;
      padding-bottom: 10px;
    }
  }
}
.system_file_table {
  padding: 0 20px;
}
</style>