package com.yonyou.iuap.bpm.controller.base;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.yonyou.iuap.bpm.entity.adpt.insthistory.BpmProcInstHistroyAdpt;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.util.BpmJsonResultService;
import com.yonyou.iuap.bpm.util.RestUtils;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.mvc.type.JsonResponse;
import com.yonyou.iuap.utils.PropertyUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.historic.HistoricVariableQueryParam;
import yonyou.bpm.rest.response.RestVariableResponse;

import java.util.HashMap;
import java.util.Map;

public class BpmBaseController {
    String CALLBACK_MAPING_PREFIX="/bpmcallback";
    String CALLBACK_MAPING_APPROVE=CALLBACK_MAPING_PREFIX+ "/doApprove";
    String CALLBACK_MAPING_TERMINATION=CALLBACK_MAPING_PREFIX+ "/doTermination";
    String CALLBACK_MAPING_REJECTMARKERBILL=CALLBACK_MAPING_PREFIX+ "/doRejectMarkerBill";
    String CALLBACK_MAPING_REJECT=CALLBACK_MAPING_PREFIX+"/doReject";
    String CALLBACK_MAPING_ADDSIGN=CALLBACK_MAPING_PREFIX+"/doAddSign";
    String CALLBACK_MAPING_DELEGATE=CALLBACK_MAPING_PREFIX+"/doDelegate";
    String CALLBACK_MAPING_ASSIGN=CALLBACK_MAPING_PREFIX+"/doAssign";
    String CALLBACK_MAPING_WITHDRAW=CALLBACK_MAPING_PREFIX+"/doWithdraw";
    String CALLBACK_MAPING_COMPLETEDWITHDRAW=CALLBACK_MAPING_PREFIX+"/doCompletedWithdraw";
    String CALLBACK_MAPING_SUSPEND=CALLBACK_MAPING_PREFIX+"/doSuspend";
    String CALLBACK_MAPING_ACTIVATE=CALLBACK_MAPING_PREFIX+"/doActivate";

    private Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private BpmJsonResultService bpmJsonResultService;

    @Autowired
    private IProcessService processService;
    /**
     * 得到流程实例的变量
     * @param processInstanceId
     * @return
     */
    public Map<String, Object> getProcinstVaries(String processInstanceId) {
        HistoricVariableQueryParam paramHistoricVariableQueryParam = new HistoricVariableQueryParam();
        paramHistoricVariableQueryParam.setProcessInstanceId(processInstanceId);
        String userId = InvocationInfoProxy.getUserid();
        JsonNode historicVariableInstances=null;
        try {
            historicVariableInstances = (JsonNode) this.processService.getHistoryService()
                    .getHistoricVariableInstances(
                            paramHistoricVariableQueryParam);
        } catch (RestException e) {
            logger.error("调用流程变量报错!", e);
        } catch (Exception e) {
            logger.error("变量报错!", e);
        }
        Map<String, Object> varMap=null;
        if(historicVariableInstances!=null){
            ArrayNode varilist = (ArrayNode) historicVariableInstances.get("data");
            varMap = new HashMap<String, Object>(varilist.size());
            for (int i = 0; i < varilist.size(); i++) {
                JsonNode jn = varilist.get(i);
                RestVariableResponse var = bpmJsonResultService.toObject(
                        jn.get("variable").toString(), RestVariableResponse.class);
                varMap.put(var.getName(), var.getValue());
            }
        }

        return varMap;
    }

    public void bpmCallback(String procInstId, String approvetype,String callName, BpmProcInstHistroyAdpt historicProcessInstanceNode) {
        long begin=System.currentTimeMillis();
        logger.debug("开始流程回调");
        JsonResponse jsonResponse = new JsonResponse();
        try {
            String controlURL = (String) getProcinstVaries(procInstId).get("serviceClass");
            String url = controlURL + callName;
            url = PropertyUtil.getPropertyByKey("base.url") + url;
            JSONObject requestBody = new JSONObject();
            requestBody.put("approvetype", approvetype);
            requestBody.put("processInstanceId", procInstId);
            requestBody.put("historicProcessInstanceNode", historicProcessInstanceNode);
            logger.error("回调URL：{}",url);
            logger.debug("回调URL：{}",url);
            logger.debug("回调参数：{}",JSONObject.toJSONString(requestBody));
            jsonResponse = RestUtils.getInstance().doPost(url, requestBody, JsonResponse.class);
            logger.debug("回调返回：{}",JSONObject.toJSONString(jsonResponse));
            logger.debug("回调耗时：{}毫秒",System.currentTimeMillis()-begin);

        }catch (Exception e){
            logger.error("回调出错：{}",e);
            jsonResponse.setMessage("回调出错："+e.getMessage());
            logger.debug("回调出错耗时：{}毫秒",System.currentTimeMillis()-begin);

        }
    }
}
