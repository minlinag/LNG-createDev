<template>
  <div>
    <a-form-model style="padding: 1rem">
      <a-row :gutter="10">
        <a-col :span="8">
          <a-form-model-item
            label="考核月份："
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-month-picker
              disabled
              format="YYYY-MM"
              :valueFormat="'YYYY-MM'"
              v-model="recode.assessmentMonth"
              placeholder="选择日期"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="承运单位："
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-select
              disabled
              v-model="recode.carrierUnit"
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
          <a-form-model-item
            label="月度装车量："
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              disabled
              v-model="recode.monthlyLoadingVolume"
              addon-after="辆"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="10" style="margin-top: -0.5rem">
        <a-col :span="8">
          <a-form-model-item
            label="考核基础分："
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              disabled
              v-model="recode.basicScoreAssessment"
              addon-after="分"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="扣除分："
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              disabled
              v-model="recode.deductionPoints"
              addon-after="分"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="综合得分："
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              disabled
              v-model="recode.synthesisScore"
              addon-after="分"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <pe-button
      :include="[
        {
          value: 'exportComponent',
          isPower: false,
          url: '/violationManagement/exportExcelGxx',
        },
      ]"
      style="float: right; margin: -2rem 1rem 0rem 0rem"
    />
    <a-table
      :scroll="{ x: 100 }"
      :pagination="pagination"
      @change="paginationChange"
      :row-key="(record) => record.id"
      :columns="columns"
      :dataSource="dataSource"
      :openSelector="false"
      style="margin-top: -1rem; padding: 1rem"
    >
      <template slot="carrierUnit" slot-scope="row">
        {{
          row
            ? UnitDatas.find((item) => item.carrier_code == row)
              ? UnitDatas.find((item) => item.carrier_code == row).carrier_name
              : ""
            : ""
        }}
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
  </div>
</template>
<script>
import {
  selelctCommonCarrierList,
  getdict,
  selectRank,
  selectByMonthCarrierUnit,
} from "@/api/dispatchingManagement/TanklorryManagement";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "日期", dataIndex: "violationTime" },
  {
    title: "承运单位",
    dataIndex: "carrierUnit",
    scopedSlots: { customRender: "carrierUnit" },
  },
  { title: "牵引车号", dataIndex: "tractionVehicleNumber" },
  { title: "挂车号", dataIndex: "hangLicensePlate" },
  { title: "驾驶员", dataIndex: "driver" },
  { title: "押运员", dataIndex: "supercargo" },
  {
    title: "违规类型",
    dataIndex: "violationType",
    scopedSlots: { customRender: "violationType" },
  },
  {
    title: "违规级别",
    dataIndex: "violationGradeId",
    scopedSlots: { customRender: "violationGradeId" },
  },
  { title: "情况描述", dataIndex: "situationDescription" },
  { title: "发现人", dataIndex: "discoverer" },
  { title: "销售确认人", dataIndex: "salesConfirmer" },
];

export default {
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    UnitDatas: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      formType: "",
      selectedRowKeys: [],
      options: [],
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
    };
  },
  created() {
    selectRank().then((res) => {
      this.levelData = res.body;
    });
    getdict("CCKHGL-WGXLX").then((res) => {
      res.body.data.forEach((item) => {
        this.options.push({ value: item.id, label: item.dictname });
      });
    });
  },
  watch: {
    recode(val) {
      this.getList();
    },
  },

  methods: {
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageNum = pagination.current;
      this.searchInfo.pageSize = pagination.pageSize;
      this.getList();
    },
    //获取表格列表
    getList() {
      this.searchInfo["carrierUnit"] = this.recode.carrierUnit;
      this.searchInfo["monthOfAssessment"] = this.recode.assessmentMonth;
      selectByMonthCarrierUnit(this.searchInfo).then((res) => {
        console.log("res", res);
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
  },
};
</script>
<style scoped lang="less">
</style>
