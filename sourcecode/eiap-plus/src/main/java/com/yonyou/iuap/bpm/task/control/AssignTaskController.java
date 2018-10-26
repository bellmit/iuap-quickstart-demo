package com.yonyou.iuap.bpm.task.control;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.yonyou.iuap.base.utils.RestUtils;
import com.yonyou.iuap.mvc.type.JsonResponse;
import com.yonyou.iuap.utils.PropertyUtil;
import com.yonyou.iuap.i18n.MessageSourceUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.RestVariable;
import yonyou.bpm.rest.request.task.TaskResourceParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/***
 * 指派控制层
 */
@Controller
@RequestMapping(value = "task/assigntask/")
public class AssignTaskController extends BpmBaseController {


    /***
     * 提交指派动作
     * @param data
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/commit", method = RequestMethod.POST)
    @ResponseBody
    public Object commit(@RequestBody Map<String, Object> data, HttpServletRequest request, HttpServletResponse response) {
        //参数处理
        eval(data);
        //指派审批
        try {
            //抄送
            boolean copyOk=copyToUsers();
            //审批
            boolean completeOk=complete();
            //流程回调业务
            boolean callbackOk=callbackProcess();
            //返回
            if(completeOk && callbackOk) {
            	return buildJsonSuccess(MessageSourceUtil.getMessage("ja.tas.con.0002", "审批成功!"));
            }else {
                return buildJsonFail(errMsg);
            }
        } catch (Exception e) {
        	return buildJsonFail(MessageSourceUtil.getMessage("ja.tas.con.0003", "审批失败：") + e.getMessage());
        }
    }

    /***
     * 审批处理函数
     */
    private boolean complete(){
        try {
            long t1 = System.currentTimeMillis();
            logger.debug(MessageSourceUtil.getMessage("ja.tas.con.0004", "审批处理开始"));
            //添加审批类型
            TaskResourceParam taskParam = new TaskResourceParam();
            taskParam.setDescription(approvetype);
            taskService.updateTask(taskId, taskParam);
            logger.debug("开始指派审批");
            //添加审批类型变量
            List<RestVariable> variables =new ArrayList<RestVariable>();
            RestVariable approveVari = new RestVariable();
            approveVari.setName("approvetype");
            approveVari.setValue(approvetype);
            variables.add(approveVari);
            //带指派审批
            taskService.completeWithComment(taskId, variables, assignInfo, null, comment);
            sendMessageForNextActiOrProcessEnd();

            long t2 = System.currentTimeMillis();
            logger.debug("调用流程审批的时间为: {}毫秒!",t2-t1);
            return true;
        }catch (Exception e){
            errMsg=e.getMessage();
            logger.error("指派审批错误：{}",e);
            return false;
        }
    }

    /**
     * 流程回调业务
     * @return
     */
    private boolean callbackProcess() throws RestException {
        try {
            long l=System.currentTimeMillis();
            logger.debug(MessageSourceUtil.getMessage("ja.tas.con.0008", "开始处理回调"));
            JsonNode historicProcessInstanceNode  = (JsonNode) historyService
                    .getHistoricProcessInstance(processInstanceId);
            boolean flag=callbackProcess(approvetype,processInstanceId,historicProcessInstanceNode,CALLBACK_MAPING_APPROVE);
            logger.debug("处理回调完毕，耗时{}毫秒",System.currentTimeMillis()-l);
            return flag;
        }catch (Exception e){
            logger.error("{}",e);
            return false;
        }

    }
}
