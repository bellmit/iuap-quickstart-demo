package com.yonyou.iuap.bpm.runtime.msgcfg;

import com.aliyun.mns.client.CloudAccount;
import com.aliyun.mns.model.Message;
import com.yonyou.iuap.mq.mns.AbstractMessageListener;

public class MqMnsListener extends AbstractMessageListener {

	public MqMnsListener(String queueName, CloudAccount mnsAccount, int waitSeconds) {

		super(queueName, mnsAccount, waitSeconds);
	}

	@Override

	public void onMessage(Message message) {

		String data = new String(message.getMessageBody());

		new MsgSender().sendMsg(data);
	}

}
