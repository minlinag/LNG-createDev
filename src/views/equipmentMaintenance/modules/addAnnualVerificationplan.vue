<template>
    <Breadcrumb>
        <div>
            <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
                <a-row :gutter="24">
                    <a-col>
                        <a-form-model-item label="年度计划编cc码:">
                            <a-input ref="select" v-model="form.year" style="width: 150px" :disabled="true"></a-input>
                        </a-form-model-item>
                        <a-form-model-item>
                            <a-button class="buttonType" type="primary">
                                导入
                            </a-button>
                            <a-button class="buttonType" type="primary">
                                导出
                            </a-button>
                            <a-button v-Delete class="buttonType" :style="{ marginLeft: '8px' }" type="danger">
                                删除
                            </a-button>
                            <a-button class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                                保存
                            </a-button>
                            <a-button class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                                返回
                            </a-button>
                            <a-button class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                                提交
                            </a-button>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
            <dc-table :scroll="{ x: 100 }" :columns="columns" :dataSource="dataSource" :openSelector="false">
            </dc-table>

        </div>
    </Breadcrumb>
</template>
<script>
export default {
    data() {
        return {
            dataSource: [],
            form: {
                year: ''
            },
            Config: {
                otherConfigurations: [
                    {
                        type: 'otherTypes', //组件类型 目前指出 input || select || 其他类型 || 按钮类型
                        label: '设备名称', //展示名称
                        slotScoped: 'table', //插槽
                    },
                    {
                        type: 'btn',
                        label: '保存',
                        btnType: 'primary',  //button按钮 （根据 vue-ant-design 按钮格式进行操作）
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        emit: 'save' //传值内容 拿到当前所有数据包装好的
                    },
                    {
                        type: 'btn',
                        label: '取消',
                        btnType: 'Delate',  //button按钮 （根据 vue-ant-design 按钮格式进行操作）
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        emit: 'cancel' //传值内容 拿到当前所有数据包装好的
                    }
                ],
                formDataList: [
                    {
                        type: 'input', //组件类型 目前指出 input || select 
                        label: '设备名称', //展示名称
                        formKey: 'name', //form 定义的 key (必须唯一 || 必须传入)
                        value: '', // 默认值为空字符串 // v-model 绑定值
                        placeholder: '请输入', //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: '100px' } }, //组件样式 form-item
                        options: { // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: 'input',
                        label: '设备代码',
                        placeholder: '自动带出',
                        formKey: 'area',
                        value: '',
                        labelStyle: { style: { width: '100px' } },
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'input',
                        label: '作业区域',
                        placeholder: '自动带出',
                        labelStyle: { style: { width: '100px' } },
                        formKey: 'area',
                        value: '',
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'input',
                        label: '计划维修时长',
                        placeholder: '请输入     （天）',
                        labelStyle: { style: { width: '100px' } },
                        formKey: 'area',
                        value: '',
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'select',
                        label: '计划维修月份',
                        placeholder: '请选择',
                        labelStyle: { style: { width: '100px' } },
                        selectStyle: {
                            width: '183px'
                        },
                        formKey: 'area',
                        value: undefined,
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'select',
                        label: '专业',
                        placeholder: '请选择',
                        labelStyle: { style: { width: '100px' } },
                        selectStyle: {
                            width: '183px'
                        },
                        formKey: 'area',
                        value: undefined,
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'select',
                        label: '作业类型',
                        placeholder: '请选择',
                        labelStyle: { style: { width: '100px' } },
                        selectStyle: {
                            width: '183px'
                        },
                        formKey: 'area',
                        value: undefined,
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'select',
                        label: '作业项目',
                        placeholder: '请选择',
                        labelStyle: { style: { width: '100px' } },
                        selectStyle: {
                            width: '183px'
                        },
                        formKey: 'area',
                        value: undefined,
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'input',
                        label: '安全控制措施',
                        placeholder: '请输入',
                        labelStyle: { style: { width: '100px' } },
                        formKey: 'area',
                        value: undefined,
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'select',
                        placeholder: '请选择',
                        label: '是否影响生产',
                        labelStyle: { style: { width: '100px' } },
                        selectStyle: {
                            width: '183px'
                        },
                        formKey: 'area',
                        value: undefined,
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'select',
                        label: '维修单位名称',
                        placeholder: '请选择',
                        labelStyle: { style: { width: '100px' } },
                        selectStyle: {
                            width: '183px'
                        },
                        formKey: 'area',
                        value: undefined,
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'input',
                        label: '需工艺条件',
                        placeholder: '请输入',
                        labelStyle: { style: { width: '100px' } },
                        formKey: 'area',
                        value: undefined,
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'input',
                        label: '计划费用',
                        placeholder: '请输入',
                        labelStyle: { style: { width: '100px' } },
                        formKey: 'area',
                        value: '',
                        options: {
                            multiple: true,
                        },
                    },
                    {
                        type: 'button',
                        options: [
                            { type: '', }
                        ]
                    }
                ],
            },
            visible: false,
            columns: [
                {
                    title: '序号',
                    customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.pageSize + index + 1
                        }`,
                    width: 50,
                },
                {
                    title: '设备名称',
                    dataIndex: 'equipmentName1',
                    width: 100,
                },
                {
                    title: '所属区域',
                    dataIndex: 'equipmentName2',
                    width: 100,
                },
                {
                    title: '设备位号',
                    dataIndex: 'equipmentName2',
                    width: 100,
                },
                {
                    title: '责任人',
                    dataIndex: 'equipmentName2',
                    width: 100,
                },
                {
                    title: '维护/检修内容描述',
                    dataIndex: 'equipmentName3',
                    width: 100,
                },
                {
                    title: '维护/检修周期',
                    dataIndex: 'equipmentName3',
                    width: 100,
                },
                {
                    title: '计划维修时长',
                    dataIndex: 'equipmentName4',
                    width: 100,
                },
                {
                    title: '计划检修月份',
                    dataIndex: 'equipmentName5',
                    width: 100,
                },
                {
                    title: '专业',
                    dataIndex: 'equipmentName6',
                    width: 100,
                },
                {
                    title: '作业类型',
                    dataIndex: 'equipmentName7',
                    width: 100,
                },
                {
                    title: '作业内容',
                    dataIndex: 'equipmentName8',
                    width: 100,
                },
                {
                    title: '所需备品备件清单',
                    dataIndex: 'equipmentName9',
                    width: 100,
                },
                {
                    title: '是否影响外输或接卸船',
                    dataIndex: 'equipmentName10',
                    width: 100,
                },
                {
                    title: '所需工艺条件',
                    dataIndex: 'equipmentName10',
                    width: 100,
                },
                {
                    title: '维修单位名称',
                    dataIndex: 'equipmentName11',
                    width: 100,
                },
                {
                    title: '计划费用（元）',
                    dataIndex: 'equipmentName15',
                    width: 100,
                },
                {
                    title: '备注',
                    dataIndex: 'equipmentName113',
                    width: 100,
                },
            ],
            dataSource: []
        }
    },
    methods: {
        cancel() {
            this.visible = false
        },
        save(item) {
            // console.log(item,12312312)
            this.visible = false
        },
        addRecord() {
            this.visible = true
            console.log(this.visible, 123123)
        },
    }
}
</script>
<style scoped>
.ant-advanced-search-form {
    padding: 24px;
    background: #fbfbfb;
}

.ant-advanced-search-form .ant-form-item {
    display: flex;
}
</style>