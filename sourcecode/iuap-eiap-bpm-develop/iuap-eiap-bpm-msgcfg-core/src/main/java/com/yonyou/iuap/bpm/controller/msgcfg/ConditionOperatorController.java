package com.yonyou.iuap.bpm.controller.msgcfg;

import java.util.List;

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
import com.yonyou.iuap.bpm.entity.msgcfg.ConditionOperatorVO;
import com.yonyou.iuap.bpm.service.msgcfg.IConditionOperatorService;


@Controller
@RequestMapping("/conditionOperator")
public class ConditionOperatorController {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private IConditionOperatorService conditionOperatorService;

	@ResponseBody
	@RequestMapping(value = "/getByMsgcfgId", method = RequestMethod.GET)
	public JSONResponse getEventType(HttpServletRequest request, HttpServletResponse response) {
		JSONResponse results = new JSONResponse();
		String msgcfgId = request.getParameter("msgcfgId");
		if (StringUtils.isBlank(msgcfgId)) {
			results.failed("请传入该必须参数");
			return results;
		}
		List<ConditionOperatorVO> vos = null;
		try {
			vos = conditionOperatorService.getByMsgCfgId(msgcfgId);
			results.success(IConstant.SUCCESS_MSG, "data", vos);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			results.failed(IConstant.FAIL_MSG);
		}
		return results;
	}



}
