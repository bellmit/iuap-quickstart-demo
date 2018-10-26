package com.yonyou.iuap.ism.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.ism.dao.UserInfoDao;
import com.yonyou.iuap.ism.entity.Page;
import com.yonyou.iuap.ism.entity.UserInfoVo;
import com.yonyou.iuap.ism.entity.UserInfoVo4Dealer;

@Service
public class UserInfoService {
	
	@Autowired
	private UserInfoDao dao;

	public List<UserInfoVo> queryUserInfoVosByRole() {
		return dao.queryUserInfoVosByRole();
	}
	
	public UserInfoVo4Dealer queryUserInfoVos(String userId) {
		return dao.queryUserInfoVos(userId);
	}
	
	public Page queryPageUserInfoVosByRole(String roleCode,int pageIndex,int pageSize) {
		return dao.queryPageUserInfoVosByRole(roleCode,pageIndex, pageSize);
	}

	

}



