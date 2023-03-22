<template>
  <a-layout class="layoutbox" id="components-layout-demo-custom-trigger">
    <!-- 左侧菜单 -->
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
      v-if="NODE_ENV"
    >
      <div class="logo"><img src="@/static/Logo/logo.png" alt="" /></div>
      <a-menu
        theme="dark"
        mode="inline"
        :defaultSelectedKeys="['1']"
        @click="selectItem"
        :selectedKeys="[$route.path]"
        style="height: 90vh"
      >
        <menuTwo
          v-for="item in menu"
          :key="item.path"
          :item="item"
          v-if="item.meta.type"
        ></menuTwo>
      </a-menu>
    </a-layout-sider>
    <a-layout style="height: 100vh">
      <!-- 页面整体头部导航 -->
      <a-layout-header
        class="headbox"
        style="background: #fff; padding: 0"
        v-if="NODE_ENV"
      >
        <!-- 左侧展示与隐藏 -->
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <div class="user-head">
          <!-- 切换语言 -->
          <div class="toggle">
            <a-select :defaultValue="defaultValue" @change="handleChange">
              <a-select-option value="cn">中文</a-select-option>
            </a-select>
          </div>
          <!-- 用户信息 -->
          <a-dropdown>
            <a class="ant-dropdown-link" href="#">
              {{ UserInfo.username }}
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item @click="headClick('quit')">
                <i class="iconfont icontuichu2"></i>
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <!-- 中间主体部分 -->
      <a-layout-content
        :style="{
          margin: '10px 10px',
          padding: '10px 10px',
          background: '#fff',
          minHeight: '280px',
        }"
        class="layout_content"
      >
        <router-view class="avue-view" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
// import { GetMenu } from "../api/admin/token";
import { disposereq } from "@/utils/util";
import router from "@/router";
import { mapState, mapGetterouterrs, mapActions, mapMutations } from "vuex";
import menuTwo from "./menu.vue";
export default {
  name: "index",
  components: {
    menuTwo,
  },
  data() {
    return {
      NODE_ENV: true,
      collapsed: false,
      menu: [],
      menuTwo: [],
      UserInfo: {},
      defaultValue: localStorage.lang,
    };
  },
  created() {
    this.NODE_ENV = Glod.IS_MENU;
    //  获取用户信息
    // this.getMenu()
    // this.UserInfo = JSON.parse(localStorage.getItem("UserInfo"));
  },
  mounted() {
    this.formatData(router.options.routes[0].children);
  },
  methods: {
    // 获取菜单
    loadView(view) {
      // 路由懒加载
      return () => import(`@/${view}`);
    },
    // 菜单点击事件
    selectItem(item) {
      // console.log(this.$route.matched,123123)
      this.$router.push({
        path: item.key,
      });
    },
    // 由于数据格式不符合，需要对数据进行处理
    formatData(data) {
      // for (let i = 0; i < data.length; i++) {
      //   for (let j = 0; j < data[i].children.length; j++) {
      //     data[i].children[j].showPath =
      //       data[i].path + "/" + data[i].children[j].path;
      //   }
      // }
      this.menu = data;
      this.$store.dispatch("setting/menuListSet", router.options.routes);
    },
    headClick(type) {
      if (type == "home") {
        this.$router.push({
          path: "/index",
        });
      } else if (type == "msg") {
      } else {
        localStorage.removeItem("token");
        this.$router.push({
          path: "/login",
        });
      }
    },
    // 切换多语言
    handleChange(val) {
      this.$root.Bus.$emit("switchLanguage", val);
    },
  },
};
</script>
<style>
.layoutbox {
  height: 100%;
}
.layout_content {
  background: #f3f3f4 !important;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  margin: 16px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

#components-layout-demo-custom-trigger .logo img {
  height: 32px;
  margin: 16px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.headbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iconfont {
  font-size: 14px !important;
  margin-right: 5px;
}
.toggle {
  display: inline-block;
  box-sizing: border-box;
  padding-right: 20px;
}
.user-head {
  display: inline-block;
  box-sizing: border-box;
  padding-right: 20px;
}
</style>
