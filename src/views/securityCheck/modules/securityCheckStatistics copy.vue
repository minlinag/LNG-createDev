<template>
  <!-- 安全检查统计 -->
  <Breadcrumb>
    <!-- <template slot="breadcrumbButton"> </template> -->
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline">
              <!-- <a-col :span="7"> -->
              <!--<a-form-model-item-->
              <!--label="检查级别:"-->
              <!--:labelCol="{ style: 'width: 100px' }"-->
              <!--&gt;-->
              <!--<a-select-->
              <!--:allowClear="true"-->
              <!--mode="multiple"-->
              <!--style="width: 100%"-->
              <!--show-search-->
              <!--placeholder="请选择检查级别(可多选)"-->
              <!--@change="handleChange"-->
              <!--v-model="level"-->
              <!--&gt;-->
              <!--<a-select-option-->
              <!--v-for="(item, index) in inspectionLevel"-->
              <!--:key="index"-->
              <!--:value="item.value"-->
              <!--&gt;-->
              <!--{{ item.label }}-->
              <!--</a-select-option>-->
              <!--</a-select>-->
              <!--</a-form-model-item>-->
              <!-- </a-col> -->
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="检查类别:"
                  class="mutiple_form"
                >
                  <a-select
                    :allowClear="true"
                    mode="multiple"
                    show-search
                    @change="handleChange"
                    placeholder="请选择检查类别(可多选)"
                    v-model="category"
                  >
                    <a-select-option
                      v-for="(item, index) in inspectionCategory"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="检查时间:"
                  :labelCol="{ style: 'width: 100px' }"
                >
                  <a-range-picker
                    v-model="rqDate"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item>
                  <a-button
                    v-Query
                    class="buttonType"
                    type="primary"
                    @click="search"
                  >
                    查询
                  </a-button>
                  <a-button class="buttonType" @click="resetForm">
                    重置
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>

      <a-table
        :scroll="{ x: 100 }"
        :pagination="false"
        :row-key="(record) => record.id"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
      </a-table>
    </template>
  </Breadcrumb>
</template>
<script>
import { safetyStatistics, findHeade } from '@/api/securityCheck'
export default {
  data() {
    return {
      // 检查级别下拉框
      inspectionLevel: [
        { label: '公司级检查', value: '公司级检查' },
        { label: '部门级检查', value: '部门级检查' },
        { label: '班组级检查', value: '班组级检查' },
      ],
      // 检查类别下拉框
      inspectionCategory: [
        { label: '综合检查', value: '综合检查' },
        { label: '日常检查', value: '日常检查' },
        { label: '专项检查', value: '专项检查' },
        { label: '季节性检查', value: '季节性检查' },
        { label: '重点时段及节假日前检查', value: '重点时段及节假日前检查' },
        { label: '事故类比检查', value: '事故类比检查' },
        { label: '复工复产前检查', value: '复工复产前检查' },
        { label: '外聘专家诊断式检查', value: '外聘专家诊断式检查' },
      ],
      rqDate: [],
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
      //勾选框/选择框组件
      selectedRowKeys: [],
      //回传组件
      echoMap: {},
      level: [],
      category: [],
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        // inspectionLevel: '公司级检查,部门级检查,班组级检查', //检查级别
        // inspectionCategory: '', //检查类别
        startDatetime:'', 
        endDatetime: '',
      },
      tableLevel: [
        {
          title: '公司级检查',
          dataIndex: 'corporateCheck',
          width: 100,
          align: 'center',
        },
        {
          title: '部门级检查',
          dataIndex: 'departmentCheck',
          align: 'center',
          width: 100,
        },
        {
          title: '班组级检查',
          dataIndex: 'classCheck',
          align: 'center',
          width: 100,
        },
      ],
      tableClass: [
        {
          title: '综合检查',
          dataIndex: 'synthesizeCheck',
          align: 'center',
          width: 100,
        },
        {
          title: '日常检查',
          dataIndex: 'dailyCheck',
          align: 'center',
          width: 100,
        },
        {
          title: '专项检查',
          dataIndex: 'specialCheck',
          align: 'center',
          width: 100,
        },
        {
          title: '季节性检查',
          dataIndex: 'seasonCheck',
          align: 'center',
          width: 100,
        },
        {
          title: '重点时段及节假日前检查',
          dataIndex: 'importanceTimeCheck',
          align: 'center',
          width: 140,
        },
        {
          title: '事故类比检查',
          dataIndex: 'accidentCompareCheck',
          align: 'center',
          width: 100,
        },
        {
          title: '复工复产前检查',
          dataIndex: 'resumptionWorkCheck',
          align: 'center',
          width: 120,
        },
        {
          title: '外聘专家诊断式检查',
          dataIndex: 'externalExpertCheck',
          align: 'center',
          width: 140,
        },
      ],
      //页面下方表格的列属性
      tableColumns: [
        {
          title: '检查主体',
          dataIndex: 'checkMainBody',
          width: 100,
          align: 'center',
        },

        {
          title: '检查合计',
          dataIndex: 'checkTotal',
          align: 'center',
          width: 100,
        },
        {
          title: '隐患整改通知单合计',
          dataIndex: 'hiddenDangerNoticeTotal',
          align: 'center',
          width: 100,
        },
        {
          title: '隐患整改回复单合计',
          dataIndex: 'hiddenDangerReplyTotal',
          align: 'center',
          width: 100,
        },
        {
          title: '隐患合计',
          dataIndex: 'hiddenDangerTotal',
          align: 'center',
          width: 100,
        },
        {
          title: '整改合计',
          dataIndex: 'rectificationTotal',
          align: 'center',
          width: 100,
        },
        {
          title: '整改率',
          dataIndex: 'probability',
          align: 'center',
          width: 100,
          className: 'rectificationBg',
        },
      ],
      columns: [],
      //表格中的数据
      dataSource: [],
      applicantList: [],
    }
  },
  created() {
    this.getHeader()
    this.safetyStatistics()
    // this.getapplicant()
  },
  mounted() {},
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    //查询功能
    search() {
      this.columns = [].concat(this.tableColumns)
      if (this.level.length > 0) {
        this.level.forEach((item) => {
          this.tableLevel.forEach((items) => {
            if (items.title == item) {
              this.columns.splice(1, 0, items)
            }
          })
        })
      } else {
        this.tableLevel.forEach((item) => {
          this.columns.splice(1, 0, item)
        })
      }
      if (this.category.length > 0) {
        this.category.forEach((item) => {
          this.tableClass.forEach((items) => {
            if (items.title == item) {
              this.columns.splice(
                this.level.length == 0 ? 4 : this.level.length + 1,
                0,
                items
              )
            }
          })
        })
      } else {
        this.tableClass.forEach((items) => {
          this.columns.splice(
            this.level.length == 0 ? 4 : this.level.length + 1,
            0,
            items
          )
        })
      }
       this.safetyStatistics()
    },
    onChange(value) {
      // console.log(value);
      // let date = value
         this.form.startDatetime= value[0]
        this.form.endDatetime=value[1]
      console.log(this.form)
    },
    getHeader() {
      this.columns = [].concat(this.tableColumns)
      this.tableLevel.forEach((item) => {
        this.columns.splice(1, 0, item)
      })
      this.tableClass.forEach((item) => {
        this.columns.splice(4, 0, item)
      })
      console.log(this.tableColumns)
    },
    safetyStatistics() {
      safetyStatistics(this.form).then((res) => {
        let probabilityCompute = res.body.map((item) => {
          let newItem = item
          newItem.probability = `${
            (isNaN(
              parseInt(newItem.rectificationTotal) /
                parseInt(newItem.hiddenDangerTotal)
            )
              ? 0
              : parseInt(newItem.rectificationTotal) /
                parseInt(newItem.hiddenDangerTotal)) * 100
          }%`

          return newItem
        })

        let totalInitial = {
          corporateCheck: 0,
          departmentCheck: 0,
          classCheck: 0,
          synthesizeCheck: 0,
          dailyCheck: 0,
          specialCheck: 0,
          seasonCheck: 0,
          importanceTimeCheck: 0,
          accidentCompareCheck: 0,
          resumptionWorkCheck: 0,
          externalExpertCheck: 0,
          checkTotal: 0,
          hiddenDangerTotal: 0,
          hiddenDangerNoticeTotal: 0,
          hiddenDangerReplyTotal: 0,
          rectificationTotal: 0,
          checkMainBody: '总计',
          probability: 0,
        }

        for (const key in totalInitial) {
          if (Object.hasOwnProperty.call(totalInitial, key)) {
            let element = totalInitial[key]
            if (key != 'checkMainBody') {
              for (let index = 0; index < probabilityCompute.length; index++) {
                const e = probabilityCompute[index]
                element += +e[key]
              }
              let total = isNaN(element) ? 0 : element

              totalInitial[key] = key == 'probability' ? total + '%' : total
            }
          }
        }
        this.dataSource = [...probabilityCompute, ...[totalInitial]]
      })
    },

    //重置输入
    resetForm() {
      this.level = []
      this.category = []
      this.form = {
        startDatetime:"",
        endDatetime: "",
        // inspectionLevel: '公司级检查,部门级检查,班组级检查', //检查级别
        // inspectionCategory: '', //检查类别
      }
      this.rqDate = []
        this.safetyStatistics()
    },
    //上方小提示框
    success() {
      this.$message.success('This is a success message')
    },
    error() {
      this.$message.error('This is an error message')
    },
    warning() {
      this.$message.warning('This is a warning message')
    },
  },
}
</script>
<style scoped lang="less">
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
.ant-table-tbody /deep/ .rectificationBg {
  background-color: rgb(51, 49, 49) !important;
}
.mutiple_form {
  display: flex;
  align-items: center;
  justify-content: space-around;
  ::v-deep .ant-form-item-control {
    height: 34px;
  }
}
</style>
