<template>
  <div id="printContent" style="width: 100%">
    <div class="header" style="text-align: center; font-weight: bolder">
      <h3 v-if="this.$route.path == '/chainReleaseApplication'">
        联锁解除申请表
      </h3>
      <h3 v-if="this.$route.path == '/interlockRecoveryApplication'">
        联锁恢复申请表
      </h3>
    </div>
    <div class="information">
      <p style="width: 50%; font-weight: bolder">编码:</p>
      <p style="width: 50%">
        <a style="font-weight: bolder; color: rgb(89, 89, 89)">序号:</a>
        {{ tableList.numbers }}
      </p>
    </div>
    <table class="table_form" width="100%" border="2">
      <tr>
        <td align="center" colspan="2" style="width: 100%; height: 22px">
          <p
            style="
              width: 50%;
              float: left;
              display: flex;
              justify-content: flex-start;
            "
          >
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">联锁号:</a>
            {{ tableList.interlockNo }}
          </p>
          <p
            style="
              width: 50%;
              float: left;
              display: flex;
              justify-content: flex-start;
            "
          >
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">连锁描述:</a>
            {{ tableList.interlockDescription }}
          </p>
        </td>
      </tr>
    </table>
    <table class="table_form" width="100%" border="2" style="border-top: none">
      <tr>
        <td align="left" colspan="2" style="width: 50%; height: 22px">
          <a style="font-weight: bolder; color: rgb(89, 89, 89)"> 设定值: </a>
          {{ tableList.setValue }}
        </td>
        <td
          align="left"
          colspan="2"
          style="width: 50%; height: 22px; font-weight: bolder"
        >
          连锁级别:
          <a-radio-group v-model="tableList.interlockLevel">
            <a-radio :value="'1'">一级</a-radio>
            <a-radio :value="'2'">二级</a-radio>
            <a-radio :value="'3'">三级</a-radio>
          </a-radio-group>
        </td>
      </tr>
      <tr>
        <td
          align="left"
          colspan="2"
          style="width: 50%; height: 22px"
          v-if="this.$route.path == '/chainReleaseApplication'"
        >
          <a style="font-weight: bolder; color: rgb(89, 89, 89)">
            计划解除时间:
          </a>
          {{ tableList.planRelieveTime }}
        </td>
        <td
          align="left"
          colspan="2"
          style="width: 50%; height: 22px"
          v-if="this.$route.path == '/interlockRecoveryApplication'"
        >
          <a style="font-weight: bolder; color: rgb(89, 89, 89)"> 解除时间: </a>
          {{ tableList.planRelieveTime }}
        </td>
        <td align="left" colspan="2" style="width: 50%; height: 22px">
          <a style="font-weight: bolder; color: rgb(89, 89, 89)">
            计划恢复时间:
          </a>
          {{ tableList.planRelieveTime }}
        </td>
      </tr>
    </table>
    <table class="table_form" width="100%" border="2" style="border-top: none">
      <tr>
        <td align="left" colspan="2" style="width: 100%">
          <a style="font-weight: bolder; color: rgb(89, 89, 89); float: left">
            原因:
          </a>
          {{ tableList.reason }}
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" style="width: 100%">
          <a style="font-weight: bolder; color: rgb(89, 89, 89)">
            工艺影响(危害):
          </a>
          {{ tableList.craftInfluence }}
        </td>
      </tr>
      <tr>
        <td
          align="left"
          colspan="2"
          style="width: 100%"
          v-if="this.$route.path == '/chainReleaseApplication'"
        >
          <a style="font-weight: bolder; color: rgb(89, 89, 89)">
            工艺管理措施:
          </a>
          {{ tableList.processManageStep }}
        </td>
        <td
          align="left"
          colspan="2"
          style="width: 100%"
          v-if="this.$route.path == '/interlockRecoveryApplication'"
        >
          <a style="font-weight: bolder; color: rgb(89, 89, 89)">
            恢复安全措施:
          </a>
          {{ tableList.processManageStep }}
        </td>
      </tr>
      <tr>
        <td align="left" colspan="2" style="width: 100%">
          <a style="font-weight: bolder; color: rgb(89, 89, 89)">备注: </a>
          {{ tableList.remark }}
        </td>
      </tr>
    </table>
    <table class="table_form" width="100%" border="2" style="border-top: none">
      <tr>
        <td align="center" colspan="2" style="width: 20%; font-weight: bolder">
          申请人
        </td>
        <td align="left" colspan="2" style="width: 80%">
          <p
            style="font-weight: bolder"
            v-if="this.$route.path == '/chainReleaseApplication'"
          >
            根据运行需要，本人申请对该联锁进行屏蔽。
          </p>
          <p
            style="font-weight: bolder"
            v-if="this.$route.path == '/interlockRecoveryApplication'"
          >
            根据运行需要，本人申请对该联锁进行恢复。
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">DCS主操：</a>
            <!-- 第一步审批人 -->
            {{
              dataSourceApproval.length > this.step1
                ? dataSourceApproval[this.step1]?.executorName
                : ""
            }}
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">时间:</a>
            {{
              dataSourceApproval.length > this.step1
                ? dataSourceApproval[this.step1]?.executeTime
                : ""
            }}
          </p>
        </td>
      </tr>
    </table>
    <table class="table_form" width="100%" border="2" style="border-top: none">
      <tr>
        <td align="center" colspan="2" style="width: 20%; font-weight: bolder">
          审核批准人
        </td>
        <td align="left" colspan="2" style="width: 40%">
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">
              运行总监：
            </a>
            <!-- 第二步审批 -->
            {{
              dataSourceApproval.length > this.step2
                ? dataSourceApproval[this.step2]?.executorName
                : ""
            }}
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">
              工艺管理岗:
            </a>
            <!-- 第三步审批 -->
            {{
              dataSourceApproval.length > this.step3
                ? dataSourceApproval[this.step3]?.executorName
                : ""
            }}
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">时间:</a>
            {{
              dataSourceApproval.length > this.step2
                ? dataSourceApproval[this.step2]?.executeTime
                : ""
            }}<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{
              dataSourceApproval.length > this.step3
                ? dataSourceApproval[this.step3]?.executeTime
                : ""
            }}
          </p>
        </td>
        <td align="left" colspan="2" style="width: 40%">
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">
              生产运行中心:
            </a>
            <!-- 第四步审批 -->
            {{
              dataSourceApproval.length > this.step4
                ? dataSourceApproval[this.step4]?.executorName
                : ""
            }}
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">
              检维修中心:
            </a>
            {{
              dataSourceApproval.length > this.step5
                ? dataSourceApproval[this.step5]?.executorName
                : ""
            }}
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">时间:</a>
            {{
              dataSourceApproval.length > this.step4
                ? dataSourceApproval[this.step4]?.executeTime
                : ""
            }}<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{
              dataSourceApproval.length > this.step5
                ? dataSourceApproval[this.step5]?.executeTime
                : ""
            }}
          </p>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="2" style="width: 20%; font-weight: bolder">
          执行情况
        </td>
        <td align="left" colspan="2" style="width: 40%">
          <p
            style="font-weight: bolder"
            v-if="this.$route.path == '/chainReleaseApplication'"
          >
            按程序已对该联锁进行屏蔽
          </p>
          <p
            style="font-weight: bolder"
            v-if="this.$route.path == '/interlockRecoveryApplication'"
          >
            按程序已对该联锁进行恢复
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">执行人:</a>
            {{ tableList.executorName }}
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">时间:</a>
            {{ tableList.confirmTime }}
          </p>
        </td>
        <td align="left" colspan="2" style="width: 40%">
          <p
            style="font-weight: bolder"
            v-if="this.$route.path == '/chainReleaseApplication'"
          >
            确认该联锁已经屏蔽
          </p>
          <p
            style="font-weight: bolder"
            v-if="this.$route.path == '/interlockRecoveryApplication'"
          >
            确认该联锁已经恢复
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">确认人:</a>
            {{ tableList.confirmName }}
          </p>
          <p style="font-display: flex; justify-content: space-between">
            <a style="font-weight: bolder; color: rgb(89, 89, 89)">时间:</a>
            {{ tableList.confirmCreateTime }}
          </p>
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
  props: ["tableList"],
  data() {
    return {
      dataSourceApproval: [],
      step: "",
      step1: "",
      step2: "",
      step3: "",
      step4: "",
      step5: "",
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
        if (this.tableList.recordStatus != 1) {
          if (this.tableList.recordStatus != 2) {
            this.step = res.body.stepProgress;
            if (this.step == 7) {
              this.step1 = this.step - 3;
            } else {
              if (index < this.step) {
                if (data == 3) {
                  this.step1 = this.step - 1;
                }
              } else {
                this.step1 = this.step - 2;
              }
            }
          }
        }
        this.step2 = this.step1 - 1;
        this.step3 = this.step1 - 2;
        this.step4 = this.step1 - 3;
        this.step5 = this.step1 - 4;
      });
    },
    //审批历史列表
    getDataSourceApproval(id) {
      historyList({ businessId: this.tableList.id }).then((res) => {
        if (this.tableList.recordStatus != 1) {
          if (this.tableList.recordStatus != 2) {
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
    //审批历史列表
    // getDataSourceApproval(id) {
    //   historyList({ businessId: this.tableList.numbers }).then((res) => {
    //     this.dataSourceApproval = res.body.data || [];
    //     this.dataSourceApproval.forEach((item, index) => {
    //       item.id = index;
    //     });
    //   });
    // },
  },
};
</script>
<style lang="less" scoped>
.information {
  display: flex;
  justify-content: flex-start;
}
</style>
