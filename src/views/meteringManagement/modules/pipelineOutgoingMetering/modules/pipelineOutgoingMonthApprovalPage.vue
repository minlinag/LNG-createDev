<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="wrapper" :model="surfaceForm">
        <div id="printContent">
          <table class="table_form" width="100%" border="2">
            <tr>
              <th colspan="7">
                北京燃气集团(天津)液化天然气有限公司
                <br />
                <!-- {{ year }}年{{ month }}月气化外输汇总表 -->
              </th>
            </tr>
            <tr>
              <td colspan="7" style="text-align: center">
                <a-range-picker
                  disabled
                  format="YYYY-MM-DD"
                  class="td_range_picker"
                >
                </a-range-picker>
                {{ tradeFormData }}
              </td>
            </tr>
            <tr>
              <td align="center" style="width: 17%">月报类型：</td>
              <td colspan="2">
                <span>&nbsp;{{ surfaceForm.reportType }}</span>
              </td>
              <td align="center" style="width: 15%">编号：</td>
              <td colspan="3">&nbsp; {{ surfaceForm.gasCode }}</td>
            </tr>
            <tr>
              <td align="center" rowspan="2">日期</td>
              <td align="center" colspan="2">计划外输量</td>
              <td align="center" colspan="2">实际外输量</td>
              <td align="center" colspan="2">年累计量</td>
            </tr>
            <tr align="center">
              <td width="15%">Nm3</td>
              <td width="15%">t</td>
              <td width="15%">Nm3</td>
              <td width="15%">t</td>
              <td width="15%">Nm3</td>
              <td width="15%">t</td>
            </tr>
            <tr
              v-for="(item, index) in pipelineExportMonthlyReport"
              :key="index"
            >
              <td align="center">{{ item.monht }}</td>
              <td align="center">
                {{ item.dailyPlanLoadingAmountNm }}
              </td>
              <td align="center">
                {{ item.dailyPlanLoadingAmountTon }}
              </td>
              <td align="center">
                {{ item.gasFlowNm }}
              </td>
              <td align="center">
                {{ item.gasFlowT }}
              </td>
              <td align="center">
                {{ item.yeargasFlowNm }}
              </td>
              <td align="center">
                {{ item.yeargasFlowT }}
              </td>
            </tr>
            <tr align="center">
              <td>合计</td>
              <td>
                {{ surfaceForm.plannedExportVolumeNM3 }}
              </td>
              <td>
                {{ surfaceForm.plannedExportVolumeT }}
              </td>
              <td>
                {{ surfaceForm.actualExportVolumeNM3 }}
              </td>
              <td>
                {{ surfaceForm.actualExportVolumeT }}
              </td>
              <td>
                {{ surfaceForm.annualExportVolumeNM3 }}
              </td>
              <td>
                {{ surfaceForm.annualExportVolumeT }}
              </td>
            </tr>
          </table>

          <table width="100%" border="2" class="table_footer">
            <tr>
              <td align="center" style="width: 50%" colspan="1">
                液化天然气有限公司<br />计量员<br />计量专用章（盖章）
              </td>
              <td align="center" colspan="1">
                液化天然气销售公司<br />计量员<br />计量专用章（盖章）
              </td>
            </tr>
          </table>
        </div>
        <table
          width="100%"
          border="0"
          class="table_footer"
          style="margin-top: 10px"
        >
          <tr>
            <td>
              <a-form-model-item
                style="float: left"
                :labelCol="{ style: 'width: 60px' }"
                label="附件："
              >
                <file-upload
                  :Text="'上传文件'"
                  @fileChange="flieChange"
                  :echoList="flieChanges"
                  disabled
                  ref="importConpontsDataRef"
                ></file-upload>
              </a-form-model-item>
            </td>
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
  getById,
  queryGasEveryDay,
  queryYearTot,
  queryPlanExportAmountByDate,
  pipelineExportMonthlyReportAudio,
} from "@/api/meteringManagement/pipelineOutgoingMonth";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/components/approvalRecord/index.vue";
export default {
  components: {
    stepsModel,
    fileUpload,
  },
  data() {
    return {
      reportType: [
        { value: "结算型", label: "结算型" },
        { value: "统计型", label: "统计型" },
      ],
      //表格中的数据
      dataSource: [],
      surfaceForm: {},
      tradeFormData: "年 月 日 8:00 至 年 月 日 8:00",
      pipelineExportMonthlyReport: [],
      flieChanges: [],
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
    // this.getListDetails("J07000000000015");
  },
  methods: {
    approvalMethod(type) {
      pipelineExportMonthlyReportAudio({
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
    //获得当前页面
    getListDetails(value) {
      getById(value).then((res) => {
        console.log("res", res);
        this.surfaceForm = res.body;

        if (this.surfaceForm.fileInfo) {
          this.flieChanges = JSON.parse(
            this.chineseChar2englishChar(this.surfaceForm.fileInfo)
          );
        }

        let dateString = [this.surfaceForm.startTime, this.surfaceForm.endTime];
        let dayString = "";

        let PlannedExport = [];
        let ActualExport = [];
        let list = [];
        let YearsOfTiredness = [];

        queryPlanExportAmountByDate({
          startPlanTime: dateString[0],
          endPlanTime: dateString[1],
        }).then((res) => {
          PlannedExport = res.body;
          for (let j = 0; j < list.length; j++) {
            for (let i = 0; i < PlannedExport.length; i++) {
              if (list[j].judgeMonht == PlannedExport[i].planLoadingDate) {
                list[j].dailyPlanLoadingAmountNm =
                  PlannedExport[i].dailyPlanLoadingAmountNm;
                list[j].dailyPlanLoadingAmountTon =
                  PlannedExport[i].dailyPlanLoadingAmountTon;
              }
            }
          }
        });
        
        queryGasEveryDay({
          startTime: dateString[0],
          endTime: dateString[1],
        }).then((res) => {
          ActualExport = res.body;
          for (let j = 0; j < list.length; j++) {
            for (let i = 0; i < ActualExport.length; i++) {
              if (list[j].judgeMonht == ActualExport[i].dealStartTime) {
                list[j].gasFlowNm = ActualExport[i].gasFlowNm;
                list[j].gasFlowT = ActualExport[i].gasFlowT;
              }
            }
          }
          queryYearTot({
            startTime: dateString[0],
          }).then((res) => {
            YearsOfTiredness = res.body;
            for (let j = 0; j < list.length; j++) {
              for (let i = 0; i < ActualExport.length; i++) {
                if (list[j].judgeMonht == ActualExport[i].dealStartTime) {
                  list[j].yeargasFlowNm = ActualExport[i].yeargasFlowNm;
                  list[j].yeargasFlowT = ActualExport[i].yeargasFlowT;
                }
              }
            }

            for (let i = 0; i < list.length; i++) {
              if (list[i].dailyPlanLoadingAmountNm) {
              } else {
                list[i].dailyPlanLoadingAmountNm = 0;
              }
              if (list[i].dailyPlanLoadingAmountTon) {
              } else {
                list[i].dailyPlanLoadingAmountTon = 0;
              }
              if (list[i].gasFlowNm) {
              } else {
                list[i].gasFlowNm = 0;
              }
              if (list[i].gasFlowT) {
              } else {
                list[i].gasFlowT = 0;
              }
              if (list[i].yeargasFlowNm) {
              } else {
                list[i].yeargasFlowNm = 0;
              }
              if (list[i].yeargasFlowT) {
              } else {
                list[i].yeargasFlowT = 0;
              }
              if (i >= 1) {
                list[i].yeargasFlowNm =
                  parseInt(list[i].gasFlowNm) +
                  parseInt(list[i - 1].yeargasFlowNm);
                list[i].yeargasFlowT =
                  parseInt(list[i].gasFlowT) +
                  parseInt(list[i - 1].yeargasFlowT);
              }
            }
            let totaldailyPlanLoadingAmountNm = 0;
            let totaldailyPlanLoadingAmountTon = 0;
            let totalgasFlowNm = 0;
            let totalgasFlowT = 0;
            let totalyeargasFlowNm = 0;
            let totalyeargasFlowT = 0;
            for (let i = 0; i < list.length; i++) {
              totaldailyPlanLoadingAmountNm += parseInt(
                list[i].dailyPlanLoadingAmountNm
              );
              totaldailyPlanLoadingAmountTon += parseInt(
                list[i].dailyPlanLoadingAmountTon
              );
              totalgasFlowNm += parseInt(list[i].gasFlowNm);
              totalgasFlowT += parseInt(list[i].gasFlowT);
              totalyeargasFlowNm += parseInt(list[i].yeargasFlowNm);
              totalyeargasFlowT += parseInt(list[i].yeargasFlowT);
            }
            this.surfaceForm.plannedExportVolumeNM3 =
              totaldailyPlanLoadingAmountNm;
            this.surfaceForm.plannedExportVolumeT =
              totaldailyPlanLoadingAmountTon;
            this.surfaceForm.actualExportVolumeNM3 = totalgasFlowNm;
            this.surfaceForm.actualExportVolumeT = totalgasFlowT;
            this.surfaceForm.annualExportVolumeNM3 = totalyeargasFlowNm;
            this.surfaceForm.annualExportVolumeT = totalyeargasFlowT;
            this.pipelineExportMonthlyReport = list;
          });
        });

        for (let index = 0; index < dateString.length; index++) {
          const element = dateString[index];
          if (index < dateString.length - 1) {
            dayString +=
              this.timePatternConvert(element) +
              " \xa0\xa0\xa0\xa0\xa0\xa0至 \xa0\xa0\xa0\xa0\xa0\xa0";
          } else {
            dayString += this.timePatternConvert(element);
          }
        }
        this.tradeFormData = dayString;
        list = this.generateDayList(dateString);
      });
    },
    chineseChar2englishChar(chineseChar) {
      // 将单引号‘’都转换成'，将双引号“”都转换成"
      var str = chineseChar.replace(/\’|\‘/g, "'").replace(/\“|\”/g, '"');
      // 将中括号【】转换成[]，将大括号｛｝转换成{}
      str = str
        .replace(/\【/g, "[")
        .replace(/\】/g, "]")
        .replace(/\｛/g, "{")
        .replace(/\｝/g, "}");
      // 将逗号，转换成,，将：转换成:
      str = str.replace(/，/g, ",").replace(/：/g, ":");
      return str;
    },
    generateDayList(dateString) {
      let dateSplit = {
        startTime: dateString[0].split("-"),
        endTime: dateString[1].split("-"),
      };
      let dateGather = [];
      let monthCount = dateSplit.endTime[1] - dateSplit.startTime[1];
      if (monthCount >= 0) {
        dateGather.push([dateSplit.startTime[0], dateSplit.startTime[1]]);

        for (let index = 0; index < monthCount; index++) {
          dateGather.push([
            dateSplit.startTime[0],
            parseInt(dateSplit.startTime[1]) + index + 1,
          ]);
        }
      } else {
        let monthBurdenCount = monthCount + 12;
        dateGather.push([dateSplit.startTime[0], dateSplit.startTime[1]]);
        let startMonthCount = parseInt(dateSplit.startTime[1]);
        for (let index = 0; index < monthBurdenCount; index++) {
          if (startMonthCount < 12) {
            dateGather.push([
              dateSplit.startTime[0],
              parseInt(dateSplit.startTime[1]) + 1,
            ]);
          } else {
            dateGather.push([dateSplit.endTime[0], startMonthCount - 12 + 1]);
          }
          startMonthCount += 1;
        }
      }
      let dayCollection = [];
      for (let index = 0; index < dateGather.length; index++) {
        const element = dateGather[index];
        dayCollection.push(
          this.getMonthDay(parseInt(element[0]), parseInt(element[1]) - 1)
        );
      }
      let dailyData = [];
      for (let index = 0; index < dayCollection.length; index++) {
        const element = dayCollection[index] + 1;
        if (index === 0) {
          if (
            dateSplit.startTime[1] == dateSplit.endTime[1] &&
            dateSplit.startTime[0] == dateSplit.endTime[0]
          ) {
            let endTimeElement = parseInt(dateSplit.endTime[2]) + 1;
            for (let i = dateSplit.startTime[2]; i < endTimeElement; i++) {
              // console.log("11", dateSplit.startTime);
              if (i.toString().length == 1) {
                i = "0" + i;
              }
              let data = {
                monht:
                  dateSplit.startTime[0] +
                  "年" +
                  dateSplit.startTime[1] +
                  "月" +
                  i +
                  "日",
                judgeMonht:
                  dateSplit.startTime[0] +
                  "-" +
                  dateSplit.startTime[1] +
                  "-" +
                  i,
                dailyPlanLoadingAmountNm: "",
                dailyPlanLoadingAmountTon: "",
                gasFlowNm: "",
                gasFlowT: "",
                yeargasFlowNm: "",
                yeargasFlowT: "",
              };
              dailyData.push(data);
            }
          } else {
            for (let i = dateSplit.startTime[2]; i < element; i++) {
              // console.log("001", element);
              // console.log("00", dateSplit.startTime[2]);
              // console.log("111", dateSplit.startTime);
              // console.log("333", i);
              // console.log(i.toString().length);
              if (i.toString().length == 1) {
                i = "0" + i;
              }
              let data = {
                monht:
                  dateSplit.startTime[0] +
                  "年" +
                  dateSplit.startTime[1] +
                  "月" +
                  i +
                  "日",
                judgeMonht:
                  dateSplit.startTime[0] +
                  "-" +
                  dateSplit.startTime[1] +
                  "-" +
                  i,
                dailyPlanLoadingAmountNm: "",
                dailyPlanLoadingAmountTon: "",
                gasFlowNm: "",
                gasFlowT: "",
                yeargasFlowNm: "",
                yeargasFlowT: "",
              };
              dailyData.push(data);
            }
          }
        } else if (index === dayCollection.length - 1) {
          let endData = parseInt(dateSplit.endTime[2]) + 1;
          for (let i = 1; i < endData; i++) {
            if (i.toString().length == 1) {
              i = "0" + i;
            }
            let data = {
              monht:
                dateSplit.endTime[0] +
                "年" +
                dateSplit.endTime[1] +
                "月" +
                i +
                "日",
              judgeMonht:
                dateSplit.endTime[0] + "-" + dateSplit.endTime[1] + "-" + i,
              dailyPlanLoadingAmountNm: "",
              dailyPlanLoadingAmountTon: "",
              gasFlowNm: "",
              gasFlowT: "",
              yeargasFlowNm: "",
              yeargasFlowT: "",
            };
            // console.log("22", dateSplit.endTime);
            dailyData.push(data);
          }
        } else {
          for (let i = 1; i < element; i++) {
            // console.log(element);
            // console.log("22", dateSplit.endTime);
            let data = {
              monht:
                dateSplit.startTime[0] +
                "年" +
                dateSplit.startTime[1] +
                "月" +
                i +
                "日",
              judgeMonht:
                dateSplit.startTime[0] + "-" + dateSplit.startTime[1] + "-" + i,
              dailyPlanLoadingAmountNm: "",
              dailyPlanLoadingAmountTon: "",
              gasFlowNm: "",
              gasFlowT: "",
              yeargasFlowNm: "",
              yeargasFlowT: "",
            };
            dailyData.push(data);
          }
        }
      }
      return dailyData;
    },
    getMonthDay(year, month) {
      let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        days[1] = 29;
      }
      return days[month];
    },
    // 附件
    flieChange(val) {
      this.flieChanges = val;
    },
    timePatternConvert(time) {
      let newTime;
      var str = time;
      // eslint-disable-next-line no-useless-escape
      var reg = /(\d{4})\-(\d{2})\-(\d{2})/;
      newTime = str.replace(reg, "$1年$2月$3日8:00");
      return newTime;
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
.table_form {
  border-bottom-width: 0px;
  tr {
    th {
      text-align: center;
    }
  }
  .tr_remark {
    border-bottom-width: 0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
  }
}
.table_footer {
  border-top: none;
}
td {
  position: relative;
}
.td_range_picker {
  position: absolute;
  left: 0;
  top: 0;
  ::v-deep .ant-calendar-picker-input.ant-input {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
