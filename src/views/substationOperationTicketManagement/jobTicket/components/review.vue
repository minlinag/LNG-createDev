<template>
  <div>
    <a-form-model ref="formRef" :model="formModel" :rules="rules">
      <div class="form_piece_title">
        <span></span>
        <a-button type="primary" v-print="'#printContent'">打印</a-button>
      </div>
      <first-work-ticket
        :form-data="formData"
        v-if="$route.path == '/firstJobTicketApply' || $route.path == '/firstJobTicketLedger'"
      ></first-work-ticket>
      <second-work-ticket :form-data="formData" v-else></second-work-ticket>
      <div v-if="checkForm">
        <div class="form_piece_title" style="margin:20px">
          <span>审批记录</span>
        </div>
        <div>
          <stepsModel :id="this.formModel.id" ref="stepsModel" :isShow="false" />
        </div>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import { postManagementInsert, postManagementUpdateMain } from "@/api/HSESystemFileManagement/safetyProductionResponsibilitySystem"
import stepsModel from '@/components/approvalRecord/index.vue'
import firstWorkTicket from '@/views/substationOperationTicketManagement/jobTicket/components/firstWorkTicket.vue'
import secondWorkTicket from '@/views/substationOperationTicketManagement/jobTicket/components/secondWorkTicket.vue'
export default {
  name: "jobTicketReview",
  components: {
    stepsModel,
    firstWorkTicket,
    secondWorkTicket
  },
  props: ['type', 'hiddenVisible', 'checkForm', 'formData', 'approvalShow'],
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
      formModel: {},
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
          this.formModel = this.$lodash.cloneDeep(this.formData);
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
#printContent {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
}
</style>