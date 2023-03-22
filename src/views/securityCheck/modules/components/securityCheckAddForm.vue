<template>
  <div>
    <div>
      <a-modal
        title="安全检查"
        :visible="visible"
        @cancel="cancelList"
        :after-close="formListAfterClose"
        class="from-style bigModel"
        :title="securityTypeModel.title"
        :maskClosable="false"
        destroyOnClose
      >
        <a-form-model
          :model="formList"
          ref="securityCheckFormRef"
          :rules="securityCheckFormRules"
        >
          <!-- 安全检查新增 -->
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="检查编号" prop="inspectionNo">
                <a-input
                  v-model="formList.inspectionNo"
                  placeholder="自动生成"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="检查名称" prop="inspectionName">
                <a-input
                  placeholder="请输入"
                  v-model="formList.inspectionName"
                  :disabled="securityCheckDisabled == 'details'"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-add-form">
              <a-form-model-item label="检查级别" prop="inspectionLevel">
                <a-select
                  :options="inspectionLevelOption"
                  v-model="formList.inspectionLevel"
                  placeholder="请选择"
                  :disabled="securityCheckDisabled == 'details'"
                  @change="formListChange('inspectionLevel')"
                  :getPopupContainer="getPopupContainer"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-add-form">
              <a-form-model-item label="检查类别" prop="inspectionCategory">
                <a-select
                  v-model="formList.inspectionCategory"
                  show-search
                  placeholder="请选择"
                  option-filter-prop="children"
                  :disabled="securityCheckDisabled == 'details'"
                  @change="formListChange('inspectionCategory')"
                  :getPopupContainer="getPopupContainer"
                >
                  <a-select-option
                    :value="province.dictname"
                    v-for="(province, index) in inspectionCategoryOption"
                    :key="index"
                  >
                    {{ province.dictname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="检查时间" prop="inspectionTimeStart">
                <a-date-picker
                  v-model="formList.inspectionTimeStart"
                  @change="formListChange('inspectionTimeStart')"
                  valueFormat="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  :disabled="securityCheckDisabled == 'details'"
                  :placeholder="'请输入检查时间'"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-add-form">
              <a-form-model-item label="检查主体" prop="checkMainBody">
                <a-select
                  v-model="formList.checkMainBody"
                  show-search
                  placeholder="请选择检查主体"
                  option-filter-prop="children"
                  :disabled="securityCheckDisabled == 'details'"
                  :getPopupContainer="getPopupContainer"
                >
                  <a-select-option
                    :value="province.dictname"
                    v-for="(province, index) in checkMainBodyOption"
                    :key="index"
                  >
                    {{ province.dictname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="检查人" prop="inspectedBy">
                <a-input
                  v-model="formList.inspectedBy"
                  placeholder="请输入"
                  :disabled="securityCheckDisabled == 'details'"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-add-form">
              <a-form-model-item label="被检单位" prop="inspectedUnit">
                <a-select
                  :options="inspectedUnitOptions"
                  v-model="formList.inspectedUnit"
                  placeholder="请选择"
                  :disabled="securityCheckDisabled == 'details'"
                  :getPopupContainer="getPopupContainer"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="是否存在隐患" prop="isRisk">
                <a-radio-group
                  v-model="formList.isRisk"
                  @change="hiddenNoticeChange"
                  :disabled="securityCheckDisabled == 'details'"
                >
                  <a-radio :value="true"> 是 </a-radio>
                  <a-radio :value="false"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="是否下达隐患整改通知单" prop="isNotice">
                <a-radio-group
                  v-model="formList.isNotice"
                  :disabled="securityCheckDisabled == 'details'"
                >
                  <a-radio :value="true"> 是 </a-radio>
                  <a-radio :value="false"> 否 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item v-if="showHidden">
            <div class="hidden_information">
              <div class="hidden_information_header">
                <div class="title">
                  <p style="font-weight: 800">隐患信息</p>
                </div>
                <!-- 隐患信息新增、删除按钮 -->

                <div class="button_layout">
                  <pe-button
                    :include="[
                      {
                        value: 'Add',
                        clickName: 'addHidden',
                        isPower: false,
                        disabled: securityCheckDisabled == 'details',
                      },
                      {
                        value: 'Delete',
                        clickName: 'deleteHidden',
                        isPower: false,
                        disabled: securityCheckDisabled == 'details',
                      },
                    ]"
                    @addHidden="addHidden()"
                    @deleteHidden="deleteHidden()"
                  ></pe-button>
                </div>
              </div>
              <!-- 隐患信息表格插槽按钮 -->
              <a-table
                :columns="columnsForm"
                :data-source="dataHidden"
                :scroll="{ y: 1, x: 100 }"
                class="list_table"
                :row-selection="{
                  selectedRowKeys: selectedHiddenRowKeys,
                  onChange: onSelectChangeHidden,
                  columnWidth: '30px',
                }"
              >
                <template slot="recordStatus" slot-scope="text">
                  {{ text | recordStatus }}
                </template>
                <template slot="operation" slot-scope="text, record, index">
                  <pe-button
                    :include="[
                      {
                        value: 'Edit',
                        type: 'link',
                        clickName: 'edit',
                        icon: '',
                        style: ['btn_link'],
                        show: isShowBJ,
                        isPower: false,
                        disabled: isDisabledEdit,
                      },
                      {
                        value: 'Rectification',
                        type: 'link',
                        clickName: 'rectification',
                        icon: '',
                        style: ['btn_link'],
                        isPower: false,
                        show: isShowZG,
                        name: '整改',
                        disabled:
                          falg ||
                          !formList.rectificationUserB ||
                          record.recordStatus == '4' ||
                          record.recordStatus == '7' ||
                          isDisabledZG,
                      },
                      {
                        value: 'CheckAcceptance',
                        type: 'link',
                        clickName: 'checkAcceptance',
                        icon: '',
                        style: ['btn_link'],
                        isPower: false,
                        show: isShowYS,
                        name: '验收',
                        disabled: record.recordStatus != '4',
                      },
                      {
                        value: 'View',
                        type: 'link',
                        clickName: 'view',
                        icon: '',
                        style: ['btn_link'],
                        isPower: false,
                        name: '详情',
                      },
                    ]"
                    @edit="editHidden(record, index)"
                    @rectification="rectification(record, index)"
                    @checkAcceptance="checkAcceptance(record, index)"
                    @view="checkHidden(record, index)"
                  ></pe-button>
                </template>
              </a-table>
              <div class="addForm">
                <!-- 隐患信息新增弹框 -->
                <add-hidden-form
                  :security-check="formList"
                  :hidden-danger-visible="hiddenDangerVisible"
                  @close="addHiddenFormClose"
                  @saveHiddenDanger="saveHiddenDanger"
                  :stateMonitor="stateMonitor"
                  ref="addHiddenFormRef"
                  :typeModel="typeModel"
                  @pass="passChange"
                ></add-hidden-form>
              </div>
            </div>
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <div style="text-align: center">
            <a-button
              v-if="showRect"
              type="primary"
              @click="noticeFormViewClick(changeValue)"
              :disabled="isNoticeForm"
            >
              <!-- :disabled="formList.isNotice == false" -->
              隐患整改通知单
            </a-button>
            <a-button v-if="showSave" type="primary" @click="saveListClick">
              保存
            </a-button>
            <a-button
              v-if="showReply"
              type="primary"
              @click="replyFormOpenClick(changeValue)"
              :disabled="isReplyForm"
            >
              隐患整改回复单
            </a-button>
            <!-- <a-button
              v-if="showSub"
              type="primary"
              @click="submitAddList"
              :disabled="isDisabledHidden"
            >
              提交
            </a-button> -->
            <a-button
              v-if="showNoticeFormAndSubmit"
              type="primary"
              @click="noticeFormOpenClick(changeValue)"
              :disabled="
                formList.isRisk == true &&
                formList.isNotice == true &&
                this.dataHidden.length == 0
              "
            >
              提交
            </a-button>
          </div>
        </template>
      </a-modal>
    </div>
    <a-modal
      v-model="hiddenDangerReplyFormVisible"
      title="隐患整改回复单"
      :footer="null"
      class="from-style bigModel"
      :maskClosable="false"
    >
      <a-form-model>
        <hidden-danger-reply-form
          @cancel="hiddenDangerReplyFormCancel"
          v-if="hiddenDangerReplyFormVisible"
          :table-list="dataHidden"
          :table-id="formList.iD"
          :change-value="changeValue"
          :table-resign="formList.rectificationReplyUser"
          @flag="flagClick"
          :inspected-unit-options="inspectedUnitOptions"
          @signatureChange="signatureChange"
          :hiddenDangerCode="formList.inspectionNo"
          @changePicture3="changePicture3"
        ></hidden-danger-reply-form>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="hiddenDangerFormVisible"
      title="隐患整改通知单"
      :footer="null"
      class="from-style bigModel"
      :maskClosable="false"
    >
      <a-form-model>
        <hidden-danger-notice-form
          @cancel="hiddenDangerNoticeFormCancel"
          v-if="hiddenDangerFormVisible"
          :table-list="dataHidden"
          :table-id="formList.iD"
          :table-sign="formList.checkUserB"
          :table-sign2="formList.rectificationUserB"
          :change-value="changeValue"
          @recordStatus="recordStatus"
          ref="hiddenNoticeFormRef"
          @changePicture="changePicture"
          @changePicture2="changePicture2"
          :inspected-unit-options="inspectedUnitOptions"
          :hiddenDangerCode="formList.inspectionNo"
        ></hidden-danger-notice-form>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getList } from "@/api/securityCheck";
import { companySelect } from "@/api/JSAAnalysis";
import { pinyin } from "pinyin-pro";
import addHiddenForm from "./addHiddenForm.vue";
import hiddenDangerReplyForm from "./hiddenDangerReplyForm.vue";
import { encode } from "@/api/dataDictionary";
import { filterTime } from "@/utils/utils";
import hiddenDangerNoticeForm from "./hiddenDangerNoticeForm.vue";
export default {
  // 临时
  components: {
    addHiddenForm,
    hiddenDangerReplyForm,
    hiddenDangerNoticeForm,
  },
  name: "securityCheckAddForm",
  props: [
    "visible",
    "stateMonitorSecurity",
    "securityCheckAdd",
    // "currentPage",
    "securityCheckDisabled",
    "showSave",
    "listTotal",
    "isShowZG",
    "isShowYS",
    "isShowBJ",
    "securityTypeModel",
  ],
  filters: {
    recordStatus(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "已保存";
          break;
        case "2":
          value = "未整改";
          break;
        case "3":
          value = "整改中";
          break;
        case "4":
          value = "已整改";
          break;
        case "5":
          value = "已提交";
          break;
        case "6":
          value = "审批中";
          break;
        case "7":
          value = "已验收";
          break;
        case "8":
          value = "已拒绝";
          break;
        default:
          break;
      }
      return value;
    },
  },
  data() {
    return {
      isDisabledEdit: false,
      isDisabledZG: false,
      isReplyForm: true,
      isNoticeForm: false,
      falg: true,
      flag: true,
      replyIsSignature: false,
      hiddenDangerFormVisible: false,
      hiddenDangerReplyFormVisible: false,
      inspectionLevelOption: [
        { value: "公司级检查", label: "公司级检查" },
        { value: "部门级检查", label: "部门级检查" },
        { value: "班组级检查", label: "班组级检查" },
      ], //检查级别
      checkMainBodyOption: [], //检查主体下拉框
      inspectionCategoryOption: [], //检查类别下拉框
      typeModel: { type: "YS", title: "隐患验收" },
      hiddenDangerVisible: false,
      showHidden: true,
      stateMonitor: "",
      showSub: true,
      showRect: true,
      showReply: false,
      showNoticeFormAndSubmit: false,
      formList: {
        inspectionNo: "",
        inspectionName: "",
        inspectionLevel: undefined,
        inspectionCategory: undefined,
        inspectionTimeStart: "",
        inspectionTimeEnd: "",
        iheckMainBody: "",
        inspectedBy: "",
        inspectedUnit: undefined,
        isRisk: true,
        isNotice: true,
      },
      securityCheckFormRules: {
        inspectionNo: [
          { required: true, message: "请输入检查编号", trigger: "blur" },
        ],
        inspectionName: [
          { required: true, message: "请输入检查名称", trigger: "blur" },
        ],
        inspectionLevel: [
          { required: true, message: "请选择检查级别", trigger: "change" },
        ],
        inspectionCategory: [
          { required: true, message: "请选择检查类别", trigger: "change" },
        ],
        inspectionTimeStart: [
          { required: true, message: "请选择检查时间", trigger: "change" },
        ],
        checkMainBody: [
          { required: true, message: "请选择检查主体", trigger: "blur" },
        ],
        inspectedBy: [
          { required: true, message: "请输入检查人", trigger: "blur" },
        ],
        inspectedUnit: [
          { required: true, message: "请输入被检单位", trigger: "blur" },
        ],
        isRisk: [
          { required: true, message: "请选择是否存在隐患", trigger: "change" },
        ],
        isNotice: [
          {
            required: true,
            message: "请选择是否下达隐患整改通知单",
            trigger: "change",
          },
        ],
      },
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
      columnsForm: [
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
          title: "隐患地点",
          dataIndex: "hiddenDangerLocation",
          width: 180,
          align: "center",
        },
        {
          title: "隐患类别",
          dataIndex: "hazardCategory",
          width: 100,
          align: "center",
        },
        {
          title: "隐患级别",
          dataIndex: "hazardLevel",
          width: 100,
          align: "center",
        },
        {
          title: "整改责任单位",
          dataIndex: "rectificationDutyCompany",
          customRender: (text) => {
            return this.inspectedUnitOptions.filter(
              (obj) => text === obj.value
            )[0]?.label;
          },
          width: 120,
          align: "center",
        },
        {
          title: "整改责任人",
          dataIndex: "rectificationDutyPerson",
          width: 100,
          align: "center",
        },
        {
          title: "发现时间",
          dataIndex: "inspectionTimeStart",
          width: 130,
          align: "center",
        },
        {
          title: "整改时限",
          dataIndex: "rectificationTimeLimit",
          width: 100,
          align: "center",
        },
        {
          title: "隐患描述",
          dataIndex: "hazardDescription",
          width: 180,
          align: "center",
        },
        {
          title: "整改要求",
          dataIndex: "rectificationRequirements",
          width: 180,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "recordStatus",
          scopedSlots: { customRender: "recordStatus" },
          width: 100,
          align: "center",
        },
        {
          title: "操作",
          width: 200,
          scopedSlots: { customRender: "operation" },
          fixed: "right",
          align: "center",
        },
      ],
      selectedHiddenRowKeys: [],
      formTimeData: "",
      dataHidden: [],
      company: [], //外委单位下拉框
      departmentOption: [],
      inspectedUnitOptions: [],
      changeValue: "",
      placeholder: "",
      noticeModel: false,
    };
  },
  mounted() {
    this.encodeSelect();
    this.getOutsourceCompany();
    this.flagClick();
    // this.placeholder()
  },
  // 监听当前数据变化
  watch: {
    formList: {
      handler(newVal, oldVal) {
        let formListKey = [
          "inspectionNo",
          "inspectionName",
          "inspectionLevel",
          "inspectionCategory",
          "inspectionTimeStart",
          "inspectionTimeEnd",
          "iheckMainBody",
          "inspectedBy",
          "inspectedUnit",
          "isRisk",
          "isNotice",
        ];
        if (oldVal && newVal.hasOwnProperty("inspectionNo")) {
          for (let index = 0; index < formListKey.length; index++) {
            const key = formListKey[index];
            if (newVal[key] !== oldVal[key]) {
              for (let index = 0; index < this.dataHidden.length; index++) {
                const element = this.dataHidden[index];
                element[key] = newVal[key];
              }
            }
          }
        }
        if (newVal.isRisk) {
          if (newVal.isNotice == false) {
            //this.showHidden = false;
            this.isNoticeForm = true;
          } else {
            this.showHidden = true;
          }
        } else {
          this.dataHidden = [];
          this.formList.checkUserB = "";
          newVal.isNotice = false;
          this.isDisabledHidden = false;
          this.isDisabledAddHidden = true;
          this.showHidden = false;
          this.isNoticeForm = true;
        }
      },
      immediate: true,
      deep: true,
    },
    visible: {
      handler(newVal, oldVal) {
        if (newVal) {
          let departmentOption = this.departmentOption.map((item) => {
            return { label: item.dictname, value: item.id };
          });
          this.inspectedUnitOptions = [...departmentOption, ...this.company];
          this.showSub = false;
          this.saveList = false;
          this.showReply = false;
          this.showRect = false;
          switch (this.stateMonitorSecurity) {
            case "addList":
              this.showSub = true;
              this.saveList = true;
              this.showReply = false;
              this.showNoticeFormAndSubmit = true;
              this.isDisabledEdit = false;
              this.isDisabledZG = false;
              this.showRect = false;
              this.changeValue = "editClickYh";
              this.isNoticeForm = true;
              break;
            case "editList":
              this.showSub = true;
              this.saveList = true;
              this.showReply = false;
              this.showRect = false;
              this.isDisabledEdit = false;
              this.isDisabledZG = false;
              this.changeValue = "editClickYh";
              this.showNoticeFormAndSubmit = true;
              this.isNoticeForm = true;
              break;
            case "checkList":
              this.showSub = false;
              this.saveList = false;
              this.showReply = true;
              this.showRect = true;
              this.isDisabledEdit = true;
              this.isDisabledZG = true;
              this.changeValue = "viewClickYh";
              this.showNoticeFormAndSubmit = false;
              this.isNoticeForm = false;
              break;
            case "recteList":
              this.showSub = false;
              this.saveList = false;
              this.showReply = true;
              this.showRect = true;
              this.isDisabledZG = false;
              this.changeValue = "recteClickYh";
              this.showNoticeFormAndSubmit = false;
              this.isNoticeForm = false;
              break;
          }
        }
      },
    },
  },
  methods: {
    getPopupContainer() {
      return document.querySelector(".position-add-form");
    },
    passChange(val, callback) {
      this.$emit("passChange", val, (res) => {
        callback();
        getList({ id: val.getListId }).then((res) => {
          let data = res.body.data;
          // 将首字母大写的字段名改为小写
          this.dataHidden = data.map(function (item) {
            var newItem = {};
            for (var key in item) {
              newItem[
                key.replace(/^[A-Z]/, function (match) {
                  return match.toLowerCase();
                })
              ] = item[key];
            }
            return newItem;
          });
          //  时间戳转换为YYYY-MM-DD
          this.dataHidden.forEach((element) => {
            element.inspectionTimeStart = filterTime(
              element.inspectionTimeStart
            );
            element.rectificationTimeLimit = filterTime(
              element.rectificationTimeLimit
            );
            element.rectificationTime = filterTime(element.rectificationTime);
            element.attType = this.$fileUploadJSON.toParse(element.attType);
          });
        });
      });
      this.addHiddenFormClose();
    },
    recordStatus(value) {
      this.recordStatus = value;
      this.$emit("resetFromCustom");
    },
    flagClick(falg) {
      if (this.formList.checkUserB) {
        this.falg = false;
      } else {
        this.falg = falg;
      }
    },
    formListChange(name) {
      let pinyinFirst = "";
      if (this.formList.inspectionLevel) {
        pinyinFirst = pinyin(this.formList.inspectionLevel, {
          pattern: "first",
          toneType: "none",
        })
          // 去掉空格乱七八糟的
          .replace(/\s*/g, "")
          // 转成大写
          .toUpperCase()
          .slice(0, 3);
        // 找到首字母
      }
      let pinyinFirstLB = "";
      if (this.formList.inspectionCategory) {
        pinyinFirstLB = pinyin(this.formList.inspectionCategory, {
          pattern: "first",
          toneType: "none",
        })
          // 去掉空格乱七八糟的
          .replace(/\s*/g, "")
          // 转成大写
          .toUpperCase()
          .slice(0, 4);
      }
      let time = "";
      if (this.formList.inspectionTimeStart) {
        time = this.formList.inspectionTimeStart.replace(/-/g, "");
      }
      // 序号
      let serialNumber;
      if (this.listTotal + 1 < 10) {
        serialNumber = "00" + (this.listTotal + 1);
      } else if (this.listTotal + 1 < 100) {
        serialNumber = "0" + (this.listTotal + 1);
      } else {
        serialNumber = "" + (this.listTotal + 1);
      }
      if (pinyinFirst != "" && pinyinFirstLB != "" && time != "") {
        this.formList.inspectionNo =
          pinyinFirst + pinyinFirstLB + time + serialNumber;
      } else {
        this.formList.inspectionNo = "";
      }
      if (name == "inspectionTimeStart") {
        this.dataHidden.forEach((element) => {
          element.inspectionTimeStart = this.formList.inspectionTimeStart;
        });
      }
    },
    hiddenDangerNoticeFormCancel() {
      // this.formList.rectificationUserB = "";
      this.hiddenDangerFormVisible = false;
    },
    hiddenDangerReplyFormCancel() {
      // this.formList.rectificationUserB = "";
      this.hiddenDangerReplyFormVisible = false;
    },
    noticeFormViewClick(changeValue) {
      this.hiddenDangerFormVisible = true;
    },
    // 整改通知单按钮
    noticeFormOpenClick(changeValue) {
      if (this.formList.isNotice) {
        this.hiddenDangerFormVisible = true;
        if (this.noticeModel == true) {
          this.onSubmit("submit");
          this.hiddenDangerFormVisible = true;
          this.noticeModel = false;
        } else {
          this.$message.warning("请签章");
        }
      } else {
        this.onSubmit("submit");
      }
      //this.onSubmit("submit");
    },
    // 回复通知单按钮
    replyFormOpenClick(changeValue) {
      // if (this.changeValue == "viewClickYh") {
      //   this.formList.rectificationUserC = this.formList.rectificationUserB;
      // } else {
      // if (this.replyIsSignature) {
      //   debugger
      //   this.formList.rectificationUserC = this.formList.rectificationUserB;
      // } else {
      //   this.formList.rectificationUserC = "";
      // }
      // }
      this.hiddenDangerReplyFormVisible = true;
      // this.formList.rectificationUserB = "";
    },
    signatureChange() {
      this.replyIsSignature = true;
    },
    hiddenNoticeChange(e) {},
    // 保存按钮
    saveListClick() {
      this.onSubmit("save");
    },
    onSubmit(val) {
      this.$refs.securityCheckFormRef.validate((valid) => {
        if (valid) {
          if (val == "save") {
            this.$emit(
              "saveSecurity",
              this.formList,
              this.stateMonitorSecurity,
              this.dataHidden,
              this.formList.checkUserB
            );
            this.formClose();
          } else if (val == "submit") {
            // if (this.formList.isRisk === true) {
            //   debugger
            //   // if (this.dataHidden.length === 0) {
            //   //   this.$message.warning("请输入隐患信息");
            //   // } else {
            //   //   let data = this.formList;
            //   //   data.status = "5";
            //   //   this.$emit(
            //   //     "submitSecurity",
            //   //     this.formList,
            //   //     this.stateMonitorSecurity,
            //   //     this.dataHidden,
            //   //     this.formList.checkUserB
            //   //   );
            //   // }
            // }
            let data = this.formList;
            data.status = "5";
            this.$emit(
              "submitSecurity",
              this.formList,
              this.stateMonitorSecurity,
              this.dataHidden,
              this.formList.checkUserB
            );
            this.formClose();
            // security页面
          }
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    submitAddList() {
      this.onSubmit("submit");
    },
    // 关闭新增隐患弹框
    addHiddenFormClose() {
      this.hiddenDangerVisible = false;
    },
    // 新增隐患按钮
    addHidden() {
      this.typeModel = { title: "隐患信息-新增" };
      this.$refs.addHiddenFormRef.formHiddenList = {};
      this.hiddenDangerFormOpen("add");
    },
    // 编辑隐患按钮
    editHidden(value, index) {
      this.typeModel = { title: "隐患信息-编辑" };
      this.editTableIndex = index;
      this.$nextTick(() => {
        this.$refs.addHiddenFormRef.formHiddenList = JSON.parse(
          JSON.stringify(value)
        );
        this.hiddenDangerFormOpen("editYH");
      });
    },
    // 隐患详情按钮
    checkHidden(value, index) {
      this.typeModel = { title: "隐患信息-详情" };
      this.editTableIndex = index;
      this.$nextTick(() => {
        this.$refs.addHiddenFormRef.formHiddenList = JSON.parse(
          JSON.stringify(value)
        );
        this.hiddenDangerFormOpen("check");
      });
    },
    // 隐患验收
    checkAcceptance(value, index) {
      this.typeModel = { type: "YS", title: "隐患验收" };
      this.editTableIndex = index;
      this.$refs.addHiddenFormRef.formHiddenList = JSON.parse(
        JSON.stringify(value)
      );
      this.hiddenDangerFormOpen("YS");
    },
    // 隐患整改
    rectification(value, index) {
      this.typeModel = { title: "隐患整改" };
      this.editTableIndex = index;
      this.$refs.addHiddenFormRef.formHiddenList = JSON.parse(
        JSON.stringify(value)
      );
      this.hiddenDangerFormOpen("edit");
    },
    // 打开隐患新增弹框
    hiddenDangerFormOpen(val) {
      this.stateMonitor = val;
      this.hiddenDangerVisible = true;
    },
    onSelectChangeHidden(key) {
      this.selectedHiddenRowKeys = key;
    },
    cancelList(e) {
      this.formClose();
    },
    formClose() {
      this.$emit("close");
    },
    formListAfterClose() {
      this.formList = {
        inspectionNo: undefined,
        inspectionName: undefined,
        inspectionLevel: undefined,
        inspectionCategory: undefined,
        inspectionTimeStart: "",
        inspectionTimeEnd: "",
        iheckMainBody: "",
        inspectedBy: "",
        inspectedUnit: undefined,
        isRisk: true,
        isNotice: true,
        rectificationUserB: "",
        rectificationReplyUser: "",
        checkUserB: "",
      };
      this.formTimeData = [];
      this.dataHidden = [];
      this.$refs.securityCheckFormRef.clearValidate();
    },
    saveHiddenDanger(val, situation) {
      let newVal = val;
      newVal.findTime = val.inspectionTimeStart;
      newVal.inspectionTime = val.inspectionTimeStart;
      this.formList.Status = val.Status;
      if (situation == "add") {
        this.dataHidden.push(newVal);
      } else {
        this.dataHidden[this.editTableIndex] = newVal;
        getList({ id: val.iD }).then((res) => {
          let data = res.body.data;
          // 导致编辑变坏
          // 将首字母大写的字段名改为小写
          if (this.$route.path == "/safetyInspectionRectification") {
            this.dataHidden = data.map(function (item) {
              var newItem = {};
              for (var key in item) {
                newItem[
                  key.replace(/^[A-Z]/, function (match) {
                    return match.toLowerCase();
                  })
                ] = item[key];
              }
              return newItem;
            });
            //  时间戳转换为YYYY-MM-DD
            this.dataHidden.forEach((element) => {
              element.inspectionTimeStart = filterTime(
                element.inspectionTimeStart
              );
              element.rectificationTimeLimit = filterTime(
                element.rectificationTimeLimit
              );
              element.rectificationTime = filterTime(element.rectificationTime);
              element.attType = this.$fileUploadJSON.toParse(element.attType);
            });
          }
          data.forEach((element) => {
            this.formList.Status = element.Status;
            if (this.formList.Status == "7") {
              this.isReplyForm = false;
            } else {
              this.isReplyForm = true;
            }
          });
        });
      }
    },
    changePicture(val) {
      this.picture = val;
      this.formList.checkUserB = val;
      if (val) {
        // this.isDisabledHidden = false;
        this.noticeModel = true;
        this.noticeFormOpenClick();
      } else {
        // this.isDisabledHidden = true;
        this.noticeModel = false;
      }
    },
    changePicture2(val) {
      this.picture2 = val;
      this.formList.rectificationUserB = val;
    },
    changePicture3(val) {
      this.picture3 = val;
      this.formList.rectificationReplyUser = val;
    },
    deleteHidden() {
      if (this.selectedHiddenRowKeys.length == 0) {
        this.$message.warning("请选择要删除的隐患信息");
      } else {
        let deleteIndex = 0;
        for (
          let index = 0;
          index < this.selectedHiddenRowKeys.length;
          index++
        ) {
          const element = this.selectedHiddenRowKeys[index];
          deleteIndex += 1;
          this.dataHidden.splice(element, 1, "substitute");
        }
        for (let index = 0; index < deleteIndex; index++) {
          this.dataHidden.remove("substitute");
        }

        this.selectedHiddenRowKeys = [];
      }
    },
    // 获取数据字典列表
    encodeSelect() {
      // 检查主体
      encode("AQHB-JCZT").then((res) => {
        this.checkMainBodyOption = res.body.data;
      });
      // 检查类别
      encode("AQHB-JCLB").then((res) => {
        this.inspectionCategoryOption = res.body.data;
      });
      // 检查部门
      encode("LBSQ_SSBM").then((res) => {
        if (res.code == 200) {
          this.departmentOption = res.body.data;
        }
      });
    },
    getOutsourceCompany() {
      companySelect().then((res) => {
        res.body.forEach((item) => {
          this.company.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          });
        });
      });
    },
  },
};
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
</script>
<style lang="less" scoped>
.hidden_information_header {
  display: flex;
  justify-content: space-between;
}
/deep/.ant-select-dropdown-menu-item {
  overflow: auto !important;
  text-overflow: unset !important;
}
</style>
