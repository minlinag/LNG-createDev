<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model
        ref="ruleReleaseForm"
        :model="formHiddenList"
        style="font-size: 16px; width: 100%"
      >
        <a-row class="out-form-class">
          <div class="line">
            <a-col :span="8">
              <a-form-model-item label="隐患地点">
                <a-input
                  placeholder="请输入"
                  disabled
                  v-model="formHiddenList.hiddenDangerLocation"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-hidden-form">
              <a-form-model-item label="隐患类别">
                <a-select
                  v-model="formHiddenList.hazardCategory"
                  show-search
                  placeholder="请选择隐患类别"
                  option-filter-prop="children"
                  disabled
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
              <a-form-model-item label="隐患级别">
                <a-select
                  disabled
                  v-model="formHiddenList.hazardLevel"
                  placeholder="请选择隐患级别"
                >
                  <a-select-option value="一般隐患"> 一般隐患 </a-select-option>
                  <a-select-option value="重大隐患"> 重大隐患 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-hidden-form">
              <a-form-model-item label="整改责任单位">
                <a-select
                  :options="inspectedUnitOptions"
                  disabled
                  v-model="formHiddenList.rectificationDutyCompany"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="整改责任人">
                <a-input
                  disabled
                  placeholder="请输入"
                  v-model="formHiddenList.rectificationDutyPerson"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="发现时间">
                <a-input
                  disabled
                  placeholder="自动生成"
                  v-model="formHiddenList.inspectionTimeStart"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="整改时限">
                <a-input
                  disabled
                  placeholder="请选择整改时限"
                  v-model="formHiddenList.rectificationTimeLimit"
                />
              </a-form-model-item>
            </a-col>
          </div>
          <div class="line">
            <a-col :span="8">
              <a-form-model-item label="检查编号">
                <a-input
                  v-model="formHiddenList.inspectionNo"
                  placeholder="请输入"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="检查名称">
                <a-input
                  v-model="formHiddenList.inspectionName"
                  placeholder="请输入"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-hidden-form">
              <a-form-model-item label="检查级别">
                <a-input
                  v-model="formHiddenList.inspectionLevel"
                  placeholder="请输入"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-hidden-form">
              <a-form-model-item label="检查类别">
                <a-input
                  v-model="formHiddenList.inspectionCategory"
                  placeholder="请输入"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="检查时间">
                <a-input
                  v-model="formHiddenList.inspectionTimeStart"
                  placeholder="请输入"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8" class="position-hidden-form">
              <a-form-model-item label="检查主体">
                <a-input
                  v-model="formHiddenList.checkMainBody"
                  placeholder="请输入"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="检查人">
                <a-input
                  v-model="formHiddenList.inspectedBy"
                  placeholder="请输入"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="被检单位">
                <a-select
                  :options="inspectedUnitOptions"
                  v-model="formHiddenList.inspectedUnit"
                  placeholder="请输入"
                  disabled
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </div>
          <div class="line">
            <a-col :span="24">
              <a-form-model-item label="隐患描述">
                <a-textarea
                  disabled
                  placeholder="请输入"
                  v-model="formHiddenList.hazardDescription"
                  :auto-size="{ minRows: 6, maxRows: 6 }"
                >
                </a-textarea>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="整改要求">
                <a-textarea
                  disabled
                  placeholder="请输入"
                  v-model="formHiddenList.rectificationRequirements"
                  :auto-size="{ minRows: 6, maxRows: 6 }"
                >
                </a-textarea>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="隐患图片">
                <file-upload
                  :Text="'上传文件'"
                  :echoList="formHiddenList.attID"
                  disabled
                  ref="importConpontsDataRef"
                  :fileType="'jpg,png'"
                  :accept="'image/*'"
                ></file-upload>
              </a-form-model-item>
            </a-col>
          </div>
          <div class="line">
            <div class="step">
              <div>
                <div class="title">
                  <p style="margin-left: 18px; font-weight: 800">整改信息</p>
                </div>
                <a-col :span="24">
                  <a-form-model-item label="整改情况">
                    <a-radio-group
                      disabled
                      v-model="formHiddenList.rectificationSituation"
                    >
                      <a-radio value="已完成整改"> 已完成整改 </a-radio>
                      <a-radio value="未完成整改"> 未完成整改 </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8" class="position-hidden-form">
                  <a-form-model-item label="整改资金来源">
                    <a-select
                      v-model="formHiddenList.rectificationSource"
                      placeholder="请选择"
                      disabled
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
                  <a-form-model-item label="整改完成时间">
                    <a-input
                      v-model="formHiddenList.rectificationTime"
                      placeholder="请选择整改完成时间"
                      disabled
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="整改人">
                    <a-input
                      v-model="formHiddenList.rectificationUser"
                      placeholder="请输入"
                      disabled
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="验收人">
                    <a-input
                      v-model="formHiddenList.acceptedUser"
                      placeholder="请输入"
                      disabled
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="整改完成后照片">
                    <file-upload
                      :Text="'上传文件'"
                      :echoList="formHiddenList.attType"
                      disabled
                      ref="fileUploadPicRef"
                      :fileType="'jpg,png'"
                      :accept="'image/*'"
                    ></file-upload>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="整改完成情况描述">
                    <a-textarea
                      v-model="formHiddenList.describet"
                      placeholder="请输入"
                      disabled
                      :auto-size="{ minRows: 6, maxRows: 6 }"
                    >
                    </a-textarea>
                  </a-form-model-item>
                </a-col>
              </div>
            </div>
          </div>
        </a-row>
        <div>
          <stepsModel
            ref="stepsModel"
            :isShow="true"
            :id="this.formHiddenList.ID"
            @approvalMethod="approvalMethod"
          />
        </div>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button type="primary" @click="agreeClick">同意</a-button>
        <a-button type="danger" @click="rejectClick">驳回</a-button>
        <a-button @click="cancelClick">返回</a-button>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import stepsModel from "@/components/approvalRecord/index.vue";
import fileUpload from "@/components/upLoad/fileUpload";
import { getYhzgYSForPage } from "@/api/treatmentHiddenDanger/treatmentHiddenDanger";
import { aqjcAudio } from "@/api/securityCheck";
import { companySelect } from "@/api/JSAAnalysis";
import { filterTime } from "@/utils/utils";
import { encode } from "@/api/dataDictionary";
export default {
  components: {
    stepsModel,
    fileUpload,
  },
  data() {
    return {
      formHiddenList: {
        hiddenDangerLocation: "",
        hazardCategory: "",
        hazardLevel: "",
        rectificationDutyCompany: "",
        rectificationDutyPerson: "",
        rectificationTimeLimit: "",
        hazardDescription: "",
        rectificationRequirements: "",
        findTime: "",
        rectificationSituation: "",
        rectificationSource: "",
        rectificationTime: "",
        rectificationUser: "",
        acceptedUser: "",
        describet: "",
        attID: [],
        attType: [],
      },
      inspectedUnitOptions: [],
      hazardCategoryOption: [], //隐患类别下拉框
      inspectedUnitOptions: [],
      company: [], //外委单位下拉框
      departmentOption: [],
      id: "",
    };
  },
  watch: {
    //监听路由地址的改变
    $route: {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          //需要监听的参数
          this.id = this.$route.query.id;
          this.getListDetails(this.id);
        }
      },
    },
  },
  mounted() {
    this.getAsyncData();
  },
  methods: {
    cancelClick() {
      this.$router.go(-1);
    },
    approvalMethod(type) {
      aqjcAudio({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.formHiddenList.ID,
      }).then((res) => {
        if (res.body == "true") {
          this.$message.success("完成审核");
          this.cancelClick();
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    rejectClick() {
      // this.approvalMethod(2);
      this.$refs.stepsModel.verificationChange("0");
    },
    agreeClick() {
      // this.$refs.reviewRef.agree();
      this.$refs.stepsModel.verificationChange("1");
      // this.approvalMethod(1);
    },
    getListDetails(value) {
      getYhzgYSForPage({ id: value }).then((res) => {
        this.formHiddenList = res.body[0];
        this.formHiddenList.checkMainBody = res.body[0].CheckMainBody;
        this.formHiddenList.hiddenDangerLocation =
          res.body[0].HiddenDangerLocation;
        this.formHiddenList.hazardCategory = res.body[0].HazardCategory;
        this.formHiddenList.hazardLevel = res.body[0].HazardLevel;
        this.formHiddenList.rectificationDutyCompany =
          res.body[0].RectificationDutyCompany;
        this.formHiddenList.rectificationDutyPerson =
          res.body[0].RectificationDutyPerson;
        this.formHiddenList.inspectionTimeStart = filterTime(
          res.body[0].InspectionTimeStart
        );
        this.formHiddenList.rectificationTimeLimit = filterTime(
          res.body[0].RectificationTimeLimit
        );
        this.formHiddenList.inspectionNo = res.body[0].InspectionNo;
        this.formHiddenList.hazardDescription = res.body[0].HazardDescription;
        this.formHiddenList.rectificationSituation =
          res.body[0].RectificationSituation;
        this.formHiddenList.rectificationSource =
          res.body[0].RectificationSource;
        this.formHiddenList.rectificationTime = filterTime(
          res.body[0].RectificationTime
        );
        this.formHiddenList.rectificationUser = res.body[0].RectificationUser;
        this.formHiddenList.acceptedUser = res.body[0].AcceptedUser;
        this.formHiddenList.describet = res.body[0].Describet;
        this.formHiddenList.inspectionNo = res.body[0].InspectionNo;
        this.formHiddenList.inspectionName = res.body[0].InspectionName;
        this.formHiddenList.inspectionLevel = res.body[0].InspectionLevel;
        this.formHiddenList.inspectionCategory = res.body[0].InspectionCategory;
        this.formHiddenList.checkMainBody = res.body[0].CheckMainBody;
        this.formHiddenList.inspectedBy = res.body[0].InspectedBy;
        this.formHiddenList.inspectedUnit = res.body[0].InspectedUnit;
      });
    },
    async getAsyncData() {
      await this.getOutsourceCompany();
      await this.encodeSelect();
      let departmentOption = await this.departmentOption.map((item) => {
        return { label: item.dictname, value: item.id };
      });
      this.inspectedUnitOptions = await [...departmentOption, ...this.company];
    },
    async getOutsourceCompany() {
      await companySelect().then((res) => {
        res.body.forEach((item) => {
          this.company.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          });
        });
      });
    },
    // 获取数据字典列表
    async encodeSelect() {
      // 检查主体
      encode("AQHB-JCZT").then((res) => {
        this.checkMainBodyOption = res.body.data;
      });
      // 检查类别
      encode("AQHB-JCLB").then((res) => {
        this.inspectionCategoryOption = res.body.data;
      });
      // 检查部门
      await encode("LBSQ_SSBM").then((res) => {
        if (res.code == 200) {
          this.departmentOption = res.body.data;
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
::v-deep.out-form-class {
  width: 100%;
}
::v-deep.ant-row {
  .ant-form-item-label {
    overflow: unset;
    width: 120px !important;
    label {
      text-align: left;
      line-height: 15px;
      padding-right: 5px;
      width: 120px !important;
      white-space: pre-wrap;
      min-height: 40px;
      display: flex;
      justify-content: right;
      align-items: center;
    }
  }
}
.a_col_style {
  ::v-deep .ant-row {
    .ant-form-item-label {
      width: 302px !important;
      label {
        width: 302px !important;
      }
    }
  }
}
.ant-modal-footer {
  text-align: center !important;
}
</style>
