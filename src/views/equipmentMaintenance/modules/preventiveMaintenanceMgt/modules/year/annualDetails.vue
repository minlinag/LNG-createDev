<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            {
              value: 'exportComponent',
              url: '/Annual/exportExcel',
              params: { AnnualPlanNo: $route.query.planYearNo },
              accept: '.xlsx',
            },
            {
              value: 'Go',
              name: '返回',
              icon: 'Go-icon',
              isPower: false,
              clickName: 'go',
            },
          ]"
          @go="go"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
        <a-col :span="6">
          <a-form-model-item
            :labelCol="{ style: 'width: 180px' }"
            label="年度计划编码:"
          >
            <a-input
              ref="select"
              v-model="$route.query.planYearNo"
              :disabled="true"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <dc-table
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
      >
        <template slot="sparepart" slot-scope="row">
          <span class="edit" @click="lookbpbj(row)">查看</span>
        </template>
      </dc-table>
      <div>
            <stepsModel ref="stepsModel" :isShow="false" :id="this.$route.query.id" />
        </div>
      <dc-Model
        v-model="visibleSpareparts"
        :modelConfig="modelConfigSpareparts"
      >
        <dc-table
          rowKey="id"
          :scroll="{ x: 100 }"
          :columns="columnsSpareparts"
          :dataSource="sparepartsDataSource"
          :openSelector="false"
        ></dc-table>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  queryDetailsByAnnualPlanNo,
  exportExcel,
} from "@/api/annualMaintenance";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
import { getListById } from "@/api/sparesprt";
export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      columnsApproval: [],
      visibleSpareparts: false,
      dataSourceApproval: [],
      modelConfigSpareparts: {
        width: "950px",
        title: "备品备件清单 ",
        cancelText: false,
        footer: "", //是否展示页脚
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
      columnsSpareparts: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1}`,
          width: 50,
          align: "center",
        },
        {
          title: "备件名称名称",
          dataIndex: "SparePartName",
          width: 100,
          align: "center",
        },
        {
          title: "物资编码",
          dataIndex: "MaterialCode",
          width: 100,
          align: "center",
        },
        {
          title: "规格型号",
          dataIndex: "SpecificationOrMaterial",
          width: 100,
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 100,
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "PlanCostCount",
          width: 100,
          align: "center",
        },
      ],
      popovervisible: false,
      form: {},
      sparepartsDataSource: [],
      sparepartcol: [
        {
          title: "备件编码",
          dataIndex: "materialcode",
          width: 100,
          align: "center",
        },
        {
          title: "备件名称",
          dataIndex: "sparepartname",
          width: 100,
          align: "center",
        },
        {
          title: "材质",
          dataIndex: "specificationormaterial",
          width: 100,
          align: "center",
        },
        {
          title: "单价",
          dataIndex: "referenceunitprice",
          width: 100,
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 100,
          align: "center",
        },
      ],
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1}`,
          width: 70,
        },
        {
          title: "是否在账设备",
          dataIndex: "whetheraccountedequipment",
          width: 100,
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "devicename",
          width: 100,
          align: "center",
        },
        {
          title: "设备位号",
          dataIndex: "deviceno",
          width: 100,
          align: "center",
        },
        {
          title: "所属区域",
          dataIndex: "areaName",
          width: 100,
          align: "center",
        },
        {
          title: "责任人",
          dataIndex: "personincharge",
          width: 80,
          align: "center",
        },
        {
          title: "维护/检修内容描述",
          dataIndex: "maintenancedescription",
          width: 150,
          align: "center",
        },
        {
          title: "计划检修月份",
          dataIndex: "planmonth",
          width: 100,
          align: "center",
        },
        {
          title: "计划维修时长",
          dataIndex: "plannedmaintenancetime",
          width: 100,
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "majorName",
          width: 100,
          align: "center",
        },
        {
          title: "作业内容",
          dataIndex: "operationcontent",
          width: 100,
          align: "center",
        },
        {
          title: "所需备品备件清单",
          scopedSlots: { customRender: "sparepart" },
          width: 150,
          align: "center",
        },
        {
          title: "计划费用（元）",
          dataIndex: "plannedcost",
          width: 150,
          align: "center",
        },
        {
          title: "是否影响外输或接卸船",
          dataIndex: "whetheraffectexportorship",
          width: 170,
          align: "center",
        },
        {
          title: "需工艺条件",
          dataIndex: "requiredprocesscondition",
          width: 150,
          align: "center",
        },
        {
          title: "维修单位名称",
          dataIndex: "inspectioncompanyname",
          width: 150,
          align: "center",
        },
      ],
      sparePartDataSource: [],
      dataSource: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    look() {
      this.popovervisible = true;
    },
    go() {
      this.$router.push({
        path: "/annualMaintenance",
      });
    },

    exportExcel() {
      exportExcel({
        pageNum: 1,
        pageSize: 10,
        AnnualPlanNo: this.$route.query.planYearNo,
      }).then((res) => {
        console.log("exportExcel");
      });
    },
    getList(pageNum = 1, pageSize = 10) {
      var PlanNo = this.$route.query.planYearNo;
      console.log(this.$route.query.planYearNo, "annuallog");
      queryDetailsByAnnualPlanNo({
        pageNum: pageNum,
        pageSize: pageSize,
        AnnualPlanNo: PlanNo,
      }).then((res) => {
        this.dataSource = res.body.data;
        this.sparePartDataSource = res.body.data[0].sparePart;
        this.pagination.current = res.body.pageIndex;
        this.pagination.total = res.body.total;
        this.pagination.pageSize = res.body.pageSize;
        console.log(res.body.data[0].sparePart, "popdatasource");
      });
    },
    paginationChange(pagination) {
      this.getList(pagination.current, pagination.pageSize);
    },
    getSpareparts(row) {
      getListById({ ID: row.id }).then((res) => {
        this.sparepartsDataSource = res.body;
      });
    },
    lookbpbj(row) {
      this.visibleSpareparts = true;
      this.getSpareparts(row);
    },
  },
};
</script>
<style scoped>
.step {
  margin-top: 30px;
  margin-bottom: 30px;
}

.descriptionBox {
  margin-top: 10px;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
</style>
