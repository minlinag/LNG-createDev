<template>
  <div class="details_form">
    <a-form-model :model="formHeaderData" :label-col="labelCol">
      <a-col :span="8">
        <a-form-model-item label="设备类型" :labelCol="{ span: 7 }">
          <a-input v-model="formHeaderData.eqmType" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="设备分类" :labelCol="{ span: 7 }">
          <a-input v-model="formHeaderData.eqmClassify" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="设备名称" :labelCol="{ span: 7 }">
          <a-input v-model="formHeaderData.eqmName" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="设备位号" :labelCol="{ span: 7 }">
          <a-input v-model="formHeaderData.eqmNo" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="所属设备" :labelCol="{ span: 7 }">
          <a-input v-model="formHeaderData.belongToEqm" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="规格型号" :labelCol="{ span: 7 }">
          <a-input v-model="formHeaderData.specificationModel" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="投用日期" :labelCol="{ span: 7 }">
          <a-date-picker
            v-model="formHeaderData.putIntoUseTime"
            show-time
            type="date"
            disabled
            style="width: 100%"
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="检定周期" :labelCol="{ span: 7 }">
          <a-input v-model="formHeaderData.checkCycle" disabled />
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
        <template slot="applicationFormNo" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'applicationFormNo',
                clickName: 'add',
                name: row.applicationFormNo,
                type: 'link',
                style: ['btn_link'],
                isPower: false,
              },
            ]"
            @add="applicationOpenClick(row.applicationFormNo)"
          ></pe-button>
        </template>
        <template slot="noticeNo" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'noticeNoOpen',
                clickName: 'add',
                name: row.noticeNo,
                type: 'link',
                style: ['btn_link'],
                isPower: false,
              },
            ]"
            @add="noticeNoOpenClick(row.noticeNo)"
          ></pe-button>
        </template>
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
                  isPower: false,
                },
              ]"
              @download="downloadClick(row)"
            ></pe-button>
          </div>
        </template>
      </dc-table>
      <div class="footer">
        <a-button @click="cancelClick">取消</a-button>
      </div>
    </a-form-model>
    <a-modal
      :title="'关联申请单'"
      :visible="applicationFormVisible"
      :footer="null"
      @cancel="applicationFormVisible = false"
      width="950px"
    >
      <application-form
        :submit-visible="applicationFormVisible"
        @close="applicationFormClose"
        :tableModel="applicationFormList"
      >
      </application-form>
    </a-modal>
    <a-modal
      title="关联通知单"
      :visible="noticeVisible"
      class="bigModel"
      @cancel="noticeHandleCancel"
    >
      <notice-no-form
        ref="dispatchingDetail"
        :measuresForm="measuresForm"
        @openList="openList"
      ></notice-no-form>
      <template #footer>
        <div style="text-align: center">
          <a-button @click="noticeHandleCancel"> 取消 </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import {
  getFormList,
} from '@/api/dispatching/dispatching'
import applicationForm from "./applicationForm.vue";
import { getdict } from '@/api/temporaryOverhaulplan'
import noticeNoForm from "./noticeNoForm.vue";
import { selectByEgmCode, selectByCondition, selectOneByInformNo } from "@/api/equipmentMaintenance/equipmentDismantleMgt/verified";
export default {
  name: "detailsForm",
  components: { applicationForm, noticeNoForm },
  props: {
    eqmCode: {
      type: String,
    },
    formHeaderData: {
      type: Object
    }
  },
  data() {
    return {
      applicationFormVisible: false,
      applicationFormList: [],
      noticeFormList: [],
      noticeVisible: false,
      measuresForm: [], //申请单数组
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
          dataIndex: "verificationResult",
          customRender: (value, row, index) => {
            return {
              children: row.verificationResult ? "是" : "否",
              attrs: { rowSpan: 1 },
            }
          },
          width: "130px",
        },
        {
          title: "关联申请单",
          scopedSlots: { customRender: "applicationFormNo" },
        },
        {
          title: "关联通知单",
          scopedSlots: { customRender: "noticeNo" },
        },
        {
          title: "检定证书",
          scopedSlots: { customRender: "download" },
        },
      ],
      dataSource: [
        {
          value: "",
        },
      ],
    };
  },
  created() {
    this.getSelectByEgmCode()


  },
  mounted() {

  },
  methods: {
    applicationOpenClick(applicationFormNo) {
      selectByCondition({ applicationFormNo }).then((res) => {
        this.applicationFormList = res.body.data[0];
        this.applicationFormVisible = true
      });
    },
    applicationFormClose() {
      this.applicationFormVisible = false
    },
    openList(val) {
      this.noticeVisible = true
    },
    noticeNoOpenClick(noticeNo) {
      selectOneByInformNo({ informNo: noticeNo }).then((res) => {
        if (res.code == '200') {
          this.selectForPage = res.body;
          this.noticeVisible = true
          this.getmeasuresForm('通知', res.body)
        }
      })
    },
    downloadClick(row) {
      window.location.href = Glod.DEVE_LOPMENT_ENVIRONMENT + '/fileinfo/downloadFile?relatedId=' + row.id
    },
    getSelectByEgmCode() {
      selectByEgmCode({ eqmCode: this.eqmCode }).then((res) => {
        this.dataSource = res.body;
      });
    },
    cancelClick() {
      this.$emit("close");
    },
    paginationChange(pagination) { },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    noticeHandleCancel() {
      this.noticeVisible = false

    },
    //动态获取Form数据
    getmeasuresForm(type, value) {
      this.measuresForm = getFormList('通知')
      let dict = []
      let dataBox = []
      getdict({}).then((res) => {
        res.body.data.forEach((item) => {
          dict.push({ value: item.id, label: item.dictname })
        })
        this.measuresForm.forEach((item) => {
          if (value) {
            item.value = value[item.labelKey]
          }
          if (item.labelKey == 'workArea') {
            item.data = dict
          }
          if (item.labelKey == 'workUnit') {
            item.data = dataBox
          }
        })
      })
    },
  },
};
</script>
<style lang="less" scoped>
.details_form {
}
</style>
