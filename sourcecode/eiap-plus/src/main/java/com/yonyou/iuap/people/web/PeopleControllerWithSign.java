package com.yonyou.iuap.people.web;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yonyou.iuap.base.web.BaseController;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.iuap.people.service.PeopleService;
import com.yonyou.iuap.util.LoginRestException;
import com.yonyou.iuap.wb.utils.JsonResponse;

/**
 * <p>
 * Title: CardTableController
 * </p>
 * <p>
 * Description: 卡片表示例的controller层
 * </p>
 */
@RestController
@RequestMapping(value = "/peopleRestWithSign")
public class PeopleControllerWithSign extends BaseController {
	
	private static final Logger log = LoggerFactory.getLogger(PeopleControllerWithSign.class);
	
	@Autowired
	private PeopleService service;

//	@RequestMapping(value = "/getByUserId", method = RequestMethod.GET)
//	public @ResponseBody Object getByUserId(PageRequest pageRequest,@RequestParam(value="userId") String pk_user,@RequestParam(value="tenant") String tenantId) {
//		//通过sdk调用过来的请求，环境变量里没有任何cookie信息，这里重置下租户信息
//		InvocationInfoProxy.setTenantid(tenantId);
//		try {
//			Map<String,String> result = new HashMap<String,String>();
//			People people = service.getByUserId(pk_user,tenantId);
//			if(people != null){
//				result.put("pk_org", people.getPk_org());
//				result.put("pk_dept", people.getPk_dept());
//				return buildSuccess(result);
//			}else{
//				return buildGlobalError("获取不到人员档案信息");
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			return buildGlobalError(e.getMessage());
//		}
//	}
	
	@RequestMapping(value = "/getByUserId", method = RequestMethod.GET)
	public @ResponseBody JsonResponse getByUserId(PageRequest pageRequest,@RequestParam(value="userId") String pk_user,@RequestParam(value="tenant") String tenantId) {
		log.debug("登录rest调用：用户{}租户{}",pk_user,tenantId);
		//通过sdk调用过来的请求，环境变量里没有任何cookie信息，这里重置下租户信息
		InvocationInfoProxy.setTenantid(tenantId);
		JsonResponse results = new JsonResponse();
		try {
			if("5af4c29d275443d3a0b4c50dd4ed8965".equals(pk_user)){
				throw new LoginRestException("商家xxx未启用，请联系系统管理员！");
			}
			Map<String,String> cookie = new HashMap<String,String>();
			People people = service.getByUserId(pk_user,tenantId);
			if(people != null){
				cookie.put("pk_org", people.getPk_org());
				cookie.put("pk_dept", people.getPk_dept());
				cookie.put("pk_position", "operator");
				results.success("操作成功！", "data", cookie);
			}else{
				results.failed("获取不到人员档案信息");
			}
		} catch (LoginRestException e) {
			results.failed(e.getLocalizedMessage());
			log.error("操作异常：", e);
		} catch (Exception e) {
			results.failed("服务异常，请稍后重试！");
			log.error("服务异常：", e);
		}
		log.debug("登录rest调用：{}",results);
		return results;
	}
}

