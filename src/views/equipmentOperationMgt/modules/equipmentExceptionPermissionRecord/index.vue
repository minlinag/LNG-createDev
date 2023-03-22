<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'add' },
            { value: 'Delete', clickName: 'headDelete' },
            {
              value: 'exportComponent',
              url: 'equipmentDefect/exportExcel',
              params: $audit.fiflterUrlData(this.searchField),
            },
          ]"
          @add="addMonth"
          @headDelete="deleteClick"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div style="position: relative" class="position-defect">
        <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 200px' }"
              label="缺陷处理状态:"
            >
              <a-select
                ref="select"
                v-model="searchField.defectTreatStatus"
                placeholder="请选择"
                :options="recordStatusOptions"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in recordStatusOptions"
                  :key="item.id"
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
              label="识别方式:"
            >
              <a-select
                ref="select"
                v-model="searchField.recognitionWay"
                placeholder="请选择"
                :options="changeTypeOptions"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in changeTypeOptions"
                  :key="item.id"
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
              label="设备名称:"
            >
              <a-input
                v-model="searchField.deviceName"
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
        :scroll="{ y: 1, x: 1800 }"
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
        <template slot="upload" slot-scope="text, row">
          <a :href="`${url}${row.id}`">{{ row.attachment }}</a>
        </template>
        <template slot="notice" slot-scope="text, row">
          <a href="#" @click="notice(row)">{{ text }}</a>
        </template>
        <template slot="operation" slot-scope="text, row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                name: '整改',
                type: 'link',
                clickName: 'editMonth',
                icon: '',
                style: ['btn_link'],
                disabled: row.defectTreatStatus !== '未处理',
              },
            ]"
            @editMonth="editMonth(row)"
          ></pe-button>
        </template>
      </dc-table>
      <add-model ref="addModel" :visible.sync="visible"></add-model>
      <applyModel ref="applyModel" :visible.sync="applyVisible"></applyModel>
      <dispatchModel
        ref="dispatchModel"
        :visible.sync="dispatchVisible"
        :typeModel="{ page: 'detail', type: 'edit', detail: true }"
        :title="'通知单-详情'"
      ></dispatchModel>
    </template>
  </Breadcrumb>
</template>
<script>
import addModel from './components/addModel.vue'
import applyModel from './components/applyModel.vue'
import moment from 'moment'
import {
  getList,
  deleteData,
  getDetailByInformId,
} from '@/api/equipmentOperationMgt/equipmentExceptionPermissionRecord/equipmentExceptionPermissionRecord.js'
import dispatchModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/dispatchModel.vue'
import utils from '@/utils/url'
export default {
  components: { addModel, applyModel, dispatchModel },
  data() {
    return {
      url: `${utils.baseURL}fileinfo/downloadFile?relatedId=`,
      // 缺陷处理状态下拉框
      recordStatusOptions: [
        {
          label: '未处理',
          value: '未处理',
        },
        {
          label: '已处理',
          value: '已处理',
        },
        {
          label: '处理中',
          value: '处理中',
        },
      ],
      // 识别方式下拉框
      changeTypeOptions: [
        {
          label: '人工巡检',
          value: '人工巡检',
        },
        {
          label: '智能巡检',
          value: '智能巡检',
        },
      ],
      // 搜索字段
      searchField: {
        defectTreatStatus: undefined,
        recognitionWay: undefined,
        deviceName: '',
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
          title: '缺陷处理状态',
          dataIndex: 'defectTreatStatus',
          width: 100,
          align: 'center',
        },
        {
          title: '缺陷编号',
          dataIndex: 'defectNo',
          align: 'center',
          width: 150,
        },
        {
          title: '识别方式',
          dataIndex: 'recognitionWay',
          align: 'center',
          width: 150,
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          align: 'center',
          width: 150,
        },
        {
          title: '设备位号',
          dataIndex: 'deviceBitNum',
          align: 'center',
          width: 150,
        },
        // {
        //   title: '设备编号',
        //   dataIndex: 'deviceNo',
        //   align: 'center',
        //   width: 150,
        // },
        {
          title: '所属设备',
          dataIndex: 'belongDevice',
          align: 'center',
          width: 150,
        },
        {
          title: '相关附件',
          dataIndex: 'attachment',
          scopedSlots: { customRender: 'upload' },
          align: 'center',
          width: 150,
        },
        {
          title: '识别人',
          dataIndex: 'createdUser',
          align: 'center',
          width: 150,
        },
        {
          title: '识别日期',
          dataIndex: 'createdDateTime',
          ellipsis: true,
          align: 'center',
          width: 150,
          customRender: (value) => {
            if (value) {
              return {
                children: moment(value).format('YYYY-MM-DD'),
                attrs: { rowSpan: 1 },
              }
            }
          },
        },
        {
          title: '整改日期',
          dataIndex: 'changeDate',
          ellipsis: true,
          align: 'center',
          width: 150,
          customRender: (value) => {
            if (value) {
              return {
                children: moment(value).format('YYYY-MM-DD'),
                attrs: { rowSpan: 1 },
              }
            }
          },
        },
        {
          title: '关联通知单',
          dataIndex: 'informId',
          ellipsis: true,
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'notice' },
        },
        {
          title: '整改措施',
          dataIndex: 'createdDa1teTime',
          ellipsis: true,
          align: 'center',
          width: 150,
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: 100,
        },
      ],
      dataSource: [],
      visible: false,
      applyVisible: false,
      dispatchVisible: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-defect')
    },
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
    // 新增
    addMonth() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.addModel.handleOpen()
      })
    },
    // 编辑
    editMonth(row) {
      this.applyVisible = true
      this.$nextTick(() => {
        this.$refs.applyModel.handleOpen(row)
      })
    },
    // 查看通知单详情
    notice(row) {
      getDetailByInformId({ informId: row.informId }).then((res) => {
        if (res.code == 200) {
          this.dispatchVisible = true
          this.$nextTick(() => {
            res.body.dispatchStatus =
              res.body.dispatchStatus === '1'
                ? '未派工'
                : res.body.dispatchStatus === '2'
                ? '作业中'
                : '已完成'
            res.body.whetherHaveInspectionRule =
              res.body.whetherHaveInspectionRule + ''
            this.$refs.dispatchModel.handleOpen(res.body)
          })
        }
      })
    },
    // 列表选择
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    // 禁用选择框，只有未处理可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.defectTreatStatus !== '未处理',
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
        defectTreatStatus: undefined,
        recognitionWay: undefined,
        deviceName: '',
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
  },
}
</script>
<style scoped>
.ant-table-cell {
  white-space: nowrap;
}
</style>
