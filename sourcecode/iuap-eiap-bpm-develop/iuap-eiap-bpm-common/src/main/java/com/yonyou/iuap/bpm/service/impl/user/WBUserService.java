package com.yonyou.iuap.bpm.service.impl.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.dao.user.WBUserMapper;
import com.yonyou.iuap.bpm.entity.user.WBUser;
import com.yonyou.iuap.bpm.service.user.IWBUserService;


@Service("wbUserService")
public class WBUserService implements IWBUserService {

	@Autowired
	private  WBUserMapper  wBUserMapper;
	
	@Override
	public WBUser queryUser(String id) {
		return wBUserMapper.queryUser(id);
	}

}
