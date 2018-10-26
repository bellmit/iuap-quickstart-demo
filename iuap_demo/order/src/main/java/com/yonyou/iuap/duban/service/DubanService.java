package com.yonyou.iuap.duban.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.duban.dao.DubanMapper;
import com.yonyou.iuap.duban.entity.Duban;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.baseservice.ref.service.RefCommonService;
import java.util.List;

import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service
public class DubanService extends GenericIntegrateService<Duban>{


    private DubanMapper DubanMapper;

    @Autowired
    public void setDubanMapper(DubanMapper DubanMapper) {
        this.DubanMapper = DubanMapper;
        super.setGenericMapper(DubanMapper);
    }
    
        @Autowired
    private RefCommonService refService;
 
        public List selectListByExcelData(List idsList) {
                List list  = DubanMapper.selectListByExcelData(idsList);
                return refService.fillListWithRef(list);
        }


        
    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,BPM,MULTI_TENANT,LOGICAL_DEL };
    }
}