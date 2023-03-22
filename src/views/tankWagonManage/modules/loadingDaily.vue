<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'exportComponent',
            isPower: false,
            url: '/LoadingDailyReportController/exportExcel',
          },
        ]"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div class="appMainForm" style="position: relative">
        <a-form-model layout="inline" :model="form">
          <a-col :span="6">
            <a-form-model-item
              label="生产日期:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-range-picker
                v-model="startDate2"
                valueFormat="YYYY-MM-DD"
                @change="onChange"
                :placeholder="['开始日期', '结束日期']"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="填报人"
            >
              <a-input
                v-model="form.informant"
                placeholder="请输入填报人"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="审核状态:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-select
                v-model="form.auditStatus"
                show-search
                placeholder="请选择状态"
                option-filter-prop="children"
                :filter-option="filterOption"
                :getPopupContainer="getPopupContainer"
                allowClear
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
          <a-col :span="6">
            <a-form-model-item>
              <a-button
                v-Query
                class="buttonType"
                type="primary"
                @click="search"
              >
                查询
              </a-button>
              <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
            </a-form-model-item>
          </a-col>
        </a-form-model>
      </div>

      <a-table
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
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
                disabled: $audit.editDisabled(row.auditStatus),
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

      <!-- 新增按钮 -->
      <dc-Model
        :width="'1000px'"
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="DcModel"
      >
        <div :model="surfaceForm">
          <a-layout>
            <a-layout-content>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item
                    label="发布日期:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-date-picker
                      disabled
                      v-model="surfaceForm.issueDate"
                      valueFormat="YYYY-MM-DD"
                      @change="onChange"
                      placeholder="请选择日期"
                    /> </a-form-model-item
                ></a-col>
                <a-col :span="16">
                  <a-form-model-item
                    label="生产日期:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-range-picker
                      disabled
                      show-time
                      v-model="startDate"
                      :disabled="LDType == 'look'"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      :placeholder="['开始日期', '结束日期']"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-model-item
                    label="白班:"
                    :labelCol="{ style: 'width: 150px' }"
                    style="width: 100%"
                  >
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      v-model="surfaceForm.dayWork"
                      show-search
                      placeholder="请选择白班"
                      option-filter-prop="children"
                      :filter-option="filterOption"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in team"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item></a-col
                >
                <a-col :span="8">
                  <a-form-model-item
                    label="小夜:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      v-model="surfaceForm.littleNight"
                      show-search
                      placeholder="请选择小夜"
                      option-filter-prop="children"
                      :filter-option="filterOption"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in team"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8"
                  ><a-form-model-item
                    label="大夜:"
                    :labelCol="{ style: 'width: 150px' }"
                  >
                    <a-select
                      style="width: 100%"
                      :disabled="LDType == 'look'"
                      v-model="surfaceForm.bigNight"
                      show-search
                      placeholder="请选择大夜"
                      option-filter-prop="children"
                      :filter-option="filterOption"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in team"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <table
                border="1"
                style="width: 100%; text-align: center; margin-top: 20px"
              >
                <tr>
                  <th colspan="12">生产数据</th>
                </tr>
                <tr>
                  <td colspan="2">日计划装载量</td>
                  <td colspan="2">次计划装载量</td>
                  <td colspan="2">日实际装载量</td>
                  <td colspan="2">月实际装载量</td>
                  <td colspan="2">年实际装载量</td>
                  <td>年目标装载量</td>
                  <td>目标完成率（%）</td>
                </tr>
                <tr>
                  <td width="10%">
                    {{ surfaceForm.dailyPlanLoadingCountCar }}
                    <!-- <a-input v-model="surfaceForm.dailyPlanLoadingCountCar" /> -->
                  </td>
                  <td width="5%">车</td>
                  <td width="10%">
                    {{ surfaceForm.nextDayPlanLoadingCountCar }}
                    <!-- <a-input v-model="surfaceForm.nextDayPlanLoadingCountCar" /> -->
                  </td>
                  <td width="5%">车</td>
                  <td width="10%">
                    {{ surfaceForm.dailyActualLoadingCountCar }}
                    <!-- <a-input v-model="surfaceForm.dailyActualLoadingCountCar" /> -->
                  </td>
                  <td width="5%">车</td>
                  <td width="10%">
                    {{ surfaceForm.monthActualLoadingCountCar }}
                    <!-- <a-input v-model="surfaceForm.monthActualLoadingCountCar" /> -->
                  </td>
                  <td width="5%">车</td>
                  <td width="10%">
                    {{ surfaceForm.yearActualLoadingCountCar }}
                    <!-- <a-input v-model="surfaceForm.yearActualLoadingCountCar" /> -->
                  </td>
                  <td width="5%">车</td>
                  <td width="15%" rowspan="2">
                    {{ surfaceForm.yearTargetLoadingCount }}
                    <!-- <a-input v-model="surfaceForm.yearTargetLoadingCount" /> -->
                  </td>
                  <td width="15%" rowspan="2">
                    {{ surfaceForm.targetFinishRate }}
                    <!-- <a-input v-model="surfaceForm.targetFinishRate" /> -->
                  </td>
                </tr>
                <tr>
                  <td width="10%">
                    {{ surfaceForm.dailyPlanLoadingCountTon }}
                    <!-- <a-input v-model="surfaceForm.dailyPlanLoadingCountTon" /> -->
                  </td>
                  <td width="5%">t</td>
                  <td width="10%">
                    {{ surfaceForm.nextDayPlanLoadingCountTon }}
                    <!-- <a-input v-model="surfaceForm.nextDayPlanLoadingCountTon" /> -->
                  </td>
                  <td width="5%">t</td>
                  <td width="10%">
                    {{ surfaceForm.dailyActualLoadingCountTon }}
                    <!-- <a-input v-model="surfaceForm.dailyActualLoadingCountTon" /> -->
                  </td>
                  <td width="5%">t</td>
                  <td width="10%">
                    {{ surfaceForm.monthActualLoadingCountTon }}
                    <!-- <a-input v-model="surfaceForm.monthActualLoadingCountTon" /> -->
                  </td>
                  <td width="5%">t</td>
                  <td width="10%">
                    {{ surfaceForm.yearActualLoadingCountTon }}
                    <!-- <a-input v-model="surfaceForm.yearActualLoadingCountTon" /> -->
                  </td>
                  <td width="5%">t</td>
                </tr>
                <tr align="left">
                  <td colspan="12">
                    自<a-date-picker
                      :disabled="LDType == 'look'"
                      @change="Cumulative"
                      style="width: 20%"
                      v-model="surfaceForm.LNGTankerDate"
                      value-format="YYYY-MM-DD"
                    />
                    至今，LNG槽车充装站累计液态外输（
                    {{ surfaceForm.accumulateLiquidExport }}
                    ）吨，累计装载车辆（
                    {{ surfaceForm.accumulateLoadingCar }}
                    ）车。
                  </td>
                </tr>
              </table>
              <table
                border="1"
                style="width: 100%; text-align: center; margin-top: 20px"
              >
                <tr>
                  <th colspan="13">装车撬使用情况</th>
                </tr>
                <tr>
                  <td>装车撬A</td>
                  <td>装车撬B</td>
                  <td>装车撬C</td>
                  <td>装车撬D</td>
                  <td>装车撬E</td>
                  <td>装车撬F</td>
                  <td>装车撬G</td>
                  <td>装车撬H</td>
                  <td>装车撬I</td>
                  <td>装车撬J</td>
                  <td>装车撬K</td>
                  <td>装车撬L</td>
                  <td>装车撬M</td>
                </tr>
                <tr>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryA"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryB"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryC"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryD"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryE"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryF"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryG"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryH"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryI"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryJ"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryK"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryL"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryM"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                </tr>
                <tr>
                  <td>装车撬N</td>
                  <td>装车撬O</td>
                  <td>装车撬P</td>
                  <td>装车撬Q</td>
                  <td>装车撬R</td>
                  <td>装车撬S</td>
                  <td>装车撬T</td>
                  <td>装车撬U</td>
                  <td>装车撬V</td>
                  <td>装车撬W</td>
                  <td>装车撬X</td>
                  <td>装车撬Y</td>
                  <td>装车撬Z</td>
                </tr>
                <tr>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryN"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryO"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryP"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryQ"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryR"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryS"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryT"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryU"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryV"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryW"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryX"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryY"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.loadingPryZ"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                </tr>
                <tr align="left">
                  <td colspan="13">
                    装车撬使用情况说明：<a-input
                      :disabled="LDType == 'look'"
                      style="width: 20%"
                      placeholder="请输入"
                      v-model="surfaceForm.loadingPryRemark"
                    />
                  </td>
                </tr>
              </table>
              <table
                border="1"
                style="width: 100%; text-align: center; margin-top: 20px"
              >
                <tr>
                  <th colspan="5">地磅系统使用情况</th>
                </tr>
                <tr>
                  <td>1#地磅</td>
                  <td>2#地磅</td>
                  <td>3#地磅</td>
                  <td>4#地磅</td>
                  <td style="width: 50%">使用说明</td>
                </tr>
                <tr>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.oneWagonBalance"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.twoWagonBalance"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.threeWagonBalance"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-select
                      :disabled="LDType == 'look'"
                      style="width: 100%"
                      class="company-select"
                      ref="select"
                      v-model="surfaceForm.fourWagonBalance"
                      :options="Loading"
                      placeholder="请选择"
                    ></a-select>
                  </td>
                  <td>
                    <a-input
                      :disabled="LDType == 'look'"
                      :bordered="false"
                      class="company-input"
                      v-model="surfaceForm.wagonBalanceUseRemark"
                      placeholder="请输入"
                    ></a-input>
                  </td>
                </tr>
              </table>
              <table
                border="1"
                style="width: 100%; text-align: center; margin-top: 20px"
              >
                <tr>
                  <th colspan="7">现场生产动态</th>
                </tr>
                <tr>
                  <td>序号</td>
                  <td>作业内容</td>
                  <td>作业类别</td>
                  <td>作业单位</td>
                  <td>工作期限</td>
                  <td>完成情况</td>
                  <td>负责人</td>
                </tr>
                <tr v-for="(item, index) in ProductionTrends" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.WorkContent }}</td>
                  <td>{{ item.OperationTypeName }}</td>
                  <td>{{ item.WorkUnit }}</td>
                  <td>{{ item.A }}</td>
                  <td>{{ item.RecordStatus }}</td>
                  <td>{{ item.PersonInCharge }}</td>
                </tr>
              </table>
              <table
                border="1"
                style="width: 100%; text-align: center; margin-top: 20px"
              >
                <tr>
                  <td>填表人：{{ surfaceForm.informant }}</td>
                  <td>审核人：{{ surfaceForm.toDoUserName }}</td>
                  <td>编制部门：{{ surfaceForm.establishDepartment }}</td>
                </tr>
              </table>

              <!--审批页签部分-->
              <div v-if="LDType == 'look' || LDType == 'approval'">
                <stepsModel
                  ref="stepsModel"
                  :isShow="LDType === 'approval' ? true : false"
                  :id="id"
                />
              </div>
            </a-layout-content>
            <a-layout-footer>
              <a-button
                type="primary"
                @click.stop="save"
                v-if="LDType == 'edit'"
              >
                保存
              </a-button>

              <a-button
                v-Add
                v-if="
                  (LDType == 'edit' || LDType == 'add') &&
                  surfaceForm.auditStatus
                "
                class="buttonType"
                type="primary"
                @click.stop="save('sunmit')"
              >
                提交
              </a-button>
              <a-button
                type="primary"
                v-if="LDType == 'approval'"
                @click="approvalCommit()"
              >
                确定
              </a-button>
              <a-button class="buttonType" @click="visibleAddNew = false">
                取消
              </a-button>
            </a-layout-footer>
          </a-layout>
        </div>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  findAllList,
  update,
  statisticLNG,
  queryOperationCondition,
  monthPlanAudio,
  submitForAddOrUpdate,
} from "@/api/loadingDaily.js";
import stepsModel from "@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/stepsModel.vue";
export default {
  components: { stepsModel },
  data() {
    return {
      id: "",
      operation: false,
      form: {},
      LDType: "",
      Loading: [
        { value: "正常", label: "正常" },
        { value: "备用", label: "备用" },
        { value: "维修中", label: "维修中" },
      ],
      team: [
        { value: "一班", label: "一班" },
        { value: "二班", label: "二班" },
        { value: "三班", label: "三班" },
        { value: "四班", label: "四班" },
        { value: "五班", label: "五班" },
      ],
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
          value: "4",
          label: "已审批",
        },
        {
          value: "5",
          label: "已拒绝",
        },
      ],
      surfaceForm: {},
      startDate: [],
      startDate2: [],
      visibleAddNew: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: "950px",
        title: "外输管道月报",
        cancelText: false,
        footer: "", //是否展示页脚
      },
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
          width: 50,
          align: "center",
        },
        {
          title: "发布日期",
          dataIndex: "issueDate",
          ellipsis: true,
          align: "center",
          width: 100,
        },
        {
          title: "生产日期",
          dataIndex: "startProductionDate",
          ellipsis: true,
          align: "center",
          width: 150,
        },
        {
          title: "编制部门",
          dataIndex: "establishDepartment",
          ellipsis: true,
          align: "center",
          width: 180,
        },
        {
          title: "日实际装载量(车)",
          ellipsis: true,
          dataIndex: "dailyActualLoadingCountCar",
          align: "center",
          width: 100,
        },
        {
          title: "日实际装载量(t)",
          ellipsis: true,
          dataIndex: "dailyActualLoadingCountTon",
          align: "center",
          width: 100,
        },
        {
          title: "填报人",
          ellipsis: true,
          dataIndex: "informant",
          align: "center",
          width: 100,
        },
        {
          title: "审核状态",
          ellipsis: true,
          dataIndex: "auditStatusName",
          align: "center",
          fixed: "right",
          width: 100,
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
      ProductionTrends: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCancel() {
      this.visibleAddNew = false;
    },
    // 提交
    CSubmit() {
      submitForAddOrUpdate(this.surfaceForm.id).then((res) => {
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
      let params = {
        id: this.surfaceForm.id,
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
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    Cumulative(date) {
      statisticLNG({ LNGTankerDate: date }).then((res) => {
        this.surfaceForm.accumulateLiquidExport =
          res.body[0].dailyActualLoadingCountTon;
        this.surfaceForm.accumulateLoadingCar =
          res.body[0].dailyPlanLoadingCountCar;
      });
    },
    edit(row) {
      this.LDType = "edit";
      let obj2 = JSON.parse(JSON.stringify(row));
      this.surfaceForm = obj2;
      this.visibleAddNew = true;
      // this.$router.push({
      //   path: "/loadingDailyDetail",
      // });
      this.operation = true;
      this.addNewModelConfig.title = "装车日报-编辑";
      this.startDate[0] = this.surfaceForm.startProductionDate;
      this.startDate[1] = this.surfaceForm.endProductionDate;
      queryOperationCondition({
        startProductionDate: this.surfaceForm.startProductionDate,
      }).then((res) => {
        this.ProductionTrends = res.body;
      });
    },
    look(row) {
      this.LDType = "look";
      this.surfaceForm = row;

      this.operation = false;
      this.visibleAddNew = true;
      this.addNewModelConfig.title = "装车日报-详情";
      this.startDate[0] = this.surfaceForm.startProductionDate;
      this.startDate[1] = this.surfaceForm.endProductionDate;
      this.id = "";
      this.$nextTick(() => {
        this.id = row.id;
      });
      queryOperationCondition({
        startProductionDate: this.surfaceForm.startProductionDate,
      }).then((res) => {
        this.ProductionTrends = res.body;
      });
    },
    //点击表格中审批按钮
    approvalClick(val) {
      this.look(val);
      this.LDType = "approval";
    },
    save(value) {
      this.LDType = "save";
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
    },
    exportClick() {
      this.$message.success("导出");
    },
    getList() {
      findAllList(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
        this.dataSource.forEach((element) => {
          if (element.auditStatus == 1) {
            element.auditStatusName = "已保存";
          } else if (element.auditStatus == 2) {
            element.auditStatusName = "已提交";
          } else if (element.auditStatus == 3) {
            element.auditStatusName = "审批中";
          } else if (element.auditStatus == 4) {
            element.auditStatusName = "已审批";
          } else if (element.auditStatus == 5) {
            element.auditStatusName = "已拒绝";
          }
        });

        this.pagination.total = res.body.total;
      });
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
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getList();
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key;
    },
    //重置输入
    resetForm() {
      this.form = {};
      this.startDate2 = [];
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    //日期的
    onChange(date, dateString) {
      if (date) {
        this.form.startProductionDate = date[0];
        this.form.endProductionDate = date[1];
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
#components-layout-demo-basic > .ant-layout{
  margin-bottom: 0px;
}

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item-control {
  width: 100%;
}

/* .ant-select-selection--single {
  width: 180px;
} */
/deep/.ant-select-selection--single {
  width: 100%;
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