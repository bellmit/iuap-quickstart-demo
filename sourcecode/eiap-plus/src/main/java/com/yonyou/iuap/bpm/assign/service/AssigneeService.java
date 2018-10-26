package com.yonyou.iuap.bpm.assign.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import yonyou.bpm.rest.response.identity.UserResponse;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.uap.wb.entity.management.WBUser;
import com.yonyou.uap.wb.sdk.UserRest;

@Service
public class AssigneeService implements IAssigneeService {
	
	private Logger logger = LoggerFactory.getLogger(AssigneeService.class);
	
	public List<UserResponse> findAll() {
		Map<String, String> queryParams = new HashMap<String, String>();
		return getUserResponseByQueryParams(queryParams);
	}
	
	/**
	 * 增加人员模糊查询方法  bpm使用
	 */
	public List<UserResponse> getUserByNameOrCodeLike(String name){
		Map<String, String> queryParams = new HashMap<String, String>();
		if(name!=null && !name.trim().isEmpty()){
			queryParams.put("search_loginName",  name.trim());
			queryParams.put("search_name", name.trim());
		}
		
		return getUserResponseByQueryParams(queryParams);
	}
	
	
	private List<UserResponse> getUserResponseByQueryParams(Map<String, String> queryParams){
		queryParams.put("tenantId", InvocationInfoProxy.getTenantid());
		JSONObject jsonObject = UserRest.pagingList(queryParams);
		
		List<UserResponse> arrayNode= new ArrayList<UserResponse>(0);
		JSONObject userPage = jsonObject.getJSONObject("data");
		JSONArray ls = userPage.getJSONArray("content");
		for (int i = 0; i< ls.size();i++) {
			WBUser user = ls.getObject(i, WBUser.class);
			UserResponse userRes = new UserResponse(); 
			userRes.setId(user.getId());
			userRes.setCode(user.getLoginName());
			userRes.setName(user.getName());
			arrayNode.add(userRes);	
		}
		
        return arrayNode;
	}

	public  JSONObject getUsers(Map<String, String> queryParams){
		queryParams.put("tenantId", InvocationInfoProxy.getTenantid());
		String name =queryParams.get("name");
		if(name!=null && !name.trim().isEmpty()){
			queryParams.put("search_loginName",  name.trim());
			queryParams.put("search_name", name.trim());
		}
		JSONObject jsonObject = UserRest.pagingList(queryParams);
		///////////////////////////////////////////////////
		List<UserResponse> arrayNode= new ArrayList<UserResponse>(0);
		JSONObject userPage = jsonObject.getJSONObject("data");
		JSONArray ls = userPage.getJSONArray("content");
		for (int i = 0; i< ls.size();i++) {
			WBUser user = ls.getObject(i, WBUser.class);
			UserResponse userRes = new UserResponse();
			userRes.setId(user.getId());
			userRes.setCode(user.getLoginName());
			userRes.setName(user.getName());
			arrayNode.add(userRes);
		}

		JSONArray jsonArray = JSONArray.parseArray(JSON.toJSONString(arrayNode));
		jsonObject.getJSONObject("data").put("content",jsonArray);
		return jsonObject;
	}
}

