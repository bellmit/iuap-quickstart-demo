package com.yonyou.iuap.bpm.entity.msgcfg;

/**
 * 通用VO，用于json转换
 * @author sxj
 *
 */

public class MsgGeneralVO {
    private String id;

    private String code;

    private String name;
    
    private String pid;

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
    
    
}