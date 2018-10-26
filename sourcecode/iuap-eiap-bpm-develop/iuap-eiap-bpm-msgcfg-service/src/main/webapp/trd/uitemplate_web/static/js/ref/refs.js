require.config({
	urlArgs: "dev=" + (new Date()).getTime(),
	baseUrl: "../",
	paths: {
		text: "/uui1/libs/requirejs/text",
		css: "/uui1/libs/requirejs/css",
		'jquery': "/uui1/libs/jquery/jquery-1.11.2.min",
		knockout: "/uui1/libs/knockout/knockout-3.2.0.debug",
		'u.base': "/uui1/libs/uui/js/u.base.min",
		'u.ext': "/uui1/libs/uui/js/u.ext",
		'u.grid': "/uui1/libs/uui/js/u.grid",
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
		},
		'u.base': {
			deps: ["jquery"]
		},
		'u.ext': {
			deps: ["jquery"]
		}
		,
		'u.grid': {
			deps: ["jquery"]
		}
	}
});



require(['jquery', 'knockout', 'u.base','refer', 'u.ext','u.grid'], function($, ko, model,refer) {
	
	$('button.disable').on('click',function(){
		 	var contentId = 'setData';
	        var refContainer='#'+contentId.replace(/[^\w\s]/gi, '\\$&');
			$(refContainer).Refer('getInstance').setEnable(false);
			$('button.setData').html('disabled');
	});
        //指定数据集方式
		$('button.setData').on('click',function(){
        	var $that=$(this);
	        var contentId = 'setData';
	        var refContainer='#'+contentId.replace(/[^\w\s]/gi, '\\$&');
	        $('body').append($('<div>').attr('id',contentId));
			var refInput=$('input.setData');
			var $contentEle=$(refContainer);
			var data=[{"refcode":"USD","refname":"美元","refpk":"1001TY10000000006INR"},{"refcode":"CNY","refname":"人民币","refpk":"1002Z0100000000001K1"},{"refcode":"EUR","refname":"欧元","refpk":"1002Z0100000000001K3"}];
			var ref=$(refContainer).Refer({
				ctx:window.ctx,
				data:data,
				refInput:refInput,
				isBillType:false,
				refUIType:"RefGrid",
				"refName":"币种档案",
				wrapRefer:{
					contentEle:$contentEle,//参照容器的el
					contentId:contentId,//参照的id
					setVal: function(data) {
								 if (data) {
									var  options=$(refContainer).Refer('getOptions');
									var pk = $.map(data,function(val, index) {
											return val.refpk
										}).join(',');
									var name = $.map(data,function(val, index) {
											return val.refname
										}).join(',');
									var code=$.map(data,function(val, index) {
											return val.refcode
										}).join(',');
								 $that.html(options.isReturnCode?code:name);
								}
								
							}
				}
			});
		
		   $(refContainer).Refer('show');
	        
        });
		
        $('button.refreshCache').on('click',function(){
        	$('#pk_deptid_v4').parent().attr('data-refparam','{1=1}');
        });
        
		 $('button.isBillType').on('click',function(){
        	var $that=$(this);
			
        var contentId = 'x';
        var refContainer='#'+contentId.replace(/[^\w\s]/gi, '\\$&');
        $('body').append($('<div>').attr('id',contentId));
		var refInput=$('input.isBillType');
		var $contentEle=$(refContainer);
		
    	var ref=$(refContainer).Refer({
			ctx:window.ctx,
			isBillType:false,
			"refName":"币种档案",
			dataOfdom:$that,
			wrapRefer:{
				contentEle:$contentEle,//参照容器的el
				contentId:contentId,//参照的id
				setVal: function(data) {
							 if (data) {
								var  options=$(refContainer).Refer('getOptions');
								var pk = $.map(data,function(val, index) {
										return val.refpk
									}).join(',');
								var name = $.map(data,function(val, index) {
										return val.refname
									}).join(',');
								var code=$.map(data,function(val, index) {
										return val.refcode
									}).join(',');
							 $that.html(options.isReturnCode?code:name);
							}
							
						}
			},
			refInput:refInput
		});
		
		   $(refContainer).Refer('show');
	        
        });
		
		
        $('button.pop').each(function(i,val){
        	var $that=$(this);
			var options = {
			 	  isPOPMode:false,
			 	  contentId:'refContainer'+i,
				  dom: $that,
				  pageUrl: '/uitemplate_web/static/js/ref/refDList.js',
				  setVal: function(data) {
							 if (data) {
								var  options=$('#'+'refContainer'+i).Refer('getOptions');
								var pk = $.map(data,function(val, index) {
										return val.refpk
									}).join(',');
								var name = $.map(data,function(val, index) {
										return val.refname
									}).join(',');
								var code=$.map(data,function(val, index) {
										return val.refcode
									}).join(',');
							 $that.html(options.isReturnCode?code:name);
							}
							
						},
				  onOk: function(data){
					   	this.setVal(data);
					  	this.onCancel();
				 	},
				  onCancel: function(){
				  	$('#refContainer'+i).Refer('hide');
				  }
	       };
			
	       initRef(options.pageUrl,options);
	       
	       $that.click(function(){
	       		$('#refContainer'+i).Refer('show');
	       });
        });
        
            $(".col-md-5").each(function(i,val){
				var ele = $(this)
				var cfg=ele.data().refcfg;
				var pageUrl='/iform_web/static/js/ref/refDList.js';
				if(cfg&&cfg.pageUrl){
					pageUrl=cfg.pageUrl;
				}
				
            	var $input=$(this).find('input');
				var inpuid=$input.attr('id').replace(/[^\w\s]|[_]/gi, '');
              	$('body').append($('<div>').attr('id','refContainer'+inpuid));
              	var options = {
						contentId:'refContainer'+inpuid,
						dom: ele,
						pageUrl: pageUrl,
						setVal: function(data) {
							 if (data) {
								var  options=$('#'+'refContainer'+inpuid).Refer('getOptions');
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
							}
						},
						onOk: function(data) {
							 	this.setVal(data);
								this.onCancel();
						},
						onCancel: function() {
							$('#refContainer'+i).Refer('hide');
						}
					};
					initRef(pageUrl,options);
              	
              });
            
            
            
        function initRefUI(dom, options) {
        	
        	
        }    
            
        function initRef(pageURL, options) {
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
				(new Function(scriptStr))();
			}
			window[refInitFunc](options);
		}
})
