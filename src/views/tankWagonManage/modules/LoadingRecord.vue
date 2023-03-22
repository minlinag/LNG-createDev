<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'exportComponent',
            isPower: false,
            url: '/LoadingRecord/exportExcel',
          },
        ]"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div class="appMainForm" style="position: relative">
        <a-form-model layout="inline" :model="form">
          <a-col :span="6">
            <a-form-model-item
              label="装车时间:"
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
              :labelCol="{ style: 'width: 150px' }"
              label="牵引车号"
            >
              <a-input
                v-model="form.number_tractor"
                placeholder="请输入牵引车号"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              :labelCol="{ style: 'width: 150px' }"
              label="驾驶员"
            >
              <a-input
                v-model="form.name_driver"
                placeholder="请输入驾驶员"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item
              label="承运商:"
              :labelCol="{ style: 'width: 150px' }"
            >
              <a-select
                v-model="form.carrier_name"
                show-search
                placeholder="请选择承运商"
                option-filter-prop="children"
                :filter-option="filterOption"
                :getPopupContainer="getPopupContainer"
              >
                <a-select-option
                  :value="item.name"
                  v-for="(item, index) in stateInfo"
                  :key="index"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-form-model-item style="float: right">
            <a-button v-Query class="buttonType" type="primary" @click="search">
              查询
            </a-button>
            <a-button class="buttonType" @click="resetForm"> 重置 </a-button>
          </a-form-model-item>
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
          <span class="edit" @click="look(row)">详情</span>
        </template>
      </a-table>
      <dc-Model
        v-model="visibleAddNew"
        :modelConfig="addNewModelConfig"
        class="from-style bigModel"
      >
        <div>
          <a-form-model layout="inline" :model="surfaceForm">
            <a-divider orientation="left" style="font-weight: bolder">
              基础信息
            </a-divider>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="装车编号：">
                  <a-input
                    disabled
                    placeholder="请输入装车编号"
                    v-model="surfaceForm.loading_number"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="装车日期：">
                  <a-date-picker
                    style="width: 100%"
                    disabled
                    v-model="surfaceForm.loading_start_time"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    @change="onChange"
                    placeholder="请选择装车日期"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="计划装车量(t)：">
                  <a-input
                    disabled
                    placeholder="请输入计划装车量"
                    v-model="surfaceForm.loadingCount"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="叫车时间：">
                  <a-date-picker
                    style="width: 100%"
                    disabled
                    v-model="surfaceForm.call_car_time"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    @change="onChange"
                    placeholder="请选择叫车时间"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="派车时间：">
                  <a-date-picker
                    style="width: 100%"
                    disabled
                    v-model="surfaceForm.create_time"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    @change="onChange"
                    placeholder="请选择派车时间"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-divider orientation="left" style="font-weight: bolder">
              单位信息
            </a-divider>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="承运商：">
                  <a-input
                    disabled
                    placeholder="请输入承运商"
                    v-model="surfaceForm.carrier_name"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="现场紧急联系人：">
                  <a-input
                    disabled
                    placeholder="请输入现场紧急联系人"
                    v-model="surfaceForm.emergencyContact"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="联系电话：">
                  <a-input
                    disabled
                    placeholder="请输入联系电话"
                    v-model="surfaceForm.contactNumber"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-divider orientation="left" style="font-weight: bolder">
              车辆信息
            </a-divider>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="牵引车号：">
                  <a-input
                    disabled
                    placeholder="请输入牵引车号"
                    v-model="surfaceForm.number_tractor"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="挂车号：">
                  <a-input
                    disabled
                    placeholder="请输入挂车号"
                    v-model="surfaceForm.number_trailer"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-divider orientation="left" style="font-weight: bolder">
              人员信息
            </a-divider>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="司机：">
                  <a-input
                    disabled
                    placeholder="请输入司机"
                    v-model="surfaceForm.name_driver"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="司机身份证号：">
                  <a-input
                    disabled
                    placeholder="请输入司机身份证号"
                    v-model="surfaceForm.id_no_driver"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="联系电话">
                  <a-input
                    disabled
                    placeholder="请输入联系电话"
                    v-model="surfaceForm.phone_driver"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="押运员：">
                  <a-input
                    disabled
                    placeholder="请输入押运员"
                    v-model="surfaceForm.name_escort"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="押运员身份证号">
                  <a-input
                    disabled
                    placeholder="请输入押运员身份证号"
                    v-model="surfaceForm.id_no_escort"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="联系电话">
                  <a-input
                    disabled
                    placeholder="请输入联系电话"
                    v-model="surfaceForm.phone_escort"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <p style="margin-top: 1rem; margin-left: 3rem; font-weight: bolder">
              销售公司安检信息： <span>安全通过</span>
              <span
                style="color: #4fc2f1; margin-left: 10px"
                @click="securityCheck"
                >&nbsp;&nbsp;&nbsp;&nbsp;查看详情</span
              >
            </p>

            <a-divider orientation="left" style="font-weight: bolder">
              安检信息
            </a-divider>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="安全时间：">
                  <a-date-picker
                    style="width: 100%"
                    disabled
                    v-model="surfaceForm.enter_time"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    @change="onChange"
                    placeholder="请选择安全时间"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="安检结果：">
                  <a-input
                    disabled
                    placeholder="请输入安检结果"
                    v-model="surfaceForm.car_status"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="槽车进站前检查确认表：">
                  <span style="color: #4fc2f1" @click="ConfirmationForm('jz')">
                    下载文件
                  </span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-divider orientation="left" style="font-weight: bolder">
              装车信息
            </a-divider>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="装车量(t)：">
                  <a-input
                    disabled
                    placeholder="请输入装车量"
                    v-model="surfaceForm.loadingCount"
                  />
                </a-form-model-item>
              </a-col>
              <template v-if="LoadingInformation">
                <a-col :span="8">
                  <a-form-model-item label="提单号(t)：">
                    <a-input
                      disabled
                      placeholder="请输入提单号"
                      v-model="surfaceForm2.ladingBillNum"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="装车撬位：">
                    <a-input
                      disabled
                      placeholder="请输入装车撬位"
                      v-model="surfaceForm2.loadingPryLocate"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="装车开始时间：">
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="surfaceForm2.loading_start_time"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      placeholder="请选择装车开始时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="装车结束时间：">
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="surfaceForm2.loading_end_time"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      placeholder="请选择装车结束时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="地磅号(入)：">
                    <a-input
                      disabled
                      placeholder="请输入地磅号(入)"
                      v-model="surfaceForm2.wagonBalanceNumIn"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="时间(入)：">
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="surfaceForm2.timeIn"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      placeholder="请选择时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="皮重(kg)：">
                    <a-input
                      disabled
                      placeholder="请输入皮重"
                      v-model="surfaceForm2.tareWeight"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="地磅号(出)：">
                    <a-input
                      disabled
                      placeholder="请输入地磅号(出)"
                      v-model="surfaceForm2.wagonBalanceNumOut"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="时间(出)：">
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="surfaceForm2.timeOut"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      placeholder="请选择时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="毛重(kg)：">
                    <a-input
                      disabled
                      placeholder="请输入毛重"
                      v-model="surfaceForm2.roughWeight"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="净重(kg)：">
                    <a-input
                      disabled
                      placeholder="请输入净重"
                      v-model="surfaceForm2.suttle"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="体积(Nm³)：">
                    <a-input
                      disabled
                      placeholder="请输入体积"
                      v-model="surfaceForm2.volume"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="密度(kg/m³)：">
                    <a-input
                      disabled
                      placeholder="请输入密度"
                      v-model="surfaceForm2.density"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="总热值(KJ)：">
                    <a-input
                      disabled
                      placeholder="请输入总热值"
                      v-model="surfaceForm2.grossCalorificValue"
                    />
                  </a-form-model-item>
                </a-col>
                <a-divider
                  orientation="left"
                  style="font-weight: bolder"
                ></a-divider>
                <a-col :span="16">
                  <a-form-model-item label="槽车装车前后安全检查表：">
                    <span
                      style="color: #4fc2f1"
                      @click="ConfirmationForm('zc')"
                    >
                      下载文件
                    </span>
                  </a-form-model-item>
                </a-col>
              </template>

              <a-col :span="8">
                <a-form-model-item label="装车单：">
                  <a-input
                    disabled
                    placeholder="请输入装车单"
                    v-model="surfaceForm2.LoadingOdd"
                  />
                </a-form-model-item>
              </a-col>

              <template>
                <a-col :span="8">
                  <a-form-model-item label="提单号(t)：">
                    <a-input
                      disabled
                      placeholder="请输入提单号"
                      v-model="surfaceForm3.ladingBillNum"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="装车撬位：">
                    <a-input
                      disabled
                      placeholder="请输入装车撬位"
                      v-model="surfaceForm3.loadingPryLocate"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="装车开始时间：">
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="surfaceForm3.loading_start_time"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      placeholder="请选择装车开始时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="装车结束时间：">
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="surfaceForm3.loading_end_time"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      placeholder="请选择装车结束时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="地磅号(入)：">
                    <a-input
                      disabled
                      placeholder="请输入地磅号(入)"
                      v-model="surfaceForm3.wagonBalanceNumIn"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="时间(入)：">
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="surfaceForm3.timeIn"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      placeholder="请选择时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="皮重(kg)：">
                    <a-input
                      disabled
                      placeholder="请输入皮重"
                      v-model="surfaceForm3.tareWeight"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="地磅号(出)：">
                    <a-input
                      disabled
                      placeholder="请输入地磅号(出)"
                      v-model="surfaceForm3.wagonBalanceNumOut"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="时间(出)：">
                    <a-date-picker
                      style="width: 100%"
                      disabled
                      v-model="surfaceForm3.timeOut"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss"
                      @change="onChange"
                      placeholder="请选择时间"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="毛重(kg)：">
                    <a-input
                      disabled
                      placeholder="请输入毛重"
                      v-model="surfaceForm3.roughWeight"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="净重(kg)：">
                    <a-input
                      disabled
                      placeholder="请输入净重"
                      v-model="surfaceForm3.suttle"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="体积(Nm³)：">
                    <a-input
                      disabled
                      placeholder="请输入体积"
                      v-model="surfaceForm3.volume"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="密度(kg/m³)：">
                    <a-input
                      disabled
                      placeholder="请输入密度"
                      v-model="surfaceForm3.density"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item label="总热值(KJ)：">
                    <a-input
                      disabled
                      placeholder="请输入总热值"
                      v-model="surfaceForm3.grossCalorificValue"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="16">
                  <a-form-model-item label="槽车装车前后安全检查表：">
                    <span
                      style="color: #4fc2f1"
                      @click="ConfirmationForm('zc')"
                    >
                      下载文件
                    </span>
                  </a-form-model-item>
                </a-col>
              </template>
            </a-row>
          </a-form-model>
        </div>
        <div class="ant-modal-footer">
          <a-button class="buttonType" @click="visibleAddNew = false">
            取消
          </a-button>
        </div>
      </dc-Model>
      <dc-Model
        :width="'950px'"
        v-model="visibleAddNew2"
        :modelConfig="addNewModelConfig2"
        class="DcModel"
      >
        <a-layout>
          <a-layout-content>
            <table
              border="1"
              style="width: 90%; margin-left: 30px; margin-top: 20px"
            >
              <tr align="center" style="height: 30px">
                <td>检查项目</td>
                <td>要求</td>
                <td>是</td>
                <td>否</td>
                <td>备注</td>
              </tr>
              <tr
                style="height: 30px"
                v-for="(item, index) in LoadingInspection"
                :key="index"
              >
                <td
                  v-if="item.whetherEnclosure == 'fj'"
                  :rowspan="item.numberMergedRows"
                >
                  {{ item.checkProject }}
                </td>
                <td>
                  {{ item.checkRequirements }}
                </td>
                <td>
                  <span v-if="item.whetherQualified == 'Y'">
                    <a-radio-group v-model="value">
                      <a-radio :value="1" disabled> </a-radio></a-radio-group
                  ></span>
                  <span v-else>
                    <a-radio-group v-model="value">
                      <a-radio :value="2" disabled> </a-radio></a-radio-group
                  ></span>
                </td>
                <td>
                  <span v-if="item.whetherQualified == 'N'"
                    ><a-radio-group v-model="value">
                      <a-radio :value="1" disabled> </a-radio></a-radio-group
                  ></span>
                  <span v-else
                    ><a-radio-group v-model="value">
                      <a-radio :value="2" disabled> </a-radio></a-radio-group
                  ></span>
                </td>
                <td>
                  {{ item.securityCheckTitle }} <br />{{ item.inputValue }}
                </td>
              </tr>
            </table>
            <table border="1" style="width: 90%; margin-left: 30px">
              <tr>
                <td>查询中其他情况说明：{{ LoadingInspectionData.aaa }}</td>
              </tr>
            </table>
            <table border="1" style="width: 90%; margin-left: 30px">
              <tr>
                <td style="width: 50%">
                  本人承诺：无随身携带火种。非防爆电器以及管制刀具棍棒等违禁品入场。
                  <br />
                  驾驶员签字：<img
                    style="width: 100%"
                    :src="LoadingInspectionData.driver_signature"
                    alt=""
                  />
                </td>
                <td>
                  安检人员签字：<img
                    style="width: 100%"
                    :src="LoadingInspectionData.security_check_signature"
                    alt=""
                  />
                </td>
              </tr>
            </table>
          </a-layout-content>

          <a-layout-footer>
            <a-button class="buttonType" @click="visibleAddNew2 = false">
              取消
            </a-button>
          </a-layout-footer>
        </a-layout>
      </dc-Model>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getListForPage,
  queryById,
  queryCarrierName,
} from "@/api/LoadingRecord.js";
import { selectJcxxByCodeAndCheck } from "@/api/SecurityInspectionRecord.js";
export default {
  data() {
    return {
      LoadingInformation: false,
      surfaceForm: {},
      surfaceForm2: {},
      surfaceForm3: {},
      addNewModelConfig: {
        width: "950px",
        title: "装车记录-详情",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      visibleAddNew2: false,
      addNewModelConfig2: {
        width: "950px",
        title: "安全详情",
        cancelText: false,
        footer: "", //是否展示页脚
      },
      startDate: [],
      visibleAddNew: false,
      form: {},
      stateInfo: [],
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
          title: "装车编号",ellipsis: true,
          dataIndex: "loading_number",
          align: "center",
          width: 120,
        },
        {
          title: "装车日期",ellipsis: true,
          dataIndex: "loading_start_time",
          align: "center",
          width: 120,
        },
        {
          title: "承运商",ellipsis: true,
          dataIndex: "carrier_name",
          align: "center",
          width: 120,
        },
        {
          title: "提单号",ellipsis: true,
          dataIndex: "ladingBillNum",
          align: "center",
          width: 120,
        },
        {
          title: "牵引车号",ellipsis: true,
          dataIndex: "number_tractor ",
          align: "center",
          width: 120,
        },
        {
          title: "挂车号",ellipsis: true,
          dataIndex: "number_trailer",
          align: "center",
          width: 120,
        },
        {
          title: "驾驶员",ellipsis: true,
          dataIndex: "name_driver",
          align: "center",
          width: 120,
        },
        {
          title: "装车撬位",ellipsis: true,
          dataIndex: "loadingPryLocate",
          align: "center",
          width: 120,
        },
        {
          title: "装车量(t)",ellipsis: true,
          dataIndex: "loadingCount",
          align: "center",
          width: 120,
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
      LoadingInspection: [],
      LoadingInspectionData: {},
    };
  },
  mounted() {
    this.getList();
    queryCarrierName().then((res) => {
      this.stateInfo = res.body;
    });
  },
  methods: {
    securityCheck() {
      this.visibleAddNew2 = true;
      let id = {
        code: "jz",
        sasesID: this.surfaceForm.id,
      };
      selectJcxxByCodeAndCheck(id).then((res) => {
        this.LoadingInspection = [];
        this.LoadingInspectionData = {};
        this.LoadingInspection = res.body.list;
        this.LoadingInspectionData = res.body;
      });
    },
    getPopupContainer() {
      return document.querySelector(".appMainForm");
    },
    ConfirmationForm(e) {
      window.open(
        `${Glod.DEVE_LOPMENT_ENVIRONMENT}/fileinfo/downloadFileWithBusinesscode?relatedId=${this.surfaceForm.id}&businessCode=${e}`
      );
    },
    look(row) {
      this.surfaceForm = {};
      this.surfaceForm2 = {};
      this.surfaceForm3 = {};
      let id = {
        ID: row.id,
      };
      queryById(id).then((res) => {
        this.surfaceForm = res.body[1];
        if (res.body[0][1]) {
          this.LoadingInformation = true;
          this.surfaceForm2 = res.body[0][1];
          this.surfaceForm3 = res.body[0][0];
        } else if (res.body[0][0]) {
          this.LoadingInformation = false;
          this.surfaceForm3 = res.body[0][0];
        } else {
          this.LoadingInformation = false;
        }
      });
      this.visibleAddNew = true;
    },
    exportClick() {
      this.$message.success("导出");
    },
    mydelete() {},
    getList() {
      getListForPage(this.form).then((res) => {
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.dataSource = res.body.data;
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
      this.form = {};
      this.startDate = [];
      this.form.pageIndex = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    //日期的
    onChange(date, dateString) {
      if (date) {
        this.form.loading_start_time = date[0];
        this.form.loading_end_time = date[1];
      }
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
</style>