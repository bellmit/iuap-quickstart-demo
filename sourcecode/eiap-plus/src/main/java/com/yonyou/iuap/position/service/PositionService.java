package com.yonyou.iuap.position.service;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yonyou.iuap.mvc.type.SearchParams;
import com.yonyou.iuap.people.dao.PeopleDao;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.persistence.bs.dao.DAOException;
import com.yonyou.iuap.persistence.jdbc.framework.SQLParameter;
import com.yonyou.iuap.persistence.jdbc.framework.util.FastBeanHelper;
import com.yonyou.iuap.persistence.jdbc.framework.util.SQLHelper;
import com.yonyou.iuap.position.dao.PositionDao;
import com.yonyou.iuap.position.entity.Position;


@Service
public class PositionService {

	@Autowired
    private PositionDao positionDao;
	
	private Logger logger = LoggerFactory.getLogger(PeopleDao.class);
	
	@Transactional(rollbackFor = DAOException.class)
    public void save(Position position) throws DAOException {
		position.setId(UUID.randomUUID().toString());
		position.setDr(0);//删除标志 0未删除 1已经删除
		position.setEnable(1);//可用标志 1可用 0不可用
        positionDao.save(position);
    }

    @Transactional(rollbackFor = DAOException.class)
    public void update(Position position) throws DAOException {
        positionDao.update(position);
    }

    //按照主键物理删除
    @Transactional(rollbackFor = DAOException.class)
    public void remove(String id) throws DAOException {
    	Position position = new Position();
    	position.setId(id);
        positionDao.remove(position);
    }
    
    //逻辑删除
    @Transactional(rollbackFor = DAOException.class)
    public void removeBy(String id) throws DAOException {
    	Position position = new Position();
    	position.setId(id);
    	position.setDr(1);
    	position.setEnable(0);
    	positionDao.update(position);
    }

    public Position queryById(String id) throws DAOException {
        return positionDao.queryByID(id);
    }
    
	public List<Position> getByName(String name) {
		return positionDao.findByNameOrCodeLike(name);
	}

    public Page<Position> queryPage(String name,String code,PageRequest pageRequest) throws DAOException {
        return positionDao.queryPage(name,code,pageRequest);
    }
    
    public Page<Position> selectAllByPageForRef(PageRequest pageRequest, SearchParams searchParams, boolean isUseDataPerm) {
		Map<String, String> fieldDataPermResTypeMap = new HashMap<String, String>();
		//TODO 不懂
//		if(isUseDataPerm){
//			fieldDataPermResTypeMap.put(FastBeanHelper.getPKFieldName(Position.class), "people");
//		}
		return positionDao.selectAllByPage(pageRequest, searchParams.getSearchMap());
	}

    
    /**
	 * 根据名称匹配数据---提供给数据权限参照使用
	 * 
	 * @param string
	 * @param content
	 * @return
	 * @throws NoSuchFieldException
	 */
	public List<Position> likeSearch(String attribute, String keyword)
			throws NoSuchFieldException {
		List<Position> resutls = new ArrayList<Position>();

		if (isAttributeOfEntity(attribute)) {
			String sql = " SELECT * FROM bd_position WHERE 1=1 AND "
					+ attribute + " like ? ";
			SQLParameter sqlparam = new SQLParameter();
			sqlparam.addParam("%" + keyword + "%");
			resutls = positionDao.queryByClause(sql, sqlparam);
		} else {
			throw new NoSuchFieldException("属性不存在!");
		}
		return resutls;
	}
	private boolean isAttributeOfEntity(String attribute) {
		boolean flag = false;
		try {
			Position.class.getDeclaredField(attribute);
			flag = true;
		} catch (NoSuchFieldException e) {
			logger.error("属性不存在：", e);
		} catch (SecurityException e) {
			logger.error(e.getMessage(), e);
		}
		return flag;
	}
	
	/**
	 * 根据主键id查询
	 * @param tenantId
	 * @param ids
	 * @return
	 */
	public List<Position> getByIds(String tenantId, List<String> ids) {
		
		StringBuilder sqlBuilder = new StringBuilder();
		sqlBuilder.append("SELECT * FROM bd_position");
		sqlBuilder.append(" where ");
		//TODO 不懂 这句
		String inPart = SQLHelper.createInPart(ids.size(), "id");
		sqlBuilder.append(inPart);
		SQLParameter sqlParam = new SQLParameter();
		for (String param : ids) {
			sqlParam.addParam(param);
		}

		return positionDao.queryByClause(sqlBuilder.toString(), sqlParam);
	}
}
