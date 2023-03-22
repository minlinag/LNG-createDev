<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', isPower: false, clickName: 'addNew' },
          { value: 'Delete', isPower: false, clickName: 'mydelete' },
        ]"
        @addNew="add"
        @mydelete="mydelete"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div
        id="components-layout-demo-basic"
        class="appMainForm"
        style="position: relative; width: 100%"
      >
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  label="日期:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-range-picker
                    v-model="startDate"
                    valueFormat="YYYY-MM-DD"
                    @change="onChange"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="状态:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-select
                    v-model="form.status"
                    show-search
                    placeholder="请选择状态"
                    option-filter-prop="children"
                    :filter-option="filterOption"
                    :getPopupContainer="getPopupContainer"
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
              <a-form-model-item>
                <a-button
                  v-Query
                  class="buttonType"
                  type="primary"
                  @click="search"
                >
                  查询
                </a-button>
                <a-button class="buttonType" @click="resetForm">
                  重置
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <a-table
        bordered
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        :pagination="pagination"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1 unloadTable"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
        :customRow="rowStyle"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            v-if="row.index != '本页合计' && row.index != '均值'"
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
                isPower: false,
                disabled: $audit.editDisabled(row.recordStatus),
              },
              {
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                isPower: false,
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: 'View',
                name: '详情',
                type: 'link',
                clickName: 'look',
                icon: '',
                style: ['btn_link'],
                isPower: false,
              },
            ]"
            @edit="edit(row)"
            @look="look(row)"
            @approval="approvalClick(row)"
          ></pe-button>
        </template>
      </a-table>
      <dc-Model
        width="80vw"
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="DcModel"
        @input="handleCancel"
      >
        <a-layout>
          <a-layout-content>
            <a-tabs type="card" v-model="activeKey1">
              <a-tab-pane key="1" tab="交易凭证">
                <!-- <trade-certificate></trade-certificate> -->
                <div class="wrapper" :model="surfaceForm">
                  <div id="printContent1">
                    <table class="table_form" width="100%" border="2">
                      <tr style="height: 90px; font-size: 18px">
                        <th colspan="2">
                          北京燃气集团（天津）液化天然气有限公司
                          <br />
                          日计量交接凭证
                        </th>
                      </tr>
                      <tr class="input" style="height: 35px">
                        <td align="center">时间</td>
                        <td align="center">
                          <a-range-picker
                            :disabled="disabled"
                            format="YYYY-MM-DD"
                            @change="onChangeTradeFormData"
                            class="td_range_picker"
                          >
                          </a-range-picker>
                          {{ tradeFormData }}
                        </td>
                      </tr>
                      <tr class="input">
                        <td align="center">气量（Nm³）</td>
                        <td align="left">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.gasFlowNm"
                            placeholder=""
                          />
                        </td>
                      </tr>
                      <tr class="input">
                        <td align="center">气量（t）</td>
                        <td align="left">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.gasFlowT"
                            placeholder=""
                          />
                        </td>
                      </tr>
                      <tr class="input">
                        <td align="center">压力（pa）</td>
                        <td align="left">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.pressure"
                            placeholder=""
                          />
                        </td>
                      </tr>
                      <tr class="tr_remark input">
                        <td align="center">备注</td>
                        <td align="left">
                          <a-textarea
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            v-model="surfaceForm.dealRemark"
                            placeholder=""
                            allow-clear
                            @change="onChange"
                          />
                        </td>
                      </tr>
                    </table>

                    <table width="100%" border="2" class="table_footer">
                      <tr>
                        <td align="center" style="width: 50%" colspan="1">
                          液化天然气有限公司<br />计量员<br />计量专用章（盖章）
                        </td>
                        <td align="center" colspan="1">
                          液化天然气销售公司<br />计量员<br />计量专用章（盖章）
                        </td>
                      </tr>
                    </table>
                  </div>
                  <table
                    width="100%"
                    border="0"
                    class="table_footer"
                    style="margin-top: 10px"
                  >
                    <tr>
                      <td>
                        <a-form-model-item
                          v-if="pageType != 'approval'"
                          style="float: left"
                          :labelCol="{ style: 'width: 60px' }"
                          label="附件："
                        >
                          <file-upload
                            :Text="'上传文件'"
                            @fileChange="flieChange"
                            :echoList="flieChanges"
                            :disabled="pageType == 'look'"
                            ref="importConpontsDataRefs"
                          ></file-upload>
                        </a-form-model-item>
                      </td>
                    </tr>
                  </table>
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="气质分析报告">
                <div
                  class="wrapper"
                  :model="surfaceForm"
                  :rules="rules"
                  ref="surfaceForm"
                >
                  <div id="printContent2">
                    <table class="table_form" width="100%" border="2">
                      <tr style="height: 90px; font-size: 18px">
                        <th colspan="4">
                          北京燃气集团(天津)液化天然气有限责任公司
                          <br />
                          液化天然气气质分析报告
                        </th>
                      </tr>
                      <tr style="height: 35px" align="center">
                        <td>取样地点：</td>
                        <td colspan="3">
                          北京燃气集团(天津)液化天然气有限公司外输分析仪表
                        </td>
                      </tr>
                      <tr style="height: 35px">
                        <td align="center">分析日期</td>
                        <td colspan="3" style="text-align: center" class="hide">
                          {{ tradeFormData }}
                        </td>
                      </tr>
                      <tr align="center" style="height: 35px">
                        <td>编号：</td>
                        <td colspan="3">{{ surfaceForm.gasCode }}</td>
                      </tr>
                      <tr style="height: 35px" align="center">
                        <th colspan="4">分 析 结 果</th>
                      </tr>
                      <tr style="height: 35px">
                        <td align="center">分析项目</td>
                        <td align="center">烃类%（mol）</td>
                        <td align="center">分析项目</td>
                        <td align="center">非烃类%（mol）</td>
                      </tr>
                      <tr class="input">
                        <td align="center" prop="ch4">CH4</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            name="ch4"
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.ch4"
                          />
                        </td>
                        <td align="center">N2</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.n2"
                          />
                        </td>
                      </tr>
                      <tr class="input">
                        <td align="center">C2H6</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.c2h6"
                          />
                        </td>
                        <td align="center">C6+</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.c6"
                          />
                        </td>
                      </tr>
                      <tr class="input">
                        <td align="center">C3H8</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.c3h8"
                          />
                        </td>
                        <td align="center">CO2</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.co2"
                          />
                        </td>
                      </tr>
                      <tr class="input">
                        <td align="center">IC4H10</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.ic4h10"
                          />
                        </td>
                        <td align="center"></td>
                        <td align="center"></td>
                      </tr>
                      <tr class="input">
                        <td align="center">NC4H10</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.nc4h10"
                          />
                        </td>
                        <td align="center"></td>
                        <td align="center"></td>
                      </tr>
                      <tr class="input">
                        <td align="center">C5H12</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.c5h12"
                          />
                        </td>
                        <td align="center"></td>
                        <td align="center"></td>
                      </tr>
                      <tr class="input">
                        <td align="center">IC5H12</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.ic5h12"
                          />
                        </td>
                        <td align="center"></td>
                        <td align="center"></td>
                      </tr>
                      <tr class="input">
                        <td align="center">NC5H12</td>
                        <td align="center">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.nc5h12"
                          />
                        </td>
                        <td align="center"></td>
                        <td align="center"></td>
                      </tr>
                      <tr align="center" class="input">
                        <td colspan="2">密度（Kg/m3）</td>
                        <td colspan="2">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.density"
                          />
                        </td>
                      </tr>
                      <tr align="center" class="input">
                        <td colspan="2">硫化氢（mg/m3）</td>
                        <td colspan="2">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.hydrogenSulfid"
                          />
                        </td>
                      </tr>
                      <tr align="center" class="input">
                        <td colspan="2">总硫（以硫计）（mg/m3）</td>
                        <td colspan="2">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.totalSulfur"
                          />
                        </td>
                      </tr>
                      <tr align="center" class="input">
                        <td colspan="2">水露点（oC）</td>
                        <td colspan="2">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.waterDewPoint"
                          />
                        </td>
                      </tr>
                      <tr align="center" class="input">
                        <td colspan="2">高位发热量（MJ/m3）</td>
                        <td colspan="2">
                          <a-input
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            oninput="value=value.replace(/\D/g,'')"
                            v-model="surfaceForm.highCalorificValue"
                          />
                        </td>
                      </tr>
                      <tr class="tr_remark input">
                        <td align="center">备注</td>
                        <td colspan="3" align="left">
                          <a-textarea
                            :disabled="
                              pageType == 'look' || pageType == 'approval'
                            "
                            v-model="surfaceForm.gasRemark"
                          />
                        </td>
                      </tr>
                    </table>

                    <table width="100%" border="2" class="table_footer">
                      <tr>
                        <td align="center" style="width: 50%" colspan="1">
                          液化天然气有限公司<br />计量员<br />计量专用章（盖章）
                        </td>
                        <td align="center" colspan="1">
                          液化天然气销售公司<br />计量员<br />计量专用章（盖章）
                        </td>
                      </tr>
                    </table>
                  </div>
                  <table
                    width="100%"
                    border="0"
                    class="table_footer"
                    style="margin-top: 10px"
                  >
                    <tr>
                      <td>
                        <a-form-model-item
                          v-if="pageType != 'approval'"
                          style="float: left"
                          :labelCol="{ style: 'width: 60px' }"
                          label="附件："
                        >
                          <file-upload
                            :Text="'上传文件'"
                            @fileChange="flieChange2"
                            :echoList="flieChanges2"
                            :disabled="pageType == 'look'"
                            ref="importConpontsDataRefs2"
                          ></file-upload>
                        </a-form-model-item>
                      </td>
                    </tr>
                  </table>
                </div>
              </a-tab-pane>
            </a-tabs>

            <!--审批页签部分-->
            <div v-if="pageType == 'look' || pageType == 'approval'">
              <stepsModel
                ref="stepsModel"
                :isShow="pageType === 'approval' ? true : false"
                :id="IDs"
              />
            </div>
          </a-layout-content>
          <a-layout-footer>
            <a-button
              v-Add
              class="buttonType"
              type="primary"
              @click.stop="save"
              v-if="operation"
            >
              保存
            </a-button>
            <a-button
              v-Add
              class="buttonType"
              type="primary"
              @click.stop="save('sunmit')"
              v-if="operation2"
            >
              提交
            </a-button>
            <a-button
              type="primary"
              v-if="pageType == 'approval'"
              @click="approvalCommit()"
            >
              确定
            </a-button>
            <a-button
              v-if="PrintDY && activeKey1 == 1"
              class="buttonType"
              type="primary"
              v-print="printConfig1"
              key="1"
            >
              打印
            </a-button>
            <a-button
              v-else
              class="buttonType"
              type="primary"
              v-print="printConfig2"
              key="2"
            >
              打印
            </a-button>
            <a-button @click="handleCancel"> 取消 </a-button>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getListForPage,
  add,
  update,
  deleteSC,
  queryGasEveryDay,
  queryYearTot,
  pipelineExportDailyReportSubmit,
  equipmentAlterationAudio,
} from "@/api/meteringManagement/pipelineOutgoingDaily";
import tradeCertificate from "./components/tradeCertificate.vue";
import fileUpload from "@/components/upLoad/fileUpload";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";

import moment from "moment";

export default {
  components: {
    tradeCertificate,
    stepsModel,
    fileUpload: fileUpload,
  },
  data() {
    return {
      printConfig1: {
        id: "printContent1",
        popTitle: "日计量交接凭证",
      },
      printConfig2: {
        id: "printContent2",
        popTitle: "液化天然气气质分析报告",
      },
      operation2: false,
      operation: true,
      pageType: "",
      PrintDY: false,
      disabled: true,
      surfaceForm: { ch4: "" },
      labelCol: { style: { width: "120px" } },
      labelCol2: { style: { width: "220px" } },
      labelCol3: { style: { width: "100px" } },
      activeKey1: "1",
      activeKey: "1",
      activeKey2: "1",
      formState: {},
      IDs: "",
      visible: false,
      rules: {
        ch4: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
      },
      //新增界面
      addNewConfig: {
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
            label: "提交",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "submit", //传值内容 拿到当前所有数据包装好的
          },
          // {
          //   //保存button
          //   type: "btn",
          //   label: "打印",
          //   btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   emit: "print", //传值内容 拿到当前所有数据包装好的
          // },
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
            type: "dateRangePicker", //组件类型 目前指出 input || select
            label: "时间", //展示名称
            colSpan: 8,
            format: "YYYY-MM-DD",
            formKey: "inspectionDateTime1", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请选择时间", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "气量(Nm³)", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入气量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "气量(t)", //展示名称
            formKey: "outsourceCompany", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入气量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "备注", //展示名称
            formKey: "qualificationCertificate", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入备注",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
        ],
      },
      //新增界面
      addNewConfig2: {
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
            label: "提交",
            btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
            disabled: false, //是否禁用 true 是禁用 默认是false
            emit: "submit", //传值内容 拿到当前所有数据包装好的
          },
          // {
          //   //保存button
          //   type: "btn",
          //   label: "打印",
          //   btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   emit: "print", //传值内容 拿到当前所有数据包装好的
          // },
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
            label: "取样地点", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入取样地点",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "datePicker", //组件类型 目前指出 input || select
            label: "分析日期", //展示名称
            colSpan: 8,
            format: "YYYY-MM-DD",
            formKey: "inspectionDateTime1", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请选择时间", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 暂时开发状态
              multiple: true,
            },
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "编号", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入气量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            // type: "input", //组件类型 目前指出 input || select
            label: "分析结果", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入气量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 24,
          },
          {
            // type: "input", //组件类型 目前指出 input || select
            label: "经类%(mol)", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入气量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 24,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "CH4", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入CH4",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "C2H6", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入C2H6",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "C3H8", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入C3H8",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "IC4H10", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入IC4H10",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "NC4H10", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入NC4H10",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "C5H12", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入C5H12",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "IC5H12", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入IC5H12",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "NC5H12", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入NC5H12",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            // type: "input", //组件类型 目前指出 input || select
            label: "非经类%(mol)", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入气量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 24,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "N2", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入N2",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "C6+", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入C6+",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "CO2", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入CO2",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "NC5H12", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入NC5H12",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            // type: "input", //组件类型 目前指出 input || select
            label: "其他", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              // vDecorator: {
              //   required: true,
              //   message: "请输入气量",
              //   trigger: "blur",
              // }, //校验规则
            },
            colSpan: 24,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "密度(Kg/m3)", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入密度",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "硫化氢(mg/m3)", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入硫化氢",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "总硫(以硫计)(mg/m3)", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "220px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入总硫",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "水露点(oC)", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入水露点",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "高位发热量(MJ/m3)", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "200px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入高位发热量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 8,
          },
          {
            type: "textArea", //组件类型 目前指出 input || select
            label: "备注", //展示名称
            formKey: "code", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入备注",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 24,
          },
        ],
      },
      //查看是否visible
      addNewModelConfig: {
        width: "950px",
        title: "槽车装车月报",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      ApprovalLC: false, //审批展示
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          width: 100,
          align: "center",
        },
        {
          title: "日期",
          dataIndex: "dateExport",
          ellipsis: true,
          width: 190,
          align: "center",
        },
        {
          title: "管道外输量",
          children: [
            {
              title: "(Nm3)",
              dataIndex: "gasFlowNm",
              ellipsis: true,
              width: 100,
              align: "center",
            },
            {
              title: "(t)",
              dataIndex: "gasFlowT",
              ellipsis: true,
              width: 100,
              align: "center",
            },
          ],
        },
        {
          title: "气质分析",
          align: "center",
          children: [
            {
              title: "烃类%(mol)",
              children: [
                {
                  title: "cH₄",
                  dataIndex: "ch4",
                  ellipsis: true,
                  width: 200,
                  align: "center",
                },
                {
                  title: "C₂H₆",
                  dataIndex: "c2h6",
                  ellipsis: true,
                  width: 200,
                  align: "center",
                },
                {
                  title: "C₃H₈",
                  dataIndex: "c3h8",
                  ellipsis: true,
                  width: 200,
                  align: "center",
                },
                {
                  title: "IC₄H₁₀",
                  dataIndex: "ic4h10",
                  ellipsis: true,
                  width: 200,
                  align: "center",
                },
                {
                  title: "NC₄H₁₀",
                  dataIndex: "nc4h10",
                  ellipsis: true,
                  width: 200,
                  align: "center",
                },
                {
                  title: "C₅H₁₂",
                  dataIndex: "c5h12",
                  ellipsis: true,
                  width: 200,
                  align: "center",
                },
                {
                  title: "IC₅H₁₂",
                  dataIndex: "ic5h12",
                  ellipsis: true,
                  width: 200,
                  align: "center",
                },
                {
                  title: "NC₅H₁₂",
                  dataIndex: "nc5h12",
                  ellipsis: true,
                  width: 200,
                  align: "center",
                },
              ],
            },
            {
              title: "非烃类%(mol)",
              align: "center",
              children: [
                {
                  title: "N₂",
                  dataIndex: "n2",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                },
                {
                  title: "C₆+",
                  dataIndex: "c6",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                },
                {
                  title: "CO₂",
                  dataIndex: "co2",
                  width: 200,
                  align: "center",
                  ellipsis: true,
                },
              ],
            },
            {
              title: "密度(Kg/m3)",
              dataIndex: "density",
              width: 200,
              align: "center",
              ellipsis: true,
            },
            {
              title: "硫化氢(mg/m3)",
              dataIndex: "hydrogenSulfid",
              width: 200,
              align: "center",
              ellipsis: true,
            },
            {
              title: "总硫(以硫计)(mg/m3)",
              dataIndex: "totalSulfur",
              ellipsis: true,
              width: 200,
              align: "center",
            },
            {
              title: "水露点(oC)",
              dataIndex: "waterDewPoint",
              ellipsis: true,
              width: 200,
              align: "center",
            },
            {
              title: "高位发热量(MJ/m3)",
              dataIndex: "highCalorificValue",
              ellipsis: true,
              width: 200,
              align: "center",
            },
          ],
        },
        {
          title: "填报人",
          dataIndex: "createdUser",
          ellipsis: true,
          width: 100,
          align: "center",
        },
        {
          title: "填报时间",
          dataIndex: "createdDateTime",
          ellipsis: true,
          width: 150,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "recordStatusName",
          ellipsis: true,
          width: 100,
          align: "center",
          fixed: "right",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 120,
          fixed: "right",
          align: "center",
        },
      ],
      visibleAddNew: false,
      stateInfo: [
        {
          value: "1",
          label: "已保存",
        },
        {
          value: "2",
          label: "已提交",
        },
        {
          value: "3",
          label: "审核中",
        },
        {
          value: "4",
          label: "已审批",
        },
        {
          value: "5",
          label: "已拒绝",
        },
      ],
      //翻页页面组件
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["12", "22", "32", "42", "52", "62"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 12, // 每页条数，所有页设置统一的条数
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
      startDate: [],
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      },
      //表格中的数据
      dataSource: [],
      tradeFormData: "年 月 日 08:00 至 年 月 日 08:00",
      flieChanges: [],
      flieChanges2: [],
    };
  },
  computed: {},
  mounted() {
    this.getList();
  },
  methods: {
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    //审批
    approvalCommit() {
      let params = {
        id: this.surfaceForm.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      };
      equipmentAlterationAudio(params).then((res) => {
        if (res.body == "true") {
          this.$message.success("审批成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("审批失败");
        }
      });
    },
    // 提交
    CSubmit(id) {
      let ID = id ? id : this.surfaceForm.id;
      pipelineExportDailyReportSubmit(ID).then((res) => {
        if (res.code == "200") {
          this.$message.success("提交成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("提交失败");
        }
      });
    },
    handleCancel() {
      this.visibleAddNew = false;
      this.$nextTick(() => {
        this.IDs = "";
      });
      if (this.$refs.importConpontsDataRefs2) {
        this.$refs.importConpontsDataRefs2.removeFile();
      }
      if (this.$refs.importConpontsDataRefs) {
        this.$refs.importConpontsDataRefs.removeFile();
      }
    },
    flieChange(val) {
      this.flieChanges = val;
    },
    flieChange2(val) {
      this.flieChanges2 = val;
    },
    showModal() {
      this.visible = true;
    },
    handleOk() {},
    // 删除
    mydelete() {
      deleteSC(this.selectedRowKeys).then((res) => {
        this.$message.success("删除成功");
        this.getList();
      });
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //新增弹窗相关按钮

    //日期的onchange
    onChange(date, dateString) {
      if (date) {
        this.form.startTime = date[0];
        this.form.endTime = date[1];
      } else {
        this.form.startTime = "";
        this.form.endTime = "";
      }
    },

    // 保存
    save(value) {
      this.pageType = "save";
      if (
        this.surfaceForm.analyseDate ||
        this.surfaceForm.gasFlowNm ||
        this.surfaceForm.gasFlowT ||
        this.surfaceForm.pressure ||
        this.surfaceForm.dealStartTime ||
        this.surfaceForm.dealEndTime
      ) {
        let flielist = [];
        this.flieChanges.forEach((element) => {
          let row = { id: element.id, fileName: element.fileName };
          flielist.push(row);
        });
        this.surfaceForm.fileInfo = JSON.stringify(flielist);
        let flielist2 = [];
        this.flieChanges2.forEach((element) => {
          let row = { id: element.id, fileName: element.fileName };
          flielist2.push(row);
        });
        this.surfaceForm.fileInfoGas = JSON.stringify(flielist2);
        if (this.addNewModelConfig.title == "管道外输日报-编辑") {
          update(this.surfaceForm).then((res) => {
            if (res.code == 200) {
              if (value == "sunmit") {
                this.CSubmit();
              } else {
                this.handleCancel();
                this.$message.success("修改成功！");
                this.getList();
              }
            } else {
              if (value == "sunmit") {
                this.$message.error("提交失败！");
              } else {
                this.$message.warning("修改失败");
              }
            }
          });
        } else {
          add(this.surfaceForm).then((res) => {
            if (res.code == 200) {
              if (value == "sunmit") {
                this.CSubmit(res.body);
              } else {
                this.handleCancel();
                this.$message.success("保存成功！");
                this.getList();
              }
            } else {
              if (value == "sunmit") {
                this.$message.error("提交失败！");
              } else {
                this.$message.warning("保存失败");
              }
            }
          });
        }
      } else {
        this.$message.success("请录入交易凭证");
      }
    },
    //新增弹窗相关按钮
    add() {
      this.pageType = "add";
      var d = new Date();
      var ye = d.getFullYear();
      var mo = (d.getMonth() + 1).toString().padStart(2, "0");
      var da = d.getDate().toString().padStart(2, "0");
      var time1 = ye + "-" + mo + "-" + da;
      this.flieChanges = [];
      this.PrintDY = false;
      this.operation = true;
      this.operation2 = true;
      this.activeKey1 = "1";
      this.surfaceForm = {};
      this.disabled = false;
      this.addNewModelConfig.title = "管道外输日报-新增";
      this.visibleAddNew = true;
      this.echoMap = {};
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh =
        new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.gettime = yy + "-" + mm + "-" + dd;
      this.surfaceForm.gasCode =
        "GDWSRB" + yy + (mm < 10 ? "0" + mm : mm) + da + hh + mf + ss; //编号
      this.tradeFormData = "年 月 日 8:00 至 年 月 日 8:00";

      this.onChangeTradeFormData();
      //重置里面的value，清零
      this.addNewConfig.formDataList.forEach(
        (item) => (item.value = undefined)
      );

      // this.$router.push({
      //   path: "/addPipelineDaily",
      // });
    },
    edit(row) {
      this.pageType = "edit";
      this.operation = true;
      this.operation2 = true;
      this.PrintDY = true;
      this.activeKey1 = "1";
      let obj2 = JSON.parse(JSON.stringify(row));
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }
      if (obj2.fileInfoGas) {
        this.flieChanges2 = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfoGas)
        );
      }
      this.surfaceForm = obj2;
      this.ApprovalLC = false;
      this.disabled = true;
      this.addNewModelConfig.title = "管道外输日报-编辑";
      this.visibleAddNew = true;
      this.onChangeTradeFormData("1", [
        this.surfaceForm.dealStartTime,
        this.surfaceForm.dealEndTime,
      ]);
    },
    approvalClick(val) {
      this.look(val);
      this.ApprovalLC = true;
      this.pageType = "approval";
    },
    look(row) {
      this.pageType = "look";
      this.operation = false;
      this.operation2 = false;
      this.PrintDY = true;
      this.disabled = true;
      this.addNewModelConfig.title = "管道外输日报-查看";
      let obj2 = JSON.parse(JSON.stringify(row));
      if (obj2.fileInfo) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      }
      if (obj2.fileInfoGas) {
        this.flieChanges2 = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfoGas)
        );
      }
      this.$nextTick(() => {
        this.IDs = obj2.id;
      });
      this.surfaceForm = obj2;
      this.visibleAddNew = true;
      this.echoMap = {};
      this.ApprovalLC = true;
      // this.$router.push({
      //   path: "/pipelineDailyDetails",
      // });
    },
    chineseChar2englishChar(chineseChar) {
      // 将单引号‘’都转换成'，将双引号“”都转换成"
      var str = chineseChar.replace(/\’|\‘/g, "'").replace(/\“|\”/g, '"');
      // 将中括号【】转换成[]，将大括号｛｝转换成{}
      str = str
        .replace(/\【/g, "[")
        .replace(/\】/g, "]")
        .replace(/\｛/g, "{")
        .replace(/\｝/g, "}");
      // 将逗号，转换成,，将：转换成:
      str = str.replace(/，/g, ",").replace(/：/g, ":");
      return str;
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
    //获得当前页面
    getList() {
      getListForPage(this.form).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize + 2;
        this.pagination.total = res.body.total;
        this.total();
        let data = 1667291454000;
        //接口返回的毫秒数如果为string，需要转化为int

        //输出 dateTime：2018-09-20 20:00:00
        //方法体
        function getMyDate(str) {
          let oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime =
              oYear +
              "-" +
              addZero(oMonth) +
              "-" +
              addZero(oDay) +
              " " +
              addZero(oHour) +
              ":" +
              addZero(oMin) +
              ":" +
              addZero(oSen);
          return oTime;
        }
        //补零操作
        function addZero(num) {
          if (parseInt(num) < 10) {
            num = "0" + num;
          }
          return num;
        }

        this.dataSource.forEach((element) => {
          if (element.recordStatus == 1) {
            element.recordStatusName = "已保存";
          } else if (element.recordStatus == 2) {
            element.recordStatusName = "已提交";
          } else if (element.recordStatus == 3) {
            element.recordStatusName = "审批中";
          } else if (element.recordStatus == 4) {
            element.recordStatusName = "已审批";
          } else if (element.recordStatus == 5) {
            element.recordStatusName = "已拒绝";
          } else if (element.recordStatus == 6) {
            element.recordStatusName = "已完成";
          }
        });
      });
      this.selectedRowKeys = [];
    },
    // 合计
    total() {
      let gasFlowNm = 0;
      let gasFlowT = 0;
      let density = 0;
      this.dataSource.forEach((element, index) => {
        element.index =
          (this.pagination.current - 1) * (this.pagination.pageSize - 2) +
          index +
          1;
        gasFlowNm += new Number(element.gasFlowNm);
        gasFlowT += new Number(element.gasFlowT);
        density += new Number(element.density);
      });

      if (this.dataSource.length > 0) {
        density = (density / this.dataSource.length).toFixed(2);
      }

      let monthTotal = {
        id: "-999",
        index: "本页合计",
        gasFlowNm: gasFlowNm,
        gasFlowT: gasFlowT,
      };
      let meanValue = {
        id: "-1000",
        index: "均值",
        density: density,
      };
      this.dataSource.push(monthTotal);
      this.dataSource.push(meanValue);
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize - 2;
      this.getList();
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.startDate = [];
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    onChangeTradeFormData(date, dateString) {
      this.surfaceForm.dealStartTime = dateString[0];
      this.surfaceForm.dealEndTime = dateString[1];

      console.log("111", dateString);

      if (this.addNewModelConfig.title == "管道外输日报-新增") {
        const days = this.getDaysBetween(dateString[0], dateString[1]);
        if (days == 1) {
          let daily = {
            startTime: this.surfaceForm.dealStartTime,
            endTime: this.surfaceForm.dealEndTime,
          };
          // 根据数据获取交易凭证数据
          queryGasEveryDay(daily).then((res) => {
            let gasFlowNmTotal = 0;
            let gasFlowTTotal = 0;
            let pressureTotal = 0;
            for (let i = 0; i < res.body.length; i++) {
              if (res.body[i].gasFlowNm) {
              } else {
                res.body[i].gasFlowNm = "0";
              }
              if (res.body[i].gasFlowT) {
              } else {
                res.body[i].gasFlowT = "0";
              }
              if (res.body[i].pressure) {
              } else {
                res.body[i].pressure = "0";
              }
              gasFlowNmTotal += parseInt(res.body[i].gasFlowNm);
              gasFlowTTotal += parseInt(res.body[i].gasFlowT);
              pressureTotal += parseInt(res.body[i].pressure);
            }
            this.$set(this.surfaceForm, "gasFlowNm", gasFlowNmTotal);
            this.$set(this.surfaceForm, "gasFlowT", gasFlowTTotal);
            this.$set(this.surfaceForm, "pressure", pressureTotal);
            this.$forceUpdate();
          });

          let dayString = "";
          for (let index = 0; index < dateString.length; index++) {
            const element = dateString[index];
            if (index < dateString.length - 1) {
              dayString +=
                this.timePatternConvert(element) +
                "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0至\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
            } else {
              dayString += this.timePatternConvert(element);
            }
          }
          this.tradeFormData = dayString;
        } else {
          this.$message.error("开始日期和结束日期只能相差一天");
        }
      } else {
        let dayString = "";
        for (let index = 0; index < dateString.length; index++) {
          const element = dateString[index];
          if (index < dateString.length - 1) {
            dayString +=
              this.timePatternConvert(element) +
              "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0至\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
          } else {
            dayString += this.timePatternConvert(element);
          }
        }
        this.tradeFormData = dayString;
      }
    },
    getDaysBetween(startDate, enDate) {
      const sDate = Date.parse(startDate);
      const eDate = Date.parse(enDate);
      if (sDate > eDate) {
        return 0;
      }
      // 这个判断可以根据需求来确定是否需要加上
      if (sDate === eDate) {
        return 1;
      }
      const days = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },
    timePatternConvert(time) {
      let newTime;
      var str = time;
      var reg = /(\d{4})\-(\d{2})\-(\d{2})/;
      newTime = str.replace(reg, "$1年$2月$3日8:00");
      return newTime;
    },

    //设置合计行 均值行  多选框不可选择
    getCheckboxProps: (record) => ({
      props: {
        disabled:
          record.index === "本页合计" ||
          record.index === "均值" ||
          (record.recordStatus !== "1" && record.recordStatus !== "5"),
        name: record.name,
      },
    }),
    //合计行  平均值行加背景颜色
    rowStyle(record) {
      if (record.index == "本页合计" || record.index == "均值") {
        return {
          style: {
            "background-color": "#eeeeee",
          },
        };
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

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
.table_form {
  border-bottom-width: 0px;
  tr {
    th {
      text-align: center;
    }
  }
  .tr_remark {
    border-bottom-width: 0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
  }
}
.table_footer {
  border-top: none;
}
td {
  position: relative;
}
.td_range_picker {
  position: absolute;
  left: 0;
  top: 0;
  ::v-deep .ant-calendar-picker-input.ant-input {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
}
.hide {
  /deep/.anticon svg {
    display: none;
  }
}
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}
</style>
