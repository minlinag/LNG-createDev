<template>
  <a-modal
    :visible="addClainVisible"
    title="新增"
    :footer="null"
    @cancel="handleCancel"
    :title="addClainFormTypeModelTitle"
    class="from-style middleModel"
    :after-close="addClainFormClose"
    :maskClosable="false"
    destroyOnClose
  >
    <a-form-model ref="ruleForm" :model="addForm" :rules="rules">
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="创建人" prop="createdUser">
            <a-input
              placeholder="自动带出(当前用户)"
              v-model="addForm.createdUser"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="创建时间" prop="createdDateTime">
            <a-input
              placeholder="自动带出(系统时间)"
              v-model="addForm.createdDateTime"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="联锁号" prop="interlockNo">
            <a-input
              placeholder="请输入"
              v-model="addForm.interlockNo"
              :disabled="isDisabled"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="联锁分级" prop="interlockLevel">
            <a-radio-group
              v-model="addForm.interlockLevel"
              :disabled="isDisabled"
            >
              <a-radio value="1"> 一级 </a-radio>
              <a-radio value="2"> 二级 </a-radio>
              <a-radio value="3"> 三级 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="联锁描述" prop="interlockDescription">
            <a-input
              placeholder="请输入"
              v-model="addForm.interlockDescription"
              :disabled="isDisabled"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="初次投用时间" required prop="firstUseTime">
            <a-date-picker
              style="min-width: auto"
              show-time
              v-model="addForm.firstUseTime"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="date"
              placeholder="请选择"
              :disabled="isDisabled"
            />
          </a-form-model-item>
        </a-col>

        <!-- <a-col :span="12">
          <a-form-model-item label="设定值(数字)" prop="setValue">
            <a-input-number
              :min="0"
              :max="10"
              :step="0.1"
              :placeholder="
                this.$route.path == '/chainManagementAccount'
                  ? '请输入'
                  : '自动带出'
              "
              v-model="addForm.setValue"
            />
          </a-form-model-item>
        </a-col> -->
        <!-- <a-col :span="12">
          <a-form-model-item
            label="设定值(数字)"
            prop="setValueUnits"
            class="setValue_units"
          > -->
        <!-- <a-input-number
              :min="0"
              :max="10"
              :step="0.1"
              :placeholder="
                this.$route.path == '/chainManagementAccount'
                  ? '请输入'
                  : '自动带出'
              "
              v-model="addForm.setValue"
            /> -->
        <!-- <a-select
              v-model="addForm.setValueUnits"
              show-search
              placeholder="选单位"
              :getPopupContainer="getPopupContainer"
            >
              <a-select-option
                :value="province.dictname"
                v-for="(province, index) in setValueUnitsOption"
                :key="index"
              >
                {{ province.dictname }}
              </a-select-option>
            </a-select> -->

        <!-- <a-select
              v-model="addForm.setValueUnits"
              show-search
              placeholder="选单位"
              :getPopupContainer="getPopupContainer"
              style="width: 80px"
            >
              <a-select-option
                :value="province.dictname"
                v-for="(province, index) in setValueUnitsOption"
                :key="index"
              >
                {{ province.dictname }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="12" class="position-add-clain">
          <a-form-model-item
            label="设定值(数字)"
            prop="setValue"
            class="setValue_units"
          >
            <!-- <a-input-number
              :min="0"
              :max="10"
              :step="0.1"
              :placeholder="
                this.$route.path == '/chainManagementAccount'
                  ? '请输入'
                  : '自动带出'
              "
              v-model="addForm.setValue"
            /> -->
            <a-input-number
              id="inputNumber"
              v-model.trim="addForm.setValue"
              @change="onChange"
              :placeholder="
                this.$route.path == '/chainManagementAccount'
                  ? '请输入'
                  : '自动带出'
              "
              :disabled="isDisabled"
            />
            <a-select
              v-model="addForm.setValueUnits"
              show-search
              placeholder="选单位"
              :getPopupContainer="getPopupContainer"
              :dropdownMatchSelectWidth="true"
              :disabled="isDisabled"
            >
              <a-select-option
                :value="province.dictname"
                v-for="(province, index) in setValueUnitsOption"
                :key="index"
              >
                {{ province.dictname }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-model-item label="设定值(数字)" prop="setValue">
            <a-row :gutter="12">
              <a-col :span="5">
                <a-input
                  :placeholder="
                    this.$route.path == '/chainManagementAccount'
                      ? '请输入'
                      : '自动带出'
                  "
                  v-model="addForm.setValue"
                  default-value="mysite"
                  style="width: 100px"
                />
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model="addForm.setValueUnits"
                  show-search
                  placeholder="请选择"
                  :getPopupContainer="getPopupContainer"
                >
                  <a-select-option
                    :value="province.dictname"
                    v-for="(province, index) in setValueUnitsOption"
                    :key="index"
                  >
                    {{ province.dictname }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-model-item>
        </a-col> -->
      </a-row>
      <div v-if="isShowStep">
        <a-table
          :scroll="{ y: 200, x: 100 }"
          :columns="columnsHistory"
          :dataSource="dataSourceHistory"
          :pagination="false"
          rowKey="id"
        >
          <template slot="operationType" slot-scope="text">
            {{ text | operationType }}
          </template>
        </a-table>
        <!-- <stepsModel ref="stepsModel" :isShow="false" :id="this.addForm.id" /> -->
      </div>
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button type="primary" @click="saveAddClainForm" v-if="showSave"> 保存 </a-button>
      <a-button @click="returnClick"> 取消 </a-button>
    </div>
  </a-modal>
</template>
<script>
import { encode } from "@/api/dataDictionary";
// import stepsModel from "../../../dispatching/components/stepsModel.vue";
export default {
  // components: { stepsModel },
  props: [
    "addClainVisible",
    "addClainFormTypeModelTitle",
    "stateMonitor",
    "dataSourceList",
  ],

  filters: {
    operationType(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "恢复";
          break;
        case "2":
          value = "解除";
          break;
        default:
          break;
      }
      return value;
    },
  },
  data() {
    return {
      showSave:true,
      setValueUnitsOption: [],
      isDisabled: false,
      dataSourceHistory: [],
      selectedRowKeysHistory: [],
      columnsHistory: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: 50,
          align: "center",
        },
        {
          title: "申请序号",
          dataIndex: "numbers",
          width: 100,
          align: "center",
        },
        {
          title: "操作时间",
          dataIndex: "operationTime",
          width: 140,
          align: "center",
        },
        {
          title: "操作类型",
          dataIndex: "operationType",
          scopedSlots: { customRender: "operationType" },
          width: 80,
          align: "center",
        },
        {
          title: "原因",
          dataIndex: "reason",
          width: 200,
          align: "center",
        },
        {
          title: "申请人",
          dataIndex: "applyName",
          width: 80,
          align: "center",
        },
        // {
        //   title: "审批人",
        //   dataIndex: "approvalName",
        //   width: 150,
        //   align: "center",
        // },
        // {
        //   title: "执行人",
        //   dataIndex: "executor",
        //   width: 150,
        //   align: "center",
        // },
      ],
      isShowStep: true,
      addForm: {
        createdUser: this.$store.state.user.name,
        createdDateTime: this.formatDate(
                new Date(),
                "yyyy-MM-dd HH:mm:ss"
              ),
        interlockNo: "",
        interlockLevel: "",
        interlockDescription: "",
        setValue: "",
        setValueUnits: undefined,
      },
      rules: {
        interlockNo: [
          { required: true, message: "请输入联锁号", trigger: "change" },
        ],
        interlockLevel: [
          { required: true, message: "请选择联锁分级 ", trigger: "change" },
        ],
        interlockDescription: [
          { required: true, message: "请输入联锁描述", trigger: "blur" },
        ],
        firstUseTime: [
          { required: true, message: "请输入初次投用时间", trigger: "blur" },
        ],
        setValue: [
          { required: true, message: "请输入设定值", trigger: "blur" },
        ],
        setValueUnits: [
          { required: true, message: "请选择单位", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    addClainVisible: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.isShowStep = false;
          switch (this.stateMonitor) {
            case "addForm":
              this.isDisabled = false;
              this.isShowStep = false;
              this.showSave = true
              break;
            case "detailForm":
              this.showSave = false
              this.isDisabled = true;
              this.dataSourceHistory = this.dataSourceList;
              // debugger;
              this.isShowStep = true;
              break;
          }
        }
      },
    },
  },
  mounted() {
    this.encodeSelect();
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
    /* 只能输入数字，小数点2位 */
    clearNoNum(value) {
      // debugger
      //   value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
      //   value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      //   value = value
      //     .replace(".", "$#$")
      //     .replace(/\./g, "")
      //     .replace("$#$", ".");
      return Number(String(value).replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"));
      //  debugger
      //   value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      //   if (value.indexOf(".") < 0 && value != "") {
      //     //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      //     value = parseFloat(value);
      //   }
    },
    onChange(value) {
      if (value) {
        this.addForm.setValue = this.clearNoNum(value);
      }
      console.log("changed", value);
    },
    // 获取数据字典列表
    encodeSelect() {
      // 设定值单位
      encode("LSZ_DW").then((res) => {
        this.setValueUnitsOption = res.body.data;
      });
    },
    getPopupContainer() {
      return document.querySelector(".position-add-clain");
    },
    onSelectChangeHistory() {},
    getCheckboxPropsHistory() {},
    saveAddClainForm() {
      this.onSubmit("save");
    },
    returnClick() {
      this.handleCancel();
    },
    onSubmit(val) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.addForm.setValueUnits) {
            this.$message.warn(`请选择设定值单位`);
            return false;
          }
          if (val == "save") {
            this.$emit(
              "saveAddClainFormClick",
              { ...this.addForm, usingTime: this.addForm.firstUseTime },
              this.stateMonitor
            );
            // this.handleCancel();
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
    addClainFormClose() {
      this.addForm = {
        createdUser: "",
        createdDateTime: "",
        interlockNo: "",
        interlockLevel: "",
        interlockDescription: "",
      };
      this.$refs.ruleForm.clearValidate();
    },
  },
};
</script>
<style lang="less" scoped>
.setValue_units {
  ::v-deep .ant-select-selection {
    width: 90px !important;
    height: 32px !important;
    .ant-select-selection__rendered {
      line-height: 30px;
    }
  }
  ::v-deep .ant-select {
    width: 90px !important;
    height: 32px !important;
  }
}
</style>
