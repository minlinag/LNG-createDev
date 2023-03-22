<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', isPower: false, clickName: 'addNew' },
          { value: 'Delete', isPower: false, clickName: 'mydelete' },
          { value: 'exportComponent', isPower: false, url: '' },
        ]"
        @addNew="add"
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
                  label="月份:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-month-picker
                    format="YYYY-MM"
                    :valueFormat="'YYYY-MM'"
                    v-model="form.monthExport"
                    placeholder="选择日期"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="状态:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-select
                    style="width: 98%"
                    v-model="form.status"
                    placeholder="请选择状态"
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
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="填报人"
                >
                  <a-input
                    v-model="form.reportPerson"
                    placeholder="请输入填报人"
                  ></a-input>
                </a-form-model-item>
              </a-col>
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
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        :pagination="pagination"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1 unloadTable"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
        bordered
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
      <dc-Model
        width="80vw"
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="DcModel"
        @input="handleCancel"
      >
        <div class="wrapper" :model="surfaceForm">
          <a-layout>
            <a-layout-content style="height: 50vh">
              <!-- 打印区域 -->
              <div id="printContent">
                <table class="table_form" width="100%" border="2">
                  <tr>
                    <th colspan="7">
                      北京燃气集团(天津)液化天然气有限公司
                      <br />
                      <!-- {{ year }}年{{ month }}月气化外输汇总表 -->
                    </th>
                  </tr>
                  <tr>
                    <td colspan="7" style="text-align: center">
                      <a-range-picker
                        :disabled="ApprovalLC"
                        format="YYYY-MM-DD"
                        @change="onChange"
                        class="td_range_picker"
                      >
                      </a-range-picker>
                      {{ tradeFormData }}
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="width: 17%">月报类型：</td>
                    <td colspan="2">
                      <a-select
                        :disabled="ApprovalLC"
                        v-if="pageType == 'add' || pageType == 'edit'"
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
                      <span v-else>&nbsp;{{ surfaceForm.reportType }}</span>
                    </td>
                    <td align="center" style="width: 15%">编号：</td>
                    <td colspan="3">&nbsp; {{ surfaceForm.gasCode }}</td>
                  </tr>
                  <tr>
                    <td align="center" rowspan="2">日期</td>
                    <td align="center" colspan="2">计划外输量</td>
                    <td align="center" colspan="2">实际外输量</td>
                    <td align="center" colspan="2">年累计量</td>
                  </tr>
                  <tr align="center">
                    <td width="15%">Nm3</td>
                    <td width="15%">t</td>
                    <td width="15%">Nm3</td>
                    <td width="15%">t</td>
                    <td width="15%">Nm3</td>
                    <td width="15%">t</td>
                  </tr>
                  <tr
                    v-for="(item, index) in pipelineExportMonthlyReport"
                    :key="index"
                  >
                    <td align="center">{{ item.monht }}</td>
                    <td align="center">
                      {{ item.dailyPlanLoadingAmountNm }}
                    </td>
                    <td align="center">
                      {{ item.dailyPlanLoadingAmountTon }}
                    </td>
                    <td align="center">
                      {{ item.gasFlowNm }}
                    </td>
                    <td align="center">
                      {{ item.gasFlowT }}
                    </td>
                    <td align="center">
                      {{ item.yeargasFlowNm }}
                    </td>
                    <td align="center">
                      {{ item.yeargasFlowT }}
                    </td>
                  </tr>
                  <tr align="center">
                    <td>合计</td>
                    <td>
                      {{ surfaceForm.plannedExportVolumeNM3 }}
                    </td>
                    <td>
                      {{ surfaceForm.plannedExportVolumeT }}
                    </td>
                    <td>
                      {{ surfaceForm.actualExportVolumeNM3 }}
                    </td>
                    <td>
                      {{ surfaceForm.actualExportVolumeT }}
                    </td>
                    <td>
                      {{ surfaceForm.annualExportVolumeNM3 }}
                    </td>
                    <td>
                      {{ surfaceForm.annualExportVolumeT }}
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
  getListForPage,
  add,
  update,
  deleteSC,
  queryPlanExportAmountByDate,
  queryGasEveryDay,
  queryYearTot,
  pipelineExportMonthlyReportSubmit,
  pipelineExportMonthlyReportAudio,
} from "@/api/meteringManagement/pipelineOutgoingMonth";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  components: {
    stepsModel,
    fileUpload,
  },
  data() {
    return {
      pageType: "",
      IDs: "",
      operation2: false,
      PrintDY: false,
      printConfig: {
        id: "printContent",
        popTitle: "气化外输汇总表",
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
      sign: true,
      formState: {},
      labelCol: { style: { width: "180px" } },
      visible: false,
      ApprovalLC: false, //审批展示
      activeKey2: "1",
      reportType: [
        { value: "结算型", label: "结算型" },
        { value: "统计型", label: "统计型" },
      ],
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
          ellipsis: true,
          align: "center",
        },
        {
          title: "单位名称",
          dataIndex: "institution",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "审批日期",
          dataIndex: "result",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "审批意见",
          ellipsis: true,
          dataIndex: "advice",
          width: 150,
          align: "center",
        },
        {
          title: "审批状态",
          ellipsis: true,
          dataIndex: "time",
          width: 150,
          align: "center",
        },
      ],
      //页面下方表格的列属性11
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
          title: "月报类型",
          dataIndex: "reportType",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "月份",
          dataIndex: "monthExport",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "计划外输量",
          align: "center",
          children: [
            {
              title: "(Nm3)",
              ellipsis: true,
              dataIndex: "plannedExportVolumeNM3",
              width: 100,
              align: "center",
            },
            {
              title: "(t)",
              ellipsis: true,
              dataIndex: "plannedExportVolumeT",
              width: 100,
              align: "center",
            },
          ],
        },
        {
          title: "实际外输量",
          align: "center",
          children: [
            {
              title: "(Nm3)",
              dataIndex: "actualExportVolumeNM3",
              ellipsis: true,
              width: 100,
              align: "center",
            },
            {
              title: "(t)",
              dataIndex: "actualExportVolumeT",
              ellipsis: true,
              width: 100,
              align: "center",
            },
          ],
        },
        {
          title: "年累计量",
          align: "center",
          children: [
            {
              title: "(Nm3)",
              dataIndex: "annualExportVolumeNM3",
              ellipsis: true,
              width: 100,
              align: "center",
            },
            {
              title: "(t)",
              dataIndex: "annualExportVolumeT",
              ellipsis: true,
              width: 100,
              align: "center",
            },
          ],
        },
        {
          title: "填报人",
          dataIndex: "createdUser",
          ellipsis: true,
          width: "100px",
          align: "center",
        },
        {
          title: "填报时间",
          dataIndex: "createdDateTime",
          ellipsis: true,
          // width: "170px",
          align: "center",
        },
        {
          title: "审批状态",
          dataIndex: "recordStatusName",
          ellipsis: true,
          width: "100px",
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
      //新增是否visible
      visibleAddNew: false,
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
          {
            //取消button
            type: "btn",
            label: "提交",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "submit", //传值内容 拿到当前所有数据包装好的
          },
          {
            //取消button
            type: "btn",
            label: "取消",
            btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: "dateMonthPicker", //组件类型 目前指出 input || select
            label: "月份", //展示名称
            colSpan: 8,
            format: "YYYY-MM",
            formKey: "monthExport", //form 定义的 key (必须唯一 || 必须传入)
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
            type: "select", //组件类型 目前指出 input || select
            label: "月报类型", //展示名称
            formKey: "reportType", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 8,
          },
          // {
          //   type: "input", //组件类型 目前指出 input || select
          //   label: "编号", //展示名称
          //   formKey: "personInCharge", //form 定义的 key (必须唯一 || 必须传入)
          //   value: "", // 默认值为空字符串 // v-model 绑定值
          //   placeholder: "请输入", //输入框为空值的时候展示内容
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   labelStyle: { style: { width: "150px" } }, //组件样式 form-item
          //   // options: { // 配置参数
          //   //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
          //   // },
          //   options: {
          //     // 暂时开发状态
          //     multiple: true,
          //   },
          //   colSpan: 8,
          // },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "计划外输量(Nm3)", //展示名称
            formKey: "plannedExportVolumeNM3", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "200px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "计划外输量(t)", //展示名称
            formKey: "plannedExportVolumeT", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "实际外输量(Nm3)", //展示名称
            formKey: "actualExportVolumeNM3", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "200px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "实际外输量(t)", //展示名称
            formKey: "actualExportVolumeT", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "年累计量(Nm3)", //展示名称
            formKey: "annualExportVolumeNM3", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "年累计量(t)", //展示名称
            formKey: "annualExportVolumeT", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 8,
          },
        ],
      },
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: "950px",
        title: "外输管道月报",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageSize: 10,
        pageNum: 1,
      },

      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      //表格中的数据
      dataSource: [],
      surfaceForm: {},
      tradeFormData: "年 月 日 8:00 至 年 月 日 8:00",
      pipelineExportMonthlyReport: [],
      flieChanges: [],
    };
  },
  computed: {},
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
      pipelineExportMonthlyReportAudio(params).then((res) => {
        if (res.body == "true") {
          this.$message.success("审批成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("审批失败");
        }
      });
    },
    CSubmit(id) {
      let ID = id ? id : this.surfaceForm.id;
      pipelineExportMonthlyReportSubmit(ID).then((res) => {
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
      if (this.$refs.importConpontsDataRefs) {
        this.$refs.importConpontsDataRefs.removeFile();
      }
    },
    Exhibition(row) {
      if (row == "结算型") {
        this.sign = true;
      } else {
        this.sign = false;
      }
    },
    // 附件
    flieChange(val) {
      this.flieChanges = val;
    },
    handleOk() {},
    // 删除
    mydelete() {
      deleteSC(this.selectedRowKeys).then((res) => {
        this.$message.success("删除成功");
        this.getList();
      });
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

      if (this.addNewModelConfig.title == "管道外输月报-编辑") {
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
        add(this.surfaceForm).then((res) => {
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
      //   }
      // });
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //新增弹窗相关按钮

    //日期的onchange
    onChange(date, dateString) {
      let dayString = "";
      let PlannedExport = [];
      let ActualExport = [];
      let YearsOfTiredness = [];
      let list = [];
      this.surfaceForm.startTime = dateString[0];
      this.surfaceForm.endTime = dateString[1];
      queryPlanExportAmountByDate({
        startPlanTime: dateString[0],
        endPlanTime: dateString[1],
      }).then((res) => {
        PlannedExport = res.body;
        for (let j = 0; j < list.length; j++) {
          for (let i = 0; i < PlannedExport.length; i++) {
            if (list[j].judgeMonht == PlannedExport[i].planLoadingDate) {
              list[j].dailyPlanLoadingAmountNm =
                PlannedExport[i].dailyPlanLoadingAmountNm;
              list[j].dailyPlanLoadingAmountTon =
                PlannedExport[i].dailyPlanLoadingAmountTon;
            }
          }
        }
      });
      queryGasEveryDay({
        startTime: dateString[0],
        endTime: dateString[1],
      }).then((res) => {
        ActualExport = res.body;
        for (let j = 0; j < list.length; j++) {
          for (let i = 0; i < ActualExport.length; i++) {
            if (list[j].judgeMonht == ActualExport[i].dealStartTime) {
              list[j].gasFlowNm = ActualExport[i].gasFlowNm;
              list[j].gasFlowT = ActualExport[i].gasFlowT;
            }
          }
        }
        queryYearTot({
          startTime: dateString[0],
        }).then((res) => {
          YearsOfTiredness = res.body;
          for (let j = 0; j < list.length; j++) {
            for (let i = 0; i < ActualExport.length; i++) {
              if (list[j].judgeMonht == ActualExport[i].dealStartTime) {
                list[j].yeargasFlowNm = ActualExport[i].yeargasFlowNm;
                list[j].yeargasFlowT = ActualExport[i].yeargasFlowT;
              }
            }
          }

          for (let i = 0; i < list.length; i++) {
            if (list[i].dailyPlanLoadingAmountNm) {
            } else {
              list[i].dailyPlanLoadingAmountNm = 0;
            }
            if (list[i].dailyPlanLoadingAmountTon) {
            } else {
              list[i].dailyPlanLoadingAmountTon = 0;
            }
            if (list[i].gasFlowNm) {
            } else {
              list[i].gasFlowNm = 0;
            }
            if (list[i].gasFlowT) {
            } else {
              list[i].gasFlowT = 0;
            }
            if (list[i].yeargasFlowNm) {
            } else {
              list[i].yeargasFlowNm = 0;
            }
            if (list[i].yeargasFlowT) {
            } else {
              list[i].yeargasFlowT = 0;
            }
            if (i >= 1) {
              list[i].yeargasFlowNm =
                parseInt(list[i].gasFlowNm) +
                parseInt(list[i - 1].yeargasFlowNm);
              list[i].yeargasFlowT =
                parseInt(list[i].gasFlowT) + parseInt(list[i - 1].yeargasFlowT);
            }
          }
          let totaldailyPlanLoadingAmountNm = 0;
          let totaldailyPlanLoadingAmountTon = 0;
          let totalgasFlowNm = 0;
          let totalgasFlowT = 0;
          let totalyeargasFlowNm = 0;
          let totalyeargasFlowT = 0;
          for (let i = 0; i < list.length; i++) {
            totaldailyPlanLoadingAmountNm += parseInt(
              list[i].dailyPlanLoadingAmountNm
            );
            totaldailyPlanLoadingAmountTon += parseInt(
              list[i].dailyPlanLoadingAmountTon
            );
            totalgasFlowNm += parseInt(list[i].gasFlowNm);
            totalgasFlowT += parseInt(list[i].gasFlowT);
            totalyeargasFlowNm += parseInt(list[i].yeargasFlowNm);
            totalyeargasFlowT += parseInt(list[i].yeargasFlowT);
          }
          console.log(totaldailyPlanLoadingAmountNm);
          console.log(totaldailyPlanLoadingAmountTon);
          console.log(totalgasFlowNm);
          console.log(totalgasFlowT);
          console.log(totalyeargasFlowNm);
          console.log(totalyeargasFlowT);
          this.surfaceForm.plannedExportVolumeNM3 =
            totaldailyPlanLoadingAmountNm;
          this.surfaceForm.plannedExportVolumeT =
            totaldailyPlanLoadingAmountTon;
          this.surfaceForm.actualExportVolumeNM3 = totalgasFlowNm;
          this.surfaceForm.actualExportVolumeT = totalgasFlowT;
          this.surfaceForm.annualExportVolumeNM3 = totalyeargasFlowNm;
          this.surfaceForm.annualExportVolumeT = totalyeargasFlowT;
          this.pipelineExportMonthlyReport = list;
        });
      });

      for (let index = 0; index < dateString.length; index++) {
        const element = dateString[index];
        if (index < dateString.length - 1) {
          dayString +=
            this.timePatternConvert(element) +
            " \xa0\xa0\xa0\xa0\xa0\xa0至 \xa0\xa0\xa0\xa0\xa0\xa0";
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
                dailyPlanLoadingAmountNm: "",
                dailyPlanLoadingAmountTon: "",
                gasFlowNm: "",
                gasFlowT: "",
                yeargasFlowNm: "",
                yeargasFlowT: "",
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
                dailyPlanLoadingAmountNm: "",
                dailyPlanLoadingAmountTon: "",
                gasFlowNm: "",
                gasFlowT: "",
                yeargasFlowNm: "",
                yeargasFlowT: "",
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
              dailyPlanLoadingAmountNm: "",
              dailyPlanLoadingAmountTon: "",
              gasFlowNm: "",
              gasFlowT: "",
              yeargasFlowNm: "",
              yeargasFlowT: "",
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
              judgeMonht:
                dateSplit.startTime[0] + "-" + dateSplit.startTime[1] + "-" + i,
              dailyPlanLoadingAmountNm: "",
              dailyPlanLoadingAmountTon: "",
              gasFlowNm: "",
              gasFlowT: "",
              yeargasFlowNm: "",
              yeargasFlowT: "",
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
    add() {
      this.pageType = "add";
      var d = new Date();
      var ye = d.getFullYear();
      var mo = (d.getMonth() + 1).toString().padStart(2, "0");
      var da = d.getDate().toString().padStart(2, "0");
      var time1 = ye + "-" + mo + "-" + "25";
      this.operation = true;
      this.operation2 = true;
      this.PrintDY = false;
      this.surfaceForm = {};
      this.flieChanges = [];
      this.surfaceForm.reportType = "结算型";
      this.ApprovalLC = false;
      this.addNewModelConfig.title = "管道外输月报-新增";
      this.visibleAddNew = true;
      this.echoMap = {};
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh =
        new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.gettime = yy + "-" + mm + "-25";
      this.surfaceForm.gasCode =
        "GDWSRB" + yy + (mm < 10 ? "0" + mm : mm) + da + hh + mf + ss; //编号
      this.tradeFormData =
        "年 月 日 08:00 \xa0\xa0\xa0\xa0\xa0\xa0至\xa0\xa0\xa0\xa0\xa0\xa0 年 月 日 08:00";
      this.pipelineExportMonthlyReport = {};

      this.onChange("1", [_this.gettime, time1]);
      // 重置里面的value，清零
      // this.addNewConfig.formDataList.forEach(
      //   (item) => (item.value = undefined)
      // );
    },
    edit(row) {
      this.pageType = "edit";
      this.operation = true;
      this.operation2 = true;
      this.PrintDY = true;
      let obj2 = JSON.parse(JSON.stringify(row));
      this.surfaceForm = obj2;
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }
      this.ApprovalLC = false;
      this.addNewModelConfig.title = "管道外输月报-编辑";
      this.onChange("1", [
        this.surfaceForm.startTime,
        this.surfaceForm.endTime,
      ]);
      if (this.surfaceForm.reportType == "结算型") {
        this.sign = true;
      } else {
        this.sign = false;
      }
      this.visibleAddNew = true;
    },
    approvalClick(val) {
      this.look(val);
      this.ApprovalLC = true;
      this.pageType = "approval";
    },
    look(row) {
      this.pageType = "look";
      this.operation = false;
      this.operation2 = false;
      this.PrintDY = true;
      let obj2 = JSON.parse(JSON.stringify(row));
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }
      this.$nextTick(() => {
        this.IDs = obj2.id;
      });
      this.surfaceForm = obj2;
      this.ApprovalLC = true;
      this.addNewModelConfig.title = "管道外输月报-查看";
      this.onChange("1", [
        this.surfaceForm.startTime,
        this.surfaceForm.endTime,
      ]);
      if (this.surfaceForm.reportType == "结算型") {
        this.sign = true;
      } else {
        this.sign = false;
      }
      this.visibleAddNew = true;
      // this.visible = true;
      // this.$router.push({
      //   path: "/pipelineMonthDetails",
      // });
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
    //获得当前页面
    getList() {
      getListForPage(this.form).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize + 1;
        this.pagination.total = res.body.total;
        this.total();
        this.dataSource.forEach((element) => {
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
      this.selectedRowKeys = [];
    },
    // 合计
    total() {
      let plannedExportVolumeNM3 = 0;
      let plannedExportVolumeT = 0;
      let actualExportVolumeNM3 = 0;
      let actualExportVolumeT = 0;
      this.dataSource.forEach((element, index) => {
        element.index =
          (this.pagination.current - 1) * (this.pagination.pageSize - 1) +
          index +
          1;
        plannedExportVolumeNM3 += new Number(element.plannedExportVolumeNM3);
        plannedExportVolumeT += new Number(element.plannedExportVolumeT);
        actualExportVolumeNM3 += new Number(element.actualExportVolumeNM3);
        actualExportVolumeT += new Number(element.actualExportVolumeT);
      });

      let monthTotal = {
        id: "-999",
        index: "本页合计",
        plannedExportVolumeNM3: plannedExportVolumeNM3,
        plannedExportVolumeT: plannedExportVolumeT,
        actualExportVolumeNM3: actualExportVolumeNM3,
        actualExportVolumeT: actualExportVolumeT,
      };
      this.dataSource.push(monthTotal);
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
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    //设置合计行 均值行  多选框不可选择
    getCheckboxProps: (record) => ({
      props: {
        disabled:
          record.index === "本页合计" ||
          (record.recordStatus !== "1" && record.recordStatus !== "5"),
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
</style>
