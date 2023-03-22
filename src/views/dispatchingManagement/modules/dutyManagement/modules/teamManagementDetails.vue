<template>
  <a-form-model ref="dataForm" :model="recode" :rules="rules">
    <a-layout>
      <a-layout-content :style="ClassShow ? 'height:71vh' : 'height:53vh'">
        <a-row :gutter="24">
          <a-col :span="11">
            <a-form-model-item
              label="创建人："
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.createdUser"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="创建日期："
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.createdDateTime"
                disabled
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item
              label="班组名称："
              prop="teamName"
              :labelCol="{ style: 'width: 140px' }"
            >
              <a-input
                placeholder="请输入"
                v-model="recode.teamName"
                :disabled="Recodedisabled"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <template>
            <a-col :span="22">
              <a-form-model-item
                label="班组成员(内部)："
                :labelCol="{ style: 'width: 120px' }"
              >
                <a-textarea
                  v-model="recode.teamMember"
                  disabled
                  placeholder="请输入班组名成员"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="2">
              <a-form-model-item>
                <a-button
                  type="primary"
                  :disabled="Recodedisabled"
                  @click="ClassShow = true"
                >
                  选择
                </a-button>
              </a-form-model-item>
            </a-col>

            <a-col :span="22" v-if="ClassShow" style="margin-bottom: 1rem">
              <a-tree-select
                v-model="recode.unitName"
                class="treeSelect"
                style="width: 20%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择所属单元"
                @change="OnchangeInside"
                allow-clear
                tree-default-expand-all
              >
                <a-tree-select-node key="0-1" value="全部" title="全部">
                  <template v-for="item in treeData">
                    <a-tree-select-node
                      :key="item.userId"
                      :value="item.unitCode"
                      :title="item.unitName"
                    >
                      <template v-if="item.children">
                        <template v-for="em in item.children">
                          <a-tree-select-node
                            :key="em.userId"
                            :value="em.unitCode"
                            :title="em.unitName"
                          />
                        </template>
                      </template>
                    </a-tree-select-node>
                  </template>
                </a-tree-select-node>
              </a-tree-select>

              <a-transfer
                :titles="['', '班组成员']"
                :data-source="insideData"
                :target-keys="insideKey"
                :show-search="true"
                :filter-option="
                  (inputValue, item) => item.title.indexOf(inputValue) !== -1
                "
                :show-select-all="false"
                @change="handleChange"
                searchPlaceholder="请输入员工姓名"
              >
                <template
                  slot="children"
                  slot-scope="{
                    props: {
                      direction,
                      filteredItems,
                      selectedKeys,
                      disabled: listDisabled,
                    },
                    on: { itemSelectAll, itemSelect },
                  }"
                >
                  <a-table
                    :row-selection="
                      getRowSelection({
                        disabled: listDisabled,
                        selectedKeys,
                        itemSelectAll,
                        itemSelect,
                      })
                    "
                    :columns="direction === 'left' ? leftColumns : rightColumns"
                    :data-source="filteredItems"
                  />
                </template>
              </a-transfer>
            </a-col>
            <a-col :span="2">
              <a-form-model-item>
                <a-button
                  type="primary"
                  v-if="ClassShow"
                  :disabled="Recodedisabled"
                  @click="insideClick"
                >
                  完成
                </a-button>
              </a-form-model-item>
            </a-col>
          </template>
          <template>
            <a-col :span="22">
              <a-form-model-item
                label="班组成员(外部)："
                :labelCol="{ style: 'width: 120px' }"
              >
                <a-textarea
                  v-model="recode.externalTeamMember"
                  disabled
                  placeholder="请输入班组名成员"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="2">
              <a-form-model-item>
                <a-button
                  type="primary"
                  :disabled="Recodedisabled"
                  @click="ClassShowexternal = true"
                >
                  选择
                </a-button>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="22"
              v-if="ClassShowexternal"
              style="margin-bottom: 1rem"
            >
              <a-tree-select
                v-model="recode.unitName"
                class="treeSelect"
                style="width: 20%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择所属单元"
                allow-clear
                @change="OnchangeExternal"
                tree-default-expand-all
              >
                <a-tree-select-node key="0-1" value="全部" title="全部">
                  <template v-for="item in treeData">
                    <a-tree-select-node
                      :key="item.userId"
                      :value="item.unitCode"
                      :title="item.unitName"
                    >
                      <template v-if="item.children">
                        <template v-for="em in item.children">
                          <a-tree-select-node
                            :key="em.userId"
                            :value="em.unitCode"
                            :title="em.unitName"
                          />
                        </template>
                      </template>
                    </a-tree-select-node>
                  </template>
                </a-tree-select-node>
              </a-tree-select>

              <a-transfer
                placeholder="请输入班组名成员"
                :titles="['', '班组成员']"
                :data-source="externalData"
                :target-keys="externalKey"
                :show-search="true"
                searchPlaceholder="请输入员工姓名"
                :filter-option="
                  (inputValue, item) => item.title.indexOf(inputValue) !== -1
                "
                :show-select-all="false"
                @change="handleChangeexternal"
              >
                <template
                  slot="children"
                  slot-scope="{
                    props: {
                      direction,
                      filteredItems,
                      selectedKeys,
                      disabled: listDisabled,
                    },
                    on: { itemSelectAll, itemSelect },
                  }"
                >
                  <a-table
                    :row-selection="
                      getRowSelection({
                        disabled: listDisabled,
                        selectedKeys,
                        itemSelectAll,
                        itemSelect,
                      })
                    "
                    :columns="direction === 'left' ? leftColumns : rightColumns"
                    :data-source="filteredItems"
                  />
                </template>
              </a-transfer>
            </a-col>
            <a-col :span="2">
              <a-form-model-item>
                <a-button
                  type="primary"
                  v-if="ClassShowexternal"
                  @click="externalClick"
                >
                  完成
                </a-button>
              </a-form-model-item>
            </a-col>
          </template>
        </a-row>
      </a-layout-content>
      <a-layout-footer v-if="formType != 'look'">
        <a-button type="primary" @click="handleOk"> 保存</a-button>
        <a-button @click="handleCancel"> 取消</a-button>
      </a-layout-footer>
    </a-layout>
  </a-form-model>
</template>
<script>
import difference from "lodash/difference";
import {
  TeamGroupInsert,
  TeamGroupUpdate,
  getUsersDataByUnit,
  getUnits,
} from "@/api/dispatchingManagement/teamManagement";

const TableColumns = [
  { dataIndex: "title", title: "姓名" },
  { dataIndex: "key", title: "编码" },
];

export default {
  name: "versionManagementDetalis",
  props: {
    recode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formType: String,
    Recodedisabled: Boolean,
    applicationsVisible: Boolean,
  },
  data() {
    return {
      value: undefined,
      treeData: [],
      mookData: [],
      insideData: [],
      insideKey: [], //内部key
      externalData: [],
      externalKey: [], //外部key
      selectedKeys: [],
      leftColumns: TableColumns,
      rightColumns: TableColumns,
      ClassShow: false,
      ClassShowexternal: false,
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
      rules: {
        teamName: [{ required: true, message: "班组名称不能为空" }],
      },
    };
  },
  watch: {
    applicationsVisible() {
      this.getUsers();
    },
  },
  created() {
    this.getUnits();
    this.getUsers();
  },
  methods: {
    getUnits() {
      getUnits().then((res) => {
        this.treeData = res;
      });
    },
    OnchangeExternal(e) {
      const data = { unitCode: e };
      if (e == "全部") {
        getUsersDataByUnit().then((res) => {
          this.mookData = res.body;
          this.externalFun(res.body);
        });
      } else {
        getUsersDataByUnit(data).then((res) => {
          this.mookData = res.body;
          this.externalFun(res.body);
        });
      }
    },
    OnchangeInside(e) {
      const data = { unitCode: e };
      if (e == "全部") {
        getUsersDataByUnit().then((res) => {
          this.mookData = res.body;
          this.externalFun(res.body);
        });
      } else {
        getUsersDataByUnit(data).then((res) => {
          this.mookData = res.body;
          this.insideFun(res.body);
        });
      }
    },
    getUsers() {
      const data = { unitCode: this.$store.state.user.unitCode };
      getUsersDataByUnit(data).then((res) => {
        this.mookData = res.body;
        this.insideFun(res.body);
        this.externalFun(res.body);
      });
    },
    // 内部完成
    insideClick() {
      this.ClassShow = false;
      this.externalFun(this.mookData);
    },
    // 内部成员
    insideFun(datas) {
      let insideData = [];
      datas.forEach((element) => {
        let row = {
          key: element.userCode,
          title: element.name,
          disabled: !this.externalKey.find((item) => item == element.userCode)
            ? false
            : true,
        };
        insideData.push(row);
      });
      this.insideData = insideData;
      this.insideKey = this.recode.insideKey
        ? this.recode.insideKey.split(",")
        : [];
    },
    // 外部完成
    externalClick() {
      this.ClassShowexternal = false;
      this.insideFun(this.mookData);
    },
    // 外部成员
    externalFun(datas) {
      let externalData = [];
      datas.forEach((element) => {
        let row = {
          key: element.userCode,
          title: element.name,
          disabled: !this.insideKey.find((item) => item == element.userCode)
            ? false
            : true,
        };
        externalData.push(row);
      });
      this.externalData = externalData;
      this.externalKey = this.recode.externalKey
        ? this.recode.externalKey.split(",")
        : [];
    },

    handleOk() {
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          if (this.formType == "add") {
            TeamGroupInsert(this.recode).then((res) => {
              if (res.code == "200") {
                this.handleCancel();
                this.$message.success("新增成功");
                this.$emit("getList");
              } else {
                this.$message.warning("新增失败");
              }
            });
          } else {
            TeamGroupUpdate(this.recode).then((res) => {
              if (res.code == "200") {
                this.handleCancel();
                this.$message.success("编辑成功");
                this.$emit("getList");
              } else {
                this.$message.warning("编辑失败");
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.$refs.dataForm.clearValidate()
      this.$emit("close");
    },
    // 内部
    handleChange(nextTargetKeys, direction) {
      let calssnameArr = [];
      this.insideKey = nextTargetKeys;
      nextTargetKeys.forEach((element) => {
        let row = this.insideData.find((item) => item.key == element);
        console.log("row", row);
        if (row) {
          calssnameArr.push(row.title);
        }
      });
      if (nextTargetKeys) {
        this.recode.teamMember = calssnameArr.join(",");
        this.recode.insideKey = nextTargetKeys.join(",");
      }
    },
    // 外部
    handleChangeexternal(nextTargetKeys, direction) {
      let calssnameArr = [];
      this.externalKey = nextTargetKeys;

      nextTargetKeys.forEach((element) => {
        let row = this.externalData.find((item) => item.key == element).title;
        calssnameArr.push(row);
      });
      this.recode.externalTeamMember = calssnameArr.join(",");
      this.recode.externalKey = nextTargetKeys.join(",");
    },

    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({
          props: { disabled: disabled || item.disabled },
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
  },
};
</script>
<style lang="less">
.treeSelect {
  position: absolute;
  margin-top: 4px;
  left: 17vw;
  z-index: 1;
}
.rangePickerWidth .ant-form-item-control .ant-input {
  width: 495px !important;
}
.ant-transfer-list {
  width: 40%;
}
.from-style .ant-modal-content .ant-modal-body {
  height: 70vh;
}
</style>
