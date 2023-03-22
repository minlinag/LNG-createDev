<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button :include="[{ value: 'exportComponent', url: '' }]"></pe-button>
    </template>
    <template slot="appMain">
      <a-form-model layout="inline" :model="form">
        <a-col :span="6">
          <a-form-model-item
            label="计划装车时间："
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-date-picker
              v-model="form.planLoadingDate"
              valueFormat="YYYY-MM-DD"
              @change="onChange"
              placeholder="请选择日期"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            :labelCol="{ style: 'width: 150px' }"
            label="审核人："
          >
            <a-input
              v-model="form.auditor"
              placeholder="请输入审核人"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            label="审核状态："
            :labelCol="{ style: 'width: 150px' }"
          >
            <a-select
              v-model="form.auditStatus"
              show-search
              placeholder="请选择"
              option-filter-prop="children"
              :filter-option="filterOption"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in stateInfo"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item>
            <a-button v-Query class="buttonType" type="primary" @click="search">
              查询
            </a-button>
            <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <a-table
        style="margin-top: 10px"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
        :scroll="{ x: 100 }"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.auditor),
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @approval="approvalClick(row)"
            @look="look(row)"
          ></pe-button>
        </template>
      </a-table>
      <dc-Model
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="from-style bigModel"
      >
        <a-form-model :model="toExamine">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-model-item label="计划装车编号：">
                <a-input
                  disabled
                  v-model="toExamine.loadingPlanNum"
                  placeholder="请输入计划装车编号"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="计划装车时间：">
                <a-input
                  disabled
                  v-model="toExamine.planLoadingDate"
                  placeholder="请输入计划装车时间"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="日计划装载量(车)：">
                <a-input
                  disabled
                  v-model="toExamine.dailyPlanLoadingAmountCar"
                  placeholder="请输入日计划装载量"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="日计划装载量(t)：">
                <a-input
                  disabled
                  v-model="toExamine.dailyPlanLoadingAmountTon"
                  placeholder="请输入日计划装载量"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="其他说明事项：">
                <a-textarea
                  disabled
                  v-model="toExamine.otherRemark"
                  placeholder="请输入其他说明事项"
                /> </a-form-model-item
            ></a-col>
            <a-col :span="8" v-if="Approval">
              <a-form-model-item label="库存提示：">
                <a-input
                  disabled
                  v-model="toExamine.effectiveStockAmount"
                  placeholder="请输入库存提示"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="8" v-else>
              <a-form-model-item label="槽车外输调度令：">
                <span style="color: #1890ff" @click="DispatchOrder">
                  {{ toExamine.dispatchNo }}
                </span>
              </a-form-model-item>
            </a-col>
          </a-row>

          <!--审批页签部分-->
          <div v-if="pageType == 'look' || pageType == 'approval'">
            <approvalModel
              ref="stepsModel"
              :isShow="pageType === 'approval' ? true : false"
              :id="id"
            />
          </div>
        </a-form-model>
        <div class="ant-modal-footer">
          <a-button
            type="primary"
            v-if="pageType == 'approval'"
            @click="approvalCommit()"
          >
            确定
          </a-button>
          <a-button @click="handleCancel"> 取消 </a-button>
        </div>
      </dc-Model>
      <dc-Model
        :width="'500px'"
        v-model="visibleAddNew2"
        :modelConfig="addNewModelConfig2"
        ><div style="text-align: center"><h2>槽车外输调度令</h2></div>
        <table
          class="table_form"
          width="100%"
          border="2"
          :model="enclosure"
          id="printContent"
        >
          <tr align="center">
            <td>装车计划编号</td>
            <td colspan="3">{{ enclosure.loadingPlanNum }}</td>
          </tr>
          <tr align="center">
            <td colspan="2">计划装车日期</td>
            <td colspan="2">{{ enclosure.planLoadingDate }}</td>
          </tr>
          <tr align="center">
            <td>日计划装载量(辆)</td>
            <td>{{ enclosure.dailyPlanLoadingAmountCar }}</td>
            <td>日计划装载量(t)</td>
            <td>{{ enclosure.dailyPlanLoadingAmountTon }}</td>
          </tr>
          <tr align="center">
            <td>其他事项说明</td>
            <td colspan="3">{{ enclosure.otherRemark }}</td>
          </tr>
          <tr align="center">
            <td>发令单位</td>
            <td>{{ enclosure.issueOrderUnit }}</td>
            <td>发令时间</td>
            <td>{{ enclosure.issueOrderDate }}</td>
          </tr>
          <tr align="center">
            <td>审核意见</td>
            <td colspan="3">{{ enclosure.auditOpinion }}</td>
          </tr>
          <tr align="center">
            <td>审核人</td>
            <td>{{ enclosure.auditor }}</td>
            <td>审核时间</td>
            <td>{{ enclosure.auditTime }}</td>
          </tr>
        </table>
        <a-button
          style="float: right; margin: 10px 0px"
          class="buttonType btn_primary"
          type="primary"
          v-print="printConfig"
        >
          打印
        </a-button>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import { findAllList, Audio } from "@/api/tankWagonExported.js";
import approvalModel from "@/views/tankWagonManage/modules/qualificationReview/modules/component/approvalModel.vue";
export default {
  components: {
    approvalModel,
  },
  data() {
    return {
      id: "",
      pageType: "",
      printConfig: {
        id: "printContent",
        popTitle: "槽车外输调度令",
      },
      enclosure: {},
      Approval: false,
      toExamine: {},
      detailsXQ: false, //详情审批展示
      addNewModelConfig: {
        width: "950px",
        title: "",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      addNewModelConfig2: {
        width: "950px",
        title: "附件下载",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //回传组件
      echoMap: {},
      //新增界面
      addNewConfig: {
        otherConfigurations: [
          {
            //同意button
            type: "btn",
            label: "同意",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "save", //传值内容 拿到当前所有数据包装好的
          },
          {
            //退回button
            type: "btn",
            label: "退回",
            btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
          {
            //取消button
            type: "btn",
            label: "取消",
            btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
          {
            type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
            label: "槽车外输调度令管理审核", //展示名称
            slotScoped: "examine", //插槽
          },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: " 基础信息", //展示名称
            formKey: "", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {}, //校验规则
            },
            colSpan: 24,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "计划装车编号", //展示名称
            formKey: "loadingPlanNum", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {}, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "计划装车时间", //展示名称
            formKey: "planLoadingDate", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {}, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "日计划装载量(车)", //展示名称
            formKey: "dailyPlanLoadingAmountCar", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {}, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "日计划装载量(t)", //展示名称
            formKey: "dailyPlanLoadingAmountTon", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {}, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "textArea", //组件类型 目前指出 input || select
            label: "其他说明事项", //展示名称
            formKey: "otherRemark", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入其他说明事项", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "110px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 24,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "库存提示", //展示名称
            formKey: "effectiveStockAmount", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {}, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "textArea", //组件类型 目前指出 input || select
            label: "审核意见", //展示名称
            formKey: "auditOpinion", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入审核意见", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "110px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 24,
          },
        ],
      },
      addNewConfig2: {
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: "审批信息", //展示名称
            formKey: "", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {}, //校验规则
            },
            colSpan: 24,
          },
        ],
      },
      columnsApproval: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
        },
        {
          title: "审批节点",
          dataIndex: "person",
          width: 180,
        },
        {
          title: "审批人",
          dataIndex: "institution",
          width: 150,
        },
        {
          title: "审批时间",
          dataIndex: "result",
          width: 150,
        },
        {
          title: "审批意见",
          dataIndex: "advice",
          width: 150,
        },
      ],
      visibleAddNew: false,
      visibleAddNew2: false,
      form: {},
      form2: {},
      stateInfo: [
        {
          value: "待审核",
          label: "待审核",
        },
        {
          value: "审核通过",
          label: "审核通过",
        },
        {
          value: "退回",
          label: "退回",
        },
      ],
      //勾选框/选择框组件
      selectedRowKeys: [],
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      //翻页页面组件
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      //页面下方表格的列属性
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
          align: "center",
        },
        {
          title: "装车计划编号",
          dataIndex: "loadingPlanNum",
          align: "center",
          width: "100px",
        },
        {
          title: "计划装车日期",
          dataIndex: "planLoadingDate",
          align: "center",
          width: "100px",
        },
        {
          title: "日计划装载量(辆)",
          dataIndex: "dailyPlanLoadingAmountCar",
          align: "center",
          width: "130px",
        },
        {
          title: "日计划装载量(t)",
          dataIndex: "dailyPlanLoadingAmountTon",
          align: "center",
          width: "130px",
        },
        {
          title: "发令单位",
          dataIndex: "issueOrderUnit",
          align: "center",
          width: "100px",
        },
        {
          title: "发令时间",
          dataIndex: "issueOrderDate",
          align: "center",
          width: "150px",
        },
        {
          title: "审核人",
          dataIndex: "auditor",
          align: "center",
          width: "100px",
        },
        {
          title: "审核状态",
          dataIndex: "auditStatus",
          align: "center",
          fixed: "right",
          width: "100px",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 120,
          fixed: "right",
          align: "center",
        },
      ],
      //表格中的数据
      dataSource: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 审批
    approvalCommit() {
      if (this.$refs.stepsModel.form.type == 1) {
        this.agree(auditOpinion);
      } else {
        this.returnTH;
      }
    },
    agree() {
      let adopt = {
        auditOpinion: this.$refs.stepsModel.form.opinion,
        id: this.toExamine.id,
      };
      let auditStatus = "同意";
      Audio(adopt, auditStatus).then((res) => {
        if (res.code == "200") {
          this.visibleAddNew = false;
          this.$message.success("同意成功！");
          this.getList();
        }
      });
    },
    returnTH() {
      if (this.$refs.stepsModel.form.opinion) {
        let adopt = {
          auditOpinion: this.$refs.stepsModel.form.opinion,
          id: this.toExamine.id,
        };
        let auditStatus = "退回";
        Audio(adopt, auditStatus).then((res) => {
          if (res.code == "200") {
            this.visibleAddNew = false;
            this.$message.success("退回成功！");
            this.getList();
          }
        });
      } else {
        this.$message.success("请录入审核意见");
      }
    },
    handleCancel() {
      this.visibleAddNew = false;
    },
    look(row) {
      this.pageType = "look";
      this.Approval = false;
      this.toExamine = row;
      this.detailsXQ = true;
      //清空id，解决重复进入同一数据时，审批信息不刷新
      this.id = "";
      this.$nextTick(() => {
        this.id = row.id;
      });
      this.addNewModelConfig.title =
        this.pageType == "approval"
          ? "槽车外输调度令管理-审核"
          : "槽车外输调度令管理-详情";
      this.visibleAddNew = true;
    },
    //点击表格中审批按钮
    approvalClick(val) {
      this.look(val);
      this.pageType = "approval";
    },
    getList() {
      findAllList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageNum = 1;
        this.form.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    resetForm2() {
      this.form2 = {};
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    //日期的
    onChange(date, dateString) {},
    cancel(value) {
      console.log(value, "取消");
      this.visibleAddNew = false;
    },
    // 调度令
    DispatchOrder() {
      console.log(this.toExamine);
      this.visibleAddNew2 = true;
      this.enclosure = this.toExamine;
    },
  },
};
</script>
<style scoped>
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}
#components-layout-demo-basic > .ant-layout{
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
</style>