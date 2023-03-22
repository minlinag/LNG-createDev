<template>
    <Breadcrumb>
        <a-form-model v-model="form" :layout="'inline'">
            <!-- <a-row :gutter="24"> -->
            <a-col :span="6">
                <a-form-model-item :labelCol="{ style: 'width: 150px' }" label="计划年份:">
                    <a-select ref="select" v-model="value1">
                        <a-select-option value="YYear"> a</a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-col>
            <a-col :span="6">
                <a-form-model-item :labelCol="{ style: 'width: 150px' }" label="计划月份:">
                    <a-select ref="select" v-model="value1">
                        <a-select-option value="MMonth"> a</a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-col>
            <!-- </a-row> -->
        </a-form-model>
        <div class="Myserch">
            <a-button @click.stop="" class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                查询
            </a-button>
            <a-button class="buttonType" @click="resetForm">
                重置
            </a-button>
        </div>
        <a-collapse :defaultActiveKey="['1']">
            <a-collapse-panel key="1" header="月度润滑列表">
                <!-- <template > -->
                <div slot="extra">
                    <a-button @click.stop="showAlert" class="buttonType" :style="{ marginLeft: '8px' }" type="primary">
                        生成
                    </a-button>
                </div>
                <dc-table :scroll="{ x: 100 }" :columns="columns" :dataSource="dataSource" :openSelector="false">
                    <template slot="operation">
                        <span v-Edit style="color: #2440b3;cursor: pointer;" @click="onSubmit(row)">
                            查看
                        </span>
                        <span v-Edit style="color: #2440b3;cursor: pointer;" @click="onSubmit(row)">
                            编辑
                        </span>
                    </template>
                </dc-table>
            </a-collapse-panel>
        </a-collapse>
        <dc-Model v-model="visible" :modelConfig="modelConfig">
            <FormitemDemo></FormitemDemo>
        </dc-Model>

        <!-- <a-form>
            <FormitemDemo v-for="(item, index) in Config" :itemConfig="item" :config="Config" :key="index">
            </FormitemDemo>
        </a-form>
        <a-modal title="Title" :visible="visible" @ok="handleOk" @cancel="handleCancel">
            <p>{{ ModalText }}</p>
        </a-modal> -->
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
            columns: [
                {
                    title: '序号',
                    customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.pageSize + index + 1
                        }`,
                    width: 50,
                },
                {
                    title: '计划编号',
                    dataIndex: 'equipmentSequence',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentSequence' },
                },
                {
                    title: '计划年度',
                    dataIndex: 'equipmentCategory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '计划月度',
                    dataIndex: 'equipmentCategor1y',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '创建人',
                    dataIndex: 'equipmentCateg2ory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '创建日期',
                    dataIndex: 'equipmentCat3egory',
                    width: 100,
                    slots: { title: 'equipmentCategory' },//表头插槽
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '最后编辑人',
                    dataIndex: 'equipmentCateg4ory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '最后编辑日期',
                    dataIndex: 'equipmentCat5egory',
                    width: 100,
                    scopedSlots: { customRender: 'equipmentCategory' },
                },
                {
                    title: '操作',
                    width: 100,
                    scopedSlots: { customRender: 'operation' },
                },
            ],
            visible: false,
            visible: false,
            modelConfig: {
                width: "950px",
                title: "专业库",
                cancelText: false,
                footer: "", //是否展示页脚
            },
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
            this.$router.push({
                path: '/addMonthequipmentMaintenance',
            })
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
            this.$router.push({
                path: '/addMonthLubricationplan',
            })
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

.Myserch {
    display: flex;
    justify-content: end;
}
</style>