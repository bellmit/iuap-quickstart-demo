package com.yonyou.iuap.order.service;

import com.yonyou.iuap.baseservice.intg.service.GenericIntegrateService;
import com.yonyou.iuap.baseservice.intg.support.ServiceFeature;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.order.dao.DemoOrderMapper;
import com.yonyou.iuap.order.entity.DemoOrder;

import com.yonyou.uap.busilog.annotation.LogConfig;
import com.yonyou.uap.ieop.busilog.config.annotation.BusiLogConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.baseservice.ref.service.RefCommonService;
import java.util.List;

import static com.yonyou.iuap.baseservice.intg.support.ServiceFeature.*;
@Service

/**
 * DemoOrder CRUD 核心服务,提供逻辑删除/乐观锁
 */
public class DemoOrderService extends GenericIntegrateService<DemoOrder>{


    private DemoOrderMapper demoOrderMapper;

    @Autowired
    public void setDemoOrderMapper(DemoOrderMapper demoOrderMapper) {
        this.demoOrderMapper = demoOrderMapper;
        super.setGenericMapper(demoOrderMapper);
    }
    
        @Autowired
    private RefCommonService refService;
    @Autowired
    private DemoOrderEnumService DemoOrderEnumService;
        public List selectListByExcelData(List idsList) {
                List list  = demoOrderMapper.selectListByExcelData(idsList);
                list = refService.fillListWithRef(list);
                list = DemoOrderEnumService.afterListQuery(list);
                return list;
        }


    /**
     * @CAU 可插拔设计
     * @return 向父类 GenericIntegrateService 提供可插拔的特性声明
     */
    @Override
    protected ServiceFeature[] getFeats() {
        return new ServiceFeature[]{ REFERENCE,BPM,MULTI_TENANT,LOGICAL_DEL };
    }

    @Override
    @LogConfig(busiName = "查询",busiCode = "order_query",operation = "query")
    //@BusiLogConfig(method = "order_query",busiName ="查询" )
    public Page<DemoOrder> selectAllByPage(PageRequest pageRequest, SearchParams searchParams) {
        return super.selectAllByPage(pageRequest, searchParams);
    }
}