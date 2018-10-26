package com.yonyou.iuap.bpm.entity.adpt.taskints;

public class Activity {

	private String id;

	private String name;

	private String type;

	private ActivityProperties properties;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

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

	public ActivityProperties getProperties() {
		return properties;
	}

	public void setProperties(ActivityProperties properties) {
		this.properties = properties;
	}
}
