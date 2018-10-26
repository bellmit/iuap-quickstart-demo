package com.yonyou.iuap.zhuzibiao.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.zhuzibiao.dao.ZibiaotestMapper01;
import com.yonyou.iuap.zhuzibiao.entity.Zibiaotest01;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.MULTI_TENANT;
import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.REFERENCE;

@Service
    

/**
 * Zibiaotest CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class ZibiaotestService01 extends  GenericIntegrateService<Zibiaotest01>{

    private ZibiaotestMapper01 zibiaotestMapper01;
    @Autowired
    public void setZibiaotestMapper(ZibiaotestMapper01 zibiaotestMapper01) {

        this.zibiaotestMapper01 = zibiaotestMapper01;
        super.setGenericMapper(zibiaotestMapper01);
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