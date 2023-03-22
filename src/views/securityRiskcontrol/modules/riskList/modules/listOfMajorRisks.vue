<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'Add',
            clickName: 'addNew',
          },
          {
            value: 'Delete',
            clickName: 'mydelete',
          },
        ]"
        @addNew="libraryDataAdd"
        @mydelete="mydelete"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="5">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="区域名称："
                >
                  <a-select
                    :allowClear="true"
                    style="width: 100%"
                    show-search
                    placeholder="请选择"
                    v-model="form.areaName"
                  >
                    <a-select-option
                      v-for="(item, index) in areaList"
                      :key="index"
                      :value="item.dictname"
                    >
                      {{ item.dictname }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="5">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="单元名称："
                >
                  <a-input
                    v-model="form.unitName"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="5">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="责任单位："
                >
                  <a-select
                    :allowClear="true"
                    style="width: 100%"
                    show-search
                    v-model="form.responsibleUnit"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="(item, index) in unitList"
                      :key="index"
                      :value="item.dictname"
                    >
                      {{ item.dictname }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="5">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="责任人："
                >
                  <a-input
                    v-model="form.responsibleUser"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="4">
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
      <dc-table
        @change="paginationChange"
        rowKey="id"
        :pagination="pagination"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :scroll="{ x: 100 }"
        :columns="columnsDub"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="riskRateLevel" slot-scope="row">
          <div>
            <div
              style="width: 15px; height: 15px; border-radius: 50%; float: left"
              :class="updateBg(row)"
            ></div>
            {{ row }}
          </div>
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
              {
                value: 'look',
                type: 'link',
                clickName: 'lookClick',
                name: '查看',
                style: ['btn_link'],
              },
            ]"
            @edit="editListClick(row)"
            @lookClick="checkListClick(row)"
          ></pe-button>
        </template>
      </dc-table>

      <!-- 新增表单 -->
      <a-modal
        v-model="visible"
        :title="addNewModelConfig.title"
        :cancelText="false"
        :footer="''"
        class="from-style bigModel"
        :after-close="riskLibraryModelClose"
      >
        <a-form-model
          ref="riskLibraryRef"
          :model="riskLibraryForm"
          :rules="riskLibraryRules"
          ><a-row>
            <a-col :span="12">
              <a-form-model-item label="区域名称" prop="areaName">
                <a-select
                  v-model="riskLibraryForm.areaName"
                  placeholder="请选择"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in areaList"
                    :key="index"
                    :value="item.dictname"
                  >
                    {{ item.dictname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="单元名称" prop="unitName">
                <a-input
                  v-model="riskLibraryForm.unitName"
                  placeholder="请输入"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="作业活动/设备设施/工序/其他">
                <a-textarea
                  placeholder="请输入"
                  v-model="riskLibraryForm.otherElse"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="危险因素或潜在事件">
                <a-textarea
                  v-model="riskLibraryForm.danger"
                  placeholder="请输入"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="主要后果">
                <a-textarea
                  v-model="riskLibraryForm.consequence"
                  placeholder="请输入"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="现有控制措施">
                <a-textarea
                  v-model="riskLibraryForm.controlMeasures"
                  placeholder="请输入"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item prop="ll">
                <template slot="label">
                  <span>L</span>
                  <a-tooltip
                    placement="topLeft"
                    title="发生事故或事件的可能性"
                    arrow-point-at-center
                  >
                    <a-icon type="question-circle" class="label_icon" />
                  </a-tooltip>
                </template>
                <a-select
                  placeholder="请选择"
                  v-model="riskLibraryForm.ll"
                  @change="handleFormChange('ll')"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in lOption"
                    :key="index"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="ee">
                <template slot="label">
                  <span>E</span>
                  <a-tooltip
                    placement="topLeft"
                    title="暴露于潜在危害环境的频繁程度"
                    arrow-point-at-center
                  >
                    <a-icon type="question-circle" class="label_icon" />
                  </a-tooltip>
                </template>
                <a-select
                  placeholder="请选择"
                  v-model="riskLibraryForm.ee"
                  @change="handleFormChange('ee')"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in eOption"
                    :key="index"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item prop="cc">
                <template slot="label">
                  <span>C</span>
                  <a-tooltip
                    placement="topLeft"
                    title="发生事故产生的后果"
                    arrow-point-at-center
                  >
                    <a-icon type="question-circle" class="label_icon" />
                  </a-tooltip>
                </template>
                <a-select
                  placeholder="请选择"
                  v-model="riskLibraryForm.cc"
                  @change="handleFormChange('cc')"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in cOption"
                    :key="index"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="d">
                <template slot="label">
                  <span>D = L x E x C</span>
                  <a-tooltip
                    placement="topLeft"
                    title="风险评价值"
                    arrow-point-at-center
                  >
                    <a-icon type="question-circle" class="label_icon" />
                  </a-tooltip>
                </template>
                <a-input
                  placeholder="系统自动生成"
                  v-model="riskLibraryForm.dd"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="风险评价等级" prop="riskRateLevel">
                <a-input
                  placeholder="系统自动生成"
                  v-model="riskLibraryForm.riskRateLevel"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item label="风险管控等级" prop="riskCtrlLevel">
                <a-input
                  placeholder="系统自动生成"
                  v-model="riskLibraryForm.riskCtrlLevel"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="建议新增（改进）措施">
                <a-textarea
                  v-model="riskLibraryForm.newMeasures"
                  placeholder="请输入"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="12">
              <a-form-model-item label="责任单位" prop="responsibleUnit">
                <a-select
                  v-model="riskLibraryForm.responsibleUnit"
                  placeholder="请选择"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                >
                  <a-select-option
                    v-for="(item, index) in unitList"
                    :key="index"
                    :value="item.dictname"
                  >
                    {{ item.dictname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="责任人" prop="responsibleUser">
                <a-input
                  placeholder="请输入"
                  v-model="riskLibraryForm.responsibleUser"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="填报人">
                <a-input
                  v-model="riskLibraryForm.remark"
                  placeholder="请输入"
                  :disabled="
                    riskLibraryFormState == 'check' ||
                    riskLibraryFormStatus == '已提交'
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="footer contneFormBtnStyle ant-modal-footer">
          <a-button
            type="primary"
            @click="onRiskLibrarySubmit('已保存')"
            :disabled="riskLibraryFormStatus == '已提交'"
            v-if="riskLibraryFormState !== 'check'"
          >
            保存
          </a-button>
          <a-button @click="onRiskLibraryBack"> 返回 </a-button>
        </div>
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getListForPage,
  addRisk,
  updateRisk,
  deleteRisk,
  getdict,
} from '@/api/securityRiskcontrol'
import { encode } from '@/api/dataDictionary'
export default {
  data() {
    return {
      unitList: [], //责任单位
      areaList: [],
      stateInfo: [],
      //翻页页面组件
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      //页面下方表格的列属性11
      columnsDub: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
          align: 'center',
        },
        {
          title: '区域名称',
          dataIndex: 'areaName',
          width: 100,
          align: 'center',
        },
        {
          title: '单元名称',
          dataIndex: 'unitName',
          width: 100,
          align: 'center',
        },
        {
          title: '作业活动/设备设施/工序/其他',
          dataIndex: 'otherElse',
          width: 130,
          align: 'center',
          class: 'labelWidth',
        },
        {
          title: '危险因素或潜在事件',
          dataIndex: 'danger',
          width: 140,
          align: 'center',
        },
        {
          title: '主要后果',
          dataIndex: 'consequence',
          width: 120,
          align: 'center',
        },
        {
          title: '现有控制措施',
          dataIndex: 'controlMeasures',
          width: 120,
          align: 'center',
        },
        {
          title: 'L',
          dataIndex: 'll',
          width: 80,
          align: 'center',
        },
        {
          title: 'E',
          dataIndex: 'ee',
          width: 80,
          align: 'center',
        },
        {
          title: 'C',
          dataIndex: 'cc',
          width: 80,
          align: 'center',
        },
        {
          title: 'D',
          dataIndex: 'dd',
          width: 80,
          align: 'center',
        },
        {
          title: '风险评价等级',
          dataIndex: 'riskRateLevel',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'riskRateLevel' },
        },
        {
          title: '风险管控等级',
          dataIndex: 'riskCtrlLevel',
          width: 120,
          align: 'center',
        },
        {
          title: '建议新增（改进）措施',
          dataIndex: 'newMeasures',
          width: 120,
          align: 'center',
        },

        {
          title: '责任单位',
          dataIndex: 'responsibleUnit',
          width: 120,
          align: 'center',
        },
        {
          title: '责任人',
          dataIndex: 'responsibleUser',
          width: 80,
          align: 'center',
        },
        {
          title: '填报人',
          dataIndex: 'remark',
          width: 120,
          align: 'center',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 120,
          fixed: 'right',
        },
      ],
      //勾选框/选择框组件
      selectedRowKeys: [],
      //查看组件中的数值
      LookForm: {},
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageNum: 1,
        pageSize: 10,
        areaName: undefined, //区域名称
        unitName: '', //单元名称
        responsibleUnit: undefined, // 责任单位
        responsibleUser: '', // 责任人
        riskRateLevel: '重大风险',
      },
      //查看是否visible
      visible: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: '950px',
        title: '风险清单-新增',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      //查看的弹窗的相关设置
      lookModelConfig: {
        width: '950px',
        title: '风险清单-查看',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      lOption: [0.1, 0.2, 0.5, 1, 3, 6, 10],
      eOption: [0.5, 1, 2, 3, 6, 10],
      cOption: [1, 2, 7, 15, 40, 100],
      riskLibraryFormState: '',
      riskLibraryFormStatus: '',
      dataSource: [],
      //表格中的数据
      riskLibraryForm: {
        areaName: undefined, // 区域名称
        unitName: '', // 单元名称
        otherElse: '', // 作业活动/设备设施/工序/其他
        danger: '', // 危险因素或潜在事件
        consequence: '', // 主要后果
        controlMeasures: '', // 现有控制措
        ll: undefined, // L(发生事故或事件的可能性)
        ee: undefined, // E(暴露于潜在危害环境的频繁程度)
        cc: undefined, // C(发生事故产生的后果)
        dd: '', // D = L x E x C:(风险评价值)
        riskRateLevel: '', // 风险评价等级
        riskCtrlLevel: '', // 风险管控等级
        newMeasures: '', // 建议新增（改进）措施
        remark: '',
        responsibleUnit: undefined, // 责任单位
        responsibleUser: '', // 责任人
      },
      riskLibraryRules: {
        areaName: [
          { required: true, message: '区域名称不能为空', trigger: 'blur' },
        ],
        unitName: [
          { required: true, message: '单元名称不能为空', trigger: 'blur' },
        ],
        ll: [{ required: true, message: 'L不能为空', trigger: 'blur' }],
        ee: [{ required: true, message: 'E不能为空', trigger: 'blur' }],
        cc: [{ required: true, message: 'C不能为空', trigger: 'blur' }],
        responsibleUnit: [
          { required: true, message: '责任单位不能为空', trigger: 'blur' },
        ],
        responsibleUser: [
          { required: true, message: '责任人不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getListForPage()
    this.getdict()
    this.encode()
  },
  mounted() { },
  methods: {
    getdict() {
      getdict({}).then((res) => {
        this.areaList = res.body.data
        // console.log(res.body.data, 'render')
      })
    },
    //获取列表
    getListForPage() {
      getListForPage(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex
        this.pagination.pageSize = res.body.pageSize
        let data = res.body.data.map((item) => {
          let newItem = item
          let num = newItem.ll * newItem.ee * newItem.cc
          newItem.dd = num ? num : '-'
          // console.log( newItem.dd);
          return newItem
        })
        this.dataSource = data
        this.pagination.total = res.body.total
        this.selectedRowKeys = []
      })
    },
    onRiskLibraryBack() {
      this.visible = false
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    libraryDataAdd() {
      this.visible = true
      this.addNewModelConfig.title = '风险清单-新增'
      this.riskLibraryFormState = 'add'
    },
    //删除选项，根据选择的id删除对应数据
    mydelete() {
      //console.log(this.selectedRowKeys==false,'delete')
      if (this.selectedRowKeys != '') {
        deleteRisk(this.selectedRowKeys).then((res) => {
          if (res.code == '200') {
            this.$message.success('删除成功！')
            this.getListForPage()
          }
        })
      } else {
        this.$message.error('请至少选择一项！')
      }
    },
    onRiskLibrarySubmit(recordStatus) {
      this.$refs.riskLibraryRef.validate((valid) => {
        if (valid) {
          if (!this.riskLibraryForm.hasOwnProperty('id')) {
            addRisk(this.riskLibraryForm).then((res) => {
              if (res.code == 200) {
                this.visible = false
                this.$message.success('添加成功')
                this.getListForPage()
              }
            })
          } else {
            this.riskLibraryForm.recordStatus = recordStatus
            updateRisk(this.riskLibraryForm).then((res) => {
              if (res.code == 200) {
                this.visible = false
                this.$message.success('修改成功')
                this.getListForPage()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.visible = false
    },
    // //查看下方的按钮
    // OK(value) {
    //   console.log(value, 'OK')
    //   this.visibleLook = false
    // },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageNum = 1
        this.form.pageSize = 10
        this.getListForPage()
      } else {
        this.getListForPage()
      }
    },
    //页面变更
    paginationChange(pagination) {
      console.log(pagination)
      this.form.pageNum = pagination.current
      this.form.pageSize = pagination.pageSize
      this.getListForPage()
    },
    riskLibraryModelClose() {
      this.riskLibraryFormInitial()
      this.$refs.riskLibraryRef.clearValidate()
    },
    editListClick(row) {
      this.addNewModelConfig.title = '风险清单-编辑'
      this.riskLibraryFormState = 'edit'
      this.fxkSelectDataEcho(row)
      this.visible = true
    },
    checkListClick(row) {
      this.addNewModelConfig.title = '风险清单-详情'
      this.riskLibraryFormState = 'check'
      this.fxkSelectDataEcho(row)
      this.visible = true
    },
    fxkSelectDataEcho(row) {
      this.riskLibraryForm = row
      // this.riskLibraryFormStatus = res.body.recordStatus
    },
    riskLibraryFormInitial() {
      this.riskLibraryFormState = ''
      this.riskLibraryFormStatus = ''
      this.riskLibraryForm = {
        areaName: undefined, // 区域名称
        unitName: '', // 单元名称
        otherElse: '', // 作业活动/设备设施/工序/其他
        danger: '', // 危险因素或潜在事件
        consequence: '', // 主要后果
        controlMeasures: '', // 现有控制措
        ll: undefined, // L(发生事故或事件的可能性)
        ee: undefined, // E(暴露于潜在危害环境的频繁程度)
        cc: undefined, // C(发生事故产生的后果)
        dd: '', // D = L x E x C:(风险评价值)
        riskRateLevel: '', // 风险评价等级
        riskCtrlLevel: '', // 风险管控等级
        newMeasures: '', // 建议新增（改进）措施
        remark: '', //备注
        responsibleUnit: undefined, // 责任单位
        responsibleUser: '', // 责任人
      }
    },
    resetForm() {
      this.form = {
        pageNum: 1,
        pageSize: 10,
        areaName: undefined, //区域名称
        unitName: '', //单元名称
        responsibleUnit: undefined, // 责任单位
        responsibleUser: '', // 责任人
        riskRateLevel: '重大风险',
      }
      this.form.pageNum = 1
      this.form.pageSize = 10
      this.getListForPage()
    },
    handleFormChange(name) {
      let newL = ''
      let newE = ''
      let newC = ''
      let calculateD = 0
      for (const key in this.riskLibraryForm) {
        if (Object.hasOwnProperty.call(this.riskLibraryForm, key)) {
          const element = this.riskLibraryForm[key]
          if (key === name) {
            this.riskLibraryForm[key] = this.riskLibraryForm[name]
          }
          if (key == 'll') {
            newL = element
          }
          if (key == 'ee') {
            newE = element
          }
          if (key == 'cc') {
            newC = element
          }
        }
      }
      calculateD = newL * newE * newC ? (newL * newE * newC).toFixed(2) : '-'

      this.riskLibraryForm.dd = calculateD
      if (calculateD > 320) {
        this.riskLibraryForm.riskRateLevel = '重大风险'
        this.riskLibraryForm.riskCtrlLevel = '公司级管控'
      } else if (calculateD > 160) {
        this.riskLibraryForm.riskRateLevel = '较大风险'
        this.riskLibraryForm.riskCtrlLevel = '公司级管控'
      } else if (calculateD > 70) {
        this.riskLibraryForm.riskRateLevel = '一般风险'
        this.riskLibraryForm.riskCtrlLevel = '部室（中心）级管控'
      } else if (calculateD >= 0) {
        this.riskLibraryForm.riskRateLevel = '低风险'
        this.riskLibraryForm.riskCtrlLevel = '班组级管控'
      }
    },
    updateBg(row) {
      // console.log(row)
      if (row == '重大风险') {
        return 'bgColorRed'
      } else if (row == '较大风险') {
        return 'bgColorO'
      } else if (row == '一般风险') {
        return 'bgColorY'
      } else {
        return 'bgColorB'
      }
    },

    // 数据字典-单位
    async encode() {
      const { code, body } = await encode('LBSQ_SSBM')
      if (code == '200') {
        const { data } = body
        this.unitList = data
      }
    },
  },
}
</script>
<style scoped lang="less">
.riskManagement {
  display: flex;
  width: 100%;
  /deep/.tree_layout_sider,
  .left-bar {
    max-width: 200px !important;
    min-width: 200px !important;
    height: 520px;
    .header_operate {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px #b6b6b6 solid;
      .operate_but {
        display: inline-block;
        .ant-btn + .ant-btn {
          margin-left: 5px;
        }
      }
    }
    .tree_data {
      .ant-btn-icon-only.ant-btn-sm {
        width: 16px;
        height: 16px;
        font-size: 10px;
        margin-left: 30px;
      }
    }
  }
  .left-bar {
    max-width: 19%;
    margin-right: 1%;
    background-color: #ececec;
    ::v-deep ul .ant-tree-treenode-selected .ant-tree-node-selected {
      width: 100%;
      line-height: 27px;
    }
    ::v-deep .ant-tree ul li span {
      line-height: 27px;
    }
    ::v-deep .ant-tree {
      height: 470px;
      overflow: auto;
    }
  }
  .right-content {
    flex: auto;
    max-width: 80%;
  }
}
/deep/.search .ant-form-item {
  margin-bottom: 0;
}
.riskManagement > div {
  flex: 1 !important;
}
.node_modal {
  .ant-form {
    display: flex;
    flex-wrap: wrap;
    margin-top: -10px;
    .ant-form-item {
      width: calc(50% - 16px);
      margin-top: 20px;
    }
  }
}
.dc_model {
  ::v-deep .ant-col-8 {
    width: 50%;
  }
  ::v-deep .ant-col {
    margin-top: 6px;
    line-height: 20px;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    height: 55px;
  }
  ::v-deep .ant-form-item label {
    white-space: pre-wrap;
  }
}
.risk_form_model {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: calc(50% - 16px);
    // height: 30px;
    margin-bottom: 0px;
    .ant-form-item-label {
      label {
        font-size: 12px;
        line-height: 43px;
      }
    }
    .ant-form-explain {
      font-size: 12px;
    }
  }
  .label_overstep {
    ::v-deep .ant-col {
      label {
        width: 123px;
        line-height: 0px;
      }
      label::after {
        top: -10.5px;
        margin: 0px -4px 0px 1px;
      }
      .ant-form-item-control {
        margin-left: 10px;
      }
    }
    ::v-deep .ant-form-item-control-wrapper:before {
      content: ":";
      position: absolute;
      top: 15.5px;
      margin: 0 4px 0 4px;
    }
  }
  .e_label_overstep {
    ::v-deep label {
      margin-left: 19px;
    }
  }
  .form_textarea {
    height: auto;
    // margin-left: -17px;
    ::v-deep .ant-col {
      height: auto;
    }
  }
}
.form_but {
  width: 100% !important;
  display: flex;
  ::v-deep .ant-form-item-control {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
    .ant-btn + .ant-btn {
      margin-left: 20px;
    }
  }
}
.ant-input[disabled] {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}
.ant-select-disabled {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}
.textarea-input {
  resize: none;
}
.aaaa {
  display: flex;
  justify-content: center;
  width: 100%;
}
.label_icon {
  font-size: 9px !important;
  margin-bottom: 10px;
  margin-left: 3px;
}
.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
.bgColorRed {
  background-color: red;
}
.bgColorO {
  background-color: #ff8b01;
}
.bgColorY {
  background-color: #fcf810;
}
.bgColorB {
  background-color: #1fb0ee;
}
</style>
