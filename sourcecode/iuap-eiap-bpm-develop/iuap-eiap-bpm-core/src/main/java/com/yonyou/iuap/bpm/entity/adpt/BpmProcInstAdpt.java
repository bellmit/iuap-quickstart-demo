package com.yonyou.iuap.bpm.entity.adpt;

/**
 * 发起流程，流程成功发起，返回值适配类
 * 
 * @author zhh
 *
 */
public class BpmProcInstAdpt {
	
	/**
	 * 流程示例ID
	 */
	private String id;
	
	private String businessKey;
	
	private boolean suspended;
	
	private boolean ended;
	
	private String processDefinitionId;
	
	private  String activityId;
	
	private boolean completed;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}

	public boolean isSuspended() {
		return suspended;
	}

	public void setSuspended(boolean suspended) {
		this.suspended = suspended;
	}

	public boolean isEnded() {
		return ended;
	}

	public void setEnded(boolean ended) {
		this.ended = ended;
	}

	public String getProcessDefinitionId() {
		return processDefinitionId;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public String getActivityId() {
		return activityId;
	}

	public void setActivityId(String activityId) {
		this.activityId = activityId;
	}

}
