package com.yonyou.iuap.bpm.approval.adapter;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.adpt.BpmProcInstAdpt;
import com.yonyou.iuap.bpm.entity.adpt.insthistory.BpmProcInstHistroyAdpt;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmRunTimeService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;

import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.RestVariable;
import yonyou.bpm.rest.request.runtime.ProcessInstanceParam;
import yonyou.bpm.rest.request.runtime.ProcessInstanceStartParam;

/**
 * 云审对接，流程运行时接口服务实现
 * 
 * @author zhh
 *
 */
@Service
public class RuntimeServiceAdpt implements IEiapBpmRunTimeService {

	private static final Logger log = LoggerFactory.getLogger(RuntimeServiceAdpt.class);

	@Autowired
	private IProcessService processService;

	@Override
	public BpmProcInstAdpt startProcess(BpmProcInfo info) throws BpmException {
		try {
			if (StringUtils.isNotEmpty(info.getProcKey())) {
				Object obj = this.processService.getRuntimeService().startProcess(info.getProcKey());
				JSONObject jsonObj = JSON.parseObject(obj.toString());
				if (jsonObj != null && !jsonObj.isEmpty()) {
					return JSON.toJavaObject(jsonObj, BpmProcInstAdpt.class);
				} else {
					log.error("流程启动，SDK返回值异常！");
					throw new BpmException("流程启动，SDK返回值异常！");
				}
			} else {
				log.error("流程启动，流程定义模型基本信息异常，流程KEY值不存在！");
				throw new BpmException("流程启动，流程定义模型基本信息异常，流程KEY值不存在！");
			}
		} catch (RestException e) {
			log.error("流程启动，SDK异常：", e);
			throw new BpmException("流程启动，SDK异常：", e);
		}
	}

	@Override
	public BpmProcInstAdpt startProcess(BpmProcInfo info, List<RestVariable> variables) throws BpmException {
		try {
			if (StringUtils.isNotEmpty(info.getProcDefId()) && StringUtils.isNotEmpty(info.getProcKey())) {
				Object obj = this.processService.getRuntimeService()
						.startProcess(this.buildProcInstStartParam(info, variables));
				JSONObject jsonObject = JSON.parseObject(obj.toString());
				if (jsonObject != null && !jsonObject.isEmpty()) {
					return JSON.toJavaObject(jsonObject, BpmProcInstAdpt.class);
				} else {
					log.error("流程启动，SDK返回值异常！");
					throw new BpmException("流程启动，SDK返回值异常！");
				}
			} else {
				log.error("流程启动，流程基本信息流程定义和流程KEY值不存在！");
				throw new BpmException("流程启动，流程基本信息流程定义和流程KEY值不存在！");
			}
		} catch (RestException e) {
			log.error("流程启动，SDK异常：", e);
			throw new BpmException("流程启动，SDK异常：", e);
		}
	}

	@Override
	public List<BpmProcInstAdpt> getProcInsts(BpmProcInfo info) throws BpmException {
		List<BpmProcInstAdpt> results = new ArrayList<BpmProcInstAdpt>();

		try {
			if (StringUtils.isNotEmpty(info.getProcKey())) {
				Object obj = this.processService.getRuntimeService().getProcessInstances(this.buildProcInstParam(info));
				JSONObject jsonObj = JSON.parseObject(obj.toString());
				if (jsonObj != null && !jsonObj.isEmpty() && jsonObj.containsKey("data")) {
					JSONArray array = jsonObj.getJSONArray("data");
					if (array != null && array.size() > 0) {
						for (Iterator<Object> iterator = array.iterator(); iterator.hasNext();) {
							JSONObject item = (JSONObject) iterator.next();
							results.add(JSON.toJavaObject(item, BpmProcInstAdpt.class));
						}
					}
				} else {
					log.error("流程实例查询，SDK返回值异常！");
					throw new BpmException("流程实例查询，SDK返回值异常！");
				}
			} else {
				log.error("流程实例查询，流程定义基本信息数据异常，流程定义KEY值不存在！");
				throw new BpmException("流程实例查询，流程定义基本信息数据异常，流程定义KEY值不存在！");
			}
		} catch (RestException e) {
			log.error("流程实例查询，SDK异常：", e);
			throw new BpmException("流程实例查询，SDK异常：", e);
		}
		return results;
	}

	@Override
	public BpmProcInstHistroyAdpt suspendProcInst(String procInstId) throws BpmException {
		try {
			Object obj = this.processService.getRuntimeService().suspendProcessInstance(procInstId);
			JSONObject jsonObj = JSON.parseObject(obj.toString());
			if (jsonObj != null && !jsonObj.isEmpty()) {
				return JSON.toJavaObject(jsonObj, BpmProcInstHistroyAdpt.class);
			} else {
				log.error("流程挂起，SDK返回值异常！");
				throw new BpmException("流程挂起，SDK返回值异常！");
			}
		} catch (RestException e) {
			log.error("流程挂起，SDK异常：", e);
			throw new BpmException("流程挂起，SDK异常：", e);
		}
	}

	@Override
	public BpmProcInstHistroyAdpt activateProcInst(String procInstId) throws BpmException {
		try {
			Object obj = this.processService.getRuntimeService().activateProcessInstance(procInstId);
			JSONObject jsonObj = JSON.parseObject(obj.toString());
			if (jsonObj != null && !jsonObj.isEmpty()) {
				return JSON.toJavaObject(jsonObj, BpmProcInstHistroyAdpt.class);
			} else {
				log.error("流程激活，SDK返回值异常！");
				throw new BpmException("流程激活，SDK返回值异常！");
			}
		} catch (RestException e) {
			log.error("流程激活，SDK异常：", e);
			throw new BpmException("流程激活，SDK异常：", e);
		}
	}

	@Override
	public boolean deleteProcInst(String procInstId) throws BpmException {
		boolean flag = false;
		try {
			flag = this.processService.getRuntimeService().deleteProcessInstance(procInstId);
			if (!flag) {
				log.error("终止流程实例失败！");
			}
		} catch (Exception e) {
			log.error("终止流程实例，SDK异常：", e);
			throw new BpmException("终止流程实例，异常：", e);
		}
		return flag;
	}

	/**
	 * 构造流程示例查询参数
	 * 
	 * @param info
	 * @return
	 */
	private ProcessInstanceParam buildProcInstParam(BpmProcInfo info) {
		ProcessInstanceParam results = new ProcessInstanceParam();

		/*
		 * results.setProcessDefinitionKey(info.getProcKey());
		 * results.setTenantId(CommonUtils.getTenantId());
		 * results.setIncludeProcessVariables(true);
		 */

		return results;
	}

	/**
	 * 构造流程示例启动参数
	 * 
	 * @param info
	 * @param variables
	 * @return
	 */
	private ProcessInstanceStartParam buildProcInstStartParam(BpmProcInfo info, List<RestVariable> variables) {
		ProcessInstanceStartParam results = new ProcessInstanceStartParam();

		results.setProcessDefinitionId(info.getProcDefId());
		results.setProcessDefinitionKey(info.getProcKey());
		if (CollectionUtils.isNotEmpty(variables)) {
			results.setVariables(variables);
		}
		// TODO:
		// results.setAssignInfo(assignInfo);

		// 设置是否返回以前数据
		results.setReturnProcessInstance(true);
		results.setReturnVariables(true);
		results.setReturnHistoricTaskParticipants(true);
		results.setReturnHistoricTasks(true);
		results.setReturnTasks(true);
		results.setReturnTaskParticipants(true);

		return results;
	}

	@Override
	public ObjectNode getProcessInstanceDiagramJson(String processDefinitionId, String processInstanceId)
			throws BpmException {
		ObjectNode obj = null;
		JsonNode nodes = null;

		try {
			nodes = (JsonNode) processService.getRuntimeService().getProcessInstanceDiagramJson(processDefinitionId,
					processInstanceId);
			if (nodes != null && nodes instanceof ObjectNode) {
				obj = (ObjectNode) nodes;
			}
		} catch (RestException e) {
			throw new RuntimeException(e.getMessage(), e);
		}
		return obj;
	}

	@Override
	public ObjectNode getHighlightsProcessInstance(String processInstanceId) throws BpmException {
		ObjectNode obj = null;
		try {
			Object nodes = (JsonNode) processService.getRuntimeService()
					.getHighlightsProcessInstance(processInstanceId);
			if (nodes != null && nodes instanceof ObjectNode) {
				obj = (ObjectNode) nodes;
			}
		} catch (RestException e) {
			throw new RuntimeException(e.getMessage(), e);
		}
		return obj;
	}

}
