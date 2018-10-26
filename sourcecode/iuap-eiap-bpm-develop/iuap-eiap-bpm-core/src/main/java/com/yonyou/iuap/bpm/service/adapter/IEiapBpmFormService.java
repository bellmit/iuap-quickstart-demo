package com.yonyou.iuap.bpm.service.adapter;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.bpm.common.base.utils.BpmException;
import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;

/**
 * 流程表单服务接口
 * 
 * @author zhh
 *
 */
public interface IEiapBpmFormService {

	/**
	 * 保存表单数据
	 * 
	 * @param info
	 * @param form
	 * @return
	 * @throws BpmException
	 */
	public JSONObject saveForm(BpmProcInfo info, BuziEntityVO form) throws BpmException;

	/**
	 * 表单子表（字段）数据保存
	 * 
	 * @param info
	 * @param vo
	 * @param formId
	 * @return
	 * @throws BpmException
	 */
	public JSONObject saveFormField(BpmProcInfo info, BuziEntityFieldVO vo, String formId) throws BpmException;

}
