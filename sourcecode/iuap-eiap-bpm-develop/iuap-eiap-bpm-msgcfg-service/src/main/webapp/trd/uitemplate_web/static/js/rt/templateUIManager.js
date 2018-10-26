//模板UI管理
var TemplateUI = function(app, viewModel) {
	this.app = app;
	this.viewModel = viewModel;
	this.pages = [];
	this.init();

}

TemplateUI.fn = TemplateUI.prototype;

// 针对主子表新增编辑
TemplateUI.fn.addEditClick = function(datatableid) {
	if (datatableid == "headform") {
		var isEditable = datatableid + "_isEditable";
		this.viewModel[isEditable](true);
	}
	var datatables = this.app.getDataTables();
	for ( var key in datatables) {
		if ("headform" == key || "datatable" == key) {// 特殊处理当前datatable
			continue;
		} else if (key == datatableid) {
			this.setValueById(key + "_add_isEditable", true);
			this.setValueById(key + "_form_isEditable", true);
			this.setValueById(key + "_edit_del_isEditable", false);
			this.setValueById(key + "_save_cancel_isEditable", true);
			this.setValueById(key + "_isEditable", false);
		} else {
			this.setValueById(key + "_add_isEditable", false);
			this.setValueById(key + "_form_isEditable", false);
			this.setValueById(key + "_edit_del_isEditable", false);
			this.setValueById(key + "_save_cancel_isEditable", false);
			this.setValueById(key + "_isEditable", false);
		}

	}
	this.setValueById("isClickable", false);
	$("div.u-row [role='row_btn']").each(
			function() {
				var divs = $(this).find("div");
				var canVisible = false;
				if (divs && divs.length > 0) {
					for (var i = 0; i < divs.length; i++) {
						var div = divs[i];
						if ($(div).css("display")
								&& $(div).css("display") != "none") {
							canVisible = true;
							break;
						}
					}
				}
				if ($(this).parent().parent().parent().parent().parent().css(
						"height") != '0px'
						&& !canVisible) {
					$(this).hide();
					var $Tr = $(this).parent().parent().parent().parent()
							.parent();
					var height = $Tr.css("height");
					var preHeight = height.replace("px", "");
					var afterHeight = (parseInt(preHeight) - 75) + "px";
					$Tr.css("height", afterHeight);
				}
			});
}

// 进入编辑态的话，显示保存、取消，其余都
TemplateUI.fn.editClick = function(datatableid) {
	var datatables = this.app.getDataTables();
	for ( var key in datatables) {
		if ("headform" == key || "datatable" == key) {// 特殊处理当前datatable
			continue;
		} else if (datatableid == key) {
			this.setValueById(key + "_add_isEditable", false);
			this.setValueById(key + "_form_isEditable", false);
			this.setValueById(key + "_edit_del_isEditable", false);
			this.setValueById(key + "_save_cancel_isEditable", true);
			this.setValueById(key + "_isEditable", true);
			// 处理不是该行数据的保存、取消按钮不显示
			var datatable = this.app.getDataTable(key);
			var focusIndex = datatable.getFocusIndex();
			$('#' + key).find('button').each(function(i, element) {
				var currentIndex = element.getAttribute('index');
				currentIndex = parseInt(currentIndex);
				if (currentIndex != focusIndex) {
					$(element).parent().css('display', 'none');
				}

			})
			// 通过jQuery控制，浏览是tableformview,编辑是tableformedit
			$('#' + key).find('.tableformedit').each(function(index, element) {
				var currentIndex = element.getAttribute('index');
				currentIndex = parseInt(currentIndex);
				if (currentIndex == focusIndex) {
					$(this).show();
				}
			});
			$('#' + key).find('.tableformview').each(function(index, element) {
				var currentIndex = element.getAttribute('index');
				currentIndex = parseInt(currentIndex);
				if (currentIndex == focusIndex) {
					$(this).hide();
				}
			});
			$('#' + key).find('tr[role="row"]').each(function(index, element) {
				var currentIndex = element.getAttribute('index');
				currentIndex = parseInt(currentIndex);
				if (currentIndex == focusIndex) {
					this.setAttribute("status", "edit");
				}
			});
		} else {
			this.setValueById(key + "_add_isEditable", false);
			this.setValueById(key + "_form_isEditable", false);
			this.setValueById(key + "_edit_del_isEditable", false);
			this.setValueById(key + "_save_cancel_isEditable", false);
			this.setValueById(key + "_isEditable", false);
			// 通过jQuery控制，浏览是tableformview,编辑是tableformedit
		}

	}
	this.setValueById("isClickable", false);
	$("div.u-row [role='row_btn']").each(
			function() {
				var divs = $(this).find("div");
				var canVisible = false;
				if (divs && divs.length > 0) {
					for (var i = 0; i < divs.length; i++) {
						var div = divs[i];
						if ($(div).css("display")
								&& $(div).css("display") != "none") {
							canVisible = true;
							break;
						}
					}
				}
				if ($(this).parent().parent().parent().parent().parent().css(
						"height") != '0px'
						&& !canVisible) {
					$(this).hide();
					var $Tr = $(this).parent().parent().parent().parent()
							.parent();
					var height = $Tr.css("height");
					var preHeight = height.replace("px", "");
					var afterHeight = (parseInt(preHeight) - 75) + "px";
					$Tr.css("height", afterHeight);
				}
			});
}

/**
 * 绑定当前datatable的当前行事件
 */
TemplateUI.fn.on = function(datatableid, name, callback) {
	var self = this;
	var datatable = self.app.getDataTable(datatableid);
	if (datatable) {
		var valueChange = datatable.getEvent(name);
		if (valueChange == undefined) {
			datatable.off(name, callback);
			datatable.on(name, callback);
		}

	}
}

/**
 * 解除绑定当前datatable的当前行事件
 */
TemplateUI.fn.off = function(datatableid) {
	var self = this;
	var datatable = self.app.getDataTable(datatableid);
	if (datatable) {
		var eventName = datatable.getEvent(name);
		if (eventName == undefined) {
			datatable.off(name, callback);
		}

	}
}

TemplateUI.fn.deleteClick = function(datatableid) {
	var datatables = this.app.getDataTables();
	for ( var key in datatables) {
		if ("headform" == key || "datatable" == key) {// 特殊处理当前datatable
			continue;
		} else {
			this.setValueById(key + "_add_isEditable", true);
			this.setValueById(key + "_form_isEditable", true);
			this.setValueById(key + "_edit_del_isEditable", true);
			this.setValueById(key + "_save_cancel_isEditable", true);
			this.setValueById(key + "_isEditable", true);
		}
	}
	this.setValueById("isClickable", false);
}

TemplateUI.fn.saveClick = function(datatableid) {
	$("div.u-row [role='row_btn']").each(
			function() {
				var divs = $(this).find("div");
				var canVisible = false;
				if (divs && divs.length > 0) {
					for (var i = 0; i < divs.length; i++) {
						var div = divs[i];
						if ($(div).css("display")
								&& $(div).css("display") != "none") {
							canVisible = true;
							break;
						}
					}
				}
				if ($(this).parent().parent().parent().parent().parent().css(
						"height") != '0px'
						&& !canVisible) {
					$(this).show();
					var $Tr = $(this).parent().parent().parent().parent()
							.parent();
					var height = $Tr.css("height");
					var preHeight = height.replace("px", "");
					var afterHeight = (parseInt(preHeight) + 75) + "px";
					$Tr.css("height", afterHeight);
				}
			});
	var datatables = this.app.getDataTables();
	for ( var key in datatables) {
		if ("headform" == key || "datatable" == key) {// 特殊处理当前datatable
		} else {
			this.setValueById(key + "_add_isEditable", false);
			this.setValueById(key + "_form_isEditable", false);
			this.setValueById(key + "_edit_del_isEditable", true);
			this.setValueById(key + "_save_cancel_isEditable", true);
		}
		this.setValueById(key + "_isEditable", false);
	}
	this.setValueById("isClickable", true);
}

TemplateUI.fn.cancelClick = function(datatableid) {
	$("div.u-row [role='row_btn']").each(
			function() {
				var divs = $(this).find("div");
				var canVisible = false;
				if (divs && divs.length > 0) {
					for (var i = 0; i < divs.length; i++) {
						var div = divs[i];
						if ($(div).css("display")
								&& $(div).css("display") != "none") {
							canVisible = true;
							break;
						}
					}
				}
				if ($(this).parent().parent().parent().parent().parent().css(
						"height") != '0px'
						&& !canVisible) {
					$(this).show();
					var $Tr = $(this).parent().parent().parent().parent()
							.parent();
					var height = $Tr.css("height");
					var preHeight = height.replace("px", "");
					var afterHeight = (parseInt(preHeight) + 75) + "px";
					$Tr.css("height", afterHeight);
				}
			});
	var datatables = this.app.getDataTables();
	for ( var key in datatables) {
		if ("headform" == key || "datatable" == key) {// 特殊处理当前datatable
		} else if (datatableid == key) {
			this.setValueById(key + "_add_isEditable", false);
			this.setValueById(key + "_form_isEditable", false);
			this.setValueById(key + "_edit_del_isEditable", true);
			this.setValueById(key + "_save_cancel_isEditable", true);
			var datatable = this.app.getDataTable(key);
			var focusIndex = datatable.getFocusIndex();
			// 通过jQuery控制，浏览是tableformview,编辑是tableformedit
			$('#' + key).find('.tableformedit').each(function(index, element) {
				var currentIndex = element.getAttribute('index');
				currentIndex = parseInt(currentIndex);
				if (currentIndex == focusIndex) {
					$(this).hide();
				}
			});
			$('#' + key).find('.tableformview').each(function(index, element) {
				var currentIndex = element.getAttribute('index');
				currentIndex = parseInt(currentIndex);
				if (currentIndex == focusIndex) {
					$(this).show();
				}
			});
			$('#' + key).find('tr[role="row"]').each(function(index, element) {
				var currentIndex = element.getAttribute('index');
				currentIndex = parseInt(currentIndex);
				if (currentIndex == focusIndex) {
					this.removeAttribute("status");
				}
			});
		} else {
			this.setValueById(key + "_add_isEditable", false);
			this.setValueById(key + "_form_isEditable", false);
			this.setValueById(key + "_edit_del_isEditable", true);
			this.setValueById(key + "_save_cancel_isEditable", true);
		}
		this.setValueById(key + "_isEditable", false);
	}
	this.setValueById("isClickable", true);
}

TemplateUI.fn.setValueById = function(key, value) {
	if (value == undefined || key == undefined) {
		return;
	}
	if (this.viewModel[key] == undefined) {
		return;
	}
	this.viewModel[key](value);
}

/**
 * editBtnText 修改编辑按钮文本内容
 * 
 */
TemplateUI.fn.setRowEditBtnText = function(editBtnText, datatableId) {
	if (editBtnText == undefined) {
		editBtnText = "编辑";
	}
	if (datatableId == undefined) {
		return;
	}
	this.viewModel[datatableId + "_tableEditBtnText"](editBtnText);
}

/**
 * deleteBtnText 修改删除按钮文本内容
 */
TemplateUI.fn.setRowDeleteBtnText = function(deleteBtnText, datatableId) {
	if (deleteBtnText == undefined) {
		deleteBtnText = "删除";
	}
	if (datatableId == undefined) {
		return;
	}
	this.viewModel[datatableId + "_tableDeleteBtnText"](deleteBtnText);
}

/**
 * saveBtnText 修改保存按钮文本内容
 */
TemplateUI.fn.setRowSaveBtnText = function(saveBtnText, datatableId) {
	if (saveBtnText == undefined) {
		saveBtnText = "保存";
	}
	if (datatableId == undefined) {
		return;
	}
	this.viewModel[datatableId + "_tableSaveBtnText"](saveBtnText);
}

/**
 * cancelBtnText 修改取消按钮文本内容
 */
TemplateUI.fn.setRowCancelBtnText = function(cancelBtnText, datatableId) {
	if (cancelBtnText == undefined) {
		cancelBtnText = "取消";
	}
	if (datatableId == undefined) {
		return;
	}
	this.viewModel[datatableId + "_tableCancelBtnText"](cancelBtnText);
}

// 初始化页面参数
TemplateUI.fn.init = function() {
	var page = new TemplatePage();
	this.pages.push(page);
}

TemplateUI.fn.addPage = function(page) {
	if (page) {
		this.pages.push(page);
	}
}

var TemplatePage = function() {
	this.buttons = [];
}

TemplatePage.STATUS = {
	EDIT : 'edit',
	VIEW : 'view'
}

TemplatePage.fn = TemplatePage.prototype;

TemplatePage.fn.addButton = function(button) {
	this.buttons.push(button);
}

var TemplateButton = function(options) {
	this.id = options['id'];
	this.name = options['name'];
	this.datatableId = options['datatableId'];
	this.status = options['status'] == undefined ? TemplateButton.STATUS.SAVE
			: options['status'];
	this.enable = options['enable'] == undefined ? TemplateButton.DEFAULTS.enable
			: options['enable'];
}

TemplateButton.DEFAULTS = {
	enable : true
}

TemplateButton.STATUS = {
	SAVE : 'save',
	EDIT : 'edit',
	CANCEL : 'cancel',
	DELETE : 'delete'
}

TemplateButton.fn = TemplateButton.prototype;

function getRightToolBarData() {
	var eles = $('.right_toolbar');
	if (eles && eles.length > 0) {
		var data = [];
		for (var index = 0; index < eles.length; index++) {
			var ele = eles[index];
			if (ele == undefined) {
				continue;
			}
			var value = [];
			var id = ele.getAttribute("id");
			var title = ele.getAttribute("title");
			value.push(id);
			value.push(title);
			data.push(value)
		}
		return data;
	}
}

/**
 * 处理控制值过长 省略处理
 * 
 * @param value
 * @returns {String}
 */
function substractStr(value, len) {
	var v = value();
	if (!v) {
		return '';
	}
	v = v + '';
	if (len == undefined) {
		len = 20;
	}
	if (getRealLength(v) > len) {
		return cutstr(v, len) + '...';
	}

	return v
}

function getRealLength(value) {
	var realLength = 0;
	var len = value.length;
	var charCode = -1;
	for (var i = 0; i < len; i++) {
		charCode = value.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) {
			realLength += 1;
		} else {
			realLength += 2;
		}
	}

	return realLength;
}

function cutstr(str, len) {
	var str_length = 0;
	var str_len = 0;
	str_cut = new String();
	str_len = str.length;
	for (var i = 0; i < str_len; i++) {
		a = str.charAt(i);
		str_length++;
		if (escape(a).length > 4) {
			// 中文字符的长度经编码之后大于4
			str_length++;
		}
		str_cut = str_cut.concat(a);
		if (str_length >= len) {
			str_cut = str_cut.concat("...");
			return str_cut;
		}
	}
	// 如果给定字符串小于指定长度，则返回源字符串；
	if (str_length < len) {
		return str;
	}
}

function attachSrcProcess(str) {
	var img = '/uitemplate_web/static/css/rt/img/touxiang.png';
	if (str() != "") {
		return str();
	} else {
		return img;
	}
}

function processEnum(v, comboId, datatableId) {
	var value = v();
	if (comboId == undefined) {
		if (value == "") {
			// 设置默认 否
			value = "否"
		}
	} else if (value) {
		var values = value.split(',');
		var dt = app.getDataTable(datatableId);
		var viewModel = dt.parent;
		if (viewModel && comboId != undefined) {
			var combos = viewModel[comboId];
			var result = '';
			var first = true;
			for (var index = 0; index < values.length; index++) {
				var t_value = values[index];
				for (var i = 0; i < combos.length; i++) {
					var combo = combos[i];
					if (combo == undefined) {
						continue;
					}
					if (combo.pk == t_value) {
						if (first) {
							result = combo.name;
							first = false;
						} else {
							result += "," + combo.name;
						}
					}
				}
			}
			value = result;
		}
	}

	return value;
}

function refRadio(v, comboId, datatableId) {
	var value = v();
	if (datatableId != 'undefined' && value) {
		var dt = app.getDataTable(datatableId);
		var viewModel = dt.parent;
		if(viewModel && comboId != undefined){
			var combos = viewModel[comboId];
			var result = '';
			for (var i = 0; i < combos.length; i++) {
				var combo = combos[i];
				if (combo == undefined) {
					continue;
				}
				if (combo.pk == value) {
					return combo.name;
				}
			}
		}
	}

	return value;
}

function uiCompValidate(app, datatableId) {
	var comps = app.getCompsByDataTable(datatableId);
	passed = true, unpassed = [];
	for (var i = 0; i < comps.length; i++) {
		if (comps[i].doValidate) {
			var result = comps[i].doValidate({
				trueValue : true,
				showMsg : true
			});
			result = typeof result === 'object' ? result['passed'] : result;
			if(!result && comps[i].type=='u-checkbox' && comps[i].required== 'true' && comps[i].checkedValue &&  comps[i].checkedValue == 'Y'){
				result = true;
			}
			passed = result && passed;
			if (!result){
				unpassed.push(comps[i])
			}
				
		}
	}
	return passed
}
