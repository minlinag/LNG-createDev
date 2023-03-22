<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model
        ref="ruleReleaseForm"
        :model="addReleaseForm"
        style="font-size: 16px; width: 100%"
      >
        <a-row class="out-form-class">
          <a-col :span="8">
            <a-form-model-item label="序号">
              <a-input
                placeholder="自动生成"
                v-model="addReleaseForm.numbers"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="申请人">
              <a-input
                placeholder="自动带出(当前用户)"
                v-model="addReleaseForm.createdUser"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="申请时间">
              <a-input
                placeholder="自动带出(系统时间)"
                v-model="addReleaseForm.createdDateTime"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="联锁分级">
              <a-select
                v-model="addReleaseForm.interlockLevel"
                placeholder="自动带出"
                :options="interlockLevelOptions"
                disabled
                @change="levelChange('interlockLevel')"
              >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="联锁号" prop="interlockNo">
              <a-select
                v-model="addReleaseForm.interlockNo"
                show-search
                placeholder="请选择"
                option-filter-prop="children"
                :options="interlockNoOption"
                @change="formListChange('interlockNo')"
                disabled
              >
                <a-select-option
                  v-for="item in interlockNoOption"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="联锁描述">
              <a-input
                placeholder="根据联锁号，自动带出"
                v-model="addReleaseForm.interlockDescription"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="设定值">
              <a-input
                :placeholder="
                  this.$route.path == '/chainManagementAccount'
                    ? '请输入'
                    : '自动带出'
                "
                v-model="addReleaseForm.setValue"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="8"
            v-if="this.$route.path == '/chainReleaseApplication'"
          >
            <a-form-model-item
              label="计划解除时间"
              required
              prop="planRelieveTime"
            >
              <a-date-picker
                style="min-width: auto"
                show-time
                v-model="addReleaseForm.planRelieveTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                type="date"
                :placeholder="
                  this.$route.path == '/interlockRecoveryApplication'
                    ? '自动带出'
                    : '请输入'
                "
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-else>
            <a-form-model-item label="解除时间" prop="relieveTime">
              <a-date-picker
                style="min-width: auto"
                show-time
                v-model="addReleaseForm.relieveTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                type="date"
                :placeholder="
                  this.$route.path == '/interlockRecoveryApplication'
                    ? '自动带出'
                    : '请输入'
                "
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="计划恢复时间" prop="planRecoverTime">
              <a-date-picker
                style="min-width: auto"
                show-time
                v-model="addReleaseForm.planRecoverTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                type="date"
                :placeholder="
                  this.$route.path == '/interlockRecoveryApplication'
                    ? '自动带出'
                    : '请输入'
                "
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="原因"
              prop="reason"
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                :auto-size="{ minRows: 6, maxRows: 6 }"
                type="textarea"
                v-model="addReleaseForm.reason"
                :placeholder="
                  this.$route.path == '/interlockRecoveryApplication'
                    ? '自动带出'
                    : '请输入'
                "
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="工艺影响(危害)"
              prop="craftInfluence"
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                :auto-size="{ minRows: 6, maxRows: 6 }"
                type="textarea"
                v-model="addReleaseForm.craftInfluence"
                :placeholder="
                  this.$route.path == '/interlockRecoveryApplication'
                    ? '自动带出'
                    : '请输入'
                "
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :label="
                this.$route.path == '/chainReleaseApplication'
                  ? '工艺管理措施'
                  : '恢复安全措施'
              "
              prop="processManageStep"
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                :auto-size="{ minRows: 6, maxRows: 6 }"
                type="textarea"
                v-model="addReleaseForm.processManageStep"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="备注"
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                :auto-size="{ minRows: 6, maxRows: 6 }"
                type="textarea"
                v-model="addReleaseForm.remark"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" class="a_col_style">
            <a-form-model-item
              :label="
                this.$route.path == '/chainReleaseApplication'
                  ? '根据运行需要，本人申请对该联锁进行解除'
                  : '根据运行需要，本人申请对该联锁进行恢复'
              "
              prop="whetherExecutorButton"
              :labelCol="{ style: 'width: 800px' }"
            >
              <a-radio-group v-model="addReleaseForm.whetherExecutorButton">
                <a-radio value="1" disabled></a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div>
          <stepsModel
            ref="stepsModel"
            :isShow="true"
            :id="this.addReleaseForm.id"
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
import {
  queryByID,
  applyAudio,
} from "@/api/chainManagement/chainReleaseApplication";
export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      interlockLevelOptions: [
        { value: "1", label: "一级" },
        { value: "2", label: "二级" },
        { value: "3", label: "三级" },
      ],
      interlockNoOption: [],
      addReleaseForm: {
        createdUser: "",
        createdDateTime: "",
        executorCreateTime: "",
        confirmCreateTime: "",
        numbers: "",
        interlockNo: undefined,
        interlockLevel: undefined,
        interlockDescription: "",
        setValue: "",
        planRelieveTime: "",
        planRecoverTime: "",
        reason: "",
        craftInfluence: "",
        remark: "",
        processManageStep: "",
        executorName: "",
        whetherExecutorButton: "",
        executorTime: "",
        whetherExecutor: "1",
        executorOpinion: "",
        confirmName: "",
        whetherConfirm: "1",
        confirmTime: "",
        whetherConfirmButton: "",
        confirmOpinion: "",
        executorName: "",
      },
      id: "",
      confirmShow: false,
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
  mounted() {},
  methods: {
    cancelClick() {
      this.$router.go(-1);
    },
    approvalMethod(type) {
      applyAudio({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.addReleaseForm.id,
      }).then((res) => {
        if (res.body == "true") {
          this.$message.success("完成审核");
          this.cancelClick()
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
      queryByID({ id: value }).then((res) => {
        this.addReleaseForm = res.body;
        if (this.addReleaseForm.interlockLevel == 1) {
          this.addReleaseForm.interlockLevel = "一级";
        } else if (this.addReleaseForm.interlockLevel == 2) {
          this.addReleaseForm.interlockLevel = "二级";
        } else if (this.addReleaseForm.interlockLevel == 3) {
          this.addReleaseForm.interlockLevel = "三级";
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
::v-deep.a-style {
  display: flex;
  width: 100%;
  .a {
    width: 500px;
  }
  font-size: 16px;
}
.ant-modal-footer {
  text-align: center !important;
}
</style>
