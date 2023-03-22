<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model v-model="form" :layout="'inline'">
        <a-col :span="6">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="年度:"
          >
            <a-select ref="select" v-model="yearSelect" :options="yearOption">
              <a-select-option
                v-for="item in yearOption.transOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              >
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="月度:"
          >
            <a-month-picker
              format="MM"
              :valueFormat="'YYYY-MM'"
              v-model="monthSelect"
              :size="size"
              placeholder="选择日期"
            />
          </a-form-model-item>
        </a-col>
        <a-form-model-item>
          <a-button
            v-Query
            class="buttonType"
            type="primary"
            @click.stop="search"
          >
            查询
          </a-button>
          <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
        </a-form-model-item>
      </a-form-model>
      <dc-table
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
        :openSelector="false"
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
                clickName: 'addMonth',
                isPower: false,
                disabled:
                  row.recordStatus === 'M2' ||
                  row.recordStatus === 'M3' ||
                  row.recordStatus === 'M4',
                icon: '',
                style: ['btn_link'],
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
                disabled:
                  row.recordStatus == 'M2' ||
                  row.recordStatus == 'M3' ||
                  row.recordStatus == 'M4',
                isPower: false,
                type: 'link',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: 'View',
                name: '查看',
                isPower: false,
                type: 'link',
                clickName: 'viewJump',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @addMonth="addMonth(row)"
            @approval="approval(row)"
            @submit="submit(row)"
            @viewJump="viewJump(row)"
          ></pe-button>
        </template>
      </dc-table>
      <!-- 审批弹框 -->
      <approval-form
        :approvalVisible="approvalVisible"
        @close="approvalClose"
        :formData="formData"
        @pass="passChange"
        :title="title"
      >
      </approval-form>
    </template>
  </Breadcrumb>
</template>
<script>
import { monthOption, deleteMonthlyPlan } from "@/api/monthMaintenance";
import { monthPlanAudio, monthPlanSubmit } from "@/api/PublicInterface";
import approvalForm from "./components/approvalForm.vue";
export default {
  components: { approvalForm },
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
        default:
          return "已拒绝";
          break;
      }
    },
  },
  data() {
    return {
      title: "月度检维修计划审批",
      approvalVisible: false,
      size: "default",
      selectedRowKeys: [],
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
      monthSelect: "",
      formData: {},
      yearSelect: "",
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
          title: "记录状态",
          dataIndex: "recordStatus",
          width: 90,
          ellipsis: true,
          scopedSlots: { customRender: "status" },
          align: "center",
        },
        {
          title: "月度计划编号",
          dataIndex: "planMonthNo",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "计划年度",
          dataIndex: "planYear",
          ellipsis: true,
          width: 90,
          align: "center",
        },
        {
          title: "计划月度",
          dataIndex: "planMonth",
          ellipsis: true,
          width: 90,
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "createdUser",
          ellipsis: true,
          width: 80,
          align: "center",
        },
        {
          title: "创建日期",
          dataIndex: "createdDateTime",
          ellipsis: true,
          align: "center",
        },
        {
          title: "最后编辑人",
          dataIndex: "lastModifiedUser",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "最后编辑日期",
          dataIndex: "lastModifiedDateTime",
          ellipsis: true,
          align: "center",
        },
        {
          title: "操作",
          width: 170,
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: "center",
        },
      ],
      dataSource: [],
      form: {},
      yearOption: [],
      monthOption: [],
    };
  },
  mounted() {
    this.showMonthOption();
    this.search();
  },
  methods: {
    passChange(val, callback) {
      monthPlanAudio(val).then((res) => {
        if (res.code == 200) {
          this.$message.success("完成审核");
          this.approvalClose();
          callback();
          this.showMonthOption();
        }
      });
    },
    approvalClose() {
      this.approvalVisible = false;
    },
    showMonthOption(pageIndex = 1, pageSize = 10, planyear, planmonth) {
      monthOption({
        pageIndex: pageIndex,
        pageSize: pageSize,
        planyear: planyear,
        planmonth: planmonth,
      }).then((res) => {
        res.body.data.forEach((item) => {
          this.yearOption.push({
            label: item.planYear,
            value: item.planYear,
            key: item.value,
          });
          this.yearOption = this.removeDuplicate(this.yearOption);
        });
        this.dataSource = res.body.data;
        this.columns[1].dataIndex = "recordStatus";
        this.pagination.current = res.body.pageIndex;
        this.pagination.total = res.body.total;
        this.pagination.pageSize = res.body.pageSize;
      });
    },
    // 数组去重
    removeDuplicate(arr) {
      let len = arr.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (arr[i].value === arr[j].value) {
            arr.splice(j, 1);
            len--; // 减少循环次数提高性能
            j--; // 保证j的值自加后不变
          }
        }
      }
      return arr;
    },
    addMonth(val) {
      this.$router.push({
        path: "/addMonthequipmentMaintenance",
        query: {
          id: val.id,
          planMonth: val.planMonth,
          planMonthNo: val.planMonthNo,
          planYearNo: val.planYearNo,
          planYear: val.planYear,
        },
      });
      // }
    },
    // 查看
    viewJump(value) {
      this.$router.push({
        path: "/monthDetails",
        query: { monthlyplanno: value.planMonthNo, id: value.id },
      });
    },
    approval(value) {
      this.approvalVisible = true;
      this.formData = value;
    },
    // 月度计划审批
    submit(value) {
      monthPlanSubmit({ id: value.id }).then((res) => {
        if (res.code == 200) {
          this.$message.success("提交成功！");
          this.showMonthOption();
        }
      });
    },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    // judgmentmonth(pageNum = 1, pageSize = 10, planyear, planmonth) {
    //     console.log(this.planmonth, this.planyear, 11188888)
    //     if (planyear.length == 0 && planmonth.length == 0) {
    //         this.$message.success('请选中年份和月份');
    //     } else {
    //         monthJudgment({ pageNum: pageNum, pageSize: pageSize, planyear: planyear, planmonth: planmonth }).then((res) => {
    //             this.dataSource = res.body.data
    //             this.pagination.current = res.body.pageIndex
    //             this.pagination.total = res.body.total
    //             this.pagination.pageSize = res.body.pageSize
    //         })
    //     }
    // },
    search() {
      console.log(this.monthSelect.split("-")[1], "month");
      console.log(this.yearSelect, "year");
      monthOption({
        planyear: this.yearSelect,
        planmonth: this.monthSelect.split("-")[1],
      }).then((res) => {
        this.dataSource = res.body.data;
      });
    },
    paginationChange(pagination) {
      monthOption({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      });
      yearOption({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      });
    },
    //重置输入
    resetForm() {
      this.yearSelect = "";
      this.monthSelect = "";
      this.showMonthOption();
    },
    // search() {
    //     this.pagination.pageIndex = 1;
    //     this.pagination.pageSize = 10;
    //     this.showMonthOption();
    // },
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

.Myserch {
  display: flex;
  justify-content: end;
}
</style>
