//package com.yonyou.iuap.reseller.init.web;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.ResponseBody;
//
//import com.yonyou.iuap.reseller.init.service.ResellerInitService;
//
//@Controller
//@RequestMapping("/resellerInit")
//public class ResellerInitController{
//
//	private static final Logger logger = LoggerFactory
//			.getLogger(ResellerInitController.class);
//	@Autowired
//	private ResellerInitService resellerInitService;
//
//	@RequestMapping("/execute")
//	@ResponseBody
//	public Map<String, String> resellerInitTableSqls(HttpServletRequest request, HttpServletResponse response,
//			@RequestParam(value = "tenantid") String tenantid, @RequestParam(value = "tenantcode") String tenantcode) {
//		logger.debug("resellerInit execute add operate.");
//		Map<String, String> map = new HashMap<String, String>();
//		try {
//			resellerInitService.executeTenantSqls(tenantid, tenantcode);
//			map.put("status", "success");
//			map.put("msg", "开通租户id为"+tenantid+",编码为"+tenantcode+"成功");
//		} catch (Exception e) {
//			logger.error(e.getMessage(),e);
//			map.put("status", "failed");
//			map.put("msg", e.getMessage());
//		}
//		return map;
//	}
//}
