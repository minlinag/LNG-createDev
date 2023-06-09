# vue+antd搭建后台管理界面模版（PC端）

<img src="./src/static/login.png" width="100%" height="519px"/>  


#### 技术栈
vue2 + vuex + vue-router + webpack + ES6/7 + axios + antd + 阿里图标iconfont

#### 项目预览
[http://nmgwap.gitee.io/vue-antd/#/login](http://nmgwap.gitee.io/vue-antd/#/login)


#### 说明

>  账号密码不为空即可

>  本项目主要用于熟悉如何用 vue2 架构一个后端管理平台项目

>  为了方便后期修改使用，模拟数据在页面中，具体修改看下面【强调】

>  如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  或者您可以 "follow" 一下，我会不断开源更多的有趣的项目

>  开发环境 w7  Chrome 61

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍

#### 自定义组件

##### 权限按钮：permissionButton

>  引用标签 

```

  <pe-button></pe-button>

```

###### 默认属性
> ---------------------------------------------------------------------------------

>   ---value-----type---------style---------icon---------name--------clickName--------popconfirmPlacement---popconfirmTitle

>   -- Add-------primary------btn_primary---Add-icon-----新增--------AddClick-------------------------------------

>   -- Edit------primary------btn_primary---Edit-icon----编辑--------EditClick------------------------------------

>   -- Affirm----primary------btn_primary---Affirm-icon--确认--------AffirmClick----------------------------------

>   -- Delete----danger-------btn_danger----Delete-icon--删除--------DeleteClick------top----您确定要删除该项吗?--

>   -- VERIFY----primary------btn_primary---VERIFY-icon--审批--------VERIFYClick---------------------------------

>   -- Back------primary------btn_primary---Back-icon----意见反馈-----BackClick-----------------------------------

>   -- Issue-----primary------btn_primary---Issue-icon---下发--------IssueClick-----------------------------------

>   -- Verify-------primary----btn_primary--Verify--icon-验收-------VerifyClick---

>   -- SUBMIT-------primary----btn_primary--SUBMIT-icon---提交--------SUBMITClick---

通用值loading：按钮加载 Boolean值，默认false
通用值isPower：是否设置权限。Boolean值。默认true，跟随权限
> ---------------------------------------------------------------------------------

> ----------------------------------------------------------------------------------
> 
> ###### button内组件 

> ImportComponents: {value: 'importComponent',data: {},url: '',accept: '',name: '导入',}
> ExportComponents: {value: 'exportComponent',url: '',params: {},name: '导出',}


###### 自定义例子
>  属性 include <type:Array>

> include内容可以为字符串或者对象，对象value键为必传参数

> 可自定义值可传

```


<pe-button :include="[
            { value: 'Add', clickName: 'masterDataAdd' },
            { value: 'Delete', clickName: 'Delete' },
            {value: 'import'}
          ]"
          
          @masterDataAdd="masterDataAdd" //自定义事件
          @Delete="Delete"
          @importClick="importClick"
        ></pe-button>

```

>属性

#### 目录结构
------------------------

```bash
├── /public/         # 公共文件
├── /src/            # 源码目录
│ ├── /api/          # 请求
│ ├── /assets/       # 组件静态资源(图片)
│ ├── /components/   # 公共组件
| ├── /languages/    # 多语言配置
| ├── /minxins/      # minxins
│ ├── /router/       # 路由配置
│ ├── /styles/       # 公共样式
│ ├── /views/        # 路由组件(页面维度)
│ ├── /utils/        # 公共方法
│ ├── App.vue        # 组件入口
│ └── main.js        # 程序入口
├── .babelrc         # ES6语法编译配置
├── .editorconfig    # 定义代码格式
├── .eslintignore    # ES6规范忽略文件
├── .eslintrc.js     # ES6语法规范配置
├── .gitignore       # git忽略文件
├── package.json     # 项目依赖
└── README.md        # 项目文档
```

#### 强调

项目请求已经改为假数据，例如：
``` bash

数据为mock模拟数据
列表获取功能可用，修改删除功能已开发完成，需和后台对接相应字段即可

```



#### 部分截图
------------------------

登录
![登录](./src/static/login.png "登录")

首页
![首页](./src/static/index.png "首页")

菜单
![菜单](./src/static/menu.png "菜单")

角色
![角色](./src/static/role.png "角色")

用户
![用户](./src/static/user.png "用户")

字典
![字典](./src/static/zd.png "字典")



#### 运行项目
------------------------
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

#### 项目源码地址：
------------------------

码云地址：https://gitee.com/nmgwap/vue-antd  


#### 微信公众号
------------------------  

<img src="/src/static/wx.jpg"  width = "270" height = "270"/>
