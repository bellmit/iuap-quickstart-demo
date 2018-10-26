package com.yonyou.iuap.bpm.task.control;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.service.NotifyService;
import com.yonyou.iuap.bpm.service.ProcessService;
import com.yonyou.iuap.bpm.util.TaskMesTempCodeConstants;
import com.yonyou.iuap.message.CommonMessageSendService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.exception.RestRequestFailedException;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;
import yonyou.bpm.rest.response.historic.HistoricProcessInstanceResponse;
import yonyou.bpm.rest.response.historic.HistoricTaskInstanceResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/***
 * 流程改派
 */
@Controller
@RequestMapping(value = "task/delegatetask/")
public class DelegateTaskController extends BpmBaseController {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProcessService bpmService;
	@Autowired
	private CommonMessageSendService messageSendService;

	/***
	 * 改派
	 */
	@RequestMapping(value = "/delegate", method = RequestMethod.POST)
	@ResponseBody
	public Object delegate(@RequestBody Map<String, Object> data, HttpServletRequest request, HttpServletResponse response) {
		//參數
		logger.debug("改派处理参数开始");
		eval(data);
		logger.debug("改派处理参数完毕");
		JSONObject json = new JSONObject();
		try {
			long t1 = System.currentTimeMillis();
			bpmService.bpmRestServices(userId).getTaskService().delegateTaskCompleelyWithCommants(taskId, delegateUser,comment);
			long t2 = System.currentTimeMillis();
			logger.error("调用流程改派的时间为: " + (t2 - t1) + " 毫秒!");
			json.put("flag", "success");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con4.0006", "改派成功!"));
				//消息
			sendMessageForDelegate();
			try {
				JsonNode historicProcessInstanceNode = (JsonNode) historyService.getHistoricProcessInstance(processInstanceId);
				//jsonResultService.toObject(historicProcessInstanceNode.toString(), HistoricProcessInstanceResponse.class);
				callbackProcess(approvetype, processInstanceId, historicProcessInstanceNode, CALLBACK_MAPING_DELEGATE);
			}catch (Exception callBackException){
				logger.error("回调异常",callBackException);
			}
		} catch(RestRequestFailedException e){
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con4.0009", "改派失败：")+e.getMessage());
		} catch (RestException e) {
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con4.0009", "改派失败：")+e.getMessage());
		}
		return json;
	}


	private void sendMessageForDelegate() {
		try {
			JSONObject hitTaskInfo = queryHisTaskInfo(taskId, processInstanceId, userId);
			JSONObject busiData = new JSONObject();
			busiData.put("task.creator", hitTaskInfo.getString("billMarker"));
			busiData.put("task.billcode", hitTaskInfo.getString("code"));
			JSONObject processData = new JSONObject();
			processData.put("processInstanceId", processInstanceId);
			processData.put("taskId", taskId);
			NotifyService.instance().taskNotifyToAssigners(messageservice, hitTaskInfo.getString("funCode"),
					TaskMesTempCodeConstants.TASK_MES_DELEGATE_CN,
					new String[]{delegateUser}, busiData, processData);

		} catch (Exception e) {
			logger.error("改派环节发送消息失败", e);
		}
	}

}
