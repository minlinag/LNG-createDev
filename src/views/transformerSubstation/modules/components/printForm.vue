<template>
  <div id="printContent" style="width: 100%">
    <div class="header" style="text-align: center; font-weight: bolder">
      <h3>电气设备停送电联系单</h3>
    </div>
    <div class="information">
      <p style="width: 33%; float: right; font-weight: bolder">
        编号:{{ tableList.numbers }}
      </p>
    </div>
    <table class="table_form" width="100%" border="2">
      <tr>
        <td align="center" colspan="2" style="width: 25%; font-weight: bolder">
          设备名称
        </td>
        <td align="center" colspan="2" style="width: 25%; font-weight: bolder">
          工艺位号
        </td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 25%; height: 22px">
          {{ tableList.eqmName }}
        </td>
        <td align="center" colspan="2" style="width: 25%; height: 22px">
          {{ tableList.eqmNo }}
        </td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 25%; height: 22px"></td>
        <td align="center" colspan="2" style="width: 25%; height: 22px"></td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 25%; height: 22px"></td>
        <td align="center" colspan="2" style="width: 25%; height: 22px"></td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 25%; height: 22px"></td>
        <td align="center" colspan="2" style="width: 25%; height: 22px"></td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 33%; font-weight: bolder">
          操作性质
        </td>
        <td align="center" colspan="2" style="width: 33%; font-weight: bolder">
          <a-radio-group v-model="tableList.natureOperation">
            <a-radio :value="'停电'">停电</a-radio>
            <a-radio :value="'送电'">送电</a-radio>
          </a-radio-group>
          <!-- <a-checkbox-group v-model="tableList.natureOperation">
            <a-checkbox value="停电"> 停电 </a-checkbox>
            <a-checkbox value="送电"> 送电 </a-checkbox>
          </a-checkbox-group> -->
        </td>
      </tr>
    </table>
    <table class="table_form" width="100%" border="2" style="border-top: none">
      <tr>
        <td align="center" colspan="2" style="width: 33%; font-weight: bolder">
          申请理由
        </td>
        <td align="left" colspan="2" style="width: 66%">
          {{ tableList.applyReason }}
        </td>
      </tr>
    </table>
    <table class="table_form" width="100%" border="2" style="border-top: none">
      <tr>
        <td
          align="center"
          colspan="2"
          rowspan="4"
          style="width: 33%; font-weight: bolder"
        >
          相关专业意见
        </td>
        <td align="left" colspan="2" style="width: 33%">
          <a style="font-weight: bolder; color: rgb(96, 96, 96)">工艺意见:</a>
          {{
            dataSourceApproval.length > this.step1
              ? dataSourceApproval[this.step1]?.opinion
              : ""
          }}
        </td>
        <td align="left" colspan="2" style="width: 33%">
          <a style="font-weight: bolder; color: rgb(96, 96, 96)">签字:</a>
          {{
            dataSourceApproval.length > this.step1
              ? dataSourceApproval[this.step1]?.executorName
              : ""
          }}
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" style="width: 33%">
          <a style="font-weight: bolder; color: rgb(96, 96, 96)">仪表意见:</a>
          {{
            dataSourceApproval.length > this.step2
              ? dataSourceApproval[this.step2]?.opinion
              : ""
          }}
        </td>
        <td align="left" colspan="2" style="width: 33%">
          <a style="font-weight: bolder; color: rgb(96, 96, 96)">签字:</a>
          {{
            dataSourceApproval.length > this.step2
              ? dataSourceApproval[this.step2]?.executorName
              : ""
          }}
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" style="width: 33%">
          <a style="font-weight: bolder; color: rgb(96, 96, 96)">机械意见:</a>
          {{
            dataSourceApproval.length > this.step3
              ? dataSourceApproval[this.step3]?.opinion
              : ""
          }}
        </td>
        <td align="left" colspan="2" style="width: 33%">
          <a style="font-weight: bolder; color: rgb(96, 96, 96)">签字:</a>
          {{
            dataSourceApproval.length > this.step3
              ? dataSourceApproval[this.step3]?.executorName
              : ""
          }}
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" style="width: 33%">
          <a style="font-weight: bolder; color: rgb(96, 96, 96)">电气意见:</a>
          {{
            dataSourceApproval.length > this.step4
              ? dataSourceApproval[this.step4]?.opinion
              : ""
          }}
        </td>
        <td align="left" colspan="2" style="width: 33%">
          <a style="font-weight: bolder; color: rgb(96, 96, 96)">签字:</a>
          {{
            dataSourceApproval.length > this.step4
              ? dataSourceApproval[this.step4]?.executorName
              : ""
          }}
        </td>
      </tr>
    </table>
    <table class="table_form" width="100%" border="2" style="border-top: none">
      <tr>
        <td align="center" colspan="2" style="width: 33%; font-weight: bolder">
          申请人及申请时间
        </td>
        <td align="center" colspan="2" style="width: 66%">
          <div style="float: left">{{ tableList.applyName }}</div>
          <div style="float: right">
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.applyTime, 0) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">年</a>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.applyTime, 1) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">月</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.applyTime, 2) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">日</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.applyTime, 3) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">时</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.applyTime, 4) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">分</a>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 33%; font-weight: bolder">
          操作执行人及时间
        </td>
        <td align="center" colspan="2" style="width: 66%">
          <div style="float: left">{{ tableList.executeName }}</div>
          <div style="float: right">
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.executeTime, 0) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">年</a>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.executeTime, 1) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">月</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.executeTime, 2) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">日</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.executeTime, 3) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">时</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.executeTime, 4) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">分</a>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 33%; font-weight: bolder">
          申请人确认及时间
        </td>
        <td align="center" colspan="2" style="width: 66%">
          <div style="float: left">{{ tableList.confirmName }}</div>
          <div style="float: right">
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 40px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.confirmTime, 0) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">年</a>
            <span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.confirmTime, 1) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">月</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.confirmTime, 2) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">日</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.confirmTime, 3) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">时</a
            ><span
              style="
                border-bottom: solid 1px #000;
                display: inline-block;
                width: 25px;
                margin: 0;
                vertical-align: bottom;
                font-size: 12px;
                text-align: left;
              "
            >
              {{ splitTime(tableList.confirmTime, 4) }}
            </span>
            <a style="font-weight: bolder; color: rgb(96, 96, 96)">分</a>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 33%; font-weight: bolder">
          备注
        </td>
        <td align="left" colspan="2" style="width: 66%">
          {{ tableList.remark }}
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import {
  historyList,
  stepData,
} from "@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js";
export default {
  props: ["tableList", "status"],
  data() {
    return {
      dataSourceApproval: [],
      step: "",
      step1: "",
      step2: "",
      step3: "",
      step4: "",
    };
  },
  watch: {
    tableList: {
      handler(val) {
        if (val.id) {
          this.getstepData(val.id);
          this.getDataSourceApproval(val.id);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    cancel(e) {
      this.$emit("cancel");
    },
    splitTime(time, index) {
      if (time) {
        let timeArr = time.split(/[- :]/);
        return timeArr[index];
      }
      // 2023-02-15 14:38:57 转化  [2023,02,15,14,38,57]
    },
    // 审批步骤
    getstepData(id, data, index) {
      stepData({ businessId: this.tableList.id }).then((res) => {
        if (this.status != 1) {
          if (this.status != 2) {
            this.step = res.body.stepProgress;
            if (index < this.step) {
              if (data == 3) {
                this.step1 = this.step - 1;
              }
            } else {
              this.step1 = this.step - 2;
            }
          }
        }
        this.step2 = this.step1 - 1;
        this.step3 = this.step1 - 2;
        this.step4 = this.step1 - 3;
      });
    },
    //审批历史列表
    getDataSourceApproval(id) {
      historyList({ businessId: this.tableList.id }).then((res) => {
        if (this.status != 1) {
          if (this.status != 2) {
            this.dataSourceApproval = res.body.data || [];
            this.dataSourceApproval.forEach((item, index) => {
              item.id = index;
              if (item.executeResult == 3) {
                this.getstepData(id, item.executeResult, index);
              }
            });
          } else {
            this.dataSourceApproval = [];
          }
        } else {
          this.dataSourceApproval = [];
        }
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
