<template>
  <!-- 作业许可统计 -->
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <!-- <a-button v-Add
                  class="buttonType btn_primary"
                  type="primary"
                  @click.stop="Hhh">
          <svg-icon class="button_svg"
                    icon-class="export-icon" />
          导出
        </a-button> -->
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  label="作业单位:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-select
                    v-model="form.applicant"
                    placeholder="请选择作业单位"
                    @change="handleChange"
                  >
                    <a-select-option
                      v-for="(item, index) in applicantList"
                      :value="item.Applicant"
                      :key="index"
                    >
                      {{ item.Applicant }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="作业日期:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-range-picker
                    v-model="startDate"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>
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
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>

      <dc-table
        :scroll="{ x: 100 }"
        :pagination="pagination"
        @change="paginationChange"
        :row-key="(record) => record.id"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import { getstatistics, getapplicant } from '@/api/workLicense'
export default {
  data() {
    return {
      startDate: [],
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
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageNum: 1,
        pageSize: 10,
        applicant: undefined,
        // startTime: '',
        // endTime: '',
      },
      //页面下方表格的列属性
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
          align: 'center',
        },
        {
          title: '单位名称',
          dataIndex: 'Applicant',
          width: 180,
          align: 'center',
        },

        {
          title: '一般作业',
          dataIndex: 'A1',
          width: 100,
          align: 'center',
        },
        {
          title: '临时用电作业',
          dataIndex: 'A2',
          width: 100,
          align: 'center',
        },
        {
          title: '动土作业',
          dataIndex: 'A3',
          width: 100,
          align: 'center',
        },
        {
          title: '动火作业',
          dataIndex: 'A4',
          width: 100,
          align: 'center',
        },
        {
          title: '受限空间作业',
          dataIndex: 'A5',
          width: 100,
          align: 'center',
        },
        {
          title: '吊装作业',
          dataIndex: 'A6',
          width: 100,
          align: 'center',
        },
        {
          title: '断路作业',
          dataIndex: 'A7',
          width: 100,
          align: 'center',
        },
        {
          title: '盲板抽堵作业',
          dataIndex: 'A8',
          width: 100,
          align: 'center',
        },
        {
          title: '管线打开作业',
          dataIndex: 'A9',
          width: 100,
          align: 'center',
        },
        {
          title: '高处作业',
          dataIndex: 'A10',
          width: 100,
          align: 'center',
        },
        {
          title: '合计',
          dataIndex: '合计',
          width: 100,
          align: 'center',
        },
      ],
      //表格中的数据
      dataSource: [],
      applicantList: [],
    }
  },
  created() {
    this.getstatistics()
    this.getapplicant()
  },
  mounted() {},
  methods: {
    getapplicant() {
      getapplicant({}).then((res) => {
        console.log(res.body)
        const data = res.body.filter((element) => {
          if (element !== null) {
            return element
          }
        })
        this.applicantList = data
        // console.log( this.applicantList);
      })
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageNum = 1
        this.form.pageSize = 10
        this.form.statisticStartTime = this.startDate[0]
        this.form.statisticEndTime = this.startDate[1]
        console.log(this.form);
        this.getstatistics()
      } else {
        this.getstatistics()
      }
    },
    getstatistics() {
      getstatistics(this.form).then((res) => {
        console.log(this.form)
        const data = res.body.data.filter((element) => {
          if (element !== null) {
            return element
          }
        })
        this.dataSource = data
      })
    },
    handleChange(value) {
      console.log('select', value)
    },
    //日期的onchange
    onChange(date) {
      console.log(date)
      this.form.statisticStartTime = this.startDate[0]
      this.form.statisticEndTime = this.startDate[1]
    },

    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current
      this.form.pageSize = pagination.pageSize
      this.getstatistics()
    },
    //重置输入
    resetForm() {
      this.form = {}
      this.startDate = []
      this.form.pageNum = 1
      this.form.pageSize = 10
      this.getstatistics()
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
    getDict() {},
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
