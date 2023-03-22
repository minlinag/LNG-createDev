<template>
  <div>
    <Breadcrumb v-if="!dataEditingShow">
      <template slot="breadcrumbButton" v-if="$route.query.type !== 'see'">
        <a-button
          v-Edit
          class="buttonType btn_primary"
          type="primary"
          icon="plus"
          @click.stop="masterDataAdd()"
        >
          编辑
        </a-button>
        <a-button
          v-Delete
          class="buttonType btn_danger"
          type="danger"
          icon="delete"
          @click.stop="DeleteAccout"
        >
          删除
        </a-button>
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
            <a-button class="buttonType" type="primary" @click="search">
              查询
            </a-button>
            <a-button v-Delete class="buttonType" @click="resetForm">
              重置
            </a-button>
          </a-form-model-item>
        </a-form-model>
        <div class="queryItem"></div>
        <!-- <a-collapse :defaultActiveKey="['1']">
        <a-collapse-panel key="1"
                          header="特征主数据列表"> -->
        <dc-table
          v-if="$route.query.type == 'see'"
          :scroll="{ x: 100 }"
          @change="paginationChange"
          :pagination="pagination"
          :columns="columns"
          :dataSource="dataSource"
          :openSelector="true"
        >
        </dc-table>
        <dc-table
          v-else
          rowKey="configId"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :scroll="{ x: 100 }"
          @change="paginationChange"
          :pagination="pagination"
          :columns="columns"
          :dataSource="dataSource"
          :openSelector="true"
        >
          <template slot="operation" slot-scope="row, text, index">
            <div class="operation-content">
              <a-icon
                :style="{ fontSize: '16px', cursor: 'pointer' }"
                type="caret-up"
                @click="topSort(row, index)"
              />
              <a-icon
                :style="{ fontSize: '16px', cursor: 'pointer' }"
                type="caret-down"
                @click="bottonSort(row, index)"
              />
              <!-- <a-input v-model="row.sort" placeholder="请输入排序顺序"></a-input> -->
              <!-- <p v-Edit
                                style="color: #2440b3;cursor: pointer;width: 50px;margin: 0;padding: 0;margin-left: 10px;"
                                @click="edit(row)">
                                确定
                            </p> -->
            </div>
          </template>
        </dc-table>
        <!-- </a-collapse-panel>
      </a-collapse> -->
        <!-- <dc-Model v-model="visible" :modelConfig="modelConfig" :width="'600px'">
            <div class="ModelText">
                <div style="width: 50px;">排序:</div>
                <a-input style="width: 150px;" placeholder="请输入排列序号" v-model="ModelForm.sort" />
            </div>
            <div class="ModelBtn">
                <a-button type="primary" @click="EditaccoutAdd" style="margin-right:10px;">
                    保存
                </a-button>
                <a-button type="dashed" @click="EditaccoutCancel">
                    取消
                </a-button>
            </div>
        </dc-Model> -->
      </template>
    </Breadcrumb>
    <data-editing
      v-else
      :paramsId="this.$route.query.id"
      :paginationTotal="this.pagination.total"
      @backChange="backChange"
    ></data-editing>
  </div>
</template>
<script>
import {
  pageListGet,
  configDeleteBatch,
  configUpdate,
} from '@/api/standingBook'
import dataEditing from './dataEditing.vue'
export default {
  components: {
    dataEditing,
  },
  data() {
    return {
      dataEditingShow: false,
      form: {},
      selectedRowKeys: [],
      ModelForm: {},
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 20, // 每页条数，所有页设置统一的条数
      },
      // visible: false,
      modelConfig: {
        width: '950px',
        title: '修改默认排序',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      // Config: {
      //     otherConfigurations: [
      //         {
      //             type: 'btn',
      //             label: '保存',
      //             btnType: 'primary',  //button按钮 （根据 vue-ant-design 按钮格式进行操作）
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             emit: 'save' //传值内容 拿到当前所有数据包装好的
      //         },
      //         {
      //             type: 'btn',
      //             label: '取消',
      //             btnType: '',  //button按钮 （根据 vue-ant-design 按钮格式进行操作）
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             emit: 'cancel' //传值内容 拿到当前所有数据包装好的
      //         },

      //     ],
      //     formDataList: [
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '特征编码', //展示名称
      //             selectInputStyle: 'width:183px;',
      //             formKey: 'characterCode', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '默认排序', //展示名称
      //             formKey: 'defaultSort', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '特征描述', //展示名称
      //             formKey: 'characterDesc', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '特征类型', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '特征类型', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '特征单位', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '长度', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '数据来源', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'input', //组件类型 目前指出 input || select
      //             label: '小数位', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: '', // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '100px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '公共特征标记', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '内置标记', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '内置标记', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '隐藏标记', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '是否区间值', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '是否负值', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '是否多值', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '是否为查询条件', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //         {
      //             type: 'radio', //组件类型 目前指出 input || select
      //             label: '是否删除', //展示名称
      //             formKey: 'propertyType', //form 定义的 key (必须唯一 || 必须传入)
      //             value: false, // 默认值为空字符串 // v-model 绑定值
      //             placeholder: '请输入', //输入框为空值的时候展示内容
      //             disabled: false, //是否禁用 true 是禁用 默认是false
      //             labelStyle: { style: { width: '220px' } }, //组件样式 form-item
      //             options: { // 暂时开发状态
      //                 multiple: true,
      //             },
      //         },
      //     ],
      // },
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
          title: '特征编码',
          dataIndex: 'characterCode',
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
        {
          title: '隐藏标记',
          dataIndex: 'hideMark',
          width: 100,
        },
        {
          title: '内置标记',
          dataIndex: 'builtIntag',
          width: 100,
        },
        {
          title: '默认排序',
          dataIndex: 'defaultSort',
          width: 100,
        },
        {
          title: '特征类型编码',
          dataIndex: 'propertyType',
          width: 100,
        },
        {
          title: '特性类型名称',
          dataIndex: 'propertyTypeName',
          width: 100,
        },
        {
          title: '特性单位',
          dataIndex: 'propertyTypeUnit',
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
        {
          title: '是否多值',
          dataIndex: 'isMultivalued',
          width: 100,
        },
        {
          title: '是否为查询条件',
          dataIndex: 'isSearch',
          width: 130,
        },
        {
          title: '排序',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
          width: '70px',
          filtered: true
        },
      ],
      dataSource: [],
    }
  },
  mounted() {
    this.getList()
    if (this.$route.query.type == 'see') {
      this.columns = this.columns.filter(col => col.title !== '排序')
    }

  },
  methods: {
    // 排序往上走
    topSort(row, index) {
      let params = {
        configId: row.configId,
        featureClassificId: row.featureClassificId,
        sort: row.sort,
        sortOpr: 'up',
      }
      configUpdate(params).then((res) => {
        if (res.code == 200) {
          this.getList(this.pagination.current, this.pagination.pageSize)
        }
      })
    },
    // 排序往下走
    bottonSort(row) {
      let params = {
        configId: row.configId,
        featureClassificId: row.featureClassificId,
        sort: row.sort,
        sortOpr: 'bottom',
      }
      configUpdate(params).then((res) => {
        if (res.code == 200) {
          this.getList(this.pagination.current, this.pagination.pageSize)
        }
      })
    },
    search() {
      this.getList(1, 10, this.form.characterCode, this.form.characterDesc)
    },
    EditaccoutAdd() {
      this.visible = false
    },
    EditaccoutCancel() {
      this.visible = false
    },
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    paginationChange(page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.getList(page.current, page.pageSize)
    },
    resetForm() {
      this.form.characterCode = ""
      this.form.characterDesc = ""
      this.getList(1, 10, this.form.characterCode, this.form.characterDesc)
    },
    getList(pageIndex = 1, pageSize = 10, characterCode, characterDesc) {
      const that = this
      let params = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        featureClassificId: that.$route.query.id,
        characterCode: characterCode,
        characterDesc: characterDesc,
      }
      pageListGet(params).then((res) => {
        if (res.code == 200) {
          for (let key in res.body.data) {
            for (let keyObj in res.body.data[key]) {
              keyObj == 'defaultSort' || keyObj == 'sort'
                ? res.body.data[key][keyObj]
                : (res.body.data[key][keyObj] =
                  res.body.data[key][keyObj] == 0
                    ? '否'
                    : res.body.data[key][keyObj] == 1
                      ? '是'
                      : res.body.data[key][keyObj])
            }
          }
          this.dataSource = res.body.data
          this.pagination.current = res.body.pageIndex
          this.pagination.total = res.body.total
          this.pagination.pageSize = res.body.pageSize
        }
      })
    },
    masterDataAdd() {
      this.dataEditingShow = true
      // console.log(
      //   `${'/dataEditing/' +
      //     this.$route.query.id +
      //     '/' +
      //     this.pagination.total}`
      // )
      // /' + this.$route.query.id + '/' + this.pagination.total
      // this.$router.push({
      //   path: '/dataEditing',
      // })
    },
    backChange() {
      this.getList()
      this.dataEditingShow = false
    },
    DeleteAccout() {
      configDeleteBatch(this.selectedRowKeys).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.getList()
          this.selectedRowKeys = []
        }
      })
    },
  },
}
</script>
<style scoped>
.ModelBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
}

.operation-content {
  display: flex;
  align-items: center;
}

.ModelText {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
</style>
