package com.yonyou.iuap.bpm.task.service.impl;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;

import com.yonyou.iuap.bpm.service.IdentityService;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.approval.adapter.ProcessService;
import com.yonyou.iuap.bpm.approval.service.impl.TaskResorveService;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.user.WBUser;
import com.yonyou.iuap.bpm.service.user.IWBUserService;
import com.yonyou.iuap.bpm.task.service.IBpmTaskService;

import yonyou.bpm.rest.HistoryService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.exception.RestRequestFailedException;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;

@Service
public class BpmTaskServiceImpl implements IBpmTaskService {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProcessService processService;

	@Autowired
	private TaskResorveService taskResorveService;

	@Autowired
	private IdentityService idenityService;

	@Autowired
	private IWBUserService wbUserService;

	@Value("${cloud.cloudIndentify}")
	private String cloudIndentify;

	@Override
	public Object queryTasksToDo(String userId, int start, int size, String qtype) throws BpmException {
		HistoricTaskQueryParam historyTaskQueryParam = new HistoricTaskQueryParam();
		historyTaskQueryParam.setTaskAssignee(userId);
		historyTaskQueryParam.setFinished(false);
		historyTaskQueryParam.setStart(start);
		historyTaskQueryParam.setSize(size);
		historyTaskQueryParam.setOrder("desc");
		historyTaskQueryParam.setSort("startTime");
		if (StringUtils.isNotBlank(qtype)) {
			historyTaskQueryParam.setTaskCreatedAfter(DateUtil.getDateAfter(qtype));
			historyTaskQueryParam.setTaskCreatedBefore(DateUtil.getDateBefore(qtype));
		}
		// 判断当前使用的的是私有版本还是共有版本 cloudIndentify 为true 表示私有版本，false 表示共有版本
		if (Boolean.valueOf(cloudIndentify)) {
			historyTaskQueryParam.setReturnParticipants(false);
		} else {
			historyTaskQueryParam.setReturnParticipants(true);
		}
		historyTaskQueryParam.setReturnTaskComment(true);
		historyTaskQueryParam.setReturnActivity(true);
		historyTaskQueryParam.setReturnHistoricProcessInstance(true);
		try {
			Object task = getHistoryService().getHistoricTaskInstances(historyTaskQueryParam);
			if (task != null) {
				return task;
			}
		} catch (RestRequestFailedException e) {
			logger.error(e.getMessage(), e);

		} catch (RestException e) {
			logger.error(e.getMessage(), e);
			throw new BpmException("当前环境发生网络拥堵，请稍后再试！");

		}
		return null;
	}

	@Override
	public Object queryTasksHistory(String userId, int start, int size, String qtype) throws BpmException {
		HistoricTaskQueryParam historyTaskQueryParam = new HistoricTaskQueryParam();
		historyTaskQueryParam.setTaskAssignee(userId);
		historyTaskQueryParam.setFinished(true);
		historyTaskQueryParam.setStart(start);
		historyTaskQueryParam.setSize(size);
		historyTaskQueryParam.setOrder("desc");
		historyTaskQueryParam.setSort("startTime");
		historyTaskQueryParam.setTaskCreatedAfter(DateUtil.getDateAfter(qtype));
		historyTaskQueryParam.setTaskCreatedBefore(DateUtil.getDateBefore(qtype));
		// 判断当前使用的的是私有版本还是共有版本 cloudIndentify 为true 表示私有版本，false 表示共有版本
		if (Boolean.valueOf(cloudIndentify)) {
			historyTaskQueryParam.setReturnParticipants(false);
		} else {
			historyTaskQueryParam.setReturnParticipants(true);
		}
		historyTaskQueryParam.setReturnTaskComment(true);
		historyTaskQueryParam.setReturnActivity(true);
		historyTaskQueryParam.setReturnHistoricProcessInstance(true);
		try {
			Object task = getHistoryService().getHistoricTaskInstances(historyTaskQueryParam);
			if (task != null && task instanceof ObjectNode) {
				return task;
			}
		} catch (RestRequestFailedException e) {
			logger.error(e.getMessage(), e);
			throw new RestRequestFailedException("当前环境发生网络拥堵，请稍后再试！");
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
			throw new BpmException("当前环境发生网络拥堵，请稍后再试！");

		}
		return null;
	}

	private HistoryService HistorySerive;

	private HistoryService getHistoryService() {
		if (HistorySerive == null) {
			HistorySerive = processService.getHistoryService();
		}
		return HistorySerive;
	}

	@Override
	public Object getHisTasks(String processInstanceId) {
		if (StringUtils.isBlank(processInstanceId))
			return null;
		HistoricTaskQueryParam historyTaskQueryParam = new HistoricTaskQueryParam();
		historyTaskQueryParam.setProcessInstanceId(processInstanceId);
		historyTaskQueryParam.setFinished(true);
		historyTaskQueryParam.setSort("endTime");
		historyTaskQueryParam.setOrder("asc");
		historyTaskQueryParam.setReturnTaskComment(true);
		historyTaskQueryParam.setReturnParticipants(true);
		historyTaskQueryParam.setReturnActivity(true);
		historyTaskQueryParam.setReturnHistoricProcessInstance(true);
		try {
			Object task = processService.getHistoryService().getHistoricTaskInstances(historyTaskQueryParam);
			if (task != null && task instanceof ObjectNode) {
				ObjectNode objectNode = (ObjectNode) task;
				return objectNode;
			}

		} catch (RestException e) {
			logger.error("读取撤回任务过程中发生异常", e);
		}

		return null;
	}

	public List<ObjectNode> transTask(Object his, Object activitis) {
		ObjectNode hisNode = (ObjectNode) his;
		int hissize = hisNode.get("size").asInt();
		List<ObjectNode> hisList = new LinkedList<ObjectNode>();
		if (hissize > 0) {
			Object hisdata = hisNode.get("data");
			if (hisdata instanceof ArrayNode && ((ArrayNode) hisdata).size() > 0) {
				JsonNode jsonNode = ((ArrayNode) hisdata).get(0);
				if (jsonNode.get("processDefinitionId") != null) {
					// String processDefinitionId = jsonNode.get("processDefinitionId").asText();
					taskResorveService.resorveTaskAuditType((ArrayNode) hisdata, (ArrayNode) activitis);
				}

				ArrayNode hisArray = (ArrayNode) hisdata;
				for (int i = 0; i < hissize; i++) {
					ObjectNode node = (ObjectNode) hisArray.get(i);
					if (node.get("deleteReason") != null) {
						String deleteReason = node.get("deleteReason").asText();
						if ("delete".equals(deleteReason))
							continue;
					}
					if (node.get("assignee") != null) {
						String assignee = node.get("assignee").asText();
						if (StringUtils.isNotBlank(assignee)) {
							String username = "";
							// 判断当前使用的的是私有版本还是共有版本 cloudIndentify 为true 表示私有版本，false 表示共有版本
							if (Boolean.valueOf(cloudIndentify)) {
								WBUser queryUser = wbUserService.queryUser(assignee);
								if (queryUser != null) {
									username = queryUser.getName();
								}
							} else {
								username = idenityService.queryUserName(assignee);
							}
							node.put("username", username);
						}
					}
					hisList.add(node);
				}
			}
		}
		return hisList;
	}

	@Override
	public Object getCurTask(String pk_procdefins) {
		TaskQueryParam taskQueryParam = new TaskQueryParam();
		taskQueryParam.setProcessInstanceId(pk_procdefins);
		taskQueryParam.setIncludeTaskLocalVariables(true);
		taskQueryParam.setReturnActivity(true);
		taskQueryParam.setReturnProcessInstance(true);
		Object task = null;
		try {
			task = processService.getTaskService().queryTasks(taskQueryParam);
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
		}
		return task;
	}

	@Override
	public String getWithdrawTask(String pk_user, String pk_procdefins) {
		HistoricTaskQueryParam historyTaskQueryParam = new HistoricTaskQueryParam();
		historyTaskQueryParam.setProcessInstanceId(pk_procdefins);
		historyTaskQueryParam.setSort("endTime");
		historyTaskQueryParam.setOrder("desc");
		historyTaskQueryParam.setTaskAssignee(pk_user);
		historyTaskQueryParam.setFinished(true);
		String daawtaskid = null;
		// 2016-03-08T09:31:18.689+08:00
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss.SSS", Locale.CHINESE);
		Date lastEndTime = null;
		try {
			Object task = processService.getHistoryService().getHistoricTaskInstances(historyTaskQueryParam);
			if (task != null && task instanceof ObjectNode) {
				ObjectNode objectNode = (ObjectNode) task;
				Object array = objectNode.get("data");
				if (array instanceof ArrayNode) {
					ArrayNode arrayNode = (ArrayNode) array;
					if (arrayNode.size() > 0) {
						int size = arrayNode.size();
						for (int i = 0; i < size; i++) {
							JsonNode jsonNode = arrayNode.get(i);
							if (jsonNode != null) {
								Object deleteReason = objectNode.findValues("deleteReason");
								if (deleteReason != null && deleteReason.toString().equals("[\"withdraw\"]"))
									continue;
								if (deleteReason != null && deleteReason.toString().indexOf("reject") != -1)
									continue;
								if (jsonNode.get("endTime") != null) {
									String endTime = jsonNode.get("endTime").asText();
									if (StringUtils.isNotBlank(endTime) && !"null".equals(endTime)) {
										endTime = endTime.replace("T", " ").substring(0, endTime.length() - 6);
										Date endTimeDatatime = dateFormat.parse(endTime);
										if (lastEndTime == null || endTimeDatatime.after(lastEndTime)) {
											if (jsonNode.get("id") != null)
												daawtaskid = jsonNode.get("id").asText();
											lastEndTime = endTimeDatatime;
										}
									}
								}

							}
						}
					}
				}
			}
		} catch (RestException | ParseException e) {
			logger.error("读取撤回任务过程中发生异常", e);
		}
		return daawtaskid;
	}

	@Override
	public Object rejectCheck(String taskid) {
		Object obj = null;
		try {
			obj = processService.getTaskService().rejectCheck(taskid);
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
		}
		return obj;
	}

	@Override
	public WBUser getWBUserByprocessInstanceId(String processInstanceId) {
		HistoryService historyService = getHistoryService();
		WBUser wbUser = null;
		try {
			Object historicProcessInstance = historyService.getHistoricProcessInstance(processInstanceId);
			System.out.println(historicProcessInstance);
			JsonNode jsonNode = (JsonNode) historicProcessInstance;
			String startUserId = jsonNode.get("startUserId").asText();
			wbUser = wbUserService.queryUser(startUserId);

		} catch (RestException e) {
			logger.error("根据流程实例id查询发起人时出错", e);
		}
		return wbUser;
	}

}
