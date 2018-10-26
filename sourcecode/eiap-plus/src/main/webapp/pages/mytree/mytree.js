
define(['text!./mytree.html','./meta.js','css!./mytree.css', '../../config/sys_const.js','css!../../style/style.css','css!../../style/widget.css'], function (html) {
	
	var init = function(element){
		var treelistUrl = appCtx+'/mytree/list';
		var treedelUrl = appCtx+'/mytree/del/';
		var treesaveUrl = appCtx+'/mytree/save';
		
		var tablelistUrl = appCtx+'/tree_b/list';
		var tabledelUrl = appCtx+'/tree_b/del/';
		var tablesaveUrl = appCtx+'/tree_b/save';
			
		var viewModel = {
				app:{},
				/* 数据模型 */
				draw:1,
				totlePage:0,
				pageSize:5,
				totleCount:0,

				/* 树数据 */
				mytreedata : new u.DataTable(metaTree),
				
				/* 编辑框树数据 */
				mytreedatanew : new u.DataTable(metaTree),
				
				
				/* 电话本数据 */
				tree_bdata : new u.DataTable(metatree_b),
				
				/* 电话本数据 */
				tree_bdatanew : new u.DataTable(metatree_b),
				
			refOrganizationDa_pk_org: new u.DataTable({
				meta: {
                    'id': {},
                    'name': {},
                    'parentid': {}
                }
            }),
            
			refOrganizationDa_pk_mainorg: new u.DataTable({
				meta: {
                    'id': {},
                    'name': {},
                    'parentid': {}
                }
            }),
            
			refOrganizationDa_pk_org_tree_b: new u.DataTable({
				meta: {
                    'id': {},
                    'name': {},
                    'parentid': {}
                }
            }),
            
			refOrganizationDa_pk_mainorg_tree_b: new u.DataTable({
				meta: {
                    'id': {},
                    'name': {},
                    'parentid': {}
                }
            }),
            
				
				/* 树设置 */
				treeSetting : {
					view : {
						showLine : false,
						selectedMulti : false
					},
					callback : {
						onClick : function(e, id, node) {
							treeid=[];
							viewModel.event.getAllChildren(node,treeid);
						  	var pid = node.pId;
						   	viewModel.event.loadTable(treeid);
						}
					}
				
				},
				event:{
					
	                //清除datatable数据
	                clearDt: function (dt) {
	                	dt.removeAllRows();
	                	dt.clear();
	                },
					
					/* 获得树节点的所有子节点 */
					getAllChildren:function(node,childrenlist){
						childrenlist.push(node.id)
						if(node.children){
							var i;
							for(i=0;i<node.children.length;i++){
								viewModel.event.getAllChildren(node.children[i],childrenlist);
							}
						}
					},

					loadTable:function(instit){
						var jsonData={
								pageIndex:viewModel.draw-1,
								pageSize:viewModel.pageSize,
								sortField:"ts",
								sortDirection:"asc"
							};
						/*右表的上面详细信息显示*/
						var infoDiv = document.getElementById('infoPanel');
						var dtVal = viewModel.mytreedata.getValue('code');
						infoDiv.innerHTML = dtVal;
						//end
						$(element).find("#search").each(function(){
							if(this.value == undefined || this.value =='' || this.value.length ==0 ){
								//不执行操作
							}else{
								jsonData['search_searchParam'] =  this.value.replace(/(^\s*)|(\s*$)/g, "");  //去掉空格
							}
						});
						if(instit){
							if(instit!=''||instit.length!=0){
								jsonData['search_fk_id_tree_b'] = instit.join();
							}
						}
						$.ajax({
							type : 'get',
							url : tablelistUrl,
							dataType : 'json',
							data:jsonData,
							contentType: 'application/json;charset=utf-8',
							success : function(res) {
								if(res){
									if( res.success =='success'){
										if(!res.detailMsg.data){
											viewModel.totleCount=0;
											viewModel.totlePage=1;
											viewModel.event.comps.update({totalPages:viewModel.totlePage,pageSize:viewModel.pageSize,currentPage:viewModel.draw,totalCount:viewModel.totleCount});
											viewModel.tree_bdata.removeAllRows();
											viewModel.tree_bdata.clear();
										}else{
											viewModel.totleCount=res.detailMsg.data.totalElements;
											viewModel.totlePage=res.detailMsg.data.totalPages;
											viewModel.event.comps.update({totalPages:viewModel.totlePage,pageSize:viewModel.pageSize,currentPage:viewModel.draw,totalCount:viewModel.totleCount});
											viewModel.tree_bdata.removeAllRows();
											viewModel.tree_bdata.clear();
											viewModel.tree_bdata.setSimpleData(res.detailMsg.data.content,{unSelect:true});
										}
									}else{
										var msg = "";
										if(res.success == 'fail_global'){
											msg = res.message;
										}else{
											for (var key in res.detailMsg) {
												msg += res.detailMsg[key] + "<br/>";
											}
										}
										u.messageDialog({msg:msg,title:'请求错误',btnText:'确定'});									
									}
								}else{
									u.messageDialog({msg:'后台返回数据格式有误，请联系管理员',title:'数据错误',btnText:'确定'});
								}

							},
							error:function(er){
								u.messageDialog({msg:'请求超时',title:'请求错误',btnText:'确定'});
							}
						})
					},
					loadTree:function(){
						$.ajax({
							type : 'get',
							url : treelistUrl,
							dataType : 'json',
							success : function(res) {
								if(res){
									if( res.success =='success'){
										if(res.detailMsg.data){
											viewModel.mytreedata.removeAllRows();
											viewModel.mytreedata.clear();
											viewModel.mytreedata.setSimpleData(res.detailMsg.data,{unSelect:true});
	                                        $("#tree2")[0]['u-meta'].tree.expandAll(true);
	/*                                        for(var i=0;i<$("#tree2")[0]['u-meta'].tree.getNodeByTId('tree2_1').children.length;i++){
	                                            $("#tree2")[0]['u-meta'].tree.expandNode($("#tree2")[0]['u-meta'].tree.getNodeByTId('tree2_1').children [i],false,false,false)
	                                        }*/
										}
									}else{
										var msg = "";
										if(res.success == 'fail_global'){
											msg = res.message;
										}else{
											for (var key in res.detailMsg) {
												msg += res.detailMsg[key] + "<br/>";
											}
										}
										u.messageDialog({msg:msg,title:'请求错误',btnText:'确定'});									
									}
								}else{
									u.messageDialog({msg:'后台返回数据格式有误，请联系管理员',title:'数据错误',btnText:'确定'});
								}

							},
							error:function(er){
								u.messageDialog({msg:'请求超时',title:'请求错误',btnText:'确定'});
							}
						})
					},
					//组装list
					genDataList:function(data){
						var datalist = [];
						datalist.push(data);
						return datalist ;
					},
					//新增和更新组织树
					saveTree:function(data){
						var list=viewModel.event.genDataList(data);
						$.ajax({
							type : 'post',
							url : treesaveUrl,
							dataType : 'json',
							contentType : "application/json",
							data : JSON.stringify(list),
							success : function(res) {
								if(res){
									if( res.success =='success'){
										u.messageDialog({msg: '保存成功！', btnText: '确定'});
										viewModel.event.loadTree();
										md.close();
									}else{
										var msg = "";
										if(res.success == 'fail_global'){
											msg = res.message;
										}else{
											for (var key in res.detailMsg) {
												msg += res.detailMsg[key] + "<br/>";
											}
										}
										u.messageDialog({msg:msg,title:'操作提示',btnText:'确定'});
									}
								}else{
									u.messageDialog({msg:'没有返回数据',title:'操作提示',btnText:'确定'});
								}
							}
						})
						
						},
						//删除组织树
						deleteTree: function(data) {
				        	var datalist = viewModel.event.genDataList(data);
				            var json = JSON.stringify(datalist);
				            $.ajax({
				                url: treedelUrl,
				                data: json,
				                dataType: 'json',
				                type: 'post',
				                contentType: 'application/json',
				                success: function (res) {
				                	if(res){
				                	       if (res.success == 'success') {
				                	    	   u.messageDialog({msg:'删除成功',title:'操作提示',btnText:'确定'});
				    	                    } else {
												var msg = "";
											   if(res.success == 'fail_global'){
												   msg = res.message;
											   }else{
												   for (var key in res.detailMsg) {
													   msg += res.detailMsg[key] + "<br/>";
												   }
											   }
											   u.messageDialog({msg:msg,title:'操作提示',btnText:'确定'});
				    	                    }
				                	}else{
										u.messageDialog({msg:'无返回数据',title:'操作提示',btnText:'确定'});
									}
				             
				                },
								error:function(er){
									u.messageDialog({msg:'操作请求失败，'+er,title:'操作提示',btnText:'确定'});
								}
				            });
				        },
				        //更新和保存人员
				        saveMan:function(data){
							var list=viewModel.event.genDataList(data);
							$.ajax({
								type : 'post',
								url : tablesaveUrl,
								dataType : 'json',
								contentType : "application/json",
								data : JSON.stringify(list),
								success : function(res) {
									if(res){
										if( res.success =='success'){
											u.messageDialog({msg: '保存成功！', btnText: '确定'});
											viewModel.event.loadTable(treeid);
											md.close();
										}else{
											var msg = "";
											if(res.success == 'fail_global'){
												msg = res.message;
											}else{
												for (var key in res.detailMsg) {
													msg += res.detailMsg[key] + "<br/>";
												}
											}
											u.messageDialog({msg:msg,title:'操作提示',btnText:'确定'});
										}
									}else{
										u.messageDialog({msg:'没有返回数据',title:'操作提示',btnText:'确定'});
									}
								}
							});
				        },
				        //删除人员
				        delMan:function(data){
							var list=viewModel.event.genDataList(data);
							$.ajax({
								type : 'post',
								url : tabledelUrl,
								dataType : 'json',
								contentType : "application/json",
								data : JSON.stringify(list),
								success : function(res) {
									if( res.success =='success'){
										u.messageDialog({msg: '删除成功！', btnText: '确定'});
										 //md.close();
									}else{
										u.messageDialog({msg: '删除失败！', btnText: '确定'});
									}
								}
							})
				        },
				    //分页相关
					pageChange:function(){
						viewModel.event.comps.on('pageChange', function (pageIndex) {
							viewModel.draw = pageIndex + 1;
							viewModel.event.loadTable(treeid);
						});
					},
					sizeChange:function(){
						viewModel.event.comps.on('sizeChange', function (arg) {
							viewModel.pageSize = parseInt(arg);
							viewModel.draw = 1;
							viewModel.event.loadTable(treeid);
						});
					},
					
					//页面初始化
					pageInit : function() {
						treeid=[];
						
						viewModel.app = u.createApp({
							el :element /* Document.body */,
							model : viewModel
						})

						//分页初始化	
						var paginationDiv = $(element).find('#pagination')[0];
						this.comps=new u.pagination({el:paginationDiv,jumppage:true});
						this.loadTree();
						viewModel.event.pageChange();
						viewModel.event.sizeChange();	
						
	                    //回车搜索
	                    $('.input_enter').keydown(function(e){
	                        if(e.keyCode==13){
	                        	viewModel.event.searchClick()
	                        }
	                    });
					
					},
					addinstitClick:function(){
						$('#dialog_content_instit').find('.u-msg-title').html("<h4>新增机构</h4>");
						viewModel.event.clearDt(viewModel.mytreedatanew);
						var row = viewModel.mytreedata.getSelectedRows()[0];
						
						if(row){
							var parentId = row.getValue('pk_tree');
							var parentName = row.getValue('code');
						}
						
						var newr = viewModel.mytreedatanew.createEmptyRow();
			            viewModel.mytreedatanew.setRowSelect(newr);
			            
			            if(row){
			            	var newrow = viewModel.mytreedatanew.getSelectedRows()[0];
			            	newrow.setValue('pk_parent',parentId);
			            	newrow.setValue('pk_parent_name',parentName);
			            }

			            window.md = u.dialog({id:'add_depart',content:"#dialog_content_instit",hasCloseMenu:true});
					},
					editinstitClick:function(){
						$('#dialog_content_instit').find('.u-msg-title').html("<h4>编辑机构</h4>");
						viewModel.event.clearDt(viewModel.mytreedatanew);
						var row = viewModel.mytreedata.getSelectedRows()[0];
						if(row){
							if(row.data.parentid.value){
								row.setValue('pk_parent_name',$("#tree2")[0]['u-meta'].tree.getNodeByParam('id',row.getValue('parentid')).name);
							}
							viewModel.mytreedatanew.setSimpleData(viewModel.mytreedata.getSimpleData({type: 'select'}));
							window.md = u.dialog({id:'edit_depart',content:"#dialog_content_instit",hasCloseMenu:true});
						}else{
							u.messageDialog({msg:'请选择要编辑的数据！',title:'操作提示',btnText:'确定'});
						}
					},
					delinstitClick:function(){
						var row = viewModel.mytreedata.getSelectedRows()[0]
						if(row){
							var data = viewModel.mytreedata.getSelectedRows()[0].getSimpleData()
							u.confirmDialog({
					            msg: "是否删除"+data.institName+"?",
					            title: "删除确认",
					            onOk: function () {
					                viewModel.event.deleteTree(data);
					                viewModel.mytreedata.removeRow(viewModel.mytreedata.getSelectedIndexs());
					            },
					            onCancel: function () {
					            }
							});
						}else{
							u.messageDialog({msg:'请选择要删除的数据！',title:'操作提示',btnText:'确定'});
						}
					},
					saveinstitClick:function(){
						var data = viewModel.mytreedatanew.getSelectedRows()[0].getSimpleData();
	                    if (!viewModel.app.compsValidate($('#dialog_content_instit')[0])) {
	                        return;
	                    }
                        viewModel.event.saveTree(data);
					},
					cancelinstitClick:function(){
							md.close();
					},
					addManClick:function(){
						$('#dialog_content_man').find('.u-msg-title').html("<h4>新增人员</h4>");
						viewModel.event.clearDt(viewModel.tree_bdatanew);
						var row = viewModel.mytreedata.getSelectedRows()[0];
						if(row){
							var institId = row.getValue('pk_tree');
							var instit = row.getValue('code');
							var newr = viewModel.tree_bdatanew.createEmptyRow();
							viewModel.tree_bdatanew.setRowSelect(newr);
							var newrow = viewModel.tree_bdatanew.getSelectedRows()[0];
							newrow.setValue('fk_id_tree_b',institId);
							window.md = u.dialog({id:'add_man',content:"#dialog_content_man",hasCloseMenu:true});
						}else{
							u.messageDialog({msg:'请选择部门！',title:'操作提示',btnText:'确定'});
						}
					},
					editManClick:function(){
						$('#dialog_content_man').find('.u-msg-title').html("<h4>编辑人员</h4>");
						viewModel.event.clearDt(viewModel.tree_bdatanew);
						var row = viewModel.tree_bdata.getSelectedRows()[0]
						if(row){
							viewModel.tree_bdatanew.setSimpleData(viewModel.tree_bdata.getSimpleData({type: 'select'}));
							window.md = u.dialog({id:'edit_man',content:"#dialog_content_man",hasCloseMenu:true});
						}else{
							u.messageDialog({msg:'请选择要编辑的数据！',title:'操作提示',btnText:'确定'});
						}
					},
					delManClick:function(){
						var row = viewModel.tree_bdata.getSelectedRows()[0];
						if(row){
							var data = viewModel.tree_bdata.getSelectedRows()[0].getSimpleData()
							u.confirmDialog({
					            msg: "是否删除"+data.peoName+"?",
					            title: "删除确认",
					            onOk: function () {
					                viewModel.event.delMan(data);
					                viewModel.tree_bdata.removeRow(viewModel.tree_bdata.getSelectedIndexs());
					            },
					            onCancel: function () {
					            }
							});
						}else{
							u.messageDialog({msg:'请选择要删除的数据！',title:'操作提示',btnText:'确定'});
						}
					},
					saveManClick:function(){
						var data = viewModel.tree_bdatanew.getSelectedRows()[0].getSimpleData();
	                    if (!viewModel.app.compsValidate($('#add-form')[0])) {
	                        return;
	                    }
                        viewModel.event.saveMan(data);
					},
					cancelManClick:function(){
							md.close();
					},
					searchClick:function(){
						viewModel.draw = 1; 
						viewModel.event.loadTable(treeid);
					},
                //选择参照（树）
                selectOrganization_mytree_pk_org: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/mytree/Organization_pk_org/listall';
                    viewModel.event.showOrganizationTreeDiv_mytree_pk_org(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showOrganizationTreeDiv_mytree_pk_org: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refOrganizationDa_pk_org.setSimpleData(res.detailMsg.data);
                                $("#OrganizationFormytreeTree_pk_org")[0]['u-meta'].tree.expandAll(true);
                                window.refmd = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-OrganizationFormytree_pk_org',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_OrganizationTomytree_pk_org'), null, viewModel.event.confirmSelectOrganizationTomytree_pk_org);
                            } else {
                                u.showMessage({
                                    msg: '<i class="fa fa-times-circle margin-r-5"></i>' + res.message,
                                    position: "bottom",
                                    msgType: "error"
                                });
                            }
                        } 
                    });
                },
                
                /**选中某一个参照到主表 */
                confirmSelectOrganizationTomytree_pk_org: function () {
                    var zTree = $("#OrganizationFormytreeTree_pk_org")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_org.getRowByField('id', id).getSimpleData();
                        viewModel.mytreedatanew.setValue('pk_org', node.id)
                        viewModel.mytreedatanew.setValue('pk_org_name', node.name);
                    }
                    refmd.close();
                },               
               
                //选择参照（树）
                selectOrganization_mytree_pk_mainorg: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/mytree/Organization_pk_mainorg/listall';
                    viewModel.event.showOrganizationTreeDiv_mytree_pk_mainorg(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showOrganizationTreeDiv_mytree_pk_mainorg: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refOrganizationDa_pk_mainorg.setSimpleData(res.detailMsg.data);
                                $("#OrganizationFormytreeTree_pk_mainorg")[0]['u-meta'].tree.expandAll(true);
                                window.refmd = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-OrganizationFormytree_pk_mainorg',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_OrganizationTomytree_pk_mainorg'), null, viewModel.event.confirmSelectOrganizationTomytree_pk_mainorg);
                            } else {
                                u.showMessage({
                                    msg: '<i class="fa fa-times-circle margin-r-5"></i>' + res.message,
                                    position: "bottom",
                                    msgType: "error"
                                });
                            }
                        } 
                    });
                },
                
                /**选中某一个参照到主表 */
                confirmSelectOrganizationTomytree_pk_mainorg: function () {
                    var zTree = $("#OrganizationFormytreeTree_pk_mainorg")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_mainorg.getRowByField('id', id).getSimpleData();
                        viewModel.mytreedatanew.setValue('pk_mainorg', node.id)
                        viewModel.mytreedatanew.setValue('pk_mainorg_name', node.name);
                    }
                    refmd.close();
                },               
               

                //选择参照（树）
                selectOrganization_tree_b_pk_org: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/tree_b/Organization_pk_org/listall';
                    viewModel.event.showOrganizationTreeDiv_tree_b_pk_org(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showOrganizationTreeDiv_tree_b_pk_org: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refOrganizationDa_pk_org_tree_b.setSimpleData(res.detailMsg.data);
                                $("#OrganizationFortree_bTree_pk_org")[0]['u-meta'].tree.expandAll(true);
                                window.refmd = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-OrganizationFortree_b_pk_org',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_OrganizationTotree_b_pk_org'), null, viewModel.event.confirmSelectOrganizationTotree_b_pk_org);
                            } else {
                                u.showMessage({
                                    msg: '<i class="fa fa-times-circle margin-r-5"></i>' + res.message,
                                    position: "bottom",
                                    msgType: "error"
                                });
                            }
                        } 
                    });
                },
                
                /**选中某一个参照到子表 */
                confirmSelectOrganizationTotree_b_pk_org: function () {
                    var zTree = $("#OrganizationFortree_bTree_pk_org")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_org_tree_b.getRowByField('id', id).getSimpleData();
                        viewModel.tree_bdatanew.setValue('pk_org', node.id)
                        viewModel.tree_bdatanew.setValue('pk_org_name', node.name);
                    }
                    refmd.close();
                },               
               
                //选择参照（树）
                selectOrganization_tree_b_pk_mainorg: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/tree_b/Organization_pk_mainorg/listall';
                    viewModel.event.showOrganizationTreeDiv_tree_b_pk_mainorg(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showOrganizationTreeDiv_tree_b_pk_mainorg: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refOrganizationDa_pk_mainorg_tree_b.setSimpleData(res.detailMsg.data);
                                $("#OrganizationFortree_bTree_pk_mainorg")[0]['u-meta'].tree.expandAll(true);
                                window.refmd = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-OrganizationFortree_b_pk_mainorg',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_OrganizationTotree_b_pk_mainorg'), null, viewModel.event.confirmSelectOrganizationTotree_b_pk_mainorg);
                            } else {
                                u.showMessage({
                                    msg: '<i class="fa fa-times-circle margin-r-5"></i>' + res.message,
                                    position: "bottom",
                                    msgType: "error"
                                });
                            }
                        } 
                    });
                },
                
                /**选中某一个参照到子表 */
                confirmSelectOrganizationTotree_b_pk_mainorg: function () {
                    var zTree = $("#OrganizationFortree_bTree_pk_mainorg")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_mainorg_tree_b.getRowByField('id', id).getSimpleData();
                        viewModel.tree_bdatanew.setValue('pk_mainorg', node.id)
                        viewModel.tree_bdatanew.setValue('pk_mainorg_name', node.name);
                    }
                    refmd.close();
                },               
               
				/**
                 * 关闭弹出框
                 */
                mdClose: function () {
                    refmd.close();
                },
              

                /**绑定弹出层 树的按钮 */
                bindClickButton: function (ele, data, functionevent) { //对某一个按钮进行  点击事假绑定 ele:被绑定的元素，  data：需要传递的数据，functionevent：绑定的方法
                    $(ele).unbind('click'); //取消之前的绑定
                    $(ele).bind('click', data, functionevent); //重新绑定
                },
                
 

					
			}
		};
		$(element).html(html) ;
		viewModel.event.pageInit();
        viewModel.event.pageChange();
        viewModel.event.sizeChange();
	}
	
	return {
		'template': html,
        init:init
	}
});
