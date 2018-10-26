package com.yonyou.iuap.bpm.service.adapter;

import com.yonyou.iuap.bpm.common.base.utils.BpmSynchroDataException;

import yonyou.bpm.rest.request.identity.UserLinkResourceParam;

/**
 * 
 * @ClassName: IEiapBpmUserLinkService
 * @Description: 用户和角色关联
 * @author qianmz
 * @date 2016年12月22日 上午9:51:34
 */
public interface IEiapBpmUserLinkAdapterService {

	public void saveUserLinks(Object userRole) throws BpmSynchroDataException;

	public void deleteUserLink(Object userRole) throws BpmSynchroDataException;

	public UserLinkResourceParam paseToUserLinkParam(Object obj, UserLinkResourceParam userParam)
			throws BpmSynchroDataException;
}
