<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb v-if="currentPage == 'main'">
      <template slot="breadcrumbButton">
        <div slot="extra" style="display: flex; justify-content: flex-end">
          <pe-button
            :include="[{ value: 'Delete', clickName: 'deleteListClick' }]"
            @deleteListClick="deleteListClick"
          ></pe-button>
          <ExportComponents
            url="/aqjc/exportAqjc"
            :params="{
              inspectionNo: this.searchForm.inspectionNo,
              inspectionName: this.searchForm.inspectionName,
              inspectionLevel:
                this.searchForm.inspectionLevel == undefined
                  ? ''
                  : this.searchForm.inspectionLevel,
              inspectionCategory:
                this.searchForm.inspectionCategory == undefined
                  ? ''
                  : this.searchForm.inspectionCategory,
              startDatetime:
                this.formTimeData[0] == undefined ? '' : this.formTimeData[0],
              endDatetime:
                this.formTimeData[1] == undefined ? '' : this.formTimeData[1],
              inspectedBy:
                this.searchForm.inspectedBy == undefined
                  ? ''
                  : this.searchForm.inspectedBy,
              inspectedUnit:
                this.searchForm.inspectedUnit == undefined
                  ? ''
                  : this.searchForm.inspectedUnit,
              isRisk:
                this.searchForm.isRisk == undefined
                  ? ''
                  : this.searchForm.isRisk,
              isNotice:
                this.searchForm.isNotice == undefined
                  ? ''
                  : this.searchForm.isNotice,
              checkMainBody:
                this.searchForm.checkMainBody == undefined
                  ? ''
                  : this.searchForm.checkMainBody,
              status: '2%2C3%2C4%2C5%2C6%2C7 ',
            }"
          >
          </ExportComponents>
        </div>
      </template>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <!-- 查询 -->
              <div style="position: relative" class="position-account-search">
                <a-form-model layout="inline" :model="searchForm">
                  <a-row>
                    <a-col :span="6">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="检查编号"
                      >
                        <a-input
                          v-model="searchForm.inspectionNo"
                          placeholder="请输入"
                        ></a-input>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="检查名称"
                      >
                        <a-input
                          v-model="searchForm.inspectionName"
                          placeholder="请输入"
                        ></a-input>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="检查级别"
                      >
                        <a-select
                          v-model="searchForm.inspectionLevel"
                          placeholder="请选择"
                          ref="select"
                          :options="inspectionLevelOptions"
                          :getPopupContainer="getPopupContainer"
                        >
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="检查类别"
                      >
                        <a-select
                          v-model="searchForm.inspectionCategory"
                          show-search
                          placeholder="请选择"
                          option-filter-prop="children"
                          :getPopupContainer="getPopupContainer"
                        >
                          <a-select-option
                            :value="province.dictname"
                            v-for="(
                              province, index
                            ) in inspectionCategoryOption"
                            :key="index"
                          >
                            {{ province.dictname }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="6">
                      <a-form-model-item
                        label="检查时间:"
                        :labelCol="{ style: 'width: 150px' }"
                      >
                        <a-range-picker
                          v-model="formTimeData"
                          @change="onChange"
                          valueFormat="YYYY-MM-DD"
                          :placeholder="['开始日期', '结束日期']"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="检查人"
                      >
                        <a-input
                          v-model="searchForm.inspectedBy"
                          placeholder="请输入"
                        ></a-input>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="被检单位"
                      >
                        <a-select
                          :options="inspectedUnitOptions"
                          v-model="searchForm.inspectedUnit"
                          placeholder="请选择"
                          :getPopupContainer="getPopupContainer"
                        >
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="是否存在隐患"
                      >
                        <a-select
                          v-model="searchForm.isRisk"
                          placeholder="请选择"
                          :getPopupContainer="getPopupContainer"
                        >
                          <a-select-option value="true"> 是 </a-select-option>
                          <a-select-option value="false"> 否 </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="6" class="from_time_data">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="是否下达整改通知"
                      >
                        <a-select
                          v-model="searchForm.isNotice"
                          placeholder="请选择"
                          :getPopupContainer="getPopupContainer"
                        >
                          <a-select-option value="true"> 是 </a-select-option>
                          <a-select-option value="false"> 否 </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6" class="form_model_multiple">
                      <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="检查主体"
                      >
                        <a-popover>
                          <!-- 多选 -->
                          <template slot="content">
                            <span
                              v-for="(item, index) in popoverFormList"
                              :key="item"
                            >
                              {{ item }}
                              {{ ++index == popoverFormList.length ? "" : "," }}
                            </span>
                          </template>

                          <a-select
                            v-model="searchForm.checkMainBody"
                            show-search
                            mode="multiple"
                            placeholder="请选择检查主体"
                            style="width: 100%"
                            option-filter-prop="children"
                            @change="checkMainBodyChange"
                            :getPopupContainer="getPopupContainer"
                          >
                            <a-select-option
                              :value="province.dictname"
                              v-for="(province, index) in checkMainBodyOption"
                              :key="index"
                            >
                              {{ province.dictname }}
                            </a-select-option>
                          </a-select>
                        </a-popover>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-model-item>
                        <a-button
                          v-Query
                          :style="{ marginLeft: '45px' }"
                          type="primary"
                          @click="search"
                        >
                          查询
                        </a-button>
                        <a-button @click="resetForm"> 重置 </a-button>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model>
              </div>
            </a-layout-content>
          </a-layout>
        </div>
        <div class="securityCheck">
          <dc-table
            @change="paginationChange"
            :pagination="pagination"
            rowKey="ID"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              columnWidth: '30px',
              getCheckboxProps: hiddenDangerGetCheckboxProps,
            }"
            :scroll="{ y: 1, x: 100 }"
            class="list_table_3"
            :columns="columns"
            :dataSource="dataSource"
            :openSelector="true"
          >
            <template slot="Status" slot-scope="text">
              {{ text | Status }}
            </template>
            <template slot="operation" slot-scope="row">
              <span
                class="btn_link"
                style="cursor: pointer"
                @click="checkListClick(row, changeValue)"
              >
                详情
              </span>
            </template>
          </dc-table>
        </div>
      </template>
    </Breadcrumb>
    <div class="add-form">
      <security-check-add-form
        :visible="visible"
        :stateMonitorSecurity="stateMonitorSecurity"
        @close="securityFromClose"
        :currentPage="currentPage"
        @currentPageFormChange="currentPageFormChange"
        ref="securityFromRef"
        :securityCheckDisabled="securityCheckDisabled"
        :isShowZG="false"
        :isShowBJ="false"
        :isShowYS="true"
        @passChange="passChangeClick"
        :securityTypeModel="securityTypeModel"
      ></security-check-add-form>
    </div>
  </div>
</template>
<script>
import securityCheckAddForm from "./components/securityCheckAddForm.vue";
import {
  getList,
  deleteList,
  getAqjcForPage,
  aqjcAudio,
  aqjcSubmit,
  exportAqjc,
} from "@/api/securityCheck";
import { encode } from "@/api/dataDictionary";
import { companySelect } from "@/api/JSAAnalysis";
import { filterTime } from "@/utils/utils";

export default {
  components: {
    securityCheckAddForm,
  },
  filters: {
    Status(val) {
      let value = "";
      switch (val) {
        case "1":
          value = "已保存";
          break;
        case "2":
          value = "未整改";
          break;
        case "3":
          value = "整改中";
          break;
        case "4":
          value = "已整改";
          break;
        case "5":
          value = "已提交";
          break;
        case "6":
          value = "审批中";
          break;
        case "7":
          value = "已验收";
          break;
        case "8":
          value = "已拒绝";
          break;
        default:
          break;
      }
      return value;
    },
  },
  name: "",
  // 临时
  // components:{},
  // props:{},
  data() {
    return {
      securityTypeModel: { type: "security", title: "安全检查" },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      inspectedUnitOptions: [],
      company: [], //外委单位下拉框
      departmentOption: [],
      //检查级别下拉框
      inspectionLevelOptions: [
        { label: "公司级检查", value: "公司级检查" },
        { label: "部门级检查", value: "部门级检查" },
        { label: "班组级检查", value: "班组级检查" },
      ],
      currentPage: "main",
      inspectionCategoryOption: [], //检查类别下拉框
      checkMainBodyOption: [], //检查主体
      stateMonitorSecurity: "",
      //查询所需的数据
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        inspectionNo: "",
        inspectionName: "",
        inspectionLevel: undefined,
        inspectionCategory: undefined,
        startDatetime: "",
        endDatetime: "",
        checkMainBody: [],
        inspectedBy: "",
        inspectedUnit: undefined,
        isRisk: undefined,
        isNotice: undefined,
        status: "2,3,4,5,6,7",
      },
      flieChanges: {},
      flieChangeChecks: {},
      visible: false,
      formTimeData: [],
      confirmLoading: false,
      labelCol: { span: 6 },
      securityCheckDisabled: "add",
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
          align: "center",
        },
        {
          title: "检查编号",
          dataIndex: "InspectionNo",
          width: 160,
          align: "center",
        },
        {
          title: "检查名称",
          dataIndex: "InspectionName",
          width: 160,
          align: "center",
        },
        {
          title: "检查级别",
          dataIndex: "InspectionLevel",
          width: 100,
          align: "center",
        },
        {
          title: "检查类别",
          dataIndex: "InspectionCategory",
          width: 180,
          align: "center",
        },
        {
          title: "检查时间",
          dataIndex: "FormTimeData",
          width: 110,
          customRender: (value, row, index) => {
            return {
              children: `${filterTime(row.InspectionTimeStart)}`,
              attrs: { rowSpan: 1 },
            };
          },
          align: "center",
        },
        {
          title: "检查主体",
          dataIndex: "CheckMainBody",
          width: 120,
          align: "center",
        },
        {
          title: "检查人",
          dataIndex: "InspectedBy",
          width: 100,
          align: "center",
        },
        {
          title: "被检单位",
          dataIndex: "InspectedUnit",
          customRender: (text) =>
            (text = this.inspectedUnitOptions.filter(
              (obj) => text === obj.value
            )[0]?.label),
          width: 120,
          align: "center",
        },
        {
          title: "是否存在隐患",
          dataIndex: "IsRisk",
          width: 100,
          customRender: (value, row, index) => {
            return {
              children: value ? "是" : "否",
              attrs: { rowSpan: 1 },
            };
          },
          align: "center",
        },
        {
          title: "是否下达隐患整改通知单",
          dataIndex: "IsNotice",
          width: 180,
          customRender: (value, row, index) => {
            return {
              children: value ? "是" : "否",
              attrs: { rowSpan: 1 },
            };
          },
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "Status",
          width: 100,
          scopedSlots: { customRender: "Status" },
          align: "center",
        },
        {
          title: "操作",
          width: 60,
          scopedSlots: { customRender: "operation" },
          fixed: "right",
        },
      ],
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
      selectedRowKeys: [],
      dataSource: [],
      changeValue: "viewClickYh",
      popoverFormList: [],
    };
  },
  // 监听当前数据变化
  // watch: {},
  // 计算数据变化
  // computed: {},
  // 实例创建完成后调用
  // created(){

  // },
  beforeMount() {},
  // 实例被挂载后调用
  mounted() {
    this.getMainList();
    this.getAsyncData();
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    getPopupContainer() {
      return document.querySelector(".position-account-search");
    },
    hiddenDangerGetCheckboxProps(record) {
      return {
        props: {
          disabled: record.Status != "1",
        },
      };
    },
    passChangeClick(val, callback) {
      aqjcAudio(val).then((res) => {
        if (res.code == 200) {
          this.$message.success("完成审核");
          callback();
          this.getListUpdate(val.getListId);
          // if (val.recordStatus == "7") {
          //       this.$refs.securityFromRef.isReplyForm = false;
          //       // return false;
          //     }
          // this.$refs.securityFromRef.isReplyForm = true;
          // val.forEach((element) => {
          //   if (this.changeValue == "viewClickYh") {
          //     if (val.recordStatus == "7") {
          //       this.$refs.securityFromRef.isReplyForm = false;
          //       return false;
          //     }
          //   }
          // });
        }
      });
    },
    async getAsyncData() {
      await this.getOutsourceCompany();
      await this.encodeSelect();
      let departmentOption = await this.departmentOption.map((item) => {
        return { label: item.dictname, value: item.id };
      });
      this.inspectedUnitOptions = await [...departmentOption, ...this.company];
    },
    checkMainBodyChange(val) {
      this.popoverFormList = val;
    },
    async getOutsourceCompany() {
      await companySelect().then((res) => {
        res.body.forEach((item) => {
          this.company.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          });
        });
      });
    },
    // 获取数据字典列表
    async encodeSelect() {
      // 检查主体
      encode("AQHB-JCZT").then((res) => {
        this.checkMainBodyOption = res.body.data;
      });
      // 检查类别
      encode("AQHB-JCLB").then((res) => {
        this.inspectionCategoryOption = res.body.data;
      });
      // 检查部门
      await encode("LBSQ_SSBM").then((res) => {
        if (res.code == 200) {
          this.departmentOption = res.body.data;
        }
      });
    },
    securityFromClose() {
      this.visible = false;
      this.getMainList();
    },
    currentPageFormChange(val) {
      this.currentPage = val;
    },
    currentPageFormChange(val) {
      this.currentPage = val;
    },
    getListUpdate(value) {
      getList({ id: value }).then((res) => {
        let data = res.body.data.map((item) => {
          let newItem = {};
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              const element = item[key];
              let keyArr = key.split("");
              keyArr[0] = keyArr[0].toLowerCase();
              let keyLower = keyArr.join("");
              newItem[keyLower] = element;
            }
          }
          newItem.rectificationTimeLimit = filterTime(
            newItem.rectificationTimeLimit
          );
          newItem.rectificationTime = filterTime(newItem.rectificationTime);
          newItem.findTime = filterTime(newItem.findTime);
          newItem.inspectionTimeStart = filterTime(newItem.inspectionTimeStart);
          newItem.inspectionTimeEnd = filterTime(newItem.inspectionTimeEnd);
          newItem.createdDateTime = filterTime(newItem.createdDateTime);
          newItem.attID = this.$fileUploadJSON.toParse(newItem.attID);
          newItem.attType = this.$fileUploadJSON.toParse(newItem.attType);
          return newItem;
        });
        this.$refs.securityFromRef.formTimeData = [
          filterTime(data[0].inspectionTimeStart),
          filterTime(data[0].inspectionTimeEnd),
        ];
        this.$refs.securityFromRef.dataHidden = data;
        this.$refs.securityFromRef.isReplyForm = true;
        data.forEach((element) => {
          if (this.changeValue == "viewClickYh") {
            if (
              element.recordStatus == "7"
            ) {
              this.$refs.securityFromRef.isReplyForm = false;
              return false;
            }
          }
        });
        this.$refs.securityFromRef.formList = data[0];
      });
    },
    getListDetails(value) {
      getList({ id: value.ID }).then((res) => {
        let data = res.body.data.map((item) => {
          let newItem = {};
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              const element = item[key];
              let keyArr = key.split("");
              keyArr[0] = keyArr[0].toLowerCase();
              let keyLower = keyArr.join("");
              newItem[keyLower] = element;
            }
          }
          newItem.rectificationTimeLimit = filterTime(
            newItem.rectificationTimeLimit
          );
          newItem.rectificationTime = filterTime(newItem.rectificationTime);
          newItem.findTime = filterTime(newItem.findTime);
          newItem.inspectionTimeStart = filterTime(newItem.inspectionTimeStart);
          newItem.inspectionTimeEnd = filterTime(newItem.inspectionTimeEnd);
          newItem.createdDateTime = filterTime(newItem.createdDateTime);
          newItem.attID = this.$fileUploadJSON.toParse(newItem.attID);
          newItem.attType = this.$fileUploadJSON.toParse(newItem.attType);
          return newItem;
        });
        this.$refs.securityFromRef.formTimeData = [
          filterTime(data[0].inspectionTimeStart),
          filterTime(data[0].inspectionTimeEnd),
        ];
        this.$refs.securityFromRef.dataHidden = data;
        this.$refs.securityFromRef.isReplyForm = true;
        data.forEach((element) => {
          if (this.changeValue == "viewClickYh") {
            if (
              // element.recordStatus != "4" &&
              // element.recordStatus != "6" &&
              element.recordStatus == "7"
            ) {
              this.$refs.securityFromRef.isReplyForm = false;
              return false;
            }
          }
        });
        this.$refs.securityFromRef.formList = data[0];
      });
    },
    //获取列表
    getMainList() {
      let searchForm = JSON.parse(JSON.stringify(this.searchForm));
      searchForm.checkMainBody = searchForm.checkMainBody.toString();
      getAqjcForPage(searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    // 删除
    deleteListClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteList(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = [];
          }
          this.getMainList();
          this.$message.success("删除成功！");
        });
      } else {
        this.$message.warning("请选择记录！");
      }
      this.visible = false;
    },
    //日期的onchange
    onChange(date, dateString) {},
    //查询功能
    search() {
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      if (this.formTimeData.length > 0) {
        this.searchForm.endDatetime = this.formTimeData[1] + " 23:59:59";
        this.searchForm.startDatetime = this.formTimeData[0] + " 00:00:00";
      } else {
        this.searchForm.endDatetime = "";
        this.searchForm.startDatetime = "";
      }
      this.getMainList();
    },
    flieChange(val) {
      this.flieChanges = val;
    },
    flieChangeCheck(val) {
      this.flieChanges = val;
    },
    checkListClick(value, changeValue) {
      this.securityCheckDisabled = "details";
      this.getListDetails(value);
      this.securityFromOpen("checkList");
      this.showSave = false;
      this.showSub = false;
      this.changeValue = "viewClickYh";
      this.showReply = true;
      this.securityTypeModel = { title: "安全检查台账-详情" };
    },
    securityFromOpen(val) {
      this.stateMonitorSecurity = val;
      this.visible = true;
    },
    paginationChange(pagination) {
      this.searchForm.pageNum = pagination.current;
      this.searchForm.pageSize = pagination.pageSize;
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getMainList();
    },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //重置输入
    resetForm() {
      this.searchForm = {
        pageNum: 1,
        pageSize: 10,
        inspectionNo: "",
        inspectionName: "",
        inspectionLevel: "",
        inspectionCategory: "",
        startDatetime: "",
        endDatetime: "",
        checkMainBody: [],
        inspectedBy: "",
        inspectedUnit: "",
        status: "2,3,4,5,6,7",
      };
      this.formTimeData = [];
      this.getMainList();
    },
  },
};
</script>
<style scoped lang="less">
.hidden_information {
  .hidden_information_header {
    display: flex;
    justify-content: space-between;
    border-top: 10px #f3f3f4 solid;
    align-items: center;
    padding-top: 10px;
    margin-bottom: 16px;
    .title {
      p {
        margin-bottom: 0;
      }
    }
  }
}
.line {
  width: 100%;
  display: inline-block;
  border-top: 2px #f3f3f4 solid;
  align-items: center;
  padding-top: 10px;
}
.form_item_description {
  ::v-deep .ant-form-item-label {
    width: 123px;
  }
  ::v-deep {
    .ant-form-item-control-wrapper {
      width: calc(100% -123px);
    }
  }
}
/deep/.from_time_data {
  .ant-form-item-label {
    overflow: unset;
    width: 120px !important;

    label {
      line-height: 15px;
      padding-right: 5px;
      white-space: pre-wrap;
      min-height: 40px;
      width: 120px !important;
      display: flex;
      justify-content: right;
      align-items: center;
    }
  }
}
</style>
