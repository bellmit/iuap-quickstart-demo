package com.yonyou.iuap.ism.entity;

public class Role {

	String rolecode;
	String rolename;

	public Role(String rolecode, String rolename) {
		this.rolecode = rolecode;
		this.rolename = rolename;
	}

	public String getRolecode() {
		return rolecode;
	}

	public void setRolecode(String rolecode) {
		this.rolecode = rolecode;
	}

	public String getRolename() {
		return rolename;
	}

	public void setRolename(String rolename) {
		this.rolename = rolename;
	}

}
