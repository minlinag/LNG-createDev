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
            url: '/violationManagement/exportExcelG',
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
              <a-form-model-item label="承运单位：">
                <a-select
                  v-model="searchInfo.carrierUnit"
                  show-search
                  placeholder="请选择承运单位"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    v-for="(item, index) in UnitDatas"
                    :value="item.carrier_code"
                    :key="index"
                  >
                    {{ item.carrier_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="违规类型：">
                <a-input
                  placeholder="请输入违规类型"
                  v-model="searchInfo.violationType"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="违规级别：">
                <a-select
                  v-model="searchInfo.violationGradeId"
                  show-search
                  placeholder="请选择违规级别"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in levelData"
                    :key="index"
                  >
                    {{ item.violationGrade }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="发现人：">
                <a-input
                  placeholder="请输入发现人"
                  v-model="searchInfo.discoverer"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :span="6">
              <a-form-model-item label="牵引车号：">
                <a-input
                  placeholder="请输入牵引车号"
                  v-model="searchInfo.tractionVehicleNumber"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="挂车号：">
                <a-input
                  placeholder="请输入挂车号"
                  v-model="searchInfo.hangLicensePlate"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="驾驶员：">
                <a-input
                  placeholder="请输入驾驶员"
                  v-model="searchInfo.driver"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="押运员：">
                <a-input
                  placeholder="请输入押运员"
                  v-model="searchInfo.supercargo"
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
                clickName: 'detailsClick',
                name: '详情',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @edit="upDateListDetail(row, 'edit')"
            @detailsClick="upDateListDetail(row, 'look')"
          ></pe-button>
        </template>
        <template slot="violationType" slot-scope="row">
          {{
            row
              ? options.find((item) => item.value == row)
                ? options.find((item) => item.value == row).label
                : ""
              : ""
          }}
        </template>
        <template slot="violationGradeId" slot-scope="row">
          {{
            row
              ? levelData.find((item) => item.id == row)
                ? levelData.find((item) => item.id == row).violationGrade
                : ""
              : ""
          }}
        </template>
      </a-table>
      <!--弹出框-->
      <a-modal
        :title="`违规管理${
          formType == 'add' ? '新增' : formType == 'edit' ? '编辑' : '详情'
        }`"
        :maskClosable="false"
        width="80vw"
        :visible="applicationsVisible"
        :footer="null"
        @cancel="applicationsVisibleClose"
        class="DcModel"
      >
        <ViolationsManagementDetails
          :recode="recode"
          :options="options"
          :Recodedisabled="Recodedisabled"
          :linkData="linkData"
          :formType="formType"
          @close="applicationsVisibleClose"
        />
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getdict,
  selectRank,
  selectByConditionGl,
  deleteByIdGl,
  selelctCommonCarrierList,
} from "@/api/dispatchingManagement/TanklorryManagement";

import ViolationsManagementDetails from "./ViolationsManagementDetails.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "日期", ellipsis: true, dataIndex: "violationTime" },
  { title: "承运单位", ellipsis: true, dataIndex: "carrierUnit" },
  { title: "牵引车号", ellipsis: true, dataIndex: "tractionVehicleNumber" },
  { title: "挂车号", ellipsis: true, dataIndex: "hangLicensePlate" },
  { title: "驾驶员", ellipsis: true, dataIndex: "driver" },
  { title: "押运员", ellipsis: true, dataIndex: "supercargo" },
  {
    title: "违规类型",
    ellipsis: true,
    dataIndex: "violationType",
    scopedSlots: { customRender: "violationType" },
  },
  {
    title: "违规级别",
    ellipsis: true,
    dataIndex: "violationGradeId",
    scopedSlots: { customRender: "violationGradeId" },
  },
  { title: "情况描述", ellipsis: true, dataIndex: "situationDescription" },
  { title: "发现人", ellipsis: true, dataIndex: "discoverer" },
  { title: "销售确认人", ellipsis: true, dataIndex: "salesConfirmer" },
  {
    fixed: "right",
    title: "操作",
    width: 90,
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  components: { ViolationsManagementDetails },
  data() {
    return {
      formType: "",
      recode: {},
      Recodedisabled: false,
      options: [],
      applicationsVisible: false,
      selectedRowKeys: [],
      linkData: [],
      levelData: [],
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
      UnitDatas: [],
    };
  },
  created() {
    this.getList();
    getdict("CCKHGL-WGXLX").then((res) => {
      res.body.data.forEach((item) => {
        this.options.push({ value: item.id, label: item.dictname });
      });
    });
    getdict("CCKHGL-WGXHJ").then((res) => {
      res.body.data.forEach((item) => {
        this.linkData.push({ value: item.id, label: item.dictname });
      });
    });
    selelctCommonCarrierList().then((res) => {
      this.UnitDatas = res.body;
    });
    selectRank().then((res) => {
      this.levelData = res.body;
    });
  },

  methods: {
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //批量删除确认方法
    deleteListClick() {
      deleteByIdGl({ ids: this.selectedRowKeys.join(",") }).then((res) => {
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
      this.Recodedisabled = false;
      this.formType = "add";
      this.applicationsVisible = true;
      let date = new Date();
      this.recode.createdUser = this.$store.state.user.name;
      this.recode.createdDateTime = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
    },
    //列表编辑方法
    upDateListDetail(val, type) {
      this.Recodedisabled = type == "look" ? true : false;
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
      selectByConditionGl(this.searchInfo).then((res) => {
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
