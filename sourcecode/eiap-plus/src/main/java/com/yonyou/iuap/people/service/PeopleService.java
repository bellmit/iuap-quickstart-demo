package com.yonyou.iuap.people.service;

import com.yonyou.iuap.base.service.BaseService;
import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.people.dao.PeopleDao;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.persistence.bs.jdbc.meta.access.DASFacade;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;
import com.yonyou.iuap.persistence.jdbc.framework.util.FastBeanHelper;
import com.yonyou.iuap.persistence.jdbc.framework.util.SQLHelper;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * Title: CardTableMetaService
 * </p>
 * <p>
 * Description:
 * </p>
 */
@Service
public class PeopleService extends BaseService<People, PeopleDao> {

	@Autowired
	private PeopleDao dao;
	
	private Logger logger = LoggerFactory.getLogger(PeopleDao.class);

	/** 参照id和显示字段 这里进行转换 */
	protected Page<People> setRefName(Page<People> pageResult) {
		if (pageResult != null && pageResult.getContent() != null
				&& pageResult.getContent().size() > 0) {
			/**
			 * 下面的 xx.xxx, xx表示参照对应的外键属性名， xxx是参照实体对应的属性名，
			 * */
			Map<String, Map<String, Object>> refMap = DASFacade
					.getAttributeValueAsPKMap(new String[] { "pk_org.name",
							"pk_dept.name", 
//							"creator.name",
//							"modifier.name", 
//							"pk_user.name",
							},
							pageResult.getContent().toArray(new People[] {}));
			for (People item : pageResult.getContent()) {
				String id = item.getPk_psndoc();
				Map<String, Object> itemRefMap = refMap.get(id);
				if (itemRefMap != null) {
					item.setPk_org_name((String) itemRefMap.get("pk_org.name"));
					item.setPk_dept_name((String) itemRefMap
							.get("pk_dept.name"));
//					item.setCreator_name((String) itemRefMap
//							.get("creator.name"));
//					item.setModifier_name((String) itemRefMap
//							.get("modifier.name"));
//					item.setPk_user_name((String) itemRefMap.get("pk_user.name"));
				}
			}
		}
		return pageResult;
	}
	
	protected void processFieldDataPermResTypeMap(Map<String, String> fieldDataPermResTypeMap){
		fieldDataPermResTypeMap.put("pk_org", "organization"); //字段与权限资源名称的对应关系
	}
	
	
	
	
	
	
	public Page<People> selectAllByPageForRef(PageRequest pageRequest, SearchParams searchParams, boolean isUseDataPerm) {
		Map<String, String> fieldDataPermResTypeMap = new HashMap<String, String>();
		if(isUseDataPerm){
			fieldDataPermResTypeMap.put(FastBeanHelper.getPKFieldName(People.class), "people");
		}
		return selectAllByPage(pageRequest, searchParams.getSearchMap(), People.class, fieldDataPermResTypeMap);
	}


	public List<People> getByIds(String tenantId, List<String> ids) {
//		String sql = " SELECT * FROM iuap_qy_people WHERE org.tenant_id = ? AND id IN "
//				+ buildSQLParamIn(ids) + " ";
//		String sql = " SELECT * FROM iuap_qy_people WHERE PK_PSNDOC IN "
//				+ buildSQLParamIn(ids) + " ";
		
		StringBuilder sqlBuilder = new StringBuilder();
		sqlBuilder.append("SELECT * FROM iuap_qy_people");
		sqlBuilder.append(" where ");
		String inPart = SQLHelper.createInPart(ids.size(), "PK_PSNDOC");
		sqlBuilder.append(inPart);
		SQLParameter sqlParam = new SQLParameter();
		for (String param : ids) {
			sqlParam.addParam(param);
		}

		//sqlParam.addParam(CommonUtils.getTenantId());

		return dao.queryByClause(sqlBuilder.toString(), sqlParam);
	}
	
	public List<People> getByName(String name) {
		return dao.findByNameOrCodeLike(name);
	}

	private String buildSQLParamIn(List<String> ids) {
		if (!CollectionUtils.isEmpty(ids)) {
			StringBuffer sb = new StringBuffer();
			sb.append(" ( ");
			for (String id : ids) {
				sb.append(" '").append(id).append("', ");
			}
			sb.append(" )");
			String sql = new String(sb.reverse()).replaceFirst(",", "");
			return new StringBuffer(sql).reverse().toString();
		}
		return null;
	}

	/**
	 * 根据名称匹配数据---提供给数据权限参照使用
	 * 
	 * @param string
	 * @param content
	 * @return
	 * @throws NoSuchFieldException
	 */
	public List<People> likeSearch(String attribute, String keyword)
			throws NoSuchFieldException {
		List<People> resutls = new ArrayList();

		if (isAttributeOfEntity(attribute)) {
			String sql = " SELECT * FROM iuap_qy_people WHERE 1=1 AND "
					+ attribute + " like ? ";
			SQLParameter sqlparam = new SQLParameter();
			sqlparam.addParam("%" + keyword + "%");
			resutls = dao.queryByClause(sql, sqlparam);
		} else {
			throw new NoSuchFieldException("属性不存在!");
		}
		return resutls;
	}

	private boolean isAttributeOfEntity(String attribute) {
		boolean flag = false;
		try {
			People.class.getDeclaredField(attribute);
			flag = true;
		} catch (NoSuchFieldException e) {
			logger.error("属性不存在：", e);
		} catch (SecurityException e) {
			logger.error(e.getMessage(), e);
		}
		return flag;
	}
	
	/**
	 * 根据用户id获取人员，人员档案和用户是一对一的关系
	 * 
	 * @param string
	 * @param content
	 * @return
	 * @throws NoSuchFieldException
	 */
	public People getByUserId(String pk_user,String tenantId) throws Exception{
		return dao.queryByUserId(pk_user, tenantId);
	}

	/**
	 * 用于人员同步
	 * @param entity
	 * @return
	 */
	@Transactional
	public String insertWithPK(People entity) {
		return dao.insertWithPK(entity);
	}
}

