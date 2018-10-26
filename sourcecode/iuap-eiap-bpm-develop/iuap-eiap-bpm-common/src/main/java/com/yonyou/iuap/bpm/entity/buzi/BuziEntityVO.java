package com.yonyou.iuap.bpm.entity.buzi;

import java.util.List;
import java.util.UUID;

public class BuziEntityVO {
	private String id;
	private String model_id;
	private String formcode;
	private String formname;
	private String formdiscription;
	private String formurl;
	private List<BuziEntityFieldVO> fields;

	public List<BuziEntityFieldVO> getFields() {
		return fields;
	}

	public void setFields(List<BuziEntityFieldVO> fields) {
		this.fields = fields;
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

	public String getFormcode() {
		return formcode;
	}

	public void setFormcode(String formcode) {
		this.formcode = formcode;
	}

	public String getFormname() {
		return formname;
	}

	public void setFormname(String formname) {
		this.formname = formname;
	}

	public String getFormdiscription() {
		return formdiscription;
	}

	public void setFormdiscription(String formdiscription) {
		this.formdiscription = formdiscription;
	}

	public String getFormurl() {
		return formurl;
	}

	public void setFormurl(String formurl) {
		this.formurl = formurl;
	}

}