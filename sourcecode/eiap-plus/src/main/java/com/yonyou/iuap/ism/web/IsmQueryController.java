package com.yonyou.iuap.ism.web;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yonyou.iuap.ism.common.IsmResponseJson;
import com.yonyou.iuap.ism.entity.Page;
import com.yonyou.iuap.ism.entity.UserInfoVo;
import com.yonyou.iuap.ism.entity.UserInfoVo4Dealer;
import com.yonyou.iuap.ism.service.UserInfoService;

@RestController
@RequestMapping(value = "/ism")
/**
 * 系统内部调用，非加签的方式
 * 与刘小萍对接    智能制造需求
 * @author Administrator
 *
 */
public class IsmQueryController {
	
	private Logger logger = LoggerFactory.getLogger(IsmQueryController.class);

	@Autowired
	private UserInfoService userInfoservice;
	
	@RequestMapping(value = "/getUserInfoByRoleCodes", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> getUserInfoByRoleCodes() {
		
//		JSONArray array = JSON.parseArray(roleCodes);
//		String[] strArray = null;
//		if (!CollectionUtils.isEmpty(array)) {
//			strArray = array.toArray(new String[array.size()]);
//		}
//		
//		List<UserInfoVo> list = userInfoservice.queryUserInfoVosByRole(strArray);
		
		List<UserInfoVo> list = userInfoservice.queryUserInfoVosByRole();
	
		Map<String, Object> result = IsmResponseJson.getSuccessResult(list,list==null?0:list.size() );

		return result;
	}

	@RequestMapping(value = "/queryUserInfoVos", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> queryUserInfoVos(String userId) {
		long t1 = System.nanoTime();
		logger.debug("execute queryUserInfoVos begin");

//		String tenantId = InvocationInfoProxy.getTenantid();
//		if (tenantId==null){
//			tenantId = "pk_jxs_tenant_0002";
//		}

		UserInfoVo4Dealer userInfoVo4Dealer = userInfoservice.queryUserInfoVos(userId);
		//

		long t2 = System.nanoTime();
		logger.debug("userInfoservice.queryUserInfoVos(userId):" + (t2 -t1) + "nanotime");
		Map<String, Object> result = IsmResponseJson.getSuccessResult(userInfoVo4Dealer,userInfoVo4Dealer==null?0:1);
		long t3 = System.nanoTime();
		logger.debug("IsmResponseJson.getSuccessResult:"+ (t3 - t2) + "nanotime");

		logger.debug("execute queryUserInfoVos end");
		return result;
	}

	@RequestMapping(value = "/queryPageUserInfoVosByRole", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> queryPageUserInfoVosByRole(
			@RequestParam(value = "roleCode") String roleCode,
			@RequestParam(value = "pageIndex", defaultValue = "0") int pageIndex,
			@RequestParam(value = "pageSize", defaultValue = "20") int pageSize) {

		Page page = userInfoservice.queryPageUserInfoVosByRole(roleCode, pageIndex, pageSize);

		Map<String, Object> result = IsmResponseJson.getSuccessResult(page.getContent(), page.getTotalElements(),
				page.getPageIndex(), page.getPageSize());

		return result;
	}

}