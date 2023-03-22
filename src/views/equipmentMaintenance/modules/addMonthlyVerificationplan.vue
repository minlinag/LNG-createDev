<template>
    <Breadcrumb>
        <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
            <a-row :gutter="24">
                <a-col>
                    <a-form-model-item label="月度计划编码:">
                        <a-input ref="select" v-model="form.year" style="width: 150px" :disabled="true"></a-input>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button class="buttonType" type="primary">
                            导入
                        </a-button>
                        <a-button v-Add class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                            新增
                        </a-button>
                        <a-button v-Edit class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                            编辑
                        </a-button>
                        <a-button v-Delete class="buttonType" :style="{ marginLeft: '8px' }" type="danger">
                            删除
                        </a-button>
                        <a-button class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                            提交
                        </a-button>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        <dc-table :scroll="{ x: 100, y: 300 }" :columns="columns" :dataSource="dataSource" :openSelector="false">

        </dc-table>
    </Breadcrumb>
</template>
<script>
export default {
    data() {
        return {
            form: {
                year: ''
            },
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
                    dataIndex: 'equipmentName3',
                    width: 100,
                },
                {
                    title: '责任人',
                    dataIndex: 'equipmentName111',
                    width: 100,
                },
                {
                    title: '维护/检修内容描述',
                    dataIndex: 'equipme1ntName3',
                    width: 100,
                },
                {
                    title: '维护/检修周期',
                    dataIndex: 'equipment3Name3',
                    width: 100,
                },
                {
                    title: '计划维修时长',
                    dataIndex: 'equipment1Name4',
                    width: 100,
                },
                {
                    title: '计划检修月份',
                    dataIndex: 'equipmentName5',
                    width: 100,
                },
                {
                    title: '调整后的实施时间',
                    dataIndex: 'equipmentNamerr5',
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
                    dataIndex: 'equcipmentName10',
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
                    title: '完成进度',
                    dataIndex: 'equipmentNamae15',
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
    }
}
</script>
<style scoped>
</style>
