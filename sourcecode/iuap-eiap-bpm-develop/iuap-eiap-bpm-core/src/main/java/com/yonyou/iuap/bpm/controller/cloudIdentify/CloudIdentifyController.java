package com.yonyou.iuap.bpm.controller.cloudIdentify;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 用于表示当前使用的审批流使用的是私有版本还是公用版本
 * 
 * @author tangkunb
 *
 */

@Controller
@RequestMapping(value = "/cloudIndentify")
public class CloudIdentifyController {
	
	private static final Logger log = LoggerFactory.getLogger(CloudIdentifyController.class);
	
	@Value("${cloud.cloudIndentify}")
	private String cloudIndentify;
	
	
	@ResponseBody
	@RequestMapping(value = "/cloudFlag", method = RequestMethod.GET)
	public  Object  getCloudIdentify(HttpServletRequest request, HttpServletResponse response) {
		Map<String, String>  results=new HashMap<String, String>();
		results.put("cloudIndentify", cloudIndentify);
		return  results;
	}
}
