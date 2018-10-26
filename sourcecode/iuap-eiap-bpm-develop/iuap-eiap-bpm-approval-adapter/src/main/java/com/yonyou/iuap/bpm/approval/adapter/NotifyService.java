package com.yonyou.iuap.bpm.approval.adapter;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.common.base.message.CommonMessageSendService;
import com.yonyou.iuap.bpm.common.base.message.MessageEntity;
import com.yonyou.iuap.bpm.common.base.message.WebappMessageConst;
import com.yonyou.iuap.context.InvocationInfoProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.CommentResponse;
import yonyou.bpm.rest.utils.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by 高树江 on 2017/7/21.
 */
public class NotifyService {
    //消息开关
    private boolean notifyOpend=true;
    private Logger logger= LoggerFactory.getLogger(this.getClass());

    private ObjectMapper mapper = new ObjectMapper();

    private static NotifyService instance;
    private NotifyService(){};
    public static NotifyService instance(){
        if (instance==null){
            instance= new NotifyService();
        }
        return instance;
    }

    /***
     * 任务事件提醒
     * @return
     */
    public JSONObject taskNotify(CommonMessageSendService messageservice, ProcessService bpmServioce, String userId, String taskId, String processInstanceId, String approveType, String comment, String funCode, JSONObject processData){
        if(notifyOpend){
            Long begin=System.currentTimeMillis();
            logger.debug("任务事件提醒开始 {}",begin);
            JSONObject jsonObject = new JSONObject();
            try {
                JSONObject bpmNotifyInfo = getBPMNotifyInfo(bpmServioce, userId, taskId, processInstanceId, approveType, comment);
                String[] userIds = getAssignees(bpmNotifyInfo);

                String businessKey = bpmNotifyInfo.getString("businessKey");
                String code = bpmNotifyInfo.getString("code");
                String name = bpmNotifyInfo.getString("title");
                String billMarker = bpmNotifyInfo.getString("billMarker");
                logger.debug("{}{}{}{}",userIds,businessKey,code,name);
                if(userIds!=null&&userIds.length>0) {
                    logger.debug("办理人消息");
                    send(messageservice, userIds, businessKey, funCode,approveType,code, name,comment,billMarker,processData);
                    jsonObject.put("flag", "success");
                }else {
                    logger.debug("制单人消息");
                    send(messageservice,new String[]{billMarker},businessKey,funCode,approveType,code,name,comment,billMarker,processData);
                    jsonObject.put("flag","nouser");
                }
            }catch (Exception e){
                logger.error(e.getMessage());
                jsonObject.put("flag","fail");
            }
            logger.debug("任务事件提醒结束 {}ms",System.currentTimeMillis()-begin);
            return jsonObject;
        }else{
            logger.info("消息开关未开启。");
            return null;
        }
    }


    /**
     *  发送任务通知  通用接口
     * @param messageservice
     * @param bpmServioce
     * @param userId
     * @param taskId
     * @param processInstanceId
     * @param approveType
     * @param comment
     * @param templateCode  消息模板编号
     * @param channel   消息通道  String 数组类型
     * @param busiData 业务数据，消息模板字段所对应的具体数值
     * @return
     */
    public JSONObject taskNotify(CommonMessageSendService messageservice, ProcessService bpmServioce, String userId, String taskId, String processInstanceId, String funCode, String approveType, String comment, String templateCode, String[] channel, JSONObject busiData, JSONObject processData){
        if(notifyOpend){
            Long begin=System.currentTimeMillis();
            logger.debug("任务事件提醒开始 {}",begin);
            JSONObject jsonObject = new JSONObject();
            try {
                JSONObject bpmNotifyInfo = getBPMNotifyInfo(bpmServioce, userId, taskId, processInstanceId, approveType, comment);
                String[] userIds = getAssignees(bpmNotifyInfo);

                String businessKey = bpmNotifyInfo.getString("businessKey");
                String code = bpmNotifyInfo.getString("code");
                String name = bpmNotifyInfo.getString("title");

                logger.debug("{}{}{}{}",userIds,businessKey,code,name);
                if(userIds!=null&&userIds.length>0) {
                    logger.debug("办理人消息");
                    send(messageservice, userIds, businessKey,funCode,approveType,channel,busiData,processData);
                    jsonObject.put("flag", "success");
                }else {
                    logger.debug("制单人消息");
                    String billMarker = bpmNotifyInfo.getString("billMarker");
                    send(messageservice,new String[]{billMarker},businessKey,funCode,approveType,channel,busiData,processData);
                    jsonObject.put("flag","nouser");
                }
            }catch (Exception e){
                logger.error(e.getMessage());
                jsonObject.put("flag","fail");
            }
            logger.debug("任务事件提醒结束 {}ms",System.currentTimeMillis()-begin);
            return jsonObject;
        }else{
            logger.info("消息开关未开启。");
            return null;
        }
    }


    /**
     * 目前发送消息只做打开单据,只需要传单据ID即可,
     * 当要可以审批的时候才穿任务的ID
     *  发送任务通知  通用接口
     * @param messageservice
     * @param bpmServioce
     * @param userId
     * @param taskId
     * @param processInstanceId
     * @param approveType
     * @param comment
     * @param templateCode
     * @param channel
     * @param busiData
     * @param userIds
     * @return
     */
    public JSONObject taskNotifyToAssigners(CommonMessageSendService messageservice, String funCode, String approveType, String[] userIds, JSONObject busiData, JSONObject processData){
        if(notifyOpend){
            Long begin=System.currentTimeMillis();
            logger.debug("任务事件提醒开始 {}",begin);
            JSONObject jsonObject = new JSONObject();
            try {
              //  JSONObject bpmNotifyInfo = getBPMNotifyInfoForTask(bpmServioce, userId, taskId, processInstanceId, approveType, comment);
              //  String[] userIds = getAssignees(bpmNotifyInfo);
//
//                String businessKey = bpmNotifyInfo.getString("businessKey");
//                String code = bpmNotifyInfo.getString("code");
//                String name = bpmNotifyInfo.getString("title");

//
//                JSONObject busiData = new JSONObject();
//                busiData.put("dbrw_info.code", code);
//                busiData.put("dbrw_info.name", name);
//                busiData.put("dbrw_info.comment", comment);


                send(messageservice, userIds, busiData.getString("businessKey"),funCode, approveType,new String[]{WebappMessageConst.CHANNEL_SYS},busiData,processData);
                jsonObject.put("flag", "success");

            }catch (Exception e){
                logger.error(e.getMessage());
                jsonObject.put("flag","fail");
            }
            logger.debug("任务事件提醒结束 {}ms",System.currentTimeMillis()-begin);
            return jsonObject;
        }else{
            logger.info("消息开关未开启。");
            return null;
        }
    }




    /**
     *消息发送
     * @param messageservice
     * @param userIds
     * @param businessKey
     * @param templateCode 消息模板编号
     * @param channel  消息通道 String数组类型
     * @param busiData 业务数据，消息模板字段所对应的具体数值
     */
    private void send(CommonMessageSendService messageservice, String[] userIds, String businessKey, String funCode, String approveType, String[] channel , JSONObject busiData, JSONObject processData){
        MessageEntity msg = new MessageEntity();
        msg.setSendman(InvocationInfoProxy.getUserid());//发送者：当前登录人
        msg.setChannel(channel);//sys是消息中心消息
        msg.setRecevier(userIds);//接受者：当前登录人、督办人、主办人、责任人、协办人
//        msg.setTemplatecode(templateCode);//消息模板编号
        msg.setFunCode(funCode);
        msg.setApproveType(approveType);
        msg.setBillid(businessKey);
        msg.setTencentid(InvocationInfoProxy.getTenantid());
        msg.setMsgtype(WebappMessageConst.MESSAGETYPE_TASK);
        msg.setProcessData(processData);


        logger.debug("MessageService send begin:{} {}",msg.getRecevier(),busiData.toJSONString());
        messageservice.sendTemplateMessage(msg, busiData);
        logger.debug("MessageService send end.");
    }
    private void send(CommonMessageSendService messageservice,String[] userIds,String businessKey,String funCode,String approveType,String code,String name,String comment,String billMarker,JSONObject processData){
        MessageEntity msg = new MessageEntity();
        msg.setSendman(InvocationInfoProxy.getUserid());//发送者：当前登录人
        msg.setChannel(new String[]{WebappMessageConst.CHANNEL_SYS});//sys是消息中心消息
        msg.setRecevier(userIds);//接受者：当前登录人、督办人、主办人、责任人、协办人
//        msg.setTemplatecode("ygdemo2");//消息模板编号
        msg.setFunCode(funCode);
        msg.setApproveType(approveType);
        msg.setBillid(businessKey);
        msg.setTencentid(InvocationInfoProxy.getTenantid());
        msg.setMsgtype(WebappMessageConst.MESSAGETYPE_TASK);
        msg.setProcessData(processData);
       
        JSONObject busiData = new JSONObject();
//        busiData.put("dbrw_info.code", code);
//        busiData.put("dbrw_info.name", name);
//        busiData.put("dbrw_info.comment", comment);
        busiData.put("task.creator", billMarker);
        busiData.put("task.billcode", businessKey);

        logger.debug("MessageService send begin:{} {}",msg.getRecevier(),busiData.toJSONString());
        messageservice.sendTemplateMessage(msg, busiData);
        logger.debug("MessageService send end.");
    }
    private JSONObject getBPMNotifyInfo(ProcessService bpmServioce, String userId, String taskId, String processInstanceId, String approveType, String comment){
        JSONObject jsonObject=new JSONObject();
        try {
            //Object task = bpmServioce.bpmRestServices(userId).getTaskService().getTask(taskId);
            //当前环节
            HistoricTaskQueryParam htp = new HistoricTaskQueryParam();
            htp.setProcessInstanceId(processInstanceId);
            htp.setIncludeProcessVariables(true);//包含变量
            htp.setTaskId(taskId);
            ObjectNode historyTasks = (ObjectNode) bpmServioce.bpmRestService(userId).getHistoryService().getHistoricTaskInstances(htp);
            logger.debug(JSONObject.toJSONString(historyTasks));
            ObjectNode historyTask = (ObjectNode) historyTasks.get("data").get(0);
            //审批人
            String approveUser = historyTask.get("assignee").asText();
            //审批时间
            String approveTime = historyTask.get("endTime").asText();
            String taskStartTime = historyTask.get("startTime").asText();
            //活动名称
            String currentTaskName = historyTask.get("name").asText();
            //Title
            String title="";String code="";String businessKey="";String billMarker="";

            JsonNode resp =  historyTask.get("variables");
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
                }catch (Exception e){
                    logger.error("流程变量错误：{}",e.getMessage());
                }

            }
            jsonObject.put("title",title);
            jsonObject.put("code",code);
            jsonObject.put("billMarker",billMarker);
            jsonObject.put("businessKey",businessKey);
            jsonObject.put("approveUser", approveUser);
            jsonObject.put("approveTime", approveTime);
            jsonObject.put("taskStartTime", taskStartTime);
            jsonObject.put("approveType",approveType);
            jsonObject.put("currentTaskName",currentTaskName);
            try {
                if (StringUtils.isBlank(comment)) {
                    CommentResponse commentInstance = bpmServioce.getCommentInstance(userId, taskId);
                    jsonObject.put("comment", commentInstance.getMessage());
                }else {
                    jsonObject.put("comment", comment);
                }
            }catch (Exception e){
                jsonObject.put("comment","");
            }
            //ObjectNode currentExecutionInfo=(ObjectNode) bpmServioce.bpmRestServices(userId).getExecutionService().getExecution(historyTask.get("executionId").asText());

            //下一环节
            TaskQueryParam taskQueryParam = new TaskQueryParam();
            taskQueryParam.setProcessInstanceId(processInstanceId);

            ObjectNode tasks = (ObjectNode) bpmServioce
                    .bpmRestService(userId).getTaskService().queryTasks(taskQueryParam);
            ArrayNode taskArray= (ArrayNode) tasks.get("data");
            //多任务
            List<JSONObject> assigneeList=new ArrayList<>();
            for (int i=0;i<taskArray.size();i++){
                ObjectNode taskTemp=(ObjectNode) taskArray.get(i);
                String nextUser = taskTemp.get("assignee").asText();
                String taskName = taskTemp.get("name").asText();
                JSONObject assigneeInfos=new JSONObject();
                assigneeInfos.put("taskName",taskName);
                assigneeInfos.put("assignee", nextUser);
                assigneeInfos.put("taskId", taskId);
                assigneeInfos.put("processInstanceId", processInstanceId);
                assigneeList.add(assigneeInfos);
            }
            jsonObject.put("assigneeList",assigneeList);
            logger.debug(jsonObject.toJSONString());
        }catch (Exception e){
            logger.error(e.toString());
        }
        return jsonObject;
    }


    private JSONObject getBPMNotifyInfoForTask(ProcessService bpmServioce, String userId, String taskId, String processInstanceId, String approveType, String comment){
        JSONObject jsonObject=new JSONObject();
        try {
            //Object task = bpmServioce.bpmRestServices(userId).getTaskService().getTask(taskId);
            //当前环节
            HistoricTaskQueryParam htp = new HistoricTaskQueryParam();
            htp.setProcessInstanceId(processInstanceId);
            htp.setIncludeProcessVariables(true);//包含变量
            htp.setTaskId(taskId);
            ObjectNode historyTasks = (ObjectNode) bpmServioce.bpmRestService(userId).getHistoryService().getHistoricTaskInstances(htp);
            logger.debug(JSONObject.toJSONString(historyTasks));
            ObjectNode historyTask = (ObjectNode) historyTasks.get("data").get(0);
            //审批人
            String approveUser = historyTask.get("assignee").asText();
            //审批时间
            String approveTime = historyTask.get("endTime").asText();
            String taskStartTime = historyTask.get("startTime").asText();
            //活动名称
            String currentTaskName = historyTask.get("name").asText();
            //Title
            String title="";String code="";String businessKey="";String billMarker="";

            JsonNode resp =  historyTask.get("variables");
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
                }catch (Exception e){
                    logger.error("流程变量错误：{}",e.getMessage());
                }

            }
            jsonObject.put("title",title);
            jsonObject.put("code",code);
            jsonObject.put("billMarker",billMarker);
            jsonObject.put("businessKey",businessKey);
            jsonObject.put("approveUser", approveUser);
            jsonObject.put("approveTime", approveTime);
            jsonObject.put("taskStartTime", taskStartTime);
            jsonObject.put("approveType",approveType);
            jsonObject.put("currentTaskName",currentTaskName);
            try {
                if (StringUtils.isBlank(comment)) {
                    CommentResponse commentInstance = bpmServioce.getCommentInstance(userId, taskId);
                    jsonObject.put("comment", commentInstance.getMessage());
                }else {
                    jsonObject.put("comment", comment);
                }
            }catch (Exception e){
                jsonObject.put("comment","");
            }

            logger.debug(jsonObject.toJSONString());
        }catch (Exception e){
            logger.error(e.toString());
        }
        return jsonObject;
    }


    public static String[] getAssignees(JSONObject assigneeInfo){
        List arrayNode = (List) assigneeInfo.get("assigneeList");
        String[] assigneeArray = new String[arrayNode.size()];
        for(int i=0;i<arrayNode.size();i++){
            String assignee= (String) ((JSONObject)arrayNode.get(i)).get("assignee");
            assigneeArray[i]=(assignee);
        }
        return  assigneeArray;
    }

    public static void main(String [] args){
        String json="{\"taskStartTime\":\"2017-07-24T13:47:35.367+08:00\",\"assigneeList\":[{\"taskId\":\"97fcf5ed-7033-11e7-8d4f-000c2919ef98\",\"processInstanceId\":\"97f1ab18-7033-11e7-8d4f-000c2919ef98\",\"assignee\":\"63709ae6beb1432a92117d77dc763346\",\"taskName\":\"任务测试\"},{\"taskId\":\"97fcf5ed-7033-11e7-8d4f-000c2919ef98\",\"processInstanceId\":\"97f1ab18-7033-11e7-8d4f-000c2919ef98\",\"assignee\":\"7437eae953624ff9a4588e21e9c90f9a\",\"taskName\":\"任务测试\"},{\"taskId\":\"97fcf5ed-7033-11e7-8d4f-000c2919ef98\",\"processInstanceId\":\"97f1ab18-7033-11e7-8d4f-000c2919ef98\",\"assignee\":\"5af4c29d275443d3a0b4c50dd4ed8965\",\"taskName\":\"任务测试\"}],\"title\":\"%25E9%2592%259F%25E5%25B0%258F%25E4%25B8%259C提交的【督办】,单号 是3A,请审批\",\"currentTaskName\":\"发起人处理\",\"approveType\":\"agree\",\"approveTime\":\"2017-07-24T13:51:03.148+08:00\",\"comment\":\"同意审批\",\"approveUser\":\"5af4c29d275443d3a0b4c50dd4ed8965\"}";
        JSONObject jsonObject= JSONObject.parseObject(json);
        JSONArray arrayNode = (JSONArray) jsonObject.get("assigneeList");
        //System.out.println(Arrays.asList( arrayNode ).toArray( new String[0] ));
       /* System.out.println(jsonObject);
        System.out.println(jsonObject.get("title"));
        System.out.println(arrayNode);
        System.out.println(arrayNode.size());
        System.out.println(getAssignees(jsonObject));
        for(int i=0;i<arrayNode.size();i++){
            System.out.println(((JSONObject)arrayNode.get(i)).get("assignee"));
        }*/

    }
}
