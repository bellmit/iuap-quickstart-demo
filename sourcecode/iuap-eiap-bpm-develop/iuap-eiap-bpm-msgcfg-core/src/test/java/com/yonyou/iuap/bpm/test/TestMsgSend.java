package com.yonyou.iuap.bpm.test;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Message;

import com.yonyou.iuap.bpm.runtime.msgcfg.MqListener;

import net.sf.json.JSONObject;

public class TestMsgSend {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
//		String str = getMsg();	
//		Message message = new Message(str.getBytes(),null);
//		MqListener listner = new MqListener();
//		listner.onMessage(message);
//		
		
		String str = getFormMap();

	}
	
	private static String getMsg(){
		
		Map<String,Object> map = new HashMap<String,Object>();
		
		map.put("sendType", "EMAIL");
		
		
		
		Map<String,String> task = new HashMap<String,String>();
		
		task.put("eventName", "finish");
		
		
		
		map.put("task", task);
		
		
		Map<String,String> execution = new HashMap<String,String>();
		execution.put("currentActivityId", "test_act_id_5");
		execution.put("businessKey", "buzientity_idtest");
		execution.put("processDefinitionId", "process6133:13:26f30406-c7e4-11e6-97c7-067a8600043d");
		
		map.put("execution", execution);
		
		JSONObject js = JSONObject.fromObject(map);
		String str = js.toString();
		
		
			
		
		return str;
	}
	
	private static String getFormMap(){
		Map<String, Object> map = new HashMap<String,Object>();
		
		map.put("form_id_", "000679de-5cb1-11e6-a09a-0242ac110001");
		map.put("organization_key_", "a8l9omnj ");
		map.put("model_id_", "000679de-5cb1-11e6-a09a-0242ac110001");
		map.put("description_", "简洁的报销单，手机上就能提交报销申请，省去了线下的纸质单据，更便于收集、整理、查找。 ");
		map.put("title_", "报销单");
		map.put("category", "f6310c3c-c654-11e5-8be7-eed56d497c97 ");
		
		
		Map<String, Object> field = new HashMap<String,Object>();
		
		field.put("name", "请假类型");
		field.put("field_code", "BPM_1465008871356_2_");
		field.put("id", "0081952fc98d41fea84555f476b29dd9");
		
		Map<String, Object> type  = new HashMap<String,Object>();

		type.put("name", "select");
		type.put("options", new String[]{"事假","病假","产假","婚假","年假"});	
		type.put("defaultValue", "事假");	
		field.put("type", type);
		
		map.put("field", field);
		
		JSONObject js = JSONObject.fromObject(map);
		
		String  str = js.toString();
		
		return str;
	}

}
