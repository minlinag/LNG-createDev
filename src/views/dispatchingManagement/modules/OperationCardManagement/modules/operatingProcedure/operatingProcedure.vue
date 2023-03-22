<template>
    <Breadcrumb>
        <template slot="breadcrumbButton">
            <pe-button
                    :include="[
          { value: 'Add', clickName: 'addClick' },
          { value: 'Delete', clickName: 'deleteClick' },
        ]"
                    @addClick="addClick"
                    @deleteClick="deleteClick"
            ></pe-button>
        </template>
        <template slot="appMain" class="app_main">

            <div class="main_body">
                <div id="components-layout-demo-basic" style="width: 100%">
                    <a-layout>
                        <a-layout-content>
                            <a-form-model layout="inline">
                                <a-col :span="6">
                                    <a-form-model-item
                                            :labelCol="{ style: 'width: 90px' }"
                                            label="规程名称"
                                    >
                                        <a-input
                                                placeholder="请输入"
                                                v-model="queryParams.ruleName"
                                        />
                                    </a-form-model-item>
                                </a-col>
                                <a-col :span="6">
                                    <a-form-model-item
                                            :labelCol="{ style: 'width: 90px' }"
                                            label="维护人"
                                    >
                                        <a-input
                                                placeholder="请输入"
                                                v-model="queryParams.maintainUser"
                                        />
                                    </a-form-model-item>
                                </a-col>


                                <a-col :span="6">
                                    <a-form-model-item>
                                        <a-button
                                                class="buttonType"
                                                type="primary"
                                                @click="inquireClick"
                                        >
                                            查询
                                        </a-button>
                                        <a-button class="buttonType" @click="resetClick">
                                            重置
                                        </a-button></a-form-model-item
                                    ></a-col
                                >
                            </a-form-model>
                        </a-layout-content>
                    </a-layout>
                </div>
                <div class="system_file_table">
                    <!-- 表格 -->
                    <a-table
                            :scroll="{ y: 1, x: 300 }"
                            class="list_table_2"
                            @change="paginationChange"
                            :row-selection="{
                              selectedRowKeys: selectedRowKeys,
                              onChange: onSelectChange,
                              fixed: true,
                            }"
                            rowKey="id"
                            :pagination="pagination"
                            :columns="columns"
                            :dataSource="dataSource"
                            :openSelector="true"
                    >
                        <template slot="dranLoad" slot-scope="row">
                            <pe-button
                                :include="[

                                  {
                                    value: '下载',
                                    type: 'link',
                                    clickName: 'dranLoad',
                                    style: ['btn_link'],
                                  },
                                ]"
                                    @dranLoad="dranLoad(row)"
                            ></pe-button>
                        </template>

                        <!-- 行内操作列按钮 -->
                        <template slot="operation" slot-scope="row">
                            <pe-button
                                :include="[
                                  {
                                    value: 'Edit',
                                    type: 'link',
                                    clickName: 'edit',
                                    icon: '',
                                    style: ['btn_link'],
                                  },
                                  {
                                    value: '详情',
                                    type: 'link',
                                    clickName: 'look',
                                    style: ['btn_link'],
                                  },
                                ]"
                                    @edit="editClick(row)"
                                    @look="lookClick(row)"
                            ></pe-button>
                        </template>
                    </a-table>
                </div>
            </div>
            <div v-if="hiddenVisible">
                <a-modal
                        :title="formTitle"
                        :visible="hiddenVisible"
                        :width="1000"
                        @cancel="cancelHidden"
                        :maskClosable="false"
                        class="from-style bigModel"
                >
                    <add-edit-form
                            ref="addEditFormRef"
                            @cancel="addEditFormCancel"
                            :type="queryParams.type"
                            :hiddenVisible="hiddenVisible"
                            :check-form="checkForm"
                            :form-edit-data="formEditData"
                    ></add-edit-form>
                    <template #footer>
                        <div style="text-align: center">
                            <a-button type="primary" @click="confirmClick" v-if="!checkForm"
                            >确定</a-button
                            >
                            <a-button @click="cancelHidden">取消</a-button>
                        </div>
                    </template>
                </a-modal>
            </div>
        </template>
    </Breadcrumb>
</template>
<script>
    import addEditForm from "./components/addEditForm.vue"
    import { getListForPage, hseFileDelete } from "@/api/HSESystemFileManagement/operatingProcedure"
    import { timestampToTime } from '@/utils/tableFun'
    export default {
        name: 'hSESystemFileManagement',
        components: { addEditForm },
        data() {
            return {
                divisionList: [
                    { label: '综合办公室', value: 'ZB' },
                    { label: '党群工作部', value: 'DG' },
                    { label: '人力资源部', value: 'RZ' },
                    { label: '法律审计部', value: 'FS' },
                    { label: '财务部', value: 'CW' },
                    { label: '企管计划部', value: 'QJ' },
                    { label: '生产技术部', value: 'SJ' },
                    { label: '质量安全环保部', value: 'AH' },
                    { label: '生产运营中心', value: 'SY' },
                    { label: '检维修中心', value: 'JX' },
                    { label: '运行保障中心', value: 'YB' }
                ],
                queryParams: {
                    ruleName: "",
                    maintainUser: "",
                    pageNum: 1,
                    pageSize: 10,
                },
                formEditData: {},
                pagination: {
                    current: 1,
                    total: 0, // 总数
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
                    showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
                    pageSize: 10, // 每页条数，所有页设置统一的条数
                },
                treeModel: ['公司级'],
                createDate: [],
                selectedRowKeys: [],
                dataSource: [],
                formTitle: 'HSE体系文件-新增',
                checkForm: false,
                hiddenVisible: false,
                columns: [
                    {
                        title: '序号',
                        customRender: (text, record, index) =>
                            `${(this.pagination.current - 1) * this.pagination.pageSize +
                            index +
                            1
                                }`,
                        width: 50,
                    },
                    {
                        title: '操作规程名称',
                        dataIndex: 'ruleName',
                        ellipsis: true,
                    },
                    {
                        title: '当前版本号',
                        dataIndex: 'nowVersion',
                        ellipsis: true,
                        width: 200,
                    },
                    {
                        title: '维护人',
                        dataIndex: 'maintainUser',
                        ellipsis: true,
                        width: 200,
                    },
                    {
                        title: '维护时间',
                        dataIndex: 'MaintainTime',
                        width: 200,
                        customRender: (value, row, index) => {
                            return {
                                children: timestampToTime(value),
                                attrs: { rowSpan: 1 },
                            };
                        }
                    },
                    {
                        title: '下载',
                        scopedSlots: { customRender: 'dranLoad' },
                        width: 100,
                    },
                    {
                        title: '操作',
                        scopedSlots: { customRender: 'operation' },
                        width: 100,
                        fixed: 'right',
                    },
                ],
            }
        },
        created() {
            this.getTableList()
        },
        methods: {
            //文件下载
            dranLoad(val){
                window.location.href = Glod.DEVE_LOPMENT_ENVIRONMENT + 'fileinfo/downloadFileById?id=' + JSON.parse(val.attInfo).id + '&dType=d'
            },
            editClick(row) {
                this.formTitle = '操作规范流程管理-编辑';
                this.checkForm = false
                this.getFormData(row)
            },
            lookClick(row) {
                this.checkForm = true
                this.formTitle = '操作规范流程管理-查看';
                this.getFormData(row)

            },
            getFormData(row) {
                this.queryParams.id = row.id
                console.log(row);
                getListForPage(this.queryParams).then(res => {
                    console.log(res);
                    if (res.code == "200") {
                        this.hiddenVisible = true
                        let formEditData = {}
                        formEditData = row
                        // formEditData.createdDateTime = this.formatTime(timestampToTime(row.createdDateTime))
                        formEditData.maintainTime = timestampToTime(row.maintainTime)
                        formEditData.createdDateTimeSubstitute = row.createdDateTime
                        formEditData.attInfo = res.body.data[0].fileID
                        formEditData.fileList = res.body.data.map((item) => {
                            let newItem = item
                            newItem.thisUpTime = timestampToTime(item.thisUpTime)
                            newItem.uploadTimeSubstitute = item.uploadTime
                            if (newItem.fileID) {
                                newItem.fileID = this.$fileUploadJSON.toParse(newItem.fileID)
                            }
                            return newItem
                        })
                        this.formEditData = formEditData
                    }
                })
            },
            onNavigationSelect(keys, event) {
                this.treeModel = keys
                this.queryParams.type = keys[0]
                this.getTableList()
            },
            addClick() {
                this.formTitle = '操作规范流程管理-新增';
                this.checkForm = false
                this.hiddenVisible = true
                this.formEditData = {
                    fileName: "",
                    nowVersion: "",
                    orgName: this.$store.state.user.unitName,
                    // createdDateTime: this.getUploadTime(),
                    createdUser: this.$store.state.user.name,
                    uploadTime: "",
                    remark: "",
                    type: this.queryParams.type,
                    fileList: []
                }
            },
            deleteClick() {
                if (this.selectedRowKeys.length > 0) {
                    hseFileDelete(this.selectedRowKeys).then((res) => {
                        if (res.code == 200) {
                            this.selectedRowKeys = [];
                        }
                        this.getTableList();
                        this.$message.success("删除成功！");
                    });
                } else {
                    this.$message.warning("请选择文件！");
                }

            },
            inquireClick() {
                this.pagination.id='';
                this.pagination.current = 1
                this.queryParams.pageNum = 1
                this.getTableList()
            },
            resetClick() {
                this.queryParams.ruleName = ""
                this.queryParams.maintainUser = ""
                this.pagination.current = 1
                this.queryParams.pageNum = 1
                this.getTableList()
            },
            onSelectChange(key) {
                this.selectedRowKeys = key
            },
            paginationChange(pagination) {
                this.pagination.pageSize = pagination.pageSize
                this.pagination.current = pagination.current
                this.queryParams.pageNum = pagination.current
                this.queryParams.pageSize = pagination.pageSize
            },
            cancelHidden() {
                this.hiddenVisible = false
            },
            addEditFormCancel() {
                this.hiddenVisible = false
                this.getTableList()
            },
            confirmClick() {
                this.$refs.addEditFormRef.confirm();
            },
            // createDateChange(date) {
            //     if (date.length > 0) {
            //         this.queryParams.createdDateTime = date[0]
            //         this.queryParams.createdDateTimeEnd = date[1]
            //     } else {
            //         this.queryParams.createdDateTime = ""
            //         this.queryParams.createdDateTimeEnd = ""
            //     }
            // },
            getTableList() {
                delete this.queryParams.id
                getListForPage(this.queryParams).then(res => {
                    this.pagination.total = res.body.total
                    this.dataSource = res.body.data
                })
            },
            getUploadTime() {
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                month = (month > 9) ? month : ('0' + month);
                day = (day < 10) ? ('0' + day) : day;
                return year + '-' + month + '-' + day;
            },
            /** 返回时间格式化 去掉秒  */
            formatTime(row) {
                if (row) {
                    return row.substring(0, 10);
                } else {
                    return "";
                }
            },
        },
    }
</script>
<style lang="less" scoped>
    ::v-deep .app_main {
        background: #f3f3f4 !important;
        padding: 11px 0px 0px !important;
        margin-right: 0 !important;

        .main_body {
            background: #fff;
            #components-layout-demo-basic {
                height: auto;
                padding: 20px;
                padding-bottom: 10px;
            }
        }
    }
    .system_file_table {
        padding: 0 20px;
    }
</style>
