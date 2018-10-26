package com.yonyou.iuap.bpm.task.control;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.yonyou.iuap.bpm.service.NotifyService;
import com.yonyou.iuap.bpm.util.TaskMesTempCodeConstants;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.historic.HistoricProcessInstancesQueryParam;
import yonyou.bpm.rest.response.historic.HistoricProcessInstanceResponse;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;
import yonyou.bpm.rest.utils.BaseUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Controller
@RequestMapping(value = "task/withdrawtask/")
public class WithdrawTaskController extends BpmBaseController {

    /**
     * 弃审操作
     * 给当前弃审人发送审批消息
     * @param data
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/withdraw", method = RequestMethod.POST)
    @ResponseBody
    public Object withdraw(@RequestBody Map<String, Object> data, HttpServletRequest request, HttpServletResponse response) {
        eval(data);
        JSONObject json = new JSONObject();
        //得到流程实例参数
        //制单人同组织，要校验传的组织，如果没有，则找制单人的组织
        Map<String, Object> varMap=getProcinstVaries(processInstanceId);
        String orgId=varMap.get("orgId")==null?"":varMap.get("orgId").toString();

        boolean completedWithdraw=checkHistoricTask();

        logger.debug("终审弃审：{}",completedWithdraw);
        try {
            if (taskId == null || StringUtils.isBlank(taskId)) {
            	json.put("msg", MessageSourceUtil.getMessage("ja.tas.con8.0002", "任务ID不能为空!"));
            }
            JsonNode newTaskNode = (JsonNode) bpmService.bpmRestServices(userId, orgId).getTaskService().withdrawTaskReturnNewTask(taskId);
            json.put("flag", "success");
            json.put("msg", MessageSourceUtil.getMessage("ja.tas.con8.0003", "弃审成功!"));

            try {
                sendMessageForWithdraw(taskId, userId, processInstanceId, newTaskNode);
            }catch (Exception notifyException){

            }
            try {
                JsonNode historicProcessInstanceNode = (JsonNode) historyService
                        .getHistoricProcessInstance(processInstanceId);
                logger.debug("弃审实例：{}",historicProcessInstanceNode!=null?historicProcessInstanceNode.textValue():null);
                logger.debug("弃审回调开始");
                callbackProcess(approvetype, processInstanceId, historicProcessInstanceNode, completedWithdraw?CALLBACK_MAPING_COMPLETEDWITHDRAW:CALLBACK_MAPING_WITHDRAW);
                logger.debug("弃审回调结束");
            }catch (Exception callException){
                logger.error("回调异常",callException);
            }
        } catch (RestException e) {
            logger.error("调用流程审批报错!", e);
            json.put("msg", MessageSourceUtil.getMessage("ja.tas.con8.0006", "调用流程审批报错:")+e.getMessage());

        } catch (Exception e) {
            logger.error("弃审报错!", e);
            json.put("msg", MessageSourceUtil.getMessage("ja.tas.con8.0006", "调用流程审批报错:")+e.getMessage());
        }

        return json;
    }

    /***
     * 任务为终审弃审批
     * @return
     */
    private boolean checkHistoricTask() {
        try {
            HistoricProcessInstancesQueryParam param = new HistoricProcessInstancesQueryParam();
            param.setProcessInstanceId(processInstanceId);
            param.setIncludeProcessVariables(true);
            JsonNode jsonNode =  (JsonNode)  bpmService.bpmRestServices(userId).getHistoryService().getHistoricProcessInstances(param);
            ArrayNode nodes = BaseUtils.getData(jsonNode);
            if (nodes != null && nodes.size() > 0) {
                HistoricProcessInstanceResponse instanceResponse = jsonResultService.toObject(nodes.get(0).toString(), HistoricProcessInstanceResponse.class);
                if (instanceResponse.getEndTime()!=null){
                    return true;
                }
            }

        }catch (Exception e){
            logger.error("{}",e);
        }
        return false;
    }

    /**
     * 弃审发送消息
     * @param taskId
     * @param userId
     * @param processInstanceId
     */
    private void sendMessageForWithdraw( String taskId,String userId , String processInstanceId, JsonNode newTaskNode) {
        try {
            logger.debug("弃审后,发送消息给审批人");
            TaskResponse taskResponse = jsonResultService.toObject(newTaskNode.toString(), TaskResponse.class);
            JSONObject hitTaskInfo  = queryHisTaskInfo(taskId, processInstanceId,userId);
            JSONObject busiData = new JSONObject();
            busiData.put("task.creator", hitTaskInfo.getString("billMarker"));
            busiData.put("task.billcode", hitTaskInfo.getString("code"));
            JSONObject processData = new JSONObject();
            processData.put("processInstanceId", processInstanceId);
            processData.put("taskId", taskResponse.getId());
            NotifyService.instance().taskNotifyToAssigners(messageservice, hitTaskInfo.getString("funCode"),TaskMesTempCodeConstants.TASK_MES_WITHDRAW_CN,
                    new String[] {taskResponse.getAssignee()}, busiData,processData);
        } catch (Exception e) {
            logger.error("弃审环节发送消息失败", e);
        }
    }
}
