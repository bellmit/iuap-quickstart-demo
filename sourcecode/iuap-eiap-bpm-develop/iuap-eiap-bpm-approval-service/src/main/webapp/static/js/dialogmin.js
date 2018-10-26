define([], function() {
	var dialogmin = function(content,className){
        var iconClass="";
        if(className==""||className=="tip-suc"){
            iconClass = "icon-ok";
        }else{
            iconClass = "icon-tishi";

        }
			var dialogdiv = "<div class='dialogmin "+(className||" ") +"'><i class='iconfont "+ iconClass+"'></i><span>"+content+"</span></div>";
			$('body').append(dialogdiv);
			setTimeout(function(){
				$(".dialogmin").remove();
			},2000);
	};
	return dialogmin;
});