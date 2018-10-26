package com.yonyou.iuap.bpm.controller.msgcfg;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.common.base.utils.JSONResponse;
import com.yonyou.iuap.bpm.common.msgcfg.IConstant;
import com.yonyou.iuap.bpm.entity.msgcfg.ConditionTypeVO;
import com.yonyou.iuap.bpm.service.msgcfg.IConditionTypeService;

@Controller
@RequestMapping("/conditionType")
public class ConditionTypeController {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private IConditionTypeService conditionTypeService;

	@ResponseBody
	@RequestMapping(value = "/getByCode", method = RequestMethod.GET)
	public JSONResponse getEventType(HttpServletRequest request, HttpServletResponse response) {
		JSONResponse results = new JSONResponse();
		String conditionTypeCode = request.getParameter("conditionTypeCode");
		if (StringUtils.isBlank(conditionTypeCode)) {
			results.failed("请传入该必须参数");
			return results;
		}
		ConditionTypeVO vos = null;
		try {
			vos = conditionTypeService.selectOperatorByCode(conditionTypeCode);
			results.success(IConstant.SUCCESS_MSG, "data", vos);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			results.failed(IConstant.FAIL_MSG);
		}
		return results;
	}



}
