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
                  selectedRowKeys: spartPartDataSourceKeyCheke,
                  onChange: spartPartDataSourceChange,
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
        <div class="ant-modal-footer" style="text-align: center">
            <a-button type="primary" @click="ok"> 确定</a-button>
            <a-button @click="no">取消</a-button>
        </div>
    </div>
</template>

<script>
    import { getListForSparepart ,selectByIds} from "@/api/sparesprt";
    export default {
        name: "",
        data() {
            return {
                spartPartDataSourceKeyCheke:[],
                // 表格数据存储
                // 备品备件
                columnsModel: [
                    {
                        title: "序号",
                        customRender: (text, record, index) =>
                            `${(this.paginationSparepart.current - 1) *
                            this.paginationSparepart.pageSize +
                            index +
                            1
                                }`,
                        width: 50,
                    },
                    {
                        title: "备件名称",
                        dataIndex: "sparePartName",
                        width: 100,
                        slectBollen: true,
                    },
                    {
                        title: "物资编码",
                        dataIndex: "materialCode",
                        width: 100,
                        slectBollen: true,
                    },
                    {
                        title: "规格/材质",
                        dataIndex: "specificationOrMaterial",
                        width: 100,
                        slectBollen: true,
                    },
                    {
                        title: "数量",
                        dataIndex: "planCostCount",
                        width: 100,
                        slectBollen: true,
                    },
                    {
                        title: "单位",
                        dataIndex: "unit",
                        width: 150,
                    },
                ],
                //存储选中的数据
                spartPartDataSource: [],
                //form表单提交数据
                selectFrom:{
                    pageNum:1,
                    pageSize:10
                },
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
        props: {
            spartPartDataSourceKey: {
            },
        },
        watch:{
            spartPartDataSourceKey(){},
        },
        component: {
            //someComponent
        },
        created(){

            this.spartPartDataSourceKeyCheke=this.spartPartDataSourceKey;
            this.getSpareparts();
        },
        methods:{
            //分页点击事件
            paginationChangeSparepart(pagination){
                this.selectFrom.pageNum = pagination.current
                this.selectFrom.pageSize = pagination.pageSize
                this.getSpareparts()

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
                // selectByIds(this.spartPartDataSourceKeyCheke).then(res=>{
                //     if(res.code=='200'){
                //         console.log(res.body)
                //         this.$emit('spaerClick',res.body)
                //     }
                // })
                //
                // this.$emit('spaerClick',res.body)
                this.$emit('spaerClick',this.spartPartDataSourceKeyCheke)
            },

            // isNo????
            no(){

            },
            // 多选框点击事件
            spartPartDataSourceChange(selectedRowKeys) {
                this.spartPartDataSourceKeyCheke = selectedRowKeys;
            },
            //筛选条件查询点击
            select() {
                this.selectFrom.pageNum = 1;
                this.selectFrom.pageSize = 10;
                this.getSpareparts();
            },
            //重置输入
            resetForm() {
                this.selectFrom = {
                    deviceName: "",
                    deviceType: "",
                    materialCode: "",
                    sparePartName: "",
                    pageNum: 1,
                    pageSize: 10,
                };
                this.getSpareparts();
            },
        },
    }
</script>

<style scoped>

</style>
