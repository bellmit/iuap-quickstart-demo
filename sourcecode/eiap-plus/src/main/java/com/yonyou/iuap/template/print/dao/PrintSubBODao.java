package com.yonyou.iuap.template.print.dao;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.yonyou.iuap.persistence.bs.dao.BaseDAO;
import com.yonyou.iuap.persistence.bs.dao.DAOException;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;
import com.yonyou.iuap.template.print.entity.PrintSubBO;

/**
 * <p>Title: CardTableMetaDao</p>
 * <p>Description: </p>
 */
@Repository
public class PrintSubBODao {
	
	@Qualifier("baseDAO")
	@Autowired
	private BaseDAO dao;
	
    
    public Page<PrintSubBO> selectAllByPage(PageRequest pageRequest, Map<String, Object> searchParams) {
        String sql = " select * from PRINT_SUB_BO"; 
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
        return dao.queryPage(sql, sqlparam, pageRequest, PrintSubBO.class);
    }
    
    
    public void batchInsert(List<PrintSubBO> addList) throws DAOException {
        dao.insert(addList);
    }

    public void batchUpdate(List<PrintSubBO> updateList) {
        dao.update(updateList);
    }

    public void batchDelete(List<PrintSubBO> list) {
        dao.remove(list);
    }
    

}
