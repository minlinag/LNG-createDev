<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            { value: 'exportComponent'}
          ]"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
         <div style="position: relative" class="position-kanban">
            <a-form-model :model="searchField" ref="ruleForm" :layout="'inline'">
            <a-col :span="6">
                <a-form-model-item
                :labelCol="{ style: 'width: 120px' }"
                label="日期:"
                >
                <a-range-picker v-model="searchField.time"/>
                </a-form-model-item>
            </a-col>
             <a-col :span="6">
             <a-form-model-item label="设备类别:" prop="classifyId" :labelCol="{ style: 'width: 120px' }">
                    <a-select v-model.trim="searchField.classifyId" placeholder="请选择"
                    :getPopupContainer="getPopupContainer">
                            <a-select-option
                                :value="item.value"
                                :key="index"
                                v-for="(item, index) in selectData">
                            {{ item.label }}
                        </a-select-option>
                        </a-select>
                    </a-form-model-item>
          </a-col>
            <a-col :span="6">
                <a-form-model-item
                :labelCol="{ style: 'width: 120px' }"
                label="设备名称:"
                >
                <a-input
                    v-model="searchField.deviceName"
                    placeholder="请输入"
                ></a-input>
                </a-form-model-item>
            </a-col>
            <!-- <a-col :span="6">
                <a-form-model-item>
                <a-button
                    v-Query
                    class="buttonType"
                    type="primary"
                    @click.stop="search"
                >
                    查询
                </a-button>
                <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
                </a-form-model-item>
            </a-col> -->
            </a-form-model>
         </div>
         <div>KPI参数</div>
        <div style="margin:0 50px 0 60px">
            <a-transfer
            :titles="['KPI参数','KPI参数']"
            :operations="['查询', '重置']"
            :data-source="mockData"
            show-search
            :filter-option="filterOption"
            :selected-keys="selectedKeys"
            :target-keys="targetKeys"
            :render="item => item.title"
            @change="handleChange"
            :scroll="resetForm"
        />
        </div>
    </template>
  </Breadcrumb>
</template>
<script>
import { encode } from '@/api/dataDictionary'
export default {
  name: 'customKanban',
  data() {
    return {
        //设备类别
        selectData: [],
        // 筛选字段
        searchField: {
            time:[],
            classifyId:undefined,
            deviceName:''
        },
        mockData: [{key:1,title:'设备故障率'},{key:2,title:'设备利用率'},{key:3,title:'平均无故障时间'},{key:4,title:'设备完好率'},
        {key:5,title:'仪表自动化系统可用率'},{key:6,title:'交接计量器具检定率'},
        {key:7,title:'压缩机组可用率'},{key:8,title:'泵机组可用率'},{key:9,title:'密封消耗量'}],
        targetKeys: []
    }
  },
  mounted() {
    this.encode()
  },
  methods:{
    resetForm(){
        this.searchField ={
            time:[],
            classifyId:'',
            deviceName:''
        }
        this.targetKeys = [];
    },
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-kanban')
    },
    // 搜索
    filterOption(inputValue, option) {
      return option.title.indexOf(inputValue) > -1;
    },
    // 查询
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys = targetKeys
    },
     // 数据字典-设备类别
    encode() {
      encode('SJZD-SBLB').then((res) => {
        this.selectData = []
        res.body.data.forEach((item) => {
          this.selectData.push({
            value: item.dictname,
            label: item.dictname,
          })
        })
      })
    },
  }
}
</script>
<style lang='less' scoped>
/deep/.ant-transfer-list{
    margin-top: 5px;
    width: calc(50% - 50px)!important;
    height: 450px;
}
// /deep/.ant-transfer-list:nth-child(3){
//   .ant-checkbox{
//      display: none!important;
//   }
// }

</style>
