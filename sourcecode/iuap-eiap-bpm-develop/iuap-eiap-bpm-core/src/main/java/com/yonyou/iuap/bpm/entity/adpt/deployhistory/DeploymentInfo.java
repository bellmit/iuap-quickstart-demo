package com.yonyou.iuap.bpm.entity.adpt.deployhistory;

import java.io.Serializable;
import java.sql.Timestamp;

import com.yonyou.iuap.bpm.common.base.utils.CommonUtils;

/**
 * 部署基本信息
 * 
 * @author zhh
 *
 */
public class DeploymentInfo implements Serializable {

	private static final long serialVersionUID = 8788281230666081249L;

	private String id;

	private String name;

	private Timestamp deploymentTime;

	private String category;

	private String url;

	private String tenantId;

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

	public Timestamp getDeploymentTime() {
		return deploymentTime;
	}

	public void setDeploymentTime(String deploymentTime) {

		this.deploymentTime = CommonUtils.string2Timestamp(deploymentTime);
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

}
