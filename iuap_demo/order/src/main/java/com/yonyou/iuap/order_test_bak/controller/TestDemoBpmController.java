package com.yonyou.iuap.order_test.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.baseservice.bpm.controller.GenericBpmController;
import com.yonyou.iuap.baseservice.bpm.utils.BpmExUtil;
import com.yonyou.iuap.bpm.pojo.BPMFormJSON;
import com.yonyou.iuap.bpm.service.BPMSubmitBasicService;
import com.yonyou.iuap.bpm.service.ProcessService;
import com.yonyou.iuap.order_test.entity.TestDemo;
import com.yonyou.iuap.order_test.service.TestDemoBpmService;
import com.yonyou.iuap.order_test.service.TestDemoService;
import com.yonyou.iuap.persistence.vo.pub.BusinessException;
import com.yonyou.iuap.persistence.vo.pub.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import yonyou.bpm.rest.RepositoryService;
import yonyou.bpm.rest.RuntimeService;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.*;
import yonyou.bpm.rest.request.repository.ProcessDefinitionQueryParam;
import yonyou.bpm.rest.request.runtime.ProcessInstanceParam;
import yonyou.bpm.rest.request.runtime.ProcessInstanceStartParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.runtime.process.AssignInfoItemResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 说明：测试样例 流程控制Controller——提供流程提交、收回、审批回调等rest接口
 *
 * @date 2018-10-19 9:43:29
 */
@Controller
@RequestMapping(value = "/TEST_DEMO")
public class TestDemoBpmController extends GenericBpmController<TestDemo> {

    private Logger logger = LoggerFactory.getLogger(TestDemoController.class);


    private TestDemoBpmService service;

    @Autowired
    public void setService(TestDemoBpmService service) {
        this.service = service;
        super.setService(service);
    }

    @RequestMapping("/submitOver")
    @ResponseBody
    public Object submitOver(@RequestBody List<TestDemo> list, HttpServletRequest request, HttpServletResponse response) {
        String processDefineCode = request.getParameter("processDefineCode");
        try{
            service.assignSubmit(list,processDefineCode);
        }catch (Exception e){
            return buildGlobalError("提交失败");
        }

        return buildSuccess(list);
    }


    @RequestMapping("/submitNext")
    @ResponseBody
    public Object submitNext(@RequestBody TestDemo testDemo,HttpServletRequest request,HttpServletResponse response){
        String processDefineCode = "eiap386122";
        try{
            List<TestDemo> list = new ArrayList<>();
            list.add(testDemo);
            service.submitNext(testDemo,processDefineCode);
        }catch (Exception e){
            return buildGlobalError("提交失败");
        }
        return buildSuccess(testDemo);
    }


}
