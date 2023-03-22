<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb :titleName="title">
      <template slot="appMain">
        <div class="securityCheck">
          <a-table
            @change="paginationChange"
            :pagination="pagination"
            :columns="tableHeaderList"
            :data-source="tableList"
            :scroll="{ x: 600 }"
            v-if="tableHeaderList.length > 0"
          >
            <template slot="serialNumber" slot-scope="row, text, index">
              <span>
                {{
                  `${
                    (pagination.current - 1) * pagination.pageSize + index + 1
                  }`
                }}</span
              >
            </template>
          </a-table>
        </div>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
import {
  queryLubricationArchives,
  queryLubricationArchivesHeader,
} from '@/api/deviceFile'
export default {
  props: ['title', 'globalData'],
  data() {
    return {
      pagination: {
        current: 1,
        total: 0, // 总数
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      tableList: [],
      tableHeaderList: [],
      queryParams: {
        classificCode: this.globalData.relate_id,
        sbbm: this.globalData.feature_classificid,
        pageNum: 1,
        pageSize: 10,
      },
      columns: [],
    }
  },
  watch: {
    title: {
      handler() {
        this.queryParams.pageNum = 1
        this.queryParams.pageSize = 10
        this.pagination.pageSize = 10
        this.pagination.current = 1
        this.generateHeader()
        this.getList()
      },
      immediate: true,
    },
  },
  created() {
    this.generateHeader()
    this.getList()
  },
  methods: {
    paginationChange(val) {
      this.queryParams.pageNum = val.current
      this.queryParams.pageSize = val.pageSize
      this.pagination.pageSize = val.pageSize
      this.pagination.current = val.current
      this.getList()
    },
    getList() {
      queryLubricationArchives(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableList = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    generateHeader() {
      queryLubricationArchivesHeader({
        classificCode: this.globalData.relate_id,
        sbbm: this.globalData.feature_classificid,
      }).then((res) => {
        if (res.code == 200) {
          this.tableHeaderList = []
          for (const key in res.body[0]) {
            if (Object.hasOwnProperty.call(res.body[0], key)) {
              let newItem = {}
              const element = res.body[0][key]
              newItem.title = key
              newItem.dataIndex = element
              newItem.width = 150
              this.tableHeaderList.push(newItem)
            }
          }
          this.tableHeaderList.unshift({
            title: '序号',
            width: 50,
            scopedSlots: { customRender: 'serialNumber' },
            // customRender: (value, row, index) => {
            //   return {
            //     attrs: { rowSpan: 1 },
            //   };
            // },
          })
          // this.tableHeaderList[this.tableHeaderList.length - 1].fixed = 'right'
        }
      })
    },

  },
}
</script>
<style scoped lang="less">
.wrapper {
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
