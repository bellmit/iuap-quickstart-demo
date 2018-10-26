package com.yonyou.iuap.bpm.task.control;

import com.yonyou.iuap.context.InvocationInfoProxy;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.task.MessageResourceParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 抄送任务
 */
@Deprecated
@Controller
@RequestMapping(value = "task/copytask/")
public class CopyTaskController extends BpmBaseController {


    @RequestMapping(value = "/copy", method = RequestMethod.POST)
    @ResponseBody
    public Object reject(@RequestBody Map<String, String> data,
                         HttpServletRequest request, HttpServletResponse response) {
        String userId = InvocationInfoProxy.getUserid();
        MessageResourceParam messageResourceParam = new MessageResourceParam();
        try {
            bpmService.bpmRestServices(userId).getTaskService().copyMessages(null);
        } catch (RestException e) {
            e.printStackTrace();
        }
        return null;
    }
}
