<template>
  <tableFrom :catalogue="catalogue" :data="data">
    <colgroup slot="colW">
      <col style="width: 25%" />
      <col style="width: 50%" />
      <col style="width: 25%" />
    </colgroup>
    <div slot="title">
      <div class="title">变电站交接班记录</div>
      <div style="float: right">
        {{ `${startWorkTime}-${endWorkTime}` }}
      </div>
    </div>
  </tableFrom>
</template>
<script>
import tableFrom from '@/components/tableFrom.vue'
import moment from 'moment'
export default {
  components: { tableFrom },
  data() {
    return {
      startWorkTime: '',
      endWorkTime: '',
      catalogue: [
        {
          lable: '项目',
          value: 'a', //字段名与data的要对行
          input: false, //是否编辑-- type为编辑且input为true可编辑------
          width: '100px',
        },
        {
          lable: '记事',
          value: 'b', //字段名与data的要对行
          input: false, //是否编辑-- type为编辑且input为true可编辑------
          width: '300px',
        },
        {
          lable: '备注',
          value: 'c', //字段名与data的要对行
          input: false, //是否编辑-- type为编辑且input为true可编辑------
          width: '100px',
        },
      ],
      data: [
        {
          a: '安全生产',
          b: '',
          c: '纪律本班安全生产安排，临时危险性作业的安全措施，各种安全会议等',
          d: 'safePro',
        },
        {
          a: '设备缺陷及故障处理',
          b: '',
          c: '纪律缺陷状况及预防措施，故障处理方法和安全措施',
          d: 'defects',
        },
        {
          a: '值班记事',
          b: '',
          c: '记录设备运行方式及状况，日常工作，交班人员应交代清楚以上两班设备运行状况、需注意事项等',
          d: 'workEvent',
        },
        {
          a: '常用工具及仪表',
          b: '',
          c: '仪表及工器具是否齐全，有无损坏、外借等情况',
          d: 'commonTools',
        },
        {
          a: '定点巡视',
          b: '',
          c: '（每两个小时一次）',
          d: 'timeAround',
        },
        {
          a: '交班电工',
          b: '',
          c: '签字',
          d: 'toWorker',
        },
        {
          a: '接班记事',
          b: '',
          c: '记录设备运行方式及状况，日常工作，交班人员应交代清楚以上两班设备运行状况、需注意事项等',
          d: 'takeEvent',
        },
        {
          a: '接班电工',
          b: '',
          c: '签字',
          d: 'takeWorker',
        },
      ],
    }
  },
  methods: {
    initData(printData) {
      this.startWorkTime = moment(printData.startWorkTime).format(
        'YYYY年MM月DD日'
      )
      this.endWorkTime = moment(printData.endWorkTime).format('YYYY年MM月DD日')
      this.data.forEach((elemtnt, index) => {
        this.$set(this.data[index], 'b', printData[elemtnt.d])
      })
    },
  },
}
</script>
<style lang="less" scoped>
.title {
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  width: 100%;
}
</style>
