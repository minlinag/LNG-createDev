<template>
  <div>
    <a-form-model ref="formRef" :model="formModel" :rules="rules">
      <a-row>
        <div class="form_piece_title">
          <span>文件管理</span>
        </div>
        <a-col :span="8">
          <a-form-model-item label="文件名称" prop="fileName">
            <a-input
              v-model.trim="formModel.fileName"
              placeholder="请输入"
              :disabled="checkForm"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="当前版本" prop="nowVersion">
            <a-input
              v-model.trim="formModel.nowVersion"
              placeholder="自动带入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="创建日期" prop="createdDateTime">
            <a-input
              v-model.trim="formModel.createdDateTime"
              placeholder="自动带入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="录入人" prop="createdUser">
            <a-input
              v-model.trim="formModel.createdUser"
              placeholder="自动带入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="上传日期" prop="uploadTime">
            <a-input
              v-model.trim="formModel.uploadTime"
              placeholder="自动带入"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="16">
          <a-form-model-item label="编制单位" prop="orgName">
            <a-tooltip :trigger="['hover']" :disabled="false">
              <template slot="title">{{ formModel.orgName }} </template>
              <span>
                <a-input
                  v-model.trim="formModel.orgName"
                  placeholder="自动带入"
                  disabled
                  style="width: calc(100% - 14px)"
                ></a-input>
              </span>
            </a-tooltip>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="备注" prop="remark">
            <a-input
              v-model.trim="formModel.remark"
              :auto-size="{ minRows: 6, maxRows: 6 }"
              type="textarea"
              :disabled="checkForm"
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="form_piece_title">
        <span>文件管理</span>
        <a-button type="primary" @click="addTableClick" :disabled="checkForm"
          >新增
        </a-button>
      </div>
      <a-table
        :scroll="{ y: 200, x: 300 }"
        :pagination="false"
        :columns="columns"
        :dataSource="formModel.fileList"
        :openSelector="true"
        class="file_list"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
      >
        <template slot="version" slot-scope="text, record, index">
          <a-form-model-item
            :prop="'fileList[' + index + '].version'"
            :rules="rules.version"
          >
            <editable-cell
              :text="text.version"
              :index="index"
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              @change="onCellChange(index, 'version', $event)"
            />
          </a-form-model-item>
        </template>
        <template slot="fileName" slot-scope="text, record">
          <a-button type="link" class="btn_link" @click="previewClick(record)"
            >{{ record.fileID.fileName }}
          </a-button>
        </template>
        <template slot="invocation" slot-scope="text, record, index">
          <a-switch
            v-model="text.invocation"
            :disabled="checkForm"
            @change="onInvocationChange(text, record, index)"
          />
        </template>

        <!-- 行内操作列按钮 -->
        <template slot="operation" slot-scope="text, record, index">
          <file-upload
            :className="['btn_link']"
            :Text="'上传'"
            style="display: inline-block"
            @fileChange="fileChange($event, index)"
            :fileQuantity="1"
            :accept="'.pdf'"
            :fileType="'pdf'"
            :disabled="checkForm"
          ></file-upload>
          <a-button
            type="link"
            class="btn_link download_style"
            @click="downloadClick(record)"
            :disabled="!record.fileID.id"
            >下载
          </a-button>
          <a-button
            type="link"
            @click="deleteClick(text, record, index)"
            class="delete_color btn_link"
            :disabled="checkForm"
            >删除
          </a-button>
        </template>
      </a-table>
    </a-form-model>
    <pdf-preview
      :pdf-show="previewShow"
      :pdf-url="previewUrl"
      @pdfCancel="previewCancel"
      v-if="previewShow"
    ></pdf-preview>
  </div>
</template>

<script>
import editableCell from './editableCell.vue'
import fileUpload from './fileUpload.vue'
import { hseFileInsert, hseFileUpdate } from "@/api/HSESystemFileManagement/HSESystemFileManagement"
import pdfPreview from '@/components/pdf/index.vue'
import { downloadFileById } from '@/api/public'

export default {
  name: "hSESystemFileManagementAddEditForm",
  components: {
    editableCell,
    fileUpload,
    pdfPreview,
  },
  props: ['type', 'hiddenVisible', 'checkForm', 'formEditData'],
  data() {
    return {
      columns: [{
        title: '版本',
        scopedSlots: { customRender: 'version' },
        width: 220,
      }, {
        title: '上传日期',
        dataIndex: 'uploadTime',
        width: 100,
      }, {
        title: '文件名称',
        scopedSlots: { customRender: 'fileName' },
      }, {
        title: '是否启用',
        scopedSlots: { customRender: 'invocation' },
        width: 100,
      }, {
        title: '操作',
        scopedSlots: { customRender: 'operation' },
        width: 200,
      }],
      formModel: {
        fileName: "",
        nowVersion: "",
        orgName: this.$store.state.user.unitName,
        createdDateTime: this.getUploadTime(),
        createdUser: this.$store.state.user.name,
        uploadTime: "",
        remark: "",
        type: this.type,
        fileList: []
      },
      previewUrl: "",
      previewShow: false,
      rules: {
        fileName: [
          {
            required: true,
            message: "请输入文件名称",
            trigger: "blur",
          },
        ],
      }
    }
  },
  watch: {
    'formModel.fileList': {
      handler(val) {
        if (val.length === 0) {
          return false
        }
        val.forEach(element => {
          if (element.invocation) {
            this.formModel.nowVersion = element.version
            this.formModel.uploadTime = element.uploadTime
          }
        });
      },
      immediate: true,
      deep: true,
    },
    hiddenVisible: {
      handler(val) {
        if (!val) {
          this.$refs.formRef.clearValidate()
        } else {
          this.formModel = this.$lodash.cloneDeep(this.formEditData);
        }

      },
      immediate: true,

    }
  },
  methods: {
    confirm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let isInvocation = false
          if (this.formModel.fileList.length === 0) {
            this.$message.warn(`文件管理至少要有一条数据`);
          }
          let cloneFormModel = this.$lodash.cloneDeep(this.formModel);
          let uselessKey = ['createdDateTimeSubstitute', 'uploadTimeSubstitute']
          for (const key in cloneFormModel) {
            if (Object.hasOwnProperty.call(cloneFormModel, key)) {
              if (uselessKey.includes(key)) {
                delete cloneFormModel[key];
              }
            }
          }
          for (let index = 0; index < this.formModel.fileList.length; index++) {
            const element = this.formModel.fileList[index];

            for (const key in cloneFormModel.fileList[index]) {
              if (Object.hasOwnProperty.call(cloneFormModel.fileList[index], key)) {
                if ('uploadTimeSubstitute' == key) {
                  delete cloneFormModel.fileList[index][key];
                }
              }
            }
            cloneFormModel.fileList[index].invocation = element.invocation === false ? '0' : '1'
            if (!element.version) {
              this.$message.warn(`请输入版本`);
              return false
            }
            if (!element.fileID.id) {
              this.$message.warn(`上传文件不能为空`);
              return false
            }
            cloneFormModel.fileList[index].fileID = this.$fileUploadJSON.toJsonString(
              element.fileID
            );
            if (element.invocation) {
              isInvocation = true
            }
            for (let i = 0; i < this.formModel.fileList.length; i++) {
              const e = this.formModel.fileList[i];
              if (i !== index) {
                if (e.version === element.version) {
                  this.$message.warn(`版本名称不可重复`);
                  return false
                }
              }
            }
          }
          if (!isInvocation) {
            this.$message.warn(`请启用一条数据`);
            return false
          }
          if (this.formModel.ID) {
            cloneFormModel.id = this.formModel.ID
            delete cloneFormModel.ID
            hseFileUpdate(cloneFormModel).then(res => {
              if (res.code == '200') {
                this.$emit('cancel')
              }
            })

          } else {
            hseFileInsert(cloneFormModel).then(res => {
              console.log(res);
              if (res.code == "200") {
                this.$emit('cancel')
              }
            })
          }
        }
      })
    },
    addTableClick() {
      this.formModel.fileList.push(
        {
          version: "",
          uploadTime: "",
          invocation: false,
          fileID: {
            id: "",
            fileName: "",
          },
        }
      )
    },
    onCellChange(index, dataIndex, value) {
      this.formModel.fileList[index][dataIndex] = value
    },
    onInvocationChange(text, record, index) {
      this.formModel.fileList.forEach((element, i) => {
        if (index !== i) {
          if (element.invocation) {
            this.$set(this.formModel.fileList[i], 'invocation', false)
          }
        }
      });
    },
    uploadClick() {

    },
    downloadClick(row) {
      window.location.href = Glod.DEVE_LOPMENT_ENVIRONMENT + 'fileinfo/downloadFileById?id=' + row.fileID.id + '&dType=d'
    },
    deleteClick(text, record, index) {
      this.formModel.fileList.splice(index, 1);
    },
    fileChange(val, index) {
      this.formModel.fileList[index].fileID = {
        id: val[0].id,
        fileName: val[0].fileName,
      };
      this.$set(this.formModel.fileList[index], 'uploadTime', this.getUploadTime())
    },
    previewClick(row) {
      downloadFileById({ id: row.fileID.id, dType: "b" }).then((response) => {
        let blob = new Blob([response instanceof Blob ? response : response.data], { type: 'application/pdf' });
        const href = URL.createObjectURL(blob);
        this.previewShow = true
        this.previewUrl = href
      });
    },
    previewCancel() {
      this.previewShow = false
    },
    getUploadTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = (month > 9) ? month : ('0' + month);
      day = (day < 10) ? ('0' + day) : day;
      return year + '-' + month + '-' + day;
    }
  }
}
</script>

<style lang="less" scoped>
.form_piece_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  span {
    font-size: 14px;
    font-weight: 700;
  }
}
.file_list {
  ::v-deep .ant-form-item {
    margin-bottom: 0px;
  }
  .delete_color {
    color: #ff4d4f;
  }
  .delete_color[disabled] {
    color: rgba(0, 0, 0, 0.25);
  }
  .download_style {
    padding-left: 5px;
    border-left: 1px solid #ccc;
  }
}
.ant-input[disabled] {
  color: #000;
}
</style>