<template>
  <Breadcrumb>
    <template slot="appMain">
      <div id="printContent">
        <table
          style="width: 100%; text-align: center"
          border="2"
          class="table_form"
        >
          <th colspan="4" style="height: 60px; font-size: 18px">
            北京燃气集团（天津）液化气有限公司
            <br />
            液化天然气库存盘点表
          </th>
          <tr style="height: 30px">
            <td colspan="4">
              <a-range-picker v-model="reportDateRange">
                <span>
                  （{{ detailsInfoData.inventoryStartDate }}8：00 -
                  {{ detailsInfoData.inventoryEndDate }}8：00）
                </span>
              </a-range-picker>
            </td>
          </tr>
          <tr style="height: 30px">
            <td colspan="4" style="text-align: right; padding-right: 10px">
              编号：{{ detailsInfoData.serialNo }}
            </td>
          </tr>
          <tr style="height: 30px">
            <td width="25%">项目</td>
            <td width="25%">质量(t)</td>
            <td width="25%">体积(Nm³)</td>
            <td width="25%">备注</td>
          </tr>
          <tr
            v-for="(item, index) in detailsData"
            :key="index"
            class="input"
            style="height: 30px"
          >
            <td style="text-align: left; padding-left: 10px">
              {{ detailsData[index].item }}
            </td>
            <td>
              {{ detailsData[index].quality }}
            </td>
            <td>
              {{ detailsData[index].volume }}
            </td>
            <td>
              {{ detailsData[index].remarks }}
            </td>
          </tr>
        </table>
      </div>

      <!--审批页签部分-->
      <stepsModel
        ref="stepsModel"
        :isShow="true"
        :id="detailsInfoData.id"
        @approvalMethod="approvalMethod"
      />
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
  selectById,
  getDetailsListByTime,
  approval,
  getDetailsListBySerialNo,
} from "@/api/inventoryManagement/oneClickInventory.js";
import stepsModel from "@/components/approvalRecord/index.vue";

export default {
  components: {
    stepsModel,
  },
  data() {
    return {
      reportDateRange: [],
      detailsInfoData: {},
      detailsData: [],

      //表格中的数据
      dataSource: [],
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
    // this.getListDetails("J17000000000054");
  },

  methods: {
    approvalMethod(type) {
      approval({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.detailsInfoData.id,
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

    //获得当前页面
    getListDetails(value) {
      selectById(value).then((res) => {
        console.log("res", res);
        this.detailsInfoData = res.body;
        this.renderData(this.detailsInfoData);
      });
    },

    //渲染数据并打开弹窗
    renderData(row) {
      this.detailsInfoData.id = row.id;
      this.detailsInfoData.serialNo = row.serialNo;
      this.detailsInfoData.inventoryStartDate = this.formatDate(
        new Date(row.inventoryStartDate),
        "yyyy 年 MM 月 dd 日 "
      );
      this.detailsInfoData.inventoryEndDate = this.formatDate(
        new Date(row.inventoryEndDate),
        "yyyy 年 MM 月 dd 日 "
      );
      getDetailsListBySerialNo(row.serialNo).then((res) => {
        if (res.code == "200") {
          this.detailsData = res.body.data;
          this.visible = true;
        }
      });
    },

    //根据时间获取库存信息,并渲染
    getDetailsList(startDate, endDate) {
      getDetailsListByTime(startDate + " 08:00:00", endDate + " 08:00:00").then(
        (res) => {
          if (res.body.length > 0) {
            this.detailsData = res.body;
            this.detailsData.forEach((item) => {
              item.serialNo = this.detailsInfoData.serialNo;
            });
          } else {
            this.detailsData = [];
            this.$message.warning("暂无数据,请重新选择时间");
          }
        }
      );
    },

    //格式化日期
    formatDate(objDate, fmt) {
      var o = {
        "M+": objDate.getMonth() + 1, //月份
        "d+": objDate.getDate(), //日
        "h+": objDate.getHours() % 12 == 0 ? 12 : objDate.getHours() % 12, //小时
        "H+": objDate.getHours(), //小时
        "m+": objDate.getMinutes(), //分
        "s+": objDate.getSeconds(), //秒
        "q+": Math.floor((objDate.getMonth() + 3) / 3), //季度
        S: objDate.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (objDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
  },
};
</script>
    <style scoped  lang="less">
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
.TableTop {
  margin-top: 10px;
}
.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}

.input {
  /deep/.ant-input {
    border: 1px solid #fff;
    height: 26px;
  }
}
</style>
    