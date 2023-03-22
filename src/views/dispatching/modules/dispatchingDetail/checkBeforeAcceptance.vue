<template>
  <div class="container">
    <div class="timeSpan">
      <span>现场于</span>
      <a-date-picker class="dataSpan" v-model="accForm.endTime">
      </a-date-picker>
      <span
        >时间结束，作为工作内容已完结，人员已撤离，作业现场已清理完毕。</span
      >
    </div>
    <!--<div class="timeSpan" v-for="(item, index) in formConfig" :key="index">-->
        <!--<span class="labelStyle">{{ item[0].label }}</span>-->
      <!--<a-input-->
        <!--class="contSpan"-->
        <!--:placeholder="'请输入' + item[0].label"-->
        <!--v-model="item[0].value"-->
      <!--/>-->
      <!--<a-radio-group v-model="item[1].value">-->
        <!--<a-radio :value="1"> 同意 </a-radio>-->
        <!--<a-radio :value="2"> 驳回 </a-radio>-->
        <!--<a-radio :value="3"> 其他 </a-radio>-->
      <!--</a-radio-group>-->
      <!--</div>-->
    <div>
      <a-form-model ref="form" :model="form">
        <a-col :span="19">
          <a-form-model-item label="审批意见">
            <a-textarea
                    v-model="form.opinion"
                    placeholder="请输入部门意见"
                    :auto-size="{ minRows: 6, maxRows: 6 }"
            ></a-textarea>
          </a-form-model-item>
        </a-col>
        <a-col :span="5">
          <a-form-model-item>
            <a-radio-group
                    style="padding-left: 10px"
                    :default-value="1"
                    v-model="form.type"
            >
              <a-radio :value="1"> 同意 </a-radio>
              <a-radio :value="0"> 驳回 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-form-model>
    </div>
    <div class="footer" style="margin-top: 20px">
      <a-button @click="cancelClick">返回</a-button>
      <a-button type="primary" @click="add">确定</a-button>
    </div>
  </div>
</template>

<script>
    import {
        noticeYsAudio,
        historyList
    } from '@/api/dispatching/noticeDocuments'
export default {
  data() {
    return {
        form:{
            type:1,
            opinion:"同意"
        },
      accForm: {
        endTime: '', //作业结束时间
        territory: '', //属地单位意见
        territoryValue: '', //属地单位意见单选
        repair: '', //检维修中心意见
        repairValue: '', //检维修中心意见单选
        workCom: '', //检作业单位意见
        workComValue: '', //检作业单位意见单选
      },
      formConfig: [
        [
          { label: '属地单位验收意见', key: 'territory', value: '' },
          { label: '属地单位验收意见', key: 'territoryValue', value: '' },
        ],
        [
          { label: '检维修中心验收意见', key: 'territory', value: '' },
          { label: '检维修中心验收意见', key: 'territoryValue', value: '' },
        ],
        [
          { label: '作业单位验收意见', key: 'territory', value: '' },
          { label: '作业单位验收意见', key: 'territoryValue', value: '' },
        ],
      ],
    }
  },
  props: {
      checkBeforeAcceptance: {
          type: Object,
      },
  },
  methods: {
      cancelClick(){
        console.log(this.formConfig);
          this.$emit('clear')
      },
      add(){
          this.form.id=this.checkBeforeAcceptance.id;
          noticeYsAudio(this.form).then(res=>{
              console.log(res);
              if(res.code=="200"){
                  this.$emit('clear')
              }
          })
      },
      gethistoryList(){
          historyList({businessId:this.checkBeforeAcceptance.id}).then(res=>{
              console.log(res);
          })
      }
  },
    created(){
      this.gethistoryList()
      console.log(this.checkBeforeAcceptance)
    }
}
</script>

<style lang="less" scoped>
.container {
  width: 800px;
}
.timeSpan {
  display: flex;
  margin-top: 20px;
  width: 100%;
  .labelStyle {
    width: 19%;
  }
  .dataSpan {
    width: 150px;
    margin: 0 10px;
  }
  .contSpan {
    width: 40%;
    margin: 0 10px 0 0;
  }
}
</style>
