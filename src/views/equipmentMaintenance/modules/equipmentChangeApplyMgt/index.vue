<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'add' },
            { value: 'Delete', clickName: 'headDelete' },
          ]"
          @add="addMonth"
          @headDelete="deleteClick"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div style="position: relative" class="position-changeList">
        <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="状态:"
            >
              <a-select
                ref="select"
                v-model="searchField.recordStatus"
                placeholder="请选择"
                :options="recordStatusOptions"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in recordStatusOptions"
                  :key="item.id"
                  :value="item.value"
                  :label="item.label"
                >
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="变更类型:"
            >
              <a-select
                ref="select"
                v-model="searchField.changeType"
                placeholder="请选择"
                :options="changeTypeOptions"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  v-for="item in changeTypeOptions"
                  :key="item.id"
                  :value="item.value"
                  :label="item.label"
                >
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="变更名称:"
            >
              <a-input
                v-model="searchField.changeName"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-form-model-item>
            <a-button
              v-Query
              class="buttonType"
              type="primary"
              @click.stop="search"
            >
              查询
            </a-button>
            <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <dc-table
        :scroll="{ y: 1, x: 1900 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          columnWidth: 30,
        }"
        :pagination="pagination"
        :openSelector="false"
      >
        <template slot="recordStatus" slot-scope="text">
          {{ text | recordStatus }}
        </template>
        <template slot="changeType" slot-scope="text">
          {{ text | changeType }}
        </template>
        <template slot="upload" slot-scope="text, row">
          <a :href="`${url}${row.id}`">{{ row.attachment }}</a>
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'editMonth',
                icon: '',
                disabled: $audit.editDisabled(row.recordStatus),
                style: ['btn_link'],
              },
              {
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'Add',
                name: '派工',
                isPower: false,
                type: 'link',
                clickName: 'dispatch',
                icon: '',
                style: ['btn_link'],
                disabled:
                  $audit.dispatchDisabled(row.recordStatus) ||
                  $audit.dispatchUserId(row.createdUserID),
              },
              {
                value: 'View',
                name: '详情',
                isPower: false,
                type: 'link',
                clickName: 'viewJump',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @editMonth="editMonth(row)"
            @viewJump="viewJump(row, 'view', '设备变更-详情')"
            @dispatch="dispatch(row)"
            @approval="viewJump(row, 'edit', '设备变更-审批')"
          ></pe-button>
        </template>
      </dc-table>
      <formModel
        ref="formModel"
        :visible.sync="visible"
        :typeModel="typeModel"
      />
      <detailModel
        ref="detailModel"
        :visible.sync="detailVisible"
        :title="detailTitle"
        :typeModel="detailType"
      />
      <dispatchModel
        ref="dispatchModel"
        :visible.sync="dispatchVisible"
        :typeModel="{ page: 'equipment', type: 'edit' }"
      />
    </template>
  </Breadcrumb>
</template>
<script>
// import moment from 'moment'
import formModel from './components/formModel.vue'
import detailModel from './components/detailModel.vue'
import dispatchModel from './components/dispatchModel.vue'
import {
  getList,
  deleteData,
  editDispatData,
} from '@/api/equipmentMaintenance/equipmentChangeApplyMgt/equipmentChangeApplyMgt.js'
import utils from '@/utils/url'
import { encode } from '@/api/dataDictionary'
export default {
  components: { formModel, detailModel, dispatchModel },
  filters: {
    changeType(val) {
      let value = ''
      switch (val) {
        case '0':
          value = '仪表参数变更'
          break
        case '1':
          value = '仪表逻辑变更'
          break
        case '2':
          value = '设备技术改造变更'
          break
        case '3':
          value = '同类替换'
          break
        case '4':
          value = '其他变更'
          break

        default:
          break
      }
      return value
    },
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
    // alterationStatus(val){
    //   let value = ''
    //   switch (val) {
    //   case '1':
    //     value = '可变更'
    //     break
    //   case '2':
    //     value = '已变更'
    //     break
    //   case '3':
    //     value = '作业中'
    //     break
    //   default:
    //     break
    //   }
    //   return value
    // }
  },
  data() {
    return {
      userCode: this.$store.state.user.userCode,
      url: `${utils.baseURL}fileinfo/downloadFile?relatedId=`,
      // 表单弹窗控制
      visible: false,
      dispatchVisible: false,
      typeModel: { type: 'add', title: '设备变更-新增' },
      // 详情弹框控制
      detailVisible: false,
      detailTitle: '',
      detailType: '',
      // 状态下拉框
      recordStatusOptions: [
        {
          label: '已保存',
          value: '1',
        },
        {
          label: '已提交',
          value: '2',
        },
        {
          label: '审批中',
          value: '3',
        },
        {
          label: '已通过',
          value: '4',
        },
        {
          label: '已拒绝',
          value: '5',
        },
        {
          label: '作业中',
          value: '6',
        },
        {
          label: '已完成',
          value: '7',
        },
      ],
      // // 变更状态下拉框
      // alterationStatusOptions:[
      //   {
      //     label:'可变更',
      //     value:'1'
      //   },
      //   {
      //     label:'已变更',
      //     value:'2'
      //   },
      //   {
      //     label:'作业中',
      //     value:'3'
      //   }

      // ],
      // 变更类型下拉框
      changeTypeOptions: [
        {
          label: '仪表参数变更',
          value: '0',
        },
        {
          label: '仪表逻辑变更',
          value: '1',
        },
        {
          label: '设备技术改造变更',
          value: '2',
        },
        {
          label: '同类替换',
          value: '3',
        },
        {
          label: '其他变更',
          value: '4',
        },
      ],
      // 作业区域
      selectData: [],
      // 搜索字段
      searchField: {
        recordStatus: undefined,
        changeType: undefined,
        changeName: '',
      },
      selectedRowKeys: [],
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
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'recordStatus' },
        },
        {
          title: '变更编号',
          dataIndex: 'changeNo',
          align: 'center',
          width: 150,
        },
        {
          title: '变更类型',
          dataIndex: 'changeType',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'changeType' },
        },
        {
          title: '变更级别',
          dataIndex: 'changeLevel',
          align: 'center',
          width: 150,
        },
        {
          title: '变更名称',
          dataIndex: 'changeName',
          align: 'center',
          width: 150,
        },
        {
          title: '设备名称',
          dataIndex: 'eqm_sbmc',
          align: 'center',
          width: 150,
        },
        {
          title: '设备位号',
          dataIndex: 'eqm_sbwh',
          align: 'center',
          width: 150,
        },
        {
          title: '作业区域',
          dataIndex: 'workArea',
          align: 'center',
          width: 150,
          customRender: (text) =>
            (text = this.selectData.filter((obj) => text === obj.value)[0]
              ?.label),
        },
        {
          title: '相关附件',
          dataIndex: 'attachment',
          scopedSlots: { customRender: 'upload' },
          align: 'center',
          width: 150,
        },
        {
          title: '申请人',
          dataIndex: 'createdUser',
          ellipsis: true,
          align: 'center',
          width: 150,
        },
        {
          title: '申请日期',
          dataIndex: 'createdDateTime',
          ellipsis: true,
          align: 'center',
          width: 150,
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: 200,
        },
      ],
      dataSource: [],
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-changeList')
    },
    init() {
      this.encode()
      this.getList()
    },
    getList(pageNum = 1, pageSize = 10) {
      const data = {
        pageNum,
        pageSize,
        ...this.searchField,
      }
      getList(data).then((res) => {
        const { data, pageIndex, total, pageSize } = res.body
        this.dataSource = data || []
        this.pagination.current = pageIndex
        this.pagination.total = total
        this.pagination.pageSize = pageSize
      })
    },
    // 用编辑接口修改派工状态
    modifyDispatchStatus(id) {
      const data = {
        id,
        recordStatus: '6',
      }
      editDispatData(data).then(() => {
        this.getList()
      })
    },
    // 新增
    addMonth() {
      this.typeModel = { type: 'add', title: '设备变更-新增' }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formModel.handleOpen()
      })
    },
    // 编辑--申请visible，审批detailVisible
    editMonth(row) {
      this.typeModel = { type: 'edit', title: '设备变更-编辑' }
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formModel.handleOpen(row)
      })
    },
    // 审批/查看
    viewJump(row, type, title) {
      this.detailTitle = title
      this.detailType = type
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detailModel.handleOpen(row)
      })
    },
    // 列表选择
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus !== '1' && record.recordStatus !== '5',
        },
      }
    },
    // 搜索
    search() {
      this.getList()
    },
    // 页码改变的方法
    paginationChange(pagination) {
      this.pagination.pageNum = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getList(this.pagination.pageNum, this.pagination.pageSize)
    },
    //重置输入
    resetForm() {
      this.searchField = {
        approval: undefined,
        AlterationStatus: undefined,
        changeType: undefined,
        ChangeName: '',
      }
      this.getList()
    },
    // 删除
    deleteClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteData(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = []
            this.$message.success('删除成功')
            this.getList(1, this.pagination.pageSize)
          }
        })
      } else {
        this.$message.warning('请选择记录！')
      }
    },
    // 派工
    dispatch(row) {
      this.dispatchVisible = true
      this.$refs.dispatchModel.handleOpen(row)
    },
    // 数据字典-作业区域
    encode() {
      encode('AQYH-QYMC').then((res) => {
        this.selectData = []
        res.body.data.forEach((item) => {
          this.selectData.push({
            value: item.dictcode,
            label: item.dictname,
          })
        })
      })
    },
  },
}
</script>
<style scoped>
.ant-table-cell {
  white-space: nowrap;
}
</style>
