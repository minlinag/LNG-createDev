<template>
  <div style="margin: -0.5rem; overflow: hidden">
    <a-row :gutter="5">
      <a-col :span="8" v-for="(item, index) in titleData" :key="index">
        <a-card
          style="width: 100%"
          class="title"
          :style="{
            '--color': `${item.percent * 1 < 0 ? '#2561f1' : '#f5f5f5'}`,
            '--colorAction': `${item.percent * 1 < 0 ? '#f5f5f5' : '#2561f1'}`,
            '--numColor': `${item.percent * 1 > 0 ? '#f88f7e' : '#4edb7c'}`,
            '--width': `${
              item.percent * 1 === 0
                ? 0
                : item.percent * 1 > 0
                ? (Math.abs(item.percent * 1) / 100) * 100
                : 100 - (Math.abs(item.percent * 1) / 100) * 100
            }%`,
          }"
        >
          <img class="img" :src="item.img" />
          <div class="right">
            <p class="title">{{ item.title }}</p>
            <div style="position: relative; top: -0.7rem">
              <span class="num">{{ item.percent }}%</span>
              <img
                v-if="item.percent * 1 !== 0"
                class="imgs"
                :src="
                  require(`@/assets/img/${
                    item.percent * 1 < 0 ? 'icon4' : 'icon5'
                  }.png`)
                "
              />
            </div>
            <span class="progressNum">{{ item.percent * 1 }}</span>
            <div class="progress">
              <div class="percent"></div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="5" style="margin-top: 5px">
      <a-col :span="16">
        <!-- 单耗 -->
        <div style="background: #ececec">
          <a-card :bordered="false" style="width: 100%">
            <p class="echartsTitle">单耗</p>
            <p style="position: relative; top: 1rem">千瓦时</p>
            <div
              id="SingleConsumption"
              style="
                width: 63vw;
                height: 19rem;
                margin: -3rem 0rem -2.5rem -4rem;
              "
            ></div>
          </a-card>
        </div>
        <!-- 综合能耗 -->
        <div style="background: #ececec; margin-top: 0.5rem">
          <a-card :bordered="false" style="width: 100%">
            <p class="echartsTitle">综合能耗</p>
            <p style="position: relative; top: 1rem">千瓦时</p>
            <!-- <p style="float: right; margin-top: -2.7rem">近5年</p> -->
            <div
              id="EnergyConsumption"
              style="
                width: 63vw;
                height: 18rem;
                margin: -3rem 0rem -2.5rem -4rem;
              "
            ></div>
          </a-card>
        </div>
      </a-col>
      <a-col :span="8">
        <!-- 能耗占比 -->
        <div style="background: #ececec">
          <a-card :bordered="false" style="width: 100%">
            <div class="echartsTitle">
              <span>能耗占比</span>
              <a-select @change="handleChange" v-model="choose">
                <a-select-option :key="Date.now()" value="1"
                  >年</a-select-option
                >
                <a-select-option :key="Date.now()" value="2"
                  >月</a-select-option
                >
              </a-select>
            </div>
            <div
              id="EnergyConsumptionRatio"
              style="
                width: 28vw;
                height: 17.1rem;
                margin: -1.4rem 0rem 0rem -5rem;
              "
            ></div>
          </a-card>
        </div>
        <!-- 能耗分析 -->
        <div style="background: #ececec; margin-top: 0.5rem">
          <a-card :bordered="false" class="EnergyConsumption">
            <p class="echartsTitle">能耗分析</p>
            <a-tabs
              default-active-key="1"
              @change="callback"
              style="margin-bottom: -1rem"
            >
              <a-tab-pane
                v-for="item in tabTitle"
                :key="item.index"
                :tab="item.name"
                class="tabsBody"
              >
                <a-card
                  :bordered="false"
                  class="card"
                  v-for="(itemC, index) in fenxiData"
                  :key="index"
                >
                  <div class="body">
                    <div>
                      <p class="title">{{ itemC }}</p>
                      <p v-if="index === 0" class="number">
                        {{ queryCompareData[item.index] }}%
                      </p>
                      <p v-else class="number">
                        {{ queryCompareData[item.indexT] }}%
                      </p>
                    </div>
                    <div>
                      <div v-if="index === 0" class="monye">
                        {{ queryCompareData[item.index] }}￥
                      </div>
                      <div v-else class="monye">
                        {{ queryCompareData[item.indexT] }}￥
                      </div>
                      <div class="imgBox">
                        <img
                          class="imgs"
                          width="15"
                          :src="
                            require(`@/assets/img/${
                              (index === 0
                                ? queryCompareData[item.index]
                                : queryCompareData[item.indexT]) < 0
                                ? 'icon4'
                                : 'icon5'
                            }.png`)
                          "
                        />
                      </div>
                    </div>
                  </div>
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import {
  queryCurrentMonth,
  getFiveYearData,
  queryCompare,
  queryProportion,
} from '@/api/energyManagement/energyAnalysis/energyAnalysis.js'
export default {
  data() {
    return {
      choose: '1',
      queryCompareData: '',
      tabTitle: [
        { name: '电', index: 'eleMonth', indexT: 'eleYear' },
        { name: '水', index: 'waterMonth', indexT: 'waterYear' },
        { name: '液氮', index: 'nitrogenMonth', indexT: 'nitrogenYear' },
        { name: '自耗气', index: 'selfGasMonth', indexT: 'selfGasYear' },
        { name: '柴油', index: 'otherMonth', indexT: 'otherYear' },
      ],
      titleData: [
        {
          title: '本月外输总量',
          img: require('@/assets/img/外输.png'),
          percent: 0,
        },
        {
          title: '本月综合能耗',
          img: require('@/assets/img/能耗.png'),
          percent: 0,
        },
        {
          title: '本月单耗',
          img: require('@/assets/img/单耗.png'),
          percent: 0,
        },
      ],
      dataSourcesY: [],
      dataSourcesM: [],
      fenxiData: ['环比增长', '同比增长'],
      myChart: '',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.queryCurrentMonth()
      this.getFiveYearData()
      this.queryCompare()
      this.queryProportion()
    },
    // 当月数据
    queryCurrentMonth() {
      queryCurrentMonth().then((res) => {
        let { body } = res
        this.titleData[0].percent = body.totalOutput
        this.titleData[1].percent = body.totalEnergy
        this.titleData[2].percent = body.unitConsum
      })
    },
    // 单耗/综合能耗
    getFiveYearData() {
      getFiveYearData().then((res) => {
        let { body } = res
        let unitConsum = []
        let totalEnergy = []
        let ID = 0
        body.forEach((element, index) => {
          if (index % 12 === 0) {
            unitConsum[ID] = {
              name: '',
              data: [],
            }
            totalEnergy[ID] = {
              name: '',
              data: [],
            }
            unitConsum[ID].name =
              unitConsum[ID].name || element.reportDate.split('-')[0]
            totalEnergy[ID].name =
              totalEnergy[ID].name || element.reportDate.split('-')[0]
            ID++
          }
          unitConsum[ID - 1].data.push(element.unitConsum)
          totalEnergy[ID - 1].data.push(element.totalEnergy)
        })
        this.FunSingleConsumption(unitConsum)
        this.FunEnergyConsumption(totalEnergy)
      })
    },
    // 饼图
    queryProportion() {
      queryProportion().then((res) => {
        let { body } = res
        this.tabTitle.forEach((resT) => {
          this.dataSourcesM.push({
            name: resT.name,
            value: body[resT.index],
          })
          this.dataSourcesY.push({
            name: resT.name,
            value: body[resT.indexT],
          })
        })
        this.FunEnergyConsumptionRatio(this.dataSourcesY)
      })
    },
    handleChange() {
      this.FunEnergyConsumptionRatio(
        this.choose === '1' ? this.dataSourcesY : this.dataSourcesM
      )
    },
    // 能耗分析
    queryCompare() {
      queryCompare().then((res) => {
        let { body } = res
        this.queryCompareData = body
      })
    },
    // 单耗
    FunSingleConsumption(data) {
      let myChart = this.$echarts.init(
        document.getElementById('SingleConsumption')
      )
      let month = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ]
      let color = ['#FFBF88', '#6D6ED8', '#6DBBFF', '#B48BEC', '#94ef55']
      let dataSeries = data.map((res, index) => {
        return {
          name: res.name,
          data: res.data,
          type: 'line',
          showSymbol: true, //是否默认展示圆点
          symbolSize: 8, //设定实心点的大小
          itemStyle: {
            normal: {
              borderColor: color[index],
              borderWidth: 0.5,
            },
          },
          smooth: true, //true 为平滑曲线，false为直线
        }
      })
      myChart.setOption({
        legend: {
          orient: 'horizontal',
          right: '10%',
          icon: 'rect',
          textStyle: { color: '#c0c0c0' },
          data: ['2019', '2020', '2021', '2022', '2023'],
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: month,
          axisLine: { lineStyle: { color: ['#c0c0c0'] }, interval: 0 },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: ['#efefef'], type: 'dashed' } },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        color: color,
        series: dataSeries,
      })
    },
    // 综合能耗
    FunEnergyConsumption(data) {
      let myChart = this.$echarts.init(
        document.getElementById('EnergyConsumption')
      )
      let month = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ]
      let color = ['#FFBF88', '#6D6ED8', '#6DBBFF', '#B48BEC', '#94ef55']
      let dataSeries = data.map((res, index) => {
        return {
          name: res.name,
          data: res.data,
          type: 'line',
          smooth: true, //面积图改成弧形状
          lineStyle: {
            width: 1, //外边线宽度
            color: color[index], //外边线颜色
          },
          showSymbol: true, //是否默认展示圆点
          symbolSize: 8, //设定实心点的大小
          itemStyle: {
            normal: {
              borderColor: color[index],
              borderWidth: 0.5,
            },
          },
          areaStyle: {
            //区域填充渐变颜色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: color[index], // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#6ebbff00', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        }
      })
      myChart.setOption({
        legend: {
          show: true,
          orient: 'horizontal',
          right: '10%',
          icon: 'rect',
          textStyle: { color: '#c0c0c0' },
          data: ['2019', '2020', '2021', '2022', '2023'],
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: month,
          axisLine: { lineStyle: { color: ['#c0c0c0'] }, interval: 0 },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: ['#efefef'], type: 'dashed' } },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        color: ['#FFBF88', '#6D6ED8', '#6DBBFF', '#B48BEC', '#94ef55'],
        series: dataSeries,
      })
    },
    // 能耗占比
    FunEnergyConsumptionRatio(data) {
      this.myChart = this.$echarts.init(
        document.getElementById('EnergyConsumptionRatio')
      )

      let option = {
        legend: {
          icon: 'circle',
          itemHeight: 7,
          align: 'left',
          orient: 'vertical',
          x: 'right',
          y: 'center',
          data: ['电', '水', '液氮', '自耗气', '柴油'],
          formatter(name) {
            let than = data
            let tarValue
            for (let i = 0, l = than.length; i < l; i++) {
              if (than[i].name == name) {
                tarValue = than[i].value * 1
              }
            }
            return name + ' ' + ' ' + tarValue + '%'
          },
        },
        color: ['#71beff', '#ffbf88', '#a878e9', '#6d6ed8', '#8384de'],
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '60%'],
            label: { show: false },
            // avoidLabelOverlap: false,
            // itemStyle: {
            //   borderRadius: 10,
            //   borderColor: "#fff",
            //   borderWidth: 2,
            // },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: 40,
            //     fontWeight: "bold",
            //   },
            // },
            // labelLine: {
            //   show: false,
            // },
            data,
          },
        ],
      }
      option && this.myChart.setOption(option, true)
    },
    // Tabs
    callback() {},
  },
}
</script>

<style lang="less" scoped>
.imgs {
  transform: rotate(180deg);
}
.title {
  .img {
    float: left;
  }
  .imgs {
    position: relative;
    top: -0.7rem;
    left: 1rem;
  }
  .right {
    margin-left: 5.5rem;
  }
  p {
    line-height: 0.5rem;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #292929;
  }
  .num {
    font-weight: 700;
    font-size: 35px;
    color: var(--numColor);
  }
  .progressNum {
    position: relative;
    z-index: 999;
    color: #2561f1;
    top: 10px;
    margin-left: calc(var(--width) - 10px);
  }
  .progress {
    background-color: var(--color);
    height: 5px;
    border-radius: 10px;
    position: relative;
    top: -1rem;
    overflow: hidden;
    .percent {
      height: 5px;
      background-color: var(--colorAction);
      width: var(--width);
    }
  }
}
.echartsTitle {
  /deep/.ant-select-selection {
    margin-top: -12px;
  }
  position: relative;
  top: 0.5rem;
  // left: 1.7rem;
  font-size: 20px;
  color: black;
  font-weight: 700;
  line-height: 0px;
  z-index: 9999;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.card {
  width: 100%;
  border-radius: 10px;
  background: #2561f1;
  color: #fff;
  padding-bottom: 8px;
  margin-bottom: 15px;
  .body {
    line-height: 0rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: 600;
    }
    .number {
      font-size: 30px;
      position: relative;
      top: 1.4rem;
    }
    .monye {
      font-size: 16px;
      float: left;
    }
    .imgBox {
      float: right;
      position: relative;
      top: -0.5rem;
      margin-left: 10px;
    }
    .imgs {
      // transform:rotate(180deg);
    }
  }
}
</style>
