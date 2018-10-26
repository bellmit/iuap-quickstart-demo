package com.yonyou.iuap.bpm.task.control;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.base.utils.RestUtils;
import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import com.yonyou.iuap.bpm.service.*;
import com.yonyou.iuap.bpm.util.TaskMesTempCodeConstants;
import com.yonyou.iuap.bpm.web.IBPMBusinessProcessController;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.message.CommonMessageSendService;
import com.yonyou.iuap.mvc.type.JsonResponse;
import com.yonyou.iuap.utils.PropertyUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import yonyou.bpm.rest.HistoryService;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.AssignInfo;
import yonyou.bpm.rest.request.AssignInfoItem;
import yonyou.bpm.rest.request.Participant;
import yonyou.bpm.rest.request.RestVariable;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;
import yonyou.bpm.rest.request.historic.HistoricVariableQueryParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.RestVariableResponse;
import yonyou.bpm.rest.response.historic.HistoricProcessInstanceResponse;
import yonyou.bpm.rest.response.historic.HistoricTaskInstanceResponse;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BpmBaseController extends BaseController implements IBPMBusinessProcessController {
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    protected CommonMessageSendService messageservice;

    @Autowired
    protected ProcessService bpmService;

    @Autowired
    protected CopyToService copyToService;

    @Autowired
    protected BpmUserService bpmUserService;

    @Autowired
    protected JsonResultService jsonResultService;

    protected TaskService taskService;
    protected HistoryService historyService;

    protected List<String> addSignUserList;
    protected String delegateUser;
    protected String taskId;
    protected String acvtId;
    protected String userId;
    protected String approvetype;
    protected String processInstanceId;
    protected String comment;
    protected AssignInfo assignInfo;
    protected List<String> copyUsers;
    protected List<RestVariable> variables;
    protected String messageType;
    protected String errMsg;
    /***
     * 参数处理函数
     * @param data
     */
    protected void eval(Map<String,Object> data){
        long l=System.currentTimeMillis();
        userId = InvocationInfoProxy.getUserid();
        logger.debug(MessageSourceUtil.getMessage("ja.tas.con1.0002", "开始解析参数"));
        //开始解析参数
        logger.debug("Eval param data: {}",JSONObject.toJSONString(data));
        //服务
        taskService = bpmService.bpmRestServices(userId).getTaskService();
        historyService = bpmService.bpmRestServices(userId).getHistoryService();
        //参数反序列化
        JSONObject jsonObject = JSONObject.parseObject(jsonResultService.toJson(data));


        taskId = (String) jsonObject.get("taskId");
        acvtId = (String) jsonObject.get("activityId");
        comment = (String) jsonObject.get("comment");
        processInstanceId = (String) jsonObject.get("processInstanceId");
        approvetype = (String) jsonObject.get("approvetype");

        try {
            logger.debug("指派人参数解析");
            //指派人
            Participant[] participants = jsonResultService.toObject(jsonObject.get("participants").toString(), Participant[].class);
            List<AssignInfoItem> assignInfoItems = new ArrayList<AssignInfoItem>();
            assignInfo = new AssignInfo();
            AssignInfoItem assignInfoItem = new AssignInfoItem();
            assignInfoItem.setActivityId(acvtId);
            assignInfoItem.setParticipants(participants);
            assignInfoItems.add(assignInfoItem);
            assignInfo.setAssignInfoItems(assignInfoItems.toArray(new AssignInfoItem[0]));
        }catch (Exception e){
        	 logger.error("暂无指派信息，可忽略。{}",e.getMessage());
        }

        try {
            //抄送人
            List<Participant> copyUserParticipants=null;
            copyUserParticipants = evalParticipant((List<Map>)data.get("copyusers"));
            logger.debug("抄送信息对象化：{}",JSONObject.toJSONString(copyUserParticipants));
            boolean intersection = (boolean)data.get("intersection");
            logger.debug("抄送人：{},抄送控制:{}",JSONObject.toJSONString(copyUserParticipants),intersection);
            copyUsers=bpmUserService.getUsers(copyUserParticipants,intersection);
            logger.debug("抄送人获取：{}",JSONObject.toJSONString(copyUsers));
        }catch (Exception e){
            logger.error("暂无抄送信息，可忽略。{}",e.getMessage());
        }

        try{
            //改派人
            delegateUser= (String) data.get("userId");
        }catch (Exception e){
            logger.error("暂无改派信息，可忽略。{}",e.getMessage());
        }

        try{
            //加签人
            addSignUserList= (List<String>) data.get("userIds");
        }catch (Exception e){
            logger.error("暂无加签信息，可忽略。{}",e.getMessage());
        }
        logger.debug("处理参数完毕，耗时{}毫秒",System.currentTimeMillis()-l);

    }

    /***
     * 抄送函数【操作同时抄送处理】
     */
    protected boolean copyToUsers(){
        try {
            long l=System.currentTimeMillis();
            logger.debug("开始处理抄送");
            copyToService.copyTo(jsonResultService, taskService, userId, taskId, copyUsers);
            logger.debug("处理抄送完毕，耗时{}毫秒",System.currentTimeMillis()-l);
            return true;
        }catch (Exception e){
            logger.error("抄送处理出错:{},{}",e.getMessage(),e);
            return false;
        }

    }

    /***
     * Map转对象处理抄送集
     * @param copyusers
     * @return
     */
    private List<Participant> evalParticipant(List<Map> copyusers) {
        List<Participant> participants=new ArrayList<>();
        for(Map map:copyusers){
            Participant participant=new Participant();
            participant.setId(map.get("id").toString());
            participant.setType(map.get("type").toString());
            participants.add(participant);
        }
        return participants;
    }

    /***
     * 包装Json成功返回
     * @param msg
     * @return
     */
    public JSONObject buildJsonSuccess(String msg){
        JSONObject json = new JSONObject();
        json.put("flag", "success");
        json.put("msg", StringUtils.isEmpty(msg)?MessageSourceUtil.getMessage("ja.tas.con1.0014", "操作成功!"):msg);
        return json;
    }

    /***
     * 包装Json成功返回
     * @param msg
     * @return
     */
    public JSONObject buildJsonFail(String msg){
        JSONObject json = new JSONObject();
        json.put("flag", "fail");
        json.put("msg", StringUtils.isEmpty(msg)?MessageSourceUtil.getMessage("ja.tas.con1.0015", "操作失败!"):msg);
        return json;
    }

    public JSONObject buildJsonFail(){
        return buildJsonFail("");
    }

    /**
     * 得到流程实例的变量
     * @param processInstanceId
     * @return
     */
    public Map<String, Object> getProcinstVaries(String processInstanceId) {
        HistoricVariableQueryParam paramHistoricVariableQueryParam = new HistoricVariableQueryParam();
        paramHistoricVariableQueryParam.setProcessInstanceId(processInstanceId);
        String userId =InvocationInfoProxy.getUserid();
        JsonNode historicVariableInstances=null;
        try {
            historicVariableInstances = (JsonNode) bpmService
                    .bpmRestServices(userId)
                    .getHistoryService()
                    .getHistoricVariableInstances(
                            paramHistoricVariableQueryParam);
        } catch (RestException e) {
            logger.error("调用流程变量报错!", e);
        } catch (Exception e) {
            logger.error("变量报错!", e);
        }
        Map<String, Object> varMap=null;
        if(historicVariableInstances!=null){
            ArrayNode varilist = (ArrayNode) historicVariableInstances.get("data");
            varMap = new HashMap<String, Object>(varilist.size());
            for (int i = 0; i < varilist.size(); i++) {
                JsonNode jn = varilist.get(i);
                RestVariableResponse var = jsonResultService.toObject(
                        jn.get("variable").toString(), RestVariableResponse.class);
                varMap.put(var.getName(), var.getValue());
            }
        }

        return varMap;
    }
    public JSONObject queryHisTaskInfo(String taskId, String processInstanceId, String userId) {
        JSONObject jsonObject = new JSONObject();
        HistoricTaskQueryParam htp = new HistoricTaskQueryParam();
        htp.setProcessInstanceId(processInstanceId);
        htp.setIncludeProcessVariables(true);//包含变量
        htp.setReturnActivity(true);
        htp.setTaskId(taskId);
        try {
            ObjectNode historyTasks = (ObjectNode) historyService.getHistoricTaskInstances(htp);
            ObjectNode historyTask = (ObjectNode) historyTasks.get("data").get(0);
            jsonObject.put("task", historyTask);
            jsonObject.put("assignee",  historyTask.get("assignee").asText());
            jsonObject.put("endTime",  historyTask.get("endTime").asText());
            jsonObject.put("startTime", historyTask.get("startTime").asText());
            jsonObject.put("taskName",  historyTask.get("name").asText());
            //Title
            JsonNode resp =  historyTask.get("variables");
            String title="";String code="";String businessKey="";String billMarker="";
            String funCode="";
            for(int i=0;i<resp.size();i++){
                JsonNode r=resp.get(i);
                try {
                    if(r.get("name").asText().equalsIgnoreCase("title")){
                        title=r.get("value").asText();
                    }
                    if(r.get("name").asText().equalsIgnoreCase("code")){
                        code=r.get("value").asText();
                    }
                    if(r.get("name").asText().equalsIgnoreCase("id")){
                        businessKey=r.get("value").asText();
                    }
                    if(r.get("name").asText().equalsIgnoreCase("billMarker")){
                        billMarker=r.get("value").asText();
                    }
                    if(r.get("name").asText().equalsIgnoreCase("funCode")){
                        funCode=r.get("value").asText();
                    }
                }catch (Exception e){
                    logger.error("流程变量错误：{}",e.getMessage());
                }

            }

            jsonObject.put("title", title);
            jsonObject.put("code",  code);
            jsonObject.put("businessKey",  businessKey);
            jsonObject.put("billMarker",  billMarker);
            jsonObject.put("funCode",  funCode);
            logger.debug("任务信息: {}", jsonObject.toString());
        } catch (Exception e) {
            logger.error("查询历史任务错误", e);
        }
        return jsonObject;
    }

    /**
     * 流程回调业务
     *
     * @param approvetype
     * @param processInstanceId
     * @param historicProcessInstanceNode
     * @return
     */
    public boolean callbackProcess(String approvetype, String processInstanceId, JsonNode historicProcessInstanceNode,String callUrl) {
        long begin = System.currentTimeMillis();
        logger.debug("开始流程回调");
        JsonResponse jsonResponse = new JsonResponse();
        String controlURL = (String) getProcinstVaries(processInstanceId).get("serviceClass");
        String url = controlURL + callUrl;
        url = PropertyUtil.getPropertyByKey("base.url") + url;
        JSONObject requestBody = new JSONObject();
        requestBody.put("approvetype", approvetype);
        requestBody.put("taskId", taskId);
        requestBody.put("operator",userId);
        requestBody.put("processInstanceId",processInstanceId);
        requestBody.put("historicProcessInstanceNode", historicProcessInstanceNode);

        HistoricProcessInstanceResponse historicProcessInstance= jsonResultService.toObject(historicProcessInstanceNode.toString(), HistoricProcessInstanceResponse.class);
        String billId = historicProcessInstance.getBusinessKey();
        requestBody.put("billId",billId);

        logger.debug("回调参数：{}",JSONObject.toJSONString(requestBody));
        try {
            logger.debug("回调URL：{}", url);
            jsonResponse = RestUtils.getInstance().doPost(url, requestBody, JsonResponse.class);
            logger.debug("回调耗时：{}毫秒", System.currentTimeMillis() - begin);
            return true;
        } catch (Exception e) {
            logger.error("回调出错：{}", e);
            jsonResponse.setMessage(MessageSourceUtil.getMessage("ja.tas.con1.0025", "回调出错：") + e.getMessage());
            logger.debug("回调出错耗时：{}毫秒", System.currentTimeMillis() - begin);
            return false;
        }
    }

    /**
     * 当前的节点有另一个并行分支的情况下,这种情况会多发消息
     * 1 流程结束,流程进入下个环节发送消息
     * 2-1 串行,查询新的任务发送消息
     * 2-2  并行待任务进入到下个环节后才发送
     */
    protected void sendMessageForNextActiOrProcessEnd() {
        try {
            JsonNode historicProcessInstanceNode = (JsonNode) historyService.getHistoricProcessInstance(processInstanceId);
            HistoricProcessInstanceResponse hisProIns = jsonResultService.toObject(historicProcessInstanceNode.toString(),
                    HistoricProcessInstanceResponse.class);
            JSONObject hitTaskInfo = queryHisTaskInfo(taskId, processInstanceId, userId);

            HistoricTaskInstanceResponse hisTaskResp = jsonResultService.toObject(hitTaskInfo.get("task").toString(),
                    HistoricTaskInstanceResponse.class);

            // 流程实例结束,给制单人发消息
            if (hisProIns.getEndTime() != null) {
                logger.debug("流程实例结束,发送消息给制单人 {}", hitTaskInfo.getString("billMarker"));
                JSONObject busiData = new JSONObject();
                busiData.put("task.creator", hitTaskInfo.getString("billMarker"));
                busiData.put("task.billcode", hitTaskInfo.getString("code"));
                JSONObject processData = new JSONObject();
                processData.put("processInstanceId", processInstanceId);
                String funCode = hitTaskInfo.getString("funCode");
                NotifyService.instance().taskNotifyToAssigners(messageservice, hitTaskInfo.getString("funCode"),
                        TaskMesTempCodeConstants.TASK_MES_PROCESSEND_CN, new String[]{hitTaskInfo.getString("billMarker")},
                        busiData, processData);
            } else {
                //审批模式,并行还是串行
                String multiInstance = (String) hisTaskResp.getActivity().getProperties().get("multiInstance");
                boolean isSequential = "sequential".equals(multiInstance);
                //查询当前流程实例的审批任务
                List<TaskResponse> taskRespList = new ArrayList<TaskResponse>();
                TaskQueryParam taskQueryParam = new TaskQueryParam();
                taskQueryParam.setProcessInstanceId(processInstanceId);
                ObjectNode tasks = (ObjectNode) taskService.queryTasks(taskQueryParam);
                ArrayNode taskArray = (ArrayNode) tasks.get("data");
                boolean isNextActiFlag = false;
                for (int i = 0; i < taskArray.size(); i++) {
                    ObjectNode task = (ObjectNode) taskArray.get(i);
                    TaskResponse taskResp = jsonResultService.toObject(task.toString(), TaskResponse.class);
                    if (!hisTaskResp.getTaskDefinitionKey().equals(taskResp.getTaskDefinitionKey())) {
                        isNextActiFlag = true;
                    }
                    taskRespList.add(taskResp);
                }
                if ((isNextActiFlag && !isSequential) || isSequential) {
                    if (isSequential) {
                        logger.debug("串行审批发送消息给下一个人");
                    } else {
                        logger.debug("流程进入下个环节,发送消息给下个环节的人");
                    }
                    for (TaskResponse taskResponse : taskRespList) {
                        JSONObject busiData = new JSONObject();
                        busiData.put("task.creator", hitTaskInfo.getString("billMarker"));
                        busiData.put("task.billcode", hitTaskInfo.getString("code"));
                        JSONObject processData = new JSONObject();
                        processData.put("processInstanceId", taskResponse.getProcessInstanceId());
                        processData.put("taskId", taskResponse.getId());
                        NotifyService.instance().taskNotifyToAssigners(messageservice, hitTaskInfo.getString("funCode"),
                                TaskMesTempCodeConstants.TASK_MES_APPROVAL_CN,
                                new String[]{taskResponse.getAssignee()}, busiData, processData);
                    }

                }
            }
        } catch (Exception e) {
            logger.error("审批后发送消息失败", e);
        }
    }





    @Override
    public Object doApproveAction(Map<String, Object> data, HttpServletRequest request) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doTerminationAction(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doRejectMarkerBillAction(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doReject(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doAddSign(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doDelegate(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doAssign(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doWithdraw(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doCompletedWithdraw(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doSuspend(Map<String, Object> data) throws Exception {
        return null;
    }

    @Override
    public JsonResponse doActivate(Map<String, Object> data) throws Exception {
        return null;
    }
}
