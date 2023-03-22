<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <div slot="extra">
        <pe-button
          :include="[{ value: '返回', clickName: 'return', icon: 'Go-icon' }]"
          @return="goBack"
        ></pe-button>
      </div>
    </template>
    <template slot="appMain">
      <div class="contanier">
        <div class="pieClass">
          <img src="@/static/kanban/yasuoji.png" width="200" alt="" />
          <div class="headerTitle">
            <div style="font-size: 18px">BOG压缩机共计：</div>
            <div>
              <span style="font-size: 26px; color: #02a4f7">5</span>
              <span>台</span>
            </div>
          </div>
        </div>
        <div v-for="item in data" :key="item.name" class="numberClass">
          <img
            :src="require(`@/static/kanban/${item.img}.jpg`)"
            width="40"
            alt=""
          />
          <span>{{ item.name }}</span>
          <span style="font-size: 20px">{{ item.value }}</span>
        </div>
      </div>
      <div class="cardContanier">
        <div class="card" v-for="(item, index) in dataSource" :key="index">
          <img
            class="positionImg"
            :src="require(`@/static/kanban/${item.img}.jpg`)"
            width="12%"
            alt=""
          />
          <div>
            <div class="title">BOG压缩机</div>
            <!-- <div>处理器</div> -->
          </div>
          <div class="text">
            <div v-for="(item1, index) in item.data" :key="index">
              <div class="data" v-if="index === 0 || index % 2 === 0">
                <span
                  >{{ item.data[index].name }}:{{
                    item.data[index].value
                  }}</span
                >
                <span
                  >{{ item.data[index + 1]?.name }}
                  <span v-if="item.data[index + 1]?.name">:</span>
                  {{ item.data[index + 1]?.value }}</span
                >
              </div>
              <div v-if="index % 3 === 0 && index !== 0" class="line"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Breadcrumb>
</template>
<script>
export default {
  name: 'comprehensiveKanban',
  data() {
    return {
      // 筛选字段
      searchField: {
        type: undefined,
      },
      //设备类型下拉框
      typeOptions: [
        {
          value: '压缩机',
          label: '压缩机',
        },
        {
          value: '泵机',
          label: '泵机',
        },
        {
          value: '储罐',
          label: '储罐',
        },
        {
          value: 'SCV',
          label: 'SCV',
        },
        {
          value: 'ORV',
          label: 'ORV',
        },
      ],
      //   selectedRowKeys: [],
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 50,
          align: 'center',
        },
        {
          title: '设备类别',
          dataIndex: 'deviceName',
          align: 'center',
        },
        {
          title: '运行',
          dataIndex: 'deviceBitNum',
          align: 'center',
        },
        {
          title: '停用',
          dataIndex: 'deviceBitNum',
          align: 'center',
        },
        {
          title: '备用',
          dataIndex: 'deviceBitNum',
          align: 'center',
        },
        {
          title: '待维护',
          dataIndex: 'deviceBitNum',
          align: 'center',
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: 100,
        },
      ],
      dataSource: [
        {
          name: '运行',
          img: 'yunxing',
          data: [
            { name: '本月运行时长', value: '3' },
            { name: '累计运行时长', value: '2' },
            { name: '距离下次保养(时间)', value: '1' },
            { name: '维护周期', value: '1' },
            { name: '设备故障维修(次)', value: '1' },
            { name: '设备保养记录(次)', value: '1' },
            { name: '设备累计启动次数', value: '1' },
            { name: '设备累计停机次数', value: '1' },
            { name: '总处理量', value: '12' },
          ],
        },
        {
          name: '停用',
          img: 'tingyong',
          data: [
            { name: '本月运行时长', value: '3' },
            { name: '累计运行时长', value: '2' },
            { name: '距离下次保养(时间)', value: '1' },
            { name: '维护周期', value: '1' },
            { name: '设备故障维修(次)', value: '1' },
            { name: '设备保养记录(次)', value: '1' },
            { name: '设备累计启动次数', value: '1' },
            { name: '设备累计停机次数', value: '1' },
            { name: '总处理量', value: '12' },
          ],
        },
        {
          name: '备用',
          img: 'beiyong',
          data: [
            { name: '本月运行时长', value: '3' },
            { name: '累计运行时长', value: '2' },
            { name: '距离下次保养(时间)', value: '1' },
            { name: '维护周期', value: '1' },
            { name: '设备故障维修(次)', value: '1' },
            { name: '设备保养记录(次)', value: '1' },
            { name: '设备累计启动次数', value: '1' },
            { name: '设备累计停机次数', value: '1' },
            { name: '总处理量', value: '12' },
            { name: '总处理量', value: '12' },
          ],
        },
        {
          name: '待维护',
          img: 'daiweihu',
          data: [
            { name: '本月运行时长', value: '3' },
            { name: '累计运行时长', value: '2' },
            { name: '距离下次保养(时间)', value: '1' },
            { name: '维护周期', value: '1' },
            { name: '设备故障维修(次)', value: '1' },
            { name: '设备保养记录(次)', value: '1' },
            { name: '设备累计启动次数', value: '1' },
            { name: '设备累计停机次数', value: '1' },
            { name: '总处理量', value: '12' },
          ],
        },
        {
          name: '待维护',
          img: 'daiweihu',
          data: [
            { name: '本月运行时长', value: '3' },
            { name: '累计运行时长', value: '2' },
            { name: '距离下次保养(时间)', value: '1' },
            { name: '维护周期', value: '1' },
            { name: '设备故障维修(次)', value: '1' },
            { name: '设备保养记录(次)', value: '1' },
            { name: '设备累计启动次数', value: '1' },
            { name: '设备累计停机次数', value: '1' },
            { name: '总处理量', value: '12' },
          ],
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
      data: [
        {
          value: 1,
          name: '运行',
          img: 'yunxing',
        },
        {
          value: 1,
          name: '停用',
          img: 'tingyong',
        },
        {
          value: 1,
          name: '备用',
          img: 'beiyong',
        },
        {
          value: 2,
          name: '待维护',
          img: 'daiweihu',
        },
      ],
    }
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>
<style lang="less" scoped>
.contanier {
  display: flex;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  .pieClass {
    // width: 200px;
    // height: 150px;
    // z-index: 0;
    display: flex;
    justify-content: center;
    .headerTitle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .numberClass {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 200px;
    line-height: 30px;
    background-color: #f7f8fa;
    border-radius: 5px;
    span {
      margin: 0 5px 0 5px;
    }
    span:nth-child(3) {
      font-size: 30px;
    }
  }
}
.cardContanier {
  display: flex;
  widows: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  .card {
    width: 24%;
    border: 1px solid #d5d5d5;
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    height: 200px;
    position: relative;
    overflow: hidden;
    .positionImg {
      border-radius: 50%;
      // box-shadow: 2px 2px 3px 3px rgba(0, 0, 0, 0.3);
      position: absolute;
      top: -8px;
      right: -8px;
    }
    &:hover {
      box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
    }
    .title {
      font-size: 20px;
    }
    .text {
      margin-top: 10px;
      font-size: 12px;
      .data {
        display: flex;
        justify-content: space-between;
      }
      .line {
        height: 1px;
        background-color: #d5d5d5;
        margin: 10px 0 10px 0;
      }
    }
  }
}
</style>
