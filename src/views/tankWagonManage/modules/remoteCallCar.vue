<template>
  <div style="margin: -0.8rem">
    <a-card style="height: 15.5rem">
      <a-row :gutter="30">
        <a-col class="gutter-row" :span="7">
          <div class="gutter-box">
            <p>当日计划完成情况</p>
            <a-row>
              <a-col class="gutter-row" :span="12">
                <div
                  id="Chartleft"
                  style="
                    position: relative;
                    top: -3rem;
                    width: 100%;
                    height: 12rem;
                  "
                ></div>
                <div class="botom">
                  <p>装车数量</p>
                  <img src="@/static/remoteCallCar/icon1.png" />
                </div>
              </a-col>
              <a-col class="gutter-row" :span="12">
                <div
                  id="Chartright"
                  style="
                    position: relative;
                    top: -3rem;
                    width: 100%;
                    height: 12rem;
                  "
                ></div>
                <div class="botom">
                  <p>装车量（吨）</p>
                  <img
                    style="width: auto; height: 2.5rem"
                    src="@/static/remoteCallCar/icon2.png"
                  />
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="17">
          <div class="gutter-box">
            <a-row>
              <a-col class="gutter-row" :span="10">
                <p>当日叫车情况</p>
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="8">
                    <div class="Yleft" @click.stop="remoteCallClick()">
                      <img src="@/static/remoteCallCar/icon3.png" />
                      <p>远程呼叫</p>
                    </div>
                  </a-col>
                  <a-col class="gutter-row" :span="14">
                    <div
                      id="YChartleft"
                      style="
                        position: relative;
                        top: -3rem;
                        width: 100%;
                        height: 13rem;
                        left: -1.2rem;
                      "
                    ></div>

                    <p style="position: relative; top: -6rem">
                      全部在途车辆
                      <span style="font-size: 22px; color: #0154a2">{{
                        roadCarNum
                      }}</span>
                      <span style="margin-left: 4px">辆</span>
                    </p>
                  </a-col>
                </a-row>
              </a-col>

              <a-col class="gutter-row" :span="14">
                <a-table
                  :rowClassName="
                    (record, index) =>
                      index % 2 === 1 ? tableColorOne : tableColorTwo
                  "
                  rowKey="index"
                  :columns="columns"
                  :showHeader="false"
                  :dataSource="dataSource"
                  :scroll="{ x: 455, y: 185 }"
                  style="position: relative; top: 0.3rem"
                  :pagination="false"
                  bordered
                />
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <a-card style="margin-top: 0.6rem">
      <a-input-search
        placeholder="请输入车牌号"
        style="width: 200px; position: absolute; top: 0.75rem; left: 10rem"
        @search="searchClick"
      />
      <div class="cardbox">
        <div class="box"></div>
        <div class="boxtext">车辆进出场记录</div>
      </div>
      <br />
      <br />

      <div class="cardTable">
        <template v-for="(item, index) in cardData">
          <a-card-grid :key="index" class="cardGrid">
            <a-row>
              <a-col :span="5">
                <div class="cardTitle">
                  <div>
                    <img
                      v-if="item.car_status == '已取消'"
                      src="@/static/remoteCallCar/icon8.png"
                    />
                    <img
                      v-else-if="item.car_status == '待进场'"
                      src="@/static/remoteCallCar/icon4.png"
                    />
                    <img
                      v-else-if="item.car_status == '安检通过'"
                      src="@/static/remoteCallCar/icon5.png"
                    />
                    <img
                      v-else-if="item.car_status == '整改中'"
                      src="@/static/remoteCallCar/icon6.png"
                    />
                    <img
                      v-else-if="item.car_status == '安检不通过'"
                      src="@/static/remoteCallCar/icon7.png"
                    />
                    <img
                      v-else-if="item.car_status == '已离场'"
                      src="@/static/remoteCallCar/icon14.png"
                    />
                    <img v-else src="@/static/remoteCallCar/icon15.png" />
                  </div>
                  <div class="textTitle">
                    <p>承运单位</p>
                    <p>驾驶员</p>
                  </div>
                  <div class="textvalue">
                    <p>{{ item.unit_name }}</p>
                    <!-- <p>天津一二三四物流运输有限公司</p> -->
                    <p>{{ item.name_driver }}</p>
                  </div>
                </div>
              </a-col>

              <a-col :span="5">
                <div class="cardTitle">
                  <div class="textTitle">
                    <p>牵引车号</p>
                    <p>押运员</p>
                  </div>
                  <div class="textvalue">
                    <p>{{ item.number_tractor }}</p>
                    <p>{{ item.name_escort }}</p>
                  </div>
                  <div class="textTitle" style="margin-left: 2rem">
                    <p>挂车号</p>
                    <p>计划装车量</p>
                  </div>
                  <div class="textvalue">
                    <p>{{ item.number_trailer }}</p>
                    <p>{{ item.loading_amount }}</p>
                  </div>
                </div>
              </a-col>
              <a-col :span="2">
                <img
                  src="@/static/remoteCallCar/icon16.png"
                  style="width: 25%; align: center"
                />
              </a-col>
              <a-col :span="10">
                <a-row class="iconRow">
                  <a-col :span="3">
                    <div style="float: left">
                      <img src="@/static/remoteCallCar/icon9.png" />
                      <p class="title">呼叫时间</p>
                    </div>
                  </a-col>
                  <a-col :span="5">
                    <p class="value">
                      {{ item.hjDate }}<br />{{ item.hjTime }}
                      <!-- 2022-10-27 <br />10:51:57 -->
                    </p>
                  </a-col>
                  <a-col :span="3">
                    <div style="float: left">
                      <img src="@/static/remoteCallCar/icon10.png" />
                      <p class="title">派车时间</p>
                    </div>
                  </a-col>
                  <a-col :span="5">
                    <p class="value">
                      {{ item.pcDate }}<br />{{ item.pcTime }}
                      <!-- 2022-10-27 <br />10:51:57 -->
                    </p>
                  </a-col>
                  <a-col :span="3">
                    <div style="float: left">
                      <img src="@/static/remoteCallCar/icon11.png" />
                      <p class="title">进厂时间</p>
                    </div>
                  </a-col>
                  <a-col :span="5">
                    <p class="value">
                      {{ item.jcDate }}<br />{{ item.jcTime }}
                      <!-- 2022-10-27 <br />10:51:57 -->
                    </p>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="2">
                <div
                  style="
                    margin-top: 1.5rem;
                    text-align: right;
                    margin-right: 0.5rem;
                  "
                >
                  <img
                    v-if="item.car_status != '假数据'"
                    @click.stop="detailsClick(item.id)"
                    style="width: 20%"
                    src="@/static/remoteCallCar/icon12.png"
                  />
                  <img
                    @click.stop="cancelLoadingClick(item.id)"
                    v-if="
                      item.car_status == '整改中' ||
                      item.car_status == '待进场' ||
                      item.car_status == '安检通过'
                    "
                    style="width: 20%; margin-left: 1rem"
                    src="@/static/remoteCallCar/icon13.png"
                  />
                </div>
              </a-col>
            </a-row>
          </a-card-grid>
        </template>
      </div>
    </a-card>
    <!-- 远程叫车弹窗 -->
    <a-modal
      v-model="remoteCallVisible"
      title="远程叫车"
      @ok="remoteCallOperation"
      class="modalButtonCenter"
    >
      <a-form
        :form="remoteCallForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-item label="叫车时间">
          <a-select
            @change="callCarDateChange"
            style="width: 36.5%"
            placeholder="请选择叫车日期"
            v-decorator="[
              'callCarDate',
              {
                rules: [{ required: true, message: '请选择叫车日期' }],
              },
            ]"
            :options="callCarDateOptions"
          >
          </a-select>
          <a-time-picker
            format="HH:mm"
            :allowClear="false"
            @change="callCarTimeChange"
            v-decorator="['callCarTime']"
          />
        </a-form-item>
        <!-- <a-form-item label="叫车时间">
          <a-date-picker
            style="width: 300px"
            show-time
            placeholder="请选择叫车时间"
            v-decorator="[
              'callCarDate',
              {
                rules: [{ required: true, message: '请选择叫车时间' }],
              },
            ]"
          />
        </a-form-item> -->
        <a-form-item label="叫车数量">
          <a-input-number
            style="width: 300px"
            v-decorator="[
              'callNum',
              {
                rules: [{ required: true, message: '请输入叫车数量' }],
              },
            ]"
            :min="1"
            placeholder="请选择叫车数量"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="ok" type="primary" @click="remoteCallOperation">
          确认
        </a-button>
        <a-button key="back" @click="remoteCall_CancelClick"> 取消 </a-button>
      </template>
    </a-modal>
    <!-- 取消装车弹窗 -->
    <a-modal
      v-model="cancelLoadingVisible"
      title="取消装车"
      @ok="cancelLoadingOperation"
      class="modalButtonCenter"
    >
      <a-form :form="cancelLoadingForm">
        <a-form-item label="编号" v-show="false">
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-form-item label="取消原因">
          <a-textarea
            v-decorator="[
              'cause',
              {
                rules: [{ required: true, message: '请输入取消装车原因' }],
              },
            ]"
            placeholder="请输入取消装车原因"
          />
        </a-form-item>
      </a-form>
      <template slot="footer" class="buttonCenter">
        <a-button key="ok" type="primary" @click="cancelLoadingOperation">
          确认
        </a-button>
        <a-button key="back" @click="cancelLoading_CancelClick">
          取消
        </a-button>
      </template>
    </a-modal>
    <!-- 派车详情弹窗 -->
    <a-modal
      v-model="detailsVisible"
      title="派车详情"
      width="1000px"
      class="modalButtonCenter"
    >
      <div>
        <a-divider orientation="left">基础信息</a-divider>
        <a-row>
          <a-col :span="8">装车编号：{{ detailsData.loading_number }}</a-col>
          <a-col :span="8"
            >装车日期：{{ detailsData.loading_start_time }}</a-col
          >

          <a-col :span="8"
            >计划装车量（t）：{{ detailsData.loading_amount }}</a-col
          >
        </a-row>
        <a-row>
          <a-col :span="8">叫车时间：{{ detailsData.call_car_time }}</a-col>
          <a-col :span="8">派车时间：{{ detailsData.create_time }}</a-col>
        </a-row>
        <br />

        <a-divider orientation="left">单位信息</a-divider>
        <a-row>
          <a-col :span="8">承运商：{{ detailsData.carrier_name }}</a-col>
          <a-col :span="8"
            >现场紧急联系人：{{ detailsData.emergencyContact }}</a-col
          >
          <a-col :span="8">联系电话：{{ detailsData.contactNumber }}</a-col>
        </a-row>
        <br />
        <a-divider orientation="left">车辆信息</a-divider>
        <a-row>
          <a-col :span="8">牵引车号：{{ detailsData.number_tractor }}</a-col>
          <a-col :span="8">挂车号：{{ detailsData.number_trailer }}</a-col>
        </a-row>
        <a-divider orientation="left">人员信息</a-divider>
        <a-row>
          <a-col :span="8">司机：{{ detailsData.name_driver }}</a-col>
          <a-col :span="8">司机身份证号：{{ detailsData.id_no_driver }}</a-col>
          <a-col :span="8">联系电话：{{ detailsData.phone_driver }}</a-col>
        </a-row>
        <br />
        <a-row>
          <a-col :span="8">押运员：{{ detailsData.name_escort }}</a-col>
          <a-col :span="8"
            >押运员身份证号：{{ detailsData.id_no_escort }}</a-col
          >
          <a-col :span="8">联系电话：{{ detailsData.phone_escort }}</a-col>
        </a-row>
        <a-row v-if="detailsData.car_status == '待进场'">
          <a-divider orientation="left">安检信息</a-divider>
          <a-col :span="8">
            销售公司安检信息：{{
              detailsData.identifyFields == null
                ? "安检通过"
                : detailsData.identifyFields
            }}
            <a>查看详情</a>
          </a-col>
        </a-row>
        <a-row v-if="detailsData.car_status == '已取消'">
          <a-divider orientation="left">取消原因</a-divider>
          <a-col :span="8"
            >取消原因：{{ detailsData.cancel_rectification_cause }}</a-col
          >
        </a-row>
      </div>
      <template slot="footer">
        <a-button
          v-if="
            detailsData.car_status == '整改中' ||
            detailsData.car_status == '待进场' ||
            detailsData.car_status == '安检通过'
          "
          key="back"
          type="primary"
          @click="cancelLoadingClick(detailsData.id)"
        >
          取消装车
        </a-button>
        <a-button key="submit" @click="detailsReturnClick()"> 取消 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {
  queryListForDay,
  queryCarStatForDay,
  completionOfTheDay,
  findListByDay,
  callCar,
  selectDetailsById,
  cancelLoading,
} from "@/api/tankWagonManage/remoteCallCar.js";
import moment from "moment";

export default {
  data() {
    return {
      callCarDateOptions: [],
      detailsData: {},
      //派车详情弹窗控制
      detailsVisible: false,
      remoteCallForm: this.$form.createForm(this, { name: "coordinated" }),
      cancelLoadingForm: this.$form.createForm(this, { name: "coordinated" }),
      remoteCallVisible: false,
      cancelLoadingVisible: false,
      roadCarNum: "",
      data: {},
      tableColorOne: "odd-tr",
      tableColorTwo: "even-tr",
      dataSource: [],
      columns: [
        { dataIndex: "num", width: 35 },
        { dataIndex: "TcallCarTime", width: 73 },
        { dataIndex: "callCarTime", width: 90 },
        { dataIndex: "TcallNum", width: 73 },
        { dataIndex: "callNum", width: 50 },
        { dataIndex: "TsendNum", width: 73 },
        { dataIndex: "sendNum", width: 50 },
      ],
      cardData: [],
    };
  },
  mounted() {
    this.ChartShow();
    this.CardInfo();
    this.ListData();
  },
  methods: {
    moment,
    //进出场记录条件查询
    searchClick(e) {
      this.ListData(e);
    },
    //点击远程呼叫图标
    remoteCallClick() {
      //打开弹窗
      this.remoteCallVisible = true;
      //清空表单
      this.remoteCallForm.resetFields();
      //获取当前日期  明天日期，做叫车日期下拉数据
      let nowDate = new Date();
      let currentDate = this.formatDate(new Date(), "yyyy-MM-dd");
      let tomorrow = this.formatDate(
        new Date(nowDate.setDate(nowDate.getDate() + 1)),
        "yyyy-MM-dd"
      );
      this.callCarDateOptions = [
        {
          value: currentDate,
          label: currentDate,
        },
        {
          value: tomorrow,
          label: tomorrow,
        },
      ];
      //下拉框，时间选择器赋值
      this.$nextTick(() => {
        this.remoteCallForm.setFieldsValue({
          callCarDate: this.formatDate(new Date(), "yyyy-MM-dd"),
          callCarTime: moment(moment(), "HH:mm"),
        });
      });
    },

    //点击详情
    detailsClick(id) {
      selectDetailsById(id).then((res) => {
        if (res.code == "200" && res.body != null) {
          this.detailsData = res.body;
          this.detailsVisible = true;
        } else {
          this.$message.warning("未获取到详情信息！");
        }
      });
    },

    //点击取消装车按钮
    cancelLoadingClick(id) {
      this.cancelLoadingVisible = true;
      //清空表单
      this.$nextTick(() => {
        this.cancelLoadingForm.resetFields();
        this.cancelLoadingForm.setFieldsValue({
          id: id,
        });
      });
    },

    //点击详情弹窗返回按钮
    detailsReturnClick() {
      this.detailsVisible = false;
    },
    //取消装车
    cancelLoadingOperation() {
      //验证文本框内容是否合规
      this.cancelLoadingForm.validateFields((err, values) => {
        if (!err) {
          let data = {
            id: values.id,
            cause: values.cause,
          };
          cancelLoading(data).then((res) => {
            if (res.code == "200") {
              this.$message.success("取消成功");
              this.cancelLoadingVisible = false;
              this.detailsVisible = false;
              this.ListData();
            } else {
              this.$message.warning("取消失败");
            }
          });
        }
      });
    },

    //远程叫车
    remoteCallOperation() {
      //验证文本框内容是否合规
      this.remoteCallForm.validateFields((err, values) => {
        console.log(values);

        if (!err) {
          //合并叫车日期和叫车时间
          let callCarDate = values.callCarDate;
          let callCarTime = values.callCarTime;
          let callcarDateTime =
            callCarDate +
            this.formatDate(new Date(callCarTime), " HH:mm") +
            ":00";
          //叫车传值
          let from = {
            callCarDate: callcarDateTime,
            callNum: values.callNum,
          };
          callCar(from).then((res) => {
            if (res.code == "200") {
              this.$message.success("叫车成功");
              this.remoteCallVisible = false;
            } else {
              this.$message.warning("叫车失败");
            }
          });
        }
      });
    },

    //叫车日期改变时  判断叫车时间是否大于当前时间
    callCarDateChange(val) {
      //获取叫车日期和时间
      let callCarDate = val;
      let callCarTime = this.remoteCallForm.getFieldValue("callCarTime");
      this.callCarTimeJudge(callCarDate, callCarTime);
    },

    //叫车时间改变时  判断叫车时间是否大于当前时间
    callCarTimeChange(val) {
      //获取叫车日期和时间
      let callCarDate = this.remoteCallForm.getFieldValue("callCarDate");
      let callCarTime = val;
      this.callCarTimeJudge(callCarDate, callCarTime);
    },

    //判断叫车时间是否大于当前时间   小于当前时间时  时间框重置为当前时间
    callCarTimeJudge(callCarDate, callCarTime) {
      let callcarDateTime = new Date(
        callCarDate + this.formatDate(new Date(callCarTime), " HH:mm") + ":59"
      );
      if (callcarDateTime < new Date()) {
        this.$nextTick(() => {
          this.remoteCallForm.setFieldsValue({
            callCarTime: moment(moment(), "HH:mm"),
          });
        });
        this.$message.warning("叫车时间不可早于当前时间");
      }
    },

    // Chart
    ChartShow() {
      completionOfTheDay().then((res) => {
        if (res.code == "200" && res.body) {
          let data = res.body;
          //TODO:目前测试环境没数据，设置假数据，正式上线需注释
          data = {
            numberPlannedLoadingVehicles: "200",
            actualNumberOfVehiclesLoaded: "30",
            plannedLoadVolumeT: "80",
            actualLoadVolumeT: "2",
          };
          let Chartleft = this.$echarts.init(
            document.getElementById("Chartleft")
          );
          Chartleft.setOption({
            color: ["#00b6ef", "#1be7cc"],
            xAxis: {
              type: "category",
              show: false,
            },
            yAxis: {
              type: "value",
              show: false,
            },
            series: [
              {
                data: [
                  data.numberPlannedLoadingVehicles
                    ? data.numberPlannedLoadingVehicles
                    : 0,
                ],
                type: "bar",
                barWidth: 20,
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: "top",
                      textStyle: { color: "black", fontSize: 14 },
                    },
                  },
                },
              },
              {
                data: [
                  data.actualNumberOfVehiclesLoaded
                    ? data.actualNumberOfVehiclesLoaded
                    : 0,
                ],
                type: "bar",
                barWidth: 20,
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: "top",
                      textStyle: { color: "black", fontSize: 14 },
                    },
                  },
                },
              },
            ],
          });
          window.addEventListener("resize", function () {
            Chartleft.resize(); //图表自适应的一个方法
          });
          let Chartright = this.$echarts.init(
            document.getElementById("Chartright")
          );
          Chartright.setOption({
            color: ["#00b6ef", "#1be7cc"],
            xAxis: {
              type: "category",
              show: false,
            },
            yAxis: {
              type: "value",
              show: false,
            },
            series: [
              {
                data: [data.plannedLoadVolumeT ? data.plannedLoadVolumeT : 0],
                type: "bar",
                barWidth: 20,
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: "top",
                      textStyle: { color: "black", fontSize: 14 },
                    },
                  },
                },
              },
              {
                data: [
                  data.actualLoadVolumeT != "null" ? data.actualLoadVolumeT : 0,
                ],
                type: "bar",
                barWidth: 20,
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: "top",
                      textStyle: { color: "black", fontSize: 14 },
                    },
                  },
                },
              },
            ],
          });
          window.addEventListener("resize", function () {
            Chartright.resize(); //图表自适应的一个方法
          });
        } else {
          this.$message.warning("未获取到当日计划完成情况");
        }
      });

      // 当日车辆统计情况
      queryCarStatForDay().then((res) => {
        let data = res.body;
        //TODO:目前测试环境没数据，设置假数据，正式上线需注释
        // data = {
        //   callCarTimes: 20,
        //   callCarNum: 20,
        //   sendCarNum: 20,
        //   roadCarNum: 18,
        // };
        this.roadCarNum = data.roadCarNum;
        let YChartleft = this.$echarts.init(
          document.getElementById("YChartleft")
        );
        this.data = {
          yAxis: ["累计派车数量", "累计叫车数量", "累计叫车次数"],
          data: [data.sendCarNum, data.callCarNum, data.callCarTimes],
          // callCarNum
          // callCarTimes
          // roadCarNum
          // sendCarNum
        };
        YChartleft.setOption({
          color: ["#04b3ec"],
          xAxis: { show: false },
          grid: { top: 48, left: 90, right: 50, bottom: 50 },
          yAxis: {
            type: "category",
            data: this.data.yAxis,
            axisTick: { show: false },
            axisLine: { show: false },
          },
          series: [
            {
              type: "bar",
              barWidth: 10,
              data: this.data.data,
              label: {
                show: true, // 开启显示
                distance: 20, // 条柱之间的距离
                position: "right", // 在上方top在右侧right显示
                textStyle: { color: "black", fontSize: 12 },
                formatter: function (params) {
                  if (params.name == "累计叫车次数") {
                    return `${params.data}次`;
                  } else {
                    return `${params.data}辆`;
                  }
                  // return params[0].name + ": " + params[0].value + "%";
                },
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 10,
                },
              },
            },
          ],
        });
        window.addEventListener("resize", function () {
          YChartleft.resize(); //图表自适应的一个方法
        });
      });
    },

    ListData(number) {
      findListByDay({ number_tractor: number }).then((res) => {
        //循环表格数据，格式化日期
        res.body.forEach((element) => {
          element.hjDate = element.call_car_time
            ? this.formatDate(new Date(element.call_car_time), "yyyy-MM-dd")
            : "----";
          element.hjTime = element.call_car_time
            ? this.formatDate(new Date(element.call_car_time), "HH:mm:ss")
            : "--:--:--";
          element.pcDate = element.create_time
            ? this.formatDate(new Date(element.create_time), "yyyy-MM-dd")
            : "----";
          element.pcTime = element.create_time
            ? this.formatDate(new Date(element.create_time), "HH:mm:ss")
            : "--:--:--";
          element.jcDate = element.enter_time
            ? this.formatDate(new Date(element.enter_time), "yyyy-MM-dd")
            : "----";
          element.jcTime = element.enter_time
            ? this.formatDate(new Date(element.enter_time), "HH:mm:ss")
            : "--:--:--";
        });
        this.cardData = res.body;

        //当表格数据为空，或条数少于5时，添加假数据
        if (this.cardData == null) {
          let cardData = {
            car_status: "假数据",
            unit_name: "---",
            name_driver: "---",
            name_escort: "---",
            number_tractor: "---",
            number_trailer: "---",
            loading_amount: "---",
            hjDate: "----",
            pcDate: "----",
            jcDate: "----",
            hjTime: "--:--:--",
            pcTime: "--:--:--",
            jcTime: "--:--:--",
          };
          for (let i = 0; i < 5; i++) {
            this.cardData.push(cardData);
          }
        }
      });
    },
    // 叫车信息
    CardInfo() {
      // 当日叫车详情列表
      queryListForDay().then((res) => {
        let data = res.body;
        //TODO:目前测试环境没数据，设置假数据，正式上线需注释
        // data = [
        //   { callCarTime: "18:10:23", callNum: "2", sendNum: "2" },
        //   { callCarTime: "18:10:23", callNum: "2", sendNum: "2" },
        //   { callCarTime: "18:10:23", callNum: "2", sendNum: "2" },
        //   { callCarTime: "18:10:23", callNum: "2", sendNum: "2" },
        //   { callCarTime: "18:10:23", callNum: "2", sendNum: "2" },
        //   { callCarTime: "18:10:23", callNum: "2", sendNum: "2" },
        //   { callCarTime: "18:10:23", callNum: "2", sendNum: "2" },
        //   { callCarTime: "18:10:23", callNum: "2", sendNum: "2" },
        // ];
        //当表格数据为空，或条数少于5时，添加假数据
        if (data == null || data.length < 5) {
          let length = 5 - data.length;
          for (let i = 0; i < length; i++) {
            data.push({
              callCarTime: "--:--:--",
              callNum: "--",
              sendNum: "--",
            });
          }
        }

        for (let i = 0; i < data.length; i++) {
          data[i].index = i;
          data[i].num = i + 1;
          data[i].TcallCarTime = "呼叫时间";
          data[i].TcallNum = "叫车数量";
          data[i].TsendNum = "派车数量";
        }
        this.dataSource = data;
      });
    },
    //取消装车弹窗点击取消
    cancelLoading_CancelClick() {
      this.cancelLoadingVisible = false;
    },
    //远程装车弹窗点击取消
    remoteCall_CancelClick() {
      this.remoteCallVisible = false;
    },

    //格式化日期
    formatDate(objDate, fmt) {
      var o = {
        "M+": objDate.getMonth() + 1, //月份
        "d+": objDate.getDate(), //日
        "h+": objDate.getHours() % 12 == 0 ? 12 : objDate.getHours() % 12, //小时
        "H+": objDate.getHours(), //小时
        "m+": objDate.getMinutes(), //分
        "s+": objDate.getSeconds(), //秒
        "q+": Math.floor((objDate.getMonth() + 3) / 3), //季度
        S: objDate.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (objDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
  },
};
</script>

<style lang="less" scoped>
.gutter-box {
  margin: -0.8rem;
  background: #f7f8fa;
  height: 14rem;
  padding: 1rem;
  font-weight: 800;
  color: black;

  .Yleft {
    text-align: center;
    margin-top: 14%;
  }
  .botom {
    position: relative;
    top: -6.4rem;
    text-align: center;
  }
  img {
    margin-top: -0.5rem;
    width: 80%;
  }
}
.cardbox {
  .box {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 0.5rem;
    height: 1.5rem;
    background: #61c5df;
  }
  .boxtext {
    position: absolute;
    top: 1rem;
    left: 2rem;
    font-size: 16px;
    font-weight: 600;
  }
}
.cardTable::-webkit-scrollbar {
  width: 0 !important;
}
.layout_content::-webkit-scrollbar {
  width: 0 !important;
}
.cardTable {
  margin: 0 10px;
  font-size: 12px;
  height: 29.1rem;
  width: 98%;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-y: auto;
  overflow-x: hidden;

  .cardGrid {
    // margin: -1rem 0;

    margin-bottom: 0.5rem;
    padding: 0.5rem;
    width: 99.9%;
    .cardTitle {
      display: flex;

      img {
        margin: 4px;
        margin-top: 0.7rem;
        width: 63%;
      }

      .textTitle {
        margin-top: 1rem;
        margin-left: -0.5rem;
        p {
          color: #bfbfbf;
          line-height: 10px;
        }
      }

      .textvalue {
        margin-top: 1rem;
        margin-left: 1rem;
        p {
          color: black;
          line-height: 10px;
        }
      }
    }
  }
  .iconRow {
    margin-top: 0.7rem;
    img {
      margin-top: -0.2rem;
      margin-left: 0.7rem;
      width: 40%;
    }
    .title {
      font-size: 1px;
      color: #6cd4fb;
    }
    .value {
      font-size: 10px;
      width: 7rem;
      position: relative;
      top: 3px;
      left: 7px;
    }
  }
}
</style>