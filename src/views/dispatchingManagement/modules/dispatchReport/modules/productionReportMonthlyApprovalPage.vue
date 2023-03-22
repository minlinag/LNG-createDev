<template>
  <Breadcrumb>
    <template slot="appMain">
      <!--顶部日期-->
      <div>
        <a-form-model
          :label-col="{ style: 'width: 90px' }"
          labelAlign="right"
          class="margins"
        >
          <a-row :gutter="24">
            <a-col :span="5">
              <a-form-model-item label="发布日期">
                <a-date-picker
                  disabled
                  :valueFormat="'YYYY-MM-DD'"
                  v-model="data.releaseDate"
                  placeholder="选择日期"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="10">
              <a-form-model-item label="生产日期">
                <a-range-picker
                  show-time
                  disabled
                  v-model="data.productionDates"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  :placeholder="['开始日期', '结束日期']"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div>
        <a-row>
          <a-col :span="21">
            <a-form layout="inline" class="form">
              <!-- 前一月能耗   头 -->
              <div id="前一月能耗">
                <div class="title">前一月能耗</div>
                <a-row>
                  <a-col
                    :span="6"
                    v-for="(item, index) in fromOptions.qyrnhFromOptions"
                    :key="index"
                  >
                    <a-form-item
                      :label="item.label"
                      :labelCol="labelCol"
                      :class="item.label.length > 10 ? `row-label` : ''"
                    >
                      <a-input
                        disabled
                        v-model="data[`${item.parameterName}`]"
                        :addon-after="item.unit"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <!-- 前一月能耗   尾 -->

              <!-- 燃料气累计流量   头 -->
              <div id="燃料气累计流量">
                <div class="title">燃料气累计流量</div>
                <a-row>
                  <a-col
                    :span="6"
                    v-for="(item, index) in fromOptions.rsqFromOptions"
                    :key="index"
                  >
                    <a-form-item
                      :label="item.label"
                      :labelCol="labelCol"
                      :class="item.label.length > 10 ? `row-label` : ''"
                    >
                      <a-input
                        disabled
                        v-model="data[`${item.parameterName}`]"
                        :addon-after="item.unit"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <!-- 燃料气累计流量   尾 -->

              <!-- 各班能耗统计   头 -->
              <div id="各班能耗统计">
                <div class="title">各班能耗统计</div>
                <div class="gbnhTableDiv">
                  <table width="100%" class="gbnhTable">
                    <tr>
                      <th width="10%"></th>
                      <th width="15%">耗电量(kwh)</th>
                      <th width="15%">耗水量(t)</th>
                      <th width="15%">耗液氮量(t)</th>
                      <th width="15%">SCV自耗气(万方)</th>
                      <th width="15%">气化总量(万方)</th>
                      <th width="15%">装车总量(万方)</th>
                    </tr>
                    <tr class="evenTr">
                      <td style="text-align: center">白班</td>
                      <td
                        v-for="(item, index) in fromOptions.gbnhFromOptions
                          .dayShift"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                    </tr>
                    <tr class="oddTr">
                      <td style="text-align: center">小夜</td>
                      <td
                        v-for="(item, index) in fromOptions.gbnhFromOptions
                          .smallNight"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                    </tr>
                    <tr class="evenTr">
                      <td style="text-align: center">大夜</td>
                      <td
                        v-for="(item, index) in fromOptions.gbnhFromOptions
                          .bigNight"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                    </tr>
                    <tr class="oddTr">
                      <td style="text-align: center">一班</td>
                      <td
                        v-for="(item, index) in fromOptions.gbnhFromOptions
                          .oneClass"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr class="evenTr">
                      <td style="text-align: center">二班</td>
                      <td
                        v-for="(item, index) in fromOptions.gbnhFromOptions
                          .twoClass"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr class="oddTr">
                      <td style="text-align: center">三班</td>
                      <td
                        v-for="(item, index) in fromOptions.gbnhFromOptions
                          .threeClass"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr class="evenTr">
                      <td style="text-align: center">四班</td>
                      <td
                        v-for="(item, index) in fromOptions.gbnhFromOptions
                          .fourClass"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr class="oddTr">
                      <td style="text-align: center">五班</td>
                      <td
                        v-for="(item, index) in fromOptions.gbnhFromOptions
                          .fiveClass"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </table>
                </div>
              </div>
              <!-- 各班能耗统计   尾 -->

              <a-row>
                <a-col :span="12">
                  <div id="外输汽化量">
                    <div class="title">外输汽化量</div>
                    <a-row>
                      <a-col
                        :span="12"
                        v-for="(item, index) in fromOptions.wsqhFromOptions"
                        :key="index"
                      >
                        <a-form-item :label="item.label" :labelCol="labelCol">
                          <a-input
                            disabled
                            v-model="data[`${item.parameterName}`]"
                            :addon-after="item.unit"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div id="槽车装车量">
                    <div class="title">槽车装车量</div>
                    <a-row>
                      <a-col
                        :span="12"
                        v-for="(item, index) in fromOptions.cczcFromOptions"
                        :key="index"
                      >
                        <a-form-item :label="item.label" :labelCol="labelCol">
                          <a-input
                            disabled
                            v-model="data[`${item.parameterName}`]"
                            :addon-after="item.unit"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </a-col>
              </a-row>

              <div id="冷能利用">
                <div class="title">冷能利用</div>
                <a-row>
                  <a-col
                    :span="6"
                    v-for="(item, index) in fromOptions.lnlyFromOptions"
                    :key="index"
                  >
                    <a-form-item :label="item.label" :labelCol="labelCol">
                      <a-input
                        disabled
                        v-model="data[`${item.parameterName}`]"
                        :addon-after="item.unit"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </a-form>
            <a-row class="fillingInfo">
              <a-col :span="14"></a-col>
              <a-col :span="4">填报人：{{ data.fillUser }}</a-col>
              <a-col :span="6">编制单位：{{ data.compilingDepartment }}</a-col>
            </a-row>
            <a-row id="审批信息">
              <div class="title">审批信息</div>
              <stepsModel
                ref="stepsModel"
                :isShow="true"
                :id="data.id"
                @approvalMethod="approvalMethod"
              />
            </a-row>
          </a-col>
          <!-- 锚点 -->
          <a-col :span="3">
            <a-anchor class="anchor">
              <a-anchor-link
                v-for="(item, index) in anchorLinks"
                :key="index"
                :href="`#${item}`"
                :title="item"
              />
            </a-anchor>
          </a-col>
        </a-row>

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
  queryDetailById,
  approval,
} from "@/api/dispatchingManagement/productionReportMonthly";
import stepsModel from "@/components/approvalRecord/index.vue";

export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      labelCol: { style: "width: 180px" },
      data: {},
      anchorLinks: [
        "前一月能耗",
        "燃料气累计流量",
        "各班能耗统计",
        "外输汽化量",
        "槽车装车量",
        "冷能利用",
        "审批信息",
      ],
      fromOptions: {
        //前一月能耗
        qyrnhFromOptions: [
          {
            //文本框label
            label: "E-6501A耗气量",
            //文本框名称
            parameterName: "e6501AGasConsumption",
            //单位
            unit: "万方",
            //高限
          },
          {
            label: "E-6501B耗气量",
            parameterName: "e6501BGasConsumption",
            unit: "万方",
            highLimit: 100000,
          },
          {
            label: "E-6501C耗气量",
            parameterName: "e6501CGasConsumption",
            unit: "万方",
          },
          {
            label: "E-6501D耗气量",
            parameterName: "e6501DGasConsumption",
            unit: "万方",
          },
          {
            label: "E-6501E耗气量",
            parameterName: "e6501EGasConsumption",
            unit: "万方",
          },
          {
            label: "E-6501F耗气量",
            parameterName: "e6501FGasConsumption",
            unit: "万方",
          },
          {
            label: "E-6501G耗气量",
            parameterName: "e6501GGasConsumption",
            unit: "万方",
          },
          {
            label: "E-6501H耗气量",
            parameterName: "e6501HGasConsumption",
            unit: "万方",
          },
          {
            label: "E-6501I耗气量",
            parameterName: "e6501IGasConsumption",
            unit: "万方",
          },
          {
            label: "E-6501J耗气量",
            parameterName: "e6501JGasConsumption",
            unit: "万方",
          },
          {
            label: "A段月耗电",
            parameterName: "aperiodMonthPowerConsumption",
            unit: "kwh",
          },
          {
            label: "B+E段月耗电",
            parameterName: "beperiodMonthPowerConsumption",
            unit: "kwh",
          },
          {
            label: "BOG月耗电",
            parameterName: "bogmonthPowerConsumption",
            unit: "kwh",
          },
          {
            label: "增压压缩机月耗电",
            parameterName: "pressurizedCompressorPowerMonthConsumption",
            unit: "kwh",
          },
          {
            label: "高低压泵/海水泵月耗电",
            parameterName: "lowPressurePumpPowerMonthConsumption",
            unit: "kwh",
          },
          {
            label: "SCV月耗电",
            parameterName: "scvmonthPowerConsumption",
            unit: "kwh",
          },
          {
            label: "月耗液氮",
            parameterName: "monthConsumptionAmountLiquidNitrogen",
            unit: "t",
          },
          {
            label: "月总耗水量",
            parameterName: "monthWaterConsumption",
            unit: "t",
          },
          {
            label: "燃料气累计流量",
            parameterName: "fuelGasCumulativeAmount",
            unit: "t",
          },
          {
            label: " 锅炉燃料气累计流量 ",
            parameterName: "boilerFuelGasCumulativeFlow",
            unit: "Nm³",
          },
        ],
        //燃料气累计流量
        rsqFromOptions: [
          {
            label: "输出天然气至E-6901A累计流量",
            parameterName: "outPutNaturalGasToE6901AAmount",
            unit: "t",
          },
          {
            label: "输出天然气至E-6901B累计流量",
            parameterName: "outPutNaturalGasToE6901BAmount",
            unit: "t",
          },
          {
            label: "输出天然气至E-6901C累计流量",
            parameterName: "outPutNaturalGasToE6901CAmount",
            unit: "t",
          },
          {
            label: "输出天然气至E-6901D累计流量",
            parameterName: "outPutNaturalGasToE6901DAmount",
            unit: "t",
          },
          {
            label: "输出天然气至燃料气累计流量总和",
            parameterName: "outPutNaturalGasToFuelGasAmount",
            unit: "t",
          },
        ],
        //各班能耗统计
        gbnhFromOptions: {
          dayShift: [
            {
              label: "白班耗电量",
              parameterName: "dayShiftPowerConsumption",
            },
            {
              label: "白班耗水量",
              parameterName: "dayShiftWaterConsumption",
            },
            {
              label: "白班耗液氮量",
              parameterName: "dayShiftLiquidNitrogenConsumption",
            },
            {
              label: "白班SCV自耗气",
              parameterName: "dayShiftSCVSinceGasConsumption",
            },
            {
              label: "白班气化总量",
              parameterName: "dayShiftGasificationTotalAmount",
            },
            {
              label: "白班装车总量",
              parameterName: "dayShiftLoadingTotalAmount",
            },
          ],
          smallNight: [
            {
              label: "小夜耗电量",
              parameterName: "sayaPowerConsumption",
            },
            {
              label: "小夜耗水量",
              parameterName: "sayaWaterConsumption",
            },
            {
              label: "小夜耗液氮量",
              parameterName: "sayaLiquidNitrogenConsumption",
            },
            {
              label: "小夜SCV自耗气",
              parameterName: "sayaSCVSinceGasConsumption",
            },
            {
              label: "小夜气化总量",
              parameterName: "sayaGasificationTotalAmount",
            },
            {
              label: "小夜装车总量",
              parameterName: "sayaLoadingTotalAmount",
            },
          ],
          bigNight: [
            {
              label: "大夜耗电量",
              parameterName: "bigNightPowerConsumption",
            },
            {
              label: "大夜耗水量",
              parameterName: "bigNightWaterConsumption",
            },
            {
              label: "大夜耗液氮量",
              parameterName: "bigNightLiquidNitrogenConsumption",
            },
            {
              label: "大夜SCV自耗气",
              parameterName: "bigNightSCVSinceGasConsumption",
            },
            {
              label: "大夜气化总量",
              parameterName: "bigNightGasificationTotalAmount",
            },
            {
              label: "大夜装车总量",
              parameterName: "bigNightLoadingTotalAmount",
            },
          ],
          oneClass: [
            {
              label: "一班耗电量",
              parameterName: "powerConsumptionOneClass",
            },
            {
              label: "一班耗水量",
              parameterName: "waterConsumptionOneClass",
            },
            {
              label: "一班耗液氮量",
              parameterName: "liquidNitrogenConsumptionOneClass",
            },
          ],
          twoClass: [
            {
              label: "二班耗电量",
              parameterName: "powerConsumptionTwoClass",
            },
            {
              label: "二班耗水量",
              parameterName: "waterConsumptionTwoClass",
            },
            {
              label: "二班耗液氮量",
              parameterName: "liquidNitrogenConsumptionTwoClass",
            },
          ],
          threeClass: [
            {
              label: "三班耗电量",
              parameterName: "powerConsumptionThreeClass",
            },
            {
              label: "三班耗水量",
              parameterName: "waterConsumptionThreeClass",
            },
            {
              label: "三班耗液氮量",
              parameterName: "liquidNitrogenConsumptionThreeClass",
            },
          ],
          fourClass: [
            {
              label: "四班耗电量",
              parameterName: "powerConsumptionFourClass",
            },
            {
              label: "四班耗水量",
              parameterName: "waterConsumptionFourClass",
            },
            {
              label: "四班耗液氮量",
              parameterName: "liquidNitrogenConsumptionFourClass",
            },
          ],
          fiveClass: [
            {
              label: "五班耗电量",
              parameterName: "powerConsumptionFiveClass",
            },
            {
              label: "五班耗水量",
              parameterName: "waterConsumptionFiveClass",
            },
            {
              label: "五班耗液氮量",
              parameterName: "liquidNitrogenConsumptionFiveClass",
            },
          ],
        },
        //外输汽化量
        wsqhFromOptions: [
          {
            label: "体积",
            parameterName: "outPutGasificationVolumeWF",
            unit: "万方",
          },
          {
            label: "质量",
            parameterName: "outPutGasificationVolumeT",
            unit: "t",
          },
        ],
        //槽车装车量
        cczcFromOptions: [
          {
            label: "体积",
            parameterName: "tankerLoadingVolumeWF",
            unit: "万方",
          },
          {
            label: "质量",
            parameterName: "tankerLoadingVolumeT",
            unit: "t",
          },
        ],
        //冷能利用
        lnlyFromOptions: [
          {
            label: "前一月LNG流量",
            parameterName: "dayBeforeLNGFlowRate",
            unit: "t",
          },
        ],
      },
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
    // this.getListDetails("D03000000000039");
  },

  methods: {
    approvalMethod(type) {
      approval({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.data.id,
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

    //获得当前页面
    getListDetails(value) {
      queryDetailById(value).then((res) => {
        if (res.code == 200) {
          this.data = res.body;
          if ((this.data.productionBeginDate, this.data.productionEndDate)) {
            this.data.productionDates = [
              this.data.productionBeginDate,
              this.data.productionEndDate,
            ];
          }
        } else {
          this.$message.warning("获取月报信息失败，请刷新页面重试");
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.title {
  border-left: #0089ff 0.2rem solid;
  padding-left: 0.5rem;
  font-weight: 600;
  font-family: MicrosoftYaHei;
  font-size: 18px;
  color: #1f1f1f;
  letter-spacing: 0;
  margin: 10px 0 10px 0;
}
.ant-modal-footer {
  text-align: center !important;
}
.anchor {
  margin-left: 10px;
  min-width: 10%;
  position: fixed;
  top: 20%;
  left: 87%;
  right: 10%;
}

/deep/.ant-form label {
  font-size: 12px !important;
  color: #1f1f1f;
}

.margins {
  margin: 0 10px;
}

.gbnhTableDiv {
  text-align: left;
}
.gbnhTable td {
  padding-left: 10px;
  font-size: 12px;
  height: 36px;
}

.fillingInfo {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #000000;
  letter-spacing: 0;
  line-height: 16px;
}

.gbnhTable tr:nth-child(even) {
  background-color: #f3f5f8;
}
.evenBackground {
  background-color: #f3f5f8;
}
.evenTr {
  /deep/.ant-input {
    border: 1px solid #f3f5f8;
    font-size: 12px;
  }
}

.gbnhTable tr:nth-child(odd) {
  background-color: #ffffff;
}
.oddBackground {
  background-color: #ffffff;
}
.oddTr {
  /deep/.ant-input {
    border: 1px solid #ffffff;
    font-size: 12px;
  }
}

.gbnhTable tr:hover {
  background: rgba(24, 144, 255, 20%);
  /deep/.ant-input {
    border: 1px solid rgba(24, 144, 255, 0%);
  }
  .oddBackground {
    background-color: rgba(24, 144, 255, 0%);
  }
  .evenBackground {
    background-color: rgba(24, 144, 255, 0%);
  }
}

.ant-form-inline .ant-form-item {
  margin-right: 40px;
}

.gbnhTableDiv th {
  height: 40px;
  font-family: MicrosoftYaHei;
  font-size: 14px;
  background-color: #eeeeee;
  color: #000000;
  line-height: 20px;
}
.bottomButton {
  padding-right: 150px;
  margin-top: 40px;
}

.row-label {
  /deep/.ant-form-item-label {
    display: flex;
    justify-content: flex-end;
    line-height: 16px;
    label {
      white-space: normal;
      text-align: right;
      padding-right: 10px;
      &:after {
        content: none !important; //解决上面的样式label后面会有空格
      }
    }
  }
}
</style>
