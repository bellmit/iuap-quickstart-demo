define(['text!./preorder.html','./meta.js','css!./preorder.css', '../../config/sys_const.js','css!../../style/style.css','css!../../style/widget.css'], function (template) {
   
  //开始初始页面基础数据
    var init =  function (element, params) {
        var viewModel = {
            draw: 1,//页数(第几页)
            pageSize: 5,
            searchURL: appCtx + '/preorder/list',
            addURL: appCtx + "/preorder/add",
            updateURL: appCtx + "/preorder/update",
            delURL: appCtx + "/preorder/delBatch",
            formStatus: _CONST.FORM_STATUS_ADD, 
            preorderDa: new u.DataTable(metaDt),
            preorderFormDa: new u.DataTable(metaDt),

           
            preorder_subDa: new u.DataTable(metapreorder_sub),
            preorder_subFormDa: new u.DataTable(metapreorder_sub),

			refOrganizationDa_pk_org: new u.DataTable({
				meta: {
                    'id': {},
                    'name': {},
                    'parentid': {}
                }
            }),
            
			refBaseuserDa_creator: new u.DataTable({
				meta: {
                    'id': {},
                    'name': {},
                    'parentid': {}
                }
            }),
            
			refBaseuserDa_modifier: new u.DataTable({
				meta: {
                    'id': {},
                    'name': {},
                    'parentid': {}
                }
            }),
            
			refOrganizationDa_pk_org_preorder_sub: new u.DataTable({
				meta: {
                    'id': {},
                    'name': {},
                    'parentid': {}
                }
            }),
            

            /**树默认设置 */
            treeSetting: {
                view: {
                    showLine: false,
                    selectedMulti: false
                },
                callback: {
                    onClick: function (e, id, node) {
                        var rightInfo = node.name + '被选中';
                        /*u.showMessage({msg: rightInfo, position: "topright",darkType:"dark",width:"420px"})*/
                    }
                }
            },
            
            event: {
                /**20161205修改最外层框架按钮组的显示与隐藏 */
                userListBtn: function () {  //显示user_list_button_2
                    $('#user_list_button_2').parent('.u-mdlayout-btn').removeClass('hide');
                    $('.form-search').removeClass('hide');
                    $('#user_card_button').parent('.u-mdlayout-btn').addClass('hide');

                },
                userCardBtn: function () {   //显示user_card_button
                    $('#user_list_button_2').parent('.u-mdlayout-btn').addClass('hide');
                    $('.form-search').addClass('hide');
                    $('#user_card_button').parent('.u-mdlayout-btn').removeClass('hide');
                },
                /**判断对象的值是否为空 */
                isEmpty: function (obj) {
                    if (obj.value == undefined || obj.value == '' || obj.value.length == 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                /**清除 datatable的数据  */
                clearDa: function (da) {
                    da.removeAllRows();
                    da.clear();
                },

                //加载初始列表
                initUerList: function () {
                    var jsonData = {
                        pageIndex: viewModel.draw - 1,
                        pageSize: viewModel.pageSize,
                        sortField: "ts",
                        sortDirection: "desc"
                    };
                    $(element).find(".input_search").each(function () {
                        if (!viewModel.event.isEmpty(this)) {
                            jsonData['search_' + $(this).attr('name')] = removeSpace(this.value);
                        }
                    });

                    $.ajax({
                        type: 'get',
                        url: viewModel.searchURL,
                        datatype: 'json',
                        data: jsonData,
                        contentType: 'application/json;charset=utf-8',
                        success: function (res) {
                            if (res) {
                                if (res.success == 'success') {
                                    if (res.detailMsg.data) {
                                        var totleCount = res.detailMsg.data.totalElements;
                                        var totlePage = res.detailMsg.data.totalPages;
                                        viewModel.comps.update({
                                            totalPages: totlePage,
                                            pageSize: viewModel.pageSize,
                                            currentPage: viewModel.draw,
                                            totalCount: totleCount
                                        });
                                        viewModel.event.clearDa(viewModel.preorderDa);
                                        viewModel.event.clearDa(viewModel.preorder_subDa);
                                        viewModel.preorderDa.setSimpleData(res.detailMsg.data.content, {unSelect: true});
                                    }
                                } else {
                                    var msg = "";
                                    for (var key in res.detailMsg) {
                                        msg += res.detailMsg[key] + "<br/>";
                                    }
                                    u.messageDialog({msg: msg, title: '请求错误', btnText: '确定'});
                                }
                            } else {
                                u.messageDialog({msg: '后台返回数据格式有误，请联系管理员', title: '数据错误', btnText: '确定'});
                            }
                        } 
                    });
                    //end ajax
                },

                pageChange: function () {
                    viewModel.comps.on('pageChange', function (pageIndex) {
                        viewModel.draw = pageIndex + 1;
                        viewModel.event.initUerList();
                    });
                    viewModel.child_list_pcomp.on('pageChange', function (pageIndex) {
                    	viewModel.childdraw = pageIndex + 1;
                    	viewModel.event.getUserJobList();
                    });
                },
                //end pageChange
                sizeChange: function () {
                    viewModel.comps.on('sizeChange', function (arg) {
                        //数据库分页
                        viewModel.pageSize = parseInt(arg);
                        viewModel.draw = 1;
                        viewModel.event.initUerList();
                    });
                    viewModel.child_list_pcomp.on('sizeChange', function (arg) {
                    	//数据库分页
                    	viewModel.pageSize = parseInt(arg);
                    	viewModel.childdraw = 1;
                    	viewModel.event.getUserJobList();
                    });
                    viewModel.child_card_pcomp.on('sizeChange', function (arg) {
                    	viewModel.pageSize = parseInt(arg);
                    	viewModel.childdraw = 1;
                    	viewModel.event.getUserJobList();
                    });
                },
                //end sizeChange

                search: function () {
                    viewModel.draw = 1;
                    viewModel.event.initUerList();
                },
                cleanSearch: function () {
                    $(element).find('.form-search').find('input').val('');
                },
                //以下用于check checkbox
                afterAdd: function (element, index, data) {
                    if (element.nodeType === 1) {
                        u.compMgr.updateComp(element);
                    }
                },
                goBack: function () {
                    //只显示新增编辑删除按钮
                    viewModel.event.userListBtn();
                    viewModel.md.dBack();
                    viewModel.event.initUerList();
                    $('#child_list_pagination').hide(); //隐藏子表的分页层
                },

                addClick: function () {
                    viewModel.formStatus = _CONST.FORM_STATUS_ADD;
                    //只显示返回和保存按钮
                    viewModel.event.userCardBtn();
                    viewModel.event.clearDa(viewModel.preorderFormDa);
                    viewModel.preorderFormDa.createEmptyRow();
                    viewModel.preorderFormDa.setRowSelect(0);
                    viewModel.event.clearDa(viewModel.preorder_subFormDa);
                    //设置业务操作逻辑
                    var row = viewModel.preorderFormDa.getCurrentRow();
                    //显示操作卡片
                    viewModel.md.dGo('addPage');
                },
                editClick: function () {
                    viewModel.formStatus = _CONST.FORM_STATUS_EDIT;
                    var selectArray = viewModel.preorderDa.selectedIndices();
                    if (selectArray.length < 1) {
                        u.messageDialog({
                            msg: "请选择要编辑的记录!",
                            title: "提示",
                            btnText: "OK"
                        });
                        return;
                    }
                    if (selectArray.length > 1) {
                        u.messageDialog({
                            msg: "一次只能编辑一条记录，请选择要编辑的记录!",
                            title: "提示",
                            btnText: "OK"
                        });
                        return;
                    }
                    //只显示返回和保存按钮
                    viewModel.event.userCardBtn();
                    //获取选取行数据
                    viewModel.preorderDa.setRowSelect(selectArray);
                    viewModel.preorderFormDa.clear();
                    viewModel.preorder_subFormDa.clear();
                    viewModel.preorderFormDa.setSimpleData(viewModel.preorderDa.getSimpleData({type: 'select'}));
                    viewModel.preorder_subFormDa.setSimpleData(viewModel.preorder_subDa.getSimpleData(), {unSelect: true});

                    //显示操作卡片
                    viewModel.md.dGo('addPage');
                },

                saveClick: function () {
                    // compsValidate是验证输入格式。
                    if (! app.compsValidate($(element).find('#user-form')[0])) {
                        return;
                    }
                   
                    var user = viewModel.preorderFormDa.getSimpleData();
                    var userJob = viewModel.preorder_subFormDa.getSimpleData();
                    var jsondata =user[0];
                    jsondata.id_preorder_sub = userJob;
                    var sendurl = viewModel.addURL;
                    if (viewModel.formStatus === _CONST.FORM_STATUS_EDIT) {
                        sendurl = viewModel.updateURL;
                    }
                    $.ajax({
                        type: "post",
                        url: sendurl,
                        contentType: 'application/json;charset=utf-8',
                        data: JSON.stringify(jsondata),//将对象序列化成JSON字符串
                        success: function (res) {
                            if (res) {
                                if (res.success == 'success') {
                                    u.showMessage({
                                        msg: "<i class=\"fa fa-check-circle margin-r-5\"></i>操作成功",
                                        position: "bottom"
                                    });
                                    viewModel.event.goBack();
                                } else {
                                    var msg = "";
                                    if (res.success == 'fail_global') {
                                        msg = res.message;
                                    } else {
                                        for (var key in res.detailMsg) {
                                            msg += res.detailMsg[key] + "<br/>";
                                        }
                                    }
                                    u.messageDialog({msg: msg, title: '请求错误', btnText: '确定'});
                                }
                            } else {
                                u.messageDialog({msg: '没有返回数据', title: '操作提示', btnText: '确定'});
                            }
                        } 
                    });
                },
                /**删除选中行*/
                delRow: function () {
                    var selectArray = viewModel.preorderDa.selectedIndices();
                    if (selectArray.length < 1) {
                        u.messageDialog({
                            msg: "请选择要删除的行!",
                            title: "提示",
                            btnText: "OK"
                        });
                        return;
                    }
                    u.confirmDialog({
                        msg: '<div class="pull-left col-padding" >' +
                        '<i class="fa fa-exclamation-circle margin-r-5 fa-3x orange" style="vertical-align:middle"></i>确认删除这些数据数据吗？</div>',
                        title: '警告',
                        onOk: function () {
                            viewModel.event.delConfirm();
                        }
                    });
                },
                /**确认删除*/
                delConfirm: function () {
                    var jsonDel = viewModel.preorderDa.getSimpleData({type: 'select'});
                    $.ajax({
                        type: "post",
                        url: viewModel.delURL,
                        contentType: 'application/json;charset=utf-8',
                        data: JSON.stringify(jsonDel),
                        success: function (res) {
                            if (res) {
                                if (res.success == 'success') {
                                    /*u.showMessage({
                                        msg: "<i class=\"fa fa-check-circle margin-r-5\"></i>删除成功",
                                        position: "center"
                                    })*/
                                    viewModel.event.initUerList();
                                } else {
                                    u.messageDialog({msg: res.message, title: '操作提示', btnText: '确定'});
                                }
                            } else {
                                u.messageDialog({msg: '无返回数据', title: '操作提示', btnText: '确定'});
                            }
                        }
                        
                    });
                },
                rowClick: function (row, e) {
                    var ri = e.target.parentNode.getAttribute('rowindex')
                    if (ri != null) {
                        viewModel.preorderDa.setRowFocus(parseInt(ri));
                        viewModel.preorderDa.setRowSelect(parseInt(ri));
                    }
                    viewModel.preorderFormDa.setSimpleData(viewModel.preorderDa.getSimpleData({type: 'select'}));
                    var userId = viewModel.preorderFormDa.getValue("pk_preorder");
                    if (userId == null || userId == "") {
                        viewModel.preorder_subDa.removeAllRows();
                        viewModel.preorder_subDa.clear();
                    } else {
                        viewModel.event.getUserJobList();
                    }
                },
                selectUserJob: function (row, e) {
                    var ri = e.target.parentNode.getAttribute('rowindex')
                    if (ri != null) {
                        viewModel.preorder_subDa.setRowFocus(parseInt(ri));
                        viewModel.preorder_subDa.setRowSelect(parseInt(ri));
                    }
                },
                //选择参照（树）
                selectOrganization_preorder_pk_org: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/preorder/Organization_pk_org/listall';
                    viewModel.event.showOrganizationTreeDiv_preorder_pk_org(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showOrganizationTreeDiv_preorder_pk_org: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refOrganizationDa_pk_org.setSimpleData(res.detailMsg.data);
                                $("#OrganizationForpreorderTree_pk_org")[0]['u-meta'].tree.expandAll(true);
                                window.md = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-OrganizationForpreorder_pk_org',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_OrganizationTopreorder_pk_org'), null, viewModel.event.confirmSelectOrganizationTopreorder_pk_org);
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
                confirmSelectOrganizationTopreorder_pk_org: function () {
                    var zTree = $("#OrganizationForpreorderTree_pk_org")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_org.getRowByField('id', id).getSimpleData();
                        viewModel.preorderFormDa.setValue('pk_org', node.id)
                        viewModel.preorderFormDa.setValue('pk_org_name', node.name);
                    }
                    viewModel.event.mdClose();
                },               
               
                //选择参照（树）
                selectBaseuser_preorder_creator: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/preorder/Baseuser_creator/listall';
                    viewModel.event.showBaseuserTreeDiv_preorder_creator(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showBaseuserTreeDiv_preorder_creator: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refBaseuserDa_creator.setSimpleData(res.detailMsg.data);
                                $("#baseuserForpreorderTree_creator")[0]['u-meta'].tree.expandAll(true);
                                window.md = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-baseuserForpreorder_creator',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_BaseuserTopreorder_creator'), null, viewModel.event.confirmSelectBaseuserTopreorder_creator);
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
                confirmSelectBaseuserTopreorder_creator: function () {
                    var zTree = $("#baseuserForpreorderTree_creator")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refBaseuserDa_creator.getRowByField('id', id).getSimpleData();
                        viewModel.preorderFormDa.setValue('creator', node.id)
                        viewModel.preorderFormDa.setValue('creator_name', node.name);
                    }
                    viewModel.event.mdClose();
                },               
               
                //选择参照（树）
                selectBaseuser_preorder_modifier: function () {
                    var treeSet = this.treeSetting;
                    var title = '请选择参照值';
                    var url = appCtx + '/preorder/Baseuser_modifier/listall';
                    viewModel.event.showBaseuserTreeDiv_preorder_modifier(null, url, title, this.treeSetting);
                },
                
                /**
                 *  sendjosn 发送的数据
                 *  ajaxurl 请求的地址
                 *  title 弹窗标题
                 *  treeset 树控件的配置obj
                 */
                showBaseuserTreeDiv_preorder_modifier: function (sendjson, ajaxurl, treetitle, treeset) {
                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res) {
                                $(element).find('#tree-title').html(treetitle);
                                viewModel.refBaseuserDa_modifier.setSimpleData(res.detailMsg.data);
                                $("#baseuserForpreorderTree_modifier")[0]['u-meta'].tree.expandAll(true);
                                window.md = u.dialog({
                                    id: 'commonShowDialog',
                                    content: '#tree-baseuserForpreorder_modifier',
                                    hasCloseMenu: true
                                });
                                viewModel.event.bindClickButton($('#confirm_select_BaseuserTopreorder_modifier'), null, viewModel.event.confirmSelectBaseuserTopreorder_modifier);
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
                confirmSelectBaseuserTopreorder_modifier: function () {
                    var zTree = $("#baseuserForpreorderTree_modifier")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refBaseuserDa_modifier.getRowByField('id', id).getSimpleData();
                        viewModel.preorderFormDa.setValue('modifier', node.id)
                        viewModel.preorderFormDa.setValue('modifier_name', node.name);
                    }
                    viewModel.event.mdClose();
                },               
               

		addpreorder_sub_selectOrganization_pk_org: function (obj) {
                    var gridObj = obj.gridObj;
                    var viewModel = gridObj.viewModel;
                    var field = obj.field;
                    var ele = obj.element;
                    var dataTableId = gridObj.dataTable.id;
                    var objValue = obj.value;

                    //组织row
                    var innerStr = '<div class="u-input-group u-has-feedback">'
                        + '<input type="text" class="u-form-control" id="" >'
                        + '<span class="u-form-control-feedback fa fa-list-ul" id="addpreorder_sub_selectOrganization_pk_org"></span>'
                        + '</div>';
                    var innerDom = u.makeDOM(innerStr);
                    ele.innerHTML = '';
                    ele.appendChild(innerDom);

                    //赋原值
                    ele.querySelector('input').value = objValue;
                    //用户任职,选择所属组织
                    u.on(ele.querySelector('#addpreorder_sub_selectOrganization_pk_org'), 'click', function () {
                        $.ajax({
                            type: "GET",
                            url: appCtx + '/preorder_sub/Organization_pk_org/listall',
                            contentType: 'application/json;charset=utf-8',
                            dataType: 'json',
                            success: function (res) {
                                if (res) {
                                    $(element).find('#tree-title').html("请选择参照值");
                                    viewModel.refOrganizationDa_pk_org_preorder_sub.setSimpleData(res.detailMsg.data);
                                    $("#OrganizationForpreorder_subTree_pk_org")[0]['u-meta'].tree.expandAll(true);
                                    window.md = u.dialog({
                                        id: 'commonShowDialog',
                                        content: '#tree-OrganizationForpreorder_sub_pk_org',
                                        hasCloseMenu: true
                                    });
                                    viewModel.event.bindClickButton($('#confirm_select_OrganizationTopreorder_sub_pk_org'), null, viewModel.event.confirmSelectOrganizationTopreorder_sub_pk_org);
                                } else {
                                    u.showMessage({msg: '无数据', position: "bottom", msgType: "error"});
                                }
                            } 
                        });
                    });
                },
                
                /**选中某一个参照到子表 */
                confirmSelectOrganizationTopreorder_sub_pk_org: function () {
                    var zTree = $("#OrganizationForpreorder_subTree_pk_org")[0]['u-meta'].tree;
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].id;
                        var node = viewModel.refOrganizationDa_pk_org_preorder_sub.getRowByField('id', id).getSimpleData();
                        viewModel.preorder_subFormDa.setValue('pk_org', node.id);
                        viewModel.preorder_subFormDa.setValue('pk_org_name', node.name);
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

                                      

                /**子表列表 */
                getUserJobList: function () {
                    var userId = viewModel.preorderFormDa.getValue("pk_preorder");
                    var jsonData = {
                        pageIndex: 0,
                        pageSize: viewModel.pageSize,
                        sortField: "ts",
                        sortDirection: "asc"
                    };
                    jsonData['search_fk_id_preorder_sub'] = userId;
                    $.ajax({
                        type: 'GET',
                        url: appCtx + '/preorder_sub/list',
                        datatype: 'json',
                        data: jsonData,
                        contentType: 'application/json;charset=utf-8',
                        success: function (res) {
                            if (res) {
                                if (res.success == 'success') {
                                    if (res.detailMsg.data) {
                                        viewModel.preorder_subDa.removeAllRows();
                                        viewModel.preorder_subDa.clear();
                                        viewModel.preorder_subDa.setSimpleData(res.detailMsg.data.content, {unSelect: true});
                                        
                                        viewModel.preorder_subFormDa.setSimpleData(res.detailMsg.data.content, {unSelect: true});
                                        var totleCount = res.detailMsg.data.totalElements;
                                        var totlePage = res.detailMsg.data.totalPages;
                                        viewModel.child_list_pcomp.update({ //列表页子表的分页信息
                                            totalPages: totlePage,
                                            pageSize: viewModel.pageSize,
                                            currentPage: viewModel.childdraw,
                                            totalCount: totleCount
                                        });
                                        viewModel.child_card_pcomp.update({ //卡片页子表的分页信息
                                        	totalPages: totlePage,
                                        	pageSize: viewModel.pageSize,
                                        	currentPage: viewModel.childdraw,
                                        	totalCount: totleCount
                                        });
                                        if(totleCount > viewModel.pageSize ){//根据总条数，来判断是否显示子表的分页层
                                        	$('#child_card_pagination').show();
                                        	$('#child_list_pagination').show();
                                        }else{
                                        	$('#child_card_pagination').hide();
                                        	$('#child_list_pagination').hide();
                                        }

                                    }
                                } else {
                                    var msg = "";
                                    for (var key in res.message) {
                                        msg += res.message[key] + "<br/>";
                                    }
                                    u.messageDialog({msg: msg, title: '请求错误', btnText: '确定'});
                                }
                            } else {
                                u.messageDialog({msg: '后台返回数据格式有误，请联系管理员', title: '数据错误', btnText: '确定'});
                            }
                        } 
                    });
                },
                //
                addUserJob: function () {
                    viewModel.preorder_subFormDa.createEmptyRow();
                },
                delUserJob: function () {
                    var userJobs = viewModel.preorder_subFormDa.getSimpleData({type: 'select'})
                    if (userJobs.length < 1) {
                        u.messageDialog({
                            msg: "请选择要删除的行!",
                            title: "提示",
                            btnText: "OK"
                        });
                    }

                    if (confirm("确定要删除吗?")) {
                        var jsonDel = viewModel.preorder_subFormDa.getSimpleData({type: 'focus'});
                        var index = viewModel.preorder_subFormDa.getFocusIndex();
                        if (jsonDel[0].pk_preorder_b == null) {
                            viewModel.preorder_subFormDa.removeRows(index);
                            return;
                        }
                        $.ajax({
                            type: "post",
                            url: appCtx + "/preorder_sub/del",
                            contentType: 'application/json;charset=utf-8',
                            data: JSON.stringify(jsonDel[0]),
                            success: function (res) {
                                if (res) {
                                    if (res.success == 'success') {
                                       /* u.showMessage({
                                            msg: "<i class=\"fa fa-check-circle margin-r-5\"></i>删除成功",
                                            position: "center"
                                        })*/
                                        viewModel.preorder_subFormDa.removeRows(index);
                                    } else {
                                        u.messageDialog({msg: res.message, title: '操作提示', btnText: '确定'});
                                    }
                                } else {
                                    u.messageDialog({msg: '无返回数据', title: '操作提示', btnText: '确定'});
                                }
                            } 
                        });
                    }
                },              
                
 


            } // end  event

        };
        //end viewModel


        $(element).html(template);
        var app = u.createApp({
            el: '#content',
            model: viewModel
        });
        viewModel.md = $(element).find('#user-mdlayout')[0]['u.MDLayout'];
        var paginationDiv = $(element).find('#pagination')[0];
        viewModel.comps = new u.pagination({el: paginationDiv, jumppage: true});
        
        viewModel.child_list_pcomp = new u.pagination({el: $(element).find('#child_list_pagination')[0], jumppage: true});
        viewModel.child_card_pcomp = new u.pagination({el: $(element).find('#child_card_pagination')[0], jumppage: true});
        viewModel.childdraw=1 ;

        viewModel.event.initUerList();
        viewModel.event.pageChange();
        viewModel.event.sizeChange();

    }  //end init

    return {
        'model': init.viewModel,
        'template': template,
        init: function (params, arg) {
            init(params, arg);
            /*回车搜索*/
            $('.search-enter').keydown(function (e) {
                if (e.keyCode == 13) {
                    $('#user-action-search').trigger('click');

                }
            });
        }
    }
});
//end define
