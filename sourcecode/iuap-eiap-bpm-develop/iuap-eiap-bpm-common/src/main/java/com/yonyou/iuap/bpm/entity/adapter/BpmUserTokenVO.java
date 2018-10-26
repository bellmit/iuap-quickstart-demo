package com.yonyou.iuap.bpm.entity.adapter;

import java.util.Date;

public class BpmUserTokenVO {
	private String id;
	private String user_id;
	private String token;
	private Date createtime;
	private String isenable;
	private int enabletime;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public Date getCreatetime() {
		return createtime;
	}
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	public String getIsenable() {
		return isenable;
	}
	public void setIsenable(String isenable) {
		this.isenable = isenable;
	}
	public int getEnabletime() {
		return enabletime;
	}
	public void setEnabletime(int enabletime) {
		this.enabletime = enabletime;
	}
	
}
