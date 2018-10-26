package com.yonyou.iuap.bpm.runtime.msgcfg;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.msgcfg.ConfigUtil;
import com.yonyou.iuap.bpm.common.msgcfg.HttpClient;
import com.yonyou.iuap.bpm.common.msgcfg.SpringContextUtil;
import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgCfgVO;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverVO;
import com.yonyou.iuap.bpm.model.ConditionHandleUtils;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;
import com.yonyou.iuap.bpm.service.base.IBpmProcInfoService;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgConfigService;
import com.yonyou.iuap.bpm.service.msgcfg.IMsgReceiverService;
import com.yonyou.uap.msg.sdk.MessageCenterUtil;

import net.sf.json.JSONObject;
import yonyou.bpm.rest.request.repository.ProcessDefinitionModelQuery;
import yonyou.bpm.rest.request.repository.ProcessDefinitionQueryParam;

public class MsgSender {

	private static final Logger log = LoggerFactory.getLogger(MsgSender.class);

	public void sendMsg(String jsonData) {

		JSONObject jsonObj = JSONObject.fromObject(jsonData);

		// 消息配置
		List<MsgCfgVO> list = getMsgCfgVOs(jsonObj);

		for (int i = 0; i < list.size(); i++) {
			MsgCfgVO vo = list.get(i);
			// 按消息配置，发消息
			setAMsg(vo, jsonObj);
		}

	}

	private List<MsgCfgVO> getMsgCfgVOs(JSONObject jsonObj) {

		JSONObject execution = jsonObj.getJSONObject("execution");

		JSONObject task = jsonObj.getJSONObject("task");

		// 流程活动ID
		String act_id = execution.getString("currentActivityId");

		String tenant_id = execution.getString("tenantId");

		String category = task.getString("category");

		// 根据流程定义ID查询流程模型ID
		// String proc_module_id =
		// getProc_module_id(execution.getString("processDefinitionId"));
		String proc_module_id = getProc_module_idByDeployAlone(tenant_id, category);

		// 事件类型
		 String eventCode = task.getString("eventName");

//		eventCode = "create";
//		act_id = "approveUserTask_6ab8a45c15a242088f9d16000720dd";

		// 查找全部流程信息配置
		List<MsgCfgVO> list = getMsgConfigService().findAllByProcIdAndEvent(proc_module_id, act_id, eventCode);

		return list;

	}

	// 流程定义ID转换为流程模型Id
	// 集成应用平台的转换
	private String getProc_module_id(String proc_def_id) {

		if (proc_def_id == null) {
			return null;
		}
		String proc_module_id = proc_def_id;
		BpmProcInfo procInfo = null;
		try {
			procInfo = getBpmProcInfoService().getByProcDefId(proc_def_id);
		} catch (BpmException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(), e);
		}

		if (procInfo != null) {
			proc_module_id = procInfo.getProcModelId();
		}
		return proc_module_id;
	}

	// 流程定义ID转换为流程模型Id
	// 单独消息配置的转换
	private String getProc_module_idByDeployAlone(String tenantId, String category) {

		String proc_module_id = null;

		try {

			ProcessDefinitionQueryParam param = new ProcessDefinitionQueryParam();
			param.setTenantId(tenantId);
			param.setCategory(category);
			param.setLatest(true);

			Object definitions = getProcessService().getRepositoryService().getProcessDefinitions(param);
			String depolyid = null;
			/**
			 * 数据结构 {"data":[{"id":
			 * "process9470:2:adcdb433-dd20-11e6-a2b8-067a8600043d","url":
			 * "http://172.20.8.9:9090/ubpm-web-rest/service/repository/ext/process-definitions/repository/process-definitions/process9470:2:adcdb433-dd20-11e6-a2b8-067a8600043d"
			 * ,"key":"process9470","version":2,"name":"正式员工入职","description":
			 * null,"deploymentId":"ad9231d0-dd20-11e6-a2b8-067a8600043d",
			 * "deploymentUrl":null,"resource":null,"diagramResource":null,
			 * "category":"nlcj2iz8032000010101","graphicalNotationDefined":
			 * false,"suspended":false,"startFormDefined":false,
			 * "deploymentResponse":{"id":"ad9231d0-dd20-11e6-a2b8-067a8600043d"
			 * ,"name":"正式员工入职","deploymentTime":"2017-01-18T09:51:50.000+08:00"
			 * ,"category":"nlcj2iz8032000010101","url":
			 * "http://172.20.8.9:9090/ubpm-web-rest/service/repository/ext/process-definitions/repository/deployments/ad9231d0-dd20-11e6-a2b8-067a8600043d"
			 * ,"tenantId":"nlcj2iz8"}}],"total":1,"start":0,"sort":"name",
			 * "order":"asc","size":1}
			 */
			// 查询 流程部署ID
			if (definitions instanceof ObjectNode) {
				depolyid = ((ObjectNode) definitions).get("data").get(0).get("deploymentId").asText();

			}

			// 根据流程部署ID，查询流程定义模型
			ProcessDefinitionModelQuery query = new ProcessDefinitionModelQuery();
			query.setCategory(category);
//			query.setTenantId(tenantId);
			query.setDeploymentId(depolyid);

			ObjectNode obj = (ObjectNode) getProcessService().getRepositoryService().getProcessDefinitionModels(query);

			/**
			 * 数据结构 {"data":[{"name":"正式员工入职","key":null,"category":
			 * "nlcj2iz8032000010101","version":2,"metaInfo":"","deploymentId":
			 * "ad9231d0-dd20-11e6-a2b8-067a8600043d","tenantId":"nlcj2iz8","id"
			 * :"2dd0cf74-dc5c-11e6-b9ce-067a8600043d","url":
			 * "http://172.20.8.9:9090/ubpm-web-rest/service/repository/models/2dd0cf74-dc5c-11e6-b9ce-067a8600043d"
			 * ,"createTime":"2017-01-17T10:25:14.000+08:00","lastUpdateTime":
			 * "2017-01-18T09:51:50.000+08:00","deploymentUrl":
			 * "http://172.20.8.9:9090/ubpm-web-rest/service/repository/deployments/ad9231d0-dd20-11e6-a2b8-067a8600043d"
			 * }],"total":1,"start":0,"sort":"id","order":"asc","size":1}
			 */
			// 流程模型ID
			proc_module_id = obj.get("data").get(0).get("id").asText();

		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(), e);
		}

		return proc_module_id;
	}

	/**
	 * 队列消息格式 { "task":{ "assignee":null, "assigneeParticipant":null,
	 * "category":null, "createTime":null, "delegationState":null,
	 * "deleteReason":null, "deleted":false, "description":null, "dueDate":null,
	 * "eventName":null, "executionId":null, "formKey":null, "id":null,
	 * "identityLinksInitialized":false, "initialAssignee":null, "name":null,
	 * "owner":null, "parentTaskId":null, "priority":0,
	 * "processDefinitionId":null, "processInstanceId":null, "revision":0,
	 * "suspensionState":1, "taskDefinitionKey":null, "tenantCode":"zxy",
	 * "tenantId":"" }, "sendType":"EMAIL", "execution":{ "businessKey":null,
	 * "currentActivityId":"endEvent_82a6266b61c04c1aa4b522f5283a31",
	 * "currentActivityName":null, "deleteReason":null, "eventName":"end",
	 * "id":"e3673533-c33a-11e6-afcf-60d819b1fc43", "name":"测试完成消息",
	 * "parentId":null, "processDefinitionId":
	 * "process_f8d1b01bbc:2:d022a6cb-c33a-11e6-bbed-067a8600043d",
	 * "processInstanceId":"e3673533-c33a-11e6-afcf-60d819b1fc43",
	 * "tenantCode":"zxy", "tenantId":"604c1461-9bea-11e6-8bdd-60d819b1fc43" } }
	 * 
	 */
	private String setAMsg(MsgCfgVO cfgVO, JSONObject jsonObj) {

		JSONObject execution = jsonObj.getJSONObject("execution");
		// 流程目前沒有傳業務數據，只有單據Key，要和業務組協商如何取得業務數據
		String businessKey = execution.getString("businessKey");
		String tenantId = execution.getString("tenantId");
		JSONObject task = jsonObj.getJSONObject("task");
		String categoryID = task.getString("category");

		JSONObject buziData = getBuziData(categoryID, businessKey, tenantId);
		/**
		 * [{"fieldcode":"bpm_manager","operatorcode":"equal","value":"1"},{
		 * "fieldcode":"bpm_manager","operatorcode":"equal","value":"2"}]
		 */
		String condition = cfgVO.getTriggercondition().toString();

		String result = null;
		if (condition != null && buziData != null && ConditionHandleUtils.isConditionValidated(buziData, condition)) {
			String msgJson = buildTemplateData(cfgVO, buziData,tenantId);
			result = MessageCenterUtil.pushTemplateMessage(msgJson);
		}

		// MsgCfgVO cfgVOTest = new MsgCfgVO();
		// test
		if (buziData == null) {
			String msgJson = buildTemplateData(cfgVO, buziData,tenantId);
			result = MessageCenterUtil.pushTemplateMessage(msgJson);
		}
		return result;

	}

	/**
	 * { "statusCode":200, "message":"操作成功。", "data":{
	 * "bu_id":"GLOBAL_BU_ID000000000000000000000000",
	 * "applicant_id":"ee9d976d-cf66-464c-9363-ac49f66c434f",
	 * "ts":1481614515000, "new_poststate_id":null, "submit_date":1481558400000,
	 * "new_org_id":"nlcj2iz810000000001t", "applicant_name":"雪儿",
	 * "rptrel":"8b4b5fad-27f0-41db-b637-6ea8dfcde46b", "staff_name":"露丝25",
	 * "apply_date":1481558400000, "old_jobtype_id":null, "transtype_id":null,
	 * "staff_code":"admin1042016121325", "ischangectrt":false, "errmsg":null,
	 * "old_rptrel":"8b4b5fad-27f0-41db-b637-6ea8dfcde46b",
	 * "chgreason_id":"CHGREASON00000000004", "old_post_id":null,
	 * "parent_org_manager":"18c80a6d-14c2-47c6-8618-4b1ec6c72a0f",
	 * "old_workaddr":null, "new_socialinsuraddr":null, "old_jobrank_id":null,
	 * "old_socialinsuraddr":null, "modifier":null, "old_job_id":null,
	 * "email":"2016121325@163.com", "bill_state":6, "modifiedtime":null,
	 * "new_jobrank_id":null, "memo":null, "new_workaddr":null,
	 * "new_post_id":null, "staff_id":"44b944b4-bd93-4668-9c75-9d32675307a6",
	 * "post_id":null, "creator":"ee9d976d-cf66-464c-9363-ac49f66c434f",
	 * "new_jobgrade_id":"nlcj2iz810000000000e",
	 * "id":"8c12da7d-5b13-4158-9606-0dee6d4b74c7",
	 * "new_rptrel":"8b4b5fad-27f0-41db-b637-6ea8dfcde46b",
	 * "old_org_id":"nlcj2iz810000000001t", "old_poststate_id":null,
	 * "bpm_staffer":"46d5c1c1-ec6b-41ba-890d-2f8eee17f49c", "tableName":null,
	 * "chgtype_id":"CHGTYPE0000000000005",
	 * "bpm_manager":"c05cfd2d-e7c6-448e-9e4e-76d7a4466994",
	 * "old_psncl_id":"CS_PSNCL100000000ffm", "dr":0, "transtype":"010301",
	 * "old_jobgrade_id":null, "applicant_email":"23423432@qq.com",
	 * "new_job_id":"nlcj2iz810000000000f",
	 * "new_psncl_id":"CS_PSNCL100000000ffm", "attachment":null,
	 * "handler_id":null, "org_id":"nlcj2iz810000000001t",
	 * "creationtime":1481614508000, "psncl_id":"CS_PSNCL100000000ffm",
	 * "effective_date":1481558400000,
	 * "bpm_newmanager":"c05cfd2d-e7c6-448e-9e4e-76d7a4466994",
	 * "bill_code":"SC000009", "new_jobtype_id":"nlcj2iz8100000000005",
	 * "instanceid":"ad99c883-c106-11e6-9469-56847afe9799" } }
	 * 
	 * 异常返回： { "statusCode": 300, "message": "操作失败", "data": null }
	 * 
	 * 
	 */
	private JSONObject getBuziData(String categoryID, String businessKey, String tenantID) {

		String url = ConfigUtil.getProperties("hrcloud.url");
		String token = ConfigUtil.getProperties("hrcloud.token");

		Map<String, String> map = new HashMap<String, String>();
		map.put("token", token);
		map.put("tenantId", tenantID);
		map.put("categoryID", categoryID);
		map.put("businessKey", businessKey);

		String result = HttpClient.sendPost(url, map);
		if (result == null || result.trim().length() == 0) {
			return null;
		}
		JSONObject json = JSONObject.fromObject(result);
		JSONObject jsonData = new JSONObject();
		if ("200".equals(json.get("statusCode"))) {
			jsonData = json.getJSONObject("data");
		}

		return jsonData;
	}

	private List<MsgReceiverVO> getReceiverVOs(String msgcfg_id) {

		return getMsgReceiverService().getMsgReceiverVOs(msgcfg_id);

	}

	private IMsgConfigService getMsgConfigService() {
		return (IMsgConfigService) SpringContextUtil.getBean("MsgConfigService");
	}

	private IMsgReceiverService getMsgReceiverService() {
		return (IMsgReceiverService) SpringContextUtil.getBean("IMsgReceiverService");
	}

	private UserMappingService getEiapBpmUserMappingService() {
		return (UserMappingService) SpringContextUtil.getBean("IEiapBpmUserMappingService");
	}

	private IBpmProcInfoService getBpmProcInfoService() {
		return (IBpmProcInfoService) SpringContextUtil.getBean("IBpmProcInfoService");
	}

	private IProcessService getProcessService() {
		return (IProcessService) SpringContextUtil.getBean("IProcessService");
	}

	private String buildTemplateData(MsgCfgVO cfgVO, JSONObject buziData,String tenantId) {

		List<MsgReceiverVO> receivers = getReceiverVOs(cfgVO.getId());

		List<String> emails = getEmails(receivers);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sendman", "流程中心系统");
		map.put("channel", new String[] { cfgVO.getChannel() });

//		map.put("tenantid", "tenant");
		//必须要和消息中心的一致，否则发不了消息
		map.put("tenantid", tenantId);
		// map.put("sysid", "sysid");

		map.put("recevier", getUsers(receivers).toArray(new String[0]));
		// map.put("recevier", new String[]{});

		map.put("templateCode", cfgVO.getMsgtemplateid());
		map.put("busiData", buildBuziData(buziData));
		map.put("msgtype", "task");
		map.put("billid", "billid");
		map.put("busitype", "busitype");
		map.put("mailReceiver", emails);

		// map.put("mailReceiver", new
		// String[]{"sxj@yonyou.com","zhangbing1@yonyou.com"});
		Map<String, Object> retMap = new HashMap<String, Object>();
		retMap.put("data", map);

		JSONObject json = JSONObject.fromObject(retMap);
		return json.toString();

	}

	private List<String> getEmails(List<MsgReceiverVO> receivers) {
		List<String> emails = new ArrayList<String>();
		for (MsgReceiverVO vo : receivers) {

			if ("mail".equals(vo.getReceivertypecode())) {
				emails.add(vo.getReceiver());
			}
		}
		return emails;
	}

	private List<String> getUsers(List<MsgReceiverVO> receivers) {
		List<String> userIds = new ArrayList<String>();
		for (MsgReceiverVO vo : receivers) {

			if ("user".equals(vo.getReceivertypecode()) || "bpmrole".equals(vo.getReceivertypecode())) {
				userIds.add(vo.getReceiver());
			}
		}

		if (userIds.size() == 0) {
			return userIds;
		}
		// List<BpmUserMappingVO> list =
		// getEiapBpmUserMappingService().findByRemoteUserIds(userIds);

		// List<String> loalIds = new ArrayList<String>();
		// for (BpmUserMappingVO vo : list) {
		// loalIds.add(vo.getLocaluser_id());
		// }
		//
		// return loalIds;

		return userIds;
	}

	private JSONObject buildBuziData(JSONObject buziData) {
		//busiData结构：
		
		// busiData:｛
		// "id":"主键"，
		// "no":"单据号"，
		// "amount":"300",
		// "user":"张三",
		// "dept":"费用承担部门",
		// "child":[｛"id":"主键"，"date":"日期"，"amount":"150"｝, ......]
		
		JSONObject json = new JSONObject();
		json.put("id", "id");
		json.put("no", "no");
		json.put("amount", "amount");
	

		if (buziData != null) {
			json = buziData.getJSONObject("data");
		}
		return json;

	}
	
}
