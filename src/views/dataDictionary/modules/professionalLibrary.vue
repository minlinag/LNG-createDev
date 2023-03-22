<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'libraryDataAdd' },
          { value: 'Delete', clickName: 'confirm' },
        ]"
        @libraryDataAdd="libraryDataAdd"
        @confirm="confirm"
      >
      </pe-button>
      <!-- <a-button class="buttonType btn_primary"
                type="primary"
                icon="plus"
                @click.stop="libraryDataAdd">
        新增
      </a-button>
      <a-popconfirm placement="left"
                    title="您确定要删除该项吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="confirm"
                    @cancel="cancel">
        <a-button v-Delete
                  class="buttonType btn_danger"
                  type="danger"
                  icon="delete">
          删除
        </a-button>
      </a-popconfirm> -->
    </template>
    <template slot="appMain">
      <div class="global">
        <div class="left-bar">
          <a-directory-tree
            v-if="treeData.length > 0"
            @select="onSelect"
            :defaultSelectedKeys="[selectedKeys]"
            :replace-fields="{
              children: 'children',
              title: 'label',
              key: 'id',
            }"
            :tree-data="treeData"
            :default-expanded-keys="['SJZD']"
          ></a-directory-tree>
        </div>
        <div class="right-content">
          <a-form-model v-model="form">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="字典名称:"
                >
                  <a-input
                    v-model="form.dictName"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="字典编码:"
                >
                  <a-input
                    v-model="form.dictCode"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-form-model-item>
                <a-button
                  v-Query
                  class="buttonType"
                  type="primary"
                  @click.stop="search()"
                >
                  查询
                </a-button>
                <a-button class="buttonType" @click="resetForm">
                  重置
                </a-button>
              </a-form-model-item>
            </a-row>
          </a-form-model>
          <dc-table
            @change="paginationChange"
            :pagination="pagination"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              columnWidth: '25px',
            }"
            :expanded-row-keys.sync="defaultDeployment"
            :scroll="{ x: 100 }"
            :columns="columns"
            :dataSource="dataSource"
            :openSelector="true"
          >
            <template slot="operation" slot-scope="row">
              <!-- <span v-Edit
                    class="btn_link"
                    style="cursor: pointer;"
                    @click="edit(row)">
                编辑
              </span> -->
              <pe-button
                :include="[
                  {
                    value: 'Edit',
                    type: 'link',
                    clickName: 'edit',
                    icon: '',
                    style: ['btn_link'],
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template>
          </dc-table>
          <dc-Model
            v-model="visible"
            :modelConfig="modelConfig"
            class="from-style middleModel"
          >
            <FormitemDemo
              ref="Form"
              @save="save"
              :Config="Config"
              :echoMap="echoMap"
              @cancel="cancel"
              v-if="visible"
            >
            </FormitemDemo>
          </dc-Model>
        </div>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  encode,
  dictPost,
  dictPut,
  dictDelete,
  encodetreedata,
  dictlist,
} from '@/api/dataDictionary'

export default {
  name: 'ProfessionalLibrary',
  data() {
    return {
      echoMap: {},
      searchValue: '',
      selectedRowKeys: [],
      selectedKeys: 'SJZD',
      defaultDeployment: [],
      form: {
        dictname: '',
        dictcode: '',
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
      visible: false,
      modelConfig: {
        width: '950px',
        title: '数据字典',
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
            emit: 'cancel', //传值内容 拿到当前所有数据包装好的
          },
        ],
        formDataList: [
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '名称', //展示名称
            formKey: 'dictname', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '100px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入字典名称',
                trigger: 'change',
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '字典编码', //展示名称
            formKey: 'dictcode', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '100px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入字典编码',
                trigger: 'change',
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '描述信息', //展示名称
            formKey: 'descinfo', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '100px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入描述信息',
                trigger: 'change',
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '排序', //展示名称
            formKey: 'orderid', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '100px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
        ],
      },
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1}`,
          width: 50,
        },
        {
          title: '字典名称',
          dataIndex: 'dictname',
          width: 100,
          // scopedSlots: { customRender: "dictname" },
        },
        {
          title: '字典编码',
          dataIndex: 'dictcode',
          width: 100,
          // scopedSlots: { customRender: "dictcode" },
        },
        {
          title: '描述信息',
          dataIndex: 'descinfo',
          width: 100,
          // scopedSlots: { customRender: "dictcode" },
        },
        {
          title: '操作',
          width: 100,
          scopedSlots: { customRender: 'operation' },
          // fixed: 'right'
        },
      ],
      dataSource: [],
      treeSelect: [],
      treeData: [],
      expandedKeys: ['0-0-0', '0-0-1'],
    }
  },

  mounted() {
    // this.encodeLLevel(),
    // this.encodeSelect()
    this.dictionList()
    this.encodeTree()
  },
  methods: {
    onSelect(value) {
      this.treeSelect = value
      this.dictionList(1, 10, ...value)
      // this.dictionList(...value)
    },
    edit(value) {
      this.modelConfig.title = '数据字典-编辑'
      let _obj = JSON.parse(JSON.stringify(value))
      for (let key in _obj) {
        _obj[key] =
          _obj[key] == '否' ? false : _obj[key] == '是' ? true : _obj[key]
      }
      this.echoMap = _obj
      this.visible = true
    },
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    search() {
      if (this.treeSelect.length) {
        this.dictionList(
          1,
          10,
          ...this.treeSelect,
          this.form.dictName,
          this.form.dictcode
        )
      } else {
        this.$message.warning('请选择其中一条内容进行查询')
      }
    },
    paginationChange(pagination) {
      this.dictionList(
        pagination.current,
        pagination.pageSize,
        ...this.treeSelect
      )
    },
    libraryDataAdd() {
      this.modelConfig.title = '数据字典-新增'
      this.echoMap = {}
      this.Config.formDataList.map((item, index) => {
        this.$set(this.Config.formDataList[index], 'value', '')
      })
      this.visible = true
    },
    confirm(e) {
      this.Delete()
    },
    onContextMenuClick(treeKey, menuKey) {
      console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`)
    },
    encodeSelect(value = 'SJZD') {
      encode(value).then((res) => {
        for (let key in res.body.data) {
          for (let keyObj in res.body.data[key]) {
            res.body.data[key][keyObj] =
              res.body.data[key][keyObj] == 0
                ? '否'
                : res.body.data[key][keyObj] == 1
                  ? '是'
                  : res.body.data[key][keyObj]
          }
        }
        this.dataSource = res.body.data
      })
      this.selectedRowKeys = []
    },
    save(value) {
      this.echoMap = {}
      value.parentid = this.treeSelect.length == 0 ? 'SJZD' : this.treeSelect[0]
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          if (value.id) {
            dictPut(value).then((res) => {
              // debugger;
              // this.echoMap = {};
              this.dictionList(1, 10, this.treeSelect[0])
            })
            this.visible = false
            this.$message.success('保存成功！')
          } else {
            if (!this.treeSelect.length) {
              this.$message.warning(
                '请选择其中一条内容进行添加并且完整填写内容'
              )
            } else {
              dictPost(value).then((res) => {
                // debugger;
                // this.echoMap = {};
                this.dictionList(1, 10, this.treeSelect[0])
                // this.encodeSelect(this.treeSelect[0])
                this.encodeTree()
              })
              this.visible = false
              this.$message.success('保存成功！')
            }
          }
        } else {
          this.$message.warning('请完整填写内容')
        }
      })
    },
    Delete() {
      if (this.treeSelect.length == 0 || this.selectedRowKeys.length == 0) {
        this.$message.warning('至少选中一项要删除的数据')
      } else {
        dictDelete(this.selectedRowKeys).then((res) => {
          this.$message.success('删除成功')
          this.dictionList(1, 10, this.treeSelect[0])
          // this.encodeSelect(1,10,...this.treeSelect)
          this.encodeTree()
          this.selectedRowKey = []
          this.echoMap = {}
        })
        this.selectedRowKeys = []
      }
    },
    //重置输入
    resetForm() {
      this.form = {}
      // this.$refs.ruleForm.resetFields();
      // this.Config.formDataList.forEach(item => item.type == 'radio' ? item.value = false : item.value = "")
    },
    cancel() {
      this.$refs.Form.$refs.form.resetFields()
      this.visible = false
    },
    encodeTree() {
      encodetreedata('SJZD').then((res) => {
        this.treeData = res.body.data
      })
    },
    dictionList(
      pageIndex = 1,
      pageSize = 10,
      parentId = 'SJZD',
      dictName,
      dictCode
    ) {
      console.log(123123213)
      dictlist({
        pageIndex: pageIndex,
        pageSize: pageSize,
        parentId: parentId,
        dictName: dictName,
        dictCode: dictCode,
      }).then((res) => {
        this.dataSource = res.body.data
        this.pagination.current = res.body.pageIndex
        this.pagination.total = res.body.total
        this.pagination.pageSize = res.body.pageSize
      })
    },
  },
  getTree() {
    datadictionary('SJZD').then((res) => {
      this.treeData = res.body.data
    })
  },
}
</script>
<style scoped lang="less">
.bar {
  width: 100%;
  height: 10px;
  margin-top: 10px;
  background-color: #ececec;
  border-radius: 5px;
}
.ant-form-item {
  margin-bottom: 0px;
}
.global {
  overflow: hidden;
  height: 100%;
  display: flex;
}

.left-bar {
  width: 15%;
  height: 470px;
  margin-right: 10px;
  background-color: #ececec;
}

.select-bar {
  overflow: hidden;
}

.right-content {
  width: 83%;
}

/deep/.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin: 0;
  padding: 0;
}

.equipmentDisplay {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.equipmentSelection {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-left: -17px;
  margin-top: 10px;
}

/deep/.equipmentDisplay-checkbox {
  margin-top: 10px;
}

.head-but {
  float: right;
  margin: 20px;
}

.Myserch {
  display: flex;
  justify-content: end;
}
</style>
