package com.yonyou.iuap.order.controller;

import com.yonyou.iuap.baseservice.bpm.controller.GenericBpmController;
import com.yonyou.iuap.order.entity.DemoOrder;
import com.yonyou.iuap.order.service.DemoOrderBpmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 说明：demo订单 流程控制Controller——提供流程提交、收回、审批回调等rest接口
 * 
 * @date 2018-10-11 16:21:09
 */
@Controller
@RequestMapping(value="/demo_order")
public class DemoOrderBpmController extends GenericBpmController<DemoOrder>{
    
    private Logger logger = LoggerFactory.getLogger(DemoOrderController.class);


    private DemoOrderBpmService service;
    @Autowired
    public void setService(DemoOrderBpmService service) {
        this.service = service;
        super.setService(service);
    }

}
