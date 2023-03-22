<template>
  <div class="stepModel">
    <a-form-model ref="form" :model="form" v-if="isShow">
      <a-col :span="19">
        <a-form-model-item label="审批意见">
          <a-textarea
            v-model="form.opinion"
            placeholder="请输入部门意见"
            :auto-size="{ minRows: 6, maxRows: 6 }"
          ></a-textarea>
        </a-form-model-item>
      </a-col>
      <a-col :span="5">
        <a-form-model-item>
          <a-radio-group
            style="padding-left: 10px"
            :default-value="1"
            v-model="form.type"
          >
            <a-radio :value="1"> 同意 </a-radio>
            <a-radio :value="0"> 驳回 </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-col>
    </a-form-model>
    <a-collapse :defaultActiveKey="['1']">
      <template>
        <div>
          <a-tabs>
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
              <steps :stepConfiguration="stepConfiguration" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-collapse>
  </div>
</template>
<script>
import steps from './steps.vue'
import { stepData, historyList } from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'
export default {
  name: 'stepsModel',
  components: { steps },
  props: {
    isShow: {
      type: Boolean
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      form: {
        opinion: '',
        type: 1
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
      columnsApproval: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1}`,
          width: 50,
        },
        {
          title: "审批人员",
          dataIndex: "executorName",
          width: 150
        },
        {
          title: "操作说明",
          dataIndex: "executeResult",
          width: 150,
          customRender: (value, row, index) => {
            return {
              children: value == '2' ? "同意" : "驳回",
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: "审批意见",
          dataIndex: "opinion",
          width: 150,
        },
        {
          title: "审批时间",
          dataIndex: "executeTime",
          width: 150,
        },
      ],
      //审批历史列表
      dataSourceApproval: [],
      // 审批进度
      stepConfiguration: {}
    }
  },
  watch: {
    'id': {
      immediate: true,
      handler(val) {
        if (val) {
          this.init()
        }
      }
    }
  },
  methods: {
    init() {
      this.getStepConfiguration()
      this.getDataSourceApproval()
    },
    getStepConfiguration() {
      stepData({ businessId: this.id }).then(res => {
        this.stepConfiguration = res.body || {}
      })
    },
    //审批历史列表
    getDataSourceApproval() {
      historyList({ businessId: this.id }).then(res => {
        this.dataSourceApproval = res.body.data || []
        this.dataSourceApproval.forEach((item,index) => {
          item.id = index
        })
      })
    },
  }
}
</script>
<style scoped>
.stepModel {
  margin-bottom: 10px;
}
.ant-form {
  padding: 0 !important;
}
.ant-collapse{
  min-height: 280px;
  border-bottom:1px!important;
  width: 100%;
}
.ant-tabs-tabpane{
  overflow: auto!important;
}
</style>
