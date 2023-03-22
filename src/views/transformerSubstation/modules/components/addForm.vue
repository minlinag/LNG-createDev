<template>
  <a-modal
    :visible="addVisible"
    :footer="null"
    @cancel="handleCancel"
    :title="addTitle"
    class="from-style bigModel"
    :after-close="addReleaseFormClose"
    :maskClosable="false"
    destroyOnClose
    id="printContent"
  >
    <a-form-model ref="ruleReleaseForm" :model="addForm" :rules="releaseRules">
      <a-row>
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
              :getCalendarContainer="getPopupContainer"
              :disabled="
                typeModel == 'confirm' ||
                typeModel == 'view' ||
                typeModel == 'approval'
              "
            >
            </a-select>
          </a-form-model-item>
        </a-col>
        <div class="buttonInput">
          <a-col :span="addForm.eqmWhetherInAccount === '是' ? 6 : 8">
            <a-form-model-item
              prop="eqmName"
              label="设备名称"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model.trim="addForm.eqmName"
                placeholder="请选择"
                :disabled="
                  addForm.eqmWhetherInAccount === '是'
                    ? true
                    : false ||
                      typeModel == 'view' ||
                      typeModel == 'confirm' ||
                      typeModel == 'approval'
                "
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="2" v-if="addForm.eqmWhetherInAccount === '是'">
            <a-form-model-item>
              <a-button
                type="primary"
                @click="equipmentVisible = true"
                :disabled="
                  typeModel == 'confirm' ||
                  typeModel == 'view' ||
                  typeModel == 'approval'
                "
                >选择</a-button
              >
            </a-form-model-item>
          </a-col>
        </div>
        <a-col :span="8" class="insert-but">
          <a-form-model-item
            label="工艺位号"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              v-model.trim="addForm.eqmNo"
              placeholder="请选择"
              :disabled="
                addForm.eqmWhetherInAccount === '是'
                  ? true
                  : false ||
                    typeModel == 'view' ||
                    typeModel == 'confirm' ||
                    typeModel == 'approval'
              "
            ></a-input>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="1">
          <a-form-model-item>
            <a-icon type="plus-circle" @click="addNewName" />
          </a-form-model-item>
        </a-col> -->
        <a-col :span="8" v-if="this.$route.path == '/stopPowerTransmission'">
          <a-form-model-item label="操作性质" prop="natureOperation">
            <a-radio-group
              v-model="addForm.natureOperation"
              :default-value="1"
              :disabled="
                typeModel == 'confirm' ||
                typeModel == 'view' ||
                typeModel == 'approval'
              "
            >
              <a-radio :value="'停电'"> 停电 </a-radio>
              <a-radio :value="'送电'"> 送电 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-else="this.$route.path == '/lockUnlockApplication'">
          <a-form-model-item label="操作性质" prop="natureOperation">
            <a-radio-group
              v-model="addForm.natureOperation"
              :default-value="1"
              :disabled="
                typeModel == 'confirm' ||
                typeModel == 'view' ||
                typeModel == 'approval'
              "
            >
              <a-radio :value="'停电并上锁'"> 停电并上锁 </a-radio>
              <a-radio :value="'解锁并送电'"> 解锁并送电 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="this.$route.path == '/lockUnlockApplication'">
          <a-form-model-item label="锁具编号" prop="lockNumber">
            <a-input
              v-model="addForm.lockNumber"
              placeholder="请输入"
              :disabled="
                typeModel == 'confirm' ||
                typeModel == 'view' ||
                typeModel == 'approval'
              "
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="申请理由" prop="applyReason">
            <a-input
              v-model="addForm.applyReason"
              :auto-size="{ minRows: 6, maxRows: 6 }"
              type="textarea"
              placeholder="请输入"
              :disabled="
                typeModel == 'confirm' ||
                typeModel == 'view' ||
                typeModel == 'approval'
              "
            ></a-input>
          </a-form-model-item>
        </a-col>
        <!--确认情况-->
        <div v-if="confirmShow">
          <a-divider orientation="left">执行情况确认</a-divider>
          <!--确认情况表单-->
          <a-col :span="8">
            <a-form-model-item label="编号">
              <a-input
                v-model="addForm.numbers"
                disabled
                placeholder="自动带入"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="确认人">
              <a-input
                v-model="addForm.confirmName"
                disabled
                placeholder="自动带入"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="确认时间">
              <a-date-picker
                disabled
                placeholder="自动带入"
                v-model="addForm.confirmTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                type="date"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="是否执行完毕" prop="whetherExecuteEnd">
              <a-radio-group
                :options="isRepair"
                v-model="addForm.whetherExecuteEnd"
                @change="executeCompleteYNChange"
                :disabled="typeModel == 'view'"
                :default-value="'是'"
              >
                <a-radio :value="'是'"> 是 </a-radio>
                <a-radio :value="'否'"> 否 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-show="completeFromVisible">
            <a-form-model-item
              label="执行人"
              :prop="addForm.whetherExecuteEnd == '否' ? ' ' : 'executeName'"
            >
              <a-input
                v-model="addForm.executeName"
                :auto-size="{ minRows: 6, maxRows: 6 }"
                :disabled="typeModel == 'view'"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="8"
            v-show="completeFromVisible"
            class="add-form-model10"
          >
            <a-form-model-item
              label="执行时间"
              :prop="addForm.whetherExecuteEnd == '否' ? ' ' : 'executeTime'"
            >
              <a-date-picker
                style="min-width: auto"
                show-time
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请输入"
                v-model="addForm.executeTime"
                :disabled="typeModel == 'view'"
                :disabled-date="executorDisabledDate"
                :disabled-time="executorDisabledDateTime"
                :getCalendarContainer="getPopupContainer"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="备注"
              :prop="addForm.whetherExecuteEnd == '是' ? 'a' : 'remark'"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-textarea
                placeholder="请输入"
                v-model="addForm.remark"
                :auto-size="{ minRows: 6, maxRows: 6 }"
                :disabled="typeModel == 'view'"
              />
            </a-form-model-item>
          </a-col>
        </div>
      </a-row>
      <!-- <div>
        <stepsModel
          ref="stepsModel"
          :isShow="typeModel === 'approval' ? true : false"
          :id="this.addForm.numbers"
        />
      </div> -->
      <div class="form_piece_title" v-if="isShowStep">
        <span>审批记录</span>
      </div>
      <div>
        <stepsModel
          @approvalMethod="approvalMethod"
          v-if="isShowStep"
          :id="this.addForm.id"
          ref="stepsModel"
          :isShow="typeModel === 'approval' ? true : false"
        />
      </div>
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button
        type="primary"
        @click="saveAddForm('saveClick')"
        v-if="saveClick"
      >
        保存
      </a-button>
      <a-popconfirm
        title="是否打印当前页面数据?"
        @confirm="handleOk(true)"
        @cancel="handleOk(false)"
      >
        <a-button type="primary" v-if="submitClick"> 提交 </a-button>
      </a-popconfirm>
      <a-button type="primary" @click="agreeClick" v-if="isShowStepBtn"
        >同意</a-button
      >
      <a-button type="danger" @click="rejectClick" v-if="isShowStepBtn"
        >驳回</a-button
      >
      <!-- 确认 -->
      <a-button type="primary" @click="confirmClick" v-if="confirmShowButton">
        确认
      </a-button>
      <a-button type="primary" @click="print()" v-if="typeModel == 'view'">
        打印
      </a-button>
      <a-button @click="cancelClickForm" v-if="cancelClick"> 取消 </a-button>
    </div>
    <equipmentModel
      ref="equipmentModel"
      :equipmentVisible.sync="equipmentVisible"
      @selectedClic="selectedClic"
    />
  </a-modal>
</template>
<script>
import { getTwoNumber } from "@/api/transformerSubstation/lockUnlockApplication";
import { generateNumber } from "@/api/transformerSubstation/stopPowerTransmission";
import equipmentModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue";
import moment from "moment";
import stepsModel from "@/components/approvalRecord/index.vue";
// import stepsModel from "../../../equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  name: "",
  components: { stepsModel, equipmentModel },
  props: ["addVisible", "addTitle", "typeModel", "stateMonitor", "status"],
  filters: {},
  data() {
    return {
      // 是否维修//是否在账
      isRepair: [
        { value: "是", label: "是" },
        { value: "否", label: "否" },
      ],
      isShowStepBtn: false,
      confirmShow: false,
      equipmentVisible: false,
      saveClick: true,
      submitClick: true,
      cancelClick: true,
      completeFromVisible: true,
      confirmShowButton: false,
      addForm: {
        applyName: this.$store.state.user.name,
        // applyTime: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        applyTime: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numbers: "",
        eqmWhetherInAccount: "",
        eqmName: "",
        eqmNo: "",
        natureOperation: "",
        applyReason: "",
        whetherExecuteEnd: "是",
        executeName: "",
        executeTime: "",
        remark: "",
        confirmName: "",
        // confirmTime: this.getUploadTime(),
        confirmTime: "",
        lockNumber: "",
      },
      releaseRules: {
        eqmWhetherInAccount: [
          { required: true, message: "请选择是否在账设备 ", trigger: "change" },
        ],
        eqmName: [{ required: true, message: "请输入", trigger: "blur" }],
        eqmNo: [{ required: true, message: "请输入", trigger: "blur" }],
        applyReason: [{ required: true, message: "请输入", trigger: "blur" }],
        natureOperation: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        whetherExecuteEnd: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        executeName: [{ required: true, message: "请输入", trigger: "blur" }],
        remark: [{ required: true, message: "请输入", trigger: "blur" }],
        lockNumber: [{ required: true, message: "请输入", trigger: "blur" }],
        applyReason: [{ required: true, message: "请输入", trigger: "blur" }],
        executeTime: [{ required: true, message: "请选择", trigger: "change" }],
      },
      isShowStep: false,
    };
  },
  watch: {
    addVisible: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.isShowStep = false;
          this.confirmShow = false;
          this.completeFromVisible = true;
          this.isShowStepBtn = false;
          this.submitClick = false;
          this.saveClick = false;
          this.confirmShowButton = false;
          switch (this.stateMonitor) {
            case "addForm":
              this.isShowStep = false;
              this.submitClick = true;
              this.saveClick = true;
              this.isShowStepBtn = false;
              this.confirmShowButton = false;
              this.$route.path == "/lockUnlockApplication"
                ? this.getTwoNumber()
                : this.getNumber();

              break;
            case "editForm":
              this.isShowStep = false;
              this.isShowStepBtn = false;
              this.submitClick = true;
              this.saveClick = true;
              this.confirmShowButton = false;
              break;
            case "detailForm":
              this.isShowStep = true;
              this.isShowStepBtn = false;
              this.submitClick = false;
              this.saveClick = false;
              this.confirmShowButton = false;
              // 状态为6-已确认---详情显示确认数据
              if (this.status == "6") {
                this.confirmShow = true;
                if (this.addForm.whetherExecuteEnd == "是") {
                  this.completeFromVisible = true;
                } else {
                  this.completeFromVisible = false;
                }
              } else if (this.status == "7") {
                this.confirmShow = true;
                if (this.addForm.whetherExecuteEnd == "是") {
                  this.completeFromVisible = true;
                } else {
                  this.completeFromVisible = false;
                }
              }

              break;
            case "approvalForm":
              this.isShowStep = true;
              this.isShowStepBtn = true;
              this.submitClick = false;
              this.saveClick = false;
              this.confirmShowButton = false;
              break;
            case "toBeImplementedForm":
              this.isShowStepBtn = false;
              this.isShowStep = true;
              this.submitClick = false;
              this.saveClick = false;
              this.confirmShowButton = false;
              break;
            case "confirmForm":
              this.isShowStep = true;
              this.isShowStepBtn = false;
              this.confirmShow = true;
              this.submitClick = false;
              this.confirmShowButton = true;
              this.saveClick = false;
              if (this.addForm.whetherExecuteEnd == "") {
                this.addForm.whetherExecuteEnd = "是";
              }
              if (this.addForm.whetherExecuteEnd == "是") {
                this.completeFromVisible = true;
              } else if (this.addForm.whetherExecuteEnd == undefined) {
                this.completeFromVisible = true;
              } else {
                this.completeFromVisible = false;
              }
              break;
          }
        }
      },
    },
  },
  mounted() {
    // this.getNumbers();
  },
  methods: {
    rejectClick() {
      // this.approvalMethod(2);
      this.$refs.stepsModel.verificationChange("0");
    },
    // agreeClick() {},
    agreeClick() {
      // this.$refs.reviewRef.agree();
      this.$refs.stepsModel.verificationChange("1");
      // this.approvalMethod(1);
    },
    moment,
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    executorDisabledDate(current) {
      // Can not select days before today and today
      return current && current >= moment().endOf("day");
      // return current && current > moment().subtract(1, 'days').endOf('day')
    },
    executorDisabledDateTime(dates) {
      const hours = moment().hours();
      const minutes = moment().minutes();
      const seconds = moment().seconds();
      if (dates && moment(dates).date() === moment().date()) {
        return {
          disabledHours: () => range(hours + 1, 24),
          disabledMinutes: () => range(minutes + 1, 60),
          disabledSeconds: () => range(seconds + 1, 60),
        };
      }
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      };
    },
    // agree() {
    //   this.approvalMethod(1)
    // },
    // reject() {
    //   this.approvalMethod(2)
    // },
    approvalMethod(type) {
      this.$emit("approval", {
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.addForm.id,
      });
    },
    confirmClick() {
      this.$refs.ruleReleaseForm.validate((valid) => {
        if (valid) {
          this.$emit(
            "confirmFormClick",
            {
              id: this.addForm.id,
              numbers: this.addForm.numbers,
              confirmName: this.addForm.confirmName,
              confirmTime: this.addForm.confirmTime,
              whetherExecuteEnd: this.addForm.whetherExecuteEnd,
              executeName: this.addForm.executeName,
              executeTime: this.addForm.executeTime,
              remark: this.addForm.remark,
            },
            (res) => {
              if (res.code == "200") {
                this.$emit("close");
              }
            }
          );
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    //格式化日期
    formatDate(objDate, fmt) {
      var o = {
        "M+": objDate.getMonth() + 1, //月份
        "d+": objDate.getDate(), //日
        "h+": objDate.getHours() % 12 == 0 ? 12 : objDate.getHours() % 12, //小时
        "H+": objDate.getHours(), //小时
        "m+": objDate.getMinutes(), //分
        "s+": objDate.getSeconds(), //秒
        "q+": Math.floor((objDate.getMonth() + 3) / 3), //季度
        S: objDate.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (objDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    executeCompleteYNChange(val) {
      if (val.target.value == "是") {
        //显示控件
        this.completeFromVisible = true;
      } else {
        this.completeFromVisible = false;
      }
    },
    addNewName() {
      this.addForm.eqmWhetherInAccount.push({
        eqmWhetherInAccount: "",
        eqmNo: "",
        eqmName: "",
      });
    },
    getNumber() {
      generateNumber().then((res) => {
        this.addForm.numbers = res.body;
        // this.searchField.pageNum = pagination.current;
        // this.searchField.pageSize = pagination.pageSize;
        // this.pagination.total = res.body.total;
      });
    },
    getTwoNumber() {
      getTwoNumber().then((res) => {
        this.addForm.numbers = res.body;
        // this.searchField.pageNum = pagination.current;
        // this.searchField.pageSize = pagination.pageSize;
        // this.pagination.total = res.body.total;
      });
    },
    equipmentClick() {
      this.equipmentVisible = true;
      // this.$refs.equipmentModel.selectedRowKeys = [this.dataForm.sbbm];
    },
    selectedClic(value) {
      this.addForm.eqmName = value.eqm_sbmc;
      this.addForm.eqmNo = value.eqm_sbwh;
      this.equipmentVisible = false;
      // this.$refs.ruleForm.validateField("devicename");
    },
    cancelClickForm() {
      this.handleCancel();
    },
    handleOk(isPrint) {
      // if (isPrint) {
      //   this.saveAddForm("submitClick");
      //   this.print();
      // } else {
      //   this.saveAddForm("submitClick");
      // }
      this.saveAddForm("submitClick", isPrint);
    },
    print() {
      this.$emit("isParintClick", this.addForm);
    },
    saveAddForm(action, isPrint) {
      this.onSubmit(action, isPrint);
    },
    onSubmit(action, isPrint) {
      this.$refs.ruleReleaseForm.validate((valid) => {
        if (valid) {
          this.$emit("submitForm", this.addForm, this.stateMonitor, action);
          if (isPrint) {
            this.print();
          }
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    handleCancel() {
      this.$emit("close");
    },
    addReleaseFormClose() {
      this.addForm = {
        applyName: this.$store.state.user.name,
        // applyTime: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        applyTime: "",
        numbers: "",
        eqmWhetherInAccount: "",
        eqmName: "",
        eqmNo: "",
        natureOperation: "",
        applyReason: "",
        whetherExecuteEnd: "是",
        executeName: "",
        executeTime: "",
        remark: "",
        confirmName: "",
        // confirmTime: this.getUploadTime(),
        confirmTime: "",
        lockNumber: "",
        // applyName: "",
        // applyTime: "",
        // numbers: "",
        // eqmWhetherInAccount: "",
        // eqmName: "",
        // eqmNo: "",
        // natureOperation: "",
        // applyReason: "",
        // whetherExecuteEnd: "",
        // executeName: "",
        // executeTime: "",
        // remark: "",
        // confirmName: "",
        // // confirmTime: this.getUploadTime(),
        // confirmTime: "",
        // lockNumber: "",
      };
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".add-form-model10");
    },
    getUploadTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    },
  },
};
</script>
<style lang="less" scoped>
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
.a_col_style2 {
  ::v-deep .ant-row {
    .ant-form-item-label {
      width: 200px !important;
      label {
        width: 175px !important;
      }
    }
  }
}
// .insert-but {
//   /deep/ .ant-input {
//     width: 118px !important;
//   }
// }
</style>
