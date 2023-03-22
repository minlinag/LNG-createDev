<template>
  <div>
    <a-form-model ref="formRef" :model="formModel" :rules="rules">
      <a-row>
        <div class="form_piece_title">
          <span>基础信息</span>
        </div>
        <a-col :span="8">
          <a-form-model-item label="单位" prop="company">
            <a-select
              v-model="formModel.company"
              style="width: 100%"
              placeholder="请选择"
            >
              <a-select-option
                :value="item.OutsourceCompanyName"
                v-for="item in companySelectOption"
                :key="item.OutsourceCompanyName"
              >
                {{ item.OutsourceCompanyName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="编号" prop="codeNo">
            <a-input
              v-model.trim="formModel.codeNo"
              placeholder="自动生成"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="发令人" prop="offerUser">
            <a-input
              v-model.trim="formModel.offerUser"
              placeholder="请输入"
              :disabled="checkForm"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="受令人" prop="receUser">
            <a-input
              v-model.trim="formModel.receUser"
              placeholder="请输入"
              :disabled="checkForm"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="发令时间" prop="offerTime">
            <a-date-picker
              style="min-width: auto"
              show-time
              v-model="formModel.offerTime"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="date"
              placeholder="请选择"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" class="start_run_time">
          <a-form-model-item label="操作时间" prop="startRunTime">
            <a-range-picker
              style="min-width: auto"
              show-time
              v-model="runTime"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="date"
              @change="runTimeChange"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="操作任务" prop="runTask">
            <a-input
              v-model.trim="formModel.runTask"
              placeholder="请输入"
              :disabled="checkForm"
              type="textarea"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="form_piece_title">
        <span>操作步骤</span>
        <a-button type="primary" @click="addTableClick" :disabled="checkForm"
          >新增
        </a-button>
      </div>
      <a-table
        :scroll="{ y: 200, x: 300 }"
        :pagination="false"
        :columns="columns"
        :dataSource="formModel.bzList"
        :openSelector="true"
        ref="singleTable"
        class="file_list multi_line"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        v-if="contentState"
      >
        <template slot="content1" slot-scope="val, obj, index" class="content1">
          <a-form-model-item
            :prop="'bzList[' + index + '].content1'"
            :rules="rules.content1"
          >
            <!-- <editable-cell
              :text="text.content1"
              :index="index + 'content1'"
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              :word-limit="44"
              @change="onCellChange(index, 'content1', $event)"
            /> -->
            <a-input
              placeholder="请输入"
              v-model="obj.content1"
              :disabled="checkForm"
              style="width: 100%"
              @change="
                inputChange(
                  obj.content1,
                  'formModel.bzList',
                  index,
                  'content1',
                  44
                )
              "
            />
          </a-form-model-item>
        </template>
        <template
          slot="content2"
          slot-scope="text, record, index"
          class="content2"
        >
          <a-form-model-item
            :prop="'bzList[' + index + '].content2'"
            :rules="rules.content2"
          >
            <a-radio-group
              v-model="text.content2"
              name="content2"
              :default-value="'是'"
            >
              <a-radio :value="'是'">是</a-radio>
              <a-radio :value="'否'">否</a-radio>
            </a-radio-group>
            <!-- <editable-cell
              :text="text.content2"
              :index="index + 'content2'"
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              @change="onCellChange(index, 'content2', $event)"
            /> -->
          </a-form-model-item>
        </template>
        <template slot="sort">
          <a-icon
            style="cursor: sn-resize; fontsize: 20px"
            type="drag"
            class="move"
            :style="moveStyle"
          />
        </template>
        <!-- 行内操作列按钮 -->
        <template slot="operation" slot-scope="text, record, index">
          <a-button
            type="link"
            @click="deleteClick(text, record, index)"
            class="delete_color btn_link"
            :disabled="checkForm"
            >删除
          </a-button>
        </template>
      </a-table>
      <a-row>
        <div class="form_piece_title">
          <span>其他</span>
        </div>
        <a-col :span="24">
          <a-form-model-item label="备注" prop="remark">
            <a-input
              v-model.trim="formModel.remark"
              placeholder="请输入"
              :disabled="checkForm"
              type="textarea"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import editableCell from './editableCell.vue'
import { insert, createNewId, update, companySelect, applySubmit } from "@/api/substationOperationTicketManagement/switchingOperationTicketManagement.js"

import Sortable from 'sortablejs'
export default {
  name: "switchingOperationTicketManagementAddEditForm",
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
              children: `${index +
                1
                }`,
              attrs: { rowSpan: 1 },
            };
          }
          ,
          width: 50,
        }, {
          title: '操作项目',
          scopedSlots: { customRender: 'content1' },
        }, {
          title: '操作确认',
          scopedSlots: { customRender: 'content2' },
        }, {
          title: '排序',
          width: 60,
          scopedSlots: { customRender: 'sort' },
        }, {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 200,
        }],
      formModel: {
        company: "", //单位
        codeNo: "", //编号
        offerUser: "", //发令人
        receUser: "", //受令人
        offerTime: "", //发令时间
        startRunTime: "", // 开始操作时间
        endRunTime: "",   // 结束操作时间
        runTask: "", // 操作任务
        bzList: [], // 操作内容
        remark: "", // 备注
      },
      companySelectOption: [], //单位下拉框
      singleTableLoading: false,
      runTime: [],
      contentState: true,
      moveStyle: {
        color: '#1890ff',
      },
      rules: {
        company: [
          {
            required: true,
            message: "请输入单位",
            trigger: "blur",
          },
        ],
        offerUser: [
          {
            required: true,
            message: "请输入发令人",
            trigger: "blur",
          },
          // 限制输入长度最多5个中文
          {
            validator: (rule, value, callback) => {
              if (value.length > 5) {
                callback(new Error("发令人最多输入5个字符"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        receUser: [
          {
            required: true,
            message: "请输入接令人",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 5) {
                callback(new Error("接令人最多输入5个字符"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        offerTime: [
          {
            required: true,
            message: "请选择发令时间",
            trigger: "change",
          },
        ],
        startRunTime: [
          {
            required: true,
            message: "请选择操作时间",
            trigger: "change",
          },
        ],
        runTask: [
          {
            required: true,
            message: "请输入操作任务",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 93) {
                callback(new Error("操作任务最多输入93个字符"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        remark: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 95) {
                callback(new Error("备注最多输入95个字符"));
              } else {
                callback();
              }
            },
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
          this.getCompanySelect()
          this.formModel = this.$lodash.cloneDeep(this.formEditData);
          this.runTime = [this.formModel.startRunTime, this.formModel.endRunTime]
          if (!this.formModel.codeNo) {
            this.getCreateNewId()
            this.runTime = []
          }

          this.$nextTick(() => {
            if (this.checkForm) {
              this.moveStyle.color = '#3d3d3d'
              return false
            }
            this.moveStyle.color = '#1890ff'
            this.dragSort()
          })

        }

      },
      immediate: true,

    }
  },
  methods: {
    confirm(name, callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let array = [];
          let isNullContent1 = false
          let isNullContent2 = false
          if (this.formModel.bzList.length == 0) {
            this.$message.warn(`操作步骤不可为空`);
            return false
          }
          this.formModel.bzList.forEach((item) => {
            if (item) {
              array.push(item.content1);
            }
            if (!item.content1) {
              isNullContent1 = true
              return false
            }
            if (!item.content2) {
              isNullContent2 = true
              return false
            }
          });
          if (isNullContent1) {
            this.$message.warn(`操作项目不可为空`);
            return false
          }
          if (isNullContent2) {
            this.$message.warn(`操作确认不可为空`);
            return false
          }
          if ((new Set(array)).size != this.formModel.bzList.length) {
            this.$message.warn(`操作项目不可重复`);
            return false
          }
          if (this.formModel.id) {
            update(this.formModel).then(res => {
              if (res.code == '200') {
                if (name == 'submit') {
                  callback(this.formModel.id)
                } else {
                  this.$emit('cancel')
                }
              }
            })

          } else {

            insert(this.formModel).then(res => {
              if (res.code == "200") {
                if (name == 'submit') {
                  callback(res.body)
                } else {
                  this.$emit('cancel')
                }
              }
            })
          }
        }
      })
    },
    submit() {
      // 回调函数
      this.confirm('submit', (id) => {
        applySubmit({ id }).then(res => {
          if (res.code == '200') {
            this.$message.success('提交成功')
            this.$emit('cancel')
          }
        })
      })
    },
    addTableClick() {
      if (this.formModel.bzList.length < 18) {
        this.formModel.bzList.push(
          {
            content1: "",
            content2: "是",
          }
        )
      } else {
        // 操作项目不可超过18条
        this.$message.warn(`操作项目不可超过18条`);
      }

    },

    onCellChange(index, dataIndex, value) {
      this.formModel.bzList[index][dataIndex] = value
    },
    deleteClick(text, record, index) {
      this.contentState = false
      this.formModel.bzList.splice(index, 1);
      this.contentState = true
    },
    dragSort() {
      if (this.$refs.singleTable) {
        const el = this.$refs.singleTable.$el.querySelectorAll(
          '.ant-table-body > table > tbody'
        )[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'ghost',
          handle: '.move',
          onEnd: (e) => {
            let sortList = JSON.parse(JSON.stringify(this.formModel.bzList))
            const targetRow = sortList.splice(e.oldIndex, 1)[0]
            console.log(e.newIndex)
            sortList.splice(e.newIndex, 0, targetRow)
            for (let index = 0; index < sortList.length; index++) {
              sortList[index].orderNo = index
            }
            this.singleTableLoading = true
            this.formModel.bzList = []
            setTimeout(() => {
              this.singleTableLoading = false
              this.formModel.bzList = sortList
            }, 500)
          },
        })
      }
    },
    runTimeChange(val) {
      if (val || val.length !== 0) {
        this.formModel.startRunTime = val[0]
        this.formModel.endRunTime = val[1]
        // 重新执行startRunTime验证
        this.$refs.formRef.validateField('startRunTime')

      } else {
        this.formModel.startRunTime = ''
        this.formModel.endRunTime = ''
      }
    },
    getCreateNewId() {
      createNewId().then(res => {
        if (res.code == '200') {
          this.formModel.codeNo = res.body
        }
      })
    },
    getCompanySelect() {
      companySelect().then(res => {
        if (res.code == '200') {
          this.companySelectOption = res.body
        }
      })
    },
    inputChange(e, belongs, index, name, limit) {
      let value
      // 限制e.target.value字数
      if (limit > 0 && e.length > limit) {
        value = e.slice(0, limit);
        //  提示字数超过限制
        this.$message.warning('字数超过限制');
      } else {
        value = e;
      }
      // 将 "formModel.bzList" 变为 [formModel][bzList]
      let belongsArray = belongs.split('.')
      // 通过循环将 "formModel.bzList" 变为 this.formModel.bzList
      let belongsValue = this
      for (let i = 0; i < belongsArray.length; i++) {
        belongsValue = belongsValue[belongsArray[i]]
      }
      belongsValue[index][name] = value;
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
.start_run_time {
  ::v-deep .ant-form-item-control {
    .ant-input {
      width: 346px !important;
    }
  }
}
</style>