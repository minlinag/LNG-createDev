<template>
  <div>
    <div id="components-layout-demo-basic" style="width: 100%">
      <a-layout>
        <a-layout-content>
          <a-form-model layout="inline" :model="queryForm">
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="作业日期:">
                  <a-range-picker
                    v-model="workDate"
                    valueFormat="YYYY-MM-DD"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="编码">
                  <a-input
                    v-model="queryForm.coding"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-model-item label="作业类型">
                  <a-select
                    :allowClear="true"
                    v-model="workTypeOut"
                    show-search
                    mode="multiple"
                    placeholder="请选择作业类型"
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      :value="province.dictcode"
                      v-for="(province, index) in dictSelect"
                      :key="index"
                    >
                      {{ province.dictname }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col> -->
              <a-col :span="8">
                <a-form-model-item label="作业单位">
                  <a-select
                    :allowClear="true"
                    v-model="queryForm.workUnit"
                    show-search
                    placeholder="请选择作业单位"
                    option-filter-prop="children"
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      :value="province.OutsourceCompanyCode"
                      v-for="(province, index) in company"
                      :key="index"
                    >
                      {{ province.OutsourceCompanyName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="作业地点">
                  <a-input
                    v-model="queryForm.operatingLocationRemarks"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="分析组长">
                  <a-input
                    v-model="queryForm.analysisGroupLeader"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="分析人员">
                  <a-input
                    v-model="queryForm.analysisUser"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="作业内容">
                  <a-input
                    v-model="queryForm.workContent"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item style="padding-left: 30px">
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
            </a-row>
          </a-form-model>
        </a-layout-content>
      </a-layout>
    </div>
    <!-- 主页列表 -->
    <dc-table
      @change="paginationChange"
      rowKey="id"
      :pagination="pagination"
      :scroll="{ x: 100 }"
      :columns="columns"
      :dataSource="dataSource"
      :openSelector="true"
    >
      <template slot="status" slot-scope="row">
        {{ row | rowStatus }}
      </template>
      <template slot="operation" slot-scope="text, row">
        <span v-Edit class="look" @click="upDateListDetail(row)"> 选择 </span>
      </template>
    </dc-table>
  </div>
</template>

<script>
import {
  jsaList, //获取jsaList
  companySelect,
} from '@/api/JSAAnalysis'
import { encode } from '@/api/dataDictionary'
export default {
  name: '',
  props: {
    dictname: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        )
      },
      workTypeOut: [], //作业类别
      dictSelect: [],
      company: [], //作业单位
      workDate: [],
      selectedRowKeys: [],
      dataSource: [],
      queryForm: {}, //查询框对象
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
      //页面下方表格的列属性
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
          title: '编码',
          dataIndex: 'coding',
          width: 220,
          align: 'center',
        },
        {
          title: '作业内容',
          dataIndex: 'workContent',
          width: 150,
          align: 'center',
        },
        {
          title: '作业类型',
          dataIndex: 'workType',
          width: 150,
          align: 'center',
        },
        {
          title: '作业单位',
          dataIndex: 'workUnit',
          width: 150,
          align: 'center',
        },
        {
          title: '作业地点',
          dataIndex: 'operatingLocationRemarks',
          width: 150,
          align: 'center',
        },
        {
          title: '作业日期',
          dataIndex: 'workDate',
          width: 150,
          align: 'center',
        },
        {
          title: '分析组长',
          dataIndex: 'analysisGroupLeader',
          width: 120,
          align: 'center',
        },
        {
          title: '分析人员',
          dataIndex: 'analysisUser',
          width: 220,
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'recordStatus',
          scopedSlots: { customRender: 'status' },
          width: 150,
          align: 'center',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 120,
          fixed: 'right',
        },
      ],
    }
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
  created() {
    this.getJsaList()
    this.encodeSelect()
    this.getOutsourceCompany()
  },
  methods: {
    //选择
    upDateListDetail(val) {
      // console.log(val)
      this.$emit('listClick', val)
    },
    //获取JAS下拉框列表
    getJsaList() {
      // this.queryForm.pageNum = 1
      // this.queryForm.pageSize = 10
      this.queryForm.recordStatus = '审批完成'
      this.queryForm.workType = this.dictname.toString()
      jsaList(this.queryForm).then((res) => {
        this.dataSource = res.body.data
        this.pagination.current = res.body.pageIndex
        this.pagination.total = res.body.total
        this.pagination.pageSize = res.body.pageSize
      })
    },
    //页面变更
    paginationChange(pagination) {
      console.log(pagination)
      this.queryForm.pageNum = pagination.current
      this.queryForm.pageSize = pagination.pageSize
      this.getJsaList()
    },
    //查询功能
    search() {
      this.queryForm.pageNum = 1
      this.queryForm.pageSize = 10
      this.queryForm.workDateS = this.workDate[0]
      this.queryForm.workDateE = this.workDate[1]
      this.getJsaList()
    },
    // 选择风险分解结构复选框
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    // 获取外委单位列表
    getOutsourceCompany() {
      companySelect().then((res) => {
        console.log(res)
        this.company = res.body
      })
    },
    // 获取数据字典列表
    encodeSelect() {
      encode('ZYXKGL-ZYLX').then((res) => {
        console.log(res)
        this.dictSelect = res.body.data
        this.addNewConfig.formDataList[2].optionData = []
        res.body.data.forEach((item) => {
          this.addNewConfig.formDataList[2].optionData.push({
            value: item.dictcode,
            label: item.dictname,
          })
        })
      })
    },
    //重置输入
    resetForm() {
      this.queryForm = {
        pageSize: 10,
        pageNum: 1,
        coding: '',
        workType: '',
        workUnit: undefined,
        workDateS: '',
        workDateE: '',
        operatingLocationRemarks: '',
        analysisGroupLeader: '',
        analysisUser: '',
        workContent: '',
      }
      this.workTypeOut = []
      this.getJsaList()
    },
  },
  component: {
    //someComponent
  },
}
</script>

<style scoped lang="less">
.look {
  color: rgb(24, 144, 255);
  cursor: pointer;
}

.search_form_button {
  text-align: right;
}
#components-layout-demo-basic {
  /deep/ .ant-form-item-control-wrapper {
    height: 40px !important;
  }
}
</style>
