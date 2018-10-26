package com.yonyou.iuap.bpm.entity.msgcfg;

import java.util.UUID;

public class MsgBillRoleVO {
    private String id;

    private String model_id;

    private String roleref;
    
    private String userconverter;


	public String getUserconverter() {
		return userconverter;
	}

	public void setUserconverter(String userconverter) {
		this.userconverter = userconverter;
	}

	public String getId() {
    	if(id == null){
    		id = UUID.randomUUID().toString().replace("-", "");
    	}
        return id;
    }

	public void setId(String id) {
		this.id = id;
	}

	public String getModel_id() {
		return model_id;
	}

	public void setModel_id(String model_id) {
		this.model_id = model_id;
	}

	public String getRoleref() {
		return roleref;
	}

	public void setRoleref(String roleref) {
		this.roleref = roleref;
	}

	
}