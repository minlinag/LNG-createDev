<template>
  <a-modal
    :title="typeModel.title"
    :visible="addvisible"
    :width="950"
    @cancel="handleCancel"
    :after-close="formListAfterClose"
    class="from-style bigModel"
    :maskClosable="false"
  >
    <a-form-model
      ref="ruleForm"
      :model="addFormModel"
      :rules="rules"
      :label-col="labelCol"
    >
      <a-row>
        <a-col :span="8" class="equipment-add-form">
          <a-form-model-item label="设备类型" prop="eqmType">
            <a-select
              v-model="addFormModel.eqmType"
              placeholder="请选择"
              :options="eqmTypeOption"
              :getPopupContainer="getPopupContainer"
            >
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" class="equipment-add-form">
          <a-form-model-item label="设备分类" prop="eqmClassify">
            <a-select
              v-model="addFormModel.eqmClassify"
              show-search
              placeholder="请选择"
              :options="equipmentList"
              option-filter-prop="children"
              :getPopupContainer="getPopupContainer"
            >
              <a-select-option
                :value="item.classificCode"
                v-for="(item, index) in equipmentList"
                :key="index"
              >
                {{ item.classificName }}
              </a-select-option>
            </a-select>
            <!-- <template>
            <a-tree-select
              v-model="addFormModel.eqmClassify"
              style="width: 100%"
              :dropdown-style="{
                maxHeight: '400px',
                overflow: 'auto',
              }"
              placeholder="请选择"
              allow-clear
            >
              <a-tree-select-node
                :value="item.classificCode"
                :title="item.classificName"
                v-for="(item, index) in treeSelect"
                :key="index"
              >
                <a-tree-select-node
                  :value="items.classificCode"
                  :title="items.classificName"
                  v-for="(items, indexs) in item.children"
                  :key="index + '-' + indexs"
                >
                  <a-tree-select-node
                    :value="itemss.classificCode"
                    :title="itemss.classificName"
                    v-for="(itemss, indexss) in items.children"
                    :key="index + '-' + indexs + '-' + indexss"
                  />
                </a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select>
          </template> -->
          </a-form-model-item>
        </a-col>
        <a-col :span="8" class="equipment-add-form">
          <a-form-model-item label="紧急程度" prop="urgencyDegree">
            <a-select
              v-model="addFormModel.urgencyDegree"
              placeholder="请选择"
              :options="urgencyDegreeOption"
              :getPopupContainer="getPopupContainer"
            >
            </a-select>
          </a-form-model-item>
        </a-col>
        <div class="buttonInput">
          <a-col :span="6">
            <a-form-model-item
              prop="eqmName"
              label="设备名称"
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-input
                v-model.trim="addFormModel.eqmName"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="2">
            <a-form-model-item>
              <a-button type="primary" @click="equipmentVisible = true"
                >选择</a-button
              >
            </a-form-model-item>
          </a-col>
        </div>
        <a-col :span="8">
          <a-form-model-item
            prop="eqmNo"
            label="设备位号"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              v-model.trim="addFormModel.eqmNo"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            prop="belongToEqm"
            label="所属设备"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              v-model.trim="addFormModel.belongToEqm"
              placeholder="请选择"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" class="equipment-add-form">
          <a-form-model-item
            label="是否具备检维修条件"
            prop="whetherCanCheckMaintenance"
          >
            <a-select
              v-model="addFormModel.whetherCanCheckMaintenance"
              placeholder="请选择"
              :getPopupContainer="getPopupContainer"
            >
              <a-select-option value="Y"> 是 </a-select-option>
              <a-select-option value="N"> 否 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="规格型号">
            <a-input
              v-model="addFormModel.specificationModel"
              placeholder="请输入"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="内容描述" prop="contentDescription">
            <a-textarea
              v-model="addFormModel.contentDescription"
              style="width: 815px; height: 60px"
              placeholder="请输入"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            >
            </a-textarea>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="投用日期" prop="putIntoUseTime">
            <a-date-picker
              v-model="addFormModel.putIntoUseTime"
              type="date"
              placeholder="请选择"
              valueFormat="YYYY-MM-DD"
              format="YYYY-MM-DD"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="检定周期(月)" prop="checkCycle">
            <a-auto-complete
              :data-source="dataSource"
              placeholder="请选择"
              v-model="addFormModel.checkCycle"
              @focus="handleFocus"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="下次检定日期"
            required
            prop="nextVerificationTime"
          >
            <a-date-picker
              v-model="addFormModel.nextVerificationTime"
              type="date"
              placeholder="请选择"
              valueFormat="YYYY-MM-DD"
              format="YYYY-MM-DD"
            />
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="8" class="equipment-add-form">
          <a-form-model-item label="检验单位" prop="inspectionUnit">
            <a-select
              v-model="addFormModel.inspectionUnit"
              show-search
              placeholder="请选择"
              option-filter-prop="children"
              :filter-option="filterOption"
              :getPopupContainer="getPopupContainer"
            >
              <a-select-option
                placeholder="请选择"
                :value="item.value"
                :key="index"
                v-for="(item, index) in company"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="8">
          <a-form-model-item label="创建人">
            <a-input v-model="addFormModel.createdUser" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="创建日期">
            <a-input v-model="addFormModel.createdDateTime" disabled />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <template #footer>
      <div style="text-align: center">
        <a-button type="primary" @click="submitClick"> 提交 </a-button>
        <a-button @click="handleCancel"> 取消 </a-button>
      </div>
    </template>
    <equipmentModel
      ref="equipmentModel"
      :equipmentVisible.sync="equipmentVisible"
      @selectedClic="selectedClic"
    />
  </a-modal>
</template>
<script>
import equipmentModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue";
import {
  getTreeList, //获取树
} from "@/api/spareParts";
import { companySelect } from "@/api/outsourceCompany";
import { queryEquipmentList } from "@/api/equimentTestOrRulesMgt/equipmentVerificationMaintenance/equipmentVerificationMaintenance";
import { featureClassification } from "@/api/standingBook";

export default {
  props: ["addvisible", "typeModel"],
  components: { equipmentModel },
  data() {
    return {
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      equipmentVisible: false,
      treeSelect: [], //作业分类下拉框
      equipmentList: [], //设备分类
      company: [], //外委单位下拉框
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
      checkCycleOption: ["3", "6", "12", "24"],
      urgencyDegreeOption: [
        {
          value: "一般",
          label: "一般",
        },
        {
          value: "紧急",
          label: "紧急",
        },
      ],
      dataSource: [],
      labelCol: { span: 7 },
      addFormModel: {
        eqmType: undefined,
        eqmClassify: undefined,
        urgencyDegree: "",
        eqmName: "",
        eqmCode: "",
        whetherCanCheckMaintenance: "",
        specificationModel: "",
        contentDescription: "",
        putIntoUseTime: "",
        checkCycle: "",
        nextVerificationTime: "",
        // inspectionUnit: "",
        verificationNumber: "",
      },
      rules: {
        eqmType: [
          {
            required: true,
            message: "请输入设备类型",
            trigger: "change",
          },
        ],
        eqmClassify: [
          {
            required: true,
            message: "请输入设备分类",
            trigger: "change",
          },
        ],
        urgencyDegree: [
          {
            required: true,
            message: "请输入紧急程度 ",
            trigger: "change",
          },
        ],
        eqmName: [
          {
            required: true,
            message: "请输入设备名称 ",
            trigger: "change",
          },
        ],
        whetherCanCheckMaintenance: [
          {
            required: true,
            message: "请输入是否具备检维修条件",
            trigger: "change",
          },
        ],
        // specificationModel: [
        //   {
        //     required: true,
        //     message: "请输入规格型号 ",
        //     trigger: "change",
        //   },
        // ],
        contentDescription: [
          {
            required: true,
            message: "请输入内容描述 ",
            trigger: "change",
          },
        ],
        putIntoUseTime: [
          {
            required: true,
            message: "请输入投用日期 ",
            trigger: "change",
          },
        ],
        checkCycle: [
          {
            required: true,
            message: "请输入检定周期 ",
            trigger: "change",
          },
          {
            validator: (rule, value, callback) => {
              const reg = /^[0-9]*$/;
              if (reg.test(value)) {
                return callback();
              } else {
                return callback(new Error("请输入数字"));
              }
            },
            trigger: "change",
          },
        ],
        nextVerificationTime: [
          {
            required: true,
            message: "请输入下次检定日期 ",
            trigger: "change",
          },
        ],
        // inspectionUnit: [
        //   {
        //     required: true,
        //     message: "请输入检验单位 ",
        //     trigger: "change",
        //   },
        // ],
        verificationNumber: [
          {
            required: true,
            message: "请输入检定次数",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.getOutsourceCompany();
    this.getTreeList();
    this.getEquipmentList();
  },
  methods: {
    getPopupContainer() {
      return document.querySelector(".equipment-add-form");
    },
    async getEquipmentList() {
      const { body, code } = await featureClassification();
      if (code == 200) {
        let data = [];
        body.data.forEach((item) => {
          data.push({
            label: item.classificName,
            value: item.classificCode,
          });
        });
        this.equipmentList = data;
      }
    },
    handleFocus(value) {
      this.dataSource = value ? [] : this.checkCycleOption;
    },
    selectedClic(value) {
      this.addFormModel.eqmName = value.eqm_sbmc;
      this.addFormModel.eqmCode = value.eqm_sbbm;
      this.addFormModel.eqmNo = value.eqm_sbwh;
      this.addFormModel.belongToEqm = value.eqm_sssb;
      this.addFormModel.specificationModel = value.eqm_xhgg;
      this.equipmentVisible = false;
    },
    // selectedClic(value){
    //   this.dataForm.sbbm = value.equipment_no
    //   this.equipmentVisible = false
    // }
    getTreeList() {
      getTreeList({ classificCode: "", classificName: "" }).then((res) => {
        console.log(res);
        this.treeSelect = res.body.data;
      });
    },
    formClose() {
      this.$emit("close");
      // this.$refs.equipmentModel.reset()
    },
    // submitClick(val) {
    //   this.$emit("saveEquipmentAdd", this.addFormModel);
    //   this.formClose();
    // },
    submitClick(val) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.addFormModel));
          // data.checkCycle = this.addFormModel.checkCycle * 30;
          this.$emit("saveEquipmentAdd", data, () => {
            this.formClose();
          });
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    handleCancel() {
      this.$refs.equipmentModel.reset();
      this.formClose();
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
    formListAfterClose() {
      this.addFormModel = {
        eqmType: undefined,
        eqmClassify: undefined,
        urgencyDegree: "",
        eqmName: "",
        eqmCode: "",
        eqmNo: "",
        whetherCanCheckMaintenance: "",
        specificationModel: "",
        contentDescription: "",
        putIntoUseTime: "",
        checkCycle: "",
        nextVerificationTime: "",
        // inspectionUnit: "",
        verificationNumber: "",
      };
    },
  },
};
</script>
