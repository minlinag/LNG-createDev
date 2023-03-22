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
      <!-- 导出 -->
      <ExportComponents
        url="/InterlockApply/exportExcel"
        :params="{
          interlockStatus: 1,
          recordStatus: this.searchField.recordStatus,
          interlockNo: this.searchField.interlockNo,
          interlockLevel: this.searchField.interlockLevel,
          applyStartTime:
            this.operationDateArray[0] == undefined
              ? ''
              : this.operationDateArray[0],
          applyEndTime:
            this.operationDateArray[1] == undefined
              ? ''
              : this.operationDateArray[1],
          applyName: this.searchField.applyName,
        }"
      >
      </ExportComponents>
    </template>
    <template slot="appMain">
      <div class="position-change-clain">
        <a-form-model :model="searchField" ref="ruleForm" layout="inline">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="申请时间"
            >
              <a-range-picker
                v-model="operationDateArray"
                valueFormat="YYYY-MM-DD"
                @change="onOperationDateTimeChange"
                :placeholder="['开始日期', '结束日期']"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="联锁号"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model="searchField.interlockNo"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="联锁分级"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-select
                ref="select"
                v-model="searchField.interlockLevel"
                placeholder="请选择"
                :options="interlockLevelOptions"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in interlockLevelOptions"
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
              label="状态"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-select
                ref="select"
                v-model="searchField.recordStatus"
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
                @click="search"
              >
                查询
              </a-button>
              <a-button @click="resetForm"> 重置 </a-button>
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
        <template slot="recordStatus" slot-scope="text">
          {{ text | recordStatus }}
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
                isPower: false,
                disabled:
                  $audit.editDisabledChain(row.recordStatus) ||
                  $audit.chainUserId(row.createdUser),
                style: ['btn_link'],
                name: '编辑',
              },
              {
                value: 'Delete',
                type: 'link',
                clickName: 'deleteClick',
                icon: '',
                disabled:
                  $audit.editDisabledChain(row.recordStatus) ||
                  $audit.chainUserId(row.createdUser),
                isPower: false,
                style: ['btn_link'],
                name: '删除',
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
              // {
              //   value: 'Implement',
              //   type: 'link',
              //   clickName: 'implementClick',
              //   icon: '',
              //   style: ['btn_link'],
              //   isPower: false,
              //   disabled: row.recordStatus != 4,
              //   name: '执行',
              // },
              {
                value: 'Confirm',
                type: 'link',
                clickName: 'confirmClick',
                icon: '',
                style: ['btn_link'],
                disabled: row.recordStatus != 4,
                isPower: false,
                name: '确认',
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
            @implementClick="implementClick(row)"
            @confirmClick="confirmClick(row)"
            @viewJump="viewJump(row)"
          ></pe-button>
        </template>
      </a-table>
      <add-release-form
        :addReleaseVisible="addReleaseVisible"
        :addReleaseTitle="addReleaseTitle"
        @close="addReleaseClose"
        :interlockStatus="1"
        :stateMonitor="stateMonitor"
        @toBeImplemented="toBeImplemented"
        @confirmFormClick="confirmFormClick"
        ref="addReleaseFormRef"
        @pass="passChange"
        :typeModel="typeModel"
        @submitForm="submitForm"
        @isParintClick="isParintClick(arguments)"
      ></add-release-form>
      <print-form
        v-show="printData"
        class="print"
        ref="print"
        :table-list="rowData"
      ></print-form>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  findAllList,
  insertInterlockApply,
  updateInterlockApply,
  queryByID,
  queryInterlockNo,
  deleteRelease,
  applySubmit,
  applyAudio,
  executeOperation, //待执行
  confirmOperation, //待确认
} from "@/api/chainManagement/chainReleaseApplication";
import addReleaseForm from "./components/addReleaseForm.vue";
import PrintForm from "./components/printForm.vue";
export default {
  components: { addReleaseForm, PrintForm },
  filters: {
    recordStatus(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "已保存";
          break;
        case "2":
          value = "已提交";
          break;
        case "3":
          value = "审核中";
          break;
        case "4":
          value = "待确认";
          break;
        // case "5":
        //   value = "待确认";
        //   break;
        case "6":
          value = "已解除";
          break;
        case "7":
          value = "已恢复";
          break;
        case "8":
          value = "退回";
          break;
        case "9":
          value = "已作废";
          break;
        default:
          break;
      }
      return value;
    },
    interlockLevel(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "一级";
          break;
        case "2":
          value = "二级";
          break;
        case "3":
          value = "三级";
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
      addReleaseVisible: false,
      addReleaseTitle: "联锁接触申请",
      typeModel: "add",
      interlockNoOption: [],
      stateMonitor: "",
      addClainVisible: false,
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
          title: "申请序号",
          dataIndex: "numbers",
          width: 100,
          ellipsis: true,
          align: "center",
        },
        {
          title: "联锁号",
          dataIndex: "interlockNo",
          width: 90,
          ellipsis: true,
          align: "center",
        },
        {
          title: "设定值",
          dataIndex: "setValue",
          width: 90,
          ellipsis: true,
          align: "center",
        },
        {
          title: "联锁分级",
          dataIndex: "interlockLevel",
          scopedSlots: { customRender: "interlockLevel" },
          width: 100,
          ellipsis: true,
          align: "center",
        },
        {
          title: "原因",
          dataIndex: "reason",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "解除时间",
          // 台账里的最近一次屏蔽时间
          // 确认时选的联锁恢复时间
          dataIndex: "relieveTime",
          width: 150,
          ellipsis: true,
          align: "center",
        },

        {
          title: "计划恢复时间",
          dataIndex: "planRecoverTime",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "申请人",
          dataIndex: "createdUser",
          width: 90,
          ellipsis: true,
          align: "center",
        },
        {
          title: "申请时间",
          dataIndex: "createdDateTime",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "recordStatus",
          scopedSlots: { customRender: "recordStatus" },
          width: 80,
          align: "center",
          ellipsis: true,
          fixed: "right",
        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: "center",
          width: 180,
        },
      ],
      operationDateArray: [],
      dataSource: [],
      selectedRowKeys: [],
      searchField: {
        recordStatus: "",
        interlockNo: "",
        interlockLevel: "",
        applyName: "",
        applyStartTime: "",
        applyEndTime: "",
        pageNum: 1,
        pageSize: 10,
        interlockStatus: 1,
      },
      recordStatusOptions: [
        { value: 1, label: "已保存" },
        { value: 2, label: "已提交" },
        { value: 3, label: "审核中" },
        { value: 4, label: "待确认" },
        // { value: 5, label: "待确认" },
        { value: 7, label: "已恢复" },
        { value: 8, label: "退回" },
        { value: 9, label: "已作废" },
      ],
      interlockLevelOptions: [
        { value: 1, label: "一级" },
        { value: 2, label: "二级" },
        { value: 3, label: "三级" },
      ],
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
    // this.showInterlockNoOption();
  },
  methods: {
    isParintClick(data) {
      this.rowData = data[0];
      this.printData = true;
      // this.$refs.print.initData(JSON.parse(JSON.stringify(data[0])));
      setTimeout(() => {
        this.$printPage(this.$refs.print);
        this.printData = false;
      }, 100);
    },
    toBeImplemented(val, callback) {
      executeOperation(val).then((res) => {
        if (res.code == 200) {
          this.$message.success("执行完毕");
          this.getList();
          callback(res);
        }
      });
    },
    // 没调接口
    confirmFormClick(val, callback) {
      confirmOperation(val).then((res) => {
        if (res.code == 200) {
          this.$message.success("确认完毕");
          this.getList();
          callback(res);
        }
      });
    },
    passChange(val, callback) {
      applyAudio(val).then((res) => {
        if (res.code == 200) {
          this.$message.success("完成审核");
          this.getList();
          callback(res);
        }
      });
    },
    approvalClick(row) {
      this.addReleaseTitle = "联锁解除申请-审批";
      this.addReleaseOpen("approvalForm");
      this.typeModel = "approval";
      this.getListDetails(row);
    },
    submitForm(val, stateMonitor, action) {
      if (val.id) {
        updateInterlockApply(val).then((res) => {
          if (res.code == 200) {
            if (action == "submitClick") {
              applySubmit({ id: val.id }).then((res) => {
                this.$message.success("提交成功");
                this.addReleaseClose();
                this.getList();
              });
            } else {
              this.$message.success("编辑成功");
              this.addReleaseClose();
              this.getList();
            }
          } else {
            this.$message.error("编辑失败");
          }
        });
      } else {
        val.interlockStatus = 1;
        insertInterlockApply(val).then((res) => {
          if (res.code == 200) {
            if (action == "submitClick") {
              applySubmit({ id: res.body }).then((res) => {
                this.$message.success("提交成功");
                this.addReleaseClose();
                this.getList();
              });
            } else {
              this.$message.success("新增成功");
              this.addReleaseClose();
              this.getList();
            }
          } else {
            this.$message.warning("新增失败！");
          }
        });
      }
    },
    // saveAddReleaseFormClick(value) {
    //   if (value.id) {
    //     updateInterlockApply(value).then((res) => {
    //       if (res.code == 200) {
    //         this.addReleaseClose();
    //         this.$message.success("编辑成功");
    //       } else {
    //         this.$message.error("编辑失败");
    //       }
    //       this.getList();
    //     });
    //   } else {
    //     value.interlockStatus = 1;
    //     insertInterlockApply(value).then((res) => {
    //       if (res.code == 200) {
    //         this.$message.success("新增成功");
    //         this.addReleaseClose();
    //       } else {
    //         this.$message.warning("新增失败！");
    //       }
    //       this.getList();
    //     });
    //   }
    // },
    // submitAddReleaseFormClick(value) {
    //   applySubmit({ id: value.id }).then((res) => {
    //     this.value = res.body;
    //     this.$message.success("提交成功！");
    //     this.getList();
    //   });
    // },
    getListDetails(value, position, callback) {
      queryByID({ id: value.id }).then((res) => {
        this.$refs.addReleaseFormRef.addReleaseForm = res.body;
        if (
          this.$refs.addReleaseFormRef.addReleaseForm.whetherConfirm == null
        ) {
          this.$refs.addReleaseFormRef.addReleaseForm.whetherConfirm = "1";
        }
        if (position) {
          callback();
        }
      });
    },
    getList() {
      findAllList(this.searchField).then((res) => {
        this.dataSource = res.body.data;
        // this.searchField.pageNum = pagination.current;
        // this.searchField.pageSize = pagination.pageSize;
        this.pagination.total = res.body.total;
      });
    },
    addReleaseClose() {
      this.addReleaseVisible = false;
    },
    addReleaseOpen(val) {
      this.stateMonitor = val;
      this.addReleaseVisible = true;
    },
    editClick(row) {
      this.addReleaseTitle = "联锁恢复申请-编辑";
      this.addReleaseOpen("editForm");
      this.typeModel = "edit";
      this.getListDetails(row);
    },
    implementClick(row) {
      this.addReleaseTitle = "联锁恢复申请-执行";
      this.addReleaseOpen("toBeImplementedForm");
      this.typeModel = "implement";
      this.getListDetails(row);
    },
    confirmClick(row) {
      this.addReleaseTitle = "联锁恢复申请-确认";
      this.addReleaseOpen("confirmForm");
      this.typeModel = "confirm";
      this.getListDetails(row);
    },
    addClick() {
      this.addReleaseTitle = "联锁恢复申请-新增";
      this.addReleaseOpen("addForm");
      this.typeModel = "add";
    },
    viewJump(row) {
      this.getListDetails(row, "view", () => {
        this.addReleaseOpen("detailForm");
      });
      // this.getListDetails(row);
      // this.addReleaseOpen("detailForm");
      this.typeModel = "view";
      this.addReleaseTitle = "联锁解除申请-详情";
      this.rowData = row;
    },
    deleteRightClick(row) {
      var arr = new Array(row.id);
      deleteRelease(arr).then((res) => {
        if (res.code == "true") {
          if (this.selectedRowKeys.length > 0) {
            // this.selectedRowsKeys---数组中的值
            this.selectedRowKeys.forEach((element, index) => {
              // index---下标
              if (element === row.id) {
                this.selectedRowKeys.splice(index, 1);
                // 跳出箭头函数
                return false;
              }
            });
          }
        }
        this.getList();
        this.$message.success("删除成功！");
      });
    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteRelease(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = [];
            this.getList();
            this.$message.success("删除成功！");
            this.addReleaseClose();
          }
        });
      } else {
        this.$message.warning("请选择记录！");
      }
    },
    search() {
      this.searchField.pageNum = 1;
      this.searchField.pageSize = 10;
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.getList();
    },
    resetForm() {
      this.searchField = {
        recordStatus: "",
        interlockNo: "",
        interlockLevel: "",
        applyName: "",
        pageNum: 1,
        pageSize: 10,
        interlockStatus: 1, // 2是解除
      };
      this.operationDateArray = [];
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
    // 根据状态查联锁号
    // showInterlockNoOption() {
    //   queryInterlockNo({
    //     interlockStatus: this.searchField.interlockStatus,
    //     interlockLevel: this.searchField.interlockLevel
    //   }).then((res) => {
    //     res.body.forEach((item) => {
    //       this.interlockNoOption.push({
    //         label: item.interlockNo,
    //         value: item.interlockNo,
    //       });
    //     });
    //   });
    // },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus !== "1" && record.recordStatus !== "7",
        },
      };
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-change-clain");
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
