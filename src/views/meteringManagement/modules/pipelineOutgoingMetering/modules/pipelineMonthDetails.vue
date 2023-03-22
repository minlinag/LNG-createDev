<template>
  <Breadcrumb>
    <template slot="appMain">
      <!-- <a-collapse :defaultActiveKey="['1']">
            <a-collapse-panel key="1" header="管道外输月报详情"> -->
      <div slot="extra">
        <a-button
          class="buttonType"
          :style="{ marginLeft: '8px' }"
          type="primary"
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
      popovervisible: false,
      form: {},
      columns: [
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
          title: "时间",
          dataIndex: "date",
          width: 180,
        },
        {
          title: "月报类型",
          dataIndex: "q",
          width: 180,
        },
        {
          title: "编号",
          dataIndex: "q6",
          width: 180,
        },
        {
          title: "计划外输量(Nm3)",
          dataIndex: "remark1",
          width: 150,
        },
        {
          title: "计划外输量(t)",
          dataIndex: "q7",
          width: 180,
        },
        {
          title: "实际外输量(Nm3)",
          dataIndex: "remark2",
          width: 150,
        },
        {
          title: "实际外输量(t)",
          dataIndex: "q1",
          width: 180,
        },
        {
          title: "年累计量(Nm3)",
          dataIndex: "remar3k",
          width: 150,
        },
        {
          title: "年累计量(t)",
          dataIndex: "q8",
          width: 180,
        },
        {
          title: "合计",
          dataIndex: "remark",
          width: 150,
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
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    back() {
      this.$router.push({
        path: "/pipelineOutgoingMonth",
      });
    },
  },
};
</script>
<style scoped lang="less">
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