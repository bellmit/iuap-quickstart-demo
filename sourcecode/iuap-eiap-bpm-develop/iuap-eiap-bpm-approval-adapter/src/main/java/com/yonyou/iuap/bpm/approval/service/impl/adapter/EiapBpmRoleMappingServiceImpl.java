package com.yonyou.iuap.bpm.approval.service.impl.adapter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.adapter.BpmRoleMappingDao;
import com.yonyou.iuap.bpm.entity.adapter.BpmRoleMappingVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmRoleMappingService;
@Service
public class EiapBpmRoleMappingServiceImpl implements IEiapBpmRoleMappingService{

	@Autowired
	private BpmRoleMappingDao roleMappingDao;

	@Override
	public void save(BpmRoleMappingVO roleMapping) throws Exception {
		roleMappingDao.insert(roleMapping);
	}

	@Override
	public void delete(String id) throws Exception {
		roleMappingDao.delete(id);
	}

	@Override
	public BpmRoleMappingVO findByLocalRoleId(String roleId) throws Exception {
		return roleMappingDao.findByLocalRoleId(roleId);
	}

	@Override
	public List<BpmRoleMappingVO> findByLocalRoleIds(List<String> localids) {
		return roleMappingDao.findByLocalRoleIds(localids);
	}

	@Override
	public void deleteByLocalId(String localId) throws Exception {
		roleMappingDao.deleteByLocalId(localId);
	}
}
