<template>
    <div>
        <a-form-model class="ant-form-inFo" v-model="form" :layout="'inline'">
            <a-row :gutter="24">
                <a-col>
                    <a-form-model-item label="月度计划编码:">
                        <a-input ref="select" v-model="form.year" style="width: 150px" :disabled="true"></a-input>
                    </a-form-model-item>
                    {{ dateTime }}设备润滑计划

                    <a-form-model-item>
                        <a-button class="buttonType" type="primary">
                            导入月度计划
                        </a-button>
                        <a-button v-Add class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                            新增记录
                        </a-button>
                        <a-button v-Edit class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                            编辑
                        </a-button>
                        <a-button v-Delete class="buttonType" :style="{ marginLeft: '8px' }" type="danger">
                            删除
                        </a-button>
                        <a-button class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                            保存
                        </a-button>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        <dc-table :scroll="{ x: 100 }" :columns="columns" :dataSource="dataSource" :openSelector="false"></dc-table>
    </div>
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
                    dataIndex: 'equipmentName2',
                    width: 100,
                },
                {
                    title: '设备编号',
                    dataIndex: 'equipmentNamed2',
                    width: 100,
                },
                {
                    title: '使用位置',
                    dataIndex: 'equipmentName3',
                    width: 100,
                },
                {
                    title: '润滑对象名称',
                    dataIndex: 'equipmentName4',
                    width: 100,
                },
                {
                    title: '润滑周期',
                    dataIndex: 'equipmentName6',
                    width: 100,
                },
                {
                    title: '上次润滑时间',
                    dataIndex: 'equipmentName8',
                    width: 100,
                },
                {
                    title: '上次润滑品牌',
                    dataIndex: 'equipmentName9',
                    width: 100,
                },
                {
                    title: '下次润滑时间',
                    dataIndex: 'equipmentName11',
                    width: 100,
                },
                {
                    title: '下次润滑品牌',
                    dataIndex: 'equipmentName12',
                    width: 100,
                },
                {
                    title: '备  注',
                    dataIndex: 'equipmentName13',
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
