<template>
  <a-form-model ref="recode" :model="recode" :rules="rules">
    <a-layout>
      <a-layout-content
        :style="recode.whetherGasifyExport ? '' : 'height:50vh'"
      >
        <a-divider
          orientation="left"
          style="font-weight: bolder; margin-top: -0.5rem"
        >
          基础信息
        </a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item
              label="编号"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.operationCardNo"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="创建人"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.createdUser"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item
              label="创建日期"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.createdDateTime"
                disabled
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item
              label="气化外输调度令"
              prop="whetherGasifyExport"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-select
                :disabled="Recodedisabled"
                v-model="recode.whetherGasifyExport"
                placeholder="请选择"
                @change="Onchange"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in Maintype"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="ShowchangeShow">
            <a-col :span="12">
              <a-form-model-item
                label="调度令名称"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  placeholder="请输入"
                  v-model="info.schedulingCommandName"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="发令时间"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-date-picker
                  show-time
                  v-model="info.initiationTime"
                  :disabled="Recodedisabled"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="发令时气化外输量"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  :disabled="Recodedisabled"
                  v-model="info.sendTransmissionQuantity"
                  placeholder="请输入目标外输量"
                  addonAfter="10^4 m³/d"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="目标外输量"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  :disabled="Recodedisabled"
                  v-model="info.targetExportVolume"
                  placeholder="请输入目标外输量"
                  addonAfter="10^4 m³/d"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                />
              </a-form-model-item>
            </a-col>
          </template>
        </a-row>

        <template v-if="recode.whetherGasifyExport">
          <template v-if="ShowchangeShow">
            <ShowchangeTrue
              :formType="formType"
              :recode="recode"
              @dataSourceList="dataSourceList"
              @SchedulingInfo="SchedulingInfo"
            />
          </template>

          <template v-else>
            <ShowchangeFalse
              :formType="formType"
              :recode="recode"
              @dataSourceList="dataSourceList"
            />
          </template>
        </template>
      </a-layout-content>

      <a-layout-footer v-if="formType != 'look'">
        <a-button type="primary" @click="handleOk"> 保存</a-button>
        <a-button @click="handleCancel"> 取消</a-button>
      </a-layout-footer>
    </a-layout>
  </a-form-model>
</template>
<script>
import ShowchangeFalse from "./downloadManagementDetails/ShowchangeFalse.vue";
import ShowchangeTrue from "./downloadManagementDetails/ShowchangeTrue.vue";

import { Downloadinsert } from "@/api/dispatchingManagement/versionManagement";

export default {
  name: "versionManagementDetalis",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    Showchange: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    formType: String,
    Recodedisabled: Boolean,
  },
  components: { ShowchangeFalse, ShowchangeTrue },
  data() {
    return {
      Maintype: [
        { value: "是", label: "是" },
        { value: "否", label: "否" },
      ],
      info: {},
      ShowchangeShow: false,
      list: [],
      rules: {
        whetherGasifyExport: [
          { required: true, message: "气化外输调度令不能为空" },
        ],
      },
    };
  },
  watch: {
    Showchange(val) {
      this.ShowchangeShow = val;
    },
  },
  created() {},
  mounted() {},
  methods: {
    SchedulingInfo(recode) {
      if (recode.reservedFieldThree) {
        this.$message.warning(recode.reservedFieldThree);
        this.$emit("close");

        // applicationsVisible
      } else {
        this.info = {
          schedulingCommandName: recode.schedulingCommandName,
          initiationTime: recode.initiationTime,
          sendTransmissionQuatity: recode.sendTransmissionQuantity,
          targetExportVolume: recode.targetExportVolume,
        };
      }
    },
    Onchange(e) {
      this.ShowchangeShow = e == "是" ? true : false;
    },
    dataSourceList(recode) {
      this.list = recode;
    },
    handleOk() {
      this.recode.list = this.list;
     
      this.recode.schedulingCommandName = this.info.schedulingCommandName;
      this.recode.initiationTime = this.info.initiationTime;
      this.recode.sendTransmissionQuantity = this.info.sendTransmissionQuantity;
      this.recode.targetExportVolume = this.info.targetExportVolume;
      Downloadinsert(this.recode).then((res) => {
        if (res.code == "200") {
          this.handleCancel();
          this.$message.success("新增成功");
        } else {
          this.$message.warning("新增失败");
        }
      });
    },
    handleCancel() {
      this.$refs.recode.clearValidate()
      this.ShowchangeShow = false;
      this.$emit("close");
    },
  },
};
</script>
<style lang="less">
.rangePickerWidth .ant-form-item-control .ant-input {
  width: 495px !important;
}
</style>
