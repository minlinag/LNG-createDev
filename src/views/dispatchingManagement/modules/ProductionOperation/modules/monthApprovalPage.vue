<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model
        :model="AnnualData"
        ref="securityCheckFormRef"
      >
        <a-divider orientation="left" style="font-weight: bolder"
          >基础信息</a-divider
        >
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="编制时间:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-date-picker
                style="width: 100%"
                disabled
                v-model="AnnualData.createdDateTime"
                valueFormat="YYYY-MM-DD"
                @change="onChange"
                placeholder="请选择日期"
              /> </a-form-model-item
          ></a-col>
          <a-col :span="8">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="编制人："
              prop="createdUser"
            >
              <a-input
                disabled
                v-model="AnnualData.createdUser"
                placeholder="请输入编制人："
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="编制部门："
              prop="createUserSubsidiaryOrgan"
            >
              <a-input
                disabled
                v-model="AnnualData.createUserSubsidiaryOrgan"
                placeholder="请输入编制部门"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="计划时间："
              :labelCol="{ style: 'width: 150px' }"
              prop="planTime"
            >
              <a-month-picker
                disabled
                format="YYYY-MM"
                :valueFormat="'YYYY-MM'"
                v-model="AnnualData.planTime"
                placeholder="选择日期"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider orientation="left" style="font-weight: bolder"
          >月度生产运行计划</a-divider
        >
        <a-row :gutter="24">
          <a-col :span="8"
            ><a-form-model-item
              :labelCol="{ style: 'width: 230px' }"
              label="气化外输量(万方)："
              prop="gasExportVolume"
            >
              <a-input
                disabled
                v-model="AnnualData.gasExportVolume"
                placeholder="请输入气化外输量"
              ></a-input> </a-form-model-item
          ></a-col>
          <a-col :span="8"
            ><a-form-model-item
              :labelCol="{ style: 'width: 230px' }"
              label="槽车外输量(万方)："
              prop="tankCarExportVolume"
            >
              <a-input
                disabled
                v-model="AnnualData.tankCarExportVolume"
                placeholder="请输入槽车外输量："
              ></a-input> </a-form-model-item
          ></a-col>
          <a-col :span="8"
            ><a-form-model-item
              :labelCol="{ style: 'width: 230px ' }"
              label="装船(预留)："
              prop="shipLoad"
            >
              <a-input
                disabled
                v-model="AnnualData.shipLoad"
                placeholder="请输入装船"
              ></a-input> </a-form-model-item
          ></a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8"
            ><a-form-model-item
              :labelCol="{ style: 'width: 230px' }"
              label="计划外输量(万方)："
              prop="planExportVolume"
            >
              <a-input
                disabled
                v-model="AnnualData.planExportVolume"
                placeholder="请输入计划外输量"
              ></a-input> </a-form-model-item
          ></a-col>
        </a-row>
        <div class="wrapper" :model="surfaceForm">
          <table class="table_list" width="100%" border="01">
            <tr align="center" style="background: #eeeeee; height: 40px">
              <td>日期</td>
              <td>气化外输量（万方）</td>
              <td>槽车装车量（万方）</td>
              <td>装船（预留）</td>
              <td>卸货量（万方）(进)</td>
            </tr>
            <tr
              align="center"
              v-for="(item, index) in monthPlanList"
              :key="index"
              class="input"
              :class="{ grey: index % 2 == 0 }"
            >
              <td>
                {{ item.planDay }}
              </td>
              <td>
                <a-input
                  v-if="item.planDay != '小计'"
                  v-model="item.gasExportVolume"
                  disabled
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                  placeholder="请输入"
                />
                <span v-else>{{ item.gasExportVolume }}</span>
              </td>
              <td>
                <a-input
                  v-if="item.planDay != '小计'"
                  v-model="item.tankCarInVolume"
                  disabled
                  placeholder="请输入"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                />
                <span v-else>{{ item.tankCarInVolume }}</span>
              </td>
              <td>
                <a-input
                  v-if="item.planDay != '小计'"
                  v-model="item.shipLoad"
                  disabled
                  placeholder="请输入"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                />
                <span v-else>{{ item.shipLoad }}</span>
              </td>
              <td>
                <a-input
                  v-if="item.planDay != '小计'"
                  disabled
                  v-model="item.unloadVolume"
                  placeholder="请输入"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                />
                <span v-else>{{ item.unloadVolume }}</span>
              </td>
            </tr>
          </table>
        </div>

        <!--审批页签部分-->

        <stepsModel
          ref="stepsModel"
          :isShow="true"
          :id="AnnualData.id"
          @approvalMethod="approvalMethod"
        />
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button type="primary" @click="agreeClick">同意</a-button>
        <a-button type="danger" @click="rejectClick">驳回</a-button>
        <a-button @click="cancelClick">返回</a-button>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  queryDetailById,
  monthPlanAudio,
} from "@/api/dispatchingManagement/yearProductionOperation";
import stepsModel from "@/components/approvalRecord/index.vue";
export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      AnnualData: {},
      surfaceForm: {},
      monthPlanList: [],
      //表格中的数据
      dataSource: [],
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
  mounted() {
    // this.getListDetails("D04000000000059");
  },
  methods: {
    approvalMethod(type) {
      monthPlanAudio({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.AnnualData.id,
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
      let type = {
        id: value,
        type: 2,
      };

      queryDetailById(type).then((res) => {
        console.log(res.body);
        this.AnnualData = res.body;
        this.monthPlanList = res.body.monthPlanList;
      });
    },
  },
};
</script>
<style scoped lang="less">
.ant-modal-footer {
  text-align: center !important;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 0px;
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item-control {
  width: 100%;
}

.ant-select-selection--single {
  width: 180px;
}

.aaaa {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}
.grey {
  background: #f3f5f8;
  /deep/.ant-input {
    background: #f3f5f8;
    border: 1px solid #f3f5f8;
  }
}
.table_list {
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