<template>
  <div>
    <a-modal
      :title="typeModel.title"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
      class="from-style middleModel"
      :maskClosable="false"
      destroyOnClose
    >
      <a-form-model ref="dataForm" :model="dataForm" :rules="rules">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="交班电工" prop="toWorker">
              <a-input
                v-model.trim="dataForm.toWorker"
                placeholder="请输入"
                :disabled="disabled"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="交班时间" prop="toTime">
              <a-date-picker
                v-model="dataForm.toTime"
                showTime
                valueFormat="YYYY-MM-DD HH:mm:ss"
                :disabled="disabled"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="值班时间" prop="shiftDate">
              <a-range-picker
                class="time"
                v-model="dataForm.shiftDate"
                showTime
                valueFormat="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始日期', '结束日期']"
                :disabled="disabled"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="安全生产" prop="safePro">
              <a-textarea
                v-model.trim="dataForm.safePro"
                placeholder="记录本班安全生产安排、临时危险性作业的安全措施，各种安全会议等"
                :disabled="disabled"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="设备缺陷及故障处理" prop="defects">
              <a-textarea
                v-model.trim="dataForm.defects"
                placeholder="记录缺陷状况及预防措施，故障处理方法和安全措施"
                :disabled="disabled"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="值班记事" prop="workEvent">
              <a-textarea
                v-model.trim="dataForm.workEvent"
                placeholder="记录设备运行方式及状况，日常工作，交班人员应交代清楚以上两班设备运行状况、需注意事项等"
                :disabled="disabled"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="常用工具及仪表" prop="commonTools">
              <a-textarea
                v-model.trim="dataForm.commonTools"
                placeholder="仪表及工器具是否齐全、有无损坏、外借等情况"
                :disabled="disabled"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="定点巡视" prop="timeAround">
              <a-textarea
                v-model.trim="dataForm.timeAround"
                placeholder="每2小时一次"
                :disabled="disabled"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div v-if="disabled">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="接班记事" prop="takeEvent">
                <a-textarea
                  v-model.trim="dataForm.takeEvent"
                  placeholder="接班人员应查看以上两班记录、问清设备运行状况，并将交班角度是否清楚等问题记录清楚"
                  :disabled="typeModel.type == 'view'"
                  :auto-size="{ minRows: 6, maxRows: 6 }"
                ></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="接班电工" prop="takeWorker">
                <a-input
                  v-model.trim="dataForm.takeWorker"
                  :disabled="typeModel.type == 'view'"
                  placeholder="请输入"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="接班时间" prop="takeTime">
                <a-date-picker
                  v-model="dataForm.takeTime"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  :disabled="typeModel.type == 'view'"
                  placeholder="请选择"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button v-if="typeModel.type === 'view'" @click="handleCancel"
          >取消</a-button
        >
        <a-button v-if="this.typeModel.type === 'view'" @click="print('yes')"
          >打印交班记录</a-button
        >
        <div v-else>
          <div v-if="typeModel.type === 'work'">
            <a-button type="primary" @click="handleOk(false, 'no')">
              接班
            </a-button>
            <a-button @click="returnData(false, 'no', true)">退回</a-button>
          </div>
          <div v-else>
            <a-button type="primary" @click="handleOk(false)"> 保存 </a-button>
            <a-popconfirm
              title="是否打印当前页面数据?"
              ok-text="是"
              cancel-text="否"
              @confirm="handleOk(true, 'yes')"
              @cancel="handleOk(true, 'no')"
            >
              <a-button type="primary"> 提交 </a-button>
            </a-popconfirm>
            <a-button @click="handleCancel">取消</a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { saveData, editData } from '@/api/dispatchingManagement/ChangeShifts'
export default {
  name: 'formModel',
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    typeModel: {
      type: Object,
      default: () => {
        return { type: 'add', title: '新增设备变更' }
      },
    },
  },
  data() {
    return {
      disabled: false,
      // 表单
      dataForm: {
        toWorker: '',
        toTime: '',
        shiftDate: [],
        safePro: '',
        defects: '',
        workEvent: '',
        commonTools: '',
        timeAround: '',
        takeEvent: '',
        takeWorker: '',
        takeTime: '',
      },
      // 校验
      toRules: {
        toWorker: [
          { required: true, message: '交班电工不能为空', trigger: 'blur' },
        ],
        toTime: [
          { required: true, message: '交班时间不能为空', trigger: 'change' },
        ],
        shiftDate: [
          { required: true, message: '值班时间不能为空', trigger: 'change' },
        ],
      },
      takeRules: {
        takeEvent: [
          { required: true, message: '接班电工不能为空', trigger: 'blur' },
        ],
        takeWorker: [
          { required: true, message: '接班时间不能为空', trigger: 'blur' },
        ],
        takeTime: [
          { required: true, message: '接班时间不能为空', trigger: 'change' },
        ],
      },
      rules: {},
    }
  },
  methods: {
    // 打开弹窗调用
    handleOpen(row) {
      this.rules = { ...this.toRules, ...this.takeRules }
      if (this.typeModel.type !== 'add') {
        this.typeModel.type !== 'edit'
          ? (this.disabled = true)
          : (this.disabled = false)
        this.dataForm = {
          ...row,
          shiftDate: [row.startWorkTime, row.endWorkTime],
        }
      }
    },
    print(falg) {
      falg === 'yes' && this.$emit('isParintClick', this.dataForm)
    },
    // 关闭
    handleCancel(falg) {
      this.print(falg)
      // falg === 'yes' && this.$emit('isParintClick', this.dataForm)
      this.disabled = false
      this.dataForm = {}
      this.$refs.dataForm.resetFields()
      this.$emit('update:visible', false)
    },
    returnData(flag, isPrint, returnData) {
      this.rules = { ...this.toRules }
      setTimeout(() => {
        this.handleOk(flag, isPrint, returnData)
      }, 50)
    },
    // 确定
    handleOk(flag, isPrint, returnData) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let api = saveData
          let data = this.dataForm
          data.startWorkTime = this.dataForm.shiftDate[0]
          data.endWorkTime = this.dataForm.shiftDate[1]
          flag
            ? (data.stauts = '2')
            : returnData
            ? (data.stauts = '4')
            : this.typeModel.type === 'work'
            ? (data.stauts = '3')
            : (data.stauts = '1')
          if (
            this.typeModel.type === 'edit' ||
            this.typeModel.type === 'work'
          ) {
            api = editData
          }
          this.success(api, data, flag, isPrint, '', returnData)
        }
      })
    },
    success(api, data, flag, isPrint, commit, returnData) {
      let commitData = JSON.parse(JSON.stringify(data))
      api(data).then((res) => {
        if (commit) {
          if (res.code == 200) {
            this.$message.success('提交成功')
            this.$parent.$parent.getList()
            this.handleCancel(isPrint)
          }
        } else {
          if (res.code == 200) {
            this.$message.success(
              this.typeModel.type === 'work'
                ? returnData
                  ? '退回成功'
                  : '接班成功'
                : '保存成功'
            )
            if (flag && this.typeModel.type === 'add') {
              flag && (commitData.id = res.body)
              this.success(editData, commitData, flag, isPrint, true)
            } else {
              this.$parent.$parent.getList()
              this.handleCancel(isPrint)
            }
          }
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
.time {
  width: 530px !important;
  /deep/.ant-calendar-picker-input.ant-input {
    width: 530px !important;
  }
}
.ant-calendar-picker {
  /deep/.ant-calendar-picker-icon {
    right: 25px !important;
  }
}
</style>
