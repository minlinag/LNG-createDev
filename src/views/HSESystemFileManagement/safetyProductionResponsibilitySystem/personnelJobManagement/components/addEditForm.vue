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
        <a-col :span="24">
          <a-form-model-item label="责任范围" prop="dutyRange">
            <a-input
              v-model.trim="formModel.dutyRange"
              placeholder="请输入"
              :disabled="checkForm"
              type="textarea"
              :auto-size="{ minRows: 1, maxRows: 6 }"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="form_piece_title">
        <span>岗位责任</span>
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
        v-if="contentState"
      >
        <template
          slot="content"
          slot-scope="text, record, index"
          class="content"
        >
          <a-form-model-item
            :prop="
              'list[' +
              ((pagination.current - 1) * pagination.pageSize + index) +
              '].content'
            "
            :rules="rules.content"
          >
            <editable-cell
              :text="text.content"
              :index="
                (pagination.current - 1) * pagination.pageSize +
                index +
                'content'
              "
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              @change="onCellChange(index, 'content', $event)"
            />
          </a-form-model-item>
        </template>
        <template
          slot="dutyChecklist"
          slot-scope="text, record, index"
          class="dutyChecklist"
        >
          <a-form-model-item
            :prop="
              'list[' +
              ((pagination.current - 1) * pagination.pageSize + index) +
              '].dutyChecklist'
            "
            :rules="rules.dutyChecklist"
          >
            <editable-cell
              :text="text.dutyChecklist"
              :index="
                (pagination.current - 1) * pagination.pageSize +
                index +
                'dutyChecklist'
              "
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              @change="onCellChange(index, 'dutyChecklist', $event)"
            />
          </a-form-model-item>
        </template>
        <template
          slot="assessStandard"
          slot-scope="text, record, index"
          class="assessStandard"
        >
          <a-form-model-item
            :prop="
              'list[' +
              ((pagination.current - 1) * pagination.pageSize + index) +
              '].assessStandard'
            "
            :rules="rules.assessStandard"
          >
            <editable-cell
              :text="text.assessStandard"
              :index="
                (pagination.current - 1) * pagination.pageSize +
                index +
                'assessStandard'
              "
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              @change="onCellChange(index, 'assessStandard', $event)"
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
import { postManagementInsert, postManagementUpdateMain } from "@/api/HSESystemFileManagement/personnelJobManagement"

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
          title: '责任制内容',
          scopedSlots: { customRender: 'content' },
        }, {
          title: '责任制清单',
          scopedSlots: { customRender: 'dutyChecklist' },
        }, {
          title: '考核标准',
          scopedSlots: { customRender: 'assessStandard' },
        }, {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 200,
        }],
      formModel: {
        postName: "",
        dutyRange: "",
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
      contentState: true,
      rules: {
        postName: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur",
          },
        ],
        dutyRange: [
          {
            required: true,
            message: "请输入责任范围",
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
          let isNullContent = false
          let isDutyChecklist = false
          let isAssessStandard = false
          if (this.formModel.list.length == 0) {
            this.$message.warn(`请添加岗位责任`);
            return false
          }
          this.formModel.list.forEach((item) => {
            if (item) {
              array.push(item.content);
            }
            if (!item.content) {
              isNullContent = true
              return false
            }
            if (!item.dutyChecklist) {
              isDutyChecklist = true
              return false
            }
            if (!item.assessStandard) {
              isAssessStandard = true
              return false
            }
          });
          if (isNullContent) {
            this.$message.warn(`责任制内容不可为空`);
            return false
          }
          if (isDutyChecklist) {
            this.$message.warn(`责任制清单不可为空`);
            return false
          }
          if (isAssessStandard) {
            this.$message.warn(`考核标准不可为空`);
            return false
          }
          if ((new Set(array)).size != this.formModel.list.length) {
            this.$message.warn(`责任制内容不可重复`);
            return false
          }
          if (this.formModel.id) {
            postManagementUpdateMain(this.formModel).then(res => {
              if (res.code == '200') {
                this.$emit('cancel')
              }
            })

          } else {
            postManagementInsert(this.formModel).then(res => {
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
          content: "",
          dutyChecklist: "",
          assessStandard: "",
        }
      )
    },
    onCellChange(index, dataIndex, value) {
      this.formModel.list[(this.pagination.current - 1) * this.pagination.pageSize + index][dataIndex] = value
    },
    deleteClick(text, record, index) {
      this.contentState = false
      this.formModel.list.splice(index, 1);
      this.contentState = true
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