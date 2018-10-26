package com.yonyou.iuap.duban.service;

import com.yonyou.iuap.baseservice.bpm.service.GenericBpmService;
import com.yonyou.iuap.bpm.pojo.BPMFormJSON;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.duban.dao.DubanMapper;
import com.yonyou.iuap.duban.entity.Duban;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/**
 * BPM 服务层
 */
@Service
public class DubanBpmService extends GenericBpmService<Duban>{

    private DubanMapper DubanMapper;

    @Autowired
    public void setDubanMapper(DubanMapper DubanMapper) {
        this.DubanMapper = DubanMapper;
        super.setIbatisMapperEx(DubanMapper);
    }

    @Override
    public BPMFormJSON buildBPMFormJSON(String processDefineCode, Duban entity) {
        try {
            BPMFormJSON bpmform = new BPMFormJSON();
            bpmform.setProcessDefinitionKey(processDefineCode);
            String userName = InvocationInfoProxy.getUsername();
            try {
                userName = URLDecoder.decode(userName,"utf-8");
                userName = URLDecoder.decode(userName,"utf-8");
            } catch (UnsupportedEncodingException e) {
                userName =InvocationInfoProxy.getUsername();
            }
            //title
            String title = userName + "提交的单据,单号是" + entity.getBpmBillCode() + ", 请审批";
            bpmform.setTitle(title);
            // 实例名
            bpmform.setFunCode("Duban");
            // 单据id
            bpmform.setFormId(entity.getId().toString());
            // 单据号
            bpmform.setBillNo(entity.getBpmBillCode());
            // 制单人
            bpmform.setBillMarker(InvocationInfoProxy.getUserid());
            // 其他变量
            bpmform.setOtherVariables(buildEntityVars(entity));
            // 单据url
            bpmform.setFormUrl("/react_example_fe/duban/#/Duban-edit?btnFlag=2&search_id="+entity.getId());  // 单据url
            // 流程实例名称
            bpmform.setProcessInstanceName(title);                                                                              // 流程实例名称
            // 流程审批后，执行的业务处理类(controller对应URI前缀)
            bpmform.setServiceClass("/react_example/DUBAN");// 流程审批后，执行的业务处理类(controller对应URI前缀)
            //设置单据打开类型 uui/react
            bpmform.setFormType(BPMFormJSON.FORMTYPE_REACT);
            return bpmform;
        } catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }
}

