package com.yonyou.iuap.duban.service;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.baseservice.service.GenericAssoService;
import com.yonyou.iuap.baseservice.vo.GenericAssoVo;
import com.yonyou.iuap.duban.entity.Duban;
import com.yonyou.iuap.duban.dao.DubanMapper;
import com.yonyou.iuap.duban.entity.DubanSub;
import com.yonyou.iuap.duban.service.DubanSubService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service
public class DubanAssoService  extends GenericAssoService<Duban> {

    private DubanMapper mapper;
    /**
     * 注入主表mapper
     */
    @Autowired
    public void setService(DubanMapper mapper) {
        this.mapper = mapper;
        super.setGenericMapper(mapper);
    }

    /**
     * 注入子表DubanSubService
     */
    @Autowired
    public void setDubanSubService(DubanSubService subService) {
        super.setSubService(DubanSub.class,subService);
    }
    

    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,BPM,MULTI_TENANT,LOGICAL_DEL };
    }



}
