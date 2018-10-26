package com.yonyou.iuap.bpm.entity.adpt.taskints;

/**
 * @author zhh
 *
 */
public class Participant {
	
	private String id;
	
	private int priority;
	
	private String name;
	
	private String type;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getPriority() {
		return priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
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

}
