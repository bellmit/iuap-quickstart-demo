package com.yonyou.iuap.bpm.dao.adapter;

import org.springframework.dao.DataAccessException;

import com.yonyou.iuap.bpm.entity.adapter.BpmUserTokenVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface BpmUserTokenDao {
	public void insert(BpmUserTokenVO userToken) throws DataAccessException;
	public void update(BpmUserTokenVO userToken) throws DataAccessException;
	public BpmUserTokenVO findByToken(String token) throws DataAccessException;
	public void delete(String id) throws DataAccessException;
	public void deleteByLocalId(String localId) throws Exception;
}
