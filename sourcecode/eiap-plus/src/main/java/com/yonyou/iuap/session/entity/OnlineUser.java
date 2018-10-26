package com.yonyou.iuap.session.entity;

import org.apache.commons.lang3.StringUtils;


public class OnlineUser implements Comparable<OnlineUser>{

	private java.lang.String tenant_id;

	private java.lang.String id;
    
    private java.lang.String login_name;
      
    private java.lang.String name;
    
    private String token;
    
    private java.lang.String lastTs;
    
    private String loginType;
    
    private String loginCount;
    
    public String getLoginCount() {
		return loginCount;
	}

	public void setLoginCount(String loginCount) {
		this.loginCount = loginCount;
	}

	public String getLoginType() {
		return loginType;
	}

	public void setLoginType(String loginType) {
		this.loginType = loginType;
	}

	public java.lang.String getId() {
		return id;
	}

	public void setId(java.lang.String id) {
		this.id = id;
	}

	public java.lang.String getLogin_name() {
		return login_name;
	}

	public void setLogin_name(java.lang.String login_name) {
		this.login_name = login_name;
	}

	public java.lang.String getName() {
		return name;
	}

	public void setName(java.lang.String name) {
		this.name = name;
	}

	public java.lang.String getTenant_id() {
		return tenant_id;
	}

	public void setTenant_id(java.lang.String tenant_id) {
		this.tenant_id = tenant_id;
	}
    
    public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public java.lang.String getLastTs() {
		return lastTs;
	}

	public void setLastTs(java.lang.String lastTs) {
		this.lastTs = lastTs;
	}

	@Override
	public int compareTo(OnlineUser o) {
		if (StringUtils.isNotEmpty(this.getLastTs()) && StringUtils.isNotEmpty(o.getLastTs())) {
			return o.getLastTs().compareTo(this.getLastTs());
		}
		if (StringUtils.isEmpty(this.getLastTs()) && StringUtils.isNotEmpty(o.getLastTs())) {
			return -1;
		}
		if (StringUtils.isNotEmpty(this.getLastTs()) && StringUtils.isEmpty(o.getLastTs())) {
			return 1;
		}
		return 0;
	}
}
