<!--/***-->
<!--*通知单界面搭建刘豪东-->
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
          @addNew="libraryDataAdd"
          @mydelete="deleteAll"
        ></pe-button>
      </div>
    </template>
    <!--内容搜索框-->
    <template slot="appMain">
      <div>
        <a-form-model>
          <a-row :gutter="24">
            <a-col :span="5">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="状态:"
              >
                <a-select
                  placeholder="请选择状态"
                  v-model="searchInfo.rselectData"
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
            <a-col :span="5">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="派工状态:"
              >
                <a-select
                  placeholder="请选择派工状态"
                  v-model="searchInfo.dispatchStatus"
                >
                  <a-select-option
                    allowClear
                    :value="item.value"
                    v-for="(item, index) in dispatchStatus"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="5">
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
            <a-col :span="5">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="设备位号:"
              >
                <a-input
                  placeholder="请输入设备名称"
                  v-model="searchInfo.deviceNo"
                ></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :span="4">
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
          columnWidth: 30,
        }"
        :scroll="{ x: 100 }"
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
                value: 'Dispatch',
                type: 'link',
                clickName: 'dispatchClick',
                icon: '',
                name: '派工',
                disabled: row.recordStatus != '1' || row.dispatchStatus != '1',
                style: ['btn_link'],
              },
              {
                value: 'operationPlan',
                type: 'link',
                clickName: 'operationPlanClick',
                icon: '',
                name: '作业计划',
                disabled: row.recordStatus != '1' || row.dispatchStatus != '2',
                style: ['btn_link'],
              },
              {
                value: 'VERIFY',
                type: 'link',
                disabled: row.recordStatus != '2' || row.dispatchStatus != '2',
                clickName: 'approvalClick',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: 'toExamine',
                type: 'link',
                clickName: 'toExamineClick',
                icon: '',
                disabled: row.recordStatus != '4',
                name: '作业过程',
                style: ['btn_link'],
              },
              {
                value: 'checkAcceptance',
                type: 'link',
                clickName: 'checkAcceptanceClick',
                icon: '',
                disabled: row.recordStatus != '6' || row.dispatchStatus != '2',
                name: '验收',
                style: ['btn_link'],
              },
            ]"
            @dispatchClick="upDateListDetail(row, '通知', '通知单')"
            @operationPlanClick="upDateListDetail(row, '作业计划', '作业计划')"
            @approvalClick="upDateListDetail(row, '作业计划', '审批')"
            @toExamineClick="upDateListDetail(row, '作业过程', '作业过程 ')"
            @checkAcceptanceClick="
              upDateListDetail(row, '作业验收', '作业验收')
            "
          >
          </pe-button>
        </template>
      </a-table>
      <div v-if="visible">
        <!--弹出框-->
        <dc-Model v-model="visible" :modelConfig="modelConfig" class="DcModel">
          <a-layout>
            <a-layout-content>
              <dispatchingDetail
                ref="dispatchingDetail"
                v-if="visibleType == '通知' || visibleType == '新增'"
                :measuresForm="measuresForm"
                @openList="openList"
              ></dispatchingDetail>
              <div v-if="visibleType == '作业计划' || visibleType == '审批'">
                <div class="tabs-content">
                  <div
                    @click="listClick('新增通知单')"
                    :class="{ bd_color: activeKey == '新增通知单' }"
                  >
                    通知单
                  </div>
                  <div
                    @click="listClick('作业计划')"
                    :class="{ bd_color: activeKey == '作业计划' }"
                  >
                    {{ modelConfig.title }}
                  </div>
                </div>
                <dispatchingDetail
                  ref="dispatchingDetail"
                  v-if="activeKey == '新增通知单'"
                  :measuresForm="activeForm"
                  @openList="openList"
                ></dispatchingDetail>
                <dispatchingDetailTable
                  v-if="activeKey == '作业计划'"
                  ref="dispatchingDetail"
                  :measuresForm="measuresForm"
                  :measuresTable="bjTable"
                  :spareParts="spareParts"
                ></dispatchingDetailTable>
              </div>

              <checkBeforeAcceptance
                @clear="clearClick"
                :checkBeforeAcceptance="checkBeforeAcceptance"
                v-if="visibleType == '作业验收' && visible"
              ></checkBeforeAcceptance>
              <workProcess
                ref="workProcess"
                v-if="visibleType == '作业过程' && visible"
                :measuresForm="dataForm"
                :actualSpareParts="actualSpareParts"
              ></workProcess>
              <stepsModel
                ref="stepsModel"
                v-if="
                  modelConfig.title != '新增通知单' &&
                  modelConfig.title != '通知单' &&
                  modelConfig.title != '作业计划'
                "
                :isShow="visibleType == '审批' ? true : false"
                :id="dataForm.id"
              />
            </a-layout-content>
          </a-layout>
          <div
            class="footer contneFormBtnStyle ant-modal-footer"
            v-if="visibleType == '审批'"
            style="margin-top: 20px"
          >
            <a-button @click="cancelClick">返回</a-button>
            <a-button type="primary" @click="approvalOk">确定</a-button>
          </div>

          <div
            style="text-align: center"
            class="contneFormBtnStyle ant-modal-footer"
            v-if="visibleType !== '审批' && visibleType !== '作业验收'"
          >
            <a-button type="primary" @click.stop="addList">
              {{ modelConfig.title == '通知单' ? '派工' : '保存' }}
            </a-button>
            <a-button
              type="primary"
              @click.stop="submit"
              v-if="visibleType == '通知' && modelConfig.title != '通知单'"
            >
              提交
            </a-button>

            <a-button @click.stop="cancelClick"> 取消</a-button>
          </div>
          <infoList
            @selectedClic="infoList"
            ref="equipmentModel"
            :equipmentVisible.sync="visibleChilder"
          ></infoList>
        </dc-Model>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import stepsModel from '@/views/dispatching/components/stepsModel.vue'
import {
  getList,
  getFormList,
  addList,
  updataList,
  addDispatch,
} from '@/api/dispatching/dispatching'
import {
  getListPage, //查询通知单列表
  addListForPage, //添加通知单列表
  upDateistForPage, //修改通知单列表
  updateJsonWithAtt, //修改通知单列表
  deleteList,
  noticeSubmit,
  noticeAudio,
  updateWithAtt,
  noticeYsSubmit,
} from '@/api/dispatching/noticeDocuments'
import { getdict } from '@/api/temporaryOverhaulplan'
import { queryPageListForUnClass } from '@/api/PublicInterface' //设备台账设备列表
import { timestampToTime } from '@/utils/tableFun'
import dispatchingDetail from '@/views/dispatching/modules/dispatchingDetail/dispatchingDetail'
import dispatchingDetailTable from '@/views/dispatching/modules/dispatchingDetail/dispatchingDetailTable'
import checkBeforeAcceptance from '@/views/dispatching/modules/dispatchingDetail/checkBeforeAcceptance'
import workProcess from '@/views/dispatching/modules/dispatchingDetail/workProcess'
import { message } from 'ant-design-vue'
import { getListForPage } from '@/api/outsourceCompany'
import infoList from '@/views/equipmentMaintenance/modules/faultyMaintenanceMgt/modules/components/equipmentModel'
import { defineComponent, ref } from 'vue'
export default {
  components: {
    dispatchingDetail,
    dispatchingDetailTable,
    checkBeforeAcceptance,
    workProcess,
    infoList,
    stepsModel,
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
        case '6':
          return '验收已提交'
        case '7':
          return '验收审批中'
        case '8':
          return '验收已审批'
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
        case '':
          return '未派工'
      }
    },
  },
  data() {
    return {
      activeKey: '新增通知单',
      activeForm: [],
      checkBeforeAcceptance: {},
      visibleChilder: false, //控制子级
      modelConfigChilder: {
        width: '950px',
        title: '设备列表',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      dataForm: {},
      visibleType: null,
      measuresForm: [], //申请单数组
      spareParts: [],
      actualSpareParts: [],
      measuresTable: [], //申请单数组
      selectData: [
        { label: '已保存', value: 1 },
        { label: '已提交', value: 2 },
        { label: '审批中', value: 3 },
        { label: '已审批', value: 4 },
        { label: '已拒绝', value: 5 },
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
      bjTable: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '备件名称',
          dataIndex: 'sparePartName',
          scopedSlots: { customRender: 'sparePartName' },
          type: 'text',
          data: [],
          vaule: '',
        },
        {
          title: '物资编码',
          dataIndex: 'materialCode',
          scopedSlots: { customRender: 'materialCode' },
          type: 'text',
          vaule: '',
        },
        {
          title: '规格/型号',
          dataIndex: 'specificationOrMaterial',
          scopedSlots: { customRender: 'specificationOrMaterial' },
          type: 'text',
          vaule: '',
        },
        {
          title: '数量',
          dataIndex: 'existingNumber',
          scopedSlots: { customRender: 'existingNumber' },
          type: 'input',
          vaule: '',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
          type: 'text',
          vaule: '',
        },
        {
          fixed: 'right',
          title: '操作',
          width: 100,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      modelConfig: {
        width: '950px',
        title: '申请单',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      columns: [
        {
          title: '序号',
          width: 70,
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
        },
        {
          title: '状态',
          dataIndex: 'recordStatus',
          scopedSlots: { customRender: 'status' },
          width: 120,
        },
        {
          title: '派工状态',
          dataIndex: 'dispatchStatus',
          scopedSlots: { customRender: 'disStatus' },
          width: 100,
          align: 'center',
        },
        {
          title: '工单编号',
          dataIndex: 'id',
          width: 130,
          align: 'center',
        },
        {
          title: '申请编号',
          dataIndex: 'relevancyRequisition',
          width: 130,
          align: 'center',
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 100,
          align: 'center',
        },
        {
          title: '设备位号',
          dataIndex: 'deviceCode',
          width: 100,
          align: 'center',
        },
        {
          title: ' 作业区域',
          dataIndex: 'workArea',
          width: 100,
          align: 'center',
        },
        {
          title: '是否具备检维修条件',
          dataIndex: 'whetherHaveInspectionRule',
          scopedSlots: { customRender: 'condition' },

          align: 'center',
          width: 180,
        },
        {
          title: ' 申请日期',
          dataIndex: 'createdDateTime',
          width: 100,
          align: 'center',
        },
        {
          fixed: 'right',
          title: '操作',
          width: 240,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      visible: false,
      dataSource: [],
      selectedRowKeys: [],
    }
  },

  mounted() {},

  created() {
    this.getList()
    this.getListForPage()
  },

  methods: {
    listClick(val) {
      this.activeKey = val
    },
    clearClick() {
      this.visible = false
      this.getList()
    },
    approvalOk() {
      const data = {
        id: this.dataForm.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      }
      noticeAudio(data)
        .then(() => {
          this.visible = false
          this.getList()
        })
        .catch(() => {})
    },
    //弹出框子组件传值父组件
    infoList(val) {
      this.$refs.dispatchingDetail._data.measuresObj['deviceName'] =
        val.eqm_sbmc ? val.eqm_sbmc : ''
      this.$refs.dispatchingDetail._data.measuresObj['deviceCode'] =
        val.eqm_sbwh ? val.eqm_sbwh : ''
      this.$refs.dispatchingDetail._data.measuresObj['deviceNo'] = val.eqm_sbbm
        ? val.eqm_sbbm
        : ''
      this.visibleChilder = false
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
    //分页查询
    select() {
      this.searchInfo.pageNum = 1
      this.searchInfo.pageSize = 10
      this.getList()
    },
    // 新增打开弹出框方法
    libraryDataAdd() {
      this.modelConfig.title = '新增通知单'
      this.visible = true
      this.visibleType = '新增'
      this.getmeasuresForm('通知')
      this.dataForm = {}
    },
    //列表编辑方法
    upDateListDetail(val, type, titleType) {
      this.modelConfig.title = titleType
      this.getmeasuresForm(type, val)
      this.dataForm = val
      this.visibleType = titleType == '审批' ? titleType : type
      console.log(this.visibleType)
      if (type == '作业计划') {
        this.spareParts = val.spareParts
      }
      if (type == '作业过程') {
        this.actualSpareParts = val.actualSpareParts
      }
      if (titleType == '作业验收') {
        this.checkBeforeAcceptance = val
      }
      this.visible = true
    },

    submit() {
      noticeSubmit({ id: this.dataForm.id }).then((res) => {
        console.log(res)
        this.visible = false
        this.getList()
        message.success('提交成功')
      })
    },
    submit1() {
      noticeYsSubmit({ id: this.dataForm.id }).then((res) => {
        this.visible = false
        this.getList()
        message.success('提交成功')
      })
    },
    //验收审批
    ysOk() {
      noticeYsAudio({ id: val.id }).then((res) => {
        console.log(res)
      })
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

    //动态获取Form数据
    getmeasuresForm(type, value) {
      this.measuresForm = getFormList(type)
      let dict = []
      getdict({}).then((res) => {
        res.body.data.forEach((item) => {
          dict.push({ value: item.id, label: item.dictname })
        })
        let dataBox = []
        this.selectForPage.forEach((item) => {
          dataBox.push({
            label: item.outsourceCompany,
            value: item.outsourceCompany,
          })
        })
        this.measuresForm.forEach((item) => {
          if (this.modelConfig.title == '审批') {
            item.isTrue = false
          }
          if (value) {
            item.value = value[item.labelKey]
          }
          if (item.labelKey == 'workArea') {
            item.data = dict
          }
          if (item.labelKey == 'workUnit') {
            item.data = dataBox
          }
        })
        if (type == '作业计划') {
          let activeForm = getFormList('通知')
          activeForm.forEach((item) => {
            item.isTrue = false
            if (value) {
              item.value = value[item.labelKey]
            }
            if (item.labelKey == 'workArea') {
              item.data = dict
            }
            if (item.labelKey == 'workUnit') {
              item.data = dataBox
            }
          })
          this.activeForm = activeForm
        }
      })
    },
    //获取表格列表
    getList(val) {
      getListPage(this.searchInfo).then((res) => {
        if (res.code == '200') {
          this.pagination.current = res.body.pageIndex
          this.pagination.pageSize = res.body.pageSize
          this.dataSource = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    getListForPage() {
      getListForPage({
        pageSize: 99999,
        pageNum: 1,
        outsourceCompany: '',
        startDate: [],
        startTime: '',
        endTime: '',
        status: undefined,
      }).then((res) => {
        if (res.code == '200') {
          console.log(res)
          this.selectForPage = res.body.data
          this.getmeasuresForm('申请')
        }
      })
    },
    //重置表单输入框
    resetForm() {
      this.searchInfo = {
        pageNum: 1,
        pageSize: 10,
        deviceName: '', //设备名称
        deviceNo: '', //设备位号
        temMainPlanDescription: '', //设备备注
      }
      this.getList()
    },
    addList() {
      var requst = upDateistForPage
      var actualSpareParts = []
      var dataForm = new FormData()
      if (this.visibleType != '作业计划' && this.visibleType != '作业过程') {
        for (var i in this.$refs.dispatchingDetail._data.measuresObj) {
          this.dataForm[i] = this.$refs.dispatchingDetail._data.measuresObj[i]
        }
      }
      if (this.visibleType == '新增') {
        addDispatch(this.dataForm).then((res) => {
          if (res.code == '200') {
            this.getList()
            this.visible = false
          }
        })
      }
      if (this.visibleType == '作业计划') {
        requst = updateWithAtt
        this.measuresForm.forEach((item) => {
          this.dataForm[item.labelKey] = item.value
        })
        this.$refs.dispatchingDetail._data.tableSpareParts.forEach((item) => {
          item.noticeId = this.dataForm.id
          item.planFlg = 1
        })
        this.dataForm.spareParts =
          this.$refs.dispatchingDetail._data.tableSpareParts
        //
      } else if (this.visibleType == '作业过程' || this.visibleType == '通知') {
        requst = updateJsonWithAtt
        if (this.visibleType != '通知') {
          this.$refs.workProcess._data.tableSpareParts.forEach((item) => {
            item.noticeId = this.dataForm.id
            item.planFlg = 1
          })
        }

        if (this.visibleType == '通知') {
          this.dataForm.dispatchStatus = 2
        }
        if (this.visibleType != '通知') {
          this.dataForm.actualSpareParts =
            this.$refs.workProcess._data.tableSpareParts
        }
        var dataForms = JSON.stringify(this.dataForm)
        dataForm.append('strJson', dataForms)
        dataForm.append('xcjl', this.dataForm.xcjl)
        dataForm.append('wlqd', this.dataForm.wlqd)
        dataForm.append('ysbg', this.dataForm.ysbg)
      }
      if (
        this.dataForm.id ||
        this.visibleType == '作业过程' ||
        this.visibleType == '通知'
      ) {
        requst(this.visibleType == '作业计划' ? this.dataForm : dataForm).then(
          (res) => {
            if (res.code == '200') {
              if (this.visibleType == '作业计划') {
                this.submit()
              } else if (this.visibleType == '作业过程') {
                this.submit1()
              } else {
                this.getList()
                this.visible = false
              }
            }
          }
        )
      }
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
.tabs-content div {
  display: inline-block;
  padding: 12px 20px;
  cursor: pointer;
}
.bd_color {
  border-bottom: 2px solid #0a84ff;
}
.search-content {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
