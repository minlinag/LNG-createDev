<template>
  <!-- 外委单位工单管理 -->
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <!-- <a-button v-Add
                  class="buttonType btn_primary"
                  type="primary"
                  @click.stop="Hhh">
          <svg-icon class="button_svg"
                    icon-class="export-icon" />
          导出
        </a-button> -->
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="serchForm">
              <a-col :span="6">
                <a-form-model-item
                  label="外委单位:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    v-model="serchForm.outsourceCompany"
                    placeholder="请输入外委单位名称"
                  >
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="工单编号:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    v-model="serchForm.informNo"
                    placeholder="请输入工单编号"
                  >
                  </a-input>
                </a-form-model-item>
              </a-col>
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
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>

      <dc-table
        :scroll="{ x: 100 }"
        :pagination="pagination"
        @change="paginationChange"
        :row-key="(record) => record.InformNo"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
        <template slot="dataTime" slot-scope="row">
          {{ row | dataTime }}
        </template>
        <template slot="workTz" slot-scope="row">
          <span class="edit" v-Edit @click="toNotice(row, 1)">{{ row }}</span>
        </template>
        <template slot="beiP" slot-scope="text, row">
          <span class="edit" v-Edit @click="toSpare(row.jobNoticeCode, 2)"
            >备品备件</span
          >
        </template>
        <template slot="fjDownload" slot-scope="row">
          <span class="edit" v-Edit @click="download(row)">下载</span>
        </template>
      </dc-table>
      <dc-Model v-model="visible" :modelConfig="modelConfig">
        <dispatchingDetail
          :measuresForm="measuresForm"
          v-if="visibleType == 1"
        ></dispatchingDetail>
        <div v-else>
          <a-table
            :scroll="{ x: 100 }"
            :row-key="(record) => record.id"
            :columns="measuresTable"
            :dataSource="spareParts"
            :openSelector="false"
          >
            <template
              :slot="item.dataIndex"
              slot-scope="row, rowAll, index"
              v-for="item in measuresTable"
            >
              <span>{{ rowAll[item.dataIndex] }}</span>
            </template>
          </a-table>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import { getOutsourcingUnit } from '@/api/dispatching/dispatching'
import { timestampToTime } from '@/utils/tableFun'
import {
  getListPage, //查询通知单列表
} from '@/api/dispatching/noticeDocuments'
import { getFormList } from '@/api/dispatching/dispatching'
import dispatchingDetail from '@/views/dispatching/modules/dispatchingDetail/dispatchingDetail'
import utils from '@/utils/url'

export default {
  components: {
    dispatchingDetail,
  },
  filters: {
    dataTime(val) {
      return timestampToTime(val)
    },
  },
  data() {
    return {
      visibleType: 1,
      visible: false,
      measuresTable: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '备件名称',
          dataIndex: 'sparePartName',
          scopedSlots: { customRender: 'sparePartName' },
          type: 'input',
          vaule: '',
        },
        {
          title: '物资编码',
          dataIndex: 'materialCode',
          scopedSlots: { customRender: 'materialCode' },
          type: 'input',
          vaule: '',
        },
        {
          title: '规格/型号',
          dataIndex: 'specificationOrMaterial',
          scopedSlots: { customRender: 'specificationOrMaterial' },
          type: 'input',
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
          type: 'input',
          vaule: '',
        },
      ],
      measuresForm: [],
      startDate: [],
      modelConfig: {
        width: '950px',
        title: '通知单',
        cancelText: false,
        footer: '', //是否展示页脚
      },
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
      //勾选框/选择框组件
      selectedRowKeys: [],
      //回传组件
      echoMap: {},
      //查询所需的数据 外委单位名称｜日期｜状态
      serchForm: {
        pageNum: 1,
        pageSize: 10,
        outsourceCompany: '',
        InformNo: '',
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
          width: 70,
          align: 'center',
        },
        {
          title: '外委单位名称 ',
          dataIndex: 'outsourceCompany',
          align: 'center',
        },
        {
          title: '检维修名称',
          dataIndex: 'InspectionName',
          align: 'center',
        },
        {
          title: '工单编号',
          dataIndex: 'InformNo',
          scopedSlots: { customRender: 'workTz' },
          align: 'center',
          width: 170,
        },
        {
          title: '备品备件',
          dataIndex: 'sparePartListID',
          scopedSlots: { customRender: 'beiP' },
          width: 100,
        },
        {
          title: '附件',
          scopedSlots: { customRender: 'fjDownload' },
          width: 100,
        },
        {
          title: '维修作业时间',
          dataIndex: 'StartWorkTime',
          scopedSlots: { customRender: 'dataTime' },
          align: 'center',
          width: 150,
        },
        {
          title: '验收日期',
          dataIndex: 'EndWorkTime',
          align: 'center',
          scopedSlots: { customRender: 'dataTime' },
          width: 150,
        },
        {
          title: '作业负责人',
          dataIndex: 'WorkPersonInCharge',
          align: 'center',
        },
        {
          title: '工作内容',
          dataIndex: 'JobContent',
          align: 'center',
        },
      ],
      //表格中的数据
      dataSource: [],
      applicantList: [],
      urls: 'fileinfo/downloadFile?',
    }
  },
  created() {
    this.getstatistics()
    // this.getapplicant()
  },
  mounted() { },
  methods: {
    //查询功能
    search() {
      console.log(111);

      console.log(this.serchForm);
      if (this.serchForm) {
        this.serchForm.pageNum = 1
        this.serchForm.pageSize = 10
        this.getstatistics()
      } else {
        this.getstatistics()
      }
    },
    // 查看通知单
    toNotice(val, type) {
      this.modelConfig.title = '通知单'
      this.visibleType = type
      this.measuresForm = getFormList('通知')
      // var value= AJAX(val) 取到的值
      getListPage({
        pageNum: '1',
        pageSize: '10',
        informNo: val,
      }).then((res) => {
        if (res.code == 200) {
          console.log(res.body)
          let data = res.body.data[0]
          data.dispatchStatus = data.dispatchStatus === '1' ? '未派工' : data.dispatchStatus === '2' ? '作业中' : data.dispatchStatus === '3' ? '已完成' : data.dispatchStatus
          this.measuresForm.forEach((item) => {
            // console.log(item)
            item.isTrue = false
            item.value = (data ? data[item.labelKey] : '')
            // console.log(item);
          })
        }
      })
      this.visible = true
    },
    toSpare(val, type) {
      this.modelConfig.title = '备品备件清单'
      this.visibleType = type
      getListPage({
        pageNum: '1',
        pageSize: '10',
        informNo: val,
      }).then((res) => {
        this.spareParts = res.body.data[0].actualSpareParts
      })

      this.visible = true
    },
    flieChange(val) {
      console.log(val)
      this.flieChanges = val
    },
    download(value) {
      window.location.href =
        utils.baseURL + this.urls + 'relatedId=' + value.id
    },
    getstatistics() {
      getOutsourcingUnit(this.serchForm).then((res) => {
        console.log(res)
        this.dataSource = res.body.data
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
        this.pagination.total = res.body.total
      })
    },
    handleChange(value) {
      console.log('select', value)
    },
    // //日期的onchange
    // onChange(date) {
    //   console.log(date)
    //   this.serchForm.startTime = this.startDate[0]
    //   this.serchForm.endTime = this.startDate[1]
    // },

    //页面变更
    paginationChange(pagination) {
      this.serchForm.pageNum = pagination.current
      this.serchForm.pageSize = pagination.pageSize
      this.getstatistics()
    },
    //重置输入
    resetForm() {
      this.serchForm = {}
      this.serchForm.pageNum = 1
      this.serchForm.pageSize = 10

      this.getstatistics()
    },
    //上方小提示框
    success() {
      this.$message.success('This is a success message')
    },
    error() {
      this.$message.error('This is an error message')
    },
    warning() {
      this.$message.warning('This is a warning message')
    },
    getDict() { },
  },
}
</script>
<style scoped>
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout{
  margin-bottom: 0px;
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item-control {
  width: 100%;
}

.ant-select-selection--single {
  width: 180px;
}

.aaaa {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
</style>
