<template>
  <a-modal
    :title="typeModel.title"
    :visible="hiddenDangerVisible"
    @cancel="cancelHidden"
    :after-close="formListAfterClose"
    class="from-style bigModel"
    :maskClosable="false"
    destroyOnClose
  >
    <a-form-model
      :model="formHiddenList"
      :label-col="labelCol"
      ref="hiddenFormRef"
      :rules="hiddenFormRules"
    >
      <a-row>
        <div class="line">
          <a-col :span="8">
            <a-form-model-item label="隐患地点" prop="hiddenDangerLocation">
              <a-input
                placeholder="请输入"
                :disabled="checkDisabled || editDisabled"
                v-model="formHiddenList.hiddenDangerLocation"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="position-hidden-form">
            <a-form-model-item label="隐患类别" prop="hazardCategory">
              <a-select
                v-model="formHiddenList.hazardCategory"
                show-search
                placeholder="请选择隐患类别"
                option-filter-prop="children"
                :disabled="checkDisabled || editDisabled"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="province.dictname"
                  v-for="(province, index) in hazardCategoryOption"
                  :key="index"
                >
                  {{ province.dictname }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="position-hidden-form">
            <a-form-model-item label="隐患级别" prop="hazardLevel">
              <a-select
                :disabled="checkDisabled || editDisabled"
                v-model="formHiddenList.hazardLevel"
                placeholder="请选择隐患级别"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option value="一般隐患"> 一般隐患 </a-select-option>
                <a-select-option value="重大隐患"> 重大隐患 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="position-hidden-form">
            <a-form-model-item
              label="整改责任单位"
              prop="rectificationDutyCompany"
            >
              <a-select
                :options="inspectedUnitOptions"
                :disabled="checkDisabled || editDisabled"
                v-model="formHiddenList.rectificationDutyCompany"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="整改责任人"
              prop="rectificationDutyPerson"
            >
              <a-input
                :disabled="checkDisabled || editDisabled"
                placeholder="请输入"
                v-model="formHiddenList.rectificationDutyPerson"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="发现时间">
              <a-date-picker
                :disabled="checkDisabled || editDisabled"
                v-model="formHiddenList.inspectionTimeStart"
                type="date"
                placeholder="自动生成"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="整改时限" prop="rectificationTimeLimit">
              <a-date-picker
                v-model="formHiddenList.rectificationTimeLimit"
                @change="onChange"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                type="date"
                :disabled="checkDisabled || editDisabled"
                placeholder="请选择整改时限"
              />
            </a-form-model-item>
          </a-col>
        </div>
        <div class="line">
          <a-col :span="8">
            <a-form-model-item label="检查编号">
              <a-input
                v-model="formHiddenList.inspectionNo"
                :placeholder="placeholder"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="检查名称">
              <a-input
                v-model="formHiddenList.inspectionName"
                :placeholder="placeholder"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="position-hidden-form">
            <a-form-model-item label="检查级别">
              <a-input
                v-model="formHiddenList.inspectionLevel"
                :placeholder="placeholder"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="position-hidden-form">
            <a-form-model-item label="检查类别">
              <a-input
                v-model="formHiddenList.inspectionCategory"
                :placeholder="placeholder"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="检查时间">
              <a-input
                v-model="formHiddenList.inspectionTimeStart"
                :placeholder="placeholder"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="position-hidden-form">
            <a-form-model-item label="检查主体">
              <a-input
                v-model="formHiddenList.checkMainBody"
                :placeholder="placeholder"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="检查人">
              <a-input
                v-model="formHiddenList.inspectedBy"
                :placeholder="placeholder"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="被检单位">
              <a-select
                :options="inspectedUnitOptions"
                v-model="formHiddenList.inspectedUnit"
                :placeholder="placeholder"
                disabled
              >
              </a-select>
            </a-form-model-item>
          </a-col>
        </div>
        <div class="line">
          <a-col :span="24">
            <a-form-model-item label="隐患描述" prop="hazardDescription">
              <a-textarea
                :disabled="isDisabledHidden || checkDisabled"
                placeholder="请输入"
                v-model="formHiddenList.hazardDescription"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              >
              </a-textarea>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="整改要求"
              prop="rectificationRequirements"
            >
              <a-textarea
                :disabled="isDisabledHidden || checkDisabled"
                placeholder="请输入"
                v-model="formHiddenList.rectificationRequirements"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              >
              </a-textarea>
            </a-form-model-item>
          </a-col>
          <!--  -->
          <a-col :span="24">
            <a-form-model-item label="隐患图片">
              <file-upload
                :Text="'上传文件'"
                @fileChange="flieListChange"
                :echoList="formHiddenList.attID"
                :disabled="isDisabledHidden || checkDisabled"
                ref="importConpontsDataRef"
                :fileType="'jpg,png'"
                :accept="'image/*'"
              ></file-upload>
            </a-form-model-item>
          </a-col>
        </div>
        <div class="line">
          <div class="step" v-if="seen">
            <div>
              <div class="title">
                <p style="margin-left: 18px; font-weight: 800">整改信息</p>
              </div>
              <a-col :span="24">
                <a-form-model-item
                  label="整改情况"
                  prop="rectificationSituation"
                >
                  <a-radio-group
                    :disabled="checkDisabled"
                    v-model="formHiddenList.rectificationSituation"
                  >
                    <a-radio value="已完成整改"> 已完成整改 </a-radio>
                    <a-radio value="未完成整改"> 未完成整改 </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="8" class="position-hidden-form">
                <a-form-model-item
                  label="整改资金来源"
                  prop="rectificationSource"
                >
                  <a-select
                    v-model="formHiddenList.rectificationSource"
                    placeholder="请选择"
                    :disabled="checkDisabled"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="无"> 无 </a-select-option>
                    <a-select-option value="安全费用">
                      安全费用
                    </a-select-option>
                    <a-select-option value="其他"> 其他 </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="整改完成时间"
                  prop="rectificationTime"
                >
                  <a-date-picker
                    v-model="formHiddenList.rectificationTime"
                    type="date"
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    placeholder="请选择整改完成时间"
                    :disabled="checkDisabled"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="整改人" prop="rectificationUser">
                  <a-input
                    v-model="formHiddenList.rectificationUser"
                    placeholder="请输入"
                    :disabled="checkDisabled"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="验收人" prop="acceptedUser">
                  <a-input
                    v-model="formHiddenList.acceptedUser"
                    placeholder="请输入"
                    :disabled="checkDisabled"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="整改完成后照片" prop="attType">
                  <file-upload
                    :Text="'上传文件'"
                    @fileChange="flieChangeCheck"
                    :echoList="formHiddenList.attType"
                    :disabled="checkDisabled"
                    ref="fileUploadPicRef"
                    :fileType="'jpg,png'"
                    :accept="'image/*'"
                  ></file-upload>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="整改完成情况描述" prop="describet">
                  <a-textarea
                    v-model="formHiddenList.describet"
                    placeholder="请输入"
                    :disabled="checkDisabled"
                    :auto-size="{ minRows: 6, maxRows: 6 }"
                  >
                  </a-textarea>
                </a-form-model-item>
              </a-col>
            </div>
          </div>
        </div>
      </a-row>
      <!-- 审批 -->
      <div>
        <div v-if="seenApproval">
          <stepsModel
            ref="stepsModel"
            :isShow="typeModel.type === 'YS' ? true : false"
            :id="
              this.$route.path == '/hiddenDangerManagement'
                ? formHiddenList.iD
                : formHiddenList.yhzgID
            "
          />
        </div>
      </div>
    </a-form-model>
    <div class="ant-modal-footer" v-if="seenApproval">
      <a-button type="primary" @click="passClick" v-if="isShowApproval"> 确认 </a-button>
      <a-button @click="cancelHidden"> 返回 </a-button>
    </div>
    <template #footer>
      <div style="text-align: center">
        <a-button
          v-if="saveButShow"
          type="primary"
          @click="saveHidden"
          :loading="isLoading"
        >
          保存
        </a-button>
        <a-button
          :loading="isLoading"
          :disabled="isDisabledSub"
          v-if="submitButShow"
          type="primary"
          @click="submitAddHidden"
        >
          提交
        </a-button>
        <a-button v-if="cancelButShow" @click="cancelHidden"> 取消 </a-button>
      </div>
    </template>
  </a-modal>
</template>
<script>
import { companySelect } from "@/api/JSAAnalysis";
import { encode } from "@/api/dataDictionary";
import { updateYhzgKL } from "@/api/securityCheck";
import fileUpload from "@/components/upLoad/fileUpload";
import importConpontsData from "@/components/importConpontsData";
import StepsModel from "../../../equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  name: "securityCheckAddHiddenForm",
  components: { importConpontsData, StepsModel, fileUpload },
  props: ["securityCheck", "hiddenDangerVisible", "stateMonitor", "typeModel"],
  data() {
    return {
      isLoading: false,
      placeholder: "",
      inspectedUnitOptions: [],
      company: [], //外委单位下拉框
      departmentOption: [],
      isDisabledSub: false,
      formHiddenList: {
        hiddenDangerLocation: "",
        hazardCategory: undefined,
        hazardLevel: undefined,
        rectificationDutyCompany: undefined,
        rectificationDutyPerson: "",
        rectificationTimeLimit: "",
        hazardDescription: "",
        rectificationRequirements: "",
        findTime: "",
        rectificationSituation: "",
        rectificationSource: undefined,
        rectificationTime: "",
        rectificationUser: "",
        acceptedUser: "",
        describet: "",
        attID: [],
        attType: [],
      },
      hazardCategoryOption: [], //隐患类别下拉框
      inspectionCategoryOption: [], //检查类别下拉框
      checkMainBodyOption: [], //检查主体下拉框
      labelCol: { span: 9 },
      cancelButShow: false,
      saveButShow: false,
      submitButShow: false,
      seenApproval: true,
      isShowApproval:false,
      seen: true,
      isDisabledHidden: false,
      checkDisabled: false,
      editDisabled: false,
      hiddenFormRules: {
        hiddenDangerLocation: [
          { required: true, message: "请输入隐患地点", trigger: "blur" },
        ],
        hazardCategory: [
          { required: true, message: "请选择隐患类别", trigger: "change" },
        ],
        hazardLevel: [
          { required: true, message: "请选择隐患级别", trigger: "change" },
        ],
        rectificationDutyCompany: [
          { required: true, message: "请输入整改责任单位", trigger: "blur" },
        ],
        rectificationDutyPerson: [
          { required: true, message: "请输入整改责任人", trigger: "blur" },
        ],
        findTime: [
          { required: true, message: "请选择发现时间", trigger: "change" },
        ],
        rectificationTimeLimit: [
          { required: true, message: "请选择整改时限", trigger: "change" },
        ],
        hazardDescription: [
          { required: true, message: "请输入隐患描述", trigger: "blur" },
        ],
        rectificationRequirements: [
          { required: true, message: "请输入整改要求", trigger: "blur" },
        ],
        rectificationSituation: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        rectificationSource: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        rectificationTime: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        rectificationUser: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        acceptedUser: [{ required: true, message: "请输入", trigger: "blur" }],
        describet: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.encodeSelect();
    this.getOutsourceCompany();
  },
  created() { },
  watch: {
    hiddenDangerVisible: {
      handler(newName, oldName) {
        if (newName) {
          this.placeholder =
            this.$route.path == "/hiddenDangerManagement" ? "-" : "自动生成";
          let departmentOption = this.departmentOption.map((item) => {
            return { label: item.dictname, value: item.id };
          });
          this.inspectedUnitOptions = [...departmentOption, ...this.company];
          // form表单的数据传到隐患信息表格里
          let formKeyName = [
            "checkMainBody",
            "inspectedBy",
            "inspectedUnit",
            "inspectionCategory",
            "inspectionLevel",
            "inspectionName",
            "inspectionNo",
            "inspectionTimeStart",
            "inspectionTimeEnd",
            "attID",
            "attType",
            "rectificationTime"
          ];
          for (const key in this.securityCheck) {
            if (Object.hasOwnProperty.call(this.securityCheck, key)) {
              const element = this.securityCheck[key];
              if (formKeyName.includes(key)) {
                this.$set(this.formHiddenList, key, element);
                // this.formHiddenList[key] = element;
              }
            }
          }
          this.cancelButShow = false;
          this.saveButShow = false;
          this.submitButShow = false;
          this.seen = false;
          this.seenApproval = false;
          this.checkDisabled = false;
          this.editDisabled = false;
          this.isShowApproval = false
          // 按钮权限
          switch (this.stateMonitor) {
            case "add":
              this.cancelButShow = true;
              this.seen = false;
              this.saveButShow = true;
              this.isDisabledHidden = false;
              break;
            case "editYH":
              this.cancelButShow = true;
              this.seen = false;
              this.saveButShow = true;
              this.isDisabledHidden = false;
              break;
            case "edit":
              this.saveButShow = true;
              this.seen = true;
              this.submitButShow = true;
              this.editDisabled = true;
              this.isDisabledHidden = true;
              break;
            case "YS":
              this.seen = true;
              this.isDisabledHidden = true;
              this.seenApproval = true;
              this.checkDisabled = true;
              this.isShowApproval = true
              break;
            case "check":
              this.seen = true;
              this.isDisabledHidden = true;
              this.seenApproval = true;
              this.checkDisabled = true;
              this.isShowApproval = false
              break;
            case "hiddenDangerAdd":
              this.cancelButShow = true;
              this.saveButShow = true;
              this.submitButShow = true;
              break;
            case "hiddenDangerEdit":
              this.cancelButShow = true;
              this.saveButShow = true;
              this.submitButShow = true;
              break;
            case "hiddenDangerCheck":
              this.seen = true;
              this.checkDisabled = true;
              // this.cancelButShow = true;
              this.seenApproval = true;
              this.isShowApproval = false
              break;
            case "hiddenDangerRectification":
              this.seen = true;
              this.checkDisabled = true;
              this.cancelButShow = true;
              this.saveButShow = true;
              this.submitButShow = true;
              break;
          }
        } else {
          if (this.$refs.importConpontsDataRef) {
            this.$refs.importConpontsDataRef.removeFile();
          }
          if (this.$refs.fileUploadPicRef) {
            this.$refs.fileUploadPicRef.removeFile();
          }
        }
      },
    },
    formHiddenList: {
      handler(newVal, oldVal) {
        if (newVal.rectificationSituation == "未完成整改") {
          this.isDisabledSub = true;
        } else {
          this.isDisabledSub = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    formListAfterClose() {
      this.formHiddenList = {
        hiddenDangerLocation: "",
        hazardCategory: undefined,
        hazardLevel: undefined,
        rectificationDutyCompany: undefined,
        rectificationDutyPerson: "",
        rectificationTimeLimit: "",
        hazardDescription: "",
        rectificationRequirements: "",
        findTime: "",
        rectificationSituation: "",
        rectificationSource: undefined,
        rectificationTime: "",
        rectificationUser: "",
        acceptedUser: "",
        describet: "",
        attID: [],
        attType: [],
      };
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      if (this.$refs.fileUploadPicRef) {
        this.$refs.fileUploadPicRef.removeFile();
      }
      this.$refs.hiddenFormRef.clearValidate();
      if (this.typeModel.type === "YS") {
        // this.$refs.stepsModel.form = {};
      }
    },
    getPopupContainer() {
      return document.querySelector(".position-hidden-form");
    },
    getOutsourceCompany() {
      companySelect().then((res) => {
        // this.company = res.body
        res.body.forEach((item) => {
          this.company.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          });
        });
      });
    },
    passClick() {
      this.$emit(
        "pass",
        {
          type: this.$refs.stepsModel.form.type,
          opinion: this.$refs.stepsModel.form.opinion,
          id:
            this.$route.path == "/hiddenDangerManagement"
              ? this.formHiddenList.iD
              : this.formHiddenList.yhzgID,
          getListId: this.formHiddenList.iD,
          // recordStatus:this.formHiddenList.recordStatus
        },
        (res) => {
          this.$emit("close");
          // this.formClose();
          //回调函数的方法体.处理自己的业务.
        }
      );
    },
    // 获取数据字典列表
    encodeSelect() {
      // 隐患类别
      encode("AQHB-YHLB").then((res) => {
        this.hazardCategoryOption = res.body.data;
      });
      // 检查部门
      encode("LBSQ_SSBM").then((res) => {
        if (res.code == 200) {
          this.departmentOption = res.body.data;
        }
      });
    },
    cancelHidden() {
      this.formClose();
    },
    saveHidden() {
      if (this.cancelButShow && this.saveButShow) {
        this.onSubmit("addSave");
      } else if (this.submitButShow && this.saveButShow) {
        this.onSubmit("zgSave");
      } else if (this.submitButShow && this.saveButShow && this.cancelButShow) {
        this.onSubmit("save");
      }
    },
    submitAddHidden() {
      if (this.cancelButShow && this.saveButShow) {
        this.onSubmit("addSubmit");
      } else if (this.submitButShow && this.saveButShow) {
        this.onSubmit("ysSubmit");
      }
    },

    onSubmit(val) {
      this.$refs.hiddenFormRef.validate((valid) => {
        if (valid) {
          if (this.formHiddenList.attID == undefined) {
            this.$message.warning("未上传隐患照片");
            return false;
          } else {
            // 隐患新增保存按钮
            if (val == "addSave") {
              this.$emit(
                "saveHiddenDanger",
                this.formHiddenList,
                this.stateMonitor
              );
              this.formClose();
            } else if (val == "save") {
              this.$emit(
                "saveHiddenDanger",
                this.formHiddenList,
                this.stateMonitor
              );
              this.formClose();
            } else if (val == "zgSave") {
              if (this.formHiddenList.attType == undefined) {
                this.$message.warning("未上传整改完成后照片");
                return false;
              } else {
                let dataFormYhzg = this.$lodash.cloneDeep(this.formHiddenList);
                if (this.$route.path == "/hiddenDangerManagement") {
                  if (this.formHiddenList.id == undefined) {
                    dataFormYhzg.id = this.formHiddenList.iD;
                  }
                } else {
                  dataFormYhzg.id = this.formHiddenList.yhzgID;
                }
                if (dataFormYhzg.isNotice == true) {
                  dataFormYhzg.isNotice = 1;
                } else {
                  dataFormYhzg.isNotice = 0;
                }
                if (dataFormYhzg.isRisk == true) {
                  dataFormYhzg.isRisk = 1;
                } else {
                  dataFormYhzg.isRisk = 0;
                }
                if (dataFormYhzg.deleteFlg == true) {
                  dataFormYhzg.deleteFlg = 1;
                } else {
                  dataFormYhzg.deleteFlg = 0;
                }
                this.isLoading = true;
                dataFormYhzg.attID = this.$fileUploadJSON.toJsonString(
                  dataFormYhzg.attID
                );
                dataFormYhzg.attType = this.$fileUploadJSON.toJsonString(
                  dataFormYhzg.attType
                );
                updateYhzgKL(dataFormYhzg).then((res) => {
                  if (res.code == "200") {
                    this.$message.success("保存成功");
                    this.isLoading = false;
                    let data = this.formHiddenList;
                    this.$emit("saveHiddenDanger", data, this.stateMonitor);
                    this.formClose();
                  }
                });
              }
            } else if (val == "addSubmit") {
              let data = this.formHiddenList;
              data.recordStatus = "2";
              this.$emit("saveHiddenDanger", data, this.stateMonitor);
              this.formClose();
            } else if (val == "ysSubmit") {
              if (this.formHiddenList.attType == undefined) {
                this.$message.warning("未上传整改完成后照片");
                return false;
              }
              let dataFormYhzg = this.$lodash.cloneDeep(this.formHiddenList);
              dataFormYhzg.identifyFields = "Y";
              if (this.$route.path == "/hiddenDangerManagement") {
                if (this.formHiddenList.id == undefined) {
                  dataFormYhzg.id = this.formHiddenList.iD;
                }
              } else {
                dataFormYhzg.id = this.formHiddenList.yhzgID;
              }
              if (dataFormYhzg.isNotice == true) {
                dataFormYhzg.isNotice = 1;
              } else {
                dataFormYhzg.isNotice = 0;
              }
              if (dataFormYhzg.isRisk == true) {
                dataFormYhzg.isRisk = 1;
              } else {
                dataFormYhzg.isRisk = 0;
              }
              if (dataFormYhzg.deleteFlg == true) {
                dataFormYhzg.deleteFlg = 1;
              } else {
                dataFormYhzg.deleteFlg = 0;
              }
              this.isLoading = true;
              dataFormYhzg.attID = this.$fileUploadJSON.toJsonString(
                dataFormYhzg.attID
              );
              dataFormYhzg.attType = this.$fileUploadJSON.toJsonString(
                dataFormYhzg.attType
              );
              updateYhzgKL(dataFormYhzg)
                .then((res) => {
                  this.isLoading = false;
                  if (res.code == "200") {
                    let data = this.formHiddenList;
                    if (this.$route.path != "/hiddenDangerManagement") {
                      this.$emit("saveHiddenDanger", data, this.stateMonitor);
                    } else {
                      this.$emit("getYhzgMainList");
                    }
                    this.formClose();
                    this.$message.success("提交成功");
                    this.$emit("submit", data);
                  }
                })
                .catch(() => {
                  this.isLoading = false;
                });
            }
          }
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    formClose() {
      this.$emit("close");
    },
    flieListChange(val) {
      this.formHiddenList.attID = val;
    },
    flieChangeCheck(val) {
      this.formHiddenList.attType = val;
    },
    //日期的
    onChange(date, dateString) { },
  },
};
</script>
<style scoped lang="less">
.line {
  width: 100%;
  display: inline-block;
  border-top: 2px #f3f3f4 solid;
  align-items: center;
  padding-top: 10px;
}
.form_item_description {
  ::v-deep .ant-form-item-label {
    width: 123px;
    label {
    }
  }
  ::v-deep {
    .ant-form-item-control-wrapper {
      width: calc(100% -123px);
    }
  }
}
.operate_button {
  text-align: center;
  margin-top: 20px;
}
</style>
