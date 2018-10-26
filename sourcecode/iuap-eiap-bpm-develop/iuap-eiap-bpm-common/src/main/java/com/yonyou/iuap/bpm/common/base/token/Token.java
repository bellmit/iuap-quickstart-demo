package com.yonyou.iuap.bpm.common.base.token;

import java.io.Serializable;
import java.util.Date;

public class Token implements Serializable{
	/** 
	* @Fields serialVersionUID : TODO(用一句话描述这个变量表示什么) 
	*/ 
	private static final long serialVersionUID = 1L;
	private String userId;//登录用户id  
    private Date expired; //过期时间  
    private Date lastOperate; // 最近一次操作的时间  
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Date getExpired() {
		return expired;
	}
	public void setExpired(Date expired) {
		this.expired = expired;
	}
	public Date getLastOperate() {
		return lastOperate;
	}
	public void setLastOperate(Date lastOperate) {
		this.lastOperate = lastOperate;
	}
}
