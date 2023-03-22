<template>
  <a-modal
    :title="`运行班组交接班${
      formType == 'add'
        ? '新增'
        : formType == 'edit'
        ? '编辑'
        : formType == 'look'
        ? '详情'
        : '接班'
    }`"
    :maskClosable="false"
    width="80vw"
    :visible="applicationsVisible"
    :footer="null"
    @cancel="handleCancel"
    class="DcModel"
  >
    <a-layout>
      <a-layout-content>
        <a-row a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item
              label="交班人："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="Forme.shiftTaker"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="交班时间："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="Forme.shiftTime"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              label="编码："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input disabled placeholder="请输入" v-model="Forme.encoding" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="当班日期："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-date-picker
                show-time
                v-model="Forme.shiftDate"
                :disabled="Recodedisabled"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              label="班组："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-select
                :disabled="Recodedisabled"
                v-model="Forme.teamGroup"
                show-search
                placeholder="请选择班组"
                option-filter-prop="children"
                allowClear
                style="width: 100%"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in owningOption"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="班次："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-radio-group
                :disabled="Recodedisabled"
                v-model="Forme.shift"
                :options="options"
                @change="onChange"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              label="运行总监："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                :disabled="Recodedisabled"
                placeholder="请输入"
                v-model="Forme.directorOfOperations"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item
              label="DCS主操："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                :disabled="Recodedisabled"
                placeholder="请输入"
                v-model="Forme.dcsMasterOperation"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              label="现场操作员："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-textarea
                :disabled="Recodedisabled"
                v-model="Forme.siteOperationPeople"
                placeholder="请输入"
                :auto-size="{ minRows: 1, maxRows: 2 }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="出勤情况："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                :disabled="Recodedisabled"
                placeholder="请输入"
                v-model="Forme.attendanceSituation"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item
              label="生产情况："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-input
                :disabled="Recodedisabled"
                placeholder="请输入"
                v-model="Forme.productionStatus"
              />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item
              label="工艺操作："
              :labelCol="{ style: 'width: 80px' }"
            >
              <table class="table_list" id="tables" width="100%" border="1">
                <tr align="center" style="background: #eeeeee; height: 40px">
                  <td>时间</td>
                  <td>工艺描述</td>
                </tr>
                <tr
                  v-for="(item, index) in processData"
                  :key="index"
                  :class="{ grey: index % 2 == 0 }"
                >
                  <td style="width: 14rem">
                    <a-date-picker
                      v-model="item.times"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      type="date"
                      placeholder="请选择"
                      :disabled="Recodedisabled"
                    />
                  </td>

                  <td>
                    <a-textarea
                      :disabled="Recodedisabled"
                      v-model="item.processDescription"
                      placeholder="请输入"
                      :auto-size="{ minRows: 1, maxRows: 2 }"
                    />
                  </td>
                </tr>
              </table>
              <a-icon
                type="plus-square"
                @click="processDataClick"
                style="
                  width: 1.3rem;
                  height: 1.3rem;
                  position: relative;
                  top: -0.3rem;
                "
              />

              <p>
                未完成操作卡：
                <a-radio-group
                  style="margin-left: 2rem"
                  :disabled="Recodedisabled"
                  v-model="Forme.incompleteOperationCard"
                  :options="optionsCard"
                  @change="onChange"
                />
              </p>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="现场作业："
              :labelCol="{ style: 'width: 80px' }"
            >
              <table class="table_list" id="tables" width="100%" border="1">
                <tr align="center" style="background: #eeeeee; height: 40px">
                  <td>区域</td>
                  <td>作业内容</td>
                  <td>作业进展</td>
                </tr>
                <tr
                  v-for="(item, index) in FieldworkData"
                  :key="index"
                  :class="{ grey: index % 2 == 0 }"
                >
                  <td style="width: 14rem">
                    <a-input
                      :disabled="Recodedisabled"
                      v-model="item.district"
                      placeholder="请输入..."
                    />
                  </td>

                  <td>
                    <a-textarea
                      :disabled="Recodedisabled"
                      v-model="item.jobContent"
                      placeholder="请输入"
                      :auto-size="{ minRows: 1, maxRows: 2 }"
                    />
                  </td>
                  <td style="width: 14rem">
                    <a-textarea
                      :disabled="Recodedisabled"
                      v-model="item.operationProgress"
                      placeholder="请输入"
                      :auto-size="{ minRows: 1, maxRows: 2 }"
                    />
                  </td>
                </tr>
              </table>
              <a-icon
                type="plus-square"
                @click="FieldworkClick"
                style="
                  width: 1.3rem;
                  height: 1.3rem;
                  position: relative;
                  top: -0.3rem;
                "
              />
              <p>
                未关闭作业票：
                <a-radio-group
                  style="margin-left: 2rem"
                  :disabled="Recodedisabled"
                  v-model="Forme.openJobTicket"
                  :options="optionsCard"
                  @change="onChange"
                />
              </p>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <p>设备及工器具状况：</p>
            <a-form-model-item
              label=""
              :labelCol="{ style: 'width: 80px' }"
              style="margin-left: 4.65rem"
            >
              <table class="table_list" id="tables" width="100%" border="1">
                <tr align="center" style="background: #eeeeee; height: 40px">
                  <td>状态描述及处理情况</td>
                  <td>发现人</td>
                  <td>时间</td>
                </tr>
                <tr
                  v-for="(item, index) in equipmentData"
                  :key="index"
                  :class="{ grey: index % 2 == 0 }"
                >
                  <td>
                    <a-textarea
                      :disabled="Recodedisabled"
                      v-model="item.stateDescriptionProcessing"
                      placeholder="请输入"
                      :auto-size="{ minRows: 1, maxRows: 2 }"
                    />
                  </td>

                  <td style="width: 5rem">
                    <a-input
                      :disabled="Recodedisabled"
                      v-model="item.discoverer"
                      placeholder="请输入"
                    />
                  </td>
                  <td style="width: 14rem">
                    <a-date-picker
                      v-model="item.times"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      type="date"
                      placeholder="请选择"
                      :disabled="Recodedisabled"
                    />
                  </td>
                </tr>
              </table>
              <a-icon
                type="plus-square"
                @click="equipmentClick"
                style="
                  width: 1.3rem;
                  height: 1.3rem;
                  position: relative;
                  top: -0.3rem;
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="安全提示："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-textarea
                :disabled="Recodedisabled"
                v-model="Forme.safetyTips"
                placeholder="请输入"
                :auto-size="{ minRows: 1, maxRows: 2 }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="交班记事："
              :labelCol="{ style: 'width: 100px' }"
            >
              <a-textarea
                :disabled="Recodedisabled"
                v-model="Forme.shiftNotes"
                placeholder="请输入"
                :auto-size="{ minRows: 1, maxRows: 2 }"
              />
            </a-form-model-item>
          </a-col>

          <template v-if="formType == 'succession' || formType == 'look'">
            <a-col :span="24">
              <a-form-model-item
                label="接班意见："
                :labelCol="{ style: 'width: 100px' }"
              >
                <a-textarea
                  :disabled="formType == 'succession' ? false : true"
                  v-model="Forme.successionAdvice"
                  placeholder="请输入"
                  :auto-size="{ minRows: 1, maxRows: 2 }"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="22">
              <a-form-model-item label="附件上传">
                <file-upload
                  :Text="'上传文件'"
                  @fileChange="fileListChange"
                  :echoList="flieChanges"
                  :disabled="formType == 'succession' ? false : true"
                  :fileQuantity="1"
                  ref="importConpontsDataRef"
                ></file-upload>
              </a-form-model-item>
            </a-col>
          </template>
        </a-row>
      </a-layout-content>

      <a-layout-footer v-if="formType != 'look'">
        <template v-if="formType == 'succession'">
          <a-button type="primary" @click="handlesuccession('succession')">
            接班
          </a-button>
          <a-button @click="handlesuccession('back')"> 退回</a-button>
        </template>
        <template v-else>
          <a-button type="primary" @click="handleOk('save')"> 保存</a-button>
          <a-button type="primary" @click="handleOk('sumbit')"> 提交</a-button>
        </template>

        <a-button @click="handleCancel"> 取消</a-button>
      </a-layout-footer>
    </a-layout>
  </a-modal>
</template>
<script>
import fileUpload from "@/components/upLoad/fileUpload";
import {
  operatingTeamedit,
  operatingTeaminsert,
  operatingTeamsendBack,
  operatingTeamselectById,
} from "@/api/dispatchingManagement/SuccessionManagement";

const options = [
  { value: "零点", label: "零点" },
  { value: "八点", label: "八点" },
  { value: "四点", label: "四点" },
];

const optionsCard = [
  { value: "有", label: "有" },
  { value: "无", label: "无" },
];

export default {
  name: "versionManagementDetalis",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    applicationsVisibles: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    owningOption: {
      type: Array,
      default: () => {
        return [];
      },
    },
    formType: String,
    Recodedisabled: Boolean,
  },
  components: { fileUpload },
  data() {
    return {
      options: options,
      optionsCard: optionsCard,
      processData: [{}],
      FieldworkData: [{}],
      equipmentData: [{}],
      flieChanges: [],
      applicationsVisible: false,
      Forme: {},
    };
  },
  created() {},
  mounted() {
    if (this.formType != "add") {
      operatingTeamselectById(this.recode.id).then((res) => {
        this.processData = res.body.listG;
        this.equipmentData = res.body.listS;
        this.FieldworkData = res.body.listX;
      });
    }
  },
  watch: {
    applicationsVisibles(val) {
      this.$nextTick(() => {
        this.Forme = this.recode;
        this.applicationsVisible = val;
        if (this.Forme.reservedFieldTwo) {
          this.flieChanges = JSON.parse(this.Forme.reservedFieldTwo);
        }
      });
    },
  },
  methods: {
    // 班次
    onChange(e) {
      console.log("radio1 checked", e.target.value);
    },
    //工艺操作
    processDataClick() {
      this.processData.push({});
    },
    // 现场作业
    FieldworkClick() {
      this.FieldworkData.push({});
    },
    // 设备及工器具状况
    equipmentClick() {
      this.equipmentData.push({});
    },
    // 接班、退回
    handlesuccession(e) {
      this.Forme["listG"] = this.processData;
      this.Forme["listS"] = this.equipmentData;
      this.Forme["listX"] = this.FieldworkData;
      this.Forme.status = e == "succession" ? 3 : 5;

      if (this.flieChanges.length > 0) {
        let flielist = [];
        this.flieChanges.forEach((element) => {
          let row = { id: element.id, fileName: element.fileName };
          flielist.push(row);
        });
        this.Forme.reservedFieldTwo = flielist;
      }

      let formData = new FormData();

      formData.append("strJson", JSON.stringify(this.Forme));

      operatingTeamsendBack(formData).then((res) => {
        if (res.code == "200") {
          this.handleCancel();
          this.$message.success("操作成功");
        } else {
          this.$message.warning("操作失败");
        }
      });
    },
    handleOk(e) {
      this.Forme["listG"] = this.processData;
      this.Forme["listS"] = this.equipmentData;
      this.Forme["listX"] = this.FieldworkData;
      // 1：已保存  2：交班  3：已完成  5：退回
      this.Forme.status = e == "save" ? 1 : 2;
      if (this.formType != "edit") {
        // 新增、交班
        operatingTeaminsert(this.Forme).then((res) => {
          if (res.code == "200") {
            this.handleCancel();
            this.$message.success("操作成功");
          } else {
            this.$message.warning("操作失败");
          }
        });
      } else {
        // 编辑
        operatingTeamedit(this.Forme).then((res) => {
          if (res.code == "200") {
            this.handleCancel();
            this.$message.success("编辑成功");
          } else {
            this.$message.warning("编辑失败");
          }
        });
      }
    },
    handleCancel() {
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      this.applicationsVisible = false;
      this.Forme = {};
      this.$emit("getList");
    },
    // 文件
    fileListChange(val) {
      this.flieChanges = val;
    },
  },
};
</script>
<style lang="less">
.rangePickerWidth .ant-form-item-control .ant-input {
  width: 495px !important;
}
.table_list {
  .grey {
    background: #f3f5f8;
    /deep/.ant-input {
      background: #f3f5f8;
    }
  }
  text-align: center;
  tr {
    line-height: 36px;
  }
}
</style>
