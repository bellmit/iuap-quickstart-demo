package com.yonyou.iuap.bpm.approval.service.impl.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.adapter.BpmOrgMappingDao;
import com.yonyou.iuap.bpm.entity.adapter.BpmOrgMappingVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmOrgMappingService;
@Service
public class EiapBpmOrgMappingServiceImpl implements IEiapBpmOrgMappingService{

	@Autowired
	private BpmOrgMappingDao orgMappingDao;

	@Override
	public void save(BpmOrgMappingVO orgMapping) throws Exception {
		orgMappingDao.insert(orgMapping);
	}

	@Override
	public void delete(String id) throws Exception {
		orgMappingDao.delete(id);
	}

	@Override
	public BpmOrgMappingVO findByLocalOrgId(String orgId) throws Exception {
		return orgMappingDao.findByLocalOrgId(orgId);
	}

	@Override
	public String findRemoteIdByLocalOrgId(String orgId) throws Exception {
		BpmOrgMappingVO vo = this.findByLocalOrgId(orgId);
		if(vo==null) return null;
		return vo.getRemoteorg_id();
	}

	@Override
	public void deleteByLocalId(String localId) throws Exception {
		orgMappingDao.deleteByLocalId(localId);
	}

	@Override
	public void deleteByRemotelId(String remoteId) throws Exception {
		orgMappingDao.deleteByRemotelId(remoteId);
	}
}
