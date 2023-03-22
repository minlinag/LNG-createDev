<template>
  <div>
    <a-divider orientation="left" style="font-weight: bolder">
      {{ reservedFieldOne }}
    </a-divider>
    <div style="float: right; margin-top: -1rem; margin-bottom: 0.5rem">
      <span style="font-weight: bold"
        >本次操作：共选中 {{ selectedRowKeys.length }} 张操作卡</span
      >
      <a-button type="primary" @click="Download"> 一键下载 </a-button>
    </div>

    <a-checkbox-group
      @change="onSelectChange"
      v-model="selectedRowKeys"
      :disabled="formType == 'look'"
      class="spin-content"
    >
      <table
        border="1"
        style="table-layout: fixed; word-break: break-all"
        class="table_list"
        width="100%"
        cellspacing="0"
      >
        <tr>
          <td v-for="(item, index) in columns">{{ item.title }}</td>
        </tr>
        <tr v-for="(item, index) in dataSource.StorageSystem">
          <td :rowspan="dataSource.StorageSystem.length" v-if="index == 0">
            {{ item.owningSystem }}
          </td>
          <td>{{ item.storageTankNo }}</td>
          <td>{{ item.circulation }}</td>
          <td>{{ item.deviceName }}</td>
          <td>{{ item.deviceNo }}</td>
          <td>{{ item.runningStatus }}</td>
          <td>{{ item.cumulativeRunningTime }}</td>
          <td>{{ item.lastScheduledMaintenanceTime }}</td>
          <td>{{ item.yesOrNo }}</td>
          <td>
            <a-checkbox :value="item.id">
              {{ item.violationGrade }}
            </a-checkbox>
          </td>
        </tr>
        <tr v-for="(item, index) in dataSource.LngSystem">
          <td
            :rowspan="dataSource.LngSystem.length"
            colspan="3"
            v-if="index == 0"
          >
            {{ item.owningSystem }}
          </td>
          <td>{{ item.deviceName }}</td>
          <td>{{ item.deviceNo }}</td>
          <td>{{ item.runningStatus }}</td>
          <td>{{ item.cumulativeRunningTime }}</td>
          <td>{{ item.lastScheduledMaintenanceTime }}</td>
          <td>{{ item.yesOrNo }}</td>
          <td>
            <a-checkbox :value="item.id">
              {{ item.violationGrade }}
            </a-checkbox>
          </td>
        </tr>
        <tr v-for="(item, index) in dataSource.GasificationSystem">
          <td :rowspan="dataSource.GasificationSystem.length" v-if="index == 0">
            {{ item.owningSystem }}
          </td>
          <td
            colspan="2"
            :rowspan="
              item.storageTankNo == '海水泵'
                ? dataSource.SeawaterPumlength
                : item.storageTankNo == '开架式气化器'
                ? dataSource.OpenframeGasifier
                : dataSource.SubmergedCombustion
            "
            v-if="
              index == 0 ||
              index == dataSource.SeawaterPumlength ||
              index ==
                dataSource.SeawaterPumlength + dataSource.OpenframeGasifier
            "
          >
            {{ item.storageTankNo }}
          </td>
          <td>{{ item.deviceName }}</td>
          <td>{{ item.deviceNo }}</td>
          <td>{{ item.runningStatus }}</td>
          <td>{{ item.cumulativeRunningTime }}</td>
          <td>{{ item.lastScheduledMaintenanceTime }}</td>
          <td>{{ item.yesOrNo }}</td>
          <td>
            <a-checkbox :value="item.id">
              {{ item.violationGrade }}
            </a-checkbox>
          </td>
        </tr>
      </table>
    </a-checkbox-group>
  </div>
</template>
<script>
import {
  DownloadprovideYes,
  downloadFileZip,
} from "@/api/dispatchingManagement/versionManagement";
const columns = [
  { title: "工艺单元" },
  { title: "储罐编号" },
  { title: "当前液位(m)" },
  { title: "设备名称" },
  { title: "位号" },
  { title: "运行状态" },
  { title: "启停计划" },
  { title: "累计运行时长" },
  { title: "最近一次检修时间" },
  { title: "操作" },
];
export default {
  data() {
    return {
      //勾选框/选择框组件
      selectedRowKeys: [],
      dataSourceList: [],
      searchInfo: {},
      columns: columns,
      // 存储系统 根据
      dataSource: {},
      reservedFieldOne: "",
    };
  },
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formType: String,
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 一键下载
    Download() {
      let id = this.selectedRowKeys.join(",");
      downloadFileZip(id).then((res) => {
        if (res != undefined) {
          window.open(
            `${Glod.DEVE_LOPMENT_ENVIRONMENT}/fileinfo/downloadFileZip?relatedIds=${id}`
          );
        }
      });
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
      let list = [];
      key.forEach((element) => {
        this.dataSource.StorageSystem.filter((item) => {
          if (item.id == element) {
            list.push(item);
          }
        });
        this.dataSource.LngSystem.filter((item) => {
          if (item.id == element) {
            list.push(item);
          }
        });
        this.dataSource.GasificationSystem.filter((item) => {
          if (item.id == element) {
            list.push(item);
          }
        });
      });

      this.$emit("dataSourceList", list);
    },
    //获取表格列表
    getList() {
      DownloadprovideYes().then((res) => {
        let list = {};
        let data = res.body;
        this.$emit("SchedulingInfo", data);
        this.reservedFieldOne = data.reservedFieldOne;
        list["StorageSystem"] = data.list1;
        list["LngSystem"] = data.list2;
        list["GasificationSystem"] = data.list3;
        let SeawaterPum = data.list3;
        let SeawaterPumrow = [];
        let OpenframeGasifierrow = [];
        let SubmergedCombustionrow = [];
        SeawaterPum.forEach((element) => {
          if (element.storageTankNo == "海水泵") {
            SeawaterPumrow.push(element);
          } else if (element.storageTankNo == "开架式气化器") {
            OpenframeGasifierrow.push(element);
          } else {
            SubmergedCombustionrow.push(element);
          }
        });
        list["SeawaterPumlength"] = SeawaterPumrow.length;
        list["OpenframeGasifier"] = OpenframeGasifierrow.length;
        list["SubmergedCombustion"] = SubmergedCombustionrow.length;

        console.log("data", list);
        this.dataSource = list;
      });
    },
  },
};
</script>
<style scoped lang="less">
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout{
  margin-bottom: 0px;
}

.equipmentDisplay {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ant-form {
  display: flex;
  justify-content: left;
}

.equipmentSelection {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-left: -17px;
  margin-top: 10px;
}

/deep/ .equipmentDisplay-checkbox {
  margin-top: 10px;
}

.look {
  color: rgb(24, 144, 255);
  // color: white;
}

.Myserch {
  display: flex;
  justify-content: end;
}

.bar {
  width: 100%;
  height: 10px;
  margin-top: 10px;
  background-color: #ececec;
  // box-shadow: 2px 2px 5px #333;
  border-radius: 5px;
}

span {
  cursor: pointer;
  padding: 0 5px;
}

.search-content {
  /deep/ .ant-form-item {
    margin-bottom: 0;
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
  .tr {
    width: 1rem;
    background: #eeeeee;
    height: 40px;
    border: 1px solid;
    td {
      border-right: 1px solid;
    }
  }
  .td {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  tr {
    line-height: 36px;
    th {
      border-bottom: none;
      border-top: 1px solid #000;
    }
    th:nth-child(1) {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
    }
    th + th {
      border-right: 1px solid #000;
      // border-right: none;
    }
  }
}
</style>
