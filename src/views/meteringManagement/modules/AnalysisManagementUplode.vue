<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout>
      <a-layout-content>
        <a-card>
          <a-divider
            orientation="left"
            style="font-weight: bolder; margin-top: 0rem"
          >
            基础信息
          </a-divider>
          <a-form-model :model="AnnualData" ref="Form">
            <a-row>
              <a-col :span="8">
                <a-form-model-item
                  label="编号："
                  :labelCol="{ style: 'width: 100px' }"
                >
                  <a-input
                    disabled
                    v-model="AnnualData.createdUser"
                    placeholder="请输入编号"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="计划分析时间："
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-date-picker
                    style="width: 100%"
                    disabled
                    v-model="AnnualData.createdDateTime"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    placeholder="请选择日期"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="取样点："
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    disabled
                    v-model="AnnualData.createdUser"
                    placeholder="请输入取样点"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="检验样品："
                  :labelCol="{ style: 'width: 100px' }"
                >
                  <a-input
                    disabled
                    v-model="AnnualData.createdUser"
                    placeholder="请输入检验样品"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="分析项目："
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    disabled
                    v-model="AnnualData.createdUser"
                    placeholder="请输入分析项目"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="申请部门："
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    disabled
                    v-model="AnnualData.createdUser"
                    placeholder="请输入申请部门"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="指标要求："
                  :labelCol="{ style: 'width: 80px' }"
                >
                  <a-textarea
                    placeholder="请输入"
                    v-model="AnnualData.executorOpinion"
                    :auto-size="{ minRows: 2, maxRows: 2 }"
                    disabled
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="申请时间："
                  :labelCol="{ style: 'width: 100px' }"
                >
                  <a-date-picker
                    style="width: 100%"
                    disabled
                    v-model="AnnualData.createdDateTime"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    placeholder="请选择日期"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="申请人："
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    disabled
                    v-model="AnnualData.createdUser"
                    placeholder="请输入申请人"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-card>
        <a-card style="margin-top: 0.5rem">
          <a-divider
            orientation="left"
            style="font-weight: bolder; margin-top: 0rem"
          >
            检验报告
          </a-divider>
          <a-form-model :model="AnnualData" ref="Form">
            <a-row>
              <a-col :span="8">
                <a-form-model-item
                  label="检验报告上传："
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <file-upload
                    :Text="'上传文件'"
                    @fileChange="fileListChange"
                    :fileQuantity="1"
                    :echoList="flieChanges"
                    ref="importConpontsDataRef"
                  ></file-upload>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="上传人："
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    disabled
                    v-model="AnnualData.createdUser"
                    placeholder="请输入上传人"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="上传时间："
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-date-picker
                    style="width: 100%"
                    disabled
                    v-model="AnnualData.createdDateTime"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    placeholder="请选择日期"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-button style="float: right; margin-top: -1rem">提交</a-button>
          </a-form-model>
        </a-card>
        <a-card style="margin-top: 0.5rem">
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
        </a-card>
      </a-layout-content>
      <a-layout-footer
        :style="{
          margin: '5px',
          padding: '10px',
          background: '#fff',
          textAlign: 'center',
        }"
      >
        <!-- textAlign: "center"; -->
        <a-button @click="back"> 返回 </a-button>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import {} from "@/api/meteringManagement/AnalysisManagement.js";
import {
  stepData,
  historyList,
} from "@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js";
import fileUpload from "@/components/upLoad/fileUpload";
import steps from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/steps.vue";

const columnsApproval = [
  {
    title: "序号",
    customRender: (text, record, index) =>
      `${(this.pagination.current - 1) * this.pagination.pageSize + index + 1}`,
    width: 50,
  },
  {
    title: "审批人员",
    dataIndex: "executorName",
    width: 150,
  },
  {
    title: "单位名称",
    dataIndex: "opinion",
    width: 150,
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
  {
    title: "审批状态",
    dataIndex: "executeTime",
    width: 150,
  },
];
export default {
  components: { fileUpload, steps },
  data() {
    return {
      columnsApproval: columnsApproval,
      AnnualData: {},
      flieChanges: [],
      dataSourceApproval: [],
      stepConfiguration: {},
    };
  },
  mounted() {
    this.getDataSourceApproval();
    this.getStepConfiguration();
    // this.getList();
  },
  methods: {
    // 上传
    fileListChange(val) {
      this.flieChanges = val;
    },
    // Tab
    callback() {},
    //审批历史列表
    getDataSourceApproval() {
      historyList({ businessId: this.AnnualData.id }).then((res) => {
        this.dataSourceApproval = res.body.data || [];
        this.dataSourceApproval.forEach((item, index) => {
          item.id = index;
        });
      });
    },
    getStepConfiguration() {
      stepData({ businessId: this.AnnualData.id }).then((res) => {
        this.stepConfiguration = res.body || {};
      });
    },
    back() {
      this.$router.push({ path: "/AnalysisManagement" });
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
