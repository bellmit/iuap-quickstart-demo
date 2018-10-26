package com.yonyou.iuap.duban.controller;
import com.yonyou.iuap.baseservice.print.controller.GenericPrintController;
import com.yonyou.iuap.mvc.constants.RequestStatusEnum;
import com.yonyou.iuap.baseservice.entity.annotation.Associative;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
   
import com.yonyou.iuap.duban.entity.DubanSub;
import com.yonyou.iuap.duban.service.DubanSubService;
import com.yonyou.iuap.duban.entity.Duban;
import com.yonyou.iuap.duban.service.DubanService;
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
@RequestMapping(value="/DUBAN")
public class DubanPrintController extends GenericPrintController<Duban>{
    
    private Logger logger = LoggerFactory.getLogger(DubanController.class);

    @Autowired
    private RefCommonService refService;

    private DubanService service;
    @Autowired
    public void setService(DubanService service) {
        this.service = service;
        super.setService(service);
    }

    @Override
    public Object getDataForPrint(HttpServletRequest request) {
                String params = request.getParameter("params");
                JSONObject jsonObj = JSON.parseObject(params);
                String id = (String) jsonObj.get("id");

        Duban vo = service.findById(id);
        if (vo.getMainBoCode()==null){
            return buildError("mainBoCode","主表业务对象编码为打印关键参数不可为空",RequestStatusEnum.FAIL_FIELD);
        }
        List<Duban> mainList = new ArrayList();
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

           
        Associative associativeDubanSub = vo.getClass().getAnnotation(Associative.class);
        if (associativeDubanSub==null|| StringUtils.isEmpty(associativeDubanSub.fkName())){
            return buildError("","主子表打印需要在entity上增加@Associative并指定fkName",RequestStatusEnum.FAIL_FIELD);
        }
        List<DubanSub> subListDubanSub = DubanSubService.queryList(associativeDubanSub.fkName(),id);
        subListDubanSub=refService.fillListWithRef(subListDubanSub);
        JSONArray childrenDataJsonDubanSub = new JSONArray();
        childrenDataJsonDubanSub.addAll(subListDubanSub);
        boAttr.put("DUBAN_SUB", childrenDataJsonDubanSub);//子表填充

        return boAttr.toString();
    }

        
    private DubanSubService DubanSubService;
    @Autowired
    public void setDubanSubService(DubanSubService DubanSubService) {
        this.DubanSubService = DubanSubService;
        super.setSubService("DUBAN_SUB",DubanSubService);
    }
    
}
