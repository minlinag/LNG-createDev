<template>
  <div class="container">
    <div class="fjBox">
      <div class="timeSpan">
        <span class="labelStyle">现场于:</span>
        <span>
          <a-date-picker
            show-time
            v-model="measuresForm.startWorkTime"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
          >
          </a-date-picker>
        </span>
        <span class="lt-pt">开始工作。</span>
      </div>

      <div class="timeSpan">
        <span class="labelStyle">相关作业票:</span>
        <span>
          <a-select
            @change="selectChange"
            mode="multiple"
            placeholder="Inserted are removed"
            style="width: 100%"
            v-model="applicantCodes"
          >
            <a-select-option
              v-for="item in selectAll"
              :key="item"
              :value="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </span>
      </div>
      <div class="timeSpan">
        <span class="labelStyle">备品备件单据:</span>
      </div>
      <div class="timeSpan">
        <span class="labelStyle">相关附件:</span>
        <fileUpload :Text="'物料清单'" @fileChange="flieChange1"></fileUpload>
        <fileUpload :Text="'现场记录'" @fileChange="flieChange2"></fileUpload>
        <fileUpload :Text="'验收报告'" @fileChange="flieChange3"></fileUpload>
      </div>
    </div>
    <div class="table-content">
      <div style="text-align: right">
        <a-button
          class="buttonType btn_primary"
          type="primary"
          icon="plus"
          @click.stop="addList"
        >
          新增
        </a-button>
      </div>
      <a-table
        :scroll="{ x: 100 }"
        :row-key="(record) => record.id"
        :columns="measuresTable"
        :dataSource="tableSpareParts"
        :openSelector="false"
      >
        <template
          :slot="item.dataIndex"
          slot-scope="row, rowAll, index"
          v-for="item in measuresTable"
        >
          <a-input
            type="number"
            :placeholder="'请输入' + item.title"
            v-model.number="rowAll[item.dataIndex]"
            v-if="item.type == 'input'"
          />

          <div v-if="item.type == 'text'">{{ rowAll[item.dataIndex] }}</div>
        </template>
        <template slot="operation" slot-scope="row, rowArr, index">
          <span
            v-Edit
            class="look"
            @click="upDateListDetail(index)"
            style="display: inline-block"
          >
            删除
          </span>
        </template>
      </a-table>
    </div>
    <div v-if="visible">
      <dc-Model v-model="visible" :modelConfig="modelConfig" class="DcModel">
        <div>
          <spareParts
            @spaerClick="spaerClick"
            :spartPartDataSourceKey="spartPartDataSourceKey"
          ></spareParts>
        </div>
      </dc-Model>
    </div>
  </div>
</template>

<script>
import spareParts from './spareParts'
import { getSelect } from '@/api/dispatching/noticeDocuments'
import fileUpload from '@/components/importConpontsData'
import { selectByIds } from '@/api/sparesprt'

export default {
  components: { fileUpload, spareParts },
  data() {
    return {
      spartPartDataSourceKey: [],
      tableSpareParts: [],
      visible: false,
      modelConfig: {
        width: '950px',
        title: '备品备件列表',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      applicantCodes: [],
      selectAll: [],
      measuresTable: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '备件名称',
          dataIndex: 'sparePartName',
          scopedSlots: { customRender: 'sparePartName' },
          type: 'text',
          value: '',
        },
        {
          title: '物资编码',
          dataIndex: 'materialCode',
          scopedSlots: { customRender: 'materialCode' },
          type: 'text',
          value: '',
        },
        {
          title: '规格/型号',
          dataIndex: 'specificationOrMaterial',
          scopedSlots: { customRender: 'specificationOrMaterial' },
          type: 'text',
          value: '',
        },
        {
          title: '数量',
          dataIndex: 'existingNumber',
          scopedSlots: { customRender: 'existingNumber' },
          type: 'input',
          value: '',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
          type: 'text',
          value: '',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          type: 'text',
        },
      ],
    }
  },
  props: {
    measuresForm: {
      type: Object,
    },
    actualSpareParts: {
      type: Array,
    },
  },
  methods: {
    selectChange(val) {
      console.log(val)
      this.measuresForm.applicantCodes = val.join(',')
    },
    getSelect() {
      getSelect({}).then((res) => {
        console.log(res)
        this.selectAll = res.body
      })
    },
    flieChange1(val) {
      this.measuresForm.xcjl = val
    },
    flieChange2(val) {
      this.measuresForm.wlqd = val
    },
    flieChange3(val) {
      this.measuresForm.ysbg = val
    },
    addList() {
      // this.actualSpareParts.push({})
      this.visible = true
    },
    add() {},
    upDateListDetail(index) {
      this.spartPartDataSourceKey.splice(
        this.spartPartDataSourceKey.indexOf(this.tableSpareParts[index].id),
        1
      )
      this.tableSpareParts.splice(index, 1)
    },
    handleChange(index, event) {
      this.spareParts[index].sparePartName = this.selectDate[index].eqm_sbmc
      this.spareParts[index].materialCode = this.selectDate[index].eqm_sbmc
      this.spareParts[index].specificationOrMaterial =
        this.selectDate[index].eqm_sbmc
    },
    // 接收子组件传来的值
    spaerClick(val) {
      this.spartPartDataSourceKey = val
      selectByIds(val).then((res) => {
        if (res.code == '200') {
          let spareParts = []
          res.body.forEach((item) => {
            spareParts.push({
              sparePartName: item.sparePartName, //物料名称
              materialCode: item.materialCode, //物料编码
              specificationOrMaterial: item.specificationOrMaterial, //规格型号
              unit: item.unit ? item.unit : '', //单位
              id: item.id,
              existingNumber: 0,
            })
          })
          if (this.tableSpareParts.length > 0) {
            for (var i = 0; i < spareParts.length; i++) {
              for (var z = 0; z < this.tableSpareParts.length; z++) {
                if (spareParts[i].id == this.tableSpareParts[z].id) {
                  spareParts[i].existingNumber =
                    this.tableSpareParts[z].existingNumber
                }
              }
            }
            this.tableSpareParts = spareParts
          } else {
            this.tableSpareParts = spareParts
          }
          this.visible = false
        }
      })
    },

    //循环赋值
    spartPartDataSourceKey1() {
      this.tableSpareParts = this.spareParts
      let spartPartDataSourceKey = []
      this.spareParts.forEach((item) => {
        spartPartDataSourceKey.push(item.id)
      })
      this.spartPartDataSourceKey = spartPartDataSourceKey
    },
  },
  watchs: {
    measuresForm() {},
    actualSpareParts(val) {
      console.log(val)
    },
  },
  created() {
    console.log(this.measuresForm)
    ;(this.applicantCodes = this.measuresForm.applicantCodes
      ? this.measuresForm.applicantCodes.split(',')
      : []),
      this.getSelect()
  },
}
</script>

<style lang="less" scoped>
.fjBox {
  .timeSpan {
    width: 45%;
    float: left;
    margin: 12px 2.5%;
    display: flex;
    .labelStyle {
      max-width: 100px;
      min-width: 100px;
      display: inline-block;
      text-align: right;
      padding-right: 7px;
    }
    span {
      height: 30px;
      line-height: 30px;
      flex: 1;
    }
    .lt-pt {
      padding-left: 7px;
    }
  }
}
.look {
  color: red;
  cursor: pointer;
}
</style>
