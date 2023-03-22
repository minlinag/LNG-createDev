<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addNew' },
          { value: 'Delete', clickName: 'deleteListClick' },
          {
            value: 'exportComponent',
            isPower: false,
            url: '/violationManagement/exportExcelX',
          },
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
                <a-select
                  v-model="searchInfo.violationGradeName"
                  show-search
                  placeholder="请选择级别"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    :value="item.violationGrade"
                    v-for="(item, index) in levelData"
                    :key="index"
                  >
                    {{ item.violationGrade }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="环节：">
                <a-select
                  v-model="searchInfo.link"
                  show-search
                  placeholder="请选择环节"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in linkData"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="类型：">
                <a-select
                  v-model="searchInfo.dataType"
                  show-search
                  placeholder="请选择类型"
                  option-filter-prop="children"
                  allowClear
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in dataTypeData"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="创建人:"
              >
                <a-input
                  placeholder="请输入创建人"
                  v-model="searchInfo.createdUser"
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
        <template slot="link" slot-scope="row">
          {{
            row
              ? linkData.find((item) => item.value == row)
                ? linkData.find((item) => item.value == row).label
                : ""
              : ""
          }}
        </template>
        <template slot="dataType" slot-scope="row">
          {{
            row
              ? dataTypeData.find((item) => item.value == row)
                ? dataTypeData.find((item) => item.value == row).label
                : ""
              : ""
          }}
        </template>
      </a-table>
      <!--弹出框-->
      <a-modal
        :title="`违规分级分类处理标准配置${
          formType == 'add' ? '新增' : formType == 'edit' ? '编辑' : '详情'
        }`"
        :maskClosable="false"
        width="80vw"
        :visible="applicationsVisible"
        :footer="null"
        @cancel="applicationsVisibleClose"
        class="DcModel"
      >
        <ViolationsConfigurationDetails
          :recode="recode"
          :ViolationsData="ViolationsData"
          :levelData="levelData"
          :Recodedisabled="Recodedisabled"
          :linkData="linkData"
          :dataTypeData="dataTypeData"
          ref="ViolationsConfigurationDetails"
          :formType="formType"
          @close="applicationsVisibleClose"
        />
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  selectByConditionG,
  deleteByIdG,
  selectRank,
  getdict,
} from "@/api/dispatchingManagement/TanklorryManagement";

import ViolationsConfigurationDetails from "./ViolationsConfigurationDetails.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  {
    title: "级别",
    ellipsis: true,
    dataIndex: "violationGradeName",
    width: 120,
  },
  {
    title: "环节",
    ellipsis: true,
    dataIndex: "link",
    width: 120,
    scopedSlots: { customRender: "link" },
  },
  {
    title: "类型",
    ellipsis: true,
    dataIndex: "dataType",
    width: 100,
    scopedSlots: { customRender: "dataType" },
  },
  { title: "违规描述", ellipsis: true, dataIndex: "violationDescription" },
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
  components: { ViolationsConfigurationDetails },
  data() {
    return {
      formType: "",
      recode: {},
      Recodedisabled: false,
      ViolationsData: [{}],
      applicationsVisible: false,
      selectedRowKeys: [],
      linkData: [],
      levelData: [],
      dataTypeData: [],
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
    this.initial();
  },

  methods: {
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //批量删除确认方法
    deleteListClick(val) {
      deleteByIdG({ ids: this.selectedRowKeys.join(",") }).then((res) => {
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
      this.ViolationsData = [{}];
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
      this.Recodedisabled = false;
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
      this.ViolationsData = data;
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
      selectByConditionG(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    // 初始化
    initial() {
      selectRank().then((res) => {
        this.levelData = res.body;
      });
      let dict = [];
      getdict("CCKHGL-WGXHJ").then((res) => {
        res.body.data.forEach((item) => {
          dict.push({ value: item.id, label: item.dictname });
        });
      });
      this.linkData = dict;
      let dicts = [];
      getdict("CCKHGL-WGXLX").then((res) => {
        res.body.data.forEach((item) => {
          dicts.push({ value: item.id, label: item.dictname });
        });
      });
      this.dataTypeData = dicts;
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
