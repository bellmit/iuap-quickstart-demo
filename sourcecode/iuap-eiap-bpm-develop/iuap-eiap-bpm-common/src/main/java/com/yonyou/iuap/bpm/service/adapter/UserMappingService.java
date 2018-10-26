package com.yonyou.iuap.bpm.service.adapter;

import java.util.List;

import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;

public interface UserMappingService {

	public void save(BpmUserMappingVO userMapping) throws Exception;

	public void update(BpmUserMappingVO userMapping) throws Exception;

	public void delete(String id) throws Exception;

	/**
	 * 查询所有记录
	 * 
	 * @return
	 * @throws Exception
	 */
	public List<BpmUserMappingVO> findAll() throws Exception;

	public BpmUserMappingVO findByLocalUserId(String userId) throws Exception;

	String findUseridByLocalUserId(String localUserId) throws Exception;

	public List<BpmUserMappingVO> findByLocalUserIds(List<String> localids) throws Exception;

	public List<BpmUserMappingVO> findByRemoteUserIds(List<String> remoteids);

	public void deleteByLocalId(String localId) throws Exception;

}
