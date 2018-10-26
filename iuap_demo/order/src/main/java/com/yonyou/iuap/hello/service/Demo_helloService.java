package com.yonyou.iuap.hello.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.hello.dao.Demo_helloMapper;
import com.yonyou.iuap.hello.entity.Demo_hello;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service

/**
 * Demo_hello CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class Demo_helloService extends GenericIntegrateService<Demo_hello>{


    private Demo_helloMapper demo_helloMapper;

    @Autowired
    public void setDemo_helloMapper(Demo_helloMapper demo_helloMapper) {
        this.demo_helloMapper = demo_helloMapper;
        super.setGenericMapper(demo_helloMapper);
    }
    


    /**
     * @CAU 可插拔设计
     * @return 向父类 GenericIntegrateService 提供可插拔的特性声明
     */
    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,MULTI_TENANT,LOGICAL_DEL };
    }
}