package com.yonyou.iuap.template.print.dao;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.persistence.bs.dao.BaseDAO;
import com.yonyou.iuap.persistence.bs.dao.DAOException;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;
import com.yonyou.iuap.template.print.entity.PrintBO;

/**
 * <p>Title: CardTableMetaDao</p>
 * <p>Description: </p>
 */
@Repository
public class PrintBODao {
	
	@Qualifier("baseDAO")
	@Autowired
	private BaseDAO dao;
	
    
    public Page<PrintBO> selectAllByPage(PageRequest pageRequest, Map<String, Object> searchParams) {
        String sql = " select * from PRINT_BO"; 
        SQLParameter sqlparam = new SQLParameter();
        if (!searchParams.isEmpty()) {
            sql = sql + " where ";
            for (String key : searchParams.keySet()) {
                if (key.equalsIgnoreCase("searchParam")) {
                    sql =sql + "() AND";
                    for (int i = 0; i < 2; i++) {
                        sqlparam.addParam("%" + searchParams.get(key) + "%");
                    }
                }
            }
            sql = sql.substring(0, sql.length() - 4);
        }
//        sql = sql + " AND TENANT_ID=?";
//        sqlparam.addParam(InvocationInfoProxy.getTenantid());
        return dao.queryPage(sql, sqlparam, pageRequest, PrintBO.class);
    }
    
    public PrintBO selectPrintBOByCode(String code) {
//        String sql = " select * from PRINT_BO where BO_CODE=? AND TENANT_ID=?"; 
        String sql = " select * from PRINT_BO where BO_CODE=?"; 
        SQLParameter sqlparam = new SQLParameter();
        sqlparam.addParam(code);
//        sqlparam.addParam(InvocationInfoProxy.getTenantid());
        List<PrintBO> list = dao.queryByClause(PrintBO.class, sql,sqlparam);
        return CollectionUtils.isEmpty(list)?null:list.get(0);
    }
    
    
    public void batchInsert(List<PrintBO> addList) throws DAOException {
        dao.insert(addList);
    }

    public void batchUpdate(List<PrintBO> updateList) {
        dao.update(updateList);
    }

    public void batchDelete(List<PrintBO> list) {
        dao.remove(list);
    }
    

}
