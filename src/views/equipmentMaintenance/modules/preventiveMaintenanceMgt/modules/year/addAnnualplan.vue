<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            {
              value: 'exportComponent',
              text: '模板下载',
              url: '/Annual/downloadTemplate',
              accept: '.xlsx',
            },
            {
              value: 'importComponent',
              url: 'Annual/importExcel',
              accept: '.xlsx',
            },
            { value: 'Add', clickName: 'addRecord' },
            { value: 'Delete', clickName: 'confirm' },
            {
              value: 'Go',
              name: '返回',
              icon: 'Go-icon',
              isPower: false,
              clickName: 'go',
            },
          ]"
          @addRecord="addRecord"
          @confirm="confirm"
          @go="go"
        ></pe-button>
        <!-- <a-button
          v-Add
          class="buttonType btn_primary"
          type="primary"
          icon="plus"
          @click.stop="addRecord"
        >
          新增
        </a-button> -->
        <!-- <a-popconfirm
          placement="left"
          title="是否删除选中内容!"
          ok-text="是"
          cancel-text="否"
          @confirm="confirm"
        >
          <a-button
            v-Delete
            class="buttonType btn_danger"
            type="danger"
            icon="delete"
          >
            删除
          </a-button>
        </a-popconfirm> -->
        <!-- <a-button
          class="buttonType btn_primary"
          type="primary"
          icon="left"
          @click.stop="back"
        >
          返回
        </a-button> -->
        <!-- 进入工作流 -->
        <!-- <a-popconfirm
          placement="left"
          title="是否提交"
          ok-text="确定"
          cancel-text="取消"
          @confirm.stop="Submit()"
        >
          <a-button
            class="buttonType btn_primary"
            type="primary"
            icon="issues-close"
          >
            提交
          </a-button>
        </a-popconfirm> -->
      </div>
    </template>
    <template slot="appMain">
      <div>
        <a-form-model v-model="form" :layout="'inline'">
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="年度计划编码:"
            >
              <a-input ref="select" v-model="temp" :disabled="true"></a-input>
            </a-form-model-item>
          </a-col>
        </a-form-model>
        <dc-table
          @change="paginationChange"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          rowKey="id"
          :scroll="{ x: 100 }"
          :columns="columns"
          :dataSource="dataSource"
          :openSelector="false"
          :pagination="pagination"
        >
          <template slot="bpbj" slot-scope="row">
            <span class="edit" v-Edit @click="lookbpbj(row)">查看</span>
          </template>

          <template slot="operation" slot-scope="row">
            <pe-button
              :include="[
                {
                  value: 'Edit',
                  type: 'link',
                  clickName: 'edit',
                  icon: '',
                  style: ['btn_link'],
                },
              ]"
              @edit="edit(row)"
            ></pe-button>
          </template>
        </dc-table>
        <dc-Model
          v-model="visible"
          :modelConfig="modelConfig"
          class="from-style bigModel"
        >
          <FormitemDemo
            @handleChange="handleChange"
            @enterButton="enterButton"
            :echoMap="echoMap"
            ref="Form"
            @save="save"
            :Config="Config"
            :layout="'inline'"
            @cancel="cancel"
          >
            <template slot="table">
              <span style="font-size: 18px">备品备件</span>
              <a
                style="float: right"
                slot="extra"
                href="#"
                @click="selectSparepart"
                >选择
              </a>
              <dc-table
                :scroll="{ x: 100 }"
                :columns="columnsModelOut"
                rowKey="id"
                :dataSource="spartPartDataSourceOut"
                :openSelector="false"
                :pagination="paginationSparepartOut"
                @change="paginationChangeSparepartOut"
              >
                <template slot="inputText" slot-scope="row, text">
                  <a-input placeholder="" v-model="text.planCostCount" />
                </template>
                <template slot="operation" slot-scope="row, text, index">
                  <a-button
                    type="link"
                    class="btn_link"
                    style="cursor: pointer"
                    @click="deleteClick(row, text, index)"
                  >
                    删除
                  </a-button>
                </template>
              </dc-table>
            </template>
          </FormitemDemo>
        </dc-Model>
        <dc-Model
          v-model="visibleCompany"
          :modelConfig="modelConfigCompany"
          class="from-style bigModel"
        >
          <a-form-model>
            <a-select
              mode="combobox"
              style="width: 100%"
              placeholder="根据单位名称检索"
              @change="handleChangeCompany"
            >
              <a-select-option
                :value="item.OutsourceCompanyName"
                v-for="item in companyDataSourceSelect"
              >
                {{ item.OutsourceCompanyName }}
              </a-select-option>
            </a-select>
            <dc-table
              @change="paginationChangeIn"
              :pagination="paginationTwo"
              :row-selection="{
                selectedRowKeys: selectedRowKeysTwo,
                onChange: onSelectChangeTwo,
              }"
              rowKey="id"
              :scroll="{ x: 100 }"
              :columns="columnsCompany"
              :dataSource="companyDataSource"
              :openSelector="false"
            ></dc-table>
          </a-form-model>
          <div class="footer">
            <a-button type="primary" @click="yes"> 确定 </a-button>
            <a-button @click="cancelCompany" :style="{ marginLeft: '8px' }"
              >取消</a-button
            >
          </div>
        </dc-Model>
        <!-- 设备列表 -->
        <!-- <dc-Model
          v-model="visibleEquipmentName"
          :modelConfig="modelConfigCompany"
          class="from-style bigModel"
        >
          <a-form-model v-model="form">
            <a-col
              :span="12"
              v-for="(item, index) in equipmentList"
              :key="item.type"
            >
              <a-form-model-item :label="item.label">
                <a-input ref="select" v-model="item.value"></a-input>
              </a-form-model-item>
            </a-col>
            <a-form-model-item class="search_form_button">
              <a-button
                type="primary"
                @click="inSerach"
                v-Query
                class="buttonType"
                :style="{ marginLeft: '8px' }"
              >
                查询
              </a-button>
              <a-button @click="inReform"> 重置 </a-button>
            </a-form-model-item>
            <dc-table
              @change="paginationChangeInTwo"
              :pagination="paginationThree"
              :row-selection="{
                selectedRowKeys: selectedRowKeysThree,
                onChange: onSelectChangeThree,
              }"
              rowKey="id"
              :scroll="{ x: 100 }"
              :columns="columnsEquipment"
              :dataSource="EquipmentDataSource"
              :openSelector="false"
            ></dc-table>
          </a-form-model>
          <div class="footer">
            <a-button type="primary" @click="EquipmentNameClick()">
              确定
            </a-button>
            <a-button @click="cancelEquipment" :style="{ marginLeft: '8px' }"
              >取消</a-button
            >
          </div>
        </dc-Model> -->
        <equipmentModel
          ref="equipmentModel"
          :equipmentVisible.sync="visibleEquipmentName"
          @selectedClic="selectedClic"
        />
        <!-- 备品备件 -->
        <dc-Model
          v-model="visibleSparepart"
          :modelConfig="modelConfigSparepart"
          class="from-style bigModel"
        >
          <a-form-model>
            <a-col :span="12">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="备品备件名称:"
              >
                <a-input
                  v-model="selectFrom.sparePartName"
                  placeholder="备品备件名称"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-form-model-item class="search_form_button">
              <a-button
                v-Query
                class="buttonType"
                :style="{ marginLeft: '8px' }"
                type="primary"
                @click="select"
              >
                查询
              </a-button>
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>

            <!-- <a-select
            show-search
            style="width: 100%"
            placeholder="根据备件名称检索"
            @change="handleChangeIn"
            :filter-option="filterOption"
            :allowClear="true"
          >
            <a-select-option
              :value="item.materialCode"
              :key="item.id"
              v-for="item in spartPartDataSourceTwo"
            >
              {{ item.sparePartName }}
            </a-select-option>
          </a-select> -->
            <!-- <a-input v-model="sparePartName" placeholder="请输入"></a-input> -->
            <dc-table
              :row-selection="{
                selectedRowKeys: spartPartDataSourceKey,
                onChange: spartPartDataSourceChange,
              }"
              rowKey="id"
              :scroll="{ x: 100 }"
              :columns="columnsModel"
              :dataSource="spartPartDataSource"
              :pagination="paginationSparepart"
              @change="paginationChangeSparepart"
              :openSelector="false"
            >
            </dc-table>
          </a-form-model>
          <div class="ant-modal-footer">
            <a-button type="primary" @click="ok"> 确定 </a-button>
            <a-button @click="no">取消</a-button>
          </div>
        </dc-Model>
        <!-- 查看 -->
        <dc-Model
          v-model="visibleSpareparts"
          :modelConfig="modelConfigSpareparts"
          class="from-style bigModel"
        >
          <dc-table
            rowKey="id"
            :scroll="{ x: 100 }"
            :columns="columnsSpareparts"
            :dataSource="sparepartsDataSource"
            :openSelector="false"
          ></dc-table>
        </dc-Model>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import { getListForSparepart } from "@/api/sparesprt";
import {
  findYearList,
  yearPlanSubmit,
  queryPublicSearchColumn,
  // queryCommonColumn,
  queryPageListForUnClass,
} from "@/api/PublicInterface";
import moment from "moment";
import equipmentModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue";

import { getListForPage, companySelect } from "@/api/outsourceCompany";
import { getListById, getIdListForSparepart } from "@/api/sparesprt";
import { encode } from "@/api/dataDictionary";
import {
  edit,
  addAnnualInspectionPlan,
  queryDetailsByAnnualPlanNo,
  yearOption,
  deleteAnnualInspectionPlan,
} from "@/api/annualMaintenance";
export default {
  components: { equipmentModel },
  data() {
    return {
      selectFrom: {
        deviceName: "",
        deviceType: "",
        materialCode: "",
        sparePartName: "",
        pageNum: 1,
        pageSize: 10,
      },
      paginationSparepartOut: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      companyDataSourceSelect: [],
      columnsSpareparts: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 100,
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 150,
        },
        {
          title: "物资编码",
          dataIndex: "materialCode",
          width: 100,
        },
        {
          title: "规格型号",
          dataIndex: "specificationOrMaterial",
          width: 100,
        },
        {
          title: "数量",
          dataIndex: "planCostCount",
          width: 100,
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 150,
        },
      ],
      selectedRowThree: [],
      sparepartsDataSource: [],
      visibleSpareparts: false,
      spartPartDataSourceTwo: [],
      spartPartDataSource: [],
      spartPartDataSourceKey: [],
      columnsModelOut: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.paginationSparepartOut.current - 1) *
                this.paginationSparepartOut.pageSize +
              index +
              1
            }`,
          width: 50,
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 100,
        },
        {
          title: "物资编码",
          dataIndex: "materialCode",
          width: 100,
        },
        {
          title: "规格/材质",
          dataIndex: "specificationOrMaterial",
          width: 100,
          slectBollen: true,
        },
        {
          title: "数量",
          dataIndex: "planCostCount",
          width: 100,
          slectBollen: true,
          scopedSlots: { customRender: "inputText" },
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 100,
          slectBollen: true,
        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: "center",
          width: 100,
        },
      ],
      spartPartDataSourceOut: [],
      columnsEquipment: [],
      EquipmentDataSource: [],
      equipmentList: [],
      visibleCompany: false,
      selectedRowKeysTwo: [],
      selectedRowKeysThree: [],
      visibleEquipmentName: false,
      modelConfigCompany: {
        width: "950px",
        title: "维修单位名称",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfigSpareparts: {
        width: "950px",
        title: "备品备件清单 ",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfig: {
        width: "950px",
        title: "年度计划表单",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfigSparepart: {
        width: "950px",
        title: " 备品备件",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      companyDataSource: [],
      columnsCompany: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.paginationTwo.current - 1) * this.paginationTwo.pageSize +
              index +
              1
            }`,
          width: 50,
        },
        {
          title: "检维修单位名称",
          dataIndex: "outsourceCompany",
          slectBollen: true,
          width: 150,
        },
        {
          title: "检维修单位联系人",
          dataIndex: "personInCharge",
          slectBollen: true,
        },
      ],
      paginationTwo: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      paginationThree: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
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
      columnsModel: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 150,
        },
        {
          title: "物资编码",
          dataIndex: "materialcode",
          width: 150,
        },
        {
          title: "规格/材质",
          dataIndex: "specificationOrMaterial",
          width: 150,
        },
        {
          title: "数量",
          dataIndex: "existingnumber",
          width: 150,
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 150,
        },
      ],
      form: {
        year: "",
      },
      // 备品备件页码
      paginationSparepart: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      Config: {
        otherConfigurations: [
          // {
          //   type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
          //   label: "设备名称", //展示名称
          //   slotScoped: "table", //插槽
          // },
          {
            type: "btn",
            label: "保存",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "save", //传值内容 拿到当前所有数据包装好的
          },
          {
            type: "btn",
            label: "取消",
            btnType: "Delate", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        formDataList: [
          {
            type: "select", //组件类型 目前指出 input || select
            label: "是否在账设备", //展示名称
            labelStyle: { style: { width: "180px", height: "60px" } },
            formKey: "whetheraccountedequipment", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请选择", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入设备名称",
                trigger: "change",
              }, //校验规则
            },
            optionData: [
              {
                label: "是",
                value: "是",
              },
              {
                label: "否",
                value: "否",
              },
            ],
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "责任人", //展示名称
            formKey: "personincharge", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px", height: "60px" } }, //组件样式 form-item
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "设备名称", //展示名称
            formKey: "devicename", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px", height: "60px" } }, //组件样式 form-item
            enterText: "查看",
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          // {
          //   type: 'input',
          //   label: '设备编码',
          //   placeholder: '请输入',
          //   formKey: 'deviceno',
          //   value: '',
          //   labelStyle: { style: { width: '180px', height: '60px' } },
          //   options: {
          //     // 配置参数
          //   },
          //   colSpan: 8,
          // },
          {
            type: "input",
            label: "设备位号",
            placeholder: "请输入",
            formKey: "devicetagno",
            value: "",
            labelStyle: { style: { width: "180px", height: "60px" } },
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "select",
            label: "作业区域",
            placeholder: "请选择",
            labelStyle: { style: { width: "180px", height: "60px" } },
            formKey: "area",
            value: "",
            options: {
              // 配置参数
            },
            optionData: [],
            colSpan: 8,
          },
          {
            type: "input",
            label: "计划维修时长",
            placeholder: "请输入（天）",
            labelStyle: { style: { width: "180px", height: "60px" } },
            formKey: "plannedmaintenancetime",
            value: "",
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "disabledDateMonthPicker",
            label: "计划维修月份",
            placeholder: "请选择",
            labelStyle: { style: { width: "180px", height: "60px" } },
            format: "YYYY-MM",
            formKey: "planmonth",
            value: "",
            disabledDate: this.disabledplanmaintenancedateDate,
            defaultPickerValue: `${this.$route.query.planYear}-01`,
            options: {
              vDecorator: {
                required: true,
                message: "请输入计划维修月份",
                trigger: "change",
              }, //校验规则
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "select",
            label: "专业",
            placeholder: "请选择",
            labelStyle: { style: { width: "180px", height: "60px" } },
            selectStyle: {
              width: "183px",
            },
            formKey: "major",
            value: undefined,
            options: {
              // 配置参数
            },
            optionData: [],
            colSpan: 8,
          },
          {
            type: "select",
            placeholder: "请选择",
            label: "是否影响生产",
            labelStyle: { style: { width: "180px", height: "60px" } },
            selectStyle: {
              width: "183px",
            },
            formKey: "whetheraffectexportorship",
            value: undefined,
            options: {
              // 配置参数
            },
            optionData: [
              {
                label: "是",
                value: 1,
              },
              {
                label: "否",
                value: 0,
              },
            ],
            colSpan: 8,
          },
          {
            type: "btnInput",
            label: "维修单位名称",
            placeholder: "请选择",
            enterText: "查看",
            // labelStyle: { style: { width: "180px", height: "60px" } },
            scopedSlots: { customRender: "company" },
            // scopedSlots: { customRender: 'sparePart' },
            colSpan: 8,
            disabled: true,
            formKey: "inspectioncompanyname",
            value: undefined,
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: "input",
            label: "计划费用",
            placeholder: "请输入",
            labelStyle: { style: { width: "180px", height: "60px" } },
            formKey: "plannedcost",
            value: "",
            options: {
              // 配置参数
              vDecorator: [
                {
                  required: true,
                  message: "请输入计划费用",
                  trigger: "change",
                },
                {
                  validator: (rule, value, callback) => {
                    const reg = /^[0-9]*$/;
                    if (reg.test(value)) {
                      return callback();
                    } else {
                      return callback(new Error("请输入数字"));
                    }
                  },
                  trigger: "change",
                },
              ], //校验规则
            },
            colSpan: 16,
          },
          {
            type: "textArea",
            label: "作业内容",
            placeholder: "请输入",
            labelStyle: { style: { width: "180px", height: "60px" } },
            formKey: "operationcontent",
            value: undefined,
            options: {
              // 配置参数
            },
            colSpan: 24,
          },
          {
            type: "textArea",
            label: "信息描述",
            placeholder: "请输入",
            labelStyle: { style: { width: "125px", height: "60px" } },
            formKey: "maintenancedescription",
            value: "",
            options: {
              // 配置参数
            },
            colSpan: 24,
          },
          {
            type: "textArea",
            label: "备注",
            placeholder: "请输入",
            // labelStyle: { style: { width: "125px", height: "60px" } },
            formKey: "remark",
            value: "",
            options: {
              // 配置参数
            },
            colSpan: 24,
          },
          {
            type: "table",
            colSpan: 24,
          },
        ],
      },
      selectedRowKeys: [],
      visible: false,
      columns: [
        {
          title: "序号",
          width: 50,
          customRender: (text, record, index) => `${index + 1}`,
          align: "center",
        },
        {
          title: "是否在账",
          dataIndex: "whetheraccountedequipment",
          width: 70,
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "devicename",
          width: 100,
          align: "center",
        },
        // {
        //   title: '设备编号',
        //   dataIndex: 'deviceno',
        //   width: 100,
        // },
        {
          title: "设备位号",
          dataIndex: "devicetagno",
          width: 100,
          align: "center",
        },
        {
          title: "所属区域",
          dataIndex: "area",
          customRender: (text) =>
            (text = this.Config.formDataList[4].optionData.filter(
              (obj) => text === obj.value
            )[0]?.label),
          width: 100,
          align: "center",
        },
        {
          title: "责任人",
          dataIndex: "personincharge",
          width: 80,
          align: "center",
        },
        {
          title: "维护/检修内容描述",
          dataIndex: "maintenancedescription",
          width: 130,
          align: "center",
        },
        {
          title: "计划维修时长",
          dataIndex: "plannedmaintenancetime",
          width: 100,
          align: "center",
        },
        {
          title: "计划检修月份",
          dataIndex: "planmonth",
          width: 100,
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "majorName",
          width: 100,
          align: "center",
        },
        {
          title: "作业内容",
          dataIndex: "operationcontent",
          width: 100,
          align: "center",
        },
        {
          title: "所需备品备件清单",
          scopedSlots: { customRender: "bpbj" },
          width: 140,
          align: "center",
        },
        {
          title: "是否影响外输或接卸船",
          dataIndex: "whetheraffectexportorship",
          customRender: (value, row, index) => {
            return {
              children: value == "1" ? "是" : "否",
              attrs: { rowSpan: 1 },
            };
          },
          width: 160,
          align: "center",
        },
        {
          title: "维修单位名称",
          dataIndex: "inspectioncompanyname",
          width: 100,
          align: "center",
        },
        {
          title: "计划费用（元）",
          dataIndex: "plannedcost",
          width: 100,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 100,
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 120,
          fixed: "right",
          align: "center",
        },
      ],
      dataSource: [],
      temp: "",
      id: "",
      echoMap: {},
      equipmentObject: {},
      visibleSparepart: false,
    };
  },
  mounted() {
    this.getSpareparts();
    this.getList();
    this.getOutsourceCompany();
    this.encode();
    this.queryPublicSearchColumn();
    this.queryPageListForUnClass();
    this.getCompanySelect();
  },
  methods: {
    deleteClick(row, text, index) {
      this.spartPartDataSourceOut.splice(index, 1);
    },
    disabledplanmaintenancedateDate(vla) {
      // this.$route.query.planYear;
      // this.$route.query.planMonth;
      // let selectDay = `${this.$route.query.planYear,this.$route.query.planMonth}`
      // debugger
      // return selectDay && selectDay < moment().endOf('day');
      let optionalTimeAfter;
      let optionalTimeBefore;
      optionalTimeAfter = this.$route.query.planYear + "12";
      optionalTimeBefore = +this.$route.query.planYear - 1 + "12";
      return (
        vla > moment(optionalTimeAfter).startOf("months") ||
        vla < moment(optionalTimeBefore).endOf("months")
      );
    },
    // 公共方法重置
    inReform() {
      this.equipmentObject = {};
      this.queryPageListForUnClass(1, 10, this.equipmentObject);
    },
    select() {
      this.selectFrom.pageNum = 1;
      this.selectFrom.pageSize = 10;
      this.getSpareparts();
    },
    //重置输入
    resetForm() {
      this.selectFrom = {
        deviceName: "",
        deviceType: "",
        materialCode: "",
        sparePartName: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getSpareparts();
    },
    // 备品备件页码有问题
    paginationChangeSparepartOut(pagination) {
      // this.paginationSparepartOut.total = pagination.total;
      this.paginationSparepartOut.current = pagination.current;
      this.paginationSparepartOut.pageSize = pagination.pageSize;
      // this.selectFrom.pageNum = pagination.current;
      // this.selectFrom.pageSize = pagination.pageSize;
      // this.getSpareparts();
      this.getSpareparts(pagination.current, pagination.pageSize);
    },
    handleChangeCompany(selectListCompany) {
      this.getOutsourceCompany(1, 10, selectListCompany);
    },
    getCompanySelect() {
      companySelect().then((res) => {
        this.companyDataSourceSelect = res.body;
      });
    },
    EquipmentNameClick() {},
    selectedClic(value) {
      this.$refs.Form.upDate("devicename", "value", value.eqm_sbmc);
      this.$refs.Form.upDate("devicetagno", "value", value.eqm_sbwh);
      // this.visibleEquipmentName = false;
      // this.form.devicename = ;
      // this.form.devicetagno = ;
      this.visibleEquipmentName = false;
      this.$refs.ruleForm.validateField("devicename");
    },
    getSparepartsIn(row, type) {
      if (!type) {
        // 备品备件弹出框缓存选择的数组清空
        this.spartPartDataSourceKey = [];
        // 获取form表单对象循环赋值
        this.Config.formDataList.forEach((item) => {
          // 循环每一个对象取到对象得formKey得值循环赋值给当前对象
          item.value = row[item.formKey];
        });
        this.$nextTick(() => {
          if (row.whetheraccountedequipment == "是") {
            this.$refs.Form.upDate("devicename", "type", "btnInput");
            this.$refs.Form.upDate("devicename", "disabled", true);
            // this.$refs.Form.upDate('deviceno', 'disabled', true)
            this.$refs.Form.upDate("devicetagno", "disabled", true);
          } else {
            this.$refs.Form.upDate("devicename", "type", "input");
            this.$refs.Form.upDate("devicename", "disabled", false);
            // this.$refs.Form.upDate('deviceno', 'disabled', false)
            this.$refs.Form.upDate("devicetagno", "disabled", false);
          }
        });
      }
      // 获取备品备件数据赋值给spartPartDataSourceOut渲染备品备件列表
      getListById({ ID: row.id }).then((res) => {
        res.body.forEach((item) => {
          this.spartPartDataSourceKey.push(item.materialCode);
        });
        if (!type) {
          this.spartPartDataSourceOut = res.body;
        } else {
          this.sparepartsDataSource = res.body;
        }
      });
    },
    lookbpbj(row) {
      this.visibleSpareparts = true;
      this.getSparepartsIn(row, 2);
    },
    paginationChangeSparepart(pagination) {
      this.selectFrom.pageNum = pagination.current;
      this.selectFrom.pageSize = pagination.pageSize;
      this.getSpareparts(pagination.current, pagination.pageSize);
    },
    no(value) {
      this.visibleSparepart = false;
    },
    //弹出框确认
    ok(value) {
      getIdListForSparepart({
        list: this.spartPartDataSourceKey,
        pageSize: 999,
        pageIndex: 1,
      }).then((res) => {
        let data = res.body.data;
        this.spartPartDataSourceOut = data.map((item) => {
          let newItem = item;
          for (
            let index = 0;
            index < this.spartPartDataSourceOut.length;
            index++
          ) {
            const element = this.spartPartDataSourceOut[index];
            if (item.id == element.id) {
              newItem = element;
            }
          }
          return newItem;
        });
        this.paginationSparepartOut.current = res.body.pageIndex;
        this.paginationSparepartOut.total = res.body.total;
        this.paginationSparepartOut.pageSize = res.body.pageSize;
      });
      // let arr3 = []
      // for (let i = 0; i < this.spartPartDataSource.length; i++) {
      //   for (let j = 0; j < this.spartPartDataSourceKey.length; j++) {
      //     if (
      //       this.spartPartDataSource[i].id == this.spartPartDataSourceKey[j]
      //     ) {
      //       arr3.push(this.spartPartDataSource[i])
      //     }
      //   }
      // }
      // // this.spartPartDataSourceKey = [];
      // this.spartPartDataSourceOut = arr3
      this.visibleSparepart = false;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    spartPartDataSourceChange(selectedRowKeys) {
      this.spartPartDataSourceKey = selectedRowKeys;
    },
    //获取备品备件列表
    getSpareparts() {
      getListForSparepart(this.selectFrom).then((res) => {
        this.paginationSparepart.current = res.body.pageIndex;
        this.paginationSparepart.total = res.body.total;
        this.paginationSparepart.pageSize = res.body.pageSize;
        this.spartPartDataSource = res.body.data;
        this.spartPartDataSourceTwo = res.body.data;
      });
      this.selectedRowKeys3 = [];
    },
    selectSparepart() {
      this.visibleSparepart = true;
    },
    // 公共方法查询
    inSerach() {
      this.equipmentObject = {};
      this.equipmentList.forEach((item) => {
        this.equipmentObject[item.type] = item.value;
      });
      this.queryPageListForUnClass(1, 10, this.equipmentObject);
    },
    queryPageListForUnClass(pageIndex = 1, pageSize = 10, mapEntity = {}) {
      let params = {
        pageNum: pageIndex,
        pageSize: pageSize,
        searchMap: mapEntity,
      };
      // queryCommonColumn().then((res) => {
      //   console.log(res, 'res.....')
      //   this.columnsEquipment = []
      //   res.body.data.forEach((item) => {
      //     if (item !== null) {
      //       this.columnsEquipment.push({
      //         title: item.characterDesc,
      //         dataIndex: item.characterCode,
      //         width: 100,
      //       })
      //     }
      //   })
      // })
      this.columnsEquipment = [
        {
          title: "设备名称",
          dataIndex: "classific_name",
          width: 100,
        },
        {
          title: "设备位号",
          dataIndex: "eqm_sbwh",
          width: 100,
        },
        {
          title: "设备编号（设备编码）",
          dataIndex: "eqm_sbbm",
          width: 130,
        },
        {
          title: "所属设备",
          dataIndex: "eqm_sssb",
          width: 100,
        },
        {
          title: "使用单位",
          dataIndex: "user",
          width: 100,
        },
        {
          title: "型号规格",
          dataIndex: "eqm_xhgg",
          width: 100,
        },
      ];
      queryPageListForUnClass(params).then((res) => {
        this.EquipmentDataSource = res.body.data;
        this.paginationThree.current = res.body.pageIndex;
        this.paginationThree.total = res.body.total;
        this.paginationThree.pageSize = res.body.pageSize;
      });
    },
    // 公共查询条件
    queryPublicSearchColumn() {
      queryPublicSearchColumn().then((res) => {
        let arr = [];
        res.body.data.forEach((item) => {
          if (item !== null) {
            arr.push({
              label: item.characterDesc,
              type: item.characterCode,
              value: "",
            });
            this.equipmentList = arr;
          }
        });
      });
    },
    // 数据字典
    encode() {
      encode("AQYH-QYMC").then((res) => {
        res.body.data.forEach((item) => {
          this.Config.formDataList[4].optionData.push({
            value: item.dictcode,
            label: item.dictname,
          });
        });
      });
      encode("SBGL-JH-ZYZY").then((res) => {
        res.body.data.forEach((item) => {
          this.Config.formDataList[7].optionData.push({
            value: item.dictcode,
            label: item.dictname,
          });
        });
      });
    },
    handleChange(value) {
      if (value.label == "是否在账设备" && value.value == "是") {
        this.$refs.Form.upDate("devicename", "type", "btnInput");
        this.$refs.Form.upDate("devicename", "disabled", true);
        // this.$refs.Form.upDate('deviceno', 'disabled', true)
        this.$refs.Form.upDate("devicetagno", "disabled", true);
      } else if (value.label == "是否在账设备" && value.value == "否") {
        this.$refs.Form.upDate("devicename", "type", "input");
        this.$refs.Form.upDate("devicename", "disabled", false);
        // this.$refs.Form.upDate('deviceno', 'disabled', false)
        this.$refs.Form.upDate("devicetagno", "disabled", false);
      }
    },
    onSelectChangeTwo(selectedRowKeysTwo) {
      this.selectedRowKeysTwo = [
        selectedRowKeysTwo[selectedRowKeysTwo.length - 1],
      ];
    },
    onSelectChangeThree(selectedRowKeys, selectedRow) {
      this.selectedRowKeysThree = [selectedRowKeys[selectedRowKeys.length - 1]];
      this.selectedRowThree = [selectedRow[selectedRow.length - 1]];
    },
    yes(value) {
      for (let i = 0; i < this.companyDataSource.length; i++) {
        if (this.companyDataSource[i].id == this.selectedRowKeysTwo[0]) {
          this.$refs.Form.upDate(
            "inspectioncompanyname",
            "value",
            this.companyDataSource[i].outsourceCompany
          );
          this.visibleCompany = false;
          return false;
        }
      }
    },
    enterButton(value) {
      if (value.label == "设备名称") {
        this.visibleEquipmentName = true;
      } else if (value.label == "维修单位名称") {
        this.visibleCompany = true;
      }
      this.modelConfigCompany.title = value.label;
    },
    Submit() {
      const that = this;
      yearPlanSubmit({ id: that.$route.query.id }).then((res) => {
        if (res.code == 200) {
          this.$message.success("提交成功！");
        }
      });
    },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    cancel() {
      this.visible = false;
      this.selectedRowKeysTwo = [];
    },
    cancelCompany() {
      this.visibleCompany = false;
    },
    cancelEquipment() {
      this.visibleEquipmentName = false;
    },
    save(value) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          var dataBox = [];
          this.spartPartDataSourceOut.forEach((item) => {
            dataBox.push({
              annualplanno: item.annualPlanNo,
              classificationno: item.classificationNo,
              createddatetime: item.createdDateTime,
              createduser: item.createdUser,
              createduserid: item.createdUserID,
              createusersubsidiaryorgan: item.createUserSubsidiaryOrgan,
              deleteflg: item.deleteFlg,
              devicetype: item.deviceType,
              emid: item.emId,
              existingnumber: item.planCostCount ? item.planCostCount : 0,
              id: item.id,
              inspectionplanno: item.inspectionPlanNo,
              lastmodifieddatetime: item.lastModifiedDateTime,
              lastmodifieduser: item.lastModifiedUser,
              lastmodifieduserid: item.lastModifiedUserID,
              materialcode: item.materialCode,
              monthlyplanno: item.monthlyPlanNo,
              orderno: item.orderNo,
              referenceunitprice: item.referenceUnitPrice,
              sparepartname: item.sparePartName,
              specificationormaterial: item.specificationOrMaterial,
              unit: item.unit,
            });
          });
          value.sparePart = dataBox;
          if (value.id) {
            edit(value).then((res) => {
              if (res.code == 200) {
                this.visible = false;
                this.$message.success("保存成功！");
                this.echoMap = {};
              } else {
                this.$message.error("保存失败");
              }
              this.getList(1, 10);
            });
          } else {
            value.mainrecordid = this.id;
            value.annualplanno = this.temp;
            // value.deviceno = this.selectedRowThree[0].equipment_no;
            addAnnualInspectionPlan(value).then((res) => {
              console.log(res);
              if (res.code == "true") {
                this.visible = false;
                this.$message.success("新增成功！");
                this.echoMap = {};
              } else {
                this.$message.warning("新增失败！");
              }
              this.getList();
            });
          }
        } else {
          this.$message.warning("请输入正确格式的数据！");
        }
        this.getList();
      });
    },
    edit(value) {
      this.spartPartDataSourceKey = [];
      this.modelConfig.title = "年度计划-编辑";
      this.visible = true;
      this.echoMap = value;
      this.getSparepartsIn(value);
    },
    addRecord() {
      this.selectedRowKeysThree = [];
      this.spartPartDataSourceOut = [];
      this.spartPartDataSourceKey = [];
      const that = this;
      this.modelConfig.title = "年度计划-新增";
      this.echoMap = {};
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.Form.upDate();
        this.$refs.Form.upDate("devicename", "type", "input");
        this.$refs.Form.upDate("devicename", "disabled", false);
        // this.$refs.Form.upDate('deviceno', 'disabled', false)
        this.$refs.Form.upDate("devicetagno", "disabled", false);
      });
      this.getList();
    },
    go() {
      this.$router.push({
        path: "/annualMaintenance",
      });
    },
    mydelete() {
      console.log("delete", this.selectedRowKeys == "");
      if (this.selectedRowKeys == "") {
        this.$message.warning("请选择记录！");
      } else {
        deleteAnnualInspectionPlan(this.selectedRowKeys).then((res) => {
          this.getList();
          this.$message.error("删除成功！");
        });
      }
      this.selectedRowKeys = [];
    },
    getOutsourceCompany(pageNum = 1, pageSize = 10, outsourceCompany) {
      getListForPage({
        pageNum: pageNum,
        pageSize: pageSize,
        outsourceCompany: outsourceCompany,
      }).then((res) => {
        this.companyDataSource = res.body.data;
        this.paginationTwo.current = res.body.pageIndex;
        this.paginationTwo.total = res.body.total;
        this.paginationTwo.pageSize = res.body.pageSize;
      });
    },
    getList(pageNum = 1, pageSize = 10) {
      const that = this;
      findYearList({
        planyear: that.$route.query.planYear,
      }).then((res) => {
        this.temp = res.body.data[0].planYearNo;
        this.id = res.body.data[0].id;
        console.log(this.temp, 444444);
        queryDetailsByAnnualPlanNo({
          pageNum: pageNum,
          pageSize: pageSize,
          AnnualPlanNo: this.temp,
        }).then((res) => {
          this.dataSource = res.body.data;
          console.log(res.body.data, 123);
          this.pagination.current = res.body.pageIndex;
          this.pagination.total = res.body.total;
          this.pagination.pageSize = res.body.pageSize;
        });
      });
    },
    paginationChange(pagination) {
      this.getList(pagination.current, pagination.pageSize);
    },
    paginationChangeIn(pagination) {
      this.getOutsourceCompany(pagination.current, pagination.pageSize);
    },
    paginationChangeInTwo(pagination) {
      this.queryPageListForUnClass(
        pagination.current,
        pagination.pageSize,
        this.equipmentObject
      );
    },
    confirm() {
      this.mydelete();
    },
  },
};
</script>
<style scoped>
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}

.footer {
  display: flex;
  justify-content: center;
}
</style>
<style>
.ant-table-tbody > tr > td.ant-table-selection-column,
.ant-table-thead > tr > th.ant-table-selection-column {
  text-align: left;
}
</style>
