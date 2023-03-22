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
      <div style="position: relative;" class="position-disList">
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
              label="设备名称:"
            >
              <a-input
                v-model="searchField.deviceName"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 120px' }"
              label="设备位号:"
            >
              <a-input
                v-model="searchField.deviceBitNum"
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
        :scroll="{ y: 1, x: 2500 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          columnWidth: 30,
        }"
      >
        <template slot="recordStatus" slot-scope="text">
          {{ text | recordStatus }}
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
                value: 'View',
                name: '派工',
                isPower: false,
                type: 'link',
                clickName: 'dispatch',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.dispatchDisabled(row.recordStatus) || $audit.dispatchUserId(row.createdUserId),
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
            @viewJump="
              viewJump(row, { page: 'dis', type: 'view' }, '设备拆除-详情')
            "
            @dispatch="dispatch(row)"
            @approval="
              viewJump(row, { page: 'dis', type: 'edit' }, '设备拆除-审批')
            "
          ></pe-button>
        </template>
      </dc-table>
      <formModel
        ref="formModel"
        :visible.sync="visible"
        :typeModel="typeModel"
        :title="title"
      />
      <detail-model
        ref="detailModel"
        :visible.sync="detailVisible"
        :title="detailTitle"
        :typeModel="detailTypeModel"
      />
      <dispatchModel
        ref="dispatchModel"
        :visible.sync="dispatchVisible"
        :typeModel="{ page: 'dis', type: 'edit' }"
        :title="'设备拆除-派工'"
      />
    </template>
  </Breadcrumb>
</template>
<script>
import formModel from './components/formModel.vue'
import detailModel from './components/detailModel.vue'
import dispatchModel from '@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/dispatchModel.vue'
import {
  getList,
  deleteData,
  dictList,
  editDispatData
} from '@/api/equipmentMaintenance/equipmentDismantleMgt/equipmentDismantleMgt.js'
import utils from "@/utils/url"
export default {
  name: 'equipmentDismantl',
  components: { formModel, detailModel, dispatchModel },
  filters: {
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
  },
  data() {
    return {
      userCode: this.$store.state.user.userCode,
      url: `${utils.baseURL}fileinfo/downloadFile?relatedId=`,
      // 添加弹窗控制
      visible: false,
      typeModel: { page: 'dis', type: 'add' },
      title: '',
      // 派工弹窗控制
      dispatchVisible: false,
      // 详情弹窗控制
      detailVisible: false,
      detailTypeModel: { page: 'dis', type: 'edit' },
      detailTitle: '',
      // 状态下拉框
      recordStatusOptions: [
        {
          label: '已保存',
          value: '1'
        },
        {
          label: '已提交',
          value: '2'
        },
        {
          label: '审批中',
          value: '3'
        },
        {
          label: '已通过',
          value: '4'
        },
        {
          label: '已拒绝',
          value: '5'
        },
        {
          label: '作业中',
          value: '6'
        },
        {
          label: '已完成',
          value: '7'
        }
      ],
      // 筛选字段
      searchField: {
        deviceName: '',
        deviceBitNum: '',
        useDept: undefined,
        dataTime: []
      },
      // 使用部门下拉框
      cdepartmentOptions: [],
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
          align: 'center',
        },
        {
          title: "状态",
          dataIndex: "recordStatus",
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'recordStatus' }

        },
        {
          title: "申请编号",
          dataIndex: "applyCode",
          width: 180,
          align: 'center',
        },
        {
          title: "设备名称",
          dataIndex: "deviceName",
          width: 150,
          align: 'center',

        },
        {
          title: "规格型号",
          dataIndex: "speModels",
          width: 150,
          align: 'center',

        },
        {
          title: "设备位号",
          dataIndex: "deviceBitNum",
          width: 150,
          align: 'center',

        },
        {
          title: "资产编号",
          dataIndex: "propertyCode",
          width: 150,
          align: 'center',

        },
        {
          title: "数量",
          dataIndex: "deviceNum",
          width: 150,
          align: 'center',

        },
        {
          title: "使用部门",
          dataIndex: "useDept",
          width: 150,
          align: 'center',
          customRender: (text, record, index) =>
            {
              return this.cdepartmentOptions.filter(item => item.id === text)[0]?.dictname
            }
        },
        {
          title: "存放位置",
          dataIndex: "savePlace",
          width: 150,
          align: 'center',

        },
        {
          title: "原值",
          dataIndex: "originalValue",
          width: 150,
          align: 'center',

        },
        {
          title: "累计折扣",
          dataIndex: "totalDeprecition",
          width: 150,
          align: 'center',

        },
        {
          title: "净值",
          dataIndex: "netWorth",
          width: 150,
          align: 'center',

        },
        {
          title: "预计使用年限",
          dataIndex: "predictUseYear",
          width: 150,
          align: 'center',

        },
        {
          title: "已用年限",
          dataIndex: "usedYear",
          width: 150,
          align: 'center',

        },
        {
          title: "相关附件",
          dataIndex: "attachment",
          scopedSlots: { customRender: "upload" },
          width: 150,
          align: 'center',
        },
        {
          title: "投用时间",
          dataIndex: "putUseTime",
          width: 150,
          align: 'center',

        },
        {
          title: "停用时间",
          dataIndex: "stopUseTime",
          width: 150,
          align: 'center',

        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: 'center',
          width: 200
        },
      ],
      dataSource: [],
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      selectedRowKeys: [],


    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 用编辑接口修改派工状态
    modifyDispatchStatus(id){
      const data = {
        id,
        recordStatus:'6'
      }
      editDispatData(data).then(()=>{
        this.getList()
      })
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer(){
      return document.querySelector('.position-disList')
    },
    init() {
      this.dictList()
      this.getList()
    },
    getList(pageNum = 1, pageSize = 10) {
      const data = {
        pageNum,
        pageSize,
        ...this.searchField
      }
      getList(data).then(res => {
        const { data, pageIndex, total, pageSize } = res.body
        this.dataSource = data || []
        this.pagination.current = pageIndex
        this.pagination.total = total
        this.pagination.pageSize = pageSize
      })
    },
    // 获取部门
    dictList(){
      dictList().then(res => {
        this.cdepartmentOptions = res.body.data
      })
    },
    // 搜索
    search() {
      this.getList()
    },
    // 重置
    resetForm() {
      this.searchField = {
        equipmentName: '',
        equipmentCode: '',
        department: undefined,
        dataTime: []
      }
      this.getList()
    },
    // 删除
    deleteClick() {
      if (this.selectedRowKeys.length>0){
        deleteData(this.selectedRowKeys).then(res => {
          if (res.code == 200) {
            this.selectedRowKeys = []
            this.$message.success('删除成功')
            this.getList(1, this.pagination.pageSize)
          }
        })
      }else {
        this.$message.warning("请选择记录！");
      }
    },
    // 页码改变调用
    paginationChange(pagination) {
      this.pagination.pageNum = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getList(this.pagination.pageNum, this.pagination.pageSize)
    },
    // 选择改变调用
    onSelectChange(key) {
      this.selectedRowKeys = key
      console.log(this.selectedRowKeys)
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.recordStatus !== '1' && record.recordStatus !== '5'
        }
      }
    },
    // 新增
    addMonth() {
      this.typeModel = { page: 'dis', type: 'add' }
      this.title = '新增设备拆除'
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formModel.handleOpen()
      })
    },
    // 编辑
    editMonth(row) {
      this.typeModel = { page: 'dis', type: 'edit' }
      this.title = '编辑设备拆除'
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formModel.handleOpen(row)
      })
    },
    // 审批/查看
    viewJump(row, type, title) {
      this.detailTitle = title
      this.detailTypeModel = type
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detailModel.handleOpen(row)
      })
    },
    // 派工
    dispatch(row) {
      this.dispatchVisible = true
      this.$nextTick(() => {
        this.$refs.dispatchModel.handleOpen(row)
      })
    }
  }
}
</script>
<style scoped>
.ant-table-cell {
  white-space: nowrap;
}
</style>