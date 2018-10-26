package com.yonyou.iuap.appres.allocate.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.yonyou.iuap.appres.allocate.entity.AppResAllocate;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.persistence.bs.dao.BaseDAO;
import com.yonyou.iuap.persistence.bs.dao.DAOException;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;

@Repository
public class AppResAllocateDao{
	
	@Qualifier("baseDAO")
	@Autowired
	private BaseDAO dao;

	public Page<AppResAllocate> selectAllByPage(PageRequest pageRequest, Map<String, Object> searchParams) {
		String sql = " select * from app_res_allocate";
		SQLParameter sqlparam = new SQLParameter();
		if (!searchParams.isEmpty()) {
			sql = sql + " where ";
			for (String key : searchParams.keySet()) {
				sql = sql + "("+key+" like ? ) AND";
				sqlparam.addParam("%" + searchParams.get(key) + "%");
			}
			sql = sql.substring(0, sql.length() - 4);
		}
		sql = sql + " AND TENANT_ID=?";
		sqlparam.addParam(InvocationInfoProxy.getTenantid());
		return dao.queryPage(sql, sqlparam, pageRequest, AppResAllocate.class);
	}
	
	public List<AppResAllocate> selectTemplateAllocateByCondition(String funcCode,String nodekey,String restype,String pk_res) {
		String sql = " select * from app_res_allocate where TENANT_ID=?";
		SQLParameter sqlparam = new SQLParameter();
		sqlparam.addParam(InvocationInfoProxy.getTenantid());
		if(!StringUtils.isEmpty(funcCode)){
			sql = sql + " and funccode = ? ";
			sqlparam.addParam(funcCode);
		}
		if(!StringUtils.isEmpty(nodekey)){
			sql = sql + " and nodekey = ? ";
			sqlparam.addParam(nodekey);
		}else{
			sql = sql + " and nodekey = null ";
		}
		if(!StringUtils.isEmpty(restype)){
			sql = sql + " and restype = ? ";
			sqlparam.addParam(restype);
		}
		if(!StringUtils.isEmpty(pk_res)){
			sql = sql + " and pk_res = ? ";
			sqlparam.addParam(restype);
		}
		return dao.queryByClause(AppResAllocate.class, sql, sqlparam);
	}

	public List<AppResAllocate> selectTemplateAllocateByFuncCodeAndResType(String funcCode,String restype) {
		String sql = " select * from app_res_allocate where TENANT_ID=?";
		SQLParameter sqlparam = new SQLParameter();
		sqlparam.addParam(InvocationInfoProxy.getTenantid());
		if(!StringUtils.isEmpty(funcCode)){
			sql = sql + " and funccode = ? ";
			sqlparam.addParam(funcCode);
		}
		if(!StringUtils.isEmpty(restype)){
			sql = sql + " and restype = ? ";
			sqlparam.addParam(restype);
		}
		return dao.queryByClause(AppResAllocate.class, sql, sqlparam);
	}
	
	public String save(AppResAllocate entity) throws DAOException {
		return dao.insert(entity);
	}
	
	public int update(AppResAllocate entity) throws DAOException {
		return dao.update(entity);
	}

	public void deleteEntity(AppResAllocate entity) throws DAOException {
		dao.remove(entity);
	}

	public void batchDelete(List<AppResAllocate> list) {
		dao.remove(list);
	}

	public List<String> getFuncIdByRestype(String restype, String tenantid){
		SQLParameter sqlparam = new SQLParameter();
		String sql = "select * from app_res_allocate where tenant_id = ?";
		sqlparam.addParam(tenantid);

		if(!StringUtils.isEmpty(restype)){
			sql = sql + " and restype = ? ";
			sqlparam.addParam(restype);
		}

		List<AppResAllocate> list = dao.queryByClause(AppResAllocate.class, sql, sqlparam);

		List<String> funcids = new ArrayList<String>();

		if (list != null && list.size() > 0){
			for (AppResAllocate entity : list){
				funcids.add(entity.getFuncid());
			}
		}

		return funcids;
	}
    
}
