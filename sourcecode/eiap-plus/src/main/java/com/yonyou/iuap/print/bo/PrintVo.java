package com.yonyou.iuap.print.bo;

import java.io.Serializable;

public class PrintVo implements Serializable{
	
	private String bo_name;
	
	private String bo_code;
	
	private String pk_bo;
	
	private String app_id;
	
	private String modifiedtiem;
	
	private String createtime;

	public String getBo_name() {
		return bo_name;
	}

	public void setBo_name(String bo_name) {
		this.bo_name = bo_name;
	}

	public String getBo_code() {
		return bo_code;
	}

	public void setBo_code(String bo_code) {
		this.bo_code = bo_code;
	}

	public String getPk_bo() {
		return pk_bo;
	}

	public void setPk_bo(String pk_bo) {
		this.pk_bo = pk_bo;
	}

	public String getApp_id() {
		return app_id;
	}

	public void setApp_id(String app_id) {
		this.app_id = app_id;
	}

	public String getModifiedtiem() {
		return modifiedtiem;
	}

	public void setModifiedtiem(String modifiedtiem) {
		this.modifiedtiem = modifiedtiem;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}
	
}
