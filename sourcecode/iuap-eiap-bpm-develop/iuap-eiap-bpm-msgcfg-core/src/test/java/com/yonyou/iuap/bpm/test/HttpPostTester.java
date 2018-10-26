package com.yonyou.iuap.bpm.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.google.gson.JsonObject;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgCfgVO;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverVO;
import com.yonyou.iuap.generic.adapter.IContants;

import iuap.bo.adapter.service.Json2BOAdapter;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class HttpPostTester {
	public static void main(String[] args) {
		HttpPostTester tester = new HttpPostTester();
		// 	tester.testHttpPost();
		tester.testHttpPostByJson();
//		tester.testHttpPostofCornExpresByJson();
		
//		tester.test();
	}
    
	
	public String testHttpPostByJson() {
//		String urlStr = "http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/getChannels";
		
//		String urlStr ="http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/getEventType";
		
//		String urlStr = "http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/findAllByProcId?proc_module_id=proc_module_id&act_id=act_id&buzientity_id=buzientity_id";

		//		http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/start?id=3ada4424ef5d497c9bca90b324c93e51&enable=0

		//		String urlStr ="http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/deleteMsgConfig?id=65c3b058b744428ab7ee1578296b66ee";
		
	
		String urlStr = "http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/insertMsgConfig";
		
//		String urlStr = "http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/updateMsgConfig";
	
			
		MsgCfgVO cfgVO = new MsgCfgVO();
		cfgVO.setAct_id("act_idtest");
		cfgVO.setBuzientity_id("buzientity_idtest");
		cfgVO.setCreatetime(new Date());
		cfgVO.setEnable(1);
		cfgVO.setMsgname("入职申请单test");
//		cfgVO.setId("3ada4424ef5d497c9bca90b324c93e68");
//		cfgVO.setTriggercondition("");
		cfgVO.setChannel("email");
				
		MsgReceiverVO rVO = new MsgReceiverVO();
		rVO.setId("10");
		rVO.setMsgcfg_id("msgcfgid");
		rVO.setReceiver("userID");
		rVO.setReceivertypecode("user");
		
		cfgVO.setMsgReceiverVOs(new MsgReceiverVO[]{rVO});
		
		
		String cfgJson = JSONObject.fromObject(cfgVO).toString();
		
		
				
		// tenantid,userid,sysid 要通过cookie传入
		String cookies = getCookieString("tenantTest", "sysTest", "userTest");

		StringBuffer sb = new StringBuffer();
		URL url = null;
		try {
			HttpURLConnection conn;
			url = new URL(urlStr);
			conn = (HttpURLConnection) url.openConnection();
			if (conn instanceof HttpURLConnection) {
				((HttpURLConnection) conn).setChunkedStreamingMode(2048);
			}
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-type", "application/json");

			conn.setRequestProperty(IContants.COOKIES, cookies);
			conn.getOutputStream().write(cfgJson.getBytes());

			// 获取返回结果
			BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String lines;
			while ((lines = reader.readLine()) != null) {
				lines = new String(lines.getBytes(), "utf-8");
				sb.append(lines);
			}
			String error = conn.getHeaderField("error");

		} catch (MalformedURLException e) {
			

		} catch (IOException e) {
			
		}

		String result = sb.toString();

		System.out.println("the return msg is " + result);
		return result;

	}
	
	
	private static String getCookieString(String tenantid, String sysid, String userid) {

		StringBuffer st = new StringBuffer();
		st.append(IContants.TENANTID);
		st.append("=");
		st.append(tenantid);
		st.append(";");
		st.append(IContants.SYSID);
		st.append("=");
		st.append(sysid);
		st.append(";");
		st.append(IContants.USERID);
		st.append("=");
		st.append(userid);

		return st.toString();

	}
	
	public String test(){
		
		Map<String,Object> retMap = new HashMap<String,Object>();
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("sendman", "sendman");
		map.put("channel", "channel");
		map.put("recevier", new String[]{"123","345"});
		map.put("templateCode", "templateCode");
		map.put("busiData", "busiData");
		map.put("msgtype", "msgtype");
		map.put("billid", "billid");
		map.put("busitype", "busitype");
		map.put("busitype", "busitype");
		map.put("mailReceiver", new String[]{"sxj@yonyou.com","shx@yonyou.com"});
		map.put("mailReceiver", new String[]{"sxj@yonyou.com","shx@yonyou.com"});
		map.put("mailReceiver", new String[]{"sxj@yonyou.com","shx@yonyou.com"});
		
		retMap.put("data", map);
		
		JSONObject j = JSONObject.fromObject(retMap);
		
		String str = j.toString();
		System.out.println(str);
		return null;
	}

}
