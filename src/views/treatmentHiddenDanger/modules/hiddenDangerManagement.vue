<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <div class="button_layout">
          <pe-button
            :include="[
              {
                value: 'Add',
                clickName: 'addHidden',
                isPower: false,
              },
              {
                value: 'Delete',
                clickName: 'deleteHidden',
                isPower: false,
              },
              {
                value: 'exportComponent',
                isPower: false,
                url: 'aqjc/exportYhzg',

                params: {
                  hiddenDangerLocation:
                    this.formList.hiddenDangerLocation == undefined
                      ? ''
                      : this.formList.hiddenDangerLocation,
                  hazardCategory:
                    this.formList.hazardCategory == undefined
                      ? ''
                      : this.formList.hazardCategory,
                  hazardLevel:
                    this.formList.hazardLevel == undefined
                      ? ''
                      : this.formList.hazardLevel,
                  rectificationDutyCompany:
                    this.formList.rectificationDutyCompany == undefined
                      ? ''
                      : this.formList.rectificationDutyCompany,
                  rectificationDutyPerson:
                    this.formList.rectificationDutyPerson == undefined
                      ? ''
                      : this.formList.rectificationDutyPerson,
                  rTimeLimit:
                    this.formList.rectificationTimeLimit == undefined
                      ? ''
                      : this.formList.rectificationTimeLimit + ' 00:00:00',
                  checkMainBody:
                    this.formList.checkMainBody == undefined
                      ? ''
                      : this.formList.checkMainBody,
                  inspectedBy:
                    this.formList.inspectedBy == undefined
                      ? ''
                      : this.formList.inspectedBy,
                  recordStatus:
                    this.formList.recordStatus == undefined
                      ? ''
                      : this.formList.recordStatus,
                },
              },
            ]"
            @addHidden="addHidden"
            @deleteHidden="deleteHidden"
          ></pe-button>
        </div>
      </template>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <!-- 查询 -->
              <a-form-model layout="inline" :model="formList">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="隐患地点"
                  >
                    <a-input
                      v-model="formList.hiddenDangerLocation"
                      placeholder="请输入"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="隐患类别"
                  >
                    <a-select
                      v-model="formList.hazardCategory"
                      show-search
                      placeholder="请选择隐患类别"
                      option-filter-prop="children"
                    >
                      <a-select-option
                        :value="province.dictname"
                        v-for="(province, index) in hazardCategoryOption"
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
                    label="隐患级别"
                  >
                    <a-select
                      v-model="formList.hazardLevel"
                      placeholder="请选择隐患级别"
                    >
                      <a-select-option value="一般隐患">
                        一般隐患
                      </a-select-option>
                      <a-select-option value="重大隐患">
                        重大隐患
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="整改责任单位"
                  >
                    <a-select
                      :options="inspectedUnitOptions"
                      v-model="formList.rectificationDutyCompany"
                      placeholder="请选择"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="整改责任人"
                  >
                    <a-input
                      v-model="formList.rectificationDutyPerson"
                      placeholder="请输入"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    label="整改时限:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-date-picker
                      v-model="formList.rectificationTimeLimit"
                      @change="onChange"
                      valueFormat="YYYY-MM-DD"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="检查主体"
                  >
                    <a-select
                      v-model="formList.checkMainBody"
                      show-search
                      placeholder="请选择检查主体"
                      option-filter-prop="children"
                    >
                      <a-select-option
                        :value="province.dictname"
                        v-for="(province, index) in checkMainBodyOption"
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
                    label="检查人"
                  >
                    <a-input
                      v-model="formList.inspectedBy"
                      placeholder="请输入"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="状态"
                  >
                    <a-select
                      v-model="formList.recordStatus"
                      placeholder="请选择"
                    >
                      <a-select-option value="1"> 已保存 </a-select-option>
                      <a-select-option value="2"> 未整改 </a-select-option>
                      <a-select-option value="3"> 整改中 </a-select-option>
                      <a-select-option value="4"> 已整改 </a-select-option>
                      <a-select-option value="7"> 已验收 </a-select-option>
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
                  </a-form-model-item>
                </a-col>
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
        <div class="securityCheck">
          <div class="add-form">
            <template>
              <a-form-model>
                <a-form-model-item>
                  <div class="hidden_information">
                    <!-- 隐患信息表格插槽按钮 -->
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
                      <template slot="recordStatus" slot-scope="text">
                        {{ text | recordStatus }}
                      </template>
                      <template slot="operation" slot-scope="row">
                        <a-button
                          class="btn_link"
                          type="link"
                          style="cursor: pointer"
                          @click="editListClick(row)"
                          :disabled="row.RecordStatus != '1'"
                          v-if="row.Pic == 'true'"
                        >
                          编辑
                        </a-button>
                        <a-button
                          class="btn_link"
                          type="link"
                          style="cursor: pointer"
                          @click="rectificationListClick(row)"
                          v-if="row.Pic == 'true'"
                          :disabled="row.RecordStatus != '2'"
                        >
                          整改
                        </a-button>
                        <a-button
                          class="btn_link"
                          type="link"
                          style="cursor: pointer"
                          @click="checkAcceptanceClick(row)"
                          v-if="row.Pic == 'true'"
                          :disabled="row.RecordStatus != '4'"
                        >
                          验收
                        </a-button>
                        <a-button
                          class="btn_link"
                          type="link"
                          style="cursor: pointer"
                          @click="checkListClick(row)"
                        >
                          详情
                        </a-button>
                      </template>
                    </dc-table>
                    <div class="addForm">
                      <!-- 隐患信息新增弹框 -->
                      <add-hidden-form
                        :security-check="formList"
                        :hidden-danger-visible="hiddenDangerVisible"
                        @close="addHiddenFormClose"
                        @saveHiddenDanger="saveHiddenDanger"
                        :stateMonitor="stateMonitor"
                        :typeModel="typeModel"
                        @getYhzgMainList="getYhzgMainList"
                        @pass="passChange"
                        ref="addHiddenFormRef"
                      ></add-hidden-form>
                    </div>
                  </div>
                </a-form-model-item>
              </a-form-model>
            </template>
          </div>
        </div>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
import addHiddenForm from "@/views/securityCheck/modules/components/addHiddenForm.vue";
import {
  addPost,
  updatePost,
  aqjcGetYhzgForPage,
  deleteYHZGByIds,
} from "@/api/treatmentHiddenDanger/treatmentHiddenDanger";
import { aqjcAudio } from "@/api/securityCheck";
import { companySelect } from "@/api/JSAAnalysis";
import { encode } from "@/api/dataDictionary";
import { filterTime } from "@/utils/utils";
export default {
  components: {
    addHiddenForm,
  },
  filters: {
    recordStatus(val) {
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
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      hazardCategoryOption: [], //隐患类别下拉框
      checkMainBodyOption: [],
      flieChanges: {},
      typeModel: { type: "YS", title: "隐患管理-新增" },
      flieChangeChecks: {},
      hiddenDangerVisible: false,
      labelCol: { span: 6 },
      formList: {
        InspectionNo: "",
        InspectionName: "",
        InspectionLevel: "",
        InspectionCategory: "",
        InspectionTime: [],
        CheckMainBody: "",
        InspectedBy: "",
        InspectedUnit: "",
      },
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
        },
        {
          title: "隐患地点",
          dataIndex: "HiddenDangerLocation",
          width: 100,
        },
        {
          title: "隐患类别",
          dataIndex: "HazardCategory",
          width: 70,
        },
        {
          title: "隐患级别",
          dataIndex: "HazardLevel",
          width: 80,
        },
        {
          title: "整改责任单位",
          dataIndex: "RectificationDutyCompany",
          customRender: (text) =>
            (text = this.inspectedUnitOptions.filter(
              (obj) => text === obj.value
            )[0]?.label),
          width: 100,
        },
        {
          title: "整改责任人",
          dataIndex: "RectificationDutyPerson",
          width: 100,
        },
        {
          title: "发现时间",
          dataIndex: "FindTime",
          width: 100,
          customRender: (value, row, index) => {
            return {
              children: `${filterTime(row.FindTime)}`,
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: "整改时限",
          dataIndex: "",
          width: 100,
          customRender: (value, row, index) => {
            return {
              children: `${filterTime(row.RectificationTimeLimit)}`,
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: "隐患描述",
          dataIndex: "HazardDescription",
          width: 100,
        },
        {
          title: "整改要求",
          dataIndex: "RectificationRequirements",
          width: 100,
        },
        {
          title: "检查编号",
          dataIndex: "InspectionNo",
          width: 180,
        },
        {
          title: "检查名称",
          dataIndex: "InspectionName",
          width: 180,
        },
        {
          title: "检查级别",
          dataIndex: "InspectionLevel",
          width: 120,
        },
        {
          title: "检查类别",
          dataIndex: "InspectionCategory",
          width: 170,
        },
        {
          title: "检查时间",
          width: 100,
          customRender: (value, row, index) => {
            return {
              children: row.InspectionTime
                ? `${filterTime(row.InspectionTime)}`
                : // 至${filterTime(
                  //   row.InspectionTimeEnd
                  // )}
                  "-",
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: "检查主体",
          dataIndex: "CheckMainBody",
          width: 120,
        },
        {
          title: "检查人",
          dataIndex: "InspectedBy",
          width: 100,
        },
        {
          title: "被检单位",
          dataIndex: "InspectedUnit",
          customRender: (text) =>
            (text = this.inspectedUnitOptions.filter(
              (obj) => text === obj.value
            )[0]?.label),
          width: 100,
        },
        {
          title: "状态",
          dataIndex: "RecordStatus",
          scopedSlots: { customRender: "recordStatus" },
          width: 70,
        },
        {
          title: "操作",
          width: 150,
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
      dataApproval: [],
      dataSource: [],
      inspectedUnitOptions: [],
      company: [], //外委单位下拉框
      departmentOption: [],
      stateMonitor: "",
    };
  },
  // 监听当前数据变化
  // watch: {},
  // 计算数据变化
  // computed: {},
  // 实例创建完成后调用
  // created: {},
  // 实例被挂载后调用
  mounted() {
    this.getYhzgMainList();
    this.getAsyncData();
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    passChange(val, callback) {
      aqjcAudio(val).then((res) => {
        if (res.code == 200) {
          this.$message.success("完成审核");
          callback();
          this.getYhzgMainList();
        }
      });
    },
    addListClick() {
      this.hiddenDangerVisible = true;
    },
    //获取列表
    getYhzgMainList() {
      aqjcGetYhzgForPage(this.formList).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    paginationChange(pagination) {
      this.formList.pageNum = pagination.current;
      this.formList.pageSize = pagination.pageSize;
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getYhzgMainList();
    },
    //日期的onchange
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    //查询功能
    search() {
      this.getYhzgMainList();
    },
    flieChange(val) {
      console.log(val);
      this.flieChanges = val;
    },
    flieChangeCheck(val) {
      console.log(val);
      this.flieChanges = val;
    },
    hiddenDangerFormOpen(val) {
      this.stateMonitor = val;
      this.hiddenDangerVisible = true;
    },
    addHidden() {
      this.hiddenDangerFormOpen("hiddenDangerAdd");
      let date = new Date();
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let today = year + "-" + month + "-" + day;
      this.$refs.addHiddenFormRef.formHiddenList = {
        hiddenDangerLocation: "",
        hazardCategory: undefined,
        hazardLevel: undefined,
        rectificationDutyCompany: undefined,
        rectificationDutyPerson: "",
        rectificationTimeLimit: "",
        hazardDescription: "",
        rectificationRequirements: "",
        hiddenDangerPictures: "",
        findTime: today,
        rectificationSituation: "",
        rectificationSource: "",
        rectificationTime: "",
        rectificationUser: "",
        acceptedUser: "",
        describet: "",
        Pic: true,
      };
    },
    checkListClick(value) {
      this.typeModel = { type: "hiddenEdit", title: "隐患详情" };
      this.getListDetails(value, "hiddenDangerCheck");
    },
    editListClick(value) {
      this.typeModel = { type: "hiddenEdit", title: "隐患编辑" };
      this.getListDetails(value, "hiddenDangerEdit");
    },
    rectificationListClick(value) {
      this.typeModel = { type: "hiddenEdit", title: "隐患整改" };
      this.getListDetails(value, "edit");
    },
    checkAcceptanceClick(value) {
      this.typeModel = { type: "YS", title: "隐患验收" };
      this.getListDetails(value, "YS");
    },
    getListDetails(value, name) {
      aqjcGetYhzgForPage({ id: value.ID }).then((res) => {
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
          newItem.inspectionTimeStart = filterTime(newItem.inspectionTime);
          // newItem.inspectionTimeEnd = filterTime(newItem.inspectionTimeEnd);
          newItem.createdDateTime = filterTime(newItem.createdDateTime);
          newItem.attID = this.$fileUploadJSON.toParse(newItem.attID);
          newItem.attType = this.$fileUploadJSON.toParse(newItem.attType);
          return newItem;
        });
        this.$refs.addHiddenFormRef.formHiddenList = JSON.parse(
          JSON.stringify(data[0])
        );
        this.hiddenDangerFormOpen(name);
      });
    },
    deleteHidden() {
      if (this.selectedRowKeys.length > 0) {
        deleteYHZGByIds(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = [];
          }
          this.getYhzgMainList();
          this.$message.success("删除成功！");
        });
      } else {
        this.$message.warning("请选择记录！");
      }
    },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    saveHiddenDanger(val) {
      let newVal = val;
      var dataBox = {};
      //先创建一个Form表单
      var addForm = new FormData();
      //把表格 form表单的数据放到一个新的对象里边
      dataBox.form = null;
      dataBox.table = [newVal];
      //把新的对象append (拼接/挂载到)from表单里边
      addForm.append("strJson", JSON.stringify(dataBox));
      //把新的附件append (拼接/挂载到)from表单里边
      if (newVal.iD) {
        updatePost(addForm).then((res) => {
          if (res.code == "200") {
            this.$message.success("保存成功");
            this.clearFormList();
            this.getYhzgMainList();
          }
        });
      } else {
        addPost(addForm).then((res) => {
          if (res.code == "200") {
            this.$message.success("新增成功");
            this.clearFormList();
            this.getYhzgMainList();
          }
        });
      }
    },
    clearFormList() {
      this.hiddenDangerVisible = false;
    },
    addHiddenFormClose() {
      this.hiddenDangerVisible = false;
    },
    hiddenDangerGetCheckboxProps(record) {
      return {
        props: {
          disabled: record.Pic != "true",
        },
      };
    },
    //重置输入
    resetForm() {
      this.formList = {
        pageNum: 1,
        pageSize: 10,
        InspectionNo: "",
        InspectionName: "",
        InspectionLevel: "",
        InspectionCategory: "",
        InspectionTime: [],
        CheckMainBody: "",
        InspectedBy: "",
        InspectedUnit: "",
      };
      this.getYhzgMainList();
    },
    async getAsyncData() {
      await this.getOutsourceCompany();
      await this.encodeSelect();
      let departmentOption = await this.departmentOption.map((item) => {
        return { label: item.dictname, value: item.id };
      });
      this.inspectedUnitOptions = await [...departmentOption, ...this.company];
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
      // 隐患类别
      encode("AQHB-YHLB").then((res) => {
        this.hazardCategoryOption = res.body.data;
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
  },
};
</script>
<style scoped lang="less">
.wrapper {
  .securityCheck {
  }
}
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
    .button_layout {
    }
  }
  ::v-deep .ant-table-row-level-0 .ant-table-selection-column > span {
    width: 28px;
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
    label {
    }
  }
  ::v-deep {
    .ant-form-item-control-wrapper {
      width: calc(100% -123px);
    }
  }
}
</style>
