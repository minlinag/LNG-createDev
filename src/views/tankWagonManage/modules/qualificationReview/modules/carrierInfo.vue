<template>
  <Breadcrumb>
    <!--头部新增删除按钮-->
    <template slot="breadcrumbButton">
      <!-- 导出规则：表格有选中项优先导出选中项，无选中项按查询条件导出，查询条件为空时导出全部 -->
      <pe-button
        :include="[
          {
            value: 'exportComponent',
            icon: 'export-icon',
            url: '/customerCarrier/exportExcel',
            params: {
              idList: selectedRowKeys != '' ? selectedRowKeys : '',
              full_name:
                selectedRowKeys == '' && searchForm.full_name
                  ? searchForm.full_name
                  : '',
              contact_name:
                selectedRowKeys == '' && searchForm.contact_name
                  ? searchForm.contact_name
                  : '',
              record_status:
                selectedRowKeys == '' && searchForm.record_status
                  ? searchForm.record_status
                  : '',
            },
          },
        ]"
      ></pe-button>
    </template>

    <template slot="appMain">
      <!--查询控件及按钮-->
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="承运商名称"
                  >
                    <a-input
                      v-model="searchForm.full_name"
                      placeholder="请输入承运商名称"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="现场联系人"
                  >
                    <a-input
                      v-model="searchForm.contact_name"
                      placeholder="请输入现场联系人"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="审核状态"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchForm.record_status"
                      :options="stateOptions"
                      :getPopupContainer="getPopupContainer"
                    >
                    </a-select>
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
        }"
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <!-- 
        :customRow="rowStyle"
         -->

        <template slot="operation" slot-scope="row">
          <!-- {
                value: '移出黑名单',
                type: 'link',
                clickName: 'removeBlacklist',
                icon: '',
                style: ['btn_link'],
                show: row.record_status == '5',
              }, -->
          <pe-button
            :include="[
              {
                value: '加入黑名单',
                type: 'link',
                clickName: 'addBlacklist',
                icon: '',
                style: ['btn_link'],
                show: row.record_status == '4',
              },
              {
                value: 'VERIFY',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
                disabled: $audit.auditDisabled(row.todo_username),
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @addBlacklist="addBlacklistClick(row.id, row.credit_no)"
            @removeBlacklist="removeBlacklistClick(row.id, row.credit_no)"
            @approval="approvalClick(row)"
            @look="lookClick(row)"
          ></pe-button>
        </template>
      </dc-table>
      <!-- 审批/详情弹窗 -->
      <dc-Model v-model="visible" :modelConfig="modelConfig" class="DcModel">
        <a-layout>
          <a-layout-content>
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

            <!--资质证件-->
            <!-- <a-divider orientation="left">资质证件</a-divider> -->
            <!--营业执照-->
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
                      infoData.AA_file == undefined ||
                      infoData.AA_file.length == '0'
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
                      infoData.AB_file == undefined ||
                      infoData.AB_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >

                  <!-- <a @click="fileDownload('AB')">道路运输许可证</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-divider orientation="left" orientation-margin="0px">
              资质证件
            </a-divider>
            <!--关于LNG承运商认证备案的申请函-->
            <!-- <a-divider orientation="left" orientation-margin="0px"> -->
            <!-- 关于LNG承运商认证备案的申请函 -->
            <!-- </a-divider> -->
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item
                  :labelCol="{ style: 'width: 290px' }"
                  label="关于LNG承运商认证备案的申请函"
                >
                  <!-- <a @click="fileDownload('AC')">关于LNG承运商认证备案的申请函</a> -->
                  <a
                    v-for="(item, index) in infoData.AC_file"
                    :key="index"
                    @click="fileDownload(item.filePath)"
                    >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
                  >
                  <span
                    v-if="
                      infoData.AC_file == undefined ||
                      infoData.AC_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--现场单位管理规定-->
            <!-- <a-divider orientation="left" orientation-margin="0px">
          现场单位管理规定
        </a-divider> -->
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
                      infoData.AD_file == undefined ||
                      infoData.AD_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >

                  <!-- <a @click="fileDownload('AD')">现场单位管理规定</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--公司安全管理规定-->
            <!-- <a-divider orientation="left" orientation-margin="0px">
          公司安全管理规定
        </a-divider> -->
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
                      infoData.AE_file == undefined ||
                      infoData.AE_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >
                  <!-- <a @click="fileDownload('AE')">公司安全管理规定</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--安全管理人员的安全从业资格证-->
            <!-- <a-divider orientation="left" orientation-margin="0px">
          安全管理人员的安全从业资格证
        </a-divider> -->
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
                      infoData.AF_file == undefined ||
                      infoData.AF_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >
                  <!-- <a @click="fileDownload('AF')">安全管理人员的安全从业资格证</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-divider orientation="left" orientation-margin="0px"
              >企业HSSE安全管理资料</a-divider
            >

            <!--安全管理机构信息-->
            <!-- <a-divider orientation="left" orientation-margin="0px"
          >安全管理机构信息</a-divider
        > -->
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
                      infoData.BA_file == undefined ||
                      infoData.BA_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >
                  <!-- <a @click="fileDownload('BA')">安全管理机构信息</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--HSSE 体系文件-->
            <!-- <a-divider orientation="left" orientation-margin="0px"
          >HSSE 体系文件</a-divider
        > -->
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
                      infoData.BB_file == undefined ||
                      infoData.BB_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >
                  <!-- <a @click="fileDownload('BB')">HSSE体系文件</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--HSSE 管理制度-->
            <!-- <a-divider orientation="left" orientation-margin="0px"
          >HSSE 管理制度</a-divider
        > -->
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
                      infoData.BC_file == undefined ||
                      infoData.BC_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >
                  <!-- <a @click="fileDownload('BC')">HSSE管理制度</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--应急预案-->
            <!-- <a-divider orientation="left" orientation-margin="0px"
          >应急预案</a-divider
        > -->
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
                      infoData.BD_file == undefined ||
                      infoData.BD_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >

                  <!-- <a @click="fileDownload('BD')">应急预案</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--事故管理-->
            <!-- <a-divider orientation="left" orientation-margin="0px"
          >事故管理</a-divider
        > -->
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
                      infoData.BE_file == undefined ||
                      infoData.BE_file.length == '0'
                    "
                    >{{ fileNullMsg }}</span
                  >
                  <!-- <a @click="fileDownload('BE')">事故管理</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--审批信息部分-->
            <div>
              <a-divider orientation="left">审批信息</a-divider>
              <approvalModel
                ref="approvalModel"
                :isShow="pageType === 'approval' ? true : false"
                :id="id"
              />
            </div>
          </a-layout-content>
          <a-layout-footer>
            <a-button
              type="primary"
              @click="approvalCommit"
              v-if="pageType === 'approval'"
              >确定</a-button
            >
            <a-button @click="visibleCancel">返回</a-button>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
      <!-- 加入黑名单弹窗 -->
      <a-modal
        v-model="addBlackVisible"
        title="请输入意见"
        @ok="modalAddBlacklist"
        class="modalButtonCenter"
      >
        <!-- <a-form-item label="意见"> -->
        <a-textarea placeholder="请输入意见" v-model="addBlackData.comments" />
        <template slot="footer">
          <a-button key="submit" type="primary" @click="modalAddBlacklist">
            确认
          </a-button>
          <a-button key="back" @click="addBlackVisible = false">
            取消
          </a-button>
        </template>
        <!-- </a-form-item> -->
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  addBlacklist,
  queryFileByParentId,
  approval,
} from "@/api/tankWagonManage/carrierInfo.js";
import approvalModel from "@/views/tankWagonManage/modules/qualificationReview/modules/component/approvalModel.vue";
export default {
  components: { approvalModel },

  data() {
    return {
      id: "",
      //详情弹窗文件空时提示语
      fileNullMsg: "无附件",
      pageType: "",
      //弹窗中数据集合
      infoData: {},
      //审批/详情弹窗
      visible: false,
      //加入黑名单原因弹窗
      addBlackVisible: false,
      addBlackData: {},
      detailsData: [],
      //翻页页面组件
      pagination: {
        current: 1,
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
      //查询所需的数据
      searchForm: {
        page_size: 10,
        page_num: 1,
        full_name: "",
        contact_name: "",
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
          title: "承运商名称",
          dataIndex: "full_name",
          width: 150,
          align: "center",
        },
        {
          title: "现场联系人",
          dataIndex: "contact_name",
          width: 130,
          align: "center",
        },
        {
          title: "联系电话",
          dataIndex: "contact_tel",
          width: 110,
          align: "center",
        },
        {
          title: "营业执照到期时间",
          dataIndex: "aa_date_to",
          width: 150,
          align: "center",
          customRender: (text) => {
            if (this.judgeBeOverdue(text)) {
              return <span style={{ color: "#FF0000" }}>{text}</span>;
            } else if (this.dateJudge(text)) {
              return <span style={{ color: "#FFA70F" }}>{text}</span>;
            } else {
              return <span>{text}</span>;
            }
          },
        },
        {
          title: "道路经营许可证到期时间",
          dataIndex: "ab_date_to",
          width: 180,
          align: "center",
          customRender: (text) => {
            if (this.judgeBeOverdue(text)) {
              return <span style={{ color: "#FF0000" }}>{text}</span>;
            } else if (this.dateJudge(text)) {
              return <span style={{ color: "#FFA70F" }}>{text}</span>;
            } else {
              return <span>{text}</span>;
            }
          },
        },
        {
          title: "推送时间",
          dataIndex: "push_time",
          width: 150,
          align: "center",
        },
        {
          title: "审核人",
          dataIndex: "todo_username",
          width: 70,
          align: "center",
        },
        {
          title: "审核状态",
          dataIndex: "record_status_name",
          width: 90,
          align: "center",
          fixed: "right",
        },
        {
          title: "操作",
          scopedSlots: {
            customRender: "operation",
          },
          width: 180,
          align: "center",
          fixed: "right",
        },
      ],
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
      modelConfig: {
        width: "950px",
        title: "承运商管理",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      // 审批进度
      stepConfiguration: {
        stepProgress: 1,
        stepList: [
          {
            title: "销售公司",
            // name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "槽车班组",
            name: "",
            dataTime: "",
          },

          {
            title: "完成",
          },
        ],
      },
      //审批表数据
      dataSourceApproval: [
        // {
        //   step: "",
        //   person: "",
        //   institution: "",
        //   operate: "",
        //   result: "",
        //   advice: "",
        //   time: "",
        // },
      ],
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
    //判断<信息待审核><证书有效期不足1个月>加黄色背景，日期红色
    //判断<证书有效期已过期>加红色背景，日期白色
    rowStyle(record) {
      if (
        !record.aa_date_to ||
        !record.ab_date_to ||
        this.judgeBeOverdue(record.aa_date_to) ||
        this.judgeBeOverdue(record.ab_date_to) ||
        record.record_status_name == "待审核"
      ) {
        return {
          style: {
            "background-color": "red",
          },
        };
      } else if (
        !record.aa_date_to ||
        !record.ab_date_to ||
        this.dateJudge(record.aa_date_to) ||
        this.dateJudge(record.ab_date_to) ||
        record.record_status_name == "待审核"
      ) {
        return {
          style: {
            "background-color": "yellow",
          },
        };
      }
    },

    //判断日期是否比当前日期大一个月  是:true,否:false
    dateJudge(date) {
      date = new Date(date);
      let dateL = new Date(new Date().setMonth(new Date().getMonth() + 1));
      let dateTo = new Date(date);
      if (dateL >= dateTo) {
        return true;
      } else {
        return false;
      }
    },

    //判断是否过期  判断到期日期是否大于当前日期  是:true,否:false
    judgeBeOverdue(date) {
      date = new Date(date);
      let dateCurrent = new Date();
      let dateTo = new Date(date);
      if (dateCurrent >= dateTo) {
        return true;
      } else {
        return false;
      }
    },
    //表格多选框改变触发
    onSelectChange(key) {
      this.selectedRowKeys = key;
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

    //关闭审批/详情页面
    visibleCancel() {
      this.visible = false;
    },

    //审核页面点击确定
    approvalCommit() {
      //判断是通过1，还是驳回0
      let type = this.$refs.approvalModel.form.type;
      let opinion = this.$refs.approvalModel.form.opinion;
      if (type == 1) {
        approval(this.infoData.id, opinion).then((res) => {
          if (res.code == 200) {
            this.$message.success("审核成功!");
            this.visible = false;
            this.getList();
          } else {
            this.$message.warning("审核失败!");
          }
        });
      } else {
        //加入黑名单
        if (opinion) {
          this.addBlacklistOperation(
            this.infoData.id,
            opinion,
            this.infoData.full_name
          );
        } else {
          this.$message.warning("请输入审批意见");
        }
      }
    },

    //点击审核，跳转审核到审核页面
    approvalClick(value) {
      this.modelConfig.title = "承运商-审核";
      //清空id，解决重复进入同一数据时，审批信息不刷新
      this.id = "";
      this.$nextTick(() => {
        this.id = value.id;
      });
      this.pageType = "approval";
      this.infoData = value;
      this.renderData(value.id);
    },

    //点击查看，跳转到操作页
    lookClick(value) {
      this.modelConfig.title = "承运商-详情";
      this.pageType = "look";
      this.infoData = {};
      //清空id，解决重复进入同一数据时，审批信息不刷新
      this.id = "";
      this.$nextTick(() => {
        this.id = value.id;
      });
      this.infoData = value;
      this.renderData(value.id);
    },

    //查询详情数据  渲染数据   弹出审批详情页面
    renderData(id) {
      queryFileByParentId(id).then((res) => {
        if (res.code == "200" && res.body) {
          let data = res.body;
          this.infoData.AA_file = [];
          this.infoData.AB_file = [];
          this.infoData.AC_file = [];
          this.infoData.AD_file = [];
          this.infoData.AE_file = [];
          this.infoData.AF_file = [];
          this.infoData.BA_file = [];
          this.infoData.BB_file = [];
          this.infoData.BC_file = [];
          this.infoData.BD_file = [];
          this.infoData.BE_file = [];
          data.forEach((element) => {
            /**
             *  资质证书 AA-营业执照/AB-道路经营许可证/AC-关于 LNG 承运商认证备案的申请函/AD-现场单位管理规定/
             *  AE-公司安全管理规定/AF-安全管理人员的安全从业资格证/BA-安全管理机构信息/BB-HSSE 体系文件/
             * BC-HSSE 管理制度/BD-应急预案/BE-事故管理
             */
            if (element.doc_code == "AA") {
              this.infoData.AA_date_from = element.date_from;
              this.infoData.AA_date_to = element.date_to;
              this.infoData.AA_doc_no = element.doc_no;
              this.infoData.AA_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AB") {
              this.infoData.AB_date_from = element.date_from;
              this.infoData.AB_date_to = element.date_to;
              this.infoData.AB_doc_no = element.doc_no;
              this.infoData.AB_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AC") {
              this.infoData.AC_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AD") {
              this.infoData.AD_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AE") {
              this.infoData.AE_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AF") {
              this.infoData.AF_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "BA") {
              this.infoData.BA_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "BB") {
              this.infoData.BB_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "BC") {
              this.infoData.BC_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "BD") {
              this.infoData.BD_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "BE") {
              this.infoData.BE_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            }
          });
        }
        this.visible = true;
      });
    },

    //点击行内添加黑名单
    addBlacklistClick(id, credit_no) {
      this.addBlackData = {};
      this.addBlackData.id = id;
      this.addBlackData.credit_no = credit_no;
      this.addBlackVisible = true;
    },

    //确定加入黑名单
    modalAddBlacklist() {
      if (
        this.addBlackData &&
        this.addBlackData.id &&
        this.addBlackData.comments &&
        this.addBlackData.credit_no
      ) {
        this.addBlacklistOperation(
          this.addBlackData.id,
          this.addBlackData.comments,
          this.addBlackData.credit_no
        );
      } else {
        this.$message.warning("请输入意见");
      }
    },

    //添加黑名单
    addBlacklistOperation(id, comments, credit_no) {
      let params = {
        parent_id: id,
        in_out: "I",
        reason: comments,
        valid: "Y",
        credit_no: credit_no,
      };
      addBlacklist(params).then((res) => {
        if (res.code == 200) {
          this.$message.success("加入黑名单成功!");
          this.visible = false;
          this.addBlackVisible = false;
        } else {
          this.$message.warning("加入黑名单失败!");
        }
      });
    },

    //移出黑名单
    removeBlacklistClick(id, credit_no) {
      let params = {
        parent_id: id,
        in_out: "O",
        valid: "N",
        credit_no: credit_no,
      };
      addBlacklist(params).then((res) => {
        if (res.code == 200) {
          this.$message.success("移出黑名单成功!");
          this.getList();
        } else {
          this.$message.warning("移出黑名单失败!");
        }
      });
    },

    //获得当前页面
    getList() {
      getList(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
      this.selectedRowKeys = [];
    },

    //查询功能
    searchClick() {
      if (this.searchForm) {
        this.searchForm.page_num = 1;
        this.searchForm.page_size = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.searchForm.page_num = pagination.current;
      this.searchForm.page_size = pagination.pageSize;
      this.getList();
    },

    //重置输入
    resetClick() {
      this.searchForm = {};
      this.searchForm.page_num = 1;
      this.searchForm.page_size = 10;
      this.getList();
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
