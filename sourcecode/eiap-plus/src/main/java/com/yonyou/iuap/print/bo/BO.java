package com.yonyou.iuap.print.bo;

import java.util.List;

public class BO {
	private String bo_code;
	public String getBo_code() {
		return bo_code;
	}
	public void setBo_code(String bo_code) {
		this.bo_code = bo_code;
	}
	public String getBo_name() {
		return bo_name;
	}
	public void setBo_name(String bo_name) {
		this.bo_name = bo_name;
	}
	public List<BO_Attr> getBo_attrs() {
		return bo_attrs;
	}
	public void setBo_attrs(List<BO_Attr> bo_attrs) {
		this.bo_attrs = bo_attrs;
	}
	public List<Sub_Bo> getSub_bos() {
		return sub_bos;
	}
	public void setSub_bos(List<Sub_Bo> sub_bos) {
		this.sub_bos = sub_bos;
	}
	private String bo_name;
	private List<BO_Attr> bo_attrs;
	private List<Sub_Bo> sub_bos;
	
}
