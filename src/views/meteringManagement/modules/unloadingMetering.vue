<template>
  <Breadcrumb>
    <!-- 右上角功能按钮 -->
    <template slot="breadcrumbButton">
      <!-- 导出规则：表格有选中项优先导出选中项，无选中项按查询条件导出，查询条件为空时导出全部 -->
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
          {
            value: 'Download',
            clickName: 'downloadTemplate',
            name: '导入模板下载',
            icon: 'export-icon',
            isPower: false,
          },
          {
            value: 'importComponent',
            url: '/unloadingMeasure/importExcel',
            accept: '.xlsx',
            modalHint: ['根据下载模板格式导入'],
          },
          {
            value: 'exportComponent',
            icon: 'export-icon',
            url: '/unloadingMeasure/exportExcel',
            params: {
              idList: selectedRowKeys != '' ? selectedRowKeys : '',
              loadingPort:
                selectedRowKeys == '' && searchForm.loadingPort
                  ? searchForm.loadingPort
                  : '',
              shipName:
                selectedRowKeys == '' && searchForm.shipName
                  ? searchForm.shipName
                  : '',
              nature:
                selectedRowKeys == '' && searchForm.nature
                  ? searchForm.nature
                  : '',
              source:
                selectedRowKeys == '' && searchForm.source
                  ? searchForm.source
                  : '',
              startTime:
                selectedRowKeys == '' && searchForm.dateRange
                  ? searchForm.dateRange[0]
                  : '',
              endTime:
                selectedRowKeys == '' && searchForm.dateRange
                  ? searchForm.dateRange[1]
                  : '',
            },
          },
        ]"
        @addClick="addClick"
        @deleteClick="deleteClick"
        @downloadTemplate="downloadTemplate"
      ></pe-button>
    </template>
    <!--主页面-->
    <template slot="appMain">
      <!--查询条件及按钮-->
      <div style="position: relative" class="position-changeList">
        <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline" :model="searchForm">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="装货港"
                  >
                    <a-input
                      v-model="searchForm.loadingPort"
                      placeholder="请输入装货港"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="船名"
                  >
                    <a-input
                      v-model="searchForm.shipName"
                      placeholder="请输入船名"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="性质"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchForm.nature"
                      :options="natureOption"
                      :getPopupContainer="getPopupContainer"
                    ></a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="船型"
                  >
                    <a-select
                      placeholder="请选择"
                      v-model="searchForm.shipType"
                      :options="shipTypeOptions"
                      :getPopupContainer="getPopupContainer"
                    ></a-select>
                    <!-- <a-input
                      v-model="searchForm.shipType"
                      placeholder="请输入船型"
                    ></a-input> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="来源"
                  >
                    <a-input
                      v-model="searchForm.source"
                      placeholder="请输入来源"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    label="接船日期:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-range-picker
                      v-model="dateRange"
                      valueFormat="YYYY-MM-DD"
                      :placeholder="['开始日期', '结束日期']"
                      :getCalendarContainer="getPopupContainer"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item>
                    <a-button
                      class="buttonType"
                      type="primary"
                      @click.stop="searchClick()"
                    >
                      查询
                    </a-button>
                    <a-button
                      class="buttonType"
                      @click.stop="resetSearchForm()"
                    >
                      重置
                    </a-button>
                  </a-form-model-item>
                </a-col>
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
      </div>

      <!-- 表格 -->
      <dc-table
        :scroll="{ y: 1, x: 100 }"
        class="unloadTable list_table_2"
        bordered
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
          fixed: true,
        }"
        :pagination="pagination"
        :columns="columnsDub"
        :dataSource="dataSource"
        :openSelector="true"
        :customRow="rowStyle"
      >
        <!-- 下载 -->
        <template
          slot="attachment"
          slot-scope="row"
          v-if="row.index != '本页合计' && row.index != '均值'"
        >
          <span class="edit" v-Edit @click="download(row)">下载</span>
        </template>
        <!-- 行内操作列按钮 -->
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
                disabled: row.status == '1',
              },
              {
                value: '详情',
                type: 'link',
                clickName: 'look',
                style: ['btn_link'],
              },
            ]"
            @edit="editClick(row)"
            @look="lookClick(row)"
          ></pe-button>
        </template>
      </dc-table>
      <!-- 新增弹窗 -->
      <dc-Model
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="from-style bigModel"
      >
        <!--基础信息表单-->
        <div style="position: relative">
          <a-form :form="infoForm" layout="horizontal" autoComplete="off">
            <a-divider orientation="left">基础信息</a-divider>
            <a-row>
              <a-form-item label="编号" v-show="false">
                <a-input v-decorator="['id']" />
              </a-form-item>
              <a-col :span="8">
                <a-form-item label="创建人">
                  <a-input
                    disabled
                    v-decorator="['createdUser']"
                    placeholder="（自动带入）"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="编制单位">
                  <a-input
                    disabled
                    v-decorator="['createUserSubsidiaryOrgan']"
                    placeholder="（自动带入）"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="编制日期">
                  <a-input
                    disabled
                    v-decorator="['createdDateTime']"
                    placeholder="（自动带入）"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="船总序号">
                  <a-input
                    v-decorator="['shipNo']"
                    disabled
                    placeholder="(自动生成)"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="船当年序号">
                  <a-input
                    v-decorator="['shipNoByYear']"
                    disabled
                    placeholder="(自动生成)"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="投产总计(m³)">
                  <a-input
                    v-decorator="['totalProduction_M3']"
                    disabled
                    placeholder="(提交后自动生成)"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="投产总计(t)">
                  <a-input
                    v-decorator="['totalProduction_T']"
                    disabled
                    placeholder="(提交后自动生成)"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="投产总计(Nm3)">
                  <a-input
                    v-decorator="['totalProduction_NM3']"
                    disabled
                    placeholder="(提交后自动生成)"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="当年总计(m³)">
                  <a-input
                    v-decorator="['totalProduction_M3']"
                    disabled
                    placeholder="(提交后自动生成)"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="当年总计(t)">
                  <a-input
                    v-decorator="['totalProduction_T']"
                    disabled
                    placeholder="(提交后自动生成)"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="当年总计(Nm3)">
                  <a-input
                    v-decorator="['totalProduction_NM3']"
                    disabled
                    placeholder="(提交后自动生成)"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider orientation="left">卸船信息</a-divider>
            <a-row>
              <a-col :span="8" class="position-changeList_model">
                <a-form-item label="性质">
                  <a-select
                    placeholder="请选择"
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'nature',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请选择性质',
                          },
                        ],
                      },
                    ]"
                    :options="natureOption"
                    :getPopupContainer="getPopupContainer_model"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="船名">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'shipName',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入船名',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入船名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8" class="position-changeList_model">
                <a-form-item label="接船日期">
                  <a-date-picker
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'receivingDate',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请选择接船时间',
                          },
                        ],
                      },
                    ]"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择接船时间"
                    :getCalendarContainer="getPopupContainer_model"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8" class="position-changeList_model">
                <a-form-item label="船型">
                  <a-select
                    placeholder="请选择"
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'shipType',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请选择船型',
                          },
                        ],
                      },
                    ]"
                    :options="shipTypeOptions"
                    :getPopupContainer="getPopupContainer_model"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="装货港">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'loadingPort',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入装货港',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入装货港"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="来源">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'source',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入来源',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入来源"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="出港体积(m³)">
                  <a-input
                    :disabled="pageType == 'look'"
                    placeholder="请输入出港体积"
                    v-decorator="[
                      'departureVolume',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入出港体积',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="卸前体积(m³)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'beforeUnloadVolume',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入卸前体积',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入卸前体积"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="卸货质量(t)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'unloadQuality',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入卸货质量',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入卸货质量"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="卸后体积(m³)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'afterUnloadVolume',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入卸后体积',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入卸后体积"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="卸货标方(Nm³)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'unloadNm3',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入卸货标方',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入卸货标方"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider orientation="left">分析报告</a-divider>

            <a-row>
              <a-col :span="16" class="rangePickerWidth">
                <a-form-item label="取样时间" class="position-changeList_model">
                  <a-range-picker
                    :disabled="pageType == 'look'"
                    show-time
                    v-decorator="[
                      'sampleStartDateRange',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请选择取样时间',
                          },
                        ],
                      },
                    ]"
                    :getCalendarContainer="getPopupContainer_model"
                  >
                  </a-range-picker>
                </a-form-item>
              </a-col>

              <!-- 分开需判断起始时间小于结束时间 -->
              <!-- <a-col :span="8">
              <a-form-item
                
                label="取样起始时间"
              >
                <a-date-picker
                  :disabled="pageType == 'look'"
                  show-time
                  v-decorator="[
                    'sampleStartDate',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择取样起始时间',
                        },
                      ],
                    },
                  ]"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择取样起始时间"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                
                label="取样结束时间"
              >
                <a-date-picker
                  :disabled="pageType == 'look'"
                  show-time
                  v-decorator="[
                    'sampleEndDate',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择取样结束时间',
                        },
                      ],
                    },
                  ]"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择取样结束时间"
                />
              </a-form-item>
            </a-col> -->
              <a-col :span="8">
                <a-form-item label="甲烷(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'methane',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入甲烷',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入甲烷"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="异戊烷(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'lsopentane',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入异戊烷',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入异戊烷"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="乙烷(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'ethane',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入乙烷',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入乙烷"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="正戊烷(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'npentane',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入正戊烷',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入正戊烷"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="丙烷(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'propane',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入丙烷',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入丙烷"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="正己烷(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'nhexane',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入正己烷',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入正己烷"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="异丁烷(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'lsobutane',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入异丁烷',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入异丁烷"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="氮气(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'n2',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入氮气',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入氮气"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="正丁烷(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'nbutane',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入正丁烷',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入正丁烷"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="二氧化碳(mol%)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'co2',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入二氧化碳',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入二氧化碳"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="热值(MMBtu)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'calorificValueMMBtu',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入热值MMBtu',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入热值MMBtu"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="热值(GJ)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'calorificValueGJ',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入热值GJ',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入热值GJ"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="密度(液相)(kg/m3)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'density',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入密度（液相）',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入密度（液相）"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="密度(20℃)(kg/m3)">
                  <a-input
                    :disabled="pageType == 'look'"
                    v-decorator="[
                      'density20C',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入密度(20℃)',
                          },
                        ],
                      },
                    ]"
                    placeholder="请输入密度(20℃)"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="附件">
                  <div style="display: flex">
                    <file-upload
                      :Text="'上传文件'"
                      @fileChange="fileListChange"
                      :echoList="fileList"
                      ref="importConpontsDataRef"
                      :disabled="pageType == 'look' || pageType == 'approval'"
                    ></file-upload>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="ant-modal-footer">
          <a-button
            type="primary"
            v-if="pageType != 'look'"
            @click="saveClick()"
          >
            保存
          </a-button>
          <a-button
            type="primary"
            v-if="pageType != 'look'"
            @click="submitClick()"
          >
            提交
          </a-button>
          <a-button @click="modelCencel()">取消</a-button>
        </div>
      </dc-Model>
      <!-- 查看弹窗 -->
      <dc-Model
        v-model="visibleLook"
        :modelConfig="lookModelConfig"
        class="DcModel"
      >
        <a-layout>
          <a-layout-content>
            <table width="100%" id="printContent" class="tableStyle tableBrder">
              <tr>
                <td colspan="6" class="tableTitle">&nbsp;&nbsp;基础信息</td>
              </tr>
              <tr>
                <td width="17%" class="textAlignRight table_item">
                  编制人&nbsp;
                </td>
                <td width="16%">{{ lookForm.createdUser }}</td>
                <td width="16%" class="textAlignRight table_item">
                  编制单位&nbsp;
                </td>
                <td width="16%">{{ lookForm.createUserSubsidiaryOrgan }}</td>
                <td width="12%" class="textAlignRight table_item">
                  编制日期&nbsp;
                </td>
                <td width="20%">{{ lookForm.createdDateTime }}</td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">船总序号&nbsp;</td>
                <td>{{ lookForm.shipNo }}</td>
                <td class="textAlignRight table_item">船当年序号&nbsp;</td>
                <td>{{ lookForm.shipNoByYear }}</td>
                <td class="textAlignRight table_item">状 态&nbsp;</td>
                <td>{{ lookForm.statusName }}</td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">投产总计&nbsp;</td>
                <td>
                  {{ lookForm.totalProduction_M3 }}
                  <span style="float: right">m³&nbsp;&nbsp;</span>
                </td>
                <td colspan="2">
                  {{ lookForm.totalProduction_T }}
                  <span style="float: right">t&nbsp;&nbsp;</span>
                </td>
                <td colspan="2">
                  {{ lookForm.totalProduction_NM3 }}
                  <span style="float: right">Nm³&nbsp;&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">当年总计&nbsp;</td>
                <td>
                  {{ lookForm.totalYear_M3 }}
                  <span style="float: right">m³&nbsp;&nbsp;</span>
                </td>
                <td colspan="2">
                  {{ lookForm.totalYear_T }}
                  <span style="float: right">t&nbsp;&nbsp;</span>
                </td>
                <td colspan="2">
                  {{ lookForm.totalYear_T }}
                  <span style="float: right">Nm³&nbsp;&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td colspan="6" class="tableTitle">&nbsp;&nbsp;卸船信息</td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">性质&nbsp;</td>
                <td colspan="2">{{ lookForm.natureName }}</td>
                <td class="textAlignRight table_item">船名&nbsp;</td>
                <td colspan="2">{{ lookForm.shipName }}</td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">接船日期&nbsp;</td>
                <td colspan="2">{{ lookForm.receivingDate }}</td>
                <td class="textAlignRight table_item">船型&nbsp;</td>
                <td colspan="2">{{ lookForm.shipTypeName }}</td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">装货港&nbsp;</td>
                <td colspan="2">{{ lookForm.loadingPort }}</td>
                <td class="textAlignRight table_item">来源&nbsp;</td>
                <td colspan="2">{{ lookForm.source }}</td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">出港体积,m³&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.departureVolume }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">卸前体积,m³&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.beforeUnloadVolume }}
                  <span style="float: right"></span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">卸货质量,t&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.unloadQuality }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">卸后体积,m³&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.afterUnloadVolume }}
                  <span style="float: right"></span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">卸货标方,Nm³&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.unloadNm3 }}
                  <span style="float: right"></span>
                </td>
                <td></td>
                <td colspan="2"></td>
              </tr>
              <tr>
                <td colspan="6" class="tableTitle">&nbsp;&nbsp;分析报告</td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">取样起始时间&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.sampleStartDate }}
                </td>
                <td class="textAlignRight table_item">取样结束时间&nbsp;</td>
                <td colspan="2">{{ lookForm.sampleEndDate }}</td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">甲烷,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.methane }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">异戊烷,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.lsopentane }}
                  <span style="float: right"></span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">乙烷,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.ethane }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">正戊烷,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.npentane }}
                  <span style="float: right"></span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">丙烷,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.propane }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">正己烷,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.nhexane }}
                  <span style="float: right"></span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">异丁烷,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.lsobutane }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">氮气,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.n2 }}
                  <span style="float: right"></span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">正丁烷,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.nbutane }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">二氧化碳,mol%&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.co2 }}
                  <span style="float: right"></span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">热值,MMBtu&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.calorificValueMMBtu }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">热值,GJ&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.calorificValueGJ }}
                  <span style="float: right"></span>
                </td>
              </tr>
              <tr>
                <td class="textAlignRight table_item">
                  密度(液相),kg/m3&nbsp;
                </td>
                <td colspan="2">
                  {{ lookForm.density }}
                  <span style="float: right"></span>
                </td>
                <td class="textAlignRight table_item">密度(20℃),kg/m3&nbsp;</td>
                <td colspan="2">
                  {{ lookForm.density20C }}
                  <span style="float: right"></span>
                </td>
              </tr>
            </table>
            <br />
            <a-form-item label="附件" :labelCol="{ style: 'width: 100px' }">
              <file-upload
                :Text="'上传文件'"
                @fileChange="fileListChange"
                :echoList="fileList"
                ref="importConpontsDataRef"
                :disabled="pageType == 'look' || pageType == 'approval'"
              ></file-upload>
            </a-form-item>
          </a-layout-content>
          <a-layout-footer>
            <div
              class="ant-modal-footer"
              style="text-align: center"
              v-if="pageType == 'look'"
            >
              <a-button type="primary" v-print="printConfig" key="1"
                >打印</a-button
              >
              <a-button @click="modelCencel()">取消</a-button>
            </div>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import utils from "@/utils/url";
import {
  getListForPage as getList,
  add,
  // addWithAtt,
  edit,
  // editWithAtt,
  deletes,
  queryShipNo,
} from "@/api/meteringManagement/unloadingMetering.js";
import { encodelevel as getDict } from "@/api/dataDictionary.js";
import fileUpload from "@/components/upLoad/fileUpload";
import moment from "moment";

export default {
  components: { fileUpload },
  data() {
    return {
      printConfig: {
        id: "printContent",
        popTitle: "",
      },
      infoForm: this.$form.createForm(this),
      pageType: "",
      fileList: [],
      //文件下载地址
      urls: "fileinfo/downloadFile",
      //合计行显示消息
      // sumMsg: "",
      //平均值行显示消息
      // averageMsg: "",
      stateInfo: [],
      //卸前体积（用于计算）
      // beforeUnloadVolume: 0,
      //卸后体积（用于计算）
      // afterUnloadVolume: 0,
      //翻页页面组件
      pagination: {
        current: 0,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["12", "22", "32", "42", "52", "62"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 12, // 每页条数，所有页设置统一的条数
      },
      //页面下方表格的列属性
      columnsDub: [
        {
          title: "序号",
          dataIndex: "index",

          // customRender: (text, record, index) =>
          //   `${
          //     (this.pagination.current - 1) * this.pagination.pageSize +
          //     index +
          //     1
          //   }`,
          width: 80,
          align: "center",
        },
        {
          title: "当年船序号",
          dataIndex: "shipNoByYear",
          align: "center",
          width: 100,
        },
        {
          title: "船总序号",
          dataIndex: "shipNo",
          width: 100,
          align: "center",
        },
        {
          title: "当年总计",
          children: [
            {
              title: "m3",
              dataIndex: "totalYear_M3",
              width: 100,
              align: "center",
            },
            {
              title: "t",
              dataIndex: "totalYear_T",
              width: 100,
              align: "center",
            },
            {
              title: "Nm3",
              dataIndex: "totalYear_NM3",
              width: 100,
              align: "center",
            },
          ],
          align: "center",
        },
        {
          title: "投产总计",
          children: [
            {
              title: "m3",
              dataIndex: "totalProduction_M3",
              width: 100,
              align: "center",
            },
            {
              title: "t",
              dataIndex: "totalProduction_T",
              width: 100,
              align: "center",
            },
            {
              title: "Nm3",
              dataIndex: "totalProduction_NM3",
              width: 100,
              align: "center",
            },
          ],
          align: "center",
        },
        {
          title: "性质",
          dataIndex: "natureName",
          width: 150,
          align: "center",
        },
        {
          title: "装货港",
          dataIndex: "loadingPort",
          width: 150,
          align: "center",
        },
        {
          title: "接船日期",
          dataIndex: "receivingDate",
          width: 150,
          align: "center",
        },
        {
          title: "来源",
          dataIndex: "source",
          width: 150,
          align: "center",
        },
        {
          title: "船名",
          dataIndex: "shipName",
          width: 150,
          align: "center",
        },
        {
          title: "出港体积 m3",
          dataIndex: "departureVolume",
          width: 180,
          align: "center",
        },
        {
          title: "卸前体积 m3",
          dataIndex: "beforeUnloadVolume",
          width: 180,
          align: "center",
        },
        {
          title: "卸后体积 m3",
          dataIndex: "afterUnloadVolume",
          width: 180,
          align: "center",
        },
        {
          title: "卸货体积 m3",
          dataIndex: "unloadVolume",
          width: 150,
          align: "center",
        },
        {
          title: "卸货质量 t",
          dataIndex: "unloadQuality",
          width: 150,
          align: "center",
        },
        {
          title: "取样起始时间",
          dataIndex: "sampleStartDate",
          width: 150,
          align: "center",
        },
        {
          title: "取样结束时间",
          dataIndex: "sampleEndDate",
          width: 150,
          align: "center",
        },
        {
          title: "甲烷 mol%",
          dataIndex: "methane",
          width: 150,
          align: "center",
        },
        {
          title: "乙烷 mol%",
          dataIndex: "ethane",
          align: "center",
          width: 150,
        },
        {
          title: "丙烷 mol%",
          dataIndex: "propane",
          width: 150,
          align: "center",
        },
        {
          title: "异丁烷 mol%",
          dataIndex: "lsobutane",
          width: 150,
          align: "center",
        },
        {
          title: "正丁烷 mol%",
          dataIndex: "nbutane",
          width: 150,
          align: "center",
        },
        {
          title: "异戊烷 mol%",
          dataIndex: "lsopentane",
          width: 150,
          align: "center",
        },
        {
          title: "正戊烷 mol%",
          dataIndex: "npentane",
          width: 150,
          align: "center",
        },
        {
          title: "正己烷 mol%",
          dataIndex: "nhexane",
          width: 150,
          align: "center",
        },
        {
          title: "氮气 mol%",
          dataIndex: "n2",
          width: 150,
          align: "center",
        },
        {
          title: "二氧化碳 mol%",
          dataIndex: "co2",
          width: 150,
          align: "center",
        },
        {
          title: "热值 GJ",
          dataIndex: "calorificValueGJ",
          width: 150,
          align: "center",
        },
        {
          title: "热值 MMBtu",
          dataIndex: "calorificValueMMBtu",
          width: 150,
          align: "center",
        },
        {
          title: "密度(液相) kg/m3",
          dataIndex: "density",
          width: 150,
          align: "center",
        },
        {
          title: "密度(20℃) kg/m3",
          dataIndex: "density20C",
          width: 150,
          align: "center",
        },
        {
          title: "卸货标方 Nm3",
          dataIndex: "unloadNm3",
          width: 150,
          align: "center",
        },
        {
          title: "船型",
          dataIndex: "shipTypeName",
          width: 150,
          align: "center",
        },
        // {
        //   title: "附件",
        //   scopedSlots: { customRender: "attachment" },
        //   align: "center",
        //   width: 100,
        // },
        {
          title: "状态",
          dataIndex: "statusName",
          width: 150,
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
      //勾选框/选择框组件
      selectedRowKeys: [],
      //回传组件
      echoMap: {},
      //查看组件中的数值
      lookForm: {},
      //查询条件日期范围选择器
      dateRange: [],
      //查询所需的数据
      searchForm: {
        pageNum: 1,
        pageSize: 10,
      },
      shipTypeOptions: [
        {
          value: "1",
          label: "薄膜型",
        },
        {
          value: "2",
          label: "球罐型",
        },
        {
          value: "3",
          label: "菱形",
        },
      ],
      natureOptions: [
        {
          value: "1",
          label: "长约",
        },
        {
          value: "2",
          label: "现货",
        },
      ],
      //新增是否visible
      visibleAddNew: false,
      //查看是否visible
      visibleLook: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: "1000px",
        title: "卸船计量-新增",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //查看的弹窗的相关设置
      lookModelConfig: {
        width: "950px",
        title: "卸船计量-详情",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      //表格中的数据
      dataSource: [],
      natureOption: [],
      statisticsData: [],
    };
  },
  mounted() {
    this.getDict();
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

    //设置合计行 均值行  多选框不可选择
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.index === "本页合计" || record.index === "均值",
        name: record.name,
      },
    }),

    //获取字典数据
    getDict() {
      getDict({ dictCode: "JLGL-XCJL-XZ" }).then((res) => {
        res.body.data.forEach((item) => {
          this.natureOption.push({
            label: item.dictname,
            value: item.dictcode,
          });
        });
      });
    },

    //文件下载
    download(value) {
      window.location.href =
        utils.baseURL + this.urls + "?" + "relatedId=" + value.id;
    },
    //导入模板下载
    downloadTemplate() {
      window.location.href =
        utils.baseURL + "/unloadingMeasure/downloadTemplate";
    },

    //获得表格数据
    getList() {
      getList(this.searchForm).then((res) => {
        this.dataSource = res.body.data;
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize + 2;
        this.pagination.total = res.body.total;
        this.dataSource.forEach((element) => {
          this.shipTypeOptions.forEach((shipType) => {
            if (element.shipType == shipType.value) {
              element.shipTypeName = shipType.label;
            }
          });
          // element.shipTypeName =
        });
        if (this.dataSource.length > 0) {
          this.getSum();
        }
      });
      //清空表格多选框
      this.selectedRowKeys = [];
    },
    //关闭弹窗  重新加载表格  清空文件控件
    modelCencel() {
      this.visibleAddNew = false;
      this.visibleLook = false;
      this.getList();
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
    },

    //修改数据
    editOperation(value) {
      edit(value).then((res) => {
        if (res.code == 200) {
          this.$message.success(
            value.get("status") == "0" ? "编辑成功！" : "提交成功！"
          );
          //关闭弹窗
          this.modelCencel();
        } else {
          this.$message.error(
            value.get("status") == "0" ? "编辑失败！" : "提交失败！"
          );
        }
      });
    },
    //新增数据
    addOperation(value) {
      add(value).then((res) => {
        if (res.code == 200) {
          this.$message.success("新增成功！");
          //关闭弹窗
          this.modelCencel();
        } else {
          this.$message.error("新增失败！");
        }
      });
    },

    //点击删除按钮，删除数据
    deleteClick() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请选择！");
      } else {
        let visibleDelete = true;
        this.selectedRowKeys.forEach((id) => {
          let row = this.dataSource.find((item) => id === item.id);
          if (row.status === "1") {
            visibleDelete = false;
          }
        });
        if (visibleDelete) {
          deletes(this.selectedRowKeys).then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功！");
              //清空表格多选框
              this.selectedRowKeys = [];
              this.getList();
            } else {
              this.$message.error("删除失败！");
            }
          });
        } else {
          this.$message.warning("“已完成”状态不可删除,请重新选择");
        }
      }
    },

    // 合计
    getSum() {
      let unloadVolume = 0;
      let unloadQuality = 0;
      let unloadNm3 = 0;
      let calorificValueGJ = 0;
      let calorificValueMMBtu = 0;
      let density = 0;
      let density20C = 0;
      let averageDensity = 0;
      let averageDensity20C = 0;
      this.dataSource.forEach((item, index) => {
        item.index =
          (this.pagination.current - 1) * (this.pagination.pageSize - 2) +
          index +
          1;
        unloadVolume = this.accAdd(
          unloadVolume,
          isNaN(new Number(item.unloadVolume))
            ? 0
            : new Number(item.unloadVolume)
        );
        unloadQuality = this.accAdd(
          unloadQuality,
          isNaN(new Number(item.unloadQuality))
            ? 0
            : new Number(item.unloadQuality)
        );
        unloadNm3 = this.accAdd(
          unloadNm3,
          isNaN(new Number(item.unloadNm3)) ? 0 : new Number(item.unloadNm3)
        );
        calorificValueGJ = this.accAdd(
          calorificValueGJ,
          isNaN(new Number(item.calorificValueGJ))
            ? 0
            : new Number(item.calorificValueGJ)
        );
        calorificValueMMBtu = this.accAdd(
          calorificValueMMBtu,
          isNaN(new Number(item.calorificValueMMBtu))
            ? 0
            : new Number(item.calorificValueMMBtu)
        );
        density = this.accAdd(
          density,
          isNaN(new Number(item.density)) ? 0 : new Number(item.density)
        );
        density20C = this.accAdd(
          density20C,
          isNaN(new Number(item.density20C)) ? 0 : new Number(item.density20C)
        );
        averageDensity = this.accAdd(
          averageDensity,
          isNaN(new Number(item.averageDensity))
            ? 0
            : new Number(item.averageDensity)
        );
        averageDensity20C = this.accAdd(
          averageDensity20C,
          isNaN(new Number(item.averageDensity20C))
            ? 0
            : new Number(item.averageDensity20C)
        );
        //失真 弃用
        //后台传String，直接+是拼接，需转Number进行计算
        // unloadVolume += isNaN(new Number(item.unloadVolume))
        //   ? 0
        //   : new Number(item.unloadVolume);
        // unloadQuality += isNaN(new Number(item.unloadQuality))
        //   ? 0
        //   : new Number(item.unloadQuality);
        // unloadNm3 += isNaN(new Number(item.unloadNm3))
        //   ? 0
        //   : new Number(item.unloadNm3);
        // calorificValueGJ += isNaN(new Number(item.calorificValueGJ))
        //   ? 0
        //   : new Number(item.calorificValueGJ);
        // calorificValueMMBtu += isNaN(new Number(item.calorificValueMMBtu))
        //   ? 0
        //   : new Number(item.calorificValueMMBtu);
        // density += isNaN(new Number(item.density))
        //   ? 0
        //   : new Number(item.density);
        // density20C += isNaN(new Number(item.density20C))
        //   ? 0
        //   : new Number(item.density20C);
      });
      //取平均值
      if (this.dataSource.length > 0) {
        averageDensity = density / this.dataSource.length;
        averageDensity20C = density20C / this.dataSource.length;
      }
      let sumData = {
        id: "-999",
        index: "本页合计",
        unloadVolume: unloadVolume.toFixed(2),
        unloadQuality: unloadQuality.toFixed(2),
        unloadNm3: unloadNm3.toFixed(2),
        calorificValueGJ: calorificValueGJ.toFixed(2),
        calorificValueMMBtu: calorificValueMMBtu.toFixed(2),
      };

      let avgData = {
        id: "-1000",
        index: "均值",
        density: averageDensity.toFixed(2),
        density20C: averageDensity20C.toFixed(2),
      };

      this.dataSource.push(sumData);
      this.dataSource.push(avgData);
      // this.sumMsg = `本页合计 卸货体积：${unloadVolume} m³   卸货质量：${unloadQuality} t
      //   卸货标方：${unloadNm3} Nm³   热值：${calorificValueGJ} GJ   热值：${calorificValueMMBtu} MMBTU`;
      // this.averageMsg = `本页均值 密度（液相）：${averageDensity} kg/m3  密度(20℃)：${averageDensity20C} kg/m3`;
    },

    //加法
    accAdd(arg1, arg2) {
      var r1, r2, m;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (arg1 * m + arg2 * m) / m;
    },

    //选择的key，这里为id
    onSelectChange(keys) {
      this.selectedRowKeys = keys;
    },

    //点击新增，弹出新增弹窗
    addClick() {
      this.pageType = "add";
      //清空表单
      this.infoForm.resetFields();
      //清空文件选择器
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      this.fileList = [];
      this.addNewModelConfig.title = "卸船计量-新增";
      this.visibleAddNew = true;
      queryShipNo().then((data) => {
        this.infoForm.setFieldsValue({
          createdUser: this.$store.state.user.name,
          createUserSubsidiaryOrgan: this.$store.state.user.unitName,
          createdDateTime: this.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
          shipNo: data.body.shipNo,
          shipNoByYear: data.body.shipNoByYear,
        });
      });
    },

    //点击行内编辑按钮
    editClick(row) {
      this.pageType = "edit";
      this.visibleAddNew = true;
      //清空表单
      this.infoForm.resetFields();
      //清空文件选择器
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      //附件回显
      if (row.fileInfo) {
        let obj2 = JSON.parse(JSON.stringify(row));
        this.fileList = JSON.parse(obj2.fileInfo);
      }

      this.addNewModelConfig.title = "卸船计量-编辑";
      let sampleStartDateRange = [
        moment(row.sampleStartDate),
        moment(row.sampleEndDate),
      ];
      //回显数据
      setTimeout(() => {
        this.infoForm.setFieldsValue({
          id: row.id,
          createdUser: row.createdUser,
          createUserSubsidiaryOrgan: row.createUserSubsidiaryOrgan,
          createdDateTime: row.createdDateTime,
          shipNo: row.shipNo,
          shipNoByYear: row.shipNoByYear,
          nature: row.nature,
          shipName: row.shipName,
          receivingDate: row.receivingDate,
          shipType: row.shipType,
          loadingPort: row.loadingPort,
          source: row.source,
          departureVolume: row.departureVolume,
          beforeUnloadVolume: row.beforeUnloadVolume,
          unloadQuality: row.unloadQuality,
          afterUnloadVolume: row.afterUnloadVolume,
          unloadNm3: row.unloadNm3,
          sampleStartDateRange: sampleStartDateRange,
          // sampleStartDate: row.sampleStartDate,
          // sampleEndDate: row.sampleEndDate,
          methane: row.methane,
          lsopentane: row.lsopentane,
          ethane: row.ethane,
          npentane: row.npentane,
          propane: row.propane,
          nhexane: row.nhexane,
          lsobutane: row.lsobutane,
          n2: row.n2,
          nbutane: row.nbutane,
          co2: row.co2,
          calorificValueMMBtu: row.calorificValueMMBtu,
          calorificValueGJ: row.calorificValueGJ,
          density: row.density,
          density20C: row.density20C,
        });
      }, 100);
    },
    //点击弹窗中的保存按钮
    saveClick() {
      this.infoForm.validateFields((err, value) => {
        if (!err) {
          var formData = new FormData();
          //附件
          let filelist = [];
          if (this.fileList) {
            this.fileList.forEach((element) => {
              let row = { id: element.id, fileName: element.fileName };
              filelist.push(row);
            });
            formData.append(`fileInfo`, JSON.stringify(filelist));
          }

          //保存是已保存状态（0）
          formData.append("status", "0");
          formData.append("shipNo", value.shipNo);
          formData.append("shipNoByYear", value.shipNoByYear);
          formData.append("nature", value.nature);
          formData.append("shipName", value.shipName);
          formData.append("receivingDate", value.receivingDate);
          formData.append("shipType", value.shipType);
          formData.append("loadingPort", value.loadingPort);
          formData.append("source", value.source);
          formData.append("departureVolume", value.departureVolume);
          formData.append("beforeUnloadVolume", value.beforeUnloadVolume);
          formData.append("unloadQuality", value.unloadQuality);
          formData.append("afterUnloadVolume", value.afterUnloadVolume);
          formData.append("unloadNm3", value.unloadNm3);
          formData.append(
            "sampleStartDate",
            this.formatDate(
              new Date(value.sampleStartDateRange[0]),
              "yyyy-MM-dd HH:mm:ss"
            )
          );
          formData.append(
            "sampleEndDate",
            this.formatDate(
              new Date(value.sampleStartDateRange[1]),
              "yyyy-MM-dd HH:mm:ss"
            )
          );
          formData.append("methane", value.methane);
          formData.append("lsopentane", value.lsopentane);
          formData.append("ethane", value.ethane);
          formData.append("npentane", value.npentane);
          formData.append("propane", value.propane);
          formData.append("nhexane", value.nhexane);
          formData.append("lsobutane", value.lsobutane);
          formData.append("n2", value.n2);
          formData.append("nbutane", value.nbutane);
          formData.append("co2", value.co2);
          formData.append("calorificValueMMBtu", value.calorificValueMMBtu);
          formData.append("calorificValueGJ", value.calorificValueGJ);
          formData.append("density", value.density);
          formData.append("density20C", value.density20C);
          if (value.id) {
            formData.append("id", value.id);
            this.editOperation(formData);
          } else {
            this.addOperation(formData);
          }
        } else {
          this.$message.warning("必填信息输入不完整");
        }
      });
    },

    //点击提交
    submitClick() {
      this.infoForm.validateFields((err, value) => {
        if (!err) {
          var formData = new FormData();
          formData.append("file", this.fileList);
          formData.append("id", value.id);
          formData.append("status", "1");
          formData.append("shipNo", value.shipNo);
          formData.append("shipNoByYear", value.shipNoByYear);
          formData.append("nature", value.nature);
          formData.append("shipName", value.shipName);
          formData.append("receivingDate", value.receivingDate);
          formData.append("shipType", value.shipType);
          formData.append("loadingPort", value.loadingPort);
          formData.append("source", value.source);
          formData.append("departureVolume", value.departureVolume);
          formData.append("beforeUnloadVolume", value.beforeUnloadVolume);
          formData.append("unloadQuality", value.unloadQuality);
          formData.append("afterUnloadVolume", value.afterUnloadVolume);
          formData.append("unloadNm3", value.unloadNm3);
          formData.append(
            "sampleStartDate",
            this.formatDate(
              new Date(value.sampleStartDateRange[0]),
              "yyyy-MM-dd HH:mm:ss"
            )
          );
          formData.append(
            "sampleEndDate",
            this.formatDate(
              new Date(value.sampleStartDateRange[1]),
              "yyyy-MM-dd HH:mm:ss"
            )
          );
          // formData.append("sampleStartDate", value.sampleStartDate);
          // formData.append("sampleEndDate", value.sampleEndDate);
          formData.append("methane", value.methane);
          formData.append("lsopentane", value.lsopentane);
          formData.append("ethane", value.ethane);
          formData.append("npentane", value.npentane);
          formData.append("propane", value.propane);
          formData.append("nhexane", value.nhexane);
          formData.append("lsobutane", value.lsobutane);
          formData.append("n2", value.n2);
          formData.append("nbutane", value.nbutane);
          formData.append("co2", value.co2);
          formData.append("calorificValueMMBtu", value.calorificValueMMBtu);
          formData.append("calorificValueGJ", value.calorificValueGJ);
          formData.append("density", value.density);
          formData.append("density20C", value.density20C);
          if (value.id) {
            this.editOperation(formData);
          } else {
            this.addOperation(formData);
          }
        }
      });
    },

    //查看弹窗相关按钮
    lookClick(row) {
      this.pageType = "look";
      //清空文件选择器
      if (this.$refs.importConpontsDataRef) {
        this.$refs.importConpontsDataRef.removeFile();
      }
      //附件回显
      if (row.fileInfo) {
        let obj2 = JSON.parse(JSON.stringify(row));
        this.fileList = JSON.parse(obj2.fileInfo);
      }

      this.lookForm = row;
      this.visibleLook = true;

      /**
       * 表单形式展示，无法打印，弃用
       */
      //打开弹窗
      // this.visibleAddNew = true;
      //清空表单
      // this.infoForm.resetFields();
      // //清空文件选择器
      // if (this.$refs.importConpontsDataRef) {
      //   this.$refs.importConpontsDataRef.removeFile();
      // }
      // //附件回显
      // if (row.fileInfo) {
      //   let obj2 = JSON.parse(JSON.stringify(row));
      //   this.fileList = JSON.parse(obj2.fileInfo);
      // }
      // this.addNewModelConfig.title = "卸船计量-详情";
      // let sampleStartDateRange = [
      //   moment(row.sampleStartDate),
      //   moment(row.sampleEndDate),
      // ];
      // //回显数据
      // setTimeout(() => {
      //   this.infoForm.setFieldsValue({
      //     createdUser: row.createdUser,
      //     createUserSubsidiaryOrgan: row.createUserSubsidiaryOrgan,
      //     createdDateTime: row.createdDateTime,
      //     shipNo: row.shipNo,
      //     shipNoByYear: row.shipNoByYear,
      //     nature: row.nature,
      //     shipName: row.shipName,
      //     receivingDate: row.receivingDate,
      //     totalYear_M3: row.totalYear_M3,
      //     totalYear_T: row.totalYear_T,
      //     totalYear_NM3: row.totalYear_NM3,
      //     totalProduction_M3: row.totalProduction_M3,
      //     totalProduction_T: row.totalProduction_T,
      //     totalProduction_NM3: row.totalProduction_NM3,
      //     shipType: row.shipType,
      //     loadingPort: row.loadingPort,
      //     source: row.source,
      //     departureVolume: row.departureVolume,
      //     beforeUnloadVolume: row.beforeUnloadVolume,
      //     unloadQuality: row.unloadQuality,
      //     afterUnloadVolume: row.afterUnloadVolume,
      //     unloadNm3: row.unloadNm3,
      //     sampleStartDateRange: sampleStartDateRange,
      //     methane: row.methane,
      //     lsopentane: row.lsopentane,
      //     ethane: row.ethane,
      //     npentane: row.npentane,
      //     propane: row.propane,
      //     nhexane: row.nhexane,
      //     lsobutane: row.lsobutane,
      //     n2: row.n2,
      //     nbutane: row.nbutane,
      //     co2: row.co2,
      //     calorificValueMMBtu: row.calorificValueMMBtu,
      //     calorificValueGJ: row.calorificValueGJ,
      //     density: row.density,
      //     density20C: row.density20C,
      //   });
      // }, 100);
    },

    //点击查询按钮，根据条件查询表格数据
    searchClick() {
      if (this.dateRange.length != 0) {
        this.searchForm.startTime = this.dateRange[0];
        this.searchForm.endTime = this.dateRange[1];
      } else {
        delete this.searchForm.startTime;
        delete this.searchForm.endTime;
      }
      if (this.searchForm) {
        this.searchForm.pageNum = 1;
        this.searchForm.pageSize = 10;
        this.getList();
      } else {
        this.getList();
      }
    },

    //页面变更
    paginationChange(pagination) {
      this.searchForm.pageNum = pagination.current;
      this.searchForm.pageSize = pagination.pageSize - 2;
      this.getList();
    },

    //重置输入
    resetSearchForm() {
      this.searchForm = {};
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.dateRange = [];
      this.getList();
    },

    fileListChange(val) {
      this.fileList = val;
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
<style scoped >
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
/* div /deep/ .ant-modal-body {
  height: 500px;
} */
.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}
table tr td {
  height: 35px;
}
.tableTitle {
  background-color: #edeaea;
  font-size: 16px;
  text-align: left;
  color: black;

  /* color: aliceblue; */
}

.textAlignRight {
  text-align: right;
}
.tableStyle {
  text-align: center;
  font-size: 14px;
}
.table_item {
  color: black;
}
.tableBrder {
  border: #f6f3f3 2px solid;
}
.tableBrder tr td,
th {
  border: 2px solid #e8e8e8;
}

.rangePickerWidth .ant-form-item-control .ant-input {
  width: 280px !important;
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
