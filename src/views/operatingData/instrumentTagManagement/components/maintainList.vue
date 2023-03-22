<template>
  <div>
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="tableList"
      class="list_table"
      :scroll="{ y: 1, x: 100 }"
    >
      <template slot="referenceRangeDownInput" slot-scope="val, obj">
        <a-input
          placeholder="请输入"
          v-model="obj.referenceRangeDown"
          style="width: 100%"
        />
      </template>
      <template slot="referenceRangeUpInput" slot-scope="val, obj">
        <a-input
          placeholder="请输入"
          v-model="obj.referenceRangeUp"
          style="width: 100%"
        />
      </template>
      <template slot="warningRangeDownInput" slot-scope="val, obj">
        <a-input
          placeholder="请输入"
          v-model="obj.warningRangeDown"
          style="width: 100%"
        />
      </template>
      <template slot="warningRangeUpInput" slot-scope="val, obj">
        <a-input
          placeholder="请输入"
          v-model="obj.warningRangeUp"
          style="width: 100%"
        />
      </template>
      <template slot="instrumentNoInput" slot-scope="val, obj">
        <a-input
          placeholder="请输入"
          v-model="obj.instrumentNo"
          style="width: 100%"
        />
      </template>
    </a-table>
  </div>
</template>
<script>
export default {
  name: 'maintainList',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      tableList: [],
      columns: [
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 90,
          ellipsis: true,
        },
        {
          title: '巡检项名称',
          dataIndex: 'inspectionItemName',
          width: 90,
        },
        {
          title: '单位',
          dataIndex: 'units',
          width: 80,
          ellipsis: true,
        }, {
          title: '停机状态是否记录预警值',
          dataIndex: 'shutdownStatusRecordValue',
          width: 200,
          ellipsis: true,
        },
        {
          title: '参考范围（下限）',
          dataIndex: 'referenceRangeDown',
          scopedSlots: { customRender: 'referenceRangeDownInput' },
          width: 120,
        }, {
          title: '参考范围（上限）',
          dataIndex: 'referenceRangeUp',
          scopedSlots: { customRender: 'referenceRangeUpInput' },
          width: 120,
        }, {
          title: '预警范围（下限）',
          dataIndex: 'warningRangeDown',
          scopedSlots: { customRender: 'warningRangeDownInput' },
          width: 120,
        }, {
          title: '预警范围（上限）',
          dataIndex: 'warningRangeUp',
          scopedSlots: { customRender: 'warningRangeUpInput' },
          width: 120,
        },
        {
          title: '仪表位号',
          scopedSlots: { customRender: 'instrumentNoInput' },
          width: 140,
        },
      ]
    }
  },
  watch: {
    list: {
      handler(val) {
        this.tableList = this.$lodash.cloneDeep(val)
      },
      deep: true,
      immediate: true
    }
  },
  created() { },
  methods: {},
}
</script>
<style lang="less" scoped>
.list_table {
  ::v-deep .ant-form-item {
    margin-bottom: 0px;
  }
}
</style>
