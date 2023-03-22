<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <div slot="extra" class="head-button">
          <!-- 导出 -->
          <!-- <ExportComponents url="verificationPlanMinute/exportMonthExcel">
          </ExportComponents> -->
        </div>
      </template>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <!-- 查询 -->
              <a-form-model layout="inline" :model="selectForm">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="计划年度"
                  >
                    <a-select
                      v-model="selectForm.planannual"
                      placeholder="请选择"
                      :options="yearOption"
                    >
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
            }"
            :scroll="{ x: 100 }"
            :columns="columns"
            :dataSource="dataSource"
            :openSelector="true"
          >
            <template slot="operation" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'Edit',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'edit',
                  },
                ]"
                @edit="editMonth(row)"
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
import { planMonth } from "@/api/equimentTestOrRulesMgt/verificationPlanMonth/verificationPlanMonth";
import { findYear } from "@/api/equimentTestOrRulesMgt/verificationPlanYear/verificationPlanYear";
export default {
  components: {},
  name: "",
  // 临时
  // components:{},
  // props:{},
  data() {
    return {
      labelCol: { span: 4 },
      addvisible: false,
      selectForm: {
        annualPlanNo: this.$route.query.annualPlanNo,
        planannual: this.$route.query.planAnnual,
      },
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
          title: "月度计划编号",
          dataIndex: "monthPlanNo",
          width: 140,
          align: "center",
        },
        {
          title: "计划年度",
          dataIndex: "planAnnual",
          // width: 60,
          align: "center",
        },
        {
          title: "计划月度",
          dataIndex: "planMonth",
          // width: 60,
          align: "center",
        },
        {
          title: "最后编辑人",
          dataIndex: "lastModifiedUser",
          // width: 90,
          align: "center",
        },
        {
          title: "最后修改时间",
          dataIndex: "lastModifiedDateTime",
          width: 150,
          align: "center",
        },
        {
          title: "操作",
          width: 60,
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: "center",
        },
      ],
      yearOption: [],
      dataSource: [],
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
  // created: {},
  // 实例被挂载后调用
  mounted() {
    this.getPlanMonth();
    this.showYearOption();
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    getPlanMonth() {
      planMonth(this.selectForm).then((res) => {
        this.dataSource = res.body;
      });
    },
    editMonth(value) {
      this.$router.push({
        path: "/editMonthDetails",
        query: {
          flag: true,
          planMonth: value.planMonth,
          planAnnual: value.planAnnual,
          monthPlanNo: value.monthPlanNo,
        },
        // query:{id:value.planMonthNo}
        // planMonth:"",
        // planAnnual:"",
      });
    },
    // viewMonth(value) {
    //   this.$router.push({
    //     path: "/editMonthDetails",
    //     // query: value,
    //     // query: {flag:false,id:value.id},
    //     query: {flag:false,planMonth:value.planMonth,planAnnual:value.planAnnual},

    //   });
    // },
    addListClick() {
      this.addvisible = true;
    },
    deleteListClick() {},
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleOk() {
      this.addvisible = false;
    },
    handleCancel() {
      this.addvisible = false;
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      // this.selectForm.pageNum = pagination.current
      // this.selectForm.pageSize = pagination.pageSize
      this.getPlanMonth();
    },
    search() {
      this.getPlanMonth();
    },
    resetForm() {
      this.selectForm.planannual = "";
      this.getPlanMonth();
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
  },
};
</script>
<style scoped lang="less"></style>
