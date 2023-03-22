<template>
  <div>
    <Breadcrumb>
      <template slot="breadcrumbButton">
        <pe-button
          :include="[{ value: 'Add', clickName: 'masterDataAdd' }]"
          @masterDataAdd="masterDataAdd"
        ></pe-button>
      </template>
      <template slot="appMain">
        <div id="components-layout-demo-basic">
          <a-layout-content>
            <div class="contentLyout">
              <a-form-model :layout="'inline'">
                <!-- <a-row :gutter="24"> -->
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="分类编码"
                  >
                    <a-input
                      v-model="queryParams.classificCode"
                      placeholder="请输入分类编码"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 150px' }"
                    label="分类名称"
                  >
                    <a-input
                      v-model="queryParams.classificName"
                      placeholder="请输入分类名称"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-form-model-item class="item_button">
                  <a-button
                    class="buttonType"
                    type="primary"
                    @click="equipmentMaintenanceSearch"
                  >
                    查询
                  </a-button>
                  <a-button
                    class="buttonType"
                    type="primary"
                    @click="equipmentMaintenanceReset"
                  >
                    重置
                  </a-button>
                </a-form-model-item>
              </a-form-model>
              <a-table
                class="list_table_1 device_table"
                :columns="columns"
                :scroll="{ y: 1 }"
                :data-source="tableList"
                :row-key="(record) => record.feature_classificid"
              >
                <template slot="fileContents" slot-scope="row">
                  <a-button
                    type="link"
                    class="btn_link"
                    style="cursor: pointer"
                    @click="associationClick(row)"
                  >
                    关联
                  </a-button>
                  <a-button
                    type="link"
                    class="btn_link"
                    style="cursor: pointer"
                    @click="checkClick(row)"
                  >
                    查看
                  </a-button>
                </template>
                <template slot="operate" slot-scope="row">
                  <a-button
                    type="link"
                    class="btn_link"
                    style="cursor: pointer"
                    @click="addClick(row)"
                    :disabled="row.nodeLevel >= 3"
                  >
                    新增
                  </a-button>
                  <a-button
                    type="link"
                    class="btn_link"
                    style="cursor: pointer"
                    @click="editClick(row)"
                    :disabled="row.nodeLevel >= 2"
                  >
                    编辑
                  </a-button>
                  <a-button
                    type="link"
                    class="btn_link"
                    style="cursor: pointer"
                    @click="deleteClick(row)"
                  >
                    删除
                  </a-button>
                </template>
              </a-table>
            </div>
          </a-layout-content>
        </div>
      </template>
    </Breadcrumb>
    <a-modal
      :title="associationFormTitle"
      :visible="associationFormVisible"
      @cancel="associationFormHandleCancel"
      :afterClose="associationFormHandleAfterClose"
      :footer="null"
      :maskClosable="false"
      class="from-style bigModel"
    >
      <a-form-model
        layout="inline"
        :model="associationFormModel"
        class="association_form device_form"
      >
        <a-form-model-item label="分类编码">
          <a-input v-model="associationFormModel.classificCode"> </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="associationTableInquire">
            查询
          </a-button>
          <a-button style="margin-left: 16px" @click="associationTableReset">
            重置
          </a-button>
        </a-form-model-item>
        <a-table
          :columns="associationFormColumns"
          :data-source="associationFormTableList"
          :pagination="associationTablePagination"
          @change="associationTableChange"
          :row-selection="{
            selectedRowKeys: associationTableRowKeys,
            onChange: onAssociationTableSelectChange,
            getCheckboxProps: onAssociationTableGetCheckboxProps,
          }"
          :row-key="(record) => record.relate_id"
          style="margin-top: 10px"
        >
        </a-table>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button
          :disabled="associationCurrentData.nodeLevel != 3"
          key="submit"
          type="primary"
          @click="associationFormHandleOk"
        >
          提交
        </a-button>
        <a-button key="back" @click="associationFormHandleCancel">
          取消
        </a-button>
      </div>
    </a-modal>
    <a-modal
      :title="deviceFormTitle"
      :visible="deviceFormVisible"
      @cancel="deviceFormHandleCancel"
      :afterClose="deviceFormHandleAfterClose"
      :footer="null"
      :maskClosable="false"
      class="from-style bigModel"
    >
      <a-form-model
        layout="inline"
        :model="deviceFormModel"
        class="association_form device_form"
      >
        <a-form-model-item
          :label="deviceFormNameInputLabel"
          v-if="deviceFormNameInputLabel == '设备名称'"
        >
          <a-input v-model="deviceFormModel.classificName"> </a-input>
        </a-form-model-item>
        <a-form-model-item
          :label="deviceFormCodeInputLabel"
          v-if="deviceFormNameInputLabel == '设备名称'"
        >
          <a-input v-model="deviceFormModel.classificCode"> </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            type="primary"
            @click="deviceTableInquire"
            v-if="deviceFormNameInputLabel == '设备名称'"
          >
            查询
          </a-button>
          <a-button
            style="margin-left: 16px"
            @click="deviceTableReset"
            v-if="deviceFormNameInputLabel == '设备名称'"
          >
            重置
          </a-button>
        </a-form-model-item>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedDeviceFormRowKeys,
            onChange: onDeviceFormSelectChange,
            getCheckboxProps: onDeviceFormGetCheckboxProps,
          }"
          :row-key="(record) => JSON.stringify(record)"
          :columns="deviceFormColumns"
          :data-source="deviceFormTableList"
          :pagination="deviceFormPagination"
          @change="deviceFormColumnsChange"
          :style="{
            marginTop: deviceFormNameInputLabel == '设备名称' ? '10px' : '0',
          }"
        >
        </a-table>
      </a-form-model>
      <div class="ant-modal-footer">
        <a-button key="submit" type="primary" @click="deviceFormHandleOk">
          提交
        </a-button>
        <a-button key="back" @click="deviceFormHandleCancel"> 取消 </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  archivesClassificQueryTree,
  findChildListFromtFeatureClassific,
  findChildList,
  archivesClassificAddList,
  archivesClassificFindOwnChildList,
  archivesClassificConfigAddConfigList,
  archivesClassificConfigFindOwnConfigList,
  archivesClassificConfigPageList,
  archivesClassificDeleteById,
} from '@/api/oneMachineOneFile/deviceMaintenance.js'
export default {
  name: 'oneMachineOneFileDeviceMaintenance',
  data() {
    return {
      queryParams: {
        classificCode: '',
        classificName: '',
        pageIndex: 1,
        pageSize: 10,
      },
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return `${(this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1}`
          },
        },
        {
          title: '分类名称',
          dataIndex: 'classific_name',
        },
        {
          title: '分类编码',
          dataIndex: 'classific_code',
        },
        {
          title: '包含的档案簿内容',
          width: 130,
          align: 'center',
          scopedSlots: { customRender: 'fileContents' },
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'operate' },
        },
      ],
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      associationTablePagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      tableList: [],
      associationFormVisible: false,
      associationFormTitle: '关联档案薄内容',
      deviceFormVisible: false,
      deviceFormTitle: '设备新增',
      associationFormModel: {
        classificCode: '',
        pageNum: 1,
        pageSize: 10,
      },
      associationFormColumns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return `${(this.associationTablePagination.current - 1) *
              this.associationTablePagination.pageSize +
              index +
              1}`
          },
        },
        {
          title: '列表名称',
          dataIndex: 'relate_name',
        },
        {
          title: '分类编码',
          dataIndex: 'relate_id',
        },
      ],
      associationFormTableList: [],
      deviceFormModel: {
        classificCode: '',
        classificName: '',
        pageNum: 1,
        pageSize: 10,
        parentId: '',
      },
      deviceFormColumns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return `${(this.deviceFormPagination.current - 1) *
              this.deviceFormPagination.pageSize +
              index +
              1}`
          },
        },
        {
          title: '分类名称',
          dataIndex: 'classific_name',
        },
        {
          title: '分类编码',
          dataIndex: 'classific_code',
        },
      ],
      deviceFormTableList: [],
      deviceFormPagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      selectedDeviceFormRowKeys: [],
      associationTableRowKeys: [],
      associationCurrentData: {},
      parentParameter: {},
      grandTotalList: [],
      deviceFormCodeInputLabel: "文件编码",
      deviceFormNameInputLabel: "文件名称"
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deviceFormColumnsChange(val) {
      let { pageSize, current } = val
      this.deviceFormPagination.pageSize = pageSize
      this.deviceFormPagination.current = current
      this.deviceFormModel.pageNum = current
      this.deviceFormModel.pageSize = pageSize
      this.getFindChildListFromtFeatureClassific()
    },
    masterDataAdd() {
      this.addClick(true)
    },
    equipmentMaintenanceSearch() {
      this.queryParams.pageIndex = 1
      this.queryParams.pageSize = 10
      this.getList()
    },
    equipmentMaintenanceReset() {
      this.queryParams = {
        pageIndex: 1,
        pageSize: 10,
        classificCode: '',
        classificName: '',
      }
      this.getList()
    },
    getList() {
      archivesClassificQueryTree(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.pagination.total = res.body.total
          this.pagination.current = res.body.pageIndex
          this.tableList = this.childrenArrange(res.body.data, 1)
        }
      })
    },
    childrenArrange(data, level) {
      let newData = data
      newData.forEach((element) => {
        element.nodeLevel = level
        if (element.children) {
          element = this.childrenArrange(element.children, level + 1)
        }
      })
      return newData
    },
    paginationChange() { },
    cancel() { },

    deviceFile() { },
    onSelectChange() { },
    // 关联点击
    associationClick(row) {
      this.associationFormTitle = '关联档案薄内容'
      this.associationOpen(row)
    },
    // 查看点击
    checkClick(row) {
      this.associationFormTitle = '查看档案薄内容'
      this.associationOpen(row)
    },
    associationOpen(row) {
      this.associationFormModel.pageNum = 1
      this.associationFormModel.pageSize = 10
      this.associationFormModel.classificCode = ''
      this.associationTablePagination.pageSize = 10
      this.associationTablePagination.current = 1
      this.associationCurrentData = row
      this.associationFormVisible = true
      this.getArchivesClassificGrandTotal()
      this.getArchivesClassificConfigPageList()
      this.getArchivesClassificConfigFindOwnConfigList(row)
    },
    getArchivesClassificConfigPageList() {
      archivesClassificConfigPageList(this.associationFormModel).then((res) => {
        if (res.code == 200) {
          this.associationFormTableList = res.body
          // 没有分页
          // this.associationTablePagination.total = res.total
        }
      })
    },
    getArchivesClassificGrandTotal() {
      let requestGrandTotal = this.associationFormModel
      requestGrandTotal.pageSize = 9999
      archivesClassificConfigPageList(requestGrandTotal).then((res) => {
        if (res.code == 200) {
          this.grandTotalList = res.body
        }
      })
    },
    getArchivesClassificConfigFindOwnConfigList(row) {
      archivesClassificConfigFindOwnConfigList({
        featureClassificid: row.classific_code,
      }).then((res) => {
        if (res.code == 200) {
          this.associationTableRowKeys = res.body.map((item) => {
            return item.relate_id
          })
        }
      })
    },
    // 添加点击
    addClick(row) {
      this.deviceFormTitle = '设备新增'
      this.deviceFormEditOpen(row, 'add')
    },
    // 修改点击
    editClick(row) {
      this.deviceFormTitle = '设备编辑'
      this.deviceFormEditOpen(row, 'edit')
    },

    deviceFormEditOpen(row, val) {
      if (row === true) {
        this.deviceFormModel.parentId = '0'
        this.deviceFormModel.nodeLevel = '0'
      } else {
        this.parentParameter = {
          parent_classificid: row.feature_classificid,
        }
        this.deviceFormModel.parentId =
          row.nodeLevel < 2
            ? (this.deviceFormModel.parentId = row.feature_classificid)
            : (this.deviceFormModel.parentId = row.classific_code)
        this.deviceFormModel.nodeLevel = row.nodeLevel
      }
      this.getFindChildListFromtFeatureClassific()
      this.chosenFindOwnChildList(row, val)
      this.deviceFormModel.classificName = ""
      this.deviceFormModel.classificCode = ""
      if (row.nodeLevel < 2) {
        this.deviceFormCodeInputLabel = "文件编码"
        this.deviceFormNameInputLabel = "文件名称"
        this.$set(this.deviceFormColumns[1], 'title', '分类名称')
        this.$set(this.deviceFormColumns[2], 'title', '分类编码')
      } else {
        this.deviceFormCodeInputLabel = "设备位号"
        this.deviceFormNameInputLabel = "设备名称"
        this.$set(this.deviceFormColumns[1], 'title', '设备名称')
        this.$set(this.deviceFormColumns[2], 'title', '设备位号')
        this.$set(this.deviceFormColumns[2], 'dataIndex', 'classific_tag')
      }
      this.deviceFormVisible = true
    },
    chosenFindOwnChildList(row, val) {
      let data = {}
      if (row === true) {
        data = {
          strParentId: '0'
        }
      } else {
        data = {
          strParentId: row.feature_classificid
        }
      }
      archivesClassificFindOwnChildList(data).then((res) => {
        // debugger
        // if (row.nodeLevel < 2) {
        //   debugger
        // } else {


        // }

        // debugger
        this.selectedDeviceFormRowKeys = res.body.map((item) => {
          let newItem = item
          if (row.nodeLevel >= 2) {
            newItem.feature_classificid = ""
            newItem.child_tag = "0"
            newItem.parent_classificid = ""
            // debugger
          }
          // debugger
          return JSON.stringify(newItem)
        })
        console.log(this.selectedDeviceFormRowKeys);
      })
    },
    onDeviceFormGetCheckboxProps(record) {
      if (this.deviceFormTitle === '设备新增') {
        return {
          props: {
            disabled: record.child_tag == 1,
          },
        }
      } else {
        return {
          props: {},
        }
      }
    },
    onAssociationTableGetCheckboxProps(record) {
      if (this.associationFormTitle === '查看档案薄内容') {
        return {
          props: {
            disabled: true,
          },
        }
      } else {
        return {
          props: {
            disabled: this.associationCurrentData.nodeLevel != 3,
          },
        }
      }
    },
    getFindChildListFromtFeatureClassific() {
      // findChildListFromtFeatureClassific(this.deviceFormModel).then((res) => {
      //   if (res.code == 200) {
      //     this.deviceFormTableList = res.body.data
      //     this.deviceFormPagination.total = res.body.total
      //   }
      // })
      this.deviceFormModel.classOrEquipment = this.deviceFormModel.nodeLevel == 2 ? "E" : "C"
      findChildList(this.deviceFormModel).then((res) => {
        if (res.code == 200) {
          this.deviceFormTableList = res.body.data
          this.deviceFormPagination.total = res.body.total
        }
      })
    },
    associationFormHandleCancel() {
      this.associationFormCancel()
    },
    associationFormHandleOk() {
      let forms = []
      for (let index = 0; index < this.associationTableRowKeys.length; index++) {
        const element = this.associationTableRowKeys[index];
        for (let i = 0; i < this.grandTotalList.length; i++) {
          const e = this.grandTotalList[i];
          if (element == e.relate_id) {
            e.feature_classificid = this.associationCurrentData.classific_code
            forms.push(e)
          }
        }
      }

      archivesClassificConfigAddConfigList(forms).then((res) => {
        if (res.code == 200) {
          this.$message.success('关联成功')
          this.getList()
          this.associationFormCancel()
        } else {
          this.$message.warning('服务器异常，请稍后重试')
        }
      })
    },
    associationFormCancel() {
      this.associationFormVisible = false
    },
    deviceFormHandleCancel() {
      this.deviceFormVisible = false
    },
    deviceFormHandleAfterClose() {
      this.selectedDeviceFormRowKeys = []
    },
    associationFormHandleAfterClose() {
      this.associationTableRowKeys = []
      this.associationCurrentData = {}
    },
    deviceFormHandleOk() {
      let forms = this.selectedDeviceFormRowKeys.map((item) => {
        let itemParse = JSON.parse(item)
        if (!itemParse.parent_classificid) {
          itemParse.parent_classificid = this.parentParameter.parent_classificid
        }
        return itemParse
      })
      archivesClassificAddList(forms).then((res) => {
        if (res.code == 200) {
          let messageText = ''
          if (this.deviceFormTitle === '设备新增') {
            messageText = '新增成功'
          } else {
            messageText = '编辑成功'
          }
          this.$message.success(messageText)
          this.getList()
          this.deviceFormHandleCancel()
        }
      })
    },
    // 删除点击
    deleteClick(row) {
      archivesClassificDeleteById({
        featureClassificid: row.feature_classificid,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.warning('服务器异常，请稍后重试')
        }
      })
    },
    onDeviceFormSelectChange(selectedRowKeys) {
      this.selectedDeviceFormRowKeys = selectedRowKeys
    },
    onAssociationTableSelectChange(selectedRowKeys) {
      this.associationTableRowKeys = selectedRowKeys
    },
    deviceTableInquire() {
      this.getFindChildListFromtFeatureClassific()
    },
    deviceTableReset() {
      this.deviceFormModel.classificCode = ''
      this.deviceFormModel.classificName = ''
      this.deviceFormModel.pageNum = 1
      this.deviceFormModel.pageSize = 10
      this.getFindChildListFromtFeatureClassific()
    },
    associationTableInquire() {
      this.getArchivesClassificConfigPageList()
    },
    associationTableReset() {
      this.associationFormModel.classificCode = ''
      this.associationFormModel.pageNum = 1
      this.associationFormModel.pageSize = 10
      this.getArchivesClassificConfigPageList()
    },
    associationTableChange(val) {
      let { pageSize, current } = val
      this.associationTablePagination.pageSize = pageSize
      this.associationTablePagination.current = current
      this.associationFormModel.pageNum = current
      this.associationFormModel.pageSize = pageSize
      this.getArchivesClassificConfigPageList()
    },
  },
}
</script>
<style lang="less" scoped>
.association_form {
  ::v-deep .ant-form-item {
    display: inline-block;
  }
}
.device_table {
  margin-top: 10px;
}
.device_form {
  ::v-deep .ant-form-item-control-wrapper {
    width: auto;
  }
}
</style>
