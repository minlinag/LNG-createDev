<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model
        :model="toExamine"
        ref="securityCheckFormRef"
        id="addContent"
      >
        <!--申请信息-->
        <a-divider orientation="left">申请信息</a-divider>
        <a-row>
          <a-col :span="8">
            <a-form-model-item
              label="编号："
              :labelCol="{ style: 'width: 150px' }"
            >
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
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-date-picker
                disabled
                v-model="toExamine.planAnalyseTime"
                valueFormat="YYYY-MM-DD"
                placeholder="请选择日期"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="取样点："
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-input
                disabled
                v-model="toExamine.samplingSpot"
                placeholder="请输入取样点"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="检验样品："
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-input
                disabled
                v-model="toExamine.analyseSample"
                placeholder="请输入检验样品"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="分析项目："
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-input
                disabled
                v-model="toExamine.analyseProject"
                placeholder="请输入分析项目"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item
              label="指标要求："
              :labelCol="{ style: 'width: 115px' }"
            >
              <a-textarea
                disabled
                :auto-size="{ minRows: 4, maxRows: 7 }"
                v-model="toExamine.standardRequire"
                placeholder="请输入指标要求"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="申请时间："
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-input disabled v-model="toExamine.applyTime" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="申请人："
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-input
                disabled
                v-model="toExamine.applyEmp"
                placeholder="请输入申请人"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              label="申请部门："
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-input
                disabled
                v-model="toExamine.applyDept"
                placeholder="请输入申请部门"
              />
            </a-form-model-item>
          </a-col>
        </a-row>

        <template v-if="toExamine.uploadEmp != null">
          <a-divider orientation="left">检验报告</a-divider>
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                style="float: left"
                label="检验报告附件："
                :labelCol="{ style: 'width: 165px' }"
              >
                <file-upload
                  :Text="'上传文件'"
                  @fileChange="fileListChange"
                  :echoList="fileList"
                  ref="importConpontsDataRef"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="上传人："
                :labelCol="{ style: 'width: 150px' }"
              >
                <a-input
                  disabled
                  v-model="toExamine.uploadEmp"
                  placeholder="请输入上传人"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="上传时间："
                :labelCol="{ style: 'width: 150px' }"
              >
                <a-input
                  disabled
                  v-model="toExamine.uploadTime"
                  placeholder="请输入上传时间"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row
            v-if="toExamine.affirmEmp != null && toExamine.affirmTime != null"
          >
            <a-col :span="8">
              <a-form-model-item
                label="确认人："
                :labelCol="{ style: 'width: 150px' }"
              >
                <a-input disabled v-model="toExamine.affirmEmp" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="确认时间："
                :labelCol="{ style: 'width: 150px' }"
              >
                <a-input disabled v-model="toExamine.affirmTime" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <!--审批页签部分-->
        <stepsModel
          ref="stepsModel"
          :isShow="true"
          :id="toExamine.id"
          @approvalMethod="approvalMethod"
        />
        <div class="ant-modal-footer">
          <a-button type="primary" @click="agreeClick">同意</a-button>
          <a-button type="danger" @click="rejectClick">驳回</a-button>
          <a-button @click="cancelClick">返回</a-button>
        </div>
      </a-form-model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  monthPlanAudio,
  getById,
  affirm as confirm,
} from "@/api/meteringManagement/AnalysisManagement.js";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/components/approvalRecord/index.vue";
export default {
  components: {
    fileUpload: fileUpload,
    stepsModel,
  },
  data() {
    return {
      fileList: [],
      toExamine: { applyEmp: "" },
    };
  },
  watch: {
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
    // this.getListDetails("J17000000000023");
  },
  methods: {
    approvalMethod(type) {
      monthPlanAudio({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.toExamine.id,
      }).then((res) => {
        if (res.body == "true") {
          this.$message.success("完成审核");
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    rejectClick() {
      this.$refs.stepsModel.verificationChange("0");
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange("1");
    },
    cancelClick() {
      this.$router.go(-1);
    },

    //获得当前页面
    getListDetails(value) {
      getById(value).then((res) => {
        console.log("res", res);
        this.toExamine = res.body;
        if (this.toExamine.fileInfo) {
          if (this.toExamine.fileInfo.indexOf("“") > 0) {
            this.fileList = JSON.parse(
              this.chineseChar2englishChar(this.toExamine.fileInfo)
            );
          } else {
            if (this.toExamine.fileInfo) {
              this.fileList = JSON.parse(this.toExamine.fileInfo);
            }
          }
        }
      });
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

    fileListChange(val) {
      this.fileList = val;
    },
  },
};
</script>
<style scoped>
.ant-modal-footer {
  text-align: center !important;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout {
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
