<template>
  <Breadcrumb>
    <template slot="appMain">
      <!-- 打印区域 -->
      <div id="printContent">
        <!-- 月报报表 -->
        <table class="table_form" width="100%" border="2">
          <tr style="height: 80px; font-size: 18px">
            <th colspan="5">
              北京燃气集团（天津）液化天然气有限公司
              <br />
              <span style="font-size: 18px">
                液化天然气
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
              <a-select
                style="width: 100px"
                v-model="reportData.reportType"
                @change="reportTypeChange"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in reportTypeAddOptions"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </td>

            <td colspan="4">
              <div align="center" style="text-indent: -7em">
                {{ reportData.reportDateRangeText }}
              </div>
            </td>
          </tr>
          <tr style="height: 25px">
            <td colspan="3" align="left" width="50%">
              &nbsp;&nbsp;编制人：{{ reportData.fillUser }}
            </td>
            <td colspan="2" align="left" width="50%">
              &nbsp;&nbsp;编号:{{ reportData.reportCode }}
            </td>
          </tr>
          <tr style="height: 25px">
            <td width="8%">日期</td>
            <td width="20%">供应量（t）</td>
            <td width="22%">保冷循环量（t）</td>
            <td width="30%">销售量（t）</td>
            <td width="20%">备注</td>
          </tr>

          <tr
            v-for="(item, index) in dailyDataSource"
            :key="index"
            style="height: 20px"
          >
            <td>{{ item.day }}</td>
            <td>{{ item.supply }}</td>
            <td>{{ item.circulation }}</td>
            <td>{{ item.salesVolume }}</td>
            <td>{{ item.remark }}</td>
          </tr>
          <tr style="height: 30px">
            <td>合计</td>
            <td>{{ reportData.supplySum }}</td>
            <td>{{ reportData.circulationSum }}</td>
            <td>{{ reportData.salesVolumeSum }}</td>
            <td></td>
          </tr>
          <tr style="height: 30px">
            <td colspan="5" align="left">
              &nbsp;&nbsp;注：本月LNG冷能空分装置累计开工运行

              <span>{{ reportData.runDays }} </span>
              天
            </td>
          </tr>
        </table>

        <table
          width="100%"
          border="2"
          class="table_footer"
          height="100px"
          v-if="signVisible"
        >
          <tr style="height: 30px">
            <td align="center" style="width: 50%" colspan="1">
              北京燃气集团（天津）液化天然气有限公司
              <br />（计量章）<br />
              计量员
            </td>
            <td align="center" colspan="1">
              XXX公司
              <br />(计量章)<br />
              计量员
            </td>
          </tr>
        </table>
      </div>
      <table width="100%" class="table_footer">
        <tr style="height: 30px">
          <td align="center">
            <span style="float: left">
              <a-form-item label="附件" :labelCol="{ style: 'width: 100px' }">
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
            </span>
          </td>
        </tr>
      </table>
      <!--审批页签部分-->
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
  getById,
  approval,
} from "@/api/meteringManagement/coldEnergyMeteringMonthly.js";
import { getListForMonthReport } from "@/api/meteringManagement/coldEnergyMeteringDaily.js";
import fileUpload from "@/components/upLoad/fileUpload";

import stepsModel from "@/components/approvalRecord/index.vue";
import moment from "moment";

export default {
  components: {
    fileUpload,
    stepsModel,
  },
  data() {
    return {
      //报表数据
      reportData: {
        //报表年YYYY
        reportYear: "",
        //报表月MM
        reportMonth: "",
        //报表年月YYYY-MM
        reportYearMonth: "",
        //类型
        reportType: "1",
        //编号
        reportCode: "--",
        //报表日期范围
        reportDateRange: [],
        //报表开始时间
        reportBeginDate: "",
        //报表结束时间
        reportEndDate: "",
        //接收站名称
        receivingStationName: "北京燃气集团(天津)液化天然气有限公司",
        //编制人
        fillUser: "--",
        //单位名称
        companyName: "",
        //接收站计量员
        gaugerA: "",
        //单位计量员
        gaugerB: "",
        //供应量合计
        supplySum: 0,
        //保冷循环量合计
        circulationSum: 0,
        //销售量合计
        salesVolumeSum: 0,
        //截止日期
        //报表日期范围文字
        reportDateRangeText:
          "XXXX 年 XX 月 XX 日 08:00 - XXXX 年 XX 月 XX 日 08:00",
        //运行天数
        runDays: "0",
      },
      signVisible: false,
      reportTypeAddOptions: [
        { value: "1", label: "统计型" },
        { value: "2", label: "结算型" },
      ],
      fileList: [],
      //表格中的数据
      dataSource: [],
      //表格中的数据
      dailyDataSource: [],
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
    // this.getListDetails("J09000000000040");
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
    getListDetails(value) {
      console.log(11, value);
      getById(value).then((res) => {
        console.log("res", res);

        let val = res.body;

        //附件回显

        if (val.fileInfo) {
          this.fileList = JSON.parse(val.fileInfo);
        }
        //默认统计型，不显示签字部分
        this.signVisible = val.type == "1" ? false : true;
        this.reportData = {
          id: val.id,
          //报表年YYYY
          reportYear: val.monthDate ? val.monthDate.substring(0, 4) : "",
          //报表月MM
          reportMonth: val.monthDate ? val.monthDate.substring(5, 7) : "",
          //报表年月YYYY-MM
          reportYearMonth: val.monthDate,
          //类型
          reportType: val.type,
          reportTypeName: val.reportTypeName,
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
          //供应量合计
          supplySum: val.supply,
          //循环量合计
          circulationSum: val.circulation,
          //销售量合计
          salesVolumeSum: val.salesVolume,
          //单位名称
          companyName: val.companyName,
          //接收站计量员
          gaugerA: val.gaugerA,
          //单位计量员
          gaugerB: val.gaugerB,
          //报表日期范围文字
          reportDateRangeText: this.getReportDateRangeText(
            val.startDate,
            val.endDate
          ),
          //运行天数
          runDays: val.runDays,
        };
        this.getDailyList(val.startDate, val.endDate, "edit");
      });
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
            //渲染合计行数据
            this.reportData.supplySum = res.body.supplySum;
            this.reportData.circulationSum = res.body.circulationSum;
            this.reportData.salesVolumeSum = res.body.salesVolumeSum;
          }
        } else {
          this.dailyDataSource = [];
          delete this.reportData.supplySum;
          delete this.reportData.circulationSum;
          delete this.reportData.salesVolumeSum;
        }
      });
    },

    //报表类型改变，隐藏显示签字区，生成报表起始时间并查询日报数据
    reportTypeChange(val) {
      //统计型
      if (val == "1") {
        delete this.reportData.receivingStationName;
        delete this.reportData.companyName;
        delete this.reportData.gaugerA;
        delete this.reportData.gaugerB;
        this.signVisible = false;
      }
      //结算型
      else {
        this.$set(
          this.reportData,
          "receivingStationName",
          "北京燃气集团(天津)液化天然气有限公司"
        );
        this.$set(this.reportData, "companyName", "");
        this.$set(this.reportData, "gaugerA", "");
        this.$set(this.reportData, "gaugerB", "");
        this.signVisible = true;
      }
      //生成报表起始时间，并调用接口查询日报数据
      this.getReportDate();
    },

    //生成开始日期，结束日期，并调用接口查询日报数据
    getReportDate() {
      let year = this.reportData.reportYear;
      let month = this.reportData.reportMonth;
      let reportType = this.reportData.reportType;
      if (year && month && reportType) {
        let reportYearMonth = new Date(year + "-" + month);
        let reportBeginDate = "";
        let reportEndDate = "";
        //统计型（每月1日至月底最后一天装车量）
        if (reportType == "1") {
          //月份加1
          reportYearMonth = this.formatDate(
            new Date(reportYearMonth.setMonth(reportYearMonth.getMonth() + 1)),
            "yyyy-MM"
          );
          reportBeginDate = year + "-" + month + "-01";
          reportEndDate = reportYearMonth + "-01";
        }
        //结算型（上月26日至本月25日的装车量）
        else if (reportType == "2") {
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
        //
        this.reportData.reportBeginDate = reportBeginDate;
        this.reportData.reportEndDate = reportEndDate;
        //修改标题
        this.getReportDateRangeText(
          reportBeginDate + " 08:00",
          reportEndDate + " 08:00"
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

    //拼接报表中的日期文字(XXXX 年 XX 月 XX 日 08:00 至 XXXX 年 XX 月 XX 日 08:00)
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

    fileListChange(val) {
      this.fileList = val;
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
</style>
// 去除打印的页眉页脚
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 8mm; /* this affects the margin in the printer settings */
}
</style>
// 去除打印的页眉页脚