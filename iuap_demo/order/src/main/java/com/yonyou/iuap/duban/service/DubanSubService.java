package com.yonyou.iuap.duban.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;

       
import com.yonyou.iuap.duban.dao.DubanSubMapper;
import com.yonyou.iuap.duban.entity.DubanSub;
          

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.baseservice.ref.service.RefCommonService;
import java.util.List;

import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service
    
public class DubanSubService extends  GenericIntegrateService<DubanSub>{

    private DubanSubMapper DubanSubMapper;
    @Autowired
    public void setDubanSubMapper(DubanSubMapper DubanSubMapper) {

        this.DubanSubMapper = DubanSubMapper;
        super.setGenericMapper(DubanSubMapper);
    }


        
        
    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,BPM,MULTI_TENANT,LOGICAL_DEL };
    }
}