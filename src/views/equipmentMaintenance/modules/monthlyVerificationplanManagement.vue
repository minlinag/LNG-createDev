<template>
    <Breadcrumb>
        <template slot="appMain">
        <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
            <a-row :gutter="24">
                <a-col>
                    <a-form-model-item label="月度计划编码">
                        <a-select ref="select" v-model="value1" style="width: 150px" @change="handleChange">
                            <a-select-option value="jack">Jack</a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>
            </a-row>
            <div>
                <a-button class="buttonType" type="primary" @click="application">
                    批量检定申请
                </a-button>
                <a-button class="buttonType" :style="{ marginLeft: '8px' }" type="primary" @click="ret">
                    返回
                </a-button>
            </div>
        </a-form-model>
        <dc-table :scroll="{ x: 100 }" :columns="columns" :dataSource="dataSource" :openSelector="false">
            <template slot="operation">
                <a-button class="buttonType" type="primary" @click="onSubmit">
                    查看明细
                </a-button>
            </template>
        </dc-table>
        <!-- <a-form>
            <FormitemDemo v-for="(item, index) in Config" :itemConfig="item" :config="Config" :key="index"></FormitemDemo>
        </a-form> -->
        <dc-Model v-model="visible" :modelConfig="modelConfig">
            <FormitemDemo :Config="Config"></FormitemDemo>
        </dc-Model>
        </template>
    </Breadcrumb>
</template>
<script>
// import dcTable from '@/components/table'
// import FormitemDemo from '@/components/FormitemDemo.vue'
export default {
    data() {
        return {
            form: {},
            visible: false,
            modelConfig: {
                width: "950px",
                title: "申请单",
                cancelText: false,
                footer: "", //是否展示页脚
            },
            Config: {
                otherConfigurations: [
                    {
                        type: "btn",
                        label: "提交",
                        btnType: "primary", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        emit: "save", //传值内容 拿到当前所有数据包装好的
                    },
                    {
                        type: "btn",
                        label: "返回",
                        btnType: "", //button按钮 （根据 vue-ant-design 按钮格式进行操作）
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        emit: "cancel", //传值内容 拿到当前所有数据包装好的
                    },
                ],
                formDataList: [
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "记录状态", //展示名称
                        formKey: "professionalName", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "通知单编号", //展示名称
                        formKey: "professionalCoding", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "设备名称", //展示名称
                        formKey: "describeInformation", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "设备位号", //展示名称
                        formKey: "Sort", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "设备编码", //展示名称
                        formKey: "Sort", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "select", //组件类型 目前指出 input || select
                        label: "紧急程度", //展示名称
                        formKey: "describeInformation", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        selectInputStyle: { width: '180px' },
                        options: {
                            // 暂时开发状态
                            // multiple: true,
                        },
                        optionData: [
                            {
                                label: "紧急",
                                value: 0
                            },
                            {
                                label: "一般",
                                value: 1
                            }
                        ]
                    },
                    {
                        type: "select", //组件类型 目前指出 input || select
                        label: "是否具备检维修条件", //展示名称
                        formKey: "Sort", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        // placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        selectInputStyle: { width: '180px' },
                        options: {
                            // 暂时开发状态
                            // multiple: true,
                            // vDecorator:{ required: true, message: 'Please input Activity name', trigger: 'blur' }, //校验规则   框前加*
                        },
                        optionData: [
                            {
                                label: "是",
                                value: 0
                            },
                            {
                                label: "否",
                                value: 1
                            }
                        ]
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "作业区域", //展示名称
                        formKey: "Sort", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "内容描述", //展示名称
                        formKey: "describeInformation", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "申请人", //展示名称
                        formKey: "Sort", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "申请时间", //展示名称
                        formKey: "Sort", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "通知单签收人", //展示名称
                        formKey: "describeInformation", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "签收时间", //展示名称
                        formKey: "Sort", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                    {
                        type: "input", //组件类型 目前指出 input || select
                        label: "检维修计划反馈", //展示名称
                        formKey: "Sort", //form 定义的 key (必须唯一 || 必须传入)
                        value: "", // 默认值为空字符串 // v-model 绑定值
                        placeholder: "请输入", //输入框为空值的时候展示内容
                        disabled: false, //是否禁用 true 是禁用 默认是false
                        labelStyle: { style: { width: "200px" } }, //组件样式 form-item
                        options: {
                            // 暂时开发状态
                            multiple: true,
                        },
                    },
                ],
            },
            value1: '',
            columns: [
                {
                    title: '序号',
                    customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.pageSize + index + 1
                        }`,
                    width: 50,
                },
                {
                    title: '设备名称',
                    dataIndex: 'equipmentName',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentSequence' },
                },
                {
                    title: '设备编号',
                    dataIndex: 'equipmentCategoray',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '位号',
                    dataIndex: 'equipmentCateg2ory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '作业位置',
                    dataIndex: 'equipmentSequence',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentSequence' },
                },
                {
                    title: '规格型号',
                    dataIndex: 'equipmentCate3gory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '参数',
                    dataIndex: 'equipmentCat4egory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '投用日期',
                    dataIndex: 'equipment5Category',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '检定周期',
                    dataIndex: 'equipmentCat6egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '上次检定时间',
                    dataIndex: 'equipmentCateg2ory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '下次检定时间',
                    dataIndex: 'equipmentSequence',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentSequence' },
                },
                {
                    title: '检定状态',
                    dataIndex: 'equipmentCate3gory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '检定证书',
                    dataIndex: 'equipmentCat4egory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '检定结果',
                    dataIndex: 'equipment5Category',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '关联申请单',
                    dataIndex: 'equipmentCat6egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
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
                path: '/addMonthlyVerificationplan',

            })
        },
        search() {

        },
        handleReset() {

        },
        application() {
            this.visible = true;
        },
        ret() {
            this.$router.go(-1);
        }
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