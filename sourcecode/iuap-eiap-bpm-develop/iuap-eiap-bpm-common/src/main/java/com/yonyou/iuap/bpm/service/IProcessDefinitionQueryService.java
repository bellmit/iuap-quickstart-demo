package com.yonyou.iuap.bpm.service;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;

public interface IProcessDefinitionQueryService {

	/**
	 * 截取流程定义Id
	 * @param processDefinitionId
	 * @return
	 */
	public String getProcessDefinitionKeyById(String processDefinitionId);

	/**
	 * 
	 * @param processDefinitionId
	 * @return
	 * @throws BpmException
	 */
	public Object getAllActivitis(String processDefinitionId)throws BpmException;

	/**
	 * 
	 * @param processDefinitionKey
	 * @return
	 * @throws BpmException
	 */
	public String getLastProcessDefinitionByKey(String processDefinitionKey)throws BpmException;

}
