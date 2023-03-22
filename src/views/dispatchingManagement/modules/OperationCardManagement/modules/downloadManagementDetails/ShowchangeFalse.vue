<template>
  <div id="components-layout-demo-basic">
    <a-divider
      v-if="formType != 'look'"
      orientation="left"
      style="font-weight: bolder"
    >
      操作卡选择
    </a-divider>
    <a-layout class="layout-height" v-if="formType != 'look'">
      <a-layout-sider class="tree_layout_sider">
        <div
          style="
            width: 100%;
            border: 1px solid black;
            height: 3rem;
            text-align: center;
            color: black;
            border-radius: 5px;
          "
        >
          <span style="position: relative; top: -2.2rem">工艺单元</span>
        </div>
        <template v-if="gData.length > 0">
          <a-tree
            @select="onSelect"
            :replace-fields="{
              title: 'dictname',
              key: 'dictcode',
            }"
            class="draggable-tree"
            draggable
            :default-selected-keys="[gData[0].dictcode]"
            :tree-data="gData"
          />
        </template>
      </a-layout-sider>

      <a-layout-content style="margin-top: -1.3rem">
        <a-tabs type="card" @change="callback">
          <a-tab-pane v-for="(item, index) in tabPane" :key="index" :tab="item">
            <TabTable
              :dataSource="dataSource"
              :RowKeys="RowKeys"
              @cardDetail="cardDetail"
            />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>

    <a-divider
      orientation="left"
      style="font-weight: bolder; margin-top: -1.5rem"
    >
      选中操作卡明细
    </a-divider>
    <div style="float: right; margin-top: -1rem; margin-bottom: 0.5rem">
      <span style="font-weight: bold" v-if="formType != 'look'"
        >本次操作：共选中 {{ dataSourceList.length }} 张操作卡</span
      >
      <a-button type="primary" @click="Download"> 一键下载 </a-button>
    </div>
    <dc-table
      :scroll="{ x: 100 }"
      :columns="columns"
      :dataSource="dataSourceList"
      style="margin-top: -0.3rem"
    >
      <template slot="operation" slot-scope="row" v-if="formType != 'look'">
        <pe-button
          :include="[
            {
              value: 'Delete',
              type: 'link',
              clickName: 'deleteListClick',
              icon: '',
              style: ['btn_link'],
            },
          ]"
          @deleteListClick="deleteListClick(row)"
        ></pe-button>
      </template>
    </dc-table>
  </div>
</template>
<script>
import {
  getdict,
  DownloadprovideNo,
  downloadFileZip,
  operationCardDownloadselectById,
} from "@/api/dispatchingManagement/versionManagement";
import TabTable from "./ShowchangeFalseTabs.vue";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
    width: 50,
  },
  { title: "操作卡名称", dataIndex: "operationCardName" },
  { title: "操作类型", dataIndex: "reservedFieldOne" },
  { title: "工艺单元", dataIndex: "owningSystem" },
  { title: "设备位号", dataIndex: "deviceNo" },
  { title: "设备名称", dataIndex: "deviceName" },
  {
    fixed: "right",
    title: "操作",
    width: 80,
    scopedSlots: { customRender: "operation" },
  },
];

const tabPane = ["启动", "停止", "隔离/恢复", "其他"];

export default {
  components: { TabTable },
  data() {
    return {
      gData: [],
      tabPane: tabPane,
      searchInfo: {
        operationCardType: "启动",
        owningSystem: "",
      },
      RowKeys: "",
      columns: columns,
      dataSource: [],
      dataSourceRow: [],
      dataSourceList: [],
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
  watch: {
    dataSourceList(val) {
      this.$emit("dataSourceList", val);
    },
    dataSourceRow(val) {
      this.dataSourceList = val.filter((item, index, arr) => {
        return val.indexOf(item) === index;
      });
      console.log("this.dataSourceList", this.dataSourceList);
    },
  },
  mounted() {
    this.getListTree();
  },
  methods: {
    // 一键下载
    Download() {
      let id = [];
      console.log("this.dataSourceList", this.dataSourceList);
      this.dataSourceList.forEach((element) => {
        id.push(element.operationCardNo);
      });
      let ids = id.join(",");
      downloadFileZip(ids).then((res) => {
        if (res != undefined) {
          window.open(
            `${Glod.DEVE_LOPMENT_ENVIRONMENT}/fileinfo/downloadFileZip?relatedIds=${ids}`
          );
        }
      });
    },
    // 选中操作卡明细数据
    cardDetail(recode) {
      // let data = [];
      recode.forEach((element) => {
        this.dataSourceRow.push(
          this.dataSource.find((item) => item.operationCardNo == element)
        );
      });
    },
    // tab
    callback(e) {
      this.searchInfo.operationCardType =
        e == 0 ? "启动" : e == 1 ? "停止" : e == 2 ? "隔离/恢复" : "其他";
      this.getList();
    },
    //批量删除确认方法
    deleteListClick(row) {
      this.dataSourceList = this.dataSourceList.filter(
        (item) => item.operationCardNo != row.operationCardNo
      );
      this.RowKeys = row.operationCardNo;
    },
    //获取表格列表
    getList() {
      console.log(this.searchInfo);
      DownloadprovideNo(this.searchInfo).then((res) => {
        console.log(111, res.body);
        this.dataSource = res.body.list;
      });
    },
    // tree
    onSelect(value) {
      this.searchInfo.owningSystem = value[0];
      this.getList();
    },
    // 左侧目录树
    getListTree() {
      getdict().then((res) => {
        this.gData = res.body.data;
        this.searchInfo.owningSystem = res.body.data[0].dictcode;
        this.getList();
      });
      if (this.recode) {
        operationCardDownloadselectById(this.recode.id).then((res) => {
          this.dataSourceList = res.body.list;
          console.log("res", res.body.list);
        });
      }
    },
  },
};
</script>
<style scoped lang="less">
</style>
