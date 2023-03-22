<template>
  <Breadcrumb>
    <template slot="appMain">
      <!--基础信息-->
      <a-divider orientation="left">基础信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="姓名" :labelCol="{ style: 'width: 100px' }">
            <a-input v-model="infoData.full_name" disabled placeholder="姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="身份证号"
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-input v-model="infoData.id_no" disabled placeholder="身份证号" />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            label="手机号"
            :labelCol="{ style: 'width: 165px' }"
          >
            <a-input v-model="infoData.phone" disabled placeholder="手机号" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="性别">
            <a-input v-model="infoData.sex" disabled placeholder="性别" />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="工作岗位"
          >
            <a-input v-model="infoData.post" disabled placeholder="工作岗位" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <!--证件类型-->
      <!-- <a-divider orientation="left">证件类型</a-divider> -->
      <!--身份证-->
      <a-divider orientation="left" orientation-margin="0px">身份证</a-divider>

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
              >{{ fileNullMsg }}</span
            >
            <!-- <a @click="fileDownload('AA')">身份证正面</a> -->
            <!-- <a @click="fileDownload('AA')">身份证背面</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>

      <!--驾驶证-->
      <a-divider orientation="left" orientation-margin="0px">驾驶证</a-divider>
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
              >{{ fileNullMsg }}</span
            >
            <!-- <a @click="fileDownload('AB')">驾驶证</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--危险品从业资格证-->
      <a-divider orientation="left" orientation-margin="0px">
        危险品从业资格证
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
              >{{ fileNullMsg }}</span
            >
            <!-- <a @click="fileDownload('AC')">道路危险货物运输驾驶证</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--押运证-->
      <a-divider orientation="left" orientation-margin="0px">
        押运证
      </a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="资质证号"
          >
            <a-input
              v-model="infoData.AD_doc_no"
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
              v-model="infoData.AD_date_from"
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
              v-model="infoData.AD_date_to"
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
              v-for="(item, index) in infoData.AD_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.AD_file == undefined || infoData.AD_file.length == '0'
              "
              >{{ fileNullMsg }}</span
            >
            <!-- <a @click="fileDownload('AD')">押运证</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--职业健康体检报告-->
      <a-divider orientation="left" orientation-margin="0px">
        职业健康体检报告
      </a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 100px' }"
            label="资质证号"
          >
            <a-input
              v-model="infoData.AE_doc_no"
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
              v-model="infoData.AE_date_from"
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
              v-model="infoData.AE_date_to"
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
              v-for="(item, index) in infoData.AE_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.AE_file == undefined || infoData.AE_file.length == '0'
              "
              >{{ fileNullMsg }}</span
            >
            <!-- <a @click="fileDownload('AE')">职业健康体检报告</a> -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <!--审批信息部分-->
      <div>
        <a-divider orientation="left">审批信息</a-divider>
        <!--审批信息表格-->
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
  queryFileByParentId,
  approval,
  selectByID,
} from "@/api/tankWagonManage/custodiansInfo.js";
import approvalModel from "@/views/tankWagonManage/modules/qualificationReview/modules/component/approvalModelindex.vue";

export default {
  components: { approvalModel },

  data() {
    return {
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
    this.getListDetails("110");
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
    //渲染数据并打开弹窗
    renderData(id, recode) {

            //  小荷包余 3400
      // 三月十五 5400 - 300 = 5100 - 1354 = 3746    小荷包余 7146
      // 四月十五 6200 - 4200 = 2000 - 2000 = 0 
      // 五月十五 6200 - 2500 = 3700 小荷包余 10700
      let array = {
        AA_file: [],
        AB_file: [],
        AC_file: [],
        AD_file: [],
        AE_file: [],
      };
      queryFileByParentId(id).then((res) => {
        console.log("data", res);
        if (res.code == "200" && res.body) {
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
            }
          });
        }
      });

      array["id_no"] = recode.id_no;
      array["full_name"] = recode.full_name;
      array["id"] = recode.id;
      array["driver_sign"] = recode.driver_sign;
      array["escort_sign"] = recode.escort_sign;
      array["phone"] = recode.phone;
      array["date_from"] = recode.date_from;
      array["status_approval_code"] = recode.status_approval_code;
      array["approval_reply"] = recode.approval_reply;
      array["mod_sign"] = recode.mod_sign;
      array["note"] = recode.note;
      array["valid"] = recode.valid;
      array["create_com_id"] = recode.create_com_id;

      array["create_dept_id"] = recode.create_dept_id;
      array["create_by"] = recode.create_by;
      array["create_time"] = recode.create_time;
      array["update_by"] = recode.update_by;
      array["update_time"] = recode.update_time;
      array["data_version"] = recode.data_version;
      array["batch_id"] = recode.batch_id;
      array["record_status"] = recode.record_status;
      array["todo_username"] = recode.todo_username;
      array["todo_usercode"] = recode.todo_usercode;
      array["record_status_name"] = recode.record_status_name;
      array["table_name"] = recode.table_name;
      array["push_time"] = recode.push_time;

      console.log("array", array);
      this.infoData = array;
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
<style scoped lang="less">
.ant-modal-footer {
  text-align: center !important;
}
.printDivStyle {
  background: #ffffff;
  width: 100%;
  align: "left";
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
  font-size: 24px;
}
.printCode {
  width: 100px;
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

.exportbutton {
  margin-left: 0.8%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}

.ant-form-item {
  margin-bottom: 2px;
}
.TableTop {
  margin-top: 10px;
}
</style>
