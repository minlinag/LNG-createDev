<template>
  <div>
    <Breadcrumb>
      <template slot="appMain">
        <div id="components-layout-demo-basic">
          <a-layout-content>
            <div class="contentLyout">
              <a-form-model :layout="'inline'" v-model="queryParams">
                <!-- <a-row :gutter="24"> -->

                <!-- <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="设备专业"
                  >
                    <a-input v-model="queryParams.value" placeholder="设备类型">
                    </a-input>
                  </a-form-model-item>
                </a-col> -->
                <!-- <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="设备项目"
                  >
                    <a-input v-model="queryParams.value" placeholder="设备名称">
                    </a-input>
                  </a-form-model-item>
                </a-col> -->
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="设备类型"
                  >
                    <template>
                      <a-tree-select
                        v-model="queryParams.classific_code"
                        style="width: 100%"
                        :dropdown-style="{
                          maxHeight: '400px',
                          overflow: 'auto',
                        }"
                        placeholder="请选择"
                        allow-clear
                      >
                        <a-tree-select-node
                          :value="item.classificCode"
                          :title="item.classificName"
                          v-for="(item, index) in treeSelect"
                          :key="index"
                        >
                          <a-tree-select-node
                            :value="items.classificCode"
                            :title="items.classificName"
                            v-for="(items, indexs) in item.children"
                            :key="index + '-' + indexs"
                          >
                            <a-tree-select-node
                              :value="itemss.classificCode"
                              :title="itemss.classificName"
                              v-for="(itemss, indexss) in items.children"
                              :key="index + '-' + indexs + '-' + indexss"
                            />
                          </a-tree-select-node>
                        </a-tree-select-node>
                      </a-tree-select>
                    </template>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="设备名称"
                  >
                    <a-input
                      v-model="queryParams.eqm_sbmc"
                      placeholder="设备名称"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="设备位号"
                  >
                    <a-input
                      v-model="queryParams.eqm_sbwh"
                      placeholder="设备位号"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-form-model-item class="item_button">
                  <a-button
                    class="buttonType"
                    type="primary"
                    @click="searchTable"
                  >
                    查询
                  </a-button>
                  <a-button class="buttonType" @click="reformTable">
                    重置
                  </a-button>
                </a-form-model-item>
              </a-form-model>

              <dc-table
                :row-selection="{
                  selectedRowKeys: selectedRowKeys,
                  onChange: onSelectChange,
                  columnWidth: '30px',
                }"
                rowKey="eqmId"
                :customRow="$tableRow"
                @change="paginationChange"
                :pagination="pagination"
                class="list_table_1"
                :scroll="{ y: 1, x: 100 }"
                :columns="columns"
                :data-source="tableList"
                :openSelector="true"
              >
                <template slot="operation" slot-scope="row">
                  <a-button
                    type="link"
                    class="btn_link"
                    style="cursor: pointer"
                    @click="deviceFile(row)"
                  >
                    设备档案
                  </a-button>
                </template>
              </dc-table>
            </div>
          </a-layout-content>
        </div>
      </template>
    </Breadcrumb>
    <!-- 父传孙 -->
    <!-- <index :deviceCode="queryParams.eqm_sbwh" v-if="seen"></index> -->
  </div>
</template>
<script>
// import index from "../modules/deviceFile/index.vue";
import {
  getTreeList, //获取树
} from "@/api/spareParts";
// import{getPageList}from "@api/oneMachineOneFile";
import {
  findOneMachineOneFileList, //获取列表
} from "@/api/oneMachineOneFile/deviceMaintenance";
export default {
  name: "oneMachineOneFileMechanical",
  // components: {
  //   index,
  // },
  data() {
    return {
      treeSelect: [],
      queryParams: {
        classific_code: "",
        eqm_sbmc: "",
        eqm_sbwh: "",
        pageNum: 1,
        pageSize: 10,
      },
      seen: false,
      tableList: [
        {
          pageNum: 1,
          pageSize: 10,
          classific_code: "",
          eqm_sbmc: "",
          eqm_sbwh: "",
          eqm_sbbm: "",
        },
      ],
      columns: [
        {
          title: "设备类型",
          dataIndex: "classific_name",
          width: 150,
        },
        {
          title: "设备名称",
          dataIndex: "eqm_sbmc",
          width: 150,
        },
        {
          title: "设备位号",
          dataIndex: "eqm_sbwh",
          width: 150,
        },
        {
          fixed: "right",
          title: "操作",
          width: 100,
          scopedSlots: { customRender: "operation" },
        },
      ],
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      selectedRowKeys: [],
    };
  },
  mounted() {
    this.getTreeList();
    this.getFindOneMachineOneFileList();
  },
  methods: {
    paginationChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.queryParams.pageNum = pagination.current;
      this.queryParams.pageSize = pagination.pageSize;
      this.getFindOneMachineOneFileList();
    },
    searchTable() {
      this.pagination.current = 1;
      this.pagination.current = 1;
      this.getFindOneMachineOneFileList();
    },
    reformTable() {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = 10;
      this.queryParams = {
        classific_code: "",
        eqm_sbmc: "",
        eqm_sbwh: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getFindOneMachineOneFileList();
    },
    deviceFile(row) {
      this.$router.push({
        path: "/oneMachineOneFileDeviceFile",
        query: row,
      });
    },

    onSelectChange() { },
    getTreeList() {
      getTreeList({ classificCode: "", classificName: "" }).then((res) => {
        console.log(res);
        this.treeSelect = res.body.data;
      });
    },
    getFindOneMachineOneFileList() {
      findOneMachineOneFileList(this.queryParams).then((res) => {
        this.tableList = res.body.data;
        this.pagination.total = res.body.total
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
