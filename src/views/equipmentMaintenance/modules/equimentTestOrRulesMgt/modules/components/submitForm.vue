<template>
  <a-modal
    title="年度检定计划-审批"
    :title="submitModel.title"
    :visible="submitVisible"
    :footer="null"
    @cancel="cancelClick"
    class="from-style bigModel"
    :maskClosable="false"
  >
    <a-form-model :model="submitForm" :label-col="labelCol">
      <a-row>
        <!-- <a-col :span="8">
          <a-form-model-item label="审批结果">
            <a-select
              ref="select"
              v-model="submitForm.examinationResult"
              placeholder="请选择"
              :options="recordStatusOptions"
              disabled
            >
              <a-select-option
                v-for="item in recordStatusOptions"
                :key="item.id"
                :value="item.value"
                :label="item.label"
              >
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="申请单编号">
            <a-input v-model="submitForm.sqdNumber" disabled />
          </a-form-model-item>
        </a-col> -->
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
          </dc-table>
        </div>
        <a-col :span="8">
          <a-form-model-item label="申请人">
            <a-input v-model="submitForm.createdUser" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="申请时间">
            <a-input v-model="submitForm.createdDateTime" disabled />
          </a-form-model-item>
        </a-col>
      </a-row>
      <div>
        <stepsModel
          ref="stepsModel"
          :isShow="typeModel === 'submitForm' ? true : false"
          :id="this.formData.id"
        />
      </div>
    </a-form-model>

    <div class="ant-modal-footer">
      <a-button
        type="primary"
        @click="submitClick"
        v-if="typeModel === 'submitForm'"
      >
        提交
      </a-button>
      <a-button @click="cancelClick">取消 </a-button>
    </div>
  </a-modal>
</template>
<script>
import { monthDetailsList, findAllByYear } from "@/api/equimentTestOrRulesMgt/verificationPlanMonth/verificationPlanMonth";
import { companySelect } from "@/api/outsourceCompany";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  components: { stepsModel },
  props: {
    submitVisible: {
      type: Boolean,
      default: false,
    },
    typeModel: {
      type: String,
      default: "submitForm",
    },
    formData: {
      type: Object,
    },
    submitModel:{
      type:Object,
    }
  },
  watch: {
    formData: {
      handler(newData) {
        this.selectFrom.planAnnual = newData.planAnnual ?? "";
        this.selectFrom.planYear = newData.planAnnual ?? "";
        this.selectFrom.annualPlanNo = newData.annualPlanNo ?? "";
        this.submitForm.sqdNumber = newData.annualPlanNo;
        this.submitForm.examinationResult = newData.recordStatus;
        if (newData.planAnnual) {
          this.getMonthDetailsList();
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      // 状态下拉框
      recordStatusOptions: [
        {
          label: "已保存",
          value: "1",
        },
        {
          label: "已提交",
          value: "2",
        },
        {
          label: "审批中",
          value: "3",
        },
        {
          label: "已通过",
          value: "4",
        },
        {
          label: "已拒绝",
          value: "5",
        },
      ],
      company: [], //外委单位下拉框
      labelCol: { span: 5 },
      submitForm: {
        examinationResult: "",
        sqdNumber: "",
        createdUser: this.$store.state.user.name,
        createdDateTime: this.formatDate(
                new Date(),
                "yyyy-MM-dd HH:mm:ss"
              ),
      },
      selectFrom: {
        pageNum: 1,
        pageSize: 10,
        planMonth: "",
        planYear: "",
        annualPlanNo: "",
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
      selectedRowKeys: [],
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
        },
        {
          title: "设备类型",
          dataIndex: "eqmType",
          width: 80,
        },
        {
          title: "设备分类",
          dataIndex: "eqmClassify",
          width: 80,
        },
        {
          title: "设备名称",
          dataIndex: "eqmName",
          width: 80,
        },
        {
          title: "设备位号",
          dataIndex: "eqmNo",
          width: 80,
        },
        {
          title: "所属设备",
          dataIndex: "belongToEqm",
          width: 80,
        },
        {
          title: "规格型号",
          dataIndex: "specificationModel",
          width: 80,
        },
        {
          title: "投用日期",
          dataIndex: "putIntoUseTime",
          width: 80,
        },
        {
          title: "检定周期",
          dataIndex: "checkCycle",
          width: 80,
        },
        {
          title: "上次检定时间",
          dataIndex: "lastVerificationTime",
          width: "130px",
        },
        {
          title: "下次检定时间",
          dataIndex: "nextVerificationTime",
          width: "130px",
        },
        {
          title: "检验单位",
          dataIndex: "inspectionUnit",
          width: 80,
          customRender: (text) =>
            (text = this.company.filter((obj) => text === obj.value)[0]?.label),
        },
        {
          title: "检定状态",
          dataIndex: "calibrationStatus",
          width: "130px",
        },
      ],
      dataSource: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.typeModel;
      this.formData.annualPlanNo;
    });
    this.getOutsourceCompany();
    // this.getMonthDetailsList();
  },
  methods: {
    //格式化日期
    formatDate(objDate, fmt) {
      var o = {
        "M+": objDate.getMonth() + 1, //月份
        "d+": objDate.getDate(), //日
        "h+": objDate.getHours() % 12 == 0 ? 12 : objDate.getHours() % 12, //小时
        "H+": objDate.getHours(), //小时
        "m+": objDate.getMinutes(), //分
        "s+": objDate.getSeconds(), //秒
        "q+": Math.floor((objDate.getMonth() + 3) / 3), //季度
        S: objDate.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (objDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    // 获取外委单位列表
    getOutsourceCompany() {
      companySelect().then((res) => {
        // this.company = res.body
        res.body.forEach((item) => {
          this.company.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          });
        });
      });
    },
    paginationChange(pagination) {
      this.selectFrom.pageNum = pagination.current;
      this.selectFrom.pageSize = pagination.pageSize;
      this.getMonthDetailsList();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getMonthDetailsList() {
      findAllByYear(this.selectFrom).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.total = res.body.total;
        this.pagination.pageSize = res.body.pageSize;
      });
    },
    submitClick() {
      this.$emit(
        "pass",
        {
          type: this.$refs.stepsModel.form.type,
          opinion: this.$refs.stepsModel.form.opinion,
          id: this.formData.id,
        },
        (res) => {
          this.formClose();
        }
      );
    },
    cancelClick() {
      this.formClose();
    },
    formClose() {
      this.$emit("close");
      this.$refs.stepsModel.form = {}
    },
  },
};
</script>
