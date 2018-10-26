package com.yonyou.iuap.appres.allocate.dao;

import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.yonyou.iuap.appres.allocate.entity.AppResAllocateRelate;
import com.yonyou.iuap.persistence.bs.dao.BaseDAO;
import com.yonyou.iuap.persistence.bs.dao.DAOException;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;

@Repository
public class AppResAllocateRelateDao {
    @Qualifier("baseDAO")
    @Autowired
    private BaseDAO dao;

    public AppResAllocateRelate getAllocateRelateByFuncCode(String funcCode, String tenantId) {
        String sql = " select * from app_res_allocaterelate where funccode=? and tenant_id = ?";
        SQLParameter sqlParam = new SQLParameter();
        sqlParam.addParam(funcCode);
        sqlParam.addParam(tenantId);
        List<AppResAllocateRelate> list = dao.queryByClause(AppResAllocateRelate.class, sql, sqlParam);
        return CollectionUtils.isEmpty(list)?null:list.get(0);
    }

    public String save(AppResAllocateRelate entity) throws DAOException {
        return dao.insert(entity);
    }

    public int update(AppResAllocateRelate entity) throws DAOException {
        return dao.update(entity);
    }

    public void deleteEntity(AppResAllocateRelate entity) throws DAOException {
        dao.remove(entity);
    }
}
