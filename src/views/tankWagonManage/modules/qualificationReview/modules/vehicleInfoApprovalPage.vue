<template>
  <Breadcrumb>
    <template slot="appMain">
      <a-divider orientation="left">基础信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="车牌号" :labelCol="{ style: 'width: 100px' }">
            <a-input
              v-model="infoData.plate_number"
              disabled
              placeholder="车牌号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="承运商名称"
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-input
              v-model="infoData.full_name"
              disabled
              placeholder="承运商名称"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="车辆类型"
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-input
              v-model="infoData.type_name"
              disabled
              placeholder="车辆类型"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="车辆品牌"
          >
            <a-input
              v-model="infoData.brand_name"
              disabled
              placeholder="车辆品牌"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="核定转载量"
          >
            <a-input
              v-model="infoData.loading_capacity"
              disabled
              placeholder="核定转载量"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="最大工作压力"
          >
            <a-input
              v-model="infoData.pressure"
              disabled
              placeholder="最大工作压力"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="容积">
            <a-input
              v-model="infoData.tank_capacity"
              disabled
              placeholder="容积"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <!--车辆行驶证-->
      <a-divider orientation="left" orientation-margin="0px"
        >车辆行驶证</a-divider
      >

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="资质证号" :labelCol="{ style: 'width: 100px' }">
            <a-input
              v-model="infoData.AA_doc_no"
              disabled
              placeholder="资质证号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="证件生效时间"
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-input
              v-model="infoData.AA_date_from"
              disabled
              placeholder="证件生效时间"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="证件到期时间"
            :labelCol="{ style: 'width: 165px' }"
          >
            <a-input
              v-model="infoData.AA_date_to"
              disabled
              placeholder="证件到期时间"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="附件">
            <a
              v-for="(item, index) in infoData.AA_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.AA_file == undefined || infoData.AA_file.length == '0'
              "
            >
              {{ fileNullMsg }}
            </span>
          </a-form-model-item>
        </a-col>
      </a-row>

      <!--道路危险货物运输许可证-->
      <a-divider orientation="left" orientation-margin="0px"
        >道路危险货物运输许可证</a-divider
      >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="资质证号"
          >
            <a-input
              v-model="infoData.AB_doc_no"
              disabled
              placeholder="资质证号"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="证件生效时间"
          >
            <a-input
              v-model="infoData.AB_date_from"
              disabled
              placeholder="证件生效时间"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 165px' }"
            label="证照到期时间"
          >
            <a-input
              v-model="infoData.AB_date_to"
              disabled
              placeholder="证件到期时间"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="附件">
            <a
              v-for="(item, index) in infoData.AB_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.AB_file == undefined || infoData.AB_file.length == '0'
              "
            >
              {{ fileNullMsg }}
            </span>
            <!-- <a @click="fileDownload('AB')">道路危险货物运输许可证</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--注册登记摘要信息栏页-->
      <a-divider orientation="left" orientation-margin="0px">
        注册登记摘要信息栏页
      </a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="资质证号"
          >
            <a-input
              v-model="infoData.AC_doc_no"
              disabled
              placeholder="资质证号"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="证件生效时间"
          >
            <a-input
              v-model="infoData.AC_date_from"
              disabled
              placeholder="证件生效时间"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 165px' }"
            label="证照到期时间"
          >
            <a-input
              v-model="infoData.AC_date_to"
              disabled
              placeholder="证件到期时间"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="附件">
            <a
              v-for="(item, index) in infoData.AC_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.AC_file == undefined || infoData.AC_file.length == '0'
              "
            >
              {{ fileNullMsg }}
            </span>
            <!-- <a @click="fileDownload('AC')">注册登记摘要信息栏页</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--牵引车气瓶合格证-->
      <a-divider orientation="left" orientation-margin="0px">
        牵引车气瓶合格证
      </a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="资质证号"
          >
            <a-input
              v-model="infoData.AJ_doc_no"
              disabled
              placeholder="资质证号"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="证件生效时间"
          >
            <a-input
              v-model="infoData.AJ_date_from"
              disabled
              placeholder="证件生效时间"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 165px' }"
            label="证照到期时间"
          >
            <a-input
              v-model="infoData.AJ_date_to"
              disabled
              placeholder="证件到期时间"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="附件">
            <a
              v-for="(item, index) in infoData.AJ_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.AJ_file == undefined || infoData.AJ_file.length == '0'
              "
            >
              {{ fileNullMsg }}
            </span>
            <!-- <a @click="fileDownload('AJ')">牵引车气瓶合格证</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--压力容器使用登记证-->
      <a-divider orientation="left" orientation-margin="0px">
        压力容器使用登记证
      </a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="资质证号"
          >
            <a-input
              v-model="infoData.AF_doc_no"
              disabled
              placeholder="资质证号"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="证件生效时间"
          >
            <a-input
              v-model="infoData.AF_date_from"
              disabled
              placeholder="证件生效时间"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 165px' }"
            label="证照到期时间"
          >
            <a-input
              v-model="infoData.AF_date_to"
              disabled
              placeholder="证件到期时间"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="附件">
            <a
              v-for="(item, index) in infoData.AF_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.AF_file == undefined || infoData.AF_file.length == '0'
              "
            >
              {{ fileNullMsg }}
            </span>
            <!-- <a @click="fileDownload('AF')">压力容器使用登记证</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--交强险-->
      <a-divider orientation="left" orientation-margin="0px">
        交强险
      </a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="资质证号"
          >
            <a-input
              v-model="infoData.BA_doc_no"
              disabled
              placeholder="资质证号"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="证件生效时间"
          >
            <a-input
              v-model="infoData.BA_date_from"
              disabled
              placeholder="证件生效时间"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 165px' }"
            label="证照到期时间"
          >
            <a-input
              v-model="infoData.BA_date_to"
              disabled
              placeholder="证件到期时间"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="附件">
            <a
              v-for="(item, index) in infoData.BA_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.BA_file == undefined || infoData.BA_file.length == '0'
              "
            >
              {{ fileNullMsg }}
            </span>
            <!-- <a @click="fileDownload('BA')">交强险</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--审批信息部分-->
      <div>
        <a-divider orientation="left">审批信息</a-divider>
        <approvalModel
          ref="approvalModel"
          :isShow="true"
          :id="infoData.id"
          @approvalMethod="approvalMethod"
        />
      </div>
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
  selectByID,
  queryFileByParentId,
  approval,
} from "@/api/tankWagonManage/vehicleInfo.js";
import approvalModel from "@/views/tankWagonManage/modules/qualificationReview/modules/component/approvalModelindex.vue";

export default {
  components: { approvalModel },
  data() {
    return {
      //详情弹窗文件空时提示语
      fileNullMsg: "无附件",
      //弹窗中数据集合
      infoData: {},
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
    // this.getListDetails("111");
  },
  methods: {
    approvalMethod(type) {
      approval({
        type: type,
        opinion: this.$refs.stepsModel.form.opinion,
        id: this.infoData.id,
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

    getListDetails(id) {
      selectByID(id).then((res) => {
        console.log("res", res);
        this.renderData(id, res.body);
      });
    },

    renderData(id, recode) {
      queryFileByParentId(id).then((res) => {
        if (res.code == "200" && res.body) {
          let array = {
            AA_file: [],
            AB_file: [],
            AC_file: [],
            AD_file: [],
            AE_file: [],
            AF_file: [],
            AG_file: [],
            AH_file: [],
            AI_file: [],
            AJ_file: [],
            BA_file: [],
          };
          console.log("resrenderData", res.body);
          let data = res.body;
          data.forEach((element) => {
            if (element.doc_code == "AA") {
              array["AA_date_from"] = element.date_from;
              array["AA_date_to"] = element.date_to;
              array["AA_doc_no"] = element.doc_no;
              array.AA_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AB") {
              array["AB_date_from"] = element.date_from;
              array["AB_date_to"] = element.date_to;
              array["AB_doc_no"] = element.doc_no;
              array.AB_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AC") {
              array["AC_date_from"] = element.date_from;
              array["AC_date_to"] = element.date_to;
              array["AC_doc_no"] = element.doc_no;
              array.AC_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AD") {
              array["AD_date_from"] = element.date_from;
              array["AD_date_to"] = element.date_to;
              array["AD_doc_no"] = element.doc_no;
              array.AD_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AE") {
              array["AE_date_from"] = element.date_from;
              array["AE_date_to"] = element.date_to;
              array["AE_doc_no"] = element.doc_no;
              array.AE_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AF") {
              array["AF_date_from"] = element.date_from;
              array["AF_date_to"] = element.date_to;
              array["AF_doc_no"] = element.doc_no;
              array.AF_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AG") {
              array["AG_date_from"] = element.date_from;
              array["AG_date_to"] = element.date_to;
              array["AG_doc_no"] = element.doc_no;
              array.AG_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AH") {
              array["AH_date_from"] = element.date_from;
              array["AH_date_to"] = element.date_to;
              array["AH_doc_no"] = element.doc_no;
              array.AH_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AI") {
              array["AI_date_from"] = element.date_from;
              array["AI_date_to"] = element.date_to;
              array["AI_doc_no"] = element.doc_no;
              array.AI_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AJ") {
              array["AJ_date_from"] = element.date_from;
              array["AJ_date_to"] = element.date_to;
              array["AJ_doc_no"] = element.doc_no;
              array.AJ_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "BA") {
              array["BA_date_from"] = element.date_from;
              array["BA_date_to"] = element.date_to;
              array["BA_doc_no"] = element.doc_no;
              array.BA_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            }
          });
          array["aa_date_to"] = recode.aa_date_to;
          array["brand_name"] = recode.brand_name;
          array["id"] = recode.id;
          array["loading_capacity"] = recode.loading_capacity;
          array["pressure"] = recode.pressure;
          array["plate_number"] = recode.plate_number;

          array["push_time"] = recode.push_time;
          array["record_status"] = recode.record_status;
          array["record_status_name"] = recode.record_status_name;
          array["table_name"] = recode.table_name;
          array["tank_capacity"] = recode.tank_capacity;
          array["todo_username"] = recode.todo_username;
          array["type_name"] = recode.type_name;

          console.log("array", array);
          this.infoData = array
        }
      });
    },

    //文件下载
    fileDownload(filePath) {
      if (filePath) {
        //新窗口打开文件，
        window.open(filePath);
      } else {
        this.$message.warning("文件不存在");
      }
    },
  },
};
</script>
<style scoped>

.printDivStyle {
  background: #ffffff;
  width: 100%;
  align: "left";
}
.ant-modal-footer {
  text-align: center !important;
}
.printInfoDivStyle {
  margin: 10px;
  padding: 20px;
  /* height: 100px; */
  border: solid 2px rgb(0, 0, 0);
}
.printTopTitle {
  font-size: 34px;
  font-family: FangSong;
  /* letter-spacing: 3px; */
}
.printTopTitle2 {
  font-size: 36px;
  letter-spacing: 6px;
}
.printInfoHeight {
  height: 100px;
}
.printTitle {
  font-size: 30px;
  font-family: FangSong;
}
.printFont {
  font-size: 26px;
}
.printCode {
  width: 100%;
  border: solid 1px rgb(0, 0, 0);
  padding: 5px 100px;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.TableTop {
  margin-top: 10px;
}

.ant-form-item {
  margin-bottom: 3px;
}

.addMargins {
  margin: 0 2%;
}
</style>
// 去除打印的页眉页脚
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 8mm; /* this affects the margin in the printer settings */
}
</style>
// 去除打印的页眉页脚
