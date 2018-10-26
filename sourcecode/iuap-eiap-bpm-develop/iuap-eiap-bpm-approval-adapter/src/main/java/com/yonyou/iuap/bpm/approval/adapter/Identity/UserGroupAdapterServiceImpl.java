package com.yonyou.iuap.bpm.approval.adapter.Identity;

import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.common.base.utils.BpmSynchroDataException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.entity.adapter.BpmRoleMappingVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmRoleMappingService;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmUserGroupAdapterService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.context.InvocationInfoProxy;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import yonyou.bpm.rest.request.identity.UserGroupResourceParam;
import yonyou.bpm.rest.request.identity.UserLinkQueryParam;

/**
 * 角色同步实现
 * 
 * @ClassName: EiapBpmUserGroupAdapterServiceImpl
 * @Description: TODO
 * @author qianmz
 * @date 2016年12月23日 上午8:52:56
 */
@Service
public class UserGroupAdapterServiceImpl implements IEiapBpmUserGroupAdapterService {

	private static final Logger log = LoggerFactory.getLogger(UserGroupAdapterServiceImpl.class);

	@Autowired
	private IProcessService processService;

	@Autowired
	private IEiapBpmRoleMappingService roleMappingService;

	@Override
	public void saveUserGroup(Object userGroup) throws BpmSynchroDataException {
		JSONObject json = JSONObject.fromObject(userGroup);
		UserGroupResourceParam param = paseToUserGroupResourceParam(json);
		Object o = null;
		try {
			o = processService.getIdentitySerevice().saveUserGroup(param);
			if (o != null && StringUtils.isBlank(param.getId())) {
				BpmRoleMappingVO vo = new BpmRoleMappingVO();
				vo.setId(CommonUtils.generateEntityId());
				vo.setCreate_date(new Date());
				vo.setLocalrole_code(json.optString("roleCode"));
				vo.setLocalrole_id(json.optString("id"));
				vo.setRemoterole_id(JSONObject.fromObject(o.toString()).optString("id"));
				roleMappingService.save(vo);
			}
		} catch (Exception e) {
			log.error("bpm 同步角色保存异常", e);
		}
	}

	@Override
	public void deleteUserGroup(String userGroupId) throws BpmSynchroDataException {
		try {
			BpmRoleMappingVO vo = roleMappingService.findByLocalRoleId(userGroupId);
			if (vo != null) {
				roleMappingService.delete(vo.getId());
				deleteUserLinkByUserGroupId(vo.getRemoterole_id());
				processService.getIdentitySerevice().deleteUserGroup(vo.getRemoterole_id());
			}
		} catch (Exception e) {
			log.error("bpm 同步删除角色异常！", e);
			throw new BpmSynchroDataException(e);
		}
	}

	private void deleteUserLinkByUserGroupId(String id) throws BpmSynchroDataException {
		UserLinkQueryParam param = new UserLinkQueryParam();
		param.setGroupId(id);
		try {
			Object obj = processService.getIdentitySerevice().queryUserLinks(param);
			if (obj != null) {
				JSONArray array = JSONArray.fromObject(obj);
				if (array != null && array.size() > 0) {
					for (int i = 0; i < array.size(); i++) {
						JSONObject o = array.getJSONObject(i);
						String linkId = o.optString("id");
						if (StringUtils.isNotEmpty(linkId)) {
							processService.getIdentitySerevice().deleteUserLink(linkId);
						}
					}
				}
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		}
	}

	@Override
	public UserGroupResourceParam paseToUserGroupResourceParam(Object obj) throws BpmSynchroDataException {
		if (obj == null)
			return null;
		UserGroupResourceParam param;
		try {
			JSONObject json = JSONObject.fromObject(CommonUtils.toUTF8(obj.toString()));
			boolean isUpdate = json.optBoolean("isupdate");
			String localId = json.optString("id");
			BpmRoleMappingVO vo = roleMappingService.findByLocalRoleId(localId);
			param = new UserGroupResourceParam();
			if (isUpdate && vo != null) {
				param.setRevision(1);
				param.setId(vo.getRemoterole_id());
			} else {
				param.setRevision(0);
			}
			param.setSource(InvocationInfoProxy.getSysid());
			param.setCode(json.optString("roleCode"));
			param.setName(json.optString("roleName"));
			param.setEnable(true);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		}
		return param;
	}
}
