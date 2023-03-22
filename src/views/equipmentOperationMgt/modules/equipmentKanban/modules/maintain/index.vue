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
              label="设备类型:"
            >
              <a-input
                v-model="searchField.deviceTypeReal"
                placeholder="请输入"
              ></a-input>
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
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="设备位号:"
            >
              <a-input
                v-model="searchField.deviceBitNum"
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
          columnWidth: 30,
        }"
      >
      </dc-table>
      <equipmentModel
        ref="equipmentModel"
        :equipmentVisible.sync="equipmentVisible"
        @selectedClic="selectedClic"
        :singleChoice="false"
        :disabledData="disabledData"
      />
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  deleteData,
  saveData,
  getBitNoList,
} from '@/api/equipmentOperationMgt/equipmentKanban/maintain.js'
import equipmentModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue'
export default {
  name: 'maintain',
  components: { equipmentModel },
  data() {
    return {
      disabledData: [],
      // 筛选字段
      searchField: {
        deviceTypeReal: '',
        deviceName: '',
        deviceBitNum: '',
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
          title: '设备类型',
          dataIndex: 'deviceTypeReal',
          align: 'center',
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          align: 'center',
        },
        {
          title: '设备位号',
          dataIndex: 'deviceBitNum',
          align: 'center',
        },
        // {
        //   title: '设备编号',
        //   dataIndex: 'deviceNo',
        //   align: 'center',
        // },
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
      equipmentVisible: false,
      deviceType: '',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const path = this.$route.path
      switch (path) {
        case '/maintain':
          this.deviceType = '1'
          break
        case '/maintainStartupAndShutdown':
          this.deviceType = '2'
          break
        default:
          this.deviceType = '3'
          break
      }
      this.getList()
    },
    getList(pageNum = 1, pageSize = 10) {
      const data = {
        deviceType: this.deviceType,
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
    getBitNoList() {
      const data = {
        deviceType: this.deviceType,
      }
      getBitNoList(data).then((res) => {
        this.disabledData = res.body
        this.equipmentVisible = true
      })
    },
    // 搜索
    search() {
      this.getList()
    },
    // 重置
    resetForm() {
      this.searchField = {
        deviceTypeReal: '',
        deviceName: '',
        deviceBitNum: '',
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
    // 新增
    addMonth() {
      this.getBitNoList()
    },
    selectedClic(value) {
      let data = []
      value.forEach((element) => {
        data.push({
          deviceType: this.deviceType,
          deviceName: element.eqm_sbmc,
          deviceBitNum: element.eqm_sbwh,
          deviceTypeReal: element.equipment_type,
          deviceNo: element.eqm_sbbm,
        })
      })
      saveData(data).then((res) => {
        if (res.code == 200) {
          this.$message.success('新增成功')
          this.equipmentVisible = false
          this.getList(1, this.pagination.pageSize)
        }
      })
    },
  },
}
</script>
<style scoped>
/* .ant-table-cell {
  white-space: nowrap;
} */
</style>
