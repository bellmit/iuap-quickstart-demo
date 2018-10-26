package com.yonyou.iuap.bpm.test;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.yonyou.iuap.bpm.common.msgcfg.HttpClient;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgCfgVO;
import com.yonyou.iuap.bpm.entity.msgcfg.MsgReceiverVO;

import net.sf.json.JSONObject;

public class HttpClientTester {

	public static void main(String[] args) {
		HttpClientTester tester = new HttpClientTester();
		tester.testUrl();
	}

	public void testUrl() {
//		String urlStr = "http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/getMsgCommWay";

		// String urlStr
		// ="http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/getEventType";
		
		String urlStr = "http://localhost:8080/iuap-eiap-bpm-msgcfg-service/msgConfig/insertMsgConfig";
		
		MsgCfgVO cfgVO = new MsgCfgVO();
		cfgVO.setAct_id("act_id");
		cfgVO.setBuzientity_id("buzientity_id");
		cfgVO.setCreatetime(new Date());
		cfgVO.setEnable(1);
		cfgVO.setMsgname("请购单");
		
		MsgReceiverVO rVO = new MsgReceiverVO();
		rVO.setId("1");
		rVO.setMsgcfg_id("msgcfgid");
		rVO.setReceiver("userID");
		rVO.setReceivertypecode("user");
		
		
		Map<String,String> map = new HashMap<String,String>();
		map.put("data", JSONObject.fromObject(cfgVO).toString());	
		
		
		String result = HttpClient.sendPost(urlStr, map);
		System.out.println("result is "+result);
		
	}

}
