package com.yonyou.iuap.template.print.dao;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.persistence.bs.dao.BaseDAO;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;
import com.yonyou.iuap.persistence.jdbc.framework.util.SQLHelper;
import com.yonyou.iuap.template.print.entity.PrintTemplate;

/**
 * <p>Title: CardTableMetaDao</p>
 * <p>Description: </p>
 */
@Repository
public class PrintTemplateDao {
	
	@Qualifier("baseDAO")
	@Autowired
	private BaseDAO dao;
	
    
    public Page<PrintTemplate> selectAllByPage(PageRequest pageRequest, Map<String, Object> searchParams) {
        String sql = " select * from PRINT_TEMPLATE"; 
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
        return dao.queryPage(sql, sqlparam, pageRequest, PrintTemplate.class);
    }
    
    public List<PrintTemplate> selectPrintTemplateByPKBO(String pk_bo) {
//    	String sql = " select * from PRINT_TEMPLATE where PK_BO=? and TENANT_ID=?"; 
    	String sql = " select * from PRINT_TEMPLATE where PK_BO=?"; 
        SQLParameter sqlparam = new SQLParameter();
        sqlparam.addParam(pk_bo);
//        sqlparam.addParam(InvocationInfoProxy.getTenantid());
        List<PrintTemplate> list = dao.queryByClause(PrintTemplate.class, sql,sqlparam);
        return list;
    }
    
    public List<PrintTemplate> selectPrintTemplateByPKCode(String templateCode) {
//    	String sql = " select * from PRINT_TEMPLATE where TEMPLATECODE like ? and TENANT_ID=?"; 
    	String sql = " select * from PRINT_TEMPLATE where TEMPLATECODE like ?"; 
    	SQLParameter sqlparam = new SQLParameter();
    	sqlparam.addParam(templateCode);
//    	sqlparam.addParam(InvocationInfoProxy.getTenantid());
    	List<PrintTemplate> list = dao.queryByClause(PrintTemplate.class, sql,sqlparam);
    	return list;
    }
    
    public List<PrintTemplate> getByIds(List<String> ids) {
		StringBuilder sqlBuilder = new StringBuilder();
		sqlBuilder.append("SELECT * FROM PRINT_TEMPLATE");
		sqlBuilder.append(" where ");
		String inPart = SQLHelper.createInPart(ids.size(), "PK_PRINT_TEMPLATE");
		sqlBuilder.append(inPart);
		SQLParameter sqlParam = new SQLParameter();
		for (String param : ids) {
			sqlParam.addParam(param);
		}

//		sqlBuilder.append(" and TENANT_ID=?");
//		sqlParam.addParam(InvocationInfoProxy.getTenantid());

		return dao.queryByClause(PrintTemplate.class, sqlBuilder.toString(), sqlParam);
	}
    
    public PrintTemplate getByPk(String pk) {
		return dao.queryByPK(PrintTemplate.class, pk);
	}

}
