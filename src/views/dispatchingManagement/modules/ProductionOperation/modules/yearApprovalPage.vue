<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-form-model :model="AnnualData" ref="securityCheckFormRef">
        <div>
          <a-divider orientation="left" style="font-weight: bolder">
            基础信息
          </a-divider>
          <a-row>
            <a-col :span="8">
              <a-form-model-item
                label="编制日期:"
                :labelCol="{ style: 'width: 150px' }"
              >
                <a-date-picker
                  style="width: 100%"
                  disabled
                  v-model="AnnualData.createdDateTime"
                  valueFormat="YYYY-MM-DD"
                  placeholder="请选择日期"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="编制人："
                :labelCol="{ style: 'width: 150px' }"
                prop="createdUser"
              >
                <a-input
                  disabled
                  v-model="AnnualData.createdUser"
                  placeholder="请输入编制人："
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="编制部门"
                prop="createUserSubsidiaryOrgan"
              >
                <a-input
                  disabled
                  v-model="AnnualData.createUserSubsidiaryOrgan"
                  placeholder="请输入编制部门"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="计划年度："
                :labelCol="{ style: 'width: 150px' }"
                prop="planTime"
              >
                <a-input
                  disabled
                  v-model="AnnualData.planTime"
                  placeholder="请输入计划年度"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div>
          <a-divider orientation="left" style="font-weight: bolder">
            年度外输利润考核指标
          </a-divider>

          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :labelCol="{ style: 'width: 130px' }"
                label="气化外输量："
                prop="gasExportVolume"
              >
                <div style="display: flex; margin-top: 0.3rem">
                  <a-input
                    style="width: 90%"
                    disabled
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                    v-model="AnnualData.gasExportVolume"
                    placeholder="请输入气化外输量"
                    addon-after="万方"
                  />
                  <a-input
                    style="width: 90%"
                    disabled
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                    v-model="AnnualData.gasExportVolumes"
                    placeholder="请输入气化外输量"
                    addon-after="万吨"
                  />
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :labelCol="{ style: 'width: 230px' }"
                label="槽车外输量："
                prop="tankCarExportVolume"
              >
                <div style="display: flex; margin-top: 0.3rem">
                  <a-input
                    style="width: 90%"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                    disabled
                    v-model="AnnualData.tankCarExportVolume"
                    placeholder="请输入槽车外输量"
                    addon-after="万方"
                  />
                  <a-input
                    style="width: 90%"
                    disabled
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                    v-model="AnnualData.tankCarExportVolumes"
                    placeholder="请输入槽车外输量"
                    addon-after="万吨"
                  />
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="装船(预留)："
                prop="shipLoad"
              >
                <div style="display: flex; margin-top: 0.3rem">
                  <a-input
                    disabled
                    v-model="AnnualData.shipLoad"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                    placeholder="请输入装船"
                    addon-after="万方"
                  />
                  <a-input
                    disabled
                    v-model="AnnualData.shipLoads"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                    placeholder="请输入装船"
                    addon-after="万吨"
                  />
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :labelCol="{ style: 'width: 230px' }"
                label="计划外输量："
                prop="planExportVolume"
              >
                <div style="display: flex; margin-top: 0.3rem">
                  <a-input
                    style="width: 98%"
                    disabled
                    v-model="AnnualData.planExportVolume"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                    placeholder="计划外输总量"
                    addon-after="万方"
                  />
                  <a-input
                    style="width: 98%"
                    disabled
                    v-model="AnnualData.planExportVolumes"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                    placeholder="计划外输总量"
                    addon-after="万吨"
                  />
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div>
          <a-divider orientation="left" style="font-weight: bolder">
            年度外输计划表
          </a-divider>

          <div style="display: flex">
            <p>年度计划外输总量（万方）：</p>
            <a-input
              disabled
              v-model="AnnualData.totalData"
              placeholder="年度计划外输总量"
              style="width: 13vw; position: relative; top: -5px"
            ></a-input>
          </div>

          <div class="wrapper" :model="surfaceForm">
            <table class="table_list" width="100%" border="1">
              <tr
                align="center"
                style="background: #eeeeee; height: 40px; border: 1px solid"
              >
                <td style="border-right: 1px solid">月份</td>
                <td style="border-right: 1px solid">平均每日外输量（万方）</td>
                <td style="border-right: 1px solid">气化外输量（万方）</td>
                <td style="border-right: 1px solid">平均每日装车量（万方）</td>

                <td style="border-right: 1px solid">槽车装车量（万方）</td>
                <td style="width: 6rem">装船（预留）</td>
              </tr>
              <tr
                class="input"
                v-for="(item, index) in yeardata"
                :key="index"
                :class="{ grey: index % 2 == 0 }"
              >
                <td v-if="index != 13">
                  {{ item.planMonth2 }}
                </td>
                <td v-if="index != 13">
                  <span v-if="item.dayAvgExportVolume">{{
                    item.dayAvgExportVolume
                  }}</span>
                  <span v-else>--</span>
                </td>
                <td v-if="index != 13">
                  <a-input
                    disabled
                    v-if="index >= '12' == false"
                    v-model="item.gasExportVolume"
                    placeholder="请输入值"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  />
                  <span v-if="(index == '12') == true">{{
                    item.gasExportVolume
                  }}</span>
                </td>

                <td v-if="index != 13">
                  <span v-if="item.dayAvgCarVolume">{{
                    item.dayAvgCarVolume
                  }}</span>
                  <span v-else>--</span>
                </td>

                <td v-if="index != 13">
                  <a-input
                    disabled
                    v-if="index >= '12' == false"
                    v-model="item.tankCarExportVolume"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    placeholder="请输入值"
                  />
                  <span v-if="(index == '12') == true">{{
                    item.tankCarExportVolume
                  }}</span>
                </td>
                <td v-if="index != 13">
                  <a-input
                    disabled
                    v-if="index >= '12' == false"
                    v-model="item.shipLoad"
                    placeholder="请输入值"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  />
                  <span v-if="(index == '12') == true">{{
                    item.shipLoad
                  }}</span>
                </td>
              </tr>
            </table>
          </div>
          <a-divider orientation="left" style="font-weight: bolder"
            >接船计划</a-divider
          >
          <a-table
            rowKey="id"
            :scroll="{ x: 100 }"
            :columns="ship"
            :openSelector="true"
            :dataSource="dataSourceShip"
            :pagination="false"
          >
          </a-table>
        </div>

        <a-divider orientation="left" style="font-weight: bolder"
          >年度生产运行计划方案
        </a-divider>
        <file-upload
          :Text="'上传文件'"
          @fileChange="fileListChange"
          :echoList="flieChanges"
          ref="importConpontsDataRef"
          disabled
          :fileQuantity="1"
          :fileType="'pdf'"
          :accept="'.pdf'"
          :fileBack="false"
        ></file-upload>
        <reviewPDF @allow="allowChange" :echoList="flieChanges"></reviewPDF>

        <stepsModel
          ref="stepsModel"
          :isShow="true"
          :id="AnnualData.id"
          @approvalMethod="approvalMethod"
        />
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button type="primary" @click="agreeClick">同意</a-button>
        <a-button type="danger" @click="rejectClick">驳回</a-button>
        <a-button @click="cancelClick">返回</a-button>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  queryDetailById,
  monthPlanAudio,
} from "@/api/dispatchingManagement/yearProductionOperation";

import fileUpload from "@/components/upLoad/fileUpload";
import reviewPDF from "@/components/reviewPDF/index.vue";

import stepsModel from "@/components/approvalRecord/index.vue";
export default {
  components: {
    fileUpload,
    stepsModel,
    reviewPDF,
  },
  data() {
    return {
      IDs: "",
      dateStart: "",
      dateEnd: "",
      AnnualData: {},
      surfaceForm: [],
      form: {
        pageIndex: 1,
        pageSize: 10,
        recordType: 1,
      },
      //表格中的数据
      dataSource: [],
      //页面下方表格的列属性
      year: [
        {
          title: "月份",
          dataIndex: "planMonth",
          // width: 140,
        },
        {
          title: "平均每日外输量(万方)",
          dataIndex: "dayAvgExportVolume",
          // width: 100,
        },
        {
          title: "气化外输量(万方)",
          dataIndex: "gasExportVolume",
          // width: 100,
        },
        {
          title: "槽车装车量(万方)",
          dataIndex: "tankCarExportVolume",
          // width: 150,
        },
        {
          title: "装船(预留)",
          dataIndex: "shipLoad",
          width: 200,
        },
      ],
      yeardata: [],
      ship: [
        {
          title: "月份",
          dataIndex: "month",
          width: 115,
          align: "center",
        },
        {
          title: "1月",
          dataIndex: "one",
          align: "center",
        },
        {
          title: "2月",
          dataIndex: "two",
          align: "center",
        },
        {
          title: "3月",
          dataIndex: "three",
          align: "center",
        },
        {
          title: "4月",
          dataIndex: "four",
          align: "center",
        },
        {
          title: "5月",
          dataIndex: "five",
          align: "center",
        },
        {
          title: "6月",
          dataIndex: "six",
          align: "center",
        },
        {
          title: "7月",
          dataIndex: "seven",
          align: "center",
        },
        {
          title: "8月",
          dataIndex: "eight",
          align: "center",
        },
        {
          title: "9月",
          dataIndex: "nine",
          align: "center",
        },
        {
          title: "10月",
          dataIndex: "ten",
          align: "center",
        },
        {
          title: "11月",
          dataIndex: "eleven",
          align: "center",
        },
        {
          title: "12月",
          dataIndex: "twelve",
          align: "center",
        },
        {
          title: "合计",
          dataIndex: "total",
          align: "center",
        },
      ],
      dataSourceShip: [],
      //表格中的数据
      dataSource: [],
      flieChanges: [],
      isApprove: false,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          //需要监听的参数
          this.id = this.$route.query.id;
          this.getListDetails(this.id);
        }
      },
    },
  },
  mounted() {
    // this.getListDetails("D04000000000060");
  },
  methods: {
    approvalMethod(type) {
      monthPlanAudio({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.AnnualData.id,
      }).then((res) => {
        if (res.body == "true") {
          this.$message.success("完成审核");
        } else {
          this.$message.warning(res.msg);
        }
      });
    },
    rejectClick() {
      this.$refs.stepsModel.verificationChange("0");
    },
    agreeClick() {
      this.$refs.stepsModel.verificationChange("1");
    },
    cancelClick() {
      this.$router.go(-1);
    },

    //获取表格列表
    getListDetails(value) {
      let type = {
        id: value,
        type: 1,
      };

      queryDetailById(type).then((res) => {
        console.log(res.body);
        this.AnnualData = res.body;
        if (this.AnnualData.fileInfo.indexOf("“") > 0) {
          this.flieChanges = JSON.parse(
            this.chineseChar2englishChar(this.AnnualData.fileInfo)
          );
        } else {
          if (this.AnnualData.fileInfo) {
            this.flieChanges = JSON.parse(this.AnnualData.fileInfo);
          }
        }

        //气化外输量
        this.AnnualData.gasExportVolumes = this.AnnualData.gasExportVolume
          ? new Number(this.AnnualData.gasExportVolume) / 1400
          : 0;

        // 槽车外输量
        this.AnnualData.tankCarExportVolumes = this.AnnualData
          .tankCarExportVolume
          ? new Number(this.AnnualData.gasExportVolume) / 1400
          : 0;

        //装船
        this.AnnualData.shipLoads = this.AnnualData.shipLoad
          ? new Number(this.AnnualData.shipLoad) / 1400
          : 0;
        // 计划外输量
        this.AnnualData.planExportVolumes = this.AnnualData.planExportVolume
          ? new Number(this.AnnualData.planExportVolume) / 1400
          : 0;

        this.yeardata = res.body.yearPlanList;
        // dayAvgCarVolume
        this.yeardata[0].planMonth2 = "1月";
        this.yeardata[1].planMonth2 = "2月";
        this.yeardata[2].planMonth2 = "3月";
        this.yeardata[3].planMonth2 = "4月";
        this.yeardata[4].planMonth2 = "5月";
        this.yeardata[5].planMonth2 = "6月";
        this.yeardata[6].planMonth2 = "7月";
        this.yeardata[7].planMonth2 = "8月";
        this.yeardata[8].planMonth2 = "9月";
        this.yeardata[9].planMonth2 = "10月";
        this.yeardata[10].planMonth2 = "11月";
        this.yeardata[11].planMonth2 = "12月";
        this.yeardata[12].planMonth2 = "小计";
        this.AnnualData.totalData = res.body.yearPlanList[13].gasExportVolume;
      });
    },

    fileListChange(val) {
      this.flieChanges = val;
    },
    chineseChar2englishChar(chineseChar) {
      // 将单引号‘’都转换成'，将双引号“”都转换成"
      var str = chineseChar.replace(/\’|\‘/g, "'").replace(/\“|\”/g, '"');
      // 将中括号【】转换成[]，将大括号｛｝转换成{}
      str = str
        .replace(/\【/g, "[")
        .replace(/\】/g, "]")
        .replace(/\｛/g, "{")
        .replace(/\｝/g, "}");
      // 将逗号，转换成,，将：转换成:
      str = str.replace(/，/g, ",").replace(/：/g, ":");
      return str;
    },
    allowChange() {
      this.isApprove = true;
    },
  },
};
</script>
<style scoped lang="less">
.ant-modal-footer {
  text-align: center !important;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 0px;
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item-control {
  width: 100%;
}

.ant-select-selection--single {
  width: 180px;
}

.aaaa {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}
.grey {
  background: #f3f5f8;
  /deep/.ant-input {
    background: #f3f5f8;
    border: 1px solid #f3f5f8;
  }
}

// background: #f3f5f8;
//     border: 1px solid #f3f5f8;

.table_list {
  text-align: center;
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