package com.yonyou.iuap.bpm.approval.adapter;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.common.base.message.CommonMessageSendService;
import com.yonyou.iuap.bpm.common.base.message.TaskMesTempCodeConstants;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmMessageService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.util.BpmJsonResultService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yonyou.bpm.rest.request.historic.HistoricProcessInstancesQueryParam;
import yonyou.bpm.rest.request.runtime.ProcessInstanceParam;
import yonyou.bpm.rest.response.historic.HistoricProcessInstanceResponse;
import yonyou.bpm.rest.response.runtime.process.ProcessInstanceResponse;

@Service
public class MessageServiceAdpt implements IEiapBpmMessageService {



    private static final Logger logger = LoggerFactory.getLogger(MessageServiceAdpt.class);

    @Autowired
    private IProcessService processService;

    @Autowired
    protected CommonMessageSendService messageservice;

    @Autowired
    private BpmJsonResultService bpmJsonResultService;

    @Override
    public void sendMesForSuspendProcInst(String procInstId) {
        try {
            ProcessInstanceParam processInstanceParam =  new ProcessInstanceParam();
            processInstanceParam.setId(procInstId);
            processInstanceParam.setIncludeProcessVariables(true);
            processInstanceParam.setSuspended(true);
            Object obj = processService.getRuntimeService().getProcessInstances(processInstanceParam);
            JSONObject jsonObj = JSONObject.parseObject(obj.toString());
            if (jsonObj != null && !jsonObj.isEmpty() && jsonObj.containsKey("data")) {
                JSONArray array = jsonObj.getJSONArray("data");
                if (array != null && array.size() > 0) {
                    JSONObject item = (JSONObject) array.get(0);
                    ProcessInstanceResponse processInstanceResponse = JSON.toJavaObject(item, ProcessInstanceResponse.class);
                    JSONArray resp = (JSONArray) item.get("variables");
                    String title="";String code="";String businessKey="";String billMarker="";
                    String funCode = "";
                    for(int i=0;i<resp.size();i++){
                        JSONObject r = (JSONObject) resp.get(i);
                        try {
                            if(r.getString("name").equalsIgnoreCase("title")){
                                title=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("code")){
                                code=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("id")){
                                businessKey=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("billMarker")){
                                billMarker=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("funCode")){
                                funCode=r.getString("value");
                            }
                        }catch (Exception e){
                            logger.error("流程变量错误：{}",e.getMessage());
                        }

                    }
                    JSONObject busiData = new JSONObject();
                    busiData.put("task.creator", billMarker);
                    busiData.put("task.billcode", code);
                    JSONObject processData = new JSONObject();
                    processData.put("processInstanceId", procInstId);
                    NotifyService.instance().taskNotifyToAssigners(messageservice, funCode,
                            TaskMesTempCodeConstants.TASK_MES_SUSPENDPROC_CN, new String[] { billMarker },
                            busiData, processData);
                }
            }

        } catch (Exception e) {
            logger.error("发送给制单人消息实现",e);
        }

    }

    @Override
    public void sendMesForActivateProcInst(String procInstId) {
        try {
            ProcessInstanceParam processInstanceParam =  new ProcessInstanceParam();
            processInstanceParam.setId(procInstId);
            processInstanceParam.setIncludeProcessVariables(true);
            processInstanceParam.setSuspended(false);
            Object obj = processService.getRuntimeService().getProcessInstances(processInstanceParam);
            JSONObject jsonObj = JSONObject.parseObject(obj.toString());
            if (jsonObj != null && !jsonObj.isEmpty() && jsonObj.containsKey("data")) {
                JSONArray array = jsonObj.getJSONArray("data");
                if (array != null && array.size() > 0) {
                    JSONObject item = (JSONObject) array.get(0);
                    ProcessInstanceResponse processInstanceResponse = JSON.toJavaObject(item, ProcessInstanceResponse.class);
                    JSONArray resp = (JSONArray) item.get("variables");
                    String title="";String code="";String businessKey="";String billMarker="";
                    String funCode = "";
                    for(int i=0;i<resp.size();i++){
                        JSONObject r = (JSONObject) resp.get(i);
                        try {
                            if(r.getString("name").equalsIgnoreCase("title")){
                                title=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("code")){
                                code=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("id")){
                                businessKey=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("billMarker")){
                                billMarker=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("funCode")){
                                funCode=r.getString("value");
                            }
                        }catch (Exception e){
                            logger.error("流程变量错误：{}",e.getMessage());
                        }

                    }
                    JSONObject busiData = new JSONObject();
                    busiData.put("task.creator", billMarker);
                    busiData.put("task.billcode", code);
                    JSONObject processData = new JSONObject();
                    processData.put("processInstanceId", procInstId);
                    NotifyService.instance().taskNotifyToAssigners(messageservice, funCode,
                            TaskMesTempCodeConstants.TASK_MES_ACTIVATEPROC_CN, new String[] { billMarker },
                            busiData, processData);
                }
            }

        } catch (Exception e) {
            logger.error("发送给制单人消息实现",e);
        }
    }

    @Override
    public void sendMesForStopProcInst(String procInstId) {
        try {
            HistoricProcessInstancesQueryParam hisProcInsQuery =  new HistoricProcessInstancesQueryParam();
            hisProcInsQuery.setProcessInstanceId(procInstId);
            hisProcInsQuery.setIncludeProcessVariables(true);
            Object obj = processService.getHistoryService().getHistoricProcessInstances(hisProcInsQuery);
            JSONObject jsonObj = JSONObject.parseObject(obj.toString());
            if (jsonObj != null && !jsonObj.isEmpty() && jsonObj.containsKey("data")) {
                JSONArray array = jsonObj.getJSONArray("data");
                if (array != null && array.size() > 0) {
                    JSONObject item = (JSONObject) array.get(0);
                    HistoricProcessInstanceResponse processInstanceResponse = bpmJsonResultService.toObject(item.toJSONString(), HistoricProcessInstanceResponse.class);
                    JSONArray resp = (JSONArray) item.get("variables");
                    String title="";String code="";String businessKey="";String billMarker="";
                    String funCode = "";
                    for(int i=0;i<resp.size();i++){
                        JSONObject r = (JSONObject) resp.get(i);
                        try {
                            if(r.getString("name").equalsIgnoreCase("title")){
                                title=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("code")){
                                code=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("id")){
                                businessKey=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("billMarker")){
                                billMarker=r.getString("value");
                            }
                            if(r.getString("name").equalsIgnoreCase("funCode")){
                                funCode=r.getString("value");
                            }
                        }catch (Exception e){
                            logger.error("流程变量错误：{}",e.getMessage());
                        }

                    }
                    JSONObject busiData = new JSONObject();
                    busiData.put("task.creator", billMarker);
                    busiData.put("task.billcode", code);
                    JSONObject processData = new JSONObject();
                    processData.put("processInstanceId", procInstId);
                    NotifyService.instance().taskNotifyToAssigners(messageservice, funCode,
                            TaskMesTempCodeConstants.TASK_MES_STOPPROC_CN, new String[] { billMarker },
                            busiData, processData);
                }
            }

        } catch (Exception e) {
            logger.error("发送给制单人消息实现",e);
        }
    }
}
