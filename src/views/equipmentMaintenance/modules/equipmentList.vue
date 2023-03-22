<template>
    <Breadcrumb>
        <div class="detail-content">
            <div class="tree-content">
                <a-tree
                        :show-line="true"
                        :show-icon="false"
                        :default-expanded-keys="['0-0-0', '0-0-1', '0-0-2']"
                        @select="onSelect"
                >
                    <a-icon slot="icon" type="carry-out" />
                    <a-tree-node key="0-0">
                        <a-icon slot="icon" type="carry-out" />
                        <span slot="title" style="color: #1890ff">parent 1</span>
                        <a-tree-node key="0-0-0" title="parent 1-0">
                            <a-icon slot="icon" type="carry-out" />
                            <a-tree-node key="0-0-0-0" title="leaf">
                                <a-icon slot="icon" type="carry-out" />
                            </a-tree-node>
                            <a-tree-node key="0-0-0-1" title="leaf">
                                <a-icon slot="icon" type="carry-out" />
                            </a-tree-node>
                            <a-tree-node key="0-0-0-2" title="leaf">
                                <a-icon slot="icon" type="carry-out" />
                            </a-tree-node>
                        </a-tree-node>
                        <a-tree-node key="0-0-1" title="parent 1-1">
                            <a-icon slot="icon" type="carry-out" />
                            <a-tree-node key="0-0-1-0" title="leaf">
                                <a-icon slot="icon" type="carry-out" />
                            </a-tree-node>
                        </a-tree-node>
                        <a-tree-node key="0-0-2" title="parent 1-2">
                            <a-icon slot="icon" type="carry-out" />
                            <a-tree-node key="0-0-2-0" title="leaf">
                                <a-icon slot="icon" type="carry-out" />
                            </a-tree-node>
                            <a-tree-node key="0-0-2-1" title="leaf">
                                <a-icon slot="icon" type="carry-out" />
                                <a-icon slot="switcherIcon" type="form" />
                            </a-tree-node>
                        </a-tree-node>
                    </a-tree-node>
                </a-tree>
            </div>
            <div>
                <div class="search-content">
                    <a-form-model v-model="searchInfo">

                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 110px' }" label="设备类型:">
                                <a-input v-model="searchInfo.deviceName" placeholder="请输入">

                                </a-input>

                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 110px' }" label="设备名称:">
                                <a-input v-model="searchInfo.deviceNo" placeholder="请输入">

                                </a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 220px' }" label="备品备件名称:">
                                <a-input v-model="searchInfo.temMainPlanDescription" placeholder="请输入"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-model-item :labelCol="{ style: 'width: 220px' }" label="商品备件编码:">
                                <a-input v-model="searchInfo.temMainPlanDescription" placeholder="请输入"></a-input>
                            </a-form-model-item>
                        </a-col>
                    </a-form-model>
                    <div class="queryItem">
                        <a-button v-Query class="buttonType" :style="{ marginLeft: '8px' }" type="primary" @click="select">
                            查询
                        </a-button>
                        <a-button class="buttonType" @click="resetForm">
                            重置
                        </a-button>
                    </div>
                </div>
                <a-collapse :defaultActiveKey="['1']">
                    <a-collapse-panel key="1" header="设备备件清单列表">
                        <div slot="extra">
                            <a-button v-Query class="buttonType" :style="{ marginLeft: '8px' }" type="primary"
                                      @click.stop="addPlan">
                                导出查询结果
                            </a-button>
                        </div>
                        <dc-table :scroll="{ x: 100 }" :pagination="pagination" @change="paginationChange"
                                  :columns="columns" :dataSource="dataSource" :openSelector="false">
                            <template slot="operation" slot-scope="row">
                                <span class="look" @click="getListDetail(row)">
                                    编辑
                                </span>
                            </template>
                        </dc-table>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        </div>
    </Breadcrumb>
</template>
<script>
    import {
        getList,//获取列表
        addList,//获取列表
        upDateList,//修改列表
        getdict
    } from '@/api/maintenanceManagementList'
    import { message } from 'ant-design-vue';

    export default {
        data() {
            return {
                pagination: {
                    current: 0,
                    // defaultCurrent: 1,
                    total: 0, // 总数
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30', '40', '50', '60'],
                    showTotal: total => `共 ${total} 条`, // 分页中显示总的数据
                    // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
                    pageSize: 0 // 每页条数，所有页设置统一的条数
                },
                columns: [
                    {
                        title: '序号',
                        customRender: (text, record, index) => `${
                        (this.pagination.current - 1) * this.pagination.pageSize + index + 1
                            }`,
                        width: 70,
                    },
                    {
                        title: '设备名称',
                        dataIndex: 'versionNumber',
                        scopedSlots: { customRender: 'versionNumber' },
                    },
                    {
                        title: ' 设备编号 ',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                    {
                        title: '设备位号',
                        dataIndex: 'description',
                    },
                    {
                        title: ' 备件物料名称',
                        dataIndex: 'deviceName',
                        // slots: { title: 'equipmentCategory' },//表头插槽
                        scopedSlots: { customRender: 'deviceName' },
                    },
                    {
                        title: '备件物料编码',
                        dataIndex: 'lastModifiedDateTime1',
                    },
                    {
                        title: '规格型号',
                        dataIndex: 'lastModifiedDateTime2',
                    },
                    {
                        title: '计量单位',
                        dataIndex: 'lastModifiedDateTime3',
                    },
                    {
                        title: '安全库存',
                        dataIndex: 'lastModifiedDateTime4',
                    },
                    {
                        title: '现存量',
                        dataIndex: 'lastModifiedDateTime5',
                    },
                    {
                        fixed: 'right',
                        title: '操作',
                        width: 80,
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                dataSource: [
                    {
                        key: '1',
                        equipmentName: 1
                    }
                ],
                searchInfo:{
                    pageIndex:1,
                    pageSize:10,
                },
            }
        },
        mounted() {
            this.getList();
        },
        created() {
        },
        methods: {
            //tree树点击
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },

            //分页点击
            select() {
                this.searchInfo.pageIndex = 1;
                this.searchInfo.pageSize = 10;
                this.getList();
            },
            //分页点击
            paginationChange(pagination) {
                this.searchInfo.pageIndex = pagination.current
                this.searchInfo.pageSize = pagination.pageSize
                this.getList()
            },

            //点击新增
            addPlan() {
                this.$router.push({
                    path: "/maintenanceManagement"
                });
            },
            //点击编辑
            upDateListDetail(val) {

            },
            //点击查看
            getListDetail(val) {
                this.$router.push({
                    path: "/maintenanceManagement",
                    query:{versionNumber:val.versionNumber}
                });

            },

            //获取表格列表
            getList() {
                getList(this.searchInfo).then((res) => {
                    this.pagination.current = res.body.pageIndex
                    this.pagination.pageSize = res.body.pageSize
                    this.dataSource = res.body.data
                    this.pagination.total = res.body.total;
                })
            },
            //重置输入
            resetForm() {
                this.searchInfo = {}
            },
        }
    }
</script>
<style scoped lang="less">
    /deep/ .ant-checkbox-wrapper+.ant-checkbox-wrapper {
        margin: 0;
        padding: 0;
    }

    .equipmentDisplay {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .ant-form {
        display: flex;
        justify-content: left;
    }

    .equipmentSelection {
        width: 100%;
        display: flex;
        justify-content: end;
        margin-left: -17px;
        margin-top: 10px;
    }

    /deep/ .equipmentDisplay-checkbox {
        margin-top: 10px;
    }

    .look {
        color: rgb(24, 144, 255);
        // color: white;
    }

    .Myserch {
        display: flex;
        justify-content: end;
    }

    .bar {
        width: 100%;
        height: 10px;
        margin-top: 10px;
        background-color: #ECECEC;
        // box-shadow: 2px 2px 5px #333;
        border-radius: 5px;
    }

    span{
        cursor: pointer;
        padding: 0 5px;
    }
    .detail-content{
        display: flex;
    }
    .detail-content>div{
        flex: 1;
    }
    .detail-content .tree-content{
        max-width: 200px;
        min-width: 200px;
        margin-right: 12px;
        border-radius: 7px;
    }
    .search-content{
        /deep/ .ant-form-item {
            margin-bottom: 0;
        }
    }
</style>

