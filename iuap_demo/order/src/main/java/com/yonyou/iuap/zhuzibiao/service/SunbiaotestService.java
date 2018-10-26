package com.yonyou.iuap.zhuzibiao.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.zhuzibiao.dao.SunbiaotestMapper;
import com.yonyou.iuap.zhuzibiao.dao.ZibiaotestMapper;
import com.yonyou.iuap.zhuzibiao.entity.SunbiaoTest;
import com.yonyou.iuap.zhuzibiao.entity.Zibiaotest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.MULTI_TENANT;
import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.REFERENCE;

@Service
    

/**
 * Zibiaotest CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class SunbiaotestService extends  GenericIntegrateService<SunbiaoTest>{

    private SunbiaotestMapper sunbiaotestMapper;
    @Autowired
    public void setZibiaotestMapper(SunbiaotestMapper sunbiaotestMapper) {

        this.sunbiaotestMapper = sunbiaotestMapper;
        super.setGenericMapper(sunbiaotestMapper);
    }

    public void saveBatchWithPid(List<SunbiaoTest> sunbiaoTestList,String pid){
        for(SunbiaoTest sunbiaoTest : sunbiaoTestList){
            sunbiaoTest.setPkSid(pid);
        }
        super.saveBatch(sunbiaoTestList);
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