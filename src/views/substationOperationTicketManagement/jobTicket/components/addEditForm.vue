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
              :disabled="checkForm"
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
          <a-form-model-item label="工作负责人" prop="responsibleUser">
            <a-input
              v-model.trim="formModel.responsibleUser"
              placeholder="请输入"
              :disabled="checkForm"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="班组" prop="classTeam">
            <a-input
              v-model.trim="formModel.classTeam"
              placeholder="请输入"
              :disabled="checkForm"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="工作班成员" prop="teamMember">
            <a-input
              v-model.trim="formModel.teamMember"
              placeholder="请输入"
              :disabled="checkForm"
              type="textarea"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item prop="totalPeople" class="number_people">
            <span
              >共
              <a-input
                v-model.trim="formModel.totalPeople"
                placeholder="请输入"
                :disabled="checkForm"
              ></a-input>
              人
            </span>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            label="变配电站名称及设备双重名称"
            prop="stationEqmName"
          >
            <a-input
              v-model.trim="formModel.stationEqmName"
              placeholder="请输入"
              :disabled="checkForm"
              type="textarea"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="form_piece_title">
        <span>工作任务</span>
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
        <template slot="content1" slot-scope="val, obj" class="content1">
          <a-form-model-item :prop="'content1'">
            <!-- <editable-cell
              :text="text.content1"
              :index="index + 'content1'"
              :edit-show="!checkForm"
              v-if="hiddenVisible"
              @change="onCellChange(index, 'content1', $event)"
            /> -->
            <a-input
              placeholder="请输入"
              v-model="obj.content1"
              :disabled="checkForm"
              style="width: 100%"
            />
          </a-form-model-item>
        </template>
        <template slot="content2" slot-scope="val, obj" class="content2">
          <a-form-model-item :prop="'bzList[' + index + '].content2'">
            <a-input
              placeholder="请输入"
              v-model="obj.content2"
              :disabled="checkForm"
              style="width: 100%"
            />
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
          <span>计划工作时间</span>
        </div>
        <a-col :span="24" class="start_run_time">
          <a-form-model-item label="计划工作时间" prop="startRunTime">
            <a-range-picker
              :disabled="checkForm"
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
        <first-review
          :hiddenVisible="hiddenVisible"
          v-if="$route.path == '/firstJobTicketLedger'"
          ref="firstReviewRef"
        ></first-review>
        <second-review
          :hiddenVisible="hiddenVisible"
          v-if="$route.path == '/secondWorkTicketLedger'"
          ref="secondReviewRef"
        ></second-review>
      </a-row>
      <div v-if="checkForm">
        <div class="form_piece_title">
          <span>审批记录</span>
        </div>
        <div>
          <stepsModel
            @approvalMethod="approvalMethod"
            :id="this.formModel.id"
            ref="stepsModel"
            :isShow="true"
          />
        </div>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import editableCell from '@/views/substationOperationTicketManagement/jobTicket/components/editableCell.vue'
import stepsModel from '@/components/approvalRecord/index.vue'
import firstReview from './firstReview.vue'
import secondReview from './secondReview.vue'
import { insert, createNewId, update, companySelect, applySubmit } from "@/api/substationOperationTicketManagement/jobTicketApply.js"

import Sortable from 'sortablejs'
export default {
  name: "jobTicketAddEditForm",
  components: {
    editableCell,
    firstReview,
    stepsModel,
    secondReview,
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
          title: `${this.$route.path == '/firstJobTicketApply' ? '工作地点及设备双重名称' : '工作地点或地段'}`,
          scopedSlots: { customRender: 'content1' },
        }, {
          title: '工作内容',
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
        responsibleUser: "", //负责人
        classTeam: "", //班组
        teamMember: "", //班组成员
        totalPeople: "", //总人数
        stationEqmName: "", //变配电站名称及设备双重名称
        bzList: [], //工作任务
        startRunTime: "", //起始工作时间
        endRunTime: "" //结束工作时间
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
            message: "请选择单位",
            trigger: "change",
          },
        ],
        responsibleUser: [
          {
            required: true,
            message: "请输入负责人",
            trigger: "blur",
          },
        ],
        classTeam: [
          {
            required: true,
            message: "请输入班组",
            trigger: "blur",
          },
        ],
        teamMember: [
          {
            required: true,
            message: "请输入班组成员",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (this.$route.path == '/firstJobTicketApply') {
                if (value.length > 67) {
                  callback(new Error("班组成员最多输入67个字符"));
                } else {
                  callback();
                }
              } else {
                if (value.length > 143) {
                  callback(new Error("班组成员最多输入143个字符"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
        totalPeople: [
          {
            required: true,
            message: "请输入总人数",
            trigger: "change",
          },
        ],
        stationEqmName: [
          {
            required: true,
            message: "请输入变配电站名称及设备双重名称",
            trigger: "change",
          }, {
            validator: (rule, value, callback) => {
              if (this.$route.path == '/firstJobTicketApply') {
                if (value.length > 74) {
                  callback(new Error("变配电站名称及设备双重名称最多输入74个字符"));
                } else {
                  callback();
                }
              } else {
                if (value.length > 36) {
                  callback(new Error("变配电站名称及设备双重名称最多输入36个字符"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
        startRunTime: [
          {
            required: true,
            message: "请选择工作时间",
            trigger: "change",
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
            this.$message.warn('工作任务不可为空');
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
            this.$message.warn(`${this.$route.path == '/firstJobTicketApply' ? '工作地点及设备双重名称' : '工作地点或地段'}不可为空`);
            return false
          }
          if (isNullContent2) {
            this.$message.warn(`工作内容不可为空`);
            return false
          }
          if ((new Set(array)).size != this.formModel.bzList.length) {
            this.$message.warn(`${this.$route.path == '/firstJobTicketApply' ? '工作地点及设备双重名称' : '工作地点或地段'}不可重复`);
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
            // 根据当前路由是否为/firstJobTicketApply,为formModel添加dataType
            if (this.$route.path == '/firstJobTicketApply') {
              this.formModel.dataType = '1'
            } else {
              this.formModel.dataType = '2'
            }
            insert(this.formModel).then(res => {
              if (name == 'submit') {
                callback(res.body)
              } else {
                this.$emit('cancel')
              }
            })
          }
        }
      })
    },
    submit() {
      // 回调函数
      this.confirm('submit', (id) => {
        applySubmit({ id, dataType: this.$route.path == '/firstJobTicketApply' ? '1' : '2' }).then(res => {
          if (res.code == '200') {
            this.$message.success('提交成功')
            this.$emit('cancel')
          }
        })
      })
    },
    agree() {
      this.$refs.stepsModel.verificationChange('1')
    },
    reject() {
      this.$refs.stepsModel.verificationChange('0')
    },
    approvalMethod(type) {
      if (this.$route.path == '/firstJobTicketLedger') {
        if (this.$refs.firstReviewRef.formModel.attention === "") {
          this.$message.warn('请填写工作地点保留带电部分或注意事项')
          return false
        }
        this.formModel.attention = this.$refs.firstReviewRef.formModel.attention
        this.formModel.csList = this.$refs.firstReviewRef.formModel.csList
        this.formModel.conditions = ""
      } else {
        if (this.$refs.secondReviewRef.formModel.conditions === "") {
          this.$message.warn('请填写工作条件')
          return false
        }
        if (this.$refs.secondReviewRef.formModel.conditions.length > 188) {
          this.$message.warn('工作条件最多输入188个字符')
          return false
        }
        if (this.$refs.secondReviewRef.formModel.attention === "") {
          this.$message.warn('请填写注意事项')
          return false
        }
        if (this.$refs.secondReviewRef.formModel.attention.length > 139) {
          this.$message.warn('注意事项最多输入139个字符')
          return false
        }
        this.formModel.attention = this.$refs.secondReviewRef.formModel.attention
        this.formModel.conditions = this.$refs.secondReviewRef.formModel.conditions
        this.formModel.csList = []
      }

      update(this.formModel).then(res => {
        if (res.code == '200') {
          this.$emit('approval', {
            type: type,
            opinion: this.$refs.stepsModel.form.opinion,
            id: this.formModel.id,
          })
        }
      })
    },
    addTableClick() {
      if (this.$route.path == '/firstJobTicketApply') {
        if (this.formModel.bzList.length >= 2) {
          this.$message.warn('最多添加2条')
          return false
        }
      } else {
        if (this.formModel.bzList.length >= 7) {
          this.$message.warn('最多添加7条')
          return false
        }
      }
      this.formModel.bzList.push(
        {
          content1: "",
          content2: "",
        }
      )
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
      createNewId({ datatype: this.$route.path == '/firstJobTicketApply' ? '1' : '2' }).then(res => {
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
.number_people {
  margin-top: -10px;
  margin-left: 102px;
}
</style>