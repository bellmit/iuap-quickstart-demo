package com.yonyou.iuap.internalmsg.entity.vo;

import java.util.Date;

import com.yonyou.iuap.internalmsg.entity.po.Msg;

/**
 * @author zhh
 * @date 2017-11-29 : 19:27
 * @JDK 1.7
 */
public class MsgVO extends Msg {

	private static final long serialVersionUID = -6865322762468124255L;

	/**
	 * 发送人
	 */
	public String sender;

	/**
	 * 接收时间
	 */
	public Date receiveTime;

	/**
	 * 消息类型名称
	 */
	public String typeName;

	/**
	 * 消息阅读状态
	 */
	public Integer readStatus;

	/**
	 * 消息阅读状态名称
	 */
	public String readStatusName;

	/**
	 * 接收人
	 */
	public String receiver;

	/**
	 * 发送时间
	 */
	private Date sendTime;

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public Date getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Date receiveTime) {
		this.receiveTime = receiveTime;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getReadStatusName() {
		return readStatusName;
	}

	public void setReadStatusName(String readStatusName) {
		this.readStatusName = readStatusName;
	}

	public String getReceiver() {
		return receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public Date getSendTime() {
		return sendTime;
	}

	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}

	public Integer getReadStatus() {
		return readStatus;
	}

	public void setReadStatus(Integer readStatus) {
		this.readStatus = readStatus;
	}

}
