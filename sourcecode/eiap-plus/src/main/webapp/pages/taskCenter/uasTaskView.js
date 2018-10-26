define(function() {
    var ncInvoker = function() {

        this.on = function(methodName, args) {
            var userid = args.userid;
            var detail = args.detail;
            var system = args.system;
            var usercode = args.usercode;
            var pktask = args.id;
            var state = args.state;
            if(args.state =="undo"||args.state=="0"){
                state="1";
            }
            if(args.state =="done"||args.state=="1"){
                state="2";
            }
            if(args.state=="2"){
                state="3";
            }
            var exts = args.exts;
            var prefixurl ='../../../eiap-plus/process';
            if(exts && exts.length>0) {
                var extsObj = JSON.parse(decodeURI(exts))
            }else{
                var extsObj={};
            }


            var billId="";
            $.ajax({
                type:'post',
                url : prefixurl+'/getProcessInstance',
                data:JSON.stringify({'processInstanceId':extsObj.processInstanceId}),
                dataType:"json",
                contentType: 'application/json;charset=utf-8', //必需
                success:function(res){
                    billId = res.businessKey ;
                    //$('#bpmDisplayBill').modal('show') ;
                    if(res.formType==="react"){
                        var vstatus=state;
                        if(vstatus ==2){
                            window.location.href = res.formUrl+'&appType=2&id='+pktask+"&processDefinitionId="+extsObj.processDefinitionId+"&processInstanceId="+extsObj.processInstanceId
                        }else{
                            window.location.href = res.formUrl;
                        }
                    }else {
                        var args = {
                            'taskId': pktask,
                            'processInstanceId': extsObj.processInstanceId,
                            'processDefinitionId': extsObj.processDefinitionId,
                            'id': billId,
                            'vstate': state,
                            // 'pmodel':viewModel.pmodel,
                            'vtype': 'bpm',
                            'appCtx': "/" + res.formUrl.split('/')[1]
                        };
                        //var module = "pages/growers/growersexam/growersexam" ;
                        //单据中心（督办任务）
                        var module = res.formUrl;//+"pages/growers/tblmeeting/tblmeeting";//
                        requirejs.undef(module);
                        var moduleid = "billBody";   //弹出层id
                        var content = document.getElementById(moduleid);
                        require.config({
                            paths: {
                                'css': '../../../wbalone/trd/requirejs/css',
                                'text': '../../../wbalone/trd/requirejs/text',
                                'jquery': '../../../wbalone/trd/jquery/jquery-1.11.2.min',
                                'cookieOperation': '../../../wbalone/apworkbench/components/cookieOperation/cookieOperation',
                                'dialog': 'apworkbench/trd/dialog/dialog',
                                'knockout': "../../../wbalone/trd/knockout/knockout-3.2.0-min",
                                'reflib': '/uitemplate_web/static/js/uiref/reflib',
                                'refer': '/uitemplate_web/static/js/uiref/refer',
                                'refGrid': '/uitemplate_web/static/js/uiref/refGrid',
                                'refGridtree': '/uitemplate_web/static/js/uiref/refGridtree',
                                'refTree': '/uitemplate_web/static/js/uiref/refTree',
                                'refcommon': '/uitemplate_web/static/js/uiref/refcommon',
                                'uiReferComp': '/uitemplate_web/static/js/uiref/uiReferComp',
                                'uiNewReferComp': '/uitemplate_web/static/js/uiref/uiNewReferComp',
                                'ajaxfileupload': "/iuap-saas-filesystem-service/resources/js/ajaxfileupload",
                                'ossupload': "/iuap-saas-filesystem-service/resources/js/ossupload",
                                'interfaceFile': "/iuap-saas-filesystem-service/resources/js/interface.file",
                                'interfaceFileImpl': "/iuap-saas-filesystem-service/resources/js/interface.file.impl",
                                'toast_ref': "/uitemplate_web/static/js/design/jquery-toast/toastr.min",
                                'webUploader': "/iuap-saas-filesystem-service/resources/js/webuploader",
                                'refinfo': "../../../wbalone/apworkbench/js/iuap_qy/ref_info_qy",
                                'u': "../../../wbalone/apworkbench/trd/uui/js/u",
                                'u-polyfill': "../../../wbalone/apworkbench/trd/uui/js/u-polyfill",
                                'u-grid': "../../../wbalone/apworkbench/trd/uui/js/u-grid",
                                'global_qy': '../../../wbalone/apworkbench/js/iuap_qy/global_qy',
                                'index': '../../../wbalone/index',
                                'i18n':'../../../wbalone/i18n/i18n.iuap',
                                'i18nJQ':'../../../wbalone/i18n/jquery.i18n.properties',
                            },
                            shim: {

                                'u-grid': {
                                    deps: ["css!../../../wbalone/apworkbench/trd/uui/css/grid.css"]
                                },
                                'dialog': {
                                    deps: ['css!apworkbench/trd/dialog/ui-dialog.css'],
                                    exports: 'dialog'
                                },
                                'webUploader': {
                                    deps: ["css!/iuap-saas-filesystem-service/resources/js/webuploader.css",]
                                },
                                'interfaceFileImpl': {
                                    deps: ["interfaceFile"]
                                },
                                'refer': {
                                    deps: ["css!/uitemplate_web/static/css/ref/ref.css",
                                        "css!/uitemplate_web/static/css/ref/jquery.scrollbar.css",
                                        "css!/uitemplate_web/static/trd/bootstrap-table/src/bootstrap-table.css",
                                        "css!/uitemplate_web/static/fontIcon/iconfont.css"
                                    ]
                                },
                                'uiReferComp': {
                                    deps: ["reflib", "refGrid", "refGridtree", "refTree", "refcommon"]
                                },
                                'refGridtree': {
                                    deps: ["refer"]
                                },
                                'refGrid': {
                                    deps: ["refer"]
                                },
                                'refTree': {
                                    deps: ["refer"]
                                },
                                'refcommon': {
                                    deps: ["refer"]
                                },
                            }
                        });
                        require(["refinfo", "u-grid", 'global_qy', "css!/eiap-plus/pages/taskCenter/uasTaskView.css", 'index','i18n','i18nJQ'], function () {
                            $('#bpmDisplayBill').modal({backdrop: 'static', keyboard: false});//
                            require([module], function (module) {
                                ko.cleanNode(content);
                                content.innerHTML = "";
                                //content.innerHTML =module.template;
                                // viewModel.userViewModel = module.model ;
                                // module.init('#' + moduleid,args);
                                module.init(content, args);
                                $('#uLoadeBack').hide();
                                $('#uLoad').hide();
                                /**
                                 * 时间：2016/11/02
                                 * 修改人：DN
                                 * 内容：打开考察核实表单据，左边可能是快速搜索栏，显示全部空白，如不需要显示，请去掉，否则显示出搜索条件信息。
                                 */
                                // getActiveTab().find("#bpmDisplayBill #test").css("display","none");
                                $("#bpmDisplayBill #test").css("display", "none");
                                $("#bpmDisplayBill #user_list_button_2").css("display", "none");
                                $("#bpmDisplayBill #papList").css("display", "none");
                                // $('#role_selectDisObject #list button').hide() ;//隐藏不需要的按钮
                                //$('#role_selectDisObject .u-mdlayout-detail').css({'margin-left':'200px'})  ;//未知原因影响，导致左侧查询栏被覆盖，用此来手动显示

                            });
                        });
                    }
                }
            });
        };

    };
    return new ncInvoker();
});
