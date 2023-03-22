<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <a-button
          class="buttonType btn_primary"
          type="primary"
          icon="check"
          :loading="savaIconLoading"
          v-Add
          @click.stop="savaClick()"
        >
          保存
        </a-button>
        <a-popconfirm
          placement="left"
          title="是否提交"
          ok-text="确定"
          cancel-text="取消"
          @confirm.stop="submitClick()"
        >
          <a-button
            class="buttonType btn_primary"
            type="primary"
            icon="issues-close"
            :loading="submitIconLoading"
            v-Add
            @click.stop
          >
            保存并提交
          </a-button>
        </a-popconfirm>

        <a-button
          class="buttonType btn_primary"
          type="primary"
          icon="left"
          @click.stop="returnClick()"
        >
          返回
        </a-button>
      </div>
    </template>
    <template slot="appMain"
      ><FormitemDemo
        :echoMap="echoMap"
        :Config="addNewConfig"
        @save="saveList"
        @cancel="cancelJSA"
      >
        <template slot="year"
          ><a-form-model :model="surfaceForm">
            <table
              border="1"
              style="width: 100%; text-align: center; margin-top: 20px"
            >
              <tr>
                <th colspan="12">生产数据</th>
              </tr>
              <tr>
                <td colspan="2">日计划装载量</td>
                <td colspan="2">次日计划装载量</td>
                <td colspan="2">日实际装载量</td>
                <td colspan="2">月实际装载量</td>
                <td colspan="2">年实际装载量</td>
                <td>年目标装载量</td>
                <td>目标完成率（%）</td>
              </tr>
              <tr>
                <td width="10%"><a-input /></td>
                <td width="5%">车</td>
                <td width="10%"><a-input /></td>
                <td width="5%">车</td>
                <td width="10%"><a-input /></td>
                <td width="5%">车</td>
                <td width="10%"><a-input /></td>
                <td width="5%">车</td>
                <td width="10%"><a-input /></td>
                <td width="5%">车</td>
                <td width="15%" rowspan="2"><a-input /></td>
                <td width="15%" rowspan="2"><a-input /></td>
              </tr>
              <tr>
                <td width="10%"><a-input /></td>
                <td width="5%">t</td>
                <td width="10%"><a-input /></td>
                <td width="5%">t</td>
                <td width="10%"><a-input /></td>
                <td width="5%">t</td>
                <td width="10%"><a-input /></td>
                <td width="5%">t</td>
                <td width="10%"><a-input /></td>
                <td width="5%">t</td>
              </tr>
              <tr align="left">
                <td colspan="12">
                  自<a-date-picker
                    style="width: 20%"
                    v-model="surfaceForm.sxsj"
                    value-format="YYYY-MM-DD"
                  />
                  至今，LNG槽车充装站累计液态外输（ 3000 ）吨，累计装载车辆（
                  4000 ）车。
                </td>
              </tr>
            </table>
            <table
              border="1"
              style="width: 100%; text-align: center; margin-top: 20px"
            >
              <tr>
                <th colspan="13">装车撬使用情况</th>
              </tr>
              <tr>
                <td>装车撬A</td>
                <td>装车撬B</td>
                <td>装车撬C</td>
                <td>装车撬D</td>
                <td>装车撬E</td>
                <td>装车撬F</td>
                <td>装车撬G</td>
                <td>装车撬H</td>
                <td>装车撬I</td>
                <td>装车撬J</td>
                <td>装车撬K</td>
                <td>装车撬L</td>
                <td>装车撬M</td>
              </tr>
              <tr>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
              </tr>
              <tr>
                <td>装车撬N</td>
                <td>装车撬O</td>
                <td>装车撬P</td>
                <td>装车撬Q</td>
                <td>装车撬R</td>
                <td>装车撬S</td>
                <td>装车撬T</td>
                <td>装车撬U</td>
                <td>装车撬V</td>
                <td>装车撬W</td>
                <td>装车撬X</td>
                <td>装车撬Y</td>
                <td>装车撬Z</td>
              </tr>
              <tr>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
              </tr>
            </table>
          </a-form-model>
        </template>
        <template slot="ship">
          <a-form-model layout="inline" :model="form">
            <table
              border="1"
              style="width: 100%; text-align: center; margin-top: 20px"
            >
              <tr>
                <th colspan="5">地磅系统使用情况</th>
              </tr>
              <tr>
                <td>1#地磅</td>
                <td>2#地磅</td>
                <td>3#地磅</td>
                <td>4#地磅</td>
                <td style="width: 50%">使用说明</td>
              </tr>
              <tr>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-select
                    class="company-select"
                    ref="select"
                    v-model="form.Loading"
                    :options="Loading"
                    placeholder="请选择"
                  ></a-select>
                </td>
                <td>
                  <a-input
                    :bordered="false"
                    class="company-input"
                    v-model="form.Loading"
                    placeholder="请输入"
                  ></a-input>
                </td>
              </tr>
            </table>
          </a-form-model>
          <table
            border="0"
            style="width: 100%; text-align: center; margin-top: 20px"
          >
            <tr>
              <th colspan="5">现场生产动态</th>
            </tr>
          </table>
          <dc-table
            rowKey="id"
            :scroll="{ x: 100 }"
            :columns="ship"
            :dataSource="dataSource"
            :openSelector="true"
          >
          </dc-table> </template></FormitemDemo></template
  ></Breadcrumb>
</template>
<script>
import fileUpload from "@/components/upLoad/fileUpload";
export default {
  components: {
    fileUpload: fileUpload,
  },
  data() {
    return {
      surfaceForm: {},
      form: {},
      Loading: [
        { value: "1", label: "正常" },
        { value: "2", label: "备用" },
        { value: "3", label: "维修中" },
      ],
      //提交按钮加载状态控制
      submitIconLoading: false,
      pagination: {
        current: 0,
        pageSize: 0,
      },
      //回传组件
      echoMap: {},
      //页面下方表格的列属性
      ship: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 70,
        },
        {
          title: "作业内容",
          dataIndex: "JobContent",
        },
        {
          title: "作业类别",
          dataIndex: "  ",
        },
        {
          title: "作业单位",
          dataIndex: "count",
        },
        {
          title: "工作期限",
          dataIndex: " ",
        },
        {
          title: "完成情况",
          dataIndex: " ",
        },
        {
          title: "负责人",
          dataIndex: " ",
        },
      ],
      //表格中的数据
      dataSource: [
        {
          id: 1,
          JobContent: "无",
        },
      ],
      //新增界面
      addNewConfig: {
        otherConfigurations: [
          {
            type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
            label: "年度外输计划表", //展示名称
            slotScoped: "year", //插槽
          },
          {
            type: "otherTypes", //组件类型 目前指出 input || select || 其他类型 || 按钮类型
            label: "接船计划", //展示名称
            slotScoped: "ship", //插槽
          },
          //   {
          //     //保存button
          //     type: "btn",
          //     label: "保存",
          //     btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
          //     disabled: false, //是否禁用 true 是禁用 默认是false
          //     emit: "save", //传值内容 拿到当前所有数据包装好的
          //   },
          //   {
          //     //取消button
          //     type: "btn",
          //     label: "返回",
          //     btnType: "back", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
          //     disabled: false, //是否禁用 true 是禁用 默认是false
          //     emit: "cancel", //传值内容 拿到当前所有数据包装好的
          //   },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: "基础信息", //展示名称
            formKey: "qualificationCertificate", //form 定义的 key (必须唯一 || 必须传入)
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
            label: "发布日期", //展示名称
            colSpan: 8,
            // monent:'value',
            format: "YYYY-MM-DD",
            formKey: "planmaintenancedatetime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "160px", height: "60px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              // multiple: true,
              vDecorator: {
                // required: true,
                // message: "请选择日期",
                // trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "dateRangePicker", //组件类型 目前指出 input || select
            label: "生产日期", //展示名称
            colSpan: 8,
            // monent:'value',
            format: "YYYY-MM-DD",
            formKey: "planmaintenancedatetime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "160px", height: "60px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              // multiple: true,
              vDecorator: {
                // required: true,
                // message: "请选择日期",
                // trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "select", //组件类型 目前指出 input || select
            label: "白班", //展示名称
            formKey: "equipmentTagNo", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请选择设备位号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            optionData: [
              { value: "1", label: "一班" },
              { value: "2", label: "二班" },
              { value: "3", label: "三班" },
              { value: "4", label: "四班" },
              { value: "5", label: "五班" },
            ],
            colSpan: 12,
          },
          {
            type: "select", //组件类型 目前指出 input || select
            label: "小夜", //展示名称
            formKey: "equipmentTagNo", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请选择设备位号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            optionData: [
              { value: "1", label: "一班" },
              { value: "2", label: "二班" },
              { value: "3", label: "三班" },
              { value: "4", label: "四班" },
              { value: "5", label: "五班" },
            ],
            colSpan: 12,
          },
          {
            type: "select", //组件类型 目前指出 input || select
            label: "大夜", //展示名称
            formKey: "equipmentTagNo", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请选择设备位号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
            },
            optionData: [
              { value: "1", label: "一班" },
              { value: "2", label: "二班" },
              { value: "3", label: "三班" },
              { value: "4", label: "四班" },
              { value: "5", label: "五班" },
            ],
            colSpan: 12,
          },
        ],
      },
      addNewConfig2: {
        formDataList: [
          {
            type: "input", //组件类型 目前指出 input || select
            label: "装车撬使用情况说明", //展示名称
            formKey: "personInCharge", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                // required: true,
                // message: "请输入计划外输量",
                // trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "card", //组件类型 目前指出 input || select
            label: "地磅系统使用情况", //展示名称
            formKey: "qualificationCertificate", //form 定义的 key (必须唯一 || 必须传入)
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
        ],
      },
      addNewConfig3: {
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: "现场生产动态", //展示名称
            formKey: "qualificationCertificate", //form 定义的 key (必须唯一 || 必须传入)
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
        ],
      },
    };
  },
  mounted() {},
  methods: {
    saveList() {},
    cancelJSA() {},
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    back() {
      console.log(11111);
    },
    //点击保存按钮
    savaClick() {
      this.$message.success("保存成功！");
    },
    //点击提交按钮
    submitClick() {
      //按钮显示加载状态
      this.submitIconLoading = true;
      setTimeout(() => {
        this.submitIconLoading = false;
        this.$message.success("提交成功！");
      }, 500);
    },
    //返回首页
    returnClick() {
      this.$router.push({
        path: "/loadingDaily",
      });
    },
  },
};
</script>
<style lang="less" scoped>
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
.company-select /deep/ .ant-select-selection {
  border: none;
}
</style>