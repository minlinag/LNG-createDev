<template>
  <div>
    <a-modal
      :width="'1000px'"
      :visible="risklookVisible"
      title="风险清单-详情"
      :cancelText="false"
      :footer="''"
       @cancel="onRiskLibraryBack"
    >
      <a-form-model :model="riskLibraryForm"
        ><a-row>
          <a-col :span="12">
            <a-form-model-item label="区域名称" prop="areaName">
              <a-input
                v-model="riskLibraryForm.areaName"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="单元名称" prop="unitName">
              <a-input
                v-model="riskLibraryForm.unitName"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="作业活动/设备设施/工序/其他">
              <a-input
                type="textarea"
                resize="none"
                placeholder="请输入"
                v-model="riskLibraryForm.otherElse"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="危险因素或潜在事件">
              <a-input
                type="textarea"
                class="textarea-input"
                v-model="riskLibraryForm.danger"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="主要后果">
              <a-input
                type="textarea"
                v-model="riskLibraryForm.consequence"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="现有控制措施">
              <a-input
                type="textarea"
                v-model="riskLibraryForm.controlMeasures"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="L（发生事故或事件的可能性）" prop="ll">
              <a-input
                v-model="riskLibraryForm.ll"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="E（暴露于潜在危害环境的频繁程度）"
              prop="ee"
              disabled
            >
              <a-input
                v-model="riskLibraryForm.ee"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="C（发生事故产生的后果）" prop="cc">
              <a-input
                v-model="riskLibraryForm.cc"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="D = L x E x C（风险评价值）" prop="d">
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
              <a-input
                type="textarea"
                v-model="riskLibraryForm.newMeasures"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-model-item label="责任单位" prop="responsibleUnit">
              <a-input
                v-model="riskLibraryForm.responsibleUnit"
                placeholder="请选择"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="责任人" prop="responsibleUser">
              <a-input
                placeholder="请输入"
                v-model="riskLibraryForm.responsibleUser"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="填报人">
              <a-input
                type="textarea"
                v-model="riskLibraryForm.remark"
                placeholder="请输入"
                disabled
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="footer">
          <a-button @click="onRiskLibraryBack"> 返回 </a-button>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
     risklookVisible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    riskLibraryForm: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  methods: {
    onRiskLibraryBack(){
      this.$emit("close");
    }
  }
}
</script>
<style></style>
