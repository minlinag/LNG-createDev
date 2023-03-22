<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="wrapper" :model="surfaceForm">
        <div id="printContent">
          <table class="table_form" width="100%" border="2">
            <tr>
              <th style="height: 90px; font-size: 18px" colspan="7">
                北京燃气集团(天津)液化天然气有限公司
                <br />
                液化天然气槽车装车量汇总表
                <!-- {{ year }}年{{ month }}月 -->
              </th>
            </tr>
            <tr>
              <td align="center" style="width: 15%">报表类型：</td>
              <td>
                <a-select
                  disabled
                  class="input"
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
              <td colspan="5" style="text-align: center">
                <a-range-picker
                  disabled
                  format="YYYY-MM-DD"
                  class="td_range_picker"
                >
                </a-range-picker>
                {{ tradeFormData }}
                <!-- {{ typeMonth }} -->
              </td>
            </tr>
            <tr>
              <td align="center" rowspan="2">日期</td>
              <td align="center" colspan="3">装车量</td>
              <td align="center" colspan="3">年累计</td>
            </tr>
            <tr align="center">
              <td width="15%">辆</td>
              <td width="15%">吨</td>
              <td width="15%">Nm3</td>
              <td width="15%">辆</td>
              <td width="15%">吨</td>
              <td width="15%">Nm3</td>
            </tr>
            <tr v-for="(item, index) in tankWagonList" :key="index">
              <td align="center">{{ item.monht }}</td>
              <td align="center">
                {{ item.amount }}
              </td>
              <td align="center">
                {{ item.loadingCount }}
              </td>
              <td align="center">
                {{ item.volume }}
              </td>
              <td align="center">
                {{ item.yearamount }}
              </td>
              <td align="center">
                {{ item.yearloadingCount }}
              </td>
              <td align="center">
                {{ item.yearvolume }}
              </td>
            </tr>
            <tr align="center">
              <td>合计</td>
              <td>{{ surfaceForm.loadingNumber }}</td>
              <td>{{ surfaceForm.loadingT }}</td>
              <td>{{ surfaceForm.loadingNm }}</td>
              <td>{{ surfaceForm.yearCumulativeLoadingNumber }}</td>
              <td>{{ surfaceForm.yearCumulativeLoadingT }}</td>
              <td>{{ surfaceForm.yearCumulativeLoadingNm }}</td>
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
  findById,
  queryGasEveryDay,
  queryGasStartDay,
  coldEnergyConsumAudio,
} from "@/api/meteringManagement/tankTruckLoadingMonth";
import stepsModel from "@/components/approvalRecord/index.vue";
import fileUpload from "@/components/upLoad/fileUpload";
export default {
  components: {
    stepsModel,
    fileUpload: fileUpload,
  },
  data() {
    return {
      Month: [],

      formState: {},
      activeKey2: "1",

      mode2: ["month", "month"],
      value: [],

      reportType: [
        { value: "结算型", label: "结算型" },
        { value: "统计型", label: "统计型" },
      ],
      tankWagonList: [],

      //表格中的数据reportType
      dataSource: [],
      surfaceForm: { reportType: "" },

      tradeFormData: "年 月 日至 年 月 日",
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
    // this.getListDetails("J05000000000036");
  },
  methods: {
    approvalMethod(type) {
      coldEnergyConsumAudio({
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
    getListDetails(value) {
      findById(value).then((res) => {
        console.log("res", res.body);
        this.surfaceForm = res.body;
        if (this.surfaceForm.fileInfo.indexOf("“") > 0) {
          this.flieChanges = JSON.parse(
            this.chineseChar2englishChar(this.surfaceForm.fileInfo)
          );
        } else {
          if (this.surfaceForm.fileInfo) {
            this.flieChanges = JSON.parse(this.surfaceForm.fileInfo);
          }
        }
        console.log("this.surfaceForm", this.surfaceForm);
        let dateString = [
          this.surfaceForm.startCumulativeDate,
          this.surfaceForm.endCumulativeDate,
        ];
        let B = [];
        let C = [];
        let list = [];

        queryGasEveryDay(dateString).then((res) => {
          B = res.body;
          queryGasStartDay({ startTime: dateString[0] }).then((res) => {
            C = res.body;
            list = this.generateDayList(dateString);

            for (let i = 0; i < list.length; i++) {
              for (let j = 0; j < B.length; j++) {
                if (B[j].amount) {
                } else {
                  B[j].amount = 0;
                }
                if (B[j].loadingCount) {
                } else {
                  B[j].loadingCount = 0;
                }
                if (B[j].volume) {
                } else {
                  B[j].volume = 0;
                }
                if (list[i].judgeMonht == B[j].cutoffTime) {
                  list[i].amount = B[j].amount;
                  list[i].loadingCount = B[j].loadingCount;
                  list[i].volume = B[j].volume;
                }
              }
            }
            console.log(list);
            for (let i = 0; i < list.length; i++) {
              for (let j = 0; j < C.length; j++) {
                if (list[i].judgeMonht == C[j].cutoffTime) {
                  list[i].yearamount = C[j].amount;
                  list[i].yearloadingCount = C[j].loadingCount;
                  list[i].yearvolume = C[j].volume;
                }
              }
            }

            for (let i = 0; i < list.length; i++) {
              if (list[i].amount) {
              } else {
                list[i].amount = 0;
              }
              if (list[i].loadingCount) {
              } else {
                list[i].loadingCount = 0;
              }
              if (list[i].volume) {
              } else {
                list[i].volume = 0;
              }
              if (list[i].yearamount) {
              } else {
                list[i].yearamount = 0;
              }
              if (list[i].yearloadingCount) {
              } else {
                list[i].yearloadingCount = 0;
              }
              if (list[i].yearvolume) {
              } else {
                list[i].yearvolume = 0;
              }
              if (i >= 1) {
                list[i].yearamount =
                  parseInt(list[i].amount) + parseInt(list[i - 1].yearamount);
                list[i].yearloadingCount =
                  parseInt(list[i].loadingCount) +
                  parseInt(list[i - 1].yearloadingCount);
                list[i].yearvolume =
                  parseInt(list[i].volume) + parseInt(list[i - 1].yearvolume);
              }
            }
            this.tankWagonList = list;
            let totalamount = 0;
            let totalloadingCount = 0;
            let totalvolume = 0;
            let totalyearamount = 0;
            let totalyearloadingCount = 0;
            let totalyearvolume = 0;
            for (let i = 0; i < this.tankWagonList.length; i++) {
              totalamount += parseInt(this.tankWagonList[i].amount);
              totalloadingCount += parseInt(this.tankWagonList[i].loadingCount);
              totalvolume += parseInt(this.tankWagonList[i].volume);
              totalyearamount += parseInt(this.tankWagonList[i].yearamount);
              totalyearloadingCount += parseInt(
                this.tankWagonList[i].yearloadingCount
              );
              totalyearvolume += parseInt(this.tankWagonList[i].yearvolume);
            }
            this.surfaceForm.loadingNumber = totalamount;
            this.surfaceForm.loadingT = totalloadingCount;
            this.surfaceForm.loadingNm = totalvolume;
            this.surfaceForm.yearCumulativeLoadingNumber = totalyearamount;
            this.surfaceForm.yearCumulativeLoadingT = totalyearloadingCount;
            this.surfaceForm.yearCumulativeLoadingNm = totalyearvolume;
            // console.log(this.tankWagonList);
          });
        });

        let dayString = "";
        console.log("dateString",dateString);
        for (let index = 0; index < dateString.length; index++) {
          const element = dateString[index];
          if (index < dateString.length - 1) {
            dayString +=
              this.timePatternConvert(element) +
              " 08:00" +
              "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0至\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
          } else {
            dayString += this.timePatternConvert(element) + " 08:00";
          }
        }

        this.tradeFormData = dayString;
      });
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
                amount: "",
                loadingCount: "",
                volume: "",
                yearamount: "",
                yearloadingCount: "",
                yearvolume: "",
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
                amount: "",
                loadingCount: "",
                volume: "",
                yearamount: "",
                yearloadingCount: "",
                yearvolume: "",
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
              amount: "",
              loadingCount: "",
              volume: "",
              yearamount: "",
              yearloadingCount: "",
              yearvolume: "",
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
              amount: "",
              loadingCount: "",
              volume: "",
              yearamount: "",
              yearloadingCount: "",
              yearvolume: "",
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
      newTime = str.replace(reg, "$1年$2月$3日");
      return newTime;
    },
    // 附件
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
  height: 100%;
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
