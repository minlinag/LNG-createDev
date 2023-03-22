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
              <!-- 前一日能耗   头 -->
              <div id="前一日能耗">
                <div class="title">前一日能耗</div>
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
              <!-- 前一日能耗   尾 -->

              <!-- 外输分析小屋分析数据   头 -->
              <div id="外输分析小屋分析数据">
                <div class="title">外输分析小屋分析数据</div>
                <a-row>
                  <a-col
                    :span="6"
                    v-for="(item, index) in fromOptions.wsxwFromOptions"
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
              <!-- 外输分析小屋分析数据   尾 -->

              <!-- 早8：00出站运行参数   头 -->
              <div id="早8：00出站运行参数">
                <div class="title">早8：00出站运行参数</div>
                <a-row>
                  <a-col
                    :span="6"
                    v-for="(item, index) in fromOptions.czcsFromOptions"
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
              <!-- 早08:00出站运行参数   头 -->

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
                  </table>
                </div>
              </div>
              <!-- 各班能耗统计   尾 -->

              <!-- 早8：00储罐参数   头 -->
              <div id="早8：00储罐参数">
                <div class="title">早8：00储罐参数</div>
                <div class="gbnhTableDiv">
                  <table width="100%" class="gbnhTable">
                    <tr>
                      <th width="19%" style="text-align: center">储罐</th>
                      <th width="27%">位号压力(kPa)</th>
                      <th width="27%">罐液位(mm)</th>
                      <th width="27%">LNG库存(m³)</th>
                    </tr>
                    <tr class="evenTr">
                      <td style="text-align: center">1#储罐</td>
                      <td
                        v-for="(item, index) in fromOptions.cgcsFromOptions
                          .cgcsFromOptions1"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                    </tr>
                    <tr class="oddTr">
                      <td style="text-align: center">2#储罐</td>

                      <td
                        v-for="(item, index) in fromOptions.cgcsFromOptions
                          .cgcsFromOptions2"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                    </tr>
                    <tr class="evenTr">
                      <td style="text-align: center">3#储罐</td>

                      <td
                        v-for="(item, index) in fromOptions.cgcsFromOptions
                          .cgcsFromOptions3"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                    </tr>
                    <tr class="oddTr">
                      <td style="text-align: center">4#储罐</td>

                      <td
                        v-for="(item, index) in fromOptions.cgcsFromOptions
                          .cgcsFromOptions4"
                        :key="index"
                      >
                        {{ data[`${item.parameterName}`] }}
                      </td>
                    </tr>
                  </table>
                  <a-row>
                    <a-col
                      :span="6"
                      v-for="(item, index) in fromOptions.cgcsFromOptions
                        .totalFromOptions"
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
              </div>
              <!-- 早8：00储罐参数   尾 -->

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
              <!-- <a-col :span="6"
                >编制单位：北京燃气（天津）液化天然气有限公司</a-col
              > -->
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
              <!-- <a-anchor class="anchor"> -->
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
  getDataByID,
  approval,
} from "@/api/dispatchingManagement/productionReportDaily.js";
import stepsModel from "@/components/approvalRecord/index.vue";

export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      data: {},
      labelCol: { style: "width: 180px" },
      anchorLinks: [
        "前一日能耗",
        "外输分析小屋分析数据",
        "早8：00出站运行参数",
        "燃料气累计流量",
        "各班能耗统计",
        "早8：00储罐参数",
        "外输汽化量",
        "槽车装车量",
        "冷能利用",
        "审批信息",
      ],
      fromOptions: {
        //前一日能耗
        qyrnhFromOptions: [
          {
            //文本框label
            label: "E-6501A耗气量",
            //文本框名称
            parameterName: "e6501AGasConsumption",
            //单位
            unit: "万方",
            //高限
            highLimit: 10000,
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
            label: "A段日耗电",
            parameterName: "aperiodDayPowerConsumption",
            unit: "kwh",
          },
          {
            label: "B+E段日耗电",
            parameterName: "beperiodDayPowerConsumption",
            unit: "kwh",
          },
          {
            label: "BOG日耗电",
            parameterName: "bogdayPowerConsumption",
            unit: "kwh",
          },
          {
            label: "增压压缩机日耗电",
            parameterName: "pressurizedCompressorPowerConsumption",
            unit: "kwh",
          },
          {
            label: "高低压泵/海水泵日耗电",
            parameterName: "lowPressurePumpPowerConsumption",
            unit: "kwh",
          },
          {
            label: "SCV日耗电",
            parameterName: "scvdayPowerConsumption",
            unit: "kwh",
          },
          {
            label: "日耗液氮",
            parameterName: "dayConsumptionAmountLiquidNitrogen",
            unit: "t",
          },
          {
            label: "日总耗水量",
            parameterName: "dayWaterConsumption",
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
        //外输分析小屋分析数据
        wsxwFromOptions: [
          { label: "甲烷", parameterName: "methane", unit: "%" },
          { label: "乙烷", parameterName: "ethane", unit: "%" },
          { label: "丙烷", parameterName: "propane", unit: "%" },
          { label: "异丁烷", parameterName: "isobutane", unit: "%" },
          { label: "正丁烷", parameterName: "nbutane", unit: "%" },
          { label: "异戊烷", parameterName: "isopentane", unit: "%" },
          { label: "正戊烷", parameterName: "npentane", unit: "%" },
          { label: "新戊烷", parameterName: "newPentane", unit: "%" },
          { label: "C6+", parameterName: "c6", unit: "%" },
          { label: "氮气", parameterName: "nitrogen", unit: "%" },
          { label: "二氧化碳", parameterName: "carbonDioxide", unit: "%" },
          {
            label: "低位热值",
            parameterName: "lowCalorificValue",
            unit: "MJ/m³",
          },
          {
            label: "高位热值",
            parameterName: "highCalorificValue",
            unit: "MJ/m³",
          },
          { label: "硫化氢", parameterName: "hydrogenSulfide", unit: "MJ/m³" },
          { label: "总硫", parameterName: "totalSulfur", unit: "MJ/m³" },
          {
            label: "水常压露点",
            parameterName: "atmosphericDewPointWater",
            unit: "℃",
          },
          {
            label: "烃常压露点",
            parameterName: "hydrocarbonAtmosphericDewPoint",
            unit: "℃",
          },
        ],
        //早08:00出站运行参数
        czcsFromOptions: [
          { label: "出站流量", parameterName: "outboundFlow", unit: "t/h" },
          { label: "出站压力", parameterName: "outboundPressure", unit: "MPa" },
          {
            label: "出站温度",
            parameterName: "outboundTemperature",
            unit: "℃",
          },
          {
            label: "海水温度A",
            parameterName: "seaWaterTemperatureA",
            unit: "℃",
          },
          {
            label: "海水温度B",
            parameterName: "seaWaterTemperatureB",
            unit: "℃",
          },
          {
            label: "海水温度C",
            parameterName: "seaWaterTemperatureC",
            unit: "℃",
          },
          {
            label: "海水温度D",
            parameterName: "seaWaterTemperatureD",
            unit: "℃",
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
              highLimit: 10000,
            },
            {
              label: "小夜耗水量",
              parameterName: "sayaWaterConsumption",
              highLimit: 10000,
            },
            {
              label: "小夜耗液氮量",
              parameterName: "sayaLiquidNitrogenConsumption",
              highLimit: 10000,
            },
            {
              label: "小夜SCV自耗气",
              parameterName: "sayaSCVSinceGasConsumption",
              highLimit: 10000,
            },
            {
              label: "小夜气化总量",
              parameterName: "sayaGasificationTotalAmount",
              highLimit: 10000,
            },
            {
              label: "小夜装车总量",
              parameterName: "sayaLoadingTotalAmount",
              highLimit: 10000,
            },
          ],
          bigNight: [
            {
              label: "大夜耗电量",
              parameterName: "bigNightPowerConsumption",
              highLimit: 10000,
            },
            {
              label: "大夜耗水量",
              parameterName: "bigNightWaterConsumption",
              highLimit: 10000,
            },
            {
              label: "大夜耗液氮量",
              parameterName: "bigNightLiquidNitrogenConsumption",
              highLimit: 10000,
            },
            {
              label: "大夜SCV自耗气",
              parameterName: "bigNightSCVSinceGasConsumption",
              highLimit: 10000,
            },
            {
              label: "大夜气化总量",
              parameterName: "bigNightGasificationTotalAmount",
              highLimit: 10000,
            },
            {
              label: "大夜装车总量",
              parameterName: "bigNightLoadingTotalAmount",
              highLimit: 10000,
            },
          ],
        },
        //早8：00储罐参数
        cgcsFromOptions: {
          //1#储罐
          cgcsFromOptions1: [
            {
              label: "1#储罐位号压力",
              parameterName: "storageTankNoPressure1",
            },
            {
              label: "1#罐液位",
              parameterName: "storageTankLevelPosition1",
            },
            {
              label: "1#储罐LNG库存",
              parameterName: "storageTankLNGinventory1",
            },
          ],
          //2#储罐
          cgcsFromOptions2: [
            {
              label: "2#储罐位号压力",
              parameterName: "storageTankNoPressure2",
            },
            {
              label: "2#罐液位",
              parameterName: "storageTankLevelPosition2",
            },
            {
              label: "2#储罐LNG库存",
              parameterName: "storageTankLNGinventory2",
            },
          ],
          //3#储罐
          cgcsFromOptions3: [
            {
              label: "3#储罐位号压力",
              parameterName: "storageTankNoPressure3",
            },
            {
              label: "3#罐液位",
              parameterName: "storageTankLevelPosition3",
            },
            {
              label: "3#储罐LNG库存",
              parameterName: "storageTankLNGinventory3",
            },
          ],
          //4#储罐
          cgcsFromOptions4: [
            {
              label: "4#储罐位号压力",
              parameterName: "storageTankNoPressure4",
            },
            {
              label: "4#罐液位",
              parameterName: "storageTankLevelPosition4",
            },
            {
              label: "4#储罐LNG库存",
              parameterName: "storageTankLNGinventory4",
            },
          ],
          //总计
          totalFromOptions: [
            {
              label: "储罐总液位",
              parameterName: "storageTankTotalLevel",
              unit: "mm",
            },
            {
              label: "总有效库存",
              parameterName: "totalEffectiveInventory",
              unit: "m³",
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
            label: "前一日LNG流量",
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
    // this.getListDetails("D02000000000197");
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
      getDataByID({ ID: value }).then((res) => {
        console.log("res", res);
        this.data = res.body;
        if (this.data.productionBeginDate && this.data.productionEndDate) {
          this.data.productionDates = [
            this.data.productionBeginDate,
            this.data.productionEndDate,
          ];
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.ant-modal-footer {
  text-align: center !important;
}
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
