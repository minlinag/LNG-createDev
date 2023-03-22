<template>
  <a-layout>
    <a-layout-content style="height: 55vh">
      <table class="table_list" width="100%" border="1">
        <tr align="center" style="background: #eeeeee; height: 40px">
          <td>考核事项</td>
          <td v-for="(item, index) in owningOption" :key="index">
            {{ item }}
          </td>
        </tr>
        <tr
          align="center"
          v-if="dataSource.length > 0"
          v-for="(item, index) in dataSource"
          :key="index"
        >
          <td>{{ item.assessType }}</td>
          <td>{{ item.oneClass }}</td>
          <td>{{ item.twoClass }}</td>
          <td>{{ item.threeClass }}</td>
          <td>{{ item.fourClass }}</td>
          <td>{{ item.fiveClass }}</td>
          <td>{{ item.tankerClass }}</td>
          <td>{{ item.testClass }}</td>
        </tr>
        <tr align="center" v-if="Extrapoints">
          <td>{{ Extrapoints.assessType }}</td>
          <td>{{ Extrapoints.oneClass }}</td>
          <td>{{ Extrapoints.twoClass }}</td>
          <td>{{ Extrapoints.threeClass }}</td>
          <td>{{ Extrapoints.fourClass }}</td>
          <td>{{ Extrapoints.fiveClass }}</td>
          <td>{{ Extrapoints.tankerClass }}</td>
          <td>{{ Extrapoints.testClass }}</td>
        </tr>
        <tr align="center" v-if="Totalscore">
          <td>本月得分</td>
          <td>{{ Totalscore.oneSum }}</td>
          <td>{{ Totalscore.twoSum }}</td>
          <td>{{ Totalscore.threeSum }}</td>
          <td>{{ Totalscore.fourSum }}</td>
          <td>{{ Totalscore.fiveSum }}</td>
          <td>{{ Totalscore.tankerSum }}</td>
          <td>{{ Totalscore.testSum }}</td>
        </tr>
        <tr align="center">
          <td>班组排名</td>
          <td>
            <template v-for="(item, index) in dataNum">
              <span :key="index">
                {{ "一组" == item.name ? item.sorts : "" }}
              </span>
            </template>
          </td>
          <td>
            <template v-for="(item, index) in dataNum">
              <span :key="index">
                {{ "二组" == item.name ? item.sorts : "" }}
              </span>
            </template>
          </td>
          <td>
            <template v-for="(item, index) in dataNum">
              <span :key="index">
                {{ "三组" == item.name ? item.sorts : "" }}
              </span>
            </template>
          </td>
          <td>
            <template v-for="(item, index) in dataNum">
              <span :key="index">
                {{ "四组" == item.name ? item.sorts : "" }}
              </span>
            </template>
          </td>
          <td>
            <template v-for="(item, index) in dataNum">
              <span :key="index">
                {{ "五组" == item.name ? item.sorts : "" }}
              </span>
            </template>
          </td>
          <td>
            <template v-for="(item, index) in dataNum">
              <span :key="index">
                {{ "槽车组" == item.name ? item.sorts : "" }}
              </span>
            </template>
          </td>
          <td>
            <template v-for="(item, index) in dataNum">
              <span :key="index">
                {{ "化验组" == item.name ? item.sorts : "" }}
              </span>
            </template>
          </td>
        </tr>
      </table>
    </a-layout-content>
    <a-layout-footer>
      <a-button @click="handleCancel"> 取消</a-button>
    </a-layout-footer>
  </a-layout>
</template>
<script>
import {
  TeamGroupExaminemonthAssessResult,
  TeamGroupExaminemonthAssessAdd,
  TeamGroupExaminemonthAssessTotal,
} from "@/api/dispatchingManagement/teamManagement.js";

export default {
  name: "versionManagementDetalis",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    TypeOption: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      owningOption: [
        "一组",
        "二组",
        "三组",
        "四组",
        "五组",
        "槽车组",
        "化验组",
      ],
      Extrapoints: {},
      Totalscore: {},
      dataSource: [],
      dataNum: [],
    };
  },
  mounted() {
    console.log("dataSource", this.dataSource);
    // 减分
    TeamGroupExaminemonthAssessResult(this.recode.month).then((res) => {
      console.log("res减分", res.body);
      this.dataSource = res.body;
    });
    // 加分
    TeamGroupExaminemonthAssessAdd(this.recode.month).then((res) => {
      console.log("res加分", res.body);
      this.Extrapoints = res.body;
    });
    // 总分
    TeamGroupExaminemonthAssessTotal(this.recode.month).then((res) => {
      console.log("res总分", res.body);
      this.Totalscore = res.body;
      let data = [
        { name: "一组", value: res.body.oneSum, dataIndex: "oneSum" },
        { name: "二组", value: res.body.twoSum, dataIndex: "twoSum" },
        { name: "三组", value: res.body.threeSum, dataIndex: "threeSum" },
        { name: "四组", value: res.body.fourSum, dataIndex: "fourSum" },
        { name: "五组", value: res.body.fiveSum, dataIndex: "fiveSum" },
        { name: "槽车组", value: res.body.tankerSum, dataIndex: "tankerSum" },
        { name: "化验组", value: res.body.testSum, dataIndex: "testSum" },
      ];
      let row = this.objArraySort(data, "value").reverse();
      console.log("row", row);

      for (let i = 0; i < row.length; i++) {
        row[i].sorts = i + 1;
      }
      this.dataNum = row;
      console.log("dataNum", this.dataNum);
    });
  },
  methods: {
    objArraySort(objArr, key) {
      let result = objArr.slice(0);
      return result.sort((a, b) => a[key] - b[key]);
    },
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less">
.rangePickerWidth .ant-form-item-control .ant-input {
  width: 495px !important;
}
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}

.table_list {
  .grey {
    background: #f3f5f8;
    /deep/.ant-input {
      background: #f3f5f8;
      border: 1px solid #f3f5f8;
    }
  }
  text-align: center;
  tr {
    line-height: 36px;
  }
}
</style>
