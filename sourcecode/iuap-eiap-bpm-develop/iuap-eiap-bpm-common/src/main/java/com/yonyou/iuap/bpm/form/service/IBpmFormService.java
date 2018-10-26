package com.yonyou.iuap.bpm.form.service;

import com.yonyou.iuap.bpm.common.base.utils.BpmException;

import yonyou.bpm.rest.exception.RestException;

public interface IBpmFormService {
	
	/**
	 * 这些参数非必输，可以根据情况来确定
	 * @param processDefinitionId
	 * @param moduleid
	 * @param formId
	 * @throws RestException
	 */
	public Object queryForms(String processKey, String moduleId, String formId)throws BpmException;


}
