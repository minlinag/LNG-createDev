<template>
      <a-layout>
        <a-layout-content style="height: auto">
          <a-form-model
            :model="recode"
            ref="recodeFormRef"
            :rules="recodeFormRules"
          >
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="创建人："
                  :labelCol="{ style: 'width: 100px' }"
                >
                  <a-input
                    placeholder="请输入"
                    v-model="recode.createdUser"
                    disabled
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="创建时间："
                  :labelCol="{ style: 'width: 100px' }"
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
                  label="违规时间："
                  :labelCol="{ style: 'width: 100px' }"
                  prop="violationTime"
                >
                  <a-date-picker
                    show-time
                    v-model="recode.violationTime"
                    :disabled="Recodedisabled"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    @change="OnchangeTime"
                  >
                  </a-date-picker>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="承运单位："
                  :labelCol="{ style: 'width: 100px' }"
                  prop="carrierUnit"
                >
                  <a-select
                    style="width: 100%"
                    v-model="recode.carrierUnit"
                    :disabled="Recodedisabled"
                    placeholder="请选择承运单位"
                    option-filter-prop="children"
                    allowClear
                    @change="onChangeUnit"
                  >
                    <a-select-option
                      :value="item.carrier_code"
                      v-for="(item, index) in CarrierunitData"
                      :key="index"
                    >
                      {{ item.carrier_name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="牵引车号："
                  :labelCol="{ style: 'width: 100px' }"
                  prop="tractionVehicleNumber"
                >
                  <a-select
                    style="width: 100%"
                    v-model="recode.tractionVehicleNumber"
                    :disabled="Recodedisabled"
                    placeholder="请选择牵引车号"
                    option-filter-prop="children"
                    allowClear
                    @change="Onchangetraction"
                  >
                    <a-select-option
                      :value="item.number_tractor"
                      v-for="(item, index) in TractionData"
                      :key="index"
                    >
                      {{ item.number_tractor }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12" v-if="show">
                <a-form-model-item
                  label="挂车号："
                  :labelCol="{ style: 'width: 100px' }"
                >
                  <a-input
                    style="width: 20%"
                    placeholder="请输入"
                    v-model="recode.hangLicensePlate"
                    disabled
                  />
                  <span style="margin-left: 0.5rem">驾驶员：</span>
                  <a-input
                    style="width: 20%"
                    placeholder="请输入"
                    v-model="recode.driver"
                    disabled
                  />
                  <span style="margin-left: 0.5rem">押运员：</span>
                  <a-input
                    style="width: 20%"
                    placeholder="请输入"
                    v-model="recode.supercargo"
                    disabled
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="14">
                <a-form-model-item
                  label="环节："
                  :labelCol="{ style: 'width: 100px' }"
                  prop="link"
                >
                  <a-radio-group
                    :disabled="Recodedisabled"
                    v-model="recode.link"
                    :options="linkData"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="10">
                <a-form-model-item
                  label="违规类型："
                  :labelCol="{ style: 'width: 100px' }"
                  prop="violationType"
                >
                  <a-radio-group
                    :disabled="Recodedisabled"
                    v-model="recode.violationType"
                    :options="options"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="违规级别："
                  :labelCol="{ style: 'width: 90px' }"
                >
                  <a-checkbox-group
                    @change="onChange"
                    v-model="recode.violationGradeId"
                    :disabled="Recodedisabled"
                  >
                    <table
                      class="table_list"
                      id="tables"
                      width="100%"
                      border="1"
                    >
                      <tr
                        align="center"
                        style="background: #eeeeee; height: 40px"
                      >
                        <td
                          style="
                            width: 16rem;
                            text-align: left;
                            padding-left: 10%;
                          "
                        >
                          选择
                        </td>
                        <td style="width: 6rem">分值</td>
                        <td>处理措施</td>
                      </tr>

                      <tr v-for="(item, index) in ViolationsData" :key="index">
                        <td
                          style="
                            width: 16rem;
                            text-align: left;
                            padding-left: 10%;
                          "
                        >
                          <a-checkbox :value="item.id">
                            {{ item.violationGrade }}
                          </a-checkbox>
                        </td>
                        <td style="width: 6rem">
                          {{ item.violationScore }}
                        </td>
                        <td
                          style="
                            text-align: left;
                            line-height: 1.3rem;
                            padding-top: 0.3rem;
                            padding-left: 1rem;
                          "
                          v-html="item.treatmentMeasure"
                        ></td>
                      </tr>
                    </table>
                  </a-checkbox-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item
                  label="违规描述："
                  :labelCol="{ style: 'width: 90px' }"
                >
                  <a-checkbox-group
                    v-model="recode.violationDescription"
                    :disabled="Recodedisabled"
                  >
                    <table
                      class="table_list"
                      id="tables"
                      width="100%"
                      border="1"
                    >
                      <tr
                        v-for="(item, index) in ViolationDescriptionData"
                        :key="index"
                      >
                        <td style="width: 8rem">
                          <a-checkbox :value="item.id" />
                        </td>
                        <td
                          style="
                            text-align: left;
                            width: 40.5rem;
                            padding-left: 1rem;
                          "
                        >
                          {{ item.violationDescription }}
                        </td>
                      </tr>
                    </table>
                  </a-checkbox-group>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-col :span="12">
              <a-form-model-item
                label="发现人："
                :labelCol="{ style: 'width: 100px' }"
                prop="discoverer"
              >
                <a-input
                  placeholder="请输入"
                  v-model="recode.discoverer"
                  :disabled="Recodedisabled"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="销售确认人："
                :labelCol="{ style: 'width: 150px' }"
                prop="salesConfirmer"
              >
                <a-input
                  placeholder="请输入"
                  v-model="recode.salesConfirmer"
                  :disabled="Recodedisabled"
                />
              </a-form-model-item>
            </a-col>
          </a-form-model>
        </a-layout-content>

        <a-layout-footer v-if="formType != 'look'">
          <a-button type="primary" @click="handleOk"> 保存</a-button>
          <a-button @click="handleCancel"> 取消</a-button>
        </a-layout-footer>
      </a-layout>
</template>
<script>
import importConpontsData from "@/components/importConpontsData";

import {
  selelctCommonCarrier,
  selectInsertJ,
  selelctTractionVehicleNumber,
  selelctVehicleInformation,
  updateSelectiveGl,
  insertSelectiveGl,
} from "@/api/dispatchingManagement/TanklorryManagement";

export default {
  name: "versionManagementDetalis",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    linkData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    formType: String,
    Recodedisabled: Boolean,
  },
  components: { importConpontsData },
  data() {
    return {
      show: false,
      CarrierunitData: [],
      TractionData: [],
      ViolationsData: [],
      ItemViolation: [],
      ViolationDescription: [],
      ViolationDescriptionData: [],
      recodeFormRules: {
        violationTime: [{ required: true, message: "请选择违规时间" }],
        carrierUnit: [{ required: true, message: "请选择承运单位" }],
        violationType: [{ required: true, message: "请选择违规类型" }],
        tractionVehicleNumber: [{ required: true, message: "请选择牵引车号" }],
        link: [{ required: true, message: "请选择环节" }],
        discoverer: [{ required: true, message: "请输入发现人" }],
        salesConfirmer: [{ required: true, message: "请输入销售确认人" }],
      },
    };
  },
  mounted() {
    selectInsertJ().then((res) => {
      console.log("res", res);
      res.body.forEach((element) => {
        let data = element.treatmentMeasure.split("\n");
        element.treatmentMeasure = data.join("<br />");
        console.log(data);
      });
      this.ViolationsData = res.body;
    });
  },
  methods: {
    // 时间
    OnchangeTime(e) {
      selelctCommonCarrier(e).then((res) => {
        this.CarrierunitData = res.body;
      });
    },
    // 承运商
    onChangeUnit(e) {
      selelctTractionVehicleNumber(e).then((res) => {
        this.TractionData = res.body;
      });
    },
    // 牵引车号
    Onchangetraction(e) {
      selelctVehicleInformation(e).then((res) => {
        this.show = true;
        let data = res.body[0];
        this.recode.hangLicensePlate = data.number_trailer;
        this.recode.driver = data.name_driver;
        this.recode.supercargo = data.name_escort;
      });
    },
    handleOk() {
      this.$refs.recodeFormRef.validate(async (valid) => {
        if (valid) {
          this.recode.violationDescription.join(",");
          if (this.formType == "add") {
            insertSelectiveGl(this.recode).then((res) => {
              if (res.code == "200") {
                this.handleCancel();
                this.$message.success("新增成功");
                this.$emit("getList");
              } else {
                this.$message.warning("新增失败");
              }
            });
          } else {
            updateSelectiveGl(this.recode).then((res) => {
              if (res.code == "200") {
                this.handleCancel();
                this.$message.success("编辑成功");
                this.$emit("getList");
              } else {
                this.$message.warning("编辑失败");
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.show = false;
      this.$emit("close");
    },
    onChange(checkedValues) {
      this.recode.violationGradeId =
        checkedValues.length > 1 ? checkedValues[1] : checkedValues[0];

      this.ViolationDescriptionData = this.ViolationsData.find(
        (item) => item.id == this.recode.violationGradeId
      ).list;
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
  }
}
</style>
