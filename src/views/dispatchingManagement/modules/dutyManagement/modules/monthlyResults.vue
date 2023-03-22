<template>
  <Breadcrumb>
    <template slot="appMain">
      <div
        id="components-layout-demo-basic"
        class="appMainForm"
        style="width: 100%; position: relative"
      >
        <a-form-model>
          <a-row :gutter="10">
            <a-col :span="8">
              <a-form-model-item label="考核时间：">
                <a-month-picker
                  format="YYYY-MM"
                  :valueFormat="'YYYY-MM'"
                  v-model="searchInfo.month"
                  placeholder="选择日期"
                />
              </a-form-model-item>
            </a-col>
            <a-form-model-item style="float: right; margin-right: 1rem">
              <a-button
                v-Query
                class="buttonType"
                type="primary"
                @click="select"
              >
                查询
              </a-button>
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>
          </a-row>
        </a-form-model>
      </div>

      <a-table
        :scroll="{ x: 100 }"
        :pagination="false"
        :row-key="(record) => record.id"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
        style="margin-top: -1rem"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'details',
                type: 'link',
                clickName: 'upDateListDetail',
                name: '详情',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @upDateListDetail="upDateListDetail(row)"
          ></pe-button>
        </template>
      </a-table>
      <!--弹出框-->
      <a-modal
        :title="`2022年${recode.month}班组量化考核成绩排名`"
        :visible.sync="applicationsVisible"
        :footer="null"
        :maskClosable="false"
        @cancel="applicationsVisibleClose"
        width="80vw"
        class="DcModel"
      >
        <monthlyResultsDetails
          :recode="recode"
          :TypeOption="TypeOption"
          :formType="formType"
          @close="applicationsVisibleClose"
        />
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  TeamGroupExaminequeryMonthAssessGrade,
  queryAssessType,
} from "@/api/dispatchingManagement/teamManagement.js";
import monthlyResultsDetails from "./monthlyResultsDetails.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
    align: "center",
  },
  { title: "考核时间", ellipsis: true, dataIndex: "month" },
  { title: "一组", ellipsis: true, dataIndex: "oneSum" },
  { title: "二组", ellipsis: true, dataIndex: "twoSum" },
  { title: "三组", ellipsis: true, dataIndex: "threeSum" },
  { title: "四组", ellipsis: true, dataIndex: "fourSum" },
  { title: "五组", ellipsis: true, dataIndex: "fiveSum" },
  { title: "槽车组", ellipsis: true, dataIndex: "tankerSum" },
  { title: "化验组", ellipsis: true, dataIndex: "testSum" },
  { title: "操作", width: 80, scopedSlots: { customRender: "operation" } },
];

export default {
  components: { monthlyResultsDetails },
  data() {
    return {
      formType: "",
      recode: {},
      applicationsVisible: false,
      searchInfo: {},
      columns: columns,
      dataSource: [],
      TypeOption: [],
    };
  },
  mounted() {
    let date = new Date();
    this.searchInfo.date = `${
      date.getFullYear() < 10 ? "0" + date.getFullYear() : date.getFullYear()
    }-${
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
    }`;

    queryAssessType().then((res) => {
      this.TypeOption = res.body;
    });
    this.getList();
  },

  methods: {
    //关闭弹出框
    applicationsVisibleClose() {
      this.getList();
      this.applicationsVisible = false;
    },
    //分页查询
    select() {
      console.log(this.searchInfo);
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = 10;
      this.getList();
    },
    // 新增打开弹出框方法
    addNew() {
      this.formType = "add";
      this.applicationsVisible = true;
      let date = new Date();
      let month = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }`;
      this.recode.createdUser = this.$store.state.user.name;
      this.recode.createdTime = `${month}-${
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      }`;

      this.recode.month = `${month}-${
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      }`;
    },
    //列表编辑方法
    upDateListDetail(val, type) {
      this.recode = val;
      this.formType = type;
      this.applicationsVisible = true;
    },
    //获取表格列表
    getList() {
      console.log("this.searchInfo", this.searchInfo);
      TeamGroupExaminequeryMonthAssessGrade(this.searchInfo).then((res) => {
        this.dataSource = res.body;
      });
    },

    //重置表单输入框
    resetForm() {
      this.searchInfo = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
  },
};
</script>
<style scoped lang="less">
</style>
