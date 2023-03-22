<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <div slot="extra" class="header-button">
          <!-- 导出 -->
          <ExportComponents
            :url="'/verificationPlanMinute/exportMonthExcel'"
            :params="{
              planMonth: this.$route.query.planMonth,
              planAnnual: this.$route.query.planAnnual,
            }"
          >
          </ExportComponents>
          <pe-button
            :include="[
              {
                value: 'Go',
                name: '返回',
                icon: 'Go-icon',
                isPower: false,
                clickName: 'go',
              },
            ]"
            @go="go"
          ></pe-button>
          <!-- { value: 'Edit', name: '编辑', icon: 'Edit-icon', isPower: false,
          clickName: 'editMuch', }, @editMuch="editMuch" -->
        </div>
      </template>
      <template slot="appMain">
        <div style="width: 100%">
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
                      <!-- <a-select-option
                          :value="province.dictname"
                          v-for="(province, index) in checkMainBodyOption"
                          :key="index"
                        >
                          {{ province.dictname }}
                        </a-select-option> -->
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备分类"
                  >
                    <a-select
                      v-model="selectFrom.eqmClassify"
                      show-search
                      placeholder="请选择"
                      option-filter-prop="children"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col> -->
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
                    <!-- <a-select
                      v-model="selectFrom.belongToEqm"
                      show-search
                      placeholder="请选择"
                      option-filter-prop="children"
                    >
                    </a-select> -->
                    <!-- <a-input v-model="selectFrom.belongToEqm" placeholder="请输入"/> -->
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
            <template slot="operation" slot-scope="row" v-if="flag">
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
                @edit="editMonth(row)"
              ></pe-button>
            </template>
          </dc-table>
        </div>
        <!-- 编辑弹框 -->
        <month-details-edit-form
          ref="equipmentAddFromRef"
          :month-details-edit-form-visible="monthDetailsEditFormVisible"
          @close="monthDetailsEditFormClose"
          @saveMonthEdit="saveMonthEdit"
          :monthPlanNo="monthPlanNo"
        ></month-details-edit-form>
      </template>
    </Breadcrumb>
    <div class="add-form"></div>
  </div>
</template>
<script>
import {
  selectByID,
  queryEquipmentList,
  monthPlanEdit,
} from "@/api/equimentTestOrRulesMgt/equipmentVerificationMaintenance/equipmentVerificationMaintenance";
import {
  getTreeList, //获取树
} from "@/api/spareParts";
import { monthDetailsList } from "@/api/equimentTestOrRulesMgt/verificationPlanMonth/verificationPlanMonth";
import MonthDetailsEditForm from "./components/monthDetailsEditForm.vue";
import { companySelect } from "@/api/outsourceCompany";
import { featureClassification } from "@/api/standingBook";

export default {
  components: { MonthDetailsEditForm },
  name: "",
  // 临时
  // components:{},
  // props:{},
  data() {
    return {
      equipmentList: [], //设备分类
      equipment: [],
      company: [], //外委单位下拉框
      flag: true,
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
      treeSelect: [],
      labelCol: { span: 4 },
      monthDetailsEditFormVisible: false,
      addvisible: false,
      selectedRowKeys: [],
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
        },
        {
          title: "设备类型",
          dataIndex: "eqmType",
          width: 80,
        },
        {
          title: "设备分类",
          dataIndex: "eqmClassify",
          width: 80,
        },
        {
          title: "设备名称",
          dataIndex: "eqmName",
          width: 80,
        },
        {
          title: "设备位号",
          dataIndex: "eqmNo",
          width: 80,
        },
        {
          title: "紧急程度",
          dataIndex: "urgencyDegree",
          width: 80,
        },
        {
          title: "是否具备检维修条件",
          dataIndex: "whetherCanCheckMaintenance",
          width: "150px",
          customRender: (value, row, index) => {
            return {
              children: value == "Y" ? "是" : "否",
              attrs: { rowSpan: 1 },
            };
          },
        },
        {
          title: "所属设备",
          dataIndex: "belongToEqm",
          width: 80,
        },
        {
          title: "规格型号",
          dataIndex: "specificationModel",
          width: 80,
        },
        {
          title: "投用日期",
          dataIndex: "putIntoUseTime",
          width: 80,
        },
        {
          title: "检定周期",
          dataIndex: "checkCycle",
          width: 80,
        },
        {
          title: "上次检定时间",
          dataIndex: "lastVerificationTime",
          width: "130px",
        },
        {
          title: "建议检定日期",
          dataIndex: "verificationDate",
          width: "130px",
        },
        {
          title: "下次检定时间",
          dataIndex: "nextVerificationTime",
          width: "130px",
        },
        // {
        //   title: "检验单位",
        //   dataIndex: "inspectionUnit",
        //   width: 80,
        //   customRender: (text) =>
        //     (text = this.company.filter((obj) => text === obj.value)[0]?.label),
        // },
        {
          title: "检定次数",
          dataIndex: "verificationNumber",
          width: 80,
        },
        {
          title: "操作",
          width: 100,
          fixed: "right",
          scopedSlots: { customRender: "operation" },
        },
      ],
      dataSource: [],
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
      monthPlanNo: this.$route.query.monthPlanNo,
      selectFrom: {
        // belongToEqm: "",
        // eqmClassify: "",
        // eqmType: "",
        pageNum: 1,
        pageSize: 10,
        // subordinatePosition: "",
        planMonth: this.$route.query.planMonth,
        planAnnual: this.$route.query.planAnnual,
        monthPlanNo: this.$route.query.monthPlanNo,
      },
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
    this.getEquipmentList();
    this.getQueryEquipmentList();
    this.getTreeList();
    this.flag = this.$route.query.flag;
    if (this.flag == "false") {
      this.columns.pop();
    }
    this.getOutsourceCompany();
    this.getMonthDetailsList();
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    editMuch() { },
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
    go() {
      this.$router.go(-1);
      // this.$router.push({
      //   path: "/verificationPlanMonth",
      // });
    },
    saveMonthEdit(val) {
      if (val.id) {
        monthPlanEdit(val).then((res) => {
          if (res.code == "200") {
            this.$message.success("修改成功");
            this.getMonthDetailsList();
          }
        });
      }
    },
    getTreeList() {
      getTreeList({ classificCode: "", classificName: "" }).then((res) => {
        console.log(res);
        this.treeSelect = res.body.data;
      });
    },
    getMonthDetailsList() {
      monthDetailsList(this.selectFrom).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.total = res.body.total;
        this.pagination.pageSize = res.body.pageSize;
      });
    },
    getSelectByID(id) {
      selectByID({ ID: id }).then((res) => {
        this.$refs.equipmentAddFromRef.dataForm = res.body;
        this.$refs.equipmentAddFromRef.dataForm.adjustVerificationDate = 0;
        this.$refs.equipmentAddFromRef.dataForm.adjustCause = "";
      });
    },
    editMonth(value) {
      // this.$set(value,'adjustVerificationDate',0)
      this.getSelectByID(value.id);

      this.monthDetailsEditFormOpen();
    },
    monthDetailsEditFormOpen() {
      this.monthDetailsEditFormVisible = true;
      // value = 0
    },
    monthDetailsEditFormClose() {
      this.monthDetailsEditFormVisible = false;
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
        belongToEqm: "",
        eqmClassify: "",
        eqmType: "",
        pageNum: 1,
        pageSize: 10,
        subordinatePosition: "",
      };
      this.getMonthDetailsList();
    },
  },
};
</script>
<style scoped lang="less">
.header-button {
  display: flex;
  justify-content: flex-end;
}
</style>
