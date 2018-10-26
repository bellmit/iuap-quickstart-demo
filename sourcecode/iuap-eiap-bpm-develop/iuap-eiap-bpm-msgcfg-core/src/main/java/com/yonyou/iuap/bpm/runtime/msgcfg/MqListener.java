package com.yonyou.iuap.bpm.runtime.msgcfg;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;

public class MqListener implements MessageListener {

	@Override
	public void onMessage(Message message) {
		String data = new String(message.getBody());

		new MsgSender().sendMsg(data);

	}
	
	
	

}
