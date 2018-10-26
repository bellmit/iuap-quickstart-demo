define(['text!./teacher.html','./meta.js','css!./teacher.css', '../../config/sys_const.js','css!../../style/style.css','css!../../style/widget.css'], function (html) {
	
	var init=function(element){
		var listUrl = appCtx+'/teacher/list';
		var delUrl = appCtx+'/teacher/del/';
		var saveUrl = appCtx+'/teacher/save';
		
		var viewModel = {
				/* 数据模型 */
				draw:1,
				totlePage:0,
				pageSize:5,
				totleCount:0,
	            dt1: new u.DataTable(metaCardTable),
				dtnew:new u.DataTable(metaCardTable),

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
            
			/* 树设置 */
			treeSetting : {
				view : {
					showLine : false,
					selectedMulti : false
				},
				callback : {
					onClick : function(e, id, node) {
						var rightInfo = node.name + '被选中';
					}
				}
			
			},	
				
				event: {
					//清除datatable数据
	                clearDt: function (dt) {
	                	dt.removeAllRows();
	                	dt.clear();
	                },
					// 卡片表数据读取
					initCardTableList:function(){
						var jsonData={
								pageIndex:viewModel.draw-1,
								pageSize:viewModel.pageSize,
//								sortField:"createtime",
//								sortDirection:"asc"
						};
						$(element).find("#search").each(function(){
							if(this.value == undefined || this.value =='' || this.value.length ==0 ){
								//不执行操作
							}else{
								jsonData['search_searchParam'] =  this.value.replace(/(^\s*)|(\s*$)/g, "");  //去掉空格
							}
						});
						$.ajax({
							type:'get',
							url:listUrl,
							datatype:'json',
							data:jsonData,
							contentType: 'application/json;charset=utf-8',
							success:function(res){
								if(res){
									if( res.success =='success'){
										if(res.detailMsg.data){
											viewModel.totleCount=res.detailMsg.data.totalElements;
											viewModel.totlePage=res.detailMsg.data.totalPages;
											viewModel.event.comps.update({totalPages:viewModel.totlePage,pageSize:viewModel.pageSize,currentPage:viewModel.draw,totalCount:viewModel.totleCount});
											viewModel.dt1.removeAllRows();
											viewModel.dt1.clear();
											viewModel.dt1.setSimpleData(res.detailMsg.data.content,{unSelect:true});
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
						});
					},
					//组装list
					genDataList:function(data){
						var datalist = [];
						datalist.push(data);
						return datalist ;
					},
					//字段验证
					checkedCardtable: function (data) {
						var defaultNum = 0;
						if (data == null)
							return false;
						
//						if (data.name == null) {
//							u.messageDialog({msg: '提示：系统名称不能为空！', btnText: '确定'});
//							return false;
//						}
						
						return true;
					},
					//删除方法
					deleteData: function(data) {
						var datalist = viewModel.event.genDataList(data);
						var json = JSON.stringify(datalist);
						$.ajax({
							url: delUrl,
							data: json,
							dataType: 'json',
							type: 'post',
							contentType: 'application/json',
							success: function (res) {
								//md.close();
								if(res){
									if (res.success == 'success') {
										u.messageDialog({msg:'删除成功',title:'操作提示',btnText:'确定'});
									} else {
										var msg = "";
										for(var key in res.message){
											msg +=res.message[key]+"<br/>";
										}
										u.messageDialog({msg:'msg',title:'操作提示',btnText:'确定'});
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
					//新增和更新方法
					saveData:function(data) {
						var datalist = viewModel.event.genDataList(data);
						var json = JSON.stringify(datalist);
						$.ajax({
							url: saveUrl,
							type: 'post',
							data: json,
							dataType: 'json',
							contentType: 'application/json',
							success: function (res) {
								if(res){
									if( res.success =='success'){
										viewModel.event.initCardTableList();
										u.messageDialog({msg:'操作成功',title:'操作提示',btnText:'确定'});
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
					listBack:function(){
					   window.location = '#/appCenter';
					   $('.container-fluid').css("overflow-y","auto");
				  },
					//分页相关
					pageChange:function(){
						viewModel.event.comps.on('pageChange', function (pageIndex) {
							viewModel.draw = pageIndex + 1;
							viewModel.event.initCardTableList();
						});
					},
					sizeChange:function(){
						viewModel.event.comps.on('sizeChange', function (arg) {
							viewModel.pageSize = parseInt(arg);
							viewModel.draw = 1;
							viewModel.event.initCardTableList();
						});
					},
                //选择参照（树）
                selectOrganization_pk_org_teacher: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/teacher/Organization_pk_org/listall';
                    viewModel.event.showOrganizationTreeDiv_teacher_pk_org(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showOrganizationTreeDiv_teacher_pk_org: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refOrganizationDa_pk_org.setSimpleData(res.detailMsg.data);
                                $("#OrganizationForteacherTree_pk_org")[0]['u-meta'].tree.expandAll(true);
                                window.refmd = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-OrganizationForteacher_pk_org',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_OrganizationToteacher_pk_org'), null, viewModel.event.confirmSelectOrganizationToteacher_pk_org);
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
                confirmSelectOrganizationToteacher_pk_org: function () {
                    var zTree = $("#OrganizationForteacherTree_pk_org")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_org.getRowByField('id', id).getSimpleData();
                        viewModel.dtnew.setValue('pk_org', node.id)
                        viewModel.dtnew.setValue('pk_org_name', node.name);
                    }
                    viewModel.event.mdClose();
                },               
               
                //选择参照（树）
                selectOrganization_pk_mainorg_teacher: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/teacher/Organization_pk_mainorg/listall';
                    viewModel.event.showOrganizationTreeDiv_teacher_pk_mainorg(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showOrganizationTreeDiv_teacher_pk_mainorg: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refOrganizationDa_pk_mainorg.setSimpleData(res.detailMsg.data);
                                $("#OrganizationForteacherTree_pk_mainorg")[0]['u-meta'].tree.expandAll(true);
                                window.refmd = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-OrganizationForteacher_pk_mainorg',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_OrganizationToteacher_pk_mainorg'), null, viewModel.event.confirmSelectOrganizationToteacher_pk_mainorg);
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
                confirmSelectOrganizationToteacher_pk_mainorg: function () {
                    var zTree = $("#OrganizationForteacherTree_pk_mainorg")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_mainorg.getRowByField('id', id).getSimpleData();
                        viewModel.dtnew.setValue('pk_mainorg', node.id)
                        viewModel.dtnew.setValue('pk_mainorg_name', node.name);
                    }
                    viewModel.event.mdClose();
                },               
               

				/**
                 * 树弹窗公共方法中取消按钮
                 */

                mdClose: function () {
                    refmd.close();
                },                

                /**绑定弹出层 树的按钮 */
                bindClickButton: function (ele, data, functionevent) { //对某一个按钮进行  点击事假绑定 ele:被绑定的元素，  data：需要传递的数据，functionevent：绑定的方法
                    $(ele).unbind('click'); //取消之前的绑定
                    $(ele).bind('click', data, functionevent); //重新绑定
                }, 
                
					
					//页面初始化
					pageInit: function () {		       
						$(element).html(html) ;
						app = u.createApp({
							el: element,
							model: viewModel
						});
						
						var paginationDiv = $(element).find('#pagination')[0];
						this.comps=new u.pagination({el:paginationDiv,jumppage:true});
						this.initCardTableList();
						viewModel.event.pageChange();
						viewModel.event.sizeChange();
						
	                    //回车搜索
	                    $('.input_enter').keydown(function(e){
	                        if(e.keyCode==13){
	                            $('#searchBtn').trigger('click');

	                        }
	                    });
					},
					//页面按钮事件绑定
					/* 导航的三个按钮 编辑 添加 删除 */
					editClick:function(){
						$('#editPage').find('.u-msg-title').html("编辑");
						viewModel.event.clearDt(viewModel.dtnew);
						var row = viewModel.dt1.getSelectedRows()[0];
						if(row){
							viewModel.dtnew.setSimpleData(viewModel.dt1.getSimpleData({type: 'select'}));
							window.md = u.dialog({id: 'editDialog', content: '#editPage', hasCloseMenu: true});
							/*$('#editDialog').css('width', '70%')*/
						}else{
							u.messageDialog({msg:'请选择要编辑的数据！',title:'操作提示',btnText:'确定'});
						}
					},
					addClick:function(){
						$('#editPage').find('.u-msg-title').html("新增");
						viewModel.event.clearDt(viewModel.dtnew);
						var newr = viewModel.dtnew.createEmptyRow();
						newr.setValue("pk_org","name");
						newr.setValue("pk_mainorg","name");
						viewModel.dtnew.setRowSelect(newr);
						window.md = u.dialog({id: 'addDialog', content: '#editPage', hasCloseMenu: true});
						$('#addDialog').css('width', '70%');
					},
					delClick:function(){
						var row = viewModel.dt1.getSelectedRows()[0];
						if(row){
							var data = viewModel.dt1.getSelectedRows()[0].getSimpleData()
							u.confirmDialog({
					            msg: "是否删除"+data.name+"?",
					            title: "删除确认",
					            onOk: function () {
					                viewModel.event.deleteData(data);
					                viewModel.dt1.removeRow(viewModel.dt1.getSelectedIndexs());
					            },
					            onCancel: function () {
					            }
							});
						}else{
							u.messageDialog({msg:'请选择要删除的数据！',title:'操作提示',btnText:'确定'});
						}
					},
					searchClick:function(){
						viewModel.draw = 1; 
						viewModel.event.initCardTableList();
					},
					saveOkClick:function(){
						var data = viewModel.dtnew.getSimpleData()[viewModel.dtnew.getSelectedIndexs()];
						if(viewModel.event.checkedCardtable(data)){
							viewModel.event.saveData(data);
							md.close();               
						}
					},
					saveCancelClick:function(e){
						md.close();
					}
				}
		}
		
		$(element).html(html) ;
		viewModel.event.pageInit();
	}
    return{
		'template': html,
        init:init
    }
});

