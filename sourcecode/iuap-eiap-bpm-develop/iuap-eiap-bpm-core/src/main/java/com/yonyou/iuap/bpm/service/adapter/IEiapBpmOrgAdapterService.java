package com.yonyou.iuap.bpm.service.adapter;

import com.yonyou.iuap.bpm.common.base.utils.BpmSynchroDataException;

import yonyou.bpm.rest.request.identity.OrgResourceParam;

public interface IEiapBpmOrgAdapterService {

	public void saveOrg(Object org) throws BpmSynchroDataException;

	public void deleteOrg(Object obj) throws BpmSynchroDataException;

	public OrgResourceParam paseToOrgResourceParam(Object obj) throws BpmSynchroDataException;

	/**
	 * 获取根组织
	 * 
	 * @param orgCode
	 * @return
	 * @throws BpmSynchroDataException
	 */
	public String getRootOrgId(String orgCode) throws BpmSynchroDataException;
}
