package org.iuap.eiap.bpm.approval.core;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.collections4.map.HashedMap;
import org.junit.Assert;
import org.junit.Test;
import yonyou.bpm.rest.BpmRest;
import yonyou.bpm.rest.BpmRests;
import yonyou.bpm.rest.RuntimeService;
import yonyou.bpm.rest.exception.RestException;
import yonyou.bpm.rest.param.BaseParam;
import yonyou.bpm.rest.request.runtime.ProcessInstanceStartParam;

import java.util.HashMap;

public class TestBpmInterface {


	    @Test
		public   void  startProcessInstanceByKey() {
	    	String  serverUrl="http://localhost:8081/ubpm-web-rest";
		    String   tenant="uapbpm";
		    String   token="key:MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAgMBAAECgYA7goBOqHoevOmSOqGW3M4nZK9ix6mlCww_ylbk8bBhNyyghQi5bnomTTR7DzVHWEDo7PBr1w7PfZP1ZzWTr8i$bjCe0wW03DUURvyt3xNQOv2UsdmiIfrOWRhOd0qQHJAjrXzBYxR4jH2DN4UusggkOnv7_im_B_3U4fxyJfteAQJBAO6MTWJ0rOW4yeShpOWJ5AIBk$6tW83FVh80WMI$NWHg_dGvOicImD_fN2R6hELOkGxHflUVluu6p3J02Fph3SECQQDTYoFJxoppKREHsyWjmrsEL6iOpV8Q$96R13ZVMlM6uXKAyQ9tFl5yaXqNBdZZXMlO4AJ4IAsm85juiczRPz4LAkA$hNbjLuEBc$S13wdwgSsYu4Eh1J1y2H0xwG5iuhsTg_wBsIL1J_N_CelilBmFyM1hE3uwoO_k6A5qmOT7CxsBAkEA0AiX2PWObmQ$IGfM2TCEcWA98PULlHls1_dGvB4lDxxHdjtp9SAYn1zzgSqHg7bvX7LSe0p97z25$rifXCdzdQJBAMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74Y=nkey:AAAAgMT5bfc33VbfUZk9l8HrK86YV88QMWYmfolyLKyjs7P4UWYcdeUzPw2lHf_XQFFEehFZYnrFE6I95fkcYSmL5on3f$MYsGfX9TQi2n27h$jAPg7eHbg6QSiJadM5RqKP_M7UmItcV5bTQSP$Op26kGIkqPu1mOTPgt9Abhjx4X5rAAAAAwEAAQAAAEDujE1idKzluMnkoaTlieQCAZPurVvNxVYfNFjCPjVh4P3RrzonCJg_3zdkeoRCzpBsR35VFZbruqdydNhaYd0hAAAAQNNigUnGimkpEQezJaOauwQvqI6lXxD73pHXdlUyUzq5coDJD20WXnJpeo0F1llcyU7gAnggCybzmO6JzNE_PgsAAABAPoTW4y7hAXPktd8HcIErGLuBIdSdcth9McBuYrobE4P8AbCC9SfzfwnpYpQZhcjNYRN7sKDv5OgOapjk$wsbAQAAAEDQCJfY9Y5uZD4gZ8zZMIRxYD3w9QuUeWzX90a8HiUPHEd2O2n1IBifXPOBKoeDtu9fstJ7Sn3vPbn6uJ9cJ3N1AAAAQMt73EmCnBvRCrQXt3Bf6O5EpI4J7TdNIClKbBTwmV6N25cZ_pja_nZNa7q$oY6aZg0Ppay9fz1o4a81bDxn74YAAACAO4KATqh6HrzpkjqhltzOJ2SvYseppQsMP8pW5PGwYTcsoIUIuW56Jk00ew81R1hA6Ozwa9cOz32T9Wc1k6_Ivm4wntMFtNw1FEb8rd8TUDr9lLHZoiH6zlkYTndKkByQI618wWMUeIx9gzeFLrIIJDp7$_4pvwf91OH8ciX7XgE=token:F9CwocpyNc0eXg6lWThZxKdY2SsYfh3i0vvCtU8nK_C9kOrxBIComgGnnopXnZpxPyQXtKs0h2LJQCGLB2oKRaS_LeoXxTezWGQ8910IX1oSvKswGJfQoT0oehjoDTJvC5CSwpSIptRXMKNXqPjkrgk1csjun_20yd$QkCgilZw=";
			BaseParam baseParam = new BaseParam();
			String  userId="5b576549e4cd4de8ba6d311c3aba8e12";
			baseParam.setOperatorID(userId);
			baseParam.setServer(serverUrl);
			baseParam.setTenant(tenant);
			baseParam.setClientToken(token);
			baseParam.setTenantLimit("uapbpm");
			BpmRest bpmRest = BpmRests.getBpmRest(baseParam);

			RuntimeService rt = bpmRest.getRuntimeService();
			try {
//				Object processInstanceDiagramJson = rt.getProcessInstanceDiagramJson("eiap210854:1:5de2c7a0-ae41-11e7-a507-14abc53225c6", "cf4c4acc-c84d-11e7-a576-14abc53225c6");
				Object identityLinks = rt.getIdentityLinks("cf4c4acc-c84d-11e7-a576-14abc53225c6");
				System.out.println(identityLinks);
			} catch (RestException e) {
				e.printStackTrace();
			}

			/*try {
				RuntimeService rt = bpmRest.getRuntimeService();
				String  procInstName="baoxiaodan";
				ProcessInstanceStartParam parm = new ProcessInstanceStartParam();
				parm.setProcessDefinitionKey("eiap210854");
//				parm.setVariables(variables);
				parm.setProcessInstanceName(procInstName);
				parm.setBusinessKey("331e43d5-222d-4804-b4e7-9763b652b2ec");
				parm.setReturnTasks(true);
				ObjectNode node = (ObjectNode) rt.startProcess(parm);
				System.out.println(node);
				Assert.assertNotNull(node);
			} catch (RestException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}*/
			HashMap<String, String> stringStringHashMap = new HashMap<>();
		}





}
