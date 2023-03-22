<template>
  <div class="wrapper">
    <table class="table_form" width="100%" border="2">
      <tr>
        <th colspan="2">
          北京燃气集团（天津）液化天然气有限公司
          <br />
          日计量交接凭证
        </th>
      </tr>
      <tr>
        <td align="center">时间</td>
        <td align="left">
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            @change="onChange"
            @ok="onOk"
          >
            {{ tradeFormData }}
          </a-range-picker>
        </td>
      </tr>
      <tr>
        <td align="center">气量（Nm³）</td>
        <td align="left">
          <a-input
            oninput="value=value.replace(/\D/g,'')"
            v-model="value"
            placeholder="Basic usage"
          />
        </td>
      </tr>
      <tr>
        <td align="center">气量（t）</td>
        <td align="left">
          <a-input
            oninput="value=value.replace(/\D/g,'')"
            v-model="value2"
            placeholder="Basic usage"
          />
        </td>
      </tr>
      <tr>
        <td align="center">压力（pa）</td>
        <td align="left">
          <a-input
            oninput="value=value.replace(/\D/g,'')"
            v-model="value3"
            placeholder="Basic usage"
          />
        </td>
      </tr>
      <tr class="tr_remark">
        <td align="center">备注</td>
        <td align="left">
          <a-textarea
            placeholder="textarea with clear icon"
            allow-clear
            @change="onChange"
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
</template>
<script>
import importConpontsData from "@/components/importConpontsData";
export default {
  components: {
    importConpontsData: importConpontsData,
  },
  data() {
    return {
      value: "",
      value2: "",
      value3: "",
    };
  },
  computed: {
    tradeFormData() {
      // 获取前一天的日期
      var time = new Date().getTime() - 24 * 60 * 60 * 1000;
      var yesterday = new Date(time);
      var month = yesterday.getMonth();
      var day = yesterday.getDate();

      yesterday = `${yesterday.getFullYear()}年-${
        month < 10 ? "0" + month : month
      }月-${day < 10 ? "0" + day : day}日08:00至`;

      // 获取当前日期
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      _this.gettime = yy + "年" + mm + "月" + dd + "日" + "08:00";
      return yesterday + _this.gettime;
    },
  },
  mounted() {},
  methods: {
    onChange(value, dateString) {
      console.log("Selected Time: ", value);
      console.log("Formatted Selected Time: ", dateString);
    },
    onOk(value) {
      console.log("onOk: ", value);
    },
  },
};
</script>
<style scoped lang="less">
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
</style>
