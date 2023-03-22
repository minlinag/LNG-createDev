<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[{ value: 'Add', clickName: 'masterDataAdd' }]"
        @masterDataAdd="masterDataAdd"
      ></pe-button>
    </template>
    <template slot="appMain">
      <a-form-model v-model="form" :layout="'inline'">
        <a-col :span="6">
          <a-form-model-item>
            <a-input
              v-model="form.classificCode"
              placeholder="请输入分类编码"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item>
            <a-input
              v-model="form.classificName"
              placeholder="请输入分类名称"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-form-model-item>
          <a-button v-Query class="buttonType" type="primary" @click="search()">
            查询
          </a-button>
          <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
        </a-form-model-item>
      </a-form-model>
      <dc-table
        :expanded-row-keys.sync="defaultDeployment"
        :customRow="$tableRow"
        rowKey="featureClassificid"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
      >
        <template slot="tzzsj" slot-scope="row">
          <a-button
            type="link"
            class="btn_link"
            style="cursor: pointer"
            v-Edit
            @click="edit(row)"
            >关联
          </a-button>
          <!-- <a-button
            type="link"
            class="btn_link"
            style="cursor: pointer"
            @click="see(row)"
            >查看
          </a-button> -->
        </template>

        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'add',
                name: '新增',
                style: 'btn_link',
                clickName: 'newAddfication',
                icon: '',
                type: 'link',
                isPower: false,
              },
              {
                value: 'edit',
                name: '编辑',
                style: 'btn_link',
                clickName: 'editFication',
                icon: '',
                type: 'link',
                isPower: false,
              },
              {
                value: 'see',
                name: '查看',
                style: 'btn_link',
                clickName: 'see',
                icon: '',
                type: 'link',
                isPower: false,
              },
              {
                value: 'Delete',
                name: '删除',
                style: 'btn_link',
                clickName: 'delateMaster',
                icon: '',
                type: 'link',
                isPower: false,
                popconfirmTitle: '是否删除该节点?',
              },
            ]"
            @newAddfication="newAddfication(row)"
            @editFication="editFication(row)"
            @see="see(row)"
            @delateMaster="confirm(row)"
          ></pe-button>
        </template>
      </dc-table>
      <!-- <dc-Model class="Model" :modelConfig="{ title: '新增分类', footer: null }" v-model="visible"> -->
      <dc-Model class="Model" :modelConfig="modelConfig" v-model="visible">
        <FormitemDemo
          :echoMap="echoMap"
          ref="Form"
          :Config="Config"
          @save="save"
          @Delate="cancel"
          v-if="visible"
        ></FormitemDemo>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  featureClassification,
  featureClassificPost,
  featureClassificDelete,
  featureClassificPut,
} from '@/api/standingBook'
export default {
  data() {
    return {
      form: {},
      echoMap: {},
      selectedRowKeys: [],
      defaultDeployment: [],
      modelConfig: {
        width: '950px',
        title: '特征主数据',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      visible: false,
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
            btnType: 'Delate', //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: 'Delate', //传值内容 拿到当前所有数据包装好的
          },
        ],
        formDataList: [
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '分类编码', //展示名称
            formKey: 'classificCode', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            selectInputStyle: 'width:300px',
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '120px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入分类编码',
                trigger: 'change',
              }, //校验规则
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '上级分类名称', //展示名称
            formKey: 'classificNameIn', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            selectInputStyle: 'width:300px',
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '120px' } }, //组件样式 form-item
            options: {},
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '分类名称', //展示名称
            formKey: 'classificName', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            selectInputStyle: 'width:300px',
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '120px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: '请输入分类名称',
                trigger: 'change',
              }, //校验规则
            },
          },
        ],
      },
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
          width: 50,
        },
        {
          title: '分类编码',
          dataIndex: 'classificCode',
          width: 100,
        },
        {
          title: '分类名称',
          dataIndex: 'classificName',
          width: 100,
        },
        {
          title: '包含的特征主数据',
          scopedSlots: { customRender: 'tzzsj' },
          width: 100,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 100,
        },
      ],
      dataSource: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    save(value) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          for (const key in value) {
            if (Object.hasOwnProperty.call(value, key)) {
              const element = value[key]
              if (element === '--') {
                value[key] = ''
              }
            }
          }
          if (value.featureClassificid) {
            featureClassificPut(value).then(() => {
              this.$message.success('编辑成功')
              this.getList()
            })
          } else {
            featureClassificPost(value).then((res) => {
              this.$message.success('新增成功')
              this.getList()
            })
          }

          this.visible = false
        }
      })
    },
    //重置输入
    resetForm() {
      this.form = {}
      this.getList()
      // this.$refs.ruleForm.resetFields();
      // this.Config.formDataList.forEach(item => item.type == 'radio' ? item.value = false : item.value = "")
    },
    // 列表查询接口
    getList(classificCode = '', classificName = '') {
      // {
      //   classificCode: classificCode,
      //   classificName: classificName,
      // }
      featureClassification(this.form).then((res) => {
        this.dataSource = res.body.data
        // console.log(this.recursion(res.body.data))
      })
    },
    cancel() {
      this.visible = false
    },
    edit(row) {
      this.modelConfig.title = '特征分类-编辑'
      this.$router.push({
        path: '/editAccount',
        query: {
          id: row.featureClassificid,
          type: 'edit',
        },
      })
    },
    see(row) {
      this.$router.push({
        path: '/editAccount',
        query: {
          id: row.featureClassificid,
          type: 'see',
        },
      })
    },
    // 查询
    search() {
      this.getList()
      // this.defaultDeployment = []
      // this.recursion(this.dataSource, (res) => {
      //   if (this.form.classificCode !== '' || this.form.classificCode !== '') {
      //     res.forEach((item) => {
      //       this.defaultDeployment.push(item.featureClassificid)
      //     })
      //   } else {
      //     this.defaultDeployment = []
      //   }
      // })
    },
    // 递归算法
    recursion(list, callback) {
      let _this = this
      for (let i in list) {
        if (list[i].children) {
          let node = _this.recursion(list[i].children)
          if (node !== undefined) {
            callback(node.concat(list[i]))
          }
        }
        if (
          list[i].classificCode.indexOf(this.form.classificCode) > -1 ||
          list[i].classificName.indexOf(this.form.classificName) > -1
        ) {
          return [list[i]]
        }
      }
    },
    newAddfication(row) {
      this.modelConfig.title = '特征分类-新增'
      let params = {
        classificCode: this.form.classificCode,
        classificName: this.form.classificName,
        parentClassificid: row.featureClassificid,
        classificNameIn: row.classificName,
      }
      this.echoMap = params
      this.visible = true
    },
    editFication(row) {
      this.modelConfig.title = '特征分类-编辑'
      row.classificNameIn = row.classificName
      this.echoMap = row
      this.visible = true
    },
    masterDataAdd() {
      this.echoMap = {}
      this.modelConfig.title = '特征分类-新增'
      this.Config.formDataList.forEach((item, index) => {
        this.$set(this.Config.formDataList[index], 'value', '')
      })
      this.visible = true
    },
    delateMaster(row) {
      this.visible = false
    },
    confirm(row) {
      featureClassificDelete({
        featureClassificid: row.featureClassificid,
      }).then((res) => {
        this.getList()
        this.$message.success('删除成功')
      })
    },
  },
}
</script>
<style scoped lang="less">
.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}

.Model /deep/.ant-modal-content {
  width: 500px;
}
</style>
