package com.yonyou.iuap.duban.controller;
import com.yonyou.iuap.baseservice.controller.GenericAssoController;
import com.yonyou.iuap.duban.entity.Duban;
import com.yonyou.iuap.duban.service.DubanAssoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/DUBAN")
public class DubanAssoController extends GenericAssoController<Duban> {

    private DubanAssoService service;
    /**
     * 注入主子表service
     */
    @Autowired
    public void setService(DubanAssoService service) {
        this.service = service;
        super.setService( service);
    }


}
