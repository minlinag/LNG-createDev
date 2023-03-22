<template>
  <div>
    <a-modal
      :title="`LNG${dataSource[0].product}用结算单`"
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
            <a-form-model-item label="结算单号" prop="reportNumber">
              <a-input
                v-model.trim="dataForm.reportNumber"
                disabled
                placeholder="系统自动生成流水号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="编制部门" prop="deptCode">
              <a-input
                v-model.trim="dataForm.deptCode"
                disabled
                placeholder="系统根据创建人部门生成"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="编制日期" prop="createdDateTime">
              <a-input
                disabled
                v-model.trim="dataForm.createdDateTime"
                placeholder="创建日期"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="附件张数" prop="attachNum">
              <a-input
                :disabled="typeModel.type === 'detail'"
                v-model.trim="dataForm.attachNum"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="往来单位" prop="dealingUnit">
              <a-input
                disabled
                v-model.trim="dataForm.dealingUnit"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="结算单摘要" prop="settleDigest">
              <a-textarea
                :disabled="typeModel.type === 'detail'"
                v-model.trim="dataForm.settleDigest"
                placeholder="请输入"
                :auto-size="{ minRows: 6, maxRows: 6 }"
              ></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-table
          :scroll="{ x: 1100 }"
          :pagination="false"
          :columns="columns"
          :dataSource="dataSource"
          rowKey="id"
        >
          <template v-if="typeModel.type !== 'detail'">
            <template
              v-for="col in ['units', 'quantity', 'unitPrice', 'remark']"
              :slot="col"
            >
              <a-input
                v-if="col === 'units' || col === 'remark'"
                :key="col"
                v-model="dataSource[0][col]"
              />
              <a-input-number v-else :key="col" v-model="dataSource[0][col]" />
            </template>
            <template slot="product">
              <a-select
                v-model="dataSource[0].product"
                placeholder="请选择"
                :options="product"
              >
              </a-select>
            </template>
            <template slot="taxRate">
              <a-select
                v-model="dataSource[0].taxRate"
                placeholder="请选择"
                :options="selectData"
              >
              </a-select>
            </template>
          </template>
        </a-table>
        <stepsModel
          @approvalMethod="approvalMethod"
          v-if="typeModel.type !== 'edit'"
          :id="this.dataForm.id"
          ref="stepsModel"
          :isShow="typeModel.type === 'approval' ? true : false"
        />
      </a-form-model>
      <div class="ant-modal-footer">
        <span v-if="typeModel.type === 'approval'">
          <a-button type="primary">同意</a-button>
          <a-button type="danger">驳回</a-button>
        </span>
        <span v-else-if="typeModel.type !== 'detail'">
          <a-button type="primary" @click="handleOk(false)"> 保存 </a-button>
          <a-button type="primary" @click="handleOk(true)"> 提交 </a-button>
        </span>

        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  saveData,
  editData,
  submit,
  audio,
} from '@/api/expenseSettlement/expenseSettlement.js'
import { encode } from '@/api/dataDictionary'
import stepsModel from '@/components/approvalRecord/index.vue'
export default {
  components: { stepsModel },
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
      product: [
        { label: '气化费', value: '气化费' },
        { label: '存储费', value: '存储费' },
        { label: '冷能费', value: '冷能费' },
      ],
      // 表单
      dataForm: {
        reportNumber: '',
        deptName: '',
        deptCode: '',
        attachNum: '',
        createdDateTime: '',
        dealingUnit: '南港单位',
      },
      // 校验
      rules: {
        changeType: [
          { required: true, message: '变更类型不能为空', trigger: 'blur' },
        ],
      },
      columns: [
        {
          title: '结算期间',
          dataIndex: 'periodName',
          align: 'center',
          width: 150,
        },
        {
          title: '产品',
          dataIndex: 'product',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'product' },
        },
        {
          title: '单位',
          dataIndex: 'units',
          align: 'center',
          scopedSlots: { customRender: 'units' },
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          align: 'center',
          scopedSlots: { customRender: 'quantity' },
        },
        {
          title: '单价',
          dataIndex: 'unitPrice',
          align: 'center',
          scopedSlots: { customRender: 'unitPrice' },
        },
        {
          title: '含税金额',
          dataIndex: 'totalAmount',
          align: 'center',
          customRender: (text, record) => {
            let num = record.quantity * record.unitPrice
            this.dataSource[0].totalAmount = isNaN(num) ? 0 : num
            return isNaN(num) ? 0 : num
          },
        },
        {
          title: '不含税金额',
          dataIndex: 'untaxAmount',
          align: 'center',
          scopedSlots: { customRender: 'untaxAmount' },
          customRender: (text, record) => {
            let num = record.totalAmount - record.taxAmount
            this.dataSource[0].untaxAmount = isNaN(num) ? 0 : num
            return isNaN(num) ? 0 : num
          },
        },
        {
          title: '税额',
          dataIndex: 'taxAmount',
          align: 'center',
          customRender: (text, record) => {
            let str = record.taxRate.replace('%', '') / 100
            let num = record.quantity * record.unitPrice * str
            this.dataSource[0].taxAmount = isNaN(num) ? 0 : num
            return isNaN(num) ? 0 : num
          },
        },
        {
          title: '税率',
          dataIndex: 'taxRate',
          align: 'center',
          scopedSlots: { customRender: 'taxRate' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' },
        },
      ],
      selectData: [],
      dataSource: [
        {
          id: 1,
          periodName: '系统生成',
          product: '气化费',
          units: null,
          quantity: '',
          unitPrice: '',
          totalAmount: '',
          untaxAmount: '',
          taxAmount: '',
          taxRate: '4%',
          remark: '',
        },
      ],
    }
  },
  methods: {
    // // 下拉框输入框和表单分离问题
    // getPopupContainer() {
    //   return document.querySelector('.position')
    // },
    rejectClick() {
      this.$refs.stepsModel.verificationChange('0')
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange('1')
    },
    approvalMethod(type) {
      let data = {
        type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.dataForm.id,
      }
      audio(data).then((res) => {
        if (res.code == 200) {
          this.$message.success('审批成功')
          this.$parent.$parent.getList()
        }
        this.handleCancel()
      })
    },
    // 打开弹窗调用
    handleOpen(row) {
      this.dataForm.deptCode = this.$store.state.user.unitCode
      this.dataForm.deptName = this.$store.state.user.unitName
      this.encode()
      if (this.typeModel.type !== 'add') {
        this.dataForm = { ...row }
        this.$set(this.dataSource, '0', row)
        console.log(this.dataSource)
      }
    },

    // 数据字典-作业区域
    encode() {
      encode('JSD-SM').then((res) => {
        this.selectData = []
        res.body.data.forEach((item) => {
          this.selectData.push({
            value: item.dictname,
            label: item.dictname,
          })
        })
      })
    },
    // 关闭
    handleCancel() {
      this.dataSource = [
        {
          id: 1,
          periodName: '系统生成',
          product: '气化费',
          units: null,
          quantity: '',
          unitPrice: '',
          totalAmount: '',
          untaxAmount: '',
          taxAmount: '',
          taxRate: '4%',
          remark: '',
        },
      ]
      this.dataForm = {
        reportNumber: '',
        deptName: '',
        deptCode: '',
        attachNum: '',
        taxRate: '4%',
        createdDateTime: '',
        dealingUnit: '南港单位',
      }
      this.$emit('update:visible', false)
    },
    // 确定
    handleOk(flag) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let api = saveData
          let data = { ...this.dataForm, ...this.dataSource[0] }
          if (this.typeModel.type === 'edit') {
            api = editData
          }
          this.success(api, data, flag)
        }
      })
    },
    success(api, data, flag) {
      api(data).then((res) => {
        if (flag) {
          submit({ id: res.body || this.dataForm.id }).then((res) => {
            if (res.code == 200) {
              this.$message.success('提交成功')
              this.$parent.$parent.getList()
            }
          })
        } else {
          if (res.code == 200 && !flag) {
            this.$message.success('保存成功')
            this.$parent.$parent.getList()
          }
        }
        this.handleCancel()
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
