package com.yonyou.iuap.bpm.service.sso;

public interface IBpmSsoService {

	public boolean validateUserToken(String userId,String token) throws Exception;
}
