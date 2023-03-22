<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <!-- <pe-button
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
          @addNew="addNew"
          @mydelete="mydelete"
        ></pe-button> -->
      </div>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout-content>
          <a-form-model layout="inline" :model="form">
            <a-col :span="6">
              <a-form-model-item
                label="设备类型:"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  v-model="form.deviceType"
                  placeholder="请输入设备类型"
                ></a-input>
                <!-- <a-select
                  v-model="form.deviceType"
                  show-search
                  placeholder="请选择设备类型"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                >
                  <a-select-option value="类型一"> 类型一 </a-select-option>
                  <a-select-option value="类型二"> 类型二 </a-select-option>
                </a-select> -->
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                label="设备名称:"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  v-model="form.deviceName"
                  placeholder="请输入设备名称"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                label="设备位号:"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  v-model="form.deviceCode"
                  placeholder="请输入设备位号"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                label="检维修类型:"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-select
                  v-model="form.checkType"
                  show-search
                  placeholder="请选择"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                >
                  <a-select-option value="预防性"> 预防性 </a-select-option>
                  <a-select-option value="故障性"> 故障性 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 170px' }"
                label="检修时间:"
              >
                <a-month-picker
                  format="YYYY-MM"
                  :valueFormat="'YYYY-MM'"
                  v-model="form.planDateTime"
                  placeholder="选择月份"
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
      </div>
      <dc-table
        @change="paginationChange"
        rowKey="id"
        :pagination="pagination"
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
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
      <!--弹出框-->
      <dc-Model
        v-model="visible"
        class="from-style bigModel"
        :modelConfig="modelConfig"
      >
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
import utils from '@/utils/url'
import { getFormList, findAllList } from '@/api/dispatching/dispatching'
import {
  getListPage, //查询通知单列表
} from '@/api/dispatching/noticeDocuments'
import importConpontsData from '@/components/importConpontsData'
import dispatchingDetail from './dispatchingDetail/dispatchingDetail'
export default {
  components: {
    importConpontsData,
    dispatchingDetail,
  },
  data() {
    return {
      visibleType: 1,
      measuresForm: [],
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
      spareParts: [],
      visible: false,
      modelConfig: {
        width: '950px',
        title: '通知单',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      flieChanges: {},
      urls: 'fileinfo/downloadFile?',
      importData: {},
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

      //upload暂时无用
      // headers: {
      //     authorization: 'authorization-text',
      // },
      //回传组件
      echoMap: {},
      //查看组件中的数值
      LookForm: {},
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageNum: 1,
        pageSize: 10,
        deviceType: '', //设备类型
        deviceName: '', //设备名称
        deviceCode: '', //设备位号
        checkType: undefined, //检维修类型
        planDateTime: '', //月份
      },
      //查看是否visible
      visibleLook: false,
      //查看的弹窗的相关设置
      lookModelConfig: {
        width: '950px',
        title: '外委单位',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        )
      },
      //页面下方表格的列属性
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
        },
        {
          title: '设备类型',
          dataIndex: 'deviceType',
          width: 100,
        },

        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 100,
        },
        {
          title: '设备位号',
          dataIndex: 'deviceCode',
          width: 100,
        },
        // {
        //   title: '安装位置',
        //   dataIndex: 'installationPosition',
        //   width: 100,
        // },
        // {
        //   title: '维护级别',
        //   dataIndex: 'maintenanceLevel',
        //   width: 100,
        // },
        {
          title: '检维修类型',
          dataIndex: 'checkType',
          width: 100,
        },
        {
          title: '检修内容',
          dataIndex: 'checkContent',
          width: 100,
        },
        {
          title: '检修日期',
          dataIndex: 'checkTime',
          width: 100,
        },
        {
          title: '维修单位',
          dataIndex: 'checkUnit',
          width: 100,
        },
        {
          title: '作业通知单',
          dataIndex: 'jobNoticeCode',
          scopedSlots: { customRender: 'workTz' },
          width: 150,
        },
        // {
        //   title: '备品备件',
        //   dataIndex: 'sparePartListID',
        //   scopedSlots: { customRender: 'beiP' },
        //   width: 100,
        // },
        // {
        //   title: '备注',
        //   dataIndex: 'remarks',
        //   width: 100,
        // },
        {
          title: '附件',
          scopedSlots: { customRender: 'fjDownload' },
          width: 100,
        },
      ],
      //表格中的数据
      dataSource: [],
    }
  },
  created() {
    this.findAllList()
  },
  methods: {
    // 查看通知单
    toNotice(val, type) {
      this.modelConfig.title = '通知单'
      this.visibleType = type
      this.measuresForm = getFormList('通知')
      getListPage({
        pageNum: '1',
        pageSize: '10',
        informNo: val,
      }).then((res) => {
        if (res.code == 200) {
          let data = res.body.data[0]
          console.log(data, 'success')
          data.dispatchStatus =
            data.dispatchStatus === '1'
              ? '未派工'
              : data.dispatchStatus === '2'
              ? '作业中'
              : data.dispatchStatus === '3'
              ? '已完成'
              : data.dispatchStatus
          this.measuresForm.forEach((item) => {
            // console.log(item)
            item.isTrue = false
            item.value = data ? data[item.labelKey] : ''
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
    //查看弹窗相关按钮
    look(value) {
      this.LookForm = value
      this.visibleLook = true
      console.log(this.LookForm, 'look')
    },
    //日期的onchange
    onChange(date, dateString) {
      console.log(date, dateString)
    },
    //upload
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },
    //获得当前页面
    findAllList() {
      findAllList(this.form).then((res) => {
        console.log(res)
        this.dataSource = res.body.data
        this.pagination.total = res.body.total
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
      })
      this.selectedRowKeys = []
    },
    download(value) {
      window.location.href =
        utils.baseURL + this.urls + '?' + 'relatedId=' + value.id
    },
    //查询功能
    search() {
      console.log(this.form)
      // console.log(this.form.planDateTime.split('-')[1], 'month')
      if (this.form) {
        this.form.pageNum = 1
        this.form.pageSize = 10
        this.findAllList()
      } else {
        this.findAllList()
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current
      this.form.pageSize = pagination.pageSize
      this.findAllList()
    },
    //重置输入
    resetForm() {
      this.form = {}
      this.form.pageNum = 1
      this.form.pageSize = 10
      this.findAllList()
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
  },
}
</script>
<style scoped>
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout {
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
