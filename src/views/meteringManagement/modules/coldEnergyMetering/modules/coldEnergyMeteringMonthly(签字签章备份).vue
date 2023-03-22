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
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="月报类型"
                  >
                    <a-select
                      placeholder="请选择"
                      ref="select"
                      v-model="searchForm.type"
                      :options="reportTypeOptions"
                      :getPopupContainer="getPopupContainer"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="用户单位"
                  >
                    <a-input
                      v-model="searchForm.createUserSubsidiaryOrganName"
                      placeholder="请输入用户单位"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
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
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="填报时间"
                  >
                    <a-range-picker
                      v-model="dateRange"
                      valueFormat="YYYY-MM-DD"
                      :placeholder="['开始时间', '结束时间']"
                      :getCalendarContainer="getPopupContainer"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="月份"
                  >
                    <a-range-picker
                      format="YYYY-MM"
                      v-model="monthRange"
                      :mode="['month', 'month']"
                      @panelChange="monthRangeChange"
                      :placeholder="['开始月份', '结束月份']"
                      :getCalendarContainer="getPopupContainer"
                    />
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
                      v-model="searchForm.status"
                      :options="statusOptions"
                      default-value="0"
                      :getPopupContainer="getPopupContainer"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
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
                disabled: $audit.editDisabled(row.status),
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
                <div v-if="pageType == 'add' || pageType == 'edit'">
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
                              液化天然气
                              {{ reportData.reportYear }}
                              年
                              {{ reportData.reportMonth }}
                              月冷能销售汇总表
                            </span>
                          </a-month-picker>
                        </span>
                        <span v-else style="font-size: 18px">
                          液化天然气
                          {{ reportData.reportYear }}
                          年
                          {{ reportData.reportMonth }}
                          月冷能销售汇总表
                        </span>
                      </th>
                    </tr>
                    <tr style="height: 30px">
                      <td align="left" width="20%">
                        月报类型：
                        <a-select
                          style="width: 100px"
                          v-model="reportData.reportType"
                          @change="reportTypeChange"
                          v-if="pageType == 'add' || pageType == 'edit'"
                        >
                          <a-select-option
                            :value="item.value"
                            v-for="(item, index) in reportTypeAddOptions"
                            :key="index"
                          >
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                        <span v-else>{{ reportData.reportTypeName }}</span>
                      </td>

                      <td colspan="4">
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
                    <tr style="height: 25px">
                      <td colspan="3" align="left" width="50%">
                        编制人：{{ reportData.fillUser }}
                      </td>
                      <td colspan="2" align="left" width="50%">
                        编号:{{ reportData.reportCode }}
                      </td>
                    </tr>
                    <tr style="height: 25px">
                      <td width="8%">日期</td>
                      <td width="20%">供应量（t）</td>
                      <td width="22%">保冷循环量（t）</td>
                      <td width="30%">销售量（t）</td>
                      <td width="20%">备注</td>
                    </tr>

                    <tr
                      v-for="(item, index) in dailyDataSource"
                      :key="index"
                      style="height: 20px"
                    >
                      <td>{{ item.day }}</td>
                      <td>{{ item.supply }}</td>
                      <td>{{ item.circulation }}</td>
                      <td>{{ item.salesVolume }}</td>
                      <td>{{ item.remark }}</td>
                    </tr>
                    <tr style="height: 30px">
                      <td>合计</td>
                      <td>{{ reportData.supplySum }}</td>
                      <td>{{ reportData.circulationSum }}</td>
                      <td>{{ reportData.salesVolumeSum }}</td>
                      <td></td>
                    </tr>
                    <tr style="height: 30px">
                      <td colspan="5" align="left">
                        注：本月LNG冷能空分装置累计开工运行
                        <a-input-number
                          v-if="pageType == 'add' || pageType == 'edit'"
                          id="inputNumber"
                          v-model="reportData.runDays"
                        />
                        <span v-else>{{ reportData.runDays }} </span>
                        天
                      </td>
                    </tr>
                  </table>

                  <!-- <table
                    width="100%"
                    border="2"
                    class="table_footer"
                    height="100px"
                    v-if="signVisible"
                  >
                    <tr style="height: 30px">
                      <td align="center" style="width: 50%" colspan="1">
                        北京燃气集团（天津）液化天然气有限公司
                        <br />（计量章）<br />
                        计量员
                      </td>
                      <td align="center" colspan="1">
                        XXX公司
                        <br />(计量章)<br />
                        计量员
                      </td>
                    </tr>
                  </table> -->
                </div>
                <div v-else>
                  <img
                    :src="src"
                    style="max-width: 100%; margin-bottom: -82%"
                  />
                </div>
              </div>
              <table width="100%" class="table_footer">
                <tr style="height: 30px">
                  <td align="center">
                    <span style="float: left">
                      <a-form-item
                        label="附件"
                        :labelCol="{ style: 'width: 100px' }"
                      >
                        <div style="display: flex">
                          <file-upload
                            :Text="'上传文件'"
                            @fileChange="fileListChange"
                            :echoList="fileList"
                            ref="importConpontsDataRef"
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                          ></file-upload>
                        </div>
                      </a-form-item>
                    </span>
                  </td>
                </tr>
              </table>
              <!--审批页签部分-->
              <div v-if="pageType == 'look' || pageType == 'approval'">
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
              v-if="pageType == 'edit'"
              type="primary"
              @click="submitClick()"
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
import { getListForMonthReport } from "@/api/meteringManagement/coldEnergyMeteringDaily.js";
import {
  getListForPage,
  add,
  update,
  deletes,
  submitAndSign,
  audioAndSign,
  // submit,
  // approval,
} from "@/api/meteringManagement/coldEnergyMeteringMonthly.js";
import { getBase64StrByBusiness } from "@/api/file.js";
import utils from "@/utils/url";
import fileUpload from "@/components/upLoad/fileUpload";

import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
import moment from "moment";

export default {
  components: {
    fileUpload,
    stepsModel,
  },
  data() {
    return {
      src: "",
      pageType: "",
      printConfig: {
        id: "printContent",
        popTitle: "冷能销售汇总表",
      },
      fileList: [],
      urls: "fileinfo/downloadFile?",
      //默认统计型，不显示签字部分
      signVisible: false,
      //报表数据
      reportData: {
        //报表年YYYY
        reportYear: "",
        //报表月MM
        reportMonth: "",
        //报表年月YYYY-MM
        reportYearMonth: "",
        //类型
        reportType: "1",
        //编号
        reportCode: "--",
        //报表日期范围
        reportDateRange: [],
        //报表开始时间
        reportBeginDate: "",
        //报表结束时间
        reportEndDate: "",
        //接收站名称
        receivingStationName: "北京燃气集团(天津)液化天然气有限公司",
        //编制人
        fillUser: "--",
        //单位名称
        companyName: "",
        //接收站计量员
        gaugerA: "",
        //单位计量员
        gaugerB: "",
        //供应量合计
        supplySum: 0,
        //保冷循环量合计
        circulationSum: 0,
        //销售量合计
        salesVolumeSum: 0,
        //截止日期
        //报表日期范围文字
        reportDateRangeText:
          "XXXX 年 XX 月 XX 日 08:00 - XXXX 年 XX 月 XX 日 08:00",
        //运行天数
        runDays: "0",
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
      //详情页面标签页默认选中第一个
      activeKey: "1",
      reportTypeOptions: [
        { value: "1", label: "统计型" },
        { value: "2", label: "结算型" },
      ],
      reportTypeAddOptions: [
        { value: "1", label: "统计型" },
        { value: "2", label: "结算型" },
      ],
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
          width: 90,
          align: "center",
        },
        {
          title: "月报类型",
          dataIndex: "reportTypeName",
          width: 80,
          align: "center",
        },
        {
          title: "编号",
          dataIndex: "code",
          width: 170,
          align: "center",
        },
        {
          title: "月份",
          dataIndex: "monthDate",
          width: 80,
          align: "center",
        },
        {
          title: "用户单位",
          dataIndex: "createUserSubsidiaryOrganName",
          width: 130,
          align: "center",
        },
        {
          title: "供应量(t)",
          dataIndex: "supply",
          width: 100,
          align: "center",
        },
        {
          title: "保冷循环量(t)",
          dataIndex: "circulation",
          width: 100,
          align: "center",
        },
        {
          title: "销售量(t)",
          dataIndex: "salesVolume",
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
          title: "填报时间",
          dataIndex: "createdDateTime",
          width: 150,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "statusName",
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

    //报表类型改变，隐藏显示签字区，生成报表起始时间并查询日报数据
    reportTypeChange(val) {
      //统计型
      if (val == "1") {
        delete this.reportData.receivingStationName;
        delete this.reportData.companyName;
        delete this.reportData.gaugerA;
        delete this.reportData.gaugerB;
        this.signVisible = false;
      }
      //结算型
      else {
        this.$set(
          this.reportData,
          "receivingStationName",
          "北京燃气集团(天津)液化天然气有限公司"
        );
        this.$set(this.reportData, "companyName", "");
        this.$set(this.reportData, "gaugerA", "");
        this.$set(this.reportData, "gaugerB", "");
        this.signVisible = true;
      }
      //生成报表起始时间，并调用接口查询日报数据
      this.getReportDate();
    },

    //生成开始日期，结束日期，并调用接口查询日报数据
    getReportDate() {
      let year = this.reportData.reportYear;
      let month = this.reportData.reportMonth;
      let reportType = this.reportData.reportType;
      if (year && month && reportType) {
        let reportYearMonth = new Date(year + "-" + month);
        let reportBeginDate = "";
        let reportEndDate = "";
        //统计型（每月1日至月底最后一天装车量）
        if (reportType == "1") {
          //月份加1
          reportYearMonth = this.formatDate(
            new Date(reportYearMonth.setMonth(reportYearMonth.getMonth() + 1)),
            "yyyy-MM"
          );
          reportBeginDate = year + "-" + month + "-01";
          reportEndDate = reportYearMonth + "-01";
        }
        //结算型（上月26日至本月25日的装车量）
        else if (reportType == "2") {
          //月份减1
          reportYearMonth = this.formatDate(
            new Date(reportYearMonth.setMonth(reportYearMonth.getMonth() - 1)),
            "yyyy-MM"
          );
          reportBeginDate = reportYearMonth + "-26";
          reportEndDate = year + "-" + month + "-26";
        }
        //报表日期范围选择器赋值
        this.reportData.reportDateRange = [
          moment(reportBeginDate),
          moment(reportEndDate),
        ];
        //
        this.reportData.reportBeginDate = reportBeginDate;
        this.reportData.reportEndDate = reportEndDate;
        //修改标题
        this.getReportDateRangeText(
          reportBeginDate + " 08:00",
          reportEndDate + " 08:00"
        );
        let endDate = new Date(this.reportData.reportDateRange[1]);

        //查询日报数据,渲染到表格中
        this.getDailyList(
          this.formatDate(
            new Date(this.reportData.reportDateRange[0]),
            "yyyy-MM-dd"
          ),
          this.formatDate(
            new Date(endDate.setDate(endDate.getDate() - 1)),
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
        this.reportData.reportBeginDate = this.formatDate(
          new Date(dates[0]),
          "yyyy-MM-dd"
        );
        this.reportData.reportEndDate = this.formatDate(
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

    //拼接报表中的日期文字(XXXX 年 XX 月 XX 日 08:00 至 XXXX 年 XX 月 XX 日 08:00)
    getReportDateRangeText(startDate, endDate) {
      if (startDate && endDate) {
        startDate = this.formatDate(new Date(startDate), "yyyy 年 MM 月 dd 日");
        endDate = this.formatDate(new Date(endDate), "yyyy 年 MM 月 dd 日");
        this.reportData.reportDateRangeText =
          startDate + " 08:00 - " + endDate + " 08:00";
        return startDate + " 08:00 - " + endDate + " 08:00";
      } else {
        this.reportData.reportDateRangeText =
          "XXXX 年 XX 月 XX 日 08:00 至 XXXX 年 XX 月 XX 日 08:00";
        return "XXXX 年 XX 月 XX 日 08:00 至 XXXX 年 XX 月 XX 日 08:00";
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
      getListForMonthReport(searchForm).then((res) => {
        if (res.body) {
          this.dailyDataSource = res.body.dailyDataList;
          //type不为空是编辑页面请求，不需要渲染合计行
          if (!type) {
            //渲染合计行数据
            this.reportData.supplySum = res.body.supplySum;
            this.reportData.circulationSum = res.body.circulationSum;
            this.reportData.salesVolumeSum = res.body.salesVolumeSum;
          }
        } else {
          this.dailyDataSource = [];
          delete this.reportData.supplySum;
          delete this.reportData.circulationSum;
          delete this.reportData.salesVolumeSum;
        }
      });
    },

    //单位下拉框值不改变,手动改变
    companyNameChange(value) {
      this.$set(this.reportData, "companyName", value ? value : "");
    },

    //提交 开启流程
    submitClick() {
      //TODO 正式环境身份证号放开
      let idNumber = "130928198811221714";
      // let idNumber = this.$store.state.user.idNumber
      this.reportData.idNumber = idNumber;
      this.reportData.detailList = this.dailyDataSource;
      submitAndSign(this.reportData).then((res) => {
        if (res.code == "200") {
          this.$message.success("提交成功");
          this.handleCancel();
        } else {
          this.$message.warning("提交失败");
        }
      });

      // submit(this.reportData.id).then((res) => {
      //   if (res.code == "200") {
      //     this.$message.success("提交成功");
      //  this.handleCancel();
      //   } else {
      //     this.$message.success("提交失败");
      //   }
      // });
    },

    //审批
    approvalCommit() {
      //TODO 正式环境身份证号放开
      let idNumber = "130928198811221714";
      // let idNumber = this.$store.state.user.idNumber
      this.reportData.idNumber = idNumber;
      this.reportData.detailList = this.dailyDataSource;
      this.reportData.type = this.$refs.stepsModel.form.type;
      this.reportData.opinion = this.$refs.stepsModel.form.opinion;

      audioAndSign(this.reportData).then((res) => {
        if (res.code == 200) {
          this.$message.success("审批成功");
          this.handleCancel();
        } else {
          this.$message.warning("审批失败");
        }
      });

      // let params = {
      //   id: this.reportData.id,
      //   type: this.$refs.stepsModel.form.type,
      //   opinion: this.$refs.stepsModel.form.opinion,
      // };
      // approval(params).then((res) => {
      //   if (res.code == "200") {
      //     this.$message.success("审批成功");
      // this.handleCancel();

      //   } else {
      //     this.$message.warning("审批失败");
      //   }
      // });
    },

    //点击新增，打开新增弹窗
    addClick() {
      this.pageType = "add";
      this.modelConfig.title = "冷能计量月报-新增";
      //默认统计型，不显示签字部分
      this.signVisible = false;
      //生成编号
      let reportCode = "LNJLYB" + this.formatDate(new Date(), "yyyyMMddHHmmss");
      let userName = this.$store.state.user.name;
      //清空文件选择器
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      //初始化表单
      this.reportData = {
        reportCode: reportCode,
        //报表月份
        monthDate: "",
        //编制人
        fillUser: userName,
        //类型
        reportType: "1",
        //报表日期范围
        reportDateRange: [],
        //供应量合计
        supplySum: 0,
        //循环量合计
        circulationSum: 0,
        //销售量合计
        salesVolumeSum: 0,
        //报表日期范围文字
        reportDateRangeText:
          "XXXX 年 XX 月 XX 日 08:00 至 XXXX 年 XX 月 XX 日 08:00",
        //运行天数
        runDays: "",
        //接收站名称
        receivingStationName: "",
        //接收站计量员
        gaugerA: "",
        //单位名称
        companyName: "",
        //单位计量员
        gaugerB: "",
      };
      this.visible = true;
      this.reportMonthChange(this.formatDate(new Date(), "yyyy-MM"));
    },

    //点击编辑
    editClick(val) {
      this.pageType = "edit";
      this.modelConfig.title = "冷能月报-编辑";
      this.visible = true;
      //清空文件选择器
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      //附件回显
      if (val.fileInfo) {
        let obj2 = JSON.parse(JSON.stringify(val));
        this.fileList = JSON.parse(obj2.fileInfo);
      }
      //默认统计型，不显示签字部分
      this.signVisible = val.type == "1" ? false : true;
      this.reportData = {
        id: val.id,
        //报表年YYYY
        reportYear: val.monthDate ? val.monthDate.substring(0, 4) : "",
        //报表月MM
        reportMonth: val.monthDate ? val.monthDate.substring(5, 7) : "",
        //报表年月YYYY-MM
        reportYearMonth: val.monthDate,
        //类型
        reportType: val.type,
        reportTypeName: val.reportTypeName,
        //编号
        reportCode: val.code,
        //报表日期范围
        reportDateRange: [val.startDate, val.endDate],
        //报表开始时间
        reportBeginDate: val.startDate,
        //报表结束时间
        reportEndDate: val.endDate,
        //接收站名称
        receivingStationName: val.receivingStationName,
        //编制人
        fillUser: val.fillUser,
        //供应量合计
        supplySum: val.supply,
        //循环量合计
        circulationSum: val.circulation,
        //销售量合计
        salesVolumeSum: val.salesVolume,
        //单位名称
        companyName: val.companyName,
        //接收站计量员
        gaugerA: val.gaugerA,
        //单位计量员
        gaugerB: val.gaugerB,
        //报表日期范围文字
        reportDateRangeText: this.getReportDateRangeText(
          val.startDate,
          val.endDate
        ),
        //运行天数
        runDays: val.runDays,
      };
      this.getDailyList(val.startDate, val.endDate, "edit");
    },

    //点击表格中审批按钮
    approvalClick(val) {
      this.lookClick(val);
      this.pageType = "approval";
    },

    //点击查看
    lookClick(val) {
      this.pageType = "look";
      this.modelConfig.title = "冷能月报-详情";

      let param = {
        relatedId: val.id,
        businessCode: "SIGN_FILE_JL_LNJLYB",
      };
      getBase64StrByBusiness(param).then((res) => {
        this.visible = true;
        if (res.body != null && res.code == "200") {
          this.src = "data:image/gif;base64," + res.data.body;
        } else {
          this.$message.warning("未获取到月报附件");
        }
      });
      //清空文件选择器
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      //附件回显
      if (val.fileInfo) {
        let obj2 = JSON.parse(JSON.stringify(val));
        this.fileList = JSON.parse(obj2.fileInfo);
      }

      // this.pageType = "look";
      // this.modelConfig.title = "冷能月报-详情";
      // this.visible = true;
      //清空文件选择器
      // if (this.$refs.importConpontsDataRef) {
      //   this.$refs.importConpontsDataRef.removeFile();
      // }
      //附件回显
      // if (val.fileInfo) {
      //   let obj2 = JSON.parse(JSON.stringify(val));
      //   this.fileList = JSON.parse(obj2.fileInfo);
      // }
      // //默认统计型，不显示签字部分
      // this.signVisible = val.type == "1" ? false : true;
      // this.reportData = {
      //   id: val.id,
      //   //报表年YYYY
      //   reportYear: val.monthDate ? val.monthDate.substring(0, 4) : "",
      //   //报表月MM
      //   reportMonth: val.monthDate ? val.monthDate.substring(5, 7) : "",
      //   reportTypeName: val.reportTypeName,
      //   //报表年月YYYY-MM
      //   reportYearMonth: val.monthDate,
      //   //类型
      //   reportType: val.type,

      //   //编号
      //   reportCode: val.code,
      //   //报表日期范围
      //   reportDateRange: [val.startDate, val.endDate],
      //   //报表开始时间
      //   reportBeginDate: val.startDate,
      //   //报表结束时间
      //   reportEndDate: val.endDate,
      //   //接收站名称
      //   receivingStationName: val.receivingStationName,
      //   //编制人
      //   fillUser: val.fillUser,
      //   //供应量合计
      //   supplySum: val.supply,
      //   //循环量合计
      //   circulationSum: val.circulation,
      //   //销售量合计
      //   salesVolumeSum: val.salesVolume,
      //   //单位名称
      //   companyName: val.companyName,
      //   //接收站计量员
      //   gaugerA: val.gaugerA,
      //   //单位计量员
      //   gaugerB: val.gaugerB,
      //   //报表日期范围文字
      //   reportDateRangeText: this.getReportDateRangeText(
      //     val.startDate,
      //     val.endDate
      //   ),
      //   //运行天数
      //   runDays: val.runDays,
      // };
      // this.getDailyList(val.startDate, val.endDate, "edit");
    },

    //新增编辑保存保存
    saveClick() {
      if (
        this.reportData.reportType &&
        this.reportData.reportCode &&
        this.reportData.reportBeginDate &&
        this.reportData.reportEndDate &&
        this.reportData.reportYearMonth &&
        this.reportData.fillUser
      ) {
        var formData = new FormData();
        //附件
        let filelist = [];
        if (this.fileList) {
          this.fileList.forEach((element) => {
            let row = { id: element.id, fileName: element.fileName };
            filelist.push(row);
          });
          formData.append(`fileInfo`, JSON.stringify(filelist));
        }
        formData.append("type", this.reportData.reportType);
        formData.append("code", this.reportData.reportCode);
        formData.append(
          "startDate",
          this.reportData.reportBeginDate + " 08:00:00"
        );
        formData.append("endDate", this.reportData.reportEndDate + " 08:00:00");
        formData.append("companyName", this.reportData.companyName);
        formData.append(
          "supply",
          this.reportData.supplySum ? this.reportData.supplySum : 0
        );
        formData.append(
          "circulation",
          this.reportData.circulationSum ? this.reportData.circulationSum : 0
        );
        formData.append(
          "salesVolume",
          this.reportData.salesVolumeSum ? this.reportData.salesVolumeSum : 0
        );
        formData.append("monthDate", this.reportData.reportYearMonth);
        formData.append("status", "1");
        formData.append("gaugerA", this.reportData.gaugerA);
        formData.append("gaugerB", this.reportData.gaugerB);
        formData.append("fillUser", this.reportData.fillUser);
        formData.append("runDays", this.reportData.runDays);
        formData.append(
          "receivingStationName",
          this.reportData.receivingStationName
        );
        if (this.reportData.id) {
          formData.append("id", this.reportData.id);
          this.editOperation(formData);
        } else {
          this.addOperation(formData);
        }
      } else {
        this.$message.warning("请输入正确格式的数据！");
      }
    },

    //关闭弹窗  清空文件控件
    handleCancel() {
      this.visible = false;
      this.getList();
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
    },

    //新增操作
    addOperation(formData) {
      add(formData).then((res) => {
        if (res.code == "200") {
          this.$message.success("保存成功！");
          this.handleCancel();
        } else {
          this.$message.error("保存失败！");
        }
      });
    },

    //编辑操作
    editOperation(val) {
      update(val).then((res) => {
        if (res.code == "200") {
          this.$message.success("编辑成功！");
          this.handleCancel();
        } else {
          this.$message.error("编辑失败！");
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
            if (item.id == id && item.status != "1") {
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
    fileListChange(val) {
      this.fileList = val;
    },

    // 合计
    getSum() {
      let supply = 0;
      let circulation = 0;
      let salesVolume = 0;
      this.dataSource.forEach((item, index) => {
        item.index =
          (this.pagination.current - 1) * (this.pagination.pageSize - 1) +
          index +
          1;
        //累加
        supply = this.accAdd(
          supply,
          isNaN(new Number(item.supply)) ? 0 : new Number(item.supply)
        );
        circulation = this.accAdd(
          circulation,
          isNaN(new Number(item.circulation)) ? 0 : new Number(item.circulation)
        );
        salesVolume = this.accAdd(
          salesVolume,
          isNaN(new Number(item.salesVolume)) ? 0 : new Number(item.salesVolume)
        );
        // //直接加会失真
        // supply += isNaN(new Number(item.supply)) ? 0 : new Number(item.supply);
        // circulation += isNaN(new Number(item.circulation))
        //   ? 0
        //   : new Number(item.circulation);
        // salesVolume += isNaN(new Number(item.salesVolume))
        //   ? 0
        //   : new Number(item.salesVolume);
      });
      let sumData = {
        id: "-999",
        index: "本页合计",
        supply: supply,
        circulation: circulation,
        salesVolume: salesVolume,
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

    download() {
      window.location.href =
        utils.baseURL + this.urls + "?" + "relatedId=" + this.reportData.id;
    },

    //获得当前页面
    getList() {
      getListForPage(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.dataSource.forEach((item) => {
          if (item.status == "1") {
            item.statusName = "已保存";
          } else if (item.status == "2") {
            item.statusName = "已提交";
          } else if (item.status == "3") {
            item.statusName = "审批中";
          } else if (item.status == "4") {
            item.statusName = "已审批";
          } else if (item.status == "5") {
            item.statusName = "已拒绝";
          } else if (item.status == "6") {
            item.statusName = "已完成";
          }
          item.reportTypeName =
            item.type == "1"
              ? "统计型"
              : item.type == "2"
              ? "结算型"
              : item.type;
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