package com.yonyou.iuap.bpm.service;

import java.util.List;

public interface IdentityService {

    public String queryUserName(String userId);
	
	public String queryUserCode(String userId);
	
	public Object queryAllUsers(String tenantId);

	public Object queryUsers(String tenantid, List<String> ids);
	
}
