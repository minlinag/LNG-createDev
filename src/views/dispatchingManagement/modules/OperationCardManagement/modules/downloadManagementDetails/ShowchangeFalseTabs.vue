<template>
  <dc-table
    :scroll="{ x: 100 }"
    rowKey="operationCardNo"
    :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }"
    :columns="columns"
    :dataSource="dataSource"
    :openSelector="false"
    style="margin-top: -0.3rem"
  />
</template>
<script>
const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "设备位号", dataIndex: "deviceNo", width: "80px" },
  { title: "设备名称", dataIndex: "deviceName", width: "100px" },
  { title: "运行状态", dataIndex: "runningStatus", width: "80px" },
  { title: "操作卡名称", dataIndex: "operationCardName" },
];
export default {
  data() {
    return {
      searchInfo: {
        deviceName: "", //设备名称
        deviceCode: "", //设备位号
        temMainPlanDescription: "", //设备备注
        startTime: "",
        endTime: "",
      },
      columns: columns,
      selectedRowKeys: [],
    };
  },
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return [];
      },
    },
    RowKeys: String,
  },
  watch: {
    RowKeys(val) {
      this.selectedRowKeys = this.selectedRowKeys.filter((item) => item != val);
    },
  },
  methods: {
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
      this.$emit("cardDetail", key);
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
</style>
