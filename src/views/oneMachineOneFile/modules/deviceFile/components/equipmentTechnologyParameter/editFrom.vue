<template>
  <a-modal
    title="编辑"
    :visible="editFromVisible"
    @ok="editFromSave"
    @cancel="editFromCancel"
    :footer="null"
    class="from-style bigModel"
    :maskClosable="false"
  >
    <a-form-model :model="editForm[0]" :label-col="labelCol">
      <a-col :span="8">
        <a-form-model-item label="设备名称" prop="eqm_sbmc">
          <a-input v-model="editForm[0].equipmentName" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="制造厂家">
          <a-input v-model="editForm[0].manufacturer" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label=" 设备编号">
          <a-input v-model="editForm[0].equipmentNo" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="出厂编号">
          <a-input v-model="editForm[0].factoryNo" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="规格型号">
          <a-input v-model="editForm[0].modelAndSpecification" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="主要材料">
          <a-input v-model="editForm[0].mainMaterial" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="安装位置">
          <a-input v-model="editForm[0].installationSiteGroup" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="设备用途">
          <a-input v-model="editForm[0].deviceUser" />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="设备类型">
          <a-input v-model="editForm[0].equipmentCategory" disabled />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="制造日期">
          <a-date-picker
            v-model="editForm[0].dateOfProduction"
            valueFormat="YYYY-MM-DD"
            type="date"
            placeholder="请选择"
            disabled
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="安装日期">
          <a-date-picker
            v-model="editForm[0].installDate"
            valueFormat="YYYY-MM-DD"
            type="date"
            placeholder="请选择"
            disabled
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="投产日期">
          <a-date-picker
            v-model="editForm[0].startDate"
            valueFormat="YYYY-MM-DD"
            type="date"
            placeholder="请选择"
            disabled
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="使用年限">
          <a-input v-model="editForm[0].retirementPeriod" disabled />
        </a-form-model-item>
      </a-col>

      <a-col :span="24" style="height: 40px">
        <a-form-model-item>
          <p>主要性能参数</p>
        </a-form-model-item>
      </a-col>
      <a-col
        :span="24"
        class="form_list alarm_name"
        v-for="(item, index) in editForm[0].performanceName"
        :key="index + 'performanceName'"
      >
        <div>
          <a-col :span="7">
            <a-form-model-item label="名称（单位）">
              <a-input v-model="item.performanceName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="7">
            <a-form-model-item label="数值">
              <a-input v-model="item.performanceNum" />
            </a-form-model-item>
          </a-col>
          <a-button
            class="icon_button"
            type="primary"
            shape="circle"
            icon="delete"
            v-if="index !== 0"
            @click="performanceDeleteClick(index)"
          />
        </div>
        <div>
          <a-button
            type="primary"
            @click="addPerformance()"
            style="display: inline-block; margin-top: 4px"
            v-if="editForm[0].performanceName.length - 1 == index"
          >
            新增
          </a-button>
        </div>
      </a-col>
      <a-col :span="24" style="height: 40px">
        <a-form-model-item>
          <p>设备报警及连锁参数</p>
        </a-form-model-item>
      </a-col>
      <a-col
        :span="24"
        class="form_list"
        v-for="(item, index) in editForm[0].alarmName"
        :key="index + 'alarmName'"
      >
        <div>
          <a-col :span="7">
            <a-form-model-item label="位号">
              <a-input v-model="item.alarmNo" />
            </a-form-model-item>
          </a-col>
          <a-col :span="7">
            <a-form-model-item label="名称">
              <a-input v-model="item.alarmName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="7">
            <a-form-model-item label="数值">
              <a-input v-model="item.alarmNum" />
            </a-form-model-item>
          </a-col>
          <a-button
            class="icon_button"
            type="primary"
            shape="circle"
            icon="delete"
            v-if="index !== 0"
            @click="alarmDeleteClick(index)"
          />
        </div>
        <div>
          <a-button
            type="primary"
            @click="addAlarmName()"
            style="display: inline-block; margin-top: 4px"
            v-if="editForm[0].alarmName.length - 1 == index"
          >
            新增
          </a-button>
        </div>
      </a-col>
      <a-col :span="24" style="height: 40px">
        <a-form-model-item>
          <p>辅助设备性能参数</p>
        </a-form-model-item>
      </a-col>
      <a-col
        :span="24"
        class="form_list"
        v-for="(item, index) in editForm[0].assistDeviceName"
        :key="index + 'assistDeviceName'"
      >
        <div>
          <a-col :span="7">
            <a-form-model-item label="设备名称">
              <a-input v-model="item.assistDeviceName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="7">
            <a-form-model-item label="名称（单位）">
              <a-input v-model="item.assistUnitName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="7">
            <a-form-model-item label="数值">
              <a-input v-model="item.assistDeviceNum" />
            </a-form-model-item>
          </a-col>
          <a-button
            class="icon_button"
            type="primary"
            shape="circle"
            icon="delete"
            v-if="index !== 0"
            @click="assistDeviceDeleteClick(index)"
          />
        </div>
        <div>
          <a-button
            type="primary"
            @click="addAssistDevice()"
            style="display: inline-block; margin-top: 4px"
            v-if="editForm[0].assistDeviceName.length - 1 == index"
          >
            新增
          </a-button>
        </div>
      </a-col>
    </a-form-model>
    <div class="ant-modal-footer">
      <a-button type="primary" @click="editFromSave"> 保存 </a-button>
      <a-button @click="editFromCancel"> 取消 </a-button>
    </div>
  </a-modal>
</template>
<script>
export default {
  name: "editFrom",
  props: ["editFromVisible", "tableListSBCS"],
  data() {
    return {
      editForm: [],
      labelCol: { span: 8 },
    };
  },
  watch: {
    editFromVisible: {
      handler(val) {
        this.editForm = this.$lodash.cloneDeep(this.tableListSBCS);
      },
      immediate: true,

    },
  },
  created() {

  },
  methods: {
    editFromSave(val) {
      this.$emit("saveEditList", this.editForm);
    },
    editFromCancel(e) {
      this.formClose();
    },
    formClose() {
      this.$emit("close");
    },
    addPerformance() {
      this.editForm[0].performanceName.push({
        performanceName: "",
        performanceNum: "",
      })
    },
    addAlarmName() {
      this.editForm[0].alarmName.push({
        alarmNo: "",
        alarmName: "",
        alarmNum: "",
      })

    },
    addAssistDevice() {
      this.editForm[0].assistDeviceName.push({
        assistDeviceName: "",
        assistUnitName: "",
        assistDeviceNum: "",
      })

    },
    performanceDeleteClick(index) {
      debugger
      this.editForm[0].performanceName.splice(index, 1)
    },
    alarmDeleteClick(index) {
      this.editForm[0].alarmName.splice(index, 1)
    },
    assistDeviceDeleteClick(index) {
      this.editForm[0].assistDeviceName.splice(index, 1)
    },
  },
};
</script>
<style lang="less" scoped>
.form_list {
  flex-direction: row !important;
  justify-content: space-between;
  ::v-deep .ant-col-7 {
    width: 280px;
    .ant-form-item-label label {
      width: 110px !important;
    }
    .ant-form-item-control .ant-input {
      width: 156px !important;
    }
  }
  .icon_button {
    margin-top: 10px;
    width: 22px;
    height: 22px;
    min-width: 22px;
    ::v-deep i {
      font-size: 14px;
      margin-top: -7px;
    }
  }
}
</style>