package com.yonyou.iuap.bpm.entity.adpt;

import java.sql.Timestamp;

import com.yonyou.iuap.bpm.entity.base.BpmProcInfo;

/**
 * 流程定义基本信息适配
 * 
 * @author zhh
 *
 */
public class BpmProcInfoAdpt extends BpmProcInfo {

	private static final long serialVersionUID = -1099745022834458751L;
	
	private String version; 
	
	private Timestamp createTime;
	
	private Timestamp lastUpdateTime;
	
	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(Timestamp lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

}
