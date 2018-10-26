package com.yonyou.iuap.bpm.approval.adapter;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmFormService;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;

import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.form.FormFieldResourceParam;
import yonyou.bpm.rest.request.form.FormResourceParam;

/**
 * 云审集成适配表单服务接口实现
 * 
 * @author zhh
 *
 */
@Service
public class FormServiceAdpt implements IEiapBpmFormService {

	private static final Logger log = LoggerFactory.getLogger(FormServiceAdpt.class);

	@Autowired
	private IProcessService processService;

	@Override
	public JSONObject saveForm(BpmProcInfo info, BuziEntityVO form) throws BpmException {
		try {
			Object obj = this.processService.getFormService().saveForm(this.buildFormResourceParam(info, form));

			JSONObject jsonObj = JSON.parseObject(obj.toString());
			if (jsonObj != null) {
				String formId = jsonObj.getString("id");

				List<BuziEntityFieldVO> fieldList = form.getFields();
				if (CollectionUtils.isNotEmpty(fieldList)) {
					for (BuziEntityFieldVO i : fieldList) {
						this.saveFormField(info, i, formId);
					}
				}
				return jsonObj;
			} else {
				log.error("表单数据同步，SDK返回值异常！");
				throw new BpmException("表单数据同步，SDK返回值异常！");
			}
		} catch (RestException e) {
			log.error("表单数据同步，SDK异常！", e);
			throw new BpmException("表单数据同步，SDK异常！", e);
		}
	}

	@Override
	public JSONObject saveFormField(BpmProcInfo info, BuziEntityFieldVO fieldVo, String formId) throws BpmException {
		try {
			if (StringUtils.isNotEmpty(formId)) {
				FormFieldResourceParam fieldParam = this.buildFormFieldResourceParam(info, fieldVo, formId);
				if (fieldParam != null) {
					Object obj = this.processService.getFormService().saveFormField(fieldParam);
					JSONObject jsonObj = JSON.parseObject(obj.toString());
					if (jsonObj != null) {
						return jsonObj;
					} else {
						log.error("表单子表同步数据，SDK返回值异常！");
						throw new BpmException("表单子表同步数据，SDK返回值异常！");
					}
				}
				return null;
			} else {
				log.error("表单数据同步，同步表单异常，未返回表单ID！");
				throw new BpmException("表单数据同步，同步表单异常，未返回表单ID！");
			}
		} catch (RestException e) {
			log.error("表单子表同步数据，SDK异常：", e);
			throw new BpmException("表单子表同步数据，SDK异常：", e);
		}
	}

	/**
	 * 构造表单参数
	 * 
	 * @param info
	 * @param form
	 * @return
	 * @throws BpmException
	 */
	private FormResourceParam buildFormResourceParam(BpmProcInfo info, BuziEntityVO form) throws BpmException {

		if (StringUtils.isNotEmpty(info.getProcModelId())) {
			FormResourceParam results = new FormResourceParam();

			// 基础信息
			results.setCategory(CommonUtils.getDefaultBpmCategoryId());
			results.setModelId(info.getProcModelId());
			results.setProcessKey(info.getProcKey());

			// 表单信息
			results.setTitle(form.getFormname());
			results.setCode(form.getFormcode());

			return results;
		} else {
			log.error("表单数据同步，流程定义模型基本信息数据不正确！");
			throw new BpmException("表单数据同步，流程定义模型基本信息数据不正确！");
		}
	}

	/**
	 * 构造表单字段参数
	 * 
	 * @param info
	 * @param fieldVo
	 * @param formId
	 * @return
	 */
	private FormFieldResourceParam buildFormFieldResourceParam(BpmProcInfo info, BuziEntityFieldVO fieldVo,
			String formId) {
		if (StringUtils.isNotEmpty(fieldVo.getFieldname()) || StringUtils.isNotEmpty(fieldVo.getFieldcode())) {
			FormFieldResourceParam results = new FormFieldResourceParam();

			// 表单ID
			results.setFormId(formId);

			// 基础信息
			results.setModelId(info.getProcModelId());

			// 字段信息
			results.setName(fieldVo.getFieldname());
			results.setCode(fieldVo.getFieldcode());
			if ("select".equalsIgnoreCase(fieldVo.getFieldtype())) {
				results.setTypeName(fieldVo.getFieldtype());
			}
			if ("ref".equalsIgnoreCase(fieldVo.getFieldtype())) {
				results.setTypeName(fieldVo.getFieldtype());
			}
			results.setTypeName(fieldVo.getFieldtype());

			return results;
		}
		return null;
	}

}
