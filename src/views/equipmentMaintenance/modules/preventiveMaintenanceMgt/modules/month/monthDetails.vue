<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            {
              value: 'exportComponent',
              url: '/monthly/exportExcel',
              params: { MonthlyPlanNo: this.$route.query.monthlyplanno },
              accept: '.xlsx',
            },
            {
              value: 'Go',
              name: '返回',
              icon: 'Go-icon',
              isPower: false,
              clickName: 'go',
            },
          ]"
          @go="go"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <a-form-model v-model="form" :layout="'inline'">
        <a-col :span="6">
          <a-form-model-item
            :labelCol="{ style: 'width: 180px' }"
            label="月度计划编码:"
          >
            <a-input
              ref="select"
              v-model="this.$route.query.monthlyplanno"
              :disabled="true"
            ></a-input>
          </a-form-model-item>
        </a-col>
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
          <template slot="workOrder" slot-scope="row">
            <pe-button
              :include="[
                {
                  value: 'Dispatch',
                  clickName: 'dispatch',
                  name: '派工',
                  icon: '',
                  style: ['btn_link'],
                  type: 'link',
                  disabled:$audit.dispatchUserId(row.createdUserID)
                },
              ]"
              @dispatch="dispatch(row)"
            ></pe-button>
            <!-- <span class="edit" @click="workOrderSee(row)">派工</span> -->
          </template>
        </dc-table>
        <div>
            <stepsModel ref="stepsModel" :isShow="false" :id="this.$route.query.id" />
        </div>
      </a-form-model>
      <!-- 派工弹框 -->
      <dispatchModel
        ref="dispatchModel"
        :visible.sync="dispatchVisible"
        :typeModel="{ page: 'dis', type: 'edit' }"
        :title="'月度检维修-派工'"
      />
      <!-- 工单弹框 -->
      <!-- <template>
        <div>
          <a-modal
            title="Title"
            :visible="workOrderVisible"
            @cancel="workOrderCancel"
            @ok="workOrderSave"
          >
            <template>
              <div>
                <a-tabs default-active-key="1" @change="callback">
                  <a-tab-pane key="1" tab="工单申请">
                    Content of Tab Pane 1
                  </a-tab-pane>
                  <a-tab-pane key="2" tab="作业计划" force-render>
                    Content of Tab Pane 2
                  </a-tab-pane>
                  <a-tab-pane key="3" tab="作业执行">
                    Content of Tab Pane 3
                  </a-tab-pane>
                  <a-tab-pane key="4" tab="作业验收" force-render>
                    Content of Tab Pane 2
                  </a-tab-pane>
                  <a-tab-pane key="5" tab="会签记录">
                    Content of Tab Pane 3
                  </a-tab-pane>
                </a-tabs>
              </div>
            </template>
          </a-modal>
        </div>
      </template> -->

      <dc-Model
        v-model="visibleSpareparts"
        :modelConfig="modelConfigSpareparts"
      >
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
    </template>
  </Breadcrumb>
</template>
<script>
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
import dispatchModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/dispatchModel.vue";
import { queryDetailsByMonthlyPlanNo } from "@/api/monthMaintenance";
import { getListById } from "@/api/sparesprt";
export default {
  components: {
    stepsModel,
    dispatchModel,
  },
  filters: {
    statusFilter(value) {
      switch (value) {
        case "M1":
          return "已保存";
          break;
        case "M2":
          return "已提交";
          break;
        case "M3":
          return "审批中";
          break;
        case "M4":
          return "已审批";
          break;
        case "M6":
          return "作业中";
          break;
        default:
          return "已拒绝";
          break;
      }
    },
  },
  data() {
    return {
      labelCol: { span: 4 },
      dispatchVisible: false,
      selectedRowKeysDetails: [],
      workOrderVisible: false,
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
          align: "center",
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 150,
          align: "center",
        },
        {
          title: "物资编码",
          dataIndex: "materialcode",
          width: 150,
          align: "center",
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
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 150,
          align: "center",
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
          align: "center",
        },
        {
          title: "是否在账",
          dataIndex: "whetheraccountedequipment",
          width: 70,
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "devicename",
          width: 100,
          align: "center",
        },
        // {
        //   title: "设备编码",
        //   dataIndex: "deviceno",
        //   width: 150,
        // },
        {
          title: "设备位号",
          dataIndex: "devicetagno",
          width: 100,
          align: "center",
        },
        {
          title: "计划检修日期",
          dataIndex: "planmaintenancedatetime",
          width: 150,
          align: "center",
        },
        {
          title: "责任人",
          dataIndex: "personincharge",
          width: 80,
          align: "center",
        },
        {
          title: "所属区域",
          dataIndex: "areaName",
          width: 100,
          align: "center",
        },
        {
          title: "检维修问题信息描述",
          dataIndex: "maintenancedescription",
          width: 140,
          align: "center",
        },
        {
          title: "计划维修天数",
          dataIndex: "plannedmaintenancetime",
          width: 100,
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "majorName",
          width: 130,
          align: "center",
        },
        {
          title: "作业内容",
          dataIndex: "operationcontent",
          width: 100,
          align: "center",
        },
        {
          title: "备品备件清单",
          // dataIndex: 'sparePart',
          scopedSlots: { customRender: "sparePart" },
          width: 100,
          align: "center",
        },
        {
          title: "预估费用（元）",
          dataIndex: "plannedcost",
          width: 120,
          align: "center",
        },
        {
          title: "是否影响外输/接卸船",
          dataIndex: "whetheraffectexportorship",
          width: 150,
          align: "center",
        },
        {
          title: "需工艺条件",
          dataIndex: "requiredprocesscondition",
          width: 100,
          align: "center",
        },
        {
          title: "维修单位名称",
          dataIndex: "inspectioncompanyname",
          width: 100,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 100,
          align: "center",
        },
        {
          title: "操作",
          width: 100,
          fixed: "right",
          scopedSlots: { customRender: "workOrder" },
          align: "center",
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
      visibleSpareparts: false,
      selectedRowKeys: [],
    };
  },
  mounted() {
    this.getList();
    // this.getMonthPlanAudio()
    //this.getSpareparts()
  },
  methods: {
    // 派工点击事件
    dispatch(row) {
      this.dispatchVisible = true;
      row.changeNo = row.id
      this.$nextTick(() => {
        this.$refs.dispatchModel.handleOpen(row);
      });
    },
    // 用编辑接口修改派工状态
    modifyDispatchStatus(id){
      const data = {
        id,
        recordStatus:'M6'
      }
      // editDispatData(data).then(()=>{
        this.getList()
      // })
    },
    //     记录状态recordStatus工单编号recordStatusNo接收站负责人PersonInCharge
    // 责任人 personInCharge是否有检维修规程 recordStatusIf
    // 检维修名称 -->recordStatusName作业区域area设备名称deviceName
    // 设备位号deviceTagNo"
    // "建议计划作业日期"
    // <!-- PlannedMaintenanceTime 计划维修时长 -->
    // <!-- PlanMaintenanceDateTime 计划检修日期planMaintenanceDateTime"
    // <a-form-model-item label="作业单位">
    //  InspectionC
    // 工单
    workOrderSee(row) {
      this.workOrderVisible = true;
    },
    workOrderCancel() {
      this.workOrderVisible = false;
    },
    workOrderSave() {
      this.workOrderVisible = false;
    },
    onSelectChangeDetails(selectedRowKeysDetails) {
      this.selectedRowKeysDetails = selectedRowKeysDetails;
    },
    // 月度计划审批
    // getMonthPlanAudio(id,type) {
    //     console.log(id,type, 22222)
    //     monthPlanAudio({ id:id,type:type }).then((res) => {
    //         this.dataSourceApproval = res.body.data;
    //         console.log(this.dataSourceApproval, 234235235)
    //         this.pagination.current = res.body.pageIndex
    //         this.pagination.total = res.body.total
    //         this.pagination.pageSize = res.body.pageSize
    //         // console.log(res.body.data[0].sparePart, "popdatasource");
    //     })
    // },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    callback(key) {
      console.log(key);
    },
    go() {
      this.$router.push({
        path: "/monthMaintenance",
      });
    },
    // exportExcel() {
    //     exportExcel({ pageNum: 1, pageSize: 10, MonthlyPlanNo: this.$route.query.monthlyplanno }).then((res) => {
    //         console.log('exportExcel')
    //     })
    // },
    getList(pageNum = 1, pageSize = 10, monthlyplanno = this.$route.query.monthlyplanno) {
      console.log(this.$route.query.monthlyplanno, '222sfdsv22');
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
        // console.log(res.body.data[0].sparePart, "popdatasource");
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
</style>
