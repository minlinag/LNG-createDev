<template>
  <div>
    <dc-table
      @change="paginationChange"
      rowKey="id"
      :pagination="pagination"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :scroll="{ x: 100 }"
      :columns="columnsDub"
      :dataSource="dataSource"
      :openSelector="true"
    >
      <template slot="operation" slot-scope="row">
        <pe-button
          :include="[
            {
              value: 'look',
              type: 'link',
              clickName: 'lookClick',
              name: '查看',
              style: ['btn_link'],
            },
          ]"
          @lookClick="checkListClick(row)"
        ></pe-button>
      </template>
    </dc-table>
    <a-form-model-item class="form_but contneFormBtnStyle ant-modal-footer" style="margin: 10px auto" v-if="!isClick">
      <a-button type="primary" @click="addFXOk" :disabled="false">
        确定
      </a-button>
      <a-button @click="onRiskLibraryBack"> 返回 </a-button>
    </a-form-model-item>

    <riskForm
      :risklook-visible.sync="risklookVisible"
      :riskLibraryForm="lookRiskForm"
      @close="closeLookForm"
    ></riskForm>
  </div>
</template>

<script>
import riskForm from './riskForm.vue'

import {
  getListForPage,
  // deleteRisk,
} from '@/api/securityRiskcontrol'
export default {
  components: { riskForm },
  props: {
    dataForm: {
      type: Object,
    },

    // 选中的风险清单列表
    selectedKey: {
      type: Array,
    },
    isClick: {
      //判断是不是需要点击给父组件传值
      type: Boolean,
    },
  },
  created() {
    this.getListForPage(this.dataForm)
    if (this.selectedKey) {
      this.selectedRowKeys = this.selectedKey
    }
  },
  watch: {
    dataForm: {
      deep: true, //true为进行深度监听,false为不进行深度监听
      handler(newVal) {
        this.getListForPage(newVal)
      },
    },
    selectedKey: {
        deep: true, //true为进行深度监听,false为不进行深度监听
        handler(newVal) {
            this.selectedRowKeys = newVal
        },
    },
  },
  data() {
    return {
      risklookVisible:false,
      lookRiskForm: {},
      tableSelectArray: [],
      //勾选框/选择框组件
      selectedRowKeys: [],
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
      //页面下方表格的列属性11
      columnsDub: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
          align: 'center',
        },
        {
          title: '区域名称',
          dataIndex: 'areaName',
          width: 100,
          align: 'center',
        },
        {
          title: '单元名称',
          dataIndex: 'unitName',
          width: 100,
          align: 'center',
        },
        {
          title: '作业活动/设备设施/工序/其他',
          dataIndex: 'otherElse',
          width: 130,
          align: 'center',
          class: 'labelWidth',
        },
        {
          title: '危险因素或潜在事件',
          dataIndex: 'danger',
          width: 140,
          align: 'center',
        },
        {
          title: '主要后果',
          dataIndex: 'consequence',
          width: 120,
          align: 'center',
        },
        {
          title: '现有控制措施',
          dataIndex: 'controlMeasures',
          width: 120,
          align: 'center',
        },
        {
          title: 'L',
          dataIndex: 'll',
          width: 80,
          align: 'center',
        },
        {
          title: 'E',
          dataIndex: 'ee',
          width: 80,
          align: 'center',
        },
        {
          title: 'C',
          dataIndex: 'cc',
          width: 80,
          align: 'center',
        },
        {
          title: 'D',
          dataIndex: 'dd',
          width: 80,
          align: 'center',
        },
        {
          title: '风险评价等级',
          dataIndex: 'riskRateLevel',
          width: 120,
          align: 'center',
        },
        {
          title: '风险管控等级',
          dataIndex: 'riskCtrlLevel',
          width: 120,
          align: 'center',
        },
        {
          title: '建议新增（改进）措施',
          dataIndex: 'newMeasures',
          width: 120,
          align: 'center',
        },
        {
          title: '责任单位',
          dataIndex: 'responsibleUnit',
          width: 120,
          align: 'center',
        },
        {
          title: '责任人',
          dataIndex: 'responsibleUser',
          width: 80,
          align: 'center',
        },
         {
          title: '填报人',
          dataIndex: 'remark',
          width: 120,
          align: 'center',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 50,
          fixed: 'right',
        },
      ],
      dataSource: [],
    }
  },
  methods: {
    checkListClick(row) {
      this.lookRiskForm = row
      this.risklookVisible = true
    },
    closeLookForm(){
      this.risklookVisible = false
    },
    onRiskLibraryBack() {
      this.$emit('close')
    },
    //页面变更
    paginationChange(pagination) {
      this.$emit('getTableList', pagination)
      this.pagination.current = pagination.current
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
      if (this.isClick == true) {
        this.$emit('selectedKey', key)
      }
    },

    addFXOk() {
      this.$emit('selectedKey', this.selectedRowKeys)
    },
    handleFormChange(name) {
      let newL = ''
      let newE = ''
      let newC = ''
      let calculateD = 0
      for (const key in this.riskLibraryForm) {
        if (Object.hasOwnProperty.call(this.riskLibraryForm, key)) {
          const element = this.riskLibraryForm[key]
          if (key === name) {
            this.riskLibraryForm[key] = this.riskLibraryForm[name]
          }
          if (key == 'll') {
            newL = element
          }
          if (key == 'ee') {
            newE = element
          }
          if (key == 'cc') {
            newC = element
          }
        }
      }
      calculateD = newL * newE * newC

      this.riskLibraryForm.dd = calculateD
      if (calculateD > 320) {
        this.riskLibraryForm.riskRateLevel = '重大风险'
        this.riskLibraryForm.riskCtrlLevel = '公司级管控'
      } else if (calculateD > 160) {
        this.riskLibraryForm.riskRateLevel = '较大风险'
        this.riskLibraryForm.riskCtrlLevel = '公司级管控'
      } else if (calculateD > 70) {
        this.riskLibraryForm.riskRateLevel = '一般风险'
        this.riskLibraryForm.riskCtrlLevel = '部室（中心）级管控'
      } else if (calculateD >= 0) {
        this.riskLibraryForm.riskRateLevel = '低风险'
        this.riskLibraryForm.riskCtrlLevel = '班组级管控'
      }
    },
    //获取新增列表val
    getListForPage(val) {
      let data = val.data.map((item) => {
        let newItem = item
        newItem.dd =
          newItem.ll * newItem.ee * newItem.cc
            ? newItem.ll * newItem.ee * newItem.cc
            : '-'
        return newItem
      })
      this.pagination.current = val.pageIndex
      this.pagination.pageSize = val.pageSize
      this.pagination.total = val.total
      this.dataSource = val.data
    },
  },
}
</script>

<style scoped lang="less">
.dc_model {
  ::v-deep .ant-col-8 {
    width: 50%;
  }
  ::v-deep .ant-col {
    margin-top: 6px;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 55px;
  }
  ::v-deep .ant-form-item label {
    white-space: pre-wrap;
  }
}
.risk_form_model {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: calc(50% - 16px);
    // height: 30px;
    margin-bottom: 0px;
    .ant-form-item-label {
      label {
        font-size: 14px;
      }
    }
    .ant-form-explain {
      font-size: 14px;
    }
  }
  .label_overstep {
    ::v-deep .ant-col {
      label {
        width: 115px;
      }
      label::after {
        top: -10.5px;
        margin: 0px -10px 0px 1px;
      }
    }
  }
  .form_textarea {
    height: auto;
    ::v-deep .ant-col {
      height: auto;
    }
  }
}
.form_but {
  width: 100% !important;
  display: flex;
  ::v-deep .ant-form-item-control {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
    .ant-btn + .ant-btn {
      margin-left: 20px;
    }
  }
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
