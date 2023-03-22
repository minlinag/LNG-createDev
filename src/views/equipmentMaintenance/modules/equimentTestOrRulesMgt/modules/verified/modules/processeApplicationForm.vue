<template>
  <div class="processe_application_form">
    <a-form-model
      ref="ruleForm"
      :model="addFormModel"
      :rules="rules"
      :label-col="labelCol"
    >
      <a-col :span="8">
        <a-form-model-item label="申请编号" prop="requisitionNo">
          <a-input v-model="addFormModel.requisitionNo" disabled></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="维护级别" prop="maintenanceLevel">
          <a-select
            v-model="addFormModel.maintenanceLevel"
            placeholder="请选择"
            :options="maintenanceLevelOptions"
          >
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="处理建议" prop="handlingSuggestions">
          <a-select
            v-model="addFormModel.handlingSuggestions"
            placeholder="请选择"
            :options="handlingSuggestionsOptions"
          >
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item
          :labelCol="{ style: 'width: 110px' }"
          label="设备名称:"
        >
          <a-input v-model="addFormModel.deviceName" disabled></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item
          :labelCol="{ style: 'width: 110px' }"
          label="设备位号:"
        >
          <a-input v-model="addFormModel.deviceNo" disabled></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item
          label="作业区域"
          prop="workArea"
          :labelCol="{ style: 'width: 140px' }"
        >
          <a-select v-model.trim="addFormModel.workArea">
            <a-select-option
              placeholder="请选择"
              :value="item.value"
              :key="index"
              v-for="(item, index) in workAreaOption"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="紧急程度" prop="urgencyLevel">
          <a-select
            v-model="addFormModel.urgencyLevel"
            placeholder="请选择"
            :options="urgencyLevelOption"
          >
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :span="8">
        <a-form-model-item
          label="是否具备检维修条件"
          prop="whetherHaveInspectionCondition"
          :labelCol="{ style: 'width: 300px' }"
        >
          <a-select
            v-model="addFormModel.whetherHaveInspectionCondition"
            placeholder="请选择"
            :options="whetherHaveInspectionConditionOption"
          >
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item
          label="是否需要润滑"
          prop="needLubricate"
          :labelCol="{ style: 'width: 170px' }"
        >
          <a-select
            v-model="addFormModel.needLubricate"
            placeholder="请选择"
            :options="needLubricateOption"
          >
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="24">
        <a-form-model-item
          label="描述说明"
          prop="faultDescription"
          :labelCol="{ style: 'width: 100px' }"
        >
          <a-input
            :auto-size="{ minRows: 5, maxRows: 5 }"
            type="textarea"
            v-model="addFormModel.faultDescription"
            placeholder="请输入"
          />
        </a-form-model-item>
      </a-col>
    </a-form-model>
    <div class="footer">
      <a-button type="primary" @click="submitClick"> 提交 </a-button>
      <a-button @click="handleCancel"> 返回 </a-button>
    </div>
  </div>
</template>
<script>
import { encode } from "@/api/dataDictionary";
import { pinyin } from 'pinyin-pro'
import { addSubmit } from "@/api/equipmentMaintenance/equipmentDismantleMgt/verified";
export default {
  props: ["addvisible", 'rowData'],
  data() {
    return {
      equipmentVisible: false,
      labelCol: { span: 7 },
      addFormModel: {
        requisitionNo: undefined, // 申请编号
        maintenanceLevel: undefined, // 维护级别
        handlingSuggestions: undefined,// 处理建议
        deviceName: this.rowData.eqmName, // 设备名称 
        deviceNo: this.rowData.eqmNo, // 设备位号
        workArea: undefined, // 作业区域
        urgencyLevel: undefined, // 紧急程度
        whetherHaveInspectionCondition: undefined, // 是否具备检修条件
        needLubricate: undefined,// 是否需要润滑
        faultDescription: undefined,// 描述说明
      },
      maintenanceLevelOptions: [
        {
          value: "一级",
          label: "一级",
        }, {
          value: "二级",
          label: "二级",
        }, {
          value: "三级",
          label: "三级",
        }, {
          value: "四级",
          label: "四级",
        },
        {
          value: "五级",
          label: "五级",
        },
      ],
      urgencyLevelOption: [
        {
          value: "一般",
          label: "一般",
        },
        {
          value: "紧急",
          label: "紧急",
        },
      ],
      whetherHaveInspectionConditionOption: [
        {
          value: "是",
          label: "是",
        }, {
          value: "否",
          label: "否",
        },
      ],
      needLubricateOption: [
        {
          value: "是",
          label: "是",
        }, {
          value: "否",
          label: "否",
        },
      ],
      handlingSuggestionsOptions: [
        {
          value: "降级",
          label: "降级",
        },
        {
          value: "报废",
          label: "报废",
        },
        {
          value: "停用",
          label: "停用",
        },
      ],
      workAreaOption: [],
      rules: {
        maintenanceLevel: [
          {
            required: true,
            message: "维护级别不能为空",
            trigger: "change",
          },
        ], // 维护级别
        handlingSuggestions: [
          {
            required: true,
            message: "处理建议不能为空",
            trigger: "change",
          },
        ],// 处理建议
        workArea: [
          {
            required: true,
            message: "作业区域不能为空",
            trigger: "change",
          },
        ], // 作业区域
        urgencyLevel: [
          {
            required: true,
            message: "紧急程度不能为空",
            trigger: "change",
          },
        ], // 紧急程度
        whetherHaveInspectionCondition: [
          {
            required: true,
            message: "是否具备检修条件不能为空",
            trigger: "change",
          },
        ], // 是否具备检修条件
        needLubricate: [
          {
            required: true,
            message: "是否需要润滑不能为空",
            trigger: "change",
          },
        ],// 是否需要润滑
      },
    };
  },
  created() {
    this.getWorkAreaList()
    this.addFormModel.requisitionNo = this.generateRequisitionNo()
  },
  mounted() {

  },
  methods: {
    generateRequisitionNo() {
      let timestamp = new Date().getTime()
      let pinyinFirst = pinyin(this.rowData.eqmName, {
        pattern: 'first',
        toneType: 'none',
      })
        .replace(/\s*/g, '')
        .toUpperCase()
      return pinyinFirst + timestamp
    },
    handleCancel() {
      this.$emit("close");
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          addSubmit(this.addFormModel).then((res) => {
            if (res.code == "200") {
              this.$message.success('提交成功')
              this.$emit("close");
            }
          });
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    // 数据字典-作业区域
    getWorkAreaList() {
      encode("SBGL-JH-ZYSSQY").then((res) => {
        this.workAreaOption = [];
        res.body.data.forEach((item) => {
          this.workAreaOption.push({
            value: item.dictcode,
            label: item.dictname,
          });
        });
      });
    },
  },
};
</script>
