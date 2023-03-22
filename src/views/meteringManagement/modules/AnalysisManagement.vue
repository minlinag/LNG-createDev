<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', isPower: false, clickName: 'addNew' },
          { value: 'Delete', isPower: false, clickName: 'mydelete' },
        ]"
        @addNew="addNew"
        @mydelete="mydelete"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="编号"
                >
                  <a-input
                    placeholder="请输入编号"
                    v-model="form.checkoutCode"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="申请部门"
                >
                  <a-input
                    placeholder="请输入申请部门"
                    v-model="form.applyDept"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="申请人"
                >
                  <a-input
                    placeholder="请输入申请人"
                    v-model="form.applyEmp"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="检验样品"
                >
                  <a-input
                    placeholder="请输入检验样品"
                    v-model="form.analyseSample"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="分析项目"
                >
                  <a-input
                    placeholder="请输入分析项目"
                    v-model="form.analyseProject"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="申请时间:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-range-picker
                    v-model="startDate"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>

              <a-form-model-item style="float: right">
                <a-button
                  v-Query
                  class="buttonType"
                  type="primary"
                  @click="search"
                >
                  查询
                </a-button>
                <a-button class="buttonType" @click="resetForm">
                  重置
                </a-button></a-form-model-item
              >
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <a-table
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        bordered
        :pagination="pagination"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_2"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="operation" slot-scope="row">
          <div class="wrapper" style="display: flex">
            <pe-button
              :include="[
                {
                  value: 'Edit',
                  type: 'link',
                  clickName: 'edit',
                  icon: '',
                  isPower: false,
                  style: ['btn_link'],
                  disabled: $audit.editDisabled(row.recordStatus),
                },
                {
                  value: 'VERIFY',
                  type: 'link',
                  clickName: 'approval',
                  icon: '',
                  isPower: false,
                  style: ['btn_link'],
                  isPower: false,
                  disabled: $audit.auditDisabled(row.toDoUserCode),
                },
                {
                  value: 'View',
                  name: '详情',
                  type: 'link',
                  clickName: 'look',
                  icon: '',
                  style: ['btn_link'],
                  isPower: false,
                },
                {
                  value: '上传',
                  type: 'link',
                  clickName: 'uploadSC',
                  icon: '',
                  style: ['btn_link'],
                  disabled:
                    row.stepProgress != 2 ||
                    row.uploadEmp != null ||
                    row.fileInfo != null,
                },
                {
                  value: '确认',
                  type: 'link',
                  clickName: 'confirm',
                  icon: '',
                  style: ['btn_link'],
                  disabled: row.recordStatus != 4 || row.affirmEmp != null,
                },
              ]"
              @edit="edit(row)"
              @approval="approvalClick(row)"
              @look="look(row)"
              @uploadSC="uploadSC(row)"
              @confirm="confirm(row.id)"
            />
            <!-- <pe-button
              :include="[
                {
                  value: 'Edit',
                  type: 'link',
                  clickName: 'edit',
                  icon: '',
                  isPower: false,
                  style: ['btn_link'],
                  disabled: $audit.editDisabled(row.recordStatus),
                },
              ]"
              @edit="edit(row)"
            />
            <pe-button
              v-if="
                row.stepProgress
                  ? row.stepProgress == '2'
                    ? row.fileInfo
                      ? true
                      : false
                    : true
                  : true
              "
              :include="[
                {
                  value: 'VERIFY',
                  type: 'link',
                  clickName: 'approval',
                  icon: '',
                  isPower: false,
                  style: ['btn_link'],
                  isPower: false,
                  disabled: $audit.auditDisabled(row.toDoUserCode),
                },
              ]"
              @approval="approvalClick(row)"
            />

            <pe-button
              :include="[
                {
                  value: 'View',
                  name: '详情',
                  type: 'link',
                  clickName: 'look',
                  icon: '',
                  style: ['btn_link'],
                  isPower: false,
                },
              ]"
              @look="look(row)"
            />

            <pe-button
              v-if="!row.fileInfo"
              :include="[
                {
                  value: '上传',
                  type: 'link',
                  clickName: 'uploadSC',
                  icon: '',
                  style: ['btn_link'],
                  disabled: row.stepProgress != 2 || row.uploadEmp != null,
                },
              ]"
              @uploadSC="uploadSC(row)"
            />

            <pe-button
              v-if="row.recordStatus == 4 && !row.affirmEmp"
              :include="[
                {
                  value: '确认',
                  type: 'link',
                  clickName: 'confirm',
                  icon: '',
                  style: ['btn_link'],
                },
              ]"
              @confirm="confirm(row.id)"
            /> -->
          </div>
        </template>
      </a-table>

      <dc-Model
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="from-style bigModel"
        @input="handleCancel"
      >
        <div style="position: relative">
          <a-form-model
            :model="toExamine"
            ref="securityCheckFormRef"
            :rules="securityCheckFormRules"
            id="addContent"
          >
            <!--申请信息-->
            <a-divider orientation="left">申请信息</a-divider>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="编号：" prop="checkoutCode">
                  <a-input
                    disabled
                    v-model="toExamine.checkoutCode"
                    placeholder="请输入编号"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="计划分析时间："
                  prop="planAnalyseTime"
                >
                  <a-date-picker
                    :disabled="details || SC"
                    v-model="toExamine.planAnalyseTime"
                    valueFormat="YYYY-MM-DD"
                    placeholder="请选择日期"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="取样点：">
                  <a-input
                    :disabled="details || SC"
                    v-model="toExamine.samplingSpot"
                    placeholder="请输入取样点"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="检验样品：">
                  <a-input
                    :disabled="details || SC"
                    v-model="toExamine.analyseSample"
                    placeholder="请输入检验样品"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="分析项目：">
                  <a-input
                    :disabled="details || SC"
                    v-model="toExamine.analyseProject"
                    placeholder="请输入分析项目"
                  />
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item label="指标要求：">
                  <a-textarea
                    :disabled="details || SC"
                    :auto-size="{ minRows: 4, maxRows: 7 }"
                    v-model="toExamine.standardRequire"
                    placeholder="请输入指标要求"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="申请时间：">
                  <!-- <a-date-picker
                    show-time
                    disabled
                    v-model="toExamine.applyTime"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择申请日期"
                  /> -->
                  <a-input disabled v-model="toExamine.applyTime" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="申请人：" prop="applyEmp">
                  <a-input
                    disabled
                    v-model="toExamine.applyEmp"
                    placeholder="请输入申请人"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="申请部门：">
                  <a-input
                    disabled
                    v-model="toExamine.applyDept"
                    placeholder="请输入申请部门"
                  />
                  <!-- 下拉选择改为当前登录人 -->
                  <!-- <a-select
                  :disabled="details || SC"
                  v-model="toExamine.applyDept"
                  show-search
                  placeholder="请选择申请部门"
                  option-filter-prop="children"
                  :getPopupContainer="getPopupContainer"
                >
                  <a-select-option
                    v-for="(item, index) in stateInfo"
                    :key="index"
                    :value="item.dictname"
                    >{{ item.dictname }}
                  </a-select-option>
                </a-select> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--检验报告-->
            <a-divider
              orientation="left"
              v-if="SC && toExamine.uploadEmp != null"
              >检验报告</a-divider
            >
            <a-row v-if="SC && toExamine.uploadEmp != null">
              <a-col :span="8">
                <a-form-model-item style="float: left" label="检验报告附件：">
                  <file-upload
                    :Text="'上传文件'"
                    @fileChange="fileListChange"
                    :echoList="fileList"
                    ref="importConpontsDataRef"
                    :disabled="pageType == 'look' || pageType == 'approval'"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col v-if="SC && toExamine.uploadEmp != null" :span="8">
                <a-form-model-item label="上传人：">
                  <a-input
                    disabled
                    v-model="toExamine.uploadEmp"
                    placeholder="请输入上传人"
                  />
                </a-form-model-item>
              </a-col>
              <a-col v-if="SC && toExamine.uploadEmp != null" :span="8">
                <a-form-model-item label="上传时间：">
                  <a-input
                    disabled
                    v-model="toExamine.uploadTime"
                    placeholder="请输入上传时间"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                v-if="
                  SC &&
                  toExamine.affirmEmp != null &&
                  toExamine.affirmTime != null
                "
                :span="8"
              >
                <a-form-model-item label="确认人：">
                  <a-input disabled v-model="toExamine.affirmEmp" />
                </a-form-model-item>
              </a-col>
              <a-col
                v-if="
                  SC &&
                  toExamine.affirmEmp != null &&
                  toExamine.affirmTime != null
                "
                :span="8"
              >
                <a-form-model-item label="确认时间：">
                  <a-input disabled v-model="toExamine.affirmTime" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--审批页签部分-->
            <div
              v-if="
                pageType == 'look' ||
                pageType == 'approval' ||
                pageType == 'upload'
              "
            >
              <stepsModel
                ref="stepsModel"
                :isShow="pageType === 'approval' ? true : false"
                :id="id"
              />
            </div>
          </a-form-model>
          <div class="ant-modal-footer">
            <a-button
              v-if="pageType == 'edit' || pageType == 'add'"
              type="primary"
              @click="saveList"
            >
              保存
            </a-button>
            <a-button
              v-Add
              v-if="pageType == 'edit' || pageType == 'add'"
              class="buttonType"
              type="primary"
              @click.stop="saveList('sunmit')"
            >
              提交
            </a-button>
            <a-button
              v-if="pageType == 'upload'"
              class="buttonType"
              type="primary"
              @click.stop="saveList('upload')"
            >
              提交
            </a-button>
            <a-button
              type="primary"
              v-if="pageType == 'approval'"
              @click="approvalCommit()"
            >
              确定
            </a-button>
            <a-button @click="handleCancel"> 取消 </a-button>
          </div>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getListForPage,
  deleteByIds,
  getLoginUserInfo,
  add,
  update,
  submitForAddOrUpdate,
  monthPlanAudio,
  affirm as confirm,
} from "@/api/meteringManagement/AnalysisManagement.js";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  components: {
    fileUpload: fileUpload,
    stepsModel,
  },
  data() {
    return {
      id: "",
      pageType: "",
      fileList: [],
      startDate: [],
      details: false,
      SC: false,
      toExamine: { applyEmp: "" },
      //新增是否visible
      visibleAddNew: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: "950px",
        title: "",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //翻页页面组件
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
      //勾选框/选择框组件
      selectedRowKeys: [],
      date: [],
      //查询所需的数据
      form: {},
      dataSource: [],
      //页面下方表格的列属性
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
          align: "center",
        },
        {
          title: "编号",
          dataIndex: "checkoutCode",
          width: 200,
          align: "center",
          ellipsis: true,
        },
        {
          title: "检验样品",
          dataIndex: "analyseSample",
          ellipsis: true,
          width: 200,
          align: "center",
        },
        {
          title: "分析项目",
          dataIndex: "analyseProject",
          ellipsis: true,
          width: 200,
          align: "center",
        },
        {
          title: "计划分析时间",
          dataIndex: "planAnalyseTime",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "申请部门",
          dataIndex: "applyDept",
          ellipsis: true,
          // width: 150,
          align: "center",
        },
        {
          title: "申请人",
          dataIndex: "applyEmp",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "申请时间",
          dataIndex: "applyTime",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "审批状态",
          ellipsis: true,
          dataIndex: "recordStatusName",
          width: 100,
          align: "center",
          fixed: "right",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 180,
          fixed: "right",
          align: "center",
        },
      ],
      securityCheckFormRules: {
        checkoutCode: [
          { required: true, message: "请输入编号", trigger: "blur" },
        ],
      },
      // stateInfo: [],
      flieChange: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCancel() {
      this.visibleAddNew = false;
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      this.$nextTick(() => {
        let dom = document.getElementById("addContent");
        if (dom !== null) {
          dom.scrollTop = 0;
        }
      });
      this.$refs.securityCheckFormRef.clearValidate();
      this.closeModel();
    },
    auditApproval(stepProgress, fileInfo) {
      if (stepProgress == "2" && fileInfo == null) {
        return true;
      } else {
        return false;
      }
    },
    FunupDate(recode) {
      this.$router.push({
        path: "/AnalysisManagementUplode",
        query: recode,
      });
    },
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },

    closeModel() {
      this.id = "";
      this.visibleAddNew = false;
      this.getList();
    },

    // 提交
    CSubmit() {
      submitForAddOrUpdate(this.toExamine.id).then((res) => {
        if (res.code == "200") {
          this.$message.success("提交成功");
          this.closeModel();
        } else {
          this.$message.warning("提交失败");
        }
      });
    },
    // 审批
    approvalCommit() {
      let params = {
        id: this.toExamine.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      };
      monthPlanAudio(params).then((res) => {
        if (res.body == "true") {
          this.$message.success("审批成功");
          this.closeModel();
        } else {
          this.$message.warning("审批失败");
        }
      });
    },

    confirm(id) {
      confirm(id).then((res) => {
        if (res.code == "200") {
          this.getList();
          this.$message.success("确认成功");
        } else {
          this.$message.error("确认失败");
        }
      });
    },
    saveList(value) {
      // this.pageType = "save";
      this.$refs.securityCheckFormRef.validate((valid) => {
        if (valid) {
          if (this.addNewModelConfig.title == "分析检验管理-编辑") {
            update(this.toExamine).then((res) => {
              if (res.code == "200") {
                if (value == "sunmit") {
                  this.CSubmit();
                } else {
                  this.$message.success("修改成功!");
                  this.closeModel();
                }
              } else {
                if (value == "sunmit") {
                  this.$message.error("提交失败！");
                } else {
                  this.$message.warning("修改失败");
                }
              }
            });
          } else if (
            this.addNewModelConfig.title == "分析检验管理-检验报告上传"
          ) {
            //附件
            if (this.fileList && this.fileList.length > 0) {
              let flielist = [];
              this.fileList.forEach((element) => {
                let row = { id: element.id, fileName: element.fileName };
                flielist.push(row);
              });

              this.toExamine.fileInfo = JSON.stringify(flielist);
              this.toExamine.uploadEmp = this.toExamine.uploadEmp;
              this.toExamine.uploadTime = this.toExamine.uploadTime;

              update(this.toExamine).then((res) => {
                if (res.code == "200") {
                  this.$message.success("上传成功");
                  this.closeModel();
                }
              });
            } else {
              this.$message.warning("请选择文件");
            }
          } else {
            this.toExamine.recordStatus = 1;
            add(this.toExamine).then((res) => {
              if (res.code == "200") {
                if (value == "sunmit") {
                  this.toExamine.id = res.body;
                  this.CSubmit();
                } else {
                  this.$message.success("新增成功!");
                  this.closeModel();
                }
              } else {
                if (value == "sunmit") {
                  this.$message.error("提交失败！");
                } else {
                  this.$message.warning("新增失败");
                }
              }
            });
          }
        } else {
          this.$message.warning("请输入正确格式的数据！");
        }
      });
    },
    edit(row) {
      this.details = false;
      this.pageType = "edit";
      this.visibleAddNew = true;
      this.addNewModelConfig.title = "分析检验管理-编辑";
      this.toExamine = row;
      this.SC = false;
    },
    //点击表格中审批按钮
    approvalClick(val) {
      this.look(val);
      this.pageType = "approval";
    },
    look(row) {
      this.details = true;
      this.pageType = "look";
      this.visibleAddNew = true;
      this.addNewModelConfig.title = "分析检验管理-详情";
      this.toExamine = row;
      this.SC = true;
      this.$nextTick(() => {
        this.id = row.id;
      });
      //附件回显
      if (row.fileInfo) {
        if (row.fileInfo.indexOf("“") > 0) {
          this.fileList = JSON.parse(
            this.chineseChar2englishChar(row.fileInfo)
          );
        } else {
          if (row.fileInfo) {
            this.fileList = JSON.parse(row.fileInfo);
          }
        }
      }
    },
    chineseChar2englishChar(chineseChar) {
      // 将单引号‘’都转换成'，将双引号“”都转换成"
      var str = chineseChar.replace(/\’|\‘/g, "'").replace(/\“|\”/g, '"');
      // 将中括号【】转换成[]，将大括号｛｝转换成{}
      str = str
        .replace(/\【/g, "[")
        .replace(/\】/g, "]")
        .replace(/\｛/g, "{")
        .replace(/\｝/g, "}");
      // 将逗号，转换成,，将：转换成:
      str = str.replace(/，/g, ",").replace(/：/g, ":");
      return str;
    },
    uploadSC(row) {
      this.visibleAddNew = true;
      this.details = false;
      this.pageType = "upload";
      this.addNewModelConfig.title = "分析检验管理-检验报告上传";
      this.toExamine = row;
      this.SC = true;
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
      this.toExamine.uploadTime =
        yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + mf;
      getLoginUserInfo().then((res) => {
        this.toExamine.uploadEmp = res.body.name;
        this.$forceUpdate();
      });
    },
    addNew() {
      this.details = false;
      this.pageType = "add";
      this.SC = false;
      this.addNewModelConfig.title = "分析检验管理-新增";
      this.visibleAddNew = true;
      this.toExamine = {};
      let name = "";
      getLoginUserInfo().then((res) => {
        this.toExamine.applyEmp = res.body.name;

        this.toExamine.applyDept = res.body.unitName;
        this.$forceUpdate();
      });
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
      this.toExamine.applyTime =
        yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + mf;
      this.toExamine.checkoutCode = "FXJYGL" + yy + mm + dd + hh + mf + mf; //编号
      //   this.toExamine.applyEmp = name;
    },
    // 删除
    mydelete() {
      deleteByIds(this.selectedRowKeys).then((res) => {
        this.$message.success("删除成功");
        this.getList();
      });
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus !== "1" && record.recordStatus !== "5",
        },
      };
    },
    fileListChange(val) {
      this.fileList = val;
    },
    //获得当前页面
    getList() {
      getListForPage(this.form).then((res) => {
        this.dataSource = res.body.data;
        res.body.data.forEach((element) => {
          if (element.recordStatus == 1) {
            element.recordStatusName = "已保存";
          } else if (element.recordStatus == 2) {
            element.recordStatusName = "已提交";
          } else if (element.recordStatus == 3) {
            element.recordStatusName = "审批中";
          } else if (element.recordStatus == 4) {
            element.recordStatusName = "已审批";
          } else if (element.recordStatus == 5) {
            element.recordStatusName = "已拒绝";
          }
        });
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
      // encode("LBSQ_SSBM").then((res) => {
      //   if (res.code == 200) {
      //     this.stateInfo = res.body.data;
      //   }
      // });

      // stateInfo
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //日期的onchange
    dateChange(dates) {
      if (dates.length > 0) {
        this.form.startTime = dates[0];
        this.form.endTime = dates[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageNum = 1;
        this.form.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.date = [];
      this.startDate = [];
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    onChange(date) {
      if (date) {
        this.form.startTime = date[0];
        this.form.endTime = date[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
  },
};
</script>
<style scoped>
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout{
  margin-bottom: 0px;
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
