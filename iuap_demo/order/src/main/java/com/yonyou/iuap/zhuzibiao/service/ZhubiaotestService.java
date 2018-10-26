package com.yonyou.iuap.zhuzibiao.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.zhuzibiao.dao.ZhubiaotestMapper;
import com.yonyou.iuap.zhuzibiao.entity.Zhubiaotest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service

/**
 * Zhubiaotest CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class ZhubiaotestService extends GenericIntegrateService<Zhubiaotest>{


    private ZhubiaotestMapper zhubiaotestMapper;

    @Autowired
    public void setZhubiaotestMapper(ZhubiaotestMapper zhubiaotestMapper) {
        this.zhubiaotestMapper = zhubiaotestMapper;
        super.setGenericMapper(zhubiaotestMapper);
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