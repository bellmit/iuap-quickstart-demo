package com.yonyou.iuap.bpm.entity.adapter;

import java.util.Date;

public class BpmUserMappingVO {
	private String id;
	private String localuser_id;
	private String localuser_code;
	private String remoteuser_id;
	private String remoteuser_code;
	private Date create_date;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getLocaluser_id() {
		return localuser_id;
	}
	public void setLocaluser_id(String localuser_id) {
		this.localuser_id = localuser_id;
	}
	public String getLocaluser_code() {
		return localuser_code;
	}
	public void setLocaluser_code(String localuser_code) {
		this.localuser_code = localuser_code;
	}
	public String getRemoteuser_id() {
		return remoteuser_id;
	}
	public void setRemoteuser_id(String remoteuser_id) {
		this.remoteuser_id = remoteuser_id;
	}
	public String getRemoteuser_code() {
		return remoteuser_code;
	}
	public void setRemoteuser_code(String remoteuser_code) {
		this.remoteuser_code = remoteuser_code;
	}
	public Date getCreate_date() {
		return create_date;
	}
	public void setCreate_date(Date create_date) {
		this.create_date = create_date;
	}
	
}
