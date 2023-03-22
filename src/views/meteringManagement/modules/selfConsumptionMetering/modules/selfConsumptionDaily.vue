<template>
  <Breadcrumb>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="仪表名称"
                >
                  <a-input
                    v-model="form.instrumentName"
                    placeholder="请输入仪表名称"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="仪表位号"
                >
                  <a-input
                    v-model="form.instrumentNo"
                    placeholder="请输入仪表位号"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="类别"
                >
                  <a-input
                    v-model="form.category"
                    placeholder="请输入类别"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="日期:"
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

              <a-form-model-item style="float: right">
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
                </a-button></a-form-model-item
              >
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <!-- <div class="queryItem">
        <a-button v-Query class="buttonType" type="primary" @click="search">
          查询
        </a-button>
        <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
      </div> -->
      <!-- <a-collapse :defaultActiveKey="['1']"> -->
      <!-- <a-collapse-panel key="1" header="槽车外输装车记录"> -->
      <a-table
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <!-- <template slot="operation" slot-scope="row">
          <span class="edit" v-Edit @click="">编辑</span>
        </template> -->
      </a-table>
      <!-- </a-collapse-panel> -->
      <!-- </a-collapse> -->
    </template>
  </Breadcrumb>
</template>
<script>
import { findAllList } from "@/api/selfConsumptionDaily";
export default {
  data() {
    return {
      stateInfo: [],
      //翻页页面组件
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      //勾选框/选择框组件
      selectedRowKeys: [],
      //回传组件
      echoMap: {},
      //查看组件中的数值
      LookForm: {},
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageSize: 10,
        pageIndex: 1,
        // startDate: [],
      },
      startDate: [],
      //页面下方表格的列属性
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
          align: "center",
        },
        {
          title: "日期",
          dataIndex: "createdDateTime",
          width: 140,
          align: "center",
          ellipsis: true,
        },

        {
          title: "仪表名称",
          dataIndex: "instrumentName",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "仪表位号",
          dataIndex: "instrumentNo",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "类别",
          dataIndex: "category",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "体积(Nm3)",
          dataIndex: "volume",
          ellipsis: true,
          width: 200,
          align: "center",
        },
        {
          title: "质量(t)",
          dataIndex: "quality",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        // {
        //   title: "操作",
        //   scopedSlots: { customRender: "operation" },
        //   width: 120,
        //   fixed: "right",
        // },
      ],
      //表格中的数据
      dataSource: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //日期的onchange
    onChange(date, dateString) {
      if (date.length != 0) {
        this.form.startTime = date[0];
        this.form.endTime = date[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageIndex = 1;
        this.form.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.form.pageIndex = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.startDate = [];
      this.form.pageIndex = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    // 查询
    getList() {
      console.log(this.form);
      findAllList(this.form).then((response) => {
        this.dataSource = response.body.data;
        this.pagination.total = response.body.total;
        this.pagination.current = response.body.pageIndex;
        this.pagination.pageSize = response.body.pageSize;
      });
    },
    //上方小提示框
    success() {
      this.$message.success("This is a success message");
    },
    error() {
      this.$message.error("This is an error message");
    },
    warning() {
      this.$message.warning("This is a warning message");
    },
  },
};
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
