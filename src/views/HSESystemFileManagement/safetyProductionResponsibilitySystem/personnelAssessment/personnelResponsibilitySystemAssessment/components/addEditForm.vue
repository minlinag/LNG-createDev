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
          <a-form-model-item label="姓名" prop="person">
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
          <a-form-model-item label="单位名称" prop="unitName">
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
          <a-form-model-item label="岗位名称" prop="postName">
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
          <span>考核记录</span>
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
                :index="(pagination.current - 1) * pagination.pageSize + index"
                :edit-show="!checkForm"
                v-if="hiddenVisible"
                @change="onCellChange(index, 'content', $event)"
              />
            </a-form-model-item>
          </template>

          <!-- 行内操作列按钮 -->
          <template slot="operation" slot-scope="text, record, index">
            <a-button
              type="link"
              @click="
                editClick(
                  text,
                  record,
                  (pagination.current - 1) * pagination.pageSize + index
                )
              "
              class="btn_link"
              :disabled="checkForm"
              >编辑
            </a-button>
            <a-button
              type="link"
              @click="
                checkClick(
                  text,
                  record,
                  (pagination.current - 1) * pagination.pageSize + index
                )
              "
              class="btn_link"
              >查看
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
      <annual-assessment-record
        v-if="checkForm"
        :list="annualList"
        :check-form="checkForm"
      ></annual-assessment-record>
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
      <div>
        <div class="form_piece_title">
          <span>岗位责任</span>
        </div>
        <a-table
          :scroll="{ y: 200, x: 300 }"
          :pagination="recordPagination"
          :columns="recordColumns"
          :dataSource="assessmentForm.list"
          :openSelector="true"
          @change="recordPaginationChange"
          class="file_list multi_line"
          :rowKey="
            (record, index) => {
              return recordPaginationChange.current + '' + index;
            }
          "
        >
          <!-- 行内操作列按钮 -->
          <template slot="remark" slot-scope="text, record, index">
            <!-- <a-select
              ref="select"
              v-model="record.scores"
              placeholder="请选择"
              :disabled="checkForm || checkAssessment"
              @change="scoresChange(index, 'score', $event)"
            >
              <a-select-option
                v-for="item in ['1', '2', '3', '4', '5']"
                :key="item"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select> -->
            <a-input
              v-model="record.remark"
              placeholder="请输入"
              :disabled="checkForm || checkAssessment"
            ></a-input>
          </template>
          <template slot="scores" slot-scope="text, record, index">
            <!-- <a-select
              ref="select"
              v-model="record.scores"
              placeholder="请选择"
              :disabled="checkForm || checkAssessment"
              @change="scoresChange(index, 'score', $event)"
            >
              <a-select-option
                v-for="item in ['1', '2', '3', '4', '5']"
                :key="item"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select> -->
            -
            <a-input
              v-model="record.scores"
              placeholder="请扣分"
              :disabled="checkForm || checkAssessment"
              style="width: 40%"
              @change="
                onScoresChange(
                  (recordPagination.current - 1) * recordPagination.pageSize +
                    index,
                  record.scores
                )
              "
            ></a-input>
          </template>
        </a-table>
      </div>
    </a-form-model>
  </div>
</template>
<script>
import Decimal from 'decimal.js';
import annualAssessmentRecord from '@/views/HSESystemFileManagement/safetyProductionResponsibilitySystem/personnelAssessment/components/annualAssessmentRecord.vue';

import {
  personnelExamineSelectCount, personnelExamineQueryPostName,
  personnelExamineSelectPostDutyData, personnelExamineInsert,
  personnelExamineUpdate, personnelExamineInsertAssess,
  personnelExamineUpdateAssess,
  personnelExamineQueryByID,
  personnelExamineQueryAssessByID,
  personnelExamineDeleteBatchAssess
} from "@/api/HSESystemFileManagement/safetyProductionResponsibilitySystem"
export default {
  name: "hSESystemFileManagementAddEditForm",
  components: { annualAssessmentRecord },
  props: [
    "hiddenVisible",
    "checkForm",
    "formEditData",
    'inspectedUnitOptions',
    'departmentOption',
    'isAssessment',
    'recordForm',
    'annualList',
  ],
  data() {
    return {
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
          title: "考核日期",
          dataIndex: "assessDate",
        }, {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 200,
        }
      ],
      scoreTotal: 0,
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
          title: "责任制内容",
          dataIndex: "content",
        }, {
          title: "责任制清单",
          dataIndex: "dutyChecklist",
        }, {
          title: "考核标准",
          dataIndex: "assessStandard",
        }, {
          title: "备注",
          scopedSlots: { customRender: 'remark' },
        }, {
          title: '扣分：0',
          scopedSlots: { customRender: 'scores' },
          width: 230,
        }
      ],
      assessmentForm: {
        assessDate: "",
        list: [],
      },
      formModel: {
        postName: undefined,
        unitName: undefined,
        personNo: "",
        person: "",
      },
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
      assessmentRules: {
        assessDate: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      }
    };
  },
  watch: {
    hiddenVisible: {
      handler(val) {
        if (val) {
          this.getQueryPostName()
        } else {
          this.formModel = {
            postName: undefined,
            unitName: undefined,
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
    onScoresChange(index, scores) {
      this.assessmentForm.list[index].scores = this.clearNoNum(scores)
      this.scoreTotal = this.calculateScore(0, this.assessmentForm.list)
      this.recordColumns[5].title = `扣分：${this.scoreTotal}`
    },
    calculateScore(total, array) {
      let newTotal = total
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.scores) {
          newTotal = new Decimal(newTotal).add(new Decimal(element.scores))
          if (newTotal < 0) {
            newTotal = 0
          }
        }
      }
      return newTotal
    },
    clearNoNum(value) {
      let newValue = value
      // this.tableData[e].goodsCost 是input的值
      // 先把非数字的都替换掉，除了数字和.

      newValue = String(newValue).replace(/[^\d.]/g, '')

      // 必须保证第一个为数字而不是.
      newValue = String(newValue).replace(/^\./g, '')

      // 保证只有出现一个.而没有多个.
      newValue = String(newValue).replace(/\.{2,}/g, '')
      // 保证.只出现一次，而不能出现两次以上
      newValue = String(newValue)
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      let index = -1
      for (let i in newValue) {
        if (newValue[i] === '.') {
          index = i
        }
        if (index !== -1) {
          if (i - index > 1) {
            newValue = String(newValue).substring(0, newValue.length - 1)
          }
        }
      }
      return newValue
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-change-person-add-form");
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
    },
    unitNameChange() {
      this.numbersGenerate()
    },
    numbersGenerate() {
      let pinyinFirst = ""
      if (this.formModel.unitName) {
        // 
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
        personnelExamineSelectCount().then((res) => {
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
      personnelExamineQueryPostName().then((res) => {
        if (res.code == 200) {
          this.postNameOptions = res.body
        }
      })
    },
    getSelectPostDutyData(postName) {
      personnelExamineSelectPostDutyData({ postName: postName }).then((res) => {
        if (res.code == 200) {
          this.assessmentForm.list = res.body.map((item) => {
            let newItem = {
              content: item.content,
              assessStandard: item.assessStandard,
              dutyChecklist: item.dutyChecklist,
            }
            return newItem
          })
        }
      })
    },
    confirm(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.formModel.id) {
            personnelExamineUpdate(this.formModel).then((res) => {
              if (res.code == 200) {
                this.$message.success('编辑成功')
                callback()
              }
            })
          } else {
            personnelExamineInsert(this.formModel).then((res) => {
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
      this.$refs.assessmentFormRef.validate((valid) => {
        if (valid) {
          for (let index = 0; index < this.assessmentForm.list.length; index++) {
            const element = this.assessmentForm.list[index];
            if (!element.scores) {
              this.$message.warning("扣分不能为空，请检查后再提交");
              return false
            }
          }
          this.assessmentForm.relateID = this.formModel.id
          this.assessmentForm.totalPoints = this.scoreTotal
          if (this.assessmentForm.id) {
            personnelExamineUpdateAssess(this.assessmentForm).then((res) => {
              if (res.code == 200) {
                this.$message.success('编辑成功')
                personnelExamineQueryByID({ id: this.formModel.id }).then((res) => {
                  if (res.code == '200') {
                    this.$nextTick(() => {
                      this.$set(this.formModel, 'list', res.body[1])
                    })
                    callback()
                  }
                });
              }
            })
          } else {
            personnelExamineInsertAssess(this.assessmentForm).then((res) => {
              if (res.code == 200) {
                this.$message.success('保存成功')
                personnelExamineQueryByID({ id: this.formModel.id }).then((res) => {
                  if (res.code == '200') {
                    this.$nextTick(() => {
                      this.$set(this.formModel, 'list', res.body[1])
                    })
                    callback()
                  }
                });
              }
            })
          }
        }
      })
    },

    deleteClick(text, record, index) {
      personnelExamineDeleteBatchAssess([record.id]).then((res) => {
        if (res.code == '200') {
          this.selectedRowKeys = []
          this.getExamineQueryByID()
          this.$message.success('删除成功')
        }
      });
    },
    addTableClick() {
      if (this.formModel.postName) {
        this.checkAssessment = false
        this.assessmentForm = {
          assessDate: "",
          list: [],
        }
        this.scoreTotal = 0
        this.recordColumns[5].title = `扣分：${this.scoreTotal}`
        this.$emit('recordFormChange', true)
        this.getSelectPostDutyData(this.formModel.postName)
      } else {
        this.$message.warning("请先选择岗位名称");
      }
    },
    editClick(text, record, index) {
      personnelExamineQueryAssessByID({ id: record.id }).then((res) => {
        if (res.code == '200') {
          this.assessmentForm = res.body[0]
          this.assessmentForm.list = res.body[1]
          this.scoreTotal = this.calculateScore(0, res.body[1])
          this.recordColumns[5].title = `扣分：${this.scoreTotal}`
        }
      });
      this.checkAssessment = false
      this.$emit('recordFormChange', true)
    },
    checkClick(text, record, index) {
      personnelExamineQueryAssessByID({ id: record.id }).then((res) => {
        if (res.code == '200') {
          this.assessmentForm = res.body[0]
          this.assessmentForm.list = res.body[1]
          this.scoreTotal = this.calculateScore(0, res.body[1])
          this.recordColumns[5].title = `扣分：${this.scoreTotal}`
        }
      });
      this.checkAssessment = true
      this.$emit('recordFormChange', true)
    },
    getExamineQueryByID() {
      personnelExamineQueryByID({ id: this.formModel.id }).then((res) => {
        if (res.code == '200') {
          this.$set(this.formModel, 'list', res.body[1])
        }
      });
    },
    getExamineQueryAssessByID(record) {
      personnelExamineQueryAssessByID({ id: record.id }).then((res) => {
        if (res.code == '200') {
          this.assessmentForm = res.body[0]
          this.assessmentForm.list = res.body[1]

        }
      });
    },
    scoresChange(index, dataIndex, value) {
      this.assessmentForm.list[(this.recordPagination.current - 1) * this.recordPagination.pageSize + index][dataIndex] = value
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
</style>
