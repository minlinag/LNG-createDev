<template>
  <Breadcrumb>
    <template slot="appMain">
      <div id="components-layout-demo-basic">
        <a-layout class="layout-height">
          <a-layout-sider class="tree_layout_sider">
            <a-tree
              v-if="gData.length > 0"
              @select="onSelect"
              :replace-fields="{
                title: 'classificName',
                key: 'featureClassificid',
              }"
              :defaultExpandedKeys="[gData[0].featureClassificid]"
              :defaultSelectedKeys="[gData[0].children[0].featureClassificid]"
              class="draggable-tree"
              draggable
              :tree-data="gData"
              @dragenter="onDragEnter"
              @drop="onDrop"
            />
          </a-layout-sider>
          <a-layout-content>
            <div class="contentLyout">
              <a-form-model :layout="'inline'">
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备名称"
                  >
                    <a-input
                      v-model="searchForm.equipment_name"
                      placeholder="请输入设备名称"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    :labelCol="{ style: 'width: 120px' }"
                    label="设备位号"
                  >
                    <a-input
                      v-model="searchForm.equipment_tag_no"
                      placeholder="请输入设备位号"
                    >
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-form-model-item>
                  <a-button
                    v-Query
                    class="buttonType"
                    type="primary"
                    @click="search"
                  >
                    查询
                  </a-button>
                  <a-button class="buttonType" @click="resetForm">
                    重置
                  </a-button>
                </a-form-model-item>
              </a-form-model>

              <a-table
                :row-selection="{
                  selectedRowKeys: selectedRowKeys,
                  onChange: onSelectChange,
                  columnWidth: '30px',
                }"
                rowKey="eqmId"
                @change="paginationChange"
                :pagination="pagination"
                :scroll="{ y: dataSource.length > 0 ? 1 : 0, x: 100 }"
                class="list_table_1"
                :columns="columns"
                :dataSource="dataSource"
                :openSelector="true"
              >
                <template slot="beipin" slot-scope="row">
                  <a-button
                    type="link"
                    v-Edit
                    class="btn_link"
                    style="cursor: pointer"
                    @click="edit(row, true)"
                  >
                    详情
                  </a-button>
                </template>
                <template slot="operation" slot-scope="row">
                  <a-button
                    type="link"
                    v-Edit
                    class="btn_link"
                    style="cursor: pointer"
                    @click="edit(row, false)"
                  >
                    编辑
                  </a-button>
                </template>
              </a-table>
              <beipinModel
                :visible.sync="visible"
                :isDetail="isDetail"
                ref="formModel"
                :equipment_no="echoMap.equipment_no"
              />
            </div>
          </a-layout-content>
        </a-layout>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
import { featureClassification } from '@/api/standingBook'
import { pageList } from '@/api/equipmentmasterData'
import beipinModel from './components/beipinModel.vue'
export default {
  components: { beipinModel },
  data() {
    return {
      importUrl: '',
      importData: {},
      visible: false,
      isDetail: false,
      echoMap: {},
      //   formData: {},
      selectedRowKeys: [],
      //   Config: {
      //     otherConfigurations: [
      //       //其他参数类型（非表单控件）
      //       {
      //         type: "btn",
      //         label: "保存",
      //         btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
      //         disabled: false, //是否禁用 true 是禁用 默认是false
      //         emit: "save", //传值内容 拿到当前所有数据包装好的
      //       },
      //       {
      //         type: "btn",
      //         label: "取消",
      //         btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
      //         disabled: false, //是否禁用 true 是禁用 默认是false
      //         emit: "cancel", //传值内容 拿到当前所有数据包装好的
      //       },
      //     ],
      //     formDataList: [
      //     ],
      //   },
      searchForm: {},
      selectRowKey: [],
      gData: [],
      dataSource: [],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return {
              children: `${
                (this.pagination.current - 1) * this.pagination.pageSize +
                index +
                1
              }`,
              attrs: { rowSpan: 1 },
            }
          },
          width: 50,
        },
        {
          title: '设备名称',
          dataIndex: 'equipment_name',
          align: 'center',
        },
        {
          title: '设备位号',
          dataIndex: 'equipment_tag_no',
          align: 'center',
        },
        {
          title: '备品备件',
          scopedSlots: { customRender: 'beipin' },
          align: 'center',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: 200,
        },
      ],
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
    }
  },
  mounted() {
    this.getListTree()
  },
  methods: {
    edit(row, isDetail) {
      this.echoMap = row
      this.isDetail = isDetail
      this.visible = true
      this.$nextTick(() => {
        this.$refs.formModel.handleOpen()
      })
    },
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    cancel() {
      this.visible = false
    },
    onSelect(value) {
      this.selectRowKey = value
      let url = 'mdm/eqmMasterData/importExcel?featureClassificId='
      this.importUrl = url + value[0]
      this.getListTree()
    },
    paginationChange(pagination) {
      this.pageList(
        this.selectRowKey.length == 0
          ? this.gData.featureClassificid
          : this.selectRowKey[0],
        pagination.current,
        pagination.pageSize
      )
    },
    search() {
      this.pageList(
        this.selectRowKey.length == 0
          ? this.gData[0].children[0].featureClassificid
          : this.selectRowKey[0],
        1,
        10,
        this.searchForm
      )
    },
    //重置输入
    resetForm() {
      this.searchForm = {
        equipment_name: '',
        equipment_tag_no: '',
      }
      this.pageList(
        this.selectRowKey.length == 0
          ? this.gData[0].children[0].featureClassificid
          : this.selectRowKey[0],
        1,
        10
      )
    },
    pageList(id, pageIndex = 1, pageSize = 10, searchMap = {}) {
      pageList({
        featureClassificId: id,
        pageIndex: pageIndex,
        pageSize: pageSize,
        searchMap: searchMap,
      }).then((res) => {
        if (res) {
          this.dataSource = res.body.data
          this.pagination.current = res.body.pageIndex
          this.pagination.total = res.body.total
          this.pagination.pageSize = res.body.pageSize
          //   setTimeout(() => {
          //     let columnTitle = document.querySelectorAll(
          //       '.ant-table-column-title'
          //     )
          //     let tdTitle = document.querySelectorAll(
          //       '.ant-table-row-cell-break-word'
          //     )
          //     for (let i = 0; i <= columnTitle.length - 1; i++) {
          //       columnTitle[i].title = columnTitle[i].innerHTML
          //     }
          //     for (let j = 0; j <= tdTitle.length - 1; j++) {
          //       tdTitle[j].title = tdTitle[j].innerHTML
          //     }
          //   }, 500)
        }
      })
    },
    // 左侧目录树
    getListTree() {
      featureClassification().then((res) => {
        this.gData = res.body.data
        this.gData.forEach((item) => {
          if (item.children.length > 0) {
            item.disabled = true
          }
        })
        this.pageList(
          this.selectRowKey.length == 0
            ? this.gData[0].children[0].featureClassificid
            : this.selectRowKey[0]
        )
      })
    },
    onDragEnter() {},
    onDrop() {},
  },
}
</script>
<style scoped lang="less">
/deep/.layout-height {
  height: 100%;
}

/deep/#components-layout-demo-basic {
  text-align: unset;
}

.contentLyout {
  margin-left: 20px;
}
</style>
<style>
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
<style lang="less" scoped>
.form_table {
  ::v-deep .ant-form {
    > div {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
}
</style>
