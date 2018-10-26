package com.yonyou.iuap.stockin.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
       
import com.yonyou.iuap.stockin.dao.StockinSubMapper;
import com.yonyou.iuap.stockin.entity.StockinSub;
          

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service
    

/**
 * StockinSub CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class StockinSubService extends  GenericIntegrateService<StockinSub>{

    private StockinSubMapper stockinSubMapper;
    @Autowired
    public void setStockinSubMapper(StockinSubMapper stockinSubMapper) {

        this.stockinSubMapper = stockinSubMapper;
        super.setGenericMapper(stockinSubMapper);
    }


        
    /**
     * @CAU 可插拔设计
     * @return 向父类 GenericIntegrateService 提供可插拔的特性声明
     */
    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,LOGICAL_DEL };
    }
}