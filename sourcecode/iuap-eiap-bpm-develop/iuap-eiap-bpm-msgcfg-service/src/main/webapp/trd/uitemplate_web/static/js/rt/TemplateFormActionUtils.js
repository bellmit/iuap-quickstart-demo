// 模板前台表体按钮注册工具
// ======================

ActionUtils.prototype.getActions = function(){
	var self = this;
	var btns = [];
	btns.push({
		id:"editLine",
		text:"修改",
		icon:"edit.png",
		onclick:function(e) {
			var $tr = $(e.target).closest('tr');
			var index = $('tr',$tr.parent()).index($tr);
			var dataTable = this.dataTable;
			var eidtId = dataTable.id.substring(9);
			if($('#' + eidtId + '_edit_tr')[0] && $('#' + eidtId + '_edit_tr')[0].style.display == 'block'){
        		$.showMessageDialog({type:"info",title:"提示",msg: '请先处理当前修改',backdrop:true});
        		return;
        	} else {
        		dataTable.setRowSelect(index + 1);
				dataTable.setRowFocus(index + 1);
        	}
			self.billForm.isCopyOrAddEdit = false;
			if(typeof self.ctrl != 'undefined' && self.ctrl["afterEdit"]){
				self.ctrl["afterEdit"].call(this,dataTable);
			}
		}
	});
	btns.push({
		id:"delLine",
		text:"删除",
		icon:"del.png",
		onclick:function(e) {
			var $tr = $(e.target).closest('tr');
			var index = $('tr',$tr.parent()).index($tr);
			var dataTable = this.dataTable;
			var eidtId = dataTable.id.substring(9);
			if($('#' + eidtId + '_edit_tr')[0] && $('#' + eidtId + '_edit_tr')[0].style.display == 'block'){
        		$.showMessageDialog({type:"info",title:"提示",msg: '请先处理当前修改',backdrop:true});
        		return;
        	} else {
        		dataTable.removeRow(index);
        		dataTable.setRowFocus(dataTable.rows().length-1, false, true);
        	}
			if(typeof self.ctrl != 'undefined' && self.ctrl["afterDelete"]){
				self.ctrl["afterDelete"].call(this,dataTable);
			}
		}
	});
//	btns.push({
//		id:"copyLine",
//		text:"复制",
//		icon:"copy.png",
//		inmore:true,
//		onclick:function(e) {
//			var $tr = $(e.target).closest('tr');
//			var index = $('tr',$tr.parent()).index($tr);
//			var dataTable = this.dataTable;;
//			var eidtId = dataTable.id.substring(9);
//			if($('#' + eidtId + '_edit_tr')[0] && $('#' + eidtId + '_edit_tr')[0].style.display == 'block') {
//        		$.showMessageDialog({type:"info",title:"提示",msg: '请先处理当前修改',backdrop:true});
//        		return;
//        	} else {
//        		var row = dataTable.getRow(index);
//				var insertIndex = index+1;
//				dataTable.copyRow(insertIndex, row);
//				dataTable.setRowSelect(insertIndex);
//				dataTable.setRowFocus(insertIndex);
//        	}
//			self.billForm.isCopyOrAddEdit = true;
//			if(typeof self.ctrl != 'undefined' && self.ctrl["afterCopy"]){
//				self.ctrl["afterCopy"].call(this,dataTable);
//			}
//		}
//	});
//	btns.push({
//		id:"addLine",
//		text:"插入",
//		icon:"new.png",
//		inmore:true,
//		onclick:function(e) {
//			var $tr = $(e.target).closest('tr');
//			var index = $('tr',$tr.parent()).index($tr);
//			var dataTable = this.dataTable;
//			var eidtId = dataTable.id.substring(9);
//			if($('#' + eidtId + '_edit_tr')[0] && $('#' + eidtId + '_edit_tr')[0].style.display == 'block') {
//        		$.showMessageDialog({type:"info",title:"提示",msg: '请先处理当前修改',backdrop:true});
//        		return;
//        	} else {
//        		dataTable.insertRow(index)
//				dataTable.setRowFocus(index);
//        	}
//			self.billForm.isCopyOrAddEdit = true;
//			if(typeof self.ctrl != 'undefined' && self.ctrl["afterAdd"]){
//				self.ctrl["afterAdd"].call(this,dataTable);
//			}
//		}
//	});
	return btns;
}

ActionUtils.prototype.getDetailActions = function(){
	var self = this;
	var btns = [];
	btns.push({
		id:"detailEdit",
		text:"修改",
		icon:"edit.png",
		action:"handler_edit"
	});
	btns.push({
		id:"detailDel",
		text:"删除",
		icon:"del.png",
		action:"handler_remove"
	});
	btns.push({
		id:"detailCopy",
		text:"复制",
		icon:"copy.png",
		inmore:true,
		action:"handler_copy"
	});
	btns.push({
		id:"addLine",
		text:"插入",
		icon:"new.png",
		inmore:true,
		action:"handler_add"
	});
	return btns;
}

function ActionUtils(billForm, ctrl) {
	this.billForm = billForm;
	this.ctrl = ctrl;
}