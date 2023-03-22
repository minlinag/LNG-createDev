/** * app */
<template>
  <a-spin
    :spinning="this.$store.state.spin.spinning"
    :delay="100"
    size="large"
    :wrapperClassName="'layout_content_spin'"
  >
    <a-config-provider :locale="zh_CN">
      <div id="app">
        <router-view />
      </div>
    </a-config-provider>
  </a-spin>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'app',
  data() {
    return {
      zh_CN,
    }
  },
  // 创建完毕状态
  created() {
    // 默认中文
  },
  watch:{
    $route: {
      immediate: true,
      handler() {
        document.title = this.$route.meta.approvalTitle || '管理云平台'
      },
    },
  },
  // 挂载结束状态
  mounted() {
    console.log(this.$route)
  },
  methods: {},
}
</script>
<style>
/* 导入ArcGIS的样式 */
/* @import './assets/esri/css/main.css'; */
</style>
<style scoped>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 16px;
}
.layout_content_spin > div > .ant-spin {
}
</style>
