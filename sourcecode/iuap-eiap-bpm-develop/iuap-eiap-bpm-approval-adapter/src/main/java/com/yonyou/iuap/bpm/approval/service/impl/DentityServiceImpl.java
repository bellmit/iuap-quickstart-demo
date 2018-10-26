package com.yonyou.iuap.bpm.approval.service.impl;

import java.util.List;

import com.yonyou.iuap.bpm.service.IdentityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.approval.adapter.ProcessService;
import com.yonyou.iuap.bpm.service.user.IWBUserService;

import yonyou.bpm.rest.exception.RestException;

@Service
public class DentityServiceImpl implements IdentityService{

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProcessService processService;
	
	@Autowired
	private IWBUserService wbUserService;
	
	@Value("${cloud.cloudIndentify}")
	private String  cloudIndentify;
	
	@Override
	public String queryUserName(String userId) {
		try {
			Object obj=null;
			//判断当前使用的的是私有版本还是共有版本  cloudIndentify 为true 表示私有版本，false 表示共有版本
			if (Boolean.valueOf(cloudIndentify)) {
				obj =wbUserService.queryUser(userId);
			}else {
				obj = processService.getIdentitySerevice().getUser(userId);
			}
			if(obj!=null&&obj instanceof ObjectNode){
				return ((ObjectNode)obj).get("name").asText();
			}
			return obj==null?null:obj.toString();
		} catch (RestException e) {
			logger.error(e.getMessage(),e);
			return "查询出错!";
		}
	}

	@Override
	public String queryUserCode(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object queryAllUsers(String tenantId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object queryUsers(String tenantid, List<String> ids) {
		// TODO Auto-generated method stub
		return null;
	}

}
