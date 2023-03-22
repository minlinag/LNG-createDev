<template>
  <a-row style="margin: -0.5rem" :gutter="16">
    <a-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
      <div class="Left" :model="ExportOnTheSameDay">
        <div class="title">
          <div class="icon"></div>
          <p>当日外输情况</p>
        </div>
        <a-row v-for="(item, index) in LeftTop" style="margin-bottom: -1.5rem">
          <a-col class="left" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <img :src="item.icon" style="width: 70%" />
            <p>{{ item.title }}</p>
          </a-col>
          <a-col class="fontvalue1" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            {{ ExportOnTheSameDay[item.value1] }}
          </a-col>
          <a-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <a-progress
              style="width: 100%"
              :percent="LoadingSpeedProgress"
              :show-info="false"
            />
          </a-col>
          <a-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <p class="fontunit">{{ item.unit }}</p>
            <p class="fontvalue2">{{ ExportOnTheSameDay[item.value2] }}</p>
          </a-col>
        </a-row>
      </div>

      <div class="Left" style="margin-top: 0.7rem">
        <div class="title">
          <div class="icon"></div>
          <p>近30日外输情况</p>
        </div>

        <div
          style="position: relative; z-index: 11; top: -0.5rem; font-size: 10px"
        >
          <div v-if="cube">10^4m³</div>
          <div style="margin-left: 20px" v-if="ton">t</div>
          <div
            style="
              position: absolute;
              top: 0;
              right: 0;
              width: 70%;
              z-index: 11111;
            "
          >
            <div
              style="width: 50%; float: left; margin-right: 10px"
              @click="GasificationOutput"
            >
              <div :class="{ green: cube == true, ash: cube == false }"></div>
              <div>气化外输量</div>
            </div>
            <div @click="LoadingCapacity">
              <div :class="{ ash2: cube == true, blue: cube == false }"></div>
              <div>装车量</div>
            </div>
          </div>
        </div>

        <div
          id="foldBreadChart"
          style="
            width: 100%;
            height: 17.5rem;
            margin-top: -3.5rem;
            margin-bottom: -2rem;
            z-index: 0;
          "
        ></div>
      </div>

      <div class="Left" style="margin-top: 0.7rem" :model="AnnualIndicators">
        <div class="title">
          <div class="icon"></div>
          <p>年度指标完成情况</p>
        </div>
        <a-row v-for="(item, index) in LeftTop" style="margin-bottom: -1.5rem">
          <a-col class="left" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <img :src="item.icon" style="width: 70%" />
            <p>{{ item.title }}</p>
          </a-col>
          <a-col class="fontvalue1" :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            {{ AnnualIndicators[item.value2] }}
          </a-col>
          <a-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <a-progress
              style="width: 100%"
              :percent="LoadingSpeedProgress"
              :show-info="false"
            />
          </a-col>
          <a-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <p class="fontunit">{{ item.unit }}</p>
            <p class="fontvalue2">{{ AnnualIndicators[item.value1] }}</p>
          </a-col>
        </a-row>
      </div>
    </a-col>

    <a-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
      <div class="Left">
        <a-row>
          <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="5">
            <div class="title">
              <div class="icon"></div>
              <p>当日最大运行能力</p>
            </div>
          </a-col>
          <a-col :xs="19" :sm="19" :md="19" :lg="19" :xl="19">
            <div
              style="
                font-size: 14px;
                text-align: right;
                position: relative;
                top: 1.5px;
              "
            >
              气化外输调度令：<span style="font-weight: bold">{{
                GasificationExport.transferName
              }}</span>
              <span v-html="'&nbsp;&nbsp;&nbsp;'"></span> 发令时间：<span
                style="font-weight: bold"
                >{{ GasificationExport.transferDate }}</span
              ><span v-html="'&nbsp;&nbsp;&nbsp;'"></span> 目标外输量：<span
                style="font-weight: bold"
                >{{ GasificationExport.targetExportVolume }}</span
              >（10^4 m³/d）
              <span
                >状态：<span
                  style="font-weight: bold"
                  :class="{
                    red: GasificationExport.statusName == '执行中',
                    greencolor: GasificationExport.statusName == '已关闭',
                  }"
                  >{{ GasificationExport.statusName }}</span
                ></span
              >
            </div>
          </a-col>
        </a-row>
        <a-row style="margin: -0.5rem" :gutter="20">
          <a-col
            class="righttop"
            v-for="(item, index) in ReightTop"
            :xs="4"
            :sm="4"
            :md="4"
            :lg="4"
            :xl="4"
          >
            <p style="color: #0083ff; font-size: 26px; margin-bottom: 1rem">
              {{ item.value }}
            </p>
            <p style="color: #000; font-size: 14px">{{ item.unit }}</p>
            <div
              style="
                font-weight: 600;
                color: #000;
                font-size: 14px;
                line-height: 1rem;
              "
            >
              <div
                :style="
                  (index + 1 == ReightTop.length ? 'margin-Left:-0.5rem' : '',
                  'height:3rem')
                "
              >
                {{ item.title }}
              </div>
            </div>
            <img class="imgs" :src="item.icon" />
          </a-col>
        </a-row>
      </div>

      <div class="Left" style="margin-top: 0.7rem">
        <div class="title">
          <div class="icon"></div>
          <p>储罐状态</p>
        </div>

        <div
          style="
            border: solid 1px #b0cee8;
            width: 25vw;
            float: right;
            text-align: center;
            background-color: #f5f9fc;
            padding: 2px;
            position: relative;
            top: -2.5rem;
          "
        >
          平均液位:32m<span v-html="'&nbsp;&nbsp;'"></span>
          <span v-html="'&nbsp;&nbsp;'"></span>
          有效罐容:80
          <span v-html="'&nbsp;'"> </span>
          10^4m³
        </div>

        <a-row :gutter="10" style="margin-top: 3rem; padding: 5px" class="tank">
          <a-col
            :xs="6"
            :sm="6"
            :md="6"
            :lg="6"
            :xl="6"
            v-for="(item, index) in StorageTank"
          >
            <a-row :gutter="10">
              <a-col
                :xs="10"
                :sm="10"
                :md="10"
                :lg="10"
                :xl="10"
                style="margin-top: -1rem"
              >
                <p style="line-height: 0rem">
                  {{ item.TankNo }}
                </p>
                <img
                  src="@/static/0.png"
                  style="
                    width: 35%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    z-index: 1;
                  "
                />
                <img
                  src="@/static/100.png"
                  :style="{
                    width: '35%',
                    height: item.height + '%',
                    position: 'absolute',
                    top: item.top + '%',
                    left: '0',
                    bottom: '0',
                    zindex: '4',
                  }"
                />
              </a-col>
              <a-col
                :xs="14"
                :sm="14"
                :md="14"
                :lg="14"
                :xl="14"
                style="
                  border: 1px dashed #d5d5d5;
                  float: right;
                  margin-right: 0.5rem;
                "
              >
                <div style="font-size: 12px">
                  <div style="color: #03e296">
                    <a-icon type="check-circle" theme="filled" />
                    正常
                  </div>
                  <div
                    style="text-align: left; line-height: 10px; font-size: 5px"
                  >
                    <p>
                      液位: <span class="color">{{ item.level }}</span> m
                    </p>
                    <p>
                      平均温度:
                      <span class="color">{{ item.averageTemperature }} </span>℃
                    </p>
                    <p>
                      温度差:
                      <span class="color"
                        >{{ item.TemperatureDifference }} </span
                      >℃
                    </p>
                    <p>
                      平均密度:
                      <span class="color">{{ item.AverageDensity }} </span>kg/m³
                    </p>
                    <p>
                      密度差:
                      <span class="color">{{ item.DensityDifference }}</span
                      >kg/m³
                    </p>
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <div
          style="
            border: 1px dashed #d5d5d5;
            margin: 0rem;
            margin-top: 1rem;
            padding: 5px;
            padding-top: 1.4rem;
            position: relative;
            top: 0;
            left: 0;
          "
        >
          <a-row :gutter="10" class="tank" style="margin-top: -1.4rem">
            <a-col
              :xs="6"
              :sm="6"
              :md="6"
              :lg="6"
              :xl="6"
              style="margin-top: 1.7rem; margin-bottom: 0.3rem"
              v-for="(item, index) in StorageTankBoton / 2"
            >
              <a-row :gutter="10">
                <a-col
                  :xs="10"
                  :sm="10"
                  :md="10"
                  :lg="10"
                  :xl="10"
                  style="margin-top: -1rem"
                >
                  <img src="@/static/0.png" style="width: 100%" />
                </a-col>
                <a-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14"> </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row :gutter="10" class="tank" style="margin-top: -1.4rem">
            <a-col
              :xs="6"
              :sm="6"
              :md="6"
              :lg="6"
              :xl="6"
              style="margin-top: 1.7rem; margin-bottom: 0.3rem"
              v-for="(item, index) in StorageTankBoton / 2"
            >
              <a-row :gutter="10">
                <a-col
                  :xs="10"
                  :sm="10"
                  :md="10"
                  :lg="10"
                  :xl="10"
                  style="margin-top: -1rem"
                >
                  <img src="@/static/0.png" style="width: 100%" />
                </a-col>
                <a-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14"> </a-col>
              </a-row>
            </a-col>
          </a-row>
          <div
            style="position: absolute; right: 5px; bottom: 0px; color: #d5d5d5"
          >
            待投产区域
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script>
import {
  queryTodayDetail,
  queryMonDetail,
  queryYearData,
} from "@/api/dispatchingManagement/SchedulingKanban";
import {
  getList, //查询气化外输调度令
} from "@/api/dispatchingManagement/gasificationOutgoingDispatch.js";

const StorageTank = [
  {
    TankNo: "T6201",
    level: 25,
    height: 0,
    averageTemperature: -168.71,
    TemperatureDifference: 2.49,
    AverageDensity: 451.38,
    DensityDifference: 30.29,
  },
  {
    TankNo: "T6202",
    level: 29,
    height: 0,
    averageTemperature: -168.59,
    TemperatureDifference: 2.9,
    AverageDensity: 449.19,
    DensityDifference: 30.21,
  },
  {
    TankNo: "T6203",
    level: 30,
    height: 0,
    averageTemperature: -168.57,
    TemperatureDifference: 2.68,
    AverageDensity: 454.56,
    DensityDifference: 30.73,
  },
  {
    TankNo: "T6204",
    level: 18,
    height: 0,
    averageTemperature: -168.16,
    TemperatureDifference: 2.45,
    AverageDensity: 451.21,
    DensityDifference: 30.97,
  },
];
export default {
  data() {
    return {
      LeftTop: [
        {
          title: "装车量",
          icon: require("../../../static/img5.png"),
          value1: "planLoadingCap",
          value2: "actLoadingCap",
          unit: "t",
        },
        {
          title: "气化外输量",
          icon: require("../../../static/img6.png"),
          value1: "planGasOut",
          value2: "actGasOut",
          unit: "10^4m³",
        },
        {
          title: "装船量",
          icon: require("../../../static/img7.png"),
          value1: "planUnloadShip",
          value2: "actUnloadShip",
          unit: "10^4t",
        },
      ],
      ReightTop: [
        {
          title: "气化外输",
          icon: require("../../../static/img1.png"),
          value: "6000",
          unit: "10^4m³/d",
        },
        {
          title: "BOG直压外输",
          icon: require("../../../static/img1.png"),
          value: "--",
          unit: "10^4m³/d",
        },
        {
          title: "槽车外输",
          icon: require("../../../static/img2.png"),
          value: "--",
          unit: "t/d",
        },
        {
          title: "接船能力",
          icon: require("../../../static/img3.png"),
          value: "--",
          unit: "t/h",
        },
        {
          title: "BOG再冷凝处理",
          icon: require("../../../static/img4.png"),
          value: "--",
          unit: "t/h",
        },
        {
          title: "BOG直接压缩处理能力",
          icon: require("../../../static/img4.png"),
          value: "--",
          unit: "t/h",
        },
      ],
      ExportOnTheSameDay: {},
      dataExport: [],
      dataLoading: [],
      time: [],
      ton: false,
      cube: true,
      GasificationExport: {},
      StorageTank: StorageTank,
      StorageTankBoton: 0,
      // 当日外输情况
      LoadingSpeedProgress: 0, //装车量进度
      gasificationSpeedProgress: 0, //气化外输量进度
      shipSpeedProgress: 0, //装卸船进度
      AnnualIndicators: {},
      // 年度
      LoadingSpeedProgress2: 0, //装车量进度
      gasificationSpeedProgress2: 0, //气化外输量进度
      shipSpeedProgress2: 0, //装卸船进度
    };
  },
  mounted() {
    this.StorageTankBoton = 10 - this.StorageTank.length;
    this.TankImg();
    // 查询当日外输详情
    queryTodayDetail().then((res) => {
      let data = res.body;

      data.planLoadingCap = data.planLoadingCap
        ? parseInt(data.planLoadingCap)
        : 0;
      data.actLoadingCap = data.actLoadingCap
        ? parseInt(data.actLoadingCap)
        : 0;
      data.planGasOut = data.planGasOut ? parseInt(data.planGasOut) : 0;
      data.actGasOut = data.actGasOut ? parseInt(data.actGasOut) : 0;
      data.planUnloadShip = data.planUnloadShip
        ? parseInt(data.planUnloadShip)
        : 0;
      data.actUnloadShip = data.actUnloadShip
        ? parseInt(data.actUnloadShip)
        : 0;

      this.ExportOnTheSameDay = data;

      let LoadingSpeedProgress =
        this.ExportOnTheSameDay.actLoadingCap /
        this.ExportOnTheSameDay.planLoadingCap;
      if (LoadingSpeedProgress == 1) {
        this.LoadingSpeedProgress = 100;
      } else {
        if (
          !Math.floor(this.LoadingSpeedProgress) === this.LoadingSpeedProgress
        ) {
          this.LoadingSpeedProgress = LoadingSpeedProgress.toFixed(2).slice(-2);
        }
      }
      console.log(LoadingSpeedProgress.toFixed(2).slice(-2)); //当日外输情况装车量进度

      this.gasificationSpeedProgress =
        this.ExportOnTheSameDay.actGasOut / this.ExportOnTheSameDay.planGasOut;

      if (this.gasificationSpeedProgress == 1) {
        this.gasificationSpeedProgress = 100;
      } else {
        if (
          !Math.floor(this.gasificationSpeedProgress) ===
          this.gasificationSpeedProgress
        ) {
          this.gasificationSpeedProgress = this.gasificationSpeedProgress
            .toFixed(2)
            .slice(-2);
        }
      }

      this.shipSpeedProgress =
        this.ExportOnTheSameDay.actUnloadShip /
        this.ExportOnTheSameDay.planUnloadShip;
      if (this.shipSpeedProgress == 1) {
        this.shipSpeedProgress = 100;
      } else {
        if (!Math.floor(this.shipSpeedProgress) === this.shipSpeedProgress) {
          this.shipSpeedProgress = this.shipSpeedProgress.toFixed(2).slice(-2);
        }
      }
      console.log(this.shipSpeedProgress.toFixed(2).slice(-2)); //当日外输情况气化进度
    });

    //  年度指标完成情况
    queryYearData().then((res) => {
      let data = res.body[0] ? res.body[0] : {};

      data.planLoadingCap = data.planLoadingCap
        ? parseInt(data.planLoadingCap)
        : 0;
      data.actLoadingCap = data.actLoadingCap
        ? parseInt(data.actLoadingCap)
        : 0;
      data.planGasOut = data.planGasOut ? parseInt(data.planGasOut) : 0;
      data.actGasOut = data.actGasOut ? parseInt(data.actGasOut) : 0;
      data.planUnloadShip = data.planUnloadShip
        ? parseInt(data.planUnloadShip)
        : 0;
      data.actUnloadShip = data.actUnloadShip
        ? parseInt(data.actUnloadShip)
        : 0;

      this.AnnualIndicators = data;

      let LoadingSpeedProgress =
        this.AnnualIndicators.actLoadingCap /
        this.AnnualIndicators.planLoadingCap;
      if (LoadingSpeedProgress == 1) {
        this.LoadingSpeedProgress2 = 100;
      } else {
        if (
          !Math.floor(this.LoadingSpeedProgress2) === this.LoadingSpeedProgress2
        ) {
          this.LoadingSpeedProgress2 =
            LoadingSpeedProgress.toFixed(2).slice(-2);
        }
      }

      this.gasificationSpeedProgress2 =
        this.AnnualIndicators.actGasOut / this.AnnualIndicators.planGasOut;
      if (this.gasificationSpeedProgress2 == 1) {
        this.gasificationSpeedProgress2 = 100;
      } else {
        if (
          !Math.floor(this.gasificationSpeedProgress2) ===
          this.gasificationSpeedProgress2
        ) {
          this.gasificationSpeedProgress2 = this.gasificationSpeedProgress2
            .toFixed(2)
            .slice(-2);
        }
      }

      this.shipSpeedProgress2 =
        this.AnnualIndicators.actUnloadShip /
        this.AnnualIndicators.planUnloadShip;
      if (this.shipSpeedProgress2 == 1) {
        this.shipSpeedProgress2 = 100;
      } else {
        if (!Math.floor(this.shipSpeedProgress2) === this.shipSpeedProgress2) {
          this.shipSpeedProgress2 = this.shipSpeedProgress2
            .toFixed(2)
            .slice(-2);
        }
      }
    });

    // 查询30日外输详情
    queryMonDetail().then((res) => {
      for (let i = 0; i < res.body.length; i++) {
        // 月气化外输量
        this.dataExport.push({
          value: res.body[i].monGasOut,
          code: res.body[i].productionBeginDate,
        });
        // 装车量
        this.dataLoading.push({
          value: res.body[i].monLoadingCap,
          code: res.body[i].productionBeginDate,
        });
        this.time.push(res.body[i].days);
      }
      this.brokenChart();
    });
    //查询气化外输调度令
    getList({ pageIndex: 1, pageSize: 10 }).then((res) => {
      let data = res.body.data;
      data = data.filter((item) => item.status == 1 || item.status == 3)[0];
      data.statusName = data.status == 1 ? "执行中" : "已关闭";
      this.GasificationExport = data;
    });
  },
  wacth: {
    StorageTank(val) {
      this.TankImg();
    },
  },
  methods: {
    // tanktu
    TankImg() {
      for (let i = 0; i < this.StorageTank.length; i++) {
        this.StorageTank[i].TankHeight = parseFloat(
          parseInt(this.StorageTank[i].level) / 39.98
        ).toFixed(2);

        this.StorageTank[i]["height"] = parseFloat(
          Number(this.StorageTank[i].TankHeight).toFixed(2).slice(-2) * 0.8
        ).toFixed(2);

        this.StorageTank[i].top = 100 - this.StorageTank[i].height;

        this.StorageTank[i].TankHeight = Number(this.StorageTank[i].TankHeight)
          .toFixed(2)
          .slice(-2);
      }
    },
    brokenChart() {
      this.ton = false;
      this.cube = true;
      //获取id并初始化图表
      var myChart = this.$echarts.init(
        document.getElementById("foldBreadChart")
      );

      let option = {
        tooltip: {
          //设置tip提示
          trigger: "axis",
          formatter: (params) => {
            return `
                 ${params[0].data.code}<br/>
                 ${params[0].data.value}<br/>
              `;
          },
        },
        color: [" #1CDFCA"],
        xAxis: {
          type: "category",
          // data: [
          //   "28",
          //   "29",
          //   "30",
          //   "01",
          //   "02",
          //   "03",
          //   "04",
          //   "05",
          //   "06",
          //   "07",
          //   "08",
          //   "09",
          //   "10",
          //   "11",
          //   "12",
          //   "13",
          //   "14",
          //   "15",
          //   "16",
          //   "17",
          //   "18",
          // ],
          data: this.time,
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            // data: [
            //   120, 200, 150, 80, 70, 110, 130, 10, 125, 369, 150, 148, 362, 123,
            //   248, 259, 325, 147, 158, 321, 24,
            // ],
            // data: [
            //   {
            //     value: 120,
            //     code: "2022-09-28",
            //   },
            //   {
            //     value: 200,
            //     code: "2022-09-29",
            //   },
            //   {
            //     value: 150,
            //     code: "2022-09-30",
            //   },
            //   {
            //     value: 80,
            //     code: "2022-10-01",
            //   },
            //   {
            //     value: 70,
            //     code: "2022-10-02",
            //   },
            //   {
            //     value: 110,
            //     code: "2022-10-03",
            //   },
            //   {
            //     value: 130,
            //     code: "2022-10-04",
            //   },
            // ],
            data: this.dataExport,
            type: "bar",
          },
        ],
      };
      myChart.setOption(option); //通过setOption()方法生成图表
      window.addEventListener("resize", function () {
        myChart.resize(); //图表自适应的一个方法
      });
    },
    GasificationOutput() {
      this.brokenChart();
    },
    LoadingCapacity() {
      this.ton = true;
      this.cube = false;
      //获取id并初始化图表
      var myChart = this.$echarts.init(
        document.getElementById("foldBreadChart")
      );
      // });
      //配置项
      // #1CDFCA

      let option = {
        tooltip: {
          //设置tip提示
          trigger: "axis",
          formatter: (params) => {
            return `
                ${params[0].data.code}<br/>
                 ${params[0].data.value}<br/>
              `;
          },
        },
        color: ["#1890FF"],
        xAxis: {
          type: "category",
          // data: [
          //   "28",
          //   "29",
          //   "30",
          //   "01",
          //   "02",
          //   "03",
          //   "04",
          //   "05",
          //   "06",
          //   "07",
          //   "08",
          //   "09",
          //   "10",
          //   "11",
          //   "12",
          //   "13",
          //   "14",
          //   "15",
          //   "16",
          //   "17",
          //   "18",
          // ],
          data: this.time,
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            // data: [
            //   23, 123, 423, 556, 70, 123, 130, 10, 125, 369, 150, 148, 362, 123,
            //   248, 259, 465, 786, 56, 321, 24,
            // ],
            data: this.dataLoading,
            type: "bar",
          },
        ],
      };
      myChart.setOption(option); //通过setOption()方法生成图表
      window.addEventListener("resize", function () {
        myChart.resize(); //图表自适应的一个方法
      });
    },
  },
};
</script>
<style scoped lang="less">
.Left {
  width: 100%;
  background: white;
  padding: 0.5rem;
  .left {
    text-align: center;
    font-weight: bold;
    color: #000;
    font-size: 10px;
    position: relative;
    top: -1rem;
  }
  .fontvalue1 {
    line-height: 2rem;
    font-weight: 600;
    color: #68a1e8;
    font-size: 12px;
    position: relative;
    left: 5px;
  }
  .fontunit {
    line-height: 0rem;
    margin-top: -0.8rem;
    color: #929292;
    float: right;
    font-size: 10px;
    margin-right: 1rem;
  }
  .fontvalue2 {
    color: #000;
    font-size: 14px;
    line-height: 1rem;
    margin-left: 5px;
  }
  .righttop {
    text-align: center;
    padding: 0.5rem;
    .imgs {
      width: 60%;
      margin-top: -1.5rem;
      // margin-bottom: 1.8rem;
    }
    p {
      font-weight: 700;
      line-height: 5px;
    }
  }
  .tank {
    text-align: center;
  }
}
.title {
  .icon {
    width: 0.5rem;
    height: 1.3rem;
    background-color: #68a1e8;
    float: left;
    border-radius: 50px 50px;
    margin-top: 2px;
  }
  p {
    font-weight: bold;
    color: #000;
    font-size: 16px;
    margin-left: 1rem;
  }
}
.color {
  color: #68a2e9;
  font-weight: bold;
}
.red {
  color: red;
}
.imgs {
  margin: 15% 0% 0% 0%;
  width: 60%;
  margin-top: 3.5rem;
  margin-bottom: 1.8rem;
}
.app_main {
  background: none;
  // background-color: #f0f2f5;
}
.ash {
  width: 10px;
  height: 10px;
  border: solid 0px;
  float: left;
  margin-top: 5%;
  margin-right: 5%;
  // background-color: #1ae0d4;
  background-color: #e6e6e6;
}
.ash2 {
  width: 10px;
  height: 10px;
  border: solid 0px;
  float: left;
  margin-top: 2%;
  margin-right: 2%;
  background-color: #e6e6e6;
}
.blue {
  width: 10px;
  height: 10px;
  border: solid 0px;
  float: left;
  margin-top: 2%;
  margin-right: 2%;
  background-color: #1890ff;
}
.green {
  width: 10px;
  height: 10px;
  border: solid 0px;
  float: left;
  margin-top: 5%;
  margin-right: 5%;
  background-color: #1ae0d4;
}
.red {
  color: red;
}
.greencolor {
  color: rgb(3, 226, 150);
}
.color {
  color: #68a2e9;
  font-weight: bold;
}
.TankHeight0 {
  width: 40%;
  height: 0%;
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 4;
}
.TankHeight1 {
  width: 40%;
  height: 10%;
  position: absolute;
  top: 90%;
  left: 0;
  z-index: 4;
}
.TankHeight2 {
  width: 40%;
  height: 20%;
  position: absolute;
  top: 80%;
  left: 0;
  z-index: 4;
}
.TankHeight3 {
  width: 40%;
  height: 30%;
  position: absolute;
  top: 70%;
  left: 0;
  z-index: 4;
}
.TankHeight4 {
  width: 40%;
  height: 40%;
  position: absolute;
  top: 60%;
  left: 0;
  z-index: 4;
}
.TankHeight5 {
  width: 40%;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 4;
}
.TankHeight6 {
  width: 40%;
  height: 60%;
  position: absolute;
  top: 40%;
  left: 0;
  z-index: 4;
}
.TankHeight7 {
  width: 40%;
  height: 70%;
  position: absolute;
  top: 30%;
  left: 0;
  z-index: 4;
}
.TankHeight8 {
  width: 40%;
  height: 80%;
  position: absolute;
  top: 20%;
  left: 0;
  z-index: 4;
}
</style>