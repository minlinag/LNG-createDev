<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb :titleName="title">
      <template slot="appMain">
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
        >
          <template slot="operate" slot-scope="row">
            <a-button
              type="link"
              class="btn_link"
              style="cursor: pointer"
              @click="editClick(row)"
            >
              编辑
            </a-button>
          </template>
          <template slot="footer">
            <div class="footer_style">
              <span>
                <p>累计发现缺陷数:</p>
                {{ this.statisticAmount }}
              </span>
              <span>
                <p>未处理缺陷数:</p>
                {{ this.amountUntreated }}
              </span>
            </div>
          </template>
        </a-table>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
import {
  findAllList,
  StatisticAmountUntreated,
  StatisticAmount,
} from '@/api/oneMachineOneFile/equipmentDefectRecord'
export default {
  name: 'equipmentDefectRecordList',
  props: ['title', 'deviceCode'],
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
          title: '设备位号',
          dataIndex: 'deviceNo',
        },
        {
          title: '缺陷现象',
          dataIndex: 'defectPhenomenon',
        },
        {
          title: '发现人',
          dataIndex: 'discoverer',
        },
        {
          title: '发现日期',
          dataIndex: 'findTime',
        },
        {
          title: '处理记录',
          dataIndex: 'disposeRecord',
        },
        {
          title: '消缺人',
          dataIndex: 'eliminateName',
        },
        {
          title: '备注',
          dataIndex: 'remark',
        },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceCode: this.deviceCode,
      },
      tableList: [],
      selectedRowKeys: [],
      hiddenVisible: false,
      formdata: {},
      formTitle: '',
      amountUntreated: '',
      statisticAmount: '',
    }
  },
  created() {
    this.getStatisticAmountUntreated()
    this.getStatisticAmount()
    this.getList()
  },
  methods: {
    getStatisticAmountUntreated() {
      StatisticAmountUntreated({ deviceCode: this.deviceCode }).then((res) => {
        if (res.code == 200) {
          this.amountUntreated = res.body
        }
      })
    },
    getStatisticAmount() {
      StatisticAmount({ deviceCode: this.deviceCode }).then((res) => {
        if (res.code == 200) {
          this.statisticAmount = res.body
        }
      })
    },
    getList() {
      findAllList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableList = res.body.data
          this.pagination.total = res.body.total
        }
      })
    },
    paginationChange(val) {
      this.queryParams.pageNum = val.current
      this.queryParams.pageSize = val.pageSize
      this.getList()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    addAndEditClose() {
      this.hiddenVisible = false
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
::v-deep .ant-table-footer {
  width: calc(100% - 5px);
  padding-bottom: 0px;
}
.footer_style {
  margin-top: -16px;
  span {
    width: calc(100% + 32px);
    margin-left: -16px;
    display: inline-block;
    line-height: 38px;
    border-bottom: 1px solid #e8e8e8;
    padding-left: 20px;
    p {
      display: inline-block;
      width: 120px;
      margin-bottom: 0;
    }
  }
  span + span {
    background: #f3f5f8;
  }
}
</style>
