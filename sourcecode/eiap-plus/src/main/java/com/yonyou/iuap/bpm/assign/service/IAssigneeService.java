package com.yonyou.iuap.bpm.assign.service;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import yonyou.bpm.rest.response.identity.UserResponse;

public interface IAssigneeService {
	public  List<UserResponse> findAll() ;
	public  List<UserResponse> getUserByNameOrCodeLike(String nameOrCode);
	public JSONObject getUsers(Map<String, String> queryParams);
}
