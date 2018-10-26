package com.yonyou.iuap.bpm.entity.adapter;

import java.util.Date;

public class BpmRoleMappingVO {
	private String id;
	private String localrole_id;
	private String localrole_code;
	private String remoterole_id;
	private Date create_date;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getLocalrole_id() {
		return localrole_id;
	}
	public void setLocalrole_id(String localrole_id) {
		this.localrole_id = localrole_id;
	}
	public String getLocalrole_code() {
		return localrole_code;
	}
	public void setLocalrole_code(String localrole_code) {
		this.localrole_code = localrole_code;
	}
	public String getRemoterole_id() {
		return remoterole_id;
	}
	public void setRemoterole_id(String remoterole_id) {
		this.remoterole_id = remoterole_id;
	}
	public Date getCreate_date() {
		return create_date;
	}
	public void setCreate_date(Date create_date) {
		this.create_date = create_date;
	}
	
}
