package com.yonyou.iuap.bpm.task.service;

import java.util.List;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.user.WBUser;

public interface IBpmTaskService {

	/**
	 * 查询待办任务
	 * @param userId
	 * @param start
	 * @param size
	 * @param qtype(day,week,month)
	 * @return
	 * @throws BpmException
	 */
	public Object queryTasksToDo(String userId, int start, int size, String qtype) throws BpmException;

	/**
	 * 查询已办任务
	 * @param userId
	 * @param start
	 * @param size
	 * @param qtype(day,week,month)
	 * @return
	 * @throws BpmException
	 */
	public Object queryTasksHistory(String userId, int start, int size, String qtype) throws BpmException;

	/**
	 * 根据流程实例Id查询流程历史
	 * @param processInstanceId
	 * @return
	 */
	public Object getHisTasks(String processInstanceId);

	public List<ObjectNode> transTask(Object his,Object activitis);
	
	/**
	 * 根据流程实例Id获取当前任务
	 * @param processInstanceId
	 * @return
	 */
	public Object getCurTask(String processInstanceId);
	
	/**
	 * 根据用户id和流程实例Id获取可收回
	 * @param pk_user
	 * @param processInstanceId
	 * @return
	 */
	public String getWithdrawTask(String pk_user,String processInstanceId);

	/**
	 * 驳回
	 * @param taskid
	 * @return
	 */
	public Object rejectCheck(String taskid);
	
	/**
	 * 根据流程实例ID 获取发起人
	 * @param processInstanceId
	 * @return
	 */
	public WBUser  getWBUserByprocessInstanceId(String processInstanceId);

}
