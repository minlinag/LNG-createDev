<template>
  <Breadcrumb>
    <!--头部新增删除按钮-->
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: '提交',
            clickName: 'submit',
          },
          {
            value: '打印',
            clickName: 'print',
          },
        ]"
        @print="print"
        @submit="submit"
      ></pe-button>
    </template>
    <template slot="appMain">
      <!--查询控件及按钮-->
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="年份"
                  >
                    <a-date-picker
                      mode="year"
                      placeholder="请选择年份"
                      format="YYYY"
                      valueFormat="YYYY"
                      v-model="searchForm.year"
                      :open="yearShowOne"
                      @openChange="openChangeOne"
                      @panelChange="panelChangeOne"
                      :allowClear="false"
                    />
                  </a-form-model-item>
                </a-col>
                <a-form-model-item>
                  <a-button
                    class="buttonType"
                    type="primary"
                    @click.stop="queryClick()"
                  >
                    查询
                  </a-button>
                  <!-- <a-button class="buttonType" @click.stop="resetClick()">
                    重置
                  </a-button> -->
                </a-form-model-item>
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
      </div>

      <!--表格-->
      <div id="o">
        <a-table
          ref="print"
          id="printContent"
          class="list_table_1"
          :scroll="{ y: 1, x: 1900 }"
          rowKey="id"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: getCheckboxProps,
            columnWidth: 30,
          }"
          :columns="columns"
          :dataSource="dataSource"
          :openSelector="true"
          :rowClassName="getRowClassname"
          :pagination="false"
        >
          <template slot="recordStatus" slot-scope="text">
            {{ text | recordStatus }}
          </template>
          <template slot="operation" slot-scope="row">
            <div class="wrapper" style="display: flex">
              <pe-button
                v-if="row.reportDate != '合计'"
                :include="[
                  {
                    value: '审批',
                    type: 'link',
                    clickName: 'confirm',
                    icon: '',
                    style: ['btn_link'],
                    disabled: $audit.auditDisabled(row.toDoUserCode),
                  },
                  {
                    value: 'View',
                    name: '详情',
                    isPower: false,
                    type: 'link',
                    clickName: 'viewJump',
                    icon: '',
                    style: ['btn_link'],
                  },
                ]"
                @viewJump="confirm(row.id, true)"
                @confirm="confirm(row.id, false)"
              ></pe-button>
            </div>
          </template>
        </a-table>
      </div>
      <a-modal
        title="审批"
        :visible="visible"
        @cancel="handleCancel"
        :footer="null"
        class="from-style bigModel"
        destroyOnClose
      >
        <a-form-model>
          <stepsModel ref="stepsModel" :isShow="isShow" :id="id" />
        </a-form-model>
        <div class="ant-modal-footer">
          <a-button type="primary" @click="handleOk">确定</a-button>
          <a-button @click="handleCancel">返回</a-button>
        </div>
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getListForPage,
  commit,
  approval,
} from '@/api/energyManagement/energyAnalysis/comprehensiveEnergy.js'
import stepsModel from '../../../equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue'
import moment from 'moment'
export default {
  filters: {
    recordStatus(val) {
      let value = ''
      switch (val) {
        case null:
          value = '未提交'
          break
        case '2':
          value = '已提交'
          break
        case '3':
          value = '审批中'
          break
        case '4':
          value = '已审批'
          break
        case '5':
          value = '已拒绝'
          break
        default:
          break
      }
      return value
    },
  },
  components: { stepsModel },
  data() {
    return {
      id: '',
      visible: false,
      yearShowOne: false,
      //勾选框/选择框组件
      selectedRowKeys: [],
      //查询所需的数据
      searchForm: {
        year: moment().format('YYYY'),
      },
      //页面下方表格的列属性
      columns: [
        {
          title: '日期',
          dataIndex: 'reportDate',
          align: 'center',
        },
        {
          title: '外输量（管道）',
          align: 'center',
          children: [
            {
              title: '10⁴Nm³',
              dataIndex: 'pipeOutput',
              align: 'center',
            },
          ],
        },
        {
          title: '外输量（槽车）',
          align: 'center',
          children: [
            {
              title: '10⁴Nm³',
              dataIndex: 'carOutput',
              align: 'center',
            },
          ],
        },
        {
          title: '外输量总计',
          align: 'center',
          children: [
            {
              title: '10⁴Nm³',
              dataIndex: 'totalOutput',
              align: 'center',
            },
          ],
        },
        {
          title: '电',
          align: 'center',
          children: [
            {
              title: 'kw.h',
              dataIndex: 'electricity',
              align: 'center',
            },
          ],
        },
        {
          title: '水',
          align: 'center',
          children: [
            {
              title: 't',
              dataIndex: 'water',
              align: 'center',
            },
          ],
        },
        {
          title: '液氮',
          align: 'center',
          children: [
            {
              title: 't',
              dataIndex: 'nitrogen',
              align: 'center',
            },
          ],
        },
        {
          title: '自耗气',
          align: 'center',
          children: [
            {
              title: 'Nm³',
              dataIndex: 'selfGas',
              align: 'center',
            },
          ],
        },
        {
          title: '柴油',
          align: 'center',
          children: [
            {
              title: 'kg',
              dataIndex: 'diesel',
              align: 'center',
            },
          ],
        },
        {
          title: '综合能耗',
          align: 'center',
          children: [
            {
              title: 'kgce',
              dataIndex: 'totalEnergy',
              align: 'center',
            },
          ],
        },
        {
          title: '单耗',
          align: 'center',
          children: [
            {
              title: 'kgce/10⁴Nm³',
              dataIndex: 'unitConsum',
              align: 'center',
            },
          ],
        },
        {
          title: '节能量',
          align: 'center',
          children: [
            {
              title: '吨标煤',
              dataIndex: 'energySaved',
              align: 'center',
            },
          ],
        },
        {
          title: '节水量',
          align: 'center',
          children: [
            {
              title: '万吨（万立方米）',
              dataIndex: 'waterSaved',
              align: 'center',
            },
          ],
        },
        {
          title: '状态',
          fixed: 'right',
          dataIndex: 'recordStatus',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: 'recordStatus' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 100,
          fixed: 'right',
          align: 'center',
        },
      ],
      //表格中的数据
      dataSource: [],
      isShow: true,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    print() {
      this.$set(this.columns[13], 'fixed', '')
      this.$set(this.columns[14], 'fixed', '')
      this.$nextTick(() => {
        this.$printPage(this.$refs.print)
        this.$set(this.columns[13], 'fixed', 'right')
        this.$set(this.columns[14], 'fixed', 'right')
      })
    },
    submit() {
      if (this.selectedRowKeys.length < 1) {
        this.$message.error('请选择数据')
        return
      }
      commit(this.selectedRowKeys).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功')
          this.getList()
        }
      })
    },
    //合计行  加背景颜色
    getRowClassname(record) {
      if (record.reportDate == '合计') {
        return 'heji'
      }
    },

    //设置合计行 均值行  多选框不可选择
    getCheckboxProps: (record) => ({
      props: {
        disabled:
          record.reportDate === '合计' ||
          (record.recordStatus !== null && record.recordStatus !== '5'),
        name: record.name,
      },
    }),

    // 合计
    getSum() {
      let pipeOutput = 0
      let carOutput = 0
      let totalOutput = 0
      let electricity = 0
      let water = 0
      let nitrogen = 0
      let selfGas = 0
      let diesel = 0
      let totalEnergy = 0
      let unitConsum = 0
      let energySaved = 0
      let waterSaved = 0
      this.dataSource.forEach((item, index) => {
        item.index = index + 1
        //累加
        pipeOutput = this.accAdd(
          pipeOutput,
          isNaN(new Number(item.pipeOutput)) ? 0 : new Number(item.pipeOutput)
        )
        //累加
        carOutput = this.accAdd(
          carOutput,
          isNaN(new Number(item.carOutput)) ? 0 : new Number(item.carOutput)
        )
        //累加
        totalOutput = this.accAdd(
          totalOutput,
          isNaN(new Number(item.totalOutput)) ? 0 : new Number(item.totalOutput)
        )
        //累加
        electricity = this.accAdd(
          electricity,
          isNaN(new Number(item.electricity)) ? 0 : new Number(item.electricity)
        )
        //累加
        water = this.accAdd(
          water,
          isNaN(new Number(item.water)) ? 0 : new Number(item.water)
        )
        //累加
        nitrogen = this.accAdd(
          nitrogen,
          isNaN(new Number(item.nitrogen)) ? 0 : new Number(item.nitrogen)
        )
        //累加
        selfGas = this.accAdd(
          selfGas,
          isNaN(new Number(item.selfGas)) ? 0 : new Number(item.selfGas)
        )
        //累加
        diesel = this.accAdd(
          diesel,
          isNaN(new Number(item.diesel)) ? 0 : new Number(item.diesel)
        )
        //累加
        totalEnergy = this.accAdd(
          totalEnergy,
          isNaN(new Number(item.totalEnergy)) ? 0 : new Number(item.totalEnergy)
        )
        //累加
        unitConsum = this.accAdd(
          unitConsum,
          isNaN(new Number(item.unitConsum)) ? 0 : new Number(item.unitConsum)
        )
        //累加
        energySaved = this.accAdd(
          energySaved,
          isNaN(new Number(item.energySaved)) ? 0 : new Number(item.energySaved)
        )
        //累加
        waterSaved = this.accAdd(
          waterSaved,
          isNaN(new Number(item.waterSaved)) ? 0 : new Number(item.waterSaved)
        )
      })
      let sumData = {
        id: '-999',
        reportDate: '合计',
        pipeOutput: pipeOutput,
        carOutput: carOutput,
        totalOutput: totalOutput,
        electricity: electricity,
        water: water,
        nitrogen: nitrogen,
        selfGas: selfGas,
        diesel: diesel,
        totalEnergy: totalEnergy,
        unitConsum: unitConsum,
        energySaved: energySaved,
        waterSaved: waterSaved,
      }
      this.dataSource.push(sumData)
    },

    // 弹出日历和关闭日历的回调
    openChangeOne(status) {
      if (status) {
        this.yearShowOne = true
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      this.searchForm.year = moment(value._d).format('YYYY')
      this.yearShowOne = false
    },

    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector('.position-changeList')
    },

    //获得表格数据
    getList() {
      getListForPage(this.searchForm).then((res) => {
        this.dataSource = res.body || []
        if (this.dataSource.length > 0) {
          this.getSum()
        }
      })

      //清空表格多选框
      this.selectedRowKeys = []
    },

    //加法
    accAdd(arg1, arg2) {
      var r1, r2, m
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      return (arg1 * m + arg2 * m) / m
    },

    //当表格复选框改变是触发，选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    //查询功能
    queryClick() {
      this.getList()
    },

    confirm(id, detail) {
      if (detail) {
        this.isShow = false
      } else {
        this.isShow = true
      }
      this.id = id
      this.visible = true
    },
    handleOk() {
      const data = {
        id: this.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      }
      approval(data)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('审批成功')
            this.getList()
          }
          this.handleCancel()
        })
        .catch(() => {})
    },
    handleCancel() {
      this.visible = false
      this.id = ''
    },

    //点击查询中的重置，清空查询条件，重新加载表格数据
    // resetClick() {
    //   this.searchForm = {}
    //   this.getList()
    // },
  },
}
</script>
<style scoped>
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout{
  margin-bottom: 0px;
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

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
.TableTop {
  margin-top: 10px;
}
.ant-table-tbody .heji > td {
  font-weight: 600;
}
/* @media print {
  >>> .ant-table-fixed-right.ant-table-fixed {
    height: 200px !important;
  }
} */
</style>
