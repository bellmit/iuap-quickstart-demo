define(['jquery','knockout'],function($,ko){
	var viewctrl = {};
	viewctrl.ko = ko;
	
	viewctrl.init = function(viewModel,bodyformIds){ //初始化明细子表数据,主要是要根据真实数据、默认行数
		if(bodyformIds==undefined){
			return;
		}
		for(var i =0; i < bodyformIds.length;i++){
			var bodyformId= bodyformIds[i];
			var body = viewModel[bodyformId];
			if(body == undefined){
				continue;
			}
			var len = getDefaultRows(body);
			if(len < 2){
				body.createEmptyRow();
				body.setRowSelect(0);
			}else{
				for(var index =0; index < len; index++){
					 var row = new $.Row({parent: body});
					 body.addRow(row);
				}
				body.setRowSelect(0);
			}
		}
		viewctrl.bodyformIds = bodyformIds;
		viewctrl.model = viewModel;
	}
 	
	viewctrl.add = function(viewModel,e, templateUI){ //新增行
		if(e==undefined || e.target==undefined || e.target.id==undefined){
			return;
		}
		var id = e.target.id;
		if(id.indexOf("dtadd_") == 0){
			var bodyFormId = e.target.id.substring(6);
			var bodyId = bodyFormId.replace("_add","").replace("_form","");
			var body = viewModel[bodyId];
			if(body==undefined){
				return;
			}
			body.setRowSelect(0);
			templateUI.addEditClick(bodyId);
		}
	}
	
	viewctrl.del = function(viewModel,e){ //删除行
		if(e==undefined || e.target==undefined || e.target.id==undefined){
			return;
		}
		var id = e.target.id;
		if(id.indexOf("dtdel_") == 0){
			var bodyFormId = id.substring(6);
			var body = viewModel[bodyFormId];
			if(body==undefined){
				return;
			}
			var focusIndex = body.getFocusIndex();
			if(focusIndex == -1){
				focusIndex = body.getSelectedIndex();
			}
			if(focusIndex != -1){
				body.removeRow(focusIndex);
			}else{
				$.showMessageDialog({type:"info",title:"请选择删除行！",msg:"",backdrop:true});
			}
			if(body.getAllRows.length > 0){//设置
				//body.setRowSelect(0);
			}
		}
	}
	
	viewctrl.edit = function(viewModel,e,templateUI){ //编辑行
		if(e==undefined || e.target==undefined || e.target.id==undefined){
			return;
		}
		var id = e.target.id;
		if(id.indexOf("dtedit_") == 0){
			var bodyFormId = id.substring(7);
			var bodyId = bodyFormId.replace("_add","").replace("_form","");
			var body = viewModel[bodyId];
			if(body==undefined){
				return;
			}
			templateUI.addEditClick(bodyId);
		}
	}
	
	viewctrl.loadColor = function(viewModel){ //修改子表label颜色
		var colors = viewModel.colors;
		if(colors){
			var meta = viewModel.bodyform.meta;
			for(var key in meta){
				if("pk_boins"===key || "id"===key){
					continue;
				}
				$(".u-grid-header-link[field="+key+"]").css("color",colors[key]);
			}
		}
	}
	
	function clearRow(row){
		var data = row.getData().data;
		for(var key in data){
			if(key =="pk_boins"){
				continue
			}
			row.data[key]['pk'] = row.formatValue(key, null);
			row.data[key]['value'] = row.data[key]['pk'];
		}
		return row;
	}
	
	function getDefaultRows(datatable){
		var len = 1;
		var meta = datatable.meta;
		for(var key in meta){
			var item = meta[key];
			if(item && item.defaultRows){
				len = item.defaultRows;
				break;
			}
		}
		return len;
	}
	
	function getColumnFields(compDetail){
		var fields = [];
		for(var i=0; i < compDetail.length; i++){
			var comp = compDetail[i];
			var fieldId = comp.fieldId;
			fields.push(fieldId);
		}
		return fields;
	}
	
	function setRowValue(row, fields){
		if(row==undefined || fields.length ==0){
			return;
		}
		for(var i in fields){
			if(row.getData().data[fields[i]]){
				row.getData().data[fields[i]].value = i;
			}
		}
		return row;
	}
	
	window.sumRenderType = function(e){
		var value = e.value;
		var gridCompColumn = e.gridCompColumn;
		var element = e.element;
		var gridObj = e.gridObj;
		if(gridCompColumn.options.sumCol){
			var metaObj = getBodyMetaObjByFieldId(gridCompColumn.options.field);
			if(metaObj == null){
				return;
			}
			var mainTableField = metaObj.mainTableField;
			var decimalPlace = metaObj.decimalPlace;
			var componentKey = metaObj.componentKey;
			setMainTableRow(mainTableField,value);
		}
	}
	
	function getBodyMetaObjByFieldId(fieldId){
		if(viewctrl.model==undefined){
			return null;
		}
		var bodyformIds = viewctrl.bodyformIds;
		for(var index =0; index < bodyformIds.length; index++){
			var bodyformId = bodyformIds[index];
			var body = viewctrl.model[bodyformId];
			if(body == undefined){
				continue;
			}
			var meta = body.meta;
			for(var key in meta){
				if(key === fieldId){
					return meta[key];
				}
			}
		}
	}
	
	function setMainTableRow(field,value,decimalPlace){
		var row = viewctrl.model.headform.getRow(0);
		if(row == undefined || field ==undefined || ""===field){
			return;
		}
		row.setValue(field,value);
	}
	
	return viewctrl;
})