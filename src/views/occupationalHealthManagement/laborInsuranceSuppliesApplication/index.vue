<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'addListClick' },
            { value: 'Delete', clickName: 'deleteListClick' },
          ]"
          @addListClick="addListClick"
          @deleteListClick="deleteListClick"
        ></pe-button>
      </template>
      <template slot="appMain">
        <div>
          <a-table
            @change="paginationChange"
            :pagination="pagination"
            :columns="columns"
            :data-source="tableList"
            class="list_table"
            :scroll="{ y: 1, x: 100 }"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            rowKey="id"
            style="margin-top: 20px"
          >
            <template slot="operate" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'Edit',
                    name: '编辑',
                    style: 'btn_link',
                    clickName: 'editClick',
                    icon: '',
                    type: 'link',
                    disabled: $audit.editDisabled(row.status),
                  },
                  {
                    value: 'details',
                    name: '详情',
                    style: 'btn_link',
                    clickName: 'detailsClick',
                    icon: '',
                    type: 'link',
                    isPower: false,
                  },
                  {
                    value: 'Copy',
                    name: '复制',
                    style: 'btn_link',
                    clickName: 'copyClick',
                    icon: '',
                    type: 'link',
                  },
                ]"
                @editClick="editClick(row)"
                @detailsClick="detailsClick(row)"
                @copyClick="copyClick(row)"
              ></pe-button>
            </template>
          </a-table>
        </div>
      </template>
    </Breadcrumb>
    <add-and-edit
      :hidden-visible="hiddenVisible"
      :form-title="formTitle"
      @close="addAndEditClose"
      @submitForm="submitForm"
      :form-data="formData"
      :paginationTotal="pagination.total"
      :addMode="addMode"
      :copyData="copyData"
      ref="addAndEditRef"
    ></add-and-edit>
    <application-form
      :form-title="formTitle"
      :form-data="formData"
      :hidden-visible="detailsVisible"
      @close="detailsClose"
    ></application-form>
  </div>
</template>
<script>
// '1': '已保存'
// '2': '已提交'
// '3': '审批中'
// '4': '已审批'
// '5': '已拒绝'
import {
  labourAdd,
  findAllList,
  queryByID,
  deleteBatch,
  labourUpdate,
  copyAndCreate
} from '@/api/occupationalHealthManagement/laborInsuranceSuppliesApplication'
import { selectCount } from '@/api/occupationalHealthManagement/laborInsuranceSuppliesApplication'
import {
  labourProtectionApplySubmit,
} from '@/api/occupationalHealthManagement/laborInsuranceSuppliesApplicationLedger'
import addAndEdit from './addAndEdit'
import applicationForm from '@/views/occupationalHealthManagement/components/applicationForm.vue'
export default {
  name: 'archiveDocuments',
  components: { addAndEdit, applicationForm },
  data() {
    return {
      addMode: true,
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
          title: '编号',
          dataIndex: 'numbers',
        },
        {
          title: '申请时间',
          dataIndex: 'applicationTime',
        },
        {
          title: '申请人',
          dataIndex: 'application',
        },
        {
          title: '所属部门',
          dataIndex: 'department',
        },
        {
          title: '申请原因',
          dataIndex: 'applyReason',
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (value) => {
            return {
              children: this.recordStatus(value),
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operate' },
          align: 'center',
          fixed: 'right',
          width: 120,
        },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      selfCode: '',
      tableList: [],
      selectedRowKeys: [],
      hiddenVisible: false,
      formData: {},
      formTitle: '',
      detailsVisible: false,
      copyData: false,
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    recordStatus(val) {
      let value = ''
      switch (val) {
        case '1':
          value = '已保存'
          break
        case '2':
          value = '已提交'
          break
        case '3':
          value = '审批中'
          break
        case '4':
          value = '已通过'
          break
        case '5':
          value = '已拒绝'
          break
        case '6':
          value = '作业中'
          break
        case '7':
          value = '已完成'
          break
        default:
          break
      }
      return value
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
      this.pagination.pageSize = val.pageSize
      this.pagination.current = val.current
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
      this.formData = {
        numbers: '',
        applicationTime: '',
        application: this.$store.state.user.name,
        department: undefined,
        applyReason: '',
        list: []
      }
      this.copyData = false
      this.hiddenVisible = true
      this.formTitle = '劳保用品申请-新增'
      this.addMode = true

    },
    copyClick(row) {
      this.getQueryByID(row).then(() => {
        this.hiddenVisible = true
        this.formTitle = '劳保用品申请-新增'
        this.addMode = false
        this.copyData = true
        this.formData.application = this.$store.state.user.name
        selectCount().then((res) => {
          if (res.code == 200) {
            this.formData.numbers = this.formData.numbers.substring(0, this.formData.numbers.length - 3) + res.body.编号后三位
          }
        })
      })
      // copyAndCreate({ copyId: row.id }).then((res) => {
      //   if (res.code == 200) {
      //     this.$message.success('复制成功')
      //     this.getList()
      //   }
      // })
    },
    editClick(row) {
      this.getQueryByID(row).then(() => {
        this.hiddenVisible = true
        this.formTitle = '劳保用品申请-编辑'
        this.addMode = false
        this.copyData = false
      })
    },
    detailsClick(row) {
      this.getQueryByID(row).then(() => {
        this.formTitle = '劳保用品申请-详情'
        this.detailsVisible = true
      })
    },
    getQueryByID(row) {
      return queryByID({ ID: row.id }).then((res) => {
        if (res.code == 200) {
          this.formData = res.body[0]
          this.formData.list = res.body[1]
        }
      })
    },
    detailsClose() {
      this.detailsVisible = false
    },
    addAndEditClose() {
      this.hiddenVisible = false
    },
    submitForm(val, isAdd, action) {
      val.list.forEach(element => {
        element.numbers = val.numbers
        if (!element.hasOwnProperty("issueName")) {
          let randomNumber = Math.floor(Math.random() * 1000)
          element.issueName = `${val.numbers.replace(/[^a-zA-Z]/g, '')}${randomNumber < 10 ? '00' + randomNumber :
            randomNumber < 100 ? '0' + randomNumber : randomNumber}`
        }
      });
      if (isAdd || this.copyData) {
        if (this.copyData) {
          delete val.id
        }
        labourAdd(val).then((res) => {
          if (res.code == 200) {
            if (action == "submit") {
              labourProtectionApplySubmit({ id: res.body }).then((res) => {
                this.$message.success('提交成功')
                this.hiddenVisible = false
                this.getList()
              })
            } else {
              if (this.copyData) {
                this.$message.success('复制成功')
              } else {
                this.$message.success('添加成功')
              }
              this.hiddenVisible = false
              this.getList()
            }
          }
        })
      } else {
        val.list.forEach(element => {
          element.id = val.id
        });
        labourUpdate(val).then((res) => {
          if (res.code == 200) {
            if (action == "submit") {
              labourProtectionApplySubmit({ id: val.id }).then((res) => {
                this.$message.success('提交成功')
                this.hiddenVisible = false
                this.getList()
              })
            } else {
              this.$message.success('编辑成功')
              this.hiddenVisible = false
              this.getList()
            }
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
