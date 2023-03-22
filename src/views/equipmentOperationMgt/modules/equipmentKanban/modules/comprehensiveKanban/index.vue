<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="contanier">
        <div id="pie" class="pieClass"></div>
        <div v-for="item in data" :key="item.name" class="numberClass">
          <img
            :src="require(`@/static/kanban//${item.img}.jpg`)"
            width="40"
            alt=""
          />
          <span>{{ item.name }}</span>
          <span v-if="total == 0">0%</span>
          <span v-else>{{ ((item.value / total) * 100).toFixed(2) }}%</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
      <div class="cardContanier">
        <div
          class="card"
          v-for="(item, index) in dataSource"
          :key="index"
          @click="goDetail(item)"
        >
          <div class="title">{{ item.deviceTypeReal }}</div>
          <img
            v-if="Object.keys(imgsName).includes(item.deviceTypeReal)"
            :src="
              require('@/static/kanban/' +
                imgsName[item.deviceTypeReal] +
                '.png')
            "
            alt=""
          />
          <img v-else height="180" alt="没有该设备图片" />
          <div class="cetegory"></div>
        </div>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import { getList } from '@/api/equipmentOperationMgt/equipmentKanban/comprehensiveKanban.js'
export default {
  name: 'comprehensiveKanban',
  data() {
    return {
      imgsName: {
        压缩机: 'yasuoji',
        泵机: 'bengji',
        储罐: 'chuguan',
        装车撬: 'zhuangcheqiao',
        orv: 'orv',
        scv: 'scv',
      },
      dataSource: [],
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      data: [
        {
          value: 0,
          name: '运行',
          img: 'yunxing',
        },
        {
          value: 0,
          name: '停用',
          img: 'tingyong',
        },
        {
          value: 0,
          name: '备用',
          img: 'beiyong',
        },
        {
          value: 0,
          name: '待维护',
          img: 'daiweihu',
        },
      ],
      total: 0,
    }
  },
  mounted() {
    this.getList()
  },
  updated() {
    this.initCetegory()
  },
  methods: {
    initList() {
      this.dataSource.forEach((item) => {
        this.data[0].value += item.runDevice * 1
        this.data[1].value += item.stopDevice * 1
        this.data[2].value += item.remDevice * 1
        this.data[3].value += item.toMaintained * 1
      })
      this.data.forEach((item) => {
        this.total += item.value
      })
      this.initPie(this.data)
      this.initCetegory()
    },
    getList(pageNum = 1, pageSize = 999999) {
      const data = {
        pageNum,
        pageSize,
      }
      getList(data).then((res) => {
        const { data, pageIndex, total, pageSize } = res.body
        this.dataSource = data || []
        this.pagination.current = pageIndex
        this.pagination.total = total
        this.pagination.pageSize = pageSize
        this.initList()
      })
    },
    // 柱形
    initCetegory() {
      let data = []
      var myCharts = document.getElementsByClassName('cetegory')
      for (var i = 0; i < myCharts.length; i++) {
        data = [
          this.dataSource[i].runDevice,
          this.dataSource[i].stopDevice,
          this.dataSource[i].remDevice,
          this.dataSource[i].toMaintained,
        ]
        //循环所有echarts节点
        var myChart = this.$echarts.init(myCharts[i])
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                color: 'rgba(0, 0, 0, 0)',
              },
            },
          },
          grid: {
            left: '0%',
            right: '20%',
            top: '10%',
            bottom: '2%',
            containLabel: true,
          },
          xAxis: {
            type: 'value',
            show: false,
          },
          yAxis: {
            type: 'category',
            data: ['运行', '停用', '备用', '待维护'],
            axisLine: {
              //网格线
              show: false,
            },
            axisTick: {
              //刻度线
              show: false,
            },
          },
          series: {
            type: 'bar',
            barWidth: 8,
            data,
            color: '#02A4F7',
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
              },
            },
            label: {
              normal: {
                position: ['105%', '0'],
                color: '#000',
                show: true,
              },
            },
          },
        }
        myChart.setOption(option)
        //将该echarts用之前配置好的option的配置项进行渲染
        window.addEventListener('resize', function () {
          //监听窗口变动实时渲染
          myChart.resize()
        })
      }
    },
    //饼形
    initPie(data) {
      var myChart = this.$echarts.init(document.getElementById('pie'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
        },
        color: ['#01a44f', '#ee1e23', '#0366b3', '#ffd31e'],
        title: {
          // 设置饼图标题，位置设为顶部居中
          text: '设备总数',
          top: 'center',
          left: 'center',
          x: 'center',
          y: 'center',
          subtext: this.total,
        },
        series: {
          type: 'pie',
          hoverAnimation: false, //鼠标悬浮是否有区域弹出动画
          label: { show: false },
          show: false,
          minAngle: 5,
          radius: ['70%', '90%'],
          data,
        },
      })
      window.addEventListener('resize', function () {
        myChart.resize() //图表自适应的一个方法
      })
    },
    goDetail(item) {
      this.$router.push({ path: '/comprehensiveKanbanDetail' })
    },
  },
}
</script>
<style lang="less" scoped>
.contanier {
  display: flex;
  justify-content: space-around;
  align-items: center;
  word-break: break-all;
  overflow: hidden;
  .pieClass {
    width: 200px;
    height: 150px;
    z-index: 0;
  }
  .numberClass {
    display: block;
    height: 30px;
    line-height: 30px;
    span {
      margin: 0 5px 0 5px;
    }
    span:nth-child(4) {
      font-size: 30px;
    }
  }
}
.cardContanier {
  display: flex;
  widows: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  .card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(32% - 10px);
    border: 1px solid #d5d5d5;
    padding: 10px;
    margin: 12px;
    border-radius: 10px;
    img {
      height: 200px;
      width: 100%;
    }
    &:hover {
      box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
    }
    .title {
      border-left: 5px solid #02a4f7;
      padding-left: 5px;
    }
    .cetegory {
      width: 90%;
      height: 150px;
      z-index: 0;
    }
  }
}
</style>
