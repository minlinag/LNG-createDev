<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', isPower: false, clickName: 'libraryDataAdd' },
          { value: 'Delete', isPower: false, clickName: 'confirm' },
        ]"
        @libraryDataAdd="addNew"
        @confirm="mydelete"
      >
      </pe-button>
    </template>
    <template slot="appMain">
      <div
        id="components-layout-demo-basic"
        class="appMainForm"
        style="width: 100%; position: relative"
      >
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  label="计划时间:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-range-picker
                    @panelChange="onChange"
                    :placeholder="['开始月份', '结束月份']"
                    format="YYYY-MM"
                    v-model="startDate"
                    :mode="['month', 'month']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="编制人"
                >
                  <a-input
                    placeholder="请输入编制人"
                    v-model="form.createdUser"
                  ></a-input>
                </a-form-model-item>
              </a-col>

              <a-col :span="6">
                <a-form-model-item
                  label="状态:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-select
                    v-model="form.status"
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
                  </a-button></a-form-model-item
                ></a-col
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
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
                isPower: false,
                disabled: $audit.editDisabledProduction(
                  row.status,
                  row.createdUserId
                ),
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
      </a-table>
      <dc-Model
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="yearProductionOperation DcModel"
        width="80vw"
        @input="handleCancel"
      >
        <a-form-model
          :model="AnnualData"
          ref="securityCheckFormRef"
          :rules="securityCheckFormRules"
        >
          <a-layout>
            <a-layout-content id="addContent">
              <a-divider orientation="left" style="font-weight: bolder"
                >基础信息</a-divider
              >
              <a-row>
                <a-col :span="8"
                  ><a-form-model-item
                    label="编制时间:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="AnnualData.createdDateTime"
                      valueFormat="YYYY-MM-DD"
                      @change="onChange"
                      placeholder="请选择日期"
                    /> </a-form-model-item
                ></a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="编制人："
                    prop="createdUser"
                  >
                    <a-input
                      disabled
                      v-model="AnnualData.createdUser"
                      placeholder="请输入编制人："
                    />
                  </a-form-model-item>
                </a-col>

                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="编制部门："
                    prop="createUserSubsidiaryOrgan"
                  >
                    <a-input
                      disabled
                      v-model="AnnualData.createUserSubsidiaryOrgan"
                      placeholder="请输入编制部门"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="计划时间："
                    :labelCol="{ style: 'width: 150px' }"
                    prop="planTime"
                  >
                    <a-month-picker
                      :disabled="details"
                      format="YYYY-MM"
                      @change="ChangeAnnualDataPanTime"
                      :valueFormat="'YYYY-MM'"
                      v-model="AnnualDataPlanTime"
                      placeholder="选择日期"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-divider orientation="left" style="font-weight: bolder"
                >月度生产运行计划</a-divider
              >
              <a-row :gutter="24">
                <a-col :span="8"
                  ><a-form-model-item
                    :labelCol="{ style: 'width: 230px' }"
                    label="气化外输量(万方)："
                    prop="gasExportVolume"
                  >
                    <a-input
                      disabled
                      v-model="AnnualData.gasExportVolume"
                      placeholder="请输入气化外输量"
                    ></a-input> </a-form-model-item
                ></a-col>
                <a-col :span="8"
                  ><a-form-model-item
                    :labelCol="{ style: 'width: 230px' }"
                    label="槽车外输量(万方)："
                    prop="tankCarExportVolume"
                  >
                    <a-input
                      disabled
                      v-model="AnnualData.tankCarExportVolume"
                      placeholder="请输入槽车外输量："
                    ></a-input> </a-form-model-item
                ></a-col>
                <a-col :span="8"
                  ><a-form-model-item
                    :labelCol="{ style: 'width: 230px ' }"
                    label="装船(预留)："
                    prop="shipLoad"
                  >
                    <a-input
                      disabled
                      v-model="AnnualData.shipLoad"
                      placeholder="请输入装船"
                    ></a-input> </a-form-model-item
                ></a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8"
                  ><a-form-model-item
                    :labelCol="{ style: 'width: 230px' }"
                    label="计划外输量(万方)："
                    prop="planExportVolume"
                  >
                    <a-input
                      disabled
                      v-model="AnnualData.planExportVolume"
                      placeholder="请输入计划外输量"
                    ></a-input> </a-form-model-item
                ></a-col>
              </a-row>
              <div class="wrapper" :model="surfaceForm">
                <table class="table_list" width="100%" border="01">
                  <tr align="center" style="background: #eeeeee; height: 40px">
                    <td>日期</td>
                    <td>气化外输量（万方）</td>
                    <td>槽车装车量（万方）</td>
                    <td>装船（预留）</td>
                    <td>卸货量（万方）(进)</td>
                  </tr>
                  <tr
                    align="center"
                    v-for="(item, index) in monthPlanList"
                    :key="index"
                    class="input"
                    :class="{ grey: index % 2 == 0 }"
                  >
                    <td>
                      {{ item.planDay }}
                    </td>
                    <td>
                      <a-input
                        v-if="item.planDay != '小计'"
                        v-model="item.gasExportVolume"
                        @change="calculation()"
                        :disabled="details"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                        placeholder="请输入"
                      />
                      <span v-else>{{ item.gasExportVolume }}</span>
                    </td>
                    <td>
                      <a-input
                        v-if="item.planDay != '小计'"
                        @change="calculation()"
                        v-model="item.tankCarInVolume"
                        :disabled="details"
                        placeholder="请输入"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                      />
                      <span v-else>{{ item.tankCarInVolume }}</span>
                    </td>
                    <td>
                      <a-input
                        v-if="item.planDay != '小计'"
                        @change="calculation()"
                        v-model="item.shipLoad"
                        :disabled="details"
                        placeholder="请输入"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                      />
                      <span v-else>{{ item.shipLoad }}</span>
                    </td>
                    <td>
                      <a-input
                        v-if="item.planDay != '小计'"
                        @change="calculation()"
                        :disabled="details"
                        v-model="item.unloadVolume"
                        placeholder="请输入"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                      />
                      <span v-else>{{ item.unloadVolume }}</span>
                    </td>
                  </tr>
                </table>
              </div>

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
              <a-button type="primary" @click="saveList" v-if="preservationBC">
                保存
              </a-button>
              <a-button
                v-Add
                v-if="pageType == 'add' || pageType == 'edit'"
                class="buttonType"
                type="primary"
                @click.stop="saveList('sunmit')"
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

              <a-button @click="handleCancel"> 取消 </a-button>
            </a-layout-footer>
          </a-layout>
        </a-form-model>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  pageList,
  deleteBatchForMonth,
  saveForAddOrUpdate,
  submitForAddOrUpdate,
  queryDetailById,
  monthPlanAudio,
  queryYearDataByTime,
} from "@/api/dispatchingManagement/yearProductionOperation";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  components: {
    stepsModel,
  },
  data() {
    let vplanTime = (rule, value, callback) => {
      console.log("AnnualDataPlanTime", this.AnnualDataPlanTime);
      if (!this.AnnualDataPlanTime) {
        callback(new Error("请输入计划时间"));
      } else {
        if (this.pageType != "add") {
          callback();
        } else {
          let row = this.dataSource.filter(
            (item) => item.planTime == this.AnnualDataPlanTime
          );
          if (row.length > 0) {
            callback(new Error("已存在当前月份"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      IDs: "",
      ChangeAnnualDataPanTimeShow: true,
      AnnualDataPlanTime: "",
      pageType: "",
      securityCheckFormRules: {
        planTime: [
          {
            validator: vplanTime,
            required: true,
          },
        ],
      },
      details: false,
      preservationBC: false,
      AnnualData: {},
      surfaceForm: {},
      monthPlanList: [],
      //新增是否visible
      visibleAddNew: false,
      startDate: [],
      //查看是否visible
      addNewModelConfig: {
        width: "950px",
        title: "月度生产运行计划",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      form: { pageIndex: 1, pageSize: 10, recordType: 2 },
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
          label: "审批中",
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
          align: "center",
        },
        {
          title: "计划时间",
          dataIndex: "planTime",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "气化外输量(万方)",
          dataIndex: "gasExportVolume",
          width: 150,
          align: "center",
          ellipsis: true,
        },
        {
          title: "槽车装车量(万方)",
          dataIndex: "tankCarExportVolume",
          width: 150,
          align: "center",
          ellipsis: true,
        },
        {
          title: "卸货量(万方)",
          dataIndex: "unloadVolume",
          width: 150,
          align: "center",
          ellipsis: true,
        },
        {
          title: "装船(预留)",
          dataIndex: "shipLoad",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "编制人",
          dataIndex: "createdUser",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "编制时间",
          dataIndex: "createdDateTime",
          align: "center",
          width: 150,
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "statusName",
          align: "center",
          fixed: "right",
          ellipsis: true,
          width: 100,
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
      //回传组件
      echoMap: {},
      //页面下方表格的列属性
      monthplan: [
        {
          title: "日期",
          dataIndex: "",
          // width: 140,
        },
        {
          title: "气化外输量(万方)",
          dataIndex: "gasExportVolume",
          // width: 100,
        },
        {
          title: "槽车装车量(万方)",
          dataIndex: "tankCarExportVolume",
          // width: 100,
        },
        {
          title: "装船(预留)",
          dataIndex: "shipLoad",
          // width: 150,
        },
        {
          title: "卸货量(万方)",
          dataIndex: "unloadVolume",
          //   width: 200,
        },
      ],
      //表格中的数据
      dataSource: [],
      //新增界面
      addNewConfig: {
        otherConfigurations: [
          {
            type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
            label: "年度外输计划表", //展示名称
            slotScoped: "monthplan", //插槽
          },
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
            label: "取消",
            btnType: "back", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: "基础信息", //展示名称
            formKey: "data", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "165px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 24,
            scopedSlots: { customRender: "company" },
          },
          {
            type: "dateMonthPicker", //组件类型 目前指出 input || select
            label: "计划时间", //展示名称
            colSpan: 8,
            // monent:'value',
            format: "YYYY-MM",
            formKey: "planTime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "160px", height: "60px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              // multiple: true,
              vDecorator: {
                required: true,
                message: "请选择日期",
                // trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "datePicker", //组件类型 目前指出 input || select
            label: "编制时间", //展示名称
            format: "YYYY-MM-DD",
            formKey: "createdDateTime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编制人", //展示名称
            formKey: "createdUser", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编制部门", //展示名称
            formKey: "createUserSubsidiaryOrgan", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "card", //组件类型 目前指出 input || select
            label: "月度生产运行计划", //展示名称
            formKey: "data", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "165px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 24,
            scopedSlots: { customRender: "company" },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "计划外输量(万方)", //展示名称
            formKey: "planExportVolume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入计划外输量", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入计划外输量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "气化外输量(万方)", //展示名称
            formKey: "gasExportVolume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入气化外输量", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入气化外输量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "槽车外输量(万方)", //展示名称
            formKey: "tankCarExportVolume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入槽车外输量", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入槽车外输量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "装船(预留)", //展示名称
            formKey: "shipLoad", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入装船", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              //   vDecorator: {
              //     required: true,
              //     message: "请输入槽车外输量",
              //     trigger: "blur",
              //   }, //校验规则
            },
            colSpan: 12,
          },
        ],
      },
    };
  },
  watch: {
    AnnualDataPlanTime(val) {
      console.log("val", val);
      this.AnnualData.planTime = val;
      this.monthChange(val);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    ChangeAnnualDataPanTime(e) {
      let row = this.dataSource.filter((item) => item.planTime == e);
      if (row.length > 0) {
        this.ChangeAnnualDataPanTimeShow = false;
        this.$message.warning("已存在当前月份");
      } else {
        this.ChangeAnnualDataPanTimeShow = true;
      }
    },
    handleCancel() {
      this.visibleAddNew = false;
      this.AnnualDataPlanTime = "";
      this.$nextTick(() => {
        this.IDs = "";
        let dom = document.getElementById("addContent");
        if (dom !== null) {
          dom.scrollTop = 0;
        }
      });
      this.$refs.securityCheckFormRef.clearValidate();
    },
    // 提交
    CSubmit(id, createdDateTimes) {
      this.AnnualData.recordType = 2;
      this.AnnualData.id = id ? id : this.AnnualData.id;
      this.AnnualData.createdDateTime = createdDateTimes
        ? createdDateTimes
        : this.AnnualData.createdDateTime;
      submitForAddOrUpdate(this.AnnualData).then((res) => {
        if (res.code == "200") {
          this.$message.success("提交成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("提交失败");
        }
      });
    },
    // 审批
    approvalCommit() {
      let params = {
        id: this.AnnualData.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      };
      monthPlanAudio(params).then((res) => {
        if (res.body == "true") {
          this.$message.success("审批成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("审批失败");
        }
      });
    },
    calculation() {
      let totalPrice = 0;
      let totalPrice2 = 0;
      let totalPrice3 = 0;
      let totalPrice4 = 0;
      let Subtotal = this.monthPlanList.length;
      for (let i = 0; i < this.monthPlanList.length; i++) {
        // 小计的计算
        if (this.monthPlanList[i].planDay != "小计") {
          if (this.monthPlanList[i].gasExportVolume) {
            totalPrice += new Number(this.monthPlanList[i].gasExportVolume);
            this.monthPlanList[Subtotal - 1].gasExportVolume =
              parseFloat(totalPrice).toFixed(2); //保留后两位
          } else {
            if (!totalPrice) {
              this.monthPlanList[Subtotal - 1].gasExportVolume = "";
            }
          }
          if (this.monthPlanList[i].tankCarInVolume) {
            totalPrice2 += new Number(this.monthPlanList[i].tankCarInVolume);
            this.monthPlanList[Subtotal - 1].tankCarInVolume =
              parseFloat(totalPrice2).toFixed(2); //保留后两位
          } else {
            if (!totalPrice2) {
              this.monthPlanList[Subtotal - 1].tankCarInVolume = "";
            }
          }
          if (this.monthPlanList[i].shipLoad) {
            totalPrice3 += new Number(this.monthPlanList[i].shipLoad);
            this.monthPlanList[Subtotal - 1].shipLoad =
              parseFloat(totalPrice3).toFixed(2); //保留后两位
          } else {
            if (!totalPrice3) {
              this.monthPlanList[Subtotal - 1].shipLoad = "";
            }
          }
          if (this.monthPlanList[i].unloadVolume) {
            totalPrice4 += new Number(this.monthPlanList[i].unloadVolume);
            this.monthPlanList[Subtotal - 1].unloadVolume =
              parseFloat(totalPrice4).toFixed(2); //保留后两位
            this.AnnualData.unloadVolume =
              this.monthPlanList[Subtotal - 1].unloadVolume;
          } else {
            if (!totalPrice4) {
              this.monthPlanList[Subtotal - 1].unloadVolume = "";
              this.AnnualData.unloadVolume = "";
            }
          }
        }
      }
    },
    //点击表格中审批按钮
    approvalClick(val) {
      this.look(val);
      this.pageType = "approval";
    },
    // 新增
    addNew() {
      this.pageType = "add";
      this.details = false;
      this.preservationBC = true;
      this.AnnualData = {};
      this.monthPlanList = [];
      this.ApprovalLC = false;
      this.addNewModelConfig.title = "月度生产运行计划-新增";
      this.visibleAddNew = true;
      this.addNewConfig.otherConfigurations[1].disabled = false;
      this.addNewConfig.formDataList[1].disabled = false;
      this.AnnualData.createdUser = this.$store.state.user.name;
      this.AnnualData.createUserSubsidiaryOrgan =
        this.$store.state.user.unitName;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      this.AnnualData.createdDateTime = yy + "-" + mm + "-" + dd;
      this.$forceUpdate();
    },
    // 编制
    edit(value) {
      this.pageType = "edit";
      this.details = false;
      this.preservationBC = true;
      this.ApprovalLC = false;
      this.addNewModelConfig.title = "月度生产运行计划-编辑";
      this.monthChange(value.planTime);
      this.visibleAddNew = true;
      let obj2 = JSON.parse(JSON.stringify(value));
      this.AnnualData = obj2;
      this.AnnualDataPlanTime = this.AnnualData.planTime;
      let type = {
        id: value.id,
        type: value.recordType,
      };
      queryDetailById(type).then((res) => {
        this.monthPlanList = [];
        this.monthPlanList = res.body.monthPlanList;
      });
      this.addNewConfig.otherConfigurations[1].disabled = false;
      this.addNewConfig.formDataList[1].disabled = false;
    },
    // 详情
    look(value) {
      this.pageType = "look";
      this.details = true;
      this.preservationBC = false;
      this.ApprovalLC = false;
      this.addNewModelConfig.title = "月度生产运行计划-详情";
      this.visibleAddNew = true;
      let obj2 = JSON.parse(JSON.stringify(value));
      this.AnnualData = obj2;
      this.$nextTick(() => {
        this.IDs = obj2.id;
      });
      this.AnnualDataPlanTime = this.AnnualData.planTime;
      this.monthChange(value.planTime);
      this.addNewConfig.otherConfigurations[1].disabled = true;
      this.addNewConfig.formDataList[1].disabled = true;
      let type = {
        id: value.id,
        type: value.recordType,
      };
      queryDetailById(type).then((res) => {
        this.monthPlanList = res.body.monthPlanList;
      });
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
    // 删除
    mydelete() {
      deleteBatchForMonth(this.selectedRowKeys).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getList();
        }
      });
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.status !== "1" && record.status !== "5",
        },
      };
    },
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageIndex = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //获取表格列表
    getList() {
      pageList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
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
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    //日期的
    onChange(value, mode) {
      this.startDate = value;
      this.mode2 = [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1],
      ];
      this.form.dateStart = this.formatDate(
        new Date(this.startDate[0]),
        "yyyy-MM"
      );
      this.form.dateEnd = this.formatDate(
        new Date(this.startDate[1]),
        "yyyy-MM"
      );
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
    saveList(value) {
      this.pageType = "save";

      if (this.ChangeAnnualDataPanTimeShow) {
        var formData = new FormData();
        formData.append("recordType", 2);
        formData.append("planTime", this.AnnualData.planTime);
        // formData.append("createdDateTime", this.AnnualData.createdDateTime);
        formData.append("createdUser", this.AnnualData.createdUser);
        formData.append(
          "createUserSubsidiaryOrgan",
          this.AnnualData.createUserSubsidiaryOrgan
        );
        formData.append(
          "planExportVolume",
          this.AnnualData.planExportVolume == undefined
            ? ""
            : this.AnnualData.planExportVolume
        );
        formData.append(
          "gasExportVolume",
          this.AnnualData.gasExportVolume == undefined
            ? ""
            : this.AnnualData.gasExportVolume
        );
        formData.append(
          "tankCarExportVolume",
          this.AnnualData.tankCarExportVolume == undefined
            ? ""
            : this.AnnualData.tankCarExportVolume
        );
        formData.append(
          "shipLoad",
          this.AnnualData.shipLoad == undefined ? "" : this.AnnualData.shipLoad
        );
        formData.append(
          "unloadVolume",
          this.AnnualData.unloadVolume == undefined
            ? ""
            : this.AnnualData.unloadVolume
        );
        console.log("2", 22);
        this.monthPlanList.forEach((item, i) => {
          console.log("item", item);
          formData.append(`monthPlanList[${i}].id`, item.id ? item.id : "");
          if (item.planDay) {
            formData.append(`monthPlanList[${i}].planDay`, item.planDay);
          } else {
            formData.append(`monthPlanList[${i}].planDay`, "");
          }
          if (
            item.gasExportVolume == null ||
            item.gasExportVolume == undefined
          ) {
            item.gasExportVolume = 0;
          }
          item.gasExportVolume = new Number(item.gasExportVolume);
          if (item.gasExportVolume) {
            formData.append(
              `monthPlanList[${i}].gasExportVolume`,
              item.gasExportVolume
            );
          } else {
            formData.append(`monthPlanList[${i}].gasExportVolume`, "");
          }
          if (
            item.tankCarInVolume == null ||
            item.tankCarInVolume == undefined
          ) {
            item.tankCarInVolume = 0;
          }
          item.tankCarInVolume = new Number(item.tankCarInVolume);
          if (item.tankCarInVolume) {
            formData.append(
              `monthPlanList[${i}].tankCarInVolume`,
              item.tankCarInVolume
            );
          } else {
            formData.append(`monthPlanList[${i}].tankCarInVolume`, "");
          }
          if (item.shipLoad == null || item.shipLoad == undefined) {
            item.shipLoad = 0;
          }
          item.shipLoad = new Number(item.shipLoad);
          if (item.shipLoad) {
            formData.append(`monthPlanList[${i}].shipLoad`, item.shipLoad);
          } else {
            formData.append(`monthPlanList[${i}].shipLoad`, "");
          }
          if (item.unloadVolume == null || item.unloadVolume == undefined) {
            item.unloadVolume = 0;
          }
          item.unloadVolume = new Number(item.unloadVolume);
          if (item.unloadVolume) {
            formData.append(
              `monthPlanList[${i}].unloadVolume`,
              item.unloadVolume
            );
          } else {
            formData.append(`monthPlanList[${i}].unloadVolume`, "");
          }
        });
        if (this.AnnualData.id) {
          formData.append("id", this.AnnualData.id);
          // 修改
          saveForAddOrUpdate(formData).then((res) => {
            if (res.code == 200) {
              if (value == "sunmit") {
                this.CSubmit();
              } else {
                this.$message.success("修改成功！");
                this.getList();
                this.handleCancel();
              }
            } else {
              if (value == "sunmit") {
                this.$message.error("提交失败！");
              } else {
                this.$message.error("修改失败！");
              }
            }
          });
        } else {
          // 新增
          saveForAddOrUpdate(formData).then((res) => {
            console.log("res", res.body);
            if (res.code == 200) {
              if (value == "sunmit") {
                let date = new Date();
                let createdDateTimes = `${date.getFullYear()}-${
                  date.getMonth() + 1 < 10
                    ? `0${date.getMonth() + 1}`
                    : date.getMonth() + 1
                }-${
                  date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
                } ${
                  date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
                }:${
                  date.getMinutes() < 10
                    ? `0${date.getMinutes()}`
                    : date.getMinutes()
                }:${
                  date.getSeconds() < 10
                    ? `0${date.getSeconds()}`
                    : date.getSeconds()
                }`;
                this.CSubmit(res.body, createdDateTimes);
              } else {
                this.$message.success("保存成功！");
                this.getList();
                this.handleCancel();
              }
            } else {
              if (value == "sunmit") {
                this.$message.error("提交失败！");
              } else {
                this.$message.error("保存失败！");
              }
            }
          });
        }
      } else {
        this.$message.warning("已存在当前月份");
      }
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    back() {},
    monthChange(val) {
      if (val) {
        let plan = {
          planTime: val,
        };
        queryYearDataByTime(plan).then((res) => {
          if (res.body) {
            let planExportVolume =
              parseInt(res.body.gasExportVolume) +
              parseInt(res.body.tankCarExportVolume) +
              parseInt(res.body.shipLoad);
            this.AnnualData.shipLoad = res.body.shipLoad;
            this.AnnualData.tankCarExportVolume = res.body.tankCarExportVolume;
            this.AnnualData.gasExportVolume = res.body.gasExportVolume;
            this.AnnualData.planExportVolume = planExportVolume;
            this.$forceUpdate();
          }
        });
        this.monthPlanList = [];
        this.date = val;
        let num = this.date.split("-");
        var endOfMonth = new Date(num[0], num[1], 0).getDate();

        for (var i = 0; i <= endOfMonth; i++) {
          if (i > 0) {
            this.monthPlanList.push({ planDay: i });
          }
        }
        this.monthPlanList.push({ planDay: "小计", gasExportVolume: "" });
      } else {
        this.monthPlanList = [];
        this.AnnualData.shipLoad = "";
        this.AnnualData.tankCarExportVolume = "";
        this.AnnualData.gasExportVolume = "";
        this.AnnualData.planExportVolume = "";
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
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}
.grey {
  background: #f3f5f8;
  /deep/.ant-input {
    background: #f3f5f8;
    border: 1px solid #f3f5f8;
  }
}
.table_list {
  text-align: center;
  tr {
    line-height: 36px;
    th {
      border-bottom: none;
      border-top: 1px solid #000;
    }
    th:nth-child(1) {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
    }
    th + th {
      border-right: 1px solid #000;
      // border-right: none;
    }
  }
}
</style>