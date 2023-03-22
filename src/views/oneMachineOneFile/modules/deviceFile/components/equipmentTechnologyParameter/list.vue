<template>
  <div class="list">
    <Breadcrumb :titleName="title">
      <template slot="breadcrumbButton">
        <pe-button
          :include="[{ value: 'Edit', clickName: 'editListClick' }]"
          @editListClick="editListClick"
        ></pe-button>
      </template>
      <template slot="appMain" class="app_main">
        <table
          class="table_form"
          display="felx"
          justify-content="space-evenly"
          border="2"
        >
          <tr v-for="(item, index) in tableListSBCS">
            <td style="width: 25%; height: 30px" align="center">设备名称</td>
            <td style="width: 25%; height: 30px" align="center">
              {{ item.equipmentName }}
            </td>
            <td style="width: 25%; height: 30px" align="center">制造厂家</td>
            <td style="width: 25%; height: 30px" align="center">
              {{ item.manufacturer }}
            </td>
          </tr>
          <tr v-for="(item, index) in tableListSBCS">
            <td align="center">设备编号</td>
            <td align="center">{{ item.equipmentNo }}</td>
            <td align="center">出厂编号</td>
            <td align="center">{{ item.factoryNo }}</td>
          </tr>
          <tr v-for="(item, index) in tableListSBCS">
            <td align="center">规格型号</td>
            <td align="center">{{ item.modelAndSpecification }}</td>
            <td align="center">主要材料</td>
            <td align="center">{{ item.mainMaterial }}</td>
          </tr>
          <tr v-for="(item, index) in tableListSBCS">
            <td align="center">安装位置</td>
            <td align="center">{{ item.installationSiteGroup }}</td>
            <td align="center">设备用途</td>
            <td align="center">{{ item.deviceUser }}</td>
          </tr>
          <tr v-for="(item, index) in tableListSBCS">
            <td align="center">设备类型</td>
            <td align="center">{{ item.equipmentCategory }}</td>
            <td align="center">制造日期</td>
            <td align="center">{{ item.dateOfProduction }}</td>
          </tr>
          <tr v-for="(item, index) in tableListSBCS">
            <td align="center">安装日期</td>
            <td align="center">{{ item.installDate }}</td>
            <td align="center">投产日期</td>
            <td align="center">{{ item.startDate }}</td>
          </tr>
          <tr v-for="(item, index) in tableListSBCS">
            <td align="center">使用年限</td>
            <td align="center">{{ item.retirementPeriod }}</td>
            <td align="center">/</td>
            <td align="center">/</td>
          </tr>
        </table>
        <div class="main_parameter">
          <p>主要性能参数</p>
          <table class="table_form" border="2">
            <tr>
              <td style="width: 50%; height: 30px" align="center">
                名称（单位）
              </td>
              <td style="width: 50%; height: 30px" align="center">数值</td>
            </tr>
            <tr v-for="(item, index) in tableListSBCS[0].performanceName">
              <td style="width: 50%; height: 30px" align="center">
                {{ item.performanceName }}
              </td>
              <td style="width: 50%; height: 30px" align="center">
                {{ item.performanceNum }}
              </td>
            </tr>
          </table>
        </div>
        <div class="main_parameter">
          <p>设备报警及连锁参数</p>
          <table class="table_form" border="2">
            <tr>
              <td align="center" style="width: 33%; height: 30px">位号</td>
              <td align="center" style="width: 33%; height: 30px">名称</td>
              <td align="center" style="width: 33%; height: 30px">数值</td>
            </tr>
            <tr v-for="(item, index) in tableListSBCS[0].alarmName">
              <td align="center" style="width: 33%; height: 30px">
                {{ item.alarmNo }}
              </td>
              <td align="center" style="width: 33%; height: 30px">
                {{ item.alarmName }}
              </td>
              <td align="center" style="width: 33%; height: 30px">
                {{ item.alarmNum }}
              </td>
            </tr>
          </table>
        </div>
        <div class="main_parameter">
          <p>辅助设备性能参数</p>
          <table class="table_form" border="2">
            <tr>
              <td align="center" style="width: 20%">设备名称</td>
              <td align="center" style="width: 20%">名称（单位）</td>
              <td align="center" style="width: 20%">数值</td>
            </tr>
            <tr v-for="(item, index) in tableListSBCS[0].assistDeviceName">
              <td align="center" style="width: 20%; height: 30px">
                {{ item.assistDeviceName }}
              </td>
              <td align="center" style="width: 20%; height: 30px">
                {{ item.assistUnitName }}
              </td>
              <td align="center" style="width: 20%; height: 30px">
                {{ item.assistDeviceNum }}
              </td>
            </tr>
          </table>
        </div>
      </template>
    </Breadcrumb>
    <edit-from
      :edit-from-visible="editFromVisible"
      @close="editFormClose"
      @saveEditList="saveEditList"
      :tableListSBCS="tableListSBCS"
      v-if="editFromVisible"
    >
    </edit-from>
  </div>
</template>
<script>
import editFrom from "./editFrom.vue";
import {
  findAllList,
  paramsUpdate,
  paramsInsert,
} from "@/api/oneMachineOneFile/equipmentTechnologyParameter";
export default {
  components: { editFrom },
  props: ["title", "deviceCode"],
  data() {
    return {
      editFromVisible: false,
      tableListSBCS: [{
        equipmentName: "",
        manufacturer: "",
        equipmentNo: "",
        factoryNo: "",
        modelAndSpecification: "",
        mainMaterial: "",
        installationSiteGroup: "",
        deviceUser: "",
        equipment_category: "",
        date_of_production: "",
        install_date: "",
        start_date: "",
        retirement_period: "",
        performanceName: [],
        alarmName: [],
        assistDeviceName: [],
      }],
    };
  },
  created() {
    this.getAllList();
  },
  mounted() { },
  methods: {
    getAllList() {
      findAllList({ deviceCode: this.deviceCode }).then((res) => {
        if (res.code == 200) {
          this.$nextTick(() => {
            if (res.body.length === 0) {
              this.tableListSBCS = [
                {
                  equipmentName: "",
                  manufacturer: "",
                  equipmentNo: "",
                  factoryNo: "",
                  modelAndSpecification: "",
                  mainMaterial: "",
                  installationSiteGroup: "",
                  deviceUser: "",
                  equipment_category: "",
                  date_of_production: "",
                  install_date: "",
                  start_date: "",
                  retirement_period: "",
                  performanceName: [],
                  alarmName: [],
                  assistDeviceName: [],
                },
              ];
            } else {
              this.tableListSBCS = [res.body[0]];
            }
            if (!this.tableListSBCS[0].performanceName || !(this.tableListSBCS[0].performanceName.indexOf('performanceName') > -1)) {
              this.tableListSBCS[0].performanceName = [
                {
                  performanceName: "",
                  performanceNum: "",
                }
              ]
            } else {
              this.tableListSBCS[0].performanceName = this.stringTransferArray(this.tableListSBCS[0].performanceName)
            }
            if (!this.tableListSBCS[0].alarmName || !(this.tableListSBCS[0].alarmName.indexOf('alarmName') > -1)) {
              this.tableListSBCS[0].alarmName = [
                {
                  alarmNo: "",
                  alarmName: "",
                  alarmNum: "",
                }
              ]
            } else {
              this.tableListSBCS[0].alarmName = this.stringTransferArray(this.tableListSBCS[0].alarmName)
            }
            if (!this.tableListSBCS[0].assistDeviceName || !(this.tableListSBCS[0].assistDeviceName.indexOf('assistDeviceName') > -1)) {
              this.tableListSBCS[0].assistDeviceName = [
                {
                  assistDeviceName: "",
                  assistUnitName: "",
                  assistDeviceNum: "",
                }
              ]
            } else {
              this.tableListSBCS[0].assistDeviceName = this.stringTransferArray(this.tableListSBCS[0].assistDeviceName)
            }
          })

        }
      });
    },
    stringTransferArray(val) {
      if (val !== "string") {
        return JSON.parse(val.replace(/“/g, '"'))
      }
    },
    arrayTransferString(val) {
      return JSON.stringify(val)
    },
    saveEditList(val) {
      let newVal = this.$lodash.cloneDeep(val);
      newVal[0].performanceName = this.arrayTransferString(val[0].performanceName)
      newVal[0].alarmName = this.arrayTransferString(val[0].alarmName)
      newVal[0].assistDeviceName = this.arrayTransferString(val[0].assistDeviceName)
      if (val[0].id) {
        paramsUpdate(newVal).then((res) => {
          if (res.code == "200") {
            this.getAllList();
            this.$message.success("修改成功");
            this.editFormClose()
          }
        });
      } else {
        newVal[0].deviceCode = newVal[0].equipmentNo
        paramsInsert(newVal).then((res) => {
          if (res.code == "200") {
            this.editFormClose()
            this.$message.success("新增成功");
            this.getAllList();

          }
        });
      }
    },
    editListClick() {
      this.hiddenDangerFormOpen();
    },
    editFormClose() {
      this.editFromVisible = false;
    },
    hiddenDangerFormOpen(val) {
      this.editFromVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
.list {
  width: 100%;
  height: calc(100vh - 100px);
  overflow: scroll;
}
.table_form {
  width: 100%;
  th {
    td {
      width: 25%;
      height: 40px;
    }
  }
}
.btn {
  margin-top: 20px;
}
.main_parameter {
  width: 100%;
  th {
    td {
      width: 25%;
      height: 40px;
    }
  }
  > p {
    padding: 20px 0 10px 0;
    margin-top: -1px;
    margin-bottom: -1px;
    border-right: 2px solid #000;
    border-left: 2px solid #000;
    text-align: center;
  }
}
::v-deep .app_main {
  max-height: calc(100vh - 180px) !important;
  overflow: auto;
}
</style>
