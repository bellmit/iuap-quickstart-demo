package com.yonyou.iuap.bpm.approval.utils;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.context.InvocationInfoProxy;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.util.EntityUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.utils.HttpContextUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST请求工具类
 * 
 * @project workbench-sdk
 * @company yonyou
 * @version 1.0
 * @author zhanghui12
 * @date 2016年8月26日
 */
public class RestRequestUtil {

	private static final Logger logger = LoggerFactory.getLogger(RestRequestUtil.class);

	/**
	 * 执行GET请求
	 * 
	 * @param url
	 * @param queryParams
	 * @return
	 * @throws Exception
	 */
	public static JSONObject doGetRequest(String url, Map<String, String> queryParams) throws Exception {
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("X-Requested-With","XMLHttpRequest");
		HttpContextUtil httpContextUtil = getHttpContextUtilInstance();
		HttpResponse response = httpContextUtil.doGetWithContext(url, queryParams, headers);
		return processHttpResponse(response);
	}

	/**
	 * 执行POST请求 
	 * 
	 * @param url
	 * @param queryParams
	 * @param formParams
	 * @return
	 * @throws Exception
	 */
	public static JSONObject doPostRequest(String url, Map<String, String> queryParams, Map<String, String> formParams)
			throws Exception {
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("X-Requested-With","XMLHttpRequest");
		HttpContextUtil httpContextUtil = getHttpContextUtilInstance();
		HttpResponse response = httpContextUtil.doPostWithContext(url, queryParams, formParams, headers);
		return processHttpResponse(response);
	}

	/**
	 * 处理request，获取Header信息，以Map形式返回
	 * 
	 * @param request
	 * @return
	 */
	public static Map<String, String> processRequestHeader(HttpServletRequest request) {
		Map<String, String> results = new HashMap<String, String>();

		Enumeration<String> enumeration = request.getHeaderNames();
		while (enumeration.hasMoreElements()) {
			String key = (String) enumeration.nextElement();
			results.put(key, request.getHeader(key));
		}
		return results;
	}

	/**
	 * 处理HttpResponse，将返回结果中的内容取出，以String形式返回
	 * 
	 * @param response
	 * @return
	 * @throws ParseException
	 * @throws IOException
	 */
	public static JSONObject processHttpResponse(HttpResponse response) throws ParseException, IOException, BpmException {
		JSONObject results = null;

		HttpEntity httpEntity = response.getEntity();
		if (httpEntity != null) {
			String str = EntityUtils.toString(httpEntity, IConstant.DEFAULT_CHARSET);
			results = JSON.parseObject(str);
		}
		EntityUtils.consume(httpEntity);
		int status = response.getStatusLine().getStatusCode();
		if(status ==200 ){
			return results;
		}else if(status ==306){
			logger.error(results.toString()+" 当前登录用户："+ InvocationInfoProxy.getUserid()+" 当前token："+ InvocationInfoProxy.getToken());
			throw new BpmException("未知状态码：["+status+"],错误原因："+results.getString("msg"));
		}else if(status ==401){
			logger.error("接口返回数据："+results.toString()+" 当前登录用户："+ InvocationInfoProxy.getUserid()+" 当前token："+ InvocationInfoProxy.getToken());
			throw new BpmException(results.getString("msg"));
		}else{
			String errorReason = response.getStatusLine().getReasonPhrase();
			throw new BpmException("错误状态码：["+status+"],错误原因："+errorReason);
		}
	}

	/**
	 * 实例化 HttpContextUtil
	 * 
	 * @return
	 */
	public static HttpContextUtil getHttpContextUtilInstance() {
		return HttpContextUtil.getInstance();
	}

}
