<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="wrapper" :model="surfaceForm">
        <div id="printContent">
          <table class="table_form" width="100%" border="2">
            <tr>
              <th style="height: 90px; font-size: 18px" colspan="6">
                北京燃气集团（天津）液化天然气有限公司液化天然气销售
                <br />
                计量交接凭证
              </th>
            </tr>
            <tr align="center" class="trHeight">
              <td style="width: 15%">计量地点：</td>
              <td class="input" style="width: 15%">
                <a-input
                  disabled
                  style="width: 100%"
                  v-model="surfaceForm.measureSite"
                />
              </td>
              <td style="width: 15%" width="100px">填报人：</td>
              <td style="width: 15%">
                {{ surfaceForm.fillUser }}
                <!-- <a-input v-model="surfaceForm.fillUser" /> -->
              </td>
              <td style="width: 15%">编号：</td>
              <td style="width: 15%">
                {{ surfaceForm.serialNumber }}
              </td>
            </tr>
            <tr class="trHeight">
              <td align="center">时间</td>
              <td colspan="5" style="text-align: center">
                <a-range-picker
                  disabled
                  format="YYYY-MM-DD"
                  class="td_range_picker"
                >
                </a-range-picker>
                {{ tradeFormData }}
              </td>
            </tr>
          </table>
          <table
            style="border-top: none"
            class="table_form"
            width="100%"
            border="2"
          >
            <tr style="font-size: 18px; height: 40px">
              <th colspan="6">每日供气量</th>
            </tr>
            <tr class="trHeight">
              <td align="center">序号</td>
              <td align="center">车牌</td>
              <td align="center">装车时间</td>
              <td align="center">供气量(t)</td>
              <td align="center">供气量(Nm3)</td>
              <td align="center">密度(Kg/Nm3)</td>
            </tr>
            <tr
              v-for="(item, index) in supplyGas"
              :key="index"
              class="trHeight"
            >
              <td align="center">{{ index + 1 }}</td>
              <td align="center">{{ item.number_tractor }}</td>
              <td align="center">{{ item.loading_start_time }}</td>
              <td align="center">{{ item.loadingCount }}</td>
              <td align="center">{{ item.volume }}</td>
              <td align="center">{{ item.density }}</td>
            </tr>
          </table>
          <table
            style="border-top: none"
            class="table_form"
            width="100%"
            border="2"
          >
            <tr align="center" class="trHeight">
              <td>日供气量合计（t）小写</td>
              <td colspan="2" style="width: 173px">
                {{ surfaceForm.totalDailyGasSupplyT }}
              </td>
              <td>日供气量合计（t）大写</td>
              <td colspan="2" style="width: 211px">
                {{ surfaceForm.totalDailyGasSupplyTCap }}
              </td>
            </tr>
            <tr align="center" class="trHeight">
              <td>日供气量合计（万Nm3）小写</td>
              <td colspan="2">
                {{ surfaceForm.totalDailyGasSupplyNm }}
              </td>
              <td>日供气量合计（Nm3）大写</td>
              <td colspan="2">
                {{ surfaceForm.totalDailyGasSupplyNmCap }}
              </td>
            </tr>
            <tr align="center" class="trHeight">
              <td>平均密度(Kg/Nm3)</td>
              <td colspan="5">
                {{ surfaceForm.averageDensity }}
              </td>
            </tr>
            <tr class="tr_remark">
              <td align="center">备注</td>
              <td class="input" colspan="5" align="left">
                <a-textarea disabled allow-clear v-model="surfaceForm.remark" />
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
                  @fileChange="fileListChange"
                  :echoList="flieChanges"
                  ref="importConpontsDataRef"
                  disabled
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
  loadingDailyAudio,
  queryDailyGasAmount,
} from "@/api/tankTruckLoadingDaily";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/components/approvalRecord/index.vue";
export default {
  components: {
    stepsModel,
    fileUpload: fileUpload,
  },
  data() {
    return {
      supplyGas: [],
      //表格中的数据
      dataSource: [],
      surfaceForm: {},
      tradeFormData: "年 月 日 08:00 至 年 月 日 08:00",
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
    // this.getListDetails("J04000000000079");
  },
  methods: {
    approvalMethod(type) {
      loadingDailyAudio({
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

    //获取表格列表
    getListDetails(value) {
      let id = { id: value };
      findById(id).then((res) => {
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

        let A = {
          startTime: this.surfaceForm.startTime,
          endTime: this.surfaceForm.endTime,
        };

        let dateString = [this.surfaceForm.startTime, this.surfaceForm.endTime];

        queryDailyGasAmount(A).then((res) => {
          this.supplyGas = res.body;

          let TotalDailySupplyT = 0;
          let TotalDailySupplyNm3 = 0;
          let AverageDensity = 0;
          this.surfaceForm.loadingNumber = this.supplyGas.length;
          for (let i = 0; i < this.supplyGas.length; i++) {
            if (this.supplyGas[i].loading_start_time) {
              this.supplyGas[i].loading_start_time = this.supplyGas[
                i
              ].loading_start_time.substring(0, 16);
            }
            if (this.supplyGas[i].loadingCount == null) {
              this.supplyGas[i].loadingCount = 0;
            }
            TotalDailySupplyT += parseInt(this.supplyGas[i].loadingCount);
            if (this.supplyGas[i].volume == null) {
              this.supplyGas[i].volume = 0;
            }
            TotalDailySupplyNm3 += parseInt(this.supplyGas[i].volume);
            if (this.supplyGas[i].density == null) {
              this.supplyGas[i].density = 0;
            }
            AverageDensity += parseInt(this.supplyGas[i].density);
          }
          this.surfaceForm.totalDailyGasSupplyT = TotalDailySupplyT;
          this.surfaceForm.totalDailyGasSupplyTCap =
            this.smallToBig(TotalDailySupplyT);
          this.surfaceForm.totalDailyGasSupplyNm = TotalDailySupplyNm3 / 10000;
          this.surfaceForm.totalDailyGasSupplyNmCap =
            this.smallToBig(TotalDailySupplyNm3);
          this.surfaceForm.averageDensity =
            this.supplyGas.length > 0
              ? parseInt(AverageDensity) / this.supplyGas.length
              : 0;
        });

        let dayString = "";
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
        console.log("dayString", dayString);

        this.tradeFormData = dayString;
      });
    },
    timePatternConvert(time) {
      let newTime;
      var str = time;
      // eslint-disable-next-line no-useless-escape
      var reg = /(\d{4})\-(\d{2})\-(\d{2})/;
      newTime = str.replace(reg, "$1年$2月$3日8:00");
      return newTime;
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
    // 数字转大写
    smallToBig(money) {
      // 汉字的数字
      const cnNums = [
        "零",
        "壹",
        "贰",
        "叁",
        "肆",
        "伍",
        "陆",
        "柒",
        "捌",
        "玖",
      ];
      // 基本单位
      const cnIntRadice = ["", "拾", "佰", "仟"];
      // 对应整数部分扩展单位
      const cnIntUnits = ["", "万", "亿", "兆"];
      // 对应小数部分单位
      const cnDecUnits = ["角", "分", "厘", "毫"];
      // 整数金额时后面跟的字符
      const cnInteger = "整";
      // 整型完以后的单位
      const cnIntLast = "元";
      // 最大处理的数字
      const maxNum = 9999999999999999.99;
      // 金额整数部分
      let integerNum;
      // 金额小数部分
      let decimalNum;
      // 输出的中文金额字符串
      let chineseStr = "";
      // 分离金额后用的数组，预定义
      let parts;
      if (money === "") {
        return "";
      }
      money = parseFloat(money);
      if (money >= maxNum) {
        // 超出最大处理数字
        return "";
      }
      if (money === 0) {
        chineseStr = cnNums[0];
        return chineseStr;
      }
      // 转换为字符串
      money = money.toString();
      if (money.indexOf(".") === -1) {
        integerNum = money;

        decimalNum = "";
      } else {
        parts = money.split(".");
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
      }
      // 获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        let zeroCount = 0;
        const IntLen = integerNum.length;
        for (let i = 0; i < IntLen; i++) {
          const n = integerNum.substr(i, 1);
          const p = IntLen - i - 1;
          const q = p / 4;
          const m = p % 4;
          if (n === "0") {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            // 归零
            zeroCount = 0;
            //alert(cnNums[parseInt(n)])
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m === 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      // 小数部分
      if (decimalNum !== "") {
        const decLen = decimalNum.length;
        for (let i = 0; i < decLen; i++) {
          const n = decimalNum.substr(i, 1);
          if (n !== "0") {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr === "") {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum === "") {
        chineseStr += cnInteger;
      }
      return chineseStr;
    },
    fileListChange(val) {
      this.flieChanges = val;
    },
  },
};
</script>
<style scoped lang="less">
.trHeight {
  height: 33px;
}
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
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}
</style>
