<template>
  <div>
    <a-form-model ref="formRef" :model="formModel" :rules="rules">
      <a-row>
        <div class="form_piece_title">
          <span>基础信息</span>
        </div>
        <a-col :span="8">
          <a-form-model-item label="模板名称" prop="templateName">
            <a-input
              v-model.trim="formModel.templateName"
              placeholder="请输入"
              :disabled="checkForm"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="模板类型" prop="templateType">
            <a-select
              v-model="formModel.templateType"
              show-search
              :disabled="checkForm"
              placeholder="请选择"
            >
              <a-select-option value="评分制"> 评分制 </a-select-option>
              <a-select-option value="评价制"> 评价制 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="form_piece_title">
        <span>模板设置</span>
        <a-button type="primary" @click="addTableClick" :disabled="checkForm"
          >新增
        </a-button>
      </div>
      <a-table
        :scroll="{ y: 200, x: 300 }"
        :pagination="false"
        :columns="setColumns"
        :dataSource="formModel.templateSet"
        :openSelector="true"
        class="file_list"
        ref="singleTable"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
      >
        <template slot="columnName" slot-scope="val, obj">
          <a-form-model-item>
            <a-input
              placeholder="请输入"
              v-model="obj.columnName"
              style="width: 100%"
              :disabled="checkForm"
            />
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
            :disabled="checkForm"
            >删除
          </a-button>
        </template>
      </a-table>
      <div class="form_piece_title" style="margin-top: 20px">
        <span>模板内容</span>
        <div>
          <a-button
            type="primary"
            @click="exportClick"
            :disabled="checkForm"
            style="margin-right: 10px"
            >模板导出
          </a-button>
          <a-upload
            name="file"
            :showUploadList="false"
            accept=".xls,.xlsx"
            :multiple="false"
            :action="serverAddress + '/AppraiseTemplate/importExcel'"
            @change="importHandleChange"
          >
            <a-button
              type="primary"
              @click="importClick"
              :disabled="checkForm || formModel.templateContent.length !== 0"
              >导入
            </a-button>
          </a-upload>

          <a-button
            type="primary"
            @click="contentDeleteClick"
            :disabled="checkForm"
            >删除
          </a-button>
        </div>
      </div>
      <a-table
        :scroll="{ y: 200, x: 300 }"
        :pagination="contentPagination"
        :columns="contentColumns"
        :dataSource="formModel.templateContent"
        :openSelector="true"
        class="file_list"
        @change="paginationChange"
      >
      </a-table>
    </a-form-model>
  </div>
</template>

<script>
import { insert } from "@/api/templateManagement/templateManagement.js"
import Sortable from 'sortablejs'
import utils from "@/utils/url";
export default {
  name: "templateManagement",
  props: ['type', 'hiddenVisible', 'checkForm', 'formEditData'],
  data() {
    return {
      serverAddress: utils.baseURL,
      formModel: {
        templateName: "",
        templateType: undefined,
        templateSet: [],
        templateContent: [],
      },
      setColumns: [{
        title: '列名',
        scopedSlots: { customRender: 'columnName' },
      }, {
        title: "排序",
        scopedSlots: { customRender: "sort" },
        width: 80,
      }, {
        title: '操作',
        scopedSlots: { customRender: 'operation' },
        width: 80,
      }],
      contentColumns: [{
        title: '序号',
        customRender: (text, record, index) =>
          `${(this.contentPagination.current - 1) * this.contentPagination.pageSize +
          index +
          1
          }`,
        width: 50,
      }],
      contentPagination: {
        current: 1,
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
        showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
        pageSize: 10, // 每页条数，所有页设置统一的条数
      },
      moveStyle: {
        color: '#1890ff',
      },
      rules: {
        templateName: [
          {
            required: true,
            message: "请输入模板名称",
            trigger: "blur",
          },
        ],
        templateType: [
          {
            required: true,
            message: "请输入模板类型",
            trigger: "change",
          },
        ],
      }
    }
  },
  watch: {
    // 'formModel.fileList': {
    //   handler(val) {
    //     if (val.length === 0) {
    //       return false
    //     }
    //     val.forEach(element => {
    //       if (element.invocation) {
    //         this.formModel.nowVersion = element.version
    //         this.formModel.uploadTime = element.uploadTime
    //       }
    //     });
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    hiddenVisible: {
      handler(val) {
        if (!val) {
          this.$refs.formRef.clearValidate()
        } else {
          let formEditData = {
            templateName: '',
            templateType: undefined,
            templateSet: [],
            templateContent: [],
          }
          this.contentColumns = [{
            title: '序号',
            customRender: (text, record, index) =>
              `${(this.contentPagination.current - 1) * this.contentPagination.pageSize +
              index +
              1
              }`,
            width: 50,
          }]

          if (this.checkForm) {
            formEditData = {
              templateName: this.formEditData[0].templateName,
              templateType: this.formEditData[0].templateType,
              templateSet: this.formEditData[0].templateSet.split(',').map((item) => {
                return {
                  columnName: item,
                }
              }),
              templateContent: this.generateTemplateContent(this.formEditData)
            }
            this.contentColumns = this.contentColumns.concat(this.formEditData[0].templateContent.split(',').map((item) => {
              return {
                title: item,
                dataIndex: item,
                width: 100,
              }
            }))
          }

          this.formModel = this.$lodash.cloneDeep(formEditData);

          this.$nextTick(() => {
            if (this.checkForm) {
              this.moveStyle.color = '#3d3d3d'
              return false
            }
            this.moveStyle.color = '#1890ff'
            this.dragSort()
          })
        }

      },
      immediate: true,

    }
  },
  methods: {
    paginationChange(pagination) {
      this.contentPagination.pageSize = pagination.pageSize
      this.contentPagination.current = pagination.current
    },


    addTableClick() {
      this.formModel.templateSet.push(
        {
          columnName: "",
        }
      )
    },

    deleteClick(text, record, index) {
      this.formModel.templateSet.splice(index, 1);
    },
    exportClick() {
      let list = []
      if (this.formModel.templateSet == null || this.formModel.templateSet.length == 0) {
        this.$message.warning('请先添加列名')
        return false
      }
      // this.formModel.templateSet判断 columnName是否为空
      // 循环this.formModel.templateSet 生成list
      for (let i = 0; i < this.formModel.templateSet.length; i++) {
        if (this.formModel.templateSet[i].columnName == null || this.formModel.templateSet[i].columnName == '') {
          this.$message.warning('列名为必填项')
          return false
        }
        list.push(this.formModel.templateSet[i].columnName)
      }
      window.location.href = utils.baseURL + '/AppraiseTemplate/export' + "?list=" + list;
    },
    importClick() { },
    importHandleChange(info) {
      if (info.file.response) {
        if (info.file.response.code == 200) {
          // 数据 ["wwqwew,sdfsdfsdf,null,null,null,null,null,null,null,null","111.0,222.0,null,null,null,null,null,null,null,null","333.0,444.0,null,null,null,null,null,null,null,null"]转换为[[wwqwew,sdfsdfsdf],[111.0,222.0],[333.0,444.0]]
          let arr = info.file.response.body.map(item => {
            let newItem = item.replace(/,null/g, "")
            return newItem.split(',')
          })

          let newArr = []
          // ['wwqwew','sdfsdfsdf'],['111.0','222.0'],['333.0','444.0']]变为[{wwqwew: "111.0", sdfsdfsdf: "222.0"},{wwqwew: "333.0", sdfsdfsdf: "444.0"}}]
          for (let i = 0; i < arr.length; i++) {
            let obj = {}
            for (let j = 0; j < arr[i].length; j++) {
              if (i == 0) {
                this.contentColumns.push({
                  title: arr[i][j],
                  dataIndex: arr[i][j],
                  width: 200,
                })
              } else {
                obj[arr[0][j]] = arr[i][j]
              }
            }
            if (i != 0) {
              newArr.push(obj)
            }

          }
          this.formModel.templateContent = newArr
          this.$message.success("上传成功");
        } else {
          if (info.file.response.code == "500") {
            this.$message.error(info.file.response.msg);
          } else {
            this.$message.error("上传失败!");
          }
        }
      }
    },
    contentDeleteClick() {
      this.formModel.templateContent = []
      this.contentColumns = [{
        title: '序号',
        customRender: (text, record, index) =>
          `${(this.contentPagination.current - 1) * this.contentPagination.pageSize +
          index +
          1
          }`,
        width: 50,
      }]
    },
    confirm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.formModel.templateSet.length == 0) {
            this.$message.warning('列名不能为空')
            return false
          }
          if (this.contentColumns.length <= 1) {
            this.$message.warning('模板内容表头不能为空')
            return false
          }

          if (this.formModel.templateContent.length == 0) {
            this.$message.warning('模板内容不能为空')
            return false
          }
          let newArr = []
          for (let index = 0; index < this.formModel.templateContent.length; index++) {
            const element = this.formModel.templateContent[index];

            if (index == 0) {
              let arr = []
              for (const key in element) {
                arr.push(key)
              }
              newArr.push(arr)
            }
            let labe1List = []
            for (let index = 0; index < newArr[0].length; index++) {
              const e = newArr[0][index];
              labe1List.push(element[e])
            }
            newArr.push(labe1List)
          }
          let formModel = {
            templateName: this.formModel.templateName,
            templateSet: this.formModel.templateSet.map((item) => {
              return item.columnName
            }).join(','),
            templateType: this.formModel.templateType,
            mbList: newArr.map((item) => {
              return { templateContent: item.join(',') }
            }),
          }
          insert(formModel).then(res => {
            if (res.code == '200') {
              this.$emit('cancel')
            }
          })
        }
      })
    },
    generateTemplateContent(data) {
      let header = data[0].templateContent.split(',')
      let arr = data.slice(1).map((item) => {
        return item.templateContent.split(',')
      })
      // header = ["11": "22", "333.0": "444.0"]
      // arr = [['qq', 'ww', 'eee'],['rrr', 'ttt', 'yyyy']]
      // 生成 [{11: "qq", 22: "ww", 333.0: "eee"},{11: "rrr", 22: "ttt", 333.0: "yyyy"}]
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        let obj = {}
        for (let j = 0; j < arr[i].length; j++) {
          obj[header[j]] = arr[i][j]
        }
        newArr.push(obj)
      }
      return newArr
    },
    dragSort() {
      if (this.$refs.singleTable) {
        const tableSort = this.$refs.singleTable
        // const el = this.$refs.singleTable.$el.querySelectorAll(
        //   '.ant-table-body > table > tbody'
        // )[0]
        var array = tableSort.$el.querySelectorAll('tbody') // 所有tobody

        this.sortable = Sortable.create(array[0], {
          ghostClass: 'ghost',
          handle: '.move',
          onEnd: (e) => {
            let sortList = JSON.parse(JSON.stringify(this.formModel.templateSet))
            const targetRow = sortList.splice(e.oldIndex, 1)[0]
            sortList.splice(e.newIndex, 0, targetRow)
            for (let index = 0; index < sortList.length; index++) {
              sortList[index].orderNo = index
            }
            this.singleTableLoading = true
            this.formModel.templateSet = []
            setTimeout(() => {
              this.singleTableLoading = false
              this.formModel.templateSet = sortList
            }, 500)
          },
        })
      }
    },
  },
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
</style>