package com.yonyou.iuap.bpm.common.base.message;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.context.InvocationInfoProxy;
import com.yonyou.iuap.mq.rabbit.RabbitMQProducer;
import com.yonyou.iuap.persistence.vo.pub.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class CommonMessageSendService {

	@Autowired
	private ThreadPoolTaskExecutor threadPoolTaskExecutor;

	// @Autowired
	private RabbitMQProducer mqSender;

	public void sendMessage(final MessageEntity msgentity, final JSONObject busiData, boolean syn,
                            final String msgContentType) {
		Runnable msgSendTask = new Runnable() {

			@Override
			public void run() {
				sendMessageInfo(msgentity, busiData, msgContentType);
			}
		};

		if (syn) {
			sendMessageInfo(msgentity, busiData, msgContentType);
		} else {
			// 异步
			threadPoolTaskExecutor.execute(msgSendTask);
		}
	}

	public void sendTemplateMessage(final MessageEntity msgentity, final JSONObject busiData) {
		sendMessage(msgentity, busiData, false, WebappMessageConst.MESCONTENTTYPE_TEMPLATE);// 默认异步调用
	}

	public void sendTextMessage(final MessageEntity msgentity, final JSONObject busiData) {
		sendMessage(msgentity, busiData, false, WebappMessageConst.MESCONTENTTYPE_TEXT);// 默认异步调用
	}

	public void sendMqMessage(final String exchange, final String routingKey, final Object message, boolean syn) {
		Runnable msgSendTask = new Runnable() {

			@Override
			public void run() {
				// mqSender.sendMsg(exchange, routingKey, message);
			}

		};

		if (syn) {
			// msgSendTask.run();
		} else {
			// 异步
			threadPoolTaskExecutor.execute(msgSendTask);
		}
	}

	public void sendMqMessage(String exchange, String routingKey, Object message) {
		sendMqMessage(exchange, routingKey, message, false);// 默认异步调用
	}

	/**
	 * 消息具体发送类
	 * 
	 * @param msgentity
	 * @param busiData
	 * @param msgContentType
	 */
	public void sendMessageInfo(final MessageEntity msgentity, final JSONObject busiData, final String msgContentType) {

		JSONObject msg = new JSONObject();

		JSONObject jsonObj = new JSONObject();
		jsonObj.put("sendman", msgentity.getSendman());

		JSONArray channel = new JSONArray();
		String[] channelstr = msgentity.getChannel();
		StringBuffer err = new StringBuffer();
		if (channelstr == null || channelstr.length == 0) {
			err.append("渠道不能为空");
		}
		if (null != channelstr) {
			for (int i = 0; i < channelstr.length; i++) {
				String chan = channelstr[i];
				channel.add(chan);
			}
		}

		jsonObj.put("subject", "站内消息标题");
		jsonObj.put("content", "站内消息测试内容, 时间: " + (new
		SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()));

		jsonObj.put("subject", msgentity.getSubject());
		jsonObj.put("content", msgentity.getContent());
		jsonObj.put("channel", channel);
		jsonObj.put("templateCode", msgentity.getTemplatecode());
		jsonObj.put("functioncode", msgentity.getFunCode());
		jsonObj.put("approvetype", msgentity.getApproveType());
		jsonObj.put("language", (InvocationInfoProxy.getParameter("locale_serial") == null ? "1"
				: InvocationInfoProxy.getParameter("locale_serial")));
		
		jsonObj.put("processData", msgentity.getProcessData());
		

		if (msgentity.getTencentid() == null || msgentity.getTencentid().length() == 0) {
			msgentity.setTencentid("tenant");
		}
		jsonObj.put("tenantid", msgentity.getTencentid());

		JSONArray arr = new JSONArray();
		String[] receivers = msgentity.getRecevier();
		if (receivers == null || receivers.length == 0) {
			err.append("消息接收者不能为空");
		}

		if (null != receivers) {
			for (int i = 0; i < receivers.length; i++) {
				String rev = receivers[i];
				if (rev != null && rev.length() > 0) {
					if (rev.equals("ALL")) {
						// 查询所有用户
						break;
					}
					if (rev.equals("SYSADMIN")) {
						arr.add("U001");
					}
					arr.add(rev);
				}
			}
		}

		jsonObj.put("recevier", arr.toArray());
		jsonObj.put("billid", msgentity.getBillid());

		String msgtype = null;
		if (msgentity.getMsgtype() == null) {
			msgtype = WebappMessageConst.MESSAGETYPE_NOTICE;
		} else {
			msgtype = msgentity.getMsgtype();
		}

		jsonObj.put("msgtype", msgtype);

		if (busiData != null)
			jsonObj.put("busiData", busiData);

		if (err.length() > 0) {
			throw new BusinessException("发送消息通道出错：" + err.toString());
		}

		msg.put("data", jsonObj);

		if (msgContentType.equals(WebappMessageConst.MESCONTENTTYPE_TEXT)) {
			com.yonyou.uap.msg.sdk.MessageCenterUtil.pushTextMessage(msg.toString());
		} else if (msgContentType.equals(WebappMessageConst.MESCONTENTTYPE_TEMPLATE)) {
			com.yonyou.uap.msg.sdk.MessageCenterUtil.pushTemplateMessage(msg.toString());
		}

	}
}
