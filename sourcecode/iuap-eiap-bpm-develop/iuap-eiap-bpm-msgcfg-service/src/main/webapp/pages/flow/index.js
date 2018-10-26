require([
    '../../trd/uitemplate_web/static/js/uiref/reflib.js',
    '../../trd/uitemplate_web/static/js/uiref/refer.js',
    '../../trd/uitemplate_web/static/js/uiref/refGrid.js',
    '../../trd/uitemplate_web/static/js/uiref/refGridtree.js',
    '../../trd/uitemplate_web/static/js/uiref/refTree.js',
    '../../trd/uitemplate_web/static/js/uiref/refcommon.js',
    '../../trd/uitemplate_web/static/js/uiref/uiReferComp.js'
], function () {

    var $ctx = '../../';
    var refmodel = "";

    var triggerIndex;

    var CartLine = function () {
        var self = this;
        self.selfiledvalue = ko.observable();
        self.operators = ko.observable({});
        self.fieldtype = ko.observable();
        self.value = ko.observable();
        self.refcode = ko.observable();
        self.displayname = ko.observable();

        // Whenever the category changes, reset the product selection
        self.selfiledvalue.subscribe(function () {
            self.operators({});
            self.value(undefined);
        });
    };
    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    var PARAM = {
        proc_module_id: getUrlParam("modelId")? getUrlParam("modelId"): "proc_module_id",
        act_id: getUrlParam("activityId")? getUrlParam("activityId"):"act_id",
        formCode: getUrlParam("formCode")? getUrlParam("formCode"):"formCode" ,
        buzientity_id: getUrlParam("formId")? getUrlParam("formId"):"BEI001"
    };

    function reciever() {
        var self = this;
        self.receiverO = ko.observable();
        self.id = ko.observable();
        self.value = ko.observable();


        self.receivertypecode = ko.pureComputed(function () {
            return self.receiverO() ? self.receiverO().receivertypecode : "";
        }, self);
        self.receivertype = ko.pureComputed(function () {
            return self.receiverO() ? self.receiverO().inputtype : "ref";
        }, self);
        self.receiverO.subscribe(function () {
            self.value(undefined);
        });
        self.mouseoutEvent = function () {//
            // debugger;
        }
    }

    var viewModel = {

        enableL:ko.observable(1),
        closeframe: function () {
            console.log(PARAM);
            // debugger;
            // window.parent.frameElement
            //window.history.go(-1);
            // return false;
        },
        /**
         * 页面初始化
         * @return {[type]} [description]
         */
        pageInit: function () {
            window.app = u.createApp({
                el: '#flowBox',
                model: viewModel
            });
            app.init(viewModel, null, false);


            //初始化数据
            viewModel.templateRef.createEmptyRow(); //创建空行
            viewModel.templateRef.setRowSelect(0);
            viewModel.templateRef.on('dataSourceId.valueChange', function (ele) {
                // debugger;
                var compId = ele.newValue;
                var rows = viewModel.templateRef.getChangedRows();
                if (compId) {
                    viewModel.formdata.tmpId.val(compId);
                }

            });


            viewModel.roleRef.createEmptyRow(); //创建空行
            viewModel.roleRef.setRowSelect(0);
            viewModel.roleRef.on('dataSourceId.valueChange', function (ele) {
                var compId = ele.newValue;
                var rows = viewModel.templateRef.getChangedRows();
                var curselvo = viewModel.formdata.msgReceiverVOs.selVOs.pop();
                if (curselvo) {
                    curselvo.value(compId);
                    viewModel.formdata.msgReceiverVOs.selVOs.push(curselvo);
                }
                viewModel.formdata.msgReceiverVOs.selVOs.remove(function (item) {
                    return item.value() == undefined;
                });
                viewModel.formdata.msgReceiverVOs.selVOs.push(new reciever());
                // viewModel.roleRef.setValue('dataSourceId','');

            });


            viewModel.userRef.createEmptyRow(); //创建空行
            viewModel.userRef.setRowSelect(0);
            viewModel.userRef.on('dataSourceId.valueChange', function (ele) {

                var compId = ele.newValue;
                var rows = viewModel.templateRef.getChangedRows();
                var curselvo = viewModel.formdata.msgReceiverVOs.selVOs.pop();
                if (curselvo) {
                    curselvo.value(compId);
                    viewModel.formdata.msgReceiverVOs.selVOs.push(curselvo);
                }
                viewModel.formdata.msgReceiverVOs.selVOs.remove(function (item) {
                    return item.value() == undefined;
                });
                viewModel.formdata.msgReceiverVOs.selVOs.push(new reciever());
                // viewModel.userRef.setValue('dataSourceId','');


            });

            viewModel.triggerRef.createEmptyRow(); //创建空行
            viewModel.triggerRef.setRowSelect(0);
            viewModel.triggerRef.on('valueChange', function (ele) {
                if(ele.dataTable=="triggerRef"){
                    var compId = ele.newValue;
                    var fieldId = ele.field;
                    var index = fieldId.substr(fieldId.indexOf("_")+1,fieldId.length);
                    var count=1;
                    if(compId!=""){
                        //var rows = viewModel.triggerRef.getChangedRows();
                        var localselconditions = viewModel.formdata.triggercondition.selconditions();
                        for(var i=0;i<localselconditions.length;i++){
                              if(typeof localselconditions[i].operators()=="undefined"){
                                  if(index==count){
                                      break;
                                  }
                                  count=count+1;
                              }
                        }
                        if(index<count){
                            count=index;
                        }
                        //设置value值
                        viewModel.formdata.triggercondition.selconditions()[count].value(compId);
                        //设置refcode值
                        var localrefcode = JSON.parse(this.getMeta(fieldId).refmodel).refCode;
                        viewModel.formdata.triggercondition.selconditions()[count].refcode(localrefcode);
                        //获取参照框，设置displayname值
                        var elm = $('#refContainertriggerRef_' + index);
                        var referObj = elm.data('uui.refer');
                        var refname = referObj.values[0].refname;
                        viewModel.formdata.triggercondition.selconditions()[count].displayname(refname);
                        //更新控件
                        //var id = "dataSourceId_"+triggerIndex;
                        app.createComp(document.getElementById(fieldId),viewModel);
                        //删除多余行
                        viewModel.formdata.triggercondition.selconditions.remove(function (item) {
                            return item.value() == undefined;
                        });
                        viewModel.formdata.triggercondition.selconditions.push(new CartLine());
                    }
                }
                // viewModel.userRef.setValue('dataSourceId','');

            });

            // 初次加载角色列表数据
            viewModel.loadmsgList({});

            viewModel.formdata.initdata();//初始化表单数据


            //处理搜索任务
            $("#flowName").on('focus', function () {
                viewModel.createflag(true);
                viewModel.resetForm();
                viewModel.formflag(true);
            })


        },
        resetForm: function () {
            viewModel.curMsgflow({msgname: "这是新建的标题", enable: 1});
            viewModel.curMsgflow({enable: 1, msgname: ""});

            viewModel.formdata.clearData();
            //清空触发条件meta
           /* for(var j=0;j<11;j++){
                var localid = 'dataSourceId_'+j;
                viewModel.triggerRef.setValue(localid,'');
            }*/
            if ($("#flowBox .left-box  .u-list-group-item.cur").length) {
                $("#flowBox .left-box  .u-list-group-item.cur").removeClass('cur');
            }
        },
        curMsgflow: ko.observable({msgname: "", enable: "1"}),
        createflag: ko.observable(false),
        templateRef: new u.DataTable({
            meta: {
                'dataSourceId': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                }
            }
        }),

        roleRef: new u.DataTable({
            meta: {
                'dataSourceId': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                }
            }
        }),
        userRef: new u.DataTable({
            meta: {
                'dataSourceId': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                }
            }
        }),
        triggerRef: new u.DataTable({
            meta: {
                'dataSourceId_0': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_1': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_2': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_3': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_4': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_5': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_6': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_7': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_8': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_9': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                },
                'dataSourceId_10': {
                    'refmodel': '{}',
                    'refcfg': '{"isClearData":true,"ctx":"/uitemplate_web","isMultiSelectedEnabled":false,"pageUrl":"uitemplate_web","isCheckListEnabled":false}'
                }
            }
        }),
        /**
         * 表格方法，用于添加行后触发渲染
         * @method function
         * @param  {[type]} element [description]
         * @param  {[type]} index   [description]
         * @param  {[type]} row     [description]
         * @return {[type]}         [description]
         */
        afterAdd: function (element, index, row) {
            // debugger;
            if (element.nodeType === 1) {
                u.compMgr.updateComp(element);
                var umeta = $(element).find('[u-meta]');
                if (umeta.length > 0) {
                    for (var i = 0; i < umeta.length; i++) {
                        try {
                            app.createComp(umeta[i], viewModel);
                        } catch (e) {

                        }

                    }

                }
            }
        },
        triggerRefInitForRender: function (refCode,displayname,index){
            if (!refCode) return alert("缺少参数~~");
            $.ajax({
                type: "get",
                url: '/uitemplate_web/iref_ctr/refInfo/',
                data: {
                    refCode: refCode || ""
                },
                traditional: true,
                async: false,
                dataType: "json",
                success: function (pRefmodel) {
                    refmodel = JSON.stringify(pRefmodel);
                    var id = "dataSourceId_"+index;
                    var meta= '{"type":"uiRefer", "data":"triggerRef", "field":"dataSourceId_'+index+'"}';
                    $("#"+id).attr("u-meta",meta);
                    var field="dataSourceId_"+ index;
                    viewModel.triggerRef.setMeta(field, 'refmodel', refmodel);
                    app.createComp(document.getElementById(id),viewModel);
                    $("#triggerRef_"+index).val(displayname);
                }
            });
        },

        formdata: {
            //接受者类型
            msgReceiverVOs: {
                selVOs: ko.observableArray([new reciever()]),
                selreceivers: ko.observableArray([]),
                blurEvent: function (root, data) {//
                    if (data.value()) {
                        viewModel.formdata.msgReceiverVOs.selVOs.remove(function (item) {
                            return item.receiverO() == undefined;
                        });
                        viewModel.formdata.msgReceiverVOs.selVOs.push(new reciever());
                    } else {
//                        alert("请输入有效值");
                    }
                },
                removerow: function (root, data) {
                    viewModel.formdata.msgReceiverVOs.selVOs.remove(data);
                },

                load: function () {
                    var data = {
                        proc_module_id: PARAM.proc_module_id,
                        act_id: PARAM.act_id,
                        formCode: PARAM.formCode,
                        buzientity_id: PARAM.buzientity_id
                    };
                    $.ajax({
                        type: "get",
                        dataType: 'json',
                        contentType: 'application/json',
                        url: $ctx + "msgConfig/getReceiverType",
                        data: data,
                        success: function (res) {
                            if (res.status == "1") {
                                viewModel.formdata.msgReceiverVOs.selreceivers(res.data);
                            }
                        }
                    });
                },
                getValue: function () {
                    return $.map(viewModel.formdata.msgReceiverVOs.selVOs(), function (line) {
                        return line.value() ? {
                            receiver: line.value(),
                            receivertypecode: line.receiverO().receivertypecode
                        } : undefined
                    });
                }
            },
            //触发条件
            triggercondition: {
                selconditions: ko.observableArray([new CartLine()]),

                seloptions: ko.observableArray(),
                selfiledvalue: ko.observable({}),
                selopvalue: ko.observable({}),


                getValue: function () {
                    return $.map(viewModel.formdata.triggercondition.selconditions(), function (line) {
                        console.log(line);
                        // debugger;
                        return line.value() ? {
                            fieldcode: line.selfiledvalue().fieldcode,
                            operatorcode: line.selfiledvalue().conditionType.operators.length ? (typeof line.operators() != "undefined" ? line.operators()['operatecode']:"") : "",
                            refcode:typeof line.refcode == "function" ? line.refcode():"",
                            displayname:typeof line.displayname == "function" ? line.displayname():"",
                            value: line.value()
                        } : undefined
                    });
                },
                blurEvent: function (data) {//
                    if (data.value()) {
                        viewModel.formdata.triggercondition.selconditions.remove(function (item) {
                            return item.value() == undefined;
                        });
                        viewModel.formdata.triggercondition.selconditions.push(new CartLine());
                    } else {
//                        alert("请输入有效值");
                    }
                },

                change: function (data1,data2,data3,index) {
                    if(data2.fieldtype == "reference"){ //初始化参照
                        var refcode = JSON.parse(data2.typeoptions).referCode;
                        //refcode ="bpmMsgcfgUserRef";
                        triggerIndex=data3;
                        triggerRefInit(refcode);
                    }
                },

                removerow: function (root, data) {
                    viewModel.formdata.triggercondition.selconditions.remove(root);
                },
                load: function () {
                    var data = {
                        proc_module_id: PARAM.proc_module_id,
                        act_id: PARAM.act_id,
                        formCode: PARAM.formCode,
                        buzientity_id: PARAM.buzientity_id
                    };
                    $.ajax({
                        type: "get",
                        dataType: 'json',
                        contentType: 'application/json',
                        url: $ctx + "buzientityfield/getByEntityId",
                        data: data,
                        success: function (res) {
                            if (res.status) {
                                if(res.data.length==1 && res.data[0]==null){

                                }
                                else{
                                    viewModel.formdata.triggercondition.seloptions(res.data);
                                }

                            }
                        }
                    });
                }


            },
            //消息通道
            commway: {
                val: ko.observable(),
                vals: ko.observableArray([]),
                load: function () {
                    var data = {
                        proc_module_id: PARAM.proc_module_id,
                        act_id: PARAM.act_id,
                        formCode: PARAM.formCode,
                        buzientity_id: PARAM.buzientity_id
                    };
                    $.ajax({
                        type: "get",
                        dataType: 'json',
                        contentType: 'application/json',
                        url: $ctx + "msgConfig/getChannels",
                        data: data,
                        success: function (res) {
                            if (res.status == "1") {
                                viewModel.formdata.commway.vals(res.data);
                            } else {
                                alert(res.msg);
                            }
                        }
                    });
                },
                getValue: function () {
                    return viewModel.formdata.commway.val() ? viewModel.formdata.commway.val().type : ""
                }
            },
            //事件类型
            eventcode: {
                val: ko.observable({}),
                vals: ko.observableArray([]),
                load: function () {
                    var data = {
                        proc_module_id: PARAM.proc_module_id,
                        act_id: PARAM.act_id,
                        formCode: PARAM.formCode,
                        buzientity_id: PARAM.buzientity_id
                    };
                    $.ajax({
                        type: "get",
                        dataType: 'json',
                        contentType: 'application/json',
                        url: $ctx + "msgConfig/getEventType",
                        data: data,
                        success: function (res) {
                            if (res.status == "1") {
                                viewModel.formdata.eventcode.vals(res.data);
                            } else {
                                alert(res.msg);
                            }
                        }
                    });
                },
                getValue: function () {
                    return viewModel.formdata.eventcode.val() ? viewModel.formdata.eventcode.val().eventcode : ""
                }
            },
            //消息模板
            tmpId: {
                val: ko.observable()
            },
            //预置表单数据
            initdata: function () {
                viewModel.formdata.commway.load();
                viewModel.formdata.eventcode.load();
                viewModel.formdata.triggercondition.load();
                viewModel.formdata.msgReceiverVOs.load();
            },
            clearData: function () {
                var self = viewModel.formdata;
                self.tmpId.val('');
                self.eventcode.val('');
                self.commway.val('');
                self.triggercondition.selconditions.removeAll();
                self.triggercondition.selconditions([new CartLine()]);
                self.msgReceiverVOs.selVOs.removeAll();
                self.msgReceiverVOs.selVOs([new reciever()]);

            },
            getData: function () {
                var triggercondition = viewModel.formdata.triggercondition.getValue();
                var eventcode = viewModel.formdata.eventcode.getValue();//事件类型
                var msgtemplateid = viewModel.formdata.tmpId.val();
                var msgReceiverVOs = viewModel.formdata.msgReceiverVOs.getValue();
                var commway = viewModel.formdata.commway.val() ? viewModel.formdata.commway.val()['type'] : undefined;

                return {
                    "eventcode": eventcode,
                    "msgReceiverVOs": msgReceiverVOs,
                    "triggercondition": triggercondition,
                    "msgtemplateid": msgtemplateid,
                    "channel": commway
                }
            },
            setData: function () {
                // debugger;
                var data = viewModel.curMsgflow();
                //set msgReceiverVOs options
                if (data.msgReceiverVOs && data.msgReceiverVOs.length) {
                    viewModel.formdata.msgReceiverVOs.selVOs.removeAll();

                    $.map(data.msgReceiverVOs, function (item) {
                        var b = new reciever();
                        var greparr = $.grep(viewModel.formdata.msgReceiverVOs.selreceivers(), function (c) {

                            if (item.receivertypecode == c.receivertypecode) {
                                b.receiverO(c);
                                b.value(item.receiver);
                            }
                            return (item.receivertypecode == c.receivertypecode);

                        })[0];

                        viewModel.formdata.msgReceiverVOs.selVOs.push(b);

                        /**
                         * 参照 bug
                         */
                        /* if (item.inputtype == 'ref') {
                         if (item.receivertypecode == 'user') {
                         viewModel.userRef.addSimpleData({
                         dataSourceId:item.receiver
                         });
                         viewModel.userRef.setValue('dataSourceId',item.receiver);
                         }
                         if (item.receivertypecode == 'bpmrole') {
                         viewModel.roleRef.addSimpleData({
                         dataSourceId:item.receiver
                         });
                         viewModel.roleRef.setValue('dataSourceId',item.receiver);

                         }

                         }*/

                    });

                    // viewModel.formdata.msgReceiverVOs.selVOs.push(new reciever());

                } else {
                    viewModel.formdata.msgReceiverVOs.selVOs.removeAll();
                    viewModel.formdata.msgReceiverVOs.selVOs.push(new reciever());
                }

                //set   triggercondition options
                if (data.triggercondition && data.triggercondition.length) {
                    viewModel.formdata.triggercondition.selconditions.removeAll();
                    var localcount=0;
                    $.map(data.triggercondition, function (opt) {
                        var inO = {
                            selfiledvalue: ko.observable(),
                            operators: ko.observable(),
                            fieldtype: ko.observable(),
                            value: ko.observable(opt.value),
                            refcode:ko.observable(opt.refcode),
                            displayname: ko.observable(opt.displayname)
                        };
                        var grepOne = $.grep(viewModel.formdata.triggercondition.seloptions(), function (item, index) {
                            var count=1;
                            if (item.fieldcode == opt.fieldcode) {

                                inO.selfiledvalue(item);
                                if (opt.operatorcode && item.conditionType.operators) {
                                    var b = $.grep(item.conditionType.operators, function (a) {
                                        return a.code = opt.operatorcode;
                                    })[0];
                                    inO.operators(b);
                                }
                            }
                            return (item.fieldcode == opt.fieldcode);
                        })[0];
                        viewModel.formdata.triggercondition.selconditions.push(inO);
                        //初始化参照
                        if(opt.refcode!="" && typeof opt.refcode!="undefined"){
                            viewModel.triggerRefInitForRender(opt.refcode,opt.displayname,localcount);
                            //localcount++;
                        }
                        localcount++;
                    });
                    viewModel.formdata.triggercondition.selconditions.push(new CartLine());
                } else {
                    viewModel.formdata.triggercondition.selconditions.removeAll();
                    viewModel.formdata.triggercondition.selconditions.push(new CartLine());
                }

                //set 消息模板 tmpIdvalue 参照值
                if (data.msgtemplateid != "" && typeof data.msgtemplateid != "undefined") {
                    viewModel.formdata.tmpId.val(data.msgtemplateid);
                }
                //set 消息通道
                if (data.channel) {
                    var item = $.grep(viewModel.formdata.commway.vals(), function (item, index) {
                        return item.type == data.channel;
                    });
                    viewModel.formdata.commway.val(item.length ? item[0] : undefined);
                }
                //set 事件类型
                if (data.eventcode) {
                    var item = $.grep(viewModel.formdata.eventcode.vals(), function (item, index) {
                        return item.eventcode == data.eventcode;
                    });
                    viewModel.formdata.eventcode.val(item.length ? item[0] : undefined);
                }
            }
        },

        msgDatas: new u.DataTable({
            meta: {
                id: {
                    type: 'string'
                },
                msgname: {
                    type: 'string'
                },
                proc_module_id: {
                    type: 'string'
                },
                act_id: {
                    type: 'string'
                },
                buzientity_id: {
                    type: 'string'
                },
                triggercondition: {},
                eventcode: {
                    type: 'string'
                },
                msgtemplateid: {
                    type: 'string'
                },
                enable: {
                    type: 'string'
                },
                userid: {
                    type: 'string'
                },
                sysid: {
                    type: 'string'
                },
                tenantid: {
                    type: 'string'
                },
                msgReceiverVOs: {}
            }
        }),
        /**
         * 加载消息配置列表
         * @method function
         * @return {[type]} [description]
         */
        loadmsgList: function (params) {
            u.showLoader();
            var data = {
                proc_module_id: PARAM.proc_module_id,
                act_id: PARAM.act_id,
                formCode: PARAM.formCode,
                buzientity_id: PARAM.buzientity_id
            };
            $.ajax({
                type: "post",
                dataType: 'json',
                contentType: 'application/json',
                url: $ctx + "msgConfig/findAllByProcId",
                data: JSON.stringify(data),
                success: function (res) {
                    u.hideLoader();

                    if (res.status == "1") {
                        if (res.data.length) {
                            viewModel.msgDatas.setSimpleData(res.data);
                            viewModel.enableL($('#selectedfa ul>li').length);
                        }
                    } else {
                        alert(res.msg);
                    }
                }
            });


        },
        loading: {
            begein: function () {
                u.showLoader();
            },
            stop: function () {
                u.hideLoader();
            }
        },
        formflag: ko.observable(true),
        /**
         *  bind view  click event
         * */
        clickHandle: {
            changeState: function (row) {
                var data = {
                    id: row.getValue('id'),
                    enable: row.data.enable.value ? '0' : '1'
                };
                $.ajax({
                    type: "get",
                    dataType: 'json',
                    contentType: 'application/json',
                    url: $ctx + "msgConfig/start",
                    data: data,
                    success: function (res) {
                        if (res.status == "1") {
                            row.setValue('enable', (row.data.enable.value ? 0 : 1));

                            viewModel.enableL($('#selectedfa ul>li').length);

                        } else {
                            alert(res.msg);
                        }
                    }
                });

            },
            edit: function (row, event) {

                // debugger;
                $("#flowBox .left-box  .u-list-group-item.cur").removeClass('cur');
                $(event.target).parents('.u-list-group-item').addClass('cur');
                viewModel.msgDatas.setRowFocus(row);
                u.showLoader();
                var data = {
                    id: row.getValue('id'),
                    proc_module_id: PARAM.proc_module_id,
                    act_id: PARAM.act_id,
                    formCode: PARAM.formCode,
                    buzientity_id: PARAM.buzientity_id
                    };
                $.ajax({
                    type: "post",
                    dataType: 'json',
                    url: $ctx + "msgConfig/getByPrimaryKey",
                    data: {
                        "data":JSON.stringify(data)
                    },
                    success: function (res) {
                        u.hideLoader();
                        if (res.status == "1") {
                            viewModel.createflag(true);
                            viewModel.formflag(false);
                            viewModel.curMsgflow(res.data);
                            // viewModel.formdata.renderform();

                            viewModel.formdata.setData();
                        } else {
                            alert(res.msg);
                        }
                    }
                });
                //清空triggerRef的meta
                for(var j=0;j<11;j++){
                    var localid = 'dataSourceId_'+j;
                    viewModel.triggerRef.setValue(localid,'');
                }
            },
            removeformItem: function () {
                if (viewModel.formflag()) {//新增态删除
                    viewModel.createflag(false);
                } else {//编辑态删除
                    var fRow = viewModel.msgDatas.getFocusRow();
                    viewModel.clickHandle.remove(fRow);
                    viewModel.createflag(false);
                    viewModel.enableL($('#selectedfa ul>li').length);

                }
                viewModel.clickHandle.cancelForm();
            },
            remove: function (row) {
                var data = {
                    id: row.getValue('id')
                };
                u.confirmDialog({
                    msg: "确定要删除吗？",
                    title: "提示",
                    hasCloseMenu: true,
                    onOk: function () {
                        //ajax更新操作
                        delAjaxFunction(data,row.rowId);
                    },
                    onCancel: function () {
                    }
                });


            },
            cancelForm: function () {
                viewModel.createflag(false);
                viewModel.curMsgflow({enable: 1, msgname: ""});
                if ($("#flowBox .left-box  .u-list-group-item.cur").length) {
                    $("#flowBox .left-box  .u-list-group-item.cur").removeClass('cur');
                }

            },
            saveForm: function () {
                var cur = viewModel.curMsgflow();
                if (!cur.msgname) {
                    alert("名字还没有输入哦~");
                    return false;
                }
                var data = $.extend(
                    {
                        proc_module_id: PARAM.proc_module_id,
                        act_id: PARAM.act_id,
                        formCode: PARAM.formCode,
                        buzientity_id: PARAM.buzientity_id,
                        "enable": cur.enable,
                        "msgname": cur.msgname,
                        "sysid": "",
                        "tenantid": "",
                        "userid": ""
                    },
                    viewModel.formdata.getData(),
                    PARAM);
                // debugger;

                if (viewModel.formflag()) {   //new
                    $.ajax({
                        type: "post",
                        dataType: 'json',
                        url: $ctx + "msgConfig/insertMsgConfig",
                        data:{
                            "data":JSON.stringify(data)
                        },
                        success: function (res) {
                            if (res.status == "1") {
                                data.id = res.data;
                                viewModel.msgDatas.addSimpleData(data);
                                viewModel.enableL($('#selectedfa ul>li').length);

                                viewModel.resetForm();
                                viewModel.formflag(false);
                                viewModel.createflag(false);

                            } else {
                                alert(res.msg);
                            }
                        }
                    });

                } else { //edit
                    data.id = viewModel.curMsgflow().id;
                    $.ajax({
                        type: "post",
                        dataType: 'json',
                        url: $ctx + "msgConfig/updateMsgConfig",
                        data:{
                            "data":JSON.stringify(data)
                        },
                        success: function (res) {
                            if (res.status == "1") {
                                var fRow = viewModel.msgDatas.getFocusRow();
                                fRow.setValue('msgname', data.msgname);
                                viewModel.resetForm();
                                viewModel.formflag(false);
                                viewModel.createflag(false);

                            } else {
                                alert(res.msg);
                            }
                        }
                    });

                }


//                viewModel.msgDatas.addSimpleData({
//                    name: cur.name(),
//                    state: cur.state()
//                });
            }
        }
    };

    function tmplRefInit(refCode) {//消息模板参照初始化
        if (!refCode) return alert("缺少参数~~");
        $.ajax({
            type: "get",
            url: '/uitemplate_web/iref_ctr/refInfo/',
            data: {
                refCode: refCode || ""
            },
            traditional: true,
            async: false,
            dataType: "json",
            success: function (pRefmodel) {
                refmodel = JSON.stringify(pRefmodel);
                viewModel.templateRef.setMeta('dataSourceId', 'refmodel', refmodel);
            }
        });
    }

    tmplRefInit('msgTemplateRef');
    function refCodeInit(refCode) {//流程角色参照初始化
        if (!refCode) return alert("缺少参数~~");
        $.ajax({
            type: "get",
            url: '/uitemplate_web/iref_ctr/refInfo/',
            data: {
                refCode: refCode || ""
            },
            traditional: true,
            async: false,
            dataType: "json",
            success: function (pRefmodel) {
                refmodel = JSON.stringify(pRefmodel);
                viewModel.roleRef.setMeta('dataSourceId', 'refmodel', refmodel);
            }
        });
    }

    refCodeInit('bpmRoleRef');
    function userRefInit(refCode) {//流程角色参照初始化
        if (!refCode) return alert("缺少参数~~");
        $.ajax({
            type: "get",
            url: '/uitemplate_web/iref_ctr/refInfo/',
            data: {
                refCode: refCode || ""
            },
            traditional: true,
            async: false,
            dataType: "json",
            success: function (pRefmodel) {
                refmodel = JSON.stringify(pRefmodel);
                viewModel.userRef.setMeta('dataSourceId', 'refmodel', refmodel);
            }
        });
    }

    userRefInit('bpmMsgcfgUserRef');

    function triggerRefInit(refCode) {//流程角色参照初始化
        if (!refCode) return alert("缺少参数~~");
        $.ajax({
            type: "get",
            url: '/uitemplate_web/iref_ctr/refInfo/',
            data: {
                refCode: refCode || ""
            },
            traditional: true,
            async: false,
            dataType: "json",
            success: function (pRefmodel) {
                refmodel = JSON.stringify(pRefmodel);
                var id = "dataSourceId_"+triggerIndex;
                //var meta= '{"type":"uiRefer", "data":"triggerRef", "field":"dataSourceId","rowIndex":'+triggerIndex+'}';
                var meta= '{"type":"uiRefer", "data":"triggerRef", "field":"dataSourceId_'+triggerIndex+'"}';
                $("#"+id).attr("u-meta",meta);
                var field="dataSourceId_"+ triggerIndex;
                viewModel.triggerRef.setMeta(field, 'refmodel', refmodel);
                app.createComp(document.getElementById(id),viewModel);
            }
        });
    }

    function delAjaxFunction(data,rowId){
        $.ajax({
            type: "get",
            dataType: 'json',
            contentType: 'application/json',
            url: $ctx + "msgConfig/deleteMsgConfig",
            data: data,
            success: function (res) {
                if (res.status == "1") {
                    viewModel.msgDatas.removeRowByRowId(rowId);
                    viewModel.enableL($('#selectedfa ul>li').length);

                } else {
                    alert(res.msg);
                }
            }
        });
    }
    viewModel.pageInit();
});
