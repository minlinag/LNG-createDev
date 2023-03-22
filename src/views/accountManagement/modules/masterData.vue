<template>
  <div>
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'masterDataAdd' },
            {
              value: 'Delete',
              clickName: 'Delete',
              popconfirmPlacement: 'left',
            },
          ]"
          @masterDataAdd="masterDataAdd"
          @Delete="Delete"
        ></pe-button>
        <!-- <a-button
          v-Add
          class="buttonType btn_primary"
          type="primary"
          icon="plus"
          @click.stop="masterDataAdd()"
        >
          新增
        </a-button> -->
        <!-- <a-popconfirm
          placement="left"
          title="您确定要删除该项吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="Delete()"
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
        </a-popconfirm> -->
      </template>
      <template slot="appMain">
        <a-form-model v-model="form" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item>
              <a-input
                v-model="form.characterCode"
                placeholder="请输入特征编码"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item>
              <a-input
                v-model="form.characterDesc"
                placeholder="请输入特征描述"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-form-model-item>
            <a-button v-Query class="buttonType" type="primary" @click="serch">
              查询
            </a-button>
            <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
          </a-form-model-item>
        </a-form-model>

        <dc-table
          @change="paginationChange"
          rowKey="characterId"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :pagination="pagination"
          :scroll="{ y: 1, x: 100 }"
          class="list_table_1"
          :columns="columns"
          :dataSource="dataSource"
          :openSelector="true"
        >
          <template slot="propertyType" slot-scope="row">
            <span>
              {{
                row.propertyType == "0"
                  ? "数字类型"
                  : row.propertyType == "1"
                  ? "字符类型"
                  : ""
              }}
            </span>
          </template>
          <template slot="operation" slot-scope="row">
            <pe-button
              :include="[
                {
                  value: 'Edit',
                  type: 'link',
                  clickName: 'edit',
                  icon: '',
                  style: ['btn_link'],
                },
              ]"
              @edit="edit(row)"
            ></pe-button>
          </template>
        </dc-table>
        <dc-Model
          class="from-style bigModel"
          v-model="visible"
          layout="inline"
          :modelConfig="modelConfig"
        >
          <FormitemDemo
            :echoMap="echoMap"
            :Config="Config"
            @save="save"
            @cancel="cancel"
          ></FormitemDemo>
        </dc-Model>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
import {
  ledgermasterdata,
  characterMasterPost,
  characterMasterPut,
  characterMasterDelete,
} from '@/api/standingBook'
export default {
  data() {
    return {
      echoMap: {},
      selectedRowKeys: [],
      form: {
        characterCode: '',
        characterDesc: '',
      },
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
      modelConfig: {
        width: '950px',
        title: '台账主数据',
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
            label: '特征编码', //展示名称
            formKey: 'characterCode', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            colSpan: 8,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          // {
          //   type: 'input', //组件类型 目前指出 input || select
          //   label: '默认排序', //展示名称
          //   formKey: 'defaultSort', //form 定义的 key (必须唯一 || 必须传入)
          //   value: '', // 默认值为空字符串 // v-model 绑定值
          //   placeholder: '请输入', //输入框为空值的时候展示内容
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   labelStyle: { style: { width: '150px' } }, //组件样式 form-item
          //   colSpan: 8,
          //   options: {
          //     // 暂时开发状态
          //     multiple: true,
          //   },
          // },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '特征描述', //展示名称
            formKey: 'characterDesc', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            colSpan: 8,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'select', //组件类型 目前指出 input || select
            label: '特征类型', //展示名称
            formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
            value: undefined, // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            colSpan: 8,
            optionData: [
              {
                label: '数字类型',
                value: '0',
              },
              {
                label: '字符类型',
                value: '1',
              },
            ],
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '特征单位', //展示名称
            formKey: 'characterUnit', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            colSpan: 8,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '长度', //展示名称
            formKey: 'characterLength', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            colSpan: 8,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'input', //组件类型 目前指出 input || select
            label: '小数位', //展示名称
            formKey: 'decimalPlaces', //form 定义的 key (必须唯一 || 必须传入)
            value: '', // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '150px' } }, //组件样式 form-item
            colSpan: 8,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'radio', //组件类型 目前指出 input || select
            label: '是否查询条件', //展示名称
            formKey: 'isSearch', //form 定义的 key (必须唯一 || 必须传入)
            value: false, // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '240px' } }, //组件样式 form-item
            colSpan: 6,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'radio', //组件类型 目前指出 input || select
            label: '是否公共查询条件', //展示名称
            formKey: 'builtIntag', //form 定义的 key (必须唯一 || 必须传入)
            value: false, // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '240px' } }, //组件样式 form-item
            colSpan: 6,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'radio', //组件类型 目前指出 input || select
            label: '公共特征标记', //展示名称
            formKey: 'commMark', //form 定义的 key (必须唯一 || 必须传入)
            value: false, // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '200px' } }, //组件样式 form-item
            colSpan: 6,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'radio', //组件类型 目前指出 input || select
            label: '是否区间值', //展示名称
            formKey: 'isIntervalvalue', //form 定义的 key (必须唯一 || 必须传入)
            value: false, // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '240px' } }, //组件样式 form-item
            colSpan: 6,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: 'radio', //组件类型 目前指出 input || select
            label: '是否负值', //展示名称
            formKey: 'isNegativevalue', //form 定义的 key (必须唯一 || 必须传入)
            colSpan: 6,
            value: false, // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '240px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          //  {
          //   type: 'radio', //组件类型 目前指出 input || select
          //   label: '是否为成套设备', //展示名称
          //   formKey: 'wholeEquipment', //form 定义的 key (必须唯一 || 必须传入)
          //   colSpan: 6,
          //   value: false, // 默认值为空字符串 // v-model 绑定值
          //   placeholder: '请输入', //输入框为空值的时候展示内容
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   labelStyle: { style: { width: '240px' } }, //组件样式 form-item
          //   options: {
          //     // 暂时开发状态
          //     multiple: true,
          //   },
          // },
          {
            type: 'radio', //组件类型 目前指出 input || select
            label: '是否多值', //展示名称
            formKey: 'isMultivalued', //form 定义的 key (必须唯一 || 必须传入)
            value: false, // 默认值为空字符串 // v-model 绑定值
            placeholder: '请输入', //输入框为空值的时候展示内容
            colSpan: 6,
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '240px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          // {
          //   type: 'radio', //组件类型 目前指出 input || select
          //   label: '是否为查询条件', //展示名称
          //   formKey: 'isSearch', //form 定义的 key (必须唯一 || 必须传入)
          //   value: false, // 默认值为空字符串 // v-model 绑定值
          //   placeholder: '请输入', //输入框为空值的时候展示内容
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   labelStyle: { style: { width: '240px' } }, //组件样式 form-item
          //   options: {
          //     // 暂时开发状态
          //     multiple: true,
          //   },
          // },
          {
            type: 'radio', //组件类型 目前指出 input || select
            label: '是否删除', //展示名称
            formKey: 'isDelete', //form 定义的 key (必须唯一 || 必须传入)
            value: false, // 默认值为空字符串 // v-model 绑定值
            colSpan: 6,
            placeholder: '请输入', //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: '240px' } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
        ],
      },
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
        },
        {
          title: '特征编码',
          dataIndex: 'characterCode',
          width: 100,
        },
        {
          title: '特征类型',
          scopedSlots: { customRender: 'propertyType' },
          width: 100,
        },
        {
          title: '特征描述',
          dataIndex: 'characterDesc',
          width: 100,
        },
        {
          title: '公共特征标记',
          dataIndex: 'commMark',
          width: 100,
        },
        // {
        //   title: '隐藏标记',
        //   dataIndex: 'hideMark',
        //   width: 100,
        // },
        {
          title: '是否公共查询条件',
          dataIndex: 'builtIntag',
          width: 140,
        },
        // {
        //   title: '默认排序',
        //   dataIndex: 'defaultSort',
        //   width: 100,
        // },
        {
          title: '特征单位',
          dataIndex: 'characterUnit',
          width: 100,
        },
        {
          title: '长度',
          dataIndex: 'characterLength',
          width: 100,
        },
        {
          title: '小数位',
          dataIndex: 'decimalPlaces',
          width: 100,
        },
        {
          title: '是否负值',
          dataIndex: 'isNegatuvevakue',
          width: 100,
        },
        {
          title: '是否区间值',
          dataIndex: 'intervalValue',
          width: 100,
        },
        // {
        //   title: '是否多值',
        //   dataIndex: 'isMultivalued',
        //   width: 100,
        // },
        {
          title: '是否为查询条件',
          dataIndex: 'isSearch',
          width: 100,
        },
        // {
        //   title: '是否删除',
        //   dataIndex: 'isDelate',
        //   width: 100,
        // },
        // {
        //   title: '数据来源',
        //   dataIndex: 'dataSource',
        //   width: 100,
        // },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 100,
          fixed: 'right',
        },
      ],
      dataSource: [],
    }
  },
  watch: {},
  mounted() {
    this.getList()
  },
  methods: {
    edit(value) {
      this.modelConfig.title = '台账主数据-编辑'
      let _obj = JSON.parse(JSON.stringify(value))
      for (let key in _obj) {
        _obj[key] =
          _obj[key] == '否'
            ? false
            : _obj[key] == '是'
              ? true
              : _obj[key] == '--'
                ? ''
                : _obj[key]
      }
      this.echoMap = _obj
      this.visible = true
    },
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    //重置输入
    resetForm() {
      this.form = {
        characterCode: '',
        characterDesc: '',
      }
      this.getList(1, 10, this.form.characterCode, this.form.characterDesc)
    },
    serch() {
      //查询
      this.getList(1, 10, this.form.characterCode, this.form.characterDesc)
    },
    paginationChange(pagination) {
      this.getList(pagination.current, pagination.pageSize, this.form.characterCode, this.form.characterDesc)
    },
    // 获取列表数据
    getList(pageIndex = 1, pageSize = 10, characterCode, characterDesc) {
      ledgermasterdata({
        pageIndex: pageIndex,
        pageSize: pageSize,
        characterCode: characterCode,
        characterDesc: characterDesc,
      }).then((res) => {
        for (let key in res.body.data) {
          for (let keyObj in res.body.data[key]) {
            let radioArray = ['isSearch', 'builtIntag', 'commMark', 'isIntervalvalue', 'isNegativevalue', 'wholeEquipment', 'isMultivalued', 'isDelete']
            if (radioArray.includes(keyObj)) {
              keyObj == 'defaultSort'
                ? res.body.data[key][keyObj]
                : (res.body.data[key][keyObj] =
                  res.body.data[key][keyObj] == 0
                    ? '否'
                    : res.body.data[key][keyObj] == 1
                      ? '是'
                      : res.body.data[key][keyObj])
            }
          }
        }
        this.pagination.current = res.body.pageIndex
        this.pagination.total = res.body.total
        this.pagination.pageSize = res.body.pageSize
        this.dataSource = res.body.data
      })
      this.selectedRowKeys = []
    },
    masterDataAdd() {
      this.echoMap = {}
      this.modelConfig.title = '台账主数据-新增'
      let formDataList = this.$lodash.cloneDeep(this.Config.formDataList);
      formDataList.forEach((item, index) => {
        // item.type == 'radio' ? (item.value = false) : (item.value = '')
        if (item.type == 'radio') {
          item.value = false
        } else {
          item.value = ''
        }
        if (item.type == 'input') {
          this.$set(this.Config.formDataList[index], 'value', '')
        }
      })
      this.Config.formDataList = false
      this.Config.formDataList = formDataList
      this.$nextTick(() => {
        this.visible = true
      })

    },
    save(value) {
      let params = {}
      for (let key in value) {
        if (value[key] !== '') {
          params[key] =
            value[key] == false ? 0 : value[key] == true ? 1 : value[key]
        }
      }
      for (const key in value) {
        if (Object.hasOwnProperty.call(value, key)) {
          const element = value[key];
          if (key == 'decimalPlaces') {
            if (isNaN(element) && element !== "") {
              this.$message.warning('长度必须为数字')
              return false
            }

          }
          if (key == 'characterLength' && element !== "") {
            if (isNaN(element)) {
              this.$message.warning('小数位必须为数字')
              return false
            }
          }
        }
      }
      // for (let index = 0; index < array.length; index++) {
      //   const element = array[index];

      // }
      if (value.characterId) {
        characterMasterPut(params).then((res) => {
          this.$message.success('编辑成功')
          this.getList(1, 10, this.form.characterCode, this.form.characterDesc)
        })
      } else {
        characterMasterPost(params).then((res) => {
          this.$message.success('保存成功')
          this.getList(1, 10, this.form.characterCode, this.form.characterDesc)
        })
      }
      this.visible = false
    },
    Delete() {
      if (this.selectedRowKeys.length > 0) {
        characterMasterDelete(this.selectedRowKeys).then((res) => {
          this.$message.success('删除成功')
          this.getList(1, 10, this.form.characterCode, this.form.characterDesc)
        })
      } else {
        this.$message.warning('请选择至少一条数据!')
      }
    },
    cancel(value) {
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
.from-style {
  ::v-deep .ant-col-6 .ant-form-item-label label {
    width: 134px !important;
  }
  ::v-deep .ant-col-6 .ant-form-item-control-wrapper {
    margin-left: 10px;
  }
}
</style>
