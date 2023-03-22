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
        ]"
        @addNew="addClick"
        @mydelete="deleteClick"
      ></pe-button>
    </template>

    <template slot="appMain">
      <!--查询控件及按钮-->
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <a-col :span="8">
                  <a-form-item
                    :labelCol="{ style: 'width: 100px' }"
                    label="月份"
                  >
                    <a-row :gutter="24">
                      <a-col :span="11">
                        <a-month-picker
                          value-format="yyyy-MM"
                          v-model="searchForm.beginMonth"
                          :getCalendarContainer="getPopupContainer"
                        />
                      </a-col>
                      <a-col :span="2" style="padding-left: 10px"> 至 </a-col>
                      <a-col :span="11">
                        <a-month-picker
                          value-format="yyyy-MM"
                          v-model="searchForm.endMonth"
                          :getCalendarContainer="getPopupContainer"
                        />
                      </a-col>
                    </a-row>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 130px' }"
                    label="填报人"
                  >
                    <a-input
                      v-model="searchForm.lastModifiedUser"
                      placeholder="请输入填报人"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 130px' }"
                    label="状态"
                  >
                    <a-select
                      placeholder="请选择"
                      ref="select"
                      v-model="searchForm.recordStatus"
                      :options="statusOptions"
                      default-value="0"
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
      <!--主页表格-->
      <dc-table
        class="list_table_2"
        :scroll="{ y: 1, x: 100 }"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          fixed: true,
        }"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
        :customRow="rowStyle"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            v-if="row.index != '本页合计'"
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
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
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
      </dc-table>
      <!--新增/编辑弹窗-->
      <dc-Model v-model="visible" class="DcModel" :modelConfig="modelConfig">
        <a-layout>
          <a-layout-content>
            <!-- 报表 -->
            <div>
              <!-- 打印区域 -->
              <div id="printContent">
                <!-- 月报报表 -->
                <table class="table_form" width="100%" border="2">
                  <tr style="height: 80px; font-size: 18px">
                    <th colspan="5">
                      北京燃气集团（天津）液化天然气有限公司
                      <br />
                      <span v-if="pageType == 'add' || pageType == 'edit'">
                        <a-month-picker
                          style="font-size: 18px"
                          @change="reportMonthChange"
                        >
                          <span>
                            {{ reportData.reportYear }}
                            年
                            {{ reportData.reportMonth }}
                            月耗水量统计表
                          </span>
                        </a-month-picker>
                      </span>
                      <span v-else style="font-size: 18px">
                        {{ reportData.reportYear }}
                        年
                        {{ reportData.reportMonth }}
                        月耗水量统计表
                      </span>
                    </th>
                  </tr>
                  <tr>
                    <td colspan="5">
                      <a-range-picker
                        v-if="pageType == 'add' || pageType == 'edit'"
                        @change="reportDateChange"
                        v-model="reportData.reportDateRange"
                        format="YYYY-MM-DD"
                      >
                        <span align="center" style="text-indent: -13em">
                          {{ reportData.reportDateRangeText }}
                        </span>
                      </a-range-picker>
                      <div v-else align="center" style="text-indent: -7em">
                        {{ reportData.reportDateRangeText }}
                      </div>
                    </td>
                  </tr>
                  <tr style="height: 30px">
                    <td colspan="3" align="left">
                      <span
                        >&nbsp;&nbsp;填报人：{{
                          reportData.lastModifiedUser
                        }}</span
                      >
                    </td>
                    <td align="right" colspan="2">
                      <span>编号：{{ reportData.reportCode }}&nbsp;&nbsp;</span>
                    </td>
                  </tr>
                  <tr style="height: 25px">
                    <td width="20%">日期</td>
                    <td width="20%">生活用水量(t)</td>
                    <td width="20%">生产用水量(t)</td>
                    <td width="20%">合计量(t)</td>
                    <td width="20%">备注</td>
                  </tr>
                  <tr
                    v-for="(item, index) in dailyDataSource"
                    :key="index"
                    style="height: 20px"
                  >
                    <td>{{ item.reportDate }}</td>
                    <td>{{ item.lifeWater }}</td>
                    <td>{{ item.prodWater }}</td>
                    <td>{{ item.totWater }}</td>
                    <td>{{ item.remark }}</td>
                  </tr>
                  <tr style="height: 30px">
                    <td>本月合计</td>
                    <td>{{ reportData.lifeConsumption }}</td>
                    <td>{{ reportData.productionConsumption }}</td>
                    <td>{{ reportData.totalConsumption }}</td>
                    <td></td>
                  </tr>
                </table>
              </div>

              <!--审批页签部分-->
              <div v-if="pageType == 'look' || pageType == 'approval'">
                <br />
                <stepsModel
                  class=""
                  ref="stepsModel"
                  :isShow="pageType === 'approval' ? true : false"
                  :id="reportData.id"
                />
              </div>
            </div>
          </a-layout-content>
          <a-layout-footer>
            <a-button
              v-if="pageType == 'add' || pageType == 'edit'"
              type="primary"
              @click="saveClick()"
            >
              保存
            </a-button>
            <a-button
              v-if="pageType == 'add' || pageType == 'edit'"
              type="primary"
              @click="saveClick('submit')"
            >
              提交
            </a-button>
            <a-button
              type="primary"
              v-if="pageType == 'approval'"
              @click="approvalCommit()"
            >
              确定
            </a-button>
            <a-button
              type="primary"
              v-if="pageType == 'look'"
              v-print="printConfig"
              key="1"
            >
              打印
            </a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getListForPage,
  add,
  queryDailyData,
  update,
  deletes,
  submit,
  approval,
} from "@/api/energyManagement/energyStatistics/waterMonthlyReport.js";

import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
import moment from "moment";

export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      pageType: "",
      printConfig: {
        id: "printContent",
        popTitle: "耗水量统计表",
      },
      //报表数据
      reportData: {
        //报表年YYYY
        reportYear: "",
        //报表月MM
        reportMonth: "",
        //报表年月YYYY-MM
        reportYearMonth: "",
        //编号
        reportCode: "--",
        //报表日期范围
        reportDateRange: [],
        //报表开始时间
        beginDate: "",
        //报表结束时间
        endDate: "",
        //编制人
        lastModifiedUser: "--",
        //生活用水合计
        lifeConsumption: 0,
        //生产用水合计
        productionConsumption: 0,
        //合计用水
        totalConsumption: 0,
        //报表日期范围文字
        reportDateRangeText:
          "XXXX 年 XX 月 XX 日 08:00 - XXXX 年 XX 月 XX 日 08:00",
      },
      //翻页页面组件
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        // pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        pageSizeOptions: ["11", "21", "31", "41", "51", "61"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 11, // 每页条数，所有页设置统一的条数
      },
      //勾选框/选择框组件
      selectedRowKeys: [],
      //查询条件中月分选择器
      monthRange: [],
      //查询条件 填报日期选择器
      dateRange: [],
      //查询所需的数据
      searchForm: {
        pageSize: 10,
        pageNum: 1,
      },
      statusOptions: [
        { value: "1", label: "已保存" },
        { value: "2", label: "已提交" },
        { value: "3", label: "审批中" },
        { value: "4", label: "已审批" },
        { value: "5", label: "已拒绝" },
        { value: "6", label: "已完成" },
      ],
      visible: false,
      //新增/编辑弹窗配置
      modelConfig: {
        width: "950px",
        // title: "临时检修计划-新增",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //主页面表格属性
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          // customRender: (text, record, index) =>
          //   `${
          //     (this.pagination.current - 1) * this.pagination.pageSize +
          //     index +
          //     1
          //   }`,
          width: 80,

          align: "center",
        },
        {
          title: "月份",
          dataIndex: "reportYearMonth",
          width: 80,
          align: "center",
        },
        {
          title: "生活用水(t)",
          dataIndex: "lifeConsumption",
          width: 120,
          align: "center",
        },
        {
          title: "生产用水(t)",
          dataIndex: "productionConsumption",
          width: 120,
          align: "center",
        },
        {
          title: "本月用水合计(t)",
          dataIndex: "totalConsumption",
          width: 120,
          align: "center",
        },
        {
          title: "填报人",
          dataIndex: "lastModifiedUser",
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
          fixed: "right",
          width: 150,
          align: "center",
        },
      ],
      //表格中的数据
      dataSource: [],
      //表格中的数据
      dailyDataSource: [],
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
    //合计行  加背景颜色
    rowStyle(record) {
      if (record.index == "本页合计") {
        return {
          style: {
            "background-color": "#eeeeee",
          },
        };
      }
    },

    //设置合计行 均值行  多选框不可选择
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.index === "本页合计",
        name: record.name,
      },
    }),

    //日期月份改变，修改报表标题中的年月，生成报表起始时间并查询日报数据
    reportMonthChange(date) {
      // 修改副标题年月
      if (date != null) {
        let year = this.formatDate(new Date(date), "yyyy");
        let month = this.formatDate(new Date(date), "MM");
        this.$set(this.reportData, "reportYear", year);
        this.$set(this.reportData, "reportMonth", month);
        this.reportData.reportYearMonth = year + "-" + month;
      }
      //生成开始日期，结束日期，并调用接口查询日报数据
      this.getReportDate();
    },

    //生成开始日期，结束日期，并调用接口查询日报数据
    getReportDate() {
      let year = this.reportData.reportYear;
      let month = this.reportData.reportMonth;
      if (year && month) {
        let beginDate = "";
        let endDate = "";

        var lastDate = new Date(year, month, 0).getDate(); //获取当月最后一日
        // month = month < 10 ? "0" + month : month; //月份补 0
        endDate = [year, month, lastDate].join("-");

        beginDate = year + "-" + month + "-01";

        //报表日期范围选择器赋值
        this.reportData.reportDateRange = [moment(beginDate), moment(endDate)];
        //
        this.reportData.beginDate = beginDate;
        this.reportData.endDate = endDate;
        //修改标题
        this.getReportDateRangeText(beginDate, endDate);

        //查询日报数据,渲染到表格中
        this.getDailyList(
          this.formatDate(
            new Date(this.reportData.reportDateRange[0]),
            "yyyy-MM-dd"
          ),
          this.formatDate(
            new Date(this.reportData.reportDateRange[1]),
            "yyyy-MM-dd"
          )
        );
      }
    },

    //弹窗日期变化触发
    reportDateChange(dates) {
      if (dates.length != 0) {
        /**
         * 1、修改表格日期标题
         */
        //拼接报表中的日期格式
        this.$set(
          this.reportData,
          "reportDateRangeText",
          this.getReportDateRangeText(dates[0], dates[1])
        );
        //2、修改全局变量中的开始日期，结束日期
        this.reportData.beginDate = this.formatDate(
          new Date(dates[0]),
          "yyyy-MM-dd"
        );
        this.reportData.endDate = this.formatDate(
          new Date(dates[1]),
          "yyyy-MM-dd"
        );
        /**
         * 2、查询日报数据，渲染到表格中
         */
        this.getDailyList(
          this.formatDate(new Date(dates[0]), "yyyy-MM-dd"),
          this.formatDate(new Date(dates[1]), "yyyy-MM-dd")
        );
      } else {
        this.$set(
          this.reportData,
          "reportDateRangeText",
          this.getReportDateRangeText()
        );
      }
    },

    //拼接报表中的日期文字(XXXX 年 XX 月 XX 日  至 XXXX 年 XX 月 XX 日 )
    getReportDateRangeText(beginDate, endDate) {
      if (beginDate && endDate) {
        beginDate = this.formatDate(new Date(beginDate), "yyyy 年 MM 月 dd 日");
        endDate = this.formatDate(new Date(endDate), "yyyy 年 MM 月 dd 日");
        this.reportData.reportDateRangeText = beginDate + " - " + endDate;
        return beginDate + " - " + endDate;
      } else {
        this.reportData.reportDateRangeText =
          "XXXX 年 XX 月 XX 日 至 XXXX 年 XX 月 XX 日";
        return "XXXX 年 XX 月 XX 日 至 XXXX 年 XX 月 XX 日";
      }
    },
    //表格多选框改变触发
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },

    //获取日报数据，渲染到报表中
    getDailyList(beginDate, endDate, type) {
      let searchForm = {
        beginDate: beginDate,
        endDate: endDate,
      };
      queryDailyData(searchForm).then((res) => {
        if (res.body) {
          this.dailyDataSource = res.body.waterDailyDataDtoList;
          //type不为空是编辑页面请求，不需要渲染合计行
          if (!type) {
            //渲染合计行数据
            this.reportData.lifeConsumption = res.body.lifeConsumption;
            this.reportData.productionConsumption =
              res.body.productionConsumption;
            this.reportData.totalConsumption = res.body.totalConsumption;
          }
        } else {
          delete this.reportData.lifeConsumption;
          delete this.reportData.productionConsumption;
          delete this.reportData.totalConsumption;
        }
      });
    },

    //提交 开启流程
    submitClick() {
      submit(this.reportData.id).then((res) => {
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
        id: this.reportData.id,
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

    //点击新增，打开新增弹窗
    addClick() {
      this.pageType = "add";
      this.modelConfig.title = "耗水统计月报-新增";
      //生成编号
      let reportCode = "HSTJYB" + this.formatDate(new Date(), "yyyyMMddHHmmss");
      let userName = this.$store.state.user.name;
      //初始化表单
      this.reportData = {
        reportCode: reportCode,
        //报表月份
        reportYearMonth: "",
        //编制人
        lastModifiedUser: userName,
        //报表日期范围
        reportDateRange: [],
        //生活用水合计
        lifeConsumption: 0,
        //生产用水合计
        productionConsumption: 0,
        //合计用水
        totalConsumption: 0,
        //报表日期范围文字
        reportDateRangeText: "XXXX 年 XX 月 XX 日 至 XXXX 年 XX 月 XX 日",
      };
      this.visible = true;
      this.reportMonthChange(this.formatDate(new Date(), "yyyy-MM"));
    },

    //点击编辑
    editClick(val) {
      this.pageType = "edit";
      this.modelConfig.title = "耗水统计月报-编辑";
      this.visible = true;
      this.reportData = {
        id: val.id,
        //报表年YYYY
        reportYear: val.reportYearMonth
          ? val.reportYearMonth.substring(0, 4)
          : "",
        //报表月MM
        reportMonth: val.reportYearMonth
          ? val.reportYearMonth.substring(5, 7)
          : "",
        //报表年月YYYY-MM
        reportYearMonth: val.reportYearMonth,
        //编号
        reportCode: val.reportCode,
        //报表日期范围
        reportDateRange: [val.beginDate, val.endDate],
        //报表开始时间
        beginDate: val.beginDate,
        //报表结束时间
        endDate: val.endDate,
        //编制人
        lastModifiedUser: val.lastModifiedUser,
        //生活用水合计
        lifeConsumption: val.lifeConsumption,
        //生产用水合计
        productionConsumption: val.productionConsumption,
        //合计用水
        totalConsumption: val.totalConsumption,
        //报表日期范围文字
        reportDateRangeText: this.getReportDateRangeText(
          val.beginDate,
          val.endDate
        ),
      };
      this.getDailyList(val.beginDate, val.endDate, "edit");
    },

    //点击表格中审批按钮
    approvalClick(val) {
      this.lookClick(val);
      this.pageType = "approval";
    },

    //点击查看
    lookClick(val) {
      this.pageType = "look";
      this.modelConfig.title = "耗水统计月报-详情";
      this.visible = true;
      this.reportData = {
        id: val.id,
        //报表年YYYY
        reportYear: val.reportYearMonth
          ? val.reportYearMonth.substring(0, 4)
          : "",
        //报表月MM
        reportMonth: val.reportYearMonth
          ? val.reportYearMonth.substring(5, 7)
          : "",
        //报表年月YYYY-MM
        reportYearMonth: val.reportYearMonth,
        //编号
        reportCode: val.reportCode,
        //报表日期范围
        reportDateRange: [val.beginDate, val.endDate],
        //报表开始时间
        beginDate: val.beginDate,
        //报表结束时间
        endDate: val.endDate,
        //编制人
        lastModifiedUser: val.lastModifiedUser,
        //生活用水合计
        lifeConsumption: val.lifeConsumption,
        //生产用水合计
        productionConsumption: val.productionConsumption,
        //合计用水
        totalConsumption: val.totalConsumption,
        //报表日期范围文字
        reportDateRangeText: this.getReportDateRangeText(
          val.beginDate,
          val.endDate
        ),
      };
      this.getDailyList(val.beginDate, val.endDate, "edit");
    },

    //新增编辑保存保存
    saveClick(type) {
      if (
        this.reportData.reportCode &&
        this.reportData.beginDate &&
        this.reportData.endDate &&
        this.reportData.reportYearMonth &&
        this.reportData.lastModifiedUser
      ) {
        var reportBeginYearMonth = this.reportData.beginDate.substring(0, 7);
        var reportEndYearMonth = this.reportData.endDate.substring(0, 7);
        var reportYearMonth = this.reportData.reportYearMonth;
        //判断所选日期是否在月份范围内
        if (
          reportBeginYearMonth <= reportYearMonth &&
          reportYearMonth <= reportEndYearMonth
        ) {
          this.saveOperation(type);
        } else {
          var _this = this;
          this.$confirm({
            content: "您所选择的日期不在该月份范围内，请确认是否要提交？",
            onOk() {
              _this.saveOperation(type);
            },
            onCancel() {},
          });
        }
      } else {
        this.$message.warning("请输入正确格式的数据！");
      }
    },

    saveOperation(type) {
      if (this.reportData.id) {
        this.editOperation(type);
      } else {
        this.addOperation(type);
      }
    },

    handleCancel() {
      this.visible = false;
    },

    //新增操作
    addOperation(type) {
      add(this.reportData).then((res) => {
        if (res.code == "200") {
          if (type == "submit") {
            this.reportData.id = res.body;
            this.submitClick();
          } else {
            this.$message.success("保存成功！");
            this.getList();
            this.visible = false;
          }
        } else {
          if (type == "submit") {
            this.$message.error("提交失败！");
          } else {
            this.$message.error("保存失败！");
          }
        }
      });
    },

    //编辑操作
    editOperation(type) {
      update(this.reportData).then((res) => {
        if (res.code == "200") {
          if (type == "submit") {
            this.submitClick();
          } else {
            this.$message.success("编辑成功！");
            this.getList();
            this.visible = false;
          }
        } else {
          if (type == "submit") {
            this.$message.error("提交失败！");
          } else {
            this.$message.error("编辑失败！");
          }
        }
      });
    },

    //删除操作
    deleteOperation() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请选择！");
      } else {
        let visibleDelete = true;
        this.selectedRowKeys.forEach((id) => {
          this.dataSource.forEach((item) => {
            if (item.id == id && item.recordStatus != "1") {
              visibleDelete = false;
            }
          });
        });
        if (visibleDelete) {
          deletes(this.selectedRowKeys).then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功！");
              //清空表格多选框
              this.selectedRowKeys = [];
              this.getList();
            } else {
              this.$message.error("删除失败！");
            }
          });
        } else {
          this.$message.warning("已提交数据不可删除,请重新选择");
        }
      }
    },

    // 合计
    getSum() {
      let lifeConsumption = 0;
      let productionConsumption = 0;
      let totalConsumption = 0;
      this.dataSource.forEach((item, index) => {
        item.index =
          (this.pagination.current - 1) * (this.pagination.pageSize - 1) +
          index +
          1;
        //累加
        lifeConsumption = this.accAdd(
          lifeConsumption,
          isNaN(new Number(item.lifeConsumption))
            ? 0
            : new Number(item.lifeConsumption)
        );
        productionConsumption = this.accAdd(
          productionConsumption,
          isNaN(new Number(item.productionConsumption))
            ? 0
            : new Number(item.productionConsumption)
        );
        totalConsumption = this.accAdd(
          totalConsumption,
          isNaN(new Number(item.totalConsumption))
            ? 0
            : new Number(item.totalConsumption)
        );
        //直接加会失真
        // lifeConsumption += isNaN(new Number(item.lifeConsumption))
        //   ? 0
        //   : new Number(item.lifeConsumption);
        // productionConsumption += isNaN(new Number(item.productionConsumption))
        //   ? 0
        //   : new Number(item.productionConsumption);
        // totalConsumption += isNaN(new Number(item.totalConsumption))
        //   ? 0
        //   : new Number(item.totalConsumption);
      });
      let sumData = {
        id: "-999",
        index: "本页合计",
        lifeConsumption: lifeConsumption,
        productionConsumption: productionConsumption,
        totalConsumption: totalConsumption,
      };
      this.dataSource.push(sumData);
    },

    //加法
    accAdd(arg1, arg2) {
      var r1, r2, m;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (arg1 * m + arg2 * m) / m;
    },

    //获得当前页面
    getList() {
      getListForPage(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.dataSource.forEach((item) => {
          this.statusOptions.forEach((option) => {
            if (item.recordStatus == option.value) {
              item.recordStatusName = option.label;
            }
          });
        });
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize + 1;
        this.pagination.total = res.body.total;
        if (this.dataSource.length > 0) {
          this.getSum();
        }
      });
      this.selectedRowKeys = [];
    },

    //查询功能
    searchClick() {
      if (this.dateRange.length != 0) {
        this.searchForm.createdBeginDateTime = this.dateRange[0];
        this.searchForm.createdEndDateTime = this.dateRange[1];
      } else {
        delete this.searchForm.createdBeginDateTime;
        delete this.searchForm.createdEndDateTime;
      }
      if (this.monthRange.length != 0) {
        this.searchForm.monthBegin = this.formatDate(
          new Date(this.monthRange[0]),
          "yyyy-MM"
        );
        this.searchForm.monthEnd = this.formatDate(
          new Date(this.monthRange[1]),
          "yyyy-MM"
        );
      } else {
        delete this.searchForm.monthBegin;
        delete this.searchForm.monthEnd;
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
      this.monthRange = [];
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.getList();
    },

    // 点击确定删除
    deleteClick() {
      this.deleteOperation();
    },

    //查询条件月份范围选择器必备方法
    monthRangeChange(value, mode) {
      this.monthRange = value;
      this.mode2 = [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1],
      ];
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
<style scoped lang="less">
.table_form {
  text-align: center;
  border-bottom-width: 0px;
  tr {
    th {
      text-align: center;
    }
  }
}
.table_footer {
  border-top: none;
}
</style>
// 去除打印的页眉页脚
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 8mm; /* this affects the margin in the printer settings */
}
</style>
// 去除打印的页眉页脚