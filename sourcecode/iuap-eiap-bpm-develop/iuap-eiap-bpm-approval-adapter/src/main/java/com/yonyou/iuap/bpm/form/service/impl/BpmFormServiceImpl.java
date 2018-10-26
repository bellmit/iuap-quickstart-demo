package com.yonyou.iuap.bpm.form.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yonyou.iuap.bpm.approval.adapter.ProcessService;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.form.service.IBpmFormService;

import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.request.form.FormQueryParam;

@Service
public class BpmFormServiceImpl implements IBpmFormService{

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ProcessService processService;
	
	@Override
	public Object queryForms(String processKey, String moduleId, String formId) throws BpmException {
		
		FormQueryParam formQueryParam = new FormQueryParam();
		if(processKey != null){
			formQueryParam.setProcessKey(processKey);
		}
		if(moduleId != null){
			formQueryParam.setModelId(moduleId);
		}
		if(formId != null){
			formQueryParam.setFormId(formId);
		}
		
		try {
			return processService.getFormService().queryForms(formQueryParam);
		} catch (RestException e) {
			logger.error(e.getMessage(), e);
			throw new BpmException(e.getMessage(), e);
		}
	}

}
