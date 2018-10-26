require.config({
	//urlArgs: "dev=" + (new Date()).getTime(),
	baseUrl: "../",
	paths: {
		'jquery': "/uui/libs/jquery/dist/jquery",
		'knockout': "/uui/libs/knockout/dist/knockout.debug",
		'css': "/uui/libs/require-css/css",
		'bootstrap':"/uui/libs/bootstrap/dist/js/bootstrap",
		'ztree':"/uui/libs/uui/js/u-tree",
		'uui':"/uui/libs/uui/js/u",
		'reflib': "/uitemplate_web/static/js/uiref/reflib",
		'refer': "/uitemplate_web/static/js/uiref/refer",
		'refGrid': "/uitemplate_web/static/js/uiref/refGrid",
		'refGridtree': "/uitemplate_web/static/js/uiref/refGridtree",
		'refTree': "/uitemplate_web/static/js/uiref/refTree",
		'refcommon': "/uitemplate_web/static/js/uiref/refcommon"
	},
	shim: {
		 'jquery' :{
     		 exports: '$'
         },
         'reflib':{
        	 deps: ["jquery"]
         },
         'ztree': {
				deps: ["jquery","uui","css!/uui/libs/uui/css/tree.css","css!/uui/libs/uui/css/font-awesome.css"]
		 },
		'refer':{
			deps:["jquery","reflib","ztree"]
		},
		'refGridtree':{
			deps: ["refer"]
		},
		'refGrid':{
			deps: ["refer"]
		},
		'refTree':{
			deps: ["refer"]
		},
		'refcommon':{
			deps: ["refer"]
		}
	}
});

define(['jquery', 'knockout','refer','refGrid','refGridtree','refTree','refcommon'],function($, ko,refer){
	
	var refComp = {
		initRefComp : function(dom, options) {
		var $input=dom.find('input');
		var refCode = options.refCode;
		var selectedVals = options.selectedVals;
		$.ajax({
			type: "get",
			url: '/uitemplate_web/iref_ctr/refInfo/',
			data: options,
			traditional: true,
			async: false,
			dataType: "json",
			success: function (refmodel) {
				dom.attr('data-refmodel',JSON.stringify(refmodel));
				options = JSON.parse(dom.attr('data-refmodel'));
				options.refCode = refCode;
				options.dom = dom;
				options.contentId = 'refContainer' + dom.attr('id');
				options.sPOPMode=true;
				options.selectedVals = selectedVals;
				
				options.setVal = function(data) {
					 if (data) {
						var  optionsTemp=$('#'+options.contentId).Refer('getOptions');
						var pk = $.map(data,function(val, index) {
								return val.refpk
							}).join(',');
						var name = $.map(data,function(val, index) {
								return val.refname
							}).join(',');
						var code=$.map(data,function(val, index) {
								return val.refcode
							}).join(',');
						$input.val(options.isReturnCode?code:name);
						
						// 适配云审
						var msg = {};
						msg.type = "ok";
						msg.data = data;
						var str = JSON.stringify(msg);
						top.postMessage(str, '*');	
					}

				};
				options.onCancel = function() {
					// 适配云审
					var msg = {};
					msg.type = "cancel";
					msg.data = data;
					var str = JSON.stringify(msg);
					top.postMessage(str, '*');	
				}
				
				options.refInput = dom.find("input");
				
				if (!options.pageURL) {
					options.pageURL = '/uitemplate_web/static/js/uiref/refDList.js';
				}
				
				
				var	pageURL = options.pageURL;
				
				var refInitFunc = pageURL.substr(pageURL.lastIndexOf('/') +1).replace('.js','');
				if(!window[refInitFunc]){
					var scriptStr = '';	
					$.ajax({
						url:pageURL,
						dataType:'script',
						async : false,
						success : function(data){
							scriptStr  = data
						}
					});
					eval(scriptStr);	
				}
				window[refInitFunc](options);
			}
		});
		
		}
	};
	
	return refComp;
});

