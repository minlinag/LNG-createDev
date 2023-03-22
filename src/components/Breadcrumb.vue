<template>
  <div class="wrapper">
    <a-row class="breadcrumb-box">
      <a-col :span="12" class="breadcrumb-box-content">
        <!-- <a-breadcrumb> -->
        <!-- <a-breadcrumb-item v-for="(item,index) in currentRoute"
                             :key="index"> -->
        <router-link :to="currentRoute.path">{{
          titleName ? titleName : currentRoute.name
        }}</router-link>
        <!-- </a-breadcrumb-item> -->
        <!-- </a-breadcrumb> -->
      </a-col>
      <a-col
        :span="12"
        style="
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        "
      >
        <slot name="breadcrumbButton"></slot>
      </a-col>
    </a-row>
    <div class="app_main" :style="{ background: background, padding: padding }">
      <slot name="appMain"> </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    titleName: {
      type: String,
      default() {
        return "";
      },
    },
    background: {
      type: String,
      default() {
        return "white";
      },
    },
    padding: {
      type: String,
      default() {
        return "11px 16px 16px 16px";
      },
    },
  },
  computed: {
    currentRoute() {
      let [routeEnd] = [...this.$route.matched].reverse();
      return routeEnd;
    },
  },

  mounted() { },
};
</script>
<style lang="less" scoped>
.wrapper {
  .breadcrumb-box {
    background: #ffffff;
    border-radius: 4px;
    border-radius: 4px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    .breadcrumb-box-content {
      padding-top: 16px;
      padding-bottom: 16px;
      min-height: 0;
      a {
        font-family: MicrosoftYaHei;
        font-size: 18px;
        color: #1f1f1f;
        letter-spacing: 0;
      }
    }
  }
  .app_main {
    margin-top: 9px;
    padding: 11px 16px 16px 16px;
    margin-right: 5px;
  }
}
</style>
