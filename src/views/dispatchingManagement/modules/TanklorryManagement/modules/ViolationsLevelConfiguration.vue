<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addNew' },
          { value: 'Delete', clickName: 'deleteListClick' },
        ]"
        @addNew="addNew"
        @deleteListClick="deleteListClick"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div
        id="components-layout-demo-basic"
        class="appMainForm"
        style="width: 100%; position: relative"
      >
        <a-form-model>
          <a-row :gutter="10">
            <a-col :span="6">
              <a-form-model-item label="级别：">
                <a-input
                  placeholder="请输入级别"
                  v-model="searchInfo.violationGrade"
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
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :scroll="{ x: 100 }"
        :pagination="pagination"
        @change="paginationChange"
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
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: 'details',
                type: 'link',
                clickName: 'detailsClick',
                name: '详情',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @edit="upDateListDetail(row, 'edit')"
            @detailsClick="upDateListDetail(row, 'look')"
          ></pe-button>
        </template>
      </a-table>
      <!--弹出框-->
      <a-modal
        :title="`违规级别配置${
          formType == 'add' ? '新增' : formType == 'edit' ? '编辑' : '详情'
        }`"
        :maskClosable="false"
        width="80vw"
        :visible="applicationsVisible"
        :footer="null"
        @cancel="applicationsVisibleClose"
        class="DcModel"
      >
        <ViolationsLevelConfigurationDetail
          :recode="recode"
          :levelData="levelData"
          :formType="formType"
          :Recodedisabled="Recodedisabled"
          ref="ViolationsLevelConfigurationDetail"
          @close="applicationsVisibleClose"
        />
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  selectByConditionJ,
  deleteByIdJ,
} from "@/api/dispatchingManagement/TanklorryManagement";

import ViolationsLevelConfigurationDetail from "./ViolationsLevelConfigurationDetail.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "级别", ellipsis: true, dataIndex: "violationGrade", width: 120 },
  { title: "处理措施", ellipsis: true, dataIndex: "treatmentMeasure" },
  { title: "分值", ellipsis: true, dataIndex: "violationScore", width: 120 },
  { title: "创建人", ellipsis: true, dataIndex: "createdUser", width: 120 },
  {
    title: "创建时间",
    ellipsis: true,
    dataIndex: "createdDateTime",
    width: 120,
  },
  {
    fixed: "right",
    title: "操作",
    width: 90,
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  components: { ViolationsLevelConfigurationDetail },
  data() {
    return {
      formType: "",
      recode: {},
      Recodedisabled: false,
      levelData: [{}],
      applicationsVisible: false,
      selectedRowKeys: [],
      searchInfo: {
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
      columns: columns,
      dataSource: [],
    };
  },
  created() {
    this.getList();
  },

  methods: {
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //批量删除确认方法
    deleteListClick() {
      deleteByIdJ({ ids: this.selectedRowKeys.join(",") }).then((res) => {
        if (res.code == "200") {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.warning("删除失败");
        }
      });
    },
    //关闭弹出框
    applicationsVisibleClose() {
      this.getList();
      this.applicationsVisible = false;
      this.recode = {};
      this.levelData = [{}];
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
      this.Recodedisabled = false;
      this.formType = "add";
      this.applicationsVisible = true;
      let date = new Date();
      this.recode.createdUser = this.$store.state.user.name;
      this.recode.createdDateTime = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} ${
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      }:${
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      }:${
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      }`;
    },
    //列表编辑方法
    upDateListDetail(val, type) {
      this.Recodedisabled = type == "look" ? true : false;
      this.recode = val;
      this.formType = type;
      let data = [];
      data.push(this.recode);
      this.levelData = data;
      this.applicationsVisible = true;
    },
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageNum = pagination.current;
      this.searchInfo.pageSize = pagination.pageSize;
      this.getList();
    },
    //获取表格列表
    getList() {
      selectByConditionJ(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
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
