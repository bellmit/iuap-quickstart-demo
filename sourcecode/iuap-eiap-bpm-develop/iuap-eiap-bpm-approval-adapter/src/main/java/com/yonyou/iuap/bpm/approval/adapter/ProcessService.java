package com.yonyou.iuap.bpm.approval.adapter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;
import com.yonyou.iuap.bpm.service.util.BpmJsonResultService;
import com.yonyou.iuap.context.InvocationInfoProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import yonyou.bpm.rest.*;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.param.BaseParam;
import yonyou.bpm.rest.request.RestVariable;
import yonyou.bpm.rest.request.runtime.ProcessInstanceStartParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.CommentResponse;
import yonyou.bpm.rest.response.historic.HistoricProcessInstanceResponse;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;
import yonyou.bpm.rest.utils.BaseUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 *
 */
@Service("IProcessService")
public class ProcessService implements IProcessService {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private UserMappingService userMappingService;

	@Value("${bpmrest.server}")
	private String serverUrl;

	@Value("${bpmrest.tenant}")
	private String tenant;

	@Value("${bpmrest.token}")
	private String token;

	@Value("${bpmrest.ssoUrl}")
	private String ssoUrl;
	
	@Value("${bpmrest.tenantLimit}")
	private String tenantLimit;
	
	@Value("${cloud.cloudIndentify}")
	private String  cloudIndentify;

	public ProcessService() {
		super();

	}
	@Autowired
	private BpmJsonResultService bpmJsonResultService;

	@Override
	public BpmRest bpmRestService(String userId) {
		BaseParam baseParam = new BaseParam();
		baseParam.setOperatorID(userId);
		baseParam.setServer(serverUrl);
		baseParam.setTenant(tenant);
		baseParam.setClientToken(token);
		baseParam.setTenantLimit(tenantLimit);
		BpmRest bpmRest = BpmRests.getBpmRest(baseParam);
		return bpmRest;
	}

	/**
	 * @Title: getIdentitySerevice
	 * @Description: 基础管理管理接口（租户、部门、用户组、用户）
	 * @return IdentityService 返回类型 @throws
	 */
	@Override
	public IdentityService getIdentitySerevice() {
		return this.bpmRestService(this.getUserId()).getIdentityService();
	}

	/**
	 * 获取流程定义接口
	 * 
	 * @return {@link RepositoryService}
	 */
	@Override
	public RepositoryService getRepositoryService() {
		return this.bpmRestService(this.getUserId()).getRepositoryService();
	}

	/**
	 * 获取流程历史接口
	 * 
	 * @return {@link HistoryService}
	 */
	@Override
	public HistoryService getHistoryService() {
		return this.bpmRestService(this.getUserId()).getHistoryService();
	}

	/**
	 * 获取目录接口
	 * 
	 * @return {@link CategoryService}
	 */
	@Override
	public CategoryService getCategoryService() {
		return this.bpmRestService(this.getUserId()).getCategoryService();
	}

	/**
	 * 任务的执行与管理服务
	 * 
	 * @return {@link TaskService}
	 */
	@Override
	public TaskService getTaskService() {
		return this.bpmRestService(this.getUserId()).getTaskService();
	}

	/**
	 * 流程的执行与控制服务
	 * 
	 * 
	 * @return {@link RuntimeService}
	 */
	public RuntimeService getRuntimeService() {
		return this.bpmRestService(this.getUserId()).getRuntimeService();

	}

	@Override
	public FormService getFormService() {
		return this.bpmRestService(this.getUserId()).getFormService();
	}

	@Override
	public String getUserId() {
		String localUserId = InvocationInfoProxy.getUserid();
		//为了适配HR独立部署消息配置
		if (localUserId==null){
			return "testUserID";
		}
		String userId = localUserId;
		/*try {
			userId = userMappingService.findUseridByLocalUserId(localUserId);
			return userId;
		} catch (Exception e) {
			logger.error("映射关系查询异常！", e);
//			throw new BpmRuntimeException("映射关系查询异常：", e);
		}*/
		return userId;
	}

	@Override
	public String getFlowSSOUrl(String modelId, String eiapToken) throws Exception {
		String url = "";
		try {
			//判断当前使用的的是私有版本还是共有版本  cloudIndentify 为true 表示私有版本，false 表示共有版本
			if (Boolean.valueOf(cloudIndentify)) {
				String remoteUserId=InvocationInfoProxy.getUserid();
				url = ssoUrl + "?modelId=" + modelId + "&tenantId=" + CommonUtils.getDefaultBpmTenantId();
			}else {
				BpmUserMappingVO userMapping = userMappingService.findByLocalUserId(InvocationInfoProxy.getUserid());
				if (userMapping == null) {
					throw new Exception("当前用户未同步到云审！");
				}
				url = ssoUrl + "?modelId=" + modelId + "&organizationId=" + CommonUtils.getDefaultBpmTenantId()
				+ "&page=flow" + "&usercode=" + userMapping.getLocaluser_code() + "&userid="
				+ userMapping.getRemoteuser_id() + "&token=" + eiapToken + "&ret=eiap_bpm";
			}
			
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw e;
		}
		return url;
	}
	public HistoricProcessInstanceResponse startProcessByKey(
			String userId,String processKey,String procInstName,String businessKey,
			List<RestVariable> variables)
			throws RestException {
		RuntimeService rt = getRuntimeService();
		ProcessInstanceStartParam parm = new ProcessInstanceStartParam();
		parm.setProcessDefinitionKey(processKey);
		parm.setVariables(variables);
		parm.setProcessInstanceName(procInstName);
		parm.setBusinessKey(businessKey);
		parm.setReturnTasks(true);
		
		//关键特性字段处理 xingjjc 2017-1-4
		/*String _keyFeatures_ = "_keyFeatures_";
		int indexOf = procInstName.indexOf(_keyFeatures_);
		if (indexOf != -1) {
			parm.setProcessInstanceName(procInstName.substring(0, indexOf));
			parm.setKeyFeature(procInstName.substring(indexOf + _keyFeatures_.length(), procInstName.length() -1));
		}*/
		
		ObjectNode node = (ObjectNode) rt.startProcess(parm);
		HistoricProcessInstanceResponse resp  = bpmJsonResultService.toObject(node.toString(), HistoricProcessInstanceResponse.class);
		return resp;
	}
	
	/**
     * 根据用户id查询该用户的待办列表
     *
     * @return 待办任务id和对应流程实例id
     * @throws RestException
     */
    public Object queryTodoList(String userId,
                                                    String keyword, String taskDue, String taskToday, Integer priority,
                                                    int size, int start) throws RestException {
        TaskService ts = getTaskService();
        TaskQueryParam tqp = new TaskQueryParam();
        tqp.setOrder("desc");
        tqp.setSort("createTime");
        tqp.setSize(size);
        tqp.setStart(start);

        if (taskDue != null && taskDue.length() > 0) {
            tqp.setDueBefore(new Date());
        }
        if (taskToday != null && taskToday.length() > 0) {
            Date today = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            String todayStr = sdf.format(today).substring(0, 10);
            try {
                Date today0 = sdf.parse(todayStr + " 00:00:00");
                Date today1 = sdf.parse(todayStr + " 23:59:59");
                tqp.setCreatedAfter(today0);
                tqp.setCreatedBefore(today1);
            } catch (ParseException e) {
//                log.error("时间解析错误", e);
            }
        }
        if (priority != null) {
            tqp.setPriority(priority);
        }

        if (keyword != null && keyword.trim().length() > 0) {
            tqp.setNameLike("%" + keyword + "%");
        }

        JsonNode jsonNode = (JsonNode) ts.queryTasksToDo(userId, tqp);

        List<TaskResponse> list = new ArrayList<TaskResponse>();
        ArrayNode arrayNode = BaseUtils.getData(jsonNode);
        for (int i = 0; arrayNode != null && i < arrayNode.size(); i++) {
            TaskResponse resp = bpmJsonResultService.toObject(arrayNode.get(i).toString(), TaskResponse.class);
            list.add(resp);
        }

        return list;
    }


	public CommentResponse getCommentInstance(String userId, String taskid) throws RestException {
		TaskService ts = bpmRestService(userId).getTaskService();
		JsonNode obj = (JsonNode) ts.getComments(taskid);
		logger.debug("TaskService.Comment=" + obj);
		if (obj != null && obj.size() > 0)
			return bpmJsonResultService.toObject(obj.get(0).toString(), CommentResponse.class);
		return null;
	}

}
