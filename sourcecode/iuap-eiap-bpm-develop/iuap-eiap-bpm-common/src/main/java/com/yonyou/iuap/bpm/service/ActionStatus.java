package com.yonyou.iuap.bpm.service;



/**
 * 流程环节状态
 *
 */
public class ActionStatus {
	
	private boolean addsignAble;
	
	private boolean rejectAble;
	//
	private boolean delegateAble;
	
	private boolean assignAble;
	
	public ActionStatus(){
		addsignAble=false;
		rejectAble=false;
		delegateAble=false;
		assignAble=false;
	}
			

	public boolean isAddsignAble() {
		return addsignAble;
	}

	public void setAddsignAble(boolean addsignAble) {
		this.addsignAble = addsignAble;
	}

	public boolean isRejectAble() {
		return rejectAble;
	}

	public void setRejectAble(boolean rejectAble) {
		this.rejectAble = rejectAble;
	}

	public boolean isDelegateAble() {
		return delegateAble;
	}

	public void setDelegateAble(boolean delegateAble) {
		this.delegateAble = delegateAble;
	}

	public boolean isAssignAble() {
		return assignAble;
	}

	public void setAssignAble(boolean assignAble) {
		this.assignAble = assignAble;
	}
	
	
	

}
