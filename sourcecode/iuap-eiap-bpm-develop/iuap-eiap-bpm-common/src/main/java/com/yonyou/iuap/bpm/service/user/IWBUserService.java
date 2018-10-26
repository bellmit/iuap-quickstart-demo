package com.yonyou.iuap.bpm.service.user;

import com.yonyou.iuap.bpm.entity.user.WBUser;

public interface IWBUserService {
	
	/**
	 * 根据受托人id 查询该受托人
	 * @param id
	 * @return
	 */
	public  WBUser  queryUser(String  id);

}
