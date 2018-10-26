window.refDList = function(options) {
    //var init = function (refer) {
        var $dom = options.dom;
		var refInput = options.refInput || options['searchInput'] || $dom.find("input");
		var refIcon  = $dom.attr(".input-group-addon");
        var contentId = options.contentId;
        var refContainer='#'+contentId.replace(/[^\w\s]/gi, '\\$&');
        if($('#'+contentId).length=== 0){
			$('body').append($('<div>').attr('id',contentId));
		}        
        var $contentEle = $('#'+contentId)

    	var ref=$(refContainer).Refer({
			ctx:window.ctx,
			dataOfdom:$dom,
			wrapRefer:{
				setVal:options.setVal,
				dialog:null,
				contentEle:$contentEle,   //options.$contentEle,//参照容器的el
				contentId:contentId//参照的id
				//isPOPMode:refer.options.isPOPMode
			},
			refIcon:refIcon,
			refInput:refInput
		});
        
//        refer.registerSubmitFunc(function () {
//            return $(refContainer).Refer('getSelections',true);
//        })
}
//    return {
//        template: '',
//        init: init
//    }
//})

