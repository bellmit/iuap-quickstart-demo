package com.yonyou.iuap.bpm.dao.buzi;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface BuziEntityFieldMapper {

	public List<BuziEntityFieldVO> findByFormCode(String formCode);

	/**
	 * 根据业务实体ID查询，不涉及关联表
	 * 
	 * @param buizEntityId
	 * @return
	 * @throws DataAccessException
	 */
	public List<BuziEntityFieldVO> findByBuizEntityId(String buizEntityId) throws DataAccessException;
	
	public List<BuziEntityFieldVO> findByModelID(String modelId) throws DataAccessException;
	
	public void insert(BuziEntityFieldVO buziEntityFieldVO) throws DataAccessException;

	public void update(BuziEntityFieldVO buziEntityFieldVO) throws DataAccessException;

	public void delete(String  id) throws DataAccessException;

	public void insertBatch(List<BuziEntityFieldVO> buziEntityFieldVOs) throws DataAccessException;

}