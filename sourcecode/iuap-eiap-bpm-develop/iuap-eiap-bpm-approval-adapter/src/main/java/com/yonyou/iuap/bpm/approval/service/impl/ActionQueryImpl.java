package com.yonyou.iuap.bpm.approval.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.yonyou.iuap.bpm.service.ActionStatus;
import com.yonyou.iuap.bpm.service.IActionQuery;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class ActionQueryImpl implements IActionQuery{
	
	@Override
	public List<Map<String,String>> getActionsList(ObjectNode task){
		  List<Map<String,String>> todo_actionsList = new LinkedList<Map<String,String>>();
		  ActionStatus actionStatus = getActionStatus(task);
		 
		  Map<String,String> todo_action = new HashMap<String,String>();
		  todo_action.put("action_code", "agree");
		  todo_actionsList.add(todo_action);  
		  if(actionStatus.isRejectAble()){
		      Map<String,String> todo_action2 = new HashMap<String,String>();
			  todo_action2.put("action_code", "reject");
			  todo_actionsList.add(todo_action2); 
		  }
		  if(actionStatus.isDelegateAble()){
		      Map<String,String> todo_action3 = new HashMap<String,String>();
		      todo_action3.put("action_code", "reassign");
			  todo_actionsList.add(todo_action3); 
		  }
		  if(actionStatus.isAddsignAble()){
		      Map<String,String> todo_action4 = new HashMap<String,String>();
		      todo_action4.put("action_code", "addApprove");
			  todo_actionsList.add(todo_action4); 
		  }
//		  if(actionStatus.isAssignAble()){
//		      Map<String,String> todo_action5 = new HashMap<String,String>();
//		      todo_action5.put("action_code", "reassign");
//			  todo_actionsList.add(todo_action5); 
//		  }
		  return todo_actionsList;
		
	}
	
	@Override
	public boolean isRejectAble(ObjectNode task){
		ActionStatus actionStatus = getActionStatus(task);
		return actionStatus.isRejectAble();
	}
	
	public boolean isDelegateAble(ObjectNode task){
		ActionStatus actionStatus = getActionStatus(task);
		return actionStatus.isDelegateAble();
	}
	
	public ActionStatus getActionStatus(ObjectNode task){
			ObjectNode objectNode = (ObjectNode)task;
			JsonNode jsonNode =  objectNode.get("activity");

					if(jsonNode!=null){
						List<JsonNode>  variables = jsonNode.findValues("properties");
						if(variables!=null){
							if(variables instanceof ArrayList){
								Object propertiesNode = variables.get(0);
								if(propertiesNode!=null&&propertiesNode instanceof ObjectNode){
									return convert((ObjectNode)propertiesNode);
								}
							}
						}
					}

		return new ActionStatus();
	}

	private ActionStatus convert(ObjectNode propertiesNode) {
		ActionStatus actionStatus = new ActionStatus();
		boolean rejectAble = propertiesNode.get("rejectAble")!=null?propertiesNode.get("rejectAble").asBoolean():true;
		boolean addsignAble = propertiesNode.get("addsignAble")!=null?propertiesNode.get("addsignAble").asBoolean():true;
		boolean delegateAble = propertiesNode.get("delegateAble")!=null?propertiesNode.get("delegateAble").asBoolean():true;
		boolean assignAble = propertiesNode.get("assignAble")!=null?propertiesNode.get("assignAble").asBoolean():true;
		actionStatus.setRejectAble(rejectAble);
		actionStatus.setAddsignAble(addsignAble);
		actionStatus.setDelegateAble(delegateAble);
		actionStatus.setAssignAble(assignAble);
		return actionStatus;
	}
	
	
	

}
