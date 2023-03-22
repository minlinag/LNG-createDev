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
              <a-table
                :scroll="{ x: 100, y: 250 }"
                :columns="columnsApproval"
                :dataSource="dataSourceApproval"
                rowKey="id"
                :pagination="false"
              >
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-collapse>
  </div>
</template>
<script>
import { getApprovalRecordList } from "@/api/tankWagonManage/approvalRecord.js";
export default {
  name: "approvalModel",
  props: {
    isShow: {
      type: Boolean,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      form: {
        opinion: "",
        type: 1,
      },

      columnsApproval: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: 50,
          align: "center",
        },
        {
          title: "审批人员",
          dataIndex: "createdUser",
          width: 150,
          align: "center",
        },
        {
          title: "操作说明",
          dataIndex: "operateInstructions",
          width: 150,
          align: "center",
        },
        {
          title: "审批意见",
          dataIndex: "comments",
          width: 150,
          align: "center",
        },
        {
          title: "审批时间",
          dataIndex: "createdDateTime",
          width: 150,
          align: "center",
        },
      ],
      //审批历史列表
      dataSourceApproval: [],
    };
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.init();
      },
    },
  },
  methods: {
    init() {
      this.getDataSourceApproval();
    },

    //审批历史列表
    getDataSourceApproval() {
      if (this.id) {
        getApprovalRecordList({
          businessId: this.id,
          pageNum: "1",
          pageSize: "9999",
        }).then((res) => {
          this.dataSourceApproval = res.body.data || [];
        });
      }
    },
  },
};
</script>
<style scoped>
.stepModel {
  margin-bottom: 10px;
}
.ant-form {
  padding: 0 !important;
}
</style>