package com.yonyou.iuap.order_test.service;
import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.order_test.dao.TestDemoMapper;
import com.yonyou.iuap.order_test.entity.TestDemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service

/**
 * TestDemo CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class TestDemoService extends GenericIntegrateService<TestDemo>{


    private TestDemoMapper testDemoMapper;

    @Autowired
    public void setTestDemoMapper(TestDemoMapper testDemoMapper) {
        this.testDemoMapper = testDemoMapper;
        super.setGenericMapper(testDemoMapper);
    }
    


    /**
     * @CAU 可插拔设计
     * @return 向父类 GenericIntegrateService 提供可插拔的特性声明
     */
    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,BPM,MULTI_TENANT,LOGICAL_DEL };
    }
}