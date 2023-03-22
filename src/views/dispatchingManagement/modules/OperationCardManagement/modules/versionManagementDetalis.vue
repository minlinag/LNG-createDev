<template>
  <a-modal
    :title="`操作卡样式${
      formType == 'add' ? '新增' : formType == 'edit' ? '编辑' : '详情'
    }`"
    :visible="applicationsVisible"
    :footer="null"
    :maskClosable="false"
    @cancel="handleCancel"
    width="60vw"
    class="DcModel"
  >
    <a-form-model ref="dataForm" :model="Forme" :rules="rules" id="addContent">
      <a-layout>
        <a-layout-content id="addContent" style="height: 56vh">
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                label="创建人："
                :labelCol="{ style: 'width: 130px' }"
              >
                <a-input
                  placeholder="请输入"
                  v-model="Forme.createdUser"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="创建日期："
                :labelCol="{ style: 'width: 130px' }"
              >
                <a-input
                  placeholder="请输入"
                  v-model="Forme.createdDateTime"
                  disabled
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                label="操作卡名称："
                prop="operationCardName"
                :labelCol="{ style: 'width: 130px' }"
              >
                <a-input
                  :disabled="Recodedisabled"
                  placeholder="请输入操作卡名称"
                  v-model="Forme.operationCardName"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item
                label="操作类型："
                prop="operationCardType"
                :labelCol="{ style: 'width: 130px' }"
              >
                <a-select
                  :disabled="Recodedisabled"
                  v-model="Forme.operationCardType"
                  placeholder="请选择"
                  allowClear
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
          </a-row>
          <a-row>
            <div class="buttonInput">
              <a-col :span="8">
                <a-form-model-item
                  label="设备名称"
                  :labelCol="{ style: 'width: 160px' }"
                >
                  <a-input
                    v-model.trim="Forme.reservedFieldOne"
                    placeholder="请选择"
                    disabled
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="4">
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
            <a-col :span="12">
              <a-form-model-item
                label="设备位号"
                :labelCol="{ style: 'width: 130px' }"
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
            <a-col :span="12">
              <a-form-model-item
                label="工艺单元："
                prop="owningSystem"
                :labelCol="{ style: 'width: 130px' }"
              >
                <a-select
                  :disabled="Recodedisabled"
                  v-model="Forme.owningSystem"
                  placeholder="请选择"
                  allowClear
                >
                  <a-select-option
                    :value="item.value"
                    :key="index"
                    v-for="(item, index) in owningOption"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="操作卡样式"
                :labelCol="{ style: 'width: 130px' }"
              >
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
              <a-form-item label="说明：" :labelCol="{ style: 'width: 110px' }">
                <a-textarea
                  v-model="Forme.states"
                  :disabled="Recodedisabled"
                  v-decorator="['remark']"
                  :placeholder="`${Recodedisabled ? '' : '请输入说明'}`"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <equipmentModel
            ref="equipmentModel"
            :equipmentVisible.sync="equipmentVisible"
            @selectedClic="selectedClic"
          />
        </a-layout-content>
        <a-layout-footer>
          <a-button type="primary" v-if="formType != 'look'" @click="handleOk">
            保存
          </a-button>
          <a-button @click="handleCancel"> 取消</a-button>
        </a-layout-footer>
      </a-layout>
    </a-form-model>
  </a-modal>
</template>
<script>
import fileUpload from "@/components/upLoad/fileUpload";
import equipmentModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue";

import {
  insertSelective,
  updateSelective,
} from "@/api/dispatchingManagement/versionManagement";
import { queryFileByRelatedId } from "@/api/dispatchingManagement/yearProductionOperation";

export default {
  name: "versionManagementDetalis",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    owningOption: {
      type: Array,
      default: () => {
        return [];
      },
    },
    applicationsVisibles: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    Recodedisabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    formType: String,
  },
  components: { fileUpload, equipmentModel },
  data() {
    return {
      equipmentVisible: false,
      applicationsVisible: false,
      flieChanges: [],
      Forme: {},
      TypeOption: [
        { value: "启动", label: "启动" },
        { value: "停止", label: "停止" },
        { value: "隔离/恢复", label: "隔离/恢复" },
        { value: "其他", label: "其他" },
      ],
      rules: {
        operationCardName: [{ required: true, message: "操作卡名称不能为空" }],
        operationCardType: [{ required: true, message: "操作类型不能为空" }],
        owningSystem: [{ required: true, message: "工艺单元不能为空" }],
      },
    };
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
    selectedClic(value) {
      this.Forme.reservedFieldOne = value.eqm_sbmc;
      this.Forme.deviceNo = value.eqm_sbwh;
      this.equipmentVisible = false;
    },
    handleOk() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          let formData = new FormData();

          let flielist = [];
          this.flieChanges.forEach((element) => {
            let row = { id: element.id, fileName: element.fileName };
            flielist.push(row);
          });
          this.Forme.reservedFieldTwo = flielist;
          formData.append("strJson", JSON.stringify(this.Forme));

          if (this.Forme.reservedFieldOne) {
            if (this.formType == "add") {
              if (this.$refs.importConpontsDataRef) {
                insertSelective(formData).then((res) => {
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
              updateSelective(formData).then((res) => {
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
      this.$emit("getList");
      this.applicationsVisible = false;
      this.Forme = {};
      this.$nextTick(() => {
        let dom = document.getElementById("addContent");
        if (dom !== null) {
          dom.scrollTop = 0;
        }
      });
      this.$refs.dataForm.clearValidate()
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
