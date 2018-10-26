package com.yonyou.iuap.bpm.entity.base;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * 流程模型实体
 * 
 * @author zhh
 *
 */
public class BpmProcModel implements Serializable {

	private static final long serialVersionUID = -6778607326718113489L;
	
	private String id;
	
	private String pid;
	
	private String name;
	
	private String code;
	
	private String isCatalog;
	
	private Timestamp createDate;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getIsCatalog() {
		return isCatalog;
	}

	public void setIsCatalog(String isCatalog) {
		this.isCatalog = isCatalog;
	}

	public Timestamp getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}
	
}
