define(['model/pageModel','/uitemplate_web/static/js/rt/TemplateFormActionUtils.js','/uitemplate_web/static/js/rt/navigate.js'], function(pageModel){
	
	var uitemplateCtr = {};
	uitemplateCtr.extendViewModel = function(viewModel, params, app) {
		
		// 人员模板默认浏览态
		if (params.name == 'template-psn') {
			
			app.psn_viewModel = viewModel;
		}
		if (params.name == 'template-psn2') {
			app.psn2_viewModel = viewModel;
		}
		
		viewModel ;
	}
	
	uitemplateCtr.beforeInit = function(app,viewModel,templateModel){
		//注册表体行编辑按钮
		var actionutil = new ActionUtils(templateModel, uitemplateCtr);
		uitemplateCtr.gridOperRenderType = actionutil.getActions();
	}
	
	uitemplateCtr.init = function(viewModel,params,app,templateModel){
		uitemplateCtr.app =app;
		uitemplateCtr.viewModel = viewModel;
		uitemplateCtr.templateModel = templateModel;
	}
	
	uitemplateCtr.headEdit = function(app, viewModel,templateModel,datatableId){
		var psn_videModel = app.psn_viewModel;
		if(psn_videModel && psn_videModel.isClickable()){
			psn_videModel.isClickable(false);
		}
		var psn2_videModel = app.psn2_viewModel;
		if(psn2_videModel && psn2_videModel.isClickable()){
			psn2_videModel.isClickable(false);
		}
	}
	
	uitemplateCtr.save = function(app, viewModel,templateModel,datatableId){
		uitemplateCtr.app =app;
		uitemplateCtr.viewModel = viewModel;
		uitemplateCtr.templateModel = templateModel;
		var headData = templateModel.getValue(datatableId);
		//执行保存逻辑
		var param = {};
		param.templateInfo = viewModel.getTemplateInfo();
		param.headData = JSON.stringify(headData);
		param.cls="com.yonyou.hrcloud.staff.model.Staff";
		$.ajax({
			type: "POST", 
			url: "/uitemplate_web/uitemplate_rt/data_ctr/saveData",  
			data:param, 
			async:true,
			dataType: "json" ,
			success: function(result) {
				 //清理数据
				if(datatableId ==="headform"){//表头
					
				}else{
					var data = templateModel.getEditRowData(datatableId);
					templateModel.updateRowData(data.body);
				}
			}
		});
		var psn_videModel = app.psn_viewModel;
		if(psn_videModel && !psn_videModel.isClickable()){
			psn_videModel.headform_isEditable(false);
			psn_videModel.isClickable(true);
		}
		var psn2_videModel = app.psn2_viewModel;
		if(psn2_videModel && !psn2_videModel.isClickable()){
			psn2_videModel.headform_isEditable(false);
			psn2_videModel.isClickable(true);
		}
	}
	
	uitemplateCtr.cancel = function(app, viewModel,templateModel,datatableId){
		var dataTable = app.getDataTable(datatableId);
		var row = dataTable.getCurrentRow();
		if(row.status == u.Row.STATUS.NEW && "headform" != datatableId){
			var row = dataTable.getRow(0);
			templateModel.clearRowData(row);
		}
		var psn_videModel = app.psn_viewModel;
		if(psn_videModel && !psn_videModel.isClickable()){
			psn_videModel.headform_isEditable(false);
			psn_videModel.isClickable(true);
		}
		var psn2_videModel = app.psn2_viewModel;
		if(psn2_videModel && !psn2_videModel.isClickable()){
			psn2_videModel.headform_isEditable(false);
			psn2_videModel.isClickable(true);
		}
	}
	
	uitemplateCtr.rowDelete = function(app, viewModel,templateModel,datatableId,delRowIndex){
		uitemplateCtr.app =app;
		uitemplateCtr.viewModel = viewModel;
		uitemplateCtr.templateModel = templateModel;
		var datatable = app.getDataTable(datatableId);
		var row = datatable.getRow(delRowIndex);
		datatable.removeRow(delRowIndex);
	}
	
	uitemplateCtr.afterInit = function(viewModel,params,app,templateModel){
		var param = {};
		if(app.psn2_viewModel == undefined){
			return;
		}
		var psn_templateInfo = app.psn_viewModel.getTemplateInfo();
		var array = JSON.parse(psn_templateInfo);
		var psn2_templateInfo = app.psn2_viewModel.getTemplateInfo();
		var tmpArray = JSON.parse(psn2_templateInfo);
		if(tmpArray && tmpArray.length > 0){
			for(var i=0; i < tmpArray.length;i++){
				var obj = tmpArray[i];
				array.push(obj);
			}
		}
		var total = JSON.stringify(array);
		param.templateInfo = total;
		$.ajax({
			type: "POST", 
			url: "/uitemplate_web/uitemplate_rt/data_ctr/loadData",  
			data:param, 
			async:true,
			dataType: "json" ,
			success: function(result) {
				 //清理数据
				var psn_viewModel = app.psn_viewModel;
				templateModel.setViewModel(psn_viewModel);
				templateModel.init(result);
				var psn2_viewModel = app.psn2_viewModel;
				templateModel.setViewModel(psn2_viewModel);
				templateModel.init(result);
				
				
			}
		});
		loadNavigation(param.templateInfo);
	}
	
	return uitemplateCtr;
});