window.referSelf = function(options) {
        var $dom = options.dom;
        var refInput = $dom.find("input");
		var refIcon  = $dom.find(".input-group-addon");
        var contentId = options.contentId;
         //"#refContainer1bodys_project.pk_projectclass" "Str1.str2%str3".replace(/[^\w\s]/gi, '\\$&')
        var refContainer='#'+contentId.replace(/[^\w\s]/gi, '\\$&');
        var $contentEle = $('#'+contentId)
		var extensionMethods = {
	        /*
	         * 自定义treeIcon
	         */
	        defineTreeIcon: function(){
				var that=this;
				//对所有实例起作用
				if(this.options.refName!=='')
					return;
	            // icon:"/iwebap/trd/zTree_v3/css/zTreeStyle/img/diy/1_open.png" iconOpen:"/img/open.gif", iconClose:"/img/close.gif"
				 $(that.options.data).each(function (index, item) {
				 	console.log(index);
				 	if(index===0||index===3||index===6){
					  item.icon='/iwebap/trd/zTree_v3/css/zTreeStyle/img/diy/1_open.png';
					}
				 });
	        }
       };

//       $.extend(true, $.fn.Refer.Constructor.prototype, extensionMethods);
		
    	var ref=$(refContainer).Refer({
			ctx:window.ctx,
			dataOfdom:$dom,
			wrapRefer:{
				setVal:options.setVal,
				dialog:null,
				contentEle:$contentEle,//参照容器的el
				contentId:contentId,//参照的id
				isPOPMode:options.isPOPMode
			},
			refIcon:refIcon,
			refInput:refInput
		});
		
		var ins=$(refContainer).Refer('getInstance');
			ins.defineTreeIcon= function(){
					var that=this;
		            // icon:"/iwebap/trd/zTree_v3/css/zTreeStyle/img/diy/1_open.png" iconOpen:"/img/open.gif", iconClose:"/img/close.gif"
					 $(that.options.classData).each(function (index, item) {
					 	if(index===0||index===3||index===6){
						  //item.icon='/iwebap/trd/zTree_v3/css/zTreeStyle/img/diy/1_open.png';
						}
					 });
		        };
        
//        refer.registerSubmitFunc(function () {
//            return $(refContainer).Refer('getSelections',true);
//        })
    }
//    return {
//        template: '',
//        init: init
//    }
//})

