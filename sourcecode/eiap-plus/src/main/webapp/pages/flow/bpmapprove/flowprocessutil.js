
define([], function() {
//	var dialogmin=require('dialogmin');	
    //返回流程定义编码
   bpmProcessDefineCode=function(vtype){
	   //种植户考察表流程
	   if(vtype=="1"){
		   return "GL2011";
	   };
	   //合同签订流程
	   if(vtype=="2"){
		   return "GL2021";
	   };	
	   //结算单流程
	   if(vtype=="3"){
		   return "GL3002";
	   };	
	   //应收调整单流程
	   if(vtype=="4"){
		   return "GL3003";
	   };
	   //现金还款流程
	   if(vtype=="5"){
		   return "GL3004";
	   };
	   //加价审批单流程
	   if(vtype=="6"){
		   return "GL3010";
	   };
	   //加价审批单流程
	   if(vtype=="7"){
		   return "topic";
	   };
   };
   
	//功能分类
	 window.bpmStatusName = function(code) {
			var name="";
			if(code!=null){
				if(code=="NotStart"){
					name="开立";
				}
				if(code=="Run"){
					name="审批中";
				}
				if(code=="End"){
					name="审批通过";
				}
				if(code=="Cancellation"){
					name="审批不通过";
				}
				if(code=="Suspended"){
					name="挂起";
				}
			}
			return name;
		};
   
   //返回最新流程定义
   bpmFlowDefineIdHandler=function(vtype){
	   //种植户考察表流程
	   if(vtype=="1"){
		   return "GL2011:2:184c7b4f-653b-11e6-b518-02004c4f4f50";
		   //GL2011:1:4a0c948b-6531-11e6-b518-02004c4f4f50
	   };
	   //合同签订流程
	   if(vtype=="2"){
		   return "GL2021:2:97756509-6f3d-11e6-acf7-02004c4f4f50";
	   };	
	   //结算单流程
	   if(vtype=="3"){
		   return "GL3002:4:317ba9d9-7baf-11e6-afcb-02004c4f4f50";
	   };
	   //应收调整单
	   if(vtype=="4"){
		   return "GL3003:33:1b152dda-ad5f-11e6-80ea-02004c4f4f50";
	   };
	   //加价审批单
	   if(vtype=="6"){
		   return "GL3010:2:984b4987-a88b-11e6-9651-02004c4f4f50";
	   };
   };
	
});