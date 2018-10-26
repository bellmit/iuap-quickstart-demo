package com.yonyou.iuap.bpm.dao.adapter;

import java.util.List;

import com.yonyou.iuap.bpm.entity.adapter.BpmRoleMappingVO;
import com.yonyou.iuap.persistence.mybatis.anotation.MyBatisRepository;

@MyBatisRepository
public interface BpmRoleMappingDao {

	public void insert(BpmRoleMappingVO roleMapping) throws Exception;
	public void update(BpmRoleMappingVO roleMapping) throws Exception;
	public void delete(String id) throws Exception;
	public BpmRoleMappingVO findByLocalRoleId(String roleId) throws Exception;
	public List<BpmRoleMappingVO> findByLocalRoleIds(List<String> localids);
	public void deleteByLocalId(String localId) throws Exception;
}
