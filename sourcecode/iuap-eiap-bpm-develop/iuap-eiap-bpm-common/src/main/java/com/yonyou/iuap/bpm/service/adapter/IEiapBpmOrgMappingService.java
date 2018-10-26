package com.yonyou.iuap.bpm.service.adapter;

import com.yonyou.iuap.bpm.entity.adapter.BpmOrgMappingVO;

public interface IEiapBpmOrgMappingService {
	public void save(BpmOrgMappingVO orgMapping) throws Exception;
	public void delete(String id) throws Exception;
	public BpmOrgMappingVO findByLocalOrgId(String orgId) throws Exception;
	public String findRemoteIdByLocalOrgId(String orgId) throws Exception;
	public void deleteByLocalId(String localId) throws Exception;
	public void deleteByRemotelId(String remoteId) throws Exception;
}
