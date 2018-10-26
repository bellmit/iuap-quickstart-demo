package com.yonyou.iuap.bpm.approval.utils;

import java.io.IOException;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

/**
 * workbench-sdk 通用工具类
 * 
 * @project workbench-sdk
 * @company yonyou
 * @version 1.0
 * @author zhanghui12
 * @date 2016年8月27日
 */
public class CommonUtil {

	/**
	 * 获取基础URL
	 * 
	 * @return
	 * @throws IOException
	 */
	public static String getBaseUrl() throws IOException {
		return PropertiesUtil.getCustomerProperty("bpmrest.base.url");
	}

	/**
	 * 获取默认加签文件位置
	 * 
	 * @return
	 * @throws IOException
	 */
	public static String getCredentialPath() throws IOException {
		return PropertiesUtil.getCustomerProperty("bpmrest.client.credential.path");
	}

	/**
	 * 获取指定的URL
	 * 
	 * @param propertyKey
	 * @return
	 * @throws IOException
	 */
	public static String getSpecificUrl(String propertyKey) throws IOException {
		return PropertiesUtil.getLocalProperty(propertyKey);
	}

	/**
	 * 统一获取请求URL
	 * 
	 * @param propertyKey
	 * @return
	 * @throws IOException
	 */
	public static String getUrl(String propertyKey) throws IOException {
		return getBaseUrl().concat(getSpecificUrl(propertyKey));
	}

	/**
	 * GET请求时，将传入参数拼接到URL上
	 * 
	 * @param url
	 * @param params
	 * @return
	 */
	public static String buildGetParamsToUrl(String url, Map<String, String> params) {
		StringBuffer sb = new StringBuffer(url);

		if (MapUtils.isNotEmpty(params)) {
			sb.append("?");

			for (Map.Entry<String, String> item : params.entrySet()) {
				String val = StringUtils.isEmpty(item.getValue()) ? "_" : item.getValue();
				sb.append("&").append(item.getKey()).append("=").append(val);
			}
		}
		return sb.toString().replaceFirst("&", "");
	}

}
