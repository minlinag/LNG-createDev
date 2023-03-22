<template>
  <div>
    <a-form-model ref="dataForm" :model="recode">
      <a-divider orientation="left" style="margin-top: -1rem"
        >基础信息</a-divider
      >
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-model-item label="船期计划编号：">
            <a-input v-model.trim="recode.shippingScheduleNo" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="船舶名称：">
            <a-input v-model.trim="recode.shipName" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="船当年序号：">
            <a-input
              v-model.trim="recode.shipFormerYearsSerialNumber"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="8"> -->
        <a-col :span="16" class="rangePickerWidth">
          <a-form-model-item label="接船时间" class="position-changeList_model">
            <!-- <a-form-model-item label="接船时间："> -->
            <a-range-picker
              show-time
              disabled
              v-model="recode.productionDates"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始日期', '结束日期']"
            />
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <a-form-model-item label="热值(GJ)：">
            <a-input v-model.trim="recode.reservedFieldTwo" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="卸货质量(t)：">
            <a-input v-model.trim="recode.qualityDischargeT" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="卸货标方(Nm³)：">
            <a-input v-model.trim="recode.nnloadStandardCubic" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="密度(液相)(kg/m³)：">
            <a-input v-model.trim="recode.reservedFieldThree" disabled />
          </a-form-model-item>
        </a-col>
      </a-row>

      <div class="button">
        <a-button type="primary" ghost>船期计划</a-button>
        <a-button type="primary" ghost>船舶信息</a-button>
        <a-button type="primary" ghost>登船信息</a-button>
        <a-button type="primary" ghost>货物放行信息</a-button>
        <a-button type="primary" ghost @click="openUnloadingMeteringDetails()"
          >卸船计量</a-button
        >
      </div>
      <a-divider orientation="left">卸船信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item label="总卸载量（卸料总管读数）(t)：">
            <a-input v-model.trim="recode.a" disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="总卸载量（液位差合计）(t)：">
            <a-input v-model.trim="recode.b" disabled />
          </a-form-model-item>
        </a-col>
      </a-row>

      <div class="wrapper">
        <table class="table_list" width="100%" border="1">
          <tr align="center" class="tr">
            <td v-for="(item, index) in tableTitleTop" :key="index">
              {{ item.title }}
            </td>
          </tr>
          <tr
            v-for="(item, index) in dataSource"
            :key="index"
            :class="{ grey: index % 2 == 0 }"
          >
            <td v-for="(em, i) in tableTitleTop" :key="i">
              <!-- {{ item[em.value] }} -->
              {{ item[`${em.value}`] }}
            </td>
          </tr>
        </table>
      </div>
    </a-form-model>

    <div class="ant-modal-footer">
      <a-button @click="handleCancel">取消</a-button>
    </div>
    <a-modal
      title="卸船计量详情"
      :visible="unloadingMeteringDetailsVisible"
      :footer="null"
      :maskClosable="false"
      @cancel="closeUnloadingMeteringDetails"
      class="from-style bigModel"
    >
      <unloadingMeteringDetails
        ref="detailModel"
        :recode="recode"
        @close="closeUnloadingMeteringDetails"
      />
    </a-modal>
  </div>
</template>
<script>
const tableTitleTop = [
  { title: "储罐编号", value: "owningKey" },
  // { title: "总卸载量（卸料总管）", value: "totalUnloadingNum" },
  // { title: "储罐进液总量", value: "totalStorageTankEnterLiquid" },
  { title: "1#储罐", value: "storageTank1" },
  { title: "2#储罐", value: "storageTank2" },
  { title: "3#储罐", value: "storageTank3" },
  { title: "4#储罐", value: "storageTank4" },
  { title: "5#储罐", value: "storageTank5" },
  { title: "6#储罐", value: "storageTank6" },
  { title: "7#储罐", value: "storageTank7" },
  { title: "8#储罐", value: "storageTank8" },
  { title: "9#储罐", value: "storageTank9" },
  { title: "10#储罐", value: "storageTank10" },
];

import { selectById } from "@/api/dispatchingManagement/dischargingRecord.js";
import unloadingMeteringDetails from "./unloadingMeteringDetails.vue";

export default {
  components: { unloadingMeteringDetails },

  name: "dischargingRecordDetails",
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
      unloadingMeteringDetailsVisible: false,

      dataSource: [
        {
          owningKey: "进液方式",
          storageTank1: "",
          storageTank2: "",
          storageTank3: "",
          storageTank4: "",

          storageTank5: "——",
          storageTank6: "——",
          storageTank7: "——",
          storageTank8: "——",
          storageTank9: "——",
          storageTank10: "——",
        },
        {
          owningKey: "开始进液时间",
          storageTank1: "",
          storageTank2: "",
          storageTank3: "",
          storageTank4: "",
          storageTank5: "——",
          storageTank6: "——",
          storageTank7: "——",
          storageTank8: "——",
          storageTank9: "——",
          storageTank10: "——",
        },
        {
          owningKey: "结束进液时间",
          storageTank1: "",
          storageTank2: "",
          storageTank3: "",
          storageTank4: "",
          storageTank5: "——",
          storageTank6: "——",
          storageTank7: "——",
          storageTank8: "——",
          storageTank9: "——",
          storageTank10: "——",
        },
        {
          owningKey: "卸载量（非计量结算数据）",
          storageTank1: "",
          storageTank2: "",
          storageTank3: "",
          storageTank4: "",
          storageTank5: "——",
          storageTank6: "——",
          storageTank7: "——",
          storageTank8: "——",
          storageTank9: "——",
          storageTank10: "——",
        },
      ],
      tableTitleTop: tableTitleTop,
    };
  },
  mounted() {
    selectById(this.recode.id).then((res) => {
      // let data = res.body.list;
      // for (let i = 0; i < 4; i++) {
      //   res.body[i]["owningKey"] =
      //     i == 0
      //       ? "进液方式"
      //       : i == 1
      //       ? "开始进液时间"
      //       : i == 2
      //       ? "结束进液时间"
      //       : "卸载量(非计量结算数据）";
      // }
      // this.dataSource = res.body;
    });
  },
  methods: {
    //打开卸船计量详情页
    openUnloadingMeteringDetails() {
      // if (this.recode.reservedFieldOne) {
      this.unloadingMeteringDetailsVisible = true;
      // } else {
      // this.$message.warning("未获取到卸船计量信息");
      // }
    },

    //关闭卸船计量详情页
    closeUnloadingMeteringDetails() {
      this.unloadingMeteringDetailsVisible = false;
    },

    // 关闭
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped>
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