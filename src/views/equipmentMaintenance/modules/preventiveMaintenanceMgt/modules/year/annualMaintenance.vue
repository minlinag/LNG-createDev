<!-- 年度检维修计划管理 -->
<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[{ value: 'Add', clickName: 'addAnnualInspectionPlan' }]"
        @addAnnualInspectionPlan="addAnnualInspectionPlan"
      >
      </pe-button>
    </template>
    <template slot="appMain">
      <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
        <a-col :span="6">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="计划年度:"
          >
            <a-select
              ref="select"
              v-model="yearSelect"
              placeholder="请选择计划年度"
              @change="handleChange"
              :options="yearOption"
            ></a-select>
          </a-form-model-item>
        </a-col>
        <a-form-model-item>
          <a-button v-Query class="buttonType" type="primary" @click="search">
            查询
          </a-button>
          <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
        </a-form-model-item>
      </a-form-model>

      <dc-table
        rowKey="id"
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
        :pagination="pagination"
        @change="paginationChange"
      >
        <template slot="status" slot-scope="text, record">
          {{ text | statusFilter }}
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'addYear',
                icon: '',
                style: ['btn_link'],
                disabled:
                  row.recordStatus === 'Y2' ||
                  row.recordStatus === 'Y3' ||
                  row.recordStatus === 'Y4',
              },
              {
                value: 'Approval',
                name: '审批',
                isPower: false,
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.todoUserCode),
              },
              {
                value: 'SUBMIT',
                clickName: 'submit',
                disabled: row.recordStatus != 'Y1' && row.recordStatus != 'Y5',
                type: 'link',
                isPower: false,
                icon: '',
                style: ['btn_link'],
              },
              {
                value: 'View',
                name: '查看',
                type: 'link',
                clickName: 'viewJump',
                icon: '',
                style: ['btn_link'],
                isPower: false,
              },
            ]"
            @addYear="addYear(row)"
            @approval="approval(row)"
            @submit="submit(row)"
            @viewJump="viewJump(row)"
          ></pe-button>
        </template>
      </dc-table>
      <!-- 审批弹框 -->
      <approval-form
        :approvalVisible="approvalVisible"
        :formData="formData"
        @pass="passChange"
        :title="title"
        @close="annualApproval"
      >
      </approval-form>
    </template>
  </Breadcrumb>
</template>
<script>
import approvalForm from "../month/components/approvalForm.vue";
import {
  findYearList,
  addAnnualInspectionPlan,
  yearPlanAudio,
  yearPlanSubmit,
} from "@/api/PublicInterface";
export default {
  components: { approvalForm },
  filters: {
    statusFilter(value) {
      switch (value) {
        case "Y1":
          return "已保存";
        case "Y2":
          return "已提交";
        case "Y3":
          return "审批中";
        case "Y4":
          return "已审批";
        default:
          return "已拒绝";
      }
    },
  },
  data() {
    return {
      title: "年度检维修计划审批",
      pagination: {
        current: 1,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      approvalVisible: false,
      formData: {},
      yearSelect: undefined,
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
          title: "记录状态",
          dataIndex: "recordStatus",
          scopedSlots: { customRender: "status" },
          width: 70,
          align: "center",
        },
        {
          title: "年度计划编号",
          dataIndex: "planYearNo",
          width: 130,
          slots: { title: "annualplanno" }, //表头插槽
          align: "center",
        },
        {
          title: "计划年度",
          dataIndex: "planYear",
          width: 80,
          slots: { title: "planyear" }, //表头插槽
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "createdUser",
          width: 70,
          slots: { title: "createduser" }, //表头插槽
          align: "center",
        },
        {
          title: "创建日期",
          dataIndex: "createdDateTime",
          width: 140,
          slots: { title: "createdatetime" }, //表头插槽
          align: "center",
        },
        {
          title: "最后编辑人",
          dataIndex: "lastModifiedUser",
          width: 90,
          align: "center",
        },
        {
          title: "最后编辑日期",
          dataIndex: "lastModifiedDateTime",
          width: 140,
          align: "center",
        },
        {
          title: "操作",
          width: 170,
          scopedSlots: { customRender: "operation" },
          fixed: "right",
          align: "center",
        },
      ],
      dataSource: [],
      yearOption: [],
      form: {
        name: "",
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.showYearOption();
    this.search();
  },
  methods: {
    passChange(val, callback) {
      yearPlanAudio(val).then((res) => {
        if (res.code == 200) {
          this.$message.success("完成审核");
          this.approvalVisible = false;
          callback();
          this.resetForm();
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    approval(value) {
      this.approvalVisible = true;
      this.formData = value;
    },
    annualApproval() {
      this.approvalVisible = false;
    },
    // 年度计划审批
    submit(value) {
      yearPlanSubmit({ id: value.id }).then((res) => {
        if (res.code == 200) {
          this.$message.success("提交成功！");
          this.resetForm();
        }
      });
    },
    showYearOption() {
      findYearList().then((res) => {
        //console.log(res,7777)
        res.body.data.forEach((item) => {
          this.yearOption.push({
            label: item.planYear,
            value: item.planYear,
          });
        });
        this.pagination.pageNum = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
        //console.log(this.yearOption, 2222)
      });
    },
    viewJump(value) {
      this.$router.push({
        path: "/annualDetails",
        query: value,
      });
    },
    handleChange() {},
    onSubmit() {},
    addYear(value) {
      this.$router.push({
        path: "/addequipmentMaintenance",
        query: value,
      });
    },
    addAnnualInspectionPlan() {
      addAnnualInspectionPlan({ pageNum: 1, pageSize: 10 }).then((res) => {
        console.log(res, "this is res");
        if (res.body == "false") {
          this.$message.warning(res.msg);
        } else {
          this.$message.success(res.msg);
          this.resetForm();
        }
      });
    },
    search() {
      findYearList({
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize,
        planyear: this.yearSelect,
      }).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
        // this.pagination.current = 1;
        // this.pagination.pageSize = 10;
        this.form.pageNum = 1;
        this.form.pageSize = 10;
      });
    },

    handleReset() {},

    // paginationChange(pagination) {
    //   findYearList({
    //     pageIndex: pagination.current,
    //     pageSize: pagination.pageSize,
    //   });
    // },
    paginationChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.search();
    },

    //重置输入
    resetForm() {
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.yearSelect = undefined;
      this.search();
    },
  },
};
</script>
<style scoped lang="less">
/deep/.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin: 0;
  padding: 0;
}

.equipmentDisplay {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ant-form {
  display: flex;
  justify-content: space-between;
}

.equipmentSelection {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-left: -17px;
  margin-top: 10px;
}

/deep/.equipmentDisplay-checkbox {
  margin-top: 10px;
}
</style>
