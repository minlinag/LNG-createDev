<template>
  <div
    class="tb-gas-analysis"
    v-if="
      measuresTitle == '受限空间作业' ||
      measuresTitle == '动火作业' ||
      measuresTitle == '盲板抽堵作业' ||
      measuresTitle == '临时用电作业'
    "
  >
    <div>
      <div class="headBtn">
        <span>设备管道分析</span>
        <span class="btn-content"
          ><a-button
            class="buttonType btn_primary"
            type="primary"
            icon="plus"
            @click.stop="libraryDataAdd"
          >
            新增
          </a-button></span
        >
      </div>
      <!--&lt;!&ndash;受限空间作业&ndash;&gt;-->
      <div class="table-content" v-if="measuresTitle == '受限空间作业'">
        <table class="tb-gasAnalysis">
          <thead>
            <tr>
              <th style="width: 150px">分析类型</th>
              <th>气体名称</th>
              <th>合格标准</th>
              <th>分析数据</th>
              <th>分析部位</th>
              <th>分析人</th>
              <th style="width: 100px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>
                <a-select
                  v-model="item.analysisType"
                  show-search
                  placeholder="请选择分析类型"
                  option-filter-prop="children"
                  style="width: 100%"
                >
                  <a-select-option value="有毒有害气体">
                    有毒有害气体
                  </a-select-option>
                  <a-select-option value="可燃气体"> 可燃气体 </a-select-option>
                  <a-select-option value="燃气含量"> 燃气含量 </a-select-option>
                </a-select>
              </td>
              <td>
                <a-input v-model="item.gasName" placeholder="请输入气体名称" />
              </td>
              <td>
                <a-input
                  v-model="item.eligibilityCriteria"
                  placeholder="请输入合格标准"
                />
              </td>
              <td>
                <a-input
                  v-model="item.analyzeData"
                  placeholder="请输入分析数据"
                />
              </td>
              <td>
                <a-input
                  v-model="item.analysisPosition"
                  placeholder="请输入分析部位"
                />
              </td>
              <td>
                <a-input v-model="item.analyst" placeholder="请输入分析人" />
              </td>
              <td>
                <span @click.stop="delectList(index)">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--动火作业-->
      <div class="table-content" v-if="measuresTitle == '动火作业'">
        <table class="tb-gasAnalysis">
          <thead>
            <tr>
              <th style="width: 200px">气体分析时间</th>
              <th>可燃气体</th>
              <th>有毒气体</th>
              <th>O2%(氧气含量)</th>
              <th>分析人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>
                <a-date-picker
                  valueFormat="yyyy-MM-DD"
                  v-model="item.analyzeTime"
                  placeholder="请选中时间"
                />
              </td>
              <td>
                <a-input v-model="item.analysisType" placeholder="请输入数据" />
              </td>
              <td>
                <a-input v-model="item.analyzeData" placeholder="请输入数据" />
              </td>
              <td>
                <a-input
                  v-model="item.eligibilityCriteria"
                  placeholder="请输入数据"
                />
              </td>
              <td>
                <a-input v-model="item.analyst" placeholder="请输入数据" />
              </td>
              <td style="width: 80px">
                <span @click.stop="delectList(index)">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--盲板抽堵作业-->
      <div class="table-content" v-if="measuresTitle == '盲板抽堵作业'">
        <table class="tb-gasAnalysis">
          <thead>
            <tr>
              <th style="width: 200px">设备管道名称</th>
              <th>管道介质</th>
              <th>管道温度</th>
              <th>管道压力</th>
              <th>盲板材质</th>
              <th>盲板规格</th>
              <th>盲板编号</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>
                <a-input
                  v-model="item.pipelineName"
                  placeholder="请输入设备管道名称"
                />
              </td>
              <td>
                <a-input v-model="item.medium" placeholder="请输入管道介质" />
              </td>
              <td>
                <a-input
                  v-model="item.temperature"
                  placeholder="请输入管道温度"
                />
              </td>
              <td>
                <a-input v-model="item.pressure" placeholder="请输入管道压力" />
              </td>
              <td>
                <a-input v-model="item.material" placeholder="请输入盲板材质" />
              </td>
              <td>
                <a-input
                  v-model="item.specification"
                  placeholder="请输入盲板规格"
                />
              </td>
              <td>
                <a-input v-model="item.num" placeholder="请输入盲板编号" />
              </td>
              <td style="width: 80px">
                <span @click.stop="delectList(index)">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--&lt;!&ndash;临时用电作业&ndash;&gt;-->
      <div class="table-content" v-if="measuresTitle == '临时用电作业'">
        <table class="tb-gasAnalysis">
          <thead>
            <tr>
              <th colspan="4">
                可燃气体分析（运行的生产装置、罐区和具有火宅爆炸危险场所）
              </th>
            </tr>
            <tr>
              <th style="width: 200px">分析时间</th>
              <th>可燃气体分析结果</th>
              <th>分析点</th>
              <th>分析人</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>
                <a-date-picker
                  v-model="item.analyzeTime"
                  show-time
                  placeholder="请选中时间"
                />
              </td>
              <td>
                <a-input
                  v-model="item.analyzeData"
                  placeholder="请输入分析结果"
                />
              </td>
              <td>
                <a-input
                  v-model="item.analysisPosition"
                  placeholder="请输入分析点"
                />
              </td>
              <td>
                <a-input v-model="item.analyst" placeholder="请输入分析人" />
              </td>
              <td style="width: 80px">
                <span @click.stop="delectList(index)">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
//import someComponent from './someComponent'
export default {
  name: '',
  data() {
    return {
      // tableData:[],//可燃气体
    }
  },
  component: {
    //someComponent
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [{}]
      },
    },

    measuresTitle: String,
  },
  width: {
    measuresTitle(val) {
      console.log(val)
    },
  },
  methods: {
    libraryDataAdd() {
      console.log(this.tableData)
      this.tableData.push({})
    },
    delectList(index) {
      this.tableData.splice(index, 1)
    },
  },
}
</script>

<style scoped lang="less">
.tb-gas-analysis {
  margin-top: 20px;
  .table-content {
    text-align: right;
    button {
      margin-bottom: 12px !important;
    }
  }
  padding-bottom: 24px;
  .tb-gasAnalysis {
    width: 100%;
    text-align: center;
    td,
    tr {
      border: 1px solid #e8e8e8;
      height: 38px;
      span {
        color: #ff4d4f;
        cursor: pointer;
        display: inline-block;
        padding: 0 12px;
      }
    }
    /deep/ .ant-input {
      border: 0;
    }
    .buttonType {
      margin: 0 12px;
    }
  }
  .headBtn {
    text-align: left;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    margin-bottom: 24px;
    line-height: 43px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    padding: 0 24px;
    span {
      display: inline-block;
    }
    .btn-content {
      float: right;
    }
  }
}
</style>
