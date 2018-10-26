package com.yonyou.iuap.bpm.entity.adpt.taskints;

public interface ICompleteReason {
	
	public String DELETED = "deleted";
	public String COMPLETED ="completed";
	public String WITHDRAW = "withdraw";
	public String DELETE = "delete";
	public String ACTIVITI_DELETED ="activiti_deleted";
	public String REJECT = "reject";
	public String POSTCOMPLETED = "postCompleted";
	
	public String DELETED_CN = "删除";
	public String COMPLETED_CN ="完成";
	public String WITHDRAW_CN = "弃审";
	public String DELETE_CN = "删除";
	public String ACTIVITI_DELETED_CN ="终止";
	public String REJECT_CN = "驳回";
	public String POSTCOMPLETED_CN = "连岗";

}
