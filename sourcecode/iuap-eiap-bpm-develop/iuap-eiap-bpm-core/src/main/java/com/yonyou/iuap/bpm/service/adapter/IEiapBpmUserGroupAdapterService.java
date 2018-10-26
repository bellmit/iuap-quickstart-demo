package com.yonyou.iuap.bpm.service.adapter;

import com.yonyou.iuap.bpm.common.base.utils.BpmSynchroDataException;

import yonyou.bpm.rest.request.identity.UserGroupResourceParam;

public interface IEiapBpmUserGroupAdapterService {

	public void saveUserGroup(Object userGroup) throws BpmSynchroDataException;

	public void deleteUserGroup(String userGroupId) throws BpmSynchroDataException;

	public UserGroupResourceParam paseToUserGroupResourceParam(Object obj) throws BpmSynchroDataException;
}
