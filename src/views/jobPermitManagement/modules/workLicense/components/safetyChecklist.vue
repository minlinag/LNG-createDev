<!--/***-->
<!--*安全检查表-->
<!--*日期：2022年9月26日 zxt-->
<!--**/-->
<template>
  <div>
    <h2 style="text-align: center">安全检查表</h2>
    <h4 class="bh">编号</h4>
   
    <a-table
      :scroll="{ x: 50 }"
      :columns="columns"
      :dataSource="dataSource"
      :openSelector="false"
      :pagination="false"
    >
      <template slot="operation" slot-scope="row, text">
        <a-radio-group v-model="text.deviceLubricationType">
          <a-radio :value="1"> 是 </a-radio>
          <a-radio :value="2"> 不涉及 </a-radio>
        </a-radio-group>
      </template>
    </a-table>

    <a-descriptions align="center" size="small" bordered class="d">
      <a-descriptions-item label="签字面板" :span="3">
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        <p style="text-align: right">负责人： 年 月 日 时 分 秒</p>
      </a-descriptions-item>
    </a-descriptions>

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
      row: '',
      dataSourceApproval: [],
      dataSource: [
        {
          'checkItems':'检查项一',
          'compliance':1
        }
      ],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
          width: 100,
          align: 'center',
        },
        {
          title: '检查项',
          dataIndex: 'checkItems',
        },
        {
          title: '符合/不符合',
          dataIndex: 'compliance',
          scopedSlots: { customRender: 'operation' },
          width:150,
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
  created() {
  },
  methods: {
    onChange() {},
    },
    callback(key) {
      console.log(key)
    },
}
</script>

<style scoped lang="less">
.bh {
  width: 100%;
  text-align: right;
  padding-right: 100px;
}
.d {
  ::v-deep .ant-descriptions-item-label {
    width: 150px !important ;
  }
}

</style>
