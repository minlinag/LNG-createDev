<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="wrapper" :model="surfaceForm">
        <div id="printContent">
          <table class="table_form" width="100%" border="2">
            <tr style="height: 70px; font-size: 18px">
              <th colspan="8">
                北京燃气集团(天津)液化天然气有限公司
                <br />
                自耗气量统计表
              </th>
            </tr>
            <tr class="input">
              <td align="center" style="width: 17%">报表类型：</td>
              <td>
                <a-select
                  disabled
                  style="width: 100%"
                  v-model="surfaceForm.reportType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in reportType"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </td>
              <td colspan="6" style="text-align: center">
                <a-range-picker
                  disabled
                  format="YYYY-MM-DD"
                  class="td_range_picker"
                >
                </a-range-picker>
                {{ tradeFormData }}
              </td>
            </tr>
            <tr align="center">
              <td>编号：</td>
              <td colspan="7">{{ surfaceForm.numbers }}</td>
            </tr>
            <tr>
              <td align="center" rowspan="2">日期</td>
              <td align="center" colspan="2">scv耗气</td>
              <td align="center" colspan="2">常明灯耗气</td>
              <td align="center" colspan="2">其他耗气</td>
              <td align="center" rowspan="2">备注</td>
            </tr>
            <tr align="center">
              <td>体积(Nm3)</td>
              <td>质量(t)</td>
              <td>体积(Nm3)</td>
              <td>质量(t)</td>
              <td>体积(Nm3)</td>
              <td>质量(t)</td>
            </tr>
            <tr
              v-for="(item, index) in pipelineExportMonthlyReport"
              :key="index"
            >
              <td align="center">
                {{ item.monht }}
              </td>
              <td align="center">
                {{ item.SCVVolume }}
              </td>
              <td align="center">
                {{ item.SCVQuality }}
              </td>
              <td align="center">
                {{ item.lightVolume }}
              </td>
              <td align="center">
                {{ item.lightQuality }}
              </td>
              <td align="center">
                {{ item.otherVolume }}
              </td>
              <td align="center">
                {{ item.otherQuality }}
              </td>
              <td align="center">
                <!-- <a-textarea allow-clear /> -->
              </td>
            </tr>
            <tr align="center">
              <td>累计</td>
              <td>{{ surfaceForm.scvVolume }}</td>
              <td>{{ surfaceForm.scvQuality }}</td>
              <td>{{ surfaceForm.lightVolume }}</td>
              <td>{{ surfaceForm.lightQuality }}</td>
              <td>{{ surfaceForm.otherGasVolume }}</td>
              <td>{{ surfaceForm.otherGasQuality }}</td>
              <td></td>
            </tr>
            <tr align="center">
              <td colspan="2">本月合计体积(Nm3)</td>
              <td colspan="6">
                {{ surfaceForm.currentMonthTotalVolume }}
              </td>
            </tr>
            <tr align="center">
              <td colspan="2">本月合计质量(t)</td>
              <td colspan="6">
                {{ surfaceForm.currentMonthTotalQuality }}
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
  querySelfConsumeDailyData,
  selfCosGasMonthRepAudio,
} from "@/api/selfConsumptionMonth";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/components/approvalRecord/index.vue";
export default {
  components: {
    stepsModel,
    fileUpload: fileUpload,
  },
  data() {
    return {
      mode2: [],
      value: [],
      reportType: [
        { value: "结算型", label: "结算型" },
        { value: "统计型", label: "统计型" },
      ],
      Time: [],
      Month: [],
      //表格中的数据
      dataSource: [],
      surfaceForm: {},
      tradeFormData: "",
      pipelineExportMonthlyReport: [],
      flieChanges: {},
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
    this.getListDetails("J12000000000051");
  },
  methods: {
    approvalMethod(type) {
      selfCosGasMonthRepAudio({
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
        let Consumable = [];
        let list = [];

        let totalSCVVolume = 0;
        let totalSCVQuality = 0;
        let totallightVolume = 0;
        let totallightQuality = 0;
        let totalotherVolume = 0;
        let totalotherQuality = 0;

        querySelfConsumeDailyData({
          startTime: dateString[0],
          endTime: dateString[1],
        }).then((res) => {
          Consumable = res.body;
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < Consumable.length; j++) {
              if (list[i].judgeMonht == Consumable[j].createdDate) {
                list[i].SCVVolume = Consumable[j].SCVVolume;
                list[i].SCVQuality = Consumable[j].SCVQuality;
                list[i].lightVolume = Consumable[j].lightVolume;
                list[i].lightQuality = Consumable[j].lightQuality;
                list[i].otherVolume = Consumable[j].otherVolume;
                list[i].otherQuality = Consumable[j].otherQuality;
              }
            }
          }
          for (let i = 0; i < list.length; i++) {
            if (list[i].SCVVolume) {
            } else {
              list[i].SCVVolume = 0;
            }
            if (list[i].SCVQuality) {
            } else {
              list[i].SCVQuality = 0;
            }
            if (list[i].lightVolume) {
            } else {
              list[i].lightVolume = 0;
            }
            if (list[i].lightQuality) {
            } else {
              list[i].lightQuality = 0;
            }
            if (list[i].otherVolume) {
            } else {
              list[i].otherVolume = 0;
            }
            if (list[i].otherQuality) {
            } else {
              list[i].otherQuality = 0;
            }
            totalSCVVolume += parseInt(list[i].SCVVolume);
            totalSCVQuality += parseInt(list[i].SCVQuality);
            totallightVolume += parseInt(list[i].lightVolume);
            totallightQuality += parseInt(list[i].lightQuality);
            totalotherVolume += parseInt(list[i].otherVolume);
            totalotherQuality += parseInt(list[i].otherQuality);
          }
          this.surfaceForm.currentMonthTotalVolume =
            parseInt(totalotherVolume) +
            parseInt(totallightVolume) +
            parseInt(totalSCVVolume);
          this.surfaceForm.currentMonthTotalQuality =
            parseInt(totalSCVQuality) +
            parseInt(totallightQuality) +
            parseInt(totalotherQuality);
          this.surfaceForm.scvVolume = totalSCVVolume;
          this.surfaceForm.scvQuality = totalSCVQuality;
          this.surfaceForm.lightVolume = totallightVolume;
          this.surfaceForm.lightQuality = totallightQuality;
          this.surfaceForm.otherGasVolume = totalotherVolume;
          this.surfaceForm.otherGasQuality = totalotherQuality;
          this.pipelineExportMonthlyReport = list;
        });

        for (let index = 0; index < dateString.length; index++) {
          const element = dateString[index];
          if (index < dateString.length - 1) {
            dayString +=
              this.timePatternConvert(element) +
              "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0至\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
          } else {
            dayString += this.timePatternConvert(element);
          }
        }
        this.tradeFormData = dayString;
        list = this.generateDayList(dateString);
      });
    },
    // 上传
    flieChange(val) {
      this.flieChanges = val;
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

    //日期的onchange
    onChange(date, dateString) {
      if (date.length != 0) {
        this.form.startTime = date[0];
        this.form.endTime = date[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
    onChange2(date, dateString) {
      let dayString = "";
      let Consumable = [];
      let list = [];
      this.surfaceForm.startTime = dateString[0];
      this.surfaceForm.endTime = dateString[1];

      let totalSCVVolume = 0;
      let totalSCVQuality = 0;
      let totallightVolume = 0;
      let totallightQuality = 0;
      let totalotherVolume = 0;
      let totalotherQuality = 0;

      querySelfConsumeDailyData({
        startTime: dateString[0],
        endTime: dateString[1],
      }).then((res) => {
        Consumable = res.body;
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < Consumable.length; j++) {
            if (list[i].judgeMonht == Consumable[j].createdDate) {
              list[i].SCVVolume = Consumable[j].SCVVolume;
              list[i].SCVQuality = Consumable[j].SCVQuality;
              list[i].lightVolume = Consumable[j].lightVolume;
              list[i].lightQuality = Consumable[j].lightQuality;
              list[i].otherVolume = Consumable[j].otherVolume;
              list[i].otherQuality = Consumable[j].otherQuality;
            }
          }
        }
        for (let i = 0; i < list.length; i++) {
          if (list[i].SCVVolume) {
          } else {
            list[i].SCVVolume = 0;
          }
          if (list[i].SCVQuality) {
          } else {
            list[i].SCVQuality = 0;
          }
          if (list[i].lightVolume) {
          } else {
            list[i].lightVolume = 0;
          }
          if (list[i].lightQuality) {
          } else {
            list[i].lightQuality = 0;
          }
          if (list[i].otherVolume) {
          } else {
            list[i].otherVolume = 0;
          }
          if (list[i].otherQuality) {
          } else {
            list[i].otherQuality = 0;
          }
          totalSCVVolume += parseInt(list[i].SCVVolume);
          totalSCVQuality += parseInt(list[i].SCVQuality);
          totallightVolume += parseInt(list[i].lightVolume);
          totallightQuality += parseInt(list[i].lightQuality);
          totalotherVolume += parseInt(list[i].otherVolume);
          totalotherQuality += parseInt(list[i].otherQuality);
        }
        this.surfaceForm.currentMonthTotalVolume =
          parseInt(totalotherVolume) +
          parseInt(totallightVolume) +
          parseInt(totalSCVVolume);
        this.surfaceForm.currentMonthTotalQuality =
          parseInt(totalSCVQuality) +
          parseInt(totallightQuality) +
          parseInt(totalotherQuality);
        this.surfaceForm.scvVolume = totalSCVVolume;
        this.surfaceForm.scvQuality = totalSCVQuality;
        this.surfaceForm.lightVolume = totallightVolume;
        this.surfaceForm.lightQuality = totallightQuality;
        this.surfaceForm.otherGasVolume = totalotherVolume;
        this.surfaceForm.otherGasQuality = totalotherQuality;
        this.pipelineExportMonthlyReport = list;
      });

      for (let index = 0; index < dateString.length; index++) {
        const element = dateString[index];
        if (index < dateString.length - 1) {
          dayString +=
            this.timePatternConvert(element) +
            "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0至\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
        } else {
          dayString += this.timePatternConvert(element);
        }
      }
      this.tradeFormData = dayString;
      list = this.generateDayList(dateString);
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
                SCVVolume: "",
                SCVQuality: "",
                lightVolume: "",
                lightQuality: "",
                otherVolume: "",
                otherQuality: "",
              };
              dailyData.push(data);
            }
          } else {
            for (let i = dateSplit.startTime[2]; i < element; i++) {
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
                SCVVolume: "",
                SCVQuality: "",
                lightVolume: "",
                lightQuality: "",
                otherVolume: "",
                otherQuality: "",
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
              SCVVolume: "",
              SCVQuality: "",
              lightVolume: "",
              lightQuality: "",
              otherVolume: "",
              otherQuality: "",
            };
            dailyData.push(data);
          }
        } else {
          for (let i = 1; i < element; i++) {
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
              SCVVolume: "",
              SCVQuality: "",
              lightVolume: "",
              lightQuality: "",
              otherVolume: "",
              otherQuality: "",
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
    timePatternConvert(time) {
      let newTime;
      var str = time;
      // eslint-disable-next-line no-useless-escape
      var reg = /(\d{4})\-(\d{2})\-(\d{2})/;
      newTime = str.replace(reg, "$1年$2月$3日8:00");
      return newTime;
    },

    //查询条件月份范围选择器必备方法
    monthRangeChange(value, mode) {
      this.Month = value;
      this.mode2 = [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1],
      ];
      this.form.startMonth = this.formatDate(
        new Date(this.Month[0]),
        "yyyy-MM"
      );
      this.form.endMonth = this.formatDate(new Date(this.Month[1]), "yyyy-MM");
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
.input {
  /deep/.ant-select-selection {
    border: 1px solid #fff;
  }
}
</style>
