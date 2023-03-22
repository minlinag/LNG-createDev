<template>
  <div>
    <a-form-model>
      <div class="table" id="printContent">
        <h3>劳动用品申请表</h3>
        <div class="code_header">
          <span>编号：{{ formList.numbers }}</span>
          <span>申请日期：{{ formList.applicationTime }}</span>
        </div>
        <div class="table_body">
          <table class="table_list">
            <tr>
              <th style="width: 57px,border-top: 1px solid #000;">序号</th>
              <th style="border-top: 1px solid #000">劳保用品名称</th>
              <th style="border-top: 1px solid #000">周期</th>
              <th style="border-top: 1px solid #000">数量</th>
              <th style="border-top: 1px solid #000">规格型号</th>
              <th style="border-top: 1px solid #000">发放时间</th>
              <th style="border-top: 1px solid #000">领用人</th>
              <th style="border-top: 1px solid #000">备注</th>
            </tr>
            <tr v-for="(item, index) in formList.list" :key="index">
              <td
                style="border-top: 1px solid #000; border-left: 1px solid #000"
              >
                {{ index + 1 }}
              </td>
              <td
                style="border-top: 1px solid #000; border-left: 1px solid #000"
              >
                {{ item.labourProtectionName }}
              </td>
              <td
                style="border-top: 1px solid #000; border-left: 1px solid #000"
              >
                {{ item.periodic }}
              </td>
              <td
                style="border-top: 1px solid #000; border-left: 1px solid #000"
              >
                {{ item.amount }}
              </td>
              <td
                style="border-top: 1px solid #000; border-left: 1px solid #000"
              >
                {{ item.specificationModel }}
              </td>
              <td
                style="border-top: 1px solid #000; border-left: 1px solid #000"
              >
                {{ executeTime }}
              </td>
              <td
                style="border-top: 1px solid #000; border-left: 1px solid #000"
              >
                {{ item.recipientName }}
              </td>
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-right: 1px solid #000;
                "
              >
                {{ item.remark }}
              </td>
            </tr>
          </table>
          <div
            class="apply_reason"
            style="border: 1px #000 solid; line-height: 44px"
          >
            <span>申请原因：</span>
            <span>{{ formList.applyReason }}</span>
          </div>
          <table class="table_single">
            <tr>
              <td style="border: 1px solid #000; border-top: none; width: 50%">
                <span>申请人：{{ formList.application }}</span>
              </td>
              <td style="border: 1px solid #000; border-top: none">
                <span>申请人所在部门：{{ formList.department }}</span>
              </td>
            </tr>
            <tr>
              <td style="border-bottom: 0; border: 1px solid #000; width: 50%">
                <span>所属部门负责人:{{ principal[0] }}</span>
              </td>
              <td style="border: 1px solid #000">
                <span>劳保主管部门负责人:{{ principal[1] }}</span>
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; width: 50%">
                <span> 仓储主管部门负责人:{{ principal[2] }}</span>
              </td>
              <td style="border: 1px solid #000">
                <span>发放人:{{ principal[3] }}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="operate_button">
        <a-button type="primary" v-print="'#printContent'"> 打印 </a-button>
      </div>
      <stepsModel
        ref="stepsModel"
        class="steps_model_style"
        :id="formList.id"
        :isShow="true"
        @approvalMethod="approvalMethod"
      />
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button type="primary" @click="passClick"> 确认 </a-button>
      <a-button type="danger" @click="rejectClick">驳回</a-button>
      <a-button @click="cancelHidden"> 返回 </a-button>
    </div>
  </div>
</template>
<script>
import stepsModel from '@/components/approvalRecord/index.vue'
import { historyList } from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'
import {
  queryByID,
  labourProtectionApplyAudio,
} from '@/api/occupationalHealthManagement/laborInsuranceSuppliesApplicationLedger'
export default {
  name: 'laborInsuranceSuppliesApplicationApproval',
  components: { stepsModel },

  data() {
    return {
      formList: {},
      principal: [],
      executeTime: '',
    }
  },
  watch: {

  },
  mounted() { },

  created() {
    this.getListData()

  },
  methods: {
    getListData() {
      this.formList.id = ""
      return queryByID({ ID: this.$route.query.id }).then((res) => {
        if (res.code == 200) {
          this.formList = res.body[0]
          this.formList.list = res.body[1]
          historyList({ businessId: this.formList.id }).then(res => {
            this.principal = res.body.data.map((item) => {
              return item.executorName
            })
            if (res.body.data[3]) {
              this.executeTime = res.body.data[3].executeTime
            } else {
              this.executeTime = ""
            }

          })
        }
      })
    },
    cancelHidden() {
      this.formClose()
    },
    rejectClick() {
      this.$refs.stepsModel.verificationChange('0')
    },
    passClick() {
      this.$refs.stepsModel.verificationChange('1')
    },
    approvalMethod() {
      let val = {
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.formList.id
      }
      labourProtectionApplyAudio(val).then((res) => {
        if (res.code == 200) {
          this.$message.success('完成审核')
          this.getListData()
        }
      })
    },

    formClose() {
      this.formList.id = ""
      this.$emit('close')
    },
  },
}
</script>
<style scoped lang="less">
.application_form {
}
.table {
  h3 {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  .code_header {
    width: calc(100% - 20px);
    margin-left: 10px;
    display: flex;
    justify-content: space-between;
  }

  .table_body {
    margin-top: 10px;
    table {
      width: 100%;
    }
    .table_list {
      text-align: center;
      tr {
        line-height: 47px;
        th {
          border-bottom: none;
          border-top: 1px solid #000;
        }
        th:nth-child(1) {
          border-left: 1px solid #000;
          border-right: 1px solid #000;
        }
        th + th {
          border-right: 1px solid #000;
          // border-right: none;
        }
      }
    }
    .apply_reason {
      border: 1px #000 solid;
      line-height: 44px;
      span:nth-child(1) {
        margin-left: 20px;
      }
    }
    .table_single {
      tr {
        line-height: 44px;
        border-top: 0px;
        td {
          span {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
.operate_button {
  text-align: center;
  margin-top: 20px;
  button:nth-child(1) {
    margin-left: 0;
  }
}
.steps_model_style {
  margin-top: 20px;
  ::v-deep .ant-form-item {
    margin-bottom: auto;
  }
}
.ant-modal-footer {
  text-align: center;
}
</style>
