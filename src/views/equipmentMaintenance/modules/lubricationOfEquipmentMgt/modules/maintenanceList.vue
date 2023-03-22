<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <!-- <ImportComponents :url="importExcel" @Import="getList" style="margin-right: 10px"></ImportComponents> -->
        <!-- <ExportComponents :url="urls" :Text="'导出模板'"></ExportComponents> -->
        <pe-button
          :include="[
            {
              value: 'exportComponent',
              url: '/eqmlubrication/exportExcel',
              name: '导出模板',
            },
          ]"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div class="search-content">
        <a-form-model v-model="searchInfo">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 110px' }"
              label="润滑日期:"
            >
              <a-select
                ref="select"
                placeholder="请选择润滑日期"
                v-model="searchInfo.lubricationDate"
              >
                <a-select-option value="1"> 1个月 </a-select-option>
                <a-select-option value="3"> 3个月 </a-select-option>
                <a-select-option value="6"> 6个月 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 110px' }"
              label="润滑类型:"
            >
              <a-select
                placeholder="请选择润滑类型"
                ref="select"
                v-model="searchInfo.deviceLubricationType"
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
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 220px' }"
              label="设备名称:"
            >
              <a-input
                placeholder="请输入设备名称"
                v-model="searchInfo.deviceName"
              ></a-input>
            </a-form-model-item>
          </a-col>
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
            <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <!-- <a-collapse :defaultActiveKey="['1']">
        <a-collapse-panel key="1"
                          :header="$route.name"> -->

      <a-table
        :scroll="{ x: 100 }"
        :pagination="pagination"
        @change="paginationChange"
        :row-key="(record) => record.id + Math.floor(Math.random() * 1000)"
        :data-source="dataSource"
        :columns="columns"
        :openSelector="false"
        :rowClassName="setRowClassName"
      >
        <!-- <template slot="dangerSlots" slot-scope="row">
          <span>{{ row }}</span>
        </template> -->
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'upDateListDetail',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @upDateListDetail="upDateListDetail(row)"
          ></pe-button>
        </template>
      </a-table>
      <!-- </a-collapse-panel>
      </a-collapse> -->

      <dc-Model
        v-model="visible"
        :modelConfig="modelConfig"
        class="from-style middleModel"
      >
        <FormitemDemo
          ref="Form"
          :Config="Config"
          @save="saveList"
          @cancelClick="cancelClick"
        ></FormitemDemo>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList, //获取列表
  addList, //获取列表
  upDateList, //修改列表
} from '@/api/maintenanceList'
import {
  getList as getzList, //获取列表
} from '@/api/maintenanceManagementList'
import { queryByEqmType as getSelectList } from '@/api/maintenanceManagement'

import { message } from 'ant-design-vue'

export default {
  data() {
    return {
      importExcel: '/eqmlubrication/importExcel',
      urls: '/eqmlubrication/exportExcel',
      selectData: [],
      value1: '',
      dateilInfo: {},
      workLocationSelect: [], //作业位置数组
      searchInfo: {
        pageIndex: 1,
        pageSize: 10,
        versionNumber: '',
        lubricationDate: '',
        deviceName: '', //设备名称
        deviceLubricationType: '',
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
      form: {},
      visible: false,
      modelConfig: {
        width: '950px',
        title: '设备润滑-编辑',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      Config: {
        otherConfigurations: [
          {
            type: 'btn',
            label: '保存',
            btnType: 'primary', //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: 'save', //传值内容 拿到当前所有数据包装好的
          },
          {
            type: 'btn',
            label: '取消',
            btnType: '', //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: 'cancelClick', //传值内容 拿到当前所有数据包装好的
          },
        ],
        formDataList: [
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '设备编码', //展示名称
            colSpan: 12,
            formKey: 'equipmentCode', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入设备名称',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'select', //组件类型 目前指出 input || select
            label: '设备润滑类型', //展示名称
            formKey: 'equipmentLubricationType', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入检修计划编码', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            colSpan: 12,
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请选择设备类型',
                trigger: 'blur',
              }, //校验规
            },
            optionData: [],
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '设备名称', //展示名称
            colSpan: 12,
            formKey: 'deviceName', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入设备名称',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '设备位号', //展示名称
            colSpan: 12,
            formKey: 'equipmentItemNumber', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入设备位号',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑点', //展示名称
            colSpan: 12,
            formKey: 'lubricationPointName', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑点',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑规则', //展示名称
            colSpan: 12,
            formKey: 'lubricationRuleDescription', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑规则',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '加换油周期', //展示名称
            colSpan: 12,
            formKey: 'refuelingOilChangeCycle', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请选择加换油周期',
                trigger: 'change',
              }, //校验规
            },
            optionData: [
              { label: '1个月', value: '1个月' },
              { label: '3个月', value: '3个月' },
              { label: '6个月', value: '6个月' },
            ],
          },
          {
            type: 'datePicker', //组件类型 目前指出 input || select
            label: '本次时间', //展示名称
            colSpan: 12,
            format: 'YYYY-MM-DD',
            formKey: 'lastLubricationDateTime', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          // {
          //     type: "datePicker", //组件类型 目前指出 input || select
          //     label: "下次换油时间", //展示名称
          //     colSpan: 12,
          //       format: 'YYYY-MM-DD',
          //     formKey: "nextLubricationDateTime", //form 定义的 key (必须唯一 || 必须传入)
          //     value: "", // 默认值为空字符串 // v-model 绑定值
          //     placeholder: "请输入", //输入框为空值的时候展示内容
          //     disabled: true, //是否禁用 true 是禁用 默认是false
          //     labelStyle: { style: { width: "150px" } }, //组件样式 form-item
          //     options: {
          //         // 暂时开发状态
          //         multiple: true,
          //     },
          // },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '本次油品', //展示名称
            colSpan: 12,
            formKey: 'lastRefuelingBrand', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          // {
          //     type: "input", //组件类型 目前指出 input || select
          //     label: "预计下次品牌", //展示名称
          //     colSpan: 12,
          //     formKey: "nextRefuelingBrand", //form 定义的 key (必须唯一 || 必须传入)
          //     value: "", // 默认值为空字符串 // v-model 绑定值
          //     placeholder: "请输入", //输入框为空值的时候展示内容
          //     disabled: true, //是否禁用 true 是禁用 默认是false
          //     labelStyle: { style: { width: "150px" } }, //组件样式 form-item
          //     options: {
          //         // 暂时开发状态
          //         multiple: true,
          //     },
          // },
        ],
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
          width: 75,
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 150,
        },
        {
          title: '设备位号',
          dataIndex: 'equipmentItemNumber',
          width: 150,
        },
        // {
        //   title: '设备编码',
        //   dataIndex: 'equipmentCode',
        //   width: 150,
        // },
        {
          title: '润滑设备类型',
          dataIndex: 'equipmentLubricationType',
          width: 150,
        },
        {
          title: '润滑点',
          dataIndex: 'lubricationPointName',
          width: 100,
        },
        {
          title: '润滑规则',
          dataIndex: 'lubricationRuleDescription',
          width: 100,
        },
        {
          title: ' 加换油周期',
          dataIndex: 'refuelingOilChangeCycle',
          width: 100,
        },
        {
          title: ' 上次换油时间',
          dataIndex: 'lastLubricationDateTime',
          width: 150,
        },
        // {
        //   title: ' 上次加油品牌',
        //   dataIndex: 'lastRefuelingBrand',
        //   width: 150,
        // },
        {
          title: ' 下次加油时间',
          dataIndex: 'nextLubricationDateTime',
          width: 150,
          // scopedSlots: { customRender: 'dangerSlots' },
        },
        // {
        //   title: ' 下次加油品牌',
        //   dataIndex: 'nextRefuelingBrand',
        //   width: 150,
        // },
        // {
        //     title: ' 上次作业工单',
        //     dataIndex: 'refuelingOilChangeCycle',
        //     width: 200,
        // },
        // {
        //     title: ' 润滑状态1',
        //     dataIndex: 'refuelingOilChangeCycle',
        //     width: 200,
        // },
        {
          fixed: 'right',
          title: '操作',
          width: 100,
          scopedSlots: { customRender: 'operation' },
        },
      ],
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
      dataSource: [],
    }
  },
  created() {},
  mounted() {
    this.getSelectList()
    this.getTableList()
  },

  methods: {
    //分页查询
    select() {
      this.searchInfo.pageIndex = 1
      this.searchInfo.pageSize = 10
      this.getTableList()
    },

    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageIndex = pagination.current
      this.searchInfo.pageSize = pagination.pageSize
      this.getTableList()
    },

    // 弹出框取消
    cancelClick() {
      console.log(333)
      this.visible = false
    },
    //点击编辑
    upDateListDetail(val) {
      console.log(val)
      this.visible = true
      this.dateilInfo = val
      this.Config.formDataList.forEach((item) => {
        item.value = val[item.formKey]
      })
      this.Config.otherConfigurations.forEach((item) => {
        item.disabled = false
      })
    },

    //保存详情
    saveList(val) {
      const data = val
      if (data.lastLubricationDateTime) {
        let state = +new Date(data.lastLubricationDateTime)
        let time = +new Date(data.refuelingOilChangeCycle * 24 * 60 * 60 * 1000)

        let end = +new Date(Number(state) + Number(time))
        data.nextLubricationDateTime = this.getEnd(end)
      }
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          data.id = this.dateilInfo.id
          upDateList(data).then((res) => {
            console.log(res)
            if (res.code == '200') {
              message.success('修改成功')
              this.getTableList()
              this.visible = false
            }
          })
        }
      })
    },

    //获取表格列表
    getTableList() {
      getzList({ pageIndex: 1, pageSize: 10 }).then((res) => {
        if (res.code == '200') {
          this.searchInfo.versionNumber = res.body.data[0].versionNumber
          getList(this.searchInfo).then((res) => {
            this.pagination.current = res.body.pageIndex
            this.pagination.pageSize = res.body.pageSize
            let data = res.body.data
            res.body.data.forEach((item) => {
              if (item.lastLubricationDateTime) {
                let state = +new Date(item.lastLubricationDateTime)
                let time = +new Date(
                  item.refuelingOilChangeCycle * 24 * 60 * 60 * 1000
                )

                let end = +new Date(Number(state) + Number(time))
                item.nextLubricationDateTime = this.getEnd(end)
              }
            })
            this.dataSource = data
            this.pagination.total = res.body.total
          })
        }
      })
    },
    getEnd(val) {
      let end = new Date(val)
      let N = end.getFullYear()
      N = N < 0 ? '0' + N : N
      let Y = end.getMonth() + 1
      Y = Y < 0 ? '0' + Y : Y
      let R = end.getDate()
      R = R < 0 ? '0' + R : R

      return N + '-' + Y + '-' + R
    },
    //获取下拉框列表
    getSelectList() {
      let selectArray = new Array()
      getSelectList({ pageIndex: 1, pageSize: 30 }).then((res) => {
        res.body.forEach((item) => {
          selectArray.push({
            label: item,
            value: item,
          })
        })
        this.selectData = selectArray
        this.Config.formDataList[0].optionData = selectArray
      })
    },

    //重置表单输入框
    resetForm() {
      this.searchInfo.pageIndex = 1
      this.searchInfo.pageSize = 10
      this.searchInfo.lubricationDate = ''
      this.searchInfo.deviceName = ''
      this.searchInfo.deviceLubricationType = ''

      this.getTableList()
    },
    //  :style="{
    //           color: nearlyMonthColor(row) ? '#D40000' : '',
    //         }"
    setRowClassName(record, index) {
      let row = record.nextLubricationDateTime
      if (row === undefined || row === null) {
        return false
      }
      const earlyMorning = `${row} 00:00:00`
      const rowTimestamp = new Date(earlyMorning).getTime()
      const currentTime = new Date().getTime()
      const currentTimeDistance = rowTimestamp - currentTime
      const distanceTime = 30 * 24 * 60 * 60 * 1000
      if (currentTimeDistance <= distanceTime) {
        return 'dangerStyle'
      } else {
        return false
      }
    },
  },
  // nearlyMonthColor(row) {},
}
</script>
<style scoped lang="less">
::v-deep .dangerStyle > td {
  color: #ff7875 !important;
}
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
.search-content {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
