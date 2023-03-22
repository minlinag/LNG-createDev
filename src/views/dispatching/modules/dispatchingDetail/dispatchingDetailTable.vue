<template>
  <div class="dispatching-content">

    <a-row :span="24">
      <a-form-model :model="form">
        <a-card :bordered="false">
          <a-row :gutter="24">
            <a-col
              :span="item.colSpan"
              v-for="(item, index) in measuresForm"
              :key="index"
            >
              <a-form-model-item
                :label="item.label"
                :label-col="colSpan(item.colSpan)"
                :labelCol="{
                  style: 'width:' + (item.width ? item.width : '150') + 'px',
                }"
              >
                <a-date-picker
                  show-time
                  :disabled="!item.isTrue"
                  v-model="item.value"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                  v-if="item.type == 'dataTime'"
                >
                </a-date-picker>
                <a-date-picker
                        :disabled="!item.isTrue"
                        show-time
                        v-model="item.value"
                        valueFormat="YYYY-MM-DD"
                        format="YYYY-MM-DD"
                        v-if="item.type == 'dataTimes'"
                >
                </a-date-picker>
                <!--input输入框-->
                <a-input
                  :placeholder="'请输入' + item.label"
                  :disabled="!item.isTrue"
                  v-model="item.value"
                  v-if="item.type == 'input'"
                />
                <!--多行输入框-->
                <a-textarea
                  :placeholder="'请输入' + item.label"
                  v-model="item.value"
                  maxlength="1000"
                  :disabled="!item.isTrue"
                  v-if="item.type == 'textArea'"
                  :rows="3"
                />
                <!--下拉框-->
                <a-select
                  v-if="item.type == 'select'"
                  style="width: 100%"
                  show-search
                  :disabled="!item.isTrue"
                  :placeholder="'请选择' + item.label"
                  option-filter-prop="children"
                  v-model="item.value"
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="(items, index) in item.data"
                    :value="items.value"
                    :key="index"
                  >
                    {{ items.label }}
                  </a-select-option>
                </a-select>
                <a-select
                  v-if="item.type == 'selectAll'"
                  mode="multiple"
                  :disabled="!item.isTrue"
                  v-model="item.value"
                  :placeholder="'请选择' + item.label"
                  :default-value="item.value"
                  style="width: 100%"
                >
                  <a-select-option
                    v-for="(items, index) in item.data"
                    :value="items.value"
                    :key="index"
                  >
                    {{ items.label }}
                  </a-select-option>
                </a-select>
                <a-radio-group
                  :disabled="!item.isTrue"
                  v-model="item.value"
                  v-if="item.type == 'radio'"
                  :name="item.labelKey"
                  :default-value="item.data[0]"
                >
                  <a-radio
                    v-for="(items, index) in item.data"
                    :value="items.value"
                    :key="index"
                  >
                    {{ items.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form-model>
    </a-row>
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
          <span v-Edit class="look" @click="upDateListDetail(index)" style="display: inline-block;">
            删除
          </span>
        </template>
      </a-table>

    </div>
  <div v-if="visible" >
    <dc-Model v-model="visible" :modelConfig="modelConfig" class="DcModel" >
      <div>
        <spareParts @spaerClick="spaerClick" :spartPartDataSourceKey="spartPartDataSourceKey"></spareParts>
      </div>
    </dc-Model>
  </div>
  </div>
</template>

<script>
  import spareParts from './spareParts'
  import { getIdListForPage } from '@/api/dispatching/dispatching.js'
  import {selectByIds} from "@/api/sparesprt";
export default {
  name: '',
    components:{spareParts},
  data() {
    return {
      spartPartDataSourceKey:[],
      tableSpareParts:[],
      modelConfig: {
          width: '950px',
          title: '备品备件列表',
          cancelText: false,
          footer: '', //是否展示页脚
      },
      visible:false,
      labelCol: { style: 'width: 160px' },
      rowLabelCol: { style: 'width: 200px' },
      form: {},
      selectDate:[],
    }
  },
  props: {
    measuresForm: {
    },
    measuresTable: {
    },
    spareParts: {
    },
  },
  watch: {
    InformNo() {},
    measuresTable() {},
    spareParts(val) {
        this.spartPartDataSourceKey1();
    },
  },
  component: {
    //someComponent
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    colSpan(value) {
      switch (value) {
        case 12:
          return this.rowLabelCol
        case 24:
          return this.labelCol
      }
    },
    addList() {
        this.visible=true;
    },
    add() {
      console.log(this.dataSource)
    },
    upDateListDetail(index) {
        this.spartPartDataSourceKey.splice(this.spartPartDataSourceKey.indexOf(this.tableSpareParts[index].id), 1)
        this.tableSpareParts.splice(index, 1)
    },
    handleChange(index,event){
        this.spareParts[index].sparePartName=this.selectDate[index].eqm_sbmc;
        this.spareParts[index].materialCode=this.selectDate[index].eqm_sbmc;
        this.spareParts[index].specificationOrMaterial=this.selectDate[index].eqm_sbmc;
    },
    getListForPage(pageNum=1, pageSize=99999){
        const data = {
            pageNum,
            pageSize,
            searchMap:{
                equipment_name:'',
                equipment_tag_no:''
            }
        }
        getIdListForPage(data).then((res)=>{
            if(res.code=='200'){
                this.selectDate=res.body.data;
            }

        })
    },
      // 接收子组件传来的值
      spaerClick(val){
        this.spartPartDataSourceKey=val;
          selectByIds(val).then(res=>{
              if(res.code=='200'){
                  let spareParts=[];
                  res.body.forEach(item=>{
                      spareParts.push({
                          sparePartName:item.sparePartName,//物料名称
                          materialCode:item.materialCode,//物料编码
                          specificationOrMaterial:item.specificationOrMaterial,//规格型号
                          unit:item.unit?item.unit:'',//单位
                          id:item.id,
                          existingNumber:0
                      })
                  })
                  if(this.tableSpareParts.length>0){
                      for(var i=0;i<spareParts.length;i++){
                          for (var z=0;z<this.tableSpareParts.length;z++){
                              if(spareParts[i].id==this.tableSpareParts[z].id){
                                  spareParts[i].existingNumber=this.tableSpareParts[z].existingNumber
                              }
                          }
                      }
                      this.tableSpareParts=spareParts
                  }else{

                      this.tableSpareParts=spareParts
                  }
                  this.visible=false;
              }
          })



      },

      //循环赋值
      spartPartDataSourceKey1(){
          this.tableSpareParts=this.spareParts;
          let spartPartDataSourceKey=[]
          this.spareParts.forEach(item=>{
              spartPartDataSourceKey.push(item.id);
          })
          this.spartPartDataSourceKey=spartPartDataSourceKey
      },
  },
  created() {
      this.spartPartDataSourceKey1()
      // spartPartDataSourceKey
  },
}
</script>

<style scoped lang="less">
.dispatching-content {
  .dispatchingText {
    display: inline-block;
    width: 100%;
    height: 30px;
    border: 1px solid #ddd;
  }
  span {
    cursor: pointer;
    color: #2f54eb;
  }
  /deep/ .ant-form-item-label{
    height: 40px;
    line-height: 40px;
  }
  /deep/ .ant-form-item-label label{
    display: inline-block;
    white-space:pre-wrap !important;
    line-height: normal !important;
  }
}
</style>
