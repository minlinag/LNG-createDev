<template>
  <a-modal
    :visible="qualifiedVisible"
    title="已检定-详情"
    @cancel="qualifiedCancel"
    :footer="null"
    width="950px"
  >
    <a-form-model :model="qualifiedEditForm" :label-col="labelCol">
      <a-col :span="12">
        <a-form-model-item label="设备类型">
          <a-input v-model="qualifiedEditForm.eqmType" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="设备分类">
          <a-input v-model="qualifiedEditForm.eqmClassify" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="设备名称">
          <a-input v-model="qualifiedEditForm.eqmName" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="设备位号">
          <a-input v-model="qualifiedEditForm.eqmNo" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="所属设备">
          <a-input v-model="qualifiedEditForm.belongToEqm" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="规格型号">
          <a-input v-model="qualifiedEditForm.specificationModel" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="投用日期">
          <a-date-picker
            v-model="qualifiedEditForm.putIntoUseTime"
            show-time
            type="date"
            disabled
            placeholder="Pick a date"
            style="width: 100%"
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="检定周期">
          <a-input v-model="qualifiedEditForm.checkCycle" disabled />
        </a-form-model-item>
      </a-col>
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
        <template slot="operation" slot-scope="row"> </template>
        <template slot="download" slot-scope="row">
          <div slot="extra">
            <pe-button
              :include="[
                {
                  value: 'download',
                  clickName: 'download',
                  name: '下载文件',
                  icon: '',
                  type: 'link',
                  style: ['btn_link'],
                },
              ]"
              @download="download"
            ></pe-button>
          </div>
        </template>
      </dc-table>
      <div class="footer">
        <a-button @click="qualifiedCancel">返回</a-button>
      </div>
    </a-form-model>
  </a-modal>
</template>
<script>
export default {
  props: {
    qualifiedVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      labelCol: { span: 4 },
      qualifiedEditForm: {
        eqmType: "",
        eqmClassify: "",
        eqmName: "",
        eqmNo: "",
        belongToEqm: "",
        specificationModel: "",
        putIntoUseTime: "",
        checkCycle: "",
      },
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
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1}`,
          width: 50,
        },
        {
          title: "上次检定时间",
          dataIndex: "lastVerificationTime",
          width: "130px",
        },
        {
          title: "是否合格",
          dataIndex: "s",
          width: "130px",
        },
        {
          title: "关联申请单",
          scopedSlots: { customRender: "apply" },
          dataIndex: "f",
        },
        {
          title: "关联通知单",
          scopedSlots: { customRender: "notice" },
          dataIndex: "f",
        },
        {
          title: "检定证书",
          scopedSlots: { customRender: "download" },
          dataIndex: "f",
        },
      ],
      dataSource: [
        {
          value: "",
        },
      ],
    };
  },
  methods: {
    qualifiedCancel() {
      this.$emit("close");
    },
    paginationChange(pagination) { },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
};
</script>
