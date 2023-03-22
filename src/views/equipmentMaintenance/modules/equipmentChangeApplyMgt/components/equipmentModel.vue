<template>
  <div>
    <a-modal
      title="设备列表"
      :visible="equipmentVisible"
      :footer="null"
      @cancel="handleCancel"
      class="from-style bigModel"
      :maskClosable="false"
      destroyOnClose
    >
      <a-form-model
        layout="inline"
        :model="formInline"
        class="association_form device_form"
      >
        <a-form-model-item label="设备名称">
          <a-input
            v-model="formInline.equipment_name"
            placeholder="请输入设备名称"
          >
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="设备位号">
          <a-input
            v-model="formInline.equipment_tag_no"
            placeholder="请输入设备位号"
          >
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="getList()"> 查询 </a-button>
        </a-form-model-item>
        <a-table
          @change="paginationChange"
          :pagination="pagination"
          rowKey="eqm_sbbm"
          :columns="columns"
          :data-source="dataSource"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: getCheckboxProps,
            columnWidth: 30,
          }"
        >
        </a-table>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button type="primary" @click="handleOk()"> 确定 </a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { findEquipmentList } from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'
export default {
  name: 'equipmentModel',
  props: {
    equipmentVisible: {
      type: Boolean,
      default: false,
    },
    // 是否单选
    singleChoice: {
      type: Boolean,
      default: true,
    },
    disabledData: {
      type: Array,
      default: () => {
        return []
      },
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
  watch: {
    disabledData: {
      handler(newData) {
        this.disabledData = newData
        this.selectedRowKeys = []
      },
      immediate: true,
    },
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(pageIndex = 1, pageSize = 10) {
      const data = {
        pageNum: pageIndex,
        pageSize,
        eqm_sbmc: this.formInline.equipment_name,
        eqm_sbwh: this.formInline.equipment_tag_no,
      }
      findEquipmentList(data).then((res) => {
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
      this.disabledData = []
      this.$emit('update:equipmentVisible', false)
    },
    reset() {
      this.selectedRowKeys = []
      this.formInline.equipment_name = ''
      this.formInline.equipment_tag_no = ''
    },
    // 单选or多选
    onSelectChange(selectedRowKeys, selectedRows) {
      if (this.singleChoice) {
        this.selectedRowKeys = [selectedRowKeys[selectedRowKeys.length - 1]]
        this.selectDate = selectedRows.filter(
          (item) => item.eqm_sbbm === this.selectedRowKeys[0]
        )
      } else {
        this.selectedRowKeys = selectedRowKeys
        this.selectDate = selectedRows
      }
    },
    // 禁用已经选择的选择框
    getCheckboxProps(record) {
      if (!this.singleChoice) {
        return {
          props: {
            disabled: this.disabledData.includes(record.eqm_sbwh),
          },
        }
      } else {
        return {
          props: {
            disabled: false,
          },
        }
      }
    },
    handleOk() {
      if (this.singleChoice) {
        this.$emit('selectedClic', this.selectDate[0])
      } else {
        this.$emit('selectedClic', this.selectDate)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.association_form {
  ::v-deep .ant-form-item {
    display: inline-block;
  }
}
.device_form {
  ::v-deep .ant-form-item-control-wrapper {
    width: auto;
  }
}
</style>
