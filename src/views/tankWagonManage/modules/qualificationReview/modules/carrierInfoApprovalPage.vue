<template>
  <Breadcrumb>
    <template slot="appMain">
      <!--基础信息-->
      <a-divider orientation="left">基础信息</a-divider>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item
            labelAlign="left"
            label="承运商名称"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model="infoData.full_name"
              disabled
              placeholder="请输入承运商名称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            labelAlign="left"
            label="承运商简称"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model="infoData.short_name"
              disabled
              placeholder="请输入承运商简称"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            labelAlign="left"
            label="现场协调联系人"
            :labelCol="{ style: 'width: 180px' }"
          >
            <a-input
              v-model="infoData.contact_name"
              disabled
              placeholder="请输入现场协调联系人"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 140px' }"
            label="联系人电话"
            labelAlign="left"
          >
            <a-input
              v-model="infoData.contact_tel"
              disabled
              placeholder="请输入联系人电话"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 140px' }"
            label="应急联系人"
            labelAlign="left"
          >
            <a-input
              v-model="infoData.contact_name_em"
              disabled
              placeholder="请输入应急联系人"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 180px' }"
            label="应急联系人电话"
            labelAlign="left"
          >
            <a-input
              v-model="infoData.contact_tel_em"
              disabled
              placeholder="请输入应急联系人电话"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-divider orientation="left" orientation-margin="0px"
        >营业执照</a-divider
      >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item
            labelAlign="left"
            label="社会信用代码"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model="infoData.AA_doc_no"
              disabled
              placeholder="统一社会信用代码"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            labelAlign="left"
            label="证件生效时间"
            :labelCol="{ style: 'width: 140px' }"
          >
            <a-input
              v-model="infoData.AA_date_from"
              disabled
              placeholder="请输入证件生效时间"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            labelAlign="left"
            label="证件到期时间"
            :labelCol="{ style: 'width: 180px' }"
          >
            <a-input
              v-model="infoData.AA_date_to"
              disabled
              placeholder="请输入证件到期时间"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 110px' }"
            label="附件"
            labelAlign="left"
          >
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
          </a-form-model-item>
        </a-col>
      </a-row>

      <!--道路运输许可证-->
      <a-divider orientation="left" orientation-margin="0px"
        >道路运输许可证</a-divider
      >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 140px' }"
            label="资质证号"
            labelAlign="left"
          >
            <a-input
              v-model="infoData.AB_doc_no"
              disabled
              placeholder="请输入资质证号"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 140px' }"
            label="证件生效时间"
            labelAlign="left"
          >
            <a-input
              v-model="infoData.AB_date_from"
              disabled
              placeholder="请输入证件生效时间"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item
            :labelCol="{ style: 'width: 180px' }"
            label="证照到期时间"
            labelAlign="left"
          >
            <a-input
              v-model="infoData.AB_date_to"
              disabled
              placeholder="请输入证件到期时间"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 110px' }"
            label="附件"
            labelAlign="left"
          >
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
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-divider orientation="left" orientation-margin="0px">
        资质证件
      </a-divider>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="关于LNG承运商认证备案的申请函"
          >
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
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="现场单位管理规定"
          >
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
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="公司安全管理规定"
          >
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
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="安全管理人员的安全从业资格证"
          >
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
              >{{ fileNullMsg }}</span
            >
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-divider orientation="left" orientation-margin="0px"
        >企业HSSE安全管理资料</a-divider
      >

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="安全管理机构信息"
          >
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
              >{{ fileNullMsg }}</span
            >
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="HSSE 体系文件"
          >
            <a
              v-for="(item, index) in infoData.BB_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.BB_file == undefined || infoData.BB_file.length == '0'
              "
              >{{ fileNullMsg }}</span
            >
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="HSSE 管理制度"
          >
            <a
              v-for="(item, index) in infoData.BC_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.BC_file == undefined || infoData.BC_file.length == '0'
              "
              >{{ fileNullMsg }}</span
            >
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="应急预案"
          >
            <a
              v-for="(item, index) in infoData.BD_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.BD_file == undefined || infoData.BD_file.length == '0'
              "
              >{{ fileNullMsg }}</span
            >
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-model-item
            :labelCol="{ style: 'width: 290px' }"
            label="事故管理"
          >
            <a
              v-for="(item, index) in infoData.BE_file"
              :key="index"
              @click="fileDownload(item.filePath)"
              >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
            >
            <span
              v-if="
                infoData.BE_file == undefined || infoData.BE_file.length == '0'
              "
              >{{ fileNullMsg }}</span
            >
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
  approval,
  selectByID,
} from "@/api/tankWagonManage/carrierInfo.js";
import approvalModel from "@/views/tankWagonManage/modules/qualificationReview/modules/component/approvalModelindex.vue";
export default {
  components: { approvalModel },

  data() {
    return {
      //详情弹窗文件空时提示语
      fileNullMsg: "无附件",
      pageType: "",
      addBlackData: {},
      detailsData: [],

      searchForm: {
        page_size: 10,
        page_num: 1,
        full_name: "",
        contact_name: "",
      },
      infoData: {},

      //表格中的数据
      dataSource: [],
      stateOptions: [
        {
          value: "3",
          label: "待审核",
        },
        {
          value: "4",
          label: "审核通过",
        },
        {
          value: "5",
          label: "黑名单",
        },
      ],
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
    // this.getListDetails("1563010694466965505");
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
        this.infoData = res.body
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
<style scoped lang="less">
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
.ant-modal-footer {
  text-align: center !important;
}
.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item {
  margin-bottom: 3px;
}

.exportbutton {
  margin-left: 0.8%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
.TableTop {
  margin-top: 10px;
}
</style>
