define(['text!./teachersingle.html','./meta.js','css!./teachersingle.css', '../../config/sys_const.js','css!../../style/style.css','css!../../style/widget.css'], function (html) {
    var rowId = null;
    var init = function (element, params) {
        var viewModel = {
    		listurl : '/teachersingle/list',   
        	addurl :  '/teachersingle/createRow',
            saveurl : '/teachersingle/save',
        	delurl  :  '/teachersingle/del',
        	

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
            
			teacherDa: new u.DataTable(teachermeta),
			
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
                initList: function () {
                    var nowPageIndex = viewModel.teacherDa.pageIndex();
                    if (viewModel.teacherDa.hasPage(nowPageIndex)) {
                        viewModel.teacherDa.setCurrentPage(nowPageIndex)
                    } else {
                        var queryData = {};
                        $(".form-search").find(".input_search").each(function () {
                            queryData[this.name] = this.value;
                        });
                        viewModel.teacherDa.addParams(queryData);
                        app.serverEvent().addDataTable("teacherDa").fire({
                            url: appCtx + viewModel.listurl,
                            success: function (data) {

                            },
                            error:function(er){
                            	  u.messageDialog({msg: '请求失败，请检查。', title: '请求错误', btnText: '确定'});
                            }
                        })
                    }
                },
                pageChange: function (index) {
                    viewModel.teacherDa.pageIndex(index);
                    viewModel.event.initList();
                },
                sizeChange: function (size) {
                    viewModel.teacherDa.clear();
                    viewModel.teacherDa.pageSize(size);
                    viewModel.event.initList();
                },
                
                //选择参照（树）
                addteacher_selectOrganization_pk_org: function (obj) {
                    rowId = obj.rowObj['$_#_@_id'];
                    var gridObj = obj.gridObj;
                    var viewModel = gridObj.viewModel;
                    var field = obj.field;
                    var ele = obj.element;
                    var dataTableId = gridObj.dataTable.id;
                    var objValue = obj.value;

                    //组织row
                    var innerStr = '<div class="u-input-group u-has-feedback">'
                        + '<input type="text" class="u-form-control" id="" >'
                        + '<span class="u-form-control-feedback fa fa-list-ul" id="addteacher_selectOrganization_pk_org"></span>'
                        + '</div>';
                    var innerDom = u.makeDOM(innerStr);
                    ele.innerHTML = '';
                    ele.appendChild(innerDom);

                    //赋原值
                    ele.querySelector('input').value = objValue;
                    u.on(ele.querySelector('#addteacher_selectOrganization_pk_org'), 'click', function () {
                        $.ajax({
                            type: "GET",
                            url: appCtx + '/teacher/Organization_pk_org/listall',
                            contentType: 'application/json;charset=utf-8',
                            dataType: 'json',
                            success: function (res) {
                                if (res) {
                                    $(element).find('#tree-title').html("请选择参照值");
                                    viewModel.refOrganizationDa_pk_org.setSimpleData(res.detailMsg.data);
                                    $("#OrganizationForteacherTree_pk_org")[0]['u-meta'].tree.expandAll(true);
                                    window.md = u.dialog({
                                        id: 'commonShowDialog',
                                        content: '#tree-OrganizationForteacher_pk_org',
                                        hasCloseMenu: true
                                    });
                                    viewModel.event.bindClickButton($('#confirm_select_OrganizationToteacher_pk_org'), null, viewModel.event.confirmSelectOrganizationToteacher_pk_org);
                                } else {
                                    u.showMessage({msg: '无数据', position: "bottom", msgType: "error"});
                                }
                            } 
                        });
                    });
                },
                
                /**选中某一个参照到主表 */
                confirmSelectOrganizationToteacher_pk_org: function () {
                    var zTree = $("#OrganizationForteacherTree_pk_org")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_org.getRowByField('id', id).getSimpleData();
                        viewModel.teacherDa.getRowByRowId(rowId).setValue('pk_org', node.id)
                        viewModel.teacherDa.getRowByRowId(rowId).setValue('pk_org_name', node.name);
                    }
                    viewModel.event.mdClose();
                },               
               
                //选择参照（树）
                addteacher_selectOrganization_pk_mainorg: function (obj) {
                    rowId = obj.rowObj['$_#_@_id'];
                    var gridObj = obj.gridObj;
                    var viewModel = gridObj.viewModel;
                    var field = obj.field;
                    var ele = obj.element;
                    var dataTableId = gridObj.dataTable.id;
                    var objValue = obj.value;

                    //组织row
                    var innerStr = '<div class="u-input-group u-has-feedback">'
                        + '<input type="text" class="u-form-control" id="" >'
                        + '<span class="u-form-control-feedback fa fa-list-ul" id="addteacher_selectOrganization_pk_mainorg"></span>'
                        + '</div>';
                    var innerDom = u.makeDOM(innerStr);
                    ele.innerHTML = '';
                    ele.appendChild(innerDom);

                    //赋原值
                    ele.querySelector('input').value = objValue;
                    u.on(ele.querySelector('#addteacher_selectOrganization_pk_mainorg'), 'click', function () {
                        $.ajax({
                            type: "GET",
                            url: appCtx + '/teacher/Organization_pk_mainorg/listall',
                            contentType: 'application/json;charset=utf-8',
                            dataType: 'json',
                            success: function (res) {
                                if (res) {
                                    $(element).find('#tree-title').html("请选择参照值");
                                    viewModel.refOrganizationDa_pk_mainorg.setSimpleData(res.detailMsg.data);
                                    $("#OrganizationForteacherTree_pk_mainorg")[0]['u-meta'].tree.expandAll(true);
                                    window.md = u.dialog({
                                        id: 'commonShowDialog',
                                        content: '#tree-OrganizationForteacher_pk_mainorg',
                                        hasCloseMenu: true
                                    });
                                    viewModel.event.bindClickButton($('#confirm_select_OrganizationToteacher_pk_mainorg'), null, viewModel.event.confirmSelectOrganizationToteacher_pk_mainorg);
                                } else {
                                    u.showMessage({msg: '无数据', position: "bottom", msgType: "error"});
                                }
                            } 
                        });
                    });
                },
                
                /**选中某一个参照到主表 */
                confirmSelectOrganizationToteacher_pk_mainorg: function () {
                    var zTree = $("#OrganizationForteacherTree_pk_mainorg")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_mainorg.getRowByField('id', id).getSimpleData();
                        viewModel.teacherDa.getRowByRowId(rowId).setValue('pk_mainorg', node.id)
                        viewModel.teacherDa.getRowByRowId(rowId).setValue('pk_mainorg_name', node.name);
                    }
                    viewModel.event.mdClose();
                },               
               

				/**
                 * 树弹窗公共方法中取消按钮
                 */

                mdClose: function () {
                    md.close();
                },                

                /**绑定弹出层 树的按钮 */
                bindClickButton: function (ele, data, functionevent) { //对某一个按钮进行  点击事假绑定 ele:被绑定的元素，  data：需要传递的数据，functionevent：绑定的方法
                    $(ele).unbind('click'); //取消之前的绑定
                    $(ele).bind('click', data, functionevent); //重新绑定
                }, 
                
                search: function () {
                    viewModel.teacherDa.clear();
                    var queryData = {};
                    $(".form-search").find(".input_search").each(function () {
                        queryData[this.name] = this.value;
                    });
                    viewModel.teacherDa.addParams(queryData);
                    app.serverEvent().addDataTable("teacherDa").fire({
                        url: appCtx + viewModel.listurl,
                        success: function (data) {

                        },
	                    error:function(er){
	                  	  u.messageDialog({msg: '请求失败，请检查。', title: '请求错误', btnText: '确定'});
	                    }
                    })
                },
                cleanSearch: function () {
                    $(element).find('.form-search').find('input').val('');
                },
                addClick: function () {
                    app.serverEvent().addDataTable("teacherDa").fire({
                        url: appCtx + viewModel.addurl,
                        error:function(er){
                        	  u.messageDialog({msg: '请求失败，请检查。', title: '请求错误', btnText: '确定'});
                         }
                    })
                    
                },
                getRowData: function (rows) {//rows 表示行数据对象
                    var rowsdata = [];
                    for (var i = 0; i < rows.length; i++) {
                        var d = rows[i].getSimpleData();
                        rowsdata.push(d);
                    }
                    return rowsdata;
            },
                saveClick: function () {
                    //以下compsValidate是验证输入格式。开发调试，暂时不用
                    if (!app.compsValidate($(element).find('#list')[0])) {
                    	u.showMessage("保存失败")
                        return;
                    }

                    app.serverEvent().addDataTable("teacherDa", 'change').fire({
                        url: appCtx + viewModel.saveurl,
                        success: function (data) {
                            message('操作完成','success')
                        },
	                    error:function(er){	                      
	                  	  u.messageDialog({msg: er.message, title: '请求错误', btnText: '确定'});
	                    }
                    })
                },
              
				listBack:function(){
					window.location = '#/appCenter';
					$('.container-fluid').css("overflow-y","auto");
				},
				
                delRow: function (data, index) {
                    if (typeof(data) == 'number') {
                        viewModel.teacherDa.setRowSelect(index);
                    }
                    
                    u.confirmDialog({
                        msg: '<div class="pull-left col-padding" >' +
                        '<i class="fa fa-exclamation-circle margin-r-5 fa-3x orange" style="vertical-align:middle"></i>确认删除这些数据数据吗？</div>',
                        title: '警告',
                        onOk: function () {
                            app.serverEvent().addDataTable("teacherDa", 'allSelect').fire({
                                url: appCtx + viewModel.delurl,
                                success: function (data) {
                                   /* u.showMessage({msg: '操作完成'})*/
                                },
	                            error:function(er){
	                            	u.messageDialog({msg: er.message, title: '请求错误', btnText: '确定'});
	                            }
                            })
                        }
                    });
                }
            }
        }		//end viewModel

        $(element).html(html);
        var app = u.createApp({
            el: '#content',
            el: element,
            model: viewModel
        });
        viewModel.event.initList();
        $('.search-enter').keydown(function (e) {
        	           if (e.keyCode == 13) {
        	                $('#user-action-search').trigger('click');
        	 
        	             }
         });
    }

    return {
        'template': html,
        init: init
    }
});//end define
