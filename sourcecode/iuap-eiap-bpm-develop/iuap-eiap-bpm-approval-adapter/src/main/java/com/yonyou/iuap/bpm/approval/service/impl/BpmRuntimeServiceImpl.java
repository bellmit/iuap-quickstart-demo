package com.yonyou.iuap.bpm.approval.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.yonyou.iuap.bpm.service.IActionQuery;
import com.yonyou.iuap.bpm.service.IBpmRuntimeService;
import com.yonyou.iuap.bpm.service.IProcessDefinitionQueryService;
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
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.user.WBUser;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;
import com.yonyou.iuap.bpm.service.user.IWBUserService;
import com.yonyou.iuap.bpm.task.service.IBpmTaskService;
import com.yonyou.iuap.context.InvocationInfoProxy;

@Service
public class BpmRuntimeServiceImpl implements IBpmRuntimeService {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProcessService processService;

	@Autowired
	private IBpmTaskService iTaskQueryService;

	@Autowired
	private IProcessDefinitionQueryService iProcessDefinitionQueryService;

	@Autowired
	private IdentityService idenityService;

	@Autowired
	private IActionQuery iActionQuery;
	
	@Autowired
	private IWBUserService wbUserService;

	@Autowired
	private UserMappingService eiapBpmUserMappingService;
	
	@Value("${cloud.cloudIndentify}")
	private String  cloudIndentify;

	@Override
	public Map<String, Object> loadAllBpmInfo(String processInstanceId, String processDefinitionId)
			throws BpmException {
		if (StringUtils.isBlank(processInstanceId))
			return null;
		Object his = iTaskQueryService.getHisTasks(processInstanceId);
		Object activitis = null;
		try {
			activitis = iProcessDefinitionQueryService.getAllActivitis(processDefinitionId);
		} catch (BpmException e) {
			logger.error(e.getMessage(), e);
		}

		List<ObjectNode> hisList = null;
		if (his != null)
			hisList = iTaskQueryService.transTask(his, activitis);
		Map<String, Object> todo = getResult(hisList, processInstanceId, (ArrayNode) activitis);
		return todo;
	}

	private Map<String, Object> getResult(List<ObjectNode> hisList, String pk_procdefins, ArrayNode activitis)
			throws BpmException {
		Map<String, Object> result = new HashMap<String, Object>();
		String createTime = null;
		result.put("history_task", hisList);
		String localUserId = InvocationInfoProxy.getUserid();
		String userid = null;
		try {
			//判断当前使用的的是私有版本还是共有版本  cloudIndentify 为true 表示私有版本，false 表示共有版本
			if (Boolean.valueOf(cloudIndentify)) {
				userid=localUserId;
			}else {
				userid = eiapBpmUserMappingService.findUseridByLocalUserId(localUserId);
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new BpmException("用户数据不存在，可能是还未同步", e);
		}
		Map<String, String> usermap = new HashMap<String, String>();
		if (hisList != null && hisList.size() > 0) {
			for (int i = hisList.size() - 1; i >= 0; i--) {
				ObjectNode obj = hisList.get(i);

				if (i == hisList.size() - 1) {
					JsonNode t = obj.get("endTime");
					if (t != null)
						createTime = t.asText();
				}

				if (obj != null && StringUtils.isNotBlank(userid)
						&& userid.equals(obj.get("assignee").asText().replaceAll("\"", ""))) {
					JsonNode o = obj.get("activity");
					if (o != null) {
						Object aid = o.get("id");
						if (aid != null) {
							result.put("userlastactivity", String.valueOf(aid).replaceAll("\"", ""));
							break;
						}
					}
				}
			}

		}

		List<Object> todo_userList = new LinkedList<Object>();
		Map<String, Object> todo_actionMap = new HashMap<String, Object>();
		List<Map<String, String>> todo_actionsList = new LinkedList<Map<String, String>>();
		Object tasks = iTaskQueryService.getCurTask(pk_procdefins);
		boolean hastask = false;
		if (tasks != null && tasks instanceof JsonNode) {
			Object tasksdata = ((JsonNode) tasks).get("data");
			if (tasksdata != null && tasksdata instanceof ArrayNode) {
				ArrayNode array = (ArrayNode) tasksdata;
				for (int j = 0; j < array.size(); j++) {
					Map<String, String> todo_user = new HashMap<String, String>();
					JsonNode json = array.get(j);
					String tid = json.get("id").asText();
					String pk_user = json.get("assignee").asText();
					if (StringUtils.isNotBlank(pk_user)) {
						if (pk_user.equals(userid)) {
							hastask = true;
							todo_actionMap.put("pk_workflownote", tid);
							todo_actionsList = iActionQuery.getActionsList((ObjectNode) json);
							todo_actionMap.put("showCheckNote", "Y");
							JsonNode activity = json.get("activity");
							if (json.get("createTime") != null)
								createTime = json.get("createTime").asText();
							if (activity != null) {
								Object ac = activity.get("id");
								if (ac != null) {
									String activityid = ((JsonNode) ac).asText();// 当前环节
									if (hisList == null || hisList.size() == 0) {
										String aid = null;
										JsonNode acNode = activitis.get(0);
										if (acNode.get("id") != null) {
											aid = acNode.get("id").asText();
										}
										if (activityid.equals(aid))
											result.put("isfirstAc", "Y");
									}

									result.put("activityid", activityid);
								}
							}
						}
						String name = usermap.get(pk_user);
						if (StringUtils.isBlank(name))
							// 判断当前使用的的是私有版本还是共有版本 cloudIndentify 为true 表示私有版本，false 表示共有版本
							if (Boolean.valueOf(cloudIndentify)) {
								name = wbUserService.queryUser(pk_user).getName();
							} else {
								name = idenityService.queryUserName(pk_user);
							}
						todo_user.put("name", name);
						todo_userList.add(todo_user);
					}
				}

			}
			todo_actionMap.put("actions", todo_actionsList);
			result.put("todo_users", todo_userList);
			result.put("todo_action_info", todo_actionMap);
		}

		if (!hastask && todo_userList.size() != 0) {
			// 当前没任务，可收回
			String taskdrawid = iTaskQueryService.getWithdrawTask(userid, pk_procdefins);
			if (StringUtils.isNotBlank(taskdrawid)) {
				Map<String, String> todo_action = new HashMap<String, String>();
				todo_action.put("action_code", "recall");
				todo_action.put("taskdrawid", taskdrawid);
				todo_actionsList.add(todo_action);
				todo_actionMap.put("isrecall", "Y");
				result.put("hasnottask", true);
			} else
				result.put("hasnottask", false);
		} else {
			result.put("hasnottask", false);
		}
//		String currentUserName = idenityService.queryUserName(userid);
		WBUser queryUser = wbUserService.queryUser(userid);
		result.put("currentUserName", queryUser.getName());
		if (createTime != null) {
			result.put("wait_time", getWaitTime(createTime));
			result.put("createTime", createTime);
		} else
			result.put("wait_time", 0);
		return result;
	}

	private long getWaitTime(String createTime) {

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
		try {
			Date date = format.parse(createTime);
			long timeStart = date.getTime();
			long now = System.currentTimeMillis();
			long minuteCount = now - timeStart;
			long minute = minuteCount / 1000 / 60;
			return minute;
		} catch (ParseException e) {
			logger.error(e.getMessage(), e);
		}
		return 0;
	}

	/**
	 * 查询可驳回环节
	 * @param taskid
	 * @return
	 */
	@Override
	public Object getRejectActivities(String taskid){
		try {
			Object o = iTaskQueryService.rejectCheck(taskid);
			if(o!=null){
				ObjectNode objectNode = (ObjectNode)o;
				return objectNode;			
			}
		}catch(Exception e){
			logger.error("读取撤回任务过程中发生异常"+e.getMessage(),e);
		}
		return null;
	}

}
