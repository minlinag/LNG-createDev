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
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="模板名称"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.templateName"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="模板类型"
                  >
                    <a-select
                      v-model="queryParams.templateType"
                      placeholder="请选择"
                    >
                      <a-select-option value="评分制"> 评分制 </a-select-option>
                      <a-select-option value="评价制"> 评价制 </a-select-option>
                    </a-select>
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
        <div class="system_file_table" style="">
          <!-- 表格 -->
          <a-table
            :scroll="{ y: 1, x: 300 }"
            class="list_table_2"
            style="margin-top: 10px"
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
                    value: '查看',
                    type: 'link',
                    clickName: 'look',
                    style: ['btn_link'],
                  },
                ]"
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
import { query, detail, deleteTemplate } from "@/api/templateManagement/templateManagement.js"
export default {
  name: 'templateManagement',
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
        templateName: "",
        TemplateType: undefined,
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
      formTitle: '模板管理-新增',
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
          title: '模板名称',
          dataIndex: 'templateName',
          width: 200,
        },
        {
          title: '模板类型',
          dataIndex: 'templateType',
          ellipsis: true,
          width: 200,
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
    lookClick(row) {
      this.checkForm = true
      this.formTitle = '模板管理-查看';
      this.getFormData(row)

    },
    getFormData(row) {
      detail({ id: row.id }).then(res => {
        if (res.code == "200") {
          this.formEditData = res.body
          this.hiddenVisible = true

        }
      })
    },
    onNavigationSelect(keys, event) {
      this.treeModel = keys
      this.queryParams.type = keys[0]
      this.getTableList()
    },
    addClick() {
      this.formTitle = '模板管理-新增';
      this.checkForm = false
      this.hiddenVisible = true
      this.formEditData = {
        templateName: "",
        templateType: undefined,
        templateSet: [],
        templateContent: [],

      }
    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteTemplate(this.selectedRowKeys).then((res) => {
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
      this.queryParams.templateName = ""
      this.queryParams.templateType = undefined
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
      query(this.queryParams).then(res => {
        this.pagination.total = res.body.total
        this.dataSource = res.body.data
      })
    },
  },
}
</script>
<style lang="less" scoped>
</style>