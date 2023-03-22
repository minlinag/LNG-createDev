<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'Add',
            clickName: 'addNew',
          },
          {
            value: 'Delete',
            clickName: 'mydelete',
          },
        ]"
        @addNew="libraryDataAdd"
        @mydelete="mydelete"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="设备名称："
                >
                  <a-input
                    v-model="form.deviceName"
                    placeholder="请输入设备名称"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="设备位号："
                >
                  <a-input
                    v-model="form.deviceCode"
                    placeholder="请输入设备位号"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item>
                  <a-button
                    v-Query
                    class="buttonType"
                    type="primary"
                    @click="search"
                  >
                    查询
                  </a-button>
                  <a-button class="buttonType" @click="resetForm">
                    重置
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <dc-table
        @change="paginationChange"
        rowKey="id"
        :pagination="pagination"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          columnWidth: 32
        }"
        :scroll="{ x: 100 }"
        :columns="columnsDub"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="status" slot-scope="row">
          {{ row | rowStatus }}
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'editListClick',
                disabled: false,
                icon: '',
                style: ['btn_link'],
                disabled: $audit.editDisabled(row.recordStatus),
              },
              {
                value: 'View',
                name: '详情',
                type: 'link',
                clickName: 'checkListClick',
                icon: '',
                style: ['btn_link'],
              },

              {
                value: 'Approval',
                clickName: 'approval',
                name: '审批',
                icon: '',
                style: ['btn_link'],
                type: 'link',
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
            ]"
            @editListClick="editListClick(row, '大修计划-编辑')"
            @checkListClick="checkListClick(row, '大修计划-详情')"
            @approval="approval(row, '大修计划-审批')"
          ></pe-button>
        </template>
      </dc-table>
      <div v-if="applicationsVisible">
        <application-model
          :formType="formType"
          :tableList="tableList"
          :applications-visible="applicationsVisible"
          @close="applicationsVisibleClose"
        ></application-model>
      </div>

      <dispatchModel
        ref="dispatchModel"
        :visible.sync="dispatchVisible"
        :title="'大修计划-派工'"
        :tableList="dispatchForm"
      />
    </template>
  </Breadcrumb>
</template>
<script>
import ApplicationModel from './components/applicationModel.vue'
import dispatchModel from './components/dispatchModel.vue'

import { getList, getFormList, updataList } from '@/api/dispatching/dispatching' //获取申请列表
import { getdict } from '@/api/temporaryOverhaulplan' //获取的是字典表的作业位置
import {
  getTableList,
  addList,
  updataLists,
  deleteList,
} from '@/api/dispatching/overhaulPlan'
import fileUpload from '@/components/importConpontsData'
import dispatchingDetail from '@/views/dispatching/modules/dispatchingDetail/dispatchingDetail'

export default {
  components: { ApplicationModel, fileUpload, dispatchModel },
  filters: {
    rowStatus(val) {
      switch (val) {
        case '1':
          return '已保存'
        case '2':
          return '已提交'
        case '3':
          return '审批中'
        case '4':
          return '已审批'
        case '5':
          return '已拒绝'
      }
    },
  },
  data() {
    return {
      formType: '',
      dispatchVisible: false,
      tableList: {},
      applicationsVisible: false,
      dataForm: {}, //缓存取到的数据
      measuresForm: [], //form表单接受的数据
      endOpen: false, //日期选择
      stateInfo: [],
      selectArr: {},
      //翻页页面组件
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
      //页面下方表格的列属性11
      columnsDub: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
          align: 'center',
        },

        {
          title: '状态',
          dataIndex: 'recordStatus',
          scopedSlots: { customRender: 'status' },
          width: 50,
           align: 'center',
        },
        {
          title: '停车大修计划编码',
          dataIndex: 'inspectionPlanNo',
          width: 130,
          align: 'center',
        },

        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 90,
          align: 'center',
        },
        {
          title: '设备位号',
          dataIndex: 'deviceNo',
          width: 100,
          align: 'center',
        },
        {
          title: '作业区域',
          dataIndex: 'workLocation',
          width: 120,
          align: 'center',
        },
        // {
        //   title: ' 预估费用（元）',
        //   dataIndex: 'estimatedCost',
        //   width: 100,
        //   align: 'center',
        // },
        // {
        //   title: '维修开始日期',
        //   dataIndex: 'proposedMaintenanceStartDate',
        //   width: 100,
        //   align: 'center',
        // },
        // {
        //   title: '维修结束日期',
        //   dataIndex: 'proposedMaintenanceEndDate',
        //   width: 100,
        //   align: 'center',
        // },
        {
          title: '停车大修计划描述',
          dataIndex: 'planDescription',
          width: 130,
          align: 'center',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 130,
          fixed: 'right',
        },
      ],
      //勾选框/选择框组件
      selectedRowKeys: [],
      //查看组件中的数值
      LookForm: {},
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageNum: 1,
        pageSize: 10,
        deviceName: '', //设备名称
        deviceCode: '', //设备位号
      },
      dispatchForm: {},
      //查看是否visible
      visible: false,
      riskLibraryFormState: '',
      riskLibraryFormStatus: '',
      dataSource: [],
      //表格中的数据
    }
  },
  created() {
    this.getSelectAll()
  },

  mounted() { },
  methods: {
    workLocationFilters(val) {
      let name
      this.selectArr.dict.forEach((item) => {
        if (val == item.dictcode) {
          return (name = item.dictname)
        }
      })
      return name
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus !== '1' && record.recordStatus !== '5',
        },
      }
    },
    applicationsVisibleClose() {
      this.getListForPage()
      this.applicationsVisible = false
    },
    dispatchClick(row) {
      this.dispatchForm = {
        deviceName: row.deviceName,
        deviceCode: row.deviceNo,
        // deviceNum: row.deviceNum,
        inspectionPlanNo: row.inspectionPlanNo,
        maintenanceLevel: row.maintenanceLevel,
        whetherHaveInspectionRule: row.whetherHaveInspectionCondition,
        workArea: row.workLocation,
      }
      console.log(this.dispatchForm)
      this.dispatchVisible = true
    },
    //申请单按钮
    addApplyMt() {
      this.dataForm.recordStatus = 4
      updataList(this.dataForm).then((res) => {
        if (res.code == '200') {
          this.$message.success('派工成功')
          this.getListForPage()
          this.visible = false
        }
      })
    },

    onChange(date, dateString) {
      console.log(date, dateString)
    },
    //附件上传点击事件
    flieChange(val) {
      this.riskLibraryForm.file = val
    },
    //申请单点击事件
    dispatching(val) {
      console.log(val)
      this.selectArr.dispatching.forEach((res) => {
        if (val == res.id) {
          console.log(res)
          this.riskLibraryForm.workLocation = res.workArea
            ? res.workArea
            : '---'
          this.riskLibraryForm.deviceNo = res.deviceNo ? res.deviceNo : '---'
          this.riskLibraryForm.deviceCode = res.deviceCode
            ? res.deviceCode
            : '---'
          this.riskLibraryForm.deviceName = res.deviceName
            ? res.deviceName
            : '---'
        }
      })
    },
    // 获取列表
    getListForPage() {
      getTableList(this.form).then((res) => {
        if (res.code == '200') {
          console.log(res.body)
          this.pagination.current = res.body.pageIndex
          this.pagination.pageSize = res.body.pageSize
          this.dataSource = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    getSelectAll() {
      getList({
        pageNum: 1,
        pageSize: 999999999,
      }).then((res) => {
        this.selectArr.dispatching = res.body.data
      })
      getdict().then((res) => {
        this.selectArr.dict = res.body.data
      })
      this.getListForPage()
    },
    onRiskLibraryBack() {
      this.visible = false
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    libraryDataAdd() {
      this.temporaryVerificationOpen()
    },
    temporaryVerificationOpen() {
      this.formType = 'overhauAdd'
      this.tableList = {}
      this.applicationsVisible = true
    },
    onRiskLibrarySubmit(recordStatus) {
      this.$refs.riskLibraryRef.validate((valid) => {
        if (valid) {
          var dataBox = new FormData()
          dataBox.append('strJson', JSON.stringify(this.riskLibraryForm))
          dataBox.append('file', this.riskLibraryForm.file)
          if (!this.riskLibraryForm.hasOwnProperty('id')) {
            addList(dataBox).then((res) => {
              if (res.code == 200) {
                this.visible = false
                this.$message.success('添加成功')
                this.getListForPage()
              }
            })
          } else {
            this.riskLibraryForm.recordStatus = recordStatus
            updataLists(dataBox).then((res) => {
              console.log(res)
              if (res.code == 200) {
                this.visible = false
                this.$message.success('添加成功')
                this.getListForPage()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //删除选项，根据选择的id删除对应数据
    mydelete() {
      if (this.selectedRowKeys != '') {
        deleteList(this.selectedRowKeys).then((res) => {
          if (res.code == '200') {
            this.$message.success('删除成功！')
            this.getListForPage()
          }
        })
      } else {
        this.$message.error('请至少选择一项！')
      }
    },
    cancel() {
      this.visible = false
    },
    //查询功能
    search() {
      console.log(this.form)
      if (this.form) {
        this.form.pageNum = 1
        this.form.pageSize = 10
        this.getListForPage()
      } else {
        this.getListForPage()
      }
    },
    //页面变更
    paginationChange(pagination) {
      console.log(pagination)
      this.form.pageNum = pagination.current
      this.form.pageSize = pagination.pageSize
      this.getListForPage()
    },
    riskLibraryModelClose() {
      this.riskLibraryFormInitial()
    },
    editListClick(row, text) {
      this.tableList = row
      this.applicationsVisible = true
      this.formType = 'overhauUpdata'
    },
    approval(row) {
      this.tableList = row
      this.applicationsVisible = true
      this.formType = 'overhauApp'
    },
    checkListClick(row, text) {
      this.tableList = row
      this.applicationsVisible = true
      this.formType = 'overhauSearch'
    },
    fxkSelectDataEcho(row) {
      this.riskLibraryForm = row
    },
    riskLibraryFormInitial() {
      this.riskLibraryFormState = ''
      this.riskLibraryFormStatus = ''
      this.riskLibraryForm = {}
    },
    disabledStartDate(startValue) {
      console.log(startValue, 'startValue')
      const endValue = this.riskLibraryForm.proposedMaintenanceEndDate
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.riskLibraryForm.proposedMaintenanceStartDate
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    //重置输入
    resetForm() {
      this.form = {}
      this.form.pageNum = 1
      this.form.pageSize = 10
      this.getListForPage()
    },
  },
}
</script>
<style scoped lang="less">
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout{
  margin-bottom: 0px;
}

.riskManagement {
  display: flex;
  width: 100%;
  /deep/ .tree_layout_sider,
  .left-bar {
    max-width: 200px !important;
    min-width: 200px !important;
    height: 520px;
    .header_operate {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px #b6b6b6 solid;
      .operate_but {
        display: inline-block;
        .ant-btn + .ant-btn {
          margin-left: 5px;
        }
      }
    }
    .tree_data {
      .ant-btn-icon-only.ant-btn-sm {
        width: 16px;
        height: 16px;
        font-size: 10px;
        margin-left: 30px;
      }
    }
  }
  .left-bar {
    max-width: 19%;
    margin-right: 1%;
    background-color: #ececec;
    ::v-deep ul .ant-tree-treenode-selected .ant-tree-node-selected {
      width: 100%;
      line-height: 27px;
    }
    ::v-deep .ant-tree ul li span {
      line-height: 27px;
    }
    ::v-deep .ant-tree {
      height: 470px;
      overflow: auto;
    }
  }
  .right-content {
    flex: auto;
    max-width: 80%;
  }
}

/deep/ .search .ant-form-item {
  margin-bottom: 0;
}

.riskManagement > div {
  flex: 1 !important;
}

.node_modal {
  .ant-form {
    display: flex;
    flex-wrap: wrap;
    margin-top: -10px;
    .ant-form-item {
      width: calc(50% - 16px);
      margin-top: 20px;
    }
  }
}

.dc_model {
  ::v-deep .ant-col-8 {
    width: 50%;
  }
  ::v-deep .ant-col {
    margin-top: 6px;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  ::v-deep .ant-form-item label {
    white-space: pre-wrap;
  }
}

.risk_form_model {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: calc(50% - 16px);
    // height: 30px;
    margin-bottom: 0px;
    .ant-form-item-label {
      label {
        font-size: 14px;
      }
    }
    .ant-form-explain {
      font-size: 14px;
    }
  }
  .label_overstep {
    ::v-deep .ant-col {
      label {
        width: 115px;
      }
      label::after {
        top: -10.5px;
        margin: 0px -10px 0px 1px;
      }
    }
  }
  .form_textarea {
    height: auto;
    ::v-deep .ant-col {
      height: auto;
    }
  }
}

.form_but {
  width: 100% !important;
  display: flex;
  ::v-deep .ant-form-item-control {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
    .ant-btn + .ant-btn {
      margin-left: 20px;
    }
  }
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item-control {
  width: 100%;
}

.ant-select-selection--single {
  width: 180px;
}

.aaaa {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}

// .dc-table {
//   .ant-row {
//     ::v-deep .ant-form-item-label {
//       white-space: wrap !important;
//     }
//   }
// }
</style>
