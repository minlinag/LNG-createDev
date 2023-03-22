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
                  :labelCol="{ style: 'width: 150px' }"
                  label="月报类型"
                >
                  <a-input
                    v-model="form.reportType"
                    placeholder="请输入月报类型"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="填报人"
                >
                  <a-input
                    v-model="form.createdUser"
                    placeholder="请输入填报人"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="状态:">
                  <a-select
                    :getPopupContainer="getPopupContainer"
                    v-model="form.status"
                    placeholder="请选择状态"
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
                <a-form-model-item
                  label="填报时间:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-range-picker
                    v-model="Time"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="装车月份:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <!-- <a-range-picker v-model:value="value4" picker="month" /> -->
                  <a-range-picker
                    @panelChange="monthRangeChange"
                    :placeholder="['开始月份', '结束月份']"
                    format="YYYY-MM"
                    v-model="Month"
                    :mode="['month', 'month']"
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

      <a-table
        bordered
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        :pagination="pagination"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_2 unloadTable"
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
                isPower: false,
                style: ['btn_link'],
                disabled: $audit.editDisabled(row.status),
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
        width="80vw"
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
                  <tr style="height: 70px; font-size: 18px">
                    <th colspan="8">
                      北京燃气集团(天津)液化天然气有限公司
                      <br />
                      自耗气量统计表
                    </th>
                  </tr>
                  <tr class="input">
                    <td align="center" style="width: 17%">报表类型：</td>
                    <td>
                      <a-select
                        :disabled="ApprovalLC"
                        style="width: 100%"
                        v-model="surfaceForm.reportType"
                        @change="Exhibition"
                      >
                        <a-select-option
                          :value="item.value"
                          v-for="(item, index) in reportType"
                          :key="index"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </td>
                    <td colspan="6" style="text-align: center">
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
                  <tr align="center">
                    <td>编号：</td>
                    <td colspan="7">{{ surfaceForm.numbers }}</td>
                  </tr>
                  <tr>
                    <td align="center" rowspan="2">日期</td>
                    <td align="center" colspan="2">scv耗气</td>
                    <td align="center" colspan="2">常明灯耗气</td>
                    <td align="center" colspan="2">其他耗气</td>
                    <td align="center" rowspan="2">备注</td>
                  </tr>
                  <tr align="center">
                    <td>体积(Nm3)</td>
                    <td>质量(t)</td>
                    <td>体积(Nm3)</td>
                    <td>质量(t)</td>
                    <td>体积(Nm3)</td>
                    <td>质量(t)</td>
                  </tr>
                  <tr
                    v-for="(item, index) in pipelineExportMonthlyReport"
                    :key="index"
                  >
                    <td align="center">
                      {{ item.monht }}
                    </td>
                    <td align="center">
                      {{ item.SCVVolume }}
                    </td>
                    <td align="center">
                      {{ item.SCVQuality }}
                    </td>
                    <td align="center">
                      {{ item.lightVolume }}
                    </td>
                    <td align="center">
                      {{ item.lightQuality }}
                    </td>
                    <td align="center">
                      {{ item.otherVolume }}
                    </td>
                    <td align="center">
                      {{ item.otherQuality }}
                    </td>
                    <td align="center">
                      <!-- <a-textarea allow-clear /> -->
                    </td>
                  </tr>
                  <tr align="center">
                    <td>累计</td>
                    <td>{{ surfaceForm.scvVolume }}</td>
                    <td>{{ surfaceForm.scvQuality }}</td>
                    <td>{{ surfaceForm.lightVolume }}</td>
                    <td>{{ surfaceForm.lightQuality }}</td>
                    <td>{{ surfaceForm.otherGasVolume }}</td>
                    <td>{{ surfaceForm.otherGasQuality }}</td>
                    <td></td>
                  </tr>
                  <tr align="center">
                    <td colspan="2">本月合计体积(Nm3)</td>
                    <td colspan="6">
                      {{ surfaceForm.currentMonthTotalVolume }}
                    </td>
                  </tr>
                  <tr align="center">
                    <td colspan="2">本月合计质量(t)</td>
                    <td colspan="6">
                      {{ surfaceForm.currentMonthTotalQuality }}
                    </td>
                  </tr>
                </table>

                <table v-if="sign" width="100%" border="2" class="table_footer">
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
                      v-if="pageType != 'approval'"
                      style="float: left"
                      :labelCol="{ style: 'width: 60px' }"
                      label="附件："
                    >
                      <file-upload
                        :Text="'上传文件'"
                        @fileChange="flieChange"
                        :echoList="flieChanges"
                        :disabled="pageType == 'look'"
                        ref="importConpontsDataRef"
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
            <a-layout-footer class="ant-modal-footer">
              <a-button
                v-Add
                class="buttonType"
                type="primary"
                @click.stop="save"
                v-if="operation"
              >
                保存
              </a-button>
              <a-button
                v-Add
                class="buttonType"
                type="primary"
                @click.stop="save('sunmit')"
                v-if="operation2"
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
  findAllList,
  insert,
  update,
  deleteSC,
  selfCosGasMonthRepSubmit,
  querySelfConsumeDailyData,
  selfCosGasMonthRepAudio,
} from "@/api/selfConsumptionMonth";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  components: {
    stepsModel,
    fileUpload: fileUpload,
  },
  data() {
    return {
      IDs: "",
      pageType: "",
      printConfig: {
        id: "printContent",
        popTitle: "自耗气量统计表",
      },
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
      operation: true,
      operation2: true,
      sign: true,
      formState: {},
      labelCol: { style: { width: "220px" } },
      labelCol2: { style: { width: "290px" } },
      labelCol3: { style: { width: "100px" } },
      ApprovalLC: false, //审批展示
      activeKey2: "1",
      columnsApproval: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
        },
        {
          title: "审批人",
          dataIndex: "person",
          width: 180,
          align: "center",ellipsis: true,
        },
        {
          title: "单位名称",
          dataIndex: "institution",
          width: 150,
          align: "center",ellipsis: true,
        },
        {
          title: "审批日期",
          dataIndex: "result",
          width: 150,
          align: "center",ellipsis: true,
        },
        {
          title: "审批意见",
          dataIndex: "advice",
          width: 150,
          align: "center",ellipsis: true,
        },
        {
          title: "审批状态",
          dataIndex: "time",
          width: 150,ellipsis: true,
          align: "center",
        },
      ],
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
      mode2: [],
      value: [],
      //翻页页面组件
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["11", "21", "31", "41", "51", "61"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 11, // 每页条数，所有页设置统一的条数
      },
      reportType: [
        { value: "结算型", label: "结算型" },
        { value: "统计型", label: "统计型" },
      ],
      //勾选框/选择框组件
      selectedRowKeys: [],
      //回传组件
      echoMap: {},
      //查看组件中的数值
      LookForm: {},
      //新增是否visible
      visibleAddNew: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: "950px",
        title: "",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageSize: 10,
        pageIndex: 1,
      },
      Time: [],
      Month: [],
      //页面下方表格的列属性
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
          width: 100,
          align: "center",
        },
        {
          title: "编号",
          dataIndex: "numbers",
          width: 180,
          align: "center",
        },

        {
          title: "月份",
          dataIndex: "months",
          width: 100,
          align: "center",
        },
        {
          title: "报表类型",
          dataIndex: "reportType",
          width: 150,
          align: "center",
        },
        {
          title: "SCV",
          dataIndex: "num",
          width: 150,
          align: "center",
          children: [
            {
              title: "体积(Nm3)",
              dataIndex: "scvVolume",
              width: 150,
              align: "center",
            },
            {
              title: "质量(t)",
              dataIndex: "scvQuality",
              width: 150,
              align: "center",
            },
          ],
        },
        {
          title: "常明灯",
          dataIndex: "num3",
          width: 150,
          align: "center",
          children: [
            {
              title: "体积(Nm3)",
              dataIndex: "lightVolume",
              width: 150,
              align: "center",
            },
            {
              title: "质量(t)",
              dataIndex: "lightQuality",
              width: 150,
              align: "center",
            },
          ],
        },
        {
          title: "其他耗气",
          dataIndex: "num6",
          width: 150,
          align: "center",
          children: [
            {
              title: "体积(Nm3)",
              dataIndex: "otherGasVolume",
              width: 150,
              align: "center",
            },
            {
              title: "质量(t)",
              dataIndex: "otherGasQuality",
              width: 150,
              align: "center",
            },
          ],
        },
        {
          title: "本月合计",
          dataIndex: "num9",
          width: 150,
          align: "center",
          children: [
            {
              title: "体积(Nm3)",
              dataIndex: "currentMonthTotalVolume",
              width: 150,
              align: "center",
            },
            {
              title: "质量(t)",
              dataIndex: "currentMonthTotalQuality",
              width: 150,
              align: "center",
            },
          ],
        },
        {
          title: "填报日期",
          dataIndex: "createdDateTime",
          width: 200,
          align: "center",
        },
        {
          title: "审批状态",
          dataIndex: "statusName",
          width: 150,
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
      dataSourceApproval: [],
      surfaceForm: {},
      tradeFormData: "",
      pipelineExportMonthlyReport: [],
      flieChanges: {},
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    //审批
    approvalCommit() {
      let params = {
        id: this.surfaceForm.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      };
      selfCosGasMonthRepAudio(params).then((res) => {
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
    CSubmit(id) {
      let ID = id ? id : this.surfaceForm.id;
      selfCosGasMonthRepSubmit(ID).then((res) => {
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
      this.visibleAddNew = false;
      this.$nextTick(() => {
        this.IDs = "";
      });
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
    },
    Exhibition(row) {
      var date = new Date();
      let yy = date.getFullYear();
      let mm = date.getMonth() + 1;
      if (row == "结算型") {
        let yesterday = `${yy}-${
          date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
        }-26 `;
        let time1 = `${yy}-${mm < 10 ? `0${mm}` : mm}-25 `;

        this.onChange2("1", [yesterday, time1]);

        this.sign = true;
      } else {
        var d = new Date(yy, mm, 0);
        let yesterday = `${yy}-${mm < 10 ? `0${mm}` : mm}-01 `;
        let time1 = `${yy}-${mm < 10 ? `0${mm}` : mm}-${d.getDate()} `;
        this.onChange2("1", [yesterday, time1]);
        this.sign = false;
      }

      // tradeFormData
    },
    // 上传
    flieChange(val) {
      this.flieChanges = val;
    },
    onSelect(value) {},
    //点击表格中审批按钮
    approvalClick(val) {
      this.look(val);
      this.ApprovalLC = true;
      this.pageType = "approval";
    },
    // 详情
    look(value) {
      this.pageType = "look";
      let obj2 = JSON.parse(JSON.stringify(value));
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }
      this.surfaceForm = obj2;
      this.$nextTick(() => {
        this.IDs = obj2.id;
      });
      if (this.surfaceForm.startTime) {
        this.surfaceForm.startTime = this.surfaceForm.startTime.substring(
          0,
          10
        );
      }
      if (this.surfaceForm.endTime) {
        this.surfaceForm.endTime = this.surfaceForm.endTime.substring(0, 10);
      }
      this.ApprovalLC = true;
      this.addNewModelConfig.title = "自耗气月报-详情";
      this.visibleAddNew = true;
      this.operation = false;
      this.operation2 = false;
      this.onChange2("1", [
        this.surfaceForm.startTime,
        this.surfaceForm.endTime,
      ]);
      if (this.surfaceForm.reportType == "结算型") {
        this.sign = true;
      } else {
        this.sign = false;
      }
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
    handleChange(value) {
      this.value = value;
    },
    handlePanelChange2(value, mode) {
      this.value = value;
      this.mode2 = [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1],
      ];
    },
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
    onChange2(date, dateString) {
      let dayString = "";
      let Consumable = [];
      let list = [];
      this.surfaceForm.startTime = dateString[0];
      this.surfaceForm.endTime = dateString[1];

      let totalSCVVolume = 0;
      let totalSCVQuality = 0;
      let totallightVolume = 0;
      let totallightQuality = 0;
      let totalotherVolume = 0;
      let totalotherQuality = 0;

      querySelfConsumeDailyData({
        startTime: dateString[0],
        endTime: dateString[1],
      }).then((res) => {
        Consumable = res.body;
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < Consumable.length; j++) {
            if (list[i].judgeMonht == Consumable[j].createdDate) {
              list[i].SCVVolume = Consumable[j].SCVVolume;
              list[i].SCVQuality = Consumable[j].SCVQuality;
              list[i].lightVolume = Consumable[j].lightVolume;
              list[i].lightQuality = Consumable[j].lightQuality;
              list[i].otherVolume = Consumable[j].otherVolume;
              list[i].otherQuality = Consumable[j].otherQuality;
            }
          }
        }
        for (let i = 0; i < list.length; i++) {
          if (list[i].SCVVolume) {
          } else {
            list[i].SCVVolume = 0;
          }
          if (list[i].SCVQuality) {
          } else {
            list[i].SCVQuality = 0;
          }
          if (list[i].lightVolume) {
          } else {
            list[i].lightVolume = 0;
          }
          if (list[i].lightQuality) {
          } else {
            list[i].lightQuality = 0;
          }
          if (list[i].otherVolume) {
          } else {
            list[i].otherVolume = 0;
          }
          if (list[i].otherQuality) {
          } else {
            list[i].otherQuality = 0;
          }
          totalSCVVolume += parseInt(list[i].SCVVolume);
          totalSCVQuality += parseInt(list[i].SCVQuality);
          totallightVolume += parseInt(list[i].lightVolume);
          totallightQuality += parseInt(list[i].lightQuality);
          totalotherVolume += parseInt(list[i].otherVolume);
          totalotherQuality += parseInt(list[i].otherQuality);
        }
        this.surfaceForm.currentMonthTotalVolume =
          parseInt(totalotherVolume) +
          parseInt(totallightVolume) +
          parseInt(totalSCVVolume);
        this.surfaceForm.currentMonthTotalQuality =
          parseInt(totalSCVQuality) +
          parseInt(totallightQuality) +
          parseInt(totalotherQuality);
        this.surfaceForm.scvVolume = totalSCVVolume;
        this.surfaceForm.scvQuality = totalSCVQuality;
        this.surfaceForm.lightVolume = totallightVolume;
        this.surfaceForm.lightQuality = totallightQuality;
        this.surfaceForm.otherGasVolume = totalotherVolume;
        this.surfaceForm.otherGasQuality = totalotherQuality;
        this.pipelineExportMonthlyReport = list;
      });

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
      list = this.generateDayList(dateString);
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
        const element = dayCollection[index] + 1;
        if (index === 0) {
          if (
            dateSplit.startTime[1] == dateSplit.endTime[1] &&
            dateSplit.startTime[0] == dateSplit.endTime[0]
          ) {
            let endTimeElement = parseInt(dateSplit.endTime[2]) + 1;
            for (let i = dateSplit.startTime[2]; i < endTimeElement; i++) {
              if (i.toString().length == 1) {
                i = "0" + i;
              }
              let data = {
                monht:
                  dateSplit.startTime[0] +
                  "年" +
                  dateSplit.startTime[1] +
                  "月" +
                  i +
                  "日",
                judgeMonht:
                  dateSplit.startTime[0] +
                  "-" +
                  dateSplit.startTime[1] +
                  "-" +
                  i,
                SCVVolume: "",
                SCVQuality: "",
                lightVolume: "",
                lightQuality: "",
                otherVolume: "",
                otherQuality: "",
              };
              dailyData.push(data);
            }
          } else {
            for (let i = dateSplit.startTime[2]; i < element; i++) {
              if (i.toString().length == 1) {
                i = "0" + i;
              }
              let data = {
                monht:
                  dateSplit.startTime[0] +
                  "年" +
                  dateSplit.startTime[1] +
                  "月" +
                  i +
                  "日",
                judgeMonht:
                  dateSplit.startTime[0] +
                  "-" +
                  dateSplit.startTime[1] +
                  "-" +
                  i,
                SCVVolume: "",
                SCVQuality: "",
                lightVolume: "",
                lightQuality: "",
                otherVolume: "",
                otherQuality: "",
              };
              dailyData.push(data);
            }
          }
        } else if (index === dayCollection.length - 1) {
          let endData = parseInt(dateSplit.endTime[2]) + 1;
          for (let i = 1; i < endData; i++) {
            if (i.toString().length == 1) {
              i = "0" + i;
            }
            let data = {
              monht:
                dateSplit.endTime[0] +
                "年" +
                dateSplit.endTime[1] +
                "月" +
                i +
                "日",
              judgeMonht:
                dateSplit.endTime[0] + "-" + dateSplit.endTime[1] + "-" + i,
              SCVVolume: "",
              SCVQuality: "",
              lightVolume: "",
              lightQuality: "",
              otherVolume: "",
              otherQuality: "",
            };
            dailyData.push(data);
          }
        } else {
          for (let i = 1; i < element; i++) {
            let data = {
              monht:
                dateSplit.startTime[0] +
                "年" +
                dateSplit.startTime[1] +
                "月" +
                i +
                "日",
              judgeMonht:
                dateSplit.startTime[0] + "-" + dateSplit.startTime[1] + "-" + i,
              SCVVolume: "",
              SCVQuality: "",
              lightVolume: "",
              lightQuality: "",
              otherVolume: "",
              otherQuality: "",
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

    //查询条件月份范围选择器必备方法
    monthRangeChange(value, mode) {
      this.Month = value;
      this.mode2 = [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1],
      ];
      this.form.startMonth = this.formatDate(
        new Date(this.Month[0]),
        "yyyy-MM"
      );
      this.form.endMonth = this.formatDate(new Date(this.Month[1]), "yyyy-MM");
    },
    //新增弹窗相关按钮
    addNew() {
      this.pageType = "add";
      var d = new Date();
      var da = d.getDate().toString().padStart(2, "0");

      this.operation = true;
      this.operation2 = true;
      this.ApprovalLC = false;
      this.addNewModelConfig.title = "自耗气月报-新增";
      this.visibleAddNew = true;
      this.surfaceForm = {};
      this.flieChanges = [];
      this.surfaceForm.reportType = "结算型";

      var _this = this;
      let yy = d.getFullYear();
      let mm = d.getMonth() + 1;
      let dd = d.getDate();
      let hh = d.getHours();
      let mf = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();

      _this.gettime = yy + "-" + mm + "-" + dd;
      this.surfaceForm.numbers = "ZHQYB" + yy + mm + da + hh + mf + mf; //编号

      let yesterday = `${yy}-${
        d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth()
      }-26 `;
      let time1 = `${yy}-${mm < 10 ? `0${mm}` : mm}-25 `;

      this.pipelineExportMonthlyReport = {};

      this.onChange2("1", [yesterday, time1]);
    },
    edit(value) {
      this.pageType = "edit";
      this.operation = true;
      this.operation2 = true;
      this.addNewModelConfig.title = "自耗气月报-编辑";
      this.ApprovalLC = false;
      let obj2 = JSON.parse(JSON.stringify(value));
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }
      this.surfaceForm = obj2;
      this.visibleAddNew = true;
      if (this.surfaceForm.startTime) {
        this.surfaceForm.startTime = this.surfaceForm.startTime.substring(
          0,
          10
        );
      }
      if (this.surfaceForm.endTime) {
        this.surfaceForm.endTime = this.surfaceForm.endTime.substring(0, 10);
      }
      this.onChange2("1", [
        this.surfaceForm.startTime,
        this.surfaceForm.endTime,
      ]);
      if (this.surfaceForm.reportType == "结算型") {
        this.sign = true;
      } else {
        this.sign = false;
      }
    },
    // 删除
    mydelete() {
      deleteSC(this.selectedRowKeys).then((res) => {
        this.$message.success("删除成功");
        this.getList();
      });
    },
    // 新增 修改
    save(value) {
      this.pageType = "save";
      let flielist = [];
      if (this.flieChanges.length > 0) {
        this.flieChanges.forEach((element) => {
          let row = { id: element.id, fileName: element.fileName };
          flielist.push(row);
        });
        this.surfaceForm.fileInfo = JSON.stringify(flielist);
      }
      // 因为页面没有选择月份的控件，目前是结算型截取结束日期的月份，统计型截取开始日期的月份，后期可能还会修改
      this.surfaceForm.months =
        this.surfaceForm.reportType == "结算型"
          ? this.surfaceForm.endTime.substring(0, 7)
          : this.surfaceForm.startTime.substring(0, 7);
      console.log(this.surfaceForm);
      if (this.addNewModelConfig.title == "自耗气月报-编辑") {
        update(this.surfaceForm).then((res) => {
          if (res.code == 200) {
            if (value == "sunmit") {
              this.CSubmit(this.surfaceForm.id);
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
        insert(this.surfaceForm).then((res) => {
          console.log(res);
          if (res.code == 200) {
            if (value == "sunmit") {
              this.CSubmit(res.body);
            } else {
              this.handleCancel();
              this.$message.success("保存成功！");
              this.getList();
            }
          } else {
            if (value == "sunmit") {
              this.$message.error("提交失败！");
            } else {
              this.$message.warning("保存失败");
            }
          }
        });
      }
    },
    //获得当前页面
    getList() {
      // let form = {
      //   pageIndex: this.form.pageIndex,
      //   pageSize: this.form.pageSize,
      //   reportType: this.form.reportType,
      //   createdUser: this.form.createdUser,
      //   status: this.form.status,
      //   startMonth: this.form.Month[0],
      //   endMonth: this.form.Month[1],
      // };
      findAllList(this.form).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize + 1;
        this.pagination.total = res.body.total;
        if (this.dataSource.length > 0) {
          this.total();
        }
        this.dataSource.forEach((element) => {
          if (element.status == 1) {
            element.statusName = "已保存";
          } else if (element.status == 2) {
            element.statusName = "已提交";
          } else if (element.status == 3) {
            element.statusName = "审批中";
          } else if (element.status == 4) {
            element.statusName = "已审批";
          } else if (element.status == 5) {
            element.statusName = "已拒绝";
          }
        });
      });
      this.selectedRowKeys = [];
    },
    // 合计
    total() {
      let scvVolume = 0;
      let scvQuality = 0;
      let lightVolume = 0;
      let lightQuality = 0;
      let otherGasVolume = 0;
      let otherGasQuality = 0;
      let currentMonthTotalVolume = 0;
      let currentMonthTotalQuality = 0;
      this.dataSource.forEach((element, index) => {
        element.index =
          (this.pagination.current - 1) * (this.pagination.pageSize - 1) +
          index +
          1;
        scvVolume += new Number(element.scvVolume);
        scvQuality += new Number(element.scvQuality);
        lightVolume += new Number(element.lightVolume);
        lightQuality += new Number(element.lightQuality);
        otherGasVolume += new Number(element.otherGasVolume);
        otherGasQuality += new Number(element.otherGasQuality);
        currentMonthTotalVolume += new Number(element.currentMonthTotalVolume);
        currentMonthTotalQuality += new Number(
          element.currentMonthTotalQuality
        );
      });

      let monthTotal = {
        id: "-999",
        index: "本页合计",
        scvVolume: scvVolume,
        scvQuality: scvQuality,
        lightVolume: lightVolume,
        lightQuality: lightQuality,
        otherGasVolume: otherGasVolume,
        otherGasQuality: otherGasQuality,
        currentMonthTotalVolume: currentMonthTotalVolume,
        currentMonthTotalQuality: currentMonthTotalQuality,
      };
      this.dataSource.push(monthTotal);
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
      this.form.pageSize = pagination.pageSize - 1;

      this.getList();
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.Time = [];
      this.Month = [];
      this.form.pageIndex = 1;
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
    //设置合计行 均值行  多选框不可选择
    getCheckboxProps: (record) => ({
      props: {
        disabled:
          record.index === "本页合计" ||
          (record.status !== "1" && record.status !== "5"),
        name: record.name,
      },
    }),
    //合计行  平均值行加背景颜色
    rowStyle(record) {
      if (record.index == "本页合计") {
        return {
          style: {
            "background-color": "#eeeeee",
          },
        };
      }
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
  /deep/.ant-select-selection {
    border: 1px solid #fff;
  }
}
</style>
