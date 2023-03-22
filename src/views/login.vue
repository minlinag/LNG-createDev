/*
登陆界面
*/

<template>
  <div class="body">
    <!-- 背景的图片走马灯效果 -->
    <TSCarousel />
    <div class="conbox">
      <div class="logo">
        <img src="../assets/img/logo.png" alt />
        <div>后台管理平台</div>
      </div>
      <div class="smbox">
        <!-- 切换语言 -->
        <div class="toggle">
          <a-select>
            <a-select-option value="cn">中文</a-select-option>
          </a-select>
        </div>
        <!-- 登录区域 -->
        <div class="a-form-itembox">
          <!-- 登陆触发handlesubmit事件 -->
          <a-form :form="form" @submit="handleSubmit">
            <a-form-item class="Item">
              <div class="title">{{'请登录'}}</div>
            </a-form-item>
            <a-form-item class="Item inputbox">
              <a-input
                placeholder="请输入账号"
                size="large"
              >
                <icon-font
                  slot="prefix"
                  type="iconyonghuming"
                  :style="{ fontSize: '16px', color: '#0088cc' }"
                />
              </a-input>
            </a-form-item>
            <a-form-item class="Item inputbox">
              <a-input
                placeholder="请输入密码"
                size="large"
                type="password"
                v-decorator="['password', { rules: [{ required: true }] }]"
              >
                <icon-font
                  slot="prefix"
                  type="iconmima1"
                  :style="{ fontSize: '16px', color: '#0088cc' }"
                />
              </a-input>
            </a-form-item>
            <a-form-item class="Item">
              <div class="inputsmbox">
                <a-input
                  placeholder="请输入验证码"
                  size="large"
                  v-decorator="['code', { rules: [{ required: true }] }]"
                >
                  <icon-font
                    slot="prefix"
                    type="iconyanzhengma1"
                    :style="{ fontSize: '16px', color: '#0088cc' }"
                  />
                </a-input>
              </div>
            </a-form-item>
            <a-form-item class="Item inputbox">
              <a-button
                type="primary"
                :loading="btnloading"
                html-type="submit"
                class="btn"
                size="large"
              >登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <!-- 底部文字 -->
      <div class="foot">
        <a class="copyright-a" href="http://www.beian.miit.gov.cn">蒙ICP备XXXXXXXXX号</a> Copyright ©2017-2020 版权所有 : nmwap.com
      </div>
    </div>
  </div>
</template>
<script>
import TSCarousel from "../components/TSCarousel";
import { encryption } from "../utils/utils";
// import { loginByUserToken, getUserInfo } from "../api/admin/token";
export default {
  data() {
    return {
      login: {
        username: "",
        password: "",
        randomStr: Math.round(new Date() / 1000),
        code: "",
        grant_type: "password",
        scope: "server"
      },
      btnloading: false,
      codeUrl: "/code?randomStr=" + Math.round(new Date() / 1000),
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  // 注册组件
  components: {
    TSCarousel
  },
  created() {
    // this.defaultValue = localStorage.lang || "cn";
    // localStorage.setItem("lang", "cn");
    // this.importFontpack("login/");
  },
  beforeUpdate() {
    // this.importFontpack("login/");
  },
  methods: {
    // 切换验证码
    SwitchCode() {
      this.codeUrl = "/code?randomStr=" + Math.round(new Date() / 1000);
      this.login.randomStr = Math.round(new Date() / 1000);
    },
    // handlesubmit提交
    handleSubmit(e) {
      //阻止系统默认
      e.preventDefault();

      this.form.validateFields((err, values) => {
        if (!err) {
          this.btnloading = true;
          this.login.username = values.username;
          this.login.password = values.password;
          this.login.code = values.code;
          // 密码加密
          const user = encryption({
            data: this.login,
            key: "thanks,pig4cloud",
            param: ["password"]
          });
          // 暂时先这么写
          localStorage.setItem("token", this.login);
          this.$router.push({
              path: "/index"
           });

          // 请求token
          // loginByUserToken(user).then(response => {
          //   // 判断是否成功
          //   try {
          //     // if (response.hasOwnProperty("access_token")) {
          //     //   localStorage.setItem("token", response.access_token);
          //     //   getUserInfo()
          //     //     .then(res => {
          //     //       if (res.code == 0) {
          //     //         console.log()
          //     //         this.$message.success(this.$t("logistics.accessLogin"));
          //     //         localStorage.setItem(
          //     //           "UserInfo",
          //     //           JSON.stringify(res.data.sysUser)
          //     //         );
          //     //         this.$router.push({
          //     //           path: "/index"
          //     //         });
          //     //       } else {
          //     //         this.$message.info(res.msg);
          //     //         this.SwitchCode();
          //     //         this.btnloading = false;
          //     //         localStorage.clearItem("token");
          //     //       }
          //     //     })
          //     //     .catch(err => {
          //     //       this.$message.info(err);
          //     //       this.SwitchCode();
          //     //       this.btnloading = false;
          //     //       localStorage.clearItem("token");
          //     //     });
          //     // } else {
          //     //   this.$message.info(response.msg);
          //     //   this.SwitchCode();
          //     //   this.btnloading = false;
          //     // }
          //   } catch (error) {
          //     this.$message.info(response.msg);
          //     this.SwitchCode();
          //     this.btnloading = false;
          //   }
          // });
        }
      });
    }
  }
};
</script>
<style scoped>
.body {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}

.conbox {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logo {
  font-size: 30px;
  color: #fff;
  width: 60vw;
  display: flex;
  align-items: center;
}
.logo img {
  height: 80px;
  margin-right: 20px;
}

.smbox {
  width: 60vw;
  height: 60vh;
  background-color: #fff;
  margin: 40px 0px;
  box-shadow: 0px 0px 10px #000;
  background-image: url("../assets/img/bg.png");
  background-repeat: no-repeat;
  background-position: left;
  background-size: 100%;
  position: relative;
}
.a-form-itembox {
  position: absolute;
  top: 0px;
  right: 0px;
  box-sizing: border-box;
  padding: 60px 80px;
}
.title {
  font-size: 20px;
}

.inputbox {
  width: 300px;
  box-sizing: border-box;
}

.inputsmbox {
  width: 300px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}
.btn {
  width: 300px;
}
.foot {
  color: #fff;
}
.copyright-a {
  text-decoration: none;
  color: #fff;
}
.copyright-a:hover {
  color: #fff;
}
.toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
