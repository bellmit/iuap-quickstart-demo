package com.yonyou.iuap.bpm.service.adapter;

import yonyou.bpm.rest.request.identity.UserResourceParam;

/**
 * 
 * @ClassName: IEiapBpmUserAdapterService
 * @Description: 用户同步
 * @author qianmz
 * @date 2016年12月22日 上午9:51:34
 */
public interface IEiapBpmUserAdapterService {

	public void saveUser(Object user) throws Exception;

	public void deleteUser(String userId) throws Exception;

	public UserResourceParam parseToUserResourceParam(Object obj, UserResourceParam userParam) throws Exception;
}
