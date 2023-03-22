<template>
  <Breadcrumb>
    <!--头部功能按钮区-->
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'Add',
            icon: 'Add-icon',
            clickName: 'addClick',
          },
          {
            value: 'Delete',
            clickName: 'deleteClick',
            icon: 'Delete-icon',
            name: '删除',
          },
        ]"
        @addClick="addClick"
        @deleteClick="deleteClick"
      ></pe-button>
    </template>

    <template slot="appMain">
      <!--查询条件及按钮-->
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="searchForm">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="设备名称"
                >
                  <a-input
                    v-model="searchForm.deviceName"
                    placeholder="请输入设备名称"
                  >
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="设备位号"
                >
                  <a-input
                    v-model="searchForm.deviceTagCode"
                    placeholder="请输入设备位号"
                  >
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="用户单位名称"
                >
                  <a-input
                    v-model="searchForm.companyName"
                    placeholder="请输入用户单位名称"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item>
                  <a-button
                    v-Query
                    class="buttonType"
                    type="primary"
                    @click.stop="queryClick()"
                  >
                    查询
                  </a-button>
                  <a-button class="buttonType" @click.stop="resetClick()">
                    重置
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>

      <!--表格-->
      <dc-table
        class="list_table_1"
        :scroll="{ y: 1, x: 100 }"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          fixed: true,
        }"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
              },
            ]"
            @edit="editClick(row)"
          ></pe-button>
          <!-- <span class="edit" v-Edit @click.stop="editClick(row)">编辑</span> -->
        </template>
      </dc-table>

      <!-- 新增编辑弹窗 -->
      <dc-Model
        class="from-style middleModel"
        v-model="isVisible"
        :modelConfig="modelConfig"
      >
        <a-form :form="infoForm" layout="horizontal" class="addMargins">
          <a-row :gutter="24">
            <a-form-item label="编号" v-show="false">
              <a-input v-decorator="['id']" />
            </a-form-item>
            <a-form-item label="设备编码" v-show="false">
              <a-input
                v-decorator="[
                  'equipmentCode',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择设备',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <div class="buttonInput">
              <a-col :span="12">
                <a-form-item label="设备名称">
                  <a-input
                    style="width: 120px"
                    disabled
                    v-decorator="[
                      'equipmentName',
                      {
                        rules: [
                          {
                            required: true,
                            message: '设备名称不可空',
                          },
                        ],
                      },
                    ]"
                    placeholder="（自动带入）"
                  />
                  <a-button
                    class="buttonType"
                    type="primary"
                    @click.stop="equipmentVisible = true"
                  >
                    选择
                  </a-button>
                </a-form-item>
              </a-col>
            </div>
            <a-col :span="12">
              <a-form-item label="设备位号">
                <a-input
                  disabled
                  v-decorator="[
                    'equipmentTagCode',
                    {
                      rules: [
                        {
                          required: true,
                          message: '设备位号不可空',
                        },
                      ],
                    },
                  ]"
                  placeholder="（自动带入）"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="用户单位名称">
                <a-input
                  v-decorator="[
                    'companyName',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入用户单位名称',
                        },
                      ],
                    },
                  ]"
                  placeholder="请输入用户单位名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="绑定时间">
                <a-input
                  disabled
                  v-decorator="['createdDateTime']"
                  placeholder="（自动带入）"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="创建人">
                <a-input
                  disabled
                  v-decorator="['createdUser']"
                  placeholder="（自动带入）"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div class="ant-modal-footer">
          <a-button class="buttonType" type="primary" @click.stop="saveClick()">
            保存
          </a-button>
          <a-button class="buttonType" @click.stop="cancelClick()">
            取消
          </a-button>
        </div>
      </dc-Model>

      <equipmentModel
        :equipmentVisible.sync="equipmentVisible"
        @selectedClic="selectedClic"
      />
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getUserBind,
  addUserBind,
  editUserBind,
  deleteUserBind,
} from "@/api/meteringManagement/userInformationBinding.js";
import { queryPageListForUnClass } from "@/api/PublicInterface";
import equipmentModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/equipmentModel.vue";
export default {
  components: {
    equipmentModel,
  },
  data() {
    return {
      equipmentVisible: false,
      //初始化表单
      infoForm: this.$form.createForm(this),
      tempId: false,
      dateilInfo: {},
      deviceSelect: [],
      deviceTagCodeOptions: {},
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
      //勾选框/选择框组件
      selectedRowKeys: [],
      //新增弹窗是否显示，false不显示
      isVisible: false,
      //新增编辑弹窗的相关设置
      modelConfig: {
        width: "950px",
        title: "用户绑定",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //下拉框搜索
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      Form: {},
      //回传组件
      echoMap: {},
      //查询所需的数据
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        deviceName: "",
        equipmentTagCode: "",
        companyName: "",
      },
      //页面下方表格的列属性
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 70,
          align: "center",
        },
        {
          title: "仪表设备位号",
          dataIndex: "eqm_sbwh",
          // width: 150,
          align: "center",
        },
        {
          title: "仪表设备名称",
          dataIndex: "eqm_sbmc",
          // width: 150,
          align: "center",
        },
        {
          title: "用户单位名称",
          dataIndex: "companyName",
          // width: 150,
          align: "center",
        },
        {
          title: "绑定时间",
          dataIndex: "createdDateTime",
          // width: 150,
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "createdUser",
          // width: 150,
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 150,
          fixed: "right",
          align: "center",
        },
      ],
      //新增界面
      addFromConfig: {
        otherConfigurations: [
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
            label: "取消",
            btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //新增界面的相关展示
        formDataList: [
          {
            type: "select", //组件类型 目前指出 input || select
            label: "设备名称", //展示名称
            formKey: "equipmentCode", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入设备名称", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
              vDecorator: {
                required: true,
                message: "请输入设备名称",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "设备位号", //展示名称
            formKey: "equipmentTagCode", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "(选择设备自动带入)", //输入框为空值的时候展示内容
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
            label: "用户单位名称", //展示名称
            formKey: "companyName", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入用户单位名称", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            // options: { // 配置参数
            //   vDecorator: { required: true, message: '请输入外委单位负责人', trigger: 'blur' }, //校验规则
            // },
            options: {
              // 暂时开发状态
              multiple: true,
              vDecorator: {
                required: true,
                message: "请输入用户单位名称",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "datePicker", //组件类型 目前指出 input || select
            label: "绑定时间", //展示名称
            colSpan: 12,
            // monent:'value',
            format: "YYYY-MM-DD HH:mm:ss",
            formKey: "createdDateTime", //form 定义的 key (必须唯一 || 必须传入)
            value: "2022-09-27 18:30:00", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请选择绑定时间", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
              // vDecorator: { required: true, message: '请输入作业日期', trigger: 'blur' }, //校验规则
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "创建人", //展示名称
            formKey: "createdUser", //form 定义的 key (必须唯一 || 必须传入)
            value: "管理员", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入创建人", //输入框为空值的时候展示内容
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
        ],
      },
      //表格中的数据
      dataSource: [],
    };
  },
  //组件被挂载之后
  mounted() {
    this.getList();
    this.getQueryPageList();
  },
  methods: {
    selectedClic(value) {
      if (value) {
        this.infoForm.setFieldsValue({
          equipmentCode: value.eqm_sbbm,
          equipmentName: value.eqm_sbmc,
          equipmentTagCode: value.eqm_sbwh,
        });
        this.equipmentVisible = false;
      } else {
        this.$message.warning("请选择设备");
      }
    },

    //获得表格数据
    getList() {
      getUserBind(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      //清空表格多选框
      this.selectedRowKeys = [];
    },
    // 获取设备台账
    getQueryPageList() {
      queryPageListForUnClass({
        featureClassificId: "",
        searchMap: {},
        pageIndex: 1,
        pageSize: 9999,
      }).then((res) => {
        let deviceSelect = [];
        this.deviceSelect = res.body.data;
        res.body.data.forEach((item) => {
          if (item.equipCode && item.eqm_sbmc && item.EQP_Num) {
            deviceSelect.push({
              value: item.equipCode,
              label: item.eqm_sbmc,
            });
          }
        });
        this.addFromConfig.formDataList.forEach((item) => {
          if (item.formKey == "equipmentCode") {
            item.optionData = deviceSelect;
          }
        });
      });
    },

    //下拉框点击
    selectChange(val) {
      if (val.formKey == "equipmentCode") {
        this.deviceSelect.forEach((item) => {
          if (item.equipCode == val.value) {
            this.addFromConfig.formDataList.forEach((items) => {
              if (items.formKey == "equipmentTagCode") {
                //设备位号
                items.value = item.EQP_Num;
              }
            });
          }
        });
      }
    },

    //新增操作
    addOperation(form) {
      addUserBind(form).then((res) => {
        if (res.code == 200) {
          this.$message.success("保存成功！");
          //关闭弹窗
          this.isVisible = false;
          this.getList();
        } else {
          this.$message.success("保存失败！");
        }
      });
    },

    //编辑操作
    editOperation(form) {
      delete form["deleteFlg"];
      editUserBind(form).then((res) => {
        if (res.code == 200) {
          this.$message.success("编辑成功！");
          //关闭弹窗
          this.isVisible = false;
          this.getList();
        } else {
          this.$message.error("编辑失败！");
        }
      });
    },

    //删除操作
    deleteOperation() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请选择！");
      } else {
        deleteUserBind(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.$message.success("删除成功！");
            this.getList();
          } else {
            this.$message.error("删除失败！");
          }
        });
      }
      //清空表格多选框
      this.selectedRowKeys = [];
    },

    //点击查询按钮
    queryClick() {
      if (this.searchForm) {
        this.searchForm.pageNum = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },

    //新增弹窗相关按钮
    addClick() {
      this.modelConfig.title = "用户信息绑定-新增";
      this.isVisible = true;
      this.infoForm.resetFields();
      this.infoForm.setFieldsValue({
        createdUser: this.$store.state.user.name,
        createdDateTime: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });
    },

    //编辑弹窗相关按钮
    editClick(row) {
      console.log(row);
      this.modelConfig.title = "用户信息绑定-编辑";
      this.isVisible = true;
      this.infoForm.resetFields();
      //回显数据
      this.$nextTick(() => {
        this.infoForm.setFieldsValue({
          id: row.id,
          equipmentCode: row.equipmentCode,
          equipmentName: row.eqm_sbmc,
          companyName: row.companyName,
          equipmentTagCode: row.eqm_sbwh,
          createdUser: row.createdUser,
          createdDateTime: row.createdDateTime,
        });
      });
    },

    //新增编辑弹窗保存
    saveClick() {
      this.infoForm.validateFields((err, value) => {
        if (!err) {
          //新增和编辑共用一个弹窗，有id编辑，无id新增
          if (value.id) {
            this.editOperation(value);
          } else {
            this.addOperation(value);
          }
        }
      });
    },

    //关闭新增编辑弹窗
    cancelClick() {
      this.isVisible = false;
    },

    //分页、排序、筛选变化时触发，更新表格数据
    paginationChange(pagination) {
      this.searchForm.pageNum = pagination.current;
      this.searchForm.pageSize = pagination.pageSize;
      this.getList();
    },

    //点击重置按钮，清空查询From，还原默认分页重新加载表格数据
    resetClick() {
      this.searchForm = {};
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.getList();
    },

    // 删除
    deleteClick() {
      this.deleteOperation();
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
.TableTop {
  margin-top: 10px;
}
</style>
