/**
* 欢迎界面
*/
<template >
  <div class="wel-con"></div>
  <!--<div class="wel-con" :class="FullScreen?'map-FullScreen':'map'"></div>-->
</template>
<script type="text/ecmascript-6">
// 导入全屏显示方法
import { fullscreenToggel } from "@/utils/util";
export default {
  name: "welcome",
  data(){
    return {

    }
  }
};
</script>
<style scoped>
</style>
