<!-- 机械设备台账右侧，查询导入模块 -->
<template>
    <Breadcrumb>
        <a-form-model v-model="form">
            <a-col :span="6">
                <a-form-model-item :labelCol="{ style: 'width: 50px' }" label="设备：">
                    <a-input v-model="form.name" />
                </a-form-model-item>
            </a-col>
            <a-col :span="6">
                <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="设备名称：">
                    <a-input v-model="form.name" />
                </a-form-model-item>
            </a-col>
            <a-col :span="6">
                <a-form-model-item :labelCol="{ style: 'width: 100px' }" label="设备型号：">
                    <a-input v-model="form.name" />
                </a-form-model-item>
            </a-col>
        </a-form-model>
        <div class="queryItem">
            <a-button class="buttonType" type="primary" @click="onSubmit">
                查询
            </a-button>
            <a-button class="buttonType" :style="{ marginLeft: '8px' }" @click="handleReset">
                重置
            </a-button>
        </div>
        <!-- 右侧展开框架 -->
        <a-collapse :defaultActiveKey="['1']">
            <a-collapse-panel key="1" header="设备备品备件列表">
                <!-- <template > -->
                <div slot="extra">
                    <a-button class="buttonType buttonStyle" type="primary" @click="onSubmit">
                        查询
                    </a-button>
                    <a-button class="buttonType buttonStyle" type="primary" @click="onSubmit">
                        EAM同步
                    </a-button>
                    <a-button class="buttonType buttonStyle" type="primary" @click="onSubmit">
                        模板
                    </a-button>
                    <a-button class="buttonType buttonStyle" type="primary" @click="onSubmit">
                        导入
                    </a-button>
                    <a-button class="buttonType buttonStyle" type="primary" @click="onSubmit">
                        导出
                    </a-button>
                    <a-button class="buttonType buttonStyle" type="primary" @click="onSubmit">
                        修改
                    </a-button>
                    <!-- <div class="equipmentSelection"> -->
                        <a-button type="primary" @click="showDrawer">展开</a-button>
                    <!-- </div> -->
                </div>
                <dc-table :scroll="{ x: 100 }" :columns="columns" :dataSource="dataSource" :openSelector="false">
                </dc-table>
            </a-collapse-panel>
        </a-collapse>
        <a-drawer title="选择展示的设备" placement="right" :closable="false" :visible="visible"
            :after-visible-change="afterVisibleChange" @close="onClose">
            <div class="equipmentDisplay">
                <div class="equipmentDisplay-checkbox" v-for="(item, index) in checkArray ">
                    <a-checkbox v-model="item.slectBollen" @change="onChange(item, index)" :key="index">
                        {{ item.title }}
                    </a-checkbox>
                </div>
            </div>
        </a-drawer>
    </Breadcrumb>
</template>
<script>
let columns = []
// import dcTable from '@/components/table'
let checkArray = JSON.parse(JSON.stringify(columns))
export default {
    // components: { dcTable },
    data() {
        return {
            visible: false,
            columns,
            checkArray,
            dataSource: [],
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
        onChange(item, index) {
            if (item.slectBollen) {
                this.columns.splice(index, 0, item)
            } else {
                this.columns.map((newItem, newIndex) => {
                    if (item.title == newItem.title) {
                        this.columns.splice(newIndex, 1)
                    }
                })

            }

            // this.columns.map((needArr,index)=>{
            //     if(item.title == needArr.title){

            //     }
            // })
            // let arr = this.columns.filter((needArr) => needArr.slectBollen == true && needArr.title == item.title )
            //     console.log(arr,123)
        },
        // getTitle(index){
        //    return this.columns[index].titleInerText
        // },
        afterVisibleChange(val) {
            console.log('visible', val);
        },
        // 展示右侧列表
        showDrawer() {
            this.visible = true;
            console.log(this.visible, 123123)
            // console.log(123123)
        },
        onClose() {
            this.visible = false;
            console.log(this.visible, 123)
        },
        // 查询事件
        onSubmit() {

        },
        //重制输入变为空
        handleReset() {

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
</style>