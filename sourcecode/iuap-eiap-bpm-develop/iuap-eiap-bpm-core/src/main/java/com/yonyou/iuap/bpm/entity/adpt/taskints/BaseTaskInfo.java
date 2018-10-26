package com.yonyou.iuap.bpm.entity.adpt.taskints;

import java.sql.Timestamp;

import org.apache.commons.lang3.StringUtils;

import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;

/**
 * 历史任务实例
 * 
 * @author zhh
 *
 */
public class BaseTaskInfo {
	
	/**
	 * deleteReason
	 */
	
	private String deleteReason;

	public String getDeleteReason() {
		return deleteReason;
	}

	public void setDeleteReason(String deleteReason) {
		this.deleteReason = deleteReason;
	}

	/**
	 * 任务ID
	 */
	private String id;

	/**
	 * 任务名称
	 */
	private String name;

	/**
	 * 任务状态
	 */
	private String state;

	private String executionId;

	private boolean processFinished;

	/**
	 * 开始时间
	 */
	private Timestamp startTime;

	/**
	 * 结束时间
	 */
	private Timestamp endTime;

	/**
	 * 流程实例ID
	 */
	private String processInstanceId;

	/**
	 * 流程定义ID
	 */
	private String processDefinitionId;

	/**
	 * 到期时间
	 */
	private Timestamp dueDate;

	private String assignee;

	private boolean finished;

	private String url;

	/**
	 * 模型目录
	 */
	private String category;

	private String taskDefinitionKey;

	/**
	 * 流程定义名称
	 */
	private String processDefinitionName;
	
	private String taskComments;

	private Participant assigneeParticipant;

	private Activity activity;

	private Variables[] variables;

	private ProcInsts historicProcessInstance;

	public String getTaskComments() {
		if (getDeleteReason()==null){
			return "";
		}
		if(ICompleteReason.COMPLETED.equals(getDeleteReason())){
			taskComments = ICompleteReason.COMPLETED_CN;
		}else if (ICompleteReason.DELETED.equals(getDeleteReason())){
			taskComments = ICompleteReason.DELETED_CN;
		}else if (ICompleteReason.WITHDRAW.equals(getDeleteReason())){
			taskComments = ICompleteReason.WITHDRAW_CN;
		}else if (ICompleteReason.DELETE.equals(getDeleteReason())){
			taskComments = ICompleteReason.DELETE_CN;
		}else if (getDeleteReason().startsWith(ICompleteReason.REJECT)){
			taskComments = ICompleteReason.REJECT_CN;
		}else if (ICompleteReason.ACTIVITI_DELETED.equals(getDeleteReason()) || "ACTIVITI_DELETED".equals(getDeleteReason())){
			taskComments = ICompleteReason.ACTIVITI_DELETED_CN;
		} else if (ICompleteReason.POSTCOMPLETED.equals(getDeleteReason())){
			taskComments = ICompleteReason.POSTCOMPLETED_CN;
		}

		return taskComments;
	}

	public void setTaskComments(String taskComments) {
		this.taskComments = taskComments;
	}

	public Participant getAssigneeParticipant() {
		return assigneeParticipant;
	}

	public void setAssigneeParticipant(Participant assigneeParticipant) {
		this.assigneeParticipant = assigneeParticipant;
	}

	public Activity getActivity() {
		return activity;
	}

	public void setActivity(Activity activity) {
		this.activity = activity;
	}

	public Variables[] getVariables() {
		return variables;
	}

	public void setVariables(Variables[] variables) {
		this.variables = variables;
	}

	public ProcInsts getHistoricProcessInstance() {
		return historicProcessInstance;
	}

	public void setHistoricProcessInstance(ProcInsts historicProcessInstance) {
		this.historicProcessInstance = historicProcessInstance;
	}

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

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getExecutionId() {
		return executionId;
	}

	public void setExecutionId(String executionId) {
		this.executionId = executionId;
	}

	public boolean isProcessFinished() {
		return processFinished;
	}

	public void setProcessFinished(boolean processFinished) {
		this.processFinished = processFinished;
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

	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	public String getProcessDefinitionId() {
		return processDefinitionId;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public Timestamp getDueDate() {
		return dueDate;
	}

	public void setDueDate(String dueDate) {
		if (StringUtils.isNotEmpty(dueDate)) {
			this.dueDate = CommonUtils.string2Timestamp(dueDate);
		} else {
			this.dueDate = null;
		}
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	public boolean isFinished() {
		return finished;
	}

	public void setFinished(boolean finished) {
		this.finished = finished;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getTaskDefinitionKey() {
		return taskDefinitionKey;
	}

	public void setTaskDefinitionKey(String taskDefinitionKey) {
		this.taskDefinitionKey = taskDefinitionKey;
	}

	public String getProcessDefinitionName() {
		return processDefinitionName;
	}

	public void setProcessDefinitionName(String processDefinitionName) {
		 this.processDefinitionName = processDefinitionName;
	}
}
