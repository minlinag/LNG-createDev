<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            { value: 'exportComponent'}
          ]"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div style="position: relative" class="position-sparePartsApplicationRecord">
        <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
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
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="设备位号:"
            >
              <a-input
                v-model="searchField.deviceNo"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="作业类型"
              prop="maintenanceType"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-select
                v-model="searchField.maintenanceType"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in maintenanceTypeOptions"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
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
        :scroll="{ y: 1, x: 1100 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          columnWidth: 30,
        }"
      >
       <template slot="notice" slot-scope="text, row">
          <a href="#" @click="notice(row)">{{text}}</a>
        </template>
        <template slot="a" slot-scope="text, row">
          <a href="#" @click="a(row)">{{text}}</a>
        </template>
      </dc-table>
      <dispatchModel
        ref="dispatchModel"
        :visible.sync="dispatchVisible"
        :typeModel="{ page: 'detail', type: 'edit', detail:true }"
        :title="'通知单-详情'"
      ></dispatchModel>
      <outboundOrder :visible.sync="outboundOrderVisible"></outboundOrder>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList
} from '@/api/equipmentSparePartsMgt/sparePartsApplicationRecord.js'
import dispatchModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/dispatchModel.vue'
import outboundOrder from './compontents/outboundOrder.vue'
import {
  getDetailByInformId
} from '@/api/equipmentOperationMgt/equipmentExceptionPermissionRecord/equipmentExceptionPermissionRecord.js'
export default {
  name: 'maintain',
  components: {dispatchModel,outboundOrder },
  data() {
    return {
      // 作业类型
      maintenanceTypeOptions: [
        { value: '预防性', label: '预防性' },
        { value: '故障性', label: '故障性' },
        { value: '其他', label: '其他' },
      ],
      // 筛选字段
      searchField: {
        deviceNo: undefined,
        deviceName:'',
        maintenanceType:undefined
      },
      outboundOrderVisible:false,
      dispatchVisible:false,
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
          title: '设备名称',
          dataIndex: 'deviceName',
          align: 'center',
        },
        {
          title:'设备位号',
          dataIndex:'deviceNo',
          align: 'center',
        },
        {
          title: '作业类型',
          dataIndex: 'maintenanceType',
          align: 'center',
        },
        {
          title: '作业通知单',
          dataIndex: 'informNo',
          align: 'center',
          scopedSlots: { customRender: 'notice' },
        },
        {
          title: '物资出库调拨单',
          dataIndex: 'a',
          align: 'center',
          scopedSlots: { customRender: 'a' },
        },
        {
          title: '申请单位',
          dataIndex: 'createUserSubsidiaryOrgan',
          align: 'center',
        },
        {
          title: '申请人',
          dataIndex: 'createdUser',
          align: 'center',
        },
        {
          title: '申请日期',
          dataIndex: 'createdDateTime',
          align: 'center',
        }
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
      }
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
    // 导出
    exportComponent(){},
    // 搜索
    search() {
      this.getList()
    },
    // 重置
    resetForm() {
      this.searchField = {
        deviceNo: undefined,
        deviceName:'',
        maintenanceType:undefined
      }
      this.getList()
    },
    // 查看通知单详情
    notice(row) {
      getDetailByInformId({informId:row.informNo}).then(res => {
        if (res.code == 200) {
          this.dispatchVisible = true
          this.$nextTick(() => {
            res.body.dispatchStatus = res.body.dispatchStatus === '1'?'未派工':res.body.dispatchStatus === '2'?'作业中':'已完成'
            res.body.whetherHaveInspectionRule = res.body.whetherHaveInspectionRule+''
            this.$refs.dispatchModel.handleOpen(res.body)
          })
        }
      })
    },
    a(row){ //没有接口  假的  后续重新加上
      this.outboundOrderVisible = true
      // getDetailByInformId({informId:row.informNo}).then(res => {
      //   if (res.code == 200) {
      //     this.dispatchVisible = true
      //     this.$nextTick(() => {
      //       res.body.dispatchStatus = res.body.dispatchStatus === '1'?'未派工':res.body.dispatchStatus === '2'?'作业中':'已完成'
      //       res.body.whetherHaveInspectionRule = res.body.whetherHaveInspectionRule+''
      //       this.$refs.dispatchModel.handleOpen(res.body)
      //     })
      //   }
      // })
      
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
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-sparePartsApplicationRecord')
    }
  },
}
</script>
<style scoped>
/* .ant-table-cell {
  white-space: nowrap;
} */
</style>
