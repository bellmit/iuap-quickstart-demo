package com.yonyou.iuap.appres.allocate.web.rest;

import com.yonyou.iuap.appres.allocate.service.AppResAllocateService;
import com.yonyou.iuap.appres.allocate.web.AppResAllocateController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/appResAllocateRest")
public class AppResAllocateRestController {

    private Logger logger = LoggerFactory.getLogger(AppResAllocateRestController.class);

    @Autowired
    private AppResAllocateService service;

    @RequestMapping(value = "getFuncIds", method = RequestMethod.GET)
    public @ResponseBody Map<String, Object> getFuncIdsByRestype(@RequestParam("restype") String restype,
                                                                 @RequestParam("tenantid") String tenantid){
        Map<String, Object> results = new HashMap<String, Object>();

        List<String> idList = service.getFuncIdsByRestype(restype, tenantid);
        results.put("data", idList);

        return results;
    }
}
