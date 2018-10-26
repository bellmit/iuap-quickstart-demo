require.config({
	// baseUrl: "../",
	paths: {
		'jquery': "/uui/libs/jquery/jquery-1.11.2",
		'knockout': "/uui/libs/knockout/dist/knockout.debug",
		'u-polyfill':"/uui/libs/uui/js/u-polyfill",
		'moment': "/uui/libs/moment/moment",
		'uui': "/uui/libs/uui/js/u",
		'i18next':"/uui/libs/i18next/i18next",
		'text': "/uui/libs/requirejs/text",
		'bignumber':"/uui/libs/bignumber/bignumber",
		'bootstrap':"/uui/libs/bootstrap/dist/js/bootstrap",
		'templetutil':"/uitemplate_web/static/js/rt/templetutils",
		'viewctrl':'${ctx}/static/js/rt/view.datatable'
	},
	
	shim: {
		bootstrap:{
			deps:["jquery"]
		},
		'uui': {
			deps: ["jquery", "bootstrap", "i18next"]
		}
	},
	waitSeconds:60
});

require([
	'jquery',
	'knockout',
	'model/pageModel',
	'templetutil',
	'moment',
	'uui',
	'uitemplate/controller',
	'bootstrap',
	'u-polyfill'
], function($, ko, pageModel,templetutil,uui,controller) {
	window.ko = ko;
	
	// 获取节点配置模型中的模板信息
	var templates = pageModel.uitemplates;
	
	// 调用模板工具初始化模板
	var app = u.createApp();
	window.app = app;
	var templetUtils = new TempletUtils(app);
	var templateComponent = templetUtils.initTemplateComponent(templates[0].tagname, templates[0].nexuskey, pageModel.funcnode,'/uitemplate_web/static/staff/funcode/0002PSN_TEST/uitemplate/controller.js');
	var templateComponent2  = templetUtils.initTemplateComponent(templates[1].tagname, templates[1].nexuskey, pageModel.funcnode,'/uitemplate_web/static/staff/funcode/0002PSN_TEST/uitemplate/controller.js');
	
})
