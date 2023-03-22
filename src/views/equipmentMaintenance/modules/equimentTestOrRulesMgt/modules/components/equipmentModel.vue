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
            <a-input v-model="formInline.eqmName" placeholder="请输入设备名称">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="设备位号"
            :labelCol="{ style: 'width: 110px' }"
          >
            <a-input v-model="formInline.eqmNo" placeholder="请输入设备位号">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item>
            <a-button type="primary" @click="selectTemporaryCon">
              查询
            </a-button>
            <a-button @click="resetForm"> 重置 </a-button>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <a-table
        @change="paginationChange"
        :pagination="pagination"
        rowKey="eqmId"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
      </a-table>
      <div class="footer">
        <a-button type="primary" @click="handleOk"> 确定 </a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { selectTemporaryCon } from '@/api/equimentTestOrRulesMgt/waitVerifird/waitVerifird.js'
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
        pageIndex: 1,
        pageSize: 10,
        eqmName: '',
        eqmNo: '',
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
          dataIndex: 'eqmName',
        },
        {
          title: '设备位号',
          dataIndex: 'eqmNo',
        },
        {
          title: '设备编码',
          dataIndex: 'eqmCode',
        },
        {
          title: '所属设备',
          dataIndex: 'belongToEqm',
        },
      ],
    }
  },
  mounted() {
    this.selectTemporaryCon()
  },
  methods: {
    async selectTemporaryCon() {
      const { code, body } = await selectTemporaryCon(this.formInline)
      if (code == 200) {
        const { data, pageIndex, pageSize, total } = body
        console.log(pageIndex, pageSize, total)
        this.dataSource = data || []
        this.pagination.current = pageIndex
        this.pagination.total = total
        this.pagination.pageSize = pageSize
      }
    },
    paginationChange(pagination) {
      this.formInline.pageNum = pagination.current
      this.formInline.pageSize = pagination.pageSize
      this.selectTemporaryCon()
    },
    handleCancel() {
      this.$emit('update:equipmentVisible', false)
    },
    handleOk() {
      console.log(this.selectDate)
      this.$emit('selectedClic', this.selectDate)
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      // console.log(selectedRows)
      this.selectDate = selectedRows
    },
    // 重置搜索框
    resetForm() {
      this.formInline = {
        pageIndex: 1,
        pageSize: 10,
        eqmName: '',
        eqmNo: '',
      }
      this.selectTemporaryCon()
    },
  },
}
</script>
