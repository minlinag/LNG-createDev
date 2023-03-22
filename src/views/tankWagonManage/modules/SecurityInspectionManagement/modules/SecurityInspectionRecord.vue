<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'exportComponent',
            isPower: false,
            url: '/lngSales/exportSaleCheckForm',
          },
        ]"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div class="appMainForm" style="position: relative">
        <a-form-model layout="inline" :model="form">
          <a-col :span="6">
            <a-form-model-item
              label="装车时间:"
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
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="牵引车号"
            >
              <a-input
                v-model="form.number_tractor"
                placeholder="请输入牵引车号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="驾驶员"
            >
              <a-input
                v-model="form.name_driver"
                placeholder="请输入驾驶员"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="承运商:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-select
                v-model="form.carrier_name"
                show-search
                placeholder="请选择承运商"
                option-filter-prop="children"
                :filter-option="filterOption"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in stateInfo"
                  :key="index"
                >
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-form-model-item style="float: right">
            <a-button v-Query class="buttonType" type="primary" @click="search">
              查询
            </a-button>
            <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
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
        <template slot="operation" slot-scope="row">
          <span class="edit" @click="look(row)">详情</span>
        </template>
      </a-table>
      <dc-Model
        :width="'950px'"
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="DcModel"
      >
        <a-layout>
          <a-layout-content>
            <div :model="surfaceForm">
              <a-divider orientation="left" style="font-weight: bolder"
                >基础信息</a-divider
              >
              <table border="0" style="width: 100%; margin-left: 30px">
                <tr style="height: 30px">
                  <td>装车编号：{{ surfaceForm.loading_number }}</td>
                  <td>装车日期：{{ surfaceForm.loading_start_time }}</td>
                  <td>计划装车量(t)：{{ surfaceForm.loadingCount }}</td>
                </tr>
                <tr style="height: 30px">
                  <td>叫车时间：{{ surfaceForm.call_car_time }}</td>
                  <td>派车时间：{{ surfaceForm.create_time }}</td>
                </tr>
              </table>
              <a-divider orientation="left" style="font-weight: bolder"
                >单位信息</a-divider
              >
              <!-- <h3 style="font-weight: bolder">单位信息</h3> -->
              <table border="0" style="width: 100%; margin-left: 30px">
                <tr style="height: 30px">
                  <td>承运商：{{ surfaceForm.carrier_name }}</td>
                  <td>现场紧急联系人：{{ surfaceForm.emergencyContact }}</td>
                  <td>联系电话：{{ surfaceForm.contactNumber }}</td>
                </tr>
                <!-- <tr style="height: 30px">
              <td>提货单位：无</td>
              <td>承销单位：无</td>
            </tr> -->
              </table>
              <a-divider orientation="left" style="font-weight: bolder"
                >车辆信息</a-divider
              >
              <!-- <h3 style="font-weight: bolder">车辆信息</h3> -->
              <table border="0" style="width: 100%; margin-left: 30px">
                <tr style="height: 30px">
                  <td>牵引车号：{{ surfaceForm.number_tractor }}</td>
                  <td>挂车号：{{ surfaceForm.number_trailer }}</td>
                </tr>
              </table>
              <a-divider orientation="left" style="font-weight: bolder"
                >人员信息</a-divider
              >
              <!-- <h3 style="font-weight: bolder">人员信息</h3> -->
              <table border="0" style="width: 100%; margin-left: 30px">
                <tr style="height: 30px">
                  <td>司机：{{ surfaceForm.name_driver }}</td>
                  <td>司机身份证号：{{ surfaceForm.id_no_driver }}</td>
                  <td>联系电话：{{ surfaceForm.phone_driver }}</td>
                </tr>
                <tr style="height: 30px">
                  <td>押运员：{{ surfaceForm.name_escort }}</td>
                  <td>押运员身份证号：{{ surfaceForm.id_no_escort }}</td>
                  <td>联系电话：{{ surfaceForm.phone_escort }}</td>
                </tr>
              </table>

              <a-divider orientation="left" style="font-weight: bolder"
                >销售公司安检信息</a-divider
              >
              <table border="0" style="width: 100%; margin-left: 30px">
                <tr style="height: 30px">
                  <td>
                    安检结果：{{ surfaceForm.car_status
                    }}<span style="margin-left: 30px; color: #02a7f0">
                      查看详情</span
                    >
                  </td>
                </tr>
              </table>
              <a-divider orientation="left" style="font-weight: bolder"
                >安检信息</a-divider
              >
              <!-- <h3 style="font-weight: bolder">安全信息</h3> -->
              <table border="0" style="width: 100%; margin-left: 30px">
                <tr style="height: 30px">
                  <td>入场时间：{{ surfaceForm.enter_time }}</td>
                  <td>装车开始时间：{{ surfaceForm.loading_start_time }}</td>
                  <td>装车结束时间：{{ surfaceForm.loading_end_time }}</td>
                </tr>
              </table>
              <div style="margin-top: 20px">
                <a-button class="buttonType" @click="front('jz')">
                  进站前检查确认
                </a-button>
                <a-button class="buttonType" @click="front('zc')">
                  装车前后检查确认
                </a-button>

                <a-button
                  class="buttonType"
                  type="primary"
                  v-print="printConfig"
                  key="1"
                >
                  打印
                </a-button>
              </div>
            </div>
          </a-layout-content>
          <a-layout-footer>
            <a-button class="buttonType" @click="visibleAddNew = false">
              取消
            </a-button>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
    </template></Breadcrumb
  >
</template>
<script>
import {
  getListForPage,
  selectJcxxByCodeAndCheck,
} from "@/api/SecurityInspectionRecord.js";
export default {
  data() {
    return {
      printConfig: {
        id: "printContent",
        popTitle: "安检记录",
      },
      value: 1,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      surfaceForm: {},
      addNewModelConfig: {
        width: "950px",
        title: "安检记录-详情",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      startDate: [],
      visibleAddNew: false,
      form: {},
      stateInfo: [],
      //勾选框/选择框组件
      selectedRowKeys: [],
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
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
        },
        {
          title: "承运商",
          dataIndex: "carrier_name",
          ellipsis: true,
          align: "center",
          width: 100,
        },
        {
          title: "牵引车号",
          ellipsis: true,
          dataIndex: "number_tractor",
          align: "center",
          width: 100,
        },
        {
          title: "挂车号",
          ellipsis: true,
          dataIndex: "number_trailer",
          align: "center",
          width: 100,
        },
        {
          title: "驾驶员",
          ellipsis: true,
          dataIndex: "name_driver",
          align: "center",
          width: 100,
        },
        {
          title: "押运员",
          ellipsis: true,
          dataIndex: "name_escort",
          align: "center",
          width: 100,
        },
        {
          title: "装车日期",
          ellipsis: true,
          dataIndex: "loading_start_time",
          align: "center",
          width: 180,
        },
        {
          title: "安检结果",
          ellipsis: true,
          dataIndex: "car_status",
          align: "center",
          width: 100,
          fixed: "right",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 120,
          fixed: "right",
        },
      ],
      //表格中的数据
      dataSource: [],
      InbounConfirmation: false,
      InboundInspection: [],
      InboundInspectionData: {},
      LoadingInspection: [],
      LoadingInspectionData: {},
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    front(e) {
      window.open(
        `${Glod.DEVE_LOPMENT_ENVIRONMENT}/fileinfo/downloadFileWithBusinesscode?relatedId=${this.surfaceForm.id}&businessCode=${e}`
      );
    },
    look(row) {
      this.surfaceForm = row;
      this.visibleAddNew = true;
      this.InbounConfirmation = false;
    },
    edit() {
      this.$router.push({
        path: "/loadingDailyDetail",
      });
    },
    exportClick() {
      this.$message.success("导出");
    },
    mydelete() {},
    getList() {
      getListForPage(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageNum = 1;
        this.form.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.startDate = [];
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    //日期的
    onChange(date, dateString) {
      console.log(date, dateString);
      if (date) {
        this.form.loading_start_time = date[0];
        this.form.loading_end_time = date[1];
      } else {
      }
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