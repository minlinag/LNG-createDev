<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model
        ref="ruleReleaseForm"
        :model="addForm"
        style="font-size: 16px; width: 100%"
      >
        <a-row class="out-form-class">
          <a-col :span="8">
            <a-form-model-item label="申请人">
              <a-input
                placeholder="自动带出(当前用户)"
                v-model="addForm.applyName"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="申请时间">
              <a-input
                placeholder="自动带出(系统时间)"
                v-model="addForm.applyTime"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="编号">
              <a-input
                placeholder="自动生成"
                v-model="addForm.numbers"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="add-form-model10">
            <a-form-model-item label="是否在账设备" prop="eqmWhetherInAccount">
              <a-select
                show-search
                placeholder="请选择"
                v-model="addForm.eqmWhetherInAccount"
                :options="isRepair"
                disabled
              >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              prop="eqmName"
              label="设备名称"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model.trim="addForm.eqmName"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="insert-but">
            <a-form-model-item
              label="工艺位号"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model.trim="addForm.eqmNo"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="操作性质" prop="natureOperation">
              <a-radio-group
                v-model="addForm.natureOperation"
                :default-value="1"
                disabled
              >
                <a-radio :value="'停电'"> 停电 </a-radio>
                <a-radio :value="'送电'"> 送电 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="申请理由" prop="applyReason">
              <a-input
                v-model="addForm.applyReason"
                :auto-size="{ minRows: 6, maxRows: 6 }"
                type="textarea"
                placeholder="请输入"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div>
          <stepsModel
            @approvalMethod="approvalMethod"
            :id="this.addForm.id"
            ref="stepsModel"
            :isShow="true"
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
  findAllList,
  applyAudio,
} from "@/api/transformerSubstation/stopPowerTransmission";
export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      addForm: {
        applyName: "",
        // applyTime: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        applyTime: "",
        numbers: "",
        eqmWhetherInAccount: "",
        eqmName: "",
        eqmNo: "",
        natureOperation: "",
        applyReason: "",
        whetherExecuteEnd: "",
        executeName: "",
        executeTime: "",
        remark: "",
        confirmName: "",
        // confirmTime: this.getUploadTime(),
        confirmTime: "",
        lockNumber: "",
      },
      id: "",
      // 是否维修//是否在账
      isRepair: [
        { value: "是", label: "是" },
        { value: "否", label: "否" },
      ],
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
        id: this.addForm.id,
      }).then((res) => {
        if (res.body == "true") {
          this.cancelClick();
          this.$message.success("完成审核");
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
      findAllList({ id: value }).then((res) => {
        this.addForm = res.body.data[0];
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
