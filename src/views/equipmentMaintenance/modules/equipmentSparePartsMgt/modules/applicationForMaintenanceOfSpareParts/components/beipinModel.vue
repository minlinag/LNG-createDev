<template>
  <div>
    <a-modal
      :title="isDetail?'备品备件详情':'备品备件'"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
      class="from-style bigModel"
      destroyOnClose
    >
      <a-form-model
        layout="inline"
        :model="formInline"
        class="association_form device_form"
      >
        <div v-if="!isDetail">
          <a-form-model-item label="备品备件名称">
            <a-input
              v-model="formInline.EQU_NAME"
              placeholder="请输入设备名称"
            >
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="资源编码">
            <a-input
              v-model="formInline.MATERIAL_CODE"
              placeholder="请输入设备位号"
            >
            </a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="getList()"> 查询 </a-button>
          </a-form-model-item>
        </div>
        <a-table
          @change="paginationChange"
          :pagination="pagination"
          rowKey="MATERIAL_CODE"
          :columns="columns"
          :data-source="dataSource"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            columnWidth: 30,
          }"
        >
        </a-table>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button type="primary" @click="handleOk()" v-if="!isDetail">
          确定
        </a-button>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  getList,
  detail,
  saveData
} from '@/api/equipmentSparePartsMgt/applicationForMaintenanceOfSpareParts.js'
export default {
  name: 'beipinModel',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    equipment_no: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      // 查询字段
      formInline: {
        EQU_NAME: '',
        MATERIAL_CODE: '',
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
          title: '备品备件名称',
          dataIndex: 'EQU_NAME',
          align: 'center',
        },
        {
          title: '物资编码',
          dataIndex: 'MATERIAL_CODE',
          align: 'center',
        },
        {
          title: '规格型号',
          dataIndex: 'MATERIAL_MODEL',
          align: 'center',
        },
        {
          title: '数量',
          dataIndex: 'MEASUREMENT_UNIT',
          align: 'center',
        },
        {
          title: '单位',
          dataIndex: 'MATERIAL_DEPT',
          align: 'center',
        },
      ],
    }
  },
  methods: {
    handleOpen(){
      if (this.isDetail) {
          this.detail()
        } else {
          this.getList()
        }
    },
    getList(pageIndex = 1, pageSize = 10) {
      const data = {
        pageNum: pageIndex,
        pageSize,
        equ_NAME: this.formInline.EQU_NAME,
        material_CODE: this.formInline.MATERIAL_CODE,
      }
      getList(data).then((res) => {
        const { data, pageIndex, total, pageSize } = res.body
        this.dataSource = data || []
        this.pagination.current = pageIndex
        this.pagination.total = total
        this.pagination.pageSize = pageSize
        this.detail()
      })
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getList(pagination.current, pagination.pageSize)
    },
    handleCancel() {
      this.selectedRowKeys = []
      this.formInline.EQU_NAME = ''
      this.formInline.MATERIAL_CODE = ''
      this.$emit('update:visible', false)
    },
    // 多选
    onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectDate = selectedRows
    },
    // 详情
    detail(){
      detail([this.equipment_no]).then(res => {
        if(this.isDetail ){
          this.dataSource = res.body
        }else{
          res.body.forEach(element => {
            this.selectedRowKeys.push(element.MATERIAL_CODE)
          });
        }
        
      })
    },
    // 确定
    handleOk() {
      let data = this.selectDate.map(item => {
        return {
           deviceCode:this.equipment_no, 
           sparePartsCode:item.MATERIAL_CODE
        }
      })
      saveData(data).then(res => {
        if(res.code == 200){
            this.$message.success('保存成功')
            this.handleCancel()
          }
      })
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
