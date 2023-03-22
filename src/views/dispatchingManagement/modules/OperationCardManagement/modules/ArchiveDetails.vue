<template>
  <a-modal
    :title="`操作卡归档${
      formType == 'add' ? '新增' : formType == 'edit' ? '编辑' : '详情'
    }`"
    :visible="applicationsVisible"
    :footer="null"
    :maskClosable="false"
    @cancel="handleCancel"
    class="from-style bigModel"
  >
    <a-form-model ref="dataForm" :model="Forme" :rules="rules">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="操作卡归档编号：">
            <a-input
              placeholder="请输入"
              v-model="Forme.equipmentCode"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="归档时间：">
            <a-input
              placeholder="请输入"
              v-model="Forme.createdDateTime"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="归档人：">
            <a-input
              placeholder="请输入"
              v-model="Forme.createdUser"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="操作类型：" prop="operationType">
            <a-select
              allowClear
              :disabled="Recodedisabled"
              v-model="Forme.operationType"
              placeholder="请选择"
            >
              <a-select-option
                :value="item.value"
                :key="index"
                v-for="(item, index) in TypeOption"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <div class="buttonInput">
          <a-col :span="6">
            <a-form-model-item
              label="设备名称"
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-input
                v-model.trim="Forme.reservedFieldOne"
                placeholder="请选择"
                disabled
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="2">
            <a-form-model-item>
              <a-button
                type="primary"
                :disabled="Recodedisabled"
                @click="equipmentVisible = true"
                >选择</a-button
              >
            </a-form-model-item>
          </a-col>
        </div>
        <a-col :span="8">
          <a-form-model-item
            label="设备位号"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              v-model.trim="Forme.deviceNo"
              placeholder="请选择"
              disabled
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="工艺单元：" prop="owningSystem">
            <a-select
              placeholder="请选择工艺单元"
              v-model="Forme.owningSystem"
              disabled
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
        <a-col :span="8">
          <a-form-model-item label="操作时间：" prop="operationTime">
            <a-date-picker
              show-time
              v-model="Forme.operationTime"
              :disabled="Recodedisabled"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
            >
            </a-date-picker>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="操作卡名称：" prop="operationCardName">
            <a-input
              :disabled="Recodedisabled"
              placeholder="请输入操作卡名称"
              v-model="Forme.operationCardName"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="附件上传">
            <file-upload
              :Text="'上传文件'"
              @fileChange="fileListChange"
              :echoList="flieChanges"
              :disabled="Recodedisabled"
              :fileQuantity="1"
              ref="importConpontsDataRef"
            ></file-upload>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="说明">
            <a-textarea
              v-model="Forme.states"
              :disabled="Recodedisabled"
              v-decorator="['remark']"
              placeholder="请输入说明"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <div class="ant-modal-footer" v-if="formType != 'look'">
        <a-button type="primary" @click="handleOk"> 保存</a-button>
        <a-button @click="handleCancel"> 取消</a-button>
      </div>
    </a-form-model>
    <equipmentModel
      ref="equipmentModel"
      :equipmentVisible.sync="equipmentVisible"
      @selectedClic="selectedClic"
    />
  </a-modal>
</template>
<script>
import fileUpload from "@/components/upLoad/fileUpload";
import equipmentModel from "./equipmentModel.vue";

import {
  operationCardGDinsert,
  operationCardGDupdate,
  getdict,
} from "@/api/dispatchingManagement/versionManagement";

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
    formType: String,
    Recodedisabled: Boolean,
  },
  components: { fileUpload, equipmentModel },
  data() {
    return {
      equipmentVisible: false,
      applicationsVisible: false,
      flieChanges: [],
      owningOption: [],
      Forme: {},
      TypeOption: [
        { value: "启动", label: "启动" },
        { value: "停止", label: "停止" },
        { value: "隔离/恢复", label: "隔离/恢复" },
        { value: "其他", label: "其他" },
      ],
      rules: {
        operationCardName: [{ required: true, message: "操作卡名称不能为空" }],
        operationType: [{ required: true, message: "操作类型不能为空" }],
        owningSystem: [{ required: true, message: "工艺单元不能为空" }],
        operationTime: [{ required: true, message: "操作时间不能为空" }],
      },
    };
  },
  mounted() {
    let dict = [];
    getdict().then((res) => {
      res.body.data.forEach((item) => {
        dict.push({ value: item.dictcode, label: item.dictname });
      });
    });
    this.owningOption = dict;
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
    handleOk() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          let formData = new FormData();

          if (this.flieChanges.length > 0) {
            let flielist = [];
            this.flieChanges.forEach((element) => {
              let row = { id: element.id, fileName: element.fileName };
              flielist.push(row);
            });
            this.Forme.reservedFieldTwo = flielist;
          }

          formData.append("strJson", JSON.stringify(this.Forme));
          if (this.Forme.reservedFieldOne) {
            if (this.formType == "add") {
              if (this.flieChanges.length > 0) {
                operationCardGDinsert(formData).then((res) => {
                  if (res.code == "200") {
                    this.handleCancel();
                    this.$message.success("新增成功");
                  } else {
                    this.$message.warning("新增失败");
                  }
                });
              } else {
                this.$message.warning("请上传附件");
              }
            } else {
              operationCardGDupdate(formData).then((res) => {
                if (res.code == "200") {
                  this.handleCancel();
                  this.$message.success("编辑成功");
                } else {
                  this.$message.warning("编辑失败");
                }
              });
            }
          } else {
            this.$message.warning("设备名称不能为空");
          }
        }
      });
    },
    handleCancel() {
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      this.applicationsVisible = false;
      this.Forme = {};
      this.$emit("getList");
      this.$refs.dataForm.clearValidate()
    },
    selectedClic(value) {
      this.Forme.reservedFieldOne = value.reservedFieldOne;
      this.Forme.deviceNo = value.deviceNo;
      this.Forme.owningSystem = value.owningSystem;
      this.equipmentVisible = false;
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
</style>
