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
          <a-form-model-item label="所属区域" prop="owningRegion">
            <a-select
              placeholder="请选择"
              v-model="formList.owningRegion"
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
              :disabled="title.includes('详情')"
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
        <a-col :span="8">
          <a-form-model-item label="巡检项名称" prop="inspectionItemName">
            <a-input
              placeholder="请输入"
              v-model="formList.inspectionItemName"
              :disabled="title.includes('详情')"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="单位" prop="units">
            <a-select
              placeholder="请选择"
              v-model="formList.units"
              :disabled="title.includes('详情')"
            >
              <a-select-option
                v-for="(item, index) in unitsOption"
                :value="item.dictname"
                :key="index"
              >
                {{ item.dictname }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="16">
          <a-form-model-item label="参考范围" prop="referenceRangeDown">
            <a-input
              placeholder="请输入下限"
              v-model="formList.referenceRangeDown"
              :disabled="title.includes('详情')"
              class="input-branch"
              @change="
                clearNoNum('referenceRangeDown', formList.referenceRangeDown)
              "
            />
            <span style="margin: 0 4px">-</span>
            <a-input
              placeholder="请输入上限"
              v-model="formList.referenceRangeUp"
              :disabled="title.includes('详情')"
              class="input-branch"
              @change="
                clearNoNum('referenceRangeUp', formList.referenceRangeUp)
              "
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="16">
          <a-form-model-item label="预警范围" prop="warningRangeDown">
            <a-input
              placeholder="请输入下限"
              v-model="formList.warningRangeDown"
              :disabled="title.includes('详情')"
              class="input-branch"
              @change="
                clearNoNum('warningRangeDown', formList.warningRangeDown)
              "
            />
            <span style="margin: 0 4px">-</span>
            <a-input
              placeholder="请输入上限"
              v-model="formList.warningRangeUp"
              :disabled="title.includes('详情')"
              class="input-branch"
              @change="clearNoNum('warningRangeUp', formList.warningRangeUp)"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="基准时间" prop="referenceTime">
            <a-time-picker
              :disabled="title.includes('详情')"
              v-model="formList.referenceTime"
              :format="'HH:mm:ss'"
              :valueFormat="'HH:mm:ss'"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="取数周期" prop="fetchPeriod">
            <a-input
              placeholder="请输入"
              :disabled="title.includes('详情')"
              v-model="formList.fetchPeriod"
              class="fetch-period"
            />
            <a-select
              placeholder="请选择"
              v-model="formList.timeUnits"
              :disabled="title.includes('详情')"
              class="fetch-period-units"
            >
              <a-select-option value="时"> 时 </a-select-option>
              <a-select-option value="分"> 分 </a-select-option>
              <a-select-option value="秒"> 秒 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="停机状态是否记录预警值"
            prop="shutdownStatusRecordValue"
            class="reference-time"
          >
            <a-radio-group
              v-model="formList.shutdownStatusRecordValue"
              :disabled="title.includes('详情')"
            >
              <a-radio value="是"> 是</a-radio>
              <a-radio value="否"> 否 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
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
  insert,
  update
} from "@/api/operatingData/measurementPointCategoryMaintenance";
export default {
  name: 'addAndEdit',
  props: [
    'title',
    'formData',
    'hiddenVisible',
    'owningRegionOption',
    'deviceClassOption',
    'unitsOption'
  ],

  data() {
    return {
      formList: {
        owningRegion: "",
        deviceType: "",
        inspectionItemName: "",
        units: "",
        referenceRangeDown: "",
        referenceRangeUp: "",
        warningRangeDown: "",
        warningRangeUp: "",
        referenceTime: "",
        fetchPeriod: "",
        timeUnits: "",
        shutdownStatusRecordValue: "",
      },
      formListRules: {
        owningRegion: [
          { required: true, message: '请选择所属区域', trigger: 'change' },
        ],
        inspectionItemName: [
          { required: true, message: '巡检项名称不能为空', trigger: 'blur' },
        ],
        units: [
          { required: true, message: '请选择单位', trigger: 'change' },
        ],
        referenceTime: [
          { required: true, message: '请选择基准时间', trigger: 'change' },
        ],
        fetchPeriod: [
          { required: true, message: '取数周期不能为空', trigger: 'blur' },
        ],
        shutdownStatusRecordValue: [
          { required: true, message: '请选择预警值', trigger: 'change' },
        ],
      },
    }
  },
  watch: {
    hiddenVisible: {
      handler(newName) {
        if (newName) {
          this.formList = this.formData
        } else {
          this.$refs.hiddenFormRef.clearValidate()
        }
      },
    },
  },
  mounted() { },

  created() { },
  methods: {
    saveForm() {
      this.$refs.hiddenFormRef.validate((valid) => {
        if (valid) {
          if (!this.formList.timeUnits) {
            this.$message.warning('取数周期不能为空')
            return false
          }
          if (this.formList.id) {
            update(this.formList).then(res => {
              if (res.code == 200) {
                this.$message.success('编辑成功')
                this.$emit('submitForm')
              }
            })
          } else {
            insert(this.formList).then(res => {
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
    }
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
</style>
