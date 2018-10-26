/**
 * 在这里添加类的描述
 * 2016-03
 */
package com.yonyou.iuap.bpm.approval.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yonyou.iuap.bpm.service.BpmRestVariable;
import com.yonyou.iuap.bpm.service.IProcessCoreService;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.yonyou.iuap.bpm.approval.adapter.ProcessService;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.bpm.service.base.IBpmProcInfoService;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityFieldService;
import com.yonyou.iuap.generic.adapter.InvocationInfoProxyAdapter;

import iuap.iform.bo.entity.BOAttributeEntity;
import iuap.iform.bo.entity.BOEntity;
import iuap.iform.rt.ctr.Platform;
import yonyou.bpm.rest.RuntimeService;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.RestVariable;
import yonyou.bpm.rest.request.runtime.ProcessInstanceStartParam;

/**
 * 云审审批核心服务
 *
 * @author shx1
 *
 */
@Service
public class ProcessCoreServiceImpl implements IProcessCoreService {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProcessService processService;

	@Autowired
	private IBpmProcInfoService bpmProcInfoService;

	@Autowired
	private IBuziEntityFieldService buziEntityFieldService;

	public Map<String, String> startProcess(Object obj, String businessKey,  String busiModuleCode) throws BpmException {
		Map<String, String> returnMap =new HashMap<String, String>();
		BpmProcInfo proInfo = bpmProcInfoService.getByBuizModelCode(busiModuleCode);
		List<BuziEntityFieldVO> fieldList = buziEntityFieldService.findByBuizModelCode(busiModuleCode);

		String processDefinitionKey = proInfo.getProcKey();
		String processDefinitionId = proInfo.getProcDefId();
		String moduleid = proInfo.getProcModelId();
		String userid = InvocationInfoProxyAdapter.getUserid();
		String pk_procdefins = null;
		String taskid = null;
		try {
			ProcessInstanceStartParam ps = new ProcessInstanceStartParam();
			ps.setProcessDefinitionKey(processDefinitionKey);
			ps.setBusinessKey(businessKey);
			ps.setReturnTasks(true);
			List<RestVariable> restVariables;
			try {
				restVariables = FormFieldUtil.genFormVariables(obj, moduleid, fieldList);
				ps.setVariables(restVariables);
			} catch (NoSuchFieldException | SecurityException | IllegalArgumentException | IllegalAccessException e) {
				logger.error(e.getMessage(), e);
			}
			Object ret = processService.getRuntimeService().startProcess(ps);
			if (ret != null) {
				JsonNode json = (JsonNode) ret;
				pk_procdefins = json.get("id").asText();
				if (json.has("tasks")) {
					Object tasks = json.get("tasks");
					ArrayNode array = (ArrayNode) tasks;
					if (array.size() > 0) {
						for (int i = 0; i < array.size(); i++) {
							JsonNode js = array.get(i);
							taskid = js.has("id") ? js.get("id").asText() : null;
							if (StringUtils.isNotBlank(taskid)) {
								String assignee = js.has("assignee") ? js.get("assignee").asText() : null;
								if (assignee!= null && StringUtils.isNotBlank(assignee) && assignee.equals(userid)){
									//第一个人就是审批人的时候，直接同意
									processService.getTaskService().complete(taskid);
								}
							}
						}
					}
				}

			}
		    returnMap.put("processDefinitionId", processDefinitionId);
		    returnMap.put("processInstanceId", pk_procdefins);
		} catch (RestException e) {
			Platform.getiFormLogger().error(e.getMessage(), e);
			if (StringUtils.isNotBlank(taskid))
				try {
					//发起的时候抛异常，认为是没有提交成功删除流程实例
					processService.getRuntimeService().deleteProcessInstance(pk_procdefins);
				} catch (RestException e1) {
					Platform.getiFormLogger().error(e1.getMessage(), e1);
				}
		} catch (yonyou.bpm.rest.exception.RestRequestFailedException e) {
			Platform.getiFormLogger().error(e.getMessage(), e);
			if (StringUtils.isNotBlank(taskid))
				try {
					processService.getRuntimeService().deleteProcessInstance(pk_procdefins);
				} catch (RestException e1) {
					Platform.getiFormLogger().error(e1.getMessage(), e1);
				}
		}
		return returnMap;
	}

	public Map<String, String> startProcess(Map map, String businessKey,  String busiModuleCode,String userId) throws BpmException {
		Map<String, String> returnMap =new HashMap<String, String>();
		BpmProcInfo proInfo = bpmProcInfoService.getByBuizModelCode(busiModuleCode);
		List<BuziEntityFieldVO> fieldList = buziEntityFieldService.findByBuizModelCode(busiModuleCode);

		String processDefinitionKey = proInfo.getProcKey();
		String processDefinitionId = proInfo.getProcDefId();
		String moduleid = proInfo.getProcModelId();
		String pk_procdefins = null;
		String taskid = null;
		try {
			ProcessInstanceStartParam ps = new ProcessInstanceStartParam();
			ps.setProcessDefinitionKey(processDefinitionKey);
			ps.setBusinessKey(businessKey);
			ps.setReturnTasks(true);
			List<RestVariable> restVariables;
			try {
				restVariables = FormFieldUtil.genFormVariables(map, moduleid, fieldList);
				ps.setVariables(restVariables);
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
			}
			Object ret = processService.bpmRestService(userId).getRuntimeService().startProcess(ps);
			if (ret != null) {
				JsonNode json = (JsonNode) ret;
				pk_procdefins = json.get("id").asText();
				if (json.has("tasks")) {
					Object tasks = json.get("tasks");
					ArrayNode array = (ArrayNode) tasks;
					if (array.size() > 0) {
						for (int i = 0; i < array.size(); i++) {
							JsonNode js = array.get(i);
							taskid = js.has("id") ? js.get("id").asText() : null;
							if (StringUtils.isNotBlank(taskid)) {
								String assignee = js.has("assignee") ? js.get("assignee").asText() : null;
								if (assignee!= null && StringUtils.isNotBlank(assignee) && assignee.equals(userId)){
									//第一个人就是审批人的时候，直接同意
									processService.getTaskService().complete(taskid);
								}
							}
						}
					}
				}

			}
			returnMap.put("processDefinitionId", processDefinitionId);
			returnMap.put("processInstanceId", pk_procdefins);
		} catch (RestException e) {
			Platform.getiFormLogger().error(e.getMessage(), e);
			if (StringUtils.isNotBlank(taskid))
				try {
					//发起的时候抛异常，认为是没有提交成功删除流程实例
					processService.getRuntimeService().deleteProcessInstance(pk_procdefins);
				} catch (RestException e1) {
					Platform.getiFormLogger().error(e1.getMessage(), e1);
				}
		} catch (yonyou.bpm.rest.exception.RestRequestFailedException e) {
			Platform.getiFormLogger().error(e.getMessage(), e);
			if (StringUtils.isNotBlank(taskid))
				try {
					processService.getRuntimeService().deleteProcessInstance(pk_procdefins);
				} catch (RestException e1) {
					Platform.getiFormLogger().error(e1.getMessage(), e1);
				}
		}
		return returnMap;
	}
	@Override
	public String start(String processDefinitionKey) throws BpmException {
		try {
			Object ret = processService.getRuntimeService().startProcess(processDefinitionKey);
			if (ret != null) {
				JSONObject dataJson = new JSONObject(ret.toString());
				String pk_procdefins = (String) dataJson.get("id");
				return pk_procdefins;
			}

		} catch (RestException e) {
			logger.error(e.getMessage(), e);
		} catch (JSONException e) {
			logger.error(e.getMessage(), e);
		}
		return null;
	}


	@Override
	public Object approve(String pk_user, String taskid, String comment, List<BpmRestVariable> bpmRestVariables) {
		try {
			if (taskid == null)
				return null;
			TaskService taskService = processService.getTaskService();
			taskService.addComment(taskid, comment, false);
			List<RestVariable> restVariables =  new ArrayList<RestVariable>();
			return taskService.complete(taskid, restVariables);
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 驳回
	 *
	 * @param processInstanceId
	 * @param taskid
	 */
	@Override
	public void reject(String processInstanceId, String activityId, String comment, String taskid) {
		try {
			if (activityId == null)
				return;
			RuntimeService runtimeService = processService.getRuntimeService();
			runtimeService.rejectToActivity(processInstanceId, activityId, comment, taskid);
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
		}
	}

	/**
	 * 驳回到制单人
	 */
	@Override
	public void rejectToInitActivity(String processInstanceId, String comment) {
		try {
			RuntimeService runtimeService = processService.getRuntimeService();
			runtimeService.rejectToInitialActivity(processInstanceId,"", comment);
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
		}
	}

	@Override
	public boolean withdraw(String taskid) {
		try {
			return processService.getTaskService().withdrawTask(taskid);
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
			return false;
		}

	}

	@Override
	public void reassign(String taskId, String userId) {
		try {
			processService.getTaskService().delegateTaskCompletely(taskId, userId);
		} catch (RestException e) {
			Platform.getiFormLogger().error(e.getMessage(), e);
		}

	}

}
