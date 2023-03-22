<template>
  <Breadcrumb>
    <template slot="breadcrumbButton" v-if="selectRowKey[0]">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'masterDataAdd' },
          {
            value: 'Delete',
            clickName: 'delateMaster',
            popconfirmPlacement: 'left',
          },
          {
            value: 'export',
            clickName: 'exportClick',
            icon: 'export-icon',
            name: '模板导出',
          },
          {
            value: 'exportXls',
            clickName: 'exportXlsBtn',
            icon: 'export-icon',
            name: '设备台账导出',
          },
          {
            value: 'importComponent',
            url: `${importUrl}`,
          },
        ]"
        @masterDataAdd="masterDataAdd"
        @delateMaster="delateMaster"
        @exportClick="exportClick"
        @exportXlsBtn="exportXlsBtn"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic">
        <a-layout class="layout-height">
          <a-layout-sider class="tree_layout_sider">
            <a-tree
              @select="onSelect"
              :replace-fields="{
                title: 'classificName',
                key: 'featureClassificid',
              }"
              class="draggable-tree"
              draggable
              :tree-data="gData"
              @dragenter="onDragEnter"
              @drop="onDrop"
            />
          </a-layout-sider>
          <a-layout>
            <a-layout-content>
              <div class="contentLyout">
                <a-form-model :layout="'inline'">
                  <!-- <a-row :gutter="24"> -->
                  <a-col v-for="(item, index) in form" :key="index" :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      :label="item.characterDesc"
                    >
                      <a-input v-model="item.value" placeholder="请输入">
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-form-model-item v-if="form.length > 0">
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

                <a-table
                  :row-selection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                    columnWidth: '30px',
                  }"
                  rowKey="eqmId"
                  @change="paginationChange"
                  :pagination="pagination"
                  :scroll="{ y: dataSource.length > 0 ? 1 : 0, x: 100 }"
                  class="list_table_1"
                  :columns="columns"
                  :dataSource="dataSource"
                  :openSelector="true"
                >
                  <template slot="operation" slot-scope="row">
                    <a-button
                      type="link"
                      v-Edit
                      class="btn_link"
                      style="cursor: pointer"
                      @click="edit(row)"
                    >
                      编辑
                    </a-button>
                  </template>
                </a-table>

                <dc-Model
                  v-model="visible"
                  :modelConfig="modelConfig"
                  class="from-style bigModel"
                  @input="cancel"
                >
                  <FormitemDemo
                    ref="Form"
                    :echoMap="echoMap"
                    :Config="Config"
                    @save="save"
                    @cancel="cancel"
                  >
                  </FormitemDemo>
                </dc-Model>
              </div>
            </a-layout-content>
          </a-layout>
        </a-layout>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import { featureClassification } from '@/api/standingBook'
import {
  queryListForClass,
  pageList,
  querySearchColumnForClass,
  eqmMasterData,
  eqmMasterDataDelete,
  characterMasterPut,
  exportXls,
} from '@/api/equipmentmasterData'
import utils from '@/utils/url'
import jsFileDownload from 'js-file-download'
export default {
  data(vm) {
    return {
      importUrl: '',
      importData: {},
      visible: false,
      modelConfig: {
        title: '新增',
        footer: '',
      },
      echoMap: {},
      formData: {},
      selectedRowKeys: [],
      Config: {
        otherConfigurations: [
          //其他参数类型（非表单控件）
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
            emit: 'cancel', //传值内容 拿到当前所有数据包装好的
          },
        ],
        formDataList: [],
      },
      form: [],
      selectRowKey: [],
      gData: [],
      dataSource: [],
      columns: [],
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
    }
  },
  mounted() {
    this.getListTree()
  },
  methods: {
    //设备台账导出
    exportXlsBtn(row) {
      var dataBox = {
        featureClassificId: this.selectRowKey[0],
        searchMap: {},
        pageIndex: 1,
        pageSize: 10,
      }
      exportXls(dataBox).then((res) => {
        jsFileDownload(res.data, decodeURIComponent(res.headers['filename']))
        // const BLOB = res
        // const fileReader = new FileReader()
        // fileReader.readAsDataURL(BLOB) //对请求返回的文件进行处理
        // fileReader.onload = (e) => {
        //   let a = document.createElement('a')
        //   a.download = '设备台账.xlsx'
        //   a.href = e.target.result
        //   document.body.appendChild(a)
        //   a.click()
        //   document.body.removeChild(a)
        // }
      })
    },
    //模板导出
    exportClick() {
      window.location.href =
        utils.baseURL +
        '/mdm/eqmMasterData/downLoadTemplate?' +
        'featureClassificId=' +
        this.selectRowKey[0]
    },
    edit(row) {
      this.modelConfig.title = '编辑'
      this.Config.formDataList.forEach((item) => {
        if (item.label == '设备编号') {
          item.disabled = true
          return
        }
      })
      this.$nextTick(() => {
        this.echoMap = row
        this.visible = true
      })
    },
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    save(value) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          this.visible = false
          value.classifyId =
            this.selectRowKey.length == 0
              ? this.gData[0].featureClassificid
              : this.selectRowKey[0]
          if (value.eqmId) {
            value.id = value.eqmId
            characterMasterPut(value).then((res) => {
              this.getListTable(value.classifyId)
              this.pageList(
                this.selectRowKey.length == 0
                  ? this.gData.featureClassificid
                  : this.selectRowKey[0],
                1,
                10
              )
              this.echoMap = {}
            })
          } else {
            eqmMasterData(value).then((res) => {
              this.getListTable(value.classifyId)
              this.pageList(
                this.selectRowKey.length == 0
                  ? this.gData.featureClassificid
                  : this.selectRowKey[0],
                1,
                10
              )
              this.echoMap = {}
            })
          }
        }
      })
    },
    cancel() {
      this.echoMap = {}
      this.Config.formDataList.forEach((item) => {
        item.value = ''
      })
      this.$refs.Form.$refs.form.resetFields()
      this.visible = false
    },
    delateMaster() {
      eqmMasterDataDelete(this.selectedRowKeys).then((res) => {
        this.getListTree()
        this.pageList(
          this.selectRowKey.length == 0
            ? this.gData.featureClassificid
            : this.selectRowKey[0],
          1,
          10
        )
      })
    },
    masterDataAdd() {
      this.Config.formDataList.forEach((item) => {
        if (item.label == '设备编号') {
          item.disabled = false
        }
        item.value = undefined
      })
      this.visible = true
    },
    onSelect(value) {
      console.log(value)
      this.selectRowKey = value
      let url = 'mdm/eqmMasterData/importExcel?featureClassificId='
      this.importUrl = url + value[0]
      this.getListTree()
    },
    paginationChange(pagination) {
      this.pageList(
        this.selectRowKey.length == 0
          ? this.gData.featureClassificid
          : this.selectRowKey[0],
        pagination.current,
        pagination.pageSize
      )
    },
    search() {
      let _obj = {}
      for (let i of this.form) {
        _obj[i.characterCode] = i.value
      }
      this.pageList(
        this.selectRowKey.length == 0
          ? this.gData[0].featureClassificid
          : this.selectRowKey[0],
        1,
        10,
        _obj
      )
    },
    //重置输入
    resetForm() {
      // this.form = {};
      let _obj = {}
      this.form.forEach((item) => {
        item.value = ''
      })
      this.pageList(
        this.selectRowKey.length == 0
          ? this.gData[0].featureClassificid
          : this.selectRowKey[0],
        1,
        10,
        _obj
      )
    },
    // 表格头or身体
    getListTable(id) {
      querySearchColumnForClass({ featureClassificId: id }).then((res) => {
        this.form = []
        res.body.data.forEach((item) => {
          this.form.push({
            characterCode: item.characterCode,
            value: '',
            characterDesc: item.characterDesc,
          })
        })
      })
      queryListForClass({ featureClassificId: id }).then((res) => {
        this.Config.formDataList = []
        let listArr = []
        this.formData = {}
        res.body.data.forEach((item) => {
          this.Config.formDataList.push({
            type: 'input', //组件类型 目前指出 input || select  ||  radio || datePicker
            label: item.characterDesc, //展示名称
            formKey: item.characterCode, //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            colSpan: 8, // 每个表单一行展示 总数  24 （自己计算） 跟 col row 一样
            // labelStyle: { style: { width: '220px' } }, //组件样式 form-item
            options: {
              vDecorator: {
                required: item.isRequired == '1' ? true : false,
                message: `请输入${item.characterDesc}`,
                trigger: 'change',
              },
            }, // 配置参数
          })
          listArr.push({
            title: item.characterDesc,
            dataIndex: item.characterCode,
            width: 150,
          })
          this.formData[item.characterCode] = ''
        })
        this.columns = [
          ...listArr,
          {
            title: '操作',
            scopedSlots: { customRender: 'operation' },
            fixed: 'right',
            width: 100,
          },
        ]
      })
    },
    pageList(id, pageIndex = 1, pageSize = 10, searchMap = {}) {
      pageList({
        featureClassificId: id,
        pageIndex: pageIndex,
        pageSize: pageSize,
        searchMap: searchMap,
      }).then((res) => {
        if (res) {
          this.dataSource = res.body.data
          this.pagination.current = res.body.pageIndex
          this.pagination.total = res.body.total
          this.pagination.pageSize = res.body.pageSize
          setTimeout(() => {
            let columnTitle = document.querySelectorAll(
              '.ant-table-column-title'
            )
            let tdTitle = document.querySelectorAll(
              '.ant-table-row-cell-break-word'
            )
            for (let i = 0; i <= columnTitle.length - 1; i++) {
              columnTitle[i].title = columnTitle[i].innerHTML
            }
            for (let j = 0; j <= tdTitle.length - 1; j++) {
              tdTitle[j].title = tdTitle[j].innerHTML
            }
          }, 500)
        }
      })
    },
    // 左侧目录树
    getListTree() {
      featureClassification().then((res) => {
        this.gData = res.body.data
        this.getListTable(
          this.selectRowKey.length == 0
            ? res.body.data[0].featureClassificid
            : this.selectRowKey[0]
        )
        this.pageList(
          this.selectRowKey.length == 0
            ? res.body.data[0].featureClassificid
            : this.selectRowKey[0]
        )
      })
    },
    onDragEnter() {},
    onDrop() {},
  },
}
</script>
<style scoped lang="less">
/deep/.layout-height {
  height: 100%;
}

/deep/#components-layout-demo-basic {
  text-align: unset;
}

.contentLyout {
  margin-left: 20px;
}
</style>
<style>
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
<style lang="less" scoped>
.form_table {
  ::v-deep .ant-form {
    > div {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
}
</style>
