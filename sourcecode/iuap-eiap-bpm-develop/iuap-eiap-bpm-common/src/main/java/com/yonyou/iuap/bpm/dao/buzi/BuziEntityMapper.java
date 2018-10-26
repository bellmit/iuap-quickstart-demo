package com.yonyou.iuap.bpm.dao.buzi;

import org.springframework.dao.DataAccessException;

import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface BuziEntityMapper {

	/**
	 * 根据表单实体主键查询记录，关联子表查询，查询除相应字段
	 * 
	 * @param entityId
	 * @return
	 */
	public BuziEntityVO getEntityAndFieldsByEntityId(String entityId) throws DataAccessException;

	/**
	 * 根据表单编码查询记录
	 * 
	 * @param formCode
	 * @return
	 * @throws DataAccessException
	 */
	public BuziEntityVO getByFormCode(String formCode) throws DataAccessException;
	
	
	public void insert(BuziEntityVO buziEntityVO) throws DataAccessException;

	public void update(BuziEntityVO buziEntityVO) throws DataAccessException;

	public void  delete(String  id) throws DataAccessException;
}