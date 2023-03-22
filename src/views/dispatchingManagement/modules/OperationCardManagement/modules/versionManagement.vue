<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addNew' },
          { value: 'Delete', clickName: 'mydelete' },
        ]"
        @addNew="addNew"
        @mydelete="deleteListClick"
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
                label="操作卡名称:"
              >
                <a-input
                  placeholder="请输入操作卡名称"
                  v-model="searchInfo.operationCardName"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="操作类型:"
              >
                <a-select
                  placeholder="请选择操作类型"
                  v-model="searchInfo.operationCardType"
                  allowClear
                >
                  <a-select-option
                    allowClear
                    :value="item.value"
                    v-for="(item, index) in TypeOption"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="设备名称:"
              >
                <a-input
                  placeholder="请输入设备名称"
                  v-model="searchInfo.deviceName"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="设备位号:"
              >
                <a-input
                  placeholder="请输入设备位号"
                  v-model="searchInfo.deviceNo"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 140px' }"
                label="工艺单元:"
              >
                <a-select
                  placeholder="请选择工艺单元"
                  v-model="searchInfo.owningSystem"
                  allowClear
                >
                  <a-select-option
                    allowClear
                    :value="item.value"
                    v-for="(item, index) in owningOption"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
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
                disabled: $audit.editDisabled(row.recordStatus),
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
        <template slot="file" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'download',
                clickName: 'download',
                name: '下载文件',
                icon: '',
                type: 'link',
                style: ['btn_link'],
                isPower: false,
              },
            ]"
            @download="downloadClick(row)"
          />
        </template>
        <template slot="owningSystem" slot-scope="row">
          {{
            row
              ? owningOption.find((item) => item.value == row)
                ? owningOption.find((item) => item.value == row).label
                : ""
              : ""
          }}
        </template>
      </a-table>
      <!--弹出框-->
      <versionManagementDetalis
        :recode="recode"
        :applicationsVisibles="applicationsVisibles"
        :Recodedisabled="Recodedisabled"
        :owningOption="owningOption"
        :formType="formType"
        @getList="getList"
      />
    </template>
  </Breadcrumb>
</template>
<script>
import {
  selectByCondition,
  deleteByIds,
  getdict,
} from "@/api/dispatchingManagement/versionManagement";

import versionManagementDetalis from "./versionManagementDetalis.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
    align: "center",
  },
  {
    title: "操作卡名称",
    ellipsis: true,
    dataIndex: "operationCardName",
    align: "center",
  },
  {
    title: "操作类型",
    ellipsis: true,
    dataIndex: "operationCardType",
    align: "center",
  },
  {
    title: "工艺单元",
    dataIndex: "owningSystem",
    ellipsis: true,
    scopedSlots: { customRender: "owningSystem" },
    align: "center",
  },
  { title: "设备位号", ellipsis: true, dataIndex: "deviceNo", align: "center" },
  {
    title: "设备名称",
    ellipsis: true,
    dataIndex: "reservedFieldOne",
    align: "center",
  },
  { title: "说明", ellipsis: true, dataIndex: "states", align: "center" },
  {
    title: "附件",
    scopedSlots: { customRender: "file" },
    width: 80,
    ellipsis: true,
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
    width: 90,
    scopedSlots: { customRender: "operation" },
    align: "center",
  },
];

export default {
  components: { versionManagementDetalis },
  data() {
    return {
      formType: "",
      recode: {},
      Recodedisabled: false,
      applicationsVisibles: false,
      selectedRowKeys: [],
      TypeOption: [
        { value: "启动", label: "启动" },
        { value: "停止", label: "停止" },
        { value: "隔离/恢复", label: "隔离/恢复" },
        { value: "其他", label: "其他" },
      ],
      owningOption: [],
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

    let dict = [];
    getdict().then((res) => {
      res.body.data.forEach((item) => {
        dict.push({ value: item.dictcode, label: item.dictname });
      });
    });
    this.owningOption = dict;
  },

  methods: {
    // 文件预览
    downloadClick(row) {
      let flieChanges = JSON.parse(row.reservedFieldTwo)[0];
      console.log("flieChanges", flieChanges);
      window.location.href =
        Glod.DEVE_LOPMENT_ENVIRONMENT +
        "fileinfo/downloadFileById?id=" +
        flieChanges.id +
        "&dType=d";
    },
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //批量删除确认方法
    deleteListClick() {
      deleteByIds(this.selectedRowKeys).then((res) => {
        if (res.code == "200") {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.warning("删除失败");
        }
      });
    },

    //分页查询
    select() {
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = 10;
      this.getList();
    },
    // 新增打开弹出框方法
    addNew() {
      this.formType = "add";
      this.applicationsVisibles = true;
      this.Recodedisabled = false;
      let date = new Date();
      this.recode.createdUser = this.$store.state.user.name;
      this.recode.createdDateTime = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
    },
    //列表编辑方法
    upDateListDetail(val, type) {
      this.Recodedisabled = type == "look" ? true : false;
      this.recode = val;
      this.formType = type;
      this.applicationsVisibles = true;
    },
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageNum = pagination.current;
      this.searchInfo.pageSize = pagination.pageSize;
      this.getList();
    },
    //获取表格列表
    getList() {
      this.applicationsVisibles = false;
      this.recode = {};
      selectByCondition(this.searchInfo).then((res) => {
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
