package com.yonyou.iuap.bpm.service;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;

import java.util.Map;

public interface IBpmRuntimeService {

	/**
	 * 查询流程历史任务和当前任务
	 * @param processInstanceId
	 * @param processDefinitionId
	 * @return
	 */
	public Map<String, Object> loadAllBpmInfo(String processInstanceId, String processDefinitionId) throws BpmException;	
	
	/**
	 * 查询可驳回环节
	 * @param taskid
	 * @return
	 */
	public Object getRejectActivities(String taskid);
}
