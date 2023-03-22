<template>
    <Breadcrumb>
        <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
            <a-row :gutter="24">
                <a-col>
                    <a-form-model-item label="计划年度:">
                        <a-select ref="select" v-model="value1" style="width: 150px" @change="handleChange">
                            <a-select-option value="jack">Jack</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button v-Query class="buttonType" type="primary" @click="search">
                            查询
                        </a-button>
                        <a-button class="buttonType" @click="resetForm">
                            重置
                        </a-button>
                        <a-button v-Add class="buttonType" :style="{ marginLeft: '8px' }" type="primary"
                            @click="addYear">
                            新增
                        </a-button>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        <dc-table :scroll="{ x: 100 }" :columns="columns" :dataSource="dataSource" :openSelector="false">
            <template slot="operation">
                <a-button class="buttonType" type="primary" @click="onSubmit">
                    查看
                </a-button>
            </template>

        </dc-table>
        <!-- <a-form>
            <FormitemDemo v-for="(item, index) in Config" :itemConfig="item" :config="Config" :key="index"></FormitemDemo>
        </a-form> -->
    </Breadcrumb>
</template>
<script>
// import dcTable from '@/components/table'
import FormitemDemo from '@/components/FormitemDemo.vue'
export default {
    components: { FormitemDemo },
    data() {
        return {
            value1: '',
            // Config: [{
            //     type: 'select', //组件
            //     label: '活动名称', //组件名称
            //     formKey: 'name', //用于控制吟唱显示需要配合  options:{vIf:[]}
            //     value: '', // 默认值为空字符串 (双向绑定数据源)
            //     options: { // 各种配置
            //         multiple: true,
            //         // vIf: [
            //         //     // 表示：当 form.area === 'area1'，才显示
            //         //     { relationKey: 'area', value: 'area1' }
            //         // ]
            //     },
            //     optionData:[
            //         { label: '区域1', value: 'area1' },
            //         { label: '区域2', value: 'area2' }
            //     ]
            // }],
            columns: [
                {
                    title: '序号',
                    customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.pageSize + index + 1
                        }`,
                    width: 50,
                },
                {
                    title: '记录状态',
                    dataIndex: 'equipmentSequence',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentSequence' },
                },
                {
                    title: '计划编号',
                    dataIndex: 'equipmentCategoray',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '计划年度',
                    dataIndex: 'equipmentCateg2ory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '创建人',
                    dataIndex: 'equipmentCate3gory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '创建日期',
                    dataIndex: 'equipmentCat4egory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '最后编辑人',
                    dataIndex: 'equipment5Category',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '最后编辑日期',
                    dataIndex: 'equipmentCat6egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '操作',
                    width: 100,
                    scopedSlots: { customRender: 'operation' },
                },
            ],
            dataSource: [
                {
                    key: '1',
                    equipmentName: 1
                }
            ],
            form: {
                name: '',
                region: undefined,
                date1: undefined,
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            },
        }
    },
    mounted() { },
    methods: {
        handleChange() {

        },
        onSubmit() {

        },
        addYear() {
            this.$router.push({
                path: '/addequipmentMaintenance',

            })
        },
        search() {

        },
        handleReset() {

        },
        //重置输入
        resetForm() {
            this.form = {}
        },
    }
}
</script>
<style scoped lang="less">
/deep/.ant-checkbox-wrapper+.ant-checkbox-wrapper {
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
    justify-content: space-between
}

.equipmentSelection {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-left: -17px;
    margin-top: 10px;
}

/deep/.equipmentDisplay-checkbox {
    margin-top: 10px;
}
</style>