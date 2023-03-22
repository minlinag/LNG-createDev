<template>
  <Breadcrumb>
    <template slot="appMain">
      <!-- <a-collapse :defaultActiveKey="['1']">
        <a-collapse-panel key="1" header="管道外输日报详情"> -->
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
      <div>
        <!-- <a-tabs default-active-key="1" @change="callback">
              <a-tab-pane key="1" tab="交接凭证"> -->
        <dc-table
          :scroll="{ x: 100 }"
          :columns="columnsVoucher"
          :dataSource="dataSourceVoucher"
          rowKey="id"
        >
        </dc-table>
        <!-- </a-tab-pane> -->
        <a-tab-pane key="2" tab="气质分析报告" force-render>
          <dc-table
            :scroll="{ x: 100 }"
            :columns="columnsRep"
            :dataSource="dataSourceRep"
            rowKey="id"
          >
          </dc-table>
        </a-tab-pane>
        <!-- </a-tabs> -->
      </div>
      <!-- </a-collapse-panel>
      </a-collapse> -->
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
      columnsVoucher: [
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
          title: "气量(Nm3)",
          dataIndex: "q",
          width: 180,
        },
        {
          title: "气量(t)",
          dataIndex: "q2",
          width: 180,
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 150,
        },
      ],
      columnsRep: [
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
          title: "取样地点",
          dataIndex: "area",
          width: 180,
        },
        {
          title: "分析日期",
          dataIndex: "date",
          width: 180,
        },
        {
          title: "编号",
          dataIndex: "code",
          width: 150,
        },
        {
          title: "CH4",
          dataIndex: "CH4",
          width: 150,
        },
        {
          title: "C2H6",
          dataIndex: "C2H6",
          width: 180,
        },
        {
          title: "C3H8",
          dataIndex: "C3H8",
          width: 180,
        },
        {
          title: "IC4H10",
          dataIndex: "IC4H10",
          width: 150,
        },
        {
          title: "NC4H10",
          dataIndex: "NC4H10",
          width: 150,
        },
        {
          title: "C5H12",
          dataIndex: "C5H12",
          width: 180,
        },
        {
          title: "IC5H12",
          dataIndex: "IC5H12",
          width: 180,
        },
        {
          title: "NC5H12",
          dataIndex: "NC5H12",
          width: 150,
        },
        {
          title: "N2",
          dataIndex: "N2",
          width: 150,
        },
        {
          title: "C6+",
          dataIndex: "C6+",
          width: 180,
        },
        {
          title: "CO2",
          dataIndex: "CO2",
          width: 180,
        },
        {
          title: "密度(Kg/m3)",
          dataIndex: "p",
          width: 150,
        },
        {
          title: "硫化氢(mg/m3)",
          dataIndex: "SH3",
          width: 150,
        },
        {
          title: "总硫(以硫计)(mg/m3)",
          dataIndex: "S",
          width: 180,
        },
        {
          title: "水露点(oC)",
          dataIndex: "H2O",
          width: 180,
        },
        {
          title: "高位发热量(MJ/m3)",
          dataIndex: "hot",
          width: 150,
        },
        {
          title: "备注",
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
      dataSourceApproval: [],
      dataSourceRep: [],
      dataSourceVoucher: [],
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
    back() {
      this.$router.push({
        path: "/pipelineOutgoingDaily",
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