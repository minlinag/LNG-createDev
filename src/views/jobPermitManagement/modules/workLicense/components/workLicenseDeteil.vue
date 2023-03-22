<!--/***-->
<!--*一般作业许可证 -->
<!--*日期：2022年9月16日 zxt-->
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
        <div class="workLicenseDeteil" ref="print">
          <div class="title">一般作业许可证</div>
          <div>
            <h3>编号：{{ taskForm.baseInfo.id }}</h3>
          </div>
          <div class="content-detail">
            <ol>
              <li>
                <span class="li-label">工作区域:</span>
                <span class="li-text">{{ taskForm.baseInfo.workPlace }} </span>
              </li>
              <li>
                <span class="li-label">工作内容描述:</span>
                <span class="li-text">
                  {{ taskForm.baseInfo.workContent }}</span
                >
              </li>
              <li>
                <span class="li-label"
                  >受影响设备（名称在系统中的位置、编号）:</span
                >
                <span class="li-text">
                  {{ taskForm.baseInfo.affectedEquipment }}
                </span>
              </li>
              <li>
                <span class="li-label">有效期：</span>
                <span class="li-text">{{ validTime }} </span>
                <!-- <span>年</span>
                <span class="li-text"> </span>
                月 <span class="li-text"> </span>日 时间：
                <span class="li-text"> </span>至
                <span class="li-text"> </span> -->
                (1班/天内,延期请填写第11项)
              </li>
              <li>
                <span class="li-label">工作承担单位：</span>
                <span class="li-text"> {{ taskForm.baseInfo.workUnit }} </span>
                <span style="margin-left: 200px"></span>
                <span class="li-label">工作人数： </span>
                <span class="li-text">
                  {{ taskForm.baseInfo.affectedEquipment }}</span
                >
                <br />
                <div class="check-content">
                  <span class="li-label"
                  >(如是承包商,必须已完成安全培训记录
                    <!--<a-radio default-checked>是</a-radio>-->
                  <label><input type="radio" checked="true"><span>是</span></label>
                  ;确认工具设备完成检查并贴标签
                     <label><input type="radio" checked="true"><span>是</span></label>)</span
                  >
                </div>

              </li>
              <li>
                <span class="li-label">工作类型: </span>
                <span>
                  <checkBox
                    :checkBoxOptions="checkBoxOptions['关联类型']"
                    :checkBoxList="workType"></checkBox>
                </span>
                <span class="li-label"
                  >注:带*号工种应根据相关特殊作业管理制度要求严格执行</span
                >
              </li>
              <li>
                <span class="li-label"
                  >机器、运输工具、设备、地点是否有下列危(打√注明“有”):
                </span>
                <span>
                  <checkBox
                          :checkBoxOptions="checkBoxOptions['风险']"
                          :checkBoxList="checkBoxList"></checkBox>
                </span>
                <span class="li-label">安全注意事项：</span>
                <span class="li-text"> </span>
              </li>
              <li>
                <div class="drawupList">
                  <div class="drawupList-box">
                    <span class="li-label">A、工作区域的准备:</span>
                    <checkBox
                            :checkBoxOptions="checkBoxOptions['工作区域']"
                            :checkBoxList="workAreaPreparation"></checkBox>
                  </div>
                  <div class="drawupList-box">
                    <span class="li-label">B、个人安全装备:</span>
                    <checkBox
                            :checkBoxOptions="checkBoxOptions['个人安全']"
                            :checkBoxList="safetyPreparationProtectiveEqm"></checkBox>
                  </div>
                  <div class="drawupList-box">
                    <span class="li-label">A、隔离设备:</span>

                    <checkBox
                            :checkBoxOptions="checkBoxOptions['隔离设备']"
                            :checkBoxList="lsolationEquipment"></checkBox>
                  </div>
                </div>
              </li>
              <li>
                <span class="li-label">LTCT上锁点:</span>
                <span class="li-label">1) {{ taskForm.baseInfo.lctc1 }}</span>
                <span class="li-text"> </span>
                <span class="li-label">2) {{ taskForm.baseInfo.lctc2 }}</span>
                <span class="li-text"> </span>
                <span class="li-label">3) {{ taskForm.baseInfo.lctc3 }}</span>
                <span class="li-text"> </span>
                <span class="li-label">4) {{ taskForm.baseInfo.lctc4 }}</span>
                <span class="li-text"> </span>
              </li>
              <li>
                <p class="li-label">声明</p>
                <div class="drawupList-sq">
                  <div class="drawupList-box2">
                    <span
                      >本人<img
                        class="appImg"
                        :src="HistoryObj['外委单位_班组组长'].signImg"
                        alt=""
                        v-if="HistoryObj['外委单位_班组组长']"
                      />在工作开始前,已同属地单位及该工作执行人员讨论了该工作及相关的安全计划,并对工作地点进行了检查,我对本工作的安全及工作人员的安全负责。</span
                    >
                    <div class="sign">
                      <p class="li-label">
                        申请人:<img
                          class="appImg"
                          :src="HistoryObj['外委单位_班组组长'].signImg"
                          alt=""
                          v-if="HistoryObj['外委单位_班组组长']"
                        />(项目负责人)
                      </p>
                      <p class="li-label">
                        工作执行人:<img
                          class="appImg"
                          :src="HistoryObj['外委单位_负责人'].signImg"
                          alt=""
                          v-if="HistoryObj['外委单位_负责人']"
                        />(公司员工或承包商负责人)
                      </p>
                    </div>
                  </div>
                  <div class="drawupList-box2">
                    <span
                      >本人<img
                        class="appImg"
                        :src="HistoryObj['属地单位_负责人'].signImg"
                        alt=""
                        v-if="HistoryObj['属地单位_负责人']"
                      />已同工作执行单位(人员)讨论了该工作及相关的安全计划,并对工作地点进行了检查,该工作许可证之安全措施已落实。</span
                    >
                    <div class="sign">
                      <p class="li-label">
                        主管部门审核:<img
                          class="appImg"
                          :src="HistoryObj['属地单位_负责人'].signImg"
                          alt=""
                          v-if="HistoryObj['属地单位_负责人']"
                        />
                      </p>
                      <p class="li-label">
                        批准人:<span
                          ><img
                            class="appImg"
                            :src="HistoryObj['属地单位_负责人'].signImg"
                            alt=""
                            v-if="HistoryObj['属地单位_负责人']"
                          />(属地单位负责人或其他指定人)</span
                        >
                      </p>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span class="li-label"
                  >关闭许可证:1)本项工作完毕设备备用。
                  <span style="margin-left: 250px"></span>项目负责人签字：
                  <img
                    class="appImg"
                    :src="HistoryObj['外委单位_班组组长'].signImg"
                    alt=""
                    v-if="HistoryObj['外委单位_班组组长']"
                  />
                  时间：<span
                    class="li-text"
                    v-if="HistoryObj['外委单位_班组组长']"
                  >
                    {{ HistoryObj["外委单位_班组组长"].executeTime }}</span
                  >
                </span>
                <span class="li-label"
                  ><span style="margin-left: 75px"></span
                  >2)项目负责人或部门确认签收(受)<span
                    style="margin-left: 200px"
                  ></span
                  >属地签字(存档):
                  <img
                    class="appImg"
                    :src="HistoryObj['属地单位_负责人'].signImg"
                    alt=""
                    v-if="HistoryObj['属地单位_负责人']"
                  />
                  时间：<span
                    class="li-text"
                    v-if="HistoryObj['属地单位_负责人']"
                  >
                    {{ HistoryObj["属地单位_负责人"].executeTime }}</span
                  >
                </span>
              </li>
            </ol>
          </div>
        </div>
        <div id="printContent" hidden="true">
          <div style="page-break-before:always;"  v-for="(item,index) in listBox" :key="index">
            <div class="header-test" style="display:table-header-group">{{item}}</div>
            <div class="workLicenseDeteil" ref="print">
              <div class="title">一般作业许可证</div>
              <div>
                <h3>编号：{{ taskForm.baseInfo.id }}</h3>
              </div>
              <div class="content-detail">
                <ol>
                  <li>
                    <span class="li-label">工作区域:</span>
                    <span class="li-text">{{ taskForm.baseInfo.workPlace }} </span>
                  </li>
                  <li>
                    <span class="li-label">工作内容描述:</span>
                    <span class="li-text">
                  {{ taskForm.baseInfo.workContent }}</span
                    >
                  </li>
                  <li>
                <span class="li-label"
                >受影响设备（名称在系统中的位置、编号）:</span
                >
                    <span class="li-text">
                  {{ taskForm.baseInfo.affectedEquipment }}
                </span>
                  </li>
                  <li>
                    <span class="li-label">有效期：</span>
                    <span class="li-text">{{ validTime }} </span>
                    <!-- <span>年</span>
                    <span class="li-text"> </span>
                    月 <span class="li-text"> </span>日 时间：
                    <span class="li-text"> </span>至
                    <span class="li-text"> </span> -->
                    (1班/天内,延期请填写第11项)
                  </li>
                  <li>
                    <span class="li-label">工作承担单位：</span>
                    <span class="li-text"> {{ taskForm.baseInfo.workUnit }} </span>
                    <span style="margin-left: 200px"></span>
                    <span class="li-label">工作人数： </span>
                    <span class="li-text">
                  {{ taskForm.baseInfo.affectedEquipment }}</span
                    >
                    <br />
                    <div class="check-content">
                  <span class="li-label"
                  >(如是承包商,必须已完成安全培训记录
                    <!--<a-radio default-checked>是</a-radio>-->
                  <label><input type="radio" checked="true"><span>是</span></label>
                  ;确认工具设备完成检查并贴标签
                     <label><input type="radio" checked="true"><span>是</span></label>)</span
                  >
                    </div>

                  </li>
                  <li>
                    <span class="li-label">工作类型: </span>
                    <span>
                  <checkBox
                          :checkBoxOptions="checkBoxOptions['关联类型']"
                          :checkBoxList="workType"></checkBox>
                </span>
                    <span class="li-label"
                    >注:带*号工种应根据相关特殊作业管理制度要求严格执行</span
                    >
                  </li>
                  <li>
                <span class="li-label"
                >机器、运输工具、设备、地点是否有下列危(打√注明“有”):
                </span>
                    <span>
                  <checkBox
                          :checkBoxOptions="checkBoxOptions['风险']"
                          :checkBoxList="checkBoxList"></checkBox>
                </span>
                    <span class="li-label">安全注意事项：</span>
                    <span class="li-text"> </span>
                  </li>
                  <li>
                    <div class="drawupList">
                      <div class="drawupList-box">
                        <span class="li-label">A、工作区域的准备:</span>
                        <checkBox
                                :checkBoxOptions="checkBoxOptions['工作区域']"
                                :checkBoxList="workAreaPreparation"></checkBox>
                      </div>
                      <div class="drawupList-box">
                        <span class="li-label">B、个人安全装备:</span>
                        <checkBox
                                :checkBoxOptions="checkBoxOptions['个人安全']"
                                :checkBoxList="safetyPreparationProtectiveEqm"></checkBox>
                      </div>
                      <div class="drawupList-box">
                        <span class="li-label">A、隔离设备:</span>

                        <checkBox
                                :checkBoxOptions="checkBoxOptions['隔离设备']"
                                :checkBoxList="lsolationEquipment"></checkBox>
                      </div>
                    </div>
                  </li>
                  <li>
                    <span class="li-label">LTCT上锁点:</span>
                    <span class="li-label">1) {{ taskForm.baseInfo.lctc1 }}</span>
                    <span class="li-text"> </span>
                    <span class="li-label">2) {{ taskForm.baseInfo.lctc2 }}</span>
                    <span class="li-text"> </span>
                    <span class="li-label">3) {{ taskForm.baseInfo.lctc3 }}</span>
                    <span class="li-text"> </span>
                    <span class="li-label">4) {{ taskForm.baseInfo.lctc4 }}</span>
                    <span class="li-text"> </span>
                  </li>
                  <li>
                    <p class="li-label">声明</p>
                    <div class="drawupList-sq">
                      <div class="drawupList-box2">
                    <span
                    >本人<img
                            class="appImg"
                            :src="HistoryObj['外委单位_班组组长'].signImg"
                            alt=""
                            v-if="HistoryObj['外委单位_班组组长']"
                    />在工作开始前,已同属地单位及该工作执行人员讨论了该工作及相关的安全计划,并对工作地点进行了检查,我对本工作的安全及工作人员的安全负责。</span
                    >
                        <div class="sign">
                          <p class="li-label">
                            申请人:<img
                                  class="appImg"
                                  :src="HistoryObj['外委单位_班组组长'].signImg"
                                  alt=""
                                  v-if="HistoryObj['外委单位_班组组长']"
                          />(项目负责人)
                          </p>
                          <p class="li-label">
                            工作执行人:<img
                                  class="appImg"
                                  :src="HistoryObj['外委单位_负责人'].signImg"
                                  alt=""
                                  v-if="HistoryObj['外委单位_负责人']"
                          />(公司员工或承包商负责人)
                          </p>
                        </div>
                      </div>
                      <div class="drawupList-box2">
                    <span
                    >本人<img
                            class="appImg"
                            :src="HistoryObj['属地单位_负责人'].signImg"
                            alt=""
                            v-if="HistoryObj['属地单位_负责人']"
                    />已同工作执行单位(人员)讨论了该工作及相关的安全计划,并对工作地点进行了检查,该工作许可证之安全措施已落实。</span
                    >
                        <div class="sign">
                          <p class="li-label">
                            主管部门审核:<img
                                  class="appImg"
                                  :src="HistoryObj['属地单位_负责人'].signImg"
                                  alt=""
                                  v-if="HistoryObj['属地单位_负责人']"
                          />
                          </p>
                          <p class="li-label">
                            批准人:<span
                          ><img
                                  class="appImg"
                                  :src="HistoryObj['属地单位_负责人'].signImg"
                                  alt=""
                                  v-if="HistoryObj['属地单位_负责人']"
                          />(属地单位负责人或其他指定人)</span
                          >
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                <span class="li-label"
                >关闭许可证:1)本项工作完毕设备备用。
                  <span style="margin-left: 250px"></span>项目负责人签字：
                  <img
                          class="appImg"
                          :src="HistoryObj['外委单位_班组组长'].signImg"
                          alt=""
                          v-if="HistoryObj['外委单位_班组组长']"
                  />
                  时间：<span
                          class="li-text"
                          v-if="HistoryObj['外委单位_班组组长']"
                  >
                    {{ HistoryObj["外委单位_班组组长"].executeTime }}</span
                  >
                </span>
                    <span class="li-label"
                    ><span style="margin-left: 75px"></span
                    >2)项目负责人或部门确认签收(受)<span
                            style="margin-left: 200px"
                    ></span
                    >属地签字(存档):
                  <img
                          class="appImg"
                          :src="HistoryObj['属地单位_负责人'].signImg"
                          alt=""
                          v-if="HistoryObj['属地单位_负责人']"
                  />
                  时间：<span
                              class="li-text"
                              v-if="HistoryObj['属地单位_负责人']"
                      >
                    {{ HistoryObj["属地单位_负责人"].executeTime }}</span
                      >
                </span>
                  </li>
                </ol>
              </div>
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
import { getvalidTime } from '@/utils/tableFun'
import { getCheckBox, getHistoryListWithSignImg } from '@/api/workLicense'
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
  name: '',
  data() {
    return {
      listBox:['监护人联','作业单位联','属地单位联'],
      HistoryObj: {},
      validTime: '', //作业票时间
      checkBoxOptions: {},
      msg: 'Hello Vue.js',
      px: true,
      jc: true,
      dataSourceApproval: [],
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
  component: {
    //someComponent
  },
  created() {
    if (this.taskForm.baseInfo.id) {
      this.getHistoryListWithSignImg()
    }
    // console.log(getCheckBox())
    this.checkBoxOptions = getCheckBox(1)
    console.log(this.taskForm)
    this.taskSource = this.taskForm.measuresTable
    // this.validTime = `${this.taskForm.baseInfo.createdDateTime}`+`${this.taskForm.baseInfo.createdDateTime}`
    this.validTime = getvalidTime(this.taskForm.baseInfo.approvalCompleteTime, this.taskForm.baseInfo.operationDuration)
    // console.log(this.validTime);
  },
  computed: {
    // 风险
    checkBoxList: {
      get() {
        let data = this.taskForm.baseInfo.riskIdentificationResultsRisk
          ? this.taskForm.baseInfo.riskIdentificationResultsRisk.split(',')
          : []
        if (this.taskForm.baseInfo.riskIdentificationResultsOthers) {
          this.checkBoxOptions['风险'].forEach((item) => {
            if (item.value == '其他') {
              item.label += `:${this.taskForm.baseInfo.riskIdentificationResultsOthers}`
            }
          })
          data.push('其他')
        }
        if (this.taskForm.baseInfo.riskIdentificationResultsSafetyPre) {
          this.checkBoxOptions['风险'].forEach((item) => {
            if (item.value == '注意事项') {
              item.label += `:${this.taskForm.baseInfo.riskIdentificationResultsSafetyPre}`
            }
          })
          data.push('注意事项')
        }
        return data
      },
      set() {
        return false
      },
    },
    // 工作类型
    workType: {
      get() {
        let data = this.taskForm.baseInfo.associatedJobType
          ? this.taskForm.baseInfo.associatedJobType.split(',')
          : []
        if (this.taskForm.baseInfo.associatedJobTypeOthers) {
          this.checkBoxOptions['关联类型'].forEach((item) => {
            if (item.value == '其他') {
              item.label += `:${this.taskForm.baseInfo.associatedJobTypeOthers}`
            }
          })
          data.push('其他')
        }
        return data
      },
      set() {
        return false
      },
    },
    // 工作区域准备
    workAreaPreparation: {
      get() {
        let data = this.taskForm.baseInfo.workAreaPreparation
          ? this.taskForm.baseInfo.workAreaPreparation.split(',')
          : []
        if (this.taskForm.baseInfo.workAreaPreparationOthers) {
          this.checkBoxOptions['工作区域'].forEach((item) => {
            if (item.value == '其他') {
              item.label += `:${this.taskForm.baseInfo.workAreaPreparationOthers}`
            }
          })
          data.push('其他')
        }
        return data
      },
      set() {
        return false
      },
    },
    // 个人安全
    safetyPreparationProtectiveEqm: {
      get() {
        let data = this.taskForm.baseInfo.safetyPreparationProtectiveEqm
          ? this.taskForm.baseInfo.safetyPreparationProtectiveEqm.split(',')
          : []
        if (this.taskForm.baseInfo.safetyPreparationGlove) {
          this.checkBoxOptions['个人安全'].forEach((item) => {
            if (item.value == '手套') {
              item.label += `(种类：${this.taskForm.baseInfo.safetyPreparationGlove})`
            }
          })
          data.push('手套')
        }
        if (this.taskForm.baseInfo.safetyPreparationOthers) {
          this.checkBoxOptions['个人安全'].forEach((item) => {
            if (item.value == '其他') {
              item.label += `:${this.taskForm.baseInfo.safetyPreparationOthers}`
            }
          })
          data.push('其他')
        }
        if (this.taskForm.baseInfo.safetyPreparationRespirator) {
          this.checkBoxOptions['个人安全'].forEach((item) => {
            if (item.value == '过滤式呼吸器') {
              item.label += `(滤芯:${this.taskForm.baseInfo.safetyPreparationRespirator})`
            }
          })
          data.push('过滤式呼吸器')
        }
        // console.log(data);
        return data
      },
      set() {
        return false
      },
    },
    // 隔离设备
    lsolationEquipment: {
      get() {
        let data = this.taskForm.baseInfo.lsolationEquipment
          ? this.taskForm.baseInfo.lsolationEquipment.split(',')
          : []
        if (this.taskForm.baseInfo.lsolationEquipmentOthers) {
          this.checkBoxOptions['隔离设备'].forEach((item) => {
            if (item.value == '其他') {
              item.label += `:${this.taskForm.baseInfo.lsolationEquipmentOthers}`
            }
          })
          data.push('其他')
        }
        return data
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
            console.log(this.HistoryObj)
          }
        }
      )
    },
    onChangeCheck(checkedValues) {
      console.log('checked = ', checkedValues)
    },
    onChangeCheckBox(checkedValues) {
      console.log('checked = ', checkedValues)
    },
    callback(key) {
      console.log(key)
    },
  },
}
</script>

<style scoped lang="less">
.workLicenseDeteil {
  color: #000;
  .title {
    text-align: center;
    font-weight: 700;
    color: #000;
    font-size: 26px;
  }
  h3 {
    font-weight: bold;
  }
  li {
    /*display: flex;*/
    font-weight: bold;
    line-height: 25px;
  }
  li span {
    display: inline-block;
    flex: 1;
    font-weight: normal;
  }
  .li-label {
    /*max-width: 400px;*/
    /*min-width: 150px;*/
    font-weight: 700;
    margin: 0 5px;
  }
  .li-text {
    /*min-width: 50%;*/
    border-bottom: 1px solid #ddd;
    color: #000 ;
  }
  .drawupList {
    display: flex;
    justify-content: space-between;
    .drawupList-box {
      width: 30%;
    }
    .drawupList-box2 {
      width: 45%;
      line-height: 30px;
    }
  }
  .drawupList-sq {
    color: #000 ;
    display: flex;
    flex-direction: column;
    .sign {
      display: flex;
      justify-content: space-between;
    }
  }

}

.appImg {
  width: 62px;
  height: 25px;
}
.check-content{
  label {
    color: #000;
    display: inline-block;
    position: relative;
  }
  span {
    padding: 0 3px;
    margin-left: 14px;
  }
  input {
    position: absolute;
    top: 5px;
  }
  input:disabled {
    border: 1px solid #DDD;
    background-color: red;
    color: #000;
  }
}
.header-test{
  color: #000;
}
</style>
