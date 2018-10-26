
define(['text!./bpmhandler.html','i18n',"css!../../../style/iconfont/iconfont.css"], function(template) {
//	var dialogmin=require('dialogmin');

    //--------------start 流程meta---------------------------
    //驳回meta
    var metaReject={
        meta: {
            'activityId': {
                type:'string'
            },
            'activityName':{
                type:'string'
            }
//			   ,
//			'participants':{
//				//type:'string'
//			 }
        }
    };

    //人员列表
    var metaPerson={
        meta: {
            'id': {
                type:'string'
            },
            'name':{
                type:'string'
            },
            'code':{
                type:'string'
            },
            'createTime':{
                type:'date'
            }
        }
    };
    //start HistoryTask 历史任务
    var metaHistoyTask ={

        meta: {
            //主键
            'id': {
                type: 'string'
            },
            //活动名称
            'name':{
                type: 'string'
            },
            //任务开始时间
            'startTime':{
                type:'date'
            },
            //任务拥有者
            'owner':{
                type: 'string'
            },
            //流程实例id
            'processInstanceId':{
                type: 'string'
            },
            //结束时间
            'endTime':{
                type:'date'
            },
            //流程实例状态
            'state':{
                type: 'string'
            },
            //审批类型
            'description':{
                type: 'string'
            },
            //完成原因
            'deleteReason':{
                type: 'string'
            },
            //执行人
            'executionId':{
                type: 'string'
            },
            //超时时间
            'claimTime':{
                type:'date'
            }
        }

    };
    //end HistoryTask
    //--------------end 流程meta---------------------------

    //定义通过是否的字典属性
    window.BPMBillState = [
        {
            "value": "NotStart",
            "name": $.i18n.prop('js.flo.bpm.0001')
        },
        {
            "value": "Run",
            "name": $.i18n.prop('js.flo.bpm.0002')
        },
        {
            "value": "End",
            "name": $.i18n.prop('js.flo.bpm.0003')
        },
        {
            "value": "Cancellation",
            "name": $.i18n.prop('js.flo.bpm.0004')
        },
        {
            "value": "Suspended",
            "name": $.i18n.prop('js.flo.bpm.0005')
        }
    ];

    var viewModel={
        //驳回列表
        rejectDa:new u.DataTable(metaReject),
        //改派人员列表
        personDa:new u.DataTable(metaPerson),
        //加签
        personAddDa:new u.DataTable(metaPerson),
        //流程历史
        flowHisDa:new u.DataTable(metaHistoyTask),
        prefixurl:"/eiap-plus/",
        personPagesize:20,
        delegatePageNum:1,//改派页码
        addPageNum:1,// 加签页码
        afterCreate:function(){
            try {
                assignmentPage();
            }catch (e){
               console.log(e);
            }
        } ,
        codeRenderTypeFun: function(obj) {
            var count = 0;
            var gridObj = obj.gridObj;
            var viewModel = gridObj.viewModel;
            var ele = obj.element;
            var rowindex = obj.rowIndex;
            var rowcount = viewModel.personAddDa.rows().length;



            var htmlStr = '<div class="billcode-default-height"><span class="billcode-up-btn billcode-uf hide" style="color: #039BE5;margin-right: 15px;cursor: pointer;"><i class="icon iconfont_iform icon-arrowup"></i></span><span class="billcode-down-btn billcode-uf hide" style="color: #039BE5;margin-right: 15px;cursor: pointer;"><i class="icon iconfont_iform icon-arrowicon"></i></span><div>';
            ele.insertAdjacentHTML('beforeEnd', htmlStr);
            //hover状态监听
            $(ele).parents("tr").on("mouseleave", function() {
                $(this).find(".billcode-uf").addClass("hide");
            })
            $(ele).parents("tr").on("mouseenter", function(e) {
                var precount = $(this).prevAll().length;
                var nextcount = $(this).nextAll().length;
                $(this).find(".billcode-uf").removeClass("hide");
                if (precount == 0) {
                    $(this).find(".billcode-up-btn").addClass("hide");
                } else if (nextcount == 0) {
                    $(this).find(".billcode-down-btn").addClass("hide");
                }
            })
            var btn_parent = $(ele).find(".billcode-default-height");
            $upbtn = btn_parent.children('.billcode-up-btn');
            $downbtn = btn_parent.children('.billcode-down-btn');
            $upbtn.on('click', (function(e) {
                var rowindex = $(this).parents("tr").prevAll().length;
                // var currow = viewModel.personAddDa.getRow(rowindex);
                // viewModel.personAddDa.removeRow(rowindex);
                // viewModel.personAddDa.insertRow(rowindex - 1, currow);

                var arr = viewModel.personAddDa.getSimpleData();
                if(rowindex>0){
                    var temp = arr[rowindex-1];
                    arr[rowindex-1] = arr[rowindex];
                    arr[rowindex]=temp;
                    viewModel.personAddDa.setSimpleData(arr,{unSelect:true});
                }
                //js阻止事件冒泡
                e.cancelBubble = true;
                e.stopPropagation();

                //js阻止链接默认行为，没有停止冒泡
                e.preventDefault();
                return false;
            }))
            $downbtn.on('click', (function(e) {
                var rowindex = $(this).parents("tr").prevAll().length;
                // var currow = viewModel.personAddDa.getRow(rowindex);
                // viewModel.personAddDa.removeRow(rowindex);
                // viewModel.personAddDa.insertRow(rowindex + 1, currow);

                var arr = viewModel.personAddDa.getSimpleData()
                if(rowindex<arr.length-1){
                    var temp = arr[rowindex+1];
                    arr[rowindex+1] = arr[rowindex];
                    arr[rowindex]=temp;
                    viewModel.personAddDa.setSimpleData(arr,{unSelect:true});
                }
                // e.preventDefault();
                //js阻止事件冒泡
                e.cancelBubble = true;
                e.stopPropagation();

                //js阻止链接默认行为，没有停止冒泡
                e.preventDefault();
                return false;

            }))
        },
        //审批点击流程图
        bpmImgApproveClickHandler:function(processDefinitionId,processInstanceId,flowHisDa1,showType){
            //----------------------流程图start  -------------
            var postData={
                processDefinitionId:processDefinitionId,
                processInstanceId:processInstanceId
            };
            $("#img_His").attr({"src":viewModel.prefixurl+"vendor/diagram-viewer/index.html?processDefinitionId="+postData.processDefinitionId+"&processInstanceId="+postData.processInstanceId});
            $.ajax({
                type:'post',
                url:viewModel.prefixurl+'/process/hisTasklist',
                datatype:'json',
                data:JSON.stringify(postData),
                contentType: 'application/json;charset=utf-8',
                success:function(res){
                    if(res){
                        if( res.statusCode =='200'){
                            if(res.data){
                                flowHisDa1.setSimpleData(res.data);
                                flowHisDa1.setRowSelect(-1);
                            }else{
                                u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0006'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                            }
                        }else{
                            u.messageDialog({msg:res.message,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                        }
                    }else{
                        u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0006'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                },
                error:function(er){
                    u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            });
            $('#imgHistory_list').modal(showType) ;
            //---------------------- 流程图end  --------------
        }
    };
    //打开单据时，添加头部按钮信息
    bpmBillHeader = function(divheader,billId,viewModel) {
        var bpmBillDiv=$(template).filter(".approveTypeRadio1").html();
        var jsonpar={
            'billId':billId  };
        $.ajax({
            type:'post',
            url :viewModel.prefixurl+'/process/getbillbpm',
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.message =='NoBpm'){
                        bpmBillDiv = $(bpmBillDiv).map(function(index,dom){
                            if($(dom).attr('id') == 'approveTypeRadio' || $(dom).attr('id') =='billSubmitBpm'||  $(dom).attr('id') =='billImgBpm'){
                                return;
                            }
                            else{
                                return dom;
                            }
                        });
                    }else {
                        viewModel.processInstanceId = res.processInstanceId;
                        viewModel.processDefinitionId = res.processDefinitionId;
                        if(res.message=="NoTask"){
                            bpmBillDiv = $(bpmBillDiv).map(function(index,dom){
                                if($(dom).attr('id') == 'approveTypeRadio' || $(dom).attr('id') =='billSubmitBpm'){
                                    return;
                                }
                                else{
                                    return dom;
                                }

                            });
                        }else{
                            viewModel.taskId = res.taskId;
                            bpmBillDiv = $(bpmBillDiv).map(function(index,dom){
                                if( $(dom).attr('id') == 'billImgBpm'){
                                    return;
                                }
                                else{
                                    return dom;
                                }

                            });
                        }
                    }
                    $(divheader).html(bpmBillDiv);
                    ko.cleanNode($(divheader)[0]);
                    //绑定模型与页面元素
                    u.createApp({
                        el: divheader,
                        model: viewModel
                    });
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
                initI18n();
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });
        //fiter找自身元素。find找子元素

    };
    //打开单据时，添加尾部流程图弹出框信息
    bpmBillFoot = function(divfoot,viewModel) {
        //fiter找自身元素。find找子元素
        $(divfoot).html($(template).filter(".bpmApproveFoot").html());
        ko.cleanNode($(divfoot)[0]);
        u.createApp({
            el: divfoot,
            model: viewModel
        });
    };
    //审批时，添加头部按钮信息
    bpmApproveHeader = function(divheader, vstate, viewModel) {

            var html  = $(template).filter(".approveTypeRadio"+vstate).html()

        html = $(html).map(function(index,dom){

            if( $(dom).attr('id') == 'billImgBpm'){
                return;
            }
            else{
                return dom;
            }

        });
        $(divheader).html(html);
        ko.cleanNode($(divheader)[0]);
        u.createApp({
            el: divheader,
            model: viewModel
        });
    };

    //审批时，添加尾部流程图，加签，指派弹出框信息
    bpmApproveFoot = function(divfoot,vstate, viewModel) {
        $(divfoot).html($(template).filter(".bpmApproveFoot").html());
        ko.cleanNode($(divfoot)[0]);
        u.createApp({
            el: divfoot,
            model: viewModel
        });
    };

    // 加签,搜索事件
    bpmAddSignSearchHandler =function(){
        //搜索条件
        var jsonpar={
            'name':$('#txtsignAddSearth100').val()  };
        jsonpar.pageSize = viewModel.personPagesize;
        jsonpar.pageNum = 1;
        $.ajax({
            type:'post',
            url :viewModel.prefixurl+ 'task/assignee/getlist',
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.flag !='success'){
                        viewModel.personAddDa.clear();
                        viewModel.personAddDa.setSimpleData(res.data.content);
                        //viewModel.personAddDa.setAllRowsUnSelect();
                        viewModel.personAddDa.setRowSelect(-1);
                        viewModel.personAddDa.setRowUnFocus();
                        viewModel.signAddComps.update({
                            totalPages: res.data.totalPages,
                            pageSize: viewModel.personPagesize,
                            currentPage: viewModel.addPageNum,
                            totalCount: res.data.totalElements
                        });
                        window.setTimeout(function(){//解决u.js 22465-22472 定时器200毫秒后设置为选中状态的**问题！
                            viewModel.personAddDa.setAllRowsUnSelect();
                        },201)
                    }else{
                        u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0011'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });

    };

    // 加签,确认事件
    bpmAddSignOkHandler =function(taskId,processInstanceId,pmodel){
        var approvetype = $(document).find('#approveTypeRadio input[name="approvetype"]:checked ').val();
        if (viewModel.personAddDa.getSelectedIndexs().length < 1) {
            u.messageDialog({
                msg: $.i18n.prop('js.flo.bpm.0012'),
                title: $.i18n.prop('js.flo.bpm.0013'),
                btnText: "OK"
            });
            return;
        }
        var userIds =[] ;   //放用户id
        var selectedDatas = viewModel.personAddDa.getSelectedDatas();
        for(var i=0 ;i<selectedDatas.length ; i++  ){
            userIds.push(  selectedDatas[i].data.id.value  ) ;
        }
        var jsonpar={
            'approvetype':approvetype,
            'taskId':taskId,
            'processInstanceId':processInstanceId,
            'userIds':userIds,
            'comment':$('#approve_text').val()  };
        $.ajax({
            type:'post',
            url : viewModel.prefixurl+'task/signaddtask/signadd',
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.flag =='success'){
                        //u.messageDialog({msg:res.msg,title:'审批提示',btnText:$.i18n.prop('js.flo.bpm.0008')});
                        $('#addsignDiv').modal('toggle');
                        $('#bpmDisplayBill').modal('toggle') ;
                        //viewModel.entityUndoDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
                        if(pmodel){
//							pmodel.removeRow(pmodel.getCurrentIndex());
                            pmodel.removeRow(pmodel.getSelectedIndex());
                        }else{
                            //history.back();
                        }
                        u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"});
                        $('#approveTypeRadio>.pap-title>.backbutton').trigger('click');
                    }else{
                        u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });

    };

    // 改派,搜索事件
    bpmDelegateSearchHandler =function(){
        //搜索条件
        var jsonpar={
            'name':$('#txtDelegateSearth100').val()  };
        jsonpar.pageSize = viewModel.personPagesize;
        jsonpar.pageNum = 1;
        $.ajax({
            type:'post',
            url : viewModel.prefixurl+'task/assignee/getlist',
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.flag !='success'){
                        viewModel.personDa.clear();
                        viewModel.personDa.setSimpleData(res.data.content);
                        //viewModel.personAddDa.setAllRowsUnSelect();
                        viewModel.personDa.setRowSelect(-1);
                        viewModel.personDa.setRowUnFocus();

                        viewModel.delegateComps.update({
                            totalPages: res.data.totalPages,
                            pageSize: viewModel.personPagesize,
                            currentPage: viewModel.delegatePageNum,
                            totalCount: res.data.totalElements
                        });
                    }else{
                        u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0011'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });

    };
    //改派,确认事件
    bpmDelegateOkHandler=function(taskId,processInstanceId,pmodel){
        var approvetype = $(document).find('#approveTypeRadio input[name="approvetype"]:checked ').val();
        if (viewModel.personDa.getSelectedIndexs().length < 1) {
            u.messageDialog({
                msg: $.i18n.prop('js.flo.bpm.0014'),
                title: $.i18n.prop('js.flo.bpm.0013'),
                btnText: "OK"
            });
            return;
        }
        var jsonpar={
            'approvetype':approvetype,
            'taskId':taskId,
            'processInstanceId':processInstanceId,
            'userId':viewModel.personDa.getValue("id"),
            'comment':$('#approve_text').val() };
        $.ajax({
            type:'post',
            url : viewModel.prefixurl+'task/delegatetask/delegate',
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.flag =='success'){
                        //u.messageDialog({msg:res.msg,title:'审批提示',btnText:$.i18n.prop('js.flo.bpm.0008')});
                        $('#personDiv').modal('toggle') ;
                        $('#bpmDisplayBill').modal('toggle') ;
                        //viewModel.entityUndoDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
                        if(pmodel){
//							pmodel.removeRow(pmodel.getCurrentIndex());
                            pmodel.removeRow(pmodel.getSelectedIndex());
                        }else{
                            //history.back();
                        }
                        u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"});
                        $('#approveTypeRadio>.pap-title>.backbutton').trigger('click');
                    }else{
                        u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });

    };
    bpmAssignOkHandler=function(taskId,processInstanceId,pmodel){
        var comment = $('#approve_text').val();
        if(!comment){
            message($.i18n.prop('js.flo.bpm.0015'),"error");
            return;
        }
        if (viewModel.personAddDa.getSelectedIndexs().length < 1) {
            u.messageDialog({
                msg: $.i18n.prop('js.flo.bpm.0016'),
                title: $.i18n.prop('js.flo.bpm.0013'),
                btnText: "OK"
            });
            return;
        }
        var arr = viewModel.personAddDa.getSelectedRows();
        var posturl=viewModel.prefixurl+"task/assigntask/commit";
        var participants=[];
        for(var i=0;i<arr.length;i++){
            participants.push(arr[i].getSimpleData());
        }
        var jsonpar ={
            "activityId": viewModel.activityId ,
            "activityName": viewModel.activityName ,
            "taskId": taskId,
            "comment":comment,
            "participants": participants
        }
        $.ajax({
            type:'post',
            url : posturl,
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.flag =='success'){

                        $('#assignDiv').modal('toggle') ;
                        $('#bpmDisplayBill').modal('toggle');
                        if(pmodel){
                            pmodel.removeRow(pmodel.getSelectedIndex());
                        }else{
                            //history.back();
                        }
                        message(res.msg);
                        $('#approveTypeRadio>.pap-title>.backbutton').trigger('click');
                    }else{
                        u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0017'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });

    }
    //驳回或者指派,确认事件
    bpmRejectOkHandler=function(taskId,processInstanceId,pmodel){
        // var approvetype = $('#tree-modal  input[name="approvetype"]:checked ').val();
        var approvetype = $(document).find('#approveTypeRadio input[name="approvetype"]:checked ').val();
        var comment = $(document).find('#approve_text').val();
        if (viewModel.rejectDa.getSelectedIndexs().length < 1) {
            u.messageDialog({
                msg: $.i18n.prop('js.flo.bpm.0018'),
                title: $.i18n.prop('js.flo.bpm.0013'),
                btnText: "OK"
            });
            return;
        }
        var jsonpar ={
            taskId:taskId,
            processInstanceId:processInstanceId,
            activityId:viewModel.rejectDa.getValue("activityId"),
            approvetype:approvetype,
            comment:comment
        }
        var posturl=viewModel.prefixurl+"task/rejecttask/reject";
        if(approvetype=="agree") {
            posturl=viewModel.prefixurl+"task/assigntask/commit";
            jsonpar={
                'taskId':taskId,
                'activityId':viewModel.rejectDa.getValue("activityId"),
                'processInstanceId':processInstanceId,
                'comment':$('#approve_text').val() };
        }
        $.ajax({
            type:'post',
            url : posturl,
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.flag =='success'){
                        //u.messageDialog({msg:res.msg,title:'审批提示',btnText:$.i18n.prop('js.flo.bpm.0008')});
                        $('#rejectDiv').modal('toggle') ;
                        $('#bpmDisplayBill').modal('toggle');
                        //viewModel.entityDoneDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
                        if(pmodel){
//							pmodel.removeRow(pmodel.getCurrentIndex());
                            pmodel.removeRow(pmodel.getSelectedIndex());
                        }else{
                            //history.back();
                        }
                        message(res.msg);
                        $('#approveTypeRadio>.pap-title>.backbutton').trigger('click');
                    }else{
                        u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0011'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });

    };

    //审批
    bpmApproveHandler=function(taskId,processInstanceId,processDefinitionId,pmodel){
        var approvetype = $('#bpmhead  input[name="approvetype"]:checked ').val();
        var comment = $('#approve_text').val();
        if(!comment){
            message($.i18n.prop('js.flo.bpm.0015'),"error");
            return;
        }
        var jsonpar={
            'taskId':taskId,
            'processInstanceId':processInstanceId,
            'processDefinitionId':processDefinitionId,
            'comment':comment,
//				'zy_cd':pmodel.getSelectedIndex(),
            'approvetype':approvetype};
        //同意
        if(approvetype=="agree"||approvetype=="unagree"){
            $.ajax({
                type:'post',
                url : viewModel.prefixurl+'task/completetask/approveCard',
                data:JSON.stringify(jsonpar),
                dataType:"json",
                contentType: 'application/json;charset=utf-8', //必需
                success:function(res){
                    if(res){
                        if( res.flag =='success'){
                            if($('#bpmDisplayBill').length){
                                $('#bpmDisplayBill').modal('toggle') ;
                                if(pmodel){
//									pmodel.removeRow(pmodel.getCurrentIndex());
                                    pmodel.removeRow(pmodel.getSelectedIndex())
                                }else{
                                    //history.back();
                                }
                                message(res.msg);
                                $('#approveTypeRadio>.pap-title>.backbutton').trigger('click');
                            }else{
                                message(res.msg);
                                if(pmodel){
                                    pmodel.md.dBack();
                                }else{
                                    //history.go(-1);
                                }
                            }
                            $('#approveTypeRadio>.pap-title>.backbutton').trigger('click')
                        }else if(res.assignAble){
                            viewModel.personAddDa.setSimpleData(res.assignList[0].participants,{unSelect:true});
                            viewModel.activityId = res.assignList[0].activityId;
                            viewModel.activityName =res.assignList[0].activityName;
                            viewModel.personAddDa.setAllRowsUnSelect();
                            $('#assignDiv').modal('show');
                            // viewModel.rejectDa.setSimpleData(res.assignList);
                            // viewModel.rejectDa.setRowSelect(-1);
                            // viewModel.rejectDa.setRowUnFocus() ;
                            // $('#rejectDiv').modal('show')
                        }else{
                            if(res.msg){
                                u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                            }else{
                                u.messageDialog({msg:res.message,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                            }
                        }
                    }else{
                        u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                },
                error:function(er){
                    u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            });
        }
        //驳回到制单人
        if(approvetype=="rejectToBillMaker"){
            jsonpar.activityId='markerbill';
            $.ajax({
                type:'post',
                url : viewModel.prefixurl+'task/rejecttask/reject',
                data:JSON.stringify(jsonpar),
                dataType:"json",
                contentType: 'application/json;charset=utf-8', //必需
                success:function(res){
                    if(res){
                        if( res.flag =='success'){
                            $('#bpmDisplayBill').modal('toggle')
                            message(res.msg);
                            if(pmodel){
//								pmodel.removeRow(pmodel.getCurrentIndex());
                                pmodel.removeRow(pmodel.getSelectedIndex());
                            }else{
                                //history.back();
                            }
                            $('#approveTypeRadio>.pap-title>.backbutton').trigger('click');
                        }else{
                            $('#bpmDisplayBill').modal('toggle') ;
                            message(res.msg);
                        }
                    }else{
                        u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                },
                error:function(er){
                    u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            });
        }
        //驳回到环节
        if(approvetype=="rejectToActivity"){
            $.ajax({
                type:'post',
                url : viewModel.prefixurl+'task/rejecttask/bfreject',
                data:JSON.stringify(jsonpar),
                dataType:"json",
                contentType: 'application/json;charset=utf-8', //必需
                success:function(res){
                    if(res){
                        if( res.flag =='success'){
                            if(res.rejectlist.length>0){
                                viewModel.rejectDa.setSimpleData(res.rejectlist);
                                //viewModel.rejectDa.setRowSelect(-1);
                                //viewModel.rejectDa.setRowUnFocus() ;
                                $('#rejectDiv').modal('show')
                            }else{
                                // $('#bpmDisplayBill').modal('toggle')
//                                u.messageDialog({msg:'没有可以驳回的环节',title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                            	u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0032'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                            }
                        }else{
                            $('#bpmDisplayBill').modal('toggle')
                            u.showMessage({position:'center',msg:res.msg});
                        }
                    }else{
                        u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                },
                error:function(er){
                    u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            });

        }
        //改派
        if(approvetype=="delegate"){
            var paginationDiv = $('#personDiv').find('#personDiv_pagination')[0];
            viewModel.delegateComps =new u.pagination({ el: paginationDiv, jumppage: false,showState:false });
            jsonpar.pageSize = viewModel.personPagesize;
            jsonpar.pageNum = viewModel.delegatePageNum;
            viewModel.jsonpar = jsonpar;
            dalegataPageChange();
            bpmApproveTypeDelegateAjax(jsonpar);
        }
        //加签
        if( approvetype=="signAdd"){
            var paginationDiv = $('#addsignDiv').find('#addsignDiv_pagination')[0];
            viewModel.signAddComps =new u.pagination({ el: paginationDiv, jumppage: false,showState:false });
            jsonpar.pageSize =viewModel.personPagesize;
            jsonpar.pageNum = viewModel.addPageNum;
            viewModel.jsonpar = jsonpar;
            singAddPageChange();
            bpmApproveTypeSignAddAjax(jsonpar);
        }
        //终止
        if(approvetype=="termination"){
            $.ajax({
                type:'post',
                url :viewModel.prefixurl+ 'task/terminationtask/termination',
                data:JSON.stringify(jsonpar),
                dataType:"json",
                contentType: 'application/json;charset=utf-8', //必需
                success:function(res){
                    if(res){
                        if( res.flag =='success'){
                            //u.messageDialog({msg:res.msg,title:'审批提示',btnText:$.i18n.prop('js.flo.bpm.0008')});
                            $('#bpmDisplayBill').modal('toggle') ;
                            //viewModel.entityUndoDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
                            u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"});
                            if(pmodel){
//									pmodel.removeRow(pmodel.getCurrentIndex());
                                pmodel.removeRow(pmodel.getSelectedIndex());
                            }else{
                                //history.back();
                            }
                            $('#approveTypeRadio>.pap-title>.backbutton').trigger('click');
                        }else if(res.assignAble){
                            viewModel.rejectDa.setSimpleData(res.assignList);
                            viewModel.rejectDa.setRowSelect(-1);
                            viewModel.rejectDa.setRowUnFocus() ;
                            $('#rejectDiv').modal('show')
                        }else{
                            u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                        }
                    }else{
                        u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                },
                error:function(er){
                    u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            });
        }
        //弃审
        if(approvetype=="withdraw"){
            $.ajax({
                type:'post',
                url : viewModel.prefixurl+'task/withdrawtask/withdraw',
                data:JSON.stringify(jsonpar),
                dataType:"json",
                contentType: 'application/json;charset=utf-8', //必需
                success:function(res){
                    if(res){
                        if( res.flag =='success'){
                            //u.messageDialog({msg:res.msg,title:'审批提示',btnText:$.i18n.prop('js.flo.bpm.0008')});
                            $('#bpmDisplayBill').modal('toggle')
                            //viewModel.entityDoneDt.removeRow(viewModel.entityUndoDt.getCurrentIndex());
                            u.showMessage({msg:"<i class=\"fa fa-check-circle margin-r-5\"></i>"+res.msg,position:"center"});
                            if(pmodel){
//							pmodel.removeRow(pmodel.getCurrentIndex());
                                pmodel.removeRow(pmodel.getSelectedIndex());
                            }else{
                                //history.back();
                            }
                            $('#approveTypeRadio>.pap-title>.backbutton').trigger('click');
                        }else{
                            u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0019'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                        }
                    }else{
                        u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                },
                error:function(er){
                    u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            });
        }

    };
    dalegataPageChange = function () {
        viewModel.delegateComps.on('pageChange', function(pageIndex) {
            viewModel.delegatePageNum = pageIndex + 1;
            var jsonpar = viewModel.jsonpar;
            jsonpar.pageNum = pageIndex + 1;
            bpmApproveTypeDelegateAjax(jsonpar);
        });
        viewModel.delegateComps.on('sizeChange', function(arg) {
            viewModel.personPagesize = parseInt(arg);
            viewModel.delegatePageNum = 1;
            var jsonpar = viewModel.jsonpar;
            jsonpar.pageSize = viewModel.personPagesize;
            bpmApproveTypeDelegateAjax(jsonpar);
        });
    };
    singAddPageChange=function () {
        viewModel.signAddComps.on('pageChange', function(pageIndex) {

            //保存已选数据
            viewModel.addPageNum = pageIndex + 1;
            var jsonpar = viewModel.jsonpar;
            jsonpar.pageNum = pageIndex + 1;
            bpmApproveTypeSignAddAjax(jsonpar);
        });
        viewModel.signAddComps.on('sizeChange', function(arg) {
            viewModel.personPagesize = parseInt(arg);
            viewModel.addPageNum = 1;
            var jsonpar = viewModel.jsonpar;
            jsonpar.pageSize = viewModel.personPagesize;
            bpmApproveTypeSignAddAjax(jsonpar);
        });
    };
    //改派请求接口
    bpmApproveTypeDelegateAjax=function (jsonpar) {
        $.ajax({
            type:'post',
            url : viewModel.prefixurl+'task/assignee/getlist',
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.flag !='success'){
                        viewModel.personDa.setSimpleData(res.data.content);
                        viewModel.personDa.setRowSelect(-1);
                        viewModel.personDa.setRowUnFocus() ;
                        viewModel.delegateComps.update({
                            totalPages: res.data.totalPages,
                            pageSize: viewModel.personPagesize,
                            currentPage: viewModel.delegatePageNum,
                            totalCount: res.data.totalElements
                        });
                        $('#personDiv').modal('show')
                    }else{
                        u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0011'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });
    };
    //加签请求接口
    bpmApproveTypeSignAddAjax=function (jsonpar) {
        $.ajax({
            type:'post',
            url : viewModel.prefixurl+'task/assignee/getlist',
            data:JSON.stringify(jsonpar),
            dataType:"json",
            contentType: 'application/json;charset=utf-8', //必需
            success:function(res){
                if(res){
                    if( res.flag !='success'){
                        viewModel.personAddDa.setSimpleData(res.data.content,{unSelect:true});
                        //viewModel.personAddDa.setAllRowsUnSelect();
                        viewModel.personAddDa.setRowUnFocus() ;
                        viewModel.signAddComps.update({
                            totalPages: res.data.totalPages,
                            pageSize: viewModel.personPagesize,
                            currentPage: viewModel.addPageNum,
                            totalCount: res.data.totalElements
                        });
                        $('#addsignDiv').modal('show')
                    }else{
                        u.messageDialog({msg:res.msg,title:$.i18n.prop('js.flo.bpm.0020'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                    }
                }else{
                    u.messageDialog({msg:$.i18n.prop('js.flo.bpm.0010'),title:$.i18n.prop('js.flo.bpm.0007'),btnText:$.i18n.prop('js.flo.bpm.0008')});
                }
            },
            error:function(er){
                u.messageDialog({msg:er,title:$.i18n.prop('js.flo.bpm.0009'),btnText:$.i18n.prop('js.flo.bpm.0008')});
            }
        });
    };
    //审批类型
    bpmApproveTypeShowHandler=function(vApproveType){
        if(vApproveType=='submit'){
            return $.i18n.prop('js.flo.bpm.0021');
        }
        if(vApproveType=='agree'){
            return $.i18n.prop('js.flo.bpm.0022');
        }
        if(vApproveType=='unagree'){
            return $.i18n.prop('js.flo.bpm.0023');
        }
        if(vApproveType=='reject'){
            return $.i18n.prop('js.flo.bpm.0024');
        }
        if(vApproveType=='signAdd'){
            return $.i18n.prop('js.flo.bpm.0025');
        }
        if(vApproveType=='assignAgree'){
            return $.i18n.prop('js.flo.bpm.0026');
        }
        if(vApproveType=='signAdding'){
            return $.i18n.prop('js.flo.bpm.0027');
        }
        if(vApproveType=='delegate'){
            return $.i18n.prop('js.flo.bpm.0028');
        }
        if(vApproveType=='termination'){
            return $.i18n.prop('js.flo.bpm.0029');
        }
        if(vApproveType=='withdraw'){
            return $.i18n.prop('js.flo.bpm.0030');
        }
        if(vApproveType=='postCompleted'){
            //return  '弃审'   ;
            return $.i18n.prop('js.flo.bpm.0031');
        }


    };

    //流程显示状态为查看browse时，流程审批框隐藏，只能查看流程图，不能做审批业务
    bpmApproveBrowseHandler=function(){
        $('#bpmDisplayBill').find('#bpmhead').find('#approveTypeRadio')[0].style.display='none';
        $('#bpmDisplayBill').find('#bpmhead').find('#approveButton')[0].style.display='none';
    };

    //隐藏查询框
    bpmHideQueryInfoHandler=function(divId){
        $('#bpmDisplayBill')[0].querySelector(divId).style.display='none';
    };
    //显示页面的滚动条
    bpmShowBillScrollHandler=function(divId){
        $('#bpmDisplayBill')[0].querySelector(divId).style.overflow='auto';
    };
    //单据上的返回返回
    bpmBack=function(){
        $('#bpmDisplayBill').modal('hide') ;
    };
    //流程图上的返回
    bpmImgBack=function() {
        $('#imgHistory_list').modal('toggle') ;
    };
    //加签返回
    bpmAddSignBack=function(){
        $('#addsignDiv').modal('toggle') ;
    };
    //改派返回
    bpmDelegateBack=function(){
        $('#personDiv').modal('toggle') ;
    };
    //驳回返回
    bpmRejectBack=function(){
        $('#rejectDiv').modal('toggle') ;
    };
    //指派返回
    bpmAssignBack=function(){
        $('#assignDiv').modal('toggle') ;
    };

    return {
        'model': viewModel
    }

});
