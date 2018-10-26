package com.yonyou.iuap.orderinfo.controller;
import com.yonyou.iuap.baseservice.print.controller.GenericPrintController;
import com.yonyou.iuap.mvc.constants.RequestStatusEnum;
import com.yonyou.iuap.baseservice.entity.annotation.Associative;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.orderinfo.entity.OrderInfo;
import com.yonyou.iuap.orderinfo.service.OrderInfoService;
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

@Controller
@RequestMapping(value="/order_info")
public class OrderInfoPrintController extends GenericPrintController<OrderInfo>{
    
    private Logger logger = LoggerFactory.getLogger(OrderInfoController.class);

    @Autowired
    private RefCommonService refService;

    private OrderInfoService service;
    @Autowired
    public void setService(OrderInfoService service) {
        this.service = service;
        super.setService(service);
    }

    @Override
    public Object getDataForPrint(HttpServletRequest request) {
                String params = request.getParameter("params");
                JSONObject jsonObj = JSON.parseObject(params);
                String id = (String) jsonObj.get("id");

        OrderInfo vo = service.findById(id);
        if (vo.getMainBoCode()==null){
            return buildError("mainBoCode","主表业务对象编码为打印关键参数不可为空",RequestStatusEnum.FAIL_FIELD);
        }
        List<OrderInfo> mainList = new ArrayList();
        mainList.add(vo);
        mainList=refService.fillListWithRef(mainList);
        vo = mainList.get(0);

        JSONObject jsonVo = JSONObject.parseObject(JSONObject.toJSON(vo).toString());
                JSONObject mainData = new JSONObject();
                JSONObject childData = new JSONObject();
                JSONArray mainDataJson = new JSONArray();// 主实体数据

                Set<String> setKey = jsonVo.keySet();
        for(String key : setKey ){
            String value = jsonVo.getString(key);
            mainData.put(key, value);
        }
        mainDataJson.add(mainData);// 主表只有一行


        //增加子表的逻辑

        JSONObject boAttr = new JSONObject();
        //key：主表业务对象code
        boAttr.put(vo.getMainBoCode(), mainDataJson);

        
        return boAttr.toString();
    }

    }
