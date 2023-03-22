<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="titleSty-box">
        <h2 class="titleSty">安全风险空间分布图</h2>
      </div>
      <!-- <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="作业单位"
                >
                  <a-input
                    v-model="form.company"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item>
                  <a-button
                    v-Query
                    class="buttonType"
                    type="primary"
                    @click="search"
                  >
                    查询
                  </a-button>
                  <a-button class="buttonType" @click="resetForm">
                    重置
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div> -->
        
      <div class="area-content">
        <div class="content">
          <div class="box-left">
            <!-- 生产场所 -->
            <div class="sccs-left">
              <div class="lngmt" :class="upDateBg('LNG装卸船码头区')">
                LNG装卸船码头区
              </div>
              <div class="empty"></div>
              <div class="gzcmt" :class="upDateBg('工作船码头')">
                工作船码头
              </div>
              <div class="glA">管廊A</div>
              <div class="glAb">管廊A</div>
            </div>
          </div>
          <div class="box-right">
            <div class="sccs-right">
              <div class="glAc">管廊A</div>
              <div class="glC">管廊C</div>
              <div class="glF">管廊F</div>
              <div class="glFb">管廊F</div>
              <div class="hsq" :class="upDateBg('海水区')">海水区</div>
              <div class="hjq" :class="upDateBg('火炬区')">火炬区</div>
              <div class="lngzy" :class="upDateBg('LNG增压及BOG处理区')">
                LNG增压及BOG处理区
              </div>
              <div class="qhws" :class="upDateBg('气化外输区')">气化外输区</div>
              <div class="wscl" :class="upDateBg('污水处理及放空区')">
                污水处理及放空区
              </div>
              <div class="wxcc" :class="upDateBg('维修仓储及供暖区')">
                维修仓储及供暖区
              </div>
              <div class="zykz" :class="upDateBg('中央控制及化验区')">
                中央控制及化验区
              </div>
              <div class="dsgy" :class="upDateBg('淡水供应区')">淡水供应区</div>
              <div class="kqdq" :class="upDateBg('空气及氮气供应区')">
                空气及氮气供应区
              </div>
              <div class="xfz" :class="upDateBg('消防站')">消防站</div>
              <div class="bgcs" :class="upDateBg('办公场所')">办公场所</div>
              <div class="zbds" :class="upDateBg('总变电所')">总变电所</div>

              <div class="yjdcgq" :class="upDateBg('一阶段储罐区')">
                一阶段储罐区
                <div class="yjBox">
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
              <div class="ejdcgq" :class="upDateBg('二阶段储罐区')">
                二阶段储罐区
                <div class="yjBox">
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
              <div class="sjdcgq" :class="upDateBg('三阶段储罐区')">
                <div class="glH">管廊H</div>
                三阶段储罐区
                <div class="yjBox">
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                  <div class="yjg">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
              <div class="cccz" :class="upDateBg('槽车充装区')">槽车充装区</div>
              <div class="ylyd" :class="upDateBg('预留用地')">预留用地</div>
              <div class="glFc">管廊F</div>
            </div>
          </div>
        </div>
        <div class="fxdj">
          <h3>评价等级</h3>
          <div class="tl">
            <div class="zdfx">重大风险</div>
            <div class="jdfx">较大风险</div>
            <div class="ybfx">一般风险</div>
            <div class="dfx">低风险</div>
          </div>
        </div>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import { selectMaxVal } from '@/api/securityRiskcontrol'
export default {
  props: {
    text: String,
  },
  data() {
    return {
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageSize: 10,
        pageNum: 1,
        company: '', //作业单位
      },
      bgForm: null,
    }
  },
  created() {
    this.selectMaxVal()
  },
  methods: {
    // 获取风险列表
    selectMaxVal() {
      var dataForm = []
      selectMaxVal({}).then((res) => {
        console.log(res)
        res.body.data.forEach((item) => {
          dataForm[item.AreaName] = item['MAX(LL*EE*CC)']
        })
        this.bgForm = dataForm
      })
    },
    upDateBg(val) {
      if (this.bgForm && this.bgForm[val]) {
        return this.isKey(this.bgForm[val])
        // console.log(this.isKey(this.bgForm[val]))
      }
    },
    isKey(val) {
      if (val > 320) {
        return 'zdfxBack'
      } else if (val > 160) {
        return 'jdfxBack'
      } else if (val > 70) {
        return 'ybfxBack'
      } else if (val >= 0) {
        return 'dfxBack'
      }
    },
    //查询功能
    // search() {},
    // //重置输入
    // resetForm() {
    //   this.form = {}
    //   this.form.pageNum = 1
    //   this.form.pageSize = 10
    //   this.getList()
    // },
  },
}
</script>
<style scoped>
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout{
  margin-bottom: 0px;
}
.titleSty-box{
 width: 1050px;
}
/* 标题样式 */
.titleSty{
  width:250px;
  margin:auto;
  border-radius: 10px;
  text-align:center;
  background:rgb(232, 231, 231);
  color:red;
  font-weight:bold;
}
.area-content {
   width: 1050px;
  display: flex;
  flex-wrap: wrap;
}
.fxdj {
  /*margin-left: 20px;*/
  /*width: 180px;*/
  height: 150px;
  /* border: 1px solid #ddd; */
  text-align: center;
}
/* 图例 */
.tl {
  width: 80px;
  height: 130px;
  border: 3px solid #ddd;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  color: #fff;
}

/* 外框 */
.content {
  width: 950px;
  height: 600px;
  margin: auto;
  border-radius: 10px;
  border: 5px solid #ddd;
  margin-top: 7px;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  white-space: pre-wrap;
  background: #ffffff;
  color: rgb(255, 255, 255);
}
.content > div {
  flex: 1;
}
/* 左侧外框 */
.box-left {
  max-width: 190px;
  height: 600px;
  border-right: 1px solid #ddd;
  position: relative;
}
/* 右侧外框 */
.box-right {
  min-width: 500px;
  height: 600px;
  position: relative;
  /* border: 1px solid rgb(125, 130, 198); */
}
/* 左侧生产场所边框 */
.sccs-left {
  position: absolute;
  bottom: 0px;
  left: 12px;
  /* top: 0; */
  width: 160px;
  height: 570px;
  border: 1px solid #ddd;
  border-radius: 10px;
  border-bottom: none;
}
/* 右侧生产场所边框 */
.sccs-right {
  position: absolute;
  margin: auto;
  bottom: 0px;
  left: 0px;
  top: 0px;
  right: 0px;
  width: 740px;
  height: 570px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
/* LNG装卸船码头区 */
.lngmt {
  position: absolute;
  top: 10px;
  right: 70px;
  width: 60px;
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
  display: flex;
  align-items: flex-end;
  text-align: center;
  line-height: 40px;
}
/* 左侧空白区域 */
.empty {
  position: absolute;
  top: 10px;
  right: 70px;
  width: 30px;
  height: 70px;
  /* border: 1px solid #ddd;
  border-top: 1px solid rgb(255, 255, 255);
  border-right: 1px solid rgb(255, 255, 255); */
  background: #ffffff;
}

/* 工作船码头 */
.gzcmt {
  position: absolute;
  top: 350px;
  right: 30px;
  width: 100px;
  height: 70px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  line-height: 70px;
  background: #1fb0ee;
}
/* .area {
  border-left: none;
  border-right: 1px solid rgb(255, 255, 255);
  border-top: 1px solid #ddd;
  border-bottom: 1px solid rgb(255, 255, 255);
} */
/* 海水区 */
.hsq {
  position: absolute;
  top: 20px;
  left: 0px;
  width: 75px;
  height: 85px;
  border-top: 1px solid #ddd;
  border-radius: 10px;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #ddd;
  background: #1fb0ee;
  text-align: center;
  line-height: 85px;
}
/* 火炬区 */
.hjq {
  position: absolute;
  top: 20px;
  left: 75px;
  width: 100px;
  height: 85px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
  text-align: center;
  line-height: 85px;
}
/* LNG增压及BOG处理区 */
.lngzy {
  position: absolute;
  top: 105px;
  left: 0px;
  width: 175px;
  height: 90px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
  text-align: center;
  line-height: 90px;
}
/* 气化外输区 */
.qhws {
  position: absolute;
  top: 195px;
  left: 0px;
  width: 175px;
  height: 190px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
  text-align: center;
  line-height: 190px;
}
/* 污水处理及放空区 */
.wscl {
  position: absolute;
  top: 385px;
  left: 0px;
  width: 75px;
  height: 65px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
  text-align: center;
  line-height: 32px;
  /* white-space:wrap */
}
/* 维修仓储及供暖区 */
.wxcc {
  position: absolute;
  top: 385px;
  left: 75px;
  width: 100px;
  height: 65px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  line-height: 32px;
}
/* 中央控制 */
.zykz {
  position: absolute;
  top: 385px;
  left: 175px;
  width: 100px;
  height: 65px;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  line-height: 32px;
}
/* 淡水供应 */
.dsgy {
  position: absolute;
  top: 385px;
  left: 275px;
  width: 75px;
  height: 65px;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  line-height: 65px;
}
/* 空气氮气 */
.kqdq {
  position: absolute;
  top: 385px;
  left: 350px;
  width: 75px;
  height: 65px;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  line-height: 32px;
}
/* 消防站 */
.xfz {
  position: absolute;
  top: 450px;
  left: 0px;
  width: 100px;
  height: 75px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  line-height: 75px;
}
/* 办公场所 */
.bgcs {
  position: absolute;
  top: 450px;
  left: 0px;
  width: 275px;
  height: 120px;
  border-right: 1px solid #ddd;
  text-align: right;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  line-height: 120px;
}
/* 总变电所 */
.zbds {
  position: absolute;
  top: 450px;
  left: 275px;
  width: 150px;
  height: 120px;
  border-right: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  line-height: 120px;
  /* text-align: right; */
}
/* 槽车充装区 */
.cccz {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 292px;
  height: 202px;
  /* border-bottom: 1px solid rgb(0, 0, 0); */
  /* border-left: 1px solid rgb(0, 0, 0); */
  text-align: right;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  line-height: 223px;
}
/* 预留用地 */
.ylyd {
  position: absolute;
  bottom: 105px;
  right: 109px;
  width: 184px;
  height: 97px;
  border: 1px solid #ddd;
  /* border-right: 1px solid #ddd; */
  border-radius: 10px;
  background: #1fb0ee;
  text-align: right;
   text-align: center;
  line-height: 96px;
}
/* 一阶段储罐区 */
.yjdcgq {
  position: absolute;
  top: 0px;
  left: 195px;
  width: 542px;
  height: 115px;
  /* border-right: 1px solid rgb(0, 0, 0); */
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
}
/* 二三阶段储罐区 */
.ejdcgq {
  position: absolute;
  top: 115px;
  left: 195px;
  width: 542px;
  height: 115px;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
}
.sjdcgq {
  position: absolute;
  top: 230px;
  left: 195px;
  width: 542px;
  height: 135px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: #1fb0ee;
   text-align: center;
  /* justify-content:space-between; */
}
.yjBox {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.yjg {
  width: 90px;
  height: 90px;
  border: 1px solid #ddd;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.circle {
  width: 60px;
  height: 60px;
  border: 1px solid #ddd;
  border-radius: 50px;
  display: flex;
}
/* A管廊横向 */
.glA {
  position: absolute;
  top: 100px;
  left: 60px;
  width: 75px;
  height: 20px;
  color: white;
  background: #92d14f;
  border-radius: 10px;
   text-align: center;
  /* border: 1px solid black; */
}
/* A管廊横向右侧 */
.glAc {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 185px;
  height: 20px;
  color: white;
  background: #92d14f;
  border-radius: 10px;
   text-align: center;
  /* border: 1px solid black; */
}
/* A管廊纵向 */
.glAb {
  position: absolute;
  bottom: 10px;
  left: 125px;
  width: 20px;
  height: 458px;
  color: white;
  background: #92d14f;
  border-radius: 10px;
  /* border: 1px solid black; */
   text-align: center;
  line-height:120px;
}
/* C管廊纵向 */
.glC {
  position: absolute;
  top: 0px;
  left: 175px;
  width: 20px;
  height: 375px;
  color: white;
  background: #92d14f;
  border-radius: 10px;
   text-align: center;
  line-height: 100px;
  /* border: 1px solid black; */
}
/* F管廊横向 */
.glF {
  position: absolute;
  top: 365px;
  left: 175px;
  width: 260px;
  height: 20px;
  color: white;
  background: #92d14f;
  border-radius: 10px;
   text-align: center;
  /* border: 1px solid black; */
}
/* H管廊横向 */
.glH {
  width: 500px;
  height: 20px;
  color: white;
  background: #92d14f;
  border-radius: 10px;
   text-align: center;
  /* border: 1px solid black; */
}
/* F管廊纵向 */
.glFb {
  position: absolute;
  top: 365px;
  left: 425px;
  width: 20px;
  height: 205px;
  color: white;
  background: #92d14f;
  border-radius: 10px;
  /* border: 1px solid black; */
   text-align: center;
  line-height: 70px;
}
.glFc {
  position: absolute;
  bottom: 55px;
  left: 425px;
  width: 205px;
  height: 20px;
  color: white;
  background: #92d14f;
  border-radius: 10px;
  /* border: 1px solid black; */
   text-align: center;
}
/* 重大风险 */
.zdfx {
  height: 30px;
  line-height: 30px;
  width: 100%;
  /* border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd; */
  background: rgb(255, 0, 0);
  border-radius: 10px;
}
.zdfxBack {
  color: white;
  background: rgb(255, 0, 0);
}
/* 较大风险 */
.jdfx {
  width: 100%;
  height: 30px;
  line-height: 30px;
  /* border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd; */
  background: #ff8b01;
  border-radius: 10px;
}
.jdfxBack {
  background: #ff8b01;
  color: white;
}
/* 一般风险 */
.ybfx {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #fcf810;
  border-radius: 10px;
}
.ybfxBack {
  color: white;
  background: #fcf810;
}
/* 低风险 */
.dfx {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #1fb0ee;
  border-radius: 10px;
}
.dfxBack {
  color: white;
  background: #1fb0ee;
}
</style>
