<template>
  <Breadcrumb>
    <template slot="appMain">
      <!--查询控件及按钮-->
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="电表名称"
                  >
                    <a-input
                      v-model="searchForm.equipmentName"
                      placeholder="请输入电表名称"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="电表位号"
                  >
                    <a-input
                      v-model="searchForm.equipmentTagNo"
                      placeholder="请输入电表位号"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="用电类型"
                  >
                    <a-input
                      v-model="searchForm.consumptionType"
                      placeholder="请输入用电类型"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="9">
                  <a-form-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="日期"
                  >
                    <a-row :gutter="24">
                      <a-col :span="11">
                        <a-date-picker
                          value-format="yyyy-MM-DD"
                          v-model="searchForm.beginDate"
                          :getCalendarContainer="getPopupContainer"
                        />
                      </a-col>
                      <a-col :span="2" style="padding-left: 10px"> 至 </a-col>
                      <a-col :span="11">
                        <a-date-picker
                          value-format="yyyy-MM-DD"
                          v-model="searchForm.endDate"
                          :getCalendarContainer="getPopupContainer"
                        />
                      </a-col>
                    </a-row>
                  </a-form-item>
                </a-col>
                <a-form-model-item style="float: right">
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
          fixed: true,
        }"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <!--表格下部提示语-->
        <template slot="footer" slot-scope="">
          说明：统计规则为每天早8点统计结果为昨日统计量
        </template>
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import { getListForPage } from "@/api/energyManagement/energyStatistics/electricDailyReport.js";
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
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      //勾选框/选择框组件
      selectedRowKeys: [],
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
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          align: "center",
          width: 90,
        },
        {
          title: "日期",
          dataIndex: "reportDate",
          align: "center",
          // width: 140,
        },

        {
          title: "电表名称",
          dataIndex: "equipmentName",
          align: "center",
          // width: 100,
        },
        {
          title: "电表位号",
          dataIndex: "equipmentTagNo",
          align: "center",
          // width: 150,
        },
        {
          title: "用电量(kW·h)",
          dataIndex: "consumption",
          align: "center",
          // width: 200,
        },
        {
          title: "用电类型",
          dataIndex: "consumptionType",
          align: "center",
          // width: 200,
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

    //获得表格数据
    getList() {
      getListForPage(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
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
      if (this.searchForm) {
        this.searchForm.pageNum = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    //分页、排序、筛选变化时触发
    paginationChange(pagination) {
      this.searchForm.pageNum = pagination.current;
      this.searchForm.pageSize = pagination.pageSize;
      this.getList();
    },

    //点击查询中的重置，清空查询条件，重新加载表格数据
    resetClick() {
      this.searchForm = {};
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
