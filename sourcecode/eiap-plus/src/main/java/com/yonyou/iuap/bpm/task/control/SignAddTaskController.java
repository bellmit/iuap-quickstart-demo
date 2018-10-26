package com.yonyou.iuap.bpm.task.control;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.service.NotifyService;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import com.yonyou.iuap.bpm.service.ProcessTaskService;
import com.yonyou.iuap.bpm.util.TaskMesTempCodeConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import yonyou.bpm.rest.request.historic.HistoricTaskQueryParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.historic.HistoricTaskInstanceResponse;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "task/signaddtask/")
public class SignAddTaskController extends BpmBaseController {

//    @Autowired
//    private ProcessTaskService processTaskService;

    /***
     * 前加签
     */
    @RequestMapping(value = "/signadd", method = RequestMethod.POST)
    @ResponseBody
    public Object signadd(@RequestBody Map<String, Object> data, HttpServletRequest request, HttpServletResponse response) {
        eval(data);
        JSONObject json = new JSONObject();
        try {
            long t1 = System.currentTimeMillis();
            Object o = bpmService.bpmRestServices(userId).getTaskService().counterSignAddWithComment(taskId, addSignUserList,null);
            bpmService.bpmRestServices(userId).getTaskService().addComment(taskId, comment, true);

            long t2 = System.currentTimeMillis();
            logger.error("调用流程加签的时间为: " + (t2 - t1) + " 毫秒!");
            json.put("flag", "success");
            json.put("msg", MessageSourceUtil.getMessage("ja.tas.con6.0004", "加签成功!"));

            sendMessageForSignAdd();

            try {
                JsonNode historicProcessInstanceNode = (JsonNode) historyService
                        .getHistoricProcessInstance(processInstanceId);
                callbackProcess(approvetype, processInstanceId, historicProcessInstanceNode, CALLBACK_MAPING_ADDSIGN);
            }catch (Exception callException){
                logger.error("回调异常",callException);
            }
        } catch (Exception e) {
            json.put("flag", "faile");
            json.put("msg", MessageSourceUtil.getMessage("ja.tas.con6.0006", "加签失败:") + e.getMessage());
        }
        return json;
    }


    /**
     * 加签环节环节消息
     * @param taskId
     * @param processInstanceId
     * @param userId
     */
    private void sendMessageForSignAdd() {
        try {
            JSONObject hitTaskInfo = queryHisTaskInfo(taskId, processInstanceId, userId);
            HistoricTaskQueryParam histaskParam = new HistoricTaskQueryParam();
            histaskParam.setProcessInstanceId(processInstanceId);
            histaskParam.setParentTaskId(taskId);
            histaskParam.setFinished(false);
            JsonNode tasks = (JsonNode) historyService.getHistoricTaskInstances(histaskParam);
            ArrayNode taskArray = (ArrayNode) tasks.get("data");
            for (int i = 0; i < taskArray.size(); i++) {
                ObjectNode task = (ObjectNode) taskArray.get(i);
                HistoricTaskInstanceResponse taskResp = jsonResultService.toObject(task.toString(), HistoricTaskInstanceResponse.class);
                JSONObject busiData = new JSONObject();
                busiData.put("task.creator", hitTaskInfo.getString("billMarker"));
                busiData.put("task.billcode", hitTaskInfo.getString("code"));
                JSONObject processData = new JSONObject();
                processData.put("processInstanceId", taskResp.getProcessInstanceId());
                processData.put("taskId", taskResp.getId());
                NotifyService.instance().taskNotifyToAssigners(messageservice, hitTaskInfo.getString("funCode"),
                        TaskMesTempCodeConstants.TASK_MES_SIGNADD_CN,
                        new String[]{taskResp.getAssignee()}, busiData, processData);
            }

        } catch (Exception e) {
            logger.error("加签环节发送消息失败", e);
        }
    }
}
