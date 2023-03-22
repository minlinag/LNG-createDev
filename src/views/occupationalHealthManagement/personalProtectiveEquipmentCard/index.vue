<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 80px' }"
                    label="姓名"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.personalName"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 80px' }"
                    label="编码"
                  >
                    <a-input placeholder="请输入" v-model="queryParams.code" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="部门"
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
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 80px' }"
                    label="班组"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.teamGroup"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 80px' }"
                    label="岗位工种"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.postWorkType"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    label="工种变更时间:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-range-picker
                      v-model="startDate"
                      valueFormat="YYYY-MM-DD"
                      @change="onTimeChange"
                      :placeholder="['开始日期', '结束日期']"
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
                    isPower: false,
                  },
                ]"
                @detailsClick="detailsClick(row)"
              ></pe-button>
            </template>
          </a-table>
        </div>
      </template>
    </Breadcrumb>
    <details-list
      :hidden-visible="detailsVisible"
      :form-data="formData"
      @close="detailsClose"
    ></details-list>
  </div>
</template>
<script>
import {
  findAllList,
  queryByID,
} from '@/api/occupationalHealthManagement/personalProtectiveEquipmentCard'
import { encode } from '@/api/public.js'
import detailsList from './details.vue'
export default {
  name: 'archiveDocuments',
  components: { detailsList },
  data() {
    return {
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
        }, {
          title: '姓名',
          dataIndex: 'recipientName',
        },
        {
          title: '编码',
          dataIndex: 'issueName',
        },
        {
          title: '部门',
          dataIndex: 'department',
        }, {
          title: '班组',
          dataIndex: 'teamGroup',
        },
        {
          title: '岗位工种',
          dataIndex: 'postWorkType',
        },
        {
          title: '工种变更时间',
          dataIndex: 'workTypeChangeTime',
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
        personalName: "",
        code: "",
        department: undefined,
        teamGroup: "",
        postWorkType: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
      },
      startDate: [],
      selfCode: '',
      tableList: [],
      formData: {},
      formTitle: '',
      detailsVisible: false,
      departmentOption: [],
    }
  },
  watch: {},
  created() {
    this.getList()
    this.getEncode()
  },
  methods: {
    detailsClose() { this.detailsVisible = false },
    onTimeChange(val) {
      if (val.length === 0) {
        this.queryParams.startTime = ""
        this.queryParams.endTime = ""
      } else {
        this.queryParams.startTime = val[0]
        this.queryParams.endTime = val[1]
      }
    },
    getList() {
      findAllList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableList = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    paginationChange(val) {
      this.queryParams.pageNum = val.current
      this.queryParams.pageSize = val.pageSize
      this.pagination.pageSize = val.pageSize
      this.pagination.current = val.current
      this.getList()
    },
    detailsClick(row) {
      this.getQueryByID(row).then(() => {
        this.formTitle = '个人防护用品卡-详情'
        this.detailsVisible = true
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
    getEncode() {
      encode('LBSQ_SSBM').then((res) => {
        if (res.code == 200) {
          this.departmentOption = res.body.data
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
        personalName: "",
        code: "",
        department: undefined,
        teamGroup: "",
        postWorkType: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
      }
      this.startDate = []
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getList()
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
