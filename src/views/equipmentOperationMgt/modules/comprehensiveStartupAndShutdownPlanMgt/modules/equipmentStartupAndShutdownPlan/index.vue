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
              label="计划月度:"
            >
              <a-month-picker
                 placeholder="请选择" 
                 v-model="searchField.planMonth"
                 valueFormat="YYYY-MM"
                />
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
        :scroll="{ y: 1 }"
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
       <template slot="operation" slot-scope="text, row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'editMonth',
                icon: '',
                style: ['btn_link'],
                disabled: row.planMonth !== nextMonth
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'detailMonth',
                icon: '',
                style: ['btn_link']
              }
            ]"
            @editMonth="editMonth(row,'edit')"
            @detailMonth="editMonth(row,'detail')"
          ></pe-button>
        </template>
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  deleteData,
  saveData
} from '@/api/equipmentOperationMgt/equipmentStartupAndShutdownPlan/equipmentStartupAndShutdownPlan.js'
import moment from 'moment'
export default {
  name: 'maintain',
  data() {
    return {
      // 筛选字段
      searchField: {
        planMonth: ''
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
          title: '计划月度',
          dataIndex: 'planMonth',
          align: 'center',
        },
        {
          title: '编辑人',
          dataIndex: 'lastModifiedUser',
          align: 'center',
        },
        {
          title: '编辑时间',
          dataIndex: 'lastModifiedDateTime',
          align: 'center',
        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: 'center',
          width: 100
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
      nextMonth:moment().month(moment().month() + 1).startOf('month').format('YYYY-MM')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
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
        planMonth: ''
      }
      this.getList()
    },
    // 删除
    deleteClick() {
      if (this.selectedRowKeys.length>0){
        deleteData(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = []
            this.$message.success('删除成功')
            this.getList(1, this.pagination.pageSize)
          }
        })
      }else {
        this.$message.warning("请选择记录！");
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
    editMonth(row,type){
      this.$router.push({path:'/equipmentStartupAndShutdownPlanDetail',query:{id:row.id,type:window.btoa(type)}})
    },
    // 新增
    addMonth() {
      if (this.dataSource.length > 0 && this.dataSource[0].planMonth === this.nextMonth){
        this.$message.warning('已有次月计划，不可再次新增!')
      } else {
        saveData({}).then(res => {
          if (res.code == 200) {
            this.$message.success('新增成功')
            this.getList()
          }
        })
      }
    },
     // 禁用选择框，只能删除次月的
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.planMonth !== this.nextMonth
        }
      }
    },
  },
}
</script>
<style scoped>

</style>
