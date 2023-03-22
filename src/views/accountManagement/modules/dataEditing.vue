<template>
  <Breadcrumb :titleName="'编辑特征主数据'">
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            {
              value: 'determine',
              icon: 'determine-icon',
              name: '确定',
              clickName: 'masterDataAdd',
            },
            {
              value: 'back',
              clickName: 'backClick',
              icon: 'Go-icon',
              name: '返回',
              isPower: false,
            },
          ]"
          @masterDataAdd="masterDataAdd"
          @backClick="backClick"
        ></pe-button>
      </div>
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
          <a-button v-Delete class="buttonType">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <dc-table
        rowKey="characterId"
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
      </dc-table>
      <dc-Model v-model="visible" :modelConfig="modelConfig" :width="'600px'">
        <div class="ModelText">
          <div style="width: 50px;">排序:</div>
          <a-input
            style="width: 150px;"
            placeholder="请输入排列序号"
            v-model="ModelForm.sort"
          />
        </div>
        <div class="ModelBtn">
          <a-button
            type="primary"
            @click="EditaccoutAdd"
            style="margin-right:10px;"
          >
            保存
          </a-button>
          <a-button type="dashed" @click="EditaccoutCancel">
            取消
          </a-button>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  queryPageListForUnClass,
  configDeleteBatch,
  configSave,
} from '@/api/standingBook'
export default {
  props: ['paramsId', 'paginationTotal'],
  data() {
    return {
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
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      visible: false,
      modelConfig: {
        width: '950px',
        title: '修改默认排序',
        cancelText: false,
        footer: '', //是否展示页脚
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
        {
          title: '是否多值',
          dataIndex: 'isMultivalued',
          width: 100,
        },
        {
          title: '是否为查询条件',
          dataIndex: 'isSearch',
          width: 100,
        },
        {
          title: '是否删除',
          dataIndex: 'isDelate',
          width: 100,
        },
        {
          title: '数据来源',
          dataIndex: 'dataSource',
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
      this.getList(page.current, page.pageSize)
    },
    getList(pageIndex = 1, pageSize = 10, characterCode, characterDesc) {
      const that = this
      let params = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        featureClassificId: that.paramsId,
        characterCode: characterCode,
        characterDesc: characterDesc,
      }
      queryPageListForUnClass(params).then((res) => {
        if (res.code == 200) {
          for (let key in res.body.data) {
            for (let keyObj in res.body.data[key]) {
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
          this.dataSource = res.body.data
          this.pagination.current = res.body.pageIndex
          this.pagination.total = res.body.total
          this.pagination.pageSize = res.body.pageSize
        }
      })
    },
    masterDataAdd() {
      configSave({
        characterMasterIdList: this.selectedRowKeys,
        featureClassificId: this.paramsId,
        count: this.paginationTotal,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功')
          this.selectedRowKeys = []
          this.getList()
          this.$emit('backChange')
        }
      })
    },
    backClick() {
      this.$emit('backChange')
    },
    edit(row) {
      this.visible = true
      this.ModelForm = row
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

.ModelText {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
</style>
