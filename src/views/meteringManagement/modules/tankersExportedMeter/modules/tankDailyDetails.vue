<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
        <a-col :span="6">
          <a-form-model-item
            :labelCol="{ style: 'width: 180px' }"
            label="月度计划编码:"
          >
            <a-input
              ref="select"
              v-model="this.$route.params.id"
              :disabled="true"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <!-- <a-collapse :defaultActiveKey="['1']">
        <a-collapse-panel key="1" header="槽车装车日报"> -->
      <div slot="extra">
        <!-- 导出 -->
        <ExportComponents
          :url="'/monthly/exportExcel'"
          :params="{ MonthlyPlanNo: $route.params.id }"
        >
        </ExportComponents>
        <a-button
          class="buttonType"
          :style="{ marginLeft: '8px' }"
          @click.stop="back"
        >
          返回
        </a-button>
      </div>
      <dc-table
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
      >
        -->
        <template slot="sparePart" slot-scope="row">
          <span class="edit" @click="lookbpbj(row)">查看</span>
        </template>
      </dc-table>
      <!-- </a-collapse-panel>  
      </a-collapse> -->
      <a-collapse :defaultActiveKey="['1']">
        <template>
          <div>
            <a-tabs default-active-key="1" @change="callback">
              <a-tab-pane key="1" tab="审批记录">
                <dc-table
                  :scroll="{ x: 100, y: 250 }"
                  :columns="columnsApproval"
                  :dataSource="dataSourceApproval"
                  rowKey="id"
                >
                </dc-table>
              </a-tab-pane>
              <a-tab-pane key="2" tab="全流程展示" force-render>
                <div class="step">
                  <a-steps :current="stepConfiguration.stepProgress">
                    <a-step
                      v-for="(item, index) in stepConfiguration.stepList"
                      :key="index"
                    >
                      <template slot="title">
                        {{ item.title }}
                      </template>
                      <div slot="description" class="descriptionBox">
                        <div>{{ item.name }}</div>
                        <div>{{ item.dataTime }}</div>
                      </div>
                    </a-step>
                  </a-steps>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </template>
      </a-collapse>
    </template>
  </Breadcrumb>
</template>
<script>
import { queryDetailsByMonthlyPlanNo } from "@/api/monthMaintenance";
import { getListById } from "@/api/sparesprt";
// import {monthPlanAudio} from '@/api/PublicInterface'
export default {
  data() {
    return {
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
      // 审批记录分页
      // paginationApproval: {
      //     current: 0,
      //     // defaultCurrent: 1,
      //     total: 0, // 总数
      //     showSizeChanger: true,
      //     pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
      //     showTotal: total => `共 ${total} 条`, // 分页中显示总的数据
      //     // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
      //     pageSize: 0 // 每页条数，所有页设置统一的条数
      // },
      popovervisible: false,
      form: {},
      modelConfigSpareparts: {
        width: "950px",
        title: "备品备件清单 ",
        cancelText: false,
        footer: "", //是否展示页脚
      },
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
        },
        {
          title: "编号",
          dataIndex: "outsourceCompany",
          // width: 140,
        },
        {
          title: "日期",
          dataIndex: "date",
          // width: 100,
        },
        {
          title: "装车数量",
          dataIndex: "count",
          // width: 150,
        },
        {
          title: "日供气量合计（t）",
          dataIndex: "mainBusinessDescription",
          // width: 150,
        },
        {
          title: "日供气量合计（万Nm³）",
          dataIndex: "createdDateTime",
          // width: 200,
        },
        {
          title: "平均密度（Kg/Nm³）",
          dataIndex: "p",
          // width: 100,
        },
        {
          title: "填报人",
          dataIndex: "person",
          // width: 150,
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "statusOprion" },
          // width: 100,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 120,
          fixed: "right",
        },
      ],
      columnsApproval: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
        },
        {
          title: "审批人",
          dataIndex: "person",
          width: 180,
        },
        {
          title: "单位名称",
          dataIndex: "institution",
          width: 150,
        },
        {
          title: "审批日期",
          dataIndex: "result",
          width: 150,
        },
        {
          title: "审批意见",
          dataIndex: "advice",
          width: 150,
        },
        {
          title: "审批状态",
          dataIndex: "time",
          width: 150,
        },
      ],
      sparepartsDataSource: [],
      dataSource: [],
      dataSourceApproval: [],
      stepConfiguration: {
        stepProgress: 0,
        stepList: [
          {
            title: "流程发起",
            name: "张三",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "销售公司负责人",
            name: "李四",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "审批完成",
          },
        ],
      },
      visibleSpareparts: false,
      selectedRowKeys: [],
    };
  },
  mounted() {},
  methods: {
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    callback(key) {
      console.log(key);
    },
    back() {
      this.$router.push({
        path: "/tankTruckLoadingDaily",
      });
    },
    paginationChange(pagination) {
      this.getList(pagination.current, pagination.pageSize);
    },
  },
};
</script>
<style scoped>
.step {
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 20px;
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