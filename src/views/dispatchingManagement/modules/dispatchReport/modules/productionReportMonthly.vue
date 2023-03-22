<template>
  <Breadcrumb>
    <!--头部新增删除按钮-->
    <template slot="breadcrumbButton">
      <!-- 导出规则：表格有选中项优先导出选中项，无选中项按查询条件导出，查询条件为空时导出全部 -->
      <pe-button
        :include="[
          {
            isPower: false,
            value: 'exportComponent',
            url: '/ProductionMonthlyReportController/exportExcel',
            params: {
              idList: selectedRowKeys != '' ? selectedRowKeys : '',
              productionBeginDate:
                selectedRowKeys == '' && searchForm.productionBeginDate
                  ? searchForm.productionBeginDate
                  : '',
              productionEndDate:
                selectedRowKeys == '' && searchForm.productionEndDate
                  ? searchForm.productionEndDate
                  : '',
              fillUser:
                selectedRowKeys == '' && searchForm.fillUser
                  ? searchForm.fillUser
                  : '',
              recordStatus:
                selectedRowKeys == '' && searchForm.recordStatus
                  ? searchForm.recordStatus
                  : '',
            },
          },
        ]"
      ></pe-button>
    </template>

    <template slot="appMain">
      <!--查询控件及按钮-->
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <a-col :span="10">
                  <a-form-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="生产日期"
                  >
                    <a-row :gutter="24">
                      <a-col :span="11">
                        <a-date-picker
                          value-format="yyyy-MM-DD"
                          v-model="searchForm.productionBeginDate"
                          :getCalendarContainer="getPopupContainer"
                        />
                      </a-col>
                      <a-col :span="2" style="padding-left: 0px">——</a-col>
                      <a-col :span="11">
                        <a-date-picker
                          :disabled-date="disabledDate"
                          value-format="yyyy-MM-DD"
                          v-model="searchForm.productionEndDate"
                          :getCalendarContainer="getPopupContainer"
                        />
                      </a-col>
                    </a-row>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="填报人"
                  >
                    <a-input
                      v-model="searchForm.fillUser"
                      placeholder="请输入填报人"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="状态"
                  >
                    <a-select
                      placeholder="请选择"
                      ref="select"
                      v-model="searchForm.recordStatus"
                      :options="statusOptions"
                      :getPopupContainer="getPopupContainer"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="4">
                  <a-form-model-item>
                    <a-button
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
        }"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="releaseDate" slot-scope="text, row">
          <span class="edit" @click.stop="lookClick(row.id)">
            {{ text }}
          </span>
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
                type: 'link',
                disabled: $audit.editDisabled(row.recordStatus),
              },
              {
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'View',
                clickName: 'look',
                icon: '',
                style: ['btn_link'],
                type: 'link',
                isPower: false,
                name: '详情',
              },
            ]"
            @edit="editClick(row.id)"
            @look="lookClick(row.id)"
            @approval="approvalClick(row.id)"
          ></pe-button>
        </template>
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import { findAllList } from "@/api/dispatchingManagement/productionReportMonthly";
import moment from "moment";

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
      //查询所需的数据
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
      },
      //状态下拉数据
      statusOptions: [
        { value: "1", label: "已保存" },
        { value: "2", label: "已提交" },
        { value: "3", label: "审批中" },
        { value: "4", label: "已审批" },
        { value: "5", label: "已拒绝" },
        { value: "6", label: "已完成" },
      ],
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
          title: "发布日期",
          dataIndex: "releaseDate",
          scopedSlots: { customRender: "releaseDate" },
          width: 100,
          align: "center",
        },
        // {
        //   title: "生产起止日期",
        //   dataIndex: "productionBeginDate",
        //   width: 300,
        //   align: "center",
        // },
        // {
        //   title: "生产结束日期",
        //   dataIndex: "productionEndDate",
        //   width: 300,
        //   align: "center",
        // },
        {
          title: "生产日期",
          dataIndex: "productionDate",
          width: 150,
          align: "center",
        },
        {
          title: "编制部门",
          dataIndex: "compilingDepartment",
          width: 250,
          align: "center",
        },
        {
          title: "外输汽化量(万方)",
          dataIndex: "outPutGasificationVolumeWF",
          width: 150,
          align: "center",
        },
        {
          title: "槽车装载量(t)",
          dataIndex: "tankerLoadingVolumeT",
          width: 100,
          align: "center",
        },
        {
          title: "填报人",
          dataIndex: "fillUser",
          width: 100,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "recordStatusName",
          width: 100,
          align: "center",
          fixed: "right",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 150,
          align: "center",
          fixed: "right",
        },
      ],
      //表格中的数据
      dataSource: [],
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
    //表格多选框改变触发
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },

    //发令时间只可选择当天及以前的日期
    disabledDate(current) {
      return current && current > moment().endOf("day");
    },

    //点击新增，跳转操作页
    addClick() {
      //跳转操作页
      this.$router.push({
        path: "/productionReportMonthlyChange",
      });
    },

    //点击编辑，跳转到操作页
    editClick(id) {
      console.log(id);
      //跳转操作页
      this.$router.push({
        path: "/productionReportMonthlyChange",
        query: {
          pageType: "edit",
          id: id,
        },
      });
    },

    //点击表格中审批按钮
    approvalClick(id) {
      //跳转审批页
      this.$router.push({
        path: "/productionReportMonthlyChange",
        query: {
          pageType: "approval",
          id: id,
        },
      });
    },

    //点击查看，跳转到操作页
    lookClick(id) {
      //跳转操作页
      this.$router.push({
        path: "/productionReportMonthlyChange",
        query: {
          pageType: "look",
          id: id,
        },
      });
    },

    //删除操作
    deleteOperation() {
      if (this.selectedRowKeys == "") {
        this.this.$message.warning("请选择！");
      } else {
        delete this.selectedRowKeys.then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功！");
            this.getList();
          } else {
            this.this.$message.error("删除失败！");
          }
        });
      }
      //清空表格多选框
      this.selectedRowKeys = [];
    },

    //获得当前页面
    getList() {
      findAllList(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.dataSource.forEach((item) => {
          this.statusOptions.forEach((status) => {
            if (item.recordStatus == status.value) {
              item.recordStatusName = status.label;
            }
          });
          // if (item.recordStatus == "0") {
          //   item.recordStatusName = "待提交";
          // } else if (item.recordStatus == "1") {
          //   item.recordStatusName = "已提交";
          // } else {
          //   item.recordStatusName = item.recordStatus;
          // }
          if (item.productionBeginDate && item.productionEndDate) {
            item.productionDate =
              item.productionBeginDate + "-" + item.productionEndDate;
          }
        });
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
    },

    //查询功能
    searchClick() {
      if (this.searchForm) {
        this.searchForm.pageSize = 10;
        this.searchForm.pageIndex = 1;

        this.getList();
      } else {
        this.getList();
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.searchForm.pageIndex = pagination.current;
      this.searchForm.pageSize = pagination.pageSize;
      this.getList();
    },

    //重置输入
    resetClick() {
      this.searchForm = {};
      this.searchForm.pageIndex = 1;
      this.searchForm.pageSize = 10;
      this.getList();
    },

    // 点击确定删除
    deleteClick() {
      this.deleteOperation();
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
.TableTop {
  margin-top: 10px;
}
</style>
