var models = ['text!./print_template.html','css!./print_template.css'];
define( models, function (html) {
    'use strict';
    var printCtx = "/eiap-plus";
    var printWebCtx = "/cloud_print_service/print";
    var tenantId = u.getCookie("tenantid")

    var viewModel = {
        bocode:ko.observable(''),
        dataTable: new u.DataTable({
            meta: {
                'id': '',
                'tanant_id': '',
                'templatename':'',
                'templatecode':'',
                'pk_print_template':''
            }
        }),
        mutiDownLoad:function () {
            var row = viewModel.dataTable.getSelectedRows();
            if(row.length == 0){
                u.messageDialog({
                    msg : '请先选择一个模版！',
                    title : "提示",
                    btnText : "OK"
                });
            }
            var pks = [];
            $.each(row,function (i,item) {
                pks.push(item.data.pk_print_template.value);
            });
            var url = printCtx + '/remote/export?tenantId=' + tenantId
                + '&templates=' + pks.join(",");
            url = encodeURI(encodeURI(url));
            window.location = url;
        },
        publish:function (pk) {
            var url = printCtx + '/remote/exportAndUpload?tenantId=' + tenantId + '&templates=' + pk;
            $.ajax({
                type: 'GET',
                url: url,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (data, status, xhr) {
                    var deleteresult = JSON.parse(data).importResult;
                    if (deleteresult) {
                        u.messageDialog({
                            msg : "发布成功" ,
                            title : "提示",
                            btnText : "OK"
                        });
                    } else {
                        u.messageDialog({
                            msg : "发布失败，请重试！",
                            title : "提示",
                            btnText : "OK"
                        });
                    }
                },
                error: function (xhr, errorType, error) {
                    if(xhr.status=='401'){
                        u.messageDialog({
                            msg : JSON.parse(xhr.responseText).msg,
                            title : "提示",
                            btnText : "OK"
                        });
                    }else{
                        u.messageDialog({
                            msg : '发布失败，请重试！',
                            title : "提示",
                            btnText : "OK"
                        });
                    }

                }
            });

        },
        mutiPublish:function () {
            var row = viewModel.dataTable.getSelectedRows();
            if(row.length == 0){
                u.messageDialog({
                    msg : '请先选择一个模版！',
                    title : "提示",
                    btnText : "OK"
                });
            }
            var temps = [];
            $.each(row,function (i,item) {
                temps.push(item.data.pk_print_template.value)
            });
            var url = printCtx + '/remote/exportAndUpload?tenantId=' + tenantId + '&templates=' + temps.join(',');
            $.ajax({
                type: 'GET',
                url: url,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (data, status, xhr) {
                    var deleteresult = JSON.parse(data).importResult;
                    if (deleteresult) {
                        u.messageDialog({
                            msg : "发布成功" ,
                            title : "提示",
                            btnText : "OK"
                        });
                    } else {
                        u.messageDialog({
                            msg : "发布失败，请重试！",
                            title : "提示",
                            btnText : "OK"
                        });
                    }
                },
                error: function (xhr, errorType, error) {
                    if (xhr.status == '401') {
                        u.messageDialog({
                            msg: JSON.parse(xhr.responseText).msg,
                            title: "提示",
                            btnText: "OK"
                        });
                    } else {


                    u.messageDialog({
                        msg: '发布失败，请重试！',
                        title: "提示",
                        btnText: "OK"
                    });
                }
                }
            });
        },
        download:function (pk) {
            var url = printCtx + '/remote/export?tenantId=' + tenantId
                + '&templates=' + pk;
            url = encodeURI(encodeURI(url));
            window.open(url);
        },
        copyTemplate:function (pk) {
            $('#copytemplatecode').val('');
            $('#copytemplatename').val('');
            window.md = u.dialog({id:'copyDialg',content:"#dialog_copyTemplate",hasCloseMenu:true,"width": "400px"});
            md.pk = pk;
        },
        /*角色table分页控件*/
        pagination: {
            element: null,
            // 用于控制分页控件的显示，条目大于10的时候显示控件
            totalCount: ko.observable(0),
            totalPages:ko.observable(1),
            init: function () {
                // 分页控件初始化
                var ele = $('#paginationt')[0];
                viewModel.pagination.element = new u.pagination({
                    el: ele,
                    pageList: ['10'],
                    jumppage: true
                });
                //分页
                viewModel.pagination.element.on('pageChange', function (currentPage) {
                    viewModel.loadList({
                        startIndex: currentPage,
                        count: 10
                    });
                });
                viewModel.pagination.element.on('sizeChange', function (siz) {
                    viewModel.loadList({
                        startIndex: 0,
                        count: siz - 0
                    });
                });

                viewModel.pagination.element.update({
                    totalPages: 100,
                    pageSize: 10,
                    currentPage: 1,
                    totalCount: 200,
                    showState: false
                });
            }
        },
        copyTemplateSub:function () {
            // var row = viewModel.dataTable.getCurrentRow();
            // var pk = row.getSimpleData().pk_print_template;
            var pk = md.pk;

            var copytemplatecode = $('#copytemplatecode')[0].value;
            if (copytemplatecode === 'undefined'
                || copytemplatecode == '') {
                u.messageDialog({
                    msg : '模板编码不能为空！',
                    title : "提示",
                    btnText : "OK"
                });
                return;
            }

            var copytemplatename = $('#copytemplatename')[0].value;
            if (copytemplatename === 'undefined'
                || copytemplatename == '') {
                u.messageDialog({
                    msg : '模板名称不能为空！',
                    title : "提示",
                    btnText : "OK"
                });
                return;
            }

            var url = printCtx + '/remote/copyTemplate?tenantId='
                + tenantId + '&copytemplatecode='
                + copytemplatecode + '&pk_template=' + pk
                + '&copytemplatename=' + copytemplatename;
            url = encodeURI(encodeURI(url));

            $.ajax({
                type: 'GET',
                url: url,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (data, status, xhr) {
                    var deleteresult = JSON.parse(data).copyMsg;
                    if (deleteresult) {
                        md.close();
                        u.messageDialog({
                            msg : "成功复制模板" ,
                            title : "提示",
                            btnText : "OK"
                        });
                        viewModel.loadList({
                            startIndex:0,
                            count:10
                        });
                    } else {
                        u.messageDialog({
                            msg : JSON.parse(data).copyResult,
                            title : "提示",
                            btnText : "OK"
                        });
                    }
                },
                error: function (xhr, errorType, error) {
                    if(xhr.status=='401'){
                        u.messageDialog({
                            msg : JSON.parse(xhr.responseText).msg,
                            title : "提示",
                            btnText : "OK"
                        });
                    }else {


                        u.messageDialog({
                            msg: '复制失败！',
                            title: "提示",
                            btnText: "OK"
                        });
                    }
                }
            });
        },
        loadBoCode:function () {
            var url = printCtx + '/remote/querybo?' + 'tenantId=' + tenantId;

            $.ajax({
                type: 'GET',
                url: url,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (data, status, xhr) {
                    var bos = [];
                    document.getElementById('comboBo')['u.Combo'].emptyValue();
                    $.each(data,function (i, item) {
                        bos.push({
                            value:item.bo_code,
                            name:item.bo_name
                        })
                    });
                    document.getElementById('comboBo')['u.Combo'].setComboData(bos);
                },
                error: function (xhr, errorType, error) {
                    if(xhr.status=='401'){
                        u.messageDialog({
                            msg : JSON.parse(xhr.responseText).msg,
                            title : "提示",
                            btnText : "OK"
                        });
                    }
                }
            });
        },
        del:function (pk) {
            u.confirmDialog({
                title : "确认",
                msg : "请确认是否删除当前打印模版",
                onOk : function() {

                    var url = printCtx + '/remote/deleteTemplate?tenantId=' + tenantId + '&pk_template=' + pk;
                    url = encodeURI(encodeURI(url));


                    $.ajax({
                        url :url,
                        type : 'DELETE',
                        dataType : 'json',
                        contentType : "application/json ; charset=utf-8",
                        success : function(data) {
                            var result = data;
                            var deleteresult = result.delresult;
                            if (deleteresult) {
                                //var row = viewModel.dataTable.getRowsByField('pk_print_template',pk);
                                 var value = viewModel.dataTable.getValue('templatecode');
                                // viewModel.dataTable.removeRows(row);
                                viewModel.loadList({});
                                u.messageDialog({
                                    msg : "成功删除模板" + value,
                                    title : "提示",
                                    btnText : "OK"
                                });
                            } else {
                                u.messageDialog({
                                    msg : result.delMsg,
                                    title : "提示",
                                    btnText : "OK"
                                });
                            }

                        },
                        error: function(xhr, textStatus, errorThrown) {
                            if(xhr.status=='401'){
                                u.messageDialog({
                                    msg : JSON.parse(xhr.responseText).msg,
                                    title : "提示",
                                    btnText : "OK"
                                });
                            }
                            //errors.error(XMLHttpRequest);
                        }
                    })
                }
            });
        },
        edit:function (pk) {
            var url = printCtx
                + '/print-demo/remote/edittemplate?tenantId='
                + tenantId + '&template=' + pk;
            url = encodeURI(encodeURI(url));
            $.ajax({
                type : 'POST',
                url : url,
                contentType : "application/x-www-form-urlencoded; charset=utf-8",
                success : function(data, status, xhr) {
                    var editurl = JSON.parse(data).data;
                    window.open(editurl);
                },
                error : function(xhr, errorType, error) {
                    //showMessage('error');
                }
            });
        },
        design:function (pk) {
            window.freshListModal = u.dialog({
                id: 'freshListModal',
                content: "#freshList",
                hasCloseMenu: true
            });
            var url = printWebCtx + '/design?tenantId=' + tenantId
                + '&printcode=' + pk;
            window.open(url);
        },
        search:function () {
            var url = printCtx+'/remote/queryTemplateByPage';
            var options = {
                key:$('.search-box input').val(),
                tenantId:tenantId,
                startIndex:0,
                count:10
            }
            $.ajax({
                type: 'GET',
                url: url,
                data:options,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (data, status, xhr) {
                    var viewDate = [];
                    $.each(data.dataResult,function (i,item) {
                        viewDate.push({
                            pk_print_template: item.pk_print_template,
                            templatecode: item.templatecode,
                            templatename: item.templatename,
                            tanant_id: item.tanant_id,
                            id: item.versionid
                        })
                    })
                    viewModel.dataTable.removeAllRows();
                    viewModel.dataTable.clear();
                    viewModel.dataTable.setSimpleData(viewDate);

                    //var  totalPages = Math.ceil(data.recordCount/options.count);


                    viewModel.dataTable.removeAllRows();
                    viewModel.dataTable.clear();


                    if (data.dataResult.length == 0) {
                        viewModel.dataTable.setSimpleData([]);
                        viewModel.pagination.count(0);
                        return false;
                    }

                    viewModel.dataTable.setSimpleData(viewDate, {
                        unSelect: true
                    });
                    viewModel.pagination.totalCount(data.recordCount);
                },
                error: function (xhr, errorType, error) {
                    if(xhr.status=='401'){
                        u.messageDialog({
                            msg : JSON.parse(xhr.responseText).msg,
                            title : "提示",
                            btnText : "OK"
                        });
                    }
                    //showMessage('加载模板失败！');
                }
            });
        },
        operation: function (obj) {
            var delfun = "data-bind=click:del.bind($data," + "'"+ obj.row.value.pk_print_template + "')";
            var editfun = "data-bind=click:edit.bind($data," + "'"+ obj.row.value.pk_print_template + "')";
            var downloadfun = "data-bind=click:download.bind($data," + "'"+ obj.row.value.pk_print_template + "')";
            var copyTemplatefun = "data-bind=click:copyTemplate.bind($data," + "'"+ obj.row.value.pk_print_template + "')";
            var publishfun = "data-bind=click:publish.bind($data," + "'"+ obj.row.value.pk_print_template + "')";
            var designfun = "data-bind=click:design.bind($data," + "'"+ obj.row.value.templatecode + "')";

                obj.element.innerHTML = '<div class="ui-handle-icon text-center">' +
                '<span class="ui-handle ui-tab-icon-b">' +
                '<a href="#" class="uifont icon-edit font-c-c hide" ' +
                editfun +
                ' title="编辑">编辑</a>' +
                '</span>' +
                '<span class="ui-handle ui-tab-icon-b">' +
                '<a href="#" class="uifont icon-edit font-c-c" ' +
                designfun +
                ' title="设计">设计</a>' +
                '</span>' +
                '<span class="ui-handle ui-tab-icon-b">' +
                '<a href="#" class="uifont icon-edit font-c-c" ' +
                downloadfun +
                ' title="下载">下载</a>' +
                '</span>' +
                '<span class="ui-handle ui-tab-icon-b">' +
                '<a href="#" class="uifont icon-edit font-c-c" ' +
                publishfun +
                ' title="发布">发布</a>' +
                '</span>' +
                '<span class="ui-handle ui-tab-icon-b">' +
                '<a href="#" class="uifont icon-edit font-c-c" ' +
                copyTemplatefun +
                ' title="复制">复制</a>' +
                '</span>' +
                '<span class="ui-handle ui-tab-icon-b">' +
                '<a href="#" class="uifont icon-shanchu1 font-c-c" ' +
                delfun +
                ' title="删除">删除</a>' +
                '</span></div>';
            ko.cleanNode(obj.element);
            ko.applyBindings(viewModel, obj.element);
        },
        onBeforeClickFun1:function(obj){
            return true;
        },
        hide:function () {
            window.md&&md.close();
            $('#bocode').val('');
            viewModel.bocode('');
        },
        renderHtml:function () {
          return '<button>编辑</button>'
        },
        createTemplate:function () {
            $("#templateCode").val('');
            window.md = u.dialog({id:'testDialg',content:"#dialog_content",hasCloseMenu:true,"width": "400px","height":"500px"});
            // viewModel.loadBoCode();
        },
        createTemplateSub:function () {
            // var bocode = document.getElementById('comboBo')['u.Combo'].value;
             var bocode = viewModel.bocode();
            if (bocode === 'undefined' || bocode == '') {
                u.messageDialog({
                    msg : "请先选择业务对象",
                    title : "提示",
                    btnText : "OK"
                });
                return;
            }

            var new_temp = $('#templateCode').val();

            var templateType = tenantId === 'undefined'
            || tenantId === 'sys' ? "52a7f32d-fbb3-49d5-9700-01605b80bd9c"
                : "48a8206f-6759-431e-bf84-e973935e2fcc";

            var url = printWebCtx + '/design?tenantId=' + tenantId
                + '&reportName=' + new_temp + '&bocode=' + bocode
                + '&type=' + templateType;

            if (new_temp === 'undefined' || new_temp == '') {
                u.messageDialog({
                    msg : "新建模板编码不能为空！",
                    title : "提示",
                    btnText : "OK"
                });
                return;
            }
            url = encodeURI(encodeURI(url));
            window.open(url);
            md.close();
            u.confirmDialog({
                title : "确认",
                msg : "如您已保存创建的模版，请点击确定按钮刷新数据。",
                onOk : function() {
                    viewModel.loadList({
                        startIndex: 0,
                        count: 10
                    });
                    $('#bocode').val('')
                }
            });
        },
        loadList:function (params) {
            try {
                window.freshListModal.close();
            } catch (error) {
                
            }  
            var options = {
                startIndex:params.startIndex || 0,
                count:params.count || 10,
                tenantId:tenantId
            };
            var url = printCtx + '/remote/queryTemplateByPage?';

            $.ajax({
                type: 'GET',
                url: url,
                data:options,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (data, status, xhr) {
                    var viewDate = [];
                    if(data.dataResult && data.dataResult.length>0){
                        $.each(data.dataResult,function (i,item) {
                            viewDate.push({
                                edit:'<button>编辑</button>',
                                pk_print_template: item.pk_print_template,
                                templatecode: item.templatecode,
                                templatename: item.templatename,
                                tanant_id: item.tanant_id,
                                id: item.versionid
                            })
                        })
                    }
                    viewModel.dataTable.removeAllRows();
                    viewModel.dataTable.clear();
                    viewModel.dataTable.setSimpleData(viewDate);

                    // var  totalPages = Math.ceil(data.recordCount/options.count);


                    viewModel.dataTable.removeAllRows();
                    viewModel.dataTable.clear();


                    if (!data.dataResult||data.dataResult.length == 0) {
                        viewModel.dataTable.setSimpleData([]);
                        viewModel.pagination.totalCount(0);
                        return false;
                    }

                    viewModel.dataTable.setSimpleData(viewDate, {
                        unSelect: true
                    });

                    viewModel.pagination.totalCount(data.recordCount);
                    viewModel.pagination.totalPages( Math.ceil(data.recordCount/options.count));


                    viewModel.pagination.element.update({
                        totalPages:Math.ceil( data.recordCount/10),
                        pageSize: 10,
                        currentPage: options.startIndex+1,
                        totalCount: data.recordCount,
                        showState: false
                    });

                },
                error: function (xhr, errorType, error) {
                    if(xhr.status=='401'){
                        u.messageDialog({
                            msg : JSON.parse(xhr.responseText).msg,
                            title : "提示",
                            btnText : "OK"
                        });
                    }
                    //showMessage('加载模板失败！');
                }
            });
        },
        pageInit: function () {
            var app = u.createApp({
                el: '#printList',
                model: viewModel
            });
            this.isShowMessage();
            // 初次加载数据
            viewModel.loadList({
                startIndex:0,
                count:10
            });
            viewModel.pagination.init();
        },
        goback:function(){
            window.history.go(-1);
            return false;
        },
        isShowMessage:function () {
            if(u.isIE){
                var message = $('.error-message');
                message.show();
                setTimeout(function () {
                    message.hide(100)
                },2000)
            }
        },
        createRef:function(){
            var option = {
                title: '选择业务对象',
                refType:2,
                isRadio:true,
                hasPage:true,
                backdrop:false,
                className:'choseObj',
                param:{
                    refCode:'print_ref',
                    tenantId:tenantId,
                    sysId:'',
                    content:'',
                    refModelUrl: '/eiap-plus/printBusinessRef'
                },
                refModelUrl:{
                    TreeUrl:'/newref/rest/iref_ctr/blobRefTreeGrid', //树请求
                    GridUrl:'',//单选多选请求
                    TableBodyUrl:'/newref/rest/iref_ctr/blobRefTreeGrid',//表体请求
                    TableBarUrl:'/newref/rest/iref_ctr/refInfo',//表头请求
                    totalDataUrl:'',//根据refcode请求完整数据

                },
                onSave: function (sels) {
                    var bocode =sels[0].refcode;
                    $('#bocode').val(sels[0].refname)
                    viewModel.bocode(bocode);
                },
                onCancel: function (p) {
                    $('#bocode').val('')
                },
            };
            window.createModal(option)
        }
    };



    return {
        init : function(content,tabid) {
            content.innerHTML = html;

            viewModel.pageInit();

        }
    }

});