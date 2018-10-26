require.config({
	//urlArgs: "dev=" + (new Date()).getTime(),
	baseUrl: "../",
	paths: {
		'jquery': "/uui/libs/jquery/jquery-1.11.2.min",
		'refComp': "/uitemplate_web/static/js/ref/refComp"
	}
});

define(['jquery','refComp'],function($,refComp){
	
	
	if (window.addEventListener) {  // all browsers except IE before version 9
		window.removeEventListener('message',refValue,false);
        window.addEventListener('message',refValue,false);
    }else if (window.attachEvent) {   // IE before version 9
    	window.detachEvent("onmessage", refValue);
        window.attachEvent("onmessage", refValue);
    }else{
    	alert("浏览器不支持");
    }
	
	var refid;
	var dom;
	
	 function refValue( event ) {
		 var para = JSON.parse(event.data);
		 
		 // 参照code
		 var refCode = para.refCode;
		 var selected = para.data;
		 var pk='';

		 if (selected  && selected.length > 0) {
			 	pk = $.map(selected, function(val, index) {
					return val.refpk
				}).join(',');
				var name = $.map(selected, function(val, index) {
					return val.refname
				}).join(',');
				var code = $.map(selected, function(val, index) {
					return val.refcode
				}).join(',');
		 }
				
		if (window.addEventListener) {  // all browsers except IE before version 9
			window.removeEventListener('message',refValue,false);
	    }else if (window.attachEvent) {   // IE before version 9
	    	window.detachEvent("onmessage", refValue);
	    }
		
		
		 $('.col-md-5').each(function(i,val){
		     	var $that=$(this);
		     	dom = $that;
				var options = {
						refCode:refCode,
						selectedVals:pk
				};
				refComp.initRefComp($that,options);
				refid ='#refContainer' + $that.attr('id');
				 $that.click(function(){
			       		$(refid).Refer('show');
			     });
				 
//						 $('#refContainer' + $that.attr('id')).Refer('show');
		 	}
		 );
		 
		 var $input=dom.find('input');
		 $input.val(name);
				
     }
	 

	return refComp;
});

