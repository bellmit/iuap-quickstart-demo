package com.yonyou.iuap.ism.dao;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.yonyou.iuap.ism.common.InSqlUtil;
import com.yonyou.iuap.ism.entity.Page;
import com.yonyou.iuap.ism.entity.Role;
import com.yonyou.iuap.ism.entity.UserInfoVo;
import com.yonyou.iuap.ism.entity.UserInfoVo4Dealer;
import com.yonyou.iuap.persistence.bs.dao.BaseDAO;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;
import com.yonyou.iuap.persistence.jdbc.framework.exception.DbException;
import com.yonyou.iuap.persistence.jdbc.framework.page.OracleLimitSQLBuilder;
import com.yonyou.iuap.persistence.jdbc.framework.processor.ArrayListProcessor;
import com.yonyou.iuap.persistence.jdbc.framework.processor.BeanListProcessor;
import com.yonyou.iuap.persistence.jdbc.framework.processor.ColumnProcessor;
import com.yonyou.iuap.persistence.jdbc.framework.processor.ResultSetProcessor;

@Repository
public class UserInfoDao {

	private static final Logger logger = LoggerFactory.getLogger(UserInfoDao.class);

	// @Autowired
	// protected MetadataDAO metadataDAO;
	//
	@Autowired
	protected BaseDAO baseDAO;

	// 运维支持，商务支持
	private String[] roleCodes = { "business_sup", "operation_sup" };
	private String[] roleNames = { "商务支持", "运维支持" };

	public List<UserInfoVo> queryUserInfoVosByRole() {

		String inSql = InSqlUtil.getInSubSql(roleCodes);

//		String sql = "select u.id, u.name,u.login_name,p.psnname,u.phone,u.email,u.avator, r.role_code,r.role_name,d.name as department,org.name as orgname,p.gender,p.telephone,p.number_gh from APP_USER u inner join IUAP_QY_PEOPLE p on u.id = p.pk_user inner join org_dept d on p.pk_dept = d.id inner join ORG_ORGANIZATION org on p.pk_org = org.id inner join ieop_role_user ru on ru.user_id=u.id inner join ieop_role r on (r.id=ru.role_id and r.role_code in"
//				+ inSql + ")";
//		ResultSetProcessor processor = new BeanListProcessor(UserInfoVo.class);
//		return baseDAO.queryForList(sql, processor);
		
		String sql = "SELECT u.id, u.name,u.login_name,p.psnname,u.phone,u.email,u.avator, r.role_code,r.role_name,d.name as department,org.name as orgname,p.gender,p.telephone,p.number_gh FROM APP_USER u LEFT JOIN IUAP_QY_PEOPLE p  ON u.id = p.pk_user LEFT JOIN org_dept d  ON p.pk_dept = d.id LEFT JOIN ORG_ORGANIZATION org  ON p.pk_org = org.id LEFT JOIN ieop_role_user ru  ON ru.user_id = u.id LEFT JOIN ieop_role r  ON r.id = ru.role_id WHERE r.role_code IN " + inSql ;
		ResultSetProcessor processor = new BeanListProcessor(UserInfoVo.class);
		return baseDAO.queryForList(sql, processor);
	}

	public UserInfoVo4Dealer queryUserInfoVos(String userId) {
		// 应需求要求，两个角色固定写死，不关联角色表进行角色查询了
//		String sql = "select u.id, u.name,u.login_name,p.psnname,u.phone,u.email,u.avator, d.name as department,u.tenant_id, p.gender,p.telephone,p.number_gh from APP_USER u inner join IUAP_QY_PEOPLE p on u.id = p.pk_user inner join org_dept d on p.pk_dept = d.id where u.id=?";
		String sql = "select u.id, u.name,u.login_name,p.psnname,u.phone,u.email,u.avator, d.name as department,u.tenant_id, p.gender,p.telephone,p.number_gh from APP_USER u left join IUAP_QY_PEOPLE p on u.id = p.pk_user left join org_dept d on p.pk_dept = d.id where u.id=?";

		SQLParameter sqlParam = new SQLParameter();
		sqlParam.addParam(userId);
//		sqlParam.addParam(tenantId);
		ResultSetProcessor processor = new BeanListProcessor(UserInfoVo4Dealer.class);

		List<Role> roleList = new ArrayList<Role>();
		for (int i = 0; i < roleCodes.length; i++) {
			roleList.add(new Role(roleCodes[i], roleNames[i]));
		}

		List<UserInfoVo4Dealer> list = baseDAO.queryForList(sql, sqlParam, processor);

		if (list.size() == 0) {
			return null;
		}

		list.get(0).setRoles(roleList.toArray(new Role[0]));
		return list.get(0);
	}

	// public UserInfoVo4Dealer queryUserInfoVos(String userCode, String
	// tenantId) {
	//
	// String sql = "select u.id,
	// u.name,u.login_name,p.psnname,u.phone,u.email,u.avator, d.name as
	// department,u.tenant_id,r.role_code,r.role_name,
	// p.gender,p.telephone,p.number_gh from APP_USER u inner join
	// IUAP_QY_PEOPLE p on u.id = p.pk_user inner join org_dept d on p.pk_dept =
	// d.id inner join ieop_role_user ru on ru.user_id=u.id inner join ieop_role
	// r on r.id=ru.role_id where login_name=? and u.tenant_id=?";
	//
	// SQLParameter sqlParam = new SQLParameter();
	// sqlParam.addParam(userCode);
	// sqlParam.addParam(tenantId);
	// ResultSetProcessor processor = new
	// BeanListProcessor(UserInfoVo4Dealer.class);
	// List<Role> roleList = new ArrayList<Role>();
	//
	// List<UserInfoVo4Dealer> list = baseDAO.queryForList(sql, sqlParam,
	// processor);
	//
	// if (list.size()==0){
	// return null;
	// }
	//
	// for (UserInfoVo4Dealer userInfoVo4Dealer : list) {
	// Role role = new Role();
	// role.setRolecode(userInfoVo4Dealer.getRolecode());
	// role.setRolename(userInfoVo4Dealer.getRolename());
	// roleList.add(role);
	// }
	// list.get(0).setRoles(roleList.toArray(new Role[0]));;
	// // return metadataDAO.queryForList(sql, sqlParam, processor);
	// return list.get(0);
	// }

	public Page queryPageUserInfoVosByRole(String roleCode, int pageIndex, int pageSize) {

		String sql = "select u.id, u.login_name,u.name,p.email from APP_USER u left join IUAP_QY_PEOPLE p on id = pk_user  where id in ( select USER_ID from IEOP_ROLE_USER where ROLE_CODE=?)";

		SQLParameter sqlParam = new SQLParameter();
		sqlParam.addParam(roleCode);
		// ResultSetProcessor processor = new ArrayListProcessor();
		// return metadataDAO.queryForList(sql, sqlParam, processor);
		long count = 0;
		try {
			count = queryCount(sql, sqlParam);
		} catch (DbException e) {
			// TODO Auto-generated catch block
			logger.error("queryCount exception", e);

		}

		PageRequest pageRequest = new PageRequest(pageIndex, pageSize);
		return queryPage(count, sql, sqlParam, pageRequest);
	}

	protected long queryCount(String sql, SQLParameter parameter) throws DbException {
		StringBuffer countBuffer = new StringBuffer("select count(*) ");
		int fromIndex = sql.indexOf("from");
		fromIndex = fromIndex > 0 ? fromIndex : sql.indexOf("FROM");
		int orderByIndex = sql.lastIndexOf("order by");
		orderByIndex = orderByIndex > 0 ? orderByIndex : sql.lastIndexOf("ORDER BY");
		String fromPart = orderByIndex > 0 ? sql.substring(fromIndex, orderByIndex) : sql.substring(fromIndex);
		countBuffer.append(fromPart);
		String countSQL = countBuffer.toString();
		if (logger.isDebugEnabled()) {
			logger.debug("query page count sql is {}", countBuffer);
		}
		Number number = (Number) baseDAO.queryForObject(countSQL, parameter, new ColumnProcessor());
		return number.longValue();
	}

	public Page queryPage(long num, String sql, SQLParameter parameter, PageRequest pageRequest) {

		List<UserInfoVo> resultList = null;

		if (num != 0L) {
			// sql = appendOrder(sql, pageRequest);
			OracleLimitSQLBuilder limitSqlBuilder = new OracleLimitSQLBuilder();
			String pageSQL = limitSqlBuilder.build(sql, pageRequest.getPageNumber(), pageRequest.getPageSize());
			if (logger.isDebugEnabled()) {
				logger.debug("query page sql is {}", pageSQL);
			}
			ResultSetProcessor processor = new ArrayListProcessor();

			resultList = baseDAO.queryForList(pageSQL, parameter, processor);

		}

		Page page = new Page();
		page.setContent(resultList);
		page.setTotalElements(num);
		page.setPageIndex(pageRequest.getPageNumber());
		if (resultList!=null){
			page.setPageSize(resultList.size());
		}
		return page;
	}

	// public Page<UserInfoVo> queryPageUserInfoVosByRole(String roleCode,int
	// pageIndex,int pageSize) {
	//
	// String sql = "select u.id, u.login_name,u.name,p.email from APP_USER u
	// left join IUAP_QY_PEOPLE p on id = pk_user where id in ( select USER_ID
	// from IEOP_ROLE_USER where ROLE_CODE=?)";
	//
	// SQLParameter sqlParam = new SQLParameter();
	// sqlParam.addParam(roleCode);
	//
	//
	// PageRequest pageRequest = new PageRequest(pageIndex, pageSize);
	// Page<UserInfoVo> page = baseDAO.queryPage(sql, sqlParam, pageRequest,
	// UserInfoVo.class);
	// return page;
	// }

	/*
	 * public List<UserInfoVo> queryUserInfoVosByRole(String[] roleCodes) {
	 * 
	 * String inSql = InSqlUtil.getInSubSql(roleCodes);
	 * 
	 * String sql =
	 * "select u.id, u.name,u.login_name,p.psnname,u.phone,u.email,u.avator, r.role_code,r.role_name,d.name as department,org.name as orgname from APP_USER u inner join IUAP_QY_PEOPLE p on u.id = p.pk_user inner join org_dept d on p.pk_dept = d.id inner join ORG_ORGANIZATION org on p.pk_org = org.id inner join ieop_role_user ru on ru.user_id=u.id inner join ieop_role r on r.id=ru.role_id where u.id in ( select USER_ID from IEOP_ROLE_USER where ROLE_CODE in "
	 * +inSql+")";
	 * 
	 * ResultSetProcessor processor = new ArrayListProcessor(); //
	 * ResultSetProcessor processor = new BeanListProcessor(UserInfoVo.class);
	 * // return metadataDAO.queryForList(sql, sqlParam, processor);
	 * List<Object[]> list = baseDAO.queryForList(sql, processor);
	 * List<UserInfoVo> userInfoList = new ArrayList<UserInfoVo>(); if
	 * (list!=null){ for (int i = 0; i < list.size(); i++) { int index = -1;
	 * UserInfoVo vo = new UserInfoVo(); Object[] obj = (Object[])list.get(i);
	 * vo.setUserid((String)obj[++index]); vo.setNickname((String)obj[++index]);
	 * vo.setUsername((String)obj[++index]);
	 * vo.setRealname((String)obj[++index]); vo.setMobile((String)obj[++index]);
	 * vo.setEmail((String)obj[++index]); vo.setPhoto((String)obj[++index]);
	 * vo.setRolecode((String)obj[++index]);
	 * vo.setRolename((String)obj[++index]);
	 * vo.setDepartment((String)obj[++index]);
	 * vo.setOrgname((String)obj[++index]); userInfoList.add(vo); } } return
	 * userInfoList; }
	 */

}
