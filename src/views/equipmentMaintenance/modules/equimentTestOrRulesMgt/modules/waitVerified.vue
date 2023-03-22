<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <div class="buttonStyle">
          <pe-button
            :include="[
              {
                value: 'TemporaryVerification',
                icon: '',
                clickName: 'temporaryVerification',
                name: '临时检定',
              },
              {
                value: 'SubmitCensorship',
                icon: '',
                clickName: 'SubmitCensorship',
                name: '送审',
              },
            ]"
            @temporaryVerification="temporaryVerification"
            @SubmitCensorship="SubmitCensorship"
          ></pe-button>
          <!-- 导出 -->
          <ExportComponents
            :url="'/monthly/exportExcel'"
            :params="{ MonthlyPlanNo: $route.params.id }"
          >
          </ExportComponents>
        </div>
      </template>

      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <!-- 查询 -->
              <a-form-model layout="inline" :model="selectForm">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="状态"
                  >
                    <a-select
                      v-model="selectForm.calibrationStatus"
                      show-search
                      placeholder="请选择"
                      option-filter-prop="children"
                      :options="verifiedOption"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备类型"
                  >
                    <a-select
                      v-model="selectForm.eqmType"
                      show-search
                      placeholder="请选择"
                      :options="eqmTypeOption"
                      option-filter-prop="children"
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
                      v-model="selectForm.eqmClassify"
                      show-search
                      placeholder="请选择"
                      :options="equipmentList"
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
                      @click="searchClick"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click="resetFormClick">
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
            <template slot="uploadCertificate" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'UploadCertificate',
                    type: 'link',
                    clickName: 'uploadCertificate',
                    icon: '',
                    style: ['btn_link'],
                    name: '上传证书',
                    disabled: row.calibrationStatus !== '检定中',
                  },
                ]"
                @uploadCertificate="uploadCertificate(row)"
              ></pe-button>
            </template>
          </dc-table>
        </div>
        <!-- 临时检定 -->
        <temporary-verification-form
          :temporary-verification-visible="temporaryVerificationVisible"
          @close="temporaryVerificationClose"
        ></temporary-verification-form>
        <submit-censorship-form
          :submit-censorship-visible="submitCensorshipVisible"
          :list="submitList"
          @close="submitCensorshipClose"
        ></submit-censorship-form>
        <upload-file
          :uploadFileVisible="uploadFileVisible"
          :temForm="temForm"
          @close="uploadFileClose"
        ></upload-file>
      </template>
    </Breadcrumb>
    <!-- <stepsModel
        ref="stepsModel"
        :isShow="typeModel === 'applicationsSearch' ? false : true"
        :id="dispatchForm.temMainPlanNo"
        v-if="formType == 'applicationsSearch'"
      /> -->
  </div>
</template>
<script>
import stepsModel from '@/views/dispatching/components/stepsModel.vue'
import { featureClassification } from '@/api/standingBook'
import SubmitCensorshipForm from './components/submitCensorshipForm.vue'
import temporaryVerificationForm from './components/temporaryVerificationForm.vue'
import { monthDetailsList } from '@/api/equimentTestOrRulesMgt/verificationPlanMonth/verificationPlanMonth'
import UploadFile from './components/uploadFile.vue'
export default {
  components: { temporaryVerificationForm, SubmitCensorshipForm, UploadFile },
  name: '',
  // 临时
  // components:{},
  // props:{},
  data() {
    return {
      flag: false,
      temForm: {}, //上传证书 行数据  父==>子
      eqmTypeOption: [
        {
          value: '特种设备及附件',
          label: '特种设备及附件',
        },
        {
          value: '仪表及计量器具',
          label: '仪表及计量器具',
        },
        {
          value: '其他',
          label: '其他',
        },
      ],
      verifiedOption: [
        {
          value: '检定中',
          label: '检定中',
        },
        {
          value: '已提交',
          label: '已提交',
        },
        {
          value: '未提交',
          label: '未提交',
        },
      ],
      equipmentList: [], //设备分类
      temporaryVerificationVisible: false,
      submitCensorshipVisible: false,
      uploadFileVisible: false,
      labelCol: { span: 4 },
      // searchForm: {
      //   CalibrationStatus: "",
      //   eqmType: "",
      //   eqmClassify: "",
      // },
      selectForm: {
        calibrationStatus: undefined,
        eqmType: undefined,
        eqmClassify: undefined,
        djd: '待检定',
        pageNum: 1,
        pageSize: 10,
      },
      selectedRowKeys: [],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
        },
        {
          title: '状态',
          dataIndex: 'calibrationStatus',
          width: '80px',
        },
        {
          title: '设备类型',
          dataIndex: 'eqmType',
          width: '100px',
        },
        {
          title: '设备分类',
          dataIndex: 'eqmClassify',
          width: '80px',
        },
        {
          title: '设备名称',
          dataIndex: 'eqmName',
          width: '100px',
        },
        {
          title: '设备位号',
          dataIndex: 'eqmNo',
          width: '80px',
        },
        {
          title: '紧急程度',
          dataIndex: 'urgencyDegree',
          width: '80px',
        },
        {
          title: '具备条件',
          dataIndex: 'whetherCanCheckMaintenance',
          width: '80px',
          customRender: (value, row, index) => {
            return {
              children: value == 'Y' ? '是' : '否',
              attrs: { rowSpan: 1 },
            }
          },
        },
        {
          title: '所属设备',
          dataIndex: 'belongToEqm',
          width: '100px',
        },
        {
          title: '规格型号',
          dataIndex: 'specificationModel',
          width: '80px',
        },
        {
          title: '投用日期',
          dataIndex: 'putIntoUseTime',
          width: '100px',
        },
        {
          title: '检定周期',
          dataIndex: 'checkCycle',
          width: '80px',
        },
        {
          title: '上次检定时间',
          dataIndex: 'lastVerificationTime',
          width: '130px',
        },
        {
          title: '下次检定时间',
          dataIndex: 'nextVerificationTime',
          width: '130px',
        },
        {
          title: '检定次数',
          dataIndex: 'verificationNumber',
          width: '80px',
        },
        {
          title: '检定证书',
          width: 100,
          fixed: 'right',
          scopedSlots: { customRender: 'uploadCertificate' },
        },
      ],
      dataSource: [],
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
      submitList: [], // 选中要送检的列表
    }
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
    this.getMonthDetailsList()
    this.getEquipmentList()
  },
  // methods 将被混入到 Vue 实例中
  methods: {
    async getEquipmentList() {
      const { body, code } = await featureClassification()
      // console.log(body,'render')
      if (code == 200) {
        // console.log();
        let data = []
        body.data.forEach((element) => {
          // console.log(element);
          data.push({
            label: element.classificName,
            value: element.classificCode,
          })
        })
        // console.log(data)
        this.equipmentList = data
      }
    },
    getMonthDetailsList() {
      monthDetailsList(this.selectForm).then((res) => {
        this.dataSource = res.body.data
        this.pagination.total = res.body.total
      })
    },
    temporaryVerificationClose() {
      this.temporaryVerificationVisible = false
    },
    temporaryVerificationOpen() {
      this.temporaryVerificationVisible = true
    },
    onSelectChange(selectedRowKeys, row) {
      this.selectedRowKeys = selectedRowKeys
      this.submitList = row
    },
    paginationChange(pagination) {
      this.selectForm.pageNum = pagination.current
      this.selectForm.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getMonthDetailsList()
    },
    searchClick() {
      this.selectForm.pageNum = 1
      this.selectForm.pageSize = 10
      this.getMonthDetailsList()
    },
    resetFormClick() {
      this.selectForm = {
        calibrationStatus: undefined,
        eqmType: undefined,
        eqmClassify: undefined,
        djd: '待检定',
        pageNum: 1,
        pageSize: 10,
      }
      this.getMonthDetailsList()
    },
    temporaryVerification() {
      this.temporaryVerificationOpen()
    },
    // 送审
    submitCensorshipClose() {
      this.submitCensorshipVisible = false
    },
    submitCensorshipOpen() {
      this.submitCensorshipVisible = true
    },
    SubmitCensorship() {
      console.log()
      if (this.submitList.length > 0) {
        this.submitList.forEach((element) => {
          if (element.calibrationStatus == '未提交' || element.calibrationStatus == '已驳回') {
            this.submitCensorshipOpen()
          } else {
            this.$message.warning('状态为未提交与已驳回才可送审')
          }
        })
      } else {
        this.$message.warning('请选择送审的单据')
      }
    },
    // 上传文件
    uploadFileClose() {
      this.uploadFileVisible = false
    },
    uploadFileOpen() {
      this.uploadFileVisible = true
    },
    uploadCertificate(row) {
      this.temForm = row
      this.uploadFileOpen()
    },
    // waitVerifiedApproval
    // 待检定-审批
  },
}
</script>
<style scoped lang="less">
.buttonStyle {
  display: flex;
  justify-content: flex-end;
}
</style>
