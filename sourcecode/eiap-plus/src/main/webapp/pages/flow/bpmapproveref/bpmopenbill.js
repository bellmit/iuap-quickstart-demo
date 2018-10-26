
define(['./bpmhandler.js'], function(bpmapprove) {
	var eventBpm = {
			//从单据进入审批界面
			initBPMFromBill:function(billId,viewModel){
                    var funcCode=location.hash.slice(2);
                    $.ajax({
                        type : 'get',
                        url : '/eiap-plus/appResAllocateRelate/getEnableBpm?funcCode='
                        + funcCode,
                        dataType : 'json',
                        async : true,
                        contentType : "application/json ; charset=utf-8",
                        success : function(result) {
                            var enableBpm = result.detailMsg.data;
                            if(enableBpm=='Y'){
                                bpmBillHeader("#bpmhead",billId,viewModel);
                                bpmBillFoot("#bpmfoot",viewModel);
                                //viewModel.pmodel=viewModel;

                                return;
                            }else{
                                //不启动审批流程，业务组直接设置单据上的状态
                            }
                        }
                    })
			},
			//从任务进入审批界面
			initBpmFromTask:function(arg,viewModel){
       		 //added by xuxx 单据需要支持流程，增加方法 --begin
               	bpmApproveHeader("#bpmhead",arg.vstate, viewModel);
       			bpmApproveFoot("#bpmfoot",arg.vstate, viewModel);
       			
       			viewModel.id=arg.id;
       			viewModel.taskId = arg.taskId;
       			viewModel.processInstanceId = arg.processInstanceId;
       			viewModel.processDefinitionId = arg.processDefinitionId;
       			viewModel.vstate = arg.vstate;
       			viewModel.pmodel = arg.pmodel;
       			//added by xuxx 单据需要支持流程，增加方法 --end
       	},
			 afterAdd: function (element, index, data) {
	                if (element.nodeType === 1) {
	                    u.compMgr.updateComp(element);
	                }
	            },
	         rowClick: function (row, e) {
	            },
	          
				bpmApprove:function(viewModel){
					bpmApproveHandler(viewModel.taskId,viewModel.processInstanceId,viewModel.processDefinitionId,viewModel.pmodel);
				},
				// 改派
				delegateOk : function(viewModel){
					bpmDelegateOkHandler(viewModel.taskId,viewModel.processInstanceId,viewModel.pmodel);
				},
				// 加签
				bpmAddSignOk : function(viewModel){
					bpmAddSignOkHandler(viewModel.taskId,viewModel.processInstanceId,viewModel.pmodel);
				},
				//驳回或者指派			
				rejectOk : function(viewModel){
					bpmRejectOkHandler(viewModel.taskId,viewModel.processInstanceId,viewModel.pmodel);	
				},
				//驳回或者指派
        		bpmAssignOk : function(viewModel){
                    bpmAssignOkHandler(viewModel.taskId,viewModel.processInstanceId,viewModel.pmodel);
				},
				//流程，新增的时候查看流程图
				bpmImgAddClick: function(viewModel){
					bpmapprove.model.bpmImgApproveClickHandler(viewModel.processDefinitionId,viewModel.processInstanceId,viewModel.flowHisDa,'show');
				},
				//审批点击流程图
				bpmImgApproveClick:function(viewModel){
					bpmapprove.model.bpmImgApproveClickHandler(viewModel.processDefinitionId,viewModel.processInstanceId,viewModel.flowHisDa,'show');
				},
				//added by xuxx 单据需要支持流程，增加方法 --endflowHisDa:bpmapprove.model.flowHisDa,
			
			
	}
	var viewModel =$.extend({},eventBpm,bpmapprove.model);
	return {
		'model': viewModel
    }
	
})