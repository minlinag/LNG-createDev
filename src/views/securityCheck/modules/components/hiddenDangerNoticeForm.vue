<template>
  <div class="wrapper">
    <div class="form">
      <div id="printContent">
        <div class="header" style="text-align: center">
          <h3>隐患整改通知单</h3>
        </div>
        <div class="information">
          <p style="width: 33%; display: inline-block; text-align: left">
            检查时间:{{ tableList[0].inspectionTimeStart }}
          </p>
          <p style="width: 33%; display: inline-block; text-align: center">
            被检单位:{{ inspectedUnitName }}
          </p>
          <p style="width: 33%; display: inline-block; text-align: right">
            编号:{{ hiddenDangerCode }}
          </p>
        </div>
        <table class="table_form" width="100%" border="2">
          <tr>
            <td align="center" colspan="2" style="width: 25%"></td>
            <td align="center" colspan="2" style="width: 25%">隐患描述</td>
            <td align="center" colspan="2" style="width: 25%">整改要求</td>
            <td align="center" colspan="2" style="width: 25%">整改时限</td>
          </tr>
          <tr v-for="(item, index) in tableList">
            <td align="center" colspan="2" style="width: 25%">
              {{ index + 1 }}
            </td>
            <td align="center" colspan="2" style="width: 25%">
              {{ item.hazardDescription }}
            </td>
            <td align="center" colspan="2" style="width: 25%">
              {{ item.rectificationRequirements }}
            </td>
            <td align="center" colspan="2" style="width: 25%">
              {{ item.rectificationTimeLimit }}
            </td>
          </tr>
        </table>
        <table class="signature" width="100%" border="2">
          <tr>
            <td align="left" colspan="2" style="width: 25%; text-align: center">
              <span>检查人</span>
            </td>
            <td align="left" colspan="2" style="width: 25%; text-align: center">
              <img
                v-if="picture"
                :src="'data:image/gif;base64,' + picture"
                alt=""
                style="width: 48%; height: 102%"
              />
            </td>
            <td align="left" colspan="2" style="width: 25%; text-align: center">
              <span>被检单位整改负责人</span>
            </td>
            <td align="left" colspan="2" style="width: 25%; text-align: center">
              <img
                v-if="picture2"
                :src="'data:image/gif;base64,' + picture2"
                alt=""
                style="width: 48%; height: 102%"
              />
            </td>
          </tr>
        </table>
      </div>
      <div class="ant-modal-footer">
        <!-- <a-button
          v-if="changeValue == 'editClickYh' || changeValue == 'recteClickYh'"
          type="primary"
          @click="save"
          :disabled="saveDisabled"
        >
          保存
        </a-button> -->
        <a-button
          type="primary"
          @click="sign"
          v-if="
            (changeValue == 'editClickYh' || changeValue == 'recteClickYh') &&
            (this.picture2 ? false : true)
          "
          :disabled="signDisabled"
        >
          确认
        </a-button>
        <a-button
          type="primary"
          v-print="'#printContent'"
        >
          <!-- v-if="changeValue == 'viewClickYh' || this.picture2 ? true : false" -->
          打印
        </a-button>
        <!-- <a-button @click="cancel" v-if="changeValue == 'viewClickYh'">
          取消
        </a-button> -->
        <a-button v-Add @click="cancel"> 返回 </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { signature, saveSginPost } from "@/api/securityCheck";
export default {
  props: [
    "tableList",
    "tableId",
    "tableSign",
    "tableSign2",
    "changeValue",
    "inspectedUnitOptions",
    "hiddenDangerCode",
  ],
  data() {
    return {
      signForm: {
        // idNumber:this.$store.state.user.idNumber
        idNumber: "130928198811221714",
      },
      picture: this.tableSign,
      picture2: this.tableSign2,
      inspectedUnitName: "",
      saveDisabled: false,
      signDisabled: false,
    };
  },
  // watch: {
  //   changeValue: {
  //     handler(newVal, oldVal) {
  //       debugger
  //       console.log(newVal,'999uryyey8');
  //     },
  //     immediate: true,
  //     deep: true,
  //   },
  // },
  // computed: {
  //   hiddenDangerCode() {
  //     return "yhtz" + new Date().getTime();
  //   },
  // },
  mounted() {},
  created() {
    this.tableSign;
    this.tableSign2;
    this.tableId;
    this.inspectedUnitName = this.inspectedUnitOptions.filter((item) => {
      if (this.tableList[0].inspectedUnit == item.value) {
        return item;
      }
    })[0].label;
    if (this.$route.path == "/securityCheck") {
      if (this.tableSign) {
        this.saveDisabled = true;
        this.signDisabled = true;
      }
    } else if (this.$route.path == "/safetyInspectionRectification") {
      if (this.tableSign2) {
        this.saveDisabled = true;
        this.signDisabled = true;
      }
    } else if (this.$route.path == "/safetyInspectionAccount") {
      this.saveDisabled = true;
      this.signDisabled = true;
    }
  },
  methods: {
    cancel(e) {
      this.$emit("cancel");
    },
    sign() {
      if (this.$route.path == "/securityCheck") {
        signature(this.signForm).then((res) => {
          this.picture = res.body.image;
          this.signDisabled = true;
          // 合为一步
          this.$emit("changePicture", this.picture);
          this.saveDisabled = true;
          this.$message.success("签章成功");
          this.cancel();
        });
      } else if (this.$route.path == "/safetyInspectionRectification") {
        signature(this.signForm).then((res) => {
          this.picture2 = res.body.image;
          this.signDisabled = true;
          // 合为一步
          saveSginPost({
            id: this.tableId,
            rectificationUserB: this.picture2,
          }).then((res) => {
            if (res.code == "200") {
              this.$message.success("签章成功");
              this.$emit("flag", false);
              this.$emit("recordStatus", 3);
              this.saveDisabled = true;
              this.$emit("changePicture2", this.picture2);
              this.cancel();
            } else {
              this.$message.warning("签章失败");
            }
          });
        });
      }
    },
    // save() {
    //   if (this.$route.path == "/securityCheck") {
    //     if (this.picture) {
    //       this.$emit("changePicture", this.picture);
    //       this.cancel();
    //       this.saveDisabled = true;
    //     } else {
    //       this.$message.warning("请先签章");
    //     }
    //   } else if (this.$route.path == "/safetyInspectionRectification") {
    //     if (this.picture2) {
    //       saveSginPost({
    //         id: this.tableId,
    //         rectificationUserB: this.picture2,
    //       }).then((res) => {
    //         if (res.code == "200") {
    //           this.$message.success("修改成功");
    //           this.$emit("flag", false);
    //           this.cancel();
    //           this.$emit("recordStatus", 3);
    //           this.saveDisabled = true;
    //           // this.$emit("Status",3)
    //         }
    //       });
    //     } else {
    //       this.$message.warning("请先签章");
    //     }
    //   }
    // },
    // 保存按钮
  },
};
</script>
<style lang="less" scoped>
@media print {
  .Title {
    padding-left: 16px;
    position: relative;
    font-size: 20px;
  }
  .Title::before {
    content: "";
    position: absolute;
    display: inline-block;
    width: 6px;
    height: 20px;
    background: #0099ff;
    top: 3px;
    left: 0;
    border-radius: 5px;
  }
}

.wrapper {
  text-align: center;
  background: #fff;
  height: calc(100vh - 84px);
  .header {
    h3 {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }
  }
  .form {
    width: 900px;
    display: inline-block;
    .information {
      width: 800px;
      display: flex;
      justify-content: space-between;
      margin-left: 50px;
      p {
        width: 33%;
        display: inline-block;
      }
    }
    .table_form {
      tr {
        td {
          width: 25%;
        }
      }
    }
    .signature {
      border-top: none;
      td {
        width: 25%;
        span {
          margin-left: 20px;
          text-align: center;
        }
      }
    }
    .btn {
      margin-top: 20px;
    }
  }
}
</style>
