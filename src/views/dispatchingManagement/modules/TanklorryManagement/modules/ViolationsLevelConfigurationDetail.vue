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
            label="级别配置："
            :labelCol="{ style: 'width: 80px' }"
          >
            <table class="table_list" id="tables" width="100%" border="1">
              <tr align="center" style="background: #eeeeee; height: 40px">
                <td>级别</td>
                <td>处理措施</td>
                <td>分值</td>
              </tr>
              <tr
                v-for="(item, index) in levelData"
                :key="index"
                :class="{ grey: index % 2 == 0 }"
              >
                <td style="width: 14rem">
                  <a-input
                    :disabled="Recodedisabled"
                    v-model="item.violationGrade"
                    placeholder="请输入..."
                  />
                </td>
                <td>
                  <a-textarea
                    :disabled="Recodedisabled"
                    v-model="item.treatmentMeasure"
                    placeholder="请输入"
                    :auto-size="{ minRows: 1, maxRows: 1 }"
                  />
                </td>
                <td style="width: 14rem">
                  <a-input
                    :disabled="Recodedisabled"
                    v-model="item.violationScore"
                    placeholder="请输入..."
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  />
                </td>
              </tr>
            </table>
            <a-icon
              v-if="formType == 'add'"
              type="plus-square"
              @click="levelClick"
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
  insertSelectiveJ,
  updateSelectiveJ,
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
    levelData: {
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
    return {};
  },
  methods: {
    // 级别配置
    levelClick() {
      this.levelData.push({});
    },
    handleOk() {
      if (this.formType == "add") {
        insertSelectiveJ(this.levelData).then((res) => {
          if (res.code == "200") {
            this.handleCancel();
            this.$message.success("新增成功");
            this.$emit("getList");
          } else {
            this.$message.warning("新增失败");
          }
        });
      } else {
        updateSelectiveJ(this.levelData[0]).then((res) => {
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
