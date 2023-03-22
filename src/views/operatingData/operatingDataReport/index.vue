<template>
  <div class="device-type-maintenance">
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <pe-button
          :include="[
            { value: 'Report', clickName: 'reportClick' },
            {
              value: 'print',
              name: '报表打印（按班次）',
              clickName: 'printClick',
            },
            { value: 'Delete', clickName: 'deleteListClick' },
          ]"
          @reportClick="reportClick"
          @printClick="printClick"
          @deleteListClick="deleteListClick"
        ></pe-button>
      </template>
      <template slot="appMain">
        <!-- <div id="components-layout-demo-basic" style="width: 100%">
          <a-layout>
            <a-layout-content>
              <a-form-model layout="inline">
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="所属区域"
                  >
                    <a-select
                      v-model="queryParams.owningRegion"
                      placeholder="请选择"
                    >
                      <a-select-option
                        v-for="(item, index) in owningRegionOption"
                        :value="item.dictname"
                        :key="index"
                      >
                        {{ item.dictname }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="设备类型"
                  >
                    <a-select
                      v-model="queryParams.deviceType"
                      placeholder="请选择"
                    >
                      <a-select-option
                        v-for="(item, index) in deviceClassOption"
                        :value="item"
                        :key="index"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="设备名称"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.deviceName"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="设备位号"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.deviceNo"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="巡检项名称"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.inspectionItemName"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 90px' }"
                    label="仪表位号"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.instrumentNo"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item>
                    <a-button
                      class="buttonType"
                      type="primary"
                      @click="searchClick"
                    >
                      查询
                    </a-button>
                    <a-button class="buttonType" @click="resetClick">
                      重置
                    </a-button></a-form-model-item
                  ></a-col
                >
              </a-form-model>
            </a-layout-content>
          </a-layout>
        </div>
        <div class="main_body">
          <a-table
            @change="paginationChange"
            :pagination="pagination"
            :columns="columns"
            :data-source="tableList"
            class="list_table"
            :scroll="{ y: 1, x: 100 }"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            rowKey="id"
          >
            <template slot="operate" slot-scope="row">
              <pe-button
                :include="[
                  {
                    value: 'Edit',
                    name: '编辑',
                    style: 'btn_link',
                    clickName: 'editClick',
                    icon: '',
                    type: 'link',
                    disabled: $audit.editDisabled(row.status),
                  },
                  {
                    value: 'Delete',
                    name: '删除',
                    style: 'btn_link',
                    clickName: 'deleteClick',
                    icon: '',
                    type: 'link',
                  },
                  {
                    value: 'details',
                    name: '详情',
                    style: 'btn_link',
                    clickName: 'detailsClick',
                    icon: '',
                    type: 'link',
                    isPower: false,
                  },
                ]"
                @editClick="editClick(row)"
                @detailsClick="detailsClick(row)"
                @deleteClick="deleteClick(row)"
              ></pe-button>
            </template>
          </a-table>
        </div> -->
      </template>
    </Breadcrumb>
    <!-- <add-and-edit
      :hidden-visible="hiddenVisible"
      :title="formTitle"
      @close="addAndEditClose"
      @submitForm="submitForm"
      :form-data="formData"
      ref="addAndEditRef"
      :owning-region-option="owningRegionOption"
      :device-class-option="deviceClassOption"
      :units-option="unitsOption"
      :lable-list="maintainLableList"
    ></add-and-edit> -->
  </div>
</template>
<script>
export default {
  name: 'operatingDataReport',
  data() {
    return {}
  },
  created() { },
  methods: {},
}
</script>
<style lang="less" scoped>
</style>
