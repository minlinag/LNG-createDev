<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'addPlan' },
            {
              value: 'Delete',
              clickName: 'mydelete',
            },
          ]"
          @addPlan="addPlan"
          @mydelete="mydelete"
        ></pe-button>
        <!-- <a-button v-Query
                  class="buttonType btn_primary"
                  type="primary"
                  icon="plus"
                  @click.stop="addPlan">
          创建
        </a-button> -->
      </div>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="searchInfo">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="设备名称："
                >
                  <a-input
                    v-model="searchInfo.deviceName"
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
                    v-model="searchInfo.deviceCode"
                    placeholder="请输入设备位号"
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
        :scroll="{ x: 100 }"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          columnWidth: 32,
        }"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
        <template slot="status" slot-scope="row">
          {{ row | rowStatus }}
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'View',
                clickName: 'getListDetail',
                isPower: false,
                icon: '',
                style: ['btn_link'],
                type: 'link',
                name: '查看',
              },
              {
                value: 'Edit',
                clickName: 'upDateListDetail',
                icon: '',
                style: ['btn_link'],
                type: 'link',
                disabled: $audit.editDisabled(row.recordStatus),
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
            @getListDetail="getListDetail(row)"
            @upDateListDetail="upDateListDetail(row)"
            @approval="approval(row)"
          ></pe-button>
        </template>
        <template slot="deviceName" slot-scope="row">
          <span
            v-for="(item, index) in deviceSelect"
            v-show="item.eqmId == row"
            :key="index"
          >
            {{ item.eqm_sbmc }}
          </span>
        </template>
        <template slot="inspectionDateTime" slot-scope="row, text, index">
          {{ text.inspectionDateTime + '-' + text.proposedMaintenanceDate }}
        </template>
      </dc-table>
      <application-model
        :formType="formType"
        :tableList="tableList"
        :applications-visible="applicationsVisible"
        @close="applicationsVisibleClose"
      ></application-model>

      <dispatchModel
        ref="dispatchModel"
        :visible.sync="dispatchVisible"
        :title="'临时计划-派工'"
      />
    </template>
  </Breadcrumb>
</template>
<script>
// import dcTable from '@/components/table'
import {
  getList, //获取列表
  addList, //获取列表
  upDateList, //修改列表
  getdict,
  deleteBatch,
} from '@/api/temporaryOverhaulplan'
import { getFormList } from '@/api/dispatching/dispatching' //获取申请列表
import dispatchingDetail from '@/views/dispatching/modules/dispatchingDetail/dispatchingDetail'

import { queryPageListForUnClass } from '@/api/PublicInterface' //设备台账
import { message } from 'ant-design-vue'
import fileUpload from '@/components/importConpontsData'
import ApplicationModel from './components/applicationModel.vue'
import dispatchModel from './components/dispatchModel.vue'
export default {
  components: {
    dispatchingDetail,
    fileUpload,
    dispatchModel,
    ApplicationModel,
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
  },
  data() {
    return {
      //勾选框/选择框组件
      selectedRowKeys: [],
      tableList: {},
      applicationsVisible: false,
      startDate: [],
      measuresForm: [], //form表单接受的数据
      deviceSelect: [],
      dispatchVisible: false, //派工表单弹窗
      value1: '',
      dateilInfo: {},
      workLocationSelect: [], //作业位置数组
      searchInfo: {
        pageIndex: 1,
        pageSize: 10,
        deviceName: '', //设备名称
        deviceCode: '', //设备位号
        temMainPlanDescription: '', //设备备注
        startTime: '',
        endTime: '',
      },
      pagination: {
        current: 0,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      formType: '',
      form: {},
      visible: false,
      Config: {
        otherConfigurations: [
          {
            type: 'btn',
            label: '保存',
            btnType: 'primary', //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: 'save', //传值内容 拿到当前所有数据包装好的
          },
          {
            type: 'btn',
            label: '取消',
            btnType: '', //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: 'cancelClick', //传值内容 拿到当前所有数据包装好的
          },
        ],
        formDataList: [
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '检修计划编码', //展示名称
            formKey: 'temMainPlanNo', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入检修计划编码', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            colSpan: 8,
            options: {
              // 暂时开发状态
              multiple: true,
              /* vDecorator: {
                required: true,
                message: "请输入检修计划编码",
                trigger: "blur",
              }, */ //校验规
            },
          },

          {
            type: 'select', //组件类型 目前指出 input || select
            showSearch: true,
            optionFilterProp: 'children',
            label: '设备名称', //展示名称
            colSpan: 8,
            formKey: 'deviceName', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入设备名称',
                // trigger: "blur",
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '设备编码', //展示名称
            colSpan: 8,
            formKey: 'deviceNum', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '设备位号', //展示名称
            colSpan: 8,
            formKey: 'deviceCode', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'select', //组件类型 目前指出 input || select
            label: '作业位置', //展示名称
            colSpan: 8,
            formKey: 'workLocation', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请选择作业位置',
                // trigger: "change",
              }, //校验规
            },
            optionData: [],
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '预估费用', //展示名称
            colSpan: 8,
            formKey: 'estimatedCost', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              vDecorator: [
                {
                  required: true,
                  message: '请输入预估费用',
                  // trigger: 'change',
                },
                {
                  validator: (rule, value, callback) => {
                    const reg = /^[0-9]*$/
                    if (reg.test(value)) {
                      return callback()
                    } else {
                      return callback(new Error('请输入数字'))
                    }
                  },
                  // trigger: 'change',
                },
              ], //校验规则
            },
          },
          {
            type: 'dateRangePicker', //组件类型 目前指出 input || select
            label: '建议维修日期', //展示名称
            colSpan: 8,
            format: 'YYYY-MM-DD',
            formKey: 'inspectionDateTime1', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请选择', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '备注', //展示名称
            colSpan: 8,
            formKey: 'remark', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '检修计划描述', //展示名称
            colSpan: 8,
            formKey: 'temMainPlanDescription', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入检修计划描述',
                // trigger: "change",
              }, //校验规
            },
          },
        ],
      },

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
          title: '状态',
          dataIndex: 'recordStatus',
          scopedSlots: { customRender: 'status' },
          width: 50,
          align: 'center',
        },
        {
          title: '临时检修计划编码',
          dataIndex: 'temMainPlanNo',
          width: 130,
          align: 'center',
        },
        {
          title: ' 设备名称',
          dataIndex: 'deviceName',
          width: 100,
          align: 'center',
          // slots: { title: 'equipmentCategory' },//表头插槽
          // scopedSlots: { customRender: 'deviceName' },
        },

        {
          title: '设备位号',
          dataIndex: 'deviceNo',
          width: 80,
          align: 'center',
        },
        {
          title: '作业区域',
          dataIndex: 'workLocation',
          width: 90,
          align: 'center',
          // scopedSlots: { customRender: 'workLocation' },
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
          title: '临时检修计划描述',
          dataIndex: 'temMainPlanDescription',
          width: 130,
          align: 'center',
        },
        {
          fixed: 'right',
          title: '操作',
          width: 130,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      dataSource: [],
    }
  },
  mounted() {
    this.getList()
    this.getQueryPageList()
  },
  created() {},
  methods: {
    onChange(value) {
      console.log(value)
    },
    //分页查询
    search() {
      this.searchInfo.pageIndex = 1
      this.searchInfo.pageSize = 10
      if (this.startDate.length > 0) {
        this.searchInfo.startTime = this.startDate[0]
        this.searchInfo.endTime = this.startDate[1]
      }
      this.getList()
    },

    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageIndex = pagination.current
      this.searchInfo.pageSize = pagination.pageSize
      this.getList()
    },
    //删除选项，根据选择的id删除对应数据
    mydelete() {
      if (this.selectedRowKeys != '') {
        deleteBatch(this.selectedRowKeys).then((res) => {
          if (res.code == '200') {
            this.$message.success('删除成功！')
            this.getList()
          }
        })
      } else {
        this.$message.error('请至少选择一项！')
      }
    },
    // 生成32位uuid
    getUuid() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, //随机生成 0 - 15的数字
          v = c == 'x' ? r : (r & 0x3) | 0x8 //c为y时只取8、9、a、b中的一个
        return v.toString(16) //把数字转成16进制的字符串
      })
    },

    //点击新增
    addPlan() {
      this.formType = 'temporaryAdd'
      this.applicationsVisible = true
    },

    //点击编辑
    upDateListDetail(val) {
      this.formType = 'temporaryUpdata'
      this.tableList = val
      this.applicationsVisible = true
    },
    approval(row) {
      this.tableList = row
      this.applicationsVisible = true
      this.formType = 'temporaryApp'
    },
    //点击查看
    getListDetail(val) {
      this.tableList = val
      this.applicationsVisible = true
      this.formType = 'temporarySearch'
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    // 派工
    dispatchDetail(row) {
      this.dispatchVisible = true
      this.$nextTick(() => {
        this.$refs.dispatchModel.handleOpen(row)
      })
    },
    addApplyMt() {},
    // 派工取消
    onRiskLibraryBack() {
      this.dispatchVisible = false
    },
    //保存详情
    saveList(val) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          if (val.inspectionDateTime1 !== null) {
            val.inspectionDateTime = val.inspectionDateTime1[0]
            val.proposedMaintenanceDate = val.inspectionDateTime1[1]
          }

          // val.inspectionDateTime1=null
          if (this.dateilInfo.id) {
            val.id = this.dateilInfo.id
            upDateList(val).then((res) => {
              console.log(res)
              if (res.code == '200') {
                message.success('修改成功')
                this.getList()
                this.visible = false
              }
            })
          } else {
            addList(val).then((res) => {
              if (res.code == '200') {
                message.success('保存成功')
                this.getList()
                this.visible = false
              }
            })
          }
        }
      })
    },

    //获取表格列表
    getList() {
      getList(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
        this.dataSource = res.body.data
        this.pagination.total = res.body.total
      })
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus !== '1' && record.recordStatus !== '5',
        },
      }
    },
    // 获取设备台账
    getQueryPageList() {
      queryPageListForUnClass({
        featureClassificId: '',
        searchMap: {},
        pageIndex: 1,
        pageSize: 9999,
      }).then((res) => {
        // console.log(res,'设备台账');
        let deviceSelect = []
        this.deviceSelect = res.body.data
        res.body.data.forEach((item) => {
          deviceSelect.push({
            value: item.eqmId,
            label: item.eqm_sbmc,
          })
        })
        this.Config.formDataList.forEach((item) => {
          if (item.formKey == 'deviceName') {
            item.optionData = deviceSelect
          }
        })
      })
      getdict({}).then((res) => {
        this.workLocationSelect = []
        res.body.data.forEach((item) => {
          this.workLocationSelect.push({
            label: item.dictname,
            value: item.id,
          })
        })
        this.Config.formDataList.forEach((item) => {
          if (item.formKey == 'workLocation') {
            item.optionData = this.workLocationSelect
          }
        })
      })
    },

    //下拉框点击
    selectChange(val) {
      if (val.formKey == 'deviceName') {
        this.deviceSelect.forEach((item) => {
          if (item.eqmId == val.value) {
            this.Config.formDataList.forEach((items) => {
              if (items.formKey == 'deviceNum') {
                //设备编码
                items.value = item.eqm_sbbm
              }
              if (items.formKey == 'deviceCode') {
                //设备位号
                items.value = item.eqm_sbwh
              }
            })
          }
        })
      }
    },

    //重置输入
    resetForm() {
      this.startDate = []
      this.searchInfo = {
        pageIndex: 1,
        pageSize: 10,
        deviceName: '', //设备名称
        deviceCode: '', //设备位号
        temMainPlanDescription: '', //设备备注
      }
      this.getList()
    },

    //关闭弹出框
    applicationsVisibleClose() {
      this.getList()
      this.applicationsVisible = false
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
