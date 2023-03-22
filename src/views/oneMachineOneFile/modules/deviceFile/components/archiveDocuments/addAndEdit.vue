<template>
  <a-modal
    :title="formTitle"
    :visible="hiddenVisible"
    @cancel="cancelHidden"
    class="from-style bigModel"
    :footer="null"
    :maskClosable="false"
  >
    <a-form-model :model="formList" ref="hiddenFormRef" :rules="formListRules">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="文件类型" prop="selfCode">
            <a-tree-select
              v-model="formList.selfCode"
              placeholder="请选择文件类型"
              allow-clear
              :replaceFields="{
                children: 'children',
                title: 'label',
                value: 'code',
                key: 'code',
              }"
              :treeData="treeSelectOption"
              @select="eqmTypeSelect"
            >
            </a-tree-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="文件编号 " prop="fileNo">
            <a-input disabled v-model="formList.fileNo" />
          </a-form-model-item>
        </a-col>

        <a-col :span="24">
          <a-form-model-item label="说明" prop="remake">
            <a-input
              v-model="formList.remake"
              type="textarea"
              :auto-size="{ minRows: 6 }"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="附件上传" prop="flieList">
            <file-upload
              :Text="'上传文件'"
              @fileChange="fileChange"
              ref="importConpontsDataRef"
            ></file-upload>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button type="primary" @click="saveForm"> 确定 </a-button>
      <a-button @click="cancelHidden">取消</a-button>
    </div>
  </a-modal>
</template>
<script>
// import importConpontsData from '@/components/importConpontsData'
import fileUpload from "@/components/upLoad/fileUpload";
import { pinyin } from 'pinyin-pro'
export default {
  name: 'addAndEdit',
  components: {
    fileUpload,
  },
  props: [
    'formTitle',
    'formdata',
    'hiddenVisible',
    'stateMonitor',
    'fileTypeOption',
  ],

  data() {
    return {
      formList: {
        eqmType: '',
        fileNo: '',
        fileName: '',
        remake: '',
        flieList: [],
        parentCode: '',
        selfCode: '',
      },
      treeSelectOption: [],
      formListRules: {
        selfCode: [
          { required: true, message: '请选择文件类型', trigger: 'change' },
        ],
        fileNo: [
          { required: true, message: '请输入文件编号', trigger: 'blur' },
        ],
        flieList: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 0) {
                callback()
              } else {
                callback(new Error('上传文件不可为空'))
              }
            },
            trigger: 'change',
          },
        ],
      },
    }
  },
  watch: {
    fileTypeOption: {
      handler(val) {
        let newVal = this.$lodash.cloneDeep(val)
        this.treeSelectOption = this.forbidBrunk(newVal)
      },
      immediate: true,
      deep: true,
    },
    hiddenVisible: {
      handler(newName) {
        if (newName) {
          this.formList = this.formdata
        } else {
          this.$refs.importConpontsDataRef.removeFile()
        }
      },
    },
  },
  mounted() { },

  created() { },
  methods: {
    forbidBrunk(val) {
      let [...newVal] = val
      newVal.forEach((element) => {
        if (element.children.length > 0) {
          element.selectable = false
          element = this.forbidBrunk(element.children)
        }
      })
      return newVal
    },
    eqmTypeSelect(value, node, extra) {
      this.formList.parentCode = node.dataRef.parentCode
      this.formList.eqmType = node.dataRef.label
      let pinyinFirst
      if (this.formList.eqmType) {
        pinyinFirst = pinyin(this.formList.eqmType, {
          pattern: 'first',
          toneType: 'none',
        })
          .replace(/\s*/g, '')
          .toUpperCase()
      }
      this.formList.fileNo = pinyinFirst + new Date().getTime()
    },
    cancelHidden() {
      this.formClose()
    },
    saveForm() {
      this.onSubmit('save')
    },
    onSubmit(val) {
      if (this.formList.flieList.length == 0) {
        this.$message.warning('资源不能为空')
        return false
      }
      this.$refs.hiddenFormRef.validate((valid) => {
        if (valid) {
          if (val == 'save') {
            this.$emit('submitForm', this.formList)
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
    fileChange(val) {
      this.formList.flieList = val
    },
  },
}
</script>
<style scoped lang="less">
.add_and_edit {
  ::v-deep .ant-modal-body {
    padding-top: 53px;
  }
  .ant-col-24 {
    width: 100%;
  }
}
</style>
