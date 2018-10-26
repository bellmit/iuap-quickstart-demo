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
import com.yonyou.iuap.template.print.entity.PrintBoAttr;

/**
 * <p>Title: CardTableMetaDao</p>
 * <p>Description: </p>
 */
@Repository
public class PrintBoAttrDao {
	
	@Qualifier("baseDAO")
	@Autowired
	private BaseDAO dao;
	
    
    public Page<PrintBoAttr> selectAllByPage(PageRequest pageRequest, Map<String, Object> searchParams) {
        String sql = " select * from PRINT_BO_ATTR"; 
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
        return dao.queryPage(sql, sqlparam, pageRequest, PrintBoAttr.class);
    }
    
    
    public void batchInsert(List<PrintBoAttr> addList) throws DAOException {
        dao.insert(addList);
    }

    public void batchUpdate(List<PrintBoAttr> updateList) {
        dao.update(updateList);
    }

    public void batchDelete(List<PrintBoAttr> list) {
        dao.remove(list);
    }
    

}
