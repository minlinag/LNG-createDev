<template>
  <Breadcrumb>
    <template slot="appMain">
      <div :model="surfaceForm">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item
              label="发布日期:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-date-picker
                disabled
                v-model="surfaceForm.issueDate"
                valueFormat="YYYY-MM-DD"
                placeholder="请选择日期"
              /> </a-form-model-item
          ></a-col>
          <a-col :span="16">
            <a-form-model-item
              label="生产日期:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-range-picker
                disabled
                show-time
                v-model="startDate"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始日期', '结束日期']"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item
              label="白班:"
              :labelCol="{ style: 'width: 150px' }"
              style="width: 100%"
            >
              <a-select
                disabled
                style="width: 100%"
                v-model="surfaceForm.dayWork"
                show-search
                placeholder="请选择白班"
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in team"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item></a-col
          >
          <a-col :span="8">
            <a-form-model-item
              label="小夜:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-select
                disabled
                style="width: 100%"
                v-model="surfaceForm.littleNight"
                show-search
                placeholder="请选择小夜"
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in team"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8"
            ><a-form-model-item
              label="大夜:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-select
                style="width: 100%"
                disabled
                v-model="surfaceForm.bigNight"
                show-search
                placeholder="请选择大夜"
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in team"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <table
          border="1"
          style="width: 100%; text-align: center; margin-top: 20px"
        >
          <tr>
            <th colspan="12">生产数据</th>
          </tr>
          <tr>
            <td colspan="2">日计划装载量</td>
            <td colspan="2">次计划装载量</td>
            <td colspan="2">日实际装载量</td>
            <td colspan="2">月实际装载量</td>
            <td colspan="2">年实际装载量</td>
            <td>年目标装载量</td>
            <td>目标完成率（%）</td>
          </tr>
          <tr>
            <td width="10%">
              {{ surfaceForm.dailyPlanLoadingCountCar }}
            </td>
            <td width="5%">车</td>
            <td width="10%">
              {{ surfaceForm.nextDayPlanLoadingCountCar }}
            </td>
            <td width="5%">车</td>
            <td width="10%">
              {{ surfaceForm.dailyActualLoadingCountCar }}
            </td>
            <td width="5%">车</td>
            <td width="10%">
              {{ surfaceForm.monthActualLoadingCountCar }}
            </td>
            <td width="5%">车</td>
            <td width="10%">
              {{ surfaceForm.yearActualLoadingCountCar }}
            </td>
            <td width="5%">车</td>
            <td width="15%" rowspan="2">
              {{ surfaceForm.yearTargetLoadingCount }}
            </td>
            <td width="15%" rowspan="2">
              {{ surfaceForm.targetFinishRate }}
            </td>
          </tr>
          <tr>
            <td width="10%">
              {{ surfaceForm.dailyPlanLoadingCountTon }}
            </td>
            <td width="5%">t</td>
            <td width="10%">
              {{ surfaceForm.nextDayPlanLoadingCountTon }}
            </td>
            <td width="5%">t</td>
            <td width="10%">
              {{ surfaceForm.dailyActualLoadingCountTon }}
            </td>
            <td width="5%">t</td>
            <td width="10%">
              {{ surfaceForm.monthActualLoadingCountTon }}
            </td>
            <td width="5%">t</td>
            <td width="10%">
              {{ surfaceForm.yearActualLoadingCountTon }}
            </td>
            <td width="5%">t</td>
          </tr>
          <tr align="left">
            <td colspan="12">
              自<a-date-picker
                disabled
                style="width: 20%"
                v-model="surfaceForm.LNGTankerDate"
                value-format="YYYY-MM-DD"
              />
              至今，LNG槽车充装站累计液态外输（
              {{ surfaceForm.accumulateLiquidExport }}
              ）吨，累计装载车辆（
              {{ surfaceForm.accumulateLoadingCar }}
              ）车。
            </td>
          </tr>
        </table>
        <table
          border="1"
          style="width: 100%; text-align: center; margin-top: 20px"
        >
          <tr>
            <th colspan="13">装车撬使用情况</th>
          </tr>
          <tr>
            <td>装车撬A</td>
            <td>装车撬B</td>
            <td>装车撬C</td>
            <td>装车撬D</td>
            <td>装车撬E</td>
            <td>装车撬F</td>
            <td>装车撬G</td>
            <td>装车撬H</td>
            <td>装车撬I</td>
            <td>装车撬J</td>
            <td>装车撬K</td>
            <td>装车撬L</td>
            <td>装车撬M</td>
          </tr>
          <tr>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryA"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryB"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryC"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryD"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryE"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryF"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryG"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryH"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryI"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryJ"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryK"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryL"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryM"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
          </tr>
          <tr>
            <td>装车撬N</td>
            <td>装车撬O</td>
            <td>装车撬P</td>
            <td>装车撬Q</td>
            <td>装车撬R</td>
            <td>装车撬S</td>
            <td>装车撬T</td>
            <td>装车撬U</td>
            <td>装车撬V</td>
            <td>装车撬W</td>
            <td>装车撬X</td>
            <td>装车撬Y</td>
            <td>装车撬Z</td>
          </tr>
          <tr>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryN"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryO"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryP"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryQ"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryR"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryS"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryT"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryU"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryV"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryW"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryX"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryY"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.loadingPryZ"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
          </tr>
          <tr align="left">
            <td colspan="13">
              装车撬使用情况说明：<a-input
                disabled
                style="width: 20%"
                placeholder="请输入"
                v-model="surfaceForm.loadingPryRemark"
              />
            </td>
          </tr>
        </table>
        <table
          border="1"
          style="width: 100%; text-align: center; margin-top: 20px"
        >
          <tr>
            <th colspan="5">地磅系统使用情况</th>
          </tr>
          <tr>
            <td>1#地磅</td>
            <td>2#地磅</td>
            <td>3#地磅</td>
            <td>4#地磅</td>
            <td style="width: 50%">使用说明</td>
          </tr>
          <tr>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.oneWagonBalance"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.twoWagonBalance"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.threeWagonBalance"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-select
                disabled
                style="width: 100%"
                class="company-select"
                ref="select"
                v-model="surfaceForm.fourWagonBalance"
                :options="Loading"
                placeholder="请选择"
              ></a-select>
            </td>
            <td>
              <a-input
                disabled
                :bordered="false"
                class="company-input"
                v-model="surfaceForm.wagonBalanceUseRemark"
                placeholder="请输入"
              ></a-input>
            </td>
          </tr>
        </table>
        <table
          border="1"
          style="width: 100%; text-align: center; margin-top: 20px"
        >
          <tr>
            <th colspan="7">现场生产动态</th>
          </tr>
          <tr>
            <td>序号</td>
            <td>作业内容</td>
            <td>作业类别</td>
            <td>作业单位</td>
            <td>工作期限</td>
            <td>完成情况</td>
            <td>负责人</td>
          </tr>
          <tr v-for="(item, index) in ProductionTrends" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.WorkContent }}</td>
            <td>{{ item.OperationTypeName }}</td>
            <td>{{ item.WorkUnit }}</td>
            <td>{{ item.A }}</td>
            <td>{{ item.RecordStatus }}</td>
            <td>{{ item.PersonInCharge }}</td>
          </tr>
        </table>
        <table
          border="1"
          style="width: 100%; text-align: center; margin-top: 20px"
        >
          <tr>
            <td>填表人：{{ surfaceForm.informant }}</td>
            <td>审核人：{{ surfaceForm.toDoUserName }}</td>
            <td>编制部门：{{ surfaceForm.establishDepartment }}</td>
          </tr>
        </table>

        <!--审批页签部分-->
        <stepsModel
          ref="stepsModel"
          :isShow="true"
          :id="surfaceForm.id"
          @approvalMethod="approvalMethod"
        />
        <div class="ant-modal-footer">
          <a-button type="primary" @click="agreeClick">同意</a-button>
          <a-button type="danger" @click="rejectClick">驳回</a-button>
          <a-button @click="cancelClick">返回</a-button>
        </div>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  queryById,
  queryOperationCondition,
  monthPlanAudio,
} from "@/api/loadingDaily.js";
import stepsModel from "@/components/approvalRecord/index.vue";
export default {
  components: { stepsModel },
  data() {
    return {
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      Loading: [
        { value: "正常", label: "正常" },
        { value: "备用", label: "备用" },
        { value: "维修中", label: "维修中" },
      ],
      team: [
        { value: "一班", label: "一班" },
        { value: "二班", label: "二班" },
        { value: "三班", label: "三班" },
        { value: "四班", label: "四班" },
        { value: "五班", label: "五班" },
      ],
      surfaceForm: {},
      startDate: [],

      //表格中的数据
      dataSource: [],
      ProductionTrends: [],
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
    // this.getListDetails("C04000000000013");
  },
  methods: {
    approvalMethod(type) {
      monthPlanAudio({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.surfaceForm.id,
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

    getListDetails(value) {
      queryById(value).then((res) => {
        this.surfaceForm = res.body;
        this.startDate[0] = this.surfaceForm.startProductionDate;
        this.startDate[1] = this.surfaceForm.endProductionDate;
        queryOperationCondition({
          startProductionDate: this.surfaceForm.startProductionDate,
        }).then((res) => {
          this.ProductionTrends = res.body;
        });
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

/* .ant-select-selection--single {
  width: 180px;
} */
/deep/.ant-select-selection--single {
  width: 100%;
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
</style>