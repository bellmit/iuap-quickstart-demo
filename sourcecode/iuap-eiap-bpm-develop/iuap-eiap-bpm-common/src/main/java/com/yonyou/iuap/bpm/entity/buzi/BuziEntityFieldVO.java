package com.yonyou.iuap.bpm.entity.buzi;

import java.util.UUID;

import com.yonyou.iuap.bpm.entity.msgcfg.ConditionTypeVO;

public class BuziEntityFieldVO {
	private String id;
	private String buzientity_id;
	private String model_id;
	private String fieldcode;
	private String fieldname;
	private String fieldtype;
	private String typeoptions;
	private String defaultvalue;
	private ConditionTypeVO conditionType;

	public ConditionTypeVO getConditionType() {
		return conditionType;
	}

	public void setConditionType(ConditionTypeVO conditionType) {
		this.conditionType = conditionType;
	}

	public String getBuzientity_id() {
		return buzientity_id;
	}

	public void setBuzientity_id(String buzientity_id) {
		this.buzientity_id = buzientity_id;
	}

	public String getId() {
		if (id == null) {
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

	public String getFieldcode() {
		return fieldcode;
	}

	public void setFieldcode(String fieldcode) {
		this.fieldcode = fieldcode;
	}

	public String getFieldname() {
		return fieldname;
	}

	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}

	public String getFieldtype() {
		return fieldtype;
	}

	public void setFieldtype(String fieldtype) {
		this.fieldtype = fieldtype;
	}

	public String getTypeoptions() {
		return typeoptions;
	}

	public void setTypeoptions(String typeoptions) {
		this.typeoptions = typeoptions;
	}

	public String getDefaultvalue() {
		return defaultvalue;
	}

	public void setDefaultvalue(String defaultvalue) {
		this.defaultvalue = defaultvalue;
	}
}