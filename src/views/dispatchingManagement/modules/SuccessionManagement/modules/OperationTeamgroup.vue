<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addNew' },
          { value: 'Delete', clickName: 'deleteListClick' },
          {
            value: 'exportComponent',
            isPower: false,
            url: '/operatingTeam/exportOperationCardVersion',
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
              <a-form-model-item label="当班日期：">
                <a-range-picker
                  v-model="searchInfo.shiftDate"
                  valueFormat="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="班次：">
                <a-select
                  v-model="searchInfo.shift"
                  show-search
                  placeholder="请选择班次"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in classTime"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="交班班组：">
                <a-select
                  v-model="searchInfo.shiftTeams"
                  show-search
                  placeholder="请选择班组"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in owningOption"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="接班班组：">
                <a-select
                  v-model="searchInfo.successionTeam"
                  show-search
                  placeholder="请选择班组"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in owningOption"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="交班人:"
              >
                <a-input
                  placeholder="请输入交班人"
                  v-model="searchInfo.shiftTaker"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="接班人:"
              >
                <a-input
                  placeholder="请输入接班人"
                  v-model="searchInfo.successor"
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
                value: '接班',
                type: 'link',
                clickName: 'upDateListDetail',
                style: ['btn_link'],
                icon: '',
                disabled: row.status == 2 ? false : true,
              },
              {
                value: 'Edit',
                type: 'link',
                icon: '',
                clickName: 'edit',
                style: ['btn_link'],
                disabled: $audit.editDisabled(row.status),
              },
              {
                value: 'details',
                type: 'link',
                clickName: 'detailsClick',
                name: '详情',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @edit="upDateListDetail(row, 'edit')"
            @detailsClick="upDateListDetail(row, 'look')"
            @upDateListDetail="upDateListDetail(row, 'succession')"
          ></pe-button>
        </template>
      </a-table>
      <!--弹出框-->
      <OperationTeamgroupDetail
        :recode="recode"
        :Recodedisabled="Recodedisabled"
        :owningOption="owningOption"
        :formType="formType"
        :applicationsVisibles="applicationsVisibles"
        @getList="getList"
      />
    </template>
  </Breadcrumb>
</template>
<script>
import {
  operatingTeamselect,
  operatingTeamdelete,
} from "@/api/dispatchingManagement/SuccessionManagement";

import { getdict } from "@/api/dispatchingManagement/teamManagement.js";

import OperationTeamgroupDetail from "./OperationTeamgroupDetail.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "编码", ellipsis: true, dataIndex: "encoding" },
  { title: "当班日期", ellipsis: true, dataIndex: "shiftDate" },
  { title: "班次", ellipsis: true, dataIndex: "shift" },
  { title: "交班班组", ellipsis: true, dataIndex: "shiftTeams" },
  { title: "交班人", ellipsis: true, dataIndex: "shiftTaker" },
  { title: "交班时间", ellipsis: true, dataIndex: "shiftTime" },
  { title: "接班班组", ellipsis: true, dataIndex: "successionTeam" },
  { title: "接班人", ellipsis: true, dataIndex: "successor" },
  { title: "接班时间", ellipsis: true, dataIndex: "successionTime" },
  { title: "状态", ellipsis: true, dataIndex: "statusName" },
  {
    fixed: "right",
    title: "操作",
    width: 120,
    scopedSlots: { customRender: "operation" },
  },
];
const classTime = [
  { value: "零点", label: "零点" },
  { value: "八点", label: "八点" },
  { value: "四点", label: "四点" },
];

export default {
  components: { OperationTeamgroupDetail },
  data() {
    return {
      formType: "",
      recode: {},
      applicationsVisibles: false,
      selectedRowKeys: [],
      owningOption: [],
      Recodedisabled: false,
      classTime: classTime,
      searchInfo: {
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
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.status !== "1" && record.status !== "5",
        },
      };
    },
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //批量删除确认方法
    deleteListClick(val) {
      operatingTeamdelete(this.selectedRowKeys).then((res) => {
        if (res.code == "200") {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.warning("删除失败");
        }
      });

      this.selectedRowKeys = [];
    },
    //分页查询
    select() {
      console.log(this.searchInfo);
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = 10;
      this.getList();
    },
    // 新增打开弹出框方法
    addNew() {
      this.formType = "add";
      this.Recodedisabled = false;
      this.applicationsVisibles = true;
      let date = new Date();
      this.recode.shiftTaker = this.$store.state.user.name;
      this.recode.shiftTime = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} ${
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      }:${
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      }:${
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      }`;
    },
    //列表编辑方法
    upDateListDetail(val, type) {
      this.Recodedisabled =
        type == "look" || type == "succession" ? true : false;
      this.recode = val;
      this.formType = type;
      this.applicationsVisibles = true;
    },
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageNum = pagination.current;
      this.searchInfo.pageSize = pagination.pageSize;
      this.getList();
    },
    //获取表格列表
    getList() {
      this.applicationsVisibles = false;
      this.recode = {};
      operatingTeamselect(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
        let data = res.body.data;
        // 1：已保存  2：已提交  3：已完成  5：退回
        data.forEach((element) => {
          if (element.status == 1) {
            element.statusName = "已保存";
          } else if (element.status == 2) {
            element.statusName = "已提交";
          } else if (element.status == 3) {
            element.statusName = "已完成";
          } else {
            element.statusName = "退回";
          }
        });
        this.dataSource = data;
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
  },
};
</script>
<style scoped lang="less">
.ant-popover {
  .ant-popover-buttons {
    display: flex;
    flex-direction: row-reverse;
  }
}
span.popconfirm_style {
  background: rgba(212, 0, 0, 0);
  border: 1px solid rgba(212, 0, 0, 0);
}
span.popconfirm_style:hover {
  background-color: rgba(212, 0, 0, 0) !important;
  border-color: rgba(212, 0, 0, 0) !important;
}
.btn_link[disabled] {
  margin-right: 0px;
}
</style>
