<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <!-- 查询 -->
              <a-form-model layout="inline" :model="selectFrom">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备类型"
                  >
                    <a-select
                      v-model="selectFrom.eqmType"
                      show-search
                      placeholder="请选择"
                      option-filter-prop="children"
                      :options="eqmTypeOption"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备分类"
                  >
                    <template>
                      <a-tree-select
                        v-model="selectFrom.eqmClassify"
                        style="width: 100%"
                        :dropdown-style="{
                          maxHeight: '400px',
                          overflow: 'auto',
                        }"
                        placeholder="请选择"
                        allow-clear
                      >
                        <a-tree-select-node
                          :value="item.classificCode"
                          :title="item.classificName"
                          v-for="(item, index) in treeSelect"
                          :key="index"
                        >
                          <a-tree-select-node
                            :value="items.classificCode"
                            :title="items.classificName"
                            v-for="(items, indexs) in item.children"
                            :key="index + '-' + indexs"
                          >
                            <a-tree-select-node
                              :value="itemss.classificCode"
                              :title="itemss.classificName"
                              v-for="(itemss, indexss) in items.children"
                              :key="index + '-' + indexs + '-' + indexss"
                            />
                          </a-tree-select-node>
                        </a-tree-select-node>
                      </a-tree-select>
                    </template>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="申请日期"
                  >
                    <a-date-picker @change="onChange" />
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
        <div class="securityCheck">
          <dc-table
            rowKey="id"
            @change="paginationChange"
            :pagination="pagination"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              columnWidth: '30px',
            }"
            :scroll="{ x: 100 }"
            :columns="columns"
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
                    value: 'Submit',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'submit',
                    name: '审批',
                    disabled: $audit.auditDisabled(row.toDoUserCode),
                  },
                  {
                    value: 'View',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'view',
                    name: '详情',
                  },
                  {
                    value: 'Dispatch',
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'dispatch',
                    name: '派工',
                    disabled: $audit.dispatchDisabled(row.recordStatus),
                  },
                ]"
                @submit="submit(row, 'submitForm')"
                @view="submit(row, 'view')"
                @dispatch="submit(row, 'dispatching')"
              ></pe-button>
            </template>
          </dc-table>
        </div>
        <a-modal
          :title="modalTitle"
          :visible="submitVisible"
          :footer="null"
          @cancel="submitVisible = false"
          class="DcModel"
          width="950px"
        >
          <!-- 审批弹框 -->
          <submit-form
            v-if="typeModel === 'submitForm' || typeModel === 'view'"
            :submit-visible="submitVisible"
            @close="submitFormClose"
            :typeModel="typeModel"
            :tableModel="tableModel"
          >
          </submit-form>
        </a-modal>

        <dispatchModel
          ref="dispatchModel"
          v-if="typeModel == 'dispatching'"
          :visible.sync="dispatchVisible"
          :tableModel="tableModel"
          @close="submitFormClose"
          :typeModel="{ page: 'equipment', type: 'edit' }"
        />
        <!-- <stepsModel
        ref="stepsModel"
        :isShow="typeModel === 'applicationsSearch' ? false : true"
        :id="dispatchForm.temMainPlanNo"
        v-if="formType == 'applicationsSearch'"
      /> -->
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
// import stepsModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue'

// import stepsModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue'
import dispatchModel from '@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/dispatchModel.vue'
import {
  getTreeList, //获取树
} from '@/api/spareParts'
import submitForm from './components/addWaitVerifiedApproval.vue'
import dispatchingWait from './components/dispatchingWait'
import {
  getCondition,
  addVerification,
} from '@/api/equimentTestOrRulesMgt/waitVerifiedApproval/waitVerifiedApproval'
import { getdict } from '@/api/temporaryOverhaulplan'
import { getListForPage } from '@/api/outsourceCompany'
import { getFormList } from '@/api/dispatching/dispatching'
import { addVerification as addVer } from '@/api/dispatching/noticeDocuments'

// import dispatchingDetail from '@/views/dispatching/modules/dispatchingDetail/dispatchingDetail'
// import infoList from '@/views/dispatching/modules/dispatchingDetail/infoList'
export default {
  components: { submitForm, dispatchingWait, dispatchModel },
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
          return '已派工'
      }
    },
  },
  data() {
    return {
      dispatchVisible: false,
      modelConfigChilder: {
        width: '950px',
        title: '设备列表',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      selectForPage: [],
      measuresForm: [],
      modalTitle: '检定审批',
      visibleChilder: false,
      tableModel: {},
      eqmTypeOption: [
        {
          value: '特种设备及附件',
          label: '特种设备及附件',
        },
        {
          value: '仪表及计量器具',
          label: '仪表及计量器具',
        },
        {
          value: '其他',
          label: '其他',
        },
      ],
      typeModel: 'submitForm',
      labelCol: { span: 4 },
      submitVisible: false,
      selectFrom: {
        eqmCode: '',
        eqmClassify: '',
        eqmName: '',
        eqmNo: '',
        eqmType: '',
        pageNum: 1,
        pageSize: 10,
      },
      selectedRowKeys: [],
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
          title: '审批结果',
          dataIndex: 'recordStatus',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '申请编号',
          dataIndex: 'applicationFormNo',
        },
        {
          title: '紧急程度',
          dataIndex: 'urgencyDegree',
        },
        {
          title: '是否具备检维修条件',
          dataIndex: 'whetherCanCheckMaintenance',
          customRender: (value, row, index) => {
            return {
              children: value == 'Y' ? '是' : '否',
              attrs: { rowSpan: 1 },
            }
          },
        },
        {
          title: '申请人',
          dataIndex: 'createdUser',
        },
        {
          title: '申请时间',
          dataIndex: 'createdDateTime',
        },
        {
          title: '操作',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      treeSelect: [],
      dataSource: [],
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
    }
  },
  // 实例创建完成后调用
  created() {
    this.getCondition()
    // this.getListForPage()
  },
  // 实例被挂载后调用
  mounted() { },
  // methods 将被混入到 Vue 实例中
  methods: {
    getCondition() {
      getCondition(this.selectFrom).then((res) => {
        this.dataSource = res.body.data
      })
    },
    getTreeList() {
      getTreeList({ classificCode: '', classificName: '' }).then((res) => {
        this.treeSelect = res.body.data
      })
    },
    submitFormClose() {
      this.submitVisible = false
      this.getCondition()
    },
    //打开弹出框方法
    submit(value, type) {
      this.typeModel = type
      this.tableModel = value
      if (type == 'dispatching') {
        // addVer({
        //   deviceCode: value.eqmCode,
        //   id: value.id,
        // }).then((res) => {
        //   this.$message.success('派工成功')
        //   this.getCondition()
        // })
        this.dispatchVisible = true
        // this.$refs.dispatchModel.handleOpen(value)
      }
      if (type == 'submitForm' || type == 'view') {
        this.submitVisible = true
      }
    },
    //动态获取Form数据
    getmeasuresForm(type, value) {
      console.log(value)
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
          if (this.tableModel[item.labelKey]) {
            item.value = this.tableModel[item.labelKey]
          } else {
            item.value = 'null'
          }

          if (item.labelKey == 'workArea') {
            item.data = dict
          }
          if (item.labelKey == 'workUnit') {
            item.data = dataBox
          }
          if (item.labelKey == 'recordStatus') {
            item.value = 3
          }
        })
        console.log(this.measuresForm)
      })
    },
    //状态校验
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
          return '已派工'
        case '7':
          return '已关闭'
      }
    },
    //获取selectForPage
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
          this.selectForPage = res.body.data
          this.getmeasuresForm('检定通知')
        }
      })
    },
    //打开弹出框
    openList(val) {
      this.visibleChilder = true
    },
    //弹出框子组件传值父组件
    infoList(val) {
      // deviceName
      this.measuresForm.forEach((item) => {
        if (item.labelKey == 'deviceName') {
          item.value = val.eqm_sbmc ? val.eqm_sbmc : ''
        }
        if (item.labelKey == 'deviceNo') {
          item.value = val.eqm_sbwh ? val.eqm_sbwh : ''
        }
        this.visibleChilder = false
      })
    },
    // //派工创建通知单
    // submitClick() {
    //   console.log(this.$refs)
    //   console.log(this.$refs.modelFormObj._data.measuresObj)
    //   addVerification(this.$refs.modelFormObj._data.measuresObj).then((res) => {
    //     if (res.code == '200') {
    //     }
    //   })
    // },
    //弹出框取消
    cancelClick() { },
    addListClick() {
      this.addvisible = true
    },
    deleteListClick() { },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    paginationChange(pagination) { },
    search() {
      this.selectFrom.pageNum = 1
      this.selectFrom.pageSize = 10
      this.getCondition()
    },
    resetForm() {
      this.selectFrom = {
        eqmType: '',
        eqmClassify: '',
        djd: '',
        pageNum: 1,
        pageSize: 10,
      }
      this.getMonthDetailsList()
    },
    onChange(date, dateString) {
      console.log(date, dateString)
    },
  },
}
</script>
<style scoped lang="less"></style>
