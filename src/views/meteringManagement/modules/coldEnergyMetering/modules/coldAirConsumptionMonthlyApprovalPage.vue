<template>
  <Breadcrumb>
    <template slot="appMain">
      <div id="printContent">
        <table class="table_form" width="100%" border="2">
          <tr style="height: 80px; font-size: 18px">
            <th colspan="5">
              北京燃气集团（天津）液化天然气有限公司
              <br />

              <span>
                {{ reportData.reportYear }}
                年
                {{ reportData.reportMonth }}
                月冷能销售汇总表
              </span>
            </th>
          </tr>
          <tr style="height: 30px">
            <td align="left" width="20%">
              &nbsp;&nbsp;月报类型：

              <span>{{ reportData.monthReportTypeName }}</span>
            </td>

            <td colspan="4">
              <div>
                {{ reportData.reportDateRangeText }}
              </div>
            </td>
          </tr>
          <tr style="height: 25px">
            <td colspan="3" align="left" width="60%">
              &nbsp;&nbsp;编制人：{{ reportData.fillUser }}
            </td>
            <td colspan="2" align="left" width="40%">
              &nbsp;&nbsp;编号:{{ reportData.reportCode }}
            </td>
          </tr>
          <tr style="height: 25px">
            <td>日期</td>
            <td>冷能耗气量<br />(Nm³)</td>
            <td>年累计量<br />(Nm³)</td>
            <td>色谱密度</td>
            <td>备注</td>
          </tr>

          <tr
            v-for="(item, index) in dailyDataSource"
            :key="index"
            style="height: 20px"
          >
            <td>{{ item.day }}</td>
            <td>{{ item.coldGasConsumption }}</td>
            <td>{{ item.yearCumulants }}</td>
            <td>{{ item.chromatographySecret }}</td>
            <td>{{ item.remark }}</td>
          </tr>
          <tr style="height: 30px">
            <td>合计(Nm³)</td>
            <td>{{ reportData.coldGasConsumptionSum }}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
        <table
          width="100%"
          border="2"
          height="100px"
          class="table_footer"
          v-if="signVisible"
        >
          <tr style="height: 30px">
            <td align="center" style="width: 50%" colspan="1">
              液化天然气有限公司<br />计量员<br />（计量员专用章）
            </td>
            <td align="center" colspan="1">
              液化天然气有限公司
              <br />计量员<br />
              （计量员专用章）
            </td>
          </tr>
        </table>
      </div>

      <a-form-item label="附件">
        <div style="display: flex">
          <file-upload
            :Text="'上传文件'"
            @fileChange="fileListChange"
            :echoList="fileList"
            ref="importConpontsDataRef"
            disabled
          ></file-upload>
        </div>
      </a-form-item>

      <stepsModel
        ref="stepsModel"
        :isShow="true"
        :id="reportData.id"
        @approvalMethod="approvalMethod"
      />
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
  findById,
  approval,
} from "@/api/meteringManagement/coldAirConsumptionMonthly.js";
import { getListForMonthReport } from "@/api/meteringManagement/coldAirConsumptionDaily.js";
import fileUpload from "@/components/upLoad/fileUpload";
import utils from "@/utils/url";
import stepsModel from "@/components/approvalRecord/index.vue";

import moment from "moment";

export default {
  components: {
    fileUpload,
    stepsModel,
  },
  data() {
    return {
      signVisible: false,
      fileList: [],
      //报表数据
      reportData: {
        //报表年YYYY
        reportYear: "",
        //报表月MM
        reportMonth: "",
        //报表月份
        monthDate: "",
        //类型
        monthReportType: "1",
        //编号
        code: "--",
        //报表日期范围
        reportDateRange: [],
        //接收站名称
        receivingStationName: "--",
        //编制人
        fillUser: "--",
        //冷能耗气量合计
        coldGasConsumptionSum: 0,
        //色谱密度平均值
        chromatographySecretAvg: 0,
        //年累计量合计
        yearCumulantsSum: 0,
        //单位名称
        companyName: "--",
        //接收站计量员
        gaugerA: "--",
        //单位计量员
        gaugerB: "--",
        //报表开始时间
        reportBeginDate: "",
        //报表结束时间
        reportEndDate: "",
        //报表日期范围文字
        reportDateRangeText:
          "XXXX 年 XX 月 XX 日 8:00 至 XXXX 年 XX 月 XX 日 8:00",
      },

      //报表中日报表格数据
      dailyDataSource: [],
      //查询日期范围
      dateRange: [],
      //查询月份范围
      monthRange: [],
      //查询所需的数据
      searchForm: {
        pageSize: 10,
        pageNum: 1,
      },

      reportTypeOptions: [
        { value: "1", label: "统计型" },
        { value: "2", label: "结算型" },
      ],

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
    // this.getListDetails("J14000000000027");
  },
  methods: {
    approvalMethod(type) {
      approval({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.reportData.id,
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
      findById({ id: value }).then((res) => {
        console.log("res", res);
        let val = res.body;

        //附件回显
        if (val.fileInfo) {
          this.fileList = JSON.parse(val.fileInfo);
        }

         val.monthReportTypeName =
            val.monthReportType == "1"
              ? "统计型"
              : val.monthReportType == "2"
              ? "结算型"
              : val.monthReportType;

        this.signVisible = val.monthReportType == "1" ? false : true;
        //回显表单
        this.reportData = {
          id: val.id,
          //报表年YYYY
          reportYear: val.month ? val.month.substring(0, 4) : "",
          //报表月MM
          reportMonth: val.month ? val.month.substring(5, 7) : "",
          //报表年月YYYY-MM
          reportYearMonth: val.month,
          //类型
          monthReportType: val.monthReportType,
          monthReportTypeName: val.monthReportTypeName,

          //编号
          reportCode: val.code,
          //报表日期范围
          reportDateRange: [val.startDate, val.endDate],
          //报表开始时间
          reportBeginDate: val.startDate,
          //报表结束时间
          reportEndDate: val.endDate,
          //接收站名称
          receivingStationName: val.receivingStationName,
          //编制人
          fillUser: val.fillUser,
          //冷能耗气量合计
          coldGasConsumptionSum: val.coldGasConsumption,
          //色谱密度平均值
          chromatographySecretAvg: val.chromatographySecret,
          //年累计量合计
          yearCumulantsSum: val.yearCumulants,
          //单位名称
          companyName: val.userUnitName,
          //接收站计量员
          gaugerA: val.gaugerA,
          //单位计量员
          gaugerB: val.gaugerB,
          //报表日期范围文字
          reportDateRangeText: this.getReportDateRangeText(
            val.startDate,
            val.endDate
          ),
        };
        this.getDailyList(val.startDate, val.endDate, "edit");
      });
    },

    //生成开始日期，结束日期，并调用接口查询日报数据
    getReportDate() {
      let year = this.reportData.reportYear;
      let month = this.reportData.reportMonth;
      let monthReportType = this.reportData.monthReportType;
      if (year && month && monthReportType) {
        let reportYearMonth = new Date(year + "-" + month);
        let reportBeginDate = "";
        let reportEndDate = "";
        //统计型（每月1日至月底最后一天装车量）
        if (monthReportType == "1") {
          //月份加1
          reportYearMonth = this.formatDate(
            new Date(reportYearMonth.setMonth(reportYearMonth.getMonth() + 1)),
            "yyyy-MM"
          );
          reportBeginDate = year + "-" + month + "-01";
          reportEndDate = reportYearMonth + "-01";
        }
        //结算型（上月26日至本月25日的装车量）
        else if (monthReportType == "2") {
          //月份减1
          reportYearMonth = this.formatDate(
            new Date(reportYearMonth.setMonth(reportYearMonth.getMonth() - 1)),
            "yyyy-MM"
          );
          reportBeginDate = reportYearMonth + "-26";
          reportEndDate = year + "-" + month + "-26";
        }
        //报表日期范围选择器赋值
        this.reportData.reportDateRange = [
          moment(reportBeginDate),
          moment(reportEndDate),
        ];
        //开始日期 结束日期
        this.reportData.reportBeginDate = reportBeginDate;
        this.reportData.reportEndDate = reportEndDate;
        //修改标题
        this.getReportDateRangeText(
          reportBeginDate + " 8:00",
          reportEndDate + " 8:00"
        );
        let endDate = new Date(this.reportData.reportDateRange[1]);
        //查询日报数据,渲染到表格中
        this.getDailyList(
          this.formatDate(
            new Date(this.reportData.reportDateRange[0]),
            "yyyy-MM-dd"
          ),
          this.formatDate(
            new Date(endDate.setDate(endDate.getDate() - 1)),
            "yyyy-MM-dd"
          )
        );
      }
    },

    //拼接报表中的日期文字(XXXX 年 XX 月 XX 日 8:00 至 XXXX 年 XX 月 XX 日 8:00)
    getReportDateRangeText(startDate, endDate) {
      if (startDate && endDate) {
        startDate = this.formatDate(new Date(startDate), "yyyy 年 MM 月 dd 日");
        endDate = this.formatDate(new Date(endDate), "yyyy 年 MM 月 dd 日");
        this.reportData.reportDateRangeText =
          startDate + " 08:00 - " + endDate + " 08:00";
        return startDate + " 08:00 - " + endDate + " 08:00";
      } else {
        this.reportData.reportDateRangeText =
          "XXXX 年 XX 月 XX 日 08:00 至 XXXX 年 XX 月 XX 日 08:00";
        return "XXXX 年 XX 月 XX 日 08:00 至 XXXX 年 XX 月 XX 日 08:00";
      }
    },

    //获取日报数据，渲染到报表中
    getDailyList(beginDate, endDate, type) {
      let searchForm = {
        beginDate: beginDate,
        endDate: endDate,
      };
      getListForMonthReport(searchForm).then((res) => {
        if (res.body) {
          this.dailyDataSource = res.body.dailyDataList;
          //type不为空是编辑页面请求，不需要渲染合计行
          if (!type) {
            //计算合计行数据
            this.reportData.coldGasConsumptionSum =
              res.body.coldGasConsumptionSum;
            this.reportData.chromatographySecretAvg =
              res.body.chromatographySecretAvg;
            this.reportData.yearCumulantsSum = res.body.yearCumulantsSum;
          }
        } else {
          this.dailyDataSource = [];
          delete this.reportData.coldGasConsumptionSum;
          delete this.reportData.chromatographySecretAvg;
          delete this.reportData.yearCumulantsSum;
        }
      });
    },
    fileListChange(val) {
      this.fileList = val;
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
<style scoped>
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

.closeButton {
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
<style scoped lang="less">
.table_form {
  text-align: center;
  border-bottom-width: 0px;
  tr {
    th {
      text-align: center;
    }
  }
}
.table_footer {
  border-top: none;
}
.TableTop {
  margin-top: 10px;
}
</style>
// 去除打印的页眉页脚
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 8mm; /* this affects the margin in the printer settings */
}
</style>
// 去除打印的页眉页脚
