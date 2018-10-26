package com.yonyou.iuap.zhuzibiao.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
       
import com.yonyou.iuap.zhuzibiao.dao.ZibiaotestMapper;
import com.yonyou.iuap.zhuzibiao.entity.Zibiaotest;
          

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service
    

/**
 * Zibiaotest CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class ZibiaotestService extends  GenericIntegrateService<Zibiaotest>{

    private ZibiaotestMapper zibiaotestMapper;
    @Autowired
    public void setZibiaotestMapper(ZibiaotestMapper zibiaotestMapper) {

        this.zibiaotestMapper = zibiaotestMapper;
        super.setGenericMapper(zibiaotestMapper);
    }


        
    /**
     * @CAU 可插拔设计
     * @return 向父类 GenericIntegrateService 提供可插拔的特性声明
     */
    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,MULTI_TENANT };
    }
}