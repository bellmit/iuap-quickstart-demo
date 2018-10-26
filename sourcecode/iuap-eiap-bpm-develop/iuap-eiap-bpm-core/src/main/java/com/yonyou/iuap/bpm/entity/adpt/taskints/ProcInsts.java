package com.yonyou.iuap.bpm.entity.adpt.taskints;

import java.sql.Timestamp;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;

/**
 * @author zhh
 *
 */
public class ProcInsts {

	private String id;

	private String name;

	private String tenantId;

	private String businessKey;

	private Timestamp startTime;

	private String processDefinitionId;

	private String startActivityId;

	private String startUserId;

	private Participant startParticipant;

	private List<Variables> variables;

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

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public String getBusinessKey() {
		return businessKey;
	}

	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
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

	public String getProcessDefinitionId() {
		return processDefinitionId;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public String getStartActivityId() {
		return startActivityId;
	}

	public void setStartActivityId(String startActivityId) {
		this.startActivityId = startActivityId;
	}

	public String getStartUserId() {
		return startUserId;
	}

	public void setStartUserId(String startUserId) {
		this.startUserId = startUserId;
	}

	public Participant getStartParticipant() {
		return startParticipant;
	}

	public void setStartParticipant(Participant startParticipant) {
		this.startParticipant = startParticipant;
	}

	public List<Variables> getVariables() {
		return variables;
	}

	public void setVariables(List<Variables> variables) {
		this.variables = variables;
	}

}
