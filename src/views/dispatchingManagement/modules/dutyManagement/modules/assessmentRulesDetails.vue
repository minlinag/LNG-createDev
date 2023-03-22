<template>
      <a-layout>
        <a-layout-content style="height: auto">
          <a-row>
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

            <a-col :span="24">
              <a-form-model-item
                label="配置："
                :labelCol="{ style: 'width: 80px' }"
              >
                <table class="table_list" id="tables" width="100%" border="1">
                  <tr align="center" style="background: #eeeeee; height: 40px">
                    <td>序号</td>
                    <td>考核类型</td>
                    <td>依据编号</td>
                    <td>描述</td>

                    <td>班组扣分</td>
                    <td>人员扣分</td>
                  </tr>
                  <tr
                    v-for="(item, index) in yeardata"
                    :key="index"
                    :class="{ grey: index % 2 == 0 }"
                  >
                    <td style="width: 2rem">
                      {{ index + 1 }}
                    </td>
                    <td style="width: 8rem">
                      <a-select
                        style="width: 8rem"
                        allowClear
                        placeholder="请选择..."
                        v-model="item.assessType"
                        :disabled="Recodedisabled"
                      >
                        <a-select-option
                          allowClear
                          :value="item.value"
                          v-for="(item, index) in TypeOption"
                          :key="index"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </td>
                    <td style="width: 8rem">
                      <a-input
                        :disabled="Recodedisabled"
                        v-model="item.assessNo"
                        placeholder="请输入..."
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                      />
                    </td>
                    <td>
                      <a-input
                        :disabled="Recodedisabled"
                        v-model="item.assessDescribe"
                        placeholder="请输入"
                      />
                    </td>
                    <td style="width: 8rem">
                      <a-input
                        :disabled="Recodedisabled"
                        v-model="item.teamGroupDeduct"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                        placeholder="请输入..."
                      />
                    </td>
                    <td style="width: 8rem">
                      <a-input
                        :disabled="Recodedisabled"
                        v-model="item.personalDeduct"
                        placeholder="请输入..."
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                      />
                    </td>
                  </tr>
                </table>
                <a-icon
                  v-if="formType == 'add'"
                  type="plus-square"
                  @click="iconClick"
                  style="
                    width: 1.3rem;
                    height: 1.3rem;
                    position: relative;
                    top: -0.3rem;
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-layout-content>

        <a-layout-footer v-if="formType != 'look'">
          <a-button type="primary" @click="handleOk"> 保存</a-button>
          <a-button @click="handleCancel"> 取消</a-button>
        </a-layout-footer>
      </a-layout>
  </a-spin>
</template>
<script>
import importConpontsData from "@/components/importConpontsData";
import { getdict } from "@/api/dispatchingManagement/versionManagement";

import {
  QuaAssessInsert,
  QuaAssessUpdate,
  QuaAssessqueryByID,
} from "@/api/dispatchingManagement/teamManagement.js";

const TypeOption = [
  { label: "劳动纪律", value: "劳动纪律" },
  { label: "生产管理", value: "生产管理" },
  { label: "工艺指标", value: "工艺指标" },
  { label: "设备管理", value: "设备管理" },
  { label: "HSE管理", value: "HSE管理" },
  { label: "计量管理", value: "计量管理" },
  { label: "加分考核", value: "加分考核" },
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
    yeardata: {
      type: Array,
      default: () => {
        return [{}];
      },
    },
    formType: String,
    Recodedisabled: Boolean,
  },
  components: { importConpontsData },
  data() {
    return {
      TypeOption: TypeOption,
    };
  },
  mounted() {
    let dict = [];
    getdict().then((res) => {
      res.body.data.forEach((item) => {
        dict.push({ value: item.id, label: item.dictname });
      });
    });
    this.owningOption = dict;
  },
  methods: {
    iconClick() {
      this.yeardata.push({});
    },
    handleOk() {
      if (this.formType == "add") {
        QuaAssessInsert(this.yeardata).then((res) => {
          if (res.code == "200") {
            this.handleCancel();
            this.$message.success("新增成功");
            this.$emit("getList");
          } else {
            this.$message.warning("新增失败");
          }
        });
      } else {
        QuaAssessUpdate(this.yeardata).then((res) => {
          if (res.code == "200") {
            this.handleCancel();
            this.$message.success("编辑成功");
            this.$emit("getList");
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
