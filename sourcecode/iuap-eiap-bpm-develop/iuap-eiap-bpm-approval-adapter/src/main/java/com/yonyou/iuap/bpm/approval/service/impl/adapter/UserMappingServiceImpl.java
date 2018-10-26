package com.yonyou.iuap.bpm.approval.service.impl.adapter;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.yonyou.iuap.bpm.common.base.utils.BpmRuntimeException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.common.base.utils.IConst;
import com.yonyou.iuap.bpm.dao.adapter.BpmUserMappingDao;
import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;

@Service("UserMappingService")
public class UserMappingServiceImpl implements UserMappingService {

	private static final Logger log = LoggerFactory.getLogger(UserMappingServiceImpl.class);

	@Autowired
	private BpmUserMappingDao userMappingDao;

	@Override
	public void save(BpmUserMappingVO userMapping) throws Exception {
		userMappingDao.insert(userMapping);
	}

	@Override
	public void update(BpmUserMappingVO userMapping) throws Exception {
		userMappingDao.update(userMapping);
	}

	@Override
	public void delete(String id) throws Exception {
		userMappingDao.delete(id);
	}

	@Override
	public List<BpmUserMappingVO> findAll() throws Exception {
		return this.userMappingDao.findAll();
	}

	@Override
	public BpmUserMappingVO findByLocalUserId(String userId) throws Exception {
		BpmUserMappingVO vo = userMappingDao.findByLocalUserId(userId);
		if (vo == null && IConst.SYS_ADMIN_ID.equals(userId)) {
			vo = this.initSysUserMapping();
		}
		return vo;
	}

	@Override
	public String findUseridByLocalUserId(String localUserId) throws Exception {
		BpmUserMappingVO userMapping = userMappingDao.findByLocalUserId(localUserId);
		if (userMapping == null && IConst.SYS_ADMIN_ID.equals(localUserId)) {
			userMapping = this.initSysUserMapping();
		}
		if (userMapping == null) {
			return null;
		}
		return userMapping.getRemoteuser_id();
	}

	@Override
	public List<BpmUserMappingVO> findByLocalUserIds(List<String> localids) throws Exception {
		// 如果包含工作台系统ID，先初始化一下映射关系
		if (localids.contains(IConst.SYS_ADMIN_ID)) {
			this.findByLocalUserId(IConst.SYS_ADMIN_ID);
		}
		return userMappingDao.findByLocalUserIds(localids);
	}

	@Override
	public List<BpmUserMappingVO> findByRemoteUserIds(List<String> remoteids) {
		return userMappingDao.findByRemoteUserIds(remoteids);
	}

	@Override
	public void deleteByLocalId(String localId) throws Exception {
		userMappingDao.deleteByLocalId(localId);
	}

	/**
	 * 初始化系统管理员和云审租用对应用户映射的关系
	 * 
	 * @param adminCode
	 */
	private BpmUserMappingVO initSysUserMapping() {
		try {
			BpmUserMappingVO userMappingVo = new BpmUserMappingVO();

			userMappingVo.setLocaluser_id(IConst.SYS_ADMIN_ID);
			userMappingVo.setLocaluser_code(IConst.SYS_ADMIN_CODE);
			userMappingVo.setRemoteuser_id(CommonUtils.getDefaultBpmTenantUserId());

			userMappingVo.setId(CommonUtils.generateEntityId());

			this.save(userMappingVo);

			return userMappingVo;
		} catch (Exception e) {
			log.error("初始化系统管理员和云审默认租户管理员关系异常！");
			throw new BpmRuntimeException("初始化系统管理员和云审默认租户管理员关系异常：", e);
		}
	}
}
