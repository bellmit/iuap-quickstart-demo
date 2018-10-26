package com.yonyou.iuap.bpm.entity.adapter;

import java.util.Date;

public class BpmOrgMappingVO {
	private String id;
	private String localorg_id;
	private String localorg_code;
	private String remoteorg_id;
	private Date create_date;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getLocalorg_id() {
		return localorg_id;
	}
	public void setLocalorg_id(String localorg_id) {
		this.localorg_id = localorg_id;
	}
	public String getLocalorg_code() {
		return localorg_code;
	}
	public void setLocalorg_code(String localorg_code) {
		this.localorg_code = localorg_code;
	}
	public String getRemoteorg_id() {
		return remoteorg_id;
	}
	public void setRemoteorg_id(String remoteorg_id) {
		this.remoteorg_id = remoteorg_id;
	}
	public Date getCreate_date() {
		return create_date;
	}
	public void setCreate_date(Date create_date) {
		this.create_date = create_date;
	}
	
}
