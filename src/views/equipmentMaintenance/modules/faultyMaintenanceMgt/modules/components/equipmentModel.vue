<template>
  <div>
    <a-modal
      width="1000px"
      title="设备列表"
      :visible="equipmentVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form-model layout="inline" :model="formInline">
        <a-col :span="8">
          <a-form-model-item
            label="设备名称"
            :labelCol="{ style: 'width: 110px' }"
          >
            <a-input
              v-model="formInline.equipment_name"
              placeholder="请输入设备名称"
            >
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="设备位号"
            :labelCol="{ style: 'width: 110px' }"
          >
            <a-input
              v-model="formInline.equipment_tag_no"
              placeholder="请输入设备位号"
            >
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item>
            <a-button type="primary" @click="getList()"> 查询 </a-button>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <a-table
        @change="paginationChange"
        :pagination="pagination"
        rowKey="eqm_sbbm"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          columnWidth: 30
        }"
      >
      </a-table>
      <div class="footer contneFormBtnStyle ant-modal-footer">
        <a-button type="primary" @click="handleOk()"> 确定 </a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { queryPageListForUnClass } from '@/api/PublicInterface.js'
export default {
  name: 'equipmentModel',
  props: {
    equipmentVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 查询字段
      formInline: {
        equipment_name: '',
        equipment_tag_no: '',
      },
      selectDate: [],
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
      dataSource: [],
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
        },
        {
          title: '设备名称',
          dataIndex: 'eqm_sbmc',
        },
        {
          title: '设备位号',
          dataIndex: 'eqm_sbwh',
        },
        {
          title: '设备编码',
          dataIndex: 'eqm_sbbm',
        },
      ],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(pageNum = 1, pageSize = 10) {
      const data = {
        pageNum,
        pageSize,
        searchMap: this.formInline,
      }
      queryPageListForUnClass(data).then((res) => {
        const { data, pageIndex, total, pageSize } = res.body
        this.dataSource = data || []
        this.pagination.current = pageIndex
        this.pagination.total = total
        this.pagination.pageSize = pageSize
      })
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getList(pagination.current, pagination.pageSize)
    },
    handleCancel() {
      this.$emit('update:equipmentVisible', false)
    },
    reset() {
      this.selectedRowKeys = []
      this.formInline.equipment_name = ''
      this.formInline.equipment_tag_no = ''
    },
    // 单选
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = [selectedRowKeys[selectedRowKeys.length - 1]]
      this.selectDate = selectedRows.filter(
        (item) => item.eqm_sbbm === this.selectedRowKeys[0]
      )
    },
    handleOk() {
      console.log(this.selectDate[0])
      this.$emit('selectedClic', this.selectDate[0])
    },
  },
}
</script>
