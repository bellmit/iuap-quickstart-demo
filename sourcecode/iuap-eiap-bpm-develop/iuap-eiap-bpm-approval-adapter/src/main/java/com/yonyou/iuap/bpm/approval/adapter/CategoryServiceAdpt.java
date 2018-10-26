package com.yonyou.iuap.bpm.approval.adapter;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmCategoryService;

import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.category.CategoryQueryParam;

/**
 * 流程分类基本信息
 * 
 * @author zhh
 *
 */
@Service
public class CategoryServiceAdpt implements IEiapBpmCategoryService {

	private static final Logger log = LoggerFactory.getLogger(CategoryServiceAdpt.class);

	@Autowired
	private ProcessService processService;

	@Override
	public JSONObject getCategroyByTenantId(String tenantId) throws BpmException {
		try {
			Object obj = this.processService.getCategoryService().getCategories(this.buildCategoryQueryParam(tenantId));

			JSONObject results = (JSONObject) obj;
			if (!results.isEmpty()) {
				return results;
			}
		} catch (RestException e) {
			log.error("查询目录SDK异常：", e);
			throw new BpmException("查询目录SDK异常：", e);
		}
		return null;
	}

	/**
	 * 构造查询目录的参数，使用tenantId查询
	 * 
	 * @param tenantId
	 * @return
	 */
	private CategoryQueryParam buildCategoryQueryParam(String tenantId) {
		CategoryQueryParam results = new CategoryQueryParam();

		Map<String, String> searchParam = new HashMap<String, String>();
		searchParam.put("tenantId", CommonUtils.getDefaultBpmTenantId());

		results.setOthers(searchParam);

		return results;
	}

}
