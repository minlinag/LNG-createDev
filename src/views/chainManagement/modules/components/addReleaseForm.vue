<template>
  <a-modal
    :visible="addReleaseVisible"
    :footer="null"
    @cancel="handleCancel"
    :title="addReleaseTitle"
    class="from-style bigModel"
    :after-close="addReleaseFormClose"
    :maskClosable="false"
    id="printContent"
    destroyOnClose
  >
    <a-form-model
      ref="ruleReleaseForm"
      :model="addReleaseForm"
      :rules="releaseRules"
    >
      <a-row>
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
              :disabled="
                typeModel == 'view' ||
                typeModel == 'approval' ||
                typeModel == 'implement' ||
                typeModel == 'confirm'
              "
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
              @panelChange="panelChangePanTime"
              :disabled="
                typeModel == 'view' ||
                typeModel == 'approval' ||
                typeModel == 'implement' ||
                typeModel == 'confirm'
              "
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
        <a-col :span="8" v-if="this.$route.path == '/chainReleaseApplication'">
          <a-form-model-item
            label="计划解除时间"
            required
            prop="planRelieveTime"
          >
            <a-date-picker
              style="min-width: auto"
              show-time
              v-model="addReleaseForm.planRelieveTime"
              @change="onChange"
              @ok="onOk"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="date"
              :placeholder="
                this.$route.path == '/interlockRecoveryApplication'
                  ? '自动带出'
                  : '请输入'
              "
              :disabled="
                this.$route.path == '/interlockRecoveryApplication'
                  ? true
                  : false ||
                    typeModel == 'view' ||
                    typeModel == 'approval' ||
                    typeModel == 'implement' ||
                    typeModel == 'confirm'
              "
              :disabled-date="disabledDate"
              :disabled-time="disabledDateTime"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-else>
          <a-form-model-item label="解除时间" prop="relieveTime">
            <a-date-picker
              style="min-width: auto"
              show-time
              v-model="addReleaseForm.relieveTime"
              @change="onChange"
              @ok="onOk"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="date"
              :placeholder="
                this.$route.path == '/interlockRecoveryApplication'
                  ? '自动带出'
                  : '请输入'
              "
              :disabled="
                this.$route.path == '/interlockRecoveryApplication'
                  ? true
                  : false ||
                    typeModel == 'view' ||
                    typeModel == 'approval' ||
                    typeModel == 'implement' ||
                    typeModel == 'confirm'
              "
              :disabled-date="disabledDate"
              :disabled-time="disabledDateTime"
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
              :disabled="
                typeModel == 'view' ||
                typeModel == 'approval' ||
                typeModel == 'implement' ||
                typeModel == 'confirm'
              "
              :disabled-date="disabledDate"
              :disabled-time="disabledDateTime"
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
              :disabled="
                this.$route.path == '/interlockRecoveryApplication'
                  ? true
                  : false ||
                    typeModel == 'view' ||
                    typeModel == 'approval' ||
                    typeModel == 'implement' ||
                    typeModel == 'confirm'
              "
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
              :disabled="
                this.$route.path == '/interlockRecoveryApplication'
                  ? true
                  : false ||
                    typeModel == 'view' ||
                    typeModel == 'approval' ||
                    typeModel == 'implement' ||
                    typeModel == 'confirm'
              "
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            :label="
              this.$route.path == '/interlockRecoveryApplication'
                ? '恢复安全措施'
                : '工艺管理措施'
            "
            prop="processManageStep"
            :labelCol="{ style: 'width: 100px' }"
          >
            <a-input
              :auto-size="{ minRows: 6, maxRows: 6 }"
              type="textarea"
              v-model="addReleaseForm.processManageStep"
              placeholder="请输入"
              :disabled="
                typeModel == 'view' ||
                typeModel == 'approval' ||
                typeModel == 'implement' ||
                typeModel == 'confirm'
              "
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="备注" :labelCol="{ style: 'width: 100px' }">
            <a-input
              :auto-size="{ minRows: 6, maxRows: 6 }"
              type="textarea"
              v-model="addReleaseForm.remark"
              placeholder="请输入"
              :disabled="
                typeModel == 'view' ||
                typeModel == 'approval' ||
                typeModel == 'implement' ||
                typeModel == 'confirm'
              "
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
              <a-radio
                value="1"
                :disabled="
                  typeModel == 'confirm' ||
                  typeModel == 'view' ||
                  typeModel == 'approval'
                "
              ></a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <!--确认情况-->
        <div v-if="confirmShow">
          <a-divider orientation="left">执行情况确认</a-divider>
          <!--确认情况表单-->
          <a-col :span="8">
            <a-form-model-item label="联锁号">
              <a-input
                v-model="addReleaseForm.interlockNo"
                disabled
                placeholder="自动带入"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="确认人">
              <a-input
                v-model="addReleaseForm.confirmName"
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
                v-model="addReleaseForm.confirmCreateTime"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                type="date"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" class="position-changeList_model1">
            <a-form-model-item
              :label="
                this.$route.path == '/chainReleaseApplication'
                  ? '确认该联锁已经屏蔽'
                  : '确认该联锁已经恢复'
              "
              prop="whetherConfirm"
            >
              <!-- <a-select
                :options="executeCompleteYNOptions"
                v-model="addReleaseForm.whetherConfirm"
                @change="executeCompleteYNChange"
                :getCalendarContainer="getPopupContainer"
                :disabled="typeModel == 'view'"
                :default-value="'1'"
              >
              </a-select> -->
              <a-radio-group
                :options="executeCompleteYNOptions"
                v-model="addReleaseForm.whetherConfirm"
                @change="executeCompleteYNChange"
                :disabled="typeModel == 'view'"
                :default-value="1"
              >
                <a-radio :value="1"> 是 </a-radio>
                <a-radio :value="0"> 否 </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="8"
            class="position-changeList_model1"
            v-show="completeFromVisible"
          >
            <a-form-model-item
              label="执行人"
              :prop="addReleaseForm.whetherConfirm == '0' ? '' : 'executorName'"
            >
              <a-input
                :placeholder="isLable"
                v-model="addReleaseForm.executorName"
                :auto-size="{ minRows: 6, maxRows: 6 }"
                :disabled="typeModel == 'view'"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="8"
            class="position-changeList_model1"
            v-show="completeFromVisible"
          >
            <a-form-model-item
              label="执行时间"
              :prop="addReleaseForm.whetherConfirm == '0' ? '' : 'confirmTime'"
            >
              <a-date-picker
                style="min-width: auto"
                show-time
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请输入"
                v-model="addReleaseForm.confirmTime"
                :getCalendarContainer="getPopupContainer"
                :disabled="typeModel == 'view'"
                :disabled-date="executorDisabledDate"
                :disabled-time="executorDisabledDateTime"
              />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="18" class="a_col_style2" v-show="completeFromVisible">
            <a-form-model-item
              :label="
                this.$route.path == '/chainReleaseApplication'
                  ? '确认该联锁已经屏蔽'
                  : '确认该联锁已经恢复'
              "
              :prop="
                addReleaseForm.whetherConfirm == '0'
                  ? ''
                  : 'whetherConfirmButton'
              "
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-radio-group v-model="addReleaseForm.whetherConfirmButton">
                <a-radio value="1" :disabled="typeModel == 'view'"></a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item
              label="确认情况说明"
              :prop="
                addReleaseForm.whetherConfirm == '1' ? 'a' : 'confirmOpinion'
              "
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-textarea
                :placeholder="isLable"
                v-model="addReleaseForm.confirmOpinion"
                :auto-size="{ minRows: 6, maxRows: 6 }"
                :disabled="typeModel == 'view'"
              />
            </a-form-model-item>
          </a-col>
        </div>
      </a-row>
      <div>
        <stepsModel
          ref="stepsModel"
          :isShow="typeModel === 'approval' ? true : false"
          :id="this.addReleaseForm.id"
          v-if="isShowStep"
        />
      </div>
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button
        type="primary"
        @click="saveAddReleaseForm('saveClick')"
        v-if="saveClick"
      >
        保存
      </a-button>
      <a-button
        type="primary"
        @click="saveAddReleaseForm('submitClick')"
        v-if="submitClick"
      >
        提交
      </a-button>
      <!-- 审批 -->
      <a-button type="primary" @click="passClick" v-if="isShowStepButton">
        确认
      </a-button>
      <!-- 确认 -->
      <a-button type="primary" @click="confirmClick" v-if="confirmShowButton">
        确认
      </a-button>
      <a-button type="primary" @click="printClick" v-if="printButton">
        打印
      </a-button>
      <a-button @click="cancelClickForm" v-if="cancelClick"> 取消 </a-button>
    </div>
  </a-modal>
</template>
<script>
import {
  queryByInterlockNo,
  queryByNoToRecover,
  generatedNumber,
  queryInterlockNo,
} from "@/api/chainManagement/chainReleaseApplication";
import moment from "moment";
import stepsModel from "../../../equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  name: "",
  components: { stepsModel },
  props: [
    "addReleaseVisible",
    "addReleaseTitle",
    // "interlockNoOption",
    "interlockStatus",
    "stateMonitor",
    "typeModel",
    "recordStatus",
    "dataSource",
  ],
  filters: {
    interlockLevel(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "一级";
          break;
        case "2":
          value = "二级";
          break;
        case "3":
          value = "三级";
          break;
        default:
          break;
      }
      return value;
    },
  },
  data() {
    return {
      interlockLevelOptions: [
        { value: "1", label: "一级" },
        { value: "2", label: "二级" },
        { value: "3", label: "三级" },
      ],
      saveClick: true,
      submitClick: true,
      cancelClick: true,
      completeFromVisible: true,
      toBeImplemented: false,
      confirmShow: false,
      isShowStepButton: false,
      toBeImplementedButton: false,
      confirmShowButton: false,
      printButton: false,
      executeCompleteYNOptions: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      addReleaseForm: {
        createdUser: this.$store.state.user.name,
        createdDateTime: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        executorCreateTime: "",
        confirmCreateTime: "",
        // code: "",
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
      releaseRules: {
        // code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        interlockNo: [
          { required: true, message: "请输入联锁号", trigger: "blur" },
        ],
        setValue: [
          { required: true, message: "请输入设定值 ", trigger: "change" },
        ],
        planRelieveTime: [
          { required: true, message: "请选择计划解除时间", trigger: "change" },
        ],
        planRecoverTime: [
          { required: true, message: "请选择计划恢复时间", trigger: "change" },
        ],
        reason: [{ required: true, message: "请输入原因", trigger: "blur" }],
        craftInfluence: [
          { required: true, message: "请输入工艺影响(危害)", trigger: "blur" },
        ],
        processManageStep: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        whetherExecutorButton: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        executorOpinion: [
          { required: true, message: "请输入执行情况说明", trigger: "blur" },
        ],
        whetherExecutor: [
          { required: true, message: "请选择是否执行完毕", trigger: "blur" },
        ],
        executorTime: [
          { required: true, message: "请输入执行时间", trigger: "change" },
        ],
        whetherConfirm: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        confirmTime: [
          { required: true, message: "请输入执行时间", trigger: "change" },
        ],
        whetherConfirmButton: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        confirmOpinion: [
          { required: true, message: "请输入确认情况说明", trigger: "blur" },
        ],
        a: [{ required: false, message: "", trigger: "blur" }],
        executorName: [
          { required: true, message: "请输入执行人", trigger: "change" },
        ],
      },
      isShowStep: false,
      // 查询字段
      formInline: {
        interlockStatus: this.interlockStatus,
        interlockNo: "",
      },
      interlockNoOption: [],
    };
  },
  watch: {
    addReleaseVisible: {
      handler(newVal, oldVal) {
        if (newVal) {
          // debugger
          this.completeFromVisible = true;
          // this.getNumbers();
          this.isShowStep = false;
          this.saveClick = false;
          this.submitClick = false;
          this.cancelClick = false;
          this.toBeImplemented = false;
          this.confirmShow = false;
          this.isShowStepButton = false;
          this.toBeImplementedButton = false;
          this.confirmShowButton = false;
          this.printButton = false;
          this.isLable = "";
          switch (this.stateMonitor) {
            case "addForm":
              this.isShowStep = false;
              this.saveClick = true;
              this.submitClick = true;
              this.cancelClick = true;
              this.toBeImplemented = false;
              this.isShowStepButton = false;
              this.confirmShow = false;
              this.toBeImplementedButton = false;
              this.confirmShowButton = false;
              this.printButton = false;
              this.getNumbers();
              break;
            case "editForm":
              this.isShowStep = false;
              this.saveClick = true;
              this.submitClick = true;
              this.cancelClick = true;
              this.toBeImplemented = false;
              this.isShowStepButton = false;
              this.confirmShow = false;
              this.toBeImplementedButton = false;
              this.confirmShowButton = false;
              this.printButton = false;
              // this.getNumbers();
              break;
            case "detailForm":
              this.isShowStep = true;
              this.saveClick = false;
              this.submitClick = false;
              this.cancelClick = true;
              if (this.addReleaseForm.whetherConfirm == "1") {
                this.completeFromVisible = true;
              } else {
                this.completeFromVisible = false;
              }
              // 状态为5-待确认----详情显示执行数据
              // 状态为6-已解除-7-已恢复---详情显示执行+确认数据
              if (this.addReleaseForm.recordStatus == "5") {
                this.confirmShow = false;
                this.toBeImplemented = true;
              } else if (this.addReleaseForm.recordStatus == "9") {
                // this.completeFromVisible = false
                this.confirmShow = true;
                this.toBeImplemented = true;
              } else if (this.addReleaseForm.recordStatus == "6") {
                this.confirmShow = true;
                this.toBeImplemented = true;
              } else if (this.addReleaseForm.recordStatus == "7") {
                this.toBeImplemented = true;
                this.confirmShow = true;
              } else {
                this.toBeImplemented = false;
                this.confirmShow = false;
              }
              // this.toBeImplemented = this.recordStatus == "5" ? true : false;
              // this.toBeImplemented = false;
              // this.confirmShow = true;
              // this.toBeImplemented = true;
              this.isShowStepButton = false;
              this.toBeImplementedButton = false;
              this.confirmShowButton = false;
              this.printButton = true;
              break;
            case "approvalForm":
              this.isShowStep = true;
              this.saveClick = false;
              this.submitClick = false;
              this.cancelClick = true;
              this.toBeImplemented = false;
              this.confirmShow = false;
              this.toBeImplementedButton = false;
              this.isShowStepButton = true;
              this.confirmShowButton = false;
              this.printButton = false;
              break;
            case "toBeImplementedForm":
              this.isShowStep = false;
              this.saveClick = false;
              this.submitClick = false;
              this.cancelClick = true;
              this.toBeImplemented = true;
              this.confirmShow = false;
              this.isShowStepButton = false;
              this.toBeImplementedButton = true;
              this.confirmShowButton = false;
              this.printButton = false;
              break;
            case "confirmForm":
              this.isShowStep = false;
              this.saveClick = false;
              this.submitClick = false;
              this.cancelClick = true;
              this.toBeImplemented = true;
              this.confirmShow = true;
              this.isShowStepButton = false;
              this.toBeImplementedButton = false;
              this.confirmShowButton = true;
              this.isLable = "请输入确认情况说明";
              this.printButton = false;
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
    levelChange(name) {
      this.showInterlockNoOption();
      // if(this.addReleaseForm.interlockLevel=='1')
    },
    // 根据状态查联锁号
    showInterlockNoOption() {
      queryInterlockNo({
        interlockStatus: this.interlockStatus,
        interlockLevel: this.addReleaseForm.interlockLevel,
      }).then((res) => {
        this.interlockNoOption = res.body.map((item) => {
          return {
            value: item.interlockNo,
            label: item.interlockNo,
          };
        });
        // res.body.forEach((item) => {
        // this.interlockNoOption = []
        //   this.interlockNoOption.push({
        //     label: item.interlockNo,
        //     value: item.interlockNo,
        //   });
        // });
      });
    },
    panelChangePanTime(value) {
      this.addReleaseForm.interlockNo = value;
      this.ChangeAnnualDataPanTime(value);
    },
    onChange(value, dateString) {
      console.log("Selected Time: ", value);
      console.log("Formatted Selected Time: ", dateString);
    },
    onOk(value) {
      console.log("onOk: ", value);
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

    // executorDisabledDateTime() {
    //   return {
    //     disabledHours: () => this.range(0, 24).splice(4, 20),
    //     disabledMinutes: () => this.range(30, 60),
    //     disabledSeconds: () => [55, 56],
    //   };
    // },
    // disabledDate(current) {
    //   return current && current < moment().startOf("day"); // 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。
    // },
    // 禁用日期
    disabledDate(current) {
      return current && current < moment().subtract(1, "days").endOf("day");
    },
    range(start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    },
    // 时间选择禁用此刻之前的时间
    disabledDateTime(current) {
      const hours = moment().hours();
      const minutes = moment().minutes();
      const seconds = moment().seconds();
      if (current && moment().date() == current.date()) {
        return {
          disabledHours: () => this.range(0, hours),
          disabledMinutes: (selectedHour) =>
            selectedHour <= hours ? this.range(0, minutes) : [],
          disabledSeconds: (selectedHour, selectedMinute) =>
            selectedHour <= hours && selectedMinute.value <= minutes
              ? this.range(0, seconds)
              : [],
        };
      }
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      };
    },
    toBeImplementedClick() {
      this.$emit(
        "toBeImplemented",
        {
          type: this.addReleaseForm.whetherExecutor,
          whetherExecutor: this.addReleaseForm.whetherExecutor,
          opinion: this.addReleaseForm.executorOpinion,
          id: this.addReleaseForm.id,
          executorTime: this.addReleaseForm.executorTime,
          whetherExecutorButton: this.addReleaseForm.whetherExecutorButton,
          createdDateTime: this.addReleaseForm.createdDateTime,
        },
        (res) => {
          if (res.code == "200") {
            this.$emit("close");
          }
          //回调函数的方法体.处理自己的业务.
        }
      );
    },
    confirmClick() {
      this.$refs.ruleReleaseForm.validate((valid) => {
        if (valid) {
          this.$emit(
            "confirmFormClick",
            {
              type: this.addReleaseForm.whetherConfirm,
              whetherConfirm: this.addReleaseForm.whetherConfirm,
              executorName: this.addReleaseForm.executorName,
              opinion: this.addReleaseForm.confirmOpinion,
              id: this.addReleaseForm.id,
              confirmTime: this.addReleaseForm.confirmTime,
              executorTime: this.addReleaseForm.executorTime,
              whetherConfirmButton: this.addReleaseForm.whetherConfirmButton,
            },
            (res) => {
              if (res.code == "200") {
                this.$emit("close");
              }
              //回调函数的方法体.处理自己的业务.
            }
          );
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    //是否执行完毕下拉框数据改变
    //1、控制说明文本框是否必填   1-是-true-可选，0-否-false-必填
    //2、控制完成时间/执行班组/执行效率 显示隐藏
    executeCompleteYNChange(val) {
      if (val.target.value == "1") {
        //显示控件
        this.completeFromVisible = true;
      } else {
        this.completeFromVisible = false;
      }
    },
    getNumbers() {
      generatedNumber().then((res) => {
        this.addReleaseForm.numbers = res.body.Numbers;
      });
    },
    // 查询联锁号
    formListChange() {
      if (this.$route.path == "/chainReleaseApplication") {
        if (this.addReleaseForm.interlockNo) {
          this.formInline.interlockNo = this.addReleaseForm.interlockNo;
          this.getQueryByInterlockNo();
        }
      } else {
        if (this.addReleaseForm.interlockNo) {
          this.getQueryByNoToRecover();
        }
      }
      // this.ChangeAnnualDataPanTime();
    },
    // 根据联锁号查询联锁信息
    getQueryByInterlockNo() {
      queryByInterlockNo(this.formInline).then((res) => {
        if (res.code == "200") {
          if (res.body == "false") {
            this.addReleaseForm.interlockNo = "";
            this.$message.warning(res.msg);
          } else {
            // this.addReleaseForm.interlockNo = res.body.interlockNo;
            this.addReleaseForm.interlockLevel = res.body.interlockLevel;
            this.addReleaseForm.interlockDescription =
              res.body.interlockDescription;
            this.addReleaseForm.setValueUnits = res.body.setValueUnits;
            this.addReleaseForm.setValue = res.body.setValue;
            this.addReleaseForm.setValue =
              res.body.setValue + " " + res.body.setValueUnits;
            // this.addReleaseForm.interlockStatus = res.body.interlockStatus;
          }
        }
      });
    },
    // 根据联锁号查询联锁huifu页面信息
    getQueryByNoToRecover() {
      queryByNoToRecover({ interlockNo: this.addReleaseForm.interlockNo }).then(
        (res) => {
          if (res.code == "200") {
            if (res.body == "false") {
              this.addReleaseForm.interlockNo = "";
              this.$message.warning(res.msg);
            } else {
              this.addReleaseForm.interlockLevel = res.body.interlockLevel;
              this.addReleaseForm.setValue = res.body.setValue;
              // 解除时间--解除时点击确认按钮的时间
              this.addReleaseForm.relieveTime = res.body.relieveTime;
              this.addReleaseForm.planRecoverTime = res.body.planRecoverTime;
              this.addReleaseForm.reason = res.body.reason;
              this.addReleaseForm.craftInfluence = res.body.craftInfluence;
              this.addReleaseForm.interlockDescription =
                res.body.interlockDescription;
            }
          }
        }
      );
    },
    cancelClickForm() {
      this.handleCancel();
    },
    printClick() {
      this.$emit("isParintClick", this.addReleaseForm);
    },
    passClick() {
      this.$refs.stepsModel.$children[0].validate((valid) => {
        if (valid) {
          this.$emit(
            "pass",
            {
              type: this.$refs.stepsModel.form.type,
              opinion: this.$refs.stepsModel.form.opinion,
              id: this.addReleaseForm.id,
            },
            (res) => {
              if (res.code == "200") {
                this.$emit("close");
              }
              //回调函数的方法体.处理自己的业务.
            }
          );
        }
      });
    },
    saveAddReleaseForm(action) {
      this.addReleaseForm.interlockLevel;
      this.onSubmit(action);
    },
    onSubmit(action) {
      this.$refs.ruleReleaseForm.validate((valid) => {
        if (valid) {
          this.$emit(
            "submitForm",
            this.addReleaseForm,
            this.stateMonitor,
            action
          );
        } else {
          this.$message.warning("必填信息输入不完整");
          return false;
        }
      });
    },
    // onSubmit(val) {
    //   this.$refs.ruleReleaseForm.validate((valid) => {
    //     if (valid) {
    //       if (val == "save") {
    //         this.$emit(
    //           "saveAddReleaseFormClick",
    //           this.addReleaseForm,
    //           this.stateMonitor
    //         );
    //         this.handleCancel();
    //       } else if (val == "submit") {
    //         this.$emit(
    //           "submitAddReleaseFormClick",
    //           this.addReleaseForm,
    //           this.stateMonitor
    //         );
    //         this.handleCancel();
    //       }
    //     } else {
    //       this.$message.warning("必填信息输入不完整");
    //       return false;
    //     }
    //   });
    // },
    handleCancel() {
      this.$emit("close");
    },
    addReleaseFormClose() {
      this.addReleaseForm = {
        createdUser: "",
        createdDateTime: "",
        executorCreateTime: "",
        confirmCreateTime: "",
        // code: "",
        numbers: "",
        interlockNo: "",
        interlockLevel: "",
        interlockDescription: "",
        setValue: "",
        planRelieveTime: "",
        relieveTime: "",
        planRecoverTime: "",
        reason: "",
        craftInfluence: "",
        remark: "",
        processManageStep: "",
        executorTime: "",
      };
      this.$refs.ruleReleaseForm.clearValidate();
      if (this.isShowStepButton == true) {
        this.$refs.stepsModel.form.opinion = "";
        // this.$refs.stepsModel.$refs.form.resetFields()
        // this.$refs.stepsModel.$refs.form.resetFields();
      }
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-changeList_model1");
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
</style>
