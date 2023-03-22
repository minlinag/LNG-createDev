<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <pe-button
          :include="[
            {
              value: 'exportComponent',
              url: '/monthly/exportExcel',
              params: { MonthlyPlanNo: $route.params.id },
            },
          ]"
        ></pe-button>
      </template>

      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <!-- 查询 -->
              <a-form-model layout="inline">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备类型"
                  >
                    <a-select
                      v-model="queryParams.eqmType"
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
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备分类"
                  >
                    <a-tree-select
                      v-model="queryParams.eqmClassify"
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
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="所属设备"
                  >
                    <a-select
                      v-model="queryParams.belongToEqm"
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
                    value: 'details',
                    icon: '',
                    type: 'link',
                    name: '详情',
                    style: ['btn_link'],
                    clickName: 'details',
                  },
                ]"
                @details="detailsClick(row)"
              ></pe-button>
            </template>
          </dc-table>
        </div>
        <!-- 编辑弹框 -->
        <a-modal
          :title="formTitle"
          :visible="hiddenVisible"
          v-if="hiddenVisible"
          :width="1000"
          @cancel="cancelHidden"
          :footer="null"
        >
          <details-form
            :eqm-code="formEqmCode"
            @close="cancelHidden"
            :form-header-data="formHeaderData"
          ></details-form>
        </a-modal>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
import { selectByMonthPlanNo } from "@/api/equipmentMaintenance/equipmentDismantleMgt/verified";
import detailsForm from "./components/detailsForm.vue";
import { queryEquipmentList } from "@/api/equimentTestOrRulesMgt/equipmentVerificationMaintenance/equipmentVerificationMaintenance";
import {
  getTreeList, //获取树
} from "@/api/spareParts";
export default {
  components: { detailsForm },
  name: "",
  // 临时
  // components:{},
  // props:{},
  data() {
    return {
      equipment: [],
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
      qualifiedVisible: false,
      labelCol: { span: 4 },
      monthDetailsEditFormVisible: false,
      addvisible: false,
      queryParams: {
        eqmType: "",
        eqmClassify: "",
        belongToEqm: "",
        yjd_hg: "合格",
        pageNum: 1,
        pageSize: 10,
      },
      formTitle: "",
      hiddenVisible: false,
      formEqmCode: "",
      formHeaderData: [],
      selectedRowKeys: [],
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
          width: 150,
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
          width: 100,
        },
        {
          title: "规格型号",
          dataIndex: "specificationModel",
          width: 100,
        },
        {
          title: "投用日期",
          dataIndex: "putIntoUseTime",
          width: 100,
        },
        {
          title: "检定周期",
          dataIndex: "checkCycle",
          width: 100,
        },
        {
          title: "上次检定时间",
          dataIndex: "lastVerificationTime",
          width: "130px",
        },
        {
          title: "下次检定时间",
          dataIndex: "nextVerificationTime",
          width: "130px",
        },
        {
          title: "检验单位",
          dataIndex: "inspectionUnit",
          width: 100,
        },
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
      treeSelect: [],
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
    this.getTreeList()
    this.getQueryEquipmentList()
    this.getSelectByMonthPlanNo();
  },
  // methods 将被混入到 Vue 实例中
  methods: {
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
    getTreeList() {
      getTreeList({ classificCode: "", classificName: "" }).then((res) => {
        this.treeSelect = res.body.data;
      });
    },
    getSelectByMonthPlanNo() {
      selectByMonthPlanNo(this.queryParams).then((res) => {
        this.dataSource = res.body.data;
      });
    },
    detailsClick(row) {
      this.formEqmCode = row.eqmCode
      this.formHeaderData = row
      this.formTitle = "合格-详情"
      this.hiddenVisible = true
    },
    cancelHidden() {
      this.hiddenVisible = false
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    paginationChange(pagination) {
      this.queryParams.pageNum = pagination.current
      this.queryParams.pageSize = pagination.pageSize
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getSelectByMonthPlanNo();
    },
    search() {
      this.queryParams.pageNum = 1
      this.pagination.current = 1
      this.getSelectByMonthPlanNo();
    },
    resetForm() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        yjd_hg: "合格",
        eqmType: "",
        eqmClassify: "",
        belongToEqm: "",
      }
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.getSelectByMonthPlanNo();
    },
  },
};
</script>
<style scoped lang="less"></style>
