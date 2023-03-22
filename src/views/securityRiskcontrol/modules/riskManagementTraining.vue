<template>
  <Breadcrumb>
    <template slot="breadcrumbButton">
      <pe-button
        :include="[
          {
            value: 'Add',
            clickName: 'addNew',
          },
          {
            value: 'Delete',
            clickName: 'mydelete',
          },
        ]"
        @addNew="libraryDataAdd"
        @mydelete="mydelete"
      ></pe-button>
    </template>
    <template slot="appMain">
      <div id="components-layout-demo-basic" style="width: 100%">
        <a-layout>
          <a-layout-content>
            <a-form-model layout="inline" :model="form">
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="培训名称"
                >
                  <a-input
                    v-model="form.trainName"
                    placeholder="请输入"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="培训部门"
                >
                  <a-select
                    :allowClear="true"
                    style="width: 100%"
                    show-search
                    v-model="form.trainUnit"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="(item, index) in unitList"
                      :key="index"
                      :value="item.dictname"
                    >
                      {{ item.dictname }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  label="培训日期:"
                  :labelCol="{ style: 'width: 150px' }"
                >
                  <a-date-picker
                    v-model="form.startDate"
                    valueFormat="YYYY-MM-DD"
                    placeholder="请选择"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="培训地点"
                >
                  <a-input
                    placeholder="请输入"
                    v-model="form.trainPlace"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item
                  :labelCol="{ style: 'width: 150px' }"
                  label="培训人"
                >
                  <a-input
                    placeholder="请输入"
                    v-model="form.trainUser"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
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
              </a-col>
            </a-form-model>
          </a-layout-content>
        </a-layout>
      </div>
      <dc-table
        @change="paginationChange"
        rowKey="id"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :pagination="pagination"
        :scroll="{ x: 100 }"
        :columns="columnsDub"
        :dataSource="dataSource"
        :openSelector="true"
      >
        <template slot="operation" slot-scope="row">
          <a-button
            v-Edit
            type="link"
            class="btn_link"
            style="cursor: pointer"
            @click="editListClick(row)"
          >
            编辑
          </a-button>
          <a-button
            type="link"
            class="btn_link"
            style="cursor: pointer"
            @click="checkListClick(row)"
          >
            查看
          </a-button>
        </template>
      </dc-table>
      <!-- 新增表单 -->
      <a-modal
        class="from-style middleModel"
        v-model="visibleAddNew"
        :title="addNewModelConfig.title"
        :cancelText="false"
        :footer="''"

        :after-close="riskLibraryModelClose"
      >
        <a-form-model
          ref="riskLibraryRef"
          :model="riskLibraryForm"
          :rules="riskLibraryRules"
        >
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="培训名称" prop="trainName">
                <a-input
                  v-model="riskLibraryForm.trainName"
                  placeholder="请输入"
                  :disabled="flag"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="培训部门" prop="trainUnit">
                <a-select
                  v-model="riskLibraryForm.trainUnit"
                  placeholder="请选择"
                  :disabled="flag"
                >
                  <a-select-option
                    v-for="(item, index) in unitList"
                    :key="index"
                    :value="item.dictname"
                  >
                    {{ item.dictname }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="培训地点" prop="trainPlace">
                <a-input
                  placeholder="请输入"
                  v-model="riskLibraryForm.trainPlace"
                  :disabled="flag"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="培训日期" prop="trainTime">
                <a-date-picker
                  v-model="riskLibraryForm.trainTime"
                  valueFormat="YYYY-MM-DD"
                  placeholder="请输入"
                  :disabled="flag"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="培训人">
                <a-input
                  v-model="riskLibraryForm.trainUser"
                  placeholder="请输入"
                  :disabled="flag"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系方式">
                <a-input
                  v-model="riskLibraryForm.tel"
                  placeholder="请输入"
                  :disabled="flag"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="培训人数">
                <a-input
                  v-model="riskLibraryForm.trainNum"
                  placeholder="请输入"
                  :disabled="flag"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="备注">
                <a-input
                  placeholder="请输入"
                  v-model="riskLibraryForm.remark"
                  :disabled="flag"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="培训材料">
                <importConpontsData
                  :Text="'上传文件'"
                  @fileChange="flieChange"
                  @fileListChange="fileListChange"
                  :fileListName="'pxcl'"
                ></importConpontsData>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="培训签到表">
                <importConpontsData
                  :Text="'上传文件'"
                  @fileChange="flieChange"
                  @fileListChange="fileListChange"
                  :fileListName="'pxqd'"
                ></importConpontsData>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="12">
              <a-form-model-item label="影像/照片">
                <importConpontsData
                  :Text="'上传文件'"
                  @fileChange="flieChange"
                  @fileListChange="fileListChange"
                  :fileListName="'yxzp'"
                ></importConpontsData>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="培训记录">
                <importConpontsData
                  :Text="'上传文件'"
                  @fileChange="flieChange"
                  @fileListChange="fileListChange"
                  :fileListName="'pxjl'"
                ></importConpontsData>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="其他">
                <importConpontsData
                  :Text="'上传文件'"
                  @fileChange="flieChange"
                  @fileListChange="fileListChange"
                  :fileListName="'qita'"
                ></importConpontsData>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="footer contneFormBtnStyle ant-modal-footer">
            <a-button
                    type="primary"
                    @click="onRiskLibrarySubmit"
                    :disabled="flag"
            >
              保存
            </a-button>
            <a-button @click="onRiskLibraryBack"> 返回 </a-button>
        </div>
      </a-modal>
    </template>
  </Breadcrumb>
</template>
<script>
import {
  getRiskTrain,
  addRiskTrain,
  updateRiskTrain,
} from '@/api/securityRiskcontrol'
import { encode } from '@/api/dataDictionary'
import importConpontsData from '@/components/importConpontsData'
export default {
  components: {
    importConpontsData: importConpontsData,
  },
  data() {
    return {
      unitList: [],
      fileObj: {},
      flag: false,
      flieNameList: {
        pxcl: [], //培训材料
        pxqd: [], //培训签到
        yxzp: [], //影像照片
        pxjl: [], //培训记录
        qita: [], //其他
      },
      flieChanges: '',
      //表格中的数据
      riskLibraryForm: {
        trainName: '', // 培训名称
        trainUnit: undefined, // 培训部门
        trainPlace: '', // 培训地点
        trainTime: '', // 培训时间
        trainUser: '', // 培训人
        tel: '', // 联系方式
        trainNum: '', // 培训人数
        remark: '', // 备注
      },
      riskLibraryRules: {
        trainName: [
          { required: true, message: '培训名称不能为空', trigger: 'blur' },
        ],
        trainUnit: [
          { required: true, message: '培训部门不能为空', trigger: 'blur' },
        ],
        trainPlace: [
          { required: true, message: '培训地点不能为空', trigger: 'blur' },
        ],
        trainTime: [
          { required: true, message: '培训时间不能为空', trigger: 'blur' },
        ],
      },

      //翻页页面组件
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
      //页面下方表格的列属性11
      columnsDub: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            }`,
          width: 80,
          align: 'center',
        },
        {
          title: '培训名称',
          dataIndex: 'trainName',
          width: 120,
          align: 'center',
        },
        {
          title: '培训部门',
          dataIndex: 'trainUnit',
          width: 120,
          align: 'center',
        },
        {
          title: '培训地点',
          dataIndex: 'trainPlace',
          width: 150,
          align: 'center',
        },
        {
          title: '培训时间',
          dataIndex: 'trainTime',
          width: 150,
          align: 'center',
        },
        {
          title: '培训人',
          dataIndex: 'trainUser',
          width: 120,
          align: 'center',
        },
        {
          title: '联系方式',
          dataIndex: 'tel',
          width: 120,
          align: 'center',
        },
        {
          title: '培训人数',
          dataIndex: 'trainNum',
          width: 120,
          align: 'center',
        },
        // {
        //   title: '状态',
        //   dataIndex: 'num4',
        //   width: 120,
        //   align: 'center',
        // },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 100,
          align: 'center',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          width: 120,
          fixed: 'right',
        },
      ],
      //勾选框/选择框组件
      selectedRowKeys: [],
      //回传组件
      //查看组件中的数值
      LookForm: {},
      //查询所需的数据 外委单位名称｜日期｜状态
      form: {
        pageNum: 1,
        pageSize: 10,
        trainUnit: undefined, //培训部门
        trainName: '', //培训名称
        trainTime: '', //日期
        trainPlace: '', //培训地点
        tel: '', //电话
        // status: undefined,
      },
      //新增是否visible
      visibleAddNew: false,
      //查看是否visible
      visibleLook: false,
      //新增的弹窗的相关设置
      addNewModelConfig: {
        width: '950px',
        title: '安全风险培训-新增',
        cancelText: false,
        footer: '', //是否展示页脚
      },
      //表格中的数据
      dataSource: [],
    }
  },
  created() {
    this.getRiskTrain()
    this.encode()
  },
  mounted() {},
  methods: {
    // 获取培训列表
    async getRiskTrain() {
      const { code, body } = await getRiskTrain(this.form)
      if (code == 200) {
        const { pageIndex, pageSize, total, data } = body
        console.log(data)
        this.pagination.current = pageIndex
        this.pagination.pageSize = pageSize
        this.pagination.total = total
        this.dataSource = data
      }
    },
    flieChange(val) {
      console.log(val)
      this.flieChanges = val
    },
    fileListChange(val, name) {
      for (const key in this.flieNameList) {
        if (Object.hasOwnProperty.call(this.flieNameList, key)) {
          if (val.name === key) {
            this.flieNameList[key] = val.list
          }
        }
      }
      console.log(this.flieNameList, 'this.flieNameList')
    },
    //选择的key，这里为id
    onSelectChange(key) {
      this.selectedRowKeys = key
    },
    //新增弹窗相关按钮
    libraryDataAdd() {
      this.addNewModelConfig.title = '安全风险管控-新增'
      this.visibleAddNew = true
      this.flag = false
    },
    onRiskLibrarySubmit() {
      var formData = new FormData()
      formData.append('strJson', JSON.stringify(this.riskLibraryForm))
      formData.append('trainingMaterials', this.flieNameList.pxcl) //培训材料
      formData.append('trainingAttendanceForm', this.flieNameList.pxqd) //培训签到
      formData.append('videoPhoto', this.flieNameList.yxzp) //影像照片
      formData.append('trainingRecords', this.flieNameList.pxjl) //培训记录
      formData.append('others', this.flieNameList.qita) //其他
      this.$refs.riskLibraryRef.validate((valid) => {
        if (valid) {
          if (!this.riskLibraryForm.hasOwnProperty('id')) {
            addRiskTrain(formData).then((res) => {
              if (res.code == 200) {
                this.visibleAddNew = false
                this.$message.success('添加成功')
                this.getRiskTrain()
              }
            })
          } else {
            updateRiskTrain(formData).then((res) => {
              if (res.code == 200) {
                this.visibleAddNew = false
                this.$message.success('修改成功')
                this.getRiskTrain()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除功能
    mydelete() {},
    // 编辑按钮
    editListClick(row) {
      console.log(row)
      this.addNewModelConfig.title = '安全风险培训-编辑'
      this.riskLibraryForm = row

      //  this.flieNameList={
      //   pxcl: [], //培训材料
      //   pxqd: [], //培训签到
      //   yxzp: [], //影像照片
      //   pxjl: [], //培训记录
      //   qita: [], //其他
      // }
      this.visibleAddNew = true
      this.flag = false
    },
    // 详情按钮
    checkListClick(row) {
      this.addNewModelConfig.title = '安全风险培训-详情'
      this.riskLibraryForm = row
      this.visibleAddNew = true
      this.flag = true
    },
    // 返回关闭弹窗
    onRiskLibraryBack() {
      this.visibleAddNew = false
    },
    // 弹框关闭时清空表单
    riskLibraryModelClose() {
      this.riskLibraryForm = {
        trainName: '', // 培训名称
        trainUnit: undefined, // 培训部门
        trainPlace: '', // 培训地点
        trainTime: '', // 培训时间
        trainUser: '', // 培训人
        tel: '', // 联系方式
        trainNum: '', // 培训人数
        remark: '', // 备注
      }
      this.flieNameList = {
        // pxcl: [], //培训材料
        // pxqd: [], //培训签到
        // yxzp: [], //影像照片
        // pxjl: [], //培训记录
        // qita: [], //其他
      }
    },
    //查询功能
    search() {
      if (this.form) {
        this.form.pageNum = 1
        this.form.pageSize = 10
        this.getRiskTrain()
      } else {
        this.getRiskTrain()
      }
    },
    //页面变更
    paginationChange(pagination) {
      this.form.pageNum = pagination.current
      this.form.pageSize = pagination.pageSize
      this.getRiskTrain()
    },
    //搜索重置输入
    resetForm() {
      this.form = {}
      this.form.pageNum = 1
      this.form.pageSize = 10
      this.getRiskTrain()
    },
    // 数据字典-单位
    async encode() {
      const { code, body } = await encode('LBSQ_SSBM')
      if (code == '200') {
        const { data } = body
        this.unitList = data
      }
    },
  },
}
</script>
<style scoped lang="less">
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  line-height: 50px;
}

// .ant-col {
//   ::v-deep .ant-form-item {
//     margin-bottom: 15px;
//     // line-height: 20px;
//     // height: 36px;
//   }
// }

.ant-calendar-picker-input.ant-input {
  width: 300px;
}

.ant-form-item-control {
  width: 100%;
}

.ant-select-selection--single {
  width: 180px;
}

.aaaa {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit {
  margin-right: 10px;
  color: #1890ff;
  cursor: pointer;
}

.upload-box {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.upload-list {
  width: 30%;
}

.form_but {
  width: 100% !important;
  display: flex;
  ::v-deep .ant-form-item-control {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
    .ant-btn + .ant-btn {
      margin-left: 20px;
    }
  }
}
</style>
