package com.yonyou.iuap.ism.web;

import java.util.Date;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yonyou.iuap.base.utils.RestUtils;
import com.yonyou.iuap.people.entity.People;
import com.yonyou.uap.wb.entity.management.WBUser;
import com.yonyou.uap.wb.entity.org.Dept;
import com.yonyou.uap.wb.entity.org.Organization;
import com.yonyou.iuap.wb.utils.JsonResponse;

@RestController
@RequestMapping(value = "/syn")
/**
 * 测试类
 * @author Administrator
 *
 */
public class DataSynController {

	@RequestMapping(value = "/userAdd", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> userAdd(String userData) {

		String url = "http://127.0.0.1:7777/wbalone/userMGT/create";

		JsonResponse result = RestUtils.getInstance().doPost(url, userData, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/userAddByObj", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> userAddByObj() {

		String url = "http://127.0.0.1:7777/wbalone/userMGT4syn/createByObj";

		WBUser user = new WBUser();
		user.setName("aaa");
		user.setLoginName("aaa");
		user.setPhone("23131131");
		user.setEmail("87468627@qq.com");

		JsonResponse result = RestUtils.getInstance().doPost(url, user, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/userUpdate", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> userUpdate(String userData) {

		String url = "http://127.0.0.1:7777/wbalone/userMGT4syn/update";

		JsonResponse result = RestUtils.getInstance().doPost(url, userData, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/userUpdateByObj", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> userUpdate() {

		String url = "http://127.0.0.1:7777/wbalone/userMGT4syn/updateByObj";
		WBUser user = new WBUser();
		user.setId("3beb5ce0cfbe4b46a16be83a5b5c3c2a");
		user.setName("name_updateByObj");
		JsonResponse result = RestUtils.getInstance().doPost(url, user, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/orgAdd", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> orgAdd(String userData) {

		String url = "http://127.0.0.1:7777/wbalone/org4syn/create";

		JsonResponse result = RestUtils.getInstance().doPost(url, userData, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/orgAddByObj", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> orgAddByObj() {

		String url = "http://127.0.0.1:7777/wbalone/org4syn/createByObj";

		Organization org = new Organization();

		org.setCode("orgsyn20");
		org.setName("orgsyn20");
		org.setEffective_date(new Date());
		org.setPrincipal("jxsid002_U001");

		JsonResponse result = RestUtils.getInstance().doPost(url, org, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/orgUpdate", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> orgUpdate(String userData) {

		String url = "http://127.0.0.1:7777/wbalone/org4syn/update";

		JsonResponse result = RestUtils.getInstance().doPost(url, userData, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/orgUpdateByObj", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> orgUpdateByObj() {

		String url = "http://127.0.0.1:7777/wbalone/org4syn/updateByObj";

		Organization org = new Organization();

		org.setId("0729566c-3012-4e46-8ba1-bbcf5afe2e6d");
		org.setCode("orgsyn20update");

		JsonResponse result = RestUtils.getInstance().doPost(url, org, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/deptAdd", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> deptAdd(String userData) {

		String url = "http://127.0.0.1:7777/wbalone/dept4syn/create";

		JsonResponse result = RestUtils.getInstance().doPost(url, userData, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/deptAddByObj", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> deptAdd() {

		String url = "http://127.0.0.1:7777/wbalone/dept4syn/createByObj";

		Dept dept = new Dept();

		dept.setCode("dept20");
		dept.setName("dept20");
		dept.setEffective_date(new Date());
		dept.setPrincipal("jxsid002_U001");
		dept.setOrganization_id("5af390ae-a993-41ec-9577-6f1110e0ae19");

		JsonResponse result = RestUtils.getInstance().doPost(url, dept, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/deptUpdate", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> deptUpdate(String userData) {

		String url = "http://127.0.0.1:7777/wbalone/dept4syn/update";

		JsonResponse result = RestUtils.getInstance().doPost(url, userData, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/deptUpdateByObj", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> deptUpdateByObj() {

		String url = "http://127.0.0.1:7777/wbalone/dept4syn/updateByObj";

		Dept dept = new Dept();

		dept.setId("291fcd29-48a8-498c-a862-ab19ced48b48");
		dept.setCode("dept20Update");

		JsonResponse result = RestUtils.getInstance().doPost(url, dept, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/peopleAdd", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> peopleAdd(String userData) {

		String url = "http://127.0.0.1:7777/iuap_qy/people4syn/create";

		JsonResponse result = RestUtils.getInstance().doPost(url, userData, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/peopleAddByObj", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> peopleAddByObj() {

		String url = "http://127.0.0.1:7777/iuap_qy/people4syn/createByObj";

		People people = new People();
		people.setPsncode("psnsyn20");
		people.setPsnname("psnsyn20");
		people.setPsnage("38");
		people.setPsntel("13671347413");

		people.setPk_user("4a6fc35449534d889d8cefff8b963a2d");
		people.setPk_org("5af390ae-a993-41ec-9577-6f1110e0ae19");
		people.setPk_dept("291fcd29-48a8-498c-a862-ab19ced48b48");

		JsonResponse result = RestUtils.getInstance().doPost(url, people, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/peopleUpdate", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> peopleUpdate(String userData) {

		String url = "http://127.0.0.1:7777/iuap_qy/people4syn/update";

		JsonResponse result = RestUtils.getInstance().doPost(url, userData, JsonResponse.class);

		return result;
	}

	@RequestMapping(value = "/peopleUpdateByObj", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> peopleUpdateByObj() {

		String url = "http://127.0.0.1:7777/iuap_qy/people4syn/updateByObj";

		People people = new People();
		people.setPk_psndoc("556c7b72-1575-401b-b46d-ecd56ab3c660");
		people.setPsncode("psnsyn20Update");

		JsonResponse result = RestUtils.getInstance().doPost(url, people, JsonResponse.class);

		return result;
	}
	
	@RequestMapping(value = "/restWithSignTest", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> testRest() {

		String url = "http://172.30.3.77:8880/iuap_qy/ism/userRestWithSign/queryUserInfoVos?userId=8cac945005264ee993b08331222c9d87";

		
		JsonResponse result = RestUtils.getInstance().doGetWithSign(url, null, JsonResponse.class);
		
		return result;
	}

}