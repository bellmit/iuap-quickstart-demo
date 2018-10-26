package com.yonyou.iuap.bpm.approval.adapter.Identity;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.common.base.utils.BpmSynchroDataException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.common.base.utils.IConst;
import com.yonyou.iuap.bpm.entity.adapter.BpmOrgMappingVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmOrgAdapterService;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmOrgMappingService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;
import com.yonyou.iuap.context.InvocationInfoProxy;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.identity.OrgQueryParam;
import yonyou.bpm.rest.request.identity.OrgResourceParam;
import yonyou.bpm.rest.request.identity.UserLinkQueryParam;
import yonyou.bpm.rest.request.identity.UserLinkResourceParam;

/**
 * 
 * @ClassName: EiapBpmOrgAdapterServiceImpl
 * @Description: 组织同步实现
 * @author qianmz
 * @date 2016年12月23日 上午8:52:43
 */
@Service
public class OrgAdapterServiceImpl implements IEiapBpmOrgAdapterService {

	private static final Logger log = LoggerFactory.getLogger(UserAdapterServiceImpl.class);

	@Autowired
	private IProcessService processService;

	@Autowired
	private UserMappingService userMappingService;

	@Autowired
	private IEiapBpmOrgMappingService orgMappingService;

	@Override
	public void saveOrg(Object org) throws BpmSynchroDataException {
		Object o = null;
		try {
			JSONObject json = JSONObject.fromObject(org);
			OrgResourceParam param = paseToOrgResourceParam(json);
			o = processService.getIdentitySerevice().saveOrg(param);

			if (o != null) {
				// 保存用户映射关系
				String principal = json.optString("principal");
				boolean isUpdate = json.optBoolean("isupdate");
				// 负责人
				if (StringUtils.isNotEmpty(principal)) {
					UserLinkResourceParam userLinkResourceParam = new UserLinkResourceParam();

					userLinkResourceParam.setType("deptmgr");

					String remoteUserId = this.userMappingService.findUseridByLocalUserId(principal);
					if (StringUtils.isEmpty(remoteUserId)) {
						throw new BpmSynchroDataException("组织负责人没有同步！");
					}
					userLinkResourceParam.setUserId(remoteUserId);
					String remoteOrgId = JSONObject.fromObject(o.toString()).optString("id");
					userLinkResourceParam.setTargetId(remoteOrgId);
					if (isUpdate) {
						Map<String, String> orgUserLinkMap = this.getOrgUserLinkId(remoteOrgId);
						String orgUserLinkId = orgUserLinkMap.get("id");
						String revision = orgUserLinkMap.get("revision");
						userLinkResourceParam.setId(orgUserLinkId);
						userLinkResourceParam.setRevision(Integer.valueOf(revision));
					} else {
						userLinkResourceParam.setRevision(0);
					}

					this.processService.getIdentitySerevice().saveUserLink(userLinkResourceParam);
				}

				if (StringUtils.isBlank(param.getId())) {

					BpmOrgMappingVO vo = new BpmOrgMappingVO();
					vo.setCreate_date(new Date());
					vo.setId(CommonUtils.generateEntityId());
					vo.setLocalorg_code(json.optString("code"));
					vo.setLocalorg_id(json.optString("id"));
					vo.setRemoteorg_id(JSONObject.fromObject(o.toString()).optString("id"));
					orgMappingService.save(vo);
				}
			}
		} catch (Exception e) {
			log.error(e.getMessage());
			throw new BpmSynchroDataException(e);
		}
	}

	@Override
	public void deleteOrg(Object obj) throws BpmSynchroDataException {
		try {
			JSONObject json = JSONObject.fromObject(obj);
			BpmOrgMappingVO vo = orgMappingService.findByLocalOrgId(json.optString("id"));
			if (vo != null) {
				OrgQueryParam param = new OrgQueryParam();
				param.setParent(vo.getRemoteorg_id());
				Object childOrgsJson = processService.getIdentitySerevice().queryOrgs(param);
				if (childOrgsJson != null) {
					JSONArray array = JSONObject.fromObject(childOrgsJson.toString()).optJSONArray("data");
					if (array != null && !array.isEmpty()) {
						for (int i = 0; i < array.size(); i++) {
							String remoteId = array.optJSONObject(i).optString("id");
							orgMappingService.deleteByRemotelId(remoteId);
							processService.getIdentitySerevice().deleteOrg(remoteId);

						}
					}
					this.processService.getIdentitySerevice().deleteOrg(vo.getRemoteorg_id());
				}
				orgMappingService.deleteByLocalId(vo.getLocalorg_id());
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			throw new BpmSynchroDataException(e);
		}
	}

	@Override
	public OrgResourceParam paseToOrgResourceParam(Object obj) throws BpmSynchroDataException {
		OrgResourceParam org = new OrgResourceParam();
		try {
			JSONObject json = JSONObject.fromObject(obj);

			String localId = StringUtils.isBlank(json.optString("id")) ? "-1" : json.optString("id");
			String remoteId = orgMappingService.findRemoteIdByLocalOrgId(localId);

			boolean isUpdate = json.optBoolean("isupdate");
			if (isUpdate) {
				org.setId(remoteId);
				org.setRevision(1);
				org.setModifier(userMappingService.findUseridByLocalUserId(CommonUtils.getCurUserId()));
			} else {
				org.setRevision(0);
				org.setCreator(userMappingService.findUseridByLocalUserId(CommonUtils.getCurUserId()));
			}

			org.setSource(InvocationInfoProxy.getSysid());
			org.setCode(json.optString("code"));
			org.setEnable(true);
			org.setName(json.optString("name"));
			org.setTenantId(CommonUtils.getDefaultBpmTenantId());

			String parent_id = json.optString("parent_id");
			// 组织部门默认为上级组织默认为""
			if (!"".equals(parent_id)) {
				String remoteParentId = orgMappingService.findRemoteIdByLocalOrgId(parent_id);
				if (StringUtils.isBlank(remoteParentId)) {
					throw new BpmSynchroDataException("请先同步上级组织！");
				}
				org.setParent(remoteParentId);
			} else {
				String orgId = this.getRootOrgId(IConst.DEFAULT_ROOT_ORG_CODE);
				org.setParent(orgId);
				org.setParentCode(IConst.DEFAULT_ROOT_ORG_CODE);
			}

		} catch (Exception e) {
			log.error(e.getMessage());
			throw new BpmSynchroDataException(e);
		}
		return org;
	}

	@Override
	public String getRootOrgId(String rootOrgCode) throws BpmSynchroDataException {
		try {
			if (StringUtils.isNotEmpty(rootOrgCode)) {
				OrgQueryParam orgQryParam = new OrgQueryParam();
				orgQryParam.setCode(IConst.DEFAULT_ROOT_ORG_CODE);
				orgQryParam.setTenantId(IConst.DEFAULT_ROOT_ORG_CODE);
				Object obj = this.processService.getIdentitySerevice().queryOrgs(orgQryParam);
				if (obj != null) {
					JSONObject jsonObj = JSONObject.fromObject(obj.toString());
					JSONArray array = jsonObj.getJSONArray("data");
					if (array != null && array.size() == 1) {
						JSONObject org = array.getJSONObject(0);
						return org.getString("id");
					} else {
						log.error("默认根组织不存在获取大于1！");
						throw new BpmSynchroDataException("默认根组织不存在获取大于1！");
					}
				} else {
					log.error("云审接口调用获取组织异常！");
					throw new BpmSynchroDataException("云审接口调用获取组织异常！");
				}
			} else {
				log.error("云审同步默认跟组织编码不存在！");
				throw new BpmSynchroDataException("云审同步默认跟组织编码不存在！");
			}
		} catch (RestException e) {
			log.error("查询云审组织，REST服务调用异常：", e);
			throw new BpmSynchroDataException("查询云审组织，REST服务调用异常：", e);
		}
	}

	/**
	 * 获取用户与组织的关联关系
	 * 
	 * @param orgId
	 * @return
	 * @throws RestException
	 */
	private Map<String, String> getOrgUserLinkId(String orgId) throws RestException {
		Map<String, String> results = new HashMap<String, String>();

		UserLinkQueryParam userLinkQueryParam = new UserLinkQueryParam();
		userLinkQueryParam.setOrgId(orgId);
		userLinkQueryParam.setType("deptmgr");
		userLinkQueryParam.setTenantId(CommonUtils.getDefaultBpmTenantId());
		Object obj = this.processService.getIdentitySerevice().queryUserLinks(userLinkQueryParam);
		if (obj != null) {
			JSONObject jsonObj = JSONObject.fromObject(obj.toString());
			JSONArray array = jsonObj.getJSONArray("data");
			if (array != null && array.size() == 1) {
				JSONObject orgUserLink = array.getJSONObject(0);
				results.put("id", orgUserLink.getString("id"));
				results.put("revision", orgUserLink.getString("revision"));
				return results;
			} else {
				log.error("查询组织用户关联关系数据异常，大于1条！");
				throw new BpmSynchroDataException("查询组织用户关联关系数据异常，大于1条！");
			}
		} else {
			log.error("查询组织用户关联关系，调用云审SDK异常！");
			throw new BpmSynchroDataException("查询组织用户关联关系，调用云审SDK异常！");
		}
	}
}
