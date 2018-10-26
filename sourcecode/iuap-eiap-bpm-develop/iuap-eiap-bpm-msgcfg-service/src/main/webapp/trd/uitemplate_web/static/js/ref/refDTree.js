//define(['text!./refDTree.html', './underscore.js', 'knockout','./refer.js','./jquery.scrollbar.js'], function (template, underscore, ko) {

window.refDTree = function (refer) {
        var $dom = refer.options.dom;
        var data = $dom.data();
        var refInput = $dom.find("input");
        var refinfo = data.refinfo;
        var refmodel = data.refmodel;
        var refName = refinfo.refName;
        var refTitle = refinfo.title;
        var contentId = refer.options.contentId;
       
        if(!contentId){
        	refContainer='.modal-body';
        }else{
         //"#refContainer1bodys_project.pk_projectclass" "Str1.str2%str3".replace(/[^\w\s]/gi, '\\$&')
        	refContainer='#'+contentId.replace(/[^\w\s]/gi, '\\$&');
        }
        
    	$(refContainer).Refer({
			ctx:window.ctx,
			wrapRefer:refer,
			refName:refName,
			refTitle:refTitle,
			refModel:refmodel,
			refInput:refInput,
			refTempl:template
		});
        
        refer.registerSubmitFunc(function () {
            return '';
        })
    }
//    return {
//        template: template,
//        init: init
//    }

