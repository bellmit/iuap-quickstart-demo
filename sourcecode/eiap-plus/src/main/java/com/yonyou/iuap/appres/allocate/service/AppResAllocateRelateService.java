package com.yonyou.iuap.appres.allocate.service;

import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.generic.adapter.InvocationInfoProxyAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.appres.allocate.dao.AppResAllocateRelateDao;
import com.yonyou.iuap.appres.allocate.entity.AppResAllocateRelate;
import com.yonyou.iuap.persistence.vo.pub.BusinessException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppResAllocateRelateService {

    private Logger logger = LoggerFactory.getLogger(AppResAllocateRelateService.class);
    @Autowired
    private AppResAllocateRelateDao dao;

    public AppResAllocateRelate getAllocateRelateByFuncCode(String funcCode) {
        String tenantId = InvocationInfoProxyAdapter.getTenantid();
        AppResAllocateRelate result = dao.getAllocateRelateByFuncCode(funcCode, tenantId);
        return result;
    }

    @Transactional
    public void operateEnableBpm(String enableBpm,String funcCode) throws BusinessException{
        AppResAllocateRelate result = this.getAllocateRelateByFuncCode(funcCode);
        if(result == null){
            AppResAllocateRelate entity = new AppResAllocateRelate();
            entity.setEnableBpm(enableBpm);
            entity.setFunccode(funcCode);
            entity.setTenant_id(InvocationInfoProxy.getTenantid());
            this.save(entity);
        }else{
            result.setEnableBpm(enableBpm);
            this.update(result);
        }
    }

    public String getEnableBpm(String funcCode){
        AppResAllocateRelate result = this.getAllocateRelateByFuncCode(funcCode);
        return result==null?null:result.getEnableBpm();
    }

    @Transactional
    public String save(AppResAllocateRelate entity) throws BusinessException {
        return dao.save(entity);
    }

    @Transactional
    public int update(AppResAllocateRelate entity) throws BusinessException {
        return dao.update(entity);
    }

    public void deleteEntity(AppResAllocateRelate entity) {
        dao.deleteEntity(entity);
    }

}
