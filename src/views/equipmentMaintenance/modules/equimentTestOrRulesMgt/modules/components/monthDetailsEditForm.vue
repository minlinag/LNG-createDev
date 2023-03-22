<template>
  <div>
    <a-modal
      width="950px"
      :title="'月度检定计划-编辑'"
      :visible="monthDetailsEditFormVisible"
      :footer="null"
      @cancel="handleCancel"
      class="from-style bigModel"
      :maskClosable="false"
    >
      <a-form-model ref="dataForm" :model="dataForm" :rules="rules">
        <a-col :span="12">
          <a-form-model-item
            label="设备类型"
            :labelCol="{ style: 'width: 140px' }"
          >
            <!-- v-model.trim去掉空格 -->
            <a-input
              v-model.trim="dataForm.eqmType"
              placeholder="请输入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="设备分类"
            :labelCol="{ style: 'width: 160px' }"
          >
            <a-input
              v-model.trim="dataForm.eqmClassify"
              placeholder="请输入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="紧急程度"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model.trim="dataForm.urgencyDegree"
              placeholder="请输入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <div class="buttonInput">
          <a-col :span="6">
            <a-form-model-item label="设备名称">
              <a-input
                v-model.trim="dataForm.eqmName"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="2">
            <a-form-model-item>
              <a-button type="primary" @click="equipmentVisible = true" disabled
                >选择</a-button
              >
            </a-form-model-item>
          </a-col>
        </div>
        <a-col :span="12">
          <a-form-model-item
            label="设备位号"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model.trim="dataForm.eqmNo"
              placeholder="请输入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="所属设备"
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-input
              v-model.trim="dataForm.belongToEqm"
              placeholder="请输入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="是否具备检维修条件"
            :labelCol="{ style: 'width: 290px' }"
          >
            <a-select
              v-model.trim="dataForm.whetherCanCheckMaintenance"
              disabled
            >
              <a-select-option value="Y"> 是 </a-select-option>
              <a-select-option value="N"> 否 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="规格型号"
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-input
              v-model.trim="dataForm.specificationModel"
              disabled
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="内容描述"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-textarea
              v-model.trim="dataForm.contentDescription"
              placeholder="请输入"
              style="width: 815px; height: 60px"
              disabled
              :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-textarea>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="上次检定时间"
            :labelCol="{ style: 'width: 190px' }"
          >
            <a-input
              v-model.trim="dataForm.lastVerificationTime"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="下次检定时间"
            :labelCol="{ style: 'width: 190px' }"
          >
            <a-input
              v-model.trim="dataForm.nextVerificationTime"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="调整检定日期"
            prop="verificationDate"
            :labelCol="{ style: 'width: 155px' }"
          >
            <a-date-picker
              v-model="dataForm.verificationDate"
              type="date"
              placeholder="请选择"
              valueFormat="YYYY-MM-DD"
              format="YYYY-MM-DD"
            />
            <!-- <div>
              <a-input-number
                id="inputNumber"
                v-model.trim="dataForm.verificationDate"
                @change="onChange"
              />
              天
            </div> -->
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="调整原因" prop="adjustCause">
            <a-textarea
              v-model.trim="dataForm.adjustCause"
              style="width: 815px; height: 60px"
              placeholder="请输入"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-textarea>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button type="primary" @click="submitMonthDetailsEditForm">
          提交
        </a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
      <equipmentModel
        :equipmentVisible.sync="equipmentVisible"
        @selectedClic="selectedClic"
      />
    </a-modal>
  </div>
</template>
<script>
import {
  getTreeList, //获取树
} from "@/api/spareParts";
import equipmentModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue";
export default {
  name: "formModel",
  components: { equipmentModel },
  props: {
    monthDetailsEditFormVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    typeModel: {
      type: String,
      default: "add",
    },
    monthPlanNo: {
      type: String,
    },
  },
  data() {
    return {
      eqmTypeOption: [
        {
          value: "特种设备及附件",
          label: "特种设备及附件",
        },
        {
          value: "仪表及计量器具",
          label: "仪表及计量器具",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      value: 0,
      treeSelect: [],
      // 弹窗
      equipmentVisible: false,
      // 表单
      dataForm: {
        eqmType: "",
        eqmClassify: "",
        urgencyDegree: "",
        eqmName: "",
        whetherCanCheckMaintenance: "",
        specificationModel: "",
        contentDescription: "",
        lastVerificationTime: "",
        nextVerificationTime: "",
        verificationDate: "",
        adjustCause: "",
        monthPlanNo: "",
      },
      // 校验
      rules: {
        verificationDate: [
          {
            required: true,
            message: "调整检定日期不能为空",
            trigger: "change",
          },
        ],
        adjustCause: [
          { required: true, message: "调整原因不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getTreeList();
  },
  methods: {
    getTreeList() {
      getTreeList({ classificCode: "", classificName: "" }).then((res) => {
        console.log(res);
        this.treeSelect = res.body.data;
      });
    },
    formClose() {
      this.$emit("close");
    },
    onChange(value) {
      console.log("changed", value);
    },
    // 关闭
    handleCancel() {
      this.formClose();
    },
    // 提交
    submitMonthDetailsEditForm(val) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (val) {
            // this.dataForm.nextVerificationTime+=this.dataForm.adjustVerificationDate
            this.dataForm.monthPlanNo = this.monthPlanNo;
            this.$emit("saveMonthEdit", this.dataForm);
          }
          this.formClose();
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    selectedClic(value) {
      this.dataForm.eqmName = value.equipment_name;
      this.dataForm.eqmNo = value.equipment_tag_no;
      this.dataForm.belongToEqm = value.equipment;
      this.dataForm.specificationModel = value.model_and_specification;
      this.equipmentVisible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
