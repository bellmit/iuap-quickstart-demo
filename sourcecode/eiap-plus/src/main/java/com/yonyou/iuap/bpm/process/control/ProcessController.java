package com.yonyou.iuap.bpm.process.control;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.service.JsonResultService;
import com.yonyou.iuap.bpm.service.ProcessService;
import com.yonyou.iuap.bpm.util.BPMUtil;
import com.yonyou.iuap.common.general.BasicController;
import com.yonyou.iuap.common.general.PageL;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.iweb.exception.WebRuntimeException;
import com.yonyou.uap.annotation.LiceControlAuto;
import com.yonyou.uap.ieop.security.sdk.AuthRbacClient;
import com.yonyou.uap.ieop.security.util.IConstants;
import com.yonyou.uap.wb.cache.UserCacheVo;
import com.yonyou.uap.wb.sdk.UserRest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import yonyou.bpm.rest.HistoryService;
import yonyou.bpm.rest.RuntimeService;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.exception.RestRequestFailedException;
import yonyou.bpm.rest.request.category.CategoryQueryParam;
import yonyou.bpm.rest.request.historic.HistoricProcessInstancesQueryParam;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;
import yonyou.bpm.rest.request.historic.HistoricVariableQueryParam;
import yonyou.bpm.rest.request.repository.ProcessDefinitionQueryParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.RestVariableResponse;
import yonyou.bpm.rest.response.historic.HistoricProcessInstanceResponse;
import yonyou.bpm.rest.response.historic.HistoricTaskInstanceResponse;
import yonyou.bpm.rest.response.repository.ProcessDefinitionResponse;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;
import yonyou.bpm.rest.utils.BaseUtils;
import yonyou.bpm.rest.utils.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.*;


@Controller
@RequestMapping(value = "process/")
@LiceControlAuto(productCode="010016")
public class ProcessController extends BasicController {
	private long begin;


	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProcessService bpmService;

	@Autowired
	private JsonResultService jsonResultService;

	
	private final BPMUtil bpmUtil =BPMUtil.getInstance();

/**
 * 获取流程定义
 * @param req
 * @param resp
 * @throws IOException
 */
	@RequestMapping(value = "/processInstancediagram", method = RequestMethod.GET)
	protected void getProcessInstanceDiagramJson(HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		try {
			String userId = InvocationInfoProxy.getUserid();;
			Map map = req.getParameterMap();
			Map<String, Object> values = new HashMap<String, Object>();
			if (map != null) {
				Iterator<String> keys = map.keySet().iterator();
				while (keys.hasNext()) {
					String key = keys.next();
					values.put(key, req.getParameter(key));
				}

			}
			RuntimeService runtimeService = bpmService.bpmRestServices(userId).getRuntimeService();
			ObjectNode img = (ObjectNode) runtimeService.getProcessInstanceDiagramJson((String) values.get("processDefinitionId"),(String) values.get("processInstanceId"));
			resp.setCharacterEncoding("UTF-8");
			resp.getWriter().print(img);

		} catch (Throwable t) {
			logger.error("caught throwable at top level", t);
		}
	}
/**
 * highlightsprocessInstance
 * @param req
 * @param resp
 * @throws IOException
 */
	@RequestMapping(value = "highlightsprocessInstance", method = RequestMethod.GET )
	protected void getHighlightsProcessInstance(HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		String userId = InvocationInfoProxy.getUserid();
		try {
			Map map = req.getParameterMap();
			Map<String, Object> values = new HashMap<String, Object>();
			if (map != null) {

				Iterator<String> keys = map.keySet().iterator();
				while (keys.hasNext()) {
					String key = keys.next();
					values.put(key, req.getParameter(key));
				}
			}
			RuntimeService runtimeService = bpmService.bpmRestServices(userId).getRuntimeService();
			ObjectNode obj = (ObjectNode) runtimeService
					.getHighlightsProcessInstance((String) values
							.get("processInstanceId"));
			resp.setCharacterEncoding("UTF-8");
			resp.getWriter().print(obj);
		} catch (Throwable t) {
			logger.error("caught throwable at top level", t);
		}
	}

	/**
	 * 时间：2016/11/08
	 * 修改人：DN
	 * 内容：在流程图中要显示提交人的信息。
	 */
	/**
	 * 流程图下面的
	 * 历史任务列表展示
			 *  驳回：task的DeleteReason字段reject:{"activityId"，"activityId"}
				改派：判断task的Owner是否为非空且与Assignee字段不一样即任务已经有Owner改派给了Assignee，还得判断判断task的variable中没有redirectUser（不允许第二次改派？张晓燕定）
				加签中：判断task的variable中是否有counterSigning==true
				加签产生的任务：判断task的variable中是否有createType==“countSignSequence”
				指派产生的任务上有变量：String com.yonyou.bpm.core.assign.AssignInfo.ASSIGNINFO_BY = "bpmAssigninfoBy_",指派产生了哪些任务，遍历所有任务去除变量张含有bpmAssigninfoBy_的即可！
				分支不做处理，显示到达活动名称即可，不在线上做文章
			 *
	 * @param request
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/hisTasklist")
	@ResponseBody
	public Object getHisTaskList(@Valid @RequestBody Map<String, String> json,HttpServletRequest request) {

		String userId = InvocationInfoProxy.getUserid();

		List<HistoricTaskInstanceResponse> list = new ArrayList<HistoricTaskInstanceResponse>();
		String processInstanceId = json.get("processInstanceId");
		
		try {
			if (processInstanceId != null && !processInstanceId.isEmpty()) {
				HistoryService ht = bpmService.bpmRestServices(userId).getHistoryService();// 历史服务
				
				HistoricTaskQueryParam htp = new HistoricTaskQueryParam();
				htp.setProcessInstanceId(processInstanceId);
				htp.setIncludeProcessVariables(false);// 包含流程实例变量
				htp.setIncludeTaskLocalVariables(true);// 包含任务变量
				htp.setOrder("asc,asc");
				htp.setSort("startTime,endTime");
				
				JsonNode jsonNode = (JsonNode) ht.getHistoricTaskInstances(htp);
				if (jsonNode == null)
					return null;
				//得到流程实例的所有评论
				ArrayNode arrayCommont=(ArrayNode) bpmService.bpmRestServices(userId).getHistoryService().getHistoricProcessInstancesComments(processInstanceId);
				ArrayNode arrayNode = BaseUtils.getData(jsonNode);
				int size = arrayNode == null ? 0 : arrayNode.size();
				if (null!=arrayNode) {
					Map<String, Object> varMap = new HashMap<String, Object>();
					varMap =bpmUtil.getProcinstVaries(bpmService, jsonResultService, processInstanceId);
					for (int i = 0; i < size; i++) {
                        JsonNode jn = arrayNode.get(i);
                        HistoricTaskInstanceResponse taskInstResp = jsonResultService.toObject(jn.toString(),HistoricTaskInstanceResponse.class);
                        taskInstResp.setDescription(BPMUtil.BPM_APPROVETYPE_AGREE_VALUE);//默认审批
                        //在第一条记录增加提交人信息
                        if(i == 0){
                            HistoricTaskInstanceResponse resp = new HistoricTaskInstanceResponse();
                            //任务ID
                            resp.setId(taskInstResp.getId());
                            //任务名称
                            resp.setName("提交人");
                            //执行者
                            Map<String, String> queryParams = new HashMap<String, String>();
                            queryParams.put("tenantId", InvocationInfoProxy.getTenantid());
                            queryParams.put("userId", (String)varMap.get("billMarker"));
                            JSONObject jsonObject = UserRest.getById(queryParams);
                            UserCacheVo vo = jsonObject.getObject("data", UserCacheVo.class);
                            resp.setExecutionId(vo.getName());
                            //开始时间
                            resp.setStartTime(taskInstResp.getStartTime());
                            resp.setEndTime(taskInstResp.getStartTime());
                            resp.setDescription(BPMUtil.BPM_APPROVETYPE_SUBMIT_VALUE);
                            list.add(resp);
                        }
                        //得到任务变量
                        List<RestVariableResponse>  taskVariables=taskInstResp.getVariables();
                        //判断是否加签的任务，根据参数变量
                        String value=getListVariableValue(taskVariables,"createType");
                        if(value.equalsIgnoreCase("countSignParrallel")){
                            taskInstResp.setDescription(BPMUtil.BPM_APPROVETYPE_SIGNADD_VALUE);
                        }
                        //判断是否加签中的任务，根据参数变量
                        value=getListVariableValue(taskVariables,"counterSigning");
                        if(value.equalsIgnoreCase("true")){
                            taskInstResp.setDescription(BPMUtil.BPM_APPROVETYPE_SIGNADDING_VALUE);
                        }
                        //驳回
                        if(taskInstResp.getDeleteReason()!= null && taskInstResp.getDeleteReason().startsWith("reject:")){
                            taskInstResp.setDescription(BPMUtil.BPM_APPROVETYPE_REJECT_VALUE);
                        }
                        if("ACTIVITI_DELETED".equals(taskInstResp.getDeleteReason())){
                            taskInstResp.setDescription(BPMUtil.BPM_APPROVETYPE_TERMINATION_VALUE);
                        }
                        //弃审
                        if("postCompleted".equals(taskInstResp.getDeleteReason())){
                            taskInstResp.setDescription(BPMUtil.BPM_APPROVETYPE_POSTCOMPLETED_VALUE);
                        }

						if("deleted".equals(taskInstResp.getDeleteReason()) || "delete".equals(taskInstResp.getDeleteReason())){
							taskInstResp.setDescription(BPMUtil.BPM_APPROVETYPE_WITHDRAW_VALUE);
						}


                        //判断是否改派的任务，根据参数变量
                        value=taskInstResp.getOwner()==null?"":taskInstResp.getOwner().toString();//getListVariableValue(taskVariables,"redirectUser");
                        if(value.length()>0){
                            taskInstResp.setDescription(BPMUtil.BPM_APPROVETYPE_DELEGATE_VALUE);
                        }

                        //得到流程实例变量
                        //List<RestVariableResponse>  processInstanceVariables=taskInstResp.getHistoricProcessInstance().getVariables();
                        //翻译执行人的姓名
                        Map<String, String> queryParams = new HashMap<String, String>();
                        queryParams.put("tenantId", InvocationInfoProxy.getTenantid());
                        queryParams.put("userId", (String)taskInstResp.getAssignee());
                        JSONObject jsonObject = UserRest.getById(queryParams);
                        UserCacheVo vo = jsonObject.getObject("data", UserCacheVo.class);

    //					WBUser user = userService.getOne(InvocationInfoProxy.getTenantid(), taskInstResp.getAssignee());
    //					taskInstResp.setExecutionId(user.getName());
                        taskInstResp.setExecutionId(vo.getName());
                        //设置评论
                        taskInstResp.setDeleteReason(getComment(taskInstResp.getId(),arrayCommont));
                        //List<CommentResponse> commentList=taskInstResp.getTaskComments();
                        list.add(taskInstResp);
                    }
				}
				// list = bpmService.queryInstanceAllHistoryTaskList(userId,
				// processInstanceId);

			}
		} catch (Exception e) {
			logger.error("获取任务列表失败!", e);
		}
		long size = list.size();
		return this.success(list, size, 1);
	}
	
	private String getListVariableValue(List<RestVariableResponse> vars,String code){
		String v="";
		if(vars.size()>0){
			for(RestVariableResponse r:vars){
				if(r.getName().equalsIgnoreCase(code)){
					v=r.getValue()==null?"":r.getValue().toString();
					return v;
				}
			}
		}
		
		return v;
	}
	/**
	 * 时间：2016/11/01 
	 * 修改人：DN
	 * 内容：结算单查看流程进度里，只能看到第一次提交的流程
	 */
	/**
	 * 根据单据id得到流程实例信息
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/getProcessInstanceInfo")
	@ResponseBody
	public Object getProcessInstanceInfo(@Valid @RequestBody Map<String, String> json,HttpServletRequest request) {

		String userId = InvocationInfoProxy.getUserid();
		String processDefinitionId="",processInstanceId="";
		JSONObject rejson=new JSONObject();
		//单据id
		String id=json.get("id").toString();
		HistoricProcessInstancesQueryParam p=new HistoricProcessInstancesQueryParam();
		p.setBusinessKey(id);
		//根据启动流程时间降序排序
		p.setOrder("desc");
		p.setSort("startTime");
		try {
			ObjectNode o1=(ObjectNode) bpmService.bpmRestServices(userId).getHistoryService().getHistoricProcessInstances(p);
			JsonNode data=o1.get("data");
			if(data.size()>0){
				processDefinitionId=data.get(0).get("processDefinitionId").asText();
				processInstanceId=data.get(0).get("id").asText();
				
				rejson.put("processDefinitionId", processDefinitionId);
				rejson.put("processInstanceId", processInstanceId);
				rejson.put("statusCode", "200");
			}
			
		} catch (RestException e1) {
			logger.error("获取任务列表失败!", e1.getMessage());
		}

		return rejson;
	}
	/**
	 * 得到评论
	 * @param taskId
	 * @param arrayCommont
	 * @return
	 */
	private String getComment(String taskId,ArrayNode arrayCommont){
		String comment="";
		for(JsonNode jn:arrayCommont){
			if(jn.get("taskId").asText().equalsIgnoreCase(taskId)){
				return jn.get("message").asText(); 
			}
		}
		return comment;
		
	}	
	
	/**
	 * 任务中心-搜索
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/getSearchList")
	@ResponseBody
	public Object getSearchList(@RequestBody PageL pageL,HttpServletRequest request) {
		//LoginSysUserContext usercxt = XYUtil.getWebOperUser();
		//String userId = usercxt.getSysUser().getId();
		String vstatus=pageL.getSearch().get("vstatus");
		//String billno=json.get("billno");
		if(vstatus.equalsIgnoreCase("1")){
			return getUndoTaskList(pageL,request);
		}else if(vstatus.equalsIgnoreCase("2")){
			return getDoneTaskList(pageL,request);
		}else if(vstatus.equalsIgnoreCase("3")){
			return getFinishTaskList(pageL,request);
		}
		
		return null;		
	}
	/**
     * 时间：2016/11/03
     * 修改人：DN
     * 内容：任务中心下需要按照不同的流程进行分类，而不是将待办和已办及办结区分
     */
	/**
	 * 待办任务列表
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/undoTasklist")
	@ResponseBody
	public Object getUndoTaskList(@RequestBody PageL pageL,HttpServletRequest request) {
		int pageNumber =1 ;
		int pageSize = 10 ;
		long size=0;
		if(pageL.getLength() !=null ){
			pageSize = pageL.getLength() ;
		}
		if(pageL.getDraw() !=null){
			pageNumber = (pageL.getDraw() -1)* pageL.getLength();
		}
		String userId = InvocationInfoProxy.getUserid();
		//String userId = "b737f37a-313e-11e7-b05e-54ee7520787b";
		TaskService ts = bpmService.bpmRestServices(userId).getTaskService();
		TaskQueryParam tqp = new TaskQueryParam();
		tqp.setOrder("desc");
		tqp.setSort("createTime");
		String billno=pageL.getSearch().get("billno");
		String processDefinitionName = pageL.getSearch().get("processDefinitionName");
		if(billno!=null&&billno.length()>0){
			tqp.setProcessInstanceNameLike("%"+billno+"%");
		}
		/*if(processDefinitionName != null && processDefinitionName.length() > 0){
			tqp.setProcessDefinitionNameLike("%" + processDefinitionName + "%");
		}*/
		/**级联查询流程变量的话最大查询20000条
		 * TaskEntityManager  findTasksAndVariablesByQueryCriteria 这里被限制了
		 */
		//tqp.setIncludeProcessVariables(true);
		tqp.setSize(pageSize);
		tqp.setStart(pageNumber);
		tqp.setReturnProcessInstance(true);
		List<TaskResponse> list = new ArrayList<TaskResponse>();
		
		try {
			//流程目录
			ArrayNode node_cat= getCatList(userId);
			JsonNode jsonNode = (JsonNode) ts.queryTasksToDo(userId, tqp);
			//记录总数
			size=Long.parseLong(String.valueOf(jsonNode.get("total").asInt()));
			ArrayNode arrayNode = BaseUtils.getData(jsonNode);
			HistoryService  historyService = bpmService.bpmRestServices(userId).getHistoryService();
			for (int i = 0; arrayNode != null && i < arrayNode.size(); i++) {
				TaskResponse resp = jsonResultService.toObject(arrayNode.get(i).toString(), TaskResponse.class);
				String title = "";
				if ( resp.getProcessInstance() != null) {
					title = resp.getProcessInstance().getName();
				}
				//设置流程定义名称
				String catname=getCatName(node_cat,resp.getCategory());
				resp.setProcessDefinitionName(catname);
				//由于弃审原因,造成新生成的任务没有相应得流程变量
				// 故查一遍历史的
				if (StringUtils.isBlank(title)) {
					HistoricVariableQueryParam historicVariableQueryParam = new HistoricVariableQueryParam();
					historicVariableQueryParam.setProcessInstanceId(resp.getProcessInstanceId());
					historicVariableQueryParam.setVariableName("title");
					JsonNode titleNode =  (JsonNode)historyService.getHistoricVariableInstances(historicVariableQueryParam);
					ArrayNode nodes = BaseUtils.getData(titleNode);
					if (nodes != null && nodes.size() > 0 ) {
						String hisTitle = nodes.get(0).get("variable").get("value").textValue();
						title = hisTitle;
					}
				}
				resp.setName(title);
				if(processDefinitionName != null && processDefinitionName.length() > 0){
					if(catname.contains(processDefinitionName)){
						list.add(resp);
					}
				}else{
					list.add(resp);
				}
			}
		} catch (RestException e) {
			//BPM中license验证不通过
			if (e.getErrorCode() ==1) {
				return error("300","没有购买BPM应用");
			}else{
                logger.error("获取任务列表失败!", e);
                return error(e);
            }
		} catch (Exception e) {
				logger.error("获取任务列表失败!", e);
				return error(e);
		}
		
		return this.success(list, size, pageNumber);
	}


	/**
     * 时间：2016/11/03
     * 修改人：DN
     * 内容：任务中心下需要按照不同的流程进行分类，而不是将待办和已办及办结区分
     */
	/**
	 * 已办任务列表
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/doneTasklist")
	@ResponseBody
	public Object getDoneTaskList(@RequestBody PageL pageL,HttpServletRequest request) {
//		int pageNumber =1 ;
//		int pageSize = 10 ;
		int pageNumber =(pageL.getDraw() -1)* pageL.getLength();
		int pageSize = pageL.getLength() ;
		long size=0;
		//String userId = "b737f37a-313e-11e7-b05e-54ee7520787b";
		String userId = InvocationInfoProxy.getUserid();
		HistoryService ht = bpmService.bpmRestServices(userId).getHistoryService();
		HistoricTaskQueryParam htqp = new HistoricTaskQueryParam();
		htqp.setFinished(true);
		htqp.setTaskAssignee(userId);
		//false表示流程没有结束
		htqp.setProcessFinished(false);
		htqp.setOrder("desc");
		htqp.setSort("endTime");
		String billno=pageL.getSearch().get("billno");
		String processDefinitionName = pageL.getSearch().get("processDefinitionName");
		if(billno!=null&&billno.length()>0){
			htqp.setProcessInstanceNameLike("%"+billno+"%");
		}
	/*	if(processDefinitionName != null && processDefinitionName.length() > 0){
			htqp.setProcessDefinitionNameLike("%" + processDefinitionName + "%");
		}*/
		htqp.setReturnHistoricProcessInstance(true);
		htqp.setIncludeProcessVariables(true);
		//htqp.setReturnCategory(true);
		
//		htqp.setSize((pageNumber-1)*10+10-1);
//		htqp.setStart((pageNumber-1)*10);
		htqp.setSize(pageSize);
		htqp.setStart(pageNumber);
		List<HistoricTaskInstanceResponse> list = new ArrayList<HistoricTaskInstanceResponse>();
		//流程目录
		ArrayNode node_cat= getCatList(userId);
		try {			
			JsonNode jsonNode = (JsonNode) ht.getHistoricTaskInstances(htqp);
			//记录总数
			size=Long.parseLong(String.valueOf(jsonNode.get("total").asInt()));
			ArrayNode arrayNode = BaseUtils.getData(jsonNode);
			
			int dataSize = arrayNode == null ? 0 : arrayNode.size();
			if (null!=arrayNode) {
				for (int i = 0; i < dataSize; i++) {
                    JsonNode jn = arrayNode.get(i);// {"data":[],"total":0,"start":0,"sort":"taskInstanceId","order":"asc","size":0}这样的数据size居然不是0
                    HistoricTaskInstanceResponse taskResp = jsonResultService.toObject(jn.toString(),HistoricTaskInstanceResponse.class);
                    List<RestVariableResponse>  var_list=taskResp.getVariables();
                    String title=bpmUtil.getVaries(var_list,"title");
                    //设置流程定义名称
                    String catname=getCatName(node_cat,taskResp.getCategory());
                    taskResp.setProcessDefinitionName(catname);
                    taskResp.setName(title);
                    if(processDefinitionName != null && processDefinitionName.length() > 0){
                        if(catname.contains(processDefinitionName)){
                            list.add(taskResp);
                        }
                    }else{
                        list.add(taskResp);
                    }
                }
			}
		} catch (Exception e) {
			logger.error("获取任务列表失败!", e);
		}
		return this.success(list, size, pageNumber);
	}
	
	
	/**
     * 时间：2016/11/03
     * 修改人：DN
     * 内容：任务中心下需要按照不同的流程进行分类，而不是将待办和已办及办结区分
     */
	/**
	 * 办结任务列表
	 * 
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/finishTasklist")
	@ResponseBody
	public Object getFinishTaskList(@RequestBody PageL pageL,HttpServletRequest request) {
		int pageNumber =(pageL.getDraw() -1) * pageL.getLength();
		int pageSize = pageL.getLength() ;
		long size=0;
		//String userId = "b737f37a-313e-11e7-b05e-54ee7520787b";
		String userId = InvocationInfoProxy.getUserid();
		HistoryService ht = bpmService.bpmRestServices(userId).getHistoryService();		
		HistoricTaskQueryParam htqp = new HistoricTaskQueryParam();
		htqp.setFinished(true);
		htqp.setTaskAssignee(userId);
		
		htqp.setOrder("desc");
		htqp.setSort("startTime");
		String billno=pageL.getSearch().get("billno");
		String processDefinitionName = pageL.getSearch().get("processDefinitionName");
		if(billno!=null&&billno.length()>0){
			htqp.setProcessInstanceNameLike("%"+billno+"%");
		}
	/*	if(processDefinitionName != null && processDefinitionName.length() > 0){
			htqp.setProcessDefinitionNameLike("%" + processDefinitionName + "%");
		}*/
		htqp.setReturnHistoricProcessInstance(false);
		//true表示流程结束
		htqp.setProcessFinished(true);
		htqp.setIncludeProcessVariables(true);
		htqp.setSize(pageSize);
		htqp.setStart(pageNumber);
		List<HistoricTaskInstanceResponse> list = new ArrayList<HistoricTaskInstanceResponse>();		
		//流程目录
		ArrayNode node_cat= getCatList(userId);
		try {
			
			JsonNode jsonNode = (JsonNode) ht.getHistoricTaskInstances(htqp);
			//记录总数
			size=Long.parseLong(String.valueOf(jsonNode.get("total").asInt()));
			ArrayNode arrayNode = BaseUtils.getData(jsonNode);
			int dataSize = arrayNode == null ? 0 : arrayNode.size();
			if (null!=arrayNode) {
				for (int i = 0; i < dataSize; i++) {
                    JsonNode jn = arrayNode.get(i);// {"data":[],"total":0,"start":0,"sort":"taskInstanceId","order":"asc","size":0}这样的数据size居然不是0
                    HistoricTaskInstanceResponse taskResp = jsonResultService.toObject(jn.toString(),HistoricTaskInstanceResponse.class);
                    List<RestVariableResponse>  var_list=taskResp.getVariables();
                    String title=bpmUtil.getVaries(var_list,"title");
                    //设置流程定义名称
                    String catname=getCatName(node_cat,taskResp.getCategory());
                    taskResp.setProcessDefinitionName(catname);
                    taskResp.setName(title);
                    if(processDefinitionName != null && processDefinitionName.length() > 0){
                        if(catname.contains(processDefinitionName)){
                            list.add(taskResp);
                        }
                    }else{
                        list.add(taskResp);
                    }
                }
			}
		} catch (Exception e) {
			logger.error("获取任务列表失败!", e);
		}

		return this.success(list, size, pageNumber);
	}
	/**
	 * 得到流程目录
	 * @param userId
	 * @return
	 */

	public ArrayNode getCatList(String userId){
		CategoryQueryParam catParam=new CategoryQueryParam(); 
		ArrayNode arrayNode=null;
		try {
			JsonNode jsonNode_cat = (JsonNode)bpmService.bpmRestServices(userId).getCategoryService().getCategories(catParam);
			if (jsonNode_cat != null) {
				arrayNode = BaseUtils.getData(jsonNode_cat.get("data"));
			}
		} catch (RestException e1) {
			logger.error("获取任务列表失败!", e1);
		}catch (RestRequestFailedException e1) {
			logger.error("获取任务列表失败!", e1);
		}
		return arrayNode;
	}
	
	/**
	 * 得到流程目录名称
	 * @return
	 */
	public String getCatName(ArrayNode arrayNode,String catid){
		String catname="";
		for (int i = 0; arrayNode != null && i < arrayNode.size(); i++) {
			JsonNode jn = arrayNode.get(i);// {"data":[],"total":0,"start":0,"sort":"taskInstanceId","order":"asc","size":0}这样的数据size居然不是0
			String id=jn.get("id").asText();
			String name=jn.get("name").asText();
			if(id.equalsIgnoreCase(catid)){
				catname=name;
				return catname;
			}
			
		}
		return catname;
	}

	/**
	 * 获取流程变量
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/getProVar")
	@ResponseBody
	public Object getProcessVaries(@Valid @RequestBody Map<String, String> data,HttpServletRequest request) {

		String processInstanceId = data.get("processInstanceId");
		HistoricVariableQueryParam paramHistoricVariableQueryParam = new HistoricVariableQueryParam();
		paramHistoricVariableQueryParam.setProcessInstanceId(processInstanceId);
		String userId = InvocationInfoProxy.getUserid();
		JsonNode sss;
		try {
			sss = (JsonNode) bpmService.bpmRestServices(userId).getHistoryService().getHistoricVariableInstances(paramHistoricVariableQueryParam);
		} catch (RestException e) {
			logger.error("调用流程变量报错!", e);
			throw new WebRuntimeException("调用流程变量报错!", e);
		} catch (Exception e) {
			logger.error("变量报错!", e);
			throw new WebRuntimeException("变量报错!", e);
		}
		ArrayNode varilist = (ArrayNode) sss.get("data");
		Map<String, Object> varMap = new HashMap<String, Object>(
				varilist.size());
		for (int i = 0; i < varilist.size(); i++) {
			JsonNode jn = varilist.get(i);
			RestVariableResponse var = jsonResultService.toObject(
					jn.get("variable").toString(), RestVariableResponse.class);
			varMap.put(var.getName(), var.getValue());
		}
		return varMap;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/getProcessInstance")
	@ResponseBody
	public Object getProcessInstance(@Valid @RequestBody Map<String, String> data,HttpServletRequest request) {
		String processInstanceId = data.get("processInstanceId");
		String userId = InvocationInfoProxy.getUserid();
		JsonNode historicProcessInstanceNode = null;
		//Map<String, Object> remap =new HashMap<String, Object>();
		JSONObject rejson = new JSONObject();
		String formUrl="";
		String businessKey="";
		String formType="";
		String billNo="";
		String formId="";
		try {
			HistoricProcessInstancesQueryParam param = new HistoricProcessInstancesQueryParam();
			param.setProcessInstanceId(processInstanceId);
			param.setIncludeProcessVariables(true);
			HistoricProcessInstanceResponse HistoricProcessInstanceResponse ;
			JsonNode jsonNode =  (JsonNode)  bpmService.bpmRestServices(userId).getHistoryService().getHistoricProcessInstances(param);
			ArrayNode nodes = BaseUtils.getData(jsonNode);
			if (nodes != null && nodes.size() > 0) {
				HistoricProcessInstanceResponse instanceResponse = jsonResultService.toObject(nodes.get(0).toString(), HistoricProcessInstanceResponse.class);
				List<RestVariableResponse>  var_list=instanceResponse.getVariables();
				//表单地址
				formUrl = bpmUtil.getVaries(var_list,BPMUtil.BPM_FORM_URL) ;
				formUrl = formUrl == null ? "" : formUrl;
				//表单类型
				formType = bpmUtil.getVaries(var_list,BPMUtil.BPM_FORM_TYPE);
				formType = formType == null ? "" : formType;
				//单据Id
                formId = bpmUtil.getVaries(var_list,BPMUtil.BPM_FORM_ID);
                formId = formId == null ? "" : formId;
                //单据号
                billNo = bpmUtil.getVaries(var_list,BPMUtil.BPM_FORM_NO);
                billNo = billNo == null ? "" : billNo;
                //业务Key
				businessKey= instanceResponse.getBusinessKey();
			}

			rejson.put(BPMUtil.BPM_BUSSINESSKEY, businessKey);
			rejson.put(BPMUtil.BPM_FORM_URL, formUrl);
			rejson.put(BPMUtil.BPM_FORM_TYPE, formType);
			rejson.put(BPMUtil.BPM_FORM_NO,billNo);
			rejson.put(BPMUtil.BPM_FORM_ID,formId);

		} catch (RestException e) {
			logger.error("调用流程实例报错!", e);
			throw new WebRuntimeException("调用流程实例报错!", e);
		} catch (Exception e) {
			logger.error("获取流程实例报错!", e);
			throw new WebRuntimeException("获取流程实例报错!", e);
		}

		//return historicProcessInstanceNode;
		return rejson;
	}
	
	
	/**
	 * 根据单据id查询对应单据当前人的审批状态。并返回流程实例id跟流程定义id
	 * @param data
	 * @param request
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/getbillbpm")
	@ResponseBody
	public Object getBillBpm(@Valid @RequestBody Map<String, String> data,HttpServletRequest request) {
		long begin=System.currentTimeMillis();
		String billId = data.get("billId");
		String taskId = data.get("taskId");
		String userId = InvocationInfoProxy.getUserid();
		HistoryService historyService=bpmService.bpmRestServices(userId).getHistoryService();

		JsonNode historicProcessInstanceNode = null;
		JsonNode historicTaskNode = null;
		JSONObject rejson = new JSONObject();
		HistoricProcessInstancesQueryParam historicProcessInstancesQueryParam = new HistoricProcessInstancesQueryParam();
		historicProcessInstancesQueryParam.setBusinessKey(billId);
		historicProcessInstancesQueryParam.setOrder("desc");
		historicProcessInstancesQueryParam.setSort("startTime"); //查询最新的流程实例 
		try {
			historicProcessInstanceNode = (JsonNode) historyService.getHistoricProcessInstances(historicProcessInstancesQueryParam);
			printCostTime();
			ArrayNode arrayNode = BaseUtils.getData(historicProcessInstanceNode);
			printCostTime();
			if(arrayNode.size()<1){
				rejson.put("message","NoBpm");//未关联流程
			}else{
				//获取流程信息
				JsonNode historicProcessInstanceJsonNode = arrayNode.get(0);
				HistoricProcessInstanceResponse historicProcessInstance= jsonResultService.toObject(historicProcessInstanceJsonNode.toString(),HistoricProcessInstanceResponse.class);
				logger.debug("ProcessInstance:",JSONObject.toJSONString(historicProcessInstance));
				printCostTime();
				if(historicProcessInstance!=null){
					String processInstanceId = historicProcessInstance.getId();
					rejson.put("processInstanceId", processInstanceId);
					rejson.put("processDefinitionId", historicProcessInstance.getProcessDefinitionId());
					HistoricVariableQueryParam paramHistoricVariableQueryParam = new HistoricVariableQueryParam();
					paramHistoricVariableQueryParam.setProcessInstanceId(processInstanceId);
					JsonNode historicVariableInstances;
					try {
						historicVariableInstances = (JsonNode) bpmService.bpmRestServices(userId).getHistoryService().getHistoricVariableInstances(paramHistoricVariableQueryParam);
					} catch (RestException e) {
						logger.error("调用流程变量报错!", e);
						throw new WebRuntimeException("调用流程变量报错!", e);
					} catch (Exception e) {
						logger.error("变量报错!", e);
						throw new WebRuntimeException("变量报错!", e);
					}
					ArrayNode varilist = (ArrayNode) historicVariableInstances.get("data");
					Map<String, Object> varMap = new HashMap<String, Object>(varilist.size());
					for (int i = 0; i < varilist.size(); i++) {
						JsonNode jn = varilist.get(i);
						RestVariableResponse var = jsonResultService.toObject(
								jn.get("variable").toString(), RestVariableResponse.class);
						varMap.put(var.getName(), var.getValue());
					}

					String funCode = (String) varMap.get("funCode");
					String sessionId = InvocationInfoProxy.getParameter("sessionid");
                    String uuid = AuthRbacClient.getInstance().setBpmTaskCenterOrMsgCenterToken(InvocationInfoProxy.getTenantid(), InvocationInfoProxy.getSysid(), IConstants.BPM, userId, sessionId, funCode, null);
					rejson.put("bpmauthtoken", uuid);


                    try {
                        if (StringUtils.isNotBlank(taskId)) {
                            HistoricTaskQueryParam historicTaskQueryParam = new HistoricTaskQueryParam();
                            historicTaskQueryParam.setTaskId(taskId);
                            historicTaskNode = (JsonNode) historyService.getHistoricTaskInstances(historicTaskQueryParam);
                            HistoricTaskInstanceResponse historicTaskInstanceResponse = jsonResultService.toObject(historicTaskNode.get("data").get(0).toString(), HistoricTaskInstanceResponse.class);
                            //历史任务
                            evalHistoricTask(historicTaskInstanceResponse, userId, rejson);
                            return rejson;
                        }
                    }catch (Exception e){
                        logger.error(e.getMessage(),"获取流程任务信息出错。");
                    }
					//获取是否有审批任务
					TaskService ts = bpmService.bpmRestServices(userId).getTaskService();
					TaskQueryParam tqp = new TaskQueryParam();
					tqp.setProcessInstanceId(processInstanceId);
					JsonNode taskNode = (JsonNode) ts.queryTasksToDo(userId, tqp);
					printCostTime();
					ArrayNode arrayTask = BaseUtils.getData(taskNode);
					if (arrayTask.size() < 1) {
						rejson.put("message", "NoTask");    //本人当前没有审批任务
						//无待办-出审批
					} else {
						//待办出审批面板
						TaskResponse taskResponse = jsonResultService.toObject(arrayTask.get(0).toString(), TaskResponse.class);
						rejson.put("taskId", taskResponse.getId());
						rejson.put("currentActivity", taskResponse.getActivity());
						rejson.put("message","UnDo");
					}

				}
				printCostTime();


			}
		
		} catch (RestException e) {
			logger.error("调用流程实例报错!", e);
		} catch (Exception e) {
			logger.error("获取流程实例报错!", e);
		}
		return rejson;
	}

	/***
	 * 不同历史不同状态
	 * @param historicTaskInstanceResponse
	 * @param userId
	 */
	private void evalHistoricTask(HistoricTaskInstanceResponse historicTaskInstanceResponse, String userId,JSONObject rejson) {
		boolean isSelfTask=historicTaskInstanceResponse.getAssignee().equals(userId);
		boolean isEndTask=historicTaskInstanceResponse.getEndTime()!=null;
		if(isSelfTask && isEndTask){
			rejson.put("message","TaskEnd");
		}else if(isSelfTask) {
			rejson.put("message","TaskIng");
		}else {
		    rejson.put("message","ViewTask");
        }
		rejson.put("taskState",historicTaskInstanceResponse.getDeleteReason());
		rejson.put("taskId",historicTaskInstanceResponse.getId());
	}

	private void printCostTime(String method){
		logger.debug("{}耗时{}毫秒",method,System.currentTimeMillis()-begin);
		this.begin=System.currentTimeMillis();//重设起始时间

	}

    private void printCostTime(){
        printCostTime("");
    }



    /**
     * 由流程定义key查询最新
     */
    @RequestMapping(value={"/latestProDefByKey"}, method={RequestMethod.GET})
    @ResponseBody
    public Object getLatestProDefByKey( @RequestParam(value="processDefinitionKey") String processDefinitionKey ) throws Exception {
        JSONObject result = new JSONObject();
        ProcessDefinitionQueryParam param = new ProcessDefinitionQueryParam();
        param.setKey(processDefinitionKey);
        param.setLatest(true);
        try {
            JsonNode jsonNode = (JsonNode) bpmService.bpmRestServices(InvocationInfoProxy.getUserid()).getRepositoryService().getProcessDefinitions(param);
            ArrayNode arrayNode = BaseUtils.getData(jsonNode);
            ProcessDefinitionResponse processDefinitionResponse = null;
            if (arrayNode != null && arrayNode .size() == 1) {
                processDefinitionResponse  = jsonResultService.toObject(arrayNode.get(0).toString(), ProcessDefinitionResponse.class);
            }
            result.put("flag", "success");
            result.put("data", processDefinitionResponse);

        } catch (Exception e) {
            logger.error("查询最新流程定义时错误", e.getMessage());
            result.put("flag", "faile");
            result.put("msg",  e.getMessage());
        }
        return  result;
    }
}
