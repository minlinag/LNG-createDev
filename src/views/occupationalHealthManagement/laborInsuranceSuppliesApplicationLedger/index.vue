<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <pe-button
          :include="[
            { value: 'Delete', clickName: 'deleteListClick' },
            {
              value: 'exportComponent',
              isPower: false,
              url: '/LabourProtectionApplyLedger/exportExcel',
              params: {
                numbers: this.queryParams.numbers,
                startTime: this.queryParams.startTime,
                endTime: this.queryParams.endTime,
                application: this.queryParams.application,
                department:
                  this.queryParams.department == undefined
                    ? ''
                    : this.queryParams.department,
              },
            },
          ]"
          @deleteListClick="deleteListClick"
        ></pe-button>
      </template>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline">
                <a-col :span="4">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 80px' }"
                    label="编号"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.numbers"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    label="申请时间:"
                    :labelCol="{ style: 'width: 110px' }"
                  >
                    <a-range-picker
                      v-model="startDate"
                      valueFormat="YYYY-MM-DD"
                      @change="onTimeChange"
                      :placeholder="['开始日期', '结束日期']"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="申请人"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.application"
                    />
                  </a-form-model-item>
                </a-col>

                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="所属部门"
                    prop="department"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="queryParams.department"
                    >
                      <a-select-option
                        v-for="(item, index) in departmentOption"
                        :key="index"
                        :value="item.dictname"
                        >{{ item.dictname }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :span="4">
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
                    </a-button></a-form-model-item
                  ></a-col
                >
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
        <div>
          <a-table
            @change="paginationChange"
            :pagination="pagination"
            :columns="columns"
            :data-source="tableList"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            rowKey="id"
          >
            <template slot="operate" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'details',
                    name: '详情',
                    style: 'btn_link',
                    clickName: 'detailsClick',
                    icon: '',
                    type: 'link',
                  },
                  {
                    value: 'audit',
                    name: '审核',
                    style: 'btn_link',
                    clickName: 'auditClick',
                    icon: '',
                    type: 'link',
                    disabled: $audit.auditDisabled(row.toDoUserCode),
                  },
                ]"
                @auditClick="auditClick(row)"
                @detailsClick="detailsClick(row)"
              ></pe-button>
            </template>
          </a-table>
        </div>
      </template>
    </Breadcrumb>
    <application-form
      :form-title="formTitle"
      :form-data="formData"
      :hidden-visible="detailsVisible"
      @close="detailsClose"
      :is-audit="isAudit"
      @pass="passChange"
    ></application-form>
  </div>
</template>
<script>
import {
  labourProtectionApplyAudio,
  findAllList,
  queryByID,
  deleteBatch
} from '@/api/occupationalHealthManagement/laborInsuranceSuppliesApplicationLedger'
import applicationForm from '@/views/occupationalHealthManagement/components/applicationForm.vue'
import { encode } from '@/api/public.js'
export default {
  name: 'archiveDocuments',
  components: { applicationForm },
  data() {
    return {
      departmentOption: [],
      startDate: [],
      isAudit: false,
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
          width: 100,
        },
      ],
      queryParams: {
        numbers: "",
        startTime: "",
        endTime: "",
        application: "",
        department: undefined,
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
    }
  },
  watch: {},
  created() {
    this.getList()
    this.getEncode()
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
    onTimeChange(val) {
      if (val.length === 0) {
        this.queryParams.startTime = ""
        this.queryParams.endTime = ""
      } else {
        this.queryParams.startTime = val[0]
        this.queryParams.endTime = val[1]
      }
    },
    getEncode() {
      encode('LBSQ_SSBM').then((res) => {
        if (res.code == 200) {
          this.departmentOption = res.body.data
        }
      })
    },
    getList() {
      findAllList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableList = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    search() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getList()
    },
    resetForm() {
      this.queryParams = {
        numbers: "",
        startTime: "",
        endTime: "",
        application: "",
        department: undefined,
        pageNum: 1,
        pageSize: 10,
      }
      this.startDate = []
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getList()
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
    auditClick(row) {
      this.getQueryByID(row).then(() => {
        this.formTitle = '劳保用品申请-审核'
        this.isAudit = true
        this.detailsVisible = true
      })
    },
    detailsClick(row) {
      this.getQueryByID(row).then(() => {
        this.formTitle = '劳保用品申请-详情'
        this.detailsVisible = true
        this.isAudit = false
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
    passChange(val, callback) {
      labourProtectionApplyAudio(val).then((res) => {
        if (res.code == 200) {
          this.$message.success('完成审核')
          this.getList()
          callback(res)
        }
      })
    },
    addAndEditClose() {
      this.hiddenVisible = false
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
