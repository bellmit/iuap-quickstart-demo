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
            String title = userName + "???????????????,?????????" + entity.getBpmBillCode() + ", ?????????";
            bpmform.setTitle(title);
            // ?????????
            bpmform.setFunCode("iuap_test_order");
            // ??????id
            bpmform.setFormId(entity.getId().toString());
            // ?????????
            bpmform.setBillNo(entity.getBpmBillCode());
            // ?????????
            bpmform.setBillMarker(InvocationInfoProxy.getUserid());
            // ????????????
            bpmform.setOtherVariables(buildEntityVars(entity));
            // ??????url
            bpmform.setFormUrl("/fe/test_demo#/TestDemo-edit?btnFlag=2&search_id=" + entity.getId());  // ??????url
            // ??????????????????
            bpmform.setProcessInstanceName(title);                                                                              // ??????????????????
            // ??????????????????????????????????????????(controller??????URI??????)
            bpmform.setServiceClass("/demoOrder/TEST_DEMO");// ??????????????????????????????????????????(controller??????URI??????)
            //???????????????????????? uui/react
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
            //?????????????????????????????????
            JSONObject resultJsonObject = this.bpmSubmitBasicService.submit(bpmjson);
            JSONObject taskObject = JSONArray.parseArray(resultJsonObject.getString("data")).getJSONObject(0);
            //???????????????activityId
            String taskDefinitionKey = taskObject.getString("taskDefinitionKey");
            //???????????????activityName
            String taskDefinitionName = taskObject.getString("name");
            /**
             * ????????????????????????
             */
            AssignInfo assignInfo = new AssignInfo();
            AssignInfoItem infoItem = new AssignInfoItem();
            infoItem.setActivityId(taskDefinitionKey);
            infoItem.setActivityName(taskDefinitionName);
            Participant participant = new Participant();
            participant.setId("3a074c3592ff429c904d0a5448775d83");//??????ID
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
            throw new BusinessException("??????????????????????????????");
        } else {
            hisProc = (Map)historicProcessInstanceNode;
            billId = hisProc.get("businessKey").toString();
            if (StringUtil.isEmpty(billId)) {
                billId = String.valueOf(params.get("billId"));
            }

            if(StringUtil.isEmpty(hisProc.get("processDefinitionId").toString())){
                throw new RuntimeException("??????processDefinitionId??????");
            }
            processDefineCode = hisProc.get("processDefinitionId").toString().split(":")[0];
        }
        TestDemo entity = this.findById(billId);
        BPMFormJSON bpmjson = this.buildBPMFormJSON(processDefineCode,entity);
        //?????????????????????????????????
        JSONObject resultJsonObject = this.bpmSubmitBasicService.submit(bpmjson);
        JSONObject taskObject = JSONArray.parseArray(resultJsonObject.getString("data")).getJSONObject(0);
        //???????????????activityId
        String taskDefinitionKey = taskObject.getString("taskDefinitionKey");
        //???????????????activityName
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

