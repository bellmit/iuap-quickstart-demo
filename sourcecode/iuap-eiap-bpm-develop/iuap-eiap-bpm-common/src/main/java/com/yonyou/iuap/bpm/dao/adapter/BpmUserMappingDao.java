package com.yonyou.iuap.bpm.dao.adapter;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface BpmUserMappingDao {

	public void insert(BpmUserMappingVO userMapping) throws Exception;

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

	public List<BpmUserMappingVO> findByLocalUserIds(List<String> localids);

	public List<BpmUserMappingVO> findByRemoteUserIds(@Param("remoteids") List<String> remoteids);

	public void deleteByLocalId(String localId) throws Exception;
}
