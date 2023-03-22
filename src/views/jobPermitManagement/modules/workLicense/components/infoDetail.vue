<template>
    <div v-if="dataForm"class="workLicense-info-detail">
        <!-- <component :is="taskCom()" :taskForm="taskForm"></component> -->
        <workLicenseDeteil v-if="dataForm.baseInfo.operationTypeName=='一般作业'" :taskForm="dataForm"/>
        <highWork  v-if="dataForm.baseInfo.operationTypeName=='高处作业'" :taskForm="dataForm"/>
        <turnoffWork  v-if="dataForm.baseInfo.operationTypeName=='断路作业'" :taskForm="dataForm"/>
        <safetyAnalysis  v-if="dataForm.baseInfo.operationTypeName=='安全检查'" :taskForm="dataForm"/>
        <fireWork  v-if="dataForm.baseInfo.operationTypeName=='动火作业'" :taskForm="dataForm"/>
        <restrictedSpace  v-if="dataForm.baseInfo.operationTypeName=='受限空间作业'" :taskForm="dataForm"/>
        <craneWork  v-if="dataForm.baseInfo.operationTypeName=='吊装作业'" :taskForm="dataForm"/>
        <temporaryPower v-if="dataForm.baseInfo.operationTypeName=='临时用电作业'" :taskForm="dataForm"/>
        <breakGround  v-if="dataForm.baseInfo.operationTypeName=='动土作业'" :taskForm="dataForm"/>
        <blindPlate v-if="dataForm.baseInfo.operationTypeName=='盲板抽堵作业'" :taskForm="dataForm"/>
        <pipelineOpening v-if="dataForm.baseInfo.operationTypeName=='管线打开作业'" :taskForm="dataForm"/>
        <safetyChecklist v-if="dataForm.baseInfo.operationTypeName=='安全检查'" :taskForm="dataForm"/>
    </div>
</template>

<script>
    /***-->
     <!--*作业许可票（证）打印组件-->
     <!--**/
    import workLicenseDeteil from './workLicenseDeteil.vue' // 一般作业许可证
    import highWork from './highWork.vue' //高处作业许可票（证）
    import turnoffWork from './turnoffWork.vue' // 断路作业许可证
    import safetyAnalysis from './safetyAnalysis.vue' // 工作前安全分析（JSA）表
    import fireWork from './fireWork.vue'  // 动火作业许可证
    import restrictedSpace from './restrictedSpace.vue'  // 受限空间作业许可证
    import craneWork from './craneWork.vue'  // 吊装作业许可证
    import temporaryPower from './temporaryPower.vue'  // 临时用电许可证
    import breakGround from './breakGround.vue'  // 动土作业许可证
    import blindPlate from './blindPlate.vue'  // 盲板抽堵作业许可证
    import pipelineOpening from './pipelineOpening.vue'  // 管线打开作业许可证
    import safetyChecklist from './safetyChecklist.vue'  // 安全检查表
    import { getCheckBox } from '@/api/workLicense'
    //import someComponent from './someComponent'
    export default {
        components: {
            workLicenseDeteil,
            highWork,
            turnoffWork,
            safetyAnalysis,
            fireWork,
            restrictedSpace,
            craneWork,
            temporaryPower,
            breakGround,
            blindPlate,
            pipelineOpening,
            safetyChecklist,
        },
        props: {
            dataForm:{
                type: Object,
                default: () => {
                    return null
                },
            }
        },
        data() {
            return {
            }
        },
        watch:{
            dataForm:{
                handler:function(cur,old){

                },
                deep:true,	//对象内部的属性监听，也叫深度监听
            },
        },
        created() {
            console.log(this.dataForm)
        },
        methods: {

        }

    }
</script>
<style lang="less">
    .workLicense-info-detail{
        @media print {
            html
            {
                zoom: 80% !important;
            }
        }
    }

</style>
