let baseURL;
const VUE_APP_MODE = process.env.VUE_APP_MODE;
// let baseURL;
if (VUE_APP_MODE == 'development') { // 本地
    // baseURL = 'http://192.168.18.56:8080/nglng/';//测试地址
    baseURL = 'http://192.168.18.56:8080/nglng/';//测试地址
} else {
    // pre 预生产
    // prod 生产
    switch (VUE_APP_MODE) {
        case 'test':// 测试
            baseURL = Glod.DEVE_LOPMENT_ENVIRONMENT;
            break;
        case 'pre':// 预生产
            baseURL = Glod.TESTING_ENV_IRONMENT;
            break;
        case 'prod':// 生产
            baseURL = Glod.TESTING_ENV_IRONMENT;
            break;
        default:// 测试
            baseURL = Glod.DEVE_LOPMENT_ENVIRONMENT;
            // baseURL = 'http://192.168.2.207:8088';//本地
            break;
    }
}
module.exports = {
    baseURL
};
