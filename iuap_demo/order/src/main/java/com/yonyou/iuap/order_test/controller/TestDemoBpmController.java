package com.yonyou.iuap.order_test.controller;

import com.yonyou.iuap.baseservice.bpm.controller.GenericBpmController;
import com.yonyou.iuap.order_test.entity.TestDemo;
import com.yonyou.iuap.order_test.service.TestDemoBpmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 说明：测试样例 流程控制Controller——提供流程提交、收回、审批回调等rest接口
 * 
 * @date 2018-10-22 9:43:26
 */
@Controller
@RequestMapping(value="/TEST_DEMO")
public class TestDemoBpmController extends GenericBpmController<TestDemo>{
    
    private Logger logger = LoggerFactory.getLogger(TestDemoController.class);


    private TestDemoBpmService service;
    @Autowired
    public void setService(TestDemoBpmService service) {
        this.service = service;
        super.setService(service);
    }

}
