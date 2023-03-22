<template>
  <Breadcrumb>
    <!--头部新增删除按钮-->
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'Add',
            clickName: 'addNew',
          },
          {
            value: 'Delete',
            clickName: 'mydelete',
          },
          {
            value: 'exportComponent',
            url: '/tScyxJlglYjpk/exportExcel',
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
        @addNew="addClick"
        @mydelete="deleteClick"
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
                  <!-- <a-input
                    v-model="searchForm.recordStatus"
                    placeholder="请输入状态"
                  ></a-input> -->
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
                  <a-button class="buttonType" @click.stop="resetForm()">
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
                    <a-range-picker
                      @change="reportDateChange"
                      v-model="reportDateRange"
                    >
                      <span>
                        （{{ detailsInfoData.inventoryStartDate }}8：00 -
                        {{ detailsInfoData.inventoryEndDate }}8：00）
                      </span>
                    </a-range-picker>
                  </td>
                </tr>
                <tr style="height: 30px">
                  <td
                    colspan="4"
                    style="text-align: right; padding-right: 10px"
                  >
                    编号：{{ detailsInfoData.serialNo }}
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
                  style="height: 30px"
                >
                  <td style="text-align: left; padding-left: 10px">
                    {{ detailsData[index].item }}
                  </td>
                  <td>
                    <a-input
                      v-if="pageType == 'add' || pageType == 'edit'"
                      v-model="detailsData[index].quality"
                    ></a-input>
                    <span v-else> {{ detailsData[index].quality }}</span>
                  </td>
                  <td>
                    <a-input
                      v-if="pageType == 'add' || pageType == 'edit'"
                      v-model="detailsData[index].volume"
                    ></a-input>
                    <span v-else> {{ detailsData[index].volume }}</span>
                  </td>
                  <td>
                    <a-input
                      v-if="pageType == 'add' || pageType == 'edit'"
                      v-model="detailsData[index].remarks"
                    ></a-input>
                    <span v-else> {{ detailsData[index].remarks }}</span>
                  </td>
                </tr>
              </table>
            </div>
            <br />

            <a-row
              :gutter="24"
              v-if="pageType == 'look' || pageType == 'approval'"
            >
              <stepsModel
                ref="stepsModel"
                :isShow="pageType === 'approval' ? true : false"
                :id="detailsInfoData.id"
              />
            </a-row>
          </a-layout-content>
          <a-layout-footer>
            <a-row :gutter="24">
              <a-col :span="24">
                <div style="text-align: center">
                  <a-button
                    v-if="pageType == 'add' || pageType == 'edit'"
                    type="primary"
                    @click.stop="saveClick()"
                  >
                    保存
                  </a-button>
                  <a-button
                    v-if="pageType == 'add' || pageType == 'edit'"
                    type="primary"
                    @click.stop="saveClick('submit')"
                  >
                    提交
                  </a-button>
                  <a-button
                    type="primary"
                    v-if="pageType === 'approval'"
                    @click="approvalCommit"
                  >
                    确定
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
  getDetailsListByTime,
  addMainAndDetails,
  deleteByIds,
  update,
  getDetailsListBySerialNo,
  submit,
  approval,
} from "@/api/inventoryManagement/oneClickInventory.js";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";

export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      printConfig: {
        id: "printContent",
        popTitle: "液化天然气库存盘点表",
      },
      reportDateRange: [],
      pageType: "",
      detailsInfoData: {},
      detailsData: [],
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
      //查询所需的数据 外委单位名称｜日期｜状态
      searchForm: {
        pageSize: 10,
        pageNum: 1,
      },
      visible: false,
      //新增/编辑弹窗配置
      modelConfig: {
        width: "950px",
        // title: "临时检修计划-新增",
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
          title: "审批状态",
          dataIndex: "recordStatusName",
          width: 100,
          align: "center",
          fixed: "right",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 150,
          fixed: "right",
          align: "center",
        },
      ],
      //表格中的数据
      dataSource: [],
      statusOptions: [
        { value: "1", label: "已保存" },
        { value: "2", label: "已提交" },
        { value: "3", label: "审批中" },
        { value: "4", label: "已审批" },
        { value: "5", label: "已拒绝" },
        { value: "6", label: "已完成" },
      ],
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

    //弹窗日期变化触发
    reportDateChange(dates) {
      console.log(dates);
      if (dates.length != 0) {
        /**
         * 1、修改表格日期标题
         */
        //拼接报表中的日期格式
        this.$set(
          this.detailsInfoData,
          "inventoryStartDate",
          this.formatDate(new Date(dates[0]), "yyyy 年 MM 月 dd 日")
        );
        this.$set(
          this.detailsInfoData,
          "inventoryEndDate",
          this.formatDate(new Date(dates[1]), "yyyy 年 MM 月 dd 日")
        );
        /**
         * 2、查询数据
         */
        //根据时间获取库存信息,并渲染
        this.getDetailsList(
          this.formatDate(new Date(dates[0]), "yyyy-MM-dd"),
          this.formatDate(new Date(dates[1]), "yyyy-MM-dd")
        );
      } else {
        this.$set(this.detailsInfoData, "inventoryStartDate", " 年 月 日 ");
        this.$set(this.detailsInfoData, "inventoryEndDate", " 年 月 日 ");
      }
    },

    //保存详情
    saveClick(type) {
      if (this.detailsData.length > 0) {
        let inventoryStartDate = this.formatDateFor_(
          this.detailsInfoData.inventoryStartDate
        );
        let inventoryEndDate = this.formatDateFor_(
          this.detailsInfoData.inventoryEndDate
        );
        this.detailsData.forEach((item) => {
          item.inventoryStartDate = inventoryStartDate;
          item.inventoryEndDate = inventoryEndDate;
        });
        if (this.pageType == "add") {
          addMainAndDetails(this.detailsData).then((res) => {
            if (res.code == 200) {
              if (type == "submit") {
                this.detailsInfoData.id = res.body;
                this.submitClick();
              } else {
                this.visible = false;
                this.$message.success("新增成功");
                this.getList();
              }
            } else {
              if (type == "submit") {
                this.$message.error("提交失败！");
              } else {
                this.$message.warning("新增失败");
              }
            }
          });
        } else {
          update(this.detailsData).then((res) => {
            if (res.code == 200) {
              if (type == "submit") {
                this.submitClick();
              } else {
                this.visible = false;
                this.$message.success("修改成功");
                this.getList();
              }
            } else {
              if (type == "submit") {
                this.$message.error("提交失败！");
              } else {
                this.$message.warning("修改失败");
              }
            }
          });
        }
      } else {
        this.$message.warning("暂无数据,请重新选择时间");
      }
    },

    //点击编辑
    editClick(row) {
      this.modelConfig.title = "一键盘库-编辑";
      this.pageType = "edit";
      this.renderData(row);
    },

    //点击审批
    approvalClick(row) {
      this.visible = true;
      this.pageType = "approval";
      this.renderData(row);
      this.modelConfig.title = "一键盘库-审批";
    },

    //点击查看
    lookClick(row) {
      this.visible = true;
      this.pageType = "look";
      this.renderData(row);
      this.modelConfig.title = "一键盘库-查看";
    },

    addClick() {
      this.modelConfig.title = "一键盘库-新增";
      this.pageType = "add";
      //生成编号
      this.detailsInfoData.serialNo =
        "YJPK" + this.formatDate(new Date(), "yyyyMMddHHmmss");
      //生成日期
      var date = new Date();
      //报表设置默认天   昨天8:00   ----   今天8:00
      //获取昨天日期yyyy-MM-dd
      let startDate = this.formatDate(
        new Date(date.setDate(date.getDate() - 1)),
        "yyyy-MM-dd"
      );

      //获取当天日期
      let endDate = this.formatDate(new Date(), "yyyy-MM-dd");
      this.detailsInfoData.inventoryStartDate = this.formatDate(
        new Date(startDate),
        "yyyy 年 MM 月 dd 日 "
      );
      this.reportDateRange = [startDate, endDate];
      this.detailsInfoData.inventoryEndDate = this.formatDate(
        new Date(endDate),
        "yyyy 年 MM 月 dd 日 "
      );
      //根据时间获取库存信息,并渲染
      this.getDetailsList(startDate, endDate);
      this.visible = true;
    },

    //根据时间获取库存信息,并渲染
    getDetailsList(startDate, endDate) {
      //调后台查询数据
      // getDetailsListByTime("2022-10-01 08:00:00", "2022-10-20 08:00:00").then(
      getDetailsListByTime(startDate + " 08:00:00", endDate + " 08:00:00").then(
        (res) => {
          if (res.body.length > 0) {
            this.detailsData = res.body;
            this.detailsData.forEach((item) => {
              item.serialNo = this.detailsInfoData.serialNo;
            });
          } else {
            this.detailsData = [];
            this.$message.warning("暂无数据,请重新选择时间");
          }
        }
      );
    },

    deleteClick() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请选择！");
      } else {
        deleteByIds(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功！");
            this.getList();
          } else {
            this.$message.error("删除失败！");
          }
        });
      }
      //清空表格多选框
      this.selectedRowKeys = [];
    },

    //提交 开启流程
    submitClick() {
      submit(this.detailsInfoData.id).then((res) => {
        if (res.code == "200") {
          this.$message.success("提交成功");
          this.visible = false;
          this.getList();
        } else {
          this.$message.success("提交失败");
        }
      });
    },

    //审批
    approvalCommit() {
      let params = {
        id: this.detailsInfoData.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      };
      approval(params).then((res) => {
        if (res.code == "200") {
          this.$message.success("审批成功");
          this.visible = false;
          this.getList();
        } else {
          this.$message.warning("审批失败");
        }
      });
    },

    //获得当前页面
    getList() {
      getList(this.searchForm).then((res) => {
        if (res.body) {
          this.dataSource = res.body.data;
          this.pagination.current = res.body.pageIndex;
          this.pagination.pageSize = res.body.pageSize;
          this.pagination.total = res.body.total;
        }
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
    // 弹出框取消
    cancelClick() {
      this.visible = false;
    },

    //重置输入
    resetForm() {
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
    //格式化日期   xxxx年xx月xx日转换成xxxx-xx-xx
    formatDateFor_(date) {
      date = date.replace(/\s*/g, "") + " ";
      date = date.substring(0, date.indexOf(" "));
      date = date.replace(/([年月])/g, "-");
      date = date.replace(/日/g, "");
      return this.formatDate(new Date(date), "yyyy-MM-dd");
    },
  },
};
</script>
    <style scoped  lang="less">
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
.TableTop {
  margin-top: 10px;
}
.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}

.input {
  /deep/.ant-input {
    border: 1px solid #fff;
    height: 26px;
  }
}
</style>
    