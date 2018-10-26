package com.yonyou.iuap.bpm.controller.buzimodelref;

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
import com.yonyou.iuap.bpm.entity.buzi.BuziEntityFieldVO;
import com.yonyou.iuap.bpm.service.buzi.IBuziEntityFieldService;

/**
 * @ClassName: BuziEntityFieldController 
 * @Description: 业务实体filed controller
 * @author qianmz
 * @date 2016年12月17日 下午9:52:39
 */
@Controller
@RequestMapping(value = "/buzientityfield")
public class BuziEntityFieldController{
	private static final Logger log = LoggerFactory.getLogger(BuziEntityFieldController.class);

	@Autowired
	private IBuziEntityFieldService buziEntityFieldService;
	
	@ResponseBody
	@RequestMapping(value = "/getByEntityId", method = RequestMethod.GET)
	public JSONResponse getEventType(HttpServletRequest request, HttpServletResponse response) {
		JSONResponse results = new JSONResponse();
//		String act_id= request.getParameter("act_id");
		String buzientity_id= request.getParameter("buzientity_id");
//		String formCode= request.getParameter("formCode");
		String proc_module_id = request.getParameter("proc_module_id");
		
		if (StringUtils.isBlank(proc_module_id)) {
			results.failed("请传入该必须参数：流程模型Id");
			return results;
		}
		List<BuziEntityFieldVO> vos = null;
		try {
//			vos = buziEntityFieldService.findByModelID(proc_module_id);
			vos = buziEntityFieldService.findByFormCode(buzientity_id);
			results.success("查询成功！", vos);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			results.failed("操作失败！");
		}
		return results;
	}

}
