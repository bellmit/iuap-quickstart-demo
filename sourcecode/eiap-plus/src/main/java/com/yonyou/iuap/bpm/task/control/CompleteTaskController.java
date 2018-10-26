package com.yonyou.iuap.bpm.task.control;

import com.yonyou.iuap.i18n.MessageSourceUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.base.utils.RestUtils;
import com.yonyou.iuap.bpm.service.NotifyService;
import com.yonyou.iuap.bpm.util.BPMUtil;
import com.yonyou.iuap.bpm.util.TaskMesTempCodeConstants;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.iweb.exception.WebRuntimeException;
import com.yonyou.iuap.mvc.type.JsonResponse;
import com.yonyou.iuap.utils.PropertyUtil;
import com.yonyou.uap.wb.entity.management.WBUser;
import com.yonyou.uap.wb.sdk.UserRest;

import yonyou.bpm.rest.HistoryService;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.exception.RestRequestFailedException;
import yonyou.bpm.rest.request.AssignCheckParam;
import yonyou.bpm.rest.request.Participant;
import yonyou.bpm.rest.request.RestVariable;
import yonyou.bpm.rest.request.historic.HistoricVariableQueryParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.request.task.TaskResourceParam;
import yonyou.bpm.rest.response.historic.HistoricProcessInstanceResponse;
import yonyou.bpm.rest.response.historic.HistoricTaskInstanceResponse;
import yonyou.bpm.rest.response.runtime.process.AssignInfoItemResponse;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;
import yonyou.bpm.rest.utils.BaseUtils;

@Controller
@RequestMapping(value = "task/completetask/")
public class CompleteTaskController extends BpmBaseController {

	private final BPMUtil bPMUtil = BPMUtil.getInstance();

	private String msg = null;

	private String[] jsonKey = { "flag", "msg" };

	private long startApproveTime = 0;

	/**
	 * 打开单据后审批动作
	 *
	 * @param data
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/approveCard", method = RequestMethod.POST)
	@ResponseBody
	public Object approveCard(@RequestBody Map<String, Object> data, HttpServletRequest request,
							  HttpServletResponse response) {
		// 参数处理
		eval(data);
		//
		if (taskId == null || "".equals(taskId.trim())) {
			msg = MessageSourceUtil.getMessage("ja.tas.con2.0002", "调用流程审批错误:未传入任务!");
			logger.error(msg);
			return bildResultMessage(jsonKey, new String[] { "faile", msg });
		}
		startApproveTime = System.currentTimeMillis();

		//调用审批
		return approve(data, userId);
	}

	/**
	 * 打开单据后具体审批
	 *
	 * @param data
	 * @param userId
	 * @return
	 */
	private JSONObject approve(Map<String, Object> data, String userId) {
		// 得到流程实例参数
		// 制单人同组织，要校验传的组织，如果没有，则找制单人的组织
		Map<String, Object> varMap = getProcinstVaries(processInstanceId);
		String orgId = varMap.get("orgId") == null ? "" : varMap.get("orgId").toString();
		// 判断是否指派
		AssignCheckParam paramAssignCheckParam = new AssignCheckParam();
		paramAssignCheckParam.setTaskId(taskId);
		JsonNode assignCheckResult = null;
		try {
			assignCheckResult = (JsonNode) bpmService.bpmRestServices(userId, orgId).getRuntimeService()
					.assignCheck(paramAssignCheckParam);
		} catch (Exception e) {
			msg = MessageSourceUtil.getMessage("ja.tas.con2.0003", "调用流程审批报错!");
			logger.error(msg, e.getMessage());
			return bildResultMessage(jsonKey, new String[] { "faile", e.getMessage() });
		}
		// 如果有指派，则正常走，否则异常，就走正常的审批
		JsonNode assignInfoJsonNode = assignCheckResult.get("assignInfo");
		return checkAssign(data, userId, assignInfoJsonNode, assignCheckResult);
	}

	/***
	 * 校验指派
	 *
	 * @param data
	 * @param userId
	 * @param assignInfoJsonNode
	 * @param assignCheckResult
	 * @return
	 */
	private JSONObject checkAssign(Map<String, Object> data, String userId, JsonNode assignInfoJsonNode,
								   JsonNode assignCheckResult) {
		boolean assignAble;
		if (assignInfoJsonNode == null
				|| (assignCheckResult != null && !assignCheckResult.get("assignAble").booleanValue())) {// 没有指派走正常审批
			return naturalApprove(data, userId);
		}
		ArrayNode assignlist = (ArrayNode) assignInfoJsonNode.get("assignInfoItems");
		if (assignlist == null) {// 没有指派走正常审批
			return naturalApprove(data, userId);
		}
		List<AssignInfoItemResponse> list = new ArrayList<AssignInfoItemResponse>();
		for (int i = 0; i < assignlist.size(); i++) {
			JsonNode jn = assignlist.get(i);
			// 反序列号对象
			AssignInfoItemResponse assignInfo = jsonResultService.toObject(jn.toString(), AssignInfoItemResponse.class);
			buildAssginInfoForFillUserInfo(assignInfo);
			list.add(assignInfo);
		}
		assignAble=assignCheckResult!=null&&assignCheckResult.get("assignAble")!=null?assignCheckResult.get("assignAble").booleanValue():false;
		return bildResultMessage(new String[] { "assignAble", "assignList" },
				new Object[] { assignAble, list });
	}

	/**
	 * 查询UserRest 将userId转化为user信息
	 *
	 * @param assignInfo
	 */
	private void buildAssginInfoForFillUserInfo(AssignInfoItemResponse assignInfo) {
		Participant[] participants = assignInfo.getParticipants();
		if (participants != null && participants.length > 0) {
			List<String> ids = new ArrayList<String>();
			for (Participant participant : participants) {
				ids.add(participant.getId());
			}
			Map<String, String> queryParams = new HashMap<String, String>();
			Map<String, String> postParams = new HashMap<String, String>();
			queryParams.put("tenantId", InvocationInfoProxy.getTenantid());
			postParams.put("userIds", JSONArray.toJSONString(ids));
			try {
				JSONObject jsonObject = UserRest.getByIds(queryParams, postParams);
				JSONArray ls = jsonObject.getJSONArray("data");
				Participant[] newParticipant = new Participant[participants.length];
				for (int i = 0; i < ls.size(); i++) {
					WBUser user = ls.getObject(i, WBUser.class);
					newParticipant[i] = new Participant(user.getId(), user.getLoginName(), user.getName());
				}
				assignInfo.setParticipants(newParticipant);
			} catch (Exception e) {
				logger.error("查询用户错误", e);
			}
		}
	}

	/**
	 * 正常审批
	 *
	 * @param data
	 * @param userId
	 * @return
	 */
	private JSONObject naturalApprove(Map<String, Object> data, String userId) {
		// 抄送
		copyToUsers();
		logger.debug("转正常审批,正常审批开始");
		// 添加审批类型
		TaskResourceParam taskParam = new TaskResourceParam();
		Object taskUpdateResult = null;
		Object approveResult = null;
		JsonNode historicProcessInstanceNode = null;
		taskParam.setDescription(approvetype);
		String hisTitle = "";

		// 流程变量
		try {
			HistoricVariableQueryParam historicVariableQueryParam = new HistoricVariableQueryParam();
			historicVariableQueryParam.setProcessInstanceId(processInstanceId);
			historicVariableQueryParam.setVariableName("title");
			JsonNode titleNode = (JsonNode) historyService.getHistoricVariableInstances(historicVariableQueryParam);
			ArrayNode nodes = BaseUtils.getData(titleNode);
			hisTitle = nodes.get(0).get("variable").get("value").textValue();
		} catch (Exception e) {
			logger.error("查询流程变量失败", e);
			logger.debug("查询：{} 流程变量失败 ", hisTitle);
		}

		// 审批
		try {
			// 添加审批类型
			List<RestVariable> variables = new ArrayList<RestVariable>();
			RestVariable approveVari = new RestVariable();
			approveVari.setName("approvetype");
			approveVari.setValue(approvetype);
			variables.add(approveVari);
			taskUpdateResult = taskService.updateTask(taskId, taskParam);
			logger.debug(JSONObject.toJSONString(taskUpdateResult));
			approveResult = taskService.completeWithComment(taskId, variables, null, null, comment);
			long endApproveTime = System.currentTimeMillis();
			logger.error("调用流程审批的时间为: " + (endApproveTime - startApproveTime) + " 毫秒!");
			logger.debug("审批结果：{}", JSONObject.toJSONString(approveResult));
			// 检查流程是否走完，走完进行状态回写。
			historicProcessInstanceNode = (JsonNode) historyService.getHistoricProcessInstance(processInstanceId);
		} catch (RestRequestFailedException e) {
			msg = e.getMessage();
			return bildResultMessage(jsonKey, new String[] { "faile", msg });
		} catch (RestException e) {
			msg =  e.getMessage();
			logger.error(msg, e.getMessage());
			return bildResultMessage(jsonKey, new String[] { "faile", msg });
		}
		// 流程回调业务
		callbackProcess(approvetype, processInstanceId, historicProcessInstanceNode,CALLBACK_MAPING_APPROVE);

		// 反序列号
		jsonResultService.toObject(historicProcessInstanceNode.toString(), HistoricProcessInstanceResponse.class);
		sendMessageForNextActiOrProcessEnd();
		// return message(data, userId);
		return bildResultMessage(jsonKey, new String[] { "success", MessageSourceUtil.getMessage("ja.tas.con2.0011", "审批成功!") });
	}



	/**
	 * 单个审批过程。不包含有指派的审批
	 */
	private String singleApprove(String taskId, String approvetype, String processInstanceId, String userId,
								 String comment) {
		if (taskId == null || "".equals(taskId.trim())) {
			throw new WebRuntimeException(MessageSourceUtil.getMessage("ja.tas.con2.0012", "未传入任务！"));
		}
		Map<String, Object> varMap = getProcinstVaries(processInstanceId);
		try {
			long t1 = System.currentTimeMillis();
			// 添加审批类型
			TaskResourceParam taskParam = new TaskResourceParam();
			taskParam.setDescription(approvetype);
			taskService.updateTask(taskId, taskParam);
			// 完成任务
			taskService.completeWithComment(taskId, null, null, null, comment);
			JsonNode historicProcessInstanceNode = (JsonNode) historyService
					.getHistoricProcessInstance(processInstanceId);
			// 审批之后的业务处理
			String controlURL = (String) varMap.get("serviceClass");// getServiceClass(params);
			String url = controlURL + "/doApprove";
			url = PropertyUtil.getPropertyByKey("base.url") + url;
			JSONObject requestBody = new JSONObject();
			requestBody.put("approvetype", approvetype);
			requestBody.put("historicProcessInstanceNode", historicProcessInstanceNode);
			JsonResponse response = RestUtils.getInstance().doPost(url, requestBody, JsonResponse.class);
			if (!response.getSuccess().equalsIgnoreCase("SUCCESS")) {
				throw new Exception("form doApprove fail");
			}
			long t2 = System.currentTimeMillis();
			logger.error(MessageSourceUtil.getMessage("ja.tas.con2.0008", "调用流程审批的时间为:") + (t2 - t1) + MessageSourceUtil.getMessage("ja.tas.con2.0009", "毫秒!"));
			return null;
		} catch (RestException e) {
			logger.error(e.getMessage());
			return e.getMessage();
		} catch (Exception e) {

			return e.getMessage();
		}
	}

	/**
	 * 批量审批
	 */
	@RequestMapping(value = "/approveSubmit", method = RequestMethod.POST)
	@ResponseBody
	public Object batchAprrove(@RequestBody Map<String, Object> data) {
		JSONObject json = new JSONObject();
		String comment = String.valueOf(data.get("comment"));
		String approvetype = (String) data.get("approvetype");
		// 如何没有选同意不同意,默认为同意
		if (StringUtils.isBlank(approvetype)) {
			approvetype = "agree";
		}
		List<Map<String, String>> taskList = (List<Map<String, String>>) data.get("taskList");
		String userId = InvocationInfoProxy.getUserid();
		StringBuffer msg = new StringBuffer();
		String flag = "success";
		for (Map<String, String> task : taskList) {
			String taskId = task.get("id");
			String processInstanceId = task.get("processInstanceId");
			if (isNeedAssign(taskId, userId)) {
				msg.append(task.get("name") + MessageSourceUtil.getMessage("ja.tas.con2.0013", "审批失败-已指派其他审批！"));
				flag = "fail";
				continue;
			}
			if (isAddSign(taskId, userId)) {
				msg.append(task.get("name") + MessageSourceUtil.getMessage("ja.tas.con2.0014", "审批失败-等待加签人审批！"));
				flag = "fail";
				continue;
			}
			String message = singleApprove(taskId, approvetype, processInstanceId, userId, comment);
			if (message != null) {
				msg.append(task.get("name") + MessageSourceUtil.getMessage("ja.tas.con2.0015", "审批失败-") + message);
				flag = "fail";
				continue;
			}
		}
		json.put("flag", flag);
		json.put("msg", msg.toString());
		return json;
	}

	/**
	 * 判断是否需要指派
	 *
	 * @return
	 */
	private boolean isNeedAssign(String taskId, String userId) {
		AssignCheckParam paramAssignCheckParam = new AssignCheckParam();
		paramAssignCheckParam.setTaskId(taskId);

		try {
			JsonNode sss = (JsonNode) bpmService.bpmRestServices(userId).getRuntimeService()
					.assignCheck(paramAssignCheckParam);
			if (sss == null || sss.get("assignInfo") == null || sss.get("assignInfo") instanceof NullNode) {
				return false;
			}
			ArrayNode assignlist = (ArrayNode) sss.get("assignInfo").get("assignInfoItems");
			AssignInfoItemResponse assignInfo = jsonResultService.toObject(assignlist.get(0).toString(),
					AssignInfoItemResponse.class);
			Participant[] Participants = assignInfo.getParticipants();
			// 单个子流程不指派
			if (assignlist.size() < 0 || (assignlist.size() == 1 && Participants == null)) {
				return false;
			} else {
				return true;
			}
		} catch (Exception e) {
			logger.error(MessageSourceUtil.getMessage("ja.tas.con2.0016", "指派报错!"), e);
			return false;
		}
	}

	/**
	 * 判断是否加签
	 *
	 * @return
	 */
	private boolean isAddSign(String taskId, String userId) {
		HistoryService historyService = bpmService.bpmRestServices(userId).getHistoryService();// 历史服务
		String value = bPMUtil.getTaskVariablesValue(historyService, jsonResultService, taskId, "counterSigning")
				.toString();
		if ("true".equalsIgnoreCase(value)) {
			return true;
		} else {
			return false;
		}

	}

	/***
	 * 弃审
	 */
	private boolean withdraw(String userId, String taskId) {
		TaskService taskService = bpmService.bpmRestServices(userId).getTaskService();
		try {
			taskService.withdrawTask(taskId);
			TaskResourceParam taskParam = new TaskResourceParam();
			taskParam.setDescription(MessageSourceUtil.getMessage("ja.tas.con2.0017", "系统撤回"));
			taskService.updateTask(taskId, taskParam);
		} catch (Exception e) {
			logger.error(MessageSourceUtil.getMessage("ja.tas.con2.0018", "系统撤回失败"), e.getMessage());
			return false;
		}
		return true;
	}

	public JSONObject bildResultMessage(String[] key, Object[] value) {
		JSONObject js = new JSONObject();
		if (key == null || value == null || key.length != value.length) {
			return js;
		}
		for (int i = 0; i < key.length; i++) {
			js.put(key[i], value[i]);
		}
		return js;
	}

}
