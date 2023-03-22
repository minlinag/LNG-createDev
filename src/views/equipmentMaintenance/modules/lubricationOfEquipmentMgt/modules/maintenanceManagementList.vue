<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'openMode',
            clickName: 'addPlan',
            icon: 'open-icon',
            isPower: false,
            name: '打开模板',
          },
        ]"
        @addPlan="addPlan"
      ></pe-button>
      <!-- <a-button v-Query
                class="buttonType btn_primary"
                type="primary"
                icon="import"
                @click.stop="addPlan">
        打开模板
      </a-button> -->
    </template>
    <template slot="appMain">
      <dc-table
        rowKey="id"
        :scroll="{ x: 100 }"
        :pagination="pagination"
        @change="paginationChange"
        :columns="columns"
        :dataSource="dataSource"
        :openSelector="false"
      >
        <template slot="operation" slot-scope="row">
          <pe-button
            :include="[
              {
                value: 'View',
                type: 'link',
                icon: '',
                name: '查看',
                clickName: 'getListDetail',
                isPower: false,
                style: ['btn_link'],
              },
              {
                value: 'download',
                type: 'link',
                icon: '',
                name: '下载',
                clickName: 'upDateListDetail',
                isPower: false,
                style: ['btn_link'],
              },
            ]"
            @getListDetail="getListDetail(row)"
            @upDateListDetail="upDateListDetail(row)"
          ></pe-button>
          <!-- <a-button type="link"
                    class="btn_link"
                    style="cursor: pointer;"
                    @click="getListDetail(row,0)">
            查看
          </a-button>
          <a-button type="link"
                    class="btn_link"
                    style="cursor: pointer;"
                    @click="upDateListDetail(row)">
            下载
          </a-button> -->

          <!--<span class="look" @click="getListDetail(row,1)">-->
          <!--编辑-->
          <!--</span>-->
        </template>
      </dc-table>
    </template>
  </Breadcrumb>
</template>
<script>
import utils from "@/utils/url";
// import dcTable from '@/components/table'
import {
  getList, //获取列表
  addList, //获取列表
  upDateList, //修改列表
  getdict,
  exportExcel, //导出列表
} from "@/api/maintenanceManagementList";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      urls: "/eqmlubricationManager/exportExcel",
      pagination: {
        current: 0,
        // defaultCurrent: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
        pageSize: 0, // 每页条数，所有页设置统一的条数
      },
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1}`,
          width: 70,
        },
        // {
        //   title: "记录状态 ",
        //   dataIndex: "recordStatus",
        //   scopedSlots: { customRender: "status" },
        // },
        {
          title: "版本号",
          dataIndex: "versionNumber",
          scopedSlots: { customRender: "versionNumber" },
        },
        // {
        //   title: "状态 ",
        //   dataIndex: "status",
        //   scopedSlots: { customRender: "status" },
        // },
        {
          title: "描述",
          dataIndex: "description",
        },
        {
          title: " 创建者",
          dataIndex: "createdUser",
          // slots: { title: 'equipmentCategory' },//表头插槽
        },
        {
          title: "创建时间",
          dataIndex: "createdDateTime",
        },
        {
          title: " 最终编辑人",
          dataIndex: "lastModifiedUser",
          // slots: { title: 'equipmentCategory' },//表头插槽
        },
        {
          title: "最终编辑时间",
          dataIndex: "lastModifiedDateTime",
        },
        {
          fixed: "right",
          title: "操作",
          width: 100,
          scopedSlots: { customRender: "operation" },
        },
      ],
      dataSource: [
        {
          key: "1",
          equipmentName: 1,
        },
      ],
      searchInfo: {
        pageIndex: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.getList();
  },
  created() { },
  methods: {
    select() {
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = 10;
      this.getList();
    },
    //分页点击
    paginationChange(pagination) {
      this.searchInfo.pageIndex = pagination.current;
      this.searchInfo.pageSize = pagination.pageSize;
      this.getList();
    },

    //点击新增
    addPlan() {
      this.$router.push({
        path: "/maintenanceManagement",
      });
    },
    //点击编辑
    upDateListDetail(val) {
      window.location.href =
        utils.baseURL + this.urls + "?" + "versionNumber=" + val.versionNumber;
    },
    //点击查看
    getListDetail(val, type) {
      this.$router.push({
        path: "/maintenanceManagement",
        query: { versionNumber: val.versionNumber, type: type },
      });
    },

    //获取表格列表
    getList() {
      var i = 1;
      getList(this.searchInfo).then((res) => {
        this.dataSource = [];
        // console.log(res);
        res.body.data.forEach((item) => {
          if (item) {
            item.id = i += 1;
            this.dataSource.push(item);
          }
        });
        // this.dataSource = res.body.data
        this.pagination.current = res.body.pageIndex;
        this.pagination.pageSize = res.body.pageSize;
        this.pagination.total = res.body.total;
      });
    },
    //重置输入
    resetForm() {
      this.searchInfo = {};
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin: 0;
  padding: 0;
}

.equipmentDisplay {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ant-form {
  display: flex;
  justify-content: left;
}

.equipmentSelection {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-left: -17px;
  margin-top: 10px;
}

/deep/ .equipmentDisplay-checkbox {
  margin-top: 10px;
}

.look {
  color: rgb(24, 144, 255);
  // color: white;
}

.Myserch {
  display: flex;
  justify-content: end;
}

.bar {
  width: 100%;
  height: 10px;
  margin-top: 10px;
  background-color: #ececec;
  // box-shadow: 2px 2px 5px #333;
  border-radius: 5px;
}

span {
  cursor: pointer;
  padding: 0 5px;
}
</style>
