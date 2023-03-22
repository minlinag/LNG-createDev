<template>
  <a-modal
    :title="title"
    :visible="approvalVisible"
    :footer="null"
    @cancel="cancelClick"
    class="from-style bigModel"
    :maskClosable="false"
    destroyOnClose
  >
    <a-form-model v-model="form">
      <a-row>
        <a-col :span="12" v-if="isShowMonth">
          <a-form-model-item label="月度计划编码:">
            <a-input
              ref="select"
              v-model="form.monthlyPlanNo"
              :disabled="true"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" v-if="isShowYear">
          <a-form-model-item label="年度计划编码:">
            <a-input
              ref="select"
              v-model="form.annualplanno"
              :disabled="true"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <dc-table
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeysDetails,
          onChange: onSelectChangeDetails,
        }"
      >
        <template slot="sparePart" slot-scope="row">
          <span class="edit" @click="lookbpbj(row)">查看</span>
        </template>
      </dc-table>
      <!-- 审批 -->
      <div>
        <div v-if="seenApproval">
          <stepsModel ref="stepsModel" :isShow="true" :id="this.formData.id" />
        </div>
      </div>
    </a-form-model>
    <div class="ant-modal-footer" v-if="seenApproval">
      <a-button type="primary" @click="passClick"> 确认 </a-button>
      <a-button @click="cancelClick"> 返回 </a-button>
    </div>
    <dc-Model v-model="visibleSpareparts" :modelConfig="modelConfigSpareparts">
      <dc-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        rowKey="id"
        :scroll="{ x: 100 }"
        :columns="columnsSpareparts"
        :dataSource="sparepartsDataSource"
        :openSelector="false"
      >
      </dc-table>
    </dc-Model>
  </a-modal>
</template>
<script>
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
import { queryDetailsByMonthlyPlanNo } from "@/api/monthMaintenance";
import { getListById } from "@/api/sparesprt";
export default {
  components: { stepsModel },
  props: ["approvalVisible", "formData", "title"],
  watch: {
    approvalVisible: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (this.$route.path == "/monthMaintenance") {
            this.form.monthlyPlanNo = this.formData.planMonthNo;
            this.isShowMonth = true;
          } else {
            this.form.annualplanno = this.formData.planYearNo;
            this.isShowYear = true;
          }
        }
      },
    },
  },
  data() {
    return {
      isShowMonth: false,
      isShowYear: false,
      labelCol: { span: 4 },
      seenApproval: true,
      selectedRowKeysDetails: [],
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
      form: {
        monthlyPlanNo: "",
        annualplanno: "",
        recordStatus: "",
        area: "",
        recordStatusNo: "",
        personInCharge: "",
        recordStatusIf: "",
        recordStatusName: "",
        deviceName: "",
        deviceTagNo: "",
        planMaintenanceDateTime: "",
        inspectionCompanyName: "",
      },
      modelConfigSpareparts: {
        width: "950px",
        title: "备品备件清单 ",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      // 备品备件
      columnsSpareparts: [
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
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 150,
        },
        {
          title: "物资编码",
          dataIndex: "materialcode",
          width: 150,
        },
        {
          title: "规格/材质",
          dataIndex: "specificationOrMaterial",
          width: 150,
        },
        {
          title: "数量",
          dataIndex: "existingnumber",
          width: 150,
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 150,
        },
      ],
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
          title: "是否在账",
          dataIndex: "whetheraccountedequipment",
          width: 70,
        },
        {
          title: "设备名称",
          dataIndex: "devicename",
          width: 150,
        },
        {
          title: "设备编码",
          dataIndex: "deviceno",
          width: 150,
        },
        {
          title: "设备位号",
          dataIndex: "devicetagno",
          width: 150,
        },
        {
          title: "计划检修日期",
          dataIndex: "planmaintenancedatetime",
          width: 180,
        },
        {
          title: "责任人",
          dataIndex: "personincharge",
          width: 150,
        },
        {
          title: "所属区域",
          dataIndex: "areaName",
          width: 150,
        },
        {
          title: "检维修问题信息描述",
          dataIndex: "maintenancedescription",
          width: 150,
        },
        {
          title: "计划维修天数",
          dataIndex: "plannedmaintenancetime",
          width: 150,
        },
        {
          title: "专业",
          dataIndex: "majorName",
          width: 100,
        },
        {
          title: "作业内容",
          dataIndex: "operationcontent",
          width: 150,
        },
        {
          title: "备品备件清单",
          // dataIndex: 'sparePart',
          scopedSlots: { customRender: "sparePart" },
          width: 150,
        },
        {
          title: "预估费用（元）",
          dataIndex: "plannedcost",
          width: 150,
        },
        {
          title: "是否影响外输/接卸船",
          dataIndex: "whetheraffectexportorship",
          width: 150,
        },
        {
          title: "需工艺条件",
          dataIndex: "requiredprocesscondition",
          width: 150,
        },
        {
          title: "维修单位名称",
          dataIndex: "inspectioncompanyname",
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
          title: "执行步骤",
          dataIndex: "step",
          width: 180,
        },
        {
          title: "审批人员",
          dataIndex: "person",
          width: 180,
        },
        {
          title: "组织机构",
          dataIndex: "institution",
          width: 150,
        },
        {
          title: "操作说明",
          dataIndex: "operate",
          width: 150,
        },
        {
          title: "审批结果",
          dataIndex: "result",
          width: 150,
        },
        {
          title: "审批意见",
          dataIndex: "advice",
          width: 150,
        },
        {
          title: "审批时间",
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
            title: "月度计划提交",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "本部审核",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "生产运营中心审核",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "完成",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
        ],
      },
      visibleSpareparts: false,
      selectedRowKeys: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.formData.planMonthNo;
    });
    this.$nextTick(() => {
      this.formData.planYearNo;
    });
    this.getList();
  },
  methods: {
    onSelectChangeDetails(selectedRowKeysDetails) {
      this.selectedRowKeysDetails = selectedRowKeysDetails;
    },
    // 月度计划审批
    passClick() {
      this.$emit(
        "pass",
        {
          type: this.$refs.stepsModel.form.type,
          opinion: this.$refs.stepsModel.form.opinion,
          id: this.formData.id,
        },
        (res) => {
          this.$emit("close");
        }
      );
    },
    cancelClick() {
      this.formData.id = "";
      this.$emit("close");
    },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    callback(key) {
      console.log(key);
    },
    getList(
      pageNum = 1,
      pageSize = 10,
      monthlyplanno = this.form.monthlyPlanNo
    ) {
      console.log(this.form.monthlyPlanNo, 22222);
      queryDetailsByMonthlyPlanNo({
        pageNum: pageNum,
        pageSize: pageSize,
        monthlyplanno: monthlyplanno,
      }).then((res) => {
        this.dataSource = res.body.data;
        console.log(this.dataSource, 234235235);
        this.sparePartDataSource =
          res.body.data.length !== 0 ? res.body.data[0].sparePart : null;
        this.pagination.current = res.body.pageIndex;
        this.pagination.total = res.body.total;
        this.pagination.pageSize = res.body.pageSize;
      });
    },
    //获取备品备件列表
    getSpareparts(row) {
      console.log("bpbj");
      getListById({ ID: row.id }).then((res) => {
        this.sparepartsDataSource = res.body;
      });
    },
    paginationChange(pagination) {
      this.getList(pagination.current, pagination.pageSize);
    },
    lookbpbj(row) {
      this.visibleSpareparts = true;
      this.getSpareparts(row);
    },
  },
};
</script>
<style scoped>
.descriptionBox {
  margin-top: 10px;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
.operate_button {
  text-align: center;
  margin-top: 20px;
}
</style>
