require.config({
	// baseUrl: "../",
	paths: {
		'jquery': "/uui/libs/jquery/dist/jquery",
		'knockout': "/uui/libs/knockout/dist/knockout.debug",
		'u-polyfill':"/uui/libs/uui/js/u-polyfill",
		'uui': "/uui/libs/uui/js/u",  
		'text': "/uui/libs/text/text",
		'bootstrap':"/uui/libs/bootstrap/dist/js/bootstrap",
		'templetutil':"/uitemplate_web/static/js/rt/templetutils",
		'viewctrl':'${ctx}/static/js/rt/view.datatable',
	},
	
	shim: {
		'bootstrap':{
			deps:["jquery"]
		},
		'uui': {
			deps: ["jquery", "bootstrap","u-polyfill"]
		}
	},
});

require([
	'jquery',
	'knockout',
	'templetutil',
	'uitemplate/controller',
	'uui'
], function($, ko,templetutil) {
	if(window.ko == undefined){
		window.ko = ko;
	}
	// 获取节点配置模型中的模板信息
	// 调用模板工具初始化模板
	var app = new u.createApp();
	window.app = app;
	var templetUtils = new TempletUtils(app);
	var templateComponent = templetUtils.initTemplateComponent('template-psn', 'wujd2', '001PSN_TEST','uitemplate/controller');
	
})

