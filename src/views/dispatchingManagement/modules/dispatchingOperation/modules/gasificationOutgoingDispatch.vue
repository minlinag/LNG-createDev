<template>
  <Breadcrumb>
    <!--头部新增删除按钮-->
    <template slot="breadcrumbButton">
      <!-- 导出规则：表格有选中项优先导出选中项，无选中项按查询条件导出，查询条件为空时导出全部 -->
      <pe-button
        :include="[
          {
            value: 'Add',
            clickName: 'addNew',
          },
          {
            value: 'exportComponent',
            url: '/po/sm/gasOutputTransfer/exportExcel',
            params: {
              idList: selectedRowKeys != '' ? selectedRowKeys : '',
              transferDateStart:
                selectedRowKeys == '' && searchForm.transferDateStart
                  ? searchForm.transferDateStart
                  : '',
              transferDateEnd:
                selectedRowKeys == '' && searchForm.transferDateEnd
                  ? searchForm.transferDateEnd
                  : '',
              createdUser:
                selectedRowKeys == '' && searchForm.createdUser
                  ? searchForm.createdUser
                  : '',
              status:
                selectedRowKeys == '' && searchForm.status
                  ? searchForm.status
                  : '',
            },
          },
        ]"
        @addNew="addClick"
      ></pe-button>
    </template>

    <template slot="appMain">
      <!--查询控件及按钮-->
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <a-col :span="10">
                  <a-form-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="发令时间"
                  >
                    <a-row :gutter="24">
                      <a-col :span="10">
                        <a-date-picker
                          :disabled-date="disabledDate"
                          @change="judgeTransferDate"
                          value-format="yyyy-MM-DD"
                          v-model="searchForm.transferDateStart"
                          :getCalendarContainer="getPopupContainer"
                        />
                      </a-col>
                      <a-col :span="2" style="padding-left: 0px"> —— </a-col>
                      <a-col :span="10">
                        <a-date-picker
                          @change="judgeTransferDate"
                          :disabled-date="disabledDate"
                          value-format="yyyy-MM-DD"
                          v-model="searchForm.transferDateEnd"
                          :getCalendarContainer="getPopupContainer"
                        />
                      </a-col>
                    </a-row>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="创建人"
                  >
                    <a-input
                      v-model="searchForm.createdUser"
                      placeholder="请输入创建人"
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="状态"
                  >
                    <a-select
                      placeholder="请选择"
                      ref="select"
                      v-model="searchForm.status"
                      :options="statusOptions"
                      :getPopupContainer="getPopupContainer"
                    >
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item>
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
                  </a-form-item>
                </a-col>
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
      </div>
      <!--主页面表格-->
      <dc-table
        class="list_table_1"
        :scroll="{ y: 1, x: 100 }"
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="transferName" slot-scope="text, row">
          <span class="edit" v-Edit @click.stop="lookClick(row.id)">
            {{ text }}
          </span>
        </template>
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'Edit',
                type: 'link',
                clickName: 'edit',
                icon: '',
                style: ['btn_link'],
                disabled: row.status !== '0',
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: 'Delete',
                type: 'link',
                clickName: 'delete',
                icon: '',
                style: ['btn_link'],
                disabled: row.status !== '0',
              },
              {
                value: '关闭',
                type: 'link',
                clickName: 'close',
                icon: '',
                style: ['btn_link'],
                disabled: row.status !== '1',
              },
            ]"
            @edit="editClick(row.id)"
            @look="lookClick(row.id)"
            @delete="deleteClick(row.id)"
            @close="closeClick(row.id)"
          ></pe-button>
        </template>
      </dc-table>
      <!-- 新增/编辑弹窗 -->
      <dc-Model
        class="DcModel_Dispatch"
        v-model="visible"
        :modelConfig="modelConfig"
      >
        <a-layout>
          <a-layout-content>
            <!--基础信息-->

            <div>
              <div v-if="infoFormVisible">
                <!-- <a-divider orientation="left">基础信息</a-divider> -->
                <!--基础信息表单-->
                <a-form :form="infoForm" class="addMargins">
                  <a-row :gutter="24">
                    <a-form-item label="编号" v-show="false">
                      <a-input v-decorator="['id']" />
                    </a-form-item>
                    <a-col :span="12">
                      <a-form-item
                        label="创建人"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-input
                          disabled
                          v-decorator="['createdUser']"
                          placeholder="请输入创建人"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="创建时间"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-date-picker
                          show-time
                          disabled
                          v-decorator="['createdDateTime']"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="自动带入"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item
                        label="调度令名称"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-input
                          disabled
                          v-decorator="['transferName']"
                          placeholder="(自动生成)"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="发令单位"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-input
                          v-decorator="['transferOrgUnit']"
                          :disabled="infoFormDisabled"
                          placeholder="(自动生成)"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="12" class="position-changeList_model">
                      <a-form-item
                        label="发令时间"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-date-picker
                          show-time
                          :disabled-date="disabledDate"
                          @change="transferDateChange"
                          v-decorator="[
                            'transferDate',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择发令时间',
                                },
                              ],
                            },
                          ]"
                          :disabled="infoFormDisabled"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择发令时间"
                          :getCalendarContainer="getPopupContainer_model"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="当前外输量"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-input
                          v-decorator="[
                            'currExportVolume',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入发令时间对应的外输量',
                                },
                              ],
                            },
                          ]"
                          autocomplete="off"
                          :disabled="infoFormDisabled"
                          addon-after="10^4 m³/d"
                          placeholder="发令时间对应的外输量"
                        >
                        </a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="目标外输量"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-input
                          v-decorator="[
                            'targetExportVolume',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入目标外输量',
                                },
                              ],
                            },
                          ]"
                          autocomplete="off"
                          :disabled="infoFormDisabled"
                          addon-after="10^4 m³/d"
                          placeholder="请输入目标外输量"
                        >
                        </a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12" class="position-changeList_model">
                      <a-form-item
                        label="是否执行"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-select
                          @change="executeYNChange"
                          :disabled="infoFormDisabled"
                          v-decorator="['executeYN']"
                          :options="executeOptions"
                          :getPopupContainer="getPopupContainer_model"
                        >
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="24">
                      <a-form-item
                        label="说明"
                        :labelCol="{ style: 'width: 120px' }"
                      >
                        <a-textarea
                          v-if="remarkVisible"
                          :disabled="infoFormDisabled"
                          v-decorator="['remark']"
                          :placeholder="remarkPlaceholder"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                        <a-textarea
                          v-else
                          :disabled="infoFormDisabled"
                          v-decorator="[
                            'remark',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入说明',
                                },
                              ],
                            },
                          ]"
                          :placeholder="remarkPlaceholder"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
            </div>

            <!--执行情况-->
            <div>
              <div v-if="implementFromVisible">
                <a-divider orientation="left">执行情况</a-divider>
                <!--执行情况表单-->
                <a-form :form="closeForm" class="addMargins">
                  <a-form-item label="编号" v-show="false">
                    <a-input v-decorator="['id']" />
                  </a-form-item>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item
                        label="关闭人"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-input
                          disabled
                          v-decorator="['closeUserName']"
                          placeholder="请输入关闭人"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="关闭时间"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-date-picker
                          show-time
                          disabled
                          v-decorator="['closeDate']"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="自动带入"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="12" class="position-changeList_model1">
                      <a-form-item
                        label="是否执行完毕"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-select
                          :disabled="implementFromDisabled"
                          v-decorator="['executeCompleteYN']"
                          :options="executeCompleteYNOptions"
                          @change="executeCompleteYNChange"
                          :getPopupContainer="getPopupContainer_model1"
                        >
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24" v-show="completeFromVisible">
                    <a-col :span="12" class="position-changeList_model1">
                      <a-form-item
                        label="完成时间"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-date-picker
                          show-time
                          v-if="executeRemarkAndexecuteGroupVisible"
                          @change="computationalEfficiency"
                          :disabled="implementFromDisabled"
                          v-decorator="[
                            'completeDate',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择完成时间',
                                },
                              ],
                            },
                          ]"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="默认DCS达到目标外输量时间"
                          :getCalendarContainer="getPopupContainer_model1"
                        />
                        <a-date-picker
                          show-time
                          v-else
                          @change="computationalEfficiency"
                          :disabled="implementFromDisabled"
                          v-decorator="['completeDate']"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="默认DCS达到目标外输量时间"
                          :getCalendarContainer="getPopupContainer_model1"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24" v-show="completeFromVisible">
                    <a-col :span="12" class="position-changeList_model1">
                      <a-form-item
                        label="执行班组"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <!-- 《是否执行完毕》选“是”时显示 -->
                        <a-select
                          v-if="executeRemarkAndexecuteGroupVisible"
                          mode="multiple"
                          :disabled="implementFromDisabled"
                          v-decorator="[
                            'executeGroup',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择执行班组',
                                },
                              ],
                            },
                          ]"
                          placeholder="请选择执行班组"
                          :options="executeGroupOptions"
                          :getPopupContainer="getPopupContainer_model1"
                        >
                        </a-select>
                        <!-- 《是否执行完毕》选“否”时显示 -->
                        <a-select
                          v-else
                          mode="multiple"
                          :disabled="implementFromDisabled"
                          v-decorator="['executeGroup']"
                          :options="executeGroupOptions"
                          :getPopupContainer="getPopupContainer_model1"
                        >
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="执行效率"
                        :labelCol="{ style: 'width: 140px' }"
                      >
                        <a-input
                          disabled
                          v-decorator="['executeEfficiency']"
                          placeholder="(输入完成时间自动计算)"
                        >
                        </a-input>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="24">
                      <a-form-item
                        label="执行情况说明"
                        :labelCol="{ style: 'width: 120px' }"
                      >
                        <a-textarea
                          v-if="executeRemarkAndexecuteGroupVisible"
                          :disabled="implementFromDisabled"
                          v-decorator="['executeRemark']"
                          :placeholder="executeRemarkPlaceholder"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                        <a-textarea
                          v-else
                          :disabled="implementFromDisabled"
                          v-decorator="[
                            'executeRemark',
                            {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入执行情况说明',
                                },
                              ],
                            },
                          ]"
                          :placeholder="executeRemarkPlaceholder"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
            </div>
          </a-layout-content>
          <a-layout-footer>
            <!--基础信息按钮-->
            <div align="center" v-if="infoButtonVisible">
              <a-button
                v-Query
                class="buttonType"
                type="primary"
                @click.stop="saveClick()"
              >
                保存
              </a-button>
              <a-button
                type="primary"
                class="buttonType"
                @click.stop="submitClick()"
              >
                提交
              </a-button>
              <a-button class="buttonType" @click.stop="cancelClick()">
                取消
              </a-button>
            </div>

            <!--执行情况按钮-->
            <div align="center" v-if="implementButtonVisible">
              <a-button
                v-Query
                class="buttonType"
                type="primary"
                @click.stop="closeSubmitClick()"
              >
                提交
              </a-button>
              <a-button class="buttonType" @click.stop="cancelClick()">
                取消
              </a-button>
            </div>
            <div
              align="center"
              v-if="!implementButtonVisible && !infoButtonVisible"
            >
              <a-button class="buttonType" @click.stop="cancelClick()">
                取消
              </a-button>
            </div>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  //根据编号查询
  getDetailById,
  //新增或者修改数据-保存操作
  saveForAddOrUpdate,
  //新增或者修改数据-提交操作
  submitForAddOrUpdate,
  //关闭按钮-保存或者提交动作
  updateForCloseOpr,
  deletes,
  //更新数据
  // gasOutputTransfer,
  queryTransferName,
  queryCurrOutputFromRtdb,
} from "@/api/dispatchingManagement/gasificationOutgoingDispatch.js";

import moment from "moment";

export default {
  data() {
    return {
      infoForm: this.$form.createForm(this),
      closeForm: this.$form.createForm(this),
      //执行情况表单显示状态
      implementFromVisible: false,
      //执行情况显示状态
      implementButtonVisible: false,
      //基础信息表单显示状态
      infoFormVisible: false,
      //基础信息按钮显示状态
      infoButtonVisible: false,
      //基础信息说明文本框必填控制  true可选，false必填
      remarkVisible: true,
      /**
       * 控制执行情况执行班组、执行情况说明是否必填
       * （执行班组true必填，false可选）
       * （执行情况说明true可选，false必填）
       */
      executeRemarkAndexecuteGroupVisible: true,
      infoFormDisabled: false,
      implementFromDisabled: false,
      //新增编辑弹窗控制
      visible: false,
      completeFromVisible: true,
      remarkPlaceholder: "",
      executeRemarkPlaceholder: "",
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
      //执行班组下拉数据
      executeGroupOptions: [
        { value: "1", label: "一班" },
        { value: "2", label: "二班" },
        { value: "3", label: "三班" },
        { value: "4", label: "四班" },
        { value: "5", label: "五班" },
      ],
      //勾选框/选择框组件
      selectedRowKeys: [],
      //查询所需的数据
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
      },
      modelConfig: {
        width: "1000px",
        height: "500px",
        title: "气化外输调度令",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      executeOptions: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      executeCompleteYNOptions: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      statusOptions: [
        { value: "0", label: "已保存" },
        { value: "1", label: "执行中" },
        { value: "2", label: "无法执行" },
        { value: "4", label: "执行异常" },
        { value: "3", label: "已关闭" },
      ],
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
          title: "调度令名称",
          dataIndex: "transferName",
          scopedSlots: { customRender: "transferName" },
          width: 130,
          align: "center",
        },
        {
          title: "发令单位",
          dataIndex: "transferOrgUnit",
          width: 150,
          align: "center",
        },
        {
          title: "发令时间",
          dataIndex: "transferDate",
          width: 150,
          align: "center",
        },
        {
          title: "目标外输量(10^4 m³/d)",
          dataIndex: "targetExportVolume",
          width: 200,
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "createdUser",
          width: 130,
          align: "center",
        },
        {
          title: "创建时间",
          dataIndex: "createdDateTime",
          width: 150,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "statusName",
          width: 80,
          align: "center",
          fixed: "right",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 170,
          align: "center",
          fixed: "right",
        },
      ],
      //表格中的数据
      dataSource: [],
      //
      disabledHoursNum: 24,
      disabledMinutesNum: 60,
      disabledSecondsNum: 60,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 下拉框输入框和表单分离问题
    getPopupContainer() {
      return document.querySelector(".position-changeList");
    },
    // 弹窗中下拉框输入框和表单分离问题
    getPopupContainer_model() {
      return document.querySelector(".position-changeList_model");
    },
    // 弹窗中下拉框输入框和表单分离问题
    getPopupContainer_model1() {
      return document.querySelector(".position-changeList_model1");
    },
    //发令时间值改变触发
    transferDateChange(date) {
      if (date) {
        let transferDate = date;
        //判断时间大于当前时间，清空时间
        if (
          this.formatDate(new Date(date), "yyyy-MM-dd HH:mm:ss") >
          this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss")
        ) {
          this.$message.warning(
            "发令时间不可大于当前时间,选择框已重置为当前时间"
          );
          this.$nextTick(() => {
            this.infoForm.setFieldsValue({
              transferDate: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
            });
          });
          transferDate = this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
        }
        //  根据发令时间获取当前外输量
        queryCurrOutputFromRtdb({
          dateTime: transferDate,
          tagName: "\\生产运行采集站\\TI-05501",
        }).then((res) => {
          if (res.code == 200 && res.body != null) {
            this.$nextTick(() => {
              this.infoForm.setFieldsValue({
                currExportVolume: res.body.currExportVolume,
              });
            });
          } else {
            this.$message.warning("获取当前外输量失败");
          }
        });
      }
    },
    //发令时间只可选择当天及以前的日期
    disabledDate(current) {
      return current && current > moment().endOf("day");
    },

    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },

    //是否执行下拉框改变，控制说明文本框是否必填   1-是-true-可选，0-否-false-必填
    executeYNChange(val) {
      if (val == 0) {
        this.remarkVisible = false;
      } else {
        this.remarkVisible = true;
      }
    },

    //是否执行完毕下拉框数据改变
    //1、控制说明文本框是否必填   1-是-true-可选，0-否-false-必填
    //2、控制完成时间/执行班组/执行效率 显示隐藏
    executeCompleteYNChange(val) {
      if (val == "1") {
        //显示控件
        this.completeFromVisible = true;
        this.executeRemarkAndexecuteGroupVisible = true;
      } else {
        this.completeFromVisible = false;
        this.executeRemarkAndexecuteGroupVisible = false;

        //隐藏控件  隐藏数据
        this.$nextTick(() => {
          this.closeForm.setFieldsValue({
            completeDate: null,
            executeGroup: undefined,
            executeEfficiency: "",
          });
        });
      }
    },
    //点击保存按钮
    saveClick() {
      //验证文本框内容是否合规
      this.infoForm.validateFields((err, values) => {
        if (!err) {
          if (
            values.executeYN == "1" ||
            (values.executeYN == "0" && values.remark)
          ) {
            saveForAddOrUpdate(values).then((res) => {
              if (res.code == 200) {
                this.$message.success("保存成功");
                this.visible = false;
                this.getList();
              } else {
                this.$message.warning("保存失败");
              }
            });
          } else {
            this.$message.warning("请填写说明");
          }
        }
      });
    },

    //关闭弹窗取消按钮
    cancelClick() {
      this.visible = false;
    },
    //判断日期
    judgeTransferDate() {
      if (this.searchForm.transferDateStart > this.searchForm.transferDateEnd) {
        this.$message.warning("开始日期大于结束日期,请重新选择");
      }
    },

    //关闭弹窗点击提交按钮
    closeSubmitClick() {
      //验证文本框内容是否合规
      this.closeForm.validateFields((err, values) => {
        if (!err) {
          //下拉多选转为string
          let value = values;
          if (value.executeGroup) {
            value.executeGroup = value.executeGroup.toString();
          }
          value.closeStatus = "1";
          updateForCloseOpr(value).then((res) => {
            if (res.code == 200) {
              this.$message.success("关闭成功");
              this.visible = false;
              this.getList();
            } else {
              this.$message.warning("关闭失败");
            }
          });
        }
      });
    },

    //点击基础信息提交按钮
    submitClick() {
      //验证文本框内容是否合规
      this.infoForm.validateFields((err, values) => {
        if (!err) {
          submitForAddOrUpdate(values).then((res) => {
            if (res.code == 200) {
              this.$message.success("提交成功");
              this.visible = false;
              this.getList();
            } else {
              this.$message.warning("提交失败");
            }
          });
        } else {
          this.$message.error("请输入正确格式的数据！");
        }
      });
    },

    //表格多选框改变触发
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //执行效率计算
    // 发令时间、目标外输量、当前外输量（发令时间对应的DCS流量计数据，NG去高压外输管线流量），完成时间（DCS流量计数据达到目标外输量的时间）
    // 一）目标外输量>当前外输量
    // 【（完成时间-发令时间）/(（目标外输量-当前外输量)/500)】
    // >2.5  不合格；
    // =<2.5 合格；
    // =<1.5 良好；
    // =<1   优秀；
    // 二）目标外输量<当前外输量
    // 【（完成时间-发令时间）/(（当前外输量-目标外输量)/500)】
    // >2.5  不合格；
    // =<2.5 合格；
    // =<1.5 良好；
    // =<1   优秀；
    computationalEfficiency(completionTime) {
      //完成时间为空不计算
      if (completionTime == null) return;
      //发令时间
      let transferDate = this.infoForm.getFieldValue("transferDate");
      //完成时间必须大于发令时间
      if (new Date(completionTime) > new Date(transferDate)) {
        //当前外输量   TODO:DCS取值
        let currExportVolume = this.infoForm.getFieldValue("currExportVolume");
        //目标外输量
        let targetExportVolume = parseInt(
          this.infoForm.getFieldValue("targetExportVolume")
        );

        //计算时间差 (完成时间-发令时间)=XX.XXXX小时
        let hour =
          parseInt(new Date(completionTime) - new Date(transferDate)) /
          1000 /
          60 /
          60;
        //计算指标数
        let i = 0;
        if (targetExportVolume > currExportVolume) {
          i = hour / ((targetExportVolume - currExportVolume) / 500);
        } else {
          i = hour / ((currExportVolume - targetExportVolume) / 500);
        }
        //判断指标数
        let msg = "";
        if (i > 2.5) {
          msg = "不合格";
        } else if (i <= 1) {
          msg = "优秀";
        } else if (i <= 1.5) {
          msg = "良好";
        } else if (i <= 2.5) {
          msg = "合格";
        }
        this.closeForm.setFieldsValue({
          executeEfficiency: msg,
        });
      } else {
        this.$message.warning("完成时间不可早于发令时间");
      }
    },

    //点击新增，跳转操作页
    addClick() {
      this.modelConfig.title = "气化外输调度令-新增";
      this.infoFormVisible = true;
      this.infoButtonVisible = true;
      this.implementFromVisible = false;
      this.implementButtonVisible = false;
      this.infoFormDisabled = false;
      this.remarkVisible = true;
      this.remarkPlaceholder = "请输入说明";
      this.executeRemarkPlaceholder = "";
      //清空新增弹窗表单
      //自动带入赋值   创建人  创建时间  调度令名称
      let userName = this.$store.state.user.name;
      //获取调度令名称
      queryTransferName().then((res) => {
        if (res.code == 200) {
          //打开新增弹窗
          this.visible = true;
          //清空表单
          this.infoForm.resetFields();
          this.$nextTick(() => {
            this.infoForm.setFieldsValue({
              createdUser: userName,
              createdDateTime: this.formatDate(
                new Date(),
                "yyyy-MM-dd HH:mm:ss"
              ),
              transferOrgUnit: "调控中心",
              executeYN: "1",
              transferName: res.body.transferName,
            });
          });
        } else {
          this.$message.warning("获取调度令名称失败");
        }
      });
    },

    //点击编辑，跳转到操作页
    editClick(id) {
      this.modelConfig.title = "气化外输调度令-编辑";
      this.infoFormVisible = true;
      this.infoButtonVisible = true;
      this.implementFromVisible = false;
      this.implementButtonVisible = false;
      this.infoFormDisabled = false;
      this.remarkPlaceholder = "请输入说明";
      this.executeRemarkPlaceholder = "";
      //根据编号查询详情信息
      getDetailById({ id: id }).then((res) => {
        if (res.code == 200) {
          //打开编辑弹窗
          this.visible = true;
          //清空表单
          this.infoForm.resetFields();
          //判断是否执行为1(是)时，说明框为非必填
          this.remarkVisible = res.body.executeYN == 1;
          this.$nextTick(() => {
            this.infoForm.setFieldsValue({
              id: res.body.id,
              createdUser: res.body.createdUser,
              createdDateTime: res.body.createdDateTime,
              transferName: res.body.transferName,
              transferOrgUnit: res.body.transferOrgUnit,
              transferDate: res.body.transferDate,
              targetExportVolume: res.body.targetExportVolume,
              executeYN: res.body.executeYN,
              remark: res.body.remark,
              currExportVolume: res.body.currExportVolume,
            });
          });
        } else {
          this.$message.warning("获取调度令信息失败，请刷新页面重试");
        }
      });
    },

    closeClick(id) {
      //设置弹窗名称
      this.modelConfig.title = "气化外输调度令-关闭";
      this.infoFormVisible = true;
      this.infoButtonVisible = false;
      this.implementFromVisible = true;
      this.implementButtonVisible = true;
      this.infoFormDisabled = true;
      this.implementFromDisabled = false;
      this.completeFromVisible = true;
      this.executeRemarkAndexecuteGroupVisible = true;
      this.remarkPlaceholder = "";
      this.executeRemarkPlaceholder = "请输入执行情况说明";
      //根据编号查询详情信息
      getDetailById({ id: id }).then((res) => {
        if (res.code == 200) {
          let detail = res.body;
          //回显执行信息数据

          //打开弹窗
          this.visible = true;
          //清空表单
          this.infoForm.resetFields();
          this.closeForm.resetFields();
          this.$nextTick(() => {
            this.infoForm.setFieldsValue({
              createdUser: detail.createdUser,
              createdDateTime: detail.createdDateTime,
              transferName: detail.transferName,
              transferOrgUnit: detail.transferOrgUnit,
              transferDate: detail.transferDate,
              targetExportVolume: detail.targetExportVolume,
              executeYN: detail.executeYN,
              remark: detail.remark,
              currExportVolume: detail.currExportVolume,
            });
          });
          this.$nextTick(() => {
            this.closeForm.setFieldsValue({
              id: detail.id,
              executeCompleteYN: "1",
              closeUserName: this.$store.state.user.name,
              closeDate: this.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
            });
          });
        } else {
          this.$message.warning("获取调度令信息失败，请刷新页面重试");
        }
      });
    },

    //点击查看，跳转到操作页
    lookClick(id) {
      this.remarkPlaceholder = "";
      this.executeRemarkPlaceholder = "";
      //设置弹窗名称
      this.modelConfig.title = "气化外输调度令-详情";
      //根据编号查询详情信息
      getDetailById({ id: id }).then((res) => {
        this.infoFormVisible = true;
        this.infoButtonVisible = false;
        this.implementButtonVisible = false;
        this.infoFormDisabled = true;
        this.implementFromDisabled = true;
        this.implementFromVisible = false;
        //打开弹窗
        this.visible = true;
        //清空基础数据表单
        this.infoForm.resetFields();
        //判断是否执行为1(是)时，说明框为非必填
        this.remarkVisible = res.body.executeYN == 1;

        //赋值基础数据表单
        this.$nextTick(() => {
          this.infoForm.setFieldsValue({
            createdUser: res.body.createdUser,
            createdDateTime: res.body.createdDateTime,
            transferName: res.body.transferName,
            transferOrgUnit: res.body.transferOrgUnit,
            transferDate: res.body.transferDate,
            targetExportVolume: res.body.targetExportVolume,
            executeYN: res.body.executeYN,
            remark: res.body.remark,
            currExportVolume: res.body.currExportVolume,
          });
        });
        //已关闭显示执行情况
        if (res.body.status == "3" || res.body.status == "4") {
          //判断执行是否完毕  控制完成时间、执行班组、执行效率的显示
          if (res.body.executeCompleteYN == "1") {
            this.completeFromVisible = true;
          } else {
            this.completeFromVisible = false;
          }
          //显示执行情况部分
          this.implementFromVisible = true;
          //判断是否执行完毕为1(是)时，执行情况说明说明框为非必填，执行班组必填
          this.executeRemarkAndexecuteGroupVisible =
            res.body.executeCompleteYN == 1;
          //清空执行情况表单
          this.closeForm.resetFields();
          this.$nextTick(() => {
            this.closeForm.setFieldsValue({
              id: res.body.id,
              closeUserName: res.body.closeUserName,
              closeDate: res.body.closeDate,
              executeCompleteYN: res.body.executeCompleteYN,
              completeDate: res.body.completeDate,
              executeGroup: res.body.executeGroup
                ? res.body.executeGroup.split(",")
                : undefined,
              executeEfficiency: res.body.executeEfficiency,
              executeRemark: res.body.executeRemark,
            });
          });
        }
      });
    },

    //删除操作
    deleteOperation(id) {
      //因为后端为批量删除  所以必须加中括号
      deletes([id]).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除成功！");
          this.getList();
        } else {
          this.this.$message.error("删除失败！");
        }
      });
    },

    //获得当前页面
    getList() {
      getList(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.dataSource.forEach((element) => {
          //循环表格数据，将状态码转为文字表示
          let statusName = "-";
          if (element.status == "0") {
            statusName = "已保存";
          } else if (element.status == "1") {
            statusName = "执行中";
          } else if (element.status == "2") {
            statusName = "无法执行";
          } else if (element.status == "3") {
            statusName = "已关闭";
          } else if (element.status == "4") {
            statusName = "执行异常";
          }
          element.statusName = statusName;
        });
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
    },

    //查询功能
    searchClick() {
      if (this.searchForm) {
        this.searchForm.pageIndex = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.searchForm.pageIndex = pagination.current;
      this.searchForm.pageSize = pagination.pageSize;
      this.getList();
    },

    //重置输入
    resetClick() {
      this.searchForm = {};
      this.searchForm.pageIndex = 1;
      this.searchForm.pageSize = 10;
      this.getList();
    },

    // 点击确定删除
    deleteClick(id) {
      this.deleteOperation(id);
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

.exportbutton {
  margin-left: 0.8%;
}

.TableTop {
  margin-top: 10px;
}
</style>
