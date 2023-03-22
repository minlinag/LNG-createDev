<!--/***-->
<!--*作业许可界面搭建刘豪东-->
<!--*日期：2022年9月9日-->
<!--**/-->
<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <a-button
          class="buttonType btn_primary"
          type="primary"
          icon="plus"
          @click.stop="libraryDataAdd"
        >
          新增
        </a-button>
        <a-popconfirm
          placement="left"
          title="您确定要删除该项吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirm"
        >
          <a-button
            v-Delete
            class="buttonType btn_danger"
            type="danger"
            icon="delete"
            @click.stop
          >
            删除
          </a-button>
        </a-popconfirm>
      </div>
    </template>
    <template slot="appMain">
      <div class="search-content">
        <a-form-model v-model="form">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="编码:"
              >
                <a-input
                  placeholder="请输入设备名称"
                  v-model="searchInfo.lubricationDate"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="作业类别:"
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
                :labelCol="{ style: 'width: 110px' }"
                label="作业单位:"
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
                label="分析组长:"
              >
                <a-input
                  placeholder="请输入设备名称"
                  v-model="searchInfo.deviceName"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="分析人员:"
              >
                <a-input
                  placeholder="请输入设备名称"
                  v-model="searchInfo.lubricationDate"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 110px' }"
                label="作业内容:"
              >
                <a-input
                  placeholder="请输入设备名称"
                  v-model="searchInfo.lubricationDate"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
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
      <dc-table
        :scroll="{ x: 100 }"
        :pagination="pagination"
        @change="paginationChange"
        :row-key="(record) => record.id"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
        <template slot="operation" slot-scope="row">
          <span v-Edit class="look" @click="upDateListDetail(row)"> 编辑 </span>
        </template>
      </dc-table>
      <dc-Model v-model="visible" :modelConfig="modelConfig">
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
        deviceName: '', //设备名称
        deviceNo: '', //设备位号
        temMainPlanDescription: '', //设备备注
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
        width: '1000px',
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
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
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
            formKey: 'deviceLubricationType', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入检修计划编码', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
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
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
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
            formKey: 'equipmentNo', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
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
            formKey: 'lubricationPoint', //form 定义的 key (必须唯一 || 必须传入)
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
            formKey: 'lubricationRule', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
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
            formKey: 'lubricationCycle', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
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
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          // {
          //     type: "datePicker", //组件类型 目前指出 input || select
          //     label: "预计下次时间", //展示名称
          //     colSpan: 12,
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
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
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
          title: '编码',
          dataIndex: 'equipmentCode',
          width: 150,
        },
        {
          title: '作业类别',
          dataIndex: 'deviceLubricationType',
          width: 150,
        },
        {
          title: '作业单位',
          dataIndex: 'deviceName',
          width: 150,
        },
        {
          title: '作业地点',
          dataIndex: 'equipmentNo',
          width: 150,
        },
        {
          title: '属地单位',
          dataIndex: 'territoryUnit',
          width: 150,
        },
        {
          title: '作业时间',
          dataIndex: 'lubricationPoint',
          width: 150,
        },
        {
          title: '分析组长',
          dataIndex: 'lubricationRule',
          width: 150,
        },
        {
          title: ' 分析人员',
          dataIndex: 'lubricationCycle',
          width: 200,
        },
        {
          title: ' 作业内容',
          dataIndex: 'lastLubricationDateTime',
          width: 200,
        },
        {
          title: ' 所使用工具材料',
          dataIndex: 'lastRefuelingBrand',
          width: 200,
        },
        {
          title: ' 作业步骤',
          dataIndex: 'nextLubricationDateTime',
          width: 200,
        },
        {
          title: ' 状态 ',
          dataIndex: 'nextRefuelingBrand',
          width: 200,
        },
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
      visible: false,
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
      dataSource: [
        {
          key: '1',
          equipmentName: 1,
        },
      ],
    }
  },

  mounted() {
    this.getList()
    this.getSelectList()
  },

  created() {},

  methods: {
    //批量删除确认方法
    confirm(e) {
      this.Delete()
    },
    //分页查询
    select() {
      this.searchInfo.pageIndex = 1
      this.searchInfo.pageSize = 10
      this.getList()
    },

    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageIndex = pagination.current
      this.searchInfo.pageSize = pagination.pageSize
      this.getList()
    },

    // 弹出框取消
    cancelClick() {
      console.log(333)
      this.visible = false
    },

    //点击编辑
    upDateListDetail(val) {
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
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          val.id = this.dateilInfo.id
          upDateList(val).then((res) => {
            console.log(res)
            if (res.code == '200') {
              message.success('修改成功')
              this.getList()
              this.visible = false
            }
          })
        }
      })
    },

    //获取表格列表
    getList() {
      getList(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
        this.dataSource = res.body.data
        this.pagination.total = res.body.total
      })
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
      this.searchInfo = {
        pageIndex: 1,
        pageSize: 10,
        deviceName: '', //设备名称
        deviceNo: '', //设备位号
        temMainPlanDescription: '', //设备备注
      }
      this.getList()
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
.search-content {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
