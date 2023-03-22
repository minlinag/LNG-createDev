<template>
  <Breadcrumb>
    <!--查询控件及按钮-->
    <template slot="appMain">
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <!-- <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="编号"
                >
                  <a-input
                    v-model="searchForm.code"
                    placeholder="请输入编号"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="用户单位"
                >
                  <a-input
                    v-model="searchForm.userCompany"
                    placeholder="请输入用户单位"
                  ></a-input>
                </a-form-model-item>
              </a-col> -->
                <a-col :span="6">
                  <a-form-model-item
                    label="日期:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-range-picker
                      v-model="dateRange"
                      valueFormat="YYYY-MM-DD"
                      :placeholder="['开始日期', '结束日期']"
                      :getCalendarContainer="getPopupContainer"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item>
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-form-model-item>
                </a-col>
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
      </div>

      <!--表格-->
      <dc-table
        class="list_table_1"
        :scroll="{ y: 1, x: 100 }"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          fixed: true,
        }"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @edit="editClick(row)"
          ></pe-button>
        </template>
      </dc-table>

      <!-- 编辑弹窗 -->
      <dc-Model
        class="from-style smallModel"
        v-model="isVisible"
        :modelConfig="modelConfig"
      >
        <FormitemDemo
          class="marginButton10px"
          ref="Form"
          :echoMap="echoMap"
          :Config="addFromConfig"
          @save="saveClick"
          @cancel="cancelClick"
          v-if="isVisible"
        >
        </FormitemDemo>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  edit,
} from "@/api/meteringManagement/coldAirConsumptionDaily.js";
export default {
  data() {
    return {
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
      //新增弹窗是否显示，false不显示
      isVisible: false,
      //查询条件日期范围
      dateRange: [],
      //查询所需的数据
      searchForm: {
        pageNum: 1,
        pageSize: 10,
      },
      //新增编辑弹窗的相关设置
      modelConfig: {
        title: "冷能耗气日报-编辑",
        cancelText: false,
        footer: "", //是否展示页脚
      },
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
          dataIndex: "dayTime",
          // width: 140,
          align: "center",
        },
        {
          title: "冷能耗气量(Nm3)",
          dataIndex: "coldGasConsumption",
          // width: 200,
          align: "center",
        },
        {
          title: "年累计量(Nm3)",
          dataIndex: "yearCumulants",
          align: "center",
          // width: 200,
        },
        {
          title: "色谱标密(kg/m3)",
          dataIndex: "chromatographySecret",
          align: "center",
          // width: 150,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          align: "center",
          width: 120,
          fixed: "right",
        },
      ],
      //表格中的数据
      dataSource: [],
      //新增界面
      addFromConfig: {
        otherConfigurations: [
          {
            //保存button
            type: "btn",
            label: "保存",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "save", //传值内容 拿到当前所有数据包装好的
          },
          {
            //取消button
            type: "btn",
            label: "取消",
            btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: "datePicker", //组件类型 目前指出 input || select
            label: "日期", //展示名称
            format: "YYYY-MM-DD",
            formKey: "dayTime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            // placeholder: "请输入设备名称", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "冷能耗气量(Nm3)", //展示名称
            formKey: "coldGasConsumption", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入冷能耗气量", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "年累计量(Nm3)", //展示名称
            formKey: "yearCumulants", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入年累计量", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "色谱标密(kg/m3)", //展示名称
            colSpan: 12,
            // monent:'value',
            formKey: "chromatographySecret", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入色谱标密", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 暂时开发状态
              multiple: true,
              // vDecorator: { required: true, message: '请输入作业日期', trigger: 'blur' }, //校验规则
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-changeList");
    },
    //获得当前页面
    getList() {
      getList(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
        // this.getSum();
      });
      this.selectedRowKeys = [];
    },

    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },

    //查询功能
    searchClick() {
      if (this.dateRange.length != 0) {
        this.searchForm.dateBegin = this.dateRange[0];
        this.searchForm.dateEnd = this.dateRange[1];
      } else {
        delete this.searchForm.dateBegin;
        delete this.searchForm.dateEnd;
      }
      if (this.searchForm) {
        this.searchForm.pageNum = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.searchForm.pageNum = pagination.current;
      this.searchForm.pageSize = pagination.pageSize;
      this.getList();
    },

    //重置输入
    resetClick() {
      this.searchForm = {};
      this.dateRange = [];
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.getList();
    },

    //编辑弹窗保存
    saveClick(value) {
      edit(value).then((res) => {
        if (res.code == 200) {
          this.$message.success("编辑成功！");
          //关闭弹窗
          this.isVisible = false;
          this.getList();
        } else {
          this.$message.error("编辑失败！");
        }
      });
    },

    //点击表格中的编辑按钮
    editClick(row) {
      //打开编辑弹窗
      this.isVisible = true;
      //回显数据
      this.echoMap = row;
    },

    //关闭新增弹窗
    cancelClick() {
      this.isVisible = false;
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
.marginButton10px {
  margin-bottom: 10px;
}
</style>
