package com.yonyou.iuap.bpm.entity.adpt.insthistory;

import java.sql.Timestamp;

import org.apache.commons.lang3.StringUtils;

import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;

/**
 * 流程实例历史查询返回值适配类
 * 
 * @author zhh
 *
 */
public class BpmProcInstHistroyAdpt {

	private String id;

	private String businessKey;

	private String processDefinitionId;

	private Timestamp startTime;

	private Timestamp endTime;

	private String startUserId;

	private String startActivityId;

	private String deleteReason;

	private String superProcessInstanceId;

	private String tenantId;

	private String state;

	private String name;

	private InstHistoryParticipant startParticipant;

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

	public String getProcessDefinitionId() {
		return processDefinitionId;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		if (StringUtils.isNotEmpty(startTime)) {
			this.startTime = CommonUtils.string2Timestamp(startTime);
		} else {
			this.startTime = null;
		}
	}

	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		if (StringUtils.isNotEmpty(endTime)) {
			this.endTime = CommonUtils.string2Timestamp(endTime);
		} else {
			this.endTime = null;
		}
	}

	public String getStartUserId() {
		return startUserId;
	}

	public void setStartUserId(String startUserId) {
		this.startUserId = startUserId;
	}

	public String getStartActivityId() {
		return startActivityId;
	}

	public void setStartActivityId(String startActivityId) {
		this.startActivityId = startActivityId;
	}

	public String getDeleteReason() {
		return deleteReason;
	}

	public void setDeleteReason(String deleteReason) {
		this.deleteReason = deleteReason;
	}

	public String getSuperProcessInstanceId() {
		return superProcessInstanceId;
	}

	public void setSuperProcessInstanceId(String superProcessInstanceId) {
		this.superProcessInstanceId = superProcessInstanceId;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public InstHistoryParticipant getStartParticipant() {
		return startParticipant;
	}

	public void setStartParticipant(InstHistoryParticipant startParticipant) {
		this.startParticipant = startParticipant;
	}

}
