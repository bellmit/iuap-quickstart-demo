package com.yonyou.iuap.bpm.plustask.entity;


public class Type {
	String code;
	String name;
	Integer sort;

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

	public Type(String code, String name, Integer sort) {
		this.code = code;
		this.name = name;
		this.sort = sort;
	}
}
