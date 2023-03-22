<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'add' },
            { value: 'Delete', clickName: 'headDelete' },
          ]"
          @add="add"
          @headDelete="headDelete"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width:100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="queryForm">
              <a-col :span="12">
                <a-form-model-item
                  label="作业日期:"
                  :labelCol="{ style: 'width: 120px' }"
                >
                  <a-range-picker
                    v-model="workDate"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="编码"
                >
                  <a-input
                    v-model="queryForm.coding"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="作业类型"
                >
                  <a-select
                    v-model="workTypeOut"
                    show-search
                    mode="multiple"
                    placeholder="请选择作业类型"
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      :value="province.dictcode"
                      v-for="(province, index) in dictSelect"
                      :key="index"
                    >
                      {{ province.dictname }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="作业单位"
                >
                  <a-select
                    v-model="queryForm.workUnit"
                    show-search
                    placeholder="请选择作业单位"
                    option-filter-prop="children"
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      :value="province.value"
                      v-for="(province, index) in company"
                      :key="index"
                    >
                      {{ province.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="作业地点"
                >
                  <a-input
                    v-model="queryForm.workPlace"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="分析组长"
                >
                  <a-input
                    v-model="queryForm.analysisGroupLeader"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="分析人员"
                >
                  <a-input
                    v-model="queryForm.analysisUser"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="作业内容"
                >
                  <a-input
                    v-model="queryForm.workContent"
                    placeholder="请输入"
                  ></a-input>
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
                </a-form-model-item>
              </a-col>
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <!-- 主页列表 -->
      <dc-table
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
                clickName: 'editJSA',
                icon: '',
                style: ['btn_link'],
                type: 'link',
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
            @editJSA="editJSA(row)"
            @look="look(row)"
          ></pe-button>
        </template>
      </dc-table>
      <!-- 新增表单 -->
      <dc-Model
        :width="'950px'"
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
      >
        <FormitemDemo
          ref="Form"
          :echoMap="echoMap"
          :layout="'inline'"
          :Config="addNewConfig"
          @save="saveList"
          @submit="submit"
          @print="print"
          @cancel="cancelJSA"
          v-if="visibleAddNew"
          @handleChange="formHandleChange"
        >
          <template slot="checkBox">
            <a-card style="width: 900px">
              <a-checkbox-group
                @change="onChangeCheckBox"
                :default-checked="isDefault"
              >
                <a-row>
                  <a-col :span="24">
                    <a-card title="个人劳保用品要求" :bordered="false">
                      <a-row :gutter="24">
                        <a-col :span="24">
                          <a-form-model-item :label-col="rowLabelCol">
                            <a-checkbox-group
                              @change="onChangeCheckBox"
                              :disabled="isDisabled"
                              v-model="toolsMaterialsObj.toolAndMaterialOne"
                            >
                              <a-checkbox
                                style="width:130px;margin: 0px;"
                                :value="item.value"
                                v-for="(item, index) in checkBoxOptions[
                                  '个人劳保用品要求'
                                ]"
                                :key="index"
                                >{{ item.label }}
                              </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-col>
                  <a-col :span="24">
                    <a-card title="所需设备及工具" :bordered="false">
                      <a-row :gutter="24">
                        <a-col :span="24">
                          <a-form-model-item :label-col="rowLabelCol">
                            <a-checkbox-group
                              @change="onChangeCheckBox"
                              :disabled="isDisabled"
                              v-model="toolsMaterialsObj.toolAndMaterialTwo"
                            >
                              <a-checkbox
                                style="width:130px;margin: 0px;"
                                :value="item.value"
                                v-for="(item, index) in checkBoxOptions[
                                  '所需设备及工具'
                                ]"
                                :key="index"
                                >{{ item.label }}
                              </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-col>
                  <a-col :span="24">
                    <a-card title="标牌与标识" :bordered="false">
                      <a-row :gutter="24">
                        <a-col :span="24">
                          <a-form-model-item :label-col="rowLabelCol">
                            <a-checkbox-group
                              @change="onChangeCheckBox"
                              :disabled="isDisabled"
                              v-model="toolsMaterialsObj.toolAndMaterialThree"
                            >
                              <a-checkbox
                                style="width:160px;margin: 0px;"
                                :value="item.value"
                                v-for="(item, index) in checkBoxOptions[
                                  '标牌与标识'
                                ]"
                                :key="index"
                                >{{ item.label }}
                              </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-col>
                  <a-col :span="24">
                    <a-card title="许可证与指导书" :bordered="false">
                      <a-row :gutter="24">
                        <a-col :span="24">
                          <a-form-model-item :label-col="rowLabelCol">
                            <a-checkbox-group
                              @change="onChangeCheckBox"
                              :disabled="isDisabled"
                              v-model="toolsMaterialsObj.toolAndMaterialFour"
                            >
                              <a-checkbox
                                style="width:130px;margin: 0px;"
                                :value="item.value"
                                v-for="(item, index) in checkBoxOptions[
                                  '许可证与指导书'
                                ]"
                                :key="index"
                                >{{ item.label }}
                              </a-checkbox>
                            </a-checkbox-group>
                          </a-form-model-item>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-card>
          </template>
          <template slot="table">
            <div>
              <a-card title="作业步骤" style="width: 900px">
                <div class="zybz-button">
                  <a
                    href="#"
                    @click="handleAdd"
                    style="margin-right:5px"
                    :default="isDefaultZYBZ"
                    :disabled="isDisabledZYBZ"
                    >编辑(手动输入)</a
                  >
                  <a
                    href="#"
                    @click="handleSelect"
                    style="margin-left:15px"
                    :default="isDefaultZYBZ"
                    :disabled="isDisabledZYBZ"
                    >从风险库选择</a
                  >
                </div>
                <a-table
                  :columns="columnsZYBZ"
                  :data-source="dataZYBZ"
                  bordered
                  ref="singleTable"
                  :loading="singleTableLoading"
                  singleTable
                  rowKey="id"
                >
                  <div
                    v-for="col in [
                      'riskDecompositionStructureName',
                      'hazardFactors',
                      'l',
                      'c',
                      'e',
                      'd',
                      'riskControls',
                    ]"
                    :key="col"
                    :slot="col"
                    slot-scope="text, record, index"
                  >
                    <a-input
                      v-if="record.editable"
                      style="margin: -5px 0"
                      :value="text"
                      @change="
                        (e) => handleChange(e.target.value, record.orderNo, col)
                      "
                    />
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                  <template
                    slot="operation"
                    slot-scope="text, record, index, row"
                  >
                    <div class="editable-row-operations">
                      <span v-if="record.editable">
                        <a @click="() => saveTab(record.orderNo)">保存</a>
                      </span>
                      <span v-else>
                        <a
                          :disabled="editingKey !== ''"
                          @click="() => edit(record.orderNo)"
                          v-if="record.workSteps == '1'"
                          >编辑(手动输入)</a
                        >
                        <a
                          :disabled="editingKey !== ''"
                          @click="() => selectfxjg(text, record, index, row)"
                          v-if="record.workSteps == '0'"
                          >从风险库中选择</a
                        >
                        <a
                          style="color:red"
                          :disabled="editingKey !== ''"
                          @click="() => deleteTAb(record.orderNo)"
                          >删除</a
                        >
                      </span>
                    </div>
                  </template>
                  <template slot="sort" slot-scope="text, record, index, row">
                    <a-icon
                      style="color: #1890ff; cursor: sn-resize;fontSize:20px"
                      type="drag"
                      class="move"
                    />
                  </template>
                </a-table>
              </a-card>
            </div>
          </template>
          <template slot="step">
            <a-collapse :defaultActiveKey="['1']">
              <template>
                <div class="step" v-if="seen">
                  <a-tabs default-active-key="1" @change="callback">
                    <a-tab-pane key="1" tab="审批记录">
                      <dc-table
                        :scroll="{ x: 100, y: 250 }"
                        :columns="columnsApproval"
                        :dataSource="dataSourceApproval"
                        rowKey="id"
                      >
                      </dc-table>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="全流程展示" force-render>
                      <div class="step">
                        <a-steps :current="stepConfiguration.stepProgress">
                          <a-step
                            v-for="(item, index) in stepConfiguration.stepList"
                            :key="index"
                          >
                            <template slot="title">
                              {{ item.title }}
                            </template>
                            <div slot="description" class="descriptionBox">
                              <div>{{ item.name }}</div>
                              <div>{{ item.dataTime }}</div>
                            </div>
                          </a-step>
                        </a-steps>
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                  <a-form-model :model="formQZMB" :label-col="{style:"width:100px"}">
                    <a-form-model-item label="签字面板" :span="24">
                      <a-input
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                        v-model="formQZMB.qualificationCertificate"
                        type="textarea"
                      />
                    </a-form-model-item>
                  </a-form-model>
                </div>
              </template>
            </a-collapse>
          </template>
        </FormitemDemo>
      </dc-Model>
      <!-- 查看风险结构 -->
      <dc-Model
        v-model="visibleFXJG"
        :modelConfig="modelConfigFXJG"
        v-if="visibleFXJG"
      >
        <dc-table
          :row-selection="{
            selectedRowKeys: selectedRowKeysFXJG,
            onChange: onSelectChangeFXJG,
            getCheckboxProps: getCheckboxPropsFXJG,
          }"
          rowKey="id"
          :scroll="{ x: 100 }"
          :columns="columnsFXJG"
          :dataSource="dataSourceFXJG"
          :openSelector="false"
        ></dc-table>
        <div class="btn">
          <a-button type="primary" @click="determine"> 确定 </a-button>
          <a-button @click="cancelRickTable">取消</a-button>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  jsaList,
  getCheckBox,
  jsaPost,
  jsaIdSelected,
  deleteJsa,
  jsaUpdate,
  jsaSubmit,
  jsaApproval,
  companySelect,
  selectRick,
} from "@/api/JSAAnalysis"
import { encode } from "@/api/dataDictionary"
import Sortable from "sortablejs"
const dataZYBZ = []
export default {
  data() {
    this.cacheData = dataZYBZ.map((item) => ({ ...item }))
    return {
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        )
      },
      toolsMaterialsObj: {
        toolAndMaterialOne: [],
        toolAndMaterialTwo: [],
        toolAndMaterialThree: [],
        toolAndMaterialFour: [],
      },
      formQZMB: {},
      currentDataId: "",
      otherDataId: [],
      dictSelect: [], //作业类型下拉框
      company: [], //外委单位下拉框
      checkBoxOptions: [],
      labelCol: { style: "width: 150px" },
      rowLabelCol: { style: "width: 100px" },
      dataZYBZ,
      seen: true,
      editingKey: "",
      stateInfo: [],
      // 默认是否选中，false默认值
      isDefault: false,
      // 是否禁用
      isDisabled: false,
      isDefaultZYBZ: false,
      isDisabledZYBZ: false,
      visibleCheck: false,
      selectedRowKeysFXJG: [],
      dataSourceFXJG: [],
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
      paginationZYBZ: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      paginationFXJG: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      paginationApproval: {
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
            `${(this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1}`,
          width: 50,
        },
        {
          title: "编码",
          dataIndex: "coding",
          width: 220,
          align: "center",
        },
        {
          title: "作业类型",
          dataIndex: "workType",
          width: 150,
          align: "center",
        },
        {
          title: "作业单位",
          dataIndex: "workUnit",
          width: 150,
          align: "center",
        },
        {
          title: "作业地点",
          dataIndex: "workPlace",
          width: 150,
          align: "center",
        },
        {
          title: "作业时间",
          dataIndex: "workDate",
          width: 150,
          align: "center",
        },
        {
          title: "分析组长",
          dataIndex: "analysisGroupLeader",
          width: 120,
          align: "center",
        },
        {
          title: "分析人员",
          dataIndex: "analysisUser",
          width: 220,
          align: "center",
        },
        {
          title: "作业内容",
          dataIndex: "workContent",
          width: 150,
          align: "center",
        },
        // {
        //   title: "所使用的工具和材料",
        //   dataIndex: "toolAndMaterial",
        //   width: 150,
        //   align: "center",
        // },
        // {
        //   title: "作业步骤",
        //   dataIndex: "step",
        //   width: 150,
        //   align: "center",
        // },
        {
          title: "状态",
          dataIndex: "recordStatus",
          width: 150,
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 120,
          fixed: "right",
        },
      ],
      //勾选框/选择框组件
      selectedRowKeys: [],
      //回传组件
      echoMap: {},
      //查看组件中的数值
      LookForm: {},
      workDate: [],
      workTypeOut: [],
      //查询所需的数据
      queryForm: {
        pageSize: 10,
        pageNum: 1,
        coding: "",
        workType: "",
        workUnit: "",
        workDateS: "",
        workDateE: "",
        workPlace: "",
        analysisGroupLeader: "",
        analysisUser: "",
        workContent: "",
        // toolAndMaterialOne:"",
        // toolAndMaterialTwo:"",
        // toolAndMaterialThree:"",
        // toolAndMaterialFour:"",
      },
      //新增是否visible
      visibleAddNew: false,
      //查看是否visible
      visibleLook: false,
      // 安全分解风险结构
      modelConfigFXJG: {
        width: "950px",
        title: "安全分解风险结构",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfigCheck: {
        width: "950px",
        title: "安全分解风险结构",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      visibleFXJG: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: "950px",
        title: "JSA分析-新增",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //详情的弹窗的相关设置
      lookModelConfig: {
        width: "950px",
        title: "JSA分析-详情",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      // 作业步骤
      columnsZYBZ: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.paginationZYBZ.current - 1) *
              this.paginationZYBZ.pageSize +
              index +
              1}`,
          width: 50,
        },
        {
          title: "作业步骤",
          dataIndex: "riskDecompositionStructureName",
          scopedSlots: { customRender: "riskDecompositionStructureName" },
          // scopedSlots: { customRender: "select" },
          // scopedSlots: { customRender: "step" },
        },
        // riskDecompositionStructureName
        {
          title: "危害因素及影响",
          dataIndex: "hazardFactors",
          scopedSlots: { customRender: "hazardFactors" },
        },
        {
          title: "L",
          dataIndex: "l",
          scopedSlots: { customRender: "l" },
        },
        {
          title: "C",
          dataIndex: "c",
          scopedSlots: { customRender: "c" },
        },
        {
          title: "E",
          dataIndex: "e",
          scopedSlots: { customRender: "e" },
        },
        {
          title: "D",
          dataIndex: "d",
          scopedSlots: { customRender: "d" },
        },
        {
          title: "控制措施",
          dataIndex: "riskControls",
          scopedSlots: { customRender: "riskControls" },
        },
        {
          title: "排序",
          scopedSlots: { customRender: "sort" },
        },
        {
          title: "操作",
          dataIndex: "workSteps",
          scopedSlots: { customRender: "operation" },
          // scopedSlots: { customRender: "select" },
          // scopedSlots: { customRender: "step" },
        },
        // {
        //   title: "操作",
        //   dataIndex: "operation",
        //   scopedSlots: { customRender: "operation" },
        // },
      ],
      columnsFXJG: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.paginationFXJG.current - 1) *
              this.paginationFXJG.pageSize +
              index +
              1}`,
          width: 50,
        },
        {
          title: "作业步骤",
          dataIndex: "riskDecompositionStructureName",
          // scopedSlots: { customRender: "operation" },
          // scopedSlots: { customRender: "select" },
          // scopedSlots: { customRender: "step" },
        },
        {
          title: "危害因素及影响",
          dataIndex: "hazardFactors",
          scopedSlots: { customRender: "HazardFactors" },
          width: 160,
        },
        {
          title: "L",
          dataIndex: "l",
          scopedSlots: { customRender: "L" },
        },
        {
          title: "C",
          dataIndex: "c",
          scopedSlots: { customRender: "C" },
        },
        {
          title: "E",
          dataIndex: "e",
          scopedSlots: { customRender: "E" },
        },
        {
          title: "D",
          dataIndex: "d",
          scopedSlots: { customRender: "D" },
        },
        {
          title: "控制措施",
          dataIndex: "riskControls",
          scopedSlots: { customRender: "unit" },
        },
      ],
      //新增界面
      addNewConfig: {
        otherConfigurations: [],
        //新增界面的相关展示
        formDataList: [
          {
            type: "input", //组件类型 目前指出 input || select
            label: "序号", //展示名称
            formKey: "number", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编码", //展示名称
            formKey: "coding", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "select", //组件类型 目前指出 input || select
            showSearch: true,
            label: "作业类型", //展示名称
            formKey: "workType", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            mode: "multiple", //设置 Select 的模式为多选或标签
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请选择作业类型",
                // trigger: "blur",
              }, //校验规则
            },
            optionData: [],
            colSpan: 12,
          },
          {
            type: "select", //组件类型 目前指出 input || select
            showSearch: true,
            label: "作业单位", //展示名称
            formKey: "workUnit", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入作业单位",
                trigger: "blur",
              }, //校验规则
            },
            optionData: [],
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "作业地点", //展示名称
            formKey: "workPlace", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入作业地点", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入作业地点",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "datePicker", //组件类型 目前指出 input || select
            label: "作业日期", //展示名称
            colSpan: 12,
            format: "YYYY-MM-DD",
            formKey: "workDate", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              vDecorator: {
                required: true,
                message: "请输入作业日期",
                trigger: "blur",
              }, //校验规则
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "分析组长", //展示名称
            formKey: "analysisGroupLeader", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入分析组长",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "分析人员", //展示名称
            formKey: "analysisUser", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入分析人员",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          // {
          //   type: "textArea", //组件类型 目前指出 input || select
          //   label: "签字面板", //展示名称
          //   formKey: "qualificationCertificate", //form 定义的 key (必须唯一 || 必须传入)
          //   value: "", // 默认值为空字符串 // v-model 绑定值
          //   placeholder: "请输入", //输入框为空值的时候展示内容
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   labelStyle: { style: { width: "130px" } }, //组件样式 form-item
          //   options: {
          //     // 配置参数
          //     // vDecorator: {
          //     //   required: true,
          //     //   message: '请签字',
          //     //   trigger: 'blur',
          //     // }, //校验规则
          //   },
          //   colSpan: 24,
          // },
          {
            type: "textArea", //组件类型 目前指出 input || select
            label: "作业内容", //展示名称
            formKey: "workContent", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "130px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入作业内容",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 24,
          },
          {
            type: "card", //组件类型 目前指出 input || select
            label: "所使用的工具和材料", //展示名称
            formKey: "toolAndMaterial", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "165px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请选择所使用的工具和材料', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 24,
          },
        ],
      },
      originalConfigurations: [
        {
          type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
          label: "复选框", //展示名称
          slotScoped: "checkBox", //插槽
        },
        {
          type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
          label: "作业步骤", //展示名称
          slotScoped: "table", //插槽
        },
        {
          type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
          label: "审批流程", //展示名称
          slotScoped: "step", //插槽
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
          //打印button
          type: "btn",
          label: "打印",
          btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
          disabled: false, //是否禁用 true 是禁用 默认是false
          emit: "print", //传值内容 拿到当前所有数据包装好的
        },
        {
          //提交button
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
      //表格中的数据
      dataSource: [],
      dataSourceApproval: [],
      stepConfiguration: {
        stepProgress: 0,
        stepList: [
          {
            title: "JSA审批分析",
            name: "班组作业人员",
            dataTime: "2022/08/08",
          },
          {
            title: "审批完成",
            name: "分包商安全负责人",
            dataTime: "2022/08/10",
          },
        ],
      },
      columnsApproval: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.paginationApproval.current - 1) *
              this.paginationApproval.pageSize +
              index +
              1}`,
          width: 50,
        },
        {
          title: "审批步骤",
          dataIndex: "step",
          width: 100,
        },
        {
          title: "审批人",
          dataIndex: "person",
          width: 100,
        },
        {
          title: "部门",
          dataIndex: "institution",
          width: 100,
        },
        {
          title: "审批意见",
          dataIndex: "advice",
          width: 100,
        },
        {
          title: "审批状态",
          dataIndex: "status",
          width: 100,
        },
        {
          title: "审批日期",
          dataIndex: "time",
          width: 100,
        },
      ],
      recordOrderNo: Number,
      newSelectFXJG: [],
      checkedArr3List: [],
      formCheckBox: {},
      singleTableLoading: false,
    }
  },
  watch: {
    visibleAddNew(val) {
      if (val) {
        this.$nextTick(() => {
          this.dragSort()
        })
      }
    },
  },
  created() {
    this.checkBoxOptions = getCheckBox()
  },
  mounted() {
    this.getJsaList()
    this.getOutsourceCompany()
    this.encodeSelect()
  },
  methods: {
    // 提交
    submit(id) {
      jsaSubmit({ id: id }).then((res) => {
        if (res.code == 200) {
          this.$message.success("提交成功！")
        }
      })
    },
    // 打印
    print() {
      jsaApproval().then((res) => {})
    },
    //查询功能
    search() {
      this.queryForm.pageNum = 1
      this.queryForm.pageSize = 10
      this.queryForm.workDateS = this.workDate[0]
      this.queryForm.workDateE = this.workDate[1]
      // this.dictSelect = this.queryForm.workType
      this.queryForm.workType = this.workTypeOut.toString()
      this.getJsaList()
    },
    //获取列表
    getJsaList() {
      jsaList(this.queryForm).then((res) => {
        this.dataSource = res.body.data
        this.pagination.current = res.body.pageIndex
        this.pagination.total = res.body.total
        this.pagination.pageSize = res.body.pageSize
      })
    },
    //获取风险分解结构列表
    getSelectRick(
      pageNum = 1,
      pageSize = 10,
      operationDateTime,
      workUnit,
      competentDepartment,
      riskDecompositionStructure,
      hazardFactors,
      riskRating,
      analysisUser
    ) {
      selectRick({
        pageSize: pageSize,
        pageNum: pageNum,
        operationDateTime: operationDateTime,
        workUnit: workUnit,
        competentDepartment: competentDepartment,
        riskDecompositionStructure: riskDecompositionStructure,
        hazardFactors: hazardFactors,
        riskRating: riskRating,
        analysisUser: analysisUser,
      }).then((res) => {
        this.dataSourceFXJG = res.body.data.map((item) => {
          let newItem = item
          item.fxkid = item.id
          return newItem
        })
        this.paginationFXJG.current = res.body.pageIndex
        this.paginationFXJG.total = res.body.total
        this.paginationFXJG.pageSize = res.body.pageSize
      })
    },
    // 编辑调的接口，用来拿回转化前的数据，eg：数据字典编码
    getJsaListById(id) {
      jsaIdSelected({ ID: id }).then((res) => {
        this.echoMap = res.body
        this.echoMap.workType = res.body.workType.split(",")
        this.toolsMaterialsObj = {
          toolAndMaterialOne: res.body.toolAndMaterialOne.split(","),
          // toolAndMaterialOne: ["听力保护", "腈纶手套", "安全帽"],
          toolAndMaterialTwo: res.body.toolAndMaterialTwo.split(","),
          toolAndMaterialThree: res.body.toolAndMaterialThree.split(","),
          toolAndMaterialFour: res.body.toolAndMaterialFour.split(","),
        }
        this.dataZYBZ = res.body.fxkList
        this.selectedRowKeysFXJG = []
        // // 新增风险库选择复选框内容序号
        if (res.body.fxkList) {
          for (let index = 0; index < res.body.fxkList.length; index++) {
            const element = res.body.fxkList[index]
            if (element.workSteps == "0") {
              this.selectedRowKeysFXJG.push(element.fxkid)
            }
          }
        }
        // this.otherDataId = this.selectedRowKeysFXJG;
      })
    },
    //新增弹窗相关按钮
    add() {
      this.dataZYBZ = []
      this.otherConfigurationsAdd(["cancel", "print"])
      this.addNewModelConfig.title = "JSA分析-新增"
      this.visibleAddNew = true
      this.seen = false
      this.echoMap = {}
      this.addNewConfig.formDataList.splice(8, 1)
      // debugger;
      // 作业类型多选传过来编码返回也是编码
      this.addNewConfig.formDataList.forEach((item, index) => {
        if (item.type === "select") {
          if (item.hasOwnProperty("mode") && item.mode === "multiple") {
            this.$set(this.addNewConfig.formDataList[index], "value", [])
          } else {
            this.$set(this.addNewConfig.formDataList[index], "value", "")
          }
        } else {
          this.$set(this.addNewConfig.formDataList[index], "value", "")
        }
      })
      this.isDefault = true
      this.isDisabled = false
      this.isDefaultZYBZ = true
      this.isDisabledZYBZ = false
      this.toolsMaterialsObj = {
        toolAndMaterialOne: [],
        toolAndMaterialTwo: [],
        toolAndMaterialThree: [],
        toolAndMaterialFour: [],
      }
      this.addNewConfig.formDataList.forEach((element, index) => {
        if (element.formKey == "number") {
          element.value = (this.pagination.total + 1).toString()
        }
      })
      // this.addNewConfig.formDataList.forEach((element, index) => {
      //   if (element.formKey == "coding") {
      //     element.value = (
      //       "jsa" +
      //       this.addNewConfig.formDataList[5].value.toString() +
      //       (this.pagination.total + 1)
      //     ).toString();
      //   }
      // });

      this.addNewConfig.formDataList.forEach((item) => {
        if (item.formKey != "number" && item.formKey != "coding") {
          item.disabled = false
        } else {
          item.disabled = true
        }
      })

      this.addNewConfig.otherConfigurations.forEach((item) => {
        item.disabled = false
      })
    },
    // 保存表单
    saveList(value) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          let newValue = value
          newValue.toolAndMaterialOne = this.toolsMaterialsObj.toolAndMaterialOne.toString()
          newValue.toolAndMaterialTwo = this.toolsMaterialsObj.toolAndMaterialTwo.toString()
          newValue.toolAndMaterialThree = this.toolsMaterialsObj.toolAndMaterialThree.toString()
          newValue.toolAndMaterialFour = this.toolsMaterialsObj.toolAndMaterialFour.toString()
          var dataBox = []
          if (this.dataZYBZ) {
            this.dataZYBZ.forEach((item) => {
              dataBox.push({
                workSteps: item.workSteps,
                codeName: item.riskDecompositionStructureName,
                hazardFactors: item.hazardFactors,
                l: item.l,
                c: item.c,
                e: item.e,
                d: item.d,
                riskControls: item.riskControls,
                // 新增风险库选择复选框内容序号
                orderNo: item.orderNo,
                fxkid: item.fxkid,
              })
            })
          }
          newValue.fxkList = dataBox
          newValue.workType = newValue.workType.toString()
          if (value.id) {
            newValue.ID = value.id
            jsaUpdate(newValue).then((res) => {
              if (res.code == "200") {
                this.visibleAddNew = false
                this.$message.success("编辑成功")
              } else {
                this.$message.error("编辑失败")
              }
              this.getJsaList()
              // this.getJsaListById(value.id);
              this.visibleAddNew = false
              this.echoMap = {}
            })
          } else {
            jsaPost(newValue).then((res) => {
              this.getJsaList()
              this.$message.success("新增成功")
              this.visibleAddNew = false
              this.echoMap = {}
              newValue.fxkList = []
            })
          }
        } else {
          this.$message.error("请输入正确格式的数据！")
        }
        this.selectedRowKeysFXJG = []
      })
    },
    // 删除
    headDelete() {
      if (this.selectedRowKeys.length > 0) {
        deleteJsa(this.selectedRowKeys).then((res) => {
          if (res.code == "true") {
            this.selectedRowKeys = []
          }
          this.getJsaList()
          this.$message.success("删除成功！")
        })
      } else {
        this.$message.warning("请选择记录！")
      }
    },
    deleteTAb(orderNo) {
      const newData = [...this.dataZYBZ]
      newData.forEach((element, index) => {
        // index---下标
        if (index === orderNo) {
          newData.splice(index, 1)
          this.dataZYBZ = [...newData]
          // 跳出箭头函数
          return false
        }
      })
      this.selectedRowKeysFXJG = []
      for (let index = 0; index < this.dataZYBZ.length; index++) {
        const element = this.dataZYBZ[index]
        element.orderNo = index
        if (element.workSteps == 0) {
          this.selectedRowKeysFXJG.push(element.fxkid)
        }
      }
    },
    // 手动编辑
    handleChange(value, orderNo, column) {
      const newData = [...this.dataZYBZ]
      const target = newData.find((item) => orderNo === item.orderNo)
      if (target) {
        target[column] = value
        this.dataZYBZ = newData
      }
    },
    formHandleChange(val) {
      if (val.formKey == "workDate") {
        let number = ""
        this.addNewConfig.formDataList.forEach((element) => {
          if (element.formKey == "number") {
            number = element.value
          }
        })
        this.addNewConfig.formDataList.forEach((element, index) => {
          if (element.formKey == "coding") {
            this.$refs.Form.$refs.demoIn[index].itemCopyConfig.value =
              "JSA" + Number(new Date(val.value)) + number
          }
        })
      }
    },
    edit(orderNo) {
      const newData = [...this.dataZYBZ]
      const target = newData.find((item) => orderNo === item.orderNo)
      this.editingKey = orderNo
      if (target) {
        target.editable = true
        this.dataZYBZ = newData
      }
    },
    saveTab(orderNo) {
      const newData = [...this.dataZYBZ]
      const target = newData.find((item) => orderNo === item.orderNo)
      if (target) {
        delete target.editable
        this.dataZYBZ = newData
      }
      this.editingKey = ""
    },
    handleAdd() {
      const { dataZYBZ } = this
      const newData = {}
      newData.orderNo = dataZYBZ.length
      newData.workSteps = 1
      newData.editable = true
      this.dataZYBZ = [...dataZYBZ, newData]
      this.editingKey = newData.orderNo
      // this.count = count + 1;
    },
    //比较2个数组中不同的元素
    getNewArr(a, b) {
      const arr = [...a, ...b]
      const newArr = arr.filter((item) => {
        return !(a.includes(item) && b.includes(item))
      })
      return newArr
    },
    // 确定风险分解结构
    determine() {
      // this.dataSourceFXJ G// <[{}],array> 本页数据
      // this.selectedRowKeysFXJG // <[''],Array> 被选中数据
      this.dataZYBZ = this.checkedArr3List
      this.visibleFXJG = false
    },
    handleSelect() {
      const { dataZYBZ } = this
      const newData = {
        sId: `${dataZYBZ.length + 1}`,
        // order: dataZYBZ.length,
        workSteps: 0,
        orderNo: dataZYBZ.length,
      }
      this.dataZYBZ = [...dataZYBZ, newData]
    },
    // 选择风险分解结构复选框
    onSelectChangeFXJG(key) {
      if (this.currentDataId !== "") {
        this.selectedRowKeysFXJG = key.filter(
          (item) => item !== this.currentDataId
        )
      } else {
        if (this.selectedRowKeysFXJG.length >= 1) {
          let selectNewFXJG = this.getNewArr(this.selectedRowKeysFXJG, key)
          this.selectedRowKeysFXJG = selectNewFXJG
        } else {
          this.selectedRowKeysFXJG = key
        }
      }
      let arr3 = this.dataZYBZ
      let findSelect = this.getNewArr(
        this.selectedRowKeysFXJG,
        this.newSelectFXJG
      )
      for (let i = 0; i < this.dataSourceFXJG.length; i++) {
        // this.dataSourceFXJG[i].fxkid = this.dataSourceFXJG[i].id
        if (this.dataSourceFXJG[i].fxkid == findSelect[0]) {
          this.dataZYBZ.forEach((element, index) => {
            if (this.recordOrderNo == element.orderNo) {
              arr3[index] = JSON.parse(JSON.stringify(this.dataSourceFXJG[i]))
              arr3[index].orderNo = this.recordOrderNo
              arr3[index].workSteps = 0
            }
          })
        }
      }
      this.checkedArr3List = arr3
    },
    lookfxjg(row) {
      this.visibleFXJG = true
    },
    // 风险库选择点击事件
    selectfxjg(text, record, index, row) {
      // // // 新增风险库选择复选框内容序号
      // for (let index = 0; index < this.dataZYBZ.length; index++) {
      //   const element = this.dataZYBZ[index];
      //   // element.orderNo = index;
      //   this.selectedRowKeysFXJG.push(this.dataZYBZ[index].fxkid);
      // }
      // this.selectedRowKeysFXJG;
      this.getSelectRick()
      this.otherDataId = []
      if (record.hasOwnProperty("fxkid")) {
        this.dataZYBZ.forEach((element) => {
          if (element.fxkid === record.fxkid) {
            this.currentDataId = record.fxkid
          } else {
            this.otherDataId.push(element.fxkid)
          }
        })
      } else {
        this.otherDataId = this.selectedRowKeysFXJG
      }
      this.recordOrderNo = record.orderNo
      this.newSelectFXJG = this.selectedRowKeysFXJG
      this.visibleFXJG = true
    },
    getCheckboxPropsFXJG: function(record) {
      return {
        props: {
          // {'当前被选中','之前被选中'} = this.data
          disabled: this.otherDataId.some((ele) => ele === record.fxkid),
        },
        // 当前被选中默认填充进props 对勾
        // 当前被选中.id == 当前点击.id
      }
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    //日期的onchange
    onChange(date, dateString) {
      console.log(date, dateString)
    },
    onChangeCheckBox(checkedValues) {
      console.log("checked = ", checkedValues)
    },
    cancelJSA(value) {
      this.visibleAddNew = false
    },
    //查看弹窗相关按钮
    look(value) {
      this.otherConfigurationsAdd(["submit", "save"])
      this.addNewModelConfig.title = "JSA分析-详情"
      this.visibleAddNew = true
      this.getJsaListById(value.id)
      this.seen = true
      // N个复选框
      this.isDefault = false
      this.isDisabled = true
      // 作业步骤按钮
      this.isDefaultZYBZ = false
      this.isDisabledZYBZ = true
      this.addNewConfig.formDataList.forEach((item) => {
        item.value = value[item.formKey]
        item.disabled = true
      })
      this.addNewConfig.otherConfigurations.forEach((item) => {
        if (item.label != "取消" && item.label != "打印") {
          item.disabled = true
        }
      })
    },
    //编辑弹窗相关按钮
    editJSA(value) {
      this.otherConfigurationsAdd(["cancel", "print"])
      this.addNewModelConfig.title = "JSA分析-编辑"
      this.getJsaListById(value.id)
      // this.getSelectRick(value);
      // this.echoMap = value;
      this.visibleAddNew = true
      this.seen = false
      this.isDefault = true
      this.isDisabled = false
      this.isDefaultZYBZ = true
      this.isDisabledZYBZ = false
      // 判断是不是编码和序号
      this.addNewConfig.formDataList.forEach((item) => {
        if (item.formKey != "number" && item.formKey != "coding") {
          item.disabled = false
        } else {
          item.disabled = true
        }
      })
      this.addNewConfig.otherConfigurations.forEach((item) => {
        item.disabled = false
      })
    },
    //查看下方的按钮
    close(value) {
      this.visibleLook = false
    },
    //页面变更
    paginationChange(pagination) {
      this.queryForm.pageNum = pagination.current
      this.queryForm.pageSize = pagination.pageSize
      this.getJsaList()
    },
    ZybzPaginationChange(ZybzPagination) {},
    otherConfigurationsAdd(valArray) {
      this.addNewConfig.otherConfigurations = this.originalConfigurations.filter(
        (item) => {
          let elementExist = false
          for (let index = 0; index < valArray.length; index++) {
            const element = valArray[index]
            if (item.hasOwnProperty("emit")) {
              if (item.emit === element) {
                elementExist = true
              }
            }
          }
          if (!elementExist) {
            return item
          }
        }
      )
    },
    // 获取数据字典列表
    encodeSelect() {
      encode("ZYXKGL-ZYLX").then((res) => {
        this.dictSelect = res.body.data
        this.addNewConfig.formDataList[2].optionData = []
        res.body.data.forEach((item) => {
          this.addNewConfig.formDataList[2].optionData.push({
            value: item.dictcode,
            label: item.dictname,
          })
        })
      })
    },
    // 获取外委单位列表
    getOutsourceCompany() {
      companySelect().then((res) => {
        // this.company = res.body
        res.body.forEach((item) => {
          this.addNewConfig.formDataList[3].optionData.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          })
        })
        this.company = this.addNewConfig.formDataList[3].optionData
      })
    },
    //重置输入
    resetForm() {
      this.queryForm = {
        pageSize: 10,
        pageNum: 1,
        coding: "",
        workType: "",
        workUnit: "",
        workDateS: "",
        workDateE: "",
        workPlace: "",
        analysisGroupLeader: "",
        analysisUser: "",
        workContent: "",
      }
      this.workTypeOut = []
      this.workDate = []
      this.getJsaList()
    },
    callback(key) {
      console.log(key)
    },
    // 取消选择风险分解结构
    cancelRickTable() {
      this.visibleFXJG = false
    },
    /** 模块排序 */
    dragSort() {
      const el = this.$refs.singleTable.$el.querySelectorAll(
        ".ant-table-body > table > tbody"
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: "ghost",
        handle: ".move",
        onEnd: (e) => {
          let sortList = JSON.parse(JSON.stringify(this.dataZYBZ))
          const targetRow = sortList.splice(e.oldIndex, 1)[0]
          console.log(e.newIndex)
          sortList.splice(e.newIndex, 0, targetRow)
          for (let index = 0; index < sortList.length; index++) {
            sortList[index].orderNo = index
          }
          this.singleTableLoading = true
          this.dataZYBZ = []
          setTimeout(() => {
            this.singleTableLoading = false
            this.dataZYBZ = sortList
          }, 500)
          // this.dataZYBZ = JSON.parse(JSON.stringify(sortList))
        },
      })
    },
  },
}
</script>
<style scoped>
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
>>>.ant-card-head{
  min-height: 20px!important;
}
>>>.ant-card-head-title{
  padding: 0!important;
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

.editable-add-btn {
  margin-bottom: 8px;
}
.editable-row-operations a {
  margin-right: 8px;
}
.zybz-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.step {
  padding: 20px;
}
.btn {
  text-align: center;
}
</style>
