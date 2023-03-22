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
            <a-input
              placeholder="请输入"
              v-model="formList.deviceType"
              :disabled="title.includes('详情')"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="排序" prop="sorting">
            <a-input
              placeholder="请输入"
              v-model="formList.sorting"
              @blur="onSortingBlur"
              :disabled="title.includes('详情')"
            />
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
} from "@/api/operatingData/deviceTypeMaintenance";
export default {
  name: 'addAndEdit',
  props: [
    'title',
    'formData',
    'hiddenVisible',
    'owningRegionOption'
  ],

  data() {
    return {
      formList: {
        owningRegion: undefined,
        deviceType: "",
        sorting: "",
      },
      formListRules: {
        owningRegion: [
          { required: true, message: '请选择所属区域', trigger: 'change' },
        ],
        deviceType: [
          { required: true, message: '设备类型不能为空', trigger: 'blur' },
        ],
        sorting: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
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
    onSortingBlur() {
      if (this.formList.sorting) {
        this.formList.sorting = this.formList.sorting.replace(/[^\d]/g, '')
      }
    },
    saveForm() {
      this.$refs.hiddenFormRef.validate((valid) => {
        if (valid) {
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
</style>
