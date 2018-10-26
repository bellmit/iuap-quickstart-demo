package com.yonyou.iuap.bpm.controller.buzimodelref;

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
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityVO;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityService;

/**
 * 
 * @ClassName: BuziEntityController 
 * @Description: 业务实体controller
 * @author qianmz
 * @date 2016年12月16日 上午11:05:29
 */
@Controller
@RequestMapping(value = "/buzientity")
public class BuziEntityController{
	private static final Logger log = LoggerFactory.getLogger(BuziEntityController.class);

	@Autowired
	private IBuziEntityService buziEntityService;
	
	@ResponseBody
	@RequestMapping(value = "/getByEntityId", method = RequestMethod.GET)
	public JSONResponse getEventType(HttpServletRequest request, HttpServletResponse response) {
		JSONResponse results = new JSONResponse();
//		String proc_module_id= request.getParameter("proc_module_id");
//		String act_id= request.getParameter("act_id");
		String buzientity_id= request.getParameter("buzientity_id");
		if (StringUtils.isBlank(buzientity_id)) {
			results.failed("请传入该必须参数：业务实体Id");
			return results;
		}
		BuziEntityVO vo = null;
		try {
			vo = buziEntityService.getEntityAndFieldsByEntityId(buzientity_id);
			results.success("查询成功！", vo);;
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			results.failed("操作失败！");
		}
		return results;
	}

}
