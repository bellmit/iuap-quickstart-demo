package com.yonyou.iuap.order.controller;
import com.yonyou.iuap.baseservice.print.controller.GenericPrintController;
import com.yonyou.iuap.mvc.constants.RequestStatusEnum;
import com.yonyou.iuap.baseservice.entity.annotation.Associative;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.order.entity.DemoOrder;
import com.yonyou.iuap.order.service.DemoOrderService;
import com.yonyou.iuap.baseservice.ref.service.RefCommonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yonyou.iuap.mvc.annotation.FrontModelExchange;
import com.yonyou.iuap.mvc.type.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
/**
 * 说明：demo订单 打印Controller——提供数据打印回调rest接口
 * 
 * @date 2018-10-11 16:21:09
 */
@Controller
@RequestMapping(value="/demo_order")
public class DemoOrderPrintController extends GenericPrintController<DemoOrder>{

    private Logger logger = LoggerFactory.getLogger(DemoOrderController.class);


    private DemoOrderService service;
    @Autowired
    public void setService(DemoOrderService service) {
        this.service = service;
        super.setService(service);
    }

}
