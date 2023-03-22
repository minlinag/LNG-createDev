<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          { value: 'Add', isPower: false, clickName: 'libraryDataAdd' },
          { value: 'Delete', isPower: false, clickName: 'confirm' },
        ]"
        @libraryDataAdd="addNew"
        @confirm="mydelete"
      >
      </pe-button>
    </template>

    <template slot="appMain">
      <div
        id="components-layout-demo-basic"
        class="appMainForm"
        style="width: 100%; position: relative"
      >
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="7">
                <a-form-model-item label="计划时间：">
                  <div style="display: flex">
                    <a-date-picker
                      mode="year"
                      placeholder="请选择年份"
                      format="YYYY"
                      valueFormat="YYYY"
                      v-model="dateStart"
                      :open="yearShowOne"
                      @openChange="openChangeOne"
                      @panelChange="panelChangeOne"
                      style="width: 70%"
                    />
                    <span style="margin-left: 0.5rem; margin-right: 0.5rem">
                      至
                    </span>
                    <a-date-picker
                      mode="year"
                      placeholder="请选择年份"
                      format="YYYY"
                      valueFormat="YYYY"
                      v-model="dateEnd"
                      :open="yearShowOne1"
                      @openChange="openChangeOne1"
                      @panelChange="panelChangeOne1"
                      style="width: 70%"
                    />
                  </div>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="编制人">
                  <a-input
                    placeholder="请输入编制人"
                    v-model="form.createdUser"
                  ></a-input>
                </a-form-model-item>
              </a-col>

              <a-col :span="6">
                <a-form-model-item label="状态:">
                  <a-select
                    :getPopupContainer="getPopupContainer"
                    v-model="form.status"
                    show-search
                    placeholder="请选择状态"
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
              <div style="float: right">
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
                  </a-button></a-form-model-item
                >
              </div>
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <a-table
        @change="paginationChange"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        rowKey="id"
        :pagination="pagination"
        :scroll="{ y: 1, x: 100 }"
        class="list_table_1"
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
                disabled: $audit.editDisabledProduction(
                  row.status,
                  row.createdUserId
                ),
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
        v-model="visibleAddNew"
        width="80vw"
        :modelConfig="addNewModelConfig"
        class="yearProductionOperation DcModel"
        @input="handleCancel"
      >
        <a-form-model
          :model="AnnualData"
          ref="securityCheckFormRef"
          :rules="securityCheckFormRules"
        >
          <a-layout>
            <a-layout-content id="addContent">
              <div>
                <a-divider orientation="left" style="font-weight: bolder">
                  基础信息
                </a-divider>
                <a-row>
                  <a-col :span="8">
                    <a-form-model-item
                      label="编制日期:"
                      :labelCol="{ style: 'width: 150px' }"
                    >
                      <a-date-picker
                        style="width: 100%"
                        disabled
                        v-model="AnnualData.createdDateTime"
                        valueFormat="YYYY-MM-DD"
                        @change="onChange"
                        placeholder="请选择日期"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="编制人："
                      :labelCol="{ style: 'width: 150px' }"
                      prop="createdUser"
                    >
                      <a-input
                        disabled
                        v-model="AnnualData.createdUser"
                        placeholder="请输入编制人："
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="编制部门"
                      prop="createUserSubsidiaryOrgan"
                    >
                      <a-input
                        disabled
                        v-model="AnnualData.createUserSubsidiaryOrgan"
                        placeholder="请输入编制部门"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-model-item
                      label="计划年度："
                      :labelCol="{ style: 'width: 150px' }"
                      prop="planTime"
                    >
                      <a-date-picker
                        :disabled="details"
                        mode="year"
                        placeholder="请选择年份"
                        format="YYYY"
                        valueFormat="YYYY"
                        v-model="AnnualDataPanTime"
                        :open="yearShowPanTime"
                        @openChange="openChangePanTime"
                        @panelChange="panelChangePanTime"
                      />
                      <!-- <a-input
                        :disabled="details"
                        v-model="AnnualDataPanTime"
                        placeholder="请输入计划年度"
                      /> -->
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
              <div>
                <a-divider orientation="left" style="font-weight: bolder">
                  年度外输利润考核指标
                </a-divider>

                <a-row>
                  <a-col :span="12">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 130px' }"
                      label="气化外输量："
                      prop="gasExportVolume"
                    >
                      <div style="display: flex; margin-top: 0.3rem">
                        <a-input
                          style="width: 90%"
                          @change="calculation2"
                          @input="blurgasExportVolume"
                          :disabled="details"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                          v-model="AnnualData.gasExportVolume"
                          placeholder="请输入气化外输量"
                          addon-after="万方"
                        />
                        <a-input
                          style="width: 90%"
                          @change="calculation2"
                          @input="blurgasExportVolumes"
                          :disabled="details"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                          v-model="AnnualData.gasExportVolumes"
                          placeholder="请输入气化外输量"
                          addon-after="万吨"
                        />
                      </div>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 230px' }"
                      label="槽车外输量："
                      prop="tankCarExportVolume"
                    >
                      <div style="display: flex; margin-top: 0.3rem">
                        <a-input
                          style="width: 90%"
                          @change="calculation2"
                          @input="blurtankCarExportVolume"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                          :disabled="details"
                          v-model="AnnualData.tankCarExportVolume"
                          placeholder="请输入槽车外输量"
                          addon-after="万方"
                        />
                        <a-input
                          style="width: 90%"
                          @change="calculation2"
                          @input="blurtankCarExportVolumes"
                          :disabled="details"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                          v-model="AnnualData.tankCarExportVolumes"
                          placeholder="请输入槽车外输量"
                          addon-after="万吨"
                        />
                      </div>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 150px' }"
                      label="装船(预留)："
                      prop="shipLoad"
                    >
                      <div style="display: flex; margin-top: 0.3rem">
                        <a-input
                          @change="calculation2"
                          @input="blurshipLoad"
                          :disabled="details"
                          v-model="AnnualData.shipLoad"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                          placeholder="请输入装船"
                          addon-after="万方"
                        />
                        <a-input
                          @change="calculation2"
                          @input="blurshipLoads"
                          :disabled="details"
                          v-model="AnnualData.shipLoads"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                          placeholder="请输入装船"
                          addon-after="万吨"
                        />
                      </div>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item
                      :labelCol="{ style: 'width: 230px' }"
                      label="计划外输量："
                      prop="planExportVolume"
                    >
                      <div style="display: flex; margin-top: 0.3rem">
                        <a-input
                          style="width: 98%"
                          disabled
                          v-model="AnnualData.planExportVolume"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                          placeholder="计划外输总量"
                          addon-after="万方"
                        />
                        <a-input
                          style="width: 98%"
                          disabled
                          v-model="AnnualData.planExportVolumes"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\D*(\d{1,12}(?:\.\d{0,3})?).*$/g, '$1')"
                          placeholder="计划外输总量"
                          addon-after="万吨"
                        />
                      </div>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
              <div>
                <a-divider orientation="left" style="font-weight: bolder">
                  年度外输计划表
                </a-divider>

                <div style="display: flex">
                  <p>年度计划外输总量（万方）：</p>
                  <a-input
                    disabled
                    v-model="AnnualData.totalData"
                    placeholder="年度计划外输总量"
                    style="width: 13vw; position: relative; top: -5px"
                  ></a-input>
                </div>

                <div class="wrapper" :model="surfaceForm">
                  <table class="table_list" width="100%" border="1">
                    <tr
                      align="center"
                      style="
                        background: #eeeeee;
                        height: 40px;
                        border: 1px solid;
                      "
                    >
                      <td style="border-right: 1px solid">月份</td>
                      <td style="border-right: 1px solid">
                        平均每日外输量（万方）
                      </td>
                      <td style="border-right: 1px solid">
                        气化外输量（万方）
                      </td>
                      <td style="border-right: 1px solid">
                        平均每日装车量（万方）
                      </td>

                      <td style="border-right: 1px solid">
                        槽车装车量（万方）
                      </td>
                      <td style="width: 6rem">装船（预留）</td>
                    </tr>
                    <tr
                      class="input"
                      v-for="(item, index) in yeardata"
                      :key="index"
                      :class="{ grey: index % 2 == 0 }"
                    >
                      <td v-if="index != 13">
                        {{ item.planMonth2 }}
                      </td>
                      <td v-if="index != 13">
                        <span v-if="item.dayAvgExportVolume">{{
                          item.dayAvgExportVolume
                        }}</span>
                        <span v-else>--</span>
                      </td>
                      <td v-if="index != 13">
                        <a-input
                          :disabled="details"
                          v-if="index >= '12' == false"
                          v-model="item.gasExportVolume"
                          placeholder="请输入值"
                          @change="calculation()"
                          oninput="value=value.replace(/[^0-9.]/g,'')"
                        />
                        <!-- /^\d+.?\d{0,6}$/ -->
                        <span v-if="(index == '12') == true">{{
                          item.gasExportVolume
                        }}</span>
                      </td>

                      <td v-if="index != 13">
                        <span v-if="item.dayAvgCarVolume">{{
                          item.dayAvgCarVolume
                        }}</span>
                        <span v-else>--</span>
                      </td>

                      <td v-if="index != 13">
                        <a-input
                          :disabled="details"
                          v-if="index >= '12' == false"
                          @change="calculation()"
                          v-model="item.tankCarExportVolume"
                          oninput="value=value.replace(/[^0-9.]/g,'')"
                          placeholder="请输入值"
                        />
                        <span v-if="(index == '12') == true">{{
                          item.tankCarExportVolume
                        }}</span>
                      </td>
                      <td v-if="index != 13">
                        <a-input
                          :disabled="details"
                          v-if="index >= '12' == false"
                          @change="calculation()"
                          v-model="item.shipLoad"
                          placeholder="请输入值"
                          oninput="value=value.replace(/[^0-9.]/g,'')"
                        />
                        <span v-if="(index == '12') == true">{{
                          item.shipLoad
                        }}</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <a-divider orientation="left" style="font-weight: bolder"
                  >接船计划</a-divider
                >
                <a-table
                  rowKey="id"
                  :scroll="{ x: 100 }"
                  :columns="ship"
                  :openSelector="true"
                  :dataSource="dataSourceShip"
                  :pagination="false"
                >
                </a-table>
              </div>

              <a-divider orientation="left" style="font-weight: bolder"
                >年度生产运行计划方案
              </a-divider>
              <file-upload
                :Text="'上传文件'"
                @fileChange="fileListChange"
                :echoList="flieChanges"
                ref="importConpontsDataRef"
                :disabled="pageType == 'look' || pageType == 'approval'"
                :fileQuantity="1"
                :fileType="'pdf'"
                :accept="'.pdf'"
                :fileBack="false"
              ></file-upload>
              <reviewPDF
                @allow="allowChange"
                :echoList="flieChanges"
                v-if="visibleAddNew && flieChanges.length > 0"
              ></reviewPDF>
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
              <a-button type="primary" @click="saveList" v-if="preservationBC">
                保存
              </a-button>
              <a-button
                v-Add
                v-if="pageType == 'add' || pageType == 'edit'"
                class="buttonType"
                type="primary"
                @click.stop="saveList('sunmit')"
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
              <a-button @click="handleCancel"> 取消 </a-button>
            </a-layout-footer>
          </a-layout>
        </a-form-model>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  pageList,
  deleteBatchForYear,
  saveForAddOrUpdate,
  queryDetailById,
  queryFileByRelatedId,
  queryCqjhByYear,
  monthPlanAudio,
  submitForAddOrUpdate,
} from "@/api/dispatchingManagement/yearProductionOperation";

import fileUpload from "@/components/upLoad/fileUpload";
import reviewPDF from "@/components/reviewPDF/index.vue";

import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  components: {
    fileUpload,
    stepsModel,
    reviewPDF,
  },
  data() {
    let vgasExportVolume = (rule, value, callback) => {
      const reg = /^\d+.?\d{0,6}$/;
      if (!value) {
        callback(new Error("请输入值"));
      } else if (!Number(value)) {
        callback(new Error("请输入数字值"));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("小数点后最多只能输入六位"));
        }
      }
    };
    let vshipLoad = (rule, value, callback) => {
      const reg = /^\d+.?\d{0,6}$/;
      if (!value) {
        callback();
      } else if (!Number(value)) {
        callback(new Error("请输入数字值"));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("小数点后最多只能输入六位"));
        }
      }
    };
    let vplanTime = (rule, value, callback) => {
      console.log(222,value);
      if (!value) {
        callback(new Error("请输入年份"));
      } else {
        if (new Date(value).getFullYear() >= new Date().getFullYear()) {
          if (this.pageType != "add") {
            callback();
          } else {
            let row = this.dataSource.filter(
              (item) => Number(item.planTime) == new Date(value).getFullYear()
            );
            console.log("....",row);
            if (row.length > 0) {
              callback(new Error("已存在当前年份"));
            } else {
              callback();
            }
          }
        } else {
          callback(new Error("请输入大于或等于今年的年份"));
        }
      }
    };
    return {
      IDs: "",
      ChangeAnnualDataPanTimeShow: true,
      AnnualDataPanTime: "",
      dateStart: "",
      dateEnd: "",
      pageType: "",
      yearShowPanTime: false,
      yearShowOne: false,
      yearShowOne1: false,
      preservationBC: false,
      SubmitTJ: false,
      details: false,
      AnnualData: {},
      securityCheckFormRules: {
        planTime: [
          {
            validator: vplanTime,
            required: true,
            trigger: "change",
          },
        ],
        gasExportVolume: [
          {
            validator: vgasExportVolume,
            required: true,
            trigger: "blur",
          },
        ],
        tankCarExportVolume: [
          { validator: vgasExportVolume, required: true, trigger: "blur" },
        ],
        shipLoad: [{ validator: vshipLoad, trigger: "blur" }],
      },
      surfaceForm: [],
      //新增是否visible
      visibleAddNew: false,
      //查看是否visible
      addNewModelConfig: {
        width: "950px",
        title: "年度生产运行计划",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      echoMap: {},
      form: {
        pageIndex: 1,
        pageSize: 10,
        recordType: 1,
      },
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
          label: "审批中",
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
          title: "计划年度",
          dataIndex: "planTime",
          width: 100,
          align: "center",
          ellipsis: true,
        },

        {
          title: "计划外输量(万方)",
          dataIndex: "planExportVolume",
          width: 130,
          align: "center",
          ellipsis: true,
        },
        {
          title: "气化外输量(万方)",
          dataIndex: "gasExportVolume",
          width: 130,
          align: "center",
          ellipsis: true,
        },
        {
          title: "槽车装车量(万方)",
          dataIndex: "tankCarExportVolume",
          width: 150,
          align: "center",
          ellipsis: true,
        },
        {
          title: "卸货量(万方)",
          dataIndex: "unloadVolume",
          width: 150,
          align: "center",
          ellipsis: true,
        },
        {
          title: "装船(预留)",
          dataIndex: "shipLoad",
          width: 200,
          align: "center",
          ellipsis: true,
        },
        {
          title: "编制人",
          dataIndex: "createdUser",
          width: 100,
          align: "center",
          ellipsis: true,
        },
        {
          title: "编制时间",
          dataIndex: "createdDateTime",
          width: 150,
          align: "center",
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "statusName",
          width: 100,
          align: "center",
          fixed: "right",
          ellipsis: true,
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
      //保存按钮加载状态控制
      savaIconLoading: false,
      //回传组件
      echoMap: {},
      echoMap2: {},
      echoMap3: {},
      //页面下方表格的列属性
      year: [
        {
          title: "月份",
          dataIndex: "planMonth",
          // width: 140,
        },
        {
          title: "平均每日外输量(万方)",
          dataIndex: "dayAvgExportVolume",
          // width: 100,
        },
        {
          title: "气化外输量(万方)",
          dataIndex: "gasExportVolume",
          // width: 100,
        },
        {
          title: "槽车装车量(万方)",
          dataIndex: "tankCarExportVolume",
          // width: 150,
        },
        {
          title: "装船(预留)",
          dataIndex: "shipLoad",
          width: 200,
        },
      ],
      yeardata: [],
      ship: [
        {
          title: "月份",
          dataIndex: "month",
          width: 115,
          align: "center",
        },
        {
          title: "1月",
          dataIndex: "one",
          align: "center",
        },
        {
          title: "2月",
          dataIndex: "two",
          align: "center",
        },
        {
          title: "3月",
          dataIndex: "three",
          align: "center",
        },
        {
          title: "4月",
          dataIndex: "four",
          align: "center",
        },
        {
          title: "5月",
          dataIndex: "five",
          align: "center",
        },
        {
          title: "6月",
          dataIndex: "six",
          align: "center",
        },
        {
          title: "7月",
          dataIndex: "seven",
          align: "center",
        },
        {
          title: "8月",
          dataIndex: "eight",
          align: "center",
        },
        {
          title: "9月",
          dataIndex: "nine",
          align: "center",
        },
        {
          title: "10月",
          dataIndex: "ten",
          align: "center",
        },
        {
          title: "11月",
          dataIndex: "eleven",
          align: "center",
        },
        {
          title: "12月",
          dataIndex: "twelve",
          align: "center",
        },
        {
          title: "合计",
          dataIndex: "total",
          align: "center",
        },
      ],
      dataSourceShip: [],
      //表格中的数据
      dataSource: [],
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
          {
            type: "otherTypes", //组件类型 目前指出             其他类型（otherTypes 需要配合插槽使用） || 按钮类型（btn）
            label: "设备名称", //展示名称
            slotScoped: "upload", //插槽
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
            label: "取消",
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
            type: "input", //组件类型 目前指出 input || select
            label: "计划年度", //展示名称
            formKey: "planTime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入计划年度", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: [
                {
                  required: true,
                  message: "请输入计划年度",
                  trigger: "blur",
                },
                {
                  validator: (rule, value, callback) => {
                    const reg = /^\d{4}$/g;
                    if (reg.test(value)) {
                      return callback();
                    } else {
                      return callback(new Error("请输入正确的年份"));
                    }
                  },
                  trigger: "change",
                },
              ], //校验规则
            },
            colSpan: 12,
          },
          // {
          //   type: "dateMonthPicker", //组件类型 目前指出 input || select
          //   label: "计划年度", //展示名称
          //   colSpan: 8,
          //   // monent:'value',
          //   format: "YYYY-MM",
          //   formKey: "planTime", //form 定义的 key (必须唯一 || 必须传入)
          //   value: "", // 默认值为空字符串 // v-model 绑定值
          //   placeholder: "请输入", //输入框为空值的时候展示内容
          //   disabled: false, //是否禁用 true 是禁用 默认是false
          //   labelStyle: { style: { width: "160px", height: "60px" } }, //组件样式 form-item
          //   options: {
          //     // 暂时开发状态
          //     // multiple: true,
          //     vDecorator: {
          //       required: true,
          //       message: "请选择日期",
          //       // trigger: "blur",
          //     }, //校验规则
          //   },
          //   colSpan: 12,
          // },
          {
            type: "datePicker", //组件类型 目前指出 input || select
            label: "编制时间", //展示名称
            colSpan: 8,
            // monent:'value',
            format: "YYYY-MM-DD",
            formKey: "createdDateTime", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入", //输入框为空值的时候展示内容
            disabled: true, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "160px", height: "60px" } }, //组件样式 form-item
            options: {},
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
            label: "年度外输例如考核指标", //展示名称
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
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入计划外输量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "气化外输量(万方)", //展示名称
            formKey: "gasExportVolume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入气化外输量", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入气化外输量",
                trigger: "blur",
              }, //校验规则
            },
            colSpan: 12,
          },
          {
            type: "input", //组件类型 目前指出 input || select
            label: "槽车外输量(万方)", //展示名称
            formKey: "tankCarExportVolume", //form 定义的 key (必须唯一 || 必须传入)
            value: "", // 默认值为空字符串 // v-model 绑定值
            placeholder: "请输入槽车外输量", //输入框为空值的时候展示内容
            disabled: false, //是否禁用 true 是禁用 默认是false
            labelStyle: { style: { width: "150px" } }, //组件样式 form-item
            options: {
              // 配置参数
              vDecorator: {
                required: true,
                message: "请输入槽车外输量",
                trigger: "blur",
              }, //校验规则
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
          {
            type: "card", //组件类型 目前指出 input || select
            label: "年度外输计划表", //展示名称
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
        ],
      },
      addNewConfig2: {
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: "接船计划", //展示名称
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
        ],
      },
      addNewConfig4: {
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: "年度生产运行计划方案", //展示名称
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
        ],
      },
      addNewConfig3: {
        formDataList: [
          {
            type: "card", //组件类型 目前指出 input || select
            label: "年度生产运行计划方案", //展示名称
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
        ],
      },
      flieChanges: [],
      B: [],
      isApprove: false,
    };
  },
  mounted() {
    this.getList();
  },
  watch: {
    dateEnd(val) {
      this.form.dateEnd = new Date(val).getFullYear();
    },
    dateStart(val) {
      this.form.dateStart = new Date(val).getFullYear();
    },
    AnnualDataPanTime(val) {
      this.AnnualData.planTime = val;
      console.log("this.AnnualData.planTime", val);
    },
  },
  methods: {
    ChangeAnnualDataPanTime(e) {
       console.log("e)",new Date(e).getFullYear())
      let row = this.dataSource.filter(
        (item) => Number(item.planTime) == new Date(e).getFullYear()
      );
      if (row.length > 0) {
        this.ChangeAnnualDataPanTimeShow = false;
        this.$message.warning("已存在当前年份");
      } else {
        this.ChangeAnnualDataPanTimeShow = true;
      }
    },
    // 提交
    CSubmit(id, createdDateTimes) {
      this.AnnualData.planTime = new Date(
        this.AnnualData.planTime
      ).getFullYear();
      this.AnnualData.recordType = 1;
      this.AnnualData.id = id ? id : this.AnnualData.id;
      this.AnnualData.createdDateTime = createdDateTimes
        ? createdDateTimes
        : this.AnnualData.createdDateTime;
      submitForAddOrUpdate(this.AnnualData).then((res) => {
        if (res.code == "200") {
          this.$message.success("提交成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("提交失败");
        }
      });
    },
    // 审批
    approvalCommit() {
      if (!this.isApprove) {
        this.$message.warning("请先浏览完审批pdf文件");
        return false;
      }
      let params = {
        id: this.AnnualData.id,
        type: this.$refs.stepsModel.form.type,
        opinion: this.$refs.stepsModel.form.opinion,
      };
      monthPlanAudio(params).then((res) => {
        if (res.body == "true") {
          this.$message.success("审批成功");
          this.handleCancel();
          this.getList();
        } else {
          this.$message.warning("审批失败");
        }
      });
    },
    handleCancel() {
      this.yearShowOne = false;
      this.yearShowPanTime = false;
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      this.visibleAddNew = false;
      this.$refs.securityCheckFormRef.clearValidate();

      this.$nextTick(() => {
        this.IDs = "";
        let dom = document.getElementById("addContent");
        if (dom !== null) {
          dom.scrollTop = 0;
        }
      });
    },
    // 弹出日历和关闭日历的回调
    openChangeOne(status) {
      if (status) {
        this.yearShowOne = true;
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      this.dateStart = value;
      this.yearShowOne = false;
    },
    openChangePanTime(status) {
      if (status) {
        this.yearShowPanTime = true;
      }
    },
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    panelChangePanTime(value) {
      console.log("----", value);
      this.AnnualDataPanTime = value;
      this.yearShowPanTime = false;
      this.ChangeAnnualDataPanTime(value);
    },
    openChangeOne1(status) {
      if (status) {
        this.yearShowOne1 = true;
      }
    },
    panelChangeOne1(value) {
      if (value < this.dateStart) {
        this.$message.warning("结束时间不能大于开始时间");
      } else {
        this.dateEnd = value;
      }

      this.yearShowOne1 = false;
    },
    //气化外输量
    blurgasExportVolume() {
      let num = new Number(this.AnnualData.gasExportVolume) / 1400;
      this.AnnualData.gasExportVolumes = num.toFixed(4);
    },
    blurgasExportVolumes() {
      this.AnnualData.gasExportVolume = Math.round(
        new Number(this.AnnualData.gasExportVolumes) * 1400
      );
    },
    // 槽车外输量
    blurtankCarExportVolume() {
      let num = new Number(this.AnnualData.gasExportVolume) / 1400;
      this.AnnualData.tankCarExportVolumes = num.toFixed(4);
    },
    blurtankCarExportVolumes() {
      this.AnnualData.tankCarExportVolume = Math.round(
        new Number(this.AnnualData.tankCarExportVolumes) * 1400
      );
    },
    //装船
    blurshipLoad() {
      let num = new Number(this.AnnualData.shipLoad) / 1400;
      this.AnnualData.shipLoads = num.toFixed(4);
    },
    blurshipLoads() {
      this.AnnualData.shipLoad = Math.round(
        new Number(this.AnnualData.shipLoads) * 1400
      );
    },

    // 计划外输量计算
    calculation2() {
      // AnnualData.shipLoad
      // tankCarExportVolume
      // gasExportVolume

      let A = 0;
      if (this.AnnualData.shipLoad) {
        A += new Number(this.AnnualData.shipLoad);
      }
      if (this.AnnualData.tankCarExportVolume) {
        A += new Number(this.AnnualData.tankCarExportVolume);
      }
      if (this.AnnualData.gasExportVolume) {
        A += new Number(this.AnnualData.gasExportVolume);
      }
      this.AnnualData.planExportVolume = A;

      let nums12 = A / 1400;
      this.AnnualData.planExportVolumes = nums12.toFixed(4);
    },
    // 年度外输计划表计算
    calculation() {
      let fullYear = new Date(this.AnnualData.planTime).getFullYear(); //获取计划年份
      let totalPrice = 0;
      let totalPrice2 = 0;
      let totalPrice3 = 0;
      for (let i = 0; i < this.yeardata.length; i++) {
        if (i < 12) {
          if (
            this.yeardata[i].gasExportVolume ||
            this.yeardata[i].tankCarExportVolume ||
            this.yeardata[i].shipLoad
          ) {
            let total =
              parseInt(
                !this.yeardata[i].tankCarExportVolume
                  ? 0
                  : this.yeardata[i].tankCarExportVolume
              ) +
              parseInt(
                !this.yeardata[i].shipLoad ? 0 : this.yeardata[i].shipLoad
              );

            var endOfMonth = new Date(fullYear, i + 1, 0).getDate(); // 获取本月最后一天

            this.yeardata[i].dayAvgExportVolume = parseFloat(
              parseInt(
                !this.yeardata[i].gasExportVolume
                  ? 0
                  : this.yeardata[i].gasExportVolume
              ) / endOfMonth
            ).toFixed(2); //保留后两位   平均每日外输量

            if (total) {
              this.yeardata[i].dayAvgCarVolume = parseFloat(
                parseInt(!total ? 0 : total) / endOfMonth
              ).toFixed(2); //保留后两位   平均每日装车量
            }
          } else {
            if (
              !this.yeardata[i].gasExportVolume &&
              !this.yeardata[i].tankCarExportVolume &&
              !this.yeardata[i].shipLoad
            ) {
              this.yeardata[i].dayAvgExportVolume = "";
            }
          }
          // 小计的计算
          // if (this.yeardata[i].gasExportVolume) {
          totalPrice += new Number(this.yeardata[i].gasExportVolume);
          this.yeardata[12].gasExportVolume = parseFloat(totalPrice).toFixed(2); //保留后两位
          // }
          // if (this.yeardata[i].tankCarExportVolume) {
          totalPrice2 += new Number(this.yeardata[i].tankCarExportVolume);
          this.yeardata[12].tankCarExportVolume =
            parseFloat(totalPrice2).toFixed(2); //保留后两位
          // }
          // if (this.yeardata[i].shipLoad) {
          totalPrice3 += new Number(this.yeardata[i].shipLoad);
          this.yeardata[12].shipLoad = parseFloat(totalPrice3).toFixed(2); //保留后两位
          // }
          // if (
          //   this.yeardata[12].gasExportVolume &&
          //   this.yeardata[12].tankCarExportVolume &&
          //   this.yeardata[12].shipLoad
          // ) {
          this.AnnualData.totalData = parseFloat(
            parseInt(this.yeardata[12].gasExportVolume) +
              parseInt(this.yeardata[12].tankCarExportVolume) +
              parseInt(this.yeardata[12].shipLoad)
          ).toFixed(2);
          this.yeardata[13].gasExportVolume = parseFloat(
            parseInt(this.yeardata[12].gasExportVolume) +
              parseInt(this.yeardata[12].tankCarExportVolume) +
              parseInt(this.yeardata[12].shipLoad)
          ).toFixed(2);
          // }
        }
      }
    },
    brokenChart() {
      //获取id并初始化图表
      var myChart = this.$echarts.init(
        document.getElementById("foldBreadChart")
      );
      // });
      //配置项
      let option = {
        tooltip: {
          //鼠标触摸显示值
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: [
            "1月2日",
            "2月2日",
            "3月2日",
            "4月2日",
            "5月2日",
            "6月2日",
            "7月2日",
            "8月2日",
            "9月2日",
            "10月2日",
            "11月2日",
            "12月2日",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      };
      myChart.setOption(option); //通过setOption()方法生成图表
      window.addEventListener("resize", function () {
        myChart.resize(); //图表自适应的一个方法
      });
    },
    //点击表格中审批按钮
    approvalClick(val) {
      this.look(val);
      this.isApprove = false;
      this.pageType = "approval";
    },
    addNew() {
      this.pageType = "add";
      this.AnnualData = {};
      this.echoMap = {};
      this.AnnualData.createdUser = this.$store.state.user.name;
      this.AnnualData.createUserSubsidiaryOrgan =
        this.$store.state.user.unitName;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      this.AnnualData.createdDateTime = yy + "-" + mm + "-" + dd;
      // 2023-01-12 17:07:01
      this.$forceUpdate();
      this.preservationBC = true;
      this.details = false;
      this.flieChanges = [];
      this.ApprovalLC = false;
      this.SubmitTJ = false;
      this.addNewModelConfig.title = "年度生产运行计划-新增";

      let time = yy + 1 + "/" + mm + "/" + dd;
      this.AnnualDataPanTime = new Date(
        time.replace(/-/g, "/").replace("T", " ")
      ).toISOString();

      this.visibleAddNew = true;
      this.addNewConfig.formDataList.forEach((element) => {
        if (
          element.label == "编制时间" ||
          element.label == "编制部门" ||
          element.label == "编制人"
        ) {
          element.disabled = true;
        } else {
          element.disabled = false;
        }
      });
      this.yeardata = [
        {
          planMonth: "01",
          planMonth2: "1月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "02",
          planMonth2: "2月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "03",
          planMonth2: "3月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "04",
          planMonth2: "4月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "05",
          planMonth2: "5月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "06",
          planMonth2: "6月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "07",
          planMonth2: "7月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "08",
          planMonth2: "8月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "09",
          planMonth2: "9月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "10",
          planMonth2: "10月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "11",
          planMonth2: "11月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "12",
          planMonth2: "12月",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "小计",
          planMonth2: "小计",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
        {
          planMonth: "合计",
          planMonth2: "合计",
          dayAvgExportVolume: "",
          gasExportVolume: "",
          tankCarExportVolume: "",
          shipLoad: "",
        },
      ];
      this.dataSourceShip = [];
      this.addNewConfig.otherConfigurations[3].disabled = false;
      //重置里面的value，清零
      this.addNewConfig.formDataList.forEach(
        (item) => (item.value = undefined)
      );
    },
    edit(value) {
      this.pageType = "edit";
      this.preservationBC = true;
      this.details = false;
      this.ShipReceivingPlan(value.planTime);
      this.ApprovalLC = false;
      this.SubmitTJ = true;
      let obj2 = JSON.parse(JSON.stringify(value));
      this.AnnualData = obj2;

      if (obj2.fileInfo.indexOf("“") > 0) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      } else {
        if (obj2.fileInfo) {
          this.flieChanges = JSON.parse(obj2.fileInfo);
        }
      }

      this.addNewModelConfig.title = "年度生产运行计划-编辑";

      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();

      let time = this.AnnualData.planTime + "/" + mm + "/" + dd;
      this.AnnualDataPanTime = new Date(
        time.replace(/-/g, "/").replace("T", " ")
      ).toISOString();
      this.addNewConfig.formDataList.forEach((element) => {
        if (
          element.label == "编制时间" ||
          element.label == "编制部门" ||
          element.label == "编制人"
        ) {
          element.disabled = true;
        } else {
          element.disabled = false;
        }
      });
      this.addNewConfig.otherConfigurations[3].disabled = false;
      this.visibleAddNew = true;
      this.echoMap = value;
      let type = {
        id: value.id,
        type: value.recordType,
      };
      let id = {
        relatedId: value.id,
      };
      queryDetailById(type).then((res) => {
        this.yeardata = res.body.yearPlanList;
        this.yeardata[0].planMonth2 = "1月";
        this.yeardata[1].planMonth2 = "2月";
        this.yeardata[2].planMonth2 = "3月";
        this.yeardata[3].planMonth2 = "4月";
        this.yeardata[4].planMonth2 = "5月";
        this.yeardata[5].planMonth2 = "6月";
        this.yeardata[6].planMonth2 = "7月";
        this.yeardata[7].planMonth2 = "8月";
        this.yeardata[8].planMonth2 = "9月";
        this.yeardata[9].planMonth2 = "10月";
        this.yeardata[10].planMonth2 = "11月";
        this.yeardata[11].planMonth2 = "12月";
        this.yeardata[12].planMonth2 = "小计";
        this.AnnualData.totalData = res.body.yearPlanList[13].gasExportVolume;
      });
    },
    look(value) {
      this.pageType = "look";
      this.preservationBC = false;
      this.details = true;
      this.ShipReceivingPlan(value.planTime);
      this.ApprovalLC = false;
      this.SubmitTJ = false;
      this.addNewModelConfig.title = "年度生产运行计划-详情";
      this.visibleAddNew = true;
      let obj2 = JSON.parse(JSON.stringify(value));

      if (obj2.fileInfo.indexOf("“") > 0) {
        this.flieChanges = JSON.parse(
          this.chineseChar2englishChar(obj2.fileInfo)
        );
      } else {
        if (obj2.fileInfo) {
          this.flieChanges = JSON.parse(obj2.fileInfo);
        }
      }

      this.$nextTick(() => {
        this.IDs = obj2.id;
      });
      this.AnnualData = obj2;

      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();

      let time = this.AnnualData.planTime + "/" + mm + "/" + dd;
      this.AnnualDataPanTime = new Date(
        time.replace(/-/g, "/").replace("T", " ")
      ).toISOString();

      this.addNewConfig.formDataList.forEach((element) => {
        element.disabled = true;
      });
      let type = {
        id: value.id,
        type: value.recordType,
      };
      let id = {
        relatedId: value.id,
      };
      queryDetailById(type).then((res) => {
        this.yeardata = res.body.yearPlanList;
        // dayAvgCarVolume
        this.yeardata[0].planMonth2 = "1月";
        this.yeardata[1].planMonth2 = "2月";
        this.yeardata[2].planMonth2 = "3月";
        this.yeardata[3].planMonth2 = "4月";
        this.yeardata[4].planMonth2 = "5月";
        this.yeardata[5].planMonth2 = "6月";
        this.yeardata[6].planMonth2 = "7月";
        this.yeardata[7].planMonth2 = "8月";
        this.yeardata[8].planMonth2 = "9月";
        this.yeardata[9].planMonth2 = "10月";
        this.yeardata[10].planMonth2 = "11月";
        this.yeardata[11].planMonth2 = "12月";
        this.yeardata[12].planMonth2 = "小计";
        this.AnnualData.totalData = res.body.yearPlanList[13].gasExportVolume;
      });
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
    // 删除
    mydelete() {
      deleteBatchForYear(this.selectedRowKeys).then((res) => {
        this.$message.success("删除成功");
        this.getList();
      });
    },
    formDataFun(typpes) {
      var formData = new FormData();
      formData.append("recordType", 1); //类型1：年度2：月度

      formData.append(
        "planTime",
        new Date(this.AnnualData.planTime).getFullYear()
      );
      formData.append(
        "planExportVolume",
        !this.AnnualData.planExportVolume
          ? ""
          : this.AnnualData.planExportVolume
      );
      formData.append("gasExportVolume", this.AnnualData.gasExportVolume);
      formData.append(
        "tankCarExportVolume",
        this.AnnualData.tankCarExportVolume
      );
      formData.append(
        "shipLoad",
        !this.AnnualData.shipLoad ? "" : this.AnnualData.shipLoad
      );
      if (this.dataSourceShip.length > 0) {
        formData.append(
          "unloadVolume",
          !this.dataSourceShip[0].total ? "" : this.dataSourceShip[0].total
        );
      }

      this.yeardata.forEach((item, i) => {
        formData.append(`yearPlanList[${i}].planMonth`, item.planMonth);
        item.dayAvgExportVolume = new Number(item.dayAvgExportVolume);
        formData.append(
          `yearPlanList[${i}].dayAvgExportVolume`,
          item.dayAvgExportVolume
        );
        item.gasExportVolume = new Number(item.gasExportVolume);
        formData.append(
          `yearPlanList[${i}].gasExportVolume`,
          item.gasExportVolume
        );

        if (item.dayAvgCarVolume) {
          item.dayAvgCarVolume = new Number(item.dayAvgCarVolume);
          formData.append(
            `yearPlanList[${i}].dayAvgCarVolume`,
            item.dayAvgCarVolume
          );
        } else {
          formData.append(`yearPlanList[${i}].dayAvgCarVolume`, 0);
        }

        item.tankCarExportVolume = new Number(item.tankCarExportVolume);
        formData.append(
          `yearPlanList[${i}].tankCarExportVolume`,
          item.tankCarExportVolume
        );
        item.shipLoad = new Number(item.shipLoad);
        formData.append(`yearPlanList[${i}].shipLoad`, item.shipLoad);
      });

      if (this.AnnualData.id) {
        formData.append("id", this.AnnualData.id);
        this.yeardata.forEach((item, i) => {
          formData.append(`yearPlanList[${i}].id`, item.id);
        });
      }

      let flielist = [];
      this.flieChanges.forEach((element) => {
        let row = { id: element.id, fileName: element.fileName };
        flielist.push(row);
      });
      formData.append(`fileInfo`, JSON.stringify(flielist)); //附件

      if (flielist.length > 0) {
        return formData;
      } else {
        return "请选择附件";
      }
    },
    saveList(value) {
      if (this.ChangeAnnualDataPanTimeShow) {
        this.$refs.securityCheckFormRef.validate((valid) => {
          if (valid) {
            this.pageType = "save";
            this.savaIconLoading = true;
            let datas = this.formDataFun();
            if (datas == "请选择附件") {
              this.$message.error(datas);
            } else {
              if (this.AnnualData.id) {
                // 修改
                saveForAddOrUpdate(datas).then((res) => {
                  this.savaIconLoading = false;
                  if (res.code == 200) {
                    if (value == "sunmit") {
                      this.CSubmit();
                    } else {
                      this.$message.success("修改成功！");
                      this.getList();
                      this.handleCancel();
                    }
                  } else {
                    if (value == "sunmit") {
                      this.$message.error("提交失败！");
                    } else {
                      this.$message.error("修改失败！");
                    }
                  }
                });
              } else {
                // 新增
                saveForAddOrUpdate(datas).then((res) => {
                  this.savaIconLoading = false;
                  if (res.code == 200) {
                    if (value == "sunmit") {
                      let date = new Date();
                      let createdDateTimes = `${date.getFullYear()}-${
                        date.getMonth() + 1 < 10
                          ? `0${date.getMonth() + 1}`
                          : date.getMonth() + 1
                      }-${
                        date.getDate() < 10
                          ? `0${date.getDate()}`
                          : date.getDate()
                      } ${
                        date.getHours() < 10
                          ? `0${date.getHours()}`
                          : date.getHours()
                      }:${
                        date.getMinutes() < 10
                          ? `0${date.getMinutes()}`
                          : date.getMinutes()
                      }:${
                        date.getSeconds() < 10
                          ? `0${date.getSeconds()}`
                          : date.getSeconds()
                      }`;
                      this.CSubmit(res.body, createdDateTimes);
                    } else {
                      this.$message.success("保存成功！");
                      this.getList();
                      this.handleCancel();
                    }
                  } else {
                    if (value == "sunmit") {
                      this.$message.error("提交失败！");
                    } else {
                      this.$message.error("保存失败！");
                    }
                  }
                });
              }
            }
          } else {
            let array = [
              { label: "计划年度", valve: "planTime" },
              { label: "气化外输量", valve: "gasExportVolume" },
              { label: "槽车外输量", valve: "tankCarExportVolume" },
              { label: "装船", valve: "shipLoad" },
            ];
            array.forEach((element) => {
              this.$refs.securityCheckFormRef.validateField(
                element.valve,
                (error) => {
                  if (error) {
                    this.$message.error(`${element.label}——${error}`, 4);
                  }
                }
              );
            });
          }
        });
      } else {
        this.$message.warning("已存在当前年份");
      }
    },
    //获取表格列表
    getList() {
      pageList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.dataSource.forEach((element) => {
          if (element.status == 1) {
            element.statusName = "已保存";
          } else if (element.status == 2) {
            element.statusName = "已提交";
          } else if (element.status == 3) {
            element.statusName = "审批中";
          } else if (element.status == 4) {
            element.statusName = "已审批";
          } else if (element.status == 5) {
            element.statusName = "已拒绝";
          }
        });
        this.pagination.total = res.body.total;
      });
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageIndex = 1;
        this.form.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageIndex = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //重置输入
    resetForm() {
      this.dateStart = "";
      this.dateEnd = "";
      this.form = {};
      this.form.pageIndex = 1;
      this.form.pageSize = 10;
      this.form.recordType = 1;
      this.getList();
    },
    onChange(date, dateString) {
      if (date.length != 0) {
        this.form.dateStart = date[0];
        this.form.dateEnd = date[1];
      } else {
        this.form.dateStart = "";
        this.form.dateEnd = "";
      }
    },
    fileListChange(val) {
      this.flieChanges = val;
    },
    ShipReceivingPlan(row) {
      let plan = {
        year: row,
      };

      let one = 0;
      let one1 = 0;
      let two = 0;
      let two2 = 0;
      let three = 0;
      let three3 = 0;
      let four = 0;
      let four4 = 0;
      let five = 0;
      let five5 = 0;
      let six = 0;
      let six6 = 0;
      let seven = 0;
      let seven7 = 0;
      let eight = 0;
      let eight8 = 0;
      let nine = 0;
      let nine9 = 0;
      let ten = 0;
      let ten10 = 0;
      let eleven = 0;
      let eleven11 = 0;
      let twelve = 0;
      let twelve12 = 0;
      let total = 0;

      queryCqjhByYear(plan).then((res) => {
        this.B = [];
        for (let i = 0; i < res.body.length; i++) {
          if (res.body[i].predictQuantity) {
          } else {
            res.body[i].predictQuantity = 0;
          }
          total += parseFloat(res.body[i].predictQuantity);
          if (res.body[i].arrivalDate.substring(5, 7) == "01") {
            one1++;
            one += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "02") {
            two2++;
            two += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "03") {
            three3++;
            three += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "04") {
            four4++;
            four += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "05") {
            five5++;
            five += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "06") {
            six6++;
            six += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "07") {
            seven7++;
            seven += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "08") {
            eight8++;
            eight += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "09") {
            nine9++;
            nine += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "10") {
            ten10++;
            ten += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "11") {
            eleven11++;
            eleven += parseFloat(res.body[i].predictQuantity);
          }
          if (res.body[i].arrivalDate.substring(5, 7) == "12") {
            twelve12++;
            twelve += parseFloat(res.body[i].predictQuantity);
          }
        }
        this.B.push(
          {
            month: "卸货量（万方）",
            one: one,
            two: two,
            three: three,
            four: four,
            five: five,
            six: six,
            seven: seven,
            eight: eight,
            nine: nine,
            ten: ten,
            eleven: eleven,
            twelve: twelve,
            total: total,
            id: "1",
          },
          {
            month: "来船情况（船）",
            one: one1,
            two: two2,
            three: three3,
            four: four4,
            five: five5,
            six: six6,
            seven: seven7,
            eight: eight8,
            nine: nine9,
            ten: ten10,
            eleven: eleven11,
            twelve: twelve12,
            total: res.body.length,
            id: "2",
          }
        );
        this.dataSourceShip = this.B;
        // this.B.push(B);
        // res.body.forEach((element) => {
        //   if (element.arrivalDate.substring(5, 7)) {
        //   }
        //   // predictQuantity
        //   // if (Month == ) {

        //   // }
        // });
      });
    },
    // 禁用选择框，只有已保存和已拒绝可以选择
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record.status !== "1" && record.status !== "5",
        },
      };
    },
    allowChange() {
      this.isApprove = true;
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
.input {
  /deep/.ant-input {
    border: 1px solid #fff;
  }
}
.grey {
  background: #f3f5f8;
  /deep/.ant-input {
    background: #f3f5f8;
    border: 1px solid #f3f5f8;
  }
}

// background: #f3f5f8;
//     border: 1px solid #f3f5f8;

.table_list {
  text-align: center;
  tr {
    line-height: 36px;
    th {
      border-bottom: none;
      border-top: 1px solid #000;
    }
    th:nth-child(1) {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
    }
    th + th {
      border-right: 1px solid #000;
      // border-right: none;
    }
  }
}
</style>