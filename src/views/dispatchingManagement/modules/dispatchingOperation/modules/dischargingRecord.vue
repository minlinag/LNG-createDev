<!-- 年度检维修计划管理 -->
<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model class="ant-form-inFo" :layout="'inline'">
        <a-col :span="6">
          <a-form-model-item
            label="船舶名称："
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-input
              placeholder="请输入船舶名称"
              v-model="searchInfo.shipName"
            />
          </a-form-model-item>
        </a-col>
        <a-form-model-item style="float: right">
          <a-button v-Query class="buttonType" type="primary" @click="search">
            查询
          </a-button>
          <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
        </a-form-model-item>
      </a-form-model>

      <dc-table
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'View',
                name: '详情',
                type: 'link',
                clickName: 'viewJump',
                icon: '',
                style: ['btn_link'],
                isPower: false,
              },
            ]"
            @viewJump="viewJump(row)"
          ></pe-button>
        </template>
      </dc-table>

      <a-modal
        title="卸船记录详情"
        :visible="detailVisible"
        :footer="null"
        :maskClosable="false"
        @cancel="applicationsVisibleClose"
        class="from-style bigModel"
      >
        <dischargingRecordDetails
          ref="detailModel"
          :recode="recode"
          @close="applicationsVisibleClose"
        />
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import { selectByCondition } from "@/api/dispatchingManagement/dischargingRecord.js";
import dischargingRecordDetails from "./dischargingRecordDetails.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "船期计划编号", dataIndex: "shippingScheduleNo", align: "center" },
  { title: "船舶名称", dataIndex: "shipName", align: "center" },
  { title: "接船开始日期", dataIndex: "pickUpStartDate", align: "center" },
  { title: "接船结束日期", dataIndex: "pickUpEndDate", align: "center" },
  { title: "卸货质量(t)", dataIndex: "qualityDischargeT", align: "center" },
  { title: "卸货标方(Nm³)", dataIndex: "nnloadStandardCubic", align: "center" },
  { title: "创建人", dataIndex: "createdUser", align: "center" },
  { title: "创建日期", dataIndex: "createdDateTime", align: "center" },
  {
    title: "操作",
    width: 80,
    scopedSlots: { customRender: "operation" },
    align: "center",
  },
];

export default {
  components: { dischargingRecordDetails },

  data() {
    return {
      detailVisible: false,
      recode: {},
      createdUser: "",
      dataSource: [],
      searchInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      columns: columns,
      pagination: {
        current: 0,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`,
        pageSize: 0,
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 详情
    viewJump(recode) {
      recode["productionDates"] = [
        recode.pickUpStartDate,
        recode.pickUpEndDate,
      ];
      this.recode = recode;
      this.detailVisible = true;
    },
    // 初始化
    getList() {
      selectByCondition(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    //关闭弹出框
    applicationsVisibleClose() {
      this.getList();
      this.detailVisible = false;
      this.recode = {};
    },
    //分页查询
    search() {
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = 10;
      this.getList();
    },

    //重置表单输入框
    resetForm() {
      this.searchInfo = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },

    // 页码改变调用
    paginationChange(pagination) {
      this.pagination.pageNum = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getList(this.pagination.pageNum, this.pagination.pageSize);
    },
  },
};
</script>
<style scoped lang="less">
</style>
