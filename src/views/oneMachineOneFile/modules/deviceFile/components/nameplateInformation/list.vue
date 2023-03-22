<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb :titleName="title">
      <template slot="breadcrumbButton">
        <pe-button
          :include="[{ value: 'Add', name: '编辑', clickName: 'addListClick' }]"
          @addListClick="addListClick"
        ></pe-button>
      </template>
      <template slot="appMain">
        <a-table
          :pagination="false"
          :columns="columns"
          :data-source="tableList"
          :scroll="{ y: 400 }"
          rowKey="id"
        >
          <template slot="nameplate" slot-scope="row">
            <!-- <a-tooltip
              style="margintop: 10px"
              placement="left"
              :auto-adjust-overflow="false"
              overlayClassName="nameplate_tooltip"
            >
              <template slot="title">
                <img style="width: 500px" :src="row.nameplate" />
              </template> -->
            <div v-viewer>
              <img class="nameplate_img" :src="row.nameplate" />
            </div>

            <!-- </a-tooltip> -->
          </template>
        </a-table>
      </template>
    </Breadcrumb>
    <add-and-edit
      :hidden-visible="hiddenVisible"
      :form-title="formTitle"
      @close="addAndEditClose"
      @submitForm="submitForm"
      :formdata="formdata"
      ref="addAndEditRef"
    ></add-and-edit>
  </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Vue from 'vue'
Vue.use(VueViewer)
import {
  findAllList,
  TEqmSbmpxxControllerUpdate,
} from '@/api/oneMachineOneFile/nameplateInformation'
import { downloadFileById } from '@/api/public'
import addAndEdit from './addAndEdit'
export default {
  name: 'nameplateInformationList',
  props: ['title', 'deviceCode'],
  components: { addAndEdit },
  data() {
    return {
      columns: [
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 200,
        },
        {
          title: '铭牌',
          width: 200,
          scopedSlots: { customRender: 'nameplate' },
          ellipsis: true,
        },
        {
          title: '备注',
          width: 200,
          dataIndex: 'remark',
        },
      ],
      queryParams: {
        deviceNo: this.deviceCode,
      },
      tableList: [],
      hiddenVisible: false,
      formdata: {},
      formTitle: '',
    }
  },
  created() {
    this.getList()

  },
  methods: {
    getList() {
      findAllList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableList = [res.body]
          if (res.body.nameplateID) {
            this.getImg(res.body.nameplateID)
          }
        }
      })
    },
    getImg(id) {
      downloadFileById({ id: id, dType: "b" }).then((response) => {
        let blob = response
        if (blob.hasOwnProperty("data")) {
          blob = response.data
        }
        this.blobToDataURI(blob, (e) => {
          this.$set(this.tableList[0], 'nameplate', e)
        })
      });
    },
    blobToDataURI(blob, callback) {
      var reader = new FileReader();
      if (blob) {
        reader.readAsDataURL(blob);
      }
      reader.addEventListener("load", function () {
        callback(reader.result);
      }, false);
    },
    addListClick() {
      this.hiddenVisible = true
      this.formTitle = this.title + '-编辑'
      this.formdata = {
        deviceName: this.tableList[0].deviceName,
        remark: this.tableList[0].remark,
        id: this.tableList[0].id,
        nameplate: this.tableList[0].nameplate,
        nameplateID: this.tableList[0].nameplateID,
        nameplateName: this.tableList[0].nameplateName,
        nameplateType: this.tableList[0].nameplateType,
      }
    },
    addAndEditClose() {
      this.hiddenVisible = false
    },
    submitForm(val) {
      TEqmSbmpxxControllerUpdate(val).then((res) => {
        if (res.code == 200) {
          this.$message.success('添加成功')
          this.getList()
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
.wrapper {
  width: 100%;
}
.form_item_description {
  ::v-deep .ant-form-item-label {
    width: 123px;
    label {
    }
  }
  ::v-deep {
    .ant-form-item-control-wrapper {
      width: calc(100% -123px);
    }
  }
}
.nameplate_img {
  width: 50px;
  height: 50px;
}
</style>
<style>
.nameplate_tooltip {
  max-width: 600px;
}
</style>
