<template>
  <Breadcrumb>
    <!--头部新增删除按钮-->
    <template slot="breadcrumbButton">
      <!-- 导出规则：表格有选中项优先导出选中项，无选中项按查询条件导出，查询条件为空时导出全部 -->
      <pe-button
        :include="[
          {
            value: 'exportComponent',
            url: '/AutoInventory/exportExcel',
            params: {
              idList: selectedRowKeys != '' ? selectedRowKeys : '',
              startTime:
                selectedRowKeys == '' && searchForm.startTime
                  ? searchForm.startTime
                  : '',
              endTime:
                selectedRowKeys == '' && searchForm.endTime
                  ? searchForm.endTime
                  : '',
              profitLoss:
                selectedRowKeys == '' && searchForm.profitLoss
                  ? searchForm.profitLoss
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
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="searchForm">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="日期"
                >
                  <a-range-picker
                    v-model="dateRange"
                    valueFormat="YYYY-MM-DD"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>

              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="盈亏情况"
                >
                  <a-input
                    v-model="searchForm.profitLoss"
                    placeholder="请输入盈亏情况"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="状态"
                >
                  <a-select
                    placeholder="请选择"
                    ref="select"
                    v-model="searchForm.recordStatus"
                    :options="statusOptions"
                    default-value="0"
                  >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- <a-input
                    v-model="searchForm.recordStatus"
                    placeholder="请输入状态"
                  ></a-input> -->

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
      <!--表格-->
      <a-table
        class="TableTop"
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
        <template slot="operation" slot-scope="row">
          <pe-button
            v-if="row.index != '本页合计' && row.index != '均值'"
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.editDisabled(row.recordStatus),
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @edit="editClick(row)"
            @look="lookClick(row)"
            @approval="approvalClick(row)"
          ></pe-button>
        </template>
      </a-table>
      <!--新增/编辑弹窗-->
      <dc-Model class="DcModel" v-model="visible" :modelConfig="modelConfig">
        <a-layout>
          <a-layout-content>
            <!-- 打印区域 -->
            <div id="printContent">
              <table
                style="width: 100%; text-align: center"
                border="2"
                class="table_form"
              >
                <th colspan="4" style="height: 60px; font-size: 18px">
                  北京燃气集团（天津）液化气有限公司
                  <br />
                  液化天然气库存盘点表
                </th>
                <tr style="height: 30px">
                  <!-- <td colspan="4">（ 年 月 日8：00 - 年 月 日8：00）</td> -->
                  <td colspan="4">
                    （{{ detailsInfoData.inventoryStartDate }}8：00 -
                    {{ detailsInfoData.inventoryEndDate }}8：00）
                  </td>
                </tr>
                <tr style="height: 30px">
                  <td colspan="4" style="text-align: right">
                    编号：{{ detailsInfoData.serialNo }}&nbsp;
                  </td>
                </tr>
                <tr style="height: 30px">
                  <td width="25%">项目</td>
                  <td width="25%">质量(t)</td>
                  <td width="25%">体积(Nm³)</td>
                  <td width="25%">备注</td>
                </tr>
                <tr
                  v-for="(item, index) in detailsData"
                  :key="index"
                  class="input"
                >
                  <td style="text-align: left">
                    &nbsp; {{ detailsData[index].item }}
                  </td>
                  <td>
                    <a-input
                      v-if="pageType == 'edit'"
                      v-model="detailsData[index].quality"
                    ></a-input>
                    <span v-else> {{ detailsData[index].quality }}</span>
                  </td>
                  <td>
                    <a-input
                      v-if="pageType == 'edit'"
                      v-model="detailsData[index].volume"
                    ></a-input>
                    <span v-else> {{ detailsData[index].volume }}</span>
                  </td>
                  <td>
                    <a-input
                      v-if="pageType == 'edit'"
                      v-model="detailsData[index].remarks"
                    ></a-input>
                    <span v-else> {{ detailsData[index].remarks }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </a-layout-content>
          <a-layout-footer>
            <br />
            <a-row :gutter="24">
              <a-col :span="24">
                <div style="text-align: center">
                  <a-button
                    v-if="pageType == 'edit'"
                    type="primary"
                    @click.stop="saveClick()"
                  >
                    保存
                  </a-button>
                  <a-button
                    v-if="pageType == 'edit'"
                    type="primary"
                    @click.stop="submitClick()"
                  >
                    提交
                  </a-button>
                  <a-button
                    v-if="pageType == 'look'"
                    type="primary"
                    v-print="printConfig"
                    key="1"
                  >
                    打印
                  </a-button>
                  <a-button @click.stop="visible = false"> 取消 </a-button>
                </div>
              </a-col>
            </a-row>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
  <script>
import {
  getList,
  getDetailsListBySerialNo,
  update,
  submit,
} from "@/api/inventoryManagement/automaticInventory.js";
export default {
  data() {
    return {
      printConfig: {
        id: "printContent",
        popTitle: "液化天然气库存盘点表",
      },
      pageType: "",
      dateRange: [],
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
      visible: false,
      //新增/编辑弹窗配置
      modelConfig: {
        width: "950px",
        // title: "临时检修计划-新增",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      searchForm: {
        pageSize: 10,
        pageNum: 1,
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
          title: "盘库日期",
          dataIndex: "createdDateTime",
          width: 150,
          align: "center",
        },
        {
          title: "上期期末库存（t）",
          dataIndex: "lastInventory",
          width: 150,
          align: "center",
        },
        {
          title: "本期购入（t）",
          dataIndex: "currentBuy",
          width: 150,
          align: "center",
        },
        {
          title: "本期外输（t）",
          dataIndex: "currentExport",
          width: 200,
          align: "center",
        },
        {
          title: "自用及损耗（t）",
          dataIndex: "selfUse",
          width: 150,
          align: "center",
        },
        {
          title: "计算库存（t）",
          dataIndex: "calculateInventory",
          width: 150,
          align: "center",
        },
        {
          title: "实际库存（t）",
          dataIndex: "actInventory",
          width: 150,
          align: "center",
        },
        {
          title: "第三方实际库存（t）",
          dataIndex: "thirdPartyActInventory",
          width: 150,
          align: "center",
        },
        {
          title: "结算中心实际库存（t）",
          dataIndex: "settlementCenterActInventory",
          width: 150,
          align: "center",
        },
        {
          title: "盈亏情况",
          dataIndex: "profitLoss",
          width: 150,
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
          width: 100,
          fixed: "right",
          align: "center",
        },
      ],
      statusOptions: [
        { value: "1", label: "已保存" },
        { value: "2", label: "已提交" },
      ],
      //表格中的数据
      dataSource: [],
      detailsInfoData: {},
      detailsData: [],
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

    //点击编辑
    editClick(row) {
      this.pageType = "edit";
      this.renderData(row);
      this.modelConfig.title = "自动盘库-编辑";
    },

    //点击查看
    lookClick(row) {
      this.pageType = "look";
      this.renderData(row);
      this.modelConfig.title = "自动盘库-查看";
    },

    //渲染数据并打开弹窗
    renderData(row) {
      this.detailsInfoData.id = row.id;
      this.detailsInfoData.serialNo = row.serialNo;
      this.detailsInfoData.inventoryStartDate = this.formatDate(
        new Date(row.inventoryStartDate),
        "yyyy 年 MM 月 dd 日 "
      );
      this.detailsInfoData.inventoryEndDate = this.formatDate(
        new Date(row.inventoryEndDate),
        "yyyy 年 MM 月 dd 日 "
      );
      getDetailsListBySerialNo(row.serialNo).then((res) => {
        if (res.code == "200") {
          this.detailsData = res.body.data;
          this.visible = true;
        }
      });
    },

    //保存详情
    saveClick() {
      update(this.detailsData).then((res) => {
        if (res.code == "200") {
          this.$message.success("修改成功");
          this.visible = false;
          this.getList();
        } else {
          this.$message.warning("修改失败");
        }
      });
    },

    //提交
    submitClick() {
      update(this.detailsData).then((res) => {
        if (res.code == "200") {
          submit(this.detailsInfoData.id).then((res) => {
            if (res.code == "200") {
              this.$message.success("提交成功");
              this.visible = false;
              this.getList();
            } else {
              this.$message.warning("提交失败");
            }
          });
        } else {
          this.$message.warning("提交失败");
        }
      });
    },

    //获得当前页面
    getList() {
      getList(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.dataSource.forEach((item) => {
          this.statusOptions.forEach((status) => {
            if (item.recordStatus == status.value) {
              item.recordStatusName = status.label;
            }
          });
        });
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
    },

    //查询功能
    searchClick() {
      if (this.dateRange.length != 0) {
        this.searchForm.startTime = this.dateRange[0];
        this.searchForm.endTime = this.dateRange[1];
      } else {
        delete this.searchForm.startTime;
        delete this.searchForm.endTime;
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

    //格式化日期
    formatDate(objDate, fmt) {
      var o = {
        "M+": objDate.getMonth() + 1, //月份
        "d+": objDate.getDate(), //日
        "h+": objDate.getHours() % 12 == 0 ? 12 : objDate.getHours() % 12, //小时
        "H+": objDate.getHours(), //小时
        "m+": objDate.getMinutes(), //分
        "s+": objDate.getSeconds(), //秒
        "q+": Math.floor((objDate.getMonth() + 3) / 3), //季度
        S: objDate.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (objDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
  },
};
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
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
    height: 26px;
  }
}
</style>
  