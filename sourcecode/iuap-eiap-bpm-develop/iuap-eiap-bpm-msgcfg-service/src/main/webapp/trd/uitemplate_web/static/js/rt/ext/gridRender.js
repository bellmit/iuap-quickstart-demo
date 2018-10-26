define(function(){
    /**
     * grid 自定义button render
     */
     
	var gridOperRenderType = function(params){
		var btngroup = gridOperRenderType.btns;
		var oThis = this;
		
		if(typeof btngroup != 'undefined' && btngroup != null && btngroup.length > 0){
			for(var i = 0;i<btngroup.length;i++){
				var btn = btngroup[i];
				var $ba;
				var bi = document.createElement('img');
				var iClass = btn.icon;
				if(!iClass)
					iClass = gridOperRenderType.btnIcons[btn.id];
				var aName = btn.id;
				var aTitle = btn.text;
				//$(bi).addClass(iClass);
				if(!btn.inmore){
					var htmlStr = '<a id="'+ aName +'" name="'+ aName +'" title="'+ aTitle +'"><img src="/uitemplate_web/static/css/rt/img/' + iClass + '"></img></a>';
					params.element.insertAdjacentHTML('beforeEnd', htmlStr);
					$ba = $(params.element).children('#'+aName);			
				}else{
					if(!$(params.element).children("#moreIcon").length){
						var more = '<a id="moreIcon" name="moreIcon"><img src="/uitemplate_web/static/css/rt/img/more.png"></a>' 										
						var more_detail = '<label class="hover_box"><ul class="more_detail"></ul></label>'
						params.element.insertAdjacentHTML('beforeEnd', more+more_detail);
						$(params.element).on("mouseleave",".hover_box",function(){
							$(this).removeClass("hoverOpen")
						})
						$(params.element).on("mouseenter",".hover_box",function(){
							
							$(this).addClass("hoverOpen")
						})
					 
					}
					var htmlStr = '<li><a id="'+ aName +'" name="'+ aName +'" title="'+ aTitle +'">'+btn.text+'</a></li>';
					$(params.element).children(".hover_box").children(".more_detail")[0].insertAdjacentHTML('beforeEnd', htmlStr);	
					$ba = $(params.element).children('.hover_box').children('.more_detail').children('li').children('#'+aName);		
				}
				
				$ba.on('click', (function(onclick) {
				
					return function(e) {
						if(onclick){
							onclick.call(oThis,e);
						}
						if (e.stopPropagation) {
							e.stopPropagation();
						} else {
							e.cancelBubble = true;
						}
					}
				})(btn.onclick))
				
			}
		}
		var trNode = $(params.element).parents('tr');
		var tdNode = $(params.element).parents('td');
		tdNode.addClass("oper_td");
	
		
	}
	
	gridOperRenderType.btns = []
//	gridOperRenderType.btnIcons = {'copy':'fa fa-copy','edit':'fa fa-edit ','delete':'fa fa-remove'}
	gridOperRenderType.btnIcons = {'edit':'fa fa-edit ','delete':'fa fa-remove'}
	
	return {
		gridOperRenderType: gridOperRenderType
	}
})