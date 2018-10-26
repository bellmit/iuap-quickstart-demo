package com.yonyou.iuap.bpm.dao.adapter;

import com.yonyou.iuap.bpm.entity.adapter.BpmOrgMappingVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface BpmOrgMappingDao {

	public void insert(BpmOrgMappingVO orgMapping) throws Exception;

	public void update(BpmOrgMappingVO orgMapping) throws Exception;

	public void delete(String id) throws Exception;

	public BpmOrgMappingVO findByLocalOrgId(String orgId) throws Exception;

	public void deleteByLocalId(String localId) throws Exception;

	public void deleteByRemotelId(String remoteId) throws Exception;
}
