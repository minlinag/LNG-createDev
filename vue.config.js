/**
 * 配置该文件可以参考:
 * https://cli.vuejs.org/zh/config/#%E7%9B%AE%E6%A0%87%E6%B5%8F%E8%A7%88%E5%99%A8
 *
 */
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, dir)
}
// const path = require("path");
const url = 'https://www.fastmock.site/mock/552fac5cc88f27249bff9351eeca2683/api'
// 基础路径，发布前修改这里,当前配置打包出来的资源都是相对路径
let publicPath = './'
module.exports = {
  configureWebpack: {
    externals: {
      "BMap": "BMap"
    },
    devtool: 'souce-map',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      new CopyPlugin([
        { from: 'static', to: './static' },
      ]),
    ],
  },
  css: {
    sourceMap: true
  },
  publicPath: publicPath,
  // eslint校验
  lintOnSave: false,
  productionSourceMap: false,
  assetsDir: 'static',
  devServer: {
    open: true,
    proxy: {
      '/system': {
        target: url,
        ws: true,
        // pathRewrite: {
        //   '^/auth': '/auth'
        // }
      },
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
