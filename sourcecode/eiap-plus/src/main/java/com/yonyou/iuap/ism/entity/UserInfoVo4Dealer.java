package com.yonyou.iuap.ism.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.yonyou.iuap.persistence.jdbc.framework.annotation.Column;


public class UserInfoVo4Dealer extends UserInfoVo {

	/**
	 * 代理商
	 */
	private static final long serialVersionUID = -3633949440742895478L;

	@JsonIgnore
	public String getOrgname() {
		return super.getOrgname();
	}
	@Column(name = "tenant_Id")
	private String tenant_Id;

	public String getTenant_Id() {
		return tenant_Id;
	}

	public void setTenant_Id(String tenant_Id) {
		this.tenant_Id = tenant_Id;
	}
	@Override
	@JsonIgnore
	public String getRolecode() {
		// TODO Auto-generated method stub
		return super.getRolecode();
	}
	@Override
	@JsonIgnore
	public String getRolename() {
		// TODO Auto-generated method stub
		return super.getRolename();
	}
	private Role[] roles;

	public Role[] getRoles() {
		return roles;
	}

	public void setRoles(Role[] roles) {
		this.roles = roles;
	}
	
}
