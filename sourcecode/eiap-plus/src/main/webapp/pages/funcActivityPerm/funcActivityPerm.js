define(['text!./funcActivityPerm.html','css!./productmgr.css', '../../config/sys_const.js','css!../../style/style.css','css!../../style/widget.css'], function (html) {
//define(['error','text!./bterRole.html','dtree','css!./productmgr.css','uuigrid','uuitree','utilrow'], function (errors,html,dtree) {

	'use strict';

	var _CONST = {
			STATUS_ADD: 'add',
			STATUS_INIT: 'init',
			STATUS_EDIT: 'edit'
	},
	wbCtx = "/wbalone",
	app,
	viewModel,
	treeSetting,
	treeSetting2,
	basicDatas,
	computes,
	oper,
	events,
	lsroleid,
	funcid,
	pagesize=10,//记录当前页面每页显示多少条
	lsrolecode,
	tempFuncData;
	treeSetting = {
			view:{
				showLine:false,
	            autoCancelSelected: true,
	            selectedMulti:true
	        },
			"check" : {
				"enable" : false
			},
			callback : {
				onClick : function(e, id, node) {
					viewModel.setCurrentRow(node.id);// 设置选中行
					var listdat = viewModel.listData.getCurrentRow();
					var dat = viewModel.functionData.getCurrentRow();
					funcid = dat.getSimpleData().id;
					var enableaction = dat.getSimpleData().enableAction;
					if("Y" == enableaction){
						//加载当前功能节点下按钮
						$.ajax({
							type : 'get',
							url : wbCtx+'/security/extfuncactivity/page?search_EQ_funcID='
								+ node.id+"&search_EQ_isactive=Y",
								dataType : 'json',
								contentType : "application/json ; charset=utf-8",
								success : function(data) {
									var data1 = data['content'];
									viewModel.activityChildData.setSimpleData(data1);
									viewModel.activityChildData.setAllRowsUnSelect();
									//加载当前功能节点下已分配权限按钮
									$.ajax({
										type : 'get',
										url : wbCtx+"/security/ext_role_function/pagePermAction?roleId="+ lsroleid+"&funcId="+funcid+"",
										dataType : 'json',
										contentType : "application/json ; charset=utf-8",
										success : function(data2) {
											var sIndices = [];
											var rows = viewModel.activityChildData.getAllRows();
											for(var i=0;i<rows.length;i++){
												var id = rows[i].getSimpleData().id;
												for(var ii=0;ii<data2.length;ii++) {
													var dataid = data2[ii];
													if(dataid == id){
														sIndices.push(rows[i]);
													}
												}
											}
//											lsroleid = listdat.getSimpleData().id;
//											lsrolecode = listdat.getSimpleData().roleCode;
											viewModel.activityChildData.setRowsSelect(sIndices);
										},
										error: function(XMLHttpRequest, textStatus, errorThrown) {
											errors.error(XMLHttpRequest);
										}
									})
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									errors.error(XMLHttpRequest);
								}
						})
					}else{
						u.messageDialog({
							msg : "该功能节点未开启按钮权限",
							title : "提示",
							btnText : "OK"
						});

					}
				}
			}
	},
		
	basicDatas = {
			isEditStatus : ko.observable(false),
			treeSetting : treeSetting,
			//功能注册
			functionData: new u.DataTable({
				meta: {
					funcCode: {
						type: 'string'
					},
					funcName: {
						type: 'string'
					},
					parentId: {
						type: 'string'
					},
					enableAction: {
						type: 'string'
					},
					id: {
						type: 'string'
					}
				}
			}),
			activityChildData : new u.DataTable({
				meta : {
					activityName : {
						type : 'string'
					},
					activityCode : {
						type : 'string'
					},
//					funcCode : {
//						type : 'string'
//					},
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
			//角色
			listData: new u.DataTable({
				meta: {
					roleCode: {
						type: 'string',required: true
					},
					roleId: {
						type: 'string'
					},
					roleName: {
						type: 'string',required: true
					},
					roleType: {
						type: 'string',required: true
					},
					labelName: {
						type: 'string',required: true
					},
					ts:{type: 'string'},
					dr:{type: 'int'}
				}
			}),
			//角色查询
			searchData: new u.DataTable({
				meta: {
					roleCode: {
						type: 'string'
					},
					roleName: {
						type: 'string'
					}
				}
			}),
			formStatus: ko.observable(_CONST.STATUS_INIT),
			gridStatus : ko.observable("init")

	};

	computes = {
			refFormInputValue: function(field) {
				return ko.pureComputed({
					read: function read() {

						if (viewModel.formStatus() == _CONST.STATUS_ADD) {
							var fr = this.getFocusRow();
							return fr != null ? fr.ref(field) : '';
						} else if (viewModel.formStatus() == _CONST.STATUS_EDIT) {
							var srs = this.getSelectedRows();
							return srs.length > 0 ? srs[0].ref(field) : '';
						}
					},
					owner: viewModel.listData
				});
			}
	};

	events = {
			//角色关联功能，选中or取消选中事件
			xzmenth : function(obj){
				selected(obj);
			},
			qxmenth : function(obj){
				unselected(obj);
			},
			setCurrentRow : function(id) {// 设置选中行
				var allrow = viewModel.functionData.getAllRows();
				if (allrow && id) {
					for ( var i in allrow) {
						var row = allrow[i];
						if (row instanceof u.Row)
							if (row.getValue('id') == id) {
								viewModel.functionData.setRowSelect(row);
							}
					}
				}

			},
			/**
			 * 分页
			 * 
			 */
			pageChangeFunc: function(pageIndex) {
				//pagesize=size;
				//pagesize没有用，后台设置不进去
				viewModel.listData.pageIndex(pageIndex);
				getInitData();
//				$.ajax({
//					type: 'get',//extroledefine
//					url:appCtx+"/security/extrole/page?page.size="+pagesize+"&page="+(pageIndex+1)+"",
//					success: function(data) {
//						var total = data.totalElements;//共多少条
//						var data =data['content'];
//						viewModel.listData.setSimpleData(data);
//						viewModel.listData.setAllRowsUnSelect();
//						var pages = CalculatePageCount(pagesize,total);//计算共多少页
//						viewModel.listData.totalPages(pages); //共多少页
//						viewModel.listData.totalRow(total); 
//					},
//					error: function(XMLHttpRequest, textStatus, errorThrown) {
//						errors.error(XMLHttpRequest);
//					}
//				})
			},
			sizeChangeFunc: function(size, pageIndex) {
				pagesize=size;
				viewModel.listData.pageIndex(0);
				getInitData();
			},
			/*//角色查询分页
			searchClick: function() {
				var row = viewModel.searchData.getCurrentRow();
				var datas = {};
				datas["page.size"] = pagesize;
				if(row!=null){
					datas["params"] = row.getSimpleData();			
				}else{
					datas["params"] = null;
				}
				var pn = viewModel.listData.pageIndex() + 1;
				$.ajax({
					type: 'post',
					//extroledefine
					//url:appCtx+"/security/extrole/queryArea",
					url:wbCtx+"/roleMGT/listWithPaging",
					dataType: 'json',
					contentType: "application/json ; charset=utf-8",
					data: JSON.stringify({"pn": pn || "1","pageSize":pagesize}),//JSON.stringify(datas),
					success: function(result) {
//						var total = data.totalElements;//共多少条
//						viewModel.listData.setSimpleData(data.content);
//						viewModel.listData.pageSize(pagesize);//每页显示多少条
//						var pages = CalculatePageCount(pagesize,total);//计算共多少页
//						viewModel.listData.totalPages(pages); //共多少页
//						viewModel.listData.totalRow(total);
						var data = result.data;
						viewModel.listData.pageSize(pagesize);//每页显示多少条
						viewModel.listData.setSimpleData(data.content);
						viewModel.listData.totalPages(data.totalPages);
						viewModel.listData.totalRow(data.totalElements); 
						viewModel.listData.setAllRowsUnSelect();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						errors.error(XMLHttpRequest);
					}
				})
			},*/
			
			//角色查询分页
			searchClick: function() {
				// 查询参数
	            var options = {
	                "pn": viewModel.listData.pageIndex() + 1,
	                "ps": pagesize,
	                "sortType": "",
	                "search_LIKE_roleName": $("input#s-name").val(),
	                "search_LIKE_roleCode": $("input#s-loginName").val(),
	                "search_EQ_label": $("select#s-state").val()
	            };
				$.ajax({
					type: 'get',
					url:wbCtx+"/roleMGT/listRolePage",
					dataType: 'json',
					contentType: "application/json ; charset=utf-8",
					data: options/*JSON.stringify(options)*/,
					success: function(result) {
						var data = result.data;
						viewModel.listData.pageSize(pagesize);//每页显示多少条
						viewModel.listData.setSimpleData(data.content);
						viewModel.listData.totalPages(data.totalPages);
						viewModel.listData.totalRow(data.totalElements); 
						viewModel.listData.setAllRowsUnSelect();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						errors.error(XMLHttpRequest);
					}
				})
			},
			
			searchTreeClick:function(){
				var funcName = $('#searchtxt').val();
				/*$.ajax({
					type : 'get',//extfunctiondefine
					url : '/wbalone/security/extfunction/page?page.size=1000&search_LIKE_funcName='+funcName,
					dataType : 'json',
					contentType : "application/json ; charset=utf-8",
					success : function(data) {
						var data = data['content'];
						viewModel.functionData.setSimpleData(data);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						errors.error(XMLHttpRequest);
					}
				})*/
				var tempArray = [];
				if(tempFuncData!=null){
					if(funcName!=null){
						for(var i=0; i<tempFuncData.length; i++){
							if(tempFuncData[i].funcName.indexOf(funcName)>-1){
								tempArray.push(tempFuncData[i]);
							}
						}
						viewModel.functionData.setSimpleData(tempArray);
					}else{
						viewModel.functionData.setSimpleData(tempFuncData);
					}
				}
			},

			// 按钮权限保存   
			btnsaveClick: function() {
//				if (viewModel.activityChildData.getSelectedRows().length < 1) {
//					u.messageDialog({
//						msg : "请选择一行操作数据",
//						title : "提示",
//						btnText : "OK"
//					});
//					return
//				}
				viewModel.gridStatus("read");
				var dats = [];
				var dat = viewModel.activityChildData.getSimpleData({type:"select"});
				for(var i=0;i<dat.length;i++){
					dats.push(dat[i]);
				}
				var json={
						"datas":dats,
						"roleid":lsroleid,
						"rolecode":lsrolecode,
						"funcId":funcid
				};
				// 新增保存
				$.ajax({
					type: 'POST',
					url: wbCtx+'/security/ext_role_function/createBatchBtn',
					dataType: 'json',
					contentType: "application/json ; charset=utf-8",
					data: JSON.stringify(json),
					success: function(data) {
						if(data.msg==undefined){
							u.messageDialog({msg:"保存成功",title:"提示", btnText:"OK"});
						}else if(data.msg.length>0){
							u.messageDialog({msg:"分配成功！",title:"提示", btnText:"OK"});
//							viewModel.functionRoleData.removeRows(viewModel.functionRoleData.getSelectedRows());
//							var md = document.querySelector('#role-mdlayout')['u.MDLayout'];
//							md.dBack();
//							getInitData();
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						errors.error(XMLHttpRequest);
					}
				})

			},

			/**
			 * 角色按钮事件
			 * 
			 * 
			 * 
			 */
			// 返回按钮
			backClick: function() {
				var status = viewModel.formStatus();
				viewModel.formStatus(_CONST.STATUS_INIT);
				viewModel.gridStatus("init");
				if (status == _CONST.STATUS_ADD) {
					viewModel.listData.removeRow(viewModel.listData.rows().length - 1);
				} else if (status == _CONST.STATUS_EDIT) {
					var r = viewModel.listData.getSelectedRows()[0];
					r.setSimpleData(r.originData);
				}
				var md = document.querySelector('#role-mdlayout')['u.MDLayout'];
				viewModel.isEditStatus(false);
				md.dBack();
//				var yid = viewModel.listData.getCurrentRow().rowId;
				getInitData();
//				viewModel.listData.setRowSelect(yid);
			},

//			//双击进入卡片
//			dbClick: function(row, e) {
//				viewModel.formStatus(_CONST.STATUS_INIT);
//				viewModel.gridStatus("read");
//				lsroleid = row.rowObj.value.id;
//				lsrolecode = row.rowObj.value.role_code;
//				$.ajax({
//					type: 'get',
//					url:appCtx+'/security/ext_user_role/query/'+lsroleid,
//					success: function(data) {
//						viewModel.listData.setRowSelect(row.rowIndex);
//						var md = document.querySelector('#role-mdlayout')['u.MDLayout'];
//						md.dGo('role_addPage');
//						document.getElementById("role_userdiv").style.display ="block";
//						var r = viewModel.listData.getSelectedRows()[0];
//						r.originData = r.getSimpleData();
//						viewModel.userRoleData.setSimpleData(data);
//						viewModel.userRoleData.setAllRowsUnSelect();
////						document.getElementById("addPage").style.display ="block";
//					},
//					error: function(XMLHttpRequest, textStatus, errorThrown) {
//						errors.error(XMLHttpRequest);
//					}
//				})
//			},
			// 分配按钮权限
			assignbtnclick: function(row, e) {
				if (viewModel.listData.getSelectedRows().length != 1) {
					u.messageDialog({
						msg : "请选择一行操作数据",
						title : "提示",
						btnText : "OK"
					});
					return
				}
				viewModel.activityChildData.clear();
				var dat = viewModel.listData.getCurrentRow();
				$.ajax({
					type: 'get',
					url:wbCtx+'/security/ext_role_function/pagePermFunction/'+dat.getSimpleData().id,
					success: function(data) {
						viewModel.functionData.setSimpleData(data);
						tempFuncData = data;
						lsroleid = dat.getSimpleData().id;
						lsrolecode = dat.getSimpleData().roleCode;
						viewModel.gridStatus("read");
						viewModel.listData.clear();
						//viewModel.listData.setSimpleData(data);
//						document.getElementById("showbtnPage").style.display ="block";
						viewModel.isEditStatus(true);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						errors.error(XMLHttpRequest);
					}
				});
				var md = document.querySelector('#role-mdlayout')['u.MDLayout'];
				md.dGo('role_showbtnPage');
			},
			afterAdd: function(element, index, data) {
				if (element.nodeType === 1) {
					u.compMgr.updateComp(element);
				}
			},
			dataSearchByroleType: ko.observableArray([]),
	        loadRoleType: function () {
	            var uri = wbCtx + '/label/listByGroup';
	            $.ajax({
	                type: 'get',
	                dataType: 'json',
	                url: uri,
	                data: {"group": "person"},
	                success: function (res) {
	                    if (res.status === 1) {
	                        var data = res.data;
	                        viewModel.dataSearchByroleType(data);
	                    }
	                }
	            });

	        },
			listBack: function(){
				window.history.go(-1);
				return false;
			}

	};
	
	viewModel = u.extend({}, basicDatas, computes, events);

	var getInitData = function() {
		viewModel.searchData.createEmptyRow();
		viewModel.searchClick();
		viewModel.loadRoleType();
	};

	return {
		init: function(content,tabid) {
			content.innerHTML = html;
			window.vm = viewModel;

			app = u.createApp({
				el : '#content',
				model: viewModel
			});

			getInitData();
			
			//点击搜索按钮toggle search  panel
	        $("#condionSearch").click(function () {
	            $("#condition-row").slideToggle(function () {
	                if ($(this).is(':hidden')) {
	                    $("#condionSearch .icon-arrow-down").css("display", "inline-block");
	                    $("#condionSearch .icon-arrow-up").css("display", "none");
	                } else {
	                    $("#condionSearch .icon-arrow-down").css("display", "none");
	                    $("#condionSearch .icon-arrow-up").css("display", "inline-block");
	                }
	            });
	        });
	        //处理搜索任务
	        $("#condition-row")
	            .on("keypress", "input", function (event) {
	                if (event.keyCode == 13) {
	    				viewModel.listData.pageIndex(0);
	                    viewModel.searchClick();
	                }
	            })
	            .on("change", "select", function (e) {
	            	viewModel.listData.pageIndex(0);
	                viewModel.searchClick();
	            });
		}
	};
});