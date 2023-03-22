<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model v-model="form2" :layout="'inline'">
        <a-col :span="6">
          <a-form-model-item
            label="时间:"
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-month-picker
              format="YYYY-MM"
              :valueFormat="'YYYY-MM'"
              v-model="form2.planTime"
              placeholder="选择日期"
            />
          </a-form-model-item>
        </a-col>
        <a-form-model-item>
          <a-button v-Query class="buttonType" type="primary" @click="search2">
            查询
          </a-button>
          <a-button class="buttonType" @click="resetForm2"> 重置 </a-button>
        </a-form-model-item>
      </a-form-model>
      <a-table
        bordered
        @change="paginationChange2"
        rowKey="id"
        :pagination="false"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1 unloadTable"
        :columns="columns2"
        :dataSource="dataSource2"
        :openSelector="true"
      >
        <template slot="operation" slot-scope="row">
          <span class="edit" v-Edit @click="edit(row)">编辑</span>
          <span class="edit" @click="look(row)">详情</span>
        </template>
      </a-table></template
    ></Breadcrumb
  >
</template>
<script>
import {
  findAllListByYear,
  findAllListByMonth,
} from "@/api/dispatchingManagement/ProductionOperationTrack";
export default {
  data() {
    return {
      form: { pageNum: 1, pageSize: 10 },
      form2: { pageNum: 1, pageSize: 10 },
      stateInfo: [],
      //勾选框/选择框组件
      selectedRowKeys: [],
      //勾选框/选择框组件
      selectedRowKeys2: [],
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
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
      //翻页页面组件
      pagination2: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      //页面下方表格的列属性
      columns: [
        // {
        //   title: "序号",
        //   customRender: (text, record, index) =>
        //     `${
        //       (this.pagination.current - 1) * this.pagination.pageSize +
        //       index +
        //       1
        //     }`,
        //   width: 70,
        // },
        {
          title: "日期",
          dataIndex: "yearDate",
          align: "center",
          width: 100,
          ellipsis: true,
        },
        {
          title: "气化外输量(万方)",
          align: "center",
          children: [
            {
              title: "计划",
              dataIndex: "yearGasExportAmountPlan",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "实际量",
              dataIndex: "yearGasExportAmountActualNum",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "完成百分比",
              dataIndex: "yearGasExportAmountPercentCompletion",
              width: 100,
              align: "center",
              ellipsis: true,
            },
          ],
        },
        {
          title: "槽车装车量(万方)",
          align: "center",
          children: [
            {
              title: "计划",
              dataIndex: "yearTankerTruckLoadingPlan",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "实际量",
              dataIndex: "yearTankerTruckLoadingActualNum",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "完成百分比",
              dataIndex: "yearTankerTruckLoadingPercentCompletion",
              width: 100,
              align: "center",
              ellipsis: true,
            },
          ],
        },
        {
          title: "卸货量(万方)",
          align: "center",
          children: [
            {
              title: "计划",
              dataIndex: "yearUnloadAmountPlan",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "实际量",
              dataIndex: "yearUnloadAmountActualNum",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "完成百分比",
              dataIndex: "yearUnloadAmountPercentCompletion",
              width: 100,
              align: "center",
              ellipsis: true,
            },
          ],
        },
        {
          title: "装船计划(预留)",
          align: "center",
          children: [
            {
              title: "计划",
              dataIndex: "yearShipmentPlan",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "实际量",
              dataIndex: "yearShipmentActualNum",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "完成百分比",
              dataIndex: "yearShipmentPercentCompletionf",
              width: 100,
              align: "center",
              ellipsis: true,
            },
          ],
        },
      ],
      //表格中的数据
      dataSource: [],
      //页面下方表格的列属性
      columns2: [
        // {
        //   title: "序号",
        //   customRender: (text, record, index) =>
        //     `${
        //       (this.pagination2.current - 1) * this.pagination2.pageSize +
        //       index +
        //       1
        //     }`,
        //   width: 70,
        // },
        {
          title: "日期",
          dataIndex: "planTime",
          align: "center",
          width: 100,
          ellipsis: true,
        },
        {
          title: "气化外输量(万方)",
          align: "center",
          children: [
            {
              title: "计划量",
              dataIndex: "GasExportVolume",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "实际量",
              dataIndex: "exportGasAmount",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "完成百分比",
              dataIndex: "ExportPercentage",
              width: 100,
              align: "center",
              ellipsis: true,
            },
          ],
        },
        {
          title: "槽车装车量(万方)",
          align: "center",
          children: [
            {
              title: "计划量",
              dataIndex: "TankCarInVolume",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "实际量",
              dataIndex: "tankerLoadingAmount",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "完成百分比",
              dataIndex: "tankPercentage",
              width: 100,
              align: "center",
              ellipsis: true,
            },
          ],
        },
        {
          title: "卸货量(万方)",
          align: "center",
          children: [
            {
              title: "计划量",
              dataIndex: "monthUnloadAmountPlan",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "实际量",
              dataIndex: "monthUnloadAmountActualNum",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "完成百分比",
              dataIndex: "monthUnloadAmountPercentCompletion",
              width: 100,
              align: "center",
              ellipsis: true,
            },
          ],
        },
        {
          title: "装船计划(预留)",
          align: "center",
          children: [
            {
              title: "计划量",
              dataIndex: "monthShipmentPlan",
              width: 100,
              align: "center",
              ellipsis: true,
            },
            {
              title: "实际量",
              dataIndex: "monthShipmentActualNum",
              width: 100,
              ellipsis: true,
              align: "center",
            },
            {
              title: "完成百分比",
              dataIndex: "monthShipmentPercentCompletionf",
              width: 100,
              align: "center",
              ellipsis: true,
            },
          ],
        },
      ],
      //表格中的数据
      dataSource2: [],
    };
  },
  mounted() {
    let yy = new Date().getFullYear();
    let mm = new Date().getMonth() + 1;
    this.$set(this.form2, "planTime", yy + "-" + mm);
    this.getList();
    this.getList2();
  },
  methods: {
    addNew() {
      this.$router.push({
        path: "/monthProductionOperationDetail",
      });
    },
    mydelete() {},
    //获取表格列表
    getList() {
      findAllListByYear(this.form).then((res) => {
        console.log("res", res);
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body;
        this.pagination.total = res.body.total;
      });
    },
    //获取表格列表
    getList2() {
      findAllListByMonth(this.form2).then((res) => {
        this.pagination2.current = res.body.pageIndex;
        this.pagination2.pageSize = res.body.pageSize;
        for (let i = 0; i < res.body.length; i++) {
          // 气化外输量百分比
          res.body[i].ExportPercentage = `${
            parseFloat(
              parseInt(
                !res.body[i].exportGasAmount
                  ? 0
                  : res.body[i].exportGasAmount / !res.body[i].GasExportVolume
                  ? 1
                  : res.body[i].GasExportVolume
              )
            ) * 100
          }%`;

          // 槽车装车量
          res.body[i].tankPercentage = `${
            parseFloat(
              parseInt(
                !res.body[i].tankerLoadingAmount
                  ? 0
                  : res.body[i].tankerLoadingAmount /
                    !res.body[i].TankCarInVolume
                  ? 1
                  : res.body[i].TankCarInVolume
              )
            ) * 100
          }%`;
        }
        this.dataSource2 = res.body;
        this.pagination2.total = res.body.total;
      });
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
    //查询功能
    search2() {
      if (this.form2) {
        this.form2.pageNum = 1;
        this.form2.pageSize = 10;
        this.getList2();
      } else {
        this.getList2();
      }
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    paginationChange2(pagination) {
      this.form2.pageNum = pagination.current;
      this.form2.pageSize = pagination.pageSize;
      this.getList();
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //选择的key，这里为id
    onSelectChange2(key) {
      this.selectedRowKeys2 = key;
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    resetForm2() {
      this.form2 = {};
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      this.$set(this.form2, "planTime", yy + "-" + mm);
      this.form2.pageNum = 1;
      this.form2.pageSize = 10;
      this.getList2();
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