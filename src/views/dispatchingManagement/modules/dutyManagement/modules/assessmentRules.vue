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
            url: '/TeamGroupQuaAssess/exportExcel',
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
                :labelCol="{ style: 'width: 140px' }"
                label="考核类型:"
              >
                <a-select
                  allowClear
                  placeholder="请选择考核类型"
                  v-model="searchInfo.assessType"
                >
                  <a-select-option
                    allowClear
                    :value="item.value"
                    v-for="(item, index) in TypeOption"
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
                label="依据编号:"
              >
                <a-input
                  placeholder="请输入依据编号"
                  v-model="searchInfo.assessNo"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="描述:"
              >
                <a-input
                  placeholder="请输入描述"
                  v-model="searchInfo.assessDescribe"
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
          ></pe-button>
        </template>
      </a-table>
      <!--弹出框-->
      <a-modal
        :title="`班组量化考核规则配置${
          formType == 'add' ? '新增' : formType == 'edit' ? '编辑' : '详情'
        }`"
        width="80vw"
        :visible="applicationsVisible"
        :footer="null"
        :maskClosable="false"
        @cancel="applicationsVisibleClose"
        class="DcModel"
      >
        <assessmentRulesDetails
          ref="assessmentRulesDetails"
          :recode="recode"
          :yeardata="yeardata"
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
  QuaAssessDeleteBatch,
  QuaAssessfindAllList,
} from "@/api/dispatchingManagement/teamManagement.js";

import assessmentRulesDetails from "./assessmentRulesDetails.vue";
import { getdict } from "@/api/temporaryOverhaulplan";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "考核类型", ellipsis: true, dataIndex: "assessType" },
  { title: "依据编号", ellipsis: true, dataIndex: "assessNo" },
  { title: "描述", ellipsis: true, dataIndex: "assessDescribe" },
  { title: "班组扣分", ellipsis: true, dataIndex: "teamGroupDeduct" },
  { title: "人员扣分", ellipsis: true, dataIndex: "personalDeduct" },
  { title: "创建人", ellipsis: true, dataIndex: "createdUser", width: 70 },
  {
    title: "创建时间",
    ellipsis: true,
    dataIndex: "createdDateTime",
    width: 90,
  },
  {
    fixed: "right",
    title: "操作",
    width: 90,
    scopedSlots: { customRender: "operation" },
  },
];
const TypeOption = [
  { label: "劳动纪律", value: "劳动纪律" },
  { label: "生产管理", value: "生产管理" },
  { label: "工艺指标", value: "工艺指标" },
  { label: "设备管理", value: "设备管理" },
  { label: "HSE管理", value: "HSE管理" },
  { label: "计量管理", value: "计量管理" },
  { label: "加分考核", value: "加分考核" },
];

export default {
  components: {
    assessmentRulesDetails,
  },
  data() {
    return {
      formType: "",
      recode: {},
      yeardata: [{}],
      applicationsVisible: false,
      selectedRowKeys: [],
      TypeOption: TypeOption,
      searchInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      Recodedisabled: false,
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
  },

  methods: {
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //批量删除确认方法
    deleteListClick() {
      QuaAssessDeleteBatch(this.selectedRowKeys).then((res) => {
        console.log(res);
        if (res.code == "200") {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.warning("删除失败");
        }
      });
    },
    //关闭弹出框
    applicationsVisibleClose() {
      this.getList();
      this.applicationsVisible = false;
      this.recode = {};
      this.yeardata = [{}];
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
      this.applicationsVisible = true;
      let date = new Date();
      this.recode.createdUser = this.$store.state.user.name;
      this.recode.createdDateTime = `${date.getFullYear()}-${
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
      this.Recodedisabled = type == "look" ? true : false;
      this.recode = val;
      this.formType = type;
      let data = [];
      data.push(val);
      this.yeardata = data;
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
      QuaAssessfindAllList(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
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
  },
};
</script>
<style scoped lang="less">
</style>
