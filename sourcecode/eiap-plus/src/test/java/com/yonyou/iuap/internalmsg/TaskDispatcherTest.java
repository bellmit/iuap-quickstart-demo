package com.yonyou.iuap.internalmsg;

import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.base.utils.RestUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.client.RestTemplate;

/**
 * Created by Administrator on 2018/4/10.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"classpath*:applicationContext*.xml"})
public class TaskDispatcherTest {

    @Autowired
    private RestTemplate template;

    @Test
    public void demo01(){
//		String xmlPath = "applicationContext.xml";
//		ApplicationContext applicationContext = new ClassPathXmlApplicationContext(xmlPath);
//		AccountService accountService =  (AccountService) applicationContext.getBean("accountService");
        //accountService.transfer("jack", "rose", 1000);

        String urlStr = "http://172.20.8.92:8080/iuap-saas-dispatch-service/taskrest/saveTask.do";

        String jsonStr = "{'data':{'task':{'taskcode':'aaaa','taskname':'aaaa','taskdesc':'','gid':'0f3fe3ce7bd64f2e957e17a67f2e1e81','flag':1,'taskmsg':[],'taskway':{'id':'dispatch_task00001','taskParams':[{'code':'test1','name':'test1','paramvalue':'test1','id':'dispatch_task00001_param_test1','taskwayid':'dispatch_task00001'},{'code':'test2','name':'test2','paramvalue':'test2','id':'dispatch_task00001_param_test2','taskwayid':'dispatch_task00001'}]},'timeway':{'id':'','starttime':'2018-04-09 16:43','endtime':'2018-04-10 18:50','modetime':{'modetype':'0','modefrequency':'1','modevaule':[]},'dura':{'duramode':'1','duravalue':'10','period':{'periodmode':'1','periodstart':'08:00','periodend':'17:00'}}}}}}";
        JSONObject data = new JSONObject();
        JSONObject task = new JSONObject();
        JSONObject tenantid = new JSONObject();
        JSONObject sysid = new JSONObject();
        task.put("taskcode","aaaa");
        task.put("taskname","aaaa");
        task.put("taskdesc","aaaa");
        task.put("gid","0f3fe3ce7bd64f2e957e17a67f2e1e81");
        task.put("flag","1");
        JSONArray taskmsg = new JSONArray();
        task.put("taskmsg",taskmsg);
        //-----------------taskway
            JSONObject taskway = new JSONObject();
            JSONArray taskParams = new JSONArray();
            JSONObject taskParams1 = new JSONObject();
            taskParams1.put("code","test1");
            taskParams1.put("name","test1");
            taskParams1.put("paramvalue","test1");
            taskParams1.put("id","dispatch_task00001_param_test1");
            taskParams1.put("taskwayid","dispatch_task00001");
            taskParams.add(taskParams1);
            JSONObject taskParams2 = new JSONObject();
            taskParams2.put("code","test2");
            taskParams2.put("name","test2");
            taskParams2.put("paramvalue","test2");
            taskParams2.put("id","dispatch_task00001_param_test2");
            taskParams2.put("taskwayid","dispatch_task00001");
            taskParams.add(taskParams2);
            taskway.put("id","dispatch_task00001");
            taskway.put("taskParams",taskParams);
        task.put("taskway",taskway);
        //-----------------taskway
        //-----------------timeway
            JSONObject timeway = new JSONObject();
            timeway.put("id","");
            timeway.put("starttime","2018-04-11 16:43");
            timeway.put("endtime","2018-04-18 22:50");
            JSONObject modetime = new JSONObject();
            modetime.put("modetype","0");
            modetime.put("modefrequency","1");
            JSONArray modevaule = new JSONArray();
            modetime.put("modevaule",modevaule);
            timeway.put("modetime",modetime);
            JSONObject dura = new JSONObject();
            dura.put("duramode","1");
            dura.put("duravalue","10");
            JSONObject period = new JSONObject();
            period.put("periodmode","1");
            period.put("periodstart","08:00");
            period.put("periodend","17:00");
            dura.put("period",period);
            timeway.put("dura",dura);
        task.put("timeway",timeway);
       // tenantid.put("tenantid", "tenantid");
       // sysid.put("sysid", "sysid");
        task.put("tenantid","tenant");
        task.put("sysid","wbalone");
    
        data.put("task",task);
        
        
       // String data1 = "data=%7B%22task%22%3A%7B%22taskcode%22%3A%22qqqqq%22%2C%22taskname%22%3A%22qqqqq%22%2C%22taskdesc%22%3A%22%22%2C%22gid%22%3A%220f3fe3ce7bd64f2e957e17a67f2e1e81%22%2C%22flag%22%3A1%2C%22taskmsg%22%3A%5B%5D%2C%22taskway%22%3A%7B%22id%22%3A%22taskway01%22%2C%22taskParams%22%3A%5B%5D%7D%2C%22timeway%22%3A%7B%22id%22%3A%22%22%2C%22starttime%22%3A%222018-04-10+19%3A20%22%2C%22endtime%22%3A%222018-04-20+15%3A55%22%2C%22modetime%22%3A%7B%22modetype%22%3A%220%22%2C%22modefrequency%22%3A%221%22%2C%22modevaule%22%3A%5B%5D%7D%2C%22dura%22%3A%7B%22duramode%22%3A%221%22%2C%22duravalue%22%3A%225%22%2C%22period%22%3A%7B%22periodmode%22%3A%221%22%2C%22periodstart%22%3A%2208%3A00%22%2C%22periodend%22%3A%2222%3A00%22%7D%7D%7D%7D%7D";
        //Map ret = RestUtils.getInstance(template).doPostWithSign(urlStr, data.toString(), Map.class);
        //RestUtils 类中增加构造方法
    	/*public static RestUtils getInstance(RestTemplate restTemplate){
    		if (restUtils == null) {
    			restUtils = new RestUtils(restTemplate);
    		}
    		return restUtils;
    	}*/
        
        //System.out.println(ret + "");

    }
}
