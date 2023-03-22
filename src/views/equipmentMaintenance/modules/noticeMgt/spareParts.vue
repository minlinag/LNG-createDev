<template>
    <div>
        <a-form-model>
            <a-col :span="12">
                <a-form-model-item
                        :labelCol="{ style: 'width: 150px' }"
                        label="备品备件名称:"
                >
                    <a-input
                            v-model="selectFrom.sparePartName"
                            placeholder="备品备件名称"
                    ></a-input>
                </a-form-model-item>
            </a-col>
            <a-form-model-item class="search_form_button">
                <a-button
                        v-Query
                        class="buttonType"
                        :style="{ marginLeft: '8px' }"
                        type="primary"
                        @click="select"
                >
                    查询
                </a-button>
                <a-button class="buttonType" @click="resetForm"> 重置</a-button>
            </a-form-model-item>
            <dc-table
                :row-selection="{
                  selectedRowKeys: spartPartDataSourceKey,
                  onChange: spartPartDataSourceChange,
                  columnWidth: 30
                }"
                rowKey="id"
                :scroll="{ x: 100 }"
                :columns="columnsModel"
                :dataSource="spartPartDataSource"
                :pagination="paginationSparepart"
                @change="paginationChangeSparepart"
                :openSelector="false"
            >
            </dc-table>
        </a-form-model>
        <div class="ant-modal-footer">
            <a-button type="primary" @click="ok"> 确定</a-button>
            <a-button @click="no">取消</a-button>
        </div>
    </div>
</template>

<script>
    import { getListForSparepart } from "@/api/sparesprt";
    export default {
        name: "",
        data() {
            return {
                // 表格数据存储
                columnsModel:[],
                //存储选中的数据
                spartPartDataSource: [],
                //form表单提交数据
                selectFrom:{},
                // 备品备件页码
                paginationSparepart: {
                    current: 0,
                    // defaultCurrent: 1,
                    total: 0, // 总数
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "30", "40", "50", "60"],
                    showTotal: (total) => `共 ${total} 条`, // 分页中显示总的数据
                    // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
                    pageSize: 0, // 每页条数，所有页设置统一的条数
                },
            }
        },
        component: {
            //someComponent
        },
        methods:{
            paginationChangeSparepart(){

            },
            //获取备品备件列表selectFrom
            getSpareparts() {
                getListForSparepart(this.selectFrom).then((res) => {
                    this.paginationSparepart.current = res.body.pageIndex;
                    this.paginationSparepart.total = res.body.total;
                    this.paginationSparepart.pageSize = res.body.pageSize;
                    // this.spartPartDataSourceOut = res.body.data;
                    this.spartPartDataSource = res.body.data;
                });
            },
            // isOk???
            ok(){

            },
            // isNo????
            no(){

            }
        },
    }
</script>

<style scoped>

</style>
