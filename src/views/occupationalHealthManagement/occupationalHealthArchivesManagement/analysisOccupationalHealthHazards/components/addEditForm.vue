<template>
  <div>
    <a-form-model ref="formRef" :model="formModel" :rules="rules">
      <a-row>
        <div class="form_piece_title">
          <span>基础信息</span>
        </div>
        <a-col :span="8">
          <a-form-model-item label="岗位名称" prop="postName">
            <a-input
              v-model.trim="formModel.postName"
              placeholder="请输入"
              :disabled="checkForm"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <div class="form_piece_title">
          <span>危害因素</span>
        </div>
        <a-col :span="24">
          <a-form-model-item label="危害因素" prop="harmFactor">
            <a-input
              v-model.trim="formModel.harmFactor"
              placeholder="请输入"
              :disabled="checkForm"
              type="textarea"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="form_piece_title">
        <span>体检项目</span>
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
        v-if="physicalExaminationNameState"
      >
        <template
          slot="physicalExaminationName"
          slot-scope="text, record, index"
          class="physicalExaminationName"
        >
          <a-form-model-item
            :prop="
              'list[' +
              ((pagination.current - 1) * pagination.pageSize + index) +
              '].physicalExaminationName'
            "
            :rules="rules.physicalExaminationName"
          >
            <editable-cell
              :text="text.physicalExaminationName"
              :index="(pagination.current - 1) * pagination.pageSize + index"
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              @change="onCellChange(index, 'physicalExaminationName', $event)"
            />
          </a-form-model-item>
        </template>

        <!-- 行内操作列按钮 -->
        <template slot="operation" slot-scope="text, record, index">
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
    </a-form-model>
  </div>
</template>

<script>
import editableCell from './editableCell.vue'
import { harmFactorsAnalysisInsert, harmFactorsAnalysisUpdateMain } from "@/api/occupationalHealthManagement/occupationalHealthArchivesManagement"

export default {
  name: "hSESystemFileManagementAddEditForm",
  components: {
    editableCell,
  },
  props: ['type', 'hiddenVisible', 'checkForm', 'formEditData'],
  data() {
    return {
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
          title: '名称',
          scopedSlots: { customRender: 'physicalExaminationName' },
        }, {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 200,
        }],
      formModel: {
        postName: "",
        harmFactor: "",
        list: []
      },
      pagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      physicalExaminationNameState: true,
      rules: {
        postName: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur",
          },
        ],
      }
    }
  },
  watch: {
    hiddenVisible: {
      handler(val) {
        if (!val) {
          this.$refs.formRef.clearValidate()
        } else {
          this.pagination.current = 1
          this.pagination.pageSize = 10
          this.formModel = this.$lodash.cloneDeep(this.formEditData);
        }

      },
      immediate: true,

    }
  },
  methods: {
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
    },
    confirm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let array = [];
          let isNullPhysicalExaminationName = false
          if (this.formModel.list.length <= 0) {
            this.$message.warn(`体检项目不可为空`);
            return false
          }
          this.formModel.list.forEach((item) => {
            if (item) {
              array.push(item.physicalExaminationName);
            }
            if (!item.physicalExaminationName) {
              isNullPhysicalExaminationName = true
              return false
            }
          });
          if (isNullPhysicalExaminationName) {
            this.$message.warn(`体检名称不可为空`);
            return false
          }
          if ((new Set(array)).size != this.formModel.list.length) {
            this.$message.warn(`体检名称不可重复`);
            return false
          }
          if (this.formModel.id) {
            harmFactorsAnalysisUpdateMain(this.formModel).then(res => {
              if (res.code == '200') {
                this.$emit('cancel')
              }
            })

          } else {
            harmFactorsAnalysisInsert(this.formModel).then(res => {
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
      this.formModel.list.push(
        {
          physicalExaminationName: "",
        }
      )
    },
    onCellChange(index, dataIndex, value) {
      this.formModel.list[(this.pagination.current - 1) * this.pagination.pageSize + index][dataIndex] = value
    },
    deleteClick(text, record, index) {
      this.physicalExaminationNameState = false
      this.formModel.list.splice(index, 1);
      this.physicalExaminationNameState = true
    },
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