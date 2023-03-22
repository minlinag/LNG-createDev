<template>
  <Breadcrumb>
    <template slot="appMain"
      ><FormitemDemo
        ref="Form"
        :echoMap="echoMap"
        :layout="'inline'"
        :Config="addNewConfig"
        @save="saveList"
        @cancel="cancelJSA"
      >
        <template slot="monthplan">
          <dc-table
            rowKey="id"
            :scroll="{ x: 100 }"
            :columns="monthplan"
            :openSelector="true"
          >
          </dc-table>
        </template> </FormitemDemo></template
  ></Breadcrumb>
</template>
<script>
import { saveForAddOrUpdate } from "@/api/dispatchingManagement/yearProductionOperation";
export default {
  components: {},
  data() {
    return {
      //回传组件
      echoMap: {},
      //页面下方表格的列属性
      monthplan: [
        {
          title: "日期",
          dataIndex: "",
          // width: 140,
        },
        {
          title: "气化外输量(万方)",
          dataIndex: "gasExportVolume",
          // width: 100,
        },
        {
          title: "槽车装车量(万方)",
          dataIndex: "tankCarExportVolume",
          // width: 100,
        },
        {
          title: "装船(预留)",
          dataIndex: "shipLoad",
          // width: 150,
        },
        {
          title: "卸货量(万方)",
          dataIndex: "mainBusinessDescription",
          //   width: 200,
        },
      ],
      //表格中的数据
      dataSource: [],
      //新增界面
      addNewConfig: {
        otherConfigurations: [
          {
            type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
            label: "年度外输计划表", //展示名称
            slotScoped: "monthplan", //插槽
          },
          {
            //保存button
            type: "btn",
            label: "保存",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "save", //传值内容 拿到当前所有数据包装好的
          },
          {
            //取消button
            type: "btn",
            label: "返回",
            btnType: "back", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: "基础信息", //展示名称
            formKey: "data", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "165px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 24,
            scopedSlots: { customRender: "company" },
          },
          {
            type: "datePicker", //组件类型 目前指出 input || select
            label: "计划时间", //展示名称
            colSpan: 8,
            // monent:'value',
            format: "YYYY-MM-DD",
            formKey: "planTime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "160px", height: "60px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              // multiple: true,
              vDecorator: {
                required: true,
                message: "请选择日期",
                // trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "datePicker", //组件类型 目前指出 input || select
            label: "编制时间", //展示名称
            format: "YYYY-MM-DD",
            formKey: "createdDateTime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编制人", //展示名称
            formKey: "createdUser", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编制部门", //展示名称
            formKey: "createUserSubsidiaryOrgan", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 12,
          },
          {
            type: "card", //组件类型 目前指出 input || select
            label: "月度生产运行计划", //展示名称
            formKey: "data", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "165px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            colSpan: 24,
            scopedSlots: { customRender: "company" },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "计划外输量(万方)", //展示名称
            formKey: "planExportVolume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入计划外输量", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入计划外输量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "气化外输量(万方)", //展示名称
            formKey: "gasExportVolume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入气化外输量", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入气化外输量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "槽车外输量(万方)", //展示名称
            formKey: "tankCarExportVolume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入槽车外输量", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入槽车外输量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "装船(预留)", //展示名称
            formKey: "shipLoad", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入装船", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              //   vDecorator: {
              //     required: true,
              //     message: "请输入槽车外输量",
              //     trigger: "blur",
              //   }, //校验规则
            },
            colSpan: 12,
          },
        ],
      },
    };
  },
  mounted() {
    if (this.$route.query) {
      this.echoMap = this.$route.query;
    }
  },
  methods: {
    saveList(value) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          delete value.data;
          value.recordType = "月度";
          if (value.id) {
            // 修改
            saveForAddOrUpdate(value).then((res) => {
              if (res.code == 200) {
                this.$message.success("修改成功！");
              } else {
                this.$message.error("修改失败！");
              }
            });
          } else {
            // 新增
            saveForAddOrUpdate(value).then((res) => {
              if (res.code == 200) {
                this.$message.success("保存成功！");
              } else {
                this.$message.error("保存失败！");
              }
            });
          }
        }
      });
    },
    cancelJSA() {
      this.$router.push({
        path: "/monthProductionOperation",
      });
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    back() {
      console.log(11111);
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