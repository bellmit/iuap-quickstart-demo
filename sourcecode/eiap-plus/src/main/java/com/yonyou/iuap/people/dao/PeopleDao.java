
package com.yonyou.iuap.people.dao;

import com.yonyou.iuap.base.dao.BaseMetadataDao;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.persistence.bs.dao.DAOException;
import com.yonyou.iuap.persistence.bs.dao.MetadataDAO;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
public class PeopleDao extends BaseMetadataDao<People> {
	
	@Autowired
	protected MetadataDAO metadataDAO;
	
	public List<People> queryByClause(String sql, SQLParameter sqlParam) {
		
		return queryByClause(People.class, sql, sqlParam);
	}
	
	/**
	 *  增加查询所有人员的方法 
	 */
	public List<People> findAll(){
		String sql = "select * from iuap_qy_people ";
		SQLParameter sqlparam = new SQLParameter();
		List<People> list = queryByClause(sql, sqlparam);
	        return list;
	}
	/**
	 * 增加人员模糊查询方法
	 */
	public List<People> findByNameOrCodeLike(String psnname){
		String sql = "select * from iuap_qy_people where psnname like ? or psncode like ? ";
        SQLParameter sqlparam = new SQLParameter();
        sqlparam.addParam("%" + psnname + "%");
        sqlparam.addParam("%" + psnname + "%");    
        List<People> list = queryByClause(sql, sqlparam);
        return list;
	}
	
	public People queryByUserId(String pk_user, String tenantId) throws DAOException {
		List<People> results = new ArrayList<People>();
		String sql = " SELECT * FROM iuap_qy_people WHERE 1=1 AND pk_user=? And tenant_id=?";
		SQLParameter sqlparam = new SQLParameter();
		sqlparam.addParam(pk_user);
		sqlparam.addParam(tenantId);
		results = metadataDAO.queryByClause(People.class, sql, sqlparam);
		if(CollectionUtils.isEmpty(results)){
			return null;
		}else{
			return results.get(0);
		}
	}

	@Transactional
	public String insertWithPK(People entity) {
		return metadataDAO.insertWithPK(entity);
	}
}


