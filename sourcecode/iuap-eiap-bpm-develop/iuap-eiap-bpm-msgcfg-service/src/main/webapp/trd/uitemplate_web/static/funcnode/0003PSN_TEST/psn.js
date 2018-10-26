require.config({
	// baseUrl: "../",
	paths: {
		'jquery': "/uui/libs/jquery/dist/jquery",
		'knockout': "/uui/libs/knockout/dist/knockout.debug",
		'u-polyfill':"/uui/libs/uui/js/u-polyfill",
		'css': "/uui/libs/require-css/css",
		'uui': "/uui/libs/uui/js/u", 
		'text': "/uui/libs/text/text",
		'bootstrap':"/uui/libs/bootstrap/dist/js/bootstrap",
		'templetutil':"/uitemplate_web/static/js/rt/templetutils",
		'viewctrl':'${ctx}/static/js/rt/view.datatable',
		'uui_tree':"/uui/libs/uui/js/u-tree",
		'uitree':"/uitemplate_web/static/funcnode/0003PSN_TEST/uitree"
	},
	
	shim: {
		'bootstrap':{
			deps:["jquery"]
		},
		'uui': {
			deps: ["jquery", "bootstrap","u-polyfill"]
		},
		'uui_tree': {
			deps: ["jquery","uui","css!/uui/libs/uui/css/tree.css","css!/uui/libs/uui/css/font-awesome.css"]
		},
		'uitree': {
			deps: ["uui_tree"]
		}
	},
});

require([
	'jquery',
	'knockout',
	'templetutil',
	'uitemplate/controller',
	'uui',
	'uitree'
], function($, ko,templetutil) {
	if(window.ko == undefined){
		window.ko = ko;
	}
	// 获取节点配置模型中的模板信息
	// 调用模板工具初始化模板
	var app = new u.createApp();
	window.app = app;
	var templetUtils = new TempletUtils(app);
	var templateComponent = templetUtils.initTemplateComponent('template-psn', 'ms', '001PSN_TEST','uitemplate/controller');
	
})

