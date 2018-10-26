package com.yonyou.iuap.orderinfo.controller;

import com.yonyou.iuap.baseservice.bpm.controller.GenericBpmController;
import com.yonyou.iuap.orderinfo.entity.OrderInfo;
import com.yonyou.iuap.orderinfo.service.OrderInfoBpmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 说明：单表orderinfo 流程控制Controller——提供流程提交、收回、审批回调等rest接口
 * 
 * @date 2018-9-27 18:45:36
 */
@Controller
@RequestMapping(value="/order_info")
public class OrderInfoBpmController extends GenericBpmController<OrderInfo>{
    
    private Logger logger = LoggerFactory.getLogger(OrderInfoController.class);


    private OrderInfoBpmService service;
    @Autowired
    public void setService(OrderInfoBpmService service) {
        this.service = service;
        super.setService(service);
    }

}
