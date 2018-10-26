package com.yonyou.iuap.bpm.plustask.entity;

import org.apache.commons.lang3.StringUtils;

import java.util.Map;

//{"senddate":"2016-06-24 15:05:40","approvestatus":0,"checkman":"0001ET10000000008N09","title":"吴学莉 通知单据\u003c1606240150\u003e 审批通过","sendername":"吴学莉","rn":1,"billno":"1606240150","id":"1017ET1000000000ZBNU"}
public class Task implements Comparable<Task> {
	String id;
	String usericon;
	String senderman;
	String flag;
	String sendername;
	String title;
	String note;
	String senddate;
	String system;
	String state;
	String ext;
	String detail;
	String userid;
	String usercode;
    Map<String ,String> exts;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsericon() {
		return usericon;
	}

	public void setUsericon(String usericon) {
		this.usericon = usericon;
	}

 
	public String getSenderman() {
		return senderman;
	}

	public void setSenderman(String senderman) {
		this.senderman = senderman;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public String getSendername() {
		return sendername;
	}

	public void setSendername(String sendername) {
		this.sendername = sendername;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

 
 

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getSenddate() {
		return senddate;
	}

	public void setSenddate(String senddate) {
		this.senddate = senddate;
	}

	public String getSystem() {
		return system;
	}

	public void setSystem(String system) {
		this.system = system;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getExt() {
		return ext;
	}

	public void setExt(String ext) {
		this.ext = ext;
	}
	
	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getUsercode() {
		return usercode;
	}

	public void setUsercode(String usercode) {
		this.usercode = usercode;
	}

	@Override
	public int compareTo(Task o) {
		if( StringUtils.isNotEmpty(this.getSenddate()) &&  StringUtils.isNotEmpty(o.getSenddate()) ){
			return o.getSenddate().compareTo(this.getSenddate());
		}
		if( StringUtils.isEmpty(this.getSenddate()) &&  StringUtils.isNotEmpty(o.getSenddate()) ){
			return -1;
		}
		if( StringUtils.isNotEmpty(this.getSenddate()) &&  StringUtils.isEmpty(o.getSenddate()) ){
			return 1;
		}
		return 0;
 
	}

	@Override
	public boolean equals(Object obj) {
		return super.equals(obj);
	}

	@Override
	public int hashCode() {
		return super.hashCode();
	}

	public Map<String, String> getExts() {
		return exts;
	}

	public void setExts(Map<String, String> exts) {
		this.exts = exts;
	}
}
