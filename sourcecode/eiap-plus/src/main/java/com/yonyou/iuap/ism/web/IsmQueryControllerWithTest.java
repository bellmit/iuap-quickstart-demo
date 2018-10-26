package com.yonyou.iuap.ism.web;

import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/ism/userRestWithTest")

public class IsmQueryControllerWithTest extends IsmQueryController {

	@Override
	@RequestMapping(value = "/queryUserInfoVos", method = RequestMethod.GET)
	public Map<String, Object> queryUserInfoVos(String userId) {
		return super.queryUserInfoVos(userId);
	}


}