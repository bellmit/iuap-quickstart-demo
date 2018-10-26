package com.yonyou.iuap.bpm.approval.adapter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.adpt.insthistory.BpmProcInstHistroyAdpt;
import com.yonyou.iuap.bpm.entity.adpt.taskints.BaseTaskInfo;
import com.yonyou.iuap.bpm.entity.adpt.taskints.Participant;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmHistoryService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.uap.wb.sdk.UserRest;

import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.historic.HistoricProcessInstancesQueryParam;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;

/**
 * 流程实例历史查询接口实现
 * 
 * @author zhh
 *
 */
@Service
public class HistoryServiceAdpt implements IEiapBpmHistoryService {

	private static final Logger log = LoggerFactory.getLogger(HistoryServiceAdpt.class);

	@Autowired
	private IProcessService processService;

	/****
	 * 指定历史实例查询
	 * @param procInstanceId
	 * @return
	 */
	public BpmProcInstHistroyAdpt getHistoryProcInstance(String procInstanceId){
		try {
			//6d23fc2a-acd0-11e8-a918-02420cbf1b08
			Object obj=this.processService.getHistoryService().getHistoricProcessInstance(procInstanceId);
			BpmProcInstHistroyAdpt jsonObj = JSONObject.parseObject(obj.toString(),BpmProcInstHistroyAdpt.class);
			if (jsonObj != null ) {
				return jsonObj;
			} else {
				log.error("流程实例历史查询，SDK返回值异常！");
				throw new BpmException("流程实例历史查询，SDK返回值异常！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("流程实例查询错误",e.getMessage());
		}
		return null;
	}
	@Override
	public List<BpmProcInstHistroyAdpt> getHistoryProcInsts(BpmProcInfo info, boolean isFinished) throws BpmException {
		List<BpmProcInstHistroyAdpt> results = new ArrayList<BpmProcInstHistroyAdpt>();
		try {
			if (StringUtils.isNotEmpty(info.getProcKey())) {
				Object obj = this.processService.getHistoryService()
						.getHistoricProcessInstances(this.buildHistoryProcInstQueryParam(info, isFinished));
				JSONObject jsonObj = JSONObject.parseObject(obj.toString());
				if (jsonObj != null && !jsonObj.isEmpty() && jsonObj.containsKey("data")) {
					JSONArray array = jsonObj.getJSONArray("data");
					if (array != null && array.size() > 0) {
						for (Iterator<Object> iterator = array.iterator(); iterator.hasNext();) {
							JSONObject item = (JSONObject) iterator.next();
							results.add(JSON.toJavaObject(item, BpmProcInstHistroyAdpt.class));
						}
					}
				} else {
					log.error("流程实例历史查询，SDK返回值异常！");
					throw new BpmException("流程实例历史查询，SDK返回值异常！");
				}
			} else {
				log.error("流程实例历史查询，流程定义基本信息异常，流程定义KEY值不存在！");
				throw new BpmException("流程实例历史查询，流程定义基本信息异常，流程定义KEY值不存在！");
			}
		} catch (RestException e) {
			log.error("流程实例历史查询，SDK异常：", e);
			throw new BpmException("流程实例历史查询，SDK异常：", e);
		}
		return results;
	}

	@Override
	public List<BaseTaskInfo> getHistoryTaskInsts(String procInstId) throws BpmException {
		List<BaseTaskInfo> results = new ArrayList<BaseTaskInfo>();

		try {
			if (StringUtils.isNotEmpty(procInstId)) {
				Object obj = this.processService.getHistoryService()
						.getHistoricTaskInstances(this.buildHistoryTaskQueryParam(procInstId));
				JSONObject jsonObj = JSON.parseObject(obj.toString());
				if (jsonObj != null && !jsonObj.isEmpty() && jsonObj.containsKey("data")) {
					JSONArray array = jsonObj.getJSONArray("data");
					if (array != null && array.size() > 0) {
						for (Iterator<Object> iterator = array.iterator(); iterator.hasNext();) {
							JSONObject item = (JSONObject) iterator.next();
							results.add(JSON.toJavaObject(item, BaseTaskInfo.class));
						}
					}
				} else {
					log.error("流程实例任务查询，SDK异常！");
					throw new BpmException("流程实例任务查询，SDK异常！");
				}
			} else {
				log.error("流程实例查询任务，实例ID为空！");
				throw new BpmException("流程实例查询任务，实例ID为空！");
			}
		} catch (RestException e) {
			log.error("流程实例历史任务查询，SDK异常：", e);
			throw new BpmException("");
		}
		try {
			processUserNames(results);
		} catch (Exception e) {
			// TODO: handle exception
			log.error("流程实例历史查询处理人出错，SDK异常：", e);
		}
		
		return results;
	}
	//翻译用户名称
	private void processUserNames(List<BaseTaskInfo> baseTaskInfos){
		
		List<Object> userId = new ArrayList<Object>();
		
		for (Iterator iterator = baseTaskInfos.iterator(); iterator.hasNext();) {
			BaseTaskInfo baseTaskInfo = (BaseTaskInfo) iterator.next();
			userId.add(baseTaskInfo.getAssignee());
		}
		String userListStr =new JSONArray(userId).toJSONString();
		
		Map<String, String> queryParams = new HashMap<String, String>();
		queryParams.put("tenantId", InvocationInfoProxy.getTenantid());
		Map<String, String> postParams = new HashMap<String, String>();
		postParams.put("userIds", userListStr);
		
		JSONObject jsonObject = UserRest.getByIds(queryParams,postParams);
		
		JSONArray jsa = jsonObject.getJSONArray("data");
		
		for (int i = 0; i < jsa.size(); i++) {
			
			jsa.getJSONObject(i).getString("name");
			
			Participant assigneeParticipant = new Participant();
			assigneeParticipant.setId(baseTaskInfos.get(i).getAssignee());
			assigneeParticipant.setName(jsa.getJSONObject(i).getString("name"));
			
			baseTaskInfos.get(i).setAssigneeParticipant(assigneeParticipant);
		}
		
	
		
	}

	/**
	 * 
	 * 
	 * @param procInsId
	 * @return
	 */
	private HistoricTaskQueryParam buildHistoryTaskQueryParam(String procInsId) {
		HistoricTaskQueryParam results = new HistoricTaskQueryParam();

		results.setProcessInstanceId(procInsId);
		results.setIncludeProcessVariables(true);
		results.setIncludeTaskLocalVariables(true);
		results.setReturnParticipants(true);
		results.setReturnTaskComment(true);
		results.setReturnActivity(true);
		results.setReturnHistoricProcessInstance(true);
		results.setOrder("asc");
		results.setSort("startTime");

		return results;
	}

	/**
	 * 获取流程实例历史信息
	 * 
	 * @param info
	 * @param isFinished
	 * @return
	 */
	private HistoricProcessInstancesQueryParam buildHistoryProcInstQueryParam(BpmProcInfo info, boolean isFinished) {
		HistoricProcessInstancesQueryParam results = new HistoricProcessInstancesQueryParam();
		results.setProcessDefinitionKey(info.getProcKey());
        results.setFinished(isFinished);
        results.setIncludeProcessVariables(true);
        results.setWithState(true);
        results.setReturnTasks(true);
        results.setReturnProcessDef(true);
        results.setSort("startTime");
        results.setOrder("desc");

		// 分页信息
		return results;
	}

}
