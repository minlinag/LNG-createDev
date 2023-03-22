<template>
  <div>
    <a-form-model v-model="form" :layout="'inline'">
      <a-col :span="6" v-for="(item, index) in equipmentList" :key="item.type">
        <a-form-model-item
          :labelCol="{ style: 'width: 150px' }"
          :label="item.label"
        >
          <a-input ref="select" v-model="item.value"></a-input>
        </a-form-model-item>
      </a-col>
    </a-form-model>
    <div class="queryItem">
      <a-button type="primary" @click="inSerach"> 查询 </a-button>
    </div>
    <dc-table
      @change="paginationChangeInTwo"
      :pagination="paginationThree"
      :row-selection="{
        selectedRowKeys: selectedRowKeysThree,
        onChange: onSelectChangeThree,
      }"
      rowKey="id"
      :scroll="{ x: 100 }"
      :columns="columnsEquipment"
      :dataSource="EquipmentDataSource"
      :openSelector="false"
    ></dc-table>
    <div class="footer">
      <a-button type="primary" @click="EquipmentNameClick()"> 确定 </a-button>
      <a-button @click="cancelEquipment" :style="{ marginLeft: '8px' }"
        >取消
      </a-button>
    </div>
  </div>
</template>

<script>
import {
  // queryCommonColumn,
  queryPageListForUnClass,
  queryPublicSearchColumn
} from "@/api/PublicInterface";
export default {
  name: "",
  data() {
    return {
      selectedRowKeysThree: [],
      equipmentObject: null,
      equipmentList: null,
      form: {},
      EquipmentDataSource: [],
      columnsEquipment: [],
      paginationThree: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 10, // 每页条数，所有页设置统一的条数
        pageIndex: 1
      },
    }
  },
  component: {},
  mounted() {
    this.queryPublicSearchColumn();
    this.queryPageListForUnClass();
  },
  methods: {
    onSelectChangeThree(selectedRowKeys, selectedRow) {
      this.selectedRowKeysThree = [selectedRowKeys[selectedRowKeys.length - 1]];
    },
    paginationChangeInTwo(pagination) {
      this.queryPageListForUnClass(
        pagination.current,
        pagination.pageSize,
        this.equipmentObject
      );
    },
    EquipmentNameClick() {
      this.$emit("infoList", this.EquipmentDataSource[this.selectedRowKeysThree])
    },
    cancelEquipment() {
      this.visibleEquipmentName = false;
    },
    // 公共方法查询
    inSerach() {
      this.equipmentObject = {};
      this.equipmentList.forEach((item) => {
        this.equipmentObject[item.type] = item.value;
      });
      this.queryPageListForUnClass(1, 10, this.equipmentObject);
    },
    queryPageListForUnClass(pageIndex = 1, pageSize = 10, mapEntity = {}) {
      let params = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        searchMap: mapEntity,
      };
      // queryCommonColumn().then((res) => {
      //   this.columnsEquipment = [];
      //   res.body.data.forEach((item) => {
      //     if (item !== null) {
      //       this.columnsEquipment.push({
      //         title: item.characterDesc,
      //         dataIndex: item.characterCode,
      //         width: 100,
      //       });
      //     }
      //   });
      // });
      this.columnsEquipment = [
        {
          title: '设备名称',
          dataIndex: 'equipment_name',
          width: 100,
        }, {
          title: '设备位号',
          dataIndex: 'equipment_tag_no',
          width: 100,
        }, {
          title: '设备编号（设备编码）',
          dataIndex: 'equipment_no',
          width: 130,
        }, {
          title: '所属设备',
          dataIndex: 'equipment',
          width: 100,
        }, {
          title: '使用单位',
          dataIndex: 'user',
          width: 100,
        }, {
          title: '型号规格',
          dataIndex: 'model_and_specification',
          width: 100,
        },
      ]
      queryPageListForUnClass(params).then((res) => {
        this.selectedRowKeysThree = [];
        this.EquipmentDataSource = res.body.data;
        this.paginationThree.current = res.body.pageIndex;
        this.paginationThree.total = res.body.total;
        this.paginationThree.pageSize = res.body.pageSize;
      });
    },
    // 公共查询条件
    queryPublicSearchColumn() {
      queryPublicSearchColumn().then((res) => {
        let arr = [];
        res.body.data.forEach((item) => {
          if (item !== null) {
            arr.push({
              label: item.characterDesc,
              type: item.characterCode,
              value: "",
            });
            this.equipmentList = arr;
          }
        });
      });
    },
  }
}
</script>

<style scoped>
.footer {
  text-align: center;
}
</style>
