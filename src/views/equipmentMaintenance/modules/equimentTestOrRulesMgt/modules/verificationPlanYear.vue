<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <div slot="extra" class="head-button">
          <pe-button
            :include="[
              { value: 'Add', clickName: 'addListClick' },
              { value: 'Delete', clickName: 'deleteListClick' },
            ]"
            @addListClick="addListClick"
            @deleteListClick="deleteListClick"
          ></pe-button>
        </div>
      </template>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <!-- 查询 -->
              <a-form-model layout="inline" :model="selectFrom">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="计划年度"
                  >
                    <a-select
                      v-model="selectFrom.planAnnual"
                      show-search
                      placeholder="请选择计划年度"
                      option-filter-prop="children"
                      :options="yearOption"
                    >
                      <a-select-option
                        v-for="item in yearOption"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      >
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item>
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click="search"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click="resetForm">
                      重置
                    </a-button>
                  </a-form-model-item>
                </a-col>
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
        <div class="securityCheck">
          <dc-table
            rowKey="id"
            @change="paginationChange"
            :pagination="pagination"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              columnWidth: '30px',
              getCheckboxProps: hiddenDangerGetCheckboxProps,
            }"
            :scroll="{ x: 100 }"
            :columns="columns"
            :dataSource="dataSource"
            :openSelector="true"
          >
            <template slot="recordStatus" slot-scope="text">
              {{ text | recordStatus }}
            </template>
            <template slot="operation" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'Edit',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'edit',
                    disabled: $audit.editDisabled(row.recordStatus),
                  },
                  {
                    value: 'View',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'view',
                    name: '详情',
                  },
                  {
                    value: 'Submit',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'submit',
                    name: '提交',
                    disabled:row.recordStatus != '1',

                  },
                ]"
                @edit="edit(row)"
                @view="view(row)"
                @submit="submit(row)"
              ></pe-button>
            </template>
          </dc-table>
        </div>
      </template>
    </Breadcrumb>
    <div class="add-form"></div>
  </div>
</template>
<script>
import {
  annualPlan,
  annualPlanPost,
  deleteAnnualPlan,
  findYear,
  yearApproval,
  yearSubmit,
} from "@/api/equimentTestOrRulesMgt/verificationPlanYear/verificationPlanYear";
export default {
  components: {},
  filters: {
    recordStatus(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "已保存";
          break;
        case "2":
          value = "已提交";
          break;
        case "3":
          value = "审批中";
          break;
        case "4":
          value = "已审批";
          break;
        case "5":
          value = "已拒绝";
          break;
        default:
          break;
      }
      return value;
    },
  },
  name: "",
  // 临时
  // components:{},
  // props:{},
  data() {
    return {
      labelCol: { span: 4 },
      addvisible: false,
      yearOption: [],
      selectedRowKeys: [],
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
          title: "年度计划编号",
          dataIndex: "annualPlanNo",
          width: 140,
          align: "center",
        },
        {
          title: "计划年度",
          dataIndex: "planAnnual",
          width: 80,
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "createdUser",
          width: 80,
          align: "center",
        },
        {
          title: "创建时间",
          dataIndex: "createdDateTime",
          width: 140,
          align: "center",
        },
        {
          title: "最后编辑人",
          dataIndex: "lastModifiedUser",
          width: 90,
          align: "center",
        },
        {
          title: "最后修改时间",
          dataIndex: "lastModifiedDateTime",
          width: 140,
          align: "center",
        },
        {
          title: "审批状态",
          dataIndex: "recordStatus",
          scopedSlots: { customRender: "recordStatus" },
          width: 80,
          align: "center",
        },
        {
          title: "操作",
          width: 150,
          fixed: "right",
          scopedSlots: { customRender: "operation" },
        },
      ],
      dataSource: [],
      selectFrom: {
        planAnnual: "",
        pageNum: 1,
        pageSize: 10,
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
    };
  },
  // 监听当前数据变化
  // watch: {},
  // 计算数据变化
  // computed: {},
  // 实例创建完成后调用
  // created() {
  //   var myDate = new Date();
  //   var year = myDate.getFullYear(); //获取当前年
  //   this.initSelectYear(year);
  // },
  // 实例被挂载后调用
  mounted() {
    this.getAnnualPlan();
    this.showYearOption();
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    hiddenDangerGetCheckboxProps(record) {
      return {
        props: {
          // disabled: record.recordStatus != "1",
        },
      };
    },
    showYearOption() {
      findYear().then((res) => {
        res.body.forEach((item) => {
          this.yearOption.push({
            label: item,
            value: item,
          });
        });
      });
    },
    getAnnualPlan() {
      annualPlan(this.selectFrom).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
      });
    },
    // submit(value) {
    //   debugger;
    //   this.$router.push({
    //     path: "/submitYear",
    //     query: value,
    //   });
    // },
    submit(value) {
      yearSubmit({ id: value.id }).then((res) => {
        this.value = res.body;
        this.$message.success("提交成功！");
        this.getAnnualPlan()
      });
      // this.$router.push({
      //   path: "/submitYear",
      //   // query: value,
      //   query: {
      //     planAnnual: value.planAnnual,
      //     annualPlanNo: value.annualPlanNo,
      //     id: value.id,
      //   },
      // });
    },
    // approval(value) {
    //   this.$router.push({
    //     path: "/submitYear",
    //     // query: value,
    //     query: {
    //       annualPlanNo: value.annualPlanNo,
    //       planannual: value.planannual,
    //       id: value.id,
    //     },
    //   });
    // },
    // 月度计划审批
    // submit() {
    //   monthPlanSubmit({ id: this.$route.query.id }).then((res) => {
    //     if (res.code == 200) {
    //       this.$message.success("提交成功！");
    //     }
    //   });
    // },
    edit(value) {
      this.$router.push({
        path: "/verificationPlanMonth",
        query: value,
      });
    },
    view(value) {
      this.$router.push({
        path: "/verificationPlanMonth",
        query: value,
      });
    },
    // 删除
    deleteListClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteAnnualPlan(this.selectedRowKeys).then((res) => {
          if (res.code == "true") {
            this.selectedRowKeys = [];
          }
          this.getAnnualPlan();
          this.$message.success("删除成功！");
        });
      } else {
        this.$message.warning("请选择记录！");
      }
    },
    // xinzneg
    addListClick() {
      annualPlanPost().then((res) => {
        if (res.body == "false") {
          this.$message.warning(res.msg);
        } else {
          this.$message.success(res.msg);
          this.getAnnualPlan();
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleCancel() {
      this.addvisible = false;
    },
    paginationChange(pagination) {
      this.selectFrom.pageNum = pagination.current;
      this.selectFrom.pageSize = pagination.pageSize;
      this.getAnnualPlan();
    },
    search() {
      this.selectFrom.pageNum = 1;
      this.selectFrom.pageSize = 10;
      this.getAnnualPlan();
    },
    resetForm() {
      this.selectFrom = {
        planAnnual: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getAnnualPlan();
    },
    handleChange() {},
    // 年度下拉框
    // initSelectYear(year) {
    //   this.years = [];
    //   for (let i = 0; i < 30; i++) {
    //     this.years.push({ value: year + i, label: year + i });
    //   }
    // },
  },
};
</script>
<style scoped lang="less">
.head-button {
  display: flex;
}
</style>
