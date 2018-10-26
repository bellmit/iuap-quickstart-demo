package com.yonyou.iuap.bpm.service.adapter;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;

/**
 * 对接云审目录服务接口适配器
 * 
 * @author zhh
 *
 */
public interface IEiapBpmCategoryService {

	/**
	 * 根据租住ID获取目录信息
	 * 
	 * @param tenantId
	 * @return
	 * @throws BpmException
	 */
	public JSONObject getCategroyByTenantId(String tenantId) throws BpmException;

}
