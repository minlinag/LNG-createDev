<template>
    <div class="check-content">
        <div v-if="checkBoxType=='radio'">
            <label v-for="(item,index) in checkBoxOptions"
                   :key="index">
                <input type="radio"
                       :checked="listCheck(item,checkBoxList)"
                       :name="checkBoxName">
                <span>{{item}}</span>
            </label>
        </div>
        <label v-else v-for="(item, index) in checkBoxOptions" :key="index">
            <input :checked="listCheck(item.value,checkBoxList)" @change="inputChange" type="checkbox">
            <span>{{item.label}}</span>
        </label>
        <div class="zhezhao">

        </div>
    </div>
</template>

<script>
    //import someComponent from './someComponent'
    export default {
        name: "",
        data() {
            return {
                msg: "Hello Vue.js"
            }
        },
        props:{
            checkBoxType:{
                type:String,
                default:()=>{
                    return 'checkbox'
                }
            },
            checkBoxOptions: {
                type: Array,
                default: () => {
                    return {}
                },
            },
            checkBoxName:{
                type:String,
                default:()=>{
                    return 'checkBoxName'
                }
            },
            checkBoxList:{
                type: Array,
                default: () => {
                    return []
                },
            }
        },
        component: {
            //someComponent
        },
        methods: {
            listCheck(val,select){
                var item=false;
                for(var i=0;i<select.length;i++){
                    if(select[i]==val){
                        item=true;
                    }
                }
                return item;
            },
            inputChange(val){
                return false
            }
        },
        created(){
            console.log(this.checkBoxOptions)
            console.log(this.checkBoxList)
        },
    }
</script>

<style scoped>
    .check-content{
        position: relative;
    }
    .zhezhao{
        position: absolute;
        z-index: 100;
        width: 100%;
        height: 100%;
        /*background-color: red;*/
        top: 0;
        left: 0;
    }
    label {
        color: #000;
        display: inline-block;
        position: relative;
    }
    span {
        padding: 0 3px;
        margin-left: 14px;
    }
    input {
        position: absolute;
        top: 3px;
    }
    input:disabled {
        border: 1px solid #DDD;
        background-color: red;
        color: #000;
    }
</style>
