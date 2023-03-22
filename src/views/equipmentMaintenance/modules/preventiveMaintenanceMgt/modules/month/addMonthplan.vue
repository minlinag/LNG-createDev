<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[
            {
              value: 'Download',
              clickName: 'download',
              name: '模板下载',
              icon: 'export-icon',
              isPower: false,
            },
            {
              value: 'importComponent',
              url: '/monthly/importExcel',
              accept: '.xlsx',
            },
            { value: 'Add', clickName: 'addMonth' },
            { value: 'Delete', clickName: 'confirm' },
            {
              value: 'Go',
              clickName: 'go',
              icon: 'Go-icon',
              name: '返回',
              isPower: false,
            },
          ]"
          @download="download"
          @addMonth="handleOk"
          @confirm="confirm"
          @go="go"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div>
        <a-form-model v-model="form" :layout="'inline'">
          <a-col :span="8">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="月度计划编码:"
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
          :pagination="pagination"
        >
          <template slot="sparePart" slot-scope="row">
            <span class="edit" @click="lookbpbj(row)">查看</span>
          </template>
          <template slot="operation" slot-scope="row">
            <pe-button
              :include="[
                {
                  value: 'Edit',
                  icon: '',
                  type: 'link',
                  style: ['btn_link'],
                  clickName: 'edit',
                  name: '编辑',
                },
              ]"
              @edit="edit(row)"
            ></pe-button>
          </template>
        </dc-table>
        <!-- 月度计划新增 -->
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
        <!-- 查看备品备件 -->
        <dc-Model
          v-model="visibleSpareparts"
          :modelConfig="modelConfigSpareparts"
          class="from-style bigModel"
        >
          <a-form-model>
            <dc-table
              :row-selection="{
                selectedRowKeys: selectedRowKeysSpare,
                onChange: onSelectChangeSpare,
              }"
              rowKey="id"
              :scroll="{ x: 100 }"
              :columns="columnsSpareparts"
              :dataSource="sparepartsDataSource"
              :openSelector="false"
            ></dc-table>
          </a-form-model>
        </dc-Model>
        <!-- 检维修单位 -->
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
              :row-selection="{
                selectedRowKeys: selectedRowKeysCompany,
                onChange: onSelectChangeCompany,
                type: 'radio',
              }"
              rowKey="id"
              :scroll="{ x: 100 }"
              :columns="columnsCompany"
              :dataSource="companyDataSource"
              :pagination="paginationCompany"
              @change="paginationChangeCompany"
              :openSelector="false"
            >
            </dc-table>
          </a-form-model>
          <div class="ant-modal-footer">
            <a-button type="primary" @click="yes"> 确定 </a-button>
            <a-button @click="cancelCompany">取消</a-button>
          </div>
        </dc-Model>
        <!-- 设备名称 -->
        <dc-Model
          v-model="visibleEquipmentName"
          :modelConfig="modelConfigEquipment"
          class="from-style bigModel"
        >
          <a-form-model v-model="form">
            <a-col
              :span="12"
              v-for="(item, index) in equipmentList"
              :key="item.type"
            >
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                :label="item.label"
              >
                <a-input ref="select" v-model="item.value"></a-input>
              </a-form-model-item>
            </a-col>
            <div class="queryItem">
              <a-button type="primary" @click="inSerach"> 查询 </a-button>
              <a-button @click="inReform"> 重置 </a-button>
            </div>
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

          <div class="ant-modal-footer">
            <a-button type="primary" @click="EquipmentNameClick()">
              确定
            </a-button>
            <a-button @click="cancelEquipment" :style="{ marginLeft: '8px' }"
              >取消</a-button
            >
          </div>
        </dc-Model>
        <add-month-form
          :addFormVisible="addFormVisible"
          @close="addMonthFormClose"
          @saveAddForm="saveAddForm"
          ref="addMonthFormRef"
        ></add-month-form>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  monthlyPost,
  monthlyPut,
  deleteMonthlyPlan,
  monthOption,
  queryDetailsByMonthlyPlanNo,
} from "@/api/monthMaintenance";
import {
  queryPublicSearchColumn,
  // queryCommonColumn,
  queryPageListForUnClass,
  monthPlanSubmit,
} from "@/api/PublicInterface";
import { getListById, getIdListForSparepart } from "@/api/sparesprt";
import { getListForPage, companySelect } from "@/api/outsourceCompany";
import { getListForSparepart } from "@/api/sparesprt";
import { encode } from "@/api/dataDictionary";
import utils from "@/utils/url";
import AddMonthForm from "./components/addMonthForm.vue";

export default {
  components: { AddMonthForm },
  data() {
    return {
      addFormVisible: false,
      selectFrom: {
        deviceName: "",
        deviceType: "",
        materialCode: "",
        sparePartName: "",
        pageNum: 1,
        pageSize: 10,
      },
      columnsSpareparts: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 70,
          align: "center",
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 150,
          align: "center",
        },
        {
          title: "物资编码",
          dataIndex: "materialCode",
          width: 100,
          align: "center",
        },
        {
          title: "规格型号",
          dataIndex: "specificationOrMaterial",
          width: 100,
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "planCostCount",
          width: 100,
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 150,
          align: "center",
        },
      ],
      urls: "/monthly/downloadTemplate",
      spartPartDataSourceTwo: [],
      companyDataSourceSelect: [],
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
      visibleEquipmentName: false,
      equipmentList: [],
      EquipmentDataSource: [],
      columnsEquipment: [],
      selectedRowKeysThree: [],
      selectedRowKeysSpare: [],
      visibleSpareparts: false,
      sparepartsDataSource: [],
      selectedRowThree: [],
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
      // 维修单位页码
      paginationCompany: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
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
      modelConfig: {
        width: "950px",
        title: " 月度计划",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfigSparepart: {
        width: "950px",
        title: " 备品备件",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfigSpareparts: {
        width: "950px",
        title: " 备品备件",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfigCompany: {
        width: "950px",
        title: "维修单位名称 ",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      modelConfigEquipment: {
        width: "950px",
        title: "设备名称 ",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      // 备品备件
      columnsModel: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.paginationSparepart.current - 1) *
            this.paginationSparepart.pageSize +
            index +
            1
            }`,
          width: 50,
          align: "center",
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 100,
          align: "center",
        },
        {
          title: "物资编码",
          dataIndex: "materialCode",
          width: 100,
          align: "center",
        },
        {
          title: "规格/材质",
          dataIndex: "specificationOrMaterial",
          width: 100,
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "planCostCount",
          width: 100,
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 150,
          align: "center",
        },
      ],
      columnsModelOut: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.paginationSparepartOut.current - 1) *
            this.paginationSparepartOut.pageSize +
            index +
            1
            }`,
          width: 50,
          align: "center",
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 100,
          align: "center",
        },
        {
          title: "物资编码",
          dataIndex: "materialCode",
          width: 100,
          align: "center",
        },
        {
          title: "规格/材质",
          dataIndex: "specificationOrMaterial",
          width: 100,
          align: "center",
        },
        {
          title: "数量",
          dataIndex: "planCostCount",
          width: 100,
          scopedSlots: { customRender: "inputText" },
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 150,
          align: "center",
        },
      ],
      // 检维修单位
      columnsCompany: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.paginationCompany.current - 1) *
            this.paginationCompany.pageSize +
            index +
            1
            }`,
          width: 50,
          align: "center",
        },
        {
          title: "检维修单位名称",
          dataIndex: "outsourceCompany",
          align: "center",
        },
        {
          title: "检维修单位联系人",
          dataIndex: "personInCharge",
          align: "center",
        },
      ],

      form: {
        month: "",
      },
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
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
        //   title: "设备编码",
        //   dataIndex: "deviceno",
        //   width: 150,
        // },
        {
          title: "设备位号",
          dataIndex: "devicetagno",
          width: 100,
          align: "center",
        },
        {
          title: "计划检修日期",
          dataIndex: "planmaintenancedatetime",
          width: 150,
          align: "center",
        },
        {
          title: "责任人",
          dataIndex: "personincharge",
          width: 80,
          align: "center",
        },
        {
          title: "所属区域",
          dataIndex: "area",
          width: 100,
          align: "center",
        },
        {
          title: "检维修问题信息描述",
          dataIndex: "maintenancedescription",
          width: 140,
          align: "center",
        },
        {
          title: "计划维修天数",
          dataIndex: "plannedmaintenancetime",
          width: 100,
          align: "center",
        },
        {
          title: "专业",
          dataIndex: "major",
          width: 130,
          align: "center",
        },
        {
          title: "作业内容",
          dataIndex: "operationcontent",
          width: 100,
          align: "center",
        },
        {
          title: "备品备件清单",
          scopedSlots: { customRender: "sparePart" },
          // scopedSlots: { customRender: 'bpbj' },
          width: 100,
          align: "center",
        },
        {
          title: "预估费用（元）",
          dataIndex: "plannedcost",
          width: 120,
          align: "center",
        },
        {
          title: "是否影响外输/接卸船",
          dataIndex: "whetheraffectexportorship",
          customRender: (value, row, index) => {
            return {
              children: value == "1" ? "是" : "否",
              attrs: { rowSpan: 1 },
            };
          },
          width: 150,
          align: "center",
        },
        {
          title: "需工艺条件",
          dataIndex: "requiredprocesscondition",
          width: 100,
          align: "center",
        },
        {
          title: "维修单位名称",
          dataIndex: "inspectioncompanyname",
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
          width: 100,
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: "center",
        },
      ],
      echoMap: {},
      // enterButton:{},
      temp: "",
      dataSource: [],
      selectedRowKeys: [],
      selectedRowKeysCompany: [],
      spartPartDataSourceKey: [],
      companyVisible: false,
      visibleSparepart: false,
      selectedRows: [],
      visible: false,
      visibleCompany: false,
      spartPartDataSource: [],
      spartPartDataSourceOut: [],
      companyDataSource: [],
    };
  },
  mounted() {
    this.getList();
    this.getOutsourceCompany();
    this.getCompanySelect();
    this.getSpareparts();
    this.queryPublicSearchColumn();
    this.queryPageListForUnClass();
  },
  methods: {
    handleOk() {
      this.addFormVisible = true;
    },
    addMonthFormClose() {
      this.addFormVisible = false;
    },
    disabledDate(current) {
      return current && current < moment().endOf("day");
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
    /****
     * selectlistUpData
     * 列表编辑查询详情方法   ---刘豪东修改
     * 点击编辑获取列表数据row 循环赋值
     * 调用接口 获取设备备件列表明细 赋值给列表
     * ***/
    getSparepartsIn(row, type) {
      // 获取备品备件数据赋值给spartPartDataSourceOut渲染备品备件列表
      getListById({ ID: row.id }).then((res) => {
        res.body.forEach((item) => {
          this.$refs.addMonthFormRef.spartPartDataSourceOut.push(item.materialCode);
        });
        if (!type) {
          this.$refs.addMonthFormRef.spartPartDataSourceOut = res.body;
        } else {
          this.sparepartsDataSource = res.body;
        }
      });
    },
    lookbpbj(row) {
      this.visibleSpareparts = true;
      this.getSparepartsIn(row, 1);
    },
    //获取备品备件列表selectFrom
    getSpareparts() {
      getListForSparepart(this.selectFrom).then((res) => {
        this.paginationSparepart.current = res.body.pageIndex;
        this.paginationSparepart.total = res.body.total;
        this.paginationSparepart.pageSize = res.body.pageSize;
        this.spartPartDataSource = res.body.data;
        this.spartPartDataSourceTwo = res.body.data;
        this.spartPartDataSourceOut = res.body.data;
      });
      this.selectedRowKeys3 = [];
    },
    paginationChangeSparepart(pagination) {
      this.selectFrom.pageNum = pagination.current;
      this.selectFrom.pageSize = pagination.pageSize;
      this.getSpareparts(pagination.current, pagination.pageSize);
    },
    // 备品备件
    paginationChangeSparepartOut(pagination) {
      this.paginationSparepartOut.current = pagination.current;
      this.paginationSparepartOut.pageSize = pagination.pageSize;
      this.getSpareparts(pagination.current, pagination.pageSize);
    },
    EquipmentNameClick() {
      this.$refs.Form.upDate(
        "devicename",
        "value",
        this.selectedRowThree[0].equipment_name
      );
      this.$refs.Form.upDate(
        "devicetagno",
        "value",
        this.selectedRowThree[0].equipment_tag_no
      );
      this.visibleEquipmentName = false;
    },
    onSelectChangeThree(selectedRowKeys, selectedRow) {
      this.selectedRowKeysThree = [selectedRowKeys[selectedRowKeys.length - 1]];
      this.selectedRowThree = [selectedRow[selectedRow.length - 1]];
    },
    enterButton(value) {
      if (value.label == "设备名称") {
        this.visibleEquipmentName = true;
      } else if (value.label == "维修单位名称") {
        this.visibleCompany = true;
      }
    },
    // 公共方法查询
    inSerach() {
      this.equipmentObject = {};
      this.equipmentList.forEach((item) => {
        this.equipmentObject[item.type] = item.value;
      });
      this.queryPageListForUnClass(1, 10, this.equipmentObject);
    },
    // 公共方法重置
    inReform() {
      this.equipmentObject = {};
      this.queryPageListForUnClass(1, 10, this.equipmentObject);
    },
    queryPageListForUnClass(pageIndex = 1, pageSize = 10, mapEntity = {}) {
      let params = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        searchMap: mapEntity,
      };
      this.columnsEquipment = [
        {
          title: "设备名称",
          dataIndex: "equipment_name",
          width: 100,
        },
        {
          title: "设备位号",
          dataIndex: "equipment_tag_no",
          width: 100,
        },
        {
          title: "设备编号（设备编码）",
          dataIndex: "equipment_no",
          width: 130,
        },
        {
          title: "所属设备",
          dataIndex: "equipment",
          width: 100,
        },
        {
          title: "使用单位",
          dataIndex: "user",
          width: 100,
        },
        {
          title: "型号规格",
          dataIndex: "model_and_specification",
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
    paginationChangeInTwo(pagination) {
      this.queryPageListForUnClass(
        pagination.current,
        pagination.pageSize,
        this.equipmentObject
      );
    },
    // 月度计划审批
    submit() {
      monthPlanSubmit({ id: this.$route.query.monthlyplanno }).then((res) => {
        if (res.code == 200) {
          this.$message.success("提交成功！");
          this.getList();
        }
      });
    },
    handleChangeEquipment(value) {
      if (value.label == "是否在账设备" && value.value == "是") {
        this.$refs.Form.upDate("devicename", "type", "btnInput");
        this.$refs.Form.upDate("devicename", "disabled", true);
        this.$refs.Form.upDate("deviceno", "disabled", true);
        this.$refs.Form.upDate("devicetagno", "disabled", true);
      } else if (value.label == "是否在账设备" && value.value == "否") {
        this.$refs.Form.upDate("devicename", "type", "input");
        this.$refs.Form.upDate("devicename", "disabled", false);
        this.$refs.Form.upDate("deviceno", "disabled", false);
        this.$refs.Form.upDate("devicetagno", "disabled", false);
      }
    },
    handleChangeCompany(selectListCompany) {
      this.getOutsourceCompany(1, 10, selectListCompany);
    },
    selectSparepart() {
      this.visibleSparepart = true;
    },
    onSelectChange(key, row) {
      this.selectedRowKeys = key;
      this.selectedRows = row;
    },
    onSelectChangeSpare(key) {
      this.selectedRowKeysSpare = key;
    },
    spartPartDataSourceChange(selectedRowKeys) {
      this.spartPartDataSourceKey = selectedRowKeys;
    },
    onSelectChangeCompany(selectedRowKeysCompany) {
      this.selectedRowKeysCompany = selectedRowKeysCompany;
    },
    go() {
      this.$router.push({
        path: "/monthMaintenance",
      });
    },
    /****
     * 月度计划保存修改--刘豪东修改
     *1.sparePart么有接收到参数spartPartDataSourceOut
     *2.spartPartDataSourceOut里边的参数为驼峰命名法
     *3.sparePart接收的为全小写需要循环下spartPartDataSourceOut数组里边的对象
     * 4.dataBox数组接收处理的数据赋值给sparePart
     * * *****/
    // save(value) {
    //   debugger
    //   this.$refs.Form.verificationRules((valid) => {
    //     if (valid) {
    //       var dataBox = [];
    //       this.spartPartDataSourceOut.forEach((item) => {
    //         dataBox.push({
    //           annualplanno: item.annualPlanNo,
    //           classificationno: item.classificationNo,
    //           createddatetime: item.createdDateTime,
    //           createduser: item.createdUser,
    //           createduserid: item.createdUserID,
    //           createusersubsidiaryorgan: item.createUserSubsidiaryOrgan,
    //           deleteflg: item.deleteFlg,
    //           devicetype: item.deviceType,
    //           emid: item.emId,
    //           existingnumber: item.planCostCount ? item.planCostCount : 0,
    //           id: item.id,
    //           inspectionplanno: item.inspectionPlanNo,
    //           lastmodifieddatetime: item.lastModifiedDateTime,
    //           lastmodifieduser: item.lastModifiedUser,
    //           lastmodifieduserid: item.lastModifiedUserID,
    //           materialcode: item.materialCode,
    //           monthlyplanno: item.monthlyPlanNo,
    //           orderno: item.orderNo,
    //           referenceunitprice: item.referenceUnitPrice,
    //           sparepartname: item.sparePartName,
    //           specificationormaterial: item.specificationOrMaterial,
    //           unit: item.unit,
    //         });
    //       });
    //       value.sparePart = dataBox;
    //       let newValue = value;
    //       newValue.inspectioncompanyname = this.selectedRowKeysCompany[0];
    //       const dateTime = newValue.planmaintenancedatetime.split("-");
    //       if (newValue.id) {
    //         if (
    //           this.$route.query.planYear <= dateTime[0] &&
    //           this.$route.query.planMonth < dateTime[1] &&
    //           newValue.remark == 0
    //         ) {
    //           this.$message.warning("跨月度请填写备注");
    //         } else {
    //           monthlyPut(newValue).then((res) => {
    //             if (res.code == "true") {
    //               this.visible = false;
    //               this.$message.success("编辑成功");
    //             } else {
    //               this.$message.error("编辑失败");
    //             }
    //             this.getList();
    //             this.visible = false;
    //           });
    //         }
    //       } else {
    //         newValue.monthlyplanno = this.temp;
    //         newValue.annualplanno = this.$route.query.planYearNo;
    //         newValue.mainrecordid = this.$route.query.planMonthNo;
    //         newValue.planmonth = this.$route.query.planMonth;
    //         newValue.planyear = this.$route.query.planYear;
    //         newValue.deviceno = this.selectedRowThree[0].equipment_no;
    //         monthlyPost(newValue).then((res) => {
    //           if (res.code == "true") {
    //             this.$message.success("新增成功");
    //             this.visible = false;
    //             this.echoMap = {};
    //           } else {
    //             this.$message.warning("新增失败！");
    //           }
    //           this.getList();
    //           // this.getSparepartsIn(row)
    //         });
    //       }
    //     } else {
    //       this.$message.warning("请输入正确格式的数据！");
    //     }
    //   });
    // },
    saveAddForm(value, spartPartDataSourceOut) {
      var dataBox = [];
      spartPartDataSourceOut.forEach((item) => {
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
      let newValue = value;
      if (newValue.id) {
        // if (
        //   this.$route.query.planYear <= dateTime[0] &&
        //   this.$route.query.planMonth < dateTime[1] &&
        //   newValue.remark == 0
        // ) {
        //   this.$message.warning("跨月度请填写备注");
        // } else {
        monthlyPut(newValue).then((res) => {
          if (res.code == "true") {
            this.visible = false;
            this.$message.success("编辑成功");
          } else {
            this.$message.error("编辑失败");
          }
          this.getList();
          this.visible = false;
        });
        // }
      } else {
        newValue.monthlyplanno = this.temp;
        newValue.annualplanno = this.$route.query.planYearNo;
        newValue.mainrecordid = this.$route.query.planMonthNo;
        newValue.planmonth = this.$route.query.planMonth;
        newValue.planyear = this.$route.query.planYear;
        monthlyPost(newValue).then((res) => {
          if (res.code == "true") {
            this.$message.success("新增成功");
            this.visible = false;
            this.echoMap = {};
          } else {
            this.$message.warning("新增失败！");
          }
          this.getList();
          // this.getSparepartsIn(row)
        });
      }
    },
    /****
     *点击表格编辑弹出框逻辑修改 ---刘豪东
     * getSparepartsIn(row) 么有找到行参数
     * 改为循环dataSource数组比对数据
     * 取到当前行的数据调用getSparepartsIn()方法
     * back()退出循环
     ****/
    //列表行修改
    edit(value) {
      this.addFormVisible = true;
      this.modelConfig.title = "月度计划-编辑";
      this.$refs.addMonthFormRef.form = this.$lodash.cloneDeep(value);
      this.getSparepartsIn(value);
    },
    //获取列表
    getList(pageNum = 1, pageSize = 10) {
      this.temp = this.$route.query.planMonthNo;
      queryDetailsByMonthlyPlanNo({
        pageNum: pageNum,
        pageSize: pageSize,
        monthlyplanno: this.$route.query.planMonthNo,
      }).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.total = res.body.total;
        this.pagination.pageSize = res.body.pageSize;
      });
    },
    //获取外委单位列表
    getOutsourceCompany(pageNum = 1, pageSize = 10, outsourceCompany) {
      getListForPage({
        pageNum: pageNum,
        pageSize: pageSize,
        outsourceCompany: outsourceCompany,
      }).then((res) => {
        this.companyDataSource = res.body.data;
        this.paginationCompany.current = res.body.pageIndex;
        this.paginationCompany.total = res.body.total;
        this.paginationCompany.pageSize = res.body.pageSize;
      });
    },
    getCompanySelect() {
      companySelect().then((res) => {
        this.companyDataSourceSelect = res.body;
      });
    },
    paginationChangeCompany(pagination) {
      this.getOutsourceCompany(pagination.current, pagination.pageSize);
    },
    mydelete() {
      if (this.selectedRowKeys.length > 0) {
        deleteMonthlyPlan(this.selectedRowKeys).then((res) => {
          if (res.code == "true") {
            this.getList();
            this.$message.success("删除成功！");
            this.selectedRowKeys = [];
          }
        });
      } else {
        this.$message.warning("请选择记录！");
      }
    },
    // mydeleteRight(value) {
    //   var arr = new Array(value.id);
    //   deleteMonthlyPlan(arr).then((res) => {
    //     if (res.code == "true") {
    //       if (this.selectedRowKeys.length > 0) {
    //         // this.selectedRowsKeys---数组中的值
    //         this.selectedRowKeys.forEach((element, index) => {
    //           // index---下标
    //           if (element === value.id) {
    //             this.selectedRowKeys.splice(index, 1);
    //             // 跳出箭头函数
    //             return false;
    //           }
    //         });
    //       }
    //       this.getList();
    //       this.$message.success("删除成功！");
    //     }
    //   });
    // },
    confirm() {
      this.mydelete();
      this.echoMap = {};
    },
    cancelEquipment(value) {
      this.visibleEquipmentName = false;
    },
    cancel(value) {
      this.visible = false;
    },
    cancelCompany(value) {
      this.visibleCompany = false;
    },
    yes(value) {
      for (let i = 0; i < this.companyDataSource.length; i++) {
        if (this.companyDataSource[i].id == this.selectedRowKeysCompany[0]) {
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
    no(value) {
      console.log(value, "取消");
      this.visibleSparepart = false;
    },
    /********
     *  //备品备件弹出框选择确定方法-刘豪东修改
     *  spartPartDataSource 后台返回的表格数组
     *  spartPartDataSourceKey选择框表格选中的数据Key
     *  循环两个数组 取到对应的值push到Arr3数组内
     *  赋值给spartPartDataSourceOut
     *  spartPartDataSourceKey=[]不能在这里赋值为空
     *  赋值为空选择编辑的时候不知道选择那个数据
     *  可以在弹出框点击的时候 或数据保存修改成功的时候赋值为空
     * *******/
    ok(value) {
      getIdListForSparepart({
        list: this.spartPartDataSourceKey,
        pageSize: 10,
        pageIndex: 1,
      }).then((res) => {
        this.spartPartDataSourceOut = res.body.data;
        this.paginationSparepartOut.current = res.body.pageIndex;
        this.paginationSparepartOut.total = res.body.total;
        this.paginationSparepartOut.pageSize = res.body.pageSize;
      });
      this.visibleSparepart = false;
    },
    download(val) {
      window.location.href = utils.baseURL + this.urls;
      // window.location.href---打开一个新的地址 = utils.baseURL--引入服务器地址，baseURl是当前使用的服务器的地址 + this.urls---链接的后台接口的地址，urls要在data()return中写
    },
    paginationChange(pagination) {
      this.getList(pagination.current, pagination.pageSize);
    },
  },
};
</script>
<style scoped>
.btn-bpbj {
  /* text-align: center; */
  display: flex;
  justify-content: center;
}

.footer {
  display: flex;
  justify-content: center;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
</style>
