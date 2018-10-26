import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.apache.commons.lang.ArrayUtils;
import org.apache.poi.util.ArrayUtil;
import org.junit.Assert;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yonyou.iuap.bpm.approval.adapter.JsonResultService;

import ch.qos.logback.core.net.SyslogOutputStream;
import yonyou.bpm.rest.BpmRest;
import yonyou.bpm.rest.BpmRests;
import yonyou.bpm.rest.HistoryService;
import yonyou.bpm.rest.RepositoryService;
import yonyou.bpm.rest.RuntimeService;
import yonyou.bpm.rest.TaskService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.param.BaseParam;
import yonyou.bpm.rest.request.historic.HistoricActivityQueryParam;
import yonyou.bpm.rest.request.identity.TenantResourceParam;
import yonyou.bpm.rest.request.runtime.ProcessInstanceStartParam;
import yonyou.bpm.rest.request.task.TaskQueryParam;
import yonyou.bpm.rest.response.runtime.task.TaskResponse;
import yonyou.bpm.rest.utils.BaseUtils;

public class TestBpmInterface {

	// @Test
	public void testGetSaveTenant() {

		String serverUrl = "http://172.20.18.163/ubpm-web-rest";
		String tenant = "uapbpm";
		String token = "key:MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAgMBAAECgYA7goBOqHoevOmSOqGW3M4nZK9ix6mlCww_ylbk8bBhNyyghQi5bnomTTR7DzVHWEDo7PBr1w7PfZP1ZzWTr8i$bjCe0wW03DUURvyt3xNQOv2UsdmiIfrOWRhOd0qQHJAjrXzBYxR4jH2DN4UusggkOnv7_im_B_3U4fxyJfteAQJBAO6MTWJ0rOW4yeShpOWJ5AIBk$6tW83FVh80WMI$NWHg_dGvOicImD_fN2R6hELOkGxHflUVluu6p3J02Fph3SECQQDTYoFJxoppKREHsyWjmrsEL6iOpV8Q$96R13ZVMlM6uXKAyQ9tFl5yaXqNBdZZXMlO4AJ4IAsm85juiczRPz4LAkA$hNbjLuEBc$S13wdwgSsYu4Eh1J1y2H0xwG5iuhsTg_wBsIL1J_N_CelilBmFyM1hE3uwoO_k6A5qmOT7CxsBAkEA0AiX2PWObmQ$IGfM2TCEcWA98PULlHls1_dGvB4lDxxHdjtp9SAYn1zzgSqHg7bvX7LSe0p97z25$rifXCdzdQJBAMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74Y=nkey:AAAAgMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAAAAAwEAAQAAAEDujE1idKzluMnkoaTlieQCAZPurVvNxVYfNFjCPjVh4P3RrzonCJg_3zdkeoRCzpBsR35VFZbruqdydNhaYd0hAAAAQNNigUnGimkpEQezJaOauwQvqI6lXxD73pHXdlUyUzq5coDJD20WXnJpeo0F1llcyU7gAnggCybzmO6JzNE_PgsAAABAPoTW4y7hAXPktd8HcIErGLuBIdSdcth9McBuYrobE4P8AbCC9SfzfwnpYpQZhcjNYRN7sKDv5OgOapjk$wsbAQAAAEDQCJfY9Y5uZD4gZ8zZMIRxYD3w9QuUeWzX90a8HiUPHEd2O2n1IBifXPOBKoeDtu9fstJ7Sn3vPbn6uJ9cJ3N1AAAAQMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74YAAACAO4KATqh6HrzpkjqhltzOJ2SvYseppQsMP8pW5PGwYTcsoIUIuW56Jk00ew81R1hA6Ozwa9cOz32T9Wc1k6_Ivm4wntMFtNw1FEb8rd8TUDr9lLHZoiH6zlkYTndKkByQI618wWMUeIx9gzeFLrIIJDp7$_4pvwf91OH8ciX7XgE=token:F9CwocpyNc0eXg6lWThZxKdY2SsYfh3i0vvCtU8nK_C9kOrxBIComgGnnopXnZpxPyQXtKs0h2LJQCGLB2oKRaS_LeoXxTezWGQ8910IX1oSvKswGJfQoT0oehjoDTJvC5CSwpSIptRXMKNXqPjkrgk1csjun_20yd$QkCgilZw=";
		BaseParam baseParam = new BaseParam();
		baseParam.setOperatorID("default_user_id");
		baseParam.setServer(serverUrl);
		baseParam.setTenant(tenant);
		baseParam.setClientToken(token);

		TenantResourceParam tenantResourceParam = new TenantResourceParam();
		tenantResourceParam.setName("ucrbqglj");
		tenantResourceParam.setCode("ucrbqglj");
		tenantResourceParam.setParent("default_tenant_id");
		Object saveTenant = null;
		BpmRest bpmRest = BpmRests.getBpmRest(baseParam);
		try {
			saveTenant = bpmRest.getIdentityService().saveTenant(tenantResourceParam);
			Assert.assertNotNull(saveTenant);
			System.out.println(saveTenant);
		} catch (RestException e) {
			e.printStackTrace();
		}

	}

	//@Test
	public void getTanentId() {
		String serverUrl = "http://172.20.18.163/ubpm-web-rest";
		String tenant = "uapbpm";
		String token = "key:MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAgMBAAECgYA7goBOqHoevOmSOqGW3M4nZK9ix6mlCww_ylbk8bBhNyyghQi5bnomTTR7DzVHWEDo7PBr1w7PfZP1ZzWTr8i$bjCe0wW03DUURvyt3xNQOv2UsdmiIfrOWRhOd0qQHJAjrXzBYxR4jH2DN4UusggkOnv7_im_B_3U4fxyJfteAQJBAO6MTWJ0rOW4yeShpOWJ5AIBk$6tW83FVh80WMI$NWHg_dGvOicImD_fN2R6hELOkGxHflUVluu6p3J02Fph3SECQQDTYoFJxoppKREHsyWjmrsEL6iOpV8Q$96R13ZVMlM6uXKAyQ9tFl5yaXqNBdZZXMlO4AJ4IAsm85juiczRPz4LAkA$hNbjLuEBc$S13wdwgSsYu4Eh1J1y2H0xwG5iuhsTg_wBsIL1J_N_CelilBmFyM1hE3uwoO_k6A5qmOT7CxsBAkEA0AiX2PWObmQ$IGfM2TCEcWA98PULlHls1_dGvB4lDxxHdjtp9SAYn1zzgSqHg7bvX7LSe0p97z25$rifXCdzdQJBAMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74Y=nkey:AAAAgMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAAAAAwEAAQAAAEDujE1idKzluMnkoaTlieQCAZPurVvNxVYfNFjCPjVh4P3RrzonCJg_3zdkeoRCzpBsR35VFZbruqdydNhaYd0hAAAAQNNigUnGimkpEQezJaOauwQvqI6lXxD73pHXdlUyUzq5coDJD20WXnJpeo0F1llcyU7gAnggCybzmO6JzNE_PgsAAABAPoTW4y7hAXPktd8HcIErGLuBIdSdcth9McBuYrobE4P8AbCC9SfzfwnpYpQZhcjNYRN7sKDv5OgOapjk$wsbAQAAAEDQCJfY9Y5uZD4gZ8zZMIRxYD3w9QuUeWzX90a8HiUPHEd2O2n1IBifXPOBKoeDtu9fstJ7Sn3vPbn6uJ9cJ3N1AAAAQMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74YAAACAO4KATqh6HrzpkjqhltzOJ2SvYseppQsMP8pW5PGwYTcsoIUIuW56Jk00ew81R1hA6Ozwa9cOz32T9Wc1k6_Ivm4wntMFtNw1FEb8rd8TUDr9lLHZoiH6zlkYTndKkByQI618wWMUeIx9gzeFLrIIJDp7$_4pvwf91OH8ciX7XgE=token:F9CwocpyNc0eXg6lWThZxKdY2SsYfh3i0vvCtU8nK_C9kOrxBIComgGnnopXnZpxPyQXtKs0h2LJQCGLB2oKRaS_LeoXxTezWGQ8910IX1oSvKswGJfQoT0oehjoDTJvC5CSwpSIptRXMKNXqPjkrgk1csjun_20yd$QkCgilZw=";
		BaseParam baseParam = new BaseParam();
		baseParam.setOperatorID("default_user_id");
		baseParam.setServer(serverUrl);
		baseParam.setTenant(tenant);
		baseParam.setClientToken(token);
		BpmRest bpmRest = BpmRests.getBpmRest(baseParam);
		try {
			Object tenant2 = bpmRest.getIdentityService().getTenant("aed6d1f5-8937-11e7-90df-14abc53225c6");
			Assert.assertNotNull(tenant2);
			System.out.println(tenant2);
		} catch (RestException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	// @Test
	public void deleteTanent() {
		String serverUrl = "http://172.20.18.163/ubpm-web-rest";
		String tenant = "uapbpm";
		String token = "key:MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAgMBAAECgYA7goBOqHoevOmSOqGW3M4nZK9ix6mlCww_ylbk8bBhNyyghQi5bnomTTR7DzVHWEDo7PBr1w7PfZP1ZzWTr8i$bjCe0wW03DUURvyt3xNQOv2UsdmiIfrOWRhOd0qQHJAjrXzBYxR4jH2DN4UusggkOnv7_im_B_3U4fxyJfteAQJBAO6MTWJ0rOW4yeShpOWJ5AIBk$6tW83FVh80WMI$NWHg_dGvOicImD_fN2R6hELOkGxHflUVluu6p3J02Fph3SECQQDTYoFJxoppKREHsyWjmrsEL6iOpV8Q$96R13ZVMlM6uXKAyQ9tFl5yaXqNBdZZXMlO4AJ4IAsm85juiczRPz4LAkA$hNbjLuEBc$S13wdwgSsYu4Eh1J1y2H0xwG5iuhsTg_wBsIL1J_N_CelilBmFyM1hE3uwoO_k6A5qmOT7CxsBAkEA0AiX2PWObmQ$IGfM2TCEcWA98PULlHls1_dGvB4lDxxHdjtp9SAYn1zzgSqHg7bvX7LSe0p97z25$rifXCdzdQJBAMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74Y=nkey:AAAAgMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAAAAAwEAAQAAAEDujE1idKzluMnkoaTlieQCAZPurVvNxVYfNFjCPjVh4P3RrzonCJg_3zdkeoRCzpBsR35VFZbruqdydNhaYd0hAAAAQNNigUnGimkpEQezJaOauwQvqI6lXxD73pHXdlUyUzq5coDJD20WXnJpeo0F1llcyU7gAnggCybzmO6JzNE_PgsAAABAPoTW4y7hAXPktd8HcIErGLuBIdSdcth9McBuYrobE4P8AbCC9SfzfwnpYpQZhcjNYRN7sKDv5OgOapjk$wsbAQAAAEDQCJfY9Y5uZD4gZ8zZMIRxYD3w9QuUeWzX90a8HiUPHEd2O2n1IBifXPOBKoeDtu9fstJ7Sn3vPbn6uJ9cJ3N1AAAAQMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74YAAACAO4KATqh6HrzpkjqhltzOJ2SvYseppQsMP8pW5PGwYTcsoIUIuW56Jk00ew81R1hA6Ozwa9cOz32T9Wc1k6_Ivm4wntMFtNw1FEb8rd8TUDr9lLHZoiH6zlkYTndKkByQI618wWMUeIx9gzeFLrIIJDp7$_4pvwf91OH8ciX7XgE=token:F9CwocpyNc0eXg6lWThZxKdY2SsYfh3i0vvCtU8nK_C9kOrxBIComgGnnopXnZpxPyQXtKs0h2LJQCGLB2oKRaS_LeoXxTezWGQ8910IX1oSvKswGJfQoT0oehjoDTJvC5CSwpSIptRXMKNXqPjkrgk1csjun_20yd$QkCgilZw=";
		BaseParam baseParam = new BaseParam();
		baseParam.setOperatorID("default_user_id");
		baseParam.setServer(serverUrl);
		baseParam.setTenant(tenant);
		baseParam.setClientToken(token);
		BpmRest bpmRest = BpmRests.getBpmRest(baseParam);
		try {
			boolean deleteTenant = bpmRest.getIdentityService().deleteTenant("e223ddf9-8897-11e7-b135-06fcca00166c");
			Assert.assertTrue(deleteTenant);
		} catch (RestException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	   //@Test
		public   void  startProcessInstanceByKey() {
	    	String  serverUrl="http://localhost:8081/ubpm-web-rest";
		    String   tenant="uapbpm";
		    String   token="key:MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAgMBAAECgYA7goBOqHoevOmSOqGW3M4nZK9ix6mlCww_ylbk8bBhNyyghQi5bnomTTR7DzVHWEDo7PBr1w7PfZP1ZzWTr8i$bjCe0wW03DUURvyt3xNQOv2UsdmiIfrOWRhOd0qQHJAjrXzBYxR4jH2DN4UusggkOnv7_im_B_3U4fxyJfteAQJBAO6MTWJ0rOW4yeShpOWJ5AIBk$6tW83FVh80WMI$NWHg_dGvOicImD_fN2R6hELOkGxHflUVluu6p3J02Fph3SECQQDTYoFJxoppKREHsyWjmrsEL6iOpV8Q$96R13ZVMlM6uXKAyQ9tFl5yaXqNBdZZXMlO4AJ4IAsm85juiczRPz4LAkA$hNbjLuEBc$S13wdwgSsYu4Eh1J1y2H0xwG5iuhsTg_wBsIL1J_N_CelilBmFyM1hE3uwoO_k6A5qmOT7CxsBAkEA0AiX2PWObmQ$IGfM2TCEcWA98PULlHls1_dGvB4lDxxHdjtp9SAYn1zzgSqHg7bvX7LSe0p97z25$rifXCdzdQJBAMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74Y=nkey:AAAAgMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAAAAAwEAAQAAAEDujE1idKzluMnkoaTlieQCAZPurVvNxVYfNFjCPjVh4P3RrzonCJg_3zdkeoRCzpBsR35VFZbruqdydNhaYd0hAAAAQNNigUnGimkpEQezJaOauwQvqI6lXxD73pHXdlUyUzq5coDJD20WXnJpeo0F1llcyU7gAnggCybzmO6JzNE_PgsAAABAPoTW4y7hAXPktd8HcIErGLuBIdSdcth9McBuYrobE4P8AbCC9SfzfwnpYpQZhcjNYRN7sKDv5OgOapjk$wsbAQAAAEDQCJfY9Y5uZD4gZ8zZMIRxYD3w9QuUeWzX90a8HiUPHEd2O2n1IBifXPOBKoeDtu9fstJ7Sn3vPbn6uJ9cJ3N1AAAAQMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74YAAACAO4KATqh6HrzpkjqhltzOJ2SvYseppQsMP8pW5PGwYTcsoIUIuW56Jk00ew81R1hA6Ozwa9cOz32T9Wc1k6_Ivm4wntMFtNw1FEb8rd8TUDr9lLHZoiH6zlkYTndKkByQI618wWMUeIx9gzeFLrIIJDp7$_4pvwf91OH8ciX7XgE=token:F9CwocpyNc0eXg6lWThZxKdY2SsYfh3i0vvCtU8nK_C9kOrxBIComgGnnopXnZpxPyQXtKs0h2LJQCGLB2oKRaS_LeoXxTezWGQ8910IX1oSvKswGJfQoT0oehjoDTJvC5CSwpSIptRXMKNXqPjkrgk1csjun_20yd$QkCgilZw=";
			BaseParam baseParam = new BaseParam();
			baseParam.setOperatorID("default_user_id");
			baseParam.setServer(serverUrl);
			baseParam.setTenant(tenant);
			baseParam.setClientToken(token);
			BpmRest bpmRest = BpmRests.getBpmRest(baseParam);
			try {
				RuntimeService rt = bpmRest.getRuntimeService();
//				Object startProcessInstanceByKey = runtimeService.startProcessInstanceByKey("eiap890373", "BEI005");
				String  procInstName="交通费报销单据";
				ProcessInstanceStartParam parm = new ProcessInstanceStartParam();
				parm.setProcessDefinitionKey("eiap342541");
//				parm.setVariables(variables);
				parm.setProcessInstanceName(procInstName);
				parm.setBusinessKey("8d77daea-e188-42fe-8e6b-ea1c047e2f3a");
				parm.setReturnTasks(true);
				
				//关键特性字段处理 xingjjc 2017-1-4
				/*String _keyFeatures_ = "_keyFeatures_";
				int indexOf = procInstName.indexOf(_keyFeatures_);
				if (indexOf != -1) {
					parm.setProcessInstanceName(procInstName.substring(0, indexOf));
					parm.setKeyFeature(procInstName.substring(indexOf + _keyFeatures_.length(), procInstName.length() -1));
				}*/
				
				ObjectNode node = (ObjectNode) rt.startProcess(parm);
				System.out.println(node);
				Assert.assertNotNull(node);
			} catch (RestException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    }
		
		
		/**
	     * 根据用户id查询该用户的待办列表
	     *
	     * @param bpmUserId
	     * @return 待办任务id和对应流程实例id
	     * @throws RestException
	     */
		//@Test
	    public void queryTodoList() throws Exception {
	    	String userId="95f4ee7440f74fcaa5ef4e8595e3c9cb";
	    	String keyword=null; 
	    	String taskDue=null;
	    	String taskToday=null;
	    	Integer priority=50;
			int size=10;
			int start=0;
			
			String  serverUrl="http://localhost:8081/ubpm-web-rest";
		    String   tenant="uapbpm";
		    String   token="key:MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAgMBAAECgYA7goBOqHoevOmSOqGW3M4nZK9ix6mlCww_ylbk8bBhNyyghQi5bnomTTR7DzVHWEDo7PBr1w7PfZP1ZzWTr8i$bjCe0wW03DUURvyt3xNQOv2UsdmiIfrOWRhOd0qQHJAjrXzBYxR4jH2DN4UusggkOnv7_im_B_3U4fxyJfteAQJBAO6MTWJ0rOW4yeShpOWJ5AIBk$6tW83FVh80WMI$NWHg_dGvOicImD_fN2R6hELOkGxHflUVluu6p3J02Fph3SECQQDTYoFJxoppKREHsyWjmrsEL6iOpV8Q$96R13ZVMlM6uXKAyQ9tFl5yaXqNBdZZXMlO4AJ4IAsm85juiczRPz4LAkA$hNbjLuEBc$S13wdwgSsYu4Eh1J1y2H0xwG5iuhsTg_wBsIL1J_N_CelilBmFyM1hE3uwoO_k6A5qmOT7CxsBAkEA0AiX2PWObmQ$IGfM2TCEcWA98PULlHls1_dGvB4lDxxHdjtp9SAYn1zzgSqHg7bvX7LSe0p97z25$rifXCdzdQJBAMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74Y=nkey:AAAAgMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAAAAAwEAAQAAAEDujE1idKzluMnkoaTlieQCAZPurVvNxVYfNFjCPjVh4P3RrzonCJg_3zdkeoRCzpBsR35VFZbruqdydNhaYd0hAAAAQNNigUnGimkpEQezJaOauwQvqI6lXxD73pHXdlUyUzq5coDJD20WXnJpeo0F1llcyU7gAnggCybzmO6JzNE_PgsAAABAPoTW4y7hAXPktd8HcIErGLuBIdSdcth9McBuYrobE4P8AbCC9SfzfwnpYpQZhcjNYRN7sKDv5OgOapjk$wsbAQAAAEDQCJfY9Y5uZD4gZ8zZMIRxYD3w9QuUeWzX90a8HiUPHEd2O2n1IBifXPOBKoeDtu9fstJ7Sn3vPbn6uJ9cJ3N1AAAAQMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74YAAACAO4KATqh6HrzpkjqhltzOJ2SvYseppQsMP8pW5PGwYTcsoIUIuW56Jk00ew81R1hA6Ozwa9cOz32T9Wc1k6_Ivm4wntMFtNw1FEb8rd8TUDr9lLHZoiH6zlkYTndKkByQI618wWMUeIx9gzeFLrIIJDp7$_4pvwf91OH8ciX7XgE=token:F9CwocpyNc0eXg6lWThZxKdY2SsYfh3i0vvCtU8nK_C9kOrxBIComgGnnopXnZpxPyQXtKs0h2LJQCGLB2oKRaS_LeoXxTezWGQ8910IX1oSvKswGJfQoT0oehjoDTJvC5CSwpSIptRXMKNXqPjkrgk1csjun_20yd$QkCgilZw=";
			BaseParam baseParam = new BaseParam();
			baseParam.setOperatorID("default_user_id");
			baseParam.setServer(serverUrl);
			baseParam.setTenant(tenant);
			baseParam.setClientToken(token);
			BpmRest bpmRest = BpmRests.getBpmRest(baseParam);
	        TaskService ts = bpmRest.getTaskService();
	        TaskQueryParam tqp = new TaskQueryParam();
	        tqp.setOrder("desc");
	        tqp.setSort("createTime");
	        tqp.setSize(size);
	        tqp.setStart(start);

	        if (taskDue != null && taskDue.length() > 0) {
	            tqp.setDueBefore(new Date());
	        }
	        if (taskToday != null && taskToday.length() > 0) {
	            Date today = new Date();
	            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	            String todayStr = sdf.format(today).substring(0, 10);
	            try {
	                Date today0 = sdf.parse(todayStr + " 00:00:00");
	                Date today1 = sdf.parse(todayStr + " 23:59:59");
	                tqp.setCreatedAfter(today0);
	                tqp.setCreatedBefore(today1);
	            } catch (ParseException e) {
//	                log.error("时间解析错误", e);
	            }
	        }
	        if (priority != null) {
	            tqp.setPriority(priority);
	        }

	        if (keyword != null && keyword.trim().length() > 0) {
	            tqp.setNameLike("%" + keyword + "%");
	        }

	        JsonNode jsonNode = (JsonNode) ts.queryTasksToDo(userId, tqp);

	        List<TaskResponse> list = new ArrayList<TaskResponse>();
	        ArrayNode arrayNode = BaseUtils.getData(jsonNode);
	        JsonResultService jsonResultService= new  JsonResultService();
	        for (int i = 0; arrayNode != null && i < arrayNode.size(); i++) {
	        	System.out.println(arrayNode.get(i).toString());
	            TaskResponse resp = jsonResultService.toObject(arrayNode.get(i).toString(), TaskResponse.class);
	            list.add(resp);
	        }

	        System.out.println(ArrayUtils.toString(list));
	    }
		
		
		/**
	     * 根据用户id查询该用户的待办列表
	     *
	     * @param bpmUserId
	     * @return 待办任务id和对应流程实例id
	     * @throws RestException
	     */
		@Test
	    public void queryStartUserId() throws Exception {
			
			String  serverUrl="http://localhost:8081/ubpm-web-rest";
		    String   tenant="uapbpm";
		    String   token="key:MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAgMBAAECgYA7goBOqHoevOmSOqGW3M4nZK9ix6mlCww_ylbk8bBhNyyghQi5bnomTTR7DzVHWEDo7PBr1w7PfZP1ZzWTr8i$bjCe0wW03DUURvyt3xNQOv2UsdmiIfrOWRhOd0qQHJAjrXzBYxR4jH2DN4UusggkOnv7_im_B_3U4fxyJfteAQJBAO6MTWJ0rOW4yeShpOWJ5AIBk$6tW83FVh80WMI$NWHg_dGvOicImD_fN2R6hELOkGxHflUVluu6p3J02Fph3SECQQDTYoFJxoppKREHsyWjmrsEL6iOpV8Q$96R13ZVMlM6uXKAyQ9tFl5yaXqNBdZZXMlO4AJ4IAsm85juiczRPz4LAkA$hNbjLuEBc$S13wdwgSsYu4Eh1J1y2H0xwG5iuhsTg_wBsIL1J_N_CelilBmFyM1hE3uwoO_k6A5qmOT7CxsBAkEA0AiX2PWObmQ$IGfM2TCEcWA98PULlHls1_dGvB4lDxxHdjtp9SAYn1zzgSqHg7bvX7LSe0p97z25$rifXCdzdQJBAMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74Y=nkey:AAAAgMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAAAAAwEAAQAAAEDujE1idKzluMnkoaTlieQCAZPurVvNxVYfNFjCPjVh4P3RrzonCJg_3zdkeoRCzpBsR35VFZbruqdydNhaYd0hAAAAQNNigUnGimkpEQezJaOauwQvqI6lXxD73pHXdlUyUzq5coDJD20WXnJpeo0F1llcyU7gAnggCybzmO6JzNE_PgsAAABAPoTW4y7hAXPktd8HcIErGLuBIdSdcth9McBuYrobE4P8AbCC9SfzfwnpYpQZhcjNYRN7sKDv5OgOapjk$wsbAQAAAEDQCJfY9Y5uZD4gZ8zZMIRxYD3w9QuUeWzX90a8HiUPHEd2O2n1IBifXPOBKoeDtu9fstJ7Sn3vPbn6uJ9cJ3N1AAAAQMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74YAAACAO4KATqh6HrzpkjqhltzOJ2SvYseppQsMP8pW5PGwYTcsoIUIuW56Jk00ew81R1hA6Ozwa9cOz32T9Wc1k6_Ivm4wntMFtNw1FEb8rd8TUDr9lLHZoiH6zlkYTndKkByQI618wWMUeIx9gzeFLrIIJDp7$_4pvwf91OH8ciX7XgE=token:F9CwocpyNc0eXg6lWThZxKdY2SsYfh3i0vvCtU8nK_C9kOrxBIComgGnnopXnZpxPyQXtKs0h2LJQCGLB2oKRaS_LeoXxTezWGQ8910IX1oSvKswGJfQoT0oehjoDTJvC5CSwpSIptRXMKNXqPjkrgk1csjun_20yd$QkCgilZw=";
			BaseParam baseParam = new BaseParam();
			baseParam.setOperatorID("default_user_id");
			baseParam.setServer(serverUrl);
			baseParam.setTenant(tenant);
			baseParam.setClientToken(token);
			BpmRest bpmRest = BpmRests.getBpmRest(baseParam);
	       HistoryService historyService = bpmRest.getHistoryService();
	       HistoricActivityQueryParam historicActivityQueryParam=new HistoricActivityQueryParam();
	       historicActivityQueryParam.setProcessInstanceId("9dade3cb-9756-11e7-8e32-14abc53225c6");
	       historicActivityQueryParam.setActivityType("startEvent");
//	       Object historicActivityInstances =historyService.getHistoricActivityInstances(historicActivityQueryParam);
	       Object historicProcessInstance = historyService.getHistoricProcessInstance("9dade3cb-9756-11e7-8e32-14abc53225c6");
	       System.out.println(historicProcessInstance);
	       JsonNode jsonNode = (JsonNode) historicProcessInstance;
	       System.out.println(jsonNode.get("startUserId").asText());
	       
	       /*Object data = objectNode.get("data");
	       if (data instanceof ArrayNode) {
	    	   ArrayNode array = (ArrayNode) data;
	    	   JsonNode o = array.get(0);
	    	   String processInstanceId = o.get("processInstanceId").asText();
	    	   System.out.println(processInstanceId);
	       }*/
	       
	       
	       
			
	       
	    }
	/*public static void main(String[] args) {
		 Date date = new Date((long)TimeZone.getDefault().getRawOffset() + 3153600000000L);
		 System.out.println(date);

	}*/
	

}
