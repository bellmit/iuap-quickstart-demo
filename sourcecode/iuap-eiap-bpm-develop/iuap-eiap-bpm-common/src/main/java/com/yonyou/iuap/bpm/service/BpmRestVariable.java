package com.yonyou.iuap.bpm.service;

import java.io.Serializable;

public class BpmRestVariable implements Serializable {

	private static final long serialVersionUID = 8903391191072621963L;
	public static final String BOOLEAN_VARIABLE_TYPE = "boolean";
	public static final String DATE_VARIABLE_TYPE = "date";
	public static final String DOUBLE_VARIABLE_TYPE = "double";
	public static final String INTEGER_VARIABLE_TYPE = "integer";
	public static final String LONG_VARIABLE_TYPE = "integer";
	public static final String SHORT_VARIABLE_TYPE = "short";
	public static final String STRING_VARIABLE_TYPE = "string";

	public static final String BYTE_ARRAY_VARIABLE_TYPE = "binary";
	public static final String SERIALIZABLE_VARIABLE_TYPE = "serializable";

	public enum RestVariableScope {
		LOCAL, GLOBAL
	};

	private String name;
	private String type;
	private RestVariableScope variableScope;
	private Object value;
	private String valueUrl;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public RestVariableScope getVariableScope() {
		return variableScope;
	}

	public void setVariableScope(RestVariableScope variableScope) {
		this.variableScope = variableScope;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getScope() {
		String scope = null;
		if (variableScope != null) {
			scope = variableScope.name().toLowerCase();
		}
		return scope;
	}

	public void setScope(String scope) {
		setVariableScope(getScopeFromString(scope));
	}

	public void setValueUrl(String valueUrl) {
		this.valueUrl = valueUrl;
	}

	public String getValueUrl() {
		return valueUrl;
	}

	public static RestVariableScope getScopeFromString(String scope) {
		if (scope != null) {
			for (RestVariableScope s : RestVariableScope.values()) {
				if (s.name().equalsIgnoreCase(scope)) {
					return s;
				}
			}
			throw new IllegalArgumentException("Invalid variable scope: '" + scope + "'");
		} else {
			return null;
		}
	}
}
