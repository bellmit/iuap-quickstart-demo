package com.yonyou.iuap.order_test.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.yonyou.iuap.baseservice.bpm.entity.BpmSimpleModel;
import com.yonyou.iuap.baseservice.bpm.service.GenericBpmService;
import com.yonyou.iuap.bpm.pojo.BPMFormJSON;
import com.yonyou.iuap.bpm.service.BPMSubmitBasicService;
import com.yonyou.iuap.bpm.service.ProcessService;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.order_test.dao.TestDemoMapper;
import com.yonyou.iuap.order_test.entity.TestDemo;
import com.yonyou.iuap.persistence.vo.pub.BusinessException;
import com.yonyou.iuap.persistence.vo.pub.util.StringUtil;
import net.sf.json.JSONNull;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.*;
import yonyou.bpm.rest.response.runtime.process.AssignInfoItemResponse;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TestDemoBpmService extends GenericBpmService<TestDemo> {

    private Logger logger = LoggerFactory.getLogger(TestDemoBpmService.class);

    private TestDemoMapper TestDemoMapper;

    @Autowired
    ProcessService processService;

    @Autowired
    public void setTestDemoMapper(TestDemoMapper TestDemoMapper) {
        this.TestDemoMapper = TestDemoMapper;
        super.setIbatisMapperEx(TestDemoMapper);
    }

    @Autowired
    private BPMSubmitBasicService bpmSubmitBasicService;

    @Override
    public BPMFormJSON buildBPMFormJSON(String processDefineCode, TestDemo entity) {
        try {
            BPMFormJSON bpmform = new BPMFormJSON();
            bpmform.setProcessDefinitionKey(processDefineCode);
            String userName = InvocationInfoProxy.getUsername();
            try {
                userName = URLDecoder.decode(userName, "utf-8");
                userName = URLDecoder.decode(userName, "utf-8");
            } catch (UnsupportedEncodingException e) {
                userName = InvocationInfoProxy.getUsername();
            }
            //title
            String title = userName + "提交的单据,单号是" + entity.getBpmBillCode() + ", 请审批";
            bpmform.setTitle(title);
            // 实例名
            bpmform.setFunCode("iuap_test_order");
            // 单据id
            bpmform.setFormId(entity.getId().toString());
            // 单据号
            bpmform.setBillNo(entity.getBpmBillCode());
            // 制单人
            bpmform.setBillMarker(InvocationInfoProxy.getUserid());
            // 其他变量
            bpmform.setOtherVariables(buildEntityVars(entity));
            // 单据url
            bpmform.setFormUrl("/fe/test_demo#/TestDemo-edit?btnFlag=2&search_id=" + entity.getId());  // 单据url
            // 流程实例名称
            bpmform.setProcessInstanceName(title);                                                                              // 流程实例名称
            // 流程审批后，执行的业务处理类(controller对应URI前缀)
            bpmform.setServiceClass("/demoOrder/TEST_DEMO");// 流程审批后，执行的业务处理类(controller对应URI前缀)
            //设置单据打开类型 uui/react
            bpmform.setFormType(BPMFormJSON.FORMTYPE_REACT);
            return bpmform;
        } catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @Autowired
    private ProcessService bpmServioce;

    public void submitNext(TestDemo testDemo, String processDefineCode){
        BPMFormJSON bpmjson = this.buildBPMFormJSON(processDefineCode,testDemo);
        JSONObject resultJsonObject = this.bpmSubmitBasicService.submit(bpmjson); //processInstanceId
        JSONObject taskObject = JSONArray.parseArray(resultJsonObject.getString("data")).getJSONObject(0);
        String processInstanceId = taskObject.getString("processInstanceId");
        try {
            this.bpmServioce.bpmRestServices(bpmjson).getTaskService().complete(processInstanceId);
        } catch (RestException e) {
            e.printStackTrace();
        }
    }

    public void assignSubmit(List<TestDemo> list, String processDefineCode) {

        for(TestDemo testDemo : list){
            BPMFormJSON bpmjson = this.buildBPMFormJSON(processDefineCode,testDemo);
            //获取流程下一个节点信息
            JSONObject resultJsonObject = this.bpmSubmitBasicService.submit(bpmjson);
            JSONObject taskObject = JSONArray.parseArray(resultJsonObject.getString("data")).getJSONObject(0);
            //获取流程的activityId
            String taskDefinitionKey = taskObject.getString("taskDefinitionKey");
            //获取流程的activityName
            String taskDefinitionName = taskObject.getString("name");
            /**
             * 选择人员进行指派
             */
            AssignInfo assignInfo = new AssignInfo();
            AssignInfoItem infoItem = new AssignInfoItem();
            infoItem.setActivityId(taskDefinitionKey);
            infoItem.setActivityName(taskDefinitionName);
            Participant participant = new Participant();
            participant.setId("3a074c3592ff429c904d0a5448775d83");//用户ID
            infoItem.setParticipants(new Participant[]{participant});
            assignInfo.setAssignInfoItems(new AssignInfoItem[]{infoItem});

            List copyUserParticipants = null;
            testDemo.setBpmStatus(taskDefinitionName);

            this.assignSubmitEntity(testDemo, processDefineCode, assignInfo, copyUserParticipants) ;

        }
    }

    public TestDemo submitNext(Map<String, Object> params){
        Map hisProc = new HashMap<>();
        String billId = null;
        String processDefineCode = null;

        Object historicProcessInstanceNode = params.get("historicProcessInstanceNode");
        if (historicProcessInstanceNode == null) {
            throw new BusinessException("流程终止回调参数为空");
        } else {
            hisProc = (Map)historicProcessInstanceNode;
            billId = hisProc.get("businessKey").toString();
            if (StringUtil.isEmpty(billId)) {
                billId = String.valueOf(params.get("billId"));
            }

            if(StringUtil.isEmpty(hisProc.get("processDefinitionId").toString())){
                throw new RuntimeException("获取processDefinitionId失败");
            }
            processDefineCode = hisProc.get("processDefinitionId").toString().split(":")[0];
        }
        TestDemo entity = this.findById(billId);
        BPMFormJSON bpmjson = this.buildBPMFormJSON(processDefineCode,entity);
        //获取流程下一个节点信息
        JSONObject resultJsonObject = this.bpmSubmitBasicService.submit(bpmjson);
        JSONObject taskObject = JSONArray.parseArray(resultJsonObject.getString("data")).getJSONObject(0);
        //获取流程的activityId
        String taskDefinitionKey = taskObject.getString("taskDefinitionKey");
        //获取流程的activityName
        String taskDefinitionName = taskObject.getString("name");

        Object endTime = hisProc.get("endTime");
        if (endTime != null && endTime != JSONNull.getInstance() && !"".equals(endTime)) {
            entity.setBpmState(2);
        } else {
            entity.setBpmState(1);
        }
        entity.setBpmStatus(taskDefinitionName);
        logger.error(taskDefinitionName);
        return this.save(entity);

    }
}

