<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
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
      <!-- <a-button v-Add
                class="buttonType btn_primary"
                type="primary"
                icon="plus"
                @click.stop="addNew">
        新增
      </a-button>
      <a-popconfirm placement="left"
                    title="是否删除选中数据"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="mydelete">
        <a-button v-Delete
                  class="buttonType btn_danger"
                  type="danger"
                  icon="delete">
          删除
        </a-button>
      </a-popconfirm> -->
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="外委单位名称"
                >
                  <a-input
                    show-search
                    v-model="form.outsourceCompany"
                    placeholder="请输入外委单位名称"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="创建日期:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-range-picker
                    v-model="startDate"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="状态:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-select
                    v-model="form.status"
                    show-search
                    placeholder="请选择状态"
                    option-filter-prop="children"
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      :value="item.value"
                      v-for="(item, index) in stateInfo"
                      :key="index"
                    >
                      {{ item.label }}
                    </a-select-option>
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
                <a-button class="buttonType" @click="resetForm">
                  重置
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-layout-content>
        </a-layout>
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
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: 'btn_link',
              },
              {
                value: 'View',
                type: 'link',
                icon: '',
                clickName: 'look',
                name: '查看',
                style: 'btn_link',
                isPower: false,
              },
            ]"
            @edit="edit(row)"
            @look="look(row)"
          ></pe-button>
          <!-- <a-button type="link"
                    v-Edit
                    class="btn_link"
                    style="cursor: pointer;"
                    @click="edit(row)">
            编辑
          </a-button>
          <a-button type="link"
                    v-Edit
                    class="btn_link"
                    style="cursor: pointer;"
                    @click="look(row)">
            查看
          </a-button> -->
        </template>
        <template slot="statusOprion" slot-scope="row">
          <span
            v-for="(item, index) in stateInfo"
            v-if="item.value == row"
            :key="index"
          >
            {{ item.label }}
          </span>
        </template>
      </dc-table>

      <!-- 新增按钮 -->
      <dc-Model
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        @input="cancel"
        class="from-style bigModel"
      >
        <FormitemDemo
          ref="Form"
          :echoMap="echoMap"
          :Config="addNewConfig"
          @save="save"
          @cancel="cancel"
        >
          <template slot="upload">
            <a-form style="margin-top: -44px">
              <a-form-model-item label="相关附件">
                <importConpontsData
                  :Text="'资质证明'"
                  ref="importConpontsData"
                  @fileChange="flieChange"
                  @removeFile="removeFile"
                ></importConpontsData>
              </a-form-model-item>
            </a-form>
            <!--<ImportComponents :Text="'合同上传'" :data="importData" :url="'/fileinfo/insent'"></ImportComponents>-->
          </template>
        </FormitemDemo>
      </dc-Model>
      <!-- 右侧蓝字查看的table -->
      <dc-Model v-model="visibleLook" :modelConfig="lookModelConfig">
        <div>
          <a-descriptions layout="vertical" bordered>
            <a-descriptions-item label="ID">
              {{ LookForm.id }}
            </a-descriptions-item>
            <a-descriptions-item label="外委单位名称">
              {{ LookForm.outsourceCompany }}
            </a-descriptions-item>
            <a-descriptions-item label="负责人">
              {{ LookForm.personInCharge }}
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">
              {{ LookForm.contactInformation }}
            </a-descriptions-item>
            <a-descriptions-item label="创建日期">
              {{ LookForm.createdDateTime }}
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              {{ LookForm.StatusName }}
            </a-descriptions-item>
            <a-descriptions-item label="最后修改人">
              {{ LookForm.lastModifiedUser }}
            </a-descriptions-item>
            <a-descriptions-item label="最后修改日期">
              {{ LookForm.lastModifiedDateTime }}
            </a-descriptions-item>
            <a-descriptions-item label="资质证明">
              {{ LookForm.qualificationCertificate }}
            </a-descriptions-item>
            <a-descriptions-item label="主要业务描述">
              {{ LookForm.mainBusinessDescription }}
            </a-descriptions-item>
          </a-descriptions>
          <div class="aaaa">
            <a-button type="primary" style="margin-top: 20px" @click="OK">
              确认
            </a-button>
          </div>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import utils from '@/utils/url'
import {
  add,
  update,
  getListForPage,
  mydelete,
  getdict,
} from '@/api/outsourceCompany'
import importConpontsData from '@/components/importConpontsData'
export default {
  components: {
    importConpontsData: importConpontsData,
  },
  data() {
    return {
      flieChanges: {},
      urls: 'fileinfo/downloadFile?',
      importData: [],
      stateInfo: [],
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
      //查看组件中的数值
      LookForm: {},
      startDate: [],
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageSize: 10,
        pageNum: 1,
        outsourceCompany: '',
        startTime: '',
        endTime: '',
        status: undefined,
      },
      //新增是否visible
      visibleAddNew: false,
      //查看是否visible
      visibleLook: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: '950px',
        title: '外委单位',
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
      addNewConfig: {
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
            type: 'input', //组件类型 目前指出 input || select
            label: '外委单位名称', //展示名称
            formKey: 'outsourceCompany', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '170px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '请输入外委单位名称',
                trigger: 'change',
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '外委单位负责人', //展示名称
            formKey: 'personInCharge', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '200px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '请输入外委单位负责人',
                trigger: 'change',
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '联系方式', //展示名称
            formKey: 'contactInformation', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '请输入联系方式',
                trigger: 'change',
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: 'textArea', //组件类型 目前指出 input || select
            label: '主要业务描述', //展示名称
            formKey: 'mainBusinessDescription', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '120px' } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '请输入工作内容概述',
                trigger: 'change',
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
            optionData: [],
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: '请选择状态',
                trigger: 'change',
              }, //校验规则
            },
            colSpan: 8,
          },
        ],
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
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1}`,
          width: 70,
        },
        {
          title: '外委单位名称',
          dataIndex: 'outsourceCompany',
          width: 140,
        },

        {
          title: '负责人',
          dataIndex: 'personInCharge',
          width: 100,
        },
        {
          title: '联系方式',
          dataIndex: 'contactInformation',
          width: 150,
        },
        {
          title: '主要业务描述',
          dataIndex: 'mainBusinessDescription',
          width: 150,
        },
        {
          title: '创建日期',
          dataIndex: 'createdDateTime',
          width: 200,
        },
        {
          title: '附件',
          scopedSlots: { customRender: 'attachment' },
          width: 100,
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'statusOprion' },
          width: 100,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 120,
          fixed: 'right'
        },
      ],
      //表格中的数据
      dataSource: [],
    }
  },
  mounted() {
    this.getList()
    this.getDict()
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
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    //新增弹窗相关按钮
    addNew() {
      this.addNewModelConfig.title = '外委单位-新增'
      this.echoMap = {}
      let formDataListNew = []
      formDataListNew = this.addNewConfig.formDataList.map((item) => {
        item.disabled = false
        item.value = ''
        return item
      })
      this.addNewConfig.otherConfigurations.forEach(item => {
        if (item.emit == "save") {
          item.disabled = false
        }
      })
      this.addNewConfig.formDataList = formDataListNew
      this.visibleAddNew = true
      //重置里面的value，清零
    },
    //保存按钮
    save(value) {
      //表单校验
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          var formData = new FormData()
          formData.append(`file`, this.flieChanges)
          this.addNewConfig.formDataList.forEach((item) => {
            formData.append(item.formKey, value[item.formKey])
          })
          //如果有id，说明应该走修改路线
          if (value.id) {
            formData.append('id', value.id)
            formData.append('fileName', this.fileName)
            update(formData).then((res) => {
              if (res.code == 200) {
                this.visibleAddNew = false
                this.$refs.importConpontsData.fileList = []
                this.$message.success('保存成功！')
                this.getList()
              } else if (res.code == 508) {
                this.$message.error('外委单位名称重复，请修改后提交')
              } else {
                this.$message.error('保存失败')
              }
            })
            this.echoMap = {}
            // edit()
          }
          //没有id 走新增路线
          else {
            add(formData).then((res) => {
              // debugger;
              if (res.code == 200) {
                //console.log(9999)
                this.visibleAddNew = false
                this.$refs.importConpontsData.fileList = []
                this.$message.success('保存成功！')
              } else if (res.code == 508) {
                this.$message.error('外委单位名称重复，请修改后提交')
              } else {
                //console.log(9999000)
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
      if (this.selectedRowKeys.length !== 0) {
        mydelete(this.selectedRowKeys).then((res) => {
          this.$message.success('删除成功！')
          this.getList()
        })
      } else {
        this.$message.warning('请选择记录！')
      }
    },
    //查看弹窗相关按钮
    look(value) {
      this.lookModelConfig.title = '外委单位-查看'
      this.echoMap = value
      this.addNewConfig.formDataList.forEach((item) => {
        item.value = value[item.formKey]
        item.disabled = true
      })
      this.addNewConfig.otherConfigurations.forEach(item => {
        console.log(item)
        if (item.emit == "save") {
          item.disabled = true
        }
      })
      this.visibleAddNew = true
    },
    edit(value) {
      this.addNewModelConfig.title = '外委单位-编辑'
      this.echoMap = value
      this.importData.relatedId = value.id
      this.visibleAddNew = true
      this.addNewConfig.formDataList.forEach((item) => {
        item.value = value[item.formKey]
        item.disabled = false
      })
      this.addNewConfig.otherConfigurations.forEach(item => {
        if (item.type == 'btn') {
          item.disabled = false;
        }
      })
      this.fileName = value.fileName
      this.$nextTick(() => {
        if (value.fileName) {
          this.$refs.importConpontsData.fileList = [{
            uid: '1',
            name: value.fileName
          }]
        }
      })
    },
    //查看下方的按钮
    OK(value) {
      console.log(value, 'OK')
      this.visibleLook = false
    },

    cancel(value) {
      this.$refs.importConpontsData.fileList = []
      this.visibleAddNew = false
      this.visibleLook = false
    },
    //日期的onchange
    onChange(date, dateString) {
      console.log(date, dateString)
    },

    //获得当前页面
    getList() {
      getListForPage(this.form).then((res) => {
        this.dataSource = res.body.data
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
        this.pagination.total = res.body.total
      })
      this.selectedRowKeys = []
    },
    download(value) {
      window.location.href =
        utils.baseURL + this.urls + 'relatedId=' + value.id
    },
    //查询功能
    search() {
      console.log(this.startDate);
      if (this.form) {
        this.form.pageNum = 1
        this.form.pageSize = 10
        if (this.startDate.length > 0) {
          this.form.startTime = this.startDate[0]
          this.form.endTime = this.startDate[1]
        }
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
      this.startDate = []
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
    getDict() {
      getdict({}).then((res) => {
        console.log(res)
        if (res.code == '200') {
          let selectArray = []
          this.addNewConfig.formDataList.forEach((item) => {
            if (item.formKey == 'status') {
              res.body.data.forEach((items) => {
                selectArray.push({
                  label: items.dictname,
                  value: items.id,
                })
              })
              item.optionData = selectArray
            }
          })
          this.stateInfo = selectArray
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
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
.form_item {
  ::v-deep .ant-form {
    .ant-col-8 {
      height: 55px;
    }
  }
}
</style>
