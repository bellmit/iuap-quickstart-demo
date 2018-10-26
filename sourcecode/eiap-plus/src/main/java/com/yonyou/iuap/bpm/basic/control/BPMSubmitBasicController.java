package com.yonyou.iuap.bpm.basic.control;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import yonyou.bpm.rest.RuntimeService;
import yonyou.bpm.rest.request.RestVariable;
import yonyou.bpm.rest.request.runtime.ProcessInstanceStartParam;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.pojo.BPMFormJSON;
import com.yonyou.iuap.bpm.service.ProcessService;
import com.yonyou.iuap.common.general.BasicController;

/**
 * 流程提交基础控制器抽象类。
 * 
 * 
 * @author zhangxyu
 * 
 */
public abstract class BPMSubmitBasicController extends BasicController {
	/*
	 * BPM流程定义 
	 */
	@Autowired
	private ProcessService bpmServioce;

	/**
	 * 流程提交
	 * @return
	 */
	public JSONObject submit(BPMFormJSON bpmjson){
		Object o=null;			
		List<RestVariable> variables=new ArrayList<RestVariable> ();
		 //单据自定义参数
		if(bpmjson.getOtherVariables()!=null){
			variables=bpmjson.getOtherVariables();
		}
		//流程定义key
	     RestVariable v1=new RestVariable();
	     v1.setName("processDefinitionKey");
	     v1.setValue(bpmjson.getProcessDefinitionKey());
		//单据id
	     RestVariable v2=new RestVariable();
	     v2.setName("formId");
	     v2.setValue(bpmjson.getFormId());
		//制单人
	     RestVariable v3=new RestVariable();
	     v3.setName("billMarker");
	     v3.setValue(bpmjson.getBillMarker());
		//组织
	     RestVariable v4=new RestVariable();
	     v4.setName("orgId");
	     v4.setValue(bpmjson.getOrgId());
	     //单据号
		 RestVariable v5=new RestVariable();
		 v5.setName("billNo");
		 v5.setValue(bpmjson.getBillNo());
		 //单据url
		 RestVariable v6=new RestVariable();
		 v6.setName("formUrl");
		 v6.setValue(bpmjson.getFormUrl());
		 //单据标题
		 RestVariable v7=new RestVariable();
		 v7.setName("title");
		 v7.setValue(bpmjson.getTitle());
		 //流程审批后的，单据执行的业务处理类
		 RestVariable v8=new RestVariable();
		 v8.setName("serviceClass");
		 v8.setValue(bpmjson.getServiceClass());
		 
	     variables.add(v1);
	     variables.add(v2);
	     variables.add(v3);
	     variables.add(v4);
	     variables.add(v5);
	     variables.add(v6);
	     variables.add(v7);
	     variables.add(v8);
	
	     JSONObject rejson = new JSONObject();
	    	try {
		        //制单人同组织，要校验传的组织，如果没有，则找制单人的组织
				 //bpmServioce.baseParam.setOrg(bpmjson.getOrgId());
				 RuntimeService rt = bpmServioce.bpmRestServices(bpmjson.getBillMarker(), bpmjson.getOrgId()).getRuntimeService();
			     ProcessInstanceStartParam parm = new ProcessInstanceStartParam();
			     parm.setProcessDefinitionKey(bpmjson.getProcessDefinitionKey());
			     parm.setVariables(variables);
			     parm.setBusinessKey(bpmjson.getFormId());
			     parm.setProcessInstanceName(bpmjson.getProcessInstanceName());
			     parm.setReturnTasks(true);
			     o=rt.startProcess(parm);
			     //更新流程任务描述，把单据标题传过去
			     ArrayNode arrayTasks=null;
			     /*
			      * xdx 161118 修改if条件
			      * 当o的task为null时，
			      * (ObjectNode )o).get("tasks")为NullNode,不是null			      * 
			      */
			     if(o!=null && !((ObjectNode )o).get("tasks").isNull()){
			    	 //流程提交后，得到下一步的任务pk
			    	 arrayTasks=(ArrayNode)((ObjectNode)o).get("tasks");
			    	 for(int i=0;i<arrayTasks.size();i++){
			    		 JsonNode node=arrayTasks.get(i);
			    		 String taskid=node.get("id").textValue();
//			    		 TaskService taskService=bpmServioce.bpmRestServices(bpmjson.getBillMarker()).getTaskService();				    		 
//			    		 TaskResourceParam taskParam=new TaskResourceParam();			    		 			    		 	    		 
//			    		 taskParam.setDescription(bpmjson.getProcessInstanceName());
			    		 
			    		 //taskService.updateTask(taskid, taskParam);
			    	 }
			     }else{
			    	 rejson.put("flag", "fail");
			    	 rejson.put("msg", "不存在流程或找不到流程的下一步任务");
			    	 return rejson;
			     }
			    	 		     
			     rejson.put("flag", "success");
	    	} catch (Exception e) {
   	    	    rejson.put("flag", "fail");
   	    	    rejson.put("msg", e.getMessage());
			}
	    	return rejson;
	}
	
}