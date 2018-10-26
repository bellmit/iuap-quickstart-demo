package com.yonyou.iuap.bpm.approval.service.impl.sso;

import com.yonyou.iuap.bpm.service.sso.IBpmSsoService;

public class BpmSsoServiceImpl implements IBpmSsoService{

	private static final int tokenenabletime = 60;
	@Override
	public boolean validateUserToken(String bpmuserId, String token) throws Exception {
		return false;
	}

}
