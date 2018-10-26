//模板数据工具类
var TemplateModel = function(app, viewModel, ctrl){
	this.app = app;
	this.viewModel = viewModel;
	this.ctrl = ctrl;
	this.gridInteractType = $.GridInteractType.NCNEW;
	this.dataTables = {};
}

$.GridInteractType = {
	NCCLASSIC: 'ncclassic',
	NCNEW: 'ncnew'
}

TemplateModel.fn = TemplateModel.prototype;


TemplateModel.fn.insertRow = function(datatableId){
	var datatable = this.app.getDataTable(datatableId);
	var row = new u.Row({parent:datatable});
	datatable.insertRow(0,row);
	datatable.setRowSelect(0);
}

TemplateModel.fn.init = function(data,isFireEvent){
	 //清理数据
	this.clearData();
	var headData = data.head;
	var body = data.body;
	this.loadHeadData(headData,isFireEvent);
	this.createAllBodyEmptyRow();
	this.loadBodyData(body,isFireEvent);
}

/**
 * 根据fieldId获取当前的datatable
 * @param fieldId
 */
TemplateModel.fn.getDataTableByFieldId = function(fieldId){
	var dataTables = this.app.getDataTables();
	for ( var key in dataTables) {
		var dt = dataTables[key];
		if(dt && dt.meta[fieldId]){
			return dt;
		}
	}
}

TemplateModel.fn.clearData = function(){
	var dataTables = this.app.getDataTables();
	for ( var key in dataTables) {
		dataTables[key].removeAllRows();
	}
}

TemplateModel.fn.createAllBodyEmptyRow = function(){
	var dataTables = this.app.getDataTables();
	for ( var key in dataTables) {
		if(key == "headform"){
			continue;
		}
		dataTables[key].createEmptyRow();
		dataTables[key].setRowSelect(0);
	}
}


TemplateModel.fn.loadHeadData = function(headData,isFireEvent){
	var row;
	if(isFireEvent){
		row = this.viewModel.headform.createEmptyRow();
		this.setRowValueAndFire(row, headData);
	}else{
		row = new u.Row({parent:this.viewModel.headform});
		this.setRowValue(row, headData);
	}
	
	var fullName = headData.fullname;
	if(fullName){
		this.viewModel.headform.addParam('cls',fullName);
	}
	if(isFireEvent==undefined || !isFireEvent){
		this.viewModel.headform.addRow(row);
	}
	this.viewModel.headform.setRowSelect(0);
	this.updateHeadRowValue(row,headData, this.viewModel.headform);
}

TemplateModel.fn.loadBodyData = function(body){
	if(!body)
		return;
	var bodyDatas = body.bodys;
	if(bodyDatas == undefined)
		return;
	var tabRows = {};
	for (var i=0, count = bodyDatas.length; i < count; i++){
		var bodyData = bodyDatas[i];
		if(bodyData == undefined || bodyData.pk == undefined || bodyData.pk.subFormId==undefined) {
			continue;
		}
		var dataTable = this.viewModel[bodyData.pk.subFormId];
		var fullName = bodyData.fullname;
		if(dataTable == undefined){
			continue;
		}
		if(fullName){
			dataTable.addParam('cls',fullName);
		}
		var add = bodyData.add;
		if(add == "false"){
			continue;
		}
		var row = new u.Row({parent:dataTable}); 
		//设置当前的实例pk
		row.data.id = {};
		row.data.id.key=bodyData.pk.pk;
		row.data.id.value=bodyData.pk.pk;
		this.setRowValue(row, bodyData);
		var curTabRows = tabRows[bodyData.pk.subFormId];
		if(curTabRows == null){
			curTabRows = [];
			tabRows[bodyData.pk.subFormId] = curTabRows;
		}
		row.status = u.Row.STATUS.NORMAL;
		curTabRows.push(row);
	}
	for(var key in tabRows){
		var dataTable = this.viewModel[key];
		var curTabRows = tabRows[key];
//		if(curTabRows.length > 0){//添加一个新的空白行
//			var row = new u.Row({parent:dataTable}); 
//			curTabRows.push(row);
//		}
		dataTable.addRows(curTabRows);
	}
	var pageCount = bodyDatas.length/10 + 1;
}

TemplateModel.fn.updateData = function(data,datatableid){
	if(!data){
		return;
	}
	var datas = data.entitiesData;
	if(datas == undefined){
		return;
	}
	var datatable = this.app.getDataTable(datatableid);
	if(datatable == undefined){
		return;
	}
	datatable.clear();
	datatable.createEmptyRow();
	datatable.setRowSelect(0);
	var tabRows = {};
	for(var i = 0, count = datas.length; i < count; i++){
		var rowData = datas[i];
		var id = rowData.pk.subFormId
		if(id == undefined || datatableid != id){
			continue;
		}
		var row = new u.Row({parent:datatable}); 
		//设置当前的实例pk
		row.data.id = {};
		row.data.id.key=rowData.pk.pk;
		row.data.id.value=rowData.pk.pk;
		this.setRowValue(row, rowData);
		var curTabRows = tabRows[rowData.pk.subFormId];
		if(curTabRows == null){
			curTabRows = [];
			tabRows[datatableid] = curTabRows;
		}
		row.status = u.Row.STATUS.NORMAL;
		curTabRows.push(row);
	}
	for(var key in tabRows){
		var dataTable = this.viewModel[datatableid];
		var curTabRows = tabRows[datatableid];
		datatable.addRows(curTabRows);
	}
	var pageCount = rowData.length/10 + 1;
}

TemplateModel.fn.updateRowData = function(body){
	if(!body)
		return;
	var bodyDatas = body.bodys;
	if(bodyDatas == undefined)
		return;
	var tabRows = {};
	for (var i=0, count = bodyDatas.length; i < count; i++){
		var bodyData = bodyDatas[i];
		var dataTable = this.viewModel[bodyData.pk.subFormId];
		if(dataTable == undefined){
			continue;
		}
		//第一行数据置空
		var firstRow = dataTable.getRow(0);
		this.clearRowData(firstRow);
		var currentRow = dataTable.getCurrentRow();
		if(currentRow.status == u.Row.STATUS.UPDATE || currentRow.status ==u.Row.STATUS.NORMAL){//update current row
			this.setRowValue(currentRow, bodyData);
		}else{
			var row = new u.Row({parent:dataTable}); 
			//设置当前的实例pk
			row.data.id = {};
			row.data.id.key=bodyData.pk.pk;
			row.data.id.value=bodyData.pk.pk;
			this.setRowValue(row, bodyData);
			var curTabRows = tabRows[bodyData.pk.subFormId];
			if(curTabRows == null){
				curTabRows = [];
				tabRows[bodyData.pk.subFormId] = curTabRows;
			}
			row.status = u.Row.STATUS.NORMAL;
			curTabRows.push(row);
		}
	}
	for(var key in tabRows){
		var dataTable = this.viewModel[key];
		var curTabRows = tabRows[key];
		dataTable.addRows(curTabRows);
	}
	var pageCount = bodyDatas.length/10 + 1;
}
TemplateModel.fn.clearRowData = function(row){
	var data = row.getData().data;
	for(var key in data){
		var obj = data[key];
		if(obj && obj['changed']){
			//row.data[key]['value'] = null;
			row.data[key]['changed'] = false;
			row.setValue(key,null);
			row.setMeta(key,'display',null)
		}
	}
}

TemplateModel.fn.setRowValue = function(row, data){
	for(var field in data){
		if(!row.data[field])
			continue;	
		if(data[field].scale != undefined){
    		row.setMeta(field,'precision',data[field].scale);
   		}
		row.data[field]['value'] = row.formatValue(field, data[field].pk);
		row.setMeta(field, "display", data[field].name);
	}
}

TemplateModel.fn.setRowValueAndFire = function(row, data){
	for(var field in data){
		if(!row.data[field])
			continue;	
		if(data[field].scale != undefined){
    		row.setMeta(field,'precision',data[field].scale);
   		}
		row.setValue(field, data[field].pk);
		row.setMeta(field, "display", data[field].name);
	}
}

TemplateModel.fn.updateHeadRowValue = function(row, data, datatable){
	var meta = datatable.meta;
	for(var field in data){
		if(!row.data[field])
			continue;
		var o = meta[field];
		if("Dateinterval" === o.componentKey){
			var value = data[field].pk;
			value = value || "";
			var values = value.split(",");
			var startField = o.startField;
			var endField = o.endField;
			if(row.data[startField]){
				if(row.data[startField].scale != undefined){
					row.setMeta(startField,'precision',values[0]);
				}
				row.setValue(startField, values[0]);
				row.setMeta(startField, "display", values[0]);
			}
			if(row.data[endField] && values.length > 1){
				if(row.data[endField].scale != undefined){
					row.setMeta(endField,'precision',values[1]);
				}
				row.setValue(endField, values[1]);
				row.setMeta(endField, "display", values[1]);
			}
		}
		if(data[field].scale != undefined){
			row.setMeta(field,'precision',data[field].scale);
		}
		row.setValue(field, data[field].pk);
		row.setMeta(field, "display", data[field].name);
	}
}

TemplateModel.fn.updateRow = function(row, data){
	if(data== undefined){
		return;
	}
	for(var field in data){
		if(!row.data[field]){
			continue;
		}
		if(data[field].scale != undefined){
			row.setMeta(field,'precision',data[field].scale);
		}
		if(data[field].meta){
			row.setMeta(field, "display", data[field].meta.display);
		}
		row.setValue(field, data[field].value);
		//row.data[field]['value'] = row.formatValue(field, data[field].value);
	}
}

TemplateModel.fn.getValue = function(){
	var data = {};
	var dataTables = this.app.getDataTables();
	var body = {};
	var bodys = [];
	for(var key in dataTables){
		var dataTable = dataTables[key];
		if(dataTable.id === "headform"){//表头
			var head = data.head || {};
			var rows = dataTable.getAllRows();
			for(var i = 0, count = rows.length; i < count; i++){
				var rowData = rows[i].data;
				for(var key in rowData){
					if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
						continue;
					head[key] = rowData[key].value;
				}
			}
			data.head = head;
		}else{ //表体
			var rows = dataTable.getAllRows();
			var rlen = rows.length;
			if(this.gridInteractType == $.GridInteractType.NCNEW) {
				if(this.model.getUIState() !== $.UIState.NOT_EDIT) {
					rlen = rows.length-1;
				}
			}
			
			for(var i = 0, count = rlen; i < count; i++){
				var rowData = rows[i].data;
				var bodyData = {};
				bodyData.cls = dataTable.getParam("cls");
				for(var key in rowData){
					if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
						continue;
					bodyData[key] = rowData[key].value;
				}
				bodys.push(bodyData);
			}
		}
	}
	body.bodys = bodys;
	data.body = body;
	return data;
}

/**
 * 添加设置值
 * @param datatableid
 * @param itemCode
 * 直接通过itemCode设置datatable的值
 */

TemplateModel.fn.setItemCodeValue = function(datatableid, itemCode, value, displayName){
	var datatable = this.app.getDataTable(datatableid);
	if(datatable){
		var key = this.getFieldIdByCode(datatableid,itemCode);
		var row = datatable.getCurrentRow();
		if(key != null && row){
			row.setValue(key,value);
			if(displayName){
				row.setMeta(key,'display',displayName);
			}
		}
		
	}
}

/**
 * 获取值
 * @param datatableid 
 * @param itemCode 
 */
TemplateModel.fn.getValueByItemCode = function(datatableid, itemCode){
	var datatable = this.app.getDataTable(datatableid);
	if(datatable){
		var key = this.getFieldIdByCode(datatableid,itemCode);
		var row = datatable.getCurrentRow();
		if(row){
			var rowData = row.data;
			if(rowData[key]){
				return rowData[key].value;
			}e
		}else{
			return null;
		}
	}
}

/**
 * 获取模板信息
 */
TemplateModel.fn.getTemplateInfo = function(){
	var vm = this.getViewModelByApp();
	if(vm){
		return vm.getTemplateInfo();
	}
}

/**
 * 通过app获取datatable,然后通过datatable的parent获取viewModel
 */
TemplateModel.fn.getViewModelByApp = function (){
	if(this.viewModel){
		return this.viewModel;
	}
	var dataTables = this.app.getDataTables();
	var vm;
	for ( var key in dataTables) {
		vm = dataTables[key].parent;
		if(vm){
			this.viewModel = vm;
		}
		break;
	}
	return vm;
}

/**
 * 设置headform的编辑状态
 * @param state 
 * true 为 编辑态
 * false 为 浏览态
 */
TemplateModel.fn.setHEdit = function (state){
	vm = this.getViewModelByApp();
	if(vm){
		vm.headform_isEditable(state);
	}
}

/**
 * 设置可使用
 * 根据itemCode
 */
TemplateModel.fn.setItemCodeEnable = function(datatableid, itemCode){
	var key = this.getFieldIdByCode(datatableid,itemCode);
	var datatable = this.app.getDataTable(datatableid);
	var row = datatable.getCurrentRow();
	if(row){
		row.setMeta(key,'enable',true);
	}
	
}

/**
 * 设置不可使用
 * 根据itemCode
 */
TemplateModel.fn.setItemCodeUnable = function(datatableid, itemCode){
	var key = this.getFieldIdByCode(datatableid,itemCode);
	var datatable = this.app.getDataTable(datatableid);
	var row = datatable.getCurrentRow();
	if(key != null && row){
		row.setMeta(key,'enable',false);
	}
}

TemplateModel.fn.getFieldIdByItemCode = function(infoJSonArray,queryCode){
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

TemplateModel.fn.getFieldIdByItemCodeAndInfo = function(templateInfo,queryCode){
	var fieldId;
	if(templateInfo == undefined){
		templateInfo = this.viewModel.getTemplateInfo();
	}
	var infoJSonArray = JSON.parse(templateInfo);
	return this.getFieldIdByItemCode(infoJSonArray,queryCode);
}

TemplateModel.fn.getFieldIdByCode = function(datatableId, queryCode){
	var meta = this.app.getDataTable(datatableId).meta;
	for(var key in meta){
		var fieldObj = meta[key];
		if(fieldObj){
			var itemCode = fieldObj['itemCode'];
			if(itemCode == queryCode){
				if(key==undefined){
					var templateInfo = this.getTemplateInfo();
					key = this.getFieldIdByItemCodeAndInfo(templateInfo,queryCode);
				}
				return key;
			}
		}
	}
}


TemplateModel.fn.dateFormat = function(value){
	if(value){
		var values = value.split('-');
		return values[0] + '年' + values[1] + '月';
	}
}

TemplateModel.fn.getValue = function(datatableId){
	var data = {};
	var dataTable = this.app.getDataTable(datatableId);
	var body = {};
	var bodys = [];
	if(dataTable){
		if(datatableId == "headform"){
			var head = data.head || {};
			var rows = dataTable.getAllRows();
			for(var i = 0, count = rows.length; i < count; i++){
				var rowData = rows[i].data;
				for(var key in rowData){
					if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
						continue;
					head[key] = rowData[key].value;
				}
			}
			data.head = head;
		}else{
			var row = dataTable.getCurrentRow();
			if(row){
				var rowData = row.data;
				var bodyData = {};
				bodyData.cls = dataTable.getParam("cls");
				bodyData.pk = {};
				bodyData.pk.subFormId = datatableId;
				for(var key in rowData){
					if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
						continue;
					bodyData[key] = rowData[key].value;
				}
				bodys.push(bodyData);
			}
		}
	}
	body.bodys = bodys;
	data.body = body;
	return data;
}

TemplateModel.fn.getCurrentRowValue = function(datatableId){
	var data = {};
	var dataTable = this.app.getDataTable(datatableId);
	var body = {};
	var bodys = [];
	if(dataTable){
		if(datatableId == "headform"){
			var head = data.head || {};
			var row = dataTable.getCurrentRow();
			if(row){
				var rowData = row.data;
				rowData.cls = dataTable.getParam("cls");
				for(var key in rowData){
					if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
						continue;
					head[key] = rowData[key].value;
				}
			}
			data.head = head;
		}else{
			var row = dataTable.getCurrentRow();
			if(row){
				var rowData = row.data;
				var bodyData = {};
				bodyData.cls = dataTable.getParam("cls");
				bodyData.pk = {};
				bodyData.pk.subFormId = datatableId;
				for(var key in rowData){
					if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
						continue;
					bodyData[key] = rowData[key].value;
				}
				bodys.push(bodyData);
			}
		}
	}
	body.bodys = bodys;
	data.body = body;
	return data;
}

TemplateModel.fn.getEditRowData = function(datatableId){
	var data = {};
	var dataTable = this.app.getDataTable(datatableId);
	var body = {};
	var bodys = [];
	if(dataTable){
		if(datatableId == "headform"){
			var head = data.head || {};
			var rows = dataTable.getAllRows();
			for(var i = 0, count = rows.length; i < count; i++){
				var rowData = rows[i].data;
				for(var key in rowData){
					if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
						continue;
					head[key] = {};
					head[key].pk = rowData[key].value;
					head[key].value = rowData[key].value;
				}
			}
			data.head = head;
		}else{
			var row = dataTable.getCurrentRow();
			if(row){
				var rowData = row.data;
				var bodyData = {};
				bodyData.cls = dataTable.getParam("cls");
				var curIndex = dataTable.getIndexByRowId(row.rowId)
				bodyData.pk = {};
				bodyData.pk.subFormId = datatableId;
				bodyData.pk.index = curIndex;
				for(var key in rowData){
					if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
						continue;
					bodyData[key] = {};
					bodyData[key].pk = rowData[key].value;
					bodyData[key].value = rowData[key].value;
				}
				bodys.push(bodyData);
			}
		}
	}
	body.bodys = bodys;
	data.body = body;
	return data;
}

TemplateModel.fn.setEnable = function(enable){
	var dataTables = this.app.getDataTables();
	for(var key in dataTables){
		dataTables[key].setEnable(enable);
	}
}

TemplateModel.fn.setEnableByDatatableId = function(datatableId,enable){
	var dataTable = this.app.getDataTable(datatableId);
	if(dataTable){
		dataTable.setEnable(enable);
	}
}

TemplateModel.fn.setUpdateRow = function(datatableId){
	var dataTable = this.app.getDataTable(datatableId);
	if(dataTable){
		var row = dataTable.getCurrentRow();
		row.status = u.Row.STATUS.NORMAL;
	}
}

TemplateModel.fn.setclearRowData = function(datatableId){
	var dataTable = this.app.getDataTable(datatableId);
	if(dataTable){
		var row = dataTable.getCurrentRow();
	}
}

TemplateModel.fn.deleteRow = function(row,datatableId){
	var dataTable = this.app.getDataTable(datatableId);
	if(dataTable){
		dataTable.removeRowByRowId(row.rowId);
	}
}

TemplateModel.fn.setIsEditable = function(isEditalbe){
	this.viewModel.isEditable(isEditalbe);
}

TemplateModel.fn.setViewModel = function(viewModel){
	this.viewModel = viewModel;
}

/**
 * @param element dom上的元素
 * @parma hiddenFilter 默认不设置 设置true，过滤不验证当前dom上的隐藏字段
 */
TemplateModel.fn.uiCompAllValidate = function(element, hiddenFilter,retUnpass){
	if(hiddenFilter == undefined || !hiddenFilter){
		return this.app.compsValidate(element);
	}else{
		var comps = this.app.getComps(element),
        	passed = true,
        	unpassed=[];
	    for (var i = 0; i < comps.length; i++) {
	        if (comps[i].doValidate && comps[i].required==='true'){
	            var result = comps[i].doValidate({trueValue:true,showMsg:true});
	            result = typeof result === 'object' ? result['passed'] : result;
	            passed = result && passed;
	            if(!result) unpassed.push(comps[i])
	        }
	    }
	    if(retUnpass) return unpassed;
	    return passed
	}
}

/**
 * 通过设置hiddenFilter，可以过滤掉相关隐藏字段验证问题
 * @param element dom上的元素
 * @param datatableid
 * @parma hiddenFilter 默认不设置 设置true，过滤不验证当前dom上的隐藏字段
 */
TemplateModel.fn.uiCompAllValidateByDatatableId = function(element,datatableid,hiddenFilter,retUnpass){
	if(hiddenFilter == undefined || !hiddenFilter){
		return this.uiCompsValidateByDatatableId(datatableid,element);
	}else{
		var comps = this.app.getCompsByDataTable(datatableid,element),
        	passed = true,
        	unpassed=[];
	    for (var i = 0; i < comps.length; i++) {
	        if (comps[i].doValidate && comps[i].required==='true'){
	            var result = comps[i].doValidate({trueValue:true,showMsg:true});
	            result = typeof result === 'object' ? result['passed'] : result;
	            passed = result && passed;
	            if(!result) unpassed.push(comps[i])
	        }
	    }
	    if(retUnpass) return unpassed;
	    return passed
	}
}

/**
 * 根据App.fn.getCompsByDataTable获取相关datatable的控件，验证
 * @param element dom上的元素
 * @param datatableid
 */
TemplateModel.fn.uiCompsValidateByDatatableId = function (datatableid,element, retUnpass) {
    var comps = this.app.getCompsByDataTable(datatableid,element),
        passed = true,
        unpassed=[];
    for (var i = 0; i < comps.length; i++) {
        if (comps[i].doValidate){
            var result = comps[i].doValidate({trueValue:true,showMsg:true});
            result = typeof result === 'object' ? result['passed'] : result;
            passed = result && passed;
            if(!result) unpassed.push(comps[i])
        }
    }
    if(retUnpass) return unpassed;
    return passed
}

/**
 * @param layoutId 布局唯一Id
 * @param editable 设置布局区域中所以控件的可编辑行，true为编辑，false为浏览
 */
TemplateModel.fn.setLayoutEditable = function(layoutId, editalbe){
	if(layoutId==undefined){
		return;
	}
	var fieldsets = $('div[id='+layoutId+']').find('fieldset');//寻找布局中的所以fieldset容器
	var fieldsets = $(element).find('fieldset');
	for(var i=0;i<fieldsets.length;i++){
		var fieldset = fieldsets[i];
		var fieldId = $(fieldset).attr('fieldname');
		var editDomId = 'edit_' + fieldId;
		var viewDomId = 'view_' + fieldId;
		if(editalbe){//设置编辑性
			$('#' + editDomId).show();
			$('#' + editDomId).find('input').show();
			$('#' + viewDomId).hide();
		}else{
			$('#' + editDomId).hide();
			$('#' + editDomId).find('input').hide();
			$('#' + viewDomId).show();
		}
	}
}

/**
 * 设置模板控件编辑性
 * @param itemCode 控件编码
 * @param editable 控件编辑性,true为编辑，false为浏览
 * @param datatableId
 */
TemplateModel.fn.setCompEditable = function(itemCode, editable, datatableId){
	if(itemCode==undefined){
		return;
	}
	var fieldId = this.getFieldIdByCode(datatableid,itemCode);
	if(fieldId){
		var editDomId = 'edit_' + fieldId;
		var viewDomId = 'view_' + fieldId;
		if(editable){//控件可编辑
			$('#' + editDomId).show();
			$('#' + editDomId).find('input').show();
			$('#' + viewDomId).hide();
		}else{//控件浏览
			$('#' + editDomId).hide();
			$('#' + editDomId).find('input').hide();
			$('#' + viewDomId).show();
		}
	}
}

/**
 * @param element 区域dom元素
 * @param editable 区域元素所以控件可编辑控件，true编辑，false为浏览
 */
TemplateModel.fn.setLayoutEditableByByElement = function(element, editalbe){
	if(element==undefined){
		return;
	}
	var fieldsets = $(element).find('fieldset');
	for(var i=0;i<fieldsets.length;i++){
		var fieldset = fieldsets[i];
		var fieldId = $(fieldset).attr('fieldname');
		var editDomId = 'edit_' + fieldId;
		var viewDomId = 'view_' + fieldId;
		if(editalbe){//设置编辑性
			$('#' + editDomId).show();
			$('#' + editDomId).find('input').show();
			$('#' + viewDomId).hide();
		}else{
			$('#' + editDomId).hide();
			$('#' + editDomId).find('input').hide();
			$('#' + viewDomId).show();
		}
	}
}

/**
 * 处理事件监听
 * 回调动态加载方法
 */
TemplateModel.fn.addListener = function(listeners){
	if(listeners == undefined){
		return;
	}
    app.uit = {};
	app.uit.fields = {};
    app.uit.urls = [];
	//统计,每个fieldId可以触发多次valuechange,触发多个url
	for(var key in listeners){
		var itemUrl = listeners[key]['itemListener'];
		if(itemUrl){
			var dt = this.getDataTableByFieldId(key);
			if(dt){
                var targetCode = dt.meta[key]['itemCode'];
				//解析url
				var codes = itemUrl.split('?');
				if(codes.length > 1){
					var requireUrl = codes[0];
					var params = codes[1].split('&');//参数
					var relationCode = params[0].split('=');
					var contentParam;
					if(params.length > 1 && params[1] && params[1].split('=').length > 1){
						contentParam = params[1].split('=')[1];
					}
					if(relationCode.length > 1 && relationCode[1]){
						var relationCodes = relationCode[1].split(',');
						if(relationCodes.length > 0){
							for(var i=0; i < relationCodes.length;i++){
								var r_code = relationCodes[i];
								var fieldId = this.getFieldIdByCode(dt.id,r_code);
								if(app.uit.fields[fieldId] == undefined){
									app.uit.fields[fieldId] = {};
									app.uit.fields[fieldId].dt = dt;
                                    app.uit.fields[fieldId].fieldParams = [];
								}
                                var fieldParam = {};
                                fieldParam.contentParam = contentParam;
                                fieldParam.requireUrl = requireUrl;
                                fieldParam.targetField = key;
                                fieldParam.targetCode = targetCode;
                                app.uit.fields[fieldId].fieldParams.push(fieldParam);
                                if(app.uit.urls.toString().indexOf(requireUrl) == -1){
                                    app.uit.urls.push(requireUrl);
                                }
							}
						}
					}
				}
				
			}
		}
	}
	
    if(app.uit.urls && app.uit.urls.length > 0){
        require(app.uit.urls,function(){
             for(var field in app.uit.fields){
                var o = app.uit.fields[field];
                if(o == undefined){
                    continue;
                }
                var dt = o.dt;
                dt.on((field +'.valueChange'),function(ele){
                    var e = app.uit.fields[ele.field];
                    var requireUrls = e.requireUrls;
                    var fieldParams = e.fieldParams;
                    app.uit.changeItem = ele;
                    if(app.uit.changeItem.templateModel==undefined){
                        app.uit.changeItem.templateModel = new TemplateModel(app);
                    }
                    var datatableData = app.uit.changeItem.templateModel.getValue(ele.dataTable);
                    app.uit.changeItem.data = datatableData;
                    if(e.dt.meta[ele.field]){
                        app.uit.changeItem.code = e.dt.meta[ele.field]['itemCode'];
                    }
                    if(fieldParams && fieldParams.length > 0){
                        for(var index = 0; index < fieldParams.length;index++){
                            var fieldParam = fieldParams[index];
                            var contentParam = fieldParam.contentParam;
                            var requireUrl = fieldParam.requireUrl;
                            var targetField = fieldParam.targetField;
                            var targetCode = fieldParam.targetCode;
                            app.uit.changeItem.contentParam = contentParam;
                            app.uit.changeItem.targetField = targetField;
                            app.uit.changeItem.targetCode = targetCode;
                            if(requireUrl){
                                var jsModule = require(requireUrl);
                                if(jsModule && (typeof jsModule.editCallback === 'function')){
                                    jsModule.editCallback.call(this,app.uit.changeItem);
                                }
                            }
                        }
                    }
                });
            }
        });
       
    }
	
}

/**
 * 调整ue样式
 */
TemplateModel.fn.uiAdjust = function(){
	var divDom = $('.cardpanel').find('div')[0];
	if(divDom){
		var attr = divDom.getAttribute('componentKey');
		if(attr && attr==='ColumnPanel'){
			var prevDom = $(divDom).prev();
			if(prevDom.length==0){
				$(divDom).css('margin-top','20px');
			}
		}
	}
}