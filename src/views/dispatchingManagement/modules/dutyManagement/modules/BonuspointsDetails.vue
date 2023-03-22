<template>
  <a-form-model ref="dataForm" :model="recode" :rules="rules">
    <a-row>
      <a-col :span="8">
        <a-form-model-item label="创建人：">
          <a-input placeholder="请输入" v-model="recode.createdUser" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="创建时间：">
          <a-input placeholder="请输入" v-model="recode.createdTime" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="考核月份：">
          <a-input placeholder="请输入" v-model="recode.assessMonth" disabled />
        </a-form-model-item>
      </a-col>

      <a-col :span="8">
        <a-form-model-item label="日期：" prop="assessDate">
          <a-date-picker
            v-model="recode.assessDate"
            :disabledDate="disabledDate"
            valueFormat="YYYY-MM-DD"
            format="YYYY-MM-DD"
            placeholder="选择日期"
            :disabled="Recodedisabled"
          />
        </a-form-model-item>
      </a-col>

      <a-col :span="8">
        <a-form-model-item label="班组：" prop="teamGroup">
          <a-select
            :disabled="Recodedisabled"
            v-model="recode.teamGroup"
            show-search
            placeholder="请选择班组"
            option-filter-prop="children"
            allowClear
          >
            <a-select-option
              :value="item.label"
              v-for="(item, index) in owningOption"
              :key="index"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="人员:" prop="personnel">
          <a-input
            :disabled="Recodedisabled"
            placeholder="请输入人员"
            v-model="recode.personnel"
          />
        </a-form-model-item>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="8">
        <a-form-model-item label="加分依据：" prop="assessType">
          <a-select
            :disabled="Recodedisabled"
            v-model="recode.assessType"
            placeholder="请选择加分依据"
            option-filter-prop="children"
            @change="assessTypeChange"
            allowClear
          >
            <a-select-option
              :value="item.assessType"
              v-for="(item, index) in TypeOption"
              :key="index"
            >
              {{ item.assessType }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="加分：" prop="personalDeduct">
          <a-input-number
            id="inputNumber"
            placeholder="请输入加分"
            :disabled="Recodedisabled"
            v-model="recode.personalDeduct"
            style="width: 100%"
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="24" v-if="recode.assessType" style="margin-bottom: 1rem">
        <a-checkbox-group
          @change="onChangeassessNo"
          v-model="recode.assessNo"
          :disabled="Recodedisabled"
        >
          <table class="table_list" id="tables" width="100%" border="1">
            <tr>
              <td style="width: 4rem">请选择</td>
              <td style="width: 45vw">依据编号</td>
              <td style="width: 45vw">描述</td>
            </tr>

            <tr v-for="(item, index) in ViolationDescriptionData" :key="index">
              <td style="width: 4rem">
                <a-checkbox :value="item.assessNo" />
              </td>
              <td style="width: 10rem">{{ item.assessNo }}</td>
              <td>{{ item.assessDescribe }}</td>
            </tr>
          </table>
        </a-checkbox-group>
      </a-col>
      <a-col :span="24">
        <a-form-model-item
          label="补充说明"
          :labelCol="{ style: 'width: 100px' }"
        >
          <a-input
            :disabled="Recodedisabled"
            :auto-size="{ minRows: 3, maxRows: 3 }"
            type="textarea"
            v-model="recode.supplementRemark"
            placeholder="请输入"
          />
        </a-form-model-item>
      </a-col>
    </a-row>

    <!--审批页签部分-->
    <div v-if="formType == 'look' || formType == 'approval'">
      <stepsModel
        ref="stepsModel"
        :isShow="formType === 'approval' ? true : false"
        :id="recode.id"
      />
    </div>

    <div class="ant-modal-footer">
      <a-button type="primary" @click="handleOk" v-if="formType != 'look'">
        保存
      </a-button>
      <a-button
        v-if="formType == 'edit'"
        class="buttonType"
        type="primary"
        @click.stop="handleOk('sunmit')"
      >
        提交
      </a-button>
      <a-button
        type="primary"
        v-if="formType == 'approval'"
        @click="approvalCommit()"
      >
        确定
      </a-button>
      <a-button @click="handleCancel"> 取消</a-button>
    </div>
  </a-form-model>
</template>
<script>
import {
  TeamGroupExamineInsert,
  TeamGroupExamineUpdate,
  queryAssessTypeAdd,
  queryDataByAssessType,
  TeamGroupExamineapplySubmit,
  TeamGroupExamineapplyAudio,
} from "@/api/dispatchingManagement/teamManagement.js";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";

export default {
  name: "versionManagementDetalis",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    owningOption: {
      type: Array,
      default: () => {
        return [];
      },
    },
    formType: String,
    Recodedisabled: Boolean,
  },
  components: { stepsModel },
  data() {
    return {
      TypeOption: [],
      ViolationDescriptionData: [],
      rules: {
        assessDate: [{ required: true, message: "日期不能为空" }],
        teamGroup: [{ required: true, message: "班组不能为空" }],
        personnel: [{ required: true, message: "人员不能为空" }],
        assessType: [{ required: true, message: "考核类型不能为空" }],
      },
    };
  },
  created() {},
  mounted() {
    queryAssessTypeAdd().then((res) => {
      console.log("res", res.body);
      this.TypeOption = res.body;
    });
    console.log(12, this.recode);
    if (this.recode.assessType) {
      this.assessTypeChange(this.recode.assessType);
    }
  },
  methods: {
    // 提交
    CSubmit() {
      TeamGroupExamineapplySubmit([this.recode]).then((res) => {
        if (res.code == "200") {
          this.$message.success("提交成功");
          this.handleCancel();
        } else {
          this.$message.warning("提交失败");
        }
      });
    },
    // 审批
    approvalCommit() {
      console.log(this.$refs.stepsModel.form.type);
      this.recode.type = this.$refs.stepsModel.form.type;
      this.recode.opinion = this.$refs.stepsModel.form.opinion;
      TeamGroupExamineapplyAudio([this.recode]).then((res) => {
        if (res.body == "true") {
          this.$message.success("审批成功");
          this.handleCancel();
        } else {
          this.$message.warning("审批失败");
        }
      });
    },
    assessTypeChange(e) {
      queryDataByAssessType(e).then((res) => {
        this.ViolationDescriptionData = res.body;
      });
    },
    //日期限制不可选
    disabledDate(current) {
      let date = new Date();
      let month = `${date.getFullYear()}-${date.getMonth() + 1}-1`;
      let month1 = `${date.getFullYear()}-${date.getMonth()}-1`;
      if (date.getDate() > 5) {
        return current > date || current < new Date(month);
      } else {
        return current > date || current < new Date(month1);
      }
    },
    handleOk(value) {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          if (this.formType == "add") {
            TeamGroupExamineInsert(this.recode).then((res) => {
              if (res.code == "200") {
                this.handleCancel();
                this.$message.success("新增成功");
              } else {
                this.$message.warning("新增失败");
              }
            });
          } else {
            TeamGroupExamineUpdate(this.recode).then((res) => {
              if (res.code == "200") {
                if (value == "sunmit") {
                  this.CSubmit();
                } else {
                  this.handleCancel();
                  this.$message.success("编辑成功");
                }
              } else {
                if (value == "sunmit") {
                  this.$message.error("提交失败！");
                } else {
                  this.$message.warning("编辑失败");
                }
              }
            });
          }
        }
      });
    },
    onChangeassessNo(checkedValues) {
      console.log("checkedValues", checkedValues);
      this.recode.assessNo =
        checkedValues.length > 1 ? checkedValues[1] : checkedValues[0];

      let data = this.ViolationDescriptionData.find(
        (item) => item.assessNo == this.recode.assessNo
      );
      this.recode.assessDescribe = data.assessDescribe;
      this.recode.teamGroupDeduct = data.teamGroupDeduct;
      this.recode.personalDeduct = data.personalDeduct;
    },
    handleCancel() {
      this.$refs.dataForm.clearValidate();
      this.$emit("close");
    },
  },
};
</script>
<style lang="less">
.rangePickerWidth .ant-form-item-control .ant-input {
  width: 495px !important;
}
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}

.table_list {
  .td {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  .grey {
    background: #f3f5f8;
    /deep/.ant-input {
      background: #f3f5f8;
      border: 1px solid #f3f5f8;
    }
  }
  text-align: center;
  tr {
    line-height: 36px;
    th {
      border-bottom: none;
      border-top: 1px solid #000;
    }
    th:nth-child(1) {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
    }
    th + th {
      border-right: 1px solid #000;
      // border-right: none;
    }
  }
}
</style>
