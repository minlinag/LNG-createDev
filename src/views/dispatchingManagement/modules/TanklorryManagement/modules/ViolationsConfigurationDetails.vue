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
            label="违规项配置："
            :labelCol="{ style: 'width: 90px' }"
          >
            <table class="table_list" id="tables" width="100%" border="1">
              <tr align="center" style="background: #eeeeee; height: 40px">
                <td>序号</td>
                <td>级别</td>
                <td>环节</td>
                <td>类型</td>
                <td>违规描述</td>
              </tr>
              <tr
                v-for="(item, index) in ViolationsData"
                :key="index"
                :class="{ grey: index % 2 == 0 }"
              >
                <td style="width: 2rem">
                  {{ index + 1 }}
                </td>
                <td style="width: 8rem">
                  <a-select
                    v-model="item.violationGradeId"
                    :disabled="Recodedisabled"
                    placeholder="请选择..."
                    option-filter-prop="children"
                    allowClear
                    style="width: 100%"
                    @change="Onchange(item)"
                  >
                    <a-select-option
                      v-for="(em, index) in levelData"
                      :key="index"
                      :value="em.id"
                    >
                      {{ em.violationGrade }}
                    </a-select-option>
                  </a-select>
                </td>
                <td style="width: 8rem">
                  <a-select
                    v-model="item.link"
                    :disabled="Recodedisabled"
                    placeholder="请选择..."
                    option-filter-prop="children"
                    allowClear
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="(em, index) in linkData"
                      :key="index"
                      :value="em.value"
                    >
                      {{ em.label }}
                    </a-select-option>
                  </a-select>
                </td>
                <td style="width: 8rem">
                  <a-select
                    v-model="item.dataType"
                    :disabled="Recodedisabled"
                    placeholder="请选择..."
                    option-filter-prop="children"
                    allowClear
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="(em, index) in dataTypeData"
                      :key="index"
                      :value="em.value"
                    >
                      {{ em.label }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-input
                    :disabled="Recodedisabled"
                    v-model="item.violationDescription"
                    placeholder="请输入..."
                  />
                </td>
              </tr>
            </table>
            <a-icon
              v-if="formType == 'add'"
              type="plus-square"
              @click="ViolationsClick"
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
</template>
<script>
import importConpontsData from "@/components/importConpontsData";
import {
  insertSelectiveG,
  updateSelectiveG,
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
    ViolationsData: {
      type: Array,
      default: () => {
        return [{}];
      },
    },
    levelData: {
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
    dataTypeData: {
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
    return {};
  },
  methods: {
    Onchange(e) {
      let name = this.levelData.find(
        (item) => item.id == e.violationGradeId
      ).violationGrade;
      this.ViolationsData.forEach((element) => {
        if (element.violationGradeId == e.violationGradeId) {
          element.violationGradeName = name;
        }
      });
    },
    // 违规项配置
    ViolationsClick() {
      this.ViolationsData.push({});
    },
    handleOk() {
      if (this.formType == "add") {
        insertSelectiveG(this.ViolationsData).then((res) => {
          if (res.code == "200") {
            this.handleCancel();
            this.$message.success("新增成功");
            this.$emit("getList");
          } else {
            this.$message.warning("新增失败");
          }
        });
      } else {
        updateSelectiveG(this.ViolationsData[0]).then((res) => {
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
