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
    <template slot="appMain">
      <div class="position-change-release">
        <a-form-model :model="searchField" ref="ruleForm" layout="inline">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="申请时间"
            >
              <a-range-picker
                v-model="applyTime"
                valueFormat="YYYY-MM-DD"
                @change="onOperationDateTimeChange"
                :placeholder="['开始日期', '结束日期']"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="设备名称"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="searchField.eqmName"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="工艺位号"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="searchField.eqmNo"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="申请人"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="searchField.applyName"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="操作性质"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-select
                ref="select"
                v-model="searchField.natureOperation"
                placeholder="请选择"
                :options="recordStatusOptions"
                :getPopupContainer="getPopupContainer"
              >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item>
              <a-button
                :style="{ marginLeft: '30px' }"
                type="primary"
                @click="searchClick"
              >
                查询
              </a-button>
              <a-button @click="resetFormClick"> 重置 </a-button>
            </a-form-model-item>
          </a-col>
        </a-form-model>
      </div>
      <a-table
        :scroll="{ y: 1, x: 100 }"
        class="list_table_2"
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
        <template slot="status" slot-scope="text">
          {{ text | status }}
        </template>
        <template slot="interlockLevel" slot-scope="text">
          {{ text | interlockLevel }}
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'editClick',
                icon: '',
                disabled:
                  (row.status != 1 && row.status != 5) ||
                  $audit.chainUserId(row.createdUser),
                isPower: false,
                style: ['btn_link'],
              },
              {
                value: 'Delete',
                type: 'link',
                clickName: 'deleteClick',
                icon: '',
                isPower: false,
                disabled:
                  (row.status != 1 && row.status != 5) ||
                  $audit.chainUserId(row.createdUser),
                style: ['btn_link'],
              },
              {
                value: 'Approval',
                type: 'link',
                clickName: 'approvalClick',
                icon: '',
                style: ['btn_link'],
                name: '审批',
                isPower: false,
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'Confirm',
                type: 'link',
                clickName: 'confirmClick',
                icon: '',
                isPower: false,
                style: ['btn_link'],
                name: '确认',
                disabled: row.status != 4,
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
            @deleteClick="deleteRightClick(row)"
            @approvalClick="approvalClick(row)"
            @confirmClick="confirmClick(row)"
            @viewJump="viewJump(row)"
          ></pe-button>
        </template>
      </a-table>
      <add-form
        :addVisible="addVisible"
        @close="addFormClose"
        :typeModel="typeModel"
        @submitForm="submitForm"
        :addTitle="addTitle"
        :stateMonitor="stateMonitor"
        :status="status"
        @confirmFormClick="confirmFormClick"
        @approval="approval"
        ref="addFormRef"
        @isParintClick="isParintClick(arguments)"
      ></add-form>
      <print-form-lock
        :table-list="rowData"
        v-show="printData"
        :status="status"
        class="print"
        ref="print"
      ></print-form-lock>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  findAllList,
  insertStopDelivery,
  updateStopDelivery,
  deleteBatch,
  applySubmit,
  confirmOperation,
  applyAudio,
} from "@/api/transformerSubstation/lockUnlockApplication";
import addForm from "./components/addForm.vue";
import printFormLock from "./components/printFormLock.vue";
export default {
  components: { addForm, printFormLock },
  filters: {
    status(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "已保存";
          break;
        case "2":
          value = "已提交";
          break;
        case "3":
          value = "审批中";
          break;
        case "4":
          value = "待确认";
          break;
        case "5":
          value = "已退回";
          break;
        case "6":
          value = "已确认";
          break;
        case "7":
          value = "已作废";
          break;
        default:
          break;
      }
      return value;
    },
  },
  data() {
    return {
      printData: false,
      rowData: {},
      stateMonitor: "",
      recordStatusOptions: [
        { value: "停电", label: "停电" },
        { value: "送电", label: "送电" },
      ],
      selectedRowKeys: [],
      addVisible: false,
      addTitle: "电气设备停送电申请",
      typeModel: "add",
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
          align: "center",
        },
        {
          title: "编号",
          dataIndex: "numbers",
          width: 130,
          ellipsis: true,
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "eqmName",
          width: 100,
          ellipsis: true,
          align: "center",
        },
        {
          title: "工艺位号",
          dataIndex: "eqmNo",
          width: 100,
          ellipsis: true,
          align: "center",
        },
        {
          title: "操作性质",
          dataIndex: "natureOperation",
          width: 100,
          ellipsis: true,
          align: "center",
        },
        {
          title: "申请理由",
          dataIndex: "applyReason",
          width: 100,
          ellipsis: true,
          align: "center",
        },
        {
          title: "申请人",
          dataIndex: "applyName",
          width: 100,
          ellipsis: true,
          align: "center",
        },
        {
          title: "申请时间",
          dataIndex: "applyTime",
          width: 130,
          ellipsis: true,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "status",
          width: 100,
          scopedSlots: { customRender: "status" },
          ellipsis: true,
          fixed: "right",
          align: "center",
        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: "center",
          width: 180,
        },
      ],
      dataSource: [],
      applyTime: [],
      status: "",
      searchField: {
        applyStartTime: "",
        applyEndTime: "",
        eqmName: "",
        eqmNo: "",
        applyName: "",
        natureOperation: "",
        pageNum: 1,
        pageSize: 10,
      },
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
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    isParintClick(data) {
      // lock
      this.rowData = data[0];
      this.printData = true;
      // this.$refs.print.initData(JSON.parse(JSON.stringify(data[0])));
      setTimeout(() => {
        this.$printPage(this.$refs.print);
        this.printData = false;
      }, 100);
    },
    // 确认
    confirmFormClick(val, callback) {
      if (val.confirmTime) {
        var executorTime = +new Date(val.executorTime);
        var confirmTime = +new Date(val.confirmTime);
        if (executorTime * 1 > confirmTime * 1) {
          return this.$message.warning("确认时间要晚于执行时间");
        }
      }
      confirmOperation(val).then((res) => {
        if (res.code == 200) {
          this.$message.success("确认完毕");
          this.getList();
          callback(res);
        }
      });
    },
    confirmClick(row) {
      this.addTitle = "上锁解锁申请-确认";
      this.addReleaseOpen("confirmForm");
      this.typeModel = "confirm";
      this.getDetailsList(row);
    },
    approvalClick(row) {
      this.addTitle = "上锁解锁申请-审批";
      this.addReleaseOpen("approvalForm");
      this.typeModel = "approval";
      this.getDetailsList(row);
    },
    approval(val) {
      applyAudio(val).then((res) => {
        if (res.body == "true") {
          this.$message.success("完成审核");
          this.addFormClose();
          this.getList();
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    getList() {
      findAllList(this.searchField).then((res) => {
        this.dataSource = res.body.data;
        // this.searchField.pageNum = pagination.current;
        // this.searchField.pageSize = pagination.pageSize;
        this.pagination.total = res.body.total;
        // this.pagination.pageNum = res.body.pageIndex;
        // this.pagination.pageSize = res.body.pageSize;
      });
    },
    getDetailsList(val) {
      findAllList({ id: val.id }).then((res) => {
        this.$refs.addFormRef.addForm = res.body.data[0];
        if (this.$refs.addFormRef.addForm.whetherExecuteEnd == "") {
          this.$refs.addFormRef.addForm.whetherExecuteEnd = "是";
        }
        this.addReleaseOpen("detailForm");
        // if(this.$refs.addReleaseFormRef.addReleaseForm.whetherConfirm == null){
        //   this.$refs.addReleaseFormRef.addReleaseForm.whetherConfirm = "1"
        // }
        // this.$refs.addFormRef.addForm.natureOperation= res.body.data[0].natureOperation;
        // this.searchField.pageNum = pagination.current;
        // this.searchField.pageSize = pagination.pageSize;
        // this.pagination.total = res.body.total;
      });
    },
    submitForm(val, stateMonitor, action) {
      if (val.id) {
        updateStopDelivery(val).then((res) => {
          if (res.code == 200) {
            if (action == "submitClick") {
              applySubmit({ id: val.id }).then((res) => {
                this.$message.success("提交成功");
                this.addFormClose();
                this.getList();
              });
            } else {
              this.$message.success("编辑成功");
              this.addFormClose();
              this.getList();
            }
          } else {
            this.$message.error("编辑失败");
          }
        });
      } else {
        insertStopDelivery(val).then((res) => {
          if (res.code == 200) {
            if (action == "submitClick") {
              applySubmit({ id: res.body }).then(
                (res) => {
                  this.$message.success("提交成功");
                  this.addFormClose();
                  this.getList();
                }
              );
            } else {
              this.$message.success("新增成功");
              this.addFormClose();
              this.getList();
            }
          } else {
            this.$message.warning("新增失败！");
          }
        });
      }
    },

    addFormClose() {
      this.addVisible = false;
    },
    addReleaseOpen(val) {
      this.stateMonitor = val;
      this.addVisible = true;
    },
    editClick(row) {
      this.addTitle = "上锁解锁申请-编辑";
      this.addReleaseOpen("editForm");
      this.typeModel = "edit";
      this.getDetailsList(row);
    },
    viewJump(row) {
      // this.getListDetails(row, "view", () => {
      //   this.addReleaseOpen("detailForm");
      // });
      this.rowData = row;
      this.status = row.status;
      // this.addReleaseOpen("detailForm");
      this.getDetailsList(row);
      this.typeModel = "view";
      this.addTitle = "上锁解锁申请-详情";
    },
    addClick() {
      this.addTitle = "上锁解锁申请-新增";
      this.typeModel = "add";
      this.addReleaseOpen("addForm");
    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteBatch(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = [];
            this.getList();
            this.$message.success("删除成功！");
            this.addFormClose();
          }
        });
      } else {
        this.$message.warning("请选择记录！");
      }
    },
    deleteRightClick(row) {
      var arr = new Array(row.id);
      deleteBatch(arr).then((res) => {
        if (res.code == "200") {
          if (this.selectedRowKeys.length > 0) {
            this.selectedRowKeys.forEach((element, index) => {
              if (element === row.id) {
                this.selectedRowKeys.splice(index, 1);
                return false;
              }
            });
          }
          this.getList();
          this.$message.success("删除成功！");
        }
      });
    },
    searchClick() {
      this.searchField.pageNum = 1;
      this.searchField.pageSize = 10;
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.getList();
    },
    resetFormClick() {
      this.searchField = {
        applyStartTime: "",
        applyEndTime: "",
        eqmName: "",
        eqmNo: "",
        applyName: "",
        natureOperation: "",
      };
      this.applyTime = [];
      this.getList();
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
    },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.searchField.pageNum = pagination.current;
      this.searchField.pageSize = pagination.pageSize;
      this.getList();
      // this.getRiskList()
    },
    onOperationDateTimeChange(data) {
      this.searchField.applyStartTime = data[0];
      this.searchField.applyEndTime = data[1];
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          // disabled: record.recordStatus !== '1'
          //   disabled: record.recordStatus !== "1" && record.recordStatus !== "7",
        },
      };
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-change-release");
    },
  },
};
</script>
<style scoped>
.print {
  position: absolute;
  z-index: -10;
  margin-top: 20px;
}
</style>
