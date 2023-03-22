<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button :include="[{ value: 'exportComponent' }]"></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div
        style="position: relative"
        class="position-equipmentPerformanceIndicators"
      >
        <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="日期:"
            >
              <a-range-picker v-model="searchField.time" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="设备类型:"
              prop="classifyId"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-select
                v-model.trim="searchField.classifyId"
                placeholder="请选择"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in selectData"
                >
                  {{ item.label }}
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
          <a-col :span="12" class="form_model_multiple">
            <a-form-model-item
              label="绩效指标"
              :labelCol="{ style: 'width: 98px' }"
            >
              <a-select
                mode="multiple"
                v-model.trim="searchField.performanceIndicators"
                placeholder="请选择"
              >
                <a-select-option
                  :value="item.value"
                  :key="index"
                  :disabled="classifyIdDisabled(item.disabled)"
                  v-for="(item, index) in performanceIndicatorsOption"
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
        :scroll="scroll"
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
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
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
            @viewJump="viewJump(row)"
          ></pe-button>
        </template>
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import { getList } from '@/api/equipmentOperationMgt/operationAccount/operationAccount.js'
import { encode } from '@/api/dataDictionary'
export default {
  name: 'maintain',
  data() {
    return {
      scroll: { y: 1, x: 750 },
      //设备类型
      selectData: [],
      // 绩效指标
      performanceIndicatorsOption: [
        {
          value: '设备故障率',
          label: '设备故障率',
          disabled: false,
        },
        {
          value: '设备利用率',
          label: '设备利用率',
          disabled: false,
        },
        {
          value: '平均无故障时间',
          label: '平均无故障时间',
          disabled: false,
        },
        {
          value: '设备完好率',
          label: '设备完好率',
          disabled: '设备完好率',
        },
        {
          value: '仪表自动化系统可用率',
          label: '仪表自动化系统可用率',
          disabled: '仪表设备',
        },
        {
          value: '交接计量器具检定率',
          label: '交接计量器具检定率',
          disabled: '计量设备',
        },
        {
          value: '压缩机组可用率',
          label: '压缩机组可用率',
          disabled: '压缩机设备',
        },
        {
          value: '泵机组可用率',
          label: '泵机组可用率',
          disabled: '泵设备',
        },
        {
          value: '密封消耗量',
          label: '密封消耗量',
          disabled: '泵设备',
        },
      ],
      // 筛选字段
      searchField: {
        classifyId: undefined,
        deviceName: '',
        deviceBitNum: '',
        time: [],
        performanceIndicators: [],
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
          dataIndex: 'a',
          align: 'center',
          width: 0,
        },
        {
          title: '设备数量',
          dataIndex: 'b',
          align: 'center',
          width: 0,
        },
        {
          title: '设备名称',
          dataIndex: 'c',
          align: 'center',
          width: 0,
        },
        {
          title: '设备位号',
          dataIndex: 'd',
          align: 'center',
          width: 0,
        },
        {
          title: '设备故障率',
          dataIndex: 'e',
          align: 'center',
          width: 0,
        },
        {
          title: '设备利用率',
          dataIndex: 'f',
          align: 'center',
          width: 0,
        },
        {
          title: '设备完好率',
          dataIndex: 'g',
          align: 'center',
          width: 0,
        },
        {
          title: '平均无故障时间',
          dataIndex: 'h',
          align: 'center',
          width: 0,
        },
        {
          title: '仪表自动化系统可用率',
          dataIndex: 'i',
          align: 'center',
          width: 0,
        },
        {
          title: '交接计量器具检定率',
          dataIndex: 'j',
          align: 'center',
          width: 0,
        },
        {
          title: '压缩机组可用率',
          dataIndex: 'k',
          align: 'center',
          width: 0,
        },
        {
          title: '泵机组可用率',
          dataIndex: 'l',
          align: 'center',
          width: 0,
        },
        {
          title: '密封消耗量',
          dataIndex: 'o',
          align: 'center',
          width: 0,
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
      dataSource: [
        {
          a: '泵',
          b: '1',
          c: '泵',
          d: 'F2345',
          e: '0',
          f: '100%',
          g: '100%',
          h: '45',
          i: '100%',
          j: '100%',
          k: '100%',
          l: '100%',
          o: '10',
        },
      ],
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
  watch: {
    'searchField.classifyId': {
      handler() {
        this.searchField.performanceIndicators = []
      },
    },
    'searchField.deviceName': {
      handler() {
        if (this.searchField.deviceName || this.searchField.deviceBitNum) {
          this.searchField.performanceIndicators.splice(
            this.searchField.performanceIndicators.indexOf('设备完好率'),
            1
          )
        }
      },
    },
    'searchField.deviceBitNum': {
      handler() {
        if (this.searchField.deviceName || this.searchField.deviceBitNum) {
          this.searchField.performanceIndicators.splice(
            this.searchField.performanceIndicators.indexOf('设备完好率'),
            1
          )
        }
      },
    },
  },
  mounted() {
    this.init()
  },
  updated() {},
  methods: {
    init() {
      // this.getList()
      this.encode()
      this.setWidth()
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
    //设备指标下拉框是否可以点击
    classifyIdDisabled(value) {
      if (value === '设备完好率') {
        if (this.searchField.deviceName || this.searchField.deviceBitNum) {
          value = true
        } else {
          value = false
        }
      }
      if (this.searchField.classifyId === value || !value) {
        return false
      } else {
        return true
      }
    },
    // 导出
    exportComponent() {},
    // 搜索
    search() {
      // this.getList()
      this.setWidth()
    },
    // 重置
    resetForm() {
      this.searchField = {
        classifyId: undefined,
        deviceName: '',
        deviceBitNum: '',
        time: [],
        performanceIndicators: [],
      }
      // this.getList()
      this.setWidth()
    },
    // 页码改变调用
    paginationChange(pagination) {
      this.pagination.pageNum = pagination.current
      this.pagination.pageSize = pagination.pageSize
      // this.getList(this.pagination.pageNum, this.pagination.pageSize)
    },
    // 选择改变调用
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-equipmentPerformanceIndicators')
    },
    // 动态控制列的显示隐藏
    setWidth() {
      let data = [...this.searchField.performanceIndicators]
      if (this.searchField.deviceName || this.searchField.deviceBitNum) {
        data.push('设备名称', '设备位号')
      } else {
        data.push('设备类型', '设备数量')
      }
      this.scroll.x = 100
      this.columns.forEach((item, index) => {
        if (index > 0 && item.title != '操作') {
          if (data.includes(item?.title)) {
            item.width = 150
          } else {
            item.width = 0
          }
          this.scroll.x += item.width
          console.log(this.scroll.x)
        }
      })
    },
    // 详情
    viewJump() {
      this.$router.push({ path: '/reportForm' })
    },
    // 数据字典-设备类型
    encode() {
      encode('SJZD-SBLB').then((res) => {
        this.selectData = []
        res.body.data.forEach((item) => {
          this.selectData.push({
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
