/**
 * 在这里添加类的描述
 * 2016-03
 */
package com.yonyou.iuap.bpm.service;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;

import java.util.List;
import java.util.Map;

/**
 * 流程审批核心服务
 * @author shx1
 *
 */
public interface IProcessCoreService {
	
	
	public Map<String, String> startProcess(Object obj, String businessKey, String busiModuleCode)throws BpmException;

	public Map<String, String> startProcess(Map map, String businessKey, String busiModuleCode, String userId)throws BpmException;

	public String start(String processDefinitionKey)throws BpmException;

	/**
	 * 批准
	 * @param pk_user
	 * @param taskid
	 * @param comment
	 * @param restVariables
	 * @return
	 */
	public Object approve(String pk_user, String taskid, String comment, List<BpmRestVariable> restVariables);

	/**
	 * 驳回
	 * @param processInstanceId
	 * @param activityId
	 * @param comment
	 * @param taskid
	 */
	public void reject(String processInstanceId, String activityId, String comment, String taskid);

	/**
	 * 驳回到制单人
	 * @param processInstanceId
	 * @param comment
	 */
	public void rejectToInitActivity(String processInstanceId, String comment);

	/**
	 * 收回
	 * @param taskid
	 * @return
	 */
	public boolean withdraw(String taskid);

	/**
	 * 改派
	 * @param taskId
	 * @param userId
	 */
	public void reassign(String taskId, String userId);
	
}
