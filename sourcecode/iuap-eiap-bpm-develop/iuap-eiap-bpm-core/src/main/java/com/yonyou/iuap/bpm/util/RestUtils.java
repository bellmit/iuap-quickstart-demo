package com.yonyou.iuap.bpm.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.utils.PropertyUtil;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.slf4j.MDC;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.ContextLoader;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class RestUtils {
	
	
	protected Log logger = LogFactory.getLog(getClass());
	
	private static RestUtils restUtils = null;
	
	private long slowUriMillis = 500;
	{
		String s_slowUriMillis = PropertyUtil.getPropertyByKey("slowUriMillis");
		if(s_slowUriMillis != null && !s_slowUriMillis.equals("")) {
			slowUriMillis = Long.parseLong(s_slowUriMillis);
		}
	}
	
	public static RestUtils getInstance(){
		if (restUtils == null) {
			restUtils = new RestUtils();
		}
		return restUtils;
	}

	private RestUtils() {
		init();
	}
	
	private RestTemplate template;
	
	private void init() {
		ApplicationContext ac = getAc();

		template = (RestTemplate) ac.getBean("restTemplate");
	}
	
	private ApplicationContext getAc() {
		return ContextLoader.getCurrentWebApplicationContext();
	}
	
	public <T> T doGet(String url, Object request, Class<T> responseType){
		return doExe(url, request, responseType, HttpMethod.GET);
	}
	
	public <T> T doPost(String url, Object request, Class<T> responseType){
		return doExe(url, request, responseType, HttpMethod.POST);
	}
	
	public <T> T doDelete(String url, Object request, Class<T> responseType){
		return doExe(url, request, responseType, HttpMethod.DELETE);
	}
	
	private <T> T doExe(String url, Object request, Class<T> responseType, HttpMethod method){
		ResponseEntity<T> rss = doService(url, request, responseType, method);
		return rss.getBody();
	}
	
	public <T> ResponseEntity<T> doService(String url, Object request, Class<T> responseType, HttpMethod method){
		HttpHeaders requestHeaders = new HttpHeaders();
		String cvalue = invocationToStr();
//		MediaType type = MediaType.parseMediaType("application/json; charset=UTF-8");
//		requestHeaders.setContentType(type);
		requestHeaders.add("Authority", cvalue);
		requestHeaders.add("X-Requested-With", "XMLHttpRequest");
		requestHeaders.add("custmer", "jvm-http-client");
		HttpEntity<Object> requestEntity = new HttpEntity<Object>(request, requestHeaders);
//		Map<String, ?> urlVariables = null;
		JSONObject jsonObj = new JSONObject();
		if(method.equals(HttpMethod.GET)){
			if(request != null){
				String json = JSON.toJSONString(request);
				jsonObj = JSON.parseObject(json);
			}
//			if(request instanceof Map){
//				urlVariables = (Map<String, ?>)request;
//			}
		}
//		if(urlVariables == null){
//			urlVariables = new HashMap<String, Object>();
//		}
		long beforeTs = System.currentTimeMillis();
		String callid = InvocationInfoProxy.getCallid();
		String lasturl = url;
		if(lasturl.indexOf("?") == -1) {
			lasturl += "?callid=" + callid;
		}else {
			lasturl += "&callid=" + callid;
		}
		
		ResponseEntity<T> rss = template.exchange(lasturl, method, requestEntity, responseType, jsonObj);
		
		long afterTs = System.currentTimeMillis();
		long ts = afterTs - beforeTs;

		if(ts > slowUriMillis) {
			logger.warn("callid:"+ callid + ",url请求总耗时:" + ts + ",URL:" + lasturl);
			logger.info("callid:"+ callid + ",URL:" + lasturl + "\n request:" + (request == null ? "" : request.toString()));
			logger.info("callid:"+ callid + ",URL:" + lasturl + "\n reponse:" + rss.toString());
		}else {
			logger.debug("callid:"+ callid + ",url请求总耗时:" + ts + ",URL:" + lasturl);
			logger.debug("callid:"+ callid + ",URL:" + lasturl + "\n request:" + (request == null ? "" : request.toString()));
			logger.debug("callid:"+ callid + ",URL:" + lasturl + "\n reponse:" + rss.toString());
		}
		
		return rss;
	}
	

	private String invocationToStr() {
		String cvalue = "";
		Map<String, String> data = setInvocationInfo();
		if (MapUtils.isNotEmpty(data)) {
			Iterator<Map.Entry<String, String>> iterator = data.entrySet().iterator();
			while (iterator.hasNext()) {
					Map.Entry<String, String> entry = (Map.Entry<String, String>)iterator.next();
					if(entry.getValue() != null && StringUtils.isNotEmpty(entry.getValue())){
						cvalue = cvalue + (String)entry.getKey() + "=" + (String)entry.getValue() + ";";
					}
				}
			}
		return cvalue;
	}
	
	private Map<String, String> setInvocationInfo() {
		Map<String, String> map = new HashMap<String, String>();
		if (InvocationInfoProxy.getCallid() != null) {
			map.put("u_callid", InvocationInfoProxy.getCallid());
		}
		if (InvocationInfoProxy.getLocale() != null) {
			map.put("u_locale", InvocationInfoProxy.getLocale());
		}
		if (InvocationInfoProxy.getSysid() != null) {
			map.put("u_sysid", InvocationInfoProxy.getSysid());
		}
		if (InvocationInfoProxy.getTenantid() != null) {
			map.put("tenantid", InvocationInfoProxy.getTenantid());
			map.put("current_tenant_id", InvocationInfoProxy.getTenantid());
		}
		if (InvocationInfoProxy.getTheme() != null) {
			map.put("u_theme", InvocationInfoProxy.getTheme());
		}
		if (InvocationInfoProxy.getTimeZone() != null) {
			map.put("u_timezone", InvocationInfoProxy.getTimeZone());
		}
		if (InvocationInfoProxy.getUserid() != null) {
			map.put("u_usercode", InvocationInfoProxy.getUserid());
			map.put("current_user_name", InvocationInfoProxy.getUserid());
		}
		if (InvocationInfoProxy.getUsername() != null) {
			map.put("u_username", InvocationInfoProxy.getUsername());
		}
		if (InvocationInfoProxy.getAppCode() != null) {
			map.put("u_appCode", InvocationInfoProxy.getAppCode());
		}
		if (InvocationInfoProxy.getProviderCode() != null) {
			map.put("u_providerCode", InvocationInfoProxy.getProviderCode());
		}
		if (InvocationInfoProxy.getToken() != null) {
			map.put("token", InvocationInfoProxy.getToken());
		}
		if (InvocationInfoProxy.getLogints() != null) {
			map.put("u_logints", InvocationInfoProxy.getLogints());
		}
		if (InvocationInfoProxy.getParamters() != null) {
			map.putAll(InvocationInfoProxy.getParamters());
		}
		map.put("call_thread_id", String.valueOf(MDC.get("call_thread_id")));
		return map;
	}

	
	  public static String createParam(String url ,Map<String, Object> map){
	        
	        url=url+"?";
	        for(String key:map.keySet()){
	        	if(map.get(key)!=null){
	        		url=url+key+"="+map.get(key)+"&";
	        	}
	          
	        }
	        return url.substring(0,url.length()-1);
	    }

}
