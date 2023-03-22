<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'add' },
            { value: 'Delete', clickName: 'headDelete' },
          ]"
          @add="addMonth"
          @headDelete="deleteClick"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div style="position: relative" class="position-disList">
        <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="结算单号:"
            >
              <a-input
                v-model="searchField.reportNumber"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="部门编码:"
            >
              <a-select
                ref="select"
                v-model="searchField.deptCode"
                placeholder="请选择"
                :options="selectData"
              >
                <a-select-option
                  v-for="item in selectData"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="客户编码:"
            >
              <a-input
                v-model="searchField.clientCode"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="创建人:"
            >
              <a-input
                v-model="searchField.createdUser"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="结算日期:"
            >
              <a-date-picker
                placeholder="请选择"
                v-model="searchField.reportDate"
                valueFormat="YYYY-MM-DD"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item>
              <a-button
                v-Query
                class="buttonType"
                type="primary"
                @click.stop="search"
              >
                查询
              </a-button>
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>
          </a-col>
        </a-form-model>
      </div>
      <dc-table
        :scroll="{ y: 1, x: 2000 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          columnWidth: 30,
        }"
      >
        <template slot="stauts" slot-scope="text">
          {{ text | recordStatus }}
        </template>
        <template slot="operation" slot-scope="text, row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'editMonth',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.editDisabled(row.recordStatus),
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'detailMonth',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: '审批',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
            ]"
            @editMonth="editMonth(row, 'edit')"
            @detailMonth="editMonth(row, 'detail')"
            @approval="editMonth(row, 'approval')"
          ></pe-button>
        </template>
      </dc-table>
      <formModel
        ref="formModel"
        :visible.sync="visible"
        :typeModel="typeModel"
      />
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  deleteData,
} from '@/api/expenseSettlement/expenseSettlement.js'
import moment from 'moment'
import { encode } from '@/api/dataDictionary'
import formModel from './components/formModel.vue'
export default {
  components: { formModel },
  name: 'expenseSettlement',
  filters: {
    recordStatus(val) {
      let value = ''
      switch (val) {
        case '1':
          value = '已保存'
          break
        case '2':
          value = '已提交'
          break
        case '3':
          value = '已完成'
          break
        case '4':
          value = '已审批'
          break
        case '5':
          value = '已拒绝'
          break
        default:
          break
      }
      return value
    },
  },
  data() {
    return {
      typeModel: {},
      // 筛选字段
      searchField: {
        reportNumber: '',
        deptCode: undefined,
        clientCode: '',
        createdUser: '',
        reportDate: '',
      },
      selectedRowKeys: [],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
          align: 'center',
        },
        {
          title: '结算单号',
          dataIndex: 'reportNumber',
          width: 150,
          align: 'center',
        },
        {
          title: '业务类型',
          dataIndex: 'bussinessType',
          align: 'center',
        },
        {
          title: '期间',
          dataIndex: 'periodName',
          align: 'center',
        },
        {
          title: '结算单日期',
          dataIndex: 'reportDate',
          align: 'center',
        },
        {
          title: '单位编码',
          dataIndex: 'unitCode',
          align: 'center',
        },
        {
          title: '部门编码',
          dataIndex: 'deptCode',
          align: 'center',
        },
        {
          title: '客户编码',
          dataIndex: 'clientCode',
          align: 'center',
        },
        // {
        //   title: '结算单摘要',
        //   dataIndex: 'settleDigest',
        //   align: 'center',
        // },
        {
          title: '产品',
          dataIndex: 'product',
          align: 'center',
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          align: 'center',
        },
        {
          title: '单位',
          dataIndex: 'units',
          align: 'center',
        },
        {
          title: '单价',
          dataIndex: 'unitPrice',
          align: 'center',
        },
        {
          title: '含税金额',
          dataIndex: 'totalAmount',
          align: 'center',
        },
        {
          title: '不含税金额',
          dataIndex: 'untaxAmount',
          align: 'center',
        },
        {
          title: '税额',
          dataIndex: 'taxAmount',
          align: 'center',
        },
        {
          title: '税码',
          dataIndex: 'taxRate',
          align: 'center',
        },
        {
          title: '创建人',
          dataIndex: 'createdUser',
          align: 'center',
        },
        {
          title: '创建日期',
          dataIndex: 'createdDateTime',
          align: 'center',
          customRender: (text) => {
            return moment(text).format('YYYY-MM-DD')
          },
        },
        {
          title: '状态',
          fixed: 'right',
          dataIndex: 'recordStatus',
          align: 'center',
          width: 70,
          scopedSlots: { customRender: 'stauts' },
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: 120,
        },
      ],
      dataSource: [],
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      // 部门编码数据
      selectData: [],
      visible: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.encode()
      this.getList()
    },
    // 数据字典-作业区域
    encode() {
      encode('JSD-BMBM').then((res) => {
        this.selectData = []
        res.body.data.forEach((item) => {
          this.selectData.push({
            value: item.dictcode,
            label: item.dictname,
          })
        })
      })
    },
    getList(pageNum = 1, pageSize = 10) {
      const data = {
        pageNum,
        pageSize,
        ...this.searchField,
      }
      getList(data).then((res) => {
        const { data, pageIndex, total, pageSize } = res.body
        this.dataSource = data || []
        this.pagination.current = pageIndex
        this.pagination.total = total
        this.pagination.pageSize = pageSize
      })
    },
    // 搜索
    search() {
      this.getList()
    },
    // 重置
    resetForm() {
      this.searchField = {
        planMonth: '',
      }
      this.getList()
    },
    // 删除
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteData(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = []
            this.$message.success('删除成功')
            this.getList(1, this.pagination.pageSize)
          }
        })
      } else {
        this.$message.warning('请选择记录！')
      }
    },
    // 页码改变调用
    paginationChange(pagination) {
      this.pagination.pageNum = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getList(this.pagination.pageNum, this.pagination.pageSize)
    },
    // 选择改变调用
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    editMonth(row, type) {
      this.typeModel.type = type
      this.visible = true
      this.$refs.formModel.handleOpen(row)
    },
    // 新增
    addMonth() {
      this.typeModel.type = 'add'
      this.visible = true
      this.$refs.formModel.handleOpen()
    },
    // 禁用选择框，只能删除次月的
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus != 1 && record.recordStatus != 5,
        },
      }
    },
  },
}
</script>
<style scoped></style>
