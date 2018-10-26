package com.yonyou.iuap.bpm.approval.adapter.Identity;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.common.base.utils.BpmSynchroDataException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.entity.adapter.BpmOrgMappingVO;
import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmOrgMappingService;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmUserAdapterService;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.context.InvocationInfoProxy;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.identity.UserLinkQueryParam;
import yonyou.bpm.rest.request.identity.UserResourceParam;

/**
 * 
 * @ClassName: EiapBpmUserAdapterServiceImpl
 * @Description: 用户同步实现
 * @author qianmz
 * @date 2016年12月23日 上午8:52:17
 */
@Service
public class UserAdapterServiceImpl implements IEiapBpmUserAdapterService {

	private static final Logger log = LoggerFactory.getLogger(UserAdapterServiceImpl.class);

	@Autowired
	private IProcessService processService;

	@Autowired
	private UserMappingService userMappingService;

	@Autowired
	private IEiapBpmOrgMappingService orgrMappingService;

	@Override
	public void saveUser(Object user) throws BpmSynchroDataException {
		Object o = null;
		try {
			UserResourceParam userparam = this.parseToUserResourceParam((JSONObject.fromObject(user).toString()), null);
			o = processService.getIdentitySerevice().saveUser(userparam);
			if (o != null && StringUtils.isBlank(userparam.getId())) {
				JSONObject userjson = JSONObject.fromObject(o.toString());
				this.saveUserMapping(user, userjson.optString("id"));
			}
		} catch (RestException e) {
			log.error("bpm 同步新增用户异常！==》" + e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		} catch (BpmSynchroDataException e) {
			log.error("bpm 同步新增用户异常！==》" + e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		} catch (Exception e) {
			log.error("bpm 同步用户异常！==》" + e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		}
	}

	@Override
	public void deleteUser(String userId) throws BpmSynchroDataException {
		try {
			BpmUserMappingVO vo = userMappingService.findByLocalUserId(userId);
			if (vo != null) {
				userMappingService.delete(vo.getId());
				deleteUserLinkByRemoteUserId(vo.getRemoteuser_id());
				processService.getIdentitySerevice().deleteUser(vo.getRemoteuser_id());
			}
		} catch (Exception e) {
			log.error("bpm 同步删除用户异常！==》" + e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		}
	}

	private void deleteUserLinkByRemoteUserId(String userId) throws RestException {
		UserLinkQueryParam param = new UserLinkQueryParam();
		param.setUserId(userId);
		Object obj = processService.getIdentitySerevice().queryUserLinks(param);
		JSONArray data = JSONObject.fromObject(obj.toString()).optJSONArray("data");
		if (data != null && !data.isEmpty()) {
			for (int i = 0; i < data.size(); i++) {
				JSONObject o = data.getJSONObject(i);
				String linkId = o.optString("id");
				processService.getIdentitySerevice().deleteUserLink(linkId);
			}
		}
	}

	@Override
	public UserResourceParam parseToUserResourceParam(Object obj, UserResourceParam userParam) throws Exception {
		if (userParam == null) {
			userParam = new UserResourceParam();
		}

		JSONObject userJson = JSONObject.fromObject(obj);
		boolean isUpdate = userJson.optBoolean("isupdate");

		String localId = userJson.optString("id");
		String remoteId = userMappingService.findUseridByLocalUserId(localId);
		if (isUpdate && StringUtils.isNotBlank(remoteId)) {
			userParam.setId(remoteId);
			userParam.setRevision(1);
		} else {
			userParam.setRevision(0);
		}

		if (userJson.optBoolean("islock")) {
			userParam.setEnable(false);
		} else {
			userParam.setEnable(true);
		}

		userParam.setCode(userJson.optString("loginName"));
		userParam.setName(userJson.optString("name"));

		if (StringUtils.isBlank(userJson.optString("organizationId"))) {
			userParam.setOrgCode("default_org");
		} else {
			BpmOrgMappingVO vo = orgrMappingService.findByLocalOrgId(userJson.optString("organizationId"));
			if (vo == null) {
				throw new BpmSynchroDataException("组织尚未同步，请先同步组织！");
			}
			userParam.setOrgCode(vo.getLocalorg_code());
		}

		userParam.setCreateTime(new Date());
		userParam.setPhone(userJson.optString("phone"));
		userParam.setMail(userJson.optString("email"));
		userParam.setPic(userJson.optString("avator"));
		// 全部为系统管理员
		userParam.setSysadmin(true);
		userParam.setSource(InvocationInfoProxy.getSysid());

		return userParam;
	}

	public void saveUserMapping(Object localUser, String remoteUserId) throws BpmSynchroDataException {
		JSONObject userJson = null;
		BpmUserMappingVO userMapping = new BpmUserMappingVO();
		try {
			userJson = JSONObject.fromObject(localUser);
			userMapping.setId(CommonUtils.generateEntityId());
			userMapping.setLocaluser_id(userJson.optString("id"));
			userMapping.setLocaluser_code(userJson.optString("loginName"));
			userMapping.setRemoteuser_id(remoteUserId);
			userMappingService.save(userMapping);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			throw new BpmSynchroDataException("用户同步， 更新用户关联异常！");
		}
	}
}
