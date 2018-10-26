require.config({
	// baseUrl: "../",
	paths: {
		'jquery': "/uui2/libs/jquery/jquery-1.11.2",
		'knockout': "/uui2/libs/knockout/knockout-3.2.0.debug",
		'uui': "/uui2/libs/uui/js/u",
		'u.biz': "/uui2/libs/uui/js/u.biz" ,
		'i18next':"/uui2/libs/i18next/i18next",
		'text': "/uui2/libs/requirejs/text",
		'bignumber':"/uui2/libs/bignumber/bignumber",
		'bootstrap':"/uui2/libs/bootstrap/dist/js/bootstrap",
		'templetutil':"/uitemplate_web/static/js/rt/templetutils",
		'viewctrl':'${ctx}/static/js/rt/view.datatable',
	},
	
	shim: {
		bootstrap:{
			deps:["jquery"]
		},
		'uui': {
			deps: ["jquery", "bootstrap", "i18next"]
		},
		'u.biz': {
			deps: ["jquery", "bootstrap","knockout", "uui", "bignumber"]
		}
	},
	waitSeconds:60
});

require([
	'knockout',
	'component/tab',
	'component/toolbar',
	'component/dialog',
	'model/pageModel',
	'lib/underscore'
], function(ko, Tab, Toolbar, dialog, pageModel) {
	window.ko = ko;

	var forms = pageModel.forms
	var pk = pageModel.pk
	var status = pageModel.status

	var findFieldIdByLabel = function (headform, label) {
			var fieldId
			_.each(headform.meta, function (v, i) {
				if (v.label == label) {
					fieldId = i
					return false;
				}
			})
			return fieldId
		}

	var tab = new Tab({
		selector: '#tab',
		forms: forms,
		startTab: 0,
		inertia: pageModel.status == 'edit' ? false : true
	});

	var toolbar = new Toolbar({
		selector: '#toolbar',
		float: "right",
		btns: [
			{
				text: '编辑',
				icon: 'pencil',
				fn: function() {
					//window.location.href = window.location.pathname + '?pk=23fc0ffe-54ad-48ea-9363-db01ab129601&edit'
				}
			},
			{
				text: '查看',
				icon: 'eye-open',
				fn: function() {
					//window.location.href = window.location.pathname + '?pk=23fc0ffe-54ad-48ea-9363-db01ab129601'
				}
			},
			{
				text: '保存',
				icon: 'ok',
				fn: function() {
					var finish = true
					if (pageModel.status != 'edit') {
						tab.tabs.each(function(){
							if (!$(this.getAttribute('href')).data('loaded')) {
								finish = false
								return false
							}
						})
					}
					finish = true;
					if (!finish) {
						dialog.alert('请完成编辑过程')
						return
					}
					var data = JSON.stringify(pageModel.getViewModelData())
					$.ajax({
						type: "POST",
						data: {
							data: data
						},
						dataType: "json",
						url: "/iform/psn_ctr/saveBillModel",
						success: dialog.loading(function() {
							localStorage.testData = data
							dialog.alert('保存成功')
						})
					})
				}
			},
			"split",
			{
				text: '禁用入职办理姓名字段',
				icon: 'lock',
				fn: function(data) {
					var $btn = $(this)
					var headform = pageModel.getViewModel('test2').headform
					var fieldId = findFieldIdByLabel(headform, '姓名')
					if (fieldId) {
						headform.setMeta(fieldId, 'enable', false)
					}
				}
			},
			{
				text: '同步姓名',
				icon: 'refresh',
				data: {
					executed: 0
				},
				fn: function(data){
					if (data.executed) return
					data.executed = 1
					var bindList = [];
					var sync = function (e) {
						var self = this
						_.each(_.filter(bindList, function(v) {
							var result = v.dataTable != self
							return result
						}), function (v) {
							v.dataTable.setValue(v.fieldId, e.newValue)
						})
					}
					var startSync = function (key, fieldLabel) {
						var headform = pageModel.getViewModel(key).headform
						var fieldId = findFieldIdByLabel(headform, fieldLabel)
						headform.on(fieldId + '.valueChange', sync)
						bindList.push({
							dataTable: headform,
							fieldId: fieldId
						})
					}
					startSync('test1', '姓名')
					startSync('test2', '姓名')
					var initDataTable = bindList[tab.curTabIndex].dataTable
					sync.call(initDataTable, {newValue: initDataTable.getValue(bindList[tab.curTabIndex].fieldId)})
				}
			}
		],
		isDisabled: function (btn) {
			return status == 'see' && btn.text != '编辑'
		}
	});
})
