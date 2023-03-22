<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'add' },
          { value: 'Delete', clickName: 'delete' },
        ]"
        @add="addClick"
        @delete="deleteClick"
      ></pe-button>
    </template>
    <template slot="appMain" class="app_main">
      <div class="position-change-person">
        <a-form-model :model="searchField" layout="inline">
          <a-col :span="6">
            <a-form-model-item
              label="姓名"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="searchField.person"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="人员编号"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="searchField.personNo"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="单位名称"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-select
                ref="select"
                v-model="searchField.unitName"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in inspectedUnitOptions"
                  :key="item.value"
                  :value="item.label"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="岗位名称"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="searchField.postName"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" style="display: flex; justify-content: flex-end">
            <a-form-model-item>
              <a-button class="buttonType" type="primary" @click="search">
                查询
              </a-button>
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>
          </a-col>
        </a-form-model>
      </div>
      <a-table
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        :pagination="pagination"
      >
        <!-- <template slot="interlockStatus" slot-scope="text">
          {{ text | interlockStatus }}
        </template>
        <template slot="interlockLevel" slot-scope="text">
          {{ text | interlockLevel }}
        </template> -->
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'editClick',
                icon: '',
                disabled: $audit.editDisabled(row.recordStatus),
                style: ['btn_link'],
              },
              {
                value: 'Assessment',
                type: 'link',
                clickName: 'assessmentClick',
                name: '考核',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: 'View',
                name: '详情',
                isPower: false,
                type: 'link',
                clickName: 'viewJump',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @editClick="editClick(row)"
            @assessmentClick="assessmentClick(row)"
            @viewJump="viewJump(row)"
          ></pe-button>
        </template>
      </a-table>
      <a-modal
        :title="formTitle"
        :visible="hiddenVisible"
        @cancel="cancelHidden"
        :maskClosable="false"
        class="from-style bigModel"
      >
        <add-edit-form
          ref="addEditFormRef"
          @cancel="addEditFormCancel"
          :hiddenVisible="hiddenVisible"
          :check-form="checkForm"
          :form-edit-data="formEditData"
          :is-assessment="isAssessment"
          :inspected-unit-options="inspectedUnitOptions"
          :department-option="departmentOption"
          :annual-list="annualAssessmentRecordList"
          @recordFormChange="recordFormChange"
          :record-form="recordForm"
        ></add-edit-form>
        <template #footer>
          <div style="text-align: center">
            <a-button
              type="primary"
              @click="confirmClick"
              v-if="!checkForm && (!isAssessment || recordForm)"
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
import addEditForm from "./components/addEditForm.vue";
import { companySelect } from "@/api/JSAAnalysis";
import { personnelExamineFindAllList, personnelExamineQueryByID, personnelExamineDeleteBatch } from "@/api/HSESystemFileManagement/safetyProductionResponsibilitySystem"


export default {
  components: { addEditForm },
  data() {
    return {
      recordForm: false,
      stateMonitor: "",
      hiddenVisible: false,
      checkForm: false,
      formEditData: {},
      formTitle: '人员责任制考核-新增',
      isAssessment: false,
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
          align: "center",
        },
        {
          title: "姓名",
          dataIndex: "person",
          align: "center",
        },
        {
          title: "人员编号",
          dataIndex: "personNo",
          width: 200,
          align: "center",
        },
        {
          title: "单位名称",
          dataIndex: "unitName",
          align: "center",
        },
        {
          title: "岗位名称",
          dataIndex: "postName",
          width: 150,
          align: "center",
        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: "center",
          width: 130,
        },
      ],
      dataSource: [{ value: 1 }],
      selectedRowKeys: [],
      searchField: {
        postName: "",
        unitName: "",
        personNo: "",
        person: "",
        pageNum: 1,
        pageSize: 10,
      },
      interlockStatusOptions: [
        { value: 1, label: "屏蔽" },
        {
          value: 2,
          label: "投用",
        },
        {
          value: 3,
          label: "已删除",
        },
      ],
      inspectedUnitOptions: [],
      company: [], //外委单位下拉框
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      dataSourceList: [],
      departmentOption: [
        { label: '公司领导', value: 'LD' },
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
        { label: '运行保障中心', value: 'YB' }],
      annualAssessmentRecordList: [],
    };
  },
  mounted() {
    this.getAsyncData();
    this.getList();
    // this.getListDetails()
  },
  methods: {
    async getAsyncData() {
      await this.getOutsourceCompany();
      this.inspectedUnitOptions = await [...this.departmentOption, ...this.company];
    },
    async getOutsourceCompany() {
      const { body } = await companySelect()
      body.forEach((item) => {
        this.company.push({
          value: item.OutsourceCompanyCode,
          label: item.OutsourceCompanyName,
        });
      });
    },
    cancelHidden() {
      if (this.recordForm) {
        this.recordForm = false
      } else {
        this.hiddenVisible = false;
        this.checkForm = false;
      }

    },
    addEditFormCancel() {
      this.hiddenVisible = false;
    },
    confirmClick() {
      if (this.recordForm) {
        this.$refs.addEditFormRef.recordConfirm(() => {
          this.recordForm = false
        });
      } else {
        this.$refs.addEditFormRef.confirm(() => {
          this.resetForm();
          this.hiddenVisible = false;
        });
      }

    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        personnelExamineDeleteBatch(this.selectedRowKeys).then((res) => {
          if (res.code == '200') {
            this.selectedRowKeys = []
            this.$message.success('删除成功')
            this.getList();
          }

        })
      } else {
        this.$message.warning('请选择至少一条数据!')
      }
    },
    getList() {
      personnelExamineFindAllList(this.searchField).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    // getListDetails(value, callback) {
    //   queryByID({ id: value.id }).then((res) => {
    //     this.$refs.addClainFormRef.addForm = res.body;
    //     this.dataSourceList = res.body.list;
    //     callback();
    //   });
    // },
    addClick() {
      this.formTitle = "人员责任制考核-新增";
      this.checkForm = false;
      this.isAssessment = false
      this.hiddenVisible = true;
    },
    editClick(row) {
      this.formTitle = "人员责任制考核-编辑";
      this.checkForm = false;
      this.isAssessment = false
      this.hiddenVisible = true;
      this.$nextTick(() => {
        this.$refs.addEditFormRef.formModel = row
      })


    },
    assessmentClick(row) {
      this.formTitle = "人员责任制考核-考核";
      this.checkForm = false;
      this.isAssessment = true
      this.hiddenVisible = true;
      this.$nextTick(() => {
        personnelExamineQueryByID({ id: row.id }).then((res) => {
          if (res.code == '200') {
            let newRow = row
            newRow.list = res.body[1]
            this.$refs.addEditFormRef.formModel = newRow
          }

        });
      })

    },
    viewJump(row) {
      this.formTitle = "人员责任制考核-详情";
      this.checkForm = true;
      this.isAssessment = true
      this.hiddenVisible = true;
      this.$nextTick(() => {
        personnelExamineQueryByID({ id: row.id }).then((res) => {
          if (res.code == '200') {
            let newRow = row
            newRow.list = res.body[1]
            this.annualAssessmentRecordList = res.body[2]
            this.$refs.addEditFormRef.formModel = newRow
          }

        });
      })
    },

    resetForm() {
      this.searchField = {
        postName: "",
        unitName: "",
        personNo: "",
        person: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
    search() {
      this.searchField.pageNum = 1;
      this.searchField.pageSize = 10;
      this.getList();
    },
    // 列表选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          // disabled: record.recordStatus !== '1'
          // disabled: record.recordStatus !== "1" && record.recordStatus !== "7",
        },
      };
    },
    // 页码改变的方法
    paginationChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.searchField.pageNum = pagination.current;
      this.searchField.pageSize = pagination.pageSize;
      this.getList();
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-change-person");
    },
    recordFormChange(val) {
      this.recordForm = val
    }
  },
};
</script>
<style lang="less" scoped>
::v-deep .app_main {
  .position-change-person {
    height: auto;
    padding-bottom: 10px;
  }
}
</style>
