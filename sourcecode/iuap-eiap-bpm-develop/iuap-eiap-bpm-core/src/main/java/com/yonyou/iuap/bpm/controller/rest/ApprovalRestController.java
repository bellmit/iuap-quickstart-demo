package com.yonyou.iuap.bpm.controller.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;
import com.yonyou.iuap.bpm.service.BpmRestVariable;
import com.yonyou.iuap.bpm.service.IBpmRuntimeService;
import com.yonyou.iuap.bpm.service.IProcessCoreService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;
import com.yonyou.iuap.bpm.util.Json2ObjectUtils;
import com.yonyou.iuap.context.InvocationInfoProxy;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping(value = "/approvalRestWithSign")
public class ApprovalRestController {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private IBpmRuntimeService bpmRuntimeServiceImpl;

    @Autowired
    private IProcessCoreService processCoreService;

    @Autowired
    private IProcessService   processService;

    @Autowired
    private UserMappingService eiapBpmUserMappingService;

    /**
     * 获取驳回的流程
     *
     * @param request
     * @param response
     * @throws Exception
     */
    @RequestMapping(value = "/getRejectActivity", method = RequestMethod.POST)
    public void getRejectActivity(HttpServletRequest request,
                                  HttpServletResponse response) throws IOException {
        String pk_workflownote = (String) request.getParameter("pk_workflownote");
        String userid = request.getParameter("userid");

        if (checkParamNotNull(userid, pk_workflownote)) {
            Object result = bpmRuntimeServiceImpl.getRejectActivities(pk_workflownote);
            if (result != null) {
                ObjectNode obj = (ObjectNode) result;
                ObjectMapper mapper = new ObjectMapper();
                String json = mapper.writeValueAsString(obj);
                writeToResponse2(response, json);
            }
        } else {
            writeToResponse(response, null);
            logger.error("参数不完整，请检查！");
        }
    }

    /**
     * 获取审批面板
     *
     * @param request
     * @param response
     */
    @RequestMapping(value = "/doAction", method = RequestMethod.POST)
    public void doWFAction(HttpServletRequest request, HttpServletResponse response) {
        String pk_workflownote = (String) request.getParameter("pk_workflownote");
        String actionCode = (String) request.getParameter("actionCode");
        String processInstanceId = request.getParameter("pk_procdefins");
        String userid = request.getParameter("userid");
        Map<String, String> message = new HashMap<String, String>();
        Gson result = new Gson();
        try {
            String param = URLDecoder.decode(URLDecoder.decode(request.getParameter("param"), "UTF-8"), "UTF-8");
            if (checkParamNotNull(userid, pk_workflownote, actionCode, param)) {
                JSONObject paramJson = JSONObject.fromObject(param);
                String param_note = (String) paramJson.get("param_note");
                if ("agree".equals(actionCode)) {//审批
                    List<BpmRestVariable> restVariables = new ArrayList<BpmRestVariable>();
                    processCoreService.approve(userid, pk_workflownote, param_note, restVariables);
                } else if ("reject".equals(actionCode)) {//驳回
                    String activityId = (String) paramJson.get("param_reject_activity");
                    if (processInstanceId == null) {
                        processInstanceId = (String) paramJson.getString("processInstanceId");
                    }
                    if (activityId.equals("billmaker")) {//驳回到制单人单独处理
                        processService.getRuntimeService().deleteProcessInstance(processInstanceId);
                        message.put("reason", param_note);
                    } else {
                        processCoreService.reject(processInstanceId, activityId, param_note, pk_workflownote);
                        message.put("reason", param_note);
                    }
                } else if ("recall".equals(actionCode)) {//收回
                    processCoreService.withdraw(pk_workflownote);
                } else if ("reassign".equals(actionCode)) {//改派
                    String param_reaassign_user = (String) paramJson.get("param_reaassign_user");
                    String reassign_userid = null;
                    try {
                        reassign_userid = eiapBpmUserMappingService.findUseridByLocalUserId(param_reaassign_user);
                    } catch (Exception e) {
                        logger.error("查询用户同步数据有问题", e);
                    }
                    processCoreService.reassign(pk_workflownote, reassign_userid);
                }
                message.put("success", "true");
                writeToResponse(response, result.toJson(message));
            } else {
                // Logger.error("参数不完整，请检查！");
            }

        } catch (Exception e) {
            logger.error("##doAction 操作失败,原因:" + e.getLocalizedMessage(), e);
            String returnmessage = e.getLocalizedMessage();
            if (StringUtils.isNotBlank(returnmessage) && returnmessage.startsWith("无法找到ID为"))
                returnmessage = "当前任务已经被他人处理！";
            message.put("message", returnmessage);
            try {
                writeToResponse(response, result.toJson(message));
            } catch (IOException e1) {
                logger.error(e1.getMessage(), e1);
            }
        }
    }


    private void writeToResponse(HttpServletResponse response, Object result)
            throws IOException {
        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(result));
        response.flushBuffer();
    }

    private void writeToResponse2(HttpServletResponse response, String result)
            throws IOException {
        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(result);
        response.flushBuffer();
    }

    private boolean checkParamNotNull(String... params) {
        for (String param : params) {
            if (StringUtils.isBlank(param)) {
                return false;
            }
        }
        return true;
    }

}
