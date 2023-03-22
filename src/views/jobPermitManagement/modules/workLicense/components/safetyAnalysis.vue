<!--/***-->
<!--*工作前安全分析（JSA）表-->
<!--*日期：2022年9月16日 zxt-->
<!--**/-->
<template>
  <div>
    <h2 style="text-align: center">工作前安全分析（JSA）表</h2>
    <h4>
      <span style="margin-left: 100px; margin-right: 400px">制表日期：</span>
      <span style="margin-right: 100px">编码：</span>
      <span style="margin-right: 100px">序号：</span>
    </h4>
    <a-descriptions align="center" size="small" bordered class="d">
      <a-descriptions-item label="部门"> 1 </a-descriptions-item>
      <a-descriptions-item label="JSA分析组长"> 2 </a-descriptions-item>
      <a-descriptions-item label="JSA分析人员"> 2 </a-descriptions-item>
      <a-descriptions-item label="工作任务简述" :span="3">
        21<br />
        21<br />
      </a-descriptions-item>
      <a-descriptions-item label="作业类别" :span="3">
        213213123
      </a-descriptions-item>
      <a-descriptions-item label="所需工具、设备、材料" :span="3">
        Data disk type: MongoDB
      </a-descriptions-item>
    </a-descriptions>
    <a-table
      class="tb-br"
      rowKey="id"
      :row-key="(record) => record.id"
      :pagination="false"
      :scroll="{ x: 100 }"
      :columns="columns"
      :dataSource="dataSource"
      :openSelector="true"
    >
    </a-table>

    <a-collapse :defaultActiveKey="['1']">
        <template>
          <div class="step">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataSourceApproval: [],
      //页面下方表格的列属性
      columns: [
        {
          title: '工作步骤',
          dataIndex: 'step',
          width: 80,
          align: 'center',
        },

        {
          title: '确认的危害因素及潜在后果影响',
          dataIndex: 'factor',
          width: 120,
          align: 'center',
        },
        {
          title: '风险评估',
          dataIndex: 'num',
          width: 100,
          align: 'center',
          children: [
            {
              title: '暴露频率',
              dataIndex: 'num1',
              width: 100,
              align: 'center',
            },
            {
              title: '可能性',
              dataIndex: 'num2',
              width: 100,
              align: 'center',
            },
            {
              title: '严重度',
              dataIndex: 'num3',
              width: 100,
              align: 'center',
            },
            {
              title: '风险值',
              dataIndex: 'num4',
              width: 100,
              align: 'center',
            },
          ],
        },
        {
          title: '控制措施（包括现有的和建议）',
          dataIndex: 'num5',
          width: 120,
          align: 'center',
        },
        {
          title: '残余风险是否可以接受',
          dataIndex: 'num6',
          width: 80,
          align: 'center',
        },
      ],
      //表格中的数据
      dataSource: [
        {
          step: 1,
          factor: '111',
          num1: 2,
          num2:3,
          num3:1,
          num4:5,
          num5:'无',
          num6:'是'
        },
        {
          step: 2,
          factor: '111',
          num1: 3,
          num2:3,
          num3:3,
          num4:4,
          num5:'无',
          num6:'是'
        },
      ],
       stepConfiguration: {
        stepProgress: 2,
        stepList: [
          {
            title: '提出作业申请',
            name: '作业单位',
            dataTime: '2022/08/08',
          },
          {
            title: '分级审批、批准',
            name: '属地管理单位、相关部室及中心、决策机构',
            dataTime: '2022/08/10',
          },
          {
            title: '审批完成',
          },
        ],
      },
      columnsApproval: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 80,
        },
        {
          title: '审批人',
          dataIndex: 'person',
          width: 120,
        },
        {
          title: '单位名称',
          dataIndex: 'institution',
          width: 140,
        },
        {
          title: '审批日期',
          dataIndex: 'advice',
          width: 140,
        },
        {
          title: '审批意见',
          dataIndex: 'status',
          width: 140,
        },
        {
          title: '审批状态',
          dataIndex: 'time',
          width: 140,
        },
      ],
    }
  },
  methods: {
    callback(key) {
      console.log(key)
    },
  },
}
</script>

<style scoped lang="less">
.d {
  ::v-deep .ant-descriptions-item-label {
    width: 175px !important ;
  }
}
.tb-br{
  ::v-deep .ant-table-thead > tr > th, .ant-table-tbody
{
  white-space: pre-wrap !important  
}
}

</style>
