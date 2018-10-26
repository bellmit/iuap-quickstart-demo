package com.yonyou.iuap.bpm.approval.service.impl.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.adapter.BpmUserTokenDao;
import com.yonyou.iuap.bpm.entity.adapter.BpmUserTokenVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmUserTokenService;
@Service
public class EiapBpmUserTokenServiceImpl implements IEiapBpmUserTokenService{

	@Autowired
	private BpmUserTokenDao userTokenDao;
	@Override
	public void save(BpmUserTokenVO userToken) throws DataAccessException {
		userTokenDao.insert(userToken);
	}

	@Override
	public void update(BpmUserTokenVO userToken) throws DataAccessException {
		userTokenDao.update(userToken);
	}

	@Override
	public BpmUserTokenVO findByToken(String token) throws DataAccessException {
		return userTokenDao.findByToken(token);
	}

	@Override
	public void delete(String id) throws DataAccessException {
		userTokenDao.delete(id);
	}

	@Override
	public void deleteByLocalId(String localId) throws Exception {
		userTokenDao.deleteByLocalId(localId);
	}
}
