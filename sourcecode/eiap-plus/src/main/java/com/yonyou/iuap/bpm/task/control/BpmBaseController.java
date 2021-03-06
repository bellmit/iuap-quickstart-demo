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
     * ??????????????????
     * @param data
     */
    protected void eval(Map<String,Object> data){
        long l=System.currentTimeMillis();
        userId = InvocationInfoProxy.getUserid();
        logger.debug(MessageSourceUtil.getMessage("ja.tas.con1.0002", "??????????????????"));
        //??????????????????
        logger.debug("Eval param data: {}",JSONObject.toJSONString(data));
        //??????
        taskService = bpmService.bpmRestServices(userId).getTaskService();
        historyService = bpmService.bpmRestServices(userId).getHistoryService();
        //??????????????????
        JSONObject jsonObject = JSONObject.parseObject(jsonResultService.toJson(data));


        taskId = (String) jsonObject.get("taskId");
        acvtId = (String) jsonObject.get("activityId");
        comment = (String) jsonObject.get("comment");
        processInstanceId = (String) jsonObject.get("processInstanceId");
        approvetype = (String) jsonObject.get("approvetype");

        try {
            logger.debug("?????????????????????");
            //?????????
            Participant[] participants = jsonResultService.toObject(jsonObject.get("participants").toString(), Participant[].class);
            List<AssignInfoItem> assignInfoItems = new ArrayList<AssignInfoItem>();
            assignInfo = new AssignInfo();
            AssignInfoItem assignInfoItem = new AssignInfoItem();
            assignInfoItem.setActivityId(acvtId);
            assignInfoItem.setParticipants(participants);
            assignInfoItems.add(assignInfoItem);
            assignInfo.setAssignInfoItems(assignInfoItems.toArray(new AssignInfoItem[0]));
        }catch (Exception e){
        	 logger.error("?????????????????????????????????{}",e.getMessage());
        }

        try {
            //?????????
            List<Participant> copyUserParticipants=null;
            copyUserParticipants = evalParticipant((List<Map>)data.get("copyusers"));
            logger.debug("????????????????????????{}",JSONObject.toJSONString(copyUserParticipants));
            boolean intersection = (boolean)data.get("intersection");
            logger.debug("????????????{},????????????:{}",JSONObject.toJSONString(copyUserParticipants),intersection);
            copyUsers=bpmUserService.getUsers(copyUserParticipants,intersection);
            logger.debug("??????????????????{}",JSONObject.toJSONString(copyUsers));
        }catch (Exception e){
            logger.error("?????????????????????????????????{}",e.getMessage());
        }

        try{
            //?????????
            delegateUser= (String) data.get("userId");
        }catch (Exception e){
            logger.error("?????????????????????????????????{}",e.getMessage());
        }

        try{
            //?????????
            addSignUserList= (List<String>) data.get("userIds");
        }catch (Exception e){
            logger.error("?????????????????????????????????{}",e.getMessage());
        }
        logger.debug("???????????????????????????{}??????",System.currentTimeMillis()-l);

    }

    /***
     * ??????????????????????????????????????????
     */
    protected boolean copyToUsers(){
        try {
            long l=System.currentTimeMillis();
            logger.debug("??????????????????");
            copyToService.copyTo(jsonResultService, taskService, userId, taskId, copyUsers);
            logger.debug("???????????????????????????{}??????",System.currentTimeMillis()-l);
            return true;
        }catch (Exception e){
            logger.error("??????????????????:{},{}",e.getMessage(),e);
            return false;
        }

    }

    /***
     * Map????????????????????????
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
     * ??????Json????????????
     * @param msg
     * @return
     */
    public JSONObject buildJsonSuccess(String msg){
        JSONObject json = new JSONObject();
        json.put("flag", "success");
        json.put("msg", StringUtils.isEmpty(msg)?MessageSourceUtil.getMessage("ja.tas.con1.0014", "????????????!"):msg);
        return json;
    }

    /***
     * ??????Json????????????
     * @param msg
     * @return
     */
    public JSONObject buildJsonFail(String msg){
        JSONObject json = new JSONObject();
        json.put("flag", "fail");
        json.put("msg", StringUtils.isEmpty(msg)?MessageSourceUtil.getMessage("ja.tas.con1.0015", "????????????!"):msg);
        return json;
    }

    public JSONObject buildJsonFail(){
        return buildJsonFail("");
    }

    /**
     * ???????????????????????????
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
            logger.error("????????????????????????!", e);
        } catch (Exception e) {
            logger.error("????????????!", e);
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
        htp.setIncludeProcessVariables(true);//????????????
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
                    logger.error("?????????????????????{}",e.getMessage());
                }

            }

            jsonObject.put("title", title);
            jsonObject.put("code",  code);
            jsonObject.put("businessKey",  businessKey);
            jsonObject.put("billMarker",  billMarker);
            jsonObject.put("funCode",  funCode);
            logger.debug("????????????: {}", jsonObject.toString());
        } catch (Exception e) {
            logger.error("????????????????????????", e);
        }
        return jsonObject;
    }

    /**
     * ??????????????????
     *
     * @param approvetype
     * @param processInstanceId
     * @param historicProcessInstanceNode
     * @return
     */
    public boolean callbackProcess(String approvetype, String processInstanceId, JsonNode historicProcessInstanceNode,String callUrl) {
        long begin = System.currentTimeMillis();
        logger.debug("??????????????????");
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

        logger.debug("???????????????{}",JSONObject.toJSONString(requestBody));
        try {
            logger.debug("??????URL???{}", url);
            jsonResponse = RestUtils.getInstance().doPost(url, requestBody, JsonResponse.class);
            logger.debug("???????????????{}??????", System.currentTimeMillis() - begin);
            return true;
        } catch (Exception e) {
            logger.error("???????????????{}", e);
            jsonResponse.setMessage(MessageSourceUtil.getMessage("ja.tas.con1.0025", "???????????????") + e.getMessage());
            logger.debug("?????????????????????{}??????", System.currentTimeMillis() - begin);
            return false;
        }
    }

    /**
     * ???????????????????????????????????????????????????,???????????????????????????
     * 1 ????????????,????????????????????????????????????
     * 2-1 ??????,??????????????????????????????
     * 2-2  ????????????????????????????????????????????????
     */
    protected void sendMessageForNextActiOrProcessEnd() {
        try {
            JsonNode historicProcessInstanceNode = (JsonNode) historyService.getHistoricProcessInstance(processInstanceId);
            HistoricProcessInstanceResponse hisProIns = jsonResultService.toObject(historicProcessInstanceNode.toString(),
                    HistoricProcessInstanceResponse.class);
            JSONObject hitTaskInfo = queryHisTaskInfo(taskId, processInstanceId, userId);

            HistoricTaskInstanceResponse hisTaskResp = jsonResultService.toObject(hitTaskInfo.get("task").toString(),
                    HistoricTaskInstanceResponse.class);

            // ??????????????????,?????????????????????
            if (hisProIns.getEndTime() != null) {
                logger.debug("??????????????????,???????????????????????? {}", hitTaskInfo.getString("billMarker"));
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
                //????????????,??????????????????
                String multiInstance = (String) hisTaskResp.getActivity().getProperties().get("multiInstance");
                boolean isSequential = "sequential".equals(multiInstance);
                //???????????????????????????????????????
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
                        logger.debug("???????????????????????????????????????");
                    } else {
                        logger.debug("????????????????????????,?????????????????????????????????");
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
            logger.error("???????????????????????????", e);
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
