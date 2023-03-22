<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb :titleName="title">
      <template slot="breadcrumbButton">
        <pe-button
          :include="[{ value: 'Add', clickName: 'addListClick' }]"
          @addListClick="addListClick"
        ></pe-button>
      </template>
      <template slot="appMain">
        <a-table
          @change="paginationChange"
          :pagination="pagination"
          :columns="columns"
          :data-source="tableList"
          :scroll="{ y: 300 }"
          rowKey="id"
        >
          <template slot="operation" slot-scope="row">
            <pe-button
              :include="[
                {
                  value: 'Delete',
                  name: '删除',
                  style: 'btn_link',
                  clickName: 'deleteClick',
                  icon: '',
                  type: 'link',
                  isPower: false,
                },
              ]"
              @deleteClick="deleteClick(row)"
            ></pe-button>
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
      ref="addAndEditRef"
      :device-code="deviceCode"
    ></add-and-edit>
  </div>
</template>
<script>
import {
  findAllList,
  DeviceManagePrincipalControllerAdd,
  deleteBatch
} from '@/api/oneMachineOneFile/equipmentResponsIbleinformationSheet'
import addAndEdit from './addAndEdit'
export default {
  name: 'equipmentResponsIbleinformationSheetList',
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
          title: '责任人',
          dataIndex: 'principal',
          width: 100,
        },
        {
          title: '责任单位',
          dataIndex: 'accountabilityUnit',
          width: 100,
        },
        {
          title: '起止时间',
          dataIndex: 'startTime',
          customRender: (value, row, index) => {
            return {
              children: `${row.startTime}/${row.endTime}`,
              attrs: { rowSpan: 1 },
            }
          },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 100,
        },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceCode: this.deviceCode
      },
      tableList: [],
      hiddenVisible: false,
      formdata: {},
      formTitle: '',
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deleteClick(row) {
      deleteBatch([row.id]).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
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
    addListClick() {
      this.hiddenVisible = true
      this.formTitle = '设备管理责任人信息表-新增'
      this.formdata = {
        principal: '',
        accountabilityUnit: '',
        startTime: '',
        endTime: '',
        equipmentCode: this.deviceCode
      }
    },
    addAndEditClose() {
      this.hiddenVisible = false
    },
    submitForm(val) {
      DeviceManagePrincipalControllerAdd(val).then((res) => {
        if (res.code == 200) {
          this.$message.success('添加成功')
          this.getList()
        }
      })
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
