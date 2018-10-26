package com.yonyou.iuap.bpm.plustask.entity;


public class State {
	String code;
	String name;
	Integer sort;
	String type;
	
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
	public Integer getSort() {
		return sort;
	}
	public void setSort(Integer sort) {
		this.sort = sort;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

	public State() {
	}

	public State(String code, String name, Integer sort, String type) {
		this.code = code;
		this.name = name;
		this.sort = sort;
		this.type = type;
	}
}
