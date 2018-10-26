define(['text!./functionactivity.html',
'css!./productmgr.css',
'css!./mutlilang.css',
 '../../config/sys_const.js',
 'css!../../style/style.css',
 'i18n',
 'css!../../style/widget.css'], function (html) {
	//define([ 'error','text!./functionactivity.html', 'css!./productmgr.css','utilrow' ],function(errors,html) {
			'use strict';
			var app, viewModel, basicDatas, events, treeSetting, oper;
			window.appCtx="/wbalone";
			initI18n();

			treeSetting = {
				initI18n:function () {
					initI18n();
				},
				view:{
					showLine:false,
					autoCancelSelected: true,
					selectedMulti:false
				},
				check: {
					chkboxType:{ "Y" : "ps", "N" : "ps" }
				},
				callback : {
					onClick : function(e, id, node) {
						viewModel.setCurrentRow(node.id);// 设置选中行
						var isleaf = viewModel.treeData.getCurrentRow().getSimpleData().isleaf;
						if("Y" == isleaf){
							viewModel.gridStatus("init");
//							$("#dicttype_list_button_2 button").css("display","block");
						}else if("N" == isleaf){
							viewModel.gridStatus("read");
						}

						$.ajax({
									type : 'get',
									url : appCtx+'/security/extfuncactivity/page?search_EQ_funcID='
											+ node.id,
									dataType : 'json',
									contentType : "application/json ; charset=utf-8",
									success : function(data) {
										var data = data['content'];
										viewModel.setShowName(data);
										viewModel.activityChildData.setSimpleData(data);
										viewModel.activityChildData.setAllRowsUnSelect();
										viewModel.activityChildData.setRowUnFocus();
									}
								})
					}
				}
			}
			basicDatas = {
				
			initI18n:function () {
				initI18n();
			},
				treeSetting : treeSetting,
				treeData : new u.DataTable({
					meta : {
						id : {
							type : 'string'
						},
						parentId : {
							type : 'string'
						},
						isleaf : {
							type : 'string'
						},
						funcName : {
							type : 'string'
						}
					}
				}),
				activityData : new u.DataTable({
					meta : {
						funcCode : {
							type : 'string'
						},
						funcName : {
							type : 'string'
						},
						id : {
							type : 'string'
						}
					}
				}),
				activityChildData : new u.DataTable({
					meta : {
						activityShowName : {
							type : 'string'
						},
						activityCode : {
							type : 'string'
						},
						activityUrl : {
							type : 'string'
						},
//						funcCode : {
//							type : 'string'
//						},
						funcID : {
							type : 'string'
						},
						isactive : {
							type : 'string'
						},
						id : {
							type : 'string'
						}
					}
				}),
				activityTempData : new u.DataTable({
					meta : {
						activityShowName : {
                            required:true,
                            nullMsg:"按钮名称不能为空",
							type : 'string'
						},
						activityCode : {
                            required:true,
							type : 'string',
                            nullMsg:"按钮编码不能为空"
						},
						activityUrl : {
                            required:true,
							type : 'string',
                            nullMsg:"按钮URL不能为空"
						},
						funcID : {
							type : 'string'
						},
						isactive : {
							type : 'string'
						},
						id : {
							type : 'string'
						}
					}
				}),
                afterCreate:function () {
                    // initI18n();
                    assignmentPage();

                },
				closeCreate: function () {
					$("#createDialog").hide();
					$("#bter_FunctionActivity_grid1").show();
					viewModel.cancelClick();
					var arrList = viewModel.activityChildData.getAllDatas();
					for (var index = 0; index < arrList.length; index++) {
						var element = arrList[index];
						if(element.data.activityCode.value==null){
							viewModel.activityChildData.removeRowByRowId(element.id);
						}
					}
				},
				comItems : [ {
					"value" : "Y",
					"name" : $.i18n.prop('js.pag.fun.0001')
				}, {
					"value" : "N",
					"name" : $.i18n.prop('js.pag.fun.0002')
				} ],
				gridStatus : ko.observable("read"),
				setShowName:function(data){
					for (var i = 0; i < data.length; i++) {
						if(data[i]["activityShowName"]==null){
							var defaltValue = data[i]["activityName"+viewModel.mutlilang.currentSerial];
							data[i]["activityShowName"] = defaltValue;
						}
					}
				},
				reloadList:function(){
					oper = 'int';
					viewModel.activityChildData.setEnable(false);
					viewModel.gridStatus("read");
					var funId = viewModel.activityData.getCurrentRow().getSimpleData().id
					$.ajax({
						type : 'get',
						url : appCtx+'/security/extfuncactivity/page?search_EQ_funcID='+funId,
						dataType : 'json',
						contentType : "application/json ; charset=utf-8",
						success : function(data) {
							var data = data['content'];
							viewModel.setShowName(data);
							viewModel.activityChildData.setSimpleData(data);
							viewModel.activityChildData.setAllRowsUnSelect();
							viewModel.activityChildData.setRowUnFocus();
						}
					});
				},
				mutlilang: {
		            sysLocale: ko.observable(''),
		            show: ko.observable(false),
		            defaultLocaleValue: ko.observable(''),
		            sysDefaultLanguageShow: ko.observable(''),
		            sysDefaultLanguageSerial: ko.observable(''),
		            locale: ko.observableArray([]),
		            tempSerial: "",
		            currentSerial: "",
		            getCurrentSerial: function (newLocaleValue) {
		                var uri = '../wbalone/i18n/classification/serialId';
		                var JsonData = null;
		                if (newLocaleValue && newLocaleValue.length > 0) {
		                    JsonData = {
		                        locale: newLocaleValue
		                    }
		                }
		                $.ajax({
		                    type: 'get',
		                    dataType: 'json',
		                    url: uri,
		                    data: JsonData,
		                    async: false,
		                    contentType: 'application/json',
		                    success: function (res) {
		                        if (res.status == 1) {
		                            viewModel.mutlilang.currentSerial= res.data=="1"?"":res.data;
		                        }
		                    }
		                });
		            },
		            getSerial: function (newLocaleValue) {
		                var uri = '../wbalone/i18n/classification/serialId';
		                var JsonData = null;
		                if (newLocaleValue && newLocaleValue.length > 0) {
		                    JsonData = {
		                        locale: newLocaleValue
		                    }
		                }
		                $.ajax({
		                    type: 'get',
		                    dataType: 'json',
		                    url: uri,
		                    data: JsonData,
		                    async: false,
		                    contentType: 'application/json',
		                    success: function (res) {
		                        if (res.status == 1) {
		                            viewModel.mutlilang.tempSerial = res.data=="1"?"":res.data;
		                        }
		                    }
		                });
		            },
		            changeDTValue: function (e) {
		                viewModel.activityTempData.setValue("activityName"+viewModel.mutlilang.currentSerial, viewModel.mutlilang.defaultLocaleValue());
		            },
		            saveValue: function () {
		                var defaltValue = viewModel.activityTempData.getValue("activityName"+viewModel.mutlilang.currentSerial);
		                viewModel.mutlilang.defaultLocaleValue(defaltValue);
		                viewModel.activityTempData.setValue("activityShowName",defaltValue);
		                viewModel.mutlilang.show(false);
		            },
		            closeMul: function () {
		                viewModel.mutlilang.show(false);
		            },
		            showMul: function () {
		                viewModel.mutlilang.show(true);
		            },
		            getCurrentLocales: function () {
		                var cookieValue = viewModel.mutlilang.getCookie("u_locale");
		                if (cookieValue == null || cookieValue.replaceAll("\"", "").length == 0) {
		                    cookieValue = "zh_CN";
		                }
		                viewModel.mutlilang.sysLocale(cookieValue);
		                viewModel.mutlilang.getCurrentSerial(cookieValue);
		            },
		            getCookie: function (name) {
		                var cookieValue = null;
		                if (document.cookie && document.cookie != '') {
		                    var cookies = document.cookie.split(';');
		                    for (var i = 0; i < cookies.length; i++) {
		                        var cookie = $.trim(cookies[i]);
		                        // Does this cookie string begin with the name we want?
		                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
		                            cookieValue = decodeURIComponent(cookie
		                                .substring(name.length + 1));
		                            break;
		                        }
		                    }
		                }
		                return cookieValue;
		            },
		            getLanguageList: function () {
		                //TODO 调用接口
		                $.ajax({
		                    url: "../wbalone/i18n/classification/list",
		                    type: 'get',
		                    data: null,
		                    dataType: 'JSON',
		                    contentType: 'application/json',
		                    cache: false,
		                    success: function (res) {
		                        if (res.status == 1) {
		                            var localeArray = [];
		                            for (var index = 0; index < res.data.length; index++) {
		                                viewModel.mutlilang.getSerial(res.data[index].prelocale);
		                                if(index==0){
		                                    viewModel.mutlilang.sysDefaultLanguageShow( res.data[0].pageshow);
		                                    viewModel.mutlilang.sysDefaultLanguageSerial(viewModel.mutlilang.tempSerial);
		                                }
		                                localeArray.push({
		                                    "locale": res.data[index].prelocale,
		                                    "label": res.data[index].pageshow,
		                                    "serial": viewModel.mutlilang.tempSerial,
		                                    "value": ""
		                                });
		                            }
		                            viewModel.mutlilang.locale(localeArray);
		                            //动态的设置字段
		                            for (var i = 0; i < viewModel.mutlilang.locale().length; i++) {
		                                var item = viewModel.mutlilang.locale()[i]
		                                viewModel.activityTempData.createField("activityName"+item.serial);
		                                viewModel.activityChildData.createField("activityName"+item.serial);
		                            }
		                            $('.input-par').each(function () {
		                                var fieldStr = $(this).attr('field');
		                                var umetaStr = $(this).attr('u-meta');
		                                if (fieldStr) {
		                                    var options = JSON.parse(umetaStr);
		                                    options.field = fieldStr;
		                                    $(this).attr('u-meta', JSON.stringify(options));
		                                    options['type'] = options['type'] || 'string';
		                                    if (options && options['type']) {
		                                        var comp = u.compMgr.createDataAdapter({
		                                            el: $(this)[0],
		                                            options: options,
		                                            model: viewModel,
		                                            app: app
		                                        });
		                                        $(this)[0]['u-meta'] = comp;
		                                        app.comps.push(comp);
		                                    }
		                                }
		                        
		                            })
		                        }
		                    },
		                });
		            },
		            init: function () {
		                viewModel.mutlilang.getLanguageList();
		                viewModel.mutlilang.getCurrentLocales();
		            }
		        },
			};
			events = {
                searchKeyboardCmd:function (data, event) {
					if (event.keyCode == 13) {
						this.searchClick()
					}else{
						$('#searchtxt').val($('#searchtxt').val()+event.key);
					}
                },
				initI18n:function(){
					initI18n();
				},
				searchClick:function(){
					var funcName = window.encodeURI($('#searchtxt').val());
					$.ajax({
						type : 'get',//extfunctiondefine
						url : appCtx+'/security/extfunction/page?page.size=1000&search_LIKE_funcName='+funcName,
						dataType : 'json',
						contentType : "application/json ; charset=utf-8",
						success : function(data) {
							var data = data['content'];
							viewModel.treeData.setSimpleData(data);
							viewModel.activityData.setSimpleData(data);
							viewModel.activityData.setAllRowsUnSelect();
						}
					})
				},
				setCurrentRow : function(id) {// 设置选中行
					var allrow = viewModel.activityData.getAllRows();
					if (allrow && id) {
						for ( var i in allrow) {
							var row = allrow[i];
							if (row instanceof u.Row)
								if (row.getValue('id') == id) {
									viewModel.activityData.setRowSelect(row);
								}
						}
					}

				},
				addClick : function() {
					var row = viewModel.activityData.getCurrentRow();
					if (row != null) {
						if (row.getSimpleData().id.length == undefined) {
							u.messageDialog({
								msg : $.i18n.prop('js.pag.fun.0003'),
								title : $.i18n.prop('js.pag.fun.0004'),
								btnText : "OK"
							});
							return

						}
					} else {
						u.messageDialog({
							msg : $.i18n.prop('js.pag.fun.0003'),
							title : $.i18n.prop('js.pag.fun.0004'),
							btnText : "OK"
						});
						return

					}
					viewModel.gridStatus("init");
					 $(":input").removeAttr("readOnly");
					$("#createDialog").show();
					$("#bter_FunctionActivity_grid1").hide();
					oper = 'add';
					//document.getElementById("funcaction_zhezhao").style.display ="block";//树遮照
					// 增加时，付默认值
//					var funcCode = viewModel.activityData.getCurrentRow()
//							.getSimpleData().funcCode;
					var pid = viewModel.activityData.getCurrentRow()
							.getSimpleData().id;
					// var r = viewModel.activityChildData.createEmptyRow();
					// viewModel.activityChildData.setRowFocus(r);
					viewModel.activityTempData.clear();
					viewModel.activityTempData.createEmptyRow();
//					viewModel.activityChildData.setValue("funcCode", funcCode);// 用于显示
// 					viewModel.activityChildData.setValue("funcID", pid);// 用于保存
// 					viewModel.activityChildData.setValue("isactive", "Y");// 默认启用

				},
				editClick : function() {
					if (viewModel.activityChildData.getSelectedRows().length != 1) {
						u.messageDialog({
							msg : $.i18n.prop('js.pag.fun.0005'),
							title : $.i18n.prop('js.pag.fun.0004'),
							btnText : "OK"
						});
						return

					}
					$("#createDialog").show();
					$("#bter_FunctionActivity_grid1").hide();
					viewModel.aa = viewModel.activityChildData.getCurrentRow().rowId;// getSimpleData().id;
					//viewModel.activityChildData.setEnable(true);// 设置可编辑
					//document.getElementById("funcaction_zhezhao").sfuncaction_zhezhaosplay ="block";//树遮照
                    viewModel.tempdata = viewModel.activityChildData.getSimpleData();
                	viewModel.activityTempData.createEmptyRow();
					viewModel.activityTempData.setSimpleData( viewModel.activityChildData.getCurrentRow().getSimpleData());
					var defaltValue = viewModel.activityTempData.getValue("activityName"+viewModel.mutlilang.currentSerial);
		            viewModel.mutlilang.defaultLocaleValue(defaltValue);
		            viewModel.activityTempData.setValue("activityShowName",defaltValue);
        			viewModel.gridStatus("init");
					oper = 'edit';
				},
				// 停用按钮
				tyClick : function() {
					var row = viewModel.activityChildData.getCurrentRow();
					if (row == null) {
						u.messageDialog({
							msg : $.i18n.prop('js.pag.fun.0006'),
							title : $.i18n.prop('js.pag.fun.0004'),
							btnText : "OK"
						});
						return

					}
					var seal = row.getSimpleData().isactive;

					if(seal=='N'){
						u.messageDialog({
							msg : $.i18n.prop('js.pag.fun.0007'),
							title : $.i18n.prop('js.pag.fun.0004'),
							btnText : "OK"
						});
					}else{
						viewModel.activityChildData.setValue("isactive", "N");
                        var JsonData =  row.getSimpleData();
                        delete JsonData["activityShowName"];
						$.ajax({
							type : 'POST',
							url : appCtx+'/security/extfuncactivity/enableActive',
							dataType : 'json',
							contentType : "application/json ; charset=utf-8",
							data : JSON.stringify(JsonData),
							success : function(data) {
                                if (data.msg == undefined) {
                                    viewModel.activityChildData.setEnable(false);
                                    viewModel.gridStatus("read");
                                    u.messageDialog({
                                        msg : $.i18n.prop('js.pag.fun.0008'),
                                        title : $.i18n.prop('js.pag.fun.0004'),
                                        btnText : "OK"
                                    });
                                    oper = 'int';
                                } else if (data.msg.length > 0) {
                                    u.messageDialog({
                                        msg : data.msg,
                                        title : $.i18n.prop('js.pag.fun.0004'),
                                        btnText : "OK"
                                    });
                                }
							}
						})
					}
				},
				// 启用按钮
				qyClick : function() {
					var row = viewModel.activityChildData.getCurrentRow();
					if (row == null) {
						u.messageDialog({
							msg : $.i18n.prop('js.pag.fun.0009'),
							title : $.i18n.prop('js.pag.fun.0004'),
							btnText : "OK"
						});
						return

					}
					var seal = row.getSimpleData().isactive;

					if(seal=='Y'){
						u.messageDialog({
							msg : $.i18n.prop('js.pag.fun.0007'),
							title : $.i18n.prop('js.pag.fun.0004'),
							btnText : "OK"
						});
					}else{
						viewModel.activityChildData.setValue("isactive", "Y");
                        var JsonData =  row.getSimpleData();
                        delete JsonData["activityShowName"];
						$.ajax({
							type : 'POST',
							url : appCtx+'/security/extfuncactivity/enableActive',
							dataType : 'json',
							contentType : "application/json ; charset=utf-8",
							data : JSON.stringify(JsonData),
							success : function(data) {
                                if (data.msg == undefined) {
                                    viewModel.activityChildData.setEnable(false);
                                    viewModel.gridStatus("read");
                                    u.messageDialog({
                                        msg : $.i18n.prop('js.pag.fun.0010'),
                                        title : $.i18n.prop('js.pag.fun.0004'),
                                        btnText : "OK"
                                    });
                                    oper = 'int';
                                } else if (data.msg.length > 0) {
                                    u.messageDialog({
                                        msg : data.msg,
                                        title : $.i18n.prop('js.pag.fun.0004'),
                                        btnText : "OK"
                                    });
                                }
							}
						})
					}
				},
				delClick : function() {
					var row = viewModel.activityChildData.getCurrentRow();
					if (row == null) {
						u.messageDialog({
							msg : $.i18n.prop('js.pag.fun.0011'),
							title : $.i18n.prop('js.pag.fun.0004'),
							btnText : "OK"
						});
						return

					}
					u.confirmDialog({
								title : $.i18n.prop('js.pag.fun.0012'),
								msg : $.i18n.prop('js.pag.fun.0013'),
								onOk : function() {
									$.ajax({
												url : appCtx+'/security/extfuncactivity/delete/'
														+ row.getSimpleData().id,
												type : 'DELETE',
												dataType : 'json',
												contentType : "application/json ; charset=utf-8",
												success : function(data) {
													viewModel.activityChildData
															.removeRows(viewModel.activityChildData
																	.getSelectedRows());
													u.messageDialog({
														msg : $.i18n.prop('js.pag.fun.0014'),
														title : $.i18n.prop('js.pag.fun.0004'),
														btnText : "OK"
													});
											var funId = viewModel.activityData.getValue("id");
                                            $.ajax({
                                                type : 'get',
                                                url : appCtx+'/security/extfuncactivity/page?search_EQ_funcID='+funId,
                                                dataType : 'json',
                                                contentType : "application/json ; charset=utf-8",
                                                success : function(data) {
													var data = data['content'];
													viewModel.setShowName(data);
                                                    viewModel.activityChildData.setSimpleData(data);
                                                    viewModel.activityChildData.setAllRowsUnSelect();
                                                    viewModel.activityChildData.setRowUnFocus();

                                                }
                                            });
												}
											})
								}
							});
				},
				cancelClick : function() {
					viewModel.gridStatus("read")
					if (oper == 'add') {
						oper = 'int';
						viewModel.activityChildData
								.removeRows(viewModel.activityChildData
										.getSelectedRows());
					} else if (oper == 'edit') {
						oper = 'int';
                        viewModel.activityChildData.setSimpleData(viewModel.tempdata);
					}
					//document.getElementById("funcaction_zhezhao").style.display ="none";//树遮照
				},
				saveClick : function(row, e) {
					if (!viewModel.activityTempData.getValue("activityName"+viewModel.mutlilang.sysDefaultLanguageSerial())) {
				    	u.messageDialog({msg:viewModel.mutlilang.sysDefaultLanguageShow()+$.i18n.prop('ht.pag.fun.0014')+" "+$.i18n.prop('js.app.app.0018'),title:$.i18n.prop('js.pag.fun.0015'),btnText:$.i18n.prop('js.pag.fun.0016')});
	                    return false;
	                }
					viewModel.activityTempData.getCurrentRow().setValue("funcID", viewModel.activityData.getCurrentRow()
                        .getSimpleData().id);
					viewModel.activityTempData.getCurrentRow().setValue("isactive", "Y");// 默认启用
					var tempData =viewModel.activityTempData.getCurrentRow().getSimpleData();
					if(tempData["activityName"]==null){
						tempData["activityName"]=tempData["activityShowName"];
					}
					// viewModel.activityChildData.getCurrentRow().setSimpleData(tempData);
					delete tempData["activityShowName"]; 
				    var result = app.compsValidateMultiParam({element:$('#gridid')[0]});//  element:document.querySelector("#gridid")
				    if (result.passed == false){
						u.messageDialog({msg:result.notPassedArr[0].Msg,title:$.i18n.prop('js.pag.fun.0015'),btnText:$.i18n.prop('js.pag.fun.0016')});
					}else{
					var JsonData = tempData;
					// 新增保存
					if (oper == 'add') {
						$.ajax({
									type : 'POST',
									url : appCtx+'/security/extfuncactivity/create',
									dataType : 'json',
									contentType : "application/json ; charset=utf-8",
									data : JSON.stringify(JsonData),
									success : function(data) {
										if (data.msg == undefined) {
											viewModel.reloadList();
											u.messageDialog({
												msg : $.i18n.prop('js.pag.fun.0017'),
												title : $.i18n.prop('js.pag.fun.0004'),
												btnText : "OK"
											});
										} else if (data.msg.length > 0) {
											viewModel.reloadList();
											u.messageDialog({
												msg : data.msg,
												title : $.i18n.prop('js.pag.fun.0004'),
												btnText : "OK"
											});
										}
										viewModel.activityTempData.clear();
									}
								})
					} else if (oper == 'edit') { // 编辑保存
						$.ajax({
							type : 'POST',
							url : appCtx+'/security/extfuncactivity/update',
							dataType : 'json',
							contentType : "application/json ; charset=utf-8",
							data : JSON.stringify(JsonData),
							success : function(data) {
                                if (data.msg == undefined) {
									viewModel.reloadList();
                                    u.messageDialog({
                                        msg : $.i18n.prop('js.pag.fun.0018'),
                                        title : $.i18n.prop('js.pag.fun.0004'),
                                        btnText : "OK"
                                    });
                                    oper = 'int';
                                } else if (data.msg.length > 0) {
                                    viewModel.reloadList();
                                    u.messageDialog({
                                        msg : data.msg,
                                        title : $.i18n.prop('js.pag.fun.0004'),
                                        btnText : "OK"
                                    });
                                }
                                viewModel.activityTempData.clear();
							}
						})
					}
					$("#createDialog").hide();
					$("#bter_FunctionActivity_grid1").show();
					viewModel.gridStatus("read");
					//document.getElementById("funcaction_zhezhao").style.display ="none";//树遮照
				}
				},
				//树搜索事件
				searchclick:function(){
					//alert($("#searchtxt").val());
				},
				//点击行事件
				rowClick : function(obj) {
					var datatableRowId =obj.rowObj.value['$_#_@_id'];
					var rowOjb = viewModel.activityChildData.getRowByRowId(datatableRowId);
					var status =rowOjb.status;
					var id = rowOjb.rowId;
					if (oper == 'add' && status == 'new') {
//						viewModel.activityChildData.setEnable(true);
						return true;
					} else if (oper == 'edit' && viewModel.aa == id) {
//						viewModel.activityChildData.setEnable(true);
						return true;
					} else {
//						viewModel.activityChildData.setEnable(false);
						return false;
					}
				},
				//返回事件
				listBack: function(){
					window.history.go(-1);
					return false;
				}
			}

			viewModel = u.extend(basicDatas, events)

			var getInitData = function() {
				viewModel.gridStatus("read");
				$.ajax({
					type : 'get',//extfunctiondefine
					url : appCtx+'/security/extfunction/page?page.size=1000',
					success : function(data) {
						var data = data['content'];
						viewModel.treeData.setSimpleData(data);
						viewModel.activityData.setSimpleData(data);
						viewModel.activityData.setAllRowsUnSelect();

                        u.hideLoader()

						if(data!=null && data[0].id!=null && data[0].id!=""){
							$.ajax({
								type : 'get',
								url : appCtx+'/security/extfuncactivity/page?search_EQ_funcID='
										+ data[0].id,
								dataType : 'json',
								contentType : "application/json ; charset=utf-8",
								success : function(data) {
                                    u.hideLoader();
									var data = data['content'];
									viewModel.setShowName(data);
									viewModel.activityChildData.setSimpleData(data);
									viewModel.activityChildData.setAllRowsUnSelect();
									viewModel.activityChildData.setRowUnFocus();
								}
							})
						}

					}
				})
			}

			return {
				init : function(content,tabid) {
					content.innerHTML = html;
					$('body').css('overflow','hidden');
					$("#ctxBody").css('height',$('body').height()-41);
					viewModel.mutlilang.init();
					window.vm = viewModel;

					app = u.createApp({
						el : '#content',
						model : viewModel
					})
					getInitData();
                    viewModel.initI18n();
                    window.headerInit($('#demo-mdlayout .function-head-row')[0],$.i18n.prop('js.pag.fun.0019'));
//					$("#searchtxt").click(function(){
//						$(this).val("");
//					})
//					$("#searchtxt").blur(function(){
//						if($(this).val() == "" || $(this).val() == "请输入关键词")
//						$(this).val("请输入关键词");
//					})

				}
			}

		});