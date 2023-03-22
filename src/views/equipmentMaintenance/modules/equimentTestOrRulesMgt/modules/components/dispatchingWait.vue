<template>
    <a-form-model :model="form" :label-col="labelCol">
        <a-col :span="12">
            <a-form-model-item label="审批结果">
                <a-input v-model="form.recordStatusType" disabled/>
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="申请单编号" >
                <a-input v-model="form.applicationFormNo" disabled />
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="设备名称">
                <a-input v-model="form.eqmName"  disabled/>
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="设备位号">
                <a-input v-model="form.eqmNo"  disabled/>
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="所属设备" >
                <a-input v-model="form.belongToEqm" disabled/>
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="紧急程度">
                <a-input v-model="form.urgencyDegree" disabled />
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="检维修条件">
                <a-input v-model="form.whetherCanCheckMaintenance" disabled/>
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="内容描述">
                <a-input v-model="form.contentDescription" disabled/>
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="申请人">
                <a-input v-model="form.toDoUserName" disabled />
            </a-form-model-item>
        </a-col>
        <a-col :span="12">
            <a-form-model-item label="申请时间">
                <a-input v-model="form.d" disabled />
            </a-form-model-item>
        </a-col>
        <a-col :span="24">
            <a-form-model-item label="审批结果" :label-col="{ span: 3 }">
                <a-radio-group v-model="form.agreeOrDismiss">
                    <a-radio :value="1">
                        同意
                    </a-radio>
                    <a-radio :value="0">
                        驳回
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>
        </a-col>
        <a-col :span="24">
            <a-form-model-item label="部门领导意见" :label-col="{ span: 3 }">
                <a-input v-model="form.departmentComments" type="textarea" />
            </a-form-model-item>
        </a-col>
        <div class="footer">
            <a-button
                    type="primary"
                    @click="submitClick"
            >
                提交
            </a-button>
            <a-button @click="cancelClick">取消 </a-button>
        </div>
    </a-form-model>
</template>
<script>
    import { updataCondition } from "@/api/equimentTestOrRulesMgt/waitVerifiedApproval/waitVerifiedApproval";
    export default {
        props: {
            submitVisible: {
                type: Boolean,
                default: false,
            },
            typeModel: {
                type: String,
                default: "submitForm",
            },
            tableModel:{
                type:Object,
                default: false,
            }
        },
        width:{
            tableModel(val){
                this.form=val
            }
        },
        data() {
            return {
                labelCol: { span: 5 },
                form: {},
            };
        },
        methods: {
            funCol(val){
                switch (val){
                    case '1':
                        return '已保存'
                    case '2':
                        return '未审核'
                    case '3':
                        return '审批中'
                    case '4':
                        return '已审批'
                    case '5':
                        return '已拒绝'
                }
            },
            submitClick() {
                console.log(this.form)
                var dataForm={};
                dataForm.id=this.form.id
                dataForm.recordStatus=4
                dataForm.departmentComments=this.form.departmentComments
                dataForm.agreeOrDismiss=this.form.agreeOrDismiss
                updataCondition(dataForm).then(res=>{
                    console.log(res);
                })
            },
            cancelClick() {
                this.formClose();
            },
            formClose() {
                this.$emit("close");
            },
        },
        created(){

                if(this.tableModel){
                    this.form=this.tableModel
                    this.form.recordStatusType=this.funCol(this.form.recordStatus)
                    this.form.agreeOrDismiss=(this.form.agreeOrDismiss?this.form.agreeOrDismiss:1);
                }
        }
    };
</script>
