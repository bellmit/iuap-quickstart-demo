package com.yonyou.iuap.bpm.entity.base;

import java.io.Serializable;

/**
 * 流程基本信息
 * 
 * @author zhh
 *
 */
public class BpmProcInfo implements Serializable {

	private static final long serialVersionUID = -2774599069990335152L;

	private String id;

	/**
	 * 流程名
	 */
	private String procName;

	/**
	 * 业务模型参照主键
	 */
	private String bizModelRefId;

	/**
	 * 模型主键
	 */
	private String categoryId;

	/**
	 * 描述
	 */
	private String description;

	/**
	 * 流程模型ID
	 */
	private String procModelId;

	/**
	 * 流程定义ID
	 */
	private String procDeployId;

	/**
	 * 流程定义KEY值
	 */
	private String procKey;

	private String procInstanceId;

	/**
	 * 流程定义ID
	 */
	private String procDefId;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProcName() {
		return procName;
	}

	public void setProcName(String procName) {
		this.procName = procName;
	}

	public String getBizModelRefId() {
		return bizModelRefId;
	}

	public void setBizModelRefId(String bizModelRefId) {
		this.bizModelRefId = bizModelRefId;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getProcModelId() {
		return procModelId;
	}

	public void setProcModelId(String procModelId) {
		this.procModelId = procModelId;
	}

	public String getProcDeployId() {
		return procDeployId;
	}

	public void setProcDeployId(String procDeployId) {
		this.procDeployId = procDeployId;
	}

	public String getProcKey() {
		return procKey;
	}

	public void setProcKey(String procKey) {
		this.procKey = procKey;
	}

	public String getProcDefId() {
		return procDefId;
	}

	public void setProcDefId(String procDefId) {
		this.procDefId = procDefId;
	}

    public String getProcInstanceId() {
        return procInstanceId;
    }

    public void setProcInstanceId(String procInstanceId) {
        this.procInstanceId = procInstanceId;
    }
}
