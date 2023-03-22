<template>
  <div>
    <a-modal
      width="950px"
      :title="'临时检定'"
      :visible="temporaryVerificationVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form-model ref="dataForm" :model="dataForm" :rules="rules">
        <a-col :span="12">
          <a-form-model-item
            label="设备类型"
            prop="eqmType"
            :labelCol="{ style: 'width: 120px' }"
          >
            <!-- v-model.trim去掉空格 -->
            <a-select v-model.trim="dataForm.eqmType" placeholder="请选择">
              <a-select-option value="特种设备"> 特种设备 </a-select-option>
              <a-select-option value="仪表及计量"> 仪表及计量 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="设备分类"
            prop="eqmClassify"
            :labelCol="{ style: 'width: 160px' }"
          >
            <a-select v-model.trim="dataForm.eqmClassify" placeholder="请选择">
              <a-select-option
                v-for="item in equipmentList"
                :key="item.classificCode"
                :value="item.classificName"
                >{{ item.classificName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="10">
          <a-form-model-item
            label="设备名称"
            :labelCol="{ style: 'width: 130px' }"
          >
            <a-input
              v-model="equipmentName"
              placeholder="请选择设备名称(可多选)"
              disabled
            >
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="2">
          <a-form-model-item>
            <a-button type="primary" @click="equipmentVisible = true"
              >选择</a-button
            >
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="设备位号"
            :labelCol="{ style: 'width: 160px' }"
          >
            <a-input
              v-model="equipmentTagNo"
              placeholder="选择设备名称自动生成"
              disabled
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="紧急程度"
            prop="urgencyDegree"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input
              v-model="dataForm.urgencyDegree"
              default-value="紧急"
              disabled
            >
              <a-select-option value="紧急"> 紧急 </a-select-option>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="是否具备检维修条件"
            prop="whetherCanCheckMaintenance"
            :labelCol="{ style: 'width: 290px' }"
          >
            <a-select
              v-model="dataForm.whetherCanCheckMaintenance"
              default-value="Y"
              disabled
            >
              <a-select-option value="Y"> 是 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-model-item
            label="规格型号"
            prop="specificationModel"
            :labelCol="{ style: 'width: 120px' }"
          >
            <a-input v-model.trim="dataForm.specificationModel" placeholder="请输入"></a-input>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="24">
          <a-form-model-item
            label="内容描述"
            prop="contentDescription"
            :labelCol="{ style: 'width: 110px' }"
          >
            <a-textarea
              v-model.trim="dataForm.contentDescription"
              placeholder="请输入"
            ></a-textarea>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-model-item
            label="上次检定时间"
            :labelCol="{ style: 'width: 180px' }"
          >
            <a-input
              v-model.trim="dataForm.lastVerificationTime"
              disabled
              placeholder="根据证书时间系统自动获取"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="下次检定时间"
            :labelCol="{ style: 'width: 190px' }"
          >
            <a-input
              v-model.trim="dataForm.nextVerificationTime"
              disabled
              placeholder="根据上次检定时间所得"
            ></a-input>
          </a-form-model-item>
        </a-col> -->
        <!-- <a-col :span="12">
          <a-form-model-item
            label="创建人"
            :labelCol="{ style: 'width: 115px' }"
          >
            <a-input
              v-model.trim="dataForm.j"
              disabled
              placeholder="系统自动获取"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="创建日期"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model.trim="dataForm.k"
              disabled
              placeholder="系统自动获取"
            ></a-input>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="24">
          <div class="footer">
            <a-button type="primary" @click="insert"> 提交 </a-button>
            <a-button @click="handleCancel">取消</a-button>
          </div>
        </a-col>
      </a-form-model>
      <equipmentModel
        :equipmentVisible.sync="equipmentVisible"
        @selectedClic="selectedClic"
      />
    </a-modal>
  </div>
</template>
<script>
import { insert } from '@/api/equimentTestOrRulesMgt/waitVerifird/waitVerifird.js'
import { featureClassification } from '@/api/standingBook'
import equipmentModel from './equipmentModel.vue'
export default {
  name: 'formModel',
  components: { equipmentModel },
  props: {
    temporaryVerificationVisible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  data() {
    return {
      equipmentName: '', //设备名称
      equipmentTagNo: '', //设备位号
      equipmentList: [], //设备分类
      value: 0,
      // 弹窗
      equipmentVisible: false,
      // 表单
      dataForm: {
        eqmType: undefined, //设备类型
        eqmClassify: undefined, //设备分类
        urgencyDegree: '紧急',
        whetherCanCheckMaintenance: '是',
        list: [],
        specificationModel: '', //规格型号
        contentDescription: '', //内容描述
      },
      // 校验
      rules: {
        eqmType: [
          { required: true, message: '设备类型不能为空', trigger: 'change' },
        ],
        equipmentClassification: [
          { required: true, message: '设备分类不能为空', trigger: 'change' },
        ],
        equipmentName: [
          {
            required: true,
            message: '设备名称不能为空',
            trigger: 'change',
          },
        ],
        urgencyDegree: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        whetherCanCheckMaintenance: [
          {
            required: true,
            message: '是否具备检维修条件不能为空',
            trigger: 'blur',
          },
        ],
        specificationModel: [
          { required: true, message: '规格型号不能为空', trigger: 'blur' },
        ],
        contentDescription: [
          { required: true, message: '内容描述不能为空', trigger: 'blur' },
        ],
        // lastVerificationTime: [
        //   {
        //     required: true,
        //     message: '上次检定时间不能为空',
        //     trigger: 'change',
        //   },
        // ],
        // nextVerificationTime: [
        //   {
        //     required: true,
        //     message: '下次检定时间不能为空',
        //     trigger: 'blur',
        //   },
        // ],
      },
    }
  },
  created() {
    this.getEquipmentList()
  },
  methods: {
    async getEquipmentList() {
      const { body, code } = await featureClassification()
      // console.log(body,'render')
      if (code == 200) {
        this.equipmentList = body.data
      }
    },
    formClose() {
      this.dataForm = {
        eqmType: undefined, //设备类型
        eqmClassify: undefined, //设备分类
        urgencyDegree: '紧急',
        whetherCanCheckMaintenance: '是',
        list: [],
        specificationModel: '', //规格型号
        contentDescription: '', //内容描述
      }
      this.$refs.dataForm.clearValidate()
      this.equipmentName = ''
      this.equipmentTagNo = '' //设备位号
      this.$emit('close')
    },
    onChange(value) {
      console.log('changed', value)
    },
    // 关闭
    handleCancel() {
      this.formClose()
    },
    // 提交
    insert() {
      if (this.equipmentName == '') {
        this.$message.warning('请选择待检定的设备')
      }
      this.$refs.dataForm.validate(async(valid) => {
        if (valid) {
          const {code} = await insert(this.dataForm)
          // console.log(code);
          if (code == '200'){
            this.$message.success('新增成功')
            this.$parent.$parent.getMonthDetailsList()
            this.formClose()
          }
        }
      })
    },
    selectedClic(selectDate) {
      // console.log(selectDate)
      this.dataForm.list = selectDate
      let nameList = ''
      let noList = ''
      selectDate.forEach((element) => {
        nameList += element.eqmName + '，'
        noList += element.eqmNo + '，'
      })
      console.log(noList)
      this.equipmentName = nameList
      this.equipmentTagNo = noList
      this.equipmentVisible = false
    },
  },
}
</script>
<style lang="less" scoped></style>
