<template>
  <a-modal
    :visible="addFormVisible"
    title="新增"
    :footer="null"
    :after-close="formListAfterClose"
    @cancel="handleCancel"
    class="from-style bigModel"
    :maskClosable="false"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-row class="position-dispatch">
        <a-col :span="8" class="position-add-form">
          <a-form-model-item
            label="是否在账设备"
            prop="whetheraccountedequipment"
          >
            <a-select
              v-model="form.whetheraccountedequipment"
              placeholder="请选择"
              :getPopupContainer="getPopupContainer"
            >
              <!-- <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option> -->
              <a-select-option
                :value="item.value"
                :key="index"
                v-for="(item, index) in isRepair"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <div :class="{ buttonInput: form.whetheraccountedequipment === '是' }">
          <a-col :span="form.whetheraccountedequipment === '是' ? 6 : 8">
            <a-form-model-item
              label="设备名称"
              prop="devicename"
              :labelCol="{ style: 'width: 170px' }"
            >
              <a-input
                :style="{
                  width:
                    form.whetheraccountedequipment === '是' ? '120px' : '180px',
                }"
                :disabled="form.whetheraccountedequipment === '是'"
                v-model="form.devicename"
                placeholder="请输入"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="2" v-if="form.whetheraccountedequipment === '是'">
            <a-form-model-item>
              <a-button type="primary" @click="equipmentClick">选择</a-button>
            </a-form-model-item>
          </a-col>
        </div>
        <a-col :span="8">
          <a-form-model-item label="设备位号" prop="devicetagno">
            <a-input
              v-model="form.devicetagno"
              :disabled="form.whetheraccountedequipment === '是'"
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-col :span="8">
        <a-form-model-item label="责任人" prop="personincharge">
          <a-input v-model="form.personincharge" placeholder="请输入" />
        </a-form-model-item>
      </a-col>
      <div class="buttonInput">
        <a-col :span="6">
          <a-form-model-item label="维修单位名称" prop="inspectioncompanyname">
            <a-input
              v-model="form.inspectioncompanyname"
              placeholder="请输入"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="2">
          <a-form-model-item>
            <a-button type="primary" @click="companyClick">选择</a-button>
          </a-form-model-item>
        </a-col>
      </div>
      <a-col :span="8" class="position-add-form">
        <a-form-model-item label="所属区域" prop="area">
          <a-select
            v-model="form.area"
            show-search
            placeholder="请选择"
            :getPopupContainer="getPopupContainer"
          >
            <a-select-option
              :value="province.dictname"
              v-for="(province, index) in areaOption"
              :key="index"
            >
              {{ province.dictname }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="计划检修日期" prop="planmaintenancedatetime">
          <a-date-picker
            v-model="form.planmaintenancedatetime"
            valueFormat="YYYY-MM-DD"
            format="YYYY-MM-DD"
            :disabled-date="disabledplanmaintenancedateDate"
            :defaultPickerValue="`${this.$route.query.planYear}-${this.$route.query.planMonth}-01`"
            :placeholder="'请选择'"
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="计划维修天数" prop="plannedmaintenancetime">
          <a-input v-model="form.plannedmaintenancetime" placeholder="请输入" />
        </a-form-model-item>
      </a-col>
      <a-col :span="8" class="position-add-form">
        <a-form-model-item label="专业" prop="major">
          <a-select
            v-model="form.major"
            show-search
            placeholder="请选择"
            :getPopupContainer="getPopupContainer"
          >
            <a-select-option
              :value="province.dictname"
              v-for="(province, index) in majorOption"
              :key="index"
            >
              {{ province.dictname }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="预估费用" prop="plannedcost">
          <a-input v-model="form.plannedcost" placeholder="请输入" />
        </a-form-model-item>
      </a-col>
      <a-col :span="16" class="position-add-form">
        <a-form-model-item
          label="是否影响接卸"
          prop="whetheraffectexportorship"
        >
          <a-select
            v-model="form.whetheraffectexportorship"
            placeholder="请选择"
            :getPopupContainer="getPopupContainer"
          >
            <a-select-option value="1">是</a-select-option>
            <a-select-option value="2">否</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="24">
        <a-form-model-item label="需工艺条件" prop="requiredprocesscondition">
          <a-textarea
            v-model="form.requiredprocesscondition"
            placeholder="请输入"
            :auto-size="{ minRows: 6, maxRows: 6 }"
          ></a-textarea>
        </a-form-model-item>
      </a-col>
      <a-col :span="24">
        <a-form-model-item
          label="检维修问题信息描述"
          prop="maintenancedescription"
        >
          <a-textarea
            v-model="form.maintenancedescription"
            placeholder="请输入"
            :auto-size="{ minRows: 6, maxRows: 6 }"
          ></a-textarea>
        </a-form-model-item>
      </a-col>
      <a-col :span="24">
        <a-form-model-item label="作业内容" prop="operationcontent">
          <a-textarea
            v-model="form.operationcontent"
            placeholder="请输入"
            :auto-size="{ minRows: 6, maxRows: 6 }"
          ></a-textarea>
        </a-form-model-item>
      </a-col>
      <a-col :span="24">
        <a-form-model-item label="备注" prop="remark">
          <a-textarea
            v-model="form.remark"
            placeholder="请输入部门意见"
            :auto-size="{ minRows: 6, maxRows: 6 }"
          ></a-textarea>
        </a-form-model-item>
      </a-col>
      <!-- 备品备件 -->
      <template>
        <div class="hidden_information_header">
          <span style="font-weight: 800">备品备件</span>
          <div class="button_layout">
            <pe-button
              :include="[
                {
                  value: 'Select',
                  name: '选择',
                  clickName: 'selectSparepart',
                  isPower: false,
                  type: 'link',
                  icon: '',
                  style: ['btn_link'],
                },
              ]"
              @selectSparepart="selectSparepart()"
            ></pe-button>
          </div>
        </div>
        <a-table
          :scroll="{ x: 100 }"
          :columns="columnsModelOut"
          rowKey="id"
          :dataSource="spartPartDataSourceOut"
          :openSelector="false"
          :pagination="paginationSparepartOut"
          @change="paginationChangeSparepartOut"
        >
          <template slot="inputText" slot-scope="row, text">
            <a-input placeholder="请输入数量" v-model="text.planCostCount" />
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
        </a-table>
      </template>
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button type="primary" @click="handleOk()"> 确定 </a-button>
      <a-button @click="handleCancel()"> 取消 </a-button>
    </div>
    <!-- 备品备件打开弹框 -->
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
    <equipmentModel
      ref="equipmentModel"
      :equipmentVisible.sync="equipmentVisible"
      @selectedClic="selectedClic"
    />
  </a-modal>
</template>
<script>
import moment from "moment";
import equipmentModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue";
import { getListForPage, companySelect } from "@/api/outsourceCompany";
import { getListById, getIdListForSparepart } from "@/api/sparesprt";
import { getListForSparepart } from "@/api/sparesprt";
import { encode } from "@/api/dataDictionary";
export default {
  props: ["addFormVisible"],
  components: { equipmentModel },
  data() {
    return {
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
      visibleCompany: false,
      selectedRowKeysCompany: [],
      companyDataSource: [],
      companyDataSourceSelect: [],
      modelConfigCompany: {
        width: "950px",
        title: "维修单位名称 ",
        cancelText: false,
        footer: "", //是否展示页脚
      },
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
        },
        {
          title: "检维修单位名称",
          dataIndex: "outsourceCompany",
          slectBollen: true,
        },
        {
          title: "检维修单位联系人",
          dataIndex: "personInCharge",
          slectBollen: true,
        },
      ],
      equipmentVisible: false,
      areaOption: [],
      visibleSparepart: false,
      spartPartDataSourceKey: [],
      spartPartDataSource: [],
      majorOption: [],
      // 是否维修//是否在账
      isRepair: [
        { value: "是", label: "是" },
        { value: "否", label: "否" },
      ],
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
        current: 1,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      modelConfigSparepart: {
        width: "950px",
        title: " 备品备件",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      selectFrom: {
        deviceName: "",
        deviceType: "",
        materialCode: "",
        sparePartName: "",
        pageNum: 1,
        pageSize: 10,
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
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 100,
          slectBollen: true,
        },
        {
          title: "物资编码",
          dataIndex: "materialCode",
          width: 100,
          slectBollen: true,
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
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 150,
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
        },
        {
          title: "备件名称",
          dataIndex: "sparePartName",
          width: 100,
          slectBollen: true,
        },
        {
          title: "物资编码",
          dataIndex: "materialCode",
          width: 100,
          slectBollen: true,
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
          width: 150,
        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" },
          align: "center",
          width: 100,
        },
      ],
      form: {
        whetheraccountedequipment: "",
        devicename: "",
        devicetagno: "",
        personincharge: "",
        inspectioncompanyname: "",
        area: "",
        planmaintenancedatetime: "",
        plannedmaintenancetime: "",
        major: "",
        plannedcost: "",
        whetheraffectexportorship: "",
        requiredprocesscondition: "",
        maintenancedescription: "",
        operationcontent: "",
        remark: "",
      },
      rules: {
        whetheraccountedequipment: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        devicename: [
          {
            required: true,
            message: "请输入",
            trigger: "change",
          },
        ],
        dadevicetagno: [
          { required: true, message: "请输入", trigger: "change" },
        ],
        personincharge: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        inspectioncompanyname: [
          {
            required: true,
            message: "请输入",
            trigger: "change",
          },
        ],
        area: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        planmaintenancedatetime: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        plannedmaintenancetime: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (!/^\d+$/.test(value)) {
                callback(new Error('请输入正整数'));
              } else { callback(); }
            }, trigger: 'blur'
          }
        ],
        major: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        plannedcost: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          }, {
            validator: (rule, value, callback) => {
              if (!/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value)) {
                callback(new Error('请输入正浮点'));
              } else { callback(); }
            }, trigger: 'blur'
          }
        ],
        whetheraffectexportorship: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        requiredprocesscondition: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        maintenancedescription: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        operationcontent: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
      },
      spartPartDataSourceOut: [],
    };
  },
  watch: {
    addFormVisible: {
      handler(val) {
        if (val) {

          this.getOutsourceCompany();
          this.getSpareparts();
        }
      },
      immediate: true
    }
  },
  created() {
    this.encodeSelect();
  },
  mounted() {

  },
  methods: {
    moment,
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    deleteClick(row, text, index) {
      this.spartPartDataSourceOut.splice(index, 1)
    },
    disabledplanmaintenancedateDate(vla) {
      // this.$route.query.planYear;
      // this.$route.query.planMonth;
      // let selectDay = `${this.$route.query.planYear,this.$route.query.planMonth}`
      // debugger
      // return selectDay && selectDay < moment().endOf('day');
      let optionalTimeAfter;
      let optionalTimeBefore;
      optionalTimeAfter = `${parseInt(this.$route.query.planYear)}-${parseInt(this.$route.query.planMonth)
        }`;
      if (this.$route.query.planMonth - 1 == 0) {
        optionalTimeBefore = `${parseInt(this.$route.query.planYear) - 1}-12`;
      } else {
        optionalTimeBefore = `${parseInt(this.$route.query.planYear)}-${parseInt(this.$route.query.planMonth) - 1
          }`;
      }
      console.log(`${optionalTimeAfter}-${this.completeDay(optionalTimeAfter)}`);
      return (
        vla > moment(`${optionalTimeAfter}-${this.completeDay(optionalTimeAfter)}`).startOf("days") ||
        vla < moment(`${optionalTimeBefore}-${this.completeDay(optionalTimeBefore)}`).endOf("days")
      );
    },
    completeDay(missingDate) {
      let missingDateArr = missingDate.split('-')
      let day = '01'
      switch (parseInt(missingDateArr[1])) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          day = '31'
          break;
        case 2:
          if (parseInt(missingDateArr[0]) % 400 == 0 || (parseInt(missingDateArr[0]) % 4 == 0 && parseInt(missingDateArr[0]) % 100 != 0)) {
            day = '29'
          } else {
            day = '28'
          }
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          day = '30'
      }
      return day
    },
    paginationChangeCompany(pagination) {
      this.getOutsourceCompany(pagination.current, pagination.pageSize);
    },
    onSelectChangeCompany(selectedRowKeysCompany) {
      this.selectedRowKeysCompany = selectedRowKeysCompany;
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
    cancelCompany(value) {
      this.visibleCompany = false;
    },
    yes(value) {
      for (let i = 0; i < this.companyDataSource.length; i++) {
        if (this.companyDataSource[i].id == this.selectedRowKeysCompany[0]) {
          this.form.inspectioncompanyname =
            this.companyDataSource[i].outsourceCompany;
          this.$refs.ruleForm.validateField('inspectioncompanyname')
          this.visibleCompany = false;
          return false;
        }
      }
    },
    handleChangeCompany(selectListCompany) {
      this.getOutsourceCompany(1, 10, selectListCompany);
    },
    selectSparepart() {
      this.visibleSparepart = true;
    },
    paginationChangeSparepartOut(pagination) {
      this.paginationSparepartOut.current = pagination.current;
      this.paginationSparepartOut.pageSize = pagination.pageSize;
      // this.getSpareparts(pagination.current, pagination.pageSize);
    },
    // 备品备件
    paginationChangeSparepart(pagination) {
      this.selectFrom.pageNum = pagination.current;
      this.selectFrom.pageSize = pagination.pageSize;
      this.getSpareparts(pagination.current, pagination.pageSize);
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
    getSparepartsIn(row, type) {
      if (!type) {
        // 备品备件弹出框缓存选择的数组清空
        this.spartPartDataSourceKey = [];
        // 获取form表单对象循环赋值
        this.Config.formDataList.forEach((item) => {
          // 循环每一个对象取到对象得formKey得值循环赋值给当前对象
          item.value = row[item.formKey];
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
    spartPartDataSourceChange(selectedRowKeys) {
      this.spartPartDataSourceKey = selectedRowKeys;
    },
    //获取备品备件列表selectFrom
    getSpareparts() {
      getListForSparepart(this.selectFrom).then((res) => {
        this.paginationSparepart.current = res.body.pageIndex;
        this.paginationSparepart.total = res.body.total;
        this.paginationSparepart.pageSize = res.body.pageSize;
        // this.spartPartDataSourceOut = res.body.data;
        this.spartPartDataSource = res.body.data;
      });
    },
    no(value) {
      console.log(value, "取消");
      this.visibleSparepart = false;
    },
    ok(value) {
      getIdListForSparepart({
        list: this.spartPartDataSourceKey,
        pageSize: 10,
        pageIndex: 1,
      }).then((res) => {
        let data = res.body.data;
        this.spartPartDataSourceOut = data.map((item) => {
          let newItem = item
          for (let index = 0; index < this.spartPartDataSourceOut.length; index++) {
            const element = this.spartPartDataSourceOut[index];
            if (item.id == element.id) {
              newItem = element
            }
          }
          return newItem
        })
        this.paginationSparepartOut.current = res.body.pageIndex;
        this.paginationSparepartOut.total = res.body.total;
        this.paginationSparepartOut.pageSize = res.body.pageSize;
      });
      this.visibleSparepart = false;
    },
    equipmentClick() {
      this.equipmentVisible = true;
      // this.$refs.equipmentModel.selectedRowKeys = [this.dataForm.sbbm];
    },
    companyClick() {
      this.visibleCompany = true;
      // this.$refs.equipmentModel.selectedRowKeys = [this.dataForm.sbbm];
    },
    selectedClic(value) {
      this.form.devicename = value.eqm_sbmc;
      this.form.devicetagno = value.eqm_sbwh;
      this.equipmentVisible = false;
      this.$refs.ruleForm.validateField('devicename')
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.inspectioncompanyname = this.selectedRowKeysCompany[0];
          // const dateTime = value.planmaintenancedatetime.split("-");
          this.$emit("saveAddForm", this.form, this.spartPartDataSourceOut);
          this.formClose();
        } else {
          this.$message.warning("请输入正确格式的数据！");
        }
      });
    },
    handleCancel() {
      this.formClose();
    },
    formClose() {
      this.$emit("close");
    },
    formListAfterClose() {
      this.form = {
        whetheraccountedequipment: "",
        devicename: "",
        devicetagno: "",
        personincharge: "",
        inspectioncompanyname: "",
        area: "",
        planmaintenancedatetime: "",
        plannedmaintenancetime: "",
        major: "",
        plannedcost: "",
        whetheraffectexportorship: "",
        requiredprocesscondition: "",
        maintenancedescription: "",
        operationcontent: "",
        remark: "",
      };
      this.spartPartDataSourceOut = []
    },
    getPopupContainer() {
      return document.querySelector(".position-add-form");
    },
    // 获取数据字典列表
    encodeSelect() {
      encode("AQYH-QYMC").then((res) => {
        this.areaOption = res.body.data;
      });
      encode("SBGL-JH-ZYZY").then((res) => {
        this.majorOption = res.body.data;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.hidden_information_header {
  // display: flex;
  // justify-content: space-between;
  .button_layout {
    float: right;
  }
}
</style>
