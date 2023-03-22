<template>
  <div>
    <div class="form_piece_title">
      <span>安全措施</span>
      <a-button type="primary" @click="addTableClick" :disabled="checkForm"
        >新增
      </a-button>
    </div>
    <a-table
      :scroll="{ y: 200, x: 300 }"
      :pagination="false"
      :columns="columns"
      :dataSource="formModel.csList"
      :openSelector="true"
      ref="singleTable"
      class="file_list multi_line"
      :rowKey="
        (record, index) => {
          return index;
        }
      "
      v-if="contentState"
    >
      <template slot="csName" slot-scope="text, record, index" class="csName">
        <a-form-model-item>
          <editable-cell
            :text="text.csName"
            :index="index + 'csName'"
            :edit-show="text.isEdit != '0'"
            v-if="hiddenVisible"
            @change="onCellChange(index, 'csName', $event)"
          />
        </a-form-model-item>
      </template>
      <template
        slot="isExecute"
        slot-scope="text, record, index"
        class="isExecute"
      >
        <a-form-model-item style="width: 80px" class="implement">
          <a-select
            style="width: 80px"
            v-model="text.isExecute"
            :disabled="text.isEdit == '0'"
          >
            <a-select-option value="已执行">已执行 </a-select-option>
            <a-select-option value="未执行">未执行</a-select-option>
          </a-select>
        </a-form-model-item>
      </template>
      <template slot="sort">
        <a-icon
          style="cursor: sn-resize; fontsize: 20px"
          type="drag"
          class="move"
          :style="moveStyle"
        />
      </template>
      <!-- 行内操作列按钮 -->
      <template slot="operation" slot-scope="text, record, index">
        <a-button
          type="link"
          @click="deleteClick(text, record, index)"
          class="delete_color btn_link"
          :disabled="text.isEdit == '0'"
          >删除
        </a-button>
      </template>
    </a-table>
    <a-col :span="8" style="margin-top: 20px">
      <a-form-model-item label="工作地点保留带电部分或注意事项">
        <a-input
          v-model.trim="formModel.attention"
          placeholder="请输入"
        ></a-input>
      </a-form-model-item>
    </a-col>
  </div>
</template>

<script>
import editableCell from './editableCell.vue'

import Sortable from 'sortablejs'
export default {
  name: "jobTicketAddEditForm",
  components: {
    editableCell,
  },
  props: ['type', 'hiddenVisible', 'checkForm', 'formEditData'],
  data() {
    return {
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return {
              children: `${index +
                1
                }`,
              attrs: { rowSpan: 1 },
            };
          }
          ,
          width: 50,
        }, {
          title: '安全措施',
          scopedSlots: { customRender: 'csName' },
        }, {
          title: '是否执行',
          scopedSlots: { customRender: 'isExecute' },
          width: 120,
        }, {
          title: '排序',
          width: 60,
          scopedSlots: { customRender: 'sort' },
        }, {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 100,
        }],
      formModel: {
        csList: [
          {
            csName: "应拉断路器（开关）、隔离开关（刀闸）",
            isExecute: "已执行",
            isEdit: "0",
          }, {
            csName: "应装接地线、应合接地刀闸（注明确实地点及名称及接地线编号）",
            isExecute: "已执行",
            isEdit: "0",
          }, {
            csName: "应设遮栏、应挂标示牌及防止二次回路误碰等措施",
            isExecute: "已执行",
            isEdit: "0",
          }
        ], //安全措施
        attention: '', //工作地点保留带电部分或注意事项
      },
      companySelectOption: [], //单位下拉框
      singleTableLoading: false,
      runTime: [],
      contentState: true,
      moveStyle: {
        color: '#1890ff',
      },
    }
  },
  watch: {
    hiddenVisible: {
      handler(val) {
        if (val) {
          this.formModel = {
            csList: [
              {
                csName: "应拉断路器（开关）、隔离开关（刀闸）",
                isExecute: "已执行",
                isEdit: "0",
              }, {
                csName: "应装接地线、应合接地刀闸（注明确实地点及名称及接地线编号）",
                isExecute: "已执行",
                isEdit: "0",
              }, {
                csName: "应设遮栏、应挂标示牌及防止二次回路误碰等措施",
                isExecute: "已执行",
                isEdit: "0",
              }
            ], //安全措施
            attention: '', //工作地点保留带电部分或注意事项
          }
        }
        this.$nextTick(() => {
          if (this.checkForm) {
            this.moveStyle.color = '#3d3d3d'
            return false
          }
          this.moveStyle.color = '#1890ff'
          this.dragSort()
        })
      },
      immediate: true,

    }
  },
  methods: {
    addTableClick() {
      if (this.formModel.csList.length >= 12) {
        this.$message.warning('最多添加12条数据')
        return false
      }
      this.formModel.csList.push(
        {
          csName: "",
          isExecute: "",
          isEdit: "1",
        }
      )
    },
    onCellChange(index, dataIndex, value) {
      this.formModel.csList[index][dataIndex] = value
    },
    deleteClick(text, record, index) {
      this.contentState = false
      this.formModel.csList.splice(index, 1);
      this.contentState = true
    },
    dragSort() {
      if (this.$refs.singleTable) {
        const el = this.$refs.singleTable.$el.querySelectorAll(
          '.ant-table-body > table > tbody'
        )[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'ghost',
          handle: '.move',
          onEnd: (e) => {
            let sortList = JSON.parse(JSON.stringify(this.formModel.csList))
            const targetRow = sortList.splice(e.oldIndex, 1)[0]
            console.log(e.newIndex)
            sortList.splice(e.newIndex, 0, targetRow)
            for (let index = 0; index < sortList.length; index++) {
              sortList[index].orderNo = index
            }
            this.singleTableLoading = true
            this.formModel.csList = []
            setTimeout(() => {
              this.singleTableLoading = false
              this.formModel.csList = sortList
            }, 500)
          },
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
.form_piece_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  span {
    font-size: 14px;
    font-weight: 700;
  }
}
.file_list {
  ::v-deep .ant-form-item {
    margin-bottom: 0px;
  }
  .delete_color {
    color: #ff4d4f;
  }
  .delete_color[disabled] {
    color: rgba(0, 0, 0, 0.25);
  }
  .download_style {
    padding-left: 5px;
    border-left: 1px solid #ccc;
  }
}
.ant-input[disabled] {
  color: #000;
}
.start_run_time {
  ::v-deep .ant-form-item-control {
    .ant-input {
      width: 346px !important;
    }
  }
}
.number_people {
  margin-top: -10px;
  margin-left: 102px;
}
.implement {
  ::v-deep .ant-form-item-control {
    .ant-select-selection {
      width: 100% !important;
    }
  }
}
</style>