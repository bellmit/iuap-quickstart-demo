require.config({
	urlArgs: "dev=" + (new Date()).getTime(),
	baseUrl: "../",
	paths: {
		'jquery': "/uui/libs/jquery/jquery-1.11.2.min",
		knockout: "/uui/libs/knockout/knockout-3.2.0.debug",
		zTree:"/uitemplate_web/static/trd/zTree_v3/js/jquery.ztree.all-3.5",
		'zTree.exhide':"/uitemplate_web/static/trd/zTree_v3/js/jquery.ztree.exhide-3.5",
		'bootstrap-table': "/uitemplate_web/static/trd/bootstrap-table/src/bootstrap-table",
		'underscore': "/uitemplate_web/static/js/ref/underscore",
		'scrollbar': "/uitemplate_web/static/js/ref/jquery.scrollbar",
		'refer': "/uitemplate_web/static/js/ref/refer",
		borderLayout:"/uitemplate_web/static/js/ref/jquery.layout_and_plugins"
	},
	shim: {
		 'jquery' :{
     		 exports: '$'
         },
         zTree: {
			deps: ["jquery"]
		},
		'zTree.exhide':{
			deps: ["zTree"]
		},
		'bootstrap-table': {
			deps: ["jquery"]
		},
		'scrollbar': {
			deps: ["jquery"]
		},
		'refer':{
			deps:["jquery","underscore","zTree","bootstrap-table","scrollbar"]
		}
	}
});

define(['jquery', 'knockout','refer'],function($, ko,refer){
	
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
				dom.attr('data-refparam',"{'a':'123'}");
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

				options.refInput = dom;
				
				if (!options.pageURL) {
					options.pageURL = '/uitemplate_web/static/js/ref/refDList.js';
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

