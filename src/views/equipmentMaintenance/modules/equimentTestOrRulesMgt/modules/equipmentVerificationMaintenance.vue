<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <div slot="extra" class="head-button">
          <pe-button
            :include="[
              { value: 'Add', clickName: 'addListClick' },
              { value: 'Delete', clickName: 'deleteListClick' },
              {
                value: 'export',
                clickName: 'exportClick',
                icon: 'export-icon',
                name: '模板下载',
              },
              {
                value: 'importComponent',
                url: '/verificationPlanMinute/importExcel',
                accept: '.xlsx',
                modalHint: ['根据下载模板格式导入'],
              },
            ]"
            @addListClick="addListClick"
            @deleteListClick="deleteListClick"
            @exportClick="exportClick"
          ></pe-button>
          <ExportComponents
            url="/verificationPlanMinute/exportEqmMaintain"
            :params="{
              eqmType: this.selectFrom.eqmType,
              eqmClassify: this.selectFrom.eqmClassify,
              belongToEqm:this.selectFrom.belongToEqm
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
              <a-form-model layout="inline" :model="selectFrom">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备类型"
                  >
                    <a-select
                      v-model="selectFrom.eqmType"
                      show-search
                      placeholder="请选择"
                      option-filter-prop="children"
                      :options="eqmTypeOption"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备分类"
                  >
                    <a-select
                      v-model="selectFrom.eqmClassify"
                      show-search
                      placeholder="请选择"
                      :options="equipmentList"
                      option-filter-prop="children"
                    >
                    </a-select>
                    <!-- <template>
                      <a-tree-select
                        v-model="selectFrom.eqmClassify"
                        style="width: 100%"
                        :dropdown-style="{
                          maxHeight: '400px',
                          overflow: 'auto',
                        }"
                        placeholder="请选择"
                        allow-clear
                      >
                        <a-tree-select-node
                          :value="item.classificCode"
                          :title="item.classificName"
                          v-for="(item, index) in treeSelect"
                          :key="index"
                        >
                          <a-tree-select-node
                            :value="items.classificCode"
                            :title="items.classificName"
                            v-for="(items, indexs) in item.children"
                            :key="index + '-' + indexs"
                          >
                            <a-tree-select-node
                              :value="itemss.classificCode"
                              :title="itemss.classificName"
                              v-for="(itemss, indexss) in items.children"
                              :key="index + '-' + indexs + '-' + indexss"
                            />
                          </a-tree-select-node>
                        </a-tree-select-node>
                      </a-tree-select>
                    </template> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="所属设备"
                  >
                    <a-select
                      v-model="selectFrom.belongToEqm"
                      show-search
                      placeholder="请选择"
                      :options="equipment"
                      option-filter-prop="children"
                    >
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
          <dc-table
            rowKey="id"
            @change="paginationChange"
            :pagination="pagination"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              columnWidth: '30px',
            }"
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
                    icon: '',
                    type: 'link',
                    style: ['btn_link'],
                    clickName: 'edit',
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template>
          </dc-table>
        </div>
        <!-- 新增弹框 -->
        <add-form
          @close="equipmentAddClose"
          :addvisible="addvisible"
          ref="equipmentAddFromRef"
                  :typeModel="typeModel"
          @saveEquipmentAdd="saveEquipmentAdd"
        ></add-form>
      </template>
    </Breadcrumb>
    <div class="add-form"></div>
  </div>
</template>
<script>
import {
  verificationPlanPost,
  verificationPlanEdit,
  deleteVerificationPlan,
  selectByID,
  queryEquipmentList,
} from "@/api/equimentTestOrRulesMgt/equipmentVerificationMaintenance/equipmentVerificationMaintenance";
import {
  getTreeList, //获取树
} from "@/api/spareParts";
import { monthDetailsList } from "@/api/equimentTestOrRulesMgt/verificationPlanMonth/verificationPlanMonth";
import { companySelect } from "@/api/outsourceCompany";
import { featureClassification } from "@/api/standingBook";
import utils from "@/utils/url";
import importConpontsData from "@/components/importConpontsData";
import addForm from "./components/addForm.vue";
export default {
  components: { addForm, importConpontsData },
  name: "",
  // 临时
  // components:{},
  // props:{},
  data() {
    return {
      eqmTypeOption: [
        {
          value: "特种设备及附件",
          label: "特种设备及附件",
        },
        {
          value: "仪表及计量器具",
          label: "仪表及计量器具",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      typeModel: {title: "维护界面-新增" },
      company: [], //外委单位下拉框
      equipmentList: [], //设备分类
      treeSelect: [],
      labelCol: { span: 4 },
      addvisible: false,
      selectedRowKeys: [],
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
          title: "设备类型",
          dataIndex: "eqmType",
          width: 130,
          align: "center",
        },
        {
          title: "设备分类",
          dataIndex: "eqmClassify",
          width: 100,
          // customRender: (text) =>
          //   (text = this.treeSelect.filter((obj) => text === obj.value)[0]
          //     ?.title),
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "eqmName",
          width: 100,
          align: "center",
        },
        {
          title: "设备位号",
          dataIndex: "eqmNo",
          width: 100,
          align: "center",
        },
        {
          title: "紧急程度",
          dataIndex: "urgencyDegree",
          width: 100,
          align: "center",
        },
        {
          title: "是否具备检维修条件",
          dataIndex: "whetherCanCheckMaintenance",
          width: 150,
          customRender: (value, row, index) => {
            return {
              children: value == "Y" ? "是" : "否",
              attrs: { rowSpan: 1 },
            };
          },
          align: "center",
        },
        {
          title: "所属设备",
          dataIndex: "belongToEqm",
          width: 100,
          align: "center",
        },
        {
          title: "规格型号",
          dataIndex: "specificationModel",
          width: 100,
          align: "center",
        },
        {
          title: "投用日期",
          dataIndex: "putIntoUseTime",
          width: 100,
          align: "center",
        },
        {
          title: "检定周期",
          dataIndex: "checkCycle",
          width: 100,
          align: "center",
        },
        // {
        //   title: "上次检定时间",
        //   dataIndex: "lastVerificationTime",
        //   width: 130,
        // },
        {
          title: "下次检定时间",
          dataIndex: "nextVerificationTime",
          width: 130,
          align: "center",
        },
        // {
        //   title: "检验单位",
        //   dataIndex: "inspectionUnit",
        //   width: 100,
        //   customRender: (text) =>
        //     (text = this.company.filter((obj) => text === obj.value)[0]?.label),
        // },
        {
          title: "检定次数",
          dataIndex: "verificationNumber",
          width: 100,
          align: "center",
        },
        {
          title: "操作",
          width: 100,
          fixed: "right",
          scopedSlots: { customRender: "operation" },
        },
      ],
      dataSource: [],
      selectFrom: {
        pageNum: 1,
        pageSize: 10,
        eqmType: "",
        eqmClassify: "",
        belongToEqm: "",
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
      equipment: [],
    };
  },
  // 监听当前数据变化
  // watch: {

  // },
  // 计算数据变化
  // computed: {},
  // 实例创建完成后调用
  // created: {},
  // 实例被挂载后调用
  mounted() {
    this.getMonthDetailsList();
    this.getOutsourceCompany();
    this.getEquipmentList();
    this.getTreeList();
    this.getQueryEquipmentList();
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    //模板导出
    exportClick() {
      window.location.href =
        utils.baseURL + "/verificationPlanMinute/downloadTemplate";
    },
    getQueryEquipmentList() {
      queryEquipmentList().then((res) => {
        res.body.forEach((item) => {
          this.equipment.push({
            value: item,
            label: item,
          });
        });
      });
    },
    async getEquipmentList() {
      const { body, code } = await featureClassification();
      // console.log(body,'render')
      if (code == 200) {
        // console.log();
        let data = [];
        body.data.forEach((element) => {
          // console.log(element);
          data.push({
            label: element.classificName,
            value: element.classificCode,
          });
        });
        // console.log(data)
        this.equipmentList = data;
      }
    },
    // 获取外委单位列表
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
    getTreeList() {
      getTreeList({ classificCode: "", classificName: "" }).then((res) => {
        console.log(res);
        this.treeSelect = res.body.data;
      });
    },
    saveEquipmentAdd(val, callback) {
      var startSj = +new Date(val.putIntoUseTime);
      var endSj = +new Date(val.nextVerificationTime);
      if (startSj * 1 > endSj * 1) {
        return this.$message.warning("投用时间不能晚于下次检定时间");
      }
      //表单校验
      if (val.id) {
        verificationPlanEdit(val).then((res) => {
          if (res.code == "200") {
            this.$message.success("修改成功");
            this.getMonthDetailsList();
            callback();
          }
        });
      } else {
        verificationPlanPost(val).then((res) => {
          if (res.code == "200") {
            this.$message.success("新增成功");
            this.getMonthDetailsList();
            callback();
          }
        });
      }
    },
    equipmentAddClose() {
      this.addvisible = false;
    },
    equipmentAddOpen() {
      this.addvisible = true;
    },
    getMonthDetailsList() {
      monthDetailsList(this.selectFrom).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.total = res.body.total;
        this.pagination.pageSize = res.body.pageSize;
      });
    },
    // 编辑调的接口，用来拿回转化前的数据，eg：数据字典编码
    getSelectByID(id) {
      selectByID({ ID: id }).then((res) => {
        this.$refs.equipmentAddFromRef.addFormModel = res.body;
      });
    },
    edit(value) {
      this.getSelectByID(value.id);
      this.equipmentAddOpen(value);
      this.typeModel = { title: "维护界面-编辑" };
    },
    addListClick() {
      this.equipmentAddOpen();
      this.typeModel = { title: "维护界面-新增" };
    },
    deleteListClick() {
      if (this.selectedRowKeys.length > 0) {
        deleteVerificationPlan(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = [];
            this.getMonthDetailsList();
            this.$message.success("删除成功！");
          }
        });
      } else {
        this.$message.warning("请选择记录！");
      }
      this.visible = false;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    paginationChange(pagination) {
      this.selectFrom.pageNum = pagination.current;
      this.selectFrom.pageSize = pagination.pageSize;
      this.getMonthDetailsList();
    },
    search() {
      this.selectFrom.pageNum = 1;
      this.selectFrom.pageSize = 10;
      this.getMonthDetailsList();
    },
    resetForm() {
      this.selectFrom = {
        pageNum: 1,
        pageSize: 10,
        eqmType: "",
        eqmClassify: "",
        belongToEqm: "",
      };
      this.getMonthDetailsList();
    },
  },
};
</script>
<style scoped lang="less">
.head-button {
  display: flex;
  justify-content: flex-end;
}
</style>
