<template>
  <div>
    <a-form-model ref="formRef" :model="formModel" :rules="rules">
      <a-row>

        <a-col :span="24">
          <a-form-model-item label="操作规程名称" prop="ruleName">
            <a-input
              v-model.trim="formModel.ruleName"
              placeholder="请输入"
              :disabled="checkForm"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="操作规程描述" prop="remark">
            <a-input
              v-model.trim="formModel.ruleInfo"
              :auto-size="{ minRows: 6, maxRows: 6 }"
              type="textarea"
              :disabled="checkForm"
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="form_piece_title">
        <a-button type="primary" @click="addTableClick" :disabled="checkForm"
          >版本更新
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
            class="version"
          >
            <editable-cell
              :title="text.version"
              :text="text.version"
              :index="index"
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              @change="onCellChange(index, 'version', $event)"
            />
          </a-form-model-item>
        </template>
        <template slot="versionExplain" slot-scope="text, record, index" >
          <a-form-model-item
                  :prop="'fileList[' + index + '].versionExplain'"
                  :rules="rules.version"
                  class="version_explain"
          >
            <editable-cell
                    :title="text.versionExplain"
                    :text="text.versionExplain"
                    :index="index"
                    :edit-show="!checkForm"
                    v-if="hiddenVisible"
                    @change="onCellChange(index, 'versionExplain', $event)"
            />
          </a-form-model-item>
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
  </div>
</template>

<script>
import editableCell from './editableCell.vue'
import fileUpload from './fileUpload.vue'
import { hseFileInsert, hseFileUpdate } from "@/api/HSESystemFileManagement/operatingProcedure"


export default {
  name: "hSESystemFileManagementAddEditForm",
  components: {
    editableCell,
    fileUpload,
  },
  props: ['type', 'hiddenVisible', 'checkForm', 'formEditData'],
  data() {
    return {
      columns: [
          {
              title: '文件名称',
              ellipsis: true,
              width:180,
              customRender: (value, row, index) => {
                  return {
                      children: value.fileID.fileName,
                      attrs: { rowSpan: 1 },
                  };
              },
          },{
          title: '维护时间',
          dataIndex: 'thisUpTime',
          ellipsis: true,
          width: 140,
      }, {
          title: '维护人',
          dataIndex: 'maintainUser',
          ellipsis: true,
          width: 70,
      },{
        title: '版本',
        scopedSlots: { customRender: 'version' },
          ellipsis: true,
        width: 150,
      },{
          title: '版本说明',
          scopedSlots: { customRender: 'versionExplain' },
          ellipsis: true,
          width: 190,
      }, {
        title: '是否启用',
          ellipsis: true,
        scopedSlots: { customRender: 'invocation' },
        width:90,
      }, {
        title: '操作',
        scopedSlots: { customRender: 'operation' },
        width: 120,
      }],
      formModel: {
        fileName: "",
        nowVersion: "",
        orgName: this.$store.state.user.unitName,
        createdUser: this.$store.state.user.name,
        uploadTime: "",
        remark: "",
        type: this.type,
        fileList: []
      },
      rules: {
          ruleName: [
          {
            required: true,
            message: "请输入操作规程名称",
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
                    console.log(JSON.stringify(cloneFormModel))
                    if (this.formModel.id) {
                        // cloneFormModel.id = this.formModel.id
                        // delete cloneFormModel.id

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
            this.formModel.maintainTime=this.formModel.fileList[index].thisUpTime//创建时间
            this.formModel.maintainUser=this.formModel.fileList[index].maintainUser//维护人
            this.formModel.attInfo=JSON.stringify(this.formModel.fileList[index].fileID)//上传附件ID
            this.$set(this.formModel, 'uploadtime',this.getUploadTime())
            this.formModel.fileList.forEach((element, i) => {
                if (index !== i) {
                    if (element.invocation) {
                        console.log(element);
                        this.$set(this.formModel.fileList[i], 'invocation', false)
                        // this.$set(this.formModel.fileList[i],
                        //     'maintainTime', element)
                    }
                }else{
                    this.formModel.maintainTime=this.formModel.fileList[index].thisUpTime//创建时间
                    this.formModel.maintainUser=this.formModel.fileList[index].maintainUser//维护人
                    this.formModel.attInfo=JSON.stringify(this.formModel.fileList[index].fileID)//上传附件ID
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
            this.$set(this.formModel.fileList[index], 'thisUpTime', this.getUploadTime())
            this.$set(this.formModel.fileList[index], 'maintainUser',this.$store.state.user.name)
            this.$set(this.formModel, 'uploadtime',this.getUploadTime())
        },
        getUploadTime() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();//获取系统时间
            let minute = date.getMinutes(); //分
            let second = date.getSeconds();//秒
            month = (month > 9) ? month : ('0' + month);
            day = (day < 10) ? ('0' + day) : day;
            hour = (hour < 10) ? ('0' + hour) : hour;
            minute = (minute < 10) ? ('0' + minute) : minute;
            second = (second < 10) ? ('0' + second) : second;
            return year + '-' + month + '-' + day+' '+hour+':'+minute+':'+second;
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
.version_explain{
  ::v-deep .ant-form-item-control .ant-input {
    width: 150px !important;
  }
}
.version{
  ::v-deep .ant-form-item-control .ant-input {
    width: 110px !important;
  }
}
</style>
