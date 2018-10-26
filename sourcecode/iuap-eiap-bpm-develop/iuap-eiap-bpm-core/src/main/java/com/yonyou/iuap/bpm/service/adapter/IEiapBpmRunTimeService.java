package com.yonyou.iuap.bpm.service.adapter;

import java.util.List;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.adpt.BpmProcInstAdpt;
import com.yonyou.iuap.bpm.entity.adpt.insthistory.BpmProcInstHistroyAdpt;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;

import yonyou.bpm.rest.request.RestVariable;

/**
 * 流程运行时接口
 * 
 * @author zhh
 *
 */
public interface IEiapBpmRunTimeService {

	/**
	 * 根据流程定义的KEY值启动流程
	 * 
	 * @param processKey
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInstAdpt startProcess(BpmProcInfo info) throws BpmException;

	/**
	 * 根据流程定义KEY值和表单参数启动流程
	 * 
	 * @param info
	 * @param varibles
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInstAdpt startProcess(BpmProcInfo info, List<RestVariable> varibles) throws BpmException;

	/**
	 * 获取流程实例查询
	 * 
	 * @param info
	 * @return
	 * @throws BpmException
	 */
	public List<BpmProcInstAdpt> getProcInsts(BpmProcInfo info) throws BpmException;

	/**
	 * 挂起流程实例
	 * 
	 * @param procInstId
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInstHistroyAdpt suspendProcInst(String procInstId) throws BpmException;

	/**
	 * 恢复流程实例
	 * 
	 * @param procInstId
	 * @return
	 * @throws BpmException
	 */
	public BpmProcInstHistroyAdpt activateProcInst(String procInstId) throws BpmException;

	/**
	 * 终止流程实例
	 * 
	 * @param procInstId
	 * @return
	 * @throws BpmException
	 */
	public boolean deleteProcInst(String procInstId) throws BpmException;

	public ObjectNode getProcessInstanceDiagramJson(String processDefinitionId, String processInstanceId)
			throws BpmException;

	public ObjectNode getHighlightsProcessInstance(String processInstanceId) throws BpmException;
}
