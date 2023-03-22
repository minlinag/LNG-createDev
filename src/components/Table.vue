<script>
/*
    @columns 表头数据参数
    @dataSourcePromise 当前接口                promise格式
    @openSelector是否开启选择器 默认值 false    true | false
    @openIndex是否开启序列号
    @scroll 是否开启滚动效果
*/
export default {
  props: {
    columns: Array,
    dataSource: Array,
    openSelector: Boolean,
    pagination: Object,
    openIndex: Boolean,
    scroll: Object,
  },
  data() {
    return {
      propsData: {},
      selectedRowKeys: [],
    }
  },

  methods: {
    Tableoverflowhidden() {
      setTimeout(() => {
        let columnTitle = document.querySelectorAll('.ant-table-column-title')
        let tdTitle = document.querySelectorAll(
          '.ant-table-row-cell-break-word'
        )
        for (let i = 0; i <= columnTitle.length - 1; i++) {
          columnTitle[i].title = columnTitle[i].innerText
        }
        for (let j = 0; j <= tdTitle.length - 1; j++) {
          // console.log(tdTitle[j])
          tdTitle[j].title = tdTitle[j].innerText
        }
      }, 500)
    },
  },
  render() {
    this.Tableoverflowhidden()
    const on = {
      ...this.$listeners,
    }
    const props = {
      ...this.$attrs,
      ...this.$props,
      // ...{
      // dataSource: this.dataSource,
      // columns: this.columns,
      // pagination:this.pagination,
      // },
    }

    const slots = Object.keys(this.$slots).map((slot) => {
      // return <template slot={slot}>{this.$slots[slot]}</template>;
    })
    // jsx模板语法
    const table = (
      <a-table props={props} scopedSlots={this.$scopedSlots} on={on}>
        {slots}
      </a-table>
    )
    return <div class="w-table">{table}</div>
  },
}
</script>
<style lang="less" scoped>
.w-table {
  margin-top: 5px;
  ::v-deep .ant-table-thead > tr > th.ant-table-selection-column {
    text-align: left;
  }
}
</style>
