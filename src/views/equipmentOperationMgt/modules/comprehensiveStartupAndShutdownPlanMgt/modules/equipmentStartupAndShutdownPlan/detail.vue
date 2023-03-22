<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            {
              value: 'exportComponent',
              url: 'equipmentStartStopPlanSub/exportExcel',
              params: $audit.fiflterUrlData({
                ...this.searchField,
                parentId: this.$route.query.id,
              }),
            },
            { value: '返回', clickName: 'return', icon: 'Go-icon' },
          ]"
          @return="goBack"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div style="position: relative" class="position-disList">
        <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item
              label="设备名称"
              prop="deviceName"
              :labelCol="{ style: 'width: 120px' }"
            >
              <a-input
                v-model.trim="searchField.deviceName"
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
        :scroll="{ y: 1, x: 1500 }"
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
        <template slot="planDate" scope="text, row">
          <a-date-picker
            v-if="type === 'edit'"
            @change="dateOnChange(row)"
            :disabled-date="disabledDate"
            placeholder="请选择"
            v-model="row.planDate"
            valueFormat="YYYY-MM-DD"
          />
          <span v-else>{{ text }}</span>
        </template>
        <template slot="actPlan" slot-scope="text, row">
          <a-select
            v-if="type === 'edit'"
            v-model.trim="row.actPlan"
            style="width: 100%"
            @change="dateOnChange(row)"
            :options="planOptions"
          >
            <a-select-option
              placeholder="请选择"
              :value="item.value"
              :key="index"
              :label="item.label"
              v-for="(item, index) in planOptions"
            >
            </a-select-option>
          </a-select>
          <span v-else>{{ text }}</span>
        </template>
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getEditList,
  update,
} from '@/api/equipmentOperationMgt/equipmentStartupAndShutdownPlan/equipmentStartupAndShutdownPlan.js'
import moment from 'moment'
export default {
  name: 'maintain',
  data() {
    return {
      // 筛选字段
      searchField: {
        deviceName: '',
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
          title: '设备累计运行时长',
          dataIndex: 'deviceTotRunTime',
          align: 'center',
          width: 150,
        },
        {
          title: '设备上次检维修时间',
          dataIndex: 'lastMaintainDate',
          align: 'center',
          width: 150,
        },
        {
          title: '设备下次检维修时间',
          dataIndex: 'nextMaintainDate',
          align: 'center',
          width: 150,
        },
        {
          title: '设备故障状态',
          dataIndex: 'deviceFaultStatus',
          align: 'center',
          width: 150,
        },
        {
          title: '切换计划',
          dataIndex: 'cutPlan',
          align: 'center',
          width: 150,
        },
        {
          title: '计划时间',
          dataIndex: 'planDate',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'planDate' },
        },
        {
          title: '实际计划',
          dataIndex: 'actPlan',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'actPlan' },
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
      //实际计划下拉框
      planOptions: [
        {
          value: '运行',
          label: '运行',
        },
        {
          value: '备用',
          label: '备用',
        },
        {
          value: '不宜用',
          label: '不宜用',
        },
      ],
      type: window.atob(this.$route.query.type),
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    goBack() {
      this.$router.go(-1)
    },
    getList(pageNum = 1, pageSize = 10) {
      const data = {
        parentId: this.$route.query.id,
        pageNum,
        pageSize,
        ...this.searchField,
      }
      getEditList(data).then((res) => {
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
        deviceName: '',
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
    //日期/计划改变调用
    dateOnChange(row) {
      const data = {
        id: row.id,
        parentId: this.$route.query.id,
        planDate: row.planDate,
        actPlan: row.actPlan,
      }
      update(data).then((res) => {
        if (res.code == 200) {
          this.$message.success('修改成功')
          this.getList()
        }
      })
    },
    disabledDate(current) {
      // 获取下个月的日期
      const startMonth = moment()
        .month(moment().month() + 1)
        .startOf('month')
      const endMonth = moment()
        .month(moment().month() + 1)
        .endOf('month')
      return startMonth > current || current > endMonth
    },
  },
}
</script>
<style scoped></style>
