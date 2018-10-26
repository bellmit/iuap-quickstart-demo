module.exports = {
    publishConfig: {
        command: "mvn",
        repositoryId: "iUAP-Stagings",
        repositoryURL: "http://172.16.51.12:8081/nexus/content/repositories/iUAP-Stagings/",
        artifactId: "workbenchfe",
        groupId: "com.yonyou.iuap.workbench",
        version: "2.0-RC001"
    },
    serverConfig: {
        serverport: 9999,
        context: '/iuap-eiap-bpm-msgcfg-service', //当前应用对应的上下文
        isProxyFirst: true, // isProxyFirst : 是否后端代理优先     //true -> 优先使用代理服务器数据，false -> 使用本地模拟数据
        proxyList: [
            {
                host: 'http://192.168.2.2:8080',
                context: '/iuap-eiap-bpm-msgcfg-service'
            },
            {
                host: 'http://192.168.2.2:8080',
                context: '/uitemplate_web'
            }
        ], //代理服务器列表
        proxyIgnore: [
            "/",
            "/css.js",
            "/text.js",
            "/src/*",
            "/vendor/*",
            "/conf/*"
        ], //代理忽略的URL列表
        mockList: [

        ] //模拟请求列表
    }
};
