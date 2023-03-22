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
      <div style="position: relative" class="position-changeList">
        <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item
              label="值班日期:"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-range-picker
                v-model="searchField.shiftDate"
                valueFormat="YYYY-MM-DD 00:00:00"
                :placeholder="['开始日期', '结束日期']"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="接班电工:"
            >
              <a-input
                v-model="searchField.takeWorker"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="交班电工:"
            >
              <a-input
                v-model="searchField.toWorker"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
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
        </a-form-model>
      </div>
      <dc-table
        :scroll="{ y: 1, x: 1300 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          columnWidth: 30,
        }"
        :pagination="pagination"
        :openSelector="false"
      >
        <template slot="stauts" slot-scope="text">
          {{ text | recordStatus }}
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'editMonth',
                icon: '',
                show: row.stauts === '1' || row.stauts === '4',
                style: ['btn_link'],
              },
              {
                value: 'Add',
                name: '接班',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                show: row.stauts === '2',
              },
              {
                value: 'View',
                name: '详情',
                isPower: false,
                type: 'link',
                clickName: 'viewJump',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @editMonth="
              editMonth(row, { type: 'edit', title: '变电所交接班记录-编辑' })
            "
            @viewJump="
              editMonth(row, { type: 'view', title: '变电所交接班记录-详情' })
            "
            @approval="
              editMonth(row, { type: 'work', title: '变电所交接班记录-交接' })
            "
          ></pe-button>
        </template>
      </dc-table>
      <print v-show="printData" class="print" ref="print" />
      <formModel
        ref="formModel"
        :visible.sync="visible"
        :typeModel="typeModel"
        @isParintClick="isParintClick(arguments)"
      />
    </template>
  </Breadcrumb>
</template>
<script>
// import moment from 'moment'
import { list, deleteData } from '@/api/dispatchingManagement/ChangeShifts'
import formModel from './components/formModel.vue'
import print from './components/print.vue'
export default {
  components: { formModel, print },
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
          value = '退回'
          break
        default:
          break
      }
      return value
    },
  },
  data() {
    return {
      // 表单弹窗控制
      visible: false,
      typeModel: { type: 'add', title: '变电所交接班记录-新增' },
      // 搜索字段
      searchField: {
        shiftDate: [],
        takeWorker: '',
        toWorker: '',
      },
      selectedRowKeys: [],
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
          title: '值班时间',
          dataIndex: 'startWorkTime',
          width: 300,
          align: 'center',
          customRender: (value, row) => {
            return `${value}-${row.endWorkTime}`
          },
        },
        {
          title: '交班电工',
          dataIndex: 'toWorker',
          align: 'center',
        },
        {
          title: '交班时间',
          dataIndex: 'toTime',
          align: 'center',
        },
        {
          title: '接班电工',
          dataIndex: 'takeWorker',
          align: 'center',
        },
        {
          title: '接班时间',
          dataIndex: 'takeTime',
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'stauts',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'stauts' },
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: 150,
        },
      ],
      dataSource: [],
      printData: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // // 下拉框输入框和表单分离问题
    // getPopupContainer() {
    //   return document.querySelector('.position-changeList')
    // },
    isParintClick(data) {
      this.printData = true
      this.$refs.print.initData(JSON.parse(JSON.stringify(data[0])))
      setTimeout(() => {
        this.$printPage(this.$refs.print)
        this.printData = false
      }, 100)
    },
    init() {
      this.getList()
    },
    getList(pageNum = 1, pageSize = 10) {
      this.data = {
        startWorkTime: this.searchField.shiftDate[0],
        endWorkTime: this.searchField.shiftDate[1],
        takeWorker: this.searchField.takeWorker,
        toWorker: this.searchField.toWorker,
      }
      const data = {
        pageNum,
        pageSize,
        ...this.data,
      }
      list(data).then((res) => {
        const { data, pageIndex, total, pageSize } = res.body
        this.dataSource = data || []
        this.pagination.current = pageIndex
        this.pagination.total = total
        this.pagination.pageSize = pageSize
      })
    },
    // 新增
    addMonth() {
      this.typeModel = { type: 'add', title: '变电所交接班记录-新增' }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formModel.handleOpen()
      })
    },
    // 审批/查看
    editMonth(row, data) {
      this.typeModel = data
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formModel.handleOpen(row)
      })
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
    // 列表选择
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.stauts === '2' || record.stauts === '3',
        },
      }
    },
    // 搜索
    search() {
      this.getList()
    },
    // 页码改变的方法
    paginationChange(pagination) {
      this.pagination.pageNum = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getList(this.pagination.pageNum, this.pagination.pageSize)
    },
    //重置输入
    resetForm() {
      this.searchField = {
        shiftDate: [],
        takeWorker: '',
        toWorker: '',
      }
      this.getList()
    },
  },
}
</script>
<style>
.print {
  position: absolute;
  z-index: -10;
  margin-top: 20px;
}
.ant-table-cell {
  white-space: nowrap;
}
</style>
