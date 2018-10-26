require.config({
	urlArgs: "dev=" + (new Date()).getTime(),
	baseUrl: "../",
	paths: {
		'jquery': "/uui1/libs/jquery/jquery-1.11.2.min",
		knockout: "/uui1/libs/knockout/knockout-3.2.0.debug",
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



require(['jquery', 'knockout','refer'], function($, ko,refer) {
	
		 $('button.pop').each(function(i,val){
	     	var $that=$(this);
				var options = {
				 	  isPOPMode:true,
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
				
				$('#refContainer'+i).Refer('show');
//				 $that.click(function(){
//			       });
		 });
			
		 options.refCode = "provider";
		 
		  function initRef(dom, options) {
			  
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
				eval(scriptStr);	
			}
			window[refInitFunc](options);
		}
})
