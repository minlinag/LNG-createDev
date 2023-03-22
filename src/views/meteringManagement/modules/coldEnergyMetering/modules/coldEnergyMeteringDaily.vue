<template>
  <Breadcrumb>
    <template slot="appMain">
      <!--查询控件及按钮-->
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="用户单位"
                  >
                    <a-input
                      v-model="searchForm.companyName"
                      placeholder="请输入用户单位"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="仪表设备位号"
                  >
                    <a-input
                      v-model="searchForm.equipmentCode"
                      placeholder="请输入仪表设备位号"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    label="日期:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-range-picker
                      v-model="dateRange"
                      valueFormat="YYYY-MM-DD"
                      :placeholder="['开始日期', '结束日期']"
                      :getCalendarContainer="getPopupContainer"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item>
                    <a-button
                      class="buttonType"
                      type="primary"
                      @click.stop="queryClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-form-model-item>
                </a-col>
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
      </div>

      <!--表格-->
      <dc-table
        class="list_table_1"
        :scroll="{ y: 1, x: 100 }"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          fixed: true,
        }"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
        :customRow="rowStyle"
      >
        <!--表格下部合计行-->
        <!-- <template slot="footer" slot-scope="">
          {{ getSum() }}
        </template> -->
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import { getListForPage } from "@/api/meteringManagement/coldEnergyMeteringDaily.js";
export default {
  data() {
    return {
      //翻页页面组件
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["11", "21", "31", "41", "51", "61"],

        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 11, // 每页条数，所有页设置统一的条数
      },
      //勾选框/选择框组件
      selectedRowKeys: [],
      dateRange: [],
      //查询所需的数据
      searchForm: {
        pageSize: 10,
        pageNum: 1,
      },
      //页面下方表格的列属性
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          // customRender: (text, record, index) =>
          //   `${
          //     (this.pagination.current - 1) * this.pagination.pageSize +
          //     index +
          //     1
          //   }`,
          align: "center",
          width: 90,
        },
        {
          title: "日期",
          dataIndex: "dayDate",
          align: "center",
          // width: 140,
        },

        {
          title: "用户单位",
          dataIndex: "companyName",
          align: "center",
          // width: 100,
        },
        {
          title: "仪表设备位号",
          dataIndex: "equipmentCode",
          align: "center",
          // width: 150,
        },
        {
          title: "供应量(t)",
          dataIndex: "supply",
          align: "center",
          // width: 200,
        },
        {
          title: "保冷循环量(t)",
          dataIndex: "circulation",
          align: "center",
          // width: 200,
        },
        {
          title: "销售量(t)",
          dataIndex: "salesVolume",
          align: "center",
          // width: 150,
        },
        {
          title: "备注",
          dataIndex: "remark",
          align: "center",
          // width: 150,
        },
      ],
      //表格中的数据
      dataSource: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-changeList");
    },

    //合计行  加背景颜色
    rowStyle(record) {
      if (record.index == "本页合计") {
        return {
          style: {
            "background-color": "#eeeeee",
          },
        };
      }
    },

    //设置合计行 均值行  多选框不可选择
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.index === "本页合计",
        name: record.name,
      },
    }),

    //获得表格数据
    getList() {
      getListForPage(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize + 1;
        this.pagination.total = res.body.total;
        if (this.dataSource.length > 0) {
          this.getSum();
        }
      });
      //清空表格多选框
      this.selectedRowKeys = [];
    },

    //当表格复选框改变是触发，选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //查询功能
    queryClick() {
      if (this.dateRange.length != 0) {
        this.searchForm.dateLoadingStart = this.dateRange[0];
        this.searchForm.dateLoadingEnd = this.dateRange[1];
      } else {
        delete this.searchForm.dateLoadingStart;
        delete this.searchForm.dateLoadingEnd;
      }
      if (this.searchForm) {
        this.searchForm.pageNum = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    // 合计
    getSum() {
      let supply = 0;
      let circulation = 0;
      let salesVolume = 0;
      this.dataSource.forEach((item, index) => {
        item.index =
          (this.pagination.current - 1) * (this.pagination.pageSize - 1) +
          index +
          1;
        //累加
        supply = this.accAdd(
          supply,
          isNaN(new Number(item.supply)) ? 0 : new Number(item.supply)
        );
        circulation = this.accAdd(
          circulation,
          isNaN(new Number(item.circulation)) ? 0 : new Number(item.circulation)
        );
        salesVolume = this.accAdd(
          salesVolume,
          isNaN(new Number(item.salesVolume)) ? 0 : new Number(item.salesVolume)
        );
        //失真 弃用
        // supply += isNaN(new Number(item.supply)) ? 0 : new Number(item.supply);
        // circulation += isNaN(new Number(item.circulation))
        //   ? 0
        //   : new Number(item.circulation);
        // salesVolume += isNaN(new Number(item.salesVolume))
        //   ? 0
        //   : new Number(item.salesVolume);
      });
      let sumData = {
        id: "-999",
        index: "本页合计",
        supply: supply,
        circulation: circulation,
        salesVolume: salesVolume,
      };
      this.dataSource.push(sumData);
      // return `本页合计 供应量：${supply} 保冷循环量：${circulation} 销售量：${salesVolume}`;
    },

    //加法
    accAdd(arg1, arg2) {
      var r1, r2, m;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (arg1 * m + arg2 * m) / m;
    },

    //分页、排序、筛选变化时触发
    paginationChange(pagination) {
      this.searchForm.pageNum = pagination.current;
      // this.searchForm.pageSize = pagination.pageSize;
      this.getList();
    },

    //点击查询中的重置，清空查询条件，重新加载表格数据
    resetClick() {
      this.searchForm = {};
      //清空日期选择器
      this.dateRange = [];
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
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
.TableTop {
  margin-top: 10px;
}
</style>
