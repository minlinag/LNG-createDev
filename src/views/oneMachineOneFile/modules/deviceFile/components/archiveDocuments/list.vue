<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb :titleName="title">
      <template slot="breadcrumbButton">
        <pe-button
          :include="[
            { value: 'Add', clickName: 'addListClick' },
            {
              value: 'download',
              icon: 'download-icon',
              name: '下载',
              clickName: 'downloadClick',
            },
            { value: 'Delete', clickName: 'deleteListClick' },
          ]"
          @addListClick="addListClick"
          @deleteListClick="deleteListClick"
          @downloadClick="downloadClick"
        ></pe-button>
      </template>
      <template slot="appMain">
        <div>
          <a-form-model layout="inline" :model="queryParams">
            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 120px' }"
                label="文件类型"
              >
                <a-tree-select
                  v-model="selfCode"
                  placeholder="请选择文件类型"
                  :replaceFields="{
                    children: 'children',
                    title: 'label',
                    value: 'id',
                    key: 'id',
                  }"
                  :treeData="fileTypeOption"
                  @select="eqmTypeSelect"
                >
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 120px' }"
                label="文件编号"
              >
                <a-input
                  v-model="queryParams.fileNo"
                  placeholder="请输入"
                ></a-input>
              </a-form-model-item>
            </a-col> -->

            <a-col :span="6">
              <a-form-model-item
                :labelCol="{ style: 'width: 120px' }"
                label="文件名称"
              >
                <a-input
                  v-model="queryParams.fileName"
                  placeholder="请输入"
                ></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item>
                <a-button
                  v-Query
                  class="buttonType"
                  type="primary"
                  @click="searchClick"
                >
                  查询
                </a-button>
                <a-button class="buttonType" @click="resetClick">
                  重置
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-form-model>
          <a-table
            @change="paginationChange"
            :pagination="pagination"
            :columns="columns"
            :data-source="tableList"
            :scroll="{ y: 300 }"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            rowKey="id"
            style="margin-top: 20px"
          >
            <!-- <template slot="operate" slot-scope="row">
              <a-button
                type="link"
                class="btn_link"
                style="cursor: pointer"
                @click="downloadClick(row)"
              >
                下载
              </a-button>
            </template> -->
          </a-table>
        </div>
      </template>
    </Breadcrumb>
    <add-and-edit
      :hidden-visible="hiddenVisible"
      :form-title="formTitle"
      @close="addAndEditClose"
      @submitForm="submitForm"
      :formdata="formdata"
      :fileTypeOption="fileTypeOption"
      ref="addAndEditRef"
    ></add-and-edit>
  </div>
</template>
<script>
import {
  getListForPage,
  archivesFileDelete,
  archivesFileInsert,
} from '@/api/oneMachineOneFile/archiveDocuments'
import addAndEdit from './addAndEdit'
export default {
  name: 'archiveDocuments',
  props: ['title', 'checkedDict', 'parentCode', 'jumpPageType', 'jumpPageId', 'deviceCode', 'jumpChildrenList'],
  components: { addAndEdit },
  data() {
    return {
      pagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
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
          title: '类型',
          dataIndex: 'eqmType',
          width: 130,
        },
        // {
        //   title: '文件编号',
        //   dataIndex: 'fileNo',
        // },
        {
          title: '文件名',
          dataIndex: 'fileName',
        },
        // {
        //   title: '操作',
        //   scopedSlots: { customRender: 'operate' },
        //   align: 'center',
        //   fixed: 'right',
        //   width: 100,
        // },
      ],
      queryParams: {
        eqmType: '',
        // fileNo: '',
        fileName: '',
        pageNum: 1,
        pageSize: 10,
        selfCode: '',
        nodeCode: [],
        deviceCode: this.deviceCode,
      },
      selfCode: '',
      tableList: [],
      selectedRowKeys: [],
      selectedRowFileId: [],
      hiddenVisible: false,
      formdata: {},
      formTitle: '',
      fileTypeOption: [],
    }
  },
  watch: {
    title: {
      handler(val) {
        this.fileTypeOption = this.mixtureParent(
          this.checkedDict.children,
          this.checkedDict.code,
          this.checkedDict.id
        )
        if (this.jumpPageType) {
          this.queryParams.eqmType = this.jumpPageType
          this.selfCode = this.jumpPageId
        } else {
          this.queryParams.eqmType = ''
          this.selfCode = ''

        }
        if (this.jumpPageId) {
          if (this.jumpChildrenList.children.length > 0) {
            this.queryParams.nodeCode = this.nodeCodePolling(this.jumpChildrenList.children, [this.jumpChildrenList.code])
          } else {
            this.queryParams.selfCode = this.jumpChildrenList.code
          }
        } else {
          if (this.checkedDict.children.length > 0) {
            this.queryParams.nodeCode = this.nodeCodePolling(this.checkedDict.children, [this.checkedDict.code])
          } else {
            this.queryParams.selfCode = this.checkedDict.code
          }

        }

        this.getList()
      },
      immediate: true,
    },
  },
  created() { },
  methods: {
    eqmTypeSelect(value, node, extra) {
      if (node.dataRef.children.length > 0) {
        this.queryParams.nodeCode = this.nodeCodePolling(node.dataRef.children, [node.dataRef.code])
        this.queryParams.selfCode = ""
      } else {
        this.queryParams.selfCode = node.dataRef.code
        this.queryParams.nodeCode = []
      }
    },
    mixtureParent(val, codeParent, idParent) {
      let newVal = val
      newVal.forEach((element) => {
        element.parentCode = codeParent
        element.parentId = idParent
        if (element.children.length > 0) {
          this.mixtureParent(element.children, element.code, element.id)
        }
      })
      return newVal
    },
    searchClick() {
      this.getList()
    },
    resetClick() {
      // this.queryParams.fileNo = ''
      this.queryParams.fileName = ''
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.pagination.pageSize = 10
      this.pagination.current = 1
      if (this.checkedDict.children.length > 0) {
        this.queryParams.nodeCode = this.nodeCodePolling(this.checkedDict.children, [this.checkedDict.code])
      } else {
        this.queryParams.selfCode = this.checkedDict.code
      }
      this.selfCode = ''
      this.getList()
    },
    getList() {
      getListForPage(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableList = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    paginationChange(val) {
      this.queryParams.pageNum = val.current
      this.queryParams.pageSize = val.pageSize
      this.pagination.pageSize = val.pageSize
      this.pagination.current = val.current
      this.getList()
    },
    onSelectChange(selectedRowKeys, val) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowFileId = val.map((item) => {
        let accessoryTypeObj = JSON.parse(item.accessoryType.replace(/“/g, '"'))
        return accessoryTypeObj.id
      })
    },
    deleteListClick() {
      if (this.selectedRowKeys.length > 0) {
        archivesFileDelete(this.selectedRowKeys).then((res) => {
          if (res.code == 200) {
            this.selectedRowKeys = []
            this.$message.success('删除成功')
            this.getList()
          }
        })
      } else {
        this.$message.warning('请先选择数据')
      }
    },
    downloadClick() {
      this.selectedRowFileId.forEach(element => {
        var elemIF = document.createElement('iframe')
        elemIF.src = Glod.DEVE_LOPMENT_ENVIRONMENT + 'fileinfo/downloadFileById?id=' + element + '&dType=d'
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      });
    },
    addListClick() {
      this.hiddenVisible = true
      this.formTitle = '档案-新增'
      this.formdata = {
        eqmType: '',
        fileNo: '',
        fileName: '',
        remake: '',
        flieList: [],
        parentCode: '',
        selfCode: '',
      }
    },
    addAndEditClose() {
      this.hiddenVisible = false
    },
    submitForm(val) {
      // let addForm = new FormData()
      // let dataBox = {
      //   eqmType: val.eqmType,
      //   fileNo: val.fileNo,
      //   fileName: val.fileName,
      //   remake: val.remake,
      //   parentCode: val.parentCode,
      //   selfCode: val.selfCode,
      // }

      // // addForm.append('strJson', JSON.stringify(dataBox))
      // for (const key in dataBox) {
      //   if (Object.hasOwnProperty.call(dataBox, key)) {
      //     const element = dataBox[key]
      //     addForm.append(key, element)
      //   }
      // }
      // for (let index = 0; index < val.flieList.length; index++) {
      //   const element = val.flieList[index]
      //   addForm.append('file' + (index + 1), element)
      // }‘
      let newVal = {
        eqmType: val.eqmType,
        fileName: val.fileName,
        fileNo: val.fileNo,
        parentCode: val.parentCode,
        remake: val.remake,
        selfCode: val.selfCode,
        deviceCode: this.deviceCode
      }

      this.archivesFileInsertPoll(0, newVal, val.flieList)
    },
    archivesFileInsertPoll(index, newVal, flieList) {
      const element = flieList[index];
      newVal.fileName = element.fileName
      newVal.fileSize = element.fileSize
      newVal.uploader = this.$store.state.user.unitName;
      let flieListJoin = JSON.stringify(element)
      newVal.accessoryType = flieListJoin
      archivesFileInsert(newVal).then((res) => {
        if (res.code == 200) {
          let newIndex = index + 1
          if (flieList.length == newIndex) {
            this.$message.success('添加成功')
            this.hiddenVisible = false
            this.getList()
          } else {
            this.archivesFileInsertPoll(newIndex, newVal, flieList)
          }
        }
      })
    },
    nodeCodePolling(val, code) {
      let newVal = val
      let newCode = code
      newVal.forEach((element) => {
        if (element.children.length > 0) {
          newCode.push(element.code)
          this.nodeCodePolling(element.children, newCode)
        }
      })
      return newCode
    },
  },
}
</script>
<style scoped lang="less">
.wrapper {
  width: 100%;
}
.ant-select-selection--single {
  width: 100%;
}
.form_item_description {
  ::v-deep .ant-form-item-label {
    width: 123px;
    label {
    }
  }
  ::v-deep {
    .ant-form-item-control-wrapper {
      width: calc(100% -123px);
    }
  }
}
</style>
