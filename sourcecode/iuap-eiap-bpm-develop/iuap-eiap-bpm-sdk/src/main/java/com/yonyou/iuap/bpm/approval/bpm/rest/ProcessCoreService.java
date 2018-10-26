package com.yonyou.iuap.bpm.approval.bpm.rest;

import com.yonyou.iuap.bpm.approval.utils.CommonUtil;
import com.yonyou.iuap.bpm.approval.utils.sign.SignUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;


public class ProcessCoreService {
    private static final Logger log = LoggerFactory.getLogger(ProcessCoreService.class);


	/**
	 * 流程定义发起
	 *
	 * @param queryParams
	 *
	 *           { key=value }  没有查询条件时可以为null
	 *
	 * @param postParams
	 *            ---- POST格式请求参数，格式如下:
	 *
	 *            { data=[xxxx01, xxxx02, xxxx03, xxxx04...] }
	 *
	 * @param prefix
	 *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
	 *
	 * @return  返回操作的执行结果，如果有异常返回null
	 */
	public static String startProcess(Map<String, String> queryParams, Map<String, String> postParams,String prefix) {
		try {
			String url = CommonUtil.getUrl("bpm.process.startProcess.url");
			return SignUtils.singPost(url, queryParams,postParams, prefix);
		} catch (IOException e) {
			log.error("bpm  SDK startProcess 请求路径异常：", e);
		} catch (Exception e) {
			log.error("bpm sdk startProcess 发起异常：", e);
		}
		return null;
	}

	/**
	 * 查询流程发布历史
	 *
	 * @param params
	 *
	 *            { key=value }  没有查询条件时可以为null
	 *
	 * @param prefix
	 *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
	 *
	 * @return   返回操作的执行结果，如果有异常返回null
	 */
	public static String processQueryProcList(Map<String, String> params,String prefix) {
		try {
			String url = CommonUtil.getUrl("bpm.process.queryProcList.url");
			return SignUtils.signGetWithParams(url, params, prefix);
		} catch (IOException e) {
			log.error("bpm  SDK processQueryProcList 请求路径异常：", e);
		} catch (Exception e) {
			log.error("bpm sdk processQueryProcList 查询异常：", e);
		}
		return null;
	}

	/**
	 * 查询流程实例参与者
	 *
	 * @param params
	 *
	 *            { key=value }  没有查询条件时可以为null
	 *
	 * @param prefix
	 *            (非必须，默认为：eiap) ---- 项目工程前缀，比如：应用平台：eiap
	 *
	 * @return   返回操作的执行结果，如果有异常返回null
	 */
	public static String getIdentityLinks(Map<String, String> params,String prefix) {
		try {
			String url = CommonUtil.getUrl("bpm.process.identityLinks.url");
			return SignUtils.signGetWithParams(url, params, prefix);
		} catch (IOException e) {
			log.error("bpm  SDK processQueryProcList 请求路径异常：", e);
		} catch (Exception e) {
			log.error("bpm sdk processQueryProcList 查询异常：", e);
		}
		return null;
	}
}
