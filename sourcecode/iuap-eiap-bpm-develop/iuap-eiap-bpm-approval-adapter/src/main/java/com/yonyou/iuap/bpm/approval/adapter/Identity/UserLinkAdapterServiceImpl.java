package com.yonyou.iuap.bpm.approval.adapter.Identity;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.common.base.utils.BpmSynchroDataException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.entity.adapter.BpmRoleMappingVO;
import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmRoleMappingService;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmUserLinkAdapterService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.identity.UserLinkQueryParam;
import yonyou.bpm.rest.request.identity.UserLinkResourceParam;

/**
 * @ClassName: EiapBpmUserLinkAdapterServiceImpl
 * @Description: 角色用户关系同步
 * @author qianmz
 * @date 2016年12月23日 上午8:53:12
 */
@Service
public class UserLinkAdapterServiceImpl implements IEiapBpmUserLinkAdapterService {

	private static final Logger log = LoggerFactory.getLogger(UserGroupAdapterServiceImpl.class);

	@Autowired
	private IProcessService processService;

	@Autowired
	private IEiapBpmRoleMappingService roleMappingService;

	@Autowired
	private UserMappingService userMappingService;

	@Override
	public void saveUserLinks(Object userRole) throws BpmSynchroDataException {
		JSONArray json = JSONArray.fromObject(userRole);
		try {
			UserLinkResourceParam[] params = getParams(json);
			processService.getIdentitySerevice().saveUserLinks(params);
		} catch (RestException e) {
			log.error(e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage(), e);
			throw new BpmSynchroDataException(e.getLocalizedMessage(), e);
		}
	}

	@Override
	public void deleteUserLink(Object userRole) throws BpmSynchroDataException {
		try {
			List<String> userIds = paseUserIds(userRole);
			List<String> roleIds = paseRoleIds(userRole);
			UserLinkQueryParam param = new UserLinkQueryParam();
			param.setUserIds(userIds);
			param.setGroupIds(roleIds);
			Object o = processService.getIdentitySerevice().queryUserLinks(param);
			List<String> linkIds = paseLinkIds(o, userIds, roleIds);
			for (String id : linkIds) {
				processService.getIdentitySerevice().deleteUserLink(id);
			}
		} catch (RestException e) {
			log.error(e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage(), e);
			throw new BpmSynchroDataException(e.getLocalizedMessage(), e);
		}
	}

	private List<String> paseLinkIds(Object o, List<String> userIds, List<String> roleIds) {
		List<String> ids = new ArrayList<String>();
		JSONObject json = JSONObject.fromObject(o.toString());
		JSONArray array = json.optJSONArray("data");
		if (array != null && array.size() > 0) {
			for (int i = 0; i < json.size(); i++) {
				JSONObject obj = array.optJSONObject(i);
				if (obj != null && userIds.contains(obj.optString("userId"))
						&& roleIds.contains(obj.optString("targetId"))) {
					ids.add(obj.optString("id"));
				}
			}
		}
		return ids;
	}

	@Override
	public UserLinkResourceParam paseToUserLinkParam(Object obj, UserLinkResourceParam userParam)
			throws BpmSynchroDataException {
		return null;
	}

	private UserLinkResourceParam[] getParams(JSONArray json) throws Exception {
		List<UserLinkResourceParam> paramList = new ArrayList<UserLinkResourceParam>();
		if (json == null || json.isEmpty())
			return null;
		List<String> userIds = paseUserIds(json);
		List<String> roleIds = paseRoleIds(json);
		int len = 0;
		if (roleIds.size() > 1) {
			len = roleIds.size();
		} else {
			len = userIds.size();
		}
		UserLinkResourceParam p = null;
		for (int i = 0; i < len; i++) {
			String userId = userIds.size() == len && !"null".equalsIgnoreCase(userIds.get(i)) ? userIds.get(i)
					: userIds.get(0);
			String roleId = roleIds.size() == len && !"null".equalsIgnoreCase(roleIds.get(i)) ? roleIds.get(i)
					: roleIds.get(0);
			p = new UserLinkResourceParam();
			p.setType(UserLinkResourceParam.TYPE_USERGROUP);
			p.setUserId(userId);
			p.setTargetId(roleId);
			p.setEnable(true);
			p.setTenantId(CommonUtils.getDefaultBpmTenantId());
			p.setRevision(0);
			paramList.add(p);
		}
		return paramList.toArray(new UserLinkResourceParam[0]);
	}

	private List<String> paseUserIds(Object obj) throws Exception {
		if (obj == null)
			return null;
		JSONArray json = JSONArray.fromObject(obj);
		List<String> userIdList = new ArrayList<String>();
		List<String> remoteUserIds = new ArrayList<String>();
		for (int i = 0; i < json.size(); i++) {
			JSONObject o = json.optJSONObject(i);
			userIdList.add(o.optString("userID"));
		}
		List<BpmUserMappingVO> userMaps = userMappingService.findByLocalUserIds(userIdList);
		if (userMaps == null || userMaps.isEmpty())
			return null;
		for (BpmUserMappingVO vo : userMaps) {
			remoteUserIds.add(vo.getRemoteuser_id());
		}
		return remoteUserIds;
	}

	private List<String> paseRoleIds(Object obj) {
		if (obj == null)
			return null;
		JSONArray json = JSONArray.fromObject(obj);
		List<String> remoteUserIds = new ArrayList<String>();
		List<String> roleIdList = new ArrayList<String>();
		for (int i = 0; i < json.size(); i++) {
			JSONObject o = json.optJSONObject(i);
			roleIdList.add(o.optString("roleID"));
		}
		List<BpmRoleMappingVO> roleMaps = roleMappingService.findByLocalRoleIds(roleIdList);
		if (roleMaps == null || roleMaps.isEmpty())
			return null;
		for (BpmRoleMappingVO vo : roleMaps) {
			remoteUserIds.add(vo.getRemoterole_id());
		}
		return remoteUserIds;

	}
}
