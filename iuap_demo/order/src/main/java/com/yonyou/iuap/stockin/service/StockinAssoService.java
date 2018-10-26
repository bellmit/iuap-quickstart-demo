package com.yonyou.iuap.stockin.service;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.baseservice.service.GenericAssoService;
import com.yonyou.iuap.baseservice.vo.GenericAssoVo;
import com.yonyou.iuap.stockin.entity.Stockin;
import com.yonyou.iuap.stockin.dao.StockinMapper;
import com.yonyou.iuap.stockin.entity.StockinSub;
import com.yonyou.iuap.stockin.service.StockinSubService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service
public class StockinAssoService  extends GenericAssoService<Stockin> {

    private StockinMapper mapper;
    /**
     * 注入主表mapper
     */
    @Autowired
    public void setService(StockinMapper mapper) {
        this.mapper = mapper;
        super.setGenericMapper(mapper);
    }

    /**
     * 注入子表StockinSubService
     */
    @Autowired
    public void setStockinSubService(StockinSubService subService) {
        super.setSubService(StockinSub.class,subService);
    }
    

    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,LOGICAL_DEL };
    }



}
