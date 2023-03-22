<template>
  <Breadcrumb>
    <!-- reserve2 层级   parentid  父节点id   dictname自身节点name  dictcode 自身节点code-->
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'masterDataAdd' },
          {
            value: 'exportComponent',
            isPower: false,
            url: '/tankcarajxpz/exportAjpz?dictCode=AJXPZ',
          },
        ]"
        @masterDataAdd="masterDataAdd"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic">
        <a-layout class="layout-height">
          <a-layout-sider class="tree_layout_sider">
            <a-tree
              @select="onSelect"
              :replace-fields="{
                title: 'label',
                key: 'id',
              }"
              class="draggable-tree"
              draggable
              :tree-data="gData"
            />
          </a-layout-sider>
          <a-layout>
            <a-layout-content>
              <div class="contentLyout">
                <a-table
                  ref="singleTable"
                  v-if="TableData"
                  @change="paginationChange2"
                  rowKey="id"
                  :row-selection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                  }"
                  :pagination="pagination2"
                  :scroll="{ x: 100 }"
                  :columns="columns2"
                  :dataSource="dataSource"
                  :openSelector="true"
                  :data-source="dataZYBZ"
                  :loading="singleTableLoading"
                >
                  <template slot="sort" slot-scope="text, record, index, row">
                    <a-icon
                      style="color: #1890ff; cursor: sn-resize; fontsize: 20px"
                      type="drag"
                      class="move"
                    />
                  </template>
                  <template slot="operation" slot-scope="row">
                    <span class="edit" v-Edit @click="navigationDar(row)"
                      >编辑</span
                    >
                    <a-popconfirm
                      v-if="Treelike.level == 1"
                      placement="left"
                      title="是否删除选中内容？"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="delateMasterList(row)"
                    >
                      <span class="edit">删除</span>
                    </a-popconfirm>
                  </template>
                </a-table>

                <a-table
                  ref="singleTable"
                  v-if="TableData2"
                  @change="paginationChange"
                  rowKey="id"
                  :row-selection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                  }"
                  :pagination="pagination"
                  :scroll="{ x: 100 }"
                  :columns="columns"
                  :dataSource="dataSource"
                  :openSelector="true"
                >
                  <template slot="sort" slot-scope="text, record, index, row">
                    <a-icon
                      style="color: #1890ff; cursor: sn-resize; fontsize: 20px"
                      type="drag"
                      class="move"
                    />
                  </template>
                  <template slot="operation" slot-scope="row">
                    <span
                      class="edit"
                      @click="Enable(row)"
                      v-if="row.whetherEnable == 'N'"
                      >启用</span
                    >
                    <span
                      class="edit"
                      @click="Deactivate(row)"
                      v-if="row.whetherEnable == 'Y'"
                      >停用</span
                    >
                    <span class="edit" v-Edit @click="edit(row)">编辑</span>
                    <a-popconfirm
                      placement="left"
                      title="是否删除选中内容？"
                      ok-text="是"
                      cancel-text="否"
                      @confirm="delateMaster(row)"
                    >
                      <span class="edit">删除</span>
                    </a-popconfirm>
                  </template>
                </a-table>

                <dc-Model
                  v-model="visible"
                  :modelConfig="modelConfig"
                  :width="'950px'"
                >
                </dc-Model>
              </div>
            </a-layout-content>
          </a-layout>
        </a-layout>
      </div>
      <dc-Model
        class="from-style bigModel"
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
      >
        <a-form-model
          :model="Treelike2"
          ref="securityCheckFormRef"
          :rules="securityCheckFormRules"
        >
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="检查项目：" prop="dictname">
                <a-input
                  v-model="Treelike2.dictname"
                  placeholder="请输入检查项目"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="描述信息：">
                <a-textarea
                  v-model="Treelike2.descinfo"
                  placeholder="请输入描述信息"
                ></a-textarea> </a-form-model-item
            ></a-col> </a-row
          ><template>
            <div class="ant-modal-footer">
              <a-button type="primary" @click="saveList"> 保存 </a-button>
              <a-button class="buttonType" @click="handleCancel">
                取消
              </a-button>
            </div>
          </template>
        </a-form-model></dc-Model
      >
      <dc-Model
        v-model="visibleAddNew2"
        :modelConfig="addNewModelConfig2"
        @input="Handclose"
        class="from-style bigModel"
      >
        <a-form-model
          :model="toExamine"
          ref="securityCheckFormRef"
          :rules="securityCheckFormRules2"
          class="appMainForm"
          style="position: relative"
        >
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="安检类型：" prop="dictname">
                <a-input
                  disabled
                  v-model="name1"
                  placeholder="请输入安检类型"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="检查项目：" prop="dictcode">
                <a-input
                  disabled
                  v-model="name2"
                  placeholder="请输入检查项目"
                ></a-input> </a-form-model-item
            ></a-col>

            <a-col :span="8">
              <a-form-model-item label="是否启用：">
                <a-select
                  v-model="toExamine.whetherEnable"
                  show-search
                  placeholder="请选择是否启用"
                  option-filter-prop="children"
                  :getPopupContainer="getPopupContainer"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in whether"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="是否需要输入安检项的值：">
                <a-select
                  v-model="toExamine.whetherInputValue"
                  show-search
                  placeholder="请选择是否需要输入安检项的值"
                  option-filter-prop="children"
                  @change="securityCheck"
                  :getPopupContainer="getPopupContainer"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in whether"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="12" v-if="Enter">
              <a-form-model-item label="安检项的值：">
                <a-input
                  v-model="toExamine.securityCheckTitle"
                  placeholder="请输入"
                ></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :span="24">
              <a-form-model-item label="检查要求：" prop="checkRequirements">
                <a-textarea
                  v-model="toExamine.checkRequirements"
                  placeholder="请输入检查要求"
                ></a-textarea> </a-form-model-item
            ></a-col>

            <a-col :span="24">
              <a-form-model-item label="描述信息：">
                <a-textarea
                  v-model="toExamine.describeInformation"
                  placeholder="请输入描述信息"
                ></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <template>
            <!-- <a-button v-if="showCancel" @click="cancelList">取消</a-button> -->
            <div class="ant-modal-footer">
              <a-button type="primary" @click="saveList2"> 保存 </a-button>
              <a-button class="buttonType" @click="Handclose"> 取消 </a-button>
            </div>
          </template>
        </a-form-model></dc-Model
      >
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getTree,
  findAllListByNodeID,
  addDict,
  updateByID,
  add,
  enableOrShutdown,
  deleteByID,
  dictList,
  updateDict,
  sortTreeByIds,
  sortAjByIds,
  deleteDict,
} from "@/api/SecurityCheckConfiguration";
import Sortable from "sortablejs";
const dataZYBZ = [];
export default {
  data() {
    this.cacheData = dataZYBZ.map((item) => ({ ...item }));
    return {
      dataZYBZ: [],
      singleTableLoading: false,
      TableData: false,
      TableData2: false,
      Enter: false,
      name1: "",
      name2: "",
      whether: [
        {
          value: "Y",
          label: "是",
        },
        {
          value: "N",
          label: "否",
        },
      ],
      securityCheckFormRules: {
        dictname: [
          { required: true, message: "请输入检查项目", trigger: "blur" },
        ],
        // dictcode: [{ required: true, message: "请输入编码", trigger: "blur" }],
        reserve2: [
          { required: true, message: "请输入显示顺序", trigger: "blur" },
        ],
      },
      securityCheckFormRules2: {
        checkRequirements: [
          { required: true, message: "请输入检查要求", trigger: "blur" },
        ],
      },
      toExamine: {},
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: "950px",
        title: "",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      addNewModelConfig2: {
        width: "950px",
        title: "",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      visibleAddNew: false,
      visibleAddNew2: false,
      importUrl: "",
      importData: {},
      visible: false,
      modelConfig: {
        title: "新增",
        footer: "",
      },
      echoMap: {},
      selectedRowKeys: [],
      form: {},
      selectRowKey: [],
      gData: [],
      dataSource: [],
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
        },
        {
          title: "检查要求",
          ellipsis: true,
          dataIndex: "checkRequirements",
          align: "center",
        },
        {
          title: "显示顺序",
          ellipsis: true,
          scopedSlots: { customRender: "sort" },
          // dataIndex: "showOrder",
          align: "center",
        },
        {
          title: "需要输入的安检项标题",
          ellipsis: true,
          dataIndex: "securityCheckTitle",
          align: "center",
        },
        {
          title: "描述信息",
          ellipsis: true,
          dataIndex: "describeInformation",
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 150,
          fixed: "right",
        },
      ],
      columns2: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
        },
        {
          title: "检查项目",
          ellipsis: true,
          dataIndex: "dictname",
          align: "center",
        },
        {
          title: "显示顺序",
          ellipsis: true,
          scopedSlots: { customRender: "sort" },
          // dataIndex: "reserve2",
          align: "center",
        },
        {
          title: "描述信息",
          dataIndex: "descinfo",
          ellipsis: true,
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 150,
          fixed: "right",
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
      pagination2: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      Treelike: { dictname: "", dictcode: "" },
      Treelike2: {},
      toExamine: {},
      nodeID: "",
    };
  },
  watch: {
    TableData(val) {
      if (val) {
        this.$nextTick(() => {
          this.dragSort();
        });
      }
    },
    TableData2(val) {
      if (val) {
        this.$nextTick(() => {
          this.dragSort();
        });
      }
    },
  },
  mounted() {
    let Q = 1;
    let A = Q.toString();
    let W = 1;
    let S = W.toString();

    console.log(A + S + 1);
    this.getListTree();
  },
  methods: {
    handleCancel() {
      this.$refs.securityCheckFormRef.clearValidate();
      this.visibleAddNew = false;
    },
    Handclose() {
      this.$refs.securityCheckFormRef.clearValidate();
      this.visibleAddNew2 = false;
      this.Enter = false;
    },
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    securityCheck(row) {
      console.log(row);
      if (row == "Y") {
        this.Enter = true;
      } else {
        this.Enter = false;
      }
    },
    saveList() {
      this.$refs.securityCheckFormRef.validate((valid) => {
        if (valid) {
          if (this.addNewModelConfig.title == "安检项目-编辑") {
            updateDict(this.Treelike2).then((res) => {
              if (res.code == "200") {
                this.visibleAddNew = false;
                this.$message.success("修改成功!");
                this.getListTree3();
                this.getListTree();
              }
            });
          } else {
            this.Treelike2.parentid = this.form.parentId;
            this.Treelike2.reserve2 = this.Treelike.level;
            addDict(this.Treelike2).then((res) => {
              if (res.code == "200") {
                this.visibleAddNew = false;
                this.$message.success("添加成功!");
                this.getListTree3();
                this.getListTree();
              }
            });
          }
        }
      });
    },
    saveList2() {
      this.$refs.securityCheckFormRef.validate((valid) => {
        if (valid) {
          if (this.addNewModelConfig2.title == "安检项配置-编辑") {
            updateByID(this.toExamine).then((res) => {
              if (res.code == "200") {
                this.visibleAddNew2 = false;
                this.$message.success("修改成功!");
                this.getListTree2();
              }
            });
          } else {
            this.toExamine.nodeID = this.nodeID;
            add(this.toExamine).then((res) => {
              if (res.code == "200") {
                this.visibleAddNew2 = false;
                this.$message.success("新增成功!");
                this.getListTree2();
              }
            });
          }
        }
      });
    },
    //设备台账导出
    exportXlsBtn(row) {
      var dataBox = {
        featureClassificId: this.selectRowKey[0],
        searchMap: {},
        pageIndex: 1,
        pageSize: 10,
      };
      exportXls(dataBox).then((res) => {
        jsFileDownload(res.data, decodeURIComponent(res.headers["filename"]));
      });
    },
    //模板导出
    exportClick() {
      window.location.href =
        utils.baseURL +
        "/mdm/eqmMasterData/downLoadTemplate?" +
        "featureClassificId=" +
        this.selectRowKey[0];
    },
    edit(row) {
      this.visibleAddNew2 = true;
      this.addNewModelConfig2.title = "安检项配置-编辑";
      let obj2 = JSON.parse(JSON.stringify(row));
      this.toExamine = obj2;
      console.log(obj2);
      if (this.toExamine.whetherInputValue == "Y") {
        this.Enter = true;
      } else {
        this.Enter = false;
      }
    },
    navigationDar(row) {
      row.level = this.Treelike.level;
      let obj2 = JSON.parse(JSON.stringify(row));
      this.Treelike2 = obj2;
      this.visibleAddNew = true;
      this.addNewModelConfig.title = "安检项目-编辑";
    },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    save(value) {
      this.visible = false;
      value.classifyId =
        this.selectRowKey.length == 0
          ? this.gData[0].featureClassificid
          : this.selectRowKey[0];
      if (value.eqmId) {
        value.id = value.eqmId;
        characterMasterPut(value).then((res) => {
          this.getListTable(value.classifyId);
          //   this.pageList(
          //     this.selectRowKey.length == 0
          //       ? this.gData.featureClassificid
          //       : this.selectRowKey[0],
          //     1,
          //     10
          //   );
          this.echoMap = {};
        });
      } else {
        eqmMasterData(value).then((res) => {
          this.getListTable(valuepageList.classifyId);
          //   this.pageList(
          //     this.selectRowKey.length == 0
          //       ? this.gData.featureClassificid
          //       : this.selectRowKey[0],
          //     1,
          //     10
          //   );
          this.echoMap = {};
        });
      }
    },
    cancel() {
      this.visible = false;
    },
    delateMaster(row) {
      // 安检项配置
      deleteByID({ ID: row.id }).then((res) => {
        this.$message.success("删除成功");
        this.getListTree2("1");
      });
    },
    delateMasterList(row) {
      console.log(222);
      deleteDict([row.id]).then((res) => {
        this.$message.success("删除成功");
        this.getListTree3("1");
        this.getListTree();
      });
    },
    masterDataAdd() {
      console.log(this.name1);
      if (this.Treelike.level == 1) {
        this.Treelike2 = {};
        this.visibleAddNew = true;
        this.Treelike.dictname = "";
        this.Treelike.dictcode = "";
        this.Treelike2 = {};
        this.addNewModelConfig.title = "安检项目-新增";
        var _this = this;
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth() + 1;
        let dd = new Date().getDate();
        let hh = new Date().getHours();
        let mf =
          new Date().getMinutes() < 10
            ? "0" + new Date().getMinutes()
            : new Date().getMinutes();
        let ss =
          new Date().getSeconds() < 10
            ? "0" + new Date().getSeconds()
            : new Date().getSeconds();
        _this.gettime = yy + "-" + mm + "-" + dd;
        this.Treelike2.dictcode = "AJXPZ" + yy + mm + da + hh + mf + mf; //编码
      } else if (this.Treelike.level == 2) {
        this.visibleAddNew2 = true;
        this.addNewModelConfig2.title = "安检项配置-新增";
        this.toExamine = {};
        this.toExamine.whetherEnable = "Y";
        this.toExamine.whetherInputValue = "N";
      } else {
        this.$message.warning("请先选择左侧安检项配置页节点");
      }
    },
    onSelect(value) {
      console.log(value[0]);
      if (value.length > 0) {
        for (let i = 0; i < this.gData.length; i++) {
          if (this.gData[i].id == value[0]) {
            this.FungDataLable = this.gData[i].label;
            this.Treelike.level = this.gData[i].level;
            this.Treelike.parentid = this.gData[i].id;
          } else {
            this.FungData(value[0], this.gData);
          }
        }
        if (this.Treelike.level == 1 || this.Treelike.level == 0) {
          // 导航栏查询
          this.TableData = true;
          this.TableData2 = false;
          this.form.pageIndex = 1;
          this.form.pageSize = 10;
          this.form.parentId = value[0];
          dictList(this.form).then((res) => {
            this.pagination.current = res.body.pageIndex;
            this.pagination.pageSize = res.body.pageSize;
            this.dataSource = res.body.data;
            this.pagination.total = res.body.total;
          });
        }
        if (this.Treelike.level == 2) {
          this.TableData = false;
          this.TableData2 = true;
          this.form.pageIndex = 1;
          this.form.pageSize = 10;
          this.form.nodeID = value[0];
          findAllListByNodeID(this.form).then((res) => {
            this.pagination.current = res.body.pageIndex;
            this.pagination.pageSize = res.body.pageSize;
            this.dataSource = res.body.data;
            this.pagination.total = res.body.total;
          });
        }
      }
    },
    FungData(event, data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].code == event) {
          console.log(data[i].level);
          this.name1 = data[i].pname;
          this.name2 = data[i].label;
          this.nodeID = data[i].code;
          this.FungDataLable = data[i].label;
          this.Treelike.level = data[i].level;
          this.Treelike.parentid = data[i].id;
        } else {
          if (data[i].children) {
            this.FungData(event, data[i].children);
          }
        }
      }
    },
    paginationChange(pagination) {
      this.form = {};
      this.form.nodeID = this.Treelike.parentid;
      this.form.pageIndex = pagination.current;
      this.form.pageSize = pagination.pageSize;
      findAllListByNodeID(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    paginationChange2(pagination) {
      this.form = {};
      this.form.parentId = this.Treelike.parentid;
      this.form.pageIndex = pagination.current;
      this.form.pageSize = pagination.pageSize;
      dictList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    search() {
      let _obj = {};
      for (let i of this.form) {
        _obj[i.characterCode] = i.value;
      }
      //   this.pageList(
      //     this.selectRowKey.length == 0
      //       ? this.gData[0].featureClassificid
      //       : this.selectRowKey[0],
      //     1,
      //     10,
      //     _obj
      //   );
    },
    //重置输入
    resetForm() {
      // this.form = {};
      this.form.forEach((item) => {
        item.value = "";
      });
    },
    // 表格头or身体
    getListTable(id) {},
    // 左侧目录树
    getListTree() {
      getTree().then((res) => {
        this.gData = res.body.data;
      });
    },

    getListTree2(row) {
      findAllListByNodeID(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        if (row == "1") {
          let list = [];
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].showOrder > 10) {
              this.dataSource[i].showOrder = i + 1;
            } else {
              let A = i + 1;
              if (A == 10) {
                this.dataSource[i].showOrder = A;
              } else {
                this.dataSource[i].showOrder = "0" + A;
              }
            }
            list.push({
              showOrder: this.dataSource[i].showOrder,
              id: this.dataSource[i].id,
            });
          }
          sortAjByIds(list).then((res) => {});
        }

        this.pagination.total = res.body.total;
      });
    },

    getListTree3(row) {
      dictList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        if (row == "1") {
          let list = [];
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].reserve2 > 10) {
              this.dataSource[i].reserve2 = i + 1;
            } else {
              let A = i + 1;
              if (A == 10) {
                this.dataSource[i].reserve2 = A;
              } else {
                this.dataSource[i].reserve2 = "0" + A;
              }
            }
            list.push({
              reserve2: this.dataSource[i].reserve2,
              dictid: this.dataSource[i].dictid,
            });
          }
          sortAjByIds(list).then((res) => {});
        }
        this.pagination.total = res.body.total;
      });
    },
    onChange(date) {},
    Enable(row) {
      enableOrShutdown({ id: row.id, whetherEnable: "Y" }).then((res) => {
        if (res.code == "200") {
          this.$message.success("启用成功!");
          this.getListTree2();
        }
      });
    },
    Deactivate(row) {
      enableOrShutdown({ id: row.id, whetherEnable: "N" }).then((res) => {
        if (res.code == "200") {
          this.$message.success("停用成功!");
          this.getListTree2();
        }
      });
    },
    /** 模块排序 */
    dragSort() {
      const el = this.$refs.singleTable.$el.querySelectorAll(
        ".ant-table-body > table > tbody"
      )[0];

      this.sortable = Sortable.create(el, {
        ghostClass: "ghost",
        handle: ".move",
        onEnd: (e) => {
          console.log(this.dataSource);
          let sortList = JSON.parse(JSON.stringify(this.dataSource));
          const targetRow = sortList.splice(e.oldIndex, 1)[0];
          console.log("AAA", targetRow);
          console.log("aaa", e.newIndex + 1);
          sortList.splice(e.newIndex, 0, targetRow);
          console.log("bbb", sortList);
          if (this.TableData == true) {
            for (let index = 0; index < sortList.length; index++) {
              if (this.form.pageIndex > 1) {
                let A = this.form.pageIndex - 1;
                let B = index + 1;
                if (B == 10) {
                  let integer = A + 1;
                  sortList[index].reserve2 = integer.toString() + 0;
                } else {
                  sortList[index].reserve2 = A.toString() + B;
                }
              } else {
                let A = index + 1;
                let B = 0;
                if (A == 10) {
                  sortList[index].reserve2 = A;
                } else {
                  sortList[index].reserve2 = B.toString() + A;
                }
              }
            }
          } else {
            for (let index = 0; index < sortList.length; index++) {
              if (this.form.pageIndex > 1) {
                let A = this.form.pageIndex - 1;
                let B = index + 1;
                if (B == 10) {
                  let integer = A + 1;
                  sortList[index].showOrder = integer.toString() + 0;
                } else {
                  sortList[index].showOrder = A.toString() + B;
                }
              } else {
                let A = index + 1;
                let B = 0;
                if (A == 10) {
                  sortList[index].showOrder = A;
                } else {
                  sortList[index].showOrder = B.toString() + A;
                }
              }
            }
          }

          this.singleTableLoading = true;
          this.dataSource = [];
          setTimeout(() => {
            this.singleTableLoading = false;
            this.dataSource = sortList;
            if (this.TableData == true) {
              this.order(this.dataSource);
            } else {
              console.log(this.dataSource);
              this.order2(this.dataSource);
            }
          }, 500);
          // this.dataZYBZ = JSON.parse(JSON.stringify(sortList))
        },
      });
    },
    order(row) {
      let list = [];
      row.forEach((element) => {
        if (element.reserve2 > 10) {
          if (element.reserve2.substring(0, 1) == 0) {
            element.reserve2 = element.reserve2.substring(1, 3);
          }
        }
        list.push({ reserve2: element.reserve2, dictid: element.dictid });
      });
      sortTreeByIds(list).then((res) => {
        this.getListTree();
      });
    },
    order2(row) {
      let list = [];
      row.forEach((element) => {
        if (element.showOrder > 10) {
          if (element.showOrder.substring(0, 1) == 0) {
            element.showOrder = element.showOrder.substring(1, 3);
          }
        }
        list.push({ showOrder: element.showOrder, id: element.id });
      });
      sortAjByIds(list).then((res) => {});
    },
  },
};
</script>
<style scoped lang="less">
.from-styles .ant-modal-content .ant-form .ant-form-item-control .ant-input,
.from-styles
  .ant-modal-content
  .ant-form
  .ant-form-item-control
  .ant-calendar-picker,
.from-styles .ant-modal-content .ant-form .ant-form-item-control .ant-select,
.from-styles
  .ant-modal-content
  .ant-form
  .ant-form-item-control
  .ant-select-selection {
  width: 95%;
}
/deep/.layout-height {
  height: 100%;
}

/deep/#components-layout-demo-basic {
  text-align: unset;
}

.contentLyout {
  margin-left: 20px;
}
</style>
<style>
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item-control {
  width: 100%;
}

.ant-select-selection--single {
  width: 180px;
}

.aaaa {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
</style>
