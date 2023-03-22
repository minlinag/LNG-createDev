<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addNew' },
          {
            value: 'exportComponent',
            isPower: false,
            url: '/operationCardDownload/exportOperationCardDownload',
          },
        ]"
        @addNew="addNew"
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
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="创建人："
              >
                <a-input
                  placeholder="请输入创建人"
                  v-model="searchInfo.deviceName"
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
                value: 'details',
                type: 'link',
                clickName: 'detailsClick',
                name: '详情',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @detailsClick="upDateListDetail(row)"
          ></pe-button>
        </template>
      </a-table>
      <!--弹出框-->
      <a-modal
        :title="`操作卡下载${formType == 'add' ? '新增' : '详情'}`"
        :visible="applicationsVisible"
        :footer="null"
        :maskClosable="false"
        @cancel="applicationsVisibleClose"
        width="90vw"
        class="DcModel"
      >
        <downloadManagementDetails
          :recode="recode"
          :Showchange="Showchange"
          :Recodedisabled="Recodedisabled"
          :formType="formType"
          @close="applicationsVisibleClose"
        />
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import { Downloadselect } from "@/api/dispatchingManagement/versionManagement";

import downloadManagementDetails from "./downloadManagementDetails.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
    align: "center",
  },
  {
    title: "是否调度令",
    ellipsis: true,
    dataIndex: "whetherGasifyExport",
    align: "center",
  },
  {
    title: "发令时间",
    ellipsis: true,
    dataIndex: "initiationTime",
    align: "center",
  },
  {
    title: "操作卡数量",
    ellipsis: true,
    dataIndex: "operatingCardQuantity",
    align: "center",
  },
  {
    title: "创建人",
    ellipsis: true,
    dataIndex: "createdUser",
    align: "center",
  },
  {
    title: "创建时间",
    ellipsis: true,
    dataIndex: "createdDateTime",
    align: "center",
  },
  {
    fixed: "right",
    title: "操作",
    width: 80,
    scopedSlots: { customRender: "operation" },
    align: "center",
  },
];

export default {
  components: { downloadManagementDetails },
  data() {
    return {
      formType: "",
      Recodedisabled: false,
      recode: {},
      Showchange: false,
      applicationsVisible: false,
      selectedRowKeys: [],
      selectData: [
        { label: "已保存", value: 1 },
        { label: "已提交", value: 2 },
        { label: "审批中", value: 3 },
        { label: "已审批", value: 4 },
        { label: "已拒绝", value: 5 },
      ],
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
    //关闭弹出框
    applicationsVisibleClose() {
      this.getList();
      this.applicationsVisible = false;
      this.recode = {};
      this.Showchange = false;
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
      this.Recodedisabled = false;
      this.applicationsVisible = true;
      let date = new Date();
      this.recode.createdUser = this.$store.state.user.name;
      this.recode.createdDateTime = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
    },
    //列表编辑方法
    upDateListDetail(val) {
      this.Recodedisabled = true;
      this.recode = val;
      this.formType = "look";
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
      Downloadselect(this.searchInfo).then((res) => {
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
