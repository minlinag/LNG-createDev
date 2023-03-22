<template>
  <div class="wrapper">
    <div class="form">
      <div id="printContent">
        <div class="header" style="text-align: center">
          <h3>隐患整改回复单</h3>
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
            <td align="center" colspan="2" style="width: 16%"></td>
            <td align="center" colspan="2" style="width: 16%">隐患描述</td>
            <td align="center" colspan="2" style="width: 16%">整改要求</td>
            <td align="center" colspan="2" style="width: 16%">整改时限</td>
            <td align="center" colspan="2" style="width: 16%">隐患整改措施</td>
            <td align="center" colspan="2" style="width: 16%">整改完成时间</td>
          </tr>
          <tr v-for="(item, index) in tableList">
            <td align="center" colspan="2" style="width: 16%">
              {{ index + 1 }}
            </td>
            <td align="center" colspan="2" style="width: 16%">
              {{ item.hazardDescription }}
            </td>
            <td align="center" colspan="2" style="width: 16%">
              {{ item.rectificationRequirements }}
            </td>
            <td align="center" colspan="2" style="width: 16%">
              {{ item.rectificationTimeLimit }}
            </td>
            <td align="center" colspan="2" style="width: 16%">
              {{ item.describet }}
            </td>
            <td align="center" colspan="2" style="width: 16%">
              {{ item.rectificationTime }}
            </td>
          </tr>
        </table>

        <table class="signature" width="100%" border="2">
          <td align="left" colspan="2" style="width: 50%; text-align: center">
            <span>被检单位整改负责人</span>
          </td>
          <td align="left" colspan="2" style="width: 50%; text-align: center">
            <img
              v-if="picture"
              :src="'data:image/gif;base64,' + picture"
              alt=""
              style="width: 48%; height: 102%"
            />
          </td>
        </table>
      </div>
      <div class="ant-modal-footer">
        <!-- <a-button
          v-Add
          type="primary"
          @click="save"
          v-if="changeValue == 'recteClickYh'"
          :disabled="saveDisabled"
        >
          保存
        </a-button> -->
        <a-button
          v-Add
          type="primary"
          @click="sign"
          :disabled="!this.picture ? false : true"
          v-if="
            this.$route.path == '/safetyInspectionRectification' &&
            (this.tableList[0].recordStatus=='7')&&
            (this.picture ? false : true)
          "
        >
          确认
        </a-button>
        <a-button
          type="primary"
          v-print="'#printContent'"
        >
          打印
          <!-- v-if="this.picture ? true : false" -->
        </a-button>
        <a-button v-Add @click="cancel"> 返回 </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { signature, saveSginPost } from "@/api/securityCheck";

export default {
  name: "hiddenDangerNoticeForm",
  props: [
    "tableList",
    "tableId",
    "tableResign",
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
      picture: this.tableResign,
      saveDisabled: false,
      inspectedUnitName: "",
    };
  },
  mounted() {},
  created() {
    console.log(this.tableList[0].recordStatus,21212);
    this.tableResign;
    this.tableId;
    this.tableList
    this.inspectedUnitName = this.inspectedUnitOptions.filter((item) => {
      if (this.tableList[0].inspectedUnit == item.value) {
        return item;
      }
    })[0].label;
    if (this.tableResign) {
      this.saveDisabled = true;
    }
  },
  methods: {
    cancel(e) {
      this.$emit("cancel");
    },
    sign() {
      signature(this.signForm).then((res) => {
        this.picture = res.body.image;
        // 合为一步
        saveSginPost({
          id: this.tableId,
          rectificationReplyUser: this.picture,
        }).then((res) => {
          if (res.code == "200") {
            this.$message.success("签章成功");
            this.$emit("flag", false);
            this.$emit("signatureChange");
            this.$emit("changePicture3", this.picture);
            this.saveDisabled = true;
            this.cancel();
          } else {
            this.$message.warning("签章失败");
          }
        });
      });
    },
    // save() {
    //   if (this.picture) {
    //     saveSginPost({
    //       id: this.tableId,
    //       rectificationUserB: this.picture,
    //     }).then((res) => {
    //       if (res.code == "200") {
    //         this.$message.success("修改成功");
    //         this.$emit("flag", false);
    //         this.cancel();
    //         this.$emit("signatureChange");
    //         this.saveDisabled = true;
    //       }
    //     });
    //   }
    // },
  },
};
</script>
<style lang="less" scoped>
.wrapper {
  text-align: center;
  background: #fff;
  height: calc(100vh - 84px);
  .header {
    h3 {
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
      }
    }
    .table_form {
      tr {
        td {
          width: 16%;
        }
      }
    }
    .signature {
      border-top: none;
      td {
        width: 50%;
        span {
          margin-left: 20px;
        }
      }
    }
    .btn {
      margin-top: 20px;
    }
  }
}
</style>
