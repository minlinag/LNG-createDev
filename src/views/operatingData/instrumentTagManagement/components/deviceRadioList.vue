<template>
  <a-modal
    title="设备名称单选"
    :visible="hiddenVisible"
    @cancel="deviceRadioListClose"
    class="from-style bigModel"
  >
    <a-table
      @change="paginationChange"
      :pagination="pagination"
      :columns="columns"
      :data-source="tableList"
      class="list_table"
      :scroll="{ y: 1, x: 100 }"
      rowKey="eqmId"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        type: 'radio',
      }"
    >
    </a-table>
    <template #footer>
      <div style="text-align: center">
        <a-button type="primary" @click="confirmClick"> 确定 </a-button>
        <a-button @click="deviceRadioListClose">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script>
import {
  queryListForClass,
  pageList
} from "@/api/operatingData/instrumentTagManagement";
export default {
  name: 'deviceRadioList',
  props: {
    hiddenVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      columns: [],
      tableList: [],
      selectedRowKeys: [],
      selectedRow: {}
    }
  },
  watch: {
    hiddenVisible: {
      handler(val) {
        if (val) {
          this.getListForClass()
          // this.getList()
        }
      },
      immediate: true
    }
  },
  created() { },
  methods: {
    getListForClass() {
      queryListForClass({ featureClassificId: "S22000000000002" }).then(res => {
        this.columns = res.body.data.map(item => {
          return {
            title: item.characterDesc,
            dataIndex: item.characterCode,
            width: 100,
            ellipsis: true,
          }
        })
        this.getList()
      })
    },
    paginationChange(val) {
      this.pagination.pageSize = val.pageSize
      this.pagination.current = val.current
      // this.getList()
    },
    getList() {
      pageList({
        pageNum: 1,
        pageSize: 10,
        featureClassificId: "S22000000000002"
      }).then(res => {
        this.tableList = res.body.data
        this.pagination.total = res.body.total
      })
    },
    deviceRadioListClose() {
      this.$emit('close')
    },
    confirmClick() {
      // 判断是否有选中的数据
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.$emit('confirm', this.selectedRow)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRow = selectedRows[0]
    }
  },
}
</script>
<style lang="less" scoped>
</style>
