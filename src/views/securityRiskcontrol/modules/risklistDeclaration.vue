<template>
  <!-- 风险清单申报页面 -->
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
        @mydelete="mydeleteList"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="名称："
                >
                  <a-input
                    v-model="form.declarationName"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>

              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="申报日期:"
                >
                  <a-range-picker
                    allowClear
                    v-model="form.dataTimes"
                    style="width: 100%"
                    show-time
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                  />
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
        }"
        :scroll="{ x: 100 }"
        :columns="columnsDub"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <!--recordStatus-->
        <template slot="recordStatus" slot-scope="row">
          {{ row | recordStatus }}
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
                value: 'VERIFY',
                type: 'link',
                clickName: 'approvalClick',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
            ]"
            @editListClick="editListClick(row)"
            @checkListClick="checkListClick(row, 'view', '风险清单申报-详情')"
            @approvalClick="checkListClick(row, 'edit', '风险清单申报-审批')"
          ></pe-button>
        </template>
      </dc-table>

      <!-- 新增表单 -->
      <a-modal
        :width="'1000px'"
        v-model="visible"
        :title="addNewModelConfig.title"
        :cancelText="false"
        :footer="''"
        :after-close="riskLibraryModelClose"
      >
        <a-form-model
          ref="riskLibraryRef"
          :model="riskLibraryForm"
          :rules="riskLibraryRules"
        >
       <a-row>
           <a-col :span="8">
            <a-form-model-item
              label="名称"
              prop="declarationName"
              style="margin-left: 10px"
               :labelCol="{ style: 'width: 60px !important' }"
            >
              <a-input
                :disabled="flag"
                v-model="riskLibraryForm.declarationName"
                placeholder="请输入"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item
              prop="declarationTime"
              label="申报日期"
              :labelCol="{ style: 'width: 140px !important' }"
            >
              <a-date-picker
                :disabled="flag"
                valueFormat="yyyy-MM-DD"
                v-model="riskLibraryForm.declarationTime"
                placeholder="请选择"
              />
            </a-form-model-item>
          </a-col>
       </a-row>

          <a-col :span="24">
            <div class="hidden_information_header">
              <div class="title">
                <p style="font-weight: 800">安全风险</p>
              </div>
              <div class="button_layout">
                <pe-button
                  :include="[
                    {
                      value: 'Add',
                      clickName: 'addNew',
                      disabled: flag,
                    },
                    {
                      value: 'Delete',
                      clickName: 'mydelete',
                      disabled: flag,
                    },
                  ]"
                  @addNew="addFxList"
                  @mydelete="mydelete"
                ></pe-button>
              </div>
            </div>
            <riskTable
              @selectedKey="selectedKey"
              :isClick="true"
              :dataForm="dataTableList"
              @getTableList="paginationPart"
            />
          </a-col>
          <a-col :span="24">
            <!-- <stepsModel
              ref="stepsModel"
              :objectData="{
                stepConfiguration,
                dataSourceApproval,
                isShow: typeModel === 'edit' ? true : false,
              }"
              :id="dataForm.id"
            /> -->
            <stepsModel ref="stepsModel" :isShow="typeModel === 'edit' ? true : false" :id="riskLibraryForm.id"/>
            <div class="footer contneFormBtnStyle ant-modal-footer" v-if="typeModel === 'edit'">
              <a-button @click="goback">返回</a-button>
              <a-button type="primary" @click="approvalOk">确定</a-button>
            </div>
          </a-col>
          <a-form-model-item class="footer contneFormBtnStyle ant-modal-footer" v-if="!flag">
            <a-button type="primary" @click="onRiskLibrarySubmit">
              保存
            </a-button>
            <a-button type="primary" @click="onRiskLibraryTj">提交</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <!-- 风险清单列表 -->
      <dc-Model v-model="fxVisible" :modelConfig="modelConfig" >
        <riskTable
          @close="callback"
          :dataForm="dataForm"
          :selectedKey="RiskInfoListForm.ids"
          @selectedKey="selectedFn"
          @getTableList="paginationChilder"
          @pagination="paginationChilder"
        />
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getRiskDeclaraList,
  getRiskInfoList,
  addList,
  delectList,
  // deleteRisk,
  saveSubmit,
  approval,
} from '@/api/risklistDeclaration'
import { getListForPage } from '@/api/securityRiskcontrol'
import riskTable from './components/riskTable.vue'
import { message } from 'ant-design-vue'
// import stepsModel from '@/views/dispatching/components/stepsModel.vue'
import stepsModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue'

export default {
  components: { riskTable, stepsModel },
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
      }
    },
  },
  data() {
    return {
      typeModel: 'view', // view详情，edit编辑
      //审批历史列表
      dataSourceApproval: [],
      // 审批进度
      stepConfiguration: {
        stepProgress: 4,
        stepList: [
          {
            title: '提出申请',
            name: '曲丽丽',
            dataTime: '2021-05-22 12:00',
          },
          {
            title: '部门评审',
            name: '曲丽丽',
            dataTime: '2021-05-22 12:00',
          },
          {
            title: '生产运营部评审',
            name: '曲丽丽',
            dataTime: '2021-05-22 12:00',
            children: [
              {
                title: '检维修中心评审',
                name: '曲丽丽',
                dataTime: '2021-05-22 12:00',
              },
            ],
          },
          {
            title: '生产技术部评审',
            name: '曲丽丽',
            dataTime: '2021-05-22 12:00',
            children: [
              {
                title: '质量安全部评审',
                name: '曲丽丽',
                dataTime: '2021-05-22 12:00',
              },
            ],
          },
          {
            title: '主管副总评审',
            name: '曲丽丽',
            dataTime: '2021-05-22 12:00',
          },
          {
            title: '完成',
          },
        ],
      },
      flag: true,
      dataTableList: {},
      dataTableKeys: [],
      stateInfo: [],
      dataForm: [], //新增数组
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
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'declarationName',
          width: 150,
          align: 'center',
        },
        {
          title: '申报日期',
          dataIndex: 'declarationTime',
          width: 150,
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'recordStatus',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: 'recordStatus' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 150,
          fixed: 'right',
        },
      ],
      //勾选框/选择框组件
      selectedRowKeys: [],
      //查询已选择数组数据
      RiskInfoListForm: {
        pageNum: 1,
        pageSize: 10,
        ids: [],
      },
      // 已选择  风险列表
      selKeys: [],
      //查看组件中的数值
      LookForm: {},
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageNum: 1,
        pageSize: 10,
        areaName: undefined, //区域名称
        unitName: '', //单元名称
        responsibleUnit: '', // 责任人
        responsibleUser: '', // 责任单位
      },
      formForPage: {
        pageNum: 1,
        pageSize: 10,
        areaName: undefined, //区域名称
        unitName: '', //单元名称
        responsibleUnit: '', // 责任人
        responsibleUser: '', // 责任单位
      },
      //查看是否visible
      visible: false,
      fxVisible: false,
      modelConfig: {
        width: '1000px',
        title: '风险清单申报',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: '1000x',
        title: '风险清单申报-新增',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      //查看的弹窗的相关设置
      lookModelConfig: {
        width: '1000px',
        title: '风险清单申报-查看',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      dataSource: [],
      //表格中的数据
      riskLibraryForm: {
        // areaName: undefined, // 名称
        // unitName: '', // 申报日期
        // state: '', //状态
      },
      riskLibraryRules: {
        declarationName: [
          { required: true, message: '名称不能为空', trigger: 'change' },
        ],
        declarationTime: [
          { required: true, message: '请选择申报日期', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    this.getRiskDeclaraList()
  },
  mounted() {},
  methods: {
    callback() {
      this.fxVisible = false
    },
    onChange(val) {
      if (val) {
        this.form.declarationStartTime = val[0]
        this.form.declarationEndTime = val[1]
      } else {
        this.form.declarationStartTime = ''
        this.form.declarationEndTime = ''
      }
    },
    // 审批弹框=》确认
    approvalOk() {
      // console.log(this.$refs.stepsModel.form.type)
      const data = {
        id: this.riskLibraryForm.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      }
      approval(data)
        .then(() => {
          this.visible = false
          this.getRiskDeclaraList()
        })
        .catch(() => {})
    },
    //获取列表
    getRiskDeclaraList() {
      getRiskDeclaraList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
        this.pagination.total = res.body.total
        this.dataSource = res.body.data
      })
    },
    // 新增风险列表
    onRiskLibrarySubmit() {
      this.$refs.riskLibraryRef.validate((valid) => {
        if (valid) {
          this.riskLibraryForm.riskIds = this.RiskInfoListForm.ids

          addList(this.riskLibraryForm).then((res) => {
            this.visible = false
            this.getRiskDeclaraList()
            message.success('新增成功')
          })
        }
      })
    },
    // 提交
    onRiskLibraryTj() {
      this.$refs.riskLibraryRef.validate((valid) => {
        if (valid) {
          this.riskLibraryForm.riskIds = this.RiskInfoListForm.ids
          saveSubmit(this.riskLibraryForm).then((res) => {
            console.log(res)
            this.visible = false
            this.getRiskDeclaraList()
            message.success('提交成功')
          })
        }
      })
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    // 打开新增弹出框
    libraryDataAdd() {
      this.flag = false
      this.typeModel = ''
      this.lookModelConfig.title = '安全风险管控-新增'
      this.selectedRowKeys = []
      this.dataTableList.data = []
      this.dataTableList.total = 0
      this.dataTableList.pageSize = 10
      this.dataTableList.pageIndex = 1
      this.visible = true
    },
    // 打开风险列表新增清单
    addFxList() {
      // 刘豪东修改
      // 新增调用获取列表
      this.getListForPage()
    },
    // 刘豪东新增的方法
    // 获取新增列表
    getListForPage() {
      getListForPage(this.formForPage).then((res) => {
        this.dataForm = res.body
        this.fxVisible = true
      })
    },
    // 已选择的风险列表
    // 刘豪东修改 通过获取的ID 调取后台接口获取选中的数据
    selectedFn(keyList) {
      this.fxVisible = false
      this.RiskInfoListForm.ids = keyList
      this.getRiskInfoList()
    },
    goback() {
      this.visible = false
    },
    //子组件选中的值暴漏给父组件
    selectedKey(val) {
      this.selKeys = val
    },
    //删除选项，根据选择的id删除对应数据
    mydelete() {
      //循环选中的值
      if (this.selKeys != '') {
        for (var i = 0; i < this.selKeys.length; i++) {
          // 循环列表的值
          for (var z = 0; z < this.RiskInfoListForm.ids.length; z++) {
            //比对两个值
            if (this.selKeys[i] == this.RiskInfoListForm.ids[z]) {
              //截取数组的值
              this.RiskInfoListForm.ids.splice(z, 1)
              break
            }
          }
        }
        this.getRiskInfoList()
      } else {
        this.$message.error('请至少选择一项！')
      }
    },
    mydeleteList() {
      delectList(this.selectedRowKeys).then((res) => {
        if (res.code == '200') {
          this.getRiskDeclaraList()
          message.success('删除成功')
        }
      })
    },
    //列表数据审批
    approvalClick(val) {
      console.log(val)
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      this.Delete()
    },
    //查询功能
    search() {
      if (this.form) {
        delete this.form.dataTimes
        this.form.pageNum = 1
        this.form.pageSize = 10
        this.getRiskDeclaraList()
      } else {
        this.getRiskDeclaraList()
      }
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current
      this.form.pageSize = pagination.pageSize
      this.getRiskDeclaraList()
    },
    riskLibraryModelClose() {
      this.riskLibraryFormInitial()
    },
    //列表详情编辑
    editListClick(row) {
      this.flag = false
      this.typeModel = ''
      this.addNewModelConfig.title = '风险清单申报-编辑'
      this.RiskInfoListForm.pageNum = 1
      this.RiskInfoListForm.pageSize = 10
      this.riskLibraryForm = row
      this.RiskInfoListForm.ids = row.riskIds
      // this.selKeys = row.riskIds
      this.getRiskInfoList()
    },
    checkListClick(row, type, title) {
      console.log(row)
      this.flag = true
      this.addNewModelConfig.title = title
      this.typeModel = type
      this.RiskInfoListForm.pageNum = 1
      this.RiskInfoListForm.pageSize = 10
      this.riskLibraryForm = row
      this.RiskInfoListForm.ids = row.riskIds
      // this.selKeys = row.riskIds
      this.getRiskInfoList()
      this.visible = true
    },
    //刘豪东修改部分通过接口获取订单信息
    getRiskInfoList() {
      getRiskInfoList(this.RiskInfoListForm).then((res) => {
        this.dataTableList = res.body
        this.visible = true
      })
    },

    riskLibraryFormInitial() {
      this.$refs.stepsModel.form.opinion = ''
      this.riskLibraryFormState = ''
      this.riskLibraryFormStatus = ''
      this.riskLibraryForm = {
        id:'',
        areaName: undefined, // 区域名称
        unitName: '', // 单元名称
        otherElse: '', // 作业活动/设备设施/工序/其他
        danger: '', // 危险因素或潜在事件
        Consequence: '', // 主要后果
        controlMeasures: '', // 现有控制措
        ll: undefined, // L(发生事故或事件的可能性)
        ee: undefined, // E(暴露于潜在危害环境的频繁程度)
        cc: undefined, // C(发生事故产生的后果)
        dd: '', // D = L x E x C:(风险评价值)
        riskRateLevel: '', // 风险评价等级
        riskCtrlLevel: '', // 风险管控等级
        newMeasures: '', // 建议新增（改进）措施
        responsibleUnit: '', // 责任单位
        responsibleUser: '', // 责任人
      }
    },
    //重置输入
    resetForm() {
      this.form = {}
      this.form.pageNum = 1
      this.form.pageSize = 10
      this.getRiskDeclaraList()
    },

    // 数据处理
    handleFormChange(name) {
      let newL = ''
      let newE = ''
      let newC = ''
      let calculateD = 0
      for (const key in this.riskLibraryForm) {
        if (Object.hasOwnProperty.call(this.riskLibraryForm, key)) {
          const element = this.riskLibraryForm[key]
          if (key === name) {
            this.riskLibraryForm[key] = this.riskLibraryForm[name]
          }
          if (key == 'll') {
            newL = element
          }
          if (key == 'ee') {
            newE = element
          }
          if (key == 'cc') {
            newC = element
          }
        }
      }
      calculateD = newL * newE * newC

      this.riskLibraryForm.dd = calculateD
      if (calculateD > 320) {
        this.riskLibraryForm.riskRateLevel = '重大风险'
        this.riskLibraryForm.riskCtrlLevel = '公司级管控'
      } else if (calculateD > 160) {
        this.riskLibraryForm.riskRateLevel = '较大风险'
        this.riskLibraryForm.riskCtrlLevel = '公司级管控'
      } else if (calculateD > 70) {
        this.riskLibraryForm.riskRateLevel = '一般风险'
        this.riskLibraryForm.riskCtrlLevel = '部室（中心）级管控'
      } else if (calculateD >= 0) {
        this.riskLibraryForm.riskRateLevel = '低风险'
        this.riskLibraryForm.riskCtrlLevel = '班组级管控'
      }
    },

    //分页点击数据分析 重新获取列表
    paginationChilder(pagination) {
      this.formForPage.pageNum = pagination.current
      this.formForPage.pageSize = pagination.pageSize
      this.getListForPage()
    },
    // 新增界面列表数据重新渲染
    paginationPart(pagination) {
      this.RiskInfoListForm.pageNum = pagination.current
      this.RiskInfoListForm.pageSize = pagination.pageSize
      this.getRiskInfoList()
    },
  },
}
</script>
<style scoped lang="less">
.hidden_information_header {
  margin-top: -10px;
  display: flex;
  justify-content: space-between;
}
</style>
