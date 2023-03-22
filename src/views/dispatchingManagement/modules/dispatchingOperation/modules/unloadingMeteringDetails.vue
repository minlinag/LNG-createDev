<template>
  <div>
    <a-form-model>
      <table width="100%" id="printContent" class="tableStyle tableBrder">
        <tr>
          <td colspan="6" class="tableTitle">&nbsp;&nbsp;基础信息</td>
        </tr>
        <tr>
          <td width="17%" class="textAlignRight table_item">编制人&nbsp;</td>
          <td width="16%">{{ lookForm.createdUser }}</td>
          <td width="16%" class="textAlignRight table_item">编制单位&nbsp;</td>
          <td width="16%">{{ lookForm.createUserSubsidiaryOrgan }}</td>
          <td width="12%" class="textAlignRight table_item">编制日期&nbsp;</td>
          <td width="20%">{{ lookForm.createdDateTime }}</td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">船总序号&nbsp;</td>
          <td>{{ lookForm.shipNo }}</td>
          <td class="textAlignRight table_item">船当年序号&nbsp;</td>
          <td>{{ lookForm.shipNoByYear }}</td>
          <td class="textAlignRight table_item">状 态&nbsp;</td>
          <td>{{ lookForm.statusName }}</td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">投产总计&nbsp;</td>
          <td>
            {{ lookForm.totalProduction_M3 }}
            <span style="float: right">m³&nbsp;&nbsp;</span>
          </td>
          <td colspan="2">
            {{ lookForm.totalProduction_T }}
            <span style="float: right">t&nbsp;&nbsp;</span>
          </td>
          <td colspan="2">
            {{ lookForm.totalProduction_NM3 }}
            <span style="float: right">Nm³&nbsp;&nbsp;</span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">当年总计&nbsp;</td>
          <td>
            {{ lookForm.totalYear_M3 }}
            <span style="float: right">m³&nbsp;&nbsp;</span>
          </td>
          <td colspan="2">
            {{ lookForm.totalYear_T }}
            <span style="float: right">t&nbsp;&nbsp;</span>
          </td>
          <td colspan="2">
            {{ lookForm.totalYear_T }}
            <span style="float: right">Nm³&nbsp;&nbsp;</span>
          </td>
        </tr>
        <tr>
          <td colspan="6" class="tableTitle">&nbsp;&nbsp;卸船信息</td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">性质&nbsp;</td>
          <td colspan="2">{{ lookForm.natureName }}</td>
          <td class="textAlignRight table_item">船名&nbsp;</td>
          <td colspan="2">{{ lookForm.shipName }}</td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">接船日期&nbsp;</td>
          <td colspan="2">{{ lookForm.receivingDate }}</td>
          <td class="textAlignRight table_item">船型&nbsp;</td>
          <td colspan="2">{{ lookForm.shipTypeName }}</td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">装货港&nbsp;</td>
          <td colspan="2">{{ lookForm.loadingPort }}</td>
          <td class="textAlignRight table_item">来源&nbsp;</td>
          <td colspan="2">{{ lookForm.source }}</td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">出港体积,m³&nbsp;</td>
          <td colspan="2">
            {{ lookForm.departureVolume }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">卸前体积,m³&nbsp;</td>
          <td colspan="2">
            {{ lookForm.beforeUnloadVolume }}
            <span style="float: right"></span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">卸货质量,t&nbsp;</td>
          <td colspan="2">
            {{ lookForm.unloadQuality }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">卸后体积,m³&nbsp;</td>
          <td colspan="2">
            {{ lookForm.afterUnloadVolume }}
            <span style="float: right"></span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">卸货标方,Nm³&nbsp;</td>
          <td colspan="2">
            {{ lookForm.unloadNm3 }}
            <span style="float: right"></span>
          </td>
          <td></td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="6" class="tableTitle">&nbsp;&nbsp;分析报告</td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">取样起始时间&nbsp;</td>
          <td colspan="2">
            {{ lookForm.sampleStartDate }}
          </td>
          <td class="textAlignRight table_item">取样结束时间&nbsp;</td>
          <td colspan="2">{{ lookForm.sampleEndDate }}</td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">甲烷,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.methane }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">异戊烷,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.lsopentane }}
            <span style="float: right"></span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">乙烷,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.ethane }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">正戊烷,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.npentane }}
            <span style="float: right"></span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">丙烷,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.propane }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">正己烷,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.nhexane }}
            <span style="float: right"></span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">异丁烷,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.lsobutane }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">氮气,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.n2 }}
            <span style="float: right"></span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">正丁烷,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.nbutane }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">二氧化碳,mol%&nbsp;</td>
          <td colspan="2">
            {{ lookForm.co2 }}
            <span style="float: right"></span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">热值,MMBtu&nbsp;</td>
          <td colspan="2">
            {{ lookForm.calorificValueMMBtu }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">热值,GJ&nbsp;</td>
          <td colspan="2">
            {{ lookForm.calorificValueGJ }}
            <span style="float: right"></span>
          </td>
        </tr>
        <tr>
          <td class="textAlignRight table_item">密度(液相),kg/m3&nbsp;</td>
          <td colspan="2">
            {{ lookForm.density }}
            <span style="float: right"></span>
          </td>
          <td class="textAlignRight table_item">密度(20℃),kg/m3&nbsp;</td>
          <td colspan="2">
            {{ lookForm.density20C }}
            <span style="float: right"></span>
          </td>
        </tr>
      </table>
      <!-- <br /> -->
      <!-- <a-form-item label="附件" :labelCol="{ style: 'width: 100px' }">
          <file-upload
            :Text="'上传文件'"
            @fileChange="fileListChange"
            :echoList="fileList"
            ref="importConpontsDataRef"
            :disabled="pageType == 'look' || pageType == 'approval'"
          ></file-upload>
        </a-form-item> -->
    </a-form-model>
    <div class="ant-modal-footer" style="text-align: center">
      <a-button type="primary" v-print="printConfig" key="1">打印</a-button>
      <a-button @click="modelCencel()">取消</a-button>
    </div>
  </div>
</template>
<script>
import { getUnloadingMeasureById } from "@/api/meteringManagement/unloadingMetering.js";

export default {
  name: "unloadingMeteringDetails",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      printConfig: {
        id: "printContent",
        popTitle: "",
      },
      lookForm: {},
    };
  },
  watch: {
    recode: {
      immediate: true,
      handler(val) {
        if (val && val.reservedFieldOne) {
          this.init();
        } else {
          this.lookForm = {};
        }
      },
    },
  },
  methods: {
    init() {
      getUnloadingMeasureById(this.recode.reservedFieldOne).then((res) => {
        if (res.code == 200 && res.body) {
          this.lookForm = res.body;
        } else {
          this.lookForm = {};
          this.$message.warning("未获取到卸船计量信息");
        }
      });
    },
    // 关闭
    modelCencel() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped>
table tr td {
  height: 35px;
}
.tableTitle {
  background-color: #edeaea;
  font-size: 16px;
  text-align: left;
  color: black;

  /* color: aliceblue; */
}

.textAlignRight {
  text-align: right;
}
.tableStyle {
  text-align: center;
  font-size: 14px;
  // margin: 0px 10px 0 10px;
}
.table_item {
  color: black;
}
.tableBrder {
  border: #f6f3f3 2px solid;
}
.tableBrder tr td,
th {
  border: 2px solid #e8e8e8;
}
.button {
  button {
    margin-left: 3rem;
  }
}
.table_list {
  .grey {
    background: #f3f5f8;
    /deep/.ant-input {
      background: #f3f5f8;
      border: 1px solid #f3f5f8;
    }
  }
  text-align: center;
  .tr {
    width: 1rem;
    background: #eeeeee;
    height: 40px;
    border: 1px solid;
    td {
      border-right: 1px solid;
    }
  }
  .td {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  tr {
    line-height: 36px;
    th {
      border-bottom: none;
      border-top: 1px solid #000;
    }
    th:nth-child(1) {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
    }
    th + th {
      border-right: 1px solid #000;
      // border-right: none;
    }
  }
}
</style>