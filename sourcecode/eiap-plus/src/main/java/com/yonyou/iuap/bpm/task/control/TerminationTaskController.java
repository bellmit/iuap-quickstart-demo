package com.yonyou.iuap.bpm.task.control;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.yonyou.iuap.base.utils.RestUtils;
import com.yonyou.iuap.bpm.service.NotifyService;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.iweb.exception.WebRuntimeException;
import com.yonyou.iuap.mvc.type.JsonResponse;
import com.yonyou.iuap.utils.PropertyUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.exception.RestRequestFailedException;
import yonyou.bpm.rest.request.task.TaskResourceParam;
import yonyou.bpm.rest.response.historic.HistoricProcessInstanceResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Controller
@RequestMapping(value = "task/terminationtask/")
public class TerminationTaskController extends BpmBaseController {

	/**
	 * 流程终止
	 */
	@RequestMapping(value = "/termination", method = RequestMethod.POST)
	@ResponseBody
	public Object termination(@RequestBody Map<String, Object> data, HttpServletRequest request, HttpServletResponse response) {
		JSONObject json = new JSONObject();
		eval(data);
		//得到流程实例参数
		//制单人同组织，要校验传的组织，如果没有，则找制单人的组织
		Map<String, Object> varMap=getProcinstVaries(processInstanceId);
		String orgId=varMap.get("orgId")==null?"":varMap.get("orgId").toString();
		try {
			long t1 = System.currentTimeMillis();
			if (taskId == null || "".equals(taskId.trim())) {
				throw new WebRuntimeException(MessageSourceUtil.getMessage("ja.tas.con7.0002", "未传入任务！"));
			}
			String userId = InvocationInfoProxy.getUserid();

			//流程终止
			TaskService taskService=bpmService.bpmRestServices(userId, orgId).getTaskService();
			TaskResourceParam taskParam=new TaskResourceParam();
			taskParam.setDescription(approvetype);
			taskService.updateTask(taskId, taskParam);
			Object o=bpmService.bpmRestServices(userId, orgId).getRuntimeService().deleteProcessInstanceWithDeleteReason(processInstanceId, comment, taskId, comment);//deleteProcessInstance(processInstanceId);

			long t2 = System.currentTimeMillis();

			logger.error("调用流程终止的时间为: " + (t2 - t1) + " 毫秒!");
			json.put("flag", "success");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con7.0005", "流程终止成功!"));

			//检查流程是否走完，走完进行状态回写。
			JsonNode  historicProcessInstanceNode = (JsonNode) bpmService.bpmRestServices(userId, orgId).getHistoryService().getHistoricProcessInstance(processInstanceId);
			HistoricProcessInstanceResponse historicProcessInstance= jsonResultService.toObject(historicProcessInstanceNode.toString(),HistoricProcessInstanceResponse.class);

			//调用流程服务实现类  或者rest 对单据进行处理
			String controlURL =(String) varMap.get("serviceClass");//getServiceClass(params);
			String url = controlURL+ "/doTermination";
			url = PropertyUtil.getPropertyByKey("base.url") + url;

			JSONObject requestBody = new JSONObject();
			requestBody.put("approvetype",approvetype);
			requestBody.put("historicProcessInstance",historicProcessInstance);
			JsonResponse jsonResponse = RestUtils.getInstance().doPost(url, requestBody,JsonResponse.class );
			JSONObject hitTaskInfo = queryHisTaskInfo(taskId, processInstanceId, userId);

			JSONObject processData = new JSONObject();
			processData.put("processInstanceId", processInstanceId);
			processData.put("taskId", taskId);

			try {
				//消息
				NotifyService.instance().taskNotify(messageservice,bpmService,userId,taskId,processInstanceId,approvetype,comment,hitTaskInfo.getString("funCode"),processData);
			}catch (Exception notifyException){

			}
		} catch (WebRuntimeException e) {
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con7.0006", "终止失败"));
		} catch (RestRequestFailedException e) {
			logger.error(MessageSourceUtil.getMessage("ja.tas.con7.0007", "调用流程终止报错!"), e);
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con7.0008", "终止失败:")+e.getMessage());
		} catch (RestException e) {
			logger.error(MessageSourceUtil.getMessage("ja.tas.con7.0007", "调用流程终止报错!"), e);
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con7.0006", "终止失败"));
		} catch (Exception e) {
			logger.error(MessageSourceUtil.getMessage("ja.tas.con7.0009", "终止报错!"), e);
			json.put("flag", "faile");
			json.put("msg", MessageSourceUtil.getMessage("ja.tas.con7.0006", "终止失败"));
		}
		return json;
	}
}
