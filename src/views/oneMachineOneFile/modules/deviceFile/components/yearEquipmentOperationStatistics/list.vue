<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb :titleName="title">
      <template slot="appMain">
        <a-select
          style="width: 124px; margin-bottom: 20px"
          v-if="yearsOption.length > 0"
          :defaultValue="yearsOption[0]"
          @change="yearsHandleChange"
        >
          <a-select-option
            v-for="(item, index) in yearsOption"
            :key="index"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
        <a-table
          :columns="columns"
          :data-source="tableList"
          rowKey="id"
          :pagination="false"
        >
          <!-- <template slot="footer">
            <div class="footer_style">
              <span>
                <p>年度统计:</p>
                {{ this.statisticAmount }}
              </span>
              <span>
                <p>累计统计:</p>
                {{ this.amountUntreated }}
              </span>
            </div>
          </template> -->
        </a-table>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
import { findAllList, staticAccumulateTotal } from '@/api/oneMachineOneFile/yearEquipmentOperationStatistics'
export default {
  name: 'yearEquipmentOperationStatistics',
  props: ['title', 'deviceCode'],
  data() {
    return {
      columns: [
        {
          title: '月份',
          dataIndex: 'month',
        },
        {
          title: '本月运行小时（h）',
          dataIndex: 'thisMonthHours',
        },
        {
          title: '能耗(kw·h)',
          dataIndex: 'energyConsumption',
        },

        {
          title: '启动（次）',
          dataIndex: 'starts',
        },

        {
          title: '停止（次）',
          dataIndex: 'ends',
        },

        {
          title: '故障（次）',
          dataIndex: 'malfunction',
        },

        {
          title: '记录人',
          dataIndex: 'recorder',
        },

        {
          title: '备注',
          dataIndex: 'remark',
        },
      ],
      queryParams: {
        statisticTime: '',
        deviceCode: this.deviceCode
      },
      tableList: [],
      yearsOption: [],
    }
  },
  created() {
    this.getYearsList()
  },
  methods: {
    getYearsList() {
      findAllList({ deviceCode: this.deviceCode }).then((res) => {
        if (res.code == 200) {
          let body = res.body
          let yearsAllList = []
          body.forEach((element) => {
            yearsAllList.push(element.statisticTime.slice(0, 4))
          })
          yearsAllList.push('2021')
          const yearsConfusedList = Array.from(new Set(yearsAllList))
          this.yearsOption = yearsConfusedList.sort((x, y) => x - y)
          this.yearsHandleChange(this.yearsOption[0])
        }
      })
    },
    yearsHandleChange(val) {
      this.queryParams.statisticTime = val
      this.getList()
    },
    getList() {
      findAllList(this.queryParams).then((res) => {
        if (res.code == 200) {
          let body = res.body
          body.forEach((element) => {
            element.month = element.statisticTime.split('-')[1]
          })
          let bodyPositiveSotr = body.sort((x, y) => x.month - y.month)
          let [...bodyReplenish] = bodyPositiveSotr
          for (
            let index =
              bodyPositiveSotr.length === 0
                ? bodyPositiveSotr.length + 1
                : bodyPositiveSotr.length;
            index < 13;
            index++
          ) {
            bodyReplenish.push({
              month: index < 10 ? '0' + index : index + '',
              thisMonthHours: '',
              energyConsumption: '',
              starts: '',
              ends: '',
              malfunction: '',
              recorder: '',
              remark: '',
            })
          }
          this.tableList = bodyReplenish.sort((x, y) => x.month - y.month)
          let then = this
          staticAccumulateTotal({ statisticTime: this.queryParams.statisticTime, deviceCode: this.queryParams.deviceCode }).then((res) => {
            if (res.code == 200) {
              staticAccumulateTotal({ statisticTime: '', deviceCode: this.queryParams.deviceCode }).then((resData) => {
                if (resData.code == 200) {
                  let year = res.body
                  let data = resData.body
                  let grandTotal = [{
                    ends: year?.accumulateEnd,
                    energyConsumption: year?.accumulateEnergy,
                    malfunction: year?.accumulateMalfunction,
                    month: "年度统计:",
                    recorder: '',
                    remark: "",
                    starts: year?.accumulateStart,
                    thisMonthHours: year?.accumulateHours,
                  }, {
                    ends: data?.accumulateEnd,
                    energyConsumption: data?.accumulateEnergy,
                    malfunction: data?.accumulateMalfunction,
                    month: "累计统计:",
                    recorder: "",
                    remark: "",
                    starts: data?.accumulateStart,
                    thisMonthHours: data?.accumulateHours,
                  }]
                  then.tableList = [...then.tableList, ...grandTotal]
                }
              })
            }
          })
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
.wrapper {
  width: 100%;
}
.form_item_description {
  ::v-deep .ant-form-item-label {
    width: 123px;
    label {
    }
  }
  ::v-deep {
    .ant-form-item-control-wrapper {
      width: calc(100% -123px);
    }
  }
}
.footer_style {
  margin-top: -16px;
  span {
    width: calc(100% + 32px);
    margin-left: -16px;
    display: inline-block;
    line-height: 38px;
    border-bottom: 1px solid #e8e8e8;
    padding-left: 20px;
    p {
      display: inline-block;
      width: 120px;
      margin-bottom: 0;
    }
  }
  span + span {
    background: #f3f5f8;
  }
}
</style>
