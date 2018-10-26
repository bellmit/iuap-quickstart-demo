package com.yonyou.iuap.bpm.plustask.service;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.yonyou.iuap.bpm.plustask.entity.Task;
import com.yonyou.iuap.bpm.plustask.entity.TaskRequest;
import com.yonyou.iuap.bpm.service.JsonResultService;
import com.yonyou.iuap.bpm.service.ProcessService;
import com.yonyou.iuap.bpm.util.BPMUtil;
import com.yonyou.iuap.integration.client.IntegrationCenter;
import com.yonyou.iuap.portal.integration.client.IntegrationConst;
import com.yonyou.iuap.portal.integration.client.conf.ConfigFacade;
import com.yonyou.iuap.portal.integration.client.www.IntegrationPrincipal;
import com.yonyou.uap.wb.cache.UserCacheVo;
import com.yonyou.uap.wb.sdk.UserRest;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yonyou.bpm.rest.HistoryService;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;
import yonyou.bpm.rest.request.historic.HistoricVariableQueryParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.RestVariableResponse;
import yonyou.bpm.rest.response.historic.HistoricTaskInstanceResponse;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;
import yonyou.bpm.rest.utils.BaseUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PlusTaskService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private ProcessService bpmServioce;

    @Autowired
    private JsonResultService jsonResultService;

    private final BPMUtil bpmUtil =BPMUtil.getInstance();

    /**
     *
     * @param taskRequest
     * taskState  系统全部 undo代办 done已办  wbalone 自定义类型 0 代办 1 已办  2 办结
     * @return
     */
    public List<Task> getTaskList(TaskRequest taskRequest) {
        //代办
        if ("0".equals(taskRequest.getTaskState()) || "undo".equals(taskRequest.getTaskState())) {
            return getUndoTaskList(taskRequest);
        } else {  //已办或者办结
            return  getHisTask(taskRequest);
        }
    }

    /**
     * 查询待审批任务
     *
     * @param taskRequest
     * @return
     */
    private List<Task>  getUndoTaskList(TaskRequest taskRequest){
        List<Task> taskList = new ArrayList<Task>();
        IntegrationPrincipal user = IntegrationCenter.getPrincipal(taskRequest.getTicket());
        String userId = "";
        if(user == null || user.getAttributes() == null){
            return taskList;
        }
        userId = 	(String) user.getAttribute("pt_userid");
        TaskService taskService = bpmServioce.bpmRestServices(userId).getTaskService();
        TaskQueryParam taskQueryParam = new TaskQueryParam();
        //设置请求参数
        fillTaskQueryParamForUndoTask(taskQueryParam, taskRequest);
        try {
            JsonNode jsonNode = (JsonNode) taskService.queryTasksToDo(userId, taskQueryParam);
            ArrayNode arrayNode = BaseUtils.getData(jsonNode);
            HistoryService historyService = bpmServioce.bpmRestServices(userId).getHistoryService();
            for (int i = 0; arrayNode != null && i < arrayNode.size(); i++) {
                Task task = new Task();
                TaskResponse resp = jsonResultService.toObject(arrayNode.get(i).toString(), TaskResponse.class);
                buildResponseTaskForUndoTask(resp,task, historyService);
                taskList.add(task);
            }
        } catch (Exception e) {
            logger.error("获取任务列表失败!", e);
        }
        return taskList;
    }

    /**
     * 查询历史任务
     * @param taskRequest
     * @return
     */
    public  List<Task>  getHisTask(TaskRequest taskRequest) {
        List<Task> taskList = new ArrayList<Task>();
        IntegrationPrincipal user = IntegrationCenter.getPrincipal(taskRequest.getTicket());
        String userId = null ;
        if(user == null || user.getAttributes() == null){
            return taskList;
        }
        userId = 	(String) user.getAttribute("pt_userid");
        HistoryService ht = bpmServioce.bpmRestServices(userId).getHistoryService();
        HistoricTaskQueryParam htqp = new HistoricTaskQueryParam();
        //组装查询数据
        fillHistoricTaskQueryParamForHisTask(htqp, taskRequest, userId);
        //流程目录
        try {
            JsonNode jsonNode = (JsonNode) ht.getHistoricTaskInstances(htqp);
            ArrayNode arrayNode = BaseUtils.getData(jsonNode);
            int dataSize = arrayNode == null ? 0 : arrayNode.size();
            if ( null != arrayNode) {
                for (int i = 0; i < dataSize; i++) {
                    Task task = new Task();
                    JsonNode jn = arrayNode.get(i);// {"data":[],"total":0,"start":0,"sort":"taskInstanceId","order":"asc","size":0}这样的数据size居然不是0
                    HistoricTaskInstanceResponse taskResp = jsonResultService.toObject(jn.toString(),HistoricTaskInstanceResponse.class);
                    buildResponseTaskForHisTask(taskResp, task);
                    taskList.add(task);

                }
            }
        } catch (Exception e) {
            logger.error("获取任务列表失败!", e);
        }
        return taskList;
    }

    private void buildResponseTaskForHisTask(HistoricTaskInstanceResponse taskResp, Task task) {
        List<RestVariableResponse>  var_list = taskResp.getVariables();
        String title = bpmUtil.getVaries(var_list,"title");
        task.setId(taskResp.getId());
        task.setTitle(title);
        task.setUserid(taskResp.getAssignee());
        task.setSystem(ConfigFacade.getIns().getConfig(IntegrationConst.SYSTEM_CODE));
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sendDate = df.format(taskResp.getStartTime());
        task.setSenddate(sendDate);
        Map<String, String> exts = new HashMap<String, String>();
        exts.put("processDefinitionId",taskResp.getProcessDefinitionId());
        exts.put("processInstanceId",taskResp.getProcessInstanceId());
        task.setExts(exts);
    }

    /**
     *  taskState  1 已办  2 办结   done 办结+已办
     *  已办 ProcessFinished 为 false  办结 为true  done null
     * @param htqp
     * @param taskRequest
     * @param userId
     */
    private void fillHistoricTaskQueryParamForHisTask(HistoricTaskQueryParam htqp, TaskRequest taskRequest, String userId) {
        int start = 1 ;
        int pageSize = 10 ;
        if(taskRequest.getStart() !=null ){
            start = taskRequest.getStart() ;
        }
        if(taskRequest.getEnd() !=null ){
            pageSize = taskRequest.getEnd() -start;
        }
        //任务已完成
        htqp.setFinished(true);
        htqp.setTaskAssignee(userId);
        Date endTime = null;
        Date startTime = null;
        try {
            if (StringUtils.isNotBlank(taskRequest.getEndtime())) {
                endTime = DateUtils.parseDate(taskRequest.getEndtime(), new String[]{"yyyy-MM-dd HH:mm:ss"});
            }
            if (StringUtils.isNotBlank(taskRequest.getStarttime())) {
                startTime = DateUtils.parseDate(taskRequest.getStarttime(), new String[]{"yyyy-MM-dd HH:mm:ss"});
            }
        } catch (ParseException e) {
            logger.error("查询历史流程实例",e);
        }

        if (startTime != null) {
            htqp.setTaskCreatedAfter(startTime);
        }
        if (endTime != null) {
            htqp.setTaskCreatedBefore(endTime);
        }
        //false表示流程没有结束
        htqp.setProcessFinished(false);
        htqp.setOrder("desc");
        htqp.setSort("startTime");
        htqp.setReturnHistoricProcessInstance(true);
        htqp.setIncludeProcessVariables(true);
        htqp.setSize(pageSize);
        htqp.setStart(start);
        //办结
        if ("2".equals(taskRequest.getTaskState())) {
            htqp.setProcessFinished(true);
        }
        if ("done".equals(taskRequest.getTaskState())) {
            htqp.setProcessFinished(null);
        }
    }


    /**
     * 组装相应数据
     * @param resp
     * @param task
     * @param historyService
     */

    private void buildResponseTaskForUndoTask(TaskResponse resp, Task task, HistoryService historyService ) {
        String title = "";
        if (resp.getProcessInstance() != null) {
            title = resp.getProcessInstance().getName();
        }
        //由于弃审原因,造成新生成的任务没有相应得流程变量
        // 故查一遍历史的
        if (StringUtils.isBlank(title)) {
            HistoricVariableQueryParam historicVariableQueryParam = new HistoricVariableQueryParam();
            historicVariableQueryParam.setProcessInstanceId(resp.getProcessInstanceId());
            historicVariableQueryParam.setVariableName("title");
            try {
                JsonNode titleNode =  (JsonNode)historyService.getHistoricVariableInstances(historicVariableQueryParam);
                ArrayNode nodes = BaseUtils.getData(titleNode);
                if (nodes != null && nodes.size() > 0 ) {
                    String hisTitle = nodes.get(0).get("variable").get("value").textValue();
                    title = hisTitle;
                }
            } catch (Exception e) {
                logger.error("查询历史流程实例",e);
            }
        }
        task.setUserid(resp.getAssignee());
        task.setId(resp.getId());
        task.setTitle(title);
        task.setSystem(ConfigFacade.getIns().getConfig(IntegrationConst.SYSTEM_CODE));
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String sendDate = df.format(resp.getCreateTime());
        task.setSenddate(sendDate);
        Map<String, String> exts = new HashMap<String, String>();
        exts.put("processDefinitionId",resp.getProcessDefinitionId());
        exts.put("processInstanceId",resp.getProcessInstanceId());
        task.setExts(exts);

    }

    /**
     * 填充代办任务请求参数
     * @param tqp
     * @param taskRequest
     */
    private TaskQueryParam fillTaskQueryParamForUndoTask(TaskQueryParam tqp, TaskRequest taskRequest) {
        int start =1 ;
        int pageSize = 10 ;
        if(taskRequest.getStart() !=null ){
            start = taskRequest.getStart() ;
        }
        if(taskRequest.getEnd() !=null ){
            pageSize = taskRequest.getEnd() -start;
        }
        //按照创建时间 desc排序
        //如何多个排序字段用逗号隔开
        tqp.setOrder("desc");
        tqp.setSort("createTime");
        /**级联查询流程变量的话最大查询20000条
         * TaskEntityManager  findTasksAndVariablesByQueryCriteria 这里被限制了
         */
        //tqp.setIncludeProcessVariables(true);
        tqp.setSize(pageSize);
        tqp.setStart(start);
        //返回流程实例
        tqp.setReturnProcessInstance(true);
        Date endTime = null;
        Date startTime = null;
        try {
            if (StringUtils.isNotBlank(taskRequest.getEndtime())) {
                endTime = DateUtils.parseDate(taskRequest.getEndtime(), new String[]{"yyyy-MM-dd HH:mm:ss"});
            }
            if (StringUtils.isNotBlank(taskRequest.getStarttime())) {
                startTime = DateUtils.parseDate(taskRequest.getStarttime(), new String[]{"yyyy-MM-dd HH:mm:ss"});
            }
        } catch (ParseException e) {
            logger.error("解析日期异常", e);
        }
        if (startTime != null) {
            tqp.setCreatedAfter(startTime);
        }

        if (endTime != null) {
            tqp.setCreatedBefore(endTime);
        }

        return tqp;
    }

}
