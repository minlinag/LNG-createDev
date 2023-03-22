<template>
  <div>
    <a-modal
      title="物资出库调拨单"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
      class="from-style bigModel"
    >
      <a-form-model>
        <dc-table
        :scroll="{ y: 1, x: 1100 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
      >
      </dc-table>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  saveData
} from '@/api/equipmentOperationMgt/equipmentExceptionPermissionRecord/equipmentExceptionPermissionRecord.js'
export default {
  name: 'outboundOrder',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
          title: '备件名称',
          dataIndex: '',
          align: 'center',
        },
        {
          title:'物资编码',
          dataIndex:'',
          align: 'center',
        },
        {
          title: '规格型号',
          dataIndex: '',
          align: 'center',
        },
        {
          title: '数量',
          dataIndex: '',
          align: 'center',
        },
        {
          title: '单位',
          dataIndex: '',
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
  methods: {
    handleOpen() {
     
    },
    // 关闭
    handleCancel() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
<style lang="less" scoped></style>
