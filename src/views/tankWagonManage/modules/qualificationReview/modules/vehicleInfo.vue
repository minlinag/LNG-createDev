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
            url: '/customerVehicle/exportExcel',
            params: {
              idList: selectedRowKeys != '' ? selectedRowKeys : '',
              full_name:
                selectedRowKeys == '' && searchForm.full_name
                  ? searchForm.full_name
                  : '',
              plate_number:
                selectedRowKeys == '' && searchForm.plate_number
                  ? searchForm.plate_number
                  : '',
              type_name:
                selectedRowKeys == '' && searchForm.type_name
                  ? searchForm.type_name
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
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="承运商名称"
                  >
                    <a-input
                      v-model="searchForm.full_name"
                      placeholder="请输入承运商名称"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="车牌号"
                  >
                    <a-input
                      v-model="searchForm.plate_number"
                      placeholder="请输入车牌号"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="车辆类型"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchForm.type_name"
                      :options="vehicleInfoTypeOptions"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
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
                <a-col :span="4">
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
        <!-- :customRow="rowStyle" -->
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
            @addBlacklist="addBlacklistClick(row.id, row.plate_number)"
            @removeBlacklist="removeBlacklistClick(row.id, row.plate_number)"
            @approval="approvalClick(row)"
            @look="lookClick(row)"
          ></pe-button>
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
                <a-form-item
                  label="车牌号"
                  :labelCol="{ style: 'width: 100px' }"
                >
                  <a-input
                    v-model="infoData.plate_number"
                    disabled
                    placeholder="车牌号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="承运商名称"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    v-model="infoData.full_name"
                    disabled
                    placeholder="承运商名称"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="车辆类型"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-input
                    v-model="infoData.type_name"
                    disabled
                    placeholder="车辆类型"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="车辆品牌"
                >
                  <a-input
                    v-model="infoData.brand_name"
                    disabled
                    placeholder="车辆品牌"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="核定转载量"
                >
                  <a-input
                    v-model="infoData.loading_capacity"
                    disabled
                    placeholder="核定转载量"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="最大工作压力"
                >
                  <a-input
                    v-model="infoData.pressure"
                    disabled
                    placeholder="最大工作压力"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="容积"
                >
                  <a-input
                    v-model="infoData.tank_capacity"
                    disabled
                    placeholder="容积"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>

            <!--资质证件-->
            <!-- <a-divider orientation="left">资质证件</a-divider> -->
            <!--车辆行驶证-->
            <a-divider orientation="left" orientation-margin="0px"
              >车辆行驶证</a-divider
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
                  >
                    {{ fileNullMsg }}
                  </span>
                </a-form-model-item>
              </a-col>
            </a-row>

            <!--道路危险货物运输许可证-->
            <a-divider orientation="left" orientation-margin="0px"
              >道路危险货物运输许可证</a-divider
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
                  >
                    {{ fileNullMsg }}
                  </span>
                  <!-- <a @click="fileDownload('AB')">道路危险货物运输许可证</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--注册登记摘要信息栏页-->
            <a-divider orientation="left" orientation-margin="0px">
              注册登记摘要信息栏页
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
                  >
                    {{ fileNullMsg }}
                  </span>
                  <!-- <a @click="fileDownload('AC')">注册登记摘要信息栏页</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--牵引车气瓶合格证-->
            <a-divider orientation="left" orientation-margin="0px">
              牵引车气瓶合格证
            </a-divider>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="资质证号"
                >
                  <a-input
                    v-model="infoData.AJ_doc_no"
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
                    v-model="infoData.AJ_date_from"
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
                    v-model="infoData.AJ_date_to"
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
                    v-for="(item, index) in infoData.AJ_file"
                    :key="index"
                    @click="fileDownload(item.filePath)"
                    >{{ item.fileName }}&nbsp;&nbsp;&nbsp;&nbsp;</a
                  >
                  <span
                    v-if="
                      infoData.AJ_file == undefined ||
                      infoData.AJ_file.length == '0'
                    "
                  >
                    {{ fileNullMsg }}
                  </span>
                  <!-- <a @click="fileDownload('AJ')">牵引车气瓶合格证</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--压力容器使用登记证-->
            <a-divider orientation="left" orientation-margin="0px">
              压力容器使用登记证
            </a-divider>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="资质证号"
                >
                  <a-input
                    v-model="infoData.AF_doc_no"
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
                    v-model="infoData.AF_date_from"
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
                    v-model="infoData.AF_date_to"
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
                  >
                    {{ fileNullMsg }}
                  </span>
                  <!-- <a @click="fileDownload('AF')">压力容器使用登记证</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <!--交强险-->
            <a-divider orientation="left" orientation-margin="0px">
              交强险
            </a-divider>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-model-item
                  :labelCol="{ style: 'width: 100px' }"
                  label="资质证号"
                >
                  <a-input
                    v-model="infoData.BA_doc_no"
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
                    v-model="infoData.BA_date_from"
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
                    v-model="infoData.BA_date_to"
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
                  >
                    {{ fileNullMsg }}
                  </span>
                  <!-- <a @click="fileDownload('BA')">交强险</a> -->
                </a-form-model-item>
              </a-col>
            </a-row>
            <div v-if="pageType == 'look'">
              <!--车辆通行证-->
              <a-divider orientation="left" orientation-margin="0px">
                车辆通行证
              </a-divider>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
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
                    :labelCol="{ style: 'width: 150px' }"
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
        <a-textarea placeholder="请输入意见" v-model="addBlackData.comments" />
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk">
            确认
          </a-button>
          <a-button key="back" @click="addBlackVisible = false">
            取消
          </a-button>
        </template>
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
                  牵引车/半挂车通行证
                </p>
              </a-col>
            </a-row>
            <br />
            <a-row :gutter="24" class="printInfoHeight">
              <b class="printTitle">
                单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：
              </b>
              <b class="printFont">{{
                infoData.full_name ? infoData.full_name : "未获取到单位名称"
              }}</b>
            </a-row>
            <a-row :gutter="24" class="printInfoHeight">
              <b class="printTitle"> 牵引车/半挂车车牌号: </b>
              <b class="printFont">
                {{
                  infoData.plate_number
                    ? infoData.plate_number
                    : "未获取到车牌号"
                }}
              </b>
            </a-row>
            <a-row :gutter="24" class="printInfoHeight">
              <b class="printTitle"> 证&nbsp;件&nbsp;编&nbsp;号: </b>
              <span class="printFont printCode">
                {{ infoData.code ? infoData.code : "未获取到证件编号" }}
              </span>
            </a-row>
            <a-row :gutter="24" class="printInfoHeight">
              <b class="printTitle"> 有&nbsp;效&nbsp;期:</b>
              <b class="printFont"> 自动带出有效期 </b>
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
} from "@/api/tankWagonManage/vehicleInfo.js";
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
      //打印弹窗控制
      printVisible: false,
      pageType: "",
      //加入黑名单原因弹窗
      addBlackVisible: false,
      addBlackData: {},
      //弹窗中数据集合
      infoData: {},
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
        title: "车辆管理",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //打印弹窗配置
      printModelConfig: {
        width: "950px",
        title: "车辆入场通行证-打印",
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
          title: "承运商名称",
          dataIndex: "full_name",
          width: 150,
          align: "center",
        },
        {
          title: "车牌号",
          dataIndex: "plate_number",
          width: 100,
          align: "center",
        },
        {
          title: "车辆类型",
          dataIndex: "type_name",
          width: 90,
          align: "center",
        },
        {
          title: "行驶证到期时间",
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
      //审批表格  页面下方表格的列属性
      approvalColumns: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: 70,
          align: "center",
        },
        {
          title: "审批节点",
          dataIndex: "jd",
          width: 150,
          align: "center",
        },
        {
          title: "审批人",
          dataIndex: "spr",
          width: 150,
          align: "center",
        },
        {
          title: "审批时间",
          dataIndex: "spsj",
          width: 200,
          align: "center",
        },
        {
          title: "审批意见",
          dataIndex: "spyj",
          width: 150,
          align: "center",
        },
      ],
      //审批表格中的数据
      approvalDataSource: [
        {
          id: 1,
          jd: "销售公司",
          spr: "销售公司用户",
          spsj: "2022年9月9日 8:50:36",
          spyj: "同意",
        },
        {
          id: 2,
          jd: "槽车班组",
          spr: "张工",
          spsj: "2022年9月9日 10:30:00",
          spyj: "同意",
        },
      ],
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
      vehicleInfoTypeOptions: [
        {
          value: "牵引车",
          label: "牵引车",
        },
        {
          value: "挂车",
          label: "挂车",
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
      if (
        !record.aa_date_to ||
        this.dateJudge(record.aa_date_to) ||
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

    //点击审核，跳转审核到审核页面
    approvalClick(value) {
      this.modelConfig.title = "车辆信息-审核";
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

    //点击行内添加黑名单
    addBlacklistClick(id, plate_number) {
      this.addBlackData = {};
      this.addBlackData.id = id;
      this.addBlackData.plate_number = plate_number;
      this.addBlackVisible = true;
    },

    //确定加入黑名单
    handleOk() {
      if (
        this.addBlackData &&
        this.addBlackData.id &&
        this.addBlackData.comments &&
        this.addBlackData.plate_number
      ) {
        this.addBlacklistOperation(
          this.addBlackData.id,
          this.addBlackData.comments,
          this.addBlackData.plate_number
        );
      } else {
        this.$message.warning("请输入意见");
      }
    },

    //添加黑名单
    addBlacklistOperation(id, comments, plate_number) {
      let params = {
        vehicle_id: id,
        in_out: "I",
        reason: comments,
        valid: "Y",
        plate_number: plate_number,
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
    removeBlacklistClick(id, plate_number) {
      let params = {
        vehicle_id: id,
        in_out: "O",
        valid: "N",
        plate_number: plate_number,
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

    //点击查看，跳转到操作页
    lookClick(value) {
      this.modelConfig.title = "车辆信息-详情";
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
    /**
     * 证件:AA-车辆行驶证/AB-道路运输证/AC-注册登记摘要信息栏页/AD-车辆产品合格证/AE-罐体体检报告/
     * AF-移动式压力容器实用登记证/AG-特种设备制造许可证/AH-安全阀检验/AI-压力表检验/
     * AJ-气瓶合格证/BA-保单信息
     */
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
          this.infoData.AF_file = [];
          this.infoData.AG_file = [];
          this.infoData.AH_file = [];
          this.infoData.AI_file = [];
          this.infoData.AJ_file = [];
          this.infoData.BA_file = [];
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
            } else if (element.doc_code == "AF") {
              this.infoData.AF_date_from = element.date_from;
              this.infoData.AF_date_to = element.date_to;
              this.infoData.AF_doc_no = element.doc_no;
              this.infoData.AF_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AG") {
              this.infoData.AG_date_from = element.date_from;
              this.infoData.AG_date_to = element.date_to;
              this.infoData.AG_doc_no = element.doc_no;
              this.infoData.AG_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AH") {
              this.infoData.AH_date_from = element.date_from;
              this.infoData.AH_date_to = element.date_to;
              this.infoData.AH_doc_no = element.doc_no;
              this.infoData.AH_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AI") {
              this.infoData.AI_date_from = element.date_from;
              this.infoData.AI_date_to = element.date_to;
              this.infoData.AI_doc_no = element.doc_no;
              this.infoData.AI_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "AJ") {
              this.infoData.AJ_date_from = element.date_from;
              this.infoData.AJ_date_to = element.date_to;
              this.infoData.AJ_doc_no = element.doc_no;
              this.infoData.AJ_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            } else if (element.doc_code == "BA") {
              this.infoData.BA_date_from = element.date_from;
              this.infoData.BA_date_to = element.date_to;
              this.infoData.BA_doc_no = element.doc_no;
              this.infoData.BA_file.push({
                fileName: element.file_name,
                filePath: element.file_path,
              });
            }
          });
        }
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

    //获得当前页面
    getList() {
      getList(this.searchForm).then((res) => {
        this.dataSource = res.body.list;
        this.pagination.current = res.body.pageNum;
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

    // 点击确定删除
    deleteClick() {
      this.deleteOperation();
    },
  },
};
</script>
<style scoped>
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
  font-size: 26px;
}
.printCode {
  width: 100%;
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

.TableTop {
  margin-top: 10px;
}

.ant-form-item {
  margin-bottom: 3px;
}

.addMargins {
  margin: 0 2%;
}
</style>
// 去除打印的页眉页脚
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 8mm; /* this affects the margin in the printer settings */
}
</style>
// 去除打印的页眉页脚
