<template>
  <div class="work-license-form">
    <a-layout>
      <a-layout-content>
        <a-divider orientation="left">基础信息</a-divider>
        <a-form-model
          ref="form"
          :model="form"
          :rules="rules"
          class="from-style bigModel"
        >
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-model-item label="关联单据" v-if="form.relationID">
                <span
                  v-for="(item, index) in form.relationID.split(',')"
                  :key="index"
                  style="margin-right: 5px; color: #2f54eb; cursor: pointer"
                  @click="itemClick(item)"
                  >{{ item }}</span
                >
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="作业类型" prop="operationTypeName">
                <a-select
                  v-if="!dataForm"
                  :default-value="form.operationTypeName"
                  style="width: 99.5%"
                  @change="handleChange"
                  placeholder="请选择作业类型"
                  v-model="form.dictname"
                >
                  <a-select-option
                    v-for="(province, index) in dictSelect"
                    :value="province.dictcode"
                    :key="index"
                  >
                    {{ province.dictname }}
                  </a-select-option>
                </a-select>
                <span v-else>{{ form.operationTypeName }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="许可证编号">
                <a-input
                  placeholder="选择作业类型自动生成"
                  v-model="form.id"
                  disabled
                ></a-input>
                <!--<a-input v-model="form.WorkUnit"/>-->
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="JSA编号"  prop="jsacoding">
                <div
                  style="
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <a-input
                    placeholder="请选择JSA编号"
                    v-model="form.jsacoding"
                    disabled
                  ></a-input>
                  <a-button type="primary" @click.stop="jsaClick(form)">
                    选择
                  </a-button>
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="作业单位">
                <a-input
                  placeholder="选择JSA编号自动生成"
                  v-model="form.workUnit"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="作业地点">
                <a-input
                  placeholder="选择JSA编号自动生成"
                  v-model="form.workPlace"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="作业内容">
                <a-input
                  placeholder="选择JSA编号自动生成"
                  v-model="form.workContent"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="申请时间">
                <a-input
                  placeholder="系统自动生成"
                  v-model="form.createdDateTime"
                  disabled
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="申请单位" prop="applicant">
                <!-- <a-input placeholder="请输入申请单位" v-model="form.applicant" /> -->
                <a-select
                  v-model="form.applicant"
                  show-search
                  placeholder="请选择作业单位"
                >
                  <a-select-option
                    :value="province.OutsourceCompanyName"
                    v-for="(province, index) in company"
                    :key="index"
                  >
                    {{ province.OutsourceCompanyName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="动火人及证书编号"
                prop="operator"
                v-if="form.operationTypeName == '动火作业'"
              >
                <a-input v-model="form.operator" placeholder="请输入动火人" />
              </a-form-model-item>
              <a-form-model-item
                label="接电人员"
                prop="operator"
                v-else-if="form.operationTypeName == '临时用电作业'"
              >
                <a-input v-model="form.operator" placeholder="请输入接电人员" />
              </a-form-model-item>
              <a-form-model-item
                label="吊装作业人（操作人员）"
                prop="operator"
                v-else-if="form.operationTypeName == '吊装作业'"
              >
                <a-input
                  v-model="form.operator"
                  placeholder="请输入吊装作业人"
                />
              </a-form-model-item>
              <a-form-model-item label="作业人员" prop="operator" v-else>
                <a-input v-model="form.operator" placeholder="请输入作业人员" />
              </a-form-model-item>
              <!-- v-if="form.operationTypeName == '管线打开作业'" -->
            </a-col>
            <a-col :span="12" v-if="form.operationTypeName == '临时用电作业'">
              <a-form-model-item label="电工证号">
                <a-input
                  placeholder="请输入"
                  v-model="form.operatorElectricCertificate"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="接电负责人"
                prop="personInCharge"
                v-if="form.operationTypeName == '临时用电作业'"
              >
                <a-input
                  placeholder="请输入接电负责人"
                  v-model="form.personInCharge"
                />
              </a-form-model-item>
              <a-form-model-item
                label="作业负责人"
                prop="personInCharge"
                v-else
              >
                <a-input
                  placeholder="请输入作业负责人"
                  v-model="form.personInCharge"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="form.operationTypeName == '临时用电作业'">
              <a-form-model-item label="电工证号">
                <a-input
                  placeholder="请输入"
                  v-model="form.personInChargeElectricCertificate"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="监护人" prop="guardian">
                <a-input placeholder="请输入监护人" v-model="form.guardian" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="业务主管单位"
                prop="businessCompetentUnit"
              >
                <a-select
                  placeholder="请选择业务主管单位"
                  v-model="form.businessCompetentUnitCode"
                  @change="unitChange('businessCompetentUnitCode')"
                >
                  <a-select-option
                    v-for="(item, index) in ywList"
                    :key="index"
                    :value="item.value"
                    >{{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="属地单位" prop="territoryUnit">
                <a-select
                  style="width: 99%"
                  placeholder="请选择属地单位"
                  v-model="form.territoryUnitCode"
                  @change="unitChange('territoryUnitCode')"
                >
                  <a-select-option
                    v-for="(item, index) in sdList"
                    :key="index"
                    :value="item.value"
                    >{{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" v-if="measuresForm">
              <messuresForm
                :measuresForm="measuresForm"
                :measuresTitle="measuresTitle"
                ref="messuresForm"
              ></messuresForm>
            </a-col>
            <a-col :span="12" v-if="form.operationTypeName == '一般作业'">
              <a-form-model-item label="受影响设备" prop="affectedEquipment">
                <a-input v-model="form.affectedEquipment" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="form.operationTypeName == '一般作业'">
              <a-form-model-item label="工作人数" prop="employeesNumber">
                <a-input v-model="form.employeesNumber" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" v-if="form.operationTypeName == '一般作业'">
              <a-divider orientation="left">关联风险类型</a-divider>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item label="类型" :label-col="rowLabelCol">
                    <a-checkbox-group
                      @change="onChangeCheckBox"
                      v-model="form.associatedJobType"
                    >
                      <a-checkbox
                        :value="item.value"
                        v-for="(item, index) in checkBoxOptions['关联类型']"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="其他" :label-col="rowLabelCol">
                    <a-input v-model="form.associatedJobTypeOthers" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24" v-if="form.operationTypeName == '一般作业'">
              <a-divider orientation="left">工作区域准备</a-divider>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item label="准备" :label-col="rowLabelCol">
                    <a-checkbox-group
                      @change="onChangeCheckBox"
                      v-model="form.workAreaPreparation"
                    >
                      <a-checkbox
                        :value="item.value"
                        v-for="(item, index) in checkBoxOptions['工作区域']"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="其他" :label-col="rowLabelCol">
                    <a-input v-model="form.workAreaPreparationOthers" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24">
              <a-divider orientation="left">风险辨识结果</a-divider>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item label="结果" :label-col="rowLabelCol">
                    <a-checkbox-group
                      @change="onChangeCheckBox"
                      v-model="form.riskIdentificationResultsRisk"
                    >
                      <a-checkbox
                        :value="item.value"
                        v-for="(item, index) in checkBoxOptions['风险']"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24" v-if="form.operationTypeName !== '一般作业'">
                  <a-form-model-item label="其他" :label-col="rowLabelCol">
                    <a-input v-model="form.riskIdentificationResultsOthers" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="介质"
                    :label-col="rowLabelCol"
                    v-if="form.operationTypeName == '管线打开作业'"
                  >
                    <a-checkbox-group
                      @change="onChangeCheckBox"
                      v-model="form.riskIdentificationResultsMedium"
                    >
                      <a-checkbox
                        :value="item.value"
                        v-for="(item, index) in checkBoxOptions['介质']"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-model-item>
                </a-col>

                <a-col
                  :span="24"
                  v-if="form.operationTypeName == '管线打开作业'"
                >
                  <a-form-model-item label="其他" :label-col="rowLabelCol">
                    <a-input
                      v-model="form.riskIdentificationResultsMediumOthers"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24" v-if="form.operationTypeName == '一般作业'">
                  <a-form-model-item label="注意事项" :label-col="rowLabelCol">
                    <a-input
                      v-model="form.riskIdentificationResultsSafetyPre"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24" v-if="form.operationTypeName == '一般作业'">
              <a-divider orientation="left">个人安全准备</a-divider>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item label="防护用具" :label-col="rowLabelCol">
                    <a-checkbox-group
                      @change="onChangeCheckBox"
                      v-model="form.safetyPreparationProtectiveEqm"
                    >
                      <a-checkbox
                        :value="item.value"
                        v-for="(item, index) in checkBoxOptions['个人安全']"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    label="过滤呼吸器"
                    :label-col="rowLabelCol"
                  >
                    <a-input v-model="form.safetyPreparationRespirator" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="手套" :label-col="rowLabelCol">
                    <a-input v-model="form.safetyPreparationGlove" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="其他" :label-col="rowLabelCol">
                    <a-input v-model="form.safetyPreparationOthers" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24" v-if="form.operationTypeName == '一般作业'">
              <a-divider orientation="left">隔离设备</a-divider>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-model-item label="隔离设备" :label-col="rowLabelCol">
                    <a-checkbox-group
                      @change="onChangeCheckBox"
                      v-model="form.lsolationEquipment"
                    >
                      <a-checkbox
                        :value="item.value"
                        v-for="(item, index) in checkBoxOptions['隔离设备']"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="其他" :label-col="rowLabelCol">
                    <a-input v-model="form.lsolationEquipmentOthers" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24">
              <a-row :gutter="24">
                <a-col :span="24">
                  <messuresTable
                    v-if="form.operationTypeName == '盲板抽堵作业'"
                    :tableData="measuresTable"
                    :measuresTitle="measuresTitle"
                  ></messuresTable>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24">
              <a-row :gutter="24">
                <a-divider orientation="left">作业方案及其他</a-divider>
                <a-col :span="12">
                  <a-form-model-item label="作业方案">
                    <fileUpload
                      :Text="'作业方案及示意图'"
                      @fileChange="flieChange1"
                    ></fileUpload>
                  </a-form-model-item>
                </a-col>
                <a-col
                  :span="12"
                  v-if="form.operationTypeName == '受限空间作业'"
                >
                  <a-form-model-item label="应急预案">
                    <fileUpload
                      :Text="'应急预案'"
                      @fileChange="emergencyPlanChange"
                    ></fileUpload>
                  </a-form-model-item>
                </a-col>
                <a-col
                  :span="12"
                  v-if="form.operationTypeName == '盲板抽堵作业'"
                >
                  <a-form-model-item label="盲板位置图及编号">
                    <fileUpload
                      :Text="'上传文件'"
                      @fileChange="blindPlateLocationChange"
                    ></fileUpload>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12" v-if="form.operationTypeName == '动土作业'">
                  <a-form-model-item label="作业范围、内容、方式示意图">
                    <fileUpload
                      :Text="'上传文件'"
                      @fileChange="workScopeChange"
                    ></fileUpload>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-form-model>

        <a-row :span="24" v-if="form.operationTypeName != '一般作业'">
          <a-col :span="24">
            <a-divider orientation="left">安全措施</a-divider>
            <a-table
              class="labelWrap"
              :scroll="{ x: 50 }"
              :row-key="(record) => record.id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="false"
              :openSelector="false"
            >
              <template slot="operation" slot-scope="row, text">
                <a-radio-group
                  v-model="text.deviceLubricationType"
                  :disabled="!form.id"
                  disabled
                >
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="2"> 不涉及 </a-radio>
                </a-radio-group>
              </template>
            </a-table>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="其他安全措施" :label-col="rowLabelCol">
              <a-input v-model="form.elseMeasures" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <div v-if="visible">
          <dc-Model v-model="visible" @clear="clear" :modelConfig="modelConfig">
            <jsaList
              @listClick="JSAChange"
              v-if="dataFormType == 'add' && visible"
              :dictname="form.dictname"
            >
            </jsaList>
            <infoDetail
              :dataForm="dataListForm"
              v-if="dataFormType == 'upDate' && visible"
            ></infoDetail>
          </dc-Model>
        </div>
      </a-layout-content>
    </a-layout>
    <div class="btn-content contneFormBtnStyle ant-modal-footer">
      <a-button type="primary" @click="submint"> 确认 </a-button>
      <a-button @click="$emit('clear')"> 取消 </a-button>
    </div>
  </div>
</template>
<script>
import { companySelect } from '@/api/JSAAnalysis'
import {
  getdict, //获取作业类型字典表数据
  getCheckBox, //获取作业类型字典表数据
  getMeasures, //获取措施table表格
  getMeasuresForm, //获取措施form表单数据
  updateJsonWithAtt, //修改作业类型措施
} from '@/api/workLicense'
import imgUpload from '@/components/upLoad/imgUpload'
import fileUpload from '@/components/importConpontsData'
import messuresForm from './messures/messuresForm' //策列form表格
import messuresTable from './messures/messuresTable' //策列form表格
import {
  getCreateNewId, //获取许可证
  addOperationApplication, //添加作业许可证
  getJsonByCode,
} from '@/api/workLicense'
import { message } from 'ant-design-vue'
import jsaList from './messures/jsaList'
import infoDetail from './components/infoDetail'

export default {
  components: {
    imgUpload: imgUpload,
    fileUpload: fileUpload,
    messuresForm: messuresForm,
    messuresTable: messuresTable,
    jsaList: jsaList,
    infoDetail: infoDetail,
  },

  data() {
    return {
      company: [], //外委单位下拉框
      // 属地单位列表
      ywList: [
        {
          label: '检维修中心',
          value: 'jwxzx',
        },
        {
          label: '生产运营中心',
          value: 'scyyzx',
        },
        {
          label: '运行保障中心',
          value: 'yxbzzx',
        },
        {
          label: '质量安全环保部',
          value: 'zlaqhbb',
        },
        {
          label: '综合办公室',
          value: 'zhbgs',
        },
        {
          label: '党群工作部',
          value: 'dqbgs',
        },
        {
          label: '人力资源部',
          value: 'rlzyb',
        },
        {
          label: '法律审计部',
          value: 'flsjb',
        },
        {
          label: '财务部',
          value: 'cwb',
        },
        {
          label: '企管计划部',
          value: 'qgjhb',
        },
        {
          label: '生产技术部',
          value: 'scjsb',
        },
      ],
      sdList: [
        {
          label: '综合办公室',
          value: 'zhbgs',
        },
        {
          label: '质量安全环保部',
          value: 'zlaqhbb',
        },
        {
          label: '运行保障中心',
          value: 'yybzzx',
        },
        {
          label: '检维修中心',
          value: 'jwxzx',
        },
        {
          label: '生产运营中心',
          value: 'scyyzx',
        },
      ],
      dataListForm: {},
      dataFormType: 'add',
      modelConfig: {
        width: '1000px',
        title: 'JSA列表',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      visible: false,
      file1: null,
      file2: null,
      emergencyPlan: null, //应急预案
      blindPlateLocation: null, //盲板位置图
      workScope: null, //作业范围
      measuresTable: [{}], //策略表格

      dictSelect: [], //作业类型下拉框
      checkBoxOptions: [],
      labelCol: { style: 'width: 150px' },
      rowLabelCol: { style: 'width: 100px' },
      wrapperCol: { span: 14 },
      form: {},
      dataSource: [],
      measuresForm: [], //措施form表单
      measuresTitle: '',
      rules: {
        jsacoding:[
              { required: true, message: 'JSA编号不能为空', trigger: 'blur' },
        ],
        operationTypeName: [
          { required: true, message: '作业类型不能为空', trigger: 'blur' },
        ],
        applicant: [
          { required: true, message: '申请单位不能为空', trigger: 'blur' },
        ],
        operator: [
          { required: true, message: '作业人员不能为空', trigger: 'blur' },
        ],
        personInCharge: [
          { required: true, message: '作业负责人不能为空', trigger: 'blur' },
        ],
        guardian: [
          { required: true, message: '监护人不能为空', trigger: 'blur' },
        ],
        territoryUnit: [
          { required: true, message: '属地单位不能为空', trigger: 'blur' },
        ],
        businessCompetentUnit: [
          { required: true, message: '业务主管单位不能为空', trigger: 'blur' },
        ],
        operationDuration: [
          { required: true, message: '作业时长不能为空', trigger: 'change' },
        ],
        affectedEquipment:[
            { required: true, message: '受影响设备不能为空', trigger: 'change' },
        ],
        employeesNumber:[
            { required: true, message: '工作天数不能为空', trigger: 'change' },
        ],
      },
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
          width: 75,
        },
        {
          title: '安全措施（监护人应对以下方面进行确认）',
          dataIndex: 'equipmentCode',
        },
        {
          title: '是否落实',
          dataIndex: 'deviceLubricationType',
          width: 250,
          scopedSlots: { customRender: 'operation' },
        },
        {
          title: '确认人',
          dataIndex: 'deviceName',
          width: 150,
        },
      ],
    }
  },
  props: {
    dataForm: {
      type: Object,
      default: () => {
        return null
      },
    },
      dataType:{
          type: String,
          default: () => {
              return null
          },
      }
  },
  mounted() { },
  watch: {
    dataForm(val, oldval) {
      this.getdict()
      this.checkBoxOptions = getCheckBox()
      this.infoDetail(val)
    },
  },
  created() {
    this.getdict()
    this.getOutsourceCompany()
    this.checkBoxOptions = getCheckBox()
    if (this.dataForm) {
      this.infoDetail(this.dataForm)
    }
    console.log(this.form, 'asd')
  },
  methods: {
    emergencyPlanChange(val) {
      console.log('emergencyPlanChange')
      this.emergencyPlan = val
    },
    blindPlateLocationChange(val) {
      console.log('blindPlateLocation')
      this.blindPlateLocation = val
    },
    workScopeChange(val) {
      console.log('workScope')
      this.workScope = val
    },
    flieChange(val) {
      this.file1 = val
    },
    flieChange1(val) {
      this.file2 = val
    },
    unitChange(val) {
      if (val == 'territoryUnitCode') {
        this.sdList.forEach((item) => {
          if (item.value == this.form.territoryUnitCode) {
            this.form.territoryUnit = item.label
          }
        })
      }
      if (val == 'businessCompetentUnitCode') {
        this.ywList.forEach((item) => {
          if (item.value == this.form.businessCompetentUnitCode) {
            this.form.businessCompetentUnit = item.label
          }
        })
      }
    },
    // 获取外委单位列表
    getOutsourceCompany() {
      companySelect().then((res) => {
        this.company = res.body
        // res.body.forEach((item) => {
        //   this.addNewConfig.formDataList[3].optionData.push({
        //     value: item.OutsourceCompanyCode,
        //     label: item.OutsourceCompanyName,
        //   })
        // })
        // this.company = this.addNewConfig.formDataList[3].optionData
        console.log(this.company)
      })
    },
    clear() {
      this.visible = false
      this.getList()
    },
    jsaClick(val) {
        console.log(val);
      if (!val.operationTypeName) {
        this.$message.error('请选择作业类型')
        return false
      }
      this.dataFormType = 'add'
      this.visible = true
    },
    //JSA点击事件
    JSAChange(value) {
      console.log(value)
      this.visible = false
      this.$set(this.form, 'workUnit', value.workUnit)
      this.$set(this.form, 'workContent', value.workContent)
      this.$set(this.form, 'JSAID', value.id)
      this.$set(this.form, 'jsacoding', value.coding)
      this.$set(this.form, 'workPlace', value.operatingLocationRemarks)
    },
    //获取字典表作业类型
    getdict() {
      getdict().then((res) => {
        this.dictSelect = res.body.data
      })
    },
    itemClick(val) {
      getJsonByCode({ strCode: val.id }).then((res) => {
        this.visible = true
        this.dataFormType = 'upDate'
        this.dataListForm = res.body
      })
    },
    //作业类型点击事件
    handleChange(value) {
        for(var i=0;i<this.dictSelect.length;i++){
            if(this.dictSelect[i].dictcode==value){
                this.measuresTitle = this.dictSelect[i].dictname
                this.form.operationTypeCode = this.dictSelect[i].dictcode
                this.form.operationTypeName = this.dictSelect[i].dictname
            }
        }

      getCreateNewId({ typeCode: this.form.operationTypeCode }).then(
        (res) => {
          if (res.code == '200') {
            this.$set(this.form, 'id', res.body)
              this.$set(this.form, 'workUnit', "")
              this.$set(this.form, 'workContent', "")
              this.$set(this.form, 'JSAID', "")
              this.$set(this.form, 'jsacoding',"")
              this.$set(this.form, 'workPlace',"")
          }
        }
      )
      let data = []
      if (getMeasures( this.form.operationTypeName )) {
        getMeasures( this.form.operationTypeName ).forEach((item) => {
          data.push({
            equipmentCode: item,
            deviceLubricationType: 1,
            deviceName: '',
          })
        })
        this.dataSource = data
      }
      this.measuresForm = getMeasuresForm( this.form.operationTypeName )
      this.measuresTable = [{}]
    },
    handleWhetherIn(val) {
      console.log(val)
    },
    // 多选框点击事件
    onChangeCheckBox() { },
    onSubmit() {
      console.log('submit!', this.form)
    },
    onChange() { },
    arrayAndString(val, type) {
      let dataVal
      if (type == 'string') {
        dataVal = val ? val.toString() : null
      } else {
        dataVal = val ? val.split(',') : []
      }
      return dataVal
    },
    //数据处理
    infoDetail(val) {
        console.log(val);
      this.arrayAndString()
      if (val) {
        this.form = val.baseInfo
        this.form.dictname = val.baseInfo.operationTypeCode
        this.form.JSAID = val.baseInfo.jsaid
        this.form.associatedJobType = this.arrayAndString(
          this.form.associatedJobType
        )
        this.form.riskIdentificationResultsRisk = this.arrayAndString(
          val.baseInfo.riskIdentificationResultsRisk
        )
        this.form.safetyPreparationProtectiveEqm = this.arrayAndString(
          val.baseInfo.safetyPreparationProtectiveEqm
        )
        this.form.workAreaPreparation = this.arrayAndString(
          val.baseInfo.workAreaPreparation
        )
        this.form.lsolationEquipment = this.arrayAndString(
          val.baseInfo.lsolationEquipment
        )
        this.form.riskIdentificationResultsMedium = this.arrayAndString(
          val.baseInfo.riskIdentificationResultsMedium
        )
        this.measuresTitle = val.baseInfo.operationTypeName
        this.measuresForm = getMeasuresForm(val.baseInfo.operationTypeName)
        this.measuresTable = val.measuresTable ? val.measuresTable : [{}]
        //表格数据渲染
        var data = []
        var param = this.arrayAndString(val.param)
        if (getMeasures(val.baseInfo.operationTypeName)) {
          getMeasures(val.baseInfo.operationTypeName).forEach((item, index) => {
            data.push({
              equipmentCode: item,
              deviceLubricationType: Number(param[index]),
              deviceName: '',
            })
          })
          this.dataSource = data
        }
        if (this.measuresForm) {
          this.measuresForm.forEach((item) => {
            item.value =
              item.labelKey == 'hotWorkPrepare' ||
                item.labelKey == 'safetyMeasuresClear' ||
                item.labelKey == 'safetyMeasuresIsolate' ||
                item.labelKey == 'safetyMeasuresControlEquipment'
                ? val.measuresForm[item.labelKey]
                  ? val.measuresForm[item.labelKey].split(',')
                  : []
                : val.measuresForm[item.labelKey]
          })
        }
      }
    },
    //保存数据
    submint() {
      var isType = true
      //  console.log(  this.$refs.messuresForm.$refs.form.);
      this.$refs.form.validate((valid) => {
        if (valid) {
          var easuresDataBox = {}
          // 基本信息处理
          var dataForm = Object.assign({}, this.form)
          dataForm.associatedJobType = this.arrayAndString(
            this.form.associatedJobType,
            'string'
          )
          dataForm.riskIdentificationResultsRisk = this.arrayAndString(
            this.form.riskIdentificationResultsRisk,
            'string'
          )
          dataForm.safetyPreparationProtectiveEqm = this.arrayAndString(
            this.form.safetyPreparationProtectiveEqm,
            'string'
          )
          dataForm.workAreaPreparation = this.arrayAndString(
            this.form.workAreaPreparation,
            'string'
          )
          dataForm.lsolationEquipment = this.arrayAndString(
            this.form.lsolationEquipment,
            'string'
          )
          dataForm.riskIdentificationResultsMedium = this.arrayAndString(
            this.form.riskIdentificationResultsMedium,
            'string'
          )
          //措施数据处理
          var dataBox = []
          this.dataSource.forEach((item, index) => {
            dataBox.push(item.deviceLubricationType)
          })
          easuresDataBox.measuresForm = {}
          var measuresFormText = ''
          if (this.measuresForm) {
            this.measuresForm.forEach((item) => {
              if (this.form.operationTypeName != '动火作业') {
                if (item.value == '') {
                  measuresFormText += item.label + '、'
                  isType = false
                }
              }
              if (item.type == 'selectAll') {
                  console.log(item.value)
                item.value =item.value.join(',')
              }
              easuresDataBox.measuresForm[item.labelKey] =
                item.labelKey == 'hotWorkPrepare' ||
                  item.labelKey == 'safetyMeasuresClear' ||
                  item.labelKey == 'safetyMeasuresIsolate' ||
                  item.labelKey == 'safetyMeasuresControlEquipment'
                  ? item.value
                    ? item.value.toString()
                    : ''
                  : item.value
            })
          }
          easuresDataBox.baseInfo = dataForm
          if (easuresDataBox.baseInfo.operationTypeName == '动火作业') {
            if (
              easuresDataBox.measuresForm.hotWorkPrepare == '' ||
              easuresDataBox.measuresForm.hotWorkElse == ''
            ) {
              isType = false
              this.$message.warning(
                '动火方式准备和其他动火方式其中一项不能为空'
              )
            }
          }
          //表格数据保存
          easuresDataBox.param = dataBox.join(',')
          //table数据保存
          easuresDataBox.measuresTable = this.measuresTable
          var formData = new FormData()
          formData.append('strJson', JSON.stringify(easuresDataBox))
          formData.append('file1', this.file1)
          formData.append('file2', this.file2)
          formData.append('emergencyPlan', this.emergencyPlan)
          formData.append('blindPlateLocation', this.blindPlateLocation)
          formData.append('workScope', this.workScope)
          if (isType) {
            if (this.dataForm&&this.dataType!='copy') {
              updateJsonWithAtt(formData).then((res) => {
                if (res.code == '200') {
                  message.success('修改成功')
                  this.$emit('clear')
                }
              })
            } else {
              addOperationApplication(formData).then((res) => {
                if (res.code == '200') {
                  message.success('新增成功')
                  this.$emit('clear')
                }
              })
            }
          } else {
            this.$message.warning('特殊信息:' + measuresFormText + '不能为空')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.ant-form-item-label {
  overflow: unset;
  width: 120px !important;

  label {
    text-align: left;
    line-height: 15px;
    padding-right: 5px;
    width: 120px !important;
    white-space: pre-wrap;
    min-height: 40px;
    display: flex;
    justify-content: right;
    align-items: center;
  }
}
.ant-card {
  /deep/ .ant-card-body {
    padding: 10px !important;
  }
}
.ant-row {
  .ant-col-12 {
    margin-bottom: -8px !important;
  }
  .ant-col-24 {
    margin-bottom: -13px !important;
  }
}
.work-license-form {
  .ant-card-body {
    padding: 5px !important;
  }
  .ant-card-head-title {
    padding: 0 !important;
  }
  .ant-card-head {
    margin-bottom: 5px;
    min-height: 20px;
  }
  .btn-content {
    text-align: center;
    button {
      margin: 5px 12px;
    }
  }
}
</style>
