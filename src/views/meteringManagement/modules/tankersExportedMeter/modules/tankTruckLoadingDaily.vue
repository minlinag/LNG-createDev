<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', isPower: false, clickName: 'addNew' },
          { value: 'Delete', isPower: false, clickName: 'mydelete' },
        ]"
        @addNew="addNew"
        @mydelete="mydelete"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div
        id="components-layout-demo-basic"
        class="appMainForm"
        style="position: relative; width: 100%"
      >
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
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
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="平均密度"
                >
                  <a-input
                    placeholder="请输入平均密度"
                    v-model="form.averageDensity"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="状态:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-select
                    v-model="form.recordStatus"
                    show-search
                    placeholder="请选择状态"
                    option-filter-prop="children"
                    :filter-option="filterOption"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option
                      :value="item.value"
                      v-for="(item, index) in stateInfo"
                      :key="index"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
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
                  <a-button class="buttonType" @click="resetForm">
                    重置
                  </a-button>
                </a-form-model-item></a-col
              >
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <a-table
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        :pagination="pagination"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            v-if="row.index != '本页合计'"
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                isPower: false,
                icon: '',
                style: ['btn_link'],
                disabled: $audit.editDisabled(row.recordStatus),
              },
              {
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                isPower: false,
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'View',
                name: '详情',
                type: 'link',
                clickName: 'look',
                icon: '',
                style: ['btn_link'],
                isPower: false,
              },
            ]"
            @edit="edit(row)"
            @look="look(row)"
            @approval="approvalClick(row)"
          ></pe-button>
        </template>
      </a-table>
      <!-- 新增按钮 -->
      <dc-Model
        :width="'950px'"
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="DcModel"
        @input="handleCancel"
      >
        <div class="wrapper" :model="surfaceForm">
          <a-layout>
            <a-layout-content>
              <div id="printContent">
                <table class="table_form" width="100%" border="2">
                  <tr>
                    <th style="height: 90px; font-size: 18px" colspan="6">
                      北京燃气集团（天津）液化天然气有限公司液化天然气销售
                      <br />
                      计量交接凭证
                    </th>
                  </tr>
                  <tr align="center" class="trHeight">
                    <td style="width: 15%">计量地点：</td>
                    <td class="input" style="width: 15%">
                      <a-input
                        :disabled="ApprovalLC"
                        style="width: 100%"
                        v-model="surfaceForm.measureSite"
                      />
                    </td>
                    <td style="width: 15%" width="100px">填报人：</td>
                    <td style="width: 15%">
                      {{ surfaceForm.fillUser }}
                      <!-- <a-input v-model="surfaceForm.fillUser" /> -->
                    </td>
                    <td style="width: 15%">编号：</td>
                    <td style="width: 15%">
                      {{ surfaceForm.serialNumber }}
                    </td>
                  </tr>
                  <tr class="trHeight">
                    <td align="center">时间</td>
                    <td colspan="5" style="text-align: center">
                      <a-range-picker
                        :disabled="ApprovalLC"
                        format="YYYY-MM-DD"
                        @change="onChange2"
                        class="td_range_picker"
                      >
                      </a-range-picker>
                      {{ tradeFormData }}
                    </td>
                  </tr>
                </table>
                <table
                  style="border-top: none"
                  class="table_form"
                  width="100%"
                  border="2"
                >
                  <tr style="font-size: 18px; height: 40px">
                    <th colspan="6">每日供气量</th>
                  </tr>
                  <tr class="trHeight">
                    <td align="center">序号</td>
                    <td align="center">车牌</td>
                    <td align="center">装车时间</td>
                    <td align="center">供气量(t)</td>
                    <td align="center">供气量(Nm3)</td>
                    <td align="center">密度(Kg/Nm3)</td>
                  </tr>
                  <tr
                    v-for="(item, index) in supplyGas"
                    :key="index"
                    class="trHeight"
                  >
                    <td align="center">{{ index + 1 }}</td>
                    <td align="center">{{ item.number_tractor }}</td>
                    <td align="center">{{ item.loading_start_time }}</td>
                    <td align="center">{{ item.loadingCount }}</td>
                    <td align="center">{{ item.volume }}</td>
                    <td align="center">{{ item.density }}</td>
                  </tr>
                </table>
                <table
                  style="border-top: none"
                  class="table_form"
                  width="100%"
                  border="2"
                >
                  <tr align="center" class="trHeight">
                    <td>日供气量合计（t）小写</td>
                    <td colspan="2" style="width: 173px">
                      {{ surfaceForm.totalDailyGasSupplyT }}
                    </td>
                    <td>日供气量合计（t）大写</td>
                    <td colspan="2" style="width: 211px">
                      {{ surfaceForm.totalDailyGasSupplyTCap }}
                    </td>
                  </tr>
                  <tr align="center" class="trHeight">
                    <td>日供气量合计（万Nm3）小写</td>
                    <td colspan="2">
                      {{ surfaceForm.totalDailyGasSupplyNm }}
                    </td>
                    <td>日供气量合计（Nm3）大写</td>
                    <td colspan="2">
                      {{ surfaceForm.totalDailyGasSupplyNmCap }}
                    </td>
                  </tr>
                  <tr align="center" class="trHeight">
                    <td>平均密度(Kg/Nm3)</td>
                    <td colspan="5">
                      {{ surfaceForm.averageDensity }}
                    </td>
                  </tr>
                  <tr class="tr_remark">
                    <td align="center">备注</td>
                    <td class="input" colspan="5" align="left">
                      <a-textarea
                        :disabled="ApprovalLC"
                        allow-clear
                        v-model="surfaceForm.remark"
                      />
                    </td>
                  </tr>
                </table>

                <table width="100%" border="2" class="table_footer">
                  <tr>
                    <td align="center" style="width: 50%" colspan="1">
                      液化天然气有限公司<br />计量员<br />计量专用章（盖章）
                    </td>
                    <td align="center" colspan="1">
                      液化天然气销售公司<br />计量员<br />计量专用章（盖章）
                    </td>
                  </tr>
                </table>
              </div>
              <table
                width="100%"
                border="0"
                class="table_footer"
                style="margin-top: 10px"
              >
                <tr>
                  <td>
                    <a-form-model-item
                      style="float: left"
                      :labelCol="{ style: 'width: 60px' }"
                      label="附件："
                    >
                      <file-upload
                        :Text="'上传文件'"
                        @fileChange="fileListChange"
                        :echoList="flieChanges"
                        ref="importConpontsDataRef"
                        :disabled="pageType == 'look' || pageType == 'approval'"
                      ></file-upload>
                    </a-form-model-item>
                  </td>
                </tr>
              </table>

              <!--审批页签部分-->
              <div v-if="pageType == 'look' || pageType == 'approval'">
                <stepsModel
                  ref="stepsModel"
                  :isShow="pageType === 'approval' ? true : false"
                  :id="IDs"
                />
              </div>
            </a-layout-content>
            <a-layout-footer>
              <a-button
                v-Add
                v-if="AddBC"
                class="buttonType"
                type="primary"
                @click.stop="save"
              >
                保存
              </a-button>
              <a-button
                v-Add
                v-if="SubmitTJ"
                class="buttonType"
                type="primary"
                @click.stop="save('sunmit')"
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
                v-if="PrintDY"
                v-Add
                class="buttonType"
                type="primary"
                v-print="printConfig"
                key="1"
              >
                打印
              </a-button>
              <a-button @click="handleCancel"> 取消 </a-button>
            </a-layout-footer>
          </a-layout>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  findList,
  add,
  editById,
  deleteByIds,
  findById,
  queryDailyGasAmount,
  loadingDailySubmit,
  loadingDailyAudio,
} from "@/api/tankTruckLoadingDaily";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  components: {
    stepsModel,
    fileUpload: fileUpload,
  },
  data() {
    return {
      printConfig: {
        id: "printContent",
        popTitle: "槽车装车日报",
      },
      pageType: "",
      IDs: "",
      AddBC: false,
      SubmitTJ: false,
      PrintDY: false,
      rules: {
        name: [
          {
            required: true,
            message: "请输入辅助检查",
            trigger: "blur",
          },
        ],
      },
      operation: false,
      supplyGas: [],
      formState: { name: "" },
      labelCol: { style: { width: "100px" } },
      labelCol2: { style: { width: "145px" } },
      labelCol3: { style: { width: "250px" } },
      labelCol4: { style: { width: "430px" } },
      ApprovalLC: false, //审批展示
      activeKey2: "1",
      stateInfo: [
        {
          value: "1",
          label: "已保存",
        },
        {
          value: "2",
          label: "已提交",
        },
        {
          value: "3",
          label: "审核中",
        },
        {
          value: "4",
          label: "已审批",
        },
        {
          value: "5",
          label: "已拒绝",
        },
      ],
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
      //新增是否visible
      visibleAddNew: false,
      //查看是否visible
      addNewModelConfig: {
        width: "950px",
        title: "外委单位",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
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
          title: "编号",
          ellipsis: true,
          dataIndex: "serialNumber",
          width: 180,
          align: "center",
        },
        {
          title: "日期",
          ellipsis: true,
          dataIndex: "theDay",
          width: 150,
          align: "center",
        },
        {
          title: "装车数量",
          ellipsis: true,
          dataIndex: "loadingNumber",
          width: 100,
          align: "center",
        },
        {
          title: "日供气量合计（t）",
          ellipsis: true,
          dataIndex: "totalDailyGasSupplyT",
          width: 150,
          align: "center",
        },
        {
          title: "日供气量合计（万Nm³）",
          ellipsis: true,
          dataIndex: "totalDailyGasSupplyNm",
          width: 200,
          align: "center",
        },
        {
          title: "平均密度（Kg/Nm³）",
          ellipsis: true,
          dataIndex: "averageDensity",
          width: 150,
          align: "center",
        },
        {
          title: "填报人",
          ellipsis: true,
          dataIndex: "fillUser",
          width: 100,
          align: "center",
        },
        {
          title: "状态",
          ellipsis: true,
          dataIndex: "recordStatusName",
          width: 100,
          align: "center",
          fixed: "right",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 120,
          fixed: "right",
          align: "center",
        },
      ],
      //表格中的数据
      dataSource: [],
      surfaceForm: {},
      tradeFormData: "年 月 日 08:00 至 年 月 日 08:00",
      pipelineExportMonthlyReport: [],
      flieChanges: [],
      picture: "",
      // 审批进度
      stepConfiguration: {
        stepProgress: 4,
        stepList: [
          {
            title: "提出申请",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "部门评审",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "生产运营部评审",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
            children: [
              {
                title: "检维修中心评审",
                name: "曲丽丽",
                dataTime: "2021-05-22 12:00",
              },
            ],
          },
          {
            title: "生产技术部评审",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
            children: [
              {
                title: "质量安全部评审",
                name: "曲丽丽",
                dataTime: "2021-05-22 12:00",
              },
            ],
          },
          {
            title: "主管副总评审",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "完成",
          },
        ],
      },
      //审批表数据
      dataSourceApproval: [
        // {
        //   step: "",
        //   person: "",
        //   institution: "",
        //   operate: "",
        //   result: "",
        //   advice: "",
        //   time: "",
        // },
      ],
    };
  },
  computed: {},
  mounted() {
    this.getList();
  },
  methods: {
    //审批
    approvalCommit() {
      let params = {
        id: this.surfaceForm.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      };
      loadingDailyAudio(params).then((res) => {
        if (res.body == "true") {
          this.$message.success("审批成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("审批失败");
        }
      });
    },
    // 提交
    Submit(id) {
      let ID = id ? id : this.surfaceForm.id;
      loadingDailySubmit(ID).then((res) => {
        if (res.code == "200") {
          this.$message.success("提交成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("提交失败");
        }
      });
    },
    handleCancel() {
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      this.visibleAddNew = false;
      this.$nextTick(() => {
        this.IDs = "";
      });
    },
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    //字符串转base64
    getEncode64(str) {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
          }
        )
      );
    },
    // 数字转大写
    smallToBig(money) {
      // 汉字的数字
      const cnNums = [
        "零",
        "壹",
        "贰",
        "叁",
        "肆",
        "伍",
        "陆",
        "柒",
        "捌",
        "玖",
      ];
      // 基本单位
      const cnIntRadice = ["", "拾", "佰", "仟"];
      // 对应整数部分扩展单位
      const cnIntUnits = ["", "万", "亿", "兆"];
      // 对应小数部分单位
      const cnDecUnits = ["角", "分", "厘", "毫"];
      // 整数金额时后面跟的字符
      const cnInteger = "整";
      // 整型完以后的单位
      const cnIntLast = "元";
      // 最大处理的数字
      const maxNum = 9999999999999999.99;
      // 金额整数部分
      let integerNum;
      // 金额小数部分
      let decimalNum;
      // 输出的中文金额字符串
      let chineseStr = "";
      // 分离金额后用的数组，预定义
      let parts;
      if (money === "") {
        return "";
      }
      money = parseFloat(money);
      if (money >= maxNum) {
        // 超出最大处理数字
        return "";
      }
      if (money === 0) {
        chineseStr = cnNums[0];
        return chineseStr;
      }
      // 转换为字符串
      money = money.toString();
      if (money.indexOf(".") === -1) {
        integerNum = money;

        decimalNum = "";
      } else {
        parts = money.split(".");
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
      }
      // 获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        let zeroCount = 0;
        const IntLen = integerNum.length;
        for (let i = 0; i < IntLen; i++) {
          const n = integerNum.substr(i, 1);
          const p = IntLen - i - 1;
          const q = p / 4;
          const m = p % 4;
          if (n === "0") {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            // 归零
            zeroCount = 0;
            //alert(cnNums[parseInt(n)])
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m === 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      // 小数部分
      if (decimalNum !== "") {
        const decLen = decimalNum.length;
        for (let i = 0; i < decLen; i++) {
          const n = decimalNum.substr(i, 1);
          if (n !== "0") {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr === "") {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum === "") {
        chineseStr += cnInteger;
      }
      return chineseStr;
    },
    // 保存
    save(value) {
      this.pageType = "save";
      let flielist = [];
      this.flieChanges.forEach((element) => {
        let row = { id: element.id, fileName: element.fileName };
        flielist.push(row);
      });
      this.surfaceForm.fileInfo = JSON.stringify(flielist);

      if (this.addNewModelConfig.title == "槽车装车日报-编辑") {
        editById(this.surfaceForm).then((res) => {
          if (res.code == 200) {
            if (value == "sunmit") {
              this.Submit();
            } else {
              this.handleCancel();
              this.$message.success("修改成功！");
              this.getList();
            }
          } else {
            if (value == "sunmit") {
              this.$message.error("提交失败！");
            } else {
              this.$message.warning("修改失败");
            }
          }
        });
      } else {
        add(this.surfaceForm).then((res) => {
          if (res.code == 200) {
            if (value == "sunmit") {
              this.Submit(res.body);
            } else {
              this.handleCancel();
              this.$message.success("新增成功！");
              this.getList();
            }
          } else {
            if (value == "sunmit") {
              this.$message.error("提交失败！");
            } else {
              this.$message.warning("新增失败");
            }
          }
        });
      }
    },
    fileListChange(val) {
      this.flieChanges = val;
    },
    handleOk() {},
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //新增弹窗相关按钮
    addNew() {
      this.pageType = "add";
      var d = new Date();
      var ye = d.getFullYear();
      var mo = (d.getMonth() + 1).toString().padStart(2, "0");
      var da = d.getDate().toString().padStart(2, "0");
      var time1 = ye + "-" + mo + "-" + da;
      this.supplyGas = [];
      this.surfaceForm = {};
      this.flieChanges = [];
      this.ApprovalLC = false;
      this.AddBC = true;
      this.PrintDY = false;
      this.SubmitTJ = true;
      this.addNewModelConfig.title = "槽车装车日报-新增";
      this.visibleAddNew = true;
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.gettime = yy + "-" + mm + "-" + dd;
      mm = mm < 10 ? "0" + mm : mm;
      this.surfaceForm.serialNumber = "CCZCRB" + yy + mm + da + hh + mf + ss; //编号

      // 获取前一天的日期
      var time = new Date().getTime() - 24 * 60 * 60 * 1000;
      var yesterday = new Date(time);
      var month = yesterday.getMonth() + 1;
      var day = yesterday.getDate();
      yesterday = `${yesterday.getFullYear()}-${
        month < 10 ? "0" + month : month
      }-${day < 10 ? "0" + day : day}`;

      // console.log("yesterday", yesterday);

      this.onChange2("1", [yesterday, time1]);
      this.surfaceForm.fillUser = this.$store.state.user.name;
    },
    // 删除
    mydelete() {
      deleteByIds(this.selectedRowKeys).then((res) => {
        this.$message.success("删除成功");
        this.getList();
      });
      this.selectedRowKeys = [];
    },
    //点击表格中审批按钮
    approvalClick(val) {
      this.look(val);
      this.ApprovalLC = true;
      this.pageType = "approval";
    },
    //查看弹窗相关按钮
    // 查看
    look(row) {
      this.pageType = "look";
      this.AddBC = false;
      this.SubmitTJ = false;
      this.PrintDY = true;
      let obj2 = JSON.parse(JSON.stringify(row));
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }
      this.surfaceForm = obj2;
      this.$nextTick(() => {
        this.IDs = obj2.id;
      });
      let date = [this.surfaceForm.startTime, this.surfaceForm.endTime];
      this.onChange2("1", date);
      this.ApprovalLC = true;
      this.addNewModelConfig.title = "槽车装车日报-详情";
      this.visibleAddNew = true;

      // this.addNewConfig.formDataList.forEach((element) => {
      //   element.disabled = true;
      // });
      // this.$router.push({
      //   path: "/tankDailyDetails",
      //   query: value,
      // });
    },
    edit(row) {
      this.pageType = "edit";
      let id = {
        id: row.id,
      };
      findById(id).then((res) => {});
      this.surfaceForm = {};
      this.tradeFormData = [];
      this.AddBC = true;
      this.SubmitTJ = true;
      this.PrintDY = true;
      this.addNewModelConfig.title = "槽车装车日报-编辑";
      let obj2 = JSON.parse(JSON.stringify(row));
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }

      this.surfaceForm = obj2;
      let date = [this.surfaceForm.startTime, this.surfaceForm.endTime];
      this.onChange2("1", date);
      this.ApprovalLC = false;
      this.visibleAddNew = true;
    },
    chineseChar2englishChar(chineseChar) {
      // 将单引号‘’都转换成'，将双引号“”都转换成"
      var str = chineseChar.replace(/\’|\‘/g, "'").replace(/\“|\”/g, '"');
      // 将中括号【】转换成[]，将大括号｛｝转换成{}
      str = str
        .replace(/\【/g, "[")
        .replace(/\】/g, "]")
        .replace(/\｛/g, "{")
        .replace(/\｝/g, "}");
      // 将逗号，转换成,，将：转换成:
      str = str.replace(/，/g, ",").replace(/：/g, ":");
      return str;
    },
    //日期的onchange
    onChange(date, dateString) {
      if (date.length != 0) {
        this.form.dateBegin = date[0];
        this.form.dateEnd = date[1];
      } else {
        this.form.dateBegin = "";
        this.form.dateEnd = "";
      }
    },
    onChange2(date, dateString) {
      this.surfaceForm.startTime = dateString[0];
      this.surfaceForm.endTime = dateString[1];
      let A = {
        startTime: dateString[0],
        endTime: dateString[1],
      };

      queryDailyGasAmount(A).then((res) => {
        this.supplyGas = res.body;

        let TotalDailySupplyT = 0;
        let TotalDailySupplyNm3 = 0;
        let AverageDensity = 0;
        this.surfaceForm.loadingNumber = this.supplyGas.length;
        for (let i = 0; i < this.supplyGas.length; i++) {
          if (this.supplyGas[i].loading_start_time) {
            this.supplyGas[i].loading_start_time = this.supplyGas[
              i
            ].loading_start_time.substring(0, 16);
          }
          if (this.supplyGas[i].loadingCount == null) {
            this.supplyGas[i].loadingCount = 0;
          }
          TotalDailySupplyT += parseInt(this.supplyGas[i].loadingCount);
          if (this.supplyGas[i].volume == null) {
            this.supplyGas[i].volume = 0;
          }
          TotalDailySupplyNm3 += parseInt(this.supplyGas[i].volume);
          if (this.supplyGas[i].density == null) {
            this.supplyGas[i].density = 0;
          }
          AverageDensity += parseInt(this.supplyGas[i].density);
        }
        this.surfaceForm.totalDailyGasSupplyT = TotalDailySupplyT;
        this.surfaceForm.totalDailyGasSupplyTCap =
          this.smallToBig(TotalDailySupplyT);
        this.surfaceForm.totalDailyGasSupplyNm = TotalDailySupplyNm3 / 10000;
        this.surfaceForm.totalDailyGasSupplyNmCap =
          this.smallToBig(TotalDailySupplyNm3);
        this.surfaceForm.averageDensity =
          this.supplyGas.length > 0
            ? parseInt(AverageDensity) / this.supplyGas.length
            : 0;
      });
      let dayString = "";
      for (let index = 0; index < dateString.length; index++) {
        const element = dateString[index];
        if (index < dateString.length - 1) {
          dayString +=
            this.timePatternConvert(element) +
            "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0至\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
        } else {
          dayString += this.timePatternConvert(element);
        }
      }

      this.tradeFormData = dayString;
    },
    generateDayList(dateString) {
      let dateSplit = {
        startTime: dateString[0].split("-"),
        endTime: dateString[1].split("-"),
      };
      let dateGather = [];
      let monthCount = dateSplit.endTime[1] - dateSplit.startTime[1];
      if (monthCount >= 0) {
        dateGather.push([dateSplit.startTime[0], dateSplit.startTime[1]]);

        for (let index = 0; index < monthCount; index++) {
          dateGather.push([
            dateSplit.startTime[0],
            parseInt(dateSplit.startTime[1]) + index + 1,
          ]);
        }
      } else {
        let monthBurdenCount = monthCount + 12;
        dateGather.push([dateSplit.startTime[0], dateSplit.startTime[1]]);
        let startMonthCount = parseInt(dateSplit.startTime[1]);
        for (let index = 0; index < monthBurdenCount; index++) {
          if (startMonthCount < 12) {
            dateGather.push([
              dateSplit.startTime[0],
              parseInt(dateSplit.startTime[1]) + 1,
            ]);
          } else {
            dateGather.push([dateSplit.endTime[0], startMonthCount - 12 + 1]);
          }
          startMonthCount += 1;
        }
      }
      let dayCollection = [];
      for (let index = 0; index < dateGather.length; index++) {
        const element = dateGather[index];
        dayCollection.push(
          this.getMonthDay(parseInt(element[0]), parseInt(element[1]) - 1)
        );
      }
      let dailyData = [];
      for (let index = 0; index < dayCollection.length; index++) {
        const element = dayCollection[index];
        if (index === 0) {
          if (
            dateSplit.startTime[1] == dateSplit.endTime[1] &&
            dateSplit.startTime[0] == dateSplit.endTime[0]
          ) {
            let endTimeElement = parseInt(dateSplit.endTime[2]) + 1;
            for (let i = dateSplit.startTime[2]; i < endTimeElement; i++) {
              let data = {
                monht: i + "日",
                PlannedExportVolumeNM3: "",
                PlannedExportVolumeT: "",
                ActualExportVolumeNM3: "",
                ActualExportVolumeT: "",
                AnnualExportVolumeNM3: "",
                AnnualExportVolumeT: "",
              };
              dailyData.push(data);
            }
          } else {
            for (let i = dateSplit.startTime[2]; i < element; i++) {
              let data = {
                monht: i + "日",
                PlannedExportVolumeNM3: "",
                PlannedExportVolumeT: "",
                ActualExportVolumeNM3: "",
                ActualExportVolumeT: "",
                AnnualExportVolumeNM3: "",
                AnnualExportVolumeT: "",
              };
              dailyData.push(data);
            }
          }
        } else if (index === dayCollection.length - 1) {
          let endData = parseInt(dateSplit.endTime[2]) + 1;
          for (let i = 1; i < endData; i++) {
            let data = {
              monht: i + "日",
            };
            dailyData.push(data);
          }
        } else {
          for (let i = 1; i < element; i++) {
            let data = {
              monht: i + "日",
            };
            dailyData.push(data);
          }
        }
      }
      return dailyData;
    },
    getMonthDay(year, month) {
      let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        days[1] = 29;
      }
      return days[month];
    },
    timePatternConvert(time) {
      let newTime;
      var str = time;
      // eslint-disable-next-line no-useless-escape
      var reg = /(\d{4})\-(\d{2})\-(\d{2})/;
      newTime = str.replace(reg, "$1年$2月$3日8:00");
      return newTime;
    },
    //获取表格列表
    getList() {
      findList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
        // 记录状态已保存-1、已提交-2、审批中-3、已审批-4、已拒绝-5
        this.dataSource.forEach((element) => {
          if (element.theDay) {
            element.theDay = element.theDay.substring(0, 10);
          }
          if (element.recordStatus == 1) {
            element.recordStatusName = "已保存";
          } else if (element.recordStatus == 2) {
            element.recordStatusName = "已提交";
          } else if (element.recordStatus == 3) {
            element.recordStatusName = "审批中";
          } else if (element.recordStatus == 4) {
            element.recordStatusName = "已审批";
          } else if (element.recordStatus == 5) {
            element.recordStatusName = "已拒绝";
          } else if (element.recordStatus == 6) {
            element.recordStatusName = "已完成";
          }
        });
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
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          // disabled: record.recordStatus !== '1'
          disabled: record.recordStatus !== "1" && record.recordStatus !== "7",
        },
      };
    },
  },
};
</script>
<style scoped lang="less">
.trHeight {
  height: 33px;
}
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
.table_form {
  border-bottom-width: 0px;
  tr {
    th {
      text-align: center;
    }
  }
  .tr_remark {
    border-bottom-width: 0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
  }
}
.table_footer {
  border-top: none;
}
td {
  position: relative;
}
.td_range_picker {
  position: absolute;
  left: 0;
  top: 0;
  ::v-deep .ant-calendar-picker-input.ant-input {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
}
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}
</style>
