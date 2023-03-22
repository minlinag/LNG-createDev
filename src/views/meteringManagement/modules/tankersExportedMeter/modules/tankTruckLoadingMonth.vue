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
              <a-col :span="5">
                <a-form-model-item
                  label="装车时间:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-range-picker
                    @panelChange="monthRangeChange"
                    :placeholder="['开始月份', '结束月份']"
                    format="YYYY-MM"
                    v-model="Month"
                    :mode="['month', 'month']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="5">
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
              <a-col :span="5">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="报表类型"
                >
                  <a-input
                    v-model="form.reportType"
                    placeholder="请输入报表类型"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="5">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="填报人"
                >
                  <a-input
                    v-model="form.fillUser"
                    placeholder="请输入填报人"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="4">
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
                  </a-button></a-form-model-item
                ></a-col
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
        class="list_table_1"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
        :customRow="rowStyle"
      >
        <template slot="operation" slot-scope="row">
          <!-- $disabled.editDisabled(row.status) -->
          <pe-button
            v-if="row.index != '本页合计'"
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
                isPower: false,
                disabled: $audit.editDisabled(row.recordStatus),
              },
              {
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                isPower: false,
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
        <template #footer>{{ result }}</template>
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
            <a-layout-content id="addContent">
              <div id="printContent">
                <table class="table_form" width="100%" border="2">
                  <tr>
                    <th style="height: 90px; font-size: 18px" colspan="7">
                      北京燃气集团(天津)液化天然气有限公司
                      <br />
                      液化天然气槽车装车量汇总表
                      <!-- {{ year }}年{{ month }}月 -->
                    </th>
                  </tr>
                  <tr>
                    <td align="center" style="width: 15%">报表类型：</td>
                    <td>
                      <a-select
                        :disabled="ApprovalLC"
                        class="input"
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
                    <td colspan="5" style="text-align: center">
                      <a-range-picker
                        :disabled="ApprovalLC"
                        format="YYYY-MM-DD"
                        @change="onChange2"
                        class="td_range_picker"
                      >
                      </a-range-picker>
                      {{ tradeFormData }}
                      <!-- {{ typeMonth }} -->
                    </td>
                  </tr>
                  <tr>
                    <td align="center" rowspan="2">日期</td>
                    <td align="center" colspan="3">装车量</td>
                    <td align="center" colspan="3">年累计</td>
                  </tr>
                  <tr align="center">
                    <td width="15%">辆</td>
                    <td width="15%">吨</td>
                    <td width="15%">Nm3</td>
                    <td width="15%">辆</td>
                    <td width="15%">吨</td>
                    <td width="15%">Nm3</td>
                  </tr>
                  <tr v-for="(item, index) in tankWagonList" :key="index">
                    <td align="center">{{ item.monht }}</td>
                    <td align="center">
                      {{ item.amount }}
                    </td>
                    <td align="center">
                      {{ item.loadingCount }}
                    </td>
                    <td align="center">
                      {{ item.volume }}
                    </td>
                    <td align="center">
                      {{ item.yearamount }}
                    </td>
                    <td align="center">
                      {{ item.yearloadingCount }}
                    </td>
                    <td align="center">
                      {{ item.yearvolume }}
                    </td>
                  </tr>
                  <tr align="center">
                    <td>合计</td>
                    <td>{{ surfaceForm.loadingNumber }}</td>
                    <td>{{ surfaceForm.loadingT }}</td>
                    <td>{{ surfaceForm.loadingNm }}</td>
                    <td>{{ surfaceForm.yearCumulativeLoadingNumber }}</td>
                    <td>{{ surfaceForm.yearCumulativeLoadingT }}</td>
                    <td>{{ surfaceForm.yearCumulativeLoadingNm }}</td>
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
            <a-layout-footer>
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
                v-if="PrintDY"
                v-Add
                class="buttonType"
                type="primary"
                v-print="printConfig"
                key="1"
              >
                打印
              </a-button>
              <a-button @click="visibleAddNew = false"> 取消 </a-button>
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
  queryGasEveryDay,
  queryGasStartDay,
  CczcybSubmit,
  coldEnergyConsumAudio,
} from "@/api/meteringManagement/tankTruckLoadingMonth";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
import fileUpload from "@/components/upLoad/fileUpload";
export default {
  components: {
    stepsModel,
    fileUpload: fileUpload,
  },
  data() {
    return {
      printConfig: {
        id: "printContent",
        popTitle: "液化天然气槽车装车量汇总表",
      },
      IDs: "",
      PrintDY: false,
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
      pageType: "",
      Month: [],
      operation: true,
      operation2: false,
      sign: true,
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
      },
      formState: {},
      labelCol: { style: { width: "220px" } },
      labelCol2: { style: { width: "290px" } },
      visible: false,
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
          align: "center",
        },
        {
          title: "单位名称",
          dataIndex: "institution",
          width: 150,
          align: "center",
        },
        {
          title: "审批日期",
          dataIndex: "result",
          width: 150,
          align: "center",
        },
        {
          title: "审批意见",
          dataIndex: "advice",
          width: 150,
          align: "center",
        },
        {
          title: "审批状态",
          dataIndex: "time",
          width: 150,
          align: "center",
        },
      ],
      mode2: ["month", "month"],
      value: [],
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
      reportType: [
        { value: "结算型", label: "结算型" },
        { value: "统计型", label: "统计型" },
      ],
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
        title: "槽车装车月报",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //新增界面
      addNewConfig: {
        otherConfigurations: [
          {
            //保存button
            type: "btn",
            label: "保存",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "save", //传值内容 拿到当前所有数据包装好的
          },
          // {
          //   //取消button
          //   type: "btn",
          //   label: "取消",
          //   btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   emit: "cancel", //传值内容 拿到当前所有数据包装好的
          // },
          {
            //取消button
            type: "btn",
            label: "提交",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "submit", //传值内容 拿到当前所有数据包装好的
          },
          {
            //保存button
            type: "btn",
            label: "打印",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "print", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: "input", //组件类型 目前指出 input || select
            label: "报表类型", //展示名称
            formKey: "reportType", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入报表类型",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "dateMonthPicker", //组件类型 目前指出 input || select
            label: "装车月份", //展示名称
            colSpan: 8,
            format: "YYYY-MM",
            formKey: "loadingMonth", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请选择", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "装车数量(辆)", //展示名称
            formKey: "loadingNumber", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入装车量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "装车量(t)", //展示名称
            formKey: "loadingT", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入装车量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "装车量(万Nm3)", //展示名称
            formKey: "loadingNm", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入装车量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "年累计装车数量(辆)", //展示名称
            formKey: "yearCumulativeLoadingNumber", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "200px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入年累计装车数量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "年累计装车量(t)", //展示名称
            formKey: "yearCumulativeLoadingT", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入年累计装车量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "年累计装车量(万Nm3)", //展示名称
            formKey: "yearCumulativeLoadingNm", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "240px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入年累计装车量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
        ],
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      tankWagonList: [],
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
          title: "报表类型",
          dataIndex: "reportType",
          width: 100,
          align: "center",
          ellipsis: true,
        },
        {
          title: "装车月份",
          dataIndex: "loadingMonth",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "装车数量(辆)",
          ellipsis: true,
          dataIndex: "loadingNumber",
          width: 120,
          align: "center",
        },
        {
          title: "装车量(t)",
          dataIndex: "loadingT",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "装车量(万Nm3)",
          dataIndex: "loadingNm",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "年累计装车数量(辆)",
          ellipsis: true,
          dataIndex: "yearCumulativeLoadingNumber",
          // scopedSlots: { customRender: "statusOprion" },
          width: 180,
          align: "center",
        },
        {
          title: "年累计装车量(t)",
          dataIndex: "yearCumulativeLoadingT",
          ellipsis: true,
          // scopedSlots: { customRender: "statusOprion" },
          width: 130,
          align: "center",
        },
        {
          title: "年累计装车量(万Nm3)",
          dataIndex: "yearCumulativeLoadingNm",
          ellipsis: true,
          // width: 170,
          align: "center",
        },
        {
          title: "填报人",
          dataIndex: "createdUser",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "状态",
          ellipsis: true,
          dataIndex: "recordStatusName",
          align: "center",
          width: 120,
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
      //表格中的数据reportType
      dataSource: [],
      result: "",
      surfaceForm: { reportType: "" },
      year: "",
      month: "",
      typeMonth: "",
      yy2: "",
      mm2: "",
      A: "",
      B: "",
      tradeFormData: "年 月 日至 年 月 日",
      flieChanges: [],
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
      coldEnergyConsumAudio(params).then((res) => {
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
    Csubmit(id) {
      let ID = id ? id : this.surfaceForm.id;
      CczcybSubmit(ID).then((res) => {
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
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      this.$nextTick(() => {
        this.IDs = "";
        let dom = document.getElementById("addContent");
        if (dom !== null) {
          dom.scrollTop = 0;
        }
      });
    },
    //设置合计 多选框不可选择
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.index === "本页合计",
        name: record.name,
      },
    }),
    Exhibition(row) {
      if (row == "结算型") {
        this.sign = true;
        var year, lastMonth;
        var date = new Date();
        var nowYear = date.getFullYear(); //当前年：四位数字
        var nowMonth = date.getMonth(); //当前月：0-11
        if (nowMonth == 0) {
          //如果是0，则说明是1月份，上一个月就是去年的12月
          year = nowYear - 1;
          lastMonth = 12;
        } else {
          //不是1月份，年份为当前年，月份本来是要减1的，但是由于`getMonth()`的月份本身就是少了1的，所以月份不用变。
          year = nowYear;
          lastMonth = nowMonth;
        }
        lastMonth = lastMonth < 10 ? "0" + lastMonth : lastMonth; //月份格式化：月份小于10则追加个0
        let lastYearMonth = year + "-" + lastMonth + "-26";
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
        _this.gettime = yy + "-" + mm + "-25";
        this.onChange2("1", [lastYearMonth, _this.gettime]);
      } else {
        var curDate2 = new Date();
        // 获取当前月份
        var curMonth2 = curDate2.getMonth();
        // 实际月份比curMonth大1，下面将月份设置为下一个月
        curDate2.setMonth(curMonth2 + 1);
        // 将日期设置为0，表示自动计算为上个月（这里指的是当前月份）的最后一天
        curDate2.setDate(0);
        // 返回当前月份的天数
        // curDate.getDate();
        this.B = curDate2.getDate();
        var nowDate = new Date();
        var cloneNowDate = new Date();
        var fullYear = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
        var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
        function getFullDate(targetDate) {
          var D, y, m, d;
          if (targetDate) {
            D = new Date(targetDate);
            y = D.getFullYear();
            m = D.getMonth() + 1;
            d = D.getDate();
          } else {
            y = fullYear;
            m = month;
            d = date;
          }
          m = m > 9 ? m : "0" + m;
          d = d > 9 ? d : "0" + d;
          return y + "-" + m + "-" + d;
        }
        var endDate = getFullDate(cloneNowDate.setDate(endOfMonth)); //当月最后一天
        var starDate = getFullDate(cloneNowDate.setDate(1)); //当月第一天
        console.log(starDate, endDate);
        this.onChange2("1", [starDate, endDate]);
        // this.typeMonth = starDate + "至" + endDate;
        // this.surfaceForm.loadingMonth = this.typeMonth; //月份
        this.sign = false;
      }
    },
    // 统计时间类型展示
    StatisticsTime() {
      var nowDate = new Date();
      var cloneNowDate = new Date();
      var fullYear = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
      var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
      function getFullDate(targetDate) {
        var D, y, m, d;
        if (targetDate) {
          D = new Date(targetDate);
          y = D.getFullYear();
          m = D.getMonth() + 1;
          d = D.getDate();
        } else {
          y = fullYear;
          m = month;
          d = date;
        }
        m = m > 9 ? m : "0" + m;
        d = d > 9 ? d : "0" + d;
        return y + "年" + m + "月" + d;
      }
      var endDate = getFullDate(cloneNowDate.setDate(endOfMonth)); //当月最后一天
      var starDate = getFullDate(cloneNowDate.setDate(1)); //当月第一天
      console.log(endDate);
      console.log(starDate);
    },
    handleOk() {},
    onChange(value) {
      // this.value = value;
    },
    handlePanelChange2(value, mode) {
      this.value = value;
      this.mode2 = [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1],
      ];
    },
    // 附件
    flieChange(val) {
      this.flieChanges = val;
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //新增弹窗相关按钮
    addNew() {
      this.pageType = "add";

      // this.visible = true;
      this.ApprovalLC = false;
      this.tradeFormData = "年 月 日至 年 月 日";
      this.surfaceForm = {};
      this.flieChanges = [];
      this.surfaceForm.reportType = "结算型";
      this.tankWagonList = [];
      this.addNewModelConfig.title = "槽车装车月报-新增";
      this.visibleAddNew = true;
      this.PrintDY = false;
      this.operation = true;
      this.operation2 = true;
      this.echoMap = {};
      var year, lastMonth;
      var date = new Date();
      var nowYear = date.getFullYear(); //当前年：四位数字
      var nowMonth = date.getMonth(); //当前月：0-11
      if (nowMonth == 0) {
        //如果是0，则说明是1月份，上一个月就是去年的12月
        year = nowYear - 1;
        lastMonth = 12;
      } else {
        //不是1月份，年份为当前年，月份本来是要减1的，但是由于`getMonth()`的月份本身就是少了1的，所以月份不用变。
        year = nowYear;
        lastMonth = nowMonth;
      }
      lastMonth = lastMonth < 10 ? "0" + lastMonth : lastMonth; //月份格式化：月份小于10则追加个0
      let lastYearMonth = year + "-" + lastMonth + "-26";
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      mm = mm < 10 ? "0" + mm : mm; //月份格式化：月份小于10则追加个0
      _this.gettime = yy + "-" + mm + "-25";
      this.onChange2("1", [lastYearMonth, _this.gettime]);
      //重置里面的value，清零
      this.addNewConfig.formDataList.forEach(
        (item) => (item.value = undefined)
      );
      this.addNewConfig.formDataList.forEach((element) => {
        element.disabled = false;
      });
    },
    //删除选项，根据选择的id删除对应数据
    mydelete() {
      if (
        this.selectedRowKeys.length == 0 ||
        this.selectedRowKeys.length == 0
      ) {
        this.$message.warning("至少选中一项要删除的数据");
      } else {
        let recode = [];
        this.selectedRowKeys.forEach((element) => {
          let row = this.dataSource.find((item) => element === item.id);
          if (row.recordStatus != 1) {
            recode.push(element);
          }
        });
        if (recode.length > 0) {
          this.$message.warning("请勿删除已进入工作流程中的数据");
        } else {
          deleteByIds(this.selectedRowKeys).then((res) => {
            this.$message.success("删除成功");
            this.getList();
          });
          this.selectedRowKeys = [];
        }
      }
    },
    //点击表格中审批按钮
    approvalClick(val) {
      this.look(val);
      this.ApprovalLC = true;
      this.pageType = "approval";
    },
    //查看弹窗相关按钮
    // 查看
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
      this.onChange2("1", [
        this.surfaceForm.startCumulativeDate,
        this.surfaceForm.endCumulativeDate,
      ]);
      if (this.surfaceForm.reportType == "结算型") {
        this.sign = true;
      } else {
        this.sign = false;
      }
      this.operation = false;
      this.operation2 = false;
      this.ApprovalLC = true;
      this.PrintDY = true;
      this.addNewModelConfig.title = "槽车装车月报-详情";
      this.visibleAddNew = true;

      this.addNewConfig.otherConfigurations[0].disabled = true;
      this.addNewConfig.otherConfigurations[1].disabled = true;
      this.addNewConfig.formDataList.forEach((element) => {
        element.disabled = true;
      });
    },
    edit(value) {
      this.pageType = "edit";
      this.operation = true;
      this.operation2 = true;
      this.addNewModelConfig.title = "槽车装车月报-编辑";
      this.ApprovalLC = false;
      this.PrintDY = true;
      let obj2 = JSON.parse(JSON.stringify(value));
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }
      this.surfaceForm = obj2;
      this.onChange2("1", [
        this.surfaceForm.startCumulativeDate,
        this.surfaceForm.endCumulativeDate,
      ]);
      this.visibleAddNew = true;
      // this.onChange2("1");
      // this.addNewConfig.otherConfigurations[0].disabled = false;
      // this.addNewConfig.otherConfigurations[1].disabled = false;
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
    // 保存
    save(value) {
      this.pageType = "save";
      // this.$refs.Form.verificationRules((valid) => {
      //   if (valid) {
      console.log("this.flieChanges", this.flieChanges);
      let flielist = [];
      this.flieChanges.forEach((element) => {
        let row = { id: element.id, fileName: element.fileName };
        flielist.push(row);
      });
      console.log("fileInfo", flielist);
      this.surfaceForm.fileInfo = JSON.stringify(flielist);
      // 因为页面没有选择月份的控件，目前是结算型截取结束日期的月份，统计型截取开始日期的月份，后期可能还会修改
      this.surfaceForm.loadingMonth =
        this.surfaceForm.reportType == "统计型"
          ? this.surfaceForm.startCumulativeDate.substring(0, 7)
          : this.surfaceForm.endCumulativeDate.substring(0, 7);
      if (this.addNewModelConfig.title == "槽车装车月报-编辑") {
        editById(this.surfaceForm).then((res) => {
          if (res.code == 200) {
            if (value == "sunmit") {
              this.Csubmit();
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
        this.surfaceForm.recordStatus = 1;
        add(this.surfaceForm).then((res) => {
          if (res.code == 200) {
            if (value == "sunmit") {
              this.Csubmit(res.body);
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
      //   }
      // });
    },
    // 打印
    print() {},
    //日期的onchange
    // onChange(date, dateString) {
    //   console.log(date, dateString);
    // },
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
      this.form.pageSize = pagination.pageSize - 1;
      this.getList();
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.Month = [];
      this.startDate = [];
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    //获取表格列表
    getList() {
      findList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize + 1;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
        this.total();

        this.dataSource.forEach((element) => {
          if (element.loadingMonth) {
            // 时间处理
            element.loadingMonth = element.loadingMonth.substring(0, 7);
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
        // let sumData = {
        //   id: "-999",
        //   index: "本页合计",
        //   loadingNumber: loadingNumber.toFixed(2),
        // };
        // console.log(loadingNumber);
        // this.dataSource.push(sumData);
      });
    },
    // 合计
    total() {
      let loadingNumber = 0;
      let loadingT = 0;
      let loadingNm = 0;
      this.dataSource.forEach((element, index) => {
        element.index =
          (this.pagination.current - 1) * (this.pagination.pageSize - 1) +
          index +
          1;
        loadingNumber += new Number(element.loadingNumber);
        loadingT += new Number(element.loadingT);
        loadingNm += new Number(element.loadingNm);
      });

      let monthTotal = {
        id: "-999",
        index: "本页合计",
        loadingNumber: loadingNumber,
        loadingT: loadingT,
        loadingNm: loadingNm,
      };
      this.dataSource.push(monthTotal);
      // this.result = `合计：装车数量(辆)：${loadingNumber}，装车量(t)：${loadingT}，装车量(万Nm3)：${loadingNm}`;
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

    onChange2(date, dateString) {
      let data = {
        startTime: dateString[0],
        endTime: dateString[1],
      };
      this.surfaceForm.startCumulativeDate = dateString[0];
      this.surfaceForm.endCumulativeDate = dateString[1];
      // amount  车辆
      // loadingCount  吨
      // volume Nm3
      let A = [];
      let B = [];
      let C = [];
      let list = [];
      queryGasEveryDay(data).then((res) => {
        B = res.body;
        queryGasStartDay({ startTime: dateString[0] }).then((res) => {
          C = res.body;
          list = this.generateDayList(dateString);

          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < B.length; j++) {
              if (B[j].amount) {
              } else {
                B[j].amount = 0;
              }
              if (B[j].loadingCount) {
              } else {
                B[j].loadingCount = 0;
              }
              if (B[j].volume) {
              } else {
                B[j].volume = 0;
              }
              if (list[i].judgeMonht == B[j].cutoffTime) {
                list[i].amount = B[j].amount;
                list[i].loadingCount = B[j].loadingCount;
                list[i].volume = B[j].volume;
              }
            }
          }
          console.log(list);
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < C.length; j++) {
              if (list[i].judgeMonht == C[j].cutoffTime) {
                list[i].yearamount = C[j].amount;
                list[i].yearloadingCount = C[j].loadingCount;
                list[i].yearvolume = C[j].volume;
              }
            }
          }

          for (let i = 0; i < list.length; i++) {
            if (list[i].amount) {
            } else {
              list[i].amount = 0;
            }
            if (list[i].loadingCount) {
            } else {
              list[i].loadingCount = 0;
            }
            if (list[i].volume) {
            } else {
              list[i].volume = 0;
            }
            if (list[i].yearamount) {
            } else {
              list[i].yearamount = 0;
            }
            if (list[i].yearloadingCount) {
            } else {
              list[i].yearloadingCount = 0;
            }
            if (list[i].yearvolume) {
            } else {
              list[i].yearvolume = 0;
            }
            if (i >= 1) {
              list[i].yearamount =
                parseInt(list[i].amount) + parseInt(list[i - 1].yearamount);
              list[i].yearloadingCount =
                parseInt(list[i].loadingCount) +
                parseInt(list[i - 1].yearloadingCount);
              list[i].yearvolume =
                parseInt(list[i].volume) + parseInt(list[i - 1].yearvolume);
            }
          }
          this.tankWagonList = list;
          let totalamount = 0;
          let totalloadingCount = 0;
          let totalvolume = 0;
          let totalyearamount = 0;
          let totalyearloadingCount = 0;
          let totalyearvolume = 0;
          for (let i = 0; i < this.tankWagonList.length; i++) {
            totalamount += parseInt(this.tankWagonList[i].amount);
            totalloadingCount += parseInt(this.tankWagonList[i].loadingCount);
            totalvolume += parseInt(this.tankWagonList[i].volume);
            totalyearamount += parseInt(this.tankWagonList[i].yearamount);
            totalyearloadingCount += parseInt(
              this.tankWagonList[i].yearloadingCount
            );
            totalyearvolume += parseInt(this.tankWagonList[i].yearvolume);
          }
          this.surfaceForm.loadingNumber = totalamount;
          this.surfaceForm.loadingT = totalloadingCount;
          this.surfaceForm.loadingNm = totalvolume;
          this.surfaceForm.yearCumulativeLoadingNumber = totalyearamount;
          this.surfaceForm.yearCumulativeLoadingT = totalyearloadingCount;
          this.surfaceForm.yearCumulativeLoadingNm = totalyearvolume;
          // console.log(this.tankWagonList);
        });
      });

      let dayString = "";
      for (let index = 0; index < dateString.length; index++) {
        const element = dateString[index];
        if (index < dateString.length - 1) {
          dayString +=
            this.timePatternConvert(element) +
            " 08:00" +
            "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0至\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
        } else {
          dayString += this.timePatternConvert(element) + " 08:00";
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
        const element = dayCollection[index] + 1;
        if (index === 0) {
          if (
            dateSplit.startTime[1] == dateSplit.endTime[1] &&
            dateSplit.startTime[0] == dateSplit.endTime[0]
          ) {
            let endTimeElement = parseInt(dateSplit.endTime[2]) + 1;
            for (let i = dateSplit.startTime[2]; i < endTimeElement; i++) {
              // console.log("11", dateSplit.startTime);
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
                amount: "",
                loadingCount: "",
                volume: "",
                yearamount: "",
                yearloadingCount: "",
                yearvolume: "",
              };
              dailyData.push(data);
            }
          } else {
            for (let i = dateSplit.startTime[2]; i < element; i++) {
              // console.log("001", element);
              // console.log("00", dateSplit.startTime[2]);
              // console.log("111", dateSplit.startTime);
              // console.log("333", i);
              // console.log(i.toString().length);
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
                amount: "",
                loadingCount: "",
                volume: "",
                yearamount: "",
                yearloadingCount: "",
                yearvolume: "",
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
              amount: "",
              loadingCount: "",
              volume: "",
              yearamount: "",
              yearloadingCount: "",
              yearvolume: "",
            };
            // console.log("22", dateSplit.endTime);
            dailyData.push(data);
          }
        } else {
          for (let i = 1; i < element; i++) {
            // console.log(element);
            // console.log("22", dateSplit.endTime);
            let data = {
              monht:
                dateSplit.startTime[0] +
                "年" +
                dateSplit.startTime[1] +
                "月" +
                i +
                "日",
              amount: "",
              loadingCount: "",
              volume: "",
              yearamount: "",
              yearloadingCount: "",
              yearvolume: "",
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
      newTime = str.replace(reg, "$1年$2月$3日");
      return newTime;
    },
    //查询条件月份范围选择器必备方法
    monthRangeChange(value, mode) {
      this.Month = value;
      this.mode2 = [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1],
      ];
      this.form.dateBegin = this.formatDate(new Date(this.Month[0]), "yyyy-MM");
      this.form.dateEnd = this.formatDate(new Date(this.Month[1]), "yyyy-MM");
    },
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
  height: 100%;
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
