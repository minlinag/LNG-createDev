<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb :titleName="title">
      <template slot="breadcrumbButton">
        <div slot="extra">
          <pe-button
            :include="[
              { value: 'Add', clickName: 'addListClick' },
              { value: 'Delete', clickName: 'deleteListClick' },
            ]"
            @addListClick="addListClick"
            @deleteListClick="deleteListClick"
          ></pe-button>
        </div>
      </template>
      <template slot="appMain">
        <a-table
          @change="paginationChange"
          :pagination="pagination"
          :columns="columns"
          :data-source="tableList"
          :scroll="{ x: 1400, y: 300 }"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          rowKey="id"
        >
          <template slot="operate" slot-scope="row">
            <a-button
              type="link"
              class="btn_link"
              style="cursor: pointer"
              @click="editClick(row)"
            >
              编辑
            </a-button>
          </template>
        </a-table>
      </template>
    </Breadcrumb>
    <add-and-edit
      :hidden-visible="hiddenVisible"
      :form-title="formTitle"
      @close="addAndEditClose"
      @submitForm="submitForm"
      :formdata="formdata"
      :device-code="deviceCode"
      ref="addAndEditRef"
    ></add-and-edit>
  </div>
</template>
<script>
import {
  findAllList,
  deleteBatch,
  MainAndDamagePartsControllerAdd,
  MainAndDamagePartsControllerUpdate,
} from '@/api/oneMachineOneFile/mainVulnerableList'
import addAndEdit from './addAndEdit'
export default {
  name: 'mainVulnerableList',
  props: ['title', 'deviceCode'],
  components: { addAndEdit },
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
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
        },
        {
          title: '零件名称',
          dataIndex: 'partsName',
        },
        {
          title: '零件位置',
          dataIndex: 'partsLocation',
        },
        {
          title: '零件厂家',
          dataIndex: 'partsManufacturer',
        },
        {
          title: '零件材质',
          dataIndex: 'partsTexture',
        },
        {
          title: '零件规格尺寸',
          dataIndex: 'partsSize',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operate' },
          align: 'center',
          fixed: 'right',
          width: 100,
        },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceCode: this.deviceCode,
      },
      tableList: [],
      selectedRowKeys: [],
      hiddenVisible: false,
      formdata: {},
      formTitle: '',
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      findAllList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableList = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    paginationChange(val) {
      this.queryParams.pageNum = val.current
      this.queryParams.pageSize = val.pageSize
      this.getList()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    deleteListClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteBatch(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = []
            this.$message.success('删除成功')
            this.getList()
          }
        })
      } else {
        this.$message.warning('请先选择数据')
      }
    },
    addListClick() {
      this.hiddenVisible = true
      this.formTitle = '主要及易损零件一览表-新增'
      this.formdata = {
        partsName: undefined,
        partsLocation: undefined,
        partsManufacturer: undefined,
        partsTexture: undefined,
        partsSize: undefined,
        equipmentCode: this.deviceCode
      }
    },
    editClick(row) {
      this.hiddenVisible = true
      this.formTitle = '主要及易损零件一览表-新增'
      this.formdata = row
    },
    addAndEditClose() {
      this.hiddenVisible = false
    },
    submitForm(val) {
      if (val.id) {
        MainAndDamagePartsControllerUpdate(val).then((res) => {
          if (res.code == 200) {
            this.$message.success('编辑成功')
            this.getList()
          }
        })
      } else {
        val.equipmentCode = this.deviceCode
        MainAndDamagePartsControllerAdd(val).then((res) => {
          if (res.code == 200) {
            this.$message.success('添加成功')
            this.getList()
          }
        })
      }
    },
  },
}
</script>
<style scoped lang="less">
.wrapper {
  width: 100%;
}
.form_item_description {
  ::v-deep .ant-form-item-label {
    width: 123px;
    label {
    }
  }
  ::v-deep {
    .ant-form-item-control-wrapper {
      width: calc(100% -123px);
    }
  }
}
</style>
