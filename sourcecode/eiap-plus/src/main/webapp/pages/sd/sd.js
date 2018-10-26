define(['text!pages/sd/sd.html','pages/sd/meta','css!pages/sd/sd', 'uuitree','config/sys_const'], function (template) {
	
	var ctx = "/qyjson";
   
  //开始初始页面基础数据
    var init =  function (element, params) {
        var viewModel = {
            draw: 1,//页数(第几页)
            pageSize: 5,
            searchURL: ctx + '/list.json',
            addURL: ctx + "/add.json",
            updateURL: ctx + "/add.json",
            delURL: ctx + "/del.json",
            orgtreeURL: ctx + "/org.json",
            formStatus: _CONST.FORM_STATUS_LIST, 
            saleorderDa: new u.DataTable(metaDt),
            saleorderFormDa:new u.DataTable(metaDt),
            sysOrgDa: new u.DataTable({
                meta: {
                    'orgid': {},
                    'orgname': {},
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
                        u.messageDialog({
                            msg: node.name + '被选中',
                            title: "提示",
                            btnText: "OK"
                        });
                        /*u.showMessage({msg: rightInfo, position: "topright",darkType:"dark",width:"420px"})*/
                    }
                }
            },
            
            event: {

                //加载初始列表
                initUerList: function () {
                    var jsonData = {
                        pageIndex: 1,
                        pageSize: viewModel.pageSize,
                    };
                    $(element).find(".input_search").each(function () {
                        if (!viewModel.event.isEmpty(this)) {
                            jsonData['search_' + $(this).attr('name')] = removeSpace(this.value);
                        }
                    });

                    $.get(viewModel.searchURL,jsonData,function (res) {
                            if (res) {
                                if (res.success == 'success') {
                                    if (res.data) {
                                        viewModel.event.clearUserList(viewModel.saleorderDa);
                                        viewModel.saleorderDa.setSimpleData(res.data, {unSelect: true});
                                    }
                                } else {
                                    u.messageDialog({msg: res.msg, title: '请求错误', btnText: '确定'});
                                }
                            } else {
                                u.messageDialog({msg: '后台返回数据格式有误，请联系管理员', title: '数据错误', btnText: '确定'});
                            }
                        } 
                    );
                    //end ajax
                },
                clearUserList: function (da) {
                    da.removeAllRows();
                    da.clear();
                },
                //以下用于check checkbox
                afterAdd: function (element, index, data) {
                    if (element.nodeType === 1) {
                        u.compMgr.updateComp(element);
                    }
                },
                mdClose: function () {
                    viewModel.orgmd.close();
                },
                addClick: function () {
                    viewModel.formStatus = _CONST.FORM_STATUS_ADD;
                    viewModel.event.clearUserList(viewModel.saleorderFormDa);
                    viewModel.saleorderFormDa.createEmptyRow();
                    viewModel.saleorderFormDa.setRowSelect(0);

                    var row = viewModel.saleorderFormDa.getCurrentRow();
                    console.log(row);
                    row.setValue('projectcode', '000');
                    row.setValue('dbilldate', '2017-01-01');
                    row.setValue('ccustomerid_name', 'zyg');


                    viewModel.md.dGo('addPage');
                },
                useraddok:function(){
                    if (! app.compsValidate($(element).find('#user-form')[0])) {
                        return;
                    }

                    var data = viewModel.saleorderDa.getSimpleData();
                    console.log(data);
                    $.post(viewModel.addURL,data,function(res){
                        console.log(res);
                        viewModel.md.dBack();

                        viewModel.event.initUerList();
                    })
                },
                useraddcancel:function () {
                    viewModel.md.dBack();
                },
                editClick: function () {
                    viewModel.formStatus = _CONST.FORM_STATUS_EDIT;
                    var selectArray = viewModel.saleorderDa.selectedIndices();
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

                    viewModel.saleorderDa.setRowSelect(selectArray);
                    viewModel.saleorderFormDa.clear();
                    //绑定所选值
                    viewModel.saleorderFormDa.setSimpleData(viewModel.saleorderDa.getSimpleData({type: 'select'}));
                    //显示操作卡片
                    viewModel.md.dGo('addPage');
                },
                delRow: function () {
                    var selectArray = viewModel.saleorderDa.selectedIndices();
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
                        '<i class="fa fa-exclamation-circle margin-r-5 fa-3x orange" style="vertical-align:middle"></i>确认删除这些数据吗？</div>',
                        title: '警告',
                        onOk: function () {
                            viewModel.event.delConfirm();
                        }
                    });
                },
                /**确认删除*/
                delConfirm: function () {
                    var jsonDel = viewModel.saleorderDa.getSimpleData({type: 'select'});
                    $.post(viewModel.delURL,JSON.stringify(jsonDel),function (res) {
                            if (res) {
                                if (res.success == 'success') {
                                    viewModel.event.initUerList();
                                } else {
                                    u.messageDialog({msg: res.message, title: '操作提示', btnText: '确定'});
                                }
                            } else {
                                u.messageDialog({msg: '无返回数据', title: '操作提示', btnText: '确定'});
                            }
                        });
                },
                orgselectopen: function () {
                    $.get(viewModel.orgtreeURL,null,function (res) {
                            if (res) {
                                if (res.success == 'success') {
                                    viewModel.sysOrgDa.setSimpleData(res.data);
                                    $("#commonTree")[0]['u-meta'].tree.expandAll(true);
                                    viewModel.orgmd = u.dialog({
                                        id: 'commonShowDialog',
                                        content: '#tree-modal',
                                        hasCloseMenu: true
                                    });
                                } else {
                                    u.messageDialog({msg: res.msg, title: '请求错误', btnText: '确定'});
                                }
                            } else {
                                u.messageDialog({msg: '后台返回数据格式有误，请联系管理员', title: '数据错误', btnText: '确定'});
                            }
                        } 
                    );

                    
                },
                orgtreeConfirmed: function () {
                    console.log($("#commonTree")[0])
                    var zTree = $("#commonTree")[0]['u-meta'].tree;
                    console.log(zTree)
                    var selectNode = zTree.getSelectedNodes();
                    if (selectNode) {
                        var id = zTree.getSelectedNodes()[0].orgid;
                        var node = viewModel.sysOrgDa.getRowByField('orgid', id).getSimpleData();
                        viewModel.saleorderFormDa.setValue('pk_org', node.orgid)
                        viewModel.saleorderFormDa.setValue('pk_org_name', node.orgname);
                    }
                    viewModel.event.mdClose();
                }

            } // end  event

        };
        //end viewModel


        $(element).html(template);
        var app = u.createApp({
            el: '#content',
            model: viewModel
        });
        viewModel.md = $(element).find('#user-mdlayout')[0]['u.MDLayout'];
        viewModel.event.initUerList();

    }  //end init

    return {
        'model': init.viewModel,
        'template': template,
        init: function (params, arg) {
            init(params, arg);
        }
    }
});
//end define
