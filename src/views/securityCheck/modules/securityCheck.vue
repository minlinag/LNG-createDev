<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <div slot="extra">
          <pe-button
            :include="[
              { value: 'Add', clickName: 'addListClick' },
              { value: 'Delete', clickName: 'deleteListClick' },
            ]"
            @addListClick="addListClick"
            @deleteListClick="deleteListClick"
          ></pe-button>
        </div>
      </template>
      <template slot="appMain">
        <div class="securityCheck">
          <dc-table
            @change="paginationChange"
            :pagination="pagination"
            rowKey="ID"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: hiddenDangerGetCheckboxProps,
              columnWidth: '30px',
            }"
            :scroll="{ y: 1, x: 100 }"
            class="list_table"
            :columns="columns"
            :dataSource="dataSource"
            :openSelector="true"
          >
            <template slot="Status" slot-scope="text">
              {{ text | Status }}
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
                    disabled: row.Status !== '1',
                    isPower: false,
                  },
                  {
                    value: 'View',
                    type: 'link',
                    clickName: 'view',
                    icon: '',
                    style: ['btn_link'],
                    isPower: false,
                    name: '详情',
                  },
                ]"
                @edit="editListClick(row, changeValue)"
                @view="checkListClick(row, changeValue)"
              ></pe-button>
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
        @saveSecurity="saveSecurity"
        @submitSecurity="submitSecurity"
        ref="securityFromRef"
        :securityCheckDisabled="securityCheckDisabled"
        :showSave="showSave"
        :listTotal="pagination.total"
        :isShowZG="false"
        :isShowBJ="true"
        :isShowYS="false"
        :securityTypeModel="securityTypeModel"
      ></security-check-add-form>
    </div>
  </div>
</template>
<script>
import securityCheckAddForm from "./components/securityCheckAddForm.vue";
import { companySelect } from "@/api/JSAAnalysis";
import { encode } from "@/api/dataDictionary";
import { filterTime } from "@/utils/utils";
import {
  getList,
  addPost,
  updatePost,
  getAqjcForPage,
  deleteList,
  aqjcAudio,
  aqjcSubmit,
  signature, //签章
} from "@/api/securityCheck";
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
      // currentPage: "main",
      securityCheckDisabled: "add",
      showSave: true,
      stateMonitorSecurity: "",
      company: [], //外委单位下拉框
      inspectedUnitOptions: [],
      confirmLoading: false,
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
            return { children: value ? "是" : "否", attrs: { rowSpan: 1 } };
          },
          align: "center",
        },
        {
          title: "是否下达隐患整改通知单",
          dataIndex: "IsNotice",
          width: 180,
          customRender: (value, row, index) => {
            return { children: value ? "是" : "否", attrs: { rowSpan: 1 } };
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
          width: 80,
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
      visible: false,
      selectedRowKeys: [],
      dataSource: [],
      changeValue: "editClickYh",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  // 监听当前数据变化
  watch: {
    visible: {
      handler(newVal, oldVal) {
        if (newVal) {
          let departmentOption = this.departmentOption.map((item) => {
            return { label: item.dictname, value: item.id };
          });
          this.inspectedUnitOptions = [...departmentOption, ...this.company];
        }
      },
    },
  },
  // 实例被挂载后调用
  mounted() {
    this.encodeSelect();
    this.getOutsourceCompany();
    this.getMainList();
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    hiddenDangerGetCheckboxProps(record) {
      return {
        props: {
          disabled: record.Status != "1",
        },
      };
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
    securityFromClose() {
      this.visible = false;
    },
    securityFromOpen(val) {
      this.stateMonitorSecurity = val;
      this.visible = true;
    },
    // 保存按钮
    saveSecurity(val, stateMonitorSecurity, dataHidden) {
      this.confirmLoading = true;
      var dataBox = {};
      //先创建一个Form表单
      var addForm = new FormData();
      //把表格 form表单的数据放到一个新的对象里边
      dataBox.table = dataHidden; //[1,2,3 ]
      dataBox.form = val;
      //把新的对象append (拼接/挂载到)from表单里边
      addForm.append("strJson", JSON.stringify(dataBox));
      //把新的附件append (拼接/挂载到)from表单里边
      if (val.iD) {
        updatePost(addForm).then((res) => {
          if (res.code == "200") {
            this.$message.success("修改成功");
            this.getMainList();
          }
        });
      } else {
        addPost(addForm).then((res) => {
          if (res.code == "200") {
            this.$message.success("新增成功");
            this.getMainList();
          }
        });
      }
    },
    //获取列表
    getMainList() {
      getAqjcForPage(this.queryParams).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    addListClick() {
      this.securityCheckDisabled = "add";
      this.securityFromOpen("addList");
      this.showReply = false;
      this.showSave = true;
      this.showRect = true;
      this.showSub = true;
      this.securityTypeModel = { title: "安全检查-新增" };
    },
    editListClick(value, changeValue) {
      this.securityFromOpen("editList");
      this.getListDetails(value);
      this.securityCheckDisabled = "edit";
      this.showReply = false;
      this.showSave = true;
      this.showSub = true;
      this.showRect = true;
      this.securityTypeModel = { title: "安全检查-编辑" };
      this.changeValue = "editClickYh";
    },
    checkListClick(value, changeValue) {
      this.getListDetails(value);
      this.securityFromOpen("checkList");
      this.securityCheckDisabled = "details";
      this.showSave = false;
      this.showSub = false;
      this.changeValue = "viewClickYh";
      this.securityTypeModel = { title: "安全检查-详情" };
      this.showReply = true;
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
        this.$refs.securityFromRef.isReplyForm =true ;
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
    paginationChange(pagination) {
      this.queryParams.pageNum = pagination.current;
      this.queryParams.pageSize = pagination.pageSize;
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getMainList();
    },
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    submitSecurity(val, stateMonitorSecurity, dataHidden) {
      dataHidden.forEach((element) => {
        element.recordStatus = "5";
      });
      this.saveSecurity(val, stateMonitorSecurity, dataHidden);
    },
    // 获取数据字典列表
    encodeSelect() {
      // 检查部门
      encode("LBSQ_SSBM").then((res) => {
        if (res.code == 200) {
          this.departmentOption = res.body.data;
          let departmentOption = this.departmentOption.map((item) => {
            return { label: item.dictname, value: item.id };
          });
          this.inspectedUnitOptions = [...departmentOption, ...this.company];
        }
      });
    },
    getOutsourceCompany() {
      companySelect().then((res) => {
        // this.company = res.body
        res.body.forEach((item) => {
          this.company.push({
            value: item.OutsourceCompanyCode,
            label: item.OutsourceCompanyName,
          });
        });
      });
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
