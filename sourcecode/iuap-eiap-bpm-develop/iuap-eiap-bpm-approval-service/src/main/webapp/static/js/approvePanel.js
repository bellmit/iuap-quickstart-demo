define('approvePanel',
	[
		'jquery',
		'knockout',
		'css!'+window.$ctx+'/static/css/rt/bootstrap.min.css',
		'css!'+window.$ctx+'/static/css/rt/assign.css',
		'css!'+window.$ctx+'/static/css/rt/workflow.css',
		'css!'+window.$ctx+'/static/css/rt/form-bill.css',
		'css!'+window.$ctx+'/static/css/rt/formrefer.css',
		'css!'+window.$ctx+'/static/css/rt/reject.css'
	],
	function($, ko){
	var approvePanleInit=function(processInstanceId,processDefinitionId){
		/*手机端*/
		/*var isMobile = !!~window.navigator.userAgent.indexOf('Mobile')
		 if (isMobile) {
		 document.body.className += ' bill-mobile'
		 }*/
		window.onscroll = function(){
			window.scrollTo(0,0)
		};
		var param = str2obj(location.search.slice(1), '&', '=', true)//获取单据的主键
		var loadDataResult;
		/*if (isMobile) {
		 param.isMobile = true;
		 }*/
		var count = 100;
//浏览态
		/*请求bpm数据*/
		 var datas = { 
		 "processInstanceId":processInstanceId,
		 "processDefinitionId":processDefinitionId
		 };
		 var dataStr = JSON.stringify(datas);
		 var ajaxurl=window.$ctx + "/approval/loadAllBpmInfo?processInstanceId="+processInstanceId+"&processDefinitionId="+processDefinitionId;
		 $.ajax({
		 type: "get",
		 url:  ajaxurl,
		 dataType: "json"
	/*	 data:	dataStr*/
		 }).done(function (result) {
		   if(result.status==0){
		     require(['uui'],function(){
		      u.showMessageDialog({title: "警告", msg: result.message, backdrop: true});
		    });
		   }else{
		      loadDataResult = result;
		      initCallback();
		     }
		 });
		/*方法列表*/
		function str2obj(str, separator1, separator2, defaultValue) {
			var param = {}, i, l, v
			if (str && separator1 && separator2) {
				str = str.split(separator1)
				for (i = 0, l = str.length;i<l;i++) {
					v = str[i]
					if (~v.indexOf(separator2)) {
						v = v.split(separator2)
						param[v[0]] = v[1]
					} else {
						param[v] = defaultValue
					}
				}
			}
			return param;
		}

		function disableAllForm(viewModel){
			/*viewModel.headform.setEnable(false)*/
			$.each(viewModel, function(key, value) {
				if (key.indexOf('bodyform_') == 0) {
					value.setEnable(false);
					var dtadd = "dtadd_"+value.id;
					var dtdel = "dtdel_"+value.id;
					$("#"+dtadd).prop("disabled", true);
					$("#"+dtdel).prop("disabled", true);
					$(".btn-mb-add.btn-mobile").prop("disabled", true);
				}
			})
		}

		function enableAllForm(viewModel){
			/*viewModel.headform.setEnable(true)*/
			$.each(viewModel, function(key, value) {
				if (key.indexOf('bodyform_') == 0) {
					value.setEnable(true);
					var dtadd = "dtadd_"+value.id;
					var dtdel = "dtdel_"+value.id;
					$("#"+dtadd).prop("disabled", false);
					$("#"+dtdel).prop("disabled", false);
					$(".btn-mb-add.btn-mobile").prop("disabled", false);
				}
			})
		}

		function getDataTable() {
			var data = {};
			var dataTables = app.getDataTables();
			var body = {};
			var bodys = {};
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
					var bodyrows = [];
					for(var i = 0, count = rlen; i < count; i++){
						var rowData = rows[i].data;
						var bodyData = {};
						bodyData.cls = dataTable.getParam("cls");
						for(var key in rowData){
							if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
								continue;
							bodyData[key] = rowData[key].value;
						}
						bodyrows.push(bodyData);
					}
					bodys[dataTable.id]=bodyrows;
				}
			}
			data.body = bodys;
			return data;
		}

		function clearData(viewModel, bodyformIds,body){
			if(viewModel.headform){
				viewModel.headform.removeAllRows();
			}
			if(bodyformIds && bodyformIds.length >0 && typeof(body)!="undefined"){
				for(var index =0; index < bodyformIds.length; index++){
					var bodyFormId = bodyformIds[index];
					var body = viewModel[bodyFormId];
					try{
						if(body){
							body.removeAllRows();
						}
					}catch(e){}
				}
			}
		}

		function loadHeadData(viewModel,headData){
			if(viewModel.headform){
				var row = new $.Row({parent:viewModel.headform});
				setRowValue(row, headData);
				//设置当前的实例pk
				row.data.pk_boins = {};
				row.data.pk_boins.key=param.pk_boins;
				row.data.pk_boins.value=param.pk_boins;
				viewModel.headform.addRow(row);
				viewModel.headform.setRowSelect(0);
				updateHeadRowValue(row,headData, viewModel.headform);
			}
		}

		function loadBodyData(viewModel,body,bodyformIds){
			if(!body)
				return;
			var bodyDatas = body.bodys;
			if(bodyDatas == undefined)
				return;
			var tabRows = {};
			for (var i=0, count = bodyDatas.length; i < count; i++){
				var bodyData = bodyDatas[i];
				var dataTable = viewModel[bodyData.pk.subFormId];
				if(dataTable == undefined){
					continue;
				}
				var row = new $.Row({parent:dataTable});
				//设置当前的实例pk
				row.data.id = {};
				row.data.id.key=bodyData.pk.pk;
				row.data.id.value=bodyData.pk.pk;
				setRowValue(row, bodyData);
				var curTabRows = tabRows[bodyData.pk.subFormId];
				if(curTabRows == null){
					curTabRows = [];
					tabRows[bodyData.pk.subFormId] = curTabRows;
				}
				curTabRows.push(row);
			}
			for(var key in tabRows){
				var dataTable = viewModel[key];
				var curTabRows = tabRows[key];
				dataTable.addRows(curTabRows);
			}
			var pageCount = bodyDatas.length/10 + 1;
		}

		function setRowValue(row, data){
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

		function updateHeadRowValue(row, data, datatable){
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

		function loadData(result, viewModel) {
			if (!result) {
				setTimeout(function(){
					if (count < 0) {
						return
					}
					count = count - 1
					loadData(loadDataResult, viewModel)
				}, 500)
				return
			}

			$('.page-loader').remove();
			viewModel.userid = result.userid;
			result.pk_boins = param.pk_boins;

			var headData = result.head;
			var body = result.body;
			//清理数据
			clearData(viewModel,body);
			//流程
			viewModel.bpminfo = result.bpminfo;
			//流程相关控件的加载要依赖viewModel.bpminfo
			loadHeadData(viewModel,headData);
			loadBodyData(viewModel,body);
			var status ;
			if(result.head&&result.head.status&&result.head.status.value)
				status = result.head.status.value;
			if("reject"==status||"tempsave"==status){
				if(result.head.createuser&&(viewModel.userid==result.head.createuser.pk)){
					enableAllForm(viewModel);
					$("#editBtn").show();
					return;
				}
			}

			if(!result.bpminfo){
				disableAllForm(viewModel);
				return;
			}

			if(result.bpminfo.status=="0"){
				u.showMessageDialog({title: "警告", msg: result.bpminfo.message, backdrop: true});
				disableAllForm(viewModel);
				return;
			}
			/* var activityid = result.bpminfo.activityid;
			 var userlastactivity = result.bpminfo.userlastactivity;
			 if(result.allActivitis){
			 var allActivitisJson = JSON.parse(result.allActivitis);
			 activityid = allActivitisJson[0].id;
			 }
			 var datatable = viewModel.headform;
			 var processauthinfo= result.bpminfo.processauthinfo;

			 var allDisable = false;
			 var fileds = [];
			 for(var pro in viewModel.headform.meta ){
			 fileds.push(pro);
			 }
			 if(processauthinfo&&activityid&&!result.bpminfo.hasnottask){
			 viewModel.authMap = processauthinfo[activityid];
			 if(viewModel.authMap){
			 //日期区间
			 for(var i=0;i<viewModel.authMap.length;i++){
			 var auth = viewModel.authMap[i];
			 var fieldauth = auth["auth"];
			 var field = auth["fieldid"];
			 var comp = viewModel.headform.meta[field];
			 var startField,endField;
			 if(fieldauth=="2"){
			 datatable.setMeta(field, "enable", true);
			 }else if(fieldauth=="1"){
			 datatable.setMeta(field, "enable", false);
			 }else{
			 datatable.setMeta(field, "enable", false);
			 $("fieldset[fieldname='"+field+"']").css("display","none");
			 }
			 //日期区间(开始时间 结束时间) 权限
			 if (comp && comp.componentKey == "Dateinterval") {
			 startField = comp.startField;
			 endField = comp.endField;
			 if (fieldauth == "2") {
			 datatable.setMeta(startField, "enable", true);
			 datatable.setMeta(endField, "enable", true);
			 } else if (fieldauth == "1") {
			 datatable.setMeta(startField, "enable", false);
			 datatable.setMeta(endField, "enable", false);
			 }
			 if (!String.prototype.includes) {
			 String.prototype.includes = function() {
			 'use strict';
			 return String.prototype.indexOf.apply(this, arguments) !== -1;
			 };
			 }

			 if (fileds.indexOf(startField)!=-1) {
			 fileds.remove(fileds.indexOf(startField));
			 }
			 if (fileds.indexOf(endField)!=-1) {
			 fileds.remove(fileds.indexOf(endField));
			 }
			 }
			 if(fileds.indexOf(field)!=-1){
			 fileds.remove(fileds.indexOf(field));
			 }
			 }
			 for(var j=0;j<fileds.length;j++){
			 if(result.bpminfo.isfirstAc){
			 datatable.setMeta(fileds[j], "enable", true);
			 }else{
			 datatable.setMeta(fileds[j], "enable", false);
			 }
			 }
			 }else{
			 if(result.bpminfo.activityid&&(!result.bpminfo.isfirstAc))
			 allDisable = true;
			 }
			 }else if(processauthinfo&&userlastactivity){
			 viewModel.authMap = processauthinfo[userlastactivity];
			 if(viewModel.authMap){
			 for(var i=0;i<viewModel.authMap.length;i++){
			 var auth = viewModel.authMap[i];
			 var fieldauth = auth["auth"];
			 var field = auth["fieldid"];
			 if(fieldauth=="0")
			 $("fieldset[fieldname='"+field+"']").css("display","none");
			 }
			 }
			 allDisable = true;
			 }else if(!processauthinfo){
			 if(result.bpminfo.isfirstAc&&!result.pk_boins)
			 allDisable = false;
			 else
			 allDisable = true;
			 }else if(!activityid){
			 allDisable = true;
			 }

			 if(allDisable){
			 var meta = datatable.meta;
			 for(var key in meta){
			 datatable.setMeta(key, "enable", false);
			 }
			 }
			 if(body&&body.bodys){
			 var bodyDatas = body.bodys;
			 for (var i=0, count = bodyDatas.length; i < count; i++){
			 var bodyData = bodyDatas[i];
			 var dataTable = viewModel[bodyData.pk.subFormId];
			 if(dataTable){
			 dataTable.setEnable(false);
			 }
			 }
			 $(".form-databox-btn-area button").attr("disabled","disabled");
			 }*/

			app.getdt = getDataTable;
			var flowpanelctx = {};
			flowpanelctx.ctx = window.$ctx;
			flowpanelctx.viewModel=viewModel;
			/*flowpanelctx.datatableIds=datatableIds;*/
			flowpanelctx.app=app;
			//如果有业务对象实例主键
			getApproveInfosNew(param, ".approvalPanel", result.bpminfo,"", "",flowpanelctx);
			/* if(param.pk_boins&&(activityid||userlastactivity)){
			 if(result.isapprovepanel){
			 getButtonsInfo(param,result.bpminfo,flowpanelctx);
			 } else {
			 //加载流程面板
			 if(isMobile){
			 mobileShowWorkflow(param, ".workflowpanel", result.bpminfo,"", "",flowpanelctx);
			 }else{
			 getApproveInfosNew(param, ".approvalPanel", result.bpminfo,"", "",flowpanelctx);
			 }
			 }
			 }*/
		}

		function initCallback(){
			/*var billData = window.billData
			 $('#bill-html-placeholder').after(billHtml).remove()
			 billData.formName ? (document.title = billData.formName) : undefined;*/
			//目前用来判断显示状况的三个变量
			/*	var isShare = billData.isShare;
			 var isBrowse = billData.isBrowse;
			 var isPreview = billData.isPreview;
			 var isSuccessive = billData.isSuccessive;
			 document.cookie = "savenew=;"
			 $('#ateuto-save').prop('checked', isSuccessive)
			 $('.save-settings').removeClass('hide')*/
			/*var formula = require('formula2');*/
			/*var viewctrl = require('viewDataTable');*/
			var viewModel = $.extend({}, {
				bpminfo :"",
				authMap:{},
				curApproveComps:[],
				tempsave:function(viewModel){
					if ($('#editBtn').data('lock')) {
						return;
					}
					var options = {element:$('.cardpanel')[0]};
					options.showMsg = true;
					var errorMsg = app.compsValidateMultiParam(options);
					if(typeof errorMsg.passed == "boolean" && !errorMsg.passed && errorMsg.notPassedArr.length > 0){
						return;
					}
					if(app.validateFormulaArr.length != 0){
						u.showMessage("除数不能为0");
						return;
					}

					$('#editBtn').data('lock', true)
					var datas = this.getDataTable();
					$.ajax({
						type: "post",
						url:  window.$ctx + "/iform_ctr/bill_ctr/tempsaveData",
						dataType: "json",
						data: {
							datas:JSON.stringify(datas),
							iss:isShare,
							pk_bo:param.pk_bo,
							pk_temp:window.billData.pk_temp,
						},
						success:function(data){
							$(".save-complate").text("已暂存!");
							$('#editBtn').data('lock', false)
							if(data.success){
								$(".form-iframe-wrap").hide();
							}else{
								u.showMessage(data.message);
							}
						}
					})
				},
				save:function(viewModel){
					if ($('#editBtn').data('lock')) {
						return;
					}

					var options = {element:$('.cardpanel')[0]};
					options.showMsg = true;
					var errorMsg = app.compsValidateMultiParam(options);
					if(typeof errorMsg.passed == "boolean" && !errorMsg.passed && errorMsg.notPassedArr.length > 0){
						return;
					}
					if(app.validateFormulaArr.length != 0){
						u.showMessage("除数不能为0");
						return;
					}

					$('#editBtn').data('lock', true)
					var datas = this.getDataTable();
					$.ajax({
						type: "post",
						url:  window.$ctx + "/iform_ctr/bill_ctr/saveData",
						dataType: "json",
						data: {
							datas:JSON.stringify(datas),
							iss:isShare,
							pk_bo:param.pk_bo,
							pk_temp:window.billData.pk_temp,
						},
						success:function(data){
							$('#editBtn').data('lock', false)
							if(data.success){
								billData.saveSuccessHandler(data);
							}else{
								u.showMessage(data.message);
							}
						}
					})


				},
				cancel: function(e){
					window.history.back()
				},
				getDataTable:function(){
					var data = {};
					var dataTables = app.getDataTables();
					var body = {};
					var bodys = {};
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
							var bodyrows = [];
							for(var i = 0, count = rlen; i < count; i++){
								var rowData = rows[i].data;
								var bodyData = {};
								bodyData.cls = dataTable.getParam("cls");
								for(var key in rowData){
									if(typeof rowData[key].value == 'undefined' || rowData[key].value == null)
										continue;
									bodyData[key] = rowData[key].value;
								}
								bodyrows.push(bodyData);
							}
							bodys[dataTable.id]=bodyrows;
						}
					}
					data.body = bodys;
					return data;
				},
				print: function(e){
					var pk_bo = param.pk_bo;
					var pk_boins = param.pk_boins;
					var datas = {
						"pk_bo":pk_bo,
						"pk_boins":pk_boins
					};
					var dataStr = JSON.stringify(datas);
					$.ajax({
						type: "get",
						url:  window.$ctx + "/iform_ctr/bill_ctr/printVerify?data="+dataStr,
						dataType: "json",
						success : function(data) {
							result = data; // 包数据解析为json 格式
							if(result.success){
								var uri = result.data;
								//模板相关处理,读取模板ID
								window.location.href=uri+"&params="+dataStr+"&printcode="+pk_bo;
							}
						},
					});

				},
				viewadd: function addFunc(v,e){
					if(viewctrl['add']){
						viewctrl['add'].call(this,v,e);
					}
				},
				viewdel: function delFunc(v,e){
					if(viewctrl['del']){
						viewctrl['del'].call(this,v,e);
					}
				},
				isEditable: ko.observable(true),// viewModel上加页面状态
				isDisable: ko.observable(true),// viewModel上加页面状态
				/*isMobile: isMobile//判断是否为手机端*/
			});

			var app = u.createApp();
			window.app = app;
			app.validateFormulaArr = [];
			try{
				// 第三个参数为：是否执行ko.applyBindings
				// 因为组件加载后会主动执行applyBindings,避免重复绑定，这里参数为false
				app.init(viewModel);
				/*	formula.addFormulaEvent(viewModel,app, $.noop);*/
			}catch(e){
				console.log(e.stack);
			}

			// 重新加载页面滚动到顶部的代码，取消监听，不然滚不动
			window.scrollTo(0,0);
			window.onscroll = undefined;

			//编辑态
			/*if(viewModel.headform){
			 viewModel.headform.createEmptyRow();
			 viewModel.headform.setRowSelect(0);
			 }*/

			/*//初始化明细子表
			 if(viewctrl['init']){
			 viewctrl['init'].call(this,viewModel,bodyformIds);
			 }*/

			loadData(loadDataResult, viewModel)
		}

	}
	return{
		init:function(processInstanceId,processDefinitionId){
			approvePanleInit(processInstanceId,processDefinitionId);
		}
	}
})



