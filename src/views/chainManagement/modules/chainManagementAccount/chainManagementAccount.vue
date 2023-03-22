<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'add' },
          { value: 'Delete', clickName: 'delete' },
          {
            value: 'Download',
            clickName: 'download',
            name: '导入模板下载',
            icon: 'export-icon',
            isPower: false,
          },
          {
            value: 'importComponent',
            url: '/InterlockManageLedger/importExcel',
            accept: '.xlsx',
            modalHint: ['根据下载模板格式导入'],
          },
          // {
          //   value: 'exportComponent',
          //   url: '/InterlockManageLedger/exportLubricationTemplate',
          //   name:'导入模板',
          // },
          // {
          //   value: 'exportComponent',
          //   url: '/InterlockManageLedger/exportExcel',
          //   name: '导出',
          //   accept: '.xlsx',
          // },
        ]"
        @add="addClick"
        @delete="deleteClick"
        @download="download"
        @afterUpload="afterUpload"
      ></pe-button>
      <!-- 导出 -->
      <ExportComponents
        url="/InterlockManageLedger/exportExcel"
        :params="{
          interLockStatus: this.searchField.interlockStatus,
          interLockNo: this.searchField.interlockNo,
          interLockLevel: this.searchField.interlockLevel,
        }"
      >
      </ExportComponents>
    </template>
    <template slot="appMain">
      <div class="position-change-clain">
        <a-form-model :model="searchField" ref="ruleForm" layout="inline">
          <a-col :span="6">
            <a-form-model-item
              label="联锁状态"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-select
                ref="select"
                v-model="searchField.interlockStatus"
                placeholder="请选择"
                :options="interlockStatusOptions"
                :getPopupContainer="getPopupContainer"
              >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="联锁号"
              :labelCol="{ style: 'width: 150px' }"
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
              :labelCol="{ style: 'width: 150px' }"
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
          <a-form-model-item>
            <a-button class="buttonType" type="primary" @click="search">
              查询
            </a-button>
            <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
          </a-form-model-item>
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
        :rowClassName="setRowClassName"
      >
        <template slot="interlockStatus" slot-scope="text">
          {{ text | interlockStatus }}
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
                  $audit.editDisabledProduction(row.createdUserId) &&
                  $audit.editDisabled(row.recordStatus),
                // disabled: $audit.editDisabled(row.recordStatus),
                style: ['btn_link'],
              },
              {
                value: 'Delete',
                type: 'link',
                clickName: 'deleteClick',
                name: '删除',
                icon: '',
                style: ['btn_link'],
                disabled: row.interlockStatus !== '1',
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
            @viewJump="viewJump(row)"
          ></pe-button>
        </template>
      </a-table>
      <add-clain-form
        :addClainVisible="addClainVisible"
        @close="addClainFormClose"
        :addClainFormTypeModelTitle="addClainFormTypeModelTitle"
        @saveAddClainFormClick="saveAddClainFormClick"
        ref="addClainFormRef"
        :stateMonitor="stateMonitor"
        :data-source-list="dataSourceList"
      ></add-clain-form>
    </template>
  </Breadcrumb>
</template>
<script>
import addClainForm from "./addClainForm.vue";
import {
  findAllList,
  insertClain,
  updateClain,
  deleteClain,
  queryByID,
  exportAccount,
} from "@/api/chainManagement//chainManagementAccount";
import utils from "@/utils/url";
export default {
  components: { addClainForm },
  filters: {
    interlockStatus(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "屏蔽";
          break;
        case "2":
          value = "投用";
          break;
        case "3":
          value = "已删除";
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
      addClainFormTypeModelTitle: "联锁管理台账",
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
          title: "联锁号",
          dataIndex: "interlockNo",
          width: 90,
          align: "center",
          ellipsis: true,
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
          title: "联锁描述",
          dataIndex: "interlockDescription",
          width: 200,
          ellipsis: true,
          align: "center",
        },
        {
          title: "联锁状态",
          dataIndex: "interlockStatus",
          scopedSlots: { customRender: "interlockStatus" },
          width: 100,
          ellipsis: true,
          align: "center",
        },
        {
          title: "最近一次屏蔽时间",
          dataIndex: "shieldingTime",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "最近一次投用时间",
          dataIndex: "usingTime",
          width: 150,
          ellipsis: true,
          align: "center",
        },
        {
          title: "计划投用时间",
          // 解除申请里的计划恢复时间
          dataIndex: "planPutUseTime",
          width: 150,
          ellipsis: true,
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
      dataSource: [],
      selectedRowKeys: [],
      searchField: {
        interlockStatus: "",
        interlockNo: "",
        interlockLevel: "",
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
      interlockLevelOptions: [
        {
          value: 1,
          label: "一级",
        },
        {
          value: 2,
          label: "二级",
        },
        {
          value: 3,
          label: "三级",
        },
      ],
      aa: [],
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
    };
  },
  mounted() {
    this.getList();
    // this.getListDetails()
  },
  methods: {
    afterUpload(info) {
      if (info.file.response.code == "200") {
        // this.$message.success(info.file.response.msg);
        this.resetForm();
      }
    },
    download() {
      window.location.href =
        utils.baseURL + "/InterlockManageLedger/exportLubricationTemplate";
      // urls: "/InterlockManageLedger/exportLubricationTemplate",
      // this.getList()
      // window.location.href---打开一个新的地址 = utils.baseURL--引入服务器地址，baseURl是当前使用的服务器的地址 + this.urls---链接的后台接口的地址，urls要在data()return中写
    },
    getList() {
      findAllList(this.searchField).then((res) => {
        this.dataSource = res.body.data;
        // this.usingTime = this.addForm.firstUseTime;
        // this.searchField.pageNum = pagination.current;
        // this.searchField.pageSize = pagination.pageSize;
        this.pagination.total = res.body.total;
      });
    },
    saveAddClainFormClick(value) {
      if (value.id) {
        updateClain(value).then((res) => {
          if (res.code == 200) {
            this.addClainFormClose();
            this.$message.success("编辑成功");
          } else {
            this.$message.error("编辑失败");
          }
          this.getList();
        });
      } else {
        insertClain(value).then((res) => {
          if (res.code == 200) {
            this.$message.success("新增成功");
            this.addClainFormClose();
          } else {
            this.$message.warning("新增失败！");
          }
          this.getList();
        });
      }
    },
    getListDetails(value, callback) {
      queryByID({ id: value.id }).then((res) => {
        this.$refs.addClainFormRef.addForm = res.body;
        this.dataSourceList = res.body.list;
        callback();
      });
    },
    editClick(row) {
      this.getListDetails(row);
      this.addClainFormTypeModelTitle = "联锁管理台账-编辑";
      this.addClainFormOpen("addForm");
    },
    deleteRightClick(row) {
      var arr = new Array(row.interlockNo);
      deleteClain(arr).then((res) => {
        if (res.code == "508") {
          this.$message.warning(res.msg);
        } else {
          this.$message.success("删除成功！");
        }
      });
      this.getList();
    },
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteClain(this.aa).then((res) => {
          if (res.code == "508") {
            // this.selectedRowKeys = [];
            this.$message.warning(res.msg);
          } else {
            this.$message.success("删除成功！");
          }
          this.getList();
        });
      } else {
        this.$message.warning("请选择记录！");
      }
      this.addClainFormClose();
    },
    viewJump(row) {
      this.getListDetails(row, () => {
        this.addClainFormOpen("detailForm");
      });
      this.addClainFormTypeModelTitle = "联锁管理台账-详情";
    },
    addClick() {
      this.addClainFormOpen("addForm");
      this.addClainFormTypeModelTitle = "联锁管理台账-新增";
    },
    resetForm() {
      this.searchField = {
        interlockStatus: "",
        interlockNo: "",
        interlockLevel: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
    },
    search() {
      this.searchField.pageNum = 1;
      this.searchField.pageSize = 10;
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.getList();
    },
    addClainFormOpen(val) {
      // 审批是否显示
      this.stateMonitor = val;
      this.addClainVisible = true;
    },
    addClainFormClose() {
      this.addClainVisible = false;
    },
    // 列表选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
      this.getInterlockNoList(key);
    },
    getInterlockNoList(val) {
      this.aa = [];
      for (let i = 0; i < val.length; i++) {
        for (let j = 0; j < this.dataSource.length; j++) {
          if (val[i] == this.dataSource[j].id) {
            this.aa.push(this.dataSource[j].interlockNo);
          }
        }
      }
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.interlockStatus !== "1",
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
      // this.pagination.current = 1
      this.getList();
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-change-clain");
    },
    setRowClassName(record, index) {
      let row = record.planPutUseTime;
      if (row === undefined || row === null) {
        return false;
      }
      const earlyMorning = `${row} 00:00:00`;
      if (record.interlockStatus == "1") {
        if (
          earlyMorning <= this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss")
        ) {
          return "dangerStyle";
        } else {
          return false;
        }
      }
    },
    //格式化日期
    formatDate(objDate, fmt) {
      var o = {
        "M+": objDate.getMonth() + 1, //月份
        "d+": objDate.getDate(), //日
        "h+": objDate.getHours() % 12 == 0 ? 12 : objDate.getHours() % 12, //小时
        "H+": objDate.getHours(), //小时
        "m+": objDate.getMinutes(), //分
        "s+": objDate.getSeconds(), //秒
        "q+": Math.floor((objDate.getMonth() + 3) / 3), //季度
        S: objDate.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (objDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
  },
};
</script>
<style scoped lang="less">
::v-deep .dangerStyle > td {
  color: #ff7875 !important;
}
</style>
