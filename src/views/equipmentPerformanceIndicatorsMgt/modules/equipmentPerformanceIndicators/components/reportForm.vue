<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            { value: 'exportComponent'},
            { value: '返回', clickName: 'return', icon:'Go-icon' }
          ]"
          @return="goBack"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
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
          </a-col>
        </a-form-model>
        <table-from :catalogue='catalogue' :data="data">
            <div slot="title">分析报表</div>
        </table-from>
    </template>
  </Breadcrumb>
</template>
<script>
import TableFrom from '../../../../../components/tableFrom.vue'
export default {
  name: 'maintain',
  components:{TableFrom},
  data() {
    return {
        catalogue:[],
        // 类
        catalogueClass:[
            {
            lable: '设备类别',
            value:'a',
            },{
            lable: '数量',
            value:'b',
            },{
            lable: '原值（元）',
            value:'c',
            },{
            lable: '净值（元）',
            value:'d',
            },{
            lable: '新度系数',
            value:'e',
            },{
            lable: '服役年限≤5年',
            value:'f',
            },{
            lable: '5年<服役年限≤10年',
            value:'g',
            },{
            lable: '10年<服役年限≤15年',
            value:'h',
            },{
            lable: '服役年限>15年',
            value:'i',
            },{
            lable: '设备故障率',
            value:'j',
            },{
            lable: '设备利用率',
            value:'k',
            },{
            lable: '平均无故障时间',
            value:'l',
            },{
            lable: '设备完好率',
            value:'o',
            },{
            lable: '备注',
            value:'v',
            }
        ],
        // 单体
        catalogueAlone:[
            {
            lable: '设备类别',
            value:'a',
            },{
            lable: '设备名称',
            value:'a',
            },{
            lable: '设备位号',
            value:'a',
            },{
            lable: '元值（元）',
            value:'a',
            },{
            lable: '净值（元）',
            value:'a',
            },{
            lable: '服役年限≤5年',
            value:'a',
            },{
            lable: '5年<服役年限≤10年',
            value:'a',
            },{
            lable: '10年<服役年限≤15年',
            value:'a',
            },{
            lable: '服役年限>15年',
            value:'a',
            },{
            lable: '设备故障率',
            value:'a',
            },{
            lable: '设备利用率',
            value:'a',
            },{
            lable: '平均无故障时间',
            value:'a',
            },{
            lable: '备注',
            value:'a',
            }
        ],
        data:[ {a:'泵',b:1,c:45,d:45,e:111,f:2,g:6,h:11,i:16,j:'100%',k:'100%',l:45,o:'100%',v:'100%'}],
        // 筛选字段
        searchField: {
            time:[],
        }
    }
  },
  mounted() {
    this.catalogue = this.catalogueClass
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
/* .ant-table-cell {
  white-space: nowrap;
} */
</style>
