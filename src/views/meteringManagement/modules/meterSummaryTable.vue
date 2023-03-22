<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <!-- 导出规则：表格有选中项优先导出选中项，无选中项按查询条件导出，查询条件为空时导出全部 -->
      <pe-button
        :include="[
          {
            value: 'exportComponent',
            url: '/ExportMeasureTotalTableController/exportExcel',
            params: {
              idList: selectedRowKeys != '' ? selectedRowKeys : '',
              startTime:
                selectedRowKeys == '' && form.startTime ? form.startTime : '',
              endTime:
                selectedRowKeys == '' && form.endTime ? form.endTime : '',
            },
          },
        ]"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  label="日期:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-range-picker
                    v-model="date"
                    valueFormat="YYYY-MM-DD"
                    @change="dateChange"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item>
                  <a-button
                    v-Query
                    class="buttonType"
                    type="primary"
                    @click="search"
                  >
                    查询
                  </a-button>
                  <a-button class="buttonType" @click="resetForm">
                    重置
                  </a-button></a-form-model-item
                ></a-col
              >
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <!-- <div class="queryItem">
        <a-button v-Query class="buttonType" type="primary" @click="search">
          查询
        </a-button>
        <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
      </div> -->
      <!-- <a-collapse :defaultActiveKey="['1']">
        <a-collapse-panel key="1" header="外委单位列表"> -->
      <!-- <div slot="extra">
        <a-button class="buttonType" type="primary" @click.stop="">
          导出
        </a-button>
      </div> -->
      <a-table
        style="margin-top: 10px"
        class="unloadTable"
        bordered
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
      </a-table>
      <!-- </a-collapse-panel>
      </a-collapse> -->
    </template>
  </Breadcrumb>
</template>
<script>
import { getList } from "@/api/meteringManagement/meterSummaryTable.js";
export default {
  data() {
    return {
      //翻页页面组件
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
      //勾选框/选择框组件
      selectedRowKeys: [],
      date: [],
      //查询所需的数据
      form: {
        startTime: "",
        endTime: "",
      },
      dataSource: [],
      //页面下方表格的列属性
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
          align: "center",
        },
        {
          title: "日期",
          dataIndex: "dates",
          width: 200,
          align: "center",
        },
        // {
        //   title: "管道外输",
        //   dataIndex: "outsourceCompany",
        //   width: 140,
        //   align: "center",
        //   children: [
        {
          title: "管道外输",
          width: 140,
          children: [
            {
              title: "计划(Nm3)",
              dataIndex: "pipelineExportPlan",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "pipelineExportPlan",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "外输气量(Nm3)",
              dataIndex: "pipelineExportExternalGasVol",
              align: "center",
              width: 120,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "pipelineExportExternalGasVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "从投产总累计(Nm3)",
              dataIndex: "pipelineExportProductTotalCumulateVol",
              align: "center",
              width: 150,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "pipelineExportProductTotalCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "外输气量(t)",
              dataIndex: "pipelineExportExternalGasQua",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "pipelineExportExternalGasQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "从投产总累计(t)",
              dataIndex: "pipelineExportProductTotalCumulateQu",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "pipelineExportProductTotalCumulateQu",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "年累计体积(Nm3)",
              dataIndex: "pipelineExportYearCumulateVol",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "pipelineExportYearCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "年累计质量(t)",
              dataIndex: "pipelineExportYearCumulateQua",
              align: "center",
              width: 110,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "pipelineExportYearCumulateQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
          ],
        },
        {
          title: "第三方",
          dataIndex: "14",
          width: 140,
          children: [
            {
              title: "计划(Nm3)",
              dataIndex: "thirdPartyPlan",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "thirdPartyPlan",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "外输气量(Nm3)",
              dataIndex: "thirdPartyExportGasVol",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "thirdPartyExportGasVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "从投产总累计(Nm3)",
              dataIndex: "thirdPartyTotalCumulateVol",
              align: "center",
              width: 150,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "thirdPartyTotalCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "外输气量(t)",
              dataIndex: "thirdPartyExportGasQua",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "thirdPartyExportGasQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "从投产总累计(t)",
              dataIndex: "thirdPartyTotalCumulateQua",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "thirdPartyTotalCumulateQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "年累计体积(Nm3)",
              dataIndex: "thirdPartyYearCumulateVol",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "thirdPartyYearCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "年累计质量(t)",
              dataIndex: "thirdPartyYearCumulateQua",
              align: "center",
              width: 120,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "thirdPartyYearCumulateQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
          ],
        },
        {
          title: "总体",
          dataIndex: "29",
          width: 140,
          children: [
            // {
            //   title: "日总外输",
            //   dataIndex: "30",
            //   align: "center",
            //   width: 100,
            //   children: [
            //     {
            //       title: "Nm3",
            //       dataIndex: "overallDailyTotalExportVol",
            //       align: "center",
            //       width: 150,
            //     },
            //     {
            //       title: "t",
            //       dataIndex: "overallDailyTotalExportQua",
            //       align: "center",
            //       width: 150,
            //     },
            //   ],
            // },
            {
              title: "日总外输(Nm3)",
              dataIndex: "overallDailyTotalExportVol",
              align: "center",
              width: 130,
            },
            {
              title: "日总外输(t)",
              dataIndex: "overallDailyTotalExportQua",
              align: "center",
              width: 100,
            },
            {
              title: "年总累计体积(Nm3)",
              dataIndex: "overallYearTotalCumulateVol",
              align: "center",
              width: 150,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "overallYearTotalCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "年总累计质量(t)",
              dataIndex: "overalllYearTotalCumulateQua",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "overalllYearTotalCumulateQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "投产以来总体积(Nm3)",
              dataIndex: "overallProductTotalVol",
              align: "center",
              width: 160,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "overallProductTotalVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "投产以来总质量(t)",
              dataIndex: "overallProductTotalQua",
              align: "center",
              width: 140,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "overallProductTotalQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
          ],
        },
        {
          title: "冷能启停",
          dataIndex: "41",
          width: 140,
          children: [
            {
              title: "开",
              dataIndex: "coldEnergyStartStopOpen",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: " ",
              //     dataIndex: "coldEnergyStartStopOpen",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "关",
              dataIndex: "coldEnergyStartStopClose",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: " ",
              //     dataIndex: "coldEnergyStartStopClose",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "冷能销售量(t)",
              dataIndex: "coldEnergyStartStopSaleQuantity",
              align: "center",
              width: 120,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "coldEnergyStartStopSaleQuantity",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "冷能耗气量(t)",
              dataIndex: "coldEnergyStartStopConsumeGasQuantity",
              align: "center",
              width: 120,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "coldEnergyStartStopConsumeGasQuantity",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
          ],
        },
        {
          title: "自耗气",
          dataIndex: "50",
          width: 140,
          children: [
            {
              title: "锅炉用量(Nm3)",
              dataIndex: "selfConsumeGasBoilerConsumeQuantity",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "selfConsumeGasBoilerConsumeQuantity",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "火炬消耗量(t)",
              dataIndex: "selfConsumeGasTorchConsumeQuantity",
              align: "center",
              width: 120,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "selfConsumeGasTorchConsumeQuantity",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "槽车标密(Kg/m3)",
              dataIndex: "selfConsumeGasTankcarDensity",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "Kg/m3",
              //     dataIndex: "selfConsumeGasTankcarDensity",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "燃料气用量(t)",
              dataIndex: "selfConsumeGasUseGasQuantity",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "selfConsumeGasUseGasQuantity",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
          ],
        },
        {
          title: "槽车",
          dataIndex: "59",
          width: 140,
          children: [
            {
              title: "质量(t)",
              dataIndex: "tankcarQuality",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "tankcarQuality",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "体积(Nm3)",
              dataIndex: "tankcarVolume",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "tankcarVolume",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "装车数(辆)",
              dataIndex: "tankcarNumbers",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: "(辆)",
              //     dataIndex: "tankcarNumbers",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "年累计质量(t)",
              dataIndex: "tankcarYearCumulateQua",
              align: "center",
              width: 120,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "tankcarYearCumulateQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "年累计体积(Nm3)",
              dataIndex: "tankcarYearCumulateVol",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "tankcarYearCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "自投产累计质量(t)",
              dataIndex: "tankcarSelfProductCumulateQua",
              align: "center",
              width: 140,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "tankcarSelfProductCumulateQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "自投产累计体积(Nm3)",
              dataIndex: "tankcarSelfProductCumulateVol",
              align: "center",
              width: 160,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "tankcarSelfProductCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
          ],
        },
        {
          title: "外输总计",
          dataIndex: "74",
          width: 140,
          children: [
            {
              title: "年累计质量(t)",
              dataIndex: "exportTotalYearCumulateQua",
              align: "center",
              width: 100,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "exportTotalYearCumulateQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "年累计体积(Nm3)",
              dataIndex: "exportTotalYearCumulateVol",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "exportTotalYearCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "自投产累计质量(t)",
              dataIndex: "exportTotalSelfProductCumulateQua",
              align: "center",
              width: 130,
              // children: [
              //   {
              //     title: "t",
              //     dataIndex: "exportTotalSelfProductCumulateQua",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
            {
              title: "自投产累计体积(Nm3)",
              dataIndex: "exportTotalSelfProductCumulateVol",
              align: "center",
              width: 160,
              // children: [
              //   {
              //     title: "Nm3",
              //     dataIndex: "exportTotalSelfProductCumulateVol",
              //     align: "center",
              //     width: 150,
              //   },
              // ],
            },
          ],
        },
        //   ],
        // },
      ],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获得当前页面
    getList() {
      getList(this.form).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //日期的onchange
    dateChange(dates) {
      console.log(dates);
      if (dates.length > 0) {
        this.form.startTime = dates[0];
        this.form.endTime = dates[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageNum = 1;
        this.form.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.date = [];
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
  },
};
</script>
<style scoped>
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout{
  margin-bottom: 0px;
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item-control {
  width: 100%;
}

.ant-select-selection--single {
  width: 180px;
}

.aaaa {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
</style>
