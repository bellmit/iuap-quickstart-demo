package com.yonyou.iuap.stockin.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.stockin.dao.StockinMapper;
import com.yonyou.iuap.stockin.entity.Stockin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service

/**
 * Stockin CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class StockinService extends GenericIntegrateService<Stockin>{


    private StockinMapper stockinMapper;

    @Autowired
    public void setStockinMapper(StockinMapper stockinMapper) {
        this.stockinMapper = stockinMapper;
        super.setGenericMapper(stockinMapper);
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