<template>
  <a-modal
    :title="formTitle"
    :visible="hiddenVisible"
    @cancel="cancelHidden"
    class="from-style bigModel"
    :maskClosable="false"
  >
    <a-form-model :model="formList" ref="hiddenFormRef" :rules="formListRules">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="编号" prop="numbers">
            <a-input
              v-model="formList.numbers"
              disabled
              placeholder="系统自动生成"
            />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="申请日期" prop="applicationTime">
            <a-date-picker
              v-model="formList.applicationTime"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              @change="applicationTimeChange"
            />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="申请人" prop="application">
            <a-input
              placeholder="请输入"
              v-model="formList.application"
              disabled
            />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="所属部门" prop="department">
            <a-select
              placeholder="请选择"
              v-model="formList.department"
              @change="departmentChange"
            >
              <a-select-option
                v-for="(item, index) in departmentOption"
                :key="index"
                :value="item.label"
                >{{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="24">
          <a-form-model-item label="申请原因" prop="applyReason">
            <a-input
              v-model="formList.applyReason"
              type="textarea"
              placeholder="请输入"
              :auto-size="{ minRows: 6, maxRows: 6 }"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="table_header">
        <span>劳保用品</span>
        <a-button type="primary" @click="laborProtectionSuppliesAdd">
          新增
        </a-button>
      </div>
      <a-table
        :columns="formColumns"
        :scroll="{ x: 100 }"
        :data-source="formList.list"
        style="margin-top: 16px"
        class="form_table"
      >
        <template slot="labourProtectionNameInput" slot-scope="val, obj">
          <a-form-model-item
            :labelCol="{ span: 2 }"
            prop="labourProtectionName"
            style="width: 100%"
          >
            <a-input
              placeholder="请输入"
              v-model="obj.labourProtectionName"
              style="width: 100%"
            />
          </a-form-model-item>
        </template>
        <template slot="periodicInput" slot-scope="val, obj">
          <a-form-model-item :labelCol="{ span: 2 }" prop="periodic">
            <a-input
              placeholder="请输入"
              v-model="obj.periodic"
              style="width: 100%"
            />
          </a-form-model-item>
        </template>
        <template slot="amountInput" slot-scope="val, obj">
          <a-form-model-item :labelCol="{ span: 2 }" prop="amount">
            <a-input
              placeholder="请输入"
              v-model="obj.amount"
              style="width: 100%"
            />
          </a-form-model-item>
        </template>
        <template slot="specificationModelInput" slot-scope="val, obj">
          <a-form-model-item :labelCol="{ span: 2 }" prop="specificationModel">
            <a-input
              placeholder="请输入"
              v-model="obj.specificationModel"
              style="width: 100%"
            />
          </a-form-model-item>
        </template>
        <template slot="recipientNameInput" slot-scope="val, obj">
          <a-form-model-item :labelCol="{ span: 2 }" prop="recipientName">
            <a-input
              placeholder="请输入"
              v-model="obj.recipientName"
              style="width: 100%"
            />
          </a-form-model-item>
        </template>
        <template slot="remarkInput" slot-scope="val, obj">
          <a-form-model-item :labelCol="{ span: 2 }" prop="remark">
            <a-input
              placeholder="请输入"
              v-model="obj.remark"
              style="width: 100%"
            />
          </a-form-model-item>
        </template>
        <template slot="operate" slot-scope="val, obj, index">
          <pe-button
            :include="[
              {
                value: 'delete',
                name: '删除',
                style: 'btn_link',
                clickName: 'deleteClick',
                icon: '',
                type: 'link',
                isPower: false,
              },
            ]"
            @deleteClick="deleteClick(val, obj, index)"
          ></pe-button>
        </template>
      </a-table>
    </a-form-model>
    <template #footer>
      <div style="text-align: center">
        <!-- <a-button @click="cancelHidden">取消</a-button> -->
        <a-button type="primary" @click="saveForm('save')"> 保存 </a-button>
        <a-button type="primary" @click="saveForm('submit')"> 提交 </a-button>
      </div>
    </template>
  </a-modal>
</template>
<script>
import { selectCount } from '@/api/occupationalHealthManagement/laborInsuranceSuppliesApplication'
import { encode } from '@/api/public.js'
import { pinyin } from 'pinyin-pro'
export default {
  name: 'addAndEdit',
  props: [
    'formTitle',
    'formData',
    'hiddenVisible',
    'paginationTotal',
    'addMode',
    'copyData'
  ],

  data() {
    return {
      departmentOption: [
        { label: '公司领导', value: 'LD' },
        { label: '综合办公室', value: 'ZB' },
        { label: '党群工作部', value: 'DG' },
        { label: '人力资源部', value: 'RZ' },
        { label: '法律审计部', value: 'FS' },
        { label: '财务部', value: 'CW' },
        { label: '企管计划部', value: 'QJ' },
        { label: '生产技术部', value: 'SJ' },
        { label: '质量安全环保部', value: 'AH' },
        { label: '生产运营中心', value: 'SY' },
        { label: '检维修中心', value: 'JX' },
        { label: '运行保障中心', value: 'YB' }],
      formList: {
        numbers: '',
        applicationTime: '',
        application: undefined,
        department: undefined,
        applyReason: '',
        list: []
      },
      treeSelectOption: [],
      formColumns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
          width: 50,

        },
        {
          title: '劳保用品名称',
          dataIndex: 'labourProtectionName',
          scopedSlots: { customRender: 'labourProtectionNameInput' },
          width: 200,
          align: 'center'
        },
        {
          title: '周期',
          dataIndex: 'periodic',
          scopedSlots: { customRender: 'periodicInput' },
          width: 100,
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amountInput' },
          width: 100,
          align: 'center'
        },
        {
          title: '规格型号',
          dataIndex: 'specificationModel',
          scopedSlots: { customRender: 'specificationModelInput' },
          width: 200,
          align: 'center'
        },
        {
          title: '领用人',
          dataIndex: 'recipientName',
          scopedSlots: { customRender: 'recipientNameInput' },
          width: 100,
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remarkInput' },
          width: 200,
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          width: 50,
          scopedSlots: { customRender: 'operate' },
        },
      ],
      formListRules: {
        numbers: [
          { required: true, message: '编号不能为空', trigger: 'change' },
        ],
        applicationTime: [
          { required: true, message: '请选择申请日期', trigger: 'change' },
        ],
        application: [
          { required: true, message: '申请人不能为空', trigger: 'blur' },
        ],
        department: [
          { required: true, message: '请选择所属部门', trigger: 'change' },
        ],
        applyReason: [
          { required: true, message: '申请原因不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {
    hiddenVisible: {
      handler(newName) {
        if (newName) {
          this.formList = this.formData
          this.numbersGenerate()
        } else {
          this.$refs.hiddenFormRef.clearValidate()
        }
      },
    },
  },
  mounted() { },

  created() { },
  methods: {
    deleteClick(val, obj, index) {
      this.formList.list.splice(index, 1)
    },
    laborProtectionSuppliesAdd() {
      this.formList.list.push(
        {
          labourProtectionName: "",
          periodicInput: "",
          amount: "",
          specificationModel: "",
          recipientName: "",
          remark: "",
        }
      )
    },
    applicationTimeChange(val) {
      this.numbersGenerate()
    },
    departmentChange() {
      this.numbersGenerate()
    },
    numbersGenerate() {
      let pinyinFirst = ""
      let timeReplace = ''
      if (this.formList.department) {
        pinyinFirst = this.departmentOption.filter((item) => {
          if (item.label == this.formList.department) {
            return item
          }
        })[0].value
      }
      if (this.formList.applicationTime) {
        timeReplace = this.formList.applicationTime.replace(/-*/g, '')
      }
      if (!pinyinFirst || !timeReplace) {
        return false
      }
      if (this.addMode) {
        selectCount().then((res) => {
          if (res.code == 200) {
            this.$set(
              this.formList,
              'numbers',
              pinyinFirst + timeReplace + res.body.编号后三位
            )
          }
        })
      } else {
        let serialNumber = this.formList.numbers.substring(this.formList.numbers.length - 3)
        this.$set(
          this.formList,
          'numbers',
          pinyinFirst + timeReplace + serialNumber
        )
      }
    },
    eqmTypeSelect(value, node, extra) {
      this.formList.parentCode = node.dataRef.parentCode
      this.formList.eqmType = node.dataRef.label
    },
    cancelHidden() {
      this.formClose()
    },
    saveForm(action) {
      this.onSubmit(action)
    },
    onSubmit(action) {
      this.$refs.hiddenFormRef.validate((valid) => {
        if (valid) {
          if (this.formList.list.length === 0) {
            this.$message.warning('劳保用品不能为空')
            return false
          }
          this.$emit('submitForm', this.formList, this.addMode, action)
        } else {
          this.$message.warning('必填信息输入不完整')
          return false
        }
      })
    },

    formClose() {
      this.$emit('close')
    },
    fileListChange(val) {
      this.formList.flieList = val.list
    },
  },
}
</script>
<style scoped lang="less">
// .add_and_edit {
//   .ant-col-24 {
//     width: 100%;
//   }
// }
.ant-input[disabled] {
  color: #000;
}
.apply_reason {
  ::v-deep .ant-col-2 {
    width: auto;
  }
}
.table_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0px;
  span {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
  }
}
.form_table {
  .ant-form-item {
    margin-bottom: 0;
  }
  ::v-deep .ant-table-fixed-right .ant-table-tbody > tr {
    height: 56.8px !important;
  }
}
.bigModel .ant-modal-content .ant-form,
.bigModel .ant-modal-body .ant-form {
  max-height: 598px !important;
}
</style>
