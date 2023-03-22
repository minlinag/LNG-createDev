<!--/***-->
<!--*申请单界面搭建刘豪东-->
<!--*日期：2022年10月21日-->
<!--**/-->
<template>
  <Breadcrumb>
    <!--头部展示框-->
    <template slot="breadcrumbButton">
      <div slot="extra">
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
          @addNew="addNew"
          @mydelete="deleteAll"
        ></pe-button>
      </div>
    </template>
    <!--内容搜索框-->
    <template slot="appMain">
      <div class="search-content">
        <a-form-model>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="状态:"
              >
                <a-select
                  placeholder="请选择状态"
                  v-model="searchInfo.recordStatus"
                >
                  <a-select-option
                    allowClear
                    :value="item.value"
                    v-for="(item, index) in selectData"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="设备名称:"
              >
                <a-input
                  placeholder="请输入设备名称"
                  v-model="searchInfo.deviceName"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="设备位号:"
              >
                <a-input
                  placeholder="请输入设备位号"
                  v-model="searchInfo.deviceCode"
                ></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item>
                <a-button
                  v-Query
                  class="buttonType"
                  :style="{ marginLeft: '8px' }"
                  type="primary"
                  @click="select"
                >
                  查询
                </a-button>
                <a-button class="buttonType" @click="resetForm">
                  重置
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          columnWidth: 30,
        }"
        :scroll="{ y: 1, x: 500 }"
        class="list_table_1"
        :pagination="pagination"
        @change="paginationChange"
        :row-key="(record) => record.id"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
        <template slot="disStatus" slot-scope="row">
          {{ row | disStatus }}
        </template>
        <template slot="status" slot-scope="row">
          {{ row | rowStatus }}
        </template>
        <template slot="condition" slot-scope="row">
          {{ row == '1' ? '是' : '否' }}
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.editDisabled(row.recordStatus),
              },
              {
                value: 'examine',
                type: 'link',
                clickName: 'examineClick',
                name: '审核',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'details',
                type: 'link',
                clickName: 'detailsClick',
                name: '详情',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @edit="upDateListDetail(row, 'applicationsUpdata')"
            @detailsClick="upDateListDetail(row, 'applicationsSearch')"
            @examineClick="applications(row, 'applicationsApp')"
          ></pe-button>
        </template>
      </a-table>
      <!--弹出框-->
      <div v-if="modelConfig">
        <dc-Model v-model="visible" :modelConfig="modelConfig" class="DcModel">
          <a-layout>
            <a-layout-content>
              <dispatchingDetail
                ref="dispatchForm"
                :measuresForm="measuresForm"
                @openList="openList"
              ></dispatchingDetail>
            </a-layout-content>
          </a-layout>
          <div
            style="text-align: center"
            class="contneFormBtnStyle ant-modal-footer"
          >
            <a-button @click.stop="cancelClick"> 取消 </a-button>
            <a-button
              class="buttonType btn_primary"
              type="primary"
              @click.stop="addList"
              v-if="visibleType == null || visibleType == 'updata'"
            >
              保存
            </a-button>
            <a-button
              v-if="visibleType && visibleType == 'audit'"
              class="buttonType btn_primary"
              type="primary"
              @click.stop="addList(4)"
            >
              审核
            </a-button>
          </div>
        </dc-Model>
      </div>

      <div v-if="applicationsVisible">
        <application-model
          :formType="formType"
          :tableList="tableList"
          :applications-visible="applicationsVisible"
          @close="applicationsVisibleClose"
        ></application-model>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  getFormList,
  addList,
  updataList,
  deleteList,
  applicatioinFormAudio,
} from '@/api/dispatching/dispatching'
import ApplicationModel from '@/views/equipmentMaintenance/modules/faultyMaintenanceMgt/modules/components/applicationModel.vue'
import { getdict } from '@/api/temporaryOverhaulplan'
import { queryPageListForUnClass } from '@/api/PublicInterface' //设备台账设备列表
import { timestampToTime } from '@/utils/tableFun'
import dispatchingDetail from '@/views/dispatching/modules/dispatchingDetail/dispatchingDetail'
import { message } from 'ant-design-vue'

export default {
  components: {
    ApplicationModel,
    dispatchingDetail,
  },
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
    disStatus(val) {
      switch (val) {
        case '1':
          return '未派工'
        case '2':
          return '作业中'
        case '3':
          return '已完成'
      }
    },
  },
  data() {
    return {
      formType: '',
      tableList: {},
      applicationsVisible: false,
      selectedRowKeys: [],
      selectForPage: [],
      dataForm: {},
      visibleType: null,
      measuresForm: [], //申请单数组
      selectData: [
        { label: '已保存', value: '1' },
        { label: '已提交', value: '2' },
        { label: '审批中', value: '3' },
        { label: '已审批', value: '4' },
        { label: '已拒绝', value: '5' },
      ],
      dispatchStatus: [
        { label: '未派工', value: 1 },
        { label: '作业中', value: 2 },
        { label: '已完成', value: 3 },
      ],
      value1: '',
      dateilInfo: {},
      workLocationSelect: [], //作业位置数组
      searchInfo: {
        pageNum: 1,
        pageSize: 10,
      },
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
      visible: false,
      modelConfig: {
        width: '950px',
        title: '申请单',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
          width: 50,
        },
        {
          title: '状态',
          dataIndex: 'recordStatus',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '申请编号',
          dataIndex: 'inspectionPlanNo',
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
        },
        {
          title: '设备位号',
          dataIndex: 'deviceNo',
        },
        {
          title: ' 作业区域',
          dataIndex: 'workLocation',
        },
        // {
        //   title: ' 维护级别',
        //   dataIndex: 'maintenanceLevel',
        //   width: 80,
        // },
        {
          title: ' 是否具备检维修条件',
          dataIndex: 'whetherHaveInspectionCondition',
          scopedSlots: { customRender: 'condition' },
          align: 'center',
        },
        // {
        //   title: ' 是否需要润滑',
        //   dataIndex: 'needLubricate',
        //   width: 100,
        // },
        // {
        //   title: ' 预估费用',
        //   dataIndex: 'estimatedCost',
        //   width: 80,
        // },
        // {
        //   title: '开始日期',
        //   dataIndex: 'proposedMaintenanceStartDate',
        //   width: 100,
        // },
        // {
        //   title: '结束日期',
        //   dataIndex: 'proposedMaintenanceEndDate',
        //   width: 100,
        // },
        // {
        //   title: ' 申请人',
        //   dataIndex: 'applyUser',
        //   width: 70,
        // },

        {
          fixed: 'right',
          title: '操作',
          width: 150,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      dataSource: [],
      visibleChilder: false, //控制子级
      modelConfigChilder: {
        width: '950px',
        title: '设备列表',
        cancelText: false,
        footer: '', //是否展示页脚
      },
    }
  },
  created() {
    this.getList()
    this.queryPageListForUnClass()
  },

  methods: {
    // //弹出框子组件传值父组件

    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus !== '1' && record.recordStatus !== '5',
        },
      }
    },
    dispatchingList() {
      this.visibleChilder = false
      this.getList()
    },
    openList(val) {
      this.visibleChilder = true
    },
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    //批量删除确认方法
    deleteAll(val) {
      deleteList(this.selectedRowKeys).then((res) => {
        console.log(res)
        if (res.code == '200') {
          message.success('删除成功')
          this.getList()
        }
      })
    },
    //关闭弹出框
    applicationsVisibleClose(val) {
      if (val !== '取消') {
        this.getList()
      }
      this.applicationsVisible = false
    },
    //分页查询
    select() {
      console.log(this.searchInfo)
      this.searchInfo.pageNum = 1
      this.searchInfo.pageSize = 10
      this.getList()
    },
    // 新增打开弹出框方法
    addNew() {
      console.log(111)
      this.formType = 'applicationsAdd'
      this.applicationsVisible = true
    },
    //列表编辑方法
    upDateListDetail(val, type) {
      this.tableList = val
      this.formType = type
      this.applicationsVisible = true
    },
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageNum = pagination.current
      this.searchInfo.pageSize = pagination.pageSize
      this.getList()
    },

    // 弹出框取消
    cancelClick() {
      this.visible = false
    },

    //获取表格列表
    getList() {
      getList(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
        this.dataSource = res.body.data
        this.pagination.total = res.body.total
      })
      this.measuresForm = getFormList('申请')
    },
    queryPageListForUnClass() {
      queryPageListForUnClass({ pageNum: 1, pageSize: 9999999 }).then((res) => {
        let queryPageListForUnClass = []
        res.body.data.forEach((item) => {
          queryPageListForUnClass.push({
            value: item.eqmId,
            label: item.eqm_sbmc,
          })
        })
        let dict = []
        getdict({}).then((res) => {
          res.body.data.forEach((item) => {
            dict.push({ value: item.id, label: item.dictname })
          })
          this.measuresForm.forEach((item) => {
            if (item.labelKey == 'workArea') {
              item.data = dict
            }
            if (item.labelKey == 'deviceCode') {
              item.data = queryPageListForUnClass
            }
          })
        })
      })
    },

    applications(val, type) {
      this.tableList = val
      this.formType = type
      this.applicationsVisible = true
    },
    //重置表单输入框
    resetForm() {
      this.searchInfo = {
        pageNum: 1,
        pageSize: 10,
        recordStatus: '',
        deviceName: '', //设备名称
        deviceNo: '', //设备位号
      }
      this.getList()
    },

    addList(type) {
      this.$refs.dispatchForm.$refs.form.validate((valid) => {
        if (valid) {
          var dataForms = this.$refs['dispatchForm']['_data'].measuresObj
          var dataForm = {}
          for (var i in dataForms) {
            dataForm[i] = dataForms[i]
            this.dataForm[i] = dataForms[i]
          }
          if (this.visibleType) {
            if (type == 4) {
              this.dataForm.recordStatus = type
            }
            updataList(this.dataForm).then((res) => {
              if (res.code == '200') {
                this.getList()
                this.visible = false
              }
            })
          } else {
            dataForm.deviceCode = this.dataForm.deviceCode
            addList(dataForm).then((res) => {
              console.log(res)
              if (res.code == '200') {
                this.getList()
                this.visible = false
              }
            })
          }
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
/deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin: 0;
  padding: 0;
}

.equipmentDisplay {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ant-form {
  display: flex;
  justify-content: left;
}

.equipmentSelection {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-left: -17px;
  margin-top: 10px;
}

/deep/ .equipmentDisplay-checkbox {
  margin-top: 10px;
}

.look {
  color: rgb(24, 144, 255);
  // color: white;
}

.Myserch {
  display: flex;
  justify-content: end;
}

.bar {
  width: 100%;
  height: 10px;
  margin-top: 10px;
  background-color: #ececec;
  // box-shadow: 2px 2px 5px #333;
  border-radius: 5px;
}

span {
  cursor: pointer;
  padding: 0 5px;
}

.search-content {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
