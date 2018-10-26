package com.yonyou.iuap.bpm.common.base.message;

import com.alibaba.fastjson.JSONObject;
import com.yonyou.iuap.persistence.vo.BaseEntity;
import nc.vo.jcom.lang.StringUtil;

public class MessageEntity extends BaseEntity {
	
	//
	
	private JSONObject processData;

	

	/**
	 * 审批动作类型
	 */
	private String approveType;

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 发送人
	 */
	private String sendman;

	/**
	 * 消息渠道【邮件email、短信note、upush-messagepush、系统消息sys】
	 */
	private String[] channel;

	/**
	 * 接收人
	 */
	private String[] recevier;

	/**
	 * 功能节点编码
	 */
	private String funCode="00001";

	private String templatecode;

	public String getTemplatecode() {
		return templatecode;
	}

	public void setTemplatecode(String templatecode) {
		this.templatecode = templatecode;
	}

	/**
	 * 单据ID
	 */
	private String billid;

	/**
	 * 消息类型notice/task
	 */
	private String msgtype;

	/**
	 * 业务数据
	 */
	private String busiData;

	/**
	 * 租户
	 */
	private String tencentid;

	private String subject;

	private String content;

	public String getTencentid() {
		return tencentid;
	}

	public void setTencentid(String tencentid) {
		this.tencentid = tencentid;
	}

	public String getSendman() {
		return sendman;
	}

	public void setSendman(String sendman) {
		this.sendman = sendman;
	}

	public String[] getChannel() {
		return channel;
	}

	public void setChannel(String[] channel) {
		this.channel = channel;
	}

	public String[] getRecevier() {
		return recevier;
	}

	public void setRecevier(String[] recevier) {
		this.recevier = recevier;
	}

	public String getBillid() {
		return billid;
	}

	public void setBillid(String billid) {
		this.billid = billid;
	}

	public String getMsgtype() {
		return msgtype;
	}

	public void setMsgtype(String msgtype) {
		this.msgtype = msgtype;
	}

	public String getBusiData() {
		return busiData;
	}

	public void setBusiData(String busiData) {
		this.busiData = busiData;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getFunCode() {
		
		return funCode;
	}

	public void setFunCode(String funCode) {
		
		if(StringUtil.isEmpty(funCode)){
			return;
		}
		this.funCode = funCode;
	}

	public String getApproveType() {
		return approveType;
	}

	public void setApproveType(String approveType) {
		this.approveType = approveType;
	}
	
	public JSONObject getProcessData() {
		return processData;
	}

	public void setProcessData(JSONObject processData) {
		this.processData = processData;
	}

}
