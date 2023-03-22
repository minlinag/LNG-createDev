<template>
    <div id="basegalleryDiv" @mouseover="overhandle()" @mouseleave="leaveHandle()">
        <div id="slgalleryDiv" class="slgallery"   style="float:left;margin-top:5px;margin-left:5px" @click="slgalleryClick()">
            <!-- <img
                    style="width: 88px; height: 62px;"
                    :src="require('@/assets/images/vector.png')"
                    fit="fill"/> -->
        </div>
        <div id="yxgalleryDiv"  class="yxgallery" style="float:left;margin-top:5px;margin-left:5px;display:none" @click="yxgalleryClick()">
            <!-- <img
                    style="width: 88px; height: 62px;"
                    :src="require('@/assets/images/satellite.jpg')"
                    fit="fill"/> -->
        </div>
    </div>
</template>
<script>
//    import $ from 'jquery'
    export default {
        name:'base-gallery',
        data() {
            return {
                // dtgalleryUrl: '../../assets/images/vector.png',
                // yxgalleryUrl: '../../assets/images/satellite.jpg',
                currentDiv: 'slgalleryDiv'
            }
        },
        methods: {
            overhandle(){
                let dom=document.getElementById("basegalleryDiv");
                dom.style.width="190px";
                document.getElementById("yxgalleryDiv").style.display="block";
                document.getElementById("slgalleryDiv").style.display="block";
            },
            leaveHandle(){
                let dom=document.getElementById("basegalleryDiv");
                dom.style.width="95px";
                document.getElementById("yxgalleryDiv").style.display="none";
                document.getElementById("slgalleryDiv").style.display="none";
                document.getElementById(this.currentDiv).style.display="block";
            },
            slgalleryClick(){
                let dom=document.getElementById("basegalleryDiv");
                dom.style.width="95px";
//                $(dom).animate({"width":"95px"},1000)
                document.getElementById("yxgalleryDiv").style.display="none";
                document.getElementById("slgalleryDiv").style.display="block";
                this.currentDiv='slgalleryDiv'
                this.$emit('basemap-change', '矢量')

//                this.map.basemap.baseLayers.forEach(item  =>{
//                    if(item.id=="天地图矢量"){
//                        item.visible=true;
//                    }
//                    if(item.id=="天地图影像"){
//                        item.visible=false;
//                    }
//                });
            },
            yxgalleryClick(){
                let dom=document.getElementById("basegalleryDiv");
                dom.style.width="95px";
//                $(dom).animate({"width":"95px"},1000)
                document.getElementById("slgalleryDiv").style.display="none";
                document.getElementById("yxgalleryDiv").style.display="block";
                this.currentDiv='yxgalleryDiv'
                this.$emit('basemap-change', '影像')
//                this.map.basemap.baseLayers.forEach(item  =>{
//                    if(item.id=="天地图影像"){
//                        item.visible=true;
//                    }
//                    if(item.id=="天地图矢量"){
//                        item.visible=false;
//                    }
//                });
            }
        }
    }
</script>
<style type="text/css" scoped>
    #basegalleryDiv{
        position: absolute;
        border:1px solid gray;
        /*right: 10px;*/
        left: 61px;
        height: 70px;
        width: 95px;
        z-index: 1;
        /*bottom:0px;*/
        top: 13px;
        box-shadow: inset 2px 2px 2px #21AFEE;
    }
    .slgallery:hover{
        border: 2px solid #CD9B1D;
        width: 88px;
        height: 62px
    }
    .yxgallery:hover{
        border: 2px solid #CD9B1D;
        width: 88px;
        height: 62px
    }
    /deep/ .el-image img {
        border-style: none;
        width: 100%;
        height: 100%;
    }

</style>