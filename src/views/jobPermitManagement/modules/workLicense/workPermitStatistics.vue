<!--/***-->
<!--*作业许可界面搭建刘豪东-->
<!--*日期：2022年9月9日-->
<!--**/-->
<template>
  <Breadcrumb>
    <!--头部新增删除按钮-->
    <template slot="breadcrumbButton">
      <!-- 导出规则：表格有选中项优先导出选中项，无选中项按查询条件导出，查询条件为空时导出全部 -->
      <div slot="extra">
        <pe-button
                :include="[
            { value: 'Delete', clickName: 'headDelete' },
          ]"
                @headDelete="headDelete"
        ></pe-button>
      </div>
      <ExportComponents
              url="/operationApplication/exportXls"
              :params="searchInfo"
      >
      </ExportComponents>
      <!--<button @click="importExcel">导出</button>-->
    </template>
    <template slot="appMain">
      <div class="search-content">
        <a-form-model v-model="form">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="作业许可编号:"
              >
                <a-input placeholder="请输入" v-model="searchInfo.id"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="作业类型:"
              >
                <a-select
                  allowClear
                  placeholder="请输入作业类型"
                  v-model="searchInfo.operationTypeCode"
                >
                  <a-select-option
                    v-for="(province, index) in dictSelect"
                    :key="index"
                    :value="province.dictcode"
                  >
                    {{ province.dictname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="JSA编号:"
              >
                <a-input
                  placeholder="请输入JSA编号"
                  v-model="searchInfo.jsacoding"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="作业单位:"
              >
                <a-select
                  allowClear
                  placeholder="请选择作业单位"
                  ref="select"
                  @change="selectChange1"
                  v-model="searchInfo.workUnit"
                >
                  <a-select-option
                    v-for="(item, index) in JSASelect"
                    :key="index"
                    :value="item.OutsourceCompanyCode"
                  >
                    {{ item.OutsourceCompanyName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="作业地点:"
              >
                <a-input
                  placeholder="请输入作业地点"
                  v-model="searchInfo.workPlace"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="申请时间:"
              >
                <a-range-picker
                  allowClear
                  v-model="searchInfo.dataTimes"
                  style="width: 100%;padding: 0"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  @change="onChange"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="作业负责人:"
              >
                <a-input
                  placeholder="请输入作业负责人"
                  v-model="searchInfo.personInCharge"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="监护人:"
              >
                <a-input
                  placeholder="请输入监护人"
                  v-model="searchInfo.guardian"
                ></a-input>
              </a-form-model-item>
            </a-col>
              <a-col :span="6">
                  <a-form-model-item
                          :labelCol="{ style: 'width: 150px' }"
                          placeholder="请输入"
                          label="状态:"
                  >
                      <a-select
                              allowClear
                              placeholder="请选择状态"
                              v-model="searchInfo.recordStatus"
                      >
                          <a-select-option
                                  v-for="(province, index) in recordStatus"
                                  :key="index"
                                  :value="province.value"
                          >
                              {{ province.label }}
                          </a-select-option>
                      </a-select>
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
      <dc-table
        :scroll="{ x: 100 }"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
        @change="paginationChange"
        :row-key="(record) => record.id"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
        <template slot="recordStatus" slot-scope="row, text">
          {{ row | recordStatus }}
        </template>
        <template slot="operation" slot-scope="row, text">
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
                value: 'close',
                type: 'link',
                name: '关闭',
                clickName: 'close',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'cancel',
                type: 'link',
                name: '取消',
                clickName: 'cancel',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'View',
                name: '详情',
                type: 'link',
                clickName: 'checkListClick',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @editListClick="upDateListDetail(row, 'updata')"
            @close="closeApply(text, 'close')"
            @cancel="closeApply(text, 'closeApply')"
            @checkListClick="upDateListDetail(row, 'query')"
          ></pe-button>
        </template>
      </dc-table>
      <div v-if="visible">
        <dc-Model v-model="visible" :modelConfig="modelConfig" class="DcModel">
          <workLicenseForm
            @clear="clear"
            v-if="dataForm.type == 'updata' || dataForm.type == 'add'"
            :dataForm="dataForm.body"
          ></workLicenseForm>
          <infoDetail
            v-if="dataForm.type == 'query'"
            :dataForm="dataForm.body"
          ></infoDetail>
        </dc-Model>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
    // 记录状态已保存 - 1、
    // 已提交 - 2、
    // 审批中 - 3、
    // 已审批 - 4、
    // 已拒绝 - 5、
    // 已关闭 - 6、
    // 已取消 - 7、
    // 关闭已提交 - 8、
    // 关闭审批中 - 9、
    // 包含4和8和9 - 10、
    // 包含2和3 - 11
import {
  getList,
  getJsonByCode,
  getdict,
  closeApply,
  addGltj,
  getTZListForPage,
  deleteForTZ
} from '@/api/workLicense'
import workLicenseForm from './workLicenseForm.vue'
import infoDetail from './components/infoDetail.vue'
import { message } from 'ant-design-vue'
import components from '../../../../utils/components'
import {companySelect} from "@/api/JSAAnalysis"
export default {
  components: {
    workLicenseForm: workLicenseForm,
    infoDetail: infoDetail,
  },
  filters: {
    recordStatus(val) {
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
            case '6':
                return '已关闭'
            case '7':
                return '已取消'
            case '8':
                return '关闭已提交'
            case '9':
                return '关闭审批中'

        }
    },
  },
  data() {
    return {
      recordStatus:[
          {value:1,label:'已保存'},
          {value:2,label:'已提交'},
          {value:3,label:'审批中'},
          {value:4,label:'已审批'},
          {value:5,label:'已拒绝'},
          {value:6,label:'已关闭'},
          {value:7,label:'已取消'},
          {value:8,label:'关闭已提交'},
          {value:9,label:'关闭审批中'},
          ],
      endOpen: false,
      subData: {},
      dictSelect: [], //作业类别
      JSASelect: [], //申请单位
      dataForm: {},
      selectData: [],
      value1: '',
      dateilInfo: {},
      workLocationSelect: [], //作业位置数组
      searchInfo: {
        pageIndex: 1,
        pageSize: 10,
        id: '', //作业许可编号
        jsacoding: '', // jsa
        workUnit: "", //作业单位
        workPlace: '', //作业地点
        workContent: '', //作业内容
        applicant: '', //申请单位
        createdDateTime: '', //申请时间
        operator: '', //作业人员
        personInCharge: '', //作业负责人
        guardian: '', // 监护人
        recordStatus:"",//状态
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
      form: {},
      visible: false,
      modelConfig: {
        width: '1000px',
        title: '作业许可证',
        cancelText: false,
        footer: '', //是否展示页脚
      },
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
            label: '设备编码', //展示名称
            colSpan: 12,
            formKey: 'equipmentCode', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入设备名称',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'select', //组件类型 目前指出 input || select
            label: '设备润滑类型', //展示名称
            formKey: 'deviceLubricationType', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入检修计划编码', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            colSpan: 12,
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请选择设备类型',
                trigger: 'blur',
              }, //校验规
            },
            optionData: [],
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '设备名称', //展示名称
            colSpan: 12,
            formKey: 'deviceName', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入设备名称',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '设备位号', //展示名称
            colSpan: 12,
            formKey: 'equipmentNo', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入设备位号',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑点', //展示名称
            colSpan: 12,
            formKey: 'lubricationPoint', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑点',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑规则', //展示名称
            colSpan: 12,
            formKey: 'lubricationRule', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑规则',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '加换油周期', //展示名称
            colSpan: 12,
            formKey: 'lubricationCycle', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请选择加换油周期',
                trigger: 'change',
              }, //校验规
            },
            optionData: [
              { label: '1个月', value: '1个月' },
              { label: '3个月', value: '3个月' },
              { label: '6个月', value: '6个月' },
            ],
          },
          {
            type: 'datePicker', //组件类型 目前指出 input || select
            label: '本次时间', //展示名称
            colSpan: 12,
            format: 'YYYY-MM-DD',
            formKey: 'lastLubricationDateTime', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '本次油品', //展示名称
            colSpan: 12,
            formKey: 'lastRefuelingBrand', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
        ],
      },
      columns: [
            {
                title: '序号',
                fixed: 'left',
                customRender: (text, record, index) =>
                    `${
                    (this.pagination.current - 1) * this.pagination.pageSize +
                    index +
                    1
                        }`,
                width: 75,
            },
            {
                fixed: 'left',
                title: '作业许可编号',
                dataIndex: 'id',
                width: 150,
            },
            {
                title: '作业类型',
                dataIndex: 'operationTypeName',
                width: 150,
            },
            {
                title: '作业内容',
                dataIndex: 'workContent',
                width: 150,
            },
            {
                title: 'JSA编号',
                dataIndex: 'jsacoding',
                width: 150,
            },
            {
                title: '作业单位',
                dataIndex: 'workUnit',
                width: 150,
            },
            {
                title: '作业地点',
                dataIndex: 'workPlace',
                width: 150,
            },
            {
                title: '属地单位',
                dataIndex: 'territoryUnit',
                width: 150,
            },

            {
                title: '申请时间',
                dataIndex: 'createdDateTime',
                width: 150,
            },

            {
                title: '作业负责人',
                dataIndex: 'personInCharge',
                width: 200,
            },
            {
                title: ' 监护人',
                dataIndex: 'guardian',
                width: 200,
            },
            {
                fixed: 'right',
                title: ' 状态 ',
                dataIndex: 'recordStatus',
                scopedSlots: { customRender: 'recordStatus' },
                width: 80,
            },
            {
                fixed: 'right',
                title: '操作',
                width: 175,
                scopedSlots: { customRender: 'operation' },
            },
    ],
      selectedRowKeys: [],
      dataSource: [
        {
          key: '1',
          equipmentName: 1,
        },
      ],
    }
  },

  mounted() {
    this.getList()
    this.getJasList()
    // this.getSelectList();
  },

  created() {
    this.getdict()
  },

  methods: {
    importExcel(){
        exportXls(this.searchInfo).then((res)=>{
            console.log(res);
        })
    },
    onChange(val) {
      if (val) {
        this.searchInfo.startTime = val[0]
        this.searchInfo.endTime = val[1]
      } else {
        this.searchInfo.startTime = ''
        this.searchInfo.endTime = ''
      }
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    disabledEndDate(endValue) {
      const startValue = this.subData.createdDateTime
      if (!endValue || !startValue) {
        return false
      }
      var datas = new Date(startValue)
      return new Date(startValue).valueOf() - 86400000 >= endValue.valueOf()
    },
    handleEndOpenChange(open) {
      if (
        new Date(open) - new Date(this.subData.createdDateTime).valueOf() >
        3600 * 8
      ) {
        this.subData.closeDate = this.timestampToTime(
          new Date(this.subData.createdDateTime).valueOf() + 3600 * 8
        )
      }
    },
    handleEndOpenChange1(open) {
      if (
        new Date(open) - new Date(this.subData.createdDateTime).valueOf() >
        3600 * 8
      ) {
        this.subData.cancelDate = this.timestampToTime(
          new Date(this.subData.createdDateTime).valueOf() + 3600 * 8
        )
      }
    },
    selectChange1(val) {
      console.log(this.JSASelect)
      this.searchInfo.workUnit = this.JSASelect[val].workUnit
      console.log(this.searchInfo)
    },
    //表格列表多选框选择
    onSelectChange(key) {
      this.selectedRowKeys = key
      console.log(this.selectedRowKeys)
    },
    //新增列表
    libraryDataAdd() {
      this.dataForm.type = 'add'
      this.dataForm.body = null
      this.visible = true
      this.modelConfig.title = '作业许可证'
    },
    //关联提交
    gltjAdd() {
      addGltj(this.selectedRowKeys).then((res) => {
        if (res.code == '200') {
          message.success('关联成功')
        }
        console.log(res)
      })
    },
    //删除方法
    headDelete(){
        deleteForTZ(this.selectedRowKeys).then(res=>{
            if (res.code == '200') {
                message.success(res.msg)
                this.getList()
                this.selectedRowKeys=[];
            }else{
                message.warning(res.msg)
                this.getList()
                this.selectedRowKeys=[];
            }
        })
  },
    //分页查询
    select() {
      this.searchInfo.pageIndex = 1
      this.searchInfo.pageSize = 10
      console.log(this.searchInfo, 'form')
      this.getList()
    },

    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageNum = pagination.current
      this.searchInfo.pageSize = pagination.pageSize
      this.getList()
    },

    // 弹出框取消
    cancelClick() {
      console.log(333)
      this.visible = false
    },
    //保存修改成功关闭弹出框
    clear() {
      this.visible = false
      this.getList()
    },
    //点击编辑
    upDateListDetail(val, type) {
      this.modelConfig.title = '作业许可证'
      this.dataForm.body = null
      this.dataForm = {}
      this.dataForm.type = type
      getJsonByCode({ strCode: val.id }).then((res) => {
        this.dataForm.body = res.body
        this.visible = true
      })
    },
    //保存详情
    saveList(val) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          val.id = this.dateilInfo.id
          upDateList(val).then((res) => {
            console.log(res)
            if (res.code == '200') {
              message.success('修改成功')
              this.getList()
              this.visible = false
            }
          })
        }
      })
    },

    //获取表格列表
    getList() {
      getTZListForPage(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
        this.dataSource = res.body.data
        this.pagination.total = res.body.total
      })
    },

    //获取下拉框列表
    getSelectList() {
      let selectArray = new Array()
      getSelectList({ pageIndex: 1, pageSize: 30 }).then((res) => {
        res.body.forEach((item) => {
          selectArray.push({
            label: item,
            value: item,
          })
        })
        this.selectData = selectArray
        this.Config.formDataList[0].optionData = selectArray
      })
    },

    //重置表单输入框
    resetForm() {
      (this.searchInfo = {
        pageNum: 1,
        pageSize: 10,
        id: '', //作业许可编号
        jsaid: '', // jsa
        workUnit: undefined, //作业单位
        workPlace: '', //作业地点
        operationTypeName: '', //作业类型
        applicant: '', //申请单位
        createdDateTime: '', //申请时间
        operator: '', //作业人员
        personInCharge: '', //作业负责人
        guardian: '', // 监护人
        startTime: '',
        endTime: '',
        dataTimes: null,
        recordStatus:'',//状态
      }),
        this.getList()
    },
    //获取字典表作业类型
    getdict() {
      getdict().then((res) => {
        this.dictSelect = res.body.data
      })
    },
    //获取JAS下拉框列表
    getJasList() {
      companySelect({}).then((res) => {
          console.log(res);
        this.JSASelect = res.body
        console.log(this.JSASelect)
      })
    },
    closeApply(val, type) {
      this.$message.warning('请在移动端操作')

      // this.modelConfig.title = type == 'close' ? '关闭作业' : '取消作业'
      // this.subData = val
      // this.subData.recordStatus = type == 'close' ? 6 : 7
      // this.dataForm.type = type
      // this.visible = true
    },
    addSub(val) {
      closeApply(this.subData).then((res) => {
        console.log(res)
        if (res.code == '200') {
          message.success('修改成功')
          this.visible = false
          this.getList()
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
