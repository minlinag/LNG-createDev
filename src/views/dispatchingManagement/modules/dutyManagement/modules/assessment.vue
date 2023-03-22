<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <a-button
        class="buttonType btn_primary"
        type="primary"
        @click="approvalClicks(1)"
      >
        批审批-同意
      </a-button>
      <a-button
        class="buttonType btn_primary"
        type="primary"
        @click="approvalClicks(0)"
      >
        批审批-驳回
      </a-button>

      <pe-button
        :include="[
          { value: 'Add', clickName: 'addNew' },
          { value: 'Delete', clickName: 'deleteListClick' },
          {
            value: 'exportComponent',
            isPower: false,
            url: '/TeamGroupExamine/exportExcel',
          },
        ]"
        @addNew="addNew"
        @deleteListClick="deleteListClick"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div
        id="components-layout-demo-basic"
        class="appMainForm"
        style="width: 100%; position: relative"
      >
        <a-form-model>
          <a-row :gutter="10">
            <a-col :span="6">
              <a-form-model-item
                label="考核月份:"
                :labelCol="{ style: 'width: 150px' }"
              >
                <a-range-picker
                  @panelChange="onOperationDateTimeChange"
                  :placeholder="['开始月份', '结束月份']"
                  format="YYYY-MM"
                  v-model="operationDateArray"
                  :mode="['month', 'month']"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="班组：">
                <a-select
                  v-model="searchInfo.teamGroup"
                  show-search
                  placeholder="请选择班组"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    :value="item.label"
                    v-for="(item, index) in owningOption"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="人员:"
              >
                <a-input
                  placeholder="请输入人员"
                  v-model="searchInfo.personnel"
                />
              </a-form-model-item>
            </a-col>

            <a-form-model-item style="float: right; margin-right: 1rem">
              <a-button
                v-Query
                class="buttonType"
                type="primary"
                @click="select"
              >
                查询
              </a-button>
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>
          </a-row>
        </a-form-model>
      </div>
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        :scroll="{ x: 100 }"
        :pagination="pagination"
        @change="paginationChange"
        :row-key="(record) => record.id"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
        style="margin-top: -1rem"
      >
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
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                isPower: false,
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'details',
                type: 'link',
                clickName: 'upDateListDetail',
                name: '详情',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @edit="upDateListDetail(row, 'edit')"
            @upDateListDetail="upDateListDetail(row, 'look')"
            @approval="approvalClick(row)"
          ></pe-button>
        </template>
      </a-table>

      <!--弹出框-->
      <a-modal
        :title="`班组量化考核${
          formType == 'add' ? '新增' : formType == 'edit' ? '编辑' : '详情'
        }`"
        :visible="applicationsVisible"
        :footer="null"
        :maskClosable="false"
        @cancel="applicationsVisibleClose"
        class="from-style bigModel"
      >
        <assessmentDetails
          :recode="recode"
          :owningOption="owningOption"
          :formType="formType"
          :Recodedisabled="Recodedisabled"
          @close="applicationsVisibleClose"
        />
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  TeamGroupExamineDeleteBatch,
  TeamGroupExaminefindAllList,
  TeamGroupExamineapplyAudio,
} from "@/api/dispatchingManagement/teamManagement.js";

import assessmentDetails from "./assessmentDetails.vue";

import { getdict } from "@/api/dispatchingManagement/teamManagement";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "考核月份", ellipsis: true, dataIndex: "assessMonth" },
  { title: "日期", ellipsis: true, dataIndex: "assessDate" },
  {
    title: "班组",
    ellipsis: true,
    dataIndex: "teamGroup",
  },
  { title: "人员", ellipsis: true, dataIndex: "personnel" },
  { title: "描述", ellipsis: true, dataIndex: "assessDescribe" },
  { title: "依据编号", ellipsis: true, dataIndex: "assessNo" },
  { title: "班组扣分", ellipsis: true, dataIndex: "teamGroupDeduct" },
  { title: "人员扣分", ellipsis: true, dataIndex: "personalDeduct" },
  { title: "状态", ellipsis: true, dataIndex: "recordStatusName", width: 90 },
  {
    fixed: "right",
    title: "操作",
    width: 120,
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  components: { assessmentDetails },
  data() {
    return {
      formType: "",
      recode: {},
      Recodedisabled: false,
      applicationsVisible: false,
      selectedRowKeys: [],
      owningOption: [],
      operationDateArray: [],
      searchInfo: {
        pageNum: 1,
        pageSize: 10,
        assessType: 1, //当传入1是为减分界面，当传入2是为加分界面
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
      columns: columns,
      dataSource: [],
    };
  },
  created() {
    this.getList();
    let dict = [];
    getdict().then((res) => {
      res.body.data.forEach((item) => {
        dict.push({ value: item.id, label: item.dictname });
      });
    });
    this.owningOption = dict;
  },

  methods: {
    onOperationDateTimeChange(value, mode) {
      this.operationDateArray = value;
      this.searchInfo.startMonth = this.formatDate(
        new Date(value[0]),
        "yyyy-MM"
      );
      this.searchInfo.endMonth = this.formatDate(new Date(value[1]), "yyyy-MM");
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
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //批量删除确认方法
    deleteListClick() {
      if (
        this.selectedRowKeys.length == 0 ||
        this.selectedRowKeys.length == 0
      ) {
        this.$message.warning("至少选中一项要删除的数据");
      } else {
        let recode = [];
        this.selectedRowKeys.forEach((element) => {
          let row = this.dataSource.find((item) => element === item.id);
          if (row.recordStatus == 2) {
            recode.push(element);
          }
        });
        if (recode.length > 0) {
          this.$message.warning("请勿删除已进入工作流程中的数据");
        } else {
          TeamGroupExamineDeleteBatch(this.selectedRowKeys).then((res) => {
            console.log(res);
            if (res.code == "200") {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.warning("删除失败");
            }
          });

          this.selectedRowKeys = [];
        }
      }
    },
    // 批审批
    approvalClicks(e) {
      if (
        this.selectedRowKeys.length == 0 ||
        this.selectedRowKeys.length == 0
      ) {
        this.$message.warning("至少选中一项要审批的数据");
      } else {
        let recode = [];
        let rows = [];
        this.selectedRowKeys.forEach((element) => {
          let row = this.dataSource.find((item) => element === item.id);
          if (row.recordStatus != 2) {
            recode.push(element);
          } else {
            row.type = e;
            row.opinion = e == 0 ? "驳回" : "同意";
            rows.push(row);
          }
        });
        if (recode.length > 0) {
          this.$message.warning("请选择已进入工作流程中的数据");
        } else {
          TeamGroupExamineapplyAudio(rows).then((res) => {
            if (res.body == "true") {
              this.$message.success("审批成功");
              this.getList();
            } else {
              this.$message.warning("审批失败");
            }
          });
          this.selectedRowKeys = [];
        }
      }
    },
    //关闭弹出框
    applicationsVisibleClose() {
      this.getList();
      this.applicationsVisible = false;
      this.recode = {};
    },
    //分页查询
    select() {
      console.log(this.searchInfo);
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = 10;
      this.getList();
    },
    //点击表格中审批按钮
    approvalClick(val) {
      this.upDateListDetail(val, "approval");
    },
    // 新增打开弹出框方法
    addNew() {
      this.formType = "add";
      this.Recodedisabled = false;
      this.applicationsVisible = true;
      let date = new Date();
      let month = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }`;

      this.recode.createdUser = this.$store.state.user.name;
      this.recode.createdTime = `${month}-${
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      }`;
      this.recode.assessMonth = month;
    },
    //列表编辑方法
    upDateListDetail(val, type) {
      console.log("type", type);
      this.Recodedisabled = type == "look" || type == "approval" ? true : false;
      console.log("this.Recodedisabled", this.Recodedisabled);
      this.recode = val;
      this.formType = type;
      this.applicationsVisible = true;
    },
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageNum = pagination.current;
      this.searchInfo.pageSize = pagination.pageSize;
      this.getList();
    },
    //获取表格列表
    getList() {
      this.searchInfo.assessType = 1;
      TeamGroupExaminefindAllList(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.dataSource.forEach((element) => {
          if (element.recordStatus == 1) {
            element.recordStatusName = "已保存";
          } else if (element.recordStatus == 2) {
            element.recordStatusName = "已提交";
          } else if (element.recordStatus == 4) {
            element.recordStatusName = "已审批";
          } else if (element.recordStatus == 5) {
            element.recordStatusName = "已拒绝";
          }
        });
        this.pagination.total = res.body.total;
      });
    },

    //重置表单输入框
    resetForm() {
      this.searchInfo = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },

    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus == "4",
        },
      };
    },
  },
};
</script>
<style scoped lang="less">
</style>
