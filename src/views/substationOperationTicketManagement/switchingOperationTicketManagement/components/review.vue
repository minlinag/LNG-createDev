<template>
  <div>
    <a-form-model ref="formRef" :model="formModel">
      <div class="form_piece_title">
        <span></span>
        <a-button type="primary" v-print="'#printContent'">打印</a-button>
      </div>
      <div id="printContent">
        <div style="width: 700px">
          <h5 style="font-size: 20px; text-align: center; color: #000">
            变电站倒闸操作票
          </h5>
          <div style="display: inline-block">
            <p style="display: inline-block; font-weight: 900; color: #000">
              单位：
            </p>
            <p style="display: inline-block; color: #000">
              {{ formModel.company }}
            </p>
          </div>
          <div style="float: right">
            <p style="display: inline-block; font-weight: 900; color: #000">
              编号：
            </p>
            <p style="display: inline-block; color: #000">
              {{ formModel.codeNo }}
            </p>
          </div>
        </div>
        <table
          border="1"
          style="width: 700px; border-color: #000; border-style: solid"
        >
          <tr>
            <td style="padding: 0 auto">
              <span
                style="
                  width: 80px;
                  line-height: 30px;
                  display: inline-block;
                  text-align: center;
                  font-weight: 900;
                  color: #000;
                "
              >
                发令人
              </span>
              <span
                style="
                  width: 120px;
                  line-height: 30px;
                  display: inline-block;
                  border-left: solid 1px #000;
                  vertical-align: middle;
                  height: 32px;
                  text-align: center;
                  color: #000;
                "
                >{{ formModel.offerUser }}</span
              >
              <span
                style="
                  width: 80px;
                  line-height: 30px;
                  display: inline-block;
                  border-left: solid 1px #000;
                  vertical-align: middle;
                  height: 32px;
                  text-align: center;
                  font-weight: 900;
                  color: #000;
                "
              >
                受令人
              </span>
              <span
                style="
                  width: 100px;
                  line-height: 30px;
                  display: inline-block;
                  border-left: solid 1px #000;
                  vertical-align: middle;
                  height: 32px;
                  text-align: center;
                  color: #000;
                "
              >
                {{ formModel.receUser }}</span
              >
            </td>
            <td style="padding-left: 10px; line-height: 30px; color: #000">
              <span style="font-weight: 900">发 令 时 间：</span>
              {{ splitTime(formModel.offerTime, 0) }}年{{
                splitTime(formModel.offerTime, 1)
              }}月{{ splitTime(formModel.offerTime, 2) }}日{{
                splitTime(formModel.offerTime, 3)
              }}时{{ splitTime(formModel.offerTime, 4) }}分
            </td>
          </tr>
          <tr>
            <td style="padding-left: 10px; line-height: 30px; color: #000">
              <span style="font-weight: 900">操作开始时间：</span
              >{{ splitTime(formModel.startRunTime, 0) }}年{{
                splitTime(formModel.startRunTime, 1)
              }}月{{ splitTime(formModel.startRunTime, 2) }}日{{
                splitTime(formModel.startRunTime, 3)
              }}时{{ splitTime(formModel.startRunTime, 4) }}分
            </td>
            <td style="padding-left: 10px; line-height: 30px; color: #000">
              <span style="font-weight: 900">操作结束时间：</span
              >{{ splitTime(formModel.endRunTime, 0) }}年{{
                splitTime(formModel.endRunTime, 1)
              }}月{{ splitTime(formModel.endRunTime, 2) }}日{{
                splitTime(formModel.endRunTime, 3)
              }}时{{ splitTime(formModel.endRunTime, 4) }}分
            </td>
          </tr>
        </table>
        <div
          style="
            border-right: 1px solid #000;
            border-left: 1px solid #000;
            width: 700px;
            line-height: 30px;
            color: #000;
          "
        >
          <p style="padding-left: 10px; line-height: 30px">
            <span style="font-weight: 900">操作任务：</span
            >{{ formModel.runTask }}
          </p>
        </div>
        <table
          border="1"
          style="
            width: 700px;
            color: #000;
            border-color: #000;
            border-style: solid;
          "
        >
          <tr>
            <td
              style="
                width: 30px;
                text-align: center;
                line-height: 30px;
                font-weight: 900;
                color: #000;
              "
            >
              √
            </td>
            <td
              style="
                width: 50px;
                text-align: center;
                line-height: 30px;
                font-weight: 900;
                color: #000;
              "
            >
              顺序
            </td>
            <td
              style="
                text-align: center;
                line-height: 30px;
                font-weight: 900;
                color: #000;
              "
            >
              操作项目
            </td>
          </tr>
          <tr v-for="(item, index) in 18" :key="index">
            <td
              style="
                width: 30px;
                text-align: center;
                line-height: 30px;
                color: #000;
              "
            >
              {{
                !formModel.bzList[index]
                  ? ""
                  : formModel.bzList[index]?.content2 == "是"
                  ? "√"
                  : "×"
              }}
            </td>
            <td
              style="
                width: 50px;
                text-align: center;
                line-height: 30px;
                color: #000;
                height: 30px;
              "
            >
              {{ !formModel.bzList[index] ? "" : index + 1 }}
            </td>
            <td style="text-align: center; line-height: 30px; color: #000">
              {{ formModel.bzList[index]?.content1 }}
            </td>
          </tr>
        </table>
        <div
          style="
            border-right: 1px solid #000;
            border-left: 1px solid #000;
            border-bottom: 1px solid #000;
            width: 700px;
            color: #000;
          "
        >
          <p style="padding-left: 10px; line-height: 30px; color: #000">
            <span style="font-weight: 900">备注：</span>{{ formModel.remark }}
          </p>
          <p></p>
        </div>
        <div
          style="
            border-right: 1px solid #000;
            border-left: 1px solid #000;
            width: 700px;
            border-bottom: 1px solid #000;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
          "
        >
          <p
            style="
              margin-bottom: 0px;
              line-height: 30px;
              margin-left: 10px;
              color: #000;
            "
          >
            <span style="font-weight: 900; color: #000">操作人：</span
            >{{ formModel.createdUser }}
          </p>
          <p style="margin-bottom: 0px; line-height: 30px; color: #000">
            <span style="font-weight: 900; color: #000">监护人：</span
            >{{ formModel.guardianUser }}
          </p>
          <p
            style="
              margin-bottom: 0px;
              line-height: 30px;
              margin-right: 10px;
              color: #000;
            "
          >
            <span style="font-weight: 900; color: #000">负责人：</span
            >{{ formModel.responsibleUser }}
          </p>
        </div>
      </div>
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
    </a-form-model>
  </div>
</template>

<script>
import stepsModel from '@/components/approvalRecord/index.vue'
export default {
  name: "switchingOperationTicketManagementReview",
  components: {
    stepsModel
  },
  props: ['type', 'hiddenVisible', 'checkForm', 'formEditData'],
  data() {
    return {}
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
    agree() {
      this.$refs.stepsModel.verificationChange('1')
    },
    reject() {
      this.$refs.stepsModel.verificationChange('0')
    },
    approvalMethod(type) {
      this.$emit('approval', {
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.formModel.baseID,
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
    splitTime(time, index) {
      // 2023-02-15 14:38:57 转化  [2023,02,15,14,38,57]
      let timeArr = time.split(/[- :]/);
      return timeArr[index]
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

<style media="print">
@page {
  size: portrait;
}
</style>