<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            {
              value: 'exportComponent',
              url: '/deviceRunInfo/exportExcel',
              params: $audit.fiflterUrlData(this.searchField),
            },
          ]"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div style="position: relative" class="position-operationAccount">
        <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="设备类型:"
            >
              <a-input
                v-model="searchField.deviceType"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
            <!-- <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="设备类型"
            >
              <template>
                <a-tree-select
                  v-model="searchField.deviceType"
                  :getPopupContainer="getPopupContainer"
                  style="width: 100%"
                  :dropdown-style="{
                    maxHeight: '400px',
                    overflow: 'auto',
                  }"
                  placeholder="请选择"
                  allow-clear
                >
                  <a-tree-select-node
                    :value="item.featureClassificid"
                    :title="item.classificName"
                    v-for="(item, index) in treeSelect"
                    disabled
                    :key="index"
                  >
                    <a-tree-select-node
                      :value="items.featureClassificid"
                      :title="items.classificName"
                      v-for="(items, indexs) in item.children"
                      :key="index + '-' + indexs"
                    >
                      <a-tree-select-node
                        :value="itemss.featureClassificid"
                        :title="itemss.classificName"
                        v-for="(itemss, indexss) in items.children"
                        :key="index + '-' + indexs + '-' + indexss"
                      />
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select>
              </template>
            </a-form-model-item> -->
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="设备分级:"
            >
              <a-select
                ref="select"
                v-model="searchField.deviceLevel"
                placeholder="请选择"
                :options="deviceLevelOptions"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in deviceLevelOptions"
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
              label="当前状态:"
            >
              <a-select
                ref="select"
                v-model="searchField.currentStatus"
                placeholder="请选择"
                :options="currentStatusOptions"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in currentStatusOptions"
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
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import { getList } from '@/api/equipmentOperationMgt/operationAccount/operationAccount.js'
import { encode } from '@/api/dataDictionary'
import {
  getTreeList, //获取树
} from '@/api/spareParts'
export default {
  name: 'maintain',
  data() {
    return {
      //设备类型
      treeSelect: [],
      //设备分级
      deviceLevelOptions: [],
      //当前状态
      currentStatusOptions: [
        {
          value: '运行',
          label: '运行',
        },
        {
          value: '停用',
          label: '停用',
        },
        {
          value: '备用',
          label: '备用',
        },
        {
          value: '待维护',
          label: '待维护',
        },
      ],
      // 筛选字段
      searchField: {
        deviceType: undefined,
        deviceLevel: undefined,
        currentStatus: undefined,
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
          dataIndex: 'deviceType',
          align: 'center',
        },
        // {
        //   title:'设备类别',
        //   dataIndex:'deviceCate',
        //   align: 'center',
        // },
        {
          title: '设备分级',
          dataIndex: 'deviceLevel',
          align: 'center',
        },
        {
          title: '当前状态',
          dataIndex: 'currentStatus',
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
        {
          title: '累计运行时间',
          dataIndex: 'totalRunTime',
          align: 'center',
        },
        {
          title: '维护保养次数',
          dataIndex: 'maintenanceNum',
          align: 'center',
        },
        {
          title: '缺陷异常次数',
          dataIndex: 'exceptionNum',
          align: 'center',
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
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
      this.getTreeList()
      this.encode()
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
    exportComponent() {},
    // 搜索
    search() {
      this.getList()
    },
    // 重置
    resetForm() {
      this.searchField = {
        deviceType: undefined,
        deviceLevel: undefined,
        currentStatus: undefined,
        deviceName: '',
        deviceBitNum: '',
        deviceNo: '',
      }
      this.getList()
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
      return document.querySelector('.position-operationAccount')
    },
    // 获取设备类型
    getTreeList() {
      getTreeList({ classificCode: '', classificName: '' }).then((res) => {
        this.treeSelect = res.body.data
      })
    },
    // 数据字典-设备分级
    encode() {
      encode('SJZD-SBFJ').then((res) => {
        this.deviceLevelOptions = []
        res.body.data.forEach((item) => {
          this.deviceLevelOptions.push({
            value: item.dictname,
            label: item.dictname,
          })
        })
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
