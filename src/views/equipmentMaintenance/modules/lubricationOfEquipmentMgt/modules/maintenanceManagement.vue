<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <div v-if="versionNumberType != 0" style="display: inline-block">
          <pe-button
            :include="[
              {
                value: 'exportComponent',
                url: '/eqmlubricationManager/exportExcel',
                 show: versionNumber ? false : true,
              },
              {
                value: 'Add',
                clickName: 'addPlan',
                show: versionNumber ? false : true,
              },
              {
                value: 'importComponent',
                url: '/eqmlubricationManager/importExcel',
                accept: '.xlsx',
                 show: versionNumber ? false : true,
              },
              {
                value: 'Delete',
                clickName: 'mydelete',
                show: versionNumber ? false : true,
              },
              {
                value: 'Release',
                clickName: 'addRelease',
                isPower: false,
                icon: 'release-icon',
                name: '发布',
                show: versionNumber ? false : true,
              },
              {
                value: 'Go',
                clickName: 'go',
                icon: 'Go-icon',
                name: '返回',
                isPower: false,
              },
            ]"
            @addPlan="addPlan"
            @mydelete="mydelete"
            @addRelease="addRelease"
            @go="go"
          ></pe-button>
          <!-- <ImportComponents
            :url="importExcel"
            @Import="getList"
            style="margin-right: 10px"
          ></ImportComponents>
          <ExportComponents :url="urls" :Text="'导出模板'"></ExportComponents>
          <a-button
            v-Query
            class="buttonType btn_primary"
            type="primary"
            icon="plus"
            @click.stop="addPlan"
          >
            新增
          </a-button>
          <a-popconfirm
            placement="left"
            title="您确定要删除该项吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteList"
          >
            <a-button
              v-Delete
              class="buttonType btn_danger"
              type="danger"
              icon="delete"
              @click.stop=""
            >
              删除
            </a-button>
          </a-popconfirm>
          <a-button
            v-if="!versionNumberType"
            v-Query
            class="buttonType btn_primary"
            type="primary"
            icon="rocket"
            @click.stop="addRelease"
          >
            发布
          </a-button> -->
        </div>
        <!-- <a-button
          class="buttonType btn_primary"
          type="primary"
          icon="left"
          @click.stop="go"
        >
          返回
        </a-button> -->
      </div>
    </template>
    <template slot="appMain">
      <div class="search-content" v-if="!versionNumber">
        <a-form-model v-model="form">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 110px' }"
              label="设备类型:"
            >
              <!--<a-input v-model="searchInfo.equipmentLubricationType" placeholder="请输入设备类型">-->
              <!--</a-input>-->
              <a-select
                placeholder="请选择润滑类型"
                ref="select"
                v-model="searchInfo.equipmentLubricationType"
              >
                <a-select-option
                  :value="item"
                  v-for="(item, index) in queryByEqmSelect"
                  :key="index"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 110px' }"
              label="设备名称:"
            >
              <a-input
                v-model="searchInfo.deviceName"
                placeholder="请输入设备名称"
              >
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 220px' }"
              label="设备位号:"
            >
              <a-input
                v-model="searchInfo.equipmentItemNumber"
                placeholder="请输入设备位号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item>
              <a-button
                v-Query
                class="buttonType"
                :style="{ marginLeft: '5px' }"
                type="primary"
                @click="select"
              >
                查询
              </a-button>
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>
          </a-col>
        </a-form-model>
      </div>
      <dc-table
        :pagination="pagination"
        rowKey="id"
        @change="paginationChange"
        :scroll="{ x: 100 }"
        :row-selection="
          versionNumber
            ? null
            : { selectedRowKeys: selectedRowKeys, onChange: onSelectChange }
        "
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                clickName: 'upDateListDetail',
                icon: '',
                type: 'link',
                style: ['btn_link'],
              },
              {
                value: 'View',
                clickName: 'getListDetail',
                icon: '',
                name: '查看',
                isPower: false,
                icon: '',
                type: 'link',
                style: ['btn_link'],
              },
            ]"
            @upDateListDetail="upDateListDetail(row)"
            @getListDetail="getListDetail(row)"
          ></pe-button>
          <!-- <a-popconfirm
            title="您确定要删除该项吗?"
            ok-text="确定"
            @confirm="confirm(row)"
            cancel-text="删除"
          >
            <a href="#">删除</a>
          </a-popconfirm>
          <span v-Edit class="look" @click="upDateListDetail(row)">
            编辑
          </span>
          <span class="look" @click="getListDetail(row)">
            查看
          </span> -->
        </template>
      </dc-table>
      <dc-Model
        v-model="visble"
        :modelConfig="modelConfig"
        class="from-style bigModel"
      >
        <FormitemDemo
          ref="Form"
          :Config="Config"
          @save="saveList"
          @cancelClick="cancelClick"
          @enterButton="enterButton"
        >
        </FormitemDemo>
      </dc-Model>
      <dc-Model
        v-model="visbleRelease"
        :modelConfig="modelConfig"
        class="from-style middleModel"
      >
        <FormitemDemo
          :Config="ConfigRelease"
          @save="saveListRelease"
          @cancelClick="cancelClick"
        ></FormitemDemo>
      </dc-Model>

      <dc-Model
        v-model="visibleEquipmentName"
        :modelConfig="modelConfigCompany"
        class="from-style bigModel"
      >
        <a-form-model v-model="sbform" :layout="'horizontal'">
          <a-col
            :span="8"
            v-for="(item, index) in equipmentList"
            :key="item.type"
          >
            <a-form-model-item :label="item.label">
              <a-input ref="select" v-model="item.value"></a-input>
            </a-form-model-item>
          </a-col>
          <a-form-model-item>
            <a-button type="primary" @click="inSerach"> 查询 </a-button>
          </a-form-model-item>
        </a-form-model>
        <dc-table
          @change="paginationChangeInTwo"
          :pagination="paginationThree"
          :row-selection="{
            selectedRowKeys: selectedRowKeysThree,
            onChange: onSelectChangeThree,
          }"
          rowKey="id"
          :scroll="{ x: 100 }"
          :columns="columnsEquipment"
          :dataSource="EquipmentDataSource"
          :openSelector="false"
        ></dc-table>
        <div class="footer">
          <a-button type="primary" @click="EquipmentNameClick"> 确定 </a-button>
          <a-button @click="cancelEquipment" :style="{ marginLeft: '8px' }"
            >取消</a-button
          >
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  queryPageListForUnClass,
  queryPublicSearchColumn,
} from '@/api/PublicInterface'
// import dcTable from '@/components/table'
import {
  getList, //获取列表
  addList, //获取列表
  upDateList, //修改列表
  deleteList, //删除列表
  addIssue, //发布
  findTableList, //查询
  queryByEqmType, //查询模板设备润滑类型
} from '@/api/maintenanceManagement'
import { message } from 'ant-design-vue'

export default {
  data() {
    return {
      equipmentList: [],
      modelConfigCompany: {
        title: '设备列表',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      sbform: {},
      visibleEquipmentName: false,
      // urls: "/eqmlubricationManager/exportExcel",
      // importExcel: "/eqmlubricationManager/importExcel",
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
      selectedRowKeysThree: [],
      searchInfo: {
        pageIndex: 1,
        pageSize: 10,
        equipmentLubricationType: '',
        deviceName: '',
        equipmentItemNumber: '',
      },
      versionNumber: null, //存储URL的版本号
      versionNumberType: null, //存储URL的版本号
      selectedRowKeys: [],
      value1: '',
      dateilInfo: {},
      workLocationSelect: [], //作业位置数组
      form: {},
      visble: false,
      visbleRelease: false,
      visbleExcel: false,
      modelConfig: {
        title: '设备检修管理-新增',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      EquipmentDataSource: [],
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
            label: '润滑设备类型', //展示名称
            colSpan: 8,
            formKey: 'equipmentLubricationType', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入设备类型',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'btnInput', //组件类型 目前指出 input || select
            label: '设备名称', //展示名称
            enterText: '选择',
            colSpan: 8,
            formKey: 'deviceName', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请选择设备名称',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '设备位号', //展示名称
            colSpan: 8,
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
            label: '润滑点名称', //展示名称
            colSpan: 8,
            formKey: 'lubricationPointName', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑点名称',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑点规则', //展示名称
            colSpan: 8,
            formKey: 'lubricationRuleDescription', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑点规则',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '制造商', //展示名称
            colSpan: 8,
            formKey: 'manufacturer', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入制造商',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑油供应商', //展示名称
            colSpan: 8,
            formKey: 'lubricatingOilSupplier', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑油供应商',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑油品牌', //展示名称
            colSpan: 8,
            formKey: 'lubricatingOilBrand', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑油品牌',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'inputNumber', //组件类型 目前指出 input || select
            label: '换油周期/天', //展示名称
            colSpan: 8,
            formKey: 'refuelingOilChangeCycle', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入换油周期/天', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入换油周期',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '用量L/KG', //展示名称
            colSpan: 8,
            formKey: 'useLevel', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入用量',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑油型号', //展示名称
            colSpan: 8,
            formKey: 'amount', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入润滑油型号',
                trigger: 'blur',
              }, //校验规
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '润滑油负责人', //展示名称
            colSpan: 8,
            formKey: 'principal', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'textArea', //组件类型 目前指出 input || select
            label: '备注', //展示名称
            colSpan: 24,
            formKey: 'remark', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
        ],
      },
      paginationThree: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      ConfigRelease: {
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
            label: '版本号', //展示名称
            colSpan: 12,
            formKey: 'versionNumber', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '版本描述', //展示名称
            colSpan: 12,
            formKey: 'description', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
        ],
      },
      columnsEquipment: [],
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
          title: '润滑设备类型',
          dataIndex: 'equipmentLubricationType',
          width: 150,
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 150,
        },
        // {
        //   title: "设备编码",
        //   dataIndex: "equipmentCode",
        //   width: 150,
        // },
        {
          title: '设备位号',
          dataIndex: 'equipmentItemNumber',
          width: 150,
        },
        {
          title: '设备制造商 ',
          dataIndex: 'manufacturer',
          width: 150,
          scopedSlots: { customRender: 'temMainPlanNo' },
        },
        {
          title: '润滑点名称 ',
          dataIndex: 'lubricationPointName',
          width: 150,
          scopedSlots: { customRender: 'temMainPlanNo' },
        },
        {
          title: '润滑规则描述',
          dataIndex: 'lubricationRuleDescription',
          width: 150,
        },
        {
          title: '润滑油供应商',
          dataIndex: 'lubricatingOilSupplier',
          width: 150,
        },
        {
          title: ' 润滑油品牌',
          dataIndex: 'lubricatingOilBrand',
          width: 200,
        },
        {
          title: ' 设备换油周期/天',
          dataIndex: 'refuelingOilChangeCycle',
          width: 200,
        },
        {
          title: ' 用量L/KG',
          dataIndex: 'useLevel',
          width: 100,
        },
        // {
        //   title: "数量",
        //   dataIndex: "amount",
        //   width: 100,
        // },

        {
          title: ' 负责人',
          dataIndex: 'principal',
          width: 100,
        },
        {
          title: ' 备注',
          dataIndex: 'remark',
          width: 200,
        },
        {
          fixed: 'right',
          title: '操作',
          width: 165,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      visible: false,
      dataSource: [
        {
          key: '1',
          equipmentName: 1,
        },
      ],
      queryByEqmSelect: [],
      equipmentObject: {},
      equipmentCode: '',
    }
  },
  mounted() {
    this.queryPublicSearchColumn()
    if (this.$route.query.versionNumber) {
      this.versionNumber = this.$route.query.versionNumber
      this.getList(this.$route.query.versionNumber)
      this.versionNumberType = this.$route.query.type
      if (this.$route.query.type == 0) {
        this.columns.splice(this.columns.length - 1, 1)
      }
    } else {
      this.getList()
    }
    this.getQueryByEqmType()
  },
  created() {
    this.queryPageListForUnClass(1, 10, this.equipmentObject)
  },
  methods: {
    paginationChangeInTwo(pagination) {
      this.queryPageListForUnClass(
        pagination.current,
        pagination.pageSize,
        this.equipmentObject
      )
    },
    // 公共查询条件
    queryPublicSearchColumn() {
      queryPublicSearchColumn().then((res) => {
        let arr = []
        res.body.data.forEach((item) => {
          if (item !== null) {
            arr.push({
              label: item.characterDesc,
              type: item.characterCode,
              value: '',
            })
            this.equipmentList = arr
          }
        })
      })
    },
    enterButton(value) {
      this.visibleEquipmentName = true
    },
    // 公共方法查询enterButton
    inSerach() {
      this.equipmentObject = {}
      this.equipmentList.forEach((item) => {
        this.equipmentObject[item.type] = item.value
      })
      this.queryPageListForUnClass(1, 10, this.equipmentObject)
    },
    cancelEquipment() {
      this.visibleEquipmentName = false
    },
    //删除确认框
    confirm(val) {
      this.deleteList(val)
    },
    EquipmentNameClick() {
      console.log(this.selectedRowThree)
      this.$refs.Form.upDate(
        'deviceName',
        'value',
        this.selectedRowThree[0].equipment_name
      )
      this.$refs.Form.upDate(
        'equipmentItemNumber',
        'value',
        this.selectedRowThree[0].equipment_tag_no
      )
      if (this.selectedRowThree[0].equipment_no) {
        this.equipmentCode = this.selectedRowThree[0].equipment_no
      }
      this.visibleEquipmentName = false
    },

    //搜索框查询
    select() {
      this.getList()
    },
    queryPageListForUnClass(pageIndex = 1, pageSize = 10, mapEntity = {}) {
      let params = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        searchMap: mapEntity,
      }
      // queryCommonColumn().then((res) => {
      //   console.log(res, 'res.....')
      //   this.columnsEquipment = []
      //   res.body.data.forEach((item) => {
      //     if (item !== null) {
      //       this.columnsEquipment.push({
      //         title: item.characterDesc,
      //         dataIndex: item.characterCode,
      //         width: 100,
      //       })
      //     }
      //   })
      // })
      this.columnsEquipment = [
        {
          title: '设备名称',
          dataIndex: 'equipment_name',
          width: 100,
        },
        {
          title: '设备位号',
          dataIndex: 'equipment_tag_no',
          width: 100,
        },
        {
          title: '设备编号（设备编码）',
          dataIndex: 'equipment_no',
          width: 130,
        },
        {
          title: '所属设备',
          dataIndex: 'equipment',
          width: 100,
        },
        {
          title: '使用单位',
          dataIndex: 'user',
          width: 100,
        },
        {
          title: '型号规格',
          dataIndex: 'model_and_specification',
          width: 100,
        },
      ]
      queryPageListForUnClass(params).then((res) => {
        this.EquipmentDataSource = res.body.data
        this.paginationThree.current = res.body.pageIndex
        this.paginationThree.total = res.body.total
        this.paginationThree.pageSize = res.body.pageSize
      })
    },
    onSelectChangeThree(selectedRowKeys, selectedRow) {
      this.selectedRowKeysThree = [selectedRowKeys[selectedRowKeys.length - 1]]
      this.selectedRowThree = [selectedRow[selectedRow.length - 1]]
    },
    //清空查询框
    resetForm() {
      this.searchInfo = {
        pageIndex: 1,
        pageSize: 10,
        equipmentLubricationType: '',
        deviceName: '',
        equipmentItemNumber: '',
      }
      this.getList()
    },
    //打开导入弹出框
    addExcel() {
      this.visbleExcel = true
    },

    go() {
      this.$router.push({
        path: '/maintenanceListManagement',
      })
    },
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageIndex = pagination.current
      this.searchInfo.pageSize = pagination.pageSize
      if (this.versionNumber) {
        this.getList(this.versionNumber)
      } else {
        this.getList()
      }
    },

    // 弹出框取消
    cancelClick() {
      this.visble = false
      this.visbleRelease = false
      let formDataListNew = this.Config.formDataList.map((item) => {
        item.value = ''
        return item
      })
      this.Config.formDataList = formDataListNew
    },

    //打开发行弹出框
    addRelease() {
      this.dateilInfo = {}
      this.ConfigRelease.formDataList.forEach((item) => {
        item.value = ''
      })
      this.visbleRelease = true
    },

    //发行
    saveListRelease(val) {
      if (!val.versionNumber) {
        this.$message.warning('版本号不能为空')
        return
      }
      addIssue(val).then((res) => {
        if (res.code == '200') {
          message.success('发布成功')
          this.getList()
          this.visbleRelease = false
        }
      })
    },

    //点击新增
    addPlan() {
      this.selectedRowKeysThree = []
      this.spartPartDataSourceOut = []
      this.spartPartDataSourceKey = []
      this.modelConfig.title = '设备润滑明细-新增'
      this.dateilInfo = {}
      this.Config.formDataList.forEach((item) => {
          if(item.type=='btnInput'||item.formKey=='equipmentItemNumber'){
              item.disabled = true
          }else{
              item.disabled = false;
          }
          item.value = ''
      })
      this.Config.otherConfigurations.forEach((item) => {
        item.disabled = false
      })
      this.visble = true
    },

    //点击编辑
    upDateListDetail(val) {
      this.modelConfig.title = '设备润滑明细-编辑'
      this.visble = true
      this.dateilInfo = val
      this.Config.formDataList.forEach((item) => {
        if (item.formKey == 'equipmentLubricationType'||item.type=='btnInput'||item.formKey=='equipmentItemNumber') {
          item.disabled = true
        } else {
          item.disabled = false
        }
        item.value = val[item.formKey]
      })
      this.Config.otherConfigurations.forEach((item) => {
        item.disabled = false
      })
    },

    //点击查看
    getListDetail(val) {
      this.modelConfig.title = '设备润滑明细-查看'
      this.visble = true
      this.dateilInfo = val
      this.Config.formDataList.forEach((item) => {
        item.value = val[item.formKey]
        item.disabled = true
      })
      this.Config.otherConfigurations.forEach((item) => {
        if (item.emit == 'save') {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },

    //保存详情
    saveList(val) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          let newVal = val
          if (this.equipmentCode) {
            newVal.equipmentCode = this.equipmentCode
          }
          if (this.dateilInfo.id) {
            newVal.id = this.dateilInfo.id
            upDateList(newVal).then((res) => {
              console.log(res)
              if (res.code == '200') {
                message.success('修改成功')
                this.getList()
                this.visble = false
                this.equipmentCode = ''
                let formDataListNew = this.Config.formDataList.map((item) => {
                  item.value = ''
                  return item
                })
                this.Config.formDataList = formDataListNew
                // this.$refs.Form.clearValidate()
              }
              // else if(res.code=='508'){
              //     message.warning("设备润滑类型重复，不可编辑");
              // }
              else {
                message.warning(res.msg)
              }
            })
          } else {
            addList(newVal).then((res) => {
              if (res.code == '200') {
                message.success('保存成功')
                this.getList()
                let formDataListNew = this.Config.formDataList.map((item) => {
                  item.value = ''
                  return item
                })
                this.Config.formDataList = formDataListNew
                console.log(this.$refs.Form)
                this.visble = false
                this.equipmentCode = ''
              }
              // else if(res.code=='508'){
              //     message.warning("设备润滑类型重复，不可新增");
              // }
              else {
                message.warning(res.msg)
              }
            })
          }
        }
      })
      return
    },

    //获取表格列表
    getList(val) {
      if (val) {
        findTableList({
          pageIndex: this.searchInfo.pageIndex,
          pageSize: this.searchInfo.pageSize,
          versionNumber: val,
        }).then((res) => {
          this.dataSource = []
          // console.log(res);
          res.body.data.forEach((item) => {
            if (item) {
              this.dataSource.push(item)
            }
          })
          // this.dataSource = res.body.data
          this.pagination.current = res.body.pageIndex
          this.pagination.pageSize = res.body.pageSize
          this.pagination.total = res.body.total
        })
      } else {
        getList(this.searchInfo).then((res) => {
          this.dataSource = res.body.data
          this.pagination.current = res.body.pageIndex
          this.pagination.pageSize = res.body.pageSize
          this.pagination.total = res.body.total
        })
      }
    },

    getQueryByEqmType() {
      queryByEqmType({}).then((res) => {
        console.log(res)
        this.queryByEqmSelect = res.body
      })
    },

    // //批量删除列表
    // deleteList(val) {
    //   let ids = []
    //   if (val.id) {
    //     ids.push(val.id)
    //   } else {
    //     if (this.selectedRowKeys) {
    //       this.selectedRowKeys.forEach((item) => {
    //         console.log(item)
    //         ids.push(this.dataSource[item].id)
    //       })
    //     }
    //   }
    //   deleteList(ids).then((res) => {
    //     if (this.$route.query.type == 1) {
    //       this.getList(this.$route.query.versionNumber)
    //     } else {
    //       this.getList()
    //     }
    //   })
    // },
    mydelete() {
      //循环选中的值
      console.log(this.selectedRowKeys)
      if (this.selectedRowKeys != '') {
        deleteList(this.selectedRowKeys).then((res) => {
          if (res.code == '200') {
            this.$message.success('删除成功！')
            this.getList()
            this.selectedRowKeys = []
          }
        })
      } else {
        this.$message.error('请至少选择一项！')
      }
    },
    //单选框点击选中
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
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
