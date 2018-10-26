// 模版前台工具方法
// ======================
TempletUtils.prototype.initTemplateComponent = function(templateComponentName,nexuskey, funcnode, uitemplateCtrl, clearResister) {
	// 查询模板信息
	var uiTemplate = this.queryBillForm(nexuskey, funcnode);
	var url = uiTemplate.url;
	
	// 前台注册模板组件
	this.register(templateComponentName, url, clearResister);
	
	
	// 创建模板组件自定义标签配置模板组件的参数
	templateComponent = $('<'+templateComponentName+'></'+templateComponentName+'>');
	var params = {'name': templateComponentName, 'nexuskey': nexuskey, 'funcnode' : funcnode, 'uitemplatectrl':uitemplateCtrl}; 
	templateComponent.attr('params',JSON.stringify(params));  

	// 将模板组件添加到节点HTML中 
	var templateParentDom = $('#'+templateComponentName);
	templateParentDom.empty();
	templateComponent.appendTo(templateParentDom);
	
	// KO绑定
	ko.applyBindings({}, templateParentDom[0]);
}

TempletUtils.prototype.register = function(name, url, clearResister, callback){
	var already = false;
	if (ko.components.isRegistered(name)) {
		if(clearResister){
			ko.components.unregister(name);
		}else{
			already = true;
		}
	}
	if(!already){
		var urlMeta =  url.split("?");
		url = urlMeta[0];
		var query = (urlMeta.length > 1) ? ("?"+urlMeta[1]) : "" ;
		ko.components.register(name, {
			viewModel: {
				require: url + '.js' + query
			},
			template: {
				require: 'text!' + url + '.html' + query
			}
		});
	}
}


TempletUtils.prototype.queryBillList = function(nexuskey,funcnode,extOptions) {
	return this.queryTempletInfo(0, nexuskey,funcnode, "uitemplate",extOptions);
}

TempletUtils.prototype.queryBillForm = function(nexuskey,funcnode,extOptions) {
	return this.queryTempletInfo(0, nexuskey, funcnode, "uitemplate",extOptions);
}

TempletUtils.prototype.queryQTInfo = function(nexuskey,funcnode,extOptions) {
	return this.queryTempletInfo(1, funcode, funcnode, "uitemplate",extOptions);
}

TempletUtils.prototype.queryTempletInfo = function(type, nexuskey,funcnode, page, extOptions) {
	var templetvo = {};
	var btPara = {};
	btPara.templateType = type;
	btPara.nexuskey = nexuskey;
	btPara.funcnode = funcnode;
	btPara.pageTemplate = page;

	$.ajax({
		type : "POST",
		url : "/uitemplate_web/uitemplate_rt/rt_ctr/loadtemplate",
		data : btPara,
		async : false,
		dataType : "json",
		success : function(result) {
			ret = result;
		}
	});

	return ret;
}

function TempletUtils(app) {
	this.app = app;
}