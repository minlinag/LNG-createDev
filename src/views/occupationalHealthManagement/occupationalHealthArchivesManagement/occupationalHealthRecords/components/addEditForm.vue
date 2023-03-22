<template>
  <div>
    <a-form-model
      ref="formRef"
      :model="formModel"
      :rules="rules"
      class="position-change-person-add-form"
      v-if="!recordForm"
    >
      <a-row>
        <div class="form_piece_title">
          <span>基础信息</span>
        </div>
        <a-col :span="8">
          <a-form-model-item
            label="姓名"
            prop="person"
            class="no_disabled_style"
          >
            <a-input
              v-model.trim="formModel.person"
              placeholder="请输入"
              :disabled="isAssessment"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="人员编号" prop="personNo" class="person_no">
            <a-input
              v-model.trim="formModel.personNo"
              placeholder="自动生成"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="单位名称"
            prop="unitName"
            class="no_disabled_style"
          >
            <a-select
              ref="select"
              v-model="formModel.unitName"
              placeholder="请选择"
              :getPopupContainer="getPopupContainer"
              @change="unitNameChange"
              :disabled="isAssessment"
            >
              <a-select-option
                v-for="item in inspectedUnitOptions"
                :key="item.value"
                :value="item.label"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="岗位名称"
            prop="postName"
            class="no_disabled_style"
          >
            <a-select
              ref="select"
              v-model="formModel.postName"
              placeholder="请选择"
              :getPopupContainer="getPopupContainer"
              :disabled="isAssessment"
            >
              <a-select-option
                v-for="item in postNameOptions"
                :key="item"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div v-if="isAssessment">
        <div class="form_piece_title">
          <span>危害因素</span>
        </div>
        <a-col :span="24">
          <a-form-model-item
            label="危害因素"
            prop="harmFactor"
            class="no_disabled_style"
          >
            <a-input
              v-model.trim="formModel.harmFactor"
              placeholder="请输入"
              disabled
              type="textarea"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </div>
      <div v-if="isAssessment">
        <div v-if="isAssessment">
          <div class="form_piece_title">
            <span>体检项目</span>
          </div>
          <a-table
            :scroll="{ y: 200, x: 300 }"
            :pagination="projectPagination"
            :columns="physicalExaminationColumns"
            :dataSource="physicalExaminationTableList"
            :openSelector="true"
            @change="projectPaginationChange"
            class="file_list multi_line"
            :rowKey="
              (record, index) => {
                return projectPagination.current + '' + index;
              }
            "
          >
          </a-table>
        </div>
      </div>
      <div v-if="isAssessment" style="margin-top: 20px">
        <div class="form_piece_title">
          <span>体检记录</span>
          <a-button type="primary" @click="addTableClick" :disabled="checkForm"
            >新增
          </a-button>
        </div>
        <a-table
          :scroll="{ y: 200, x: 300 }"
          :pagination="pagination"
          :columns="columns"
          :dataSource="formModel.list"
          :openSelector="true"
          @change="paginationChange"
          class="file_list multi_line"
          :rowKey="
            (record, index) => {
              return pagination.current + '' + index;
            }
          "
        >
          <template
            slot="physicalExaminationType"
            slot-scope="text, record, index"
          >
            <a-select
              ref="select"
              v-model="record.physicalExaminationType"
              placeholder="请选择"
              :getPopupContainer="getPopupContainer"
              :disabled="checkForm"
            >
              <a-select-option
                v-for="item in physicalExaminationTypeOptions"
                :key="item.value"
                :value="item.label"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </template>
          <template
            slot="physicalExaminationDate"
            slot-scope="text, record, index"
          >
            <a-date-picker
              v-model="record.physicalExaminationDate"
              :disabled="checkForm"
              valueFormat="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="选择日期"
            />
          </template>

          <!-- 行内操作列按钮 -->
          <template slot="operation" slot-scope="text, record, index">
            <file-upload
              :className="['btn_link']"
              :Text="'上传'"
              style="display: inline-block"
              @fileChange="
                fileChange(
                  $event,
                  (pagination.current - 1) * pagination.pageSize + index
                )
              "
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
              @click="
                deleteClick(
                  text,
                  record,
                  (pagination.current - 1) * pagination.pageSize + index
                )
              "
              class="delete_color btn_link"
              :disabled="checkForm"
              >删除
            </a-button>
          </template>
        </a-table>
      </div>
    </a-form-model>
    <a-form-model
      ref="assessmentFormRef"
      :model="assessmentForm"
      :rules="assessmentRules"
      class="position-change-person-add-form"
      v-else
    >
      <a-row>
        <div class="form_piece_title">
          <span>基础信息</span>
        </div>
        <a-col :span="8">
          <a-form-model-item label="考核日期" prop="assessDate">
            <a-date-picker
              v-model="assessmentForm.assessDate"
              valueFormat="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="选择日期"
              :disabled="checkForm || checkAssessment"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script>

import {
  professionHealthArchivesSelectCount,
  professionHealthArchivesQueryPostName,
  professionHealthArchivesInsert,
  professionHealthArchivesUpdate,
  professionHealthArchivesInsertRecord,
  personnelExamineQueryByID,
} from "@/api/occupationalHealthManagement/occupationalHealthArchivesManagement"
import fileUpload from './fileUpload.vue'
export default {
  name: "hSESystemFileManagementAddEditForm",
  components: {
    fileUpload,
  },
  props: [
    "hiddenVisible",
    "checkForm",
    "formEditData",
    'inspectedUnitOptions',
    'departmentOption',
    'isAssessment',
    'recordForm'
  ],
  data() {
    return {
      physicalExaminationTableList: [],
      checkAssessment: false,
      interlockLevelOptions: [],
      postNameOptions: [],
      company: [], //外委单位下拉框
      pagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      projectPagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      recordPagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return {
              children: `${(this.pagination.current - 1) * this.pagination.pageSize +
                index +
                1
                }`,
              attrs: { rowSpan: 1 },
            };
          }
          ,
          width: 50,
        }, {
          title: '体检类别',
          scopedSlots: { customRender: 'physicalExaminationType' },
          width: 100,
        }, {
          title: '体检日期',
          scopedSlots: { customRender: 'physicalExaminationDate' },
          width: 100,
        }, {
          title: '文件名称',
          customRender: (value, row, index) => {
            return {
              children: value.fileID.fileName,
              attrs: { rowSpan: 1 },
            };
          },
          width: 200,
        }, {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 200,
        }
      ],
      recordColumns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return {
              children: `${(this.pagination.current - 1) * this.pagination.pageSize +
                index +
                1
                }`,
              attrs: { rowSpan: 1 },
            };
          }
          ,
          width: 50,
        }, {
          title: "内容",
          dataIndex: "content",
        }, {
          title: '得分',
          scopedSlots: { customRender: 'score' },
          width: 200,
        }
      ],
      physicalExaminationColumns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return {
              children: `${(this.pagination.current - 1) * this.pagination.pageSize +
                index +
                1
                }`,
              attrs: { rowSpan: 1 },
            };
          }
          ,
          width: 50,
        }, {
          title: "名称",
          dataIndex: "physicalExaminationName",
        }
      ],
      formModel: {
        postName: "",
        unitName: "",
        personNo: "",
        person: "",
      },
      physicalExaminationTypeOptions: [
        {
          label: '入职体检',
          value: '入职体检',
        }, {
          label: '转岗体检',
          value: '转岗体检',
        }, {
          label: '离职体检',
          value: '离职体检',
        }, {
          label: '年度体检',
          value: '年度体检',
        }, {
          label: '其他',
          value: '其他',
        },
      ],
      rules: {
        person: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        unitName: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ], postName: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    hiddenVisible: {
      handler(val) {
        if (val) {
          this.getQueryPostName()
        } else {
          this.formModel = {
            postName: "",
            unitName: "",
            personNo: "",
            person: "",
          }
          this.$refs.formRef.clearValidate();
        }
      },
      immediate: true
    },
  },
  methods: {
    downloadClick(row) {
      window.location.href = Glod.DEVE_LOPMENT_ENVIRONMENT + 'fileinfo/downloadFileById?id=' + row.fileID.id + '&dType=d'
    },
    fileChange(val, index) {
      this.formModel.list[index].fileID = {
        id: val[0].id,
        fileName: val[0].fileName,
      };
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-change-person-add-form");
    },
    projectPaginationChange(pagination) {
      this.projectPagination.current = pagination.current
      this.projectPagination.pageSize = pagination.pageSize
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
    },
    addTableClick() {
      if (this.formModel.postName) {
        this.formModel.list.push({
          physicalExaminationType: "",
          physicalExaminationDate: "",
          fileID: {
            id: "",
            fileName: "",
          },
        })
      } else {
        this.$message.warning("请先选择岗位名称");
      }
    },
    unitNameChange() {
      this.numbersGenerate()
    },
    numbersGenerate() {
      let pinyinFirst = ""
      if (this.formModel.unitName) {
        let pinyinLable = this.departmentOption.filter((item) => {
          if (item.label == this.formModel.unitName) {
            return item
          }
        })
        if (pinyinLable.length > 0) {
          pinyinFirst = pinyinLable[0].value
        } else {
          pinyinFirst = "WW"
        }
      }
      if (!pinyinFirst) {
        return false
      }
      if (!this.formModel.id) {
        professionHealthArchivesSelectCount().then((res) => {
          if (res.code == 200) {
            this.$set(
              this.formModel,
              'personNo',
              pinyinFirst + res.body.编号后三位
            )
          }
        })
      }
    },
    getQueryPostName() {
      professionHealthArchivesQueryPostName().then((res) => {
        if (res.code == 200) {
          this.postNameOptions = res.body
        }
      })
    },
    confirm(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.formModel.id) {
            professionHealthArchivesUpdate(this.formModel).then((res) => {
              if (res.code == 200) {
                this.$message.success('编辑成功')
                callback()
              }
            })
          } else {
            professionHealthArchivesInsert(this.formModel).then((res) => {
              if (res.code == 200) {
                this.$message.success('保存成功')
                callback()
              }
            })
          }
        }
      })
    },
    recordConfirm(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let physicalExaminationList = []
          for (let index = 0; index < this.formModel.list.length; index++) {
            const element = this.formModel.list[index];
            if (!element.physicalExaminationDate) {
              this.$message.warning("体检日期不能为空");
              return false
            }
            if (!element.physicalExaminationType) {
              this.$message.warning("体检类别不能为空");
              return false
            }
            if (!element.fileID.id) {
              this.$message.warning("文件不能为空");
              return false
            }
            let physicalExaminationData = {
              physicalExaminationDate: element.physicalExaminationDate,
              physicalExaminationType: element.physicalExaminationType,
              fileID: this.$fileUploadJSON.toJsonString(
                element.fileID
              )
            }
            physicalExaminationList.push(physicalExaminationData)
          }
          let medicalRecordsData = {
            id: this.formModel.id,
            list: physicalExaminationList
          }
          professionHealthArchivesInsertRecord(medicalRecordsData).then((res) => {
            if (res.code == 200) {
              this.$message.success('保存成功')
              callback()
            }
          })
        }
      })
    },
    deleteClick(text, record, index) {
      this.formModel.list.splice(index, 1)
    },
    getExamineQueryByID() {
      personnelExamineQueryByID({ id: this.formModel.id }).then((res) => {
        if (res.code == '200') {
          this.$set(this.formModel, 'list', res.body[1])
        }
      });
    },
    recordPaginationChange(pagination) {
      this.recordPagination.current = pagination.current
      this.recordPagination.pageSize = pagination.pageSize
    },
  },
};
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
.person_no .ant-input[disabled] {
  color: #000;
}
.no_disabled_style {
  .ant-input[disabled] {
    color: #000;
  }
  .ant-select-disabled {
    color: #000;
  }
}
</style>
