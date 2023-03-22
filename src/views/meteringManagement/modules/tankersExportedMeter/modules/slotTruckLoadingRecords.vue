<template>
  <div>
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <div slot="extra">
          <a-button
            v-Add
            class="buttonType btn_primary"
            type="primary"
            @click.stop=""
          >
            <svg-icon class="button_svg" icon-class="export-icon" />
            导出
          </a-button>
        </div>
      </template>
      <template slot="appMain">
        <a-form-model layout="inline" :model="form">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="单号"
            >
              <a-input
                v-model="form.oddNumbers"
                placeholder="请输入单号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="车牌号"
            >
              <a-input
                v-model="form.licensePlateNo"
                placeholder="请输入车牌号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="挂车号"
            >
              <a-input
                v-model="form.trailerNo"
                placeholder="请输入挂车号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="提货单位"
            >
              <a-input
                v-model="form.pickUpUnit"
                placeholder="请输入提货单位"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="承运单位"
            >
              <a-input
                v-model="form.carrier"
                placeholder="请输入承运单位"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="驾驶员"
            >
              <a-input
                v-model="form.driver"
                placeholder="请输入驾驶员"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="装车日期:"
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
            <a-form-model-item>
              <a-button
                v-Query
                class="buttonType"
                type="primary"
                @click="search"
              >
                查询
              </a-button>
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>
          </a-col>
        </a-form-model>
        <a-table
          @change="paginationChange"
          rowKey="id"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :pagination="pagination"
          :scroll="{ x: 100 }"
          :columns="columns"
          :dataSource="dataSource"
          :openSelector="true"
        >
          <!-- 下载 -->
          <template slot="attachment" slot-scope="row">
            <span class="edit" v-Edit @click="download(row)">下载</span>
          </template>
        </a-table>
      </template>
      <!-- <div id="components-layout-demo-basic" style="width:100%">
            <a-layout>
                <a-layout-content>
                    <a-form-model layout="inline" :model="form">
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 150px' }" label="单号">
                                <a-input v-model="form.outsourceCompany"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 150px' }" label="车牌号">
                                <a-input v-model="form.outsourceCompany"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 150px' }" label="挂车号">
                                <a-input v-model="form.outsourceCompany"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 150px' }" label="提货单位">
                                <a-input v-model="form.outsourceCompany"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 150px' }" label="承运单位">
                                <a-input v-model="form.outsourceCompany"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 150px' }" label="驾驶员">
                                <a-input v-model="form.outsourceCompany"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item label="装车日期:" :labelCol="{ style: 'width: 150px' }">
                                <a-range-picker v-model="form.startDate" valueFormat="YYYY-MM-DD" @change="onChange"
                                    :placeholder="['开始日期', '结束日期']" />
                            </a-form-model-item>
                        </a-col>
                    </a-form-model>
                </a-layout-content>
            </a-layout>
        </div>
        <div class="queryItem">
            <a-button v-Query class="buttonType" type="primary" @click="search">
                查询
            </a-button>
            <a-button class="buttonType" @click="resetForm">
                重置
            </a-button>
        </div>
        <a-collapse :defaultActiveKey="['1']">
            <a-collapse-panel key="1" header="槽车外输装车记录">
                <div slot="extra">
                    <a-button v-Add class="buttonType" type="primary" @click.stop=" ">
                        导出
                    </a-button>
                </div>
                <dc-table @change="paginationChange" rowKey="id"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :pagination="pagination" :scroll="{ x: 100 }" :columns="columns" :dataSource="dataSource"
                    :openSelector="true">
                </dc-table>
            </a-collapse-panel>
        </a-collapse> -->
    </Breadcrumb>
  </div>
</template>
<script>
import utils from "@/utils/url";
import { getListForPage } from "@/api/slotTruckLoadingRecords";
export default {
  data() {
    return {
      //文件下载地址
      urls: "fileinfo/downloadFile?",
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
        pageNum: 1,
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
          title: "装车日期",
          dataIndex: "dateLoading",
          width: 140,
          align: "center",
        },

        {
          title: "单号",
          dataIndex: "oddNumbers",
          width: 140,
          align: "center",
        },
        {
          title: "车牌号",
          dataIndex: "licensePlateNo",
          width: 140,
          align: "center",
        },
        {
          title: "挂车号",
          dataIndex: "trailerNo",
          width: 140,
          align: "center",
        },
        {
          title: "地磅号(入)",
          dataIndex: "weighbridgeNoIn",
          width: 140,
          align: "center",
        },
        {
          title: "地磅号(出)",
          dataIndex: "weighbridgeNoOut",
          width: 140,
          align: "center",
        },
        {
          title: "驾驶员",
          dataIndex: "driver",
          width: 200,
          align: "center",
        },
        {
          title: "物料名称",
          dataIndex: "itemName",
          width: 150,
          align: "center",
        },
        {
          title: "提货单位",
          dataIndex: "pickUpUnit",
          width: 200,
          align: "center",
        },
        {
          title: "承运单位",
          dataIndex: "carrier",
          width: 150,
          align: "center",
        },
        {
          title: "供货单位",
          dataIndex: "suppliers",
          width: 200,
          align: "center",
        },
        {
          title: "空车重量(kg)",
          dataIndex: "emptyCarWeight",
          width: 200,
          align: "center",
        },
        {
          title: "重车重量(kg)",
          dataIndex: "heavyVehicleWeight",
          width: 150,
          align: "center",
        },
        {
          title: "物料净重(kg)",
          dataIndex: "materialNetWeight",
          width: 200,
          align: "center",
        },
        {
          title: "质量(t)",
          dataIndex: "quality",
          width: 150,
          align: "center",
        },
        {
          title: "体积(Nm3)",
          dataIndex: "volume",
          width: 200,
          align: "center",
        },
        {
          title: "密度(kg/m3)",
          dataIndex: "density",
          width: 200,
          align: "center",
        },
        {
          title: "装车单(附件)",
          dataIndex: "loadinglist",
          width: 200,
          align: "center",
        },
        {
          title: "分析报告(附件)",
          scopedSlots: { customRender: "attachment" },
          dataIndex: "analystReports",
          width: 200,
          align: "center",
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
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //日期的onchange
    onChange(date, dateString) {
      if (date.length != 0) {
        this.form.dateLoadingStart = date[0];
        this.form.dateLoadingEnd = date[1];
      } else {
        this.form.dateLoadingStart = "";
        this.form.dateLoadingEnd = "";
      }
    },

    //获得当前页面
    getList() {
      getListForPage(this.form).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
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
    //重置输入
    resetForm() {
      this.form = {};
      this.startDate = [];
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
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
    //文件下载
    download(value) {
      window.location.href =
        utils.baseURL + this.urls + "?" + "relatedId=" + value.id;
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
