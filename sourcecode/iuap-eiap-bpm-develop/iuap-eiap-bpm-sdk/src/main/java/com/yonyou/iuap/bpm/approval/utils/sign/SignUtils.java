package com.yonyou.iuap.bpm.approval.utils.sign;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.LoggerFactory;

import com.yonyou.iuap.bpm.approval.utils.CommonUtil;
import com.yonyou.iuap.bpm.approval.utils.IConstant;
import com.yonyou.iuap.generic.sign.SignEntity;
import com.yonyou.iuap.generic.sign.SignMake;
import com.yonyou.iuap.generic.utils.HttpTookit;
import com.yonyou.iuap.generic.utils.RestAPIUtils;

public class SignUtils {

	/**
	 * 加签方式处理带有参数的GET请求
	 * 
	 * @param url
	 *            ----> 请求地址
	 * @param params
	 *            ----> GET请求参数，MAP键值对
	 * @param prefix
	 *            ----> 工程前缀
	 * 
	 * @param
	 * @return
	 */
	public static String signGetWithParams(String url, Map<String, String> params, String prefix) {
		url = CommonUtil.buildGetParamsToUrl(url, params);
		SignEntity signEntity = SignMake.signEntity(url, null, SignMake.SIGNGET, processPrefix(prefix),
				getCredentialPath());
		return HttpTookit.doGet(RestAPIUtils.encode(signEntity.getSignURL(), IConstant.DEFAULT_CHARSET), null,
				processHeaders(signEntity));
	}

	/**
	 * 加签方式处理POST请求
	 * 
	 * @param url
	 * @param queryParams
	 * @param postParams
	 * @param prefix
	 * @param authFilePath
	 * @return
	 */
	public static String singPost(String url, Map<String, String> queryParams, Map<String, String> postParams,
			String prefix) {
		url = CommonUtil.buildGetParamsToUrl(url, queryParams);
		SignEntity signEntity = SignMake.signEntity(url, postParams, SignMake.SIGNPOST, processPrefix(prefix),
				getCredentialPath());
		return HttpTookit.doPost(RestAPIUtils.encode(signEntity.getSignURL(), IConstant.DEFAULT_CHARSET), postParams,
				processHeaders(signEntity));
	}

	/**
	 * 处理请求头
	 * 
	 * @param signEntity
	 * @return
	 */
	private static Map<String, String> processHeaders(SignEntity signEntity) {
		Map<String, String> results = new LinkedHashMap<String, String>();
		results.put("sign", signEntity.getSign());

		return results;
	}

	/**
	 * 处理工程前缀
	 * 
	 * @param prefix
	 * @return
	 */
	private static String processPrefix(String prefix) {
		if (StringUtils.isNotEmpty(prefix)) {
			return prefix;
		}
		return "eiap";
	}

	/**
	 * 获取加签文件的路径
	 * 
	 * @return
	 * @throws IOException
	 */
	private static String getCredentialPath() {
		try {
			String authFilePath = CommonUtil.getCredentialPath();
			if (StringUtils.isNotEmpty(authFilePath)) {
				return authFilePath;
			}
		} catch (IOException e) {
			LoggerFactory.getLogger(SignUtils.class).error("加载加签配置文件异常：", e);
		}
		return null;
	}
}
