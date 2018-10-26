package com.yonyou.iuap.bpm.approval.service.impl;

import com.yonyou.iuap.bpm.service.IProcessDefinitionQueryService;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.approval.adapter.ProcessService;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;

import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.repository.ProcessDefinitionQueryParam;

@Service
public class ProcessDefinitionQueryServiceImpl implements IProcessDefinitionQueryService {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProcessService processService;	

	public String getProcessDefinitionKeyById(String processDefinitionId){
		if(StringUtils.isNotBlank(processDefinitionId)&&processDefinitionId.indexOf(":")!=-1){
			String[] items = processDefinitionId.split(":");
			if(items!=null&&items.length>0){
				return items[0];
			}
		}
		return null;
	}
	
	@Override
	public Object getAllActivitis(String processDefinitionId) throws BpmException {
		String	processKey = getProcessDefinitionKeyById(processDefinitionId);
		 try {
			 String latestProcessDefinitionId = getLastProcessDefinitionByKey(processKey);
			 Object obj = processService.getRepositoryService().getProcessDefinitionActivities(latestProcessDefinitionId);
			 if(obj != null && obj instanceof ArrayNode)
					return obj;
		 } catch (RestException e) {
			 logger.error(e.getMessage(),e);
			 throw new BpmException("当前环境发生网络拥堵，请稍后再试！");
		}
		 return null;
	}
	
	@Override
	public String getLastProcessDefinitionByKey(String processDefinitionKey) throws BpmException{
		 ProcessDefinitionQueryParam pParam = new ProcessDefinitionQueryParam();
		 pParam.setLatest(true);
		 pParam.setKey(processDefinitionKey);
		 Object process;
		try {
			process = processService.getRepositoryService().getProcessDefinitions(pParam);
			if(process!=null&&process instanceof ObjectNode){
				ObjectNode obj = (ObjectNode) process;
				String id =  String.valueOf(obj.findValue("id"));
				if(StringUtils.isNotBlank(id)){
					return id.replace("\"", "");
				}
			}
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
		}
				
		return null;		
	}

}
