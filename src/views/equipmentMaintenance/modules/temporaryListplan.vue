<template>
    <Breadcrumb>
        <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
            <a-row :gutter="24">

            </a-row>
        </a-form-model>
        <dc-table :scroll="{ x: 100 }" :columns="columns" :dataSource="dataSource" :openSelector="false">
            <template slot="operation">
                <!-- <span class="look" @click="onSubmit">
                    查看
                </span>
                <span class="look" @click="onSubmit">
                    编辑
                </span>
                <span class="look" @click="onSubmit">
                    派工
                </span> -->
            </template>
        </dc-table>
        <a-form>
            <FormitemDemo v-for="(item, index) in Config" :itemConfig="item" :key="index">
            </FormitemDemo>
        </a-form>
        <a-modal title="Title" :visible="visible" @ok="handleOk" @cancel="handleCancel">
            <p>{{ ModalText }}</p>
        </a-modal>
    </Breadcrumb>
</template>
<script>
// import dcTable from '@/components/table'
import FormitemDemo from '@/components/FormitemDemo.vue'
export default {
    components: { FormitemDemo },
    data() {
        return {
            ModalText: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
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
            //     optionData: [
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
                    title: '序号',
                    dataIndex: 'equipmentName',
                    width: 50,
                    scopedSlots: { customRender: 'equipmentSequence' },
                },
                {
                    title: ' 计划编号 ',
                    dataIndex: 'equipmentSequence',
                    width: 120,
                    scopedSlots: { customRender: 'equipmentSequence' },
                },
                {
                    title: '通知单编号',
                    dataIndex: 'equipmentCategory',
                    width: 120,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: ' 设备名称',
                    dataIndex: 'equipmentCategor1y',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '设备编码',
                    dataIndex: 'equipmentCateg2ory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '设备位号',
                    dataIndex: 'equipmentCat3egory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '所属区域 ',
                    dataIndex: 'equipmentCateg4ory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '故障描述',
                    dataIndex: 'equipmentCat5egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '是否具备检维修条件 ',
                    dataIndex: 'equipmentCateg4ory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '申请人',
                    dataIndex: 'equipmentCat5egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: ' 审核人',
                    dataIndex: 'equipmentCat5egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '申请日期',
                    dataIndex: 'equipmentCat5egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: ' 检维修计划反馈',
                    dataIndex: 'equipmentCat5egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
            ],
            visible: false,

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
        select() { },
        handleChange() {

        },
        onSubmit() {

        },
        handleReset() {

        },
        showAlert() {
            this.visible = true
        },
        handleCancel() {
            this.visible = false;
        },
        handleOk() {

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
