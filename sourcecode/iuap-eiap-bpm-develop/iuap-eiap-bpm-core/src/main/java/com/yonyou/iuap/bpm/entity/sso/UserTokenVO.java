package com.yonyou.iuap.bpm.entity.sso;

import java.util.Date;

public class UserTokenVO {
	private String id;
	private String user_id;
	private String token;
	private Date createtime;
	private String isenable;
	private Date enabletime;
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
	public Date getEnabletime() {
		return enabletime;
	}
	public void setEnabletime(Date enabletime) {
		this.enabletime = enabletime;
	}
	
}
