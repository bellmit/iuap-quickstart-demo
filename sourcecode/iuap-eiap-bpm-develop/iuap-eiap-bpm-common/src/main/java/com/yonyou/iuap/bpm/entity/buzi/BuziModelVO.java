package com.yonyou.iuap.bpm.entity.buzi;

import java.util.Date;

public class BuziModelVO {
	 private String id;
	 
	 private String code;
	 
	 private String name;
	 
	 private String buzientity_id;
	 
	 private String msgtemplateclass_id;
	 
	 private Date createtime;
	 
	 private String sysid;
	 
	 private String tenantid;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBuzientity_id() {
		return buzientity_id;
	}

	public void setBuzientity_id(String buzientity_id) {
		this.buzientity_id = buzientity_id;
	}

	public String getMsgtemplateclass_id() {
		return msgtemplateclass_id;
	}

	public void setMsgtemplateclass_id(String msgtemplateclass_id) {
		this.msgtemplateclass_id = msgtemplateclass_id;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public String getSysid() {
		return sysid;
	}

	public void setSysid(String sysid) {
		this.sysid = sysid;
	}

	public String getTenantid() {
		return tenantid;
	}

	public void setTenantid(String tenantid) {
		this.tenantid = tenantid;
	}
	 
	 
}