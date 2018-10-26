package com.yonyou.iuap.bpm.task.control;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.base.utils.RestUtils;
import com.yonyou.iuap.bpm.service.NotifyService;
import com.yonyou.iuap.bpm.service.ProcessTaskService;
import com.yonyou.iuap.bpm.util.BPMUtil;
import com.yonyou.iuap.bpm.util.TaskMesTempCodeConstants;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.iweb.exception.WebRuntimeException;
import com.yonyou.iuap.message.CommonMessageSendService;
import com.yonyou.iuap.mvc.type.JsonResponse;
import com.yonyou.iuap.utils.PropertyUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import yonyou.bpm.rest.ExecutionService;
import yonyou.bpm.rest.HistoryService;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.exception.RestRequestFailedException;
import yonyou.bpm.rest.request.Participant;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;
import yonyou.bpm.rest.request.historic.HistoricVariableQueryParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.RestVariableResponse;
import yonyou.bpm.rest.response.historic.HistoricTaskInstanceResponse;
import yonyou.bpm.rest.response.runtime.process.AssignInfoItemResponse;
import yonyou.bpm.rest.response.runtime.task.RejectInfoItemResponse;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;
import yonyou.bpm.rest.utils.BaseUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

@Controller
@RequestMapping(value = "task/rejecttask/")
public class RejectTaskController extends BpmBaseController {
	@Autowired
	private CommonMessageSendService messageSendService;
	@Autowired
	private ProcessTaskService processTaskService;
	private final BPMUtil bpmUtil =BPMUtil.getInstance();

	@RequestMapping(value = "/reject", method = RequestMethod.POST)
	@ResponseBody
	public Object reject(@RequestBody Map<String, Object> data,
						 HttpServletRequest request, HttpServletResponse response) {
		eval(data);
		JSONObject json = new JSONObject();
		String userId = InvocationInfoProxy.getUserid();
		Map<String, Object> varMap = getProcinstVaries(processInstanceId);
		// 单据id
		String billId = varMap.get("formId") == null ? "" : varMap
				.get("formId").toString();
		try {
			long t1 = System.currentTimeMillis();
			// 要判断驳回到的活动是否，是否是制单人活动
			// 首先如果不是制单人环节
			if (!acvtId.equalsIgnoreCase("markerbill")) {
				List<Participant> participantList = new ArrayList<Participant>();
				HistoryService historyService = bpmService.bpmRestServices(userId).getHistoryService();
				HistoricTaskQueryParam htqp = new HistoricTaskQueryParam();
				htqp.setTaskDefinitionKey(acvtId);
				htqp.setIncludeTaskLocalVariables(true);
				htqp.setProcessInstanceId(processInstanceId);
				JsonNode jsonNode = (JsonNode) historyService.getHistoricTaskInstances(htqp);
				ArrayNode arrayNode = BaseUtils.getData(jsonNode);
				Set<String> assignees = new HashSet<String>();
				/**
				 *
				 * 加签的驳回人员不计算, 弃审的任务, 驳回的任务都不计算
				 */
				if (null != arrayNode) {
					for (int i = 0; i < arrayNode.size(); i++) {
						JsonNode jn = arrayNode.get(i);// {"data":[],"total":0,"start":0,"sort":"taskInstanceId","order":"asc","size":0}这样的数据size居然不是0
						HistoricTaskInstanceResponse taskResp = jsonResultService.toObject(jn.toString(), HistoricTaskInstanceResponse.class);
						List<RestVariableResponse> var_list = taskResp.getVariables();
						String createType = bpmUtil.getVaries(var_list, "createType");
						if(createType != null && ("sequential".equals(createType) || "countSignParrallel".equals(createType))) {
							continue;
						}
						if ("withdraw".equals(taskResp.getDeleteReason()) ||
								(taskResp.getDeleteReason() != null && taskResp.getDeleteReason().startsWith("reject"))
								) {
							continue;
						}
						assignees.add(taskResp.getAssignee());

					}
				}

				for (String assignee : assignees) {
					participantList.add(new Participant(assignee));
				}
				bpmService.bpmRestServices(userId).getRuntimeService()
						.rejectToActivity(processInstanceId, acvtId,participantList, comment, taskId);
				//发送消息给驳回的审批人
				sendMessageForRejectActi(acvtId, taskId, processInstanceId, userId);
				try {
					JsonNode historicProcessInstanceNode = (JsonNode) historyService
							.getHistoricProcessInstance(processInstanceId);
					callbackProcess(approvetype, processInstanceId, historicProcessInstanceNode, CALLBACK_MAPING_REJECT);
				}catch (Exception callException){
					logger.error("回调异常",callException);
				}
			} else {

//				JSONObject resultJson = markerbillCheck(userId);
//				if (resultJson.get("flag") != null) {
//					return resultJson;
//				}

				Boolean delFlag = bpmService.bpmRestServices(userId)
						.getRuntimeService()
						.deleteProcessInstance(processInstanceId);

				//驳回制单人,发送消息给制单人
				sendMessageForMarkerbill(taskId, processInstanceId, userId);

				try {
					JsonNode historicProcessInstanceNode = (JsonNode) historyService
							.getHistoricProcessInstance(processInstanceId);
					callbackProcess(approvetype, processInstanceId, historicProcessInstanceNode, CALLBACK_MAPING_REJECTMARKERBILL);
				}catch (Exception callException){
					logger.error("回调异常",callException);
				}
			}

			long t2 = System.currentTimeMillis();
			logger.error("调用流程驳回的时间为: " + (t2 - t1) + " 毫秒!");
			json.put("flag", "success");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0005", "驳回成功!"));

		} catch (RestException e) {
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0006", "驳回失败：") + e.getMessage());
		} catch (WebRuntimeException e) {
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0007", "驳回失败")+ e.getMessage());
		} catch (RestRequestFailedException e) {
			logger.error("调用流程审批报错!", e);
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0009", "驳回失败:") + e.getMessage());
		} catch (Exception e) {
			logger.error("审批报错!", e);
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0007", "驳回失败"));
		}
		return json;
	}

	/**
	 * 驳回制单人检查
	 * @param userId
	 * @return
	 * @throws RestException
	 */
	private JSONObject markerbillCheck(String userId) throws RestException {
		JSONObject json = new JSONObject();
		HistoryService historyService = bpmService.bpmRestServices(userId).getHistoryService();
		HistoricTaskQueryParam htqp = new HistoricTaskQueryParam();
		htqp.setTaskId(taskId);
		htqp.setIncludeTaskLocalVariables(true);
		htqp.setProcessInstanceId(processInstanceId);
		JsonNode jsonNode = (JsonNode) historyService.getHistoricTaskInstances(htqp);
		HistoricTaskInstanceResponse  hisResp = jsonResultService.toObject(BaseUtils.getData(jsonNode).get(0).toString(), HistoricTaskInstanceResponse.class);
		List<RestVariableResponse> var_list = hisResp.getVariables();
		if (var_list != null && var_list.size() > 0) {
			String createType = bpmUtil.getVaries(var_list,"createType");
			if (StringUtils.isNotBlank(createType)) {
				logger.error("驳回失败：加签的任务不能执行驳回操作");
				json.put("flag", "faile");
				json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0011", "驳回失败：加签的任务不能执行驳回操作"));
				return json;
			}

			String counterSigning = bpmUtil.getVaries(var_list,"counterSigning");
			if (StringUtils.isNotBlank(counterSigning)) {
				logger.error("驳回失败：正在加签中，请等待加签任务完成！");
				json.put("flag", "faile");
				json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0011", "驳回失败：加签的任务不能执行驳回操作"));
				return json;
			}
		}

		//判断抢占是否有其他任务有加签操作,如何有不并且非放弃任务,不能加签,由于上一个步已经判断非加签任务
		TaskService taskService = bpmService.bpmRestServices(userId).getTaskService();
		JsonNode tasks = (JsonNode) taskService.getTask(taskId);
		TaskResponse taskResp = jsonResultService.toObject(tasks.toString(), TaskResponse.class);
		ExecutionService executionService = bpmService
				.bpmRestServices(userId).getExecutionService();
		JsonNode executionJsonNode = (JsonNode) executionService.getExecution(taskResp.getExecutionId());
		String exeParendId = executionJsonNode.get("parentId").textValue();
		ArrayNode vars = (ArrayNode) executionService.getExecutionVariables(exeParendId, "local");
		String grabConuterId = null;
		boolean grabConuterSign = false;
		for (JsonNode var : vars) {
			RestVariableResponse varResponse = jsonResultService.toObject(var.toString(), RestVariableResponse.class);
			if (varResponse.getName().equals("GrabConuterSign")) {
				grabConuterSign = true;
			}
			if (varResponse.getName().equals("GrabConuterId")) {
				grabConuterId = (String) varResponse.getValue();
			}
		}

		if (grabConuterSign && !taskId.equals(grabConuterId)) {
			logger.error("驳回失败：任务已经被抢占,已经加签,不可加签");
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0012", "驳回失败：任务已经被抢占,已经加签,不可加签"));
			return json;
		}
		return json;

	}

	/**
	 * 制单人消息
	 * @param taskId
	 * @param processInstanceId
	 * @param userId
	 */
	private void sendMessageForMarkerbill(String taskId, String processInstanceId, String userId) {
		try {
			JSONObject hitTaskInfo  = queryHisTaskInfo(taskId, processInstanceId,userId);
			JSONObject busiData = new JSONObject();
			busiData.put("task.creator", hitTaskInfo.getString("billMarker"));
			busiData.put("task.billcode", hitTaskInfo.getString("code"));

			JSONObject processData = new JSONObject();
			processData.put("processInstanceId", processInstanceId);
			processData.put("taskId", taskId);

			HistoricTaskInstanceResponse hisTaskResp = jsonResultService.toObject(hitTaskInfo.get("task").toString(), HistoricTaskInstanceResponse.class);
			logger.debug("驳回制单人环节,发送消息给制单人: {} ", hitTaskInfo.getString("billMarker"));
			NotifyService.instance().taskNotifyToAssigners(messageSendService, hitTaskInfo.getString("funCode"),TaskMesTempCodeConstants.TASK_MES_REJECT_CN,
					new String[] {hitTaskInfo.getString("billMarker")}, busiData,processData);
		} catch (Exception e) {
			logger.error("发送给制单人消息实现",e);
		}
	}

	/**
	 * 驳回环节消息
	 * @param assignees
	 * @param taskId
	 * @param processInstanceId
	 * @param userId
	 */
	private void sendMessageForRejectActi(String acvtId, String taskId, String processInstanceId, String userId) {
		try {
			JSONObject hitTaskInfo  = queryHisTaskInfo(taskId, processInstanceId,userId);
			TaskQueryParam taskQueryParam = new TaskQueryParam();
			taskQueryParam.setProcessInstanceId(processInstanceId);
			taskQueryParam.setTaskDefinitionKey(acvtId);
			ObjectNode tasks = (ObjectNode) taskService.queryTasks(taskQueryParam);
			ArrayNode taskArray = (ArrayNode) tasks.get("data");
			for (int i = 0; i < taskArray.size(); i++) {
				ObjectNode task = (ObjectNode) taskArray.get(i);
				TaskResponse taskResp = jsonResultService.toObject(task.toString(), TaskResponse.class);
				JSONObject busiData = new JSONObject();
				busiData.put("task.creator", hitTaskInfo.getString("billMarker"));
				busiData.put("task.billcode", hitTaskInfo.getString("code"));
				JSONObject processData = new JSONObject();
				processData.put("processInstanceId", processInstanceId);
				processData.put("taskId", taskResp.getId());
				logger.debug("驳回环节,发送消息给审批人");
				NotifyService.instance().taskNotifyToAssigners(messageSendService, hitTaskInfo.getString("funCode"),TaskMesTempCodeConstants.TASK_MES_REJECT_CN,
						new String[]{taskResp.getAssignee()}, busiData,processData);
			}
		} catch (Exception e) {
			logger.error("驳回环节发送消息失败", e);
		}
	}

	/**
	 * 驳回前判断
	 *
	 * @param data
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/bfreject", method = RequestMethod.POST)
	@ResponseBody
	public Object beforeReject(@RequestBody Map<String, String> data,
							   HttpServletRequest request, HttpServletResponse response) {
		String taskId = data.get("taskId");
		JSONObject json = new JSONObject();
		String userId = InvocationInfoProxy.getUserid();
		List<RejectInfoItemResponse> list = new ArrayList<RejectInfoItemResponse>();
		List<RejectInfoItemResponse> rejectList = new ArrayList<RejectInfoItemResponse>();
		try {
			if (taskId != null && !taskId.isEmpty()) {
				JsonNode sss = (JsonNode) bpmService.bpmRestServices(userId)
						.getTaskService().rejectCheck(taskId);
				if (sss.get("rejectAble").booleanValue()) {
					ArrayNode rejectlist = (ArrayNode) sss.get("rejectInfo")
							.get("assignInfoItems");
					for (int i = 0; i < rejectlist.size(); i++) {
						JsonNode jn = rejectlist.get(i);
						RejectInfoItemResponse rejectInfo = jsonResultService
								.toObject(jn.toString(),
										RejectInfoItemResponse.class);
						Map<String, Object> map = rejectInfo.getProperties();
						if (map.containsKey("canBeRejected") && "true".equals(map.get("canBeRejected").toString())) {
							list.add(rejectInfo);
						}

					}

				}

			}
			rejectList.addAll(list);
			json.put("rejectlist", rejectList);
			json.put("flag", "success");

		} catch (Exception e) {
			logger.error("获取驳回信息失败!", e);
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con5.0018", "驳回失败!"));
		}
		return json;

	}
}