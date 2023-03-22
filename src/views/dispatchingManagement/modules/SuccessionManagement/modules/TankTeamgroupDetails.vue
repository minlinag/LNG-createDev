<template>
  <div style="margin-top: 1rem">
    <div>
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="交班人：">
            <a-input
              placeholder="请输入"
              v-model="recode.shiftTaker"
              disabled
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="交班时间：">
            <a-input
              placeholder="请输入"
              v-model="recode.shiftTime"
              disabled
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="编码："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              disabled
              placeholder="请输入"
              v-model="recode.encoding"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-model-item
            label="当班日期："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-date-picker
              show-time
              v-model="recode.shiftDate"
              :disabled="Recodedisabled"
              valueFormat="YYYY-MM-DD"
              format="YYYY-MM-DD"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="装车总监："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              placeholder="请输入"
              v-model="recode.loadingSupervisor"
              :disabled="Recodedisabled"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-model-item
            label="装车计量岗："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              :disabled="Recodedisabled"
              placeholder="请输入"
              v-model="recode.loadingMeasuringPost"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item
            label="装车管理岗："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              :disabled="Recodedisabled"
              placeholder="请输入"
              style="width: 90%"
              v-model="recode.loadingManagementPost"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="天然气密度："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              :disabled="Recodedisabled"
              placeholder="请输入"
              v-model="recode.naturalGasDensity"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-model-item
            label="安全状况："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              :disabled="Recodedisabled"
              placeholder="请输入"
              v-model="recode.securityStatus"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="计划装车数："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input-number
              :disabled="Recodedisabled"
              placeholder="请输入"
              v-model="recode.plannedNumberOfVehiclesLoaded"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="计划装车量："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              :disabled="Recodedisabled"
              v-model="recode.plannedLoadingCapacityT"
              placeholder="请输入计划装车量"
              addonAfter="t"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-model-item
            label="实际装车数："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input-number
              :disabled="Recodedisabled"
              placeholder="请输入"
              v-model="recode.actualNumberVehiclesLoaded"
              style="width: 90%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="16">
          <a-form-model-item
            label="实际装车量："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              :disabled="Recodedisabled"
              v-model="recode.actualLoadT"
              placeholder="请输入"
              addonAfter="t"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              style="width: 44%"
            />
            <a-input
              :disabled="Recodedisabled"
              v-model="recode.actualLoadingCapacityNm"
              placeholder="请输入"
              addonAfter="Nm³"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              style="width: 44%; margin-left: 0.5rem"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-model-item
            label="当班记录："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-textarea
              :disabled="Recodedisabled"
              v-model="recode.shiftRecord"
              placeholder="请输入"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="安全管理："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-textarea
              :disabled="Recodedisabled"
              v-model="recode.safetyManagement"
              placeholder="请输入"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="设备运行状况："
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-textarea
              :disabled="Recodedisabled"
              v-model="recode.equipmentHealth"
              placeholder="请输入"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-col>
        <template v-if="formType == 'succession' || formType == 'look'">
          <a-col :span="24">
            <a-form-model-item
              label="接班意见："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-textarea
                :disabled="formType == 'succession' ? false : true"
                v-model="recode.successionAdvice"
                placeholder="请输入"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </template>
      </a-row>
    </div>
    <div class="ant-modal-footer" v-if="formType != 'look'">
      <template v-if="formType == 'succession'">
        <a-button type="primary" @click="handlesuccession('succession')">
          接班
        </a-button>
        <a-button @click="handlesuccession('back')"> 退回</a-button>
      </template>
      <template v-else>
        <a-button type="primary" @click="handleOk('save')"> 保存</a-button>
        <a-button type="primary" @click="handleOk('sumbit')"> 提交</a-button>
      </template>

      <a-button @click="handleCancel"> 取消</a-button>
    </div>
  </div>
</template>
<script>
import importConpontsData from "@/components/importConpontsData";
import {
  tankerAreainsert,
  tankerAreaedit,
  tankerAreasendBack,
  tankerAreaselectById,
} from "@/api/dispatchingManagement/SuccessionManagement";

const options = [
  { value: "零点", label: "零点" },
  { value: "八点", label: "八点" },
  { value: "四点", label: "四点" },
];

export default {
  name: "versionManagementDetalis",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formType: String,
    Recodedisabled: Boolean,
  },
  components: { importConpontsData },
  data() {
    return {
      options: options,
    };
  },
  created() {},
  mounted() {
    if (this.formType != "add") {
      tankerAreaselectById(this.recode.id).then((res) => {
        console.log("res", res);
      });
    }
  },
  methods: {
    // 班次
    onChange(e) {
      console.log("radio1 checked", e.target.value);
    },
    // 接班、退回
    handlesuccession(e) {
      this.recode.status = e == "succession" ? 3 : 5;
      tankerAreasendBack(this.recode).then((res) => {
        if (res.code == "200") {
          this.handleCancel();
          this.$message.success("操作成功");
        } else {
          this.$message.warning("操作失败");
        }
      });
    },
    handleOk(e) {
      // 1：已保存  2：交班  3：已完成  5：退回
      this.recode.status = e == "save" ? 1 : 2;
      if (this.formType != "edit") {
        // 新增、提交
        tankerAreainsert(this.recode).then((res) => {
          if (res.code == "200") {
            this.handleCancel();
            this.$message.success("操作成功");
          } else {
            this.$message.warning("操作失败");
          }
        });
      } else {
        // 编辑
        tankerAreaedit(this.recode).then((res) => {
          if (res.code == "200") {
            this.handleCancel();
            this.$message.success("编辑成功");
          } else {
            this.$message.warning("编辑失败");
          }
        });
      }
    },
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less">
.rangePickerWidth .ant-form-item-control .ant-input {
  width: 495px !important;
}
.table_list {
  .grey {
    background: #f3f5f8;
    /deep/.ant-input {
      background: #f3f5f8;
    }
  }
  text-align: center;
  tr {
    line-height: 36px;
  }
}
</style>
