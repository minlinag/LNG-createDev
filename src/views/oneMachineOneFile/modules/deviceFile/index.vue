<template>
  <div class="wrapper">
    <div class="device_file_directory_tree">
      <a-directory-tree
        multiple
        default-expand-all
        @select="onNavigationSelect"
        @expand="onExpand"
        :selectedKeys="treeModel"
      >
        <a-tree-node key="0-0-0" title="详细档案">
          <a-tree-node key="0-1-0" title="档案簿">
            <a-tree-node
              v-for="item in fileBookNavigationList"
              :key="item.relate_id"
              :title="item.relate_name"
            >
            </a-tree-node>
          </a-tree-node>
          <a-tree-node key="0-2-0" title="档案文档">
            <a-tree-node
              v-for="item in dictList"
              :key="item.id"
              :title="item.label"
            >
            </a-tree-node>
            <!-- <a-tree-node key="0-2-1" title="设计安装"> </a-tree-node>
            <a-tree-node key="0-2-2" title="运维维护"> </a-tree-node>
            <a-tree-node key="0-2-3" title="报废处理"> </a-tree-node> -->
          </a-tree-node>
        </a-tree-node>
      </a-directory-tree>
    </div>
    <div class="main_body">
      <div class="cover" v-if="contentShow === '0-0-0'">
        <h4>设备档案</h4>
        <div>
          <p>设备名称：{{ eqmArchivesData.eqmName }}</p>
          <p>设备位号：{{ eqmArchivesData.eqmNo }}</p>
          <p>
            建档日期：{{ eqmArchivesData.archivesDateTime | timestampTime }}
          </p>
          <p>归档编号：{{ eqmArchivesData.archivesNo }}</p>
          <p>责&nbsp;任&nbsp;人：{{ eqmArchivesData.principal }}</p>
        </div>
      </div>
      <div class="content" v-else>
        <!-- 设备铭牌信息 -->
        <nameplate-information
          v-if="contentShow === 'SBGL-SBDA-SBMP'"
          :device-code="deviceCode"
          :title="'设备铭牌信息'"
        ></nameplate-information>

        <list v-if="contentShow === '0-1-2'"> </list>
        <!-- 参数 -->
        <equipment-technology-parameter
          v-if="contentShow == 'SBGL-SBDA-SBJSCS'"
          :title="rightPageTitle"
          :device-code="deviceCode"
        >
        </equipment-technology-parameter>

        <!-- 附属设备一览表 -->
        <ancillary-equipment-list
          v-if="contentShow == 'SBGL-SBDA-FSSBYLB'"
          :device-code="deviceCode"
          :title="rightPageTitle"
        >
        </ancillary-equipment-list>
        <!-- 专用工具一览表 -->
        <specialized-equipment-list
          v-if="contentShow == 'SBGL-SBDA-ZYGJYLB'"
          :title="rightPageTitle"
          :device-code="deviceCode"
        >
        </specialized-equipment-list>

        <!-- 设备管理责任人信息表 -->
        <equipment-respons-ibleinformation-sheet-list
          v-if="contentShow == 'SBGL-SBDA-SBGLZRR'"
          :title="rightPageTitle"
          :device-code="deviceCode"
        >
        </equipment-respons-ibleinformation-sheet-list>
        <!-- 主要及易损零件一览表 -->
        <main-vulnerable-list
          v-if="contentShow == 'SBGL-SBDA-YSLJ'"
          :title="rightPageTitle"
          :device-code="deviceCode"
        ></main-vulnerable-list>

        <!-- 设备缺陷记录表 -->
        <equipment-defect-record-list
          v-if="contentShow == 'SBGL-SBDA-SBQX'"
          :title="rightPageTitle"
          :device-code="deviceCode"
        >
        </equipment-defect-record-list>
        <!-- （年度）设备运行统计表 -->
        <year-equipment-operation-statistics
          v-if="contentShow == 'SBGL-SBDA-SBYXTJ'"
          :title="'（年度）设备运行统计表'"
          :device-code="deviceCode"
        ></year-equipment-operation-statistics>

        <!-- 档案文档 -->
        <archive-documents
          :title="rightPageTitle"
          :checkedDict="checkedDict"
          :parent-code="'SBGL-DAWD'"
          v-if="dictIdArr.includes(contentShow)"
          :jumpPageType="jumpPageType"
          :jumpPageId="jumpPageId"
          :device-code="deviceCode"
          :jump-children-list="jumpChildrenList"
        ></archive-documents>

        <!-- 设备台账资料 -->
        <ledgerInformationList
          v-if="contentShow == 'SBGL-SBDA-SBZLTZ'"
          :title="rightPageTitle"
          :device-code="deviceCode"
          @archiveDocumentsJump="jumpPage"
        ></ledgerInformationList>

        <right-page
          :tableList="tableList"
          :tableHeaderList="tableHeaderList"
          :title="rightPageTitle"
          :globalData="rightPagData"
          ref="rightPagRef"
          v-if="!contentShow"
        ></right-page>
      </div>
    </div>
  </div>
</template>
<script>
import nameplateInformation from './components/nameplateInformation/list.vue'
import equipmentTechnologyParameter from './components/equipmentTechnologyParameter/list.vue'
import rightPage from './components/rightPage'
import ancillaryEquipmentList from './components/ancillaryEquipmentList/list.vue'
import specializedEquipmentList from './components/specializedEquipmentList/list.vue'
import equipmentResponsIbleinformationSheetList from './components/equipmentResponsIbleinformationSheet/list.vue'
import mainVulnerableList from './components/mainVulnerableList/list.vue'
import archiveDocuments from './components/archiveDocuments/list.vue'
import equipmentDefectRecordList from './components/equipmentDefectRecordList/list.vue'
import yearEquipmentOperationStatistics from './components/yearEquipmentOperationStatistics/list.vue'
import ledgerInformationList from './components/ledgerInformation/list.vue'

import {
  archivesClassificConfigFindOwnConfigList,
  getSBGLDAWDdict,
  queryEqmArchives,
} from '@/api/oneMachineOneFile/deviceMaintenance.js'

export default {
  name: 'oneMachineOneFileDeviceMaintenance',
  components: {
    nameplateInformation,
    equipmentTechnologyParameter,
    rightPage,
    ancillaryEquipmentList,
    specializedEquipmentList,
    equipmentResponsIbleinformationSheetList,
    mainVulnerableList,
    archiveDocuments,
    equipmentDefectRecordList,
    yearEquipmentOperationStatistics,
    ledgerInformationList,
  },
  data() {
    return {
      treeModel: [],
      jumpPageType: '',
      contentShow: '0-0-0',
      fileBookNavigationList: [],
      tableList: [],
      tableHeaderList: [],
      rightPageTitle: '',
      deviceCode: '',
      // equipmentCode: "",
      dictList: [],
      dictIdArr: [],
      checkedDict: {},
      jumpPageId: '',
      jumpChildrenList: [],
      eqmArchivesData: {
        eqmName: '',
        eqmNo: '',
        archivesDateTime: '',
        archivesNo: '',
      },
      rightPagData: {}
    }
  },
  created() {
    this.deviceCode = this.$route.query.eqm_sbwh
    // this.equipmentCode = this.$route.query.eqm_sbbm
    this.getArchivesClassificConfigFindOwnConfigList()
    this.getSBGLDAWDdictList()
    this.getQueryEqmArchives()
  },
  filters: {
    timestampTime(value) {
      if (!value) return ''
      let date = new Date(value)
      let Y = date.getFullYear() + '-'
      let M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      let s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
  },

  methods: {
    // shijianc(time) {

    // },
    getQueryEqmArchives() {
      queryEqmArchives({
        eqmName: this.$route.query.eqm_sbmc,
        eqmNo: this.$route.query.eqm_sbwh,
      }).then((res) => {
        if (res.code == 200) {
          if (res.body.length !== 0) {
            this.eqmArchivesData = res.body[0]
          }
        }
      })
    },
    getArchivesClassificConfigFindOwnConfigList() {
      archivesClassificConfigFindOwnConfigList({
        featureClassificid: this.$route.query.eqm_sbbm,
      }).then((res) => {
        if (res.code == 200) {
          this.fileBookNavigationList = res.body
        }
      })
    },
    getSBGLDAWDdictList() {
      getSBGLDAWDdict({ dictId: 'SBGL-DAWD' }).then((res) => {
        if (res.code == 200) {
          this.dictList = res.body.data[0].children
          this.dictIdArr = res.body.data[0].children.map((item) => {
            return item.id
          })
        }
      })
    },

    onNavigationSelect(keys, event) {
      this.jumpPageType = ''
      this.onNavigationProcess(keys, event)
    },
    onNavigationProcess(keys, event) {
      this.treeModel = keys
      let cullList = ['0-1-0']
      if (cullList.includes(keys[0])) {
        return false
      }
      if (keys[0] == '0-0-0') {
        this.contentShow = keys[0]
        return false
      }
      if (this.dictIdArr.includes(keys[0])) {
        for (let index = 0; index < this.dictList.length; index++) {
          const element = this.dictList[index]
          if (element.id == keys[0]) {
            this.rightPageTitle = element.label
            this.checkedDict = element
          }
        }

        this.contentShow = keys[0]
        return false
      }
      this.fileBookNavigationList.forEach((element) => {
        if (element.relate_id == keys[0]) {
          this.rightPageTitle = element.relate_name
          let customizePage = [
            'SBGL-SBDA-SBJSCS',
            'SBGL-SBDA-FSSBYLB',
            'SBGL-SBDA-ZYGJYLB',
            'SBGL-SBDA-SBGLZRR',
            'SBGL-SBDA-YSLJ',
            'SBGL-SBDA-SBQX',
            'SBGL-SBDA-SBMP',
            'SBGL-SBDA-SBYXTJ',
            'SBGL-SBDA-SBZLTZ',
          ]
          if (customizePage.includes(element.relate_id)) {
            this.customizeAction(element)
          } else {
            this.factoryAction(element)
          }
        }
      })
    },
    customizeAction(element) {
      this.contentShow = element.relate_id
    },
    factoryAction(element) {
      this.contentShow = ''
      this.rightPagData = element
    },
    onExpand(keys, event) {
      console.log('Trigger Expand')
    },
    jumpPage(row) {
      this.jumpPageType = row.eqmType
      if (row.id != row.targetId) {
        this.jumpPageId = row.id
        this.jumpChildrenList = row
      } else {
        this.jumpPageId = ''
        this.jumpChildrenList = []
      }
      this.onNavigationProcess([row.targetId])
    },
  },
}
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  .device_file_directory_tree {
    width: 200px;
    background: #fff;
    height: calc(100vh - 100px);
    overflow: auto;
  }
  .main_body {
    width: calc(100% - 220px);
    background: #fff;
    .cover {
      h4 {
        text-align: center;
        margin-top: 50px;
      }
      div {
        margin-left: 80px;
        p {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
