package com.yonyou.iuap.bpm.service.adapter;

import org.springframework.dao.DataAccessException;

import com.yonyou.iuap.bpm.entity.adapter.BpmUserTokenVO;

public interface IEiapBpmUserTokenService {
	public void save(BpmUserTokenVO userToken) throws DataAccessException;
	public void update(BpmUserTokenVO userToken) throws DataAccessException;
	public BpmUserTokenVO findByToken(String token) throws DataAccessException;
	public void delete(String id) throws DataAccessException;
	public void deleteByLocalId(String localId) throws Exception;
}
