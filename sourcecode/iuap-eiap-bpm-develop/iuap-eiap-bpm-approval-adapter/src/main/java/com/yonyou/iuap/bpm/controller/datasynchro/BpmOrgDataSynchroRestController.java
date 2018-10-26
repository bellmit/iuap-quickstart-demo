package com.yonyou.iuap.bpm.controller.datasynchro;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.common.base.utils.BpmSynchroDataException;
import com.yonyou.iuap.bpm.common.base.utils.JSONResponse;
import com.yonyou.iuap.bpm.service.adapter.IEiapBpmOrgAdapterService;

@Controller
@RequestMapping(value = "/restorgsynchro")
public class BpmOrgDataSynchroRestController {

	private static final Logger log = LoggerFactory.getLogger(BpmOrgDataSynchroRestController.class);

	@Autowired
	private IEiapBpmOrgAdapterService service;

	@ResponseBody
	@RequestMapping(value = "/save", method = RequestMethod.GET)
	public JSONResponse save(HttpServletRequest request, HttpServletResponse response) {
		JSONResponse results = new JSONResponse();
		try {
			String data = request.getParameter("data");
			service.saveOrg(data);
			results.success("保存成功！");
		} catch (BpmSynchroDataException e) {
			log.error(e.getLocalizedMessage(), e);
			results.failed(e.getLocalizedMessage());
		} catch (Exception e) {
			log.error(e.getLocalizedMessage(), e);
			results.failed("同步服务异常，请稍后重试！");
		}
		return results;
	}

	@ResponseBody
	@RequestMapping(value = "/delete", method = RequestMethod.GET)
	public JSONResponse delete(HttpServletRequest request, HttpServletResponse response) {
		JSONResponse results = new JSONResponse();
		try {
			String data = request.getParameter("data");
			service.deleteOrg(data);
			results.success("删除成功！");
		} catch (BpmSynchroDataException e) {
			log.error(e.getLocalizedMessage(), e);
			results.failed(e.getLocalizedMessage());
		} catch (Exception e) {
			log.error(e.getLocalizedMessage(), e);
			results.failed("同步服务异常，请稍后重试！");
		}
		return results;
	}
}
