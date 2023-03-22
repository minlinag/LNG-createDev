<template>
  <a-modal
    :title="title"
    :visible="hiddenVisible"
    @cancel="formClose"
    class="from-style bigModel"
    :maskClosable="false"
  >
    <a-form-model :model="formList" ref="hiddenFormRef" :rules="formListRules">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="维护类别" prop="maintenanceCategory">
            <a-select
              placeholder="请选择"
              :v-model="formList.maintenanceCategory"
              @change="maintenanceCategoryChange"
            >
              <a-select-option :value="'1'"> 按设备 </a-select-option>
              <a-select-option :value="'2'"> 按巡检项 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="区域" prop="owningRegion">
            <a-select
              placeholder="请选择"
              v-model="formList.owningRegion"
              @change="formChange"
              :disabled="title.includes('详情')"
            >
              <a-select-option
                v-for="(item, index) in owningRegionOption"
                :value="item.dictname"
                :key="index"
              >
                {{ item.dictname }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="设备类型" prop="deviceType">
            <a-select
              placeholder="请选择"
              v-model="formList.deviceType"
              @change="formChange"
              :disabled="title.includes('详情')"
              allowClear
            >
              <a-select-option
                v-for="(item, index) in deviceClassOption"
                :value="item"
                :key="index"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="formList.maintenanceCategory == 1">
          <a-form-model-item
            label="设备名称"
            prop="deviceName"
            class="device-name"
          >
            <a-input
              v-model="formList.deviceName"
              placeholder="请选择"
              disabled
            />
            <a-button
              type="primary"
              style="margin-left: 10px"
              @click="getDeviceNo"
            >
              选择
            </a-button>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="formList.maintenanceCategory == '1'">
          <a-form-model-item label="设备位号" prop="deviceNo">
            <a-input v-model="formList.deviceNo" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="formList.maintenanceCategory == '1'">
          <a-form-model-item label="动/静设备类别" prop="dynamicEquipType">
            <a-input
              placeholder="请输入"
              v-model="formList.dynamicEquipType"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="formList.maintenanceCategory == '2'">
          <a-form-model-item label="巡检项名称" prop="inspectionItemName">
            <a-input
              placeholder="请输入"
              v-model="formList.inspectionItemName"
              @blur="formChange"
              :disabled="title.includes('详情')"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <maintain-list
      :list="maintainLableList"
      v-show="maintainLableList.length > 0"
      ref="maintainListRef"
      style="margin-left: 20px; margin-right: 20px"
    ></maintain-list>
    <device-radio-list
      :hidden-visible="deviceRadioListHiddenVisible"
      @close="deviceRadioListClose"
      @confirm="deviceRadioListConfirm"
    ></device-radio-list>
    <template #footer>
      <div style="text-align: center">
        <a-button
          type="primary"
          @click="saveForm()"
          v-if="!title.includes('详情')"
        >
          保存
        </a-button>
        <a-button @click="formClose">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script>

import {
  insertBatch,
  update,
  queryMaintainData
} from "@/api/operatingData/instrumentTagManagement";
import deviceRadioList from "@/views/operatingData/instrumentTagManagement/components/deviceRadioList.vue";
import maintainList from "@/views/operatingData/instrumentTagManagement/components/maintainList.vue";
export default {
  name: 'addAndEdit',
  props: [
    'title',
    'formData',
    'hiddenVisible',
    'owningRegionOption',
    'deviceClassOption',
    'unitsOption',
    'lableList'
  ],
  components: {
    deviceRadioList,
    maintainList
  },
  data() {
    return {
      formList: {
        maintenanceCategory: '',
        owningRegion: "",
        deviceType: "",
        inspectionItemName: "",
        deviceName: "",
        deviceNo: "",
        dynamicEquipType: "",
      },
      maintainLableList: [],
      deviceRadioListHiddenVisible: false,
      formListRules: {
        maintenanceCategory: [
          { required: true, message: '请选择维护类别', trigger: 'change' },
        ],
        owningRegion: [
          { required: true, message: '请选择所属区域', trigger: 'change' },
        ],
        inspectionItemName: [
          { required: true, message: '巡检项名称不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {
    hiddenVisible: {
      handler(newName) {
        if (newName) {
          this.formList = this.$lodash.cloneDeep(this.formData)
          this.maintainLableList = this.$lodash.cloneDeep(this.lableList)
        } else {
          this.$refs.hiddenFormRef.clearValidate()
        }
      },
    },
  },
  mounted() { },

  created() { },
  methods: {
    formChange() {
      if (!this.formList.owningRegion) {
        return false
      }
      if (this.formList.maintenanceCategory == 2 && !this.formList.inspectionItemName) {
        return false
      }
      this.getMaintainData(this.formList.maintenanceCategory)
    },
    maintenanceCategoryChange(val) {
      this.formList.maintenanceCategory = val
      this.maintainLableList = []
      if (val == 1) {
        this.formList.inspectionItemName = ""
        // 判断this.formListRules内是否有inspectionItemName 有就删除
        if (this.formListRules.inspectionItemName) {
          delete this.formListRules.inspectionItemName
        }
        this.$refs.hiddenFormRef.clearValidate()
        if (this.formList.owningRegion) {
          this.getMaintainData()
        }
      } else if (val == 2) {
        this.formList.deviceName = ""
        this.formList.deviceNo = ""
        this.formList.dynamicEquipType = ""
        // 判断this.formListRules内是否有inspectionItemName 没有就添加
        if (!this.formListRules.inspectionItemName) {
          this.formListRules.inspectionItemName = [
            { required: true, message: '巡检项名称不能为空', trigger: 'blur' },
          ]
        }

        this.$refs.hiddenFormRef.clearValidate()
        if (this.formList.owningRegion && this.formList.inspectionItemName) {
          this.getMaintainData(val)
        }
      }
    },
    getMaintainData(val) {
      queryMaintainData({
        owningRegion: this.formList.owningRegion,
        deviceType: this.formList.deviceType,
        inspectionItemName: val == 2 ? this.formList.inspectionItemName : null
      }).then(res => {
        if (res.code == "200") {
          this.maintainLableList = res.body
          if (this.formList.deviceName) {
            this.maintainLableList.forEach(element => {
              this.$set(element, 'deviceName', this.formList.deviceName)
            });
          }
        }
      })
    },
    saveForm() {
      this.$refs.hiddenFormRef.validate((valid) => {
        if (valid) {

          let formList = this.$refs.maintainListRef.tableList.map(item => {
            let newItem = item
            newItem.owningRegion = this.formList.owningRegion
            newItem.deviceType = this.formList.deviceType
            newItem.inspectionItemName = this.formList.inspectionItemName
            newItem.deviceName = this.formList.deviceName
            newItem.deviceNo = this.formList.deviceNo
            newItem.dynamicEquipType = this.formList.dynamicEquipType
            return newItem
          })
          if (this.formList.id) {
            update(formList).then(res => {
              if (res.code == 200) {
                this.$message.success('编辑成功')
                this.$emit('submitForm')
              }
            })
          } else {
            insertBatch(formList).then(res => {
              if (res.code == 200) {
                this.$message.success('保存成功')
                this.$emit('submitForm')
              }
            })
          }
        } else {
          this.$message.warning('必填信息输入不完整')
          return false
        }
      })
    },
    formClose() {
      this.$emit('close')
    },
    clearNoNum(name, val) {
      // eslint-disable-next-line no-useless-escape
      this.formList[name] = String(val).replace(/\.{2,}/g, ".").replace(/[^\d.]/g, "").replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
    },
    getDeviceNo() {
      this.deviceRadioListHiddenVisible = true
    },
    deviceRadioListClose() {
      this.deviceRadioListHiddenVisible = false
    },
    deviceRadioListConfirm(data) {
      this.formList.deviceName = data.equipment_name
      this.formList.deviceNo = data.equipment_tag_no
      this.formList.dynamicEquipType = data.deviceType
      this.deviceRadioListHiddenVisible = false
      this.maintainLableList.forEach(element => {
        this.$set(element, 'deviceName', data.equipment_name)
      });
    },
  },
}
</script>
<style scoped lang="less">
// .add_and_edit {
//   .ant-col-24 {
//     width: 100%;
//   }
// }
.ant-input[disabled] {
  color: #000;
}
.apply_reason {
  ::v-deep .ant-col-2 {
    width: auto;
  }
}
.form_table {
  .ant-form-item {
    margin-bottom: 0;
  }
  ::v-deep .ant-table-fixed-right .ant-table-tbody > tr {
    height: 56.8px !important;
  }
}
.bigModel .ant-modal-content .ant-form,
.bigModel .ant-modal-body .ant-form {
  max-height: 598px !important;
}
.input-branch {
  width: calc(50% - 14px) !important;
}
.fetch-period {
  width: calc(180px - 40%) !important;
  vertical-align: bottom;
}
.fetch-period-units {
  width: calc(180px - 60%) !important;
  vertical-align: bottom;
  ::v-deep .ant-select-selection {
    width: 100% !important;
  }
}

.reference-time {
  ::v-deep .ant-form-item-label {
    min-width: 190px;
    label {
      min-width: 190px;
    }
  }
}

.device-name {
  ::v-deep .ant-input {
    width: calc(100% - 80px) !important;
  }
}
.from-style .ant-modal-content .ant-form {
  padding-bottom: 0;
}
</style>
