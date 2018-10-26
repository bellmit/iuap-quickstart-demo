package com.yonyou.iuap.zhuzibiao.service;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.baseservice.service.GenericAssoService;
import com.yonyou.iuap.baseservice.vo.GenericAssoVo;
import com.yonyou.iuap.zhuzibiao.entity.SunbiaoTest;
import com.yonyou.iuap.zhuzibiao.entity.Zhubiaotest;
import com.yonyou.iuap.zhuzibiao.dao.ZhubiaotestMapper;
import com.yonyou.iuap.zhuzibiao.entity.Zibiaotest;
import com.yonyou.iuap.zhuzibiao.entity.Zibiaotest01;
import com.yonyou.iuap.zhuzibiao.service.ZibiaotestService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service
public class ZhubiaotestAssoService  extends GenericAssoService<Zhubiaotest> {

    private ZhubiaotestMapper mapper;
    /**
     * 注入主表mapper
     */
    @Autowired
    public void setService(ZhubiaotestMapper mapper) {
        this.mapper = mapper;
        super.setGenericMapper(mapper);
    }

    /**
     * 注入子表ZibiaotestService
     */
    @Autowired
    public void setZibiaotestService(ZibiaotestService subService,ZibiaotestService01 subService01,
                                     SunbiaotestService sunbiaotestService) {
        super.setSubService(Zibiaotest.class,subService);
        super.setSubService(Zibiaotest01.class,subService01);
       // super.setSubService(SunbiaoTest.class,sunbiaotestService);
    }

    

    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,MULTI_TENANT };
    }



}
