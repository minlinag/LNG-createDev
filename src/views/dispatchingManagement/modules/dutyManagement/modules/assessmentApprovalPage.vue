<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model ref="dataForm" :model="recode">
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="创建人："
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.createdUser"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="创建时间："
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.createdTime"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="考核月份："
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.assessMonth"
                disabled
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item
              label="日期："
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-date-picker
                v-model="recode.assessDate"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
                placeholder="选择日期"
                disabled
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item
              label="班组："
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-select
                disabled
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
            <a-form-model-item
              label="人员:"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                disabled
                placeholder="请输入人员"
                v-model="recode.personnel"
              />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="考核类型："
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-select
                disabled
                v-model="recode.assessType"
                placeholder="请选择考核类型"
                option-filter-prop="children"
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
          <a-col
            :span="24"
            v-if="recode.assessType"
            style="margin-bottom: 1rem"
          >
            <a-checkbox-group v-model="recode.assessNo" disabled>
              <table class="table_list" id="tables" width="100%" border="1">
                <tr>
                  <td style="width: 15vwem">请选择</td>
                  <td style="width: 20vw">依据编号</td>
                  <td style="width: 20vw">描述</td>
                  <td style="width: 20vw">班组扣分</td>
                  <td style="width: 20vw">人员扣分</td>
                </tr>

                <tr
                  v-for="(item, index) in ViolationDescriptionData"
                  :key="index"
                >
                  <td style="width: 4rem">
                    <a-checkbox :value="item.assessNo" />
                  </td>
                  <td>{{ item.assessNo }}</td>
                  <td>{{ item.assessDescribe }}</td>
                  <td>{{ item.teamGroupDeduct }}</td>
                  <td>{{ item.personalDeduct }}</td>
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
                disabled
                :auto-size="{ minRows: 3, maxRows: 3 }"
                type="textarea"
                v-model="recode.supplementRemark"
                placeholder="请输入"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <stepsModel
          ref="stepsModel"
          :isShow="true"
          :id="recode.id"
          @approvalMethod="approvalMethod"
        />
        <div class="ant-modal-footer">
          <a-button type="primary" @click="agreeClick">同意</a-button>
          <a-button type="danger" @click="rejectClick">驳回</a-button>
          <a-button @click="cancelClick">返回</a-button>
        </div>
      </a-form-model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  queryAssessType,
  queryDataByAssessType,
  TeamGroupExamineQueryByID,
  TeamGroupExamineapplyAudio,
  getdict,
} from "@/api/dispatchingManagement/teamManagement.js";

import stepsModel from "@/components/approvalRecord/index.vue";

export default {
  name: "versionManagementDetalis",
  components: { stepsModel },
  data() {
    return {
      recode: {},
      TypeOption: [],
      ViolationDescriptionData: [],
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          //需要监听的参数
          this.id = this.$route.query.id;
          this.getListDetails(this.id);
        }
      },
    },
  },
  created() {
    let dict = [];
    getdict().then((res) => {
      res.body.data.forEach((item) => {
        dict.push({ value: item.id, label: item.dictname });
      });
    });
    this.owningOption = dict;
    queryAssessType().then((res) => {
      this.TypeOption = res.body;
    });
    // this.getListDetails("D221677478392858");
  },
  methods: {
    approvalMethod(type) {
      TeamGroupExamineapplyAudio({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.recode.id,
      }).then((res) => {
        if (res.body == "true") {
          this.$message.success("完成审核");
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    rejectClick() {
      this.$refs.stepsModel.verificationChange("0");
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange("1");
    },
    cancelClick() {
      this.$router.go(-1);
    },
    //获取表格列表
    getListDetails(value) {
      TeamGroupExamineQueryByID(value).then((res) => {
        this.recode = res.body;
        console.log("this.recode.assessType", this.recode.assessType);
        queryDataByAssessType(this.recode.assessType).then((res) => {
          console.log("res.body", res.body);
          this.ViolationDescriptionData = res.body;
        });
      });
    },
  },
};
</script>
<style lang="less">
.ant-modal-footer {
  text-align: center !important;
}
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
