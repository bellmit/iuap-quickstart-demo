package com.yonyou.iuap.bpm.task.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.BpmStateConstant;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.common.base.utils.JSONResponse;
import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;
import com.yonyou.iuap.bpm.entity.user.WBUser;
import com.yonyou.iuap.bpm.form.service.IBpmFormService;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityService;
import com.yonyou.iuap.bpm.task.service.IBpmTaskService;
import com.yonyou.iuap.context.InvocationInfoProxy;

@Controller
@RequestMapping("/task")
public class BpmTaskController {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private IBpmTaskService bpmTaskServiceImpl;

	@Autowired
	private UserMappingService eiapBpmUserMappingService;

	@Autowired
	private IBpmFormService bpmFormServiceImpl;

	@Autowired
	private IBuziEntityService buziEntityService;
	
	@Value("${cloud.cloudIndentify}")
	private String  cloudIndentify;
	
	@RequestMapping(value = "/queryTasks", method = RequestMethod.GET)
	public @ResponseBody JSONResponse queryTasksToDo(HttpServletRequest request) {
		JSONResponse results = new JSONResponse();

		String sizeStr = request.getParameter("size");
		String startStr = request.getParameter("start");
		int size = Integer.valueOf(sizeStr);
		int start = Integer.valueOf(startStr);
		// 待办还是已办
		String taskFlag = request.getParameter("taskFlag");
		// 今日day, 还是本周week, 还是本月month
		String qtype = request.getParameter("qtype");
		try {
			String userId = null;
			if (Boolean.valueOf(cloudIndentify)) {
				userId = InvocationInfoProxy.getUserid();
			}else {
                userId = eiapBpmUserMappingService.findUseridByLocalUserId(InvocationInfoProxy.getUserid());
			}
			Object task = null;
			if (taskFlag.equals("todo")) {
				task = bpmTaskServiceImpl.queryTasksToDo(userId, start, size, qtype);
			} else if (taskFlag.equals("his")) {
				task = bpmTaskServiceImpl.queryTasksHistory(userId, start, size, qtype);
			}
			JSONObject jsonObj = new JSONObject();
			if (task != null) {
				jsonObj = buildReturnData(task);
			}
			results.success("", jsonObj);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			results.failed("查询待办任务失败");
		}
		return results;
	}

	private JSONObject buildReturnData(Object task) {
		ObjectNode objectNode = (ObjectNode) task;
		Object data = objectNode.get("data");
		JSONObject jsonObj = new JSONObject();
		List<String> list = new ArrayList<String>();
		JSONArray jsonarr = new JSONArray();
		if (data instanceof ArrayNode) {
			ArrayNode array = (ArrayNode) data;
			for (int i = 0; i < array.size(); i++) {
				JSONObject obj = new JSONObject();
				JsonNode o = array.get(i);
				if (o != null) {
					String id = o.get("processDefinitionId").asText();
					obj.put("processDefinitionId", id);
					if (StringUtils.isNotBlank(id) && id.indexOf(":") != -1) {
						String key = id.split(":")[0];
						obj.put("processKey", key);
						if (!list.contains(key))
							list.add(key);
					}
					String idkey = o.get("id").asText();
					String processDefinitionName = o.get("processDefinitionName").asText();
					// 发起时间
					String startTime = o.get("startTime").asText();
					String processInstanceId = o.get("processInstanceId").asText();
					JsonNode historicProcessInstance = o.get("historicProcessInstance");
					JsonNode startParticipant = historicProcessInstance.get("startParticipant");
					String processState = historicProcessInstance.get("state").asText();
					String businessKey = historicProcessInstance.get("businessKey").asText();
					// 发起人
					String name=null;
					//判断当前使用的的是私有版本还是共有版本  cloudIndentify 为true 表示私有版本，false 表示共有版本
					if (Boolean.valueOf(cloudIndentify)) {
						WBUser wbUser = bpmTaskServiceImpl.getWBUserByprocessInstanceId(processInstanceId);
						if (wbUser!=null){
							name=wbUser.getName();
						}else{
							name="";
						}
					}else {
						name = startParticipant.get("name").asText();
					}
					String taskname = o.get("name").asText();
					String state = o.get("state").asText();
					obj.put("id", idkey);
					obj.put("taskName", taskname);
					obj.put("processInstanceId", processInstanceId);
					obj.put("processInstanceName", processDefinitionName);
					obj.put("startParticipantName", name);
					obj.put("businessKey", businessKey);
					obj.put("startTime", startTime);
					String stateStr = BpmStateConstant.getStateName(state);
					obj.put("state", stateStr);
					if(state.equals(BpmStateConstant.RUN) && StringUtils.isNotBlank(processState) && BpmStateConstant.SUSPENDED.equals(processState)){
						//任务正在运行，但是流程实例挂起，任务并不停止，只是不在待办任务中显示，流程实例恢复之后显示。
					}else{
						jsonarr.add(obj);
					}
				}
			}
			String total = objectNode.get("total").asText();
			jsonObj.put("data", jsonarr);
			jsonObj.put("total", total);
		}

		return jsonObj;
	}
	

	@RequestMapping(value = "/queryFormCode", method = RequestMethod.GET)
	public @ResponseBody JSONResponse queryFormCode(HttpServletRequest request) {
		JSONResponse result = new JSONResponse();
		String processKey = request.getParameter("processKey");
		try {
			Object obj = bpmFormServiceImpl.queryForms(processKey, null, null);
			String formCode = getFormCode(obj);
			BuziEntityVO buziVO = buziEntityService.getByFormCode(formCode);
			String url = buziVO.getFormurl();
			result.put("url", url);
			result.put("status", "1");
		} catch (BpmException e) {
			logger.error(e.getMessage(), e);
			result.put("status", "0");
			result.put("msg", "查询url出错");
		}

		return result;

	}

	private String getFormCode(Object obj) {
		ObjectNode JSonObj = (ObjectNode) obj;

		if (JSonObj.has("data")) {
			Object dataObj = JSonObj.get("data");
			if (dataObj instanceof ArrayNode) {
				ArrayNode array = (ArrayNode) dataObj;
				JsonNode o = array.get(0);
				String code = o.get("code").asText();
				return code;
			}
		}

		return null;
	}
}
