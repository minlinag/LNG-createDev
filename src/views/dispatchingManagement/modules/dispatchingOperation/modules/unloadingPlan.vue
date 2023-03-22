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
        ]"
        @addNew="addClick"
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
                  label="船舶名称"
                >
                  <a-input
                    v-model="searchForm.shipName"
                    placeholder="请输入船舶名称"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="预计到港时间"
                >
                  <a-row :gutter="24">
                    <a-col :span="10">
                      <a-date-picker
                        @change="judgeTransferDate"
                        value-format="yyyy-MM-DD"
                        v-model="searchForm.arrivalDateStart"
                      />
                    </a-col>
                    <a-col :span="2" style="padding-left: 0px"> —— </a-col>
                    <a-col :span="10">
                      <a-date-picker
                        @change="judgeTransferDate"
                        value-format="yyyy-MM-DD"
                        v-model="searchForm.arrivalDateEnd"
                      />
                    </a-col>
                  </a-row>
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
      <dc-table
        class="list_table_1"
        :scroll="{ y: 1, x: 100 }"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
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
          ></pe-button>
        </template>
      </dc-table>
      <!-- 新增编辑详情弹窗 -->
      <dc-Model v-model="visible" :modelConfig="modelConfig" class="DcModel">
        <a-layout>
          <a-layout-content>
            <!--基础信息表单部分-->
            <div>
              <a-divider orientation="left">基础信息</a-divider>
              <a-form :form="infoForm">
                <a-row :gutter="24">
                  <a-form-item label="编号" v-show="false">
                    <a-input v-decorator="['id']" />
                  </a-form-item>
                  <div class="buttonInput">
                    <a-col :span="8">
                      <a-form-item
                        label="船舶名称"
                        :labelCol="{ style: 'width: 150px' }"
                      >
                        <a-input
                          style="width: 110px"
                          disabled
                          v-decorator="[
                            'shipName',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择船舶',
                                },
                              ],
                            },
                          ]"
                          placeholder="请选择船舶"
                        />
                        <a-button
                          class="buttonType"
                          type="primary"
                          :disabled="pageType === 'look'"
                          @click.stop="selectShipClick()"
                        >
                          选择
                        </a-button>
                      </a-form-item>
                    </a-col>
                  </div>
                  <a-col :span="8">
                    <a-form-item
                      label="船期计划编号"
                      :labelCol="{ style: 'width: 150px' }"
                    >
                      <a-input
                        disabled
                        v-decorator="['planCode']"
                        placeholder="（自动带入）"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="8">
                    <a-form-item
                      label="装港港口"
                      :labelCol="{ style: 'width: 150px' }"
                    >
                      <a-input
                        disabled
                        v-decorator="['loadingPort']"
                        placeholder="（自动带入）"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="预计到港时间"
                      :labelCol="{ style: 'width: 150px' }"
                    >
                      <a-input
                        disabled
                        v-decorator="['arrivalDate']"
                        placeholder="（自动带入）"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="8">
                    <a-form-item
                      label="预计卸货量"
                      :labelCol="{ style: 'width: 150px' }"
                    >
                      <a-input
                        disabled
                        v-decorator="['predictQuantity']"
                        placeholder="（自动带入）"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="密度"
                      :labelCol="{ style: 'width: 150px' }"
                    >
                      <a-input
                        disabled
                        v-decorator="['density']"
                        placeholder="（自动带入）"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="8">
                    <a-form-item
                      label="编制人"
                      :labelCol="{ style: 'width: 150px' }"
                    >
                      <a-input
                        disabled
                        v-decorator="['createdUser']"
                        placeholder="（自动带入）"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="编制时间"
                      :labelCol="{ style: 'width: 150px' }"
                    >
                      <a-input
                        disabled
                        v-decorator="['createdDateTime']"
                        placeholder="（自动带入）"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <!--卸船储罐规划部分-->
            <div>
              <a-divider orientation="left">卸船储罐规划</a-divider>
              <a-form-model :layout="'inline'">
                <a-row class="otherForm">
                  <a-col :span="8">
                    <!-- :disabled="pageType === 'look'" -->
                    <a-radio-group
                      v-model="modelCheck"
                      button-style="solid"
                      @change="radioChange"
                    >
                      <a-radio-button value="1">液位安全模式</a-radio-button>
                      <a-radio-button value="2">经济节能模式</a-radio-button>
                    </a-radio-group>
                  </a-col>
                  <a-col :span="9">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="上次排罐时间:"
                    >
                      <a-date-picker
                        show-time
                        disabled
                        v-model="dischargeTime"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <a-button
                        v-Query
                        :disabled="pageType === 'look'"
                        class="buttonType"
                        type="primary"
                        @click.stop="renewClick()"
                      >
                        一键更新
                      </a-button>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
              <dc-table
                class="list_table_1"
                :scroll="{ y: 1, x: 100 }"
                rowKey="id"
                :columns="detailsColumns"
                :dataSource="detailsDataSource"
                :pagination="false"
              >
              </dc-table>
              <a-row class="otherForm">
                <a-col :span="24">
                  <a-form-model-item label="卸船方案上传:">
                    <file-upload
                      :Text="'上传文件'"
                      :accept="'image/*'"
                      @fileChange="fileChange"
                      :fileType="'pdf,jpg,png'"
                      :fileQuantity="1"
                      :disabled="pageType != 'add' && pageType != 'edit'"
                    ></file-upload>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-layout-content>
          <a-layout-footer>
            <a-button
              class="buttonType"
              type="primary"
              v-if="pageType != 'look'"
              @click.stop="saveClick()"
            >
              保存
            </a-button>
            <a-button class="buttonType" @click.stop="visible = false">
              取消
            </a-button>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
      <!-- 选择船舶弹窗 -->
      <dc-Model
        v-model="shipVisible"
        :modelConfig="shipModelConfig"
        class="from-style middleModel"
      >
        <dc-table
          rowKey="id"
          :scroll="{ x: 100 }"
          :row-selection="{
            selectedRowKeys: shipSelectedRowKeys,
            onChange: shipSelectChange,
          }"
          :columns="shipColumns"
          :dataSource="shipDataSource"
          :pagination="shipPagination"
        >
        </dc-table>
        <div class="ant-modal-footer">
          <a-button class="buttonType" type="primary" @click.stop="handleOk()">
            确定
          </a-button>
          <a-button class="buttonType" @click.stop="shipVisible = false">
            取消
          </a-button>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  getShipPlanList,
  addList,
  getListByPlanNo,
} from "@/api/dispatchingManagement/unloadingPlan.js";

import fileUpload from "@/components/upLoad/fileUpload";

export default {
  components: { fileUpload },

  data() {
    return {
      fileLists: [],
      pageType: "",
      infoForm: this.$form.createForm(this),
      visible: false,
      shipVisible: false,
      shipModelConfig: {
        width: "600px",
        title: "船舶信息",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfig: {
        width: "950px",
        title: "卸船计划",
        cancelText: false,
        footer: "", //是否展示页脚
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
      //翻页页面组件
      shipPagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      //查询所需的数据
      shipSearchForm: {
        pageSize: 10,
        pageIndex: 1,
      },
      //勾选框/选择框组件
      selectedRowKeys: [],

      shipSelectedRowKeys: [],
      //查询所需的数据
      searchForm: {
        pageSize: 10,
        pageIndex: 1,
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
          align: "center",
          width: 70,
        },
        {
          title: "船舶名称",
          dataIndex: "shipName",
          align: "center",
          width: 150,
        },
        {
          title: "装港港口",
          dataIndex: "loadingPort",
          align: "center",
          width: 150,
        },
        {
          title: "预计到港时间",
          dataIndex: "arrivalDate",
          align: "center",
          width: 150,
        },
        {
          title: "预计卸载量",
          dataIndex: "predictQuantity",
          align: "center",
          width: 150,
        },
        {
          title: "密度",
          dataIndex: "density",
          align: "center",
          width: 200,
        },

        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          align: "center",
          width: 150,
          fixed: "right",
        },
      ],
      //表格中的数据
      dataSource: [{ id: "1", density: "" }],
      detailsColumns: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: 5,
          align: "center",
        },
        {
          title: "储罐",
          dataIndex: "tankName",
          width: 7,
          align: "center",
        },
        {
          title: "当前平均密度",
          dataIndex: "currentAverageDensity",
          width: 10,
          align: "center",
        },
        {
          title: "预计到港日液位",
          dataIndex: "estimatedLiquidLevel",
          width: 10,
          align: "center",
        },
        {
          title: "建议进料方式",
          dataIndex: "suggestedFeedingMode",
          width: 10,
          align: "center",
        },
        {
          title: "建议卸载量",
          dataIndex: "recommendUnloadingAmount",
          width: 10,
          align: "center",
        },
        {
          title: "预计卸船后液位",
          dataIndex: "estimatedLevelAfterUnloading",
          width: 10,
          align: "center",
        },
        {
          title: "安全液位最大卸载量",
          dataIndex: "maximumUnloadingCapacity",
          width: 15,
          align: "center",
        },
      ],
      detailsDataSource_bak: [
        {
          id: 1,
          tankName: "T-6201",
          currentAverageDensity: "432.53",
          estimatedLiquidLevel: "20.38",
          suggestedFeedingMode: "",
          recommendUnloadingAmount: "63329",
          estimatedLevelAfterUnloading: "30.87",
          maximumUnloadingCapacity: "80000",
        },
        {
          id: 2,
          tankName: "T-6202",
          currentAverageDensity: "435.4782",
          estimatedLiquidLevel: "19.87",
          suggestedFeedingMode: "",
          recommendUnloadingAmount: "114470",
          estimatedLevelAfterUnloading: "32.45",
          maximumUnloadingCapacity: "120000",
        },
        {
          id: 3,
          tankName: "T-6203",
          currentAverageDensity: "420.56",
          estimatedLiquidLevel: "22.26",
          suggestedFeedingMode: "",
          recommendUnloadingAmount: "113135",
          estimatedLevelAfterUnloading: "33.56",
          maximumUnloadingCapacity: "120000",
        },
        {
          id: 4,
          tankName: "T-6204",
          currentAverageDensity: "437.93",
          estimatedLiquidLevel: "30.12",
          suggestedFeedingMode: "",
          recommendUnloadingAmount: "64015",
          estimatedLevelAfterUnloading: "36.65",
          maximumUnloadingCapacity: "80000",
        },
        {
          id: 5,
          tankName: "T-6205",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 6,
          tankName: "T-6206",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 7,
          tankName: "T-6207",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 8,
          tankName: "T-6208",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 9,
          tankName: "T-6209",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 10,
          tankName: "T-6210",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
      ],
      detailsDataSource: [
        {
          id: 1,
          tankName: "T-6201",
          currentAverageDensity: "432.53",
          estimatedLiquidLevel: "20.38",
          suggestedFeedingMode: "",
          recommendUnloadingAmount: "63329",
          estimatedLevelAfterUnloading: "30.87",
          maximumUnloadingCapacity: "80000",
        },
        {
          id: 2,
          tankName: "T-6202",
          currentAverageDensity: "435.4782",
          estimatedLiquidLevel: "19.87",
          suggestedFeedingMode: "",
          recommendUnloadingAmount: "114470",
          estimatedLevelAfterUnloading: "32.45",
          maximumUnloadingCapacity: "120000",
        },
        {
          id: 3,
          tankName: "T-6203",
          currentAverageDensity: "420.56",
          estimatedLiquidLevel: "22.26",
          suggestedFeedingMode: "",
          recommendUnloadingAmount: "113135",
          estimatedLevelAfterUnloading: "33.56",
          maximumUnloadingCapacity: "120000",
        },
        {
          id: 4,
          tankName: "T-6204",
          currentAverageDensity: "437.93",
          estimatedLiquidLevel: "30.12",
          suggestedFeedingMode: "",
          recommendUnloadingAmount: "64015",
          estimatedLevelAfterUnloading: "36.65",
          maximumUnloadingCapacity: "80000",
        },
        {
          id: 5,
          tankName: "T-6205",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 6,
          tankName: "T-6206",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 7,
          tankName: "T-6207",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 8,
          tankName: "T-6208",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 9,
          tankName: "T-6209",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
        {
          id: 10,
          tankName: "T-6210",
          currentAverageDensity: "--",
          estimatedLiquidLevel: "--",
          suggestedFeedingMode: "--",
          recommendUnloadingAmount: "--",
          estimatedLevelAfterUnloading: "--",
          maximumUnloadingCapacity: "--",
          st: "未投产",
        },
      ],
      shipColumns: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: 30,
          align: "center",
        },
        {
          title: "船期计划编号",
          dataIndex: "planCode",
          width: 100,
          align: "center",
        },
        {
          title: "船舶名称",
          dataIndex: "shipName",
          width: 100,
          align: "center",
        },
        {
          title: "预计到港时间",
          dataIndex: "arrivalDate",
          width: 70,
          align: "center",
        },
        {
          title: "预计卸载量",
          dataIndex: "predictQuantity",
          width: 70,
          align: "center",
        },
        {
          title: "装港港口",
          dataIndex: "loadingPort",
          width: 80,
          align: "center",
        },
      ],
      shipDataSource: [],
      //模式默认选择第一个
      modelCheck: "1",
      dischargeTime: "2022-12-01 12:30:00",
      infoFormConfig: {
        formDataList: [
          {
            type: "select", //组件类型 目前指出 input || select
            showSearch: true,
            optionFilterProp: "children",
            label: "船舶名称", //展示名称
            colSpan: 12,
            formKey: "shipName", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            optionData: [],
            options: {
              // 暂时开发状态
              // vDecorator: {
              //   required: true,
              //   message: "请输入月报类型",
              //   trigger: "change",
              // }, //校验规
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "卸船计划编号", //展示名称
            colSpan: 12,
            formKey: "planCode", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "自动带入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "装港港口", //展示名称
            formKey: "loadingPort", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "自动带入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            colSpan: 12,
            options: {
              // 暂时开发状态
              multiple: true,
              /* vDecorator: {
                required: true,
                message: "请输入检修计划编码",
                trigger: "blur",
              }, */ //校验规
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "预计到港时间", //展示名称
            colSpan: 12,
            formKey: "arrivalDate", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "自动带入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              // vDecorator: {
              //   required: true,
              //   message: "请输入编号",
              //   trigger: "blur",
              // }, //校验规
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "预计卸载量", //展示名称
            colSpan: 12,
            formKey: "predictQuantity", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "自动带入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // // 暂时开发状态
              // vDecorator: {
              //   required: true,
              //   message: "请输入编号",
              //   trigger: "blur",
              // }, //校验规
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "密度", //展示名称
            colSpan: 12,
            formKey: "density", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "自动带入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              // vDecorator: {
              //   required: true,
              //   message: "请输入编号",
              //   trigger: "blur",
              // }, //校验规
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编制人", //展示名称
            colSpan: 12,
            formKey: "spbm", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "自动带入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              // vDecorator: {
              //   required: true,
              //   message: "请输入编号",
              //   trigger: "blur",
              // }, //校验规
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编制时间", //展示名称
            colSpan: 12,
            formKey: "remark", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "自动带入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              // vDecorator: {
              //   required: true,
              //   message: "请输入编号",
              //   trigger: "blur",
              // }, //校验规
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    selectShipClick() {
      this.shipVisible = true;
      // this.shipSearchForm.shipName = this.infoForm.getFieldValue("shipName");
      getShipPlanList(this.shipSearchForm).then((res) => {
        if (res.code == "200") {
          this.shipDataSource = res.body.data;
        }
        this.shipPagination.current = res.body.pageIndex;
        this.shipPagination.pageSize = res.body.pageSize;
        this.shipPagination.total = res.body.total;
      });
    },
    //获得当前页面
    getList() {
      getList(this.searchForm).then((res) => {
        if (res.code == "200") {
          this.dataSource = res.body.data;
        }
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
    },
    //模式切换
    radioChange(e) {
      let type = "";
      //液位安全模式
      if (e.target.value == "1") {
        type = "";
      }
      //经济节能模式
      else {
        type = "";
      }
      console.log(type);
      //TODO调接口
    },

    //一键更新按钮
    renewClick() {
      //上次排灌时间改为当前日期
      //更新表格数据   TODO
    },

    //保存
    saveClick() {
      //验证文本框内容是否合规
      this.infoForm.validateFields((err, values) => {
        if (!err) {
          this.detailsDataSource.forEach((item) => {
            item.mode = this.modelCheck;
            item.planNo = values.planCode;
            delete item.id;
          });
          addList(this.detailsDataSource).then((res) => {
            if (res.code == "200") {
              this.$message.success("保存成功！");
              this.visible = false;
              // this.
            } else {
              this.$message.error("保存失败");
            }
          });
        }
      });
    },

    //
    handleOk() {
      if (this.shipSelect) {
        //根据密度计算表格进料方式
        if (this.shipSelect.density) {
          this.detailsDataSource.forEach((item) => {
            if (item.currentAverageDensity != "--") {
              if (this.shipSelect.density - item.currentAverageDensity >= 0.5) {
                item.suggestedFeedingMode = "顶进料";
              } else {
                item.suggestedFeedingMode = "底进料";
              }
            }
          });
        }
        //带入表单值
        this.infoForm.setFieldsValue({
          shipName: this.shipSelect.shipName,
          planCode: this.shipSelect.planCode,
          loadingPort: this.shipSelect.loadingPort,
          arrivalDate: this.shipSelect.arrivalDate,
          predictQuantity: this.shipSelect.predictQuantity,
          density: this.shipSelect.density,
        });
        this.shipVisible = false;
      } else {
        this.$message.warning("请选择船舶");
      }
    },

    //判断日期
    judgeTransferDate() {
      if (this.searchForm.arrivalDateStart > this.searchForm.arrivalDateEnd) {
        this.$message.warning("开始日期大于结束日期,请重新选择");
      }
    },

    //表格多选框改变触发
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },

    // 单选
    shipSelectChange(selectedRowKeys, selectedRows) {
      this.shipSelectedRowKeys = [selectedRowKeys[selectedRowKeys.length - 1]];
      this.shipSelect = selectedRows ? selectedRows[0] : null;
    },

    //点击新增，跳转操作页
    addClick() {
      this.modelConfig.title = "卸船计划-新增";

      this.pageType = "add";
      this.fileLists = [];
      //重置表格数据  TODO需要改成接口调用
      this.detailsDataSource = JSON.parse(
        JSON.stringify(this.detailsDataSource_bak)
      );

      this.pageType = "add";
      this.visible = true;
      //清空表单
      this.infoForm.resetFields();
      this.$nextTick(() => {
        this.infoForm.setFieldsValue({
          createdUser: this.$store.state.user.name,
          createdDateTime: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
        });
      });
    },

    fileChange(val) {
      this.fileLists = val;
    },

    //点击编辑，跳转到操作页
    editClick(value) {
      this.pageType = "edit";
      this.modelConfig.title = "卸船计划-编辑";
      this.visible = true;
      this.fileLists = [];

      this.$nextTick(() => {
        this.infoForm.setFieldsValue({
          shipName: value.shipName,
          planCode: value.planCode,
          loadingPort: value.loadingPort,
          arrivalDate: value.arrivalDate,
          predictQuantity: value.predictQuantity,
          density: value.density,
          createdUser: value.createdUser,
          createdDateTime: value.createdDateTime,
        });
      });
      this.getListByPlanNo(value.planCode);
    },

    //点击查看，跳转到操作页
    lookClick(value) {
      this.pageType = "look";
      this.modelConfig.title = "卸船计划-详情";
      this.visible = true;
      this.infoForm.resetFields();

      this.$nextTick(() => {
        this.infoForm.setFieldsValue({
          shipName: value.shipName,
          planCode: value.planCode,
          loadingPort: value.loadingPort,
          arrivalDate: value.arrivalDate,
          predictQuantity: value.predictQuantity,
          density: value.density,
          createdUser: value.createdUser,
          createdDateTime: value.createdDateTime,
        });
      });
      this.getListByPlanNo(value.planCode);
    },

    getListByPlanNo(planCode) {
      //查询子表
      let params = {
        pageNum: "1",
        pageSize: "9999",
        planNo: planCode,
      };
      getListByPlanNo(params).then((res) => {
        if (res.code == "200") {
          let data = res.body.data;
          if (data != null && data.length > 0) {
            this.modelCheck = data[0].mode;
            this.detailsDataSource = data;
          }
        } else {
          this.$message.error("保存失败");
        }
      });
    },

    //删除操作
    deleteOperation() {
      if (this.selectedRowKeys == "") {
        this.this.$message.warning("请选择！");
      } else {
        delete this.selectedRowKeys.then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功！");
            this.getList();
          } else {
            this.this.$message.error("删除失败！");
          }
        });
      }
      //清空表格多选框
      this.selectedRowKeys = [];
    },

    //查询功能
    searchClick() {
      if (this.searchForm) {
        this.searchForm.pageIndex = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.searchForm.pageIndex = pagination.current;
      this.searchForm.pageSize = pagination.pageSize;
      this.getList();
    },

    //重置输入
    resetClick() {
      this.searchForm = {};
      this.searchForm.pageIndex = 1;
      this.searchForm.pageSize = 10;
      this.getList();
    },

    // 点击确定删除
    deleteClick() {
      this.deleteOperation();
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
