<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'exportComponent',
            isPower: false,
            url: '/violationManagement/exportExcelStatistics',
          },
        ]"
      />
    </template>
    <template slot="appMain">
      <div
        id="components-layout-demo-basic"
        class="appMainForm"
        style="width: 100%; position: relative"
      >
        <a-form-model>
          <a-row :gutter="10">
            <a-col :span="8">
              <a-form-model-item
                label="承运单位："
                :labelCol="{ style: 'width: 120px' }"
              >
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
            <a-col :span="8">
              <a-form-model-item label="考核月份：">
                <a-month-picker
                  format="YYYY-MM"
                  :valueFormat="'YYYY-MM'"
                  v-model="searchInfo.assessmentMonth"
                  placeholder="选择日期"
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
                value: 'details',
                type: 'link',
                clickName: 'detailsClick',
                name: '详情',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @detailsClick="upDateListDetail(row, 'look')"
          ></pe-button>
        </template>
        <template slot="carrierUnit" slot-scope="row">
          {{
            row
              ? UnitDatas.find((item) => item.carrier_code == row)
                ? UnitDatas.find((item) => item.carrier_code == row)
                    .carrier_name
                : ""
              : ""
          }}
        </template>
      </a-table>
      <!--弹出框-->
      <a-modal
        title="承运单位考核统计详情"
        :maskClosable="false"
        width="80vw"
        :visible="applicationsVisible"
        :footer="null"
        @cancel="applicationsVisibleClose"
        class="DcModel"
      >
        <CarrierInitStatisticalDetail
          :recode="recode"
          :UnitDatas="UnitDatas"
          @close="applicationsVisibleClose"
        />
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  selelctCommonCarrierList,
  selectCarrierUnit,
} from "@/api/dispatchingManagement/TanklorryManagement";

import CarrierInitStatisticalDetail from "./CarrierInitStatisticalDetail.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "考核月份", ellipsis: true, dataIndex: "assessmentMonth" },
  {
    title: "承运单位",
    ellipsis: true,
    dataIndex: "carrierUnit",
    scopedSlots: { customRender: "carrierUnit" },
  },
  { title: "月度装车量", ellipsis: true, dataIndex: "monthlyLoadingVolume" },
  { title: "考核基础分", ellipsis: true, dataIndex: "basicScoreAssessment" },
  { title: "违规级别", ellipsis: true, dataIndex: "violationGrade" },
  { title: "权重分", ellipsis: true, dataIndex: "divisionWeight" },
  { title: "扣除分", ellipsis: true, dataIndex: "deductionPoints" },
  { title: "综合得分", ellipsis: true, dataIndex: "synthesisScore" },
  {
    fixed: "right",
    title: "操作",
    width: 50,
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  components: { CarrierInitStatisticalDetail },
  data() {
    return {
      formType: "",
      recode: {},
      applicationsVisible: false,
      selectedRowKeys: [],
      UnitDatas: [],
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
    selelctCommonCarrierList().then((res) => {
      console.log("res", res.body);
      this.UnitDatas = res.body;
    });
  },

  methods: {
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //关闭弹出框
    applicationsVisibleClose() {
      this.getList();
      this.applicationsVisible = false;
    },
    //分页查询
    select() {
      console.log(this.searchInfo);
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = 10;
      this.getList();
    },
    //列表编辑方法
    upDateListDetail(val, type) {
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
      selectCarrierUnit(this.searchInfo).then((res) => {
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
