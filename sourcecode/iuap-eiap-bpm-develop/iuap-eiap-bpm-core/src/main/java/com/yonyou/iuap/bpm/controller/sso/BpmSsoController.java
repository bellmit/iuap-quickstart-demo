package com.yonyou.iuap.bpm.controller.sso;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yonyou.iuap.bpm.common.base.token.TokenManager;
import com.yonyou.iuap.bpm.common.base.token.TokenUtil;
import com.yonyou.iuap.bpm.common.base.utils.JSONResponse;
import com.yonyou.iuap.bpm.controller.buzimodelref.BuziEntityFieldController;
import com.yonyou.iuap.bpm.entity.adapter.BpmUserMappingVO;
import com.yonyou.iuap.bpm.entity.user.WBUser;
import com.yonyou.iuap.bpm.service.adapter.IProcessService;
import com.yonyou.iuap.bpm.service.adapter.UserMappingService;
import com.yonyou.iuap.context.InvocationInfoProxy;

@Controller
@RequestMapping(value = "/bpmsso")
public class BpmSsoController {
	private static final Logger log = LoggerFactory.getLogger(BuziEntityFieldController.class);
	@Autowired
	private IProcessService processService;
	@Autowired
	private UserMappingService userMappingService;

	@Autowired
	private TokenManager tokenMapper;
	
	@Value("${cloud.cloudIndentify}")
	private String  cloudIndentify;

	@ResponseBody
	@RequestMapping(value = "/getFlowUrl", method = RequestMethod.GET)
	public JSONResponse getFlowUrl(HttpServletRequest request, HttpServletResponse response) {
		JSONResponse results = new JSONResponse();
		try {
			String modelId = request.getParameter("modelId");
			if (StringUtils.isBlank(modelId)) {
				results.failed("请传入流程Id！");
				return results;
			}
			String remoteUserId=null;
			//判断当前使用的的是私有版本还是共有版本  cloudIndentify 为true 表示私有版本，false 表示共有版本
			if (Boolean.valueOf(cloudIndentify)) {
				remoteUserId=InvocationInfoProxy.getUserid();
			}else {
				BpmUserMappingVO userMapping = userMappingService.findByLocalUserId(InvocationInfoProxy.getUserid());
				if (userMapping == null) {
					results.failed("当前用户未同步到云审批！");
					return results;
				}
				remoteUserId = userMapping.getRemoteuser_id();
			}


			String token = TokenUtil.getToken();
			String ssoUrl = processService.getFlowSSOUrl(modelId, token);
			tokenMapper.addToken(token, remoteUserId);
			ssoUrl = URLEncoder.encode(ssoUrl, "UTF-8");
			results.success("查询成功！", ssoUrl);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			results.failed(e.getLocalizedMessage());
		}
		return results;
	}

	@ResponseBody
	@RequestMapping(value = "/validatetoken", method = RequestMethod.GET)
	public Map<String, Object> validateSsoToken(HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> results = new HashMap<String, Object>();
		String token = request.getParameter("token");
		// String userId = request.getParameter("userId");
		if (StringUtils.isBlank(token)) {
			results.put("flag", false);
			return results;
		}
		try {
			boolean flag = tokenMapper.validate(token);
			results.put("flag", flag);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			results.put("flag", false);
		}
		return results;
	}

	@ResponseBody
	@RequestMapping(value = "/getRemoteUserIdCuruserId", method = RequestMethod.GET)
	public JSONResponse getRemoteUserId(HttpServletRequest request, HttpServletResponse response) {
		JSONResponse results = new JSONResponse();
		String userId = InvocationInfoProxy.getUserid();
		if (StringUtils.isBlank(userId)) {
			results.failed("请先登录！");
			return results;
		}
		try {
			BpmUserMappingVO userMapping = userMappingService.findByLocalUserId(userId);
			if (userMapping == null || StringUtils.isBlank(userMapping.getRemoteuser_id())) {
				results.failed("未查到相关记录！");
				return results;
			}
			results.success("查询成功！", userMapping.getRemoteuser_id());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			results.failed("操作失败！");
		}
		return results;
	}

	public static void main(String[] args) {
		String url = "http://172.20.8.9:8080/ubpm-web-approve/static/login.html" + "?modelId=" + "shsedggsdg"
				+ "&organizationId=" + "gfhfdbdfbdbf" + "&page=flow" + "&userCode=" + "lixial" + "&userId="
				+ "iinivoo-99ksdlflksd-dd" + "&token=" + "sgihoifwladsgbnvismgnvimwiwvdkmwgnvokso";
		url = URLEncoder.encode(url);
		// System.out.println(url); sonar检查不允许写这样的代码，可以写到测试里
	}
}
