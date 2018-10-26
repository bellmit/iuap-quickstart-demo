package com.yonyou.iuap.bpm.entity.msgcfg;

public class MsgBpmRoleVO {
    private String id;

    private String code;

    private String name;
    
    private String buzientity_id;

   
	public String getId() {
    	
        return id;
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

	public void setId(String id) {
		this.id = id;
	}

	public String getBuzientity_id() {
		return buzientity_id;
	}

	public void setBuzientity_id(String buzientity_id) {
		this.buzientity_id = buzientity_id;
	}
   
}