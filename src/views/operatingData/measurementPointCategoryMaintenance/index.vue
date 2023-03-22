<template>
  <div class="device-type-maintenance">
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'addListClick' },
            { value: 'Delete', clickName: 'deleteListClick' },
          ]"
          @addListClick="addListClick"
          @deleteListClick="deleteListClick"
        ></pe-button>
      </template>
      <template slot="appMain">
        <div id="components-layout-demo-basic" style="width: 100%">
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
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.deviceType"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="巡检项名称"
                  >
                    <a-input
                      placeholder="请输入"
                      v-model="queryParams.inspectionItemName"
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
        </div>
      </template>
    </Breadcrumb>
    <add-and-edit
      :hidden-visible="hiddenVisible"
      :title="formTitle"
      @close="addAndEditClose"
      @submitForm="submitForm"
      :form-data="formData"
      ref="addAndEditRef"
      :owning-region-option="owningRegionOption"
      :device-class-option="deviceClassOption"
      :units-option="unitsOption"
    ></add-and-edit>
  </div>
</template>
<script>
import { encode } from "@/api/public.js";
import {
  findAllList, //获取列表
  deleteBatch, //批量删除
  queryDeviceClassList, //获取设备类型
  queryByID, //根据id查询
} from "@/api/operatingData/measurementPointCategoryMaintenance";
import addAndEdit from "./addAndEdit.vue";

export default {
  name: 'measurementPointCategoryMaintenance',
  components: {
    addAndEdit,
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 50,
        },
        {
          title: '所属区域',
          dataIndex: 'owningRegion',
        },
        {
          title: '设备类型',
          dataIndex: 'deviceType',
        }, {
          title: '巡检项名称',
          dataIndex: 'inspectionItemName',
        },
        {
          title: '排序',
          dataIndex: 'sorting',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operate' },
          align: 'center',
          fixed: 'right',
          width: 120,
        },
      ],
      tableList: [], // 表格数据
      pagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      selectedRowKeys: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        owningRegion: undefined, //所属区域
        deviceType: '', //设备类型
        inspectionItemName: '', //巡检项名称
      },
      hiddenVisible: false,
      formTitle: '测点类别维护-新增',
      formData: {},
      owningRegionOption: [], //所属区域集合
      deviceClassOption: [], //设备类型集合
      unitsOption: [], //单位集合
    }
  },
  created() {
    this.getEncode()
    this.getQueryDeviceClassList()
    this.getList()
  },
  methods: {
    getEncode() {
      encode("SCYX-CZK-GYDY").then((res) => {
        this.owningRegionOption = res.body.data;
      });
      encode("LSZ_DW").then((res) => {
        this.unitsOption = res.body.data;
      });
    },
    getQueryDeviceClassList() {
      queryDeviceClassList().then((res) => {
        if (res.code == "200") {
          this.deviceClassOption = res.body
        }
      })
    },
    getList() {
      findAllList(this.queryParams).then((res) => {
        if (res.code == "200") {
          this.tableList = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    addListClick() {
      this.formTitle = '测点类别维护-新增'
      this.hiddenVisible = true
      this.formData = {
        owningRegion: "",
        deviceType: "",
        inspectionItemName: "",
        units: "",
        referenceRangeDown: "",
        referenceRangeUp: "",
        warningRangeDown: "",
        warningRangeUp: "",
        referenceTime: "",
        fetchPeriod: "",
        timeUnits: "",
        shutdownStatusRecordValue: "",
      }
    },

    editClick(val) {
      this.formTitle = '测点类别维护-编辑'
      this.getQueryByID(val.id)

    },
    detailsClick(val) {
      this.formTitle = '测点类别维护-详情'
      this.getQueryByID(val.id)
    },
    getQueryByID(id) {
      queryByID({ id }).then((res) => {
        if (res.code == "200") {
          this.formData = res.body
          this.hiddenVisible = true
        }
      })
    },
    deleteListClick() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      this.$confirm({
        title: '提示',
        content: '是否确认删除？',
        onOk: () => {
          deleteBatch(this.selectedRowKeys).then((res) => {
            if (res.code == '200') {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        },
      })
    },
    deleteClick(val) {
      this.$confirm({
        title: '提示',
        content: '是否确认删除？',
        onOk: () => {
          deleteBatch([val.id]).then((res) => {
            if (res.code == '200') {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        },
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    paginationChange(val) {
      this.queryParams.pageNum = val.current
      this.queryParams.pageSize = val.pageSize
      this.pagination.pageSize = val.pageSize
      this.pagination.current = val.current
      this.getList()
    },
    addAndEditClose() {
      this.hiddenVisible = false
    },
    submitForm() {
      this.addAndEditClose()
      this.getList()
    },
    searchClick() {
      this.queryParams.pageNum = 1
      this.pagination.current = 1
      this.getList()
    },
    resetClick() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        owningRegion: undefined, //所属区域
        deviceType: '', //设备类型
        inspectionItemName: '', //巡检项名称
      }
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.getList()
    },
  },
}
</script>
<style lang="less" scoped>
</style>
