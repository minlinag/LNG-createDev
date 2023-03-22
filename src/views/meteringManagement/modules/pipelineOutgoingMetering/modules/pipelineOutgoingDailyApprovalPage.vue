<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-tabs type="card" v-model="activeKey1">
        <a-tab-pane key="1" tab="交易凭证">
          <div class="wrapper" :model="surfaceForm">
            <div id="printContent1">
              <table class="table_form" width="100%" border="2">
                <tr style="height: 90px; font-size: 18px">
                  <th colspan="2">
                    北京燃气集团（天津）液化天然气有限公司
                    <br />
                    日计量交接凭证
                  </th>
                </tr>
                <tr class="input" style="height: 35px">
                  <td align="center">时间</td>
                  <td align="center">
                    <a-range-picker
                      disabled
                      format="YYYY-MM-DD"
                      class="td_range_picker"
                    >
                    </a-range-picker>
                    {{ tradeFormData }}
                  </td>
                </tr>
                <tr class="input">
                  <td align="center">气量（Nm³）</td>
                  <td align="left">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.gasFlowNm"
                      placeholder=""
                    />
                  </td>
                </tr>
                <tr class="input">
                  <td align="center">气量（t）</td>
                  <td align="left">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.gasFlowT"
                      placeholder=""
                    />
                  </td>
                </tr>
                <tr class="input">
                  <td align="center">压力（pa）</td>
                  <td align="left">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.pressure"
                      placeholder=""
                    />
                  </td>
                </tr>
                <tr class="tr_remark input">
                  <td align="center">备注</td>
                  <td align="left">
                    <a-textarea
                      disabled
                      v-model="surfaceForm.dealRemark"
                      placeholder=""
                      allow-clear
                    />
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
                      ref="importConpontsDataRefs"
                    ></file-upload>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="气质分析报告">
          <div class="wrapper" :model="surfaceForm" ref="surfaceForm">
            <div id="printContent2">
              <table class="table_form" width="100%" border="2">
                <tr style="height: 90px; font-size: 18px">
                  <th colspan="4">
                    北京燃气集团(天津)液化天然气有限责任公司
                    <br />
                    液化天然气气质分析报告
                  </th>
                </tr>
                <tr style="height: 35px" align="center">
                  <td>取样地点：</td>
                  <td colspan="3">
                    北京燃气集团(天津)液化天然气有限公司外输分析仪表
                  </td>
                </tr>
                <tr style="height: 35px">
                  <td align="center">分析日期</td>
                  <td colspan="3" style="text-align: center" class="hide">
                    {{ tradeFormData }}
                  </td>
                </tr>
                <tr align="center" style="height: 35px">
                  <td>编号：</td>
                  <td colspan="3">{{ surfaceForm.gasCode }}</td>
                </tr>
                <tr style="height: 35px" align="center">
                  <th colspan="4">分 析 结 果</th>
                </tr>
                <tr style="height: 35px">
                  <td align="center">分析项目</td>
                  <td align="center">烃类%（mol）</td>
                  <td align="center">分析项目</td>
                  <td align="center">非烃类%（mol）</td>
                </tr>
                <tr class="input">
                  <td align="center" prop="ch4">CH4</td>
                  <td align="center">
                    <a-input
                      disabled
                      name="ch4"
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.ch4"
                    />
                  </td>
                  <td align="center">N2</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.n2"
                    />
                  </td>
                </tr>
                <tr class="input">
                  <td align="center">C2H6</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.c2h6"
                    />
                  </td>
                  <td align="center">C6+</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.c6"
                    />
                  </td>
                </tr>
                <tr class="input">
                  <td align="center">C3H8</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.c3h8"
                    />
                  </td>
                  <td align="center">CO2</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.co2"
                    />
                  </td>
                </tr>
                <tr class="input">
                  <td align="center">IC4H10</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.ic4h10"
                    />
                  </td>
                  <td align="center"></td>
                  <td align="center"></td>
                </tr>
                <tr class="input">
                  <td align="center">NC4H10</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.nc4h10"
                    />
                  </td>
                  <td align="center"></td>
                  <td align="center"></td>
                </tr>
                <tr class="input">
                  <td align="center">C5H12</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.c5h12"
                    />
                  </td>
                  <td align="center"></td>
                  <td align="center"></td>
                </tr>
                <tr class="input">
                  <td align="center">IC5H12</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.ic5h12"
                    />
                  </td>
                  <td align="center"></td>
                  <td align="center"></td>
                </tr>
                <tr class="input">
                  <td align="center">NC5H12</td>
                  <td align="center">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.nc5h12"
                    />
                  </td>
                  <td align="center"></td>
                  <td align="center"></td>
                </tr>
                <tr align="center" class="input">
                  <td colspan="2">密度（Kg/m3）</td>
                  <td colspan="2">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.density"
                    />
                  </td>
                </tr>
                <tr align="center" class="input">
                  <td colspan="2">硫化氢（mg/m3）</td>
                  <td colspan="2">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.hydrogenSulfid"
                    />
                  </td>
                </tr>
                <tr align="center" class="input">
                  <td colspan="2">总硫（以硫计）（mg/m3）</td>
                  <td colspan="2">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.totalSulfur"
                    />
                  </td>
                </tr>
                <tr align="center" class="input">
                  <td colspan="2">水露点（oC）</td>
                  <td colspan="2">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.waterDewPoint"
                    />
                  </td>
                </tr>
                <tr align="center" class="input">
                  <td colspan="2">高位发热量（MJ/m3）</td>
                  <td colspan="2">
                    <a-input
                      disabled
                      oninput="value=value.replace(/\D/g,'')"
                      v-model="surfaceForm.highCalorificValue"
                    />
                  </td>
                </tr>
                <tr class="tr_remark input">
                  <td align="center">备注</td>
                  <td colspan="3" align="left">
                    <a-textarea disabled v-model="surfaceForm.gasRemark" />
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
                      @fileChange="flieChange2"
                      :echoList="flieChanges2"
                      disabled
                      ref="importConpontsDataRefs2"
                    ></file-upload>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>
        </a-tab-pane>
      </a-tabs>

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
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getById,
  equipmentAlterationAudio,
  queryGasEveryDay,
} from "@/api/meteringManagement/pipelineOutgoingDaily";
import tradeCertificate from "./components/tradeCertificate.vue";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/components/approvalRecord/index.vue";

import moment from "moment";

export default {
  components: {
    tradeCertificate,
    stepsModel,
    fileUpload: fileUpload,
  },
  data() {
    return {
      surfaceForm: { ch4: "" },
      activeKey1: "1",
      startDate: [],
      dataSource: [],
      tradeFormData: "年 月 日 08:00 至 年 月 日 08:00",
      flieChanges: [],
      flieChanges2: [],
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
    // this.getListDetails("J061678170167201");
  },
  methods: {
    approvalMethod(type) {
      equipmentAlterationAudio({
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
      // 根据id查详情
      getById(value).then((res) => {
        console.log("res", res);
        this.surfaceForm = res.body;

        if (this.surfaceForm.fileInfo) {
          this.flieChanges = JSON.parse(
            this.chineseChar2englishChar(this.surfaceForm.fileInfo)
          );
        }
        if (this.surfaceForm.fileInfoGas) {
          this.flieChanges2 = JSON.parse(
            this.chineseChar2englishChar(this.surfaceForm.fileInfoGas)
          );
        }

        let daily = {
          startTime: this.surfaceForm.dealStartTime,
          endTime: this.surfaceForm.dealEndTime,
        };
        let dateString = [
          this.surfaceForm.dealStartTime,
          this.surfaceForm.dealEndTime,
        ];

        // 根据数据获取交易凭证数据
        queryGasEveryDay(daily).then((res) => {
          let gasFlowNmTotal = 0;
          let gasFlowTTotal = 0;
          let pressureTotal = 0;
          for (let i = 0; i < res.body.length; i++) {
            if (res.body[i].gasFlowNm) {
            } else {
              res.body[i].gasFlowNm = "0";
            }
            if (res.body[i].gasFlowT) {
            } else {
              res.body[i].gasFlowT = "0";
            }
            if (res.body[i].pressure) {
            } else {
              res.body[i].pressure = "0";
            }
            gasFlowNmTotal += parseInt(res.body[i].gasFlowNm);
            gasFlowTTotal += parseInt(res.body[i].gasFlowT);
            pressureTotal += parseInt(res.body[i].pressure);
          }
          this.$set(this.surfaceForm, "gasFlowNm", gasFlowNmTotal);
          this.$set(this.surfaceForm, "gasFlowT", gasFlowTTotal);
          this.$set(this.surfaceForm, "pressure", pressureTotal);
          this.$forceUpdate();
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
        this.tradeFormData = dayString;
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

    flieChange(val) {
      this.flieChanges = val;
    },
    flieChange2(val) {
      this.flieChanges2 = val;
    },
    timePatternConvert(time) {
      let newTime;
      var str = time;
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
.hide {
  /deep/.anticon svg {
    display: none;
  }
}
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}
</style>
