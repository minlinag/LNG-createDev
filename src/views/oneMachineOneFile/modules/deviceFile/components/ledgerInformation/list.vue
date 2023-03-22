<template>
  <div class="wrapper">
    <!-- 内容 -->
    <Breadcrumb :titleName="title">
      <template slot="appMain">
        <a-table
          :columns="columns"
          :data-source="tableList"
          :scroll="{ y: 1, x: 1400 }"
          class="a_table_document"
          rowKey="id"
          :pagination="false"
          :loading="tableLoading"
        >
          <template slot="operate" slot-scope="row, record, index">
            <a-button
              type="link"
              class="btn_link"
              style="cursor: pointer"
              @click="previewClick(row)"
              :disabled="index == 0"
            >
              查看
            </a-button>
          </template>
        </a-table>
      </template>
    </Breadcrumb>
  </div>
</template>
<script>
import {
  getSBGLDAWDdict,
  getTree,
  queryCatalogue,
} from '@/api/oneMachineOneFile/ledgerInformation'
export default {
  name: 'ledgerInformationList',
  props: ['title', 'deviceCode'],
  data() {
    return {
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => `${index + 1}`,
          width: 50,
        },
        {
          title: '一级文件名称',
          dataIndex: 'primaryFileName',
        },
        {
          title: '二级文件名称',
          dataIndex: 'A',
        },
        {
          title: '三级文件名称',
          dataIndex: 'B',
        },
        {
          title: '四级文件名称',
          dataIndex: 'C',
        },
        {
          title: '五级文件名称',
          dataIndex: 'D',
        },
        {
          title: '六级文件名称',
          dataIndex: 'E',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operate' },
          align: 'center',
          fixed: 'right',
          width: 100,
        },
      ],
      queryParams: {
        deviceCode: this.deviceCode,
      },
      tableList: [],
      tableLoading: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      getSBGLDAWDdict({ dictId: 'SBGL-DAWD' }).then((res) => {
        if (res.code == 200) {
          this.tableList = []
          this.treeConvert(res.body.data, 1)
          this.tableLoading = false
        }
      })
    },
    treeConvert(val, level, targetId) {
      val.forEach((element) => {
        let list = []
        let label = {
          partsName: element.fileName,
          primaryFileName: '',
          A: '',
          B: '',
          C: '',
          D: '',
          E: '',
          id: element.id,
          children: element.children,
          nodeLevel: level,
          targetId: level == 2 ? element.id : targetId,
          eqmType: element.label,
          code: element.code,
        }
        switch (level) {
          case 1:
            label.primaryFileName = element.label
            break
          case 2:
            label.A = element.label
            break
          case 3:
            label.B = element.label
            break
          case 4:
            label.C = element.label
            break
          case 5:
            label.D = element.label
            break
          case 6:
            label.E = element.label
            break
        }
        this.tableList.push(label)
        if (element.children.length > 0) {
          let levelId = ''
          if (level == 2) {
            levelId = element.id
          } else if (level > 2) {
            levelId = targetId
          }
          this.treeConvert(element.children, level + 1, levelId)
        }
      })
    },
    previewClick(row) {
      this.$emit('archiveDocumentsJump', row)
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
</style>
