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
	 * ???????????????????????????
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
		// ????????????
		eval(data);
		//
		if (taskId == null || "".equals(taskId.trim())) {
			msg = MessageSourceUtil.getMessage("ja.tas.con2.0002", "????????????????????????:???????????????!");
			logger.error(msg);
			return bildResultMessage(jsonKey, new String[] { "faile", msg });
		}
		startApproveTime = System.currentTimeMillis();

		//????????????
		return approve(data, userId);
	}

	/**
	 * ???????????????????????????
	 *
	 * @param data
	 * @param userId
	 * @return
	 */
	private JSONObject approve(Map<String, Object> data, String userId) {
		// ????????????????????????
		// ????????????????????????????????????????????????????????????????????????????????????
		Map<String, Object> varMap = getProcinstVaries(processInstanceId);
		String orgId = varMap.get("orgId") == null ? "" : varMap.get("orgId").toString();
		// ??????????????????
		AssignCheckParam paramAssignCheckParam = new AssignCheckParam();
		paramAssignCheckParam.setTaskId(taskId);
		JsonNode assignCheckResult = null;
		try {
			assignCheckResult = (JsonNode) bpmService.bpmRestServices(userId, orgId).getRuntimeService()
					.assignCheck(paramAssignCheckParam);
		} catch (Exception e) {
			msg = MessageSourceUtil.getMessage("ja.tas.con2.0003", "????????????????????????!");
			logger.error(msg, e.getMessage());
			return bildResultMessage(jsonKey, new String[] { "faile", e.getMessage() });
		}
		// ?????????????????????????????????????????????????????????????????????
		JsonNode assignInfoJsonNode = assignCheckResult.get("assignInfo");
		return checkAssign(data, userId, assignInfoJsonNode, assignCheckResult);
	}

	/***
	 * ????????????
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
				|| (assignCheckResult != null && !assignCheckResult.get("assignAble").booleanValue())) {// ???????????????????????????
			return naturalApprove(data, userId);
		}
		ArrayNode assignlist = (ArrayNode) assignInfoJsonNode.get("assignInfoItems");
		if (assignlist == null) {// ???????????????????????????
			return naturalApprove(data, userId);
		}
		List<AssignInfoItemResponse> list = new ArrayList<AssignInfoItemResponse>();
		for (int i = 0; i < assignlist.size(); i++) {
			JsonNode jn = assignlist.get(i);
			// ??????????????????
			AssignInfoItemResponse assignInfo = jsonResultService.toObject(jn.toString(), AssignInfoItemResponse.class);
			buildAssginInfoForFillUserInfo(assignInfo);
			list.add(assignInfo);
		}
		assignAble=assignCheckResult!=null&&assignCheckResult.get("assignAble")!=null?assignCheckResult.get("assignAble").booleanValue():false;
		return bildResultMessage(new String[] { "assignAble", "assignList" },
				new Object[] { assignAble, list });
	}

	/**
	 * ??????UserRest ???userId?????????user??????
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
				logger.error("??????????????????", e);
			}
		}
	}

	/**
	 * ????????????
	 *
	 * @param data
	 * @param userId
	 * @return
	 */
	private JSONObject naturalApprove(Map<String, Object> data, String userId) {
		// ??????
		copyToUsers();
		logger.debug("???????????????,??????????????????");
		// ??????????????????
		TaskResourceParam taskParam = new TaskResourceParam();
		Object taskUpdateResult = null;
		Object approveResult = null;
		JsonNode historicProcessInstanceNode = null;
		taskParam.setDescription(approvetype);
		String hisTitle = "";

		// ????????????
		try {
			HistoricVariableQueryParam historicVariableQueryParam = new HistoricVariableQueryParam();
			historicVariableQueryParam.setProcessInstanceId(processInstanceId);
			historicVariableQueryParam.setVariableName("title");
			JsonNode titleNode = (JsonNode) historyService.getHistoricVariableInstances(historicVariableQueryParam);
			ArrayNode nodes = BaseUtils.getData(titleNode);
			hisTitle = nodes.get(0).get("variable").get("value").textValue();
		} catch (Exception e) {
			logger.error("????????????????????????", e);
			logger.debug("?????????{} ?????????????????? ", hisTitle);
		}

		// ??????
		try {
			// ??????????????????
			List<RestVariable> variables = new ArrayList<RestVariable>();
			RestVariable approveVari = new RestVariable();
			approveVari.setName("approvetype");
			approveVari.setValue(approvetype);
			variables.add(approveVari);
			taskUpdateResult = taskService.updateTask(taskId, taskParam);
			logger.debug(JSONObject.toJSONString(taskUpdateResult));
			approveResult = taskService.completeWithComment(taskId, variables, null, null, comment);
			long endApproveTime = System.currentTimeMillis();
			logger.error("??????????????????????????????: " + (endApproveTime - startApproveTime) + " ??????!");
			logger.debug("???????????????{}", JSONObject.toJSONString(approveResult));
			// ??????????????????????????????????????????????????????
			historicProcessInstanceNode = (JsonNode) historyService.getHistoricProcessInstance(processInstanceId);
		} catch (RestRequestFailedException e) {
			msg = e.getMessage();
			return bildResultMessage(jsonKey, new String[] { "faile", msg });
		} catch (RestException e) {
			msg =  e.getMessage();
			logger.error(msg, e.getMessage());
			return bildResultMessage(jsonKey, new String[] { "faile", msg });
		}
		// ??????????????????
		callbackProcess(approvetype, processInstanceId, historicProcessInstanceNode,CALLBACK_MAPING_APPROVE);

		// ????????????
		jsonResultService.toObject(historicProcessInstanceNode.toString(), HistoricProcessInstanceResponse.class);
		sendMessageForNextActiOrProcessEnd();
		// return message(data, userId);
		return bildResultMessage(jsonKey, new String[] { "success", MessageSourceUtil.getMessage("ja.tas.con2.0011", "????????????!") });
	}



	/**
	 * ????????????????????????????????????????????????
	 */
	private String singleApprove(String taskId, String approvetype, String processInstanceId, String userId,
								 String comment) {
		if (taskId == null || "".equals(taskId.trim())) {
			throw new WebRuntimeException(MessageSourceUtil.getMessage("ja.tas.con2.0012", "??????????????????"));
		}
		Map<String, Object> varMap = getProcinstVaries(processInstanceId);
		try {
			long t1 = System.currentTimeMillis();
			// ??????????????????
			TaskResourceParam taskParam = new TaskResourceParam();
			taskParam.setDescription(approvetype);
			taskService.updateTask(taskId, taskParam);
			// ????????????
			taskService.completeWithComment(taskId, null, null, null, comment);
			JsonNode historicProcessInstanceNode = (JsonNode) historyService
					.getHistoricProcessInstance(processInstanceId);
			// ???????????????????????????
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
			logger.error(MessageSourceUtil.getMessage("ja.tas.con2.0008", "??????????????????????????????:") + (t2 - t1) + MessageSourceUtil.getMessage("ja.tas.con2.0009", "??????!"));
			return null;
		} catch (RestException e) {
			logger.error(e.getMessage());
			return e.getMessage();
		} catch (Exception e) {

			return e.getMessage();
		}
	}

	/**
	 * ????????????
	 */
	@RequestMapping(value = "/approveSubmit", method = RequestMethod.POST)
	@ResponseBody
	public Object batchAprrove(@RequestBody Map<String, Object> data) {
		JSONObject json = new JSONObject();
		String comment = String.valueOf(data.get("comment"));
		String approvetype = (String) data.get("approvetype");
		// ??????????????????????????????,???????????????
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
				msg.append(task.get("name") + MessageSourceUtil.getMessage("ja.tas.con2.0013", "????????????-????????????????????????"));
				flag = "fail";
				continue;
			}
			if (isAddSign(taskId, userId)) {
				msg.append(task.get("name") + MessageSourceUtil.getMessage("ja.tas.con2.0014", "????????????-????????????????????????"));
				flag = "fail";
				continue;
			}
			String message = singleApprove(taskId, approvetype, processInstanceId, userId, comment);
			if (message != null) {
				msg.append(task.get("name") + MessageSourceUtil.getMessage("ja.tas.con2.0015", "????????????-") + message);
				flag = "fail";
				continue;
			}
		}
		json.put("flag", flag);
		json.put("msg", msg.toString());
		return json;
	}

	/**
	 * ????????????????????????
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
			// ????????????????????????
			if (assignlist.size() < 0 || (assignlist.size() == 1 && Participants == null)) {
				return false;
			} else {
				return true;
			}
		} catch (Exception e) {
			logger.error(MessageSourceUtil.getMessage("ja.tas.con2.0016", "????????????!"), e);
			return false;
		}
	}

	/**
	 * ??????????????????
	 *
	 * @return
	 */
	private boolean isAddSign(String taskId, String userId) {
		HistoryService historyService = bpmService.bpmRestServices(userId).getHistoryService();// ????????????
		String value = bPMUtil.getTaskVariablesValue(historyService, jsonResultService, taskId, "counterSigning")
				.toString();
		if ("true".equalsIgnoreCase(value)) {
			return true;
		} else {
			return false;
		}

	}

	/***
	 * ??????
	 */
	private boolean withdraw(String userId, String taskId) {
		TaskService taskService = bpmService.bpmRestServices(userId).getTaskService();
		try {
			taskService.withdrawTask(taskId);
			TaskResourceParam taskParam = new TaskResourceParam();
			taskParam.setDescription(MessageSourceUtil.getMessage("ja.tas.con2.0017", "????????????"));
			taskService.updateTask(taskId, taskParam);
		} catch (Exception e) {
			logger.error(MessageSourceUtil.getMessage("ja.tas.con2.0018", "??????????????????"), e.getMessage());
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
