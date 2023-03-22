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
            url: '/customerDriver/exportExcel',
            params: {
              idList: selectedRowKeys != '' ? selectedRowKeys : '',
              full_name:
                selectedRowKeys == '' && searchForm.full_name
                  ? searchForm.full_name
                  : '',
              post:
                selectedRowKeys == '' && searchForm.post ? searchForm.post : '',
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
                    label="姓名"
                  >
                    <a-input
                      v-model="searchForm.full_name"
                      placeholder="请输入姓名"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="工作岗位"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchForm.post"
                      :options="postOptions"
                    >
                    </a-select>
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
        :customRow="rowStyle"
      >
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
                disabled: $audit.auditDisabled(row.toDoUserCode),
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @addBlacklist="addBlacklistClick(row.id, row.id_no)"
            @removeBlacklist="removeBlacklistClick(row.id, row.id_no)"
            @approval="approvalClick(row)"
            @look="lookClick(row)"
          ></pe-button>
          <!-- <pe-button
            v-if="row.record_status == '1'"
            :include="[
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @look="lookClick(row)"
          ></pe-button> -->
          <!-- <pe-button
            v-if="
              row.record_status == '1' ||
              row.record_status == '2' ||
              row.record_status == '3'
            "
            :include="[
              {
                value: '审核',
                type: 'link',
                clickName: 'approval',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @approval="approvalClick(row)"
            @look="lookClick(row)"
          ></pe-button>
          <pe-button
            v-if="row.record_status == '4'"
            :include="[
              {
                value: '加入黑名单',
                type: 'link',
                clickName: 'addBlacklist',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @addBlacklist="addBlacklistClick(row.id, row.full_name)"
            @look="lookClick(row)"
          ></pe-button>
          <pe-button
            v-if="row.record_status == '5'"
            :include="[
              {
                value: '移出黑名单',
                type: 'link',
                clickName: 'removeBlacklist',
                icon: '',
                style: ['btn_link'],
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @removeBlacklist="removeBlacklistClick(row.id, row.full_name)"
            @look="lookClick(row)"
          ></pe-button> -->
        </template>
      </dc-table>

      <!-- 审批/详情弹窗 -->
      <dc-Model
        :width="'950px'"
        v-model="visible"
        :modelConfig="modelConfig"
        class="DcModel"
      >
        <a-layout>
          <a-layout-content>
            <!--基础信息-->
            <a-divider orientation="left">基础信息</a-divider>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="姓名" :labelCol="{ style: 'width: 100px' }">
                  <a-input
                    v-model="infoData.full_name"
                    disabled
                    placeholder="姓名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="身份证号"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    v-model="infoData.id_no"
                    disabled
                    placeholder="身份证号"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="手机号"
                  :labelCol="{ style: 'width: 165px' }"
                >
                  <a-input
                    v-model="infoData.phone"
                    disabled
                    placeholder="手机号"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="性别"
                >
                  <a-input v-model="infoData.sex" disabled placeholder="性别" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="工作岗位"
                >
                  <a-input
                    v-model="infoData.post"
                    disabled
                    placeholder="工作岗位"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>

            <!--证件类型-->
            <!-- <a-divider orientation="left">证件类型</a-divider> -->
            <!--身份证-->
            <a-divider orientation="left" orientation-margin="0px"
              >身份证</a-divider
            >

            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item
                  label="资质证号"
                  :labelCol="{ style: 'width: 100px' }"
                >
                  <a-input
                    v-model="infoData.AA_doc_no"
                    disabled
                    placeholder="资质证号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="证件生效时间"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    v-model="infoData.AA_date_from"
                    disabled
                    placeholder="证件生效时间"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="证件到期时间"
                  :labelCol="{ style: 'width: 165px' }"
                >
                  <a-input
                    v-model="infoData.AA_date_to"
                    disabled
                    placeholder="证件到期时间"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="附件"
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
                  <!-- <a @click="fileDownload('AA')">身份证正面</a> -->
                  <!-- <a @click="fileDownload('AA')">身份证背面</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>

            <!--驾驶证-->
            <a-divider orientation="left" orientation-margin="0px"
              >驾驶证</a-divider
            >
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="资质证号"
                >
                  <a-input
                    v-model="infoData.AB_doc_no"
                    disabled
                    placeholder="资质证号"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="证件生效时间"
                >
                  <a-input
                    v-model="infoData.AB_date_from"
                    disabled
                    placeholder="证件生效时间"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 165px' }"
                  label="证照到期时间"
                >
                  <a-input
                    v-model="infoData.AB_date_to"
                    disabled
                    placeholder="证件到期时间"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="附件"
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
                  <!-- <a @click="fileDownload('AB')">驾驶证</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--危险品从业资格证-->
            <a-divider orientation="left" orientation-margin="0px">
              危险品从业资格证
            </a-divider>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="资质证号"
                >
                  <a-input
                    v-model="infoData.AC_doc_no"
                    disabled
                    placeholder="资质证号"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="证件生效时间"
                >
                  <a-input
                    v-model="infoData.AC_date_from"
                    disabled
                    placeholder="证件生效时间"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 165px' }"
                  label="证照到期时间"
                >
                  <a-input
                    v-model="infoData.AC_date_to"
                    disabled
                    placeholder="证件到期时间"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="附件"
                >
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
                  <!-- <a @click="fileDownload('AC')">道路危险货物运输驾驶证</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--押运证-->
            <a-divider orientation="left" orientation-margin="0px">
              押运证
            </a-divider>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="资质证号"
                >
                  <a-input
                    v-model="infoData.AD_doc_no"
                    disabled
                    placeholder="资质证号"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="证件生效时间"
                >
                  <a-input
                    v-model="infoData.AD_date_from"
                    disabled
                    placeholder="证件生效时间"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 165px' }"
                  label="证照到期时间"
                >
                  <a-input
                    v-model="infoData.AD_date_to"
                    disabled
                    placeholder="证件到期时间"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="附件"
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
                  <!-- <a @click="fileDownload('AD')">押运证</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--职业健康体检报告-->
            <a-divider orientation="left" orientation-margin="0px">
              职业健康体检报告
            </a-divider>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="资质证号"
                >
                  <a-input
                    v-model="infoData.AE_doc_no"
                    disabled
                    placeholder="资质证号"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="证件生效时间"
                >
                  <a-input
                    v-model="infoData.AE_date_from"
                    disabled
                    placeholder="证件生效时间"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 165px' }"
                  label="证照到期时间"
                >
                  <a-input
                    v-model="infoData.AE_date_to"
                    disabled
                    placeholder="证件到期时间"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="附件"
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
                  <!-- <a @click="fileDownload('AE')">职业健康体检报告</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <div v-if="pageType == 'look'">
              <!--考试信息-->
              <a-divider orientation="left" orientation-margin="0px">
                考试信息
              </a-divider>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 170px' }"
                    label="培训完成时间"
                  >
                    2022年6月6日 11:54:00
                    <!-- {{}} -->
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 170px' }"
                    label="考试通过时间"
                  >
                    2022年6月6日 11:54:00
                    <!-- {{}} -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 100px' }"
                    label="考试成绩"
                  >
                    78分 合格
                    <!-- {{}} -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-button
                    class="buttonType btn_primary"
                    type="primary"
                    @click.stop="lookTestPaperClick()"
                  >
                    查看试卷
                  </a-button>
                </a-col>
              </a-row>
              <!--司押人员通行证-->
              <a-divider orientation="left" orientation-margin="0px">
                司押人员通行证
              </a-divider>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 170px' }"
                    label="证件编号"
                  >
                    <a-input
                      v-model="infoData.AB_date_to"
                      disabled
                      placeholder="审核通过后，自动生成"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8"
                  ><a-button
                    class="buttonType btn_primary"
                    type="primary"
                    @click.stop="printClick()"
                    key="1"
                  >
                    打印
                  </a-button>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 170px' }"
                    label="证件生效时间"
                  >
                    <a-input
                      v-model="infoData.AB_date_to"
                      disabled
                      placeholder="证件生效时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 170px' }"
                    label="证件到期时间"
                  >
                    <a-input
                      v-model="infoData.AB_date_to"
                      disabled
                      placeholder="证件到期时间"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
            <!--审批信息部分-->
            <div>
              <a-divider orientation="left">审批信息</a-divider>
              <!--审批信息表格-->
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
        @ok="handleOk"
        class="modalButtonCenter"
      >
        <!-- <a-form-item label="意见"> -->
        <a-textarea placeholder="请输入意见" v-model="addBlackData.comments" />
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk">
            确认
          </a-button>
          <a-button key="back" @click="addBlackVisible = false">
            取消
          </a-button>
        </template>
        <!-- </a-form-item> -->
      </a-modal>
      <!-- 打印弹窗 -->
      <dc-Model
        :width="'900px'"
        v-model="printVisible"
        :modelConfig="printModelConfig"
      >
        <a-row :gutter="24">
          <a-col :span="14">
            <a-form-item
              label="证件生效时间"
              :labelCol="{ style: 'width: 200px' }"
            >
              <a-date-picker
                format="YYYY-MM-DD HH:mm:ss"
                v-model="infoData.aaaaa"
                placeholder="请选择证件生效时间"
              />
            </a-form-item>
          </a-col>
          <a-col :span="2"> </a-col>
          <a-col :span="8">
            <a-button type="primary" v-print="printConfig">打印</a-button>
          </a-col>
        </a-row>
        <div class="printDivStyle" id="printContent">
          <div class="printInfoDivStyle">
            <a-row :gutter="24" style="text-align: center">
              <a-col :span="5">
                <img src="@/static/Logo/logo.jpeg" width="100%" />
              </a-col>
              <a-col :span="19">
                <b class="printTopTitle">
                  北京燃气集团(天津)液化天然气有限公司
                </b>
                <p
                  class="printTopTitle2"
                  style="font-size: 30px; letter-spacing: 6px"
                >
                  人员通行证
                </p>
              </a-col>
            </a-row>
            <br />
            <a-row :gutter="24" class="printInfoHeight">
              <a-col :span="7">
                <b class="printTitle"> 姓名：</b>
                <b class="printFont">
                  {{ infoData.full_name ? infoData.full_name : "未获取到姓名" }}
                </b>
              </a-col>
              <a-col :span="5">
                <b class="printTitle"> 性别：</b>
                <b class="printFont">
                  {{ infoData.full_name ? infoData.sex : "未获取到性别" }}
                </b>
              </a-col>
              <a-col :span="12">
                <b class="printTitle"> 身份证：</b>
                <b class="printFont">
                  {{ infoData.full_name ? infoData.id_no : "未获取到身份证" }}
                </b>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="18">
                <a-row :gutter="24" class="printInfoHeight">
                  <b class="printTitle">
                    岗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 位:
                  </b>
                  <b class="printFont printCode">
                    {{ infoData.post ? infoData.post : "未获取到岗位名称" }}
                  </b>
                </a-row>
                <a-row :gutter="24" class="printInfoHeight">
                  <b class="printTitle"> 证&nbsp;件&nbsp;编&nbsp;号: </b>
                  <b class="printFont printCode">
                    {{ infoData.code ? infoData.code : "未获取到证件编号" }}
                  </b>
                </a-row>
                <a-row :gutter="24" class="printInfoHeight">
                  <b class="printTitle"> 有&nbsp;效&nbsp;期:</b>
                  <b class="printFont"> 自动带出有效期 </b>
                </a-row>
              </a-col>
              <a-col
                :span="6"
                style="height: 300px; width: 200px; text-align: center"
                class="printCode"
              >
                <b class="printFont"> 照 片</b>
              </a-col>
            </a-row>
          </div>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getList,
  addBlacklist,
  queryFileByParentId,
  approval,
} from "@/api/tankWagonManage/custodiansInfo.js";
import approvalModel from "@/views/tankWagonManage/modules/qualificationReview/modules/component/approvalModel.vue";

export default {
  components: { approvalModel },

  data() {
    return {
      id: "",
      printConfig: {
        id: "printContent",
        popTitle: "",
      },
      //详情弹窗文件空时提示语
      fileNullMsg: "无附件",
      pageType: "",
      //弹窗中数据集合
      infoData: {},
      //加入黑名单原因弹窗
      addBlackVisible: false,
      addBlackData: {},
      //打印弹窗控制
      printVisible: false,
      //审批/详情弹窗
      visible: false,
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
      //查询所需的数据
      searchForm: {
        page_size: 10,
        page_num: 1,
      },
      modelConfig: {
        width: "950px",
        title: "司押人员管理",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //打印弹窗配置
      printModelConfig: {
        width: "950px",
        title: "人员入场通行证-打印",
        cancelText: false,
        footer: "", //是否展示页脚
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
          title: "姓名",
          dataIndex: "full_name",
          width: 100,
          align: "center",
        },
        {
          title: "工作岗位",
          dataIndex: "post",
          width: 90,
          align: "center",
        },
        {
          title: "身份证号",
          dataIndex: "id_no",
          width: 150,
          align: "center",
        },
        {
          title: "联系电话",
          dataIndex: "phone",
          width: 150,
          align: "center",
        },
        {
          title: "推送时间",
          dataIndex: "push_time",
          width: 130,
          align: "center",
        },
        {
          title: "审核人",
          dataIndex: "todo_username",
          width: 90,
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
          width: 200,
          align: "center",
          fixed: "right",
        },
      ],
      // 审批进度
      stepConfiguration: {
        stepProgress: 1,
        stepList: [
          {
            title: "销售公司",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },
          {
            title: "槽车班组",
            name: "曲丽丽",
            dataTime: "2021-05-22 12:00",
          },

          {
            title: "完成",
          },
        ],
      },
      //表格中的数据
      dataSource: [],
      stateOptions: [
        {
          value: "1",
          label: "待审核",
        },
        {
          value: "2",
          label: "审核通过",
        },
        {
          value: "3",
          label: "黑名单",
        },
      ],
      postOptions: [
        {
          value: "司机",
          label: "司机",
        },
        {
          value: "押运员",
          label: "押运员",
        },
        {
          value: "司机,押运员",
          label: "司机,押运员",
        },
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
    //判断<信息待审核><证书有效期不足1个月>加背景
    rowStyle(record) {
      if (record.record_status_name == "待审核") {
        return {
          style: {
            "background-color": "yellow",
          },
        };
      }
    },

    //判断日期是否比当前日期大一个月  是:true,否:false
    dateJudge(date) {
      let dateL = new Date(new Date().setMonth(new Date().getMonth() + 1));
      let dateTo = new Date(date);
      if (dateL >= dateTo) {
        return true;
      } else {
        return false;
      }
    },

    //点击查看，跳转到操作页
    lookClick(value) {
      this.modelConfig.title = "承运商-详情";
      this.pageType = "look";
      //清空id，解决重复进入同一数据时，审批信息不刷新
      this.id = "";
      this.$nextTick(() => {
        this.id = value.id;
      });
      this.infoData = {};
      this.infoData = value;
      this.renderData(value.id);
    },

    //点击审核，跳转审核到审核页面
    approvalClick(value) {
      this.modelConfig.title = "承运商-审核";
      this.pageType = "approval";
      //清空id，解决重复进入同一数据时，审批信息不刷新
      this.id = "";
      this.$nextTick(() => {
        this.id = value.id;
      });
      this.infoData = value;
      this.infoData.approvalComments = "";
      this.renderData(value.id);
    },

    //渲染数据并打开弹窗
    renderData(id) {
      queryFileByParentId(id).then((res) => {
        if (res.code == "200" && res.body) {
          let data = res.body;
          this.infoData.AA_file = [];
          this.infoData.AB_file = [];
          this.infoData.AC_file = [];
          this.infoData.AD_file = [];
          this.infoData.AE_file = [];
          data.forEach((element) => {
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
              this.infoData.AC_date_from = element.date_from;
              this.infoData.AC_date_to = element.date_to;
              this.infoData.AC_doc_no = element.doc_no;
              this.infoData.AC_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AD") {
              this.infoData.AD_date_from = element.date_from;
              this.infoData.AD_date_to = element.date_to;
              this.infoData.AD_doc_no = element.doc_no;
              this.infoData.AD_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AE") {
              this.infoData.AE_date_from = element.date_from;
              this.infoData.AE_date_to = element.date_to;
              this.infoData.AE_doc_no = element.doc_no;
              this.infoData.AE_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            }
          });
        }
        console.log(this.infoData.AA_file);

        this.visible = true;
      });
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

    //证件:AA-身份证/AB-驾驶证/AC-危险品从业资格证/AD-押运证/AE-职业健康体检报告
    //文件下载
    // fileDownload(type) {
    //   queryFileByParentId(this.infoData.id).then((res) => {
    //     let data = res.body;
    //     data.forEach((element) => {
    //       if (element.doc_code == type) {
    //         window.location.href = element.file_path;
    //       }
    //     });
    //   });
    // },

    //文件下载
    fileDownload(filePath) {
      if (filePath) {
        //新窗口打开文件，
        window.open(filePath);
      } else {
        this.$message.warning("文件不存在");
      }
    },

    //点击打印弹出弹窗
    printClick() {
      this.printVisible = true;
    },

    //表格多选框改变触发
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },

    lookTestPaperClick() {
      this.$message.warning("暂无接口");
    },

    //点击行内添加黑名单
    addBlacklistClick(id, id_no) {
      this.addBlackData = {};
      this.addBlackData.id = id;
      this.addBlackData.id_no = id_no;
      this.addBlackVisible = true;
    },

    //确定加入黑名单
    handleOk() {
      if (
        this.addBlackData &&
        this.addBlackData.id &&
        this.addBlackData.comments &&
        this.addBlackData.id_no
      ) {
        this.addBlacklistOperation(
          this.addBlackData.id,
          this.addBlackData.comments,
          this.addBlackData.id_no
        );
      } else {
        this.$message.warning("请输入意见");
      }
    },

    //添加黑名单
    addBlacklistOperation(id, comments, id_no) {
      let params = {
        driver_id: id,
        in_out: "I",
        reason: comments,
        valid: "Y",
        id_no: id_no,
      };
      addBlacklist(params).then((res) => {
        if (res.code == 200) {
          this.$message.success("加入黑名单成功!");
          this.visible = false;
          this.addBlackVisible = false;
          this.getList();
        } else {
          this.$message.warning("加入黑名单失败!");
        }
      });
    },

    //移出黑名单
    removeBlacklistClick(id, id_no) {
      let params = {
        driver_id: id,
        in_out: "O",
        valid: "N",
        id_no: id_no,
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
.printDivStyle {
  background: #ffffff;
  width: 100%;
  align: "left";
}
.printInfoDivStyle {
  margin: 10px;
  padding: 20px;
  /* height: 100px; */
  border: solid 2px rgb(0, 0, 0);
}
.printTopTitle {
  font-size: 34px;
  font-family: FangSong;
  /* letter-spacing: 3px; */
}
.printTopTitle2 {
  font-size: 36px;
  letter-spacing: 6px;
}
.printInfoHeight {
  height: 100px;
}
.printTitle {
  font-size: 30px;
  font-family: FangSong;
}
.printFont {
  font-size: 24px;
}
.printCode {
  width: 100px;
  border: solid 1px rgb(0, 0, 0);
  padding: 5px 100px;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
  min-height: 50px;
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.exportbutton {
  margin-left: 0.8%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}

.ant-form-item {
  margin-bottom: 2px;
}
.TableTop {
  margin-top: 10px;
}
</style>
