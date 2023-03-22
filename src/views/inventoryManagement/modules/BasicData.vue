<template>
  <Breadcrumb>
    <!--头部新增删除按钮-->
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', clickName: 'addNew' },
          { value: 'Delete', clickName: 'Delete' },
        ]"
        @addNew="addNew"
        @Delete="Delete"
      ></pe-button>
    </template>

    <template slot="appMain">
      <a-tabs type="card" v-model="activeKey" @change="A">
        <a-tab-pane key="1" tab="储罐信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="罐编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入罐编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="属性"
                    >
                      <a-input
                        v-model="form.property"
                        placeholder="请输入属性"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-form-model-item>
                      <a-button
                        v-Query
                        class="buttonType"
                        type="primary"
                        @click.stop="searchClick()"
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
                    value: 'Edit',
                    type: 'link',
                    clickName: 'edit',
                    icon: '',
                    style: ['btn_link'],
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template>
          </dc-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="卸船管线信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-col>
                </a-form-model>
              </a-layout-content>
            </a-layout>
          </div>
          <!--表格-->
          <dc-table
            @change="paginationChange"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="pagination"
            :scroll="{ x: 100 }"
            :columns="columns2"
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
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template> </dc-table
        ></a-tab-pane>
        <a-tab-pane key="3" tab="装置区管线信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-col>
                </a-form-model>
              </a-layout-content>
            </a-layout>
          </div>
          <!--表格-->
          <dc-table
            @change="paginationChange"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="pagination"
            :scroll="{ x: 100 }"
            :columns="columns2"
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
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template> </dc-table
        ></a-tab-pane>
        <a-tab-pane key="4" tab="高压管线信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-col>
                </a-form-model>
              </a-layout-content>
            </a-layout>
          </div>
          <!--表格-->
          <dc-table
            @change="paginationChange"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="pagination"
            :scroll="{ x: 100 }"
            :columns="columns2"
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
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template> </dc-table
        ></a-tab-pane>
        <a-tab-pane key="5" tab="低压管线信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-col>
                </a-form-model>
              </a-layout-content>
            </a-layout>
          </div>
          <!--表格-->
          <dc-table
            @change="paginationChange"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="pagination"
            :scroll="{ x: 100 }"
            :columns="columns2"
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
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template> </dc-table
        ></a-tab-pane>
        <a-tab-pane key="6" tab="再冷凝器信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-col>
                </a-form-model>
              </a-layout-content>
            </a-layout>
          </div>
          <!--表格-->
          <dc-table
            @change="paginationChange"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="pagination"
            :scroll="{ x: 100 }"
            :columns="columns3"
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
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template> </dc-table
        ></a-tab-pane>
        <a-tab-pane key="7" tab="BOG管线信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-col>
                </a-form-model>
              </a-layout-content>
            </a-layout>
          </div>
          <!--表格-->
          <dc-table
            @change="paginationChange"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="pagination"
            :scroll="{ x: 100 }"
            :columns="columns2"
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
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template> </dc-table
        ></a-tab-pane>
        <a-tab-pane key="8" tab="外输管线信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-col>
                </a-form-model>
              </a-layout-content>
            </a-layout>
          </div>
          <!--表格-->
          <dc-table
            @change="paginationChange"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="pagination"
            :scroll="{ x: 100 }"
            :columns="columns2"
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
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template> </dc-table
        ></a-tab-pane>
        <a-tab-pane key="9" tab="槽车管线信息"
          ><div id="components-layout-demo-basic" style="width: 100%">
            <a-layout>
              <a-layout-content>
                <a-form-model layout="inline" :model="form">
                  <a-col :span="6">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编号"
                    >
                      <a-input
                        v-model="form.code"
                        placeholder="请输入编号"
                      ></a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="6">
                    <a-button
                      v-Query
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click.stop="resetClick()">
                      重置
                    </a-button>
                  </a-col>
                </a-form-model>
              </a-layout-content>
            </a-layout>
          </div>
          <!--表格-->
          <dc-table
            @change="paginationChange"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :pagination="pagination"
            :scroll="{ x: 100 }"
            :columns="columns2"
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
                    isPower: false,
                  },
                ]"
                @edit="edit(row)"
              ></pe-button>
            </template> </dc-table
        ></a-tab-pane>
      </a-tabs>

      <!--新增/编辑弹窗-->
      <dc-Model v-model="visible" :modelConfig="modelConfig">
        <FormitemDemo
          v-if="visible"
          ref="Form"
          :Config="Config"
          @save="saveList"
          @cancel="cancel"
          :echoMap="echoMap"
        ></FormitemDemo>
      </dc-Model>
      <dc-Model v-model="visible2" :modelConfig="modelConfig">
        <FormitemDemo
          v-if="visible2"
          ref="Form"
          :Config="Config2"
          @save="saveList"
          @cancel="cancel"
          :echoMap="echoMap"
        ></FormitemDemo>
      </dc-Model>
      <dc-Model v-model="visible3" :modelConfig="modelConfig">
        <FormitemDemo
          v-if="visible3"
          ref="Form"
          :Config="Config3"
          @save="saveList"
          @cancel="cancel"
          :echoMap="echoMap"
        ></FormitemDemo>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
  <script>
import { getListForPage, update, add, deleteSC } from "@/api/BasicData";
export default {
  data() {
    return {
      activeKey: "1",
      stateInfo: [],
      dateilInfo: {},
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
      //回传组件
      echoMap: {},
      //查看组件中的数值
      LookForm: {},
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageSize: 10,
        pageNum: 1,
      },

      visible: false,
      visible2: false,
      visible3: false,
      visibleLook: false,
      //新增/编辑弹窗配置
      modelConfig: {
        width: "950px",
        // title: "临时检修计划-新增",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //页面下方表格的列属性
      columns: [
        {
          title: "罐编号",
          dataIndex: "code",
          width: 150,
          align: "center",
        },
        {
          title: "位号",
          dataIndex: "tagNo",
          width: 150,
          align: "center",
        },
        {
          title: "罐全容（m3）",
          dataIndex: "tankCapacity",
          width: 150,
          align: "center",
        },
        {
          title: "直径",
          dataIndex: "diameter",
          width: 200,
          align: "center",
        },
        {
          title: "属性",
          dataIndex: "property",
          width: 150,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 150,
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
      //新增/编辑弹窗控件
      Config: {
        //按钮
        otherConfigurations: [
          {
            type: "btn",
            label: "保存",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "save", //传值内容 拿到当前所有数据包装好的
          },
          {
            type: "btn",
            label: "取消",
            btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //表单
        formDataList: [
          {
            type: "input", //组件类型 目前指出 input || select
            label: "罐编号", //展示名称
            colSpan: 8,
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入罐编号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入罐编号",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "位号", //展示名称
            colSpan: 8,
            formKey: "tagNo", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入位号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入位号",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "罐全容（m3）", //展示名称
            colSpan: 8,
            formKey: "tankCapacity", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入罐全容", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入罐全容",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "直径", //展示名称
            colSpan: 8,
            formKey: "diameter", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入直径", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入直径",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "属性", //展示名称
            colSpan: 8,
            formKey: "property", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入属性", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入属性",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "textArea", //组件类型 目前指出 input || select
            label: "备注", //展示名称
            colSpan: 8,
            formKey: "remark", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入备注", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: false,
                message: "请输入备注",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 24,
          },
        ],
      },
      //页面下方表格的列属性
      columns2: [
        {
          title: "管线名称",
          dataIndex: "lineName",
          width: 150,
          align: "center",
        },
        {
          title: "位号",
          dataIndex: "tagNo",
          width: 150,
          align: "center",
        },
        {
          title: "尺寸（英寸）",
          dataIndex: "inch",
          width: 150,
          align: "center",
        },
        {
          title: "外径（mm）",
          dataIndex: "externalDiameter",
          width: 200,
          align: "center",
        },
        {
          title: "壁厚（mm）",
          dataIndex: "wallThickness",
          width: 150,
          align: "center",
        },
        {
          title: "长度（m）",
          dataIndex: "lengths",
          width: 150,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 150,
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
      //新增/编辑弹窗控件
      Config2: {
        //按钮
        otherConfigurations: [
          {
            type: "btn",
            label: "保存",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "save", //传值内容 拿到当前所有数据包装好的
          },
          {
            type: "btn",
            label: "取消",
            btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //表单
        formDataList: [
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编号", //展示名称
            colSpan: 8,
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入编号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入编号",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "管线名称", //展示名称
            colSpan: 8,
            formKey: "lineName", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入管线名称", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入管线名称",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "位号", //展示名称
            colSpan: 8,
            formKey: "tagNo", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入位号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入位号",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "尺寸（英寸）", //展示名称
            colSpan: 8,
            formKey: "inch", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入尺寸", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入尺寸",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "外径（mm）", //展示名称
            colSpan: 8,
            formKey: "externalDiameter", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入外径", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入外径",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "壁厚（mm）", //展示名称
            colSpan: 8,
            formKey: "wallThickness", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入壁厚", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入壁厚",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "长度（m）", //展示名称
            colSpan: 8,
            formKey: "lengths", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入长度", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入长度",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "textArea", //组件类型 目前指出 input || select
            label: "备注", //展示名称
            colSpan: 8,
            formKey: "remark", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入备注", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: false,
                message: "请输入备注",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 24,
          },
        ],
      },
      //页面下方表格的列属性
      columns3: [
        {
          title: "编号",
          dataIndex: "code",
          width: 150,
          align: "center",
        },
        {
          title: "名称",
          dataIndex: "name",
          width: 150,
          align: "center",
        },
        {
          title: "位号",
          dataIndex: "tagNo",
          width: 150,
          align: "center",
        },
        {
          title: "体积（m3）",
          dataIndex: "volume",
          width: 200,
          align: "center",
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 150,
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
      //新增/编辑弹窗控件
      Config3: {
        //按钮
        otherConfigurations: [
          {
            type: "btn",
            label: "保存",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "save", //传值内容 拿到当前所有数据包装好的
          },
          {
            type: "btn",
            label: "取消",
            btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "cancel", //传值内容 拿到当前所有数据包装好的
          },
        ],
        //表单
        formDataList: [
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编号", //展示名称
            colSpan: 8,
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入编号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入编号",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "名称", //展示名称
            colSpan: 8,
            formKey: "name", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入名称", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入名称",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "位号", //展示名称
            colSpan: 8,
            formKey: "tagNo", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入位号", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入位号",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "体积（m3）", //展示名称
            colSpan: 8,
            formKey: "volume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入体积", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "180px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: true,
                message: "请输入体积",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 12,
          },
          {
            type: "textArea", //组件类型 目前指出 input || select
            label: "备注", //展示名称
            colSpan: 8,
            formKey: "remark", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入备注", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              vDecorator: {
                required: false,
                message: "请输入备注",
                trigger: "blur",
              }, //校验规
            },
            colSpan: 24,
          },
        ],
      },
      //查看的弹窗的相关设置
      lookModelConfig: {
        width: "950px",
        title: "库存盘点表",
        cancelText: false,
        footer: "", //是否展示页脚
      },

      //表格中的数据
      dataSource: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    A(row) {
      this.form = {};
      this.form.pageSize = 10;
      this.form.pageNum = 1;
      this.getList();
    },
    addNew() {
      console.log(this.activeKey);
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //日期的onchange
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    //点击新增
    addNew() {
      if (this.activeKey == "1") {
        this.echoMap = {};
        this.modelConfig.title = "储罐信息-新增";
        this.visible = true;
      } else if (
        this.activeKey == "2" ||
        this.activeKey == "3" ||
        this.activeKey == "4" ||
        this.activeKey == "5" ||
        this.activeKey == "7" ||
        this.activeKey == "8" ||
        this.activeKey == "9"
      ) {
        this.echoMap = {};
        this.visible2 = true;
      } else if (this.activeKey == "6") {
        this.echoMap = {};
        this.modelConfig.title = "再冷凝器信息-新增";
        this.visible3 = true;
      }
      if (this.activeKey == "2") {
        this.modelConfig.title = "卸船管线信息-新增";
      }
      if (this.activeKey == "3") {
        this.modelConfig.title = "装置区管线信息-新增";
      }
      if (this.activeKey == "4") {
        this.modelConfig.title = "高压管线信息-新增";
      }
      if (this.activeKey == "5") {
        this.modelConfig.title = "低压管线信息-新增";
      }
      if (this.activeKey == "7") {
        this.modelConfig.title = "BOG管线信息-新增";
      }
      if (this.activeKey == "8") {
        this.modelConfig.title = "外输管线信息-新增";
      }
      if (this.activeKey == "9") {
        this.modelConfig.title = "槽车管线信息-新增";
      }
      if (this.activeKey == "1") {
        let Name = {
          typeCode: "SCYX-JCXXLX-CG",
          type: "储罐",
        };
        this.echoMap = Name;
      } else if (this.activeKey == "2") {
        let Name = {
          typeCode: "SCYX-JCXXLX-XCGX",
          type: "卸船管线",
        };
        this.echoMap = Name;
      } else if (this.activeKey == "3") {
        let Name = {
          typeCode: "SCYX-JCXXLX-ZZQGX",
          type: "装置区管线",
        };
        this.echoMap = Name;
      } else if (this.activeKey == "4") {
        let Name = {
          typeCode: "SCYX-JCXXLX-GYGX",
          type: "高压管线",
        };
        this.echoMap = Name;
      } else if (this.activeKey == "5") {
        let Name = {
          typeCode: "SCYX-JCXXLX-DYGX",
          type: "低压管线",
        };
        this.echoMap = Name;
      } else if (this.activeKey == "6") {
        let Name = {
          typeCode: "SCYX-JCXXLX-ZLNQ",
          type: "再冷凝器",
        };
        this.echoMap = Name;
      } else if (this.activeKey == "7") {
        let Name = {
          typeCode: "SCYX-JCXXLX-BOGGX",
          type: "BOG管线",
        };
        this.echoMap = Name;
      } else if (this.activeKey == "8") {
        let Name = {
          typeCode: "SCYX-JCXXLX-WSGX",
          type: "外输管线",
        };
        this.echoMap = Name;
      } else if (this.activeKey == "9") {
        let Name = {
          typeCode: "SCYX-JCXXLX-CCGX",
          type: "槽车管线",
        };
        this.echoMap = Name;
      }
    },

    //点击编辑
    edit(val) {
      if (this.activeKey == "1") {
        this.modelConfig.title = "储罐信息-编辑";
        this.visible = true;
        this.echoMap = {};
        this.echoMap = val;
      } else if (
        this.activeKey == "2" ||
        this.activeKey == "3" ||
        this.activeKey == "4" ||
        this.activeKey == "5" ||
        this.activeKey == "7" ||
        this.activeKey == "8" ||
        this.activeKey == "9"
      ) {
        this.visible2 = true;
        this.echoMap = {};
        this.echoMap = val;
      } else if (this.activeKey == "6") {
        this.visible3 = true;
        this.echoMap = {};
        this.echoMap = val;
        this.modelConfig.title = "再冷凝器信息-编辑";
      }
      if (this.activeKey == "2") {
        this.modelConfig.title = "卸船管线信息-编辑";
      }
      if (this.activeKey == "3") {
        this.modelConfig.title = "装置区管线信息-编辑";
      }
      if (this.activeKey == "4") {
        this.modelConfig.title = "高压管线信息-编辑";
      }
      if (this.activeKey == "5") {
        this.modelConfig.title = "低压管线信息-编辑";
      }
      if (this.activeKey == "7") {
        this.modelConfig.title = "BOG管线信息-编辑";
      }
      if (this.activeKey == "8") {
        this.modelConfig.title = "外输管线信息-编辑";
      }
      if (this.activeKey == "9") {
        this.modelConfig.title = "槽车管线信息-编辑";
      }
    },

    //点击查看
    // getListDetail(val) {
    //   this.modelConfig.title = "冷能月报-查看";
    //   this.visible = true;
    //   this.dateilInfo = val;
    // },

    //点击查看
    lookClick(value) {
      this.lookModelConfig.title = "冷能月报-查看";
      this.LookForm = value;
      this.visibleLook = true;
      console.log(this.LookForm, "look");
    },

    //点击查看下方的按钮
    closeClick() {
      this.visibleLook = false;
    },

    //保存详情
    saveList(val) {
      this.$refs.Form.verificationRules((valid) => {
        if (valid) {
          if (val.id) {
            // val.id = this.dateilInfo.id;
            update(val).then((res) => {
              if (res.code == "200") {
                this.$message.success("修改成功");
                this.getList();
                if (this.activeKey == "1") {
                  this.visible = false;
                } else if (
                  this.activeKey == "2" ||
                  this.activeKey == "3" ||
                  this.activeKey == "4" ||
                  this.activeKey == "5" ||
                  this.activeKey == "7" ||
                  this.activeKey == "8" ||
                  this.activeKey == "9"
                ) {
                  this.visible2 = false;
                } else if (this.activeKey == "6") {
                  this.visible3 = false;
                }
              }
            });
          } else {
            add(val).then((res) => {
              if (res.code == "200") {
                this.$message.success("保存成功");
                if (this.activeKey == "1") {
                  this.visible = false;
                } else if (
                  this.activeKey == "2" ||
                  this.activeKey == "3" ||
                  this.activeKey == "4" ||
                  this.activeKey == "5" ||
                  this.activeKey == "7" ||
                  this.activeKey == "8" ||
                  this.activeKey == "9"
                ) {
                  this.visible2 = false;
                } else if (this.activeKey == "6") {
                  this.visible3 = false;
                }
                this.getList();
              }
            });
          }
        }
      });
    },
    //获得当前页面
    getList() {
      if (this.activeKey == "1") {
        this.form.typeCode = "SCYX-JCXXLX-CG";
        this.form.type = "储罐";
      } else if (this.activeKey == "2") {
        this.form.typeCode = "SCYX-JCXXLX-XCGX";
        this.form.type = "卸船管线";
      } else if (this.activeKey == "3") {
        this.form.typeCode = "SCYX-JCXXLX-ZZQGX";
        this.form.type = "装置区管线";
      } else if (this.activeKey == "4") {
        this.form.typeCode = "SCYX-JCXXLX-GYGX";
        this.form.type = "高压管线";
      } else if (this.activeKey == "5") {
        this.form.typeCode = "SCYX-JCXXLX-DYGX";
        this.form.type = "低压管线";
      } else if (this.activeKey == "6") {
        this.form.typeCode = "SCYX-JCXXLX-ZLNQ";
        this.form.type = "再冷凝器";
      } else if (this.activeKey == "7") {
        this.form.typeCode = "SCYX-JCXXLX-BOGGX";
        this.form.type = "BOG管线";
      } else if (this.activeKey == "8") {
        this.form.typeCode = "SCYX-JCXXLX-WSGX";
        this.form.type = "外输管线";
      } else if (this.activeKey == "9") {
        this.form.typeCode = "SCYX-JCXXLX-CCGX";
        this.form.type = "槽车管线";
      }
      getListForPage(this.form).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
    },
    //查询功能
    searchClick() {
      if (this.form) {
        console.log(this.form);

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
    // 弹出框取消
    cancel() {
      console.log(333);
      if (this.activeKey == "1") {
        this.visible = false;
      } else if (this.activeKey == "2") {
        this.visible2 = false;
      }
    },
    //重置输入
    resetClick() {
      this.form = {};
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    // // 删除
    // confirm() {
    //   console.log("删除confirm");
    //   this.Delete();
    // },
    Delete() {
      if (
        this.selectedRowKeys.length == 0 ||
        this.selectedRowKeys.length == 0
      ) {
        this.$message.warning("至少选中一项要删除的数据");
      } else {
        deleteSC(this.selectedRowKeys).then((res) => {
          this.$message.success("删除成功");
          this.getList();
        });
        this.selectedRowKeys = [];
      }
    },
    // //上方小提示框
    // success() {
    //   this.$message.success("This is a success message");
    // },
    // error() {
    //   this.$message.error("This is an error message");
    // },
    // warning() {
    //   this.$message.warning("This is a warning message");
    // },
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
  