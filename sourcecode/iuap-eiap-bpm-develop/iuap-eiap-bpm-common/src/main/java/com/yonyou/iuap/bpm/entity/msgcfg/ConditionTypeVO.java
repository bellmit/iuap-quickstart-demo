package com.yonyou.iuap.bpm.entity.msgcfg;

import java.util.List;

public class ConditionTypeVO {
	private String id;

	private String code;

	private List<ConditionOperatorVO> operators;


	public List<ConditionOperatorVO> getOperators() {
		return operators;
	}

	public void setOperators(List<ConditionOperatorVO> operators) {
		this.operators = operators;
	}

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

}