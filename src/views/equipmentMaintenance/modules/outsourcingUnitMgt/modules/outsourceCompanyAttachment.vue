<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
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
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout-content>
          <a-form-model layout="inline" :model="form">
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 170px' }"
                label="外委单位名称"
              >
                <a-input
                  v-model="form.outsourceCompany"
                  placeholder="请输入"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                label="合同名称:"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-input
                  v-model="form.contractName"
                  placeholder="请输入"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item
                label="状态:"
                :labelCol="{ style: 'width: 170px' }"
              >
                <a-select
                  v-model="form.status"
                  show-search
                  allowClear
                  placeholder="请选择"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @change="handleChange"
                >
                  <a-select-option value="就绪"> 就绪 </a-select-option>
                  <a-select-option value="未就绪"> 未就绪 </a-select-option>
                </a-select>
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
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-layout-content>
      </div>
      <dc-table
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="attachment" slot-scope="row">
          <span class="edit" v-Edit @click="download(row)">{{
            row.fileName
          }}</span>
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                clickName: 'edit',
                type: 'link',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: 'Look',
                clickName: 'look',
                type: 'link',
                name: '查看',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @edit="edit(row)"
            @look="look(row)"
          ></pe-button>
          <!-- <span class="edit" @click="look(row)">查看</span> -->
          <!-- <span class="edit" v-Edit @click="edit(row)">编辑</span> -->
        </template>
      </dc-table>
      <!-- 新增按钮 -->
      <a-modal
        class="from-style bigModel"
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        :title="addNewModelConfig.title"
        :cancelText="addNewModelConfig.cancelText"
        :footer="addNewModelConfig.footer"
        :after-close="addNewAfterClose"
      >
        <FormitemDemo
          ref="Form"
          :echoMap="echoMap"
          :layout="'horizontal'"
          :Config="Config"
          @save="save"
          @cancel="cancel"
          @handleChange="changeCode"
        >
          <template slot="upload">
            <a-form style="margin-top: -44px">
              <a-form-model-item label="相关附件">
                <importConpontsData
                  Text="合同文本"
                  ref="importConpontsData"
                  @fileChange="flieChange"
                  @removeFile="removeFile"
                ></importConpontsData>
              </a-form-model-item>
            </a-form>
            <!--<ImportComponents :Text="'合同上传'" :data="importData" :url="'/fileinfo/insent'"></ImportComponents>-->
          </template>
        </FormitemDemo>
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import utils from '@/utils/url'
import { getListForPage } from '@/api/outsourceCompany'
import {
  add,
  update,
  getCodeById,
  getContractListForPage,
  mydelete,
} from '@/api/outsourceCompanyContract'
import { addIssue } from '@/api/maintenanceManagement'
import importConpontsData from '@/components/importConpontsData'
export default {
  components: {
    importConpontsData: importConpontsData,
  },
  data() {
    return {
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
      //勾选框/选择框组件
      selectedRowKeys: [],
      //upload暂时无用
      // headers: {
      //     authorization: 'authorization-text',
      // },
      //回传组件
      echoMap: {},
      //查看组件中的数值
      LookForm: {},
      selectCompany: [],
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageNum: 1,
        pageSize: 10,
        outsourceCompany: '',
        contractName: '',
        status: undefined,
      },
      //新增是否visible
      visibleAddNew: false,
      //查看是否visible
      visibleLook: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: '950px',
        title: '外委单位合同管理-新增',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      //查看的弹窗的相关设置
      lookModelConfig: {
        width: '950px',
        title: '外委单位',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      //新增界面
      Config: {
        otherConfigurations: [
          {
            type: 'otherTypes', //组件类型 目前指出             其他类型（otherTypes 需要配合插槽使用） || 按钮类型（btn）
            label: '设备名称', //展示名称
            slotScoped: 'upload', //插槽
          },
          {
            //保存button
            type: 'btn',
            label: '保存',
            btnType: 'primary', //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: 'save', //传值内容 拿到当前所有数据包装好的
          },
          {
            //取消button
            type: 'btn',
            label: '取消',
            btnType: '', //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: 'cancel', //传值内容 拿到当前所有数据包装好的
          },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: 'select', //组件类型 目前指出 input || select
            label: '外委单位名称', //展示名称
            formKey: 'outsourceCompany', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '清选择外委单位名称',
                trigger: 'change',
              }, //校验规则
            },
            optionData: [],
            colSpan: 8,
          },
          {
            type: 'select', //组件类型 目前指出 input || select
            label: '外委单位编码', //展示名称
            formKey: 'outsourceCompanyNo', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '180px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: false,
                message: '请输入外委单位名称',
                trigger: 'blur',
              }, //校验规则
            },
            optionData: [],
            colSpan: 8,
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '合同名称', //展示名称
            formKey: 'contractName', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '170px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '请输入合同名称',
                trigger: 'blur',
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '合同编号', //展示名称
            formKey: 'contractNo', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '177px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: false,
                message: '请输入合同编号',
                trigger: 'blur',
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: 'datePickerdis', //组件类型 目前指出 input || select
            label: '合同开始日期', //展示名称
            formKey: 'startDate', //form 定义的 key (必须唯一 || 必须传入)
            format: 'YYYY-MM-DD',
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '170px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '请输入资质证明',
                trigger: 'blur',
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: 'datePickerdis', //组件类型 目前指出 input || select
            label: '合同结束日期', //展示名称
            formKey: 'endDate', //form 定义的 key (必须唯一 || 必须传入)
            format: 'YYYY-MM-DD',
            value: undefined, // 默认值为空字符串 // v-model 绑定值
            placeholder: '请选择', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '170px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '请选择状态',
                trigger: 'blur',
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: 'textArea', //组件类型 目前指出 input || select
            label: '工作内容概述', //展示名称
            formKey: 'workContent', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '125px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: false,
                message: '请输入工作内容概述',
                trigger: 'blur',
              }, //校验规则
            },
            colSpan: 24,
          },
          {
            type: 'select', //组件类型 目前指出 input || select
            label: '状态', //展示名称
            formKey: 'status', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请选择', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '170px' } }, //组件样式 form-item
            optionData: [
              {
                label: '就绪',
                value: '就绪',
              },
              {
                label: '未就绪',
                value: '未就绪',
              },
            ],
            options: {
              // 配置参数
              vDecorator: {
                required: false,
                message: '请选择状态',
                trigger: 'blur',
              }, //校验规则
            },
            colSpan: 8,
          },
        ],
      },
      //没啥用
      handleBlur() {
        console.log('blur')
      },
      handleFocus() {
        console.log('focus')
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
          title: '外委单位名称',
          dataIndex: 'outsourceCompany',
          width: 130,
        },

        {
          title: '合同编号',
          dataIndex: 'contractNo',
          width: 100,
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          width: 170,
        },
        {
          title: '合同开始日期',
          dataIndex: 'startDate',
          width: 170,
        },
        {
          title: '合同结束日期',
          dataIndex: 'endDate',
          width: 200,
        },
        {
          title: '工作内容概述',
          dataIndex: 'workContent',
          width: 130,
        },
        {
          title: '附件',
          scopedSlots: { customRender: 'attachment' },
          width: 100,
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 120,
          fixed: 'right',
        },
      ],
      //表格中的数据
      dataSource: [],
    }
  },
  mounted() {
    this.getList(), this.getOutsourceCompany()
  },
  methods: {
    flieChange(val) {
      this.$refs.importConpontsData.oneFile()
      this.flieChanges = val
      this.fileName = val.name
    },
    removeFile() {
      this.flieChanges = undefined
      this.fileName = ''
    },
    changeCode(value) {
      // console.log(value, 'OK')
      if (value.formKey == 'outsourceCompany') {
        this.selectCompany.forEach((item) => {
          if (item.outsourceCompany == value.value) {
            console.log(item)
            this.Config.formDataList[1].value = item.id
          }
        })
      }
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    //新增弹窗相关按钮
    addNew() {
      this.addNewModelConfig.title = '外委单位合同管理-新增'
      this.visibleAddNew = true
      this.echoMap = {}
      this.Config.otherConfigurations.forEach((item) => {
        if (item.emit == 'save') {
          item.disabled = false
        }
      })
      //重置里面的value，清零
      this.Config.formDataList.forEach((item, index) => {
        this.$set(this.Config.formDataList[index], 'value', '')
        item.disabled = item.formKey == 'outsourceCompanyNo' ? true : false
      })
    },
    //保存按钮
    save(value) {
      console.log(value)
      var startSj = +new Date(value.startDate)
      var endSj = +new Date(value.endDate)
      if (startSj * 1 > endSj * 1) {
        return this.$message.error('开始时间不能大于结束时间。请重新选择')
      }
      //表单校验
      this.$refs.Form.verificationRules((valid) => {
        var formData = new FormData()
        for (var i in value) {
          formData.append(i, value[i])
        }
        formData.append('file', this.flieChanges)
        if (valid) {
          //如果有id，说明应该走修改路线
          if (this.echoMap.id) {
            formData.append('id', this.echoMap.id)
            formData.set('fileName', this.fileName)
            update(formData).then((res) => {
              if (res.code == 200) {
                this.visibleAddNew = false
                this.$message.success('保存成功！')
                this.echoMap = {}
                this.getList()
              } else if (res.code == 508) {
                this.$message.error('外委单位名称重复，请修改后提交')
              } else {
                //console.log(99990000)
                this.$message.error('保存失败')
              }
              this.getList()
            })

            // edit()
          }
          //没有id 走新增路线
          else {
            add(formData).then((res) => {
              if (res.code == 200) {
                this.visibleAddNew = false
                this.$message.success('保存成功！')
                this.echoMap = {}
              } else if (res.code == 508) {
                this.$message.error('外委单位名称重复，请修改后提交')
              } else {
                this.$message.error('保存失败！')
              }
              this.getList()
            })
          }
        }
        //表单验证错误
        else {
          this.$message.error('请输入正确格式的数据！')
        }
        this.getList()
      })
    },
    //删除选项，根据选择的id删除对应数据
    mydelete() {
      if (this.selectedRowKeys != '') {
        mydelete(this.selectedRowKeys).then((res) => {
          if (res.code == '200') {
            this.getList()
            this.$message.success('删除成功！')
          }
        })
      } else {
        this.$message.error('请选择记录！')
      }
    },
    //查看弹窗相关按钮
    look(value) {
      this.Config.formDataList.forEach((item) => {
        item.value = value[item.formKey]
        item.disabled = true
      })
      this.Config.otherConfigurations.forEach((item) => {
        console.log(item)
        if (item.emit == 'save') {
          item.disabled = true
        }
      })
      this.fileName = value.fileName
      this.$nextTick(() => {
        if (value.fileName) {
          this.$refs.importConpontsData.fileList = [
            {
              uid: '1',
              name: value.fileName,
            },
          ]
        }
      })
      this.visibleAddNew = true
    },
    edit(value) {
      this.echoMap = value
      this.addNewModelConfig.title = '外委单位合同管理-编辑'
      this.Config.formDataList.forEach((item) => {
        item.value = value[item.formKey]
        item.disabled = item.formKey == 'outsourceCompanyNo' ? true : false
      })
      this.Config.otherConfigurations.forEach((item) => {
        if (item.type == 'btn') {
          item.disabled = false
        }
      })
      this.fileName = value.fileName
      this.$nextTick(() => {
        if (value.fileName) {
          this.$refs.importConpontsData.fileList = [
            {
              uid: '1',
              name: value.fileName,
            },
          ]
        }
      })
      this.visibleAddNew = true
    },
    //查看下方的按钮
    OK(value) {
      console.log(value, 'OK')
      this.visibleLook = false
    },

    cancel(value) {
      this.visibleAddNew = false
    },
    addNewAfterClose() {
      this.$refs.importConpontsData.removeFile()
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
    getList() {
      getContractListForPage(this.form).then((res) => {
        this.dataSource = res.body.data
        this.pagination.total = res.body.total
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
      })
      this.selectedRowKeys = []
    },
    download(value) {
      window.location.href = utils.baseURL + this.urls + 'relatedId=' + value.id
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageNum = 1
        this.form.pageSize = 10
        this.getList()
      } else {
        this.getList()
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current
      this.form.pageSize = pagination.pageSize
      this.getList()
    },
    //重置输入
    resetForm() {
      this.form = {}
      this.form.pageNum = 1
      this.form.pageSize = 10
      this.getList()
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
    //获取外委单位列表
    getOutsourceCompany() {
      getListForPage({ pageNum: 1, pageSize: 1000 }).then((res) => {
        this.selectCompany = res.body.data
        res.body.data.forEach((item) => {
          this.selectCompany = res.body.data
          this.Config.formDataList[0].optionData.push({
            label: item.outsourceCompany,
            value: item.outsourceCompany,
          })
        })
        // debugger
      })
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
