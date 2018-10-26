'use strict';

define(function(){
	var uitemplateCtr = {};
	uitemplateCtr.extendViewModel = function(viewModel, params, app) {
		viewModel ;
	}
	
	uitemplateCtr.beforeInit = function(app,viewModel,templateModel){
		//注册表体行编辑按钮
	}
	
	
	uitemplateCtr.init = function(viewModel,params,app,templateModel){
		uitemplateCtr.app =app;
		uitemplateCtr.viewModel = viewModel;
		uitemplateCtr.templateModel = templateModel;
	}
	
	uitemplateCtr.save = function(app, viewModel,templateModel,datatableId){
		//添加验证
		var checked = uiCompValidate(app,datatableId);
		//特殊处理图片必输字段
		$('.validateimage').each(function(index, ele){
			var fieldId = ele.getAttribute('fieldid');
			var dtid = ele.getAttribute('datatableid');
			var required = app.getDataTable(dtid).getMeta(fieldId).required;
			if(required && required=='true'){//必输
				var vrow = app.getDataTable(dtid).getCurrentRow();
				if(vrow && vrow.data[fieldId].value == undefined){
					checked = false;
				}
			}
		})
		if(!checked){
			return false;
		}
		//新增一个空白行
		var dt = app.getDataTable(datatableId);
		var cr = dt.getCurrentRow();
		if(cr.status ==='new'){
			var data = cr.data;
			var row = new u.Row({parent:dt});
			row.status = u.Row.STATUS.NORMAL;
			
			for(var field in data){
				if(!row.data[field])
					continue;	
				if(data[field].scale != undefined){
					row.setMeta(field,'precision',data[field].scale);
				}
				row.data[field]['value'] = row.formatValue(field, data[field].value);
				if(data[field].meta){
					row.setMeta(field, "display", data[field].meta.display);
				}
				//处理金额大写问题
				if(dt.meta[field].numberToChinese =="true"){
					if(dt.meta[field] && dt.meta[field].display !=""){
						row.setMeta(field, "display", dt.meta[field].display);
					}else{
						row.setMeta(field, "display", row.data[field]['value']);
					}
				}
			}
			dt.addRow(row);
			var index = dt.getAllRows().length;
			dt.setRowSelect(index-1);
			var row_0 = dt.getRow(0);
			templateModel.clearRowData(row_0);
			//合计字段处理
			var data = dt.meta;
			for(var field in data){
				if(typeof data[field].isTotal !="undefined" && data[field].isTotal=="true"){//如果是合计功能
					var mainfieldid = data[field].mainTableField;
					var dtvalue =row.data[field].value;
					var maincr = viewModel.headform.getCurrentRow();
					if(maincr){
						var oldtotalval = maincr.data[mainfieldid].value;
						if(oldtotalval){
							oldtotalval = parseInt(oldtotalval)+parseInt(dtvalue);
						}else{
							oldtotalval = parseInt(dtvalue);
						}
						//maincr.data[mainfieldid].value=oldtotalval+dtvalue;
						maincr.setValue(mainfieldid,oldtotalval);
					}
					
				}
			}
		}else if(cr.status ==='upd'){
			var data = cr.data;
			for(var field in data){
				if(!cr.data[field])
					continue;	
				//处理金额大写问题
				if(dt.meta[field].numberToChinese =="true"){
					if(dt.meta[field] && dt.meta[field].display !=""){
						cr.setMeta(field, "display", dt.meta[field].display);
					}else{
						cr.setMeta(field, "display", cr.data[field]['value']);
					}
				}
			}
		}
		
		
		//合计到主表字段中
		/*var data = dt.meta;
		for(var field in data){
			if(typeof data[field].isTotal !="undefined" && data[field].isTotal=="true"){//如果是合计功能
				var mainfieldid = data[field].mainTableField;
				var dtvalue = row.data[field].value;
				var maincr = viewModel.headform.getCurrentRow();
				var oldtotalval = maincr.data[mainfieldid].value;
				maincr.data[mainfieldid].value=oldtotalval+dtvalue;
			}
		}*/
//		uitemplateCtr.app =app;
//		uitemplateCtr.viewModel = viewModel;
//		uitemplateCtr.templateModel = templateModel;
//		var headData = templateModel.getValue(datatableId);
//		//执行保存逻辑
//		var param = {};
//		param.templateInfo = viewModel.getTemplateInfo();
//		debugger;
//		param.headData = JSON.stringify(headData);
//		param.cls= 'com.yonyou.hrcloud.staff.model.StaffOrgRel';
//		$.ajax({
//			type: "POST", 
//			url: "/uitemplate_web/uitemplate_rt/data_ctr/saveData",  
//			data:param, 
//			async:true,
//			dataType: "json" ,
//			success: function(result) {
//				 //清理数据
//				if(datatableId ==="headform"){//表头
//					
//				}else{
//					var data = templateModel.getEditRowData(datatableId);
//					templateModel.updateRowData(data.body);
//				}
//			}
//		});
		return true;
	}
	
	uitemplateCtr.cancel = function(app, viewModel,templateModel,datatableId){
		var dataTable = app.getDataTable(datatableId);
		var row = dataTable.getCurrentRow();
		if(row.status == u.Row.STATUS.NEW && "headform" != datatableId){
			var row = dataTable.getRow(0);
			templateModel.clearRowData(row);
		}
	}
	//数值和金额控件的计算
	uitemplateCtr.valchange = function(app, viewModel,templateModel,datatableId){
		var dts = app.getDataTables();
		var datatables = [];
		for (var key in dts){
			var dt = dts[key]
			datatables.push(dt.id);
			var meta = dt.getMeta()
			for (var k in meta){
				var componentKey = meta[k].componentKey;
				if(typeof componentKey !="undefined" && (componentKey=="Money" || componentKey=="NumberComponent")){//如果是计算功能
					dt.on(k + '.valueChange', function(event){
						var dts = app.getDataTables();
						valuechangeFormula(dts); //值改变时触发valueChange事件
					})
					var mainfieldid = "";
					if(meta[k].moneyFields != "undefined" && JSON.parse(meta[k].moneyFields).length > 0 && JSON.parse(meta[k].moneyFields)[1].type =="field"){
						mainfieldid = JSON.parse(meta[k].moneyFields)[1].value; //计算选中的字段的fieldid
						var maincr = viewModel[key].getCurrentRow();
						if(maincr){
							var val = maincr.data[mainfieldid].value;
							if(val){
								val = parseInt(val);
							}
							maincr.setValue(k,val);
						}
					} 
					
				}
			}
		}
		
	}
	function valuechangeFormula(dts){
		for (var key in dts){
			var dt = dts[key]
			var data = dt.meta;
			for(var field in data){
				if(typeof data[field].componentKey !="undefined" && (data[field].componentKey=="Money" || data[field].componentKey=="NumberComponent")){//如果是计算功能
					var mainfieldid = "";
					if(data[field].moneyFields != "undefined" && JSON.parse(data[field].moneyFields).length > 0 &&  JSON.parse(data[field].moneyFields)[1].type =="field"){
						mainfieldid = JSON.parse(data[field].moneyFields)[1].value;
						var maincr = app.getDataTable(key).getCurrentRow();
						if(maincr){
							var val = maincr.data[mainfieldid].value;
							if(val){
								val = parseInt(val);
							}
							maincr.setValue(field,val);
						}
					} 
					
				}
			}
		}
	}
	uitemplateCtr.rowDelete = function(app, viewModel,templateModel,datatableId,delRowIndex){
		uitemplateCtr.app =app;
		uitemplateCtr.viewModel = viewModel;
		uitemplateCtr.templateModel = templateModel;
		var datatable = app.getDataTable(datatableId);
		var row = datatable.getRow(delRowIndex);
		datatable.removeRow(delRowIndex);
		//合计字段处理
		var data = datatable.meta;
		for(var field in data){
			if(typeof data[field].isTotal !="undefined" && data[field].isTotal=="true"){//如果是合计功能
				var mainfieldid = data[field].mainTableField;
				var dtvalue =row.data[field].value;
				var maincr = viewModel.headform.getCurrentRow();
				if(maincr){
					var oldtotalval = maincr.data[mainfieldid].value;
					if(oldtotalval){
						oldtotalval = parseInt(oldtotalval)-parseInt(dtvalue);
					}else{
						oldtotalval = parseInt(dtvalue);
					}
					maincr.setValue(mainfieldid,oldtotalval);
				}
			}
		}
	}
	
	uitemplateCtr.afterInit = function(viewModel,params,app,templateModel){
//		var param = {};
//		param.templateInfo = viewModel.getTemplateInfo();
//		$.ajax({
//			type: "POST", 
//			url: "/uitemplate_web/uitemplate_rt/data_ctr/loadData",  
//			data:param, 
//			async:true,
//			dataType: "json" ,
//			success: function(result) {
//				 //清理数据
//				templateModel.init(result);
//				uitemplateCtr.draw(templateModel);
//			}
//		});
		//做一个假数据，每个datatable都新增一个行数据
		var dataTables = app.getDataTables();
		for ( var key in dataTables) {
			var datatable = dataTables[key];
			datatable.createEmptyRow();
			datatable.setRowSelect(0);
		}
		//loadNavigation(param.templateInfo);
		//给空白的区域添加额外元素
	}
	
	uitemplateCtr.fresh= function(){
		
	}
	
	uitemplateCtr.draw = function(templateModel){
		$('.form_before_picture').each(function(){
			var $ele = $(this);
			var entityId = $ele[0].getAttribute('entityid');
			if(entityId ==='b5500f4e-2a90-46b5-a9d7-f0e0788aae21'){//任职信息实体ID
				var width = $ele[0].offsetWidth - 10;
				var datatableId = $ele[0].getAttribute('datatableid');
				var datatable = app.getDataTable(datatableId);
				if(datatable){
					var startDate = 'staff.staff_job.begindate';
					var endDate = 'staff.staff_job.enddate';
					var trnstype = 'staff.staff_job.trnstype';
					var infoJSonArray = JSON.parse(viewModel.getTemplateInfo());
					var startFieldId = getFieldIdByItemCode(templateModel,infoJSonArray,startDate);
					var endFieldId = getFieldIdByItemCode(templateModel,infoJSonArray,endDate);
					var trnstypeFieldId = getFieldIdByItemCode(templateModel,infoJSonArray,trnstype);
					var rows = datatable.getAllRows();
					var data = [];
					for(var index =0; index< rows.length; index++){
						var row = rows[index];
						if(row.status === 'new'){
							continue;
						}
						var rowPushData = {};
						var rowData = row.data;
						rowPushData['fromDate'] = dateFormat(rowData[startFieldId].meta.display);
						rowPushData['toDate'] = dateFormat(rowData[endFieldId].meta.display);
						rowPushData['event'] = rowData[trnstypeFieldId].meta.display;
						data.push(rowPushData);
					}
					var row = datatable.getCurrentRow();
					var selectIndex = rows.length -1;
					if(row && row.status != 'new'){
						selectIndex = datatable.getRowIndex(row);
					}
					if(data.length > 0){
						var id = datatableId + "_before";
//						$('#'+ id).show();
//						var lc = new lineChart(id, data, width, 200, '晋升', '降职', selectIndex -1,function (index){
//							index++;
//							datatable.setRowSelect(index);
//						});
//						lc.draw();
					}
					datatable.setRowSelect(selectIndex);
				}
			}else if(entityId == 'fc2b36e0-4ea3-4b87-a6d3-446c6116fb89'){//组织关系
				var datatableId = $ele[0].getAttribute('datatableid');
				var id = datatableId.substring(9);
				$('#div_' + id).find('.template_add').each(function(){
					$(this).remove();
				})
				var datatable = app.getDataTable(datatableId);
				if (datatable) {
					datatable.setRowSelect(datatable.getAllRows().length-1);
				}
			}
		});
		
		function getFieldIdByItemCode(templateModel,infoJSonArray,queryCode){
			var fieldId;
			if(infoJSonArray && infoJSonArray.length>0){
				for(var index =0 ; index < infoJSonArray.length; index++){
					var jsonObject = infoJSonArray[index];
					if(jsonObject == undefined){
						continue;
					}
					for(var key in jsonObject){
						var fieldObj = jsonObject[key];
						if(fieldObj){
							var itemCode = fieldObj['itemCode'];
							if(itemCode == queryCode){
								return key;
							}
						}
					}
				}
			}
			return fieldId;
		}
		
		function dateFormat(value){
			if(value){
				var values = value.split('-');
				return values[0] + '年' + values[1] + '月';
			}
		}
	}
	
	return uitemplateCtr;
});