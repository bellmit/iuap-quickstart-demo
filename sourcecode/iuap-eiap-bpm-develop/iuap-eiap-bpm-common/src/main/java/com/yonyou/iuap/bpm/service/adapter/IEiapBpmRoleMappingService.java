package com.yonyou.iuap.bpm.service.adapter;

import java.util.List;

import com.yonyou.iuap.bpm.entity.adapter.BpmRoleMappingVO;

public interface IEiapBpmRoleMappingService {
	public void save(BpmRoleMappingVO roleMapping) throws Exception;
	public void delete(String id) throws Exception;
	public BpmRoleMappingVO findByLocalRoleId(String roleId) throws Exception;
	public List<BpmRoleMappingVO> findByLocalRoleIds(List<String> localids);
	public void deleteByLocalId(String localId) throws Exception;
}
