package com.yonyou.iuap.orderinfo.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.orderinfo.dao.OrderInfoMapper;
import com.yonyou.iuap.orderinfo.entity.OrderInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.baseservice.ref.service.RefCommonService;
import java.util.List;

import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service
public class OrderInfoService extends GenericIntegrateService<OrderInfo>{


    private OrderInfoMapper OrderInfoMapper;

    @Autowired
    public void setOrderInfoMapper(OrderInfoMapper OrderInfoMapper) {
        this.OrderInfoMapper = OrderInfoMapper;
        super.setGenericMapper(OrderInfoMapper);
    }
    
        @Autowired
    private RefCommonService refService;
 
        public List selectListByExcelData(List idsList) {
                List list  = OrderInfoMapper.selectListByExcelData(idsList);
                return refService.fillListWithRef(list);
        }


        
    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,BPM,MULTI_TENANT,LOGICAL_DEL };
    }
}