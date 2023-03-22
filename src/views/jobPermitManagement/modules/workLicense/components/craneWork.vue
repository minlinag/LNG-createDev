<!--/***-->
<!--*吊装作业许可证-->
<!--*日期：2022年9月20日 zxt-->
<!--**/-->
<template>
  <div>
    <div
      style="
        text-align: right;
        padding-right: 20px;
        border-bottom: 1px solid #ddd;
        padding: 10px;
      "
    >
      <a-button type="primary" @click="print">打印</a-button>
    </div>
    <a-layout>
      <a-layout-content>
        <div v-if="taskForm" ref="print" class="print-content">
          <h2 style="text-align: center;font-weight: 900">吊装作业许可证</h2>
          <h4 class="bh" style="text-align: right">
            编号：{{ taskForm.baseInfo.id }}
          </h4>
          <a-descriptions align="center" size="small" bordered class="d d-bottom">
            <a-descriptions-item label="作业申请单位">
              {{ taskForm.baseInfo.applicant }}
            </a-descriptions-item>
            <a-descriptions-item label="作业申请时间" :span="2">
              {{ taskForm.baseInfo.createdDateTime }}
            </a-descriptions-item>
            <a-descriptions-item label="作业单位"
              >{{ taskForm.baseInfo.workUnit }}
            </a-descriptions-item>
            <a-descriptions-item label="吊装内容" :span="2">
              {{ taskForm.baseInfo.workContent }}
            </a-descriptions-item>
            <a-descriptions-item label="吊装地点">
              {{ taskForm.baseInfo.workPlace }}
            </a-descriptions-item>
            <a-descriptions-item label="吊具名称" :span="2">
              {{ taskForm.measuresForm ? taskForm.measuresForm.slingName : "" }}
            </a-descriptions-item>
            <a-descriptions-item label="吊装作业人">
              {{ taskForm.baseInfo.operator }}
            </a-descriptions-item>
            <a-descriptions-item label="司索人" :span="2">
              {{ taskForm.measuresForm ? taskForm.measuresForm.rigger : "" }}
            </a-descriptions-item>
            <a-descriptions-item label="监护人"
              >{{ taskForm.baseInfo.guardian }}
            </a-descriptions-item>
            <a-descriptions-item label="指挥人员" :span="2">
              {{ taskForm.measuresForm ? taskForm.measuresForm.commander : "" }}
            </a-descriptions-item>

            <a-descriptions-item label="起吊质量(t)">
              {{
                taskForm.measuresForm
                  ? taskForm.measuresForm.liftingMassAndLevel
                  : ""
              }}
            </a-descriptions-item>
            <a-descriptions-item label="作业级别" :span="2">
              {{ taskForm.measuresForm.hotWorkLevel }}
            </a-descriptions-item>
            <a-descriptions-item label="风险辨识结果" :span="3">
              <!--<a-checkbox-group v-model="checkBoxList">-->
                <!--<a-checkbox-->
                  <!--v-for="(item, index) in checkBoxOptions['风险']"-->
                  <!--:key="index"-->
                  <!--:value="item.value"-->
                <!--&gt;-->
                  <!--{{ item.label }}-->
                <!--</a-checkbox>-->
              <!--</a-checkbox-group>-->
              <checkBox
                      :checkBoxOptions="checkBoxOptions['风险']"
                      :checkBoxList="checkBoxList"></checkBox>
            </a-descriptions-item>
            <a-descriptions-item label="作业实施时间" :span="3">
              <span style="margin-left: 100px">{{ validTime }}</span>
            </a-descriptions-item>
          </a-descriptions>
          <div class="pint-content">
            <a-table
                    class="labelWrap"
                    :scroll="{ x: 50 }"
                    :columns="columns"
                    :dataSource="dataSource"
                    :openSelector="false"
                    :pagination="false"
            >
              <template slot="operation" slot-scope="row, text">
                <span v-if="text.deviceLubricationType==1">是</span>
                <span v-if="text.deviceLubricationType==2">不涉及</span>
              </template>
              <template slot="signImg">
                <img
                        class="appImg"
                        :src="
                  HistoryObj['属地单位_监护人'] != undefined
                    ? HistoryObj['属地单位_监护人'].signImg
                    : ''
                "
                        v-if="HistoryObj['属地单位_监护人']"
                />
              </template>
            </a-table>
          </div>

          <a-descriptions align="center" size="small" bordered class="d d-top">
            <a-descriptions-item label="其他安全措施">
              {{ taskForm.baseInfo.elseMeasures }}
            </a-descriptions-item>
            <a-descriptions-item label="确认人" :span="2">
              <img
                class="appImg"
                :src="
                  HistoryObj['属地单位_监护人'] != undefined
                    ? HistoryObj['属地单位_监护人'].signImg
                    : ''
                "
              />
            </a-descriptions-item>
            <a-descriptions-item label="作业条件初审及实施安全交底人">
              <img
                class="appImg"
                :src="
                  HistoryObj['运行总监'] != undefined
                    ? HistoryObj['运行总监'].signImg
                    : ''
                "
                v-if="HistoryObj['运行总监']"
              />
            </a-descriptions-item>
            <a-descriptions-item label="接受交底人" :span="2">
              <img
                class="appImg"
                :src="
                  HistoryObj['运行总监'] != undefined
                    ? HistoryObj['运行总监'].signImgN
                    : ''
                "
                v-if="HistoryObj['运行总监']"
              />
            </a-descriptions-item>

            <a-descriptions-item
              label="外委单位_负责人"
              :span="3"
              v-if="HistoryObj['外委单位_负责人']"
            >
              <p>{{ HistoryObj["外委单位_负责人"].opinion }}</p>
              <p style="text-align: right">
                负责人：<img
                  class="appImg"
                  :src="HistoryObj['外委单位_负责人'].signImg"
                  alt=""
                />
                {{ HistoryObj["外委单位_负责人"].executeTime }}
              </p>
            </a-descriptions-item>
            <a-descriptions-item
              label="业务主管单位_负责人"
              :span="3"
              v-if="HistoryObj['业务主管单位_负责人']"
            >
              <p>{{ HistoryObj["业务主管单位_负责人"].opinion }}</p>
              <p style="text-align: right">
                负责人：<img
                  class="appImg"
                  :src="HistoryObj['业务主管单位_负责人'].signImg"
                  alt=""
                />
                {{ HistoryObj["业务主管单位_负责人"].executeTime }}
              </p>
            </a-descriptions-item>
            <a-descriptions-item
              label="属地单位_负责人"
              :span="3"
              v-if="HistoryObj['属地单位_负责人']"
            >
              <p>{{ HistoryObj["属地单位_负责人"].opinion }}</p>
              <p style="text-align: right">
                负责人：<img
                  class="appImg"
                  :src="HistoryObj['属地单位_负责人'].signImg"
                  alt=""
                />
                {{ HistoryObj["属地单位_负责人"].executeTime }}
              </p>
            </a-descriptions-item>
            <a-descriptions-item
              label="质量安全环保部_负责人"
              :span="3"
              v-if="HistoryObj['质量安全环保部_负责人']"
            >
              <p>{{ HistoryObj["质量安全环保部_负责人"].opinion }}</p>
              <p style="text-align: right">
                负责人：<img
                  class="appImg"
                  :src="HistoryObj['质量安全环保部_负责人'].signImg"
                  alt=""
                />
                {{ HistoryObj["质量安全环保部_负责人"].executeTime }}
              </p>
            </a-descriptions-item>
            <a-descriptions-item
              label="公司领导_副总经理兼安全总监"
              :span="3"
              v-if="HistoryObj['公司领导_副总经理兼安全总监']"
            >
              <p>{{ HistoryObj["公司领导_副总经理兼安全总监"].opinion }}</p>
              <p style="text-align: right">
                负责人：<img
                  class="appImg"
                  :src="HistoryObj['公司领导_副总经理兼安全总监'].signImg"
                  alt=""
                />
                {{ HistoryObj["公司领导_副总经理兼安全总监"].executeTime }}
              </p>
            </a-descriptions-item>

            <a-descriptions-item
              label="作业票关闭"
              :span="3"
              v-if="HistoryObj['特殊作业许可关闭_运行总监']"
            >
              <p>{{ HistoryObj["特殊作业许可关闭_运行总监"].opinion }}</p>
              <div>
                <p style="text-align: center">
                  {{ taskForm.baseInfo.closeDate }}
                </p>
                <p style="text-align: right">
                  签字(班长)：<img
                    class="appImg"
                    v-if="HistoryObj['特殊作业许可关闭_运行总监']"
                    :src="HistoryObj['特殊作业许可关闭_运行总监'].signImg"
                    alt=""
                  />
                  签字(属地负责人)：<img
                    class="appImg"
                    v-if="HistoryObj['特殊作业许可关闭_属地单位负责人']"
                    :src="HistoryObj['特殊作业许可关闭_属地单位负责人'].signImg"
                    alt=""
                  />
                </p>
                <!-- {{ HistoryObj['特殊作业许可关闭_运行总监'].executeTime }} -->
              </div>
            </a-descriptions-item>
            <!-- <a-descriptions-item
              :label="item.activityName"
              :span="3"
              v-for="(item, index) in HistoryList"
              :key="index"
            >
              <p>
                {{ item.opinion }}
              </p>
              <p style="text-align: right">
                负责人：
                <img :src="item.signImg" alt="" style="width: 40px; height: 20px" />
                {{ item.executeTime }}
              </p>
            </a-descriptions-item> -->
          </a-descriptions>
        </div>
        <div id="printContent" hidden="true">
          <div style="page-break-before:always;"  v-for="(item,index) in listBox" :key="index">
            <div class="header-test" style="display:table-header-group">{{item}}</div>
            <div v-if="taskForm" ref="print" class="print-content">
              <h2 style="text-align: center;font-weight: 900">吊装作业许可证</h2>
              <h4 class="bh" style="text-align: right">
                编号：{{ taskForm.baseInfo.id }}
              </h4>
              <a-descriptions align="center" size="small" bordered class="d d-bottom">
                <a-descriptions-item label="作业申请单位">
                  {{ taskForm.baseInfo.applicant }}
                </a-descriptions-item>
                <a-descriptions-item label="作业申请时间" :span="2">
                  {{ taskForm.baseInfo.createdDateTime }}
                </a-descriptions-item>
                <a-descriptions-item label="作业单位"
                >{{ taskForm.baseInfo.workUnit }}
                </a-descriptions-item>
                <a-descriptions-item label="吊装内容" :span="2">
                  {{ taskForm.baseInfo.workContent }}
                </a-descriptions-item>
                <a-descriptions-item label="吊装地点">
                  {{ taskForm.baseInfo.workPlace }}
                </a-descriptions-item>
                <a-descriptions-item label="吊具名称" :span="2">
                  {{ taskForm.measuresForm ? taskForm.measuresForm.slingName : "" }}
                </a-descriptions-item>
                <a-descriptions-item label="吊装作业人">
                  {{ taskForm.baseInfo.operator }}
                </a-descriptions-item>
                <a-descriptions-item label="司索人" :span="2">
                  {{ taskForm.measuresForm ? taskForm.measuresForm.rigger : "" }}
                </a-descriptions-item>
                <a-descriptions-item label="监护人"
                >{{ taskForm.baseInfo.guardian }}
                </a-descriptions-item>
                <a-descriptions-item label="指挥人员" :span="2">
                  {{ taskForm.measuresForm ? taskForm.measuresForm.commander : "" }}
                </a-descriptions-item>

                <a-descriptions-item label="起吊质量(t)">
                  {{
                  taskForm.measuresForm
                  ? taskForm.measuresForm.liftingMassAndLevel
                  : ""
                  }}
                </a-descriptions-item>
                <a-descriptions-item label="作业级别" :span="2">
                  {{ taskForm.measuresForm.hotWorkLevel }}
                </a-descriptions-item>
                <a-descriptions-item label="风险辨识结果" :span="3">
                  <!--<a-checkbox-group v-model="checkBoxList">-->
                  <!--<a-checkbox-->
                  <!--v-for="(item, index) in checkBoxOptions['风险']"-->
                  <!--:key="index"-->
                  <!--:value="item.value"-->
                  <!--&gt;-->
                  <!--{{ item.label }}-->
                  <!--</a-checkbox>-->
                  <!--</a-checkbox-group>-->
                  <checkBox
                          :checkBoxOptions="checkBoxOptions['风险']"
                          :checkBoxList="checkBoxList"></checkBox>
                </a-descriptions-item>
                <a-descriptions-item label="作业实施时间" :span="3">
                  <span style="margin-left: 100px">{{ validTime }}</span>
                </a-descriptions-item>
              </a-descriptions>
              <div class="pint-content">
                <a-table
                        class="labelWrap"
                        :scroll="{ x: 50 }"
                        :columns="columns"
                        :dataSource="dataSource"
                        :openSelector="false"
                        :pagination="false"
                >
                  <template slot="operation" slot-scope="row, text">
                    <span v-if="text.deviceLubricationType==1">是</span>
                    <span v-if="text.deviceLubricationType==2">不涉及</span>
                  </template>
                  <template slot="signImg">
                    <img
                            class="appImg"
                            :src="
                  HistoryObj['属地单位_监护人'] != undefined
                    ? HistoryObj['属地单位_监护人'].signImg
                    : ''
                "
                            v-if="HistoryObj['属地单位_监护人']"
                    />
                  </template>
                </a-table>
              </div>

              <a-descriptions align="center" size="small" bordered class="d">
                <a-descriptions-item label="其他安全措施">
                  {{ taskForm.baseInfo.elseMeasures }}
                </a-descriptions-item>
                <a-descriptions-item label="确认人" :span="2">
                  <img
                          class="appImg"
                          :src="
                  HistoryObj['属地单位_监护人'] != undefined
                    ? HistoryObj['属地单位_监护人'].signImg
                    : ''
                "
                  />
                </a-descriptions-item>
                <a-descriptions-item label="作业条件初审及实施安全交底人">
                  <img
                          class="appImg"
                          :src="
                  HistoryObj['运行总监'] != undefined
                    ? HistoryObj['运行总监'].signImg
                    : ''
                "
                          v-if="HistoryObj['运行总监']"
                  />
                </a-descriptions-item>
                <a-descriptions-item label="接受交底人" :span="2">
                  <img
                          class="appImg"
                          :src="
                  HistoryObj['运行总监'] != undefined
                    ? HistoryObj['运行总监'].signImgN
                    : ''
                "
                          v-if="HistoryObj['运行总监']"
                  />
                </a-descriptions-item>

                <a-descriptions-item
                        label="外委单位_负责人"
                        :span="3"
                        v-if="HistoryObj['外委单位_负责人']"
                >
                  <p>{{ HistoryObj["外委单位_负责人"].opinion }}</p>
                  <p style="text-align: right">
                    负责人：<img
                          class="appImg"
                          :src="HistoryObj['外委单位_负责人'].signImg"
                          alt=""
                  />
                    {{ HistoryObj["外委单位_负责人"].executeTime }}
                  </p>
                </a-descriptions-item>
                <a-descriptions-item
                        label="业务主管单位_负责人"
                        :span="3"
                        v-if="HistoryObj['业务主管单位_负责人']"
                >
                  <p>{{ HistoryObj["业务主管单位_负责人"].opinion }}</p>
                  <p style="text-align: right">
                    负责人：<img
                          class="appImg"
                          :src="HistoryObj['业务主管单位_负责人'].signImg"
                          alt=""
                  />
                    {{ HistoryObj["业务主管单位_负责人"].executeTime }}
                  </p>
                </a-descriptions-item>
                <a-descriptions-item
                        label="属地单位_负责人"
                        :span="3"
                        v-if="HistoryObj['属地单位_负责人']"
                >
                  <p>{{ HistoryObj["属地单位_负责人"].opinion }}</p>
                  <p style="text-align: right">
                    负责人：<img
                          class="appImg"
                          :src="HistoryObj['属地单位_负责人'].signImg"
                          alt=""
                  />
                    {{ HistoryObj["属地单位_负责人"].executeTime }}
                  </p>
                </a-descriptions-item>
                <a-descriptions-item
                        label="质量安全环保部_负责人"
                        :span="3"
                        v-if="HistoryObj['质量安全环保部_负责人']"
                >
                  <p>{{ HistoryObj["质量安全环保部_负责人"].opinion }}</p>
                  <p style="text-align: right">
                    负责人：<img
                          class="appImg"
                          :src="HistoryObj['质量安全环保部_负责人'].signImg"
                          alt=""
                  />
                    {{ HistoryObj["质量安全环保部_负责人"].executeTime }}
                  </p>
                </a-descriptions-item>
                <a-descriptions-item
                        label="公司领导_副总经理兼安全总监"
                        :span="3"
                        v-if="HistoryObj['公司领导_副总经理兼安全总监']"
                >
                  <p>{{ HistoryObj["公司领导_副总经理兼安全总监"].opinion }}</p>
                  <p style="text-align: right">
                    负责人：<img
                          class="appImg"
                          :src="HistoryObj['公司领导_副总经理兼安全总监'].signImg"
                          alt=""
                  />
                    {{ HistoryObj["公司领导_副总经理兼安全总监"].executeTime }}
                  </p>
                </a-descriptions-item>

                <a-descriptions-item
                        label="作业票关闭"
                        :span="3"
                        v-if="HistoryObj['特殊作业许可关闭_运行总监']"
                >
                  <p>{{ HistoryObj["特殊作业许可关闭_运行总监"].opinion }}</p>
                  <div>
                    <p style="text-align: center">
                      {{ taskForm.baseInfo.closeDate }}
                    </p>
                    <p style="text-align: right">
                      签字(班长)：<img
                            class="appImg"
                            v-if="HistoryObj['特殊作业许可关闭_运行总监']"
                            :src="HistoryObj['特殊作业许可关闭_运行总监'].signImg"
                            alt=""
                    />
                      签字(属地负责人)：<img
                            class="appImg"
                            v-if="HistoryObj['特殊作业许可关闭_属地单位负责人']"
                            :src="HistoryObj['特殊作业许可关闭_属地单位负责人'].signImg"
                            alt=""
                    />
                    </p>
                    <!-- {{ HistoryObj['特殊作业许可关闭_运行总监'].executeTime }} -->
                  </div>
                </a-descriptions-item>
                <!-- <a-descriptions-item
                  :label="item.activityName"
                  :span="3"
                  v-for="(item, index) in HistoryList"
                  :key="index"
                >
                  <p>
                    {{ item.opinion }}
                  </p>
                  <p style="text-align: right">
                    负责人：
                    <img :src="item.signImg" alt="" style="width: 40px; height: 20px" />
                    {{ item.executeTime }}
                  </p>
                </a-descriptions-item> -->
              </a-descriptions>
            </div>
          </div>
        </div>
        <stepsModel
          ref="stepsModel"
          :isShow="false"
          :id="taskForm.baseInfo.id"
        />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import stepsModel from '@/views/dispatching/components/stepsModel.vue'

import { infoUpdata, dataUpdata, getvalidTime } from '@/utils/tableFun'
import {
  getCheckBox,
  getMeasures,
  getHistoryListWithSignImg,
} from '@/api/workLicense'
import checkBox from './checkBox.vue'
export default {
  components: { stepsModel,checkBox },
  props: {
    taskForm: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      listBox:['监护人联','作业单位联','属地单位联'],
      HistoryObj: {},
      HistoryList: [],
      row: '',
      validTime: '',
      checkBoxOptions: [],
      dataSourceApproval: [],
      dataSource: [],
      columns: [
          {
              title: '序号',
              customRender: (text, record, index) => `${index + 1}`,
              width: 60,
              align: 'center',
          },
          {
              title: '安全措施（监护人应对以下方面进行确认）',
              dataIndex: 'equipmentCode',
              align: 'center',
          },
          {
              title: '是否涉及',
              dataIndex: 'deviceLubricationType',
              width: 110,
              align: 'center',
              scopedSlots: {customRender: 'operation'},
          },
        {
          title: '确认人',
          dataIndex: 'deviceName',
          ellipsis: true,
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'signImg' },
        },
      ],
      stepConfiguration: {
        stepProgress: 2,
        stepList: [
          {
            title: '提出作业申请',
            name: '作业单位',
            dataTime: '2022/08/08',
          },
          {
            title: '分级审批、批准',
            name: '属地管理单位、相关部室及中心、决策机构',
            dataTime: '2022/08/10',
          },
          {
            title: '审批完成',
          },
        ],
      },
      columnsApproval: [
        {
          title: '序号',
          customRender: (text, record, index) =>
            `${(this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1
            }`,
          width: 80,
        },
        {
          title: '审批人',
          dataIndex: 'person',
          width: 120,
        },
        {
          title: '单位名称',
          dataIndex: 'institution',
          width: 140,
        },
        {
          title: '审批日期',
          dataIndex: 'advice',
          width: 140,
        },
        {
          title: '审批意见',
          dataIndex: 'status',
          width: 140,
        },
        {
          title: '审批状态',
          dataIndex: 'time',
          width: 140,
        },
      ],
    }
  },
  created() {
    if (this.taskForm.baseInfo.id) {
      this.getHistoryListWithSignImg()
    }
    console.log(this.taskForm)
    this.checkBoxOptions = getCheckBox(1)
    this.validTime = getvalidTime(this.taskForm.baseInfo.approvalCompleteTime, this.taskForm.baseInfo.operationDuration)
  },
  computed: {
    // 风险
    checkBoxList: {
      get() {
        if (this.taskForm.baseInfo.riskIdentificationResultsRisk) {
          var dataList = dataUpdata(
            this.taskForm.baseInfo.riskIdentificationResultsRisk
          )
        }

        if (this.taskForm.baseInfo.riskIdentificationResultsOthers) {
          infoUpdata(
            this.checkBoxOptions,
            '风险',
            '其他',
            ':' + this.taskForm.baseInfo.riskIdentificationResultsOthers
          )
          dataList.push('其他')
        }
        return dataList
      },
      set() {
        return false
      },
    },
  },
  methods: {
    print() {
        document.getElementById("printContent").hidden = false;
        // this.$printPage(this.$refs.print)
        this.$printPage("#printContent")
        document.getElementById("printContent").hidden = true;
    },
    getHistoryListWithSignImg() {
      getHistoryListWithSignImg({ businessId: this.taskForm.baseInfo.id }).then(
        (res) => {
          if (res.code == '200') {
            this.HistoryList = res.body.data
            for (var i = res.body.data.length - 1; i >= 0; i--) {
              if (res.body.data[i].activityName == '运行总监') {
                this.HistoryObj[res.body.data[i].activityName] = {
                  signImg: res.body.data[i].signImg,
                  signImgN: res.body.data[i].signImgN,
                  executeTime: res.body.data[i].executeTime,
                  opinion: res.body.data[i].opinion,
                }
              } else {
                this.HistoryObj[res.body.data[i].activityName] = {
                  signImg: res.body.data[i].signImg,
                  signImgN: res.body.data[i].signImgN,
                  executeTime: res.body.data[i].executeTime,
                  opinion: res.body.data[i].opinion,
                }
              }
            }
            this.getdataSource('吊装作业')
            console.log(this.HistoryObj)
          }
        }
      )
    },
    callback(key) {
      console.log(key)
    },
    onChange() { },
    getdataSource(value) {
      let data = []
      if (this.taskForm.param) {
        getMeasures(value).forEach((item, index) => {
          var param = this.taskForm.param.split(',')
          data.push({
            equipmentCode: item,
            deviceLubricationType: Number(param[index]),
            deviceName: '',
          })
        })
        this.dataSource = data
      }
    },
  },
}
</script>

<style scoped lang="less">
.bh {
  width: 100%;
  text-align: right;
}
.d {
  ::v-deep .ant-descriptions-item-label {
    width: 150px !important;
    background-color: #fff !important;
    text-align: center;
    font-weight: 900;
    padding: 3px 0 !important;
  }
  ::v-deep .ant-descriptions-item-content {
    color: #000 !important;
    padding: 3px !important;
    max-width: 300px !important;
  }
}
.descItem {
  width: 100%;
  display: flex !important;
  justify-content: space-around !important;
}

.tb-gasAnalysis {
  width: 100%;
  text-align: center;
  td,
  tr {
    border: 1px solid #e8e8e8;
    height: 38px;
  }
}
.ant-radio-wrapper-disabled {
  ::v-deep span {
    color: rgba(0, 0, 0, 0.65) !important;
    cursor: not-allowed;
    ::v-deep .ant-radio-input {
      opacity: 0 !important;
    }
    .ant-radio-inner::after {
      background-color: #1890ff !important;
    }
  }
}

::v-deep .ant-radio-disabled {
  .ant-radio-inner {
    border-color: #1890ff !important;
  }
}
.appImg {
  width: 120px;
  height: 40px;
}
.print-content {
  ::v-deep .ant-table-fixed {
    border-radius: 0 !important;
    p {
      margin-bottom: 0 !important;
    }
  }
  ::v-deep .ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label, ::v-deep .ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-content {
    padding: 3px 16px;
  }
  ::v-deep .ant-table-tbody > tr {
    background-color: #fff;
  }
  ::v-deep .ant-table-thead > tr > th, ::v-deep .ant-table-tbody > tr > td {
    background-color: #fff !important;
    border: 1px solid #000 !important;
    border-right: 0 !important;
    padding: 3px;

  }

  ::v-deep .ant-table-thead > tr > th:last-child, ::v-deep .ant-table-tbody > tr > td:last-child {
    border-right: 1px solid #000 !important;
  }
  ::v-deep .ant-descriptions-bordered .ant-descriptions-item-label, ::v-deep .ant-descriptions-bordered .ant-descriptions-item-content {
    border: 1px solid #000 !important;
  }
  ::v-deep .ant-table-tbody > tr:last-child > td {
    border-bottom: 1px solid #000 !important;
  }
  ::v-deep .ant-table-thead > tr:first-child > th:first-child, ::v-deep .ant-table-thead > tr:first-child > th:last-child {
    border-radius: 0 !important;
  }
  ::v-deep .ant-descriptions-view {
    border: 0 !important;
    border-radius: 0 !important;
  }
  ::v-deep .ant-table-body {
    overflow: auto !important;
  }
  ::v-deep .ant-table-tbody tr td:nth-child(2) {
    text-align: left !important;
  }
  .ant-checkbox-wrapper {
    ::v-deep span {
      color: #000 !important;
      font-size: 12px !important;
    }
  }
  .d {
    ::v-deep .ant-table-thead > tr > th, ::v-deep .ant-table-tbody > tr > td {
      border-bottom: 0 !important;
      color: #000 !important;
      padding: 0 !important;

    }
    ::v-deep .ant-descriptions-item-label {
      width: 120px !important;
      background-color: #fff !important;
      text-align: center;
      font-weight: 900;
    }
    ::v-deep .ant-descriptions-item-content {
      color: #000 !important;
    }

  }
  .d-bottom {
    ::v-deep tbody > tr:last-child > td, ::v-deep tbody > tr:last-child > th {
      border-bottom: 0 !important;
    }
  }
  .d-top {
    margin: 0 !important;
    padding: 0 !important;
    ::v-deep tbody > tr:first-child > td, ::v-deep tbody > tr:first-child > th {
      border-top: 0 !important;
    }
    ::v-deep tbody > tr:last-child > td, ::v-deep tbody > tr:last-child > th {
      border-bottom: 1px solid #000 !important;
    }
  }
  .pint-content {
    ::v-deep .ant-table-tbody > tr > td {
      border-top: 0 !important;
      color: #000 !important;

    }
    :v-deep .ant-table-thead > tr > th, ::v-deep .ant-table-tbody > tr > td {
      padding: 0 !important;
    }
    table {
      margin: 0 !important;
      padding: 0 !important;
    }
  }
  #printContent {
     .d-top {
       border-top: 1px solid #000 !important;
       ::v-deep tbody > tr:first-child > td, ::v-deep tbody > tr:first-child > th {
         border-top: 1px solid #000 !important;
       }

     }
   }
}
.header-test{
  color: #000;
}
</style>
