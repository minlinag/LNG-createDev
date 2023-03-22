<template>
  <Breadcrumb>
    <template slot="appMain">
      <div class="global">
        <div class="search-content">
          <a-form-model v-model="searchInfo">
            <div class="search_form">
              <!-- <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="设备类型:"
              > -->
              <!-- <a-input v-model="searchInfo.sparePartName" placeholder="请输入备件名称"></a-input> -->
              <!-- <a-tree-select
                  v-model="searchInfo.deviceType"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="Please select"
                  allow-clear
                  tree-default-expand-all
                >
                  <a-tree-select-node
                    :value="item.classificCode"
                    :title="item.classificName"
                    v-for="(item, index) in treeSelect"
                    :key="index"
                  >
                    <a-tree-select-node
                      :value="items.classificCode"
                      :title="items.classificName"
                      v-for="(items, indexs) in item.children"
                      :key="index + '-' + indexs"
                    >
                      <a-tree-select-node
                        :value="itemss.classificCode"
                        :title="itemss.classificName"
                        v-for="(itemss, indexss) in items.children"
                        :key="index + '-' + indexs + '-' + indexss"
                      />
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select>
              </a-form-model-item> -->
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="设备名称:"
              >
                <a-input
                  v-model="searchInfo.deviceName"
                  placeholder="设备名称"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="备品备件名称:"
              >
                <a-input
                  v-model="searchInfo.sparePartName"
                  placeholder="设备名称"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item
                :labelCol="{ style: 'width: 150px' }"
                label="备品备件编码:"
              >
                <a-input
                  v-model="searchInfo.materialCode"
                  placeholder="请输入备件编码"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item class="search_form_button">
                <a-button
                  v-Query
                  class="buttonType"
                  :style="{ marginLeft: '8px' }"
                  type="primary"
                  @click="select"
                >
                  查询
                </a-button>
                <a-button class="buttonType" @click="resetForm">
                  重置
                </a-button>
              </a-form-model-item>
            </div>
          </a-form-model>
          <div class="Myserch"></div>
          <!-- <a-collapse :defaultActiveKey="['1']">
            <a-collapse-panel key="1"
                              header="设备备品备件列表"> -->
          <div slot="extra">
            <!--<a-button @click.stop="" class="buttonType" :style="{ marginLeft: '8px' }" type="primary">-->
            <!--导出-->
            <!--</a-button>-->
          </div>
          <dc-table
            @change="paginationChange"
            :pagination="pagination"
            rowKey="id"
            :scroll="{ x: 100 }"
            :columns="columns"
            :dataSource="dataSource"
            :openSelector="false"
          >
            <template slot="operation" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'Edit',
                    clickName: 'edit',
                    type: 'link',
                    icon: '',
                    style: ['btn_link'],
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
              <!-- <span
                v-Edit
                class="btn_link"
                style="cursor: pointer;"
                @click="edit(row)"
                >编辑</span
              > -->
            </template>
          </dc-table>
          <!-- </a-collapse-panel>
          </a-collapse> -->
        </div>
      </div>
      <dc-Model
        v-model="visible"
        :modelConfig="addNewModelConfig"
        class="from-style bigModel"
      >
        <FormitemDemo ref="Form" :Config="Config" @save="save" @cancel="cancel">
          <template slot="upload"> </template>
        </FormitemDemo>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList, //获取列表
  updataList, //修改列表
  getTreeList, //获取树
} from "@/api/spareParts";
import { message } from "ant-design-vue";
export default {
  name: "",
  data() {
    return {
      itemId: "",
      treeSelect: [],
      visible: false,
      // 分页
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
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1}`,
          width: 50,
        },
        {
          title: "设备名称",
          dataIndex: "eqm_sbmc",
          width: 100,
        },
        // {
        //   title: "设备编码",
        //   dataIndex: "eqm_sbbm",
        //   width: 100,
        // },
        {
          title: "设备位号",
          dataIndex: "eqm_sbwh",
          width: 100,
        },
        {
          title: "备件物料名称",
          dataIndex: "sparePartName",
          width: 100,
        },
        {
          title: "备件物料编码",
          dataIndex: "materialCode",
          width: 100,
        },
        {
          title: "规格型号",
          dataIndex: "specificationOrMaterial",
          width: 100,
        },
        {
          title: "计量单位",
          dataIndex: "unit",
          width: 100,
        },
        {
          title: "安全库存",
          dataIndex: "safetyStock",
          width: 100,
        },
        {
          title: "现有量",
          dataIndex: "existingNumber",
          width: 100,
        },
        {
          title: "参考单价（元）",
          dataIndex: "referenceUnitPrice",
          width: 100,
        },
        {
          title: "操作",
          width: 80,
          scopedSlots: { customRender: "operation" },
        },
      ],
      dataSource: [],
      searchInfo: {
        deviceName: "",
        deviceType: "",
        materialCode: "",
        sparePartName: "",
        pageNum: 1,
        pageSize: 10,
      },
      //查看的弹窗的相关设置
      //新增的弹窗的相关设置
      addNewModelConfig: {
        title: "设备备品备件管理",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //新增界面
      Config: {
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
            type: "input", //组件类型 目前指出 input || select
            label: "设备名称", //展示名称
            formKey: "eqm_sbmc", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            optionData: [],
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "设备编码  ", //展示名称
            formKey: "eqm_sbbm", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            optionData: [],
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "设备位号", //展示名称
            formKey: "eqm_sbwh", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入物料编码", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "备品备件名称", //展示名称
            formKey: "sparePartName", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            optionData: [],
            //handleChange:'cccc',
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "备品备件编码  ", //展示名称
            formKey: "materialCode", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            optionData: [],
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "规格型号", //展示名称
            formKey: "specificationOrMaterial", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入物料编码", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "计算单位", //展示名称
            formKey: "unit", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入计算单位", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "现有量", //展示名称
            formKey: "existingNumber", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入现有量", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "参考单价/元", //展示名称
            formKey: "referenceUnitPrice", //form 定义的 key (必须唯一 || 必须传入)
            value: undefined, // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入参考单价/元", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "安全库存", //展示名称
            formKey: "safetyStock", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入安全库存 ", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入安全库存",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 8,
          },
        ],
      },
    };
  },

  mounted() {
    this.getList();
    this.getTreeList();
  },
  methods: {
    //分页查询
    select() {
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = 10;
      this.getList();
    },
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageNum = pagination.current;
      this.searchInfo.pageSize = pagination.pageSize;
      this.getList();
    },
    //重置输入
    resetForm() {
      this.searchInfo = {
        deviceName: "",
        deviceType: "",
        materialCode: "",
        sparePartName: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
    //获取列表
    getList() {
      getList(this.searchInfo).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.pagination.total = res.body.total;
      });
    },
    //点击列表查看详情
    edit(row) {
      this.itemId = row.id;
      this.visible = true;
      this.Config.formDataList.forEach((item) => {
        item.value = row[item.formKey];
      });
    },
    //保存详情
    save(value) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          updataList({ id: this.itemId, safetyStock: value.safetyStock }).then(
            (res) => {
              console.log(res);
              if (res.code == "200") {
                message.success("修改成功");
                this.getList();
                this.visible = false;
              }
            }
          );
        }
      });
    },
    //取消弹出框
    cancel() {
      this.visible = false;
    },
    getTreeList() {
      getTreeList({ classificCode: "", classificName: "" }).then((res) => {
        console.log(res);
        this.treeSelect = res.body.data;
      });
    },
  },
};
</script>
<style scoped lang="less">
/*.left-bar {*/
/*float: left;*/
/*width: 15%;*/
/*background-color: #ECECEC;*/
/*}*/

/*.nav {*/
/*width: 2%;*/
/*}*/

.search-content {
  float: right;
  width: 100%;
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
}

.global {
  overflow: hidden;
  height: 100%;
  display: flex;
}

.Myserch {
  display: flex;
  justify-content: end;
}

/deep/.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin: 0;
  padding: 0;
}

.equipmentDisplay {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ant-form {
  // display: flex;
  // justify-content: space-between;
}

.equipmentSelection {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-left: -17px;
  margin-top: 10px;
}

/deep/.equipmentDisplay-checkbox {
  margin-top: 10px;
}

.head-right {
  // margin-right: 10px;
  // float: right;
}

.nav {
  width: 100%;
  background-color: rgb(101, 173, 201);
  height: 45px;
  margin-top: 60px;
  margin-bottom: -15px;
  border-radius: 2px;
}

div p {
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-left: 40px;
  padding-top: 10px;
}
span {
  cursor: pointer;
  // color: rgb(36, 64, 179);
}
</style>
