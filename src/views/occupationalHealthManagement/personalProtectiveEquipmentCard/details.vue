<template>
  <a-modal
    :title="formTitle"
    :visible="hiddenVisible"
    @cancel="cancelHidden"
    class="from-style bigModel application_form"
    :footer="null"
    :maskClosable="false"
  >
    <a-form-model>
      <div class="table" id="printContent">
        <h3>北京燃气集团(天津)液化天然气有限公司<br />个人防护用品卡</h3>
        <div class="code_header">
          <div>
            <span>部门：{{ formList.department }}</span>
            <span>班组:{{ formList.teamGroup }}</span>
            <span>姓名：{{ formList.list[0].recipientName }}</span>
          </div>
          <div>
            <span>岗位工种：{{ formList.postWorkType }}</span>
            <span>工种变更时间：{{ formList.workTypeChangeTime }}</span>
            <span>编码：{{ formList.list[0].issueName }}</span>
          </div>
        </div>
        <div class="table_body">
          <table class="table_list">
            <tr>
              <th style="width: 57px,border-top: 1px solid #000;">序号</th>
              <th style="border-top: 1px solid #000">物品名称</th>
              <th style="border-top: 1px solid #000">周期</th>
              <th style="border-top: 1px solid #000">数量</th>
              <th style="border-top: 1px solid #000">规格型号</th>
              <th style="border-top: 1px solid #000">领用日期</th>
              <th style="border-top: 1px solid #000">发放人</th>
              <th style="border-top: 1px solid #000; width: 130px">备注</th>
            </tr>
            <tr v-for="(item, index) in formList.list" :key="index">
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-bottom: 1px solid #000;
                "
              >
                {{ index + 1 }}
              </td>
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-bottom: 1px solid #000;
                "
              >
                {{ item.labourProtectionName }}
              </td>
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-bottom: 1px solid #000;
                "
              >
                {{ item.periodic }}
              </td>
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-bottom: 1px solid #000;
                "
              >
                {{ item.amount }}
              </td>
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-bottom: 1px solid #000;
                "
              >
                {{ item.specificationModel }}
              </td>
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-bottom: 1px solid #000;
                "
              >
                {{ principal[3]?.executeTime }}
              </td>
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-bottom: 1px solid #000;
                "
              >
                {{ principal[3]?.executorName }}
              </td>
              <td
                style="
                  border-top: 1px solid #000;
                  border-left: 1px solid #000;
                  border-right: 1px solid #000;
                  border-bottom: 1px solid #000;
                "
              >
                {{ item.remark }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button type="primary" v-print="'#printContent'"> 打印 </a-button>
      <a-button @click="cancelHidden"> 取消 </a-button>
    </div>
  </a-modal>
</template>
<script>

import { historyList } from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'

export default {
  name: 'detailsList',
  props: [
    'formTitle',
    'formData',
    'hiddenVisible',
  ],

  data() {
    return {
      formList: {},
      principal: [],
    }
  },
  watch: {
    hiddenVisible: {
      handler(newName) {
        if (newName) {
          this.formList = this.formData
          historyList({ businessId: this.formData.id }).then(res => {
            this.principal = res.body.data.map((item) => {
              return {
                executorName: item.executorName,
                executeTime: item.executeTime
              }
            })
          })
        }
      },
    },
  },
  mounted() { },

  created() {
  },
  methods: {
    cancelHidden() {
      this.formClose()
    },
    formClose() {
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
    flex-direction: column;
    div {
      span {
        width: 33%;
        display: inline-block;
      }
    }
    div + div {
      margin-top: 10px;
    }
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
  }
}
.operate_button {
  text-align: center;
  margin-top: 20px;
}
.steps_model_style {
  margin-top: 20px;
  ::v-deep .ant-form-item {
    margin-bottom: auto;
  }
}
</style>
